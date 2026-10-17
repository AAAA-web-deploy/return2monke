import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dryRun = process.argv.includes("--dry-run");
const requiredRemote = "https://github.com/AAAA-web-deploy/return2monke.git";
const reportDir = path.join(root, ".cursor", ".staging-sync");
const lockPath = path.join(reportDir, "lock.json");
const reportPath = path.join(reportDir, "last-result.json");
let lockHeld = false;

function writeReport(report) {
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}

function releaseLock() {
  if (!lockHeld) return;
  try {
    const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
    if (lock.pid === process.pid) fs.unlinkSync(lockPath);
  } catch {
    // The report is the source of truth if the lock file is already gone.
  }
  lockHeld = false;
}

function fail(message, extra = {}) {
  writeReport({ ok: false, dryRun, at: new Date().toISOString(), error: message, ...extra });
  console.error(message);
  releaseLock();
  process.exit(1);
}

function succeed(extra = {}) {
  writeReport({ ok: true, dryRun, at: new Date().toISOString(), ...extra });
  releaseLock();
}

function run(command, args, options = {}) {
  return spawnSync(command, args, { cwd: root, encoding: "utf8", ...options });
}

function redact(text) {
  return String(text || "")
    .replace(/x-access-token:[^@\s]+@/gi, "x-access-token:***@")
    .replace(/\b(gh[opusr]_|github_pat_)[A-Za-z0-9_]+/g, "$1***");
}

function git(args, allowFailure = false) {
  const result = run("git", args, { env: { ...process.env, GIT_TERMINAL_PROMPT: "0" } });
  const stdout = redact((result.stdout || "").trim());
  const stderr = redact((result.stderr || "").trim());
  if (result.status !== 0 && !allowFailure) {
    throw new Error(stderr || stdout || `git ${args.join(" ")} failed`);
  }
  return { status: result.status ?? 1, stdout, stderr };
}

function isAuthFailure(result) {
  return /authentication failed|permission denied|invalid credentials|could not read Username|terminal prompts disabled|403/i.test(
    `${result.stderr}\n${result.stdout}`,
  );
}

function deployToken() {
  const fromWindows = readWindowsDeployToken();
  if (fromWindows) return fromWindows;
  const fromEnv = (process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "").trim();
  if (/^(ghp_|gho_|ghu_|ghs_|ghr_|github_pat_)/.test(fromEnv)) return fromEnv;
  return "";
}

function readWindowsDeployToken() {
  if (process.platform !== "win32") return "";
  const script = `
$ErrorActionPreference = 'Stop'
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public class ApeFestCred {
  [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
  public struct CREDENTIAL {
    public uint Flags;
    public uint Type;
    public string TargetName;
    public string Comment;
    public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
    public uint CredentialBlobSize;
    public IntPtr CredentialBlob;
    public uint Persist;
    public uint AttributeCount;
    public IntPtr Attributes;
    public string TargetAlias;
    public string UserName;
  }
  [DllImport("advapi32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
  public static extern bool CredRead(string target, uint type, uint reservedFlag, out IntPtr credential);
  [DllImport("advapi32.dll")]
  public static extern void CredFree(IntPtr cred);
}
'@
$ptr = [IntPtr]::Zero
if (-not [ApeFestCred]::CredRead('gh:github.com:AAAA-web-deploy', 1, 0, [ref]$ptr)) { exit 2 }
$cred = [Runtime.InteropServices.Marshal]::PtrToStructure($ptr, [type][ApeFestCred+CREDENTIAL])
$bytes = New-Object byte[] $cred.CredentialBlobSize
[Runtime.InteropServices.Marshal]::Copy($cred.CredentialBlob, $bytes, 0, $cred.CredentialBlobSize)
[ApeFestCred]::CredFree($ptr)
$utf8 = [Text.Encoding]::UTF8.GetString($bytes).Trim([char]0)
$utf16 = [Text.Encoding]::Unicode.GetString($bytes).Trim([char]0)
if ($utf8 -match '^(ghp_|gho_|ghu_|ghs_|ghr_|github_pat_)') { [Console]::Out.Write($utf8) }
elseif ($utf16 -match '^(ghp_|gho_|ghu_|ghs_|ghr_|github_pat_)') { [Console]::Out.Write($utf16) }
`;
  const result = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], { encoding: "utf8" });
  const token = (result.stdout || "").trim();
  return /^(ghp_|gho_|ghu_|ghs_|ghr_|github_pat_)/.test(token) ? token : "";
}

function authedGit(args, token) {
  const url = `https://x-access-token:${token}@github.com/AAAA-web-deploy/return2monke.git`;
  const result = run("git", ["-c", "credential.helper=", ...args.flatMap((arg) => (arg === "<url>" ? [url] : [arg]))], {
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  });
  return {
    status: result.status ?? 1,
    stdout: redact((result.stdout || "").trim()),
    stderr: redact((result.stderr || "").trim()),
  };
}

function fetchStaging() {
  const plain = git(["fetch", "origin", "staging"], true);
  if (plain.status === 0 || /couldn't find remote ref|not found/i.test(`${plain.stderr} ${plain.stdout}`)) return plain;
  const token = deployToken();
  if (!token || !isAuthFailure(plain)) return plain;
  return authedGit(["fetch", "<url>", "+refs/heads/staging:refs/remotes/origin/staging"], token);
}

function pushStaging() {
  const plain = git(["push", "-u", "origin", "HEAD:staging"], true);
  if (plain.status === 0) return plain;
  const token = deployToken();
  if (!token || !isAuthFailure(plain)) return plain;
  const pushed = authedGit(["push", "<url>", "HEAD:staging"], token);
  if (pushed.status === 0) {
    git(["update-ref", "refs/remotes/origin/staging", "HEAD"]);
    git(["branch", "--set-upstream-to=origin/staging"]);
  }
  return pushed;
}

function normalizeRemote(url) {
  return url.trim().replace(/\.git$/i, "").replace(/\/$/, "").toLowerCase();
}

function acquireLock() {
  fs.mkdirSync(reportDir, { recursive: true });
  if (fs.existsSync(lockPath)) {
    try {
      const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
      let alive = false;
      try {
        process.kill(lock.pid, 0);
        alive = true;
      } catch {
        alive = false;
      }
      const age = Date.now() - Date.parse(lock.startedAt);
      if (alive && age < 20 * 60 * 1000) {
        fail(`Another staging sync is already running (pid ${lock.pid}).`);
      }
    } catch {
      // Replace an unreadable lock.
    }
  }
  fs.writeFileSync(lockPath, `${JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() })}\n`);
  lockHeld = true;
}

function npmScript(script) {
  const result = run("npm", ["run", script], { stdio: "inherit", shell: true });
  if (result.status !== 0) fail(`npm run ${script} failed.`);
}

function identity() {
  const name = git(["config", "--get", "user.name"], true).stdout;
  const email = git(["config", "--get", "user.email"], true).stdout;
  return { name, email };
}

function githubAuthor(token) {
  const result = run(process.execPath, [
    "--input-type=module",
    "-e",
    "const token = process.env.APEFEST_STAGE_TOKEN; const response = await fetch('https://api.github.com/user', { headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'User-Agent': 'apefest-stage' } }); if (!response.ok) process.exit(1); const profile = await response.json(); const name = String(profile.name || profile.login || '').trim(); const email = String(profile.email || '').trim() || (profile.id && profile.login ? profile.id + '+' + profile.login + '@users.noreply.github.com' : ''); if (!name || !email) process.exit(1); process.stdout.write(JSON.stringify({ name, email }));",
  ], { env: { ...process.env, APEFEST_STAGE_TOKEN: token } });
  if (result.status !== 0) return null;
  try {
    const profile = JSON.parse(result.stdout || "");
    if (!profile.name || !profile.email) return null;
    return profile;
  } catch {
    return null;
  }
}

function resolveAuthor() {
  const configured = identity();
  if (configured.name && configured.email) return configured;
  const token = deployToken();
  if (!token) return configured;
  return githubAuthor(token) || configured;
}

function assertProject() {
  if (!fs.existsSync(path.join(root, "package.json")) || !fs.existsSync(path.join(root, "config", "site.json"))) {
    fail("Run staging from the project root that contains package.json and config/site.json.");
  }
  const site = JSON.parse(fs.readFileSync(path.join(root, "config", "site.json"), "utf8"));
  if (normalizeRemote(site.deployment?.repository || "") !== normalizeRemote(requiredRemote)) {
    fail(`config/site.json repository must stay ${requiredRemote}.`);
  }
  if (site.deployment?.stagingBranch !== "staging" || site.deployment?.productionBranch !== "main") {
    fail("Staging sync only runs for the staging branch. main is reserved and will not be updated.");
  }
  return site;
}

function assertRepository() {
  const hasGit = fs.existsSync(path.join(root, ".git"));
  if (!hasGit) return { hasGit, branch: null };
  let remote = "";
  try {
    remote = git(["remote", "get-url", "origin"]).stdout;
  } catch {
    fail(`This repository must use origin ${requiredRemote}.`);
  }
  if (normalizeRemote(remote) !== normalizeRemote(requiredRemote)) {
    fail(`Refusing to sync. origin is ${remote}, expected ${requiredRemote}.`);
  }
  const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]).stdout;
  if (branch !== "staging") {
    fail(`Refusing to sync from ${branch}. Check out staging. Automatic sync does not run from main.`);
  }
  const fetched = fetchStaging();
  if (fetched.status !== 0 && !/couldn't find remote ref|not found/i.test(`${fetched.stderr} ${fetched.stdout}`)) {
    fail(`Could not fetch origin/staging. ${fetched.stderr || fetched.stdout}`);
  }
  const remoteRef = git(["rev-parse", "--verify", "origin/staging"], true);
  if (remoteRef.status === 0) {
    const counts = git(["rev-list", "--left-right", "--count", "HEAD...origin/staging"]).stdout.split(/\s+/);
    const behind = Number(counts[1] || 0);
    if (behind > 0) {
      fail("staging has remote commits that are not in this checkout. Pull and reconcile them. This script will not force-push or discard work.");
    }
  }
  return { hasGit, branch };
}

function runChecks() {
  npmScript("validate");
  npmScript("typecheck");
  npmScript("test");
  npmScript("build");
}

function commitMessage(files) {
  const onlyContent = files.every((file) => file.startsWith("config/site.json") || file.startsWith("content/"));
  const onlyAssets = files.every((file) => file.startsWith("public/images/") || file.startsWith("artwork/") || file === "config/assets.json");
  if (onlyContent) return "Update site content from the approved sources.";
  if (onlyAssets) return "Update versioned artwork in the asset manifest.";
  return "Update the ApeFest arrival page.";
}

function assertCleanCommit(files) {
  const forbidden = /(\.env($|\.))|(^|\/)node_modules\/|(^|\/)\.next\/|(^|\/)\.vercel\/|\.pem$|id_rsa|credentials\.json|\.cursor\/\.staging-sync/i;
  const blocked = files.filter((file) => forbidden.test(file));
  if (blocked.length > 0) {
    git(["reset", "-q", "--", ...blocked], true);
    fail(`Refusing to commit private or generated files: ${blocked.join(", ")}`);
  }
  const diff = git(["diff", "--cached", "--unified=0"]).stdout;
  if (/BEGIN [A-Z ]*PRIVATE KEY/.test(diff) || /VERCEL_TOKEN\s*[:=]\s*(?!\$\{\{)\S+/.test(diff)) {
    git(["reset", "-q"], true);
    fail("Refusing to commit a secret value.");
  }
}

try {
  assertProject();
  acquireLock();
  const repo = assertRepository();
  runChecks();
  const author = resolveAuthor();
  if (!author.name || !author.email) {
    fail("Git author identity is not configured, and this computer has no GitHub account that can push to AAAA-web-deploy/return2monke. Sign in to that GitHub account, or set git config user.name and git config user.email, then run npm run stage again. This project will not invent an identity.");
  }
  if (dryRun) {
    const status = repo.hasGit ? git(["status", "--porcelain"], true).stdout : "Repository is not initialized yet.";
    console.log("Dry run complete. Checks passed. No commit or push was made.");
    if (status) console.log(status);
    succeed({ sha: repo.hasGit ? git(["rev-parse", "HEAD"], true).stdout || null : null, pushed: false });
    process.exit(0);
  }

  if (!repo.hasGit) {
    const remote = run("git", ["ls-remote", "--heads", requiredRemote]);
    if (remote.status !== 0) {
      fail(`Could not read ${requiredRemote}. Sign in to GitHub for this repository, then run npm run stage again. ${remote.stderr || ""}`.trim());
    }
    if (remote.stdout.trim()) {
      fail("The remote already has commits. Clone it and integrate this build instead of creating a second history.");
    }
    const init = git(["init", "-b", "staging"]);
    if (init.status !== 0) fail(init.stderr);
    git(["remote", "add", "origin", requiredRemote]);
  }

  git(["add", "-A"]);
  const files = git(["diff", "--cached", "--name-only"]).stdout.split(/\r?\n/).filter(Boolean);
  if (files.length === 0) {
    const remoteRef = git(["rev-parse", "--verify", "origin/staging"], true);
    const ahead = remoteRef.status === 0
      ? Number(git(["rev-list", "--left-right", "--count", "HEAD...origin/staging"]).stdout.split(/\s+/)[0] || 0)
      : 1;
    if (ahead > 0) {
      const pushed = pushStaging();
      if (pushed.status !== 0) fail(`Push failed. Local work is unchanged. ${pushed.stderr || pushed.stdout}`);
    }
    const sha = git(["rev-parse", "HEAD"]).stdout;
    console.log(`Nothing new to commit. staging is at ${sha}.`);
    succeed({ sha, pushed: true });
    process.exit(0);
  }

  assertCleanCommit(files);
  const committed = git(["-c", `user.name=${author.name}`, "-c", `user.email=${author.email}`, "commit", "-m", commitMessage(files)]);
  if (committed.status !== 0) fail(`Commit failed. Local work is still in the working tree. ${committed.stderr}`);
  const pushed = pushStaging();
  if (pushed.status !== 0) {
    fail(`Commit succeeded locally, but the push to staging failed. Local work was not discarded. ${pushed.stderr || pushed.stdout}`);
  }
  const sha = git(["rev-parse", "HEAD"]).stdout;
  console.log(`Pushed staging at ${sha}. That push publishes GitHub Pages at https://trogebob.world/ when the Pages workflow succeeds.`);
  succeed({ sha, pushed: true });
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
