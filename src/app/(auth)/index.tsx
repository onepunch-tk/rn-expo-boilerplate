import { useEffect } from "react";
import { Button, Text, View } from "react-native";
import { SupabaseAuthHelper } from "@/helpers/supabase";

export default function Page() {
	useEffect(() => {
		SupabaseAuthHelper.configureGoogleSignIn();
	}, []);

	async function handleSignInWithGoogle() {
		const { success, error, data } =
			await SupabaseAuthHelper.signInWithGoogle();
		if (success) {
			console.log(data);
		} else {
			console.log(error);
		}
	}
	return (
		<View>
			<Button title="Sign in with Google" onPress={handleSignInWithGoogle} />
		</View>
	);
}
