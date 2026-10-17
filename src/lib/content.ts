import fs from "node:fs";
import path from "node:path";
import assetsJson from "../../config/assets.json";
import siteJson from "../../config/site.json";
import copyJson from "../../content/copy.json";
import historyJson from "../../content/history.json";
import memesJson from "../../content/memes.json";
import type { ContentModel } from "./types";
import { validateContent } from "./validate-content";

let cached: ContentModel | null = null;

export function loadContent(): ContentModel {
  if (cached) return cached;
  const errors = validateContent({
    site: siteJson,
    assets: assetsJson,
    copy: copyJson,
    history: historyJson,
    memes: memesJson,
    fileExists: (src) => fs.existsSync(path.join(process.cwd(), "public", src.replace(/^\//, ""))),
  });
  if (errors.length > 0) {
    throw new Error(`Content validation failed:\n${errors.join("\n")}`);
  }
  cached = {
    site: siteJson as ContentModel["site"],
    assets: assetsJson as ContentModel["assets"],
    copy: copyJson as ContentModel["copy"],
    history: historyJson as ContentModel["history"],
    memes: memesJson as ContentModel["memes"],
  };
  return cached;
}
