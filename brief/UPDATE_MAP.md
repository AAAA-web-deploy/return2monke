# Future update map

Cursor must create this editable structure during the initial build. The paths below refer to that future application. The matching initial values are supplied in brief/reference-data/.

Change the smallest applicable content file. Components render from these files so a single value can update all relevant locations.

| Information supplied later | Edit here | Affected areas |
|---|---|---|
| Token name | config/site.json → identity.name | Header, token desk, page title fallback, social-preview title |
| Ticker | config/site.json → identity.ticker | Header and token desk |
| Short project explanation | config/site.json → identity.description | Hero and announced-token introduction |
| Logo image | config/assets.json → brand-logo | Header; regenerate the separate favicon asset when appropriate |
| Hero image | config/assets.json → hero-arrival | Main scene and default social preview |
| Hero cropping | Same asset → desktopFocus / mobileFocus | Desktop/mobile hero composition independently |
| Headline or page explanations | content/copy.json | Corresponding named section only |
| Network and chain ID | config/site.json → token.network / chainId | Token desk and address validation context |
| Token contract | config/site.json → token.contractAddress | Full displayed address and copy button |
| Pair address | config/site.json → token.pairAddress | Separate pair field; never substitute it for the token contract |
| Chart / buy / explorer | config/site.json → token.*Url | Enabled token actions and explorer link |
| X / Telegram | config/site.json → community | Community buttons |
| Supply | config/site.json → token.totalSupply | Token desk after confirmation |
| Tax / liquidity facts | config/site.json → token.taxInfo / liquidityInfo | Automatically reveals concise token-desk rows when confirmed; never turn them into unsupported badges |
| Event location and time | config/site.json → event | Hero context, edition context, event-time display |
| Real historical fact | content/history.json → record with matching year | History text, source, verification date |
| Fictional historical joke | Same record → joke | Fictional character line only |
| Souvenir illustration | config/assets.json → souvenir-YYYY-name | History choice and unpacking decoration |
| New reaction face | config/assets.json + content/memes.json | Reaction selector and downloadable PNG |
| New meme caption | content/memes.json → captions | Caption controls and PNG export |
| SEO description / social image | config/site.json → seo | Page metadata and social previews |
| Verified staging URL | config/site.json → deployment.stagingUrl | Documentation/operations; does not alter the production domain |

## Image replacement procedure

1. Identify the stable asset ID from the table above.
2. Keep the earlier file. Add a new version such as `public/images/hero-arrival-v2.webp`.
3. Update `src`, `alt`, actual pixel dimensions, `version`, and any focal-point fields in `config/assets.json`.
4. Preserve alpha for cutouts. Do not bake headings, contract addresses, or buttons into an illustration.
5. Check every consumer of the asset ID and inspect desktop/mobile framing.
6. Run verification, then staging sync. Report the asset ID and sections changed.

## Facts and pending values

Use JSON `null` for unavailable identity or launch information. Do not write fake zero addresses or guessed social handles. Use `unannounced`, `announced`, or `live` for token status.

Setting status to `live` requires name, ticker, network, contract and chart URL. This is an information-completeness check, not verification of on-chain safety or token quality.

Event updates require a source and a verification date. Preserve the historic edition records unless the user supplies a correction for that specific year.

## Stable design areas

Layout and motion are in `src/components/Landing.tsx` and `src/app/globals.css`. Metadata is in `src/app/layout.tsx`; staging robots rules are in `src/app/robots.ts`.
Edit these for an explicitly requested layout, behavior, accessibility, or rendering change. Routine text/image updates should use the content and asset files.
