import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("roadster rebuild", () => {
  it("keeps the eight story beats as text cards", () => {
    const story = JSON.parse(readFileSync(path.join(root, "content/story.json"), "utf8")) as {
      imageId: string | null;
    }[];
    expect(story).toHaveLength(8);
    expect(story.every((beat) => beat.imageId === null)).toBe(true);
  });

  it("keeps the meme gallery order and local files", () => {
    const gallery = JSON.parse(readFileSync(path.join(root, "content/gallery.json"), "utf8")) as {
      features: string[];
      reactions: string[];
    };
    expect(gallery.features).toEqual(["meme-01-roadster", "meme-02-toy", "meme-03-evolution"]);
    expect(gallery.reactions).toEqual([
      "reaction-01-excited",
      "reaction-02-shocked",
      "reaction-03-confused",
      "reaction-04-smug",
      "reaction-05-angry",
      "reaction-06-deadpan",
    ]);
    for (const id of [...gallery.features, ...gallery.reactions]) {
      expect(existsSync(path.join(root, "public/images", `${id}-v1.webp`))).toBe(true);
    }
  });
});
