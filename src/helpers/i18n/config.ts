import { getLocales } from "expo-localization";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";

//import translations
import translationsAr from "./locales/ar.json";
import translationsEn from "./locales/en.json";
import translationsKo from "./locales/ko.json";

export const defaultNS = "translation";
export const resources = {
	en: {
		[defaultNS]: translationsEn,
	},
	ko: {
		[defaultNS]: translationsKo,
	},
	ar: {
		[defaultNS]: translationsAr,
	},
} as const;

const deviceLanguage = getLocales()[0].languageCode;

// Initialize i18next
i18next.use(initReactI18next).init({
	resources,
	lng: deviceLanguage || "ko",
	fallbackLng: {
		"en-*": ["en"],
		"ko-*": ["ko"],
		"ar-*": ["ar"],
		default: ["ko"],
	},

	// Debug mode for development
	debug: __DEV__, // Only debug in development

	// Default namespace
	defaultNS,
});

// Handle RTL languages
const isRTL =
	deviceLanguage === "ar" || getLocales()[0].textDirection === "rtl";
I18nManager.allowRTL(isRTL);
I18nManager.forceRTL(isRTL);

// Function to change language
export const changeLanguage = (lang: string) => {
	i18next.changeLanguage(lang, (err, t) => {
		if (err) {
			if (__DEV__) {
				console.error("Error changing language:", err);
			}
			return;
		}

		// Handle RTL for the new language
		const isRTL = lang === "ar";
		I18nManager.allowRTL(isRTL);
		I18nManager.forceRTL(isRTL);
	});
};

// Get current language
export const getCurrentLanguage = () => {
	return i18next.language;
};

// Check if current language is RTL
export const isRTLLanguage = () => {
	return i18next.language === "ar";
};

export default i18next;
