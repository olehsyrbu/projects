import { useState, useLayoutEffect } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import PropTypes from 'prop-types';

export let history = createBrowserHistory();

// https://github.com/remix-run/react-router/blob/main/packages/react-router-dom/index.tsx#L277
export function BrowserRouter({ children }) {
  let [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), []);

  return (
    <Router
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
}

BrowserRouter.propTypes = {
  children: PropTypes.node,
};
