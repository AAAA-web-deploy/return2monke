"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { AssetsConfig } from "@/lib/types";
import gallery from "../../content/gallery.json";
import copy from "../../content/roadster-copy.json";

const TITLES: Record<string, string> = {
  "meme-01-roadster": "Wrong Turn. Right Species.",
  "meme-02-toy": "Small Toy. Big Monke Energy.",
  "meme-03-evolution": "Millions of Years. One Gas Pedal.",
  "reaction-01-excited": "Zero Thoughts. Full Throttle.",
  "reaction-02-shocked": "That Wasn't the Exit.",
  "reaction-03-confused": "Who Set This GPS?",
  "reaction-04-smug": "Navigation Was Never the Problem.",
  "reaction-05-angry": "Who Hit the Brakes?!",
  "reaction-06-deadpan": "Peak Civilization. Apparently.",
};

type MemeGalleryProps = {
  assets: AssetsConfig;
};

export function MemeGallery({ assets }: MemeGalleryProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [captionId, setCaptionId] = useState(gallery.reactions[0]);
  const [caption, setCaption] = useState(gallery.captions[0]);
  const [captionUrl, setCaptionUrl] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const active = activeId ? assets[activeId] : null;
  const captionAsset = assets[captionId];

  useEffect(() => {
    if (!activeId) return;
    const dialog = dialogRef.current;
    const items = () =>
      Array.from(dialog?.querySelectorAll<HTMLElement>("a, button") ?? []).filter((item) => !item.hasAttribute("disabled"));
    items()[0]?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveId(null);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = items();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      openerRef.current?.focus();
    };
  }, [activeId]);

  useEffect(() => {
    let cancelled = false;
    const currentCaption = caption;
    const currentSrc = captionAsset.src;
    async function draw() {
      await document.fonts.ready;
      const response = await fetch(currentSrc);
      if (!response.ok) throw new Error(`Could not load ${currentSrc}`);
      const bitmap = await createImageBitmap(await response.blob());
      if (cancelled) {
        bitmap.close();
        return;
      }
      const band = Math.round(bitmap.height * 0.18);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height + band;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable");
      context.drawImage(bitmap, 0, 0);
      context.fillStyle = "#F6EAD5";
      context.fillRect(0, bitmap.height, bitmap.width, band);
      context.fillStyle = "#16202B";
      context.font = `700 ${Math.round(bitmap.width * 0.055)}px "Barlow Condensed", Impact, sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(currentCaption, bitmap.width / 2, bitmap.height + band / 2);
      bitmap.close();
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob || cancelled) return;
      const url = URL.createObjectURL(blob);
      setCaptionUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return url;
      });
    }
    draw().catch(() => {
      if (!cancelled) setCaptionUrl(null);
    });
    return () => {
      cancelled = true;
    };
  }, [caption, captionAsset.src]);

  useEffect(() => {
    return () => {
      setCaptionUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return null;
      });
    };
  }, []);

  function openImage(id: string, opener: HTMLElement) {
    openerRef.current = opener;
    setActiveId(id);
  }

  const lead = gallery.features[0];
  const rest = gallery.features.slice(1);

  return (
    <div id="gallery">
      <header className="rd-section gallery-intro">
        <h1>{copy.memes.heading}</h1>
        <p className="lede">{copy.memes.intro}</p>
      </header>

      <section className="rd-section" aria-labelledby="features-heading">
        <h2 id="features-heading">{copy.memes.featuresHeading}</h2>
        <figure className="feature-frame feature-lead">
          <GalleryImage id={lead} assets={assets} />
          <figcaption>{TITLES[lead]}</figcaption>
          <FrameActions id={lead} assets={assets} onOpen={openImage} />
        </figure>
        <div className="feature-row">
          {rest.map((id) => (
            <figure key={id} className="feature-frame">
              <GalleryImage id={id} assets={assets} />
              <figcaption>{TITLES[id]}</figcaption>
              <FrameActions id={id} assets={assets} onOpen={openImage} />
            </figure>
          ))}
        </div>
      </section>

      <section className="rd-section" aria-labelledby="reactions-heading">
        <h2 id="reactions-heading">{copy.memes.reactionsHeading}</h2>
        <ul className="reaction-grid">
          {gallery.reactions.map((id) => (
            <li key={id}>
              <figure className="feature-frame">
                <GalleryImage id={id} assets={assets} />
                <figcaption>{TITLES[id]}</figcaption>
                <FrameActions id={id} assets={assets} onOpen={openImage} />
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section className="rd-section" aria-labelledby="caption-heading">
        <h2 id="caption-heading">{copy.memes.generatorHeading}</h2>
        <p>The caption sits in a band under the picture, clear of the faces, the car, and the PUNCHSTER lettering.</p>
        <div className="caption-layout">
          <div>
            <fieldset>
              <legend>Picture</legend>
              <div className="caption-choices">
                {[...gallery.features, ...gallery.reactions].map((id) => (
                  <label key={id}>
                    <input
                      type="radio"
                      name="caption-image"
                      checked={captionId === id}
                      onChange={() => setCaptionId(id)}
                    />
                    {TITLES[id]}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Caption</legend>
              <div className="caption-choices">
                {gallery.captions.map((line) => (
                  <label key={line}>
                    <input type="radio" name="caption-line" checked={caption === line} onChange={() => setCaption(line)} />
                    {line}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          <div>
            {captionUrl ? (
              // The captioned file is generated in the browser from a local image.
              // eslint-disable-next-line @next/next/no-img-element
              <img className="caption-preview" src={captionUrl} alt={`${captionAsset.alt} Caption: ${caption}`} />
            ) : (
              <p>Preparing the captioned image.</p>
            )}
            {captionUrl ? (
              <a className="button" href={captionUrl} download={`${captionId}-caption.png`}>
                Download captioned image
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {active && activeId ? (
        <div className="dialog-backdrop" role="presentation" onClick={() => setActiveId(null)}>
          <div
            ref={dialogRef}
            className="image-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id={titleId}>{TITLES[activeId]}</h2>
            <Image
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              sizes="90vw"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
            <div className="hero-actions">
              <a className="button" href={active.src} download>
                {copy.memes.downloadLabel}
              </a>
              <button type="button" className="button button-ink" onClick={() => setActiveId(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function GalleryImage({ id, assets }: { id: string; assets: AssetsConfig }) {
  const asset = assets[id];
  return (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      sizes="(max-width: 767px) 100vw, 50vw"
      style={{ width: "100%", height: "auto", objectFit: "contain" }}
    />
  );
}

function FrameActions({
  id,
  assets,
  onOpen,
}: {
  id: string;
  assets: AssetsConfig;
  onOpen: (id: string, opener: HTMLElement) => void;
}) {
  return (
    <div className="hero-actions">
      <button type="button" className="button" onClick={(event) => onOpen(id, event.currentTarget)}>
        {copy.memes.zoomLabel}
      </button>
      <a className="button button-ink" href={assets[id].src} download>
        {copy.memes.downloadLabel}
      </a>
    </div>
  );
}
