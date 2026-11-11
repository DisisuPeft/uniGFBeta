---
type: decisions-log
title: uniGFBeta — Decisions log
description: Append-only. Every significant decision, the options considered, and why.
tags: [sdd, decisions]
topic: sdd
---

# Decisions log

| Date | Decision | Options considered | Why |
|------|----------|---------------------|-----|
| 2026-11-11 | Ratified initial constitution v1.0.0, no automated test suite yet. | (a) no tests, verify via tsc/eslint/build/manual browser check; (b) adopt Vitest now as part of the LMS feature; (c) leave open until `plan`. | User picked (a) explicitly — ship the LMS feature first, raise the quality bar later without blocking it. |
| 2026-11-11 | Disabled `gitmoji-guard` for this project (`.rsc/.no-gitmoji`). | Keep enforced / disable. | User writes their own commits and does not want a gitmoji convention enforced. Local-only (`.rsc/` is gitignored) — not a team-wide decision. |
| 2026-11-11 | No AI attribution in any commit or PR, ever. | N/A — explicit, repeated instruction. | User directive; also a fixed rsc constitution principle independent of this. |
