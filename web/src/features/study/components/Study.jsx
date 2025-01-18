import { Suspense } from 'react';
import { useNavigate, useParams, useResolvedPath } from 'react-router-dom';
import { MindloggerAccount } from '@/modules/mindlogger/components';
import { AppletLoadingFallback, Applet } from './Applet';
import Logo from '@/modules/app-shell/Logo';
import mindloggerLogo from '../assets/mindloggerLogo.svg';
import { ErrorBoundary } from 'react-error-boundary';
import { NotFound } from '@/modules/error-handling/components';

export function Study() {
  const { id } = useParams();
  const navigate = useNavigate();
  const path = useResolvedPath('');

  function handleRestart() {
    navigate(path.pathname);
  }

  return (
    <ErrorBoundary fallback={<NotFound />}>
      <main className="grid min-h-screen grid-rows-[auto_1fr_auto] bg-surface">
        <header className="box-content flex items-center justify-between py-5 md:h-8 md:py-4">
          <div className="pl-4 md:pl-8">
            <Logo />
          </div>
          <img className="h-12 md:h-fit" src={mindloggerLogo} alt="mindlogger logo" />
        </header>
        <Suspense fallback={<AppletLoadingFallback />}>
          <MindloggerAccount>
            <Applet publicId={id} onComplete={handleRestart} />
          </MindloggerAccount>
        </Suspense>
      </main>
    </ErrorBoundary>
  );
}
