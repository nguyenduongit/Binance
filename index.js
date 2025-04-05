/**
 * @format
 */

// QUAN TRỌNG: Dòng import này PHẢI là dòng code đầu tiên được thực thi
import 'react-native-gesture-handler';

import {AppRegistry} from 'react-native';
// Import component gốc của ứng dụng (thường là App từ App.tsx hoặc App.js)
import App from './App';
// Import tên ứng dụng từ file cấu hình app.json
import {name as appName} from './app.json';

// Đăng ký component gốc với AppRegistry
AppRegistry.registerComponent(appName, () => App);
