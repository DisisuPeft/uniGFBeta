"use client";

import { useState } from "react";
import {
  Zap,
  Edit2,
  Trash2,
  Plus,
  X,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";
import { DataTable } from "@/app/utils/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DynamicIcon } from "@/app/ui/icon/dynamic-icon";
import {
  useGetCompetenciasQuery,
  useCreateCompetenciaMutation,
  useUpdateCompetenciaMutation,
  useDeleteCompetenciaMutation,
  useGetCompetenciasPuestoByCompetenciaQuery,
  useCreateCompetenciaPuestoMutation,
  useDeleteCompetenciaPuestoMutation,
} from "@/redux/features/competencias/competenciasApiSlice";
import { useGetPuestosQuery } from "@/redux/features/sistema/sistemaApiSlice";
import { useGetNivelesCompetenciaQuery } from "@/redux/features/catalogos/genericosApiSlice";
import {
  Competencia,
  CompetenciaForm,
  CompetenciaPuesto,
} from "@/redux/features/types/competencias/types";
import { ActiveBadge } from "@/app/components/dash/configuracion/departamentos-view";

const FORM_ID = "competencia-form";

const EMPTY: CompetenciaForm = {
  nombre: "",
  codigo: "",
  descripcion: "",
  icono: "Zap",
  color: "#6366f1",
  activo: true,
};

type Tab = "info" | "puestos";

export default function CompetenciasView() {
  const { data, isLoading } = useGetCompetenciasQuery();
  const [create, { isLoading: creating }] = useCreateCompetenciaMutation();
  const [update, { isLoading: updating }] = useUpdateCompetenciaMutation();
  const [remove] = useDeleteCompetenciaMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Competencia | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [form, setForm] = useState<CompetenciaForm>(EMPTY);

  const isEditing = !!selected;
  const isSaving = creating || updating;

  function openCreate() {
    setSelected(null);
    setForm(EMPTY);
    setActiveTab("info");
    setDrawerOpen(true);
  }

  function openEdit(c: Competencia) {
    setSelected(c);
    setForm({
      nombre: c.nombre,
      codigo: c.codigo,
      descripcion: c.descripcion ?? "",
      icono: c.icono,
      color: c.color,
      activo: c.activo,
    });
    setActiveTab("info");
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
          title: "Competencia actualizada",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await create(form).unwrap();
        Swal.fire({
          icon: "success",
          title: "Competencia creada",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      closeDrawer();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar." });
    }
  }

  async function handleDelete(c: Competencia) {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar competencia?",
      text: `"${c.nombre}" quedará desactivada.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    try {
      await remove(c.id).unwrap();
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

  const columns: ColumnDef<Competencia>[] = [
    {
      id: "nombre",
      header: "Competencia",
      cell: ({ row: { original: c } }) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: c.color + "22" }}
          >
            <DynamicIcon iconName={c.icono} size={16} color={c.color} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{c.nombre}</p>
            <p className="text-xs text-gray-400 font-mono">{c.codigo}</p>
          </div>
        </div>
      ),
    },
    {
      id: "descripcion",
      header: "Descripción",
      cell: ({ row: { original: c } }) => (
        <span className="text-sm text-gray-500 line-clamp-1">
          {c.descripcion ?? "—"}
        </span>
      ),
    },
    {
      id: "activo",
      header: "Estado",
      cell: ({ row: { original: c } }) => <ActiveBadge activo={c.activo} />,
    },
    {
      id: "acciones",
      header: "",
      cell: ({ row: { original: c } }) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => openEdit(c)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Editar"
          >
            <Edit2 className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => handleDelete(c)}
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
    <div className="w-full relative min-h-[calc(100vh-100px)] overflow-hidden">
      {/* Contenedor centrado para el contenido de la página */}
      <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header section with bottom border to anchor it */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 relative z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Competencias</h1>
            <p className="text-sm text-gray-500 mt-1">
              Catálogo de competencias disponibles en el sistema
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#0056D2] text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-[#0047b3] hover:shadow transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Nueva competencia
          </button>
        </div>

        {/* Stat Card with elegant crisp shadow */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-5 w-fit relative z-10">
          <div className="w-12 h-12 bg-blue-50/80 rounded-lg flex items-center justify-center border border-blue-100/50">
            <Zap className="w-6 h-6 text-[#0056D2]" />
          </div>
          <div>
            <p className="text-3xl font-bold tracking-tight text-gray-900">{data?.count ?? 0}</p>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-0.5">Total competencias</p>
          </div>
        </div>

        {/* Table */}
        <div className="relative z-10">
          <DataTable
            columns={columns}
            data={data?.results ?? []}
            isLoading={isLoading}
            count={data?.count ?? 0}
            pageSize={100}
            filters={[
              { type: "search", key: "search", placeholder: "Buscar competencia…" },
            ]}
            emptyIcon={Zap}
            emptyMessage="No hay competencias registradas"
          />
        </div>
      </div>

      {/* Drawer con tabs */}
      <CompetenciaDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        isEditing={isEditing}
        selected={selected}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        form={form}
        setForm={setForm}
        isSaving={isSaving}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

// ── Drawer con tabs ───────────────────────────────────────────

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  isEditing: boolean;
  selected: Competencia | null;
  activeTab: Tab;
  onTabChange: (t: Tab) => void;
  form: CompetenciaForm;
  setForm: React.Dispatch<React.SetStateAction<CompetenciaForm>>;
  isSaving: boolean;
  onSubmit: (ev: React.FormEvent<HTMLFormElement>) => void;
}

function CompetenciaDrawer({
  open,
  onClose,
  isEditing,
  selected,
  activeTab,
  onTabChange,
  form,
  setForm,
  isSaving,
  onSubmit,
}: DrawerProps) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-semibold text-[#1c2634]">
            {isEditing ? selected?.nombre : "Nueva competencia"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs (solo al editar) */}
        {isEditing && (
          <div className="flex gap-1 px-6 pt-3 pb-0 flex-shrink-0 border-b border-gray-100">
            {(["info", "puestos"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => onTabChange(t)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors -mb-px ${
                  activeTab === t
                    ? "text-[#0056D2] border-b-2 border-[#0056D2] bg-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "info" ? "Información" : "Puestos"}
              </button>
            ))}
          </div>
        )}

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === "info" || !isEditing ? (
            <InfoTab form={form} setForm={setForm} onSubmit={onSubmit} />
          ) : (
            <PuestosTab competenciaId={selected!.id} />
          )}
        </div>

        {/* Footer: solo en tab Información */}
        {(activeTab === "info" || !isEditing) && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form={FORM_ID}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1c2634] rounded-lg hover:bg-[#1c2634]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tab: Información ──────────────────────────────────────────

function InfoTab({
  form,
  setForm,
  onSubmit,
}: {
  form: CompetenciaForm;
  setForm: React.Dispatch<React.SetStateAction<CompetenciaForm>>;
  onSubmit: (ev: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form id={FORM_ID} onSubmit={onSubmit} className="space-y-4">
      <Field label="Nombre" required>
        <input
          required
          value={form.nombre}
          onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
          placeholder="Liderazgo"
          className={inputCls}
        />
      </Field>

      <Field label="Código" required>
        <input
          required
          value={form.codigo}
          onChange={(e) => setForm((f) => ({ ...f, codigo: e.target.value }))}
          placeholder="liderazgo"
          className={inputCls}
        />
      </Field>

      <Field label="Descripción">
        <textarea
          value={form.descripcion ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, descripcion: e.target.value }))
          }
          placeholder="Capacidad para guiar equipos hacia objetivos comunes…"
          rows={3}
          className={inputCls + " resize-none"}
        />
      </Field>

      <Field label="Ícono (nombre Lucide)">
        <div className="flex items-center gap-3">
          <input
            value={form.icono ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, icono: e.target.value }))}
            placeholder="Users"
            className={inputCls}
          />
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200"
            style={{ backgroundColor: (form.color ?? "#6366f1") + "22" }}
          >
            <DynamicIcon
              iconName={form.icono ?? "Zap"}
              size={18}
              color={form.color ?? "#6366f1"}
            />
          </div>
        </div>
      </Field>

      <Field label="Color">
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={form.color ?? "#6366f1"}
            onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
            className="w-10 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
          />
          <input
            value={form.color ?? "#6366f1"}
            onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
            placeholder="#6366f1"
            className={inputCls}
          />
        </div>
      </Field>

      <Field label="Estado">
        <ActiveToggle
          value={form.activo ?? true}
          onChange={(v) => setForm((f) => ({ ...f, activo: v }))}
        />
      </Field>
    </form>
  );
}

// ── Tab: Puestos ──────────────────────────────────────────────

function PuestosTab({ competenciaId }: { competenciaId: number }) {
  const { data: asociaciones, isLoading } =
    useGetCompetenciasPuestoByCompetenciaQuery(competenciaId);
  const { data: todosLosPuestos } = useGetPuestosQuery();
  const { data: niveles } = useGetNivelesCompetenciaQuery();
  const [createAsoc, { isLoading: adding }] =
    useCreateCompetenciaPuestoMutation();
  const [deleteAsoc] = useDeleteCompetenciaPuestoMutation();

  const [showForm, setShowForm] = useState(false);
  const [puestoId, setPuestoId] = useState<number>(0);
  const [nivelId, setNivelId] = useState<number>(0);

  const linkedIds = asociaciones?.results?.map((a) => a.puesto) ?? [];
  const disponibles = (todosLosPuestos?.results ?? []).filter(
    (p) => !linkedIds.includes(p.id),
  );

  async function handleAdd() {
    if (!puestoId || !nivelId) return;
    try {
      await createAsoc({
        competencia: competenciaId,
        puesto: puestoId,
        nivel: nivelId,
      }).unwrap();
      setPuestoId(0);
      setNivelId(0);
      setShowForm(false);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo agregar el puesto.",
      });
    }
  }

  async function handleRemove(item: CompetenciaPuesto) {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Quitar puesto?",
      text: `Se quitará "${item.puesto_nombre}" de esta competencia.`,
      showCancelButton: true,
      confirmButtonText: "Sí, quitar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteAsoc(item.id).unwrap();
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

  const lista = asociaciones?.results ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {lista.length === 0
            ? "Ningún puesto vinculado aún"
            : `${lista.length} puesto${lista.length !== 1 ? "s" : ""} vinculado${lista.length !== 1 ? "s" : ""}`}
        </p>
        {!showForm && disponibles.length > 0 && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0056D2] bg-[#F0F6FF] rounded-lg hover:bg-[#e0edff] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar puesto
          </button>
        )}
      </div>

      {/* Lista de puestos vinculados */}
      {lista.length > 0 && (
        <ul className="space-y-2">
          {lista.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100"
            >
              <div className="flex items-center gap-2.5">
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {item.puesto_nombre}
                  </p>
                  <p className="text-xs text-gray-400">{item.nivel_nombre}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(item)}
                className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500"
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
          <p className="text-sm font-medium text-gray-700">Vincular puesto</p>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Puesto</label>
            <select
              value={puestoId}
              onChange={(e) => setPuestoId(Number(e.target.value))}
              className={selectCls}
            >
              <option value={0}>Seleccionar puesto…</option>
              {disponibles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Nivel requerido
            </label>
            <select
              value={nivelId}
              onChange={(e) => setNivelId(Number(e.target.value))}
              className={selectCls}
            >
              <option value={0}>Seleccionar nivel…</option>
              {niveles?.results.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleAdd}
              disabled={!puestoId || !nivelId || adding}
              className="flex-1 py-2 text-sm font-medium text-white bg-[#1c2634] rounded-lg hover:bg-[#1c2634]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {adding ? "Agregando…" : "Agregar"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setPuestoId(0);
                setNivelId(0);
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
            <Zap className="w-5 h-5 text-gray-300" />
          </div>
          <p className="text-sm text-gray-400">
            Ningún puesto requiere esta competencia aún
          </p>
        </div>
      )}
    </div>
  );
}

// ── helpers locales ───────────────────────────────────────────

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
