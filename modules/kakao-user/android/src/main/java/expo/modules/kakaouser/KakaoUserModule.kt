package expo.modules.kakaouser

import com.kakao.sdk.auth.AuthApiClient
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
      AsyncFunction("logout") { promise: Promise ->
          UserApiClient.instance.logout { it ->
              when {
                  it != null ->  promise.resolve(
                      KakaoLogoutResult.failure(
                          KakaoErrorUtil.formatError<KakaoUserModule>(it.message?: KakaoErrorUtil.CommonErrors.UNKNOWN_ERROR)
                      )
                  )
                  else ->
                      promise.resolve(
                          KakaoLogoutResult.success()
                      )
              }
          }
      }
      AsyncFunction("unlink") {promise:Promise ->
          UserApiClient.instance.unlink { it ->
              when {
                  it != null ->  promise.resolve(
                      KakaoLogoutResult.failure(
                          KakaoErrorUtil.formatError<KakaoUserModule>(it.message?: KakaoErrorUtil.CommonErrors.UNKNOWN_ERROR)
                      )
                  )
                  else ->
                      promise.resolve(
                          KakaoLogoutResult.success()
                      )
              }
          }
      }
      AsyncFunction("isLogined") {promise: Promise->
          when {
              AuthApiClient.instance.hasToken() -> UserApiClient.instance.accessTokenInfo {_, error ->
                  when {
                      error != null -> promise.resolve(
                          KakaoIsLogined.error(KakaoErrorUtil.formatError<KakaoUserModule>(
                              error.message?: "Login check Error"
                          ))
                      )
                      else -> promise.resolve(
                          KakaoIsLogined.loggedIn()
                      )
                  }
              }
              else -> promise.resolve(
                  KakaoIsLogined.notLoggedIn()
              )
          }
      }
      AsyncFunction("getAccessToken") { promise:Promise ->
          UserApiClient.instance.accessTokenInfo { accessToken, error ->
              when {
                  error != null -> promise.resolve(
                      KakaoAccessTokenResult.failure(
                          KakaoErrorUtil.formatError<KakaoUserModule>(
                              error.message?:"Access Token Check Error"
                          )
                      )
                  )
                  accessToken == null -> promise.resolve(
                      KakaoAccessTokenResult.failure(
                          KakaoErrorUtil.formatError<KakaoUserModule>(
                              KakaoErrorUtil.CommonErrors.TOKEN_NOT_FOUND
                          )
                      )
                  )
                  else -> promise.resolve(
                      KakaoAccessTokenResult.success(
                          AccessTokenInfoModel.from(accessToken)
                      )
                  )
              }
          }
      }
  }
}
