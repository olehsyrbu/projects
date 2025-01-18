import { formatPhoneNumber } from './formatPhoneNumber';

it('should correctly format US phone number', () => {
  expect(formatPhoneNumber('12345678900')).toBe('1 (234) 567-8900');
  expect(formatPhoneNumber('2345678900')).toBe('(234) 567-8900');

  expect(formatPhoneNumber('1 234 567-8900')).toBe('1 (234) 567-8900');
  expect(formatPhoneNumber('234 567-8900')).toBe('(234) 567-8900');

  expect(formatPhoneNumber('34 567 8900')).toBe('34 567 8900');
});
