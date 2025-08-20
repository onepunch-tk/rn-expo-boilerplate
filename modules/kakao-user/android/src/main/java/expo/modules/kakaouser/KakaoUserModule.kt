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
          return@AsyncFunction promise.resolve(KakaoLoginResult.failure("[Kakao User Module] Error: Activity Not Found"))
        }

      val callback:(OAuthToken?, Throwable?) -> Unit = { oauthToken, error ->
          when {
              error != null -> promise.resolve(
                  KakaoLoginResult.failure(
                      error.message ?: "[Kakao User Module] Error: Unknown error"
                  )
              )

              oauthToken == null -> promise.resolve(KakaoLoginResult.failure("[Kakao User Module] Error: Not Found OAuth Token"))
              else -> {
                  val token = AuthTokenModel.from(oauthToken)
                  promise.resolve(KakaoLoginResult.success(token))
              }
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
