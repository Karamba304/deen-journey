# Deen Journey

CONTEXTE DU PROJET
Tu vas construire une application web destinée aux musulmans : pratique religieuse, apprentissage et progression personnelle. Ton sobre, sérieux, respectueux. Ce n'est PAS une application qui remplace les savants ou les imams.
Nom de l'application : provisoire, utilise « Mon Deen » (il sera changé plus tard). Mets le nom dans UNE seule constante (src/config/app.ts) pour qu'il soit modifiable en un seul endroit.

PÉRIMÈTRE DE CE LOT (LOT 1) — TRÈS IMPORTANT
Dans ce lot, tu construis UNIQUEMENT : la structure de l'application, la navigation, le design de base et 6 pages vides.
Tu ne construis RIEN d'autre. Je te donne la vision d'ensemble uniquement pour que tu organises le code de façon à accueillir la suite, pas pour que tu l'implémentes.

INTERDIT DANS CE LOT
- Aucun faux horaire de prière, aucun faux verset, hadith, référence, traduction, citation ou « sunna du jour ».
- Aucune fausse statistique, aucun faux utilisateur, aucun faux témoignage, aucun faux résultat de recherche.
- Aucun bouton, carte ou lien qui ne fait rien. Si un élément n'a pas encore de fonction, ne l'affiche pas.
- Pas de connexion / inscription fonctionnelle, pas de base de données, pas de backend, pas d'API externe, pas d'IA, pas de paiement, pas de notifications, pas de géolocalisation.
- Pas de texte arabe affiché pour l'instant.
- Pas de fonctionnalités ou de sections que je n'ai pas décrites.
- Ne modifie pas la liste ni l'ordre des sections.

NAVIGATION PRINCIPALE
Une barre horizontale de boutons, dans l'esprit de la navigation d'Instagram, avec exactement ces 6 sections dans cet ordre :
Accueil | Objectif | Sources fiables | Sadaqa | Paramètres | Compte

Routes (react-router) :
- Accueil → /
- Objectif → /objectif
- Sources fiables → /sources
- Sadaqa → /sadaqa
- Paramètres → /parametres
- Compte → /compte
Ajoute une page « introuvable » pour toute autre URL, avec un bouton qui ramène à l'accueil.

Comportement de la barre :
- Chaque élément est un vrai bouton / lien de navigation qui ouvre sa page.
- La section ouverte est clairement identifiable (couleur dorée + indicateur, par exemple un soulignement), et elle est marquée avec aria-current="page".
- La transition entre sections est fluide (léger fondu, 150–250 ms, sans animation lourde).
- Chaque bouton a une icône (bibliothèque lucide-react) au-dessus ou à côté du libellé.
- Sur ordinateur : barre horizontale fixée en haut de page, éléments répartis ou centrés, avec le nom de l'app à gauche si la place le permet.
- Sur tablette et téléphone : la barre reste horizontale, fixe, avec défilement horizontal si les 6 boutons ne tiennent pas. Chaque bouton doit garder une zone tactile d'au moins 44 px de haut, un libellé lisible et jamais tronqué. La section active doit automatiquement défiler dans la zone visible.
- Prévois la zone sûre (safe area) des téléphones.
- Navigation au clavier : focus visible, ordre logique, Entrée/Espace actifs.

DESIGN
Direction : moderne, sobre, élégant, sérieux. Pas excessivement luxueux.
- Fond sombre : bleu nuit profond (autour de #0B1220) avec des surfaces légèrement plus claires (autour de #121A2C) pour les cartes.
- Texte principal clair (autour de #F2EFE6), texte secondaire gris-bleu atténué.
- Accent doré (autour de #C9A24B) utilisé avec parcimonie : élément actif, petits détails, titres de section. NE PAS mettre du doré partout.
- Définis ces couleurs comme variables de thème (tokens CSS / tailwind config), jamais en dur dans les composants.
- Typographie : une police serif élégante pour les titres (Cormorant Garamond ou Playfair Display), une police très lisible pour le texte courant (Inter). Charge aussi, sans l'utiliser encore visuellement, une police adaptée à l'arabe (Amiri ou Noto Naskh Arabic) et prépare une classe utilitaire « texte-arabe » (direction RTL, grande taille, interligne généreux) pour plus tard.
- Contraste lisible (respecte au minimum WCAG AA), espacements confortables, ne surcharge pas les écrans.
- Prévois dès maintenant des composants réutilisables pour : Carte, Bouton, état de chargement, message d'erreur, état « contenu indisponible ». Ils peuvent être créés mais ne sont pas affichés avec du faux contenu.

CONTENU DES 6 PAGES (LOT 1)
Chaque page affiche uniquement :
- son titre (selon la police des titres) ;
- une courte phrase indiquant à quoi servira la section ;
- le texte « Cette section sera bientôt disponible. »
Phrases d'usage :
- Accueil : « Retrouvez ici vos horaires de prière, la sunna du jour, le rappel du jour et votre parcours quotidien. »
- Objectif : « Définissez et suivez votre objectif personnel. »
- Sources fiables : « Recherchez des textes religieux dans des sources vérifiées. »
- Sadaqa : « Soutenez le projet ou faites un don à une organisation sélectionnée. »
- Paramètres : « Personnalisez votre expérience. »
- Compte : « Gérez votre compte et vos données. »

ARCHITECTURE DU CODE
Utilise la stack par défaut de Lovable (React, TypeScript, Tailwind, react-router).
- Un composant pour la barre de navigation, un fichier par page, un composant de mise en page commun.
- La liste des 6 sections (libellé, route, icône) définie en UN seul endroit et réutilisée par la barre de navigation.
- Tous les textes affichés dans un fichier centralisé (src/content/ ou équivalent), car l'application sera plus tard multilingue ; ne code pas encore le multilingue.
- Dossiers prévus pour plus tard, mais vides ou absents tant qu'ils ne servent pas : components/, pages/, config/, content/, lib/. Ne crée pas de fichiers inutiles.
- Code simple, lisible, sans duplication, sans code mort, sans dépendance inutile.
- Page en français (<html lang="fr">), titre de l'onglet = nom de l'app, favicon neutre.

VISION DES LOTS SUIVANTS (À NE PAS IMPLÉMENTER MAINTENANT)
Pour information, afin que tu n'empêches pas leur ajout :
- Accueil : 4 cartes compactes qui se déplient au clic (horaires de prière, sunna du jour, rappel du jour, parcours quotidien 2 leçons × 3 QCM).
- Horaires de prière via l'API AlAdhan, avec localisation ou ville manuelle.
- Sources fiables : recherche dans des fiches validées, SANS IA générative.
- Paramètres : 8 réglages (langue, lieu, objectif, niveau de connaissance, heure des rappels, thèmes préférés, affichage des textes, méthode de calcul des prières).
- Compte : e-mail + mot de passe.
- Sadaqa : soutien au projet et dons vers des organisations.
Règles permanentes du projet : jamais de texte religieux inventé ou modifié, jamais de fausses données, jamais de fonction décorative.

CRITÈRE DE RÉUSSITE
Je peux ouvrir l'app sur ordinateur et téléphone, toucher chacun des 6 boutons, arriver sur la bonne page, voir clairement quelle section est ouverte, et je ne vois aucun faux contenu ni bouton inutile.
Quand tu as fini, liste précisément les fichiers créés et indique tout ce que tu n'as pas pu faire ou vérifier.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e22b753f-e3ac-4d69-a972-0d8b2b702080).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
