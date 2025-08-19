import { Text, TouchableOpacity, View } from "react-native";
import { SupabaseAuthHelper } from "@/helpers/supabase";

export default function Page() {
	async function handleLoginWithKakaoTalk() {
		await SupabaseAuthHelper.signInWithKakao();
	}

	async function handleLoginWithGoogle() {
		await SupabaseAuthHelper.signInWithGoogle();
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
