"use client";

import { useRef } from "react";
import story from "../../content/story.json";
import copy from "../../content/roadster-copy.json";

type Beat = {
  id: string;
  title: string;
  speaker: string | null;
  dialogue: string | null;
  screen?: string;
  description: string;
  imageId: string | null;
};

const beats = story as Beat[];

export function StoryBoard() {
  const listRef = useRef<HTMLOListElement>(null);

  function move(direction: 1 | -1) {
    const list = listRef.current;
    if (!list) return;
    const cards = Array.from(list.querySelectorAll<HTMLElement>("[data-beat]"));
    const current = cards.findIndex((card) => card === document.activeElement || card.contains(document.activeElement));
    const nextIndex = current < 0 ? (direction === 1 ? 0 : cards.length - 1) : Math.min(cards.length - 1, Math.max(0, current + direction));
    const next = cards[nextIndex];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    next?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduce ? "auto" : "smooth" });
    next?.focus();
  }

  return (
    <section id="story" className="rd-section" aria-labelledby="story-heading">
      <p className="eyebrow">{copy.story.eyebrow}</p>
      <h2 id="story-heading">{copy.story.heading}</h2>
      <div className="story-controls">
        <button type="button" className="button button-ink" onClick={() => move(-1)}>
          Previous
        </button>
        <button type="button" className="button" onClick={() => move(1)}>
          Next
        </button>
      </div>
      <ol ref={listRef} className="story-grid">
        {beats.map((beat, index) => (
          <li key={beat.id} className="story-card" data-beat tabIndex={-1}>
            <p className="story-index">{String(index + 1).padStart(2, "0")}</p>
            <h3>{beat.title}</h3>
            {beat.speaker && beat.dialogue ? (
              <p className="story-line">
                <span>{beat.speaker}</span>
                {beat.dialogue}
              </p>
            ) : null}
            {beat.screen ? <p className="story-screen">{beat.screen}</p> : null}
            <p>{beat.description}</p>
          </li>
        ))}
      </ol>
      <p className="story-bridge">{copy.story.bridge}</p>
    </section>
  );
}
