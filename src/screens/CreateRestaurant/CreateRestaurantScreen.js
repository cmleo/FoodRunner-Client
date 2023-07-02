import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { env } from '../../../env';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const CreateRestaurantScreen = () => {
	const navigation = useNavigation();
	const [restaurantName, setRestaurantName] = useState('');
	const [location, setLocation] = useState('');
	const [menu, setMenu] = useState([]);
	const [logo, setLogo] = useState(null);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [restaurantId, setRestaurantId] = useState(null);

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

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		const storedToken = await AsyncStorage.getItem('token');

		if (!storedToken) {
			navigation.navigate('Login');
		} else {
			await fetch(`${env.API_URL}/categories`, {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + storedToken,
				},
			})
				.then((response) => response.json())
				.then((data) => {
					if (data) {
						setCategories(data);
					} else {
						Alert.alert('Failed to fetch categories. Please try again.');
					}
				})
				.catch((error) => {
					console.error(error);
					Alert.alert('An error occurred while fetching the categories. Please try again later.');
				});
		}
	};

	const handleChooseCategory = (value) => {
		setSelectedCategory(value);
	};

	const handleAssignCategory = async () => {
		const storedToken = await AsyncStorage.getItem('token');

		if (!storedToken) {
			navigation.navigate('Login');
			return;
		}

		if (!selectedCategory) {
			Alert.alert('Please select a category');
			return;
		}

		await handleCreateRestaurant((restaurantId) => {
			fetch(`${env.API_URL}/categories/restaurant/${selectedCategory}`, {
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + storedToken,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ restaurantId: restaurantId }),
			})
				.then((response) => response.json())
				.then((data) => {
					if (data) {
						Alert.alert('Restaurant created successfully!');
						navigation.navigate('Admin');
					} else {
						Alert.alert('Failed to assign the category to the restaurant. Please try again.');
					}
				})
				.catch((error) => {
					console.error(error);
					Alert.alert('An error occurred while assigning the category. Please try again later.');
				});
		});
	};

	const handleCreateRestaurant = async (callback) => {
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
					if (data) {
						const storedRestaurantId = data.result._id;
						setRestaurantId(storedRestaurantId);
						Alert.alert('Restaurant created successfully!');
						callback(storedRestaurantId);
						navigation.navigate('Admin');
					} else {
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
			<View key={index} style={{ marginBottom: 6 }}>
				<TextInput
					style={{ borderColor: 'gray', borderWidth: 1, borderRadius: 4, padding: 8, marginBottom: 4 }}
					placeholder='Product Name'
					value={product.productName}
					onChangeText={(text) => handleProductChange(index, 'productName', text)}
				/>

				<TextInput
					style={{ borderColor: 'gray', borderWidth: 1, borderRadius: 4, padding: 8, marginBottom: 4 }}
					placeholder='Description'
					value={product.description}
					onChangeText={(text) => handleProductChange(index, 'description', text)}
				/>

				<TextInput
					style={{ borderColor: 'gray', borderWidth: 1, borderRadius: 4, padding: 8, marginBottom: 4 }}
					placeholder='Price'
					value={product.price.toString()} // Convert to string to avoid warning
					onChangeText={(text) => handleProductChange(index, 'price', text)}
					keyboardType='numeric'
				/>
				<TouchableOpacity onPress={() => handleChooseProductImage(index)} style={{ marginBottom: 2 }}>
					<Text style={{ color: 'blue' }}>Choose Product Image</Text>
				</TouchableOpacity>
				{product.image && (
					<Image source={{ uri: product.image }} style={{ width: 40, height: 40, borderRadius: 10, marginBottom: 2 }} />
				)}
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
			<View className='bg-blue-200 w-auto rounded-lg mb-2'>
				<Picker
					selectedValue={selectedCategory}
					onValueChange={(value) => {
						handleChooseCategory(value);
					}}
				>
					<Picker.Item label='Choose Category' value={null} />
					{categories.map((category) => (
						<Picker.Item key={category._id} label={category.name} value={category._id} />
					))}
				</Picker>
			</View>
			<ScrollView>{renderProductInputs()}</ScrollView>
			<TouchableOpacity onPress={handleAddProduct} className='mb-4'>
				<Text className='text-blue-600'>Add Product</Text>
			</TouchableOpacity>
			{renderProductInputs && (
				<View>
					<TouchableOpacity onPress={handleChooseImage} className='mb-4'>
						<Text className='text-blue-600'>Choose Restaurant Logo</Text>
					</TouchableOpacity>
					{logo && <Image source={{ uri: logo }} className='w-20 h-20 rounded-lg mb-2' />}
				</View>
			)}
			<TouchableOpacity
				onPress={async () => {
					await handleAssignCategory();
				}}
				className='bg-blue-600 rounded-md py-2'
			>
				<Text className='text-white text-center text-lg'>Create Restaurant</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default CreateRestaurantScreen;
