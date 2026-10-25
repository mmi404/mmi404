"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

const SESSION_KEY = "mmi404-hero-seen";

/**
 * One-time first-visit text reveal for the hero headline/intro. Unlike the
 * generic <Reveal>, this isn't scroll-triggered (the hero is already in the
 * viewport on load) and must not replay on every navigation back to "/" —
 * Cache Components preserves route component state across client
 * navigations (React <Activity>), so a plain mount-based animation could
 * otherwise refire. sessionStorage makes "once per session" explicit.
 *
 * `items` are staggered in as a group on first visit only; on every
 * subsequent visit this session, they render immediately with no animation.
 */
export function HeroReveal({
  items,
  className,
  itemClassName,
}: {
  items: ReactNode[];
  className?: string;
  itemClassName?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [state, setState] = useState({ ready: false, shouldAnimate: false });
  const { ready, shouldAnimate } = state;

  useEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
      if (!seen) sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // sessionStorage unavailable (private mode, etc.) — just animate once.
      seen = false;
    }
    // Reading sessionStorage must happen post-mount, not during the lazy
    // initial state (which would run during server/hydration render, where
    // `window`/`sessionStorage` either don't exist or would desync the
    // server-rendered HTML from the client's first paint). This is a
    // deliberate one-time "sync with an external system on mount" read, the
    // documented exception to this rule, not a cascading-render bug.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ ready: true, shouldAnimate: !seen });
  }, []);

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.12 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Avoid a flash of invisible content before the effect resolves: render
  // the final, visible state until we know whether to animate.
  if (!ready || !shouldAnimate) {
    return (
      <div className={className}>
        {items.map((child, i) => (
          <div key={i} className={itemClassName}>
            {child}
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={container}
    >
      {items.map((child, i) => (
        <motion.div key={i} className={itemClassName} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
