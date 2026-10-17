"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { AssetRecord, SiteConfig } from "@/lib/types";

type SiteHeaderProps = {
  site: SiteConfig;
  logo: AssetRecord;
};

const NAV = [
  { id: "arrival", label: "Arrival", hash: "" },
  { id: "culture", label: "Culture", hash: "#culture" },
  { id: "history", label: "History", hash: "#history" },
  { id: "memes", label: "Memes", hash: "/memes" },
  { id: "token", label: "Token", hash: "#token" },
] as const;

export function SiteHeader({ site, logo }: SiteHeaderProps) {
  const pathname = usePathname();
  const onMemes = pathname === "/memes" || pathname === "/memes/";
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const name = site.identity.name ?? "Return to Monke";
  const ticker = site.identity.ticker ?? "$PUNCHSTER";

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>("a");
    first?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function hrefFor(item: (typeof NAV)[number]) {
    if (item.id === "memes") return "/memes";
    if (item.id === "arrival") return onMemes ? "/" : "/#story";
    return onMemes ? `/${item.hash}` : item.hash;
  }

  const socials = [
    { href: site.community.telegramUrl, label: "Telegram", icon: <TelegramIcon /> },
    { href: site.community.xUrl, label: "X", icon: <XIcon /> },
    { href: site.community.dextoolsUrl, label: "DEXTools", icon: <DextoolsIcon /> },
    { href: site.community.dexscreenerUrl, label: "DEXScreener", icon: <DexscreenerIcon /> },
  ];

  return (
    <header className="site-header">
      <a className="brand" href={onMemes ? "/" : "/#story"}>
        <Image
          className="brand-logo"
          src={logo.src}
          alt=""
          width={logo.width}
          height={logo.height}
        />
        <span className="brand-name">
          {name}
          <span className="ticker">{ticker}</span>
        </span>
      </a>
      <button
        ref={buttonRef}
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav
        id={menuId}
        ref={panelRef}
        className={open ? "section-nav is-open" : "section-nav"}
        aria-label="Sections"
      >
        {NAV.map((item) => {
          const current = item.id === "memes" ? onMemes : false;
          return (
            <a
              key={item.id}
              href={hrefFor(item)}
              aria-current={current ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
      <span className="header-socials">
        {socials.map((item) =>
          item.href ? (
            <a key={item.label} href={item.href} aria-label={item.label} target="_blank" rel="noopener noreferrer">
              {item.icon}
            </a>
          ) : (
            <button key={item.label} type="button" aria-label={item.label}>
              {item.icon}
            </button>
          ),
        )}
      </span>
    </header>
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
