import { useState, useCallback } from "react";

interface UploadOptions {
  modulo?: number;
  programa?: string;
  submodulo?: number;
  descripcion?: string;
}

interface UploadState {
  progress: number;
  isUploading: boolean;
  error: string | null;
  isSuccess: boolean;
}

export default function useMaterialUpload() {
  const [state, setState] = useState<UploadState>({
    progress: 0,
    isUploading: false,
    error: null,
    isSuccess: false,
  });

  const upload = useCallback(
    (file: File, options: UploadOptions = {}): Promise<void> => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);
        if (options.modulo) formData.append("modulo", String(options.modulo));
        if (options.programa)
          formData.append("programa", String(options.programa));
        if (options.submodulo)
          formData.append("submodulo", String(options.submodulo));
        if (options.descripcion)
          formData.append("descripcion", options.descripcion);

        const xhr = new XMLHttpRequest();

        // Progreso real
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setState((prev) => ({ ...prev, progress }));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setState({
              progress: 100,
              isUploading: false,
              error: null,
              isSuccess: true,
            });
            resolve();
          } else {
            const msg =
              JSON.parse(xhr.responseText)?.detail ||
              "Error al subir el archivo";
            setState((prev) => ({ ...prev, isUploading: false, error: msg }));
            reject(new Error(msg));
          }
        });

        xhr.addEventListener("error", () => {
          const msg = "Error de red al subir el archivo";
          setState((prev) => ({ ...prev, isUploading: false, error: msg }));
          reject(new Error(msg));
        });

        // RTK Query usa cookies para auth — las incluimos\
        const api = `${process.env.NEXT_PUBLIC_UPLOAD_HOST}/api`;
        xhr.withCredentials = true;
        xhr.open("POST", `${api}/control-escolar/materiales/`);
        xhr.send(formData);

        setState({
          progress: 0,
          isUploading: true,
          error: null,
          isSuccess: false,
        });
      });
    },
    [],
  );

  const reset = useCallback(() => {
    setState({
      progress: 0,
      isUploading: false,
      error: null,
      isSuccess: false,
    });
  }, []);

  return { ...state, upload, reset };
}
