import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { storage } from "@/helpers/storage";
import "~/global.css";
import { useMMKVDevTools } from "@dev-plugins/react-native-mmkv";
import { useEffect } from "react";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { CrashlyticsHelper } from "@/helpers/crashlytics";

export default function RootLayout() {
	if (__DEV__) {
		// biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
		useMMKVDevTools({ storage: storage });
	}

	// 앱 시작 시 Crashlytics 초기화
	useEffect(() => {
		async function initCrashlytics() {
			try {
				await CrashlyticsHelper.initialize();
			} catch (error) {
				console.error("Error initialize crashlytics: ", error);
			}
		}

		initCrashlytics();
	}, []);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<AuthProvider>
				<AppProvider>
					<Stack />
				</AppProvider>
			</AuthProvider>
		</GestureHandlerRootView>
	);
}
