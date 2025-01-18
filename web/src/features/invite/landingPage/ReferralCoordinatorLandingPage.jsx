import { useOrganizationTheme } from '@/modules/organization';
import LandingPageTemplate from './LandingPageTemplate';
import { AuthActions } from './AuthActions';
import userCardIconUrl from '@/images/invite/user-card.svg';
import searchIconUrl from '@/images/invite/search.svg';
import userTimingIconUrl from '@/images/invite/user-timing.svg';
import notesIconUrl from '@/images/invite/notes.svg';
import keyIconUrl from '@/images/invite/key.svg';
import { useOrganization } from '@/modules/organization';

export function ReferralCoordinatorLandingPage() {
  useOrganizationTheme();
  const organization = useOrganization();

  if (organization?.type === 'insurance') {
    return <InsuranceOrganizationsPage />;
  }

  return (
    <LandingPageTemplate>
      <h1 className="text-[2.5rem] leading-normal">
        Welcome to MiResource, your resource for connecting students with mental health care.
      </h1>

      <div className="auth-panel">
        <h2 className="font-bold">Join in just three steps:</h2>
        <ol>
          <li>Create an account.</li>
          <li>Invite your colleagues.</li>
          <li>Start connecting students.</li>
        </ol>

        <AuthActions />

        <h3 className="!mb-3 font-bold">Have questions?</h3>

        <p>
          Contact us at <a href="mailto:support@miresource.com">support@miresource.com</a>
        </p>
      </div>

      <p>
        Our mission is to help make your work easier by creating tools that connect students to the
        right mental health care for their unique needs. If you have ideas about how we can assist
        you better, please let us know.
      </p>

      <h2 className="font-bold">Perks of using our database:</h2>
      <ul className="perks">
        <li>
          <img src={userCardIconUrl} aria-hidden="true" alt="" />
          <span>Create student-centric custom referral lists.</span>
        </li>
        <li>
          <img src={searchIconUrl} aria-hidden="true" alt="" />
          <span>
            Identity-specific search functions to connect students with those who share their lived
            experiences.
          </span>
        </li>
        <li>
          <img src={userTimingIconUrl} aria-hidden="true" alt="" />
          <span>Provider availability updates every 15 days with an 80% compliance rate.</span>
        </li>
        <li>
          <img src={notesIconUrl} aria-hidden="true" alt="" />
          <span>Write notes on community providers that only your organization can see.</span>
        </li>
        <li>
          <img src={keyIconUrl} aria-hidden="true" alt="" />
          <span>Database accessible by all members of your organization.</span>
        </li>
      </ul>
    </LandingPageTemplate>
  );
}

function InsuranceOrganizationsPage() {
  return (
    <LandingPageTemplate>
      <h1 className="!text-[2.5rem] !leading-normal">
        Welcome to MiResource, your resource for connecting members with mental health care.
      </h1>

      <div className="auth-panel">
        <h2 className="font-bold">Join in just three steps:</h2>
        <ol>
          <li>Create an account.</li>
          <li>Invite your colleagues.</li>
          <li>Start connecting members.</li>
        </ol>

        <AuthActions />

        <h3 className="!mb-3 font-bold">Have questions?</h3>

        <p>
          Contact us at <a href="mailto:support@miresource.com">support@miresource.com</a>
        </p>
      </div>

      <p>
        Our mission is to help make your work easier by creating tools that connect members to the
        right mental health care for their unique needs. If you have ideas about how we can assist
        you better, please let us know.
      </p>

      <h2 className="font-bold">Perks of using our database:</h2>
      <ul className="perks">
        <li>
          <img src={userCardIconUrl} aria-hidden="true" alt="" />
          <span>Create custom referral lists for your members.</span>
        </li>
        <li>
          <img src={searchIconUrl} aria-hidden="true" alt="" />
          <span>
            Identity-specific search filters to connect members with those who share their lived
            experiences.
          </span>
        </li>
        <li>
          <img src={userTimingIconUrl} aria-hidden="true" alt="" />
          <span>Provider availability updates every 15 days with an 80% compliance rate.</span>
        </li>
        <li>
          <img src={notesIconUrl} aria-hidden="true" alt="" />
          <span>Write notes on in-network providers that only your health plan can see.</span>
        </li>
        <li>
          <img src={keyIconUrl} aria-hidden="true" alt="" />
          <span>Database accessible by all members of your health plan.</span>
        </li>
      </ul>
    </LandingPageTemplate>
  );
}
