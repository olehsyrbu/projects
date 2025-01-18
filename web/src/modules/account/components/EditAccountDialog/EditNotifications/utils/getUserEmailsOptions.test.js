import { getUserEmailsOptions } from './getUserEmailsOptions';

it('provides correct email options list', () => {
  const user = {
    notificationEmail: null,
    email: 'email@miresource.com',
    ownership: [
      {
        email: 'liubov+capo@miresource.com',
        gpa: [
          {
            email: 'liubov+gpatest@miresource.com',
          },
        ],
        sharedWith: [],
      },
    ],
  };

  const options = [
    { chip: undefined, label: 'email@miresource.com', value: 'email@miresource.com' },
    { chip: 'GPA', label: 'liubov+gpatest@miresource.com', value: 'liubov+gpatest@miresource.com' },
    { chip: undefined, label: 'liubov+capo@miresource.com', value: 'liubov+capo@miresource.com' },
  ];

  expect(getUserEmailsOptions(user)).toEqual(options);
});
