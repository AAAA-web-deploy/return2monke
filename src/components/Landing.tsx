import Image from "next/image";
import { HeroArt } from "@/components/HeroArt";
import { HistoryStation } from "@/components/HistoryStation";
import { SiteHeader } from "@/components/SiteHeader";
import { StoryBoard } from "@/components/StoryBoard";
import { TokenDesk } from "@/components/TokenDesk";
import type { ContentModel } from "@/lib/types";
import copy from "../../content/roadster-copy.json";

type LandingProps = {
  content: ContentModel;
};

export function Landing({ content }: LandingProps) {
  const { site, assets, copy: labels, history } = content;
  const hero = assets["brand-banner"];

  return (
    <>
      <a className="skip-link" href="#story">
        Skip to the story
      </a>
      <SiteHeader site={site} logo={assets["brand-logo"]} />
      <main>
        <section className="rd-hero" aria-labelledby="hero-heading">
          <div className="rd-hero-copy">
            <p className="eyebrow">{copy.hero.eyebrow}</p>
            <h1 id="hero-heading" className="display">
              {copy.hero.headline}
            </h1>
            <p className="lede">{copy.hero.body}</p>
            <p className="identity-line">
              {site.identity.name} <span>{site.identity.ticker}</span>
            </p>
            <div className="hero-actions">
              <a className="button" href="#story">
                {copy.hero.primaryCta}
              </a>
              <a className="button button-ink" href="/memes">
                {copy.hero.secondaryCta}
              </a>
            </div>
          </div>
          <HeroArt>
            <Image
              src={hero.src}
              alt={hero.alt}
              width={hero.width}
              height={hero.height}
              loading="eager"
              sizes="(max-width: 899px) 100vw, 58vw"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          </HeroArt>
        </section>

        <StoryBoard />

        <section id="culture" className="rd-section" aria-labelledby="culture-heading">
          <h2 id="culture-heading">{copy.culture.heading}</h2>
          <p className="lede">{copy.culture.intro}</p>
          <ul className="culture-grid">
            {copy.culture.cards.map((card) => (
              <li key={card.title} className="rd-card">
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="history" className="rd-section" aria-labelledby="history-heading">
          <h2 id="history-heading">{copy.history.heading}</h2>
          <p className="lede">{copy.history.intro}</p>
          <HistoryStation copy={labels.history} records={history} assets={assets} initialYear={site.event.edition} />
        </section>

        <section id="token" className="rd-section" aria-labelledby="token-heading">
          <h2 id="token-heading">{copy.token.heading}</h2>
          <p className="lede">{copy.token.body}</p>
          <TokenDesk site={site} copy={labels.token} />
        </section>
      </main>
      <footer className="site-footer">
        <p>{copy.footer.credit}</p>
        <p>{copy.footer.notice}</p>
      </footer>
    </>
  );
}
