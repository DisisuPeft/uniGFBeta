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
import { useEffect } from "react";
import { useAddEstudiantesMutation } from "@/redux/features/control-escolar/alumnosApiSlice";
import { useAppDispatch } from "@/redux/hooks";
import { setAlert } from "@/redux/features/alert/alertSlice";

export default function useAlumnoForm() {
  const dispatch = useAppDispatch();
  const { data: generos } = useGetGenerosQuery();
  const { data: nivelEducativo } = useRetrieveNivelEducativoQuery();
  const { data: instituciones } = useRetrieveInstitucionesQuery();
  const { data: estados } = useRetrieveEstadosQuery();
  const [addEstudiantes] = useAddEstudiantesMutation();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<EstudiantePerfilForm>({
    defaultValues: estudiantePerfilInitialValues,
  });

  const entidad = watch("estado_pais");
  // console.log(typeof entidad);
  const { data: localidades } = useRetrieveLocalidadesQuery(
    entidad ? parseInt(entidad) : 0,
  );

  const onSubmit = async (data: EstudiantePerfilForm) => {
    try {
      await addEstudiantes(data).unwrap();
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
    // caluleAgeBirth();
  });

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
  };
}
