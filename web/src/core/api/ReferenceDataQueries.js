import { AVAILABILITY_TYPES } from '@/core/definitions';
// let's break the hierarchy for now
import { useReferenceData as useRD } from '@/modules/reference-data';

function useReferenceData(type, filterType = 'PERSON', sort) {
  let types = [].concat(filterType);
  return useRD(type, { types }, sort);
}

export function useAvailabilityTypes() {
  const availabilityTypes = [
    {
      id: AVAILABILITY_TYPES.ACCEPTING_NEW_CLIENTS,
      code: AVAILABILITY_TYPES.ACCEPTING_NEW_CLIENTS,
      name: 'Accepting clients',
    },
    {
      id: AVAILABILITY_TYPES.NOT_ACCEPTING_NEW_CLIENTS,
      code: AVAILABILITY_TYPES.NOT_ACCEPTING_NEW_CLIENTS,
      name: 'Not accepting clients',
    },
    {
      id: AVAILABILITY_TYPES.PLEASE_INQUIRE,
      code: AVAILABILITY_TYPES.PLEASE_INQUIRE,
      name: 'Please inquire',
    },
  ];
  return [availabilityTypes, availabilityTypes[0]];
}

export function useNoLicenseReasons(type) {
  return useReferenceData('NoLicenseReason', type, { order: 'ASC' });
}

export function useDietaryAccommodationType(type) {
  return useReferenceData('DietaryAccommodation', type);
}

export function useProgramTypes(type = 'PROGRAM') {
  return useReferenceData('ProgramType', type);
}

export function useAccommodations(type) {
  return useReferenceData('Accommodation', type);
}

export function useAmenities(type) {
  return useReferenceData('Amenity', type);
}

export function useAgeGroups(type) {
  return useReferenceData('AgeGroup', type);
}

export function useInsuranceTypes(type) {
  return useReferenceData('InsuranceType', type);
}

export function usePaymentOptions(type) {
  return useReferenceData('PaymentOption', type);
}

export function usePaymentMethods(type) {
  return useReferenceData('PaymentMethod', type);
}

export function useTherapeuticAreas(type) {
  return useReferenceData('TherapeuticArea', type);
}
