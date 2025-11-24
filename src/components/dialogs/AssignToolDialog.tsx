import { useState, useEffect } from "react";
import type { Technician, ToolLoan } from "@/lib/types";

type Props = {
  open: boolean;
  loan: ToolLoan | null;
  technicians: Technician[];
  onClose: () => void;
  onSubmit: (params: {
    technicianId: string;
    dueDate?: string;
    notes?: string;
  }) => void;
};

export default function AssignToolDialog({
  open,
  loan,
  technicians,
  onClose,
  onSubmit
}: Props) {
  const [technicianId, setTechnicianId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loan) return;
    setTechnicianId(loan.technicianId ?? "");
    setDueDate(loan.dueDate ? loan.dueDate.slice(0, 16) : "");
    setNotes(loan.notes ?? "");
  }, [loan]);

  if (!open || !loan) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!technicianId) {
      setError("Veuillez sélectionner un technicien.");
      return;
    }
    onSubmit({
      technicianId,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      notes: notes.trim() || undefined
    });
    setError(null);
  };

  const handleClose = () => {
    onClose();
    setError(null);
  };

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="modal" style={{ maxWidth: "520px" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <h3>Prêter · {loan.toolName}</h3>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Numéro de série : {loan.serialNumber ?? "—"}
            </p>
          </div>
          <button className="btn btn-outline" onClick={handleClose}>
            Fermer
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}
        >
          <label>
            <span style={{ display: "block", marginBottom: "0.35rem" }}>
              Technicien
            </span>
            <select
              className="input"
              value={technicianId}
              onChange={(event) => setTechnicianId(event.target.value)}
            >
              <option value="">Choisir...</option>
              {technicians.map((technician) => (
                <option key={technician.id} value={technician.id}>
                  {technician.name} · {technician.team}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span style={{ display: "block", marginBottom: "0.35rem" }}>
              Retour prévu (optionnel)
            </span>
            <input
              className="input"
              type="datetime-local"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </label>

          <label>
            <span style={{ display: "block", marginBottom: "0.35rem" }}>
              Notes
            </span>
            <textarea
              className="input"
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>

          {error && (
            <p style={{ color: "#d93025", margin: 0 }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary">
            Valider le prêt
          </button>
        </form>
      </div>
    </div>
  );
}

