"use client";
import {
  useGetGenerosQuery,
  useAddGenerosMutation,
} from "@/redux/features/catalogos/generoApiSlice";
import Card from "@/app/ui/components/card";
import { Plus } from "lucide-react";
import { Modal } from "../../common/modal";
import { useState } from "react";
import Input from "@/app/ui/components/input";
import { useForm } from "react-hook-form";
import { Genero } from "@/redux/features/types/auth/auth-types";
import { useAppDispatch } from "@/redux/hooks";
import { setAlert } from "@/redux/features/alert/alertSlice";

export default function GenerosGrid() {
  const dispatch = useAppDispatch();
  const [addGeneros] = useAddGenerosMutation();
  const { data: generos, refetch } = useGetGenerosQuery();
  const [show, setShow] = useState<boolean>(false);
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<Genero>({
    mode: "onChange",
  });
  const onSubmit = async (data: Genero) => {
    try {
      await addGeneros(data).unwrap();
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
            Crear genero
          </div>
        </button>
      </div>
      <div className="overflow-auto mt-4">
        {generos?.results.length === 0 ? (
          <div>No existen generos</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {generos?.results.map((genero) => (
              <div key={genero.id}>
                <Card>{genero.nombre}</Card>
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
