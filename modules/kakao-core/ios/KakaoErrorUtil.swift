import Foundation

/// KakaoSDK 모듈들에서 사용할 공통 에러 메시지 유틸리티
/// 일관된 에러 메시지 형식을 제공합니다.
public class KakaoErrorUtil {

  /**
   * 모듈 이름과 에러 메시지를 받아서 형식화된 에러 메시지를 반환합니다.
   *
   * @param moduleName 모듈 이름 (예: "KakaoUser", "KakaoCore")
   * @param errorMessage 실제 에러 메시지
   * @return 형식화된 에러 메시지 "[모듈명] Error: 에러메시지"
   */
  public static func formatError(moduleName: String, errorMessage: String) -> String {
    return "[\(moduleName)] Error: \(errorMessage)"
  }

  /**
   * 클래스 타입에서 자동으로 모듈 이름을 추출하여 에러 메시지를 형식화합니다.
   *
   * @param fromClass 호출하는 클래스의 타입 (예: KakaoUserModule.self)
   * @param errorMessage 실제 에러 메시지
   * @return 형식화된 에러 메시지 "[모듈명] Error: 에러메시지"
   */
  public static func formatError<T>(from fromClass: T.Type, errorMessage: String) -> String {
    let className = String(describing: fromClass)
    let moduleName = extractModuleName(from: className)
    return "[\(moduleName)] Error: \(errorMessage)"
  }

  /**
   * 클래스 이름에서 모듈 이름을 추출합니다.
   * 예: "KakaoUserModule" -> "KakaoUser", "KakaoCoreModule" -> "KakaoCore"
   */
  private static func extractModuleName(from className: String) -> String {
    // "Module" 접미사 제거
    if className.hasSuffix("Module") {
      return String(className.dropLast(6))  // "Module" = 6글자
    }
    return className
  }

  /**
   * 미리 정의된 공통 에러 메시지들
   */
  public struct CommonErrors {
    public static let sdkNotInitialized =
      "SDK is not initialized. Please call initializeKakaoSDK first."
    public static let unknownError = "An unknown error occurred."
    public static let networkError = "Network connection failed."
    public static let authenticationFailed = "Authentication failed."
    public static let userCancelled = "User cancelled the operation."
    public static let tokenNotFound = "Authentication token could not be retrieved."
  }
}
