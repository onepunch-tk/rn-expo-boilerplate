import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAppContext } from "@/context/AppContext";
import { changeLanguage, getCurrentLanguage } from "@/helpers/i18n/config";
import { SupabaseAuthHelper } from "@/helpers/supabase/SupabaeAuthHelper";

// 지원 언어 목록
const SUPPORTED_LANGUAGES = [
	{ code: "ko", name: "한국어", flag: "🇰🇷" },
	{ code: "en", name: "English", flag: "🇺🇸" },
	{ code: "ar", name: "العربية", flag: "🇸🇦" },
];

export default function HomePage() {
	const { t } = useTranslation();
	const { colorScheme, setColorScheme } = useAppContext();
	const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);

	function toggleColorScheme() {
		setColorScheme(colorScheme === "dark" ? "light" : "dark");
	}

	// 언어 변경 핸들러
	function handleLanguageChange(langCode: string) {
		changeLanguage(langCode);
		setIsLanguageModalVisible(false);
	}

	// 현재 언어 정보 가져오기
	function getCurrentLanguageInfo() {
		const currentLang = getCurrentLanguage();
		return (
			SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLang) ||
			SUPPORTED_LANGUAGES[0]
		);
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
			console.error(error);
		}
	}

	// 로그아웃 핸들러
	async function handleLogout() {
		try {
			const { error } = await SupabaseAuthHelper.signOut();
			if (error) {
				console.error(t("errors.logoutFailed"), error.message);
				// TODO: 사용자에게 에러 메시지 표시
			} else {
				console.log(t("errors.logoutSuccess"));
			}
		} catch (error) {
			console.error(t("errors.logoutError"), error);
		}
	}

	return (
		<>
			<Stack.Screen
				options={{
					headerBackVisible: false,
					title: t("common.welcome"),
					headerStyle: {
						backgroundColor: colorScheme === "dark" ? "#111827" : "#fff",
					},
					headerTintColor: colorScheme === "dark" ? "#fff" : "#000",
					headerRight: () => {
						const currentLangInfo = getCurrentLanguageInfo();
						return (
							<View className="flex-row items-center">
								{/* 언어 변경 버튼 */}
								<TouchableOpacity
									onPress={() => setIsLanguageModalVisible(true)}
									className="mr-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex-row items-center"
								>
									<Text className="text-sm mr-1">{currentLangInfo.flag}</Text>
									<Text className="text-xs font-semibold text-gray-700 dark:text-gray-200">
										{currentLangInfo.code.toUpperCase()}
									</Text>
									<Feather
										name="chevron-down"
										size={12}
										color={colorScheme === "dark" ? "#d1d5db" : "#374151"}
										style={{ marginLeft: 2 }}
									/>
								</TouchableOpacity>

								{/* 컬러 스킴 변경 버튼 */}
								<TouchableOpacity
									onPress={toggleColorScheme}
									className="mr-4 p-2"
								>
									<Feather
										name={colorScheme === "dark" ? "sun" : "moon"}
										size={20}
										color={colorScheme === "dark" ? "#fbbf24" : "#6b7280"}
									/>
								</TouchableOpacity>
							</View>
						);
					},
				}}
			/>
			<ScrollView className="flex-1 bg-white dark:bg-gray-900">
				<View className="flex-1 px-6 py-8">
					{/* Welcome Section */}
					<View className="mb-8">
						<Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
							{t("home.title")}
						</Text>
						<Text className="text-lg text-gray-600 dark:text-gray-300">
							{t("home.subtitle")}
						</Text>
					</View>

					{/* Account Section */}
					<View className="mb-8">
						<Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
							{t("home.account")}
						</Text>

						<TouchableOpacity
							className="flex-row items-center bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800"
							onPress={handleLogout}
						>
							<View className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg items-center justify-center mr-3">
								<Feather className="text-red-500 text-2xl" name="log-out" />
							</View>
							<View className="flex-1">
								<Text className="font-semibold text-red-900 dark:text-red-100">
									{t("common.logout")}
								</Text>
								<Text className="text-sm text-red-700 dark:text-red-200">
									{t("home.logoutDescription")}
								</Text>
							</View>
						</TouchableOpacity>
					</View>

					{/* Core Features */}
					<View className="mb-8">
						<Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
							{t("home.coreFeatures")}
						</Text>

						<View className="space-y-3 gap-y-1">
							{/* Authentication */}
							<View className="flex-row items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
								<View className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg items-center justify-center mr-3">
									<Feather className="text-green-500 text-2xl" name="shield" />
								</View>
								<View className="flex-1">
									<Text className="font-semibold text-gray-900 dark:text-white">
										{t("home.features.authentication.title")}
									</Text>
									<Text className="text-sm text-gray-600 dark:text-gray-400">
										{t("home.features.authentication.description")}
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
										{t("home.features.onboarding.title")}
									</Text>
									<Text className="text-sm text-gray-600 dark:text-gray-400">
										{t("home.features.onboarding.description")}
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
										{t("home.features.storage.title")}
									</Text>
									<Text className="text-sm text-gray-600 dark:text-gray-400">
										{t("home.features.storage.description")}
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
										{t("home.features.styling.title")}
									</Text>
									<Text className="text-sm text-gray-600 dark:text-gray-400">
										{t("home.features.styling.description")}
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
										{t("home.features.animation.title")}
									</Text>
									<Text className="text-sm text-gray-600 dark:text-gray-400">
										{t("home.features.animation.description")}
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
										{t("home.features.errorTracking.title")}
									</Text>
									<Text className="text-sm text-gray-600 dark:text-gray-400">
										{t("home.features.errorTracking.description")}
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
								{t("common.usefulLinks")}
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
										{t("home.links.expo")}
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
										{t("home.links.supabase")}
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
										{t("home.links.nativewind")}
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
										{t("home.links.reanimated")}
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
										{t("home.links.kakao")}
									</Text>
								</View>
								<Feather name="external-link" size={14} color="#9ca3af" />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>

			{/* 언어 선택 모달 */}
			<Modal
				animationType="fade"
				transparent={true}
				visible={isLanguageModalVisible}
				onRequestClose={() => setIsLanguageModalVisible(false)}
			>
				<TouchableOpacity
					className="flex-1 bg-black/50 justify-center items-center"
					activeOpacity={1}
					onPress={() => setIsLanguageModalVisible(false)}
				>
					<View className="bg-white dark:bg-gray-800 rounded-xl mx-8 py-4 shadow-lg">
						<Text className="text-lg font-bold text-gray-900 dark:text-white text-center mb-4 px-6">
							{t("common.selectLanguage") || "언어 선택"}
						</Text>

						{SUPPORTED_LANGUAGES.map((language) => {
							const isSelected = getCurrentLanguage() === language.code;
							return (
								<TouchableOpacity
									key={language.code}
									onPress={() => handleLanguageChange(language.code)}
									className={`flex-row items-center px-6 py-3 ${
										isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""
									}`}
								>
									<Text className="text-2xl mr-3">{language.flag}</Text>
									<Text
										className={`flex-1 text-base ${
											isSelected
												? "font-semibold text-blue-600 dark:text-blue-400"
												: "text-gray-700 dark:text-gray-200"
										}`}
									>
										{language.name}
									</Text>
									{isSelected && (
										<Feather
											name="check"
											size={20}
											color={colorScheme === "dark" ? "#60a5fa" : "#2563eb"}
										/>
									)}
								</TouchableOpacity>
							);
						})}
					</View>
				</TouchableOpacity>
			</Modal>

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
