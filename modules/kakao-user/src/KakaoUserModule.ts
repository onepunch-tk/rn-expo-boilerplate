import { NativeModule, requireNativeModule } from "expo";
import type { KakaoLoginResult } from "./types";

declare class KakaoUserModule extends NativeModule {
	login(): Promise<KakaoLoginResult>;
}

export default requireNativeModule<KakaoUserModule>("KakaoUser");
