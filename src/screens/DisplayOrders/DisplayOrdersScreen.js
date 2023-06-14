import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { env } from '../../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

function DisplayOrdersScreen({ navigation }) {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const token = await AsyncStorage.getItem('token');
				const response = await fetch(`${env.API_URL}/orders`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const data = await response.json();
				setOrders(data);
			} catch (error) {
				console.error('Fetch orders error:', error);
			}
		};

		fetchOrders();
	}, []);

	const handleViewOrder = (orderNumber) => {
		// Redirect to OrderScreen with orderNumber as a parameter
		navigation.navigate('Order', { orderNumber });
	};

	return (
		<SafeAreaView className='flex-1'>
			<ScrollView className='p-4'>
				<Text className='text-3xl font-bold mb-6'>Orders:</Text>
				{orders.map((order) => (
					<View key={order._id} className='bg-white shadow-md rounded-lg p-4 mb-4'>
						<Text className='font-bold text-base'>Order Number: {order.orderNumber}</Text>
						<Text className='text-base'>Date: {order.timestamp}</Text>
						<Text className='mb-2 text-base'>Delivery Address: {order.deliveryAddress}</Text>
						<Text className='mb-2 text-base'>Total Price: ${order.totalPrice.toFixed(2)}</Text>
						<TouchableOpacity onPress={() => handleViewOrder(order.orderNumber)} className='mt-4'>
							<Text className='text-base font-bold text-blue-500'>View More</Text>
						</TouchableOpacity>
					</View>
				))}
			</ScrollView>
		</SafeAreaView>
	);
}

export default DisplayOrdersScreen;
