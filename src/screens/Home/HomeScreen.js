import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
	const [userData, setUserData] = useState({});

	useEffect(() => {
		const fetchUserData = async () => {
			const token = await AsyncStorage.getItem('token');
			const response = await fetch(`${process.env.API_URL}/user`, {
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
		<SafeAreaView style={styles.container}>
			{userData ? <Text style={styles.text}>Welcome, {userData.name}!</Text> : <Text>Loading...</Text>}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		fontSize: 20,
		fontWeight: 'bold',
	},
});

export default HomeScreen;
