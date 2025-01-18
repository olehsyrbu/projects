import PropTypes from 'prop-types';
import { useOrganizationTheme } from '@/modules/organization';
import LandingPageTemplate from './LandingPageTemplate';
import { AuthActions } from './AuthActions';
import handshakeIconUrl from '@/images/invite/handshake.svg';
import searchIconUrl from '@/images/invite/search.svg';
import leafsIconUrl from '@/images/invite/leafs.svg';
import peopleCommunityIconUrl from '@/images/invite/people.svg';
import handIconUrl from '@/images/invite/hand.svg';
import { Navigate, useLocation } from 'react-router-dom';
import { useLandingPageFlag } from '@/features/invite/useLandingPageFlag';
import { useEffect, useState } from 'react';
import Logo from '@/modules/app-shell/Logo';

export function ProviderLandingPage({ invitationType, showTutorial }) {
  const [isPageLoading, setPageLoading] = useState(true);
  let isLandingPageEnabled = useLandingPageFlag();

  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let invite = params.get('invite') || '';

  useOrganizationTheme();

  useEffect(() => {
    if (isLandingPageEnabled !== null) {
      setPageLoading(false);
    }
  }, [isLandingPageEnabled]);

  if (isPageLoading) {
    return <Skeleton />;
  }

  if (isLandingPageEnabled && invitationType === 'PROVIDER') {
    return <Navigate to={`/invite/${invite}`} replace />;
  }

  return (
    <LandingPageTemplate>
      <h1>Welcome to MiResource, an invitation-only referral database!</h1>

      <div className="auth-panel">
        <h2 className="font-bold">Join in just three steps:</h2>
        <ol>
          <li>Create an account</li>
          <li>Complete your profile</li>
          <li>Start matching with clients!</li>
        </ol>

        <AuthActions />

        <h3 className="font-bold">Have questions?</h3>

        {showTutorial && (
          <p>
            Watch our{' '}
            <a href="https://youtu.be/07Wd-G3sxjE" target="_blank" rel="noreferrer">
              3 min video
            </a>{' '}
            on how to create a MiResource profile.
          </p>
        )}
        <p>
          Contact us at <a href="mailto:support@miresource.com">support@miresource.com</a>
        </p>
      </div>

      <p>
        Our mission is to create better access to mental health care. We are passionate about
        connecting people to the right mental health care for their unique needs.
      </p>

      <h2 className="font-bold">Perks of joining our community:</h2>
      <ul className="perks">
        <li>
          <img src={handshakeIconUrl} aria-hidden="true" alt="" />
          <span>Exposure to clients/patients who match your speciality areas</span>
        </li>
        <li>
          <img src={searchIconUrl} aria-hidden="true" alt="" />
          <span>Free marketing for your services</span>
        </li>
        <li>
          <img src={leafsIconUrl} aria-hidden="true" alt="" />
          <span>A referral tool to help you find additional care for your clients/patients</span>
        </li>
        <li>
          <img src={peopleCommunityIconUrl} aria-hidden="true" alt="" />
          <span>Access to an exclusive community of resources</span>
        </li>
        <li>
          <img src={handIconUrl} aria-hidden="true" alt="" />
          <span>Reduced requests for services when you do not have availability</span>
        </li>
      </ul>
    </LandingPageTemplate>
  );
}

function Skeleton() {
  return (
    <div className="h-screen bg-surface">
      <header className="flex h-20 flex-col items-start justify-center md:p-0 md:px-9">
        <Logo />
      </header>
      <div className="m-auto flex max-w-4xl animate-pulse items-center justify-center md:pt-24">
        <div className="flex w-[85vw] flex-col md:w-fit md:flex-row">
          <div>
            <div className="mb-2 h-6 w-full rounded-lg bg-n-50 md:h-12 md:w-[37rem]" />
            <div className="mb-2 h-6 w-full rounded-lg bg-n-50 md:hidden md:w-[37rem]" />
            <div className="mb-6 h-6 w-full rounded-lg bg-n-50 md:mb-14 md:h-12 md:w-[37rem]" />
            <div className="hidden md:block">
              <div className="mb-2 h-6 w-full rounded-lg bg-n-50 md:w-[37rem] " />
              <div className="mb-2 h-6 w-full rounded-lg bg-n-50 md:w-[37rem] " />
              <div className="h-6 w-full rounded-lg bg-n-50 md:w-[37rem] " />

              <div className="h-6 w-full rounded-lg bg-n-50 md:mt-14 md:w-1/2" />
              <div className="mt-6 grid grid-cols-3 gap-4">
                {Array(5)
                  .fill()
                  .map((_, index) => (
                    <div key={index} className="space-y-2">
                      <div className="h-6 w-44 rounded bg-n-50" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="h-96 w-full rounded-lg bg-n-50 md:ml-12 md:w-72" />
        </div>
      </div>
    </div>
  );
}

ProviderLandingPage.propTypes = {
  invitationType: PropTypes.string,
  showTutorial: PropTypes.bool,
};

ProviderLandingPage.defaultProps = {
  showTutorial: true,
};
