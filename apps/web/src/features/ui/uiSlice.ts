import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  cartDrawerOpen: boolean;
  authModalOpen: boolean;
  authModalTab: 'login' | 'register';
  mobileMenuOpen: boolean;
}

const initialState: UiState = {
  cartDrawerOpen: false,
  authModalOpen: false,
  authModalTab: 'login',
  mobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleCartDrawer(state, action: PayloadAction<boolean | undefined>) {
      state.cartDrawerOpen = action.payload !== undefined ? action.payload : !state.cartDrawerOpen;
    },
    toggleAuthModal(state, action: PayloadAction<{ open: boolean; tab?: 'login' | 'register' } | undefined>) {
      if (action.payload !== undefined) {
        state.authModalOpen = action.payload.open;
        if (action.payload.tab) {
          state.authModalTab = action.payload.tab;
        }
      } else {
        state.authModalOpen = !state.authModalOpen;
      }
    },
    setAuthModalTab(state, action: PayloadAction<'login' | 'register'>) {
      state.authModalTab = action.payload;
    },
    toggleMobileMenu(state, action: PayloadAction<boolean | undefined>) {
      state.mobileMenuOpen = action.payload !== undefined ? action.payload : !state.mobileMenuOpen;
    },
  },
});

export const { toggleCartDrawer, toggleAuthModal, setAuthModalTab, toggleMobileMenu } = uiSlice.actions;
export default uiSlice.reducer;
