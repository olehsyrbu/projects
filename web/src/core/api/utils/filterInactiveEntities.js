function shouldRemove(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  if (obj.active === false) return true;
  return Object.values(obj).some(shouldRemove);
}

export function filterInactiveEntities(profile) {
  for (let [key, value] of Object.entries(profile)) {
    if (Array.isArray(value)) {
      profile[key] = value.filter((item) => !shouldRemove(item));
    }
  }

  return profile;
}
