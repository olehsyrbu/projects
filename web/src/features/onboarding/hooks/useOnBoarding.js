import { useContext } from 'react';
import { PersonOnboardingContext } from '../OnBoardingProviderContext';

export function usePersonOnBoarding() {
  return useContext(PersonOnboardingContext);
}
