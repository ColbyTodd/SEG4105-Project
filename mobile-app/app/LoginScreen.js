import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

// LoginScreen component receives two callbacks:
// onLogin          – called when login is successful
// onCreateAccount  – navigates to account creation screen
export default function LoginScreen({ onLogin, onCreateAccount }) {

    // Local state for username and password input fields
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Called when the Login button is pressed
    // Simple validation to ensure fields are not empty
    const handleLogin = () => {
        if (username.trim() !== '' && password.trim() !== '') {
            onLogin(); // Trigger parent-provided login handler
        } else {
            Alert.alert('Login Failed', 'Please enter both username and password');
        }
    };

    return (
        // Moves content up when the keyboard appears (especially on iOS)
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* ScrollView prevents keyboard from covering the inputs and allows small screens to scroll */}
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                {/* App title + subtitle */}
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Please login to continue</Text>

                {/* Username input */}
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none" // Prevents automatic capital letters
                />

                {/* Password input */}
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry // Hides typed characters
                />

                {/* Login button */}
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                {/* Navigate to Create Account screen */}
                <TouchableOpacity
                    style={[styles.button, styles.createButton]}
                    onPress={onCreateAccount}
                >
                    <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    // Main layout styling
    container: {
        flexGrow: 1,             // Allows content to grow and center properly
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0f7fa',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    // Header text
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#00796b',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
        color: '#004d40',
    },
    // Input fields styling
    input: {
        width: '100%',
        height: 50,
        borderColor: '#004d40',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: 'white',
        fontSize: 16,
    },
    // Primary button styling
    button: {
        backgroundColor: '#00796b',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        marginTop: 10,
    },
    // Create account button uses a different color
    createButton: {
        backgroundColor: '#4a90e2',
    },
    // Button text styling
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});
