import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const Footer = ({ searchRef }) => {
	const navigation = useNavigation();
	const route = useRoute();
	const isHomeScreen = route.name === 'Home';

	return (
		<View style={styles.footer}>
			<TouchableOpacity onPress={() => navigation.navigate('Home')}>
				<AntDesign name='home' size={24} color='black' />
			</TouchableOpacity>

			<TouchableOpacity onPress={isHomeScreen ? () => searchRef.current?.focus() : null} disabled={!isHomeScreen}>
				<Ionicons name='search' size={24} color={isHomeScreen ? 'black' : 'gray'} />
			</TouchableOpacity>

			<TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
				<FontAwesome name='user' size={24} color='black' />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		backgroundColor: '#fff',
		height: 60,
		borderTopWidth: 1,
		borderTopColor: '#ccc',
		width: '100%',
	},
});

export default Footer;
