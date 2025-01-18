import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@/core/components';

export function DeactivateDialog({ open, onDeactivate, onClose }) {
  return (
    <Dialog isOpen={open} onDismiss={onClose} width={550}>
      <DialogTitle>Deactivate program</DialogTitle>
      <DialogContent>
        <p>
          Deactivating your program means it is removed from search results when prospective
          patients search for a program. Your program data is saved for later use if you want to
          re-activate it and make your program visible again to those seeking care.{' '}
        </p>
        <p className="mt-7">
          <b>Note,</b> If you are temporarily not accepting new patients because your program is
          full, change your program availability status to "not accepting new patients" rather than
          deactivating your program.{' '}
        </p>
      </DialogContent>
      <DialogActions>
        <button className="mir-button primary" onClick={onClose}>
          Cancel
        </button>
        <button className="mir-button" onClick={onDeactivate}>
          Deactivate
        </button>
      </DialogActions>
    </Dialog>
  );
}

DeactivateDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onDeactivate: PropTypes.func,
};
