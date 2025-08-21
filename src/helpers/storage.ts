import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();
export const StorageHelper = {
	setItem: (key: string, value: any) => {
		storage.set(key, JSON.stringify(value));
	},
	getItem: (key: string) => {
		const value = storage.getString(key);
		return value ? JSON.parse(value) : null;
	},
	removeItem: (key: string) => {
		storage.delete(key);
	},
	clear: () => {
		storage.clearAll();
	},
};

export const mmkvSupabaseSupportedStorage = {
	getItem: async (key: string) => await StorageHelper.getItem(key),
	setItem: async (key: string, value: string) =>
		await StorageHelper.setItem(key, value),
	removeItem: async (key: string) => await StorageHelper.removeItem(key),
};
