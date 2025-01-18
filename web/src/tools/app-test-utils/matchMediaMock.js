export function createMediaQueryListMock({ query, value } = {}) {
  return {
    matches: value,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
}

export function defineMatchMediaGlobally(value = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => createMediaQueryListMock({ query, value })),
  });
}
