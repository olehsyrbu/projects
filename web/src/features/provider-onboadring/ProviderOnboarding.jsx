import { OnBoardingWrapper, PersonOnBoardingContext } from '@/features/onboarding';
import { ROLE_NAMES } from '@/core/definitions';

export function ProviderOnboarding() {
  return (
    <PersonOnBoardingContext role={ROLE_NAMES.PROVIDER}>
      <div className="min-h-screen bg-surface">
        <OnBoardingWrapper />
      </div>
    </PersonOnBoardingContext>
  );
}
