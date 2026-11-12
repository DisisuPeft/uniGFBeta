---
type: analysis
title: Analyze — Lienzo WYSIWYG del constructor de bloques
description: Auditoría de consistencia constitución↔spec↔plan↔tasks para lienzo-wysiwyg.
tags: [sdd, analysis]
timestamp: 2026-11-12T00:00:00Z
topic: sdd
---

# Analyze — Lienzo WYSIWYG del constructor de bloques

> Spec: [../specs/lienzo-wysiwyg.md](../specs/lienzo-wysiwyg.md) · Plan: [../plans/lienzo-wysiwyg.md](../plans/lienzo-wysiwyg.md) · Constitution: [../constitution.md](../constitution.md)

## GATE: BLOCKED

0 CRITICAL, 1 HIGH, 1 MEDIUM, 0 LOW. **Corregido en `plan` el 2026-11-12 — ver abajo.**

## Coverage map

| REQ-ID | Criterio (resumen) | Sección del plan | Tarea(s) | Estado |
| --- | --- | --- | --- | --- |
| AC1 | Render real en el lienzo, no resumen de texto | §2, §6 | T006, T007, T009 | covered |
| AC2 | Texto en vivo (texto-imagen/texto-elemento-dinamico/callout) | §3 (`onTextoChange`) | T001, T002, T009 | covered |
| AC3 | Imagen/video en vivo | §3 (`onImagenChange`/`onVideoChange`) | T002, T003, T009 | covered |
| AC4 | Lista/pasos: agregar/quitar ítem | §3 (`onItemsChange`) | T004, T009 | covered |
| AC5 | Tabla: agregar/editar/quitar fila | §3 (`onFilasChange`) | T005, T009 | covered |
| AC6 | Callout: variante en vivo | §3 (`onVarianteChange`) | T001, T009 | covered |
| AC7 | Panel sin campos de contenido ya editables | §2, §6 paso 8 | T008, T009 | covered |
| AC8 | Guardado explícito sin cambios | §0, §4 | T009 | covered (solo verificación — ninguna tarea *cambia* el guardado, correcto: no debía) |
| AC9 | Tipos fuera de alcance intactos | §0, Non-goals de la spec | T009 | covered (solo verificación) |
| *(implícito)* Reordenar/duplicar/eliminar bloques sigue funcionando (spec, Non-goals: "ya existen... y no cambian") | §3 (contrato de `LienzoBloqueCard`, corregido) | T006, T007 | covered (corregido — ver Finding #1) |

## Las seis verificaciones

1. **Cumplimiento de constitución** — principio 19 (un solo renderer, extensible no duplicable):
   el contrato de `BloqueRenderer` en plan §3 define `modoEdicion` como prop opcional con
   postcondición explícita "ausente/undefined → render IDÉNTICO al actual en cada rama existente",
   y las 5 tareas de extensión (T001-T005) repiten esa misma verificación en su done-check
   ("comportamiento por defecto intacto"). No hay contradicción — el diseño es correcto respecto al
   principio. Principio 13a y 7: ninguna tarea invoca git ni asume una suite de tests. **PASS.**
2. **Cobertura de requisitos** — ver mapa arriba. 9/9 criterios de aceptación explícitos cubiertos.
   Un requisito **implícito** de la spec (en *Non-goals*, no en *Acceptance criteria* — por eso no
   tiene AC-ID propio) no tiene tarea: ver Finding #1.
3. **Scope drift** — ninguna tarea hace algo que la spec no pidió. T006-T008 (construir
   `LienzoBloqueCard`, conectar el canvas, reducir el panel) son la forma concreta de cumplir AC1 y
   AC7 — no drift.
4. **Contradicción** — ninguna entre spec↔plan↔tasks. Verificado también contra
   `editor-bloques-vivo`: el plan cita `buildPreviewBloque`/`toBloqueContenido` como "ya existen,
   sin cambios" (plan §2, componente "`buildPreviewBloque` / `toBloqueContenido`") y ninguna tarea
   los reimplementa ni cambia su firma — consistente con la decisión ya registrada en
   `decisions.md` (2026-11-12, scoping de `lienzo-wysiwyg`) de reusarlos, no reemplazarlos.
5. **Duplicación** — ninguna. T001-T005 tocan ramas disjuntas del mismo `switch` en
   `bloque-renderer.tsx`; el plan ya advierte explícitamente (§6) que solo son paralelizables vía
   `parallel` con workers distintos, no simultáneamente por un único implementador — consistente.
6. **Ambigüedad / carrier completeness** — plan §0 Global Constraints está completo. T001-T006
   traen su bloque de Interfaces. Encontrado un hallazgo real de carrier completeness: ver Finding #2.

## Findings

| # | Severidad | Tipo | Artefacto A | Artefacto B | Conflicto | Resolver en |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | HIGH | Gap de cobertura | Spec `lienzo-wysiwyg.md`, Non-goals ("Reordenar/duplicar/eliminar bloques — ya existen... y no cambian en esta spec; seguirán funcionando sobre el lienzo ya convertido a render real") | Plan/Tasks — ninguna sección ni tarea | El Non-goal no es pasivo: para que "sigan funcionando" sea cierto, **alguien tiene que preservar explícitamente** el mecanismo de `@dnd-kit/sortable` (`useSortable`, `attributes`, `listeners`, `setNodeRef`, `transform`, `transition`, `isDragging`) que hoy vive dentro de `SortableBloqueCard` (`bloques-section.tsx` líneas ~107-145), cuando su cuerpo se reemplaza por `LienzoBloqueCard`. Ninguna tarea (T006 ni T007) lo menciona. Un implementador aislado, viendo solo el contrato de T006 (`LienzoBloqueCard({ bloque, selected, onSelect, onSaved, onDeleted, onDuplicate })` — sin `attributes`/`listeners`/`setNodeRef`/`style` en la firma), construiría el componente sin arrastre, y recién se notaría al verificar manualmente — si T009 no prueba específicamente reordenar, ni siquiera ahí. | `tasks` (ajustar T006/T007) o `plan` (si la firma de `LienzoBloqueCard` necesita cambiar para recibir las props de `useSortable`) |
| 2 | MEDIUM | Ambigüedad / carrier completeness | Plan §2 Architecture (prosa: "mantiene el drag handle y los botones de duplicar/eliminar que ya existían") | Plan §3 Interfaces / Tasks T006 (bloque Interfaces de `LienzoBloqueCard`) | La intención de preservar el drag handle y los botones SÍ está escrita, pero solo en la prosa de §2 — nunca se convirtió en parte del contrato formal (`Produces`) de `LienzoBloqueCard` en §3 ni en el bloque de Interfaces de T006. Es la misma causa raíz que el Finding #1: una intención correcta que vive solo en prosa es invisible para un implementador que solo lee el contrato. | `plan` (mover esta intención de la prosa al contrato formal, no solo señalarla en T006/T007 como pide el Finding #1) |

**Por qué importa el HIGH (#1):** si esto no se corrige antes de `implement`, la forma más probable
de que se construya es exactamente como si no existiera este Non-goal — el instructor pierde la
capacidad de reordenar bloques arrastrándolos, una regresión real de una función que ya existe y
funciona hoy, descubierta tarde (en T009, si acaso) en vez de diseñada desde T006.

## Corrección (2026-11-12)

Ambos hallazgos comparten causa raíz y se corrigieron juntos en `plan`:
`LienzoBloqueCard`'s contrato (§3) ahora exige explícitamente `useSortable({ id: bloque.id })` +
`attributes`/`listeners`/`setNodeRef`/`style` como parte de su `Produces`, no solo en la prosa de
§2. T006/T007 (en `## Tasks`) llevan ahora esa misma exigencia en su done-check, incluyendo
verificación manual de que arrastrar para reordenar sigue funcionando. Ver
`02-DOCS/wiki/sdd/plans/lienzo-wysiwyg.md`.

## Recommended routing

- Finding #1 (HIGH) → `tasks`: añadir al done-check de T006 la preservación explícita del mecanismo
  `useSortable` (o, si el plan prefiere resolverlo a nivel de arquitectura, enviarlo primero a
  `plan` para que el contrato de `LienzoBloqueCard` en §3 incluya las props de `dnd-kit` en su
  firma, y entonces `tasks` solo refleja esa firma ya corregida). Cualquiera de las dos rutas cierra
  el gap; la diferencia es si el contrato cambia en el plan o solo se precisa en la tarea.
- Finding #2 (MEDIUM) → `plan`: mover "mantiene el drag handle y los botones de duplicar/eliminar"
  de la prosa de §2 al contrato formal de §3 (`Produces` de `LienzoBloqueCard`), para que quede
  donde un implementador aislado realmente lo lee.
- Sin hallazgos CRITICAL — nada en el diseño contradice la constitución ni la spec. El GATE queda
  `BLOCKED` únicamente por el HIGH (#1); resuelto ese, y el MEDIUM relacionado de paso (comparten
  causa raíz), re-correr `analyze` debería dar `PASS`.
