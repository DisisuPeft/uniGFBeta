import KanbanBoard from "@/app/components/crm/kanban/kanban-board";
import ButtonLink from "@/app/components/control-escolar/link-button";

export default function Page() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tablero CRM</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestiona tus leads por etapa del pipeline
          </p>
        </div>
        <ButtonLink path="/dashboard/crm/nuevo-lead" title="+ Nuevo Lead" />
      </div>

      <KanbanBoard />
    </div>
  );
}