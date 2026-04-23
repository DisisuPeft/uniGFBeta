import { useForm } from "react-hook-form";
import { useGetGenerosQuery } from "@/redux/features/catalogos/generoApiSlice";
import { useGetRolesQuery } from "@/redux/features/auth/roleApiSlice";
import {
  useGetUsersQuery,
  useAddUserMutation,
  useGetUserQuery,
  useEditUserMutation,
} from "@/redux/features/auth/userApiSlice";
import { setAlert } from "@/redux/features/alert/alertSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export interface UserFormData {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  genero: number;
  edad: number;
  fecha_nacimiento: string;
  telefono: string;
  email: string;
  status: number | null;
  roles: string[];
  password: string;
}

export function useUserForm(
  ref?: string | null,
  edit?: boolean | null,
  uuid?: string | null | undefined
) {
  const { refetch } = useGetUsersQuery({ q: "", page: 1 });
  const { data: user, isLoading } = useGetUserQuery(uuid);
  const [addUser] = useAddUserMutation();
  const [editUser] = useEditUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<UserFormData>({
    defaultValues: {
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      genero: 0,
      edad: 0,
      fecha_nacimiento: "",
      telefono: "",
      email: "",
      status: null,
      roles: [],
      password: "",
    },
  });
  const dispatch = useAppDispatch();
  const { data: generos } = useGetGenerosQuery();
  const { data: rol } = useGetRolesQuery({ q: "", page: 1 });
  const router = useRouter();

  //hook onmounted

  useEffect(() => {
    if (edit && user && !isLoading) {
      const mapped = {
        nombre: user.nombre,
        apellido_paterno: user.apellido_paterno,
        apellido_materno: user.apellido_materno,
        genero: user.genero,
        edad: user.edad,
        fecha_nacimiento: user.fecha_nacimiento,
        telefono: user.telefono,
        email: user.email,
        status: user.status,
        roles: user.roles,
      };
      reset(mapped, { keepDirtyValues: true, keepErrors: true });
    }
  }, [isLoading, user, edit, reset]);

  const onSubmit = async (data: UserFormData) => {
    if (!edit) {
      try {
        await addUser(data).unwrap();
        dispatch(
          setAlert({ type: "success", message: "Usuario creado con exito" })
        );
        refetch();
        router.replace(`/dashboard/sistema/usuarios?ref=${ref}`);
      } catch (error) {
        dispatch(
          setAlert({
            type: "error",
            message: "Ocurrio un error al crear al usuario",
          })
        );
      }
    } else {
      console.log(data);
      try {
        await editUser({ formData: data, id: uuid }).unwrap();
        dispatch(
          setAlert({ type: "success", message: "Usuario editado con exito" })
        );
        refetch();
      } catch (error) {
        dispatch(
          setAlert({
            type: "error",
            message: "Ocurrio un error al actualizar al usuario",
          })
        );
      }
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    generos,
    rol,
    control,
  };
}
