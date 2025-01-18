import { useContext } from 'react';
import { GuidedSearchContext } from '../GuidedSearchContext';

export function useGuidedSearchState() {
  return useContext(GuidedSearchContext);
}
