/**
 * File: src/screens/Futures/index.tsx
 * Mô tả: Màn hình Futures hiển thị trong Bottom Tab Navigator.
 * Phiên bản này dùng WebSocket, lọc giá bids < 0.5% so với best ask,
 * sửa lỗi renderItem, giữ layout đầy đủ, styles tách biệt.
 */
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  FlatList,
  AppState,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// --- Import các kiểu và hàm service ---
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
// --- Import styles từ file styles.ts ---
import styles from './styles'; // Đảm bảo styles được import

// --- Định nghĩa kiểu ---
type FuturesScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type OrderBookEntry = [string, string]; // [price, quantity]

interface DepthStreamData {
  e: string;
  E: number;
  T: number;
  s: string;
  U: number;
  u: number;
  pu: number;
  b: OrderBookEntry[]; // Bids array from WS
  a: OrderBookEntry[]; // Asks array from WS
}

// --- Hằng số cấu hình ---
const ORDER_BOOK_ROWS = 10;
const PRICE_FILTER_PERCENTAGE = 0.5; // Giữ lại bộ lọc 0.5%
const SYMBOL = 'btcusdt';
const WS_UPDATE_SPEED = '500ms';

// --- Component màn hình Futures ---
const FuturesScreen: React.FC = () => {
  const navigation = useNavigation<FuturesScreenNavigationProp>();

  // --- State Management ---
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [midPrice, setMidPrice] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- WebSocket Management ---
  const ws = useRef<WebSocket | null>(null);

  const connectWebSocket = () => {
    ws.current?.close();
    setIsLoading(true);
    setError(null);
    setBids([]);
    setAsks([]);
    setMidPrice('');
    const wsUrl = `wss://fstream.binance.com/ws/${SYMBOL}@depth@${WS_UPDATE_SPEED}`;
    console.log('Connecting WebSocket to:', wsUrl);
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
      setIsLoading(false);
    };
    ws.current.onclose = e => {
      console.log('WebSocket Disconnected:', e.code, e.reason);
      setIsConnected(false);
      setIsLoading(false);
    };
    ws.current.onerror = errorEvent => {
      console.error('WebSocket Error:', errorEvent);
      setError('WebSocket connection error');
      setIsConnected(false);
      setIsLoading(false);
    };

    ws.current.onmessage = event => {
      if (isLoading) setIsLoading(false);
      if (error) setError(null);
      try {
        const message: DepthStreamData = JSON.parse(event.data as string);
        if (message.a && message.b) {
          const receivedAsks = message.a || [];
          const receivedBids = message.b || [];

          // --- GIỮ LẠI LOGIC LỌC GIÁ BIDS THẤP HƠN 0.5% ---
          let minValidBidPrice = 0;
          let currentRefPrice: number | null = null;

          if (
            receivedAsks.length > 0 &&
            !isNaN(parseFloat(receivedAsks[0][0]))
          ) {
            currentRefPrice = parseFloat(receivedAsks[0][0]);
            minValidBidPrice =
              currentRefPrice * (1 - PRICE_FILTER_PERCENTAGE / 100);
          } else if (
            receivedBids.length > 0 &&
            !isNaN(parseFloat(receivedBids[0][0]))
          ) {
            currentRefPrice = parseFloat(receivedBids[0][0]);
            minValidBidPrice =
              currentRefPrice * (1 - PRICE_FILTER_PERCENTAGE / 100);
          }

          let filteredBids = receivedBids;
          if (minValidBidPrice > 0) {
            filteredBids = receivedBids.filter(bid => {
              const price = parseFloat(bid[0]);
              return !isNaN(price) && price >= minValidBidPrice;
            });
          } else {
            // Có thể log cảnh báo nếu không lọc được
          }
          // --- KẾT THÚC LỌC ---

          // Giới hạn số lượng hiển thị
          const limitedAsks = receivedAsks.slice(0, ORDER_BOOK_ROWS);
          const limitedBids = filteredBids.slice(0, ORDER_BOOK_ROWS); // Slice từ bids đã lọc

          setAsks(limitedAsks);
          setBids(limitedBids); // Cập nhật state bằng bids đã lọc

          // Cập nhật giá giữa
          if (limitedAsks.length > 0) {
            setMidPrice(limitedAsks[0][0]);
          } else if (limitedBids.length > 0) {
            setMidPrice(limitedBids[0][0]);
          } else {
            setMidPrice('');
          }
        }
      } catch (e) {
        console.error('Error processing WebSocket message:', e);
      }
    };
  };

  const disconnectWebSocket = () => {
    ws.current?.close();
  };

  // useEffect để quản lý kết nối và AppState
  useEffect(() => {
    connectWebSocket();
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        if (
          !isConnected &&
          (!ws.current || ws.current.readyState === WebSocket.CLOSED)
        ) {
          connectWebSocket();
        }
      }
    });
    return () => {
      disconnectWebSocket();
      subscription.remove();
    };
  }, []);

  // Hàm mở chart
  const goToChartScreen = () => {
    navigation.navigate('FuturesChart');
  };

  // Hàm render item sổ lệnh (Thêm useCallback và kiểm tra chặt hơn)
  const renderOrderItem = useCallback(
    ({item, type}: {item: OrderBookEntry; type: 'bid' | 'ask'}) => {
      if (
        !item ||
        item.length < 2 ||
        typeof item[0] !== 'string' ||
        typeof item[1] !== 'string'
      ) {
        return null;
      }
      const price = parseFloat(item[0]);
      const quantity = item[1];
      if (isNaN(price) || quantity === undefined || quantity === null) {
        return null;
      }
      // Xác định style dựa trên type được truyền vào
      const priceStyle = type === 'bid' ? styles.bidPrice : styles.askPrice;
      return (
        <View style={styles.orderBookRow}>
          <Text style={[styles.orderBookText, priceStyle]}>
            {' '}
            {/* Áp dụng style tương ứng */}
            {price.toLocaleString(undefined, {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}
          </Text>
          <Text style={styles.orderBookText}>{quantity}</Text>
        </View>
      );
    },
    [],
  ); // Dependency rỗng

  // --- Render Giao diện (JSX Đầy Đủ và đã sửa lỗi gọi renderItem) ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* --- 1. Top Bar --- */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topBarItemActive}>
            <Text style={styles.topBarTextActive}>USDS-M</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBarItem}>
            <Text style={styles.topBarText}>COIN-M</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBarItem}>
            <Text style={styles.topBarText}>Quyền Chọn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBarItem}>
            <Text style={styles.topBarText}>Bot</Text>
          </TouchableOpacity>
          <View style={styles.topBarSpacer} />
          <TouchableOpacity>
            <Icon name="ellipsis-horizontal" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* --- 2. Instrument Info & Params --- */}
        <View style={styles.instrumentSection}>
          <View style={styles.instrumentInfo}>
            <Text style={styles.instrumentSymbol}>BTCUSDT Perp</Text>
            <Text style={styles.instrumentChangeNegative}>-0.31%</Text>
            <View style={styles.instrumentSpacer} />
            <TouchableOpacity
              onPress={goToChartScreen}
              style={styles.iconButton}>
              <Icon name="stats-chart-outline" size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="ellipsis-vertical" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.tradeParams}>
            <TouchableOpacity>
              <Text style={styles.tradeParamText}>Cross</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.tradeParamText}>125x</Text>
            </TouchableOpacity>
            <View style={styles.instrumentSpacer} />
            <View>
              <Text style={styles.fundingLabel}>Funding / Countdown</Text>
              <Text style={styles.fundingValue}>0.0035% / 01:44:11</Text>
            </View>
          </View>
        </View>

        {/* --- 3. Main Content (Split View) --- */}
        <View style={styles.mainContent}>
          {/* 3.1 Order Book Column */}
          <View style={styles.orderBookColumn}>
            {/* Header */}
            <View style={styles.orderBookHeader}>
              <Text style={styles.orderBookHeaderText}>Price(USDT)</Text>
              <Text style={styles.orderBookHeaderText}>Amount(USDT)</Text>
            </View>
            {/* Nội dung sổ lệnh */}
            <View style={styles.orderBookContent}>
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#FFF"
                  style={styles.loadingIndicator}
                />
              ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : (
                <>
                  {/* Asks List: Đảo ngược, gọi renderItem đúng */}
                  <FlatList
                    data={[...asks].reverse()}
                    renderItem={({item}) =>
                      renderOrderItem({item, type: 'ask'})
                    } // Sửa lại đây
                    keyExtractor={(item, index) => `ask-${item[0]}-${index}`}
                    style={styles.orderBookList}
                    scrollEnabled={false}
                  />
                  {/* Giá giữa */}
                  <View style={styles.spreadSection}>
                    <Text style={styles.spreadPrice}>
                      {midPrice
                        ? parseFloat(midPrice).toLocaleString(undefined, {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                          })
                        : '...'}
                    </Text>
                  </View>
                  {/* Bids List: Đảo ngược, gọi renderItem đúng */}
                  <FlatList
                    data={[...bids].reverse()}
                    renderItem={({item}) =>
                      renderOrderItem({item, type: 'bid'})
                    } // Sửa lại đây
                    keyExtractor={(item, index) => `bid-${item[0]}-${index}`}
                    style={styles.orderBookList}
                    scrollEnabled={false}
                  />
                </>
              )}
            </View>
            {/* Depth selector */}
            <TouchableOpacity style={styles.depthSelector}>
              <Text style={styles.depthText}>0.1</Text>
              <Icon name="chevron-down" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* 3.2 Trading Panel Column */}
          <View style={styles.tradePanelColumn}>
            {/* JSX Trading Panel đầy đủ */}
            <View style={styles.tradeTabs}>
              <TouchableOpacity style={styles.tradeTabActive}>
                <Text style={styles.tradeTabTextActive}>Open</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tradeTab}>
                <Text style={styles.tradeTabText}>Close</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.avblText}>Avbl ... USDT</Text>
            <TouchableOpacity style={styles.orderTypeButton}>
              <Text style={styles.orderTypeText}>
                Limit <Icon name="chevron-down" size={14} />
              </Text>
            </TouchableOpacity>
            <View style={styles.inputGroup}>
              <TouchableOpacity>
                <Icon name="remove-outline" size={20} color="#888" />
              </TouchableOpacity>
              <TextInput
                placeholder="Price (USDT)"
                keyboardType="numeric"
                style={styles.textInput}
                placeholderTextColor="#555"
              />
              <TouchableOpacity>
                <Icon name="add-outline" size={20} color="#888" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.bboText}>BBO</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputGroup}>
              <TouchableOpacity>
                <Icon name="remove-outline" size={20} color="#888" />
              </TouchableOpacity>
              <TextInput
                placeholder="Amount"
                keyboardType="numeric"
                style={styles.textInput}
                placeholderTextColor="#555"
              />
              <TouchableOpacity>
                <Icon name="add-outline" size={20} color="#888" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.unitText}>
                  USDT <Icon name="chevron-down" size={14} />
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sliderPlaceholder}>
              <Text style={styles.placeholderText}>Slider Placeholder</Text>
            </View>
            <TouchableOpacity style={styles.tifButton}>
              <Text style={styles.orderTypeText}>
                GTC <Icon name="chevron-down" size={14} />
              </Text>
            </TouchableOpacity>
            <View style={styles.closeSection}>
              <Text style={styles.maxCloseText}>Max Close ... USDT</Text>
              <TouchableOpacity style={styles.closeLongButton}>
                <Text style={styles.buttonText}>Close Long</Text>
              </TouchableOpacity>
              <Text style={styles.maxCloseText}>Max Close ... USDT</Text>
              <TouchableOpacity style={styles.closeShortButton}>
                <Text style={styles.buttonText}>Close Short</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* --- 4. Orders/Positions Section --- */}
        <View style={styles.ordersSection}>
          {/* JSX Orders Section đầy đủ */}
          <View style={styles.ordersTabs}>
            <TouchableOpacity>
              <Text style={styles.ordersTabTextActive}>Lệnh chờ (0)</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.ordersTabText}>Vị thế (0)</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.ordersTabText}>Lưới Hợp đồng...</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ordersSubTabs}>
            <TouchableOpacity>
              <Text style={styles.ordersSubTabTextActive}>Normal Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.ordersSubTabText}>Untriggered Orders</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.noOrders}>
            <Icon name="document-text-outline" size={40} color="#555" />
            <Text style={styles.noOrdersText}>No open orders</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

// --- Styles được import từ ./styles ---
// File styles.ts giữ nguyên như phiên bản #41

export default FuturesScreen;
