import { colorScheme } from "nativewind";
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { StorageHelper } from "@/helpers/storage";
import type { AppContextType, ColorSchemeType } from "@/types/app";

const COLOR_SCHEME_KEY = "color_scheme";

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: PropsWithChildren) {
	const [userColorScheme, setUserColorScheme] =
		useState<ColorSchemeType>("dark");

	useEffect(() => {
		async function initColorScheme() {
			try {
				const storedScheme = await StorageHelper.getItem(COLOR_SCHEME_KEY);
				console.log("storedScheme", storedScheme);
				if (storedScheme) {
					setUserColorScheme(storedScheme as ColorSchemeType);
					colorScheme.set(storedScheme as ColorSchemeType);
				}
			} catch (error) {
				if (__DEV__) {
					console.error("Error initializing color scheme:", error);
				}
				// TODO: Firebase Crashlytics 추가 예정
			}
		}
		initColorScheme();
	}, []);
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
		}
	}
	return (
		<AppContext value={{ colorScheme: userColorScheme, setColorScheme }}>
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
