import { Route, Routes } from 'react-router-dom';
import { useTypedSelector } from 'src/app/store';

// Layouts
import { AuthLayout, DashboardLayout } from 'src/components/layout';

// Pages
import {
  Custom404Page,
  DetermineWinnerPage,
  LinksPage,
  MessagesPage,
  QRCodesPage,
  QuestionsPage,
  ScansPage,
  SignInPage,
  StatisticsPage,
  UsersPage,
  WinnersPage,
} from 'src/pages';

function RoutElements() {
  const { isAuthenticated, role } = useTypedSelector((state) => state.auth);

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
      {role === 'admin' ? (
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<StatisticsPage />} />
          <Route path="/determine_winner" element={<DetermineWinnerPage />} />
          <Route path="/qr_codes" element={<QRCodesPage />} />
          <Route path="/scans" element={<ScansPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/winners" element={<WinnersPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/links" element={<LinksPage />} />
          <Route path="*" element={<Custom404Page />} />
        </Route>
      ) : (
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<MessagesPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/links" element={<LinksPage />} />
          <Route path="*" element={<Custom404Page />} />
        </Route>
      )}
    </Routes>
  );
}

export default RoutElements;
