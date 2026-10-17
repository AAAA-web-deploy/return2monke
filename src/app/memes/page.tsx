import type { Metadata } from "next";
import { MemeGallery } from "@/components/MemeGallery";
import { SiteHeader } from "@/components/SiteHeader";
import { loadContent } from "@/lib/content";
import copy from "../../../content/roadster-copy.json";

export const metadata: Metadata = {
  title: `${copy.memes.heading} · Return to Monke`,
  description: copy.memes.intro,
};

export default function MemesPage() {
  const content = loadContent();
  return (
    <>
      <a className="skip-link" href="#gallery">
        Skip to the gallery
      </a>
      <SiteHeader site={content.site} />
      <main>
        <MemeGallery assets={content.assets} />
      </main>
      <footer className="site-footer">
        <p>{copy.footer.credit}</p>
        <p>{copy.footer.notice}</p>
      </footer>
    </>
  );
}
