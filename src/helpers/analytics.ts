import {
	getAnalytics,
	logEvent,
	setUserProperty,
} from "@react-native-firebase/analytics";

const analytics = getAnalytics();

type EventNameString =
	| "add_payment_info"
	| "add_shipping_info"
	| "add_to_cart"
	| "add_to_wishlist"
	| "begin_checkout"
	| "checkout_progress"
	| "exception"
	| "generate_lead"
	| "login"
	| "page_view"
	| "purchase"
	| "refund"
	| "remove_from_cart"
	| "screen_view"
	| "search"
	| "select_content"
	| "select_item"
	| "select_promotion"
	| "set_checkout_option"
	| "share"
	| "sign_up"
	| "timing_complete"
	| "view_cart"
	| "view_item"
	| "view_item_list"
	| "view_promotion"
	| "view_search_results";

export const AnalyticsHelper = {
	async logEvent(name: EventNameString, params: Record<string, any>) {
		try {
			await logEvent(analytics, name as string, params);
		} catch (error) {
			if (__DEV__) {
				console.error("analytics logging event error: ", error);
			}
		}
	},
	async logScreen(screenName: string, screenClass?: string) {
		try {
			// await logEvent(analytics, "screen_view", {
			// 	firebase_screen: screenName,
			// 	firebase_screen_class: screenClass || screenName,
			// });
			await logEvent(analytics, "screen_view", {
				firebase_screen: screenName,
				firebase_screen_class: screenClass || screenName,
			});
		} catch (error) {
			if (__DEV__) {
				console.error("analytics logging screen error: ", error);
			}
		}
	},

	async setUserProperty(properties: Record<string, string>) {
		try {
			await Promise.all(
				Object.entries(properties).map(([name, value]) => {
					setUserProperty(analytics, name, value);
				}),
			);
		} catch (error) {
			if (__DEV__) {
				console.error("analytics set user property error: ", error);
			}
		}
	},
};
