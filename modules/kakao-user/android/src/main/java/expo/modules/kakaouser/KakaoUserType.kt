package expo.modules.kakaouser

import com.kakao.sdk.auth.model.OAuthToken
import com.kakao.sdk.user.model.AccessTokenInfo
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import java.util.Date

// BaseResult 프로토콜 (Swift의 BaseResultProtocol과 동일)
abstract class BaseResult : Record {
    @Field var success: Boolean = false
    @Field var error: String? = null
}

// AuthTokenModel (Swift의 AuthTokenModel과 동일)
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

// KakaoLoginResult (Swift의 KakaoLoginResultModel과 동일)
data class KakaoLoginResult(
        @Field var token: AuthTokenModel? = null,
) : Record, BaseResult() {
    companion object {
        fun success(token: AuthTokenModel) =
                KakaoLoginResult(token).apply {
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

// KakaoLogoutResult (Swift의 KakaoLogoutResult와 동일)
class KakaoLogoutResult() : Record, BaseResult() {
    companion object {
        fun success() =
                KakaoLogoutResult().apply {
                    this.success = true
                    this.error = null
                }

        fun failure(message: String) =
                KakaoLogoutResult().apply {
                    this.success = false
                    this.error = message
                }
    }
}

// KakaoIsLogined (Swift의 KakaoIsLogined와 동일)
data class KakaoIsLogined(@Field var isLogined: Boolean = false, @Field var error: String? = null) :
        Record {
    companion object {
        fun loggedIn() = KakaoIsLogined(isLogined = true, error = null)

        fun notLoggedIn() = KakaoIsLogined(isLogined = false, error = null)

        fun error(message: String) = KakaoIsLogined(isLogined = false, error = message)
    }
}

// AccessTokenInfoModel (Swift의 AccessTokenInfoModel과 동일)
data class AccessTokenInfoModel(
        @Field var id: Long? = null,
        @Field var appId: Int = 0,
        @Field var expiresIn: Long = 0
) : Record {
    companion object {
        fun from(accessToken: AccessTokenInfo): AccessTokenInfoModel {
            return AccessTokenInfoModel(
                    id = accessToken.id,
                    appId = accessToken.appId,
                    expiresIn = accessToken.expiresIn
            )
        }
    }
}

// KakaoAccessTokenResult (Swift의 KakaoAccessTokenResult와 동일)
data class KakaoAccessTokenResult(
        @Field var accessTokenInfo: AccessTokenInfoModel? = null,
        @Field var error: String? = null
) : Record {
    companion object {
        fun success(accessTokenInfo: AccessTokenInfoModel) =
                KakaoAccessTokenResult(accessTokenInfo = accessTokenInfo, error = null)

        fun failure(message: String) =
                KakaoAccessTokenResult(accessTokenInfo = null, error = message)
    }
}

