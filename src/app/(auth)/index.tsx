import { Text, TouchableOpacity, View } from "react-native";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/context/AuthContext";
import { SupabaseAuthHelper } from "@/helpers/supabase";

export default function Page() {
	const { setIsAuthLoading, isAuthLoading } = useAuth();

	async function handleLoginWithKakaoTalk() {
		setIsAuthLoading(true);
		await SupabaseAuthHelper.signInWithKakao();
	}

	async function handleLoginWithGoogle() {
		setIsAuthLoading(true);
		await SupabaseAuthHelper.signInWithGoogle();
	}

	if (isAuthLoading) {
		return <LoadingScreen />;
	}

	return (
		<View className="flex-1 justify-center items-center">
			<TouchableOpacity
				className="bg-black p-4 rounded-md"
				onPress={handleLoginWithKakaoTalk}
			>
				<Text className="text-white">SignIn With Kakao</Text>
			</TouchableOpacity>
			<TouchableOpacity
				className="bg-black p-4 rounded-md"
				onPress={handleLoginWithGoogle}
			>
				<Text className="text-white">SignIn With Google</Text>
			</TouchableOpacity>
		</View>
	);
}
