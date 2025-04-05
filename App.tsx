/**
 * File: App.tsx (Hoặc App.js)
 * File gốc của ứng dụng React Native.
 * *** QUAN TRỌNG: Bao bọc RootNavigator bằng GestureHandlerRootView ***
 */
import React from 'react';
// 1. Import GestureHandlerRootView
import {GestureHandlerRootView} from 'react-native-gesture-handler';

// Import component điều hướng chính của ứng dụng
import RootNavigator from './src/navigation/AppNavigator'; // Đảm bảo đường dẫn đúng

// Component gốc của ứng dụng
const App: React.FC = () => {
  // 2. Bao bọc RootNavigator bằng GestureHandlerRootView
  // Thêm style={{ flex: 1 }} để nó chiếm toàn bộ không gian
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <RootNavigator />
    </GestureHandlerRootView>
  );
};

// Xuất component App
export default App;
