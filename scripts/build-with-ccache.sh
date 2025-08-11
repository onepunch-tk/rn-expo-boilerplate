#!/bin/bash

# 사용법 출력 함수
show_usage() {
    echo "사용법: $0 [플랫폼] [옵션]"
    echo "플랫폼:"
    echo "  ios        iOS 빌드"
    echo "  android    Android 빌드"
    echo "옵션:"
    echo "  --device      실제 기기에 빌드 (iOS만 해당)"
    echo "  --simulator   시뮬레이터에 빌드 (iOS 기본값)"
    echo "  --stats       빌드 없이 해당 플랫폼 캐시 통계만 확인"
    echo "  --clear       해당 플랫폼 캐시 완전 삭제"
    echo "  --reset-stats 빌드 전 해당 플랫폼 캐시 통계만 초기화"
    echo "  -h, --help    이 도움말 출력"
}

# 플랫폼별 ccache 환경 설정 함수
setup_ccache_for_platform() {
    local platform=$1
    
    if [[ "$platform" == "ios" ]]; then
        export CCACHE_DIR="$HOME/.ccache/ios"
        export CC="$(pwd)/node_modules/react-native/scripts/xcode/ccache-clang.sh"
        export CXX="$(pwd)/node_modules/react-native/scripts/xcode/ccache-clang++.sh"
    elif [[ "$platform" == "android" ]]; then
        export CCACHE_DIR="$HOME/.ccache/android"
        export CC="ccache clang"
        export CXX="ccache clang++"
    fi
    
    export CCACHE_BINARY="/opt/homebrew/bin/ccache"
    
    # 캐시 디렉터리 생성 및 용량 설정 (10GB)
    mkdir -p "$CCACHE_DIR"
    ccache -M 10G
}

# 플랫폼별 빌드 실행 함수
run_build() {
    local platform=$1
    local device_flag=$2
    
    echo "🚀 $platform 빌드 시작..."
    
    if [[ "$platform" == "ios" ]]; then
        if [[ -n "$device_flag" ]]; then
            expo run:ios --device
        else
            expo run:ios
        fi
    elif [[ "$platform" == "android" ]]; then
        expo run:android
    fi
}

# 캐시 통계 출력 함수
show_cache_stats() {
    local platform=$1
    echo ""
    echo "📊 빌드 후 $platform ccache 사용 통계:"
    echo "캐시 디렉터리: $CCACHE_DIR"
    ccache -s
    
    # 캐시 디렉터리 크기 확인
    if [[ -d "$CCACHE_DIR" ]]; then
        echo "💾 캐시 디렉터리 크기: $(du -sh "$CCACHE_DIR" | cut -f1)"
    fi
    
    echo ""
    echo "💡 유용한 명령어들:"
    echo "   • $platform 전용 캐시 통계 확인: CCACHE_DIR=$HOME/.ccache/$platform ccache -s"
    echo "   • $platform 캐시 통계 초기화: CCACHE_DIR=$HOME/.ccache/$platform ccache -z"
    echo "   • $platform 캐시 완전 삭제: CCACHE_DIR=$HOME/.ccache/$platform ccache -C"
    echo "   • $platform 캐시 설정 확인: CCACHE_DIR=$HOME/.ccache/$platform ccache -p"
}

# 캐시 초기화 함수
clear_cache() {
    local platform=$1
    echo "🗑️  $platform 캐시 초기화 중..."
    ccache -C
    echo "✅ $platform 캐시가 초기화되었습니다."
}

# 명령줄 인수 처리
PLATFORM=""
DEVICE_FLAG=""
STATS_ONLY=false
CLEAR_CACHE=false
RESET_STATS=false

while [[ $# -gt 0 ]]; do
    case $1 in
        ios|android)
            PLATFORM=$1
            shift
            ;;
        --device)
            DEVICE_FLAG="--device"
            shift
            ;;
        --simulator)
            DEVICE_FLAG=""
            shift
            ;;
        --stats)
            STATS_ONLY=true
            shift
            ;;
        --clear)
            CLEAR_CACHE=true
            shift
            ;;
        --reset-stats)
            RESET_STATS=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            echo "알 수 없는 옵션: $1"
            show_usage
            exit 1
            ;;
    esac
done

# 플랫폼 검증
if [[ -z "$PLATFORM" ]]; then
    echo "❌ 플랫폼을 지정해주세요 (ios 또는 android)"
    show_usage
    exit 1
fi

if [[ "$PLATFORM" != "ios" && "$PLATFORM" != "android" ]]; then
    echo "❌ 지원하지 않는 플랫폼입니다: $PLATFORM"
    show_usage
    exit 1
fi

# ccache 환경 설정
setup_ccache_for_platform "$PLATFORM"

# 캐시 초기화 모드
if [[ "$CLEAR_CACHE" == true ]]; then
    clear_cache "$PLATFORM"
    exit 0
fi

# 통계 확인 모드
if [[ "$STATS_ONLY" == true ]]; then
    show_cache_stats "$PLATFORM"
    exit 0
fi

# 통계 초기화 처리 (옵션)
if [[ "$RESET_STATS" == true ]]; then
    echo "🔄 $PLATFORM 캐시 통계 초기화 중..."
    ccache -z
    echo "✅ $PLATFORM 캐시 통계가 초기화되었습니다."
    echo ""
fi

# 빌드 전 캐시 통계 확인 (누적 통계 유지)
echo "📊 빌드 전 $PLATFORM 캐시 통계:"
ccache -s

echo "🔧 $PLATFORM ccache 환경변수 설정 완료"
echo "CC: $CC"
echo "CXX: $CXX" 
echo "CCACHE_BINARY: $CCACHE_BINARY"
echo "CCACHE_DIR: $CCACHE_DIR"

if [[ "$PLATFORM" == "ios" ]]; then
    if [[ -n "$DEVICE_FLAG" ]]; then
        echo "📱 빌드 대상: 실제 iOS 기기"
    else
        echo "🖥️  빌드 대상: iOS 시뮬레이터"
    fi
elif [[ "$PLATFORM" == "android" ]]; then
    echo "🤖 빌드 대상: Android"
fi
echo ""

# 빌드 실행
run_build "$PLATFORM" "$DEVICE_FLAG"

# 빌드 후 ccache 통계 확인
show_cache_stats "$PLATFORM"