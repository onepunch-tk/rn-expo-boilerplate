default_kakao_version = '2.22.0'

begin
  # podspec 파일 위치를 기준으로 kakaosdk-version.json 찾기
  # 현재 파일: modules/kakao-core/ios/KakaoCore.podspec
  # 타겟 파일: modules/kakaosdk-version.json
  podspec_dir = File.dirname(__FILE__)
  version_info_path = File.join(podspec_dir, '../../kakaosdk-version.json')
  puts "Debug: Podspec directory: #{podspec_dir}"
  puts "Debug: podspec file location: #{__FILE__}"
  puts "Debug: Looking for version file at: #{version_info_path}"
  puts "Debug: File exists: #{File.exist?(version_info_path)}"
  
  if File.exist?(version_info_path)
    version_info = JSON.parse(File.read(version_info_path))
    sdk_common_version = version_info.dig('ios', 'KakaoSDKCommon') || default_kakao_version
    puts "Info: Successfully loaded sdk_common_version: #{sdk_common_version}"
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
