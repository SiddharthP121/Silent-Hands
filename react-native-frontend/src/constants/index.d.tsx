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
}