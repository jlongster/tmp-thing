const React = require('react');
const t = require('transducers.js');
const { map, filter } = t;
const { Element, Elements } = require('../util');
const Table = Element(require('./table'));

const Dispatcher = require('marty/dispatcher').getCurrent();
const categoryStore = require('../stores/categories');

const dom = React.DOM;
const { div, a } = dom;

const TransactionTable = React.createClass({
  displayName: 'TransactionTable',

  updateField: function(id, field, value) {
    Dispatcher.dispatch({
      type: 'UPDATE_TRANSACTION',
      id: id,
      fields: { [field]: value }
    });

    if(this.props.onUpdate) {
      this.props.onUpdate(id, field, value);
    }
  },

  render: function() {
    let categories = categoryStore.getCategories();
    let transactions = this.props.transactions;

    return Table({
      className: 'transaction-table',
      columns: ['name', 'category', 'date', 'amount'],
      formatters: {
        date: data => data.date.format('MM/DD/YYYY'),
        amount: data => '$' + data.amount / 100,
        category: data => {
          let cat = filter(categories, c => c.id === data.categoryId);
          return cat.length ? cat[0].name : '';
        }
      },
      editors: {
        name: { type: 'text' },
        category: {
          type: 'select',
          field: 'categoryId',
          transform: x => x === 'null' ? null : parseInt(x),
          options: [{ value: 'null', text: '' }].concat(
            map(categories, cat => ({ value: cat.id, text: cat.name }))
          )
        }
      },
      data: transactions,
      uneditable: this.props.uneditable,
      onUpdate: this.updateField
    });
  }
});

module.exports = TransactionTable;
