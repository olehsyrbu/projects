import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { history } from '@/core/router';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '../Dialog';

export function NavigationPrompt({ when, title, message, options }) {
  let [open, setOpen] = useState(false);
  let callbackRef = useRef();

  useEffect(() => {
    if (when) {
      let unblock = history.block((tx) => {
        setOpen(true);

        callbackRef.current = (allow) => {
          setOpen(false);

          if (allow) {
            unblock();
            tx.retry();
          }
        };
      });
      return unblock;
    }
  }, [when]);

  return (
    <Dialog width="33rem" isOpen={open} onDismiss={() => setOpen(false)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <button className="mir-button primary" onClick={() => callbackRef.current(false)}>
          {options[0]}
        </button>
        <button className="mir-button" onClick={() => callbackRef.current(true)}>
          {options[1]}
        </button>
      </DialogActions>
    </Dialog>
  );
}

NavigationPrompt.propTypes = {
  when: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  options: PropTypes.array,
};

NavigationPrompt.defaultProps = {
  when: false,
  title: '',
  message: '',
  options: ['Stay on the page', 'Leave the page'],
};
