import { useMemo, useReducer, useEffect } from 'react';

/**
 * Runs match media check within browser api, allows constructing
 * query for any custom size, however in project we prefer usage of
 * predefined media checks
 * @see useScreen
 * @param query - match media query
 * @param target - match media provider
 * @return {boolean} - true if check passed, false otherwise
 */

export function useMatchMedia(query, target = window) {
  let mql = useMemo(() => target.matchMedia(query), [query, target]);
  let [, forceUpdate] = useReducer((s) => !s, false);

  useEffect(() => {
    if (mql.addEventListener) {
      mql.addEventListener('change', forceUpdate);
    } else if (mql.addListener) {
      // use deprecated method to support Safari before 14 version
      mql.addListener(forceUpdate);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', forceUpdate);
      } else if (mql.removeListener) {
        // use deprecated method to support Safari before 14 version
        mql.removeListener(forceUpdate);
      }
    };
  }, [mql]);

  return mql.matches;
}

export default useMatchMedia;
