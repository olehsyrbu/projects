import { Suspense } from 'react';
import { SWRConfig } from 'swr';
import { BrowserRouter } from '@/core/router';
import { ErrorBoundary } from '@/modules/error-handling';
import { ZendeskScript } from '@/modules/support';
import { AuthUser } from '@/modules/auth';
import { AppRouter } from './AppRouter';
import { ToastContainer } from '@/core/components/Toast';

function App() {
  return (
    <SWRConfig value={{ revalidateOnFocus: false }}>
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <AuthUser>
              <AppRouter />
              <ToastContainer />
            </AuthUser>
            <ZendeskScript />
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </SWRConfig>
  );
}

export default App;
