import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { env } from '../../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, SimpleLineIcons } from '@expo/vector-icons';
import Footer from '../../components/Footer/Footer';

const AdminScreen = () => {
	const navigation = useNavigation();
	const [restaurants, setRestaurants] = useState([]);
	const [token, setToken] = useState('');
	const route = useRoute();
	const { role } = route.params;

	useEffect(() => {
		// Fetch the list of restaurants created by the admin
		const fetchAdminRestaurants = async () => {
			const storedToken = await AsyncStorage.getItem('token');
			if (!storedToken) {
				navigation.navigate('Login');
			} else {
				setToken(storedToken);
				fetch(`${env.API_URL}/restaurants/admin`, {
					method: 'GET',
					headers: {
						Authorization: 'Bearer ' + storedToken,
					},
				})
					.then((response) => response.json())
					.then((data) => {
						setRestaurants(data);
					})
					.catch((error) => {
						console.error(error);
					});
			}
		};
		fetchAdminRestaurants();
	}, []);

	const handleCreateRestaurant = () => {
		// Navigate to the create restaurant screen
		navigation.navigate('CreateRestaurant');
	};

	const handleUpdateRestaurant = (restaurantId) => {
		// Navigate to the update restaurant screen with the restaurant ID
		navigation.navigate('UpdateRestaurant', { restaurantId });
	};

	const handleLogout = async () => {
		try {
			await AsyncStorage.removeItem('token');
			navigation.navigate('Login');
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	const handleDeleteRestaurant = (restaurantId) => {
		Alert.alert(
			'Delete Restaurant',
			'Are you sure you want to delete this restaurant?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					onPress: () => {
						fetch(`${env.API_URL}/restaurants/${restaurantId}`, {
							method: 'DELETE',
							headers: {
								Authorization: 'Bearer ' + token,
							},
						})
							.then(() => {
								// Refresh the list of restaurants after deleting one
								fetchAdminRestaurants();
							})
							.catch((error) => {
								console.error(error);
							});
					},
					style: 'destructive',
				},
			],
			{ cancelable: false }
		);
	};

	const renderItem = ({ item }) => (
		<View key={item._id} style={{ marginVertical: 10, paddingHorizontal: 2 }}>
			<View className='flex-row justify-between items-center'>
				<View style={{ flex: 1 }}>
					<Text className='font-bold text-lg'>{item.restaurantName}</Text>
					<Text className='text text-sm'>{item.location}</Text>
				</View>
				<TouchableOpacity onPress={() => handleDeleteRestaurant(item._id, token)}>
					<Feather name='trash-2' size={26} color='red' />
				</TouchableOpacity>
			</View>

			<ScrollView key={item._id}>
				<TouchableOpacity onPress={() => handleUpdateRestaurant(item._id)}>
					<Image source={{ uri: item.logo }} style={{ width: '100%', height: 200, borderRadius: 10 }} />
				</TouchableOpacity>
			</ScrollView>
		</View>
	);

	return (
		<SafeAreaView className='flex-1'>
			<View className='p-4'>
				<TouchableOpacity onPress={handleLogout} className='absolute top-10 right-2'>
					<SimpleLineIcons name='logout' size={32} color='red' />
				</TouchableOpacity>
				<Text className='text-2xl font-bold mb-4 text-center'>Admin</Text>
				<Text className='text-lg font-bold mb-2'>Restaurants</Text>
			</View>
			<View className='flex-1'>
				<FlatList data={restaurants} renderItem={renderItem} keyExtractor={(item) => item._id} className='p-4' />
				<TouchableOpacity onPress={handleCreateRestaurant} className='p-4 bg-blue-500 rounded'>
					<Text className='text-white font-bold'>Create New Restaurant</Text>
				</TouchableOpacity>
			</View>
			<Footer role={role} />
		</SafeAreaView>
	);
};

export default AdminScreen;
