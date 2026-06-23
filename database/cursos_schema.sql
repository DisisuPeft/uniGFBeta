-- =============================================================
--  SCHEMA: Plataforma de Cursos / LMS
--  Motor:  PostgreSQL 14+
--  Fecha:  2026-05-22
-- =============================================================

-- -------------------------------------------------------------
-- EXTENSIONES
-- -------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- búsqueda por texto similar

-- =============================================================
-- BLOQUE 1 — USUARIOS (referencia mínima, adaptar al sistema existente)
-- =============================================================

CREATE TABLE IF NOT EXISTS usuario (
    id            SERIAL          PRIMARY KEY,
    nombre        VARCHAR(120)    NOT NULL,
    apellido      VARCHAR(120)    NOT NULL,
    email         VARCHAR(254)    NOT NULL UNIQUE,
    password_hash TEXT            NOT NULL,
    rol           VARCHAR(30)     NOT NULL DEFAULT 'alumno'
                                  CHECK (rol IN ('alumno','instructor','admin')),
    activo        BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    actualizado_at TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- =============================================================
-- BLOQUE 2 — CATÁLOGO DE CURSOS
-- =============================================================

CREATE TABLE IF NOT EXISTS curso (
    id              SERIAL          PRIMARY KEY,
    nombre          VARCHAR(255)    NOT NULL,
    descripcion     TEXT,
    duracion_horas  NUMERIC(6,2)    NOT NULL DEFAULT 0,
    imagen_url      TEXT,
    banner_url      TEXT,
    status          SMALLINT        NOT NULL DEFAULT 1
                                    CHECK (status IN (0,1,2)),
                                    -- 0=borrador, 1=activo, 2=archivado
    creado_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    actualizado_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Instructores asignados al curso (N:M)
CREATE TABLE IF NOT EXISTS curso_instructor (
    curso_id        INT     NOT NULL REFERENCES curso(id)    ON DELETE CASCADE,
    instructor_id   INT     NOT NULL REFERENCES usuario(id)  ON DELETE CASCADE,
    PRIMARY KEY (curso_id, instructor_id)
);

-- =============================================================
-- BLOQUE 3 — MÓDULOS
-- =============================================================

CREATE TABLE IF NOT EXISTS modulo (
    id                  SERIAL          PRIMARY KEY,
    curso_id            INT             NOT NULL REFERENCES curso(id) ON DELETE CASCADE,
    titulo              VARCHAR(255)    NOT NULL,
    descripcion         TEXT,
    orden               SMALLINT        NOT NULL DEFAULT 0,  -- posición dentro del curso
    horas_teoricas      NUMERIC(5,2)    NOT NULL DEFAULT 0,
    horas_practicas     NUMERIC(5,2)    NOT NULL DEFAULT 0,
    horas_totales       NUMERIC(5,2)    GENERATED ALWAYS AS (horas_teoricas + horas_practicas) STORED,
    tiene_evaluacion    BOOLEAN         NOT NULL DEFAULT FALSE,
    creado_at           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    actualizado_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    UNIQUE (curso_id, orden)   -- no puede haber dos módulos con el mismo orden en el mismo curso
);

-- =============================================================
-- BLOQUE 4 — TEMAS
-- =============================================================

CREATE TYPE tema_tipo AS ENUM ('lectura', 'video', 'actividad');

CREATE TABLE IF NOT EXISTS tema (
    id          SERIAL          PRIMARY KEY,
    modulo_id   INT             NOT NULL REFERENCES modulo(id) ON DELETE CASCADE,
    titulo      VARCHAR(255)    NOT NULL,
    duracion    VARCHAR(20),               -- ej. "10 min"
    tipo        tema_tipo       NOT NULL DEFAULT 'lectura',
    orden       SMALLINT        NOT NULL DEFAULT 0,
    creado_at   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    actualizado_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    UNIQUE (modulo_id, orden)
);

-- =============================================================
-- BLOQUE 5 — CONTENIDO DE TEMAS (bloques polimórficos)
-- =============================================================

CREATE TYPE bloque_tipo AS ENUM ('parrafo', 'subtitulo', 'lista', 'tabla', 'alerta', 'video');

CREATE TABLE IF NOT EXISTS contenido_bloque (
    id          SERIAL          PRIMARY KEY,
    tema_id     INT             NOT NULL REFERENCES tema(id) ON DELETE CASCADE,
    tipo        bloque_tipo     NOT NULL,
    orden       SMALLINT        NOT NULL DEFAULT 0,

    -- Texto plano: parrafo, subtitulo, alerta
    texto       TEXT,

    -- Solo para tipo='alerta'
    variante    VARCHAR(20)     CHECK (variante IN ('info', 'advertencia')),

    -- Solo para tipo='lista'  →  ["item 1","item 2",...]
    items       JSONB,

    -- Solo para tipo='tabla'  →  [{"label":"X","valor":"Y"},...]
    filas       JSONB,

    -- Solo para tipo='video'  →  URL del embed (YouTube, Vimeo, etc.)
    video_url   TEXT,

    creado_at   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    UNIQUE (tema_id, orden),

    -- Validaciones de integridad por tipo
    CONSTRAINT chk_parrafo   CHECK (tipo <> 'parrafo'   OR texto IS NOT NULL),
    CONSTRAINT chk_subtitulo CHECK (tipo <> 'subtitulo' OR texto IS NOT NULL),
    CONSTRAINT chk_alerta    CHECK (tipo <> 'alerta'    OR texto IS NOT NULL),
    CONSTRAINT chk_lista     CHECK (tipo <> 'lista'     OR items IS NOT NULL),
    CONSTRAINT chk_tabla     CHECK (tipo <> 'tabla'     OR filas IS NOT NULL),
    CONSTRAINT chk_video     CHECK (tipo <> 'video'     OR video_url IS NOT NULL)
);

-- =============================================================
-- BLOQUE 6 — EVALUACIONES
-- =============================================================

CREATE TYPE evaluacion_tipo AS ENUM ('modulo', 'final');

CREATE TABLE IF NOT EXISTS evaluacion (
    id              SERIAL              PRIMARY KEY,
    titulo          VARCHAR(255)        NOT NULL,
    tipo            evaluacion_tipo     NOT NULL,
    puntaje_minimo  NUMERIC(5,2)        NOT NULL DEFAULT 70.00,  -- % mínimo para aprobar

    -- Solo uno de los dos puede ser NOT NULL según el tipo
    curso_id        INT     REFERENCES curso(id)  ON DELETE CASCADE,
    modulo_id       INT     REFERENCES modulo(id) ON DELETE CASCADE,

    creado_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    -- Evaluación de módulo: debe tener modulo_id
    -- Evaluación final:     debe tener curso_id
    CONSTRAINT chk_eval_modulo CHECK (tipo <> 'modulo' OR modulo_id IS NOT NULL),
    CONSTRAINT chk_eval_final  CHECK (tipo <> 'final'  OR curso_id  IS NOT NULL),

    -- Solo una evaluación por módulo / por curso-final
    UNIQUE NULLS NOT DISTINCT (modulo_id, tipo),
    UNIQUE NULLS NOT DISTINCT (curso_id,  tipo)
);

-- =============================================================
-- BLOQUE 7 — PREGUNTAS Y OPCIONES
-- =============================================================

CREATE TABLE IF NOT EXISTS pregunta (
    id              SERIAL      PRIMARY KEY,
    evaluacion_id   INT         NOT NULL REFERENCES evaluacion(id) ON DELETE CASCADE,
    orden           SMALLINT    NOT NULL DEFAULT 0,
    texto           TEXT        NOT NULL,

    UNIQUE (evaluacion_id, orden)
);

CREATE TABLE IF NOT EXISTS opcion_pregunta (
    id              SERIAL      PRIMARY KEY,
    pregunta_id     INT         NOT NULL REFERENCES pregunta(id) ON DELETE CASCADE,
    orden           SMALLINT    NOT NULL DEFAULT 0,
    texto           TEXT        NOT NULL,
    es_correcta     BOOLEAN     NOT NULL DEFAULT FALSE,

    UNIQUE (pregunta_id, orden)
);

-- Garantiza que cada pregunta tenga exactamente UNA opción correcta
-- (se recomienda validar también en la capa de aplicación)
CREATE UNIQUE INDEX idx_una_correcta_por_pregunta
    ON opcion_pregunta (pregunta_id)
    WHERE es_correcta = TRUE;

-- =============================================================
-- BLOQUE 8 — INSCRIPCIONES
-- =============================================================

CREATE TABLE IF NOT EXISTS inscripcion (
    id              SERIAL          PRIMARY KEY,
    alumno_id       INT             NOT NULL REFERENCES usuario(id)  ON DELETE CASCADE,
    curso_id        INT             NOT NULL REFERENCES curso(id)    ON DELETE CASCADE,
    inscrito_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    completado_at   TIMESTAMPTZ,

    UNIQUE (alumno_id, curso_id)
);

-- =============================================================
-- BLOQUE 9 — PROGRESO POR TEMA
-- =============================================================

CREATE TABLE IF NOT EXISTS progreso_tema (
    id              SERIAL      PRIMARY KEY,
    alumno_id       INT         NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    tema_id         INT         NOT NULL REFERENCES tema(id)    ON DELETE CASCADE,
    completado_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (alumno_id, tema_id)
);

-- =============================================================
-- BLOQUE 10 — RESULTADOS DE EVALUACIONES
-- =============================================================

CREATE TABLE IF NOT EXISTS resultado_evaluacion (
    id              SERIAL          PRIMARY KEY,
    alumno_id       INT             NOT NULL REFERENCES usuario(id)       ON DELETE CASCADE,
    evaluacion_id   INT             NOT NULL REFERENCES evaluacion(id)    ON DELETE CASCADE,
    correctas       SMALLINT        NOT NULL DEFAULT 0,
    total           SMALLINT        NOT NULL DEFAULT 0,
    puntaje         NUMERIC(5,2)    GENERATED ALWAYS AS
                        (CASE WHEN total = 0 THEN 0
                              ELSE ROUND((correctas::NUMERIC / total) * 100, 2)
                         END) STORED,
    aprobado        BOOLEAN         GENERATED ALWAYS AS
                        (CASE WHEN total = 0 THEN FALSE
                              ELSE (correctas::NUMERIC / total) * 100 >= 70
                         END) STORED,
    presentado_at   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    -- Permite múltiples intentos; el frontend usa el más reciente
    -- Si solo se quiere un intento: añadir UNIQUE (alumno_id, evaluacion_id)
    CONSTRAINT chk_correctas CHECK (correctas >= 0 AND correctas <= total),
    CONSTRAINT chk_total     CHECK (total >= 0)
);

-- =============================================================
-- ÍNDICES PARA RENDIMIENTO
-- =============================================================

CREATE INDEX idx_modulo_curso        ON modulo(curso_id, orden);
CREATE INDEX idx_tema_modulo         ON tema(modulo_id, orden);
CREATE INDEX idx_bloque_tema         ON contenido_bloque(tema_id, orden);
CREATE INDEX idx_pregunta_eval       ON pregunta(evaluacion_id, orden);
CREATE INDEX idx_opcion_pregunta     ON opcion_pregunta(pregunta_id, orden);
CREATE INDEX idx_inscripcion_alumno  ON inscripcion(alumno_id);
CREATE INDEX idx_inscripcion_curso   ON inscripcion(curso_id);
CREATE INDEX idx_progreso_alumno     ON progreso_tema(alumno_id);
CREATE INDEX idx_resultado_alumno    ON resultado_evaluacion(alumno_id, evaluacion_id);
CREATE INDEX idx_curso_nombre        ON curso USING gin (nombre gin_trgm_ops);  -- búsqueda fuzzy

-- =============================================================
-- TRIGGERS — updated_at automático
-- =============================================================

CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.actualizado_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_curso_updated
    BEFORE UPDATE ON curso
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_modulo_updated
    BEFORE UPDATE ON modulo
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_tema_updated
    BEFORE UPDATE ON tema
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- =============================================================
-- VISTAS ÚTILES
-- =============================================================

-- Progreso general de un alumno en un curso
CREATE OR REPLACE VIEW v_progreso_curso AS
SELECT
    i.alumno_id,
    i.curso_id,
    COUNT(DISTINCT t.id)                            AS total_temas,
    COUNT(DISTINCT pt.tema_id)                      AS temas_completados,
    ROUND(
        COUNT(DISTINCT pt.tema_id)::NUMERIC
        / NULLIF(COUNT(DISTINCT t.id), 0) * 100, 1
    )                                               AS porcentaje_avance,
    i.completado_at
FROM inscripcion i
JOIN modulo   m  ON m.curso_id   = i.curso_id
JOIN tema     t  ON t.modulo_id  = m.id
LEFT JOIN progreso_tema pt
       ON pt.tema_id   = t.id
      AND pt.alumno_id = i.alumno_id
GROUP BY i.alumno_id, i.curso_id, i.completado_at;

-- Último resultado por evaluación por alumno
CREATE OR REPLACE VIEW v_ultimo_resultado AS
SELECT DISTINCT ON (alumno_id, evaluacion_id)
    alumno_id,
    evaluacion_id,
    correctas,
    total,
    puntaje,
    aprobado,
    presentado_at
FROM resultado_evaluacion
ORDER BY alumno_id, evaluacion_id, presentado_at DESC;

-- =============================================================
-- DATOS DE EJEMPLO — Curso BDC (refleja el mock actual del frontend)
-- =============================================================

INSERT INTO usuario (nombre, apellido, email, password_hash, rol) VALUES
    ('Admin', 'Sistema', 'admin@grupofarrera.com', 'hashed', 'admin'),
    ('Instructor', 'BDC',    'bdc@grupofarrera.com',   'hashed', 'instructor');

INSERT INTO curso (nombre, descripcion, duracion_horas, status) VALUES
    (
        'Ventas Digitales BDC — Grupo Farrera',
        'Capacitación integral del Business Development Center: métricas, procesos, roles y herramientas para la venta digital automotriz.',
        20,
        1
    );

INSERT INTO curso_instructor (curso_id, instructor_id) VALUES (1, 2);

INSERT INTO modulo (curso_id, titulo, descripcion, orden, horas_teoricas, horas_practicas, tiene_evaluacion) VALUES
    (1, 'Antecedentes del Proyecto de Ventas Digitales',
     'Historia, contexto y justificación del BDC en Grupo Farrera.',
     1, 1, 0, TRUE),
    (1, 'Métricas e Indicadores Clave (KPIs)',
     'Participación, conversión y cómo calcular objetivos.',
     2, 2, 0, TRUE),
    (1, 'El Funnel de Ventas Digital',
     'Estructura, porcentajes y objetivos por etapa.',
     3, 1.5, 0.5, FALSE);

INSERT INTO tema (modulo_id, titulo, duracion, tipo, orden) VALUES
    -- Módulo 1
    (1, '¿De dónde viene el proyecto?',                          '10 min', 'lectura',    1),
    (1, 'Línea de tiempo del BDC en Grupo Farrera',              '8 min',  'lectura',    2),
    (1, 'Impacto de la pandemia en las ventas digitales',        '7 min',  'lectura',    3),
    -- Módulo 2
    (2, '¿Qué es un KPI?',                                      '5 min',  'lectura',    1),
    (2, 'KPI #1 — Participación Digital',                        '10 min', 'lectura',    2),
    (2, 'KPI #2 — Conversión (Aprovechamiento)',                 '10 min', 'lectura',    3),
    (2, 'Supervisión y Mystery Shopper',                         '8 min',  'lectura',    4),
    -- Módulo 3
    (3, '¿Qué es el funnel de ventas?',                         '8 min',  'lectura',    1),
    (3, 'Etapas del funnel digital y porcentajes de conversión', '10 min', 'lectura',    2),
    (3, 'Pulverización de objetivos por día',                    '10 min', 'actividad',  3),
    (3, 'Responsables por etapa del funnel',                     '5 min',  'lectura',    4);
