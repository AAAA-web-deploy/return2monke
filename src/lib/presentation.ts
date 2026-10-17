import type { CopyContent, EventPhase, SiteConfig } from "./types";

const PLACEHOLDER_ADDRESS = /^(tbd|pending|null|undefined|none|n\/a|na|todo|test)$/i;

export function isRealAddress(value: string | null | undefined): value is string {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed.length < 8) return false;
  if (PLACEHOLDER_ADDRESS.test(trimmed)) return false;
  if (/^0x0+$/i.test(trimmed)) return false;
  return true;
}

export function contractCopyValue(token: {
  contractAddress: string | null;
  pairAddress: string | null;
}): string | null {
  if (!isRealAddress(token.contractAddress)) return null;
  if (
    token.pairAddress &&
    token.contractAddress.trim().toLowerCase() === token.pairAddress.trim().toLowerCase()
  ) {
    return null;
  }
  return token.contractAddress.trim();
}

export function contractDisplayValue(
  token: {
    contractAddress: string | null;
    pairAddress: string | null;
  },
  notice: string,
): string {
  return contractCopyValue(token) ?? notice;
}

export async function copyText(value: string): Promise<"copied" | "fallback"> {
  try {
    if (!navigator.clipboard?.writeText) return "fallback";
    await navigator.clipboard.writeText(value);
    return "copied";
  } catch {
    return "fallback";
  }
}

export function pageTitle(site: SiteConfig, copy: CopyContent): string {
  if (site.seo.title && site.seo.title.trim()) return site.seo.title.trim();
  if (site.identity.name && site.identity.ticker) {
    return `${site.identity.name} (${site.identity.ticker})`;
  }
  if (site.identity.name) return site.identity.name;
  return copy.hero.headline.join(" ");
}

export function isIndexable(productionEnabled: boolean, vercelEnv: string | undefined): boolean {
  return productionEnabled === true && vercelEnv === "production";
}

export function resolveMetadataBase(input: {
  productionEnabled: boolean;
  productionDomain: string;
  stagingUrl: string | null;
  vercelUrl?: string;
  nodeEnv?: string;
}): URL | undefined {
  if (input.productionEnabled && input.productionDomain) {
    return new URL(`https://${input.productionDomain}`);
  }
  if (input.stagingUrl) return new URL(input.stagingUrl);
  if (input.vercelUrl) return new URL(`https://${input.vercelUrl}`);
  if (input.nodeEnv === "development") return new URL("http://localhost:3000");
  return undefined;
}

export function eventPhase(startsAt: string, endsAt: string, now = new Date()): EventPhase {
  const start = new Date(startsAt).getTime();
  const end = new Date(endsAt).getTime();
  const time = now.getTime();
  if (time < start) return "upcoming";
  if (time < end) return "live";
  return "ended";
}

export function formatZonedTime(iso: string, timeZone: string, label: string): string {
  const date = new Date(iso);
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
  return `${day}, ${time} ${label}`;
}

export function formatCalendarDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function memeDownloadName(reactionId: string, caption: string): string {
  const slug = caption
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `ape-${reactionId}-${slug}.png`;
}

export function selectionKey(reactionId: string, caption: string): string {
  return `${reactionId}::${caption}`;
}

export function completeRender(currentKey: string, completedKey: string): string | null {
  return currentKey === completedKey ? completedKey : null;
}

export function canExport(render: { selectionKey: string; readyKey: string | null }): boolean {
  return render.readyKey !== null && render.readyKey === render.selectionKey;
}
