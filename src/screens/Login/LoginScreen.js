import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, AsyncStorage } from 'react-native';

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);

	const handleLogin = () => {
		fetch('http://192.168.0.102:3000/user/login', {
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
				console.log(data);
				handleReset();
				if (data.token && rememberMe) {
					AsyncStorage.setItem('token', data.token);
				}
				// Add logic to navigate to the main app screen
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleReset = () => {
		setEmail('');
		setPassword('');
		setRememberMe(false);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Login</Text>
			<TextInput style={styles.input} placeholder='Email' onChangeText={(text) => setEmail(text)} value={email} />

			<TextInput
				style={styles.input}
				placeholder='Password'
				secureTextEntry={true}
				onChangeText={(text) => setPassword(text)}
				value={password}
			/>

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
	checkboxContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderWidth: 1,
		borderRadius: 3,
		borderColor: 'gray',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 10,
	},
	checkboxText: {
		fontSize: 16,
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

export default LoginScreen;
