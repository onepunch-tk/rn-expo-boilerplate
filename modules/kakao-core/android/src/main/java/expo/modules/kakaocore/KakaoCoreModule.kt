package expo.modules.kakaocore

import com.kakao.sdk.common.KakaoSdk
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class KakaoCoreModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("KakaoCore")

    Function("initializeKakaoSDK") { appKey: String -> KakaoSdk.init(appContext, appKey) }
  }
}
