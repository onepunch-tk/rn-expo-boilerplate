import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAppContext } from "@/context/AppContext";

export default function HomePage() {
	const { colorScheme, setColorScheme } = useAppContext();

	function toggleColorScheme() {
		setColorScheme(colorScheme === "dark" ? "light" : "dark");
	}

	// 유용한 링크 URL들
	const documentationLinks = {
		expo: "https://docs.expo.dev/",
		supabase: "https://supabase.com/docs",
		nativewind: "https://www.nativewind.dev/",
		reanimated: "https://docs.swmansion.com/react-native-reanimated/",
		kakao: "https://developers.kakao.com/",
	};

	// 링크 열기 핸들러
	async function handleOpenLink(url: string) {
		try {
			await WebBrowser.openBrowserAsync(url);
		} catch (error) {
			console.error("링크 열기 실패:", error);
		}
	}

	return (
		<>
			<Stack.Screen
				options={{
					headerBackVisible: false,
					title: "Welcome",
					headerStyle: {
						backgroundColor: colorScheme === "dark" ? "#111827" : "#fff",
					},
					headerTintColor: colorScheme === "dark" ? "#fff" : "#000",
					headerRight: () => (
						<TouchableOpacity onPress={toggleColorScheme} className="mr-4 p-2">
							<Feather
								name={colorScheme === "dark" ? "sun" : "moon"}
								size={20}
								color={colorScheme === "dark" ? "#fbbf24" : "#6b7280"}
							/>
						</TouchableOpacity>
					),
				}}
			/>
			<ScrollView className="flex-1 bg-white dark:bg-gray-900">
				<View className="flex-1 px-6 py-8">
					{/* Welcome Section */}
					<View className="mb-8">
						<Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
							React Native Expo 🚀
						</Text>
						<Text className="text-lg text-gray-600 dark:text-gray-300">
							빠른 시작을 위한 Expo Start Kit
						</Text>
					</View>

					{/* Core Features */}
					<View className="mb-8">
						<Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
							핵심 기능
						</Text>

						<View className="space-y-3 gap-y-1">
							{/* Authentication */}
							<View className="flex-row items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
								<View className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg items-center justify-center mr-3">
									<Feather className="text-green-500 text-2xl" name="shield" />
								</View>
								<View className="flex-1">
									<Text className="font-semibold text-gray-900 dark:text-white">
										인증 시스템
									</Text>
									<Text className="text-sm text-gray-600 dark:text-gray-400">
										Supabase + 카카오/Google
									</Text>
								</View>
							</View>

							{/* Onboarding */}
							<View className="flex-row items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
								<View className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg items-center justify-center mr-3">
									<Feather className="text-blue-500 text-2xl" name="users" />
								</View>
								<View className="flex-1">
									<Text className="font-semibold text-gray-900 dark:text-white">
										온보딩
									</Text>
									<Text className="text-sm text-gray-600 dark:text-gray-400">
										스와이프 인터랙션
									</Text>
								</View>
							</View>

							{/* Storage */}
							<View className="flex-row items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
								<View className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg items-center justify-center mr-3">
									<Feather
										className="text-purple-500 text-2xl"
										name="database"
									/>
								</View>
								<View className="flex-1">
									<Text className="font-semibold text-gray-900 dark:text-white">
										로컬 스토리지
									</Text>
									<Text className="text-sm text-gray-600 dark:text-gray-400">
										MMKV 고성능
									</Text>
								</View>
							</View>

							{/* Styling */}
							<View className="flex-row items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
								<View className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg items-center justify-center mr-3">
									<Feather className="text-orange-500 text-2xl" name="layout" />
								</View>
								<View className="flex-1">
									<Text className="font-semibold text-gray-900 dark:text-white">
										스타일링
									</Text>
									<Text className="text-sm text-gray-600 dark:text-gray-400">
										NativeWind (TailwindCSS)
									</Text>
								</View>
							</View>

							{/* Animation */}
							<View className="flex-row items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
								<View className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg items-center justify-center mr-3">
									<Feather className="text-pink-500 text-2xl" name="zap" />
								</View>
								<View className="flex-1">
									<Text className="font-semibold text-gray-900 dark:text-white">
										애니메이션
									</Text>
									<Text className="text-sm text-gray-600 dark:text-gray-400">
										React Native Reanimated
									</Text>
								</View>
							</View>

							{/* Error Tracking */}
							<View className="flex-row items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
								<View className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg items-center justify-center mr-3">
									<Feather
										className="text-red-500 text-2xl"
										name="alert-circle"
									/>
								</View>
								<View className="flex-1">
									<Text className="font-semibold text-gray-900 dark:text-white">
										에러 추적
									</Text>
									<Text className="text-sm text-gray-600 dark:text-gray-400">
										Firebase Crashlytics
									</Text>
								</View>
							</View>
						</View>
					</View>

					{/* Useful Links */}
					<View className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
						<View className="flex-row items-center mb-4">
							<Feather className="text-gray-500 text-xl" name="link" />
							<Text className="text-lg font-bold text-gray-900 dark:text-white ml-3">
								유용한 링크
							</Text>
						</View>

						<View className="space-y-3">
							<TouchableOpacity
								className="flex-row items-center justify-between py-2"
								onPress={() => handleOpenLink(documentationLinks.expo)}
							>
								<View className="flex-row items-center">
									<Feather className="text-blue-500 text-lg" name="book" />
									<Text className="text-sm font-medium text-gray-800 dark:text-gray-200 ml-3">
										Expo 53 문서
									</Text>
								</View>
								<Feather name="external-link" size={14} color="#9ca3af" />
							</TouchableOpacity>

							<TouchableOpacity
								className="flex-row items-center justify-between py-2"
								onPress={() => handleOpenLink(documentationLinks.supabase)}
							>
								<View className="flex-row items-center">
									<Feather className="text-green-500 text-lg" name="database" />
									<Text className="text-sm font-medium text-gray-800 dark:text-gray-200 ml-3">
										Supabase 가이드
									</Text>
								</View>
								<Feather name="external-link" size={14} color="#9ca3af" />
							</TouchableOpacity>

							<TouchableOpacity
								className="flex-row items-center justify-between py-2"
								onPress={() => handleOpenLink(documentationLinks.nativewind)}
							>
								<View className="flex-row items-center">
									<Feather className="text-orange-500 text-lg" name="layout" />
									<Text className="text-sm font-medium text-gray-800 dark:text-gray-200 ml-3">
										NativeWind 문서
									</Text>
								</View>
								<Feather name="external-link" size={14} color="#9ca3af" />
							</TouchableOpacity>

							<TouchableOpacity
								className="flex-row items-center justify-between py-2"
								onPress={() => handleOpenLink(documentationLinks.reanimated)}
							>
								<View className="flex-row items-center">
									<Feather className="text-pink-500 text-lg" name="zap" />
									<Text className="text-sm font-medium text-gray-800 dark:text-gray-200 ml-3">
										Reanimated 3
									</Text>
								</View>
								<Feather name="external-link" size={14} color="#9ca3af" />
							</TouchableOpacity>

							<TouchableOpacity
								className="flex-row items-center justify-between py-2"
								onPress={() => handleOpenLink(documentationLinks.kakao)}
							>
								<View className="flex-row items-center">
									<Feather
										className="text-purple-500 text-lg"
										name="message-circle"
									/>
									<Text className="text-sm font-medium text-gray-800 dark:text-gray-200 ml-3">
										Kakao Developers
									</Text>
								</View>
								<Feather name="external-link" size={14} color="#9ca3af" />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>
			<StatusBar
				style={
					colorScheme === "system"
						? "auto"
						: colorScheme === "dark"
							? "light"
							: "dark"
				}
			/>
		</>
	);
}
