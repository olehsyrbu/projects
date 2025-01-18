import PropTypes from 'prop-types';
import cn from 'classnames';
import {
  CheckmarkCircle16Filled as CheckmarkCircle,
  QuestionCircle16Filled as QuestionCircle,
  DismissCircle16Filled as DismissCircle,
  PeopleCommunity16Regular as PeopleCommunity,
  CalendarLtr16Regular as CalendarLtr,
  Payment16Regular as PaymentCard,
} from '@fluentui/react-icons';
import { AmenitiesIcons, getSpecialAmenities } from '@/modules/program';
import { formatAdmission } from '@/modules/program/utils';
import { ProfileLanguages } from '@/modules/provider';
import { capitalize } from 'lodash-es';
import { useMemo } from 'react';
import { getDays } from './getDays';

export function ProfileMapCard({ profile, ...rest }) {
  let {
    availability,
    inPerson,
    locations,
    admission,
    distance,
    languageServices,
    mode,
    name,
    legalFirstName,
    legalLastName,
    paymentOptions,
    ageGroups,
  } = profile;

  const isPersonMode = mode === 'PERSON';
  const profileName = isPersonMode ? `${legalFirstName} ${legalLastName}` : name;

  return (
    <article
      {...rest}
      className="relative cursor-pointer space-y-2 rounded-2xl bg-white p-4 ring-0 ring-inset ring-p-100 md:hover:ring-1"
    >
      <div className="flex flex-wrap justify-between gap-y-1">
        <div className="flex items-center">
          <LocationType profile={profile} />
          {isPersonMode && languageServices.length > 0 && (
            <>
              <Dot />
              <ProfileLanguages languageServices={languageServices} />
            </>
          )}
          {inPerson?.available && locations[0]?.amenities.length > 0 && (
            <>
              <Dot />
              <Amenities amenities={locations[0].amenities} />
            </>
          )}
        </div>
      </div>

      <p className="text-xl font-bold">{profileName}</p>

      <div className={cn('flex flex-wrap gap-x-4 gap-y-1', { 'pr-10': Boolean(distance) })}>
        <Availability availability={availability?.status} />
        {isPersonMode ? (
          <>
            <Schedule hours={availability?.hours} />
            <ProviderAgeGroups ageGroups={ageGroups} />
            <Payment paymentOptions={paymentOptions} />
          </>
        ) : (
          <>
            {admission && <Admission admission={admission} />}
            <Eligibility program={profile} />
          </>
        )}
      </div>

      {distance && (
        <div className="absolute bottom-4 right-4 text-xs">{Math.round(distance)} mi</div>
      )}
    </article>
  );
}

function LocationType({ profile }) {
  let { inPerson, remote, locations } = profile;
  let content = '';

  if (inPerson?.available && locations.length > 0) {
    content = 'In-person only';
  } else if (remote?.available) {
    content = 'Remote only';
  }

  return <span className="text-xs font-light">{content}</span>;
}

function Amenities({ amenities }) {
  let data = getSpecialAmenities();

  let map = Object.fromEntries(amenities.map((a) => [a.category, a.code]));
  let allowed = data.filter((d) => d.prohibitCode !== map[d.category]);
  let prohibited = data.filter((d) => d.prohibitCode === map[d.category]);

  return (
    <div className="flex">
      {allowed.map((item) => (
        <AmenitiesIcons key={item.category} className="text-variant-100" category={item.category} />
      ))}
      {prohibited.map((item) => (
        <AmenitiesIcons key={item.category} className="text-error-1" category={item.category} />
      ))}
    </div>
  );
}

function Admission({ admission }) {
  return (
    <span className="inline-flex items-center text-xs font-light">
      <CalendarLtr className="mr-1 text-graphics-100" />
      Admission: {formatAdmission(admission)}
    </span>
  );
}

function Availability({ availability }) {
  let Icon = QuestionCircle;
  let text = 'Please inquire';
  let color = 'text-graphics-100';

  if (availability === 'ACCEPTING_NEW_CLIENTS') {
    Icon = CheckmarkCircle;
    text = 'Accepting clients';
    color = 'text-variant-100';
  }

  if (availability === 'NOT_ACCEPTING_NEW_CLIENTS') {
    Icon = DismissCircle;
    text = 'Not accepting clients';
  }

  return (
    <div className="inline-flex items-center text-xs font-light">
      <Icon className={`mr-1 ${color}`} />
      {text}
    </div>
  );
}

function Eligibility({ program }) {
  let minAge = Math.min(...program.ageGroups.map((g) => g.ageStart));
  let maxAge = Math.max(...program.ageGroups.map((g) => g.ageEnd));

  return (
    <div className="inline-flex flex-wrap text-xs font-light">
      <span className="inline-flex items-center">
        <PeopleCommunity className="mr-1 text-graphics-100" />
        Eligible: ages {minAge}–{maxAge}
      </span>

      {program.treatsMedicallyUnstable && (
        <span className="whitespace-nowrap">
          <Dot />
          medically unstable
        </span>
      )}
      {program.treatsSuicidalIdeation && (
        <span className="whitespace-nowrap">
          <Dot />
          actively suicidal
        </span>
      )}
      {program.canAssistWithDailyLiving && (
        <span className="whitespace-nowrap">
          <Dot />
          help with daily activities
        </span>
      )}
    </div>
  );
}

function Dot() {
  return <span className="mx-2 text-xs">•</span>;
}

function Schedule({ hours }) {
  return (
    hours?.length > 0 && (
      <span className="inline-flex items-center text-xs font-light">
        <CalendarLtr className="mr-1 text-graphics-100" />
        Works{' '}
        <span className="mir-list-commas">
          {getDays(hours).map((day) => (
            <span key={day}>{capitalize(day.slice(0, 3))}</span>
          ))}
        </span>
      </span>
    )
  );
}

function Payment({ paymentOptions }) {
  const updatedPaymentOptions = useMemo(
    () => [
      ...new Set(
        paymentOptions.map((item) =>
          ['outofnetwork', 'infooutofnetwork'].includes(item.code) ? 'Out-of-network' : item.name,
        ),
      ),
    ],
    [paymentOptions],
  );
  return (
    <span className="items-center text-xs font-light">
      <PaymentCard className="mr-1 text-graphics-100" />
      <span className="mir-list-commas">
        {updatedPaymentOptions?.map((name, index) => (
          <span key={index}>{name}</span>
        ))}
      </span>
    </span>
  );
}

function ProviderAgeGroups({ ageGroups }) {
  return (
    <div className="inline-flex flex-wrap text-xs font-light">
      <span className="inline-flex items-center">
        <PeopleCommunity className="mr-1 text-graphics-100" />
        {ageGroups.length === 6 ? (
          <span>All ages</span>
        ) : (
          <span className="mir-list-commas">
            {ageGroups?.map(({ description }) => (
              <span key={description}>{description}</span>
            ))}
          </span>
        )}
      </span>
    </div>
  );
}

let providerPropTypes = PropTypes.shape({
  name: PropTypes.string.isRequired,
  photoUrl: PropTypes.string.isRequired,
  tagLine: PropTypes.string.isRequired,
  availability: PropTypes.shape.isRequired,
  inPerson: PropTypes.shape({
    available: PropTypes.bool.isRequired,
  }),
  remote: PropTypes.shape({
    available: PropTypes.bool.isRequired,
  }),
  locations: PropTypes.array.isRequired,
  admission: PropTypes.object,
  distance: PropTypes.number,
  treatsMedicallyUnstable: PropTypes.bool.isRequired,
  treatsSuicidalIdeation: PropTypes.bool.isRequired,
  canAssistWithDailyLiving: PropTypes.bool.isRequired,
  ageGroups: PropTypes.array,
  languageServices: PropTypes.array,
  mode: PropTypes.string,
  legalFirstName: PropTypes.string,
  legalLastName: PropTypes.string,
  paymentOptions: PropTypes.array,
});

ProfileMapCard.propTypes = {
  profile: providerPropTypes.isRequired,
};

Eligibility.propTypes = {
  program: providerPropTypes.isRequired,
};

LocationType.propTypes = {
  profile: providerPropTypes.isRequired,
};

Amenities.propTypes = {
  amenities: PropTypes.array,
};

Availability.propTypes = {
  availability: PropTypes.string,
};

Admission.propTypes = {
  admission: PropTypes.shape().isRequired,
  showIcon: PropTypes.bool,
};

Schedule.propTypes = {
  hours: PropTypes.array,
};

Payment.propTypes = {
  paymentOptions: PropTypes.array,
};

ProviderAgeGroups.propTypes = {
  ageGroups: PropTypes.array,
};
