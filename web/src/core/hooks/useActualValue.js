import { useState, useLayoutEffect } from 'react';

export function useActualValue(ref, valueProp) {
  let [value, setValue] = useState('');
  let isControlled = valueProp !== undefined;

  useLayoutEffect(() => {
    if (isControlled) return;

    let element = ref.current;
    let update = () => setValue(element.value);

    update();

    element.addEventListener('input', update);
    return () => {
      element.removeEventListener('input', update);
    };
  }, [ref, isControlled]);

  return isControlled ? valueProp : value;
}
