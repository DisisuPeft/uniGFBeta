"use client";

import { useState, useEffect } from "react";
import { Users, Edit2, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { DataTable } from "@/app/utils/data-table";
import { ColumnDef } from "@tanstack/react-table";
import ConfigDrawer from "./config-drawer";
import {
  useGetUsuariosQuery,
  useCreateUsuarioMutation,
  useUpdateUsuarioMutation,
  useDeleteUsuarioMutation,
  useGetRolesQuery,
  useGetDependenciasQuery,
  useGetDepartamentosQuery,
  useGetPuestosQuery,
} from "@/redux/features/sistema/sistemaApiSlice";
import { useGetGenerosQuery } from "@/redux/features/catalogos/generoApiSlice";
import {
  Usuario,
  UsuarioForm,
  Puesto,
  Dependencia,
  Departamento,
  Rol,
} from "@/redux/features/types/sistema/types";
import { Genero } from "@/redux/features/types/auth/auth-types";

// ── Types ─────────────────────────────────────────────────────

interface DrawerCatalogs {
  dependencias: Dependencia[];
  departamentos: Departamento[];
  puestos: Puesto[];
  roles: Rol[];
  generos: Genero[];
}

// ── Constants ─────────────────────────────────────────────────

const FORM_ID = "usuario-form";

const EMPTY: UsuarioForm = {
  num_colab: null,
  email: "",
  password: "",
  nombre: "",
  apellido_paterno: "",
  apellido_materno: "",
  genero: null,
  fecha_nacimiento: "",
  telefono: "",
  curp: "",
  rfc: "",
  fecha_alta: "",
  puesto: null,
  dependencia: null,
  roles: [],
};

// ── Main view ─────────────────────────────────────────────────

export default function UsuariosView() {
  const { data, isLoading } = useGetUsuariosQuery();
  const { data: dependenciasData } = useGetDependenciasQuery();
  const { data: departamentosData } = useGetDepartamentosQuery();
  const { data: puestosData } = useGetPuestosQuery();
  const { data: rolesData } = useGetRolesQuery();
  const { data: generosData } = useGetGenerosQuery();

  const [create, { isLoading: creating }] = useCreateUsuarioMutation();
  const [update, { isLoading: updating }] = useUpdateUsuarioMutation();
  const [remove] = useDeleteUsuarioMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Usuario | null>(null);

  const catalogs: DrawerCatalogs = {
    dependencias: dependenciasData?.results ?? [],
    departamentos: departamentosData?.results ?? [],
    puestos: puestosData?.results ?? [],
    roles: rolesData?.results ?? [],
    generos: generosData?.results ?? [],
  };

  function openCreate() { setSelected(null); setDrawerOpen(true); }
  function openEdit(u: Usuario) { setSelected(u); setDrawerOpen(true); }
  function closeDrawer() { setDrawerOpen(false); setSelected(null); }

  async function handleDelete(u: Usuario) {
    const r = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar usuario?",
      text: `${u.nombre} ${u.apellido_paterno} será eliminado.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (!r.isConfirmed) return;
    try {
      await remove(u.uuid).unwrap();
      Swal.fire({ icon: "success", title: "Eliminado", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar." });
    }
  }

  const columns: ColumnDef<Usuario>[] = [
    {
      id: "colaborador",
      header: "Colaborador",
      cell: ({ row: { original: u } }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1c2634] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
            {u.nombre.charAt(0)}{u.apellido_paterno.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {u.nombre} {u.apellido_paterno}{u.apellido_materno ? ` ${u.apellido_materno}` : ""}
            </p>
            <p className="text-xs text-gray-400">{u.email}</p>
          </div>
          {u.num_colab != null && (
            <span className="text-xs font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded flex-shrink-0">
              #{u.num_colab}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "posicion",
      header: "Puesto",
      cell: ({ row: { original: u } }) => (
        <div>
          <p className="text-sm text-gray-700">{u.puesto_nombre ?? "—"}</p>
          <p className="text-xs text-gray-400">{u.departamento_nombre ?? ""}</p>
        </div>
      ),
    },
    {
      id: "dependencia",
      header: "Dependencia",
      cell: ({ row: { original: u } }) => (
        <span className="text-sm text-gray-600">{u.dependencia_nombre ?? "—"}</span>
      ),
    },
    {
      id: "roles",
      header: "Roles",
      cell: ({ row: { original: u } }) => (
        <div className="flex flex-wrap gap-1">
          {u.roles_list.length > 0
            ? u.roles_list.map((r) => (
                <span key={r.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F0F6FF] text-[#0056D2]">
                  {r.nombre}
                </span>
              ))
            : <span className="text-xs text-gray-400">Sin rol</span>
          }
        </div>
      ),
    },
    {
      id: "acciones",
      header: "",
      cell: ({ row: { original: u } }) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => openEdit(u)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Edit2 className="w-4 h-4 text-gray-500" />
          </button>
          <button onClick={() => handleDelete(u)} className="p-2 rounded-lg hover:bg-red-50 transition-colors">
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
          <h1 className="text-xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestión de usuarios y accesos del sistema</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#1c2634] text-white text-sm font-medium rounded-lg hover:bg-[#1c2634]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo usuario
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 w-fit">
        <div className="w-10 h-10 bg-[#F0F6FF] rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-[#0056D2]" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{data?.count ?? 0}</p>
          <p className="text-xs text-gray-500">Total usuarios</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        count={data?.count ?? 0}
        pageSize={25}
        filters={[{ type: "search", key: "search", placeholder: "Buscar usuario…" }]}
        emptyIcon={Users}
        emptyMessage="No hay usuarios registrados"
      />

      <UserDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        selected={selected}
        catalogs={catalogs}
        isSaving={creating || updating}
        onCreate={async (form) => { await create(form).unwrap(); }}
        onUpdate={async (uuid, body) => { await update({ uuid, body }).unwrap(); }}
      />
    </div>
  );
}

// ── UserDrawer ────────────────────────────────────────────────

interface UserDrawerProps {
  open: boolean;
  onClose: () => void;
  selected: Usuario | null;
  catalogs: DrawerCatalogs;
  isSaving: boolean;
  onCreate: (form: UsuarioForm) => Promise<void>;
  onUpdate: (uuid: string, body: Partial<UsuarioForm>) => Promise<void>;
}

function UserDrawer({ open, onClose, selected, catalogs, isSaving, onCreate, onUpdate }: UserDrawerProps) {
  const [form, setForm] = useState<UsuarioForm>(EMPTY);
  const [deptId, setDeptId] = useState<number | null>(null);
  const [showPwd, setShowPwd] = useState(false);

  const isEditing = !!selected;

  useEffect(() => {
    if (!open) {
      setForm(EMPTY);
      setDeptId(null);
      setShowPwd(false);
      return;
    }
    if (selected) {
      setForm({
        num_colab: selected.num_colab,
        email: selected.email,
        password: "",
        nombre: selected.nombre,
        apellido_paterno: selected.apellido_paterno,
        apellido_materno: selected.apellido_materno ?? "",
        genero: selected.genero,
        fecha_nacimiento: selected.fecha_nacimiento ?? "",
        telefono: selected.telefono ?? "",
        curp: selected.curp ?? "",
        rfc: selected.rfc ?? "",
        fecha_alta: selected.fecha_alta ?? "",
        puesto: selected.puesto,
        dependencia: selected.dependencia,
        roles: [...selected.roles],
      });
      const puesto = catalogs.puestos.find((p) => p.id === selected.puesto);
      setDeptId(puesto?.departamento ?? null);
    } else {
      setForm(EMPTY);
      setDeptId(null);
    }
  }, [open, selected]);

  const filteredPuestos = deptId
    ? catalogs.puestos.filter((p) => p.departamento === deptId)
    : catalogs.puestos;

  function toggleRole(id: number) {
    setForm((f) => ({
      ...f,
      roles: f.roles.includes(id) ? f.roles.filter((r) => r !== id) : [...f.roles, id],
    }));
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (form.roles.length === 0) {
      Swal.fire({ icon: "warning", title: "Rol requerido", text: "Selecciona al menos un rol." });
      return;
    }
    try {
      const payload: UsuarioForm = {
        ...form,
        num_colab: form.num_colab || null,
        fecha_nacimiento: form.fecha_nacimiento || null,
        fecha_alta: form.fecha_alta || null,
        genero: form.genero || null,
        puesto: form.puesto || null,
        dependencia: form.dependencia || null,
        apellido_materno: form.apellido_materno || null,
        telefono: form.telefono || null,
        curp: form.curp || null,
        rfc: form.rfc || null,
      };
      if (isEditing) {
        const body: Partial<UsuarioForm> = { ...payload };
        if (!body.password) delete body.password;
        await onUpdate(selected!.uuid, body);
      } else {
        await onCreate(payload);
      }
      Swal.fire({ icon: "success", title: isEditing ? "Usuario actualizado" : "Usuario creado", timer: 1500, showConfirmButton: false });
      onClose();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar." });
    }
  }

  return (
    <ConfigDrawer
      open={open}
      onClose={onClose}
      title={isEditing ? "Editar usuario" : "Nuevo usuario"}
      formId={FORM_ID}
      isLoading={isSaving}
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-6">
        {/* Datos personales */}
        <Section title="Datos personales">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nombre" required>
              <input required value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} placeholder="Juan" className={inputCls} />
            </Field>
            <Field label="Apellido paterno" required>
              <input required value={form.apellido_paterno} onChange={(e) => setForm((f) => ({ ...f, apellido_paterno: e.target.value }))} placeholder="Pérez" className={inputCls} />
            </Field>
            <Field label="Apellido materno">
              <input value={form.apellido_materno ?? ""} onChange={(e) => setForm((f) => ({ ...f, apellido_materno: e.target.value }))} placeholder="García" className={inputCls} />
            </Field>
            <Field label="Género">
              <select value={form.genero ?? ""} onChange={(e) => setForm((f) => ({ ...f, genero: e.target.value ? Number(e.target.value) : null }))} className={selectCls}>
                <option value="">Sin especificar</option>
                {catalogs.generos.map((g) => <option key={g.id} value={g.id}>{g.nombre}</option>)}
              </select>
            </Field>
            <Field label="Fecha de nacimiento">
              <input type="date" value={form.fecha_nacimiento ?? ""} onChange={(e) => setForm((f) => ({ ...f, fecha_nacimiento: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="N° colaborador">
              <input type="number" value={form.num_colab ?? ""} onChange={(e) => setForm((f) => ({ ...f, num_colab: e.target.value ? Number(e.target.value) : null }))} placeholder="1042" className={inputCls} />
            </Field>
          </div>
        </Section>

        {/* Contacto y documentos */}
        <Section title="Contacto y documentos">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Field label="Email" required>
                <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="juan.perez@empresa.com" className={inputCls} />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label={isEditing ? "Nueva contraseña (dejar en blanco para no cambiar)" : "Contraseña"} required={!isEditing}>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    required={!isEditing}
                    value={form.password ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder={isEditing ? "Dejar en blanco para no cambiar" : "Pass1234!"}
                    className={inputCls + " pr-10"}
                  />
                  <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>
            </div>
            <Field label="Teléfono">
              <input value={form.telefono ?? ""} onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))} placeholder="8112345678" className={inputCls} />
            </Field>
            <Field label="Fecha de alta">
              <input type="date" value={form.fecha_alta ?? ""} onChange={(e) => setForm((f) => ({ ...f, fecha_alta: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="CURP">
              <input value={form.curp ?? ""} onChange={(e) => setForm((f) => ({ ...f, curp: e.target.value.toUpperCase() }))} placeholder="PEGJ900515HNLRZN01" maxLength={18} className={inputCls + " uppercase"} />
            </Field>
            <Field label="RFC">
              <input value={form.rfc ?? ""} onChange={(e) => setForm((f) => ({ ...f, rfc: e.target.value.toUpperCase() }))} placeholder="PEGJ900515AB2" maxLength={13} className={inputCls + " uppercase"} />
            </Field>
          </div>
        </Section>

        {/* Posición */}
        <Section title="Posición">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Dependencia">
              <select value={form.dependencia ?? ""} onChange={(e) => setForm((f) => ({ ...f, dependencia: e.target.value ? Number(e.target.value) : null }))} className={selectCls}>
                <option value="">Sin dependencia</option>
                {catalogs.dependencias.map((d) => <option key={d.id} value={d.id}>{d.nombre}</option>)}
              </select>
            </Field>
            <Field label="Departamento">
              <select
                value={deptId ?? ""}
                onChange={(e) => {
                  const v = e.target.value ? Number(e.target.value) : null;
                  setDeptId(v);
                  setForm((f) => ({ ...f, puesto: null }));
                }}
                className={selectCls}
              >
                <option value="">Todos</option>
                {catalogs.departamentos.map((d) => <option key={d.id} value={d.id}>{d.nombre}</option>)}
              </select>
            </Field>
            <div className="col-span-2">
              <Field label="Puesto">
                <select value={form.puesto ?? ""} onChange={(e) => setForm((f) => ({ ...f, puesto: e.target.value ? Number(e.target.value) : null }))} className={selectCls}>
                  <option value="">Sin puesto asignado</option>
                  {filteredPuestos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </Field>
            </div>
          </div>
        </Section>

        {/* Roles */}
        <Section title={<>Roles <span className="text-red-500">*</span></>}>
          {catalogs.roles.length === 0 ? (
            <p className="text-sm text-gray-400">No hay roles disponibles</p>
          ) : (
            <div className="space-y-2">
              {catalogs.roles.map((r) => (
                <label key={r.id} className="flex items-center gap-2.5 cursor-pointer group py-1">
                  <input
                    type="checkbox"
                    checked={form.roles.includes(r.id)}
                    onChange={() => toggleRole(r.id)}
                    className="w-4 h-4 rounded border-gray-300 text-[#0056D2] accent-[#0056D2]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{r.nombre}</p>
                    <p className="text-xs text-gray-400">Nivel de acceso {r.nivel_acceso}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
          {form.roles.length === 0 && (
            <p className="text-xs text-red-500 mt-1">Se requiere al menos un rol</p>
          )}
        </Section>
      </form>
    </ConfigDrawer>
  );
}

// ── Shared helpers ────────────────────────────────────────────

const inputCls =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2]/20 transition-colors placeholder:text-gray-400 bg-white";

const selectCls =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] transition-colors bg-white text-gray-700";

function Section({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  );
}

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