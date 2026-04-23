import { useState, useEffect } from "react";

export default function useMaterialStream(materialId: number | null) {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!materialId) return;

    let objectUrl: string | null = null;

    const fetchStream = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const api = `${process.env.NEXT_PUBLIC_UPLOAD_HOST}/api`;
        const res = await fetch(
          `${api}/control-escolar/materiales/${materialId}/stream/`,
          { credentials: "include" },
        );
        if (!res.ok) throw new Error("No se pudo cargar el video");
        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar video");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStream();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [materialId]);

  return { url, isLoading, error };
}
