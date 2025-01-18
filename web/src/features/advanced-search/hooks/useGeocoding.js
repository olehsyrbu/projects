import useSWR from 'swr';
import { isEmpty } from 'lodash-es';

import { lookupLatLng } from '@/core/api/GeocodingAPI';
import { CITY_ZOOM, STATE_ZOOM } from '../utils';

export function useGeocoding(location, geocodings, isSuspense = true) {
  let { data } = useSWR(
    ['search-geocoding', location],
    async () => {
      if (location !== '' && location !== geocodings?.locationInput) {
        let [geoCode] = await lookupLatLng({ address: location });
        if (!isEmpty(geoCode)) {
          geoCode.zoom = !geoCode?.city && geoCode?.region ? STATE_ZOOM : CITY_ZOOM;
          geoCode.locationInput = location;
        }

        return geoCode;
      }
    },
    { suspense: isSuspense },
  );

  return data;
}
