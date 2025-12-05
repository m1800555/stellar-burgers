import { describe, test } from '@jest/globals';

import { TConstructorIngredient, TIngredient } from '@utils-types';
import {
  TConstructorState,
  addIngredient,
  removeIngredient,
  reorderConstructor,
  initialState,
  burgerConstructorReducer
} from './burger-constructor';

const mockBun: TIngredient = {
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
};

const mockIngredient1: TIngredient = {
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
};

const mockConstructorIngredient1: TConstructorIngredient = {
  ...mockIngredient1,
  id: 'id-test-ingredient-1'
};

const mockIngredient2: TIngredient = {
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
};

const mockConstructorIngredient2: TConstructorIngredient = {
  ...mockIngredient2,
  id: 'id-test-ingredient-2'
};

const mockConstructorState: TConstructorState = {
  bun: null,
  ingredients: [mockConstructorIngredient1, mockConstructorIngredient2]
};

describe('тесты слайса burgerConstructor', () => {
  test('выбор булки', () => {
    const action = addIngredient(mockBun);
    const newState = burgerConstructorReducer(initialState, action);
    expect(newState.bun).toEqual({
      ...mockBun,
      id: expect.any(String)
    });
  });

  test('добавление ингредиента', () => {
    const action = addIngredient(mockIngredient1);
    const newState = burgerConstructorReducer(initialState, action);

    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toEqual({
      ...mockIngredient1,
      id: expect.any(String)
    });
  });

  test('удаление ингредиента', () => {
    const action = removeIngredient('id-test-ingredient-1');
    const newState = burgerConstructorReducer(mockConstructorState, action);

    expect(newState.ingredients).toHaveLength(1);
  });

  test('изменение порядка ингредиентов', () => {
    const action = reorderConstructor({ from: 0, to: 1 });
    const newState = burgerConstructorReducer(mockConstructorState, action);

    expect(newState.ingredients).toEqual([mockConstructorIngredient2, mockConstructorIngredient1]);
  });
});
