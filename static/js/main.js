const Marty = require('marty');
const React = require('react');
const t = require('transducers.js');
const { Element, Elements } = require('./util');
const Router = require('react-router');
const { Route, DefaultRoute, NotFoundRoute } = Elements(Router);
const loadData = require('./load-data');

const App = require('./components/app');
const Transactions = require('./components/transactions');
const Budget = require('./components/budget');
const Uncategorized = require('./components/uncategorized');
const Constants = require('./actions/constants');

require('../css/components.css');
require('../css/main.less');

// Routes & bootstrap

loadData();

const routes = Route(
  { handler: App },
  Route({ name: 'transactions', path: '/', handler: Transactions }),
  Route({ name: 'budget', handler: Budget }),
  Route({ name: 'uncategorized', handler: Uncategorized })
)

Router.run(routes, Router.HistoryLocation, (Handler, state) => {
  let route = state.routes[state.routes.length - 1];
  React.render(React.createElement(Handler, { currentRoute: route }),
               document.getElementById('mount'));
});

