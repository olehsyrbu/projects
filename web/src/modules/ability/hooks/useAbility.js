import { useAbility as _useAbility } from '@casl/react';
import { AbilityContext } from '../components';

export function useAbility() {
  return _useAbility(AbilityContext);
}
