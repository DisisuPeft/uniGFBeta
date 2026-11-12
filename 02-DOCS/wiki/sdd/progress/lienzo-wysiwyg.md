---
type: progress
title: Progress — Lienzo WYSIWYG del constructor de bloques (primer incremento)
description: Ledger de implementación append-only para el slug lienzo-wysiwyg.
tags: [sdd, progress]
topic: sdd
---

# Progress — Lienzo WYSIWYG del constructor de bloques (primer incremento)

> Plan: [../plans/lienzo-wysiwyg.md](../plans/lienzo-wysiwyg.md) · Spec: [../specs/lienzo-wysiwyg.md](../specs/lienzo-wysiwyg.md)

**Nota de proceso:** sin suite de tests (principio 7) — cada done-check se verificó con
`tsc`/`eslint`/`build`/`grep` reales. Las 9 tareas son tier 1 sobre un plan ya auditado por
`analyze` (GATE: PASS tras corregir el HIGH de drag-and-drop). Ninguna tarea terminó en commit
(principio 13a).

## T001 — 2026-11-12
- status: complete
- done-check: `tsc`/`eslint` limpios; rama `callout`/`alerta` de `BloqueRenderer` gana
  `modoEdicion` (texto editable vía `EditableTexto` contenteditable no controlado +
  `VariantePicker`); con `modoEdicion` omitido, la rama ejecuta exactamente el mismo código que
  antes (el chequeo nuevo es un `if` adicional antes del camino existente, nunca lo reemplaza).
- files: `app/components/plataforma/bloque-renderer.tsx`
- risk: tier 1

## T002 — 2026-11-12
- status: complete
- done-check: `ImagenBloque` (texto-imagen/texto-elemento-dinamico) gana `modoEdicion`: texto
  editable + `ImagenEdicion` (control de reemplazo de imagen, URL o archivo, con "quitar"). Camino
  por defecto intacto (mismo patrón de `if` adicional).
- files: `app/components/plataforma/bloque-renderer.tsx`
- risk: tier 1

## T003 — 2026-11-12
- status: complete
- done-check: rama `video`/`texto-video` gana `modoEdicion` vía `VideoEdicion` (URL o archivo). No
  gana edición de texto — confirmado que esta rama no renderiza `bloque.texto` (ni antes ni ahora).
- files: `app/components/plataforma/bloque-renderer.tsx`
- risk: tier 1

## T004 — 2026-11-12
- status: complete
- done-check: rama `lista`/`pasos` gana `modoEdicion`: cada ítem editable inline, botón "quitar"
  por ítem (visible al pasar el mouse), botón "+ Agregar elemento" al final. `onItemsChange` recibe
  el array completo en cada cambio.
- files: `app/components/plataforma/bloque-renderer.tsx`
- risk: tier 1

## T005 — 2026-11-12
- status: complete
- done-check: rama `tabla` gana `modoEdicion`: celdas editables inline, botón "quitar" por fila,
  botón "+ Agregar fila" que siembra `{ columna1: "", columna2: "" }` (confirma que el riesgo de
  tabla vacía del plan §7 no se materializa — los headers se derivan de `columna1`/`columna2`
  fijos cuando `filas` está vacío, no de `Object.keys(filas[0])`).
- files: `app/components/plataforma/bloque-renderer.tsx`
- risk: tier 1

## T006 — 2026-11-12
- status: complete
- done-check: archivo nuevo `lienzo-bloque-card.tsx`. `LienzoBloqueCard` usa `useSortable({ id:
  bloque.id })` con `attributes`/`listeners`/`setNodeRef`/`style` igual que `SortableBloqueCard`
  antes (confirma el HIGH de `analyze`, resuelto). No seleccionado, o seleccionado pero de un tipo
  fuera de alcance (`!esEdicionEnLienzo`): render de solo lectura. Seleccionado y cubierto: monta
  `form`/`liveItems`-equivalente (aquí solo `form`+`file`, sin `liveItems` — los 7 tipos cubiertos
  no tienen `ContenidoBloqueItem`) y pasa `buildPreviewBloque(bloque, form, null)` +
  `modoEdicion` a `BloqueRenderer`.
- files: `app/components/dash/capacitacion/bloques/lienzo-bloque-card.tsx` (nuevo),
  `app/components/dash/capacitacion/bloques/bloque-utils.ts` (nuevo helper `esEdicionEnLienzo`),
  `app/components/dash/capacitacion/bloques/bloques-section.tsx` (export de `toBloqueContenido`,
  `buildPreviewBloque`, `fileFieldFor`)
- risk: tier 1
- decisión no trivial: el render de solo lectura envuelve `BloqueRenderer` en un `div
  role="button"` (no un `<button>`) porque `BloqueRenderer` puede contener sus propios elementos
  interactivos (botón de lightbox de imagen, `<video>`) — anidar `<button>` dentro de `<button>`
  es HTML inválido. Se usa `pointer-events-none` en el contenido interno para que los clics caigan
  sobre el contenedor seleccionable, no sobre los controles internos del render de solo lectura.
  Registrado en `decisions.md`.

## T007 — 2026-11-12
- status: complete
- done-check: `grep -c "SortableBloqueCard"` = 0 en `bloques-section.tsx`; `<SortableContext>`
  sigue envolviendo `LienzoBloqueCard` exactamente igual que envolvía a `SortableBloqueCard`;
  `handleAddFromLibrary` ahora solo abre el Sheet de propiedades para tipos fuera de alcance
  (`!esEdicionEnLienzo`) — para los 7 tipos cubiertos, el bloque nuevo aparece seleccionado y
  editable directamente en el lienzo.
- files: `app/components/dash/capacitacion/bloques/bloques-section.tsx`
- risk: tier 1
- decisión no trivial: el `onSelect` de un bloque cubierto por `lienzo-wysiwyg` ahora alterna
  (toggle) `selectedId` en vez de solo asignarlo — clic de nuevo sobre el mismo bloque lo
  colapsa. El contrato de `LienzoBloqueCard` (plan §3) no incluye un prop `onClose` separado, así
  que el toggle vive en el orquestador, no en el componente. Registrado en `decisions.md`.

## T008 — 2026-11-12
- status: complete (sin cambios de código adicionales — ya resuelto estructuralmente por T007)
- done-check: `grep -n "<PropertiesPanel"` confirma que solo se monta dentro del bloque `{selected
  && !esEdicionEnLienzo(selected.tipo_codigo) && (...)}`, y el `Sheet` que lo contiene usa la misma
  condición en su `open`. Para los 7 tipos cubiertos, `PropertiesPanel`/`BloqueFormFields`/
  `LiveItemsEditor` nunca se montan — AC7 queda satisfecho por construcción, no por una
  verificación aparte.
- decisión no trivial: el campo residual "Modo de visualización" de `texto-elemento-dinamico`
  (el único que la spec permite dejar fuera del lienzo) no reutiliza `PropertiesPanel` ni un Sheet
  — vive como un `<select>` pequeño dentro de la barra de acciones de `LienzoBloqueCard` cuando el
  bloque está seleccionado y es de ese tipo. Mantener viva la maquinaria de `PropertiesPanel`/Sheet
  para un solo campo contradecía el espíritu WYSIWYG de la spec (exigiría abrir un panel aparte
  para una propiedad mientras se edita todo lo demás en el lienzo); el contrato de la spec
  (AC7) solo exige que el campo exista en algún lugar visible, no que viva en un Sheet
  específicamente. Registrado en `decisions.md`.

## T009 — 2026-11-12 (cierre)
- status: complete, con una limitación explícita (ver abajo)
- controls:
  - tests: no aplica — no hay suite (constitución, principio 7)
  - tsc: ✅ `npx tsc --noEmit -p .` sin errores (repo completo)
  - lint: ✅ `npx eslint` sobre los 5 archivos tocados — 0 errores
  - build de producción: ✅ `pnpm run build` completó
  - AC8 (guardado explícito sin cambios): ✅ confirmado por lectura — `handleSave` de
    `LienzoBloqueCard` es el mismo patrón que `PropertiesPanel` tenía (mismo `updateBloque`,
    mismo manejo de `FormData` para archivos), sin disparo automático
  - AC9 (tipos fuera de alcance intactos): ✅ confirmado — `PropertiesPanel` solo recibe tipos
    `isItemsTipo`, sin cambios en su contenido ni en `BloqueFormFields`/`LiveItemsEditor`
  - plataforma del alumno / `PreviewPane` sin cambios: ✅ confirmado por `grep` — `modoEdicion`
    solo aparece en `bloque-renderer.tsx` (definición) y `lienzo-bloque-card.tsx` (único llamador);
    ningún otro consumidor de `BloqueRenderer` lo pasa
  - traceability: AC1-AC9 trazados a tareas completas (ver `analysis/lienzo-wysiwyg.md`)
- **Verificación manual en navegador: NO realizada — limitación real del entorno, no escondida.**
  No hay servidor de desarrollo corriendo ni herramienta de navegador en esta sesión. Lo que SÍ se
  confirmó por inspección de código y controles arriba: tipos correctos de punta a punta, el
  mecanismo de arrastre preservado textualmente, el canal `modoEdicion` nunca llega a consumidores
  de solo lectura, y la semántica de guardado explícito sin cambios.
- **Pendiente real para el usuario:** abrir el editor de un tema, insertar/editar un bloque de cada
  uno de los 7 tipos cubiertos ejerciendo su verbo propio (texto, imagen/video, agregar/quitar
  ítem o fila, variante de callout), confirmar que el cursor no salta al escribir rápido con
  acentos/ñ (el riesgo más real señalado en el plan §7), y confirmar que arrastrar para reordenar
  sigue funcionando.

## Decision queue

Ninguna entrada — no hubo tareas tier 2, ninguna contradicción con una decisión registrada. El
único pendiente real (verificación manual en navegador) ya estaba anticipado en la spec/plan como
`review-after`, no bloqueante.
