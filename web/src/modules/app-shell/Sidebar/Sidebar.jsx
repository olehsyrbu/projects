import { Suspense } from 'react';
import PropTypes from 'prop-types';
import { useOrganization } from '@/modules/organization';
import ProfileInfo from './ProfileInfo';
import Logo from '../Logo';
import './Sidebar.css';

export default function Sidebar({ children }) {
  const organization = useOrganization();

  return (
    <div id="sidebar" className="column">
      <span className={`mb-20 mt-8 ${organization ? 'ml-2' : 'ml-6'}`}>
        <Logo isNormalSize={false} />
      </span>
      <nav>{children}</nav>
      <Suspense fallback={null}>
        <ProfileInfo />
      </Suspense>
    </div>
  );
}

Sidebar.propTypes = {
  children: PropTypes.node,
};
