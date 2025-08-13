// ========================================================================================
// OnboardingScreen.tsx - 스와이프 가능한 온보딩 화면 컴포넌트
// ========================================================================================

import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
	Button,
	Dimensions,
	type ImageSourcePropType, // require() 이미지 타입
	Text,
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
import { storage } from "@/helpers/storage";
import { useOnboarding } from "@/hooks/useOnboarding";

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
	 * 페이지 애니메이션 스타일 계산
	 * - UI 스레드에서 실행되는 worklet 함수
	 * - 실시간으로 스와이프에 따른 위치, 크기, 투명도 계산
	 */
	const pageStyle = useAnimatedStyle(() => {
		"worklet";

		// 기본 위치 계산: 현재 페이지 기준으로 좌우 배치
		const offset = (page - currentPage) * SCREEN_WIDTH;
		// 실제 표시 위치: 기본 위치 + 스와이프 이동량
		const translateXValue = offset + translateX.value;

		// 현재 페이지와의 거리 계산 (성능 최적화용)
		const distance = Math.abs(page - currentPage);

		// 성능 최적화: 인접하지 않은 페이지(거리 > 1)는 완전히 숨김
		// 메모리와 렌더링 성능 향상
		if (distance > 1) {
			return {
				opacity: 0,
				transform: [{ translateX: translateXValue }],
			};
		}

		// 스케일 애니메이션: 스와이프 시 페이지가 살짝 축소되는 효과
		// 0에서 SCREEN_WIDTH까지의 스와이프 거리를 1.0에서 0.85 스케일로 매핑
		const scale = interpolate(
			Math.abs(translateX.value), // 스와이프 거리 (절댓값)
			[0, SCREEN_WIDTH], // 입력 범위: 0 ~ 화면 너비
			[1, 0.85], // 출력 범위: 100% ~ 85% 크기
			"clamp", // 범위 제한: 입력값이 범위를 벗어나도 안전
		);

		// 투명도 애니메이션: 3단계 페이드 효과
		// 페이지가 멀어질수록 점진적으로 투명해짐
		const opacity = interpolate(
			Math.abs(translateXValue), // 페이지의 절대 위치
			[0, SCREEN_WIDTH * 0.5, SCREEN_WIDTH], // 입력: 0, 화면 절반, 화면 전체
			[1, 0.8, 0.3], // 출력: 100% → 80% → 30% 투명도
			"clamp",
		);

		return {
			opacity,
			transform: [{ translateX: translateXValue }, { scale }],
		};
	});

	return (
		<Animated.View style={[pageStyle]} className="flex-1 absolute h-full">
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
				<Text className="text-3xl font-bold text-center mb-3" numberOfLines={2}>
					{title}
				</Text>

				{/* 부제목: 최대 2줄, 기본 크기, 말줄임표 처리 */}
				<Text
					className="text-base text-center leading-5"
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
	 * 점(dot)의 동적 스타일 계산
	 * - 스와이프 진행률에 따라 실시간으로 크기와 투명도 변경
	 * - 다음 페이지로 이동 시 미리보기 효과 제공
	 */
	const dotStyle = useAnimatedStyle(() => {
		"worklet";

		const isActive = page === currentPage; // 현재 활성 페이지 여부
		const progress = translateX.value / SCREEN_WIDTH; // 스와이프 진행률 (-1 ~ 1)

		// 현재 페이지로부터의 거리 (0: 현재, 1: 인접, 2+: 멀리)
		const distanceFromCurrent = Math.abs(page - currentPage);

		let animatedWidth: number; // 동적 너비
		let animatedOpacity: number; // 동적 투명도

		if (isActive) {
			// === 현재 활성 페이지 ===
			// 스와이프할수록 작아짐 (24px → 8px)
			animatedWidth = interpolate(Math.abs(progress), [0, 1], [24, 8], "clamp");
			// 스와이프할수록 투명해짐 (100% → 40%)
			animatedOpacity = interpolate(
				Math.abs(progress),
				[0, 1],
				[1, 0.4],
				"clamp",
			);
		} else if (distanceFromCurrent === 1) {
			// === 인접한 페이지 (바로 옆 페이지) ===

			// 스와이프 방향에 따른 다음 대상 페이지 판별
			// progress < 0: 오른쪽으로 스와이프 (다음 페이지로)
			// progress > 0: 왼쪽으로 스와이프 (이전 페이지로)
			const isTargetPage =
				(progress < 0 && page === currentPage + 1) || // 다음 페이지가 대상
				(progress > 0 && page === currentPage - 1); // 이전 페이지가 대상

			if (isTargetPage) {
				// 다음에 활성화될 페이지: 점진적으로 커짐 (8px → 24px)
				animatedWidth = interpolate(
					Math.abs(progress),
					[0, 1],
					[8, 24],
					"clamp",
				);
				// 점진적으로 불투명해짐 (40% → 100%)
				animatedOpacity = interpolate(
					Math.abs(progress),
					[0, 1],
					[0.4, 1],
					"clamp",
				);
			} else {
				// 반대 방향의 인접 페이지: 기본 상태 유지
				animatedWidth = 8;
				animatedOpacity = 0.4;
			}
		} else {
			// === 멀리 떨어진 페이지 ===
			// 가장 작고 투명한 상태 유지
			animatedWidth = 8;
			animatedOpacity = 0.2;
		}

		return {
			width: animatedWidth,
			opacity: animatedOpacity,
		};
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

	function handleDone() {
		router.replace("/");
		storage.set(ONBOARDING_KEY, "true");
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
			// 스프링 애니메이션 설정: 자연스럽고 부드러운 움직임
			const springConfig = {
				damping: 25, // 감쇠율: 높을수록 오버슈트 감소
				stiffness: 200, // 강성: 낮을수록 느린 애니메이션
				mass: 1, // 질량: 물리적 무게감 추가
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
								<View className="bg-blue-600 rounded-3xl overflow-hidden shadow-lg py-1">
									<Button
										title={"Get Started"}
										color="white"
										onPress={handleDone}
									/>
								</View>
							</Animated.View>
						)}
					</Animated.View>
				</View>
			</GestureDetector>
		</>
	);
}
