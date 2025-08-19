import { type ConfigPlugin } from "@expo/config-plugins";
/**
 * Kakao Android SDK 설정을 위한 메인 플러그인
 * @param config Expo 설정 객체
 * @param nativeAppKey Kakao Native App Key
 * @returns 수정된 Expo 설정 객체
 */
export declare const withAndroid: ConfigPlugin<{
    nativeAppKey: string;
}>;
