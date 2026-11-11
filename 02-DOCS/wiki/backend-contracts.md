---
type: reference
title: uniGFBeta — Backend contracts confirmed so far
description: Running log of real backend contract facts relayed by the user from the backend team, grounding for future specs. Not a decision log — a fact log.
tags: [reference, backend, contracts]
topic: backend
---

# Backend contracts confirmed so far

Facts the user relayed directly from conversations with the backend team. Treat as ground
truth for specs; do not re-derive or guess around them.

## Inscripción recency (resolved — no longer ambiguous)

- `GET /capacitacion/ver/cursos/` (and módulos under it): `inscrito`/`progreso` are **already**
  computed by the backend over the colaborador's most recent inscripción to that curso
  (`_inscripcion_reciente` in `capacitacion/serializers/colaborador.py`, `inscrito_at` desc,
  `pk` as tiebreak on ties). The frontend never re-derives this for these two fields.
- `GET /competencias/mi-perfil-competencias/` (rutas recomendadas → `cursos[].inscripcion_id`):
  same guarantee, same criterion.
- `GET /capacitacion/mis-inscripciones/` is the **raw** list — one row per inscripción, not
  deduplicated. If the frontend needs "the current one" for a given curso from *this* endpoint
  directly, it must sort by `inscrito_at` desc (pk as tiebreak) client-side — this endpoint is
  deliberately the full list (e.g. for an inscription history view).
- Backend spec of record (in the backend's own repo, not this one):
  `recorrido-formativo-periodos-acreditacion.md`, Clarification #5-7. Treat as stable contract,
  not provisional — it already has backend-side tests for the ordering rule.
- Note: the frontend hook is named `useGetMiPerfilQuery` hitting `/competencias/mi-perfil/`
  today (`redux/features/competencias/competenciasApiSlice.ts`) — the backend message above
  names the URL `/competencias/mi-perfil-competencias/`. **Unresolved naming mismatch** — confirm
  the real URL with backend before relying on either in a new spec.

## Content blocks (`ContenidoBloque`) — real full shape, incl. evaluative blocks

`GET /capacitacion/ver/bloques/?tema=<id>` (colaborador-authenticated), one entry per block,
`ContenidoBloqueColaboradorSerializer`:

```json
{
  "id": 1, "tema": 5,
  "tipo_nombre": "Opción múltiple", "tipo_codigo": "opcion-multiple",
  "orden": 1, "texto": "...", "variante": "",
  "items": null, "filas": null,
  "video_url": "", "video_stream_url": null,
  "imagen_url": "", "imagen_archivo": null,
  "bloque_items": [ { "id": 1, "orden": 1, "titulo": "...", "texto": "...", "imagen_url": "...", "imagen_archivo": null, "items": null } ],
  "archivos": [ { "id": 1, "orden": 1, "file": "...", "original_name": "...", "mime_type": "...", "size_formatted": "...", "file_type": "...", "description": "..." } ],
  "opciones": [ { "id": 10, "orden": 1, "texto": "Verdadero" } ]
}
```

**This project's frontend currently has NONE of this wired** (`bloque-renderer.tsx`,
`ContenidoBloque`/`BloqueContenido` types only know the 7 `texto-*` codes from this session's
earlier work). Confirmed gaps for the next spec that covers this (Reproductor de
aprendizaje / Evaluaciones, not Mis cursos):

- Two new block `tipo_codigo` values not in the current 7: `opcion-multiple`,
  `verdadero-falso` — these are **evaluative content blocks embedded inline in a tema**,
  distinct from the separate formal `Evaluacion`/`Pregunta`/`OpcionPregunta` model that already
  exists. Both systems coexist; do not conflate them.
- `archivos[]` — a downloadable-files array nested in any block, not just evaluative ones.
  Not modeled anywhere in the frontend yet.
- `opciones[]` on the block itself (for `opcion-multiple`/`verdadero-falso`) — **never includes
  `es_correcta`**. The correct answer is never shown to the colaborador before they answer.
  This is a hard constraint (constitution-level: no exposing correct answers early).
- `video_stream_url` is computed server-side only when a `video_archivo` exists and there is a
  request in context; points at `/api/capacitacion/stream/<bloque_id>/`.

### Submitting an answer to an evaluative content block

`POST /capacitacion/mis-respuestas-bloque/` — body `{"bloque": <id>, "opcion_seleccionada": <id>}`.
Response (`MiRespuestaBloqueSerializer`):

```json
{
  "id": 7, "bloque": 1, "bloque_texto": "...",
  "opcion_seleccionada": 10, "es_correcta": true,
  "respondido_at": "2026-11-11T...", "activo": true
}
```

- `es_correcta` is always server-computed; never writable from the client.
- Each POST creates a new attempt — **no PATCH to edit an attempt** (already a known constraint
  from the original brief, now confirmed to apply here too).
- `ContenidoBloqueRespuesta` is tied to the colaborador's **active Inscripcion**, not directly to
  the colaborador. `EvidenciaService.registrar_respuesta_bloque` resolves the active inscripción
  whose curso matches the bloque's tema's curso. If the colaborador has 2+ inscripciones to the
  same curso (an old finished one, a new active one), the answer always attaches to the active
  one — never mixed with the old one.
- `GET /mis-respuestas-bloque/` returns only attempts for the authenticated colaborador's
  inscripción (filtered by `inscripcion__colaborador`) — re-enrolling in a new period does not
  mix in attempts from the previous inscripción.
- New error shapes the frontend must handle (not generic 400s to swallow silently):
  - No active inscripción to any curso: `{"detail": "No tienes una inscripción activa para el curso de este bloque."}`
  - Active inscripción but to a different curso, or the option doesn't belong to the submitted block:
    `{"opcion_seleccionada": "Esa opción no pertenece al bloque indicado, o el bloque no pertenece al curso de tu inscripción activa."}`

**This belongs to the "Reproductor de aprendizaje" / "Evaluaciones" specs, not "Mis cursos".**
