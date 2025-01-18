import { getPreferredContacts } from './getPreferredContacts';

it('return empty array', () => {
  expect(getPreferredContacts({ preferredContacts: [] })).toEqual([]);
});

it('return email', () => {
  expect(getPreferredContacts({ email: '123@gmail.com', preferredContacts: ['EMAIL'] })).toEqual([
    '123@gmail.com',
  ]);
});

it('return only email, because in program mobile is empty', () => {
  expect(
    getPreferredContacts({ email: '123@gmail.com', preferredContacts: ['EMAIL', 'MOBILE'] }),
  ).toEqual(['123@gmail.com']);
});

it('return email and mobile', () => {
  expect(
    getPreferredContacts({
      email: '123@gmail.com',
      mobile: '777777777',
      preferredContacts: ['EMAIL', 'MOBILE'],
    }),
  ).toEqual(['123@gmail.com', '777777777']);
});

it('return email mobile onlineScheduler', () => {
  expect(
    getPreferredContacts({
      email: '123@gmail.com',
      mobile: '777777777',
      onlineScheduler: 'scheduleSite',
      preferredContacts: ['EMAIL', 'MOBILE', 'ONLINE_SCHEDULER'],
    }),
  ).toEqual(['123@gmail.com', '777777777', 'scheduleSite']);
});
