import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Survey, SurveyStep } from '@/modules/survey/components';
import { ProgramGeneralInfo } from './ProgramGeneralInfo';
import { ProgramLocation } from './ProgramLocation';
import { ProgramEligibility } from './ProgramEligibility';
import { ProgramAvailability } from './ProgramAvailability';
import { ProgramAmenities } from './ProgramAmenities';
import { ProgramPhotos } from './ProgramPhotos';
import { ProgramContacts } from './ProgramContacts';
import { ProgramPayment } from './ProgramPayment';
import { ProgramLicense } from './ProgramLicense';
import { ProgramConfirmation } from './ProgramConfirmation';
import { getSingleProgramStep } from './getSingleProgramStep';

export function SingleProgramSurvey({
  program,
  shouldRestart,
  onProgramCreate,
  onExitBack,
  onFinish,
}) {
  /* eslint-disable react-hooks/exhaustive-deps */
  const step = useMemo(() => getSingleProgramStep(program), []);

  const hasLocation = program?.inPerson?.available && program?.locations?.length > 0;

  return (
    <Survey initialStep={shouldRestart ? 1 : step}>
      <SurveyStep
        element={
          <ProgramGeneralInfo program={program} onCreate={onProgramCreate} onBack={onExitBack} />
        }
      />
      <SurveyStep element={<ProgramLocation program={program} />} />
      <SurveyStep element={<ProgramEligibility program={program} />} />
      <SurveyStep element={<ProgramAvailability program={program} />} />
      {hasLocation && <SurveyStep element={<ProgramAmenities program={program} />} />}
      {hasLocation && <SurveyStep element={<ProgramPhotos program={program} />} />}
      <SurveyStep element={<ProgramContacts program={program} />} />
      <SurveyStep element={<ProgramPayment program={program} />} />
      <SurveyStep element={<ProgramLicense program={program} />} />
      <SurveyStep element={<ProgramConfirmation program={program} onNext={onFinish} />} />
    </Survey>
  );
}

SingleProgramSurvey.propTypes = {
  program: PropTypes.object,
  shouldRestart: PropTypes.bool,
  onProgramCreate: PropTypes.func,
  onExitBack: PropTypes.func,
  onFinish: PropTypes.func,
};

SingleProgramSurvey.defaultProps = {
  onProgramCreate: () => {},
  onExitBack: () => {},
  onFinish: () => {},
};
