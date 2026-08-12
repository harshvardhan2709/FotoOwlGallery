import { StyleSheet, Text, View } from 'react-native';

export default function RegisterScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <Text>Registration screen coming next.</Text>
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