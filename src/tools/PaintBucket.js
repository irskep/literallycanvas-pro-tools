function getDefaultImageRect(lc, margin) {
  margin = margin || {top: 0, right: 0, bottom: 0, left: 0};
  let allShapes = lc.shapes.concat(lc.backgroundShapes);
  const rect = LC.util.getBoundingRect(
    allShapes.map(function(s) { return s.getBoundingRect(lc.ctx); }),
    lc.width == 'infinite' ? 0 : lc.width,
    lc.height == 'infinite' ? 0 : lc.height)

  if (lc.width == 'infinite') {
    rect.x -= margin.left;
    rect.width += margin.left + margin.right;
  }
  if (lc.height == 'infinite') {
    rect.y -= margin.top;
    rect.height += margin.top + margin.bottom;
  }
  return rect
}


function getIsPointInRect(x, y, rect) {
  if (x < rect.x) return false;
  if (y < rect.y) return false;
  if (x >= rect.x + rect.width) return false;
  if (y >= rect.y + rect.height) return false;
  return true;
}

function getIndex(x, y, width) { return (y * width + x) * 4; }

function getColorArray(imageData, i) {
  return [
    imageData[i],
    imageData[i+1],
    imageData[i+2],
    imageData[i+3],
  ];
}

function getAreColorsEqual (a, b, threshold) {
  let d = 0;
  for(let i=0; i<4; i++) {
    d += Math.abs(a[i] - b[i]);
  }
  return d <= threshold;
}

function getFillImage(canvas, point, fillColor, threshold, callback) {
  let rect = {x: 0, y: 0, width: canvas.width, height: canvas.height};
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const outputData = new ArrayBuffer(imageData.length);
  const outputPoints = [];

  const pixelStack = [[point.x, point.y]];
  const startColor = getColorArray(
    imageData, getIndex(point.x, point.y, rect.width));

  const newCanvas = document.createElement('canvas');
  newCanvas.width = canvas.width;
  newCanvas.height = canvas.height;
  newCanvas.backgroundColor = 'transparent';
  const newCtx = newCanvas.getContext('2d');
  newCtx.fillStyle = fillColor;

  let lastCheckpoint = Date.now();

  function run() {
    while(pixelStack.length && Date.now() - lastCheckpoint < 90) {
      const p = pixelStack.pop();
      const [x, y] = p;
      const i = getIndex(x, y, rect.width);
      if (!getIsPointInRect(x, y, rect)) continue;
      if (outputData[i]) { continue; }
      const color = getColorArray(imageData, i);
      if (!getAreColorsEqual(color, startColor, threshold)) continue;
      outputData[i] = true;
      newCtx.fillRect(x, y, 1, 1);
      outputPoints.push(p);
      pixelStack.push([x, y+1]);
      pixelStack.push([x+1, y]);
      pixelStack.push([x-1, y]);
      pixelStack.push([x, y-1]);
    }

    const isDone = pixelStack.length == 0;
    const image = new Image();
    image.src = newCanvas.toDataURL();
    if (!isDone) setTimeout(run, 0);
    lastCheckpoint = Date.now()

    if (image.width) {
      callback(image, isDone);
    } else {
      LC.util.addImageOnload(image, function() { callback(image, isDone); });
    }
  };

  run();
}


LC.defineOptionsStyle('flood-fill-options', React.createClass({
  displayName: 'FloodFillOptions',
  getInitialState() { return this._getState() },
  _getState() { return {threshold: this.props.lc.tool.threshold}; },

  updateThreshold(e) {
    this.props.lc.tool.threshold = parseInt(e.target.value, 10);
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

    const MAX_THRESHOLD = 255 * 4;
    const percent = Math.floor((this.state.threshold / MAX_THRESHOLD) * 100);
    return <div>
      <div style={floatLeft}>
        <label style={floatLeft} htmlFor="threshold">Threshold:</label>
        <div style={containerStyle}>
          <input id="threshold" type="range" min={0} max={MAX_THRESHOLD}
            style={inputStyle} onChange={this.updateThreshold}
            value={this.state.threshold} />
          <div style={valueStyle}>{percent}%</div>
        </div>
      </div>
    </div>
  }
}));


module.exports = class FillTool extends LC.tools.Tool {

  renderHelp() {
    return <div>
      <h2>Paint Bucket</h2>
      <p>
        Click on a pixel. While any neighboring pixel is at least X% similar
        to the clicked pixel (as determined by the slider in the options
        toolbar), a neighboring pixel is set to the background color.
      </p>
      <p>
        The result is saved as an Image object.
      </p>
    </div>
  }

  constructor(lc) {
    super(lc);
    this.name = 'Fill';
    this.iconName = 'paint-bucket';
    this.optionsStyle = 'flood-fill-options';
    this.usesSimpleAPI = true;
    this.threshold = 20;
  }

  begin(x, y, lc) { }

  continue(x, y, lc) { }

  end(x, y, lc) {
    const rect = getDefaultImageRect(lc);

    const startPoint = {x: Math.floor(x), y: Math.floor(y)};
    if (!getIsPointInRect(startPoint.x, startPoint.y, rect)) return null;

    const fillPoint = {
      x: startPoint.x - rect.x,
      y: startPoint.y - rect.y
    };
    const fillColor = lc.colors.secondary;

    let didFinish = false;

    return getFillImage(
      lc.getImage({rect: rect}),
      fillPoint,
      fillColor,
      this.threshold,
      function(image, isDone) {
        if (didFinish) return;
        const shape = LC.createShape('Image', {x: rect.x, y: rect.y, image});
        if (isDone) {
          lc.setShapesInProgress([]);
          lc.saveShape(shape);
          didFinish = true;
        } else {
          lc.setShapesInProgress([shape]);
          lc.repaintLayer('main');
        }
      }.bind(this));
  }
}
