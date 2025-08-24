import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
	type AuthChangeEvent,
	AuthError,
	type Session,
	type User,
} from "@supabase/supabase-js";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import { AUTH_PROVIDERS } from "@/constants/auth";
import KakaoCoreModule from "~/modules/kakao-core/";
import KakaoUserModule from "~/modules/kakao-user";
import { supabase } from "./client";
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
			throw new Error("Google Web Client ID가 설정되지 않았습니다.");
		}

		GoogleSignin.configure({
			webClientId: googleWebClientId,
		});
	},
	initializeKakaoSDK() {
		const kakaoNativeAppKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;
		if (!kakaoNativeAppKey) {
			throw new Error("Kakao Native App Key가 설정되지 않았습니다.");
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
					new AuthError("ID 토큰을 찾을 수 없습니다"),
				);
			}

			const { data, error } = await supabase.auth.signInWithIdToken({
				provider: AUTH_PROVIDERS.GOOGLE,
				token: userInfo.data.idToken,
			});

			return createAuthResult(data, error);
		} catch (error) {
			const authError =
				error instanceof AuthError
					? error
					: new AuthError(
							error instanceof Error
								? error.message
								: "Google 로그인 중 오류가 발생했습니다",
						);

			return createAuthResult(null, authError);
		}
	},
	async signInWithKakao(): Promise<Result<{ user: User; session: Session }>> {
		try {
			const kakaoResult = await KakaoUserModule.login();

			if (!kakaoResult.success || kakaoResult.error) {
				return createAuthResult(
					null,
					new AuthError(kakaoResult.error || "카카오 로그인에 실패했습니다"),
				);
			}

			if (!kakaoResult.token?.idToken) {
				return createAuthResult(
					null,
					new AuthError("카카오 ID 토큰을 찾을 수 없습니다"),
				);
			}

			const { data, error } = await supabase.auth.signInWithIdToken({
				provider: AUTH_PROVIDERS.KAKAO,
				token: kakaoResult.token.idToken,
			});

			return createAuthResult(data, error);
		} catch (error) {
			const authError =
				error instanceof AuthError
					? error
					: new AuthError(
							error instanceof Error
								? error.message
								: "카카오 로그인 중 오류가 발생했습니다",
						);

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
						return createAuthResult(null, new AuthError(errorCode));
					}

					const { access_token, refresh_token } = params;
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
						new AuthError("Facebook 로그인에 실패했습니다"),
					);
				}
			}
		} catch (error) {
			return createAuthResult(null, new AuthError(error as string));
		}
	},
	async signOut(): Promise<SignOutResponse> {
		const { error } = await supabase.auth.signOut();
		return { error };
	},
};
