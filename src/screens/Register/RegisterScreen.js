import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

const RegisterScreen = () => {
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
			fetch('http://192.168.1.3:3000/user/signup', {
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
				})
				.catch((error) => {
					// Display error message as alert
					Alert.alert('Email', error.message);
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
			<View style={styles.container}>
				<Text style={styles.title}>Register</Text>
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
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 80,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	input: {
		width: '80%',
		height: 40,
		borderColor: 'gray',
		borderWidth: 1,
		borderRadius: 5,
		paddingLeft: 10,
		marginBottom: 10,
	},
	button: {
		width: '80%',
		height: 40,
		backgroundColor: 'blue',
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		color: 'white',
		fontWeight: 'bold',
	},
	errorText: {
		color: 'red',
		marginBottom: 10,
	},
});

export default RegisterScreen;
