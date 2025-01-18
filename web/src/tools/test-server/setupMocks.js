import { handlers } from './handlers';
import { setupWorker } from 'msw';

export function setupMocks(items = handlers) {
  return setupWorker(...items);
}
