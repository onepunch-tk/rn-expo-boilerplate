package expo.modules.kakaouser

import com.kakao.sdk.auth.model.OAuthToken
import com.kakao.sdk.user.UserApiClient
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.Date


class KakaoUserModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("KakaoUser")

    AsyncFunction("login") { promise: Promise ->
        val context = appContext.activityProvider?.currentActivity?: run {
          return@AsyncFunction promise.resolve(KakaoLoginResult(error = "Activity Not Found"))
        }

      val callback:(OAuthToken?, Throwable?) -> Unit = { oauthToken, error ->
         if(error != null) {
             promise.resolve(KakaoLoginResult(error = error.message))
         } else if(oauthToken == null) {
             promise.resolve(KakaoLoginResult(error="[Kakao User Module] Error: Not Found OAuth Token"))
         } else {
             val token = AuthTokenModel(
                 accessToken = oauthToken.accessToken,
                 refreshToken = oauthToken.refreshToken,
                 idToken = oauthToken.idToken,
                 accessTokenExpiresAt = oauthToken.accessTokenExpiresAt.unix.toDouble(),
                 refreshTokenExpiresAt = oauthToken.refreshTokenExpiresAt.unix.toDouble(),
                 accessTokenExpiresIn = diffSec(oauthToken.accessTokenExpiresAt, Date()).toDouble(),
                 refreshTokenExpiresIn = diffSec(oauthToken.refreshTokenExpiresAt, Date()).toDouble(),
                 scopes = oauthToken.scopes
             )
             promise.resolve(KakaoLoginResult(
                 success = true,
                 token = token
             ))
         }
      }

        if(UserApiClient.instance.isKakaoTalkLoginAvailable(context)) {
            UserApiClient.instance.loginWithKakaoTalk(context = context, callback = callback)
        } else {
            UserApiClient.instance.loginWithKakaoAccount(context = context, callback=callback)
        }
    }
  }
}
