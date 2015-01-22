const Marty = require('marty');
const { filter, merge } = require('transducers.js');
const Constants = require('../actions/constants');

const TransactionStore = Marty.createStore({
  handlers: {
    addTransaction: Constants.ADD_TRANSACTION,
    updateTransaction: Constants.UPDATE_TRANSACTION
  },

  getInitialState: function() {
    return {
      transactions: [],
      transactionsByDate: {}
    }
  },

  addTransaction: function(trans) {
    this.state.transactions.push(trans);
    this.state.transactions.sort((t1, t2) => {
      let m1 = t1.date.valueOf();
      let m2 = t2.date.valueOf();
      if(m1 < m2) { return 1; }
      else if(m1 > m2) { return -1; }
      return 0;
    });

    let key = this._dateKey(trans.date.month(), trans.date.year());
    if(!this.state.transactionsByDate[key]) {
      this.state.transactionsByDate[key] = [];
    }
    this.state.transactionsByDate[key].push(trans);
    this.hasChanged();
  },

  _dateKey: function(month, year) {
    year = year || moment().year();
    return year.toString() + month;
  },

  updateTransaction: function({ id, fields }) {
    if(fields.amount) {
      throw new Error('cannot update transaction amount');
    }
    let trans = filter(this.state.transactions, t => t.id === id)[0];
    let idx = this.state.transactions.indexOf(trans);
    this.state.transactions[idx] = merge(trans, fields);
    this.hasChanged();
  },

  getTransaction: function(id) {
    let query = filter(this.state.transactions, x => x.id === id);
    return query.length ? query[0] : null;
  },

  getTransactions: function(month, year) {
    if(month && year) {
      return this.state.transactionsByDate[this._dateKey(month, year)] || [];
    }
    return this.state.transactions;
  },

  getUncategorized: function() {
    return filter(this.state.transactions, t => t.categoryId === null);
  }
});

module.exports = TransactionStore;
