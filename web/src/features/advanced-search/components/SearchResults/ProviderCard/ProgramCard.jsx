import cn from 'classnames';
import { useScreen } from '@/core/hooks';
import {
  PeopleCommunity16Regular as PeopleCommunity,
  CalendarLtr16Regular as CalendarLtr,
} from '@fluentui/react-icons';
import { Avatar } from '@/core/components';
import { Availability } from '@/modules/provider/components';
import { AmenitiesIcons, getSpecialAmenities } from '@/modules/program';
import { formatAdmission } from '@/modules/program/utils';
import { Trait } from './Trait';
import { Dot } from './Dot';

export function ProgramCard({ program }) {
  let isMdScreen = useScreen('md');
  let { inPerson, locations, admission } = program;

  return (
    <div className="min-w-0 flex-1">
      <div className="mb-2 flex flex-wrap justify-between gap-y-1">
        <div className="flex items-center">
          <span className="text-xs font-light">{formatMeetingType(program)}</span>
          {inPerson?.available && locations[0]?.amenities.length > 0 && (
            <>
              <Dot />
              <Amenities amenities={locations[0].amenities} />
            </>
          )}
        </div>
        {isMdScreen && admission ? (
          <span className="text-xs text-n-120">Admission: {formatAdmission(admission)}</span>
        ) : null}
      </div>

      <div className="relative flex items-center max-md:space-x-3">
        <Avatar url={program.photoUrl} className="-left-12 top-0 md:absolute md:-ml-3" />
        <span className="text-xl font-bold">{program.name}</span>
      </div>

      <p className="mt-2 text-base">{program.tagLine}</p>

      <div
        className={cn('mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 md:mt-3', {
          'pr-10': program.distance,
        })}
      >
        <Availability status={program.availability?.status} className="-ml-2 text-xs font-normal" />

        {!isMdScreen && admission ? (
          <Trait Icon={CalendarLtr}>Admission: {formatAdmission(admission)}</Trait>
        ) : null}

        <Eligibility program={program} />
      </div>
    </div>
  );
}

function formatMeetingType(program) {
  let inPerson = program?.inPerson?.available;
  let remote = program?.remote?.available;

  if (inPerson && remote) return 'Remote / In-person';
  if (inPerson) return 'In person only';
  if (remote) return 'Remote only';
  return '';
}

function Amenities({ amenities }) {
  let data = getSpecialAmenities();

  let map = Object.fromEntries(amenities.map((a) => [a.category, a.code]));
  let allowed = data.filter((d) => d.prohibitCode !== map[d.category]);
  let prohibited = data.filter((d) => d.prohibitCode === map[d.category]);

  return (
    <div className="flex space-x-1 md:space-x-4">
      {allowed.length > 0 && (
        <div className="flex items-center">
          <span className="mr-1 hidden text-xs text-hint md:inline">Allowed:</span>
          <span className="inline-flex space-x-1">
            {allowed.map((item) => (
              <AmenitiesIcons
                key={item.category}
                className="text-variant-100"
                category={item.category}
              />
            ))}
          </span>
        </div>
      )}
      {prohibited.length > 0 && (
        <div className="flex items-center">
          <span className="mr-1 hidden text-xs text-hint md:inline">Prohibited:</span>
          <span className="inline-flex space-x-1">
            {prohibited.map((item) => (
              <AmenitiesIcons
                key={item.category}
                className="text-error-1"
                category={item.category}
              />
            ))}
          </span>
        </div>
      )}
    </div>
  );
}

function Eligibility({ program }) {
  let ages = program.ageGroups
    .slice()
    .sort((g1, g2) => g1.ageStart - g2.ageStart)
    .reduce((acc, { ageStart, ageEnd }) => {
      let last = acc.at(-1);
      return last?.ageEnd + 1 === ageStart
        ? acc.slice(0, -1).concat({ ...last, ageEnd })
        : acc.concat({ ageStart, ageEnd });
    }, [])
    .map(({ ageStart, ageEnd }) =>
      ageEnd > 100 ? `${ageStart}+` : `${ageStart}\u2013\u2060${ageEnd}`,
    )
    .join(', ');

  return (
    <div className="flex flex-wrap gap-y-2">
      <Trait Icon={PeopleCommunity}>Eligible: ages {ages}</Trait>

      {program.treatsMedicallyUnstable && (
        <Trait Icon={Dot} gap={false}>
          medically unstable
        </Trait>
      )}
      {program.treatsSuicidalIdeation && (
        <Trait Icon={Dot} gap={false}>
          actively suicidal
        </Trait>
      )}
      {program.canAssistWithDailyLiving && (
        <Trait Icon={Dot} gap={false}>
          help with daily activities
        </Trait>
      )}
    </div>
  );
}
