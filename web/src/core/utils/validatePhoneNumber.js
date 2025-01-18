import { addMethod, string } from 'yup';
import isMobilePhone from 'validator/es/lib/isMobilePhone';

addMethod(string, 'phone', function phone(message, locale, options) {
  return this.test('is-phone', message, (value) => {
    return value === '' || isMobilePhone(value, locale, options);
  });
});
