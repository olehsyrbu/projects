import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useOrganizationTheme, OrganizationTypes } from '@/modules/organization';
import Logo from '@/modules/app-shell/Logo';
import { Survey, SurveyStep } from '@/modules/survey/components';
import { OnboardingPayment } from '@/features/onboarding';

import { usePersonOnBoarding } from '../hooks';
import { getIsRoleGPA, isRoleNetworkManager, getIsRoleProvider, getOnboardingStep } from '../utils';
import './ProviderOnboarding.css';

import {
  OnboardingProviderGeneralInfo,
  OnboardingProviderLocation,
  OnboardingProviderExpertise,
  OnboardingProviderAvailability,
  OnboardingProviderContact,
  OnboardingProviderLicense,
  OnboardingProviderPhoto,
  OnboardingProviderConfirmation,
  OnboardingInviteProvider,
} from '../components';

export function OnBoardingWrapper() {
  const { provider, role } = usePersonOnBoarding();
  const navigate = useNavigate();
  const isRoleGPA = getIsRoleGPA(role);
  const isRoleProvider = getIsRoleProvider(role);

  const step = getOnboardingStep(provider);

  useOrganizationTheme({
    enableFor: [OrganizationTypes.Insurance],
  });

  useEffect(() => {
    if (provider?.status === 'COMPLETED') {
      let path = '/provider/dashboard';
      if (isRoleGPA) {
        path = '/group-practice/resources';
      }
      navigate(path, { replace: true });
    }
  });

  return (
    <div id="providerOnboardingContainer">
      {isRoleProvider && (
        <div id="navbar">
          <Logo />
        </div>
      )}
      <div>
        <Survey initialStep={step}>
          <SurveyStep element={<OnboardingProviderGeneralInfo />} />
          <SurveyStep element={<OnboardingProviderLocation />} />
          <SurveyStep element={<OnboardingProviderExpertise />} />
          <SurveyStep element={<OnboardingProviderAvailability />} />
          <SurveyStep element={<OnboardingProviderContact />} />
          <SurveyStep element={<OnboardingProviderLicense />} />
          <SurveyStep element={<OnboardingPayment />} />
          <SurveyStep element={<OnboardingProviderPhoto />} />
          <SurveyStep element={<OnboardingProviderConfirmation />} />
          {isRoleGPA ? <SurveyStep element={<OnboardingInviteProvider />} /> : null}
        </Survey>
      </div>
    </div>
  );
}
