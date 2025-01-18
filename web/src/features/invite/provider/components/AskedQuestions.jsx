import { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown16Filled as ChevronDown } from '@fluentui/react-icons';
import { useScreen } from '@/core/hooks';

export function AskedQuestions() {
  const isMediumScreen = useScreen('md');
  const [isShowMore, setIsShowMore] = useState(false);
  const [activeAccIndex, setActiveAccIndex] = useState(null);

  const handleToggleAccordion = (index) => {
    setActiveAccIndex(activeAccIndex === index ? null : index);
  };

  return (
    <div className="flex w-full flex-col items-center bg-p-100 text-background ">
      <div className="flex flex-col items-center pb-14 md:mx-0 md:min-w-[65rem] md:pb-28">
        <div className="mx-9 md:mx-0">
          <h2 className="pt-10 text-center font-serif text-2xl font-bold md:pt-16 md:text-left md:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mt-10 flex grid gap-x-10 gap-y-3 md:grid-cols-2 md:gap-y-0">
            <div className="space-y-3">
              <Accordion
                title="What if I don’t have any openings in my schedule?"
                text='You can mark your public availability as "Not available" or "Please inquire." You can update your availability from the email reminders we send you with one click. You don’t even have to log in.'
                isOpen={activeAccIndex === 0}
                toggleAccordion={() => handleToggleAccordion(0)}
              />
              <Accordion
                title="Will there be a cost in the future?"
                text="No. MiResource is focused on creating barrier-free access to mental health care."
                isOpen={activeAccIndex === 1}
                toggleAccordion={() => handleToggleAccordion(1)}
              />
              <Accordion
                title="How are potential clients identified?"
                text="We cultivate relationships with institutions of higher education that need off-campus care for their students and with insurance payors who make the platform available to their members. These clients can use MiResource to find multiple levels of care."
                isOpen={activeAccIndex === 2}
                toggleAccordion={() => handleToggleAccordion(2)}
              />
              {(isShowMore || isMediumScreen) && (
                <>
                  <Accordion
                    title="Can I delegate someone else to manage my profile?"
                    text='Yes. Once you have created your profile (it’s quick and easy), you can delegate someone else to manage it. You can even identify someone else to receive your account notifications and update your availability. Once you complete onboarding, you will go to your dashboard, you can go to your "my resources" tab, select "share" on your profile listing, and add the email address of the person you want to share access.'
                    isOpen={activeAccIndex === 3}
                    toggleAccordion={() => handleToggleAccordion(3)}
                  />
                  <Accordion
                    title="How are treatment providers and programs selected for MiResource?"
                    text="MiResource is an invitation-only database for those providers and programs vetted by institutions of higher education and insurance payors."
                    isOpen={activeAccIndex === 4}
                    toggleAccordion={() => handleToggleAccordion(4)}
                  />
                </>
              )}
            </div>
            {(isShowMore || isMediumScreen) && (
              <div className="space-y-3">
                <Accordion
                  title="A friend of mine told me about MiResource; how can I join?"
                  text="If you have yet to receive a personal invitation link from a referral coordinator in a university or an insurance company that uses MiResource to connect their clients to care, then feel free to reach out to our support team (support@miresource.com) with the request. Please provide our support team with the information on what state you are licensed to practice. This will help us provide you with the right contacts and proceed further with your request!"
                  isOpen={activeAccIndex === 5}
                  toggleAccordion={() => handleToggleAccordion(5)}
                />
                <Accordion
                  title="What levels of care are available?"
                  text="We are committed to helping people find the right treatment match within the right level of care for their needs. We include care options that range from outpatient to inpatient and everything in between."
                  isOpen={activeAccIndex === 6}
                  toggleAccordion={() => handleToggleAccordion(6)}
                />
                <Accordion
                  title="Do I have to switch to an online scheduler to use MiResource?"
                  text="No. At MiResource, we have built a system that integrates with your preferred scheduling flow: email, phone, or online scheduling."
                  isOpen={activeAccIndex === 7}
                  toggleAccordion={() => handleToggleAccordion(7)}
                />
                <Accordion
                  title="I would like to add the other providers from my group practice, how can I do that?"
                  text="This option is available through our onboarding flow specific to group practice administrators. If you are interested in this option, don't hesitate to contact our customer support team (support@miresource.com) so we can provide a personal invitation link to your group practice admin. This will allow them to add each provider to your practice and keep their information up-to-date."
                  isOpen={activeAccIndex === 8}
                  toggleAccordion={() => handleToggleAccordion(8)}
                />
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsShowMore(!isShowMore)}
          className="mt-8 w-fit border-b-2 border-dotted text-center font-medium md:hidden"
        >
          {isShowMore ? 'Show less' : 'Show more'}
        </button>
      </div>
    </div>
  );
}

function Accordion({ title, text, isOpen, toggleAccordion }) {
  return (
    <div className="border-p-60 h-fit rounded-xl border text-base md:w-[31rem]">
      <div className="px-4 py-4 md:px-6">
        <button className="w-full" tabIndex="0" aria-label={title} onClick={toggleAccordion}>
          <h3 className="flex cursor-pointer items-center justify-between text-left font-bold">
            <span>{title}</span>
            <div className="ml-4">
              <ChevronDown
                className={`h-6 w-6 transform  fill-current transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </h3>
        </button>
        {isOpen && <p className="whitespace-break-spaces pt-3">{text}</p>}
      </div>
    </div>
  );
}

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  toggleAccordion: PropTypes.func.isRequired,
};
