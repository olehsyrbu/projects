import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import mixpanel from '@/core/mixpanel';
import { useAppletContext } from '@/modules/mindlogger/hooks';
import { Activity } from './Activity';

export function Activities({ onComplete }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { activities, applet, activity } = useAppletContext();

  let activityStep = location.state?.activityStep;

  function handleSubmit() {
    let analytics = {
      publicId: applet.publicId,
      activityId: activity.id,
    };
    if (activityStep < activities.length) {
      const activity = activities[activityStep];

      navigate(activity.id, {
        replace: true,
        state: {
          ...location.state,
          activityStep: activityStep + 1,
        },
      });

      mixpanel.track('Study Activity Submit', {
        ...analytics,
        activityStep,
      });
    } else {
      delete location.state?.activityStep;

      onComplete();
      mixpanel.track('Study Activities Completed', analytics);
    }
  }

  if (!location.state?.activityStep) {
    const firstActivity = activities[0];

    return (
      <Navigate to={firstActivity.id} state={{ ...location.state, activityStep: 1 }} replace />
    );
  }

  return (
    <Routes>
      {activities.map((activity) => (
        <Route
          key={activity.id}
          path={activity.id + '/*'}
          element={<Activity activity={activity} onSubmit={handleSubmit} />}
        />
      ))}
    </Routes>
  );
}

Activities.propTypes = {
  onComplete: PropTypes.func,
};
