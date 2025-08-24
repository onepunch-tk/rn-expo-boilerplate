import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { SupabaseAuthHelper } from "@/helpers/supabase/SupabaeAuthHelper";
import FacebookLogo from "~/assets/images/brand-logo/facebook.svg";
import GoogleLogo from "~/assets/images/brand-logo/google.svg";
import KakaoTalkLogo from "~/assets/images/brand-logo/kakaotalk.svg";

export default function Page() {
	const { t } = useTranslation();
	const { setIsAuthLoading, isAuthLoading } = useAuth();
	const { colorScheme } = useAppContext();

	async function handleSocialSignin(provider: "kakao" | "google") {
		setIsAuthLoading(true);
		switch (provider) {
			case "kakao":
				await SupabaseAuthHelper.signInWithKakao();
				break;
			case "google":
				await SupabaseAuthHelper.signInWithGoogle();
				break;
		}
	}

	if (isAuthLoading) {
		return <LoadingScreen />;
	}

	return (
		<>
			<View className="flex-1 bg-white dark:bg-gray-900 px-10">
				<View className="flex-1 px-6 py-8 justify-center min-h-screen">
					{/* Welcome Section */}
					<View className="mb-8 items-center">
						<Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
							{t("auth.welcomeMessage")}
						</Text>
						<Text className="text-lg text-gray-600 dark:text-gray-300 text-center">
							{t("auth.loginPrompt")}
						</Text>
					</View>

					<View className="gap-y-4">
						{/* Kakao Login */}
						<View className="w-full bg-[#FFCD00] px-2 py-1 rounded-2xl border-2 border-[#FEE500]">
							<TouchableOpacity
								className="flex-row"
								onPress={() => handleSocialSignin("kakao")}
							>
								<View className="bg-[#FFCD00] rounded-full p-1 justify-center items-center w-[50px] h-[50px]">
									<KakaoTalkLogo fill={"black"} width={50} height={50} />
								</View>
								<View className="flex-1 justify-center items-center">
									<Text className="text-black font-semibold text-lg">
										{t("auth.socialLogin.kakao")}
									</Text>
								</View>
							</TouchableOpacity>
						</View>

						{/* Google Login */}
						<View className="w-full bg-white px-2 py-1 rounded-2xl border-2 border-[#4285F4] dark:bg-gray-800 dark:border-[#4285F4]">
							<TouchableOpacity
								className="flex-row"
								onPress={() => handleSocialSignin("google")}
							>
								<View className="items-center rounded-full p-1 justify-center w-[50px] h-[50px]">
									<GoogleLogo width={40} height={40} />
								</View>
								<View className="flex-1 justify-center items-center">
									<Text className="text-black dark:text-white font-semibold text-lg">
										{t("auth.socialLogin.google")}
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
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
