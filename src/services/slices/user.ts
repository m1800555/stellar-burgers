import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  registerUserApi,
  logoutApi,
} from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { TUser, TRequestStatus } from '../../utils/types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  requestStatus: TRequestStatus;
  error: string | undefined;
};

export const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  requestStatus: 'idle',
  error: undefined,
};

export const getUser = createAsyncThunk(
  'users/getUser',
  async (_, { rejectWithValue }) => {
    const response = await getUserApi();
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response.user;
  }
);

export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'users/registerUser',
  async (user, { rejectWithValue }) => {
    const response = await registerUserApi(user);
    if (!response.success) {
      return rejectWithValue(response);
    }

    const { user: authUser, refreshToken, accessToken } = response;

    setCookie('accessToken', String(accessToken));
    localStorage.setItem('refreshToken', String(refreshToken));

    return authUser;
  }
);

export const loginUser = createAsyncThunk<TUser, TLoginData>(
  'users/loginUser',
  async (user, { rejectWithValue }) => {
    const response = await loginUserApi(user);
    if (!response.success) {
      return rejectWithValue(response);
    }

    const { user: authUser, refreshToken, accessToken } = response;

    setCookie('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return authUser;
  }
);

export const logoutUser = createAsyncThunk(
  'users/logout',
  async (_, { rejectWithValue }) => {
    const response = await logoutApi();
    if (!response.success) {
      return rejectWithValue(response);
    }
    deleteCookie('accessToken');
    localStorage.clear();
  }
);

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    },
    userLogout: (state) => {
      state.user = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
  selectors: {
    getUserData: (state) => state.user,
    getRequestStatus: (state) => state.requestStatus,
    isAuthChecked: (state) => state.isAuthChecked,
    isAuthenticated: (state) => state.isAuthenticated,
    getError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.requestStatus = 'succeeded';
        state.error = undefined;
      })
      .addCase(getUser.rejected, (state, { error }) => {
        state.isAuthChecked = true;
        state.requestStatus = 'failed';
        if (error.message) {
          state.error = error.message;
        }
      })
      .addCase(getUser.pending, (state) => {
        state.requestStatus = 'pending';
      });

    builder
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.requestStatus = 'succeeded';
        state.error = undefined;
      })
      .addCase(registerUser.rejected, (state, { error }) => {
        state.requestStatus = 'failed';
        if (error.message) {
          state.error = error.message;
        }
      })
      .addCase(registerUser.pending, (state) => {
        state.requestStatus = 'pending';
      });

    builder
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.requestStatus = 'succeeded';
        state.error = undefined;
      })
      .addCase(loginUser.rejected, (state, { error }) => {
        state.requestStatus = 'failed';
        if (error.message) {
          state.error = error.message;
        }
      })
      .addCase(loginUser.pending, (state) => {
        state.requestStatus = 'pending';
      });

    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.requestStatus = 'succeeded';
        state.error = undefined;
      })
      .addCase(logoutUser.rejected, (state, { error }) => {
        state.requestStatus = 'failed';
        if (error.message) {
          state.error = error.message;
        }
      })
      .addCase(logoutUser.pending, (state) => {
        state.requestStatus = 'pending';
      });
  }
});

export const {
  getUserData,
  getRequestStatus,
  isAuthChecked,
  isAuthenticated,
  getError
} = slice.selectors;
export const { setAuthChecked, setUser } = slice.actions;
export default slice.reducer;
