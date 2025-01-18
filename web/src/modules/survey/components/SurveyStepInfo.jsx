import { useSurvey } from '../hooks';

export function SurveyStepInfo() {
  let survey = useSurvey();
  return (
    <p className="mb-4 pl-0.5 font-bold leading-normal text-p-100">
      Step {survey.step} of {survey.totalSteps}
    </p>
  );
}
