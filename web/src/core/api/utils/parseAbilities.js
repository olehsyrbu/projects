export function parseAbilities(abilities = []) {
  return abilities.map((ability) => {
    if (ability.conditions) {
      let array = ability.conditions.map((condition) => JSON.parse(condition));
      ability.conditions = Object.assign({}, ...array);
    }

    return {
      ...ability,
    };
  });
}
