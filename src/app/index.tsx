import { Redirect } from "expo-router";
import { LoadingScreen } from "@/components/LoadingScreen";
import { OnboardingScreen } from "@/components/OnboardingScreen";
import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/hooks/useOnboarding";

export default function Index() {
	const { isLoading: isLoadingOnboarding, hasSeenOnboarding } = useOnboarding();
	const { authUser, isLoading: isLoadingAuth } = useAuth();

	if (isLoadingAuth || isLoadingOnboarding) {
		return <LoadingScreen />;
	}

	if (!hasSeenOnboarding) {
		return <OnboardingScreen />;
	}

	if (!authUser) {
		return <Redirect href={"/(auth)"} />;
	}

	return <Redirect href={"/(app)"} />;
}
