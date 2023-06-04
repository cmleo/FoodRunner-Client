import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { themeColors } from '../../theme/theme';
import { useNavigation } from '@react-navigation/native';

export default function CartIcon({ cartItems, restaurantId }) {
	const totalQuantity = Object.values(cartItems).reduce((total, item) => total + item.quantity, 0);
	const totalPrice = Object.values(cartItems).reduce((total, item) => total + item.price * item.quantity, 0);
	const navigation = useNavigation();

	return (
		<View className='absolute bottom-5 w-full z-50'>
			<TouchableOpacity
				style={{ backgroundColor: themeColors.bgColor(1) }}
				className='flex-row justify-between items-center mx-5 rounded-full p-4 py-3 shadow-lg '
				onPress={() => {
					navigation.navigate('Cart', { restaurantId: restaurantId, cartItems: cartItems });
				}}
			>
				<View className='p-2 px-4 rounded-full' style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
					<Text className='font-extrabold text-white text-lg'>{totalQuantity}</Text>
				</View>
				<Text className='flex-1 text-center font-extrabold text-white text-lg'>View Cart</Text>
				<Text className='font-extrabold text-white text-lg'>${totalPrice}</Text>
			</TouchableOpacity>
		</View>
	);
}
