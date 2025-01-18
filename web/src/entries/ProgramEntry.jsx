import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuthContext } from '@/modules/auth';
import { ProviderLandingPage } from '@/features/invite/landingPage';
import { ProgramRepresentativeCabinet } from '@/features/cabinet/components';

const ProgramOnboardingPage = lazy(() => import('@/features/program-onboarding/ProgramOnboarding'));
const ProgramProfilePage = lazy(() => import('@/features/profile/ProgramProfilePage'));

export function ProgramEntry() {
  let { user } = useAuthContext();

  if (user?.role === 'PROGRAM') {
    return <ProgramUserEntry user={user} />;
  }

  return (
    <Routes>
      <Route index element={<ProviderLandingPage showTutorial={false} />} />
      <Route path="onboarding/*" element={<Navigate to="/" replace />} />
      <Route path=":slug" element={<ProgramProfilePage />} />
    </Routes>
  );
}

function ProgramUserEntry({ user }) {
  if (user.onboarding) {
    return (
      <Routes>
        <Route index element={<Navigate to="onboarding" replace />} />
        <Route path="resources/*" element={<Navigate to="../onboarding" replace />} />
        <Route path="onboarding/*" element={<ProgramOnboardingPage />} />
        <Route path=":slug" element={<ProgramProfilePage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route index element={<Navigate to="resources" replace />} />
      <Route path="resources/*" element={<ProgramRepresentativeCabinet />} />
      <Route path="onboarding/*" element={<ProgramOnboardingPage />} />
      <Route path=":slug" element={<ProgramProfilePage />} />
    </Routes>
  );
}

ProgramUserEntry.propTypes = {
  user: PropTypes.shape({
    onboarding: PropTypes.bool.isRequired,
  }).isRequired,
};
