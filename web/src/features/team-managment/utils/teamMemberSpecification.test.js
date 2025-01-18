import { teamMemberSpecification } from './teamMemberSpecification';
import { ROLE_NAMES } from '@/core/definitions';

it('check for team members', function () {
  expect(
    teamMemberSpecification.isTeamAdmin({ role: ROLE_NAMES.REFERRAL_COORDINATOR }),
  ).toBeTruthy();

  expect(teamMemberSpecification.isTeamAdmin({ role: ROLE_NAMES.USER })).toBeFalsy();
  expect(teamMemberSpecification.isTeamAdmin({ role: ROLE_NAMES.TEAM_MEMBER })).toBeFalsy();
});
