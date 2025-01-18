import { capitalize } from 'lodash-es';
import cn from 'classnames';
import PropTypes from 'prop-types';
import {
  PeopleCommunity16Regular as PeopleCommunity,
  CalendarLtr16Regular as CalendarLtr,
  Payment16Regular as Payment,
  Handshake16Filled as Handshake,
} from '@fluentui/react-icons';
import { Button, Tooltip, TooltipTrigger } from 'react-aria-components';
import { Avatar } from '@/core/components';
import { Availability } from '@/modules/provider/components';
import { Trait } from './Trait';
import { Dot } from './Dot';

export function PersonCard({ profile, promotion }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex justify-between">
        <SettingAndLanguage profile={profile} />
        {promotion ? <PromotionBanner name={promotion.organizationName} /> : null}
      </div>

      <div className="relative flex items-center max-md:space-x-3">
        <Avatar url={profile.photoUrl} className="-left-12 top-0 md:absolute md:-ml-3" />
        <h3 className="text-xl font-bold">{profile.legalName}</h3>
      </div>

      {profile.tagLine ? <p className="mt-2">{profile.tagLine}</p> : null}

      <div
        className={cn('mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 md:mt-3', {
          'pr-10': profile.distance,
        })}
      >
        <Availability status={profile.availability?.status} className="-ml-2 text-xs font-normal" />

        {profile.ageGroups?.length ? (
          <Trait Icon={PeopleCommunity}>{formatAges(profile.ageGroups)}</Trait>
        ) : null}

        {profile.availability?.hours?.length ? (
          <Trait Icon={CalendarLtr}>{formatSchedule(profile.availability.hours)}</Trait>
        ) : null}

        <div className="flex flex-wrap gap-y-2">
          {profile.paymentOptions?.map((option, index) => (
            <Trait Icon={index === 0 ? Payment : Dot} gap={index === 0}>
              {option.name}
            </Trait>
          ))}
        </div>
      </div>
    </div>
  );
}
PersonCard.propTypes = {
  profile: PropTypes.shape({
    photoUrl: PropTypes.string,
    legalName: PropTypes.string,
    tagLine: PropTypes.string,
    distance: PropTypes.string,
    ageGroups: PropTypes.array,
    paymentOptions: PropTypes.array,
    availability: PropTypes.shape({
      status: PropTypes.string,
      hours: PropTypes.string,
    }),
  }),
  promotion: PropTypes.shape({
    organizationName: PropTypes.string,
  }),
};

function SettingAndLanguage({ profile }) {
  let hasSetting = profile.inPerson?.available || profile.remote?.available;
  let { languageServices } = profile;

  if (!languageServices.some(({ name }) => name === 'English')) {
    languageServices = [{ name: 'English' }, ...languageServices];
  }

  return hasSetting ? (
    <div className="mb-2 flex items-center text-xs text-n-120">
      {hasSetting ? <span className="flex-none">{formatSetting(profile)}</span> : null}

      {hasSetting ? <Dot className="flex-none" /> : null}

      <span className="flex-1 truncate">{formatLanguages(languageServices)}</span>
    </div>
  ) : null;
}

function PromotionBanner({ name }) {
  return (
    <TooltipTrigger delay={200} closeDelay={100}>
      <Button className="inline-flex items-center text-xs font-medium text-p-100">
        <Handshake className="mr-1" />
        with {name}
      </Button>
      <Tooltip
        placement="bottom"
        className="max-w-[310px] rounded-lg bg-white p-2.5 text-sm shadow-[0_4px_10px_rgba(0,0,0,0.18)]"
      >
        MiResource partners with evidence-based organizations to bring you more care options.
      </Tooltip>
    </TooltipTrigger>
  );
}

PromotionBanner.propTypes = {
  name: PropTypes.string,
};

function formatSetting(profile) {
  let inPerson = profile.inPerson?.available;
  let remote = profile.remote?.available;

  if (inPerson && remote) return 'Remote or in-person';
  if (inPerson) return 'In-person only';
  if (remote) return 'Remote only';
  return null;
}

function formatLanguages(languages) {
  let priority = { ENG: 0, ESP: 1, MAND: 2 };
  let defaultPriority = 9;

  let sorted = languages
    .slice()
    .sort((lang1, lang2) => {
      let lang1Priority = priority[lang1.code] ?? defaultPriority;
      let lang2Priority = priority[lang2.code] ?? defaultPriority;
      return lang1Priority - lang2Priority;
    })
    .map((lang) => lang.name);

  return sorted.length > 2
    ? `Speaks ${sorted.slice(0, 2).join(', ')}, +${sorted.length - 2}`
    : `Speaks ${sorted.join(', ')}`;
}

function formatAges(ageGroups) {
  if (ageGroups.length === 6) return 'All ages';

  let sorted = ageGroups.slice().sort((g1, g2) => g1.order - g2.order);
  return sorted.map((group) => group.description).join(', ');
}

let days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

function formatSchedule(schedule) {
  let set = new Set(schedule.map((entry) => entry.day));
  let sorted = days.filter((day) => set.has(day));
  return `Works ${sorted.map((day) => capitalize(day.slice(0, 3))).join(', ')}`;
}
