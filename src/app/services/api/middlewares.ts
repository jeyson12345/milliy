import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit';
import { message } from 'antd';
import { logout } from 'src/app/slices/authSlice';

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
  ({ dispatch }: MiddlewareAPI) =>
  (next) =>
  (action) => {
    // RTK Query uses createAsyncThunk from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      const error_message =
        action.payload?.data?.message ??
        action.payload?.data?.msg ??
        action.payload?.data?.err?.message ??
        '';

      if (error_message) {
        if (
          error_message === 'no_eligible_users_found_for_daily_winner_selection'
        ) {
          message.error(
            `Kundalik g'oliblarni tanlash uchun mos foydalanuvchilar topilmadi!`
          );
        } else if (error_message !== 'A validation error occurred.')
          message.warning(error_message);
      }

      const errors = action.payload?.data?.errors ?? '';
      if (errors.length > 0) {
        errors.forEach((item: { detail: string; code: string }) => {
          if (item.code === 'no_active_account') return;
          item?.detail && message.warning(item?.detail);
        });
      }

      console.log('action.payload', action.payload);
      const status = action.payload?.status;

      if (status === 500) {
        message.warning('International server error!');
      } else if (status === 401 || status === 403) {
        dispatch(logout());
        message.warning(
          'The expiration time has expired, please sign in again!'
        );
        // window.location.href = '/';
      }
    }

    return next(action);
  };
