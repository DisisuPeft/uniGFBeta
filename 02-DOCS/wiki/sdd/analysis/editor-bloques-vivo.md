---
type: analysis
title: Analyze — Vista previa en vivo del editor de bloques
description: Auditoría de consistencia constitución↔spec↔plan↔tasks para editor-bloques-vivo.
tags: [sdd, analysis]
timestamp: 2026-11-12T00:00:00Z
topic: sdd
---

# Analyze — Vista previa en vivo del editor de bloques

> Spec: [../specs/editor-bloques-vivo.md](../specs/editor-bloques-vivo.md) · Plan: [../plans/editor-bloques-vivo.md](../plans/editor-bloques-vivo.md) · Constitution: [../constitution.md](../constitution.md)

## GATE: PASS

0 CRITICAL, 0 HIGH, 1 MEDIUM (corregido en `tasks` el 2026-11-12 — ver abajo), 0 LOW.

## Coverage map

| REQ-ID | Criterio (resumen) | Sección del plan | Tarea(s) | Estado |
| --- | --- | --- | --- | --- |
| AC1 | Preview real al abrir un bloque | §2, §4 (flujo principal) | T003, T004, T007 | covered |
| AC2 | Campos planos en vivo, sin guardar | §4 (flujo principal) | T003, T005, T007 | covered |
| AC3 | Ítems vía `LiveItemsEditor` en vivo, sin guardar | §3, §4 (flujo secundario) | T002, T003, T005, T007 | covered |
| AC4 | Estado vacío visible, no un hueco en blanco | §3 (`vacioPlaceholder`) | T001, T007 | covered |
| AC5 | Apilado en viewport móvil | §0 (layout) | T004, T006, T007 | covered |
| AC6 | `PreviewPane` sin cambios | §0 (Global Constraints) | T007 | covered |

Sin huecos (GAP) ni drift: cada tarea traza a al menos un criterio, cada criterio tiene al menos una
tarea.

## Las seis verificaciones

1. **Cumplimiento de constitución** — revisado con atención especial al principio 19 (un solo
   renderer), por pedido explícito: la extensión de `BloqueRenderer` con `vacioPlaceholder`
   (plan §3, T001) es una prop opcional con comportamiento por defecto idéntico al actual —
   extiende la única implementación existente, no crea una segunda. `clarify` ya había resuelto
   explícitamente esta lectura del principio. **No hay contradicción.** Principio 13a (sin commits
   del agente) y principio 7 (sin suite de tests): ningún task table invoca `git commit`/`add`/
   `push`, y todos los done-checks son `tsc`/`eslint`/`build`/manual — consistente.
2. **Cobertura de requisitos** — ver mapa arriba. Completa en ambos sentidos.
3. **Scope drift** — T006 (retirar el render inline fijo de escritorio) no está pedido palabra por
   palabra en la spec, pero sirve directamente a AC1/AC4/AC5 (un panel más ancho en escritorio
   necesita dejar de ser un sidebar fijo de 320px dentro del layout de 3 columnas) y está razonado
   en `decisions.md` (2026-11-12). No es trabajo no pedido — es la forma concreta de cumplir lo que
   la spec sí pidió. No se marca como drift.
4. **Contradicción** — ninguna encontrada entre spec↔plan↔tasks.
5. **Duplicación** — ninguna tarea repite el trabajo de otra. T004 y T006 tocan el mismo archivo
   (`bloques-section.tsx`) pero en puntos distintos (uno construye la grilla de 2 columnas dentro
   del `Sheet` ya existente, el otro retira el segundo punto de render que queda redundante) y están
   ordenadas correctamente (T006 depende de T004).
6. **Ambigüedad / carrier completeness** — el plan trae §0 Global Constraints completo. Las tareas
   T001, T002, T003, T004, T005 (las que tienen un contrato cruzado con otra tarea) traen su bloque
   de Interfaces — T006 y T007 no lo necesitan (triviales/de cierre). Un hallazgo real, ver abajo.

## Findings

| # | Severidad | Tipo | Artefacto A | Artefacto B | Conflicto | Resolver en |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | MEDIUM | Ambigüedad | plan §6 paso 4 ("necesita buildPreviewBloque y la prop nueva para montar la columna de preview") | tasks T004/T005 (Interfaces) | T004 lista "Consumes: buildPreviewBloque (T003)" pero quien efectivamente lo invoca y lo conecta al estado (`liveItems`) es T005, cuyo "Produces" dice exactamente eso. No queda escrito qué debe mostrar la columna de preview que T004 construye ANTES de que T005 la conecte en vivo (¿un `BloqueRenderer` ya alimentado con los datos guardados del bloque, como adelanto estático? ¿un placeholder vacío?) — un implementador aislado que solo vea T004 no tiene esa respuesta. | `tasks` |

**Por qué importaba:** no bloqueaba construir, pero T004 y T005 pueden terminar en manos de
implementadores distintos, y dejar ese límite sin una frase explícita es el tipo de ambigüedad que
`analyze` existe para atrapar antes de que alguien lo adivine distinto de como el plan lo pensó.

**Corregido (2026-11-12):** el plan y la tarea T004 ahora dicen explícitamente que T004 monta la
columna de preview con un snapshot estático (`buildPreviewBloque(bloque, {}, null)`, sin leer
`form`/`liveItems`), y T005 reemplaza esa llamada por la versión reactiva
(`buildPreviewBloque(bloque, form, liveItems)`) sin cambiar la estructura que T004 construyó. Ver
`02-DOCS/wiki/sdd/plans/editor-bloques-vivo.md`, T004/T005.

### Verificaciones puntuales pedidas

- **¿El `vacioPlaceholder` de T001 contradice "un solo renderer" (principio 19)?** No — ver
  verificación 1 arriba. PASS.
- **¿El texto exacto del mensaje de estado vacío (open decision del plan §7) bloquea T001/T007?**
  No. El criterio de aceptación (spec AC4) solo exige que el mensaje sea *visible* ("texto
  explicativo"), no fija una redacción. El done-check de T001 tampoco cita un texto literal. Dejarlo
  a la redacción de `implement` es aceptable y no es un hallazgo — no se lista arriba porque no
  cambia lo que se construye, solo su copy.

## Recommended routing

- Finding #1 (MEDIUM) → `tasks`: añadir una frase al done-check o al bloque de Interfaces de T004
  precisando qué debe mostrar la columna de preview al terminar esa tarea (antes de que T005 la
  conecte al estado en vivo). No requiere volver a `plan` — es una precisión de alcance de tarea,
  no un cambio de arquitectura.
- Sin hallazgos CRITICAL/HIGH — nada bloquea `implement`. El MEDIUM puede corregirse antes de
  empezar T004, o aceptarse conscientemente y resolverse en el momento si el implementador hace la
  misma lectura razonable que esta auditoría propone arriba.
