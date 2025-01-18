import { createTransform } from './transform';
import { map } from './map';
import { locationAdapter } from './locationAdapter';

const transform = createTransform();

const sharedMapping = {
  name: 'program_name',
  center: 'program_org_name',
  duration: transform,
};

export const programAdapter = {
  toUpdateInput: createTransform({
    ...sharedMapping,
    ageGroups: 'age_group_ids',
    ethnicities: 'ethnicity_ids',
    excludedTherapeuticAreas: 'excluded_therapeutic_area_ids',
    genders: 'gender_ids',
    insuranceTypes: 'insurance_type_ids',
    languageServices: 'language_service_ids',
    paymentMethods: 'payment_method_ids',
    paymentOptions: 'payment_option_ids',
    religions: 'religion_ids',
    therapyTypes: 'therapy_ids',
    treatmentTypes: 'treatment_ids',
    specialGroups: 'special_group_ids',
    licenses: map(transform),
    locations: map(locationAdapter.toUpdateInput),
    accreditations: map(transform),
    availability: createTransform({
      is247: 'is_24_7',
    }),
    therapeuticAreas: map((id) => ({
      favorite: true,
      therapeutic_area_id: id,
    })),
    providerTypes: map((id) => ({
      favorite: true,
      provider_type_id: id,
    })),
    noLicense: map(
      createTransform({
        id: 'no_license_reason_id',
      }),
    ),
    remote: createTransform({
      accommodations: 'accommodation_ids',
    }),
  }),

  toCreateInput: createTransform({
    ...sharedMapping,
  }),
};
