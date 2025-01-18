import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { VideoPerson28Filled as VideoPerson } from '@fluentui/react-icons';

import { useScreen } from '@/core/hooks';
import { Map, Marker } from '@/core/components/Map';

import { useSearchResults } from '@/features/advanced-search/hooks';
import { DialogClusterProfiles, SearchMapCard } from '@/features/advanced-search/components';

import { getProviderMarker } from './utils';

export function SearchMap({
  centerMap,
  zoom,
  query,
  onOpenProfile,
  onMapChange,
  onHoverProvider,
  hoveredProviderId,
}) {
  const searchResults = useSearchResults(query, false);
  const { items } = searchResults || {};
  const isMediumScreen = useScreen('md');

  const markers = useMemo(() => getProviderMarker(items), [items]);

  const [places, setPlaces] = useState(markers);
  const [profile, setProfile] = useState();
  const [clusterProfiles, setClusterProfiles] = useState();

  const remoteOnlyProviders = (items || []).filter(
    (p) => p.remote?.available && !p.inPerson.available,
  );

  useEffect(() => {
    if (items) {
      let markers = getProviderMarker(items);
      //if don`t have opened profile in list, need to remove profile
      if (!markers.find(({ id }) => id === profile?.id)) {
        setProfile(null);
      }

      setPlaces(markers);
    }
  }, [items]);

  function handlerChildClickCallback(key, { lat, cluster }) {
    if (cluster?.length > 0) {
      const clusterProfiles = items?.filter((profile) => cluster.includes(profile.id));
      setClusterProfiles(clusterProfiles);
    }
    setPlaces(places);

    const profile = items?.find((item) => key.includes(item?.id));
    if (profile) {
      setProfile({ key, lat, ...profile });
    }
  }

  function handlerHideAllCardsClick() {
    setPlaces(getProviderMarker(items));
    setProfile(null);
  }

  function handleCloseDialog() {
    setProfile(null);
    setClusterProfiles(null);
  }

  const isRenderMap = !isMediumScreen && profile;

  return (
    <div className="SearchMap">
      {clusterProfiles && (
        <DialogClusterProfiles
          handleClose={handleCloseDialog}
          handleOpenProfile={onOpenProfile}
          clusterProfiles={clusterProfiles}
        />
      )}
      {remoteOnlyProviders.length > 0 && <RemoteOnlyResources resources={remoteOnlyProviders} />}
      <Map
        center={centerMap}
        zoom={zoom}
        onChildClickCallback={handlerChildClickCallback}
        onClick={handlerHideAllCardsClick}
        onChangeMap={onMapChange}
      >
        {places?.map(({ lat, lng, id, cluster, photoUrl, slug }, index) => (
          <Marker
            key={id + lat + lng + index}
            show={profile?.key === profile?.id + lat + lng + index}
            cluster={cluster}
            lat={lat}
            lng={lng}
            slug={slug}
            photoUrl={photoUrl}
            onHoverProvider={onHoverProvider}
            hoveredProviderId={hoveredProviderId}
          >
            {isMediumScreen && profile && (
              <SearchMapCard onOpenProfile={onOpenProfile} profile={profile} />
            )}
          </Marker>
        ))}
      </Map>
      {isRenderMap && <SearchMapCard onOpenProfile={onOpenProfile} profile={profile} />}
    </div>
  );
}

function RemoteOnlyResources({ resources }) {
  let title = 'resource';
  let modes = new Set(resources.map((r) => r.mode));
  if (modes.size === 1 && modes.has('PROGRAM')) title = 'program';
  if (modes.size === 1 && modes.has('PERSON')) title = 'provider';
  if (resources.length > 1) title += 's';

  return (
    <div className="absolute left-1/2 top-4 z-[1] flex -translate-x-1/2 items-center rounded-lg bg-white px-4 py-2.5 shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
      <VideoPerson className="mr-2 text-graphics-100" />
      {resources.length} remote only {title}
    </div>
  );
}

SearchMap.propTypes = {
  centerMap: PropTypes.object,
  zoom: PropTypes.number,
  query: PropTypes.object,
  onMapChange: PropTypes.func,
  onOpenProfile: PropTypes.func,
  onHoverProvider: PropTypes.func,
  hoveredProviderId: PropTypes.string,
};
RemoteOnlyResources.propTypes = {
  resources: PropTypes.array,
};
