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
		height: 50,
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
	errorText: {
		color: 'red',
		marginBottom: 10,
	},

	registerText: {
		fontWeight: '600',
		fontSize: 16,
		marginTop: 10,
	},

	registerLink: {
		color: 'blue',
		fontSize: 18,
		fontWeight: 'bold',
		textDecorationLine: 'underline',
	},
});

export default styles;
