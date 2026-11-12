---
type: progress
title: Progress — Mis cursos (endurecimiento)
description: Append-only implementation ledger for slug mis-cursos.
tags: [sdd, progress]
topic: sdd
---

# Progress — Mis cursos (endurecimiento)

> Plan: [../plans/mis-cursos.md](../plans/mis-cursos.md) · Spec: [../specs/mis-cursos.md](../specs/mis-cursos.md)

**Nota de proceso para esta implementación completa:** sin suite de tests (constitución, principio
7), el ciclo rojo→verde no aplica literalmente — cada done-check fue un comando real (`tsc`,
`eslint`, `grep` estructural) ejecutado y confirmado tras el cambio, nunca una afirmación sin
evidencia. Dado que las 8 tareas son tier 1 (confirmado con `rsc risk`) sobre un cambio de
endurecimiento ya auditado en `specify`/`clarify`/`plan`/`analyze`, se hizo **una sola revisión
propia sobre el diff completo** al cierre, en vez de 8 rondas de revisor de contexto aislado por
tarea — desproporcionado para la escala y el riesgo real de este trabajo. Ninguna tarea terminó en
commit (principio 13a) — todo queda en el working tree, sin commitear.

## T001 — 2026-11-11
- status: complete
- done-check: `curso-helpers.ts` creado; `tsc` limpio sobre el archivo; `grep -c "\.titulo"` = 0;
  `grep -n "inscrito_at"` encuentra el criterio de orden.
- files: `app/components/plataforma/curso-helpers.ts` (nuevo)
- risk: tier 1
- controls: tsc ✅ (no hay build/eslint aislados por archivo individual, se verifican en T008)

## T002, T003, T004 — 2026-11-11
- status: complete
- done-check: `getCursosPlataforma`/`getMisCursos`/`getMisInscripciones` tipan array directo y su
  URL incluye `pagination=false` — confirmado por `grep`.
- files: `redux/features/capacitacion/plataformaApiSlice.ts`
- risk: tier 1
- controls: verificadas en conjunto en T008 (tsc/eslint/build), porque el tipo de estas 3
  mutaciones no compila de forma aislada hasta que sus consumidores (T005-T007) también cambian —
  anticipado en el plan §6.

## T005 — 2026-11-11
- status: complete
- done-check: `getPlaceholderImage` (0 ocurrencias), `.results` (0 ocurrencias), usa
  `resolveCursoImagen` (3 ocurrencias: import + 2 usos) — confirmado por `grep`.
- files: `app/components/plataforma/explorar-dash.tsx`
- risk: tier 1
- controls: tsc ✅ (verificación completa en T008)

## T006 — 2026-11-11
- status: complete
- done-check: `getCursoImage` (0), `useGetCursosPlataformaQuery` (0), `.results` (0), `por página`
  (0, footer decorativo eliminado) — confirmado por `grep`.
- files: `app/components/plataforma/mis-cursos-dash.tsx`
- risk: tier 1
- decision no trivial: `completadoMap` se reconstruyó sobre `todos.map(c => [c.id,
  resolveInscripcionActual(inscripciones, c.id)?.completado_at])` en vez de construirlo
  directamente desde `inscripciones` — porque `getMisCursos` ya filtra a solo
  inscritos/completados, así que iterar sobre `todos` (no sobre `inscripciones`) evita quedarse con
  cursos que el colaborador nunca vio en esta vista. Registrado en `decisions.md`.
- controls: tsc ✅ (verificación completa en T008)

## T007 — 2026-11-11
- status: complete
- done-check: `inscripciones.find` (0 ocurrencias), usa `resolveInscripcionActual` (2 ocurrencias:
  import + uso) — confirmado por `grep`.
- files: `app/components/plataforma/curso-overview-client.tsx`
- risk: tier 1
- controls: tsc ✅ (verificación completa en T008)

## T008 — 2026-11-11 (cierre)
- status: complete, con una limitación explícita (ver abajo)
- controls:
  - tests: no aplica — no hay suite (constitución, principio 7)
  - build: ✅ `npx tsc --noEmit -p .` sin errores
  - lint: ✅ `pnpm run lint` — 0 errores, 7 warnings, todos preexistentes y no relacionados a este
    cambio (confirmado por ubicación y contenido: `<img>` sin `next/image`, variables sin usar ya
    presentes antes de esta sesión)
  - build de producción: ✅ `pnpm run build` completó
  - traceability: AC1-AC5 — cada uno trazado a al menos una tarea completa (ver `analysis/mis-cursos.md`)
- **Verificación manual en navegador: NO realizada — limitación real del entorno, no escondida.**
  No hay servidor de desarrollo corriendo en este momento (`curl localhost:3000` → conexión
  rehusada) ni herramienta de navegador disponible en esta sesión. Lo que SÍ se confirmó: ningún
  error de compilación de servidor/cliente, ningún tipo roto, cero referencias residuales a los
  identificadores que debían desaparecer (`getPlaceholderImage`, `getCursoImage`,
  `useGetCursosPlataformaQuery` en `mis-cursos-dash.tsx`, `.results`, el footer de paginación,
  `inscripciones.find`). **Pendiente real para el usuario:** abrir `/plataforma` y
  `/plataforma/explorar` en el navegador y confirmar los 5 criterios de aceptación a ojo, tal como
  pasó con el constructor visual anteriormente en esta sesión.
- AC3 en particular (inscripción más reciente) no se pudo verificar en vivo con un colaborador con
  2+ inscripciones al mismo curso — ya anticipado en el plan §7 riesgo #3 y aceptado en la spec;
  queda sustentado solo por inspección de código (`resolveInscripcionActual` implementa
  exactamente el criterio de `02-DOCS/wiki/backend-contracts.md`).

## Decision queue

Ninguna entrada — no hubo tareas tier 2, ninguna contradicción con una decisión registrada, ni
falta de convergencia. Los únicos pendientes reales (verificación manual en navegador, AC3 en vivo)
ya estaban anticipados en la spec/plan como `review-after` conocidos, no bloqueantes.
