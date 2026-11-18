import {
  AlignLeft,
  Info,
  List,
  Table2,
  PlayCircle,
  Image as ImageIcon,
  GalleryHorizontal,
  LayoutPanelTop,
  LayoutGrid,
  Wand2,
  Link2,
} from "lucide-react";
import { ContenidoBloque } from "@/redux/features/types/capacitacion/types";

// tipo_codigo es la llave estable que manda el backend (ya viene en minúsculas
// con guiones, p.ej. "texto-imagen"); solo normalizamos mayúsculas/espacios
// por si acaso. Nunca usar tipo_nombre para dispatch — puede cambiar si se
// edita el catálogo.
export function normalizeTipo(s: string | null | undefined): string {
  return (s ?? "").toLowerCase().trim();
}

// Tipos cuyo contenido vive en registros ContenidoBloqueItem (bloque_items),
// no en campos planos del bloque.
export const ITEM_TIPOS = [
  "texto-paneles",
  "texto-presentacion",
  "texto-presentacion-paneles",
  "texto-tarjetas",
];
export function isItemsTipo(tipoCodigo: string | null | undefined): boolean {
  return ITEM_TIPOS.includes(normalizeTipo(tipoCodigo));
}

// Tipos cubiertos por la spec lienzo-wysiwyg (edición directa en el lienzo,
// sin formulario lateral): exactamente los que NO tienen ítems con guardado
// propio. Los tipos con ítems (ITEM_TIPOS) siguen con el patrón de
// editor-bloques-vivo (formulario + preview en un Sheet) hasta que una spec
// futura extienda la edición directa a ellos.
export function esEdicionEnLienzo(tipoCodigo: string | null | undefined): boolean {
  return !isItemsTipo(tipoCodigo);
}
export function itemLabelFor(tipoCodigo: string | null | undefined): string {
  switch (normalizeTipo(tipoCodigo)) {
    case "texto-presentacion":
    case "texto-presentacion-paneles":
      return "Diapositiva";
    case "texto-paneles":
      return "Panel";
    case "texto-tarjetas":
      return "Tarjeta";
    default:
      return "Ítem";
  }
}

export function bloqueIcon(codigo: string | null | undefined) {
  switch (normalizeTipo(codigo)) {
    case "callout":
    case "alerta":
      return Info;
    case "lista":
    case "pasos":
      return List;
    case "tabla":
      return Table2;
    case "video":
    case "texto-video":
      return PlayCircle;
    case "texto-imagen":
      return ImageIcon;
    case "texto-elemento-dinamico":
      return Wand2;
    case "texto-paneles":
      return LayoutPanelTop;
    case "texto-presentacion":
    case "texto-presentacion-paneles":
      return GalleryHorizontal;
    case "texto-tarjetas":
      return LayoutGrid;
    case "embed":
      return Link2;
    default:
      return AlignLeft;
  }
}

export function bloquePreview(b: ContenidoBloque): string {
  if (b.texto) return b.texto.slice(0, 70) + (b.texto.length > 70 ? "…" : "");
  if (b.video_url) return b.video_url.slice(0, 60) + "…";
  if (b.imagen_url) return b.imagen_url.slice(0, 60) + "…";
  if (b.bloque_items?.length)
    return `${b.bloque_items.length} elemento${b.bloque_items.length !== 1 ? "s" : ""}`;
  if (b.items)
    return `${b.items.length} ítem${b.items.length !== 1 ? "s" : ""}`;
  if (b.filas)
    return `${b.filas.length} fila${b.filas.length !== 1 ? "s" : ""}`;
  return "—";
}
