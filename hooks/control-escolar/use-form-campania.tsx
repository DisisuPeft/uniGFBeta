import {
  CampaniaFormFields,
  initialCampaniaFormValues,
} from "@/redux/features/types/control-escolar/type";
import { useForm } from "react-hook-form";
import { useGetProgramasGenericoQuery } from "@/redux/features/control-escolar/genericosApiSlice";
import { useRetrieveInstitucionesQuery } from "@/redux/features/catalogos/genericosApiSlice";
import {
  useCreateCampaniasMutation,
  useRetrieveCampaniasQuery,
} from "@/redux/features/control-escolar/campaniasApiSlice";
import { ErrorResponse } from "@/redux/features/types/reponse";
import { sweetAlert } from "@/sweetalert/sweetalerts";

export default function useFormCampania(onSuccess?: () => void) {
  const [createCampanias] = useCreateCampaniasMutation();
  const { data: programas } = useGetProgramasGenericoQuery();
  const { data: institutos } = useRetrieveInstitucionesQuery();
  const { refetch } = useRetrieveCampaniasQuery();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CampaniaFormFields>({
    defaultValues: initialCampaniaFormValues,
    mode: "onChange",
  });

  const onSubmit = async (data: CampaniaFormFields) => {
    try {
      await createCampanias(data).unwrap();
      reset();
      refetch();
      onSuccess?.();
      sweetAlert("success", "La campaña fue creada con éxito", "¡Listo!");
    } catch (error) {
      const e = error as ErrorResponse;
      sweetAlert(
        "error",
        e?.data?.detail ?? "No se pudo crear la campaña",
        "Error",
      );
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    programas,
    institutos,
  };
}