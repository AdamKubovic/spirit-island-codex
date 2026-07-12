# 14 — The phone fixes

Status: blocked
Type: wayfinder:task (AFK)
Parent: [v4 map](../MAP.md) · Spec: [PRD.md](../PRD.md)

## What to build

The owner wants to hand his phone across the table to a friend. Fix what [#07](07-responsive-audit.md)
actually found, worst-first — not what a CSS file suggests might be wrong.

**Desktop is untouched.** The owner chose "nothing breaks at 375px" over a phone-first shell, and he
likes the command deck exactly as it is. Every fix is checked at desktop width too, and a fix that
costs the desktop layout is not a fix.

The nav is the suspected hard part: the app shell is a persistent sidebar built when there was one
big surface, and v4 adds a second. If #07's findings force a real decision there rather than a
tweak, **stop and raise it** — that is a design question, and this ticket does not have the standing
to answer it alone.

## Acceptance criteria

- [ ] Every finding from #07 is either fixed or explicitly closed with a reason
- [ ] No horizontal scrolling on any surface at 375×667 and 390×844
- [ ] Every tab is reachable
- [ ] Modals — spirit detail, card viewer — fit on screen and dismiss
- [ ] Tap targets are big enough to hit
- [ ] The desktop layout is unchanged, checked side by side, not assumed
- [ ] Verified with real screenshots at both widths, before and after

## Blocked by

- [07 — What actually breaks at 375px](07-responsive-audit.md)
