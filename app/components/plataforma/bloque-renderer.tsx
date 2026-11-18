"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  BloqueContenido,
  ContenidoBloqueItemPlataforma,
} from "@/redux/features/types/capacitacion/plataforma-types";

// Canal de edición directa sobre el render (lienzo WYSIWYG). Ausente/undefined
// en todo consumidor de solo lectura (plataforma del alumno, PreviewPane, y el
// propio editor cuando el bloque no está seleccionado) — el render en esos
// casos es idéntico al que existía antes de este modo. Cada callback recibe
// el valor nuevo COMPLETO (nunca un diff) y nunca dispara una llamada de red
// — sigue siendo el mismo estado local (form/liveItems) que ya existía.
interface ModoEdicion {
  onTextoChange?: (texto: string) => void;
  onImagenChange?: (v: { url?: string; archivo?: File }) => void;
  onVideoChange?: (v: { url?: string; archivo?: File }) => void;
  onItemsChange?: (items: string[]) => void;
  onFilasChange?: (filas: Record<string, string>[]) => void;
  onVarianteChange?: (variante: string) => void;
  onEmbedUrlChange?: (url: string) => void;
}

interface Props {
  bloque: BloqueContenido;
  onVideoEnd?: () => void;
  // Cuando es true, las ramas que hoy devuelven `null` por falta de
  // contenido muestran un mensaje visible en su lugar. Por defecto (false u
  // omitido) el comportamiento es idéntico al actual — lo usa el editor en
  // vivo (bloques-section.tsx), nunca la plataforma del alumno ni PreviewPane.
  vacioPlaceholder?: boolean;
  modoEdicion?: ModoEdicion;
}

// Texto editable directamente sobre el render (contenteditable no
// controlado): React solo toca el DOM cuando el string entrante difiere del
// que el usuario ya escribió, así que el cursor nunca salta mientras se
// escribe — el valor que vuelve por `onChange` y el que se vuelve a pasar
// como `value` convergen al mismo string en cada vuelta.
function EditableTexto({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Verdaderamente no controlado: el contenido del DOM se siembra una sola
  // vez (al montar — este componente se desmonta/remonta cada vez que se
  // selecciona/deselecciona el bloque, así que un mount = un bloque). Nunca
  // se vuelve a escribir `value` en el DOM en renders posteriores: hacerlo
  // en cada tecleo (vía `{value}` como children, que sí se re-renderiza con
  // cada `onChange`→`setForm`) colapsa el cursor al inicio del texto en
  // cada pulsación, aunque el string entrante sea idéntico al ya escrito.
  useEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onInput={(e) => onChange(e.currentTarget.textContent ?? "")}
      className={`${className} outline-none empty:before:content-[attr(data-placeholder)] empty:before:opacity-50 empty:before:pointer-events-none`}
    />
  );
}

function VariantePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const opciones: { v: string; color: string; label: string }[] = [
    { v: "info", color: "bg-blue-500", label: "Info" },
    { v: "warning", color: "bg-amber-500", label: "Advertencia" },
    { v: "success", color: "bg-green-500", label: "Éxito" },
    { v: "danger", color: "bg-red-500", label: "Peligro" },
  ];
  return (
    <div className="mt-2 flex items-center gap-1.5">
      {opciones.map((o) => (
        <button
          key={o.v}
          type="button"
          title={o.label}
          onClick={() => onChange(o.v)}
          className={`w-4 h-4 rounded-full ${o.color} transition-opacity ${
            value === o.v ? "ring-2 ring-offset-1 ring-gray-400" : "opacity-40 hover:opacity-80"
          }`}
        />
      ))}
    </div>
  );
}

function EstadoVacio({ mensaje }: { mensaje: string }) {
  return (
    <p className="my-5 text-sm text-gray-400 italic text-center border border-dashed border-gray-200 rounded-xl p-4">
      {mensaje}
    </p>
  );
}

// tipo_codigo es la llave estable que manda el backend (minúsculas, con
// guiones). Nunca usar tipo_nombre para dispatch.
function normalizeTipo(s: string | null | undefined): string {
  return (s ?? "").toLowerCase().trim();
}

function VideoEdicion({
  url,
  onVideoChange,
}: {
  url: string | null;
  onVideoChange: (v: { url?: string; archivo?: File }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [urlDraft, setUrlDraft] = useState(url ?? "");

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-dashed border-gray-300 text-sm text-gray-500 hover:text-gray-700 hover:border-gray-400 py-3 text-center"
      >
        {url ? "Cambiar video" : "Agregar video"}
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 p-3 space-y-2 bg-gray-50/60">
      <input
        value={urlDraft}
        onChange={(e) => setUrlDraft(e.target.value)}
        onBlur={() => urlDraft !== url && onVideoChange({ url: urlDraft })}
        placeholder="https://www.youtube.com/watch?v=…"
        className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5"
      />
      <input
        type="file"
        accept="video/*"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          if (file) onVideoChange({ archivo: file });
        }}
        className="w-full text-xs text-gray-600 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#F0F6FF] file:text-[#0056D2]"
      />
      <div className="flex justify-end gap-2">
        {url && (
          <button
            type="button"
            onClick={() => {
              onVideoChange({ url: "" });
              setUrlDraft("");
            }}
            className="text-xs text-red-600 hover:underline"
          >
            Quitar video
          </button>
        )}
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-gray-500 hover:underline">
          Cerrar
        </button>
      </div>
    </div>
  );
}

// embed_url es texto libre (sin validación de dominio en backend, ver
// contrato) — solo texto, sin opción de subir archivo (no aplica a un embed).
function EmbedEdicion({
  url,
  onEmbedUrlChange,
}: {
  url: string | null;
  onEmbedUrlChange: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [urlDraft, setUrlDraft] = useState(url ?? "");

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-dashed border-gray-300 text-sm text-gray-500 hover:text-gray-700 hover:border-gray-400 py-3 text-center"
      >
        {url ? "Cambiar embed" : "Agregar embed"}
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 p-3 space-y-2 bg-gray-50/60">
      <input
        value={urlDraft}
        onChange={(e) => setUrlDraft(e.target.value)}
        onBlur={() => urlDraft !== url && onEmbedUrlChange(urlDraft)}
        placeholder="https://www.canva.com/design/…/view?embed"
        className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5"
      />
      <p className="text-[11px] text-gray-400">
        Usa el link de &quot;Insertar en un sitio web&quot; de Canva (termina en{" "}
        <code>?embed</code>), no el de &quot;Compartir&quot;.
      </p>
      <div className="flex justify-end gap-2">
        {url && (
          <button
            type="button"
            onClick={() => {
              onEmbedUrlChange("");
              setUrlDraft("");
            }}
            className="text-xs text-red-600 hover:underline"
          >
            Quitar embed
          </button>
        )}
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-gray-500 hover:underline">
          Cerrar
        </button>
      </div>
    </div>
  );
}

// Un video externo (YouTube/Vimeo) corre en un iframe de otro origen: no hay
// evento "terminó" que podamos escuchar, ni siquiera cuando el embed falla y
// el propio YouTube muestra su botón "Mirar en YouTube" dentro del iframe
// (ese botón es contenido cross-origin, inaccesible para nosotros). La única
// señal que sí podemos capturar es el clic del propio alumno en ESTE enlace,
// que abre el video en una pestaña nueva — se toma como evidencia suficiente
// de que accedió al contenido y se desbloquea continuar.
function VideoExternoContinuar({ url, onEnded }: { url: string; onEnded?: () => void }) {
  if (!onEnded) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onEnded()}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0056D2] hover:underline"
    >
      Ya vi este video — continuar
    </a>
  );
}

function VideoBloque({ url, streamUrl, onEnded }: { url: string | null; streamUrl: string | null; onEnded?: () => void }) {
  if (streamUrl) {
    return (
      <div className="rounded-xl overflow-hidden bg-black">
        <video src={streamUrl} controls className="w-full max-h-[480px]" onEnded={onEnded} />
      </div>
    );
  }

  if (!url) return null;

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = url.includes("youtu.be")
      ? url.split("/").pop()?.split("?")[0]
      : new URLSearchParams(url.split("?")[1]).get("v");
    return (
      <div className="space-y-2">
        <div className="relative w-full pb-[56.25%] h-0 rounded-xl overflow-hidden bg-black">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <VideoExternoContinuar url={url} onEnded={onEnded} />
      </div>
    );
  }

  if (url.includes("vimeo.com")) {
    const videoId = url.split("/").pop();
    return (
      <div className="space-y-2">
        <div className="relative w-full pb-[56.25%] h-0 rounded-xl overflow-hidden bg-black">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://player.vimeo.com/video/${videoId}`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
        <VideoExternoContinuar url={url} onEnded={onEnded} />
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden bg-black">
      <video src={url} controls className="w-full max-h-[480px]" onEnded={onEnded} />
    </div>
  );
}

function ImagenEdicion({
  url,
  onImagenChange,
}: {
  url: string | null;
  onImagenChange: (v: { url?: string; archivo?: File }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [urlDraft, setUrlDraft] = useState(url ?? "");

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-dashed border-gray-300 text-sm text-gray-500 hover:text-gray-700 hover:border-gray-400 py-3 text-center"
      >
        {url ? "Cambiar imagen" : "Agregar imagen"}
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 p-3 space-y-2 bg-gray-50/60">
      <input
        value={urlDraft}
        onChange={(e) => setUrlDraft(e.target.value)}
        onBlur={() => urlDraft !== url && onImagenChange({ url: urlDraft })}
        placeholder="https://…"
        className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          if (file) onImagenChange({ archivo: file });
        }}
        className="w-full text-xs text-gray-600 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#F0F6FF] file:text-[#0056D2]"
      />
      <div className="flex justify-end gap-2">
        {url && (
          <button
            type="button"
            onClick={() => {
              onImagenChange({ url: "" });
              setUrlDraft("");
            }}
            className="text-xs text-red-600 hover:underline"
          >
            Quitar imagen
          </button>
        )}
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-gray-500 hover:underline">
          Cerrar
        </button>
      </div>
    </div>
  );
}

function ImagenBloque({
  url,
  texto,
  items,
  dinamico,
  vacioPlaceholder,
  modoEdicion,
}: {
  url: string | null;
  texto: string | null;
  items: string[] | null;
  dinamico: boolean;
  vacioPlaceholder?: boolean;
  modoEdicion?: ModoEdicion;
}) {
  const [open, setOpen] = useState(false);
  const hasItems = !!items?.length;

  if (modoEdicion) {
    return (
      <div className="my-5 not-prose space-y-2">
        {url ? (
          <div className="relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={texto ?? ""} className="w-full object-cover rounded-xl" />
            <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ImagenEdicion url={url} onImagenChange={(v) => modoEdicion.onImagenChange?.(v)} />
            </div>
          </div>
        ) : (
          <ImagenEdicion url={url} onImagenChange={(v) => modoEdicion.onImagenChange?.(v)} />
        )}
        <EditableTexto
          value={texto ?? ""}
          onChange={(v) => modoEdicion.onTextoChange?.(v)}
          placeholder="Escribe un texto para acompañar la imagen…"
          className="text-sm text-gray-700 leading-relaxed"
        />
        {hasItems && (
          <ul className="space-y-1.5 text-gray-700">
            {items!.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                {String(item)}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (!url && !texto && !hasItems) {
    return vacioPlaceholder ? (
      <EstadoVacio mensaje="Este bloque no tiene imagen ni texto todavía." />
    ) : null;
  }

  return (
    <div className="my-5 not-prose">
      {url && (
        <button
          type="button"
          onClick={() => dinamico && setOpen(true)}
          className={`block w-full rounded-xl overflow-hidden ${dinamico ? "cursor-zoom-in" : "cursor-default"}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={texto ?? ""} className="w-full object-cover" />
        </button>
      )}
      {texto && (
        <p className={`text-sm text-gray-700 leading-relaxed whitespace-pre-wrap ${url ? "mt-2" : ""}`}>
          {texto}
        </p>
      )}
      {hasItems && (
        <ul className={`space-y-1.5 text-gray-700 ${url || texto ? "mt-3" : ""}`}>
          {items!.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
              {String(item)}
            </li>
          ))}
        </ul>
      )}

      {url && dinamico && open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={texto ?? ""}
            className="max-w-full max-h-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

function SlideCarousel({
  slides,
  variant,
}: {
  slides: ContenidoBloqueItemPlataforma[];
  variant: "presentacion" | "panel";
}) {
  const [index, setIndex] = useState(0);
  if (!slides.length) return null;

  const slide = slides[index];
  const go = (dir: -1 | 1) =>
    setIndex((i) => (i + dir + slides.length) % slides.length);

  return (
    <div className="not-prose">
      <div className="relative rounded-xl overflow-hidden bg-gray-900 min-h-[220px]">
        {(slide.imagen_url || slide.imagen_archivo) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slide.imagen_url || slide.imagen_archivo || ""}
            alt={slide.titulo ?? ""}
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
        )}
        <div className="relative z-10 p-5 flex flex-col justify-end min-h-[220px] text-white">
          {slide.titulo && <h4 className="text-lg font-bold mb-1">{slide.titulo}</h4>}
          {slide.texto && <p className="text-sm text-white/90 mb-2">{slide.texto}</p>}
          {!!slide.items?.length && (
            <ol className="text-sm space-y-0.5 list-decimal list-inside text-white/90">
              {slide.items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ol>
          )}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {variant === "panel" ? (
        <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${((index + 1) / slides.length) * 100}%` }}
          />
        </div>
      ) : (
        slides.length > 1 && (
          <div className="mt-2 flex justify-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? "bg-gray-800" : "bg-gray-300"}`}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}

function TarjetasBloque({ tarjetas }: { tarjetas: ContenidoBloqueItemPlataforma[] }) {
  if (!tarjetas.length) return null;
  return (
    <div className="not-prose grid grid-cols-2 sm:grid-cols-3 gap-3">
      {tarjetas.map((card, i) => (
        <div
          key={i}
          className="relative rounded-xl overflow-hidden bg-gray-900 min-h-[120px] flex items-center justify-center text-center p-3"
        >
          {(card.imagen_url || card.imagen_archivo) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={card.imagen_url || card.imagen_archivo || ""}
              alt={card.titulo ?? ""}
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
          )}
          <div className="relative z-10">
            <p className="text-white font-bold text-sm">{card.titulo}</p>
            {card.texto && <p className="text-white/90 text-xs mt-1">{card.texto}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BloqueRenderer({ bloque, onVideoEnd, vacioPlaceholder, modoEdicion }: Props) {
  const tipo = normalizeTipo(bloque.tipo_codigo);
  const variante = bloque.variante?.toLowerCase();

  if (tipo === "video" || tipo === "texto-video") {
    if (modoEdicion) {
      return (
        <div className="my-5 space-y-2">
          {(bloque.video_url || bloque.video_stream_url) && (
            <VideoBloque url={bloque.video_url} streamUrl={bloque.video_stream_url} onEnded={onVideoEnd} />
          )}
          <VideoEdicion
            url={bloque.video_url}
            onVideoChange={(v) => modoEdicion.onVideoChange?.(v)}
          />
        </div>
      );
    }
    if (vacioPlaceholder && !bloque.video_url && !bloque.video_stream_url) {
      return <EstadoVacio mensaje="Este bloque no tiene video todavía." />;
    }
    return (
      <div className="my-5">
        <VideoBloque url={bloque.video_url} streamUrl={bloque.video_stream_url} onEnded={onVideoEnd} />
      </div>
    );
  }

  if (tipo === "embed") {
    if (modoEdicion) {
      return (
        <div className="my-5 space-y-2 not-prose">
          {bloque.embed_url && (
            <div className="relative w-full pb-[56.25%] h-0 rounded-xl overflow-hidden bg-gray-100">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={bloque.embed_url}
                loading="lazy"
                allowFullScreen
              />
            </div>
          )}
          <EmbedEdicion
            url={bloque.embed_url}
            onEmbedUrlChange={(url) => modoEdicion.onEmbedUrlChange?.(url)}
          />
        </div>
      );
    }
    if (!bloque.embed_url) {
      return vacioPlaceholder ? (
        <EstadoVacio mensaje="Este bloque no tiene un embed todavía." />
      ) : null;
    }
    return (
      <div className="my-5 not-prose relative w-full pb-[56.25%] h-0 rounded-xl overflow-hidden bg-gray-100">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={bloque.embed_url}
          loading="lazy"
          allowFullScreen
        />
      </div>
    );
  }

  if (tipo === "lista" || tipo === "pasos") {
    const items = (bloque.items as string[] | null) ?? [];
    if (modoEdicion) {
      const onItemsChange = modoEdicion.onItemsChange ?? (() => {});
      return (
        <ul className="my-4 space-y-1.5 text-gray-700">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm group">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
              <EditableTexto
                value={item}
                onChange={(v) => onItemsChange(items.map((it, j) => (j === i ? v : it)))}
                placeholder="Elemento de la lista…"
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => onItemsChange(items.filter((_, j) => j !== i))}
                className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 flex-shrink-0"
                title="Quitar elemento"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => onItemsChange([...items, ""])}
              className="text-xs text-[#0056D2] hover:underline"
            >
              + Agregar elemento
            </button>
          </li>
        </ul>
      );
    }
    if (!items.length) {
      return vacioPlaceholder ? <EstadoVacio mensaje="Esta lista no tiene elementos todavía." /> : null;
    }
    return (
      <ul className="my-4 space-y-1.5 text-gray-700">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
            {String(item)}
          </li>
        ))}
      </ul>
    );
  }

  if (tipo === "callout" || tipo === "alerta") {
    const styles: Record<string, string> = {
      info: "bg-blue-50 border-blue-200 text-blue-800",
      warning: "bg-amber-50 border-amber-200 text-amber-800",
      success: "bg-green-50 border-green-200 text-green-800",
      danger: "bg-red-50 border-red-200 text-red-800",
    };
    if (modoEdicion) {
      return (
        <div className={`my-4 border rounded-xl p-4 text-sm ${styles[variante ?? "info"] ?? styles.info}`}>
          <EditableTexto
            value={bloque.texto}
            onChange={(v) => modoEdicion.onTextoChange?.(v)}
            placeholder="Escribe el texto del aviso…"
            className=""
          />
          <VariantePicker
            value={variante ?? "info"}
            onChange={(v) => modoEdicion.onVarianteChange?.(v)}
          />
        </div>
      );
    }
    if (vacioPlaceholder && !bloque.texto) {
      return <EstadoVacio mensaje="Este bloque no tiene texto todavía." />;
    }
    return (
      <div className={`my-4 border rounded-xl p-4 text-sm ${styles[variante ?? "info"] ?? styles.info}`}>
        {bloque.texto}
      </div>
    );
  }

  if (tipo === "texto-imagen" || tipo === "texto-elemento-dinamico") {
    return (
      <ImagenBloque
        url={bloque.imagen_url || bloque.imagen_archivo}
        texto={bloque.texto}
        items={bloque.items as string[] | null}
        dinamico={variante === "dinamico"}
        vacioPlaceholder={vacioPlaceholder}
        modoEdicion={modoEdicion}
      />
    );
  }

  if (tipo === "texto-paneles" || tipo === "texto-presentacion" || tipo === "texto-presentacion-paneles") {
    const slides = bloque.bloque_items ?? [];
    if (!bloque.texto && !slides.length) {
      return vacioPlaceholder ? <EstadoVacio mensaje="Este bloque no tiene paneles todavía." /> : null;
    }
    return (
      <div className="my-5">
        {bloque.texto && (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{bloque.texto}</p>
        )}
        {!!slides.length && (
          <div className={bloque.texto ? "mt-2" : ""}>
            <SlideCarousel
              slides={slides}
              variant={tipo === "texto-paneles" || tipo === "texto-presentacion-paneles" ? "panel" : "presentacion"}
            />
          </div>
        )}
      </div>
    );
  }

  if (tipo === "texto-tarjetas") {
    const tarjetas = bloque.bloque_items ?? [];
    if (!bloque.texto && !tarjetas.length) {
      return vacioPlaceholder ? <EstadoVacio mensaje="Este bloque no tiene tarjetas todavía." /> : null;
    }
    return (
      <div className="my-5">
        {bloque.texto && (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{bloque.texto}</p>
        )}
        {!!tarjetas.length && (
          <div className={bloque.texto ? "mt-2" : ""}>
            <TarjetasBloque tarjetas={tarjetas} />
          </div>
        )}
      </div>
    );
  }

  if (tipo === "tabla") {
    const filas = (bloque.filas as Record<string, string>[] | null) ?? [];
    if (modoEdicion) {
      const onFilasChange = modoEdicion.onFilasChange ?? (() => {});
      const headers = filas.length ? Object.keys(filas[0]) : ["columna1", "columna2"];
      return (
        <div className="my-5 overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((h) => (
                  <th key={h} className="px-4 py-2.5 font-semibold text-gray-600 border-b border-gray-200">
                    {h}
                  </th>
                ))}
                <th className="w-8 border-b border-gray-200" />
              </tr>
            </thead>
            <tbody>
              {filas.map((fila, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 group">
                  {headers.map((h) => (
                    <td key={h} className="px-4 py-2.5 text-gray-700">
                      <EditableTexto
                        value={fila[h] ?? ""}
                        onChange={(v) =>
                          onFilasChange(filas.map((f, j) => (j === i ? { ...f, [h]: v } : f)))
                        }
                        placeholder=""
                        className=""
                      />
                    </td>
                  ))}
                  <td className="px-2">
                    <button
                      type="button"
                      onClick={() => onFilasChange(filas.filter((_, j) => j !== i))}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500"
                      title="Quitar fila"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={() => onFilasChange([...filas, { columna1: "", columna2: "" }])}
            className="m-2 text-xs text-[#0056D2] hover:underline"
          >
            + Agregar fila
          </button>
        </div>
      );
    }
    if (!filas.length) {
      return vacioPlaceholder ? <EstadoVacio mensaje="Esta tabla no tiene filas todavía." /> : null;
    }
    const headers = Object.keys(filas[0]);
    return (
      <div className="my-5 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 font-semibold text-gray-600 border-b border-gray-200"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, i) => (
              <tr
                key={i}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
              >
                {headers.map((h) => (
                  <td key={h} className="px-4 py-2.5 text-gray-700">
                    {fila[h]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Texto con variantes (h1/h2/cita/alerta-info y el párrafo por defecto)
  if (vacioPlaceholder && !bloque.texto) {
    return <EstadoVacio mensaje="Este bloque no tiene contenido todavía." />;
  }
  if (variante === "h1" || variante === "titulo") {
    return (
      <h2 className="text-xl font-semibold text-gray-900 my-5">{bloque.texto}</h2>
    );
  }
  if (variante === "h2" || variante === "subtitulo") {
    return (
      <h3 className="text-lg font-semibold text-gray-800 my-4">{bloque.texto}</h3>
    );
  }
  if (variante === "cita" || variante === "quote") {
    return (
      <blockquote className="border-l-4 border-blue-400 pl-4 my-4 text-gray-600 italic text-sm">
        {bloque.texto}
      </blockquote>
    );
  }
  if (variante === "alerta" || variante === "info") {
    return (
      <div className="my-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        {bloque.texto}
      </div>
    );
  }

  return (
    <p className="my-3 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
      {bloque.texto}
    </p>
  );
}