import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import LoginScreen from './src/screens/Login/LoginScreen';
import RegisterScreen from './src/screens/Register/RegisterScreen';
import HomeScreen from './src/screens/Home/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from './src/components/Dashboard/Dashboard';

export default function App() {
	const Stack = createNativeStackNavigator();

	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name='Login' component={LoginScreen} />
				<Stack.Screen name='Register' component={RegisterScreen} />
				<Stack.Screen name='Home' component={HomeScreen} />
				<Stack.Screen name='Dashboard' component={Dashboard} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
