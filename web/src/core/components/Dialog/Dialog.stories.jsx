import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from './index';

export default {
  title: 'Components/Dialog',
};

export function Default(args) {
  let [open, setOpen] = useState(false);
  let openDialog = () => setOpen(true);
  let closeDialog = () => setOpen(false);

  return (
    <>
      <button className="mir-button" onClick={openDialog}>
        Open dialog
      </button>
      <Dialog isOpen={open} onDismiss={closeDialog} width={args.width}>
        <DialogTitle>{args.title}</DialogTitle>
        <DialogContent>{args.message}</DialogContent>
        <DialogActions>
          <button className="mir-button primary">{args.button1}</button>
          <button className="mir-button" onClick={closeDialog}>
            {args.button2}
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

Default.storyName = 'Dialog';
Default.args = {
  title: 'Lorem ipsum dolor',
  message:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at vehicula eros. Morbi imperdiet consectetur lacinia. Morbi pellentesque arcu at.',
  button1: 'Confirm',
  button2: 'Cancel',
  width: 500,
};
