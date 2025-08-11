#!/bin/bash

# ccache 유틸리티 스크립트
# 플랫폼별 캐시 관리를 위한 헬퍼 함수들

show_usage() {
    echo "사용법: $0 [명령어] [플랫폼]"
    echo "명령어:"
    echo "  stats     캐시 통계 확인"
    echo "  clear     캐시 초기화"
    echo "  size      캐시 크기 확인"
    echo "  config    캐시 설정 확인"
    echo "플랫폼:"
    echo "  ios       iOS 캐시"
    echo "  android   Android 캐시"
    echo "  all       모든 플랫폼 캐시"
}

# 플랫폼별 캐시 통계 확인
show_platform_stats() {
    local platform=$1
    export CCACHE_DIR="$HOME/.ccache/$platform"
    
    echo "📊 $platform ccache 통계:"
    echo "캐시 디렉터리: $CCACHE_DIR"
    if [[ -d "$CCACHE_DIR" ]]; then
        ccache -s
        echo "디렉터리 크기: $(du -sh "$CCACHE_DIR" | cut -f1)"
    else
        echo "❌ 캐시 디렉터리가 존재하지 않습니다."
    fi
    echo ""
}

# 플랫폼별 캐시 초기화
clear_platform_cache() {
    local platform=$1
    export CCACHE_DIR="$HOME/.ccache/$platform"
    
    echo "🗑️  $platform 캐시 초기화 중..."
    if [[ -d "$CCACHE_DIR" ]]; then
        ccache -C
        echo "✅ $platform 캐시가 초기화되었습니다."
    else
        echo "❌ 캐시 디렉터리가 존재하지 않습니다."
    fi
    echo ""
}

# 전체 캐시 정보 확인
show_all_stats() {
    echo "🔍 전체 ccache 상태 확인"
    echo "================================"
    show_platform_stats "ios"
    show_platform_stats "android"
    
    echo "💾 전체 캐시 사용량:"
    if [[ -d "$HOME/.ccache" ]]; then
        du -sh "$HOME/.ccache"/* 2>/dev/null || echo "캐시 디렉터리가 비어있습니다."
    else
        echo "❌ 캐시 루트 디렉터리가 존재하지 않습니다."
    fi
}

# 명령어 처리
COMMAND=$1
PLATFORM=$2

case "$COMMAND" in
    stats)
        if [[ "$PLATFORM" == "all" || -z "$PLATFORM" ]]; then
            show_all_stats
        elif [[ "$PLATFORM" == "ios" || "$PLATFORM" == "android" ]]; then
            show_platform_stats "$PLATFORM"
        else
            echo "❌ 잘못된 플랫폼: $PLATFORM"
            show_usage
            exit 1
        fi
        ;;
    clear)
        if [[ "$PLATFORM" == "all" ]]; then
            clear_platform_cache "ios"
            clear_platform_cache "android"
        elif [[ "$PLATFORM" == "ios" || "$PLATFORM" == "android" ]]; then
            clear_platform_cache "$PLATFORM"
        else
            echo "❌ 플랫폼을 지정해주세요 (ios, android, all)"
            show_usage
            exit 1
        fi
        ;;
    config)
        echo "🔧 ccache 설정 정보:"
        echo "ccache 바이너리: $(which ccache)"
        echo "iOS 캐시 디렉터리: $HOME/.ccache/ios"
        echo "Android 캐시 디렉터리: $HOME/.ccache/android"
        echo "각 플랫폼 최대 용량: 10GB"
        ;;
    *)
        echo "❌ 알 수 없는 명령어: $COMMAND"
        show_usage
        exit 1
        ;;
esac