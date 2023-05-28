import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../../components/Footer/Footer';
import { useRoute } from '@react-navigation/native';
import { env } from '../../../env';

export default function RestaurantScreen() {
	const route = useRoute();
	const { restaurantId } = route.params;

	const [restaurant, setRestaurant] = useState(null);

	useEffect(() => {
		const fetchRestaurant = async () => {
			try {
				const response = await fetch(`${env.API_URL}/restaurants/${restaurantId}`);
				const data = await response.json();
				setRestaurant(data.restaurant);
				console.log(data);
			} catch (error) {
				console.log(error);
			}
		};

		fetchRestaurant();
	}, []);

	if (!restaurant) {
		return <Text>Loading...</Text>; // Show a loading indicator while fetching the data
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
				{/* Restaurant logo, name, and location */}
				<View style={styles.restaurantHeader}>
					<Image source={{ uri: restaurant.logo }} style={styles.logo} />
					<Text style={styles.restaurantName}>{restaurant.restaurantName}</Text>
					<Text style={styles.location}>{restaurant.location}</Text>
				</View>

				{/* Menu */}
				<View style={styles.menuContainer}>
					<Text style={styles.menuTitle}>Menu</Text>
					{restaurant.menu ? (
						restaurant.menu.map((item, index) => (
							<View key={index} style={styles.menuItem}>
								<Image source={{ uri: item.image }} style={styles.menuItemImage} />
								<View style={styles.menuItemDetails}>
									<Text style={styles.menuItemName}>{item.productName}</Text>
									<Text style={styles.menuItemDescription}>{item.description}</Text>
									<Text style={styles.menuItemPrice}>${item.price}</Text>
								</View>
							</View>
						))
					) : (
						<Text>No menu items found</Text>
					)}
				</View>
			</ScrollView>
			<Footer />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 1,
	},
	scrollView: {
		flex: 1,
	},
	contentContainer: {
		paddingVertical: 20,
		paddingHorizontal: 10,
	},
	restaurantHeader: {
		alignItems: 'center',
		marginBottom: 20,
	},
	logo: {
		width: 100,
		height: 100,
		borderRadius: 50,
	},
	restaurantName: {
		fontSize: 24,
		fontWeight: 'bold',
		marginTop: 10,
	},
	location: {
		fontSize: 16,
		marginTop: 5,
	},
	menuContainer: {
		marginBottom: 20,
	},
	menuTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	menuItemImage: {
		width: 80,
		height: 80,
		borderRadius: 10,
		marginRight: 10,
	},
	menuItemDetails: {
		flex: 1,
	},
	menuItemName: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	menuItemDescription: {
		fontSize: 14,
		marginBottom: 5,
	},
	menuItemPrice: {
		fontSize: 16,
		fontWeight: 'bold',
	},
});
