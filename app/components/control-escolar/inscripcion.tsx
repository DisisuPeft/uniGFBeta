"use client";

import { Controller } from "react-hook-form";
// import { Modal } from "@/app/components/common/Modal";
// import { Diplomados } from "@/redux/control-escolar/programas-educativos/types";
import { useInscripcionPrograma } from "@/hooks";
import Select from "@/app/ui/components/select";
import MultiSelect from "@/app/ui/components/select-multiple";
// import { PagoFormData } from "@/redux/interface/control_escolar/types/programa-educativo";
import Button from "@/app/ui/components/button";
import { PagoFormData } from "@/redux/features/types/control-escolar/type";
// import { Alert } from "@mui/material";
import { useRetrieveEstudianteQuery } from "@/redux/features/control-escolar/alumnosApiSlice";

export interface Props {
  estudianteId?: string;
  campania?: string;
  setClose: (value: boolean) => void;
}

export default function CourseEnrollment({
  estudianteId,
  campania,
  setClose,
}: Props) {
  const {
    handleSubmit,
    onSubmit,
    register,
    errors,
    tipoPago,
    watch,
    metodoPago,
    setValue,
    control,
    // onSuccess,
  } = useInscripcionPrograma({
    estudianteId: estudianteId,
    campania: campania,
    onSuccess: setClose,
  });

  return (
    <div className="">
      {/* {mensaje && <Alert severity={tipo}>{`${mensaje}`}.</Alert>} */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-10">
        <div className="bg-white p-4 text-center text-black min-w-[600px]">
          <div className="flex flex-col justify-center p-4 mb-4 space-y-4">
            {/* Toggle para activar precios personalizados */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <label
                htmlFor="tiene_precio_custom"
                className="text-sm font-medium text-foreground"
              >
                ¿Aplicar precio personalizado/promoción?
              </label>
              <input
                id="tiene_precio_custom"
                type="checkbox"
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                {...register("tiene_precio_custom")}
                onChange={(e) => {
                  setValue("tiene_precio_custom", e.target.checked);
                  if (!e.target.checked) {
                    // Limpiar precios custom si se desactiva
                    setValue("precios_custom.costo_inscripcion", undefined);
                    setValue("precios_custom.costo_mensualidad", undefined);
                    setValue("precios_custom.costo_documentacion", undefined);
                  }
                }}
              />
            </div>

            {/* Sección de precios personalizados (solo si está activo) */}
            {watch("tiene_precio_custom") && (
              <div className="border border-blue-300 bg-blue-50 rounded-lg p-4 space-y-3">
                <h5 className="text-lg font-semibold text-blue-800 mb-3">
                  Precios Personalizados
                </h5>

                <div>
                  <label
                    htmlFor="costo_inscripcion_custom"
                    className="text-sm font-medium text-foreground"
                  >
                    Costo Inscripción
                  </label>
                  <input
                    id="costo_inscripcion_custom"
                    type="number"
                    step="0.01"
                    placeholder="Precio personalizado de inscripción"
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register("precios_custom.costo_inscripcion", {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                <div>
                  <label
                    htmlFor="costo_mensualidad_custom"
                    className="text-sm font-medium text-foreground"
                  >
                    Costo Mensualidad
                  </label>
                  <input
                    id="costo_mensualidad_custom"
                    type="number"
                    step="0.01"
                    placeholder="Precio personalizado de mensualidad"
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register("precios_custom.costo_mensualidad", {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                <div>
                  <label
                    htmlFor="costo_documentacion_custom"
                    className="text-sm font-medium text-foreground"
                  >
                    Costo Documentación
                  </label>
                  <input
                    id="costo_documentacion_custom"
                    type="number"
                    step="0.01"
                    placeholder="Precio personalizado de documentación"
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register("precios_custom.costo_documentacion", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div>
                  <label
                    htmlFor="razon_precio_custom"
                    className="text-sm font-medium text-foreground"
                  >
                    Número de mensualidades
                  </label>
                  <input
                    id="razon_precio_custom"
                    type="number"
                    placeholder="Ej: 4 ó 6 ó 12"
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register("num_mensualidades", {
                      required: watch("tiene_precio_custom")
                        ? "Debes especificar el número de mensualidades"
                        : false,
                    })}
                  />
                  {errors.num_mensualidades && (
                    <span className="text-sm text-red-500">
                      {errors.num_mensualidades.message}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="razon_precio_custom"
                    className="text-sm font-medium text-foreground"
                  >
                    Fecha de primera mensualidad
                  </label>
                  <input
                    id="razon_precio_custom"
                    type="date"
                    placeholder="Ej: 24/08/1999"
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register("fecha_primera_mensualidad", {
                      required: watch("tiene_precio_custom")
                        ? "Debes indicar la fecha de primera mensualidad"
                        : false,
                    })}
                  />
                  {errors.num_mensualidades && (
                    <span className="text-sm text-red-500">
                      {errors.num_mensualidades.message}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="razon_precio_custom"
                    className="text-sm font-medium text-foreground"
                  >
                    Razón del precio personalizado
                  </label>
                  <input
                    id="razon_precio_custom"
                    type="text"
                    placeholder="Ej: Promoción verano, Beca 50%, Acuerdo especial"
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register("razon_precio_custom", {
                      required: watch("tiene_precio_custom")
                        ? "Debes especificar la razón del precio personalizado"
                        : false,
                    })}
                  />
                  {errors.razon_precio_custom && (
                    <span className="text-sm text-red-500">
                      {errors.razon_precio_custom.message}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Monto del pago */}
            <div>
              <label
                htmlFor="monto"
                className="text-sm font-medium text-foreground"
              >
                Monto a Pagar
              </label>
              <input
                id="monto"
                type="number"
                step="0.01"
                placeholder="Monto de pago inicial"
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline focus:ring-2 focus:ring-ring focus:border-transparent"
                {...register("monto", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El monto debe ser mayor o igual a 0",
                  },
                })}
              />
              {errors.monto && (
                <span className="text-sm text-red-500">
                  {errors.monto.message}
                </span>
              )}
            </div>

            {/* Conceptos de pago */}
            <div>
              {tipoPago && (
                <Controller<PagoFormData, "tipo_pago">
                  name="tipo_pago"
                  control={control}
                  rules={{
                    required: true,
                    validate: (value) =>
                      value.length > 0 || "Debe seleccionar al menos un rol",
                  }}
                  render={({ field }) => (
                    <MultiSelect
                      label="Conceptos de pago"
                      required
                      placeholder="Seleccione los conceptos"
                      options={tipoPago ?? []}
                      labelKey="nombre"
                      valueKey="id"
                      {...field}
                      error={errors.tipo_pago?.message}
                    />
                  )}
                />
              )}
              <p className="text-xs text-gray-500 mt-1">
                Si no seleccionas conceptos, se aplicará distribución automática
              </p>
            </div>

            {/* Método de pago */}
            <div>
              {metodoPago && (
                <Select
                  label="Método de pago"
                  error={errors?.metodo_pago?.message}
                  options={metodoPago ?? []}
                  valueKey="id"
                  labelKey="nombre"
                  register={register("metodo_pago")}
                />
              )}
            </div>

            {/* Notas adicionales */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Notas Adicionales (Opcional)
              </label>
              <textarea
                {...register("notas")}
                rows={3}
                placeholder="Agrega detalles adicionales sobre el pago..."
                className="text-black w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Resumen visual si hay precios custom */}
            {watch("tiene_precio_custom") && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                <p className="text-sm font-semibold text-yellow-800 mb-2">
                  Resumen de Precios Personalizados:
                </p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {watch("precios_custom.costo_inscripcion") && (
                    <li>
                      • Inscripción: $
                      {watch("precios_custom.costo_inscripcion")}
                    </li>
                  )}
                  {watch("precios_custom.costo_mensualidad") && (
                    <li>
                      • Mensualidad: $
                      {watch("precios_custom.costo_mensualidad")}
                    </li>
                  )}
                  {watch("precios_custom.costo_documentacion") && (
                    <li>
                      • Documentación: $
                      {watch("precios_custom.costo_documentacion")}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-center md:justify-end space-x-4">
            <button
              type="button"
              onClick={() => setClose(false)}
              className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>

            <Button type="submit">Inscribir</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
