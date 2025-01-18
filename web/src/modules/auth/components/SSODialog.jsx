import PropTypes from 'prop-types';
import { Modal, Dialog } from 'react-aria-components';
import config from '@/core/config';
import { Dismiss24Filled as Dismiss } from '@fluentui/react-icons';
import Logo from '@/modules/app-shell/Logo';

let dukeSSOUrl = new URL('/oauth/duke/init', config.api.baseUrl).href;

export function SSODialog({ displayCustomerMessage = true, onLoginOpen, onDismiss }) {
  return (
    <Modal
      isOpen
      className="fixed inset-0 bg-black/70 md:grid md:place-content-center"
      onOpenChange={(open) => (!open ? onDismiss() : null)}
    >
      <Dialog
        aria-label="Login Dialog"
        className="flex flex-col bg-white max-md:h-full md:w-[500px] md:rounded-xl md:pb-8"
        onClose={onDismiss}
      >
        <header className="grid h-16 grid-cols-[1.5rem_1fr_1.5rem] items-center p-3 max-md:px-4 md:h-12">
          <button aria-label="Close" className="md:col-start-3" onClick={onDismiss}>
            <Dismiss className="text-p-100" />
          </button>
          <div className="md:hidden">
            <Logo />
          </div>
        </header>

        <div className="mb-auto space-y-4 text-center max-md:pt-[54px] md:mb-7">
          <h2 className="text-2xl font-bold md:font-serif">Organization log in</h2>
          <p className="text-sm">Sign in through your organization account</p>
        </div>

        <div className="px-2.5 text-center">
          <a href={dukeSSOUrl} className="mir-button primary w-full md:max-w-[343px]">
            Duke NetID
          </a>

          <p className="my-6 text-sm">
            or{' '}
            <button className="text-p-100" onClick={onLoginOpen}>
              Go back to main login
            </button>
          </p>

          {displayCustomerMessage && (
            <p className="-mx-2.5 bg-p-10 p-2.5 text-center text-sm">
              If you are using MiResource to search for care, you don’t need to log in
            </p>
          )}
        </div>
      </Dialog>
    </Modal>
  );
}

SSODialog.propTypes = {
  displayCustomerMessage: PropTypes.bool,
  onLoginOpen: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
};
