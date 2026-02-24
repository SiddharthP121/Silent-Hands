export interface Gesture {
  gesture_id: string;
  meaning: string;
  description: string;
  image_url: string;
  isLearned?: boolean
}

export type RootStackParamList = {
  Home: undefined;
  GestureDetails: {gesture: Gesture};
  GestureScreen: undefined;
  LearnGestures: undefined;
  TranscribeByImage: undefined;
}

// --- CONFIGURATION ---
const SERVER_IP = '172.17.114.100'; // Update only this line next time!
export const BASE_URL = `http://${SERVER_IP}:5000/predict`;