import type { ConfigPlugin } from "@expo/config-plugins";
import type { SocialLoginConfig } from "./types";
import { withKakao } from "./withKakao";

export const withAuth: ConfigPlugin<SocialLoginConfig> = (
	config,
	{ kakao, facebook }
) => {

	if(kakao) {
		config = withKakao(config, kakao);
	}

	if(facebook) {}

	return config;
};

export default withAuth;
