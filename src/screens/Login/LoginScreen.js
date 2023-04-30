import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './LoginStyles';

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [role, setRole] = useState('user');

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
				loginEndpoint = `${process.env.API_URL}/user/login`;
			} else if (role === 'admin') {
				loginEndpoint = `${process.env.API_URL}/admin/login`;
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
						AsyncStorage.setItem('token', data.token);
					}

					if (data.message === 'Auth successful') {
						if (role === 'user') {
							// Navigate to main screen
							navigation.navigate('Home');
						} else if (role === 'admin') {
							// Navigate to AdminScreen
							Alert.alert('AdminLogged', 'Admin Login Successful !');
						}
					} else {
						// Display error message returned from server
						Alert.alert('Error', data.message);
					}
				})
				.catch((error) => {
					// Handle network errors
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

			<Picker selectedValue={role} onValueChange={(itemValue) => setRole(itemValue)} style={styles.input}>
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
