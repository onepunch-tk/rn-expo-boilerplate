"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withKakao = void 0;
const withAndroid_1 = require("./withAndroid");
const withIOS_1 = require("./withIOS");
const withKakao = (config, { nativeAppKey, iosEnabled, androidEnabled }) => {
    if (!nativeAppKey) {
        throw new Error("[Social Login Plugin] 'nativeAppKey' is required. Please provide a valid Kakao Native App Key.");
    }
    if (iosEnabled) {
        config = (0, withIOS_1.withIOS)(config, { nativeAppKey });
    }
    if (androidEnabled) {
        config = (0, withAndroid_1.withAndroid)(config, { nativeAppKey });
    }
    return config;
};
exports.withKakao = withKakao;
