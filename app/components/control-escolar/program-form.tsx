"use client";

import useProgramaForm from "@/hooks/control-escolar/use-programa-form";
import { useFieldArray, useWatch, UseFormRegister, Control } from "react-hook-form";
import type { ProgramaEducativoForm } from "@/redux/features/types/control-escolar/type";
// import { useRetrieveInstitucionesQuery } from "@/redux/features/catalogos/genericosApiSlice";
import Select from "@/app/ui/components/select";
import Acordeon from "@/app/ui/components/acordeon";

export default function NuevoProgramaPage() {
  const {
    onSubmit,
    handleSubmit,
    register,
    errors,
    modulosFields,
    appendModulo,
    removeModulo,
    control,
    modalidades,
    tiposProgramas,
    instituciones,
    watch,
  } = useProgramaForm();

  const modulosWatch = watch("modulos");

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Crear Programa Educativo
          </h1>
          <p className="text-gray-600">
            Completa el formulario para registrar un nuevo programa
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Información General
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Programa *
                </label>
                <input
                  {...register("nombre", {
                    required: "Este campo es requerido",
                  })}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Desarrollo Web Full Stack"
                />
                {errors.nombre && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  {...register("descripcion")}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe el programa educativo..."
                />
              </div>

              <div className="md:col-span-2">
                {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institucion
                </label> */}
                <Select
                  label="Selecciona una institucion"
                  options={instituciones ?? []}
                  labelKey="nombre"
                  valueKey="id"
                  {...register("institucion")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  {...register("tipo")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposProgramas?.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modalidad
                </label>
                <select
                  {...register("modalidad")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar modalidad</option>
                  {modalidades?.map((modalidad) => (
                    <option key={modalidad.id} value={modalidad.id}>
                      {modalidad.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración (Horas)
                </label>
                <input
                  {...register("duracion_horas", { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración (Meses)
                </label>
                <input
                  {...register("duracion_meses", { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio
                </label>
                <input
                  {...register("fecha_inicio")}
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Fin
                </label>
                <input
                  {...register("fecha_fin")}
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horario
                </label>
                <input
                  {...register("horario")}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Lun-Vie 9:00 AM - 1:00 PM"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Costos</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Costo de Inscripción
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    {...register("costo_inscripcion", { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensualidad
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    {...register("costo_mensualidad", { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Documentación
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    {...register("costo_documentacion", {
                      valueAsNumber: true,
                    })}
                    type="number"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Módulos Educativos
              </h2>
              <button
                type="button"
                onClick={() =>
                  appendModulo({
                    nombre: "",
                    horas_teoricas: 0,
                    horas_practicas: 0,
                    horas_totales: 0,
                    creditos: 0,
                    submodulos: [{ titulo: "", descripcion: "", orden: 1 }],
                  })
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                Agregar Módulo
              </button>
            </div>

            <div className="space-y-3">
              {modulosFields.map((modulo, moduloIndex) => {
                const nombre = modulosWatch?.[moduloIndex]?.nombre;
                const titulo = nombre?.trim()
                  ? `Módulo ${moduloIndex + 1}: ${nombre}`
                  : `Módulo ${moduloIndex + 1}`;
                return (
                  <Acordeon
                    key={modulo.id}
                    title={titulo}
                    defaultOpen={moduloIndex === 0}
                  >
                    <ModuloSection
                      moduloIndex={moduloIndex}
                      register={register}
                      control={control}
                      removeModulo={removeModulo}
                    />
                  </Acordeon>
                );
              })}
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Crear Programa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ModuloSectionProps {
  moduloIndex: number;
  register: UseFormRegister<ProgramaEducativoForm>;
  control: Control<ProgramaEducativoForm>;
  removeModulo: (index: number) => void;
}

function ModuloSection({
  moduloIndex,
  register,
  control,
  removeModulo,
}: ModuloSectionProps) {
  const {
    fields: submodulosFields,
    append: appendSubmodulo,
    remove: removeSubmodulo,
  } = useFieldArray({
    control,
    name: `modulos.${moduloIndex}.submodulos`,
  });

  const submodulosWatch = useWatch({
    control,
    name: `modulos.${moduloIndex}.submodulos`,
  });

  return (
    <div className="space-y-4">
      {moduloIndex > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => removeModulo(moduloIndex)}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Eliminar Módulo
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Módulo *
          </label>
          <input
            {...register(`modulos.${moduloIndex}.nombre`, { required: true })}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Fundamentos de Programación"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horas Teóricas
          </label>
          <input
            {...register(`modulos.${moduloIndex}.horas_teoricas`, {
              valueAsNumber: true,
            })}
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horas Prácticas
          </label>
          <input
            {...register(`modulos.${moduloIndex}.horas_practicas`, {
              valueAsNumber: true,
            })}
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horas Totales
          </label>
          <input
            {...register(`modulos.${moduloIndex}.horas_totales`, {
              valueAsNumber: true,
            })}
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Créditos
          </label>
          <input
            {...register(`modulos.${moduloIndex}.creditos`, {
              valueAsNumber: true,
            })}
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0"
          />
        </div>
      </div>

      {/* Submódulos */}
      <div className="border-t border-gray-300 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-800">Submódulos</h4>
          <button
            type="button"
            onClick={() =>
              appendSubmodulo({
                titulo: "",
                descripcion: "",
                orden: submodulosFields.length + 1,
              })
            }
            className="px-3 py-1 bg-white border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm"
          >
            + Agregar Submódulo
          </button>
        </div>

        <div className="space-y-2">
          {submodulosFields.map((submodulo, submoduloIndex) => {
            const titulo = submodulosWatch?.[submoduloIndex]?.titulo?.trim()
              ? `Submódulo ${submoduloIndex + 1}: ${submodulosWatch[submoduloIndex].titulo}`
              : `Submódulo ${submoduloIndex + 1}`;
            return (
              <Acordeon
                key={submodulo.id}
                title={titulo}
                defaultOpen={submoduloIndex === 0}
              >
                <div className="space-y-3">
                  {submoduloIndex > 0 && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeSubmodulo(submoduloIndex)}
                        className="text-red-600 hover:text-red-700 text-xs font-medium"
                      >
                        Eliminar Submódulo
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título *
                    </label>
                    <input
                      {...register(
                        `modulos.${moduloIndex}.submodulos.${submoduloIndex}.titulo`,
                        { required: true },
                      )}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Ej: Introducción a HTML"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      {...register(
                        `modulos.${moduloIndex}.submodulos.${submoduloIndex}.descripcion`,
                      )}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Describe el contenido..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Orden
                    </label>
                    <input
                      {...register(
                        `modulos.${moduloIndex}.submodulos.${submoduloIndex}.orden`,
                        { valueAsNumber: true },
                      )}
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="1"
                    />
                  </div>
                </div>
              </Acordeon>
            );
          })}
        </div>
      </div>
    </div>
  );
}
