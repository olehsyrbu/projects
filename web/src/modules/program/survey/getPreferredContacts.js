let map = {
  EMAIL: 'email',
  MOBILE: 'mobile',
  ONLINE_SCHEDULER: 'onlineScheduler',
  ADMISSION_PHONE: 'admissionPhone',
  WEBSITE: 'website',
};

export function getPreferredContacts(program = {}) {
  return program.preferredContacts.map((slug) => program[map[slug]]).filter(Boolean);
}
