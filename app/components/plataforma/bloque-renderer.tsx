"use client";

import { BloqueContenido } from "@/redux/features/types/capacitacion/plataforma-types";

interface Props {
  bloque: BloqueContenido;
  onVideoEnd?: () => void;
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

export default function BloqueRenderer({ bloque, onVideoEnd }: Props) {
  const tipo = bloque.tipo_nombre?.toLowerCase();
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