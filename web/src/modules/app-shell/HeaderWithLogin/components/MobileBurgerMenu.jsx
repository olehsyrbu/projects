import { Suspense } from 'react';
import PropTypes from 'prop-types';
import { Dismiss24Filled as Dismiss } from '@fluentui/react-icons';
import { useAuthContext } from '@/modules/auth';
import Logo from '@/modules/app-shell/Logo';
import AuthorizedMenu from './AuthorizedMenu';
import NonAuthorizedMenu from './NonAuthorizedMenu';

export default function MobileBurgerMenu({ onDismiss }) {
  let { user } = useAuthContext();

  return (
    <div className="grid h-full grid-rows-[auto_1fr]">
      <div className="flex h-16 items-center justify-start px-5">
        <button onClick={onDismiss}>
          <Dismiss className="text-p-100" />
        </button>
        <Logo />
      </div>
      <Suspense fallback={null}>
        {user ? <AuthorizedMenu onLogOut={onDismiss} /> : <NonAuthorizedMenu />}
      </Suspense>
    </div>
  );
}

MobileBurgerMenu.propTypes = {
  onDismiss: PropTypes.func.isRequired,
};
