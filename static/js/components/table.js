const React = require('react');
const t = require('transducers.js');
const { map, filter } = t;

const dom = React.DOM;
const { div, a } = dom;

function identity(x) {
  return x;
}

module.exports = React.createClass({
  displayName: 'Table',

  getInitialState: function() {
    return { currentEditId: null };
  },

  edit: function(idx, e) {
    e.stopPropagation();
    this.setState({ currentEditId: idx });
  },

  updateRow: function(id, field, transform, e) {
    let value = transform(e.target.value);
    if(this.props.onUpdate) {
      this.props.onUpdate(id, field, value);
    }
  },

  render: function() {
    let editId = this.props.uneditable ? null : this.state.currentEditId;

    let cols = map(this.props.columns, col => {
      return dom.th({ key: col }, col);
    });

    let body = map(this.props.data, (row, rowIdx) => {
      let rowId = ('id' in row) ? row.id : rowIdx;

      return dom.tr(
        { key: rowId,
          className: editId === rowId ? 'editing' : '',
          onClick: this.edit.bind(null, rowId) },
        map(this.props.columns, (col, colIdx) => {
          let formatter = this.props.formatters && this.props.formatters[col];
          let content;

          if(editId === rowId && this.props.editors[col]) {
            let editor = this.props.editors[col];
            let field = editor.field || col;
            let transform = editor.transform || identity;

            switch(editor.type) {
            case 'text':
              content = dom.input({
                value: row[field],
                onChange: this.updateRow.bind(null, row.id, field, transform)
              });
              break;
            case 'select':
              content = dom.select(
                { value: row[field],
                  onChange: this.updateRow.bind(null, row.id, field, transform) },
                map(editor.options, opt => {
                  return dom.option({ value: opt.value }, opt.text);
                })
              );
              break;
            }
          }
          else if(formatter) {
            content = formatter(row);
          }
          else {
            content = row[col];
          }

          return dom.td({ key: rowIdx + '-' + colIdx }, content);
        })
      );
    });

    return dom.table(
      { className: this.props.className },
      dom.thead(null, dom.tr(null, cols)),
      dom.tbody(null, body)
    );
  }
});
