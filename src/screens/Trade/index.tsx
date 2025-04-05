/**
 * File: src/screens/Trade/index.tsx
 * Mô tả: Màn hình Trade hiển thị trong Bottom Tab Navigator.
 * Chứa một nút/icon để điều hướng đến màn hình TradeChart.
 */
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
// Import hook useNavigation để lấy đối tượng điều hướng
import {useNavigation} from '@react-navigation/native';
// Import component Icon (hoặc Button nếu muốn)
import Icon from 'react-native-vector-icons/Ionicons';
// Import styles từ file riêng (nếu có)
import styles from './styles'; // Giả sử bạn có file styles.ts cho Trade

// --- Import các kiểu cần thiết cho Type Checking ---
import {StackNavigationProp} from '@react-navigation/stack';
// Import kiểu RootStackParamList đã export từ file AppNavigator
import {RootStackParamList} from '../../navigation/AppNavigator'; // Kiểm tra lại đường dẫn nếu cần

// --- Định nghĩa kiểu cho navigation prop của màn hình này ---
type TradeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// --- Component màn hình Trade ---
const TradeScreen: React.FC = () => {
  // Sử dụng hook useNavigation và cung cấp kiểu đã định nghĩa
  const navigation = useNavigation<TradeScreenNavigationProp>();

  // Hàm xử lý sự kiện khi nhấn vào nút/icon mở màn hình Trade fullscreen
  const goToTradeChart = () => {
    // Điều hướng đến màn hình 'TradeChart' đã được định nghĩa trong RootStackParamList
    navigation.navigate('TradeChart');
  };

  // Render giao diện của màn hình Trade
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trade Screen (Trong Tab)</Text>

      {/* Ví dụ về một TouchableOpacity chứa Icon để mở màn hình Trade Fullscreen */}
      <TouchableOpacity
        onPress={goToTradeChart}
        style={localStyles.buttonStyle}>
        {/* Sử dụng component Icon ví dụ */}
        <Icon name="expand-outline" size={30} color="purple" />
        <Text>Mở Trade Fullscreen</Text>
      </TouchableOpacity>

      {/* Các thành phần giao diện khác của màn hình Trade */}
    </View>
  );
};

// --- Styles cục bộ cho ví dụ (bạn có thể dùng styles từ file import) ---
const localStyles = StyleSheet.create({
  buttonStyle: {
    marginTop: 30, // Khoảng cách phía trên
    alignItems: 'center', // Căn giữa các phần tử con theo chiều ngang
    padding: 10, // Đệm xung quanh nội dung
  },
});

// Export component để các navigator có thể sử dụng
export default TradeScreen;
