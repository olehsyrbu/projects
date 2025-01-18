import { useAvailabilityTypes } from '@/core/api/ReferenceDataQueries';

export function useAvailabilityByStatus(status) {
  const [availabilityTypesRefData, defaultAvailability] = useAvailabilityTypes();
  return status
    ? availabilityTypesRefData.find(({ code }) => code === status)
    : defaultAvailability;
}
