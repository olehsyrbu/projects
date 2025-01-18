import { createContext } from 'react';

export const AppletContext = createContext({
  applet: {},
  activities: [],
  activity: null,
  screen: null,
});
