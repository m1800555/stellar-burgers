import { createSlice, createAsyncThunk, SerializedError } from '@reduxjs/toolkit';

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
  error?: SerializedError;
};

export const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  requestStatus: 'idle',
};

export const getUser = createAsyncThunk(
  'users/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      if (!response.success) {
        return rejectWithValue(response);
      }
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
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
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.requestStatus = 'succeeded';
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.error = action.meta.rejectedWithValue
          ? (action.payload as SerializedError)
          : action.error;
        state.requestStatus = 'failed';
      })
      .addCase(getUser.pending, (state) => {
        state.requestStatus = 'pending';
      });

    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.requestStatus = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.requestStatus = 'failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.requestStatus = 'pending';
      });

    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.requestStatus = 'succeeded';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.requestStatus = 'failed';
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
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.requestStatus = 'failed';
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
export const { setUser } = slice.actions;
export default slice.reducer;
