import { spawnSync } from "node:child_process";
import fs from "node:fs";

try {
  fs.readFileSync(0);
} catch {
  // Cursor closes stdin after the hook payload. An empty read is fine.
}

function git(args) {
  return spawnSync("git", args, { encoding: "utf8" });
}

const name = git(["config", "--get", "user.name"]).stdout?.trim();
const email = git(["config", "--get", "user.email"]).stdout?.trim();
const lockHeld = fs.existsSync(".cursor/.staging-sync/lock.json");

let shouldStage = false;
if (name && email && !lockHeld && !process.env.CURSOR_STAGE_FROM_HOOK) {
  if (!fs.existsSync(".git")) {
    shouldStage = true;
  } else {
    const status = git(["status", "--porcelain"]).stdout?.trim();
    const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]).stdout?.trim();
    if (status || branch !== "staging") {
      shouldStage = true;
    } else {
      const counts = git(["rev-list", "--left-right", "--count", "origin/staging...HEAD"]);
      shouldStage = counts.status !== 0 || !counts.stdout?.trim().startsWith("0");
    }
  }
}

if (shouldStage) {
  spawnSync("npm", ["run", "stage"], {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, CURSOR_STAGE_FROM_HOOK: "1" },
  });
}

process.stdout.write("{}\n");
