"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";

/**
 * The nontechnical blurb + tech tags are always visible above this
 * (per the design brief), so in practice this toggle shows/hides just the
 * technical section rather than switching between two equally-weighted
 * panels. Built as a two-option segmented control, not a tab bar.
 */
export function OverviewToggle({
  technicalContent,
}: {
  technicalContent: ReactNode;
}) {
  const [showTechnical, setShowTechnical] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-5">
      <div
        role="tablist"
        aria-label="Project description detail"
        className="inline-flex w-fit rounded-full border border-border-subtle bg-surface-raised p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={!showTechnical}
          onClick={() => setShowTechnical(false)}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            !showTechnical ? "bg-accent text-surface" : "text-secondary hover:text-primary"
          }`}
        >
          Overview
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={showTechnical}
          onClick={() => setShowTechnical(true)}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            showTechnical ? "bg-accent text-surface" : "text-secondary hover:text-primary"
          }`}
        >
          Technical Details
        </button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {showTechnical && (
          <motion.div
            key="technical"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {technicalContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
