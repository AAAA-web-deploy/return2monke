"use client";

import { useRef, useState } from "react";
import type { CopyContent, SiteConfig } from "@/lib/types";
import { contractCopyValue, contractDisplayValue, copyText, formatZonedTime } from "@/lib/presentation";

type TokenDeskProps = {
  site: SiteConfig;
  copy: CopyContent["token"];
};

export function TokenDesk({ site, copy }: TokenDeskProps) {
  const address = contractDisplayValue(site.token, copy.contractNotice);
  const copyableAddress = contractCopyValue(site.token);
  const fallbackRef = useRef<HTMLTextAreaElement>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "fallback">("idle");
  const startEastern = formatZonedTime(site.event.startsAt, "America/New_York", "Eastern");
  const startPacific = formatZonedTime(site.event.startsAt, "America/Los_Angeles", "Pacific");
  const endEastern = formatZonedTime(site.event.endsAt, "America/New_York", "Eastern");
  const endPacific = formatZonedTime(site.event.endsAt, "America/Los_Angeles", "Pacific");

  async function onCopy() {
    if (!copyableAddress) return;
    const result = await copyText(copyableAddress);
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

  const rows: { label: string; value: string }[] = [
    { label: copy.fields.name, value: site.identity.name ?? "" },
    { label: copy.fields.ticker, value: site.identity.ticker ?? "" },
    { label: copy.fields.network, value: site.token.network ?? "Network to be confirmed" },
    { label: copy.fields.supply, value: site.token.totalSupply ?? "" },
    { label: copy.fields.contract, value: address },
    { label: copy.fields.tax, value: site.token.taxInfo ?? "" },
    { label: copy.fields.ownership, value: site.token.ownership ?? "" },
    { label: copy.fields.lpStatus, value: site.token.lpStatus ?? "" },
  ];

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
            <dd className={row.label === copy.fields.contract ? "contract-line" : undefined}>
              <span>{row.value}</span>
              {row.label === copy.fields.contract && copyableAddress ? (
                <button
                  type="button"
                  className="copy-icon"
                  onClick={onCopy}
                  aria-label={copyState === "copied" ? copy.copiedLabel : copy.copyLabel}
                >
                  {copyState === "copied" ? <CheckMark /> : <CopySquares />}
                </button>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
      <p className="sr-only" role="status" aria-live="polite">
        {copyState === "copied" ? copy.copiedLabel : null}
        {copyState === "fallback" ? copy.copyFallback : null}
      </p>
      {copyState === "fallback" ? (
        <textarea ref={fallbackRef} readOnly value={address} aria-label={copy.fields.contract} rows={2} />
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

function CopySquares() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="9" y="9" width="12" height="12" rx="2" fill="var(--yellow)" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12.5 10 17.5 19 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
