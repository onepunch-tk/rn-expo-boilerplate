import { useEffect, useState } from "react";
import { useMMKVBoolean } from "react-native-mmkv";
import { ONBOARDING_KEY } from "@/constants/onboarding";
import { storage } from "@/helpers/storage";

export function useOnboarding() {
	const [isLoading, setIsLoading] = useState(true);
	const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		checkOnboarding();
	}, []);

	async function checkOnboarding() {
		try {
			const status = storage.getBoolean(ONBOARDING_KEY);
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
