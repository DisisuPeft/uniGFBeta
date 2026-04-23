"use client";

import { useMaterialStream } from "@/hooks";
import { AlertCircle, Loader2, VideoOff } from "lucide-react";
import { Material } from "@/redux/features/types/control-escolar/type";

interface Props {
  material?: Material;
}

export default function GrabacionClaseView({ material }: Props) {
  const { url, isLoading, error } = useMaterialStream(0);
  const isProd = true;
  console.log(material);
  if (isProd)
    return (
      <div className="flex flex-col justify-center items-center gap-2 min-h-[50vh] text-center text-gray-400">
        <VideoOff className="w-8 h-8" />
        <p className="text-xl font-medium text-gray-700">Próximamente</p>
        <p className="text-sl text-gray-400">
          Las clases grabadas estarán disponibles en breve.
        </p>
      </div>
    );
  return (
    <div className="space-y-3">
      <div className="aspect-video w-full bg-gray-950 rounded-xl overflow-hidden flex items-center justify-center relative">
        {isLoading && (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm">Cargando video...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <VideoOff className="w-8 h-8" />
            <div className="flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
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

      {/* <div className="px-1">
        <p className="text-sm font-medium text-gray-900">
          {material.original_name}
        </p>
        {material.description && (
          <p className="text-xs text-gray-500 mt-0.5">{material.description}</p>
        )}
      </div> */}
    </div>
  );
}
