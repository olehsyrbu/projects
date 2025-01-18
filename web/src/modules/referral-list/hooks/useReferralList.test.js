import { useReferralList } from './useReferralList';
import { renderHook, act } from '@testing-library/react';

let initialState = useReferralList.getState();

afterEach(() => {
  useReferralList.setState(initialState);
});

describe('useReferralList', () => {
  it('useReferralList: check init empty state', () => {
    let { result } = renderHook(() => useReferralList());
    expect(result.current.providers).toEqual([]);
  });

  it('useReferralList: addProvider', () => {
    let { result } = renderHook(() => useReferralList());

    act(() => {
      result.current.addProvider({ id: 1, note: 'Provider 1' });
    });

    expect(result.current.providers).toEqual([{ id: 1, note: 'Provider 1' }]);
  });

  it('useReferralList: addProvider item twice should be removed', () => {
    let { result } = renderHook(() => useReferralList());

    act(() => {
      result.current.addProvider({ id: 1, note: 'Provider 1' });
      result.current.addProvider({ id: 1, note: 'Provider 1' });
    });

    expect(result.current.providers).toEqual([]);
  });

  it('useReferralList: removeProvider', () => {
    let { result } = renderHook(() => useReferralList());

    act(() => {
      result.current.addProvider({ id: 1, note: 'note text' });
      result.current.removeProvider(1);
    });

    expect(result.current.providers).toEqual([]);
  });

  it('useReferralList: clear', () => {
    let { result } = renderHook(() => useReferralList());

    act(() => {
      result.current.addProvider({ id: 1, note: 'note text 1' });
      result.current.addProvider({ id: 2, note: 'note text 2' });
      result.current.clear();
    });

    expect(result.current.providers).toEqual([]);
  });

  it('useReferralList: setProviderNote', () => {
    let { result } = renderHook(() => useReferralList());

    act(() => {
      result.current.addProvider({ id: 1, note: 'note text 1' });
      result.current.addProvider({ id: 2, note: 'note text 2' });
      result.current.setProviderNote(2, 'custom note text');
    });

    expect(result.current.providers[1].note).toBe('custom note text');
  });
});
