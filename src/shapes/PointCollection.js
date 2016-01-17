const LC = require('literallycanvas');

LC.defineShape('PointCollection', {
  constructor: function(args) {
    args = args || {};
    this.points = args.points || []; // [[x, y]]
    this.color = args.color;
  },

  addPoint: function(x, y) {
    if (this.image) {
      throw "Can't add point after baking";
    }
    this.points.push([x, y]);
  },

  bake: function() {
    if (!this.points.length) return;
    const rect = this.getBoundingRect();
    if (!(rect.width > 0 || rect.height > 0)) return;

    const canvas = document.createElement('canvas');
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = this.color;
    this.points.map(function([x, y]) {
      ctx.fillRect(x-rect.x, y-rect.y, 1, 1);
    });

    this.image = new Image();
    this.image.src = canvas.toDataURL();
    this.imagePosition = {x: rect.x, y: rect.y};
    // window.open(this.image.src)
  },

  getBoundingRect: function() {
    if (this.points.length == 0) {
      return {x: 0, y: 0, width: 0, height: 0};
    }
    let [minX, minY] = this.points[0];
    let [maxX, maxY] = this.points[0];
    this.points.map(function([x, y]) {
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    });
    return {x: minX, y: minY, width: maxX - minX, height: maxY - minY};
  },

  toJSON: function() { return {points: this.points, color: this.color}; },
  fromJSON: function(args) {
    const shape = LC.createShape('PointCollection', args);
    shape.bake();
    return shape;
  }
});


function drawPointCollection(ctx, shape, retryCallback) {
  if (shape.image) {
    if (shape.image.width) {
      ctx.drawImage(shape.image, shape.imagePosition.x, shape.imagePosition.y);
    } else if (retryCallback) {
      LC.util.addImageOnload(shape.image, retryCallback);
    }
  } else {
    ctx.fillStyle = shape.color;
    shape.points.map(function([x, y]) {
      ctx.fillRect(x, y, 1, 1);
    });
  }
}

function drawPointCollectionLatest(ctx, bufferCtx, shape) {
  shape._drawStartIndex = shape._drawStartIndex || 0;
  let i = shape._drawStartIndex;
  bufferCtx.fillStyle = shape.color;
  while (i < shape.points.length) {
    const [x, y] = shape.points[i];
    bufferCtx.fillRect(x, y, 1, 1)
    i += 1;
  }
  shape._drawStartIndex = i;
}

LC.defineCanvasRenderer(
  'PointCollection', drawPointCollection, drawPointCollectionLatest);

LC.defineSVGRenderer('PointCollection', function(shape) {
  shape.points.map(function([x, y]) {
    return `
      <rect x='${x}' y='${y}'
        width='1' height='1'
        stroke='none' fill='${shape.color}' stroke-width='0' />
    `
  }).join('')
});
