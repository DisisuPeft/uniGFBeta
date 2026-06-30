"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Layers, Edit2, Trash2, Plus, ShieldCheck } from "lucide-react";
import Swal from "sweetalert2";
import { DataTable, StatusBadge } from "@/app/utils/data-table";
import { ColumnDef } from "@tanstack/react-table";
import ConfigDrawer from "./config-drawer";
import {
  useGetPestanasQuery,
  useCreatePestanaMutation,
  useUpdatePestanaMutation,
  useDeletePestanaMutation,
  useGetModulosNavQuery,
  useGetPermisosQuery,
} from "@/redux/features/sistema/sistemaApiSlice";
import {
  Pestana,
  PestanaForm,
  Permiso,
} from "@/redux/features/types/sistema/types";

const FORM_ID = "pestana-form";
const EMPTY: PestanaForm = {
  nombre: "",
  modulo: 0,
  href: "",
  icon: "",
  icon_path: "",
  orden: 1,
  status: 1,
  permission: [],
};

const PAGE_SIZE = 10;

export default function PestanasView() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");

  const { data, isLoading } = useGetPestanasQuery({ page });
  const { data: modulos } = useGetModulosNavQuery();
  const { data: permisos } = useGetPermisosQuery();
  const [create, { isLoading: creating }] = useCreatePestanaMutation();
  const [update, { isLoading: updating }] = useUpdatePestanaMutation();
  const [remove] = useDeletePestanaMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Pestana | null>(null);
  const [form, setForm] = useState<PestanaForm>(EMPTY);

  const isEditing = !!selected;
  const isSaving = creating || updating;

  function openCreate() {
    setSelected(null);
    setForm(EMPTY);
    setDrawerOpen(true);
  }
  function openEdit(p: Pestana) {
    setSelected(p);
    setForm({
      nombre: p.nombre,
      modulo: p.modulo,
      href: p.href,
      icon: p.icon,
      icon_path: p.icon_path,
      orden: p.orden,
      status: p.status,
      permission: [...p.permission],
    });
    setDrawerOpen(true);
  }
  function closeDrawer() {
    setDrawerOpen(false);
    setSelected(null);
    setForm(EMPTY);
  }

  function togglePermiso(id: number) {
    setForm((f) => {
      const current = f.permission ?? [];
      return {
        ...f,
        permission: current.includes(id)
          ? current.filter((x) => x !== id)
          : [...current, id],
      };
    });
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    try {
      if (isEditing) {
        await update({ id: selected!.id, body: form }).unwrap();
        Swal.fire({
          icon: "success",
          title: "Pestaña actualizada",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await create(form).unwrap();
        Swal.fire({
          icon: "success",
          title: "Pestaña creada",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      closeDrawer();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar." });
    }
  }

  async function handleDelete(p: Pestana) {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar pestaña?",
      text: `"${p.nombre}" dejará de aparecer en el sidebar.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    try {
      await remove(p.id).unwrap();
      Swal.fire({
        icon: "success",
        title: "Eliminada",
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

  const columns: ColumnDef<Pestana>[] = [
    {
      id: "pestana",
      header: "Pestaña",
      cell: ({ row: { original: p } }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{p.nombre}</p>
          <p className="text-xs text-gray-400 font-mono">{p.href}</p>
        </div>
      ),
    },
    {
      id: "modulo",
      header: "Módulo",
      cell: ({ row: { original: p } }) => {
        const mod = (modulos?.results ?? []).find((m) => m.id === p.modulo);
        return mod ? (
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: mod.bgColor + "20", color: mod.bgColor }}
          >
            {mod.nombre}
          </span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        );
      },
    },
    {
      id: "permisos",
      header: "Permisos",
      cell: ({ row: { original: p } }) => (
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-sm text-gray-600">{p.permission.length}</span>
        </div>
      ),
    },
    {
      id: "orden",
      header: "Orden",
      cell: ({ row: { original: p } }) => (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
          {p.orden}
        </span>
      ),
    },
    {
      id: "status",
      header: "Estado",
      cell: ({ row: { original: p } }) => <StatusBadge status={p.status} />,
    },
    {
      id: "acciones",
      header: "",
      cell: ({ row: { original: p } }) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => openEdit(p)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Edit2 className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => handleDelete(p)}
            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      ),
    },
  ];

  // Agrupar permisos por app_label para el selector
  const permisosByApp = (permisos ?? []).reduce<Record<string, Permiso[]>>(
    (acc, p) => {
      (acc[p.app_label] ??= []).push(p);
      return acc;
    },
    {},
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Pestañas de navegación
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Sub-secciones de cada módulo en el sidebar
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#1c2634] text-white text-sm font-medium rounded-lg hover:bg-[#1c2634]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva pestaña
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 w-fit">
        <div className="w-10 h-10 bg-[#F0F6FF] rounded-lg flex items-center justify-center">
          <Layers className="w-5 h-5 text-[#0056D2]" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{data?.count ?? 0}</p>
          <p className="text-xs text-gray-500">Total pestañas</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        count={data?.count ?? 0}
        pageSize={PAGE_SIZE}
        emptyIcon={Layers}
        emptyMessage="No hay pestañas registradas"
      />

      <ConfigDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={isEditing ? "Editar pestaña" : "Nueva pestaña"}
        formId={FORM_ID}
        isLoading={isSaving}
      >
        <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
          <Field label="Módulo" required>
            <select
              required
              value={form.modulo || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, modulo: Number(e.target.value) }))
              }
              className={inputCls}
            >
              <option value="">Seleccionar módulo…</option>
              {(modulos?.results ?? []).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Nombre" required>
            <input
              required
              value={form.nombre}
              onChange={(e) =>
                setForm((f) => ({ ...f, nombre: e.target.value }))
              }
              placeholder="Empresas"
              className={inputCls}
            />
          </Field>

          <Field label="URL (href)" required>
            <input
              required
              value={form.href}
              onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
              placeholder="/configuracion/empresas"
              className={inputCls}
            />
          </Field>

          <Field label="Nombre del ícono (Lucide)">
            <input
              value={form.icon ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              placeholder="Building2"
              className={inputCls}
            />
          </Field>

          <Field label="SVG path del ícono">
            <textarea
              value={form.icon_path ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, icon_path: e.target.value }))
              }
              placeholder="M12 2..."
              rows={2}
              className={inputCls + " resize-none font-mono text-xs"}
            />
          </Field>

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

          {/* Permisos */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Permisos requeridos
              <span className="ml-1.5 text-xs font-normal text-gray-400">
                (el usuario necesita al menos uno)
              </span>
            </label>
            {(permisos?.length ?? 0) === 0 ? (
              <p className="text-xs text-gray-400 italic">Cargando permisos…</p>
            ) : (
              <div className="space-y-3 max-h-56 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {Object.entries(permisosByApp).map(([app, items]) => (
                  <div key={app}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                      {app}
                    </p>
                    <div className="space-y-1">
                      {items.map((perm) => (
                        <label
                          key={perm.id}
                          className="flex items-center gap-2.5 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={
                              form.permission?.includes(perm.id) ?? false
                            }
                            onChange={() => togglePermiso(perm.id)}
                            className="w-4 h-4 rounded border-gray-300 text-[#0056D2] focus:ring-[#0056D2]/30"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            {perm.name}
                          </span>
                          <span className="text-xs text-gray-400 font-mono ml-auto">
                            {perm.codename}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {(form.permission?.length ?? 0) > 0 && (
              <p className="text-xs text-[#0056D2] mt-1.5">
                {form.permission!.length} permiso(s) seleccionado(s)
              </p>
            )}
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
