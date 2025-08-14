import crashlytics from "@react-native-firebase/crashlytics";

export const CrashlyticsHelper = {
	async init() {
		try {
			await crashlytics().setCrashlyticsCollectionEnabled(true);
			await this.setUserId("anonymous");
			const initUserProfile = {
				email: "",
				provider: "",
			};
			await this.setAttributes(initUserProfile);
		} catch (error) {
			console.error("Error Initialize crashlytics: ", error);
		}
	},
	async setUserId(userId: string | null) {
		try {
			await crashlytics().setUserId(userId || "");
		} catch (error) {
			console.error("Error Set crashlytics userId: ", error);
		}
	},
	async setAttribute(name: string, value: string) {
		try {
			await crashlytics().setAttribute(name, value);
		} catch (error) {
			console.error("Error Set crashlytics attribute: ", error);
		}
	},
	async setAttributes(attributes: { [key: string]: string }) {
		try {
			await crashlytics().setAttributes(attributes);
		} catch (error) {
			console.error("Error Set crashlytics attributes: ", error);
		}
	},
	log(message: string) {
		try {
			crashlytics().log(message);
		} catch (error) {
			console.error("Error Log crashlytics: ", error);
		}
	},
	recordError(error: Error, jsErrorName?: string) {
		try {
			crashlytics().recordError(error, jsErrorName);
		} catch (error) {
			console.error("Error Record crashlytics error: ", error);
		}
	},
};
