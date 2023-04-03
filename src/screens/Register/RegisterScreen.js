import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const RegisterScreen = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [phone, setPhone] = useState('');

	const handleRegister = () => {
		fetch('http://192.168.0.102:3000/user/signup', {
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
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				handleReset();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleReset = () => {
		setName('');
		setEmail('');
		setPassword('');
		setPhone('');
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Register</Text>
			<TextInput style={styles.input} placeholder='Name' onChangeText={(text) => setName(text)} value={name} />
			<TextInput style={styles.input} placeholder='Email' onChangeText={(text) => setEmail(text)} value={email} />
			<TextInput
				style={styles.input}
				placeholder='Password'
				secureTextEntry={true}
				onChangeText={(text) => setPassword(text)}
				value={password}
			/>
			<TextInput style={styles.input} placeholder='Phone' onChangeText={(text) => setPhone(text)} value={phone} />
			<TouchableOpacity style={styles.button} onPress={handleRegister}>
				<Text style={styles.buttonText}>Register</Text>
			</TouchableOpacity>
		</View>
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
});

export default RegisterScreen;
