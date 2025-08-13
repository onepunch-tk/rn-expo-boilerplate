import { StatusBar } from "expo-status-bar";
import { Button, Text, View } from "react-native";
import { useAppContext } from "@/context/AppContext";

export default function Page() {
	const { colorScheme, setColorScheme } = useAppContext();
	console.log("colorScheme", colorScheme);
	return (
		<View className="flex-1 justify-center items-center">
			<Text className="text-red-400">First page</Text>
			<Button
				title="Toggle Color Scheme"
				onPress={() =>
					setColorScheme(colorScheme === "light" ? "dark" : "light")
				}
			/>
			<StatusBar style={colorScheme === "system" ? "auto" : colorScheme} />
		</View>
	);
}
