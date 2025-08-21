import type { AuthError, Session, User } from "@supabase/supabase-js";

// 공통 응답 타입
export interface SupabaseResponse<T = null> {
	data: T;
	error: null;
}

export interface SupabaseErrorResponse {
	data: null;
	error: AuthError;
}

// 인증 관련 응답 타입들
export interface AuthSuccessResponse {
	data: {
		user: User;
		session: Session;
	};
	error: null;
}

export interface AuthErrorResponse {
	data: null;
	error: AuthError;
}

// 로그아웃 응답 타입
export interface SignOutResponse {
	error: AuthError | null;
}

// 통합 인증 응답 타입
export type AuthResponse = AuthSuccessResponse | AuthErrorResponse;

// Provider 타입
export type AuthProvider = "google" | "kakao" | "facebook";

// 결과 타입 (성공/실패 구분)
export type Result<T, E = AuthError> =
	| { success: true; data: T; error: null }
	| { success: false; data: null; error: E };
