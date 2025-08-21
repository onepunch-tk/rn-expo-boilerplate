export interface BaseResult {
	success: boolean;
	error?: string | null;
}

export interface AccessTokenInfo {
	id: number;
	appId: number;
	expiresIn: number;
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

export interface KakaoLogoutResult extends BaseResult {}
export interface KakaoIsLogined extends Pick<BaseResult, "error"> {
	isLogined: boolean;
}
export interface KakaoAccessTokenResult extends Pick<BaseResult, "error"> {
	accessToken?: AccessTokenInfo | null;
}
