import useSWR, { mutate } from 'swr';
import { deleteUser, fetchUserProfile, updateUserProfile } from '@/core/api/UserAPI';
import * as AuthAPI from '@/core/api/AuthAPI';
import { logger } from '@/core/logger';

export function useUser(token) {
  return useSWR(token ? 'user' : null, () => fetchUserProfile(token));
}

export function useRegisterUser() {
  return async (params) => {
    let { user, token } = await AuthAPI.register(params);

    if (!token) {
      throw new Error('No auth token provided');
    }

    await mutate('user', user, true);

    return { user, token };
  };
}

export function useLoginUser() {
  return async (email, password) => {
    let {
      user,
      token: { auth },
    } = await AuthAPI.logIn(email, password);
    await mutate('user', user, false);
    return { user, token: auth };
  };
}

export function useLogoutUser() {
  return async (token) => {
    // do not block logout on UI even if server hangs or fail
    AuthAPI.logOut(token).catch((err) => {
      logger.error(err);
    });
  };
}

export function useUpdateUser() {
  return async (id, fields) => {
    if (!fields) {
      return mutate('user');
    }

    const result = await updateUserProfile(id, fields);
    return await mutate('user', result, false);
  };
}

export function useDeleteUser() {
  return async (id) => {
    const result = await deleteUser(id);

    if (!result.err) {
      await mutate('user', null, false);
    }
    return result;
  };
}
