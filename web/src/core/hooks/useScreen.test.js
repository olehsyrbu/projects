import { renderHook } from '@testing-library/react';
import { useScreen } from './useScreen';
import { defineMatchMediaGlobally } from '@/tools/app-test-utils/matchMediaMock';

it('runs check medium screen', () => {
  defineMatchMediaGlobally(true);

  let result;

  renderHook(() => {
    result = useScreen('md');
  });

  expect(result).toBeTruthy();
  expect(window.matchMedia).toHaveBeenCalledTimes(1);
  expect(window.matchMedia).toHaveBeenLastCalledWith('(min-width: 768px)');
});
