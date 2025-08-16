import {
	type AuthChangeEvent,
	createClient,
	type Session,
} from "@supabase/supabase-js";
import { StorageHelper } from "./storage";

const mmkvSupabaseSupportedStorage = {
	getItem: async (key: string) => await StorageHelper.getItem(key),
	setItem: async (key: string, value: string) =>
		await StorageHelper.setItem(key, value),
	removeItem: async (key: string) => await StorageHelper.removeItem(key),
};

const supabase = createClient(
	process.env.EXPO_PUBLIC_SUPABASE_URL!,
	process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
	{
		auth: {
			storage: mmkvSupabaseSupportedStorage,
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: false,
		},
	},
);

export const SupabaseAuthHelper = {
	onAuthStateChange(
		callback: (
			event: AuthChangeEvent,
			session: Session | null,
		) => void | Promise<void>,
	) {
		return supabase.auth.onAuthStateChange(callback);
	},
	async getSession() {
		return supabase.auth.getSession();
	},
};
