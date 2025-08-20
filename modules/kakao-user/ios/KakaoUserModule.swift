import ExpoModulesCore
import KakaoSDKAuth
import KakaoSDKCommon
import KakaoSDKUser

public class KakaoUserModule: Module {
  public func definition() -> ModuleDefinition {
    Name("KakaoUser")

    AsyncFunction("login") { (promise: Promise) in
      guard (try? KakaoSDK.shared.appKey()) != nil else {
        let result = KakaoLoginResultModel(error: "Package-SDKNotInitialized")
        return promise.resolve(result)
      }

      let callback = { (oauthToken: OAuthToken?, error: Error?) in
        if let error = error {
          let result = KakaoLoginResultModel(error: error.localizedDescription)
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
            error: "Unknown Error",
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

    AsyncFunction("logout") {
      UserApi.shared.logout { error in
        if let error {
        } else {}
      }
    }
  }
}
