import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@/core/components';

export function DeactivateDialog({ onDeactivate, onClose, open }) {
  return (
    <Dialog isOpen={open} onDismiss={onClose} width={550}>
      <DialogTitle>Deactivate profile</DialogTitle>
      <DialogContent>
        <p>
          Deactivating your profile means it is removed from search results when prospective
          clients/patients search for a provider. Your profile data is saved for later use in the
          event that you want to re-activate it and make your profile visible again to those seeking
          care.{' '}
        </p>
        <p className="mt-7">
          <b>Note,</b> if you are temporarily not accepting new clients/patients because your
          practice is full, change your profile to "not accepting new patients", rather than
          deactivating your profile.{' '}
        </p>
        <p>
          Scenarios for deactivating your profile may include: taking an undetermined leave of
          absence from your practice, parental leave, retirement, injury or illness.{' '}
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
