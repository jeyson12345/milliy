import { Route, Routes } from 'react-router-dom';
import { useTypedSelector } from 'src/app/store';
import { AuthLayout, DashboardLayout } from 'src/components/layout';

// Layouts

// Pages
import {
  Custom404Page,
  MessagesPage,
  QRCodesPage,
  ScansPage,
  SignInPage,
  StatisticsPage,
  UsersPage,
  WinnersPage,
} from 'src/pages';
import DetermineWinnerPage from 'src/pages/determine_winner';

function RoutElements() {
  const { isAuthenticated } = useTypedSelector((state) => state.auth);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<SignInPage />} />
          <Route path="*" element={<SignInPage />} />
        </Route>
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<StatisticsPage />} />
        <Route path="/determine_winner" element={<DetermineWinnerPage />} />
        <Route path="/qr_codes" element={<QRCodesPage />} />
        <Route path="/scans" element={<ScansPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/winners" element={<WinnersPage />} />
        <Route path="/topusers" element={<UsersPage isTopUser />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="*" element={<Custom404Page />} />
      </Route>
    </Routes>
  );
}

export default RoutElements;
