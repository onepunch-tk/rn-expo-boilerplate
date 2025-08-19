package expo.modules.kakaocore

import com.kakao.sdk.common.KakaoSdk
import com.kakao.sdk.common.util.Utility
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class KakaoCoreModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("KakaoCore")

    Function("initializeKakaoSDK") { appKey: String ->
      appContext.reactContext?.let { context -> KakaoSdk.init(context, appKey) }
    }

    Function("getKeyHash") {
      appContext.reactContext?.let { context ->
        return@Function Utility.getKeyHash(context)
      }
    }
  }
}
