import { Card } from './Card';

export default {
  title: 'Components/Card',
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'gray',
      values: [
        {
          name: 'gray',
          value: '#dedede',
        },
      ],
    },
  },
};
const ActiveProfile = {
  legalName: 'Jadon Carter',
  status: 'COMPLETED',
  active: true,
  createdAt: '2021-04-01T05:32:04.181Z',
  invitation: {
    id: 'f5e93424-96c3-4d7f-87e0-3c0355c62c52',
    email: 'auto-test-provider@tempr.email',
    sentAt: null,
  },
  availability: {
    updated_at: '2023-08-03T11:28:47.129Z',
    status: 'ACCEPTING_NEW_CLIENTS',
    afterHoursCrisisServices: false,
    intakeWaitDays: null,
    hours: [],
  },
  email: 'provider.t9m9iq.82l40c@inbox.testmail.app',
  mobile: '5417543010',
  tagLine: 'A very good mental therapist.',
  notesCount: 10,
  photoUrl:
    'https://assets.dev.miresource.io/p/f483e9c0-078e-413b-9b38-a954bd1e022f/3TRG9es04fUscQh2Rprg3UwnjOMxaRfw.png',
};

const OnboardingProfile = {
  legalName: 'Jadon Carter',
  status: 'ONBOARDING',
  active: true,
  createdAt: '2021-04-01T05:32:04.181Z',
  invitation: {
    id: 'f5e93424-96c3-4d7f-87e0-3c0355c62c52',
    email: 'auto-test-provider@tempr.email',
    sentAt: null,
  },
  availability: {
    updated_at: '2023-08-03T11:28:47.129Z',
    status: 'ACCEPTING_NEW_CLIENTS',
    afterHoursCrisisServices: false,
    intakeWaitDays: null,
    hours: [],
  },
  email: 'provider.t9m9iq.82l40c@inbox.testmail.app',
  mobile: '5417543010',
  tagLine: 'A very good mental therapist.',
  notesCount: 0,
  photoUrl:
    'https://assets.dev.miresource.io/p/f483e9c0-078e-413b-9b38-a954bd1e022f/3TRG9es04fUscQh2Rprg3UwnjOMxaRfw.png',
};

const DeactivatedProfile = {
  legalName: 'Jadon Carter',
  status: 'COMPLETED',
  active: false,
  createdAt: '2021-04-01T05:32:04.181Z',
  invitation: {
    id: 'f5e93424-96c3-4d7f-87e0-3c0355c62c52',
    email: 'auto-test-provider@tempr.email',
    sentAt: null,
  },
  availability: {
    updated_at: '2023-08-03T11:28:47.129Z',
    status: 'ACCEPTING_NEW_CLIENTS',
    afterHoursCrisisServices: false,
    intakeWaitDays: null,
    hours: [],
  },
  email: 'provider.t9m9iq.82l40c@inbox.testmail.app',
  mobile: '5417543010',
  tagLine: 'A very good mental therapist.',
  notesCount: 10,
  photoUrl:
    'https://assets.dev.miresource.io/p/f483e9c0-078e-413b-9b38-a954bd1e022f/3TRG9es04fUscQh2Rprg3UwnjOMxaRfw.png',
};

const PendingProfile = {
  legalName: 'Jadon Carter',
  status: 'ONBOARDING',
  active: false,
  createdAt: '2021-04-01T05:32:04.181Z',
  invitation: {
    id: 'f5e93424-96c3-4d7f-87e0-3c0355c62c52',
    email: 'auto-test-provider@tempr.email',
    sentAt: null,
    status: 'OPEN',
  },
  availability: {
    updated_at: '2023-08-03T11:28:47.129Z',
    status: 'ACCEPTING_NEW_CLIENTS',
    afterHoursCrisisServices: false,
    intakeWaitDays: null,
    hours: [],
  },
  email: 'provider.t9m9iq.82l40c@inbox.testmail.app',
  mobile: '5417543010',
  tagLine: 'A very good mental therapist.',
  photoUrl:
    'https://assets.dev.miresource.io/p/f483e9c0-078e-413b-9b38-a954bd1e022f/3TRG9es04fUscQh2Rprg3UwnjOMxaRfw.png',
};

const UnclaimedProfile = {
  legalName: 'Jadon Carter',
  status: 'ONBOARDING',
  invitation: null,
  active: null,
};

export function DefaultCards() {
  return (
    <div className="md:space-y-6">
      <Card profile={ActiveProfile} />
      <Card profile={OnboardingProfile} />
      <Card profile={DeactivatedProfile} />
      <Card profile={PendingProfile} />
      <Card profile={UnclaimedProfile} />
    </div>
  );
}
