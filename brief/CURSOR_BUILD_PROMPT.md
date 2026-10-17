# Cursor master build prompt

Act as the developer implementing this approved website design. Build the website code in Cursor using this brief and the supplied assets.

## Read before editing

Read DESIGN_SPEC.md, RESEARCH_NOTES.md, UPDATE_MAP.md, STAGING_REQUIREMENTS.md, BUILD_CHECKLIST.md, assets/ASSET_GUIDE.md, and every JSON file under reference-data/, all relative to this brief folder. Inspect the actual hero, souvenir, and reaction images. Treat reference-data as content specifications, not existing running application code.

First inspect the workspace, existing Git history, branch, remote, and local changes. Preserve existing user work. If the repository already has source, integrate this design with it. If it is empty, create a Next.js App Router application with TypeScript and React. Use a supported stable Next.js release, verify compatibility in official documentation, and commit its dependency lockfile. Preserve brief/. If scaffolding rejects a nonempty folder, scaffold in a temporary child directory and merge only new application files without overwriting the brief or existing user files. The final application should run from the project root.

## Outcome and audience

Create an original illustrated landing page about an endearingly deadpan brown ape arriving in Charleston with an absurdly overpacked yellow suitcase. Its souvenirs explain six editions of ApeFest. A newcomer should understand the visual joke immediately; an ApeFest fan should recognize the cultural references through short sourced explanations.

Use clear American English. Give U.S. visitors useful Charleston context and explicit Eastern/Pacific event times. Keep confirmed token information accessible through the header and token desk. Never assume that an American event location guarantees token interest or trading demand.

Do not infer a token name or ticker from return2monke or trogebob.world. Preserve null values for missing name, ticker, network, contract, pair, trading and social links. An incomplete field stays visibly pending or its action is omitted.

## Page structure and art direction

Implement five sections in this order:

1. Arrival hero: a compact header with original character logo, simple anchor navigation and a token-details action. Show the supplied hero prominently, with the ape and suitcase visible on the right on desktop and short readable copy in its quiet left area. Add a brief premise and two actions: unpack the story and view token details. On narrow screens, crop the scene to preserve the ape and suitcase, then stack copy and actions clearly. Keep text and controls in HTML.
2. Culture: introduce ApeFest and expand BAYC as Bored Ape Yacht Club on first use. Explain music, art, style, and people with one concise passage per theme. Use playful paper/ticket details within one coherent visual system. The explanation should make sense without NFT knowledge.
3. History: six dated souvenir choices for 2021 through 2026. Each choice updates the city, chapter title, real fact, fictional ape reaction, souvenir image, and official source link together. Use the exact initial records in reference-data/history.json. Keep fiction visually distinct from sourced history. All years must be discoverable on mobile.
4. Meme station: three original expressions and three initial captions from reference-data/memes.json. Let visitors choose the expression and caption and save the selected composition as a PNG. The export needs no wallet, account, or server upload. Use same-origin deployment images, wait for fonts/images, and prevent a rapid selection change from downloading a previous composition. Disable export until the current selection is rendered.
5. Token desk/community: show the confirmed name, ticker, network, full contract, separate pair address, supply, tax/liquidity facts, and trading/community links when supplied. Keep missing information pending. Enable contract copying only with a real address and show a readable fallback when clipboard access fails. Never substitute the pair address for the token contract. Use an explicit independence statement in the footer.

Preserve the warm cream #F6EAD5 background, midnight ink #16202B, coral #FF693C, yellow #F7C84A, and petrol teal #296F73. Use Barlow Condensed or an equivalent bold condensed display face for headings, and DM Sans or an equivalent readable body face. Use hand-inked art, tactile paper edges, luggage tags, modest tilts, and print texture to connect the sections. Follow DESIGN_SPEC.md for spacing and mobile behavior.

Use the hero itself as the scene. Do not cover the character with a large generic text panel. Avoid unrelated neon styling, unrequested dark themes, fake dashboards, fabricated charts, or repetitive card grids.

## Asset handling

Copy brief/assets/web files into public/images using their existing names. Preserve the source PNGs under artwork/originals or another documented source-art directory. Use reference-data/assets.json as the initial config/assets.json manifest: its /images paths refer to the destination public/images directory.

Use stable asset IDs in components. Record actual dimensions, alt text, version, and the supplied independent desktop/mobile hero focal points. Use next/image, responsive sizes and reserved dimensions. Preserve cutout transparency. Preload only the necessary hero. Do not redraw the character or substitute unrelated stock art.

The initial brand-logo is a provisional use of the deadpan character image. Keep the brand-logo ID separate from reaction-deadpan so a later logo replacement does not replace a meme face. Keep the favicon separate too.

## Editable content contract

Create the following content sources, initialized from the matching reference-data files:

- config/site.json: identity, token fields/status, community links, event logistics, SEO and deployment identifiers.
- config/assets.json: every artwork path, dimension, alt text, version, and hero crop.
- content/copy.json: headings and normal section explanations.
- content/history.json: chronological edition records, fact, fictional joke, source URL and verification date.
- content/memes.json: reaction IDs and caption choices.

Render every relevant section from these sources; do not duplicate names, contracts, event dates, or URLs inside components. Add content validation for invalid references, missing files, invalid date order, duplicate/nonchronological years, malformed URLs, and incomplete live-token fields. Live status requires confirmed name, ticker, network, contract and chart URL, while announced/unannounced states can remain incomplete. This is a completeness rule, not an on-chain safety claim.

Implement UPDATE_MAP.md as a real maintenance contract. A future image-only update should change one manifest entry and a versioned asset. A token-information update should update every consumer of the corresponding config field. Preserve the approved layout for bounded content updates.

## Interaction, responsiveness and accessibility

Make the unpack-story action lift the supplied souvenir layers near the suitcase and guide the visitor to the historical section using normal scrolling. Use subtle object motion and shadows. Respect prefers-reduced-motion and eliminate nonessential animation when enabled. Do not use scroll hijacking or autoplay sound.

History choices must be semantic buttons or accessible tabs with a visible selected state and keyboard support. Do not put essential information behind hover. Give all controls visible focus, accessible names, generous touch targets, and readable contrast. Keep addresses wrap-safe. Check at 320, 390, 768, 1024 and 1440 px without horizontal overflow or poor face cropping.

Derive event status from the event timestamps if showing a countdown or time-sensitive label. Distinguish event time from any token launch time. Do not add artificial urgency, invented prices/volume/holders, promised returns, unsupported tokenomics, partnerships, admission rights, or BAYC membership claims.

## Git and staging automation to implement

Create the automation described in STAGING_REQUIREMENTS.md. Bind it to https://github.com/AAAA-web-deploy/return2monke.git and the staging branch. Use ordinary Git, GitHub Actions and a Vercel Preview CLI workflow; no GitHub or Vercel plugins are required.

After a completed Cursor task, run content/type checks, meaningful tests and the production build, then commit and push eligible project changes to staging. Add project Cursor rules and a supported completion hook as fallback, checking the current official Cursor hook documentation. Include a manual npm run stage command and dry-run equivalent. Prevent concurrent sync operations and record a useful local failure report.

Never force-push, discard user changes, commit secrets or build output, auto-merge main, or publish production as part of staging. Keep trogebob.world recorded for a later production decision. A successful push is not proof of deployment. Return the actual URL from the matching successful deployment run.

If account login, repository permission, Git identity, or a deployment secret is missing, complete all independent implementation work and preserve it. Identify the exact one-time account action. Use account login interfaces and hidden secret input; never request secret values in chat.

## Verification and handoff

Install dependencies and run content validation, typechecking, necessary tests and the Next.js production build. Use the browser available in Cursor to review the actual page at the listed widths. Test every history selection, all initial expression/caption combinations, rapid switching/export, contract copying, pending/enabled links, keyboard focus, reduced motion, metadata and staging noindex behavior. Fix observed failures instead of weakening checks.

Create clear local run instructions, the final update map, and staging setup instructions. Finish the authorized staging sync when authentication permits. Report: implemented sections; editable files; tests and browser review completed; pending information; commit SHA; verified staging URL or the exact blocker. Do not claim deployment or browser validation that did not occur.
