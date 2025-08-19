import type { ConfigPlugin } from "@expo/config-plugins";
export interface SomePluginOptions {
    message?: string;
    enabled?: boolean;
}
export declare const withSomePlugin: ConfigPlugin<SomePluginOptions>;
export default withSomePlugin;
