"use client";
import {
  useGetInstitucionesQuery,
  useAddInstitucionesMutation,
} from "@/redux/features/catalogos/institucionesApiSlice";
import Card from "@/app/ui/components/card";
import { Plus } from "lucide-react";
import { Modal } from "../../common/modal";
import { useState } from "react";
import Input from "@/app/ui/components/input";
import { useForm } from "react-hook-form";
import { Instituciones } from "@/redux/features/types/catalagos/cat";
import { useAppDispatch } from "@/redux/hooks";
import { setAlert } from "@/redux/features/alert/alertSlice";
import { useGetEmpresaQuery } from "@/redux/features/sistema/sistemaApiSlice";
import Select from "@/app/ui/components/select";

export default function InstitucionesGrid() {
  const dispatch = useAppDispatch();
  const [addInstituciones] = useAddInstitucionesMutation();
  const { data: instituciones, refetch } = useGetInstitucionesQuery();
  const { data: empresa } = useGetEmpresaQuery("CINFA");
  const [show, setShow] = useState<boolean>(false);
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<Instituciones>({
    mode: "onChange",
  });
  const onSubmit = async (data: Instituciones) => {
    try {
      await addInstituciones(data).unwrap();
      reset();
      dispatch(
        setAlert({ type: "success", message: "Genero creado con exito." })
      );
      refetch();
    } catch (error) {
      console.log(error);
      dispatch(
        setAlert({ type: "error", message: "Error al crear el genero." })
      );
    }
  };
  return (
    <div>
      <div className="flex justify-end items-center">
        <button onClick={() => setShow(true)}>
          <div className="flex flex-row gap-2 rounded-md bg-sky-500 p-2 text-white cursor-pointer">
            <Plus />
            Crear Institucion
          </div>
        </button>
      </div>
      <div className="overflow-auto mt-4">
        {instituciones?.results.length === 0 || !instituciones ? (
          <div>No existen instituciones</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {instituciones?.results.map((institucion) => (
              <div key={institucion.id}>
                <Card>{institucion.nombre}</Card>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal show={show} onClose={() => setShow(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-10">
          <div>
            <Input
              label="Nombre"
              type="text"
              {...register("nombre", {
                required: true,
                pattern: {
                  value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
                  message: "Solo se permiten letras",
                },
                minLength: {
                  value: 2,
                  message: "Se requieren minimo 2 caracteres.",
                },
                maxLength: {
                  value: 50,
                  message: "Maximo 50 caracteres",
                },
              })}
            />
            {errors.nombre && (
              <div className="text-red-500">{errors.nombre.message}</div>
            )}
          </div>
          <div className="mt-2">
            <Select
              label="Empresa"
              options={empresa ?? []}
              labelKey="slug"
              valueKey="id"
              {...register("empresa")}
            />
            {errors.empresa && (
              <div className="text-red-500">{errors.empresa.message}</div>
            )}
          </div>
          <div className="flex jutify-end mt-6">
            <button
              type="submit"
              className="rounded-md bg-sky-500 text-white p-2 cursor-pointer"
            >
              {isSubmitting ? <div>Guardando...</div> : <div>Guardar</div>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
