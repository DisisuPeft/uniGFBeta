import { useForm } from "react-hook-form";
// import { setAlert } from "@/redux/features/alert/a lertSlice";
import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import {
  InitalPagoForm,
  PagoFormData,
} from "@/redux/features/types/control-escolar/type";
import { useGetTipoPagoQuery } from "@/redux/features/control-escolar/genericosApiSlice";
import { useGetMetodoPagoQuery } from "@/redux/features/catalogos/genericosApiSlice";
import { useMakeInscriptionMutation } from "@/redux/features/control-escolar/alumnosApiSlice";
import { ErrorResponse } from "@/redux/features/types/reponse";
import { sweetAlert } from "@/sweetalert/sweetalerts";

type Tipo = "success" | "error";
interface Props {
  estudianteId?: string;
  campania?: string | undefined;
  onSuccess: (value: boolean) => void | undefined;
}
export default function useInscripcionPrograma({
  estudianteId,
  campania,
  onSuccess,
}: Props) {
  const [steps, setSteps] = useState(1);
  const { data: tipoPago } = useGetTipoPagoQuery();
  const { data: metodoPago } = useGetMetodoPagoQuery();
  const [makeInscription] = useMakeInscriptionMutation();
  // const dispatch = useAppDispatch();
  const form = useForm<PagoFormData>({
    mode: "onChange",
    defaultValues: InitalPagoForm,
  });
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = form;

  const onSubmit = async (data: PagoFormData) => {
    const next = { estudianteId, data, campania };
    try {
      const res = await makeInscription({
        campania: next.campania,
        estudianteId: next.estudianteId,
        formData: next.data,
      }).unwrap();
      // reset();
      onSuccess(false);
      sweetAlert("success", `${res?.message}`, "Exito");
    } catch (error) {
      const e = error as ErrorResponse;
      onSuccess(false);
      sweetAlert("error", `${e?.data?.detail}`, "Error");
    }
  };

  return {
    // isMorePages,
    // diplomados,
    errors,
    register,
    onSubmit,
    handleSubmit,
    tipoPago,
    reset,
    metodoPago,
    // control,
    setValue,
    watch,
    onSuccess,
    steps,
    setSteps,
    control,
  };
}
