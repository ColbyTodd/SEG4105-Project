import deeplake
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import EfficientNetB0
import tensorflow_addons as tfa

# Constants
IMG_SIZE = 224
NUM_CLASSES = 498
BATCH_SIZE = 32
EPOCHS_TRANSFER = 10
EPOCHS_FINE_TUNE = 10

def load_dataset():
    # Load dataset using deeplake API (modify path if needed)
    ds = deeplake.open('hub://sainikhileshreddy/food-recognition-2022-train/', read_only=True)
    ds_tensorflow = ds.tensorflow()
    return ds_tensorflow

def preprocess(image, label):
    image = tf.image.resize(image, (IMG_SIZE, IMG_SIZE))
    image = tf.cast(image, tf.float32) / 255.0
    return image, label

def prepare_data(ds_tensorflow):
    AUTOTUNE = tf.data.AUTOTUNE
    dataset = ds_tensorflow.map(preprocess)
    dataset = dataset.shuffle(1000).batch(BATCH_SIZE).prefetch(AUTOTUNE)
    return dataset

def build_model():
    base_model = EfficientNetB0(weights='imagenet', include_top=False, input_shape=(IMG_SIZE, IMG_SIZE, 3))
    base_model.trainable = False

    inputs = layers.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    x = base_model(inputs, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(NUM_CLASSES, activation='sigmoid')(x)

    model = models.Model(inputs, outputs)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss='binary_crossentropy',
        metrics=[tfa.metrics.F1Score(num_classes=NUM_CLASSES, average='micro', threshold=0.5)]
    )
    return model

def main():
    ds_tensorflow = load_dataset()
    train_dataset = prepare_data(ds_tensorflow)

    model = build_model()

    print("Starting transfer learning training...")
    model.fit(train_dataset, epochs=EPOCHS_TRANSFER)

    print("Starting fine-tuning...")
    model.layers[1].trainable = True  # Unfreeze base model
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
        loss='binary_crossentropy',
        metrics=[tfa.metrics.F1Score(num_classes=NUM_CLASSES, average='micro', threshold=0.5)]
    )

    model.fit(train_dataset, epochs=EPOCHS_FINE_TUNE)

if __name__ == "__main__":
    main()
