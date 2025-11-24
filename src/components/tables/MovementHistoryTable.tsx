import type { Movement, Technician } from "@/lib/types";

type ProductRef = {
  name: string;
};

type Props = {
  movements: Movement[];
  products: Map<string, ProductRef>;
  technicians: Map<string, Technician | undefined>;
};

export default function MovementHistoryTable({
  movements,
  products,
  technicians
}: Props) {
  const orderedMovements = [...movements].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const totalQuantity = orderedMovements.reduce(
    (sum, movement) => sum + movement.quantity,
    0
  );

  return (
    <section className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <header>
        <h2>Historique détaillé</h2>
        <p style={{ color: "var(--muted)", margin: 0 }}>
          Toutes les entrées et sorties correspondant aux filtres sélectionnés.
        </p>
      </header>

      {orderedMovements.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>Aucun mouvement pour cette période.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.5rem", color: "var(--muted)" }}>
            Total quantités : <strong style={{ marginLeft: "0.35rem", color: "var(--text)" }}>{totalQuantity}</strong>
          </div>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Produit</th>
                <th>Technicien</th>
                <th>Quantité</th>
                <th>Commentaire</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orderedMovements.map((movement) => {
                const product = products.get(movement.productId);
                const technician = movement.technicianId
                  ? technicians.get(movement.technicianId)
                  : undefined;
                return (
                  <tr key={movement.id}>
                    <td>
                      <span className={`pill ${movement.type === "SORTIE" ? "pill-warning" : ""}`}>
                        {movement.type === "SORTIE" ? "Sortie" : "Entrée"}
                      </span>
                    </td>
                    <td>{product?.name ?? "Produit supprimé"}</td>
                    <td>{technician?.name ?? "N/A"}</td>
                    <td>{movement.quantity}</td>
                    <td style={{ maxWidth: "240px" }}>
                      <small style={{ color: "var(--muted)" }}>
                        {movement.comment ?? "—"}
                      </small>
                    </td>
                    <td>
                      {new Intl.DateTimeFormat("fr-FR", {
                        dateStyle: "medium",
                        timeStyle: "short"
                      }).format(new Date(movement.createdAt))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

