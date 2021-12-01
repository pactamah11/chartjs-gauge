/*!
 * chartjs-gauge.js v3.0.0
 * https://github.com/haiiaaa/chartjs-gauge/
 * (c) 2021 chartjs-gauge.js Contributors
 * Released under the MIT License
 */
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('chart.js')) :
typeof define === 'function' && define.amd ? define(['chart.js'], factory) :
(global = global || self, factory(global.Chart));
}(this, (function (Chart$1) { 'use strict';

var Chart$1__default = 'default' in Chart$1 ? Chart$1['default'] : Chart$1;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (_isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

var version = "3.0.0";

var _Chart$helpers = Chart.helpers,
    toPercentage = _Chart$helpers.toPercentage,
    toDimension = _Chart$helpers.toDimension,
    toRadians = _Chart$helpers.toRadians,
    addRoundedRectPath = _Chart$helpers.addRoundedRectPath,
    PI = _Chart$helpers.PI,
    TAU = _Chart$helpers.TAU,
    HALF_PI = _Chart$helpers.HALF_PI,
    _angleBetween = _Chart$helpers._angleBetween;

function getRatioAndOffset(rotation, circumference, cutout, needleOpts) {
  var ratioX = 1;
  var ratioY = 1;
  var offsetX = 0;
  var offsetY = 0; // If the chart's circumference isn't a full circle, calculate size as a ratio of the width/height of the arc

  if (circumference < TAU) {
    var startAngle = rotation;
    var endAngle = startAngle + circumference;
    var startX = Math.cos(startAngle);
    var startY = Math.sin(startAngle);
    var endX = Math.cos(endAngle);
    var endY = Math.sin(endAngle); // include center for needle

    var radiusPercentage = needleOpts.radiusPercentage,
        widthPercentage = needleOpts.widthPercentage,
        lengthPercentage = needleOpts.lengthPercentage;
    var needleWidth = Math.max(radiusPercentage / 100, widthPercentage / 2 / 100);

    var calcMax = function calcMax(angle, a, b) {
      return _angleBetween(angle, startAngle, endAngle) ? Math.max(1, lengthPercentage / 100) : Math.max(a, a * cutout, b, b * cutout, needleWidth);
    };

    var calcMin = function calcMin(angle, a, b) {
      return _angleBetween(angle, startAngle, endAngle) ? Math.min(-1, -lengthPercentage / 100) : Math.min(a, a * cutout, b, b * cutout, -needleWidth);
    };

    var maxX = calcMax(0, startX, endX);
    var maxY = calcMax(HALF_PI, startY, endY);
    var minX = calcMin(PI, startX, endX);
    var minY = calcMin(PI + HALF_PI, startY, endY);
    ratioX = (maxX - minX) / 2;
    ratioY = (maxY - minY) / 2;
    offsetX = -(maxX + minX) / 2;
    offsetY = -(maxY + minY) / 2;
  }

  return {
    ratioX: ratioX,
    ratioY: ratioY,
    offsetX: offsetX,
    offsetY: offsetY
  };
}

var GaugeController = /*#__PURE__*/function (_DoughnutController) {
  _inherits(GaugeController, _DoughnutController);

  var _super = _createSuper(GaugeController);

  function GaugeController() {
    _classCallCheck(this, GaugeController);

    return _super.apply(this, arguments);
  }

  _createClass(GaugeController, [{
    key: "parse",
    value: function parse(start, count) {
      _get(_getPrototypeOf(GaugeController.prototype), "parse", this).call(this, start, count);

      var dataset = this.getDataset();
      var meta = this._cachedMeta;
      meta.minValue = dataset.minValue || 0;
      meta.value = dataset.value;
    }
    /**
    * @param {string} mode
    */

  }, {
    key: "update",
    value: function update(mode) {
      var me = this;
      var chart = me.chart;
      var chartArea = chart.chartArea;
      var meta = me._cachedMeta;
      var arcs = meta.data;
      var spacing = me.getMaxBorderWidth() + me.getMaxOffset(arcs);
      var maxSize = Math.max((Math.min(chartArea.width, chartArea.height) - spacing) / 2, 0);
      var cutout = Math.min(toPercentage(me.options.cutout, maxSize), 1);

      var chartWeight = me._getRingWeight(me.index); // Compute the maximal rotation & circumference limits.
      // If we only consider our dataset, this can cause problems when two datasets
      // are both less than a circle with different rotations (starting angles)


      var _me$_getRotationExten = me._getRotationExtents(),
          circumference = _me$_getRotationExten.circumference,
          rotation = _me$_getRotationExten.rotation;

      var _getRatioAndOffset = getRatioAndOffset(rotation, circumference, cutout, this.options.needle),
          ratioX = _getRatioAndOffset.ratioX,
          ratioY = _getRatioAndOffset.ratioY,
          offsetX = _getRatioAndOffset.offsetX,
          offsetY = _getRatioAndOffset.offsetY;

      var maxWidth = (chartArea.width - spacing) / ratioX;
      var maxHeight = (chartArea.height - spacing) / ratioY;
      var maxRadius = Math.max(Math.min(maxWidth, maxHeight) / 2, 0);
      var outerRadius = toDimension(me.options.radius, maxRadius);
      var innerRadius = Math.max(outerRadius * cutout, 0);

      var radiusLength = (outerRadius - innerRadius) / me._getVisibleDatasetWeightTotal();

      me.offsetX = offsetX * outerRadius;
      me.offsetY = offsetY * outerRadius;
      meta.total = me.calculateTotal();
      me.outerRadius = outerRadius - radiusLength * me._getRingWeightOffset(me.index);
      me.innerRadius = Math.max(me.outerRadius - radiusLength * chartWeight, 0);
      me.updateElements(arcs, 0, arcs.length, mode);
    }
  }, {
    key: "calculateTotal",
    value: function calculateTotal() {
      var meta = this._cachedMeta;
      var metaData = meta.data;
      var total = 0; // get Min/Max

      var valueMin = meta.minValue;
      var valueMax = meta.minValue;
      var i;

      for (i = 0; i < metaData.length; i++) {
        var value = meta._parsed[i];

        if (value !== null && !isNaN(value) && this.chart.getDataVisibility(i)) {
          if (value < valueMin) valueMin = value;
          if (value > valueMax) valueMax = value;
        }
      }

      meta.minValue = valueMin; // calc total

      if (valueMin !== null && !isNaN(valueMin) && valueMax !== null && !isNaN(valueMax)) {
        total = Math.abs(valueMax - valueMin);
      }

      return total;
    }
  }, {
    key: "updateElements",
    value: function updateElements(arcs, start, count, mode) {
      var me = this;
      var reset = mode === 'reset';
      var chart = me.chart;
      var chartArea = chart.chartArea;
      var opts = chart.options;
      var animationOpts = opts.animation;
      var centerX = (chartArea.left + chartArea.right) / 2;
      var centerY = (chartArea.top + chartArea.bottom) / 2;
      var animateScale = reset && animationOpts.animateScale;
      var innerRadius = animateScale ? 0 : me.innerRadius;
      var outerRadius = animateScale ? 0 : me.outerRadius;
      var firstOpts = me.resolveDataElementOptions(start, mode);
      var sharedOptions = me.getSharedOptions(firstOpts);
      var includeOptions = me.includeOptions(mode, sharedOptions);

      var rotation = me._getRotation();

      var startAngle = rotation;
      var i;
      if (start > 0) startAngle = me._circumference(start, reset) + rotation;

      for (i = start; i < start + count; ++i) {
        var endAngle = me._circumference(i, reset) + rotation;
        var arc = arcs[i];
        var properties = {
          x: centerX + me.offsetX,
          y: centerY + me.offsetY,
          startAngle: startAngle,
          endAngle: endAngle,
          circumference: endAngle - startAngle,
          outerRadius: outerRadius,
          innerRadius: innerRadius
        };

        if (includeOptions) {
          properties.options = sharedOptions || me.resolveDataElementOptions(i, mode);
        }

        startAngle = endAngle;
        me.updateElement(arc, i, properties, mode);
      }

      me.updateSharedOptions(sharedOptions, mode, firstOpts);
    }
  }, {
    key: "calculateCircumference",
    value: function calculateCircumference(value) {
      var total = this._cachedMeta.total;
      var minValue = this._cachedMeta.minValue;

      if (total > 0 && !isNaN(value) && !isNaN(minValue)) {
        var circumference = this._getCircumference();

        var minCircumference = minValue * circumference / TAU;
        return TAU * (Math.abs(value - minCircumference) / total);
      }

      return 0;
    }
  }, {
    key: "getTranslation",
    value: function getTranslation(chart) {
      var chartArea = chart.chartArea;
      var centerX = (chartArea.left + chartArea.right) / 2;
      var centerY = (chartArea.top + chartArea.bottom) / 2;
      var dx = centerX + this.offsetX || 0;
      var dy = centerY + this.offsetY || 0;
      return {
        dx: dx,
        dy: dy
      };
    }
  }, {
    key: "drawNeedle",
    value: function drawNeedle() {
      var _this$chart = this.chart,
          ctx = _this$chart.ctx,
          chartArea = _this$chart.chartArea;
      var innerRadius = this.innerRadius,
          outerRadius = this.outerRadius;
      var _this$options$needle = this.options.needle,
          radiusPercentage = _this$options$needle.radiusPercentage,
          widthPercentage = _this$options$needle.widthPercentage,
          lengthPercentage = _this$options$needle.lengthPercentage,
          color = _this$options$needle.color;
      var width = chartArea.right - chartArea.left;
      var needleRadius = radiusPercentage / 100 * width;
      var needleWidth = widthPercentage / 100 * width;
      var needleLength = lengthPercentage / 100 * (outerRadius - innerRadius) + innerRadius; // center

      var _this$getTranslation = this.getTranslation(this.chart),
          dx = _this$getTranslation.dx,
          dy = _this$getTranslation.dy; // interpolate


      var meta = this._cachedMeta;

      var circumference = this._getCircumference();

      var rotation = this._getRotation();

      var angle = this.calculateCircumference(meta.value * circumference / TAU) + rotation; // draw

      ctx.save();
      ctx.translate(dx, dy);
      ctx.rotate(angle);
      ctx.fillStyle = color; // draw circle

      ctx.beginPath();
      ctx.ellipse(0, 0, needleRadius, needleRadius, 0, 0, 2 * Math.PI);
      ctx.fill(); // draw needle

      ctx.beginPath();
      ctx.moveTo(0, needleWidth / 2);
      ctx.lineTo(needleLength, 0);
      ctx.lineTo(0, -needleWidth / 2);
      ctx.fill();
      ctx.restore();
    }
  }, {
    key: "drawValueLabel",
    value: function drawValueLabel() {
      // eslint-disable-line no-unused-vars
      if (!this.options.valueLabel.display) {
        return;
      }

      var _this$chart2 = this.chart,
          ctx = _this$chart2.ctx,
          config = _this$chart2.config,
          chartArea = _this$chart2.chartArea;
      var defaultFontFamily = config.options.defaultFontFamily;
      var dataset = config.data.datasets[this.index];
      var _this$options$valueLa = this.options.valueLabel,
          formatter = _this$options$valueLa.formatter,
          fontSize = _this$options$valueLa.fontSize,
          color = _this$options$valueLa.color,
          backgroundColor = _this$options$valueLa.backgroundColor,
          borderRadius = _this$options$valueLa.borderRadius,
          padding = _this$options$valueLa.padding,
          bottomMarginPercentage = _this$options$valueLa.bottomMarginPercentage;
      var width = chartArea.right - chartArea.left;
      var bottomMargin = bottomMarginPercentage / 100 * width;

      var fmt = formatter || function (value) {
        return value;
      };

      var valueText = fmt(dataset.value).toString();
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      if (fontSize) {
        ctx.font = "".concat(fontSize, "px ").concat(defaultFontFamily);
      } // const { width: textWidth, actualBoundingBoxAscent, actualBoundingBoxDescent } = ctx.measureText(valueText);
      // const textHeight = actualBoundingBoxAscent + actualBoundingBoxDescent;


      var _ctx$measureText = ctx.measureText(valueText),
          textWidth = _ctx$measureText.width; // approximate height until browsers support advanced TextMetrics


      var textHeight = Math.max(ctx.measureText('m').width, ctx.measureText("\uFF37").width);
      var x = -(padding.left + textWidth / 2);
      var y = -(padding.top + textHeight / 2);
      var w = padding.left + textWidth + padding.right;
      var h = padding.top + textHeight + padding.bottom; // center

      var _this$getTranslation2 = this.getTranslation(this.chart),
          dx = _this$getTranslation2.dx,
          dy = _this$getTranslation2.dy; // add rotation


      var rotation = toRadians(this.chart.options.rotation) % (Math.PI * 2.0);
      dx += bottomMargin * Math.cos(rotation + Math.PI / 2);
      dy += bottomMargin * Math.sin(rotation + Math.PI / 2); // draw

      ctx.save();
      ctx.translate(dx, dy); // draw background

      ctx.beginPath();
      addRoundedRectPath(ctx, {
        x: x,
        y: y,
        w: w,
        h: h,
        radius: borderRadius
      });
      ctx.fillStyle = backgroundColor;
      ctx.fill(); // draw value text

      ctx.fillStyle = color || config.options.defaultFontColor;
      var magicNumber = 0.075; // manual testing

      ctx.fillText(valueText, 0, textHeight * magicNumber);
      ctx.restore();
    }
  }, {
    key: "draw",
    value: function draw() {
      _get(_getPrototypeOf(GaugeController.prototype), "draw", this).call(this);

      if (this.options.needle.display) {
        this.drawNeedle();
      }
      /*
          this.drawValueLabel();
      */

    }
  }]);

  return GaugeController;
}(Chart$1.DoughnutController);
GaugeController.id = 'gauge';
GaugeController.version = version;
GaugeController.overrides = {
  needle: {
    // Needle display
    display: true,
    // Needle circle radius as the percentage of the chart area width
    radiusPercentage: 2,
    // Needle width as the percentage of the chart area width
    widthPercentage: 3.2,
    // Needle length as the percentage of the interval between inner radius (0%) and outer radius (100%) of the arc
    lengthPercentage: 80,
    // The color of the needle
    color: 'rgba(0, 0, 0, 1)'
  },
  valueLabel: {
    // fontSize: undefined
    display: true,
    formatter: null,
    color: 'rgba(255, 255, 255, 1)',
    backgroundColor: 'rgba(0, 0, 0, 1)',
    borderRadius: 5,
    padding: {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5
    },
    bottomMarginPercentage: 5
  },
  // The percentage of the chart that we cut out of the middle.
  cutout: '50%',
  // The rotation of the chart, where the first data arc begins.
  rotation: -90,
  // The total circumference of the chart.
  circumference: 180,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: false
    }
  }
};

Chart$1__default.register(GaugeController);

})));
