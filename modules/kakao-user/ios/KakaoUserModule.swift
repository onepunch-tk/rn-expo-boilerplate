import ExpoModulesCore
import KakaoSDKAuth
import KakaoSDKCommon
import KakaoSDKUser

public class KakaoUserModule: Module {
  public func definition() -> ModuleDefinition {
    Name("KakaoUser")

    AsyncFunction("login") { (promise: Promise) in
      guard (try? KakaoSDK.shared.appKey()) != nil else {
        let result = KakaoLoginResult(
          success: false,
          error: "Package-SDKNotInitialized",
          token: nil
        )
        return promise.resolve(result)
      }

      let callback = { (oauthToken: OAuthToken?, error: Error?) in
        if let error = error {
          let result = KakaoLoginResult(
            success: false,
            error: error.localizedDescription,
            token: nil
          )
          promise.resolve(result)
        } else if let token = oauthToken {
          let tokenModel = AuthTokenModel(
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
            tokenType: token.tokenType,
            idToken: token.idToken,
            accessTokenExpiresAt: token.expiredAt.timeIntervalSince1970,
            refreshTokenExpiresAt: token.refreshTokenExpiredAt.timeIntervalSince1970,
            accessTokenExpiresIn: token.expiresIn,
            refreshTokenExpiresIn: token.refreshTokenExpiresIn,
            scopes: token.scopes
          )
          let result = KakaoLoginResult(
            success: true,
            error: nil,
            token: tokenModel
          )
          promise.resolve(result)
        } else {
          let result = KakaoLoginResult(
            success: false,
            error: "Unknown Error",
            token: nil
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
  }
}
