import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score
import pickle

# 1. Load raw data
#    This assumes collect_data.py has been run and produced hand_data.csv
csv_path = 'hand_data.csv'
try:
    data = pd.read_csv(csv_path)
except FileNotFoundError:
    print(f"Error: data file '{csv_path}' not found.\n" \
          "Please run collect_data.py to gather training samples before training.")
    exit(1)

# ensure there is data
if data.empty:
    print(f"Error: '{csv_path}' is empty.\n" \
          "Collect some hand landmarks with collect_data.py and try again.")
    exit(1)

# 2. Features and labels
X = data.drop('label', axis=1)
y_raw = data['label']

# encode string labels as integers
label_enc = LabelEncoder()
y = label_enc.fit_transform(y_raw)

# 3. Train/test split with stratification
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# 4. Build a pipeline: classifier
pipeline = Pipeline([
    ('clf', RandomForestClassifier(random_state=42)),
])

# 5. Hyperparameter search to squeeze out more accuracy
param_grid = {
    'clf__n_estimators': [100, 200, 500],
    'clf__max_depth': [None, 10, 20],
    'clf__min_samples_leaf': [1, 2, 4],
}

grid = GridSearchCV(pipeline, param_grid, cv=5, n_jobs=-1, verbose=1)
grid.fit(X_train, y_train)

print("Best params:", grid.best_params_)

# 6. Evaluate on held‑out test set
best_model = grid.best_estimator_
y_predict = best_model.predict(X_test)
acc = accuracy_score(y_test, y_predict)
print(f"Validation Accuracy: {acc * 100:.2f}%")
print("Classification report:")
# target_names must be strings; encoder.classes_ may be numeric if pandas
target_names = [str(name) for name in label_enc.classes_]
print(classification_report(y_test, y_predict, target_names=target_names))

# optionally display a confusion matrix for further insight
try:
    from sklearn.metrics import confusion_matrix
    cm = confusion_matrix(y_test, y_predict)
    print("Confusion matrix:")
    print(cm)
except ImportError:
    pass

# 7. Save model and label encoder together
with open('model.p', 'wb') as f:
    pickle.dump({'model': best_model, 'label_encoder': label_enc}, f)

print("Model saved successfully as model.p (includes label encoder). Note: redeploy app.py/test_model.py to load encoder.")