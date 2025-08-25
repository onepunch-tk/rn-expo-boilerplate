// ========================================================================================
// OnboardingScreen.tsx - 스와이프 가능한 온보딩 화면 컴포넌트
// ========================================================================================

import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
	Dimensions,
	type ImageSourcePropType, // require() 이미지 타입
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	FadeInUp,
	interpolate,
	runOnJS,
	type SharedValue,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ONBOARDING_KEY, ONBOARDING_PAGES } from "@/constants/onboarding";
import { StorageHelper } from "@/helpers/storage";

// ========================================================================================
// Type Definitions
// ========================================================================================

/**
 * 페이지 인디케이터와 애니메이션에 필요한 공통 속성
 * - page: 현재 페이지 인덱스
 * - currentPage: 활성 페이지 인덱스
 * - translateX: 스와이프 애니메이션용 공유 값
 */
interface PageIndicator {
	page: number;
	currentPage: number;
	translateX: SharedValue<number>;
}

/**
 * 개별 온보딩 페이지의 콘텐츠 속성
 * - title: 페이지 제목 (선택적)
 * - subtitle: 페이지 부제목 (선택적)
 * - image: require() 형태의 이미지 소스 (선택적)
 */
interface PageProps {
	title?: string;
	subtitle?: string;
	image?: ImageSourcePropType;
}

// ========================================================================================
// Constants
// ========================================================================================

/**
 * 화면 크기 상수
 * - 애니메이션 계산과 레이아웃에 사용
 * - window 크기를 기준으로 정적 계산 (성능 최적화)
 */
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ========================================================================================
// ContentPage Component - 개별 온보딩 페이지 렌더링
// ========================================================================================

/**
 * 개별 온보딩 페이지를 렌더링하는 컴포넌트
 * - 6:4 비율의 이미지/텍스트 레이아웃
 * - 스와이프 애니메이션 지원 (translateX, scale, opacity)
 * - 성능 최적화: 인접하지 않은 페이지는 숨김 처리
 */
function ContentPage({
	title,
	subtitle,
	image,
	page,
	currentPage,
	translateX,
}: PageProps & PageIndicator) {
	// 이미지 크기: 화면 너비의 90% (반응형)
	const imageSize = SCREEN_WIDTH * 0.9;

	/**
	 * 단순한 슬라이딩 애니메이션 스타일
	 * - translateX만 사용한 순수 슬라이딩 효과
	 * - 복잡한 보간이나 스케일/투명도 효과 제거
	 * - 컨텐츠 사라짐 방지를 위해 opacity 제거
	 */
	const pageStyle = useAnimatedStyle(() => {
		"worklet";

		// 기본 위치 계산: 현재 페이지 기준으로 좌우 배치
		const offset = (page - currentPage) * SCREEN_WIDTH;
		// 실제 표시 위치: 기본 위치 + 스와이프 이동량
		const translateXValue = offset + translateX.value;

		// 모든 페이지에 대해 단순한 translateX만 적용
		// opacity 제거로 컨텐츠 사라짐 방지
		return {
			transform: [{ translateX: translateXValue }],
		};
	});

	return (
		<Animated.View
			style={[
				pageStyle,
				{
					width: SCREEN_WIDTH, // 명시적 너비 설정
				},
			]}
			className="flex-1 absolute h-full left-0 top-0"
		>
			{/* 이미지 영역: 전체 화면의 60% (flex-[6]) */}
			<View className="flex-[6] justify-end items-center pb-4">
				<Image
					style={{
						width: imageSize,
						height: imageSize,
					}}
					source={image}
					contentFit="contain" // 이미지 비율 유지하며 영역에 맞춤
				/>
			</View>

			{/* 텍스트 영역: 전체 화면의 40% (flex-[4]) */}
			<View className="flex-[4] justify-start items-center px-8 pt-4">
				{/* 제목: 최대 2줄, 3xl 크기, 굵은 글꼴 */}
				<Text
					className="text-3xl font-bold text-center mb-3 w-full"
					numberOfLines={2}
				>
					{title}
				</Text>

				{/* 부제목: 최대 2줄, 기본 크기, 말줄임표 처리 */}
				<Text
					className="text-base text-center leading-5 w-full"
					numberOfLines={2}
					ellipsizeMode="tail" // 텍스트가 길면 끝부분에 "..." 표시
				>
					{subtitle}
				</Text>
			</View>
		</Animated.View>
	);
}

// ========================================================================================
// PaginationDot Component - 스마트 페이지 인디케이터
// ========================================================================================

/**
 * 개별 페이지 인디케이터 점(dot)을 렌더링하는 컴포넌트
 * - 실시간 스와이프 진행률에 따른 크기/투명도 변화
 * - 현재 페이지: 큰 점 (24px), 다음 대상 페이지: 점진적 확대
 * - 부드러운 전환 애니메이션으로 사용자에게 명확한 피드백 제공
 */
function PaginationDot({ page, currentPage, translateX }: PageIndicator) {
	/**
	 * 단순한 페이지 인디케이터 스타일
	 * - 현재 페이지만 강조하는 단순한 표시
	 * - 복잡한 진행률 애니메이션 제거
	 */
	const dotStyle = useAnimatedStyle(() => {
		"worklet";

		const isActive = page === currentPage;
		const progress = Math.abs(translateX.value / SCREEN_WIDTH);

		// 단순한 활성/비활성 표시
		if (isActive) {
			// 현재 페이지: 큰 점
			const width = interpolate(progress, [0, 0.5], [24, 16], "clamp");
			const opacity = interpolate(progress, [0, 0.5], [1, 0.7], "clamp");
			return { width, opacity };
		} else {
			// 다른 페이지: 작은 점
			return {
				width: 8,
				opacity: 0.3,
			};
		}
	});

	return (
		<Animated.View
			style={[dotStyle]}
			className="h-2 bg-black rounded-full mx-1" // 높이 2px, 검은색, 원형, 좌우 마진
		/>
	);
}

// ========================================================================================
// OnboardingScreen Component - 메인 온보딩 화면
// ========================================================================================

/**
 * 스와이프 가능한 온보딩 화면 메인 컴포넌트
 *
 * 주요 기능:
 * - 좌우 스와이프로 페이지 전환
 * - 거리 기반 + 속도 기반 스와이프 감지
 * - 부드러운 스프링 애니메이션
 * - 안전 영역을 고려한 페이지 인디케이터 배치
 * - 성능 최적화된 렌더링
 */
export function OnboardingScreen() {
	// ========================================================================================
	// State & Hooks
	// ========================================================================================

	const [currentPage, setCurrentPage] = useState(0); // 현재 활성 페이지 인덱스
	const translateX = useSharedValue(0); // 스와이프 이동량 (UI 스레드 공유 값)
	const insets = useSafeAreaInsets(); // 안전 영역 정보 (노치, 홈 버튼 등 고려)

	// ========================================================================================
	// Helper Functions
	// ========================================================================================

	/**
	 * 페이지 변경 처리 함수
	 * - React 상태 업데이트 (currentPage)
	 * - 애니메이션 값 초기화 (translateX)
	 *
	 * @param newPage - 변경할 페이지 인덱스
	 */
	function handlePageChange(newPage: number) {
		setCurrentPage(newPage);
		translateX.value = 0; // 중요: 새 페이지에서 애니메이션 초기화
	}

	async function handleDone() {
		router.replace("/");
		await StorageHelper.setItem(ONBOARDING_KEY, "true");
	}

	// ========================================================================================
	// Gesture Configuration
	// ========================================================================================

	/**
	 * 팬 제스처 설정 - 최신 react-native-gesture-handler API 사용
	 * 3단계 라이프사이클: onBegin → onChange → onFinalize
	 */
	const panGesture = Gesture.Pan()
		/**
		 * 제스처 시작 시 호출
		 * - 스와이프 시작을 감지하고 상태 업데이트
		 */
		/**
		 * 제스처 진행 중 지속적으로 호출
		 * - 실시간으로 스와이프 이동량을 translateX에 반영
		 * - 60fps로 부드러운 추종 효과
		 */
		.onChange((event) => {
			"worklet";
			translateX.value = event.translationX; // 시작점으로부터의 누적 이동량
		})

		/**
		 * 제스처 종료 시 호출 - 페이지 전환 여부 결정
		 * - 거리 기반 + 속도 기반의 하이브리드 감지 로직
		 * - 부드러운 스프링 애니메이션으로 최종 위치 이동
		 */
		.onFinalize((event) => {
			"worklet";
			// === 스와이프 감지 임계값 설정 ===
			const threshold = SCREEN_WIDTH * 0.25; // 화면 너비의 25% 이상 이동 시 페이지 전환
			const velocity = event.velocityX; // 스와이프 종료 시점의 속도 (px/s)
			const absVelocity = Math.abs(velocity); // 속도의 절댓값

			// === 속도 기반 감지 (빠른 스와이프) ===
			// 짧은 거리라도 빠르게 스와이프하면 페이지 전환
			const isQuickSwipe = absVelocity > 500; // 500px/s 이상 시 빠른 스와이프로 판정

			// === 페이지 전환 조건 결정 ===
			// 1. 거리 조건: threshold 이상 이동
			// 2. 속도 조건: 빠른 스와이프 + 방향성 속도 조건
			const shouldMoveNext =
				event.translationX < -threshold || // 오른쪽으로 25% 이상 스와이프
				(isQuickSwipe && velocity < -300); // 또는 빠른 오른쪽 스와이프 (300px/s 이상)

			const shouldMovePrev =
				event.translationX > threshold || // 왼쪽으로 25% 이상 스와이프
				(isQuickSwipe && velocity > 300); // 또는 빠른 왼쪽 스와이프 (300px/s 이상)

			// === 애니메이션 실행 ===
			// 단순한 스프링 애니메이션: 빠르고 직관적인 움직임
			const springConfig = {
				damping: 15, // 낮은 감쇠: 더 빠른 정착
				stiffness: 300, // 높은 강성: 더 빠른 반응
				mass: 0.8, // 낮은 질량: 가벼운 느낌
			};

			if (shouldMoveNext && currentPage < ONBOARDING_PAGES.length - 1) {
				// 다음 페이지로 이동
				translateX.value = withSpring(-SCREEN_WIDTH, springConfig);
				runOnJS(handlePageChange)(currentPage + 1); // UI 스레드에서 JS 함수 호출
			} else if (shouldMovePrev && currentPage > 0) {
				// 이전 페이지로 이동
				translateX.value = withSpring(SCREEN_WIDTH, springConfig);
				runOnJS(handlePageChange)(currentPage - 1);
			} else {
				// 조건 미충족 시 원래 위치로 복귀
				translateX.value = withSpring(0, springConfig);
			}
		});

	// ========================================================================================
	// Render
	// ========================================================================================

	return (
		<>
			{/* Stack Navigator 헤더 숨김 설정 */}
			<Stack.Screen
				options={{
					headerShown: false, // 온보딩 화면에서는 헤더 비표시
				}}
			/>

			{/* 제스처 감지 영역: 전체 화면에서 스와이프 인식 */}
			<GestureDetector gesture={panGesture}>
				<View className="flex-1">
					{/* 애니메이션 컨테이너: 모든 페이지와 인디케이터 포함 */}
					<Animated.View className="flex-1">
						{/* 온보딩 페이지들 렌더링 */}
						{ONBOARDING_PAGES.length > 0 &&
							ONBOARDING_PAGES.map((page, index) => (
								<ContentPage
									key={index.toString()} // React key: 안정적인 리렌더링을 위해 인덱스 사용
									title={page.title}
									subtitle={page.subtitle}
									image={page.image}
									page={index} // 페이지 인덱스
									currentPage={currentPage} // 현재 활성 페이지
									translateX={translateX} // 스와이프 애니메이션 공유 값
								/>
							))}

						{/* 페이지 인디케이터 (점들) */}
						{ONBOARDING_PAGES.length > 0 && (
							<View
								style={{
									// 버튼이 있을 때는 더 위에 배치
									bottom:
										currentPage === ONBOARDING_PAGES.length - 1
											? insets.bottom + 100 // 마지막 페이지: 버튼 위쪽에 배치
											: insets.bottom + 20, // 다른 페이지: 기본 위치
									width: "100%",
								}}
								className="absolute flex-row justify-center"
							>
								{ONBOARDING_PAGES.map((_, index) => (
									<PaginationDot
										key={index.toString()}
										page={index}
										currentPage={currentPage}
										translateX={translateX}
									/>
								))}
							</View>
						)}

						{/* 마지막 페이지 완료 버튼 */}
						{currentPage === ONBOARDING_PAGES.length - 1 && (
							<Animated.View
								style={{
									// 안전 영역 + 추가 여백으로 모든 기종에서 안전한 위치
									bottom: insets.bottom + 30, // 30px 여백 + 안전 영역
									width: "100%",
								}}
								className="absolute px-8"
								entering={FadeInUp.delay(150).springify()} // 300ms 지연 후 하단에서 부드럽게 등장
							>
								<TouchableOpacity
									className="bg-blue-600 rounded-3xl shadow-lg py-4 px-8"
									onPress={handleDone}
									activeOpacity={0.8}
								>
									<Text className="text-white text-center text-lg font-semibold">
										Get Started
									</Text>
								</TouchableOpacity>
							</Animated.View>
						)}
					</Animated.View>
				</View>
			</GestureDetector>
		</>
	);
}
