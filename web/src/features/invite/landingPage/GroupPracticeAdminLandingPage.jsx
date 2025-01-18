import { useOrganizationTheme } from '@/modules/organization';
import LandingPageTemplate from './LandingPageTemplate';
import { AuthActions } from './AuthActions';
import handshakeIconUrl from '@/images/invite/handshake.svg';
import searchIconUrl from '@/images/invite/search.svg';
import leafsIconUrl from '@/images/invite/leafs.svg';
import peopleCommunityIconUrl from '@/images/invite/people.svg';
import handIconUrl from '@/images/invite/hand.svg';

export function GroupPracticeAdminLandingPage() {
  useOrganizationTheme();

  return (
    <LandingPageTemplate>
      <h1>
        Welcome to MiResource! Your resource for connecting your group practice providers with
        patients/clients.{' '}
      </h1>

      <div className="auth-panel">
        <h2 className="font-bold">Join in just 3 steps:</h2>
        <ol>
          <li>Create an account</li>
          <li>Start creating profiles for your group practice providers</li>
          <li>Share access with the providers</li>
        </ol>

        <AuthActions />

        <h3 className="font-bold">Have questions?</h3>

        <p>
          Contact us at <a href="mailto:support@miresource.com">support@miresource.com</a>
        </p>
      </div>

      <p>
        Our mission is to create better access to mental health care. We are passionate about
        connecting people to the right mental health care for their unique needs. If you have ideas
        about how we can assist you better, please let us know.
      </p>

      <h2 className="font-bold">Perks of using our database:</h2>
      <ul className="perks">
        <li>
          <img src={handshakeIconUrl} aria-hidden="true" alt="" />
          <span>
            Free advertising for your group practice providers on an invitation-only database.
          </span>
        </li>
        <li>
          <img src={searchIconUrl} aria-hidden="true" alt="" />
          <span>
            Potential clients/patients are more likely to reach out based on a connection with a
            provider profile.
          </span>
        </li>
        <li>
          <img src={leafsIconUrl} aria-hidden="true" alt="" />
          <span>
            Use the database to find higher levels of care for your clients/patients when needed.
          </span>
        </li>
        <li>
          <img src={peopleCommunityIconUrl} aria-hidden="true" alt="" />
          <span>List provider profiles with your group practice’s contact information.</span>
        </li>
        <li>
          <img src={handIconUrl} aria-hidden="true" alt="" />
          <span>Manage provider availability without logging in.</span>
        </li>
      </ul>
    </LandingPageTemplate>
  );
}
