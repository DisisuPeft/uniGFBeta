import {
  IconPlay,
  IconDocument,
  IconClipboard,
  IconCode,
} from "@/app/components/plataforma/iconst";

export function getItemIcon(tipo: string, className: string) {
  switch (tipo) {
    case "video":
      return <IconPlay className={className} />;
    case "lectura":
      return <IconDocument className={className} />;
    case "quiz":
      return <IconClipboard className={className} />;
    case "practica":
      return <IconCode className={className} />;
    default:
      return <IconDocument className={className} />;
  }
}

export function getItemLabel(tipo: string) {
  switch (tipo) {
    case "video":
      return "Video";
    case "lectura":
      return "Lectura";
    case "quiz":
      return "Quiz";
    case "practica":
      return "Practica de Programacion";
    default:
      return tipo;
  }
}
