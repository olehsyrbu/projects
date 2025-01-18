import { DeletePhotos, UploadPhotos } from './graphql/Photo';
import client from './graphQLClient';

export async function uploadPhotos(id, photos) {
  const response = await client.request(UploadPhotos, {
    id,
    photos,
  });

  return response.addProviderLocationPhotos;
}

export async function deletePhotos(id, photos) {
  const response = await client.request(DeletePhotos, {
    id,
    photos,
  });

  return response.deleteProviderLocationPhotos;
}

async function removeLegacyPhotos(location, photos) {
  let deletionIds = location.photos
    .filter((photo) => !photos.includes(photo.url))
    .map(({ id }) => id);

  if (deletionIds.length > 0) {
    await deletePhotos(location.id, deletionIds);
  }
}

export async function updateLocationPhotos({ location, photos }) {
  await removeLegacyPhotos(location, photos);

  function getLocationPhotoId(url) {
    return location.photos.find((photo) => photo.url === url)?.id;
  }

  const requests = photos.map(async (url, order) => {
    let file;
    if (url.includes('blob')) {
      file = await fetch(url, { mode: 'cors' }).then((r) => r.blob());
    }

    return {
      order,
      id: getLocationPhotoId(url),
      ...(file && { file }),
    };
  });

  const uploads = await uploadPhotos(location.id, await Promise.all(requests));

  return {
    ...location,
    photos: uploads.photos,
  };
}
