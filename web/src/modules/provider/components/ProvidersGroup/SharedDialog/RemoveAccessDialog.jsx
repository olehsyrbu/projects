import { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@/core/components';
import { Checkbox } from '@/core/components/Checkbox';
import { TooltipIcon } from '@/core/components/Tooltip';
import { useAuthContext } from '@/modules/auth';

export function RemoveAccessDialog({ isOpen, onSubmit, onDismiss, name, email }) {
  const { user } = useAuthContext();
  const [value, setValue] = useState(true);

  return (
    <Dialog isOpen={isOpen} onDismiss={onDismiss} width={550}>
      <DialogTitle>Remove access</DialogTitle>
      <DialogContent>
        <p>
          Are you sure you want to remove access from {name || 'GPA'} with email {email}
        </p>
        {user.notificationEmail === email && (
          <div className="mt-4 flex items-center space-x-2">
            <Checkbox defaultSelected={value} onChange={setValue}>
              Also remove from notification settings
              <TooltipIcon
                label="You can add this provider back in notification settings"
                classNameIcon="ml-1 align-middle"
              />
            </Checkbox>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <button
          className="mir-button primary"
          onClick={() => onSubmit(value)}
          data-testid="confirm-remove-access"
        >
          Remove access
        </button>
        <button className="mir-button" onClick={onDismiss}>
          Cancel
        </button>
      </DialogActions>
    </Dialog>
  );
}

RemoveAccessDialog.propTypes = {
  isOpen: PropTypes.bool,
  onSubmit: PropTypes.func,
  onDismiss: PropTypes.func,
  name: PropTypes.string,
  email: PropTypes.string,
};
