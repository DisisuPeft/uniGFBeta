"use client";

import { useState } from "react";
import { useAlumnoEditForm } from "@/hooks";
import { sweetAlert } from "@/sweetalert/sweetalerts";
import {
  useGetInscripcionesEstudianteQuery,
  useRetrieveEstudianteQuery,
} from "@/redux/features/control-escolar/alumnosApiSlice";
import { Modal } from "../../common/modal";
import StepEstudiante from "./steps";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  MapPin,
  Save,
  Loader2,
  PencilIcon,
  GraduationCap,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

interface Props {
  uuid: string;
}

// ── Primitives (same system as alumnos-form) ─────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-gray-100 mb-6">
      <div className="w-8 h-8 rounded-lg bg-[#F0F6FF] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-[#0056D2]" />
      </div>
      <div>
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed";

const selectClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed";

// ── Profile header ───────────────────────────────────────────────────

function ProfileHeader({
  uuid,
  disabled,
  onEdit,
  onInscribir,
}: {
  uuid: string;
  disabled: boolean;
  onEdit: () => void;
  onInscribir: () => void;
}) {
  const { data: estudiante, isLoading } = useRetrieveEstudianteQuery(uuid);

  const nombre = estudiante
    ? `${estudiante.user_obj?.nombre ?? ""} ${estudiante.user_obj?.apellido_paterno ?? ""} ${estudiante.user_obj?.apellido_materno ?? ""}`.trim()
    : "";

  const initials = nombre
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-2xl bg-[#F0F6FF] flex items-center justify-center flex-shrink-0">
          {isLoading ? (
            <div className="w-8 h-3 bg-gray-200 rounded animate-pulse" />
          ) : (
            <span className="text-xl font-bold text-[#0056D2]">{initials}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-gray-900 truncate">
                {nombre || "—"}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                <span className="text-xs font-mono text-gray-400">
                  {estudiante?.matricula ?? "—"}
                </span>
                {estudiante?.user_obj?.email && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Mail className="w-3 h-3" />
                    {estudiante.user_obj.email}
                  </span>
                )}
                {estudiante?.user_obj?.telefono && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Phone className="w-3 h-3" />
                    {estudiante.user_obj.telefono}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Status + actions */}
        <div className="flex flex-col sm:items-end gap-3 flex-shrink-0">
          {estudiante && (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                estudiante.status === 1
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : "bg-red-50 text-red-700 ring-1 ring-red-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${estudiante.status === 1 ? "bg-emerald-500" : "bg-red-500"}`}
              />
              {estudiante.status === 1 ? "Activo" : "Inactivo"}
            </span>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEdit}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors ${
                !disabled
                  ? "border-[#0056D2] text-[#0056D2] bg-[#F0F6FF]"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <PencilIcon className="w-3.5 h-3.5" />
              {disabled ? "Editar" : "Editando"}
            </button>
            <button
              type="button"
              onClick={onInscribir}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Inscribir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Inscripciones tab ────────────────────────────────────────────────

function InscripcionesTab({ uuid }: { uuid: string }) {
  const { data: inscripciones, isLoading } =
    useGetInscripcionesEstudianteQuery(uuid);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
            <div className="h-2 w-full bg-gray-100 rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (!inscripciones?.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
        <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-500">Sin inscripciones registradas</p>
        <p className="text-xs text-gray-400 mt-1">
          Usa el botón &quot;Inscribir&quot; para agregar al estudiante a un programa
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {inscripciones.map((ins) => {
        const pct =
          ins.total_modulos > 0
            ? Math.round((ins.modulo_actual / ins.total_modulos) * 100)
            : 0;

        const StatusIcon =
          ins.status === 1
            ? CheckCircle2
            : ins.status === 0
              ? Clock
              : AlertCircle;

        const statusColor =
          ins.status === 1
            ? "text-emerald-600"
            : ins.status === 0
              ? "text-amber-500"
              : "text-red-500";

        const barColor =
          pct >= 100
            ? "bg-emerald-500"
            : pct >= 50
              ? "bg-[#0056D2]"
              : "bg-amber-400";

        return (
          <div
            key={ins.ref}
            className="bg-white rounded-xl border border-gray-200 p-5 space-y-4"
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#F0F6FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <GraduationCap className="w-4 h-4 text-[#0056D2]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {ins.programa_nombre}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Campaña: {ins.campania_nombre}
                  </p>
                </div>
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium flex-shrink-0 ${statusColor}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {ins.status === 1 ? "Activo" : ins.status === 0 ? "Pendiente" : "Baja"}
              </span>
            </div>

            {/* Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Progreso del programa</span>
                <span className="font-medium">
                  Módulo {ins.modulo_actual} de {ins.total_modulos}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${barColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>
                  {ins.fecha_ingreso
                    ? `Inicio: ${new Date(ins.fecha_ingreso).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}`
                    : "Sin fecha de inicio"}
                </span>
                <span className="font-medium text-gray-600">{pct}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────

type Tab = "info" | "inscripciones";

export default function EstudianteEditPage({ uuid }: Props) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("info");

  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    generos,
    nivelEducativo,
    instituciones,
    estados,
    localidades,
    disabled,
  } = useAlumnoEditForm(uuid);

  const handleEdit = () => {
    sweetAlert(
      "info",
      "En breve se podra editar la informacion del estudiante",
      "Alerta",
    );
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "info", label: "Información personal" },
    { key: "inscripciones", label: "Inscripciones" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      {/* Profile header card */}
      <ProfileHeader
        uuid={uuid}
        disabled={disabled}
        onEdit={handleEdit}
        onInscribir={() => setOpen(true)}
      />

      <Modal show={open} onClose={() => setOpen(false)}>
        <StepEstudiante estudianteId={uuid} onClose={(v) => setOpen(v)} />
      </Modal>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-[#0056D2] text-[#0056D2]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === "inscripciones" ? (
            <InscripcionesTab uuid={uuid} />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Editing banner */}
              {!disabled && (
                <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                  <PencilIcon className="w-4 h-4 flex-shrink-0" />
                  Modo edición activo — los cambios se guardan al presionar{" "}
                  <strong>Guardar cambios</strong>
                </div>
              )}

              {/* Personal */}
              <div>
                <SectionHeader
                  icon={User}
                  title="Información Personal"
                  description="Datos de identificación del estudiante"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <Field label="Nombre" required error={errors.user?.nombre?.message}>
                    <input
                      disabled={disabled}
                      {...register("user.nombre", { required: "El nombre es requerido" })}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Apellido Paterno" required error={errors.user?.apellido_paterno?.message}>
                    <input
                      disabled={disabled}
                      {...register("user.apellido_paterno", { required: "El apellido paterno es requerido" })}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Apellido Materno" required error={errors.user?.apellido_materno?.message}>
                    <input
                      disabled={disabled}
                      {...register("user.apellido_materno", { required: "El apellido materno es requerido" })}
                      className={inputClass}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
                  <Field label="Género" required error={errors.user?.genero?.message}>
                    <select
                      disabled={disabled}
                      {...register("user.genero", { required: "El género es requerido" })}
                      className={selectClass}
                    >
                      <option value="">Seleccionar</option>
                      {generos?.results.map((g) => (
                        <option key={g.id} value={g.id}>{g.nombre}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Fecha de Nacimiento" required error={errors.user?.fecha_nacimiento?.message}>
                    <input
                      disabled={disabled}
                      type="date"
                      {...register("user.fecha_nacimiento", { required: "La fecha de nacimiento es requerida" })}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Edad" error={errors.user?.edad?.message}>
                    <div className="relative">
                      <input
                        disabled
                        type="number"
                        {...register("user.edad", { required: "La edad es requerida", min: 1 })}
                        className={inputClass}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">años</span>
                    </div>
                  </Field>
                </div>
              </div>

              {/* Contact */}
              <div>
                <SectionHeader
                  icon={Mail}
                  title="Información de Contacto"
                  description="Medios para comunicarse con el estudiante"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Email" required error={errors.user?.email?.message}>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        disabled={disabled}
                        type="email"
                        {...register("user.email", {
                          required: "El email es requerido",
                          pattern: { value: /^\S+@\S+$/i, message: "Email inválido" },
                        })}
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </Field>
                  <Field label="Teléfono" required error={errors.user?.telefono?.message}>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        disabled={disabled}
                        type="tel"
                        {...register("user.telefono", { required: "El teléfono es requerido" })}
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </Field>
                </div>
              </div>

              {/* Academic */}
              <div>
                <SectionHeader
                  icon={BookOpen}
                  title="Información Académica"
                  description="Datos de ingreso y trayectoria educativa"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Especialidad" required error={errors.especialidad?.message}>
                    <input
                      disabled={disabled}
                      {...register("especialidad", { required: "La especialidad es requerida" })}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Fecha de Ingreso">
                    <input
                      disabled={disabled}
                      type="date"
                      {...register("fecha_ingreso")}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Nivel Educativo">
                    <select disabled={disabled} {...register("nivel_educativo")} className={selectClass}>
                      <option value="">Seleccionar</option>
                      {nivelEducativo?.map((niv) => (
                        <option key={niv.id} value={niv.id}>{niv.nombre}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Institución">
                    <select disabled={disabled} {...register("institucion")} className={selectClass}>
                      <option value="">Seleccionar</option>
                      {instituciones?.map((ins) => (
                        <option key={ins.id} value={ins.id}>{ins.nombre}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>

              {/* Location */}
              <div>
                <SectionHeader
                  icon={MapPin}
                  title="Ubicación"
                  description="Estado y ciudad de residencia"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Estado">
                    <select disabled={disabled} {...register("estado_pais")} className={selectClass}>
                      <option value="">Seleccionar estado</option>
                      {estados?.map((e) => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Ciudad">
                    <select disabled={disabled} {...register("ciudad")} className={selectClass}>
                      <option value="">
                        {estados ? "Seleccionar ciudad" : "Selecciona un estado primero"}
                      </option>
                      {localidades?.map((l) => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>

              {/* Sticky save bar */}
              {!disabled && (
                <div className="sticky bottom-0 -mx-6 -mb-6 px-6 py-4 bg-white border-t border-gray-200 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Guardar cambios
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}