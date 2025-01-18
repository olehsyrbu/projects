import { getProgramCompletion } from './getProgramCompletion';

describe('check General', () => {
  it('General section equal 20', () => {
    expect(
      getProgramCompletion({
        name: 'test',
      }).general,
    ).toBe(20);
  });

  it('General section equal 40', () => {
    expect(
      getProgramCompletion({
        name: 'test',
        tagLine: 'test',
      }).general,
    ).toBe(40);
  });

  it('General section equal 80', () => {
    expect(
      getProgramCompletion({
        name: 'test',
        tagLine: 'test',
        photoUrl: 'test',
        description: 'test',
      }).general,
    ).toBe(80);
  });

  it('General section equal 100', () => {
    const profile = {
      name: 'test',
      tagLine: 'test',
      photoUrl: 'test',
      description: 'test',
      center: 'test',
    };
    expect(getProgramCompletion(profile).general).toBe(100);
  });
});

describe('check Audience', () => {
  it('Audience section equal 0', () => {
    expect(getProgramCompletion({}).audience).toBe(0);
  });

  it('Audience section equal 53', () => {
    expect(
      getProgramCompletion({
        requiredTherapeuticAreas: ['test'],
        excludedTherapeuticAreas: ['test'],
        therapeuticAreas: ['test'],
        ageGroups: ['test'],
        genders: ['test'],
        ethnicities: ['test'],
        sexualIdentities: ['test'],
        matchesAllConditionsFrom: false,
      }).audience,
    ).toBe(70);
  });

  it('Audience section equal 100', () => {
    expect(
      getProgramCompletion({
        requiredTherapeuticAreas: ['test'],
        excludedTherapeuticAreas: ['test'],
        therapeuticAreas: ['test'],
        ageGroups: ['test'],
        genders: ['test'],
        ethnicities: ['test'],
        sexualIdentities: ['test'],
        religions: ['test'],
        specialGroups: ['test'],
        matchesAllConditionsFrom: true,
      }).audience,
    ).toBe(100);
  });
});

describe('check Services', () => {
  it('Services section equal 0', () => {
    expect(getProgramCompletion({}).services).toBe(0);
  });

  it('Services section equal 42', () => {
    expect(
      getProgramCompletion({
        providerTypes: ['test'],
        therapyTypes: ['test'],
        services: ['test'],
      }).services,
    ).toBe(42);
  });
  it('Services section equal 100', () => {
    expect(
      getProgramCompletion({
        providerTypes: ['test'],
        therapyTypes: ['test'],
        services: ['test'],
        treatmentTypes: ['test'],
        languageServices: ['test'],
        licenses: ['test'],
        certifications: ['test'],
      }).services,
    ).toBe(100);
  });
});

describe('check Gallery', () => {
  it('Gallery section equal 0', () => {
    expect(getProgramCompletion({}).gallery).toBe(0);
  });

  it('Gallery section equal 50', () => {
    expect(
      getProgramCompletion({
        locations: [
          {
            photos: Array.from(Array(3).keys()),
          },
        ],
      }).gallery,
    ).toBe(50);
  });
  it('Gallery section equal 100', () => {
    expect(
      getProgramCompletion({
        locations: [
          {
            photos: Array.from(Array(6).keys()),
          },
        ],
      }).gallery,
    ).toBe(100);
  });
});

describe('check Payment', () => {
  it('Payment section equal 0', () => {
    expect(getProgramCompletion({}).payment).toBe(0);
  });

  it('Payment section equal 33', () => {
    expect(
      getProgramCompletion({
        paymentMethods: ['test'],
      }).payment,
    ).toBe(33);
  });

  it('Payment section equal 66', () => {
    expect(
      getProgramCompletion({
        paymentMethods: ['test'],
        paymentOptions: ['test'],
      }).payment,
    ).toBe(66);
  });

  it('Payment section equal 100', () => {
    expect(
      getProgramCompletion({
        paymentMethods: ['test'],
        paymentOptions: ['test'],
        sessionCostLow: 10,
        sessionCostHigh: 20,
      }).payment,
    ).toBe(100);
  });
});

describe('check Location', () => {
  it('Location remote section equal 0', () => {
    expect(
      getProgramCompletion({
        remote: { available: true, states: ['abc'], accommodations: ['abc'] },
        inPerson: { available: false },
      }).location,
    ).toBe(100);
  });

  it('Location section equal 80', () => {
    expect(
      getProgramCompletion({
        locations: [
          {
            name: '123',
            facilityType: { name: '1' },
            dietaryAccommodation: { name: '1' },
            accommodations: [{ name: '1' }],
          },
        ],
      }).location,
    ).toBe(66);
  });

  it('Location section equal 100', () => {
    expect(
      getProgramCompletion({
        locations: [
          {
            address: { address1: '123123' },
            name: '123',
            facilityType: { name: '1' },
            dietaryAccommodation: { name: '1' },
            amenities: [{ category: 'Facilities' }],
            accommodations: [{ name: '1' }],
          },
        ],
      }).location,
    ).toBe(100);
  });
});

describe('check Schedule', () => {
  it('Schedule section equal 0', () => {
    expect(getProgramCompletion({}).schedule).toBe(0);
  });

  it('Schedule section equal 57', () => {
    expect(
      getProgramCompletion({
        email: '123',
        mobile: '123',
        admissionPhone: '123',
        onlineScheduler: '123',
      }).schedule,
    ).toBe(57);
  });
  it('Schedule section with is247 equal 100', () => {
    expect(
      getProgramCompletion({
        email: '123',
        mobile: '123',
        admissionPhone: '123',
        onlineScheduler: '123',
        website: '123',
        duration: {
          averageTotalHours: 10,
        },
        availability: {
          is247: true,
        },
      }).schedule,
    ).toBe(100);
  });
  it('Schedule section with availability hours equal 100', () => {
    expect(
      getProgramCompletion({
        email: '123',
        mobile: '123',
        admissionPhone: '123',
        onlineScheduler: '123',
        website: '123',
        duration: {
          averageTotalHours: 10,
        },
        availability: {
          hours: ['1', '2'],
        },
      }).schedule,
    ).toBe(100);
  });
});

it('getProgramCompletion should get zero for each section', () => {
  const profile = {};
  const completion = getProgramCompletion(profile);
  expect(completion.general).toBe(0);
  expect(completion.audience).toBe(0);
  expect(completion.services).toBe(0);
  expect(completion.location).toBe(0);
  expect(completion.gallery).toBe(0);
  expect(completion.payment).toBe(0);
  expect(completion.schedule).toBe(0);
  expect(completion.totalCompletion).toBe(0);
});

it('getProgramCompletion should get 100 percent for each section', () => {
  const profile = {
    name: 'test',
    tagLine: 'test',
    photoUrl: 'test',
    description: 'test',
    center: 'test',
    requiredTherapeuticAreas: ['test'],
    excludedTherapeuticAreas: ['test'],
    therapeuticAreas: ['test'],
    ageGroups: ['test'],
    genders: ['test'],
    ethnicities: ['test'],
    sexualIdentities: ['test'],
    religions: ['test'],
    specialGroups: ['test'],
    matchesAllConditionsFrom: true,
    treatsMedicallyUnstable: true,
    canAssistWithDailyLiving: true,
    treatsSuicidalIdeation: true,
    providerTypes: ['test'],
    therapyTypes: ['test'],
    services: ['test'],
    treatmentTypes: ['test'],
    languageServices: ['test'],
    licenses: ['test'],
    certifications: ['test'],
    locations: [
      {
        address: { address1: '123123' },
        name: '123',
        facilityType: { name: '1' },
        dietaryAccommodation: { name: '1' },
        amenities: [{ category: 'Facilities' }],
        accommodations: [{ name: '1' }],
        photos: Array.from(Array(6).keys()),
      },
    ],
    paymentOptions: ['test'],
    paymentMethods: ['test'],
    sessionCostLow: 50,
    sessionCostHigh: 80,
    email: '123',
    mobile: '123',
    admissionPhone: '123',
    onlineScheduler: '123',
    website: '123',
    duration: { averageTotalHours: ['text'] },
    availability: { hours: ['1', '2'] },
  };
  const completion = getProgramCompletion(profile);
  expect(completion.general).toBe(100);
  expect(completion.audience).toBe(100);
  expect(completion.services).toBe(100);
  expect(completion.location).toBe(100);
  expect(completion.gallery).toBe(100);
  expect(completion.payment).toBe(100);
  expect(completion.schedule).toBe(100);
  expect(completion.totalCompletion).toBe(100);
});
