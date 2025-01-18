import { gql } from 'graphql-request';
import graphQLClient from './graphQLClient';

const PasswordAPI = {
  change: changePassword,
  forgot: forgotPassword,
  reset: resetPassword,
};

export default PasswordAPI;

const ChangePasswordMutation = gql`
  mutation changePassword($currentPassword: String!, $newPassword: String!, $userId: ID!) {
    changeUserPassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
      userId: $userId
    ) {
      id
    }
  }
`;

async function changePassword(userId, currentPassword, newPassword) {
  const result = { err: null };

  try {
    await graphQLClient.request(ChangePasswordMutation, {
      currentPassword,
      newPassword,
      userId,
    });
  } catch (err) {
    result.err = err;
  }

  return result;
}

const ResetPasswordMutation = gql`
  mutation resetPassword($hash: String!, $password: String!) {
    resetPassword(hash: $hash, newPassword: $password) {
      name
      email
      first_name
      last_name
      role
    }
  }
`;

async function resetPassword({ hash, password }) {
  const response = await graphQLClient.request(ResetPasswordMutation, {
    hash,
    password,
  });
  return response.resetPassword;
}

const queryForgotPassword = gql`
  mutation forgotPassword($email: Email!) {
    forgotPassword(email: $email) {
      forgotten_at
    }
  }
`;

async function forgotPassword({ email } = {}) {
  let result = {};

  try {
    result = await graphQLClient.request(queryForgotPassword, { email });
  } catch (err) {
    result.err = {
      message: err.message,
    };
  }

  return result;
}
