import { programAdapter } from './programAdapter';
import { locationAdapter } from './locationAdapter';

describe('program adapter api usages', () => {
  it('stay consistent with program create output', async () => {
    const payload = {
      id: 'd7189774-fedc-4496-bc5d-2b1fd7616802',
      slug: 'test-zzz-booooo-85TT',
      status: 'ONBOARDING',
      email: null,
      mobile: null,
      description: null,
      active: true,
      name: 'Program Name',
      center: 'Center Name',
      tagLine: '',
      programType: null,

      preferredContacts: [],
      onlineScheduler: null,

      sessionCostLow: null,
      sessionCostHigh: null,

      timezone: null,
      updatedAt: '2022-08-10T09:05:24.333Z',
      website: null,

      duration: {
        start: 0,
        end: 9,
        timeframe: 'DTFH',
        averageTotalHours: 30,
      },
    };

    let input = programAdapter.toCreateInput(payload);
    expect(input).toEqual({
      id: 'd7189774-fedc-4496-bc5d-2b1fd7616802',
      slug: 'test-zzz-booooo-85TT',
      status: 'ONBOARDING',
      email: null,
      mobile: null,
      description: null,
      active: true,
      program_name: 'Program Name',
      program_org_name: 'Center Name',
      tag_line: '',
      program_type: null,

      online_scheduler: null,
      preferred_contacts: [],

      session_cost_low: null,
      session_cost_high: null,
      timezone: null,

      updated_at: '2022-08-10T09:05:24.333Z',
      website: null,

      duration: {
        start: payload.duration.start,
        end: payload.duration.end,
        timeframe: payload.duration.timeframe,
        average_total_hours: payload.duration.averageTotalHours,
      },
    });
  });

  it('generates update input', () => {
    const payload = {
      id: 'xxxxxx-1',
      slug: 'bla-bla-1',
      active: true,
      description: 'blablalblalbla',
      ageGroups: ['123', '456'],
      certifications: [],
      email: 'joe@email.com',
      ethnicities: ['eth1'],
      excludedTherapeuticAreas: ['excl1', 'excl2'],
      genders: ['gen1', 'gen2'],
      inPerson: null,
      insuranceTypes: ['ins1', 'ins2'],
      languageServices: ['lang1'],
      name: 'Prog Name',
      center: 'Center Name',
      licenses: [
        {
          organization: 'fsfd',
          name: 'sdfsdf',
          number: 'sdfsdf',
          expiredAt: '01/02/2034',
          stateId: '67bd8ce8-a0f8-48d2-b422-2c081b0a770b',
        },
      ],
      locations: [
        {
          id: 'xxxxxx-1',
          phone: '999999999',
          name: 'Foo',
          accommodations: ['ac1', 'ac2'],
          address: {
            address1: 'Test Str',
            address2: 'Test Other Str',
            city: 'Test City',
            state: 'some-state-id-1',
            zip: 'zip',
          },
        },
        {
          id: 'xxxxxx-2',
          phone: '88888888',
          name: 'Foo1',
          accommodations: ['ac12', 'ac25'],
          address: {
            address1: 'Test Str1',
            address2: 'Test Other Str1',
            city: 'Test City1',
            state: 'some-state-id-2',
            zip: 'zip-2',
          },
        },
      ],
      mobile: '9999999',
      noLicense: [{ no_license_reason_id: '123', comment: '123' }],
      onlineScheduler: 'example.com',
      paymentOptions: ['pm1', 'pm2'],
      paymentMethods: ['pi1', 'pi2'],
      preferredContacts: [],
      religions: ['rel1', 'rel2'],
      remote: null,
      sessionCostHigh: 1,
      sessionCostLow: 3,
      specialGroups: ['sp1', 'sp2'],
      status: 'COMPLETED',
      tagLine: 'blalbalbla',
      therapyTypes: ['t1'],
      timezone: 'UTC',
      treatmentTypes: ['tr1'],
      website: 'www.example.com',
      availability: null,
      programType: 'pg-type',
      duration: {
        start: 0,
        end: 9,
        timeframe: 'DTFH',
        averageTotalHours: 30,
      },
      therapeuticAreas: ['123', '456'],
    };

    const actual = programAdapter.toUpdateInput(payload);

    expect(actual).toEqual({
      active: payload.active,
      age_group_ids: payload.ageGroups,
      certifications: payload.certifications,
      description: payload.description,
      email: payload.email,
      ethnicity_ids: payload.ethnicities,
      excluded_therapeutic_area_ids: payload.excludedTherapeuticAreas,
      gender_ids: payload.genders,
      in_person: payload.inPerson,
      insurance_type_ids: payload.insuranceTypes,
      language_service_ids: payload.languageServices,
      program_name: payload.name,
      program_org_name: payload.center,
      licenses: [
        {
          organization: 'fsfd',
          name: 'sdfsdf',
          number: 'sdfsdf',
          expired_at: '01/02/2034',
          state_id: '67bd8ce8-a0f8-48d2-b422-2c081b0a770b',
        },
      ],
      locations: payload.locations.map(locationAdapter.toUpdateInput),
      mobile: payload.mobile,
      no_license: payload.noLicense,
      online_scheduler: payload.onlineScheduler,
      payment_method_ids: payload.paymentMethods,
      payment_option_ids: payload.paymentOptions,
      preferred_contacts: payload.preferredContacts,
      religion_ids: payload.religions,
      remote: payload.remote,

      session_cost_high: payload.sessionCostHigh,
      session_cost_low: payload.sessionCostLow,

      special_group_ids: payload.specialGroups,

      status: payload.status,
      tag_line: payload.tagLine,
      therapy_ids: payload.therapyTypes,
      timezone: payload.timezone,
      treatment_ids: payload.treatmentTypes,
      website: payload.website,
      availability: payload.availability,
      program_type: payload.programType,
      id: payload.id,
      slug: payload.slug,

      duration: {
        start: payload.duration.start,
        end: payload.duration.end,
        timeframe: payload.duration.timeframe,
        average_total_hours: payload.duration.averageTotalHours,
      },
      therapeutic_areas: [
        {
          favorite: true,
          therapeutic_area_id: '123',
        },
        {
          favorite: true,
          therapeutic_area_id: '456',
        },
      ],

      // Eligibility
      // program accept - who are acutely suicidal, is ok ?
      // treats_suicidal_ideation: Boolean
      // who are not med stable ?
      // who need assistance ?

      // payment_assistance_type_ids: [ID!]
      // free_phone_consultation: Boolean
      // free_in_person_consultation: Boolean
      // experience: UInt
      // emergency_contact_available: Boolean
      // educations: [ProviderEducationInput!]
      // can_prescribe_medication: Boolean
    });
  });
});
