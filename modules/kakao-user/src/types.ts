export interface BaseResult {
	success: boolean;
	error?: string;
}

export interface KakaoAuthToken {
	accessToken: string;
	refreshToken: string;
	tokenType?: string;
	idToken?: string;
	accessTokenExpiresAt: number;
	refreshTokenExpiresAt: number;
	accessTokenExpiresIn: number;
	refreshTokenExpiresIn: number;
	scopes: string[];
}

export interface KakaoLoginResult extends BaseResult {
	token: KakaoAuthToken | null;
}
