import { describe, test } from '@jest/globals';

import { getIngredients, initialState, ingredientsReducer } from './ingredients';

const mockIngredients = [
  {
    _id: "643d69a5c3f7b9001cfa0941",
    name: "Биокотлета из марсианской Магнолии",
    type: "main",
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: "https://code.s3.yandex.net/react/code/meat-01.png",
    image_mobile: "https://code.s3.yandex.net/react/code/meat-01-mobile.png",
    image_large: "https://code.s3.yandex.net/react/code/meat-01-large.png",
  },
  {
    _id: "643d69a5c3f7b9001cfa093c",
    name: "Краторная булка N-200i",
    type: "bun",
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: "https://code.s3.yandex.net/react/code/bun-02.png",
    image_mobile: "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
    image_large: "https://code.s3.yandex.net/react/code/bun-02-large.png",
  },
  {
    _id: "643d69a5c3f7b9001cfa0945",
    name: "Соус с шипами Антарианского плоскоходца",
    type: "sauce",
    proteins: 101,
    fat: 99,
    carbohydrates: 100,
    calories: 100,
    price: 88,
    image: "https://code.s3.yandex.net/react/code/sauce-01.png",
    image_mobile: "https://code.s3.yandex.net/react/code/sauce-01-mobile.png",
    image_large: "https://code.s3.yandex.net/react/code/sauce-01-large.png",
  },
];

describe('тесты слайса ingredients', () => {
  test('getIngredients.fulfilled', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const newState = ingredientsReducer(initialState, action);

    expect(newState.ingredients).toEqual(mockIngredients);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBeUndefined();
  });

  test('getIngredients.rejected', () => {
    const errorMessage = 'Ошибка загрузки ингредиентов';
    const action = {
      type: getIngredients.rejected.type,
      error: { message: errorMessage }
    };    
    const newState = ingredientsReducer(initialState, action);
    
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe(errorMessage);
  });

  test('getIngredients.pending', () => {
    const action = { type: getIngredients.pending.type };
    const newState = ingredientsReducer(initialState, action);

    expect(newState.isLoading).toBe(true);
  });
});
