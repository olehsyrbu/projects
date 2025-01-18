import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { noop } from '@/core/utils';
import { Survey, SurveyStep } from '@/modules/survey/components';
import { MultiProgramGeneralInfo } from './MultiProgramGeneralInfo';
import { MultiProgramLocation } from './MultiProgramLocation';
import { MultiProgramConfirmation } from './MultiProgramConfirmation';
import { MultiProgramType } from './MultiProgramType';
import { MultiProgramPayment } from './MultiProgramPayment';
import { getMultiProgramStep } from './getMultiProgramStep';
import { MultiProgramAmenities } from './MultiProgramAmenities';
import { MultiProgramLicense } from './MultiProgramLicense';
import { MultiProgramContacts } from './MultiProgramContacts';
import { MultiProgramPhotos } from './MultiProgramPhotos';

export function MultipleProgramSurvey({ draft, onReturn, onFinish }) {
  const hasLocation = draft?.program?.inPerson?.available && draft?.program?.locations?.length > 0;
  const step = useMemo(() => getMultiProgramStep(draft, hasLocation), []);

  return (
    <Survey initialStep={step}>
      <SurveyStep element={<MultiProgramGeneralInfo draft={draft} onPrevious={onReturn} />} />
      <SurveyStep element={<MultiProgramLocation draft={draft} />} />
      {hasLocation && <SurveyStep element={<MultiProgramAmenities draft={draft} />} />}
      <SurveyStep element={<MultiProgramType draft={draft} />} />
      {hasLocation && <SurveyStep element={<MultiProgramPhotos draft={draft} />} />}
      <SurveyStep element={<MultiProgramContacts draft={draft} />} />
      <SurveyStep element={<MultiProgramPayment draft={draft} />} />
      <SurveyStep element={<MultiProgramLicense draft={draft} />} />
      <SurveyStep element={<MultiProgramConfirmation draft={draft} onNext={onFinish} />} />
    </Survey>
  );
}

MultipleProgramSurvey.propTypes = {
  draft: PropTypes.object,
  onReturn: PropTypes.func,
  onFinish: PropTypes.func,
};

MultipleProgramSurvey.defaultProps = {
  onReturn: noop,
  onFinish: noop,
};
