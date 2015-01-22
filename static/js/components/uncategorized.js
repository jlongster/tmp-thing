const React = require('react');
const t = require('transducers.js');
const { map, filter } = t;
const { Element, Elements } = require('../util');
const TransactionTable = Element(require('./transaction-table'));
const uncategorizedTransStore = require('../stores/uncategorized');
const categoryStore = require('../stores/categories');

const dom = React.DOM;
const { div, a } = dom;

const Uncategorized = React.createClass({
  displayName: 'Uncategorized',

  componentDidMount: function() {
    this.tsListener = uncategorizedTransStore.addChangeListener(() => {
      this.forceUpdate();
    });
  },

  componentWillUnmount: function() {
    this.tsListener.dispose();
  },

  render: function() {
    let transactions = uncategorizedTransStore.getTransactions();

    return dom.div(
      null,
      TransactionTable({ transactions: transactions })
    );
  }
});

module.exports = Uncategorized;
