"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";
import Swal from "sweetalert2";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import {
  useGetBloquesByTemaQuery,
  useCreateBloqueMutation,
  useUpdateBloqueMutation,
  useDeleteBloqueMutation,
  useReordenarBloquesMutation,
  useCreateBloqueItemMutation,
} from "@/redux/features/capacitacion/capacitacionApiSlice";
import {
  ContenidoBloque,
  ContenidoBloqueItem,
  BloqueForm,
} from "@/redux/features/types/capacitacion/types";
import { TipoBloque } from "@/redux/features/types/catalagos/cat";
import { BloqueContenido } from "@/redux/features/types/capacitacion/plataforma-types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Cats, IconBtn, AddBtn } from "../shared-ui";
import { bloqueIcon, isItemsTipo, normalizeTipo, esEdicionEnLienzo } from "./bloque-utils";
import { BloqueFormFields } from "./bloque-form-fields";
import { LiveItemsEditor } from "./bloque-item-editors";
import { LienzoBloqueCard } from "./lienzo-bloque-card";

export function fileFieldFor(tipoCodigo: string): "video_archivo" | "imagen_archivo" {
  return ["texto-imagen", "texto-elemento-dinamico"].includes(normalizeTipo(tipoCodigo))
    ? "imagen_archivo"
    : "video_archivo";
}

// Adapta ContenidoBloque (editor) a BloqueContenido (plataforma, solo lectura)
// para reutilizar BloqueRenderer tal cual en la vista previa en vivo. Los
// campos relevantes son estructuralmente idénticos entre ambos tipos.
export function toBloqueContenido(b: ContenidoBloque): BloqueContenido {
  return {
    id: b.id,
    tema: b.tema,
    tipo_nombre: b.tipo_nombre,
    tipo_codigo: b.tipo_codigo,
    orden: b.orden,
    texto: b.texto ?? "",
    variante: b.variante ?? "",
    items: b.items,
    filas: b.filas,
    video_url: b.video_url,
    video_stream_url: null,
    imagen_url: b.imagen_url,
    imagen_archivo: b.imagen_archivo,
    embed_url: b.embed_url ?? "",
    bloque_items: b.bloque_items,
  };
}

// Combina el bloque guardado con lo que el instructor está editando ahora
// mismo (form, aún sin guardar; liveItems, ítems en edición vía
// LiveItemsEditor) para alimentar BloqueRenderer en vivo. Función pura, sin
// llamadas de red — reusa el mismo mapeo campo a campo que toBloqueContenido.
// `form` solo trae un campo cuando el instructor lo tocó o inicializó, así
// que su valor gana sobre `bloque` cuando está definido (incluida una
// cadena/array vacíos, que son ediciones válidas, no "sin tocar").
export function buildPreviewBloque(
  bloque: ContenidoBloque,
  form: Partial<BloqueForm>,
  liveItems: ContenidoBloqueItem[] | null,
): BloqueContenido {
  const base = toBloqueContenido(bloque);
  return {
    ...base,
    texto: form.texto !== undefined ? (form.texto ?? "") : base.texto,
    variante: form.variante !== undefined ? (form.variante ?? "") : base.variante,
    items: form.items !== undefined ? form.items : base.items,
    filas: form.filas !== undefined ? form.filas : base.filas,
    video_url: form.video_url !== undefined ? form.video_url : base.video_url,
    imagen_url: form.imagen_url !== undefined ? form.imagen_url : base.imagen_url,
    embed_url: form.embed_url !== undefined ? (form.embed_url ?? "") : base.embed_url,
    // Un cambio explícito de imagen_url (incluida una cadena vacía, "quitar
    // imagen") reemplaza al archivo subido anteriormente — si no se anula
    // aquí, BloqueRenderer cae de vuelta a imagen_archivo (su fallback para
    // mostrar imágenes subidas por archivo) y "quitar imagen" parecería no
    // hacer nada en el lienzo.
    imagen_archivo: form.imagen_url !== undefined ? null : base.imagen_archivo,
    bloque_items: liveItems !== null ? liveItems : base.bloque_items,
  };
}

// ── Biblioteca de bloques ───────────────────────────────────────

function LibraryPanel({
  cats,
  onAdd,
  adding,
}: {
  cats: Cats;
  onAdd: (t: TipoBloque) => void;
  adding: boolean;
}) {
  return (
    <div className="p-2 space-y-1">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-1 pb-1">
        Agregar bloque
      </p>
      {cats.tiposBloque.map((t) => {
        const BIcon = bloqueIcon(t.codigo);
        return (
          <button
            key={t.id}
            type="button"
            disabled={adding}
            onClick={() => onAdd(t)}
            className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-left rounded-lg border border-gray-200 bg-white hover:border-[#0056D2] hover:bg-[#F0F6FF] transition-colors disabled:opacity-50"
          >
            <BIcon className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            <span className="text-gray-700">{t.nombre}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Panel de propiedades (edición contextual) ──────────────────

function PropertiesPanel({
  bloque,
  onSaved,
  onDeleted,
  onClose,
}: {
  bloque: ContenidoBloque;
  onSaved: () => void;
  onDeleted: () => void;
  onClose: () => void;
}) {
  const [updateBloque, { isLoading: saving }] = useUpdateBloqueMutation();
  const [deleteBloque] = useDeleteBloqueMutation();
  const [form, setForm] = useState<Partial<BloqueForm>>({
    texto: bloque.texto ?? "",
    variante: bloque.variante ?? "",
    items: bloque.items ?? [],
    filas: bloque.filas ?? [],
    video_url: bloque.video_url ?? "",
    imagen_url: bloque.imagen_url ?? "",
  });
  const [file, setFile] = useState<File | null>(null);
  const tipoCodigo = normalizeTipo(bloque.tipo_codigo) || "texto";

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

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-700">Propiedades del bloque</p>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 lg:hidden">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <BloqueFormFields
          tipoCodigo={tipoCodigo}
          form={form}
          setForm={setForm}
          onFileChange={setFile}
        />
        {isItemsTipo(tipoCodigo) && (
          <div className="pt-2 border-t border-gray-100">
            <LiveItemsEditor
              tipoCodigo={tipoCodigo}
              bloqueId={bloque.id}
              items={bloque.bloque_items ?? []}
            />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-t border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-1.5 text-xs font-medium text-white bg-[#1c2634] rounded-lg disabled:opacity-50"
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded-lg"
          >
            Cerrar
          </button>
        </div>
        <IconBtn onClick={handleDelete} danger title="Eliminar bloque">
          <Trash2 className="w-3.5 h-3.5" />
        </IconBtn>
      </div>
    </div>
  );
}

// ── Orquestador ─────────────────────────────────────────────────

export function BloquesSection({ temaId, cats }: { temaId: number; cats: Cats }) {
  const { data } = useGetBloquesByTemaQuery(temaId);
  const [createBloque, { isLoading: adding }] = useCreateBloqueMutation();
  const [createBloqueItem] = useCreateBloqueItemMutation();
  const [reordenarBloques] = useReordenarBloquesMutation();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [librarySheetOpen, setLibrarySheetOpen] = useState(false);
  const [propertiesSheetOpen, setPropertiesSheetOpen] = useState(false);

  const bloques = [...(data ?? [])].sort((a, b) => a.orden - b.orden);
  const selected = bloques.find((b) => b.id === selectedId) ?? null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = bloques.findIndex((b) => b.id === active.id);
    const newIndex = bloques.findIndex((b) => b.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const arr = arrayMove(bloques, oldIndex, newIndex);
    try {
      await reordenarBloques({
        tema: temaId,
        orden: arr.map((b, k) => ({ id: b.id, orden: k + 1 })),
      }).unwrap();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo reordenar." });
    }
  }

  // Clic en la biblioteca: crea un bloque "en blanco" de ese tipo al final del
  // canvas y lo selecciona de inmediato. Para los tipos cubiertos por
  // lienzo-wysiwyg, eso basta — aparece ya expandido y editable en el propio
  // lienzo. Para los tipos fuera de alcance (tarjetas/paneles/presentaciones),
  // sigue abriendo el Sheet de propiedades, igual que antes de esta spec.
  async function handleAddFromLibrary(t: TipoBloque) {
    try {
      const created = await createBloque({
        tema: temaId,
        tipo: t.id,
        orden: bloques.length + 1,
        texto: "",
      }).unwrap();
      setSelectedId(created.id);
      setLibrarySheetOpen(false);
      if (!esEdicionEnLienzo(t.codigo)) {
        setPropertiesSheetOpen(true);
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear el bloque." });
    }
  }

  async function handleDuplicate(b: ContenidoBloque) {
    try {
      const created = await createBloque({
        tema: temaId,
        tipo: b.tipo,
        orden: bloques.length + 1,
        texto: b.texto,
        variante: b.variante,
        items: b.items,
        filas: b.filas,
        video_url: b.video_url,
        imagen_url: b.imagen_url,
        embed_url: b.embed_url,
      } as BloqueForm).unwrap();

      const items = b.bloque_items ?? [];
      let failures = 0;
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        try {
          await createBloqueItem({
            bloque: created.id,
            orden: i + 1,
            titulo: it.titulo,
            texto: it.texto,
            imagen_url: it.imagen_url,
            items: it.items,
          }).unwrap();
        } catch {
          failures++;
        }
      }
      if (failures > 0) {
        Swal.fire({
          icon: "warning",
          title: "Bloque duplicado con advertencias",
          text: `${failures} elemento(s) no se pudieron copiar.`,
        });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo duplicar el bloque." });
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Bloques de contenido
      </p>

      <div className="flex flex-col lg:flex-row gap-3 items-start">
        {/* Biblioteca — fija en pantallas anchas, hoja en móvil */}
        <div className="hidden lg:block lg:w-48 flex-shrink-0 border border-gray-200 rounded-lg bg-gray-50/40">
          <LibraryPanel cats={cats} onAdd={handleAddFromLibrary} adding={adding} />
        </div>
        <div className="lg:hidden">
          <AddBtn label="Agregar bloque" onClick={() => setLibrarySheetOpen(true)} />
        </div>
        <Sheet open={librarySheetOpen} onOpenChange={setLibrarySheetOpen}>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Agregar bloque</SheetTitle>
            </SheetHeader>
            <LibraryPanel cats={cats} onAdd={handleAddFromLibrary} adding={adding} />
          </SheetContent>
        </Sheet>

        {/* Canvas */}
        <div className="flex-1 min-w-0 w-full space-y-1.5">
          {bloques.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center border border-dashed border-gray-200 rounded-lg">
              Agrega el primer bloque desde la biblioteca.
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={bloques.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                {bloques.map((b) => (
                  <LienzoBloqueCard
                    key={b.id}
                    bloque={b}
                    selected={b.id === selectedId}
                    onSelect={() => {
                      if (esEdicionEnLienzo(b.tipo_codigo)) {
                        setSelectedId((id) => (id === b.id ? null : b.id));
                      } else {
                        setSelectedId(b.id);
                        setPropertiesSheetOpen(true);
                      }
                    }}
                    onSaved={() => {}}
                    onDeleted={() => setSelectedId((id) => (id === b.id ? null : id))}
                    onDuplicate={() => handleDuplicate(b)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Propiedades — solo para tipos fuera de alcance de lienzo-wysiwyg
            (tarjetas/paneles/presentaciones); los demás se editan inline en
            el propio lienzo, sin Sheet. */}
        <Sheet
          open={propertiesSheetOpen && !!selected && !esEdicionEnLienzo(selected.tipo_codigo)}
          onOpenChange={(open) => {
            setPropertiesSheetOpen(open);
            if (!open) setSelectedId(null);
          }}
        >
          <SheetContent side="right" className="p-0 sm:max-w-sm lg:max-w-3xl">
            {selected && !esEdicionEnLienzo(selected.tipo_codigo) && (
              <PropertiesPanel
                key={selected.id}
                bloque={selected}
                onSaved={() => {}}
                onDeleted={() => {
                  setSelectedId(null);
                  setPropertiesSheetOpen(false);
                }}
                onClose={() => setPropertiesSheetOpen(false)}
              />
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
