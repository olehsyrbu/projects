import useSWR from 'swr';
import { gql } from 'graphql-request';
import client from '@/core/api/graphQLClient';

export function usePrograms() {
  return useSWR(ProgramsQuery, fetchPrograms, { suspense: true, revalidateOnMount: true });
}

async function fetchPrograms() {
  let response = await client.request(ProgramsQuery, { filter: { modes: ['PROGRAM'] } });
  let { me, draft } = response;
  return me.providers.filter((p) => p.id !== draft?.program?.id);
}

let ProgramsQuery = gql`
  query Programs($filter: UsersProvidersRelationFilterInput) {
    me {
      providers(filter: $filter) {
        ... on Provider {
          id
          slug
          active
          status
          updatedAt: updated_at
          programName: program_name
          programType: program_type {
            name
          }
          photoUrl: photo_url
          mobile
          email
          availability {
            status
            updated_at
          }
          inPerson: in_person {
            available
          }
          remote {
            available
            voice
            video
            chat
          }
          locations {
            address {
              address1
              city
              state {
                code
              }
              zip
            }
          }
        }
      }
    }

    draft: getMyProgramDraft {
      program: draft_provider {
        id
      }
    }
  }
`;
