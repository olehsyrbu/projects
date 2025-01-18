import { useFlags } from 'launchdarkly-react-client-sdk';

export function useFlag(flag) {
  let flags = useFlags();
  return flags?.[flag];
}
