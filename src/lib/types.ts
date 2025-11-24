export type Product = {
  id: string;
  name: string;
  category: string;
  initialQuantity: number;
  threshold: number;
  alertMessage: string;
  unit?: string;
};

export type ProductPayload = Omit<Product, "id">;

export type Technician = {
  id: string;
  name: string;
  email: string;
  team: string;
};

export type TechnicianPayload = Omit<Technician, "id">;

export type MovementType = "ENTREE" | "SORTIE";

export type Movement = {
  id: string;
  productId: string;
  technicianId: string | null;
  quantity: number;
  type: MovementType;
  comment?: string;
  createdAt: string;
  createdBy?: string;
  attachmentUrl?: string;
  attachmentName?: string;
};

export type Attachment = {
  name: string;
  dataUrl: string;
};

export type ToolLoanStatus = "EN_COURS" | "RETARD" | "DISPONIBLE";

export type ToolLoan = {
  id: string;
  toolName: string;
  category: string;
  serialNumber?: string;
  technicianId: string | null;
  loanedAt: string;
  dueDate?: string;
  status: ToolLoanStatus;
  notes?: string;
};

export type ToolLoanPayload = Omit<ToolLoan, "id">;

