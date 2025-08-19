import { Redirect } from "expo-router";

export default function NotFoundPage() {
	// 메인 페이지로 리다이렉트
	return <Redirect href="/" />;
}
