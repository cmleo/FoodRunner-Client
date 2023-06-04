import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/Login/LoginScreen';
import RegisterScreen from './src/screens/Register/RegisterScreen';
import HomeScreen from './src/screens/Home/HomeScreen';
import Dashboard from './src/components/Dashboard/Dashboard';
import CartScreen from './src/screens/Cart/CartScreen';
import RestaurantScreen from './src/screens/Restaurant/RestaurantScreen';
import OrderReceivedScreen from './src/screens/OrderReceived/OrderReceivedScreen';

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
				<Stack.Screen name='Cart' component={CartScreen} />
				<Stack.Screen name='Restaurant' component={RestaurantScreen} />
				<Stack.Screen name='OrderReceived' component={OrderReceivedScreen} options={{ presentation: 'fullScreenModal' }} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
