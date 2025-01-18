import { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import quickOnboarding from './assets/QuickOnboarding.png';
import personalWebsite from './assets/PersonalWebsite.png';
import delegateAccess from './assets/DelegateAccess.png';
import seamlessUpdates from './assets/SeamlessUpdates.png';
import availabilityUpdates from './assets/AvailabilityUpdates.png';
import referral from './assets/Referral.png';
import { ChevronDown16Filled as ChevronDown } from '@fluentui/react-icons';
import { useScreen } from '@/core/hooks';

const configFirstBlock = [
  {
    title: 'Quick onboarding',
    text: 'Fill out a 10-minute questionnaire about your specialties, availability, location, accepted payment options, and credentials. We support telehealth, in-person care, and your current scheduling flow (email, phone, online scheduler).',
    img: quickOnboarding,
  },
  {
    title: 'Free personal website',
    text: 'Your profile becomes live to our users immediately after completing onboarding. You can use your profile to showcase your expertise and services to potential clients within and outside MiResource.',
    img: personalWebsite,
  },
  {
    title: 'Delegate access',
    text: 'If you have an admin that manages your public profiles, availability, and new clients, you can delegate access to edit your profile to keep it up-to-date. You retain ownership of your profile and control access to edit your profile.',
    img: delegateAccess,
  },
];

const configSecondBlock = [
  {
    title: 'Seamless updates',
    text: 'You can log in at any time and keep adding information to enrich your profile. The more information you add, the easier it is for us to find you the right match for your specialty.',
    img: seamlessUpdates,
  },
  {
    title: 'Availability updates',
    text: 'We enable you to easily update your availability in one click by responding to our periodic emails. You can also change your profile preferences, so your admin receives these emails.',
    img: availabilityUpdates,
  },
  {
    title: 'Referral',
    text: 'If one of your clients needs a referral to another mental healthcare resource to complement their treatment with you or because their severity has changed, you can use MiResource to refer them. We cover resources for the entire spectrum of care, from therapy to residential treatment programs.',
    img: referral,
  },
];

export function SiteTutorial() {
  const isMediumScreen = useScreen('md');
  const [openFirstBlock, setOpenFirstBlock] = useState(0);
  const [openSecondBLock, setOpenSecondBLock] = useState(isMediumScreen ? 0 : null);

  const handleFirstBlockClick = (index) => {
    setOpenFirstBlock(index);
    if (!isMediumScreen) {
      setOpenSecondBLock(null);
    }
  };

  const handleSecondBlockClick = (index) => {
    setOpenSecondBLock(index);
    if (!isMediumScreen) {
      setOpenFirstBlock(null);
    }
  };

  return (
    <div className="flex w-full flex-col items-center bg-background md:bg-inherit">
      <div className="mx-4 pb-14 md:mx-0 md:min-w-[65rem] md:pb-28">
        <h2 className="mb-8 mt-10 text-center font-serif text-2xl font-bold md:mb-10 md:mt-12 md:text-left md:text-3xl">
          How MiResource works
        </h2>
        <TutorialBlock>
          <div className="space-y-6 md:py-12">
            {configFirstBlock.map(({ title, text, img }, index) => (
              <Accordion
                key={index}
                title={title}
                isOpen={openFirstBlock === index}
                onClick={() => handleFirstBlockClick(index)}
                className={cn({
                  'border-l-4 border-p-100': openFirstBlock === index && isMediumScreen,
                })}
                text={text}
                img={img}
              />
            ))}
          </div>
          {isMediumScreen && (
            <img
              src={configFirstBlock[openFirstBlock]?.img}
              aria-hidden="true"
              alt=""
              className="my-7 mr-8 h-80 w-[27rem] rounded-lg"
            />
          )}
        </TutorialBlock>

        <TutorialBlock className="mt-6 md:mt-8 ">
          {isMediumScreen && (
            <img
              src={configSecondBlock[openSecondBLock]?.img}
              aria-hidden="true"
              alt=""
              className="my-7 ml-8 h-80 w-[27rem] rounded-lg"
            />
          )}
          <div className="space-y-6 md:py-12">
            {configSecondBlock.map(({ title, text, img }, index) => (
              <Accordion
                key={index}
                title={title}
                isOpen={openSecondBLock === index}
                onClick={() => handleSecondBlockClick(index)}
                className={cn({
                  'border-r-4 border-p-100': openSecondBLock === index && isMediumScreen,
                })}
                text={text}
                img={img}
              />
            ))}
          </div>
        </TutorialBlock>
      </div>
    </div>
  );
}

function TutorialBlock({ children, className }) {
  return (
    <div
      className={cn(
        'md:rounded-lg md:bg-background md:drop-shadow-[0_4px_10px_rgba(0,0,0,0.1)]',
        className,
      )}
    >
      <div className="flex w-full flex-col justify-between md:flex-row ">{children}</div>
    </div>
  );
}

function Accordion({ title, text, isOpen, onClick, className, img }) {
  const isMediumScreen = useScreen('md');
  return (
    <div className="h-fit w-screen text-base md:w-[35rem]">
      <div className={cn('px-6 md:px-16', className)}>
        <button tabIndex="0" aria-label={title} onClick={onClick}>
          <h3 className="flex cursor-pointer items-center text-xl font-bold text-p-100">
            <span className={`border-dashed border-p-100 ${isOpen ? 'border-b-0' : 'border-b-2'}`}>
              {title}
            </span>
            <div className="ml-4">
              <ChevronDown
                className={`h-5 w-5 transform fill-current transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </h3>
        </button>
        {isOpen && (
          <>
            <p className="mt-6">{text}</p>
            {!isMediumScreen && (
              <img src={img} aria-hidden="true" alt="" className="mt-6 h-60 rounded-lg" />
            )}
          </>
        )}
      </div>
    </div>
  );
}

TutorialBlock.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  text: PropTypes.string,
  img: PropTypes.string,
};
