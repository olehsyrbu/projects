import { gql } from 'graphql-request';
import gqlClient from './graphQLClient';
import { UserProfileFragment } from './graphql';
import { parseAbilities } from '@/core/api/utils';

export async function register(params) {
  let response = await gqlClient.request(
    RegisterMutation,
    {
      user: {
        ...params,
      },
    },
    { Authorization: '' },
  );

  let {
    user,
    token: { auth },
  } = response.register;
  if (user && user.abilities) {
    user.abilities = parseAbilities(user.abilities);
  }

  return { user, token: auth };
}

export async function logIn(email, password) {
  let response = await gqlClient.request(LogInMutation, { email, password }, { Authorization: '' });
  let user = response.login.user;

  if (user && user.abilities) {
    user.abilities = parseAbilities(user.abilities);
  }

  return { user, token: response.login.token };
}

export async function logOut(token) {
  await gqlClient.request(LogOutMutation, null, { Authorization: `Bearer ${token}` });
}

export async function refreshToken() {
  // TODO: MIR-401 - enable refresh
  // let response = await gqlClient.request(RefreshTokenMutator);
  // gqlClient.setAuthToken(response.refreshToken.auth);
}

let RegisterMutation = gql`
  mutation registerUser($user: RegisterInput!) {
    register(user: $user) {
      user {
        ...UserProfile
      }
      token {
        auth
      }
    }
  }
  ${UserProfileFragment}
`;

let LogInMutation = gql`
  mutation login($email: Email!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        ...UserProfile
      }
      token {
        auth
      }
    }
  }
  ${UserProfileFragment}
`;

let LogOutMutation = gql`
  mutation {
    logout {
      expires_at
    }
  }
`;
