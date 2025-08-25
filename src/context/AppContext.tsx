import { getLocales } from "expo-localization";
import { colorScheme } from "nativewind";
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { CrashlyticsHelper } from "@/helpers/crashlytics";
import { changeLanguage } from "@/helpers/i18n/config";
import { StorageHelper } from "@/helpers/storage";
import type { AppContextType, ColorSchemeType } from "@/types/app";

const COLOR_SCHEME_KEY = "color_scheme";
const LANGUAGE_KEY = "language";

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: PropsWithChildren) {
	const [userColorScheme, setUserColorScheme] =
		useState<ColorSchemeType>("dark");
	const [language, setAppLanguage] = useState<string>(
		getLocales()[0].languageCode || "ko",
	);
	// color scheme 초기화
	useEffect(() => {
		async function initColorScheme() {
			try {
				const storedScheme = await StorageHelper.getItem(COLOR_SCHEME_KEY);
				if (storedScheme) {
					setUserColorScheme(storedScheme as ColorSchemeType);
					colorScheme.set(storedScheme as ColorSchemeType);
				}
			} catch (error) {
				if (__DEV__) {
					console.error("Error initializing color scheme:", error);
				}
				// TODO: Firebase Crashlytics 추가 예정
				CrashlyticsHelper.recordError(
					error as Error,
					"APP_COLOR_SCHEME_INIT_FAILED",
				);
			}
		}
		initColorScheme();
	}, []);

	// language 초기화
	useEffect(() => {
		async function initLanguage() {
			try {
				const storedLanguage = await StorageHelper.getItem(LANGUAGE_KEY);
				if (storedLanguage) {
					setAppLanguage(storedLanguage as string);
					changeLanguage(storedLanguage as string);
				}
			} catch (error) {
				if (__DEV__) {
					console.error("Error initializing language:", error);
				}
				CrashlyticsHelper.recordError(
					error as Error,
					"APP_LANGUAGE_INIT_FAILED",
				);
			}
		}
		initLanguage();
	}, []);

	// language 설정
	async function setLanguage(newLanguage: string) {
		try {
			await StorageHelper.setItem(LANGUAGE_KEY, newLanguage);
			setAppLanguage(newLanguage);
			changeLanguage(newLanguage);
		} catch (error) {
			if (__DEV__) {
				console.error("Error setting language:", error);
			}
			CrashlyticsHelper.recordError(
				error as Error,
				"APP_LANGUAGE_UPDATE_FAILED",
			);
		}
	}

	// color scheme 설정
	async function setColorScheme(newScheme: ColorSchemeType) {
		try {
			await StorageHelper.setItem(COLOR_SCHEME_KEY, newScheme);
			setUserColorScheme(newScheme);
			colorScheme.set(newScheme);
		} catch (error) {
			if (__DEV__) {
				console.error("Error setting color scheme:", error);
			}
			// TODO: Firebase Crashlytics 추가 예정
			CrashlyticsHelper.recordError(
				error as Error,
				"APP_COLOR_SCHEME_UPDATE_FAILED",
			);
		}
	}

	return (
		<AppContext
			value={{
				colorScheme: userColorScheme,
				setColorScheme,
				language,
				setLanguage,
			}}
		>
			{children}
		</AppContext>
	);
}

export function useAppContext() {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useAppContext must be used within an AppProvider");
	}
	return context;
}
