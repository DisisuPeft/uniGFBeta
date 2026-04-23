"use client";

import { useCallback, useEffect, useState } from "react";
import { EVALUACIONES_MOCK } from "./types";

export interface EvalResult {
  correctas: number;
  total: number;
}

export type ProgressKey = `modulo_${number}`;
export type CursoProgress = Partial<Record<ProgressKey, EvalResult>>;

export const ALL_PROGRESS_KEYS: ProgressKey[] = Object.keys(EVALUACIONES_MOCK).map(
  (id) => `modulo_${id}` as ProgressKey
);

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

  const totalCorrectas = ALL_PROGRESS_KEYS.reduce(
    (sum, k) => sum + (progress[k]?.correctas ?? 0),
    0
  );
  const totalPreguntas = ALL_PROGRESS_KEYS.reduce(
    (sum, k) => sum + (progress[k]?.total ?? 0),
    0
  );
  const overallScore = totalPreguntas > 0
    ? Math.round((totalCorrectas / totalPreguntas) * 100)
    : 0;

  const eachPassed = ALL_PROGRESS_KEYS.every((k) => {
    const r = progress[k];
    if (!r) return false;
    return Math.round((r.correctas / r.total) * 100) >= 70;
  });

  const coursePassed = allCompleted && eachPassed && overallScore >= 70;

  return { progress, saveResult, getScore, allCompleted, overallScore, coursePassed };
}
