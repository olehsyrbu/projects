import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { TeamNotesActions, TeamNoteSubject, useTeamNotesSubject } from '@/modules/auth/hooks';
import { Can } from '@/modules/ability/components';
import { Dialog, DialogActions, DialogTitle } from '@/core/components';
import { TeamNotesList } from '../TeamNotesList';
import {
  batchDeleteTeamNotesByIds,
  createTeamNote,
  deleteAllTeamNotesByProviderId,
} from '@/core/api/TeamNotesAPI';
import { noop } from '@/core/utils';
import { TextArea } from '@/core/components/TextArea';
import { useAuthContext } from '@/modules/auth';
import { useMatchMedia } from '@/core/hooks';
import { TeamNoteIcon } from './TeamNoteIcon';
import styles from './TeamNotesAction.module.css';

export function TeamNotesAction({
  label,
  providerId,
  initDialog,
  hasNotes,
  doDelete,
  doCreate,
  maxLength,
  doDeleteAll,
  onChange,
  shouldEnableDeleteAll,
  className,
}) {
  const { user } = useAuthContext();
  const organizationId = user?.organization?.id;
  const [shouldShowDialog, setDialog] = useState(initDialog);
  const teamNotesSubject = useTeamNotesSubject();
  const mounted = useRef(false);

  const [deletedNotesIds, setDeletedNotesIds] = useState([]);
  const [newNote, setNewNote] = useState('');
  let isMobile = useMatchMedia('(max-width: 767px)');

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  function handleActionClick(event) {
    event.stopPropagation();
    setDialog(true);
  }

  async function handleSave() {
    setDialog(false);

    if (deletedNotesIds.length > 0) {
      try {
        await doDelete({ ids: deletedNotesIds, organizationId });
      } catch (error) {
        // TODO: MIR-1954 handle error case, conflict with error boundary
        throw error;
      }
      mounted.current && setDeletedNotesIds([]);
    }

    if (newNote) {
      try {
        await doCreate({
          text: newNote,
          providerId,
          organizationId,
        });
      } catch (error) {
        // TODO: MIR-1954 handle error case, conflict with error boundary
        throw error;
      }
      mounted.current && setNewNote('');
    }

    if (deletedNotesIds.length > 0 || newNote) {
      onChange();
    }
  }

  function handleDismiss() {
    setDialog(false);
    setNewNote('');
    setDeletedNotesIds([]);
  }

  function handleNotesChanges({ id }) {
    setDeletedNotesIds([...deletedNotesIds, id]);
  }

  function handleNewNoteChange(event) {
    setNewNote(event.target.value);
  }

  async function handleDeleteAll() {
    try {
      await doDeleteAll({ id: providerId, organizationId });
    } catch (error) {
      // TODO: MIR-1954 handle error case, conflict with error boundary
      throw error;
    }
    setDialog(false);
    onChange();
  }

  return (
    <Can I={TeamNotesActions.Paginate} a={TeamNoteSubject}>
      <>
        <button className={cn('p-2 text-p-100', className)} onClick={handleActionClick}>
          <TeamNoteIcon showBadge={hasNotes} />
          {label && <span>{label}</span>}
        </button>

        <Dialog isOpen={shouldShowDialog} width={500} maxHeight={620} onDismiss={handleDismiss}>
          <DialogTitle>Team notes</DialogTitle>
          <TeamNotesList providerId={providerId} limit={500} onChange={handleNotesChanges} />
          <Can I={TeamNotesActions.Write} a={teamNotesSubject}>
            <div className={styles.textAreaContainer}>
              <TextArea
                placeholder="Your Note"
                onChange={handleNewNoteChange}
                value={newNote}
                minRows={2}
                maxRows={10}
                maxLength={maxLength}
              />
              <p>{newNote ? `${newNote.length}/${maxLength}` : maxLength} charters max</p>
            </div>
          </Can>
          <DialogActions>
            <button className="mir-button primary" onClick={handleSave}>
              Save
            </button>
            {shouldEnableDeleteAll && (
              <Can I={TeamNotesActions.Delete} a={teamNotesSubject}>
                <button className="mir-button" onClick={handleDeleteAll}>
                  {isMobile ? 'Delete all' : 'Delete all notes'}
                </button>
              </Can>
            )}
            <button className="mir-button" onClick={handleDismiss}>
              Cancel
            </button>
          </DialogActions>
        </Dialog>
      </>
    </Can>
  );
}

TeamNotesAction.propTypes = {
  label: PropTypes.string,
  providerId: PropTypes.string.isRequired,
  initDialog: PropTypes.bool,
  hasNotes: PropTypes.bool,
  onChange: PropTypes.func,
  doCreate: PropTypes.func,
  doDelete: PropTypes.func,
  doDeleteAll: PropTypes.func,
  maxLength: PropTypes.number,
  shouldEnableDeleteAll: PropTypes.bool,
};

TeamNotesAction.defaultProps = {
  label: '',
  initDialog: false,
  hasNotes: false,
  onChange: noop,
  doDelete: batchDeleteTeamNotesByIds,
  doCreate: createTeamNote,
  doDeleteAll: deleteAllTeamNotesByProviderId,
  maxLength: 500,
  shouldEnableDeleteAll: false,
};
