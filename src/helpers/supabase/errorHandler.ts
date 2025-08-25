import { AuthError } from "@supabase/supabase-js";

// 에러 코드 상수
export const ERROR_CODES = {
	// Google 관련 에러
	GOOGLE_WEB_CLIENT_ID_NOT_SET: "GOOGLE_WEB_CLIENT_ID_NOT_SET",
	GOOGLE_ID_TOKEN_NOT_FOUND: "GOOGLE_ID_TOKEN_NOT_FOUND",
	GOOGLE_SIGNIN_FAILED: "GOOGLE_SIGNIN_FAILED",

	// Kakao 관련 에러
	KAKAO_NATIVE_APP_KEY_NOT_SET: "KAKAO_NATIVE_APP_KEY_NOT_SET",
	KAKAO_LOGIN_FAILED: "KAKAO_LOGIN_FAILED",
	KAKAO_ID_TOKEN_NOT_FOUND: "KAKAO_ID_TOKEN_NOT_FOUND",

	// Facebook 관련 에러
	FACEBOOK_LOGIN_FAILED: "FACEBOOK_LOGIN_FAILED",

	// 일반 에러
	UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

// 에러 메시지 매핑
export const ERROR_MESSAGES = {
	[ERROR_CODES.GOOGLE_WEB_CLIENT_ID_NOT_SET]:
		"Google Web Client ID가 설정되지 않았습니다",
	[ERROR_CODES.GOOGLE_ID_TOKEN_NOT_FOUND]: "ID 토큰을 찾을 수 없습니다",
	[ERROR_CODES.GOOGLE_SIGNIN_FAILED]: "Google 로그인 중 오류가 발생했습니다",

	[ERROR_CODES.KAKAO_NATIVE_APP_KEY_NOT_SET]:
		"Kakao Native App Key가 설정되지 않았습니다",
	[ERROR_CODES.KAKAO_LOGIN_FAILED]: "카카오 로그인에 실패했습니다",
	[ERROR_CODES.KAKAO_ID_TOKEN_NOT_FOUND]: "카카오 ID 토큰을 찾을 수 없습니다",

	[ERROR_CODES.FACEBOOK_LOGIN_FAILED]: "Facebook 로그인에 실패했습니다",

	[ERROR_CODES.UNKNOWN_ERROR]: "알 수 없는 오류가 발생했습니다",
} as const;

// 프로바이더별 접두사
export const PROVIDER_PREFIXES = {
	GOOGLE: "supabase google",
	KAKAO: "supabase kakao",
	FACEBOOK: "supabase facebook",
	GENERAL: "supabase",
} as const;

/**
 * 통일된 형태의 에러 메시지를 생성합니다
 * @param provider - 인증 프로바이더 (google, kakao, facebook 등)
 * @param errorCode - 에러 코드
 * @param customMessage - 커스텀 메시지 (선택사항)
 * @returns 포맷된 에러 메시지 "[provider] Error: ERROR_CODE"
 */
export function formatErrorMessage(
	provider: keyof typeof PROVIDER_PREFIXES,
	errorCode: keyof typeof ERROR_CODES,
): string {
	const prefix = PROVIDER_PREFIXES[provider];

	return `[${prefix}] Error: ${errorCode}`;
}

/**
 * AuthError 객체를 생성합니다
 * @param provider - 인증 프로바이더
 * @param errorCode - 에러 코드
 * @returns AuthError 인스턴스
 */
export function createFormattedAuthError(
	provider: keyof typeof PROVIDER_PREFIXES,
	errorCode: keyof typeof ERROR_CODES,
): AuthError {
	const formattedMessage = formatErrorMessage(provider, errorCode);
	return new AuthError(formattedMessage);
}

/**
 * 일반 Error를 포맷된 AuthError로 변환합니다
 * @param provider - 인증 프로바이더
 * @param error - 원본 Error 객체
 * @returns AuthError 인스턴스
 */
export function convertToFormattedAuthError(
	provider: keyof typeof PROVIDER_PREFIXES,
	error: unknown,
): AuthError {
	if (error instanceof AuthError) {
		return error;
	}

	const errorMessage = error instanceof Error ? error.message : String(error);
	const formattedMessage = `[${PROVIDER_PREFIXES[provider]}] Error: ${errorMessage}`;

	return new AuthError(formattedMessage);
}
