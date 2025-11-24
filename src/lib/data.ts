import type { Product, Technician, ToolLoan } from "./types";

export const initialProducts: Product[] = [
  {
    id: "prod-ethernet",
    name: "Câble RJ45 Cat6 - 3m",
    category: "Réseau",
    initialQuantity: 180,
    threshold: 40,
    alertMessage: "Prévoir réappro des câbles RJ45 pour les prochaines interventions.",
    unit: "pièce"
  },
  {
    id: "prod-gants",
    name: "Gants nitrile taille L",
    category: "Protection",
    initialQuantity: 320,
    threshold: 60,
    alertMessage: "Commander des gants supplémentaires avant la fin de semaine.",
    unit: "boîte"
  },
  {
    id: "prod-fibre",
    name: "Kit raccord fibre FTTH",
    category: "Terrain",
    initialQuantity: 75,
    threshold: 15,
    alertMessage: "Stock critique pour les kits FTTH, déclencher une commande.",
    unit: "kit"
  }
];

export const initialTechnicians: Technician[] = [
  {
    id: "tech-ines",
    name: "Inès Diallo",
    email: "ines.diallo@tmf.local",
    team: "FTTH"
  },
  {
    id: "tech-samir",
    name: "Samir Khaled",
    email: "samir.khaled@tmf.local",
    team: "Maintenance"
  },
  {
    id: "tech-lina",
    name: "Lina Hadj",
    email: "lina.hadj@tmf.local",
    team: "Install"
  }
];

export const initialToolLoans: ToolLoan[] = [
  {
    id: "loan-fiber-meter",
    toolName: "Réflectomètre optique",
    category: "Mesure",
    serialNumber: "RTM-FTTH-0421",
    technicianId: "tech-ines",
    loanedAt: "2024-06-02T09:30:00.000Z",
    dueDate: "2024-06-15T18:00:00.000Z",
    status: "EN_COURS",
    notes: "Utilisé pour la campagne FTTH Est."
  },
  {
    id: "loan-splicer",
    toolName: "Soudeuse fibre Fujikura",
    category: "Terrain",
    serialNumber: "SP-9931",
    technicianId: "tech-samir",
    loanedAt: "2024-06-05T08:00:00.000Z",
    status: "RETARD",
    notes: "Relancer pour retour atelier."
  },
  {
    id: "loan-laptop",
    toolName: "PC terrain durci",
    category: "Informatique",
    serialNumber: "PC-TMF-778",
    technicianId: null,
    loanedAt: "2024-05-28T10:15:00.000Z",
    status: "DISPONIBLE",
    notes: "Prêt pour prochaine mission."
  }
];

