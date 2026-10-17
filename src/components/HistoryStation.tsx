"use client";

import Image from "next/image";
import { useId, useState, type KeyboardEvent } from "react";
import type { AssetsConfig, CopyContent, HistoryRecord } from "@/lib/types";
import { formatCalendarDate } from "@/lib/presentation";

type HistoryStationProps = {
  copy: CopyContent["history"];
  records: HistoryRecord[];
  assets: AssetsConfig;
  initialYear: number;
};

export function HistoryStation({ copy, records, assets, initialYear }: HistoryStationProps) {
  const [year, setYear] = useState(initialYear);
  const panelId = useId();
  const selected = records.find((record) => record.year === year) ?? records[records.length - 1];
  const asset = assets[selected.assetId];
  const sourceHost = new URL(selected.sourceUrl).host;

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const key = event.key;
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"].includes(key)) return;
    event.preventDefault();
    const index = records.findIndex((record) => record.year === selected.year);
    let next = index;
    if (key === "ArrowRight" || key === "ArrowDown") next = (index + 1) % records.length;
    if (key === "ArrowLeft" || key === "ArrowUp") next = (index - 1 + records.length) % records.length;
    if (key === "Home") next = 0;
    if (key === "End") next = records.length - 1;
    const nextYear = records[next].year;
    setYear(nextYear);
    requestAnimationFrame(() => {
      document.getElementById(`edition-${nextYear}`)?.focus();
    });
  }

  return (
    <div className="history-layout">
      <div role="tablist" aria-label={copy.heading.join(" ")} className="year-list" onKeyDown={onKeyDown}>
        {records.map((record) => {
          const isSelected = record.year === selected.year;
          return (
            <button
              key={record.year}
              id={`edition-${record.year}`}
              type="button"
              role="tab"
              className={isSelected ? "year-tab is-selected" : "year-tab"}
              aria-selected={isSelected}
              aria-controls={panelId}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setYear(record.year)}
            >
              <span className="year-tab-year">{record.year}</span>
              <span className="year-tab-city">{record.city}</span>
            </button>
          );
        })}
      </div>
      <div role="tabpanel" id={panelId} aria-labelledby={`edition-${selected.year}`} className="history-panel" tabIndex={0}>
        <figure className="souvenir-frame">
          <Image
            src={asset.src}
            alt={asset.alt}
            width={asset.width}
            height={asset.height}
            sizes="(max-width: 899px) 86vw, 440px"
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
          />
          <figcaption>{selected.object}</figcaption>
        </figure>
        <div className="history-copy">
          <p className="chapter-kicker">
            {selected.year} · {selected.city}
          </p>
          <h3>{selected.title}</h3>
          <article className="fact-sheet">
            <h4>{copy.factLabel}</h4>
            <p>{selected.fact}</p>
            <p>
              <a href={selected.sourceUrl} target="_blank" rel="noopener noreferrer">
                {copy.sourceLabel}
                <span className="source-host">{sourceHost}</span>
              </a>
            </p>
            <p className="verified">
              {copy.verifiedLabel} {formatCalendarDate(selected.verifiedAt)}
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
