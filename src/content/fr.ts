export const content = {
  navigation: "Navigation principale",
  skipToContent: "Aller au contenu",
  unavailable: "Cette section sera bientôt disponible.",
  loading: "Chargement en cours…",
  error: "Une erreur est survenue.",
  retry: "Réessayer",
  home: "Retour à l’accueil",
  notFoundTitle: "Page introuvable",
  notFoundDescription: "La page que vous recherchez n’existe pas.",
  errorTitle: "La page n’a pas pu être chargée",
  errorDescription: "Veuillez réessayer ou revenir à l’accueil.",
  pages: {
    home: { title: "Accueil", description: "Retrouvez ici vos horaires de prière, la sunna du jour, le rappel du jour et votre parcours quotidien." },
    goal: { title: "Objectif", description: "Définissez et suivez votre objectif personnel." },
    sources: { title: "Sources fiables", description: "Recherchez des textes religieux dans des sources vérifiées." },
    sadaqa: { title: "Sadaqa", description: "Soutenez le projet ou faites un don à une organisation sélectionnée." },
    settings: { title: "Paramètres", description: "Personnalisez votre expérience." },
    account: { title: "Compte", description: "Gérez votre compte et vos données." },
  },
} as const;

export type PageKey = keyof typeof content.pages;