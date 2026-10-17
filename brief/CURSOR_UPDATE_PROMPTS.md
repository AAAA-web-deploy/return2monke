# Cursor prompts for later updates

Use these after the initial build. Replace bracketed values with supplied information. They refer to the application structure created by the master build prompt. Prompt 2 replaces imagery, Prompt 3 adds token/community details, Prompt 4 changes facts/copy, Prompt 5 activates staging, and Prompt 6 reviews the finished page.

## Prompt 2 — Replace or add an image

```text
Apply an image-only update to the approved Next.js website.
Read brief/UPDATE_MAP.md and the existing asset manifest first.

Target section: [hero / header logo / history year / reaction / social preview]
Stable asset ID: [ID from config/assets.json]
New file: [attached file or local project path]
Alt text: [description of the actual image]
Desktop focus: [percentage, or preserve]
Mobile focus: [percentage, or preserve]
Other requested changes: [none, unless explicitly specified]

Inspect the image. Preserve alpha where applicable. Add a versioned file to
public/images and retain the source original under artwork/originals. Update
only the corresponding manifest entry and any specifically required references.
Record actual dimensions and bump its version. If updating the brand logo,
update the separate favicon asset as appropriate without changing meme faces.

Preserve headings, facts, token data, section order and layout. Confirm all
consumers of this asset ID, mobile framing, loading, and any exported meme use.
Run verification and npm run stage. Report the changed asset ID/sections,
commit and verified staging URL, or the exact remote-access blocker.
```

## Prompt 3 — Incorporate token or community information

```text
Update the existing website using only these confirmed details:
Token name: [value or not supplied]
Ticker: [value or not supplied]
Network / chain ID: [value or not supplied]
Token contract: [value or not supplied]
Pair address: [value or not supplied]
Chart URL: [value or not supplied]
Buy URL: [value or not supplied]
Explorer URL: [value or not supplied]
X URL: [value or not supplied]
Telegram URL: [value or not supplied]
Supply / tax / liquidity facts: [exact supplied facts, otherwise not supplied]
Status: [unannounced / announced / live, only if confirmed]

Read brief/UPDATE_MAP.md. Edit config/site.json. Keep unsupplied fields unchanged
or null. Never substitute a pair address for a token contract. Verify that each
provided link and address belongs to the intended network and project before
presenting it as verified. Do not infer relationships from similar names.

Ensure the relevant header, hero description, token desk, enabled buttons,
contract-copy control and metadata use the single updated data source.
If a newly supplied field needs a visible row, add only that bounded row.
Preserve the approved design and original artwork.

Run verification and npm run stage. Report every field and visible section
changed, what remains pending, the commit, and actual staging deployment result.
```

## Prompt 4 — Update a fact or page passage

```text
Apply this bounded content update:
Section / edition year: [target]
New information or replacement text: [content]
Source URL, if factual: [source]
Verification date: [date]

For normal page copy, edit the matching key in content/copy.json. For historical
information, edit the existing record for the specified year in history.json;
add a new edition only if that is explicitly requested and sourced. Keep real
facts and the fictional ape joke in separate fields. Reconcile conflicting
sources before changing a factual claim. Preserve unrelated years and text.

Check resulting text length, wrapping, chronological order and source links.
Preserve the page layout and artwork. Run verification and npm run stage.
Report the precise passage changed and the verified staging result.
```

## Prompt 5 — Activate or repair automatic staging

```text
Read brief/STAGING_REQUIREMENTS.md and inspect the generated workflow, Cursor hook,
Git branch, remote, and .cursor/.staging-sync/last-result.json if present.
Finish the one-time authenticated GitHub/Vercel Preview setup for
AAAA-web-deploy/return2monke. Work only on staging.

Use account login interfaces or hidden secret input when user action is needed.
Do not ask for tokens in chat. Configure the three documented Actions secrets
and select the correct Vercel project. Keep the CLI workflow as the sole
automatic deployer; do not enable a second Git deployment path.

Run npm run stage:check, then npm run stage. Inspect the matching Actions run
until success/failure. Return its actual Preview URL and commit SHA.
Do not attach trogebob.world, change DNS, use --prod, merge main, or force-push.
If a platform permission blocks activation, preserve the complete prepared
configuration and identify the exact account action required.
```

## Prompt 6 — Final visual and interaction review

```text
Review the existing approved design; do not redesign it.
Inspect desktop and mobile layouts, including 320 px width. Check all images,
focus states, reduced motion, timeline selections, reaction/caption combinations,
PNG export after rapid switching, pending/active links, contract copying,
metadata and staging noindex. Verify the character's face is not cropped poorly.

Fix observed issues only. Keep token claims and historical facts unchanged.
Run verification, push staging with npm run stage, and verify its deployment.
Report the fixes, checks, commit SHA and actual staging URL.
```
