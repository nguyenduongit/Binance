// src/screens/Futures/FuturesChart.tsx
import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// Đổi tên component thành FuturesChart
const FuturesChart: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Futures Chart (Full Screen)</Text>
      {/* Đổi tiêu đề ví dụ */}
      <Button title="Đóng" onPress={() => navigation.goBack()} />
      {/* Nội dung màn hình chart */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});

// Đổi tên export default
export default FuturesChart;
