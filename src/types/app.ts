export type ColorSchemeType = "light" | "dark" | "system";

export interface AppContextType {
	colorScheme: ColorSchemeType;
	language: string;
	setLanguage: (value: string) => void;
	setColorScheme: (value: ColorSchemeType) => void;
}
