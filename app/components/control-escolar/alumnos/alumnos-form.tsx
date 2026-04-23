"use client";

import { useAlumnoForm } from "@/hooks";
import { User, Mail, Phone, BookOpen, MapPin } from "lucide-react";

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
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed";

const selectClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors";

// ── Main form ────────────────────────────────────────────────────────

export default function EstudianteDetallePage() {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    // isSubmitting,
    generos,
    nivelEducativo,
    instituciones,
    estados,
    localidades,
  } = useAlumnoForm();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Estudiante</h1>
        <p className="text-sm text-gray-500 mt-1">
          Completa los datos para registrar al estudiante en el sistema
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* ── Información Personal ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <SectionHeader
            icon={User}
            title="Información Personal"
            description="Datos de identificación del estudiante"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Field
              label="Nombre"
              required
              error={errors.user?.nombre?.message}
            >
              <input
                {...register("user.nombre", {
                  required: "El nombre es requerido",
                })}
                placeholder="Ej. Juan"
                className={inputClass}
              />
            </Field>

            <Field
              label="Apellido Paterno"
              required
              error={errors.user?.apellido_paterno?.message}
            >
              <input
                {...register("user.apellido_paterno", {
                  required: "El apellido paterno es requerido",
                })}
                placeholder="Ej. García"
                className={inputClass}
              />
            </Field>

            <Field
              label="Apellido Materno"
              required
              error={errors.user?.apellido_materno?.message}
            >
              <input
                {...register("user.apellido_materno", {
                  required: "El apellido materno es requerido",
                })}
                placeholder="Ej. López"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
            <Field
              label="Género"
              required
              error={errors.user?.genero?.message}
            >
              <select
                {...register("user.genero", {
                  required: "El género es requerido",
                })}
                className={selectClass}
              >
                <option value="">Seleccionar</option>
                {generos?.results.map((genero) => (
                  <option key={genero.id} value={genero.id}>
                    {genero.nombre}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Fecha de Nacimiento"
              required
              error={errors.user?.fecha_nacimiento?.message}
            >
              <input
                type="date"
                {...register("user.fecha_nacimiento", {
                  required: "La fecha de nacimiento es requerida",
                })}
                className={inputClass}
              />
            </Field>

            <Field label="Edad" error={errors.user?.edad?.message}>
              <div className="relative">
                <input
                  disabled
                  type="number"
                  {...register("user.edad", {
                    required: "La edad es requerida",
                    min: 1,
                  })}
                  className={inputClass}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  años
                </span>
              </div>
            </Field>
          </div>
        </div>

        {/* ── Información de Contacto ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
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
                  type="email"
                  {...register("user.email", {
                    required: "El email es requerido",
                    pattern: { value: /^\S+@\S+$/i, message: "Email inválido" },
                  })}
                  placeholder="correo@ejemplo.com"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>

            <Field
              label="Teléfono"
              required
              error={errors.user?.telefono?.message}
            >
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="tel"
                  {...register("user.telefono", {
                    required: "El teléfono es requerido",
                  })}
                  placeholder="10 dígitos"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>
          </div>
        </div>

        {/* ── Información Académica ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <SectionHeader
            icon={BookOpen}
            title="Información Académica"
            description="Datos de ingreso y trayectoria educativa"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              label="Especialidad"
              required
              error={errors.especialidad?.message}
            >
              <input
                {...register("especialidad", {
                  required: "La especialidad es requerida",
                })}
                placeholder="Ej. Enfermería"
                className={inputClass}
              />
            </Field>

            <Field label="Fecha de Ingreso">
              <input
                type="date"
                {...register("fecha_ingreso")}
                className={inputClass}
              />
            </Field>

            <Field label="Nivel Educativo">
              <select {...register("nivel_educativo")} className={selectClass}>
                <option value="">Seleccionar</option>
                {nivelEducativo?.map((niv) => (
                  <option key={niv.id} value={niv.id}>
                    {niv.nombre}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Institución">
              <select {...register("institucion")} className={selectClass}>
                <option value="">Seleccionar</option>
                {instituciones?.map((ins) => (
                  <option key={ins.id} value={ins.id}>
                    {ins.nombre}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        {/* ── Ubicación ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <SectionHeader
            icon={MapPin}
            title="Ubicación"
            description="Estado y ciudad de residencia"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Estado">
              <select {...register("estado_pais")} className={selectClass}>
                <option value="">Seleccionar estado</option>
                {estados?.map((estado) => (
                  <option key={estado.id} value={estado.id}>
                    {estado.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Ciudad">
              <select {...register("ciudad")} className={selectClass}>
                <option value="">
                  {estados ? "Seleccionar ciudad" : "Selecciona un estado primero"}
                </option>
                {localidades?.map((localidad) => (
                  <option key={localidad.id} value={localidad.id}>
                    {localidad.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center justify-end gap-3 pt-2 pb-8">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] transition-colors"
          >
            Crear Estudiante
          </button>
        </div>
      </form>
    </div>
  );
}