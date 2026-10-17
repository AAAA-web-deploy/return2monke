# Staging setup

Automatic deploys go to the `staging` branch of https://github.com/AAAA-web-deploy/return2monke.git. The GitHub Actions workflow builds a Vercel Preview. It does not deploy production, attach `trogebob.world`, or merge `main`.

`vercel.json` turns off Vercel's Git deployments so this workflow is the only automatic deployer. A successful Git push is not itself a deployment. The preview URL is the URL printed by the successful Actions run.

## One-time account steps

1. Sign in to GitHub on this computer for `AAAA-web-deploy/return2monke`. Use Git Credential Manager or the GitHub CLI. Do not paste a token into chat.
2. Set your real Git author name and email. This repository will not invent one:

   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "you@example.com"
   ```

3. In Vercel, create or select the staging project with the application at the repository root. Link it with the Vercel CLI (`vercel login`, then `vercel link`). That writes `.vercel/project.json` locally. That folder stays uncommitted.
4. Add these repository Actions secrets in GitHub settings, using hidden input. Do not put the values in a file or in chat:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
5. Enable GitHub Actions for the repository. If Cursor asks, trust this workspace so the completion hook in `.cursor/hooks.json` can run.
6. Run `npm run stage`.
7. Open the Actions run for that commit and use the preview URL in its summary. Put that URL in `config/site.json` under `deployment.stagingUrl` only after you have opened it. Until a real host is known, social preview images stay out of the metadata so a build cannot publish `localhost` URLs.

## What the local command does

`npm run stage` validates content, typechecks, tests, builds, commits eligible files, and pushes `staging`. It refuses another branch, another remote, a force-push, a dirty secret, or a remote that has commits you do not have. Failures are written to `.cursor/.staging-sync/last-result.json`, which is not committed. Local work is left in place.

`npm run stage:check` runs the same checks and prints what would be committed.

The `stop` hook in `.cursor/hooks.json` is a fallback for a finished Cursor task. It does nothing when Git identity is missing or a sync is already running.

## Production

Leave `deployment.productionEnabled` false. Staging pages send `noindex` and `robots.txt` disallows crawling. Publishing `trogebob.world` is a separate decision.
