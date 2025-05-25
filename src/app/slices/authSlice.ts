import { createSlice } from '@reduxjs/toolkit';
import { ROLE, TOKEN, token } from 'src/constants/storage';
import { authApi } from '../services/users';

export interface IAuthState {
  token?: string;
  isAuthenticated: boolean;
  balance?: number;
  role?: string | null;
}

const initialState: IAuthState = {
  token: token || '',
  isAuthenticated: token ? true : false,
  role: localStorage.getItem(ROLE) || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = '';
      state.isAuthenticated = false;
      state.role = null;

      localStorage.removeItem(ROLE);
      localStorage.removeItem(TOKEN);
    },
    reduceBalance: (state) => {
      state.balance = state.balance ? state.balance - 1 : 0;
    },
  },
  extraReducers: (builder) => {
    builder
      //Login
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        const { token } = action.payload;
        state.token = token;
        state.isAuthenticated = true;
        console.log(
          'action.meta.arg.originalArgs.username',
          action.meta.arg.originalArgs.username
        );
        const role =
          action.meta.arg.originalArgs.username === 'manager'
            ? 'manager'
            : 'admin';

        state.role = role;
        localStorage.setItem(ROLE, role);
        localStorage.setItem(TOKEN, token);
      });
    //Profile
    // .addMatcher(authApi.endpoints.getUser.matchFulfilled, (state, action) => {
    //   state.balance = action.payload.balance;
    // });
  },
});

export const { logout, reduceBalance } = authSlice.actions;
export default authSlice.reducer;
