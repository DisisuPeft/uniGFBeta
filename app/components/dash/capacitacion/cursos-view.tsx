"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Edit2, Trash2, Plus, Clock, BookMarked } from "lucide-react";
import Swal from "sweetalert2";
import { DataTable } from "@/app/utils/data-table";
import { ColumnDef } from "@tanstack/react-table";
import ConfigDrawer from "../configuracion/config-drawer";
import { ActiveBadge } from "../configuracion/departamentos-view";
import {
  useGetCursosQuery,
  useCreateCursoMutation,
  useUpdateCursoMutation,
  useDeleteCursoMutation,
} from "@/redux/features/capacitacion/capacitacionApiSlice";
import { useGetStatusCursoQuery } from "@/redux/features/catalogos/genericosApiSlice";
import { Curso, CursoForm } from "@/redux/features/types/capacitacion/types";

const FORM_ID = "curso-form";
const EMPTY: CursoForm = {
  titulo: "",
  descripcion: "",
  duracion_horas: "0.00",
  status: 1,
  activo: true,
};

const STATUS_CLS: Record<string, string> = {
  borrador: "bg-gray-100 text-gray-600",
  publicado: "bg-emerald-50 text-emerald-700",
  archivado: "bg-red-50 text-red-600",
};

export default function CursosCapacitacionView() {
  const router = useRouter();
  const { data, isLoading } = useGetCursosQuery();
  const { data: statusList } = useGetStatusCursoQuery();
  const [create, { isLoading: creating }] = useCreateCursoMutation();
  const [update, { isLoading: updating }] = useUpdateCursoMutation();
  const [remove] = useDeleteCursoMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Curso | null>(null);
  const [form, setForm] = useState<CursoForm>(EMPTY);

  const isEditing = !!selected;
  const isSaving = creating || updating;

  function openCreate() {
    setSelected(null);
    setForm({ ...EMPTY, status: statusList?.results?.[0]?.id ?? 1 });
    setDrawerOpen(true);
  }
  function openEdit(c: Curso) {
    setSelected(c);
    setForm({
      titulo: c.titulo,
      descripcion: c.descripcion ?? "",
      duracion_horas: c.duracion_horas,
      status: c.status,
      activo: c.activo,
    });
    setDrawerOpen(true);
  }
  function closeDrawer() {
    setDrawerOpen(false);
    setSelected(null);
    setForm(EMPTY);
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    try {
      if (isEditing) {
        await update({ id: selected!.id, body: form }).unwrap();
        Swal.fire({ icon: "success", title: "Curso actualizado", timer: 1500, showConfirmButton: false });
        closeDrawer();
      } else {
        const newCurso = await create(form).unwrap();
        closeDrawer();
        router.push(`/dashboard/capacitacion/cursos/${newCurso.id}`);
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar." });
    }
  }

  async function handleDelete(c: Curso) {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar curso?",
      text: `"${c.titulo}" será eliminado.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    try {
      await remove(c.id).unwrap();
      Swal.fire({ icon: "success", title: "Eliminado", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar." });
    }
  }

  const columns: ColumnDef<Curso>[] = [
    {
      id: "titulo",
      header: "Curso",
      cell: ({ row: { original: c } }) => (
        <div className="max-w-xs">
          <p className="text-sm font-medium text-gray-900 line-clamp-1">{c.titulo}</p>
          <p className="text-xs text-gray-400 line-clamp-1">{c.descripcion ?? "Sin descripción"}</p>
        </div>
      ),
    },
    {
      id: "status",
      header: "Estado",
      cell: ({ row: { original: c } }) => {
        const cls = STATUS_CLS[c.status_nombre?.toLowerCase()] ?? "bg-gray-100 text-gray-600";
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
            {c.status_nombre}
          </span>
        );
      },
    },
    {
      id: "duracion",
      header: "Duración",
      cell: ({ row: { original: c } }) => (
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
          {c.duracion_horas} hrs
        </div>
      ),
    },
    {
      id: "activo",
      header: "Activo",
      cell: ({ row: { original: c } }) => <ActiveBadge activo={c.activo} />,
    },
    {
      id: "acciones",
      header: "",
      cell: ({ row: { original: c } }) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => router.push(`/dashboard/capacitacion/cursos/${c.id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0056D2] bg-[#F0F6FF] rounded-lg hover:bg-[#e0edff] transition-colors"
          >
            <BookMarked className="w-3.5 h-3.5" />
            Editor
          </button>
          <button
            onClick={() => openEdit(c)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Edit2 className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => handleDelete(c)}
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Cursos de Capacitación</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Catálogo de cursos disponibles para la organización
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#1c2634] text-white text-sm font-medium rounded-lg hover:bg-[#1c2634]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo curso
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 w-fit">
        <div className="w-10 h-10 bg-[#F0F6FF] rounded-lg flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-[#0056D2]" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{data?.count ?? 0}</p>
          <p className="text-xs text-gray-500">Total cursos</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        count={data?.count ?? 0}
        pageSize={100}
        filters={[{ type: "search", key: "search", placeholder: "Buscar curso…" }]}
        emptyIcon={BookOpen}
        emptyMessage="No hay cursos registrados"
      />

      <ConfigDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={isEditing ? "Editar curso" : "Nuevo curso"}
        formId={FORM_ID}
        isLoading={isSaving}
      >
        <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
          <Field label="Título" required>
            <input
              required
              value={form.titulo}
              onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
              placeholder="Gestión de Equipos de Alto Rendimiento"
              className={inputCls}
            />
          </Field>
          <Field label="Descripción">
            <textarea
              value={form.descripcion ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
              placeholder="Breve descripción del curso…"
              rows={3}
              className={inputCls + " resize-none"}
            />
          </Field>
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
              className={inputCls}
            >
              {statusList?.results?.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </Field>
          <Field label="Activo">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, activo: !f.activo }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.activo ? "bg-emerald-500" : "bg-gray-300"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.activo ? "translate-x-6" : "translate-x-1"}`} />
              </button>
              <span className="text-sm text-gray-600">{form.activo ? "Activo" : "Inactivo"}</span>
            </div>
          </Field>
        </form>
      </ConfigDrawer>
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2]/20 transition-colors placeholder:text-gray-400 bg-white";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}