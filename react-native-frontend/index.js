import 'react-native-url-polyfill/auto';
import { ReadableStream } from 'web-streams-polyfill';

if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = ReadableStream;
}

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
