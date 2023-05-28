import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../../components/Footer/Footer';
import { useRoute } from '@react-navigation/native';
import { env } from '../../../env';

export default function RestaurantScreen() {
	const route = useRoute();
	const { restaurantId } = route.params;

	const [restaurant, setRestaurant] = useState(null);

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
		return <Text>Loading...</Text>; // Show a loading indicator while fetching the data
	}

	return (
		<SafeAreaView className='flex-1'>
			<ScrollView className='flex-1' contentContainerStyle='py-20 px-10'>
				{/* Restaurant logo, name, and location */}
				<View className='items-center mb-20'>
					<Image source={{ uri: restaurant.logo }} className='w-40 h-40 rounded-full' />
					<Text className='text-2xl font-bold mt-4'>{restaurant.restaurantName}</Text>
					<Text className='text-lg mt-2'>{restaurant.location}</Text>
				</View>

				{/* Menu */}
				<View className='mb-20'>
					<Text className='text-2xl font-bold mb-4 ml-2'>Menu</Text>
					{restaurant.menu ? (
						restaurant.menu.map((item, index) => (
							<View key={index} className='flex-row items-center mb-4'>
								<Image source={{ uri: item.image }} className='w-20 h-20 rounded-md mr-4 ml-2' />
								<View className='flex-1'>
									<Text className='text-xl font-bold'>{item.productName}</Text>
									<Text className='text-base mb-2 mr-1'>{item.description}</Text>
									<Text className='text-lg font-bold'>${item.price}</Text>
								</View>
							</View>
						))
					) : (
						<Text>No menu items found</Text>
					)}
				</View>
			</ScrollView>
			<Footer />
		</SafeAreaView>
	);
}
