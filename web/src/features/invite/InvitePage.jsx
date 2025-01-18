import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { isNull } from 'lodash-es';
import { useAuthContext } from '@/modules/auth';
import { getRedirectUrlByAccount } from '@/modules/auth/utils';
import { useInvitationValidity } from '@/core/api/InvitationQueries';
import { ProviderInvitePage } from './provider/ProviderInvitePage';
import { useLandingPageFlag } from './useLandingPageFlag';
import Header from '@/modules/app-shell/HeaderWithLogin';
import { ROLE_NAMES } from '@/core/definitions';

export function InvitePage() {
  let { user } = useAuthContext();
  let { code = '' } = useParams();
  let invite = useInvitationValidity({ code }) || null;
  let isLandingPageEnabled = useLandingPageFlag();

  if (user?.role) {
    return <Navigate to={getRedirectUrlByAccount(user)} replace />;
  }

  if ((code && !invite) || isNull(isLandingPageEnabled)) {
    return <Skeleton />;
  }

  switch (invite?.params.type) {
    case ROLE_NAMES.PROGRAM:
      return <Navigate to={`/program?invite=${code}`} replace />;
    case ROLE_NAMES.REFERRAL_COORDINATOR:
      return <Navigate to={`/referral-coordinator?invite=${code}`} replace />;
    case ROLE_NAMES.GPA:
      return <Navigate to={`/group-practice-admin?invite=${code}`} replace />;
    case ROLE_NAMES.TEAM_MEMBER:
      return <Navigate to={`/team-member?invite=${code}`} replace />;
    default:
      break;
  }

  return (
    <Routes>
      <Route
        index
        element={
          isLandingPageEnabled ? (
            <ProviderInvitePage />
          ) : (
            <Navigate to={`/provider?invite=${code}`} replace />
          )
        }
      />
    </Routes>
  );
}

function Skeleton() {
  return (
    <div>
      <Header login={false} />
      <div className="mt-9 flex animate-pulse flex-col items-center">
        <div className="flex w-[85vw] flex-col md:w-fit md:flex-row">
          <div className="h-44 w-full rounded-lg bg-n-40 md:h-96 md:w-[29rem]" />
          <div className="md:ml-12">
            <div className="mt-14 w-full">
              <div className="h-6 w-full rounded-lg  bg-n-50 md:w-[29rem] " />
              <div className="mt-6 h-6 w-full rounded-lg bg-n-50 md:w-[36rem] " />
            </div>
            <div className="mt-12 flex w-full flex-col items-center md:mt-10">
              <div className="h-4 w-full rounded-lg bg-n-40 " />
              <div className="mt-4 h-4 w-11/12 rounded-lg bg-n-40 md:hidden" />
            </div>
            <div className="mt-10 flex w-full flex-col items-center md:flex-row">
              <div className="h-12 w-9/12 rounded-lg bg-n-50 md:w-60 " />
              <div className="mt-8 h-12 w-9/12 rounded-lg bg-n-50 md:ml-7 md:mt-0 md:w-60 " />
            </div>
          </div>
        </div>

        <div className="mt-56 hidden w-[68rem] md:block">
          <div className="h-6 rounded-lg bg-n-50 md:w-[29rem]" />
          <div className="mt-12 flex grid grid-cols-3 gap-x-14 gap-y-12">
            {Array.from(Array(6), (_, index) => (
              <div key={index} className="h-10 w-72 rounded-lg bg-n-40" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
