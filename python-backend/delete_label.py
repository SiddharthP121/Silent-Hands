import pandas as pd

# Load the dataset
df = pd.read_csv('hand_data.csv')

# Remove all rows where the label is 8
df = df[df['label'] != 8]

# Save it back to the same file
df.to_csv('hand_data.csv', index=False)

print("Data for label 8 has been deleted successfully.")