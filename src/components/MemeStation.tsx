"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { AssetsConfig, CopyContent, MemeContent } from "@/lib/types";
import { canExport, completeRender, memeDownloadName, selectionKey } from "@/lib/presentation";

type MemeStationProps = {
  copy: CopyContent["memes"];
  memes: MemeContent;
  assets: AssetsConfig;
};

type ReadyBlob = {
  key: string;
  blob: Blob;
  filename: string;
};

export function MemeStation({ copy, memes, assets }: MemeStationProps) {
  const [reactionId, setReactionId] = useState(memes.reactions[0].id);
  const [caption, setCaption] = useState(memes.captions[0]);
  const [readyKey, setReadyKey] = useState<string | null>(null);
  const requestRef = useRef(0);
  const activeKeyRef = useRef("");
  const blobRef = useRef<ReadyBlob | null>(null);
  const reaction = memes.reactions.find((item) => item.id === reactionId) ?? memes.reactions[0];
  const asset = assets[reaction.assetId];
  const key = selectionKey(reaction.id, caption);
  const ready = canExport({ selectionKey: key, readyKey });

  useEffect(() => {
    const request = ++requestRef.current;
    const completedKey = key;
    activeKeyRef.current = completedKey;
    let cancelled = false;

    async function render() {
      const family = readDisplayFamily();
      const quoted = family.includes(" ") ? `"${family}"` : family;
      await document.fonts.load(`700 84px ${quoted}`);
      await document.fonts.ready;
      const response = await fetch(asset.src);
      if (!response.ok) throw new Error(`Could not load ${asset.src}`);
      const bitmap = await createImageBitmap(await response.blob());
      if (cancelled || request !== requestRef.current) {
        bitmap.close();
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1080;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable");
      drawMeme(context, bitmap, caption, quoted);
      bitmap.close();
      const png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!png || cancelled || request !== requestRef.current) return;
      const accepted = completeRender(activeKeyRef.current, completedKey);
      if (!accepted || request !== requestRef.current) return;
      blobRef.current = {
        key: accepted,
        blob: png,
        filename: memeDownloadName(reaction.id, caption),
      };
      setReadyKey(accepted);
    }

    render().catch(() => {
      if (request === requestRef.current) setReadyKey(null);
    });

    return () => {
      cancelled = true;
    };
  }, [asset.src, caption, key, reaction.id]);

  function onSave() {
    const currentKey = key;
    const current = blobRef.current;
    if (!canExport({ selectionKey: currentKey, readyKey }) || !current || current.key !== currentKey) return;
    const url = URL.createObjectURL(current.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = current.filename;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="meme-layout">
      <figure className="meme-sheet" aria-live="polite">
        <Image
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          sizes="(max-width: 899px) 86vw, 460px"
          style={{ width: "100%", height: "auto" }}
        />
        <figcaption className="display">{caption}</figcaption>
      </figure>
      <div className="meme-controls">
        <fieldset>
          <legend>{copy.expressionLabel}</legend>
          <div className="choice-row">
            {memes.reactions.map((item) => (
              <label key={item.id} className={item.id === reaction.id ? "choice is-selected" : "choice"}>
                <input
                  type="radio"
                  name="ape-expression"
                  value={item.id}
                  checked={item.id === reaction.id}
                  onChange={() => setReactionId(item.id)}
                />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>{copy.captionLabel}</legend>
          <div className="choice-row">
            {memes.captions.map((item) => (
              <label key={item} className={item === caption ? "choice is-selected" : "choice"}>
                <input
                  type="radio"
                  name="ape-caption"
                  value={item}
                  checked={item === caption}
                  onChange={() => setCaption(item)}
                />
                {item}
              </label>
            ))}
          </div>
        </fieldset>
        <button type="button" className="button button-coral" onClick={onSave} disabled={!ready}>
          {ready ? copy.saveLabel : copy.renderingLabel}
        </button>
        <p className="privacy">{copy.privacy}</p>
      </div>
    </div>
  );
}

function readDisplayFamily(): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim();
  const family = raw.split(",")[0]?.replace(/['"]/g, "").trim();
  return family || "Barlow Condensed";
}

function drawMeme(context: CanvasRenderingContext2D, bitmap: ImageBitmap, caption: string, family: string) {
  context.fillStyle = "#F6EAD5";
  context.fillRect(0, 0, 1080, 1080);
  context.fillStyle = "#F7C84A";
  context.fillRect(0, 0, 1080, 28);
  context.strokeStyle = "#16202B";
  context.lineWidth = 8;
  context.strokeRect(24, 24, 1032, 1032);

  const maxWidth = 860;
  const maxHeight = 720;
  const scale = Math.min(maxWidth / bitmap.width, maxHeight / bitmap.height);
  const width = bitmap.width * scale;
  const height = bitmap.height * scale;
  context.drawImage(bitmap, (1080 - width) / 2, 70 + (720 - height) / 2, width, height);

  context.fillStyle = "#16202B";
  context.textAlign = "center";
  context.textBaseline = "middle";
  let size = 84;
  do {
    context.font = `700 ${size}px ${family}`;
    if (context.measureText(caption).width <= 920 || size <= 40) break;
    size -= 4;
  } while (size > 40);
  context.fillText(caption, 540, 930);
  context.fillStyle = "#296F73";
  context.font = `700 22px ${family}`;
  context.fillText("ORIGINAL ILLUSTRATION", 540, 1000);
}
