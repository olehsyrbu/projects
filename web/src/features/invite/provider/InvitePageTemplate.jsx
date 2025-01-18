import PropTypes from 'prop-types';
import Footer from '@/modules/app-shell/Footer';
import Header from '@/modules/app-shell/HeaderWithLogin';
import { Trackers } from '@/features/invite/landingPage/LandingPageTemplate';
import { useOrganizationTheme } from '@/modules/organization';

export default function InvitePageTemplate({ children }) {
  useOrganizationTheme();

  return (
    <div className="min-h-screen bg-surface">
      <Trackers />
      <Header login={false} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

InvitePageTemplate.propTypes = {
  children: PropTypes.node,
};
