"use client";

import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import Link from "next/link";
import { DynamicIcon } from "@/app/ui/icon/dynamic-icon";

export default function ModulosGrid() {
  const { data: user } = useRetrieveUserQuery();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
      {user?.modulos_accesibles?.map((m) => (
        <Link
          key={m.uuid}
          className={`rounded-xl p-6 shadow transition cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}
          style={{
            backgroundColor: m.bgColor,
          }}
          href={{ pathname: m.href, query: { ref: m.uuid } }}
        >
          <div className="relative p-6">
            <div className="mb-4 flex justify-center rounded-lg p-3">
              {/* <Image className="h-[200px] w-[200px]" height={600} width={600} src={m.icon} alt="imagenmulo"/> */}
              <DynamicIcon iconName={m.icon} size={100} />
            </div>
            <h3 className="mb-2 text-4xl font-bold text-black text-center">
              {m.nombre}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
