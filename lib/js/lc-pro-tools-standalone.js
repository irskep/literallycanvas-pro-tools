var LCProTools =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  tools: __webpack_require__(1),
	  shapes: __webpack_require__(5)
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var TOOLS = {
	  PaintBucket: __webpack_require__(2),
	  SpraypaintTool: __webpack_require__(3),

	  allTools: [__webpack_require__(3), __webpack_require__(2)],

	  addToDefaultTools: function addToDefaultTools(LC) {
	    Array.prototype.push.apply(LC.defaultTools, TOOLS.allTools);
	  }
	};

	module.exports = TOOLS;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function getDefaultImageRect(lc, margin) {
	  margin = margin || { top: 0, right: 0, bottom: 0, left: 0 };
	  var allShapes = lc.shapes.concat(lc.backgroundShapes);
	  var rect = LC.util.getBoundingRect(allShapes.map(function (s) {
	    return s.getBoundingRect(lc.ctx);
	  }), lc.width == 'infinite' ? 0 : lc.width, lc.height == 'infinite' ? 0 : lc.height);

	  if (lc.width == 'infinite') {
	    rect.x -= margin.left;
	    rect.width += margin.left + margin.right;
	  }
	  if (lc.height == 'infinite') {
	    rect.y -= margin.top;
	    rect.height += margin.top + margin.bottom;
	  }
	  return rect;
	}

	function getIsPointInRect(x, y, rect) {
	  if (x < rect.x) return false;
	  if (y < rect.y) return false;
	  if (x >= rect.x + rect.width) return false;
	  if (y >= rect.y + rect.height) return false;
	  return true;
	}

	function getIndex(x, y, width) {
	  return (y * width + x) * 4;
	}

	function getColorArray(imageData, i) {
	  return [imageData[i], imageData[i + 1], imageData[i + 2], imageData[i + 3]];
	}

	function getAreColorsEqual(a, b, threshold) {
	  var d = 0;
	  for (var i = 0; i < 4; i++) {
	    d += Math.abs(a[i] - b[i]);
	  }
	  return d <= threshold;
	}

	function getFillImage(canvas, point, fillColor, threshold, callback) {
	  var rect = { x: 0, y: 0, width: canvas.width, height: canvas.height };
	  var ctx = canvas.getContext('2d');
	  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
	  var outputData = new ArrayBuffer(imageData.length);
	  var outputPoints = [];

	  var pixelStack = [[point.x, point.y]];
	  var startColor = getColorArray(imageData, getIndex(point.x, point.y, rect.width));

	  var newCanvas = document.createElement('canvas');
	  newCanvas.width = canvas.width;
	  newCanvas.height = canvas.height;
	  newCanvas.backgroundColor = 'transparent';
	  var newCtx = newCanvas.getContext('2d');
	  newCtx.fillStyle = fillColor;

	  var lastCheckpoint = Date.now();

	  function run() {
	    while (pixelStack.length && Date.now() - lastCheckpoint < 90) {
	      var p = pixelStack.pop();

	      var _p = _slicedToArray(p, 2);

	      var x = _p[0];
	      var y = _p[1];

	      var i = getIndex(x, y, rect.width);
	      if (!getIsPointInRect(x, y, rect)) continue;
	      if (outputData[i]) {
	        continue;
	      }
	      var color = getColorArray(imageData, i);
	      if (!getAreColorsEqual(color, startColor, threshold)) continue;
	      outputData[i] = true;
	      newCtx.fillRect(x, y, 1, 1);
	      outputPoints.push(p);
	      pixelStack.push([x, y + 1]);
	      pixelStack.push([x + 1, y]);
	      pixelStack.push([x - 1, y]);
	      pixelStack.push([x, y - 1]);
	    }

	    var isDone = pixelStack.length == 0;
	    var image = new Image();
	    image.src = newCanvas.toDataURL();
	    if (!isDone) setTimeout(run, 0);
	    lastCheckpoint = Date.now();

	    if (image.width) {
	      callback(image, isDone);
	    } else {
	      LC.util.addImageOnload(image, function () {
	        callback(image, isDone);
	      });
	    }
	  };

	  run();
	}

	LC.defineOptionsStyle('flood-fill-options', React.createClass({
	  displayName: 'FloodFillOptions',
	  getInitialState: function getInitialState() {
	    return this._getState();
	  },
	  _getState: function _getState() {
	    return { threshold: this.props.lc.tool.threshold };
	  },
	  updateThreshold: function updateThreshold(e) {
	    this.props.lc.tool.threshold = parseInt(e.target.value, 10);
	    this.setState(this._getState());
	  },
	  render: function render() {
	    var floatLeft = {
	      display: 'block',
	      float: 'left'
	    };
	    var containerStyle = {
	      position: 'relative',
	      float: 'left',
	      width: 80,
	      height: 30
	    };
	    var inputStyle = {
	      width: 80,
	      height: 14,
	      margin: 0,
	      padding: 0
	    };
	    var valueStyle = {
	      textAlign: 'center',
	      position: 'absolute',
	      top: 15,
	      right: 0, bottom: 0, left: 0,
	      fontSize: 10
	    };

	    var MAX_THRESHOLD = 255 * 4;
	    var percent = Math.floor(this.state.threshold / MAX_THRESHOLD * 100);
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { style: floatLeft },
	        React.createElement(
	          'label',
	          { style: floatLeft, htmlFor: 'threshold' },
	          'Threshold:'
	        ),
	        React.createElement(
	          'div',
	          { style: containerStyle },
	          React.createElement('input', { id: 'threshold', type: 'range', min: 0, max: MAX_THRESHOLD,
	            style: inputStyle, onChange: this.updateThreshold,
	            value: this.state.threshold }),
	          React.createElement(
	            'div',
	            { style: valueStyle },
	            percent,
	            '%'
	          )
	        )
	      )
	    );
	  }
	}));

	module.exports = function (_LC$tools$Tool) {
	  _inherits(FillTool, _LC$tools$Tool);

	  _createClass(FillTool, [{
	    key: 'renderHelp',
	    value: function renderHelp() {
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'h2',
	          null,
	          'Paint Bucket'
	        ),
	        React.createElement(
	          'p',
	          null,
	          'Click on a pixel. While any neighboring pixel is at least X% similar to the clicked pixel (as determined by the slider in the options toolbar), a neighboring pixel is set to the background color.'
	        ),
	        React.createElement(
	          'p',
	          null,
	          'The result is saved as an Image object.'
	        ),
	        React.createElement(
	          'p',
	          null,
	          React.createElement(
	            'b',
	            null,
	            'If the image is unbounded, the paint bucket will ignore all pixels outside the minimum bounding rect of all existing shapes.'
	          ),
	          ' So if there are no shapes yet, it will do nothing.'
	        )
	      );
	    }
	  }]);

	  function FillTool(lc) {
	    _classCallCheck(this, FillTool);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FillTool).call(this, lc));

	    _this.name = 'Fill';
	    _this.iconName = 'paint-bucket';
	    _this.optionsStyle = 'flood-fill-options';
	    _this.usesSimpleAPI = true;
	    _this.threshold = 20;
	    return _this;
	  }

	  _createClass(FillTool, [{
	    key: 'begin',
	    value: function begin(x, y, lc) {}
	  }, {
	    key: 'continue',
	    value: function _continue(x, y, lc) {}
	  }, {
	    key: 'end',
	    value: function end(x, y, lc) {
	      var rect = getDefaultImageRect(lc);

	      var startPoint = { x: Math.floor(x), y: Math.floor(y) };
	      if (!getIsPointInRect(startPoint.x, startPoint.y, rect)) return null;

	      var fillPoint = {
	        x: startPoint.x - rect.x,
	        y: startPoint.y - rect.y
	      };
	      var fillColor = lc.colors.secondary;

	      var didFinish = false;

	      return getFillImage(lc.getImage({ rect: rect }), fillPoint, fillColor, this.threshold, function (image, isDone) {
	        if (didFinish) return;
	        var shape = LC.createShape('Image', { x: rect.x, y: rect.y, image: image });
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
	  }]);

	  return FillTool;
	}(LC.tools.Tool);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	__webpack_require__(4);

	function getPoint(x, y, radius) {
	  var x2 = Math.floor(x + radius + 1);
	  var y2 = Math.floor(y + radius + 1);
	  while (Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)) > radius) {
	    x2 = Math.floor(x - radius + Math.random() * radius * 2);
	    y2 = Math.floor(y - radius + Math.random() * radius * 2);
	  }
	  return [x2, y2];
	};

	LC.defineOptionsStyle('spraypaint-options', React.createClass({
	  displayName: 'SpraypaintOptions',
	  getInitialState: function getInitialState() {
	    return this._getState();
	  },
	  _getState: function _getState() {
	    return {
	      rate: this.props.lc.tool.pointsPerSecond,
	      radius: this.props.lc.tool.radius
	    };
	  },
	  updateRate: function updateRate(e) {
	    this.props.lc.tool.pointsPerSecond = parseInt(e.target.value, 10);
	    this.setState(this._getState());
	  },
	  updateRadius: function updateRadius(e) {
	    this.props.lc.tool.radius = parseInt(e.target.value, 10);
	    this.setState(this._getState());
	  },
	  render: function render() {
	    var floatLeft = {
	      display: 'block',
	      float: 'left'
	    };
	    var containerStyle = {
	      position: 'relative',
	      float: 'left',
	      width: 80,
	      height: 30
	    };
	    var inputStyle = {
	      width: 80,
	      height: 14,
	      margin: 0,
	      padding: 0
	    };
	    var valueStyle = {
	      textAlign: 'center',
	      position: 'absolute',
	      top: 15,
	      right: 0, bottom: 0, left: 0,
	      fontSize: 10
	    };

	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'div',
	        { style: floatLeft },
	        React.createElement(
	          'label',
	          { style: floatLeft, htmlFor: 'rate' },
	          'Rate:'
	        ),
	        React.createElement(
	          'div',
	          { style: containerStyle },
	          React.createElement('input', { id: 'rate', type: 'range', min: 50, max: 400, style: inputStyle,
	            onChange: this.updateRate,
	            value: this.props.lc.tool.pointsPerSecond }),
	          React.createElement(
	            'div',
	            { style: valueStyle },
	            this.state.rate,
	            ' px/sec'
	          )
	        )
	      ),
	      React.createElement('div', { style: { float: 'left', width: 10, height: 10 } }),
	      React.createElement(
	        'div',
	        { style: floatLeft },
	        React.createElement(
	          'label',
	          { style: floatLeft, htmlFor: 'radius' },
	          'Radius:'
	        ),
	        React.createElement(
	          'div',
	          { style: containerStyle },
	          React.createElement('input', { id: 'radius', type: 'range', min: 5, max: 200, style: inputStyle,
	            onChange: this.updateRadius,
	            value: this.props.lc.tool.radius }),
	          React.createElement(
	            'div',
	            { style: valueStyle },
	            this.state.radius,
	            'px'
	          )
	        )
	      )
	    );
	  }
	}));

	module.exports = function (_LC$tools$Tool) {
	  _inherits(Spraypaint, _LC$tools$Tool);

	  _createClass(Spraypaint, [{
	    key: 'renderHelp',
	    value: function renderHelp() {
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'h2',
	          null,
	          'Spraypaint'
	        ),
	        React.createElement(
	          'p',
	          null,
	          'While the mouse button is down, add single-pixel-large points within X pixels of the cursor (determined by a slider) at a frequency of Y pixels per second (also determined by a slider).'
	        ),
	        React.createElement(
	          'p',
	          null,
	          'The result is saved as a ',
	          React.createElement(
	            'tt',
	            null,
	            'PointCollection'
	          ),
	          ' shape, which is very efficient to render because it saves all the point as an image once the mouse button is released.'
	        )
	      );
	    }
	  }]);

	  function Spraypaint(lc) {
	    _classCallCheck(this, Spraypaint);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Spraypaint).call(this, lc));

	    _this.name = 'PointCollection';
	    _this.iconName = 'spraypaint';
	    _this.optionsStyle = 'spraypaint-options';

	    _this.pointsPerSecond = 300;
	    _this.radius = 20;
	    return _this;
	  }

	  _createClass(Spraypaint, [{
	    key: 'update',
	    value: function update() {
	      if (!this.shape) return;
	      var secondsSinceStart = (Date.now() - this.startTime) / 1000;
	      var pointsSinceStart = this.pointsPerSecond * secondsSinceStart;
	      while (this.shape.points.length < pointsSinceStart) {
	        var _getPoint = getPoint(this.point.x, this.point.y, this.radius);

	        var _getPoint2 = _slicedToArray(_getPoint, 2);

	        var x = _getPoint2[0];
	        var y = _getPoint2[1];

	        this.shape.addPoint(x, y);
	      }
	      this.lc.drawShapeInProgress(this.shape);
	      // window.requestAnimationFrame => this.update()
	      setTimeout(this.update.bind(this), 0);
	    }
	  }, {
	    key: 'begin',
	    value: function begin(x, y, lc) {
	      this.lc = lc;
	      this.startTime = Date.now();
	      this.shape = LC.createShape('PointCollection', { color: lc.colors.primary });
	      this.point = { x: x, y: y };
	      // window.requestAnimationFrame => this.update()
	      setTimeout(this.update.bind(this), 0);
	    }
	  }, {
	    key: 'continue',
	    value: function _continue(x, y, lc) {
	      this.point = { x: x, y: y };
	    }
	  }, {
	    key: 'end',
	    value: function end(x, y, lc) {
	      this.shape.bake();
	      lc.saveShape(this.shape);
	      this.shape = null;
	    }
	  }]);

	  return Spraypaint;
	}(LC.tools.Tool);

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	LC.defineShape('PointCollection', {
	  constructor: function constructor(args) {
	    args = args || {};
	    this.points = args.points || []; // [[x, y]]
	    this.color = args.color;
	  },

	  addPoint: function addPoint(x, y) {
	    if (this.image) {
	      throw "Can't add point after baking";
	    }
	    this.points.push([x, y]);
	  },

	  bake: function bake() {
	    if (!this.points.length) return;
	    var rect = this.getBoundingRect();
	    if (!(rect.width > 0 || rect.height > 0)) return;

	    var canvas = document.createElement('canvas');
	    canvas.width = rect.width;
	    canvas.height = rect.height;
	    var ctx = canvas.getContext('2d');
	    ctx.fillStyle = this.color;
	    this.points.map(function (_ref) {
	      var _ref2 = _slicedToArray(_ref, 2);

	      var x = _ref2[0];
	      var y = _ref2[1];

	      ctx.fillRect(x - rect.x, y - rect.y, 1, 1);
	    });

	    this.image = new Image();
	    this.image.src = canvas.toDataURL();
	    this.imagePosition = { x: rect.x, y: rect.y };
	    // window.open(this.image.src)
	  },

	  getBoundingRect: function getBoundingRect() {
	    if (this.points.length == 0) {
	      return { x: 0, y: 0, width: 0, height: 0 };
	    }

	    var _points$ = _slicedToArray(this.points[0], 2);

	    var minX = _points$[0];
	    var minY = _points$[1];

	    var _points$2 = _slicedToArray(this.points[0], 2);

	    var maxX = _points$2[0];
	    var maxY = _points$2[1];

	    this.points.map(function (_ref3) {
	      var _ref4 = _slicedToArray(_ref3, 2);

	      var x = _ref4[0];
	      var y = _ref4[1];

	      minX = Math.min(minX, x);
	      minY = Math.min(minY, y);
	      maxX = Math.max(maxX, x);
	      maxY = Math.max(maxY, y);
	    });
	    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
	  },

	  toJSON: function toJSON() {
	    return { points: this.points, color: this.color };
	  },
	  fromJSON: function fromJSON(args) {
	    var shape = LC.createShape('PointCollection', args);
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
	    shape.points.map(function (_ref5) {
	      var _ref6 = _slicedToArray(_ref5, 2);

	      var x = _ref6[0];
	      var y = _ref6[1];

	      ctx.fillRect(x, y, 1, 1);
	    });
	  }
	}

	function drawPointCollectionLatest(ctx, bufferCtx, shape) {
	  shape._drawStartIndex = shape._drawStartIndex || 0;
	  var i = shape._drawStartIndex;
	  bufferCtx.fillStyle = shape.color;
	  while (i < shape.points.length) {
	    var _shape$points$i = _slicedToArray(shape.points[i], 2);

	    var x = _shape$points$i[0];
	    var y = _shape$points$i[1];

	    bufferCtx.fillRect(x, y, 1, 1);
	    i += 1;
	  }
	  shape._drawStartIndex = i;
	}

	LC.defineCanvasRenderer('PointCollection', drawPointCollection, drawPointCollectionLatest);

	LC.defineSVGRenderer('PointCollection', function (shape) {
	  shape.points.map(function (_ref7) {
	    var _ref8 = _slicedToArray(_ref7, 2);

	    var x = _ref8[0];
	    var y = _ref8[1];

	    return '\n      <rect x=\'' + x + '\' y=\'' + y + '\'\n        width=\'1\' height=\'1\'\n        stroke=\'none\' fill=\'' + shape.color + '\' stroke-width=\'0\' />\n    ';
	  }).join('');
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = {
	  PointCollection: __webpack_require__(4)
	};

/***/ }
/******/ ]);