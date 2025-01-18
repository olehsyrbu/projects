import cn from 'classnames';
import { Heart24Regular as Heart, Heart24Filled as HeartFilled } from '@fluentui/react-icons';
import { useFlag } from '@/core/feature-split';
import { useReferralList, useShowReferralListView } from '@/modules/referral-list/hooks';
import { useOrganization } from '@/modules/organization';
import { TeamNotesAction } from '@/features/team-notes/components';
import { PersonCard } from './PersonCard';
import { ProgramCard } from './ProgramCard';

export function ProviderCard({ provider, hovered, onNoteChange, ...rest }) {
  let isRefListEnabled = useShowReferralListView();
  let referralList = useReferralList();
  let selected = referralList.providers.some((p) => p.id === provider.id);
  let toggle = () => referralList.addProvider(provider);

  let promotion = usePromotion(provider);
  let promotionStyle = {
    borderColor: promotion?.borderColor,
    backgroundColor: promotion?.backgroundColor,
  };

  return (
    <article
      {...rest}
      className={cn(
        'relative flex cursor-pointer bg-white p-4 pt-3 max-md:w-screen md:rounded-2xl md:border md:pl-[4.75rem] md:shadow-[0_12px_20px_rgba(0,0,0,0.05)]',
        { '!border-p-100': hovered },
      )}
      style={promotion ? promotionStyle : null}
    >
      {provider.mode === 'PROGRAM' ? (
        <ProgramCard program={provider} />
      ) : (
        <PersonCard profile={provider} promotion={promotion} />
      )}

      {provider.mode === 'PERSON' ? (
        <div className="-mr-2 -mt-2 flex-none">
          {isRefListEnabled ? <Favorite className="" active={selected} onClick={toggle} /> : null}

          <TeamNotesAction
            className="block"
            onChange={onNoteChange}
            hasNotes={provider.notesCount > 0}
            providerId={provider.id}
          />
        </div>
      ) : null}

      {provider.distance ? (
        <span className="absolute bottom-4 right-4 text-xs">
          {Math.round(provider.distance)} mi
        </span>
      ) : null}
    </article>
  );
}

function Favorite({ active, onClick, className }) {
  return (
    <button
      className={cn('block p-2 text-[#cc482b]', className)}
      onClick={onClick}
      aria-label="Favorite"
    >
      {active ? <HeartFilled /> : <Heart />}
    </button>
  );
}

function usePromotion(provider) {
  let promotion = useFlag('provider-promotion-v2');
  let organization = useOrganization();

  let hasPromotion =
    !organization &&
    provider.organizations.some((organization) => organization.subdomain === promotion?.subdomain);

  return hasPromotion ? promotion : null;
}
