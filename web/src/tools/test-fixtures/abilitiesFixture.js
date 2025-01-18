import { organizationFixtures } from '@/tools/test-fixtures/organizationFixtures';

export const abilitiesFixture = {
  defaultReferralCoordinator() {
    let orgId = organizationFixtures.demoOrganization().id;
    return [
      {
        subject: 'Provider',
        action: ['read', 'unaffiliate', 'delete', 'paginate'],
        conditions: { organization_ids: { $in: [orgId] } },
      },
      {
        subject: 'Invitation',
        action: ['read', 'write', 'delete', 'create'],
        conditions: { organization_ids: { $in: [orgId] } },
      },
      {
        subject: 'User',
        action: ['read', 'write', 'delete'],
        conditions: { id: orgId },
      },
      {
        subject: 'ReferralList',
        action: ['create'],
      },
      {
        subject: 'TeamNote',
        action: ['read', 'paginate'],
        conditions: null,
      },
      {
        subject: 'TeamNote',
        action: ['write', 'delete'],
        conditions: { 'organization.id': { $in: [orgId] } },
      },
    ];
  },

  rawReferralCoordinatorConditions() {
    return [
      {
        subject: 'Provider',
        action: ['read', 'unaffiliate', 'delete', 'paginate'],
        conditions: ['{"organization_ids":{"$in":["some-demo-org-id"]}}'],
      },
      {
        subject: 'Invitation',
        action: ['read', 'write', 'delete', 'create'],
        conditions: ['{"organization_ids":{"$in":["some-demo-org-id"]}}'],
      },
      {
        subject: 'User',
        action: ['read', 'write', 'delete'],
        conditions: ['{"id":"some-demo-org-id"}'],
      },
      {
        subject: 'ReferralList',
        action: ['create'],
      },
      {
        subject: 'TeamNote',
        action: ['read', 'paginate'],
        conditions: null,
      },
      {
        subject: 'TeamNote',
        action: ['write', 'delete'],
        conditions: ['{"organization.id":{"$in":["some-demo-org-id"]}}'],
      },
    ];
  },

  defaultTeamMember() {
    return [
      {
        subject: 'Provider',
        action: ['read', 'paginate'],
        conditions: null,
      },
      {
        subject: 'ReferralList',
        action: ['create'],
      },
      {
        subject: 'TeamNote',
        action: ['write'],
        conditions: { 'user.organization.id': 'some-demo-org-id' },
      },
      {
        subject: 'TeamNote',
        action: ['paginate'],
        conditions: null,
      },
      {
        subject: 'TeamNote',
        action: ['delete'],
        conditions: { 'author.id': 'some-default-team-member-id-1' },
      },
      {
        subject: 'User',
        action: ['delete'],
        conditions: { id: '1583dac7-c4fa-4c4f-b03c-191cc7a5f411' },
      },
    ];
  },

  // TODO: MIR-442 - sync with backend when it's ready
  defaultProgramRepresentative() {
    return [
      {
        subject: 'Program',
        action: ['create'],
        conditions: null,
      },
      {
        subject: 'Program',
        action: ['write'],
        conditions: null,
      },
      {
        subject: 'Program',
        action: ['paginate'],
        conditions: null,
      },
      {
        subject: 'Program',
        action: ['delete'],
        conditions: null,
      },
    ];
  },
};
