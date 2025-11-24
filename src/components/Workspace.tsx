"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import {
  initialProducts,
  initialTechnicians,
  initialToolLoans
} from "@/lib/data";
import type {
  Movement,
  Product,
  Technician,
  ProductPayload,
  TechnicianPayload,
  ToolLoan,
  ToolLoanPayload,
  Attachment
} from "@/lib/types";
import ProductTable, { ProductWithStock } from "./tables/ProductTable";
import TechnicianConsumptionTable, {
  TechnicianMovementRow
} from "./tables/TechnicianConsumptionTable";
import DistributeDialog from "./dialogs/DistributeDialog";
import RestockForm from "./forms/RestockForm";
import ProductAdminPanel from "./panels/ProductAdminPanel";
import TechnicianAdminPanel from "./panels/TechnicianAdminPanel";
import ConsumptionFilters, {
  ConsumptionFiltersState
} from "./filters/ConsumptionFilters";
import MovementHistoryTable from "./tables/MovementHistoryTable";
import NavigationMenu, { SectionId } from "./NavigationMenu";
import ToolLoansTable, { ToolLoanRow } from "./tables/ToolLoansTable";
import AssignToolDialog from "./dialogs/AssignToolDialog";
import ToolLoanAdminPanel from "./panels/ToolLoanAdminPanel";

type ProductState = Product & {
  incoming: number;
  outgoing: number;
};

const seedProducts: ProductState[] = initialProducts.map((product) => ({
  ...product,
  incoming: 0,
  outgoing: 0
}));

export default function Workspace() {
  const [products, setProducts] = useState<ProductState[]>(seedProducts);
  const [technicians, setTechnicians] =
    useState<Technician[]>(initialTechnicians);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [toolLoans, setToolLoans] = useState<ToolLoan[]>(initialToolLoans);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [activeLoanId, setActiveLoanId] = useState<string | null>(null);
  const [editingLoanId, setEditingLoanId] = useState<string | null>(null);
  const [filters, setFilters] = useState<ConsumptionFiltersState>({
    technicianId: "all",
    productId: "all",
    from: "",
    to: ""
  });
  const [productQuery, setProductQuery] = useState("");
  const [toolLoanQuery, setToolLoanQuery] = useState("");
  const [activeSection, setActiveSection] = useState<SectionId>("overview");

  const productLookup = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );

  const technicianLookup = useMemo(
    () => new Map(technicians.map((tech) => [tech.id, tech])),
    [technicians]
  );

  const computedProducts: ProductWithStock[] = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        available: product.initialQuantity + product.incoming - product.outgoing
      })),
    [products]
  );

  const filteredProducts = useMemo(() => {
    if (!productQuery.trim()) return computedProducts;
    const query = productQuery.toLowerCase();
    return computedProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
  }, [computedProducts, productQuery]);

  const filteredMovements = useMemo(() => {
    return movements.filter((movement) => {
      if (filters.technicianId !== "all" && movement.technicianId !== filters.technicianId) {
        return false;
      }
      if (filters.productId !== "all" && movement.productId !== filters.productId) {
        return false;
      }
      if (filters.from) {
        const fromTime = new Date(filters.from).getTime();
        if (new Date(movement.createdAt).getTime() < fromTime) {
          return false;
        }
      }
      if (filters.to) {
        const toTime = new Date(filters.to).getTime();
        if (new Date(movement.createdAt).getTime() > toTime) {
          return false;
        }
      }
      return true;
    });
  }, [filters, movements]);

  const technicianRows: TechnicianMovementRow[] = useMemo(() => {
    return filteredMovements
      .filter((movement) => movement.type === "SORTIE" && movement.technicianId)
      .map((movement) => {
        const product = productLookup.get(movement.productId);
        const technician = technicianLookup.get(movement.technicianId!);
        return {
          id: movement.id,
          technicianName: technician?.name ?? "Technicien inconnu",
          team: technician?.team ?? "N/A",
          productName: product?.name ?? "Produit supprimé",
          quantity: movement.quantity,
          comment: movement.comment ?? "",
          createdAt: movement.createdAt
        };
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [filteredMovements, productLookup, technicianLookup]);

  const toolLoanRows: ToolLoanRow[] = useMemo(() => {
    return toolLoans.map((loan) => {
      const technician = loan.technicianId
        ? technicianLookup.get(loan.technicianId)
        : null;
      return {
        id: loan.id,
        toolName: loan.toolName,
        category: loan.category,
        serialNumber: loan.serialNumber,
        technicianName: technician?.name ?? "Disponible",
        team: technician?.team ?? "Stock central",
        loanedAt: loan.loanedAt,
        dueDate: loan.dueDate,
        status: loan.status,
        notes: loan.notes
      };
    });
  }, [toolLoans, technicianLookup]);

  const filteredToolLoans = useMemo(() => {
    if (!toolLoanQuery.trim()) return toolLoanRows;
    const query = toolLoanQuery.toLowerCase();
    return toolLoanRows.filter((loan) => {
      return (
        loan.toolName.toLowerCase().includes(query) ||
        loan.category.toLowerCase().includes(query) ||
        (loan.serialNumber ?? "").toLowerCase().includes(query) ||
        loan.technicianName.toLowerCase().includes(query)
      );
    });
  }, [toolLoanRows, toolLoanQuery]);
  const assignedToolLoans = filteredToolLoans.filter(
    (loan) => loan.status !== "DISPONIBLE"
  );
  const availableToolLoans = filteredToolLoans.filter(
    (loan) => loan.status === "DISPONIBLE"
  );

  const selectedProduct = activeProductId
    ? computedProducts.find((product) => product.id === activeProductId) ?? null
    : null;
  const selectedLoan = activeLoanId
    ? toolLoans.find((loan) => loan.id === activeLoanId) ?? null
    : null;

  const handleRestock = (
    productId: string,
    quantity: number,
    comment?: string,
    attachment?: Attachment
  ) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, incoming: product.incoming + quantity }
          : product
      )
    );

    const movement: Movement = {
      id: uuid(),
      productId,
      technicianId: null,
      quantity,
      type: "ENTREE",
      comment,
      createdAt: new Date().toISOString(),
      attachmentName: attachment?.name,
      attachmentUrl: attachment?.dataUrl
    };
    setMovements((prev) => [movement, ...prev]);
  };

  const handleDistribution = (
    technicianId: string,
    quantity: number,
    comment?: string
  ) => {
    if (!selectedProduct) return;

    setProducts((prev) =>
      prev.map((product) =>
        product.id === selectedProduct.id
          ? { ...product, outgoing: product.outgoing + quantity }
          : product
      )
    );

    const movement: Movement = {
      id: uuid(),
      productId: selectedProduct.id,
      technicianId,
      quantity,
      type: "SORTIE",
      comment,
      createdAt: new Date().toISOString()
    };
    setMovements((prev) => [movement, ...prev]);
    setActiveProductId(null);
  };

  const handleCreateProduct = (payload: ProductPayload) => {
    const newProduct: ProductState = {
      id: uuid(),
      ...payload,
      incoming: 0,
      outgoing: 0
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleUpdateProduct = (productId: string, payload: ProductPayload) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, ...payload } : product
      )
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
    setMovements((prev) =>
      prev.filter((movement) => movement.productId !== productId)
    );
    if (activeProductId === productId) {
      setActiveProductId(null);
    }
  };

  const handleCreateTechnician = (payload: TechnicianPayload) => {
    const newTechnician: Technician = {
      id: uuid(),
      ...payload
    };
    setTechnicians((prev) => [...prev, newTechnician]);
  };

  const handleUpdateTechnician = (
    technicianId: string,
    payload: TechnicianPayload
  ) => {
    setTechnicians((prev) =>
      prev.map((technician) =>
        technician.id === technicianId ? { ...technician, ...payload } : technician
      )
    );
  };

  const handleDeleteTechnician = (technicianId: string) => {
    setTechnicians((prev) =>
      prev.filter((technician) => technician.id !== technicianId)
    );
    setMovements((prev) =>
      prev.map((movement) =>
        movement.technicianId === technicianId
          ? { ...movement, technicianId: null }
          : movement
      )
    );
  };

  const handleReturnTool = (loanId: string) => {
    setToolLoans((prev) =>
      prev.map((loan) =>
        loan.id === loanId
          ? { ...loan, technicianId: null, status: "DISPONIBLE", dueDate: undefined }
          : loan
      )
    );
    if (activeLoanId === loanId) {
      setActiveLoanId(null);
    }
  };

  const handleAssignTool = ({
    technicianId,
    dueDate,
    notes
  }: {
    technicianId: string;
    dueDate?: string;
    notes?: string;
  }) => {
    if (!activeLoanId) return;
    setToolLoans((prev) =>
      prev.map((loan) =>
        loan.id === activeLoanId
          ? {
              ...loan,
              technicianId,
              loanedAt: new Date().toISOString(),
              dueDate,
              status: "EN_COURS",
              notes
            }
          : loan
      )
    );
    setActiveLoanId(null);
  };

  const handleCreateToolLoan = (payload: ToolLoanPayload) => {
    const newLoan: ToolLoan = {
      id: uuid(),
      ...payload
    };
    setToolLoans((prev) => [newLoan, ...prev]);
  };

  const handleUpdateToolLoan = (loanId: string, payload: ToolLoanPayload) => {
    setToolLoans((prev) =>
      prev.map((loan) => (loan.id === loanId ? { ...loan, ...payload } : loan))
    );
  };

  const handleDeleteToolLoan = (loanId: string) => {
    setToolLoans((prev) => prev.filter((loan) => loan.id !== loanId));
    if (activeLoanId === loanId) {
      setActiveLoanId(null);
    }
    if (editingLoanId === loanId) {
      setEditingLoanId(null);
    }
  };

  const stockAlertCount = computedProducts.filter(
    (product) => product.available <= product.threshold
  ).length;

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <section style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="card">
              <h3>Navigation</h3>
              <p style={{ color: "var(--muted)" }}>
                Utilisez les boutons ci-dessus pour accéder aux entrées, à l’inventaire, aux administrateurs ou
                aux historiques. Chaque module s’ouvre dans sa propre vue.
              </p>
            </div>
            <div className="card" style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <p style={{ color: "var(--muted)", marginBottom: "0.25rem" }}>
                  Alertes stock
                </p>
                <strong style={{ fontSize: "2rem" }}>{stockAlertCount}</strong>
              </div>
              <div>
                <p style={{ color: "var(--muted)", marginBottom: "0.25rem" }}>
                  Équipements prêtés
                </p>
                <strong style={{ fontSize: "2rem" }}>{toolLoans.filter((loan) => loan.technicianId).length}</strong>
              </div>
            </div>
          </section>
        );
      case "restock":
        return (
          <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <h2>Entrées de stock</h2>
              <p style={{ color: "var(--muted)" }}>
                Ajoutez rapidement les réceptions ou retours magasin.
              </p>
            </div>
            <RestockForm products={computedProducts} onRestock={handleRestock} />
          </section>
        );
      case "inventory":
        return (
          <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <h2>Inventaire produits</h2>
              <p style={{ color: "var(--muted)" }}>
                Recherchez un article et lancez une distribution vers un technicien.
              </p>
            </div>
            <ProductTable
              products={filteredProducts}
              onDistribute={setActiveProductId}
              searchQuery={productQuery}
              onSearchChange={setProductQuery}
            />
          </section>
        );
      case "admin":
        return (
          <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <h2>Administration</h2>
              <p style={{ color: "var(--muted)" }}>
                Gérez le catalogue des produits suivis et la liste des techniciens autorisés.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "1.5rem"
              }}
            >
              <ProductAdminPanel
                products={computedProducts}
                onCreate={handleCreateProduct}
                onUpdate={handleUpdateProduct}
                onDelete={handleDeleteProduct}
              />
              <TechnicianAdminPanel
                technicians={technicians}
                onCreate={handleCreateTechnician}
                onUpdate={handleUpdateTechnician}
                onDelete={handleDeleteTechnician}
              />
            </div>
          </section>
        );
      case "consumption":
        return (
          <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <h2>Consommations techniciens</h2>
              <p style={{ color: "var(--muted)" }}>
                Filtrez par technicien, produit ou période pour visualiser chaque sortie.
              </p>
            </div>
            <div className="card">
              <ConsumptionFilters
                products={computedProducts}
                technicians={technicians}
                value={filters}
                onChange={setFilters}
              />
            </div>
            <TechnicianConsumptionTable rows={technicianRows} />
          </section>
        );
      case "history":
        return (
          <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <h2>Historique détaillé</h2>
              <p style={{ color: "var(--muted)" }}>
                Journal complet des entrées et sorties correspondant aux filtres appliqués.
              </p>
            </div>
            <div className="card">
              <ConsumptionFilters
                products={computedProducts}
                technicians={technicians}
                value={filters}
                onChange={setFilters}
              />
            </div>
            <MovementHistoryTable
              movements={filteredMovements}
              products={productLookup}
              technicians={technicianLookup}
            />
          </section>
        );
      case "loans":
        return (
          <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <h2>Outillage prêté</h2>
              <p style={{ color: "var(--muted)" }}>
                Visualisez les matériels critiques et attribuez-les aux techniciens.
              </p>
            </div>
            <ToolLoansTable
              rows={assignedToolLoans}
              onAssign={setActiveLoanId}
              onReturn={handleReturnTool}
              searchQuery={toolLoanQuery}
              onSearchChange={setToolLoanQuery}
              title="Équipements prêtés"
              emptyMessage="Aucun équipement en prêt"
            />
            <ToolLoansTable
              rows={availableToolLoans}
              onAssign={setActiveLoanId}
              onReturn={handleReturnTool}
              title="Équipements disponibles"
              emptyMessage="Aucun matériel disponible"
            />
            <ToolLoanAdminPanel
              technicians={technicians}
              loans={toolLoans}
              editingId={editingLoanId}
              onSelectLoan={setEditingLoanId}
              onCreate={handleCreateToolLoan}
              onUpdate={handleUpdateToolLoan}
              onDelete={handleDeleteToolLoan}
            />
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem"
      }}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          textAlign: "center"
        }}
      >
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "24px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 18px 34px rgba(15,23,42,0.18)"
          }}
        >
          <Image
            src="/tmf-logo.png"
            alt="Logo TMF"
            width={88}
            height={88}
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
        <div>
          <h1 style={{ marginBottom: "0.25rem" }}>TMF Stock · Consommables</h1>
          <p style={{ color: "var(--muted)" }}>
            Pilotage des entrées, inventaires, outillages prêtés et historiques.
          </p>
        </div>
      </header>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <NavigationMenu
          activeSection={activeSection}
          onSelect={setActiveSection}
        />
      </div>

      {renderSection()}

      <DistributeDialog
        open={Boolean(selectedProduct)}
        product={selectedProduct}
        technicians={technicians}
        onClose={() => setActiveProductId(null)}
        onSubmit={handleDistribution}
      />
      <AssignToolDialog
        open={Boolean(activeLoanId)}
        loan={selectedLoan}
        technicians={technicians}
        onClose={() => setActiveLoanId(null)}
        onSubmit={handleAssignTool}
      />
    </main>
  );
}

