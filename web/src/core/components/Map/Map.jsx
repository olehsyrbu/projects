import { useEffect } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react-concurrent';

import { loaderConfig } from '@/core/api/MapsAPI';
import { formatGeoCoordinates, getLngCoordinateByModuleValue } from './utils';
import { noop } from '@/core/utils';
import './Map.css';

export function Map({
  loaderConfig,
  onClick,
  onChildClickCallback,
  zoom,
  center,
  children,
  defaultMapOptions,
  onChangeMap,
  className,
}) {
  useEffect(() => {
    const elem = document.querySelector('.mir-google-map');
    if (elem && elem.children && elem.children.length > 0) {
      elem.children[0].setAttribute('data-testid', 'miresource-map');
    }
  }, []);

  function handlerChangeMap(e) {
    const { marginBounds, zoom, center } = e;
    const { ne, sw } = marginBounds;

    const centerMap = {
      lat: formatGeoCoordinates(center.lat),
      lng: formatGeoCoordinates(center.lng),
    };
    const bounds = {
      northeast: {
        lat: ne.lat,
        lng: getLngCoordinateByModuleValue(ne.lng),
      },
      southwest: {
        lat: sw.lat,
        lng: getLngCoordinateByModuleValue(sw.lng),
      },
    };
    onChangeMap({
      zoom,
      centerMap,
      bounds,
    });
  }

  return (
    <div className={`mir-google-map ${className}`}>
      <GoogleMapReact
        center={center}
        zoom={zoom}
        onClick={onClick}
        onChange={handlerChangeMap}
        onChildClick={onChildClickCallback}
        options={defaultMapOptions}
        bootstrapURLKeys={loaderConfig}
      >
        {children}
      </GoogleMapReact>
    </div>
  );
}

Map.propTypes = {
  onChildClickCallback: PropTypes.func,
  onChangeMap: PropTypes.func,
  onClick: PropTypes.func,
  defaultMapOptions: PropTypes.object,
  styleMap: PropTypes.object,
  center: PropTypes.object,
  zoom: PropTypes.number,
  loaderConfig: PropTypes.object,
  children: PropTypes.node,
  className: PropTypes.string,
};

Map.defaultProps = {
  defaultMapOptions: {
    zoomControl: true,
    zoomControlOptions: {
      position: 4, //position LEFT_CENTER
    },
    fullscreenControl: false,
    gestureHandling: 'greedy',
  },
  loaderConfig: loaderConfig,
  center: {
    lat: 37.09024,
    lng: -95.712891,
  },
  zoom: 4,
  onChangeMap: noop,
};
