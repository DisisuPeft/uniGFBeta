import { MiInscripcion } from "@/redux/features/types/capacitacion/plataforma-types";

// Un único set de marcadores genéricos — mismo criterio en todas las vistas
// que muestran una tarjeta de curso, para que el mismo curso.id resuelva
// siempre al mismo marcador, sin importar desde qué vista se renderice.
const PLACEHOLDER_IMAGES = [
  "/assets/hero-image.jpg",
  "/assets/place2.jpg",
  "/assets/plataforma-img.png",
  "/assets/vista-cursos.jpg",
  "/assets/hero/thales-hero.webp",
];

export function resolveCursoImagen(curso: { imagen: string | null; id: number }): string {
  if (curso.imagen) return curso.imagen;
  return PLACEHOLDER_IMAGES[curso.id % PLACEHOLDER_IMAGES.length];
}

// La lista cruda de /capacitacion/mis-inscripciones/ trae una fila por
// inscripción, sin deduplicar. Cuando una vista necesita "la" inscripción de
// un curso directamente desde esa lista, debe elegir la más reciente —
// criterio confirmado por backend: inscrito_at descendente, id como
// desempate (02-DOCS/wiki/backend-contracts.md, "Inscripción recency").
export function resolveInscripcionActual(
  inscripciones: MiInscripcion[],
  cursoId: number,
): MiInscripcion | undefined {
  return inscripciones
    .filter((i) => i.curso === cursoId)
    .sort((a, b) => {
      if (a.inscrito_at !== b.inscrito_at) {
        return a.inscrito_at < b.inscrito_at ? 1 : -1;
      }
      return b.id - a.id;
    })[0];
}
