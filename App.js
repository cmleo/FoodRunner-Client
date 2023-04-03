import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RegisterScreen from './src/screens/Register/RegisterScreen';

export default function App() {
	return (
		<View>
			<RegisterScreen />
		</View>
	);
}
