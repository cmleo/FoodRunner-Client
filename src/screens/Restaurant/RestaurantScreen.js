import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { env } from '../../../env';
import { AntDesign, Feather } from '@expo/vector-icons';
import { themeColors } from '../../theme/theme';
import ProductRow from '../../components/ProductRow/ProductRow';
import CartIcon from '../../components/CartIcon/CartIcon';

export default function RestaurantScreen() {
	const route = useRoute();
	const navigation = useNavigation();
	const { restaurantId } = route.params;

	const [restaurant, setRestaurant] = useState(null);
	const [cartItems, setCartItems] = useState({});

	useEffect(() => {
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
	}, []);

	if (!restaurant) {
		return <Text className='font-bold text-xl text-center'>Loading...</Text>;
	}

	const addToCart = (item) => {
		setCartItems((prevItems) => {
			const updatedItems = { ...prevItems };
			if (updatedItems[item._id]) {
				updatedItems[item._id].quantity++;
			} else {
				updatedItems[item._id] = { ...item, quantity: 1 };
			}
			return updatedItems;
		});
	};

	const removeFromCart = (item) => {
		setCartItems((prevItems) => {
			const updatedItems = { ...prevItems };
			if (updatedItems[item._id]) {
				updatedItems[item._id].quantity--;
				if (updatedItems[item._id].quantity === 0) {
					delete updatedItems[item._id];
				}
			}
			return updatedItems;
		});
	};

	return (
		<SafeAreaView className='flex-1'>
			<CartIcon cartItems={cartItems} restaurantId={restaurantId} removeFromCart={removeFromCart} />
			<ScrollView>
				<View className='relative'>
					<Image className='w-full h-60' source={{ uri: restaurant.logo }} />
					<TouchableOpacity onPress={navigation.goBack} className='absolute top-10 left-4 bg-gray-50 p-2 rounded-full shadow'>
						<AntDesign name='arrowleft' size={24} color={themeColors.bgColor(1)} />
					</TouchableOpacity>
				</View>

				<View style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }} className='bg-white -mt-12 pt-4'>
					<View className='px-5'>
						<Text className='text-2xl font-bold text-center'>{restaurant.restaurantName}</Text>
						<View className='flex-row space-x-2 my-1'>
							<Text className='text-sm'>
								<Feather name='map-pin' size={16} color={themeColors.bgColor(1)} />
								<Text>{restaurant.location}</Text>
							</Text>
						</View>
					</View>
				</View>

				<View className='pb-36 bg-gray-100'>
					<Text className='px-4 py-4 text-2xl font-bold'>Menu</Text>
					{/* menu */}
					{restaurant.menu.map((product, index) => (
						<ProductRow item={{ ...product }} key={index} addToCart={addToCart} removeFromCart={removeFromCart} />
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
