"use client";

import Input from "@/app/ui/components/input";
import MultiSelect from "@/app/ui/components/select-multiple";
import { useUserForm, type UserFormData } from "@/hooks/users/user-create-form";
import { statusOptions } from "@/helpers";
import { Controller } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function UserEditForm({ uuid }: { uuid: string }) {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    // setRoles,
    generos,
    rol,
    control,
  } = useUserForm(null, true, uuid);

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            {/* Información Personal */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Información Personal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre"
                  placeholder="Ingrese el nombre"
                  required
                  {...register("nombre", {
                    required: "El nombre es requerido",
                  })}
                  error={errors.nombre?.message}
                />
                <Input
                  label="Apellido Paterno"
                  placeholder="Ingrese el apellido paterno"
                  required
                  {...register("apellido_paterno", {
                    required: "El apellido paterno es requerido",
                  })}
                  error={errors.apellido_paterno?.message}
                />
                <Input
                  label="Apellido Materno"
                  placeholder="Ingrese el apellido materno"
                  {...register("apellido_materno")}
                  error={errors.apellido_materno?.message}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-800">
                    Género
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    {...register("genero", {
                      required: "El género es requerido",
                    })}
                    className="px-3 py-2 border border-1 rounded-lg bg-white text-gray-800 focus:outline focus:ring-2 focus:ring focus:border-transparent transition-all"
                  >
                    <option value={0}>Seleccionar...</option>
                    {generos?.results.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.genero && (
                    <span className="text-sm text-red-500">
                      {errors.genero.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Información Demográfica */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Información Demográfica
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Edad"
                  type="number"
                  placeholder="Ingrese la edad"
                  {...register("edad", {
                    min: { value: 1, message: "La edad debe ser mayor a 0" },
                    max: {
                      value: 100,
                      message: "La edad debe ser menor a 100",
                    },
                  })}
                  error={errors.edad?.message}
                />
                <Input
                  label="Fecha de Nacimiento"
                  type="date"
                  {...register("fecha_nacimiento")}
                  error={errors.fecha_nacimiento?.message}
                />
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Información de Contacto
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Teléfono"
                  type="tel"
                  placeholder="Ingrese el teléfono"
                  required
                  {...register("telefono", {
                    required: "El teléfono es requerido",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "El teléfono debe tener 10 dígitos",
                    },
                    maxLength: {
                      value: 10,
                      message:
                        "El numero de telefono no puede contar con mas de 10 caracteres.",
                    },
                    minLength: {
                      value: 2,
                      message:
                        "El numero no puede contener un minimo de 2 caracteres.",
                    },
                  })}
                  error={errors.telefono?.message}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  required
                  {...register("email", {
                    required: "El email es requerido",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email inválido",
                    },
                  })}
                  error={errors.email?.message}
                />

                <Input
                  label="Password"
                  type="text"
                  placeholder="******"
                  // required
                  {...register("password", {
                    // required: "El password es requerido",
                    min: {
                      value: 6,
                      message: "Debe contener al menos 6 caracteres.",
                    },
                    maxLength: {
                      value: 12,
                      message: "No puede ser mayor de 12 caracteres.",
                    },
                  })}
                  error={errors.password?.message}
                />
              </div>
            </div>

            {/* Roles y Estado */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Roles y Estado
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller<UserFormData, "roles">
                  name="roles"
                  control={control}
                  rules={{
                    required: true,
                    validate: (value) =>
                      value.length > 0 || "Debe seleccionar al menos un rol",
                  }}
                  render={({ field }) => (
                    <MultiSelect
                      label="Roles"
                      required
                      placeholder="Seleccione roles"
                      options={rol?.results ?? []}
                      labelKey="nombre"
                      valueKey="id"
                      {...field}
                      error={errors.roles?.message}
                    />
                  )}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-800">
                    Estado
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    {...register("status", {
                      required: "El estado es requerido",
                    })}
                    className="px-3 py-2 border border-1 rounded-lg bg-white text-gray-800 focus:outline focus:ring-2 focus:ring focus:border-transparent transition-all"
                  >
                    {/* <option value={0}>Seleccionar...</option> */}
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <span className="text-sm text-red-500">
                      {errors.status.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
              <Link
                href={`/dashboard/sistema/usuarios?ref=${ref}`}
                type="button"
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Editar Usuario
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
