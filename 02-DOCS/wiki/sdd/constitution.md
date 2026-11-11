---
type: constitution
title: uniGFBeta (Farrera Academy) — Constitution
description: The non-negotiable principles every rsc-sdd phase obeys.
tags: [sdd, constitution]
timestamp: 2026-11-11T00:00:00Z
topic: sdd
version: v1.0.0
---

# uniGFBeta (Farrera Academy) — Constitution

> Version: v1.0.0 · Ratified: 2026-11-11 · Last amended: 2026-11-11
> The non-negotiable principles every rsc-sdd phase obeys.

## 1. Stack canon

1. TypeScript strict mode, on Next.js 16 (App Router) + React 19. Pinned in `package.json`.
   `tsconfig.json` keeps `"strict": true` — never loosened to land a feature faster.
2. This repo is frontend-only. All persistence goes through an external Django REST
   backend reached via RTK Query (`redux/services/apiSlice.ts`, `fetchBaseQuery`). No local
   API routes, no local database, ever — a "missing endpoint" is a backend conversation,
   never a Next.js API route invented to route around it.
3. Package manager: pnpm. `pnpm-lock.yaml` is the lockfile of record and is committed.
4. Tailwind v4 + shadcn/ui (Base UI primitives, Nova preset) is the UI primitive layer going
   forward for new components. Existing MUI/`react-icons`/`@phosphor-icons` usage is legacy
   and stays as-is where already working — not ripped out wholesale to chase consistency.

## 2. Quality bar

5. `npx tsc --noEmit` passes with zero errors before any change is considered done.
6. `eslint` (flat config, `eslint.config.mjs`) introduces zero new errors. Pre-existing
   warnings are tracked separately and are not a blocker on unrelated changes.
7. **No automated test suite exists yet** (ratified choice, 2026-11-11 — see `decisions.md`).
   Until one is adopted, a change ships when: `tsc` and `eslint` are clean, `pnpm run build`
   succeeds, and — for any UI-visible change — the feature was actually exercised in a
   running browser session, not just compiled. "It compiles" is never reported as "it works."

## 3. Conventions

8. Domain naming follows the codebase's established language: domain entities, props and
   variables for the LMS domain stay in Spanish (`curso`, `modulo`, `tema`, `bloque`,
   `inscripcion`...), matching every existing slice and component. Do not anglicize mid-file.
9. Block-type dispatch is always by `tipo_codigo` (the backend catalog's stable code), with an
   explicit fallback branch for unrecognized codes. `tipo_nombre` is a display label only —
   it is never used to decide what to render or which form fields to show.
10. RTK Query list endpoints: a catalog/select-feeding endpoint, or a content list rendered
    in full with no pagination UI, uses `?pagination=false` and returns `T[]` directly. An
    endpoint backing a paginated admin table, or a genuine remote-search combobox, keeps the
    paginated `{count, next, previous, results}` shape. Never add `pagination=false` to an
    endpoint shared with a paginated table without splitting it into two endpoints first.
11. No fixed commit-message format is enforced (the gitmoji guard was explicitly disabled at
    the user's request — see `decisions.md`). The user writes their own commits.

## 4. Branching & shipping

12. Work happens straight on `main` (ratified at `rsc onboard`, `workflow: main`). No branch,
    no PR is required for this repo — direct commits are the normal path.
13. **Git authorship is the human's.** No `Co-Authored-By` an AI, no "generated with" footer,
    in any commit or PR, ever — reaffirmed explicitly and repeatedly by the user this session.

## 5. Security & privacy floor

14. No secret is ever committed. `.env*` stays gitignored; real values live only in the
    developer's local `.env`.
15. There is exactly one authentication mechanism — whatever JWT/cookie flow already runs
    through `apiSlice.ts`/`Setup`. No second, parallel auth mechanism is ever introduced.
16. **The backend is the sole source of truth for learning progression and accreditation.**
    `Inscripcion.completado_at` (or the equivalent server field) is the only thing that marks
    a course/tema/evaluation complete. The frontend never locally computes "100% progress"
    and treats that as completion — it reflects the server's verdict, it does not compute one.

## 6. UX / accessibility floor

17. Every interactive control is keyboard-navigable with a visible focus state. shadcn/Base UI
    primitives already provide this — a custom unstyled control that regresses it is a defect.
18. Every data-driven view ships loading, empty, and error states — not just the happy path.

## 7. Domain architecture (block renderer & content model)

19. `app/components/plataforma/bloque-renderer.tsx` (`BlockRenderer`) is the single
    implementation of per-block-type rendering. A new rendering context (constructor editor,
    live preview, learner playback) reuses it through an explicit mode, never a parallel
    reimplementation of the same type-dispatch switch.
20. No endpoint is invented that the backend has not confirmed. A pedagogical gating/locking
    UI (e.g. "complete the video to unlock the next tema") is only built once a real server
    field backs it — never simulated as if the server had already decided it.
21. Folder reorganization (e.g. toward a `features/` layout) happens incrementally, one
    feature at a time, justified by that feature's own `plan` — never as a standalone,
    project-wide rewrite.

## 8. Knowledge & decisions

22. Every significant decision is appended to `02-DOCS/wiki/sdd/decisions.md` (date, options
    considered, why). This constitution is the highest-order decision record.

## Definition of Done (the merge bar `verify` runs against)

A change ships only when ALL hold:

- [ ] `tsc --noEmit` clean (principle 5).
- [ ] `eslint` introduces no new errors (principle 6).
- [ ] `pnpm run build` succeeds; UI changes were exercised in a running browser, not just
      compiled (principle 7).
- [ ] Conventions followed: Spanish domain naming, `tipo_codigo` dispatch, correct
      pagination shape (principles 8-11).
- [ ] Committed straight to `main`, authored by the human, no AI trailer (principles 12-13).
- [ ] No secret committed; single auth mechanism preserved (principles 14-15).
- [ ] Backend remains sole source of truth for progression/accreditation (principle 16).
- [ ] Keyboard/focus accessible; loading/empty/error states present (principles 17-18).
- [ ] `BlockRenderer` reused, not forked, for any new rendering context (principle 19).
- [ ] No invented endpoint; no simulated server-side gating (principle 20).
- [ ] Significant decisions logged (principle 22).

## Amendment log (append-only)

| Date | Version | Change | Why |
|------|---------|--------|-----|
| 2026-11-11 | v1.0.0 | Ratified initial constitution. | Kickoff of the Farrera Academy LMS frontend feature (ASDD entry point); formalizes rules already established in practice this session (block dispatch by `tipo_codigo`, pagination split, no AI commit attribution, backend as progression source of truth). |
