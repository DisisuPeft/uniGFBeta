"use client";

import { useCallback, useState, useRef, ChangeEvent } from "react";
import { useMaterialUpload } from "@/hooks";
import {
  Upload,
  File,
  // FileVideo,
  FileText,
  Camera,
  FileX,
  Check,
  AlertCircle,
} from "lucide-react";
// import { ModulosInterface } from "@/redux/features/types/alumnos/inscription";
import Select from "@/app/ui/components/select";
import { ModuloEducativoForm } from "@/redux/features/types/control-escolar/type";

const MAX_SIZE_MB = 500;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const TIPOS_ACEPTADOS = [
  "video/*",
  "application/pdf",
  "image/*",
  "audio/*",
  ".doc,.docx,.ppt,.pptx,.xls,.xlsx",
];

function iconoArchivo(file: File) {
  if (file.type.startsWith("video/"))
    return <File className="w-8 h-8 text-[#0056D2]" />;
  if (file.type.startsWith("image/"))
    return <Camera className="w-8 h-8 text-[#0056D2]" />;
  if (file.type === "application/pdf")
    return <FileText className="w-8 h-8 text-[#0056D2]" />;
  return <File className="w-8 h-8 text-[#0056D2]" />;
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Props {
  programaId?: string;
  modulos: ModuloEducativoForm[];
  onSuccess?: () => void;
}

export default function MaterialUpload({
  programaId,
  modulos,
  onSuccess,
}: Props) {
  const { progress, isUploading, error, isSuccess, upload, reset } =
    useMaterialUpload();
  const [file, setFile] = useState<File | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [moduloId, setModuloId] = useState<number>();
  const [submoduloId, setSubmoduloId] = useState<number>();

  const validarArchivo = (f: File): string | null => {
    if (f.size > MAX_SIZE_BYTES)
      return `El archivo supera el límite de ${MAX_SIZE_MB}MB`;
    return null;
  };

  const handleFile = useCallback(
    (f: File) => {
      const err = validarArchivo(f);
      if (err) {
        setLocalError(err);
        return;
      }
      setLocalError(null);
      reset();
      setFile(f);
    },
    [reset],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file) return;
    await upload(file, {
      modulo: moduloId,
      programa: programaId,
      submodulo: submoduloId,
      descripcion,
    });
    onSuccess?.();
    setTimeout(() => {
      reset();
    }, 2000);
  };

  const handleRemove = () => {
    setFile(null);
    reset();
    setLocalError(null);
    if (inputRef.current) inputRef.current.value = "";
  };
  console.log(isUploading);

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      {!file && (
        <div
          onDrop={onDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
            dragOver
              ? "border-[#0056D2] bg-[#F0F6FF]"
              : "border-gray-200 hover:border-[#0056D2] hover:bg-[#F0F6FF]"
          }`}
        >
          <div className="w-12 h-12 bg-[#F0F6FF] rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-[#0056D2]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-800">
              Arrastra tu archivo aquí
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              o haz clic para seleccionar · Máx. {MAX_SIZE_MB}MB
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Video, PDF, imágenes, documentos
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={TIPOS_ACEPTADOS.join(",")}
            className="hidden"
            onChange={onInputChange}
          />
        </div>
      )}

      {/* Preview del archivo seleccionado */}
      {file && !isSuccess && (
        <div className="border border-gray-200 rounded-xl p-4 flex-col items-center gap-3">
          {iconoArchivo(file)}
          <div className="min-w-0">
            <div className="flex flex-row justify-between mt-2">
              <p className="text-sm font-medium text-gray-800 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
              {!isUploading && (
                <button
                  onClick={handleRemove}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <FileX className="w-4 h-4 text-black font-bold" />
                </button>
              )}
            </div>

            {/* Barra de progreso */}
            {isUploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-[#0056D2] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-[#0056D2] mt-1">{progress}%</p>
              </div>
            )}
          </div>
          <div className="flex-col justify-end mt-2">
            <div>
              <Select
                options={modulos ?? []}
                label="Elegir modulo"
                valueKey="id"
                labelKey="nombre"
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setModuloId(parseInt(e.target.value))
                }
              />
            </div>

            <div>
              <Select
                options={
                  modulos.find((m) => m.id === moduloId)?.submodulos ?? []
                }
                label="Elegir submodulo"
                valueKey="id"
                labelKey="titulo"
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setSubmoduloId(parseInt(e.target.value))
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Descripción */}
      {file && !isSuccess && (
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">
            Descripción{" "}
            <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={2}
            placeholder="Ej. Material de la semana 3..."
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-[#0056D2] text-gray-800 placeholder:text-gray-400"
          />
        </div>
      )}

      {/* Errores */}
      {(localError || error) && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {localError || error}
        </div>
      )}

      {/* Éxito */}
      {isSuccess && (
        <div className="flex items-center gap-2 text-xs text-[#1B7A42] bg-[#F0F8F4] border border-[#A8D5B8] rounded-lg px-3 py-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          Archivo subido correctamente
        </div>
      )}

      {/* Botón */}
      {file && !isSuccess && (
        <button
          onClick={handleSubmit}
          disabled={isUploading}
          className="w-full bg-[#0056D2] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#004BB5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? `Subiendo... ${progress}%` : "Subir archivo"}
        </button>
      )}
    </div>
  );
}
