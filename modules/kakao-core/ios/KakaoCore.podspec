default_kakao_version = '2.22.0'

begin
  version_info_path = File.join(File.dirname(__FILE__), '..','..', 'kakaosdk-version.json')
  if File.exist?(version_info_path)
    version_info = JSON.parse(File.read(version_info_path))
    sdk_common_version = version_info.dig('ios', 'KakaoSDKCommon') || default_kakao_version
    puts "Info: sdk_common_version: #{sdk_common_version}"
  else
    sdk_common_version = default_kakao_version
  end
rescue JSON::ParserError, StandardError => e
  puts "Warning: Could not read kakaosdk-version.json (#{e.message}). Using default version #{default_kakao_version}"
  sdk_common_version = default_kakao_version
end

Pod::Spec.new do |s|
  s.name           = 'KakaoCore'
  s.version        = '1.0.0'
  s.summary        = 'Kakao Core Module'
  s.description    = 'Kakao Core Module'
  s.author         = 'onepunch-tk'
  s.homepage       = 'https://github.com/onepunch-tk'
  s.platforms      = { :ios => '15.1'}
  s.source         = { git: 'https://github.com/onepunch-tk/rn-expo-boilerplate' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.dependency 'KakaoSDKCommon', sdk_common_version

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
