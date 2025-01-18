import { useState, useEffect } from 'react';
import { useResolvedPath, useMatch } from 'react-router-dom';
import { useFlags } from 'launchdarkly-react-client-sdk';
import mixpanel from '@/core/mixpanel';
import { Header } from '@/modules/app-shell';
import { Survey, SurveyStep } from '@/modules/survey/components';
import { GuidedSearchContext } from '../GuidedSearchContext';
import { getStepNumber, storage } from '../utils';
import {
  DiagnosisStep,
  HadSuicideThoughtsStep,
  HaveSuicideThoughtsStep,
  LocationStep,
  PreviousVisitStep,
  ProblemStep,
  SpecialistStep,
  EligibilityStep,
} from './steps';
import { EmergencyMessage } from './EmergencyMessage';
import { useOrganization, useOrganizationTheme, OrganizationTypes } from '@/modules/organization';

let initialState = {
  problem: [],
  hadVisitedSpecialist: null,
  previousDiagnosis: [],
  otherDiagnoses: [],
  programTypes: [],
  hadSuicidalThoughts: null,
  haveSuicidalThoughts: null,
  lookingFor: [],
  location: '',
};

export function GuidedSearch() {
  let resolved = useResolvedPath('');
  let exactMatch = useMatch(resolved.pathname);
  let organization = useOrganization();
  let flags = useFlags();

  let [state, setState] = useState(() => {
    let storedState = storage.read() ?? initialState;
    return exactMatch ? initialState : storedState;
  });

  function updateState(patch) {
    let newState = { ...state, ...patch };
    setState(newState);
    storage.write(newState);
  }

  useOrganizationTheme({
    enableFor: [OrganizationTypes.Insurance],
  });

  useEffect(() => {
    if (exactMatch) {
      storage.clear();
    }
  }, [exactMatch]);

  useEffect(() => {
    mixpanel.track('Guided Search Visit');
  }, []);

  return (
    <main className="grid min-h-screen grid-cols-1 grid-rows-[auto_1fr_auto] bg-surface">
      <Header />
      <GuidedSearchContext.Provider value={[state, updateState]}>
        <Survey initialStep={getStepNumber(state)}>
          <SurveyStep element={<ProblemStep />} />
          <SurveyStep element={<PreviousVisitStep />} />
          <SurveyStep element={<DiagnosisStep />} />
          <SurveyStep element={<HadSuicideThoughtsStep />} />
          <SurveyStep element={<HaveSuicideThoughtsStep />} />
          <SurveyStep element={<SpecialistStep />} />
          {flags.eligibility && organization?.subdomain === 'aetna' ? (
            <SurveyStep element={<EligibilityStep />} />
          ) : null}
          <SurveyStep element={<LocationStep />} />
        </Survey>
      </GuidedSearchContext.Provider>
      <EmergencyMessage />
    </main>
  );
}
