import { useRef, useEffect } from 'react';

/**
 * Assign event listener effect to target element
 * @see EventTarget.addEventListener
 * @param {EventTarget} target - event target
 * @param {String} event - event name
 * @param {Function} callback  - your listener
 * @param {Boolean|AddEventListenerOptions} [options] - useCapture or event listener options
 */

export function useEventListener(target, event, callback, options) {
  let callbackRef = useRef();
  callbackRef.current = callback;

  useEffect(() => {
    let listener = (event) => callbackRef.current(event);
    target.addEventListener(event, listener, options);
    return () => {
      target.removeEventListener(event, listener, options);
    };
  }, [target, event, options]);
}
