import gqlClient from './graphQLClient';
import mixpanel from '@/core/mixpanel';
import { parseAbilities } from '@/core/api/utils';
import { UserProfileQuery, UserProfileMutation, DeleteUser } from './graphql';

export async function fetchUserProfile(token, client = gqlClient) {
  let header;

  if (token) {
    header = { Authorization: `Bearer ${token}` };
  }

  let response = await client.request(UserProfileQuery, undefined, header);
  let me = response.me;

  if (me && me.abilities) {
    me.abilities = parseAbilities(me.abilities);
  }

  return me;
}

export async function updateUserProfile(id, user) {
  let response = await gqlClient.request(UserProfileMutation, {
    id,
    user: {
      name: user.fullName,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      role: user.role,
      notification_email: user.notificationEmail,
    },
  });
  return response.updateUser;
}

export async function deleteUser(id) {
  const result = { err: null };

  try {
    await gqlClient.request(DeleteUser, {
      id,
    });
    mixpanel.track('Delete Self Account');
  } catch (err) {
    result.err = err;
    mixpanel.track('Delete Self Account Failure');
  }

  return result;
}

export async function switchRole(id, role) {
  return updateUserProfile(id, {
    role,
  });
}
