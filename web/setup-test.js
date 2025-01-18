import '@testing-library/jest-dom/vitest';
import { Crypto } from '@peculiar/webcrypto';
import { defineMatchMediaGlobally } from '@/tools/app-test-utils/matchMediaMock';

defineMatchMediaGlobally();

global.crypto.subtle = new Crypto().subtle;
global.CSS = { supports: () => true };
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.mock('@fluentui/react-icons', () => ({
  AddCircle24Filled: () => null,
  ArrowEnterLeft24Filled: () => null,
  CalendarLtr24Filled: () => null,
  Checkmark12Filled: () => null,
  CheckmarkCircle16Filled: () => null,
  ChevronDown24Filled: () => null,
  ChevronLeft24Filled: () => null,
  ChevronRight20Filled: () => null,
  ChevronRight24Filled: () => null,
  Clock16Filled: () => null,
  Delete16Filled: () => null,
  Dismiss12Filled: () => null,
  Dismiss16Filled: () => null,
  Dismiss24Filled: () => null,
  DismissCircle20Filled: () => null,
  DismissCircle24Filled: () => null,
  DocumentAdd24Regular: () => null,
  Edit16Filled: () => null,
  Edit20Filled: () => null,
  Eraser20Filled: () => null,
  ImageAdd24Filled: () => null,
  Info24Regular: () => null,
  Mail12Regular: () => null,
  Mail16Regular: () => null,
  Notepad24Filled: () => null,
  QuestionCircle16Filled: () => null,
}));
