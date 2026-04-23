"use client";

import { useGetMaterialesProgramaQuery } from "@/redux/features/control-escolar/alumnosApiSlice";
import { useMaterialStream } from "@/hooks";
import { Material } from "@/redux/features/types/control-escolar/type";
import {
  FileText,
  File,
  Camera,
  Loader2,
  PlayCircle,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

interface Props {
  programaId: string;
}

const UPLOAD_HOST = process.env.NEXT_PUBLIC_UPLOAD_HOST;

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function iconoMaterial(mimeType: string) {
  if (mimeType.startsWith("video/"))
    return <PlayCircle className="w-5 h-5 text-[#0056D2]" />;
  if (mimeType.startsWith("image/"))
    return <Camera className="w-5 h-5 text-[#0056D2]" />;
  if (mimeType === "application/pdf")
    return <FileText className="w-5 h-5 text-[#0056D2]" />;
  return <File className="w-5 h-5 text-[#0056D2]" />;
}

function VideoPlayer({ materialId }: { materialId: number }) {
  const { url, isLoading, error } = useMaterialStream(materialId);
  return (
    <div className="mt-3 aspect-video w-full bg-gray-950 rounded-lg overflow-hidden flex items-center justify-center">
      {isLoading && <Loader2 className="w-6 h-6 animate-spin text-gray-400" />}
      {error && (
        <div className="flex items-center gap-2 text-xs text-red-400">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
      {url && (
        <video
          src={url}
          controls
          className="w-full h-full object-contain"
          controlsList="nodownload"
        />
      )}
    </div>
  );
}

function MaterialRow({ material }: { material: Material }) {
  const esVideo = material.mime_type.startsWith("video/");
  const [abierto, setAbierto] = useState(false);

  if (esVideo) {
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setAbierto((v) => !v)}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 bg-[#F0F6FF] rounded-lg flex items-center justify-center flex-shrink-0">
            {iconoMaterial(material.mime_type)}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm text-gray-800 truncate">{material.original_name}</p>
            {material.description && (
              <p className="text-xs text-gray-400 truncate">{material.description}</p>
            )}
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0 mr-2">
            {formatBytes(material.size)}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${abierto ? "rotate-180" : ""}`}
          />
        </button>
        {abierto && (
          <div className="px-4 pb-4">
            <VideoPlayer materialId={material.id!} />
          </div>
        )}
      </div>
    );
  }

  return (
    <a
      href={`${UPLOAD_HOST}/api/control-escolar/materiales/${material.id}/preview/`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
    >
      <div className="w-8 h-8 bg-[#F0F6FF] rounded-lg flex items-center justify-center flex-shrink-0">
        {iconoMaterial(material.mime_type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 truncate">{material.original_name}</p>
        {material.description && (
          <p className="text-xs text-gray-400 truncate">{material.description}</p>
        )}
      </div>
      <span className="text-xs text-gray-400 flex-shrink-0">
        {formatBytes(material.size)}
      </span>
    </a>
  );
}

export default function ArchivosProgramaView({ programaId }: Props) {
  const { data: materiales, isLoading } = useGetMaterialesProgramaQuery(programaId);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Archivos del programa</h1>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      )}

      {!isLoading && !materiales?.results?.length && (
        <p className="text-sm text-gray-500 text-center py-10">
          No hay archivos disponibles para este programa.
        </p>
      )}

      {materiales?.results?.map((material) => (
        <MaterialRow key={material.id} material={material} />
      ))}
    </div>
  );
}
