# Automatic Git and temporary staging — implementation requirements

This document tells Cursor what to create. This prompts-and-assets kit includes no executable automation and has no active staging link.

## Required behavior

A completed Cursor task should trigger: content validation → TypeScript → appropriate tests → production build → commit → push staging → GitHub Actions → Vercel Preview deployment. Return the actual successful deployment URL and commit.

Run this after a completed task, not every keystroke. Include a manual npm run stage command for direct edits and a local-only dry-run command. Use project Cursor rules plus a completion hook supported by the installed Cursor version. Verify hook details in the official documentation during implementation.

## Repository and branch

- Exact repository: https://github.com/AAAA-web-deploy/return2monke.git
- Automatic update branch: staging
- Production branch reserved for later: main
- Future production domain: trogebob.world

Inspect before initializing or selecting a branch. Preserve existing commits, local edits and remotes. An extracted brief is not an existing Git clone. If the remote contains work, integrate the build with that history instead of creating an unrelated root commit. Refuse automatic sync from main, an unrelated branch or the wrong remote. Never force-push or discard work to resolve divergence.

## Sync script to build

Create scripts that validate the project root, exact remote and branch; reject private/unrelated files; prevent simultaneous syncs; check remote divergence; run checks before committing; commit only eligible project changes; and push staging. Keep a local ignored status report for failures and the last pushed SHA. Leave local work intact when checks or authentication fail. Exclude .env files, keys, node_modules, .next, .vercel credentials, local inboxes and logs from commits.

## Preview workflow to build

Use GitHub Actions on staging pushes, with manual dispatch restricted to staging. Use the Node version supported by the chosen Next.js release and deployment provider, install from the committed lockfile, validate, typecheck, test, pull Preview project settings, build and deploy a prebuilt Preview using the Vercel CLI.

Pin the CLI and Actions versions after verifying the current official documentation. Do not pass a production flag. Make this workflow the single automatic deployer by disabling duplicate provider Git deployments through supported project configuration. Prevent old concurrent builds from publishing over a newer staging update.

The required GitHub Actions secrets are VERCEL_TOKEN, VERCEL_ORG_ID and VERCEL_PROJECT_ID. Fail clearly if any is missing. Do not log secret values. Put the actual returned Preview URL in the workflow summary/environment with the deployed commit SHA. Do not invent a URL or infer success from a Git push alone.

## One-time owner setup after Cursor has created the app

1. Authenticate Git locally for the supplied repository. Use normal account sign-in or GitHub CLI on the user's computer; no plugin installation is needed.
2. Use the user's configured Git author identity. If missing, obtain their real identity rather than inventing one.
3. Create or select the intended Vercel staging project and link it using the ordinary CLI/account interface. Keep the application at the project root.
4. Set the three named repository Actions secrets using hidden input or the account's secret settings. Do not paste secret values into chat or commit them.
5. Enable repository Actions and trust the local Cursor workspace if required for its completion hook.
6. Run the generated staging command. Verify the workflow for that commit and open its actual Preview URL.

GitHub and Vercel plugins were declined for this request. Use available Git/CLI/account setup; do not propose those plugins again. If the user does not have an authenticated deployment account, preserve the built project and report that activation remains pending.

## Production

Keep staging noindex and avoid production publication, domain attachment, DNS changes or main merges during routine updates. Production requires a separate launch decision.

## Official implementation references

- https://cursor.com/docs/hooks
- https://nextjs.org/docs/app/getting-started/installation
- https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel
- https://vercel.com/docs/project-configuration/git-configuration
- https://vercel.com/docs/deployments/environments

These are documentation links for Cursor to verify while implementing. The kit does not assert an authenticated connection or deployed project.
