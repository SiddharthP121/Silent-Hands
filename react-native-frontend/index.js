// index.js

// 1. Security
import 'react-native-get-random-values';

// 2. NEW: Fix for "Property 'structuredClone' doesn't exist"
if (typeof global.structuredClone !== 'function') {
  global.structuredClone = obj => {
    return JSON.parse(JSON.stringify(obj));
  };
}

// 3. Networking & Streams
import 'react-native-url-polyfill/auto';
import { ReadableStream } from 'web-streams-polyfill';

if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = ReadableStream;
}

// 4. App Registry
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
