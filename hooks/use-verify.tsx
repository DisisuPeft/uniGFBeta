import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth, finishInitialLoad } from "@/redux/features/auth/authSlice";
import { useVerifyMutation } from "@/redux/features/auth/authApiSlice";

export default function useVerify() {
  const dispatch = useAppDispatch();
  const [verify] = useVerifyMutation();
  useEffect(() => {
    verify(undefined)
      .unwrap()
      .then(() => {
        // Si el backend valida el token, activa la autenticación
        dispatch(setAuth());
      })
      .finally(() => {
        // Indica que la carga inicial terminó, independientemente del resultado
        dispatch(finishInitialLoad());
      });
  }, []);
}
