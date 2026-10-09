export interface Rappel {
  id: string;
  type: "texte-religieux" | "formulation-equipe";
  texte: string;
  reference: string;
  source: string;
}

export const rappels: Rappel[] = [];