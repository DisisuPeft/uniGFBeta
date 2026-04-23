"use client";

import {
  useGetComentariosQuery,
  useCreateComentarioMutation,
  useResponderComentarioMutation,
} from "@/redux/features/control-escolar/comunidadApiSlice";
import { useState } from "react";
import { Send, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  diplomadoId: string;
}

export default function ComentariosView({ diplomadoId }: Props) {
  const { data: comentarios, refetch } = useGetComentariosQuery({ diplomado: diplomadoId });
  const [createComentario] = useCreateComentarioMutation();
  const [responderComentario] = useResponderComentarioMutation();

  const [nuevoComentario, setNuevoComentario] = useState("");
  const [respuestaTexto, setRespuestaTexto] = useState<Record<number, string>>({});
  const [expandido, setExpandido] = useState<Record<number, boolean>>({});

  const handleEnviar = async () => {
    const texto = nuevoComentario.trim();
    if (!texto) return;
    await createComentario({ comentario: texto, diplomado: diplomadoId });
    setNuevoComentario("");
    refetch();
  };

  const handleResponder = async (id: number) => {
    const texto = respuestaTexto[id]?.trim();
    if (!texto) return;
    await responderComentario({ id, comentario: texto });
    setRespuestaTexto((prev) => ({ ...prev, [id]: "" }));
    refetch();
  };

  const toggleExpandido = (id: number) =>
    setExpandido((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Comentarios</h1>

      {/* Nuevo comentario */}
      <div className="border border-gray-200 rounded-xl p-4 space-y-3">
        <textarea
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          rows={3}
          placeholder="Escribe un comentario..."
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-[#0056D2] text-gray-800 placeholder:text-gray-400"
        />
        <div className="flex justify-end">
          <button
            onClick={handleEnviar}
            disabled={!nuevoComentario.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-[#0056D2] text-white text-sm font-medium rounded-lg hover:bg-[#004BB5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
            Comentar
          </button>
        </div>
      </div>

      {/* Lista */}
      {!comentarios?.results?.length && (
        <p className="text-sm text-gray-500 text-center py-8">
          Aún no hay comentarios. ¡Sé el primero!
        </p>
      )}

      <div className="space-y-4">
        {comentarios?.results?.map((c) => (
          <div key={c.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-[#0056D2]">{c.usuario_nombre}</p>
              <p className="text-sm text-gray-800 mt-1">{c.comentario}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(c.created_at).toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            {c.respuestas.length > 0 && (
              <div>
                <button
                  onClick={() => toggleExpandido(c.id!)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {expandido[c.id!] ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                  {c.respuestas.length} respuesta{c.respuestas.length > 1 ? "s" : ""}
                </button>

                {expandido[c.id!] && (
                  <div className="mt-2 space-y-2 pl-4 border-l-2 border-gray-100">
                    {c.respuestas.map((r) => (
                      <div key={r.id}>
                        <p className="text-xs font-semibold text-[#0056D2]">{r.usuario_nombre}</p>
                        <p className="text-sm text-gray-700">{r.comentario}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 items-end pt-1 border-t border-gray-100">
              <textarea
                value={respuestaTexto[c.id!] ?? ""}
                onChange={(e) =>
                  setRespuestaTexto((prev) => ({ ...prev, [c.id!]: e.target.value }))
                }
                rows={1}
                placeholder="Responder..."
                className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 resize-none focus:outline-none focus:border-[#0056D2] text-gray-800 placeholder:text-gray-400"
              />
              <button
                onClick={() => handleResponder(c.id!)}
                disabled={!respuestaTexto[c.id!]?.trim()}
                className="p-1.5 bg-[#0056D2] text-white rounded-lg hover:bg-[#004BB5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
