import useSWR, { mutate } from 'swr';
import {
  createOrUpdateProgramDraft,
  deleteProgramDraft,
  finishProgramDraft,
  getProgramDraft,
  saveProgramDraftTypes,
  addRemoteProgramDraftTypes,
} from './ProgramDraftAPI';
import { updateProgram } from '@/core/api/ProgramAPI';
import { updateLocationPhotos } from '@/core/api/PhotoAPI';

export function useCreateOrUpdateProgramDraft() {
  return async (options) => {
    let created = await createOrUpdateProgramDraft(options);
    return mutate('program-draft', created, false);
  };
}

export function useProgramDraft(shouldFetch = true) {
  let { data } = useSWR(shouldFetch ? 'program-draft' : null, getProgramDraft, { suspense: true });
  return data;
}

export function useFinishProgramDraft() {
  return async () => {
    await finishProgramDraft();
    return mutate('program-draft', null, false);
  };
}

export function useDeleteProgramDraft() {
  return async () => {
    await deleteProgramDraft();
    return mutate('program-draft', null, false);
  };
}

export function useUpdateProgramDraft() {
  return async (patch) => {
    return mutate(
      'program-draft',
      async (draft) => {
        if (!draft.program) {
          throw new Error("Can't find program in draft");
        }

        let program = await updateProgram(draft.program.id, patch.program);

        return {
          ...draft,
          program,
        };
      },
      false,
    );
  };
}

export function useSaveProgramDraftTypes() {
  return async (typesByLocation) => {
    const draft = await saveProgramDraftTypes(typesByLocation);

    return mutate('program-draft', draft, false);
  };
}

export function useUpdateProgramDraftLocationPhotos() {
  return async (nextLocations) => {
    return mutate(
      'program-draft',
      async (draft) => {
        if (!draft.program) {
          throw new Error("Can't find program in draft");
        }
        const previousLocations = draft.program.locations;

        let result = await Promise.all(
          previousLocations.map((previousLocation) => {
            const nextLocation = nextLocations.find(({ id }) => id === previousLocation.id);

            if (!nextLocation) {
              return Promise.resolve(previousLocation);
            }

            let nextPhotos = nextLocation.photos || [];

            return updateLocationPhotos({
              location: previousLocation,
              photos: nextPhotos,
            });
          }),
        );

        return {
          ...draft,
          program: {
            ...draft.program,
            locations: result,
          },
        };
      },
      true,
    );
  };
}

export function useAddRemoteProgramDraftTypes() {
  return async (typesByRemote) => {
    const draft = await addRemoteProgramDraftTypes(typesByRemote);

    return mutate('program-draft', draft, false);
  };
}
