import { parseAbilities } from './parseAbilities';

it('parse conditions to objects', () => {
  const rules = [
    {
      subject: 'Provider',
      action: ['read', 'unaffiliate', 'delete', 'paginate'],
      conditions: ['{"owner.organization.id":"571c9349-502a-47ce-9aee-24f780891fa8"}'],
    },
    {
      subject: 'Invitation',
      action: ['read', 'write', 'delete', 'create', 'paginate'],
      conditions: ['{"owner.organization.id":"571c9349-502a-47ce-9aee-24f780891fa8"}'],
    },
  ];

  const actual = parseAbilities(rules);

  expect(actual).toMatchSnapshot();
});

it('parse attributes without conditions', () => {
  const rules = [
    {
      subject: 'Provider',
      action: ['read', 'unaffiliate', 'delete', 'paginate'],
    },
    {
      subject: 'Invitation',
      action: ['read', 'write', 'delete', 'create', 'paginate'],
    },
  ];

  const actual = parseAbilities(rules);

  expect(actual).toMatchSnapshot();
});
