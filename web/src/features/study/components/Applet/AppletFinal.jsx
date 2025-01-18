import PropTypes from 'prop-types';
import { CallOutbound24Filled as CallOutbound } from '@fluentui/react-icons';
import { SurveyStepControls } from '@/modules/survey/components';
import { useOrganization } from '@/modules/organization';

export function AppletFinal({ onNext }) {
  let organization = useOrganization();

  let crisisPhoneNumber = organization?.crisisPhoneNumber || '988';
  let crisisTextNumber = organization?.crisisTextNumber || '741741';

  return (
    <article className="survey-step text-xl md:!max-w-[53rem]">
      <h3 className="font-serif text-3xl">Your answers have been sent.</h3>
      <h5 className="mb-2 mt-6 text-xl">Thank you for participating!</h5>
      <p className="mb-12">
        If you want to get connected to mental healthcare, you can use{' '}
        <a href="https://miresource.com" target="_blank" rel="noreferrer">
          miresource.com
        </a>{' '}
        for free to find a provider or program that matches your needs or contact your university’s
        counseling center.
      </p>
      <p>If you are struggling and need help now, you can:</p>

      <div className="mt-8 rounded-3xl bg-white p-8">
        <div className="justify-between text-xl md:flex">
          <div>
            <p className="font-bold">Talk on the phone with a crisis counselor</p>
            <p className="mt-2">
              National suicide prevention lifeline -{' '}
              <a className="text-2xl font-bold" href={`tel:${crisisPhoneNumber}`}>
                {crisisPhoneNumber}
              </a>
            </p>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="font-bold">Text a crisis counselor</p>
            <p className="mt-2">
              Crisis textline -
              <a
                className="text-2xl font-bold"
                href={`sms:${crisisTextNumber}&body=HOME`}
              >{` Text HOME to ${crisisTextNumber}`}</a>
            </p>
          </div>
        </div>
        <div className="flex-column mt-10 flex flex-col items-center justify-center rounded-3xl border-solid border-warning-2 px-8 py-4 font-serif text-xl font-bold md:flex-row md:justify-start">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-warning-2">
            <CallOutbound fill="var(--text-inverted)" />
          </div>
          <div className="mt-4 md:ml-11 md:mt-0">
            <p>If you are in need of emergency care please call 9-1-1 </p>
            <p>or go to your nearest emergency room.</p>
          </div>
        </div>
      </div>
      <SurveyStepControls
        hasBackControl={false}
        hasChevrons={false}
        nextButtonLabel="Restart"
        onNext={onNext}
        hasEnterPrompt={false}
      />
    </article>
  );
}

AppletFinal.propTypes = {
  onNext: PropTypes.func,
};

AppletFinal.defaultProps = {
  onNext: () => {},
};
