import { getPlacesMarker } from '@/modules/search/utils';

export function getProviderMarker(items = []) {
  const personAvailableProviders = items.filter(({ inPerson }) => inPerson?.available);
  return getPlacesMarker(personAvailableProviders);
}
