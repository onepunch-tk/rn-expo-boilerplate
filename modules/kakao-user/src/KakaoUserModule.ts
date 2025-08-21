import { NativeModule, requireNativeModule } from "expo";
import type {
	KakaoAccessTokenResult,
	KakaoIsLogined,
	KakaoLoginResult,
	KakaoLogoutResult,
} from "./types";

declare class KakaoUserModule extends NativeModule {
	login(): Promise<KakaoLoginResult>;
	logout(): Promise<KakaoLogoutResult>;
	unlink(): Promise<KakaoLogoutResult>;
	isLogined(): Promise<KakaoIsLogined>;
	getAccessToken(): Promise<KakaoAccessTokenResult>;
}

export default requireNativeModule<KakaoUserModule>("KakaoUser");
