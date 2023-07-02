import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { env } from '../../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const UpdateRestaurantScreen = ({ route }) => {
	const navigation = useNavigation();
	const { restaurantId } = route.params;
	const [restaurant, setRestaurant] = useState(null);
	const [token, setToken] = useState('');
	const [updatedRestaurant, setUpdatedRestaurant] = useState({
		restaurantName: '',
		location: '',
		logo: '',
		menu: [],
	});

	useEffect(() => {
		fetchRestaurant();
	}, []);

	const fetchRestaurant = async () => {
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
					setUpdatedRestaurant({
						restaurantName: data.restaurantName,
						location: data.location,
						logo: data.logo,
						menu: data.menu || [],
					});
				})
				.catch((error) => {
					console.error(error);
				});
		}
	};

	const handleUpdateRestaurant = () => {
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
				// Handle success and show appropriate message
				Alert.alert('Success', data.message, [{ text: 'OK' }]);
			})
			.catch((error) => {
				console.error(error);
				// Handle error and show appropriate message
				Alert.alert('Error', 'Failed to update restaurant', [{ text: 'OK' }]);
			});
	};

	const handleChangeRestaurantName = (text) => {
		setUpdatedRestaurant((prevState) => ({
			...prevState,
			restaurantName: text,
		}));
	};

	const handleChangeLocation = (text) => {
		setUpdatedRestaurant((prevState) => ({
			...prevState,
			location: text,
		}));
	};

	const handleChangeLogo = (text) => {
		setUpdatedRestaurant((prevState) => ({
			...prevState,
			logo: text,
		}));
	};

	const handleChangeProductName = (index, text) => {
		setUpdatedRestaurant((prevState) => {
			const updatedMenu = [...prevState.menu];
			updatedMenu[index].productName = text;
			return {
				...prevState,
				menu: updatedMenu,
			};
		});
	};

	const handleChangeDescription = (index, text) => {
		setUpdatedRestaurant((prevState) => {
			const updatedMenu = [...prevState.menu];
			updatedMenu[index].description = text;
			return {
				...prevState,
				menu: updatedMenu,
			};
		});
	};

	const handleChangePrice = (index, text) => {
		setUpdatedRestaurant((prevState) => {
			const updatedMenu = [...prevState.menu];
			updatedMenu[index].price = text;
			return {
				...prevState,
				menu: updatedMenu,
			};
		});
	};

	const handleChangeImage = (index, text) => {
		setUpdatedRestaurant((prevState) => {
			const updatedMenu = [...prevState.menu];
			updatedMenu[index].image = text;
			return {
				...prevState,
				menu: updatedMenu,
			};
		});
	};

	const handleAddProduct = () => {
		setUpdatedRestaurant((prevState) => ({
			...prevState,
			menu: [
				...prevState.menu,
				{
					productName: '',
					description: '',
					price: '',
					image: '',
				},
			],
		}));
	};

	const handleRemoveProduct = (index) => {
		setUpdatedRestaurant((prevState) => {
			const updatedMenu = [...prevState.menu];
			updatedMenu.splice(index, 1);
			return {
				...prevState,
				menu: updatedMenu,
			};
		});
	};

	return (
		<SafeAreaView className='flex-1'>
			<ScrollView className='p-4'>
				<TouchableOpacity onPress={() => navigation.goBack()} className='absolute top-2 left-2'>
					<Feather name='arrow-left' size={24} color='black' />
				</TouchableOpacity>
				<Text className='text-2xl font-bold mb-4 text-center'>Update Restaurant</Text>
				{restaurant && (
					<View>
						<Text className='text-lg font-bold mb-2'>Restaurant Name</Text>
						<Text className='mb-4'>{restaurant.restaurantName}</Text>
						<TextInput
							value={updatedRestaurant.restaurantName}
							onChangeText={handleChangeRestaurantName}
							placeholder='Enter restaurant name'
							className='border p-2 mb-4'
						/>

						<Text className='text-lg font-bold mb-2'>Location</Text>
						<Text className='mb-4'>{restaurant.location}</Text>
						<TextInput
							value={updatedRestaurant.location}
							onChangeText={handleChangeLocation}
							placeholder='Enter location'
							className='border p-2 mb-4'
						/>

						<Text className='text-lg font-bold mb-2'>Logo URL</Text>
						<Text className='mb-4'>{restaurant.logo}</Text>
						<TextInput
							value={updatedRestaurant.logo}
							onChangeText={handleChangeLogo}
							placeholder='Enter logo URL'
							className='border p-2 mb-4'
						/>

						<Text className='text-lg font-bold mb-2'>Menu</Text>
						{updatedRestaurant.menu.map((product, index) => (
							<View key={index}>
								<Text className='text-lg font-bold mb-2'>Product {index + 1}</Text>
								<Text className='mb-2'>Product Name: {product.productName}</Text>
								<TextInput
									value={product.productName}
									onChangeText={(text) => handleChangeProductName(index, text)}
									placeholder='Enter product name'
									className='border p-2 mb-2'
								/>

								<Text className='mb-2'>Description: {product.description}</Text>
								<TextInput
									value={product.description}
									onChangeText={(text) => handleChangeDescription(index, text)}
									placeholder='Enter description'
									className='border p-2 mb-2'
								/>

								<Text className='mb-2'>Price: {product.price}</Text>
								<TextInput
									value={product.price}
									onChangeText={(text) => handleChangePrice(index, text)}
									placeholder='Enter price'
									className='border p-2 mb-2'
								/>

								<Text className='mb-4'>Image URL: {product.image}</Text>
								<TextInput
									value={product.image}
									onChangeText={(text) => handleChangeImage(index, text)}
									placeholder='Enter image URL'
									className='border p-2 mb-4'
								/>

								<TouchableOpacity onPress={() => handleRemoveProduct(index)} className='p-2 bg-red-500 rounded'>
									<Text className='text-white font-bold'>Remove Product</Text>
								</TouchableOpacity>
							</View>
						))}

						<TouchableOpacity onPress={handleAddProduct} className='p-2 bg-green-500 rounded'>
							<Text className='text-white font-bold'>Add Product</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => {
								handleUpdateRestaurant();
								navigation.navigate('Admin');
							}}
							className='p-4 bg-blue-500 rounded'
						>
							<Text className='text-white font-bold'>Update Restaurant</Text>
						</TouchableOpacity>
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

export default UpdateRestaurantScreen;
