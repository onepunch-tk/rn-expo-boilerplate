import type { User } from "@supabase/supabase-js";

export interface AuthContextType {
	isAuthLoading: boolean;
	setIsAuthLoading: (isAuthLoading: boolean) => void;
	authUser: User | null;
}
