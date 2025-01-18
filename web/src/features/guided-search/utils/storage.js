let key = 'guided-search';

export let storage = {
  read() {
    let stored = window.localStorage.getItem(key);

    try {
      return JSON.parse(stored);
    } catch (error) {
      return null;
    }
  },
  write(data) {
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {}
  },
  clear() {
    window.localStorage.removeItem(key);
  },
};
