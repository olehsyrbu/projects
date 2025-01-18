import { renderHook } from '@testing-library/react';
import { useEventListener } from './useEventListener';

it('subscribes target to an event', () => {
  let target = document.createElement('div');
  let callback = vi.fn();

  renderHook(() => useEventListener(target, 'customevent', callback));

  let customEvent = new CustomEvent('customevent');
  target.dispatchEvent(customEvent);

  expect(callback).toHaveBeenCalledWith(customEvent);
});
