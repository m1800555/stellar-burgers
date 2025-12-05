import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { TOrder } from './../../utils/types';

export type TOrdersState = {
  orders: TOrder[];
  orderModalData: TOrder | null;
  orderRequest: boolean;
  isLoading: boolean;
  error: string | undefined;
};

export const initialState: TOrdersState = {
  orders: [],
  orderModalData: null,
  orderRequest: false,
  isLoading: false,
  error: undefined
};

export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getOrder = createAsyncThunk(
  'orders/getOrder',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(id);
      return response.orders[0];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return { order: response.order, name: response.name };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const slice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderModelData(state) {
      state.orderModalData = null;
    }
  },
  selectors: {
    getAllOrders: (state) => state.orders,
    getOrderModalData: (state) => state.orderModalData,
    getOrderRequest: (state) => state.orderRequest,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
        state.error = undefined;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить заказы';
      })
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      });

    builder
      .addCase(getOrder.fulfilled, (state, action) => {
        state.orders = [action.payload];
        state.isLoading = false;
        state.error = undefined;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить заказ';
      })
      .addCase(getOrder.pending, (state) => {
        state.isLoading = true;
      });

    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload.order);
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
        state.isLoading = false;
        state.error = undefined;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось создать заказ';
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.isLoading = true;
      });
  }
});

export const {
  getAllOrders,
  getOrderModalData,
  getOrderRequest,
  getIsLoading,
  getError
} = slice.selectors;
export const { resetOrderModelData } = slice.actions;
export const ordersReducer = slice.reducer;
