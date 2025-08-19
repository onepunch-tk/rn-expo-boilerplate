"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withKakao = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const withKakao = (config, { nativeAppKey, iosEnabled, androidEnabled }) => {
    if (!nativeAppKey) {
        throw new Error("[Social Login Plugin] 'nativeAppKey' is required. Please provide a valid Kakao Native App Key.");
    }
    if (iosEnabled) {
        config = withKakaoIOS(config, { nativeAppKey });
    }
    if (androidEnabled) {
    }
    return config;
};
exports.withKakao = withKakao;
const withKakaoIOS = (config, { nativeAppKey }) => {
    config = (0, config_plugins_1.withInfoPlist)(config, (config) => {
        if (!config.modResults.LSApplicationQueriesSchemes) {
            config.modResults.LSApplicationQueriesSchemes = [];
        }
        if (!config.modResults.CFBundleURLTypes) {
            config.modResults.CFBundleURLTypes = [];
        }
        if (!config.modResults.LSApplicationQueriesSchemes.includes("kakaokompassauth")) {
            config.modResults.LSApplicationQueriesSchemes.push("kakaokompassauth");
        }
        if (!config.modResults.CFBundleURLTypes.find((type) => type.CFBundleURLSchemes?.includes(`kakao${nativeAppKey}`))) {
            config.modResults.CFBundleURLTypes.push({
                CFBundleURLSchemes: [`kakao${nativeAppKey}`],
                CFBundleURLName: "kakao",
            });
        }
        return config;
    });
    return config;
};
