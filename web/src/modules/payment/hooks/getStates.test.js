import { getStates } from './getStates';

function getProfile() {
  return {
    inPerson: { available: true },
    locations: [
      { address: { state: { name: 'Kentucky' } } },
      { address: { state: { name: 'Minnesota' } } },
    ],
    remote: {
      available: true,
      states: [{ name: 'Minnesota' }, { name: 'Utah' }],
    },
    licenses: [{ state: { name: 'Wyoming' } }, { state: { name: 'Arkansas' } }],
  };
}

it('collects states from locations, remote record and licenses', () => {
  let profile = getProfile();
  expect(getStates(profile)).toEqual(['Arkansas', 'Kentucky', 'Minnesota', 'Utah', 'Wyoming']);
});

it('does not collect states from locations when not available in person', () => {
  let profile = getProfile();

  profile.inPerson.available = false;
  expect(getStates(profile)).toEqual(['Arkansas', 'Minnesota', 'Utah', 'Wyoming']);

  profile.inPerson = null;
  expect(getStates(profile)).toEqual(['Arkansas', 'Minnesota', 'Utah', 'Wyoming']);
});

it('does not collect remote states when not available for remote', () => {
  let profile = getProfile();

  profile.remote.available = false;
  expect(getStates(profile)).toEqual(['Arkansas', 'Kentucky', 'Minnesota', 'Wyoming']);

  profile.remote = null;
  expect(getStates(profile)).toEqual(['Arkansas', 'Kentucky', 'Minnesota', 'Wyoming']);
});

it('does not collect licenses states when state is not set', () => {
  let profile = getProfile();

  profile.licenses[0].state = null;
  profile.licenses[1].state = null;
  expect(getStates(profile)).toEqual(['Kentucky', 'Minnesota', 'Utah']);
});
