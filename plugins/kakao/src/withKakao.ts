import { type ConfigPlugin, withInfoPlist } from "@expo/config-plugins";
import { withAndroid } from "./withAndroid";
import { withIOS } from "./withIOS";

export const withKakao: ConfigPlugin<{
	nativeAppKey: string;
	iosEnabled?: boolean;
	androidEnabled?: boolean;
}> = (config, { nativeAppKey, iosEnabled, androidEnabled }) => {
	if (!nativeAppKey) {
		throw new Error(
			"[Social Login Plugin] 'nativeAppKey' is required. Please provide a valid Kakao Native App Key.",
		);
	}

	if (iosEnabled) {
		config = withIOS(config, { nativeAppKey });
	}

	if (androidEnabled) {
		config = withAndroid(config, { nativeAppKey });
	}

	return config;
};
