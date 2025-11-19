from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from transformers import ViTForImageClassification, ViTImageProcessor
from PIL import Image
import torch
import io

app = FastAPI()

# Define your ingredients/classes list
classes = [
    "ugandan_rolex", "milk", "chicken_stew", "fish_stew", "nakati", "utensils",
    "peas_soup", "millet", "pumpkin", "_roasted_groundnuts", "beans_soup", "pilau",
    "sweet_potatoes", "Ground_nut_sauce", "banana_leaves", "chapati_street_food",
    "nsenene", "boiled_cassava", "irish_potatoes", "cassava", "chai", "yams",
    "ground_nuts", "beans", "tomatoes", "eggs", "maize", "posho", "beef_stew",
    "samosa", "matooke", "pumpkin_soup", "katogo", "onions", "matooke_meal",
    "ugandan_local_food", "pork_stew", "garlic", "peas", "rice"
]

# Load the model and processor with correct number of labels
model_id = "ssevan/ug-food-detector"
processor = ViTImageProcessor.from_pretrained(model_id)
model = ViTForImageClassification.from_pretrained(
    model_id,
    num_labels=len(classes),
    ignore_mismatched_sizes=True
)
model.eval()  # set to evaluation mode

@app.post("/predict-ingredients")
async def predict_ingredients(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid image type. Upload JPEG or PNG.")

    image_bytes = await file.read()
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file.")

    # Preprocess the image
    inputs = processor(image, return_tensors="pt")

    # Run inference
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probabilities = torch.nn.functional.softmax(logits, dim=-1)[0]

    # Select ingredients with probability threshold (e.g., >0.3)
    threshold = 0.3
    detected_ingredients = [
        classes[i] for i, prob in enumerate(probabilities) if prob > threshold
    ]

    return JSONResponse({"ingredients": detected_ingredients})

# To run: uvicorn your_script_name:app --reload
