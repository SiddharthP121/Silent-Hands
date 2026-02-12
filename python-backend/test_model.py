import pickle
import cv2
import mediapipe as mp
import numpy as np

# 1. Load the "Brain" and the "Eyes"
model_dict = pickle.load(open('./sign_model.p', 'rb'))
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, min_detection_confidence=0.7)

# 2. Define your "Dictionary" (Mapping the numbers to words)
labels_dict = {
    0: 'Hello, Goodbye',
    1: 'Thumbs Up', 
    2: 'Thumbs Down',
    3: 'I love you',
    }

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
            data_aux = []
            for lm in hand_landmarks.landmark:
                data_aux.extend([lm.x, lm.y, lm.z])

            # 3. Ask the AI to guess
            prediction = model_dict.predict([np.asarray(data_aux)])
            predicted_character = labels_dict[int(prediction[0])]

            # 4. Display the text on the screen
            cv2.putText(frame, predicted_character, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 255, 0), 3, cv2.LINE_AA)

    cv2.imshow('Sign Language Translator', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'): break

cap.release()
cv2.destroyAllWindows()