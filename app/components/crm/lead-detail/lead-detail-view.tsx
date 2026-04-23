"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import {
  useGetLeadQuery,
  useGetInteraccionesQuery,
  useCreateInteraccionMutation,
  useUpdateInteraccionMutation,
  useDeleteInteraccionMutation,
  useGetSeguimientosQuery,
  useCreateSeguimientoMutation,
  useUpdateSeguimientoMutation,
  useCompletarSeguimientoMutation,
  useGetHistorialEtapasQuery,
  useGetVendedoresQuery,
  useAsignarVendedorMutation,
  useDesasignarVendedorMutation,
} from "@/redux/features/crm/leadsApiSlice";
import { useVerifyUserQuery } from "@/redux/features/auth/authApiSlice";
import {
  useGetTiposInteraccionQuery,
  useGetEstadosInteraccionQuery,
  useGetTiposSeguimientoQuery,
  useGetNivelesTemperaturaQuery,
  useGetPipelinesQuery,
} from "@/redux/features/crm/catalogosCrmApiSlice";
import {
  ArrowLeft,
  Mail,
  Phone,
  Flame,
  Thermometer,
  Snowflake,
  Plus,
  CheckCircle2,
  Clock,
  MessageSquare,
  CalendarClock,
  GitBranch,
  Loader2,
  Save,
  Check,
  ImagePlus,
  X,
  Pencil,
  Trash2,
  ChevronDown,
  UserPlus,
  UserMinus,
  CreditCard,
} from "lucide-react";
import {
  InteraccionForm,
  SeguimientoForm,
  SeguimientoProgramado,
  InteraccionLead,
} from "@/redux/features/types/crm/lead-types";
import PlanPagoTab from "./plan-pago-tab";

interface Props {
  uuid: string;
  refParam?: string;
}

type Tab = "info" | "interacciones" | "seguimientos" | "historial" | "plan-pago";

// ── Shared primitives ────────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <div className="text-sm text-gray-900">{children}</div>
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors bg-white";
const selectClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors bg-white text-gray-700";

function TempBadge({
  codigo,
  nombre,
  color,
}: {
  codigo: string;
  nombre: string;
  color: string;
}) {
  const Icon =
    codigo === "caliente" ? Flame : codigo === "frio" ? Snowflake : Thermometer;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${color}18`, color }}
    >
      <Icon className="w-3 h-3" />
      {nombre}
    </span>
  );
}

function timeAgo(dateStr: string) {
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diff === 0) return "hoy";
  if (diff === 1) return "ayer";
  if (diff < 30) return `hace ${diff}d`;
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
  });
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

// ── Info tab ─────────────────────────────────────────────────────────

function EtapasProgress({
  etapas,
  currentEtapaId,
}: {
  etapas: { id: number; nombre: string; orden?: number }[];
  currentEtapaId: number;
}) {
  const currentIndex = etapas.findIndex((e) => e.id === currentEtapaId);

  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className="flex items-center min-w-max gap-0">
        {etapas.map((etapa, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={etapa.id} className="flex items-center">
              {/* Step */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    isDone
                      ? "bg-[#0056D2] text-white"
                      : isCurrent
                        ? "bg-[#0056D2] text-white ring-4 ring-[#0056D2]/20"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isDone ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                  )}
                </div>
                <span
                  className={`text-xs font-medium whitespace-nowrap max-w-[80px] text-center leading-tight ${
                    isCurrent
                      ? "text-[#0056D2]"
                      : isDone
                        ? "text-gray-500"
                        : "text-gray-400"
                  }`}
                >
                  {etapa.nombre}
                </span>
              </div>

              {/* Connector */}
              {index < etapas.length - 1 && (
                <div
                  className={`h-0.5 w-10 mx-1 mb-5 flex-shrink-0 transition-all ${
                    index < currentIndex ? "bg-[#0056D2]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InfoTab({ uuid }: { uuid: string }) {
  const { data: lead, refetch: refetchLead } = useGetLeadQuery(uuid);
  const { data: verify } = useVerifyUserQuery();
  const isSuperUser = verify?.superuser === true;

  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedVendedor, setSelectedVendedor] = useState<number | "">("");

  const { data: vendedores } = useGetVendedoresQuery();
  const [asignarVendedor, { isLoading: isAssigning }] =
    useAsignarVendedorMutation();
  const [desasignarVendedor, { isLoading: isUnassigning }] =
    useDesasignarVendedorMutation();

  const handleAsignar = async () => {
    if (!selectedVendedor || !lead) return;
    await asignarVendedor({
      uuid: lead.uuid,
      vendedor: Number(selectedVendedor),
    });
    setAssignOpen(false);
    setSelectedVendedor("");
    refetchLead();
  };

  const handleDesasignar = async () => {
    if (!lead) return;
    const result = await Swal.fire({
      title: "¿Desasignar vendedor?",
      text: "El lead quedará sin vendedor asignado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0056D2",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, desasignar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    await desasignarVendedor(lead.uuid);
    refetchLead();
  };

  if (!lead) return null;

  return (
    <div className="space-y-6">
      {/* Datos personales */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Datos personales
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Nombre completo">
            {lead.nombre_completo ||
              `${lead.nombre} ${lead.apellido_paterno} ${lead.apellido_materno ?? ""}`}
          </Field>
          <Field label="Email">
            <a
              href={`mailto:${lead.correo}`}
              className="text-[#0056D2] hover:underline"
            >
              {lead.correo}
            </a>
          </Field>
          <Field label="Teléfono">
            <a
              href={`tel:${lead.telefono}`}
              className="text-[#0056D2] hover:underline"
            >
              {lead.telefono}
            </a>
          </Field>
          {lead.contacto_alterno && (
            <Field label="Contacto alterno">{lead.contacto_alterno}</Field>
          )}
        </div>
      </div>

      {/* Datos comerciales */}
      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Información comercial
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Programa de interés">
            {lead.programa_nombre ?? "—"}
          </Field>
          <Field label="Campaña">{lead.campania_nombre ?? "—"}</Field>
          <Field label="Fuente">{lead.fuente_nombre ?? "—"}</Field>
          <Field label="Estatus">{lead.estatus_nombre ?? "—"}</Field>
          <Field label="Temperatura">
            {lead.temperatura_actual ? (
              <TempBadge
                codigo={lead.temperatura_actual.codigo}
                nombre={lead.temperatura_actual.nombre}
                color={lead.temperatura_actual.color}
              />
            ) : (
              "—"
            )}
          </Field>

          {/* Vendedor — interactive */}
          <div className="space-y-1 sm:col-span-2">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Vendedor asignado
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {lead.vendedor_nombre ? (
                <>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F0F6FF] text-[#0056D2] text-sm font-medium text-gray-800">
                    {lead.vendedor_nombre}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAssignOpen((v) => !v);
                      setSelectedVendedor("");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Reasignar
                  </button>
                  {isSuperUser && (
                    <button
                      type="button"
                      onClick={handleDesasignar}
                      disabled={isUnassigning}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-60 transition-colors"
                    >
                      {isUnassigning ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <UserMinus className="w-3.5 h-3.5" />
                      )}
                      Desasignar
                    </button>
                  )}
                </>
              ) : (
                <>
                  <span className="text-sm text-gray-400">Sin asignar</span>
                  <button
                    type="button"
                    onClick={() => setAssignOpen((v) => !v)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0056D2] border border-[#0056D2]/30 rounded-lg hover:bg-[#F0F6FF] transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Asignar vendedor
                  </button>
                </>
              )}
            </div>

            {/* Assign dropdown */}
            {assignOpen && (
              <div className="mt-2 flex items-center gap-2">
                <select
                  className={`${selectClass} max-w-xs`}
                  value={selectedVendedor}
                  onChange={(e) =>
                    setSelectedVendedor(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                >
                  <option value="">Seleccionar vendedor</option>
                  {(vendedores ?? []).map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.nombre_completo}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAsignar}
                  disabled={!selectedVendedor || isAssigning}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-60 transition-colors"
                >
                  {isAssigning ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAssignOpen(false);
                    setSelectedVendedor("");
                  }}
                  className="px-3 py-2 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {lead.notas && (
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Notas
          </h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {lead.notas}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Interacciones tab ─────────────────────────────────────────────────

function InteraccionesTab({
  leadId,
  telefono,
  refetchLead,
}: {
  leadId: number;
  uuid?: string;
  telefono?: string;
  refetchLead?: () => void;
}) {
  const { unidadId } = useAppSelector((state) => state.changeUnidad);
  const { data: verify } = useVerifyUserQuery();
  const isSuperUser = verify?.superuser === true;

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<InteraccionForm>>({
    numero_telefono: telefono ?? "",
  });
  const [evidencia, setEvidencia] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<InteraccionForm>>({});
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingRecibidoId, setTogglingRecibidoId] = useState<number | null>(
    null,
  );
  const [lightbox, setLightbox] = useState<{
    url: string;
    nombre: string;
  } | null>(null);

  const {
    data: interacciones,
    isLoading,
    refetch,
  } = useGetInteraccionesQuery({ lead: leadId });
  const { data: tipos } = useGetTiposInteraccionQuery(
    unidadId ? { instituto: unidadId } : undefined,
  );
  const { data: estados } = useGetEstadosInteraccionQuery(
    unidadId ? { instituto: unidadId } : undefined,
  );
  const { data: temperaturas } = useGetNivelesTemperaturaQuery(
    unidadId ? { instituto: unidadId } : undefined,
  );
  const [createInteraccion, { isLoading: isCreating }] =
    useCreateInteraccionMutation();
  const [updateInteraccion, { isLoading: isUpdating }] =
    useUpdateInteraccionMutation();
  const [deleteInteraccion, { isLoading: isDeleting }] =
    useDeleteInteraccionMutation();

  const tipoActual = tipos?.results?.find((t) => t.id === Number(form.tipo));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setEvidencia(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const clearFile = () => {
    setEvidencia(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    if (!form.tipo || !form.estado || !form.asunto || !form.contenido) return;
    await createInteraccion({
      ...form,
      lead: leadId,
      ...(evidencia ? { evidencia } : {}),
    } as InteraccionForm);
    setForm({ numero_telefono: telefono ?? "" });
    clearFile();
    setOpen(false);
    refetch();
    refetchLead?.();
  };

  const handleStartEdit = (interaccion: InteraccionLead) => {
    setEditingId(interaccion.id);
    setExpandedId(interaccion.id);
    setEditForm({
      tipo: interaccion.tipo,
      estado: interaccion.estado,
      asunto: interaccion.asunto,
      contenido: interaccion.contenido,
      numero_telefono: interaccion.numero_telefono,
      duracion_minutos: interaccion.duracion_minutos,
      temperatura_post: interaccion.temperatura_post,
      proximo_paso: interaccion.proximo_paso,
      mensaje_enviado: interaccion.mensaje_enviado ? 1 : 0,
      mensaje_recibido: interaccion.mensaje_recibido ? 1 : 0,
    });
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    setExpandedId(editingId);
    await updateInteraccion({ id: editingId, data: editForm });
    setEditingId(null);
    setEditForm({});
    refetch();
    refetchLead?.();
  };

  const handleDelete = async (id: number) => {
    await deleteInteraccion(id);
    setDeletingId(null);
    refetch();
  };

  const handleToggleRecibido = async (
    id: number,
    currentValue: boolean,
  ) => {
    setTogglingRecibidoId(id);
    await updateInteraccion({
      id,
      data: { mensaje_recibido: currentValue ? 0 : 1 },
    });
    setTogglingRecibidoId(null);
    refetch();
    refetchLead?.();
  };

  return (
    <div className="space-y-4">
      {/* Create form toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] transition-colors"
      >
        <Plus className="w-4 h-4" />
        Nueva interacción
      </button>

      {open && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Tipo *
              </label>
              <select
                className={selectClass}
                value={form.tipo ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tipo: Number(e.target.value) }))
                }
              >
                <option value="">Seleccionar</option>
                {tipos?.results?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.icono} {t.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Estado *
              </label>
              <select
                className={selectClass}
                value={form.estado ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, estado: Number(e.target.value) }))
                }
              >
                <option value="">Seleccionar</option>
                {estados?.results?.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Asunto *
              </label>
              <input
                className={inputClass}
                value={form.asunto ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, asunto: e.target.value }))
                }
                placeholder="Ej: Llamada de seguimiento"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Contenido *
              </label>
              <textarea
                rows={3}
                className={inputClass}
                value={form.contenido ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contenido: e.target.value }))
                }
                placeholder="Describe la interacción..."
              />
            </div>
            {tipoActual?.requiere_telefono && (
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Teléfono
                </label>
                <input
                  className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`}
                  value={form.numero_telefono ?? ""}
                  readOnly
                />
              </div>
            )}
            {tipoActual?.requiere_duracion && (
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Duración (min)
                </label>
                <input
                  type="number"
                  className={inputClass}
                  value={form.duracion_minutos ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      duracion_minutos: Number(e.target.value),
                    }))
                  }
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Temperatura post
              </label>
              <select
                className={selectClass}
                value={form.temperatura_post ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    temperatura_post: Number(e.target.value),
                  }))
                }
              >
                <option value="">Sin cambio</option>
                {temperaturas?.results?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Próximo paso
              </label>
              <input
                className={inputClass}
                value={form.proximo_paso ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, proximo_paso: e.target.value }))
                }
                placeholder="Ej: Llamar el viernes"
              />
            </div>

            {/* Mensajes */}
            <div className="space-y-3 sm:col-span-2">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Mensajes
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      mensaje_enviado: f.mensaje_enviado === 1 ? 0 : 1,
                    }))
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    form.mensaje_enviado === 1
                      ? "border-[#0056D2] bg-[#F0F6FF] text-[#0056D2]"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      form.mensaje_enviado === 1
                        ? "border-[#0056D2] bg-[#0056D2]"
                        : "border-gray-300"
                    }`}
                  >
                    {form.mensaje_enviado === 1 && (
                      <Check className="w-2.5 h-2.5 text-white" />
                    )}
                  </span>
                  Mensaje enviado
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      mensaje_recibido: f.mensaje_recibido === 1 ? 0 : 1,
                    }))
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    form.mensaje_recibido === 1
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      form.mensaje_recibido === 1
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-gray-300"
                    }`}
                  >
                    {form.mensaje_recibido === 1 && (
                      <Check className="w-2.5 h-2.5 text-white" />
                    )}
                  </span>
                  Mensaje recibido
                </button>
              </div>
            </div>

            {/* Evidencia */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Evidencia (imagen)
              </label>
              {preview ? (
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Evidencia"
                    className="h-32 w-auto rounded-lg border border-gray-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 h-24 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-[#0056D2] hover:bg-[#F0F6FF] transition-colors">
                  <ImagePlus className="w-5 h-5 text-gray-400" />
                  <span className="text-xs text-gray-400">
                    Haz clic para adjuntar una imagen
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isCreating}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-60"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : !interacciones?.results?.length ? (
        <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
          <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Sin interacciones registradas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {interacciones.results.map((interaccion) => (
            <div
              key={interaccion.id}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {interaccion.tipo_detail?.icono}{" "}
                    {interaccion.tipo_detail?.nombre ??
                      `Tipo ${interaccion.tipo}`}
                  </span>
                  {interaccion.estado_detail && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: `${interaccion.estado_detail.color}18`,
                        color: interaccion.estado_detail.color,
                      }}
                    >
                      {interaccion.estado_detail.nombre}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400">
                    {timeAgo(interaccion.fecha_interaccion)}
                  </span>
                  {/* Toggle mensaje recibido — visible para todos */}
                  <button
                    type="button"
                    onClick={() =>
                      handleToggleRecibido(
                        interaccion.id,
                        interaccion.mensaje_recibido,
                      )
                    }
                    disabled={togglingRecibidoId === interaccion.id}
                    title={
                      interaccion.mensaje_recibido
                        ? "Marcar como no recibido"
                        : "Marcar como recibido"
                    }
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border transition-colors disabled:opacity-60 ${
                      interaccion.mensaje_recibido
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "border-gray-200 bg-white text-gray-400 hover:border-emerald-300 hover:text-emerald-600"
                    }`}
                  >
                    {togglingRecibidoId === interaccion.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Check className="w-3 h-3" />
                    )}
                    Recibido
                  </button>
                  {isSuperUser && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(interaccion)}
                        className="p-1 rounded-md text-gray-400 hover:text-[#0056D2] hover:bg-[#F0F6FF] transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeletingId(
                            deletingId === interaccion.id
                              ? null
                              : interaccion.id,
                          )
                        }
                        className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(
                        expandedId === interaccion.id ? null : interaccion.id,
                      )
                    }
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    title={
                      expandedId === interaccion.id ? "Colapsar" : "Ver detalle"
                    }
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expandedId === interaccion.id ||
                        editingId === interaccion.id
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Confirm delete */}
              {deletingId === interaccion.id && (
                <div className="flex items-center gap-2 mb-3 p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-xs text-red-700 flex-1">
                    ¿Eliminar esta interacción?
                  </p>
                  <button
                    type="button"
                    onClick={() => setDeletingId(null)}
                    className="px-2 py-1 text-xs text-gray-600 border border-gray-200 rounded-md hover:bg-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(interaccion.id)}
                    disabled={isDeleting}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 disabled:opacity-60"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                    Eliminar
                  </button>
                </div>
              )}

              {/* Body: only visible when expanded or editing */}
              {(expandedId === interaccion.id ||
                editingId === interaccion.id) && (
                <>
                  {editingId === interaccion.id ? (
                    <div className="space-y-3 pt-2 border-t border-gray-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Tipo
                          </label>
                          <select
                            className={selectClass}
                            value={editForm.tipo ?? ""}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                tipo: Number(e.target.value),
                              }))
                            }
                          >
                            {tipos?.results?.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.icono} {t.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Estado
                          </label>
                          <select
                            className={selectClass}
                            value={editForm.estado ?? ""}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                estado: Number(e.target.value),
                              }))
                            }
                          >
                            {estados?.results?.map((e) => (
                              <option key={e.id} value={e.id}>
                                {e.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Asunto
                          </label>
                          <input
                            className={inputClass}
                            value={editForm.asunto ?? ""}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                asunto: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Contenido
                          </label>
                          <textarea
                            rows={3}
                            className={inputClass}
                            value={editForm.contenido ?? ""}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                contenido: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Próximo paso
                          </label>
                          <input
                            className={inputClass}
                            value={editForm.proximo_paso ?? ""}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                proximo_paso: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Temperatura post
                          </label>
                          <select
                            className={selectClass}
                            value={editForm.temperatura_post ?? ""}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                temperatura_post: Number(e.target.value),
                              }))
                            }
                          >
                            <option value="">Sin cambio</option>
                            {temperaturas?.results?.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Mensajes
                          </p>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                setEditForm((f) => ({
                                  ...f,
                                  mensaje_enviado:
                                    f.mensaje_enviado === 1 ? 0 : 1,
                                }))
                              }
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                                editForm.mensaje_enviado === 1
                                  ? "border-[#0056D2] bg-[#F0F6FF] text-[#0056D2]"
                                  : "border-gray-200 bg-white text-gray-500"
                              }`}
                            >
                              <span
                                className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                  editForm.mensaje_enviado === 1
                                    ? "border-[#0056D2] bg-[#0056D2]"
                                    : "border-gray-300"
                                }`}
                              >
                                {editForm.mensaje_enviado === 1 && (
                                  <Check className="w-2 h-2 text-white" />
                                )}
                              </span>
                              Enviado
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setEditForm((f) => ({
                                  ...f,
                                  mensaje_recibido:
                                    f.mensaje_recibido === 1 ? 0 : 1,
                                }))
                              }
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                                editForm.mensaje_recibido === 1
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                  : "border-gray-200 bg-white text-gray-500"
                              }`}
                            >
                              <span
                                className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                  editForm.mensaje_recibido === 1
                                    ? "border-emerald-500 bg-emerald-500"
                                    : "border-gray-300"
                                }`}
                              >
                                {editForm.mensaje_recibido === 1 && (
                                  <Check className="w-2 h-2 text-white" />
                                )}
                              </span>
                              Recibido
                            </button>
                          </div>
                        </div>

                        {/* Evidencia actual */}
                        {(interaccion.archivos_detail?.length ?? 0) > 0 && (
                          <div className="space-y-1.5 sm:col-span-2">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Evidencia actual
                            </p>
                            <div className="flex flex-wrap gap-3">
                              {interaccion.archivos_detail?.map((archivo) => (
                                <div key={archivo.id} className="inline-block">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={archivo.preview_url}
                                    alt={archivo.original_name}
                                    onClick={() =>
                                      setLightbox({
                                        url: archivo.preview_url,
                                        nombre: archivo.original_name,
                                      })
                                    }
                                    className="h-36 w-auto rounded-lg border border-gray-200 object-cover cursor-zoom-in hover:opacity-90 transition-opacity"
                                  />
                                  <p className="text-xs text-gray-400 mt-1 truncate max-w-[180px]">
                                    {archivo.original_name}
                                  </p>
                                  <p className="text-xs text-gray-300">
                                    {archivo.size_formatted}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => {
                            setExpandedId(editingId);
                            setEditingId(null);
                          }}
                          className="px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={handleUpdate}
                          disabled={isUpdating}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-60"
                        >
                          {isUpdating ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Save className="w-3 h-3" />
                          )}
                          Guardar cambios
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-3 mt-1 border-t border-gray-100 space-y-3 text-sm">
                      {/* Asunto + contenido */}
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                          Asunto
                        </p>
                        <p className="text-gray-800 font-medium">
                          {interaccion.asunto}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                          Contenido
                        </p>
                        <p className="text-gray-600 whitespace-pre-wrap">
                          {interaccion.contenido}
                        </p>
                      </div>

                      {/* Grid: duracion, telefono, temperatura */}
                      <div className="grid grid-cols-2 gap-3">
                        {interaccion.duracion_minutos != null && (
                          <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                              Duración
                            </p>
                            <p className="text-gray-700">
                              {interaccion.duracion_minutos} min
                            </p>
                          </div>
                        )}
                        {interaccion.numero_telefono && (
                          <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                              Teléfono
                            </p>
                            <p className="text-gray-700">
                              {interaccion.numero_telefono}
                            </p>
                          </div>
                        )}
                        {interaccion.temperatura_post_detail && (
                          <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                              Temperatura post
                            </p>
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${interaccion.temperatura_post_detail.color}18`,
                                color:
                                  interaccion.temperatura_post_detail.color,
                              }}
                            >
                              {interaccion.temperatura_post_detail.nombre}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                            Mensajes
                          </p>
                          <div className="flex gap-2">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                interaccion.mensaje_enviado
                                  ? "bg-[#F0F6FF] text-[#0056D2]"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              Enviado
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                interaccion.mensaje_recibido
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              Recibido
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Próximo paso */}
                      {interaccion.proximo_paso && (
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                            Próximo paso
                          </p>
                          <p className="text-[#0056D2] text-sm">
                            → {interaccion.proximo_paso}
                          </p>
                        </div>
                      )}

                      {/* Evidencia */}
                      {(interaccion.archivos_detail?.length ?? 0) > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                            Evidencia
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {interaccion.archivos_detail?.map((archivo) => (
                              <div key={archivo.id} className="inline-block">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={archivo.preview_url}
                                  alt={archivo.original_name}
                                  onClick={() =>
                                    setLightbox({
                                      url: archivo.preview_url,
                                      nombre: archivo.original_name,
                                    })
                                  }
                                  className="h-28 w-auto rounded-lg border border-gray-200 object-cover cursor-zoom-in hover:opacity-90 transition-opacity"
                                />
                                <p className="text-xs text-gray-400 mt-1 truncate max-w-[160px]">
                                  {archivo.original_name}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 p-1.5 rounded-full text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.url}
              alt={lightbox.nombre}
              className="max-h-[80vh] w-auto rounded-xl object-contain shadow-2xl"
            />
            <p className="text-white/60 text-xs mt-3 truncate max-w-full">
              {lightbox.nombre}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Seguimientos tab ──────────────────────────────────────────────────

function SeguimientosTab({ leadId }: { leadId: number }) {
  const { unidadId } = useAppSelector((state) => state.changeUnidad);
  const { data: verify } = useVerifyUserQuery();
  const isSuperUser = verify?.superuser === true;

  const [open, setOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [form, setForm] = useState<Partial<SeguimientoForm>>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<SeguimientoForm>>({});

  const {
    data: seguimientos,
    isLoading,
    refetch,
  } = useGetSeguimientosQuery({ lead: leadId, completado: showCompleted });
  const { data: tipos } = useGetTiposSeguimientoQuery(
    unidadId ? { instituto: unidadId } : undefined,
  );
  const [createSeguimiento, { isLoading: isCreating }] =
    useCreateSeguimientoMutation();
  const [updateSeguimiento, { isLoading: isUpdating }] =
    useUpdateSeguimientoMutation();
  const [completar] = useCompletarSeguimientoMutation();

  const handleSubmit = async () => {
    if (!form.tipo || !form.fecha_programada || !form.descripcion) return;
    await createSeguimiento({ ...form, lead: leadId } as SeguimientoForm);
    setForm({});
    setOpen(false);
    refetch();
  };

  const handleCompletar = async (
    id: number,
    yaCompletado: boolean,
    fechaProgramada: string,
  ) => {
    if (yaCompletado) {
      await Swal.fire({
        title: "Ya completado",
        text: "Este seguimiento ya fue marcado como completado.",
        icon: "info",
        confirmButtonColor: "#0056D2",
        confirmButtonText: "Entendido",
      });
      return;
    }

    const ahora = new Date();
    const fecha = new Date(fechaProgramada);
    if (ahora < fecha) {
      const fechaFormateada = fecha.toLocaleDateString("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      await Swal.fire({
        title: "Aún no es momento",
        text: `Este seguimiento podrá completarse a partir del ${fechaFormateada}.`,
        icon: "warning",
        confirmButtonColor: "#0056D2",
        confirmButtonText: "Entendido",
      });
      return;
    }

    const result = await Swal.fire({
      title: "¿Completar seguimiento?",
      text: "Esta acción marcará el seguimiento como completado.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0056D2",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, completar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    await completar(id);
    refetch();
  };

  const handleStartEdit = (seg: SeguimientoProgramado) => {
    setEditingId(seg.id);
    setExpandedId(seg.id);
    setEditForm({
      tipo: seg.tipo,
      fecha_programada: seg.fecha_programada,
      descripcion: seg.descripcion,
      responsable: seg.responsable,
    });
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    setExpandedId(editingId);
    await updateSeguimiento({ id: editingId, data: editForm });
    setEditingId(null);
    setEditForm({});
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Programar seguimiento
        </button>
        <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setShowCompleted(false)}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              !showCompleted
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Pendientes
          </button>
          <button
            type="button"
            onClick={() => setShowCompleted(true)}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              showCompleted
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Completados
          </button>
        </div>
      </div>

      {open && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Tipo *
              </label>
              <select
                className={selectClass}
                value={form.tipo ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tipo: Number(e.target.value) }))
                }
              >
                <option value="">Seleccionar</option>
                {tipos?.results?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Fecha programada *
              </label>
              <input
                type="datetime-local"
                className={inputClass}
                value={form.fecha_programada ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fecha_programada: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Descripción *
              </label>
              <textarea
                rows={2}
                className={inputClass}
                value={form.descripcion ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, descripcion: e.target.value }))
                }
                placeholder="¿Qué se va a hacer?"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isCreating}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-60"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Guardar
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : !seguimientos?.results?.length ? (
        <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
          <CalendarClock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">
            {showCompleted
              ? "Sin seguimientos completados"
              : "Sin seguimientos pendientes"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {seguimientos.results.map((seg) => {
            const isPast = new Date(seg.fecha_programada) < new Date();
            const isExpanded = expandedId === seg.id || editingId === seg.id;
            return (
              <div
                key={seg.id}
                className="bg-white rounded-xl border border-gray-200 p-4"
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isPast ? "bg-red-50" : "bg-amber-50"}`}
                    >
                      <Clock
                        className={`w-4 h-4 ${isPast ? "text-red-500" : "text-amber-500"}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {/* {seg.tipo_detail?.icono}{" "} */}
                        {seg.tipo_detail?.nombre ?? `Tipo ${seg.tipo}`}
                      </p>
                      <p
                        className={`text-xs mt-0.5 font-medium ${isPast ? "text-red-500" : "text-amber-600"}`}
                      >
                        {new Date(seg.fecha_programada).toLocaleDateString(
                          "es-MX",
                          {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                        {isPast && " · Vencido"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() =>
                        handleCompletar(
                          seg.id,
                          seg.completado,
                          seg.fecha_programada,
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completar
                    </button>
                    {isSuperUser && (
                      <button
                        type="button"
                        onClick={() => handleStartEdit(seg)}
                        className="p-1 rounded-md text-gray-400 hover:text-[#0056D2] hover:bg-[#F0F6FF] transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : seg.id)}
                      className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      title={isExpanded ? "Colapsar" : "Ver detalle"}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Body */}
                {isExpanded && (
                  <>
                    {editingId === seg.id ? (
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Tipo
                            </label>
                            <select
                              className={selectClass}
                              value={editForm.tipo ?? ""}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  tipo: Number(e.target.value),
                                }))
                              }
                            >
                              {tipos?.results?.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.icono} {t.nombre}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Fecha programada
                            </label>
                            <input
                              type="datetime-local"
                              className={inputClass}
                              value={editForm.fecha_programada ?? ""}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  fecha_programada: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Descripción
                            </label>
                            <textarea
                              rows={3}
                              className={inputClass}
                              value={editForm.descripcion ?? ""}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  descripcion: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => {
                              setExpandedId(editingId);
                              setEditingId(null);
                            }}
                            className="px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={handleUpdate}
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-60"
                          >
                            {isUpdating ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Save className="w-3 h-3" />
                            )}
                            Guardar cambios
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-3 text-sm">
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                            Descripción
                          </p>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {seg.descripcion}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                              Fecha programada
                            </p>
                            <p className="text-gray-700">
                              {new Date(seg.fecha_programada).toLocaleString(
                                "es-MX",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                          {seg.responsable_nombre && (
                            <div>
                              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                                Responsable
                              </p>
                              <p className="text-gray-700">
                                {seg.responsable_nombre}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Historial tab ─────────────────────────────────────────────────────

function HistorialTab({ leadId }: { leadId: number }) {
  const { data: historial, isLoading } = useGetHistorialEtapasQuery({
    lead: leadId,
  });

  if (isLoading)
    return <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />;

  if (!historial?.results?.length) {
    return (
      <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
        <GitBranch className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-400">Sin historial de movimientos</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-4">
      <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-100" />
      {historial.results.map((h) => (
        <div key={h.id} className="relative">
          <div className="absolute -left-[18px] top-1 w-3 h-3 rounded-full bg-[#0056D2] border-2 border-white" />
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900">
              {h.etapa_nombre ?? `Etapa ${h.etapa}`}
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
              <span>
                Entrada:{" "}
                {new Date(h.fecha_entrada).toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              {h.fecha_salida && (
                <span>
                  Salida:{" "}
                  {new Date(h.fecha_salida).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────

export default function LeadDetailView({ uuid, refParam }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const { data: lead, isLoading, refetch: refetchLead } = useGetLeadQuery(uuid);
  const { unidadId } = useAppSelector((state) => state.changeUnidad);
  const { data: pipelines } = useGetPipelinesQuery(
    unidadId ? { instituto: unidadId } : undefined,
  );
  const etapas = pipelines?.results?.[0]?.etapas ?? [];

  const tabs: {
    key: Tab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      key: "info",
      label: "Información",
      icon: ({ className }) => <span className={className}>📋</span>,
    },
    { key: "interacciones", label: "Interacciones", icon: MessageSquare },
    { key: "seguimientos", label: "Seguimientos", icon: CalendarClock },
    { key: "historial", label: "Historial", icon: GitBranch },
    { key: "plan-pago", label: "Plan de Pago", icon: CreditCard },
  ];

  const temp = lead?.temperatura_actual;
  const tempColor = temp?.color ?? "#64748b";

  const nombreCompleto = lead
    ? lead.nombre_completo ||
      `${lead.nombre} ${lead.apellido_paterno} ${lead.apellido_materno ?? ""}`.trim()
    : "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      {/* Back */}
      <Link
        href={`/dashboard/crm/menu?ref=${refParam}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al tablero
      </Link>

      {/* Profile header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {isLoading ? (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ) : lead ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-white text-xl font-bold"
              style={{ backgroundColor: tempColor }}
            >
              {initials(nombreCompleto)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900">
                {nombreCompleto}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Mail className="w-3 h-3" /> {lead.correo}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Phone className="w-3 h-3" /> {lead.telefono}
                </span>
              </div>
            </div>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
              {temp && (
                <TempBadge
                  codigo={temp.codigo}
                  nombre={temp.nombre}
                  color={temp.color}
                />
              )}
              {lead.etapa_nombre && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#F0F6FF] text-[#0056D2]">
                  {lead.etapa_nombre}
                </span>
              )}
              {lead.estatus_nombre && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {lead.estatus_nombre}
                </span>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Pipeline progress */}
      {lead && etapas.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Progreso en el pipeline
          </h3>
          <EtapasProgress etapas={etapas} currentEtapaId={lead.etapa} />
        </div>
      )}

      {/* Tabs card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === key
                  ? "border-[#0056D2] text-[#0056D2]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "info" && <InfoTab uuid={uuid} />}
          {activeTab === "interacciones" && lead && (
            <InteraccionesTab
              leadId={lead.id}
              uuid={uuid}
              telefono={lead.telefono}
              refetchLead={refetchLead}
            />
          )}
          {activeTab === "seguimientos" && lead && (
            <SeguimientosTab leadId={lead.id} />
          )}
          {activeTab === "historial" && lead && (
            <HistorialTab leadId={lead.id} />
          )}
          {activeTab === "plan-pago" && lead && (
            <PlanPagoTab
              leadId={lead.id}
              campania={lead.campania}
              instituto={lead.instituto}
              refetchLead={refetchLead}
            />
          )}
        </div>
      </div>
    </div>
  );
}
