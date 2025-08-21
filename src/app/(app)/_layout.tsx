import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Layout() {
	const { authUser } = useAuth();
	if (!authUser) {
		return <Redirect href="/(auth)" />;
	}
	return <Stack screenOptions={{ headerShown: true }} />;
}
