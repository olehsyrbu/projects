import PropTypes from 'prop-types';
import { mutate } from 'swr';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import mixpanel from '@/core/mixpanel';
import gqlClient from '@/core/api/graphQLClient';
import {
  useUpdateUser,
  useUser,
  useDeleteUser,
  useLoginUser,
  useLogoutUser,
  useRegisterUser,
} from '@/core/api/UserQueries';
import { AbilityProvider } from '@/modules/ability/components';
import { useReferralList } from '@/modules/referral-list/hooks';
import { useAuthToken } from './useAuthToken';

export const AuthUserContext = createContext({});

export function useAuthContext() {
  return useContext(AuthUserContext);
}

export function AuthUser(props) {
  const [token, saveToken, resetToken] = useAuthToken('authToken');
  const { data: user, error } = useUser(token);
  const registerUser = useRegisterUser();
  const loginUser = useLoginUser();
  const logoutUser = useLogoutUser();
  const patchUser = useUpdateUser();
  const removeUser = useDeleteUser();
  const referralList = useReferralList();
  // render children immediately, if no token
  const [isChecking, setChecking] = useState(Boolean(token));

  useEffect(() => {
    if (error) {
      setChecking(false);
    }

    if (token && user) {
      setChecking(false);
    }
  }, [token, user, error]);

  const handleAuthorizationError = useCallback(
    (error) => {
      if (error.response?.status === 401) {
        resetToken();
        referralList.clear();
      }
    },
    [resetToken, setChecking],
  );

  useEffect(() => {
    gqlClient.addErrorInterceptor(handleAuthorizationError);
    return () => {
      gqlClient.removeErrorInterceptor(handleAuthorizationError);
    };
  }, [handleAuthorizationError]);

  const register = useCallback(
    async (params) => {
      const { user, token } = await registerUser(params);

      saveToken(token);
      mixpanel.alias(user.id, params.invitation_code);

      return user;
    },
    [registerUser, saveToken],
  );

  const logIn = useCallback(
    async (email, password) => {
      const { user, token } = await loginUser(email, password);

      saveToken(token);
      await mixpanel.identify(user.id);
      mixpanel.track('Signed in');
    },
    [loginUser, saveToken],
  );

  const logOut = useCallback(async () => {
    await logoutUser(token);
    referralList.clear();

    resetToken();
    mutate('user', null, false);

    mixpanel.track('Logged out', null, { send_immediately: true }, () => {
      mixpanel.reset();
    });
  }, [logoutUser, resetToken]);

  const updateUser = useCallback(
    async (id, fields) => {
      if (user) {
        await patchUser(id, fields);
        mixpanel.track('Edit Account', { id, fields });
      }
    },
    [patchUser, user],
  );

  const deleteUser = useCallback(async () => {
    let result = { data: null };
    if (user) {
      result = await removeUser(user.id);

      resetToken();
      localStorage.clear();
    }
    return result;
  }, [user, removeUser, resetToken]);

  const setToken = useCallback(
    (nextToken) => {
      setChecking(true);
      saveToken(nextToken);
    },
    [setChecking, saveToken],
  );

  const refetchUser = () => {
    mutate('user');
  };

  return (
    <AuthUserContext.Provider
      value={{
        isChecking,
        token,
        setToken,
        user,
        register,
        updateUser,
        deleteUser,
        logIn,
        logOut,
        refetchUser,
      }}
    >
      {!isChecking && <AbilityProvider rules={user?.abilities}>{props.children}</AbilityProvider>}
    </AuthUserContext.Provider>
  );
}

AuthUser.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node]).isRequired,
};

export default AuthUser;
