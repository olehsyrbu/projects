import { providerAdapter } from './providerAdapter';
import { locationAdapter } from './locationAdapter';

describe('provider adapter api usages', () => {
  it('generates update input', () => {
    const payload = {
      id: 'xxxxxx-1',
      legalFirstName: '1',
      legalLastName: '2',
      preferredFirstName: '3',
      tagLine: '444',
      pronoun: '1',
      photoUrl: 'url',
      description: 'some description',
      rainbowMember: 'rainbowMember',
      website: 'website',
      nationalProviderIdentifier: '1234567',
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
      availability: { afterHoursCrisisServices: true },
      genders: ['gen1', 'gen2'],
      ethnicities: ['ethnicities1', 'ethnicities2'],
      religions: ['religions1', 'religions2'],
      sexualIdentities: ['sexualIdentities1', 'sexualIdentities2'],
      therapeuticAreas: ['123', '456'],
      excludedTherapeuticAreas: ['excl1', 'excl2'],
      therapyTypes: ['t1'],
      treatmentTypes: ['tr1'],
      languageServices: ['lang1'],
      ageGroups: ['123', '456'],
      specialGroups: ['sp1', 'sp2'],
      providerTypes: [
        {
          favorite: true,
          id: '1',
        },
        {
          favorite: true,
          id: '2',
        },
      ],
      certifications: [{ authority: 'some', name: 'name!!!', description: '' }],
      licenses: [
        {
          organization: 'fsfd',
          name: 'sdfsdf',
          number: 'sdfsdf',
          expiredAt: '01/02/2034',
          stateId: '67bd8ce8-a0f8-48d2-b422-2c081b0a770b',
          isSupervisorLicense: false,
        },
        {
          organization: 'super',
          name: 'super',
          number: 'superNumber',
          expiredAt: '01/02/2034',
          stateId: '777d8ce8-a0f8-48d2-b422-2c081b0a770b',
          isSupervisorLicense: true,
        },
        {
          name: '',
          number: 'psyPactNumber',
          expiredAt: '01/02/2034',
          type: 'PSYPACT',
        },
      ],
      noLicense: [{ comments: 'some comment', noLicenseReasonId: '123' }],
      educations: [
        {
          comment: '123',
          schoolName: 'name school',
          graduationYear: 2000,
          educationId: 'some_code',
        },
      ],
      publications: [
        {
          title: 'some value',
          description: 'some value',
          doi: 'some value',
          publicationDate: 2000,
          publicationIn: 'some value',
          url: 'some value',
        },
      ],
    };

    const actual = providerAdapter.toUpdateInput(payload);

    expect(actual).toEqual({
      no_license: [
        {
          comments: 'some comment',
          no_license_reason_id: '123',
        },
      ],
      locations: payload.locations.map(locationAdapter.toUpdateInput),
      availability: { after_hours_crisis_services: true },
      age_group_ids: ['123', '456'],
      description: 'some description',
      ethnicity_ids: ['ethnicities1', 'ethnicities2'],
      excluded_therapeutic_area_ids: ['excl1', 'excl2'],
      gender_ids: ['gen1', 'gen2'],
      id: 'xxxxxx-1',
      language_service_ids: ['lang1'],
      legal_first_name: '1',
      legal_last_name: '2',
      national_provider_identifier: '1234567',
      photo_url: 'url',
      preferred_first_name: '3',
      pronoun_id: '1',
      rainbow_member: 'rainbowMember',
      religion_ids: ['religions1', 'religions2'],
      sexual_identities: ['sexualIdentities1', 'sexualIdentities2'],
      special_group_ids: ['sp1', 'sp2'],
      tag_line: '444',
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
      therapy_ids: ['t1'],
      treatment_ids: ['tr1'],
      website: 'website',
      provider_types: [
        {
          favorite: true,
          provider_type_id: '1',
        },
        {
          favorite: true,
          provider_type_id: '2',
        },
      ],
      certifications: [
        {
          authority: 'some',
          description: '',
          name: 'name!!!',
        },
      ],
      licenses: [
        {
          organization: 'fsfd',
          name: 'sdfsdf',
          number: 'sdfsdf',
          expired_at: '01/02/2034',
          state_id: '67bd8ce8-a0f8-48d2-b422-2c081b0a770b',
          is_supervisor_license: false,
        },
        {
          organization: 'super',
          name: 'super',
          number: 'superNumber',
          expired_at: '01/02/2034',
          state_id: '777d8ce8-a0f8-48d2-b422-2c081b0a770b',
          is_supervisor_license: true,
        },
        {
          expired_at: '01/02/2034',
          name: '',
          number: 'psyPactNumber',
          type: 'PSYPACT',
        },
      ],
      educations: [
        {
          comment: '123',
          school_name: 'name school',
          graduation_year: 2000,
          education_id: 'some_code',
        },
      ],
      publications: [
        {
          title: 'some value',
          description: 'some value',
          doi: 'some value',
          publication_date: 2000,
          publication_in: 'some value',
          url: 'some value',
        },
      ],
    });
  });
});
