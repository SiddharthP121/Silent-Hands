from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import mediapipe as mp
import pickle

app = Flask(__name__)
CORS(app)

# Load model safely (saved by train_model.py includes label_encoder)
model_package = pickle.load(open('./model.p', 'rb'))
model = model_package['model']
label_enc = model_package.get('label_encoder', None)

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.5)

# you can build a fallback dictionary from encoder
if label_enc is not None:
    labels_dict = {i: label for i, label in enumerate(label_enc.classes_)}
else:
    labels_dict = {
        0: 'Hello, Goodbye',
        1: 'Thumbs Up', 
        2: 'Thumbs Down',
        3: 'I love you',
    }

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'sign': 'No Image'})

    file = request.files['image']
    npimg = np.frombuffer(file.read(), np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    
    if frame is None:
        return jsonify({'sign': 'Invalid Image'})

    data_aux = []
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(frame_rgb)

    if results.multi_hand_landmarks:
        hand_landmarks = results.multi_hand_landmarks[0]

        # gather raw coords
        raw_coords = []
        for lm in hand_landmarks.landmark:
            raw_coords.extend([lm.x, lm.y, lm.z])

        # normalize exactly like collect_data.py
        wrist_x, wrist_y, wrist_z = raw_coords[0], raw_coords[1], raw_coords[2]
        normalized = []
        for i in range(0, len(raw_coords), 3):
            normalized.extend([
                raw_coords[i] - wrist_x,
                raw_coords[i+1] - wrist_y,
                raw_coords[i+2] - wrist_z,
            ])
        max_val = max(abs(v) for v in normalized) or 1
        data_aux = [v / max_val for v in normalized]

        try:
            # Prediction
            prediction = model.predict([np.array(data_aux)])
            if label_enc is not None:
                result_text = label_enc.inverse_transform(prediction)[0]
            else:
                result_text = labels_dict.get(int(prediction[0]), "Unknown")

            print(f"Prediction result: {result_text}")
            return jsonify({'sign': result_text})
        except Exception:
            return jsonify({'sign': 'Prediction Error'})

    return jsonify({'sign': 'None'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)