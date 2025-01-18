import PropTypes from 'prop-types';
import { useSurvey } from '@/modules/survey/hooks';
import { ProgramLicenseForm } from '../ProgramLicenseForm';
import { useUpdateProgramDraft } from '@/core/api/ProgramDraftQueries';
import mixpanel from '@/core/mixpanel';

export function MultiProgramLicense({ draft }) {
  let survey = useSurvey();
  let update = useUpdateProgramDraft();

  async function handleSubmit(program) {
    if (program) {
      await update({ program });

      mixpanel.track('Multiple program license step');
    }

    survey.navigateNext();
  }

  return <ProgramLicenseForm program={draft.program} onSubmit={handleSubmit} />;
}

MultiProgramLicense.propTypes = {
  draft: PropTypes.object,
};
