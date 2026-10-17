# Approved website design

This is a design specification for Cursor to implement. References to application files describe the intended finished structure. The kit contains prompts, reference data and assets.

## Core idea

An original brown ape arrives in Charleston with an absurdly overpacked yellow suitcase. As visitors explore, its souvenirs tell six chapters of ApeFest history. The character supplies a readable visual joke for people unfamiliar with ApeFest; the historical objects provide depth for fans.

The ape and souvenirs are fictional original illustrations. They are not representations of official merchandise, a real event attendee, an endorsement, or NFT membership rights.

## Audience and tone

- Welcome visitors who have never heard of ApeFest. Explain BAYC on first use.
- Use concise, conversational American English and understandable visual humor.
- Give U.S. visitors Charleston context and explicit Eastern/Pacific event times.
- Keep name, ticker, network, contract, chart, and community access easy to locate once confirmed.
- The event location is a creative relevance cue, not evidence of token demand.

## Visual system

| Element | Specification |
|---|---|
| Background | Warm cream #F6EAD5 |
| Text and outlines | Midnight ink #16202B |
| Main action / shirt | Coral #FF693C, with dark button text |
| Suitcase / selected states | Luggage yellow #F7C84A |
| Secondary accents | Petrol teal #296F73 |
| Headlines | Bold condensed display type; Barlow Condensed or equivalent |
| Body | DM Sans or a comparably readable sans serif |
| Art | Hand-inked editorial comic, tactile shading, imperfect print texture |

Keep the artwork and narrative prominent. Use paper, tickets, tags and patches as recurring visual objects. Preserve comfortable contrast and a readable text area over the quiet side of the hero.

## Section order

1. **Arrival:** logo/identity in header; fictional ape and suitcase; short headline and premise; story/token actions. Place the scene on the right on desktop. On mobile, show the character clearly and stack short copy with usable actions.
2. **Culture:** one short explanation and four clear ideas: music, art, style, people. Avoid requiring NFT knowledge.
3. **History:** six dated, keyboard-accessible souvenir choices, 2021–2026. Selecting one updates the year, city, real fact, fictional character reaction, and official source link. Keep all years discoverable on mobile.
4. **Memes:** three consistent ape expressions and three editable captions. Save a local PNG. No wallet or account is needed for story or meme interactions.
5. **Token desk and community:** show confirmed information directly. Show pending values for unresolved fields. Enable chart, buy, explorer and social links only when provided. Distinguish event time from token launch time.

## Effects

- On “Unpack the years,” souvenir cutouts lift from the suitcase area and the page follows ordinary scrolling.
- Use small object lifts, tilts and tactile shadows for depth.
- Do not make text or essential actions depend on hover.
- Disable nonessential motion for reduced-motion preferences.
- Keep mobile interactions touch-friendly and avoid scroll hijacking or audio autoplay.

## Asset system

All visible artwork is resolved through `config/assets.json`. Use `next/image` with appropriate sizes and reserved image dimensions. The hero has independent desktop/mobile focus values. Preserve the alpha channel of souvenir and reaction cutouts.

`artwork/originals/` keeps the original PNGs. `public/images/` contains the deployment variants. File names include versions so replacement and rollback are clear.

## Content truthfulness

- Keep token identity and launch details null until the user provides them.
- Keep factual history separate from fictional jokes.
- Source each historical chapter using its existing official link.
- Do not imply that buying the token grants ApeFest admission or BAYC membership.
- Keep this independent project's relationship to ApeFest explicit.

## Acceptance criteria

- Next.js builds successfully with the committed lockfile.
- No missing images, invalid local references, fake addresses, or active placeholder URLs.
- History controls work for every edition.
- Each expression/caption combination creates the correct downloadable image.
- A rapid expression change cannot export a stale image.
- Contract copying works when a real address is configured, with a readable fallback if clipboard access fails.
- Text and controls fit at 320, 390, 768, 1024, and 1440 px widths.
- Keyboard focus is visible; controls have accessible names and sufficient touch targets.
- Staging is noindex; unapproved production deployment remains disabled.
- Routine content or asset updates preserve the layout.
