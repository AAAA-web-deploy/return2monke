"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { HistoryStation } from "@/components/HistoryStation";
import { MemeStation } from "@/components/MemeStation";
import { TokenDesk } from "@/components/TokenDesk";
import { eventPhase, formatZonedTime } from "@/lib/presentation";
import type { ContentModel, EventPhase } from "@/lib/types";

const FLOATS = [
  { left: "57%", top: "64%", tilt: -8 },
  { left: "68%", top: "72%", tilt: 7 },
  { left: "79%", top: "58%", tilt: -4 },
  { left: "62%", top: "80%", tilt: 11 },
  { left: "84%", top: "74%", tilt: -12 },
  { left: "73%", top: "84%", tilt: 5 },
];

export function Landing({ content }: { content: ContentModel }) {
  const { site, assets, copy, history, memes } = content;
  const hero = assets["hero-arrival"];
  const logo = assets[site.identity.logoAssetId];
  const [unpacking, setUnpacking] = useState(false);
  const [phase, setPhase] = useState<EventPhase | null>(null);
  const startEastern = formatZonedTime(site.event.startsAt, "America/New_York", "Eastern");
  const startPacific = formatZonedTime(site.event.startsAt, "America/Los_Angeles", "Pacific");

  useEffect(() => {
    const update = () => setPhase(eventPhase(site.event.startsAt, site.event.endsAt));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, [site.event.endsAt, site.event.startsAt]);

  function onUnpack(event: MouseEvent<HTMLAnchorElement>) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    event.preventDefault();
    setUnpacking(true);
    window.setTimeout(() => {
      document.getElementById("history")?.scrollIntoView({ behavior: "smooth", block: "start" });
      setUnpacking(false);
    }, 900);
  }

  return (
    <>
      <a className="skip-link" href="#story">
        {copy.nav.skip}
      </a>
      <header className="site-header">
        <a className="brand" href="#story">
          <Image src={logo.src} alt={logo.alt} width={96} height={96} sizes="52px" className="brand-logo" />
          {site.identity.name ? (
            <span className="brand-name">
              {site.identity.name}
              {site.identity.ticker ? <span className="ticker">{site.identity.ticker}</span> : null}
            </span>
          ) : (
            <span className="place-tag">{site.event.city}</span>
          )}
        </a>
        <nav className="section-nav" aria-label="Sections">
          <a href="#culture">{copy.nav.culture}</a>
          <a href="#history">{copy.nav.history}</a>
          <a href="#memes">{copy.nav.memes}</a>
          <a href="#token">{copy.nav.token}</a>
        </nav>
        <div className="header-socials">
          <HeaderIcon href={site.community.telegramUrl} label={copy.token.actions.telegram}>
            <TelegramIcon />
          </HeaderIcon>
          <HeaderIcon href={site.community.xUrl} label={copy.token.actions.x}>
            <XIcon />
          </HeaderIcon>
          <HeaderIcon href={site.community.dextoolsUrl} label={copy.token.actions.dextools}>
            <DextoolsIcon />
          </HeaderIcon>
          <HeaderIcon href={site.community.dexscreenerUrl} label={copy.token.actions.dexscreener}>
            <DexscreenerIcon />
          </HeaderIcon>
        </div>
        <a className="button button-yellow header-token" href="#token">
          {copy.hero.secondaryLabel}
        </a>
      </header>
      <main id="story">
        <section className="hero" aria-labelledby="hero-title">
          <div
            className={unpacking ? "hero-frame is-unpacking" : "hero-frame"}
            style={{
              "--hero-desktop": hero.desktopFocus ?? "50% 50%",
              "--hero-mobile": hero.mobileFocus ?? "80% 50%",
            } as CSSProperties}
          >
            <Image
              src={hero.src}
              alt={hero.alt}
              fill
              priority
              sizes="(max-width: 1180px) 100vw, 1180px"
              className="hero-photo"
            />
            <div className="unpack-layer" aria-hidden="true">
              {history.map((record, index) => {
                const souvenir = assets[record.assetId];
                const float = FLOATS[index] ?? FLOATS[0];
                return (
                  <Image
                    key={record.assetId}
                    src={souvenir.src}
                    alt=""
                    width={180}
                    height={180}
                    className="souvenir-float"
                    style={{
                      left: float.left,
                      top: float.top,
                      animationDelay: `${index * 70}ms`,
                      ["--tilt" as string]: `${float.tilt}deg`,
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div className="hero-copy">
            <p className="place-tag">
              {site.event.city}, {site.event.region}
            </p>
            <h1 id="hero-title" className="display">
              {copy.hero.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            <p className="lede">{copy.hero.subheading}</p>
            <p className="premise">{site.identity.description}</p>
            <div className="clock">
              <p>
                {site.event.venue} · {site.event.name} {site.event.edition}
              </p>
              <p>{startEastern}</p>
              <p>{startPacific}</p>
              {phase ? <p className={`phase phase-${phase}`}>{copy.token.phases[phase]}</p> : null}
              <p className="event-note">{copy.token.eventNote}</p>
            </div>
            <div className="actions">
              <a className="button button-coral" href="#history" onClick={onUnpack}>
                {copy.hero.primaryLabel}
              </a>
              <a className="button button-yellow" href="#token">
                {copy.hero.secondaryLabel}
              </a>
            </div>
          </div>
        </section>

        <section id="culture" className="section" aria-labelledby="culture-title">
          <p className="eyebrow">{copy.culture.eyebrow}</p>
          <h2 id="culture-title" className="display">
            {copy.culture.heading.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className="section-intro">{copy.culture.introduction}</p>
          <ol className="culture-sheet">
            {copy.culture.items.map((item, index) => (
              <li key={item.title}>
                <span className="culture-index">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="history" className="section" aria-labelledby="history-title">
          <p className="eyebrow">{copy.history.eyebrow}</p>
          <h2 id="history-title" className="display">
            {copy.history.heading.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className="section-intro">{copy.history.introduction}</p>
          <HistoryStation copy={copy.history} records={history} assets={assets} initialYear={site.event.edition} />
        </section>

        <section id="memes" className="section" aria-labelledby="meme-title">
          <p className="eyebrow">{copy.memes.eyebrow}</p>
          <h2 id="meme-title" className="display">
            {copy.memes.heading.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className="section-intro">{copy.memes.introduction}</p>
          <MemeStation copy={copy.memes} memes={memes} assets={assets} />
        </section>

        <section id="token" className="section" aria-labelledby="token-title">
          <p className="eyebrow">{copy.token.eyebrow}</p>
          <h2 id="token-title" className="display">
            {copy.token.heading.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <TokenDesk site={site} copy={copy.token} />
        </section>
      </main>
      <footer className="site-footer">
        <p>{site.identity.independenceLine}</p>
        <p>{copy.footer.fictionLine}</p>
      </footer>
    </>
  );
}

function HeaderIcon({ href, label, children }: { href: string | null; label: string; children: ReactNode }) {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" aria-label={label}>
      {children}
    </button>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M21.2 4.4 2.9 11.5c-1.2.5-1.2 1.2-.2 1.5l4.7 1.5 10.8-6.8c.5-.3 1-.1.6.3l-8.7 7.9-.3 4.7c.5 0 .7-.2 1-.5l2.4-2.3 5 3.7c.9.5 1.6.2 1.8-.9l2.2-14.1c.3-1.3-.5-1.9-1.6-1.5Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M4 4h3.6l4.1 5.7L16.2 4H20l-6.2 7.3L20.4 20h-3.6l-4.5-6.2L7.6 20H3.6l6.6-7.8L4 4Z" />
    </svg>
  );
}

function DextoolsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 16.5 9 11l3.2 3.2L20 6.5" />
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 6.5h6v6" />
    </svg>
  );
}

function DexscreenerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M4 14h2.2v6H4zm4-5h2.2v11H8zm4-4h2.2v15H12z" />
      <circle cx="17.2" cy="8.2" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="m19.5 10.5 2.2 2.2" />
    </svg>
  );
}
