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
import { Picker } from '@react-native-picker/picker';

export default function CreateAccountScreen({ onBack }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [exercise, setExercise] = useState('placeholder');

    const handleCreate = () => {
        if (
            username.trim() !== '' &&
            password.trim() !== '' &&
            email.trim() !== '' &&
            height.trim() !== '' &&
            weight.trim() !== '' &&
            exercise !== 'placeholder'
        ) {
            Alert.alert(
                'Account Created',
                `Username: ${username}\nEmail: ${email}\nHeight: ${height} cm\nWeight: ${weight} kg\nExercise: ${exercise}`
            );
            onBack(); // Go back to LoginScreen
        } else {
            Alert.alert('Error', 'Please fill out all fields and select exercise frequency');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Enter your information</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Height (cm)"
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Weight (kg)"
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                />

                <Picker
                    selectedValue={exercise}
                    onValueChange={(itemValue) => setExercise(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Exercise Frequency" value="placeholder" />
                    <Picker.Item label="Frequently" value="frequently" />
                    <Picker.Item label="Occasionally" value="occasionally" />
                    <Picker.Item label="Rarely" value="rarely" />
                    <Picker.Item label="Never" value="never" />
                    <Picker.Item label="Prefer not to say" value="prefer_not_to_say" />
                </Picker>

                <TouchableOpacity style={styles.button} onPress={handleCreate}>
                    <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.backButton]} onPress={onBack}>
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
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
    picker: {
        width: '100%',
        height: 50,
        marginBottom: 15,
        borderColor: '#004d40',
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: '#00796b',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    backButton: {
        backgroundColor: '#e53935',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});
