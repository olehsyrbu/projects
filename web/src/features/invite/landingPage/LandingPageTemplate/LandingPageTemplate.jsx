import PropTypes from 'prop-types';
import { useOrganization } from '@/modules/organization';
import Decoration from './Decoration';
import Placeholder from './Placeholder';
import './LandingPageTemplate.css';
import Logo from '@/modules/app-shell/Logo';
import { Trackers } from './Trackers';

export default function LandingPageTemplate({ children }) {
  let organization = useOrganization();

  return (
    <div className="LandingPage">
      <Trackers />
      <header>
        <Logo />
      </header>

      <main>{children}</main>

      {organization?.subdomain === 'bcbsks' && (
        <p className="license">
          Blue Cross and Blue Shield of Kansas is an independent licensee of the Blue Cross Blue
          Shield Association. BLUE CROSS®, BLUE SHIELD® and the Cross and Shield Symbols are
          registered service marks of the Blue Cross Blue Shield Association, an association of
          independent Blue Cross and Blue Shield Plans. Blue Cross and Blue Shield of Kansas
          contracts with MiResource to provide mental health resources to members. MiResource is
          unaffiliated with Blue Cross and Blue Shield of Kansas.
        </p>
      )}

      <Placeholder>
        <Decoration />
      </Placeholder>
    </div>
  );
}

LandingPageTemplate.propTypes = {
  children: PropTypes.node,
};
