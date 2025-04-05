/**
 * File: src/screens/Futures/styles.ts
 * Mô tả: Chứa các định nghĩa StyleSheet cho màn hình Futures.
 */
import {StyleSheet, Dimensions} from 'react-native';

// --- Tính toán kích thước cột ---
const screenWidth = Dimensions.get('window').width;
const gapBetweenColumns = 10;
const totalHorizontalPadding = 20;
const availableWidth = screenWidth - totalHorizontalPadding - gapBetweenColumns;
const columnWidth = availableWidth / 2;

// --- Định nghĩa Styles ---
export default StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#12161C'},
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 5,
    flexDirection: 'column',
  },
  topBar: {flexDirection: 'row', marginBottom: 10, alignItems: 'center'},
  topBarItem: {paddingHorizontal: 8, paddingVertical: 4},
  topBarItemActive: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#F0B90B',
  },
  topBarText: {color: '#888', fontSize: 14},
  topBarTextActive: {color: '#FFF', fontSize: 14, fontWeight: 'bold'},
  topBarSpacer: {flex: 1},
  instrumentSection: {marginBottom: 10},
  instrumentInfo: {flexDirection: 'row', alignItems: 'center', marginBottom: 5},
  instrumentSymbol: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  instrumentChangeNegative: {color: '#F6465D', fontSize: 14},
  instrumentSpacer: {flex: 1},
  iconButton: {padding: 5, marginLeft: 5},
  tradeParams: {flexDirection: 'row', alignItems: 'center'},
  tradeParamText: {
    color: '#AAA',
    fontSize: 12,
    marginRight: 15,
    backgroundColor: '#2B3139',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  fundingLabel: {color: '#888', fontSize: 10, textAlign: 'right'},
  fundingValue: {color: '#AAA', fontSize: 11, textAlign: 'right'},
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5,
  },
  orderBookColumn: {
    width: columnWidth,
    flex: 1, // Chiếm không gian dọc
    flexDirection: 'column',
    marginRight: gapBetweenColumns,
  },
  orderBookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderBookHeaderText: {color: '#888', fontSize: 10},
  orderBookContent: {
    flex: 1, // Cho phép nội dung (list/loading) chiếm không gian
    justifyContent: 'center', // Căn giữa loading/error
  },
  loadingIndicator: {marginTop: 20},
  errorText: {color: 'red', textAlign: 'center', paddingVertical: 20},
  orderBookList: {flexGrow: 0},
  orderBookRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 1,
  },
  orderBookText: {color: '#FFF', fontSize: 11},
  askPrice: {color: '#F6465D'},
  bidPrice: {color: '#0ECB81'},
  spreadSection: {alignItems: 'center', marginVertical: 5},
  spreadPrice: {color: '#F0B90B', fontSize: 16, fontWeight: 'bold'},
  depthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2B3139',
    paddingVertical: 3,
    borderRadius: 3,
    marginTop: 5, // Nằm sau orderBookContent
  },
  depthText: {color: '#FFF', fontSize: 11, marginRight: 4},
  tradePanelColumn: {
    width: columnWidth,
    flex: 1, // Chiếm không gian dọc
    flexDirection: 'column',
  },
  tradeTabs: {flexDirection: 'row', marginBottom: 5},
  tradeTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tradeTabActive: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#F0B90B',
  },
  tradeTabText: {color: '#888', fontSize: 14},
  tradeTabTextActive: {color: '#FFF', fontSize: 14, fontWeight: 'bold'},
  avblText: {color: '#888', fontSize: 10, textAlign: 'right', marginBottom: 5},
  orderTypeButton: {
    backgroundColor: '#2B3139',
    padding: 8,
    borderRadius: 3,
    marginBottom: 8,
    alignItems: 'center',
  },
  orderTypeText: {color: '#DDD', fontSize: 12},
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2B3139',
    borderRadius: 3,
    paddingHorizontal: 5,
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 12,
    paddingVertical: 6,
    textAlign: 'center',
  },
  bboText: {color: '#888', fontSize: 11, fontWeight: 'bold', marginLeft: 5},
  unitText: {color: '#888', fontSize: 11, marginLeft: 5},
  sliderPlaceholder: {
    height: 20,
    backgroundColor: '#2B3139',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeholderText: {color: '#555', fontSize: 10},
  tifButton: {
    backgroundColor: '#2B3139',
    padding: 5,
    borderRadius: 3,
    marginBottom: 8,
    alignItems: 'flex-start',
    width: 60,
  },
  closeSection: {marginTop: 'auto', paddingTop: 10},
  maxCloseText: {color: '#888', fontSize: 10, marginBottom: 3},
  closeLongButton: {
    backgroundColor: '#0ECB81',
    paddingVertical: 10,
    borderRadius: 3,
    alignItems: 'center',
    marginBottom: 8,
  },
  closeShortButton: {
    backgroundColor: '#F6465D',
    paddingVertical: 10,
    borderRadius: 3,
    alignItems: 'center',
  },
  buttonText: {color: '#FFF', fontWeight: 'bold'},
  ordersSection: {
    height: 200,
    borderTopWidth: 1,
    borderTopColor: '#2B3139',
    paddingTop: 5,
    marginBottom: 5,
    flexDirection: 'column',
  },
  ordersTabs: {flexDirection: 'row', marginBottom: 8},
  ordersTabText: {color: '#888', fontSize: 13, marginRight: 15},
  ordersTabTextActive: {
    color: '#FFF',
    fontSize: 13,
    marginRight: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#F0B90B',
    paddingBottom: 3,
  },
  ordersSubTabs: {flexDirection: 'row', marginBottom: 10},
  ordersSubTabText: {color: '#888', fontSize: 12, marginRight: 15},
  ordersSubTabTextActive: {
    color: '#DDD',
    fontSize: 12,
    marginRight: 15,
    fontWeight: 'bold',
  },
  noOrders: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  noOrdersText: {color: '#555', fontSize: 12, marginTop: 5},
});
