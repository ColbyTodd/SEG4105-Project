import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    Animated,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

// Get screen width for responsive image sizing
const { width } = Dimensions.get('window');

export default function HomeScreen({ onLogout }) {

    // Preloaded demo images
    const [foodImages, setFoodImages] = useState([
        { source: require('../assets/food1.jpg'), dishName: 'Butter Chicken with Naan', calories: '750', ingredients: 'Butter Chicken, Butter Sauce, Naan Bread' },
        { source: require('../assets/food2.jpg'), dishName: 'Hakka Noodles', calories: '400', ingredients: 'Noodles, Chili Sauce, Egg, Tofu, Parsley' },
        { source: require('../assets/food3.jpg'), dishName: 'Sushi', calories: '540', ingredients: 'Cucumber, Crab Legs, Seaweed' },
        { source: require('../assets/food4.jpg'), dishName: 'Pizza', calories: '980', ingredients: 'Dough, Cheese, Mushroom, Pepper, Olives' },
        { source: require('../assets/food5.jpg'), dishName: 'Burger and Chips', calories: '610', ingredients: 'Beef, Onion, Cheese, Tomato, Lettuce, Potato Chips' },
    ]);

    // Carousel and modal state variables
    const [activeIndex, setActiveIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    // Dish info for the modal
    const [currentDishName, setCurrentDishName] = useState('');
    const [currentCalories, setCurrentCalories] = useState('');
    const [currentIngredients, setCurrentIngredients] = useState('');

    // Keeps track of which image is being edited
    const [currentImageIndex, setCurrentImageIndex] = useState(null);

    // Stores a newly taken or uploaded image before saving
    const [tempImage, setTempImage] = useState(null);

    // Modal mode flags
    const [isNewImage, setIsNewImage] = useState(false); // new image upload
    const [isEditing, setIsEditing] = useState(false);   // toggles text input editing

    // Backup values for canceling edits
    const [backupDishName, setBackupDishName] = useState('');
    const [backupCalories, setBackupCalories] = useState('');
    const [backupIngredients, setBackupIngredients] = useState('');

    // Scroll/animation refs
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollRef = useRef(null);

    // Layout values for snapping effect
    const imageWidth = width * 0.7;
    const imageSpacing = 15;
    const snapInterval = imageWidth + imageSpacing;

    /**
     * Updates active index while scrolling horizontally
     */
    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        {
            listener: (event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / snapInterval);
                setActiveIndex(index);
            },
            useNativeDriver: false,
        }
    );

    /**
     * Scroll programmatically to an index in the carousel
     */
    const scrollToIndex = (index) => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTo({ x: index * snapInterval, animated: true });
    };

    /**
     * Pick an existing image from the device
     */
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            setTempImage({ uri: result.assets[0].uri });

            // Default dish info for new uploads
            openModalForNewImage('Fish and Chips', '650', 'Fish, Fries, Lemon, Tartar Sauce');
        }
    };

    /**
     * Take a photo using the device camera
     */
    const takePhoto = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status !== 'granted') return;

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            setTempImage({ uri: result.assets[0].uri });
            openModalForNewImage('Fish and Chips', '650', 'Fish, Fries, Lemon, Tartar Sauce');
        }
    };

    /**
     * Opens modal in "new image" mode with default values
     */
    const openModalForNewImage = (defaultDishName, defaultCalories, defaultIngredients) => {
        setCurrentDishName(defaultDishName);
        setCurrentCalories(defaultCalories);
        setCurrentIngredients(defaultIngredients);

        // Backup so "cancel edit" works correctly
        setBackupDishName(defaultDishName);
        setBackupCalories(defaultCalories);
        setBackupIngredients(defaultIngredients);

        setCurrentImageIndex(null);
        setIsNewImage(true);
        setIsEditing(false);
        setModalVisible(true);
    };

    /**
     * Opens modal to edit an existing food card
     */
    const openEditModal = (index) => {
        if (!foodImages[index]) return;

        setCurrentImageIndex(index);

        // Load dish details
        setCurrentDishName(foodImages[index].dishName);
        setCurrentCalories(foodImages[index].calories);
        setCurrentIngredients(foodImages[index].ingredients);

        // Backup original values
        setBackupDishName(foodImages[index].dishName);
        setBackupCalories(foodImages[index].calories);
        setBackupIngredients(foodImages[index].ingredients);

        setTempImage(null);
        setIsNewImage(false);
        setIsEditing(false);
        setModalVisible(true);

        scrollToIndex(index);
    };

    /**
     * Save changes from the modal
     */
    const saveModal = () => {
        // Saving NEW image
        if (tempImage && isNewImage) {
            const newFood = {
                source: tempImage,
                dishName: currentDishName,
                calories: currentCalories,
                ingredients: currentIngredients,
            };
            setFoodImages([...foodImages, newFood]);

            // Snap to the new image
            setTimeout(() => scrollToIndex(foodImages.length), 100);
        }

        // Saving edits to EXISTING image
        else if (currentImageIndex !== null) {
            const updated = [...foodImages];
            updated[currentImageIndex] = {
                ...updated[currentImageIndex],
                dishName: currentDishName,
                calories: currentCalories,
                ingredients: currentIngredients,
            };
            setFoodImages(updated);
        }

        resetModalState();
    };

    /**
     * Deletes a card OR closes modal for new images
     */
    const discardModal = () => {
        // New image? → just close modal
        if (isNewImage && tempImage) {
        }

        // Remove existing image
        else if (currentImageIndex !== null && foodImages[currentImageIndex]) {
            const updated = [...foodImages];
            updated.splice(currentImageIndex, 1);
            setFoodImages(updated);

            // Adjust carousel index safely
            const newIndex = Math.min(updated.length - 1, currentImageIndex);
            setActiveIndex(newIndex);
        }

        resetModalState();
    };

    /**
     * Reverts text edits to original values
     */
    const cancelEdit = () => {
        setCurrentDishName(backupDishName);
        setCurrentCalories(backupCalories);
        setCurrentIngredients(backupIngredients);
        setIsEditing(false);
    };

    /**
     * Clears all modal state
     */
    const resetModalState = () => {
        setTempImage(null);
        setIsNewImage(false);
        setCurrentImageIndex(null);
        setIsEditing(false);
        setCurrentDishName('');
        setCurrentCalories('');
        setCurrentIngredients('');
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>

            {/* Main Title */}
            <Text style={styles.title}>Welcome!</Text>

            {/* Scrollable animated food carousel */}
            <Animated.ScrollView
                horizontal
                ref={scrollRef}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                snapToInterval={snapInterval}
                snapToAlignment="center"
                decelerationRate="fast"
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {foodImages.map((img, index) => {

                    // Create scale animation effect based on scroll position
                    const inputRange = [
                        (index - 1) * snapInterval,
                        index * snapInterval,
                        (index + 1) * snapInterval,
                    ];

                    const scale = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.8, 1, 0.8],
                        extrapolate: 'clamp',
                    });

                    return (
                        <TouchableOpacity key={index} onPress={() => openEditModal(index)}>
                            <Animated.Image
                                source={img.source.uri ? { uri: img.source.uri } : img.source}
                                style={[
                                    styles.foodImage,
                                    {
                                        marginLeft: index === 0 ? 20 : 0,
                                        marginRight: index === foodImages.length - 1 ? 20 : imageSpacing,
                                        transform: [{ scale }],
                                    },
                                ]}
                            />
                        </TouchableOpacity>
                    );
                })}
            </Animated.ScrollView>

            {/* Carousel dot indicators */}
            <View style={styles.dotsContainer}>
                {foodImages.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            { backgroundColor: index === activeIndex ? '#00796b' : '#ccc' },
                        ]}
                    />
                ))}
            </View>

            {/* Upload / Camera Button Row */}
            <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.button, { flex: 1, marginRight: 10 }]} onPress={pickImage}>
                    <Text style={styles.buttonText}>Upload Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, { flex: 1, marginLeft: 10 }]} onPress={takePhoto}>
                    <Text style={styles.buttonText}>Use Camera</Text>
                </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={onLogout}>
                <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>

            {/* Modal for editing / adding images */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <KeyboardAvoidingView
                    style={styles.modalContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={styles.modalContent}>

                        {/* Preview image inside modal */}
                        {(tempImage || (currentImageIndex !== null && foodImages[currentImageIndex])) && (
                            <Image
                                source={tempImage ? tempImage : foodImages[currentImageIndex].source}
                                style={styles.modalImage}
                            />
                        )}

                        {/* Editable text fields */}
                        <Text>Dish Name:</Text>
                        <TextInput
                            style={styles.input}
                            value={currentDishName}
                            onChangeText={setCurrentDishName}
                            editable={isEditing}
                        />

                        <Text>Calories:</Text>
                        <TextInput
                            style={styles.input}
                            value={currentCalories}
                            onChangeText={setCurrentCalories}
                            editable={isEditing}
                            keyboardType="numeric"
                        />

                        <Text>Ingredients:</Text>
                        <TextInput
                            style={[styles.input, { height: 60 }]}
                            value={currentIngredients}
                            onChangeText={setCurrentIngredients}
                            editable={isEditing}
                            multiline={true}
                        />

                        {/* Modal action buttons */}
                        <View style={styles.modalButtons}>

                            {/* Edit / Cancel Edit */}
                            {!isEditing ? (
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: '#00796b', marginRight: 10 }]}
                                    onPress={() => setIsEditing(true)}
                                >
                                    <Text style={styles.buttonText}>Edit</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: '#00796b', marginRight: 10 }]}
                                    onPress={cancelEdit}
                                >
                                    <Text style={styles.buttonText}>Cancel Edit</Text>
                                </TouchableOpacity>
                            )}

                            {/* Save */}
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#009688', marginRight: 10 }]}
                                onPress={saveModal}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>

                            {/* Discard */}
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#e53935' }]}
                                onPress={discardModal}
                            >
                                <Text style={styles.buttonText}>Discard</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

/* --------------------------- STYLES --------------------------- */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e0f7fa', paddingTop: 30 },
    title: { fontSize: 36, fontWeight: 'bold', color: '#00796b', textAlign: 'center', marginBottom: 15 },
    scrollContent: { alignItems: 'center' },
    foodImage: { width: width * 0.7, height: 250, borderRadius: 15, resizeMode: 'cover' },
    dotsContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 15 },
    dot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 5 },
    buttonRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
    button: { backgroundColor: '#00796b', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 12, alignSelf: 'center', alignItems: 'center' },
    logoutButton: { backgroundColor: '#e53935', marginTop: 20 },
    buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
    modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: 'white', marginHorizontal: 15, borderRadius: 15, padding: 15 },
    modalImage: { width: '100%', height: 200, borderRadius: 15, marginBottom: 8, resizeMode: 'cover' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 8, marginBottom: 8 },
    modalButtons: { flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' },
    modalButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
});
