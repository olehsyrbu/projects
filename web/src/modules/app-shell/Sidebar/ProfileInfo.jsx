import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '@/modules/auth';
import { EditAccountDialog } from '@/modules/account/components';

export default function ProfileInfo() {
  let { user } = useAuthContext();
  const { email, firstName, lastName } = user || {};
  let [accountEditOpen, setAccountEditOpen] = useState(false);

  return (
    <>
      <div id="sidebarUserInfo" className="column">
        <span className="name">{`${firstName} ${lastName}`}</span>
        <span className="email">{email}</span>
      </div>
      <div id="sidebarLinks">
        <button
          className="mir-button text !h-5 !p-0 !text-sm"
          onClick={(event) => {
            event.preventDefault();
            setAccountEditOpen(true);
          }}
        >
          Edit Account
        </button>

        <Link className="m-0 h-4 break-all p-0 text-sm font-medium text-p-100" to="/logout">
          Log Out
        </Link>
      </div>
      {accountEditOpen ? (
        <EditAccountDialog isOpen={accountEditOpen} onDismiss={() => setAccountEditOpen(false)} />
      ) : null}
    </>
  );
}
