import { View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { themeColors } from '../../theme/theme';
import Search from '../../components/Search/Search';
import Categories from '../../components/Categories/Categories';
import Footer from '../../components/Footer/Footer';
import RestaurantCard from '../../components/RestaurantCard/RestaurantCard';
import { env } from '../../../env';

export default function HomeScreen() {
	const [restaurants, setRestaurants] = useState([]);
	const [activeCategory, setActiveCategory] = useState(null);
	const searchRef = useRef(null);

	const fetchAllRestaurants = async () => {
		const response = await fetch(`${env.API_URL}/restaurants`);
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
					<RestaurantCard restaurants={restaurants} fetchAllRestaurants={fetchAllRestaurants} />
				</ScrollView>
			</View>
			<Footer searchRef={searchRef} />
		</SafeAreaView>
	);
}
