"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ChevronDown, ChevronRight, Plus, Trash2, Edit2,
  AlignLeft, Info, List, Table2, PlayCircle, CheckCircle2,
  Circle, GripVertical, BookOpen, Loader2, Check, X,
  ClipboardList, Zap,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  useGetCursoQuery,
  useUpdateCursoMutation,
  useGetModulosByCursoQuery,
  useCreateModuloMutation,
  useUpdateModuloMutation,
  useDeleteModuloMutation,
  useGetTemasByModuloQuery,
  useCreateTemaMutation,
  useUpdateTemaMutation,
  useDeleteTemaMutation,
  useGetBloquesByTemaQuery,
  useCreateBloqueMutation,
  useUpdateBloqueMutation,
  useDeleteBloqueMutation,
  useGetEvaluacionesByCursoQuery,
  useGetEvaluacionesByModuloQuery,
  useCreateEvaluacionMutation,
  useDeleteEvaluacionMutation,
  useGetPreguntasByEvaluacionQuery,
  useCreatePreguntaMutation,
  useUpdatePreguntaMutation,
  useDeletePreguntaMutation,
  useGetOpcionesByPreguntaQuery,
  useCreateOpcionMutation,
  useUpdateOpcionMutation,
  useDeleteOpcionMutation,
} from "@/redux/features/capacitacion/capacitacionApiSlice";
import {
  useGetStatusCursoQuery,
  useGetTiposTemaQuery,
  useGetTiposBloqueQuery,
  useGetTiposEvaluacionQuery,
  useGetNivelesCompetenciaQuery,
} from "@/redux/features/catalogos/genericosApiSlice";
import {
  useGetCompetenciasCursoQuery,
  useCreateCompetenciaCursoMutation,
  useDeleteCompetenciaCursoMutation,
  useGetCompetenciasQuery,
} from "@/redux/features/competencias/competenciasApiSlice";
import {
  Curso, CursoForm,
  Modulo, ModuloForm,
  Tema, TemaForm,
  ContenidoBloque, BloqueForm,
  Evaluacion, EvaluacionForm,
  Pregunta,
  OpcionPregunta,
} from "@/redux/features/types/capacitacion/types";
import { TipoBloque, TipoTema, TipoEvaluacion, StatusCurso } from "@/redux/features/types/catalagos/cat";

// ── helpers ───────────────────────────────────────────────────

const inputCls =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2]/20 transition-colors placeholder:text-gray-400 bg-white";

const selectCls =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] transition-colors bg-white text-gray-700";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-1 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
        <Icon className="w-4 h-4 text-gray-500" />
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function IconBtn({ onClick, title, children, danger }: {
  onClick: () => void; title?: string; children: React.ReactNode; danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg transition-colors ${danger ? "hover:bg-red-50 text-gray-400 hover:text-red-500" : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"}`}
    >
      {children}
    </button>
  );
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0056D2] bg-[#F0F6FF] rounded-lg hover:bg-[#e0edff] transition-colors"
    >
      <Plus className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function bloqueIcon(codigo: string) {
  switch (codigo) {
    case "callout": case "alerta": return Info;
    case "lista": case "pasos": return List;
    case "tabla": return Table2;
    case "video": return PlayCircle;
    default: return AlignLeft;
  }
}

function bloquePreview(b: ContenidoBloque): string {
  if (b.texto) return b.texto.slice(0, 70) + (b.texto.length > 70 ? "…" : "");
  if (b.video_url) return b.video_url.slice(0, 60) + "…";
  if (b.items) return `${b.items.length} ítem${b.items.length !== 1 ? "s" : ""}`;
  if (b.filas) return `${b.filas.length} fila${b.filas.length !== 1 ? "s" : ""}`;
  return "—";
}

async function swapOrden<T extends { id: number; orden: number }>(
  a: T, b: T,
  updateFn: (arg: { id: number; body: { orden: number } }) => { unwrap: () => Promise<unknown> },
) {
  const temp = Math.max(a.orden, b.orden) + 1000;
  await updateFn({ id: a.id, body: { orden: temp } }).unwrap();
  await updateFn({ id: b.id, body: { orden: a.orden } }).unwrap();
  await updateFn({ id: a.id, body: { orden: b.orden } }).unwrap();
}

// ── Main Editor ───────────────────────────────────────────────

export default function CursoEditorView({ cursoId }: { cursoId: number }) {
  const router = useRouter();
  const { data: curso, isLoading } = useGetCursoQuery(cursoId);
  const { data: statusList } = useGetStatusCursoQuery();
  const { data: tiposTema } = useGetTiposTemaQuery();
  const { data: tiposBloque } = useGetTiposBloqueQuery();
  const { data: tiposEvaluacion } = useGetTiposEvaluacionQuery();
  const { data: nivelesComp } = useGetNivelesCompetenciaQuery();
  const { data: competencias } = useGetCompetenciasQuery();

  if (isLoading || !curso) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const cats = {
    statusList: statusList?.results ?? [],
    tiposTema: tiposTema?.results ?? [],
    tiposBloque: tiposBloque?.results ?? [],
    tiposEvaluacion: tiposEvaluacion?.results ?? [],
    nivelesComp: nivelesComp?.results ?? [],
    competencias: competencias?.results ?? [],
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Breadcrumb + back */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push("/dashboard/capacitacion/cursos")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Cursos
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-medium text-gray-800 line-clamp-1">{curso.titulo}</span>
      </div>

      {/* Info del curso */}
      <CursoInfoCard curso={curso} statusList={cats.statusList} />

      {/* Módulos */}
      <ModulosSection cursoId={cursoId} curso={curso} cats={cats} />

      {/* Evaluación final */}
      <EvaluacionFinalSection cursoId={cursoId} cats={cats} />

      {/* Competencias del curso */}
      <CompetenciasSection cursoId={cursoId} cats={cats} />
    </div>
  );
}

// ── Curso Info Card ───────────────────────────────────────────

function CursoInfoCard({ curso, statusList }: { curso: Curso; statusList: StatusCurso[] }) {
  const [update, { isLoading: saving }] = useUpdateCursoMutation();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<CursoForm>({
    titulo: curso.titulo,
    descripcion: curso.descripcion ?? "",
    duracion_horas: curso.duracion_horas,
    status: curso.status,
    activo: curso.activo,
  });

  async function handleSave() {
    try {
      await update({ id: curso.id, body: form }).unwrap();
      setEditing(false);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar." });
    }
  }

  const STATUS_CLS: Record<string, string> = {
    borrador: "bg-gray-100 text-gray-600",
    publicado: "bg-emerald-50 text-emerald-700",
    archivado: "bg-red-50 text-red-600",
  };
  const statusCls = STATUS_CLS[curso.status_nombre?.toLowerCase()] ?? "bg-gray-100 text-gray-600";

  return (
    <SectionCard title="Información del Curso" icon={BookOpen}>
      {editing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Field label="Título" required>
                <input
                  value={form.titulo}
                  onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Descripción">
                <textarea
                  value={form.descripcion ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                  rows={2}
                  className={inputCls + " resize-none"}
                />
              </Field>
            </div>
            <Field label="Duración (horas)">
              <input
                type="number"
                min="0"
                step="0.5"
                value={form.duracion_horas}
                onChange={(e) => setForm((f) => ({ ...f, duracion_horas: e.target.value }))}
                className={inputCls}
              />
            </Field>
            <Field label="Estado">
              <select
                value={form.status ?? 1}
                onChange={(e) => setForm((f) => ({ ...f, status: Number(e.target.value) }))}
                className={selectCls}
              >
                {statusList.map((s) => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1c2634] rounded-lg hover:bg-[#1c2634]/90 disabled:opacity-50 transition-colors"
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg font-bold text-gray-900">{curso.titulo}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusCls}`}>
                {curso.status_nombre}
              </span>
            </div>
            {curso.descripcion && (
              <p className="text-sm text-gray-500">{curso.descripcion}</p>
            )}
            <p className="text-xs text-gray-400">{curso.duracion_horas} horas totales</p>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Edit2 className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}
    </SectionCard>
  );
}

// ── Módulos ───────────────────────────────────────────────────

type Cats = {
  statusList: StatusCurso[];
  tiposTema: TipoTema[];
  tiposBloque: TipoBloque[];
  tiposEvaluacion: TipoEvaluacion[];
  nivelesComp: { id: number; nombre: string }[];
  competencias: { id: number; nombre: string }[];
};

function ModulosSection({ cursoId, curso, cats }: { cursoId: number; curso: Curso; cats: Cats }) {
  const { data } = useGetModulosByCursoQuery(cursoId);
  const [createModulo, { isLoading: adding }] = useCreateModuloMutation();
  const [updateModulo] = useUpdateModuloMutation();
  const [deleteModulo] = useDeleteModuloMutation();

  const [showForm, setShowForm] = useState(false);
  const [newForm, setNewForm] = useState<Omit<ModuloForm, "curso" | "orden">>({
    titulo: "",
    descripcion: "",
    horas_teoricas: "0.00",
    horas_practicas: "0.00",
    tiene_evaluacion: false,
    activo: true,
  });

  const modulos = [...(data?.results ?? [])].sort((a, b) => a.orden - b.orden);

  async function handleAdd() {
    if (!newForm.titulo.trim()) return;
    try {
      await createModulo({
        ...newForm,
        curso: cursoId,
        orden: modulos.length + 1,
      }).unwrap();
      setNewForm({ titulo: "", descripcion: "", horas_teoricas: "0.00", horas_practicas: "0.00", tiene_evaluacion: false, activo: true });
      setShowForm(false);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear el módulo." });
    }
  }

  async function handleDelete(m: Modulo) {
    const r = await Swal.fire({
      icon: "warning", title: "¿Eliminar módulo?", text: `"${m.titulo}" y todo su contenido se eliminarán.`,
      showCancelButton: true, confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar", confirmButtonColor: "#dc2626",
    });
    if (!r.isConfirmed) return;
    try { await deleteModulo(m.id).unwrap(); } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar." });
    }
  }

  return (
    <SectionCard title="Módulos" icon={GripVertical}>
      <div className="space-y-3">
        {modulos.map((m, idx) => (
          <ModuloCard
            key={m.id}
            modulo={m}
            isFirst={idx === 0}
            isLast={idx === modulos.length - 1}
            onMoveUp={() => swapOrden(m, modulos[idx - 1], updateModulo)}
            onMoveDown={() => swapOrden(m, modulos[idx + 1], updateModulo)}
            onDelete={() => handleDelete(m)}
            cats={cats}
          />
        ))}

        {showForm ? (
          <div className="border border-dashed border-gray-300 rounded-xl p-4 space-y-3 bg-gray-50/50">
            <p className="text-sm font-medium text-gray-700">Nuevo módulo</p>
            <Field label="Título" required>
              <input value={newForm.titulo} onChange={(e) => setNewForm((f) => ({ ...f, titulo: e.target.value }))} placeholder="Introducción al Liderazgo" className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Horas teóricas">
                <input type="number" min="0" step="0.5" value={newForm.horas_teoricas} onChange={(e) => setNewForm((f) => ({ ...f, horas_teoricas: e.target.value }))} className={inputCls} />
              </Field>
              <Field label="Horas prácticas">
                <input type="number" min="0" step="0.5" value={newForm.horas_practicas} onChange={(e) => setNewForm((f) => ({ ...f, horas_practicas: e.target.value }))} className={inputCls} />
              </Field>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={newForm.tiene_evaluacion} onChange={(e) => setNewForm((f) => ({ ...f, tiene_evaluacion: e.target.checked }))} className="rounded" />
              <span className="text-sm text-gray-600">Incluir evaluación en este módulo</span>
            </label>
            <div className="flex gap-2">
              <button onClick={handleAdd} disabled={adding || !newForm.titulo.trim()} className="px-4 py-2 text-sm font-medium text-white bg-[#1c2634] rounded-lg hover:bg-[#1c2634]/90 disabled:opacity-50 transition-colors">
                {adding ? "Agregando…" : "Agregar módulo"}
              </button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <AddBtn onClick={() => setShowForm(true)} label="Agregar módulo" />
        )}
      </div>
    </SectionCard>
  );
}

// ── Módulo Card ───────────────────────────────────────────────

function ModuloCard({ modulo, isFirst, isLast, onMoveUp, onMoveDown, onDelete, cats }: {
  modulo: Modulo; isFirst: boolean; isLast: boolean;
  onMoveUp: () => void; onMoveDown: () => void; onDelete: () => void;
  cats: Cats;
}) {
  const [updateModulo, { isLoading: saving }] = useUpdateModuloMutation();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<ModuloForm>>({
    titulo: modulo.titulo,
    descripcion: modulo.descripcion ?? "",
    horas_teoricas: modulo.horas_teoricas,
    horas_practicas: modulo.horas_practicas,
    tiene_evaluacion: modulo.tiene_evaluacion,
  });

  async function handleSave() {
    try {
      await updateModulo({ id: modulo.id, body: form }).unwrap();
      setEditing(false);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar." });
    }
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white">
        <span className="w-6 h-6 rounded-full bg-[#1c2634] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
          {modulo.orden}
        </span>
        {editing ? (
          <div className="flex-1 space-y-2">
            <input value={form.titulo ?? ""} onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))} className={inputCls} />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" min="0" step="0.5" placeholder="Horas teóricas" value={form.horas_teoricas ?? ""} onChange={(e) => setForm((f) => ({ ...f, horas_teoricas: e.target.value }))} className={inputCls} />
              <input type="number" min="0" step="0.5" placeholder="Horas prácticas" value={form.horas_practicas ?? ""} onChange={(e) => setForm((f) => ({ ...f, horas_practicas: e.target.value }))} className={inputCls} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.tiene_evaluacion ?? false} onChange={(e) => setForm((f) => ({ ...f, tiene_evaluacion: e.target.checked }))} className="rounded" />
              <span className="text-xs text-gray-600">Incluir evaluación</span>
            </label>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="px-3 py-1.5 text-xs font-medium text-white bg-[#1c2634] rounded-lg disabled:opacity-50 transition-colors">
                {saving ? "…" : "Guardar"}
              </button>
              <button onClick={() => setEditing(false)} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg transition-colors">Cancelar</button>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{modulo.titulo}</p>
            <p className="text-xs text-gray-400">{modulo.horas_teoricas}h teóricas · {modulo.horas_practicas}h prácticas</p>
          </div>
        )}
        {!editing && (
          <div className="flex items-center gap-0.5 flex-shrink-0 ml-auto">
            <IconBtn onClick={onMoveUp} title="Subir" ><ChevronDown className="w-3.5 h-3.5 rotate-180" /></IconBtn>
            <IconBtn onClick={onMoveDown} title="Bajar" ><ChevronDown className="w-3.5 h-3.5" /></IconBtn>
            <IconBtn onClick={() => setEditing(true)}><Edit2 className="w-3.5 h-3.5" /></IconBtn>
            <IconBtn onClick={onDelete} danger><Trash2 className="w-3.5 h-3.5" /></IconBtn>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
            >
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      {expanded && !editing && (
        <div className="border-t border-gray-100 bg-gray-50/40 p-4 space-y-4">
          <TemasSection moduloId={modulo.id} cats={cats} />
          {modulo.tiene_evaluacion && (
            <EvaluacionModuloSection moduloId={modulo.id} cats={cats} />
          )}
        </div>
      )}
    </div>
  );
}

// ── Temas ─────────────────────────────────────────────────────

function TemasSection({ moduloId, cats }: { moduloId: number; cats: Cats }) {
  const { data } = useGetTemasByModuloQuery(moduloId);
  const [createTema, { isLoading: adding }] = useCreateTemaMutation();
  const [updateTema] = useUpdateTemaMutation();
  const [deleteTema] = useDeleteTemaMutation();

  const [showForm, setShowForm] = useState(false);
  const [newForm, setNewForm] = useState<Omit<TemaForm, "modulo" | "orden">>({
    titulo: "", duracion_estimada: "", tipo: cats.tiposTema[0]?.id ?? 1,
  });

  const temas = [...(data?.results ?? [])].sort((a, b) => a.orden - b.orden);

  async function handleAdd() {
    if (!newForm.titulo.trim()) return;
    try {
      await createTema({ ...newForm, modulo: moduloId, orden: temas.length + 1 }).unwrap();
      setNewForm({ titulo: "", duracion_estimada: "", tipo: cats.tiposTema[0]?.id ?? 1 });
      setShowForm(false);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear el tema." });
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Temas</p>
      {temas.map((t, idx) => (
        <TemaCard
          key={t.id} tema={t}
          isFirst={idx === 0} isLast={idx === temas.length - 1}
          onMoveUp={() => swapOrden(t, temas[idx - 1], updateTema)}
          onMoveDown={() => swapOrden(t, temas[idx + 1], updateTema)}
          onDelete={async () => {
            const r = await Swal.fire({ icon: "warning", title: "¿Eliminar tema?", text: `"${t.titulo}"`, showCancelButton: true, confirmButtonText: "Sí", confirmButtonColor: "#dc2626" });
            if (r.isConfirmed) await deleteTema(t.id).unwrap().catch(() => {});
          }}
          cats={cats}
        />
      ))}

      {showForm ? (
        <div className="border border-dashed border-gray-300 rounded-lg p-3 space-y-2 bg-white">
          <Field label="Título" required>
            <input value={newForm.titulo} onChange={(e) => setNewForm((f) => ({ ...f, titulo: e.target.value }))} placeholder="¿Qué es el liderazgo?" className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Tipo">
              <select value={newForm.tipo} onChange={(e) => setNewForm((f) => ({ ...f, tipo: Number(e.target.value) }))} className={selectCls}>
                {cats.tiposTema.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </Field>
            <Field label="Duración estimada">
              <input value={newForm.duracion_estimada ?? ""} onChange={(e) => setNewForm((f) => ({ ...f, duracion_estimada: e.target.value }))} placeholder="20 min" className={inputCls} />
            </Field>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={adding || !newForm.titulo.trim()} className="px-3 py-1.5 text-xs font-medium text-white bg-[#1c2634] rounded-lg disabled:opacity-50 transition-colors">
              {adding ? "…" : "Agregar tema"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded-lg">Cancelar</button>
          </div>
        </div>
      ) : (
        <AddBtn onClick={() => setShowForm(true)} label="Agregar tema" />
      )}
    </div>
  );
}

// ── Tema Card ─────────────────────────────────────────────────

function TemaCard({ tema, isFirst, isLast, onMoveUp, onMoveDown, onDelete, cats }: {
  tema: Tema; isFirst: boolean; isLast: boolean;
  onMoveUp: () => void; onMoveDown: () => void; onDelete: () => void;
  cats: Cats;
}) {
  const [updateTema, { isLoading: saving }] = useUpdateTemaMutation();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<TemaForm>>({
    titulo: tema.titulo, duracion_estimada: tema.duracion_estimada ?? "", tipo: tema.tipo,
  });

  async function handleSave() {
    try {
      await updateTema({ id: tema.id, body: form }).unwrap();
      setEditing(false);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar." });
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-[10px] flex items-center justify-center font-bold flex-shrink-0">
          {tema.orden}
        </span>
        {editing ? (
          <div className="flex-1 space-y-2">
            <input value={form.titulo ?? ""} onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))} className={inputCls} />
            <div className="grid grid-cols-2 gap-2">
              <select value={form.tipo} onChange={(e) => setForm((f) => ({ ...f, tipo: Number(e.target.value) }))} className={selectCls}>
                {cats.tiposTema.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
              <input value={form.duracion_estimada ?? ""} onChange={(e) => setForm((f) => ({ ...f, duracion_estimada: e.target.value }))} placeholder="Duración" className={inputCls} />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="px-3 py-1 text-xs font-medium text-white bg-[#1c2634] rounded-lg disabled:opacity-50">
                {saving ? "…" : "Guardar"}
              </button>
              <button onClick={() => setEditing(false)} className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-lg">Cancelar</button>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{tema.titulo}</p>
            <p className="text-xs text-gray-400">{tema.tipo_nombre}{tema.duracion_estimada ? ` · ${tema.duracion_estimada}` : ""}</p>
          </div>
        )}
        {!editing && (
          <div className="flex items-center gap-0.5 flex-shrink-0 ml-auto">
            <IconBtn onClick={onMoveUp}><ChevronDown className="w-3 h-3 rotate-180" /></IconBtn>
            <IconBtn onClick={onMoveDown}><ChevronDown className="w-3 h-3" /></IconBtn>
            <IconBtn onClick={() => setEditing(true)}><Edit2 className="w-3 h-3" /></IconBtn>
            <IconBtn onClick={onDelete} danger><Trash2 className="w-3 h-3" /></IconBtn>
            <button onClick={() => setExpanded((v) => !v)} className="p-1 rounded hover:bg-gray-100 text-gray-400">
              {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {expanded && !editing && (
        <div className="border-t border-gray-100 bg-gray-50/40 p-3">
          <BloquesSection temaId={tema.id} cats={cats} />
        </div>
      )}
    </div>
  );
}

// ── Bloques ───────────────────────────────────────────────────

function BloquesSection({ temaId, cats }: { temaId: number; cats: Cats }) {
  const { data } = useGetBloquesByTemaQuery(temaId);
  const [createBloque, { isLoading: adding }] = useCreateBloqueMutation();
  const [updateBloque] = useUpdateBloqueMutation();
  const [deleteBloque] = useDeleteBloqueMutation();

  const [showForm, setShowForm] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<number>(cats.tiposBloque[0]?.id ?? 1);
  const [bloqueForm, setBloqueForm] = useState<Partial<BloqueForm>>({ texto: "", variante: "", items: [], filas: [], video_url: "" });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<BloqueForm>>({});
  const [editVideoFile, setEditVideoFile] = useState<File | null>(null);

  const bloques = [...(data?.results ?? [])].sort((a, b) => a.orden - b.orden);

  function tipoCodigoPorId(id: number) {
    return cats.tiposBloque.find((t) => t.id === id)?.codigo ?? "texto";
  }

  function buildPayload(base: Partial<BloqueForm> & { tema: number; tipo: number; orden: number }, file: File | null): BloqueForm | FormData {
    if (file) {
      const fd = new FormData();
      fd.append("tema", String(base.tema));
      fd.append("tipo", String(base.tipo));
      fd.append("orden", String(base.orden));
      fd.append("video_archivo", file);
      return fd;
    }
    return base as BloqueForm;
  }

  async function handleAdd() {
    const base = { tema: temaId, tipo: selectedTipo, orden: bloques.length + 1, ...bloqueForm };
    try {
      await createBloque(buildPayload(base, videoFile)).unwrap();
      setBloqueForm({ texto: "", variante: "", items: [], filas: [], video_url: "" });
      setVideoFile(null);
      setShowForm(false);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear el bloque." });
    }
  }

  async function handleSaveEdit(id: number) {
    try {
      let body: Partial<BloqueForm> | FormData = editForm;
      if (editVideoFile) {
        const fd = new FormData();
        fd.append("video_archivo", editVideoFile);
        body = fd;
      }
      await updateBloque({ id, body }).unwrap();
      setEditingId(null);
      setEditVideoFile(null);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar." });
    }
  }

  async function handleDelete(b: ContenidoBloque) {
    const r = await Swal.fire({ icon: "warning", title: "¿Eliminar bloque?", showCancelButton: true, confirmButtonText: "Sí", confirmButtonColor: "#dc2626" });
    if (r.isConfirmed) await deleteBloque(b.id).unwrap().catch(() => {});
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bloques de contenido</p>

      {bloques.map((b, idx) => {
        const BIcon = bloqueIcon(tipoCodigoPorId(b.tipo));
        return (
          <div key={b.id} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2">
              <BIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              {editingId === b.id ? (
                <div className="flex-1 space-y-2">
                  <BloqueFormFields
                    tipoCodigo={tipoCodigoPorId(b.tipo)}
                    form={editForm}
                    setForm={setEditForm}
                    onFileChange={setEditVideoFile}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleSaveEdit(b.id)} className="px-3 py-1 text-xs font-medium text-white bg-[#1c2634] rounded-lg">Guardar</button>
                    <button onClick={() => setEditingId(null)} className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-lg">Cancelar</button>
                  </div>
                </div>
              ) : (
                <p className="flex-1 text-xs text-gray-600 truncate">{bloquePreview(b)}</p>
              )}
              {editingId !== b.id && (
                <div className="flex items-center gap-0.5 flex-shrink-0 ml-auto">
                  <IconBtn onClick={() => swapOrden(b, bloques[idx - 1], updateBloque)}><ChevronDown className="w-3 h-3 rotate-180" /></IconBtn>
                  <IconBtn onClick={() => swapOrden(b, bloques[idx + 1], updateBloque)}><ChevronDown className="w-3 h-3" /></IconBtn>
                  <IconBtn onClick={() => { setEditingId(b.id); setEditForm({ texto: b.texto ?? "", variante: b.variante ?? "", items: b.items ?? [], filas: b.filas ?? [], video_url: b.video_url ?? "" }); }}>
                    <Edit2 className="w-3 h-3" />
                  </IconBtn>
                  <IconBtn onClick={() => handleDelete(b)} danger><Trash2 className="w-3 h-3" /></IconBtn>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {showForm ? (
        <div className="border border-dashed border-gray-300 rounded-lg p-3 space-y-3 bg-white">
          <Field label="Tipo de bloque">
            <select value={selectedTipo} onChange={(e) => setSelectedTipo(Number(e.target.value))} className={selectCls}>
              {cats.tiposBloque.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
          </Field>
          <BloqueFormFields tipoCodigo={tipoCodigoPorId(selectedTipo)} form={bloqueForm} setForm={setBloqueForm} onFileChange={setVideoFile} />
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={adding} className="px-3 py-1.5 text-xs font-medium text-white bg-[#1c2634] rounded-lg disabled:opacity-50">
              {adding ? "…" : "Agregar bloque"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded-lg">Cancelar</button>
          </div>
        </div>
      ) : (
        <AddBtn onClick={() => setShowForm(true)} label="Agregar bloque" />
      )}
    </div>
  );
}

// ── Bloque Form Fields (dinámico por tipo) ────────────────────

function BloqueFormFields({ tipoCodigo, form, setForm, onFileChange }: {
  tipoCodigo: string;
  form: Partial<BloqueForm>;
  setForm: React.Dispatch<React.SetStateAction<Partial<BloqueForm>>>;
  onFileChange?: (f: File | null) => void;
}) {
  const [newItem, setNewItem] = useState("");
  const [videoMode, setVideoMode] = useState<"url" | "archivo">("url");

  switch (tipoCodigo) {
    case "callout":
    case "alerta":
      return (
        <div className="space-y-2">
          <textarea value={form.texto ?? ""} onChange={(e) => setForm((f) => ({ ...f, texto: e.target.value }))} placeholder="Texto del callout…" rows={2} className={inputCls + " resize-none"} />
          <select value={form.variante ?? "info"} onChange={(e) => setForm((f) => ({ ...f, variante: e.target.value }))} className={selectCls}>
            <option value="info">Info</option>
            <option value="warning">Advertencia</option>
            <option value="success">Éxito</option>
            <option value="danger">Peligro</option>
          </select>
        </div>
      );

    case "lista":
    case "pasos":
      return (
        <div className="space-y-2">
          <div className="space-y-1.5">
            {(form.items ?? []).map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="flex-1 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded px-2 py-1">{item}</span>
                <IconBtn onClick={() => setForm((f) => ({ ...f, items: (f.items ?? []).filter((_, j) => j !== i) }))} danger>
                  <X className="w-3 h-3" />
                </IconBtn>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Nuevo ítem…" className={inputCls}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (newItem.trim()) { setForm((f) => ({ ...f, items: [...(f.items ?? []), newItem.trim()] })); setNewItem(""); } } }}
            />
            <button type="button" onClick={() => { if (newItem.trim()) { setForm((f) => ({ ...f, items: [...(f.items ?? []), newItem.trim()] })); setNewItem(""); } }}
              className="px-3 py-2 text-xs font-medium text-white bg-[#1c2634] rounded-lg flex-shrink-0">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );

    case "tabla":
      return (
        <div className="space-y-2">
          {(form.filas ?? []).map((row, i) => (
            <div key={i} className="flex gap-2">
              <input value={row.columna1 ?? ""} onChange={(e) => setForm((f) => ({ ...f, filas: (f.filas ?? []).map((r, j) => j === i ? { ...r, columna1: e.target.value } : r) }))} placeholder="Columna 1" className={inputCls} />
              <input value={row.columna2 ?? ""} onChange={(e) => setForm((f) => ({ ...f, filas: (f.filas ?? []).map((r, j) => j === i ? { ...r, columna2: e.target.value } : r) }))} placeholder="Columna 2" className={inputCls} />
              <IconBtn onClick={() => setForm((f) => ({ ...f, filas: (f.filas ?? []).filter((_, j) => j !== i) }))} danger>
                <X className="w-3 h-3" />
              </IconBtn>
            </div>
          ))}
          <button type="button" onClick={() => setForm((f) => ({ ...f, filas: [...(f.filas ?? []), { columna1: "", columna2: "" }] }))}
            className="text-xs text-[#0056D2] hover:underline">+ Agregar fila</button>
        </div>
      );

    case "video":
      return (
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setVideoMode("url"); onFileChange?.(null); }}
              className={`px-3 py-1 text-xs rounded-lg border transition-colors ${videoMode === "url" ? "bg-[#1c2634] text-white border-[#1c2634]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
            >
              URL
            </button>
            <button
              type="button"
              onClick={() => { setVideoMode("archivo"); setForm((f) => ({ ...f, video_url: "" })); }}
              className={`px-3 py-1 text-xs rounded-lg border transition-colors ${videoMode === "archivo" ? "bg-[#1c2634] text-white border-[#1c2634]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
            >
              Archivo
            </button>
          </div>
          {videoMode === "url" ? (
            <input
              value={form.video_url ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=…"
              className={inputCls}
            />
          ) : (
            <input
              type="file"
              accept="video/*"
              onChange={(e) => onFileChange?.(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#F0F6FF] file:text-[#0056D2] hover:file:bg-[#e0edff] file:transition-colors"
            />
          )}
        </div>
      );

    default: // texto / párrafo
      return (
        <textarea value={form.texto ?? ""} onChange={(e) => setForm((f) => ({ ...f, texto: e.target.value }))} placeholder="Contenido del párrafo…" rows={3} className={inputCls + " resize-none"} />
      );
  }
}

// ── Evaluación por Módulo ─────────────────────────────────────

function EvaluacionModuloSection({ moduloId, cats }: { moduloId: number; cats: Cats }) {
  const { data } = useGetEvaluacionesByModuloQuery(moduloId);
  const [createEval, { isLoading: creating }] = useCreateEvaluacionMutation();
  const [deleteEval] = useDeleteEvaluacionMutation();

  const evals = data?.results ?? [];
  const eval0 = evals[0] ?? null;

  async function handleCreate() {
    try {
      await createEval({
        titulo: "Evaluación del módulo",
        tipo: cats.tiposEvaluacion[0]?.id ?? 1,
        puntaje_minimo: "70.00",
        modulo: moduloId,
        activo: true,
      }).unwrap();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear la evaluación." });
    }
  }

  async function handleDelete() {
    if (!eval0) return;
    const r = await Swal.fire({ icon: "warning", title: "¿Eliminar evaluación?", showCancelButton: true, confirmButtonText: "Sí", confirmButtonColor: "#dc2626" });
    if (r.isConfirmed) await deleteEval(eval0.id).unwrap().catch(() => {});
  }

  return (
    <div className="space-y-2 border-t border-gray-200 pt-3 mt-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Evaluación del módulo</p>
        {eval0 && <IconBtn onClick={handleDelete} danger><Trash2 className="w-3.5 h-3.5" /></IconBtn>}
      </div>
      {eval0 ? (
        <EvaluacionEditor evaluacion={eval0} />
      ) : (
        <button onClick={handleCreate} disabled={creating} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0056D2] bg-[#F0F6FF] rounded-lg hover:bg-[#e0edff] disabled:opacity-50 transition-colors">
          <Plus className="w-3.5 h-3.5" />
          {creating ? "Creando…" : "Crear evaluación"}
        </button>
      )}
    </div>
  );
}

// ── Evaluación Final del Curso ────────────────────────────────

function EvaluacionFinalSection({ cursoId, cats }: { cursoId: number; cats: Cats }) {
  const { data } = useGetEvaluacionesByCursoQuery(cursoId);
  const [createEval, { isLoading: creating }] = useCreateEvaluacionMutation();
  const [deleteEval] = useDeleteEvaluacionMutation();

  const evals = data?.results ?? [];
  const eval0 = evals[0] ?? null;

  async function handleCreate() {
    try {
      await createEval({
        titulo: "Evaluación final",
        tipo: cats.tiposEvaluacion[cats.tiposEvaluacion.length - 1]?.id ?? 1,
        puntaje_minimo: "80.00",
        curso: cursoId,
        activo: true,
      }).unwrap();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear la evaluación." });
    }
  }

  async function handleDelete() {
    if (!eval0) return;
    const r = await Swal.fire({ icon: "warning", title: "¿Eliminar evaluación final?", showCancelButton: true, confirmButtonText: "Sí", confirmButtonColor: "#dc2626" });
    if (r.isConfirmed) await deleteEval(eval0.id).unwrap().catch(() => {});
  }

  return (
    <SectionCard title="Evaluación Final" icon={ClipboardList}>
      {eval0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">{eval0.titulo} <span className="text-xs text-gray-400">· puntaje mínimo {eval0.puntaje_minimo}</span></p>
            <IconBtn onClick={handleDelete} danger><Trash2 className="w-3.5 h-3.5" /></IconBtn>
          </div>
          <EvaluacionEditor evaluacion={eval0} />
        </div>
      ) : (
        <button onClick={handleCreate} disabled={creating} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0056D2] bg-[#F0F6FF] rounded-lg hover:bg-[#e0edff] disabled:opacity-50 transition-colors">
          <Plus className="w-3.5 h-3.5" />
          {creating ? "Creando…" : "Crear evaluación final"}
        </button>
      )}
    </SectionCard>
  );
}

// ── Evaluación Editor ─────────────────────────────────────────

function EvaluacionEditor({ evaluacion }: { evaluacion: Evaluacion }) {
  const { data } = useGetPreguntasByEvaluacionQuery(evaluacion.id);
  const [createPregunta, { isLoading: adding }] = useCreatePreguntaMutation();
  const [deletePregunta] = useDeletePreguntaMutation();
  const [updatePregunta] = useUpdatePreguntaMutation();

  const [showForm, setShowForm] = useState(false);
  const [newTexto, setNewTexto] = useState("");

  const preguntas = [...(data?.results ?? [])].sort((a, b) => a.orden - b.orden);

  async function handleAdd() {
    if (!newTexto.trim()) return;
    try {
      await createPregunta({ evaluacion: evaluacion.id, texto: newTexto.trim(), orden: preguntas.length + 1, activo: true }).unwrap();
      setNewTexto("");
      setShowForm(false);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo agregar la pregunta." });
    }
  }

  return (
    <div className="space-y-2">
      {preguntas.map((p, idx) => (
        <PreguntaCard
          key={p.id} pregunta={p}
          isFirst={idx === 0} isLast={idx === preguntas.length - 1}
          onMoveUp={() => swapOrden(p, preguntas[idx - 1], updatePregunta)}
          onMoveDown={() => swapOrden(p, preguntas[idx + 1], updatePregunta)}
          onDelete={async () => {
            const r = await Swal.fire({ icon: "warning", title: "¿Eliminar pregunta?", showCancelButton: true, confirmButtonText: "Sí", confirmButtonColor: "#dc2626" });
            if (r.isConfirmed) await deletePregunta(p.id).unwrap().catch(() => {});
          }}
        />
      ))}

      {showForm ? (
        <div className="border border-dashed border-gray-300 rounded-lg p-3 space-y-2 bg-white">
          <textarea value={newTexto} onChange={(e) => setNewTexto(e.target.value)} placeholder="¿Cuál es la principal diferencia entre un líder y un jefe?" rows={2} className={inputCls + " resize-none"} />
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={adding || !newTexto.trim()} className="px-3 py-1.5 text-xs font-medium text-white bg-[#1c2634] rounded-lg disabled:opacity-50">{adding ? "…" : "Agregar pregunta"}</button>
            <button onClick={() => setShowForm(false)} className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded-lg">Cancelar</button>
          </div>
        </div>
      ) : (
        <AddBtn onClick={() => setShowForm(true)} label="Agregar pregunta" />
      )}
    </div>
  );
}

// ── Pregunta Card ─────────────────────────────────────────────

function PreguntaCard({ pregunta, isFirst, isLast, onMoveUp, onMoveDown, onDelete }: {
  pregunta: Pregunta; isFirst: boolean; isLast: boolean;
  onMoveUp: () => void; onMoveDown: () => void; onDelete: () => void;
}) {
  const { data } = useGetOpcionesByPreguntaQuery(pregunta.id);
  const [createOpcion, { isLoading: addingOpt }] = useCreateOpcionMutation();
  const [updateOpcion] = useUpdateOpcionMutation();
  const [deleteOpcion] = useDeleteOpcionMutation();

  const [showOptForm, setShowOptForm] = useState(false);
  const [newOpt, setNewOpt] = useState("");
  const [newCorrect, setNewCorrect] = useState(false);

  const opciones = [...(data?.results ?? [])].sort((a, b) => a.orden - b.orden);

  async function handleAddOpt() {
    if (!newOpt.trim()) return;
    try {
      await createOpcion({ pregunta: pregunta.id, texto: newOpt.trim(), orden: opciones.length + 1, es_correcta: newCorrect }).unwrap();
      setNewOpt(""); setNewCorrect(false); setShowOptForm(false);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo agregar la opción." });
    }
  }

  async function toggleCorrect(opt: OpcionPregunta) {
    await updateOpcion({ id: opt.id, body: { es_correcta: !opt.es_correcta } }).unwrap().catch(() => {});
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-white p-3 space-y-2">
      <div className="flex items-start gap-2 justify-between">
        <p className="text-sm font-medium text-gray-800 flex-1">{pregunta.texto}</p>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <IconBtn onClick={onMoveUp}><ChevronDown className="w-3 h-3 rotate-180" /></IconBtn>
          <IconBtn onClick={onMoveDown}><ChevronDown className="w-3 h-3" /></IconBtn>
          <IconBtn onClick={onDelete} danger><Trash2 className="w-3 h-3" /></IconBtn>
        </div>
      </div>

      {/* Opciones */}
      <div className="space-y-1.5 pl-2">
        {opciones.map((opt) => (
          <div key={opt.id} className="flex items-center gap-2">
            <button onClick={() => toggleCorrect(opt)} className="flex-shrink-0" title="Marcar como correcta">
              {opt.es_correcta
                ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                : <Circle className="w-4 h-4 text-gray-300" />}
            </button>
            <span className="flex-1 text-xs text-gray-700">{opt.texto}</span>
            <IconBtn onClick={() => deleteOpcion(opt.id).unwrap().catch(() => {})} danger>
              <X className="w-3 h-3" />
            </IconBtn>
          </div>
        ))}

        {showOptForm ? (
          <div className="flex items-center gap-2 mt-1">
            <button onClick={() => setNewCorrect((v) => !v)} type="button">
              {newCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-gray-300" />}
            </button>
            <input value={newOpt} onChange={(e) => setNewOpt(e.target.value)} placeholder="Texto de la opción…" className={inputCls}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddOpt(); } }} />
            <button onClick={handleAddOpt} disabled={addingOpt || !newOpt.trim()} className="p-1.5 rounded bg-[#1c2634] text-white disabled:opacity-50"><Check className="w-3 h-3" /></button>
            <button onClick={() => setShowOptForm(false)} className="p-1.5 rounded bg-gray-100 text-gray-600"><X className="w-3 h-3" /></button>
          </div>
        ) : (
          <button onClick={() => setShowOptForm(true)} className="text-xs text-[#0056D2] hover:underline ml-6">+ Agregar opción</button>
        )}
      </div>
    </div>
  );
}

// ── Competencias del Curso ────────────────────────────────────

function CompetenciasSection({ cursoId, cats }: { cursoId: number; cats: Cats }) {
  const { data: asocs } = useGetCompetenciasCursoQuery(cursoId);
  const [createAsoc, { isLoading: adding }] = useCreateCompetenciaCursoMutation();
  const [deleteAsoc] = useDeleteCompetenciaCursoMutation();

  const [showForm, setShowForm] = useState(false);
  const [compId, setCompId] = useState<number>(0);
  const [nivelId, setNivelId] = useState<number>(0);

  const lista = asocs?.results ?? [];
  const linkedIds = lista.map((a) => a.competencia);
  const disponibles = cats.competencias.filter((c) => !linkedIds.includes(c.id));

  async function handleAdd() {
    if (!compId || !nivelId) return;
    try {
      await createAsoc({ competencia: compId, curso: cursoId, nivel: nivelId }).unwrap();
      setCompId(0); setNivelId(0); setShowForm(false);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo vincular la competencia." });
    }
  }

  return (
    <SectionCard title="Competencias del Curso" icon={Zap}>
      <div className="space-y-3">
        {lista.length > 0 && (
          <ul className="space-y-2">
            {lista.map((item) => (
              <li key={item.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.competencia_nombre}</p>
                  <p className="text-xs text-gray-400">{item.nivel_nombre}</p>
                </div>
                <IconBtn onClick={async () => {
                  const r = await Swal.fire({ icon: "warning", title: "¿Quitar competencia?", showCancelButton: true, confirmButtonText: "Sí", confirmButtonColor: "#dc2626" });
                  if (r.isConfirmed) await deleteAsoc(item.id).unwrap().catch(() => {});
                }} danger>
                  <Trash2 className="w-3.5 h-3.5" />
                </IconBtn>
              </li>
            ))}
          </ul>
        )}

        {showForm ? (
          <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
            <p className="text-sm font-medium text-gray-700">Vincular competencia</p>
            <Field label="Competencia">
              <select value={compId} onChange={(e) => setCompId(Number(e.target.value))} className={selectCls}>
                <option value={0}>Seleccionar competencia…</option>
                {disponibles.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </Field>
            <Field label="Nivel que desarrolla">
              <select value={nivelId} onChange={(e) => setNivelId(Number(e.target.value))} className={selectCls}>
                <option value={0}>Seleccionar nivel…</option>
                {cats.nivelesComp.map((n) => <option key={n.id} value={n.id}>{n.nombre}</option>)}
              </select>
            </Field>
            <div className="flex gap-2">
              <button onClick={handleAdd} disabled={!compId || !nivelId || adding} className="flex-1 py-2 text-sm font-medium text-white bg-[#1c2634] rounded-lg disabled:opacity-50 transition-colors">
                {adding ? "Vinculando…" : "Vincular"}
              </button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancelar</button>
            </div>
          </div>
        ) : (
          disponibles.length > 0
            ? <AddBtn onClick={() => setShowForm(true)} label="Vincular competencia" />
            : lista.length === 0
              ? <p className="text-sm text-gray-400">No hay competencias disponibles para vincular</p>
              : null
        )}
      </div>
    </SectionCard>
  );
}