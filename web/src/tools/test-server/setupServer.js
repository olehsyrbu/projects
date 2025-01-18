import { handlers } from './handlers';
import { setupServer as _setupServer } from 'msw/node';

export function setupServer(items = handlers) {
  return _setupServer(...items);
}
