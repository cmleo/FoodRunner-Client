import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './LoginStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { env } from '../../../env';

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [role, setRole] = useState('user');

	useEffect(() => {
		const loadRememberedCredentials = async () => {
			try {
				const storedEmail = await AsyncStorage.getItem('email');
				const storedPassword = await AsyncStorage.getItem('password');
				const storedLoginTime = await AsyncStorage.getItem('loginTime');
				const storedRole = await AsyncStorage.getItem('role');
				const token = await AsyncStorage.getItem('token');

				if (storedEmail && storedPassword && storedLoginTime) {
					const currentTime = new Date().getTime();
					const loginTime = parseInt(storedLoginTime);
					const timeLimit = 60 * 60 * 1000; // 1h in milliseconds

					if (currentTime - loginTime <= timeLimit && token) {
						if (storedRole === 'user') {
							navigation.navigate('Home', { role: storedRole });
						} else if (storedRole === 'admin') {
							navigation.navigate('Admin', { role: storedRole });
						}
					} else {
						// Clear the stored credentials if the time limit has exceeded
						AsyncStorage.removeItem('email');
						AsyncStorage.removeItem('password');
						AsyncStorage.removeItem('loginTime');
						AsyncStorage.removeItem('role');
					}
				}
			} catch (error) {
				console.log('Error loading remembered credentials:', error);
			}
		};

		loadRememberedCredentials();
	}, []);

	// Validate inputs
	const validateForm = () => {
		let isValid = true;

		if (!email) {
			setEmailError('Please enter an email address');
			isValid = false;
		} else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
			setEmailError('Please enter a valid email address');
			isValid = false;
		} else {
			setEmailError('');
		}

		if (!password) {
			setPasswordError('Please enter a password');
			isValid = false;
		} else {
			setPasswordError('');
		}
		return isValid;
	};

	const handleLogin = () => {
		const isValid = validateForm();

		if (isValid) {
			let loginEndpoint = '';
			if (role === 'user') {
				loginEndpoint = `${env.API_URL}/user/login`;
			} else if (role === 'admin') {
				loginEndpoint = `${env.API_URL}/admin/login`;
			}

			fetch(loginEndpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: email,
					password: password,
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					handleReset();
					if (data.token) {
						AsyncStorage.setItem('token', data.token)
							.then(() => {
								if (data.message === 'Auth successful') {
									if (rememberMe) {
										AsyncStorage.setItem('email', email);
										AsyncStorage.setItem('password', password);
										AsyncStorage.setItem('role', role);

										// Store the login time
										const loginTime = new Date().getTime().toString();
										AsyncStorage.setItem('loginTime', loginTime);
									} else {
										AsyncStorage.removeItem('email');
										AsyncStorage.removeItem('password');
										AsyncStorage.removeItem('loginTime');
										AsyncStorage.removeItem('role');
									}

									if (role === 'user') {
										// Navigate to main screen
										navigation.navigate('Home', { role: role });
									} else if (role === 'admin') {
										// Navigate to AdminScreen
										navigation.navigate('Admin', { role: role });
									}
								} else {
									// Display error message returned from server
									Alert.alert('Error', data.message);
								}
							})
							.catch((error) => {
								console.log(error);
							});
					} else {
						console.log('No token found in response');
					}
				})
				.catch((error) => {
					console.log(error);
					Alert.alert('Error', 'Failed to connect to server. Please try again later.');
				});
		}
	};

	const handleReset = () => {
		setEmail('');
		setPassword('');
		setRememberMe(false);
		setEmailError('');
		setPasswordError('');
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Login</Text>

			<Picker
				selectedValue={role}
				onValueChange={(itemValue) => setRole(itemValue)}
				style={styles.input}
				itemStyle={{ height: '100%', width: '100%', margin: 0, padding: 0 }}
			>
				<Picker.Item label='Client' value='user' />
				<Picker.Item label='Restaurant Owner' value='admin' />
			</Picker>

			<TextInput
				style={styles.input}
				placeholder='Email'
				onChangeText={(text) => setEmail(text)}
				value={email}
				keyboardType='email-address'
			/>
			{emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

			<TextInput
				style={styles.input}
				placeholder='Password'
				secureTextEntry={true}
				onChangeText={(text) => setPassword(text)}
				value={password}
			/>
			{passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

			<View style={styles.checkboxContainer}>
				<TouchableOpacity style={styles.checkbox} onPress={() => setRememberMe(!rememberMe)}>
					{rememberMe ? <Text style={styles.checkboxText}>✓</Text> : <Text style={styles.checkboxText}> </Text>}
				</TouchableOpacity>
				<Text style={styles.checkboxLabel}>Remember Me</Text>
			</View>

			<TouchableOpacity style={styles.button} onPress={handleLogin}>
				<Text style={styles.buttonText}>Login</Text>
			</TouchableOpacity>

			<Text style={styles.registerText}>
				Don't have an account?{' '}
				<Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
					Register
				</Text>
			</Text>
		</SafeAreaView>
	);
};

export default LoginScreen;
