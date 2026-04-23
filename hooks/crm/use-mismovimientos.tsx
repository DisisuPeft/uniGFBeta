import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiltrosFechas } from "@/redux/features/types/crm/type";

interface Props {
  onFiltroFechas: (data: FiltrosFechas) => void;
}

export default function MisMovimientosHook() {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const onFiltroFechas = (data: FiltrosFechas) => {
    console.log("Filtros aplicados:", data);
    // Aquí aplicas los filtros a tu tabla/lista
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FiltrosFechas>({
    defaultValues: {
      fecha_inicio: "",
      fecha_fin: "",
    },
  });

  const limpiarFiltros = () => {
    reset();
    // Aquí recargas los datos sin filtros
  };

  return {
    register,
    handleSubmit,
    errors,
    watch,
    limpiarFiltros,
    mostrarFiltros,
    setMostrarFiltros,
    onFiltroFechas,
  };
}
