import { derived, writable } from "svelte/store";
import type { PublicConfigDto } from "./api";
import type { Language } from "./i18n";

export type ThemePreference = "system" | "light" | "dark";

export const language = writable<Language>("es");
export const themePreference = writable<ThemePreference>("system");
export const ownerData = writable<PublicConfigDto["owner"] | null>(null);
const systemDark = writable(false);

export const resolvedTheme = derived([themePreference, systemDark], ([$themePreference, $systemDark]) => {
  if ($themePreference === "system") {
    return $systemDark ? "dark" : "light";
  }

  return $themePreference;
});

let currentResolvedTheme: "light" | "dark" = "light";
resolvedTheme.subscribe((value) => {
  currentResolvedTheme = value;
});

let initialized = false;

export function initializePreferences(): void {
  if (initialized || typeof window === "undefined") {
    return;
  }

  initialized = true;

  const savedLanguage = localStorage.getItem("doccum-language") as Language | null;
  if (savedLanguage === "es" || savedLanguage === "en") {
    language.set(savedLanguage);
  } else {
    const browserLang = navigator.languages?.find((code) => code.startsWith("en") || code.startsWith("es"));
    language.set(browserLang?.startsWith("en") ? "en" : "es");
  }

  const savedTheme = localStorage.getItem("doccum-theme") as ThemePreference | null;
  if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
    themePreference.set(savedTheme);
  }

  const darkMedia = window.matchMedia("(prefers-color-scheme: dark)");
  systemDark.set(darkMedia.matches);

  const onChange = (event: MediaQueryListEvent) => {
    systemDark.set(event.matches);
  };

  darkMedia.addEventListener("change", onChange);
}

export function setLanguage(next: Language): void {
  language.set(next);

  if (typeof window !== "undefined") {
    localStorage.setItem("doccum-language", next);
  }
}

export function toggleTheme(): void {
  const nextTheme: ThemePreference = currentResolvedTheme === "dark" ? "light" : "dark";

  themePreference.set(nextTheme);

  if (typeof window !== "undefined") {
    localStorage.setItem("doccum-theme", nextTheme);
  }
}
