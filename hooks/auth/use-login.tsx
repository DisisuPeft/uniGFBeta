import { useForm } from "react-hook-form";
import { useLoginMutation } from "@/redux/features/auth/authApiSlice";
import { useAppDispatch } from "@/redux/hooks";
import { setAlert } from "@/redux/features/alert/alertSlice";
import { useRouter } from "next/navigation";
import { setAuth } from "@/redux/features/auth/authSlice";
import { sweetAlert } from "@/sweetalert/sweetalerts";
import { ErrorResponse } from "@/redux/features/types/reponse";

interface LoginForm {
  email: string;
  password: string;
}

export default function useLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data).unwrap();
      dispatch(setAuth());
      sweetAlert("success", "Inicio exitoso", "Bienvenido");
      router.replace("/dashboard");
    } catch (error) {
      const e = error as ErrorResponse;
      sweetAlert("error", `${e.data.detail}`, "Error");
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
  };
}
