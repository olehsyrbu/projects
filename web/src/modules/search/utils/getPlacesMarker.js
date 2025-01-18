import { groupBy } from 'lodash-es';

export function getPlacesMarker(providers) {
  let markers = providers.flatMap(({ id, slug, photoUrl, locations }) =>
    locations
      .filter(({ address }) => address?.coordinates)
      .map(({ address }) => {
        let [lng, lat] = address.coordinates.coordinates;
        return { id, slug, photoUrl, lng, lat };
      }),
  );

  let groups = groupBy(markers, (m) => `${m.lng}-${m.lat}`);

  return Object.values(groups).map((markers) => {
    let cluster = [...new Set(markers.map((m) => m.id))];
    return cluster.length > 1 ? { ...markers[0], cluster } : markers[0];
  });
}
