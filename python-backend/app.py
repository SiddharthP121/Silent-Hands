from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import mediapipe as mp
import pickle

app = Flask(__name__)
CORS(app)

# Load model safely
model_dict = pickle.load(open('./model.p', 'rb'))
model = model_dict['model']

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.5)

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

        # MATCHING YOUR CSV: Sending raw x, y, z without subtraction
        for i in range(len(hand_landmarks.landmark)):
            data_aux.append(hand_landmarks.landmark[i].x)
            data_aux.append(hand_landmarks.landmark[i].y)
            data_aux.append(hand_landmarks.landmark[i].z)

        try:
            # Prediction
            prediction = model.predict([np.array(data_aux)])
            result_text = labels_dict.get(int(prediction[0]), "Unknown")
            
            print(f"Raw Data Match! Result: {result_text}")
            return jsonify({'sign': result_text})
        except Exception as e:
            return jsonify({'sign': 'Prediction Error'})
    
    return jsonify({'sign': 'None'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)