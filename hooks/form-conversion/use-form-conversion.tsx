import { useForm } from "react-hook-form";
import { RequestFormValues } from "@/redux/features/types/conversion/form";
// import { useAddRequestCustomerMutation } from "@/redux/crm/crmApiSlice";
// import { setAlert } from "@/redux/features/alerts/alert";
// import { useGetCatalogoProgramaQuery } from "@/redux/control-escolar/programas-educativos/programApiSlice";
// import { useAppDispatch } from "@/redux/hooks";

export default function useFormRequest() {
  //   const { data: diplomados } = useGetCatalogoProgramaQuery();
  //   const [addRequestCustomer, { data }] = useAddRequestCustomerMutation();
  // const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RequestFormValues>({
    defaultValues: {
      nombre: "",
      correo: "",
      telefono: "",
      interesado_en: "",
      empresa: "UNSZA",
    },
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    // addRequestCustomer(data)
    //   .unwrap()
    //   .then(() => {
    //     reset();
    //   })
    //   .catch(() => {
    //     setAlert({
    //       message: "Error al registarte, por favor. Intenta nuevamente",
    //       type: "error",
    //     });
    //   });
  });
  return {
    register,
    onSubmit,
    errors,
    isSubmitting,
    reset,
    // diplomados,
    // data,
  };
}
