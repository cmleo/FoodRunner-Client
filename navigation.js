import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/Login/LoginScreen';
import RegisterScreen from './src/screens/Register/RegisterScreen';
import HomeScreen from './src/screens/Home/HomeScreen';
import Dashboard from './src/components/Dashboard/Dashboard';

const Stack = createNativeStackNavigator();

export default function Navigation() {
	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name='Login' component={LoginScreen} />
				<Stack.Screen name='Register' component={RegisterScreen} />
				<Stack.Screen name='Home' component={HomeScreen} />
				<Stack.Screen name='Dashboard' component={Dashboard} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
