let days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export function getDays(schedule) {
  let set = new Set(schedule.map((entry) => entry.day));
  return days.filter((day) => set.has(day));
}
