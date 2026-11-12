---
type: spec
title: Spec — Lienzo WYSIWYG del constructor de bloques (primer incremento)
description: WHAT and WHY — editar texto/imagen directamente sobre el render real del bloque en el lienzo, sin formulario lateral como lugar principal de escritura.
tags: [sdd, spec]
timestamp: 2026-11-12T00:00:00Z
topic: sdd
slug: lienzo-wysiwyg
status: draft
---

# Spec — Lienzo WYSIWYG del constructor de bloques (primer incremento)

> Slug: `lienzo-wysiwyg` · Status: draft · Created: 2026-11-12
> Inherits: [constitution](../constitution.md)
> Precede a esta spec: [editor-bloques-vivo](./editor-bloques-vivo.md) (implementada y confirmada
> el mismo día) — esta spec la reemplaza en los tipos que cubre, no la extiende.

## Problem & why

El constructor de bloques (vista de instructor) muestra el lienzo como una lista de tarjetas con un
ícono y un fragmento de texto genérico (`bloquePreview()`) — nunca el bloque tal como realmente se
ve. Editar su contenido requiere abrir un panel de propiedades aparte: un formulario con inputs de
texto, y una vista previa del resultado real al lado (recién construida en `editor-bloques-vivo`).
El usuario probó ese patrón y lo rechazó explícitamente: pide que el contenido que se edita sea el
mismo que se renderiza — clic en un título, se escribe ahí mismo; clic en una imagen, se reemplaza
ahí mismo — sin un formulario separado que genere una vista previa aparte.

**Por qué el constructor separaba formulario y render hasta ahora** (lo que esta spec pidió
investigar primero): no fue una limitación de UI arbitraria. Los ítems de bloque
(`ContenidoBloqueItem`, usados por tarjetas/paneles/presentaciones) se guardan uno por uno contra su
propio endpoint en cuanto el instructor confirma esa fila, un ciclo de persistencia totalmente
independiente del guardado del bloque padre (que solo cubre texto/variante/imagen/video planos). Esa
diferencia de ciclos de guardado es real y sigue siendo real en el diseño que propone esta spec — por
eso el alcance se recorta a los tipos que NO tienen ítems propios (ver Non-goals).

## Cost of not building it

El instructor sigue sin poder confiar en lo que ve mientras edita sin, como mínimo, mirar una
columna aparte. Con `editor-bloques-vivo` ya se resolvió el "sin guardar para ver" — lo que queda
sin resolver, y es lo que este brief señala como insuficiente, es que seguir escribiendo en inputs
de formulario en vez de sobre el contenido mismo rompe la relación directa entre "lo que toco" y "lo
que cambia", que es precisamente la experiencia que un constructor de contenido educativo necesita
para que lo usen docentes y diseñadores instruccionales sin fricción, no solo desarrolladores.

## The cheapest alternative

Quedarse con `editor-bloques-vivo` tal como está (formulario + columna de preview en vivo, ya
confirmada en navegador). Resuelve "ver el resultado sin guardar", pero no resuelve lo que el
usuario pidió explícitamente: seguir sin poder "hacer clic en el título y escribir directamente ahí"
no cumple su criterio de aceptación, dicho en sus propias palabras.

## Goals

- El lienzo central muestra cada bloque con su render real (`BloqueRenderer`), no un resumen de
  texto genérico.
- El instructor edita el texto de un bloque haciendo clic directamente sobre el texto renderizado y
  escribiendo ahí — sin abrir un formulario aparte para ese campo.
- El instructor reemplaza la imagen de un bloque haciendo clic sobre la imagen renderizada (o su
  espacio vacío) — sin un input de URL/archivo en un panel aparte para ese campo.
- El panel de propiedades deja de ser el lugar donde se escribe el contenido de estos tipos; solo
  queda para configuración que no tiene una representación visual directa en el lienzo (ver
  Non-goals de `editor-bloques-vivo` §"Qué debe respetar" — aquí se precisa cuáles).
- El contenido guardado sigue siendo exactamente el mismo que usan la plataforma del alumno y la
  pestaña "Vista previa" — ningún dato nuevo, ninguna estructura paralela.

## Non-goals / out of scope

- **Tarjetas, paneles y presentaciones** (`texto-tarjetas`, `texto-paneles`, `texto-presentacion`,
  `texto-presentacion-paneles`) — tienen ítems con su propio ciclo de guardado; quedan para una
  spec siguiente que extienda este mismo patrón de edición directa a esa estructura.
- **Bloques evaluativos** (preguntas/opciones) — ya estaban fuera de alcance de toda esta sesión
  (ver `02-DOCS/wiki/backend-contracts.md`); se mantienen así. Elegido explícitamente por el
  usuario al confirmar esta spec, no una omisión.
- **Nuevos campos o endpoints de backend.** Esta spec reusa el modelo y los endpoints existentes
  (`ContenidoBloque` vía `capacitacionApiSlice.ts`) tal cual. Si en `plan` apareciera una necesidad
  real de backend, se documenta explícitamente como riesgo/decisión abierta — no se inventa.
- **Guardar solo una representación final (HTML/visual) que no se pueda volver a editar como
  estructura.** El modelo editable (`ContenidoBloque` con sus campos tipados) sigue siendo la única
  fuente de verdad; el lienzo es una forma de editarlo, no un reemplazo de su estructura.
- **Reordenar/duplicar/eliminar bloques** — ya existen (drag-and-drop, botones en la tarjeta del
  canvas) y no cambian en esta spec; seguirán funcionando sobre el lienzo ya convertido a render
  real.
- **Formato de texto enriquecido** (negritas, enlaces, etc.) dentro de la edición inline — el brief
  menciona "formato básico cuando esté permitido" pero ningún tipo de bloque actual declara un campo
  de formato; se deja fuera hasta que un tipo de bloque real lo necesite.
- **Rediseñar la biblioteca de tipos de bloque** — se mantiene igual, solo cambia qué pasa después
  de insertar un bloque (aparece ya editable en el lienzo, no abre un formulario).

## Users & context

El instructor o diseñador instruccional armando el contenido de un tema, igual que en
`editor-bloques-vivo` — el mismo actor, una forma de edición distinta.

## What the user can do

Cualquier usuario con acceso al editor de un tema (mismo nivel de acceso que hoy) puede, para los
tipos de bloque cubiertos por esta spec:
- Insertar un bloque desde la biblioteca y verlo aparecer en el lienzo ya con su render real
  (vacío, con el estado vacío que ya existe desde `editor-bloques-vivo`).
- Hacer clic sobre el texto de un bloque en el lienzo y escribir directamente ahí.
- Hacer clic sobre la imagen (o su espacio vacío) de un bloque en el lienzo para agregarla,
  reemplazarla o quitarla.
- Guardar los cambios explícitamente (el botón de guardar sigue existiendo; "en vivo" significa que
  el lienzo refleja el cambio antes de guardar, no que cada tecla se persista sola — igual que
  `editor-bloques-vivo` ya estableció para el panel).

## What result they get

Referencia aprobada: el propio criterio de aceptación que el usuario escribió en su brief, tomado
tal cual como la referencia a cumplir (no una captura, pero sí texto explícito que el usuario
redactó y que por tanto cuenta como aprobado para esta spec):

> "Selecciono una tarjeta → aparece en el lienzo → hago clic en su título → escribo directamente →
> hago clic en su imagen → la reemplazo → agrego otra tarjeta → guardo → el alumno visualiza ese
> mismo contenido."

Acotado al alcance de esta spec (sin tarjetas, ver Non-goals), el resultado equivalente es: el
instructor abre un tema, inserta un bloque de texto-imagen desde la biblioteca, lo ve aparecer en el
lienzo con su render real, hace clic en el texto y escribe, hace clic en la imagen y la reemplaza,
pulsa guardar, y el alumno ve exactamente ese contenido al visitar el tema.

## What it must respect

- Principio 19 de la constitución: un solo `BloqueRenderer`, extensible (ya lo es, vía
  `vacioPlaceholder`) pero nunca duplicado en un renderer paralelo de edición.
- Principio 13a: el agente nunca comitea.
- Principio 7: sin suite de tests; verificación vía `tsc`/`eslint`/`build` + navegador manual (el
  usuario ya demostró que prueba en navegador con detalle real).
- El ciclo de guardado existente para campos planos (`handleSave`/`updateBloque`) no cambia de
  backend ni de forma — lo que cambia es dónde y cómo el instructor dispara la edición que termina
  en ese mismo guardado.
- Lo que ya construyó e implementó `editor-bloques-vivo` (`buildPreviewBloque`, el estado `form` en
  vivo, el flag `vacioPlaceholder` de `BloqueRenderer`) es la base técnica a reusar, no a descartar
  — esta spec cambia la superficie de entrada (de inputs de formulario a edición directa sobre el
  render), no el modelo de estado que ya prueba funcionar.
- No debe cambiar el contenido ni el render que ve la plataforma del alumno ni la pestaña "Vista
  previa" — ambas siguen usando `BloqueRenderer` sin ningún modo de edición.

## How it proves it

Para cada tipo cubierto (texto-imagen, texto-elemento-dinamico, lista, pasos, callout/alerta en sus
4 variantes, tabla, video/texto-video), un instructor: inserta un bloque nuevo desde la biblioteca,
confirma que aparece en el lienzo con su render real (no un resumen de texto), edita su texto
haciendo clic directamente sobre él, reemplaza o agrega una imagen/video haciendo clic sobre el
elemento correspondiente, guarda, y confirma que la plataforma del alumno muestra exactamente ese
contenido. La evidencia que queda es la lista de tipos probados y el resultado observado por tipo,
ya que no hay suite automatizada que lo capture.

## Behaviour

- **Camino principal**: el instructor inserta un bloque de texto-imagen desde la biblioteca → el
  lienzo muestra su render real (vacío) → clic sobre el área de texto → escribe → clic sobre el
  área de imagen → la agrega/reemplaza → pulsa guardar → el bloque queda persistido con esos
  valores.
- **Borde — bloque recién insertado (todos los campos vacíos)**: el lienzo muestra el estado vacío
  ya existente (`vacioPlaceholder`), y ese estado vacío es también el punto donde se puede hacer
  clic para empezar a escribir/agregar imagen — no hace falta un paso intermedio para "activar" la
  edición antes de que aparezca algo que editar.
- **Borde — varios bloques en el lienzo a la vez**: editar uno no afecta el estado en edición de
  los demás; cada bloque mantiene su propio contenido en vivo independientemente.
- **Borde — cambiar de bloque sin guardar**: si el instructor edita un bloque y selecciona otro
  antes de guardar, el comportamiento sigue el mismo que ya estableció `editor-bloques-vivo` para
  cambios no guardados (se pierden al deseleccionar, consistente con cómo ya funciona hoy el `form`
  local del panel) — esta spec no introduce un mecanismo de autoguardado nuevo.
- **Error — tipo de bloque sin contenido editable inline definido** (fuera del alcance de esta
  spec, ej. tarjetas): sigue usando el patrón de `editor-bloques-vivo` (formulario + preview) hasta
  que una spec futura lo extienda.

## Acceptance criteria

- Given el lienzo de un tema con bloques existentes, When el instructor lo abre, Then cada bloque
  cubierto por esta spec se muestra con su render real (`BloqueRenderer`), no con un resumen de
  texto genérico.
- Given un bloque de tipo texto-imagen (o texto-elemento-dinamico/lista/pasos/callout/tabla/video)
  en el lienzo, When el instructor hace clic sobre su texto y escribe, Then el texto cambia
  directamente en el lienzo, sin abrir ningún formulario o panel aparte para ese campo.
- Given un bloque de tipo texto-imagen (o texto-elemento-dinamico) en el lienzo, When el instructor
  hace clic sobre su imagen (o su espacio vacío) y la agrega/reemplaza, Then la imagen cambia
  directamente en el lienzo, sin un input de URL/archivo en un panel aparte.
- Given cambios hechos directamente en el lienzo sin guardar, When el instructor pulsa guardar,
  Then esos cambios se persisten con el mismo mecanismo de guardado que ya existe
  (`updateBloque`), y la plataforma del alumno muestra ese mismo contenido al visitarlo.
- Given un bloque fuera del alcance de esta spec (tarjetas/paneles/presentaciones/evaluativos),
  When el instructor lo selecciona, Then sigue usando el patrón de formulario + preview de
  `editor-bloques-vivo`, sin romperse ni mezclarse con el patrón nuevo.

## Points to clarify

- **decisión diferida** — extender este mismo patrón de edición directa a tarjetas, paneles y
  presentaciones queda fuera de este ciclo a propósito; es la siguiente spec incremental, no una
  ampliación de esta. El usuario lo eligió explícitamente al responder "incremental" sobre "todo de
  una vez".
- **decisión diferida** — bloques evaluativos (preguntas/opciones) quedan fuera, manteniendo la
  decisión ya tomada antes en esta sesión. El usuario lo confirmó explícitamente al preguntársele
  directamente.
- **suposición tomada** — "escribir directamente" significa edición en el DOM del render real
  (similar a `contenteditable`), no un input flotante superpuesto visualmente sobre el mismo lugar.
  *Base:* el criterio de aceptación del propio usuario ("hago clic en su título → escribo
  directamente") describe manipulación directa, no un control flotante. *Riesgo:* si `plan`
  encuentra que el mecanismo exacto (contenteditable vs. input superpuesto con el mismo estilo)
  importa para algún tipo en particular, lo decide ahí — el contrato de esta spec es el resultado
  observable ("escribo y cambia ahí mismo"), no el mecanismo.
- **suposición tomada** — el guardado sigue siendo una acción explícita del instructor (un botón),
  no un autoguardado por tecla o al perder el foco. *Base:* el propio criterio de aceptación del
  usuario incluye un paso explícito "guardo" separado de "escribo"/"reemplazo". *Riesgo:* si el
  usuario en realidad esperaba autoguardado implícito, el criterio de aceptación de esta spec
  tendría que ampliarse — pero su propio texto lo contradice, así que se toma como la lectura
  correcta.
- **área no formulable** — cómo se ve exactamente la transición visual entre "bloque seleccionado,
  no editando" y "editando directamente" (¿aparece algún borde, ícono, cursor?) no está
  resuelta ni es formulable sin una referencia visual — se deja para que `plan` proponga algo
  concreto, igual que se hizo con el layout de `editor-bloques-vivo`.
