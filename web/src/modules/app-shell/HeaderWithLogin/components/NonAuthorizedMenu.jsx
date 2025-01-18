import { useState } from 'react';
import { Link } from 'react-router-dom';
import config from '@/core/config';
import mixpanel from '@/core/mixpanel';
import { LoginDialog } from '@/modules/auth/components';
import ResetPassword from './ResetPassword/ResetPassword';

export default function NonAuthorizedMenu() {
  let [openModal, setOpemModal] = useState(null);

  if (openModal === 'login') {
    return (
      <LoginDialog
        onResetPasswordOpen={() => setOpemModal('reset')}
        onDismiss={() => setOpemModal(null)}
      />
    );
  }

  if (openModal === 'reset') {
    return <ResetPassword />;
  }

  return (
    <div className="grid grid-rows-[1fr_auto] py-4">
      <nav className="flex flex-col space-y-8 border-b border-solid border-graphics-30 pb-6 text-center text-xl font-medium">
        <Link to="/">Home</Link>
        <Link to="/guided-search">Guided search</Link>
        <a
          href={config.learningCenterUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => mixpanel.track('Open learning center link', { control: 'mobile menu' })}
        >
          Learning center
        </a>
      </nav>

      <div className="mb-2 mt-6 flex justify-center">
        <button
          className="mir-button primary !h-8 !rounded-lg !px-6"
          onClick={() => setOpemModal('login')}
        >
          Log In
        </button>
      </div>
    </div>
  );
}
