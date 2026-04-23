"use client";

import { useLeadForm } from "@/hooks";
import { User, Mail, Phone, Briefcase, FileText, Loader2 } from "lucide-react";

// ── Shared primitives ────────────────────────────────────────────────

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
    <div className="flex items-start gap-3 pb-4 border-b border-gray-100 mb-5">
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
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed";

const selectClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed";

// ── Form ─────────────────────────────────────────────────────────────

export default function NewLeadForm() {
  const {
    register,
    watch,
    errors,
    isSubmitting,
    handleSubmit,
    onSubmit,
    etapas,
    estatus,
    fuentes,
    programas,
    campanias,
  } = useLeadForm();

  const programaSeleccionado = watch("programa_objetivo");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Lead</h1>
        <p className="text-sm text-gray-500 mt-1">
          Registra los datos del prospecto para iniciar el seguimiento
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Datos personales */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <SectionHeader
            icon={User}
            title="Datos Personales"
            description="Nombre completo del prospecto"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Field label="Nombre" required error={errors.nombre?.message}>
              <input
                {...register("nombre")}
                placeholder="Ej. Juan"
                className={inputClass}
              />
            </Field>
            <Field
              label="Apellido Paterno"
              required
              error={errors.apellido_paterno?.message}
            >
              <input
                {...register("apellido_paterno")}
                placeholder="Ej. Pérez"
                className={inputClass}
              />
            </Field>
            <Field
              label="Apellido Materno"
              error={errors.apellido_materno?.message}
            >
              <input
                {...register("apellido_materno")}
                placeholder="Ej. García"
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        {/* Datos de contacto */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <SectionHeader
            icon={Mail}
            title="Datos de Contacto"
            description="Medios para comunicarse con el prospecto"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Email" required error={errors.correo?.message}>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  {...register("correo")}
                  placeholder="correo@ejemplo.com"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>
            <Field
              label="Teléfono (10 dígitos)"
              required
              error={errors.telefono?.message}
            >
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="tel"
                  {...register("telefono")}
                  placeholder="9612345678"
                  maxLength={10}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>
            <Field
              label="Contacto alterno"
              error={errors.contacto_alterno?.message}
            >
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="tel"
                  {...register("contacto_alterno")}
                  placeholder="Teléfono adicional"
                  maxLength={10}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>
          </div>
        </div>

        {/* Información comercial */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <SectionHeader
            icon={Briefcase}
            title="Información Comercial"
            description="Clasificación y asignación del lead en el pipeline"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Fuente" required error={errors.fuente?.message}>
              <select {...register("fuente")} className={selectClass}>
                <option value="">Canal de ingreso</option>
                {fuentes?.results.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nombre}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Etapa inicial" required error={errors.etapa?.message}>
              <select {...register("etapa")} className={selectClass}>
                <option value="">Selecciona la etapa</option>
                {etapas?.results?.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Estatus inicial"
              required
              error={errors.estatus?.message}
            >
              <select {...register("estatus")} className={selectClass}>
                <option value="">Selecciona el estatus</option>
                {estatus?.results?.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Programa de interés"
              required
              error={errors.programa_objetivo?.message}
            >
              <select
                {...register("programa_objetivo")}
                className={selectClass}
              >
                <option value="">Selecciona el programa</option>
                {programas?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Campaña" required error={errors.campania?.message}>
              <select
                {...register("campania")}
                disabled={!programaSeleccionado}
                className={selectClass}
              >
                <option value="">
                  {programaSeleccionado
                    ? "Selecciona la campaña"
                    : "Primero selecciona un programa"}
                </option>
                {campanias?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        {/* Notas */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <SectionHeader
            icon={FileText}
            title="Notas Adicionales"
            description="Información complementaria sobre el prospecto"
          />
          <textarea
            {...register("notas")}
            rows={4}
            placeholder="Agrega cualquier información relevante sobre el prospecto..."
            className={inputClass}
          />
          {errors.notas && (
            <p className="text-xs text-red-500 mt-1">{errors.notas.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 pb-8">
          <button
            type="button"
            onClick={() => window.history.back()}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creando...
              </>
            ) : (
              "Crear Lead"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
