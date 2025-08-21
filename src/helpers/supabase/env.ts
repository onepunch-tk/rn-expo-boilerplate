import { z } from "zod";

export const EnvSchema = z.object({
	EXPO_PUBLIC_SUPABASE_URL: z.url(),
	EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10),
	EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: z.string().optional(),
	EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

export const env = EnvSchema.parse({
	EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
	EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
	EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID:
		process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
	EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY:
		process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY,
});
