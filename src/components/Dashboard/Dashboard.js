import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Footer from '../Footer/Footer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { env } from '../../../env';

function Dashboard({ navigation }) {
	const [userData, setUserData] = useState({});
	const [editing, setEditing] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [passwordChanged, setPasswordChanged] = useState(false);
	const [currentPasswordError, setCurrentPasswordError] = useState('');
	const [newPasswordError, setNewPasswordError] = useState('');
	const [emailError, setEmailError] = useState('');

	useEffect(() => {
		const fetchUserData = async () => {
			const token = await AsyncStorage.getItem('token');
			const response = await fetch(`${env.API_URL}/user`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			setUserData(data[0]);
		};
		fetchUserData();
	}, []);

	const handleLogout = async () => {
		try {
			await AsyncStorage.removeItem('token');
			navigation.navigate('Login');
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	const handleUpdateInfo = async () => {
		try {
			const token = await AsyncStorage.getItem('token');
			const updateData = {};
			if (name) {
				updateData.name = name;
			}
			if (email && validateEmail(email)) {
				updateData.email = email;
				setEditing(false);
			} else {
				setEditing(true);
			}
			if (phone) {
				updateData.phone = phone;
			}

			const response = await fetch(`${env.API_URL}/user`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(updateData),
			});
			const data = await response.json();
			setUserData(data.result);
		} catch (error) {
			console.error('Update info error:', error);
		}
	};

	const handleChangePassword = async () => {
		try {
			setCurrentPasswordError('');
			setNewPasswordError('');

			const token = await AsyncStorage.getItem('token');
			const response = await fetch(`${env.API_URL}/user/change-password`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					currentPassword: currentPassword,
					newPassword: newPassword,
				}),
			});

			if (response.status === 401) {
				setCurrentPasswordError('Invalid current password');
				return;
			}

			const data = await response.json();
			if (data.token) {
				// Update the stored token with the new one
				await AsyncStorage.setItem('token', data.token);
				setPasswordChanged(true);
				setCurrentPassword('');
				setNewPassword('');
			}
		} catch (error) {
			console.error('Change password error:', error);
		}
	};

	const validateEmail = (email) => {
		// Simple email validation using regex
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setEmailError('Invalid email address');
			return false;
		}
		setEmailError('');
		return true;
	};

	return (
		<SafeAreaView className='flex-1 mt-1'>
			<ScrollView className='flex-grow pb-16'>
				<View className='px-4 py-6 bg-gray-100'>
					<Text className='text-3xl font-bold text-center'>Dashboard</Text>
				</View>

				<View className='p-4'>
					{userData ? (
						<View>
							<Text className='text-lg font-bold mb-2'>Welcome, {userData.name}!</Text>
							<View className='bg-white rounded shadow-md p-4'>
								{editing ? (
									<View>
										<TextInput
											style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 8 }}
											placeholder='Name'
											value={name}
											onChangeText={setName}
										/>
										<TextInput
											style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 8 }}
											placeholder='Email'
											value={email}
											onChangeText={setEmail}
											keyboardType='email-address'
										/>
										{emailError ? (
											<View>
												<Text style={{ color: 'red' }}>{emailError}</Text>
											</View>
										) : null}
										<TextInput
											style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 8 }}
											placeholder='Phone'
											value={phone}
											onChangeText={setPhone}
											keyboardType='phone-pad'
										/>
										<TouchableOpacity onPress={handleUpdateInfo} className='bg-green-500 text-white text-center py-3'>
											<Text className='text-lg font-bold'>Save</Text>
										</TouchableOpacity>
									</View>
								) : (
									<View>
										<Text className='text-gray-600'>User Name: {userData.name}</Text>
										<Text className='text-gray-600'>Email: {userData.email}</Text>
										<Text className='text-gray-600'>Phone: {userData.phone}</Text>
										<TouchableOpacity onPress={() => setEditing(true)} className='bg-blue-500 text-white text-center py-3 mt-4'>
											<Text className='text-lg font-bold'>Update Info</Text>
										</TouchableOpacity>
									</View>
								)}
							</View>
						</View>
					) : (
						<Text className='text-lg'>Loading...</Text>
					)}

					<View className='mt-8'>
						<Text className='text-lg font-bold mb-2'>Change Password</Text>
						<View className='bg-white rounded shadow-md p-4'>
							<TextInput
								style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 8 }}
								placeholder='Current Password'
								secureTextEntry
								value={currentPassword}
								onChangeText={setCurrentPassword}
							/>
							{currentPasswordError ? (
								<View>
									<Text style={{ color: 'red' }}>{currentPasswordError}</Text>
								</View>
							) : null}
							<TextInput
								style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 8 }}
								placeholder='New Password'
								secureTextEntry
								value={newPassword}
								onChangeText={setNewPassword}
							/>
							{newPasswordError ? (
								<View>
									<Text style={{ color: 'red' }}>{newPasswordError}</Text>
								</View>
							) : null}

							<TouchableOpacity onPress={handleChangePassword} className='bg-green-500 text-white text-center py-3'>
								<Text className='text-lg font-bold'>Change Password</Text>
							</TouchableOpacity>
							{passwordChanged && <Text className='text-green-500 mt-2'>Password changed successfully!</Text>}
						</View>
					</View>
					<TouchableOpacity
						onPress={() => navigation.navigate('DisplayOrders')}
						className='bg-orange-300 text-white text-center py-3 mt-4'
					>
						<Text className='text-lg font-bold'>View Orders</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>

			<TouchableOpacity onPress={handleLogout} className='bg-red-500 text-white text-center py-3'>
				<Text className='text-lg font-bold'>Logout</Text>
			</TouchableOpacity>

			<Footer />
		</SafeAreaView>
	);
}

export default Dashboard;
