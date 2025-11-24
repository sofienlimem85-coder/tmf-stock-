import { useMemo, useState } from "react";
import type { TechnicianPayload } from "@/lib/types";
import type { Technician } from "@/lib/types";

type Props = {
  technicians: Technician[];
  onCreate: (payload: TechnicianPayload) => void;
  onUpdate: (technicianId: string, payload: TechnicianPayload) => void;
  onDelete: (technicianId: string) => void;
};

const emptyForm: TechnicianPayload = {
  name: "",
  email: "",
  team: ""
};

export default function TechnicianAdminPanel({
  technicians,
  onCreate,
  onUpdate,
  onDelete
}: Props) {
  const [form, setForm] = useState<TechnicianPayload>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const isEditing = Boolean(editingId);

  const sortedTechnicians = useMemo(
    () => [...technicians].sort((a, b) => a.name.localeCompare(b.name)),
    [technicians]
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    const payload: TechnicianPayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      team: form.team.trim()
    };
    if (isEditing && editingId) {
      onUpdate(editingId, payload);
    } else {
      onCreate(payload);
    }
    resetForm();
  };

  const handleEdit = (technician: Technician) => {
    setEditingId(technician.id);
    setForm({
      name: technician.name,
      email: technician.email,
      team: technician.team
    });
  };

  return (
    <section className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h3>Techniciens autorisés</h3>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            Gérez les profils pouvant retirer du stock.
          </p>
        </div>
        {isEditing && (
          <button className="btn btn-outline" onClick={resetForm}>
            Annuler la modification
          </button>
        )}
      </header>

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}
      >
        <input
          className="input"
          placeholder="Nom complet"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          required
        />
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          required
        />
        <input
          className="input"
          placeholder="Équipe / service"
          value={form.team}
          onChange={(event) => setForm((prev) => ({ ...prev, team: event.target.value }))}
        />
        <button className="btn btn-primary" type="submit">
          {isEditing ? "Mettre à jour" : "Ajouter"}
        </button>
      </form>

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Équipe</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTechnicians.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "var(--muted)" }}>
                  Aucun technicien enregistré.
                </td>
              </tr>
            ) : (
              sortedTechnicians.map((technician) => (
                <tr key={technician.id}>
                  <td>{technician.name}</td>
                  <td>{technician.email}</td>
                  <td>{technician.team}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        className="btn btn-outline"
                        type="button"
                        onClick={() => handleEdit(technician)}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn"
                        style={{ background: "#fee4e2", color: "#b42318" }}
                        type="button"
                        onClick={() => onDelete(technician.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}









