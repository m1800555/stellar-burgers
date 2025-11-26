import { describe, test } from '@jest/globals';

import { getFeeds, initialState, feedReducer } from './feed';

const mockFeed = {
  orders: [
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
  ],
  total: 19430,
  totalToday: 2
};

describe('тесты слайса feed', () => {
  test('getFeeds.fulfilled', () => {
    const action = {
      type: getFeeds.fulfilled.type,
      payload: mockFeed
    };
    const newState = feedReducer(initialState, action);

    expect(newState.orders).toEqual(mockFeed.orders);
    expect(newState.total).toEqual(mockFeed.total);
    expect(newState.totalToday).toEqual(mockFeed.totalToday);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBeUndefined();
  });

  test('getFeeds.rejected', () => {
    const errorMessage = 'Ошибка загрузки заказов';
    const action = {
      type: getFeeds.rejected.type,
      error: { message: errorMessage }
    };    
    const newState = feedReducer(initialState, action);

    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe(errorMessage);
  });

  test('getFeeds.pending', () => {
    const action = { type: getFeeds.pending.type };
    const newState = feedReducer(initialState, action);

    expect(newState.isLoading).toBe(true);
  });
});
