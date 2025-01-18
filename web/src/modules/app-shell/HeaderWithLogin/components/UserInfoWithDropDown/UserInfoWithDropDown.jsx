import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import {
  Person24Regular as Person,
  ChevronDown24Filled as ChevronDown,
} from '@fluentui/react-icons';
import { useAuthContext } from '@/modules/auth';
import { useUserRedirect } from '@/modules/auth/hooks';
import './UserInfoWithDropDown.css';

function UserInfoWithDropDown() {
  const [expanded, setExpanded] = useState(false);

  const { user, logOut } = useAuthContext();
  const url = useUserRedirect();

  const userInfoRef = useRef(null);
  const dropdownRef = useRef(null);

  function eventClick(e) {
    if (!userInfoRef.current?.contains(e.target))
      setExpanded(dropdownRef.current?.contains(e.target));
  }

  const handleUserInfoClick = () => {
    if (expanded) setExpanded(false);
    else setExpanded(true);
  };

  const handleLogOut = async () => {
    try {
      await logOut();
      setExpanded(false);
    } catch (error) {}
  };

  useEffect(() => {
    document.addEventListener('click', eventClick);
    return () => document.removeEventListener('click', eventClick);
  }, []);

  return (
    <div className="UserInfoWithDropDown">
      <div className="userInfo" onClick={handleUserInfoClick} ref={userInfoRef}>
        <Person />
        <p className="user-name">{user.firstName}</p>
        <ChevronDown className={cn({ expanded })} />
      </div>
      {expanded && (
        <div className="userInfo-dropdown" ref={dropdownRef}>
          <div className="menu">
            <Link className="menu-item" to={url}>
              My Dashboard
            </Link>
            <p className="menu-item" onClick={handleLogOut}>
              Log Out
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserInfoWithDropDown;
