import { Redirect } from "expo-router";
import { LoadingScreen } from "@/components/LoadingScreen";
import { OnboardingScreen } from "@/components/OnboardingScreen";
import { useOnboarding } from "@/hooks/useOnboarding";

export default function Index() {
	const { isLoading: isLoadingOnboarding, hasSeenOnboarding } = useOnboarding();
	if (isLoadingOnboarding) {
		return <LoadingScreen />;
	}

	if (!hasSeenOnboarding) {
		return <OnboardingScreen />;
	}

	return <Redirect href={"/(app)"} />;
}
