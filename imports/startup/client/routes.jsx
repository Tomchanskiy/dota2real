import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from '../../ui/components/App.jsx';
import Home from '../../ui/components/Home.jsx';
import { HowToPlay } from '../../ui/components/HowToPlay.jsx';
import { About } from '../../ui/components/About.jsx';
import Settings from '../../ui/components/Settings.jsx';
import { NotFound } from '../../ui/components/NotFound.jsx';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="how-to-play" component={HowToPlay} />
      <Route path="about" component={About} />
      <Route path="settings" component={Settings} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);