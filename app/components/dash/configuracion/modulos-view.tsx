"use client";

import { useState } from "react";
import { Box, Edit2, Trash2, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { DataTable, StatusBadge } from "@/app/utils/data-table";
import { ColumnDef } from "@tanstack/react-table";
import ConfigDrawer from "./config-drawer";
import {
  useGetModulosNavQuery,
  useCreateModuloNavMutation,
  useUpdateModuloNavMutation,
  useDeleteModuloNavMutation,
} from "@/redux/features/sistema/sistemaApiSlice";
import { ModuloNav, ModuloNavForm } from "@/redux/features/types/sistema/types";

const FORM_ID = "modulo-form";
const EMPTY: ModuloNavForm = {
  nombre: "",
  href: "",
  icon: "",
  icon_path: "",
  bgColor: "#1e293b",
  textColor: "#f8fafc",
  orden: 1,
  status: 1,
};

export default function ModulosNavView() {
  const { data, isLoading } = useGetModulosNavQuery();
  const [create, { isLoading: creating }] = useCreateModuloNavMutation();
  const [update, { isLoading: updating }] = useUpdateModuloNavMutation();
  const [remove] = useDeleteModuloNavMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<ModuloNav | null>(null);
  const [form, setForm] = useState<ModuloNavForm>(EMPTY);

  const isEditing = !!selected;
  const isSaving = creating || updating;

  function openCreate() {
    setSelected(null);
    setForm(EMPTY);
    setDrawerOpen(true);
  }
  function openEdit(m: ModuloNav) {
    setSelected(m);
    setForm({
      nombre: m.nombre,
      href: m.href,
      icon: m.icon,
      icon_path: m.icon_path,
      bgColor: m.bgColor,
      textColor: m.textColor,
      orden: m.orden,
      status: m.status,
    });
    setDrawerOpen(true);
  }
  function closeDrawer() {
    setDrawerOpen(false);
    setSelected(null);
    setForm(EMPTY);
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    try {
      if (isEditing) {
        await update({ id: selected!.id, body: form }).unwrap();
        Swal.fire({
          icon: "success",
          title: "Módulo actualizado",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await create(form).unwrap();
        Swal.fire({
          icon: "success",
          title: "Módulo creado",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      closeDrawer();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar." });
    }
  }

  async function handleDelete(m: ModuloNav) {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar módulo?",
      text: `"${m.nombre}" y todas sus pestañas se eliminarán.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    try {
      await remove(m.id).unwrap();
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

  const columns: ColumnDef<ModuloNav>[] = [
    {
      id: "modulo",
      header: "Módulo",
      cell: ({ row: { original: m } }) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: m.bgColor }}
          >
            <span className="text-xs font-bold" style={{ color: m.textColor }}>
              {m.nombre.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{m.nombre}</p>
            <p className="text-xs text-gray-400 font-mono">{m.href}</p>
          </div>
        </div>
      ),
    },
    {
      id: "icon",
      header: "Icono",
      cell: ({ row: { original: m } }) => (
        <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">
          {m.icon || "—"}
        </span>
      ),
    },
    {
      id: "orden",
      header: "Orden",
      cell: ({ row: { original: m } }) => (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
          {m.orden}
        </span>
      ),
    },
    {
      id: "pestanias",
      header: "Pestañas",
      cell: ({ row: { original: m } }) => (
        <span className="text-sm text-gray-600">
          {m.pestanias?.length ?? 0}
        </span>
      ),
    },
    {
      id: "status",
      header: "Estado",
      cell: ({ row: { original: m } }) => <StatusBadge status={m.status} />,
    },
    {
      id: "acciones",
      header: "",
      cell: ({ row: { original: m } }) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => openEdit(m)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Edit2 className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => handleDelete(m)}
            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header section with bottom border to anchor it */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Módulos de navegación</h1>
          <p className="text-sm text-gray-500 mt-1">
            Secciones del sidebar del panel de administración
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#0056D2] text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-[#0047b3] hover:shadow transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Nuevo módulo
        </button>
      </div>

      {/* Stat Card with elegant crisp shadow */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-5 w-fit">
        <div className="w-12 h-12 bg-blue-50/80 rounded-lg flex items-center justify-center border border-blue-100/50">
          <Box className="w-6 h-6 text-[#0056D2]" />
        </div>
        <div>
          <p className="text-3xl font-bold tracking-tight text-gray-900">{data?.count ?? 0}</p>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-0.5">Total módulos</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        count={data?.count}
        pageSize={100}
        emptyIcon={Box}
        emptyMessage="No hay módulos de navegación"
      />

      <ConfigDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={isEditing ? "Editar módulo" : "Nuevo módulo"}
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
              placeholder="Configuración"
              className={inputCls}
            />
          </Field>
          <Field label="URL (href)" required>
            <input
              required
              value={form.href}
              onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
              placeholder="/configuracion"
              className={inputCls}
            />
          </Field>
          <Field label="Nombre del ícono (Lucide)">
            <input
              value={form.icon ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              placeholder="Settings"
              className={inputCls}
            />
            <p className="text-xs text-gray-400 mt-1">
              Nombre exacto del ícono de Lucide (ej. Settings, Users, BarChart)
            </p>
          </Field>
          <Field label="SVG path del ícono">
            <textarea
              value={form.icon_path ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, icon_path: e.target.value }))
              }
              placeholder="M12 2..."
              rows={3}
              className={inputCls + " resize-none font-mono text-xs"}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Color de fondo">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.bgColor ?? "#1e293b"}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bgColor: e.target.value }))
                  }
                  className="h-9 w-12 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                />
                <input
                  value={form.bgColor ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bgColor: e.target.value }))
                  }
                  placeholder="#1e293b"
                  className={inputCls + " flex-1"}
                />
              </div>
            </Field>
            <Field label="Color de texto">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.textColor ?? "#f8fafc"}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, textColor: e.target.value }))
                  }
                  className="h-9 w-12 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                />
                <input
                  value={form.textColor ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, textColor: e.target.value }))
                  }
                  placeholder="#f8fafc"
                  className={inputCls + " flex-1"}
                />
              </div>
            </Field>
          </div>

          {/* Preview */}
          {form.nombre && (
            <div className="rounded-xl p-4 border border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-400 mb-2">Vista previa</p>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: form.bgColor, color: form.textColor }}
              >
                {form.nombre}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Orden">
              <input
                type="number"
                min={1}
                value={form.orden ?? 1}
                onChange={(e) =>
                  setForm((f) => ({ ...f, orden: Number(e.target.value) }))
                }
                className={inputCls}
              />
            </Field>
            <Field label="Estado">
              <div className="flex items-center gap-3 h-[38px]">
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, status: f.status === 1 ? 0 : 1 }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.status === 1 ? "bg-emerald-500" : "bg-gray-300"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.status === 1 ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
                <span className="text-sm text-gray-600">
                  {form.status === 1 ? "Activo" : "Inactivo"}
                </span>
              </div>
            </Field>
          </div>
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
