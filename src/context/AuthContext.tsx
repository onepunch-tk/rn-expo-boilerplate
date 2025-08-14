import type { Session, User } from "@supabase/supabase-js";
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { CrashlyticsHelper } from "@/helpers/crashlytics";
import { SupabaseAuthHelper } from "@/helpers/supabase";
import type { AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
	const [authUser, setAuthUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function handleAuthSession(session: Session | null) {
			setAuthUser(session?.user ?? null);
			await CrashlyticsHelper.setUserId(session?.user?.id ?? "anonymous");
			await CrashlyticsHelper.setAttributes({
				email: session?.user?.email ?? "",
				provider: session?.user?.app_metadata.provider ?? "",
			});
		}
		SupabaseAuthHelper.getSession().then(async ({ data: { session } }) => {
			await handleAuthSession(session);
			setIsLoading(false);
		});

		SupabaseAuthHelper.onAuthStateChange(async (_event, session) => {
			await handleAuthSession(session);
		});
	}, []);

	return (
		<AuthContext.Provider
			value={{
				isLoading,
				authUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
}
