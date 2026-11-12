---
type: progress
title: Progress — Vista previa en vivo del editor de bloques
description: Ledger de implementación append-only para el slug editor-bloques-vivo.
tags: [sdd, progress]
topic: sdd
---

# Progress — Vista previa en vivo del editor de bloques

> Plan: [../plans/editor-bloques-vivo.md](../plans/editor-bloques-vivo.md) · Spec: [../specs/editor-bloques-vivo.md](../specs/editor-bloques-vivo.md)

**Nota de proceso:** sin suite de tests (constitución, principio 7) — cada done-check se verificó
con `tsc`/`eslint`/`grep` reales tras el cambio, nunca una afirmación sin evidencia. Las 7 tareas
son tier 1 (`rsc risk`) sobre un plan ya auditado por `analyze` (GATE: PASS). Ninguna tarea terminó
en commit (principio 13a) — todo queda en el working tree, sin commitear.

## T001 — 2026-11-12
- status: complete
- done-check: `tsc --noEmit` limpio; `vacioPlaceholder` opcional añadido a `Props` y a cada rama que
  antes hacía `return null` (video, lista/pasos, callout/alerta, `ImagenBloque`, paneles/presentación,
  tarjetas, tabla, fallback de texto); con la prop omitida, cada rama ejecuta exactamente el mismo
  camino de código que antes (el `return null`/la condición original quedan intactos, solo se
  antepone un chequeo que, en `false`, no cambia nada).
- files: `app/components/plataforma/bloque-renderer.tsx`
- risk: tier 1
- controls: tsc ✅, eslint ✅ (0 errores)

## T002 — 2026-11-12
- status: complete
- done-check: `tsc --noEmit` limpio; `onLiveChange` añadido a `LiveItemsEditor` y `LiveItemRow`,
  invocado en cada `onChange` de título/imagen/texto/sub-ítems vía un `emitLive` que siempre manda
  el objeto completo (no solo el campo tocado); el guardado real por fila (`updateItem`) no cambió
  — sigue disparando solo al pulsar "Guardar cambios" de esa fila.
- files: `app/components/dash/capacitacion/bloques/bloque-item-editors.tsx`
- risk: tier 1
- controls: tsc ✅, eslint ✅ (0 errores)

## T003 — 2026-11-12
- status: complete
- done-check: `tsc --noEmit` limpio; `buildPreviewBloque(bloque, form, liveItems)` es una función
  pura (sin `await`, sin hooks de RTK Query) que reusa `toBloqueContenido` como base y sobreescribe
  cada campo plano solo cuando `form` lo trae definido (incluyendo cadenas/arrays vacíos como
  ediciones válidas), y `bloque_items` solo cuando `liveItems` no es `null`.
- files: `app/components/dash/capacitacion/bloques/bloques-section.tsx`
- risk: tier 1
- controls: tsc ✅ (eslint/build verificados en conjunto en T007)

## T004 — 2026-11-12
- status: complete
- done-check: `tsc --noEmit` limpio; `PropertiesPanel` pasa a `flex flex-col lg:grid
  lg:grid-cols-[320px_1fr]` con `order-2 lg:order-1` (formulario) y `order-1 lg:order-2` (preview) —
  apilado con preview arriba en móvil, dos columnas en `≥lg`; la columna de preview monta
  `BloqueRenderer` con `buildPreviewBloque(bloque, {}, null)` (snapshot estático, sin leer `form`
  todavía — eso es T005) y `vacioPlaceholder`; `SheetContent` pasa a `sm:max-w-sm lg:max-w-3xl`.
- files: `app/components/dash/capacitacion/bloques/bloques-section.tsx`
- risk: tier 1
- controls: tsc ✅ (verificación visual completa en T007, sin navegador disponible — ver limitación
  abajo)

## T005 — 2026-11-12
- status: complete
- done-check: `tsc --noEmit` limpio; `liveItems: ContenidoBloqueItem[] | null` (nuevo `useState`,
  inicial `null`) conectado a `onLiveChange` de `LiveItemsEditor`; la llamada estática de T004
  (`buildPreviewBloque(bloque, {}, null)`) reemplazada por `buildPreviewBloque(bloque, form,
  liveItems)`, recalculada en cada render — misma estructura de T004, ahora reactiva.
- files: `app/components/dash/capacitacion/bloques/bloques-section.tsx`
- risk: tier 1
- controls: tsc ✅ (verificación completa en T007)

## T006 — 2026-11-12
- status: complete
- done-check: `grep -c "<PropertiesPanel"` baja de 2 a 1 (confirmado); se retiró el bloque `{selected
  && (<div className="hidden lg:block lg:w-80 ...">)}` que montaba un segundo `PropertiesPanel` fijo
  en escritorio — redundante en la práctica, porque el `Sheet` ya se abre en cualquier resolución
  (su apertura depende de `propertiesSheetOpen`, nunca estuvo condicionada por breakpoint). El canvas
  y la biblioteca no se tocaron.
- files: `app/components/dash/capacitacion/bloques/bloques-section.tsx`
- risk: tier 1
- controls: tsc ✅, eslint ✅ (0 errores)

## T007 — 2026-11-12 (cierre)
- status: complete, con una limitación explícita (ver abajo)
- controls:
  - tests: no aplica — no hay suite (constitución, principio 7)
  - tsc: ✅ `npx tsc --noEmit -p .` sin errores (repo completo)
  - lint: ✅ `npx eslint` sobre los 3 archivos tocados — 0 errores
  - build de producción: ✅ `pnpm run build` completó
  - `PreviewPane` (AC6): ✅ confirmado por lectura directa — la función no cambió una sola línea;
    sigue llamando `BloqueRenderer` sin `vacioPlaceholder` (default `false`), idéntico a antes.
  - traceability: AC1-AC6 — cada uno trazado a al menos una tarea completa (ver
    `analysis/editor-bloques-vivo.md`)
- **Verificación manual en navegador: NO realizada — limitación real del entorno, no escondida.** No
  hay servidor de desarrollo corriendo ni herramienta de navegador disponible en esta sesión. Lo que
  SÍ se confirmó por inspección de código y por los controles arriba: tipos correctos de punta a
  punta, cero referencias residuales al render inline retirado, la estructura de grid/orden de
  Tailwind tal como la describe el plan, y que el canal de preview es de solo lectura (ninguna
  llamada a mutación dentro de `buildPreviewBloque` ni en los nuevos `onLiveChange`).
- **Pendiente real para el usuario:** abrir el editor de un tema con bloques existentes, confirmar
  en navegador los 6 criterios de aceptación — en particular el layout en escritorio (¿se ve bien la
  proporción 320px/resto que propuso el plan?) y el apilado en móvil, que es exactamente la parte que
  esta sesión no pudo ver renderizada.

## Decision queue

Ninguna entrada — no hubo tareas tier 2, ninguna contradicción con una decisión registrada, ni falta
de convergencia. El único pendiente real (verificación manual en navegador) ya estaba anticipado en
la spec/plan como algo que el usuario confirma después, no bloqueante.
