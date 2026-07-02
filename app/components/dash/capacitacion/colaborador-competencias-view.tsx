"use client";

import { useState } from "react";
import { Users, Search, Edit2, Check, X, Loader2, Zap } from "lucide-react";
import Swal from "sweetalert2";
import {
  useGetCompetenciasColaboradorQuery,
  useUpdateCompetenciaColaboradorMutation,
} from "@/redux/features/competencias/competenciasApiSlice";
import { useGetUsersQuery } from "@/redux/features/auth/userApiSlice";
import { useGetNivelesCompetenciaQuery } from "@/redux/features/catalogos/genericosApiSlice";
import { CompetenciaColaborador } from "@/redux/features/types/competencias/types";
import { User } from "@/redux/features/auth/userApiSlice";
// import { DynamicIcon } from "@/app/ui/icon/dynamic-icon";

// ── Selector de colaborador ───────────────────────────────────

function ColaboradorSelector({ onSelect }: { onSelect: (user: User) => void }) {
  const [search, setSearch] = useState("");
  const { data, isFetching } = useGetUsersQuery({ q: search, page: 1 });
  const usuarios = data?.results ?? [];

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar colaborador…"
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2]/20 bg-white"
        />
      </div>

      {isFetching ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        </div>
      ) : usuarios.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Sin resultados</p>
      ) : (
        <ul className="space-y-1 max-h-96 overflow-y-auto">
          {usuarios.map((u) => (
            <li key={u.uuid}>
              <button
                onClick={() => onSelect(u)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-[#1c2634] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                  {u.nombre[0]}
                  {u.apellido_paterno[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {u.nombre} {u.apellido_paterno} {u.apellido_materno}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Fila editable de competencia ──────────────────────────────

function CompetenciaRow({ item }: { item: CompetenciaColaborador }) {
  const { data: niveles } = useGetNivelesCompetenciaQuery();
  const [update, { isLoading: saving }] =
    useUpdateCompetenciaColaboradorMutation();
  const [editing, setEditing] = useState(false);
  const [nivelId, setNivelId] = useState<number>(item.nivel);

  const listaNiveles = niveles?.results ?? [];

  async function handleSave() {
    try {
      await update({ id: item.id, body: { nivel: nivelId } }).unwrap();
      setEditing(false);
      Swal.fire({
        icon: "success",
        title: "Nivel actualizado",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar.",
      });
    }
  }

  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50/40">
      <td className="px-5 py-3">
        <p className="text-sm font-medium text-gray-800">
          {item.competencia_nombre}
        </p>
      </td>
      <td className="px-5 py-3">
        {editing ? (
          <select
            value={nivelId}
            onChange={(e) => setNivelId(Number(e.target.value))}
            className="px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056D2] bg-white"
          >
            {listaNiveles.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nombre}
              </option>
            ))}
          </select>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F0F6FF] text-[#0056D2]">
            {item.nivel_nombre}
          </span>
        )}
      </td>
      <td className="px-5 py-3 text-xs text-gray-400">
        {new Date(item.actualizado_at).toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center justify-end gap-1">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="p-1.5 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setNivelId(item.nivel);
                }}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ── Panel de competencias de un colaborador ───────────────────

function CompetenciasPanel({ user }: { user: User }) {
  console.log(user.num_colab);
  const { data, isLoading } = useGetCompetenciasColaboradorQuery(
    user.num_colab,
  );
  const lista = data?.results ?? [];

  return (
    <div className="space-y-4">
      {/* Sub-header */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="w-9 h-9 rounded-full bg-[#1c2634] text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">
          {user.nombre[0]}
          {user.apellido_paterno[0]}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {user.nombre} {user.apellido_paterno} {user.apellido_materno}
          </p>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        </div>
      ) : lista.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
            <Zap className="w-5 h-5 text-gray-300" />
          </div>
          <p className="text-sm text-gray-500">
            Este colaborador no tiene competencias registradas aún.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                  Competencia
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                  Nivel actual
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                  Actualizado
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {lista.map((item) => (
                <CompetenciaRow key={item.id} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Vista principal ───────────────────────────────────────────

export default function ColaboradorCompetenciasView() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Niveles por colaborador
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Edita manualmente el nivel de competencia de cada colaborador
          </p>
        </div>
        {selectedUser && (
          <button
            onClick={() => setSelectedUser(null)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Users className="w-4 h-4" />
            Cambiar colaborador
          </button>
        )}
      </div>

      {selectedUser ? (
        <CompetenciasPanel user={selectedUser} />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-700 mb-4">
            Selecciona un colaborador
          </p>
          <ColaboradorSelector onSelect={setSelectedUser} />
        </div>
      )}
    </div>
  );
}
