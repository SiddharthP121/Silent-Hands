import cv2
import mediapipe as mp
import csv
import os

# Initialize MediaPipe
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.7)

# Prepare CSV file
# We have 21 landmarks, each has x, y, z (21 * 3 = 63 values) + 1 for the Label
header = [f'coord_{i}' for i in range(63)] + ['label']
if not os.path.exists('hand_data.csv'):
    with open('hand_data.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(header)

cap = cv2.VideoCapture(0)
print("Press '0'-'9' to save data for that class, or 'q' to quit.")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret: break
    
    # Process the frame
    img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(img_rgb)
    
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            # Draw landmarks so you can see what you're doing
            mp.solutions.drawing_utils.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
            
            # Extract raw coordinates
            landmarks = []
            for lm in hand_landmarks.landmark:
                landmarks.extend([lm.x, lm.y, lm.z])

            # normalize coordinates relative to the wrist (landmark 0)
            wrist_x, wrist_y, wrist_z = landmarks[0], landmarks[1], landmarks[2]
            normalized = []
            for i in range(0, len(landmarks), 3):
                normalized.extend([
                    landmarks[i] - wrist_x,
                    landmarks[i + 1] - wrist_y,
                    landmarks[i + 2] - wrist_z,
                ])
            # scale so the values sit roughly between -1 and 1
            max_val = max(abs(v) for v in normalized) or 1
            normalized = [v / max_val for v in normalized]

            # Check for key presses to save data (use normalized features)
            key = cv2.waitKey(1) & 0xFF
            if ord('0') <= key <= ord('9'):
                label = chr(key)
                with open('hand_data.csv', 'a', newline='') as f:
                    writer = csv.writer(f)
                    writer.writerow(normalized + [label])
                print(f"Saved data for Label: {label}")
            elif key == ord('q'):
                cap.release()
                cv2.destroyAllWindows()
                exit()

    cv2.imshow('Data Collector', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'): break

cap.release()
cv2.destroyAllWindows()
