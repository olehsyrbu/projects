import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import mixpanel from '@/core/mixpanel';
import { AppletProvider } from '@/modules/mindlogger/components';

import { AppletLanding } from './AppletLanding';
import { AppletContent } from './AppletContent';
import { AppletFinal } from './AppletFinal';
import { Activities } from '../Activity/Activities';
import { AppletTermOfUse } from './AppletTermOfUse';

export function Applet({ publicId, onComplete }) {
  const navigate = useNavigate();
  const location = useLocation();

  function onReset() {
    delete location.state?.appletStarted;

    onComplete();
  }

  if (!location.state?.appletStarted) {
    return <Navigate to="landing" state={{ ...location.state, appletStarted: true }} replace />;
  }

  return (
    <AppletProvider publicId={publicId}>
      <Routes>
        <Route
          path="landing"
          element={
            <AppletLanding
              onNext={() => {
                navigate('consent', { state: location.state });
                mixpanel.track('Study Landing Next', { publicId });
              }}
            />
          }
        />
        <Route
          path="consent"
          element={
            <AppletTermOfUse
              onNext={() => {
                navigate('content', { state: location.state });
                mixpanel.track('Study Consent Next', { publicId });
              }}
            />
          }
        />
        <Route
          path="content"
          element={
            <AppletContent
              onNext={() => {
                navigate('activities', { state: location.state });
                mixpanel.track('Study Content Next', { publicId });
              }}
            />
          }
        />
        <Route
          path="activities/*"
          element={
            <Activities
              onComplete={() => {
                navigate('final', { state: location.state });
              }}
            />
          }
        />
        <Route
          path="final"
          element={
            <AppletFinal
              onNext={() => {
                onReset();
                mixpanel.track('Study Final Reset', { publicId });
              }}
            />
          }
        />
      </Routes>
    </AppletProvider>
  );
}

Applet.propTypes = {
  publicId: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
};
