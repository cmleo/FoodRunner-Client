import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { env } from '../../../env';

export default function Categories(props) {
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		const fetchCategories = async () => {
			const response = await fetch(`${env.API_URL}/categories`);
			const data = await response.json();
			setCategories(data);
		};
		fetchCategories();
	}, []);

	useEffect(() => {
		if (props.activeCategory) {
			const fetchRestaurants = async () => {
				const response = await fetch(`${env.API_URL}/categories/${props.activeCategory}/restaurants`);
				const data = await response.json();
				props.setRestaurants(data);
			};
			fetchRestaurants();
		} else {
			props.fetchAllRestaurants();
		}
	}, [props.activeCategory]);

	return (
		<View className='mt-4'>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				className='overflow-visible'
				contentContainerStyle={{
					paddingHorizontal: 15,
				}}
			>
				{categories.map((category) => {
					let isActive = category._id === props.activeCategory;
					let btnClass = isActive ? ' bg-gray-600' : ' bg-gray-200';
					let textClass = isActive ? ' font-semibold text-white' : ' text-gray-500';
					return (
						<View key={category._id} className='flex justify-center items-center mr-6'>
							<TouchableOpacity
								onPress={() => props.setActiveCategory(category._id)}
								className={'p-1 rounded-full shadow bg-gray-200' + btnClass}
							>
								<Text className={'text-sm p-1' + textClass}>{category.name}</Text>
							</TouchableOpacity>
						</View>
					);
				})}
			</ScrollView>
		</View>
	);
}
