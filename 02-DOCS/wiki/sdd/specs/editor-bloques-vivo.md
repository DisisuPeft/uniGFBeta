---
type: spec
title: Spec — Vista previa en vivo del editor de bloques
description: WHAT and WHY — mostrar el bloque seleccionado renderizado en vivo junto a su formulario de edición, sin guardar ni cambiar de pestaña.
tags: [sdd, spec]
timestamp: 2026-11-12T00:00:00Z
topic: sdd
slug: editor-bloques-vivo
status: draft
---

# Spec — Vista previa en vivo del editor de bloques

> Slug: `editor-bloques-vivo` · Status: draft · Created: 2026-11-12
> Inherits: [constitution](../constitution.md)

## Problem & why

El editor de bloques de contenido (vista de instructor, dentro del curso → tema → "Bloques de
contenido") separa la edición de la visualización en dos pestañas distintas: "Editor" muestra una
lista de tarjetas con un resumen de texto genérico, sin el contenido real renderizado; "Vista
previa" muestra el resultado real pero de solo lectura, sobre los bloques ya guardados, en una
pestaña aparte. Para saber si un cambio quedó bien, el instructor tiene que guardar, cambiar de
pestaña, mirar, y si algo no cuadra, volver a "Editor" y repetir. El usuario lo describió
directamente al probarlo: esperaba algo interactivo, donde elegir un bloque y ver su resultado
real al mismo tiempo que lo edita.

## Cost of not building it

El instructor sigue editando a ciegas. Cada ajuste de un campo (texto, imagen, items, paneles)
requiere guardar y cambiar de pestaña para confirmar que se ve bien, y si no es así, hay que volver
a editar y repetir el ciclo. Con los 10 tipos de bloque que ya soporta el editor (incluyendo
varios con estructuras visuales no triviales: paneles, tarjetas, presentaciones), ese ciclo de
prueba y error es precisamente donde más tiempo se pierde armando un tema. El costo no es que algo
se rompa — es la fricción y el tiempo de cada sesión de edición de contenido.

## The cheapest alternative

Nada: seguir usando la pestaña "Vista previa" como está, cambiando de pestaña después de guardar
cada bloque. Resuelve el caso de "verificar el tema completo" pero no el de "ver si este campo que
acabo de tocar se ve bien" — que es el ciclo que el instructor repite más seguido, y el que generó
la queja.

## Goals

- Al seleccionar un bloque en el canvas para editarlo, el instructor ve su resultado renderizado
  real, no un resumen de texto.
- Ese resultado renderizado se actualiza mientras edita el formulario — antes de guardar, no
  después.
- El renderizado en vivo usa exactamente el mismo renderer que ya usan la vista previa existente y
  la plataforma del alumno (ningún renderer nuevo ni duplicado).

## Non-goals / out of scope

- Rediseñar el canvas de bloques (la lista ordenable, el drag-and-drop, la biblioteca) — se queda
  igual.
- Eliminar o modificar la pestaña "Vista previa" existente (documento completo, solo lectura) — se
  queda como está, es complementaria.
- Un modo "tablero único" que reemplace la pestaña Editor por el documento completo en vivo —
  evaluado y descartado para este ciclo (ver Points to clarify).
- Previsualizar archivos recién subidos (imagen/video) que aún no tienen URL del backend — el
  instructor sigue viendo el archivo anterior (o nada) hasta guardar, igual que hoy.
- Cualquier cambio a los tipos de bloque existentes, su validación, o los campos del formulario.

## Users & context

El instructor o diseñador instruccional que arma el contenido de un tema dentro del curso,
agregando y ajustando bloques uno por uno desde el panel de propiedades.

## What the user can do

Cualquier usuario con acceso al editor de un tema (ya autorizado hoy para crear/editar bloques)
puede seleccionar un bloque existente del canvas y, mientras lo edita en el panel de propiedades,
ver su vista previa en vivo sin guardar. No requiere ningún permiso nuevo ni condición de arranque
adicional a las que ya exige el editor actual.

## What result they get

Al abrir un bloque para editar, el panel de propiedades muestra el formulario y, junto a él (en
pantallas anchas) o apilado debajo (en móvil), el bloque renderizado tal como se vería en la
plataforma — reflejando los valores actuales del formulario, no los últimos guardados. Si el
formulario está vacío o el bloque no tiene contenido mostrable todavía, la vista previa muestra un
estado vacío reconocible (no un error, no un hueco en blanco sin explicación).

> Referencia visual: no hay mockup aprobado para el layout exacto del panel ensanchado. `plan`
> debe proponer una disposición concreta (formulario/preview lado a lado en escritorio, apilados en
> móvil) y este spec se actualiza con una captura aprobada antes de que `implement` la construya —
> ver Points to clarify.

## What it must respect

- Principio 19 de la constitución: `BloqueRenderer` (`app/components/plataforma/bloque-renderer.tsx`)
  es la única implementación de render reutilizable del proyecto. La vista previa en vivo debe
  reusarlo tal cual — nunca duplicar su lógica de dispatch por `tipo_codigo`.
- Principio 13a: el agente nunca ejecuta `git commit`/`add`/`push`; el humano comitea cuando
  decida.
- Principio 7: no hay suite de tests. La verificación se apoya en `tsc`/`eslint`/`build` + revisión
  manual en navegador.
- El comportamiento de guardado existente (`handleSave`, `updateBloque`) no cambia — la vista
  previa en vivo es puramente de lectura sobre el estado del formulario, no afecta cuándo ni cómo
  se persiste.
- La pestaña "Vista previa" existente (`PreviewPane`, documento completo de solo lectura) sigue
  funcionando exactamente igual que hoy.

## How it proves it

Para cada bloque ya auditado y corregido en esta sesión (texto-imagen, texto-elemento-dinamico,
lista, pasos, callout/alerta en sus 4 variantes, texto-paneles, texto-presentacion,
texto-presentacion-paneles, texto-tarjetas, tabla, video/texto-video), un instructor abre el bloque
en el panel de propiedades, cambia un campo relevante de ese tipo (texto, item, fila, URL de
imagen/video, variante) y confirma visualmente que la vista previa cambia para reflejarlo, sin
haber guardado. La evidencia que queda es la lista de tipos probados y el resultado observado por
tipo, ya que no hay suite automatizada que lo capture.

## Behaviour

- **Camino principal**: el instructor hace clic en un bloque del canvas → el panel de propiedades
  abre con el formulario y la vista previa en vivo del bloque tal como está guardado → edita un
  campo → la vista previa se actualiza para reflejar el nuevo valor, sin guardar.
- **Borde — bloque recién creado desde la biblioteca**: un bloque nuevo arranca con campos vacíos;
  la vista previa muestra el estado vacío de ese tipo (ej. ningún párrafo ni imagen), no un bloque
  roto o un hueco sin explicación.
- **Borde — tipos con contenido por fuera del formulario simple** (paneles, presentación, tarjetas,
  cuyos ítems se gestionan aparte vía `LiveItemsEditor`): la vista previa en vivo también refleja
  cambios en esos ítems mientras se editan, consistente con el resto del contenido del bloque.
- **Borde — pantalla angosta**: en móvil, formulario y vista previa se apilan en el mismo panel
  (Sheet) en vez de mostrarse lado a lado; el instructor puede desplazarse entre ambos sin perder
  el estado del formulario.
- **Error — tipo de bloque desconocido o sin render definido**: la vista previa usa el mismo
  comportamiento de fallback que ya tiene `BloqueRenderer` hoy (párrafo de texto plano); no se
  introduce un nuevo estado de error.

## Acceptance criteria

- Given un bloque existente seleccionado en el canvas, When el instructor abre su panel de
  propiedades, Then ve el formulario y, junto a él, el bloque renderizado con su contenido actual
  (no un resumen de texto).
- Given el panel de propiedades abierto para un bloque de tipo `texto-imagen`, When el instructor
  modifica el campo de texto, Then la vista previa muestra el nuevo texto sin que se haya guardado
  el bloque.
- Given el panel de propiedades abierto para un bloque de tipo `texto-paneles` (o
  `texto-presentacion`/`texto-presentacion-paneles`/`texto-tarjetas`), When el instructor agrega o
  edita un ítem mediante `LiveItemsEditor`, Then la vista previa refleja ese ítem sin guardar.
- Given un bloque recién creado desde la biblioteca (todos los campos vacíos), When el instructor
  abre su panel de propiedades antes de escribir nada, Then la vista previa muestra un estado vacío
  reconocible, no un error ni un espacio en blanco sin explicación.
- Given la pantalla en un viewport móvil, When el instructor abre el panel de propiedades de un
  bloque, Then formulario y vista previa aparecen apilados dentro del mismo panel, ambos
  utilizables con scroll.
- Given la pestaña "Vista previa" del tema completo, When el instructor la abre después de este
  cambio, Then se comporta exactamente igual que antes (documento completo, solo lectura, sin
  relación con el formulario en edición).

## Points to clarify

- **decisión diferida** — el modo "tablero único" (opción 3 evaluada: reemplazar toda la pestaña
  Editor por el documento completo en vivo, con selección in situ) queda fuera de este ciclo a
  propósito. El usuario eligió la opción acotada (vista previa embebida junto al formulario) sobre
  esta. Si la opción acotada resulta insuficiente, esto se revisita como una spec nueva, no como
  una ampliación de esta.
- **suposición tomada** — la actualización de la vista previa en vivo es inmediata (cada
  pulsación), no con un retraso perceptible (debounce). *Base:* es el comportamiento que el usuario
  describió ("tiempo real") y el que ofrecen las referencias que mencionó (Notion/Canva). *Riesgo:*
  si algún tipo de bloque resulta costoso de re-renderizar en cada tecla (ninguno de los actuales
  lo es — son todos renders síncronos simples), `plan` puede introducir un debounce corto sin que
  esto contradiga el criterio de aceptación, que no fija un número de milisegundos.
- **suposición tomada** — un archivo de imagen/video recién seleccionado (aún no subido) no se
  previsualiza en la vista previa en vivo; esta sigue mostrando la URL ya guardada (o vacío) hasta
  que el instructor guarda. *Base:* está explícitamente en Non-goals; generar una vista previa de
  un archivo local añade una ruta técnica (object URL, limpieza de memoria) que no pidió el
  usuario. *Riesgo:* si en la práctica resulta confuso ver la vista previa "no reaccionar" al
  elegir un archivo, es una mejora de alcance pequeño para una spec futura, no bloquea esta.
- **pregunta abierta** — no hay una referencia visual (mockup o captura) aprobada para cómo se ve
  el panel ensanchado en escritorio (proporción formulario/preview, si la preview va a la derecha o
  debajo, ancho exacto). Queda explícitamente señalado en "What result they get": `plan` propone una
  disposición concreta y se aprueba antes de construirla, en vez de que el agente la invente sin
  referencia.

## Clarifications

_(se completa en la fase `clarify`)_
