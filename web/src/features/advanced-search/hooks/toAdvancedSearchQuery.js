import { createSearchQueryConvertor } from './convertor';
import { AVAILABILITY_TYPES } from '@/core/definitions';
import { getLocation, getSettings } from './utils';

export const toAdvancedSearchQuery = createSearchQueryConvertor({
  modes: {
    type: Array,
    toQuery: (val) => ({
      modes: [...val],
    }),
  },
  page: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 5,
  },
  sort: {
    type: Object,
    toQuery: (val) => ({
      sort: val,
    }),
  },
  ageGroups: {
    type: Array,
    toQuery: (val) => ({
      age_groups: [...val],
    }),
  },
  accommodation: {
    type: Array,
    toQuery: (val) => ({
      accommodations: [...val],
    }),
  },
  amenities: {
    type: Array,
    toQuery: (val) => ({
      amenities: [...val],
    }),
  },
  dietaryAccommodations: {
    type: Array,
    toQuery: (val) => ({
      dietary_accommodation: [...val],
    }),
  },
  query: {
    type: String,
    toQuery: (val) => ({
      fuzzy_search: val,
    }),
  },
  specialties: {
    type: Array,
    toQuery: (val) => ({
      therapeutic_areas: [...val],
    }),
  },
  networkInsurance: {
    type: Array,
    toQuery: (val) => ({
      insurance_types: [...val],
    }),
  },
  paymentMethods: {
    type: Array,
    toQuery: (val) => ({
      payment_options: [...val],
    }),
  },
  programTypes: {
    type: Array,
    toQuery: (val) => ({
      program_types: [...val],
    }),
  },
  canAssistWithDailyLiving: {
    type: Boolean,
    toQuery: (val) => {
      if (!val) return;
      return {
        can_assist_with_daily_living: val,
      };
    },
  },
  treatsMedicallyUnstable: {
    type: Boolean,
    toQuery: (val) => {
      if (!val) return;
      return {
        treats_medically_unstable: val,
      };
    },
  },
  treatsSuicidalIdeation: {
    type: Boolean,
    toQuery: (val) => {
      if (!val) return;
      return {
        treats_suicidal_ideation: val,
      };
    },
  },
  rainbowMember: {
    type: Boolean,
    toQuery: (val) => {
      if (!val) {
        return;
      }
      return {
        rainbow_member: val,
      };
    },
  },
  sexualIdentities: {
    type: Array,
    toQuery: (val) => ({
      sexual_identities: [...val],
    }),
  },
  genders: {
    type: Array,
    toQuery: (val) => ({
      genders: [...val],
    }),
  },
  religions: {
    type: Array,
    toQuery: (val) => ({
      religions: [...val],
    }),
  },
  languages: {
    type: Array,
    toQuery: (val) => ({
      language_services: [...val],
    }),
  },
  ethnicities: {
    type: Array,
    toQuery: (val) => ({
      ethnicities: [...val],
    }),
  },
  modalities: {
    type: Array,
    toQuery: (val) => ({
      therapies: [...val],
    }),
  },
  setting: {
    type: String,
    toQuery: (setting, key, rest) => {
      return {
        OR: getSettings(setting),
        location: getLocation(rest),
      };
    },
  },
  location: {
    type: Object,
    toQuery: (_, key, rest) => {
      return {
        location: getLocation(rest),
      };
    },
  },
  treatments: {
    type: Array,
    toQuery: (val) => ({
      treatments: [...val],
    }),
  },
  organizationSubdomain: {
    type: String,
    toQuery: (val) => ({
      organization_subdomains: [val],
    }),
  },
  providerTypes: {
    type: Array,
    toQuery: (val) => ({
      provider_types: [...val],
    }),
  },
  canPrescribeMedication: {
    type: Boolean,
    toQuery: (val) => {
      if (!val) {
        return;
      }
      return {
        can_prescribe_medication: val,
      };
    },
  },
  isAcceptingNewClients: {
    type: Boolean,
    toQuery: (val) => {
      if (!val) {
        return;
      }
      return {
        availability: {
          status: {
            in: [AVAILABILITY_TYPES.ACCEPTING_NEW_CLIENTS, AVAILABILITY_TYPES.PLEASE_INQUIRE],
          },
        },
      };
    },
  },
  timeZone: {
    type: String,
    toQuery: (val) => ({
      availability: {
        timezone: val,
      },
    }),
  },
  startTime: {
    type: String,
    toQuery: (val) => ({
      availability: {
        start: val,
      },
    }),
  },
  endTime: {
    type: String,
    toQuery: (val) => ({
      availability: {
        end: val,
      },
    }),
  },
  day: {
    type: Array,
    toQuery: (val) => {
      return {
        availability: {
          day: val,
        },
      };
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
  organizationTypes: {
    type: Object,
    toQuery: (val) => ({ organization_types: val }),
  },
  specialGroups: {
    type: Array,
    toQuery: (val) => ({
      special_groups: [...val],
    }),
  },
  hasPsypact: {
    type: Boolean,
    toQuery: (val) => {
      if (!val) {
        return;
      }
      return {
        has_psypact: val,
      };
    },
  },
});
