import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
	type AuthChangeEvent,
	AuthError,
	createClient,
	type Session,
	type User,
} from "@supabase/supabase-js";
import { AUTH_PROVIDERS } from "@/constants/auth";
import KakaoCoreModule from "~/modules/kakao-core/";
import KakaoUserModule from "~/modules/kakao-user";
import { StorageHelper } from "./storage";

const mmkvSupabaseSupportedStorage = {
	getItem: async (key: string) => await StorageHelper.getItem(key),
	setItem: async (key: string, value: string) =>
		await StorageHelper.setItem(key, value),
	removeItem: async (key: string) => await StorageHelper.removeItem(key),
};

const supabase = createClient(
	process.env.EXPO_PUBLIC_SUPABASE_URL!,
	process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
	{
		auth: {
			storage: mmkvSupabaseSupportedStorage,
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: false,
		},
	},
);

function handleAuthResponse({
	data,
	error,
}: {
	data: { user: User; session: Session } | { user: null; session: null };
	error: AuthError | null;
}) {
	if (error) {
		return {
			success: false,
			error,
			data: null,
		};
	}

	return {
		success: true,
		error: null,
		data,
	};
}

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
		GoogleSignin.configure({
			webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
		});
	},
	initializeKakaoSDK() {
		KakaoCoreModule.initializeKakaoSDK(
			process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY!,
		);
	},
	async signInWithGoogle() {
		try {
			await GoogleSignin.hasPlayServices();
			const userInfo = await GoogleSignin.signIn();

			if (userInfo.data?.idToken) {
				const { data, error } = await supabase.auth.signInWithIdToken({
					provider: AUTH_PROVIDERS.GOOGLE,
					token: userInfo.data.idToken,
				});

				return handleAuthResponse({ data, error });
			} else {
				const error = new AuthError("NO_ID_TOKEN_FOUND");
				return handleAuthResponse({
					data: { user: null, session: null },
					error,
				});
			}
		} catch (error) {
			return handleAuthResponse({
				data: { user: null, session: null },
				error: error as AuthError,
			});
		}
	},
	async signInWithFacebook() {
		try {
			const { data, error } = await supabase.auth.signInWithIdToken({
				provider: AUTH_PROVIDERS.FACEBOOK,
				token: "",
			});

			return handleAuthResponse({ data, error });
		} catch (error) {
			return handleAuthResponse({
				data: { user: null, session: null },
				error: error as AuthError,
			});
		}
	},
	async signInWithKakao() {
		try {
			const {
				success,
				error: kakaoLoginError,
				token,
			} = await KakaoUserModule.login();

			console.log("kakaoLoginError", kakaoLoginError);
			console.log("success", success);
			console.log("token", JSON.stringify(token, null, 2));

			if (success && token?.idToken) {
				const { data, error } = await supabase.auth.signInWithIdToken({
					provider: AUTH_PROVIDERS.KAKAO,
					token: token?.idToken,
				});

				return handleAuthResponse({ data, error });
			} else if (kakaoLoginError) {
				return handleAuthResponse({
					data: { user: null, session: null },
					error: new AuthError(kakaoLoginError),
				});
			} else {
				return handleAuthResponse({
					data: { user: null, session: null },
					error: new AuthError("Unknown Error"),
				});
			}
		} catch (error) {
			return handleAuthResponse({
				data: { user: null, session: null },
				error: error as AuthError,
			});
		}
	},
	async signOut() {
		await supabase.auth.signOut();
	},
};
