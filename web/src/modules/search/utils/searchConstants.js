export const SEARCH_CATEGORIES = {
  PROVIDER: 'provider',
  PROGRAM: 'program',
  ALL: 'all',
  BY_NAME: 'by-name',
};

export const TYPE_PERSON = 'PERSON';
export const TYPE_PROGRAM = 'PROGRAM';
export const SEARCH_MODES_PERSON = [TYPE_PERSON];
export const SEARCH_MODES_PROGRAM = [TYPE_PROGRAM];
export const SEARCH_MODES_ALL = [TYPE_PERSON, TYPE_PROGRAM];

export const SEARCH_WORK_SETTING = {
  BOTH: 'both',
  IN_PERSON: 'inPerson',
  REMOTE: 'remote',
};
export let SEARCH_AVAILABLE_SETTINGS = [
  { slug: 'remote', label: 'Remote' },
  { slug: 'inPerson', label: 'In-person' },
  { slug: 'both', label: 'Remote or in-person' },
];
