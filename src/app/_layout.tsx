import "~/global.css";
import { useMMKVDevTools } from "@dev-plugins/react-native-mmkv";
import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { cssInterop } from "nativewind";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { CrashlyticsHelper } from "@/helpers/crashlytics";
import { storage } from "@/helpers/storage";
import { SupabaseAuthHelper } from "@/helpers/supabase/SupabaeAuthHelper";
import KakaoCoreModule from "~/modules/kakao-core";

// 기타 Element 사용 시 className 사용 가능하도록 설정
cssInterop(Feather, { className: { target: "style" } });

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
				if (__DEV__) {
					console.error("Error initialize crashlytics: ", error);
				}
			}
		}
		initCrashlytics();
	}, []);

	// 앱 시작 시 Kakao SDK 초기화 및 Google SignIn 설정
	useEffect(() => {
		SupabaseAuthHelper.initializeKakaoSDK();
		SupabaseAuthHelper.configureGoogleSignIn();
		if (Platform.OS === "android" && __DEV__) {
			const keyHash = KakaoCoreModule.getKeyHash();
			console.log("keyHash: ", keyHash);
		}
	}, []);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<AuthProvider>
				<AppProvider>
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name={"(app)"} options={{ animation: "none" }} />
						<Stack.Screen name={"(auth)"} options={{ animation: "none" }} />
					</Stack>
				</AppProvider>
			</AuthProvider>
		</GestureHandlerRootView>
	);
}
