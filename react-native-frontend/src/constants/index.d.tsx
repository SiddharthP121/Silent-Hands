import { CognitoUserPool } from 'amazon-cognito-identity-js';

export interface Gesture {
  gesture_id: string;
  meaning: string;
  description: string;
  category?: string;
  image_url: string;
  isLearned?: boolean;
}

export type RootStackParamList = {
  Home: undefined;
  GestureDetails: { gesture: Gesture };
  GestureScreen: undefined;
  LearnGestures: undefined;
  TranscribeByImage: undefined;
  RegisterScreen: undefined;
  LoginScreen: undefined;
};

// --- CONFIGURATION ---
const SERVER_IP = '10.73.82.100'; // Update only this line next time!
export const BASE_URL = `http://${SERVER_IP}:5000/predict`;

// User pool configration 
const poolCredentials = {
  UserPoolId: '',
  ClientId: '',
};

export const cognitoUserPool = new CognitoUserPool(poolCredentials);