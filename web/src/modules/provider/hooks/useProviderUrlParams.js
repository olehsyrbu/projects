import { useLocation } from 'react-router-dom';
import { UrlProviderProfileQuery } from '@/modules/provider/utils';

export function useProviderUrlParams() {
  const { search } = useLocation();

  let query = new UrlProviderProfileQuery({ search }).toJSON();
  return {
    query,
    options: {},
  };
}
