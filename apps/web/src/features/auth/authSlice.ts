import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@ecom/contracts';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCredentials(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isInitialized = true;
      state.loading = false;
    },
    clearCredentials(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.loading = false;
    },
    setInitialized(state) {
      state.isInitialized = true;
    }
  },
});

export const { setLoading, setCredentials, clearCredentials, setInitialized } = authSlice.actions;
export default authSlice.reducer;
export type { AuthState };
