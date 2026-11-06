"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  BloqueContenido,
  BloquePanelPlataforma,
  BloqueTarjetaPlataforma,
} from "@/redux/features/types/capacitacion/plataforma-types";

interface Props {
  bloque: BloqueContenido;
  onVideoEnd?: () => void;
}

// Normaliza nombre/código de tipo de bloque (minúsculas, sin acentos).
function normalizeTipo(s: string | null | undefined): string {
  return (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
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
      <div className="relative w-full pb-[56.25%] h-0 rounded-xl overflow-hidden bg-black">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (url.includes("vimeo.com")) {
    const videoId = url.split("/").pop();
    return (
      <div className="relative w-full pb-[56.25%] h-0 rounded-xl overflow-hidden bg-black">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://player.vimeo.com/video/${videoId}`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden bg-black">
      <video src={url} controls className="w-full max-h-[480px]" onEnded={onEnded} />
    </div>
  );
}

function ImagenBloque({
  url,
  texto,
  dinamico,
}: {
  url: string | null;
  texto: string | null;
  dinamico: boolean;
}) {
  const [open, setOpen] = useState(false);
  if (!url) return null;

  return (
    <div className="my-5 not-prose">
      <button
        type="button"
        onClick={() => dinamico && setOpen(true)}
        className={`block w-full rounded-xl overflow-hidden ${dinamico ? "cursor-zoom-in" : "cursor-default"}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={texto ?? ""} className="w-full object-cover" />
      </button>
      {texto && <p className="mt-2 text-sm text-gray-600 leading-relaxed">{texto}</p>}

      {dinamico && open && (
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
  slides: BloquePanelPlataforma[];
  variant: "presentacion" | "panel";
}) {
  const [index, setIndex] = useState(0);
  if (!slides.length) return null;

  const slide = slides[index];
  const go = (dir: -1 | 1) =>
    setIndex((i) => (i + dir + slides.length) % slides.length);

  return (
    <div className="my-5 not-prose">
      <div className="relative rounded-xl overflow-hidden bg-gray-900 min-h-[220px]">
        {slide.imagen_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slide.imagen_url}
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

function TarjetasBloque({ tarjetas }: { tarjetas: BloqueTarjetaPlataforma[] }) {
  if (!tarjetas.length) return null;
  return (
    <div className="my-5 not-prose grid grid-cols-2 sm:grid-cols-3 gap-3">
      {tarjetas.map((card, i) => (
        <div
          key={i}
          className="relative rounded-xl overflow-hidden bg-gray-900 min-h-[120px] flex items-center justify-center text-center p-3"
        >
          {card.imagen_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={card.imagen_url}
              alt={card.titulo}
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

export default function BloqueRenderer({ bloque, onVideoEnd }: Props) {
  const tipo = normalizeTipo(bloque.tipo_nombre);
  const variante = bloque.variante?.toLowerCase();

  if (tipo === "video") {
    return (
      <div className="my-5">
        <VideoBloque url={bloque.video_url} streamUrl={bloque.video_stream_url} onEnded={onVideoEnd} />
      </div>
    );
  }

  if (tipo === "lista") {
    const items = bloque.items as string[] | null;
    return (
      <ul className="my-4 space-y-1.5 text-gray-700">
        {(items ?? []).map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
            {String(item)}
          </li>
        ))}
      </ul>
    );
  }

  if (tipo === "imagenes" || tipo === "imagen" || tipo === "img") {
    return (
      <ImagenBloque
        url={bloque.imagen_url}
        texto={bloque.texto}
        dinamico={variante === "dinamico"}
      />
    );
  }

  if (tipo === "paneles" || tipo === "panel" || tipo === "presentacion") {
    return (
      <SlideCarousel
        slides={bloque.paneles ?? []}
        variant={tipo === "presentacion" ? "presentacion" : "panel"}
      />
    );
  }

  if (tipo === "tarjetas" || tipo === "tarjeta" || tipo === "cards") {
    return <TarjetasBloque tarjetas={bloque.tarjetas ?? []} />;
  }

  if (tipo === "tabla") {
    const filas = bloque.filas as Record<string, string>[] | null;
    if (!filas?.length) return null;
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

  // Texto con variantes
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