"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("admin1@tmf.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Identifiants incorrects.");
      return;
    }

    window.location.href = callbackUrl;
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem"
      }}
    >
      <section className="card" style={{ maxWidth: "420px", width: "100%", padding: "2rem" }}>
        <header style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h1>Connexion TMF Stock</h1>
          <p style={{ color: "var(--muted)" }}>
            Utilisez votre compte administrateur ou lecture seule.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <label>
            <span style={{ display: "block", marginBottom: "0.35rem" }}>Email</span>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            <span style={{ display: "block", marginBottom: "0.35rem" }}>Mot de passe</span>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && (
            <p style={{ color: "#d93025", margin: 0 }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--muted)" }}>
          <p style={{ marginBottom: "0.35rem" }}>Comptes démo :</p>
          <ul style={{ paddingLeft: "1.2rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <li>Admin · admin1@tmf.local / Admin#Stock1</li>
            <li>Admin · admin2@tmf.local / Admin#Stock2</li>
            <li>Lecture · viewer@tmf.local / Viewer#Stock</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

