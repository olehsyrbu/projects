import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@/core/components';
import cx from './Dailog.module.css';

export function DeleteProfileDialog({ isOpen, onSubmit, onDismiss, isProviderActivated }) {
  return (
    <Dialog isOpen={isOpen} onDismiss={onDismiss} width={550}>
      <DialogTitle>{isProviderActivated ? 'Remove edit rights' : 'Delete provider'}</DialogTitle>
      <DialogContent>
        <div className={cx.content}>
          {isProviderActivated ? (
            <p>You will no longer be able to edit this provider’s profile. Are you sure?</p>
          ) : (
            <p>
              You have selected to delete this provider. Just to confirm, all data associated with
              this provider will be lost. This data will not be able to be restored.
            </p>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <button className="mir-button primary" onClick={onSubmit}>
          {isProviderActivated ? 'Remove access' : 'Delete'}
        </button>
        <button className="mir-button" onClick={onDismiss}>
          Cancel
        </button>
      </DialogActions>
    </Dialog>
  );
}

DeleteProfileDialog.propTypes = {
  isOpen: PropTypes.bool,
  onSubmit: PropTypes.func,
  onDismiss: PropTypes.func,
  isProviderActivated: PropTypes.bool,
};
