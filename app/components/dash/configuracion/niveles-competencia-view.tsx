"use client";

import { useState } from "react";
import { BarChart2, Edit2, Trash2, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { DataTable } from "@/app/utils/data-table";
import { ColumnDef } from "@tanstack/react-table";
import ConfigDrawer from "./config-drawer";
import {
  useGetNivelesCompetenciaQuery,
  useCreateNivelCompetenciaMutation,
  useUpdateNivelCompetenciaMutation,
  useDeleteNivelCompetenciaMutation,
} from "@/redux/features/catalogos/genericosApiSlice";
import {
  NivelCompetencia,
  NivelCompetenciaForm,
} from "@/redux/features/types/catalagos/cat";
import { ActiveBadge } from "./departamentos-view";

const FORM_ID = "nivel-competencia-form";
const EMPTY: NivelCompetenciaForm = {
  nombre: "",
  codigo: "",
  descripcion: "",
  activo: true,
  orden: 1,
};

export default function NivelesCompetenciaView() {
  const { data, isLoading } = useGetNivelesCompetenciaQuery();
  const [create, { isLoading: creating }] = useCreateNivelCompetenciaMutation();
  const [update, { isLoading: updating }] = useUpdateNivelCompetenciaMutation();
  const [remove] = useDeleteNivelCompetenciaMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<NivelCompetencia | null>(null);
  const [form, setForm] = useState<NivelCompetenciaForm>(EMPTY);

  const isEditing = !!selected;
  const isSaving = creating || updating;

  function openCreate() {
    setSelected(null);
    setForm(EMPTY);
    setDrawerOpen(true);
  }
  function openEdit(n: NivelCompetencia) {
    setSelected(n);
    setForm({
      nombre: n.nombre,
      codigo: n.codigo,
      descripcion: n.descripcion ?? "",
      activo: n.activo,
      orden: n.orden,
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
        Swal.fire({
          icon: "success",
          title: "Nivel actualizado",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await create(form).unwrap();
        Swal.fire({
          icon: "success",
          title: "Nivel creado",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      closeDrawer();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar." });
    }
  }

  async function handleDelete(n: NivelCompetencia) {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar nivel?",
      text: `"${n.nombre}" quedará desactivado.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    try {
      await remove(n.id).unwrap();
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar.",
      });
    }
  }

  const columns: ColumnDef<NivelCompetencia>[] = [
    {
      id: "nombre",
      header: "Nivel",
      cell: ({ row: { original: n } }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{n.nombre}</p>
          <p className="text-xs text-gray-400 font-mono">{n.codigo}</p>
        </div>
      ),
    },
    {
      id: "descripcion",
      header: "Descripción",
      cell: ({ row: { original: n } }) => (
        <span className="text-sm text-gray-500 line-clamp-1">
          {n.descripcion ?? "—"}
        </span>
      ),
    },
    {
      id: "activo",
      header: "Estado",
      cell: ({ row: { original: n } }) => <ActiveBadge activo={n.activo} />,
    },
    {
      id: "creado",
      header: "Creado",
      cell: ({ row: { original: n } }) => (
        <span className="text-xs text-gray-400">
          {new Date(n.creado_at).toLocaleDateString("es-MX")}
        </span>
      ),
    },
    {
      id: "acciones",
      header: "",
      cell: ({ row: { original: n } }) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => openEdit(n)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Edit2 className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => handleDelete(n)}
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
          <h1 className="text-xl font-bold text-gray-900">
            Niveles de Competencia
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Define los niveles de dominio para la asignación de competencias
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#1c2634] text-white text-sm font-medium rounded-lg hover:bg-[#1c2634]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo nivel
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 w-fit">
        <div className="w-10 h-10 bg-[#F0F6FF] rounded-lg flex items-center justify-center">
          <BarChart2 className="w-5 h-5 text-[#0056D2]" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{data?.count ?? 0}</p>
          <p className="text-xs text-gray-500">Total niveles</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        count={data?.count ?? 0}
        pageSize={100}
        filters={[
          { type: "search", key: "search", placeholder: "Buscar nivel…" },
        ]}
        emptyIcon={BarChart2}
        emptyMessage="No hay niveles registrados"
      />

      <ConfigDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={isEditing ? "Editar nivel" : "Nuevo nivel"}
        formId={FORM_ID}
        isLoading={isSaving}
      >
        <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nombre" required>
            <input
              required
              value={form.nombre}
              onChange={(e) =>
                setForm((f) => ({ ...f, nombre: e.target.value }))
              }
              placeholder="Básico, Intermedio, Avanzado…"
              className={inputCls}
            />
          </Field>
          <Field label="Código" required>
            <input
              required
              value={form.codigo}
              onChange={(e) =>
                setForm((f) => ({ ...f, codigo: e.target.value }))
              }
              placeholder="basico, intermedio, avanzado…"
              className={inputCls}
            />
          </Field>
          <Field label="Rating" required>
            <input
              required
              type="number"
              min={0}
              value={form.orden}
              onChange={(e) =>
                setForm((f) => ({ ...f, orden: e.target.valueAsNumber || 0 }))
              }
              placeholder="0 a 10"
              className={inputCls}
            />
          </Field>
          <Field label="Descripción">
            <textarea
              value={form.descripcion ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, descripcion: e.target.value }))
              }
              placeholder="Breve descripción del nivel…"
              rows={3}
              className={inputCls + " resize-none"}
            />
          </Field>
          <Field label="Estado">
            <ActiveToggle
              value={form.activo ?? true}
              onChange={(v) => setForm((f) => ({ ...f, activo: v }))}
            />
          </Field>
        </form>
      </ConfigDrawer>
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2]/20 transition-colors placeholder:text-gray-400 bg-white";

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

function ActiveToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? "bg-emerald-500" : "bg-gray-300"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
      <span className="text-sm text-gray-600">
        {value ? "Activo" : "Inactivo"}
      </span>
    </div>
  );
}
