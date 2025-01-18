import PropTypes from 'prop-types';
import { SurveyStepControls } from '@/modules/survey/components';
import { useAppletContext } from '@/modules/mindlogger/hooks';

export function AppletContent({ onNext }) {
  const { activities } = useAppletContext();

  return (
    <article className="survey-step text-lg leading-7">
      <p className="md:mt-14">
        We have {activities.length} questionnaires for you to fill out. You can move between
        questions, but you have to finish each questionnaire before advancing to the next one.
      </p>
      <p className="mb-4 mt-8">We will be asking questions from the following questionnaires:</p>
      <div className="mb-16 max-w-xl md:mb-12 ">
        {activities.map((activity, index) => (
          <div key={index} className="mb-4 flex items-center rounded-2xl bg-white px-6 py-3">
            <span className="flex h-8 min-w-[2rem] items-center justify-center rounded-full bg-p-100 text-white">
              {index + 1}
            </span>
            <span className="ml-3 text-heading">{activity.name.en}</span>
          </div>
        ))}
      </div>
      <SurveyStepControls
        hasChevrons={false}
        hasBackControl={false}
        nextButtonLabel="Next"
        onNext={onNext}
        hasEnterPrompt={false}
      />
    </article>
  );
}

AppletContent.propTypes = {
  onNext: PropTypes.func,
};
