---
type: plan
title: Plan — Vista previa en vivo del editor de bloques
description: Plan técnico de nivel estructura para fusionar el formulario de edición y la vista previa real de un bloque en el mismo panel.
tags: [sdd, plan]
timestamp: 2026-11-12T00:00:00Z
topic: sdd
slug: editor-bloques-vivo
status: approved
---

# Plan — Vista previa en vivo del editor de bloques

> Spec: [../specs/editor-bloques-vivo.md](../specs/editor-bloques-vivo.md) · Constitution: [../constitution.md](../constitution.md) · Status: approved
> Last updated: 2026-11-12

## 0. Global Constraints

- **Renderer único:** toda vista previa en vivo pasa por `BloqueRenderer`
  (`app/components/plataforma/bloque-renderer.tsx`). Se permite **extenderlo** (añadir props/casos);
  **nunca** crear un segundo componente que reimplemente su `switch` por `tipo_codigo` (constitución
  principio 19, aclarado en `clarify`).
- **`PreviewPane` no se toca.** `app/components/dash/capacitacion/bloques/bloques-section.tsx`
  líneas ~292-309 (documento completo del tema, solo lectura, pestaña "Vista previa") queda byte a
  byte como está. Ninguna tarea de este plan edita esa función.
- **Semántica de guardado intacta:** los campos planos del formulario (`texto`, `variante`, `items`,
  `filas`, `video_url`, `imagen_url`) siguen persistiendo solo al pulsar "Guardar" (`handleSave` →
  `updateBloque`). Los ítems (`ContenidoBloqueItem` vía `LiveItemsEditor`/`LiveItemRow`) siguen
  persistiendo individualmente al pulsar "Guardar cambios" de cada fila (`updateItem`). Este plan
  **no cambia cuándo se persiste nada** — solo añade un canal de solo-lectura hacia la vista previa.
- **El agente nunca ejecuta `git commit`/`add`/`push`** (constitución principio 13a).
- **Sin suite de tests** (constitución principio 7). Verificación: `tsc --noEmit`, `eslint`,
  `pnpm run build`, y un pase manual en navegador por cada uno de los 11 tipos de bloque listados
  en la spec §"How it proves it" (texto-imagen, texto-elemento-dinamico, lista, pasos,
  callout/alerta ×4 variantes, texto-paneles, texto-presentacion, texto-presentacion-paneles,
  texto-tarjetas, tabla, video/texto-video).
- **Layout del panel ensanchado** (resuelve la pregunta abierta de la spec): en escritorio
  (`≥1024px`, breakpoint `lg` de Tailwind), el panel de propiedades pasa de panel fijo de 320px a
  una hoja (`Sheet`) de hasta `max-w-3xl` (768px) con dos columnas internas — formulario a la
  izquierda (~320px), vista previa a la derecha (resto del ancho). Por debajo de `lg`, una sola
  columna: vista previa arriba, formulario abajo, ambos con scroll dentro del mismo `Sheet`. Esta es
  una propuesta escrita, no un mockup aprobado — ver §7.

## 1. Context & constraints

- Criterios de aceptación que moldean el diseño: spec AC1 (preview real al abrir), AC2 (campos
  planos en vivo), AC3 (ítems vía `LiveItemsEditor` en vivo), AC4 (estado vacío visible), AC5
  (apilado en móvil), AC6 (`PreviewPane` intacto).
- Regla de constitución en juego: principio 19 (un solo renderer, extensible no duplicable, ya
  aclarado en `clarify`), principio 13a (sin commits del agente), principio 7 (sin tests).
- Fuera de alcance que el diseño no debe invadir (de la spec): el canvas (lista ordenable,
  drag-and-drop, biblioteca), la pestaña "Vista previa" existente, el modo "tablero único", la
  previsualización de archivos aún no subidos.
- Hecho de código confirmado que cambia el diseño: los ítems de bloque (`ContenidoBloqueItem`) no
  comparten el ciclo de guardado del bloque — cada fila en `LiveItemRow`
  (`bloque-item-editors.tsx`) mantiene su propio estado local (`titulo`, `texto`, `imagenUrl`,
  `subItems`) y lo persiste con su propio botón "Guardar cambios" (`updateItem`), independiente del
  `handleSave` del bloque padre. Ese estado local ya existe en memoria antes de guardarse — es
  exactamente el dato que la vista previa en vivo necesita leer para cumplir AC3, pero hoy no sale
  de `LiveItemRow`: no hay ningún canal que lo exponga hacia arriba.

## 2. Architecture

```text
[ BloquesSection ] --abre con bloque seleccionado--> [ PropertiesPanel (Sheet ancho) ]
                                                            |
                                   +------------------------+------------------------+
                                   |                                                 |
                         [ BloqueFormFields ]                          [ LiveItemsEditor ]
                         (campos planos: texto,                        (ítems: título/texto/
                          variante, imagen_url,                         imagen/sub-items, un
                          video_url, filas)                             guardado propio por fila)
                                   |                                                 |
                                   | onChange (ya existe,                            | onLiveChange (NUEVO,
                                   | setForm local)                                  | solo observación,
                                   |                                                 | no cambia el guardado)
                                   v                                                 v
                         [ form: Partial<BloqueForm> ]                  [ liveItems: ContenidoBloqueItem[] ]
                                   |                                                 |
                                   +------------------+------------------------------+
                                                       v
                                       [ buildPreviewBloque(bloque, form, liveItems)
                                            -> BloqueContenido ]  (NUEVO, puro, sin estado)
                                                       |
                                                       v
                                       [ BloqueRenderer (extendido: estado vacío visible) ]
```

- **`PropertiesPanel`** (interno, ya existe) — dueño del formulario y, ahora también, de ensamblar
  el objeto a previsualizar y renderizar la columna de vista previa junto al formulario.
- **`LiveItemsEditor` / `LiveItemRow`** (interno, ya existen) — ganan un canal de solo-lectura
  (`onLiveChange`) hacia el padre; su guardado real (`updateItem`) no cambia.
- **`buildPreviewBloque`** (interno, nuevo, función pura) — combina valores guardados + en edición
  en un único `BloqueContenido`; vive junto a `toBloqueContenido` (mismo archivo o
  `bloque-utils.ts`), reusando su mismo patrón de mapeo campo a campo.
- **`BloqueRenderer`** (interno, ya existe, se extiende) — gana la capacidad de mostrar un estado
  vacío visible cuando antes devolvía `null`.
- **`PreviewPane`** (interno, ya existe) — sin cambios, no aparece en este diagrama porque no
  participa del flujo nuevo.

**Decisión arquitectónica principal:** el canal de vista previa en vivo es **unidireccional y de
solo lectura** — el formulario y los ítems siguen siendo la única fuente de verdad de lo que se
guarda; la vista previa solo observa su estado ya existente (`form`) y un estado nuevo pero
igualmente local (`liveItems`), nunca al revés. Se eligió esto, en vez de una re-arquitectura hacia
un store compartido o un guardado optimista silencioso, porque la restricción §0 exige no tocar
cuándo ni cómo se persiste nada — cualquier diseño que mezclara lectura y escritura en el mismo
canal arriesgaría romper esa restricción sin necesidad: el problema que la spec pide resolver es de
visibilidad, no de persistencia.

## 3. Interfaces & contracts

```text
buildPreviewBloque(bloque: ContenidoBloque, form: Partial<BloqueForm>, liveItems: ContenidoBloqueItem[] | null) -> BloqueContenido
  - precondition: bloque es el último bloque guardado conocido (de useGetBloquesByTemaQuery)
  - postcondition: devuelve un BloqueContenido donde texto/variante/items/filas/video_url/imagen_url
    vienen de `form` cuando `form` trae un valor definido para ese campo, y de `bloque` en caso
    contrario; bloque_items viene de `liveItems` cuando no es null, y de `bloque.bloque_items` en
    caso contrario
  - invariant: función pura, sin side effects, sin llamadas de red

LiveItemsEditor({ items: ContenidoBloqueItem[], tipoCodigo: string, bloqueId: number, onLiveChange?: (items: ContenidoBloqueItem[]) => void })
  - postcondition (NUEVO): si onLiveChange está presente, se invoca en cada cambio de cualquier
    campo de cualquier fila (incluyendo antes de que esa fila se guarde), con el array completo de
    ítems reflejando el estado en edición de todas las filas
  - invariant: el guardado real por fila (updateItem) no depende de onLiveChange ni se ve afectado
    si onLiveChange está ausente

BloqueRenderer({ bloque: BloqueContenido, onVideoEnd?: () => void, vacioPlaceholder?: boolean })
  - postcondition (NUEVO): cuando vacioPlaceholder es true (default: false) y la rama de dispatch
    para bloque.tipo_codigo hoy devolvería null por falta de contenido, devuelve en su lugar un
    bloque visible con un mensaje corto de estado vacío (ej. "Este bloque no tiene contenido
    todavía") en vez de null
  - invariant: cuando vacioPlaceholder es false u omitido, el comportamiento es IDÉNTICO al actual
    — la plataforma del alumno y PreviewPane (que no pasan esta prop) no cambian en absoluto
```

## 4. Data model & flow

**Entidades**

- Ninguna entidad persistida nueva. `buildPreviewBloque` y el estado `liveItems` son puramente de
  cliente, derivados de entidades ya existentes (`ContenidoBloque`, `ContenidoBloqueItem`).

**Flujo principal** (`AC2 — editar un campo plano y ver la vista previa reflejarlo sin guardar`)

1. El instructor selecciona un bloque en el canvas → `PropertiesPanel` monta con `form` inicializado
   desde `bloque` (ya existe hoy) y `liveItems` inicializado en `null` (= "usa `bloque.bloque_items`
   tal cual").
2. El instructor edita el campo de texto → `setForm` actualiza el estado local (ya existe hoy, sin
   cambios).
3. En el mismo render, `PropertiesPanel` llama `buildPreviewBloque(bloque, form, liveItems)` y pasa
   el resultado a `BloqueRenderer` con `vacioPlaceholder`.
4. `BloqueRenderer` re-renderiza con el nuevo texto. Ninguna llamada de red ocurrió.

**Flujo secundario** (`AC3 — editar un ítem vía LiveItemsEditor y ver la vista previa reflejarlo sin guardar`)

1. El instructor edita el campo "texto" de una fila dentro de `LiveItemsEditor` → `LiveItemRow`
   actualiza su estado local (ya existe hoy) y, además, invoca `onLiveChange` con el array completo
   de ítems en su estado actual (incluyendo los de otras filas no tocadas).
2. `PropertiesPanel` guarda ese array en `liveItems` (nuevo `useState`).
3. `buildPreviewBloque` usa `liveItems` en vez de `bloque.bloque_items` → `BloqueRenderer`
   re-renderiza reflejando el ítem editado. El `updateItem` real (persistencia) solo ocurre si el
   instructor pulsa "Guardar cambios" en esa fila — sin relación con este flujo.

- Límites de consistencia: `liveItems` y `form` son estado de un solo componente (`PropertiesPanel`
  y sus hijos directos), nunca sincronizado contra el servidor hasta que el usuario guarda
  explícitamente por el camino que ya existe hoy.
- Impacto de migración: ninguno. No hay cambios de esquema ni de backend.

## 5. Testing strategy

| Criterio de aceptación | Nivel | Qué confirma | Qué se simula/omite |
| --- | --- | --- | --- |
| AC1 (preview real al abrir) | manual en navegador | Al abrir un bloque guardado, la vista previa muestra su contenido real, no un resumen | Ninguno — contra datos reales del backend de desarrollo |
| AC2 (campos planos en vivo) | manual en navegador, por tipo | Editar texto/imagen/video/variante actualiza la vista previa sin guardar | Se prueba 1 tipo representativo por rama de dispatch de `BloqueRenderer` (texto-imagen, callout, tabla, video) |
| AC3 (ítems en vivo) | manual en navegador | Editar un ítem en `LiveItemsEditor` actualiza la vista previa sin guardar ni disparar `updateItem` | Se confirma con las devtools de red que no sale ninguna petición al escribir, solo al pulsar "Guardar cambios" |
| AC4 (estado vacío visible) | manual en navegador + `tsc`/`eslint` sobre la extensión de `BloqueRenderer` | Un bloque recién creado muestra un mensaje, no un hueco en blanco | — |
| AC5 (apilado en móvil) | manual en navegador, viewport angosto (DevTools) | El panel se apila (preview arriba, formulario abajo) por debajo de 1024px | — |
| AC6 (`PreviewPane` intacto) | manual en navegador + diff de código | La pestaña "Vista previa" del tema completo se ve y comporta igual que antes del cambio | Se confirma que `bloques-section.tsx` no tocó las líneas de `PreviewPane` |

- Dónde está la línea de e2e: no hay — sin suite de tests (principio 7), todo el nivel "integration/e2e"
  de esta tabla es manual en navegador contra el backend real de desarrollo.
- Lo que DEBE ser real (no simulado) para que la prueba signifique algo: el backend real
  (`NEXT_PUBLIC_HOST`) sirviendo bloques reales — no hay fixtures locales para este flujo.

## 6. Sequencing & dependencies

1. Extender `BloqueRenderer` con `vacioPlaceholder` (prop opcional, default false; sin cambiar el
   comportamiento por defecto) — depende de: ninguno — serial (todo lo demás lo consume).
2. Añadir `onLiveChange` a `LiveItemsEditor`/`LiveItemRow` (opcional, no cambia el guardado real) —
   depende de: ninguno — paralelizable con el paso 1 (archivos distintos).
3. Escribir `buildPreviewBloque` (función pura) — depende de: 1 (necesita conocer la forma exacta de
   `BloqueContenido` que `BloqueRenderer` extendido espera).
4. Ensanchar `PropertiesPanel`: Sheet de hasta `max-w-3xl`, layout de dos columnas en `≥lg`, una
   columna apilada debajo — depende de: 1, 3 (necesita `buildPreviewBloque` y la prop nueva para
   montar la columna de preview).
5. Conectar `liveItems` dentro de `PropertiesPanel` al `onLiveChange` del paso 2 y al
   `buildPreviewBloque` del paso 3 — depende de: 2, 3, 4.
6. Unificar el punto de apertura del panel: hoy existen dos renders de `PropertiesPanel` en
   `BloquesSection` (uno inline fijo para `lg:`, otro dentro de `Sheet` para móvil); con el panel ya
   siendo un `Sheet` ancho también en escritorio (paso 4), el render inline fijo deja de ser
   necesario — se retira, dejando un solo punto de apertura — depende de: 4.
7. Verificación manual: pase por los 11 tipos de bloque + viewport móvil + confirmar `PreviewPane`
   intacto (tabla §5) — depende de: 1-6, todos.

- Candidatos paralelos (sin estado compartido): pasos 1 y 2 (archivos `bloque-renderer.tsx` y
  `bloque-item-editors.tsx`, sin solaparse).
- Restricción de orden dura: el paso 4 (layout) no puede empezar sin el paso 3 (qué le pasa al
  `BloqueRenderer`) porque el layout de dos columnas necesita saber qué prop recibe la columna
  derecha.

## 7. Risks & open decisions

**Risks**

| Risk | Trigger | Impact | Mitigation / spike to retire it |
| --- | --- | --- | --- |
| `buildPreviewBloque` arrastra un campo con forma distinta entre `ContenidoBloque` (editor) y `BloqueContenido` (plataforma) y rompe el tipado o el render | Un tipo de bloque nuevo o poco probado (ej. `tabla`, cuyo `filas` tiene shapes inconsistentes observados en datos semilla esta sesión) | Vista previa muestra datos incorrectos o `tsc` falla | Construir `buildPreviewBloque` reusando el mismo mapeo campo a campo que `toBloqueContenido` ya usa (probado), no uno nuevo desde cero; `tsc --noEmit` en cada paso |
| Retirar el render inline fijo de escritorio (paso 6) cambia el layout de 3 columnas (biblioteca/canvas/propiedades) de forma más visible de lo esperado | El Sheet ancho se superpone o dificulta ver el canvas mientras se edita | Instructor pierde contexto del resto de bloques mientras edita uno | Es el comportamiento esperado de un overlay (igual que en móvil hoy); si tras la verificación manual resulta molesto, es un ajuste de CSS acotado, no un rediseño de arquitectura |
| `onLiveChange` dispara un re-render de `BloqueRenderer` en cada tecla para bloques con muchos ítems | Un bloque con una cantidad de paneles/tarjetas fuera de lo visto hasta ahora (los datos semilla de esta sesión muestran ≤3) | Vista previa se siente lenta al escribir | Bajo riesgo dado el tamaño típico; si aparece, `plan` ya dejó la puerta abierta a un debounce corto sin romper el criterio de aceptación (ver spec, supuesto tomado sobre debounce) |

**Open decisions**

- El layout exacto del §0 (dos columnas 320px/resto en escritorio, apiladas bajo `lg`, Sheet hasta
  `max-w-3xl`) es una propuesta escrita de este plan, no un mockup aprobado — la spec pedía una
  referencia visual aprobada antes de construir, y este agente no puede generar una captura real
  antes de que el código exista. Se resuelve así: el usuario aprueba esta descripción escrita como
  sustituto de la captura (cierra con la aprobación de este plan); tras el primer pase de
  `implement`, el usuario revisa el resultado real en navegador y cualquier ajuste de proporciones
  se corrige como parte de la verificación del paso 7, no como una spec nueva.
- Texto exacto del mensaje de estado vacío (AC4) — closes cuando `tasks`/`implement` lo redacte;
  no cambia el contrato (`vacioPlaceholder: boolean`), solo la copia.

## Tasks
<!-- generated by tasks on 2026-11-12; IDs are stable, do not renumber -->

| ID | [P] | Task | Done-check | Depends-on | Trace | Risk |
| --- | --- | --- | --- | --- | --- | --- |
| T001 | | Extender `BloqueRenderer` con `vacioPlaceholder` | `tsc --noEmit` limpio; con `vacioPlaceholder` omitido, `grep` confirma que cada rama que hoy hace `return null` por falta de contenido sigue intacta (comportamiento por defecto idéntico); con `vacioPlaceholder=true`, inspección manual confirma un mensaje visible en vez de `null` para al menos un tipo (ej. `texto-imagen` sin imagen ni texto) | — | AC4 | 1 |
| T002 | [P] | Añadir `onLiveChange` a `LiveItemsEditor`/`LiveItemRow` | `tsc --noEmit` limpio; `grep -n "onLiveChange"` en `bloque-item-editors.tsx` confirma la prop nueva y su invocación en cada `onChange` de fila; manual: escribir en un campo de una fila NO dispara ninguna petición de red (DevTools) | — | AC3 | 1 |
| T003 | | Escribir `buildPreviewBloque` | `tsc --noEmit` limpio; función pura exportada, sin `await`/llamadas a RTK Query dentro; manual: invocarla con un `bloque` guardado y un `form` con un campo distinto confirma que el campo de `form` gana sobre el de `bloque` | T001 | AC1, AC2, AC3 | 1 |
| T004 | | Ensanchar `PropertiesPanel`: `Sheet` ancho + layout de 2 columnas, con la columna de preview ya mostrando el bloque guardado (estático, sin conectar a `form`/`liveItems` todavía) | `tsc --noEmit` limpio; manual en navegador ≥1024px: formulario y columna de preview visibles lado a lado, la preview muestra el `BloqueRenderer` del bloque tal como está guardado (vía `buildPreviewBloque(bloque, {}, null)`); manual <1024px: apilados, ambos con scroll | T001, T003 | AC1, AC5 | 1 |
| T005 | | Conectar `liveItems` + `buildPreviewBloque` dentro de `PropertiesPanel` | `tsc --noEmit` limpio; manual: editar un campo plano actualiza la preview sin guardar (AC2); editar un ítem vía `LiveItemsEditor` actualiza la preview sin guardar y sin disparar `updateItem` hasta pulsar "Guardar cambios" de esa fila (AC3) | T002, T003, T004 | AC2, AC3 | 1 |
| T006 | | Unificar el punto de apertura del panel (retirar el render inline fijo de escritorio) | `tsc --noEmit` limpio; `grep -c "<PropertiesPanel"` en `bloques-section.tsx` baja de 2 a 1; manual: en escritorio, el panel se abre como `Sheet` ancho igual que en móvil, biblioteca y canvas no cambian | T004 | AC5 | 1 |
| T007 | | Verificación manual de cierre | `npx tsc --noEmit -p .`, `npx eslint` sobre los archivos tocados y `pnpm run build` sin errores; pase manual en navegador por los 11 tipos de bloque listados en el plan §0 confirmando AC1-AC4; viewport móvil confirmando AC5; pestaña "Vista previa" revisada confirmando AC6 sin cambios | T001, T002, T003, T004, T005, T006 | AC1, AC2, AC3, AC4, AC5, AC6 | 0 |

**T001 — Interfaces**
- Produces: `BloqueRenderer({ bloque: BloqueContenido, onVideoEnd?: () => void, vacioPlaceholder?: boolean })` — con `vacioPlaceholder` en `true` y la rama de dispatch para `bloque.tipo_codigo` devolviendo hoy `null` por falta de contenido, devuelve en su lugar un nodo visible con un mensaje corto de estado vacío; con `vacioPlaceholder` en `false` u omitido, el comportamiento es idéntico al actual.

**T002 — Interfaces**
- Produces: `LiveItemsEditor({ items: ContenidoBloqueItem[], tipoCodigo: string, bloqueId: number, onLiveChange?: (items: ContenidoBloqueItem[]) => void })` — `onLiveChange`, si está presente, se invoca en cada cambio de cualquier campo de cualquier fila con el array completo de ítems reflejando el estado en edición (incluyendo filas aún no guardadas); el guardado real por fila (`updateItem`) no depende de esta prop ni se ve afectado si está ausente.

**T003 — Interfaces**
- Consumes: `vacioPlaceholder` de `BloqueRenderer` (T001); el patrón de mapeo campo a campo que ya usa `toBloqueContenido` en `bloques-section.tsx` (línea ~61).
- Produces: `buildPreviewBloque(bloque: ContenidoBloque, form: Partial<BloqueForm>, liveItems: ContenidoBloqueItem[] | null) -> BloqueContenido` — campos planos (`texto`/`variante`/`items`/`filas`/`video_url`/`imagen_url`) vienen de `form` cuando `form` trae un valor definido para ese campo, si no de `bloque`; `bloque_items` viene de `liveItems` cuando no es `null`, si no de `bloque.bloque_items`.

**T004 — Interfaces**
- Consumes: `buildPreviewBloque` (T003); `vacioPlaceholder` (T001).
- Produces: el `SheetContent` de `PropertiesPanel` pasa a `className="p-0 sm:max-w-sm lg:max-w-3xl"` (o equivalente); contenedor interno `lg:grid lg:grid-cols-[320px_1fr]` (formulario | preview), apilado (`flex flex-col`) por debajo de `lg`. La columna de preview monta `<BloqueRenderer bloque={buildPreviewBloque(bloque, {}, null)} vacioPlaceholder />` — un snapshot estático del bloque tal como está guardado, sin leer `form` ni `liveItems` todavía (eso es T005). Esto es intencional: deja la estructura visual terminada y verificable (AC1, AC5) antes de hacerla reactiva.

**T005 — Interfaces**
- Consumes: `onLiveChange` (T002); `buildPreviewBloque` (T003); la columna de preview ya montada por T004.
- Produces: `PropertiesPanel` mantiene `liveItems: ContenidoBloqueItem[] | null` (nuevo `useState`, inicial `null`); reemplaza la llamada estática de T004 (`buildPreviewBloque(bloque, {}, null)`) por `buildPreviewBloque(bloque, form, liveItems)`, recalculada en cada render — así la misma columna que T004 construyó pasa de estática a reactiva sin cambiar su estructura.

## Review Workload Forecast

| Dimension | Forecast | Why |
| --- | --- | --- |
| Estimated changed lines | ~180-260 | 4 archivos, cada uno con una extensión acotada (una prop nueva, un callback, una función pura, un layout) — nada reescrito desde cero |
| Files / areas | 3: `app/components/plataforma/bloque-renderer.tsx`, `app/components/dash/capacitacion/bloques/bloque-item-editors.tsx`, `app/components/dash/capacitacion/bloques/bloques-section.tsx` (contiene `buildPreviewBloque`, `PropertiesPanel`, el punto de apertura del panel) | Todo frontend, sin backend ni migraciones |
| Risk | tier 1 en los 4 archivos (`rsc risk`); 0 tareas tier 2 | Cambio de UI/estado de cliente puro, sin auth/billing/CI/migraciones/secretos |
| Suggested delivery | single-pr | Por debajo del presupuesto de línea por defecto (400) y confinado a un solo subsistema (editor de bloques) |

