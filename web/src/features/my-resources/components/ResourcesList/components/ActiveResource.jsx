import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Copy20Regular as Copy,
  DismissCircle20Filled as DismissCircle,
  Checkmark20Filled as Checkmark,
} from '@fluentui/react-icons';
import { Dot } from '@/core/components';
import {
  AvailabilityBadge,
  ProfileLanguages,
  ProviderServiceLocation,
  ResultCard,
  UpdatedWithinDays,
} from '@/modules/provider/components';
import { Can } from '@/modules/ability/components';
import { useProviderSubject } from '@/modules/auth/hooks';
import { TeamNotesAction } from '@/features/team-notes/components';
import { formatPhoneNumber, noop } from '@/core/utils';
import { getLastUpdatedAt } from '@/modules/provider/utils';

export default function ActiveResource({ provider, onRemove, onNotesSave }) {
  const {
    id,
    legalName,
    languageServices,
    photoUrl,
    description,
    tagLine,
    active,
    availability,
    mobile,
    email,
    notesCount,
    slug,
    updatedAt,
  } = provider;
  const providerSubject = useProviderSubject();
  const lastUpdatedAt = getLastUpdatedAt(updatedAt, availability);

  return (
    <ResultCard
      id={id}
      renderHeader={() => (
        <>
          <ProviderServiceLocation className="mr-2" provider={provider} />
          {languageServices.length > 0 && <ProfileLanguages languageServices={languageServices} />}
        </>
      )}
      name={legalName}
      photo={{
        src: photoUrl,
        alt: 'Search Result Profile Picture',
      }}
      providerLink={`/provider/${slug}`}
      description={tagLine || description}
      deactivated={!active}
      renderDetails={() => (
        <span className="flex flex-wrap items-center gap-y-2 text-sm">
          {availability && (
            <AvailabilityBadge
              className="mr-4"
              status={availability.status}
              deactivated={!active}
            />
          )}

          <UpdatedWithinDays updatedAt={lastUpdatedAt} />

          {mobile ? (
            <span className="inline-flex items-center">
              <Dot />
              {formatPhoneNumber(mobile)}
            </span>
          ) : null}

          {email ? (
            <span className="inline-flex items-center">
              <Dot />
              {email}
              <EmailButton email={email} className="ml-1 !p-0 text-p-100" />
            </span>
          ) : null}
        </span>
      )}
      renderActions={() => {
        let hasNotes = notesCount > 0;
        return (
          <>
            <TeamNotesAction
              onChange={onNotesSave}
              providerId={id}
              hasNotes={hasNotes}
              label={hasNotes ? 'See team notes' : 'Add team note'}
            />
            <Can I="delete" a={providerSubject}>
              <button className="mir-button text" onClick={onRemove}>
                <DismissCircle />
                <span>Remove</span>
              </button>
            </Can>
          </>
        );
      }}
    />
  );
}

function EmailButton({ email, className }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      let timeout = setTimeout(() => setCopied(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  async function copyEmail(event) {
    event.stopPropagation();
    await navigator.clipboard.writeText(email);
    setCopied(true);
  }

  return (
    <button className={className} onClick={copyEmail}>
      {copied ? <Checkmark /> : <Copy />}
    </button>
  );
}

ActiveResource.propTypes = {
  provider: PropTypes.shape().isRequired,
  onRemove: PropTypes.func,
  onNotesSave: PropTypes.func,
};

ActiveResource.defaultProps = {
  onRemove: noop,
  onNotesSave: noop,
};
