import {
	type AuthChangeEvent,
	createClient,
	type Session,
} from "@supabase/supabase-js";
import { StorageHelper } from "./storage";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const mmkvSupabaseSupportedStorage = {
	getItem: async (key: string) => await StorageHelper.getItem(key),
	setItem: async (key: string, value: string) =>
		await StorageHelper.setItem(key, value),
	removeItem: async (key: string) => await StorageHelper.removeItem(key),
};

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		storage: mmkvSupabaseSupportedStorage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});

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
