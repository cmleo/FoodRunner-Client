import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import LoginScreen from './src/screens/Login/LoginScreen';
import RegisterScreen from './src/screens/Register/RegisterScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function App() {
	const Stack = createNativeStackNavigator();

	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name='Login' component={LoginScreen} />
				<Stack.Screen name='Register' component={RegisterScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
