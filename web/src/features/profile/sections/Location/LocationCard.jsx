import PropTypes from 'prop-types';
import config from '@/core/config';
import GoogleMap from 'google-map-react-concurrent';
import { Open20Filled as Open } from '@fluentui/react-icons';

let mapOptions = {
  key: config.googleMapsApiKey,
  version: 'weekly',
  libraries: ['places'],
};

export function LocationCard({ photoUrl, location }) {
  let { name, facilityType, address } = location;
  let { address1, address2, city, state, zip, coordinates } = address;
  let coords = coordinates?.coordinates?.slice()?.reverse();

  if (address.zipCode) {
    zip = address.zipCode;
  }

  return (
    <div className="max-md:space-y-3 md:flex md:transform-gpu md:overflow-hidden md:rounded-2xl md:border md:border-graphics-30">
      <div className="flex-none md:w-[315px] md:px-6 md:py-4">
        {name ? <p className="mb-1 text-xl font-bold">{name}</p> : null}

        {facilityType ? <p className="font-medium">{facilityType.name}</p> : null}

        <p className="mt-3 whitespace-pre-line">
          {[address1, address2, `${city}, ${state.name} ${zip}`].filter(Boolean).join('\n')}
        </p>

        {coords ? <MapLink lat={coords[0]} lng={coords[1]} className="max-md:hidden" /> : null}
      </div>

      {coords ? (
        <div className="flex-1 border-l border-graphics-30 max-md:h-[272px] max-md:border">
          <GoogleMap
            bootstrapURLKeys={mapOptions}
            center={coords}
            zoom={16}
            options={{ disableDefaultUI: true, keyboardShortcuts: false, gestureHandling: 'none' }}
          >
            <Marker url={photoUrl} lat={coords[0]} lng={coords[1]} />
          </GoogleMap>
        </div>
      ) : null}

      {coords ? <MapLink lat={coords[0]} lng={coords[1]} className="md:hidden" /> : null}
    </div>
  );
}

function MapLink({ lat, lng, className }) {
  return (
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
      target="_blank"
      rel="noreferrer"
      className={`mt-3 flex items-center text-sm font-medium text-p-100 ${className}`}
    >
      <Open className="mr-1" />
      Open map
    </a>
  );
}

function Marker({ url }) {
  return (
    <img
      src={url}
      alt=""
      className="-ml-5 -mt-5 h-10 w-10 rounded-full border-4 border-solid border-white object-cover shadow-[0_4px_10px_rgba(0,0,0,0.18)]"
    />
  );
}

LocationCard.propTypes = {
  photoUrl: PropTypes.string.isRequired,
  location: PropTypes.object,
};
MapLink.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  className: PropTypes.string.isRequired,
};
Marker.propTypes = {
  url: PropTypes.string.isRequired,
};
