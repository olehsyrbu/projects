import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepInfo } from '@/modules/survey/components';
import { ChevronRight24Filled as ChevronRight } from '@fluentui/react-icons';
import { Details, Summary } from '../Details';
import phoneIconSrc from '../../assets/phone-icon.svg';
import { useOrganization } from '@/modules/organization';

export function EmergencyStep() {
  let survey = useSurvey();
  let organization = useOrganization();

  let hasNCSUsubdomain = organization?.subdomain === 'ncsu';
  let crisisPhoneNumber = organization?.crisisPhoneNumber || '988';
  let crisisTextNumber = organization?.crisisTextNumber || '741741';

  return (
    <article className="survey-step pb-10">
      <SurveyStepInfo />
      <h1>We hear that you are struggling and want to help you get the resources you need</h1>
      <p className="!mb-1 text-xl font-bold !leading-normal text-heading md:!mb-4 md:text-2xl">
        Get help now
      </p>
      <p>Your conversations are confidential and will not be shared with MiResource.</p>

      <Details>
        <Summary>Talk on the phone with a crisis counselor</Summary>
        {hasNCSUsubdomain ? (
          <>
            <p className="leading-relaxed">National suicide and crisis lifeline</p>
            <p className="text-2xl font-bold leading-normal">
              <a className="block text-2xl font-bold text-p-100" href={`tel:988`}>
                988
              </a>
            </p>
            <p className="leading-relaxed">The NCSU crisis line</p>
            <p className="text-2xl font-bold leading-normal">
              <a className="block text-2xl font-bold text-p-100" href={`tel:${crisisPhoneNumber}`}>
                {crisisPhoneNumber}
              </a>
            </p>
          </>
        ) : (
          <>
            <p className="leading-relaxed">National suicide prevention lifeline</p>
            <p className="text-2xl font-bold leading-normal">
              <a className="text-p-100" href={`tel:${crisisPhoneNumber}`}>
                {crisisPhoneNumber}
              </a>
            </p>
          </>
        )}
      </Details>

      <Details>
        <Summary>Text a crisis counselor</Summary>
        {hasNCSUsubdomain && (
          <>
            <a
              className="text-p-100 underline"
              target="_blank"
              href={`https://988lifeline.org/chat/`}
              rel="noreferrer"
            >
              National chat function
            </a>
            <a className="block text-2xl font-bold text-p-100" href={`sms:${988}&body=HOME`}>
              988
            </a>
          </>
        )}
        <p className="leading-relaxed">Crisis textline</p>
        <p className="text-2xl font-bold leading-normal">
          Text HOME to{' '}
          <a className="text-p-100" href={`sms:${crisisTextNumber}&body=HOME`}>
            {crisisTextNumber}
          </a>
        </p>
      </Details>

      <div className="mb-8 mt-6 flex flex-col items-center rounded bg-background px-3 py-6 shadow-[0_4px_33px_rgba(0,0,0,0.1)] md:mb-12 md:mt-8 md:flex-row md:px-10 md:py-7 md:pr-14">
        <img
          className="mb-3 md:mb-0 md:mr-8"
          src={phoneIconSrc}
          width="44"
          height="44"
          alt=""
          aria-hidden="true"
        />
        <p className="text-center font-serif text-xl leading-snug text-heading md:text-left">
          If you are in need of emergency care please call{' '}
          <a className="whitespace-nowrap text-p-100" href="tel:911">
            9-1-1
          </a>{' '}
          or go to your nearest emergency room.
        </p>
      </div>

      <div className="flex flex-col items-center md:flex-row md:pl-10 md:pr-20">
        <p className="mb-6 text-center font-medium leading-tight text-hint md:mb-0 md:mr-14 md:text-left">
          I am not in immediate danger of hurting myself or anyone else. I'd like to find someone
          for on-going care.
        </p>
        <button className="mir-button" onClick={survey.navigateNext}>
          <span>Proceed</span>
          <ChevronRight />
        </button>
      </div>
    </article>
  );
}
