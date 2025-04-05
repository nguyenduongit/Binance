/**
 * File: src/screens/Trade/TradeChart.tsx
 * Mô tả: Màn hình fullscreen cho mục Trade, được mở từ màn hình Trade gốc.
 */
import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// Component TradeChart
const TradeChart: React.FC = () => {
  const navigation = useNavigation();

  return (
    // View gốc bao bọc toàn bộ màn hình
    <View style={styles.container}>
      {/* Tiêu đề màn hình */}
      <Text style={styles.title}>Trade Full Screen</Text>

      {/* Nút để đóng màn hình (quay lại màn hình Trade gốc) */}
      <Button title="Đóng" onPress={() => navigation.goBack()} />

      {/* Nơi bạn sẽ thêm nội dung chi tiết cho Trade fullscreen */}
      {/* Ví dụ: Form đặt lệnh, thông tin chi tiết,... */}
    </View>
  );
};

// Định nghĩa các style cho component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Chiếm toàn bộ không gian
    justifyContent: 'center', // Căn giữa theo chiều dọc
    alignItems: 'center', // Căn giữa theo chiều ngang
    backgroundColor: '#F0F0F0', // Màu nền ví dụ khác
  },
  title: {
    fontSize: 20, // Cỡ chữ tiêu đề
    marginBottom: 20, // Khoảng cách dưới tiêu đề
  },
});

// Export component để navigator có thể sử dụng
export default TradeChart;
