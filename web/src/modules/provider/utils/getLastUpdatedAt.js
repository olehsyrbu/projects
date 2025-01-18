export function getLastUpdatedAt(updatedAt, availability) {
  return availability?.updated_at > updatedAt ? availability?.updated_at : updatedAt;
}
