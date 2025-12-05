import { describe, expect, test } from '@jest/globals';

import { rootReducer, store } from './store';
import { initialState as burgerConstructorInitialState } from './slices/burger-constructor';
import { initialState as feedInitialState } from './slices/feed';
import { initialState as ingredientsInitialState } from './slices/ingredients';
import { initialState as ordersInitialState } from './slices/orders';
import { initialState as userInitialState } from './slices/user';

const expectedInitialState = {
  burgerConstructor: burgerConstructorInitialState,
  feed: feedInitialState,
  ingredients: ingredientsInitialState,
  orders: ordersInitialState,
  user: userInitialState
};

describe('[rootReducer] Инициализация хранилища', () => {
  test('rootReducer должен иметь все свойства', () => {
    const initialState = store.getState();
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('orders');
    expect(initialState).toHaveProperty('user');
  });

  test('dispatch и getState должны иметь тип function', () => {
    expect(store).toBeDefined();
    expect(typeof store.dispatch).toBe('function');
    expect(typeof store.getState).toBe('function');
  });

  test('проверка корректности начального состояния', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState).toEqual(expectedInitialState);
  });
});
