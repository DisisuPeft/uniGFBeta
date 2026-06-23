"use client";

import { useState, useEffect } from "react";
import { Shield, Edit2, Trash2, Plus, Lock } from "lucide-react";
import Swal from "sweetalert2";
import { DataTable } from "@/app/utils/data-table";
import { ColumnDef } from "@tanstack/react-table";
import ConfigDrawer from "./config-drawer";
import {
  useGetRolesQuery,
  useCreateRolMutation,
  useUpdateRolMutation,
  useDeleteRolMutation,
  useGetPermisosQuery,
} from "@/redux/features/sistema/sistemaApiSlice";
import { Rol, RolForm, Permiso } from "@/redux/features/types/sistema/types";

// ── Constants ─────────────────────────────────────────────────

const FORM_ID = "rol-form";
const EMPTY: RolForm = { nombre: "", nivel_acceso: 1, permission: [] };

// ── Main view ─────────────────────────────────────────────────

export default function RolesView() {
  const { data, isLoading } = useGetRolesQuery();
  const { data: permisos = [] } = useGetPermisosQuery();
  const [create, { isLoading: creating }] = useCreateRolMutation();
  const [update, { isLoading: updating }] = useUpdateRolMutation();
  const [remove] = useDeleteRolMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Rol | null>(null);
  const [form, setForm] = useState<RolForm>(EMPTY);

  const isEditing = !!selected;
  const isSaving = creating || updating;

  useEffect(() => {
    if (!drawerOpen) {
      setForm(EMPTY);
      setSelected(null);
      return;
    }
    if (selected) {
      // console.log(selected);
      setForm({
        nombre: selected.nombre,
        nivel_acceso: selected.nivel_acceso,
        permission: selected.permission_detail.map((p) => p.id) ?? [],
      });
    }
  }, [drawerOpen, selected]);

  function openCreate() {
    setSelected(null);
    setForm(EMPTY);
    setDrawerOpen(true);
  }
  function openEdit(r: Rol) {
    setSelected(r);
    setDrawerOpen(true);
  }
  function closeDrawer() {
    setDrawerOpen(false);
  }

  function togglePermiso(id: number) {
    setForm((f) => ({
      ...f,
      permission: f.permission?.includes(id)
        ? f.permission.filter((p) => p !== id)
        : [...(f.permission ?? []), id],
    }));
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    try {
      if (isEditing) {
        await update({ id: selected!.id, body: form }).unwrap();
        Swal.fire({
          icon: "success",
          title: "Rol actualizado",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await create(form).unwrap();
        Swal.fire({
          icon: "success",
          title: "Rol creado",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      closeDrawer();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar." });
    }
  }

  async function handleDelete(r: Rol) {
    const res = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar rol?",
      text: `"${r.nombre}" será eliminado.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (!res.isConfirmed) return;
    try {
      await remove(r.id).unwrap();
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

  // Group permissions by app_label
  const grouped = permisos.reduce<Record<string, Permiso[]>>((acc, p) => {
    if (!acc[p.app_label]) acc[p.app_label] = [];
    acc[p.app_label].push(p);
    return acc;
  }, {});

  const columns: ColumnDef<Rol>[] = [
    {
      id: "nombre",
      header: "Rol",
      cell: ({ row: { original: r } }) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F0F6FF] flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-[#0056D2]" />
          </div>
          <p className="text-sm font-medium text-gray-900">{r.nombre}</p>
        </div>
      ),
    },
    {
      id: "nivel",
      header: "Nivel de acceso",
      cell: ({ row: { original: r } }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          Nivel {r.nivel_acceso}
        </span>
      ),
    },
    {
      id: "permisos",
      header: "Permisos",
      cell: ({ row: { original: r } }) => (
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Lock className="w-3.5 h-3.5 text-gray-400" />
          {r?.permission?.length} permiso
          {r?.permission?.length !== 1 ? "s" : ""}
        </div>
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Roles</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestión de roles y permisos del sistema
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#1c2634] text-white text-sm font-medium rounded-lg hover:bg-[#1c2634]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo rol
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 w-fit">
        <div className="w-10 h-10 bg-[#F0F6FF] rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-[#0056D2]" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{data?.count ?? 0}</p>
          <p className="text-xs text-gray-500">Total roles</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        count={data?.count ?? 0}
        pageSize={50}
        filters={[
          { type: "search", key: "search", placeholder: "Buscar rol…" },
        ]}
        emptyIcon={Shield}
        emptyMessage="No hay roles registrados"
      />

      <ConfigDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={isEditing ? "Editar rol" : "Nuevo rol"}
        formId={FORM_ID}
        isLoading={isSaving}
      >
        <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-5">
          {/* Datos del rol */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Field label="Nombre del rol" required>
                <input
                  required
                  value={form.nombre}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nombre: e.target.value }))
                  }
                  placeholder="Instructor, Supervisor…"
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Nivel de acceso">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.nivel_acceso ?? 1}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      nivel_acceso: Number(e.target.value),
                    }))
                  }
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          {/* Permisos agrupados por app */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Permisos{" "}
              <span className="normal-case font-normal text-gray-400">
                ({form.permission?.length ?? 0} seleccionados)
              </span>
            </p>

            {Object.keys(grouped).length === 0 ? (
              <p className="text-sm text-gray-400">
                No hay permisos disponibles
              </p>
            ) : (
              <div className="space-y-4">
                {Object.entries(grouped).map(([appLabel, perms]) => (
                  <div key={appLabel}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {appLabel}
                      </span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                    <div className="space-y-1.5 pl-1">
                      {perms.map((perm) => (
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
                            className="w-4 h-4 rounded border-gray-300 accent-[#0056D2]"
                          />
                          <span className="flex-1 text-sm text-gray-700 group-hover:text-gray-900">
                            {perm.name}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            {perm.codename}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </ConfigDrawer>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────

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
