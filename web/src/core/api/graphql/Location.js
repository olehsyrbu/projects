import { gql } from 'graphql-request';

export const ProviderLocationFragment = gql`
  fragment ProviderLocation on ProviderInPersonLocation {
    id
    name
    photos {
      ...Photo
    }
    address: address {
      state: state {
        ...State
      }
      address1
      address2
      city
      zip
      coordinates: coordinates {
        coordinates: coordinates
      }
    }
    phone
    hide
    facilityType: facility_type {
      ...ReferenceData
    }
    accommodations {
      ...ReferenceData
    }
  }
`;

export const ProgramLocationFragment = gql`
  fragment ProgramLocation on ProviderInPersonLocation {
    id
    name
    photos {
      ...Photo
    }
    types: program_types {
      amount
      type {
        id
        code
      }
    }
    address: address {
      ...ProgramAddress
    }
    phone
    hide
    admissionPhone: admission_phone
    facilityType: facility_type {
      ...ReferenceData
    }
    accommodations {
      ...ReferenceData
    }
    amenities {
      ...ReferenceData
    }
    dietaryAccommodation: dietary_accommodation {
      ...ReferenceData
    }
  }
`;

export const ProgramAddress = gql`
  fragment ProgramAddress on Address {
    state: state {
      ...State
    }
    coordinates: coordinates {
      coordinates: coordinates
    }
    address1: address1
    address2: address2
    city
    zip
  }
`;
