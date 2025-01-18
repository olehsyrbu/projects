import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { differenceInDays } from 'date-fns';
import PropTypes from 'prop-types';
import {
  Clock16Filled as Clock,
  Star16Filled as Star,
  Info16Filled as Info,
  VideoPerson16Filled as VideoPerson,
  Globe16Filled as Globe,
  Handshake16Filled as Handshake,
} from '@fluentui/react-icons';
import { useProviderBySlug } from '@/core/api/ProviderQueries';
import { Avatar } from '@/core/components';
import { useOrganization, useOrganizationTheme, OrganizationTypes } from '@/modules/organization';
import { Header } from '@/modules/app-shell';
import Footer from '@/modules/app-shell/Footer';
import { SubFooter } from '@/modules/app-shell/Footer/SubFooter';
import { Availability } from '@/modules/provider/components';
import { useSearchUrlParams } from '@/modules/search/hooks';

import { useTrackPageVisit } from './useTrackPageVisit';
import { sortProfileFields } from './sortProfileFields';
import { TagLine, Description, Navigation, AnchorLink } from './components';
import { Location, Remote } from './sections/Location';
import { AreasOfFocus } from './sections/AreasOfFocus';
import { Treatments } from './sections/Treatments';
import { Schedule } from './sections/Schedule';
import { Credentials } from './sections/Credentials';
import { Payment } from './sections/Payment';
import { Other } from './sections/Other';
import { ContactPanel } from './sections/ContactPanel';
import { ReferralListPanel } from './ReferralListPanel';
import { filterInactiveEntities } from '@/core/api/utils';

export default function PersonProfilePage() {
  let { slug } = useParams();
  let organization = useOrganization();
  let searchParams = useSearchUrlParams();

  let person = useProviderBySlug(slug, organization?.subdomain);
  person = filterInactiveEntities(person);
  person = sortProfileFields(organization, person, searchParams);

  useOrganizationTheme({
    enableFor: [OrganizationTypes.Insurance],
  });

  useTrackPageVisit(person);

  // TODO: remove this after MIR-4459 is implemented
  let navigate = useNavigate();
  useEffect(() => {
    navigate({ search: '' }, { replace: true });
  }, []);

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto_auto]">
      <Header />

      <main className="grid w-screen break-words md:grid-cols-[700px] md:justify-center md:pt-9 lg:grid-cols-[700px_260px] lg:gap-x-16">
        <General profile={person} />

        <TagLine>{person.tagLine}</TagLine>

        {person.description ? <Description>{person.description}</Description> : null}

        <Traits profile={person} />

        <ContactPanel profile={person} />

        <Navigation>
          <AnchorLink href="#schedule">Schedule</AnchorLink>
          <AnchorLink href="#areas">Areas of focus</AnchorLink>
          <AnchorLink href="#treatments">Treatments</AnchorLink>
          <AnchorLink href="#location">Location</AnchorLink>
          <AnchorLink href="#remote">Remote</AnchorLink>
          <AnchorLink href="#payment">Payment</AnchorLink>
          <AnchorLink href="#credentials">Credentials</AnchorLink>
          <AnchorLink href="#other">Other</AnchorLink>
        </Navigation>

        <div className="min-w-0 divide-y divide-light">
          <Schedule profile={person} anchorId="schedule" />
          <AreasOfFocus profile={person} anchorId="areas" />
          <Treatments profile={person} anchorId="treatments" />
          <Location profile={person} anchorId="location" />
          <Remote profile={person} anchorId="remote" />
          <Payment profile={person} anchorId="payment" />
          <Credentials profile={person} anchorId="credentials" />
          <Other profile={person} anchorId="other" />
        </div>

        <ReferralListPanel />
      </main>

      <SubFooter />
      <Footer />
    </div>
  );
}

function General({ profile }) {
  return (
    <div className="mb-4 grid grid-flow-dense grid-cols-[1fr_auto] gap-x-4 max-md:px-4 md:grid-cols-[auto_1fr] md:gap-x-6">
      <Avatar
        url={profile.photoUrl}
        className="col-[2/3] row-[1/3] size-20 md:col-[1/2] md:row-[1/4] md:size-[6.25rem]"
      />

      <div className="mb-2 flex-wrap md:mb-1 md:flex md:items-center md:gap-x-2">
        <h1 className="font-sans text-2xl font-bold md:font-serif md:text-3xl">
          {profile.legalFirstName}
          {profile.preferredFirstName ? ` (${profile.preferredFirstName}) ` : ' '}
          {profile.legalLastName}
        </h1>
        {profile.pronoun ? <p className="text-hint">({profile.pronoun.name})</p> : null}
      </div>

      <p className="mb-4 md:mb-2">
        {profile.providerTypes.map((type) => type.providerType.name).join(', ')}
      </p>

      <div className="col-[1/3] flex flex-wrap gap-2 md:col-[2/3]">
        <Availability status={profile.availability?.status} className="-ml-2" />

        <div className="flex items-center text-sm font-medium">
          <Clock className="mr-1 flex-none" />
          Updated {formatUpdatedAt(profile)}
        </div>

        {profile.experience ? (
          <div className="flex items-center text-sm font-medium">
            <Star className="mr-1 flex-none" />
            {profile.experience} years in practice
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Traits({ profile }) {
  let { ethnicities, genders, sexualIdentities, religions, rainbowMember, languageServices } =
    profile;

  if (!languageServices.some(({ name }) => name === 'English')) {
    languageServices = [{ name: 'English' }, ...languageServices];
  }

  // Ignore "Not specified" option
  religions = religions.filter((r) => r.code !== 'P');

  let personalTraitsAvailable =
    ethnicities?.length ||
    genders?.length ||
    sexualIdentities?.length ||
    religions?.length ||
    rainbowMember;

  return (
    <div className="grid gap-1 max-md:border-b max-md:border-graphics-30 max-md:px-4 max-md:pb-4 md:mb-6 md:grid-flow-col md:grid-cols-[227px_1fr] md:grid-rows-[auto_auto] md:gap-x-10">
      <div className="flex text-sm">
        <VideoPerson className="mr-1 mt-0.5 flex-none" />
        {formatMeetingType(profile)}
      </div>

      <div className="flex text-sm">
        <Globe className="mr-1 mt-0.5 flex-none" />
        Speaks {languageServices.map((l) => l.name).join(', ')}
      </div>

      <div className="flex text-sm">
        <Info className="mr-1 mt-0.5 flex-none" />
        <DotItem>
          {profile.availability?.afterHoursCrisisServices
            ? 'Emergency number available'
            : 'Emergency number not available'}
        </DotItem>
        <DotItem>{profile?.treatsSuicidalIdeation && 'Treats suicidal ideation'}</DotItem>
      </div>

      {personalTraitsAvailable ? (
        <div className="flex flex-wrap items-start text-sm">
          <Handshake className="mr-1 mt-0.5 flex-none" />

          {ethnicities?.map((item) => (
            <DotItem key={item.id}>{item.name}</DotItem>
          ))}
          {genders?.map((item) => (
            <DotItem key={item.id}>{item.name}</DotItem>
          ))}
          {sexualIdentities?.map((item) => (
            <DotItem key={item.id}>{item.name}</DotItem>
          ))}
          {religions?.map((item) => (
            <DotItem key={item.id}>{item.name}</DotItem>
          ))}
          {rainbowMember ? <DotItem>LGBTQIA+ ally</DotItem> : null}
        </div>
      ) : null}
    </div>
  );
}

function DotItem({ children }) {
  return (
    <span className="inline-flex items-center [&:first-of-type>svg]:hidden">
      <Dot />
      {children}
    </span>
  );
}

function formatMeetingType(profile) {
  let inPerson = profile.inPerson?.available;
  let remote = profile.remote?.available;

  if (inPerson && remote) return 'Remote / In-person';
  if (inPerson) return 'In person only';
  if (remote) return 'Remote';
  return '';
}

function formatUpdatedAt(profile) {
  let { availability, updatedAt } = profile;
  let value = availability?.updated_at > updatedAt ? availability.updated_at : updatedAt;
  let days = differenceInDays(new Date(), new Date(value));

  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days > 30) return `30+ days ago`;
  return `${days} days ago`;
}

function Dot() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="8" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

General.propTypes = {
  profile: PropTypes.object.isRequired,
};
Traits.propTypes = {
  profile: PropTypes.object.isRequired,
};
DotItem.propTypes = {
  children: PropTypes.node.isRequired,
};
