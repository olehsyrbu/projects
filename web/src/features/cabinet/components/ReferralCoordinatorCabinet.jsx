import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { TeamManagementPage } from '@/features/team-managment/components';
import ResourcesPage from '@/features/my-resources/ResourcesPage';
import { ReferralListPage } from '@/features/my-referral-list/components';
import { Cabinet } from '@/modules/app-shell/Cabinet';
import { Can } from '@/modules/ability/components';
import {
  InvitationAction,
  ProviderAction,
  ReferralListAction,
  useInvitationSubject,
  useProviderSubject,
  useReferralListSubject,
} from '@/modules/auth/hooks';
import { ProtectedRoute } from '@/modules/auth/components';
import { useAuthContext } from '@/modules/auth';

export function ReferralCoordinatorCabinet() {
  const { user } = useAuthContext();
  const invitationSubject = useInvitationSubject();
  const providerSubject = useProviderSubject();
  const referralListSubject = useReferralListSubject();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Cabinet
      navigation={
        <>
          <Can I={ProviderAction.Read} a={providerSubject}>
            <NavLink to="/referral-coordinator/resources">My resources</NavLink>
          </Can>
          <Can I={ReferralListAction.Create} a={referralListSubject}>
            <NavLink to="/referral-coordinator/referral-list">Referral list</NavLink>
          </Can>
          <Can I={InvitationAction.Read} a={invitationSubject}>
            <NavLink to="/referral-coordinator/team-management">Manage my team</NavLink>
          </Can>
        </>
      }
    >
      <Routes>
        <Route
          path="resources/*"
          element={
            <ProtectedRoute
              check={{ action: ProviderAction.Read, subject: providerSubject }}
              fallback={<Navigate to="referral-list" replace />}
            >
              <ResourcesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="referral-list"
          element={
            <ProtectedRoute
              check={{ action: ReferralListAction.Create, subject: referralListSubject }}
            >
              <ReferralListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="team-management/*"
          element={
            <ProtectedRoute
              check={{ action: InvitationAction.Read, subject: invitationSubject }}
              fallback={<Navigate to="referral-list" replace />}
            >
              {user?.organization ? (
                <TeamManagementPage organizationId={user.organization.id} />
              ) : null}
            </ProtectedRoute>
          }
        />
      </Routes>
    </Cabinet>
  );
}
