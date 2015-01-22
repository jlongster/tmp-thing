const Marty = require('marty');
const { filter, merge } = require('transducers.js');
const Constants = require('../actions/constants');

const CategoryStore = Marty.createStore({
  name: 'Categories',
  handlers: {
    addCategory: Constants.ADD_CATEGORY
  },

  getInitialState: function() {
    return [];
  },

  addCategory: function(cat) {
    this.state.push(cat);
    this.hasChanged();
  },

  getCategories: function() {
    return this.state;
  }
});

module.exports = CategoryStore;
