"use client";

import { useState } from "react";
import {
  Route,
  Edit2,
  Trash2,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";
import { DataTable } from "@/app/utils/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  useGetRutasAprendizajeQuery,
  useCreateRutaAprendizajeMutation,
  useUpdateRutaAprendizajeMutation,
  useDeleteRutaAprendizajeMutation,
  useGetRutaAprendizajeQuery,
  useAddCursoToRutaMutation,
  useRemoveCursoFromRutaMutation,
} from "@/redux/features/competencias/competenciasApiSlice";
import { useGetCompetenciasQuery } from "@/redux/features/competencias/competenciasApiSlice";
import { useGetNivelesCompetenciaQuery } from "@/redux/features/catalogos/genericosApiSlice";
import { useGetCursosQuery } from "@/redux/features/capacitacion/capacitacionApiSlice";
import { RutaAprendizaje, RutaAprendizajeForm, CursoEnRuta } from "@/redux/features/types/competencias/types";
import { DynamicIcon } from "@/app/ui/icon/dynamic-icon";

const FORM_ID = "ruta-form";

const EMPTY: RutaAprendizajeForm = {
  nombre: "",
  competencia: 0,
  nivel_objetivo: 0,
};

type Tab = "info" | "cursos";

export default function RutasAprendizajeView() {
  const { data, isLoading } = useGetRutasAprendizajeQuery();
  const { data: competencias } = useGetCompetenciasQuery();
  const { data: niveles } = useGetNivelesCompetenciaQuery();
  const [create, { isLoading: creating }] = useCreateRutaAprendizajeMutation();
  const [update, { isLoading: updating }] = useUpdateRutaAprendizajeMutation();
  const [remove] = useDeleteRutaAprendizajeMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<RutaAprendizaje | null>(null);
  const [form, setForm] = useState<RutaAprendizajeForm>(EMPTY);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("info");

  const isEditing = !!selected;
  const isSaving = creating || updating;

  const listaCompetencias = competencias?.results ?? [];
  const listaNiveles = niveles?.results ?? [];

  function openCreate() {
    setSelected(null);
    setForm({
      ...EMPTY,
      competencia: listaCompetencias[0]?.id ?? 0,
      nivel_objetivo: listaNiveles[0]?.id ?? 0,
    });
    setActiveTab("info");
    setDrawerOpen(true);
  }

  function openEdit(r: RutaAprendizaje) {
    setSelected(r);
    setForm({
      nombre: r.nombre,
      competencia: r.competencia,
      nivel_objetivo: r.nivel_objetivo_id,
    });
    setActiveTab("info");
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setSelected(null);
    setForm(EMPTY);
    setActiveTab("info");
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (!form.competencia || !form.nivel_objetivo) {
      Swal.fire({ icon: "warning", title: "Completa todos los campos requeridos." });
      return;
    }
    try {
      if (isEditing) {
        await update({ id: selected!.id, body: form }).unwrap();
        Swal.fire({ icon: "success", title: "Ruta actualizada", timer: 1500, showConfirmButton: false });
      } else {
        await create(form).unwrap();
        Swal.fire({ icon: "success", title: "Ruta creada", timer: 1500, showConfirmButton: false });
      }
      closeDrawer();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar." });
    }
  }

  async function handleDelete(r: RutaAprendizaje) {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar ruta?",
      text: `"${r.nombre}" y sus cursos asociados se eliminarán.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    try {
      await remove(r.id).unwrap();
      Swal.fire({ icon: "success", title: "Eliminada", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar." });
    }
  }

  const columns: ColumnDef<RutaAprendizaje>[] = [
    {
      id: "expand",
      header: "",
      cell: ({ row: { original: r } }) => (
        <button
          onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 transition-colors"
        >
          {expandedId === r.id ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      ),
    },
    {
      id: "nombre",
      header: "Ruta",
      cell: ({ row: { original: r } }) => {
        const comp = listaCompetencias.find((c) => c.id === r.competencia);
        return (
          <div>
            <p className="text-sm font-medium text-gray-900">{r.nombre}</p>
            {comp && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <DynamicIcon iconName={comp.icono} size={11} color={comp.color} />
                <span className="text-xs text-gray-400">{comp.nombre}</span>
              </div>
            )}
            {expandedId === r.id && r.cursos.length > 0 && (
              <ul className="mt-2 space-y-1 pl-1">
                {[...r.cursos]
                  .sort((a, b) => a.orden - b.orden)
                  .map((c) => (
                    <li key={c.id} className="flex items-center gap-1.5 text-xs text-gray-500">
                      <BookOpen className="w-3 h-3 text-gray-300 flex-shrink-0" />
                      {c.curso_titulo}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        );
      },
    },
    {
      id: "nivel",
      header: "Nivel objetivo",
      cell: ({ row: { original: r } }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F0F6FF] text-[#0056D2]">
          {r.nivel_objetivo_nombre}
        </span>
      ),
    },
    {
      id: "cursos",
      header: "Cursos",
      cell: ({ row: { original: r } }) => (
        <span className="text-sm text-gray-600">{r.cursos.length}</span>
      ),
    },
    {
      id: "acciones",
      header: "",
      cell: ({ row: { original: r } }) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => openEdit(r)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Edit2 className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => handleDelete(r)}
            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Rutas de aprendizaje</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Secuencias de cursos para desarrollar una competencia
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#1c2634] text-white text-sm font-medium rounded-lg hover:bg-[#1c2634]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva ruta
        </button>
      </div>

      {/* Stat */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 w-fit">
        <div className="w-10 h-10 bg-[#F0F6FF] rounded-lg flex items-center justify-center">
          <Route className="w-5 h-5 text-[#0056D2]" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{data?.count ?? 0}</p>
          <p className="text-xs text-gray-500">Total rutas</p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        count={data?.count ?? 0}
        pageSize={20}
        emptyIcon={Route}
        emptyMessage="No hay rutas de aprendizaje registradas"
      />

      {/* Drawer */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${drawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={closeDrawer}
        />
        <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <h2 className="text-base font-semibold text-[#1c2634]">
              {isEditing ? selected?.nombre : "Nueva ruta de aprendizaje"}
            </h2>
            <button onClick={closeDrawer} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs (solo al editar) */}
          {isEditing && (
            <div className="flex gap-1 px-6 pt-3 pb-0 flex-shrink-0 border-b border-gray-100">
              {(["info", "cursos"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors -mb-px ${
                    activeTab === t
                      ? "text-[#0056D2] border-b-2 border-[#0056D2] bg-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t === "info" ? "Información" : "Cursos"}
                </button>
              ))}
            </div>
          )}

          {/* Drawer body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {activeTab === "info" || !isEditing ? (
              <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
                <Field label="Nombre" required>
                  <input
                    required
                    value={form.nombre}
                    onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                    placeholder="Ruta Liderazgo Avanzado"
                    className={inputCls}
                  />
                </Field>

                <Field label="Competencia" required>
                  <select
                    required
                    value={form.competencia || ""}
                    onChange={(e) => setForm((f) => ({ ...f, competencia: Number(e.target.value) }))}
                    className={selectCls}
                  >
                    <option value="">Seleccionar competencia…</option>
                    {listaCompetencias.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Nivel objetivo" required>
                  <select
                    required
                    value={form.nivel_objetivo || ""}
                    onChange={(e) => setForm((f) => ({ ...f, nivel_objetivo: Number(e.target.value) }))}
                    className={selectCls}
                  >
                    <option value="">Seleccionar nivel…</option>
                    {listaNiveles.map((n) => (
                      <option key={n.id} value={n.id}>{n.nombre}</option>
                    ))}
                  </select>
                </Field>
              </form>
            ) : (
              <CursosTab rutaId={selected!.id} />
            )}
          </div>

          {/* Footer: solo en tab Información */}
          {(activeTab === "info" || !isEditing) && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
              <button
                type="button"
                onClick={closeDrawer}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form={FORM_ID}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-[#1c2634] rounded-lg hover:bg-[#1c2634]/90 disabled:opacity-50 transition-colors"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tab: Cursos de la ruta ────────────────────────────────────

function CursosTab({ rutaId }: { rutaId: number }) {
  const { data: ruta, isLoading } = useGetRutaAprendizajeQuery(rutaId);
  const { data: todosLosCursos } = useGetCursosQuery();
  const [addCurso, { isLoading: adding }] = useAddCursoToRutaMutation();
  const [removeCurso] = useRemoveCursoFromRutaMutation();

  const [showForm, setShowForm] = useState(false);
  const [cursoId, setCursoId] = useState<number>(0);
  const [orden, setOrden] = useState<number>(1);

  const lista: CursoEnRuta[] = ruta
    ? [...ruta.cursos].sort((a, b) => a.orden - b.orden)
    : [];

  const linkedIds = lista.map((c) => c.curso_id);
  const disponibles = (todosLosCursos?.results ?? []).filter(
    (c) => !linkedIds.includes(c.id),
  );

  async function handleAdd() {
    if (!cursoId) return;
    try {
      await addCurso({ ruta: rutaId, curso: cursoId, orden }).unwrap();
      setCursoId(0);
      setOrden(lista.length + 2);
      setShowForm(false);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo agregar el curso." });
    }
  }

  async function handleRemove(item: CursoEnRuta) {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Quitar curso?",
      text: `Se quitará "${item.curso_titulo}" de esta ruta.`,
      showCancelButton: true,
      confirmButtonText: "Sí, quitar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    try {
      await removeCurso({ id: item.id, rutaId }).unwrap();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo quitar." });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {lista.length === 0
            ? "Ningún curso en esta ruta aún"
            : `${lista.length} curso${lista.length !== 1 ? "s" : ""} en esta ruta`}
        </p>
        {!showForm && disponibles.length > 0 && (
          <button
            onClick={() => {
              setOrden(lista.length + 1);
              setShowForm(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0056D2] bg-[#F0F6FF] rounded-lg hover:bg-[#e0edff] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar curso
          </button>
        )}
      </div>

      {/* Lista de cursos */}
      {lista.length > 0 && (
        <ul className="space-y-2">
          {lista.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-gray-200 text-[10px] font-bold text-gray-500 flex items-center justify-center flex-shrink-0">
                  {item.orden}
                </span>
                <p className="text-sm font-medium text-gray-800 truncate">
                  {item.curso_titulo}
                </p>
              </div>
              <button
                onClick={() => handleRemove(item)}
                className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500 flex-shrink-0"
                title="Quitar"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Formulario inline para agregar */}
      {showForm && (
        <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
          <p className="text-sm font-medium text-gray-700">Agregar curso</p>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Curso</label>
            <select
              value={cursoId}
              onChange={(e) => setCursoId(Number(e.target.value))}
              className={selectCls}
            >
              <option value={0}>Seleccionar curso…</option>
              {disponibles.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.titulo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Orden</label>
            <input
              type="number"
              min={1}
              value={orden}
              onChange={(e) => setOrden(Number(e.target.value))}
              className={inputCls}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleAdd}
              disabled={!cursoId || adding}
              className="flex-1 py-2 text-sm font-medium text-white bg-[#1c2634] rounded-lg hover:bg-[#1c2634]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {adding ? "Agregando…" : "Agregar"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setCursoId(0);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {lista.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5 text-gray-300" />
          </div>
          <p className="text-sm text-gray-400">
            Esta ruta no tiene cursos asignados aún
          </p>
        </div>
      )}
    </div>
  );
}

// ── helpers ───────────────────────────────────────────────────

const inputCls =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2]/20 transition-colors placeholder:text-gray-400 bg-white";

const selectCls =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2]/20 transition-colors bg-white text-gray-700";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
