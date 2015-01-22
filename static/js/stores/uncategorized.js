const Marty = require('marty');
const transactionStore = require('./transactions');
const t = require('transducers.js');
const { map, filter } = t;
const Constants = require('../actions/constants');

const UncategorizedTransStore = Marty.createStore({
  handlers: {
    add: Constants.ADD_TRANSACTION,
    update: Constants.UPDATE_TRANSACTION
  },

  getInitialState: function() {
    return [];
  },

  add: function(trans) {
    if(!trans.categoryId) {
      this.state.push(trans);
    }
  },

  update: function({ id, fields }) {
    this.waitFor(transactionStore);
    let idx = map(this.state, x => x.id).indexOf(id);

    if(fields.categoryId === null && idx === -1) {
      // If the category has been removed and we don't already have it,
      // add it
      this.state.push(transactionStore.getTransaction(id));
      this.hasChanged();
    }
    else if(typeof fields.categoryId === 'number' && idx !== -1) {
      // If the category has been added and we do have it, remove it
      this.state = filter(this.state, x => x.id !== id);
      this.hasChanged();
    }
  },

  getTransactions: function() {
    return this.state;
  }
});

module.exports = UncategorizedTransStore;
