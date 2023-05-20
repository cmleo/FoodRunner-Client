import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Footer from '../Footer/Footer';

function Dashboard() {
	const [userData, setUserData] = useState({});

	useEffect(() => {
		const fetchUserData = async () => {
			const token = await AsyncStorage.getItem('token');
			const response = await fetch(`http://192.168.0.101:3000/user`, {
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
		<SafeAreaView>
			<Text>Dashboard</Text>

			{userData ? (
				<>
					<Text style={styles.text}>Welcome, {userData.name}!</Text>
				</>
			) : (
				<Text>Loading...</Text>
			)}

			<Footer />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	text: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#333',
	},
});

export default Dashboard;
