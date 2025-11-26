import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getFeedsApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  selectedOrder: TOrder | null;
  isLoading: boolean;
  error: string | undefined;
};

export const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  selectedOrder: null,
  isLoading: false,
  error: undefined
};

export const getFeeds = createAsyncThunk(
  'feed/getFeeds',
  async () => await getFeedsApi()
);

export const getOrderByNumber = createAsyncThunk(
  'feed/getOrderByNumber',
  async (number: number) => await getOrderByNumberApi(number)
);

export const slice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    }
  },
  selectors: {
    getAllFeeds: (state) => state.orders,
    getTotal: (state) => state.total,
    getTotalToday: (state) => state.totalToday,
    getSelectedFeed: (state) => state.selectedOrder,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
        state.error = undefined;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.selectedOrder = action.payload.orders[0];
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить заказы';
      })
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
      });
  }
});

export const {
  getAllFeeds,
  getTotal,
  getTotalToday,
  getSelectedFeed,
  getIsLoading,
  getError
} = slice.selectors;
export const { clearSelectedOrder } = slice.actions;
export const feedReducer = slice.reducer;
