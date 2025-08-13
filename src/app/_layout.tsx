import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { storage } from "@/helpers/storage";
import "~/global.css";
import { useMMKVDevTools } from "@dev-plugins/react-native-mmkv";
import { AppProvider } from "@/context/AppContext";

export default function RootLayout() {
	if (__DEV__) {
		// biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
		useMMKVDevTools({ storage: storage });
	}
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<AppProvider>
				<Stack />
			</AppProvider>
		</GestureHandlerRootView>
	);
}
