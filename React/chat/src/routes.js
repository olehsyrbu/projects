import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import ChatPage from './components/chat/ChatPage';

export default (
    <Route path='/' component={App}>
        <IndexRoute component={ChatPage} />
    </Route>
);
