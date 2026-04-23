import { useForm, useFieldArray } from "react-hook-form";
import {
  type ProgramaEducativoForm,
  programaInicial,
} from "@/redux/features/types/control-escolar/type";
import {
  useGetModalidadesQuery,
  useGetTiposProgramasQuery,
} from "@/redux/features/control-escolar/genericosApiSlice";
// import {
//   useUpdateProgramasMutation,
//   useRetrieveProgramaQuery,
//   useRetrieveProgramasQuery,
// } from "@/redux/features/control-escolar/programasApiSlice";
import { setAlert } from "@/redux/features/alert/alertSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useRetrieveInstitucionesQuery } from "@/redux/features/catalogos/genericosApiSlice";
import { ErrorResponse } from "@/redux/features/types/reponse";
import { useEffect, useState } from "react";

export default function useEditProgramaForm(uuid: string) {
  // const {
  //   data: programa,
  //   isLoading,
  //   refetch: refetchPrograma,
  // } = useRetrieveProgramaQuery(uuid);
  // const { refetch: refetchLista } = useRetrieveProgramasQuery();
  const { data: tiposProgramas } = useGetTiposProgramasQuery();
  const { data: modalidades } = useGetModalidadesQuery();
  const { data: instituciones } = useRetrieveInstitucionesQuery();
  // const [updateProgramas] = useUpdateProgramasMutation();
  const dispatch = useAppDispatch();
  const [disabled, setDisabled] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProgramaEducativoForm>({
    defaultValues: programaInicial,
  });

  const {
    fields: modulosFields,
    append: appendModulo,
    remove: removeModulo,
  } = useFieldArray({
    control,
    name: "modulos",
  });

  // useEffect(() => {
  //   if (programa && !isLoading) {
  //     const mapped = {
  //       nombre: programa.nombre,
  //       descripcion: programa.descripcion,

  //       tipo: programa.tipo,
  //       institucion: programa.institucion,
  //       modalidad: programa.modalidad,

  //       duracion_horas: programa.duracion_horas,
  //       duracion_meses: programa.duracion_meses,

  //       fecha_inicio: programa.fecha_inicio,
  //       fecha_fin: programa.fecha_fin,

  //       horario: programa.horario,

  //       costo_inscripcion: programa.costo_inscripcion,
  //       costo_mensualidad: programa.costo_mensualidad,
  //       costo_documentacion: programa.costo_documentacion,
  //       modulos: programa.modulos_obj,
  //     };
  //     reset(mapped);
  //   }
  // }, [programa, isLoading, reset]);

  // const onSubmit = async (data: ProgramaEducativoForm) => {
  //   try {
  //     await updateProgramas({ uuid: uuid, formData: data }).unwrap();
  //     await refetchPrograma();
  //     refetchLista();
  //     setDisabled(true);
  //     dispatch(
  //       setAlert({
  //         type: "success",
  //         message: "Programa educativo actualizado con éxito.",
  //       }),
  //     );
  //   } catch (error) {
  //     const e = error as ErrorResponse;
  //     console.log(e);
  //     dispatch(
  //       setAlert({
  //         type: "error",
  //         message: "No se pudo actualizar el programa educativo.",
  //       }),
  //     );
  //   }
  // };

  return {
    // onSubmit,
    handleSubmit,
    register,
    errors,
    modulosFields,
    appendModulo,
    removeModulo,
    control,
    watch,
    tiposProgramas,
    modalidades,
    instituciones,
    disabled,
    setDisabled,
    // programa,
  };
}
