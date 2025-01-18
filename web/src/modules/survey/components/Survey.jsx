import { Children, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { omit, uniqueId } from 'lodash-es';
import { noop } from '@/core/utils';
import { SurveyContext } from '../SurveyContext';
import { SurveyStep } from './SurveyStep';
import { useSurvey } from '@/modules/survey/hooks';

export function Survey({ children, initialStep, onLeave }) {
  let navigate = useNavigate();
  let location = useLocation();
  let parent = useSurvey();
  let name = useMemo(() => uniqueId('survey_'), []);

  let step = location.state?.step[name] ?? initialStep;

  children = Children.toArray(children).filter((child) => child?.type === SurveyStep);

  const totalSteps = children.length;

  function getStepPath(stepNumber) {
    return `step-${stepNumber}`;
  }

  function navigateTo(stepToNavigate) {
    let nextStep = Math.max(1, Math.min(stepToNavigate, totalSteps));
    let hasCustomLeaveHandler = onLeave && onLeave !== noop;

    if (stepToNavigate === 0) {
      omit(location.state.step, [name]);

      if (hasCustomLeaveHandler) {
        onLeave(1);
      } else if (parent) {
        parent.navigatePrev();
      }

      return;
    }

    if (nextStep !== step) {
      navigate(getStepPath(nextStep), {
        state: {
          step: { ...location.state?.step, [name]: nextStep },
        },
      });
    } else {
      if (hasCustomLeaveHandler) {
        onLeave(totalSteps);
      } else if (parent) {
        parent.navigateNext();
      }
    }
  }

  let navigateDelta = (delta = 1) => navigateTo(step + delta);
  let navigateNext = () => navigateTo(step + 1);
  let navigatePrev = () => navigateTo(step - 1);

  if (!location.state?.step[name]) {
    return (
      <Navigate
        to={getStepPath(step)}
        state={{ step: { ...location.state?.step, [name]: step } }}
        replace
      />
    );
  }

  let value = { step, totalSteps, navigate: navigateDelta, navigateNext, navigatePrev };

  return (
    <SurveyContext.Provider value={value}>
      <Routes>
        {Children.map(children, (child, index) => (
          <Route path={`${getStepPath(index + 1)}/*`} element={child} />
        ))}
      </Routes>
    </SurveyContext.Provider>
  );
}

Survey.propTypes = {
  children: PropTypes.node.isRequired,
  initialStep: PropTypes.number,
  onLeave: PropTypes.func,
};

Survey.defaultProps = {
  initialStep: 1,
  onLeave: noop,
};
