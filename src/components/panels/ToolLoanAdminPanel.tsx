import { useEffect, useMemo, useState } from "react";
import type { Technician, ToolLoan, ToolLoanPayload } from "@/lib/types";

type Props = {
  technicians: Technician[];
  loans: ToolLoan[];
  editingId: string | null;
  onSelectLoan: (loanId: string | null) => void;
  onCreate: (payload: ToolLoanPayload) => void;
  onUpdate: (loanId: string, payload: ToolLoanPayload) => void;
  onDelete: (loanId: string) => void;
};

const emptyForm: ToolLoanPayload = {
  toolName: "",
  category: "",
  serialNumber: "",
  technicianId: null,
  loanedAt: new Date().toISOString(),
  dueDate: undefined,
  status: "DISPONIBLE",
  notes: ""
};

function formatInputDate(value: string) {
  return value ? value.slice(0, 16) : "";
}

function parseDate(value: string) {
  return value ? new Date(value).toISOString() : undefined;
}

export default function ToolLoanAdminPanel({
  technicians,
  loans,
  editingId,
  onSelectLoan,
  onCreate,
  onUpdate,
  onDelete
}: Props) {
  const [form, setForm] = useState<ToolLoanPayload>(emptyForm);

  const isEditing = Boolean(editingId);

  const sortedLoans = useMemo(
    () => [...loans].sort((a, b) => a.toolName.localeCompare(b.toolName)),
    [loans]
  );

  useEffect(() => {
    if (!editingId) {
      setForm({
        ...emptyForm,
        loanedAt: new Date().toISOString()
      });
      return;
    }
    const loan = loans.find((item) => item.id === editingId);
    if (!loan) {
      onSelectLoan(null);
      return;
    }
    setForm({
      toolName: loan.toolName,
      category: loan.category,
      serialNumber: loan.serialNumber ?? "",
      technicianId: loan.technicianId,
      loanedAt: loan.loanedAt,
      dueDate: loan.dueDate,
      status: loan.status,
      notes: loan.notes ?? ""
    });
  }, [editingId, loans, onSelectLoan]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.toolName.trim()) return;
    const payload: ToolLoanPayload = {
      toolName: form.toolName.trim(),
      category: form.category.trim(),
      serialNumber: form.serialNumber?.trim() || undefined,
      technicianId: form.technicianId || null,
      loanedAt: form.loanedAt,
      dueDate: form.dueDate,
      status: form.status,
      notes: form.notes?.trim() || undefined
    };
    if (isEditing && editingId) {
      onUpdate(editingId, payload);
    } else {
      onCreate(payload);
    }
    onSelectLoan(null);
  };

  return (
    <section
      className="card"
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h3>Gestion des prêts</h3>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Ajoutez un prêt d’outillage ou mettez à jour une affectation.
          </p>
        </div>
        {isEditing && (
          <button className="btn btn-outline" onClick={() => onSelectLoan(null)}>
            Annuler
          </button>
        )}
      </header>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "0.75rem"
        }}
      >
        <input
          className="input"
          placeholder="Nom de l’équipement"
          value={form.toolName}
          onChange={(event) => setForm((prev) => ({ ...prev, toolName: event.target.value }))}
          required
        />
        <input
          className="input"
          placeholder="Catégorie"
          value={form.category}
          onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
          required
        />
        <input
          className="input"
          placeholder="Numéro de série (optionnel)"
          value={form.serialNumber ?? ""}
          onChange={(event) => setForm((prev) => ({ ...prev, serialNumber: event.target.value }))}
        />
        <select
          className="input"
          value={form.technicianId ?? ""}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              technicianId: event.target.value || null
            }))
          }
        >
          <option value="">Disponible</option>
          {technicians.map((technician) => (
            <option key={technician.id} value={technician.id}>
              {technician.name} · {technician.team}
            </option>
          ))}
        </select>
        <input
          className="input"
          type="datetime-local"
          value={formatInputDate(form.loanedAt)}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, loanedAt: parseDate(event.target.value) ?? prev.loanedAt }))
          }
          required
        />
        <input
          className="input"
          type="datetime-local"
          value={form.dueDate ? formatInputDate(form.dueDate) : ""}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, dueDate: parseDate(event.target.value) }))
          }
        />
        <select
          className="input"
          value={form.status}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              status: event.target.value as ToolLoanPayload["status"]
            }))
          }
        >
          <option value="EN_COURS">En cours</option>
          <option value="RETARD">En retard</option>
          <option value="DISPONIBLE">Disponible</option>
        </select>
        <textarea
          className="input"
          rows={2}
          placeholder="Notes (optionnel)"
          value={form.notes ?? ""}
          onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
          style={{ gridColumn: "1 / -1" }}
        />
        <button className="btn btn-primary" type="submit">
          {isEditing ? "Mettre à jour" : "Ajouter le prêt"}
        </button>
      </form>

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Équipement</th>
              <th>Technicien</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedLoans.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "var(--muted)" }}>
                  Aucun prêt enregistré.
                </td>
              </tr>
            ) : (
              sortedLoans.map((loan) => {
                const technician = technicians.find((t) => t.id === loan.technicianId);
                return (
                  <tr key={loan.id}>
                    <td>{loan.toolName}</td>
                    <td>{technician ? `${technician.name} · ${technician.team}` : "Disponible"}</td>
                    <td>{loan.status}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          className="btn btn-outline"
                          type="button"
                          onClick={() => onSelectLoan(loan.id)}
                        >
                          Modifier
                        </button>
                        <button
                          className="btn"
                          style={{ background: "#fee4e2", color: "#b42318" }}
                          type="button"
                          onClick={() => onDelete(loan.id)}
                        >
                          Supprimer
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

