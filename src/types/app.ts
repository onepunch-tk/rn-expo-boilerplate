export type ColorSchemeType = "light" | "dark" | "system";

export interface AppContextType {
	colorScheme: ColorSchemeType;
	setColorScheme: (value: ColorSchemeType) => void;
}
