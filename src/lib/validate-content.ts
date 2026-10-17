import { isRealAddress } from "./presentation";

export type ValidationInput = {
  site: unknown;
  assets: unknown;
  copy: unknown;
  history: unknown;
  memes: unknown;
  fileExists?: (publicSrc: string) => boolean;
};

const STATUSES = new Set(["unannounced", "announced", "live"]);
const FOCUS = /^\d{1,3}%\s+\d{1,3}%$/;
const CALENDAR_DATE = /^\d{4}-\d{2}-\d{2}$/;
const BLOCKED_HOSTS = new Set(["example.com", "example.org", "example.net", "localhost", "127.0.0.1"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(errors: string[], value: unknown, path: string) {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`${path} must be a non-empty string`);
  }
}

function nullableString(errors: string[], value: unknown, path: string) {
  if (value !== null && typeof value !== "string") {
    errors.push(`${path} must be a string or null`);
  }
  if (typeof value === "string" && value.trim() === "") {
    errors.push(`${path} must be null or a non-empty string`);
  }
}

function stringList(errors: string[], value: unknown, path: string) {
  if (!Array.isArray(value) || value.length === 0 || value.some((item) => typeof item !== "string" || item.trim() === "")) {
    errors.push(`${path} must be a non-empty list of strings`);
  }
}

function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase();
    if (BLOCKED_HOSTS.has(host) || host.endsWith(".example.com")) return false;
    return true;
  } catch {
    return false;
  }
}

function optionalUrl(errors: string[], value: unknown, path: string) {
  nullableString(errors, value, path);
  if (typeof value === "string" && !isHttpsUrl(value)) {
    errors.push(`${path} must be a real https URL`);
  }
}

function calendarDate(errors: string[], value: unknown, path: string) {
  if (typeof value !== "string" || !CALENDAR_DATE.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    errors.push(`${path} must be a YYYY-MM-DD date`);
    return;
  }
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) {
    errors.push(`${path} must be a real calendar date`);
  }
}

function timestamp(errors: string[], value: unknown, path: string): number | null {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    errors.push(`${path} must be a valid timestamp`);
    return null;
  }
  return Date.parse(value);
}

function assetSrc(errors: string[], src: unknown, path: string, fileExists?: (publicSrc: string) => boolean) {
  if (typeof src !== "string" || !src.startsWith("/images/") || src.includes("..") || src.includes("\\")) {
    errors.push(`${path} must be a /images path`);
    return;
  }
  if (fileExists && !fileExists(src)) {
    errors.push(`${path} file is missing (${src})`);
  }
}

function focusValue(errors: string[], value: unknown, path: string, required: boolean) {
  if (value === undefined || value === null) {
    if (required) errors.push(`${path} is required`);
    return;
  }
  if (typeof value !== "string" || !FOCUS.test(value)) {
    errors.push(`${path} must be a percentage focal point such as 50% 50%`);
  }
}

export function validateContent(input: ValidationInput): string[] {
  const errors: string[] = [];
  const { site, assets, copy, history, memes, fileExists } = input;

  if (!isRecord(site)) {
    errors.push("site must be an object");
  }
  if (!isRecord(assets)) {
    errors.push("assets must be an object");
  }
  if (!isRecord(copy)) {
    errors.push("copy must be an object");
  }
  if (!Array.isArray(history)) {
    errors.push("history must be an array");
  }
  if (!isRecord(memes)) {
    errors.push("memes must be an object");
  }
  if (!isRecord(site) || !isRecord(assets) || !isRecord(copy) || !Array.isArray(history) || !isRecord(memes)) {
    return errors;
  }

  const identity = site.identity;
  const token = site.token;
  const community = site.community;
  const event = site.event;
  const deployment = site.deployment;
  const seo = site.seo;

  if (!isRecord(identity) || !isRecord(token) || !isRecord(community) || !isRecord(event) || !isRecord(deployment) || !isRecord(seo)) {
    errors.push("site is missing identity, token, community, event, deployment, or seo");
    return errors;
  }

  nullableString(errors, identity.name, "identity.name");
  nullableString(errors, identity.ticker, "identity.ticker");
  requiredString(errors, identity.description, "identity.description");
  requiredString(errors, identity.independenceLine, "identity.independenceLine");
  requiredString(errors, identity.logoAssetId, "identity.logoAssetId");
  requiredString(errors, identity.faviconAssetId, "identity.faviconAssetId");

  if (typeof token.status !== "string" || !STATUSES.has(token.status)) {
    errors.push("token.status must be unannounced, announced, or live");
  }
  nullableString(errors, token.network, "token.network");
  if (token.chainId !== null && (!Number.isInteger(token.chainId) || Number(token.chainId) <= 0)) {
    errors.push("token.chainId must be a positive integer or null");
  }
  for (const field of ["contractAddress", "pairAddress", "totalSupply", "taxInfo", "liquidityInfo"] as const) {
    nullableString(errors, token[field], `token.${field}`);
  }
  for (const field of ["contractAddress", "pairAddress"] as const) {
    const value = token[field];
    if (typeof value === "string" && !isRealAddress(value)) {
      errors.push(`token.${field} is not a usable address`);
    }
  }
  if (
    typeof token.contractAddress === "string" &&
    typeof token.pairAddress === "string" &&
    token.contractAddress.trim().toLowerCase() === token.pairAddress.trim().toLowerCase()
  ) {
    errors.push("token.pairAddress must stay separate from token.contractAddress");
  }
  optionalUrl(errors, token.chartUrl, "token.chartUrl");
  optionalUrl(errors, token.buyUrl, "token.buyUrl");
  optionalUrl(errors, token.explorerUrl, "token.explorerUrl");
  optionalUrl(errors, community.xUrl, "community.xUrl");
  optionalUrl(errors, community.telegramUrl, "community.telegramUrl");

  if (token.status === "live") {
    requiredString(errors, identity.name, "identity.name");
    requiredString(errors, identity.ticker, "identity.ticker");
    requiredString(errors, token.network, "token.network");
    if (!isRealAddress(typeof token.contractAddress === "string" ? token.contractAddress : null)) {
      errors.push("token.contractAddress is required when status is live");
    }
    if (typeof token.chartUrl !== "string" || !isHttpsUrl(token.chartUrl)) {
      errors.push("token.chartUrl is required when status is live");
    }
  }

  requiredString(errors, event.name, "event.name");
  if (!Number.isInteger(event.edition)) errors.push("event.edition must be an integer year");
  requiredString(errors, event.city, "event.city");
  requiredString(errors, event.region, "event.region");
  requiredString(errors, event.venue, "event.venue");
  if (typeof event.officialUrl !== "string" || !isHttpsUrl(event.officialUrl)) {
    errors.push("event.officialUrl must be a real https URL");
  }
  const starts = timestamp(errors, event.startsAt, "event.startsAt");
  const ends = timestamp(errors, event.endsAt, "event.endsAt");
  if (starts !== null && ends !== null && starts >= ends) {
    errors.push("event.endsAt must be after event.startsAt");
  }
  calendarDate(errors, event.verifiedAt, "event.verifiedAt");

  requiredString(errors, deployment.repository, "deployment.repository");
  requiredString(errors, deployment.stagingBranch, "deployment.stagingBranch");
  requiredString(errors, deployment.productionBranch, "deployment.productionBranch");
  requiredString(errors, deployment.productionDomain, "deployment.productionDomain");
  if (typeof deployment.productionEnabled !== "boolean") {
    errors.push("deployment.productionEnabled must be boolean");
  }
  optionalUrl(errors, deployment.stagingUrl, "deployment.stagingUrl");
  nullableString(errors, seo.title, "seo.title");
  requiredString(errors, seo.description, "seo.description");
  requiredString(errors, seo.socialImageAsset, "seo.socialImageAsset");

  if (identity.logoAssetId === "reaction-deadpan" || identity.faviconAssetId === identity.logoAssetId) {
    errors.push("brand logo, meme face, and favicon must keep separate asset ids");
  }

  const assetIds = new Set(Object.keys(assets));
  for (const [id, asset] of Object.entries(assets)) {
    if (!isRecord(asset)) {
      errors.push(`assets.${id} must be an object`);
      continue;
    }
    assetSrc(errors, asset.src, `assets.${id}.src`, fileExists);
    requiredString(errors, asset.alt, `assets.${id}.alt`);
    if (!Number.isInteger(asset.width) || Number(asset.width) <= 0 || !Number.isInteger(asset.height) || Number(asset.height) <= 0) {
      errors.push(`assets.${id} needs positive integer dimensions`);
    }
    if (!Number.isInteger(asset.version) || Number(asset.version) <= 0) {
      errors.push(`assets.${id}.version must be a positive integer`);
    }
    const needsFocus = id === "hero-arrival";
    focusValue(errors, asset.desktopFocus, `assets.${id}.desktopFocus`, needsFocus);
    focusValue(errors, asset.mobileFocus, `assets.${id}.mobileFocus`, needsFocus);
  }

  for (const id of [identity.logoAssetId, identity.faviconAssetId, seo.socialImageAsset]) {
    if (typeof id === "string" && !assetIds.has(id)) errors.push(`missing asset id ${id}`);
  }

  const years: number[] = [];
  history.forEach((record, index) => {
    const path = `history[${index}]`;
    if (!isRecord(record)) {
      errors.push(`${path} must be an object`);
      return;
    }
    if (!Number.isInteger(record.year)) errors.push(`${path}.year must be an integer`);
    else years.push(Number(record.year));
    for (const field of ["city", "title", "object", "fact", "joke"] as const) {
      requiredString(errors, record[field], `${path}.${field}`);
    }
    requiredString(errors, record.assetId, `${path}.assetId`);
    if (typeof record.assetId === "string" && !assetIds.has(record.assetId)) {
      errors.push(`${path}.assetId does not match an asset`);
    }
    if (typeof record.sourceUrl !== "string" || !isHttpsUrl(record.sourceUrl)) {
      errors.push(`${path}.sourceUrl must be a real https URL`);
    }
    calendarDate(errors, record.verifiedAt, `${path}.verifiedAt`);
  });

  const uniqueYears = new Set(years);
  if (uniqueYears.size !== years.length) errors.push("history years must be unique");
  for (let index = 1; index < years.length; index += 1) {
    if (years[index] <= years[index - 1]) errors.push("history years must be chronological");
  }
  if (Number.isInteger(event.edition) && !uniqueYears.has(Number(event.edition))) {
    errors.push("event.edition must match a history year");
  }

  if (!Array.isArray(memes.reactions) || memes.reactions.length === 0) {
    errors.push("memes.reactions must be a non-empty array");
  } else {
    const ids = new Set<string>();
    memes.reactions.forEach((reaction, index) => {
      if (!isRecord(reaction)) {
        errors.push(`memes.reactions[${index}] must be an object`);
        return;
      }
      requiredString(errors, reaction.id, `memes.reactions[${index}].id`);
      requiredString(errors, reaction.label, `memes.reactions[${index}].label`);
      requiredString(errors, reaction.assetId, `memes.reactions[${index}].assetId`);
      if (typeof reaction.id === "string") {
        if (ids.has(reaction.id)) errors.push(`duplicate meme reaction ${reaction.id}`);
        ids.add(reaction.id);
      }
      if (typeof reaction.assetId === "string" && !assetIds.has(reaction.assetId)) {
        errors.push(`memes.reactions[${index}].assetId does not match an asset`);
      }
      if (reaction.assetId === identity.logoAssetId) {
        errors.push("meme reactions must not use the brand-logo asset id");
      }
    });
  }

  if (!Array.isArray(memes.captions)) {
    errors.push("memes.captions must be an array");
  } else {
    stringList(errors, memes.captions, "memes.captions");
    if (new Set(memes.captions).size !== memes.captions.length) errors.push("meme captions must be unique");
  }

  validateCopy(errors, copy);
  return errors;
}

function validateCopy(errors: string[], copy: Record<string, unknown>) {
  const nav = copy.nav;
  const hero = copy.hero;
  const culture = copy.culture;
  const history = copy.history;
  const memes = copy.memes;
  const token = copy.token;
  const footer = copy.footer;
  if (!isRecord(nav) || !isRecord(hero) || !isRecord(culture) || !isRecord(history) || !isRecord(memes) || !isRecord(token) || !isRecord(footer)) {
    errors.push("copy is missing a section");
    return;
  }
  for (const key of ["skip", "culture", "history", "memes", "token"]) {
    requiredString(errors, nav[key], `copy.nav.${key}`);
  }
  stringList(errors, hero.headline, "copy.hero.headline");
  for (const key of ["subheading", "primaryLabel", "secondaryLabel"]) {
    requiredString(errors, hero[key], `copy.hero.${key}`);
  }
  requiredString(errors, culture.eyebrow, "copy.culture.eyebrow");
  stringList(errors, culture.heading, "copy.culture.heading");
  requiredString(errors, culture.introduction, "copy.culture.introduction");
  if (!Array.isArray(culture.items) || culture.items.length === 0) {
    errors.push("copy.culture.items must be a non-empty array");
  } else {
    culture.items.forEach((item, index) => {
      if (!isRecord(item)) {
        errors.push(`copy.culture.items[${index}] must be an object`);
        return;
      }
      requiredString(errors, item.title, `copy.culture.items[${index}].title`);
      requiredString(errors, item.text, `copy.culture.items[${index}].text`);
    });
  }
  requiredString(errors, history.eyebrow, "copy.history.eyebrow");
  stringList(errors, history.heading, "copy.history.heading");
  for (const key of ["introduction", "factLabel", "jokeLabel", "sourceLabel", "verifiedLabel"]) {
    requiredString(errors, history[key], `copy.history.${key}`);
  }
  requiredString(errors, memes.eyebrow, "copy.memes.eyebrow");
  stringList(errors, memes.heading, "copy.memes.heading");
  for (const key of ["introduction", "saveLabel", "renderingLabel", "expressionLabel", "captionLabel", "privacy"]) {
    requiredString(errors, memes[key], `copy.memes.${key}`);
  }
  requiredString(errors, token.eyebrow, "copy.token.eyebrow");
  stringList(errors, token.heading, "copy.token.heading");
  for (const key of ["pendingText", "eventTitle", "eventNote", "launchNote", "copyLabel", "copiedLabel", "copyFallback"]) {
    requiredString(errors, token[key], `copy.token.${key}`);
  }
  for (const group of ["fields", "actions", "statuses", "phases"] as const) {
    if (!isRecord(token[group])) {
      errors.push(`copy.token.${group} must be an object`);
      continue;
    }
    for (const [key, value] of Object.entries(token[group])) {
      requiredString(errors, value, `copy.token.${group}.${key}`);
    }
  }
  requiredString(errors, footer.fictionLine, "copy.footer.fictionLine");
}
