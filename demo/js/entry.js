const React = require('react');
const LC = require('literallycanvas');

const {tools} = require('../../src');

tools.addToDefaultTools(LC);

LC.init(
  document.getElementById('lc-container'),
  {imageURLPrefix: "/demo/img"});

console.log(LC.defaultTools);

var DemoApp = React.createClass({
  render() {
    return <div>
      <h1>Literally Canvas Pro Tools</h1>
    </div>;
  }
});

React.render(<DemoApp />, document.getElementById('before-lc'));