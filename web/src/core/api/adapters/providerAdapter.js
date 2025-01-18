import { createTransform } from './transform';
import { map } from './map';
import { locationAdapter } from './locationAdapter';

const transform = createTransform();
export const providerAdapter = {
  toUpdateInput: createTransform({
    genders: 'gender_ids',
    ethnicities: 'ethnicity_ids',
    religions: 'religion_ids',
    sexualIdentities: 'sexual_identities',
    pronoun: 'pronoun_id',
    therapeuticAreas: map((id) => ({
      favorite: true,
      therapeutic_area_id: id,
    })),
    providerTypes: map(({ id }) => ({
      favorite: true,
      provider_type_id: id,
    })),
    locations: map(locationAdapter.toUpdateInput),
    availability: createTransform({
      afterHoursCrisisServices: 'after_hours_crisis_services',
    }),
    licenses: map(transform),
    noLicense: map(
      createTransform({
        comments: 'comments',
        noLicenseReasonId: 'no_license_reason_id',
      }),
    ),
    publications: map(transform),
    educations: map(transform),
    excludedTherapeuticAreas: 'excluded_therapeutic_area_ids',
    therapyTypes: 'therapy_ids',
    treatmentTypes: 'treatment_ids',
    languageServices: 'language_service_ids',
    ageGroups: 'age_group_ids',
    specialGroups: 'special_group_ids',
    paymentOptionIds: 'payment_option_ids',
    insuranceTypeIds: 'insurance_type_ids',
  }),
};
