import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { logger } from '@/core/logger';
import {
  getVisibleScreens,
  useAppletContext,
  useResponsesSubmit,
} from '@/modules/mindlogger/hooks';
import { Screen } from '../Screen';

export function Activity({ activity, onSubmit }) {
  const { setScreens, screens, setResponses, responses, setLoading, screenStep } =
    useAppletContext();
  const { items } = activity;
  const submit = useResponsesSubmit(activity);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setScreens(getVisibleScreens(items, []));
  }, [items, setScreens]);

  function toArray(asObject) {
    return items.map((item) => {
      return asObject[item?.variableName];
    });
  }

  function handleResponses(resp, name) {
    let newResponses = {
      ...responses,
      [name]: resp,
    };
    setResponses(newResponses);

    const newScreens = getVisibleScreens(items, toArray(newResponses));
    const nextScreenStep = screenStep + 1;

    if (nextScreenStep <= newScreens.length) {
      setScreens(newScreens);

      const screen = newScreens[screenStep];

      navigate(`screens/${screen.variableName}`, {
        state: {
          ...location.state,
          screenStep: nextScreenStep,
        },
      });
    } else {
      setLoading(true);
      submit(toArray(newResponses))
        .then(() => {
          setLoading(false);
          delete location.state.screenStep;
          setResponses({});
          setScreens([]);
          onSubmit();
        })
        .catch((err) => {
          logger.error(`Can't handle submit of activity with #id: ${activity.id}`, err);
        });
    }
  }

  function handleSave(resp, name) {
    setResponses({
      ...responses,
      [name]: resp,
    });
  }

  if (screens.length === 0) {
    return null;
  }

  if (!location.state?.screenStep) {
    let step = screens[0];

    return (
      <Navigate to={`screens/${step.variableName}`} state={{ ...location.state, screenStep: 1 }} />
    );
  }

  return (
    <Routes>
      {screens.map((screen) => (
        <Route
          key={screen.variableName}
          path={`screens/${screen.variableName}`}
          element={
            <Screen
              screen={screen}
              response={responses[screen.variableName]}
              onResponse={handleResponses}
              onSave={handleSave}
            />
          }
        />
      ))}
    </Routes>
  );
}

Activity.propTypes = {
  activity: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
};
