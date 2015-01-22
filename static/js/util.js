const React = require('react');

// React utils

function blockFor(name, children) {
  var block;
  React.Children.forEach(children, child => {
    if(child &&
       child.props &&
       child.props.name === name)
      block = child.props.children;
  });
  return block;
}

function Element(el) {
  return React.createFactory(el);
}

function Elements(obj) {
  var res = {};
  for (var k in obj) {
    var el = obj[k];
    if (typeof el === "function" && el.isReactLegacyFactory) {
      res[k] = React.createFactory(obj[k]);
    }
  }
  return res;
}

module.exports = { blockFor, Element, Elements };
