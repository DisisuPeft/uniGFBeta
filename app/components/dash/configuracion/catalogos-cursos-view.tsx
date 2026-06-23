"use client";

import { useState } from "react";
import { Tag, Edit2, Trash2, Plus, BookOpen, Layers, ClipboardList, LayoutList } from "lucide-react";
import Swal from "sweetalert2";
import { DataTable } from "@/app/utils/data-table";
import { ColumnDef } from "@tanstack/react-table";
import ConfigDrawer from "./config-drawer";
import { ActiveBadge } from "./departamentos-view";
import {
  useGetStatusCursoQuery,
  useCreateStatusCursoMutation,
  useUpdateStatusCursoMutation,
  useDeleteStatusCursoMutation,
  useGetTiposTemaQuery,
  useCreateTipoTemaMutation,
  useUpdateTipoTemaMutation,
  useDeleteTipoTemaMutation,
  useGetTiposBloqueQuery,
  useCreateTipoBloqueMutation,
  useUpdateTipoBloqueMutation,
  useDeleteTipoBloqueMutation,
  useGetTiposEvaluacionQuery,
  useCreateTipoEvaluacionMutation,
  useUpdateTipoEvaluacionMutation,
  useDeleteTipoEvaluacionMutation,
} from "@/redux/features/catalogos/genericosApiSlice";
import {
  StatusCurso, StatusCursoForm,
  TipoTema, TipoTemaForm,
  TipoBloque, TipoBloqueForm,
  TipoEvaluacion, TipoEvaluacionForm,
} from "@/redux/features/types/catalagos/cat";

// ── Tipos compartidos ─────────────────────────────────────────

type CatItem = { id: number; nombre: string; codigo: string; activo: boolean; creado_at: string };
type CatForm = { nombre: string; codigo: string; activo?: boolean };

const EMPTY_FORM: CatForm = { nombre: "", codigo: "", activo: true };

// ── Tabs config ───────────────────────────────────────────────

type TabId = "status" | "temas" | "bloques" | "evaluaciones";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "status",       label: "Status de Curso",    icon: BookOpen     },
  { id: "temas",        label: "Tipos de Tema",       icon: Layers       },
  { id: "bloques",      label: "Tipos de Bloque",     icon: LayoutList   },
  { id: "evaluaciones", label: "Tipos de Evaluación", icon: ClipboardList },
];

// ── Main view ─────────────────────────────────────────────────

export default function CatalogosCursosView() {
  const [activeTab, setActiveTab] = useState<TabId>("status");

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Catálogos de Capacitación</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Administra los valores de catálogo utilizados en los cursos
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === id
                ? "bg-white text-[#1c2634] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "status"       && <StatusSection />}
      {activeTab === "temas"        && <TiposTemaSection />}
      {activeTab === "bloques"      && <TiposBloqueSection />}
      {activeTab === "evaluaciones" && <TiposEvaluacionSection />}
    </div>
  );
}

// ── Tab sections (hook isolation) ────────────────────────────

function StatusSection() {
  const { data, isLoading } = useGetStatusCursoQuery();
  const [create, { isLoading: creating }] = useCreateStatusCursoMutation();
  const [update, { isLoading: updating }] = useUpdateStatusCursoMutation();
  const [remove] = useDeleteStatusCursoMutation();
  return (
    <CatalogSection<StatusCurso, StatusCursoForm>
      title="Status de Curso"
      description="Estados del ciclo de vida de un curso (borrador, publicado, archivado…)"
      icon={BookOpen}
      items={data?.results ?? []}
      count={data?.count ?? 0}
      isLoading={isLoading}
      isSaving={creating || updating}
      singularLabel="status"
      onSave={async (form, selected) => {
        if (selected) await update({ id: selected.id, body: form }).unwrap();
        else await create(form as StatusCursoForm).unwrap();
      }}
      onDelete={(item) => remove(item.id).unwrap()}
    />
  );
}

function TiposTemaSection() {
  const { data, isLoading } = useGetTiposTemaQuery();
  const [create, { isLoading: creating }] = useCreateTipoTemaMutation();
  const [update, { isLoading: updating }] = useUpdateTipoTemaMutation();
  const [remove] = useDeleteTipoTemaMutation();
  return (
    <CatalogSection<TipoTema, TipoTemaForm>
      title="Tipos de Tema"
      description="Clasifica los temas dentro de los módulos (teórico, práctico, taller…)"
      icon={Layers}
      items={data?.results ?? []}
      count={data?.count ?? 0}
      isLoading={isLoading}
      isSaving={creating || updating}
      singularLabel="tipo de tema"
      onSave={async (form, selected) => {
        if (selected) await update({ id: selected.id, body: form }).unwrap();
        else await create(form as TipoTemaForm).unwrap();
      }}
      onDelete={(item) => remove(item.id).unwrap()}
    />
  );
}

function TiposBloqueSection() {
  const { data, isLoading } = useGetTiposBloqueQuery();
  const [create, { isLoading: creating }] = useCreateTipoBloqueMutation();
  const [update, { isLoading: updating }] = useUpdateTipoBloqueMutation();
  const [remove] = useDeleteTipoBloqueMutation();
  return (
    <CatalogSection<TipoBloque, TipoBloqueForm>
      title="Tipos de Bloque"
      description="Define qué tipos de contenido puede tener un tema (texto, video, lista, tabla…)"
      icon={LayoutList}
      items={data?.results ?? []}
      count={data?.count ?? 0}
      isLoading={isLoading}
      isSaving={creating || updating}
      singularLabel="tipo de bloque"
      onSave={async (form, selected) => {
        if (selected) await update({ id: selected.id, body: form }).unwrap();
        else await create(form as TipoBloqueForm).unwrap();
      }}
      onDelete={(item) => remove(item.id).unwrap()}
    />
  );
}

function TiposEvaluacionSection() {
  const { data, isLoading } = useGetTiposEvaluacionQuery();
  const [create, { isLoading: creating }] = useCreateTipoEvaluacionMutation();
  const [update, { isLoading: updating }] = useUpdateTipoEvaluacionMutation();
  const [remove] = useDeleteTipoEvaluacionMutation();
  return (
    <CatalogSection<TipoEvaluacion, TipoEvaluacionForm>
      title="Tipos de Evaluación"
      description="Clasifica las evaluaciones dentro de un curso (diagnóstica, parcial, final…)"
      icon={ClipboardList}
      items={data?.results ?? []}
      count={data?.count ?? 0}
      isLoading={isLoading}
      isSaving={creating || updating}
      singularLabel="tipo de evaluación"
      onSave={async (form, selected) => {
        if (selected) await update({ id: selected.id, body: form }).unwrap();
        else await create(form as TipoEvaluacionForm).unwrap();
      }}
      onDelete={(item) => remove(item.id).unwrap()}
    />
  );
}

// ── CatalogSection (componente genérico reutilizable) ─────────

const FORM_ID = "catalog-form";

interface CatalogSectionProps<T extends CatItem, F extends CatForm> {
  title: string;
  description: string;
  icon: React.ElementType;
  items: T[];
  count: number;
  isLoading: boolean;
  isSaving: boolean;
  singularLabel: string;
  onSave: (form: F, selected: T | null) => Promise<void>;
  onDelete: (item: T) => Promise<void>;
}

function CatalogSection<T extends CatItem, F extends CatForm>({
  title, description, icon: Icon, items, count, isLoading, isSaving,
  singularLabel, onSave, onDelete,
}: CatalogSectionProps<T, F>) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<T | null>(null);
  const [form, setForm] = useState<CatForm>(EMPTY_FORM);

  function openCreate() {
    setSelected(null);
    setForm(EMPTY_FORM);
    setDrawerOpen(true);
  }
  function openEdit(item: T) {
    setSelected(item);
    setForm({ nombre: item.nombre, codigo: item.codigo, activo: item.activo });
    setDrawerOpen(true);
  }
  function closeDrawer() {
    setDrawerOpen(false);
    setSelected(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    try {
      await onSave(form as F, selected);
      Swal.fire({
        icon: "success",
        title: selected ? "Actualizado" : "Creado",
        timer: 1500,
        showConfirmButton: false,
      });
      closeDrawer();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar." });
    }
  }

  async function handleDelete(item: T) {
    const result = await Swal.fire({
      icon: "warning",
      title: `¿Eliminar ${singularLabel}?`,
      text: `"${item.nombre}" será eliminado.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    try {
      await onDelete(item);
      Swal.fire({ icon: "success", title: "Eliminado", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar." });
    }
  }

  const columns: ColumnDef<T>[] = [
    {
      id: "nombre",
      header: "Nombre",
      cell: ({ row: { original: item } }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{item.nombre}</p>
          <p className="text-xs text-gray-400 font-mono">{item.codigo}</p>
        </div>
      ),
    },
    {
      id: "activo",
      header: "Estado",
      cell: ({ row: { original: item } }) => <ActiveBadge activo={item.activo} />,
    },
    {
      id: "creado",
      header: "Creado",
      cell: ({ row: { original: item } }) => (
        <span className="text-xs text-gray-400">
          {new Date(item.creado_at).toLocaleDateString("es-MX")}
        </span>
      ),
    },
    {
      id: "acciones",
      header: "",
      cell: ({ row: { original: item } }) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => openEdit(item)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Edit2 className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => handleDelete(item)}
            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#1c2634] text-white text-sm font-medium rounded-lg hover:bg-[#1c2634]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 w-fit">
        <div className="w-10 h-10 bg-[#F0F6FF] rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#0056D2]" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{count}</p>
          <p className="text-xs text-gray-500">Total registros</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        count={count}
        pageSize={100}
        filters={[{ type: "search", key: "search", placeholder: `Buscar ${singularLabel}…` }]}
        emptyIcon={Tag}
        emptyMessage={`No hay registros de ${singularLabel}`}
      />

      <ConfigDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={selected ? `Editar ${singularLabel}` : `Nuevo ${singularLabel}`}
        formId={FORM_ID}
        isLoading={isSaving}
      >
        <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nombre" required>
            <input
              required
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              placeholder="Nombre del catálogo…"
              className={inputCls}
            />
          </Field>
          <Field label="Código" required>
            <input
              required
              value={form.codigo}
              onChange={(e) => setForm((f) => ({ ...f, codigo: e.target.value }))}
              placeholder="codigo_sin_espacios"
              className={inputCls}
            />
          </Field>
          <Field label="Estado">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, activo: !f.activo }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.activo ? "bg-emerald-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    form.activo ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm text-gray-600">{form.activo ? "Activo" : "Inactivo"}</span>
            </div>
          </Field>
        </form>
      </ConfigDrawer>
    </>
  );
}

// ── Helpers ───────────────────────────────────────────────────

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