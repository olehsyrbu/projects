import { useMemo } from 'react';
import { evaluateScreenExpression } from './helpers';

export function getVisibleScreens(screens, responses) {
  return screens
    .map((screen, index) => ({
      ...screen,
      response: responses[index],
    }))
    .filter(({ visibility }) => evaluateScreenExpression(visibility, screens, responses));
}

export function useVisibleScreens(screens, responses) {
  return useMemo(() => {
    return screens
      .map((screen, index) => ({
        ...screen,
        response: responses[index],
      }))
      .filter(({ visibility }) => evaluateScreenExpression(visibility, screens, responses));
  }, [screens, responses]);
}
