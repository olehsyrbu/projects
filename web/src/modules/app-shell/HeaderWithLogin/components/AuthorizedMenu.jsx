import { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuthContext } from '@/modules/auth';
import { Link } from 'react-router-dom';
import { useUserRedirect } from '@/modules/auth/hooks';
import { EditAccountDialog } from '@/modules/account/components';
import config from '@/core/config';
import mixpanel from '@/core/mixpanel';

export default function AuthorizedMenu({ onLogOut }) {
  const { user, logOut } = useAuthContext();
  const url = useUserRedirect();
  let [accountEditOpen, setAccountEditOpen] = useState(false);

  const handleEditAccount = (event) => {
    event.preventDefault();
    setAccountEditOpen(true);
  };

  const handleLogOut = async () => {
    try {
      await logOut();
      onLogOut();
    } catch (error) {}
  };

  const handleLearningLink = (control) => {
    mixpanel.track('Open learning center link', { control });
  };

  return (
    <div className="flex h-full flex-col justify-between py-4">
      <nav className="flex flex-col space-y-8 border-b border-solid border-graphics-30 pb-6 text-center text-xl font-medium">
        <Link to="/">Home</Link>
        <Link to={url}>My dashboard</Link>
        <Link to="/guided-search">Guided search</Link>
        <a
          href={config.learningCenterUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => handleLearningLink('mobile menu')}
        >
          Learning center
        </a>
      </nav>
      <div className="mb-4 mt-6 text-center">
        <p className="mb-1 font-bold">{user.fullName}</p>
        <p className="mb-2 text-sm text-hint">{user.email}</p>
        <div className="flex justify-center space-x-10 font-medium text-p-100">
          <button onClick={handleEditAccount}>Edit Account</button>
          <button onClick={handleLogOut}>Log Out</button>
        </div>
      </div>
      {accountEditOpen ? (
        <EditAccountDialog isOpen={accountEditOpen} onDismiss={() => setAccountEditOpen(false)} />
      ) : null}
    </div>
  );
}

AuthorizedMenu.propTypes = {
  setExpanded: PropTypes.func,
};
