import useSWR, { mutate } from 'swr';
import { omit } from 'lodash-es';
import mixpanel from '@/core/mixpanel';
import config from '@/core/config';
import { updateLocationPhotos } from './PhotoAPI';
import {
  attachProviderPhotoUrl,
  removeProviderSchedulePdf as removeProviderSchedulePdfAPI,
  uploadProviderSchedulePdf as uploadProviderSchedulePdfAPI,
} from './ProviderAPI';
import {
  cloneProgram,
  createProgram,
  deleteProgram,
  getProgram,
  getProgramBySlug,
  updateProgram,
} from './ProgramAPI';

export function useCreateProgram() {
  return async (params) => {
    let payload = {
      ...params,
    };
    let photoUrl = payload.photoUrl;

    if (photoUrl) {
      payload = omit(payload, 'photoUrl');
    }

    let program = await createProgram(payload);

    if (photoUrl) {
      program.photoUrl = await attachProviderPhotoUrl(program.id, photoUrl);
    }

    return mutate(['program', program.id], program, false);
  };
}

export function useProgram(id) {
  let { data } = useSWR(id ? ['program', id] : null, () => getProgram(id), {
    suspense: true,
  });
  return data;
}

export function useProgramBySlug(slug, subdomain) {
  let { data: program } = useSWR(
    slug ? ['program', slug, subdomain] : null,
    () => getProgramBySlug(slug, subdomain),
    { suspense: true },
  );

  if (config.organizationInsuranceTypes && subdomain) {
    const subDomainCodes = config.organizationInsuranceTypes[subdomain];
    if (subDomainCodes) {
      program.insuranceTypes.sort((type1, type2) => {
        if (subDomainCodes.includes(type1.code)) return -1;
        if (subDomainCodes.includes(type2.code)) return 1;
        return 0;
      });
    }
  }
  return program;
}

async function updateUserProgram(program) {
  return mutate(
    'user',
    async (user) => {
      const programIndex = user.ownership.findIndex(({ id }) => id === program.id);
      user.ownership[programIndex] = { ...user.ownership[programIndex], ...program };
      return user;
    },
    false,
  );
}

export function useUpdateProgram() {
  return async (id, patch) => {
    let payload = {
      ...patch,
    };

    if (payload.photoUrl) {
      await attachProviderPhotoUrl(id, payload.photoUrl);
      payload = omit(payload, 'photoUrl');
    }
    let updatedProgram = await updateProgram(id, payload);
    mixpanel.track('Update Provider', {
      availability: updatedProgram.availability,
      mode: updatedProgram.mode,
      slug: updatedProgram.slug,
      status: updatedProgram.status,
    });
    await updateUserProgram(updatedProgram);
    return mutate(['program', id], updatedProgram, false);
  };
}

export function useDeleteMyPrograms() {
  return async (programId) => {
    return mutate(
      'user',
      async (user) => {
        await deleteProgram(programId);
        return {
          ...user,
          ownership: user.ownership.filter((o) => o.id !== programId),
        };
      },
      false,
    );
  };
}

export function useUpdateProgramLocationPhotos() {
  return async ({ program, locationId, photos }) => {
    const location = program.locations.find(({ id }) => id === locationId);

    if (!location) {
      return;
    }

    const newLocation = await updateLocationPhotos({ location, photos });

    return mutate(
      ['program', program.id],
      {
        ...program,
        locations: [newLocation],
      },
      true,
    );
  };
}

export function useUploadProgramSchedulePdf() {
  return async ({ schedulePdf, program }) => {
    const { schedulePdfUrl } = await uploadProviderSchedulePdfAPI(schedulePdf, program.id);

    return mutate(
      ['program', program.id],
      {
        ...program,
        schedulePdfUrl,
      },
      false,
    );
  };
}

export function useRemoveProgramSchedulePdf() {
  return async ({ program }) => {
    await removeProviderSchedulePdfAPI(program.id);
    return mutate(
      ['program', program.id],
      {
        ...program,
        schedulePdfUrl: null,
      },
      false,
    );
  };
}

export function useCloneProgram() {
  return async (id) => cloneProgram(id);
}
