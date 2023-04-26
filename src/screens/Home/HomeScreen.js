import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
	const [username, setUsername] = useState(null);

	const getAuthenticatedUser = async (token) => {
		const response = await fetch('http://192.168.1.3:3000/user', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();
		if (data.username) {
			setUsername(data.username);
		}
	};

	useEffect(() => {
		AsyncStorage.getItem('token')
			.then((token) => {
				if (token) {
					getAuthenticatedUser(token);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	return (
		<View>
			<Text>Welcome {username}</Text>
		</View>
	);
};

export default HomeScreen;
