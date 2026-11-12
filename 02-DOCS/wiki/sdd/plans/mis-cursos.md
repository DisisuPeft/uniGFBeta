---
type: plan
title: Plan — Mis cursos (endurecimiento)
description: Contracts, shapes and flows to fix pagination, image resolution and stale-inscription risk in Mis cursos / Explorar / curso overview.
tags: [sdd, plan]
timestamp: 2026-11-11T00:00:00Z
topic: sdd
slug: mis-cursos
status: approved
---

# Plan — Mis cursos (endurecimiento)

> Spec: [../specs/mis-cursos.md](../specs/mis-cursos.md) · Constitution: [../constitution.md](../constitution.md) · Status: approved
> Last updated: 2026-11-11

## 0. Global Constraints

- **Pagination migration shape:** `builder.query<PaginatedResponse<T>, Arg>` → `builder.query<T[], Arg>`; URL gains `?pagination=false` (or `&pagination=false` if a query string already exists); every consumer's `data?.results ?? []` becomes `data ?? []`. Exact pattern already applied to ~15 sibling endpoints in this codebase — no variation.
- **Inscripción-recency sort:** when deriving "the" inscripción for a `curso` from the raw `MiInscripcion[]` list, sort by `inscrito_at` descending, `id` descending as tiebreak. Source: `02-DOCS/wiki/backend-contracts.md`, "Inscripción recency" — backend-confirmed, not provisional.
- **No client-side recency logic on `CursoPlataforma.inscrito`/`.progreso`** — the backend already resolves these over the most recent inscripción (constitution principle 16; same wiki section).
- **No commit/PR attribution to an AI, ever** (constitution principle 13).
- **Verification bar:** `npx tsc --noEmit -p .`, `pnpm run lint`, `pnpm run build`, plus a real manual browser pass — no test runner exists (constitution principle 7).
- **No new visual indicator for re-enrollment; no new pagination UI** (spec Non-goals).

## 1. Context & constraints

- Acceptance criteria shaping this design: spec §Acceptance #1–#5 (all five), `../specs/mis-cursos.md`.
- Constitution rules in play: principle 10 (pagination=false rule), principle 16 (backend as sole
  source of truth for progression), principle 20 (no invented data).
- Out of scope the design must not creep into: real pagination/infinite scroll; the learning
  player or evaluative content blocks (separate spec); fixing the `/competencias/mi-perfil/` vs
  `/competencias/mi-perfil-competencias/` URL mismatch; any visual redesign beyond the cover image;
  a new "reinscrito" indicator.

## 2. Architecture

```text
[ explorar-dash.tsx ]        [ mis-cursos-dash.tsx ]        [ curso-overview-client.tsx ]
        |                            |                                |
        | getCursosPlataforma()      | getMisCursos()                 | getMisInscripciones()
        |                            | getMisInscripciones()          |
        v                            v                                v
  [ plataformaApiSlice  (RTK Query, INTERNAL) ] ------------------------------>
        |
        v
  [ Django backend /capacitacion/*, /capacitacion/ver/* ]  (EXTERNAL, unchanged by this plan)

  [ curso-helpers.ts  (new shared util, INTERNAL) ]  <-- imported by explorar-dash.tsx,
                                                          mis-cursos-dash.tsx, curso-overview-client.tsx
```

- **`plataformaApiSlice`** (internal) — single responsibility: define the 3 touched endpoints'
  URL/shape; no business logic.
- **`explorar-dash.tsx`** (internal, view) — full catalog browse + enroll.
- **`mis-cursos-dash.tsx`** (internal, view) — only inscribed/completed courses, progress, rutas
  recomendadas.
- **`curso-overview-client.tsx`** (internal, view) — single-course detail; needs the recency-
  resolved inscripción to know that course's state.
- **New shared util module** (internal) — one function resolving a course's cover image, one
  resolving "the" inscripción for a curso from a raw list. Recommended location:
  `app/components/plataforma/curso-helpers.ts`.
- **Django backend** (external) — unchanged.

**Top architectural decision:** extract one shared util for cover-image resolution and one for
inscripción-recency resolution, used by all three consumers, instead of fixing
`mis-cursos-dash.tsx`'s broken copy in place. Reason: `explorar-dash.tsx` already has its *own*,
already-correct-looking image logic (`curso.imagen ?? placeholder by id % 5`), separate from
`mis-cursos-dash.tsx`'s broken one (title-matching + 5-image hash). Two independently-"correct"
implementations is exactly the silent-drift failure mode the constitution already singles out for
`BlockRenderer` (principle 19) — applied here to image/recency resolution. A single shared function
per concern guarantees the same course always resolves the same way everywhere, with one place to
change it later.

## 3. Interfaces & contracts

```text
plataformaApiSlice.getCursosPlataforma() -> CursoPlataforma[]
  - was: PaginatedResponse<CursoPlataforma> (read via .results)
  - becomes: CursoPlataforma[] directly, query string gains ?pagination=false
  - invariant: each item's inscrito/progreso already reflects the most recent inscripción
    (backend-guaranteed) — no client-side recency logic applies to this endpoint's own fields.

plataformaApiSlice.getMisCursos() -> CursoPlataforma[]
  - was: PaginatedResponse<CursoPlataforma>, declared but its data never read anywhere (only
    isLoading was used) — a dead fetch.
  - becomes: CursoPlataforma[] directly, ?pagination=false, AND becomes the actual course-list
    source for mis-cursos-dash.tsx, replacing getCursosPlataforma() there.
  - precondition: returns only courses with an inscripción (its own existing backend contract,
    /capacitacion/mis-cursos/) — unverified against real data until task-time, see §7 risk #2.

plataformaApiSlice.getMisInscripciones() -> MiInscripcion[]
  - was: PaginatedResponse<MiInscripcion>
  - becomes: MiInscripcion[] directly, ?pagination=false
  - invariant: raw list, one row per inscripción, NOT deduplicated by curso — any consumer
    picking "the" inscripción for a given curso must sort first (see below).

resolveInscripcionActual(inscripciones: MiInscripcion[], cursoId: number) -> MiInscripcion | undefined
  - new pure helper, not a new endpoint
  - behaviour: filter where curso === cursoId, sort by inscrito_at desc then id desc, return the
    first (or undefined if the colaborador has no inscripción to that curso)
  - replaces: mis-cursos-dash.tsx's `new Map(inscripciones.map(i => [i.curso, i.completado_at]))`
    and curso-overview-client.tsx's `inscripciones.find(i => i.curso === cursoId)`
  - invariant: pure, deterministic, no network call

resolveCursoImagen(curso: { imagen: string | null; id: number }) -> string
  - new pure helper
  - behaviour: curso.imagen if truthy, else one deterministic path from a single shared
    placeholder list, keyed by curso.id
  - replaces: mis-cursos-dash.tsx's getCursoImage (title-matching special-case + 5-image hash) and
    explorar-dash.tsx's private getPlaceholderImage (id % 5, no title-matching — already closer to
    correct, unified into the shared version so both files agree on the same placeholder per id)
  - invariant: same curso.id always resolves to the same placeholder in both views
```

## 4. Data model & flow

**Entities** (unchanged shape — only unwrapped from the pagination envelope)

- **`CursoPlataforma`** — `id`, `titulo`, `imagen`, `inscrito`, `progreso {completados, total,
  porcentaje}`, `competencias[]`, `duracion_horas`.
- **`MiInscripcion`** — `id`, `curso`, `curso_titulo`, `inscrito_at`, `completado_at`, `activo`.

**Primary flow** (spec: "colaborador con 2 inscripciones históricas al mismo curso ve el estado de
la más reciente")

1. Colaborador abre "Mis cursos" → `getMisCursos()` trae solo sus cursos inscritos/completados,
   cada uno con `inscrito`/`progreso` ya resueltos por el backend sobre la inscripción más
   reciente →
2. la misma vista llama `getMisInscripciones()` por la lista cruda → `resolveInscripcionActual`
   elige, para cada curso mostrado, la fila correcta (más reciente) →
3. la tarjeta usa `progreso` (resuelto en servidor) para la barra, y el `completado_at` resuelto
   por `resolveInscripcionActual` (resuelto en cliente, mismo criterio) para el badge/fecha de
   completado →
4. colaborador abre el resumen de un curso individual → mismo `getMisInscripciones()` →
   `resolveInscripcionActual(inscripciones, cursoId)` reemplaza el `.find()` sin ordenar →
   misma garantía.

- **Frontera de consistencia:** las dos señales (progreso/inscrito resuelto en servidor sobre
  `CursoPlataforma`, y `completado_at` resuelto en cliente sobre `MiInscripcion[]`) nunca deben
  discrepar en la práctica, porque ambas aplican el mismo criterio de "más reciente" — uno resuelto
  del lado servidor, el otro con el mismo desempate del lado cliente. Este plan no inventa un
  criterio nuevo, iguala el existente.
- **Impacto de migración:** ninguno — no hay cambios de backend, modelos ni columnas nuevas; es
  puramente una forma de dato (array vs. paginado) y lógica de cliente.

## 5. Testing strategy

| Acceptance criterion | Level | Asserts | Fakes / mocks |
| --- | --- | --- | --- |
| spec §Acceptance #1 (Mis cursos solo inscritos/completados) | manual (navegador) | la vista renderiza exactamente las tarjetas que devuelve `getMisCursos()` | ninguno — sesión real contra backend real |
| spec §Acceptance #2 (Explorar = catálogo completo) | manual (navegador) | la vista sigue mostrando el catálogo completo de `getCursosPlataforma()` e inscribir funciona | ninguno |
| spec §Acceptance #3 (inscripción más reciente en las 3 vistas) | manual (navegador) + inspección de código | `resolveInscripcionActual` se revisa directamente (función pura, fácil de verificar a ojo sin runner); si hay un colaborador de prueba con 2+ inscripciones al mismo curso, se verifica en vivo en las 3 vistas | datos reales si existen; si no, inspección de código sustituye — ya anticipado y aceptado en la spec |
| spec §Acceptance #4 (sin control de paginación fake) | manual (navegador) + revisión de diff | el footer de `mis-cursos-dash.tsx` se elimina por completo; no queda ningún botón `disabled` de paginación en ninguna vista tocada | ninguno |
| spec §Acceptance #5 (imagen real o placeholder genérico, nunca por título) | manual (navegador) + revisión de diff | `resolveCursoImagen` no tiene ninguna rama que compare contra `titulo`; un curso sin `imagen` cuyo título contenga "analista" muestra el mismo placeholder que cualquier otro curso sin imagen | ninguno |

- **Dónde está la línea de "e2e":** no hay automatización — el nivel más alto disponible es una
  pasada manual real en navegador contra el backend real, que ya es el piso de este proyecto
  (constitución, principio 7), nombrado aquí como tal en vez de inventar un nivel que no existe.
- **Lo que debe ser real, nunca simulado:** las respuestas de `getCursosPlataforma` /
  `getMisCursos` / `getMisInscripciones` contra el backend real — este plan no introduce datos de
  prueba, porque no hay infraestructura de tests donde mantenerlos.

## 6. Sequencing & dependencies

1. Crear `resolveInscripcionActual` y `resolveCursoImagen` como utilidades puras nuevas, sin
   rewiring de consumidores todavía — depende de: ninguno — paralelizable con #2.
2. Migrar `getCursosPlataforma`, `getMisCursos`, `getMisInscripciones` en `plataformaApiSlice.ts`
   a `?pagination=false` + tipo de retorno array — depende de: ninguno — paralelizable con #1.
3. Actualizar `explorar-dash.tsx`: cambiar lecturas `.results` por el array directo; reemplazar su
   `getPlaceholderImage` privado por `resolveCursoImagen` compartido — depende de: #1, #2 — serial.
4. Actualizar `mis-cursos-dash.tsx`: cambiar su fuente de cursos de `getCursosPlataforma` a
   `getMisCursos`; cambiar lecturas `.results`; reemplazar la construcción de `completadoMap` por
   `resolveInscripcionActual`; reemplazar `getCursoImage` por `resolveCursoImagen`; eliminar el
   footer de paginación fake — depende de: #1, #2 — serial (el paso más grande e interdependiente,
   se hace de una vez porque sus sub-cambios tocan líneas solapadas).
5. Actualizar `curso-overview-client.tsx`: reemplazar el `.find()` sin ordenar por
   `resolveInscripcionActual` — depende de: #1 — paralelizable con #3/#4 (archivo disjunto).
6. Verificación: `tsc` + `eslint` + `build` + recorrido manual en navegador de los 5 criterios de
   aceptación — depende de: #2, #3, #4, #5.

- Candidatos paralelos: #1 y #2 (archivos/responsabilidades disjuntas); #5 en paralelo con #3/#4
  una vez exista #1 (archivos distintos).
- Restricción de orden dura: #3 y #4 deben ir después de #1 y #2, porque importan el nuevo util y
  esperan el dato ya en forma de array.

## 7. Risks & open decisions

**Risks**

| Risk | Trigger | Impact | Mitigation / spike to retire it |
| --- | --- | --- | --- |
| Migrar los 3 endpoints a `pagination=false` rompe un consumidor no detectado | existe un 4º archivo que consume alguno de los 3 hooks y no apareció en el grep de esta sesión | crash en runtime al leer `.results` sobre un array | re-grep de los 3 nombres de hook justo antes de tocar el slice (ya confirmado una vez: exactamente 3 archivos consumidores en total) |
| `getMisCursos` nunca se ha ejercitado con datos reales en esta app (su `data` se descartaba) — su shape real podría diferir del de `getCursosPlataforma` en algún campo | `/capacitacion/mis-cursos/` devuelve una forma más delgada de lo esperado | `mis-cursos-dash.tsx` crashea o renderiza mal al conectar por primera vez a datos reales de este endpoint | primera verificación manual compara explícitamente una respuesta de `getMisCursos()` contra una de `getCursosPlataforma()` para el mismo colaborador, antes de dar por sana la tarea #4 |
| No existe en el entorno disponible un colaborador de prueba con 2+ inscripciones al mismo curso | limitación de datos de prueba, no un defecto de código | criterio de aceptación #3 (el más serio) solo se verifica por inspección de código, no en vivo | ya anticipado y aceptado en la spec; si hay tiempo, preguntar si se puede crear ese fixture en el admin del backend para una verificación puntual |
| El principio 12 de la constitución (commits directos a `main`, sin rama/PR) choca con la regla fija de esta fase `plan` ("ya en main → aislar NO es opcional") | se llega a `implement` sin resolver cuál regla manda | ambigüedad de proceso, no de código | no se resuelve aquí en silencio — ver "Open decisions" abajo, se pregunta al usuario |

**Open decisions**

- **Aislamiento antes de implementar — CERRADO (2026-11-11).** El usuario resolvió esto de raíz:
  no se hace ningún commit durante `implement` — el commit queda siempre en manos del humano. Sin
  commit de por medio, la pregunta de worktree/rama no aplica; se edita directo sobre `main`, sin
  commitear, y el usuario revisa y commitea cuando decida.
- **Shape real de `getMisCursos`** (riesgo #2 arriba) — cierra en la primera verificación manual de
  `implement`.

## Tasks
<!-- generated by tasks on 2026-11-11; IDs are stable, do not renumber -->

Nota de proceso (constitución v1.1.0, principio 13a): ninguna tarea termina en un commit — cada
una deja el working tree editado y sin commitear. Sin suite de tests (principio 7): todo
done-check es un comando ejecutable (tsc/eslint/build) o una verificación estructural por `grep`
sobre el archivo tocado, nunca "funciona" sin más. `npx @ericrisco/rsc risk` confirma tier 1 en
los 5 archivos tocados — ninguno requiere panel de 3 refutadores ni aprobación humana de mérito
(aunque el commit, por la constitución, siempre lo hace el humano de todos modos).

| ID | [P] | Task | Done-check | Depends-on | Trace | Risk |
| --- | --- | --- | --- | --- | --- | --- |
| T001 | [P] | Crear `app/components/plataforma/curso-helpers.ts` con `resolveCursoImagen` y `resolveInscripcionActual` | `npx tsc --noEmit -p .` compila el nuevo archivo sin error; `grep -c "\.titulo" curso-helpers.ts` = 0 (sin heurística por título); `grep -n "inscrito_at" curso-helpers.ts` encuentra el criterio de orden | — | AC3, AC5 | 1 |
| T002 | [P] | Migrar `getCursosPlataforma` a `?pagination=false` + `CursoPlataforma[]` en `plataformaApiSlice.ts` | el endpoint tipa `CursoPlataforma[]` (no `PaginatedResponse<...>`) y su URL incluye `pagination=false` | — | AC2 | 1 |
| T003 | [P] | Migrar `getMisCursos` a `?pagination=false` + `CursoPlataforma[]` en `plataformaApiSlice.ts` | mismo patrón que T002, para `getMisCursos` | — | AC1 | 1 |
| T004 | [P] | Migrar `getMisInscripciones` a `?pagination=false` + `MiInscripcion[]` en `plataformaApiSlice.ts` | mismo patrón que T002, para `getMisInscripciones` | — | AC3 | 1 |
| T005 |  | Actualizar `explorar-dash.tsx`: leer el array directo de `getCursosPlataforma`, usar `resolveCursoImagen` compartido en vez de su `getPlaceholderImage` privado | `grep -c "getPlaceholderImage" explorar-dash.tsx` = 0; `grep -c "\.results" explorar-dash.tsx` = 0; importa `resolveCursoImagen` | T001, T002 | AC2, AC5 | 1 |
| T006 |  | Actualizar `mis-cursos-dash.tsx`: cambiar su fuente de cursos de `getCursosPlataforma` a `getMisCursos`; leer arrays directos; reemplazar `completadoMap`/`getCursoImage` por los utils compartidos; eliminar el footer de paginación decorativo | `grep -c "getCursoImage\b" mis-cursos-dash.tsx` = 0; `grep -c "useGetCursosPlataformaQuery" mis-cursos-dash.tsx` = 0; `grep -c "\.results" mis-cursos-dash.tsx` = 0; `grep -c "por página" mis-cursos-dash.tsx` = 0 (footer eliminado) | T001, T002, T003, T004 | AC1, AC3, AC4, AC5 | 1 |
| T007 | [P] | Actualizar `curso-overview-client.tsx`: reemplazar `inscripciones.find(i => i.curso === cursoId)` por `resolveInscripcionActual` | `grep -c "inscripciones.find" curso-overview-client.tsx` = 0; importa y usa `resolveInscripcionActual` | T001, T004 | AC3 | 1 |
| T008 |  | Cierre: verificación de proyecto completo + recorrido manual de los 5 criterios de aceptación | `npx tsc --noEmit -p .` sin errores; `pnpm run lint` sin errores nuevos; `pnpm run build` exitoso; checklist manual en navegador de AC1–AC5 (AC3 por inspección de código si no hay colaborador de prueba con 2+ inscripciones, per plan §7 riesgo #3) | T005, T006, T007 | AC1–AC5 | — |

**T005/T006/T007 — Interfaces** (dependen de T001, worker con contexto aislado necesita las firmas
exactas, no una descripción):
- Consumes: `resolveCursoImagen(curso: { imagen: string | null; id: number }) -> string`;
  `resolveInscripcionActual(inscripciones: MiInscripcion[], cursoId: number) -> MiInscripcion | undefined`
  (ambas de `app/components/plataforma/curso-helpers.ts`, T001).
- Produces (T006 únicamente): `mis-cursos-dash.tsx` deja de importar `useGetCursosPlataformaQuery`;
  su fuente de cursos pasa a ser exclusivamente `useGetMisCursosQuery()`.

`[P]` real una vez T001/T002/T003/T004 existen: T005 y T007 son archivos disjuntos de T006 —
pueden hacerse en paralelo entre sí. T006 depende de los 4 primeros porque toca los 3 endpoints
migrados a la vez (es el paso más grande e interdependiente, tal como ya señalaba el plan §6).

## Review Workload Forecast

| Dimension | Forecast | Why |
| --- | --- | --- |
| Estimated changed lines | ~150–250 | 1 archivo nuevo pequeño (T001, ~40 líneas); 3 cambios de 2 líneas cada uno en el slice (T002-T004); 3 archivos de vista con cambios moderados, incluyendo eliminar ~35 líneas de footer muerto (T005-T007) |
| Files / areas | 5 archivos: 1 nuevo (`curso-helpers.ts`), 1 slice RTK Query, 3 vistas de plataforma. Sin tests (no hay runner), sin docs además de este plan/spec | |
| Risk | tier 1 máximo en los 5 archivos (confirmado con `rsc risk`); 0 tareas tier 2 — ningún refutador en panel, ninguna aprobación humana de mérito requerida por el harness (el commit igual lo hace el humano, por la constitución) | |
| Suggested delivery | `single-pr` | bien debajo del `line_budget` de 400 en `config.yaml`; sin áreas cruzadas de stack |
