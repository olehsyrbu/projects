import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import reducer from './reducers'
import routes from './routes';


const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk)
);

render(
  <Provider store={store} >
    <Router  history={browserHistory} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
