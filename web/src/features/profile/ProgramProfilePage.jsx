import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  CalendarLtr16Filled as CalendarLtr,
  Info16Filled as Info,
  VideoPerson16Filled as VideoPerson,
  Globe16Filled as Globe,
} from '@fluentui/react-icons';
import { useProgramBySlug } from '@/core/api/ProgramQueries';
import { useOrganization, useOrganizationTheme, OrganizationTypes } from '@/modules/organization';
import { Header } from '@/modules/app-shell';
import Footer from '@/modules/app-shell/Footer';
import { SubFooter } from '@/modules/app-shell/Footer/SubFooter';
import { Availability } from '@/modules/provider/components';
import { formatAdmission } from '@/modules/program/utils';
import { useSearchUrlParams } from '@/modules/search/hooks';

import { useTrackPageVisit } from './useTrackPageVisit';
import { sortProfileFields } from './sortProfileFields';
import { TagLine, Description, Navigation, AnchorLink } from './components';
import { Eligibility } from './sections/Eligibility';
import { Location, Remote } from './sections/Location';
import { Payment } from './sections/Payment';
import { Treatments } from './sections/Treatments';
import { Credentials } from './sections/Credentials';
import { Schedule } from './sections/Schedule';
import { Other } from './sections/Other';
import { ContactPanel } from './sections/ContactPanel';
import { Avatar } from '@/core/components';
import { filterInactiveEntities } from '@/core/api/utils';

export default function ProgramProfilePage() {
  let { slug } = useParams();
  let organization = useOrganization();
  let searchParams = useSearchUrlParams();

  let program = useProgramBySlug(slug, organization?.subdomain);
  program = filterInactiveEntities(program);
  program = sortProfileFields(organization, program, searchParams);

  useOrganizationTheme({
    enableFor: [OrganizationTypes.Insurance],
  });

  useTrackPageVisit(program);

  // TODO: remove this after MIR-4459 is implemented
  let navigate = useNavigate();
  useEffect(() => {
    navigate({ search: '' }, { replace: true });
  }, []);

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto_auto]">
      <Header />

      <main className="grid w-screen break-words md:grid-cols-[700px] md:justify-center md:pt-9 lg:grid-cols-[700px_260px] lg:gap-x-16">
        <General profile={program} />

        <TagLine>{program.tagLine}</TagLine>

        {program.description ? <Description>{program.description}</Description> : null}

        <Traits profile={program} />

        <ContactPanel profile={program} />

        <Navigation>
          <AnchorLink href="#eligibility">Eligibility</AnchorLink>
          <AnchorLink href="#location">Location</AnchorLink>
          <AnchorLink href="#remote">Remote</AnchorLink>
          <AnchorLink href="#schedule">Schedule</AnchorLink>
          <AnchorLink href="#payment">Payment</AnchorLink>
          <AnchorLink href="#treatments">Treatments</AnchorLink>
          <AnchorLink href="#credentials">Credentials</AnchorLink>
          <AnchorLink href="#other">Other</AnchorLink>
        </Navigation>

        <div className="min-w-0 divide-y divide-light">
          <Eligibility profile={program} anchorId="eligibility" />
          <Location profile={program} anchorId="location" />
          <Remote profile={program} anchorId="remote" />
          <Schedule profile={program} anchorId="schedule" />
          <Payment profile={program} anchorId="payment" />
          <Treatments profile={program} anchorId="treatments" />
          <Credentials profile={program} anchorId="credentials" />
          <Other profile={program} anchorId="other" />
        </div>
      </main>
      <SubFooter />
      <Footer />
    </div>
  );
}

function General({ profile }) {
  return (
    <div className="mb-4 grid grid-flow-dense grid-cols-[1fr_auto] items-center gap-4 max-md:px-4 md:grid-cols-[auto_1fr] md:grid-rows-[1fr_auto_auto_1fr] md:gap-x-6 md:gap-y-0">
      <Avatar
        url={profile.photoUrl}
        className="col-[2/3] size-20 md:col-[1/2] md:row-[1/5]  md:size-[6.25rem]"
      />

      <h1 className="font-sans text-xl font-bold md:row-[2/3] md:mb-2 md:font-serif md:text-3xl">
        {profile.name}
      </h1>

      <div className="flex flex-wrap items-start gap-2 max-md:col-[1/3] max-md:flex-col md:row-[3/3]">
        <Availability status={profile.availability?.status} className="-ml-2" />

        {profile.admission ? (
          <p className="flex items-center text-sm font-medium">
            <CalendarLtr className="mr-1 flex-none" />
            Admission: {formatAdmission(profile.admission)}
          </p>
        ) : null}

        {profile.programType ? (
          <p className="flex items-center text-sm font-medium">
            <Info className="mr-1 flex-none" />
            {profile.programType.name}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Traits({ profile }) {
  return (
    <div className="flex flex-wrap gap-2 max-md:flex-col max-md:border-b max-md:border-graphics-30 max-md:px-4 max-md:pb-4 md:mb-6 md:gap-x-10">
      <div className="flex text-sm">
        <VideoPerson className="mr-1 mt-0.5 flex-none" />
        {formatMeetingType(profile)}
      </div>

      {profile.languageServices?.length > 0 ? (
        <div className="flex text-sm">
          <Globe className="mr-1 mt-0.5 flex-none" />
          Language: {profile.languageServices.map((l) => l.name).join(', ')}
        </div>
      ) : null}

      <div className="flex text-sm">
        <Info className="mr-1 mt-0.5 flex-none" />
        by {profile.center}
      </div>
    </div>
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

General.propTypes = {
  profile: PropTypes.object.isRequired,
};
Traits.propTypes = {
  profile: PropTypes.object.isRequired,
};
