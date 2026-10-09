export interface Question {
  enonce: string;
  reponses: string[];
  indexReponseCorrecte: number;
  explication: string;
}

export interface Lecon {
  id: string;
  titre: string;
  objectif: string;
  explication: string;
  textesReligieux: string[];
  references: string[];
  questions: Question[];
}

export const lecons: Lecon[] = [];