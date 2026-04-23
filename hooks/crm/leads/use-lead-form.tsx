import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetCampaniasQuery,
  useGetProgramasGenericoQuery,
} from "@/redux/features/control-escolar/genericosApiSlice";
import {
  useGetFuentesQuery,
  useGetEstatusQuery,
  useGetEtapasQuery,
} from "@/redux/features/crm/catalogosCrmApiSlice";
import { useEffect } from "react";
import { useCreateLeadMutation } from "@/redux/features/crm/leadsApiSlice";
import { sweetAlert } from "@/sweetalert/sweetalerts";
import { ErrorResponse } from "@/redux/features/types/reponse";
import { useAppSelector } from "@/redux/hooks";
// import { useRouter } from "next/navigation";

const leadSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  apellido_paterno: z
    .string()
    .min(2, "El apellido paterno debe tener al menos 2 caracteres")
    .max(100, "El apellido paterno no puede exceder 100 caracteres"),
  apellido_materno: z.string().optional(),
  correo: z.string().optional(),
  telefono: z
    .string()
    .regex(/^\d{10}$/, "El teléfono debe tener exactamente 10 dígitos"),
  fuente: z.string().min(1, "Selecciona una fuente"),
  notas: z.string().optional(),
  etapa: z.string(),
  estatus: z.string(),
  programa_objetivo: z.string().min(1, "Selecciona un programa"),
  campania: z.string().min(1, "Selecciona una campaña"),
  contacto_alterno: z.string().optional(),
  instituto: z.string().min(1, "Selecciona un instituto"),
});

export type LeadFormData = z.infer<typeof leadSchema>;

export default function useLeadForm() {
  const { data: campanias } = useGetCampaniasQuery("");
  const { data: programas } = useGetProgramasGenericoQuery();
  const { data: estatus, isLoading: estatusLoading } = useGetEstatusQuery();
  const { data: fuentes } = useGetFuentesQuery();
  const { data: etapas, isLoading: etapasLoading } = useGetEtapasQuery();
  const [createLead] = useCreateLeadMutation();
  const { unidadId } = useAppSelector((state) => state.changeUnidad);
  // const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    mode: "onChange",
    resolver: zodResolver(leadSchema),
    defaultValues: {
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      correo: "",
      telefono: "",
      fuente: "",
      notas: "",
      etapa: "",
      programa_objetivo: "",
      campania: "",
      estatus: "",
      instituto: String(unidadId),
    },
  });

  useEffect(() => {
    if (estatus && !estatusLoading && etapas && !etapasLoading) {
      setValue("estatus", String(estatus.results[0].id));
      setValue("etapa", String(etapas.results[0].id));
    }
  });

  const onSubmit = async (data: LeadFormData) => {
    try {
      console.log(data);
      const res = await createLead(data).unwrap();
      // sweetAlert("success", `${res.message}`, "Exito");
      Swal.fire({
        title: `${res.message}`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Agregar otro lead",
        denyButtonText: `Terminar registro`,
        cancelButtonText: `Volver al inicio`,
        denyButtonColor: "#0EA5E9",
      }).then((result) => {
        if (result.isConfirmed) {
          reset();
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        } else if (result.isDismissed) {
          Swal.fire("Back", "", "info");
        }
      });
    } catch (error) {
      console.log(error);
      const e = error as ErrorResponse;
      sweetAlert("error", `${e.data.detail}`, "Error");
    }
  };

  return {
    register,
    watch,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    campanias,
    programas,
    estatus,
    fuentes,
    etapas,
  };
}
