import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from '@/core/utils';
import { useScreen } from '@/core/hooks';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@/core/components';
import { TextArea } from '@/core/components/TextArea';
import './ReferralListDialogNote.css';

export default function ReferralListDialogNote(props) {
  const [note, setNote] = useState(props.note);
  const { title, primaryText, onClose, onSave } = props;
  const isMediumScreen = useScreen('md');

  const setTextareaHeightByNote = () => {
    const el = document.getElementById('referral-list-note-dialog');
    el.style.cssText = 'height:auto; padding:0';
    if (!isMediumScreen) {
      el.style.cssText = 'height:' + (el.scrollHeight + 200) + 'px';
    } else {
      el.style.cssText = 'height:' + (el.scrollHeight + 20) + 'px';
    }
  };

  useEffect(() => {
    setTextareaHeightByNote();
  }, []);

  const handleExit = (e) => {
    onClose();
    e.stopPropagation();
  };

  const handleSave = () => {
    onSave(note);
  };

  const handleChangeNote = (e) => {
    setNote(e.target.value);
    setTextareaHeightByNote();
  };

  const handleDeleteNote = () => {
    onSave('');
    setTextareaHeightByNote();
  };

  return (
    <Dialog width={536} isOpen onDismiss={handleExit}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextArea
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          id="referral-list-note-dialog"
          onChange={handleChangeNote}
          defaultValue={note}
          placeholder="E.g., Contact this person first."
          maxLength={154}
        />
      </DialogContent>
      <DialogActions>
        <button className="mir-button primary" onClick={handleSave}>
          {primaryText}
        </button>
        {props.note && (
          <button className="mir-button" onClick={handleDeleteNote}>
            Delete note
          </button>
        )}
        <button className="mir-button" onClick={handleExit}>
          Cancel
        </button>
      </DialogActions>
    </Dialog>
  );
}

ReferralListDialogNote.propTypes = {
  note: PropTypes.string,
  title: PropTypes.string,
  primaryText: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

ReferralListDialogNote.defaultProps = {
  note: '',
  title: 'Add note',
  primaryText: 'Add note',
  onClose: noop,
  onSave: noop,
};
