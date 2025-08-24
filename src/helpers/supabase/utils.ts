import { AuthError, type Session, type User } from "@supabase/supabase-js";

import type { Result } from "./types";

/**
 * 인증 결과를 Result 타입으로 변환하는 헬퍼 함수
 */
export function createAuthResult(
	data: { user: User; session: Session } | { user: null; session: null } | null,
	error: AuthError | null,
): Result<{ user: User; session: Session }> {
	if (error || !data || !data.user || !data.session) {
		return {
			success: false,
			data: null,
			error: error || new AuthError("인증 데이터가 올바르지 않습니다"),
		};
	}

	return {
		success: true,
		data: data as { user: User; session: Session },
		error: null,
	};
}
