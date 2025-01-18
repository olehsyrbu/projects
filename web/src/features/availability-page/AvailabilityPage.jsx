import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AvailabilityError } from './AvailabilityError';
import { useAvailabilityTypes } from '@/core/api/ReferenceDataQueries';
import peopleIconUrl from './assets/people.svg';
import leftFlowersIconUrl from './assets/leftFlowers.svg';
import rightFlowersIconUrl from './assets/rightFlowers.svg';
import { useUserRedirect } from '@/modules/auth/hooks';
import { useAuthContext, useUrlAuthToken } from '@/modules/auth';
import { Login } from '@/modules/account/components';
import { PageWrapper } from './PageWrapper';
import { updateProviderStatus } from '@/core/api/ProviderAPI';
import { usePersonProvider } from '@/modules/provider/hooks';
import mixpanel from '@/core/mixpanel';
import { fetchUserProfile } from '@/core/api/UserAPI';

export function AvailabilityPage() {
  let { providerId, status } = useParams();
  let { user } = useAuthContext();
  let token = useUrlAuthToken('auth_token');
  let url = useUserRedirect();
  let [availability, setAvailability] = useState(null);
  let [error, setError] = useState();
  let [availabilityTypes] = useAvailabilityTypes();
  let isLoading = token && !error && availability === null;
  const provider = usePersonProvider(providerId);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (token) {
      updateProviderStatus(providerId, status, token)
        .then((resp) => {
          let availability = availabilityTypes.find(({ code }) => code === resp.status);

          setAvailability(availability);

          if (provider) {
            return fetchUserProfile(token);
          }
        })
        .then((account) => {
          if (account) {
            mixpanel.identify(account.id);
            mixpanel.track('Update Provider', {
              availability,
              slug: provider.slug,
              status: provider.status,
              mode: provider.mode,
            });
          }
        })
        .catch((error) => {
          setError(error);
        });
    }
  }, []);

  if (error) {
    return <AvailabilityError />;
  }

  return (
    <PageWrapper>
      <div className="flex flex-col items-center">
        <img src={peopleIconUrl} aria-hidden="true" alt="" className="w-60" />
        <div className="relative mt-[-12.5rem] flex md:mt-[-8.5rem]">
          <img
            src={leftFlowersIconUrl}
            aria-hidden="true"
            alt=""
            className="invisible absolute left-[-12.75rem] top-[-3.75rem] md:visible"
          />
          <div
            className="z-10 flex w-80 flex-col items-center rounded-2xl border-solid border-[#d3dce9]
              bg-surface bg-white shadow-[0_-3px_10px_rgba(0,0,0,0.06)] md:w-[34rem]"
          >
            <h2 className="mt-14 px-10 text-center">Your current availability is set:</h2>
            <div className="mir-chips-list my-4">
              <button className="rounded-3xl border border-[#2DB3B9] bg-p-10 px-6 py-2.5 text-sm">
                {!isLoading ? availability?.name : 'Loading...'}
              </button>
            </div>
            <p className="mb-14 px-8 text-center font-normal leading-6 md:w-[23.5rem]">
              If you want to make any further changes to your schedule, please{' '}
              {user ? (
                <span>
                  log in to your{' '}
                  <a className="font-medium" href={url}>
                    profile.
                  </a>
                </span>
              ) : (
                <Login className="text !h-auto !px-0" />
              )}
            </p>
          </div>
          <img
            src={rightFlowersIconUrl}
            aria-hidden="true"
            alt=""
            className="invisible absolute right-[-10rem] top-[-3rem] md:visible"
          />
        </div>
      </div>
    </PageWrapper>
  );
}
