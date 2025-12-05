import { describe, test } from '@jest/globals';

import {
  getOrders,
  getOrder,
  createOrder,
  initialState,
  ordersReducer
} from './orders';
import { TOrder } from '../../utils/types';

const mockOrders: TOrder[] = [
  {
    _id: "692602d4a64177001b320b62",
    ingredients: [
      "643d69a5c3f7b9001cfa093d",
      "643d69a5c3f7b9001cfa093e",
      "643d69a5c3f7b9001cfa093d"
    ],
    status: "done",
    name: "Флюоресцентный люминесцентный бургер",
    createdAt: "2025-11-25T19:26:12.328Z",
    updatedAt: "2025-11-25T19:26:12.529Z",
    number: 95436
  },
  {
    _id: "6925f5dba64177001b320b54",
    ingredients: [
      "643d69a5c3f7b9001cfa093d",
      "643d69a5c3f7b9001cfa0940",
      "643d69a5c3f7b9001cfa093e",
      "643d69a5c3f7b9001cfa0947",
      "643d69a5c3f7b9001cfa093d"
    ],
    status: "done",
    name: "Фалленианский метеоритный флюоресцентный люминесцентный бургер",
    createdAt: "2025-11-25T18:30:51.133Z",
    updatedAt: "2025-11-25T18:30:51.408Z",
    number: 95435
  }
];

const mockOrder = {
  order: {
    _id: "6924bcc0a64177001b320976",
    ingredients: [
      "643d69a5c3f7b9001cfa093d",
      "643d69a5c3f7b9001cfa0946",
      "643d69a5c3f7b9001cfa0944",
      "643d69a5c3f7b9001cfa093d"
    ],
    owner: "691b8f8ba64177001b31f294",
    status: "done",
    name: "Минеральный традиционный-галактический флюоресцентный бургер",
    createdAt: "2025-11-24T20:14:56.334Z",
    updatedAt: "2025-11-24T20:14:56.533Z",
    number: 95373
  }
};

const mockCreateOrder = {
  order: {
    _id: "6924bcc0a64177001b320976",
    ingredients: [
      "643d69a5c3f7b9001cfa093d",
      "643d69a5c3f7b9001cfa0946",
      "643d69a5c3f7b9001cfa0944",
      "643d69a5c3f7b9001cfa093d"
    ],
    owner: "691b8f8ba64177001b31f294",
    status: "done",
    name: "Минеральный традиционный-галактический флюоресцентный бургер",
    createdAt: "2025-11-24T20:14:56.334Z",
    updatedAt: "2025-11-24T20:14:56.533Z",
    number: 95373
  }
};

describe('тесты слайса orders', () => {
  describe('тесты getOrders', () => {
    test('getOrders.fulfilled', () => {
      const action = {
        type: getOrders.fulfilled.type,
        payload: mockOrders
      };
      const newState = ordersReducer(initialState, action);

      expect(newState.orders).toEqual(mockOrders);
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBeUndefined();
    });

    test('getOrders.rejected', () => {
      const errorMessage = 'Ошибка загрузки заказов';
      const action = {
        type: getOrders.rejected.type,
        error: { message: errorMessage }
      };    
      const newState = ordersReducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });

    test('getOrders.pending', () => {
      const action = { type: getOrders.pending.type };
      const newState = ordersReducer(initialState, action);

      expect(newState.isLoading).toBe(true);
    });
  });

  describe('тесты getOrder', () => {
    test('getOrder.fulfilled', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const newState = ordersReducer(initialState, action);

      expect(newState.orders).toEqual([action.payload.order]);
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBeUndefined();
    });

    test('getOrder.rejected', () => {
      const errorMessage = 'Ошибка загрузки заказа';
      const action = {
        type: getOrder.rejected.type,
        error: { message: errorMessage }
      };    
      const newState = ordersReducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });

    test('getOrder.pending', () => {
      const action = { type: getOrder.pending.type };
      const newState = ordersReducer(initialState, action);

      expect(newState.isLoading).toBe(true);
    });
  });

  describe('тесты createOrder', () => {
    test('createOrder.fulfilled', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockCreateOrder
      };
      const newState = ordersReducer(initialState, action);

      expect(newState.orders).toEqual([action.payload.order]);
      expect(newState.orderModalData).toEqual(action.payload.order);
      expect(newState.orderRequest).toBe(false);
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBeUndefined();
    });

    test('createOrder.rejected', () => {
      const errorMessage = 'Ошибка создания заказа';
      const action = {
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      };    
      const newState = ordersReducer(initialState, action);

      expect(newState.orderRequest).toBe(false);
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });

    test('createOrder.pending', () => {
      const action = { type: createOrder.pending.type };
      const newState = ordersReducer(initialState, action);

      expect(newState.orderRequest).toBe(true);
      expect(newState.isLoading).toBe(true);
    });
  });
});
