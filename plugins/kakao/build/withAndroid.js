"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAndroid = void 0;
const config_plugins_1 = require("@expo/config-plugins");
/**
 * Android 인터넷 권한 추가
 * @see https://developers.kakao.com/docs/latest/ko/android/getting-started#project-settings-internet-permission
 */
const withKakaoInternetPermission = (config) => {
    return (0, config_plugins_1.withAndroidManifest)(config, (config) => {
        // 인터넷 권한이 이미 있는지 확인
        const permissions = config.modResults.manifest["uses-permission"] || [];
        const hasInternetPermission = permissions.some((permission) => permission.$?.["android:name"] === "android.permission.INTERNET");
        if (!hasInternetPermission) {
            // 인터넷 권한 추가
            if (!config.modResults.manifest["uses-permission"]) {
                config.modResults.manifest["uses-permission"] = [];
            }
            config.modResults.manifest["uses-permission"].push({
                $: { "android:name": "android.permission.INTERNET" },
            });
        }
        return config;
    });
};
/**
 * Kakao SDK 초기화를 위한 Native App Key 설정
 * @see https://developers.kakao.com/docs/latest/ko/android/getting-started#init
 */
const withKakaoNativeAppKey = (config, { nativeAppKey }) => {
    return (0, config_plugins_1.withAndroidManifest)(config, (config) => {
        const mainApplication = config_plugins_1.AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
        const name = "com.kakao.sdk.auth.AuthCodeHandlerActivity";
        mainApplication.activity?.push({
            $: {
                "android:name": name,
                "android:exported": "true",
            },
            "intent-filter": [
                {
                    action: [
                        {
                            $: { "android:name": "android.intent.action.VIEW" },
                        },
                    ],
                    category: [
                        {
                            $: { "android:name": "android.intent.category.DEFAULT" },
                        },
                        {
                            $: { "android:name": "android.intent.category.BROWSABLE" },
                        },
                    ],
                    data: [
                        {
                            $: {
                                "android:host": "oauth",
                                "android:scheme": `kakao${nativeAppKey}`,
                            },
                        },
                    ],
                },
            ],
        });
        return config;
    });
};
/**
 * Kakao Android SDK 설정을 위한 메인 플러그인
 * @param config Expo 설정 객체
 * @param nativeAppKey Kakao Native App Key
 * @returns 수정된 Expo 설정 객체
 */
const withAndroid = (config, { nativeAppKey }) => {
    if (!nativeAppKey) {
        throw new Error("[Kakao Android Plugin] 'nativeAppKey' is required. Please provide a valid Kakao Native App Key.");
    }
    // 1. 인터넷 권한 추가
    config = withKakaoInternetPermission(config);
    // 2. Native App Key 설정
    config = withKakaoNativeAppKey(config, { nativeAppKey });
    return config;
};
exports.withAndroid = withAndroid;
