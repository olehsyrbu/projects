import { toAbility } from './toAbility';
import { Ability, PureAbility, defineAbility, subject } from '@casl/ability';

it('creates ability by default with empty array', () => {
  const actual = toAbility();

  expect(actual instanceof PureAbility).toBeTruthy();

  expect(actual.rules).toEqual([]);

  expect(actual.can('read', 'all')).toBeFalsy();
});

it('creates from simple rules', () => {
  let rules = [
    {
      action: 'read',
      subject: 'all',
    },
  ];
  const actual = toAbility(rules);

  expect(actual.rules).toEqual(rules);
  expect(actual.can('read', 'all')).toBeTruthy();
});

it('use for feature toggle', () => {
  let rules = [
    {
      action: 'use',
      subject: 'ManageTeamsFeature',
    },
  ];
  const actual = toAbility(rules);

  expect(actual.rules).toEqual(rules);
  expect(actual.can('use', 'ManageTeamsFeature')).toBeTruthy();
});

it('check with conditions', () => {
  let rules = [
    {
      subject: 'Provider',
      action: ['read', 'unaffiliate', 'delete', 'paginate'],
      conditions: { id: 'some-demo-org-id' },
    },
  ];
  const actual = toAbility(rules);

  class Provider {
    constructor(attrs) {
      Object.assign(this, attrs);
    }
  }

  expect(
    actual.can(
      'read',
      new Provider({
        id: 'some-demo-org-id',
      }),
    ),
  ).toBeTruthy();
});

it('build manually', () => {
  const ability = defineAbility(function (can, cannot) {
    can('manage', 'Provider', { 'owner.organization.id': 'some-id-here' });
  });

  class Provider {
    constructor(attrs) {
      Object.assign(this, attrs);
    }
  }

  expect(
    ability.can(
      'manage',
      new Provider({
        owner: {
          organization: {
            id: 'some-id-here',
          },
        },
      }),
    ),
  ).toBeTruthy();
});

it('build from rules', () => {
  const ability = new Ability([
    {
      action: 'read',
      subject: 'Provider',
      conditions: { 'owner.organization.id': 'some-id-here' },
    },
  ]);

  class Provider {
    constructor(attrs) {
      Object.assign(this, attrs);
    }
  }

  expect(
    ability.can(
      'read',
      new Provider({
        owner: {
          organization: {
            id: 'some-id-here',
          },
        },
      }),
    ),
  ).toBeTruthy();
});

it('build from rules with subject helper', async () => {
  const ability = defineAbility(function (can, cannot) {
    can('manage', 'Provider', { 'owner.organization.id': 'some-id-here' });
  });

  expect(
    ability.can(
      'manage',
      subject('Provider', {
        owner: {
          organization: {
            id: 'some-id-here',
          },
        },
      }),
    ),
  ).toBeTruthy();

  expect(
    ability.can(
      'manage',
      subject('Provider', {
        owner: {
          organization: {
            id: 'booo',
          },
        },
      }),
    ),
  ).toBeFalsy();
});
