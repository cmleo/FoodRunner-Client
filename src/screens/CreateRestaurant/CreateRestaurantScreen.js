import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { env } from '../../../env';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateRestaurantScreen = () => {
	const navigation = useNavigation();
	const [restaurantName, setRestaurantName] = useState('');
	const [location, setLocation] = useState('');
	const [menu, setMenu] = useState([]);
	const [logo, setLogo] = useState(null);

	const handleChooseImage = async () => {
		const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (permissionResult.granted === false) {
			Alert.alert('Permission required', 'Please allow access to the device gallery.');
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setLogo(result.assets[0].uri);
		}
	};

	const handleChooseProductImage = async (index) => {
		const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (permissionResult.granted === false) {
			Alert.alert('Permission required', 'Please allow access to the device gallery.');
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			const updatedMenu = [...menu];
			updatedMenu[index].image = result.assets[0].uri;
			setMenu(updatedMenu);
		}
	};

	const handleAddProduct = () => {
		setMenu([...menu, { productName: '', description: '', price: 0, image: null }]);
	};

	const handleProductChange = (index, field, value) => {
		const updatedMenu = [...menu];
		updatedMenu[index][field] = value;
		setMenu(updatedMenu);
	};

	const handleCreateRestaurant = async () => {
		const storedToken = await AsyncStorage.getItem('token');
		const requestData = {
			restaurantName,
			location,
			logo,
			menu,
		};

		if (!storedToken) {
			navigation.navigate('Login');
		} else {
			await fetch(`${env.API_URL}/restaurants`, {
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + storedToken,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestData),
			})
				.then((response) => response.json())
				.then((data) => {
					// Handle success and navigate to the admin screen or show a success message
					console.log(data);
					if (data) {
						// Success message or any other action
						Alert.alert('Restaurant created successfully!');
						navigation.navigate('Admin'); // Replace 'AdminScreen' with the actual screen name for the admin screen
					} else {
						// Handle failure case
						Alert.alert('Failed to create restaurant. Please try again.');
					}
				})
				.catch((error) => {
					console.error(error);
					Alert.alert('An error occurred while creating the restaurant. Please try again later.');
				});
		}
	};

	const renderProductInputs = () => {
		return menu.map((product, index) => (
			<View key={index} className='mb-6'>
				<TextInput
					className='border border-gray-400 rounded-md p-2 mb-2'
					placeholder='Product Name'
					value={product.productName}
					onChangeText={(text) => handleProductChange(index, 'productName', text)}
				/>
				<TextInput
					className='border border-gray-400 rounded-md p-2 mb-2'
					placeholder='Description'
					value={product.description}
					onChangeText={(text) => handleProductChange(index, 'description', text)}
				/>
				<TextInput
					className='border border-gray-400 rounded-md p-2 mb-2'
					placeholder='Price'
					value={product.price}
					onChangeText={(text) => handleProductChange(index, 'price', text)}
					keyboardType='numeric'
				/>
				<TouchableOpacity onPress={() => handleChooseProductImage(index)} className='mb-2'>
					<Text className='text-blue-600'>Choose Product Image</Text>
				</TouchableOpacity>
				{product.image && <Image source={{ uri: product.image }} className='w-40 h-40 rounded-lg mb-2' />}
			</View>
		));
	};

	return (
		<SafeAreaView className='flex-1 p-6'>
			<TextInput
				className='border border-gray-400 rounded-md p-2 mb-4'
				placeholder='Restaurant Name'
				value={restaurantName}
				onChangeText={(text) => setRestaurantName(text)}
			/>
			<TextInput
				className='border border-gray-400 rounded-md p-2 mb-4'
				placeholder='Location'
				value={location}
				onChangeText={(text) => setLocation(text)}
			/>
			<TouchableOpacity onPress={handleChooseImage} className='mb-4'>
				<Text className='text-blue-600'>Choose Restaurant Logo</Text>
			</TouchableOpacity>
			{logo && <Image source={{ uri: logo }} className='w-40 h-40 rounded-lg mb-4' />}
			<ScrollView>{renderProductInputs()}</ScrollView>
			<TouchableOpacity onPress={handleAddProduct} className='mb-4'>
				<Text className='text-blue-600'>Add Product</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={handleCreateRestaurant} className='bg-blue-600 rounded-md py-2'>
				<Text className='text-white text-center text-lg'>Create Restaurant</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default CreateRestaurantScreen;
