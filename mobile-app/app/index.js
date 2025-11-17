// Required for React Native Reanimated to work properly
import 'react-native-reanimated';

import React, { useState } from 'react';
import { View } from 'react-native';

// Import the three screens used for navigation
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import CreateAccountScreen from './CreateAccountScreen';

export default function Index() {

    // Tracks if the user is logged in or not
    const [loggedIn, setLoggedIn] = useState(false);

    // Tracks whether the user is currently on the "Create Account" page
    const [creatingAccount, setCreatingAccount] = useState(false);

    return (
        // Parent container that holds whichever screen is active
        <View style={{ flex: 1 }}>

            {/* If the user is logged in → show the Home Screen */}
            {loggedIn ? (
                <HomeScreen onLogout={() => setLoggedIn(false)} />

                // If not logged in, but creating an account → show Create Account Screen
            ) : creatingAccount ? (
                <CreateAccountScreen onBack={() => setCreatingAccount(false)} />

                // Otherwise → show Login Screen
            ) : (
                <LoginScreen
                    onLogin={() => setLoggedIn(true)}           // Trigger login
                    onCreateAccount={() => setCreatingAccount(true)} // Switch to account creation
                />
            )}
        </View>
    );
}
