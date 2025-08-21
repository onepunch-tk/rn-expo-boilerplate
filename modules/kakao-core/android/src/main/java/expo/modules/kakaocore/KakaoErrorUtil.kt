package expo.modules.kakaocore

/** KakaoSDK 모듈들에서 사용할 공통 에러 메시지 유틸리티 일관된 에러 메시지 형식을 제공합니다. */
object KakaoErrorUtil {

  /**
   * 모듈 이름과 에러 메시지를 받아서 형식화된 에러 메시지를 반환합니다.
   *
   * @param moduleName 모듈 이름 (예: "KakaoUser", "KakaoCore")
   * @param errorMessage 실제 에러 메시지
   * @return 형식화된 에러 메시지 "[모듈명] Error: 에러메시지"
   */
  fun formatError(moduleName: String, errorMessage: String): String {
    return "[$moduleName] Error: $errorMessage"
  }

  /**
   * 클래스 타입에서 자동으로 모듈 이름을 추출하여 에러 메시지를 형식화합니다.
   *
   * @param T 호출하는 클래스의 타입 (예: KakaoUserModule::class)
   * @param errorMessage 실제 에러 메시지
   * @return 형식화된 에러 메시지 "[모듈명] Error: 에러메시지"
   */
  inline fun <reified T> formatError(errorMessage: String): String {
    val className = T::class.java.simpleName
    val moduleName = extractModuleName(className)
    return "[$moduleName] Error: $errorMessage"
  }

  /**
   * 클래스 이름에서 모듈 이름을 추출합니다. 예: "KakaoUserModule" -> "KakaoUser", "KakaoCoreModule" -> "KakaoCore"
   */
  fun extractModuleName(className: String): String {
    return if (className.endsWith("Module")) {
      className.substring(0, className.length - 6) // "Module" = 6글자
    } else {
      className
    }
  }

  /** 미리 정의된 공통 에러 메시지들 */
  object CommonErrors {
    const val SDK_NOT_INITIALIZED = "SDK is not initialized. Please call initializeKakaoSDK first."
    const val UNKNOWN_ERROR = "An unknown error occurred."
    const val NETWORK_ERROR = "Network connection failed."
    const val AUTHENTICATION_FAILED = "Authentication failed."
    const val USER_CANCELLED = "User cancelled the operation."
    const val TOKEN_NOT_FOUND = "Authentication token could not be retrieved."
    const val ACTIVITY_NOT_FOUND = "Android Activity could not be found."
  }
}
