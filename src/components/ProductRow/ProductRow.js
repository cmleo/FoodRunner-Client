import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { themeColors } from '../../theme/theme';
import { Feather } from '@expo/vector-icons';

export default function ProductRow({ item, addToCart, removeFromCart }) {
	const [quantity, setQuantity] = useState(0);

	const handleAddToCart = () => {
		addToCart(item);
		setQuantity(quantity + 1);
	};

	const handleRemoveFromCart = () => {
		if (quantity > 0) {
			removeFromCart(item);
			setQuantity(quantity - 1);
		}
	};

	return (
		<View className='flex-row items-center bg-white p-3 rounded-3xl shadow-2xl mb-3 mx-2'>
			<Image className='rounded-3xl' style={{ height: 100, width: 100 }} source={{ uri: item.image }} />
			<View className='flex flex-1 space-y-3'>
				<View className='pl-3'>
					<Text className='text-xl font-semibold'>{item.productName}</Text>
					<Text className='text-gray-700'>{item.description}</Text>
				</View>
				<View className='flex-row justify-between pl-3 items-center'>
					<Text className='text-gray-700 text-lg font-bold'>${item.price}</Text>
					<View className='flex-row items-center'>
						<TouchableOpacity
							className='p-1 rounded-full'
							style={{ backgroundColor: themeColors.bgColor(1) }}
							onPress={handleRemoveFromCart}
						>
							<Feather name='minus' size={16} color={'white'} />
						</TouchableOpacity>

						<Text className='px-3'>{quantity}</Text>

						<TouchableOpacity
							className='p-1 rounded-full'
							style={{ backgroundColor: themeColors.bgColor(1) }}
							onPress={handleAddToCart}
						>
							<Feather name='plus' size={16} color={'white'} />
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
	);
}
