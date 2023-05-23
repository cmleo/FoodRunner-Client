import { View, Text, TextInput } from 'react-native';
import React from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';

export default function Search({ searchRef }) {
	return (
		<View className='flex-row flex-1 items-center p-3 rounded-full border border-gray-300'>
			<Ionicons name='search' size={24} color='black' />
			<TextInput placeholder='Restaurants' className='flex-1 ml-2' ref={searchRef} />
			<View className='flex-row items-center space-x-1 border-0 border-l-2 pl-2 border-l-gray-300'>
				<Feather name='map-pin' size={24} color='black' />
				<Text className='text-gray-600'></Text>
			</View>
		</View>
	);
}
