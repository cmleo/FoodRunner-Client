import { Text, Image } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function OrderReceivedScreen() {
	const navigation = useNavigation();
	useEffect(() => {
		setTimeout(() => {
			navigation.navigate('Home');
		}, 5000);
	}, []);

	return (
		<SafeAreaView className='flex-1 items-center justify-center bg-white'>
			<Image
				source={{
					uri: 'https://shorturl.at/doDO6',
				}}
				className='h-80 w-full'
			/>
		</SafeAreaView>
	);
}
