const t = require('transducers.js');
const moment = require('moment');
const Dispatcher = require('marty/dispatcher').getCurrent();

// load in sample data
module.exports = function () {
  let sampleMerchants = [
    'Mario',
    'That old sub shop',
    'Guy on street',
    'Black Hand Coffee',
    'Kroger'
  ];

  for(var i in t.range(100)) {
    let catId;
    if(Math.random() < .1) {
      catId = null;
    }
    else {
      catId = (Math.random() * 3 | 0) + 1;
    }

    Dispatcher.dispatch({
      type: 'ADD_TRANSACTION',
      id: i,
      amount: Math.random() * 100000 | 0,
      name: sampleMerchants[Math.random() * sampleMerchants.length | 0],
      date: moment().add(Math.random() * 365 | 0, 'd'),
      categoryId: catId
    });
  }

  Dispatcher.dispatch({ type: 'ADD_CATEGORY', id: 1, name: 'Food' });
  Dispatcher.dispatch({ type: 'ADD_CATEGORY', id: 2, name: 'Misc' });
  Dispatcher.dispatch({ type: 'ADD_CATEGORY', id: 3, name: 'Coffee' });
}
