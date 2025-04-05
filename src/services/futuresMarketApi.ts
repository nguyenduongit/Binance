/**
 * File: src/services/futuresMarketApi.ts
 * Mô tả: Chứa các hàm gọi API liên quan đến dữ liệu thị trường Futures (Binance).
 */

// --- Định nghĩa Types ---
export type OrderBookEntry = [string, string]; // [price, quantity]

export interface DepthResponse {
  lastUpdateId: number;
  E: number; // Event time
  T: number; // Transaction time
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

// Kiểu dữ liệu cho response từ API /fapi/v1/ticker/bookTicker
export interface BookTickerResponse {
  symbol: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  time: number;
}

// --- Hằng số ---
const BINANCE_FUTURES_API_BASE_URL = 'https://fapi.binance.com/fapi/v1';

// --- Hàm gọi API ---

/**
 * Lấy dữ liệu Order Book (Depth) từ Binance Futures API. (Giữ lại nếu vẫn cần)
 */
export const getFuturesDepth = async (
  symbol: string,
  limit: number = 20,
): Promise<DepthResponse> => {
  const url = `${BINANCE_FUTURES_API_BASE_URL}/depth?symbol=${symbol}&limit=${limit}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch (_) {
        /**/
      }
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}. ${errorBody}`,
      );
    }
    const data: DepthResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching futures depth:', error);
    throw error;
  }
};

/**
 * Lấy giá bid/ask tốt nhất hiện tại cho một symbol Futures.
 * @param symbol - Tên cặp giao dịch (ví dụ: 'BTCUSDT')
 * @returns Promise chứa dữ liệu BookTickerResponse
 * @throws Error nếu gọi API thất bại hoặc response không thành công
 */
export const getFuturesBookTicker = async (
  symbol: string,
): Promise<BookTickerResponse> => {
  const url = `${BINANCE_FUTURES_API_BASE_URL}/ticker/bookTicker?symbol=${symbol}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch (_) {
        /**/
      }
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}. ${errorBody}`,
      );
    }
    const data: BookTickerResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching futures book ticker:', error);
    throw error;
  }
};
