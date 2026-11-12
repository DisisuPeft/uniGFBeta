---
type: analysis
title: Analyze — Mis cursos (endurecimiento)
description: Cross-read of constitution/spec/plan/tasks for slug mis-cursos before implement.
timestamp: 2026-11-11T00:00:00Z
topic: sdd
---

# Analyze — Mis cursos (endurecimiento)

> Slug: `mis-cursos` · Reads: `constitution.md` (v1.1.0), `specs/mis-cursos.md` (clarified),
> `plans/mis-cursos.md` (approved, incl. Tasks + Review Workload Forecast)

## GATE: PASS (0 CRITICAL, 0 HIGH, 2 MEDIUM, 1 LOW)

Nada bloquea `implement`. Los 3 hallazgos son correcciones baratas de los propios artefactos
(no del código), puedes aceptarlos conscientemente y avanzar, o pedir que se corrijan primero.

## Coverage map

| REQ-ID | Spec requirement (resumen) | Plan section | Task(s) | Status |
| --- | --- | --- | --- | --- |
| AC1 | Mis cursos = solo inscritos/completados | §3 Interfaces (`getMisCursos`) | T003, T006, T008 | covered |
| AC2 | Explorar = catálogo completo | §3 Interfaces (`getCursosPlataforma`) | T002, T005, T008 | covered |
| AC3 | Inscripción más reciente en 3 vistas | §3 Interfaces (`resolveInscripcionActual`) | T001, T004, T006, T007, T008 | covered |
| AC4 | Sin control de paginación fake | §2 Arquitectura (retiro de footer) | T006 (construye), T008 (verifica) | covered — ver Hallazgo #2 (T002 traía un trace incorrecto a AC4) |
| AC5 | Imagen real o placeholder genérico, nunca por título | §3 Interfaces (`resolveCursoImagen`) | T001, T005, T006, T008 | covered |

Sin GAP (ningún criterio de aceptación se queda sin tarea) y sin DRIFT (ninguna tarea construye
algo que la spec no pidió, ni toca ningún Non-goal).

## Findings

| # | Severity | Type | Artifact A (loc) | Artifact B (loc) | Conflict | Resolve in |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | MEDIUM | Ambiguity (carrier) | `specs/mis-cursos.md` §Acceptance criteria (5 bullets sin numerar) | `plans/mis-cursos.md` ## Tasks (columna Trace cita "AC1"…"AC5") | `plan`/`tasks` asumen que el criterio N-ésimo de la spec es "ACN" por orden posicional — la spec nunca los etiqueta explícitamente. Correcto hoy porque el mismo autor escribió ambos en la misma sesión, pero frágil para cualquier lector o worker aislado futuro que cuente mal una viñeta. | `specify` (edición liviana: numerar los 5 bullets como "AC1.", "AC2." … en la spec) |
| 2 | MEDIUM | Mistrace (plan/tasks internal) | `plans/mis-cursos.md` ## Tasks, fila T002 (columna Trace = "AC2, AC4") | `plans/mis-cursos.md` §2 Arquitectura / fila T006 | T002 solo migra `getCursosPlataforma` a `pagination=false` — un cambio de forma de dato en la capa RTK Query, sin tocar ningún control de UI. El footer de paginación decorativa que AC4 exige retirar vive únicamente en `mis-cursos-dash.tsx` (T006). Trazar AC4 a T002 sobre-extiende lo que esa tarea realmente prueba. | `tasks` (corregir la columna Trace de T002 a solo "AC2"; AC4 ya está cubierto correctamente por T006/T008) |
| 3 | LOW | Wording mismatch | `specs/mis-cursos.md` §"What it must respect" (cita "Constitución v1.0.0" ×3) | `constitution.md` (ahora v1.1.0 tras el amendment del mismo día) | Desfase cosmético de versión — los principios citados (10, 16, 20) no cambiaron en el amendment v1.1.0 (que solo agregó 13a), así que no hay contradicción de fondo, solo la cita quedó desactualizada. | `specify` (actualizar la cita a v1.1.0 en la próxima edición de la spec) |

## Constitution compliance

Sin violaciones. Verificado explícitamente: principio 7 (sin test runner → done-checks por
comando/grep, no tests inventados), principio 10 (los 3 endpoints migran a `pagination=false`,
consistente), principio 13a (ninguna tarea termina en commit), principio 16 (plan §3 declara
explícitamente que `inscrito`/`progreso` de `getCursosPlataforma` no se re-derivan en cliente),
principio 20 (contrato de `resolveCursoImagen` no inventa datos).

## Conflicto de aislamiento (plan §7) — confirmado resuelto, sin residuos

El plan señalaba un choque entre el principio 12 original (commits directos a `main`) y la regla
de aislamiento de la fase `plan`. Revisado: el plan §7 marca ese punto **"CERRADO (2026-11-11)"**
con la resolución real (el agente nunca commitea, principio 13a), y la constitución quedó
enmendada a v1.1.0 con esa misma regla. No queda ninguna mención sin resolver en plan, tasks ni
constitución — confirmado, nada que reabrir aquí.

## Recommended routing

Ninguno de los 3 hallazgos es bloqueante (0 CRITICAL/HIGH). Agrupados por fase dueña:

- **`specify`** (hallazgos #1 y #3): numerar los 5 criterios de aceptación como "AC1."… "AC5." y
  actualizar la cita de versión de la constitución a v1.1.0. Ambos son ediciones de una línea.
- **`tasks`** (hallazgo #2): corregir la columna Trace de T002 en la tabla de tareas del plan,
  quitando "AC4" (dejar solo "AC2").

Si se aceptan tal cual sin corregir, el riesgo real es bajo: la cobertura ya es correcta en la
práctica (todos los AC tienen al menos una tarea real que los prueba), los hallazgos son sobre la
*legibilidad y precisión de la traza* para un lector futuro, no sobre qué se construye.
