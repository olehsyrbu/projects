import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { logger } from '@/core/logger';
import { AppletContext } from './AppletContext';
import { useApplet } from '../hooks';

export function AppletProvider({ publicId, children }) {
  const applet = useApplet(publicId);
  const activities = useActivities(applet);

  const [screens, setScreens] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  let activityStep = location.state?.activityStep;
  let screenStep = location.state?.screenStep;

  let activity = useMemo(() => {
    return activityStep ? activities[activityStep - 1] : null;
  }, [activityStep, activities]);

  let value = {
    applet,
    activities,
    activity,
    activityStep,
    screens,
    responses,
    setScreens,
    setResponses,
    loading,
    setLoading,
    screenStep,
  };

  return <AppletContext.Provider value={value}>{children}</AppletContext.Provider>;
}

AppletProvider.propTypes = {
  publicId: PropTypes.string.isRequired,
  children: PropTypes.node,
};

function useActivities(applet) {
  return useMemo(() => {
    let results = applet.activities.map((activity) => ({
      ...activity,
      id: activity.id.split('/').pop(),
    }));

    let sorted = applet.order
      .map((id) => {
        return results.find((activity) => {
          return activity.id === id;
        });
      })
      .filter(Boolean);

    if (sorted.length !== results.length) {
      logger.warn('Activities order out of sync, re-shuffle over admin panel to update order');
      return results;
    }

    return sorted;
  }, [applet.order, applet.activities]);
}
