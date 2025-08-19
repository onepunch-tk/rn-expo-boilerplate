import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { useAppContext } from "@/context/AppContext";
export default function Page() {
	const { colorScheme, setColorScheme } = useAppContext();

	return (
		<View className="flex-1 justify-center items-center">
			<Text className="text-red-400">First page</Text>
			<StatusBar style={colorScheme === "system" ? "auto" : colorScheme} />
		</View>
	);
}
