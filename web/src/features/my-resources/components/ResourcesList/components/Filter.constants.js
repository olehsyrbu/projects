const pendingOptions = [
  {
    value: 'All',
    label: 'All',
  },
  {
    value: 'SENT',
    label: 'Sent',
    group: 'Invitation',
  },
  {
    value: 'NOT_SENT',
    label: 'Not sent',
    group: 'Invitation',
  },
  {
    value: 'SENT_MORE_THAN_5_DAYS',
    label: 'Sent more than 5 days ago',
    group: 'Invitation',
  },
];

const activeOptions = [
  {
    value: 'All',
    label: 'All',
  },
  {
    value: 'ACCEPTING_NEW_CLIENTS',
    label: 'Accepting new clients',
    group: 'Availability',
  },
  {
    value: 'NOT_ACCEPTING_NEW_CLIENTS',
    label: 'Not accepting new clients',
    group: 'Availability',
  },
  {
    value: 'PLEASE_INQUIRE',
    label: 'Please inquire',
    group: 'Availability',
  },

  {
    value: 'WITHIN_15_DAYS',
    label: 'Within 15 days',
    group: 'Last updated',
  },
  {
    value: 'WITHIN_16_30_DAYS',
    label: 'Within 16-30 days',
    group: 'Last updated',
  },
  {
    value: 'WITHIN_31_60_DAYS',
    label: 'Within 31-60 days',
    group: 'Last updated',
  },
  {
    value: 'MORE_THAN_60_DAYS',
    label: 'More than 60 days ago',
    group: 'Last updated',
  },
];

export { pendingOptions, activeOptions };
