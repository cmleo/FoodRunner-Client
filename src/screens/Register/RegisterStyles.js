import { StyleSheet } from 'react-native';

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
		marginTop: 10,
	},
	buttonText: {
		color: 'white',
		fontWeight: 'bold',
	},
	errorText: {
		color: 'red',
		marginBottom: 10,
	},

	loginText: {
		fontWeight: '600',
		fontSize: 16,
		marginTop: 10,
	},

	loginLink: {
		color: 'blue',
		fontSize: 18,
		fontWeight: 'bold',
		textDecorationLine: 'underline',
	},
});

export default styles;
