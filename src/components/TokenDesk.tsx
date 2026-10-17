"use client";

import { useRef, useState } from "react";
import type { CopyContent, SiteConfig } from "@/lib/types";
import { contractCopyValue, copyText, formatZonedTime } from "@/lib/presentation";

type TokenDeskProps = {
  site: SiteConfig;
  copy: CopyContent["token"];
};

export function TokenDesk({ site, copy }: TokenDeskProps) {
  const address = contractCopyValue(site.token);
  const fallbackRef = useRef<HTMLTextAreaElement>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "fallback">("idle");
  const startEastern = formatZonedTime(site.event.startsAt, "America/New_York", "Eastern");
  const startPacific = formatZonedTime(site.event.startsAt, "America/Los_Angeles", "Pacific");
  const endEastern = formatZonedTime(site.event.endsAt, "America/New_York", "Eastern");
  const endPacific = formatZonedTime(site.event.endsAt, "America/Los_Angeles", "Pacific");

  async function onCopy() {
    if (!address) return;
    const result = await copyText(address);
    setCopyState(result);
    if (result === "fallback") {
      requestAnimationFrame(() => {
        fallbackRef.current?.focus();
        fallbackRef.current?.select();
      });
    }
  }

  const links = [
    site.token.chartUrl ? { href: site.token.chartUrl, label: copy.actions.chart } : null,
    site.token.buyUrl ? { href: site.token.buyUrl, label: copy.actions.buy } : null,
    site.token.explorerUrl ? { href: site.token.explorerUrl, label: copy.actions.explorer } : null,
    site.community.xUrl ? { href: site.community.xUrl, label: copy.actions.x } : null,
    site.community.telegramUrl ? { href: site.community.telegramUrl, label: copy.actions.telegram } : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  const rows: { label: string; value: string | null; address?: boolean }[] = [
    { label: copy.fields.name, value: site.identity.name },
    { label: copy.fields.ticker, value: site.identity.ticker },
    { label: copy.fields.status, value: copy.statuses[site.token.status] },
    { label: copy.fields.network, value: site.token.network },
    { label: copy.fields.chainId, value: site.token.chainId === null ? null : String(site.token.chainId) },
    { label: copy.fields.contract, value: site.token.contractAddress, address: true },
    { label: copy.fields.pair, value: site.token.pairAddress, address: true },
  ];
  if (site.token.totalSupply) rows.push({ label: copy.fields.supply, value: site.token.totalSupply });
  if (site.token.taxInfo) rows.push({ label: copy.fields.tax, value: site.token.taxInfo });
  if (site.token.liquidityInfo) rows.push({ label: copy.fields.liquidity, value: site.token.liquidityInfo });

  return (
    <div className="desk">
      {site.token.status !== "live" ? <p className="pending-intro">{copy.pendingText}</p> : null}
      <p className="independence">{site.identity.independenceLine}</p>
      <section className="event-card" aria-label={copy.eventTitle}>
        <h3>{copy.eventTitle}</h3>
        <p>
          {site.event.name} {site.event.edition} · {site.event.venue}, {site.event.city}, {site.event.region}
        </p>
        <p>{startEastern}</p>
        <p>{startPacific}</p>
        <p>
          Through {endEastern} / {endPacific}
        </p>
        <p>{copy.eventNote}</p>
        <p>{copy.launchNote}</p>
      </section>
      <dl className="token-rows">
        {rows.map((row) => (
          <div key={row.label} className="token-row">
            <dt>{row.label}</dt>
            <dd className={row.value && row.address ? "address" : undefined}>
              {row.value ?? <span className="pending">{copy.fields.pending}</span>}
            </dd>
          </div>
        ))}
      </dl>
      {address ? (
        <div className="copy-block">
          <button type="button" className="button button-yellow" onClick={onCopy}>
            {copy.copyLabel}
          </button>
          <p role="status" aria-live="polite">
            {copyState === "copied" ? copy.copiedLabel : null}
            {copyState === "fallback" ? copy.copyFallback : null}
          </p>
          {copyState === "fallback" ? (
            <textarea ref={fallbackRef} readOnly value={address} aria-label={copy.fields.contract} rows={2} />
          ) : null}
        </div>
      ) : null}
      {links.length > 0 ? (
        <div className="link-row">
          {links.map((link) => (
            <a key={link.href} className="button button-ink" href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
