import { createContext } from 'react';
import PropTypes from 'prop-types';

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { usePersonOnBoardingProvider } from '@/core/api/ProviderQueries';
import { ROLE_NAMES } from '@/core/definitions';
import { useAuthContext } from '@/modules/auth';

export const PersonOnboardingContext = createContext({
  provider: {},
  updateProvider: () => {},
  role: ROLE_NAMES.PROVIDER,
  doStepNext: () => {},
});

export function PersonOnBoardingContext({ role = ROLE_NAMES.PROVIDER, children }) {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const ownership = user?.ownership[0];

  const [provider, updateProvider] = usePersonOnBoardingProvider(providerId || ownership?.id, user);

  function getNextStep(currentStep = 1) {
    return location.pathname.replace(`step-${currentStep - 1}`, `step-${currentStep}`);
  }

  const doStepNext = (data) => {
    const { currentStep, historyStep, historyParams } = data;

    if (historyStep) {
      navigate(historyStep, { state: historyParams });
    } else {
      navigate(getNextStep(currentStep));
    }
  };

  return (
    <PersonOnboardingContext.Provider
      value={{
        provider,
        updateProvider,
        doStepNext,
        role,
      }}
    >
      {children}
    </PersonOnboardingContext.Provider>
  );
}

PersonOnBoardingContext.propTypes = {
  children: PropTypes.node,
  role: PropTypes.string,
};
