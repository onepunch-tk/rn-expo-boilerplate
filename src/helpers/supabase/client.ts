import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { mmkvSupabaseSupportedStorage } from "../storage";
import { env } from "./env";

export type ClientOptions = {
	url?: string;
	anonKey?: string;
};

export const createSupabaseClient = <DB = unknown>({
	url = env.EXPO_PUBLIC_SUPABASE_URL,
	anonKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
}: ClientOptions = {}): SupabaseClient<DB> => {
	return createClient<DB>(url, anonKey, {
		auth: {
			storage: mmkvSupabaseSupportedStorage,
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: false,
		},
	});
};

export const supabase = createSupabaseClient();
