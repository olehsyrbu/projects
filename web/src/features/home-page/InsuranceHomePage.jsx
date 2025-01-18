import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import mixpanel from '@/core/mixpanel';
import config from '@/core/config';
import Header from '@/modules/app-shell/HeaderWithLogin';
import { EmergencyBanner } from './EmergencyBanner';
import Footer from '@/modules/app-shell/Footer';
import { useOrganizationTheme } from '@/modules/organization';
import { SearchBar } from '@/modules/search/components';
import getMatchedImage from '@/images/HomePage_BCBS_getMatched_image.jpg';
import IdentifyCare from '@/images/home-page/IdentifyCare.png';
import ChooseProviders from '@/images/home-page/ChooseProviders.png';
import ScheduleDirectly from '@/images/home-page/ScheduleDirectly.png';
import Appointment from '@/images/home-page/Appointment.png';

export function InsuranceHomePage({ onSearch }) {
  useOrganizationTheme();

  const handleLearningLink = (control) => {
    mixpanel.track('Open learning center link', { control });
  };

  return (
    <div>
      <EmergencyBanner />
      <Header>
        <div className="flex w-full justify-end">
          <a
            className="mr-8 font-medium"
            href={config.learningCenterUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => handleLearningLink('header')}
          >
            Learning center
          </a>
        </div>
      </Header>

      <div className="relative mt-6 flex w-full flex-col items-center md:mt-14">
        <div className="w-full max-w-4xl px-4 md:px-0">
          <h1 className="mx-auto mb-6 w-[15.25rem] text-center font-serif text-xl font-bold md:w-full md:px-6 md:text-start md:text-5xl">
            We have someone good in mind for every type of mind.
          </h1>
          <p className="mb-8 hidden text-2xl font-normal leading-normal md:block md:px-6 ">
            All the mental health care you’ll ever need, someone good and available for you.
          </p>
          <SearchBar onSubmit={onSearch} />
          <div className="z-10 mt-6 flex w-full flex-col items-center text-base md:ml-6 md:flex-row md:text-xl">
            <p>Not sure what you’re looking for?</p>
            <Link className="md:ml-2" to="/guided-search">
              Get matched
            </Link>
          </div>
        </div>
      </div>

      <div className=" mt-12  w-full  bg-p-100 md:mt-16">
        <div className="flex items-center justify-center px-6 py-10 md:px-0 md:py-16">
          <div className="w-[25rem] text-inverted md:mr-20">
            <h3 className="font-serif text-2xl md:text-3xl">Not sure what you’re looking for?</h3>
            <p className="my-6 text-xl">
              That’s okay — most people don’t. Answer a few questions, and we’ll help you get
              started.
            </p>

            <div className="flex items-center">
              <Link className="block w-auto bg-background p-4 font-medium" to="/guided-search">
                Get matched
              </Link>
              <a
                className="ml-6 min-w-[12rem] font-medium text-inverted hover:text-inverted"
                href={config.learningCenterUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleLearningLink('button')}
              >
                Learning center
              </a>
            </div>
          </div>
          <img src={getMatchedImage} className="hidden md:block" alt="" aria-hidden="true" />
        </div>
      </div>

      <div className="mx-4 my-10 md:mx-0 md:my-20">
        <h3 className="text-bold text-center font-serif text-2xl md:text-4xl ">
          How we work with you
        </h3>
        <div className="mt-14 flex space-x-14 overflow-x-auto md:w-auto md:justify-center">
          <Card
            picture={IdentifyCare}
            title="First, we help you identify the right care for you."
            text="Through our guided search, we help you find the best services for your needs. Also, you can search directly and refine results with our filters if you know what you want. "
          />
          <Card
            picture={ChooseProviders}
            title="We help you choose  providers you are interested in."
            text="In our learning center, you can find articles and information to help you choose a care provider. We guide you through understanding payment options and starting therapy for the first time."
          />
          <Card
            picture={ScheduleDirectly}
            title="Then, you can schedule directly with providers."
            text="You can schedule through their profile once you find the providers you want to see. You can email providers directly through our platform, call them, or use an online scheduler if available."
          />
          <Card
            picture={Appointment}
            title="Before your appointment, get prior authorization"
            text="Before you attend your appointment, you must call (xxx) xxx-xxxx to ask for a prior authorization number for the provider you plan to see. You must do this to ensure your insurance covers it."
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Card({ picture, title, text }) {
  return (
    <div className="block w-[13.75rem] min-w-[13.75rem]">
      <img className="max-h-52" src={picture} alt="" aria-hidden="true" />
      <h4 className="my-6 text-2xl font-bold">{title}</h4>
      <p className="">{text}</p>
    </div>
  );
}

InsuranceHomePage.propTypes = {
  onSearch: PropTypes.func,
};

Card.propTypes = {
  picture: PropTypes.elementType,
  title: PropTypes.string,
  text: PropTypes.string,
};
