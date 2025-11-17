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

export default function LoginScreen({ onLogin, onCreateAccount }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (username.trim() !== '' && password.trim() !== '') {
            onLogin();
        } else {
            Alert.alert('Login Failed', 'Please enter both username and password');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Please login to continue</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.createButton]} onPress={onCreateAccount}>
                    <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0f7fa',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
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
    button: {
        backgroundColor: '#00796b',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        marginTop: 10,
    },
    createButton: {
        backgroundColor: '#4a90e2',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});
