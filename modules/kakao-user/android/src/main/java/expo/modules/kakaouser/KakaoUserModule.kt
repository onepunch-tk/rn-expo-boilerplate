package expo.modules.kakaouser

import com.kakao.sdk.auth.model.OAuthToken
import com.kakao.sdk.user.UserApiClient
import expo.modules.kakaocore.KakaoErrorUtil
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class KakaoUserModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("KakaoUser")

    AsyncFunction("login") { promise: Promise ->
      val context =
              appContext.activityProvider?.currentActivity
                      ?: run {
                        return@AsyncFunction promise.resolve(
                                KakaoLoginResult.failure(
                                        KakaoErrorUtil.formatError<KakaoUserModule>(
                                                KakaoErrorUtil.CommonErrors.ACTIVITY_NOT_FOUND
                                        )
                                )
                        )
                      }

      val callback: (OAuthToken?, Throwable?) -> Unit = { oauthToken, error ->
        when {
          error != null ->
                  promise.resolve(
                          KakaoLoginResult.failure(
                                  KakaoErrorUtil.formatError<KakaoUserModule>(
                                          error.message ?: KakaoErrorUtil.CommonErrors.UNKNOWN_ERROR
                                  )
                          )
                  )
          oauthToken == null ->
                  promise.resolve(
                          KakaoLoginResult.failure(
                                  KakaoErrorUtil.formatError<KakaoUserModule>(
                                          KakaoErrorUtil.CommonErrors.TOKEN_NOT_FOUND
                                  )
                          )
                  )
          else -> {
            val token = AuthTokenModel.from(oauthToken)
            promise.resolve(KakaoLoginResult.success(token))
          }
        }
      }

      if (UserApiClient.instance.isKakaoTalkLoginAvailable(context)) {
        UserApiClient.instance.loginWithKakaoTalk(context = context, callback = callback)
      } else {
        UserApiClient.instance.loginWithKakaoAccount(context = context, callback = callback)
      }
    }
  }
}
