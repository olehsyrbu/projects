import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@/core/components';
import cx from './Dailog.module.css';

export function ChangeResendDialog({
  isOpen,
  email,
  onDismiss,
  onSubmit,
  children,
  disabledConfirm,
}) {
  return (
    <Dialog isOpen={isOpen} onDismiss={onDismiss} width={550}>
      <DialogTitle>Resend invitation</DialogTitle>
      <DialogContent>
        <div className={cx.content}>
          <div className="onboarding-field mb-4">
            <span className="font-bold">Invitation email: </span>
            <a href={`mailto:${email}`} className="pl-1 font-bold">
              {email}
            </a>
          </div>
          <p className="mb-3">
            We suggest that you resend your invitation if the provider hasn't accepted it in 7 or
            more days.
          </p>
          {children}
        </div>
      </DialogContent>
      <DialogActions>
        <button
          disabled={disabledConfirm}
          type="submit"
          className="mir-button primary"
          onClick={onSubmit}
        >
          Resend
        </button>
        <button className="mir-button" onClick={onDismiss}>
          Cancel
        </button>
      </DialogActions>
    </Dialog>
  );
}

ChangeResendDialog.propTypes = {
  disabledConfirm: PropTypes.bool,
  isOpen: PropTypes.bool,
  email: PropTypes.string,
  onSubmit: PropTypes.func,
  onDismiss: PropTypes.func,
  children: PropTypes.node,
};
