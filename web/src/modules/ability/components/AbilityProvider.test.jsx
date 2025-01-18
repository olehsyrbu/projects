import { screen, render } from '@testing-library/react';
import { AbilityProvider } from './AbilityProvider';
import { AbilityContext, Can } from './AbilityContext';
import { subject } from '@casl/ability';
import { abilitiesFixture, organizationFixtures } from '@/tools/test-fixtures';
import { InvitationAction, invitationByOrganizationId } from '@/modules/auth/hooks';
import { useAbility } from '../hooks';

it('just render provider', () => {
  render(<AbilityProvider>Test</AbilityProvider>);

  expect(screen.getByText('Test')).toBeInTheDocument();
});

it('renders allowed functionality with component', () => {
  let rules = [
    {
      action: 'read',
      subject: 'all',
    },
  ];

  render(
    <AbilityProvider rules={rules}>
      <Can I="read" a="all">
        You can see me!
      </Can>
    </AbilityProvider>,
  );

  expect(screen.getByText('You can see me!')).toBeInTheDocument();
});

it('renders allowed functionality with component aka feature toggle', () => {
  let rules = [
    {
      action: 'manageTeams',
      subject: 'Feature',
    },
  ];

  render(
    <AbilityProvider rules={rules}>
      <Can I="manageTeams" a="Feature">
        You can see me!
      </Can>
    </AbilityProvider>,
  );

  expect(screen.getByText('You can see me!')).toBeInTheDocument();
});

it('check conditions', () => {
  let rules = [
    {
      subject: 'Provider',
      action: ['read', 'unaffiliate', 'delete', 'paginate'],
      conditions: { 'owner.organization.id': 'some-demo-org-id' },
    },
  ];

  render(
    <AbilityProvider rules={rules}>
      <Can
        I="read"
        a={subject('Provider', {
          owner: {
            organization: {
              id: 'some-demo-org-id',
            },
          },
        })}
      >
        You can see me!
      </Can>
    </AbilityProvider>,
  );

  expect(screen.getByText('You can see me!')).toBeInTheDocument();
});

it('renders allowed functionality with hook', () => {
  let rules = [
    {
      action: 'read',
      subject: 'all',
    },
  ];

  function MyComponent() {
    const ability = useAbility(AbilityContext);

    return <div>{ability.can('read', 'all') && 'You can see me!'}</div>;
  }

  render(
    <AbilityProvider rules={rules}>
      <MyComponent />
    </AbilityProvider>,
  );

  expect(screen.getByText('You can see me!')).toBeInTheDocument();
});

it('does not render forbidden functionality with component', () => {
  let rules = [
    {
      action: 'read',
      subject: 'all',
    },
  ];

  render(
    <AbilityProvider rules={rules}>
      <Can I="delete" a="all">
        You can see me!
      </Can>
    </AbilityProvider>,
  );

  expect(screen.queryByText('You can see me!')).not.toBeInTheDocument();
});

it('does not render forbidden functionality with hook', () => {
  let rules = [
    {
      action: 'read',
      subject: 'all',
    },
  ];

  function MyComponent() {
    const ability = useAbility();

    return <div>{ability.can('delete', 'all') && 'You can see me!'}</div>;
  }

  render(
    <AbilityProvider rules={rules}>
      <MyComponent />
    </AbilityProvider>,
  );

  expect(screen.queryByText('You can see me!')).not.toBeInTheDocument();
});

it('test with pass through, allowed', () => {
  const rules = abilitiesFixture.defaultReferralCoordinator();
  const org = organizationFixtures.demoOrganization();

  render(
    <AbilityProvider rules={rules}>
      <Can I={InvitationAction.Read} a={invitationByOrganizationId(org.id)} passThrough>
        {(allowed) => {
          return allowed ? 'Allowed' : 'Noop!';
        }}
      </Can>
    </AbilityProvider>,
  );

  expect(screen.getByText('Allowed')).toBeInTheDocument();
});

it('test with pass through, disallowed', () => {
  const rules = abilitiesFixture.defaultReferralCoordinator();

  render(
    <AbilityProvider rules={rules}>
      <Can I={InvitationAction.Read} a={invitationByOrganizationId('blabla')} passThrough>
        {(allowed) => {
          return allowed ? 'Allowed' : 'Noop!';
        }}
      </Can>
    </AbilityProvider>,
  );

  expect(screen.getByText('Noop!')).toBeInTheDocument();
});
