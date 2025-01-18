import { useState, useEffect } from 'react';
import { debounce as _debounce } from 'lodash-es';

export function useDebounce(value, timeout = 350, debounce = _debounce) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    let changeState = debounce(setDebounced, timeout);

    changeState(value);

    return () => {
      changeState.cancel();
    };
  }, [value, timeout, debounce]);

  return debounced;
}
