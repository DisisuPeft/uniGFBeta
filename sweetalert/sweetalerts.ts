import Swal from "sweetalert2";

type tipos = "success" | "error" | "info" | "warning";

export const sweetAlert = (tipo: tipos, text: string, title: string) => {
  Swal.fire({
    icon: tipo,
    title: title,
    text: text,
  });
};
