import cv2
import mediapipe as mp
import csv

# Initialize MediaPipe
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.7)

# Prepare CSV file
# We have 21 landmarks, each has x, y, z (21 * 3 = 63 values) + 1 for the Label
header = [f'coord_{i}' for i in range(63)] + ['label']
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
            
            # Extract coordinates
            landmarks = []
            for lm in hand_landmarks.landmark:
                landmarks.extend([lm.x, lm.y, lm.z])
                
            # Check for key presses to save data
            key = cv2.waitKey(1) & 0xFF
            if ord('0') <= key <= ord('9'):
                label = chr(key)
                with open('hand_data.csv', 'a', newline='') as f:
                    writer = csv.writer(f)
                    writer.writerow(landmarks + [label])
                print(f"Saved data for Label: {label}")
            elif key == ord('q'):
                cap.release()
                cv2.destroyAllWindows()
                exit()

    cv2.imshow('Data Collector', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'): break

cap.release()
cv2.destroyAllWindows()