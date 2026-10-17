# Staging setup

Automatic updates go to the `staging` branch of https://github.com/AAAA-web-deploy/return2monke.git. That push publishes the static site through GitHub Pages at https://trogebob.world/. The domain is already attached to this repository's Pages site. This workflow does not change DNS, merge `main`, or mark the site as indexable.

`vercel.json` still turns off Vercel's own Git deployments. The Vercel preview workflow remains available once its secrets exist. A successful Git push is not itself a deployment. The live page is ready when the GitHub Pages workflow for that commit succeeds.

## One-time account steps

1. Sign in to GitHub on this computer for `AAAA-web-deploy/return2monke`. Use Git Credential Manager or the GitHub CLI. Do not paste a token into chat.
2. Author commits with your real Git identity when it is already configured. If `user.name` and `user.email` are not set, `npm run stage` uses the signed-in GitHub account that can push to this repository: its profile name, or its login, and its GitHub noreply address. It does not write Git config and it does not invent a person. A saved login that cannot push is not used for the push.

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

The `stop` hook in `.cursor/hooks.json` is a fallback for a finished Cursor task. It runs `npm run stage` when the checkout has something to publish and a sync is not already running. That command pushes `staging`, which publishes GitHub Pages.

## Production

Leave `deployment.productionEnabled` false. The Pages site sends `noindex` and `robots.txt` disallows crawling. Search indexing and a separate production launch remain off.
