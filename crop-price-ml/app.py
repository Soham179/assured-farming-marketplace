import os
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import random

# -------------------------------
# Flask app
# -------------------------------
app = Flask(__name__)
CORS(app)  # Allow all origins for frontend

# -------------------------------
# BASE DIRECTORY
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "models", "rf_model.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "models", "label_encoder.pkl")
FEATURES_PATH = os.path.join(BASE_DIR, "models", "feature_columns.pkl")

# -------------------------------
# Load model & helpers
# -------------------------------
model = joblib.load(MODEL_PATH)
le = joblib.load(ENCODER_PATH)
feature_columns = joblib.load(FEATURES_PATH)

print("✅ Model & files loaded successfully")

# -------------------------------
# Health check
# -------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "ML API running successfully",
        "model_loaded": True,
        "available_crops": list(le.classes_),
        "endpoints": {
            "GET /": "Health check",
            "POST /predict-price": "Enhanced price prediction for frontend"
        }
    })


# -------------------------------
# Get available crops
# -------------------------------
@app.route("/available-crops", methods=["GET"])
def available_crops():
    return jsonify({
        "success": True,
        "crops": list(le.classes_),
        "count": len(le.classes_)
    })


# -------------------------------
# Predict price API (frontend friendly)
# -------------------------------
@app.route("/predict-price", methods=["POST"])
def predict_price():
    try:
        data = request.json

        crop_name = data.get("crop_name") or data.get("Crop")
        year = int(data.get("year") or data.get("Year") or 2026)
        month = int(data.get("month") or data.get("Month") or 1)

        if not crop_name:
            return jsonify({"success": False, "error": "Crop name is required"})

        # Encode crop
        try:
            crop_encoded = le.transform([crop_name])[0]
        except:
            return jsonify({"success": False, "error": f"Invalid crop. Use one of: {list(le.classes_)}"})

        # Default features
        default_features = {"Rainfall": 50, "Season": 1, "Prev_Month_WPI": 100, "Temperature": 30}

        input_data = {
            "Crop": crop_encoded,
            "Year": year,
            "Month": month,
            "Rainfall": float(data.get("Rainfall", default_features["Rainfall"])),
            "Season": int(data.get("Season", default_features["Season"])),
            "Prev_Month_WPI": float(data.get("Prev_Month_WPI", default_features["Prev_Month_WPI"])),
            "Temperature": float(data.get("Temperature", default_features["Temperature"]))
        }

        X_real = pd.DataFrame([input_data])
        X_real = X_real[feature_columns]

        predicted_wpi = model.predict(X_real)[0]

        # Base prices (₹/kg)
        base_prices = {
            "Bajra": 20, "Carrot": 25, "Corn": 18, "Cotton": 22, "Jowar": 21,
            "Masoor": 40, "Moong": 50, "Onion": 20, "Orange": 30, "Rice": 30,
            "Soyabean": 28, "Sugarcane": 10, "Sunflower": 45, "SweetPotato": 18,
            "Tomato": 25, "Urad": 48, "Wheat": 20
        }
        base_WPI = 100
        price_per_kg = (predicted_wpi / base_WPI) * base_prices.get(crop_name, 25)

        # Confidence
        confidence = "high" if 90 <= predicted_wpi <= 110 else "medium" if 70 <= predicted_wpi <= 130 else "low"

        # Market trend
        base_price = base_prices.get(crop_name, 25)
        if price_per_kg > base_price * 1.1:
            market_trend = "up"
        elif price_per_kg < base_price * 0.9:
            market_trend = "down"
        else:
            market_trend = "stable"

        # Historical data
        historical_data = generate_historical_data(crop_name, year, month, price_per_kg)

        # Factors
        factors = {
            "weather_impact": get_weather_impact(month),
            "market_demand": get_market_demand(crop_name, month),
            "seasonal_factors": get_seasonal_factors(crop_name, month)
        }

        # Best time to sell
        best_time_to_sell = get_best_time_to_sell(crop_name, month, price_per_kg)

        return jsonify({
            "success": True,
            "wpi": round(predicted_wpi, 2),
            "price_per_kg": round(price_per_kg, 2),
            "confidence": confidence,
            "market_trend": market_trend,
            "best_time_to_sell": best_time_to_sell,
            "historical_data": historical_data,
            "factors": factors,
            "crop": crop_name,
            "year": year,
            "month": month
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


# -------------------------------
# Helper functions
# -------------------------------
def generate_historical_data(crop_name, year, month, current_price):
    historical = []
    base_prices = {
        "Bajra": 20, "Carrot": 25, "Corn": 18, "Cotton": 22, "Jowar": 21,
        "Masoor": 40, "Moong": 50, "Onion": 20, "Orange": 30, "Rice": 30,
        "Soyabean": 28, "Sugarcane": 10, "Sunflower": 45, "SweetPotato": 18,
        "Tomato": 25, "Urad": 48, "Wheat": 20
    }
    base_price = base_prices.get(crop_name, 25)
    for i in range(12, 0, -1):
        hist_month = month - i
        hist_year = year
        if hist_month <= 0:
            hist_month += 12
            hist_year -= 1
        season_factor = get_seasonality_factor(crop_name, hist_month)
        random_factor = 0.8 + random.random() * 0.4
        price = base_price * season_factor * random_factor
        historical.append({"month": f"{hist_month:02d}-{hist_year}", "price": round(price, 2)})
    return historical


def get_seasonality_factor(crop_name, month):
    if month in [12, 1, 2]:
        return 1.2 if crop_name in ["Tomato", "Onion", "Carrot"] else 1.0
    elif month in [3, 4, 5]:
        return 0.9 if crop_name in ["Tomato", "Onion"] else 1.1
    elif month in [6, 7, 8, 9]:
        return 1.0
    elif month in [10, 11]:
        return 1.1
    return 1.0


def get_weather_impact(month):
    return {
        12: "Winter - favorable",
        1: "Winter - favorable",
        2: "Winter - favorable",
        3: "Summer - irrigation needed",
        4: "Summer - irrigation needed",
        5: "Summer - irrigation needed",
        6: "Monsoon season - good",
        7: "Monsoon season - good",
        8: "Monsoon season - good",
        9: "Monsoon season - good",
        10: "Post-monsoon - normal",
        11: "Post-monsoon - normal"
    }.get(month, "Moderate weather")


def get_market_demand(crop_name, month):
    high_demand = ["Tomato", "Onion", "Potato"]
    stable_demand = ["Wheat", "Rice"]
    if crop_name in high_demand:
        return "High demand"
    elif crop_name in stable_demand:
        return "Stable demand"
    else:
        return "Average demand"


def get_seasonal_factors(crop_name, month):
    rabi_crops = ["Wheat", "Barley", "Mustard", "Gram"]
    kharif_crops = ["Rice", "Maize", "Cotton", "Soybean", "Groundnut"]
    if crop_name in rabi_crops and month in [10, 11, 12, 1, 2, 3]:
        return "Rabi season"
    elif crop_name in kharif_crops and month in [6, 7, 8, 9, 10]:
        return "Kharif season"
    return "Normal season"


def get_best_time_to_sell(crop_name, month, price_per_kg):
    base_prices = {"Bajra": 20, "Carrot": 25, "Corn": 18, "Cotton": 22, "Jowar": 21,
                   "Masoor": 40, "Moong": 50, "Onion": 20, "Orange": 30, "Rice": 30,
                   "Soyabean": 28, "Sugarcane": 10, "Sunflower": 45, "SweetPotato": 18,
                   "Tomato": 25, "Urad": 48, "Wheat": 20}
    base_price = base_prices.get(crop_name, 25)
    if price_per_kg > base_price * 1.15:
        return f"{month:02d}-{datetime.now().year} (Current price favorable)"
    next_month = month + 1
    next_year = datetime.now().year
    if next_month > 12:
        next_month = 1
        next_year += 1
    return f"{next_month:02d}-{next_year}"


# -------------------------------
# Run server
# -------------------------------
if __name__ == "__main__":
    print("🚀 Starting ML Price Prediction API...")
    print(f"📊 Available crops: {list(le.classes_)}")
    print("🌐 API running on http://localhost:5000")
    app.run(debug=True, port=5000)
