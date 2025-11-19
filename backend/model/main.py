from transformers import ViTImageProcessor, ViTForImageClassification
from PIL import Image
import torch

classes = ["ugandan_rolex", "milk", "chicken_stew", "fish_stew", "nakati", "utensils", "peas_soup", "millet", "pumpkin", "_roasted_groundnuts", "beans_soup", "pilau", "sweet_potatoes", "Ground_nut_sauce", "banana_leaves", "chapati_street_food", "nsenene", "boiled_cassava", "irish_potatoes", "cassava", "chai", "yams", "ground_nuts", "beans", "tomatoes", "eggs", "maize", "posho", "beef_stew", "samosa", "matooke", "pumpkin_soup", "katogo", "onions", "matooke_meal", "ugandan_local_food", "pork_stew", "garlic", "peas", "rice"]

# Load model and processor with ignore_mismatched_sizes=True
processor = ViTImageProcessor.from_pretrained("ssevan/ug-food-detector")
model = ViTForImageClassification.from_pretrained(
    "ssevan/ug-food-detector",
    num_labels=len(classes)
)

# Process image
image = Image.open('./bulgogi-2-1024x811.jpg')
inputs = processor(image, return_tensors='pt')

# Get predictions
with torch.no_grad():
    outputs = model(**inputs)
    probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
    predicted_class_idx = torch.argmax(probabilities, dim=1).item()

print(f'Class: {classes[predicted_class_idx]}')
