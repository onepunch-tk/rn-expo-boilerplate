import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Layout() {
	const { authUser } = useAuth();
	if (authUser) {
		return <Redirect href="/(app)" />;
	}
	return <Stack screenOptions={{ headerShown: false }} />;
}
