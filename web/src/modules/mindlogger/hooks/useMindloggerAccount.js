import useSWR from 'swr';
import Api from '../api';

export function useMindloggerAccount() {
  const client = Api.Client;
  const credentials = client.credentials;

  return useSWR(
    credentials ? ['mindlogger', 'account', credentials] : null,
    () => client.authenticate(),
    { suspense: true },
  );
}
