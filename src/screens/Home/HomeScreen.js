import { View, Text, ScrollView, Image, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { themeColors } from '../../theme/theme';
import Search from '../../components/Search/Search';
import Categories from '../../components/Categories/Categories';
import Footer from '../../components/Footer/Footer';

export default function HomeScreen() {
	const [restaurants, setRestaurants] = useState([]);
	const [activeCategory, setActiveCategory] = useState(null);
	const searchRef = useRef(null);

	const fetchAllRestaurants = async () => {
		const response = await fetch(`http://192.168.0.102:3000/restaurants`);
		const data = await response.json();
		setRestaurants(data);
		setActiveCategory(null);
	};

	return (
		<SafeAreaView className='bg-white flex-1'>
			<View className='flex-1'>
				{/* search bar */}
				<View className='flex-row items-center space-x-2 px-4 pb-2'>
					<Search searchRef={searchRef} />
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
						<TouchableOpacity
							style={{ backgroundColor: themeColors.bgColor(1) }}
							className='p-4 rounded-l-full ml-24'
							onPress={fetchAllRestaurants}
						>
							<MaterialIcons name='clear' size={24} color='black' />
						</TouchableOpacity>
					</ScrollView>

					{/* restaurants */}
					{restaurants.map((restaurant) => (
						<View key={restaurant._id} style={{ marginVertical: 10, paddingHorizontal: 20 }}>
							<Text style={{ fontWeight: 'bold', fontSize: 18 }}>{restaurant.restaurantName}</Text>
							<Text style={{ fontSize: 14 }}>{restaurant.location}</Text>

							<ScrollView horizontal showsHorizontalScrollIndicator={false} key={restaurant._id} className='overflow-visible py-5'>
								<Image source={{ uri: restaurant.logo }} style={{ width: '100%', height: 200, borderRadius: 10 }} />
							</ScrollView>
						</View>
					))}
				</ScrollView>
			</View>
			<Footer searchRef={searchRef} />
		</SafeAreaView>
	);
}
