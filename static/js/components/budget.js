const React = require('react');
const t = require('transducers.js');
const { map, filter } = t;
const moment = require('moment');
const { Element, Elements } = require('../util');
const Table = Element(require('./table'));

const transactionStore = require('../stores/transactions');
const totalStore = require('../stores/totals');
const categoryStore = require('../stores/categories');

const dom = React.DOM;
const { div, a } = dom;

const Budget = React.createClass({
  displayName: 'budget',

  getInitialState: function() {
    return { selectedYear: 2015 };
  },

  render: function() {
    let categories = categoryStore.getCategories();
    let months = t.range(12);

    let data = map(categories, cat => {
      return t.toObj(
        [['category', cat.name]].concat(map(months, m => {
          return [moment().month(m).format('MMM'),
                  totalStore.getTotalForMonth(m, this.state.selectedYear, cat.id) / 100 ];
        }))
      );
    });

    return dom.div(
      { className: 'budget' },
      dom.h1({ className: 'year-label' }, this.state.selectedYear),

      dom.div(
        { className: 'scrollable-table' },
        Table({
          columns: ['category'].concat(map(months, m => moment().month(m).format('MMM'))),
          data: data
        })
      )
    );
  }
});

module.exports = Budget;
