import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@/core/components';
import cx from './Dailog.module.css';

export function CreatedProfileDialog({ onConfirm, isOpen, onDismiss }) {
  return (
    <Dialog isOpen={isOpen} onDismiss={onDismiss} width={550}>
      <DialogTitle>Profile has been created! </DialogTitle>
      <DialogContent>
        <div className={cx.content}>
          <p>
            Way to go! The basic profile is complete. Add a bit more information for even better
            provider matches with prospective clients/patients.
          </p>
          <p className={cx.support}>
            We’re here to support you at{' '}
            <a href="mailto:support@miresource.com" type="email">
              support@miresource.com
            </a>
          </p>
        </div>
      </DialogContent>
      <DialogActions>
        <button className="mir-button primary" onClick={onConfirm}>
          Customize profile
        </button>
        <button className="mir-button" onClick={onDismiss}>
          I’ll do it later
        </button>
      </DialogActions>
    </Dialog>
  );
}

CreatedProfileDialog.propTypes = {
  isOpen: PropTypes.bool,
  onConfirm: PropTypes.func,
  onDismiss: PropTypes.func,
};
