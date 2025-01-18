import { OnBoardingWrapper } from '@/features/onboarding/components';
import { PersonOnBoardingContext } from '@/features/onboarding';
import { ROLE_NAMES } from '@/core/definitions';

export function ProviderSurveyPage() {
  return (
    <PersonOnBoardingContext role={ROLE_NAMES.GPA}>
      <OnBoardingWrapper />
    </PersonOnBoardingContext>
  );
}
