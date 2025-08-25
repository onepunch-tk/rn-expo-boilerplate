import type { Session, User } from "@supabase/supabase-js";
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { AnalyticsHelper } from "@/helpers/analytics";
import { CrashlyticsHelper } from "@/helpers/crashlytics";
import { SupabaseAuthHelper } from "@/helpers/supabase/SupabaeAuthHelper";
import type { AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
	const [authUser, setAuthUser] = useState<User | null>(null);
	const [isAuthLoading, setIsAuthLoading] = useState(true);

	useEffect(() => {
		async function handleAuthSession(session: Session | null) {
			try {
				setAuthUser(session?.user ?? null);
				await CrashlyticsHelper.setUserId(session?.user?.id ?? null);

				const user = {
					email: session?.user?.email ?? "anonymous",
					provider:
						(session?.user?.user_metadata?.provider_id as string) ??
						"anonymous",
				};

				await CrashlyticsHelper.setAttributes(user);
				await AnalyticsHelper.setUserProperty(user);
			} catch (error) {
				if (__DEV__) {
					console.error("Error setting crashlytics attributes: ", error);
				}
				await CrashlyticsHelper.recordError(error as Error);
			}
		}

		SupabaseAuthHelper.getSession().then(async ({ data: { session } }) => {
			await handleAuthSession(session);
			setIsAuthLoading(false);
		});

		// 인증 상태 변경 구독 (cleanup 추가!)
		const {
			data: { subscription },
		} = SupabaseAuthHelper.onAuthStateChange(async (_event, session) => {
			await handleAuthSession(session);
			setIsAuthLoading(false); // 로그인/로그아웃 시 로딩 해제
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	return (
		<AuthContext.Provider
			value={{
				isAuthLoading,
				authUser,
				setIsAuthLoading,
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
