"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Shared enter/exit choreography for every overlay in the app (slide-overs,
// bottom sheets, centered dialogs). One hook so all overlays animate with the
// same timing and none of them forget the exit half.
//
// `open` drives the CSS transition classes; `requestClose` plays the exit
// transition and only then fires `onExited` (router.back() for route modals,
// setState(false) for local overlays). Guarded so double-taps and
// ESC+backdrop races can't fire onExited twice.

// Must be >= the longest overlay CSS transition (duration-300) so the exit
// finishes painting before onExited unmounts the tree.
export const OVERLAY_MS = 320;

// iOS-style decelerating push curve, shared by panel + sheet transitions.
export const OVERLAY_EASE = "ease-[cubic-bezier(0.32,0.72,0,1)]";

export function useOverlayPresence(
  onExited: () => void,
  { escapeEnabled = true }: { escapeEnabled?: boolean } = {},
) {
  const [open, setOpen] = useState(false);
  const closing = useRef(false);
  const exitTimer = useRef<number | null>(null);
  const onExitedRef = useRef(onExited);

  // Latest-ref pattern kept inside an effect (the React 19 compiler lint
  // forbids ref writes during render).
  useEffect(() => {
    onExitedRef.current = onExited;
  });

  useEffect(() => {
    // Double rAF: let the closed-state frame (translate-x-full / opacity-0)
    // actually paint before flipping to open, otherwise the browser batches
    // both states into one style resolution and the enter transition never
    // plays — the overlay just pops in (the exact bug this file exists for).
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setOpen(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
      if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
    };
  }, []);

  const requestClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setOpen(false);
    exitTimer.current = window.setTimeout(
      () => onExitedRef.current(),
      OVERLAY_MS,
    );
  }, []);

  // ESC closes — every overlay. `escapeEnabled: false` detaches the listener
  // when the overlay is rendered-but-hidden (the stale-slot guard case), so
  // ESC on the underlying page can't fire a surprise router.back().
  useEffect(() => {
    if (!escapeEnabled) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") requestClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [escapeEnabled, requestClose]);

  return { open, requestClose };
}
