"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { BloqueForm } from "@/redux/features/types/capacitacion/types";
import { inputCls, selectCls, Field, IconBtn } from "../shared-ui";
import { normalizeTipo } from "./bloque-utils";

// ── Bloque Form Fields (dinámico por tipo) ────────────────────

export function BloqueFormFields({
  tipoCodigo,
  form,
  setForm,
  onFileChange,
}: {
  tipoCodigo: string;
  form: Partial<BloqueForm>;
  setForm: React.Dispatch<React.SetStateAction<Partial<BloqueForm>>>;
  onFileChange?: (f: File | null) => void;
}) {
  const [newItem, setNewItem] = useState("");

  switch (normalizeTipo(tipoCodigo)) {
    case "callout":
    case "alerta":
      return (
        <div className="space-y-2">
          <textarea
            autoFocus
            value={form.texto ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, texto: e.target.value }))}
            placeholder="Texto del callout…"
            rows={2}
            className={inputCls + " resize-none"}
          />
          <select
            value={form.variante ?? "info"}
            onChange={(e) =>
              setForm((f) => ({ ...f, variante: e.target.value }))
            }
            className={selectCls}
          >
            <option value="info">Info</option>
            <option value="warning">Advertencia</option>
            <option value="success">Éxito</option>
            <option value="danger">Peligro</option>
          </select>
        </div>
      );

    case "lista":
    case "pasos":
      return (
        <div className="space-y-2">
          <div className="space-y-1.5">
            {(form.items ?? []).map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="flex-1 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded px-2 py-1">
                  {item}
                </span>
                <IconBtn
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      items: (f.items ?? []).filter((_, j) => j !== i),
                    }))
                  }
                  danger
                >
                  <X className="w-3 h-3" />
                </IconBtn>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              autoFocus
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Nuevo ítem…"
              className={inputCls}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (newItem.trim()) {
                    setForm((f) => ({
                      ...f,
                      items: [...(f.items ?? []), newItem.trim()],
                    }));
                    setNewItem("");
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                if (newItem.trim()) {
                  setForm((f) => ({
                    ...f,
                    items: [...(f.items ?? []), newItem.trim()],
                  }));
                  setNewItem("");
                }
              }}
              className="px-3 py-2 text-xs font-medium text-white bg-[#1c2634] rounded-lg flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );

    case "tabla":
      return (
        <div className="space-y-2">
          {(form.filas ?? []).map((row, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={row.columna1 ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    filas: (f.filas ?? []).map((r, j) =>
                      j === i ? { ...r, columna1: e.target.value } : r,
                    ),
                  }))
                }
                placeholder="Columna 1"
                className={inputCls}
              />
              <input
                value={row.columna2 ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    filas: (f.filas ?? []).map((r, j) =>
                      j === i ? { ...r, columna2: e.target.value } : r,
                    ),
                  }))
                }
                placeholder="Columna 2"
                className={inputCls}
              />
              <IconBtn
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    filas: (f.filas ?? []).filter((_, j) => j !== i),
                  }))
                }
                danger
              >
                <X className="w-3 h-3" />
              </IconBtn>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setForm((f) => ({
                ...f,
                filas: [...(f.filas ?? []), { columna1: "", columna2: "" }],
              }))
            }
            className="text-xs text-[#0056D2] hover:underline"
          >
            + Agregar fila
          </button>
        </div>
      );

    case "video":
    case "texto-video":
      return (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">URL (YouTube, Vimeo…)</p>
            <input
              autoFocus
              value={form.video_url ?? ""}
              onChange={(e) => {
                setForm((f) => ({ ...f, video_url: e.target.value }));
                if (e.target.value) onFileChange?.(null);
              }}
              placeholder="https://www.youtube.com/watch?v=…"
              className={inputCls}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="flex-1 h-px bg-gray-200" />
            o sube un archivo
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              onFileChange?.(file);
              if (file) setForm((f) => ({ ...f, video_url: "" }));
            }}
            className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#F0F6FF] file:text-[#0056D2] hover:file:bg-[#e0edff] file:transition-colors"
          />
        </div>
      );

    case "texto-imagen":
      return <ImagenCampos form={form} setForm={setForm} onFileChange={onFileChange} includeModo={false} />;

    case "texto-elemento-dinamico":
      return <ImagenCampos form={form} setForm={setForm} onFileChange={onFileChange} includeModo />;

    case "texto-paneles":
    case "texto-presentacion":
    case "texto-presentacion-paneles":
    case "texto-tarjetas":
      return (
        <Field label="Texto introductorio (opcional)">
          <textarea
            autoFocus
            value={form.texto ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, texto: e.target.value }))}
            placeholder="Texto que acompaña el bloque…"
            rows={2}
            className={inputCls + " resize-none"}
          />
        </Field>
      );

    default: // texto / párrafo
      return (
        <textarea
          autoFocus
          value={form.texto ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, texto: e.target.value }))}
          placeholder="Contenido del párrafo…"
          rows={3}
          className={inputCls + " resize-none"}
        />
      );
  }
}

// Campos compartidos por "texto-imagen" y "texto-elemento-dinamico" —
// el segundo agrega el toggle de modo simple/interactivo (lightbox).
function ImagenCampos({
  form,
  setForm,
  onFileChange,
  includeModo,
}: {
  form: Partial<BloqueForm>;
  setForm: React.Dispatch<React.SetStateAction<Partial<BloqueForm>>>;
  onFileChange?: (f: File | null) => void;
  includeModo: boolean;
}) {
  return (
    <div className="space-y-3">
      <Field label="Texto (opcional)">
        <textarea
          autoFocus
          value={form.texto ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, texto: e.target.value }))}
          placeholder="Texto que acompaña la imagen…"
          rows={2}
          className={inputCls + " resize-none"}
        />
      </Field>
      <div>
        <p className="text-xs font-medium text-gray-600 mb-1">URL de la imagen</p>
        <input
          value={form.imagen_url ?? ""}
          onChange={(e) => {
            setForm((f) => ({ ...f, imagen_url: e.target.value }));
            if (e.target.value) onFileChange?.(null);
          }}
          placeholder="https://…"
          className={inputCls}
        />
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <div className="flex-1 h-px bg-gray-200" />
        o sube un archivo
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          onFileChange?.(file);
          if (file) setForm((f) => ({ ...f, imagen_url: "" }));
        }}
        className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#F0F6FF] file:text-[#0056D2] hover:file:bg-[#e0edff] file:transition-colors"
      />
      {includeModo && (
        <Field label="Modo de visualización">
          <select
            value={form.variante ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, variante: e.target.value }))}
            className={selectCls}
          >
            <option value="">Simple</option>
            <option value="dinamico">Interactivo (clic para ampliar)</option>
          </select>
        </Field>
      )}
    </div>
  );
}
