import { SEARCH_WORK_SETTING } from '@/modules/search/utils';

export function getSort(setting, location) {
  return location && setting !== SEARCH_WORK_SETTING.REMOTE
    ? { nearest: 'ASC' }
    : { updated: 'DESC' };
}
