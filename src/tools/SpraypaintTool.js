require('../shapes/PointCollection');

function getPoint(x, y, radius) {
  let x2 = Math.floor(x + radius + 1);
  let y2 = Math.floor(y + radius + 1);
  while(Math.sqrt((x2-x)*(x2-x) + (y2-y)*(y2-y)) > radius) {
    x2 = Math.floor(x - radius + Math.random() * radius * 2);
    y2 = Math.floor(y - radius + Math.random() * radius * 2);
  }
  return [x2, y2];
};


LC.defineOptionsStyle('spraypaint-options', React.createClass({
  displayName: 'SpraypaintOptions',
  getInitialState() { return this._getState() },
  _getState() {
    return {
      rate: this.props.lc.tool.pointsPerSecond,
      radius: this.props.lc.tool.radius
    };
  },

  updateRate(e) {
    this.props.lc.tool.pointsPerSecond = parseInt(e.target.value, 10);
    this.setState(this._getState());
  },

  updateRadius(e) {
    this.props.lc.tool.radius = parseInt(e.target.value, 10);
    this.setState(this._getState());
  },

  render() {
    const floatLeft = {
      display: 'block',
      float: 'left'
    };
    const containerStyle = {
      position: 'relative',
      float: 'left',
      width: 80,
      height: 30
    };
    const inputStyle = {
      width: 80,
      height: 14,
      margin: 0,
      padding: 0
    };
    const valueStyle = {
      textAlign: 'center',
      position: 'absolute',
      top: 15,
      right: 0, bottom: 0, left: 0,
      fontSize: 10
    };

    return <div>
      <div style={floatLeft}>
        <label style={floatLeft} htmlFor="rate">Rate:</label>
        <div style={containerStyle}>
          <input id="rate" type="range" min={50} max={400} style={inputStyle}
            onChange={this.updateRate}
            value={this.props.lc.tool.pointsPerSecond} />
          <div style={valueStyle}>{this.state.rate} px/sec</div>
        </div>
      </div>
      <div style={{float: 'left', width: 10, height: 10}} />
      <div style={floatLeft}>
        <label style={floatLeft} htmlFor="radius">Radius:</label>
        <div style={containerStyle}>
          <input id="radius" type="range" min={5} max={200} style={inputStyle}
            onChange={this.updateRadius}
            value={this.props.lc.tool.radius} />
          <div style={valueStyle}>{this.state.radius}px</div>
        </div>
      </div>
    </div>;
  }
}));


module.exports = class Spraypaint extends LC.tools.Tool {

  renderHelp() {
    return <div>
      <h2>Spraypaint</h2>
      <p>
        While the mouse button is down, add single-pixel-large points within
        X pixels of the cursor (determined by a slider) at a frequency of
        Y pixels per second (also determined by a slider).
      </p>
      <p>
        The result is saved as a <tt>PointCollection</tt> shape, which is
        very efficient to render because it saves all the point as an image
        once the mouse button is released.
      </p>
    </div>
  }

  constructor(lc) {
    super(lc);
    this.name = 'PointCollection';
    this.iconName = 'spraypaint';
    this.optionsStyle = 'spraypaint-options';

    this.pointsPerSecond = 300;
    this.radius = 20;
  }

  update() {
    if (!this.shape) return;
    const secondsSinceStart = (Date.now() - this.startTime) / 1000;
    const pointsSinceStart = this.pointsPerSecond * secondsSinceStart;
    while(this.shape.points.length < pointsSinceStart) {
      const [x, y] = getPoint(this.point.x, this.point.y, this.radius)
      this.shape.addPoint(x, y);
    }
    this.lc.drawShapeInProgress(this.shape);
    // window.requestAnimationFrame => this.update()
    setTimeout(this.update.bind(this), 0);
  }

  begin(x, y, lc) {
    this.lc = lc;
    this.startTime = Date.now();
    this.shape = LC.createShape('PointCollection', {color: lc.colors.primary});
    this.point = {x, y};
    // window.requestAnimationFrame => this.update()
    setTimeout(this.update.bind(this), 0);
  }

  continue(x, y, lc) {
    this.point = {x, y};
  }

  end(x, y, lc) {
    this.shape.bake()
    lc.saveShape(this.shape)
    this.shape = null
  }
}
