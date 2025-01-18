import useSWR from 'swr';
import Api from '../api';

export function useApplet(publicId) {
  const { data } = useSWR(
    ['applet', 'public', publicId],
    () => Api.Applets.fetchPublicApplet(publicId),
    {
      suspense: true,
    },
  );

  return data;
}
