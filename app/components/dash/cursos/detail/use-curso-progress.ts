"use client";

import { useCallback, useEffect, useState } from "react";
import { EVALUACIONES_MOCK } from "./types";

export interface EvalResult {
  correctas: number;
  total: number;
}

export type ProgressKey = `modulo_${number}` | "final";
export type CursoProgress = Partial<Record<ProgressKey, EvalResult>>;

export const MODULO_EVAL_KEYS: ProgressKey[] = Object.keys(EVALUACIONES_MOCK).map(
  (id) => `modulo_${id}` as ProgressKey
);
export const ALL_PROGRESS_KEYS: ProgressKey[] = [...MODULO_EVAL_KEYS, "final"];

const storageKey = (cursoId: number) => `cursoProgress_${cursoId}`;
const PROGRESS_EVENT = "cursoProgressUpdate";

export function useCursoProgress(cursoId: number) {
  const [progress, setProgress] = useState<CursoProgress>({});

  useEffect(() => {
    const load = () => {
      const s = localStorage.getItem(storageKey(cursoId));
      setProgress(s ? JSON.parse(s) : {});
    };
    load();
    window.addEventListener(PROGRESS_EVENT, load);
    return () => window.removeEventListener(PROGRESS_EVENT, load);
  }, [cursoId]);

  const saveResult = useCallback(
    (key: ProgressKey, correctas: number, total: number) => {
      const current: CursoProgress = JSON.parse(
        localStorage.getItem(storageKey(cursoId)) ?? "{}"
      );
      const updated: CursoProgress = { ...current, [key]: { correctas, total } };
      localStorage.setItem(storageKey(cursoId), JSON.stringify(updated));
      setProgress(updated);
      window.dispatchEvent(new Event(PROGRESS_EVENT));
    },
    [cursoId]
  );

  const getScore = (key: ProgressKey): number | null => {
    const r = progress[key];
    if (!r) return null;
    return Math.round((r.correctas / r.total) * 100);
  };

  const allCompleted = ALL_PROGRESS_KEYS.every((k) => progress[k] !== undefined);

  const finalResult = progress["final"];
  const finalScore = finalResult
    ? Math.round((finalResult.correctas / finalResult.total) * 100)
    : null;

  return { progress, saveResult, getScore, allCompleted, finalScore };
}
