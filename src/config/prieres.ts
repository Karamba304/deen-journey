export const PRAYER_API_BASE = "https://api.aladhan.com/v1";
export const PRAYER_API_TIMEOUT_MS = 10_000;
/** Désactive l'interface, le réseau et la géolocalisation sans retirer le code. */
export const AFFICHER_HORAIRES_CALCULES = false;

/** Réglage de l'application (méthode personnalisée AlAdhan 99). */
export const ANGLE_FAJR = 17.5;
export const ANGLE_ISHA = 15;
export const AJUSTEMENT_MAGHRIB_MINUTES = 4;
/** Garde-fou : false = retour à la méthode 12 par défaut. */
export const UTILISER_REGLAGE_APP_PAR_DEFAUT = true;

/** Identifiant interne du réglage de l'application (jamais envoyé tel quel : l'appel utilise method=99). */
export const APP_SETTING_ID = -1;
export const CUSTOM_API_METHOD = 99;

/** Choix provisoire en attendant la page Paramètres, pas une référence religieuse. */
export const DEFAULT_METHOD_ID = UTILISER_REGLAGE_APP_PAR_DEFAUT ? APP_SETTING_ID : 12;

export const CALCULATION_METHODS = [
  { id: APP_SETTING_ID, name: "app" },
  { id: 0, name: "Shia Ithna-Ashari (Leva Institute, Qum)" },
  { id: 1, name: "University of Islamic Sciences, Karachi" },
  { id: 2, name: "Islamic Society of North America (ISNA)" },
  { id: 3, name: "Muslim World League" },
  { id: 4, name: "Umm Al-Qura University, Makkah" },
  { id: 5, name: "Egyptian General Authority of Survey" },
  { id: 7, name: "Institute of Geophysics, University of Tehran" },
  { id: 8, name: "Gulf Region" },
  { id: 9, name: "Kuwait" },
  { id: 10, name: "Qatar" },
  { id: 11, name: "Majlis Ugama Islam Singapura" },
  { id: 12, name: "Union Organization Islamic de France" },
  { id: 13, name: "Diyanet İşleri Başkanlığı, Turkey" },
  { id: 14, name: "Spiritual Administration of Muslims of Russia" },
  { id: 16, name: "Dubai" },
  { id: 17, name: "JAKIM (Malaisie)" },
  { id: 18, name: "Tunisia" },
  { id: 19, name: "Algeria" },
  { id: 20, name: "Kementerian Agama (Indonésie)" },
  { id: 21, name: "Morocco" },
  { id: 22, name: "Comunidade Islamica de Lisboa" },
  { id: 23, name: "Ministry of Awqaf (Jordanie)" },
] as const;

export const PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
export type PrayerKey = (typeof PRAYER_KEYS)[number];

export const CITY_MAX_LENGTH = 100;
