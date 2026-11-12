---
type: plan
title: Plan — Lienzo WYSIWYG del constructor de bloques (primer incremento)
description: Plan técnico de nivel estructura — BloqueRenderer editable, un solo bloque con estado en vivo a la vez, el resto en solo lectura.
tags: [sdd, plan]
timestamp: 2026-11-12T00:00:00Z
topic: sdd
slug: lienzo-wysiwyg
status: draft
---

# Plan — Lienzo WYSIWYG del constructor de bloques (primer incremento)

> Spec: [../specs/lienzo-wysiwyg.md](../specs/lienzo-wysiwyg.md) · Constitution: [../constitution.md](../constitution.md) · Status: draft
> Last updated: 2026-11-12

## 0. Global Constraints

- **Un solo `BloqueRenderer`, extensible, nunca duplicado** (constitución, principio 19). Toda
  edición directa pasa por una nueva prop opcional `modoEdicion` — cuando está ausente/`undefined`,
  el render es **byte a byte idéntico** al actual (plataforma del alumno, `PreviewPane`, y el propio
  editor cuando el bloque no está seleccionado).
- **El agente nunca ejecuta `git commit`/`add`/`push`** (principio 13a).
- **Sin suite de tests** (principio 7). Verificación: `tsc --noEmit`, `eslint`, `pnpm run build`, y
  un pase manual en navegador por cada uno de los 7 tipos cubiertos (texto-imagen,
  texto-elemento-dinamico, lista, pasos, callout/alerta, tabla, video/texto-video).
- **El guardado sigue siendo el botón "Guardar" existente** (`handleSave`/`updateBloque`). Ningún
  campo se persiste solo; `modoEdicion` solo escribe en el mismo estado local (`form`/`liveItems`)
  que ya existía antes de esta spec.
- **Un solo bloque con estado en vivo a la vez.** Exactamente como hoy (`PropertiesPanel` con
  `key={selected.id}`), el `form`/`liveItems` del bloque seleccionado se monta al seleccionarlo y se
  descarta al deseleccionarlo. Los demás bloques del lienzo se renderizan siempre en modo lectura
  (`toBloqueContenido`, sin `modoEdicion`) — nunca tienen un segundo `form` en memoria a la vez.
- **Reusar `buildPreviewBloque`/`toBloqueContenido` tal cual** (de `editor-bloques-vivo`) — esta
  spec no cambia cómo se combina `bloque`+`form`+`liveItems`, solo mueve DÓNDE se dispara la
  edición que llena esos mismos estados.
- **Indicador visual de selección/edición** (resuelve el área no formulable de la spec, propuesta
  escrita — ver §7 Open decisions para el estado de aprobación): el bloque **seleccionado** (no
  necesariamente con el foco dentro de un campo) muestra el mismo anillo azul que ya usa
  `SortableBloqueCard` hoy (`border-[#0056D2] ring-1 ring-[#0056D2]/30`), aplicado alrededor de todo
  el bloque renderizado. El elemento con el **foco real** (donde se está escribiendo/editando en
  este instante) usa además un contorno punteado (`outline outline-dashed outline-[#0056D2]/50`) —
  aprovecha el `:focus` nativo del navegador, sin estado de React adicional para distinguirlo.

## 1. Context & constraints

- Criterios de aceptación que moldean el diseño: spec AC1 (render real en el lienzo), AC2 (texto en
  vivo para texto-imagen/texto-elemento-dinamico/callout), AC3 (imagen/video en vivo), AC4
  (agregar/quitar ítem de lista/pasos), AC5 (agregar/editar/quitar fila de tabla), AC6 (variante de
  callout en vivo), AC7 (panel sin campos de contenido ya editables en el lienzo), AC8 (guardado
  explícito sin cambios), AC9 (tipos fuera de alcance intactos).
- Regla de constitución en juego: principio 19 (ya aclarado para permitir extensión), principio 13a,
  principio 7.
- Fuera de alcance que el diseño no debe invadir (de la spec): tarjetas/paneles/presentaciones,
  bloques evaluativos, campos/endpoints nuevos de backend, autoguardado, formato de texto
  enriquecido, rediseño de la biblioteca de tipos.
- Hecho de código confirmado que fija el diseño: `buildPreviewBloque`/`toBloqueContenido` y el
  estado `form`/`liveItems` ya existen y funcionan (de `editor-bloques-vivo`); esta spec los reusa
  tal cual, cambiando solo la superficie que los llena.
- Hecho de código confirmado que es un riesgo real para `tabla`: una tabla vacía no tiene cómo
  derivar sus columnas (`Object.keys(filas[0])` falla si `filas` está vacío). El patrón ya existente
  en `bloque-form-fields.tsx` ("Agregar fila" siembra `{ columna1: "", columna2: "" }`) es el que
  esta spec debe seguir también desde el lienzo — no es un problema nuevo, es continuar el mismo
  patrón.

## 2. Architecture

```text
[ BloquesSection ] --selectedId-->  por cada bloque:
                                     [ LienzoBloqueCard (key=bloque.id) ]
                                             |
                                   ¿bloque.id === selectedId?
                                      no  |            | sí
                                          v            v
                             [ BloqueRenderer       [ owns form, liveItems (useState,
                               (toBloqueContenido     igual patrón que hoy tenía
                               (bloque)) ]             PropertiesPanel) ]
                             solo lectura,                    |
                             clic para seleccionar             v
                                               [ BloqueRenderer(
                                                   buildPreviewBloque(bloque, form, liveItems),
                                                   vacioPlaceholder,
                                                   modoEdicion: { onTextoChange, onImagenChange,
                                                     onVideoChange, onItemsChange, onFilasChange,
                                                     onVarianteChange } ) ]
                                               + barra de acciones del bloque (Guardar/Cancelar/
                                                 Duplicar/Eliminar — ya existían, se reubican aquí)
                                                       |
                                                       v
                                        [ PropertiesPanel liviano ] — SOLO si el tipo tiene
                                          configuración residual (hoy: únicamente el "Modo de
                                          visualización" de texto-elemento-dinamico). Para el
                                          resto de los tipos cubiertos, no se monta ningún panel.
```

- **`LienzoBloqueCard`** (interno, nuevo) — reemplaza el cuerpo de `SortableBloqueCard` (mantiene
  el drag handle y los botones de duplicar/eliminar que ya existían). Única responsabilidad: decidir
  si este bloque es el seleccionado y, si lo es, poseer su `form`/`liveItems` y pasarlos a
  `BloqueRenderer` en modo edición; si no, pasarlo en modo lectura.
- **`BloqueRenderer`** (interno, se extiende) — gana una prop `modoEdicion` opcional con callbacks
  por tipo. Sigue siendo la única implementación de render; el modo edición añade comportamiento
  dentro de cada rama existente, nunca un árbol de componentes paralelo.
- **`buildPreviewBloque` / `toBloqueContenido`** (internos, ya existen, sin cambios) — siguen
  siendo el único punto donde `bloque`+`form`+`liveItems` se combinan.
- **`PropertiesPanel`** (interno, se reduce) — deja de recibir `BloqueFormFields`/`LiveItemsEditor`
  para los 7 tipos cubiertos (ya no hay nada que mostrarles); solo sigue montándose para
  `texto-elemento-dinamico` (su toggle de modo) y, sin cambios, para los tipos fuera de alcance de
  esta spec (tarjetas/paneles/presentaciones), que siguen con el patrón completo de
  `editor-bloques-vivo` tal cual.

**Top architectural decision — dónde vive el estado en vivo, y por qué:** el `form`/`liveItems` del
bloque en edición se mueve de `PropertiesPanel` a `LienzoBloqueCard`, pero sigue siendo **exactamente
un estado a la vez**, igual que hoy. La alternativa — levantar el estado en vivo de TODOS los
bloques del lienzo simultáneamente, para que "cualquiera" sea editable sin clic previo — se descarta
explícitamente: multiplicaría el estado en memoria por cada bloque del tema (algunos temas tienen
decenas), y el propio criterio de aceptación de la spec sigue requiriendo una selección explícita
("Selecciono una tarjeta → ... → hago clic en su título") antes de escribir, no edición simultánea
de todo el lienzo a la vez. Mover el estado existente a un nuevo dueño (`LienzoBloqueCard` en vez de
`PropertiesPanel`) es un cambio de ubicación, no de diseño — el ciclo de vida (`key={bloque.id}`,
se monta al seleccionar, se descarta al deseleccionar) es idéntico al que `PropertiesPanel` ya tenía
antes de esta spec.

## 3. Interfaces & contracts

```text
BloqueRenderer({
  bloque: BloqueContenido,
  onVideoEnd?: () => void,
  vacioPlaceholder?: boolean,
  modoEdicion?: {
    onTextoChange?: (texto: string) => void
    onImagenChange?: (v: { url?: string; archivo?: File }) => void
    onVideoChange?: (v: { url?: string; archivo?: File }) => void
    onItemsChange?: (items: string[]) => void
    onFilasChange?: (filas: Record<string, string>[]) => void
    onVarianteChange?: (variante: string) => void
  }
}) -> JSX
  - precondition: modoEdicion ausente/undefined -> render IDÉNTICO al actual en cada rama existente
  - postcondition: modoEdicion presente, solo los callbacks relevantes para bloque.tipo_codigo
    tienen efecto (ej. onItemsChange no se usa en un bloque texto-imagen); el texto/imagen/video se
    hace editable con el mecanismo que `plan` elige en implement (equivalente observable:
    contenteditable sobre el nodo ya renderizado, nunca un input superpuesto con otro estilo —
    spec, suposición tomada), y cada callback se invoca con el valor nuevo completo (no un diff)
  - invariant: ningún callback de modoEdicion dispara una llamada de red — siguen siendo,
    exactamente como `form`/`liveItems` hoy, estado local hasta que el instructor guarda

LienzoBloqueCard({ bloque: ContenidoBloque, selected: boolean, onSelect: () => void, onSaved: () => void, onDeleted: () => void, onDuplicate: () => void })
  - postcondition (NUEVO): si !selected, renderiza BloqueRenderer(toBloqueContenido(bloque)) de
    solo lectura dentro de la tarjeta del canvas (con el ícono de arrastre y los botones de
    duplicar/eliminar que ya existían en SortableBloqueCard)
  - postcondition (NUEVO): si selected, monta form/liveItems (mismo patrón que PropertiesPanel tenía
    antes de esta spec) y renderiza BloqueRenderer(buildPreviewBloque(bloque, form, liveItems),
    vacioPlaceholder, modoEdicion) más una barra de acciones (Guardar/Cancelar/Duplicar/Eliminar)
  - invariant: nunca hay más de una instancia con form/liveItems montado al mismo tiempo (se
    garantiza por selected derivado de un único selectedId en BloquesSection, igual que hoy)
```

## 4. Data model & flow

**Entidades**

- Ninguna entidad persistida nueva. Igual que en `editor-bloques-vivo`, todo lo nuevo es estado de
  cliente derivado de `ContenidoBloque`/`ContenidoBloqueItem` ya existentes.

**Flujo principal** (`AC2/AC3 — escribir texto y reemplazar imagen directamente en el lienzo`)

1. El instructor hace clic en un bloque de texto-imagen en el lienzo → `BloquesSection` actualiza
   `selectedId` → `LienzoBloqueCard` de ese bloque monta `form` (igual que `PropertiesPanel` hacía) →
   `BloqueRenderer` recibe `buildPreviewBloque(bloque, form, null)` + `modoEdicion`.
2. El instructor hace clic sobre el texto renderizado y escribe → el mecanismo de edición directa
   invoca `modoEdicion.onTextoChange(nuevoTexto)` → `LienzoBloqueCard` hace `setForm(f => ({...f,
   texto: nuevoTexto}))` → en el mismo render, `buildPreviewBloque` recalcula y `BloqueRenderer`
   vuelve a mostrar el texto ya actualizado (sigue siendo el mismo bloque, ya en pantalla — no hay
   "vista previa" separada que sincronizar).
3. El instructor hace clic sobre la imagen → `modoEdicion.onImagenChange({url})` o `({archivo})` →
   `setForm`/`setFile` (mismo mecanismo que `BloqueFormFields` usaba, reubicado).
4. El instructor pulsa "Guardar" (ahora en la barra de acciones del propio `LienzoBloqueCard`) →
   mismo `handleSave`/`updateBloque` que ya existía, sin cambios.

**Flujo secundario** (`AC4/AC5 — agregar un ítem de lista o una fila de tabla en el lienzo`)

1. El instructor hace clic en el punto de acción "agregar ítem" del bloque de lista en el lienzo →
   `modoEdicion.onItemsChange([...items, ""])` → `setForm` actualiza `items` → el nuevo ítem vacío
   aparece ya en el render, listo para que el instructor haga clic y escriba en él (mismo mecanismo
   del flujo principal, paso 2).
2. El instructor hace clic en "quitar" sobre un ítem → `onItemsChange(items.filter(...))` → el
   render pierde ese ítem de inmediato.
3. Equivalente para tabla: "agregar fila" siembra `{ columna1: "", columna2: "" }` (mismo patrón que
   ya usa `bloque-form-fields.tsx` hoy) vía `onFilasChange`.

- Límites de consistencia: igual que `editor-bloques-vivo` — `form`/`liveItems` es estado de un solo
  componente, nunca sincronizado contra el servidor hasta el guardado explícito.
- Impacto de migración: ninguno.

## 5. Testing strategy

| Criterio de aceptación | Nivel | Qué confirma | Qué se simula/omite |
| --- | --- | --- | --- |
| AC1 (render real en el lienzo) | manual en navegador | Cada bloque del lienzo muestra su `BloqueRenderer` real, no `bloquePreview()` | — |
| AC2 (texto en vivo: texto-imagen/texto-elemento-dinamico/callout) | manual, por tipo | Clic en texto + escribir cambia el render sin guardar | — |
| AC3 (imagen/video en vivo) | manual, por tipo | Clic en imagen/video + reemplazar cambia el render sin guardar | — |
| AC4 (lista/pasos: agregar/quitar ítem) | manual | Punto de acción agrega/quita un ítem visible de inmediato | — |
| AC5 (tabla: agregar/editar/quitar fila) | manual | Punto de acción agrega/quita fila; celda editable por clic | — |
| AC6 (callout: variante en vivo) | manual | Control de variante cambia color/ícono de inmediato | — |
| AC7 (panel sin campos de contenido) | manual + `grep` | El panel no monta `BloqueFormFields`/`LiveItemsEditor` para los 7 tipos cubiertos, salvo el toggle de `texto-elemento-dinamico` | — |
| AC8 (guardado explícito sin cambios) | manual + lectura de código | `handleSave`/`updateBloque` no cambiaron de firma ni de comportamiento | — |
| AC9 (tipos fuera de alcance intactos) | manual + diff de código | Tarjetas/paneles/presentaciones siguen con `PropertiesPanel` completo, sin tocar | — |

- No hay línea de e2e automatizada — sin suite de tests (principio 7), todo nivel "integration" de
  esta tabla es manual en navegador contra el backend real de desarrollo.
- Lo que DEBE ser real: el backend de desarrollo sirviendo bloques reales; no hay fixtures locales.

## 6. Sequencing & dependencies

1. Extender `BloqueRenderer` con `modoEdicion` para **callout/alerta** (texto editable + selector de
   variante) — el tipo más simple, prueba el patrón completo de punta a punta antes de replicarlo —
   depende de: ninguno — serial (todo lo demás sigue este patrón).
2. Extender `BloqueRenderer` con `modoEdicion` para **texto-imagen / texto-elemento-dinamico** (texto
   editable + reemplazo de imagen) — depende de: 1 (reusa el mecanismo de texto editable que 1 ya
   probó) — parcialmente paralelizable con 3 una vez que 1 esté verificado.
3. Extender `BloqueRenderer` con `modoEdicion` para **video/texto-video** (reemplazo de video, sin
   texto) — depende de: 1 — paralelizable con 2.
4. Extender `BloqueRenderer` con `modoEdicion` para **lista/pasos** (ítems editables + agregar/quitar)
   — depende de: 1 — paralelizable con 2 y 3 (archivo compartido, pero ramas de dispatch distintas
   dentro del mismo `switch`; serializar si se asigna a un único implementador, paralelizar solo si
   son workers distintos coordinados por `parallel`).
5. Extender `BloqueRenderer` con `modoEdicion` para **tabla** (celdas editables + agregar/quitar fila,
   sembrando `columna1`/`columna2` en filas nuevas) — depende de: 1.
6. Construir `LienzoBloqueCard` (reemplaza el cuerpo de `SortableBloqueCard`; mueve `form`/`liveItems`
   desde `PropertiesPanel`) — depende de: 1-5 (necesita que `BloqueRenderer` ya acepte `modoEdicion`
   para los 7 tipos).
7. Conectar `BloquesSection` para usar `LienzoBloqueCard` en el canvas — depende de: 6.
8. Reducir `PropertiesPanel`: dejar de montar `BloqueFormFields`/`LiveItemsEditor` para los 7 tipos
   cubiertos (solo el toggle de `texto-elemento-dinamico` sobrevive); sin cambios para los tipos
   fuera de alcance — depende de: 7 (el panel solo puede encogerse una vez que el lienzo ya asume la
   edición).
9. Verificación manual de cierre: los 7 tipos + confirmar AC7/AC8/AC9 + plataforma del alumno y
   `PreviewPane` sin cambios — depende de: 1-8, todos.

- Candidatos paralelos: 2, 3 y 4 son extensiones de ramas de `switch` independientes dentro del mismo
  archivo — paralelizables solo si se coordinan vía `parallel` (mismo archivo, sin solape de líneas);
  si un único implementador los hace, van en serie para evitar conflictos de merge triviales.
- Restricción de orden dura: 6-8 no pueden empezar antes de que `BloqueRenderer` acepte
  `modoEdicion` para todos los tipos que `LienzoBloqueCard` necesita mostrar.

## 7. Risks & open decisions

**Risks**

| Risk | Trigger | Impact | Mitigation / spike to retire it |
| --- | --- | --- | --- |
| `BloqueRenderer` crece lo suficiente como para que una rama de `modoEdicion` accidentalmente cambie el render por defecto | Compartir markup entre el camino de solo lectura y el editable dentro de la misma rama de `switch` | Plataforma del alumno o `PreviewPane` muestran algo distinto a como se veían antes de esta spec | Cada rama añade el comportamiento de `modoEdicion` como código adicional condicionado en `if (modoEdicion)`, nunca reemplazando el camino existente — mismo patrón ya probado con `vacioPlaceholder`; `tsc`/`eslint`/revisión manual de plataforma del alumno en cada tarea |
| Edición directa sobre texto (contenteditable o equivalente) pierde el cursor/la posición de escritura en cada re-render | El valor de texto se pasa de vuelta como prop controlada en cada tecla, forzando al navegador a reposicionar el cursor | Experiencia de escritura rota — la queja original que esta spec existe para resolver, reapareciendo de otra forma | El nodo editable debe quedar "no controlado" por React en cuanto a su contenido de texto (el DOM es dueño del texto mientras se escribe; `onTextoChange` sincroniza hacia `form` sin forzar el valor de vuelta en cada tecla) — se verifica manualmente escribiendo rápido y con acentos/ñ en cada tipo con texto editable |
| Tabla vacía sin columnas que derivar (`Object.keys(filas[0])` sobre un array vacío) | Instructor agrega un bloque de tabla nuevo y usa "agregar fila" por primera vez desde el lienzo | La primera fila no tiene columnas visibles, o el agregado falla | Sembrar la primera fila con `{ columna1: "", columna2: "" }` explícitamente (mismo patrón que `bloque-form-fields.tsx` ya usa) — no es un problema nuevo, solo hay que replicarlo en el nuevo punto de entrada |
| El panel de propiedades deja de existir para 6 de los 7 tipos — un instructor acostumbrado a buscarlo ahí no encuentra dónde más configurar algo que en realidad sí movió al lienzo | Hábito previo de `editor-bloques-vivo` (vivió medio día en producción de sesión) | Confusión momentánea, no pérdida de capacidad (todo sigue siendo editable, solo que en otro lugar) | Mitigado por el propio diseño: el punto de acción de cada verbo (agregar ítem, cambiar variante, reemplazar imagen) debe ser visualmente evidente sobre el bloque seleccionado — parte del criterio de aceptación de "punto de acción visible", no un añadido de este plan |

**Open decisions**

- El indicador visual de selección/edición (anillo azul en el bloque + contorno punteado en el campo
  con foco, descrito en §0) es una propuesta escrita de este plan, no un mockup aprobado — igual que
  el layout de `editor-bloques-vivo`, se resuelve así: el usuario aprueba esta descripción al
  aprobar el plan, y el primer pase de `implement` se revisa en navegador antes de darlo por
  cerrado.
- Mecanismo exacto de edición de texto (contenteditable nativo vs. un `textarea`/`span` estilizado
  para parecer el texto renderizado) — no afecta el contrato (`onTextoChange` recibe el string
  final), se decide en `implement` según qué tan bien se comporte cada uno en los tipos con texto
  multilínea (callout) vs. de una sola línea.
- Forma exacta del control de reemplazo de imagen/video en el lienzo (¿popover anclado al elemento?
  ¿overlay con dos botones al pasar el mouse?) — mismo nivel, no afecta el contrato
  (`onImagenChange`/`onVideoChange`), se decide en `implement`.
