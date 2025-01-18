import { useContext } from 'react';
import { SurveyContext } from '../SurveyContext';

export function useSurvey() {
  return useContext(SurveyContext);
}
