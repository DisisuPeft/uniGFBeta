"use client";

import { useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import {
  useCreateBloqueItemMutation,
  useUpdateBloqueItemMutation,
  useDeleteBloqueItemMutation,
  useReordenarBloqueItemsMutation,
} from "@/redux/features/capacitacion/capacitacionApiSlice";
import { ContenidoBloqueItem, ContenidoBloqueItemForm } from "@/redux/features/types/capacitacion/types";
import { inputCls, IconBtn, AddBtn } from "../shared-ui";
import { itemLabelFor } from "./bloque-utils";

// ── Ítems de bloque (paneles / diapositivas / tarjetas) ────────
// Cada ítem es una entidad real (ContenidoBloqueItem): se crea, guarda,
// borra y reordena de inmediato contra su propio endpoint, independiente
// del botón "Guardar" del bloque padre (que solo aplica a texto/variante).

function LiveItemRow({
  item,
  label,
  onMove,
  canMoveUp,
  canMoveDown,
  onLiveChange,
}: {
  item: ContenidoBloqueItem;
  label: string;
  onMove: (dir: -1 | 1) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  // Observador de solo lectura: se invoca con el estado en edición de esta
  // fila en cada cambio, ANTES de que se guarde con "Guardar cambios". No
  // afecta cuándo ni cómo se persiste el ítem (eso lo sigue haciendo
  // handleSave vía updateItem, sin relación con esto).
  onLiveChange?: (patch: Partial<ContenidoBloqueItem>) => void;
}) {
  const [updateItem, { isLoading: saving }] = useUpdateBloqueItemMutation();
  const [deleteItem] = useDeleteBloqueItemMutation();
  const [titulo, setTitulo] = useState(item.titulo ?? "");
  const [texto, setTexto] = useState(item.texto ?? "");
  const [imagenUrl, setImagenUrl] = useState(item.imagen_url ?? "");
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [subItems, setSubItems] = useState<string[]>(item.items ?? []);
  const [newSubItem, setNewSubItem] = useState("");
  const [dirty, setDirty] = useState(false);

  function emitLive(partial: {
    titulo?: string;
    texto?: string;
    imagenUrl?: string;
    subItems?: string[];
  }) {
    onLiveChange?.({
      titulo: partial.titulo ?? titulo,
      texto: partial.texto ?? texto,
      imagen_url: partial.imagenUrl ?? imagenUrl,
      items: partial.subItems ?? subItems,
    });
  }

  async function handleSave() {
    try {
      let body: Partial<ContenidoBloqueItemForm> | FormData;
      if (imagenFile) {
        const fd = new FormData();
        fd.append("titulo", titulo);
        fd.append("texto", texto);
        fd.append("items", JSON.stringify(subItems));
        fd.append("imagen_archivo", imagenFile);
        body = fd;
      } else {
        body = { titulo, texto, imagen_url: imagenUrl, items: subItems };
      }
      await updateItem({ id: item.id, body }).unwrap();
      setDirty(false);
      setImagenFile(null);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar el ítem." });
    }
  }

  async function handleDelete() {
    const r = await Swal.fire({
      icon: "warning",
      title: `¿Eliminar ${label.toLowerCase()}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      confirmButtonColor: "#dc2626",
    });
    if (!r.isConfirmed) return;
    try {
      await deleteItem(item.id).unwrap();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar." });
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-2.5 space-y-2 bg-gray-50/60">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500">{label}</p>
        <div className="flex items-center gap-0.5">
          {canMoveUp && (
            <IconBtn onClick={() => onMove(-1)}>
              <ChevronDown className="w-3 h-3 rotate-180" />
            </IconBtn>
          )}
          {canMoveDown && (
            <IconBtn onClick={() => onMove(1)}>
              <ChevronDown className="w-3 h-3" />
            </IconBtn>
          )}
          <IconBtn onClick={handleDelete} danger>
            <Trash2 className="w-3 h-3" />
          </IconBtn>
        </div>
      </div>
      <input
        value={titulo}
        onChange={(e) => {
          setTitulo(e.target.value);
          setDirty(true);
          emitLive({ titulo: e.target.value });
        }}
        placeholder="Título"
        className={inputCls}
      />
      <input
        value={imagenUrl}
        onChange={(e) => {
          setImagenUrl(e.target.value);
          setImagenFile(null);
          setDirty(true);
          emitLive({ imagenUrl: e.target.value });
        }}
        placeholder="URL de imagen"
        className={inputCls}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          setImagenFile(file);
          if (file) setImagenUrl("");
          setDirty(true);
        }}
        className="w-full text-xs text-gray-600 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#F0F6FF] file:text-[#0056D2] hover:file:bg-[#e0edff] file:transition-colors"
      />
      {item.imagen_archivo && !imagenUrl && !imagenFile && (
        <p className="text-[11px] text-gray-400 truncate">Archivo actual: {item.imagen_archivo}</p>
      )}
      <textarea
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value);
          setDirty(true);
          emitLive({ texto: e.target.value });
        }}
        placeholder="Texto / descripción (opcional)"
        rows={2}
        className={inputCls + " resize-none"}
      />
      <div className="space-y-1">
        {subItems.map((it, k) => (
          <div key={k} className="flex items-center gap-2">
            <span className="flex-1 text-xs text-gray-700 bg-white border border-gray-200 rounded px-2 py-1">
              {it}
            </span>
            <IconBtn
              onClick={() => {
                const next = subItems.filter((_, j) => j !== k);
                setSubItems(next);
                setDirty(true);
                emitLive({ subItems: next });
              }}
              danger
            >
              <Trash2 className="w-3 h-3" />
            </IconBtn>
          </div>
        ))}
        <div className="flex gap-2">
          <input
            value={newSubItem}
            onChange={(e) => setNewSubItem(e.target.value)}
            placeholder="Nuevo ítem de la lista…"
            className={inputCls}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (newSubItem.trim()) {
                  const next = [...subItems, newSubItem.trim()];
                  setSubItems(next);
                  setNewSubItem("");
                  setDirty(true);
                  emitLive({ subItems: next });
                }
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              if (newSubItem.trim()) {
                const next = [...subItems, newSubItem.trim()];
                setSubItems(next);
                setNewSubItem("");
                setDirty(true);
                emitLive({ subItems: next });
              }
            }}
            className="px-3 py-2 text-xs font-medium text-white bg-[#1c2634] rounded-lg flex-shrink-0"
          >
            +
          </button>
        </div>
      </div>
      {dirty && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-3 py-1 text-xs font-medium text-white bg-[#0056D2] rounded-lg disabled:opacity-50"
        >
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      )}
    </div>
  );
}

export function LiveItemsEditor({
  tipoCodigo,
  bloqueId,
  items,
  onLiveChange,
}: {
  tipoCodigo: string;
  bloqueId: number;
  items: ContenidoBloqueItem[];
  // Observador de solo lectura: ver LiveItemRow. Se invoca con el array
  // completo de ítems, reflejando el estado en edición de todas las filas.
  onLiveChange?: (items: ContenidoBloqueItem[]) => void;
}) {
  const [createItem, { isLoading: adding }] = useCreateBloqueItemMutation();
  const [reordenarItems] = useReordenarBloqueItemsMutation();
  const [liveOverrides, setLiveOverrides] = useState<Record<number, Partial<ContenidoBloqueItem>>>({});
  const label = itemLabelFor(tipoCodigo);
  const sorted = [...items].sort((a, b) => a.orden - b.orden);

  function handleRowLiveChange(itemId: number, patch: Partial<ContenidoBloqueItem>) {
    const next = { ...liveOverrides, [itemId]: patch };
    setLiveOverrides(next);
    onLiveChange?.(sorted.map((it) => (next[it.id] ? { ...it, ...next[it.id] } : it)));
  }

  async function handleAdd() {
    try {
      await createItem({
        bloque: bloqueId,
        orden: sorted.length + 1,
        titulo: "",
        texto: "",
        imagen_url: "",
        items: [],
      }).unwrap();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: `No se pudo agregar ${label.toLowerCase()}.` });
    }
  }

  async function handleMove(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= sorted.length) return;
    const arr = [...sorted];
    [arr[idx], arr[j]] = [arr[j], arr[idx]];
    try {
      await reordenarItems({
        bloque: bloqueId,
        orden: arr.map((it, k) => ({ id: it.id, orden: k + 1 })),
      }).unwrap();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo reordenar." });
    }
  }

  return (
    <div className="space-y-3">
      {sorted.map((item, i) => (
        <LiveItemRow
          key={item.id}
          item={item}
          label={`${label} ${i + 1}`}
          onMove={(dir) => handleMove(i, dir)}
          canMoveUp={i > 0}
          canMoveDown={i < sorted.length - 1}
          onLiveChange={onLiveChange ? (patch) => handleRowLiveChange(item.id, patch) : undefined}
        />
      ))}
      <AddBtn label={`Agregar ${label.toLowerCase()}`} onClick={() => !adding && handleAdd()} />
    </div>
  );
}
