import ExpoModulesCore
import KakaoSDKAuth

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
  
  init() {}
  
  init(accessToken: String, refreshToken: String, tokenType: String, idToken: String? = nil, accessTokenExpiresAt: TimeInterval, refreshTokenExpiresAt: TimeInterval, accessTokenExpiresIn: TimeInterval, refreshTokenExpiresIn: TimeInterval, scopes: [String]? = nil) {
    self._accessToken = Field(wrappedValue: accessToken)
    self._refreshToken = Field(wrappedValue: refreshToken)
    self._tokenType = Field(wrappedValue: tokenType)
    self._idToken = Field(wrappedValue: idToken)
    self._accessTokenExpiresAt = Field(wrappedValue: accessTokenExpiresAt)
    self._refreshTokenExpiresAt = Field(wrappedValue: refreshTokenExpiresAt)
    self._accessTokenExpiresIn = Field(wrappedValue: accessTokenExpiresIn)
    self._refreshTokenExpiresIn = Field(wrappedValue: refreshTokenExpiresIn)
    self._scopes = Field(wrappedValue: scopes)
  }
}

struct KakaoLoginResult: Record {
  @Field
  var success: Bool
  @Field
  var error: String? = nil
  @Field
  var token: AuthTokenModel? = nil
  
  init() {}
  
  init(success: Bool, error: String? = nil, token: AuthTokenModel? = nil) {
    self._success = Field(wrappedValue: success)
    self._error = Field(wrappedValue: error)
    self._token = Field(wrappedValue: token)
  }
}
