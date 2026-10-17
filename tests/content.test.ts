import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadContent } from "../src/lib/content";
import type { ValidationInput } from "../src/lib/validate-content";
import { validateContent } from "../src/lib/validate-content";

const originals = [
  "hero-arrival-v1.png",
  "reaction-confused-v1.png",
  "reaction-deadpan-v1.png",
  "reaction-delighted-v1.png",
  "souvenir-2021-boat-v1.png",
  "souvenir-2022-ticket-v1.png",
  "souvenir-2023-patch-v1.png",
  "souvenir-2024-postcard-v1.png",
  "souvenir-2025-key-v1.png",
  "souvenir-2026-print-v1.png",
];

function bundle(): ValidationInput {
  const read = (file: string) => JSON.parse(readFileSync(path.join(process.cwd(), file), "utf8"));
  return {
    site: read("config/site.json"),
    assets: read("config/assets.json"),
    copy: read("content/copy.json"),
    history: read("content/history.json"),
    memes: read("content/memes.json"),
    fileExists: (src) => existsSync(path.join(process.cwd(), "public", src.replace(/^\//, ""))),
  };
}

describe("shipped content", () => {
  it("passes validation and keeps the source artwork", () => {
    expect(validateContent(bundle())).toEqual([]);
    expect(() => loadContent()).not.toThrow();
    for (const file of originals) {
      expect(existsSync(path.join(process.cwd(), "artwork", "originals", file))).toBe(true);
    }
  });

  it("keeps the logo, meme face, and favicon as separate ids", () => {
    const assets = bundle().assets as Record<string, { src: string }>;
    expect(assets["brand-logo"].src).not.toBe(assets["reaction-deadpan"].src);
    expect(assets["brand-icon"].src).not.toBe(assets["brand-logo"].src);
  });
});

describe("content rules", () => {
  it("rejects a live token that is missing required details", () => {
    const input = bundle();
    const site = input.site as { token: { status: string } };
    site.token.status = "live";
    expect(validateContent(input).join("\n")).toMatch(/live/);
  });

  it("accepts a complete live token and rejects a pair used as the contract", () => {
    const input = bundle();
    const site = input.site as {
      identity: { name: string | null; ticker: string | null };
      token: {
        status: string;
        network: string | null;
        contractAddress: string | null;
        pairAddress: string | null;
        chartUrl: string | null;
      };
    };
    site.identity.name = "Sample Ape";
    site.identity.ticker = "SAMPLE";
    site.token.status = "live";
    site.token.network = "Base";
    site.token.contractAddress = "0x1111111111111111111111111111111111111111";
    site.token.pairAddress = "0x2222222222222222222222222222222222222222";
    site.token.chartUrl = "https://example.com/chart";
    expect(validateContent(input).join("\n")).toMatch(/chartUrl/);

    site.token.chartUrl = "https://dexscreener.com/base/sample";
    expect(validateContent(input)).toEqual([]);

    site.token.pairAddress = site.token.contractAddress;
    expect(validateContent(input).join("\n")).toMatch(/pairAddress/);
  });

  it("rejects duplicate or nonchronological years, bad urls, and missing files", () => {
    const duplicate = bundle();
    const years = duplicate.history as { year: number; sourceUrl: string }[];
    years[1].year = years[0].year;
    expect(validateContent(duplicate).join("\n")).toMatch(/unique/);

    const reversed = bundle();
    const records = reversed.history as { year: number }[];
    [records[0].year, records[1].year] = [records[1].year, records[0].year];
    expect(validateContent(reversed).join("\n")).toMatch(/chronological/);

    const badUrl = bundle();
    (badUrl.history as { sourceUrl: string }[])[0].sourceUrl = "http://localhost/secret";
    expect(validateContent(badUrl).join("\n")).toMatch(/sourceUrl/);

    const missing = bundle();
    missing.fileExists = () => false;
    expect(validateContent(missing).join("\n")).toMatch(/missing/);
  });

  it("rejects a zero address and an event that ends before it starts", () => {
    const input = bundle();
    const site = input.site as {
      token: { contractAddress: string | null };
      event: { startsAt: string; endsAt: string };
    };
    site.token.contractAddress = "0x0000000000000000000000000000000000000000";
    expect(validateContent(input).join("\n")).toMatch(/contractAddress/);

    const times = bundle();
    const event = (times.site as { event: { startsAt: string; endsAt: string } }).event;
    [event.startsAt, event.endsAt] = [event.endsAt, event.startsAt];
    expect(validateContent(times).join("\n")).toMatch(/endsAt/);
  });
});
