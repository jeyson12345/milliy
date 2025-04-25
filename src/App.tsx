import { GoogleOAuthProvider } from '@react-oauth/google';
import { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AntConfigProvider from './provider/antConfig';
import ReduxProvider from './provider/redux';
import RoutElements from './provider/routes';

function App() {
  return (
    <Suspense fallback={<div />}>
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
