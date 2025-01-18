import { renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

it('created debounce effect on init', () => {
  const result = vi.fn().mockReturnValue();
  result.cancel = vi.fn();
  const func = vi.fn().mockReturnValue(result);
  const timeout = 400;
  const value = 3;

  renderHook(() => useDebounce(value, timeout, func));

  expect(func.mock.calls[0][0]).toBeInstanceOf(Function);
  expect(func.mock.calls[0][1]).toEqual(timeout);
  expect(result).toHaveBeenCalledWith(value);
});

it('clean up debounce execution on unmount', () => {
  const result = vi.fn();
  result.cancel = vi.fn();
  const func = vi.fn().mockReturnValue(result);
  const timeout = 400;
  const value = 3;

  const { unmount } = renderHook(() => useDebounce(value, timeout, func));

  unmount();

  expect(result.cancel).toHaveBeenCalledTimes(1);
});
