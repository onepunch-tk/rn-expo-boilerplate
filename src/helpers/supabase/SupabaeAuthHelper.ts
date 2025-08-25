import { GoogleSignin } from "@react-native-google-signin/google-signin";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import { AUTH_PROVIDERS } from "@/constants/auth";
import KakaoCoreModule from "~/modules/kakao-core/";
import KakaoUserModule from "~/modules/kakao-user";
import { supabase } from "./client";
import {
	convertToFormattedAuthError,
	createFormattedAuthError,
} from "./errorHandler";
import type { Result, SignOutResponse } from "./types";
import { createAuthResult } from "./utils";

WebBrowser.maybeCompleteAuthSession();
const redirectTo = makeRedirectUri();

export const SupabaseAuthHelper = {
	onAuthStateChange(
		callback: (
			event: AuthChangeEvent,
			session: Session | null,
		) => void | Promise<void>,
	) {
		return supabase.auth.onAuthStateChange(callback);
	},
	async getSession() {
		return supabase.auth.getSession();
	},
	configureGoogleSignIn() {
		const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
		if (!googleWebClientId) {
			throw createFormattedAuthError("GOOGLE", "GOOGLE_WEB_CLIENT_ID_NOT_SET");
		}

		GoogleSignin.configure({
			webClientId: googleWebClientId,
		});
	},
	initializeKakaoSDK() {
		const kakaoNativeAppKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;
		if (!kakaoNativeAppKey) {
			throw createFormattedAuthError("KAKAO", "KAKAO_NATIVE_APP_KEY_NOT_SET");
		}

		KakaoCoreModule.initializeKakaoSDK(kakaoNativeAppKey);
	},
	async signInWithGoogle(): Promise<Result<{ user: User; session: Session }>> {
		try {
			await GoogleSignin.hasPlayServices();
			const userInfo = await GoogleSignin.signIn();

			if (!userInfo.data?.idToken) {
				return createAuthResult(
					null,
					createFormattedAuthError("GOOGLE", "GOOGLE_ID_TOKEN_NOT_FOUND"),
				);
			}

			const { data, error } = await supabase.auth.signInWithIdToken({
				provider: AUTH_PROVIDERS.GOOGLE,
				token: userInfo.data.idToken,
			});

			return createAuthResult(data, error);
		} catch (error) {
			const authError = convertToFormattedAuthError("GOOGLE", error);
			return createAuthResult(null, authError);
		}
	},
	async signInWithKakao(): Promise<Result<{ user: User; session: Session }>> {
		try {
			const kakaoResult = await KakaoUserModule.login();

			if (!kakaoResult.success || kakaoResult.error) {
				return createAuthResult(
					null,
					createFormattedAuthError("KAKAO", "KAKAO_LOGIN_FAILED"),
				);
			}

			if (!kakaoResult.token?.idToken) {
				return createAuthResult(
					null,
					createFormattedAuthError("KAKAO", "KAKAO_ID_TOKEN_NOT_FOUND"),
				);
			}

			const { data, error } = await supabase.auth.signInWithIdToken({
				provider: AUTH_PROVIDERS.KAKAO,
				token: kakaoResult.token.idToken,
			});

			return createAuthResult(data, error);
		} catch (error) {
			const authError = convertToFormattedAuthError("KAKAO", error);
			return createAuthResult(null, authError);
		}
	},
	async signInWithFacebook() {
		try {
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: "facebook",
				options: {
					redirectTo,
				},
			});

			if (error) {
				return createAuthResult(null, error);
			}

			if (data?.url) {
				const res = await WebBrowser.openAuthSessionAsync(data.url);
				if (res.type === "success") {
					const { url } = res;
					const { params, errorCode } = QueryParams.getQueryParams(url);
					if (errorCode) {
						return createAuthResult(
							null,
							convertToFormattedAuthError("FACEBOOK", errorCode),
						);
					}

					const { access_token, refresh_token } = params;
					console.log("access_token", access_token);
					const { data, error } = await supabase.auth.setSession({
						access_token,
						refresh_token,
					});

					if (error) {
						return createAuthResult(null, error);
					}

					return createAuthResult(data, null);
				} else {
					return createAuthResult(
						null,
						createFormattedAuthError("FACEBOOK", "FACEBOOK_LOGIN_FAILED"),
					);
				}
			}
		} catch (error) {
			return createAuthResult(
				null,
				convertToFormattedAuthError("FACEBOOK", error),
			);
		}
	},
	async signInWithApple() {},
	async signOut(): Promise<SignOutResponse> {
		const { error } = await supabase.auth.signOut();
		return { error };
	},
};
