import { describe, expect, it, vi } from "vitest";
import {
  canExport,
  completeRender,
  contractCopyValue,
  copyText,
  eventPhase,
  formatZonedTime,
  isIndexable,
  isRealAddress,
  memeDownloadName,
  pageTitle,
  resolveMetadataBase,
  selectionKey,
} from "../src/lib/presentation";
import type { CopyContent, SiteConfig } from "../src/lib/types";

const start = "2026-10-17T19:00:00-04:00";
const end = "2026-10-18T00:00:00-04:00";

describe("event time", () => {
  it("labels the gathering without treating the end instant as still live", () => {
    expect(eventPhase(start, end, new Date(new Date(start).getTime() - 1))).toBe("upcoming");
    expect(eventPhase(start, end, new Date(start))).toBe("live");
    expect(eventPhase(start, end, new Date(end))).toBe("ended");
    expect(formatZonedTime(start, "America/New_York", "Eastern")).toBe(
      "Saturday, October 17, 2026, 7:00 PM Eastern",
    );
    expect(formatZonedTime(start, "America/Los_Angeles", "Pacific")).toBe(
      "Saturday, October 17, 2026, 4:00 PM Pacific",
    );
  });
});

describe("token presentation", () => {
  it("does not invent a title from the repository or domain", () => {
    const site = {
      identity: { name: null, ticker: null },
      seo: { title: null },
    } as SiteConfig;
    const copy = { hero: { headline: ["PACKED FOR", "ONE NIGHT."] } } as CopyContent;
    const title = pageTitle(site, copy);
    expect(title).toBe("PACKED FOR ONE NIGHT.");
    expect(title.toLowerCase()).not.toContain("return2monke");
    expect(title.toLowerCase()).not.toContain("trogebob");
  });

  it("uses a confirmed name and ticker together", () => {
    const site = {
      identity: { name: "Sample Ape", ticker: "SAMPLE" },
      seo: { title: null },
    } as SiteConfig;
    expect(pageTitle(site, { hero: { headline: ["X"] } } as CopyContent)).toBe("Sample Ape (SAMPLE)");
  });

  it("copies only a real contract and never the pair", () => {
    expect(isRealAddress(null)).toBe(false);
    expect(isRealAddress("0x0000000000000000000000000000000000000000")).toBe(false);
    expect(isRealAddress("pending")).toBe(false);
    const contract = "0x1111111111111111111111111111111111111111";
    const pair = "0x2222222222222222222222222222222222222222";
    expect(contractCopyValue({ contractAddress: null, pairAddress: pair })).toBeNull();
    expect(contractCopyValue({ contractAddress: contract, pairAddress: pair })).toBe(contract);
    expect(contractCopyValue({ contractAddress: contract, pairAddress: contract })).toBeNull();
  });

  it("falls back when the clipboard is unavailable and succeeds when it is", async () => {
    vi.stubGlobal("navigator", {});
    await expect(copyText("0x1111111111111111111111111111111111111111")).resolves.toBe("fallback");
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    await expect(copyText("0x1111111111111111111111111111111111111111")).resolves.toBe("copied");
    writeText.mockRejectedValue(new Error("denied"));
    await expect(copyText("0x1111111111111111111111111111111111111111")).resolves.toBe("fallback");
    vi.unstubAllGlobals();
  });
});

describe("staging visibility and meme export", () => {
  it("does not bake a localhost social image into a host-less build", () => {
    expect(resolveMetadataBase({
      productionEnabled: false,
      productionDomain: "trogebob.world",
      stagingUrl: null,
      nodeEnv: "production",
    })).toBeUndefined();
    expect(resolveMetadataBase({
      productionEnabled: false,
      productionDomain: "trogebob.world",
      stagingUrl: "https://preview.example.net",
      nodeEnv: "production",
    })?.origin).toBe("https://preview.example.net");
    expect(resolveMetadataBase({
      productionEnabled: true,
      productionDomain: "trogebob.world",
      stagingUrl: null,
      nodeEnv: "production",
    })?.origin).toBe("https://trogebob.world");
  });

  it("indexes only an explicitly enabled production deployment", () => {
    expect(isIndexable(false, "production")).toBe(false);
    expect(isIndexable(false, "preview")).toBe(false);
    expect(isIndexable(true, "preview")).toBe(false);
    expect(isIndexable(true, "production")).toBe(true);
  });

  it("refuses to export a render from the previous face", () => {
    const first = selectionKey("deadpan", "I PACKED LIGHT.");
    const second = selectionKey("confused", "IT'S IN HERE. SOMEWHERE.");
    expect(canExport({ selectionKey: first, readyKey: completeRender(first, first) })).toBe(true);
    expect(completeRender(second, first)).toBeNull();
    expect(canExport({ selectionKey: second, readyKey: completeRender(second, first) })).toBe(false);
    expect(memeDownloadName("delighted", "ACT NORMAL.")).toBe("ape-delighted-act-normal.png");
  });
});
