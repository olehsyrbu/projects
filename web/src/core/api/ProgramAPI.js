import client from './graphQLClient';
import gqlClient from './graphQLClient';
import {
  CloneProgram,
  CreateProgram,
  DeleteProgram,
  GetProgram,
  ProgramQueryBySlug,
  UpdateProgram,
} from './graphql';
import { programAdapter } from './adapters';

export async function createProgram(program) {
  const input = programAdapter.toCreateInput(program);

  const response = await client.request(CreateProgram, {
    program: {
      ...input,
    },
  });
  return response.createProgram;
}

export async function getProgram(id, subdomain = '') {
  const response = await client.request(GetProgram, {
    id,
    subdomain,
  });

  return response.providerById;
}

export async function getProgramBySlug(slug, subdomain) {
  let response = await gqlClient.request(ProgramQueryBySlug, { slug, subdomain });
  return response.providerBySlug;
}

export async function updateProgram(id, patch) {
  const response = await client.request(UpdateProgram, {
    id,
    patch: programAdapter.toUpdateInput(patch),
  });

  return response.updateProgram;
}

export async function cloneProgram(providerId) {
  const response = await client.request(CloneProgram, {
    providerId,
  });
  return response.cloneProvider;
}

export async function deleteProgram(id) {
  const response = await client.request(DeleteProgram, {
    id,
  });

  return response.deleteProgram;
}
