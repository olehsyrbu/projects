import { lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useLDClient } from 'launchdarkly-react-client-sdk';
import mixpanel from '@/core/mixpanel';
import { useFlag } from '@/core/feature-split';
import { useOrganization } from '@/modules/organization';
import { PrivateRoute, ProtectedRoute } from '@/modules/auth/components';
import { AccountLogout, LoginAsPage, ResetPassword } from '@/modules/account/components';
import { ProviderOnboarding } from '@/features/provider-onboadring/ProviderOnboarding';
import { NotFound } from '@/modules/error-handling/components';
import ProviderDashboard from '@/features/provider-dashboard/ProviderDashboard';
import {
  GroupPracticeAdminLandingPage,
  ProviderLandingPage,
  ReferralCoordinatorLandingPage,
} from '@/features/invite/landingPage';
import { HomePage } from '@/features/home-page/HomePage';
import ReferralListStudentsPage from '@/features/my-referral-list/components/ReferralListStudentsPage';
import { AvailabilityPage } from '@/features/availability-page';
import {
  GroupPracticeAdminCabinet,
  ReferralCoordinatorCabinet,
} from '@/features/cabinet/components';
import { ProgramEntry } from '@/entries/ProgramEntry';
import { AppRedirect } from './AppRedirect';
import { useAuthContext } from '@/modules/auth';
import { InvitePage } from '@/features/invite/InvitePage';

const AdvancedSearchPage = lazy(() => import('@/features/advanced-search/AdvancedSearchPage'));
const GuidedSearchPage = lazy(() => import('@/features/guided-search/GuidedSearchPage'));
const StudyPage = lazy(() => import('@/features/study/StudyPage'));
const PersonProfilePage = lazy(() => import('@/features/profile/PersonProfilePage'));
const AboutPage = lazy(() => import('@/features/about/About'));
const PartnersPage = lazy(() => import('@/features/partners/PartnersPage'));
const FoundersPage = lazy(() => import('@/features/about/FoundersPage'));
const ResourcesPage = lazy(() => import('@/features/resources/ResourcesPage'));
export function AppRouter() {
  let programsEnabled = useFlag('programs');

  useTrackPartnerTraffic();
  useIdentifyFeatureSplit();

  return (
    <>
      <Routes>
        <Route path="/login-as" element={<LoginAsPage />} />
        <Route path="/logout" element={<AccountLogout />} />
        <Route path="/not-found" element={<NotFound />} />

        <Route path="/provider" element={<ProviderLandingPage invitationType="PROVIDER" />} />
        <Route path="/invite/:code" element={<InvitePage />} />
        <Route path="/invite" element={<InvitePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/founders" element={<FoundersPage />} />

        <Route path="/resources/*" element={<ResourcesPage />} />

        <Route
          path="/provider/onboarding/*"
          element={
            <PrivateRoute ownership="Provider" fallback="/provider" shouldSkipPrimaryOrgRedirect>
              <ProviderOnboarding />
            </PrivateRoute>
          }
        />
        <Route
          path="/provider/dashboard"
          element={
            <PrivateRoute ownership="Provider" fallback="/" shouldSkipPrimaryOrgRedirect>
              <ProviderDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/provider/resources"
          element={
            <PrivateRoute ownership="Provider" fallback="/" shouldSkipPrimaryOrgRedirect>
              <ProviderDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/provider/resources/edit/:providerId/*"
          element={
            <PrivateRoute ownership="Provider" fallback="/" shouldSkipPrimaryOrgRedirect>
              <ProviderDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/provider/resources/edit"
          element={
            <PrivateRoute ownership="Provider" fallback="/" shouldSkipPrimaryOrgRedirect>
              <ProviderDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/provider/:slug" element={<PersonProfilePage />} />

        <Route path="/ref/list/:code" element={<ReferralListStudentsPage />} />

        <Route path="/referral-coordinator" element={<ReferralCoordinatorLandingPage />} />

        <Route path="/team-member" element={<ReferralCoordinatorLandingPage />} />

        <Route path="/referral-coordinator/*" element={<ReferralCoordinatorCabinet />} />
        <Route
          path="/group-practice/*"
          element={
            <ProtectedRoute>
              <GroupPracticeAdminCabinet />
            </ProtectedRoute>
          }
        />

        {programsEnabled !== false && <Route path="/program/*" element={<ProgramEntry />} />}
        <Route path="/group-practice-admin" element={<GroupPracticeAdminLandingPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/search" element={<AdvancedSearchPage />} />
        <Route path="/guided-search/*" element={<GuidedSearchPage />} />

        <Route
          path="/actions/update-availability/:providerId/status/:status"
          element={<AvailabilityPage />}
        />
        <Route path="/actions/update-availability/:status" element={<AvailabilityPage />} />

        <Route path="/study/:id" element={<StudyPage />} />
        <Route path="/study/:id/*" element={<StudyPage />} />

        <Route index element={<HomePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AppRedirect />
    </>
  );
}

function useTrackPartnerTraffic() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const partnerUserId = params.get('partnerUserId');
    if (partnerUserId) {
      // assume that format of partnerUserId fits into mixpanel distinctId
      mixpanel.identify(partnerUserId);
      mixpanel.register_once({ partnerUserId });
      mixpanel.people.set({
        partnerUserId,
      });
    }
  }, [location.search]);
}

function useIdentifyFeatureSplit() {
  const client = useLDClient();
  const { user } = useAuthContext();
  const organization = useOrganization();

  useEffect(() => {
    if (!client) {
      return;
    }

    let context = client.getContext();

    if (user) {
      context.user = {
        kind: 'user',
        key: user.id,
        firstName: user.firstName,
        email: user.email,
        organization: [user.organization?.subdomain],
      };
    }

    if (organization) {
      context.organization = {
        kind: 'organization',
        key: organization.subdomain,
        name: organization.name,
      };
    }

    client.identify(context);
  }, [client, user, organization]);
}
