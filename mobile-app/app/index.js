import 'react-native-reanimated';
import React, { useState } from 'react';
import { View } from 'react-native';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import CreateAccountScreen from './CreateAccountScreen';

export default function Index() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [creatingAccount, setCreatingAccount] = useState(false);

    return (
        <View style={{ flex: 1 }}>
            {loggedIn ? (
                <HomeScreen onLogout={() => setLoggedIn(false)} />
            ) : creatingAccount ? (
                <CreateAccountScreen onBack={() => setCreatingAccount(false)} />
            ) : (
                <LoginScreen
                    onLogin={() => setLoggedIn(true)}
                    onCreateAccount={() => setCreatingAccount(true)}
                />
            )}
        </View>
    );
}
