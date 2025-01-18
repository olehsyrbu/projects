import useSWR from 'swr';
import { fetchProvider } from '@/core/api/ProviderAPI';
import { useFlag } from '@/core/feature-split';
import { useOrganization } from '@/modules/organization';
import { useAuthContext } from '@/modules/auth';

export function usePersonProvider(id) {
  let { user } = useAuthContext();
  let { data: provider } = useSWR(
    ['provider', id, user?.organization?.subdomain],
    () => fetchProvider(id, user?.organization?.subdomain),
    {
      suspense: true,
    },
  );

  const nationalIdentifierFlag = useFlag('national-provider-identifier');
  const organization = useOrganization();

  if (nationalIdentifierFlag) {
    const subdomain = organization?.subdomain;
    if (['bcbsks', 'aetna'].includes(subdomain)) {
      provider.nationalProviderIdentifier = provider?.nationalProviderIdentifier || '';
    } else if (!provider?.nationalProviderIdentifier) {
      provider.nationalProviderIdentifier = undefined;
    }
  } else {
    provider.nationalProviderIdentifier = undefined;
  }

  const providerTypes =
    provider?.providerTypes?.map(({ providerType }) => ({
      ...providerType,
    })) ?? [];

  provider = {
    ...provider,
    providerTypes,
    legalFirstName: provider?.legalFirstName || '',
    legalLastName: provider?.legalLastName || '',
    preferredFirstName: provider?.preferredFirstName || '',
    tagLine: provider?.tagLine || '',
    description: provider?.description || '',
    website: provider?.website || '',
    rainbowMember: provider?.rainbowMember ?? false,
    genders: provider?.genders ?? [],
    sexualIdentities: provider?.sexualIdentities ?? [],
    ethnicities: provider?.ethnicities ?? [],
    religions: provider?.religions ?? [],
    therapyTypes: provider?.therapyTypes ?? [],
    excludedTherapeuticAreas: provider?.excludedTherapeuticAreas ?? [],
    therapeuticAreas: provider?.therapeuticAreas?.map((item) => ({ ...item.therapeuticArea })),
    treatmentTypes: provider?.treatmentTypes ?? [],
    canPrescribeMedication: provider?.canPrescribeMedication ?? false,
    languageServices: provider?.languageServices ?? [],
    ageGroups: provider?.ageGroups ?? [],
    specialGroups: provider?.specialGroups ?? [],
  };

  return provider;
}
