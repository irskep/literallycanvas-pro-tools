const React = require('react');
const LC = require('literallycanvas');

const {tools} = require('../../lib/js/lc-pro-tools');

tools.addToDefaultTools(LC);

var BeforeLC = React.createClass({
  render() {
    return <div>
      <h1>Literally Canvas Pro Tools</h1>
      <p>
        The “pro tools” add new features to Literally Canvas on top of what
        it does by default. All tools and shapes are guaranteed to be
        compatible with a release of the main library at most 30 days old.
        All new shapes work with both the canvas and SVG if possible.
      </p>
      <p>
        <b>The top-level API is not guaranteed to be stable.</b> But it is
        simple.
      </p>
      <h2>Using as a standalone file</h2>
      <p>
        Simply include <tt>lib/js/lc-pro-tools-standalone.js</tt> on your web
        page. Then call <tt>LCProTools.tools.addToDefaultTools(LC)</tt> or
        add <tt>[LCProTools.tools.Spraypaint</tt>, <tt>LCProTools.tools.PaintBucket]</tt> to
        the list of tools you pass to <tt>LC.init()</tt>.
      </p>
      <h2>Using with CommonJS</h2>
      <p>
        You can require <tt>lib/js/lc-pro-tools.js</tt>.
      </p>
      <h2>Adding the images</h2>
      <p>
        You’ll need to copy everything in <tt>lib/img</tt> to the same place
        as Literally Canvas’s stock images. (The same folder as,
        for example, <tt>pencil.png</tt>.)
      </p>
    </div>;
  }
});

var AfterLC = React.createClass({
  render() {
    return <div>
      <div>(If you don’t see images, try <tt>make copyimages</tt>.)</div>
      <h1>Tools</h1>
      {tools.allTools.map(function(T) {
        return new T().renderHelp();
      })}

      <h1>Additional API</h1>
      <p>
        <tt>LCProTools.tools.addToDefaultTools(LCNamespace)</tt>: Add the extra tools
        to the list of default tools so you don’t need to do anything special
        in <tt>LC.init()</tt>.
      </p>
    </div>;
  }
});

React.render(<BeforeLC />, document.getElementById('before-lc'));
React.render(<AfterLC />, document.getElementById('after-lc'));

LC.init(
  document.getElementById('lc-container'),
  {imageURLPrefix: "demo/img"});
