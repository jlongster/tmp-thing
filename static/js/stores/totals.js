const Marty = require('marty');
const TransactionStore = require('./transactions');
const { filter, merge } = require('transducers.js');
const Constants = require('../actions/constants');

const TotalStore = Marty.createStore({
  handlers: {
    updateTotals: Constants.ADD_TRANSACTION
  },

  getInitialState: function() {
    return {
      totals: {},
      totalsByCategory: {}
    }
  },

  updateTotals: function(trans) {
    this.waitFor(TransactionStore);

    let key = trans.date.year() + '-' + trans.date.month();
    let totals = this.state.totals;
    let totalsByCategory = this.state.totalsByCategory;

    if(!totals[key]) {
      totals[key] = 0;
    }
    totals[key] += trans.amount;

    if(!totalsByCategory[key]) {
      totalsByCategory[key] = [];
    }
    if(!totalsByCategory[key][trans.categoryId]) {
      totalsByCategory[key][trans.categoryId] = 0;
    }
    totalsByCategory[key][trans.categoryId] += trans.amount;
    this.hasChanged();
  },

  getTotalForMonth: function(month, year, categoryId) {
    let key = year + '-' + month;
    if(categoryId) {
      return (this.state.totalsByCategory[key] &&
              this.state.totalsByCategory[key][categoryId]) || 0;
    }
    return this.state.totals[key] || 0;
  }
});

module.exports = TotalStore;
