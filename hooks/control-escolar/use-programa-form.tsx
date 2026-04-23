import { useForm, useFieldArray } from "react-hook-form";
import {
  type ProgramaEducativoForm,
  programaInicial,
} from "@/redux/features/types/control-escolar/type";
import {
  useGetModalidadesQuery,
  useGetTiposProgramasQuery,
} from "@/redux/features/control-escolar/genericosApiSlice";
// import { useCreateProgramasMutation } from "@/redux/features/control-escolar/programasApiSlice";
import { setAlert } from "@/redux/features/alert/alertSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useRetrieveInstitucionesQuery } from "@/redux/features/catalogos/genericosApiSlice";
// import { useRetrieveProgramasQuery } from "@/redux/features/control-escolar/programasApiSlice";

export default function useProgramaForm() {
  const { data: tiposProgramas } = useGetTiposProgramasQuery();
  // const { refetch } = useRetrieveProgramasQuery();
  const { data: modalidades } = useGetModalidadesQuery();
  const { data: instituciones } = useRetrieveInstitucionesQuery();
  // const [createProgramas] = useCreateProgramasMutation();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const router = useRouter();
  const dispatch = useAppDispatch();

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

  const onSubmit = async (data: ProgramaEducativoForm) => {
    // try {
    //   await createProgramas(data).unwrap();
    //   reset();
    //   dispatch(
    //     setAlert({
    //       type: "success",
    //       message: "Programa educativo creado con exito.",
    //     }),
    //   );
    //   refetch();
    //   router.replace(`/dashboard/control-escolar/programas?ref=${ref}`);
    // } catch (error) {
    //   console.log(error);
    //   dispatch(
    //     setAlert({
    //       type: "error",
    //       message: "Programa educativo no se creo debido a un error.",
    //     }),
    //   );
    // }
  };

  return {
    onSubmit,
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
  };
}
