import clsx from "clsx";

export type ToolLoanRow = {
  id: string;
  toolName: string;
  category: string;
  serialNumber?: string;
  technicianName: string;
  team: string;
  loanedAt: string;
  dueDate?: string;
  status: "EN_COURS" | "RETARD" | "DISPONIBLE";
  notes?: string;
};

type Props = {
  rows: ToolLoanRow[];
  onAssign: (loanId: string) => void;
  onReturn: (loanId: string) => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  title?: string;
  emptyMessage?: string;
};

function formatDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

const statusLabels: Record<
  ToolLoanRow["status"],
  { label: string; tone: string }
> = {
  EN_COURS: { label: "En cours", tone: "" },
  RETARD: { label: "En retard", tone: "pill-warning" },
  DISPONIBLE: { label: "Disponible", tone: "pill-success" }
};

export default function ToolLoansTable({
  rows,
  onAssign,
  onReturn,
  searchQuery = "",
  onSearchChange,
  title = "Outillage prêté",
  emptyMessage = "Aucun équipement"
}: Props) {
  return (
    <section
      className="card"
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h2>{title}</h2>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            Suivi des équipements critiques prêtés aux techniciens.
          </p>
        </div>
        {onSearchChange && (
          <input
            className="input"
            placeholder="Rechercher par outil ou technicien"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            style={{ width: "280px" }}
          />
        )}
      </header>

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Équipement</th>
              <th>Catégorie</th>
              <th>Numéro de série</th>
              <th>Technicien</th>
              <th>Prêté le</th>
              <th>Retour prévu</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", color: "var(--muted)" }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((loan) => {
                const status = statusLabels[loan.status];
                return (
                  <tr key={loan.id}>
                    <td>
                      <strong>{loan.toolName}</strong>
                    </td>
                    <td>{loan.category}</td>
                    <td>{loan.serialNumber ?? "—"}</td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <strong>{loan.technicianName}</strong>
                        <small style={{ color: "var(--muted)" }}>{loan.team}</small>
                      </div>
                    </td>
                    <td>{formatDate(loan.loanedAt)}</td>
                    <td>{formatDate(loan.dueDate)}</td>
                    <td>
                      <span className={clsx("pill", status.tone)}>
                        {status.label}
                      </span>
                    </td>
                    <td style={{ maxWidth: "220px" }}>
                      <small style={{ color: "var(--muted)", display: "block" }}>
                        {loan.notes ?? "—"}
                      </small>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <button
                          className="btn btn-primary"
                          onClick={() => onAssign(loan.id)}
                        >
                          {loan.status === "DISPONIBLE" ? "Prêter" : "Réaffecter"}
                        </button>
                        <button
                          className="btn btn-outline"
                          onClick={() => onReturn(loan.id)}
                          disabled={loan.status === "DISPONIBLE"}
                        >
                          Marquer rendu
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

