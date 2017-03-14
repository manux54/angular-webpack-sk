import { animate, AnimationEntryMetadata, keyframes, state, style, transition, trigger } from "@angular/core";

export const notificationsAnimations: AnimationEntryMetadata[] = [
  trigger("notificationPaneTrigger", [
    state("hidden", style({
      display: "none",
      opacity: 0,
      zIndex: -1,
    })),
    state("active", style({
      opacity: 1,
      zIndex: 9998,
    })),
    transition("hidden => active", animate("250ms ease-out")),
    transition("active => hidden", animate("250ms ease-in")),
  ]),
  trigger("notificationToastTrigger", [
    state("hidden", style({
      display: "none",
      opacity: 0,
      transform: "translate(300px)",
      zIndex: -1,
    })),
    state("showing", style({
      opacity: 1,
      transform: "translate(0)",
      zIndex: 9997,
    })),
    state("active", style({
      opacity: 1,
      zIndex: 9997,
    })),
    state("mouseover", style({
      opacity: 1,
      zIndex: 9997,
    })),
    state("hiding", style({
      opacity: 0,
      transform: "translate(300px)",
      zIndex: 9997,
    })),
    transition("hidden => showing", animate("250ms ease-out")),
    transition("showing => active", animate(2000)),
    transition("active => hiding", animate("250ms ease-in")),
  ]),
];
