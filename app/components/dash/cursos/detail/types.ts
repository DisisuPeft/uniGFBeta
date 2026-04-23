export interface Tema {
  id: number;
  titulo: string;
  tipo: "lectura" | "video" | "actividad";
  duracion: string;
}

export interface ModuloCapacitacion {
  id: number;
  titulo: string;
  descripcion: string;
  temas: Tema[];
  tieneEvaluacion: boolean;
}

export interface Pregunta {
  id: number;
  texto: string;
  opciones: string[];
  correcta: number;
}

export const MODULOS_MOCK: ModuloCapacitacion[] = [
  {
    id: 1,
    titulo: "Antecedentes del Proyecto de Ventas Digitales",
    descripcion:
      "Historia, contexto y justificación del BDC en Grupo Farrera. Conoce cómo nació el proyecto en 2018 y el impacto que tuvo la pandemia en la consolidación de la venta digital.",
    temas: [
      { id: 1, titulo: "¿De dónde viene el proyecto?", tipo: "lectura", duracion: "10 min" },
      { id: 2, titulo: "Línea de tiempo del BDC en Grupo Farrera", tipo: "lectura", duracion: "8 min" },
      { id: 3, titulo: "Impacto de la pandemia en las ventas digitales", tipo: "lectura", duracion: "7 min" },
    ],
    tieneEvaluacion: true,
  },
  {
    id: 2,
    titulo: "Métricas e Indicadores Clave (KPIs)",
    descripcion:
      "Participación, conversión y cómo calcular objetivos. Aprende a medir el desempeño del BDC sin esperar al cierre de mes.",
    temas: [
      { id: 4, titulo: "¿Qué es un KPI?", tipo: "lectura", duracion: "5 min" },
      { id: 5, titulo: "KPI #1 — Participación Digital", tipo: "lectura", duracion: "10 min" },
      { id: 6, titulo: "KPI #2 — Conversión (Aprovechamiento)", tipo: "lectura", duracion: "10 min" },
      { id: 7, titulo: "Supervisión y Mystery Shopper", tipo: "lectura", duracion: "8 min" },
    ],
    tieneEvaluacion: true,
  },
  {
    id: 3,
    titulo: "El Funnel de Ventas Digital",
    descripcion:
      "Estructura, porcentajes y objetivos por etapa. Entiende el recorrido de un lead desde que entra hasta que se convierte en venta.",
    temas: [
      { id: 8, titulo: "¿Qué es el funnel de ventas?", tipo: "lectura", duracion: "8 min" },
      { id: 9, titulo: "Etapas del funnel digital y porcentajes de conversión", tipo: "lectura", duracion: "10 min" },
      { id: 10, titulo: "Pulverización de objetivos por día", tipo: "actividad", duracion: "10 min" },
      { id: 11, titulo: "Responsables por etapa del funnel", tipo: "lectura", duracion: "5 min" },
    ],
    tieneEvaluacion: false,
  },
  {
    id: 4,
    titulo: "Atracción Digital y Fuentes de Leads",
    descripcion:
      "Clasificación, objetivos mínimos y cómo identificar cada fuente. Conoce qué cuenta como venta digital y cuáles son las fuentes prioritarias.",
    temas: [
      { id: 12, titulo: "¿Qué es una atracción digital?", tipo: "lectura", duracion: "5 min" },
      { id: 13, titulo: "Fuentes de leads y objetivos mínimos mensuales", tipo: "lectura", duracion: "12 min" },
      { id: 14, titulo: "Tipos de sitio web: marca, local y Grupo Farrera", tipo: "lectura", duracion: "8 min" },
      { id: 15, titulo: "Farrera Premium y chat en línea", tipo: "lectura", duracion: "7 min" },
    ],
    tieneEvaluacion: false,
  },
  {
    id: 5,
    titulo: "Estrategias de Publicidad Digital",
    descripcion:
      "Google Ads, Meta Ads y cómo incentivar cada fuente. Aprende los tipos de campaña y cuáles generan mejor calidad de leads.",
    temas: [
      { id: 16, titulo: "Google Ads — Tipos de campaña (Search, Display, Remarketing, Pmax)", tipo: "lectura", duracion: "12 min" },
      { id: 17, titulo: "Meta Ads — Campañas en Facebook e Instagram", tipo: "lectura", duracion: "10 min" },
      { id: 18, titulo: "Qué actividades NO cuentan como atracción digital", tipo: "lectura", duracion: "5 min" },
    ],
    tieneEvaluacion: false,
  },
  {
    id: 6,
    titulo: "Estructuras de Trabajo y Roles del BDC",
    descripcion:
      "Cómo se organiza el equipo según el tamaño de la agencia. Conoce las tres estructuras de trabajo y las responsabilidades de cada rol.",
    temas: [
      { id: 19, titulo: "¿Qué es el BDC?", tipo: "lectura", duracion: "5 min" },
      { id: 20, titulo: "Las tres estructuras: Round Robin, APV Digital y Prefiltro", tipo: "lectura", duracion: "12 min" },
      { id: 21, titulo: "Coordinador BDC — Funciones y responsabilidades", tipo: "lectura", duracion: "10 min" },
      { id: 22, titulo: "Prefiltro, Hostess y Vendedor — Roles y límites", tipo: "lectura", duracion: "10 min" },
    ],
    tieneEvaluacion: true,
  },
  {
    id: 7,
    titulo: "Proceso de Primer Contacto",
    descripcion:
      "Guiones, intentos, autorespuestas y registro en bitácora. Aprende la secuencia de 7 días para contactar prospectos sin desperdiciar leads.",
    temas: [
      { id: 23, titulo: "Autorespuestas en WhatsApp Business", tipo: "lectura", duracion: "5 min" },
      { id: 24, titulo: "Secuencia de primer contacto — 7 días", tipo: "lectura", duracion: "10 min" },
      { id: 25, titulo: "Guiones de apoyo: voz, WhatsApp y correo", tipo: "actividad", duracion: "12 min" },
      { id: 26, titulo: "Registro correcto en bitácora", tipo: "actividad", duracion: "8 min" },
    ],
    tieneEvaluacion: false,
  },
  {
    id: 8,
    titulo: "Calificación de Prospectos y Agendamiento de Citas",
    descripcion:
      "Preguntas clave, técnica de opciones cerradas y tipos de cita. El objetivo de toda llamada BDC es siempre agendar una cita.",
    temas: [
      { id: 27, titulo: "El objetivo de toda llamada BDC", tipo: "lectura", duracion: "5 min" },
      { id: 28, titulo: "Regla del precio — 3 intentos", tipo: "lectura", duracion: "8 min" },
      { id: 29, titulo: "Preguntas clave de calificación del prospecto", tipo: "lectura", duracion: "10 min" },
      { id: 30, titulo: "Técnica de opciones cerradas para agendar", tipo: "actividad", duracion: "8 min" },
      { id: 31, titulo: "Cierre, confirmación y definición de cita válida", tipo: "actividad", duracion: "10 min" },
    ],
    tieneEvaluacion: true,
  },
  {
    id: 9,
    titulo: "Confirmación, Preparación y No Show",
    descripcion:
      "Cómo asegurar que la cita llegue y qué hacer cuando no llega. La confirmación gerencial y el manejo correcto del no show son clave para maximizar asistencias.",
    temas: [
      { id: 32, titulo: "Confirmación gerencial de la cita", tipo: "lectura", duracion: "8 min" },
      { id: 33, titulo: "Confirmación por prefiltro vía WhatsApp", tipo: "lectura", duracion: "7 min" },
      { id: 34, titulo: "Preparación en agencia para la cita (pase de cita)", tipo: "lectura", duracion: "10 min" },
      { id: 35, titulo: "Llamada de no show — Cómo reagendar correctamente", tipo: "actividad", duracion: "8 min" },
    ],
    tieneEvaluacion: false,
  },
  {
    id: 10,
    titulo: "Cierre, Postventa y Gestión de Resultados",
    descripcion:
      "Seguimiento al no vendido, análisis de bitácora y ciclo continuo. Aprende cómo cerrar el ciclo, alimentar el canal digital y analizar los resultados del BDC.",
    temas: [
      { id: 36, titulo: "Seguimiento al prospecto no vendido", tipo: "lectura", duracion: "8 min" },
      { id: 37, titulo: "¿Cuándo se considera cerrada una venta?", tipo: "lectura", duracion: "7 min" },
      { id: 38, titulo: "Acciones post-venta para alimentar el canal digital", tipo: "lectura", duracion: "8 min" },
      { id: 39, titulo: "La bitácora como herramienta de análisis", tipo: "lectura", duracion: "12 min" },
      { id: 40, titulo: "El ciclo del BDC mes a mes", tipo: "actividad", duracion: "5 min" },
    ],
    tieneEvaluacion: false,
  },
];

export interface ContenidoBloque {
  tipo: "parrafo" | "subtitulo" | "lista" | "tabla" | "alerta";
  texto?: string;
  items?: string[];
  filas?: { label: string; valor: string }[];
  variante?: "info" | "advertencia";
}

export const TEMAS_CONTENIDO: Record<number, ContenidoBloque[]> = {
  // ── MÓDULO 1 ─────────────────────────────────────────────────────────────
  1: [
    { tipo: "parrafo", texto: "El proyecto de ventas digitales de Grupo Farrera inició en 2018 con un kickoff realizado en las oficinas de Google. En ese momento, la industria automotriz ya exploraba la venta digital, pero Grupo Farrera apostó formalmente por estructurar toda una operación dedicada." },
    { tipo: "subtitulo", texto: "Proveedores clave en el arranque" },
    { tipo: "lista", items: ["GRT — GrahamRoss Training", "Go Virtual — Agencia de Google especializada en concesionarios"] },
    { tipo: "parrafo", texto: "A partir de estos aliados, se formó una célula de trabajo con colaboradores del área de Mercadotecnia, se levantaron diagnósticos de situación y se estructuró el proceso de trabajo digital." },
  ],
  2: [
    { tipo: "parrafo", texto: "El BDC no surgió de un día para otro. Aquí está el recorrido que ha tenido el proyecto desde su inicio:" },
    { tipo: "tabla", filas: [
      { label: "2018", valor: "Kickoff del proyecto en oficinas de Google" },
      { label: "Enero 2019", valor: "Primera capacitación oficial a gran escala en Grupo Farrera" },
      { label: "2019", valor: "Formación de la célula BDC; levantamiento de procesos" },
      { label: "Marzo–Abril 2020", valor: "Pandemia: cierre de puertas físicas en agencias" },
      { label: "Abril 2020 en adelante", valor: "La venta digital se vuelve representativa; brecha con venta total se reduce significativamente" },
      { label: "2021–presente", valor: "Participación digital sostenida en promedio del 40% o más" },
    ]},
  ],
  3: [
    { tipo: "parrafo", texto: "Antes de la pandemia, la brecha entre venta total y venta digital era enorme, principalmente por dos razones:" },
    { tipo: "lista", items: ["No se controlaba ni reportaba correctamente la información de leads.", "No existía un proceso estructurado de cuántos leads necesitar ni cómo trabajarlos."] },
    { tipo: "parrafo", texto: "Durante y después de la pandemia, ese aprendizaje previo permitió que la venta digital creciera y que Grupo Farrera fuera de las empresas automotrices que menos cayeron en ventas. De todas las agencias del grupo, solo dos pasaron de ser agencias a puntos de venta; no se cerró ninguna." },
    { tipo: "alerta", variante: "info", texto: "¿Por qué tomamos esta capacitación? Si estás aquí, fuiste contratado/a específicamente para este tipo de posición, que es distinta a las otras áreas de la agencia. Cada jugador debe ser mejor en su área para que el resultado colectivo funcione." },
  ],
  // ── MÓDULO 2 ─────────────────────────────────────────────────────────────
  4: [
    { tipo: "parrafo", texto: "KPI (Key Performance Indicator) significa Indicador Clave de Desempeño. En el BDC usamos KPIs para saber si vamos bien o mal en cada paso del proceso, sin esperar al cierre de mes para descubrirlo." },
  ],
  5: [
    { tipo: "parrafo", texto: "Mide qué porcentaje de las ventas totales de una agencia son de origen digital." },
    { tipo: "tabla", filas: [
      { label: "Objetivo grupo", valor: "40% de la venta total" },
      { label: "Mínimo aceptable", valor: "25% de la venta total" },
      { label: "Alerta roja", valor: "Por debajo del 25%" },
      { label: "Interpretación", valor: "10 unidades vendidas → mínimo 4 deben ser digitales" },
    ]},
    { tipo: "alerta", variante: "info", texto: "Fórmula: Ventas totales de la agencia × 40% = Objetivo de ventas digitales del mes\n\nEjemplo 1: Agencia que vende 100 unidades → objetivo: 40 ventas digitales\nEjemplo 2: Agencia que vende 40 unidades → objetivo: 16 ventas digitales" },
    { tipo: "parrafo", texto: "Si no sabes el objetivo de ventas de tu agencia, pregúntale a tu gerente el plan de negocios del mes." },
  ],
  6: [
    { tipo: "parrafo", texto: "Mide qué porcentaje de los leads recibidos se convierten en venta digital." },
    { tipo: "tabla", filas: [
      { label: "Objetivo actual", valor: "6% de los leads totales" },
      { label: "¿Para qué sirve?", valor: "Detectar si se están desperdiciando oportunidades de inversión" },
      { label: "Variable que lo afecta", valor: "Calidad de los leads, madurez de la operación, proceso de seguimiento" },
    ]},
    { tipo: "alerta", variante: "info", texto: "Fórmula directa: Leads × 6% = Ventas esperadas del mes\n250 leads × 6% = 15 ventas potenciales\n\nFórmula inversa: Ventas objetivo ÷ 6% = Leads necesarios\n8 ventas objetivo ÷ 0.06 = 133 leads mínimos necesarios" },
  ],
  7: [
    { tipo: "parrafo", texto: "La Dirección de Ventas Digitales realiza las siguientes actividades de supervisión:" },
    { tipo: "lista", items: [
      "Juntas mensuales: Una con directores/gerentes y una por marca (ej. las 6 agencias Kia en una sola junta).",
      "Bitácora digital: Todas las agencias llenan una bitácora unificada, independientemente del CRM de cada marca.",
      "Mystery Shopper: Llamadas no anunciadas evaluadas con formato de calificación. Los resultados y evidencias se comparten en juntas mensuales.",
    ]},
    { tipo: "alerta", variante: "advertencia", texto: "Trata cada llamada como si fuera evaluada. El Mystery Shopper no avisa cuándo llegará." },
  ],
  // ── MÓDULO 3 ─────────────────────────────────────────────────────────────
  8: [
    { tipo: "parrafo", texto: "El funnel (embudo de ventas) representa el recorrido de un lead desde que entra hasta que se convierte en venta. Cada etapa tiene un porcentaje de conversión esperado." },
  ],
  9: [
    { tipo: "tabla", filas: [
      { label: "Leads (100%)", valor: "Total de leads captados por marketing digital" },
      { label: "Contactados (60%)", valor: "Leads con los que se logró comunicación bidireccional real" },
      { label: "Citas agendadas (60% de contactados)", valor: "Contactados con fecha y hora específica de visita" },
      { label: "Citas asistidas (60% de agendadas)", valor: "Prospectos que llegaron físicamente a la agencia" },
      { label: "Ventas cerradas (28% de asistidas)", valor: "Conversión final de la operación" },
    ]},
    { tipo: "alerta", variante: "info", texto: "Ejemplo numérico con 100 leads:\n100 leads → 60 contactados → 36 citas agendadas → 22 citas asistidas → ~6 ventas\n\n¿Cómo se relaciona con el KPI de conversión?\n6 ventas ÷ 100 leads = 6% de conversión. ¡El funnel y los KPIs son la misma cosa vista desde ángulos distintos!" },
  ],
  10: [
    { tipo: "parrafo", texto: "Para que los objetivos mensuales sean manejables, se dividen entre los días laborables del mes. Tomando 30 días y quitando domingos = 26 días hábiles:" },
    { tipo: "tabla", filas: [
      { label: "Leads diarios necesarios (450 leads/mes)", valor: "~17 leads por día" },
      { label: "Contactados diarios", valor: "~10-11 contactados por día" },
      { label: "Citas agendadas diarias", valor: "6-7 citas por día" },
      { label: "Citas asistidas diarias", valor: "~4 asistidas por día" },
      { label: "Por prefiltro (si hay 2)", valor: "8-9 leads / 5 contactados / 3-4 citas por persona" },
    ]},
    { tipo: "alerta", variante: "advertencia", texto: "Acción del coordinador BDC: Si al día 10 del mes no llevas 170 leads (17 × 10), ya estás en retraso. Actúa sobre las campañas desde ese momento, no esperes al cierre." },
  ],
  11: [
    { tipo: "lista", items: [
      "Leads: Marketing digital + Coordinador BDC",
      "Contactados y Citas: Prefiltro (o asesor principio a fin en estructuras sin prefiltro)",
      "Asistidas y Venta: Vendedor / Asesor + Gerente de Ventas",
      "Base de datos y análisis: Marketing + Coordinador BDC",
    ]},
  ],
  // ── MÓDULO 4 ─────────────────────────────────────────────────────────────
  12: [
    { tipo: "parrafo", texto: "Una venta es considerada digital cuando el PRIMER contacto con el prospecto fue de origen virtual. Esto incluye: llamada, WhatsApp, formulario de web, redes sociales, etc." },
    { tipo: "subtitulo", texto: "No se considera digital si:" },
    { tipo: "lista", items: ["La persona llegó directamente al piso de ventas sin cita previa.", "El primer contacto fue en una prospección física o plaza comercial."] },
  ],
  13: [
    { tipo: "tabla", filas: [
      { label: "Teléfono (llamadas)", valor: "Mayor cierre de ventas. Objetivo: 35 llamadas/mes mínimo" },
      { label: "WhatsApp", valor: "Segunda fuente con mayor cierre. Objetivo: 60 leads/mes" },
      { label: "Sitio web local (formularios)", valor: "Cierre medio. Objetivo: 35 formularios/mes" },
      { label: "Redes sociales (FB, IG, TikTok)", valor: "Alto volumen, cierre medio-bajo. Objetivo: 60 leads/mes" },
      { label: "Sitio web de marca (planta)", valor: "Sin objetivo propio — no está en control de la agencia" },
      { label: "Sitio web Grupo Farrera MX", valor: "Sin objetivo propio — gestionado desde Dirección" },
      { label: "Farrera Premium", valor: "Base de datos de clientes. Sin objetivo fijo (depende de campañas)" },
      { label: "Otras fuentes", valor: "Mercado Libre, segunda mano, influencers, campañas especiales. Sin objetivo fijo" },
    ]},
  ],
  14: [
    { tipo: "lista", items: [
      "Sitio de marca/planta: Generado por la marca. Sus leads se reciben directamente en la agencia.",
      "Sitio web local: Manejado por la agencia vía proveedor de Google (Go Virtual). Es 100% responsabilidad del distribuidor.",
      "Sitio GF (grupofarreramx): Sitio de Dirección Corporativa, desde el cual también se generan leads.",
    ]},
  ],
  15: [
    { tipo: "subtitulo", texto: "Farrera Premium" },
    { tipo: "parrafo", texto: "Tarjeta de lealtad del grupo. Premia a clientes por sus compras y genera una base de datos de recompra. Cada venta debe generar una inscripción al programa para alimentar esa base. Las campañas se solicitan al equipo de Farrera Premium para activar contacto por correo o SMS." },
    { tipo: "subtitulo", texto: "Chat en línea" },
    { tipo: "parrafo", texto: "El chat en línea (ej. Gubagoo u otro proveedor) es el widget de diálogo en el sitio web. Solo es útil si el sitio tiene alto tráfico. No es una prioridad de fuente para la mayoría de las agencias." },
  ],
  // ── MÓDULO 5 ─────────────────────────────────────────────────────────────
  16: [
    { tipo: "parrafo", texto: "Proveedor principal del grupo: Go Virtual. Gestiona sitios web de distribuidores y campañas en Google." },
    { tipo: "subtitulo", texto: "Tipos de campaña en Google" },
    { tipo: "lista", items: [
      "Search (búsqueda): Anuncios que aparecen al buscar palabras clave. Se recomienda combinar marca + modelo + ubicación geográfica para evitar desperdiciar inversión en búsquedas irrelevantes o de otras ciudades.",
      "Display: Banners en páginas web externas. Genera impresiones, no leads directos. Recomendado para lanzamientos e inauguraciones.",
      "Remarketing: Impacta a usuarios que ya visitaron el sitio pero no completaron una acción (ej. iniciaron un formulario pero no lo enviaron). Las cookies están cambiando; funciona mejor directamente en el sitio.",
      "Performance Max: Campaña automatizada. Google decide en qué plataforma y formato mostrar los anuncios según aprendizaje de algoritmo. El equipo de la agencia solo aporta las artes en los tamaños solicitados.",
    ]},
    { tipo: "alerta", variante: "info", texto: "Click to Call: Botón de llamada dentro de los anuncios de Google o Facebook. Debe estar activo y vinculado al teléfono celular oficial de la agencia. Solicítalo a Go Virtual." },
  ],
  17: [
    { tipo: "lista", items: [
      "Campaña de mensajes: Incentiva WhatsApp o Messenger. Alto volumen de leads, calidad media.",
      "Campaña de clientes potenciales (formularios): Menor volumen pero mayor calidad. Se recomienda incluir una pregunta de control para filtrar intención real de compra.",
      "Promocionar página: Aumenta seguidores/likes. Ayuda al algoritmo a identificar perfiles similares a tus clientes actuales.",
      "Campaña de zona geográfica: Ideal para prospecciones en municipios alejados o plazas comerciales. Impacta a usuarios en un radio específico alrededor del evento.",
    ]},
    { tipo: "alerta", variante: "info", texto: "Combina campañas de mensajes + formularios en Meta para equilibrar volumen y calidad de leads. No dependas de una sola campaña." },
  ],
  18: [
    { tipo: "lista", items: [
      "Imprimir el número de celular en los coches o en carteles de la agencia.",
      "Repartir volantes con el contacto de WhatsApp.",
    ]},
    { tipo: "parrafo", texto: "Estas son actividades offline. Pueden sumar, pero no se miden como fuente digital y su efectividad es muy baja porque el usuario igual terminará buscando en Google antes de llamar." },
  ],
  // ── MÓDULO 6 ─────────────────────────────────────────────────────────────
  19: [
    { tipo: "parrafo", texto: "BDC: Business Development Center (Centro de Desarrollo de Negocios). Se llama así y no 'call center' o 'telemarketing' para mantener el enfoque: somos un equipo que hace negocios, no un área de atención general." },
    { tipo: "parrafo", texto: "El BDC no debe atender llamadas de servicio, refacciones, facturación o quejas. Esas llamadas deben derivarse al área correcta. Si recibes ese tipo de llamadas de forma constante, repórtalo a tu gerente para que Sistemas las redirija." },
  ],
  20: [
    { tipo: "subtitulo", texto: "Estructura 1: Round Robin" },
    { tipo: "parrafo", texto: "Los leads se asignan directamente a los asesores de piso (rotativamente). Los asesores realizan todo el proceso desde el primer contacto hasta el cierre. Aplica en agencias pequeñas con poco volumen." },
    { tipo: "lista", items: ["Requisito: Los asesores deben estar capacitados en el proceso BDC completo.", "Presencia: Siempre hay un Coordinador BDC, independientemente del tamaño."] },
    { tipo: "subtitulo", texto: "Estructura 2: Vendedores Principio a Fin (APV Digital)" },
    { tipo: "parrafo", texto: "Vendedores dedicados 100% a leads digitales. No tienen guardia en piso ni en plazas comerciales. Toda su cartera proviene de atracción digital." },
    { tipo: "lista", items: ["Ventaja: Especialización rápida y mayor enfoque en conversión digital."] },
    { tipo: "subtitulo", texto: "Estructura 3: Con Equipo de Prefiltro" },
    { tipo: "parrafo", texto: "Para agencias con volumen alto (80-100+ unidades/mes). El prefiltro hace el primer contacto, califica y agenda la cita. Luego pasa al vendedor solo citas calificadas." },
  ],
  21: [
    { tipo: "lista", items: [
      "Vigila que todos los procesos se cumplan correctamente.",
      "Escucha llamadas de prefiltros (etiqueta, dicción, resolución de dudas).",
      "Da seguimiento a operaciones hasta el cierre de venta.",
      "Hace llamadas de calidad (Mystery Shopper interno).",
      "Gestiona la base de datos: recupera leads de 3-4 meses anteriores para reasignar y darles segunda oportunidad.",
      "Comunica con marketing para verificar llegada de leads.",
    ]},
  ],
  22: [
    { tipo: "subtitulo", texto: "Prefiltro / Asesor BDC / Asesor Telefónico" },
    { tipo: "parrafo", texto: "Primer punto de contacto con el prospecto. Su función es como una hostess telefónica: voz profesional, atención a clientes, capacidad de resolución." },
    { tipo: "lista", items: [
      "Hace los intentos de contacto inicial (llamadas, WhatsApp, correo).",
      "Califica al prospecto con preguntas clave.",
      "Agenda la cita y realiza el pase de cita al vendedor.",
      "Hace llamada de no show cuando el prospecto no asiste.",
      "IMPORTANTE: El prefiltro NO cotiza, NO hace cierre de venta, NO da seguimiento físico en agencia.",
    ]},
    { tipo: "subtitulo", texto: "Hostess" },
    { tipo: "lista", items: [
      "Recibe a los prospectos citados en piso de ventas.",
      "Debe tener la lista de citas del día con anticipación.",
      "Notifica a BDC si una cita llegó o no llegó.",
      "Canaliza clientes no citados que llegan a piso al CRM de agencia.",
      "Redirige llamadas potenciales de venta al BDC.",
    ]},
    { tipo: "subtitulo", texto: "Vendedor / APV Digital" },
    { tipo: "lista", items: [
      "Atiende las citas agendadas por prefiltro.",
      "Realiza demo estática y dinámica, escenarios financieros, solicitud de crédito.",
      "Hace todos los trámites administrativos hasta la entrega.",
      "Reporta al Coordinador BDC el avance de cada operación.",
    ]},
  ],
  // ── MÓDULO 7 ─────────────────────────────────────────────────────────────
  23: [
    { tipo: "parrafo", texto: "Antes de que el prefiltro haga cualquier llamada, el celular oficial de la agencia debe tener configuradas en WhatsApp Business:" },
    { tipo: "lista", items: [
      "Mensaje de bienvenida: Se envía automáticamente cuando llega un mensaje nuevo.",
      "Mensaje de fuera de horario: Indica el horario de atención y cuándo se recibirá respuesta.",
    ]},
    { tipo: "alerta", variante: "info", texto: "Requisito mínimo: Todas las agencias deben tener un número celular oficial con WhatsApp Business activo, vinculado a Facebook Business. Si tu agencia no lo tiene, repórtalo a Dirección." },
  ],
  24: [
    { tipo: "parrafo", texto: "Independientemente del tipo de fuente (formulario, WhatsApp, redes sociales), el PRIMER paso siempre es una llamada telefónica. Si no contesta:" },
    { tipo: "tabla", filas: [
      { label: "Día 1", valor: "Llamada 1 → Mensaje de voz + WhatsApp 1 + Correo de cotización + Llamada 2 (sin mensaje) + WhatsApp 2" },
      { label: "Días 2-7", valor: "Continuar con intentos de llamada y WhatsApp alternados en distintos horarios" },
      { label: "Máximo de intentos", valor: "7 llamadas + 7 WhatsApp antes de clasificar el lead como no contactado" },
    ]},
    { tipo: "alerta", variante: "advertencia", texto: "No descartes un lead tras el primer intento. El prospecto puede estar en horario de trabajo, en una junta, o sin señal. Varía el horario de las llamadas. Un lead descartado prematuramente es inversión publicitaria desperdiciada." },
    { tipo: "parrafo", texto: "El proceso se detiene en el momento en que el prospecto contesta. No continúes con más intentos si ya lograste comunicación bidireccional." },
  ],
  25: [
    { tipo: "parrafo", texto: "El Drive de soporte BDC contiene guiones listos para usar. Incluyen:" },
    { tipo: "lista", items: [
      "Guion de mensaje de voz (Día 1, Llamada 1): Incluye nombre del prospecto, vehículo de interés, preguntas de calificación iniciales y datos de contacto del asesor. Menciona que se enviará correo.",
      "Guiones de WhatsApp (Día 1 al 7): Mensajes para copiar y pegar, ajustando los campos en gris.",
      "Guiones de correo electrónico (Mail Día 1): Con asunto y cuerpo listos, incluyendo opciones de cotización según vehículo.",
      "Guion para cuando SÍ contesta: Conversación consultiva, distinta al mensaje de voz.",
    ]},
    { tipo: "alerta", variante: "info", texto: "Los guiones son una guía, no un script robótico. Úsalos como base y agrega criterio según cada prospecto. Con el tiempo los vas a adaptar y ya no necesitarás copiarlos del Drive." },
  ],
  26: [
    { tipo: "parrafo", texto: "Cada intento de contacto debe registrarse en la bitácora. La sección de intentos de contacto permite al Coordinador BDC verificar que se están cumpliendo los 7 intentos. También debe registrarse:" },
    { tipo: "lista", items: [
      "Fecha de llegada del lead — cuándo entró al sistema",
      "Asesor BDC asignado y asesor de ventas asignado",
      "Datos del prospecto: nombre, teléfono, correo, unidad de interés, fuente, campaña",
      "Fecha de primer contacto efectivo — cuándo respondió por primera vez",
      "Estatus actual: contactado, cita agendada, asistida, vendido, etc.",
    ]},
  ],
  // ── MÓDULO 8 ─────────────────────────────────────────────────────────────
  27: [
    { tipo: "parrafo", texto: "Agendar una cita. Siempre. Aunque el prospecto haga preguntas de precio, equipamiento o financiamiento, el objetivo final es que establezca una fecha y hora de visita." },
  ],
  28: [
    { tipo: "parrafo", texto: "No dar el precio a la primera solicitud. La persona que llama a preguntar el precio normalmente lo usa como pretexto para tener atención; el precio ya está disponible en Google." },
    { tipo: "lista", items: [
      "1er intento de precio: Redirigir con preguntas de equipamiento: 'Antes de darte el precio, ¿prefieres asientos de piel o tela? ¿Color claro u oscuro? ¿Transmisión automática o manual?'",
      "2do intento de precio: Dar un rango: 'La versión inicial está en X, la final está en Y. Puedo acercarte mejor al precio según el equipamiento que buscas.'",
      "3er intento de precio: Dar el precio y continuar con las preguntas de calificación.",
    ]},
    { tipo: "alerta", variante: "advertencia", texto: "Mystery Shopper: Dar el precio al primer intento genera penalización en la calificación de evaluación." },
  ],
  29: [
    { tipo: "lista", items: [
      "¿Está comparando con otra marca o modelo? Si compara un Versa con un Corolla, ofrece un Altima para estar en el mismo segmento.",
      "¿Tiene interés en un modelo específico o está abierto a opciones?",
      "¿Tiene un monto de enganche definido? (Un monto concreto indica que ya revisó sus finanzas.)",
      "¿Tiene una mensualidad objetivo? (Indica que ya hizo un análisis financiero previo.)",
      "¿Puede comprobar ingresos? (Necesario para trámite de crédito.)",
      "¿Está en buró de crédito? Si sí, sugerirle que lleve a un coacreditado o presta nombre con documentación completa.",
      "¿Cuándo planea hacer la compra? Define la temperatura del prospecto: caliente, tibio o frío.",
    ]},
  ],
  30: [
    { tipo: "parrafo", texto: "En lugar de preguntar '¿cuándo puede venir?', hacer una afirmación con opciones cerradas: 'Lo espero hoy o mañana, ¿cuál le queda mejor?'" },
    { tipo: "subtitulo", texto: "Si dice que no puede:" },
    { tipo: "lista", items: ["'El sábado o el domingo, ¿cuál prefiere?'", "'¿Por la mañana o por la tarde?'", "'¿A las 3 o a las 6 de la tarde?'"] },
    { tipo: "parrafo", texto: "El prospecto siente que toma la decisión, pero tú diriges las opciones. Quien hace las preguntas controla la conversación." },
  ],
  31: [
    { tipo: "subtitulo", texto: "Técnicas de cierre de la cita" },
    { tipo: "lista", items: [
      "Comando inducido: '¿Tiene una pluma a la mano?' → el prospecto busca dónde apuntar y ya está mentalmente comprometido con la cita.",
      "Mapa mental de ubicación: Dar referencias en lugar de dirección exacta: 'Estamos frente al Chedraui Oriente, a una cuadra de la zona militar.'",
      "Reafirmación cortés: 'Si se retrasa o no puede llegar, ¿me podría avisar? Yo haría lo mismo por cortesía.'",
      "Segundo contacto: Pedir un número alterno (pareja, familiar) para poder localizar al prospecto si no responde el día de la cita.",
    ]},
    { tipo: "alerta", variante: "info", texto: "Una cita es válida SOLO si tiene: fecha específica + hora específica.\n'Voy a ir el fin de semana' NO es una cita. 'Voy el sábado a las 3 pm' SÍ es una cita." },
    { tipo: "subtitulo", texto: "Tipos de cita válida" },
    { tipo: "lista", items: [
      "Cita presencial en agencia: El prospecto llega al piso de ventas o punto de venta.",
      "Cita a domicilio: Se lleva la unidad a donde esté el cliente.",
      "Cita en punto de venta externo: Plaza comercial o exhibición en municipio cercano.",
      "Llamada extendida (+30 min): La lleva a cabo un APV. Se considera cita agendada y asistida.",
      "Videollamada (30-40 min): Por WhatsApp o plataforma similar. La realiza el APV, no el prefiltro.",
      "Llamada de seguimiento agendada: Cuando el prospecto no acepta cita aún. Válida como actividad de seguimiento.",
    ]},
  ],
  // ── MÓDULO 9 ─────────────────────────────────────────────────────────────
  32: [
    { tipo: "parrafo", texto: "El Gerente de Ventas (o Coordinador BDC en su defecto) debe llamar a cada prospecto citado para confirmar su visita. NO debe hacerlo el prefiltro, ya que fue quien agendó." },
    { tipo: "subtitulo", texto: "Beneficios de la confirmación gerencial" },
    { tipo: "lista", items: [
      "Aumenta la tasa de citas asistidas.",
      "El gerente verifica si las citas son reales y si el prospecto está bien perfilado.",
      "Le da visibilidad al gerente del tráfico esperado para el siguiente día.",
    ]},
    { tipo: "alerta", variante: "info", texto: "Si una agencia tiene 6-7 citas agendadas por día, las llamadas de confirmación no toman más de 30 minutos. Es totalmente factible para el gerente." },
    { tipo: "parrafo", texto: "Si el prospecto no contesta la llamada de confirmación, se envía un mensaje de texto o WhatsApp presentando al gerente." },
  ],
  33: [
    { tipo: "parrafo", texto: "Adicionalmente a la confirmación gerencial, el prefiltro envía un mensaje de WhatsApp:" },
    { tipo: "lista", items: ["Si la cita es en la mañana: Enviar la noche anterior.", "Si la cita es en la tarde: Enviar esa misma mañana."] },
    { tipo: "subtitulo", texto: "Este mensaje debe incluir:" },
    { tipo: "lista", items: [
      "Nombre del asesor de ventas que lo atenderá (con foto de perfil o tarjeta digital).",
      "Ubicación de la agencia (pin de Google Maps).",
      "Recordatorio de la fecha, hora y unidad de interés.",
    ]},
  ],
  34: [
    { tipo: "lista", items: [
      "Notificar a la hostess con la lista completa de citas del día.",
      "El asesor debe estar disponible en el horario de la cita (no salir a desayunar).",
      "Tener escenarios financieros preparados o el software listo para generarlos.",
      "La unidad de demo debe estar limpia y con gasolina.",
      "Entregar el pase de cita al asesor con: datos del cliente, unidad, fecha de compra, tipo de financiamiento, enganche, y observaciones clave de la llamada.",
    ]},
    { tipo: "alerta", variante: "info", texto: "Pase de cita — información mínima:\nDía y hora de cita · Nombre y datos de contacto del prospecto · Asesor que agendó\nUnidad de interés · ¿Nuevo o seminuevo? · ¿Crédito o contado?\nEnganche aproximado · Fecha estimada de compra · Observaciones especiales\n\nEjemplo: 'El cliente tiene un bebé — mostrar el sistema isofix del vehículo.'" },
  ],
  35: [
    { tipo: "parrafo", texto: "Si el prospecto no llegó a su cita, la hostess debe avisar a BDC en cuanto se cumpla 1 hora después de la hora agendada. No esperar hasta el final del día." },
    { tipo: "parrafo", texto: "Objetivo de la llamada de no show: Reagendar una nueva cita, no reclamar ni investigar el motivo." },
    { tipo: "lista", items: [
      "Preguntar primero si el prospecto está bien.",
      "Ser comprensivos: 'A veces las cosas salen de control y está bien.'",
      "Inmediatamente proponer nueva fecha con opciones cerradas.",
    ]},
    { tipo: "parrafo", texto: "Ese prospecto ya tiene costo de atracción, llamadas previas y registro completo. No vale la pena abandonarlo por un no show." },
  ],
  // ── MÓDULO 10 ────────────────────────────────────────────────────────────
  36: [
    { tipo: "parrafo", texto: "Si el prospecto asistió a la cita pero no se cerró ningún trato (sin enganche, sin solicitud de crédito, sin compromiso de compra), el Coordinador BDC debe hacer una llamada de calidad para investigar qué ocurrió." },
    { tipo: "alerta", variante: "info", texto: "NOTA: No todo prospecto que no compra entra en este proceso. Solo aplica si definitivamente se perdió la operación (no tiene intención de regresar, no dejó documentos, no reagendó)." },
  ],
  37: [
    { tipo: "parrafo", texto: "Una venta se considera cerrada cuando:" },
    { tipo: "lista", items: ["Se dejó enganche, O", "Se realizó solicitud de crédito aprobada, O", "Se firmaron documentos de compra."] },
    { tipo: "parrafo", texto: "Posteriormente se realiza la entrega de la unidad y se registra en la bitácora con fecha de facturación." },
  ],
  38: [
    { tipo: "lista", items: [
      "Entrega especial: Preparar la entrega con moño, globo u obsequio. Pedir autorización al cliente para fotografiar y publicar en redes sociales.",
      "Reseñas: Invitar al cliente a dejar una reseña positiva en Google Business o redes sociales.",
      "Referidos: Si el cliente quedó satisfecho en la llamada de calidad, pedirle el contacto de algún familiar o colega que esté considerando comprar un vehículo.",
    ]},
  ],
  39: [
    { tipo: "parrafo", texto: "La pestaña de 'Análisis' de la bitácora permite al Coordinador BDC ver:" },
    { tipo: "lista", items: [
      "Desempeño por asesor BDC: Leads asignados, porcentaje de contactación, citas, asistidas y ventas por cada prefiltro.",
      "Desempeño por asesor de ventas: Qué vendedor cierra más, quién necesita apoyo.",
      "Efectividad por fuente: ¿Qué fuente generó más ventas? ¿Cuál tuvo mejor calidad de leads?",
      "Operación diaria: Frecuencia de llegada de leads, días de mayor asistencia, tendencias del mercado local.",
      "Análisis por vehículo: ¿Qué modelo genera más leads pero menos ventas? Retroalimentar a proveedores y marketing.",
    ]},
    { tipo: "alerta", variante: "advertencia", texto: "Si los prefiltros no llenan correctamente la pestaña de leads (fechas, fuente, estatus), TODOS los análisis de la bitácora estarán incorrectos. La calidad del análisis depende de la disciplina en el registro." },
  ],
  40: [
    { tipo: "parrafo", texto: "El proceso es un ciclo continuo:" },
    { tipo: "lista", items: [
      "1. Marketing activa campañas → llegan leads",
      "2. BDC hace primer contacto y agenda citas",
      "3. Hostess recibe, asesor atiende y cierra",
      "4. Coordinador BDC + Marketing analizan resultados",
      "5. Se ajustan campañas y proceso para el siguiente mes",
    ]},
  ],
};

export const EVALUACIONES_MOCK: Record<number, Pregunta[]> = {
  1: [
    {
      id: 1,
      texto: "¿Qué porcentaje aproximado de ventas totalmente digitales se maneja actualmente?",
      opciones: ["5%", "10%–15%", "30%", "40%"],
      correcta: 1,
    },
  ],
  2: [
    {
      id: 1,
      texto: "¿Qué mide el KPI de conversión?",
      opciones: [
        "La cantidad de llamadas realizadas",
        "El porcentaje de leads que se convierten en ventas",
        "El número de citas agendadas",
        "El total de ventas mensuales",
      ],
      correcta: 1,
    },
    {
      id: 2,
      texto: "¿Cuál es el objetivo actual de conversión en BDC?",
      opciones: ["4%", "6%", "10%", "15%"],
      correcta: 1,
    },
    {
      id: 3,
      texto: "¿Qué mide el KPI de participación?",
      opciones: [
        "El número de asesores activos",
        "El porcentaje de ventas totales que provienen de medios digitales",
        "La cantidad de leads recibidos",
        "El tiempo de respuesta",
      ],
      correcta: 1,
    },
    {
      id: 4,
      texto: "¿Cuál es el objetivo de participación digital?",
      opciones: ["20%", "30%", "40%", "50%"],
      correcta: 2,
    },
    {
      id: 5,
      texto: "Si se venden 10 unidades, ¿cuántas deberían ser digitales según el objetivo?",
      opciones: ["2", "3", "4", "5"],
      correcta: 2,
    },
    {
      id: 6,
      texto: "Si se reciben 200 leads y se generan 12 ventas, ¿cuál es la conversión?",
      opciones: ["4%", "5%", "6%", "8%"],
      correcta: 2,
    },
    {
      id: 7,
      texto: "Si una agencia vendió 50 autos y 15 fueron digitales, ¿está cumpliendo el objetivo?",
      opciones: [
        "Sí, supera el objetivo",
        "Sí, está justo en el objetivo",
        "No, está por debajo del objetivo",
        "No aplica",
      ],
      correcta: 2,
    },
  ],
  6: [
    {
      id: 1,
      texto: "El BDC funciona principalmente como:",
      opciones: [
        "Call center",
        "Área administrativa",
        "Generador de negocio enfocado en ventas",
        "Soporte técnico",
      ],
      correcta: 2,
    },
    {
      id: 2,
      texto: "¿Cuál es el objetivo principal del área BDC?",
      opciones: [
        "Atender llamadas únicamente",
        "Generar citas sin seguimiento",
        "Hacer negocios (ventas)",
        "Registrar datos",
      ],
      correcta: 2,
    },
  ],
  8: [
    {
      id: 1,
      texto: "¿Cuál es el objetivo principal de cada llamada realizada en BDC?",
      opciones: [
        "Cerrar la venta",
        "Dar información general",
        "Agendar una cita",
        "Transferir al asesor",
      ],
      correcta: 2,
    },
  ],
};

export const EVALUACION_FINAL_MOCK: Pregunta[] = [
  {
    id: 1,
    texto: "¿Qué mide el KPI de conversión?",
    opciones: [
      "La cantidad de llamadas realizadas",
      "El porcentaje de leads que se convierten en ventas",
      "El número de citas agendadas",
      "El total de ventas mensuales",
    ],
    correcta: 1,
  },
  {
    id: 2,
    texto: "¿Cuál es el objetivo actual de conversión en BDC?",
    opciones: ["4%", "6%", "10%", "15%"],
    correcta: 1,
  },
  {
    id: 3,
    texto: "¿Qué mide el KPI de participación?",
    opciones: [
      "El número de asesores activos",
      "El porcentaje de ventas totales que provienen de medios digitales",
      "La cantidad de leads recibidos",
      "El tiempo de respuesta",
    ],
    correcta: 1,
  },
  {
    id: 4,
    texto: "¿Cuál es el objetivo de participación digital?",
    opciones: ["20%", "30%", "40%", "50%"],
    correcta: 2,
  },
  {
    id: 5,
    texto: "Si se venden 10 unidades, ¿cuántas deberían ser digitales según el objetivo?",
    opciones: ["2", "3", "4", "5"],
    correcta: 2,
  },
  {
    id: 6,
    texto: "Si se reciben 200 leads y se generan 12 ventas, ¿cuál es la conversión?",
    opciones: ["4%", "5%", "6%", "8%"],
    correcta: 2,
  },
  {
    id: 7,
    texto: "Si una agencia vendió 50 autos y 15 fueron digitales, ¿está cumpliendo el objetivo?",
    opciones: [
      "Sí, supera el objetivo",
      "Sí, está justo en el objetivo",
      "No, está por debajo del objetivo",
      "No aplica",
    ],
    correcta: 2,
  },
  {
    id: 8,
    texto: "¿Cuál es el objetivo principal de cada llamada realizada en BDC?",
    opciones: [
      "Cerrar la venta",
      "Dar información general",
      "Agendar una cita",
      "Transferir al asesor",
    ],
    correcta: 2,
  },
  {
    id: 9,
    texto: "El BDC funciona principalmente como:",
    opciones: [
      "Call center",
      "Área administrativa",
      "Generador de negocio enfocado en ventas",
      "Soporte técnico",
    ],
    correcta: 2,
  },
  {
    id: 10,
    texto: "¿Cuál es el objetivo principal del área BDC?",
    opciones: [
      "Atender llamadas únicamente",
      "Generar citas sin seguimiento",
      "Hacer negocios (ventas)",
      "Registrar datos",
    ],
    correcta: 2,
  },
  {
    id: 11,
    texto: "¿Qué porcentaje aproximado de ventas totalmente digitales se maneja actualmente?",
    opciones: ["5%", "10%–15%", "30%", "40%"],
    correcta: 1,
  },
];
