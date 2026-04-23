"use client";
import { useModuloProgramaQuery } from "@/redux/features/control-escolar/alumnosApiSlice";
import { ArrowRightCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ModuloMateriales from "./modulo-materiales";

interface Props {
  moduloId: number;
  uuid: string;
}

export default function ModuloView({ moduloId, uuid }: Props) {
  const { data: modulo } = useModuloProgramaQuery({
    id: uuid,
    moduloId: moduloId,
  });
  const pathname = usePathname();
  // console.log(pathname);

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <h2 className="font-bold text-gray-900 text-lg">
              {modulo?.nombre}
            </h2>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {modulo?.submodulos.map((item) => (
            <Link
              href={`${pathname}/submodulo/${item.id}`}
              key={item.id}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 group cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              <div className="flex-1 px-5 py-4 border-b border-gray-100 border-l-4 hover:border-l-[#0056D2] transition-all duration-300">
                <p className="text-sm text-gray-700">{item.titulo}.</p>
              </div>
              <div className="flex justify-end">
                <ArrowRightCircle />
              </div>
            </Link>
          ))}
        </div>
        <ModuloMateriales moduloId={moduloId} />
      </div>
    </div>
  );
}
