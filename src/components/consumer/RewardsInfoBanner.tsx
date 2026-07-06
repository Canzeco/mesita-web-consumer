"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Percent, Crown, ChevronDown, ChevronRight } from "lucide-react";

// Brief explainer at the top of the Rewards surface (above the QR / Tickets
// toggle). What the rewards program is (instant discounts at the check) and
// what Premium adds on top.
//
// Repeat-visit hierarchy: the QR passport below is the job of this page, so the
// explainer expands full on first run, then collapses to a single tappable
// "How rewards work ›" row once dismissed. The dismissal persists in
// localStorage so returning users get the passport above the fold; they can
// re-expand anytime.
//
// Light-theme premium treatment — a branded gradient tint + tinted icon
// circles, semantic tokens only (no bg-zinc/text-white on the surface).
// Discounts-only language: never "cashback"/"wallet" — Mesita holds no money,
// the discount lands straight on the bill.

const DISMISS_KEY = "mesita:rewards:howto-dismissed";

// useSyncExternalStore keeps the hydration render on the server snapshot
// (expanded) so markup matches, then swaps in the stored value — no
// setState-in-effect cascade (see the profile flags helper).
const dismissListeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  dismissListeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    dismissListeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readDismissed(): boolean {
  try {
    return window.localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

function writeDismissed(on: boolean) {
  try {
    window.localStorage.setItem(DISMISS_KEY, on ? "1" : "0");
  } catch {
    // best-effort persistence
  }
  dismissListeners.forEach((l) => l());
}

export function RewardsInfoBanner() {
  const dismissed = useSyncExternalStore(subscribe, readDismissed, () => false);
  const collapse = useCallback(() => writeDismissed(true), []);
  const expand = useCallback(() => writeDismissed(false), []);

  if (dismissed) {
    return (
      <button
        type="button"
        onClick={expand}
        aria-expanded={false}
        className="border-border/70 text-muted-foreground hover:text-foreground flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-[12.5px] font-semibold transition"
      >
        <span>How rewards work</span>
        <ChevronRight className="h-4 w-4 shrink-0" />
      </button>
    );
  }

  return (
    <div className="border-border/70 from-primary/5 via-secondary/5 to-accent/5 rounded-2xl border bg-gradient-to-br p-3.5">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-[10px] font-bold tracking-[0.16em] uppercase">
          How Rewards work
        </p>
        <button
          type="button"
          onClick={collapse}
          aria-expanded={true}
          aria-label="Collapse how rewards work"
          className="text-muted-foreground hover:text-foreground -mr-1 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold transition"
        >
          Got it
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-2.5 space-y-2.5">
        <div className="flex items-start gap-2.5">
          <span className="bg-secondary/12 text-secondary flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
            <Percent className="h-4 w-4" strokeWidth={2.25} />
          </span>
          <p className="text-foreground text-[12.5px] leading-snug">
            <span className="font-semibold">Instant discounts.</span>{" "}
            <span className="text-muted-foreground">
              Show your QR or 8-digit code when you ask for the check — the
              discount comes straight off the bill. Mesita never holds your
              money.
            </span>
          </p>
        </div>

        <div className="flex items-start gap-2.5">
          <span className="bg-tier-premium flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white">
            <Crown className="h-4 w-4 fill-current" />
          </span>
          <p className="text-foreground text-[12.5px] leading-snug">
            <span className="font-semibold">Premium boosts them.</span>{" "}
            <span className="text-muted-foreground">
              Free gets the base discount; Premium unlocks bigger discounts.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
