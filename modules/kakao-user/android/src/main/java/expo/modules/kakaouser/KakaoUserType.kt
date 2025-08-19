package expo.modules.kakaouser

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

data class AuthTokenModel(
        @Field var accessToken: String = "",
        @Field var refreshToken: String = "",
        @Field var tokenType: String? = null,
        @Field var idToken: String? = null,
        @Field var accessTokenExpiresAt: Double = 0.0,
        @Field var refreshTokenExpiresAt: Double = 0.0,
        @Field var accessTokenExpiresIn: Double = 0.0,
        @Field var refreshTokenExpiresIn: Double = 0.0,
        @Field var scopes: List<String>? = null
) : Record

data class KakaoLoginResult(
        @Field var success: Boolean = false,
        @Field var error: String? = null,
        @Field var token: AuthTokenModel? = null,
) : Record
