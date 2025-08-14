# React Native Expo 보일러플레이트

React Native 앱을 빠르게 시작할 수 있는 보일러플레이트입니다. Expo 53 기반으로 제작되었으며, 온보딩, 로컬 스토리지, 애니메이션 등 핵심 기능들이 구현되어 있습니다.

## ✨ 주요 기능

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
npm run ios:cc          # 디바이스용 빌드
npm run ios:cc:sim      # 시뮬레이터용 빌드
npm run android:cc      # Android 빌드

# ccache 통계 확인
npm run ios:cc:stats
npm run android:cc:stats
```

더 자세한 정보는 [ccache 공식 문서](https://ccache.dev/), [React Native 공식 문서](https://reactnative.dev/docs/build-speed)를 참고하세요.

## 📁 프로젝트 구조

```
├── src/                          # 소스 코드 루트
│   ├── app/                      # Expo Router 기반 앱 구조
│   │   ├── _layout.tsx           # 루트 레이아웃 (GestureHandlerRootView 설정)
│   │   ├── index.tsx             # 메인 엔트리 포인트
│   │   └── (app)/                # 메인 앱 화면들
│   │       ├── _layout.tsx       # 앱 레이아웃
│   │       └── index.tsx         # 홈 화면
│   ├── components/               # 재사용 가능한 컴포넌트
│   │   ├── LoadingScreen.tsx     # 로딩 화면 컴포넌트
│   │   └── OnboardingScreen.tsx  # 온보딩 화면 컴포넌트
│   ├── constants/                # 상수 정의
│   │   └── onboarding.ts         # 온보딩 관련 상수
│   ├── context/                  # 리액트 컨텍스트
│   │   └── AppContext.tsx        # 앱 전역 상태 관리
│   ├── helpers/                  # 유틸리티 함수들
│   │   ├── crashlytics.ts        # Firebase Crashlytics 헬퍼
│   │   └── storage.ts            # MMKV 스토리지 헬퍼
│   ├── hooks/                    # 커스텀 React 훅
│   │   └── useOnboarding.ts      # 온보딩 상태 관리 훅
│   └── types/                    # 타입 정의
│       └── app.ts                # 앱 관련 타입 정의
├── assets/                       # 정적 자산
│   ├── fonts/                    # 폰트 파일들
│   └── images/                   # 이미지 파일들
│       └── onboarding/           # 온보딩 이미지들
├── scripts/                      # 빌드 스크립트
│   ├── build-with-ccache.sh      # ccache 빌드 스크립트
│   └── cache-utils.sh            # 캐시 유틸리티

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

#### 필수 설정 (Required Setup)

**1. Firebase 프로젝트 설정:**
1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. `google-services.json` (Android)와 `GoogleService-Info.plist` (iOS) 다운로드
3. 이 파일들을 프로젝트 루트 디렉토리에 배치

**2. app.json 설정:**
`app.json`에서 다운로드한 파일 경로를 `googleServicesFile` 속성에 추가:
```json
{
  "expo": {
    "android": {
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "plugins": [
      "@react-native-firebase/app",
      "@react-native-firebase/crashlytics"
    ]
  }
}
```

#### Crashlytics Helper 사용법
- **위치**: `src/helpers/crashlytics.ts`
- **기능**: 
  - 자동 에러 추적
  - 커스텀 에러 리포팅
  - 사용자 속성 설정
  - 로그 기록

#### 기본 사용법:
```typescript
import { CrashlyticsHelper } from "@/helpers/crashlytics";

// 에러 기록
try {
  // 위험한 작업
} catch (error) {
  CrashlyticsHelper.recordError(
    error as Error,
    "CUSTOM_ERROR_CODE"
  );
}

// 사용자 정보 설정
await CrashlyticsHelper.setUserId("user123");
await CrashlyticsHelper.setAttributes({
  email: "user@example.com",
  plan: "premium"
});

// 커스텀 로그
CrashlyticsHelper.log("User performed action X");
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

- 🔐 **인증 시스템**: Firebase Auth, 소셜 로그인
- 🌍 **다국어 지원**: i18next 기반 국제화
- 📱 **푸시 알림**: Firebase Cloud Messaging
- 💰 **인앱 결제**: RevenueCat 연동
- 🎯 **분석**: Firebase Analytics
- 📋 **폼 관리**: React Hook Form
- 🎭 **아이콘**: Expo Vector Icons

## 🧰 사용된 주요 라이브러리

- **Expo 53**: 최신 Expo SDK
- **React Native 0.79**: 최신 React Native
- **Expo Router 5**: 파일 기반 라우팅
- **React Native Reanimated 3**: 고성능 애니메이션
- **React Native Gesture Handler**: 제스처 처리
- **MMKV**: 고성능 키-값 스토리지
- **NativeWind 4**: Tailwind CSS for React Native
- **TypeScript**: 타입 안전성
- **Firebase**: Crashlytics, Analytics 등

## 📚 유용한 링크

- [Expo 53 문서](https://docs.expo.dev/)
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