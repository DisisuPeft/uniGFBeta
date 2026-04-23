"use client";

import {
  useGetMaterialesProgramaQuery,
  useProgramaEstudianteQuery,
} from "@/redux/features/control-escolar/alumnosApiSlice";
import { useMaterialStream } from "@/hooks";
import { Loader2, AlertCircle, PlayCircle } from "lucide-react";
import Link from "next/link";

interface Props {
  programaId: string;
  slug: string;
}

function VideoStream({ materialId }: { materialId: number }) {
  const { url, isLoading, error } = useMaterialStream(materialId);

  return (
    <div className="aspect-video w-full bg-gray-950 rounded-xl overflow-hidden flex items-center justify-center">
      {isLoading && (
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm">Cargando video...</p>
        </div>
      )}
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
          autoPlay
          className="w-full h-full object-contain"
          controlsList="nodownload"
        />
      )}
    </div>
  );
}

export default function BienvenidaView({ programaId, slug }: Props) {
  const { data: programa } = useProgramaEstudianteQuery(programaId);
  const { data: materiales } = useGetMaterialesProgramaQuery(programaId);

  const videoMaterial = materiales?.results?.find((m) =>
    m.mime_type.startsWith("video/"),
  );

  const primerModuloId = programa?.modulos_obj?.[0]?.id;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
      <div>
        <p className="text-xs font-semibold text-[#0056D2] uppercase tracking-wide">
          Bienvenida
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          {programa?.nombre}
        </h1>
        {programa?.descripcion && (
          <p className="text-sm text-gray-500 mt-1">{programa.descripcion}</p>
        )}
      </div>

      {videoMaterial ? (
        <VideoStream materialId={videoMaterial.id!} />
      ) : (
        <div className="aspect-video w-full bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400">
          <PlayCircle className="w-10 h-10" />
          <p className="text-sm">Video de presentación no disponible</p>
        </div>
      )}

      {videoMaterial?.description && (
        <p className="text-sm text-gray-600">{videoMaterial.description}</p>
      )}

      {primerModuloId && (
        <div className="flex justify-end">
          <Link
            href={`/plataforma/${slug}/${programaId}/modulo/${primerModuloId}`}
            className="px-6 py-2.5 bg-[#0056D2] text-white text-sm font-medium rounded-lg hover:bg-[#004BB5] transition-colors"
          >
            Comenzar →
          </Link>
        </div>
      )}
    </div>
  );
}
