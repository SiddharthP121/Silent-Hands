import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle

# 1. Load data
column_names = [f'coord_{i}' for i in range(63)] + ['label']
data = pd.read_csv('hand_data.csv', header=None, names=column_names)

# 2. Features and Labels
X = data.drop('label', axis=1)
y = data['label']

# 3. Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Train
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# 5. Score
y_predict = model.predict(X_test)
score = accuracy_score(y_test, y_predict)
print(f"AI Accuracy: {score * 100:.2f}%")

# 6. Save the brain to a file
# We name it 'model.p' to match your app.py
# We save it as a dictionary {'model': model} because app.py looks for the 'model' key
with open('model.p', 'wb') as f:
    pickle.dump({'model': model}, f)

print("Model saved successfully as model.p")