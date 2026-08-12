import { StyleSheet, Text, View } from 'react-native';

export default function FavoritesScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Favorites</Text>
            <Text>Your favorite images will appear here.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
    },
});