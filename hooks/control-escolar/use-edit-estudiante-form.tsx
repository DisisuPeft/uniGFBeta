// import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  EstudiantePerfilForm,
  estudiantePerfilInitialValues,
} from "@/redux/features/types/control-escolar/type";
import { useGetGenerosQuery } from "@/redux/features/catalogos/generoApiSlice";
import {
  useRetrieveNivelEducativoQuery,
  useRetrieveInstitucionesQuery,
  useRetrieveEstadosQuery,
  useRetrieveLocalidadesQuery,
} from "@/redux/features/catalogos/genericosApiSlice";
import { useEffect, useState } from "react";
import {
  useUpdateEstudianteMutation,
  useRetrieveEstudianteQuery,
} from "@/redux/features/control-escolar/alumnosApiSlice";
import { useAppDispatch } from "@/redux/hooks";
import { setAlert } from "@/redux/features/alert/alertSlice";

export default function useAlumnoEditForm(uuid: string) {
  const { data: estudiante, isLoading } = useRetrieveEstudianteQuery(uuid);
  const dispatch = useAppDispatch();
  const { data: generos } = useGetGenerosQuery();
  const { data: nivelEducativo } = useRetrieveNivelEducativoQuery();
  const { data: instituciones } = useRetrieveInstitucionesQuery();
  const { data: estados } = useRetrieveEstadosQuery();
  const [updateEstudiantes] = useUpdateEstudianteMutation();
  const [disabled, setDisabled] = useState(true);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<EstudiantePerfilForm>({
    // defaultValues: estudiantePerfilInitialValues,
    mode: "onChange",
  });

  const entidad = estudiante?.estado_pais?.toString() ?? watch("estado_pais");
  const { data: localidades, isLoading: isLoadingLocalidad } =
    useRetrieveLocalidadesQuery(entidad ? parseInt(entidad) : 0);

  const onSubmit = async (data: EstudiantePerfilForm) => {
    try {
      await updateEstudiantes({ uuid: uuid, formData: data }).unwrap();
      reset();
      dispatch(
        setAlert({ message: "Alumno creado con exito", type: "success" }),
      );
    } catch (error) {
      dispatch(
        setAlert({ message: "El alumno no pudo ser creado", type: "error" }),
      );
    }
  };

  const dateBirth = watch("user.fecha_nacimiento");

  const caluleAgeBirth = () => {
    const birthday = new Date(dateBirth);
    const today = new Date();
    let yearsOld = today.getUTCFullYear() - birthday.getUTCFullYear();

    if (birthday.getUTCMonth() < today.getUTCMonth()) {
      return yearsOld;
    } // Agosto no es menor que enero
    else if (
      today.getUTCMonth() === birthday.getUTCMonth() &&
      birthday.getUTCDate() <= today.getUTCDate()
    ) {
      return yearsOld;
    } // si mi pumple fue el 8 de enero, pues si, es menor que el dia de hoy, entonces ya cumpli anios
    return yearsOld - 1;
  };

  useEffect(() => {
    setValue("user.edad", caluleAgeBirth());

    if (estudiante && !isLoading && !isLoadingLocalidad) {
      const mapped = {
        especialidad: estudiante.especialidad,
        matricula: estudiante.matricula,
        fecha_ingreso: estudiante.fecha_ingreso,
        nivel_educativo: estudiante.nivel_educativo,
        institucion: estudiante.institucion,
        estado_pais: estudiante.estado_pais,
        ciudad: estudiante.ciudad,
        status: estudiante.status,
        user: {
          nombre: estudiante.user_obj?.nombre,
          apellido_paterno: estudiante.user_obj?.apellido_paterno,
          apellido_materno: estudiante.user_obj?.apellido_materno,
          edad: estudiante.user_obj?.edad,
          genero: estudiante.user_obj?.genero,
          fecha_nacimiento: estudiante.user_obj?.fecha_nacimiento,
          email: estudiante.user_obj?.email,
          telefono: estudiante.user_obj?.telefono,
        },
      };
      reset(mapped, { keepDirty: true, keepErrors: true });
    }
  }, [isLoading, estudiante, reset, isLoadingLocalidad]);

  return {
    register,
    handleSubmit,
    onSubmit,
    control,
    errors,
    isSubmitting,
    generos,
    nivelEducativo,
    instituciones,
    estados,
    localidades,
    disabled,
  };
}
