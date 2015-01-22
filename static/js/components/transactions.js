const React = require('react');
const t = require('transducers.js');
const { map, filter } = t;
const moment = require('moment');
const { Element, Elements } = require('../util');
const { DropDownMenu, FlatButton, RaisedButton } = Elements(require('material-ui'));
const TransactionTable = Element(require('./transaction-table'));

const transactionStore = require('../stores/transactions');
const totalStore = require('../stores/totals');

const dom = React.DOM;
const { div, a } = dom;

const Transactions = React.createClass({
  displayName: 'Transactions',

  getInitialState: function() {
    return { uneditTable: false,
             selectedMonth: moment().month(),
             selectedYear: moment().year() }
  },

  componentDidMount: function() {
    this.tsListener = transactionStore.addChangeListener(() => {
      this.forceUpdate();
    });

    // Hackity hack
    this.clickEditable = e => {
      let node = e.target;
      let stop = false;
      do {
        if(node.tagName === 'TABLE') {
          stop = true;
          break;
        }
      } while((node = node.parentNode));
      this.setState({ uneditTable: !stop });
    };

    document.addEventListener('click', this.clickEditable);
  },

  componentWillUnmount: function() {
    this.tsListener.dispose();
    document.removeEventListener('click', this.clickEditable);
  },

  selectMonth: function(i) {
    this.setState({ selectedMonth: i });
  },

  selectYear: function(i) {
    let month = i < this.state.selectedYear ? 11 : 0;
    this.setState({ selectedYear: i,
                    selectedMonth: month });
  },

  render: function() {
    let currentMonth = moment().month();
    let selectedYear = this.state.selectedYear;
    let selectedMonth = this.state.selectedMonth;
    let transactions = transactionStore.getTransactions(
      selectedMonth,
      selectedYear
    );

    return div(
      { className: 'transactions' },

      dom.h1({ className: 'year-label' }, this.state.selectedYear),
      dom.div(
        { className: 'month-buttons' },
        FlatButton({ label: '<',
                     className: 'nav',
                     onClick: this.selectYear.bind(null, selectedYear - 1) }),
        map(t.range(12), i => {
          return (i === selectedMonth ? RaisedButton : FlatButton)({
            key: i,
            label: moment().month(i).format('MMM'),
            primary: i === selectedMonth,
            secondary: i === currentMonth,
            onClick: this.selectMonth.bind(null, i)
          });
        }),
        FlatButton({ label: '>',
                     className: 'nav',
                     onClick: this.selectYear.bind(null, selectedYear + 1) })
      ),

      TransactionTable({ transactions: transactions,
                         uneditable: this.state.uneditTable }),

      dom.div({ className: 'total' },
              'Total: $' + (totalStore.getTotalForMonth(selectedMonth, selectedYear) / 100))
    );
  }
});

module.exports = Transactions;
