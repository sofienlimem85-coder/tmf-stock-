import type { ProductWithStock } from "../tables/ProductTable";
import type { Technician } from "@/lib/types";

export type ConsumptionFiltersState = {
  technicianId: string;
  productId: string;
  from: string;
  to: string;
};

type Props = {
  products: ProductWithStock[];
  technicians: Technician[];
  value: ConsumptionFiltersState;
  onChange: (next: ConsumptionFiltersState) => void;
};

export default function ConsumptionFilters({
  products,
  technicians,
  value,
  onChange
}: Props) {
  const handleField = (field: keyof ConsumptionFiltersState, next: string) => {
    onChange({
      ...value,
      [field]: next
    });
  };

  const reset = () => {
    onChange({
      technicianId: "all",
      productId: "all",
      from: "",
      to: ""
    });
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "flex-end" }}>
      <div style={{ flex: "1 1 180px" }}>
        <label style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Technicien
        </label>
        <select
          className="input"
          value={value.technicianId}
          onChange={(event) => handleField("technicianId", event.target.value)}
        >
          <option value="all">Tous</option>
          {technicians.map((technician) => (
            <option key={technician.id} value={technician.id}>
              {technician.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ flex: "1 1 180px" }}>
        <label style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Produit
        </label>
        <select
          className="input"
          value={value.productId}
          onChange={(event) => handleField("productId", event.target.value)}
        >
          <option value="all">Tous</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ flex: "1 1 160px" }}>
        <label style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Date de début
        </label>
        <input
          className="input"
          type="date"
          value={value.from}
          onChange={(event) => handleField("from", event.target.value)}
        />
      </div>

      <div style={{ flex: "1 1 160px" }}>
        <label style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Date de fin
        </label>
        <input
          className="input"
          type="date"
          value={value.to}
          onChange={(event) => handleField("to", event.target.value)}
        />
      </div>

      <button className="btn btn-outline" type="button" onClick={reset}>
        Réinitialiser
      </button>
    </div>
  );
}









