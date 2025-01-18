import PropTypes from 'prop-types';
import { ProgramLicenseForm } from '../ProgramLicenseForm';
import { useUpdateProgram } from '@/core/api/ProgramQueries';
import { useSurvey } from '@/modules/survey/hooks';
import mixpanel from '@/core/mixpanel';

export function ProgramLicense({ program }) {
  let survey = useSurvey();
  let update = useUpdateProgram();

  async function handleSubmit(data) {
    if (data) {
      await update(program.id, data);
      mixpanel.track('Single program license step');
    }
    survey.navigateNext();
  }

  return <ProgramLicenseForm program={program} onSubmit={handleSubmit} />;
}

ProgramLicense.propTypes = {
  program: PropTypes.object,
};
