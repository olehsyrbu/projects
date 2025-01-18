import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import mixpanel from '@/core/mixpanel';

export function Trackers() {
  let location = useLocation();

  useEffect(() => {
    mixpanel.track('Landing Page Visit');
  }, []);

  useEffect(() => {
    let params = new URLSearchParams(location.search);
    let invite = params.get('invite');
    let type = params.get('type');

    if (invite) {
      mixpanel.people.set({
        invite_code: invite,
        invite_type: type || 'default',
      });
    }
  }, []);
  return null;
}
