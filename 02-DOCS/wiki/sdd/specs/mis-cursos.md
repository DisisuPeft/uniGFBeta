---
type: spec
title: Spec — Mis cursos (endurecimiento)
description: WHAT and WHY — separar Mis cursos de Explorar, usar la inscripción más reciente en todas las vistas, retirar paginación decorativa y portada inventada.
tags: [sdd, spec]
timestamp: 2026-11-11T00:00:00Z
topic: sdd
slug: mis-cursos
status: clarified
---

# Spec — Mis cursos (endurecimiento)

> Slug: `mis-cursos` · Status: clarified · Created: 2026-11-11 · Approved: 2026-11-11 ("apruebo")
> Inherits: [constitution](../constitution.md)

## Problem & why

"Mis cursos" y "Explorar" ya existen y funcionan contra endpoints reales, pero la auditoría de
esta sesión encontró 4 defectos concretos: un control de paginación que no pagina nada real, una
petición de red cuyo resultado nunca se usa, una portada de curso inventada por coincidencia de
texto en el título cuando el backend no manda imagen, y — el más serio — dos vistas que derivan
"la" inscripción de un curso tomando la primera de una lista cruda en vez de la más reciente,
arriesgando mostrar el estado de una inscripción vieja cuando el colaborador se reinscribió.

## Cost of not building it

El footer de paginación sigue mintiendo visualmente en ambas vistas. La petición muerta sigue
gastando una llamada HTTP en cada carga del dashboard sin aportar nada. La portada por título
("analista" → imagen fija) sigue mostrando datos inventados en vez de reales. Y, lo más caro: si
un colaborador se reinscribe a un curso que ya completó antes, el dashboard y el resumen del
curso pueden mostrarle el estado de la inscripción vieja — un error de acreditación visible,
exactamente en el área que la constitución protege más (principio 16). Nadie lo ha reportado
porque nadie se ha reinscrito todavía bajo observación — eso no es evidencia de que no pase.

## The cheapest alternative

Arreglar solo lo visible (la paginación decorativa) y dejar el resto como deuda conocida. No es
más barata en realidad: el bug de inscripción duplicada es silencioso y de mayor severidad que
cualquiera de los otros tres, así que posponerlo no ahorra esfuerzo, solo difiere el riesgo más
caro a un momento en que ya habrá colaboradores reinscritos viendo el dato equivocado.

## Goals

- El colaborador ve en "Mis cursos" únicamente los cursos en los que está inscrito o que
  completó, con su progreso real y vigente.
- El colaborador ve en "Explorar" el catálogo completo de cursos disponibles para inscribirse,
  sin mezclarlo con su propio estado de inscripción.
- Cuando un colaborador tiene más de una inscripción histórica al mismo curso, toda vista que
  derive su estado desde la lista cruda de inscripciones usa siempre la más reciente.
- La portada de cada curso muestra la imagen real del curso cuando el backend la da, y un
  marcador gráfico genérico y consistente cuando no — nunca una imagen de otro curso.
- Ninguna lista de curso/inscripción usada como contenido (no como tabla administrativa) muestra
  un control de paginación que no pagina datos reales.

## Non-goals / out of scope

- No se construye el reproductor de aprendizaje ni los bloques evaluativos (`opcion-multiple`,
  `verdadero-falso`, `archivos`, `mis-respuestas-bloque`) — eso es otra spec; ver
  `02-DOCS/wiki/backend-contracts.md`.
- No se resuelve el desajuste de URL `/competencias/mi-perfil/` vs
  `/competencias/mi-perfil-competencias/` — queda como punto a clarificar.
- No se agrega paginación real (server-side o infinite scroll) a estas listas — se retira la
  decorativa, no se construye una nueva.
- No se toca el reproductor de curso individual (progreso de módulos/temas, navegación) más allá
  del fix puntual de "cuál inscripción es la vigente" — el resto de esa vista es otra spec.
- No se rediseña visualmente la tarjeta de curso más allá de la portada — layout, badges de
  competencias y textos existentes se conservan tal cual.
- No se introduce un sistema de assets/CDN nuevo — solo se usa `curso.imagen` si el backend la
  entrega.
- No se agrega ninguna señal visual nueva de "recursamiento" (badge, aviso, historial) en la
  tarjeta de curso — resuelto en `## Clarifications`.

## Users & context

Colaborador autenticado de Grupo Farrera, en escritorio o móvil, que quiere: continuar un curso
donde se quedó, descubrir qué cursos nuevos puede tomar, o confirmar qué ya completó para su
propia acreditación.

## What the user can do

Un colaborador autenticado puede: ver su lista de cursos con inscripción (activa o completada)
y su progreso vigente en "Mis cursos"; ver el catálogo completo de cursos disponibles e
inscribirse a cualquiera sin una inscripción activa en "Explorar"; desde cualquiera de las dos
vistas, continuar un curso en progreso o revisar uno completado.

## What result they get

- "Mis cursos" muestra solo cursos con inscripción del colaborador (activa o completada) —
  visualmente igual al subconjunto que ya se ve hoy filtrado, sin el footer de paginación
  decorativo y con la portada corregida.
- "Explorar" muestra el catálogo completo, visualmente igual a hoy, sin el footer de paginación
  decorativo ni la petición muerta.
- Un colaborador con 2+ inscripciones históricas al mismo curso ve, en ambas vistas y en el
  resumen de curso individual, el estado y fecha de su inscripción más reciente — nunca el de
  una anterior.

No hay una captura aprobada por el usuario para este cambio (es un ajuste sobre una UI ya
existente y visible, no una pantalla nueva) — **review-after**: el usuario confirma
visualmente en navegador después de implementar, registrado en la cola de decisiones de
`implement` en vez de aprobarse por adelantado.

## What it must respect

- Constitución v1.0.0, principio 16: el backend es la única fuente de verdad de
  progreso/acreditación — `curso.inscrito`/`curso.progreso` de `/capacitacion/ver/cursos/` ya
  vienen resueltos por el backend sobre la inscripción más reciente; no se re-derivan en cliente.
- Constitución v1.0.0, principio 10: una lista de contenido completo sin paginación real en UI
  usa `?pagination=false` y tipo de respuesta array.
- Constitución v1.0.0, principio 20: no se inventan datos — la portada de curso solo usa
  `curso.imagen` si el backend la entrega.
- El contrato ya confirmado en `02-DOCS/wiki/backend-contracts.md` (sección "Inscripción
  recency"): `inscrito_at` descendente con `id` como desempate, al derivar "la" inscripción desde
  la lista cruda de `/capacitacion/mis-inscripciones/` — donde el backend no lo resuelve ya.

## How it proves it

No hay suite de tests automatizada (constitución, principio 7). La evidencia es:
`tsc --noEmit`, `eslint` y `pnpm run build` limpios, más una sesión de navegador real que
confirme: (a) "Mis cursos" solo lista inscritos/completados; (b) "Explorar" lista el catálogo
completo y permite inscribirse; (c) ninguna de las dos muestra el footer de paginación fake;
(d) un curso sin `imagen` del backend muestra el marcador genérico, no una imagen de otro curso
por coincidencia de título; (e) por inspección de código (o un colaborador de prueba con 2+
inscripciones si el entorno de pruebas lo permite), las 3 vistas tocadas muestran el estado de
la inscripción activa, no de una anterior.

## Behaviour

- Main: colaborador abre "Mis cursos" → ve tarjetas de sus cursos inscritos/completados con
  progreso correcto; abre "Explorar" → ve el catálogo completo; se inscribe desde Explorar → el
  curso aparece en "Mis cursos" en su próxima visita.
- Edge: colaborador sin ninguna inscripción ve "Mis cursos" vacío con un mensaje claro, no un
  error; colaborador con 2+ inscripciones al mismo curso (una vieja completada, una nueva activa)
  ve el estado de la activa en las 3 vistas tocadas; curso sin imagen asignada muestra el
  marcador genérico.
- Error: un fallo de red al inscribirse muestra un error claro sin dejar el botón en estado de
  carga indefinido (comportamiento ya existente, se conserva).

## Acceptance criteria

- Given un colaborador con 1 inscripción activa y 2 completadas a cursos distintos, When abre
  "Mis cursos", Then ve exactamente esas 3 tarjetas con estado/progreso correcto y ningún curso
  sin inscripción.
- Given el mismo colaborador, When abre "Explorar", Then ve el catálogo completo (incluidos los
  3 ya inscritos) y puede inscribirse a cualquier curso sin inscripción activa.
- Given un colaborador con 2 inscripciones históricas al mismo curso (una completada, una activa
  más reciente), When abre "Mis cursos", "Explorar" o el resumen de ese curso individual, Then
  el estado/fecha mostrado corresponde siempre a la inscripción activa más reciente.
- Given cualquiera de las dos vistas, When se renderiza, Then no aparece ningún control de
  paginación que no pagine datos reales.
- Given un curso sin `imagen` asignada por el backend, When se muestra su tarjeta, Then la
  portada es un marcador gráfico genérico y consistente, nunca una imagen de otro curso elegida
  por coincidencia de texto en el título.

## Points to clarify

- **pregunta abierta** — ¿cuál es la URL real del endpoint de perfil de competencias:
  `/competencias/mi-perfil/` (lo que usa el código hoy) o `/competencias/mi-perfil-competencias/`
  (lo que nombró backend)? Sigue sin resolverse — el backend no estaba disponible para verificar
  en vivo durante `clarify` (confirmado: `curl` a ambas rutas no conectó). No cambia lo que esta
  spec construye (ninguna de sus 5 criterios de aceptación toca ese endpoint), así que se deja
  tal cual: deferida explícitamente a la próxima spec que dependa de rutas recomendadas.
- **suposición tomada** — "Mis cursos" lista únicamente inscritos+completados (vía
  `getMisCursos`), "Explorar" conserva el catálogo completo. *Base:* validado en `clarify` contra
  `02-DOCS/wiki/sdd/decisions.md` (entrada 2026-11-11, misma decisión ya registrada) y sin
  contradicción con la constitución — **se sostiene**. *Riesgo:* podría esconder una ruta de
  descubrimiento si "Mis cursos" se usaba también para eso; mitigado porque "Explorar" ya cubre
  ese flujo.
- **suposición tomada** — desempate "más reciente" = `inscrito_at` descendente, `id` como
  desempate. *Base:* validado en `clarify` contra `02-DOCS/wiki/backend-contracts.md` (sección
  "Inscripción recency"), que cita la fuente exacta del backend (`_inscripcion_reciente`,
  `recorrido-formativo-periodos-acreditacion.md` Clarification #5-7) — **se sostiene, contrato
  cerrado, no provisional**. *Riesgo:* ninguno.
- **decisión diferida** — agregar paginación real (server-side o infinite scroll) a "Explorar" si
  el catálogo de cursos crece mucho. Se deja sin tocar, como estaba.
- **área no formulable** — qué debe comunicar visualmente "Mis cursos" ante un recursamiento.
  **Graduada en `clarify`** a una pregunta formulable (¿se agrega una señal nueva de
  "recursamiento", o la tarjeta solo refleja el estado de la inscripción activa sin indicarlo?) y
  resuelta sin necesidad de preguntar: la spec ya cerraba esto en *Non-goals* ("no se rediseña
  visualmente la tarjeta más allá de la portada") — agregar una señal nueva lo contradiría.
  Resuelto: no se agrega ninguna señal nueva; movido a *Non-goals* arriba.

## Clarifications

- 2026-11-11 — **Q:** ¿la URL de perfil de competencias cambia algo de esta spec? **Decisión:**
  no; se deja como pregunta abierta para la próxima spec, no bloquea `mis-cursos`. **Por qué:**
  ninguno de los 5 criterios de aceptación de esta spec depende de ese endpoint; el backend no
  estaba disponible para verificar en vivo.
- 2026-11-11 — **Q:** ¿sigue sosteniéndose separar Mis cursos/Explorar por endpoint? **Decisión:**
  sí, sin cambios. **Por qué:** coincide con la decisión ya registrada en `decisions.md` el mismo
  día; no hay evidencia nueva que la contradiga.
- 2026-11-11 — **Q:** ¿sigue sosteniéndose el criterio `inscrito_at` desc + `id` como desempate?
  **Decisión:** sí, confirmado como contrato cerrado (no provisional). **Por qué:**
  `02-DOCS/wiki/backend-contracts.md` cita la fuente backend exacta y una spec de su lado con
  tests propios.
- 2026-11-11 — **Q:** ¿la tarjeta de curso necesita una señal visual de recursamiento? **Decisión:**
  no — se agrega a *Non-goals*. **Por qué:** la spec ya excluía el rediseño visual de la tarjeta
  más allá de la portada; una señal nueva lo contradiría.
