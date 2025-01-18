import cn from 'classnames';
import format from 'date-fns/format';
import PropTypes from 'prop-types';
import {
  PersonClock16Regular as PersonClock,
  Drafts16Filled as Drafts,
  Checkmark16Filled as Checkmark,
  Pause12Filled as Pause,
  PersonBoard16Filled as PersonBoard,
  MoreVertical24Filled as MoreVertical,
  Notepad24Filled as Notepad,
} from '@fluentui/react-icons';

import { useAuthContext } from '@/modules/auth';
import { Menu, MenuItem, MenuTrigger, Button, Separator } from '@/core/components/Menu';
import { Dot, LinkAvatar } from '@/core/components';
import { formatPhoneNumber } from '@/core/utils';
import { AvailabilityBadge } from '@/modules/provider/components/AvailabilityBadge';
import { UpdatedWithinDays } from '@/modules/provider/components/UpdatedWithinDays';
import { ROLE_NAMES } from '@/core/definitions';
import { getLastUpdatedAt } from '@/modules/provider/utils';

function getProfileStatus(profile) {
  const { status, active } = profile;

  const completedStatus = status === 'COMPLETED';
  const onboardingStatus = status === 'ONBOARDING';
  const pendingProfile = status === 'PENDING';
  const unclaimedProfile = status === 'UNCLAIMED';
  const deactivatedProfile = status === 'DEACTIVATED' || !active;

  return {
    deactivatedProfile,
    completedStatus,
    onboardingStatus,
    pendingProfile,
    unclaimedProfile,
  };
}

function Trait({ Icon, children, gap = true, className }) {
  return (
    <div className={cn('inline-flex items-center rounded-full  text-xs', className)}>
      <Icon className={cn('mt-px flex-none', { 'mr-1 ': gap })} />
      <span className="font-medium">{children}</span>
    </div>
  );
}

Trait.propTypes = {
  Icon: PropTypes.node,
  children: PropTypes.node,
  gap: PropTypes.bool,
  className: PropTypes.string,
};

function ProfileStatus({ profile }) {
  const { unclaimedProfile, onboardingStatus, pendingProfile, deactivatedProfile } =
    getProfileStatus(profile);

  if (unclaimedProfile) {
    return (
      <Trait className="bg-white px-2 py-1" Icon={PersonBoard}>
        Unclaimed
      </Trait>
    );
  }
  if (pendingProfile) {
    return (
      <Trait className="bg-white px-2 py-1" Icon={PersonClock}>
        Pending
      </Trait>
    );
  }
  if (deactivatedProfile) {
    return (
      <Trait className="bg-n-75 px-2 py-1" Icon={Pause}>
        Deactivated
      </Trait>
    );
  }
  if (onboardingStatus) {
    return (
      <Trait className="bg-[#fff8e4] px-2 py-1 text-[#6B3A00]" Icon={Drafts}>
        Onboarding
      </Trait>
    );
  }
  return (
    <Trait className="bg-p-10 px-2 py-1 text-p-140" Icon={Checkmark}>
      Active
    </Trait>
  );
}
ProfileStatus.propTypes = {
  profile: PropTypes.object,
};

function BaseCard({ profile, children }) {
  const { photoUrl, legalName, status, onboardedAt, providerTypes, slug } = profile;

  let providerTypeNames = providerTypes
    .map(({ providerType }) => providerType.name)
    .sort((n1, n2) => {
      if (n1 === 'Other') return 1;
      return n2 === 'Other' ? -1 : 0;
    })
    .join(', ');

  const isEmptyProfile = !children && providerTypeNames.length === 0;

  return (
    <>
      <div
        className={cn('relative flex items-start gap-2', {
          'h-12 !items-center': isEmptyProfile,
        })}
      >
        <LinkAvatar
          className={cn('md:!absolute md:-ml-14', {
            'md:!relative': isEmptyProfile,
          })}
          url={photoUrl}
          linkHref={`/provider/${slug}`}
        />
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xl font-bold">{legalName}</p>
          <ProfileStatus profile={profile} />
          {status === 'COMPLETED' && onboardedAt && (
            <span className="text-xs">joined {format(new Date(onboardedAt), 'MMMM d, yyyy')}</span>
          )}
        </div>
      </div>
      {providerTypeNames && <p className="text-sm">{providerTypeNames}</p>}
      {children && children}
    </>
  );
}

BaseCard.propTypes = {
  children: PropTypes.node,
  profile: PropTypes.shape({
    providerTypes: PropTypes.array,
    photoUrl: PropTypes.string,
    legalName: PropTypes.string,
    status: PropTypes.string,
    active: PropTypes.string,
    invitation: PropTypes.shape({
      status: PropTypes.string,
    }),
    createdAt: PropTypes.string,
    tagLine: PropTypes.string,
    slug: PropTypes.string,
  }),
};
function CardActions({ onProfileAction, profile }) {
  const { user } = useAuthContext();
  const isRoleNetworkManager = user.role === ROLE_NAMES.NETWORK_MANAGER;
  const { completedStatus, pendingProfile, unclaimedProfile } = getProfileStatus(profile);

  return (
    <MenuTrigger>
      <Button className="h-10 w-10 rounded-lg text-p-100 ring-p-100 focus-visible:outline-none focus-visible:ring-2 data-[pressed=true]:border data-[pressed=true]:border-p-40 data-[pressed=true]:bg-p-20 md:ml-12 md:h-12 md:w-12">
        <MoreVertical />
      </Button>
      <Menu className="min-w-[200px]" onAction={onProfileAction}>
        {isRoleNetworkManager && (
          <>
            {(pendingProfile || unclaimedProfile) && <MenuItem id="edit">Edit profile</MenuItem>}

            {pendingProfile && <MenuItem id="copyInvitation">Copy invitation</MenuItem>}

            {unclaimedProfile && <MenuItem id="generateInvite">Generate invite</MenuItem>}

            <MenuItem id="exportProvider">Export provider</MenuItem>

            {(pendingProfile || unclaimedProfile) && (
              <>
                <Separator />
                <MenuItem id="delete" className="!text-error-1">
                  Delete
                </MenuItem>
              </>
            )}

            {completedStatus && (
              <>
                <Separator />
                <MenuItem id="remove" className="!text-error-1">
                  Remove
                </MenuItem>
              </>
            )}
          </>
        )}
      </Menu>
    </MenuTrigger>
  );
}

CardActions.propTypes = {
  profile: PropTypes.object,
  onProfileAction: PropTypes.func,
};

export function Card({ profile, className, onProfileAction, isSelected }) {
  const { deactivatedProfile, pendingProfile, unclaimedProfile } = getProfileStatus(profile);
  const { availability, mobile, email, notesCount, updatedAt } = profile;
  const lastUpdatedAt = getLastUpdatedAt(updatedAt, availability);
  const isShowDetail = lastUpdatedAt || availability || mobile || email;

  return (
    <div
      className={cn(
        'flex border-b border-n-50 bg-white px-2 py-4 md:rounded-2xl md:border md:border-n-50 md:pl-[4.75rem] md:pr-6',
        {
          '!bg-n-20': deactivatedProfile || pendingProfile || unclaimedProfile,
          'ring-2 ring-p-100': isSelected,
        },
        className,
      )}
    >
      <div className="flex-1 space-y-2">
        <BaseCard profile={profile}>
          {isShowDetail ? (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {availability && <AvailabilityBadge status={availability?.status} />}
              {lastUpdatedAt && <UpdatedWithinDays updatedAt={lastUpdatedAt} />}
              {mobile && (
                <Trait className="!text-sm" Icon={Dot}>
                  {formatPhoneNumber(mobile)}
                </Trait>
              )}
              {email && (
                <Trait className="!text-sm" Icon={Dot}>
                  {email}
                </Trait>
              )}
            </div>
          ) : null}
        </BaseCard>
      </div>

      <div className="flex flex-col items-center justify-between text-p-100 md:flex-row-reverse md:justify-end">
        <CardActions profile={profile} onProfileAction={onProfileAction} />
        {notesCount > 0 && <Notepad />}
      </div>
    </div>
  );
}

Card.propTypes = {
  onProfileAction: PropTypes.func,
  isSelected: PropTypes.bool,
  className: PropTypes.string,
  profile: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string,
    onboardedAt: PropTypes.string,
    notesCount: PropTypes.number,
    status: PropTypes.string,
    active: PropTypes.bool,
    tagLine: PropTypes.string,
    providerTypes: PropTypes.array,
    mobile: PropTypes.string,
    legalFirstName: PropTypes.string,
    legalLastName: PropTypes.string,
    photoUrl: PropTypes.string,
    invitation: PropTypes.shape({
      status: PropTypes.string,
    }),
    availability: PropTypes.shape({
      status: PropTypes.string,
      updated_at: PropTypes.string,
    }),
    preferredContacts: PropTypes.array,
    updatedAt: PropTypes.string,
  }),
};
