import { useNavigate } from 'react-router-dom';
import leftFlowersIconUrl from './assets/leftFlowers.svg';
import topFlowersIconUrl from './assets/topFlowers.svg';
import singleFlowerIconUrl from './assets/singleFlower.svg';
import manIconUrl from '@/images/man.svg';
import { useAuthContext } from '@/modules/auth';
import { useUserRedirect } from '@/modules/auth/hooks';
import { Login } from '@/modules/account/components';

import { PageWrapper } from './PageWrapper';

export function AvailabilityError() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const url = useUserRedirect();

  return (
    <PageWrapper>
      <div className="flex flex-col items-center">
        <img
          className="visible md:invisible md:h-0"
          src={topFlowersIconUrl}
          aria-hidden="true"
          alt=""
        />
        <div className="relative mt-[-8.5rem] flex md:mt-32">
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
            <h2 className="mt-14 px-10 text-center">Oops, something went wrong!</h2>
            <p className="mt-4 px-8 text-center font-normal leading-6 md:w-[23rem]">
              We couldn’t update your availability, please log in to your profile to make further
              updates.
            </p>
            {user ? (
              <button
                className="mir-button primary !mb-10 !mt-5 w-56 md:!mb-16"
                onClick={() => navigate(url)}
              >
                Profile settings
              </button>
            ) : (
              <Login className="primary !mb-10 !mt-5 w-56 md:!mb-16" />
            )}
          </div>
          <>
            <img
              src={singleFlowerIconUrl}
              aria-hidden="true"
              alt=""
              className="invisible absolute right-[-10rem] md:visible"
            />
            <img
              src={manIconUrl}
              aria-hidden="true"
              alt=""
              className="invisible absolute right-[-13rem] top-[5rem] z-20 md:visible"
            />
          </>
        </div>
      </div>
    </PageWrapper>
  );
}
