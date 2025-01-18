import { gql } from 'graphql-request';

export const PhotoFragment = gql`
  fragment Photo on ProviderLocationPhoto {
    createdAt: created_at
    id
    updatedAt: updated_at
    url
  }
`;

export const UploadPhotos = gql`
  mutation addPhotosToLocation($id: ID!, $photos: [ProviderLocationPhotoInput!]!) {
    addProviderLocationPhotos(locationId: $id, photos: $photos) {
      id
      name
      photos {
        ...Photo
      }
    }
  }

  ${PhotoFragment}
`;

export const DeletePhotos = gql`
  mutation deleteProviderLocationPhotos($id: ID!, $photos: [ID!]!) {
    deleteProviderLocationPhotos(locationId: $id, photosIds: $photos) {
      id
      name
      photos {
        ...Photo
      }
    }
  }

  ${PhotoFragment}
`;
