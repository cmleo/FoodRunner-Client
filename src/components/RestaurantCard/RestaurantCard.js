import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function RestaurantCard({ restaurants, fetchAllRestaurants }) {
	const navigation = useNavigation();

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{
				paddingBottom: 20,
			}}
		>
			{/* restaurants */}
			{restaurants.map((restaurant) => (
				<View key={restaurant._id} style={{ marginVertical: 10, paddingHorizontal: 20 }}>
					<Text style={{ fontWeight: 'bold', fontSize: 18 }}>{restaurant.restaurantName}</Text>
					<Text style={{ fontSize: 14 }}>{restaurant.location}</Text>

					<ScrollView key={restaurant._id}>
						<TouchableOpacity onPress={() => navigation.navigate('Restaurant', { restaurantId: restaurant._id })}>
							<Image source={{ uri: restaurant.logo }} style={{ width: '100%', height: 200, borderRadius: 10 }} />
						</TouchableOpacity>
					</ScrollView>
				</View>
			))}
		</ScrollView>
	);
}
