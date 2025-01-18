import { SurveyStepControls } from '@/modules/survey/components';
import PropTypes from 'prop-types';
import { noop } from '@/core/utils';

export function AppletLanding({ onNext }) {
  return (
    <article className="survey-step text-lg leading-7">
      <h3 className="font-serif text-3xl font-bold">Nice to meet you!</h3>
      <p className="my-8">
        We are inviting you to complete this online questionnaire about how you are currently
        feeling. The questionnaire may take up to 15 minutes of your time to complete.
      </p>
      <p className="mb-12">
        By participating, you will contribute to the development of an online referral platform for
        mental health care that is freely available for public use.
      </p>
      <SurveyStepControls
        hasChevrons={false}
        hasBackControl={false}
        nextButtonLabel="Start"
        onNext={onNext}
        hasEnterPrompt={false}
      />
    </article>
  );
}

AppletLanding.propTypes = {
  onNext: PropTypes.func,
};

AppletLanding.defaultProps = {
  onNext: noop,
};
