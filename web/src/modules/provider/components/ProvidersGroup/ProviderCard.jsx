import PropTypes from 'prop-types';
import cn from 'classnames';
import {
  Edit20Filled as Edit,
  LinkDismiss24Filled as LinkDismiss,
  Pause20Filled as Pause,
  Play20Filled as Play,
  ShareAndroid20Filled as ShareAndroid,
} from '@fluentui/react-icons';
import { CardDetails, ResultCard } from '@/modules/provider/components';
import { useScreen } from '@/core/hooks';
import { useFlag } from '@/core/feature-split';
import { Button } from 'react-aria-components';

export function ProviderCard({
  onOpen,
  card,
  onEdit,
  onDeactivate,
  onSharedAccess,
  onActivate,
  onDeleteAccess,
}) {
  const {
    id,
    slug,
    photoUrl,
    providerTypes,
    mobile,
    legalName,
    note,
    preferredContacts,
    availability,
    active,
    updatedAt,
    sharedWith,
  } = card;
  const isMediumScreen = useScreen('md');
  const shouldEnableShareAccess = useFlag('profile-share-access-initial') && sharedWith;
  const handleOpenProfile = () => {
    onOpen && onOpen({ slug });
  };

  const handleDeactivate = (e) => {
    e.stopPropagation();
    onDeactivate(card);
  };

  const handleReactivate = (e) => {
    e.stopPropagation();
    onActivate(id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(id);
  };

  const handleSharedAccess = (e) => {
    e.stopPropagation();
    onSharedAccess(card);
  };

  const handleDeleteAccess = (e) => {
    e.stopPropagation();
    onDeleteAccess(id);
  };

  const detailsCN = cn('flex w-full', { 'flex-col': !isMediumScreen });

  const actionsCN = cn('row-align-center !mt-0 !pt-2 box-shadow-top', {
    'ml-auto': isMediumScreen,
  });

  let providerTypeNames = providerTypes
    .map(({ providerType }) => providerType.name)
    .sort((n1, n2) => {
      if (n1 === 'Other') return 1;
      return n2 === 'Other' ? -1 : 0;
    })
    .join(', ');

  return (
    <>
      <li key={id}>
        <ResultCard
          key={id}
          id={id}
          providerLink={`/provider/${slug}`}
          onOpenProvider={handleOpenProfile}
          photo={{
            src: photoUrl,
            alt: 'Search Result Profile Picture',
          }}
          name={legalName}
          description={providerTypeNames}
          deactivated={!active}
          renderDetails={() => (
            <CardDetails
              mobile={mobile}
              note={note}
              preferredContacts={preferredContacts}
              availability={availability}
              deactivated={!active}
              updatedAt={updatedAt}
            />
          )}
          renderActions={() => (
            <div className={actionsCN}>
              {shouldEnableShareAccess && (
                <button className="mir-button text" onClick={handleSharedAccess} type="button">
                  <ShareAndroid />
                  <div className="text ml-1">Share</div>
                </button>
              )}
              {sharedWith && (
                <button
                  className="mir-button text"
                  onClick={active ? handleDeactivate : handleReactivate}
                  type="button"
                >
                  {active ? <Pause /> : <Play />}
                  <div className="text ml-1">{active ? 'Deactivate' : 'Reactivate'}</div>
                </button>
              )}
              <button className="mir-button text" onClick={handleEdit} type="button">
                <Edit />
                <div className="text ml-1">Edit</div>
              </button>
              {!sharedWith && (
                <button
                  aria-label="Remove"
                  className="mir-button text"
                  type="button"
                  onClick={handleDeleteAccess}
                >
                  <LinkDismiss />
                  <div className="text ml-1">Remove</div>
                </button>
              )}
            </div>
          )}
        />
      </li>
    </>
  );
}

ProviderCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string,
    providerTypes: PropTypes.array,
    mobile: PropTypes.string,
    legalName: PropTypes.string,
    photoUrl: PropTypes.string,
    availability: PropTypes.shape({
      status: PropTypes.string,
    }),
    note: PropTypes.string,
    slug: PropTypes.string,
    preferredContacts: PropTypes.array,
    active: PropTypes.bool,
    updatedAt: PropTypes.string,
    gpa: PropTypes.array,
    sharedWith: PropTypes.array,
  }),
  onOpen: PropTypes.func,
  onDeactivate: PropTypes.func,
  onEdit: PropTypes.func,
  onSharedAccess: PropTypes.func,
  onActivate: PropTypes.func,
  onDeleteAccess: PropTypes.func,
};
