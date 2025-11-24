import clsx from "clsx";

export type ProductWithStock = {
  id: string;
  name: string;
  category: string;
  unit?: string;
  initialQuantity: number;
  incoming: number;
  outgoing: number;
  threshold: number;
  alertMessage: string;
  available: number;
};

type Props = {
  products: ProductWithStock[];
  onDistribute: (productId: string) => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
};

function formatUnit(value: number, unit?: string) {
  return `${value} ${unit ?? "u"}`;
}

const getStatus = (product: ProductWithStock) => {
  if (product.available <= 0) {
    return { label: "Rupture", tone: "pill-warning" };
  }
  if (product.available <= product.threshold) {
    return { label: "Alerte", tone: "pill-warning" };
  }
  return { label: "OK", tone: "" };
};

export default function ProductTable({
  products,
  onDistribute,
  searchQuery = "",
  onSearchChange
}: Props) {
  return (
    <section className="card" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h2>Inventaire produits</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
            Vue temps réel des consommables suivis par l’équipe.
          </p>
        </div>
        {onSearchChange && (
          <input
            className="input"
            placeholder="Rechercher par nom ou catégorie"
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
              <th>Produit</th>
              <th>Catégorie</th>
              <th>Stock initial</th>
              <th>Entrées</th>
              <th>Sorties</th>
              <th>Disponible</th>
              <th>Seuil</th>
              <th>Status</th>
              <th>Alerte</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const status = getStatus(product);
              return (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                    <p style={{ color: "var(--muted)", margin: 0, fontSize: "0.85rem" }}>
                      {product.unit ?? "unité"}
                    </p>
                  </td>
                  <td>{product.category}</td>
                  <td>{formatUnit(product.initialQuantity, product.unit)}</td>
                  <td>{formatUnit(product.incoming, product.unit)}</td>
                  <td>{formatUnit(product.outgoing, product.unit)}</td>
                  <td>
                    <strong>{formatUnit(product.available, product.unit)}</strong>
                  </td>
                  <td>{formatUnit(product.threshold, product.unit)}</td>
                  <td>
                    <span className={clsx("pill", status.tone)}>{status.label}</span>
                  </td>
                  <td style={{ maxWidth: "220px" }}>
                    <small style={{ color: "var(--muted)", display: "block" }}>
                      {product.alertMessage || "—"}
                    </small>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => onDistribute(product.id)}
                      disabled={product.available <= 0}
                    >
                      Distribuer
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

