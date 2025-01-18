export function getStates(profile) {
  let states = new Set();

  if (profile.inPerson?.available) {
    for (let location of profile.locations) {
      states.add(location.address.state.name);
    }
  }

  if (profile.remote?.available) {
    for (let state of profile.remote.states) {
      states.add(state.name);
    }
  }

  for (let license of profile.licenses) {
    if (license.state) {
      states.add(license.state.name);
    }
  }

  return [...states].sort((stateA, stateB) => stateA.localeCompare(stateB));
}
