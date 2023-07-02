import { View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { env } from '../../../env';

export default function Search({ searchRef, setRestaurants, fetchAllRestaurants }) {
	const [searchQuery, setSearchQuery] = useState('');
	const handleSearch = async () => {
		if (!searchQuery || searchQuery.length < 3) {
			return;
		}

		try {
			const response = await fetch(`${env.API_URL}/restaurants/search/${searchQuery}`);
			const data = await response.json();
			setRestaurants(data.docs);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<View className='flex-row flex-1 items-center p-3 mt-3 rounded-full border border-gray-300'>
			<Ionicons name='search' size={24} color='black' />
			<TextInput
				placeholder='Restaurants or food'
				className='flex-1 ml-2'
				ref={searchRef}
				onChangeText={setSearchQuery}
				onSubmitEditing={handleSearch}
			/>
			<View className='flex-row items-center space-x-1 border-0 border-l-2 pl-2 border-l-gray-300'>
				<TouchableOpacity onPress={fetchAllRestaurants}>
					<MaterialIcons name='clear' size={30} color='black' />
				</TouchableOpacity>
			</View>
		</View>
	);
}
