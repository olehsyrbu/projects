import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { SearchBar } from '@/modules/search/components';
import Header from '@/modules/app-shell/HeaderWithLogin/Header';
import Footer from '@/modules/app-shell/Footer';
import background from '@/images/HomePage_BCBS_background.png';
import getMatchedImage from '@/images/HomePage_BCBS_getMatched_image.jpg';
import getMatchedBackground from '@/images/HomePage_BCBS_getMatched_background.png';
import { useOrganizationTheme, OrganizationTypes } from '@/modules/organization';
import { EmergencyBanner } from '../EmergencyBanner';
import config from '@/core/config';
import mixpanel from '@/core/mixpanel';
import './BcbsksHomePage.css';

export function BcbsksHomePage({ onSearch }) {
  useOrganizationTheme({
    enableFor: [OrganizationTypes.Insurance],
  });

  return (
    <div className="homePage-bcbs">
      <EmergencyBanner />

      <Header>
        <div className="flex w-full justify-end">
          <a
            className="mr-8 font-medium"
            href={config.learningCenterUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => mixpanel.track('Open learning center link', { control: 'header' })}
          >
            Learning center
          </a>
        </div>
      </Header>

      <div className="section-content">
        <div className="section-layout">
          <div className="title text-left">
            We have someone good in mind for every type of mind.
          </div>
          <div className="subtitle">
            All the mental health care you’ll ever need, someone good and available for you.
          </div>
          <SearchBar onSubmit={onSearch} />
          <div className="z-10 mt-6 flex w-full flex-col items-center text-xl md:ml-5 md:flex-row">
            <p className="">Not sure what you’re looking for?</p>
            <Link className="md:ml-2" to="/guided-search">
              Get matched
            </Link>
          </div>
        </div>
        <div className="get-matched-block">
          <div className="get-matched-layout">
            <div className="content-wrapper">
              <div className="title">Not sure what you’re looking for?</div>
              <div className="subtitle">
                That’s okay — most people don’t. Answer a few questions, and we’ll help you get
                started.
              </div>
              <Link className="get-matched-btn" to="/guided-search">
                Get matched
              </Link>
            </div>
            <img src={getMatchedImage} className="get-matched-image" alt="" />
          </div>
          <img src={getMatchedBackground} className="get-matched-background" alt="" />
        </div>
        <img src={background} className="background-image" alt="" />
      </div>
      <Footer />
    </div>
  );
}

BcbsksHomePage.propTypes = {
  onSearch: PropTypes.func.isRequired,
};
