export type SectionId =
  | "overview"
  | "restock"
  | "inventory"
  | "admin"
  | "consumption"
  | "history"
  | "loans";

type SectionLink = {
  id: SectionId;
  label: string;
  icon: string;
};

const sections: SectionLink[] = [
  { id: "overview", label: "Vue générale", icon: "🏠" },
  { id: "restock", label: "Entrées stock", icon: "➕" },
  { id: "inventory", label: "Inventaire", icon: "📦" },
  { id: "admin", label: "Administration", icon: "🛠️" },
  { id: "consumption", label: "Consommations", icon: "👷" },
  { id: "history", label: "Historique", icon: "📑" },
  { id: "loans", label: "Outillage prêté", icon: "🧰" }
];

type Props = {
  activeSection: SectionId;
  onSelect: (id: SectionId) => void;
};

export default function NavigationMenu({ activeSection, onSelect }: Props) {
  return (
    <nav
      className="card"
      style={{
        display: "flex",
        gap: "0.75rem",
        flexWrap: "wrap",
        padding: "0.75rem 1rem",
        justifyContent: "center"
      }}
    >
      {sections.map((section) => (
        <button
          key={section.id}
          className="btn btn-outline"
          style={{
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.35rem",
            fontWeight: 500,
            minWidth: "150px",
            borderColor:
              activeSection === section.id ? "var(--primary)" : undefined,
            color:
              activeSection === section.id ? "var(--primary)" : "var(--text)",
            background:
              activeSection === section.id ? "rgba(0,106,220,0.08)" : "#fff",
            boxShadow:
              activeSection === section.id
                ? "0 6px 18px rgba(15,23,42,0.1)"
                : "none"
          }}
          onClick={() => onSelect(section.id)}
          aria-pressed={activeSection === section.id}
        >
          <span aria-hidden="true">{section.icon}</span>
          {section.label}
        </button>
      ))}
    </nav>
  );
}

