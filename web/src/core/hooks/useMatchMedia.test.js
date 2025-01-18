import { renderHook } from '@testing-library/react';
import { createMediaQueryListMock } from '@/tools/app-test-utils/matchMediaMock';
import { useMatchMedia } from '@/core/hooks';

it('runs check over matchMedia with non-deprecated', () => {
  let query = '(min-width: 768px)';
  const mql = createMediaQueryListMock({ query, value: true });

  const target = {
    matchMedia: vi.fn().mockReturnValue(mql),
  };

  const { result } = renderHook(() => useMatchMedia(query, target));

  expect(target.matchMedia).toHaveBeenCalledTimes(1);
  expect(target.matchMedia).toHaveBeenCalledWith(query);
  expect(result.current).toBe(true);
  expect(mql.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
});

it('runs check over matchMedia with deprecated', () => {
  let query = '(min-width: 768px)';

  const mql = createMediaQueryListMock({ query, value: true });
  delete mql.addEventListener;

  const target = {
    matchMedia: vi.fn().mockReturnValue(mql),
  };

  const { result } = renderHook(() => useMatchMedia(query, target));

  expect(target.matchMedia).toHaveBeenCalledTimes(1);
  expect(target.matchMedia).toHaveBeenCalledWith(query);
  expect(result.current).toBe(true);
  expect(mql.addListener).toHaveBeenCalledWith(expect.any(Function));
});

it('calls non-deprecated remove listener on unmount', () => {
  let query = '(min-width: 768px)';

  const mql = createMediaQueryListMock({ query, value: true });
  const target = {
    matchMedia: vi.fn().mockReturnValue(mql),
  };

  const { unmount } = renderHook(() => useMatchMedia(query, target));

  unmount();

  expect(mql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  expect(mql.removeListener).not.toHaveBeenCalled();
});

it('calls deprecated remove listener on unmount', () => {
  let query = '(min-width: 768px)';

  const mql = createMediaQueryListMock({ query, value: true });

  delete mql.removeEventListener;
  const target = {
    matchMedia: vi.fn().mockReturnValue(mql),
  };

  const { unmount } = renderHook(() => useMatchMedia(query, target));

  unmount();

  expect(mql.removeListener).toHaveBeenCalledWith(expect.any(Function));
});
