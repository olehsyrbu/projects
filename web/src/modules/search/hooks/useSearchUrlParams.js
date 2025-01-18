import { useLocation } from 'react-router-dom';
import { parseAdvancedSearchUrl } from '@/modules/search/utils';

export function useSearchUrlParams() {
  let { search } = useLocation();
  let query = parseAdvancedSearchUrl(search);
  return { query, options: {} };
}
