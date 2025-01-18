import { getProfileCompletion } from './getProfileCompletion';

it('getProfileCompletion with empty profile', () => {
  const profile = {};
  const completion = getProfileCompletion(profile);
  expect(completion.general).toBe(0);
  expect(completion.specialty).toBe(0);
  expect(completion.location).toBe(0);
  expect(completion.credentials).toBe(0);
  expect(completion.payment).toBe(0);
  expect(completion.schedule).toBe(0);
  expect(completion.totalCompletion).toBe(0);
});

it('general percent equal 100', () => {
  const profile = {
    legalFirstName: 'test',
    legalLastName: 'test',
    preferredFirstName: 'test',
    photoUrl: 'test',
    tagLine: 'test',
    pronoun: { code: 'test', name: 'test' },
    description: 'test',
    genders: 'test',
    ethnicities: 'test',
    religions: 'test',
    website: 'test',
  };

  expect(getProfileCompletion(profile).general).toBe(100);
});

it('general with empty NPI percent equal 91', () => {
  const profile = {
    legalFirstName: 'test',
    legalLastName: 'test',
    preferredFirstName: 'test',
    photoUrl: 'test',
    tagLine: 'test',
    pronoun: { code: 'test', name: 'test' },
    description: 'test',
    genders: 'test',
    ethnicities: 'test',
    religions: 'test',
    website: 'test',
    isNationalIdentifier: true,
    nationalProviderIdentifier: '',
  };

  expect(getProfileCompletion(profile).general).toBe(91);
});

it('general with NPI true percent equal 91', () => {
  const profile = {
    legalFirstName: 'test',
    legalLastName: 'test',
    preferredFirstName: 'test',
    photoUrl: 'test',
    tagLine: 'test',
    pronoun: { code: 'test', name: 'test' },
    description: 'test',
    genders: 'test',
    ethnicities: 'test',
    religions: 'test',
    website: 'test',
    isNationalIdentifier: true,
    nationalProviderIdentifier: '1234567891',
  };

  expect(getProfileCompletion(profile).general).toBe(100);
});

it('specialty percent equal 100', () => {
  const profile = {
    therapeuticAreas: ['test'],
    ageGroups: ['test'],
    excludedTherapeuticAreas: ['test'],
    therapyTypes: ['test'],
    treatmentTypes: ['test'],
    languageServices: ['test'],
    specialGroups: ['test'],
  };

  expect(getProfileCompletion(profile).specialty).toBe(100);
});

it('specialty percent equal 85', () => {
  const profile = {
    therapeuticAreas: [],
    ageGroups: ['test'],
    excludedTherapeuticAreas: ['test'],
    therapyTypes: ['test'],
    treatmentTypes: ['test'],
    languageServices: ['test'],
    specialGroups: ['test'],
  };

  expect(getProfileCompletion(profile).specialty).toBe(85);
});

it('location percent equal 50', () => {
  const profile = {
    locations: [
      {
        name: '123',
        facilityType: { name: '123' },
      },
    ],
  };

  expect(getProfileCompletion(profile).location).toBe(66);
});

it('location percent equal 100', () => {
  const profile = {
    locations: [
      {
        name: '123',
        facilityType: { name: '123' },
        accommodations: ['1', '2'],
      },
    ],
  };

  expect(getProfileCompletion(profile).location).toBe(100);
});

it('credentials percent equal 100', () => {
  const profile = {
    providerTypes: ['test'],
    licenses: ['test'],
    experience: ['test'],
    certifications: ['test'],
    educations: ['test'],
    publications: ['test'],
  };

  expect(getProfileCompletion(profile).credentials).toBe(100);
});

it('credentials noLicense percent equal 100', () => {
  const profile = {
    providerTypes: ['test'],
    noLicense: [{ comment: '123', noLicenseReason: { code: '123', name: 'some name' } }],
    experience: ['test'],
    certifications: ['test'],
    educations: ['test'],
    publications: ['test'],
  };

  expect(getProfileCompletion(profile).credentials).toBe(100);
});

it('credentials noLicense without comment percent equal 100', () => {
  const profile = {
    providerTypes: ['test'],
    noLicense: [{ noLicenseReason: { code: '123', name: 'some name' } }],
    experience: ['test'],
    certifications: ['test'],
    educations: ['test'],
    publications: ['test'],
  };

  expect(getProfileCompletion(profile).credentials).toBe(100);
});

it('credentials percent equal 83', () => {
  const profile = {
    providerTypes: [],
    licenses: ['test'],
    experience: ['test'],
    certifications: ['test'],
    educations: ['test'],
    publications: ['test'],
  };

  expect(getProfileCompletion(profile).credentials).toBe(83);
});

it('payment percent equal 0', () => {
  const profile = {};
  expect(getProfileCompletion(profile).payment).toBe(0);
});

it('payment percent equal 66', () => {
  const profile = {
    paymentMethods: ['test'],
    paymentOptions: ['test'],
  };
  expect(getProfileCompletion(profile).payment).toBe(66);
});

it('payment percent equal 100', () => {
  const profile = {
    paymentMethods: ['test'],
    paymentOptions: ['test'],
    sessionCostLow: 10,
    sessionCostHigh: 20,
  };
  expect(getProfileCompletion(profile).payment).toBe(100);
});

it('schedule percent equal 0', () => {
  const profile = {};
  expect(getProfileCompletion(profile).schedule).toBe(0);
});

it('schedule percent equal 100', () => {
  const profile = {
    email: 'test',
    mobile: '123123123',
    onlineScheduler: null,
    availability: {
      hours: ['1', '2', '3'],
    },
  };
  expect(getProfileCompletion(profile).schedule).toBe(75);
});
