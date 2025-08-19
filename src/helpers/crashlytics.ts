import {
	getCrashlytics,
	log,
	recordError,
	setAttribute,
	setAttributes,
	setCrashlyticsCollectionEnabled,
	setUserId,
} from "@react-native-firebase/crashlytics";

const crashlytics = getCrashlytics();

export const CrashlyticsHelper = {
	async initialize() {
		await setCrashlyticsCollectionEnabled(crashlytics, true);
	},
	async setUserId(userId: string | null) {
		try {
			await setUserId(crashlytics, userId || "");
		} catch (error) {
			console.error("Error Set crashlytics userId: ", error);
		}
	},
	async setAttribute(name: string, value: string) {
		try {
			await setAttribute(crashlytics, name, value);
		} catch (error) {
			console.error("Error Set crashlytics attribute: ", error);
		}
	},
	async setAttributes(attributes: { [key: string]: string }) {
		try {
			await setAttributes(crashlytics, attributes);
		} catch (error) {
			console.error("Error Set crashlytics attributes: ", error);
		}
	},
	log(message: string) {
		try {
			log(crashlytics, message);
		} catch (error) {
			console.error("Error Log crashlytics: ", error);
		}
	},
	recordError(error: Error, jsErrorName?: string) {
		try {
			recordError(crashlytics, error, jsErrorName);
		} catch (error) {
			console.error("Error Record crashlytics error: ", error);
		}
	},
};
