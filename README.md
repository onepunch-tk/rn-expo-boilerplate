# React Native Expo Starter Kit

React Native 앱을 빠르게 시작할 수 있는 Starter Kit입니다. Expo 53 기반으로 제작되었으며, 온보딩, 인증, 로컬 스토리지, 애니메이션 등 핵심 기능들이 구현되어 있습니다.

## 🚀 필수 설정 (Required Setup)

### 1. Supabase 프로젝트 설정

1. [Supabase Console](https://supabase.com/dashboard)에서 새 프로젝트를 생성하세요
2. 프로젝트 설정에서 API URL과 anon key를 확인하세요

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 필드를 추가하세요:

```bash
# Supabase 설정
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth (Google 로그인이 필요한 경우)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id

# Kakao OAuth (카카오 로그인이 필요한 경우)
EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY=your_kakao_native_app_key
```

### 3. Firebase 프로젝트 설정

Firebase는 OAuth 인증과 Crashlytics 서비스 두 가지 목적으로 사용됩니다. 각각의 설정 방법을 알아보겠습니다.

#### 3-1. 기본 Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. 프로젝트 이름과 설정을 입력하여 프로젝트 생성 완료
3. `google-services.json` (Android)와 `GoogleService-Info.plist` (iOS) 다운로드
4. 이 파일들을 프로젝트 루트 디렉토리에 배치

#### 3-2. Google OAuth 인증 설정 (선택사항)

**Google 로그인 기능이 필요한 경우에만 설정하세요.**

1. **Authentication 서비스 활성화**
   - Firebase Console에서 **Authentication** > **Sign-in method**로 이동
   - **Google** 제공업체를 클릭하여 활성화
   - 프로젝트 지원 이메일을 설정

2. **Android SHA-1 지문 등록** (Android 앱 지원시)
   ```bash
   # Debug keystore SHA-1 확인 (개발용)
   keytool -list -v -alias androiddebugkey -keystore ~/.android/debug.keystore
   # 비밀번호: android
   ```
   - 출력에서 `SHA1:` 뒤의 지문을 복사
   - Firebase Console > **프로젝트 설정** > **일반** > **내 앱** > **SHA 인증서 지문**에 추가

3. **Web Client ID 확인**
   - Firebase Console > **프로젝트 설정** > **일반** > **웹 API 키**에서 웹 클라이언트 ID 확인
   - 이 값을 `.env` 파일의 `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`에 설정

#### 3-3. Firebase Crashlytics 설정 (선택사항)

**앱의 오류 추적 및 분석이 필요한 경우에만 설정하세요.**

1. **Crashlytics 서비스 활성화**
   - Firebase Console에서 **Crashlytics**를 클릭
   - **시작하기** 버튼을 클릭하여 서비스 활성화
   - 설정 안내에 따라 진행

2. **데이터 수집 활성화**
   - Crashlytics 대시보드에서 **데이터 수집 활성화** 확인
   - 첫 번째 충돌 리포트가 도착할 때까지 대기

3. **테스트 충돌 발생** (선택사항)
   - 앱에서 의도적으로 오류를 발생시켜 Crashlytics 연동 테스트
   - Firebase Console에서 충돌 리포트 확인

> **💡 참고**: OAuth와 Crashlytics는 독립적으로 설정 가능합니다. 필요한 기능만 선택하여 설정하세요.

### 4. 카카오 개발자 콘솔 설정

**카카오 로그인 기능을 사용하려면 다음 단계를 따르세요:**

1. [Kakao Developers](https://developers.kakao.com/console/app)에서 새 앱을 생성하세요
   - **중요**: 개발 및 디버깅을 위해서는 **Test App**을 생성해야 합니다
   - Test App을 생성해야만 `account_email` verification error가 발생하지 않습니다

2. **카카오 로그인 > 설정하기 > 일반**에서 OpenID Connect 활성화:
   - **Supabase 연동에 필수**: Supabase Auth Provider로 카카오를 사용하려면 반드시 OpenID Connect를 활성화해야 합니다
   - 카카오 로그인 설정 페이지에서 **OpenID Connect** 토글을 활성화
   - 자세한 설정 방법은 [카카오 로그인 설정하기](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-oidc) 참고

3. **앱 설정 > 플랫폼 설정**에서 iOS/Android 플랫폼 추가:
   - **Android**: 패키지명과 키 해시 등록
   - **iOS**: 번들 ID 등록

4. **카카오 로그인 > 동의항목**에서 필수 항목 활성화:
   - `account_email` (필수)
   - `profile_nickname` (선택)
   - `profile_image` (선택)

5. **보안 > Client Secret** 생성 및 활성화

6. 앱 키 확인:
   - Native 앱 키 (SDK 초기화용)

### 5. Supabase Authentication Provider 설정

**Supabase에서 카카오 인증 설정:**

1. [Supabase Dashboard](https://supabase.com/dashboard) > Authentication > Providers로 이동
2. Kakao provider 활성화
3. 카카오 개발자 콘솔에서 얻은 정보 입력:
   - **Client ID**: Native 앱 키
   - **Client Secret**: 보안 탭에서 생성한 Client Secret

## 📱 카카오 로그인 사용법

### Android 키 해시 확인
Android 앱을 카카오 개발자 콘솔에 등록할 때 키 해시가 필요한 경우:

```typescript
import KakaoCoreModule from "~/modules/kakao-core";

// 키 해시 확인
const keyHash = await KakaoCoreModule.getKeyHash();
console.log("Key Hash:", keyHash);
```

### 앱 설정 (app.json)

**1. Kakao SDK 사용을 위한 필수 Android 설정:**
```json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "extraMavenRepos": [
              "https://devrepo.kakao.com/nexus/content/groups/public/"
            ]
          }
        }
      ]
    ]
  }
}
```

**2. Kakao Plugin 설정:**
카카오 플러그인 설정에 대한 자세한 내용은 `plugins/kakao/` 디렉토리를 참조하세요.

```json
{
  "expo": {
    "plugins": [
      [
        "./plugins/kakao",
        {
          "kakao": {
            "nativeAppKey": "your_kakao_native_app_key",
            "iosEnabled": true,
            "androidEnabled": true
          }
        }
      ]
    ]
  }
}
```

### 초기화 및 사용법

**1. SDK 초기화** (`src/app/_layout.tsx` 참조):
```typescript
import { SupabaseAuthHelper } from "@/helpers/supabase/SupabaseAuthHelper";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    // 앱 시작 시 Kakao SDK 초기화
    SupabaseAuthHelper.initializeKakaoSDK();
  }, []);

  return (
    // ... your app layout
  );
}
```

**2. 로그인 구현** (`src/helpers/supabase/SupabaseAuthHelper.ts`, `src/app/(auth)/index.tsx` 참조):
```typescript
import { SupabaseAuthHelper } from "@/helpers/supabase/SupabaseAuthHelper";

async function handleKakaoLogin() {
  try {
    const { success, error, data } = await SupabaseAuthHelper.signInWithKakao();
    
    if (success) {
      console.log('카카오 로그인 성공:', data.user?.email);
      // 로그인 성공 처리
    } else {
      console.error('카카오 로그인 실패:', error.message);
      // 에러 처리
    }
  } catch (error) {
    console.error('카카오 로그인 에러:', error);
  }
}
```

## ✨ 주요 기능

- 🔐 **인증 시스템**: Supabase Auth 기반 사용자 인증 (카카오, Google 지원)
- 🎯 **인터랙티브 온보딩**: 스와이프 가능한 온보딩 화면
- 💾 **로컬 스토리지**: MMKV 기반 고성능 키-값 스토리지
- 🎨 **NativeWind**: Tailwind CSS 기반 스타일링
- 🚀 **React Native Reanimated**: 부드러운 애니메이션
- 📱 **Expo Router**: 파일 기반 네비게이션
- 🎭 **Expo 53**: 최신 Expo SDK 지원
- 🏗️ **New Architecture**: React Native 새 아키텍처 지원
- ⚡ **ccache**: iOS 빌드 속도 최적화
- 🌙 **App Context**: 앱 전역 상태 관리 (컬러 스킴 등)
- 🚨 **Firebase Crashlytics**: 실시간 에러 추적 및 분석

## 🚀 시작하기

### 필수 요구사항

- Node.js (v18 이상)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/) 또는 [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)

### 설치 및 실행

1. **프로젝트 준비**:
```bash
cd rn-expo-boilerplate
npm install
```

2. **네이티브 종속성 설치**:
```bash
# iOS/Android 플랫폼 파일 생성 및 네이티브 종속성 설치
npx expo prebuild --clean

# 플랫폼별 실행
npx expo run:ios
npx expo run:android
```

3. **개발 서버 시작**:
```bash
# 개발 서버 시작
npm start

# 특정 플랫폼으로 실행
npm run ios      # iOS 시뮬레이터
npm run android  # Android 에뮬레이터
npm run web      # 웹 브라우저
```

### ccache를 이용한 빌드 최적화 (iOS)

iOS 빌드 속도를 향상시키기 위해 ccache를 사용할 수 있습니다.

#### ccache 설치 (macOS)

```bash
# Homebrew를 통한 설치
brew install ccache

# 설치 확인
ccache --version
```

#### ccache 사용법

```bash
# 스크립트 실행 권한 부여
npm run script:permission

# ccache를 사용한 빌드
npm run ios:cc          # iOS 디바이스용 빌드
npm run ios:cc:sim      # iOS 시뮬레이터용 빌드
npm run android:cc      # Android 빌드

# ccache 통계 및 관리
npm run ios:cc:stats    # iOS 캐시 통계만 확인
npm run android:cc:stats # Android 캐시 통계만 확인

# 고급 ccache 관리 (build-with-ccache.sh 직접 사용)
./scripts/build-with-ccache.sh ios --clear          # iOS 캐시 완전 삭제
./scripts/build-with-ccache.sh android --clear      # Android 캐시 완전 삭제
./scripts/build-with-ccache.sh ios --reset-stats    # iOS 캐시 통계 초기화
```

더 자세한 정보는 [ccache 공식 문서](https://ccache.dev/), [React Native 공식 문서](https://reactnative.dev/docs/build-speed)를 참고하세요.

## 📁 프로젝트 구조

```
├── src/                          # 소스 코드 루트
│   ├── app/                      # Expo Router 기반 앱 구조
│   │   ├── _layout.tsx           # 루트 레이아웃 (GestureHandlerRootView 설정)
│   │   ├── index.tsx             # 메인 엔트리 포인트
│   │   ├── +not-found.tsx        # 404 페이지
│   │   ├── (app)/                # 메인 앱 화면들
│   │   │   ├── _layout.tsx       # 앱 레이아웃
│   │   │   └── index.tsx         # 홈 화면
│   │   └── (auth)/               # 인증 관련 화면들
│   │       ├── _layout.tsx       # 인증 레이아웃
│   │       └── index.tsx         # 로그인/회원가입 화면
│   ├── components/               # 재사용 가능한 컴포넌트
│   │   ├── LoadingScreen.tsx     # 로딩 화면 컴포넌트
│   │   └── OnboardingScreen.tsx  # 온보딩 화면 컴포넌트
│   ├── constants/                # 상수 정의
│   │   ├── auth.ts               # 인증 관련 상수
│   │   └── onboarding.ts         # 온보딩 관련 상수
│   ├── context/                  # 리액트 컨텍스트
│   │   ├── AppContext.tsx        # 앱 전역 상태 관리
│   │   └── AuthContext.tsx       # 인증 상태 관리
│   ├── helpers/                  # 유틸리티 함수들
│   │   ├── crashlytics.ts        # Firebase Crashlytics 헬퍼
│   │   ├── storage.ts            # MMKV 스토리지 헬퍼
│   │   └── supabase/             # Supabase 관련 모듈들
│   │       ├── client.ts         # Supabase 클라이언트 생성 및 설정
│   │       ├── env.ts            # 환경 변수 스키마 및 검증
│   │       ├── SupabaseAuthHelper.ts # 인증 헬퍼 함수들
│   │       ├── types.ts          # 공통 타입 정의
│   │       └── utils.ts          # 유틸리티 함수들
│   ├── hooks/                    # 커스텀 React 훅
│   │   └── useOnboarding.ts      # 온보딩 상태 관리 훅
│   └── types/                    # 타입 정의
│       ├── app.ts                # 앱 관련 타입 정의
│       └── auth.ts               # 인증 관련 타입 정의
├── modules/                      # 네이티브 모듈 (Expo Modules API)
│   ├── kakao-core/               # 카카오 SDK 코어 모듈
│   │   ├── android/              # Android 네이티브 구현
│   │   │   ├── build.gradle      # Gradle 빌드 설정
│   │   │   └── src/main/java/    # Kotlin 소스 코드
│   │   ├── ios/                  # iOS 네이티브 구현
│   │   │   ├── KakaoCore.podspec # CocoaPods 설정
│   │   │   └── *.swift           # Swift 소스 코드
│   │   ├── src/                  # TypeScript 인터페이스
│   │   ├── expo-module.config.json
│   │   └── index.ts
│   ├── kakao-user/               # 카카오 사용자 인증 모듈
│   │   ├── android/              # Android 네이티브 구현
│   │   ├── ios/                  # iOS 네이티브 구현
│   │   ├── src/                  # TypeScript 인터페이스
│   │   ├── expo-module.config.json
│   │   └── index.ts
│   └── kakaosdk-version.json     # 카카오 SDK 버전 관리
├── plugins/                      # Expo Config Plugins
│   ├── kakao/                    # 카카오 설정 플러그인
│   │   ├── build/                # 빌드된 JavaScript 파일
│   │   ├── src/                  # TypeScript 소스 코드
│   │   ├── index.js              # 플러그인 진입점
│   │   └── tsconfig.json
│   ├── some/                     # 기타 플러그인 예시
│   └── tsconfig.json             # 플러그인 전체 TypeScript 설정
├── assets/                       # 정적 자산
│   ├── fonts/                    # 폰트 파일들
│   │   └── SpaceMono-Regular.ttf
│   └── images/                   # 이미지 파일들
│       ├── onboarding/           # 온보딩 이미지들
│       ├── icon.png              # 앱 아이콘
│       ├── splash-icon.png       # 스플래시 아이콘
│       └── ...                   # 기타 이미지들
├── scripts/                      # 빌드 스크립트
│   └── build-with-ccache.sh      # ccache 빌드 스크립트
├── android/                      # Android 프로젝트 (expo prebuild로 생성)
├── ios/                          # iOS 프로젝트 (expo prebuild로 생성)
├── google-services.json          # Firebase Android 설정
├── GoogleService-Info.plist      # Firebase iOS 설정
├── app.json                      # Expo 앱 설정
├── package.json                  # npm 패키지 설정
├── tsconfig.json                 # TypeScript 설정
├── tailwind.config.js            # TailwindCSS 설정
├── metro.config.js               # Metro 번들러 설정
├── babel.config.js               # Babel 설정
├── firebase.json                 # Firebase 설정
└── global.css                    # 전역 CSS (NativeWind)
```

## 🔧 구성 요소 상세

### 📱 온보딩 시스템

#### OnboardingScreen 컴포넌트
- **위치**: `src/components/OnboardingScreen.tsx`
- **기능**: 
  - 스와이프 제스처 지원
  - 페이지 인디케이터
  - 부드러운 애니메이션
  - 완료 버튼
- **사용법**:
```typescript
// 온보딩 페이지 데이터 수정
// src/constants/onboarding.ts
export const ONBOARDING_PAGES = [
  {
    title: "새로운 제목",
    subtitle: "새로운 설명",
    image: require("~/assets/images/onboarding/new-screen.png"),
  },
  // 추가 페이지...
];
```

#### useOnboarding 훅
- **위치**: `src/hooks/useOnboarding.ts`
- **기능**: 온보딩 완료 상태 관리
- **사용법**:
```typescript
const { isLoading, hasSeenOnboarding } = useOnboarding();
```

### 🔐 인증 시스템 (Supabase Auth)

#### Supabase 모듈 구조
새로운 구조에서는 Supabase 관련 기능이 모듈별로 분리되어 있습니다:

- **`client.ts`**: Supabase 클라이언트 생성 및 MMKV 스토리지 연동
- **`env.ts`**: 환경 변수 스키마 정의 및 검증 (zod 사용)
- **`SupabaseAuthHelper.ts`**: 인증 관련 헬퍼 함수들 (Google, Kakao, Facebook 로그인)
- **`types.ts`**: 공통 타입 정의 (Result, AuthResponse 등)
- **`utils.ts`**: 유틸리티 함수들 (createAuthResult 등)

#### AuthContext 컴포넌트
- **위치**: `src/context/AuthContext.tsx`
- **기능**: 
  - Supabase 기반 사용자 인증 관리
  - 로그인/로그아웃 상태 추적
  - 자동 세션 복원
  - Crashlytics 사용자 정보 연동
- **설정**: `src/app/_layout.tsx`에서 `AuthProvider`로 앱 전체를 감싸야 함

#### useAuth 훅 사용법
```typescript
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { authUser, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <View>
      {authUser ? (
        <Text>로그인됨: {authUser.email}</Text>
      ) : (
        <Text>로그인이 필요합니다</Text>
      )}
    </View>
  );
}
```

#### Supabase Auth Helper 사용법

##### 기본 세션 관리
```typescript
import { SupabaseAuthHelper } from "@/helpers/supabase/SupabaseAuthHelper";

// 세션 상태 확인
const { data: { session } } = await SupabaseAuthHelper.getSession();

// 인증 상태 변화 감지
SupabaseAuthHelper.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
  console.log('Session:', session?.user);
});
```

##### Google 로그인 사용법
**⚠️ 중요**: Google 로그인을 사용하기 전에 반드시 `configureGoogleSignIn()`를 먼저 호출해야 합니다.

```typescript
import { SupabaseAuthHelper } from "@/helpers/supabase/SupabaseAuthHelper";
import { useEffect } from "react";

function LoginScreen() {
  // 컴포넌트 마운트 시 Google Sign-In 설정
  useEffect(() => {
    SupabaseAuthHelper.configureGoogleSignIn();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const { success, error, data } = await SupabaseAuthHelper.signInWithGoogle();
      
      if (success) {
        console.log('로그인 성공:', data.user?.email);
        // 로그인 성공 후 처리
      } else {
        console.error('로그인 실패:', error.message);
        // 에러 처리
      }
    } catch (error) {
      console.error('로그인 에러:', error);
    }
  };

  return (
    <View>
      <Button 
        title="Google로 로그인" 
        onPress={handleGoogleSignIn} 
      />
    </View>
  );
}
```

##### 카카오 로그인 사용법
**⚠️ 중요**: 카카오 로그인을 사용하기 전에 반드시 `initializeKakaoSDK()`를 먼저 호출해야 합니다.

```typescript
import { SupabaseAuthHelper } from "@/helpers/supabase/SupabaseAuthHelper";
import { useEffect } from "react";

function LoginScreen() {
  // 컴포넌트 마운트 시 Kakao SDK 초기화
  useEffect(() => {
    SupabaseAuthHelper.initializeKakaoSDK();
  }, []);

  const handleKakaoSignIn = async () => {
    try {
      const { success, error, data } = await SupabaseAuthHelper.signInWithKakao();
      
      if (success) {
        console.log('카카오 로그인 성공:', data.user?.email);
        // 로그인 성공 후 처리
      } else {
        console.error('카카오 로그인 실패:', error.message);
        // 에러 처리
      }
    } catch (error) {
      console.error('카카오 로그인 에러:', error);
    }
  };

  return (
    <View>
      <Button 
        title="카카오로 로그인" 
        onPress={handleKakaoSignIn} 
      />
    </View>
  );
}
```

##### 로그아웃
```typescript
// 사용자 로그아웃
await SupabaseAuthHelper.signOut();
```

#### Supabase 클라이언트 직접 사용법

고급 사용자의 경우 Supabase 클라이언트를 직접 사용하여 데이터베이스 작업을 수행할 수 있습니다:

```typescript
import { supabase } from "@/helpers/supabase/client";

// 직접 클라이언트 사용 예시
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId);

// 커스텀 클라이언트 생성 (다른 설정이 필요한 경우)
import { createSupabaseClient } from "@/helpers/supabase/client";

const customClient = createSupabaseClient({
  url: "https://custom-url.supabase.co",
  anonKey: "custom-anon-key"
});
```

#### 환경 변수 검증

`env.ts` 모듈을 사용하여 환경 변수의 유효성을 확인할 수 있습니다:

```typescript
import { env, EnvSchema } from "@/helpers/supabase/env";

// 환경 변수는 자동으로 검증됨
console.log(env.EXPO_PUBLIC_SUPABASE_URL); // 검증된 URL
console.log(env.EXPO_PUBLIC_SUPABASE_ANON_KEY); // 검증된 키

// 런타임에 추가 검증이 필요한 경우
try {
  const validatedEnv = EnvSchema.parse(process.env);
  console.log("환경 변수 검증 성공");
} catch (error) {
  console.error("환경 변수 검증 실패:", error);
}
```

#### KakaoUserModule 직접 사용법

**⚠️ 고급 사용법**: SupabaseAuthHelper 외에 카카오 SDK의 추가 기능이 필요한 경우, KakaoUserModule을 직접 호출할 수 있습니다.

##### 모듈 Import
```typescript
import KakaoUserModule from "~/modules/kakao-user";
```

##### 사용 가능한 메서드들

**1. 직접 카카오 로그인**
```typescript
try {
  const result = await KakaoUserModule.login();
  
  if (result.success && result.token) {
    console.log('카카오 로그인 성공');
    console.log('Access Token:', result.token.accessToken);
    console.log('Refresh Token:', result.token.refreshToken);
    console.log('토큰 만료 시간:', result.token.accessTokenExpiresAt);
    console.log('스코프:', result.token.scopes);
  } else {
    console.error('카카오 로그인 실패:', result.error);
  }
} catch (error) {
  console.error('카카오 로그인 에러:', error);
}
```

**2. 로그인 상태 확인**
```typescript
try {
  const result = await KakaoUserModule.isLogined();
  
  if (result.isLogined) {
    console.log('카카오에 로그인되어 있음');
  } else {
    console.log('카카오에 로그인되어 있지 않음');
  }
  
  if (result.error) {
    console.error('로그인 상태 확인 에러:', result.error);
  }
} catch (error) {
  console.error('로그인 상태 확인 실패:', error);
}
```

**3. 액세스 토큰 정보 가져오기**
```typescript
try {
  const result = await KakaoUserModule.getAccessToken();
  
  if (result.accessToken) {
    console.log('토큰 ID:', result.accessToken.id);
    console.log('앱 ID:', result.accessToken.appId);
    console.log('만료까지 남은 시간(초):', result.accessToken.expiresIn);
  } else {
    console.log('액세스 토큰이 없습니다');
  }
  
  if (result.error) {
    console.error('토큰 정보 가져오기 에러:', result.error);
  }
} catch (error) {
  console.error('토큰 정보 가져오기 실패:', error);
}
```

**4. 카카오 로그아웃**
```typescript
try {
  const result = await KakaoUserModule.logout();
  
  if (result.success) {
    console.log('카카오 로그아웃 성공');
  } else {
    console.error('카카오 로그아웃 실패:', result.error);
  }
} catch (error) {
  console.error('카카오 로그아웃 에러:', error);
}
```

**5. 카카오 연결 해제 (탈퇴)**
```typescript
try {
  const result = await KakaoUserModule.unlink();
  
  if (result.success) {
    console.log('카카오 연결 해제 성공');
    // 사용자의 카카오 계정 연결이 완전히 해제됨
  } else {
    console.error('카카오 연결 해제 실패:', result.error);
  }
} catch (error) {
  console.error('카카오 연결 해제 에러:', error);
}
```

##### 언제 직접 사용하나요?

- **세밀한 토큰 관리**: 액세스 토큰의 만료 시간을 직접 확인하고 관리해야 할 때
- **카카오 전용 기능**: Supabase를 거치지 않고 카카오 API를 직접 호출해야 할 때  
- **로그인 상태 실시간 확인**: 주기적으로 카카오 로그인 상태를 체크해야 할 때
- **완전한 연결 해제**: 사용자가 앱과 카카오 계정의 연결을 완전히 해제하려 할 때

**⚠️ 주의사항**: 
- KakaoUserModule을 직접 사용할 때는 Supabase 인증 상태와 동기화되지 않을 수 있습니다
- 대부분의 경우 `SupabaseAuthHelper`를 사용하는 것이 권장됩니다
- 직접 사용 시에는 에러 처리를 꼼꼼히 해주세요

### 🌙 앱 컨텍스트 시스템

#### AppContext 컴포넌트
- **위치**: `src/context/AppContext.tsx`
- **기능**: 
  - 앱 전역 상태 관리
  - 컬러 스킴 설정 (다크/라이트 모드)
  - 로컬 스토리지 연동
  - 에러 핸들링
- **설정**: `src/app/_layout.tsx`에서 `AppProvider`로 앱 전체를 감싸야 함

#### useAppContext 훅 사용법
```typescript
import { useAppContext } from "@/context/AppContext";

function MyComponent() {
  const { colorScheme, setColorScheme } = useAppContext();
  
  return (
    <View>
      <Text>현재 테마: {colorScheme}</Text>
      <Button 
        title="다크 모드로 변경" 
        onPress={() => setColorScheme("dark")} 
      />
    </View>
  );
}
```

#### AppContext 확장하기
AppContext에 새로운 전역 상태를 추가할 수 있습니다:

1. **타입 정의 추가** (`src/types/app.ts`):
```typescript
export interface AppContextType {
  colorScheme: ColorSchemeType;
  setColorScheme: (value: ColorSchemeType) => void;
  // 새로운 필드 추가
  foo:"bar"
}
```

2. **AppProvider에서 상태 구현** (`src/context/AppContext.tsx`):
```typescript
export function AppProvider({ children }: PropsWithChildren) {
  const [userColorScheme, setUserColorScheme] = useState<ColorSchemeType>("dark");
  const [foo, setFoo] = useState<string>("bar");
  
  // ... existing code ...
  
  return (
    <AppContext value={{ 
      colorScheme: userColorScheme, 
      setColorScheme,
      foo,
      setFoo
    }}>
      {children}
    </AppContext>
  );
}
```

### 💾 스토리지 시스템

#### StorageHelper
- **위치**: `src/helpers/storage.ts`
- **기능**: MMKV 기반 로컬 스토리지 헬퍼
- **사용법**:
```typescript
import { StorageHelper } from "@/helpers/storage";

// 데이터 저장 (JSON 직렬화 자동 처리)
await StorageHelper.setItem("user_preferences", {
  theme: "dark",
  language: "ko"
});
await StorageHelper.setItem("username", "john_doe");
await StorageHelper.setItem("login_count", 5);

// 데이터 읽기 (JSON 파싱 자동 처리)
const preferences = await StorageHelper.getItem("user_preferences");
const username = await StorageHelper.getItem("username");
const loginCount = await StorageHelper.getItem("login_count");

// 데이터 삭제
await StorageHelper.removeItem("username");

// 전체 삭제
await StorageHelper.clear();
```

#### 실제 사용 예시 (AppContext에서):
```typescript
// AppContext.tsx에서 컬러 스킴 저장/로드
const storedScheme = await StorageHelper.getItem(COLOR_SCHEME_KEY);
if (storedScheme) {
  setUserColorScheme(storedScheme as ColorSchemeType);
}

await StorageHelper.setItem(COLOR_SCHEME_KEY, newScheme);
```

### 🚨 Firebase Crashlytics

Firebase Crashlytics는 앱의 오류를 실시간으로 추적하고 분석하는 서비스입니다.

> **📋 참고**: Crashlytics를 사용하려면 먼저 [Firebase 프로젝트 설정](#3-3-firebase-crashlytics-설정-선택사항)에서 서비스를 활성화해야 합니다.

#### Crashlytics Helper 사용법
- **위치**: `src/helpers/crashlytics.ts`
- **기능**: 
  - 자동 에러 추적
  - 커스텀 에러 리포팅
  - 사용자 속성 설정
  - 로그 기록

#### 초기화 (중요)
**⚠️ 앱의 최상위 컴포넌트에서 반드시 `initialize()` 함수를 호출해야 합니다.**

앱 시작 시 Crashlytics를 초기화하는 예시 (`src/app/_layout.tsx`):
```typescript
import { useEffect } from "react";
import { CrashlyticsHelper } from "@/helpers/crashlytics";

export default function RootLayout() {
  // 앱 시작 시 Crashlytics 초기화
  useEffect(() => {
    async function initCrashlytics() {
      try {
        await CrashlyticsHelper.initialize();
        console.log("Crashlytics 초기화 완료");
      } catch (error) {
        console.error("Crashlytics 초기화 실패:", error);
      }
    }
    
    initCrashlytics();
  }, []);

  return (
    // ... your app layout
  );
}
```

#### 기본 사용법:
```typescript
import { CrashlyticsHelper } from "@/helpers/crashlytics";

// 에러 기록
try {
  // 위험한 작업
  const result = riskyOperation();
} catch (error) {
  CrashlyticsHelper.recordError(
    error as Error,
    "USER_ACTION_FAILED"
  );
}

// 사용자 정보 설정 (로그인 시)
await CrashlyticsHelper.setUserId("user123");
await CrashlyticsHelper.setAttributes({
  email: "user@example.com",
  plan: "premium",
  version: "1.0.0"
});

// 커스텀 로그 (사용자 행동 추적)
CrashlyticsHelper.log("User viewed product page");
CrashlyticsHelper.log("Payment process started");
```

#### 기술 문서:
- [React Native Firebase 공식 문서](https://rnfirebase.io/)
- [Firebase Crashlytics 가이드](https://firebase.google.com/docs/crashlytics)


### 🎨 스타일링

#### NativeWind 설정
- **Tailwind CSS**: 클래스 기반 스타일링
- **반응형 디자인**: 자동 화면 크기 대응
- **다크 모드**: 시스템 설정 자동 감지

#### 사용 예시:
```typescript
<View className="flex-1 bg-white dark:bg-gray-900">
  <Text className="text-xl font-bold text-center">
    Hello World
  </Text>
</View>
```

## 🔌 Custom Plugin 개발

### Plugin 구조 이해

이 프로젝트는 `plugins/` 디렉토리에서 Expo Config Plugin을 직접 개발할 수 있도록 구성되어 있습니다.

#### 현재 Plugin 구조
```
plugins/
├── tsconfig.json              # TypeScript Project References 설정
└── some/                     # 플러그인 예시
    ├── index.js              # 플러그인 진입점
    ├── tsconfig.json         # TypeScript 설정
    ├── src/                  # TypeScript 소스 코드
    │   └── index.ts          # 메인 플러그인 파일
    └── build/                # 빌드된 JavaScript 파일들 (자동 생성)
```

### 새로운 Custom Plugin 생성하기

#### 1. 플러그인 디렉토리 생성

새로운 플러그인을 만들고 싶다면 `plugins/` 디렉토리에 플러그인명으로 새 디렉토리를 생성하세요:

```bash
mkdir plugins/my-custom-plugin
```

#### 2. 플러그인 디렉토리 구조 설정

```
plugins/my-custom-plugin/
├── index.js                  # 플러그인 진입점 (필수)
├── tsconfig.json            # TypeScript 설정 (필수)
├── src/                     # TypeScript 소스 코드 디렉토리
│   └── index.ts             # 메인 플러그인 파일 (필수)
└── build/                   # 빌드 결과물 (자동 생성됨, 생성하지 마세요)
```

#### 3. 필수 파일 생성

**`index.js` (플러그인 진입점)**:
```javascript
module.exports = require("./build");
```

**`tsconfig.json` (TypeScript 설정)**:
```json
{
	"extends": "expo-module-scripts/tsconfig.plugin",
	"compilerOptions": {
		"outDir": "build",
		"rootDir": "src"
	},
	"include": ["./src"],
	"exclude": ["**/__mocks__/*", "**/__tests__/*"]
}
```

**`src/index.ts` (메인 플러그인 파일)**:
```typescript
import type { ConfigPlugin } from "@expo/config-plugins";

export interface MyCustomPluginOptions {
	message?: string;
	enabled?: boolean;
}

export const withMyCustomPlugin: ConfigPlugin<MyCustomPluginOptions> = (
	config,
	options = {},
) => {
	if (!options.enabled) {
		console.log("🔸 My Custom Plugin: Disabled in configuration");
		return config;
	}

	console.log("🟢 My Custom Plugin: Configuration started");
	console.log("  Message:", options.message || "Default message");

	// 여기에 플러그인 로직을 추가하세요
	// 예: Android Manifest 수정, iOS Info.plist 수정 등

	console.log("✅ My Custom Plugin: Configuration completed");

	return config;
};

export default withMyCustomPlugin;
```

#### 4. 메인 tsconfig.json에 플러그인 등록

`plugins/tsconfig.json` 파일을 수정하여 새로운 플러그인을 TypeScript Project References에 추가하세요:

```json
{
	"files": [],
	"references": [
		{ "path": "./auth" },
		{ "path": "./some" },
		{ "path": "./my-custom-plugin" }
	]
}
```

#### 5. 플러그인 빌드

플러그인을 빌드하여 사용 가능한 JavaScript 파일을 생성하세요:

```bash
npm run build:plugin
```

이 명령어는 `tsc --build ./plugins`를 실행하여 모든 플러그인을 빌드합니다.

#### 6. app.json에서 플러그인 사용

빌드 완료 후 `app.json`에서 플러그인을 사용할 수 있습니다:

```json
{
  "expo": {
    "plugins": [
      [
        "./plugins/my-custom-plugin",
        {
          "message": "Hello from my custom plugin!",
          "enabled": true
        }
      ]
    ]
  }
}
```

#### 개발 워크플로우
1. `src/index.ts`에서 플러그인 로직 개발
2. `npm run build:plugin`으로 빌드
3. `npx expo prebuild --clear`로 테스트
4. 네이티브 설정이 올바르게 적용되었는지 확인

## 🛠️ 설정

### 앱 정보 수정

1. **app.json**에서 앱 기본 정보 수정:
```json
{
  "expo": {
    "name": "당신의 앱 이름",
    "slug": "your-app-slug",
    "bundleIdentifier": "com.yourcompany.yourapp"
  }
}
```

2. **package.json**에서 프로젝트 정보 수정:
```json
{
  "name": "your-app-name",
  "version": "1.0.0"
}
```

### 온보딩 이미지 추가

1. 이미지를 다음 경로에 추가:
   ```
   assets/images/onboarding/screen-1.png
   assets/images/onboarding/screen-2.png
   assets/images/onboarding/screen-3.png
   ```

2. `src/constants/onboarding.ts`에서 이미지 경로 수정:
   ```typescript
   image: require("~/assets/images/onboarding/your-image.png")
   ```

## 📦 향후 추가 예정 기능

이 보일러플레이트는 지속적으로 발전하고 있습니다. 다음 기능들이 추가될 예정입니다:

- 🌍 **다국어 지원**: i18next 기반 국제화
- 📱 **푸시 알림**: Firebase Cloud Messaging
- 💰 **인앱 결제**: RevenueCat 연동
- 🎯 **분석**: Firebase Analytics
- 📋 **폼 관리**: React Hook Form

## 🧰 사용된 주요 라이브러리

- **Expo 53**: 최신 Expo SDK
- **React Native 0.79**: 최신 React Native
- **Expo Router 5**: 파일 기반 라우팅
- **React Native Reanimated 3**: 고성능 애니메이션
- **React Native Gesture Handler**: 제스처 처리
- **MMKV**: 고성능 키-값 스토리지
- **NativeWind 4**: Tailwind CSS for React Native
- **TypeScript**: 타입 안전성
- **Supabase**: 백엔드 서비스 (인증, 데이터베이스)
- **Firebase**: Crashlytics, Analytics 등

## 📚 유용한 링크

- [Expo 53 문서](https://docs.expo.dev/)
- [Supabase 문서](https://supabase.com/docs)
- [Kakao Developers](https://developers.kakao.com/)
- [React Native 새 아키텍처](https://reactnative.dev/docs/the-new-architecture/landing-page)
- [NativeWind 문서](https://www.nativewind.dev/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [MMKV 문서](https://github.com/mrousavy/react-native-mmkv)
- [React Native Firebase](https://rnfirebase.io/)

## 🤝 기여하기

이 보일러플레이트를 개선하고 싶으시다면:

1. Fork 후 새 브랜치 생성
2. 기능 추가 또는 버그 수정
3. Pull Request 생성

## 📄 라이선스

MIT License

---

**즐거운 개발 되세요! 🚀**

궁금한 점이 있으시면 언제든 이슈를 남겨주세요.