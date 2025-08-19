import { NativeModule, requireNativeModule } from "expo";

declare class KakaoCoreModule extends NativeModule {
	initializeKakaoSDK(appKey: string): void;
	//android only
	getKeyHash(): string;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<KakaoCoreModule>("KakaoCore");
