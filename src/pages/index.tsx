import { lazy } from 'react';

export const Custom404Page = lazy(() => import('./404'));
export const SignInPage = lazy(() => import('./auth/signIn'));
export const MessagesPage = lazy(() => import('./messages'));
export const QRCodesPage = lazy(() => import('./qr_codes'));
export const ScansPage = lazy(() => import('./scans'));
export const UsersPage = lazy(() => import('./users'));
export const StatisticsPage = lazy(() => import('./statistics'));
export const WinnersPage = lazy(() => import('./winners'));
