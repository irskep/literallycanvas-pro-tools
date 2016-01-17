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

	var React = __webpack_require__(1);
	var LC = __webpack_require__(2);

	var _require = __webpack_require__(3);

	var tools = _require.tools;

	LC.init(document.getElementById('lc-container'), { imageURLPrefix: "/literallycanvas/img" });

	var DemoApp = React.createClass({
	  displayName: 'DemoApp',
	  render: function render() {
	    return React.createElement(
	      'div',
	      null,
	      React.createElement(
	        'h1',
	        null,
	        'Literally Canvas Pro Tools'
	      )
	    );
	  }
	});

	React.render(React.createElement(DemoApp, null), document.getElementById('before-lc'));

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = LC;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  tools: __webpack_require__(4),
	  shapes: __webpack_require__(7)
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = {
	  SpraypaintTool: __webpack_require__(5),

	  addToDefaultTools: function addToDefaultTools(LC) {
	    Array.prototype.push.apply(LC.defaultTools, [__webpack_require__(5)]);
	  }
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	__webpack_require__(6);

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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var LC = __webpack_require__(2);

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
	    rect = this.getBoundingRect();
	    if (!(rect.width > 0 || rect.height > 0)) return;

	    canvas = document.createElement('canvas');
	    canvas.width = rect.width;
	    canvas.height = rect.height;
	    ctx = canvas.getContext('2d');
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
	    shape = LC.createShape('PointCollection', args);
	    shape.bake();
	    shape;
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = {
	  PointCollection: __webpack_require__(6)
	};

/***/ }
/******/ ]);