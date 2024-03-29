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
import AdminScreen from './src/screens/Admin/AdminScreen';
import UpdateRestaurantScreen from './src/screens/UpdateRestaurant/UpdateRestaurantScreen';
import CreateRestaurantScreen from './src/screens/CreateRestaurant/CreateRestaurantScreen';
import DisplayOrdersScreen from './src/screens/DisplayOrders/DisplayOrdersScreen';
import OrderScreen from './src/screens/Order/OrderScreen';

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
				<Stack.Screen name='Admin' component={AdminScreen} />
				<Stack.Screen name='Dashboard' component={Dashboard} />
				<Stack.Screen name='Cart' component={CartScreen} />
				<Stack.Screen name='DisplayOrders' component={DisplayOrdersScreen} />
				<Stack.Screen name='Order' component={OrderScreen} />
				<Stack.Screen name='Restaurant' component={RestaurantScreen} />
				<Stack.Screen name='UpdateRestaurant' component={UpdateRestaurantScreen} />
				<Stack.Screen name='CreateRestaurant' component={CreateRestaurantScreen} />
				<Stack.Screen name='OrderReceived' component={OrderReceivedScreen} options={{ presentation: 'fullScreenModal' }} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
