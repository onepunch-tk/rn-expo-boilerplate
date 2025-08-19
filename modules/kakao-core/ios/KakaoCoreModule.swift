import ExpoModulesCore
import KakaoSDKCommon

public class KakaoCoreModule: Module {
  public func definition() -> ModuleDefinition {
    Name("KakaoCore")

    Function("initializeKakaoSDK") { (appKey: String) in
      KakaoSDK.initSDK(appKey: appKey)
    }
  }
}
