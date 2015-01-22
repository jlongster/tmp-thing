const React = require('react');
const t = require('transducers.js');
const { map, filter } = t;
const { Element, Elements } = require('../util');
const mui = require('material-ui');
const { MenuItem } = mui;
const { LeftNav, FlatButton, RaisedButton } = Elements(mui);
const Router = require('react-router');
const { RouteHandler } = Elements(Router);
const transactionStore = require('../stores/transactions');

const dom = React.DOM;
const { div, a } = dom;

const App = React.createClass({
  displayName: 'App',
  mixins: [Router.Navigation],

  componentDidMount: function() {
    this.tsListener = transactionStore.addChangeListener(() => {
      this.forceUpdate();
    });
  },

  componentWillUnmount: function() {
    this.tsListener.dispose();
  },

  updateRoute: function(e, i, item) {
    this.transitionTo(item.route);
  },

  render: function() {
    let uncategorized = transactionStore.getUncategorized();
    let currentRoute = this.props.currentRoute;
    let menuItems = [
      { route: 'transactions', text: 'Transactions' },
      { route: 'budget', text: 'Budget' },
      { route: 'uncategorized',
        text: uncategorized.length + ' Uncategorized Transactions' }
    ];

    return dom.div(
      null,
      LeftNav({
        onChange: this.updateRoute,
        menuItems: menuItems,
        selectedIndex: map(menuItems, x => x.route).indexOf(currentRoute.name)
      }),
      dom.main(null, RouteHandler())
    );
  }
});

module.exports = App;
