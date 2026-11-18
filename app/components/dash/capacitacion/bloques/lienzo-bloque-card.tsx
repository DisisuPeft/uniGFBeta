"use client";

import { useState } from "react";
import { Trash2, Edit2, Copy, GripVertical, Check } from "lucide-react";
import Swal from "sweetalert2";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  useUpdateBloqueMutation,
  useDeleteBloqueMutation,
} from "@/redux/features/capacitacion/capacitacionApiSlice";
import { ContenidoBloque, BloqueForm } from "@/redux/features/types/capacitacion/types";
import BloqueRenderer from "@/app/components/plataforma/bloque-renderer";
import { IconBtn } from "../shared-ui";
import { normalizeTipo, esEdicionEnLienzo } from "./bloque-utils";
import { toBloqueContenido, buildPreviewBloque, fileFieldFor } from "./bloques-section";

// Reemplazo directo de la antigua SortableBloqueCard dentro del mismo
// <SortableContext> (bloques-section.tsx) — conserva exactamente el mismo
// mecanismo de arrastre (useSortable) para que reordenar bloques siga
// funcionando igual que antes de esta spec (lienzo-wysiwyg, Non-goals).
//
// Para los tipos cubiertos por lienzo-wysiwyg (esEdicionEnLienzo), seleccionar
// el bloque lo expande en el propio lienzo con BloqueRenderer en modoEdicion —
// nada de formulario lateral. Para los tipos fuera de alcance (tarjetas,
// paneles, presentaciones), seleccionar solo resalta la tarjeta; la edición
// real sigue ocurriendo en el Sheet de PropertiesPanel, sin cambios.
export function LienzoBloqueCard({
  bloque,
  selected,
  onSelect,
  onSaved,
  onDeleted,
  onDuplicate,
}: {
  bloque: ContenidoBloque;
  selected: boolean;
  onSelect: () => void;
  onSaved: () => void;
  onDeleted: () => void;
  onDuplicate: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: bloque.id,
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const [updateBloque, { isLoading: saving }] = useUpdateBloqueMutation();
  const [deleteBloque] = useDeleteBloqueMutation();
  const tipoCodigo = normalizeTipo(bloque.tipo_codigo) || "texto";
  const editableEnLienzo = esEdicionEnLienzo(tipoCodigo);

  const [form, setForm] = useState<Partial<BloqueForm>>({
    texto: bloque.texto ?? "",
    variante: bloque.variante ?? "",
    items: bloque.items ?? [],
    filas: bloque.filas ?? [],
    video_url: bloque.video_url ?? "",
    imagen_url: bloque.imagen_url ?? "",
    embed_url: bloque.embed_url ?? "",
  });
  const [file, setFile] = useState<File | null>(null);

  async function handleSave() {
    try {
      let body: Partial<BloqueForm> | FormData = form;
      if (file) {
        const fd = new FormData();
        if (form.texto) fd.append("texto", form.texto);
        if (form.variante) fd.append("variante", form.variante);
        fd.append(fileFieldFor(tipoCodigo), file);
        body = fd;
      }
      await updateBloque({ id: bloque.id, body }).unwrap();
      setFile(null);
      onSaved();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar." });
    }
  }

  async function handleDelete() {
    const r = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar bloque?",
      showCancelButton: true,
      confirmButtonText: "Sí",
      confirmButtonColor: "#dc2626",
    });
    if (!r.isConfirmed) return;
    try {
      await deleteBloque(bloque.id).unwrap();
      onDeleted();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar." });
    }
  }

  const dragHandle = (
    <button
      type="button"
      {...attributes}
      {...listeners}
      className="p-1 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0"
      title="Arrastrar para reordenar"
    >
      <GripVertical className="w-3.5 h-3.5" />
    </button>
  );

  // No seleccionado, o seleccionado pero fuera de alcance de esta spec
  // (tarjetas/paneles/presentaciones siguen editándose en el Sheet): render
  // de solo lectura, igual que SortableBloqueCard antes de esta spec.
  if (!selected || !editableEnLienzo) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`flex items-start gap-2 px-2 py-2 border rounded-lg bg-white transition-colors ${
          selected ? "border-[#0056D2] ring-1 ring-[#0056D2]/30" : "border-gray-200"
        } ${isDragging ? "opacity-60 z-10" : ""}`}
      >
        {dragHandle}
        {/* div, no button: BloqueRenderer puede contener sus propios botones
            (ej. lightbox de imagen) — anidar <button> dentro de <button> es
            HTML inválido y rompe el comportamiento de clic */}
        <div
          role="button"
          tabIndex={0}
          onClick={onSelect}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect()}
          className="flex-1 min-w-0 text-left cursor-pointer"
        >
          <div className="pointer-events-none">
            <BloqueRenderer bloque={toBloqueContenido(bloque)} />
          </div>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0 pt-0.5">
          <IconBtn onClick={onSelect} title="Editar">
            <Edit2 className="w-3 h-3" />
          </IconBtn>
          <IconBtn onClick={onDuplicate} title="Duplicar">
            <Copy className="w-3 h-3" />
          </IconBtn>
          <IconBtn onClick={handleDelete} danger title="Eliminar">
            <Trash2 className="w-3 h-3" />
          </IconBtn>
        </div>
      </div>
    );
  }

  // Seleccionado y cubierto por lienzo-wysiwyg: edición directa sobre el
  // render real, sin formulario lateral.
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg bg-white border-[#0056D2] ring-1 ring-[#0056D2]/30 ${
        isDragging ? "opacity-60 z-10" : ""
      }`}
    >
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-100">
        {dragHandle}
        <div className="flex items-center gap-1.5">
          {tipoCodigo === "texto-elemento-dinamico" && (
            <select
              value={form.variante ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, variante: e.target.value }))}
              title="Modo de visualización"
              className="text-xs border border-gray-200 rounded-lg px-1.5 py-1"
            >
              <option value="">Simple</option>
              <option value="dinamico">Interactivo (clic para ampliar)</option>
            </select>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-2.5 py-1 text-xs font-medium text-white bg-[#1c2634] rounded-lg disabled:opacity-50"
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
          <IconBtn onClick={onDuplicate} title="Duplicar">
            <Copy className="w-3 h-3" />
          </IconBtn>
          <IconBtn onClick={handleDelete} danger title="Eliminar">
            <Trash2 className="w-3 h-3" />
          </IconBtn>
          <IconBtn onClick={onSelect} title="Listo">
            <Check className="w-3 h-3" />
          </IconBtn>
        </div>
      </div>
      <div className="p-3">
        {/* outline-dashed solo en el elemento con foco real — ver constitución
            de la spec, indicador de selección/edición (plan §0) */}
        <div className="[&_[contenteditable]:focus]:outline [&_[contenteditable]:focus]:outline-dashed [&_[contenteditable]:focus]:outline-[#0056D2]/50 [&_[contenteditable]:focus]:rounded">
          <BloqueRenderer
            bloque={buildPreviewBloque(bloque, form, null)}
            vacioPlaceholder
            modoEdicion={{
              onTextoChange: (texto) => setForm((f) => ({ ...f, texto })),
              onImagenChange: (v) => {
                if (v.archivo) {
                  setFile(v.archivo);
                } else if (v.url !== undefined) {
                  setForm((f) => ({ ...f, imagen_url: v.url }));
                  setFile(null);
                }
              },
              onVideoChange: (v) => {
                if (v.archivo) {
                  setFile(v.archivo);
                } else if (v.url !== undefined) {
                  setForm((f) => ({ ...f, video_url: v.url }));
                  setFile(null);
                }
              },
              onItemsChange: (items) => setForm((f) => ({ ...f, items })),
              onFilasChange: (filas) => setForm((f) => ({ ...f, filas })),
              onVarianteChange: (variante) => setForm((f) => ({ ...f, variante })),
              onEmbedUrlChange: (embed_url) => setForm((f) => ({ ...f, embed_url })),
            }}
          />
        </div>
      </div>
    </div>
  );
}
