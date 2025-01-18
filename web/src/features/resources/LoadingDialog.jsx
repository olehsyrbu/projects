import { Dialog, DialogContent } from '@/core/components';
import PropTypes from 'prop-types';

export function LoadingDialog({ text }) {
  return (
    <Dialog isOpen showButton={false} width={550}>
      <DialogContent>
        <div className="flex flex-col items-center">
          <p className="my-6 text-xl font-bold">{text}</p>
          <div className="relative mb-4 h-2 w-3/5 overflow-hidden rounded-2xl bg-p-40">
            <div className="absolute h-2 w-1/4 animate-loader rounded-2xl bg-p-100" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
LoadingDialog.propTypes = {
  text: PropTypes.string,
};
