import client from './graphQLClient';
import {
  DiscardProgramDraft,
  FinishProgramDraft,
  GetMyProgramDraft,
  SaveProgramDraftTypes,
  AddRemoteProgramTypes,
  StartProgramsOnboarding,
} from './graphql/ProgramDraft';
import { programDraftAdapter, typesByLocationAdapter, typesOnRemoteAdapter } from './adapters';

export async function createOrUpdateProgramDraft(payload) {
  const response = await client.request(StartProgramsOnboarding, {
    draft: {
      ...programDraftAdapter.toCreateInput(payload),
    },
  });

  return response.startProgramOnboarding;
}

export async function getProgramDraft() {
  const response = await client.request(GetMyProgramDraft);

  return response.getMyProgramDraft;
}

export async function deleteProgramDraft() {
  const response = await client.request(DiscardProgramDraft);

  return response.discardProgramOnboarding;
}

export async function finishProgramDraft() {
  const response = await client.request(FinishProgramDraft);

  return response.finishProgramOnboarding;
}

export async function saveProgramDraftTypes(types) {
  let input = typesByLocationAdapter.toUpdateInput(types);
  const response = await client.request(SaveProgramDraftTypes, {
    typesByLocation: input,
  });

  return response.saveProgramLocationTypes;
}

export async function addRemoteProgramDraftTypes(types) {
  let input = typesOnRemoteAdapter.toUpdateInput(types);
  const response = await client.request(AddRemoteProgramTypes, {
    programDraft: { program_types: input },
  });

  return response.updateProgramDraft;
}
