import mixpanel from '@/core/mixpanel';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepInfo } from '@/modules/survey/components';
import { useSelectedCompany, CompanySelect, CompanyBenefits } from '@/modules/eligibility';
import { Controls } from '../Controls';

export function EligibilityStep() {
  let survey = useSurvey();
  let company = useSelectedCompany();

  function goNext() {
    survey.navigateNext();
    mixpanel.track('Guided Search Eligibility Step');
  }

  return (
    <article className="survey-step">
      <SurveyStepInfo />
      <h1>What company are you affiliated with?</h1>

      <p>Copy to clarify here</p>

      <div className="space-y-6">
        <CompanySelect />
        {company.id ? <CompanyBenefits companyId={company.id} /> : null}
      </div>

      <Controls onNext={goNext} />
    </article>
  );
}
