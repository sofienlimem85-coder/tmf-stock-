import { useEffect, useMemo, useState } from "react";
import type { ProductPayload } from "@/lib/types";
import type { ProductWithStock } from "../tables/ProductTable";

type Props = {
  products: ProductWithStock[];
  onCreate: (payload: ProductPayload) => void;
  onUpdate: (productId: string, payload: ProductPayload) => void;
  onDelete: (productId: string) => void;
};

const emptyForm: ProductPayload = {
  name: "",
  category: "",
  unit: "",
  initialQuantity: 0,
  threshold: 0,
  alertMessage: ""
};

export default function ProductAdminPanel({
  products,
  onCreate,
  onUpdate,
  onDelete
}: Props) {
  const [form, setForm] = useState<ProductPayload>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const isEditing = Boolean(editingId);

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products]
  );

  useEffect(() => {
    if (!isEditing) return;
    const product = products.find((item) => item.id === editingId);
    if (!product) {
      setEditingId(null);
      setForm(emptyForm);
      return;
    }
    setForm({
      name: product.name,
      category: product.category,
      unit: product.unit ?? "",
      initialQuantity: product.initialQuantity,
      threshold: product.threshold,
      alertMessage: product.alertMessage
    });
  }, [editingId, isEditing, products]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    const payload: ProductPayload = {
      ...form,
      unit: form.unit?.trim() || undefined,
      category: form.category.trim(),
      name: form.name.trim(),
      alertMessage: form.alertMessage.trim()
    };
    if (isEditing && editingId) {
      onUpdate(editingId, payload);
    } else {
      onCreate(payload);
    }
    resetForm();
  };

  return (
    <section className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h3>Catalogue produits</h3>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            Ajoutez, modifiez ou supprimez les articles suivis.
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
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "0.75rem"
        }}
      >
        <input
          className="input"
          placeholder="Nom du produit"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
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
          placeholder="Unité (ex. pièce)"
          value={form.unit}
          onChange={(event) => setForm((prev) => ({ ...prev, unit: event.target.value }))}
        />
        <input
          className="input"
          type="number"
          min={0}
          placeholder="Stock initial"
          value={form.initialQuantity}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, initialQuantity: Number(event.target.value) }))
          }
          required
        />
        <input
          className="input"
          type="number"
          min={0}
          placeholder="Seuil"
          value={form.threshold}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, threshold: Number(event.target.value) }))
          }
          required
        />
        <textarea
          className="input"
          placeholder="Message d'alerte (ex. consignes réappro)"
          rows={2}
          value={form.alertMessage}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, alertMessage: event.target.value }))
          }
          style={{ gridColumn: "1 / -1" }}
          required
        />
        <button className="btn btn-primary" type="submit">
          {isEditing ? "Mettre à jour" : "Ajouter"}
        </button>
      </form>

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Produit</th>
              <th>Catégorie</th>
              <th>Stock initial</th>
              <th>Seuil</th>
              <th>Alerte stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "var(--muted)" }}>
                  Aucun article pour le moment.
                </td>
              </tr>
            ) : (
              sortedProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.initialQuantity}</td>
                  <td>{product.threshold}</td>
                  <td>{product.alertMessage}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        className="btn btn-outline"
                        type="button"
                        onClick={() => setEditingId(product.id)}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn"
                        style={{ background: "#fee4e2", color: "#b42318" }}
                        type="button"
                        onClick={() => onDelete(product.id)}
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

