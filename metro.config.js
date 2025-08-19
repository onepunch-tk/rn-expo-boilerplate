const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

const ALIASES = {
	"@plugins/kakao-auth": "./modules/kakao-auth-module/app.plugin.js",
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
	return context.resolveRequest(
		context,
		ALIASES[moduleName] ?? moduleName,
		platform,
	);
};

module.exports = withNativeWind(config, { input: "./global.css" });
