/*global google*/
import { Loader } from '@googlemaps/js-api-loader';
import config from '../config';

export const loaderConfig = {
  apiKey: config.googleMapsApiKey,
  version: 'weekly',
  libraries: ['places'],
};

let apiLoader = new Loader({
  ...loaderConfig,
});

function loadMapsApi() {
  return apiLoader.done ? Promise.resolve() : apiLoader.load();
}

export function preloadMapsApi() {
  loadMapsApi();
}

export async function createMap(element, options) {
  await loadMapsApi();
  return new google.maps.Map(element, options);
}

export const parseLocationDetail = (address_components) => {
  if (address_components) {
    let address = '';
    let zipCode = '';
    let city = '';
    let state = {};

    for (const component of address_components) {
      const componentType = component.types[0];
      switch (componentType) {
        case 'street_number': {
          address = `${component.long_name} ${address}`;
          break;
        }
        case 'route': {
          address += component.long_name;
          break;
        }
        case 'postal_code': {
          zipCode = `${component.long_name}${zipCode}`;
          break;
        }
        case 'locality':
          city = component.long_name;
          break;
        case 'administrative_area_level_1': {
          state = {
            code: component.short_name,
            name: component.long_name,
          };
          break;
        }
        default:
          break;
      }
    }

    return {
      address,
      zipCode,
      state,
      city,
    };
  }
};

export async function fetchLocationDetail({ placeId }) {
  await loadMapsApi();
  const request = {
    placeId,
    fields: ['All'],
  };

  return new Promise((resolve, reject) => {
    const place = new google.maps.places.PlacesService(document.createElement('div'));
    place.getDetails(request, (location, status) => {
      switch (status) {
        case 'OK':
          resolve(parseLocationDetail(location?.address_components));
          break;
        case 'ZERO_RESULTS':
          resolve([]);
          break;
        default: {
          let error = new Error(status);
          error.name = 'AutocompleteService error';
          reject(error);
          break;
        }
      }
    });
  });
}

export async function fetchLocationSuggestions({ query }) {
  await loadMapsApi();

  let autocompleteService = new google.maps.places.AutocompleteService();

  let request = {
    input: query,
    componentRestrictions: { country: 'us' },
  };

  return new Promise((resolve, reject) => {
    autocompleteService.getPlacePredictions(request, (predictions, status) => {
      switch (status) {
        case 'OK':
          resolve(predictions);
          break;
        case 'ZERO_RESULTS':
          resolve([]);
          break;
        default: {
          let error = new Error(status);
          error.name = 'AutocompleteService error';
          reject(error);
          break;
        }
      }
    });
  });
}

export async function fetchPlacePredictions(input) {
  await loadMapsApi();

  let service = new google.maps.places.AutocompleteService();

  let { predictions } = await service.getPlacePredictions({
    input,
    componentRestrictions: {
      country: 'us',
    },
    types: ['address'],
  });
  return predictions;
}

export async function fetchPlaceDetails(request) {
  await loadMapsApi();

  let service = new google.maps.places.PlacesService(document.createElement('div'));

  return new Promise((resolve, reject) => {
    service.getDetails(request, (result, status) => {
      result ? resolve(result) : reject(status);
    });
  });
}
