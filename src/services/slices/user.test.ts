import { describe, test } from '@jest/globals';

import { TUser } from '@utils-types';
import {
  getUser,
  registerUser,
  loginUser,
  logoutUser,
  initialState,
  userReducer
} from './user';

const mockUser: TUser = {
  email: 'test@test.ru',
  name: 'TestUser'
};

const errorMessage = 'Test error';

describe('тесты слайса user', () => {
  describe('тесты getUser', () => {
    test('getUser.fulfilled', () => {
      const action = {
        type: getUser.fulfilled.type,
        payload: mockUser
      };
      const newState = userReducer(initialState, action);

      expect(newState.user).toEqual(mockUser);
      expect(newState.isAuthChecked).toBe(true);
      expect(newState.isAuthenticated).toBe(true);
      expect(newState.requestStatus).toBe('succeeded');
      expect(newState.error).toBeUndefined();
    });

    test('getUser.rejected', () => {
      const action = {
        type: getUser.rejected.type,
        error: { message: errorMessage }
      };    
      const newState = userReducer(initialState, action);

      expect(newState.requestStatus).toEqual('failed');
      expect(newState.error).toBe(errorMessage);
    });

    test('getUser.pending', () => {
      const action = { type: getUser.pending.type };
      const newState = userReducer(initialState, action);

      expect(newState.requestStatus).toBe('pending');
    });
  });

  describe('тесты registerUser', () => {
    test('registerUser.fulfilled', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const newState = userReducer(initialState, action);

      expect(newState.user).toEqual(action.payload);
      expect(newState.isAuthChecked).toBe(true);
      expect(newState.isAuthenticated).toBe(true);
      expect(newState.requestStatus).toBe('succeeded');
      expect(newState.error).toBeUndefined();
    });

    test('registerUser.rejected', () => {
      const action = {
        type: registerUser.rejected.type,
        error: { message: errorMessage }
      };    
      const newState = userReducer(initialState, action);

      expect(newState.requestStatus).toBe('failed');
      expect(newState.error).toBe(errorMessage);
    });

    test('registerUser.pending', () => {
      const action = { type: registerUser.pending.type };
      const newState = userReducer(initialState, action);

      expect(newState.requestStatus).toBe('pending');
    });
  });

  describe('тесты loginUser', () => {
    test('loginUser.fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const newState = userReducer(initialState, action);

      expect(newState.user).toEqual(action.payload);
      expect(newState.isAuthChecked).toBe(true);
      expect(newState.isAuthenticated).toBe(true);
      expect(newState.requestStatus).toBe('succeeded');
      expect(newState.error).toBeUndefined();
    });

    test('loginUser.rejected', () => {
      const action = {
        type: loginUser.rejected.type,
        error: { message: errorMessage }
      };    
      const newState = userReducer(initialState, action);

      expect(newState.requestStatus).toBe('failed');
      expect(newState.error).toBe(errorMessage);
    });

    test('loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const newState = userReducer(initialState, action);

      expect(newState.requestStatus).toBe('pending');
    });
  });

  describe('тесты logoutUser', () => {
    test('logoutUser.fulfilled', () => {
      const action = {
        type: logoutUser.fulfilled.type,
        payload: mockUser
      };
      const newState = userReducer(initialState, action);

      expect(newState.user).toEqual(null);
      expect(newState.isAuthChecked).toBe(true);
      expect(newState.isAuthenticated).toBe(false);
      expect(newState.requestStatus).toBe('succeeded');
      expect(newState.error).toBeUndefined();
    });

    test('logoutUser.rejected', () => {
      const action = {
        type: logoutUser.rejected.type,
        error: { message: errorMessage }
      };    
      const newState = userReducer(initialState, action);

      expect(newState.requestStatus).toBe('failed');
      expect(newState.error).toBe(errorMessage);
    });

    test('logoutUser.pending', () => {
      const action = { type: logoutUser.pending.type };
      const newState = userReducer(initialState, action);

      expect(newState.requestStatus).toBe('pending');
    });
  });
});
