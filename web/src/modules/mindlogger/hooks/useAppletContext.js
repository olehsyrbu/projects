import { useContext } from 'react';
import { AppletContext } from '../components/AppletContext';

export function useAppletContext() {
  return useContext(AppletContext);
}
