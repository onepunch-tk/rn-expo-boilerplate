"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withSomePlugin = void 0;
const withSomePlugin = (config, options = {}) => {
    if (!options.enabled) {
        console.log("🔸 Some Plugin: Disabled in configuration");
        return config;
    }
    console.log("🟢 Some Plugin: Configuration started");
    console.log("  Message:", options.message || "Default message");
    // 여기에 플러그인 로직을 추가하세요
    console.log("✅ Some Plugin: Configuration completed");
    return config;
};
exports.withSomePlugin = withSomePlugin;
exports.default = exports.withSomePlugin;
