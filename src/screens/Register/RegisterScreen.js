import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, Alert, ScrollView, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from './RegisterStyles';

const RegisterScreen = ({ navigation }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [phone, setPhone] = useState('');
	const [nameError, setNameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');
	const [phoneError, setPhoneError] = useState('');
	const [role, setRole] = useState('user');

	// Validate inputs
	const validateForm = () => {
		let isValid = true;

		if (!name) {
			setNameError('Please enter your name');
			isValid = false;
		}

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

		if (!confirmPassword) {
			setConfirmPasswordError('Please confirm your password');
			isValid = false;
		} else if (password !== confirmPassword) {
			setConfirmPasswordError('Passwords do not match');
			isValid = false;
		}

		if (!phone) {
			setPhoneError('Please enter your phone number');
			isValid = false;
		} else if (!/^(?=0[723][2-8]\d{7})(?!.*(.)\1{2,}).{10}$/.test(phone)) {
			setPhoneError('Please enter a valid phone number');
			isValid = false;
		}

		return isValid;
	};

	const handleRegister = () => {
		const isValid = validateForm();

		if (isValid) {
			let registerEndpoint = '';
			if (role === 'user') {
				registerEndpoint = `${process.env.API_URL}/user/signup`;
			} else if (role === 'admin') {
				registerEndpoint = `${process.env.API_URL}/admin/signup`;
			}

			fetch(registerEndpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: name,
					email: email,
					password: password,
					phone: phone,
				}),
			})
				.then((response) => {
					if (response.status === 201) {
						// User registration success
						return response.json();
					} else if (response.status === 409) {
						// User already exists
						throw new Error('User Already Exists ! Try using a different email address !');
					} else {
						// Other errors
						throw new Error('Something went wrong, please try again later !');
					}
				})
				.then((data) => {
					console.log(data);
					handleReset();

					// Display success message as alert
					Alert.alert('Success', 'User Registered Successfully !');

					navigation.navigate('Login');
				})
				.catch((error) => {
					// Display error message as alert
					Alert.alert('Error', error.message);
					console.log(error);
				});
		}
	};

	const handleReset = () => {
		setName('');
		setEmail('');
		setPassword('');
		setPhone('');
	};
	return (
		<ScrollView>
			<SafeAreaView style={styles.container}>
				<Text style={styles.title}>Register</Text>

				<Picker selectedValue={role} onValueChange={(itemValue) => setRole(itemValue)} style={styles.input}>
					<Picker.Item label='Client' value='user' />
					<Picker.Item label='Restaurant Owner' value='admin' />
				</Picker>

				<TextInput style={styles.input} placeholder='Name' onChangeText={(text) => setName(text)} value={name} />
				{nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

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

				<TextInput
					style={styles.input}
					placeholder='Confirm Password'
					secureTextEntry={true}
					onChangeText={(text) => setConfirmPassword(text)}
					value={confirmPassword}
				/>
				{confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

				<TextInput
					style={styles.input}
					placeholder='Phone'
					onChangeText={(text) => setPhone(text)}
					value={phone}
					keyboardType='phone-pad'
				/>
				{phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

				<TouchableOpacity style={styles.button} onPress={handleRegister}>
					<Text style={styles.buttonText}>Register</Text>
				</TouchableOpacity>
			</SafeAreaView>
		</ScrollView>
	);
};

export default RegisterScreen;
