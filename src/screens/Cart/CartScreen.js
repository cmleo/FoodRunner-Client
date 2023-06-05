import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { themeColors } from '../../theme/theme';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { env } from '../../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CartScreen() {
	const navigation = useNavigation();
	const route = useRoute();
	const { restaurantId, cartItems } = route.params;

	const [restaurant, setRestaurant] = useState(null);
	const [cartItemsState, setCartItemsState] = useState(cartItems);
	const [subTotal, setSubTotal] = useState(0);
	const [totalPrice, setTotalPrice] = useState(0);
	const [deliveryAddress, setDeliveryAddress] = useState('');

	const DELIVERY_FEE = 5;

	useEffect(() => {
		const SUBTOTAL = Object.values(cartItemsState).reduce((total, item) => total + item.price * item.quantity, 0);
		setSubTotal(SUBTOTAL);
		setTotalPrice(SUBTOTAL + DELIVERY_FEE);

		const fetchRestaurant = async () => {
			try {
				const response = await fetch(`${env.API_URL}/restaurants/${restaurantId}`);
				const data = await response.json();
				setRestaurant(data.restaurant);
			} catch (error) {
				console.log(error);
			}
		};

		fetchRestaurant();
	}, [cartItemsState, restaurantId]);

	const removeFromCart = (itemId) => {
		setCartItemsState((prevCartItems) => {
			const updatedCartItems = { ...prevCartItems };
			if (updatedCartItems[itemId].quantity > 1) {
				updatedCartItems[itemId].quantity--;
			} else {
				delete updatedCartItems[itemId];
			}
			return updatedCartItems;
		});

		setSubTotal((prevSubTotal) => prevSubTotal - cartItemsState[itemId].price);
		setTotalPrice((prevTotalPrice) => prevTotalPrice - cartItemsState[itemId].price);
	};

	useEffect(() => {
		if (Object.keys(cartItemsState).length === 0) {
			navigation.goBack();
		}
	}, [cartItemsState]);

	const addOrderInDB = async () => {
		const token = await AsyncStorage.getItem('token');

		if (!cartItemsState) {
			return <Text>No products added in the cart</Text>;
		} else if (token) {
			try {
				const orderItems = Object.values(cartItemsState).map((item) => ({
					_id: item._id,
					productName: item.productName,
					quantity: item.quantity,
					pricePerQuantity: item.price,
				}));

				const response = await fetch(`${env.API_URL}/orders`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + token,
					},
					body: JSON.stringify({
						_id: cartItemsState._id,
						order: orderItems,
						deliveryAddress: deliveryAddress,
						deliveryFee: DELIVERY_FEE,
					}),
				});
				const data = await response.json();
				console.log(data);
			} catch (error) {
				console.log(error);
			}
		} else {
			Alert.alert('Please login to place an order');
			navigation.navigate('Login');
		}
	};

	if (!restaurant) {
		return <Text className='font-bold text-xl text-center'>Loading...</Text>;
	}

	return (
		<SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
			{/* back button */}
			<View className='relative py-4 shadow-sm'>
				<TouchableOpacity
					style={{ backgroundColor: themeColors.bgColor(1) }}
					className='absolute z-10 rounded-full p-1 shadow top-5 left-2'
					onPress={() => {
						navigation.goBack();
					}}
				>
					<AntDesign name='arrowleft' size={24} color='white' />
				</TouchableOpacity>
				<View>
					<Text className='text-center font-bold text-xl'>Your Cart</Text>
					<Text className='text-center text-gray-500'>{restaurant.restaurantName}</Text>
				</View>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				className='bg-white pt-5'
				contentContainerStyle={{
					paddingBottom: 50,
				}}
			>
				{Object.values(cartItemsState).map((item) => (
					<View key={item._id} className='flex-row items-center space-x-3 py-2 px-4 bg-green-100 rounded-3xl mx-2 mb-3'>
						<Text className='font-bold' style={{ color: themeColors.text }}>
							{item.quantity} x
						</Text>
						<Image className='h-14 w-14 rounded-full' source={{ uri: item.image }} />
						<Text className='flex-1 font-bold text-gray-700'>{item.productName}</Text>
						<Text className='font-semibold text-base'>${item.price * item.quantity}</Text>
						<TouchableOpacity
							className='p-1 rounded-full'
							style={{ backgroundColor: themeColors.bgColor(1) }}
							onPress={() => {
								removeFromCart(item._id);
							}}
						>
							<Feather name='minus' size={15} color={'white'} />
						</TouchableOpacity>
					</View>
				))}
			</ScrollView>

			<View className=' '>
				<TextInput
					className='border-2 border-gray-400 rounded-full px-4 py-2 w-full mb-3'
					placeholder='Your Delivery Address'
					onChangeText={(text) => setDeliveryAddress(text)}
				/>
			</View>

			{/* totals */}
			<View className='p-6 px-8 rounded-t-3xl space-y-4 bg-green-300'>
				<View className='flex-row justify-between'>
					<Text className='text-gray-700'>subTotal</Text>
					<Text className='text-gray-700'>${subTotal}</Text>
				</View>
				<View className='flex-row justify-between'>
					<Text className='text-gray-700'>Delivery Fee</Text>
					<Text className='text-gray-700'>${DELIVERY_FEE}</Text>
				</View>
				<View className='flex-row justify-between'>
					<Text className='text-gray-700 font-extrabold'>Order Total</Text>
					<Text className='text-gray-700 font-extrabold'>${totalPrice}</Text>
				</View>

				<TouchableOpacity
					style={{ backgroundColor: themeColors.bgColor(1) }}
					className='p-3 rounded-full'
					onPress={() => {
						navigation.navigate('OrderReceived');
						addOrderInDB();
					}}
				>
					<Text className='text-white text-center font-bold text-lg'>Place Order</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
