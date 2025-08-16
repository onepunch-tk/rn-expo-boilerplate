import "~/global.css";
import { useMMKVDevTools } from "@dev-plugins/react-native-mmkv";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { CrashlyticsHelper } from "@/helpers/crashlytics";
import { storage } from "@/helpers/storage";

export default function RootLayout() {
	if (__DEV__) {
		// biome-ignore lint/correctness/useHookAtTopLevel: dev mode only
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
