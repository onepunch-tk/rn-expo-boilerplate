import type { User } from "@supabase/supabase-js";

export interface AuthContextType {
	isLoading: boolean;
	authUser: User | null;
}
