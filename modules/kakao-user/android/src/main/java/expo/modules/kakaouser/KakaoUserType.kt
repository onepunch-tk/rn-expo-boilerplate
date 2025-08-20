package expo.modules.kakaouser

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import com.kakao.sdk.auth.model.OAuthToken
import java.util.Date

abstract class BaseResult: Record {
    @Field var success: Boolean = false
    @Field var error: String? = null
}

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
) : Record {
    companion object {
        fun from(token: OAuthToken): AuthTokenModel {
            return AuthTokenModel(
                accessToken = token.accessToken,
                refreshToken = token.refreshToken,
                idToken = token.idToken,
                accessTokenExpiresAt = token.accessTokenExpiresAt.unix.toDouble(),
                refreshTokenExpiresAt = token.refreshTokenExpiresAt.unix.toDouble(),
                accessTokenExpiresIn = diffSec(token.accessTokenExpiresAt, Date()).toDouble(),
                refreshTokenExpiresIn = diffSec(token.refreshTokenExpiresAt, Date()).toDouble(),
                scopes = token.scopes
            )
        }
    }
}

data class KakaoLoginResult(
    @Field var token: AuthTokenModel? = null,
) : Record, BaseResult() {
    companion object {
        fun success(token: AuthTokenModel) = KakaoLoginResult(token).apply {
            this.success = true
            this.error = null
        }
        fun failure(message: String) =
            KakaoLoginResult(null).apply {
                this.success = false
                this.error = message
            }
    }
}
