import { useState } from "react";
import type { Technician } from "@/lib/types";
import type { ProductWithStock } from "../tables/ProductTable";

type Props = {
  open: boolean;
  product: ProductWithStock | null;
  technicians: Technician[];
  onClose: () => void;
  onSubmit: (technicianId: string, quantity: number, comment?: string) => void;
};

export default function DistributeDialog({
  open,
  product,
  technicians,
  onClose,
  onSubmit
}: Props) {
  const [technicianId, setTechnicianId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  if (!open || !product) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!technicianId) {
      setError("Merci de choisir un technicien.");
      return;
    }

    if (quantity <= 0) {
      setError("La quantité doit être positive.");
      return;
    }

    if (quantity > product.available) {
      setError("Quantité supérieure au stock disponible.");
      return;
    }

    onSubmit(technicianId, quantity, comment.trim() || undefined);
    setTechnicianId("");
    setQuantity(1);
    setComment("");
    setError(null);
  };

  const handleClose = () => {
    onClose();
    setError(null);
  };

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3>Distribuer · {product.name}</h3>
            <p style={{ color: "var(--muted)", margin: 0 }}>
              Stock restant : {product.available} {product.unit ?? "u"}
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
              Quantité à sortir
            </span>
            <input
              className="input"
              type="number"
              min={1}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
            />
          </label>

          <label>
            <span style={{ display: "block", marginBottom: "0.35rem" }}>
              Commentaire (optionnel)
            </span>
            <textarea
              className="input"
              rows={3}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </label>

          {error && (
            <p style={{ color: "#d93025", margin: 0 }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary">
            Valider la sortie
          </button>
        </form>
      </div>
    </div>
  );
}









