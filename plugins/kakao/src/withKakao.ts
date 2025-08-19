import { type ConfigPlugin, withInfoPlist } from "@expo/config-plugins";

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
		config = withKakaoIOS(config, { nativeAppKey });
	}

	if (androidEnabled) {
	}

	return config;
};

const withKakaoIOS: ConfigPlugin<{ nativeAppKey: string }> = (
	config,
	{ nativeAppKey },
) => {
	config = withInfoPlist(config, (config) => {
		if (!config.modResults.LSApplicationQueriesSchemes) {
			config.modResults.LSApplicationQueriesSchemes = [];
		}

		if (!config.modResults.CFBundleURLTypes) {
			config.modResults.CFBundleURLTypes = [];
		}

		if (
			!config.modResults.LSApplicationQueriesSchemes.includes(
				"kakaokompassauth",
			)
		) {
			config.modResults.LSApplicationQueriesSchemes.push("kakaokompassauth");
		}

		// Kakao URL Scheme 관리 (기존 kakao scheme 제거 후 새로 추가)
		const expectedScheme = `kakao${nativeAppKey}`;

		// 기존 kakao로 시작하는 모든 scheme 제거
		config.modResults.CFBundleURLTypes.forEach((urlType) => {
			if (urlType.CFBundleURLSchemes) {
				urlType.CFBundleURLSchemes = urlType.CFBundleURLSchemes.filter(
					(scheme) => !scheme?.startsWith("kakao"),
				);
			}
		});

		// 빈 URLTypes 제거
		config.modResults.CFBundleURLTypes =
			config.modResults.CFBundleURLTypes.filter(
				(urlType) =>
					urlType.CFBundleURLSchemes && urlType.CFBundleURLSchemes.length > 0,
			);

		// 새로운 Kakao scheme 추가
		config.modResults.CFBundleURLTypes.push({
			CFBundleURLSchemes: [expectedScheme],
			CFBundleURLName: "kakao",
		});

		return config;
	});
	return config;
};
