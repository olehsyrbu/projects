import { isEmpty } from 'lodash-es';
import { OrganizationTypes } from '@/modules/organization';

const SEARCH_MAPPING = {
  rainbowMember: {
    type: Boolean,
    name: 'rainbowMember',
  },
  canPrescribeMedication: {
    type: Boolean,
    name: 'canPrescribeMedication',
  },
  isAcceptingNewClients: {
    type: Boolean,
    name: 'isAcceptingNewClients',
  },
  canAssistWithDailyLiving: {
    type: Boolean,
    name: 'canAssistWithDailyLiving',
  },
  treatsMedicallyUnstable: {
    type: Boolean,
    name: 'treatsMedicallyUnstable',
  },
  treatsSuicidalIdeation: {
    type: Boolean,
    name: 'treatsSuicidalIdeation',
  },
  category: {
    type: String,
    name: 'category',
  },
  query: {
    type: String,
    name: 'query',
  },
  zoomMap: {
    type: Number,
    name: 'zoom',
  },
  startTime: {
    type: String,
    name: 'startTime',
  },
  endTime: {
    type: String,
    name: 'endTime',
  },
  timeZone: {
    type: String,
    name: 'timeZone',
  },
  setting: {
    type: String,
    name: 'workSetting',
  },
  location: {
    type: String,
    name: 'location',
  },
  ageGroups: {
    type: Array,
    name: 'ageGroup',
  },
  day: {
    type: Array,
    name: 'day',
  },
  specialGroups: {
    type: Array,
    name: 'specialGroup',
  },
  networkInsurance: {
    type: Array,
    name: 'networkInsurance',
  },
  paymentMethods: {
    type: Array,
    name: 'paymentMethod',
  },
  treatments: {
    type: Array,
    name: 'treatment',
  },
  modalities: {
    type: Array,
    name: 'modality',
  },
  providerTypes: {
    type: Array,
    name: 'providerType',
  },
  genders: {
    type: Array,
    name: 'gender',
  },
  accommodation: {
    type: Array,
    name: 'accommodation',
  },
  organizationTypes: {
    name: 'organizationTypes',
    parse(params) {
      let globalSearch = params.get('globalSearch');

      if (globalSearch === 'true') {
        return { ne: OrganizationTypes.Insurance };
      }
    },
    toSearchParams: (value) => {
      if (value) {
        return { globalSearch: true };
      }
    },
  },
  programTypes: {
    type: Array,
    name: 'programType',
  },
  modes: {
    type: Array,
    name: 'mode',
  },
  languages: {
    type: Array,
    name: 'language',
  },
  religions: {
    type: Array,
    name: 'religion',
  },
  ethnicities: {
    type: Array,
    name: 'ethnicity',
  },
  specialties: {
    type: Array,
    name: 'therapyArea',
  },
  sexualIdentities: {
    type: Array,
    name: 'sexualIdentity',
  },
  amenities: {
    type: Array,
    name: 'amenity',
  },
  dietaryAccommodations: {
    type: Array,
    name: 'dietaryAccommodation',
  },
  locationCoordinates: {
    name: 'locationCoordinates',
    parse(params) {
      let lat = params.get('loc_lat');
      let lng = params.get('loc_lng');
      if (lat && lng) {
        return { lat: +lat, lng: +lng };
      }
    },
    toSearchParams: ({ lat, lng }) => {
      if (lat && lng) {
        return { loc_lat: +lat, loc_lng: +lng };
      }
    },
  },
  centerMap: {
    type: Object,
    parse: (params) => {
      const lat = params.get('lat');
      const lng = params.get('lng');
      if (lat && lng) {
        return { lat: +lat, lng: +lng };
      }
    },
    toSearchParams: ({ lat, lng }) => {
      if (lat && lng) {
        return { lat: +lat, lng: +lng };
      }
    },
  },
  bounds: {
    type: Object,
    parse: (params) => {
      const neLat = params.get('ne_lat');
      const neLng = params.get('ne_lng');
      const swLat = params.get('sw_lat');
      const swLng = params.get('sw_lng');
      let hasBounds = neLat && neLng && swLat && swLng;
      if (hasBounds) {
        return {
          northeast: { lat: +neLat, lng: +neLng },
          southwest: { lat: +swLat, lng: +swLng },
        };
      }
    },
    toSearchParams: (bounds) => {
      const { northeast, southwest } = bounds;
      if (northeast && southwest) {
        let { lat: ne_lat, lng: ne_lng } = northeast;
        let { lat: sw_lat, lng: sw_lng } = southwest;
        if (ne_lat && ne_lng && sw_lat && sw_lng) {
          return { ne_lat, ne_lng, sw_lat, sw_lng };
        }
      }
    },
  },
  hasPsypact: {
    type: Boolean,
    name: 'hasPsypact',
  },
};

export function parseAdvancedSearchUrl(url) {
  let urlParams = new URLSearchParams(url);
  let result = {};
  Object.entries(SEARCH_MAPPING).forEach(([key, mappingParams]) => {
    const { parse, type, name } = mappingParams;
    let value = urlParams.get(name);
    if (value) {
      if (type === Array) {
        value = urlParams.getAll(name);
      }
      if (type === Boolean && typeof value === 'string') {
        value = value === 'true';
      }
      if (type === Number) {
        value = Number(value);
      }
      result[key] = value;
    }
    if (parse) {
      result[key] = parse(urlParams);
    }
  });
  return result;
}

export function toAdvancedSearchParams(record) {
  let params = new URLSearchParams();
  Object.entries(SEARCH_MAPPING).forEach(([key, mapping]) => {
    let name = mapping?.name ?? key;
    let value = record[key];
    if (mapping?.toSearchParams && !isEmpty(value)) {
      for (const [key, searchParam] of Object.entries(mapping.toSearchParams(value))) {
        params.append(key, searchParam);
      }
      return params;
    }
    if (mapping?.stringify) {
      return params.append(name, mapping.stringify(value));
    }

    if (Array.isArray(value)) {
      return value.forEach((item) => params.append(name, item));
    }

    if (value === null || value === undefined) return params;
    params.append(name, value);
  });

  return params.toString();
}
