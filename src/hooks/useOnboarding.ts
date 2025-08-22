import { useEffect, useState } from "react";
import { ONBOARDING_KEY } from "@/constants/onboarding";
import { StorageHelper } from "@/helpers/storage";

export function useOnboarding() {
	const [isLoading, setIsLoading] = useState(true);
	const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: dev mode only
	useEffect(() => {
		checkOnboarding();
	}, []);

	async function checkOnboarding() {
		try {
			const status = await StorageHelper.getItem(ONBOARDING_KEY);
			setHasSeenOnboarding(!!status);
		} catch (error) {
			console.error("Error checking onboarding status:", error);
		} finally {
			setIsLoading(false);
		}
	}

	return {
		isLoading,
		hasSeenOnboarding,
	};
}
