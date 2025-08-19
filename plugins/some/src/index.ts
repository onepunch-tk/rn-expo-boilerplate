import type { ConfigPlugin } from "@expo/config-plugins";

export interface SomePluginOptions {
	message?: string;
	enabled?: boolean;
}

export const withSomePlugin: ConfigPlugin<SomePluginOptions> = (
	config,
	options = {},
) => {
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

export default withSomePlugin;
