"use client";

import { useState, useRef } from "react";
import {
  Building2,
  Edit2,
  Trash2,
  Plus,
  Globe,
  Phone,
  Mail,
} from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";
import { DataTable, StatusBadge } from "@/app/utils/data-table";
import { ColumnDef } from "@tanstack/react-table";
import ConfigDrawer from "./config-drawer";
import {
  useGetEmpresasAdminQuery,
  useCreateEmpresaMutation,
  useUpdateEmpresaMutation,
  useDeleteEmpresaMutation,
} from "@/redux/features/sistema/sistemaApiSlice";
import { Empresa } from "@/redux/features/types/sistema/types";

const FORM_ID = "empresa-form";

const EMPTY: Partial<Empresa> = {
  razon_social: "",
  slug: "",
  sitio_web: "",
  telefono: "",
  email_contacto: "",
  direccion: "",
  rfc: "",
  status: 1,
};

export default function EmpresasView() {
  const { data, isLoading } = useGetEmpresasAdminQuery();
  const [createEmpresa, { isLoading: creating }] = useCreateEmpresaMutation();
  const [updateEmpresa, { isLoading: updating }] = useUpdateEmpresaMutation();
  const [deleteEmpresa] = useDeleteEmpresaMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Empresa | null>(null);
  const [form, setForm] = useState<Partial<Empresa>>(EMPTY);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  // console.log(data);
  const isEditing = !!selected;
  const isSaving = creating || updating;

  function openCreate() {
    setSelected(null);
    setForm(EMPTY);
    setPreview(null);
    setDrawerOpen(true);
  }

  function openEdit(e: Empresa) {
    setSelected(e);
    setForm({ ...e });
    setPreview(e.logo ?? null);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setSelected(null);
    setForm(EMPTY);
    setPreview(null);
  }

  function handleFile(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const fd = new FormData();
    (Object.keys(form) as (keyof Empresa)[]).forEach((k) => {
      if (k !== "id" && k !== "logo" && form[k] != null)
        fd.append(k, String(form[k]));
    });
    const file = fileRef.current?.files?.[0];
    if (file) fd.append("logo", file);

    try {
      if (isEditing) {
        await updateEmpresa({ id: selected!.id, body: fd }).unwrap();
        Swal.fire({
          icon: "success",
          title: "Empresa actualizada",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await createEmpresa(fd).unwrap();
        Swal.fire({
          icon: "success",
          title: "Empresa creada",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      closeDrawer();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la empresa.",
      });
    }
  }

  async function handleDelete(e: Empresa) {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar empresa?",
      text: `"${e.razon_social}" se eliminará permanentemente.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteEmpresa(e.id).unwrap();
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

  const columns: ColumnDef<Empresa>[] = [
    {
      id: "empresa",
      header: "Empresa",
      cell: ({ row: { original: e } }) => (
        <div className="flex items-center gap-3">
          {e.logo ? (
            <Image
              src={e.logo}
              alt={e.razon_social}
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg object-contain border border-gray-100"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-gray-400" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">
              {e.razon_social}
            </p>
            <p className="text-xs text-gray-400">{e.slug}</p>
          </div>
        </div>
      ),
    },
    {
      id: "contacto",
      header: "Contacto",
      cell: ({ row: { original: e } }) => (
        <div className="space-y-0.5">
          {e.email_contacto && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {e.email_contacto}
            </p>
          )}
          {e.telefono && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {e.telefono}
            </p>
          )}
          {e.sitio_web && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {e.sitio_web}
            </p>
          )}
        </div>
      ),
    },
    {
      id: "rfc",
      header: "RFC",
      cell: ({ row: { original: e } }) => (
        <span className="text-sm text-gray-600">{e.rfc ?? "—"}</span>
      ),
    },
    {
      id: "status",
      header: "Estado",
      cell: ({ row: { original: e } }) => <StatusBadge status={e.status} />,
    },
    {
      id: "acciones",
      header: "",
      cell: ({ row: { original: e } }) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => openEdit(e)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Editar"
          >
            <Edit2 className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => handleDelete(e)}
            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
            title="Eliminar"
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
          <h1 className="text-xl font-bold text-gray-900">Empresas</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Organizaciones registradas en el sistema
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#1c2634] text-white text-sm font-medium rounded-lg hover:bg-[#1c2634]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva empresa
        </button>
      </div>

      {/* Stat */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 w-fit">
        <div className="w-10 h-10 bg-[#F0F6FF] rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-[#0056D2]" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{data?.count ?? 0}</p>
          <p className="text-xs text-gray-500">Total empresas</p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        count={data?.count ?? 0}
        pageSize={100}
        emptyIcon={Building2}
        emptyMessage="No hay empresas registradas"
      />

      {/* Drawer */}
      <ConfigDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={isEditing ? "Editar empresa" : "Nueva empresa"}
        formId={FORM_ID}
        isLoading={isSaving}
      >
        <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
          {/* Logo */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Logo
            </label>
            <div className="flex items-center gap-4">
              {preview ? (
                <Image
                  src={preview}
                  alt="preview"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-xl object-contain border border-gray-200"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center border border-dashed border-gray-300">
                  <Building2 className="w-6 h-6 text-gray-300" />
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {preview ? "Cambiar" : "Seleccionar"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
            </div>
          </div>

          {/* Razón social */}
          <Field label="Razón social" required>
            <input
              required
              value={form.razon_social ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, razon_social: e.target.value }))
              }
              placeholder="Farrera Academy S.A. de C.V."
              className={inputCls}
            />
          </Field>

          {/* Slug */}
          <Field label="Slug" required>
            <input
              required
              value={form.slug ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="farrera-academy"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="RFC">
              <input
                value={form.rfc ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rfc: e.target.value }))
                }
                placeholder="FAC210101XXX"
                className={inputCls}
              />
            </Field>
            <Field label="Teléfono">
              <input
                value={form.telefono ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, telefono: e.target.value }))
                }
                placeholder="5512345678"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Correo de contacto">
            <input
              type="email"
              value={form.email_contacto ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, email_contacto: e.target.value }))
              }
              placeholder="contacto@empresa.com"
              className={inputCls}
            />
          </Field>

          <Field label="Sitio web">
            <input
              value={form.sitio_web ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, sitio_web: e.target.value }))
              }
              placeholder="https://empresa.com"
              className={inputCls}
            />
          </Field>

          <Field label="Dirección">
            <input
              value={form.direccion ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, direccion: e.target.value }))
              }
              placeholder="Av. Principal 123, CDMX"
              className={inputCls}
            />
          </Field>

          <Field label="Estado">
            <StatusToggle
              value={form.status === 1}
              onChange={(v) => setForm((f) => ({ ...f, status: v ? 1 : 0 }))}
            />
          </Field>
        </form>
      </ConfigDrawer>
    </div>
  );
}

// ── helpers locales ───────────────────────────────────────────

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

function StatusToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? "bg-emerald-500" : "bg-gray-300"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}
