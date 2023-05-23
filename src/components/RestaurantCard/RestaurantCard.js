import { View, Text, ScrollView, Image } from 'react-native';
import React from 'react';

export default function RestaurantCard({ restaurants, fetchAllRestaurants }) {
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
					<Text stAyle={{ fontSize: 14 }}>{restaurant.location}</Text>

					<ScrollView key={restaurant._id}>
						<Image source={{ uri: restaurant.logo }} style={{ width: '100%', height: 200, borderRadius: 10 }} />
					</ScrollView>
				</View>
			))}
		</ScrollView>
	);
}
