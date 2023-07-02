import { View, ScrollView, Text } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { env } from '../../../env';
import { useRoute } from '@react-navigation/native';
import Categories from '../../components/Categories/Categories';
import RestaurantCard from '../../components/RestaurantCard/RestaurantCard';
import Search from '../../components/Search/Search';
import Footer from '../../components/Footer/Footer';

export default function HomeScreen() {
	const [restaurants, setRestaurants] = useState([]);
	const [activeCategory, setActiveCategory] = useState(null);
	const searchRef = useRef(null);
	const route = useRoute();
	const { role } = route.params;

	useEffect(() => {
		if (activeCategory) {
			fetchRestaurantsByCategory(activeCategory);
		} else {
			fetchAllRestaurants();
		}
	}, [activeCategory]);

	const fetchRestaurantsByCategory = async (categoryId) => {
		try {
			const response = await fetch(`${env.API_URL}/categories/${categoryId}/restaurants`);
			const data = await response.json();
			setRestaurants(data);
		} catch (error) {
			console.error('Error fetching restaurants by category:', error);
		}
	};

	const fetchAllRestaurants = async () => {
		try {
			const response = await fetch(`${env.API_URL}/restaurants`);
			const data = await response.json();
			setRestaurants(data);
			searchRef.current.clear();
		} catch (error) {
			console.error('Error fetching all restaurants:', error);
		}
	};

	return (
		<SafeAreaView className='bg-white flex-1'>
			<View className='flex-1'>
				{/* search bar */}
				<View className='flex-row items-center space-x-2 px-4 pb-2'>
					<Search searchRef={searchRef} setRestaurants={setRestaurants} fetchAllRestaurants={fetchAllRestaurants} />
				</View>

				{/* main */}
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{
						paddingBottom: 20,
					}}
				>
					{/* categories */}
					<ScrollView horizontal showsHorizontalScrollIndicator={true}>
						<Categories
							activeCategory={activeCategory}
							setActiveCategory={setActiveCategory}
							setRestaurants={setRestaurants}
							fetchAllRestaurants={fetchAllRestaurants}
						/>
					</ScrollView>

					{/* restaurants */}
					<RestaurantCard restaurants={restaurants} fetchAllRestaurants={fetchAllRestaurants} />
				</ScrollView>
			</View>
			<Footer searchRef={searchRef} role={role} />
		</SafeAreaView>
	);
}
