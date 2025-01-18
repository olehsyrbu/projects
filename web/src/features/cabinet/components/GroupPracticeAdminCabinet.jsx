import { useGPAProviders } from '@/core/api/ProviderQueries';
import { NavLink, Route, Routes } from 'react-router-dom';
import { ROLE_NAMES } from '@/core/definitions';
import { Cabinet } from '@/modules/app-shell/Cabinet';
import { PrivateRoute } from '@/modules/auth/components';
import {
  EmptyPage,
  ProviderEditPage,
  ProviderSurveyPage,
  ResourcesPage,
  UploadInfoPage,
} from '@/features/group-practice-admin';
import {
  GroupPracticeAdminDashboard,
  GroupPracticeAdminDashboardSkeleton,
} from '@/features/dashboard/components';
import { Suspense } from 'react';

export function GroupPracticeAdminCabinet() {
  const {
    data: { items },
  } = useGPAProviders({ page: 1, limit: 10 });

  const isEmptyGPA = items?.length === 0;

  return (
    <Cabinet
      navigation={
        <>
          {!isEmptyGPA && <NavLink to="/group-practice/dashboard">My dashboard</NavLink>}
          <NavLink to="/group-practice/resources">My resources</NavLink>
        </>
      }
    >
      <PrivateRoute role={ROLE_NAMES.GPA} fallback="/group-practice">
        <Routes>
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<GroupPracticeAdminDashboardSkeleton />}>
                <GroupPracticeAdminDashboard />
              </Suspense>
            }
          />
          <Route path="resources/onboarding/:providerId/*" element={<ProviderSurveyPage />} />
          <Route path="resources/edit/:providerId/*" element={<ProviderEditPage />} />
          <Route path="resources/upload-template" element={<UploadInfoPage />} />
          <Route path="resources" element={isEmptyGPA ? <EmptyPage /> : <ResourcesPage />} />
        </Routes>
      </PrivateRoute>
    </Cabinet>
  );
}
