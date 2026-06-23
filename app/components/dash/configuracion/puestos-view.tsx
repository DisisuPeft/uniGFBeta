"use client";

import { useState } from "react";
import {
  Briefcase,
  Edit2,
  Trash2,
  Plus,
  X,
  Loader2,
  Zap,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";
import { DataTable } from "@/app/utils/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ActiveBadge } from "./departamentos-view";
import {
  useGetPuestosQuery,
  useCreatePuestoMutation,
  useUpdatePuestoMutation,
  useDeletePuestoMutation,
  useGetDepartamentosQuery,
} from "@/redux/features/sistema/sistemaApiSlice";
import { Puesto, PuestoForm } from "@/redux/features/types/sistema/types";
import {
  useGetCompetenciasPuestoByPuestoQuery,
  useCreateCompetenciaPuestoMutation,
  useUpdateCompetenciaPuestoMutation,
  useDeleteCompetenciaPuestoMutation,
} from "@/redux/features/competencias/competenciasApiSlice";
import { useGetCompetenciasQuery } from "@/redux/features/competencias/competenciasApiSlice";
import { useGetNivelesCompetenciaQuery } from "@/redux/features/catalogos/genericosApiSlice";
import { CompetenciaPuesto } from "@/redux/features/types/competencias/types";

type Tab = "info" | "competencias";

const FORM_ID = "puesto-form";
const EMPTY: PuestoForm = {
  departamento: 0,
  nombre: "",
  codigo: "",
  descripcion: "",
  activo: true,
};

export default function PuestosView() {
  const { data, isLoading } = useGetPuestosQuery();
  const { data: departamentos } = useGetDepartamentosQuery();
  const [create, { isLoading: creating }] = useCreatePuestoMutation();
  const [update, { isLoading: updating }] = useUpdatePuestoMutation();
  const [remove] = useDeletePuestoMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Puesto | null>(null);
  const [form, setForm] = useState<PuestoForm>(EMPTY);
  const [activeTab, setActiveTab] = useState<Tab>("info");

  const isEditing = !!selected;
  const isSaving = creating || updating;

  function openCreate() {
    setSelected(null);
    setForm(EMPTY);
    setActiveTab("info");
    setDrawerOpen(true);
  }
  function openEdit(p: Puesto) {
    setSelected(p);
    setForm({
      departamento: p.departamento,
      nombre: p.nombre,
      codigo: p.codigo,
      descripcion: p.descripcion ?? "",
      activo: p.activo,
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
    try {
      if (isEditing) {
        await update({ id: selected!.id, body: form }).unwrap();
        Swal.fire({ icon: "success", title: "Puesto actualizado", timer: 1500, showConfirmButton: false });
      } else {
        await create(form).unwrap();
        Swal.fire({ icon: "success", title: "Puesto creado", timer: 1500, showConfirmButton: false });
      }
      closeDrawer();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar." });
    }
  }

  async function handleDelete(p: Puesto) {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar puesto?",
      text: `"${p.nombre}" quedará desactivado.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    try {
      await remove(p.id).unwrap();
      Swal.fire({ icon: "success", title: "Eliminado", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar." });
    }
  }

  const columns: ColumnDef<Puesto>[] = [
    {
      id: "puesto",
      header: "Puesto",
      cell: ({ row: { original: p } }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{p.nombre}</p>
          <p className="text-xs text-gray-400 font-mono">{p.codigo}</p>
        </div>
      ),
    },
    {
      id: "departamento",
      header: "Departamento",
      cell: ({ row: { original: p } }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
          {p.departamento_nombre}
        </span>
      ),
    },
    {
      id: "descripcion",
      header: "Descripción",
      cell: ({ row: { original: p } }) => (
        <span className="text-sm text-gray-500 line-clamp-1">{p.descripcion ?? "—"}</span>
      ),
    },
    {
      id: "activo",
      header: "Estado",
      cell: ({ row: { original: p } }) => <ActiveBadge activo={p.activo} />,
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

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Puestos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Cargos y posiciones por departamento
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#1c2634] text-white text-sm font-medium rounded-lg hover:bg-[#1c2634]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo puesto
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 w-fit">
        <div className="w-10 h-10 bg-[#F0F6FF] rounded-lg flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-[#0056D2]" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{data?.count}</p>
          <p className="text-xs text-gray-500">Total puestos</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        count={data?.count ?? 0}
        pageSize={100}
        filters={[{ type: "search", key: "search", placeholder: "Buscar puesto…" }]}
        emptyIcon={Briefcase}
        emptyMessage="No hay puestos registrados"
      />

      {/* Drawer con tabs */}
      <PuestoDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        isEditing={isEditing}
        selected={selected}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        form={form}
        setForm={setForm}
        departamentos={departamentos?.results ?? []}
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
  selected: Puesto | null;
  activeTab: Tab;
  onTabChange: (t: Tab) => void;
  form: PuestoForm;
  setForm: React.Dispatch<React.SetStateAction<PuestoForm>>;
  departamentos: { id: number; nombre: string }[];
  isSaving: boolean;
  onSubmit: (ev: React.FormEvent<HTMLFormElement>) => void;
}

function PuestoDrawer({
  open,
  onClose,
  isEditing,
  selected,
  activeTab,
  onTabChange,
  form,
  setForm,
  departamentos,
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
            {isEditing ? selected?.nombre : "Nuevo puesto"}
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
            {(["info", "competencias"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => onTabChange(t)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors -mb-px ${
                  activeTab === t
                    ? "text-[#0056D2] border-b-2 border-[#0056D2] bg-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "info" ? "Información" : "Competencias"}
              </button>
            ))}
          </div>
        )}

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === "info" || !isEditing ? (
            <InfoTab
              form={form}
              setForm={setForm}
              departamentos={departamentos}
              onSubmit={onSubmit}
            />
          ) : (
            <CompetenciasTab puestoId={selected!.id} />
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
  departamentos,
  onSubmit,
}: {
  form: PuestoForm;
  setForm: React.Dispatch<React.SetStateAction<PuestoForm>>;
  departamentos: { id: number; nombre: string }[];
  onSubmit: (ev: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form id={FORM_ID} onSubmit={onSubmit} className="space-y-4">
      <Field label="Departamento" required>
        <select
          required
          value={form.departamento || ""}
          onChange={(e) => setForm((f) => ({ ...f, departamento: Number(e.target.value) }))}
          className={inputCls}
        >
          <option value="">Seleccionar departamento…</option>
          {departamentos.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nombre}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Nombre del puesto" required>
        <input
          required
          value={form.nombre}
          onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
          placeholder="Gerente de Recursos Humanos"
          className={inputCls}
        />
      </Field>
      <Field label="Código" required>
        <input
          required
          value={form.codigo}
          onChange={(e) => setForm((f) => ({ ...f, codigo: e.target.value }))}
          placeholder="gerente-rh"
          className={inputCls}
        />
        <p className="text-xs text-gray-400 mt-1">Debe ser único dentro del departamento</p>
      </Field>
      <Field label="Descripción">
        <textarea
          value={form.descripcion ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
          placeholder="Responsabilidades del puesto…"
          rows={3}
          className={inputCls + " resize-none"}
        />
      </Field>
      <Field label="Estado">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, activo: !f.activo }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.activo ? "bg-emerald-500" : "bg-gray-300"}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.activo ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
          <span className="text-sm text-gray-600">{form.activo ? "Activo" : "Inactivo"}</span>
        </div>
      </Field>
    </form>
  );
}

// ── Tab: Competencias ─────────────────────────────────────────

function CompetenciasTab({ puestoId }: { puestoId: number }) {
  const { data: asociaciones, isLoading } = useGetCompetenciasPuestoByPuestoQuery(puestoId);
  const { data: todasLasCompetencias } = useGetCompetenciasQuery();
  const { data: niveles } = useGetNivelesCompetenciaQuery();
  const [createAsoc, { isLoading: adding }] = useCreateCompetenciaPuestoMutation();
  const [updateAsoc] = useUpdateCompetenciaPuestoMutation();
  const [deleteAsoc] = useDeleteCompetenciaPuestoMutation();

  const [showForm, setShowForm] = useState(false);
  const [competenciaId, setCompetenciaId] = useState<number>(0);
  const [nivelId, setNivelId] = useState<number>(0);

  const linkedIds = asociaciones?.results?.map((a) => a.competencia) ?? [];
  const disponibles = (todasLasCompetencias?.results ?? []).filter(
    (c) => !linkedIds.includes(c.id),
  );

  async function handleAdd() {
    if (!competenciaId || !nivelId) return;
    try {
      await createAsoc({ competencia: competenciaId, puesto: puestoId, nivel: nivelId }).unwrap();
      setCompetenciaId(0);
      setNivelId(0);
      setShowForm(false);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo agregar la competencia." });
    }
  }

  async function handleNivelChange(item: CompetenciaPuesto, newNivelId: number) {
    if (!newNivelId || newNivelId === item.nivel) return;
    try {
      await updateAsoc({ id: item.id, body: { nivel: newNivelId } }).unwrap();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el nivel." });
    }
  }

  async function handleRemove(item: CompetenciaPuesto) {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Quitar competencia?",
      text: `Se quitará "${item.competencia_nombre}" de este puesto.`,
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
  const nivelesOpts = niveles?.results ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {lista.length === 0
            ? "Ninguna competencia asignada aún"
            : `${lista.length} competencia${lista.length !== 1 ? "s" : ""} asignada${lista.length !== 1 ? "s" : ""}`}
        </p>
        {!showForm && disponibles.length > 0 && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0056D2] bg-[#F0F6FF] rounded-lg hover:bg-[#e0edff] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar competencia
          </button>
        )}
      </div>

      {/* Lista de competencias asignadas */}
      {lista.length > 0 && (
        <ul className="space-y-2">
          {lista.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <p className="text-sm font-medium text-gray-800 truncate">
                  {item.competencia_nombre}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                <select
                  value={item.nivel}
                  onChange={(e) => handleNivelChange(item, Number(e.target.value))}
                  className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-600 focus:outline-none focus:border-[#0056D2] transition-colors"
                >
                  {nivelesOpts.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.nombre}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleRemove(item)}
                  className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500"
                  title="Quitar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Formulario inline para agregar */}
      {showForm && (
        <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
          <p className="text-sm font-medium text-gray-700">Vincular competencia</p>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Competencia</label>
            <select
              value={competenciaId}
              onChange={(e) => setCompetenciaId(Number(e.target.value))}
              className={selectCls}
            >
              <option value={0}>Seleccionar competencia…</option>
              {disponibles.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nivel requerido</label>
            <select
              value={nivelId}
              onChange={(e) => setNivelId(Number(e.target.value))}
              className={selectCls}
            >
              <option value={0}>Seleccionar nivel…</option>
              {nivelesOpts.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleAdd}
              disabled={!competenciaId || !nivelId || adding}
              className="flex-1 py-2 text-sm font-medium text-white bg-[#1c2634] rounded-lg hover:bg-[#1c2634]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {adding ? "Agregando…" : "Agregar"}
            </button>
            <button
              onClick={() => { setShowForm(false); setCompetenciaId(0); setNivelId(0); }}
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
            Ninguna competencia asignada a este puesto aún
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