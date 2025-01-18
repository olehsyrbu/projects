import { toAdvancedSearchQuery } from './toAdvancedSearchQuery';
import { SEARCH_WORK_SETTING } from '@/modules/search/utils';

it('has query into filter', () => {
  let searchText = 'bbkbkkbkbkbkb';

  expect(
    toAdvancedSearchQuery({
      query: searchText,
    }),
  ).toMatchSnapshot();
});

it('has specialties into filter', () => {
  const specialties = ['000', '111', '222'];

  expect(
    toAdvancedSearchQuery({
      specialties,
    }),
  ).toMatchSnapshot();
});

it('has specialGroups into filter', () => {
  const specialGroups = ['000', '111', '222'];

  expect(
    toAdvancedSearchQuery({
      specialGroups,
    }),
  ).toMatchSnapshot();
});

it('has organizationSubdomain into filter', () => {
  const organizationSubdomain = 'bcbsks';

  expect(
    toAdvancedSearchQuery({
      organizationSubdomain,
    }),
  ).toMatchSnapshot();
});

it('has day into filter', () => {
  const day = ['SUNDAY', 'MONDAY'];

  expect(
    toAdvancedSearchQuery({
      day,
    }),
  ).toMatchSnapshot();
});

it('provides default pagination', () => {
  expect(toAdvancedSearchQuery()).toEqual({
    filter: {
      active: true,
    },
    page: 1,
    limit: 5,
  });
});

it('provides age group', () => {
  const ageGroups = ['blblblbl', 'ssss'];
  expect(
    toAdvancedSearchQuery({
      ageGroups,
    }),
  ).toMatchSnapshot();
});

it('provides startTime', () => {
  const startTime = '12:30';
  expect(
    toAdvancedSearchQuery({
      startTime,
    }),
  ).toMatchSnapshot();
});

it('provides endTime', () => {
  const endTime = '15:30';
  const params = toAdvancedSearchQuery({
    endTime,
  });

  expect(params).toMatchSnapshot();
});

it('provides timezone', () => {
  const timeZone = 'Pacific/Pago_Pago';
  expect(
    toAdvancedSearchQuery({
      timeZone,
    }),
  ).toMatchSnapshot();
});

it('provides network insurance', () => {
  expect(
    toAdvancedSearchQuery({
      networkInsurance: ['000', '111'],
    }),
  ).toMatchSnapshot();
});

it('provides accommodations insurance', () => {
  expect(
    toAdvancedSearchQuery({
      accommodation: ['000', '111'],
    }),
  ).toMatchSnapshot();
});

it('provides payment methods', () => {
  expect(
    toAdvancedSearchQuery({
      paymentMethods: ['000', '111'],
    }),
  ).toMatchSnapshot();
});

it('provides modalities', () => {
  expect(
    toAdvancedSearchQuery({
      modalities: ['000', '111'],
    }),
  ).toMatchSnapshot();
});

it('provides treatments', () => {
  expect(
    toAdvancedSearchQuery({
      treatments: ['000', '111'],
    }),
  ).toMatchSnapshot();
});

it('converts location into filter', () => {
  let location = {
    lat: 11.0001,
    lng: 20.2222,
    distance: {
      max: 10000,
    },
    region: 'CA',
  };

  expect(
    toAdvancedSearchQuery({
      setting: 'inPerson',
      location,
    }),
  ).toMatchSnapshot();
});

it('converts remote only', () => {
  expect(
    toAdvancedSearchQuery({
      setting: 'remote',
    }),
  ).toMatchSnapshot();
});

it('converts both only', () => {
  expect(
    toAdvancedSearchQuery({
      setting: 'both',
    }),
  ).toMatchSnapshot();
});

it('converts in-person only', () => {
  expect(
    toAdvancedSearchQuery({
      setting: 'inPerson',
    }),
  ).toMatchSnapshot();
});

it('has to gql variables location with bounds', () => {
  expect(
    toAdvancedSearchQuery({
      query: 'Test Query',
      setting: 'inPerson',
      location: {
        bounds: {
          northeast: {
            lat: 85.9439285948254,
            lng: -45.486148925235454,
          },
          southwest: {
            lat: -59.58664350008189,
            lng: -126.69708642523545,
          },
        },
      },
    }),
  ).toMatchSnapshot();
});

it('has to gql variables location with bounds both', () => {
  expect(
    toAdvancedSearchQuery({
      query: 'Test Query',
      setting: 'both',
      location: {
        bounds: {
          northeast: {
            lat: 85.9439285948254,
            lng: -45.486148925235454,
          },
          southwest: {
            lat: -59.58664350008189,
            lng: -126.69708642523545,
          },
        },
      },
    }),
  ).toMatchSnapshot();
});

it('has to gql variables location and inPerson', () => {
  expect(
    toAdvancedSearchQuery({
      query: 'Test Query',
      setting: 'inPerson',
      location: {
        lat: 11.0001,
        lng: 20.2222,
        distance: {
          max: 10000,
        },
        region: 'TX',
      },
      specialties: ['000', '111', '222'],
    }),
  ).toMatchSnapshot();
});

it('has "rainbowMember"', () => {
  expect(
    toAdvancedSearchQuery({
      rainbowMember: true,
    }),
  ).toMatchSnapshot();

  expect(
    toAdvancedSearchQuery({
      rainbowMember: false,
    }),
  ).toMatchSnapshot();
});

it('has "genders"', () => {
  expect(
    toAdvancedSearchQuery({
      genders: ['dfdf', '4444', '494949494'],
    }),
  ).toMatchSnapshot();
});

it('has "religions"', () => {
  expect(
    toAdvancedSearchQuery({
      religions: ['dfdf', '4444', '494949494'],
    }),
  ).toMatchSnapshot();
});

it('has "languages"', () => {
  expect(
    toAdvancedSearchQuery({
      languages: ['dfdf', '4444', '494949494'],
    }),
  ).toMatchSnapshot();
});

it('has "ethnicities"', () => {
  expect(
    toAdvancedSearchQuery({
      ethnicities: ['dfdf', '4444', '494949494'],
    }),
  ).toMatchSnapshot();
});

it('has to gql variables location and remote', () => {
  expect(
    toAdvancedSearchQuery({
      query: 'Test Query',
      setting: 'remote',
      location: {
        lat: 11.0001,
        lng: 20.2222,
        distance: {
          max: 10000,
        },
        region: 'TX',
      },
      specialties: ['000', '111', '222'],
      page: 2,
      limit: 10,
    }),
  ).toMatchSnapshot();
});

it('has to gql variables location and both', () => {
  expect(
    toAdvancedSearchQuery({
      query: 'Test Query',
      setting: 'both',
      location: {
        lat: 11.0001,
        lng: 20.2222,
        distance: {
          max: 10000,
        },
        region: 'TX',
      },
      specialties: ['000', '111', '222'],
    }),
  ).toMatchSnapshot();
});

it('has to gql variables no location, no settings', () => {
  expect(
    toAdvancedSearchQuery({
      query: 'Test Query',
      specialties: ['000', '111', '222'],
    }),
  ).toMatchSnapshot();
});

it('has provider types', () => {
  expect(
    toAdvancedSearchQuery({
      providerTypes: ['000', '111', '222'],
    }),
  ).toMatchSnapshot();
});

it('has modes', () => {
  expect(
    toAdvancedSearchQuery({
      modes: ['PERSON', 'PROGRAM'],
    }),
  ).toMatchSnapshot();
});

it('has sexualIdentities', () => {
  expect(
    toAdvancedSearchQuery({
      sexualIdentities: ['123'],
    }),
  ).toMatchSnapshot();
});

it('has "can prescribe medication"', () => {
  expect(
    toAdvancedSearchQuery({
      canPrescribeMedication: true,
    }),
  ).toMatchSnapshot();

  expect(
    toAdvancedSearchQuery({
      canPrescribeMedication: false,
    }),
  ).toMatchSnapshot();
});

it('has "current availability"', () => {
  expect(
    toAdvancedSearchQuery({
      isAcceptingNewClients: true,
    }),
  ).toMatchSnapshot();

  expect(
    toAdvancedSearchQuery({
      isAcceptingNewClients: false,
    }),
  ).toMatchSnapshot();
});

it('has "canAssistWithDailyLiving"', () => {
  expect(
    toAdvancedSearchQuery({
      canAssistWithDailyLiving: true,
    }),
  ).toMatchSnapshot();

  expect(
    toAdvancedSearchQuery({
      canAssistWithDailyLiving: false,
    }),
  ).toMatchSnapshot();
});

it('has "treatsMedicallyUnstable"', () => {
  expect(
    toAdvancedSearchQuery({
      treatsMedicallyUnstable: true,
    }),
  ).toMatchSnapshot();

  expect(
    toAdvancedSearchQuery({
      treatsMedicallyUnstable: false,
    }),
  ).toMatchSnapshot();
});

it('has "treatsSuicidalIdeation"', () => {
  expect(
    toAdvancedSearchQuery({
      treatsSuicidalIdeation: true,
    }),
  ).toMatchSnapshot();

  expect(
    toAdvancedSearchQuery({
      treatsSuicidalIdeation: false,
    }),
  ).toMatchSnapshot();
});

it('has "amenities"', () => {
  expect(
    toAdvancedSearchQuery({
      amenities: ['1'],
    }),
  ).toMatchSnapshot();

  expect(
    toAdvancedSearchQuery({
      amenities: [],
    }),
  ).toMatchSnapshot();
});

it('has "dietaryAccommodations"', () => {
  expect(
    toAdvancedSearchQuery({
      dietaryAccommodations: ['1'],
    }),
  ).toMatchSnapshot();

  expect(
    toAdvancedSearchQuery({
      dietaryAccommodations: [],
    }),
  ).toMatchSnapshot();
});

it('has all params', () => {
  expect(
    toAdvancedSearchQuery({
      canAssistWithDailyLiving: true,
      treatsMedicallyUnstable: true,
      treatsSuicidalIdeation: true,
      modes: ['PERSON', 'PROGRAM'],
      dietaryAccommodations: ['1', '2'],
      amenities: ['am1', 'am2'],
      specialties: ['sp1', 'sp2'],
      sexualIdentities: ['sp1', 'sp2'],
      modalities: ['md1', 'md2'],
      treatments: ['tr1', 'tr2'],
      services: ['ser1', 'ser2'],
      programs: ['pr1', 'pr2'],
      providerTypes: ['pt1', 'pt2'],
      canPrescribeMedication: true,
      isAcceptingNewClients: true,
      location: {
        lat: 11.0001,
        lng: 20.2222,
        distance: {
          max: 10000,
        },
        region: 'TX',
      },
      setting: SEARCH_WORK_SETTING.BOTH,
      networkInsurance: ['nI1', 'nI2'],
      paymentMethods: ['pm1', 'pm2'],
      query: 'some name',
      specialGroups: ['sg1', 'sg2'],
    }),
  ).toMatchSnapshot();
});

it('provides sorting', () => {
  const sort = { nearest: 'ASC' };
  expect(
    toAdvancedSearchQuery({
      sort,
    }),
  ).toMatchSnapshot();
});

it('has special groups', () => {
  expect(
    toAdvancedSearchQuery({
      specialGroups: ['000', '111', '222'],
    }),
  ).toMatchSnapshot();
});
