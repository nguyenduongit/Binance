/**
 * File: src/navigation/AppNavigator.tsx
 * Mô tả: Định nghĩa cấu trúc điều hướng chính của ứng dụng.
 */
import React from 'react';
// Import các thành phần cần thiết từ React Navigation
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// Import Stack Navigator và kiểu Options của nó
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';

// --- Import các Screens ---
// Màn hình trong Tab Navigator
import HomeScreen from '../screens/Home';
import MarketsScreen from '../screens/Markets';
import TradeScreen from '../screens/Trade'; // Màn hình gốc của tab Trade
import FuturesScreen from '../screens/Futures';
import AssetsScreen from '../screens/Assets';

// Màn hình Modal Fullscreen
import FuturesChart from '../screens/Futures/FuturesChart';
import TradeChart from '../screens/Trade/TradeChart'; // *** IMPORT MÀN HÌNH TRADE MỚI ***

// Import Icon component
import Icon from 'react-native-vector-icons/Ionicons';

// --- ĐỊNH NGHĨA CÁC PARAM LIST ---
// Quan trọng: Export các kiểu này để các màn hình khác có thể import và sử dụng

// Định nghĩa ParamList cho các màn hình trong Tab
export type AppTabsParamList = {
  Home: undefined;
  Markets: undefined;
  Trade: undefined; // Màn hình Trade gốc trong tab
  Futures: undefined;
  Assets: undefined;
};

// Định nghĩa ParamList cho Root Stack Navigator
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<AppTabsParamList>;
  FuturesChart: undefined;
  TradeChart: undefined; // *** THÊM MÀN HÌNH TRADE MỚI VÀO ĐÂY ***
  // Thêm các màn hình khác của RootStack ở đây nếu có
};

// --- Định nghĩa Bottom Tab Navigator ---
const Tab = createBottomTabNavigator<AppTabsParamList>();

// Component chứa cấu hình các Tab dưới cùng
function AppTabs() {
  // Trả về cấu trúc đầy đủ của Tab Navigator
  return (
    <Tab.Navigator
      // screenOptions cho phép cấu hình chung cho tất cả các tab
      screenOptions={({route}) => ({
        // tabBarIcon là hàm trả về component Icon cho mỗi tab
        tabBarIcon: ({focused, color, size}) => {
          // Khởi tạo biến tên icon
          let iconName = '';
          // Logic chọn icon dựa trên tên route (tên màn hình của tab) và trạng thái focus
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Markets') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Trade') {
            iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline'; // Icon cho Trade
          } else if (route.name === 'Futures') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Assets') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          }
          // Trả về component Icon với các thuộc tính đã xác định
          // size và color được React Navigation tự động cung cấp
          return <Icon name={iconName} size={size} color={color} />;
        },
        // Các tùy chọn khác cho giao diện Tab Bar
        tabBarActiveTintColor: 'tomato', // Màu khi tab active
        tabBarInactiveTintColor: 'gray', // Màu khi tab inactive
        headerShown: false, // Ẩn thanh tiêu đề (header) mặc định mà Tab Navigator tạo ra cho mỗi màn hình
      })}>
      {/* Định nghĩa từng màn hình (tab) trong Bottom Tab Navigator */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Trang chủ'}}
      />
      <Tab.Screen
        name="Markets"
        component={MarketsScreen}
        options={{title: 'Thị trường'}}
      />
      {/* Tab Trade trỏ đến màn hình Trade gốc */}
      <Tab.Screen
        name="Trade"
        component={TradeScreen}
        options={{title: 'Giao dịch'}}
      />
      <Tab.Screen
        name="Futures"
        component={FuturesScreen}
        options={{title: 'Phái sinh'}}
      />
      <Tab.Screen
        name="Assets"
        component={AssetsScreen}
        options={{title: 'Tài sản'}}
      />
    </Tab.Navigator>
  );
}

// --- Định nghĩa Root Stack Navigator ---
const RootStack = createStackNavigator<RootStackParamList>();

// Khai báo biến options cho màn hình FuturesChart (giữ nguyên)
const futuresChartScreenOptions: StackNavigationOptions = {
  headerShown: false,
};

// *** KHAI BÁO BIẾN OPTIONS CHO TRADE FULLSCREEN MỚI ***
const TradeChartScreenOptions: StackNavigationOptions = {
  headerShown: false, // Tương tự, ẩn header
  // Không cần 'presentation' để dùng kiểu 'card' mặc định (fullscreen)
};
// --- KẾT THÚC KHAI BÁO BIẾN MỚI ---

// Component Navigator chính của ứng dụng
export default function RootNavigator() {
  return (
    // NavigationContainer là component gốc bao bọc tất cả điều hướng
    <NavigationContainer>
      {/* Root Stack quản lý các luồng điều hướng chính */}
      <RootStack.Navigator>
        {/* Màn hình thứ nhất: Toàn bộ Bottom Tab Navigator */}
        <RootStack.Screen
          name="MainTabs" // Tên của nhóm màn hình Tab
          component={AppTabs} // Component hiển thị là AppTabs
          options={{headerShown: false}} // Ẩn header của Root Stack cho nhóm Tab
        />
        {/* Màn hình thứ hai: Futures Chart */}
        <RootStack.Screen
          name="FuturesChart"
          component={FuturesChart}
          options={futuresChartScreenOptions} // Dùng biến options đã khai báo
        />
        {/* *** THÊM MÀN HÌNH TRADE FULLSCREEN VÀO STACK *** */}
        <RootStack.Screen
          name="TradeChart" // Tên màn hình mới
          component={TradeChart} // Component màn hình mới
          options={TradeChartScreenOptions} // Dùng biến options mới khai báo
        />
        {/* --- KẾT THÚC THÊM MÀN HÌNH MỚI --- */}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
