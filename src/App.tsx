import { GoogleOAuthProvider } from '@react-oauth/google';
import { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AntConfigProvider from './provider/antConfig';
import ReduxProvider from './provider/redux';
import RoutElements from './provider/routes';
import { LoadingPage } from './pages/404/LoadingPage';

function App() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <GoogleOAuthProvider clientId="823324453673-qeb46jbprou8salvu50l3u6lubujmgh8.apps.googleusercontent.com">
        <ReduxProvider>
          <Router>
            <AntConfigProvider>
              <RoutElements />
            </AntConfigProvider>
          </Router>
        </ReduxProvider>
      </GoogleOAuthProvider>
    </Suspense>
  );
}

export default App;
