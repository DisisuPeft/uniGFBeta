"use client";

import useFormCampania from "@/hooks/control-escolar/use-form-campania";
import { Modal } from "../../common/modal";
import { useState } from "react";
import { useGetProgramasGenericoQuery } from "@/redux/features/control-escolar/genericosApiSlice";
import { sweetAlert } from "@/sweetalert/sweetalerts";
import {
  Plus,
  X,
  Tag,
  CalendarRange,
  BookOpen,
  DollarSign,
  Building2,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";

// ── Primitives ────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 rounded-md bg-[#F0F6FF] flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-[#0056D2]" />
      </div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
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
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors";

const selectClass =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors";

// ── Main component ────────────────────────────────────────────────────

export default function CreateCampanias() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    programas,
    institutos,
  } = useFormCampania(() => setOpen(false));

  const { isError } = useGetProgramasGenericoQuery();

  const handleNewCampania = () => {
    if (isError) {
      sweetAlert(
        "warning",
        "No se pueden crear campañas si no existen programas educativos definidos",
        "Alerta",
      );
    } else {
      setOpen(true);
    }
  };

  return (
    <div>
      <button
        onClick={handleNewCampania}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] transition-colors"
      >
        <Plus className="w-4 h-4" />
        Nueva Campaña
      </button>

      <Modal show={open} onClose={() => setOpen(false)} maxWidth="lg">
        <div className="flex flex-col max-h-[85vh]">
          {/* Modal header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Nueva Campaña
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Completa los datos para registrar la campaña
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto px-6 py-5 space-y-6"
          >
            {/* Información general */}
            <div>
              <SectionHeader icon={Tag} title="Información general" />
              <div className="space-y-4">
                <Field
                  label="Nombre"
                  required
                  error={errors.nombre?.message}
                >
                  <input
                    {...register("nombre", {
                      required: "Este campo es requerido",
                      minLength: { value: 2, message: "Mínimo 2 caracteres" },
                      maxLength: { value: 50, message: "Máximo 50 caracteres" },
                    })}
                    type="text"
                    placeholder="Ej. Inscripciones Enero 2025"
                    className={inputClass}
                  />
                </Field>

                <Field label="Descripción" error={errors.descripcion?.message}>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                    <textarea
                      {...register("descripcion")}
                      rows={3}
                      placeholder="Describe el objetivo de la campaña..."
                      className={`${inputClass} pl-10 resize-none`}
                    />
                  </div>
                </Field>
              </div>
            </div>

            {/* Vigencia */}
            <div>
              <SectionHeader icon={CalendarRange} title="Vigencia" />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Fecha de inicio"
                  required
                  error={errors.fecha_inicio?.message}
                >
                  <input
                    {...register("fecha_inicio", {
                      required: "La fecha de inicio es requerida",
                    })}
                    type="date"
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Fecha de cierre"
                  required
                  error={errors.fecha_fin?.message}
                >
                  <input
                    {...register("fecha_fin", {
                      required: "La fecha de cierre es requerida",
                    })}
                    type="date"
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>

            {/* Configuración */}
            <div>
              <SectionHeader icon={BookOpen} title="Configuración" />
              <div className="space-y-4">
                <Field
                  label="Programa"
                  required
                  error={errors.programa?.message}
                >
                  <select
                    {...register("programa", {
                      required: "Selecciona un programa",
                    })}
                    className={selectClass}
                  >
                    <option value="">Selecciona un programa</option>
                    {programas?.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Instituto"
                  required
                  error={errors.instituto?.message}
                >
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select
                      {...register("instituto", {
                        required: "Selecciona un instituto",
                      })}
                      className={`${selectClass} pl-10`}
                    >
                      <option value="">Selecciona un instituto</option>
                      {institutos?.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </Field>

                <Field
                  label="Costo asignado"
                  required
                  error={errors.costo_asignado?.message}
                >
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      {...register("costo_asignado", {
                        required: "El costo es requerido",
                        valueAsNumber: true,
                        min: { value: 0, message: "Debe ser mayor o igual a 0" },
                      })}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </Field>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#0056D2] rounded-lg hover:bg-[#004BB5] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Crear campaña"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}