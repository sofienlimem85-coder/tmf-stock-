export type TechnicianMovementRow = {
  id: string;
  technicianName: string;
  team: string;
  productName: string;
  quantity: number;
  comment: string;
  createdAt: string;
};

type Props = {
  rows: TechnicianMovementRow[];
};

export default function TechnicianConsumptionTable({ rows }: Props) {
  return (
    <section className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <header>
        <h2>Consommations par technicien</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
          Chaque sortie est tracée individuellement, même pour un même produit dans la journée.
        </p>
      </header>

      {rows.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>
          Aucune sortie enregistrée pour le moment.
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Technicien</th>
                <th>Équipe</th>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    {new Intl.DateTimeFormat("fr-FR", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    }).format(new Date(row.createdAt))}
                  </td>
                  <td>
                    <strong>{row.technicianName}</strong>
                  </td>
                  <td>{row.team}</td>
                  <td>{row.productName}</td>
                  <td>{row.quantity}</td>
                  <td style={{ maxWidth: "220px" }}>
                    <small style={{ color: "var(--muted)" }}>
                      {row.comment || "—"}
                    </small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

