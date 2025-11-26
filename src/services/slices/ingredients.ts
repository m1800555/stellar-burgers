import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getIngredientsApi } from '@api';
import { TIngredient } from '../../utils/types';

type TIngredientState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | undefined;
};

export const initialState: TIngredientState = {
  ingredients: [],
  isLoading: false,
  error: undefined
};

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async () => await getIngredientsApi()
);

export const slice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getAllIngredients: (state) => state.ingredients,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
        state.error = undefined;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить ингредиенты';
      })
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
      });
  }
});

export const { getAllIngredients, getIsLoading, getError } = slice.selectors;
export const ingredientsReducer = slice.reducer;
