import { useRetrieveInstitucionesQuery } from "@/redux/features/catalogos/genericosApiSlice";
import {
  clearUnidad,
  setUnidad,
} from "@/redux/features/crm/changeUnidadSilice";
import { ChangeEvent, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";

export default function useChangeUnidad() {
  const {
    data: unidades,
    isLoading,
    isError,
  } = useRetrieveInstitucionesQuery();
  const { unidadId } = useAppSelector((state) => state.changeUnidad);
  const dispath = useAppDispatch();

  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const target = parseInt(event.target.value);
    dispath(clearUnidad());
    dispath(setUnidad(target));
    window.location.reload;
  };

  useEffect(() => {
    if (isLoading || isError) return;
    if (!unidades?.length) return;
    const exists = unidadId != null && unidades.some((u) => u.id === unidadId);
    if (!exists) {
      dispath(setUnidad(unidades[0].id));
    }
  }, [isLoading, isError, unidades, unidadId, dispath]);

  return { unidadId, dispath, unidades, onChange };
}
