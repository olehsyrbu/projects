import { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {
  NoteAdd20Filled as NoteAdd,
  DismissCircle16Filled as DismissCircle,
} from '@fluentui/react-icons';
import { CardDetails, ResultCard } from '@/modules/provider/components';
import { useScreen } from '@/core/hooks';
import ReferralListDialogNote from './ReferralListDialogNote';

function ReferralListCard({ onOpen, card, onRemoveCard, onEditNote, studentMode = false }) {
  const {
    id,
    slug,
    email,
    providerTypes,
    mobile,
    legalName,
    photoUrl,
    availability,
    note,
    preferredContacts,
    updatedAt,
    status,
  } = card;

  const [showDialog, setShowDialog] = useState(false);

  const handleOpenProfile = () => {
    onOpen && onOpen({ slug, status });
  };

  const handleRemoveCardReferralList = (e) => {
    e.stopPropagation();
    onRemoveCard(id);
  };

  const handleOpenModal = (e) => {
    e.stopPropagation();
    setShowDialog(!showDialog);
  };

  const handleAddNote = (note) => {
    onEditNote({ note, id });
    setShowDialog(!showDialog);
  };

  const handleCloseNoteDialog = () => {
    setShowDialog(false);
  };

  const btnNoteText = note ? 'Edit note' : 'Add note';
  const primaryText = note ? 'Save note' : 'Add note';
  const isMediumScreen = useScreen('md');

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
    <li key={id}>
      {showDialog && (
        <ReferralListDialogNote
          note={note}
          title={btnNoteText}
          primaryText={primaryText}
          onClose={handleCloseNoteDialog}
          onSave={handleAddNote}
        />
      )}
      <ResultCard
        key={id}
        id={id}
        photo={{
          src: photoUrl,
          alt: 'Search Result Profile Picture',
        }}
        providerLink={`/provider/${slug}`}
        onAvatarClick={handleOpenProfile}
        name={legalName}
        description={providerTypeNames}
        renderDetails={() => (
          <CardDetails
            email={email}
            mobile={mobile}
            note={note}
            preferredContacts={preferredContacts}
            availability={availability}
            updatedAt={updatedAt}
          />
        )}
        renderActions={
          !studentMode
            ? () => (
                <div className={actionsCN}>
                  <button className="mir-button light" onClick={handleOpenModal} type="button">
                    <NoteAdd />
                    <div className="text">{btnNoteText}</div>
                  </button>
                  <button
                    className="mir-button light"
                    onClick={handleRemoveCardReferralList}
                    type="button"
                  >
                    <DismissCircle />
                    <div className="text">Remove</div>
                  </button>
                </div>
              )
            : null
        }
      />
    </li>
  );
}

ReferralListCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string,
    status: PropTypes.string,
    providerTypes: PropTypes.array,
    mobile: PropTypes.string,
    legalName: PropTypes.string,
    photoUrl: PropTypes.string,
    availability: PropTypes.shape({
      status: PropTypes.string,
    }),
    updatedAt: PropTypes.string,
    note: PropTypes.string,
    slug: PropTypes.string,
    preferredContacts: PropTypes.array,
  }),
  onOpen: PropTypes.func,
  onEditNote: PropTypes.func,
  onRemoveCard: PropTypes.func,
  studentMode: PropTypes.bool,
};

export default ReferralListCard;
