import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import Footer from '../Footer/Footer';
import { SafeAreaView } from 'react-native-safe-area-context';

function Dashboard() {
	const [userData, setUserData] = useState({});

	useEffect(() => {
		const fetchUserData = async () => {
			const token = await AsyncStorage.getItem('token');
			const response = await fetch(`http://192.168.0.102:3000/user`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			setUserData(data[0]);
		};
		fetchUserData();
	}, []);

	return (
		<SafeAreaView className='flex-1 mt-1'>
			<ScrollView className='flex-grow pb-16'>
				<Text className='text-xl font-bold mb-4'>Dashboard</Text>

				{userData ? (
					<>
						<Text className='text-lg'>Welcome, {userData.name}!</Text>
					</>
				) : (
					<Text className='text-lg'>Loading...</Text>
				)}
			</ScrollView>

			<Footer />
		</SafeAreaView>
	);
}

export default Dashboard;
