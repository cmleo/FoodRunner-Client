import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { env } from '../../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

const UpdateRestaurantScreen = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const { restaurantId, updateRestaurantData } = route.params;
	const [restaurant, setRestaurant] = useState(null);
	const [token, setToken] = useState('');
	const [restaurantName, setRestaurantName] = useState('');
	const [location, setLocation] = useState('');
	const [logo, setLogo] = useState(null);
	const [menu, setMenu] = useState([]);

	useEffect(() => {
		fetchRestaurantData();
	}, []);

	const fetchRestaurantData = async () => {
		const storedToken = await AsyncStorage.getItem('token');
		if (!storedToken) {
			navigation.navigate('Login');
		} else {
			setToken(storedToken);
			fetch(`${env.API_URL}/restaurants/${restaurantId}`, {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + storedToken,
				},
			})
				.then((response) => response.json())
				.then((data) => {
					setRestaurant(data);
					setRestaurantName(data.restaurantName);
					setLocation(data.location);
					setLogo(data.logo);
					if (Array.isArray(data.menu)) {
						setMenu(data.menu);
					} else {
						setMenu([]);
					}
				})
				.catch((error) => {
					console.error(error);
				});
		}
	};

	const handleUpdateRestaurant = () => {
		const updatedRestaurant = {
			restaurantName,
			location,
			logo,
			menu,
		};

		fetch(`${env.API_URL}/restaurants/${restaurantId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token,
			},
			body: JSON.stringify(updatedRestaurant),
		})
			.then((response) => response.json())
			.then((data) => {
				updateRestaurantData(data);
				navigation.navigate('Admin');
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const updateRestaurant = (updatedRestaurant) => {
		// Update the state in the AdminScreen component
		updateRestaurantData(updatedRestaurant);
	};

	const handleAddProduct = () => {
		const newProduct = {
			productName: '',
			description: '',
			price: '',
			image: null,
		};

		setMenu([...menu, newProduct]);
	};

	const handleDeleteProduct = (index) => {
		const updatedMenu = [...menu];
		updatedMenu.splice(index, 1);
		setMenu(updatedMenu);
	};

	const handleProductChange = (index, key, value) => {
		const updatedMenu = [...menu];
		updatedMenu[index][key] = value;
		setMenu(updatedMenu);
	};

	const handleChooseLogo = async () => {
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

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView style={{ padding: 4 }}>
				{restaurant ? (
					<View>
						<Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>Restaurant Name</Text>
						<TextInput
							value={restaurantName}
							onChangeText={setRestaurantName}
							placeholder='Enter the restaurant name'
							style={{ borderWidth: 1, borderColor: 'gray', padding: 2, borderRadius: 5, marginBottom: 4 }}
						/>

						<Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>Location</Text>
						<TextInput
							value={location}
							onChangeText={setLocation}
							placeholder='Enter the location'
							style={{ borderWidth: 1, borderColor: 'gray', padding: 2, borderRadius: 5, marginBottom: 4 }}
						/>

						<Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>Logo</Text>
						<TouchableOpacity onPress={handleChooseLogo}>
							{logo ? (
								<Image source={{ uri: logo }} style={{ width: 100, height: 100, marginBottom: 4 }} />
							) : (
								<View
									style={{
										width: 100,
										height: 100,
										borderWidth: 1,
										borderColor: 'black',
										justifyContent: 'center',
										alignItems: 'center',
										marginBottom: 4,
									}}
								>
									<Feather name='camera' size={24} color='black' />
									<Text>Add Logo</Text>
								</View>
							)}
						</TouchableOpacity>

						<Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>Menu</Text>
						{menu.map((product, index) => (
							<View key={index} style={{ marginBottom: 4 }}>
								<Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>Product Name</Text>
								<TextInput
									value={product.productName}
									onChangeText={(value) => handleProductChange(index, 'productName', value)}
									placeholder='Enter the product name'
									style={{ borderWidth: 1, borderColor: 'gray', padding: 2, borderRadius: 5, marginBottom: 2 }}
								/>

								<Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>Description</Text>
								<TextInput
									value={product.description}
									onChangeText={(value) => handleProductChange(index, 'description', value)}
									placeholder='Enter the description'
									style={{ borderWidth: 1, borderColor: 'gray', padding: 2, borderRadius: 5, marginBottom: 2 }}
								/>

								<Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>Price</Text>
								<TextInput
									value={product.price.toString()}
									onChangeText={(value) => handleProductChange(index, 'price', parseFloat(value))}
									placeholder='Enter the price'
									keyboardType='numeric'
									style={{ borderWidth: 1, borderColor: 'gray', padding: 2, borderRadius: 5, marginBottom: 2 }}
								/>

								<Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>Image</Text>
								<TouchableOpacity onPress={() => handleChooseProductImage(index)}>
									{product.image ? (
										<Image source={{ uri: product.image }} style={{ width: 100, height: 100, marginBottom: 2 }} />
									) : (
										<View
											style={{
												width: 100,
												height: 100,
												borderWidth: 1,
												borderColor: 'black',
												justifyContent: 'center',
												alignItems: 'center',
												marginBottom: 2,
											}}
										>
											<Feather name='camera' size={24} color='black' />
											<Text>Add Image</Text>
										</View>
									)}
								</TouchableOpacity>

								<TouchableOpacity onPress={() => handleDeleteProduct(index)}>
									<Text style={{ color: 'red', marginTop: 2 }}>Delete</Text>
								</TouchableOpacity>
							</View>
						))}

						<TouchableOpacity onPress={handleAddProduct}>
							<Text style={{ color: 'blue', marginBottom: 4 }}>Add Product</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={handleUpdateRestaurant} style={{ marginBottom: 2 }}>
							<Text style={{ color: 'white', backgroundColor: 'blue', padding: 2, borderRadius: 5, textAlign: 'center' }}>
								Apply Changes
							</Text>
						</TouchableOpacity>
					</View>
				) : null}
			</ScrollView>
		</SafeAreaView>
	);
};

export default UpdateRestaurantScreen;
