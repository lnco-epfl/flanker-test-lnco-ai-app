---
name: 260415-h3b Context
description: Decisions for adding structured randomization rules to flanker task
type: project
---

# Quick Task 260415-h3b: Add structured randomization rules for flanker task trials - Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

<domain>
## Task Boundary

Add structured randomization rules to `generateFlankerSequence` in `experiment-state-class.ts`, applied to both practice and main task sequences:

1. **Equal condition split** — exactly 1/3 congruent, 1/3 incongruent, 1/3 neutral (33:33:33)
2. **Equal direction balance** — exactly half left, half right responses
3. **Max 3 in a row** — no more than 3 consecutive trials with the same condition (congruent/incongruent/neutral) AND no more than 3 consecutive trials with the same response direction (left/right) — these two constraints are checked independently

</domain>

<decisions>
## Implementation Decisions

### 33:33:33 vs. settings
- **Always enforce exact equal thirds** regardless of the admin-configured `congruentPercentage` / `incongruentPercentage` settings. The percentage settings are effectively ignored for condition splitting.

### Remainder handling (odd trial counts)
- When `n % 3 !== 0`, the extra trial(s) are assigned to a **randomly selected condition** each run (not deterministic). Same principle for odd left/right splits.

### Max-3 enforcement
- **Relax constraint automatically**: if no valid sequence is found within a fixed attempt budget (e.g. 1000 tries), increment the max-run limit from 3 → 4 → 5 until a valid sequence is found. No hard failure, no silent best-effort.

### Claude's Discretion
- Algorithm choice for enforcing max-run (retry-shuffle vs. deterministic interleaving) — use retry-shuffle (Fisher-Yates) since it's simpler and works well for the trial counts in this experiment
- Whether to also update `initializePracticeSequence` and `initializeMainSequence` — yes, both use `generateFlankerSequence` so the fix is automatic
- The `congruentPercentage` / `incongruentPercentage` settings UI in the admin panel can remain as-is; the parameters are simply ignored by the new algorithm

</decisions>

<specifics>
## Specific Ideas

- The max-3 constraint applies **independently** to condition type AND direction — e.g. "LLLR..." is fine for conditions but would still be checked for direction independently
- Both practice and main task sequences go through `generateFlankerSequence`, so changes to that function cover both automatically
- The relaxation strategy: try max_run=3 first (up to N attempts), then increment to max_run=4, etc.

</specifics>
