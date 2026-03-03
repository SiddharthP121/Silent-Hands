import pickle
import cv2
import mediapipe as mp
import numpy as np

# 1. Load the "Brain" and the "Eyes" (model now contains scaler and label encoder)
# load the latest trained model file (train_model.py produces model.p)
model_pkg = pickle.load(open('./model.p', 'rb'))
model = model_pkg['model']
label_enc = model_pkg.get('label_encoder', None)

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, min_detection_confidence=0.7)

# define the human-readable gestures you expect the numbers to represent
# this stays static and isn't affected by what label_encoder learned
phrase_map = {
    '0': 'Hello, Goodbye',
    '1': 'Thumbs Up, Good',
    '2': 'Thumbs Down, Bad',
    '3': 'I love you',
    '4': 'Who',
    '5': 'Where',
    '6': 'Yes',
    '7': 'No',
    '8': 'Wait, Hold, Speak'
}

# if the encoder is present we still create a labels_dict from it; it may
# simply mirror the numeric labels, but we keep it for completeness.
if label_enc is not None:
    labels_dict = {i: label for i, label in enumerate(label_enc.classes_)}
else:
    labels_dict = phrase_map.copy()

cap = cv2.VideoCapture(0) # Change to 1 or 2 if using DroidCam

while True:
    ret, frame = cap.read()
    if not ret: break

    img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(img_rgb)

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            # Draw landmarks
            mp.solutions.drawing_utils.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
            
            # Extract coordinates just like we did during collection
            raw_coords = []
            for lm in hand_landmarks.landmark:
                raw_coords.extend([lm.x, lm.y, lm.z])

            # normalize in the same fashion as during collection
            wrist_x, wrist_y, wrist_z = raw_coords[0], raw_coords[1], raw_coords[2]
            normalized = []
            for i in range(0, len(raw_coords), 3):
                normalized.extend([
                    raw_coords[i] - wrist_x,
                    raw_coords[i+1] - wrist_y,
                    raw_coords[i+2] - wrist_z,
                ])
            max_val = max(abs(v) for v in normalized) or 1
            normalized = [v / max_val for v in normalized]

            # 3. Ask the AI to guess
            # wrap features in DataFrame to keep column names for scaler
            try:
                import pandas as pd
                inp = pd.DataFrame([normalized])
            except ImportError:
                inp = np.asarray([normalized])
            prediction = model.predict(inp)
            # determine final label text
            if label_enc is not None:
                predicted_character = str(label_enc.inverse_transform(prediction)[0])
            else:
                predicted_character = str(labels_dict[int(prediction[0])])

            # convert numeric label to phrase if available
            if predicted_character in phrase_map:
                predicted_character = phrase_map[predicted_character]

            # optionally check confidence/probability to ignore weak matches
            no_match = False
            if hasattr(model, 'predict_proba'):
                probs = model.predict_proba(inp)[0]
                maxp = probs.max()
                # threshold can be tuned; 0.5 is a starting point
                if maxp < 0.5:
                    no_match = True
            if no_match:
                predicted_character = 'No coordinate matched'

            # 4. Display the text on the screen
            cv2.putText(frame, predicted_character, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 255, 0), 3, cv2.LINE_AA)

    cv2.imshow('Sign Language Translator', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'): break

cap.release()
cv2.destroyAllWindows()