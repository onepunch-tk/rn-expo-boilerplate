import ExpoModulesCore
import KakaoSDKAuth
import KakaoSDKUser

protocol BaseResultProtocol {
  var success: Bool { get set }
  var error: String? { get set }
}

struct AuthTokenModel: Record {
  @Field
  var accessToken: String

  @Field
  var refreshToken: String

  @Field
  var tokenType: String

  @Field
  var idToken: String?

  @Field
  var accessTokenExpiresAt: TimeInterval

  @Field
  var refreshTokenExpiresAt: TimeInterval

  @Field
  var accessTokenExpiresIn: TimeInterval

  @Field
  var refreshTokenExpiresIn: TimeInterval

  @Field
  var scopes: [String]?
}

extension AuthTokenModel {
  static func from(_ token: OAuthToken) -> Self {
    var m = Self()
    m._accessToken = Field(wrappedValue: token.accessToken)
    m._refreshToken = Field(wrappedValue: token.refreshToken)
    m._tokenType = Field(wrappedValue: token.tokenType)
    m._idToken = Field(wrappedValue: token.idToken)
    m._accessTokenExpiresAt = Field(wrappedValue: token.expiredAt.timeIntervalSince1970)
    m._refreshTokenExpiresAt = Field(wrappedValue: token.refreshTokenExpiredAt.timeIntervalSince1970)
    m._accessTokenExpiresIn = Field(wrappedValue: token.expiresIn)
    m._refreshTokenExpiresIn = Field(wrappedValue: token.refreshTokenExpiresIn)
    m._scopes = Field(wrappedValue: token.scopes)
    return m
  }
}

struct KakaoLoginResultModel: Record, BaseResultProtocol {
  @Field
  var success: Bool = false
  @Field
  var error: String? = nil
  @Field
  var token: AuthTokenModel? = nil
}

struct KakaoLogoutResult: Record, BaseResultProtocol {
  @Field
  var success: Bool = false
  @Field
  var error: String? = nil
}

struct KakaoIsLogined: Record {
  @Field
  var isLogined: Bool = false
  @Field
  var error: String? = nil
}

struct AccessTokenInfoModel: Record {
  @Field
  var id: Int64?
  @Field
  var appId: Int64 = 0
  @Field
  var expiresIn: Int64 = 0
}

extension AccessTokenInfoModel {
  static func from(_ accessToken: AccessTokenInfo) -> Self {
    var m = Self()
    m._id = Field(wrappedValue: accessToken.id)
    m._appId = Field(wrappedValue: accessToken.appId)
    m._expiresIn = Field(wrappedValue: accessToken.expiresIn)
    return m
  }
}

struct KakaoAccessTokenResult: Record {
  @Field
  var accessTokenInfo: AccessTokenInfoModel? = nil
  @Field
  var error: String? = nil
}
