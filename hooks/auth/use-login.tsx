import { useForm } from "react-hook-form";
import { useLoginMutation } from "@/redux/features/auth/authApiSlice";
import { useAppDispatch } from "@/redux/hooks";
// import { setAlert } from "@/redux/features/alert/alertSlice";
import { useRouter } from "next/navigation";
import { setAuth } from "@/redux/features/auth/authSlice";
import Swal from "sweetalert2";
import { sweetAlert } from "@/sweetalert/sweetalerts";
import { ErrorResponse } from "@/redux/features/types/reponse";

interface LoginForm {
  num_colab: string;
  password: string;
}

// interface Error {
//   detail: string
// }

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
    // console.log(data);
    try {
      await login(data).unwrap();
      dispatch(setAuth());
      Swal.fire({
        icon: "success",
        title: "Bienvenido",
        text: "Inicio exitoso",
        timer: 1500,
        showConfirmButton: false,
      });
      router.replace("/dashboard");
    } catch (error) {
      const e = error as ErrorResponse;
      // console.log(e ? e : null);
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
