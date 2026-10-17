# Original artwork and deployment assets

All artwork was generated for this conversation's approved original ape-and-suitcase concept. The kit contains ten source illustrations: one hero, six souvenir objects and three character expressions. The favicon is a small derived variant.

originals/ contains source PNGs. web/ contains optimized deployment images. Copy web/ into the built application's public/images/. The initial manifest is brief/reference-data/assets.json; its /images paths describe that destination. Keep all HTML text, controls and token information outside images.

The hero is 1672 × 941. Souvenir and reaction illustrations are 1254 × 1254 with alpha transparency. The favicon is 128 × 128. Use the desktop/mobile focus values in the manifest and inspect actual crops in the finished page.

## Asset inventory

| Stable ID | File relative to brief/ | Dimensions |
|---|---|---|
| hero-arrival | assets/web/hero-arrival-v1.webp | 1672 × 941 |
| reaction-deadpan | assets/web/reaction-deadpan-v1.webp | 1254 × 1254 |
| reaction-confused | assets/web/reaction-confused-v1.webp | 1254 × 1254 |
| reaction-delighted | assets/web/reaction-delighted-v1.webp | 1254 × 1254 |
| souvenir-2021-boat | assets/web/souvenir-2021-boat-v1.webp | 1254 × 1254 |
| souvenir-2022-ticket | assets/web/souvenir-2022-ticket-v1.webp | 1254 × 1254 |
| souvenir-2023-patch | assets/web/souvenir-2023-patch-v1.webp | 1254 × 1254 |
| souvenir-2024-postcard | assets/web/souvenir-2024-postcard-v1.webp | 1254 × 1254 |
| souvenir-2025-key | assets/web/souvenir-2025-key-v1.webp | 1254 × 1254 |
| souvenir-2026-print | assets/web/souvenir-2026-print-v1.webp | 1254 × 1254 |
| brand-logo | assets/web/reaction-deadpan-v1.webp | 1254 × 1254 |
| brand-icon | assets/web/brand-icon-v1.png | 128 × 128 |

## Uses and replacements

- hero-arrival: desktop/mobile arrival scene and initial social preview.
- souvenir-2021-boat through souvenir-2026-print: the six historical choices and unpacking effect.
- reaction-deadpan/confused/delighted: meme selector and PNG export.
- brand-logo: separate logical ID, initially sharing the deadpan art file. A future brand logo should replace this entry without changing the meme expression.
- brand-icon: separate favicon variant.

To replace an asset later, add a versioned file, preserve its earlier version, and update its stable manifest entry with real dimensions, alt text, version and focal points. Preserve transparency for cutouts. Use UPDATE_MAP.md and the image-update prompt.

The generation-prompts.json records the supporting-art generation briefs and the approved hero reference. The finished artwork is supplied; regeneration is not needed to build the template. Illustrations are fictional original art and do not represent official merchandise or endorsements.
