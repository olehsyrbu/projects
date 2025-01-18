import useSWR from 'swr';
import { fetchStates } from './StatesAPI';

export function useStates() {
  let { data: states } = useSWR(['states'], fetchStates, { suspense: true });
  return states;
}
