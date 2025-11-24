import { useState } from "react";
import type { ProductWithStock } from "../tables/ProductTable";
import type { Attachment } from "@/lib/types";

type Props = {
  products: ProductWithStock[];
  onRestock: (
    productId: string,
    quantity: number,
    comment?: string,
    attachment?: Attachment
  ) => void;
};

export default function RestockForm({ products, onRestock }: Props) {
  const [productId, setProductId] = useState<string>(
    products.at(0)?.id ?? ""
  );
  const [quantity, setQuantity] = useState<number>(10);
  const [comment, setComment] = useState<string>("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!productId || quantity <= 0) return;
    onRestock(
      productId,
      quantity,
      comment.trim() || undefined,
      attachment ?? undefined
    );
    setQuantity(10);
    setComment("");
    setAttachment(null);
    setAttachmentError(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setAttachment(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setAttachmentError("Le fichier doit être une image (JPG, PNG, etc.).");
      setAttachment(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAttachment({
        name: file.name,
        dataUrl: reader.result as string
      });
      setAttachmentError(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem"
        }}
      >
        <div>
          <h3>Entrée rapide en stock</h3>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: "0.9rem" }}>
            Sélectionnez l’article, la quantité et attachez le justificatif (facture ou BL).
          </p>
        </div>
        <button
          className="btn btn-outline"
          type="button"
          onClick={() => {
            setQuantity(10);
            setComment("");
            setAttachment(null);
            setAttachmentError(null);
          }}
        >
          Réinitialiser
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "0.75rem"
        }}
      >
        <select
          className="input"
          value={productId}
          onChange={(event) => setProductId(event.target.value)}
        >
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <input
          className="input"
          type="number"
          min={1}
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
        />
        <input
          className="input"
          type="text"
          placeholder="Commentaire (lot, BL...)"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <span style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
            Facture / BL (image)
          </span>
          <input
            className="input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {attachment && (
            <small style={{ color: "var(--muted)" }}>
              Pièce jointe : {attachment.name}
            </small>
          )}
          {attachmentError && (
            <small style={{ color: "#b42318" }}>{attachmentError}</small>
          )}
        </label>
        <button className="btn btn-primary" type="submit" style={{ alignSelf: "end" }}>
          Valider l’entrée
        </button>
      </form>
    </div>
  );
}









