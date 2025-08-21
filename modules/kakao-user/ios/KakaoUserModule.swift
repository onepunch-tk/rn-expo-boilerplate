import ExpoModulesCore
import KakaoCore
import KakaoSDKAuth
import KakaoSDKCommon
import KakaoSDKUser

public class KakaoUserModule: Module {
  public func definition() -> ModuleDefinition {
    Name("KakaoUser")

    AsyncFunction("login") { (promise: Promise) in
      guard (try? KakaoSDK.shared.appKey()) != nil else {
        let result = KakaoLoginResultModel(
          error: KakaoErrorUtil.formatError(
            from: Self.self, errorMessage: KakaoErrorUtil.CommonErrors.sdkNotInitialized
          ))
        return promise.resolve(result)
      }

      let callback = { (oauthToken: OAuthToken?, error: Error?) in
        if let error = error {
          let result = KakaoLoginResultModel(
            error: KakaoErrorUtil.formatError(
              from: Self.self, errorMessage: error.localizedDescription
            ))
          promise.resolve(result)
        } else if let token = oauthToken {
          let tokenModel = AuthTokenModel.from(token)
          let result = KakaoLoginResultModel(
            success: true,
            token: tokenModel
          )
          promise.resolve(result)
        } else {
          let result = KakaoLoginResultModel(
            error: KakaoErrorUtil.formatError(
              from: Self.self, errorMessage: KakaoErrorUtil.CommonErrors.tokenNotFound
            )
          )
          promise.resolve(result)
        }
      }

      if UserApi.isKakaoTalkLoginAvailable() {
        UserApi.shared.loginWithKakaoTalk(completion: callback)
      } else {
        UserApi.shared.loginWithKakaoAccount(completion: callback)
      }
    }

    AsyncFunction("logout") { (promise: Promise) in
      UserApi.shared.logout { error in
        if let error {
          promise.resolve(
            KakaoLogoutResult(
              error: KakaoErrorUtil.formatError(from: Self.self, errorMessage: error.localizedDescription)
            )
          )
        } else {
          promise.resolve(
            KakaoLogoutResult(success: true)
          )
        }
      }
    }

    AsyncFunction("unlink") { (promise: Promise) in
      UserApi.shared.unlink { error in
        if let error {
          promise.resolve(
            KakaoLogoutResult(
              error: KakaoErrorUtil.formatError(from: Self.self, errorMessage: error.localizedDescription)
            )
          )
        } else {
          promise.resolve(
            KakaoLogoutResult(success: true)
          )
        }
      }
    }

    AsyncFunction("isLogined") { (promise: Promise) in
      if AuthApi.hasToken() {
        UserApi.shared.accessTokenInfo { _, error in
          if let error {
            promise.resolve(
              KakaoIsLogined(
                error: KakaoErrorUtil.formatError(from: Self.self, errorMessage: error.localizedDescription)
              )
            )
          } else {
            promise.resolve(
              KakaoIsLogined(isLogined: true)
            )
          }
        }
      } else {
        promise.resolve(KakaoIsLogined())
      }
    }

    AsyncFunction("getAccessToken") { (promise: Promise) in
      UserApi.shared.accessTokenInfo { accessToken, error in
        if let error {
          promise.resolve(
            KakaoAccessTokenResult(error: KakaoErrorUtil.formatError(from: Self.self, errorMessage: error.localizedDescription)
            )
          )
        } else if let accessToken {
          promise.resolve(
            KakaoAccessTokenResult(
              accessTokenInfo: AccessTokenInfoModel.from(accessToken)
            )
          )
        } else {
          promise.resolve(
            KakaoAccessTokenResult(error: KakaoErrorUtil.formatError(from: Self.self, errorMessage: KakaoErrorUtil.CommonErrors.tokenNotFound)
            )
          )
        }
      }
    }
  }
}
