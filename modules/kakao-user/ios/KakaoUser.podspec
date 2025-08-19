default_kakao_version = '2.22.0'

begin
  # 더 안정적인 절대 경로 사용 - 현재 디렉토리에서 modules/kakaosdk-version.json 찾기
  current_dir = Dir.pwd
  version_info_path = File.join(current_dir, 'modules', 'kakaosdk-version.json')
  puts "Debug: Current directory: #{current_dir}"
  puts "Debug: podspec file location: #{__FILE__}"
  puts "Debug: Looking for version file at: #{version_info_path}"
  puts "Debug: File exists: #{File.exist?(version_info_path)}"
  
  if File.exist?(version_info_path)
    version_info = JSON.parse(File.read(version_info_path))
    sdk_user_version = version_info.dig('ios', 'KakaoSDKUser') || default_kakao_version
    sdk_auth_version = version_info.dig('ios', 'KakaoSDKAuth') || default_kakao_version
    puts "Info: Successfully loaded sdk_user_version: #{sdk_user_version}"
    puts "Info: Successfully loaded sdk_auth_version: #{sdk_auth_version}"
  else
    sdk_user_version = default_kakao_version
    sdk_auth_version = default_kakao_version
  end
rescue JSON::ParserError, StandardError => e
  puts "Warning: Could not read kakaosdk-version.json (#{e.message}). Using default version #{default_kakao_version}"
  sdk_user_version = default_kakao_version
  sdk_auth_version = default_kakao_version
end

Pod::Spec.new do |s|
  s.name           = 'KakaoUser'
  s.version        = '1.0.0'
  s.summary        = 'A sample project summary'
  s.description    = 'A sample project description'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = {
    :ios => '15.1',
    :tvos => '15.1'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.dependency 'KakaoSDKAuth', sdk_auth_version
  s.dependency 'KakaoSDKUser', sdk_user_version
  
  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
