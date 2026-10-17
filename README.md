# ApeFest arrival page

An illustrated Next.js page about a fictional ape arriving in Charleston with an overpacked suitcase. The suitcase souvenirs explain six editions of ApeFest. Token identity stays pending until real details are supplied.

## Local development

Requirements: Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Published updates are at https://trogebob.world/ after the GitHub Pages workflow finishes.

## Checks

```bash
npm run validate
npm run typecheck
npm test
npm run build
npm run stage:check
```

`npm run stage` runs those checks, then commits and pushes the `staging` branch. `npm run stage:check` is the same checks without a commit or push. See `STAGING.md` before the first push.

## Editable sources

| Change | File |
|---|---|
| Token, community, event, SEO, deployment ids | `config/site.json` |
| Artwork paths, dimensions, alt text, hero crop | `config/assets.json` |
| Section headings and explanations | `content/copy.json` |
| Edition facts, jokes, and sources | `content/history.json` |
| Meme faces and captions | `content/memes.json` |

Deployment images live in `public/images/`. Source PNGs live in `artwork/originals/`. `brief/` is the design reference and stays in the repo. The update procedure is `brief/UPDATE_MAP.md`.

Routine text and image updates should not require layout edits. Layout and motion are in `src/components/Landing.tsx` and `src/app/globals.css`.

## Pending on purpose

Name, ticker, network, contract, pair, supply, tax, liquidity, chart, buy, explorer, and community links are null. The page shows those fields as pending and does not invent them from the repository or `trogebob.world`.
