import { providerFixtures } from '@/tools/test-fixtures/providerFixtures';
import { userFixtures } from '@/tools/test-fixtures/userFixtures';
import { organizationFixtures } from '@/tools/test-fixtures/organizationFixtures';

export const teamNotesFixtures = {
  defaultSingleTeamNote() {
    return {
      id: '1db7e230-0e39-4181-927e-bba5d6dfaea4',
      text: 'Some text here',
      createdAt: '2020-11-22T08:29:09.529Z',
      fullName: 'Joe Joe',
      author: userFixtures.defaultJoeUser(),
      provider: providerFixtures.defaultProviderForTeamNotes(),
      organization: organizationFixtures.demoOrganization(),
    };
  },

  defaultProviderForTeamNotes() {
    return [
      {
        id: '1db7e230-0e39-4181-927e-bba5d6dfaea4',
        text: 'Blallalall',
        createdAt: '2021-11-22T08:29:09.529Z',
        fullName: 'Joe Joe',
        author: userFixtures.defaultJoeUser(),
        provider: providerFixtures.defaultProviderForTeamNotes(),
        organization: organizationFixtures.demoOrganization(),
      },
      {
        id: 'd6ac3cdd-11d5-46d0-a4ef-ea7bdaabf497',
        text: 'FooFooFoo',
        createdAt: '2021-10-23T08:30:41.629Z',
        fullName: 'Boo Boo',
        author: userFixtures.defaultJoeUser(),
        provider: providerFixtures.defaultProviderForTeamNotes(),
        organization: organizationFixtures.demoOrganization(),
      },
      {
        id: '54d8e222-114c-471c-bab0-674dcfa64fa2',
        text: 'Zzzzzzzz',
        createdAt: '2021-11-22T08:39:45.834Z',
        fullName: 'Zoo Zoo',
        author: null,
        provider: providerFixtures.defaultProviderForTeamNotes(),
        organization: organizationFixtures.demoOrganization(),
      },
    ];
  },

  teamNoteOnCreate() {
    return {
      id: '79fe7d90-a902-48d2-877d-cd470b021781',
      text: 'Aaaaaa!!!!',
      createdAt: '2021-11-22T09:03:23.039Z',
      fullName: 'Zoo Zoo',
      author: null,
      provider: providerFixtures.defaultProviderForTeamNotes(),
      organization: organizationFixtures.demoOrganization(),
    };
  },

  teamNoteOnDelete() {
    return [];
  },

  teamNoteResponseOnDeleteAll() {
    return {
      id: providerFixtures.defaultProviderForTeamNotes().id,
    };
  },
};
