import config from '../config';
import { getDistance } from 'geolib';

/**
 * Send address string to third-party (Google) api to
 * convert in longitude/latitude
 * @param {Object} context
 * @param {String} context.address - address string
 *
 * @return {Promise<Object[]>}
 */

const MAX_MINIMUM_DISTANCE = 20 * 1000;

export async function lookupLatLng({ address }) {
  let response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&components=country:US&key=${config.googleMapsApiKey}`,
  );
  response = await response.json();

  return response.results.map((result) => {
    let geometry = result.geometry;
    let addresses = result.address_components || [];

    const region = addresses.find((address) => {
      return address.types.includes('administrative_area_level_1');
    });

    const city = addresses.find((address) => {
      return address.types.includes('locality');
    });

    if (!geometry || !geometry.location) {
      return undefined;
    }

    let viewport = geometry.viewport;
    const distance = getDistance(
      {
        latitude: viewport.northeast.lat,
        longitude: viewport.northeast.lng,
      },
      {
        latitude: viewport.southwest.lat,
        longitude: viewport.southwest.lng,
      },
    );

    return {
      ...geometry,
      distance: {
        max: distance < MAX_MINIMUM_DISTANCE ? MAX_MINIMUM_DISTANCE : distance,
        min: 0,
      },
      region: region?.short_name,
      city: city?.short_name,
    };
  });
}
