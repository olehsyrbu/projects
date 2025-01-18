import { defineAbility } from '@casl/ability';

export function toAbility(rules = []) {
  return defineAbility((can) => {
    rules.forEach((rule) => {
      can(rule.action, rule.subject, rule.conditions);
    });
  });
}
