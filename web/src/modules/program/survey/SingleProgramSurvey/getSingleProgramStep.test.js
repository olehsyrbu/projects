import { getSingleProgramStep } from './getSingleProgramStep';

describe('getSingleProgramStep with locations program', () => {
  it('returns initial step', () => {
    expect(getSingleProgramStep()).toBe(1);
    expect(getSingleProgramStep({})).toBe(1);
  });

  it('returns locations step', () => {
    expect(
      getSingleProgramStep({
        type: {},
        name: 'foo',
        center: 'boo',
        tagLine: 'few words',
      }),
    ).toBe(2);
  });

  it('returns Eligibility step', () => {
    expect(
      getSingleProgramStep({
        type: {},
        name: 'foo',
        center: 'boo',
        tagLine: 'few words',
        locations: [{ 1: 'foo' }],
        remote: { available: false },
        inPerson: { available: true },
      }),
    ).toBe(3);

    expect(
      getSingleProgramStep({
        type: {},
        name: 'foo',
        center: 'boo',
        tagLine: 'few words',
        locations: [{ id: 'foo' }],
      }),
    ).toBe(3);
  });

  it('returns Availability step', () => {
    expect(
      getSingleProgramStep({
        type: {},
        name: 'foo',
        center: 'boo',
        tagLine: 'few words',
        locations: [{ id: 'foo' }],
        remote: { available: false },
        inPerson: { available: true },
        requiredTreatmentAreas: [{ 1: 'foo' }],
        ageGroups: [{ 1: 'foo' }],
        availability: null,
      }),
    ).toBe(4);
  });

  it('returns Amenities step', () => {
    expect(
      getSingleProgramStep({
        type: {},
        name: 'foo',
        center: 'boo',
        tagLine: 'few words',
        locations: [{ id: 'foo' }],
        remote: { available: false },
        inPerson: { available: true },
        requiredTreatmentAreas: [{ 1: 'foo' }],
        ageGroups: [{ 1: 'foo' }],
        availability: { status: 'some' },
      }),
    ).toBe(5);
  });

  it('returns Photos step', () => {
    expect(
      getSingleProgramStep({
        type: {},
        name: 'foo',
        center: 'boo',
        tagLine: 'few words',
        locations: [{ amenities: [{ id: 'foo' }] }],
        remote: { available: false },
        inPerson: { available: true },
        requiredTreatmentAreas: [{ 1: 'foo' }],
        ageGroups: [{ 1: 'foo' }],
        availability: { status: 'some' },
      }),
    ).toBe(6);
  });

  it('returns Contacts step', () => {
    expect(
      getSingleProgramStep({
        type: {},
        name: 'foo',
        center: 'boo',
        tagLine: 'few words',
        remote: { available: false },
        inPerson: { available: true },
        locations: [{ amenities: [{ id: 'foo' }], photos: [{ id: 'foo' }] }],
        requiredTreatmentAreas: [{ 1: 'foo' }],
        ageGroups: [{ 1: 'foo' }],
        availability: { status: 'some' },
        preferredContacts: [],
      }),
    ).toBe(7);
  });

  it('returns Payment step', () => {
    expect(
      getSingleProgramStep({
        type: {},
        name: 'foo',
        center: 'boo',
        tagLine: 'few words',
        remote: { available: false },
        inPerson: { available: true },
        locations: [{ amenities: [{ id: 'foo' }], photos: [{ id: 'foo' }] }],
        requiredTreatmentAreas: [{ 1: 'foo' }],
        ageGroups: [{ 1: 'foo' }],
        availability: { status: 'some' },
        preferredContacts: ['EMAIL'],
        paymentMethods: null,
      }),
    ).toBe(8);
  });

  it('returns License step', () => {
    expect(
      getSingleProgramStep({
        type: {},
        name: 'foo',
        center: 'boo',
        tagLine: 'few words',
        remote: { available: false },
        inPerson: { available: true },
        locations: [{ amenities: [{ id: 'foo' }], photos: [{ id: 'foo' }] }],
        requiredTreatmentAreas: [{ 1: 'foo' }],
        ageGroups: [{ 1: 'foo' }],
        availability: { status: 'some' },
        preferredContacts: ['EMAIL'],
        paymentMethods: [{ id: 'foo' }],
        noLicense: null,
        accreditations: null,
        licenses: null,
      }),
    ).toBe(9);
  });

  it('returns Confirm step', () => {
    expect(
      getSingleProgramStep({
        type: {},
        name: 'foo',
        center: 'boo',
        tagLine: 'few words',
        remote: { available: false },
        inPerson: { available: true },
        locations: [{ amenities: [{ id: 'foo' }], photos: [{ id: 'foo' }] }],
        requiredTreatmentAreas: [{ 1: 'foo' }],
        ageGroups: [{ 1: 'foo' }],
        availability: { status: 'some' },
        preferredContacts: ['EMAIL'],
        paymentMethods: [{ id: 'foo' }],
        noLicense: null,
        accreditations: null,
        licenses: [{ id: 'foo' }],
      }),
    ).toBe(10);
  });
});

describe('getSingleProgramStep remote program', () => {
  it('returns Contacts step', () => {
    expect(
      getSingleProgramStep({
        type: {},
        name: 'foo',
        center: 'boo',
        tagLine: 'few words',
        remote: { available: true },
        inPerson: { available: false },
        locations: [{ amenities: [{ id: 'foo' }], photos: [{ id: 'foo' }] }],
        requiredTreatmentAreas: [{ 1: 'foo' }],
        ageGroups: [{ 1: 'foo' }],
        availability: { status: 'some' },
        preferredContacts: [],
      }),
    ).toBe(5);
  });

  it('returns Payment step', () => {
    expect(
      getSingleProgramStep({
        type: {},
        name: 'foo',
        center: 'boo',
        tagLine: 'few words',
        remote: { available: true },
        inPerson: { available: false },
        locations: [{ amenities: [{ id: 'foo' }], photos: [{ id: 'foo' }] }],
        requiredTreatmentAreas: [{ 1: 'foo' }],
        ageGroups: [{ 1: 'foo' }],
        availability: { status: 'some' },
        preferredContacts: ['EMAIL'],
        paymentMethods: null,
      }),
    ).toBe(6);
  });

  it('returns License step', () => {
    expect(
      getSingleProgramStep({
        type: {},
        name: 'foo',
        center: 'boo',
        tagLine: 'few words',
        remote: { available: true },
        inPerson: { available: false },
        locations: [{ amenities: [{ id: 'foo' }], photos: [{ id: 'foo' }] }],
        requiredTreatmentAreas: [{ 1: 'foo' }],
        ageGroups: [{ 1: 'foo' }],
        availability: { status: 'some' },
        preferredContacts: ['EMAIL'],
        paymentMethods: [{ id: 'foo' }],
        noLicense: null,
        accreditations: null,
        licenses: null,
      }),
    ).toBe(7);
  });

  it('returns Confirm step with accreditations', () => {
    expect(
      getSingleProgramStep({
        type: {},
        name: 'foo',
        center: 'boo',
        tagLine: 'few words',
        remote: { available: true },
        inPerson: { available: false },
        locations: [{ amenities: [{ id: 'foo' }], photos: [{ id: 'foo' }] }],
        requiredTreatmentAreas: [{ 1: 'foo' }],
        ageGroups: [{ 1: 'foo' }],
        availability: { status: 'some' },
        preferredContacts: ['EMAIL'],
        paymentMethods: [{ id: 'foo' }],
        accreditations: [{ id: 'foo' }],
        noLicense: null,
        licenses: null,
      }),
    ).toBe(8);
  });

  it('returns Confirm step with licenses', () => {
    expect(
      getSingleProgramStep({
        type: {},
        name: 'foo',
        center: 'boo',
        tagLine: 'few words',
        remote: { available: true },
        inPerson: { available: false },
        locations: [{ amenities: [{ id: 'foo' }], photos: [{ id: 'foo' }] }],
        requiredTreatmentAreas: [{ 1: 'foo' }],
        ageGroups: [{ 1: 'foo' }],
        availability: { status: 'some' },
        preferredContacts: ['EMAIL'],
        paymentMethods: [{ id: 'foo' }],
        accreditations: null,
        noLicense: null,
        licenses: [{ id: 'foo' }],
      }),
    ).toBe(8);
  });
  it('returns Confirm step with no license', () => {
    expect(
      getSingleProgramStep({
        type: {},
        name: 'foo',
        center: 'boo',
        tagLine: 'few words',
        remote: { available: true },
        inPerson: { available: false },
        locations: [{ amenities: [{ id: 'foo' }], photos: [{ id: 'foo' }] }],
        requiredTreatmentAreas: [{ 1: 'foo' }],
        ageGroups: [{ 1: 'foo' }],
        availability: { status: 'some' },
        preferredContacts: ['EMAIL'],
        paymentMethods: [{ id: 'foo' }],
        noLicense: { comment: '123' },
        accreditations: null,
        licenses: null,
      }),
    ).toBe(8);
  });
});
