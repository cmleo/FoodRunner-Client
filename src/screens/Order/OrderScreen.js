import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { env } from '../../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

function OrderScreen({ route }) {
	const [order, setOrder] = useState(null);
	const orderNumber = route.params.orderNumber;

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				const token = await AsyncStorage.getItem('token');
				const response = await fetch(`${env.API_URL}/orders/${orderNumber}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const data = await response.json();
				setOrder(data);
			} catch (error) {
				console.error('Fetch order error:', error);
			}
		};

		fetchOrder();
	}, [orderNumber]);

	if (!order) {
		return (
			<SafeAreaView style='flex-1 justify-center items-center'>
				<Text>Loading order...</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style='flex-1'>
			<ScrollView className='p-4'>
				<Text className='text-3xl font-bold mb-6'>Order Details</Text>
				<Text className='text-lg'>Order Number: {order.orderNumber}</Text>
				<Text className='text-lg'>Date: {order.timestamp}</Text>
				<Text className='text-base mb-4'>Delivery Address: {order.deliveryAddress}</Text>
				<Text className='text-lg mb-4 font-bold text-red-500'>Total Price: ${order.totalPrice}</Text>
				<Text className='text-2xl font-bold mt-6'>Order Items:</Text>
				{order.order.map((item) => (
					<View key={item._id} className='mt-4 mb-2'>
						<Text className='text-base'>Product Name: {item.productName}</Text>
						<Text className='text-base'>Quantity: {item.quantity}</Text>
						<Text className='text-base'>Price Per Quantity: ${item.pricePerQuantity}</Text>
						<Text className='text-base mb-2'>Total Price of Product: ${item.totalPriceOfProduct}</Text>
					</View>
				))}
			</ScrollView>
		</SafeAreaView>
	);
}

export default OrderScreen;
