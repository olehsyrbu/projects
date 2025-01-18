import { useCallback } from 'react';
import { isEqual, omit } from 'lodash-es';
import useSWR, { mutate } from 'swr';
import mixpanel from '@/core/mixpanel';
import {
  attachProviderPhotoUrl,
  createProvider as createProviderAPI,
  fetchOrganizationProviders,
  fetchProvider,
  fetchProviderBySlug,
  getListGPAProviders as getListGPAProvidersAPI,
  getProviders as getProvidersAPI,
  getUsersEmail as getUsersEmailAPI,
  removePendingProvider as removePendingProviderAPI,
  removeProviderFromGPA as removeProviderFromGpaAPI,
  removeProviderFromOrganization as removeProviderFromOrganizationAPI,
  removeShareAccess as removeShareAccessAPI,
  updatePersonProviderProfile as updatePersonProviderProfileAPI,
  updateProvider as updateProviderAPI,
  updateProviderPhoto as updateProviderPhotoAPI,
  updateProviderStatus as updateProviderStatusAPI,
  updateShareAccess as updateShareAccessAPI,
  removeProviderAccess as removeProviderAccessAPI,
} from '@/core/api/ProviderAPI';
import { logger } from '@/core/logger';
import { useAuthContext } from '@/modules/auth';
import { usePersonProvider } from '@/modules/provider';
import { useFlag } from '@/core/feature-split';
import config from '@/core/config';
import { providerAdapter } from './adapters/providerAdapter';

const createProviderKey = (id, subdomain) => (id ? ['provider', id, subdomain] : null);

export function useProviders(query) {
  let options = query || { page: 1, limit: 10 };
  return useSWR(
    ['user-providers', options.page, options.limit],
    () => getProvidersAPI({ ...query }),
    {
      suspense: true,
    },
  );
}

export function useGPAProviders(query) {
  let options = query || { page: 1, limit: 10 };
  return useSWR(
    ['gpa-providers', options.page, options.limit],
    () => getListGPAProvidersAPI({ ...query }),
    {
      suspense: true,
    },
  );
}

export function useProvider(id, subdomain) {
  let { data: provider } = useSWR(
    createProviderKey(id, subdomain),
    () => fetchProvider(id, subdomain),
    {
      suspense: true,
    },
  );
  return provider;
}

export function useProviderBySlug(slug, subdomain) {
  const providerPromotion = useFlag('provider-promotion-v2');

  let { data: provider } = useSWR(
    createProviderKey(slug, subdomain),
    () => fetchProviderBySlug(slug, subdomain),
    {
      suspense: true,
    },
  );

  if (!provider.availability) {
    provider.availability = {
      hours: [],
    };
  }

  if (providerPromotion?.subdomain) {
    const partner = {
      subdomain: providerPromotion.subdomain,
      name: providerPromotion.organizationName,
    };
    const isPartnerOrganization = provider.organizations?.find(
      (item) => item?.subdomain === providerPromotion.subdomain,
    );
    provider.partner = isPartnerOrganization ? partner : null;
  }

  if (config.organizationInsuranceTypes && subdomain) {
    const subDomainCodes = config.organizationInsuranceTypes[subdomain];
    if (subDomainCodes) {
      provider.insuranceTypes.sort((type1, type2) => {
        if (subDomainCodes.includes(type1.code)) return -1;
        if (subDomainCodes.includes(type2.code)) return 1;
        return 0;
      });
    }
  }

  return provider;
}

export function useOrganizationProviders(query) {
  let { user } = useAuthContext();
  return useSWR(
    ['organization-providers', query],
    () =>
      fetchOrganizationProviders({
        userId: user?.id,
        organizationId: user?.organization?.id,
        ...query,
      }),
    { suspense: true },
  );
}

export async function createProvider(provider, creator) {
  let newProvider = await createProviderAPI(provider);
  await mutate(
    createProviderKey(newProvider.id, creator?.organization?.subdomain),
    newProvider,
    false,
  );
  mixpanel.track('Create Provider', {
    slug: newProvider.slug,
    inviter: {
      id: creator.id,
      email: creator.email,
      role: creator.role,
    },
  });
  return newProvider;
}

export async function updateProvider(providerId, provider, creator) {
  let newProvider = await updateProviderAPI(providerId, provider);
  await mutate(createProviderKey(providerId, creator?.organization?.subdomain), newProvider, false);
  let payload = {
    availability: newProvider.availability,
    slug: newProvider.slug,
    status: newProvider.status,
    mode: newProvider.mode,
  };

  if (!isEqual(newProvider.availability, provider.availability)) {
    payload.availability = newProvider.availability;
  }

  mixpanel.track('Update Provider', payload);
  return newProvider;
}

const filterByCodes = (items) => items?.filter((item) => item.code).map(({ code }) => code) ?? [];
const filterById = (items) => items?.filter((item) => item.id).map(({ id }) => id) ?? [];

export function mapProviderRefDataObjectsToIdsAndCodes(p) {
  if (p?.remote) {
    p.remote = {
      ...p.remote,
      states: filterByCodes(p.remote.states),
    };
  }
  if (p.sexualIdentities) {
    p.sexualIdentities = filterByCodes(p.sexualIdentities);
  }

  if (p.genders) {
    p.genders = filterById(p.genders);
  }
  if (p.ethnicities) {
    p.ethnicities = filterById(p.ethnicities);
  }
  if (p.religions) {
    p.religions = filterById(p.religions);
  }
  if (p.therapeuticAreas) {
    p.therapeuticAreas = filterById(p.therapeuticAreas);
  }
  if (p.excludedTherapeuticAreas) {
    p.excludedTherapeuticAreas = filterById(p.excludedTherapeuticAreas);
  }
  if (p.therapyTypes) {
    p.therapyTypes = filterById(p.therapyTypes);
  }
  if (p.treatmentTypes) {
    p.treatmentTypes = filterById(p.treatmentTypes);
  }
  if (p.languageServices) {
    p.languageServices = filterById(p.languageServices);
  }
  if (p.ageGroups) {
    p.ageGroups = filterById(p.ageGroups);
  }
  if (p.specialGroups) {
    p.specialGroups = filterById(p.specialGroups);
  }

  return p;
}

export function useUpdatePersonProviderProfile() {
  return async (id, providerData, creator) => {
    let { photoUrl, ...provider } = providerData;

    if (photoUrl) {
      await attachProviderPhotoUrl(id, photoUrl);
    }

    provider = mapProviderRefDataObjectsToIdsAndCodes(provider);

    let newProvider = await updatePersonProviderProfileAPI(id, provider);
    await mutate(createProviderKey(id, creator?.organization?.subdomain), newProvider, false);
    let payload = {
      availability: newProvider.availability,
      slug: newProvider.slug,
      status: newProvider.status,
      mode: newProvider.mode,
    };

    if (!isEqual(newProvider.availability, provider.availability)) {
      payload.availability = newProvider.availability;
    }

    mixpanel.track('Update Provider', payload);
    return newProvider;
  };
}

export async function updateProviderPhoto(id, blob, creator) {
  let newProvider = await updateProviderPhotoAPI(id, blob);
  await mutate(createProviderKey(id, creator?.organization?.subdomain), newProvider, false);
}

export function usePersonOnBoardingProvider(id, creator) {
  let provider = usePersonProvider(id, creator?.organization?.subdomain);
  let updateOnBoardingProvider = (patch) => {
    return id === 'newProvider'
      ? createProvider(providerAdapter.toUpdateInput(patch), creator)
      : updatePersonProvider(id, patch, creator);
  };

  return [provider, updateOnBoardingProvider];
}

export async function updatePersonProvider(id, provider, creator) {
  provider = mapProviderRefDataObjectsToIdsAndCodes(provider);

  if (provider.photoUrl) {
    await attachProviderPhotoUrl(id, provider.photoUrl);
    provider = omit(provider, 'photoUrl');
  }

  let newProvider = await updatePersonProviderProfileAPI(id, provider);
  await mutate(createProviderKey(id, creator?.organization?.subdomain), newProvider, false);
  let payload = {
    availability: newProvider.availability,
    slug: newProvider.slug,
    status: newProvider.status,
    mode: newProvider.mode,
  };

  if (!isEqual(newProvider.availability, provider.availability)) {
    payload.availability = newProvider.availability;
  }

  mixpanel.track('Update Provider', payload);
  return newProvider;
}

export function useUserProvider(providerId) {
  let { user } = useAuthContext();
  let ownership = user?.ownership[0];
  const id = providerId || ownership?.id;
  const subdomain = user?.organization?.subdomain;

  let provider = useProvider(id, subdomain);
  let updateUserProvider = useCallback((provider) => updateProvider(id, provider, user), [id]);

  if (!id || !user) {
    logger.error(`Can't find user account`);
    return [
      null,
      () => {
        logger.error(`Can't find user account`);
      },
    ];
  }

  if (!id && !user?.ownership?.length) {
    logger.error(
      `Can't attach user account with #id=${user.id} to profile, because #ownership is empty`,
    );
    return [
      null,
      () => {
        logger.error(`Can't update profile, because its not found`);
      },
    ];
  }

  return [provider, updateUserProvider];
}

export function removeProviderFromOrganization(organizationId, providerId) {
  return removeProviderFromOrganizationAPI(organizationId, providerId);
}

export function removePendingProvider(providerId) {
  return removePendingProviderAPI(providerId);
}

export function removeProviderFromGPA(providerId) {
  return removeProviderFromGpaAPI(providerId);
}

export function updateProviderStatus(providerId, status) {
  return updateProviderStatusAPI(providerId, status);
}

export function getUsersEmail(searchString) {
  return getUsersEmailAPI({
    limit: 15,
    sort: {
      first_name: 'ASC',
    },
    filter: {
      OR: [
        { first_name: { contains: searchString } },
        { email: { contains: searchString } },
        { last_name: { contains: searchString } },
      ],
    },
  });
}

export function updateShareAccess(email) {
  return updateShareAccessAPI(email);
}

export function removeShareAccess(id, type, resetEmail) {
  return removeShareAccessAPI(id, type.toUpperCase(), resetEmail);
}

export function removeProviderAccess(providerId) {
  return removeProviderAccessAPI(providerId);
}
