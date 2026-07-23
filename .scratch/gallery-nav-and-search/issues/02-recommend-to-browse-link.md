Status: done

# Recommend → Browse deep link

## Parent

.scratch/gallery-nav-and-search/PRD.md

## What to build

Clicking a spirit or configuration in the Recommend tab's survey results should switch the owner
straight to the Browse tab and open that exact configuration's detail modal immediately — rather
than requiring the owner to manually switch tabs and find the spirit again. When the clicked
result was a specific aspect, the opened modal highlights/scrolls to that aspect using the same
mechanism the modal already uses when opened from an aspect tile in the Browse grid. When the
clicked result was a base spirit, the modal opens with no aspect highlighted.

## Acceptance criteria

- [ ] Clicking any recommended spirit/configuration in Recommend results switches the active tab
      to Browse.
- [ ] On arrival, that spirit's detail modal is already open — the owner does not need to click
      the tile themselves.
- [ ] When the recommendation was for a specific aspect, the opened modal highlights/scrolls to
      that aspect.
- [ ] When the recommendation was for the base spirit, the opened modal shows no aspect
      highlighted.
- [ ] This works for every result in the list, not only the top recommendation.

## Blocked by

None — can start immediately.

## Comments

Implemented and tests added in `src/components/__tests__/appSmoke.test.tsx`.
