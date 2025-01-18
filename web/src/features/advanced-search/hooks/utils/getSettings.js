import { SEARCH_WORK_SETTING } from '@/modules/search/utils';

export function getSettings(setting) {
  const available = { available: true };
  let settings = [{ in_person: available }, { remote: available }];

  switch (setting) {
    case SEARCH_WORK_SETTING.REMOTE:
      settings = [{ remote: available }];
      break;
    case SEARCH_WORK_SETTING.IN_PERSON:
      settings = [{ in_person: available }];
      break;
    default:
      return settings;
  }
  return settings;
}
