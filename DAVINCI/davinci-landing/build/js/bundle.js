(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":6}],2:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":1,"./_getRawTag":4,"./_objectToString":5}],3:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":1}],5:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],6:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":3}],7:[function(require,module,exports){
var isObject = require('./isObject'),
    now = require('./now'),
    toNumber = require('./toNumber');

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;

},{"./isObject":8,"./now":11,"./toNumber":12}],8:[function(require,module,exports){
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],9:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],10:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;

},{"./_baseGetTag":2,"./isObjectLike":9}],11:[function(require,module,exports){
var root = require('./_root');

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;

},{"./_root":6}],12:[function(require,module,exports){
var isObject = require('./isObject'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;

},{"./isObject":8,"./isSymbol":10}],13:[function(require,module,exports){
/*! nouislider - 13.1.1 - 2/14/2019 */
(function(factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === "object") {
        // Node/CommonJS
        module.exports = factory();
    } else {
        // Browser globals
        window.noUiSlider = factory();
    }
})(function() {
    "use strict";

    var VERSION = "13.1.1";

    //region Helper Methods

    function isValidFormatter(entry) {
        return typeof entry === "object" && typeof entry.to === "function" && typeof entry.from === "function";
    }

    function removeElement(el) {
        el.parentElement.removeChild(el);
    }

    function isSet(value) {
        return value !== null && value !== undefined;
    }

    // Bindable version
    function preventDefault(e) {
        e.preventDefault();
    }

    // Removes duplicates from an array.
    function unique(array) {
        return array.filter(function(a) {
            return !this[a] ? (this[a] = true) : false;
        }, {});
    }

    // Round a value to the closest 'to'.
    function closest(value, to) {
        return Math.round(value / to) * to;
    }

    // Current position of an element relative to the document.
    function offset(elem, orientation) {
        var rect = elem.getBoundingClientRect();
        var doc = elem.ownerDocument;
        var docElem = doc.documentElement;
        var pageOffset = getPageOffset(doc);

        // getBoundingClientRect contains left scroll in Chrome on Android.
        // I haven't found a feature detection that proves this. Worst case
        // scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
        if (/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)) {
            pageOffset.x = 0;
        }

        return orientation
            ? rect.top + pageOffset.y - docElem.clientTop
            : rect.left + pageOffset.x - docElem.clientLeft;
    }

    // Checks whether a value is numerical.
    function isNumeric(a) {
        return typeof a === "number" && !isNaN(a) && isFinite(a);
    }

    // Sets a class and removes it after [duration] ms.
    function addClassFor(element, className, duration) {
        if (duration > 0) {
            addClass(element, className);
            setTimeout(function() {
                removeClass(element, className);
            }, duration);
        }
    }

    // Limits a value to 0 - 100
    function limit(a) {
        return Math.max(Math.min(a, 100), 0);
    }

    // Wraps a variable as an array, if it isn't one yet.
    // Note that an input array is returned by reference!
    function asArray(a) {
        return Array.isArray(a) ? a : [a];
    }

    // Counts decimals
    function countDecimals(numStr) {
        numStr = String(numStr);
        var pieces = numStr.split(".");
        return pieces.length > 1 ? pieces[1].length : 0;
    }

    // http://youmightnotneedjquery.com/#add_class
    function addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += " " + className;
        }
    }

    // http://youmightnotneedjquery.com/#remove_class
    function removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(
                new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"),
                " "
            );
        }
    }

    // https://plainjs.com/javascript/attributes/adding-removing-and-testing-for-classes-9/
    function hasClass(el, className) {
        return el.classList
            ? el.classList.contains(className)
            : new RegExp("\\b" + className + "\\b").test(el.className);
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
    function getPageOffset(doc) {
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = (doc.compatMode || "") === "CSS1Compat";
        var x = supportPageOffset
            ? window.pageXOffset
            : isCSS1Compat
                ? doc.documentElement.scrollLeft
                : doc.body.scrollLeft;
        var y = supportPageOffset
            ? window.pageYOffset
            : isCSS1Compat
                ? doc.documentElement.scrollTop
                : doc.body.scrollTop;

        return {
            x: x,
            y: y
        };
    }

    // we provide a function to compute constants instead
    // of accessing window.* as soon as the module needs it
    // so that we do not compute anything if not needed
    function getActions() {
        // Determine the events to bind. IE11 implements pointerEvents without
        // a prefix, which breaks compatibility with the IE10 implementation.
        return window.navigator.pointerEnabled
            ? {
                  start: "pointerdown",
                  move: "pointermove",
                  end: "pointerup"
              }
            : window.navigator.msPointerEnabled
                ? {
                      start: "MSPointerDown",
                      move: "MSPointerMove",
                      end: "MSPointerUp"
                  }
                : {
                      start: "mousedown touchstart",
                      move: "mousemove touchmove",
                      end: "mouseup touchend"
                  };
    }

    // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
    // Issue #785
    function getSupportsPassive() {
        var supportsPassive = false;

        /* eslint-disable */
        try {
            var opts = Object.defineProperty({}, "passive", {
                get: function() {
                    supportsPassive = true;
                }
            });

            window.addEventListener("test", null, opts);
        } catch (e) {}
        /* eslint-enable */

        return supportsPassive;
    }

    function getSupportsTouchActionNone() {
        return window.CSS && CSS.supports && CSS.supports("touch-action", "none");
    }

    //endregion

    //region Range Calculation

    // Determine the size of a sub-range in relation to a full range.
    function subRangeRatio(pa, pb) {
        return 100 / (pb - pa);
    }

    // (percentage) How many percent is this value of this range?
    function fromPercentage(range, value) {
        return (value * 100) / (range[1] - range[0]);
    }

    // (percentage) Where is this value on this range?
    function toPercentage(range, value) {
        return fromPercentage(range, range[0] < 0 ? value + Math.abs(range[0]) : value - range[0]);
    }

    // (value) How much is this percentage on this range?
    function isPercentage(range, value) {
        return (value * (range[1] - range[0])) / 100 + range[0];
    }

    function getJ(value, arr) {
        var j = 1;

        while (value >= arr[j]) {
            j += 1;
        }

        return j;
    }

    // (percentage) Input a value, find where, on a scale of 0-100, it applies.
    function toStepping(xVal, xPct, value) {
        if (value >= xVal.slice(-1)[0]) {
            return 100;
        }

        var j = getJ(value, xVal);
        var va = xVal[j - 1];
        var vb = xVal[j];
        var pa = xPct[j - 1];
        var pb = xPct[j];

        return pa + toPercentage([va, vb], value) / subRangeRatio(pa, pb);
    }

    // (value) Input a percentage, find where it is on the specified range.
    function fromStepping(xVal, xPct, value) {
        // There is no range group that fits 100
        if (value >= 100) {
            return xVal.slice(-1)[0];
        }

        var j = getJ(value, xPct);
        var va = xVal[j - 1];
        var vb = xVal[j];
        var pa = xPct[j - 1];
        var pb = xPct[j];

        return isPercentage([va, vb], (value - pa) * subRangeRatio(pa, pb));
    }

    // (percentage) Get the step that applies at a certain value.
    function getStep(xPct, xSteps, snap, value) {
        if (value === 100) {
            return value;
        }

        var j = getJ(value, xPct);
        var a = xPct[j - 1];
        var b = xPct[j];

        // If 'snap' is set, steps are used as fixed points on the slider.
        if (snap) {
            // Find the closest position, a or b.
            if (value - a > (b - a) / 2) {
                return b;
            }

            return a;
        }

        if (!xSteps[j - 1]) {
            return value;
        }

        return xPct[j - 1] + closest(value - xPct[j - 1], xSteps[j - 1]);
    }

    function handleEntryPoint(index, value, that) {
        var percentage;

        // Wrap numerical input in an array.
        if (typeof value === "number") {
            value = [value];
        }

        // Reject any invalid input, by testing whether value is an array.
        if (!Array.isArray(value)) {
            throw new Error("noUiSlider (" + VERSION + "): 'range' contains invalid value.");
        }

        // Covert min/max syntax to 0 and 100.
        if (index === "min") {
            percentage = 0;
        } else if (index === "max") {
            percentage = 100;
        } else {
            percentage = parseFloat(index);
        }

        // Check for correct input.
        if (!isNumeric(percentage) || !isNumeric(value[0])) {
            throw new Error("noUiSlider (" + VERSION + "): 'range' value isn't numeric.");
        }

        // Store values.
        that.xPct.push(percentage);
        that.xVal.push(value[0]);

        // NaN will evaluate to false too, but to keep
        // logging clear, set step explicitly. Make sure
        // not to override the 'step' setting with false.
        if (!percentage) {
            if (!isNaN(value[1])) {
                that.xSteps[0] = value[1];
            }
        } else {
            that.xSteps.push(isNaN(value[1]) ? false : value[1]);
        }

        that.xHighestCompleteStep.push(0);
    }

    function handleStepPoint(i, n, that) {
        // Ignore 'false' stepping.
        if (!n) {
            return;
        }

        // Step over zero-length ranges (#948);
        if (that.xVal[i] === that.xVal[i + 1]) {
            that.xSteps[i] = that.xHighestCompleteStep[i] = that.xVal[i];

            return;
        }

        // Factor to range ratio
        that.xSteps[i] =
            fromPercentage([that.xVal[i], that.xVal[i + 1]], n) / subRangeRatio(that.xPct[i], that.xPct[i + 1]);

        var totalSteps = (that.xVal[i + 1] - that.xVal[i]) / that.xNumSteps[i];
        var highestStep = Math.ceil(Number(totalSteps.toFixed(3)) - 1);
        var step = that.xVal[i] + that.xNumSteps[i] * highestStep;

        that.xHighestCompleteStep[i] = step;
    }

    //endregion

    //region Spectrum

    function Spectrum(entry, snap, singleStep) {
        this.xPct = [];
        this.xVal = [];
        this.xSteps = [singleStep || false];
        this.xNumSteps = [false];
        this.xHighestCompleteStep = [];

        this.snap = snap;

        var index;
        var ordered = []; // [0, 'min'], [1, '50%'], [2, 'max']

        // Map the object keys to an array.
        for (index in entry) {
            if (entry.hasOwnProperty(index)) {
                ordered.push([entry[index], index]);
            }
        }

        // Sort all entries by value (numeric sort).
        if (ordered.length && typeof ordered[0][0] === "object") {
            ordered.sort(function(a, b) {
                return a[0][0] - b[0][0];
            });
        } else {
            ordered.sort(function(a, b) {
                return a[0] - b[0];
            });
        }

        // Convert all entries to subranges.
        for (index = 0; index < ordered.length; index++) {
            handleEntryPoint(ordered[index][1], ordered[index][0], this);
        }

        // Store the actual step values.
        // xSteps is sorted in the same order as xPct and xVal.
        this.xNumSteps = this.xSteps.slice(0);

        // Convert all numeric steps to the percentage of the subrange they represent.
        for (index = 0; index < this.xNumSteps.length; index++) {
            handleStepPoint(index, this.xNumSteps[index], this);
        }
    }

    Spectrum.prototype.getMargin = function(value) {
        var step = this.xNumSteps[0];

        if (step && (value / step) % 1 !== 0) {
            throw new Error("noUiSlider (" + VERSION + "): 'limit', 'margin' and 'padding' must be divisible by step.");
        }

        return this.xPct.length === 2 ? fromPercentage(this.xVal, value) : false;
    };

    Spectrum.prototype.toStepping = function(value) {
        value = toStepping(this.xVal, this.xPct, value);

        return value;
    };

    Spectrum.prototype.fromStepping = function(value) {
        return fromStepping(this.xVal, this.xPct, value);
    };

    Spectrum.prototype.getStep = function(value) {
        value = getStep(this.xPct, this.xSteps, this.snap, value);

        return value;
    };

    Spectrum.prototype.getDefaultStep = function(value, isDown, size) {
        var j = getJ(value, this.xPct);

        // When at the top or stepping down, look at the previous sub-range
        if (value === 100 || (isDown && value === this.xPct[j - 1])) {
            j = Math.max(j - 1, 1);
        }

        return (this.xVal[j] - this.xVal[j - 1]) / size;
    };

    Spectrum.prototype.getNearbySteps = function(value) {
        var j = getJ(value, this.xPct);

        return {
            stepBefore: {
                startValue: this.xVal[j - 2],
                step: this.xNumSteps[j - 2],
                highestStep: this.xHighestCompleteStep[j - 2]
            },
            thisStep: {
                startValue: this.xVal[j - 1],
                step: this.xNumSteps[j - 1],
                highestStep: this.xHighestCompleteStep[j - 1]
            },
            stepAfter: {
                startValue: this.xVal[j],
                step: this.xNumSteps[j],
                highestStep: this.xHighestCompleteStep[j]
            }
        };
    };

    Spectrum.prototype.countStepDecimals = function() {
        var stepDecimals = this.xNumSteps.map(countDecimals);
        return Math.max.apply(null, stepDecimals);
    };

    // Outside testing
    Spectrum.prototype.convert = function(value) {
        return this.getStep(this.toStepping(value));
    };

    //endregion

    //region Options

    /*	Every input option is tested and parsed. This'll prevent
        endless validation in internal methods. These tests are
        structured with an item for every option available. An
        option can be marked as required by setting the 'r' flag.
        The testing function is provided with three arguments:
            - The provided value for the option;
            - A reference to the options object;
            - The name for the option;

        The testing function returns false when an error is detected,
        or true when everything is OK. It can also modify the option
        object, to make sure all values can be correctly looped elsewhere. */

    var defaultFormatter = {
        to: function(value) {
            return value !== undefined && value.toFixed(2);
        },
        from: Number
    };

    function validateFormat(entry) {
        // Any object with a to and from method is supported.
        if (isValidFormatter(entry)) {
            return true;
        }

        throw new Error("noUiSlider (" + VERSION + "): 'format' requires 'to' and 'from' methods.");
    }

    function testStep(parsed, entry) {
        if (!isNumeric(entry)) {
            throw new Error("noUiSlider (" + VERSION + "): 'step' is not numeric.");
        }

        // The step option can still be used to set stepping
        // for linear sliders. Overwritten if set in 'range'.
        parsed.singleStep = entry;
    }

    function testRange(parsed, entry) {
        // Filter incorrect input.
        if (typeof entry !== "object" || Array.isArray(entry)) {
            throw new Error("noUiSlider (" + VERSION + "): 'range' is not an object.");
        }

        // Catch missing start or end.
        if (entry.min === undefined || entry.max === undefined) {
            throw new Error("noUiSlider (" + VERSION + "): Missing 'min' or 'max' in 'range'.");
        }

        // Catch equal start or end.
        if (entry.min === entry.max) {
            throw new Error("noUiSlider (" + VERSION + "): 'range' 'min' and 'max' cannot be equal.");
        }

        parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.singleStep);
    }

    function testStart(parsed, entry) {
        entry = asArray(entry);

        // Validate input. Values aren't tested, as the public .val method
        // will always provide a valid location.
        if (!Array.isArray(entry) || !entry.length) {
            throw new Error("noUiSlider (" + VERSION + "): 'start' option is incorrect.");
        }

        // Store the number of handles.
        parsed.handles = entry.length;

        // When the slider is initialized, the .val method will
        // be called with the start options.
        parsed.start = entry;
    }

    function testSnap(parsed, entry) {
        // Enforce 100% stepping within subranges.
        parsed.snap = entry;

        if (typeof entry !== "boolean") {
            throw new Error("noUiSlider (" + VERSION + "): 'snap' option must be a boolean.");
        }
    }

    function testAnimate(parsed, entry) {
        // Enforce 100% stepping within subranges.
        parsed.animate = entry;

        if (typeof entry !== "boolean") {
            throw new Error("noUiSlider (" + VERSION + "): 'animate' option must be a boolean.");
        }
    }

    function testAnimationDuration(parsed, entry) {
        parsed.animationDuration = entry;

        if (typeof entry !== "number") {
            throw new Error("noUiSlider (" + VERSION + "): 'animationDuration' option must be a number.");
        }
    }

    function testConnect(parsed, entry) {
        var connect = [false];
        var i;

        // Map legacy options
        if (entry === "lower") {
            entry = [true, false];
        } else if (entry === "upper") {
            entry = [false, true];
        }

        // Handle boolean options
        if (entry === true || entry === false) {
            for (i = 1; i < parsed.handles; i++) {
                connect.push(entry);
            }

            connect.push(false);
        }

        // Reject invalid input
        else if (!Array.isArray(entry) || !entry.length || entry.length !== parsed.handles + 1) {
            throw new Error("noUiSlider (" + VERSION + "): 'connect' option doesn't match handle count.");
        } else {
            connect = entry;
        }

        parsed.connect = connect;
    }

    function testOrientation(parsed, entry) {
        // Set orientation to an a numerical value for easy
        // array selection.
        switch (entry) {
            case "horizontal":
                parsed.ort = 0;
                break;
            case "vertical":
                parsed.ort = 1;
                break;
            default:
                throw new Error("noUiSlider (" + VERSION + "): 'orientation' option is invalid.");
        }
    }

    function testMargin(parsed, entry) {
        if (!isNumeric(entry)) {
            throw new Error("noUiSlider (" + VERSION + "): 'margin' option must be numeric.");
        }

        // Issue #582
        if (entry === 0) {
            return;
        }

        parsed.margin = parsed.spectrum.getMargin(entry);

        if (!parsed.margin) {
            throw new Error("noUiSlider (" + VERSION + "): 'margin' option is only supported on linear sliders.");
        }
    }

    function testLimit(parsed, entry) {
        if (!isNumeric(entry)) {
            throw new Error("noUiSlider (" + VERSION + "): 'limit' option must be numeric.");
        }

        parsed.limit = parsed.spectrum.getMargin(entry);

        if (!parsed.limit || parsed.handles < 2) {
            throw new Error(
                "noUiSlider (" +
                    VERSION +
                    "): 'limit' option is only supported on linear sliders with 2 or more handles."
            );
        }
    }

    function testPadding(parsed, entry) {
        if (!isNumeric(entry) && !Array.isArray(entry)) {
            throw new Error(
                "noUiSlider (" + VERSION + "): 'padding' option must be numeric or array of exactly 2 numbers."
            );
        }

        if (Array.isArray(entry) && !(entry.length === 2 || isNumeric(entry[0]) || isNumeric(entry[1]))) {
            throw new Error(
                "noUiSlider (" + VERSION + "): 'padding' option must be numeric or array of exactly 2 numbers."
            );
        }

        if (entry === 0) {
            return;
        }

        if (!Array.isArray(entry)) {
            entry = [entry, entry];
        }

        // 'getMargin' returns false for invalid values.
        parsed.padding = [parsed.spectrum.getMargin(entry[0]), parsed.spectrum.getMargin(entry[1])];

        if (parsed.padding[0] === false || parsed.padding[1] === false) {
            throw new Error("noUiSlider (" + VERSION + "): 'padding' option is only supported on linear sliders.");
        }

        if (parsed.padding[0] < 0 || parsed.padding[1] < 0) {
            throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be a positive number(s).");
        }

        if (parsed.padding[0] + parsed.padding[1] >= 100) {
            throw new Error("noUiSlider (" + VERSION + "): 'padding' option must not exceed 100% of the range.");
        }
    }

    function testDirection(parsed, entry) {
        // Set direction as a numerical value for easy parsing.
        // Invert connection for RTL sliders, so that the proper
        // handles get the connect/background classes.
        switch (entry) {
            case "ltr":
                parsed.dir = 0;
                break;
            case "rtl":
                parsed.dir = 1;
                break;
            default:
                throw new Error("noUiSlider (" + VERSION + "): 'direction' option was not recognized.");
        }
    }

    function testBehaviour(parsed, entry) {
        // Make sure the input is a string.
        if (typeof entry !== "string") {
            throw new Error("noUiSlider (" + VERSION + "): 'behaviour' must be a string containing options.");
        }

        // Check if the string contains any keywords.
        // None are required.
        var tap = entry.indexOf("tap") >= 0;
        var drag = entry.indexOf("drag") >= 0;
        var fixed = entry.indexOf("fixed") >= 0;
        var snap = entry.indexOf("snap") >= 0;
        var hover = entry.indexOf("hover") >= 0;
        var unconstrained = entry.indexOf("unconstrained") >= 0;

        if (fixed) {
            if (parsed.handles !== 2) {
                throw new Error("noUiSlider (" + VERSION + "): 'fixed' behaviour must be used with 2 handles");
            }

            // Use margin to enforce fixed state
            testMargin(parsed, parsed.start[1] - parsed.start[0]);
        }

        if (unconstrained && (parsed.margin || parsed.limit)) {
            throw new Error(
                "noUiSlider (" + VERSION + "): 'unconstrained' behaviour cannot be used with margin or limit"
            );
        }

        parsed.events = {
            tap: tap || snap,
            drag: drag,
            fixed: fixed,
            snap: snap,
            hover: hover,
            unconstrained: unconstrained
        };
    }

    function testTooltips(parsed, entry) {
        if (entry === false) {
            return;
        }

        if (entry === true) {
            parsed.tooltips = [];

            for (var i = 0; i < parsed.handles; i++) {
                parsed.tooltips.push(true);
            }
        } else {
            parsed.tooltips = asArray(entry);

            if (parsed.tooltips.length !== parsed.handles) {
                throw new Error("noUiSlider (" + VERSION + "): must pass a formatter for all handles.");
            }

            parsed.tooltips.forEach(function(formatter) {
                if (
                    typeof formatter !== "boolean" &&
                    (typeof formatter !== "object" || typeof formatter.to !== "function")
                ) {
                    throw new Error("noUiSlider (" + VERSION + "): 'tooltips' must be passed a formatter or 'false'.");
                }
            });
        }
    }

    function testAriaFormat(parsed, entry) {
        parsed.ariaFormat = entry;
        validateFormat(entry);
    }

    function testFormat(parsed, entry) {
        parsed.format = entry;
        validateFormat(entry);
    }

    function testKeyboardSupport(parsed, entry) {
        parsed.keyboardSupport = entry;

        if (typeof entry !== "boolean") {
            throw new Error("noUiSlider (" + VERSION + "): 'keyboardSupport' option must be a boolean.");
        }
    }

    function testDocumentElement(parsed, entry) {
        // This is an advanced option. Passed values are used without validation.
        parsed.documentElement = entry;
    }

    function testCssPrefix(parsed, entry) {
        if (typeof entry !== "string" && entry !== false) {
            throw new Error("noUiSlider (" + VERSION + "): 'cssPrefix' must be a string or `false`.");
        }

        parsed.cssPrefix = entry;
    }

    function testCssClasses(parsed, entry) {
        if (typeof entry !== "object") {
            throw new Error("noUiSlider (" + VERSION + "): 'cssClasses' must be an object.");
        }

        if (typeof parsed.cssPrefix === "string") {
            parsed.cssClasses = {};

            for (var key in entry) {
                if (!entry.hasOwnProperty(key)) {
                    continue;
                }

                parsed.cssClasses[key] = parsed.cssPrefix + entry[key];
            }
        } else {
            parsed.cssClasses = entry;
        }
    }

    // Test all developer settings and parse to assumption-safe values.
    function testOptions(options) {
        // To prove a fix for #537, freeze options here.
        // If the object is modified, an error will be thrown.
        // Object.freeze(options);

        var parsed = {
            margin: 0,
            limit: 0,
            padding: 0,
            animate: true,
            animationDuration: 300,
            ariaFormat: defaultFormatter,
            format: defaultFormatter
        };

        // Tests are executed in the order they are presented here.
        var tests = {
            step: { r: false, t: testStep },
            start: { r: true, t: testStart },
            connect: { r: true, t: testConnect },
            direction: { r: true, t: testDirection },
            snap: { r: false, t: testSnap },
            animate: { r: false, t: testAnimate },
            animationDuration: { r: false, t: testAnimationDuration },
            range: { r: true, t: testRange },
            orientation: { r: false, t: testOrientation },
            margin: { r: false, t: testMargin },
            limit: { r: false, t: testLimit },
            padding: { r: false, t: testPadding },
            behaviour: { r: true, t: testBehaviour },
            ariaFormat: { r: false, t: testAriaFormat },
            format: { r: false, t: testFormat },
            tooltips: { r: false, t: testTooltips },
            keyboardSupport: { r: true, t: testKeyboardSupport },
            documentElement: { r: false, t: testDocumentElement },
            cssPrefix: { r: true, t: testCssPrefix },
            cssClasses: { r: true, t: testCssClasses }
        };

        var defaults = {
            connect: false,
            direction: "ltr",
            behaviour: "tap",
            orientation: "horizontal",
            keyboardSupport: true,
            cssPrefix: "noUi-",
            cssClasses: {
                target: "target",
                base: "base",
                origin: "origin",
                handle: "handle",
                handleLower: "handle-lower",
                handleUpper: "handle-upper",
                touchArea: "touch-area",
                horizontal: "horizontal",
                vertical: "vertical",
                background: "background",
                connect: "connect",
                connects: "connects",
                ltr: "ltr",
                rtl: "rtl",
                draggable: "draggable",
                drag: "state-drag",
                tap: "state-tap",
                active: "active",
                tooltip: "tooltip",
                pips: "pips",
                pipsHorizontal: "pips-horizontal",
                pipsVertical: "pips-vertical",
                marker: "marker",
                markerHorizontal: "marker-horizontal",
                markerVertical: "marker-vertical",
                markerNormal: "marker-normal",
                markerLarge: "marker-large",
                markerSub: "marker-sub",
                value: "value",
                valueHorizontal: "value-horizontal",
                valueVertical: "value-vertical",
                valueNormal: "value-normal",
                valueLarge: "value-large",
                valueSub: "value-sub"
            }
        };

        // AriaFormat defaults to regular format, if any.
        if (options.format && !options.ariaFormat) {
            options.ariaFormat = options.format;
        }

        // Run all options through a testing mechanism to ensure correct
        // input. It should be noted that options might get modified to
        // be handled properly. E.g. wrapping integers in arrays.
        Object.keys(tests).forEach(function(name) {
            // If the option isn't set, but it is required, throw an error.
            if (!isSet(options[name]) && defaults[name] === undefined) {
                if (tests[name].r) {
                    throw new Error("noUiSlider (" + VERSION + "): '" + name + "' is required.");
                }

                return true;
            }

            tests[name].t(parsed, !isSet(options[name]) ? defaults[name] : options[name]);
        });

        // Forward pips options
        parsed.pips = options.pips;

        // All recent browsers accept unprefixed transform.
        // We need -ms- for IE9 and -webkit- for older Android;
        // Assume use of -webkit- if unprefixed and -ms- are not supported.
        // https://caniuse.com/#feat=transforms2d
        var d = document.createElement("div");
        var msPrefix = d.style.msTransform !== undefined;
        var noPrefix = d.style.transform !== undefined;

        parsed.transformRule = noPrefix ? "transform" : msPrefix ? "msTransform" : "webkitTransform";

        // Pips don't move, so we can place them using left/top.
        var styles = [["left", "top"], ["right", "bottom"]];

        parsed.style = styles[parsed.dir][parsed.ort];

        return parsed;
    }

    //endregion

    function scope(target, options, originalOptions) {
        var actions = getActions();
        var supportsTouchActionNone = getSupportsTouchActionNone();
        var supportsPassive = supportsTouchActionNone && getSupportsPassive();

        // All variables local to 'scope' are prefixed with 'scope_'

        // Slider DOM Nodes
        var scope_Target = target;
        var scope_Base;
        var scope_Handles;
        var scope_Connects;
        var scope_Pips;
        var scope_Tooltips;

        // Override for the 'animate' option
        var scope_ShouldAnimate = true;

        // Slider state values
        var scope_Spectrum = options.spectrum;
        var scope_Values = [];
        var scope_Locations = [];
        var scope_HandleNumbers = [];
        var scope_ActiveHandlesCount = 0;
        var scope_Events = {};

        // Exposed API
        var scope_Self;

        // Document Nodes
        var scope_Document = target.ownerDocument;
        var scope_DocumentElement = options.documentElement || scope_Document.documentElement;
        var scope_Body = scope_Document.body;

        // Pips constants
        var PIPS_NONE = -1;
        var PIPS_NO_VALUE = 0;
        var PIPS_LARGE_VALUE = 1;
        var PIPS_SMALL_VALUE = 2;

        // For horizontal sliders in standard ltr documents,
        // make .noUi-origin overflow to the left so the document doesn't scroll.
        var scope_DirOffset = scope_Document.dir === "rtl" || options.ort === 1 ? 0 : 100;

        // Creates a node, adds it to target, returns the new node.
        function addNodeTo(addTarget, className) {
            var div = scope_Document.createElement("div");

            if (className) {
                addClass(div, className);
            }

            addTarget.appendChild(div);

            return div;
        }

        // Append a origin to the base
        function addOrigin(base, handleNumber) {
            var origin = addNodeTo(base, options.cssClasses.origin);
            var handle = addNodeTo(origin, options.cssClasses.handle);

            addNodeTo(handle, options.cssClasses.touchArea);

            handle.setAttribute("data-handle", handleNumber);

            if (options.keyboardSupport) {
                // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
                // 0 = focusable and reachable
                handle.setAttribute("tabindex", "0");
                handle.addEventListener("keydown", function(event) {
                    return eventKeydown(event, handleNumber);
                });
            }

            handle.setAttribute("role", "slider");
            handle.setAttribute("aria-orientation", options.ort ? "vertical" : "horizontal");

            if (handleNumber === 0) {
                addClass(handle, options.cssClasses.handleLower);
            } else if (handleNumber === options.handles - 1) {
                addClass(handle, options.cssClasses.handleUpper);
            }

            return origin;
        }

        // Insert nodes for connect elements
        function addConnect(base, add) {
            if (!add) {
                return false;
            }

            return addNodeTo(base, options.cssClasses.connect);
        }

        // Add handles to the slider base.
        function addElements(connectOptions, base) {
            var connectBase = addNodeTo(base, options.cssClasses.connects);

            scope_Handles = [];
            scope_Connects = [];

            scope_Connects.push(addConnect(connectBase, connectOptions[0]));

            // [::::O====O====O====]
            // connectOptions = [0, 1, 1, 1]

            for (var i = 0; i < options.handles; i++) {
                // Keep a list of all added handles.
                scope_Handles.push(addOrigin(base, i));
                scope_HandleNumbers[i] = i;
                scope_Connects.push(addConnect(connectBase, connectOptions[i + 1]));
            }
        }

        // Initialize a single slider.
        function addSlider(addTarget) {
            // Apply classes and data to the target.
            addClass(addTarget, options.cssClasses.target);

            if (options.dir === 0) {
                addClass(addTarget, options.cssClasses.ltr);
            } else {
                addClass(addTarget, options.cssClasses.rtl);
            }

            if (options.ort === 0) {
                addClass(addTarget, options.cssClasses.horizontal);
            } else {
                addClass(addTarget, options.cssClasses.vertical);
            }

            return addNodeTo(addTarget, options.cssClasses.base);
        }

        function addTooltip(handle, handleNumber) {
            if (!options.tooltips[handleNumber]) {
                return false;
            }

            return addNodeTo(handle.firstChild, options.cssClasses.tooltip);
        }

        // Disable the slider dragging if any handle is disabled
        function isHandleDisabled(handleNumber) {
            var handleOrigin = scope_Handles[handleNumber];
            return handleOrigin.hasAttribute("disabled");
        }

        function removeTooltips() {
            if (scope_Tooltips) {
                removeEvent("update.tooltips");
                scope_Tooltips.forEach(function(tooltip) {
                    if (tooltip) {
                        removeElement(tooltip);
                    }
                });
                scope_Tooltips = null;
            }
        }

        // The tooltips option is a shorthand for using the 'update' event.
        function tooltips() {
            removeTooltips();

            // Tooltips are added with options.tooltips in original order.
            scope_Tooltips = scope_Handles.map(addTooltip);

            bindEvent("update.tooltips", function(values, handleNumber, unencoded) {
                if (!scope_Tooltips[handleNumber]) {
                    return;
                }

                var formattedValue = values[handleNumber];

                if (options.tooltips[handleNumber] !== true) {
                    formattedValue = options.tooltips[handleNumber].to(unencoded[handleNumber]);
                }

                scope_Tooltips[handleNumber].innerHTML = formattedValue;
            });
        }

        function aria() {
            bindEvent("update", function(values, handleNumber, unencoded, tap, positions) {
                // Update Aria Values for all handles, as a change in one changes min and max values for the next.
                scope_HandleNumbers.forEach(function(index) {
                    var handle = scope_Handles[index];

                    var min = checkHandlePosition(scope_Locations, index, 0, true, true, true);
                    var max = checkHandlePosition(scope_Locations, index, 100, true, true, true);

                    var now = positions[index];

                    // Formatted value for display
                    var text = options.ariaFormat.to(unencoded[index]);

                    // Map to slider range values
                    min = scope_Spectrum.fromStepping(min).toFixed(1);
                    max = scope_Spectrum.fromStepping(max).toFixed(1);
                    now = scope_Spectrum.fromStepping(now).toFixed(1);

                    handle.children[0].setAttribute("aria-valuemin", min);
                    handle.children[0].setAttribute("aria-valuemax", max);
                    handle.children[0].setAttribute("aria-valuenow", now);
                    handle.children[0].setAttribute("aria-valuetext", text);
                });
            });
        }

        function getGroup(mode, values, stepped) {
            // Use the range.
            if (mode === "range" || mode === "steps") {
                return scope_Spectrum.xVal;
            }

            if (mode === "count") {
                if (values < 2) {
                    throw new Error("noUiSlider (" + VERSION + "): 'values' (>= 2) required for mode 'count'.");
                }

                // Divide 0 - 100 in 'count' parts.
                var interval = values - 1;
                var spread = 100 / interval;

                values = [];

                // List these parts and have them handled as 'positions'.
                while (interval--) {
                    values[interval] = interval * spread;
                }

                values.push(100);

                mode = "positions";
            }

            if (mode === "positions") {
                // Map all percentages to on-range values.
                return values.map(function(value) {
                    return scope_Spectrum.fromStepping(stepped ? scope_Spectrum.getStep(value) : value);
                });
            }

            if (mode === "values") {
                // If the value must be stepped, it needs to be converted to a percentage first.
                if (stepped) {
                    return values.map(function(value) {
                        // Convert to percentage, apply step, return to value.
                        return scope_Spectrum.fromStepping(scope_Spectrum.getStep(scope_Spectrum.toStepping(value)));
                    });
                }

                // Otherwise, we can simply use the values.
                return values;
            }
        }

        function generateSpread(density, mode, group) {
            function safeIncrement(value, increment) {
                // Avoid floating point variance by dropping the smallest decimal places.
                return (value + increment).toFixed(7) / 1;
            }

            var indexes = {};
            var firstInRange = scope_Spectrum.xVal[0];
            var lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length - 1];
            var ignoreFirst = false;
            var ignoreLast = false;
            var prevPct = 0;

            // Create a copy of the group, sort it and filter away all duplicates.
            group = unique(
                group.slice().sort(function(a, b) {
                    return a - b;
                })
            );

            // Make sure the range starts with the first element.
            if (group[0] !== firstInRange) {
                group.unshift(firstInRange);
                ignoreFirst = true;
            }

            // Likewise for the last one.
            if (group[group.length - 1] !== lastInRange) {
                group.push(lastInRange);
                ignoreLast = true;
            }

            group.forEach(function(current, index) {
                // Get the current step and the lower + upper positions.
                var step;
                var i;
                var q;
                var low = current;
                var high = group[index + 1];
                var newPct;
                var pctDifference;
                var pctPos;
                var type;
                var steps;
                var realSteps;
                var stepSize;
                var isSteps = mode === "steps";

                // When using 'steps' mode, use the provided steps.
                // Otherwise, we'll step on to the next subrange.
                if (isSteps) {
                    step = scope_Spectrum.xNumSteps[index];
                }

                // Default to a 'full' step.
                if (!step) {
                    step = high - low;
                }

                // Low can be 0, so test for false. If high is undefined,
                // we are at the last subrange. Index 0 is already handled.
                if (low === false || high === undefined) {
                    return;
                }

                // Make sure step isn't 0, which would cause an infinite loop (#654)
                step = Math.max(step, 0.0000001);

                // Find all steps in the subrange.
                for (i = low; i <= high; i = safeIncrement(i, step)) {
                    // Get the percentage value for the current step,
                    // calculate the size for the subrange.
                    newPct = scope_Spectrum.toStepping(i);
                    pctDifference = newPct - prevPct;

                    steps = pctDifference / density;
                    realSteps = Math.round(steps);

                    // This ratio represents the amount of percentage-space a point indicates.
                    // For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-divided.
                    // Round the percentage offset to an even number, then divide by two
                    // to spread the offset on both sides of the range.
                    stepSize = pctDifference / realSteps;

                    // Divide all points evenly, adding the correct number to this subrange.
                    // Run up to <= so that 100% gets a point, event if ignoreLast is set.
                    for (q = 1; q <= realSteps; q += 1) {
                        // The ratio between the rounded value and the actual size might be ~1% off.
                        // Correct the percentage offset by the number of points
                        // per subrange. density = 1 will result in 100 points on the
                        // full range, 2 for 50, 4 for 25, etc.
                        pctPos = prevPct + q * stepSize;
                        indexes[pctPos.toFixed(5)] = [scope_Spectrum.fromStepping(pctPos), 0];
                    }

                    // Determine the point type.
                    type = group.indexOf(i) > -1 ? PIPS_LARGE_VALUE : isSteps ? PIPS_SMALL_VALUE : PIPS_NO_VALUE;

                    // Enforce the 'ignoreFirst' option by overwriting the type for 0.
                    if (!index && ignoreFirst) {
                        type = 0;
                    }

                    if (!(i === high && ignoreLast)) {
                        // Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
                        indexes[newPct.toFixed(5)] = [i, type];
                    }

                    // Update the percentage count.
                    prevPct = newPct;
                }
            });

            return indexes;
        }

        function addMarking(spread, filterFunc, formatter) {
            var element = scope_Document.createElement("div");

            var valueSizeClasses = [];
            valueSizeClasses[PIPS_NO_VALUE] = options.cssClasses.valueNormal;
            valueSizeClasses[PIPS_LARGE_VALUE] = options.cssClasses.valueLarge;
            valueSizeClasses[PIPS_SMALL_VALUE] = options.cssClasses.valueSub;

            var markerSizeClasses = [];
            markerSizeClasses[PIPS_NO_VALUE] = options.cssClasses.markerNormal;
            markerSizeClasses[PIPS_LARGE_VALUE] = options.cssClasses.markerLarge;
            markerSizeClasses[PIPS_SMALL_VALUE] = options.cssClasses.markerSub;

            var valueOrientationClasses = [options.cssClasses.valueHorizontal, options.cssClasses.valueVertical];
            var markerOrientationClasses = [options.cssClasses.markerHorizontal, options.cssClasses.markerVertical];

            addClass(element, options.cssClasses.pips);
            addClass(element, options.ort === 0 ? options.cssClasses.pipsHorizontal : options.cssClasses.pipsVertical);

            function getClasses(type, source) {
                var a = source === options.cssClasses.value;
                var orientationClasses = a ? valueOrientationClasses : markerOrientationClasses;
                var sizeClasses = a ? valueSizeClasses : markerSizeClasses;

                return source + " " + orientationClasses[options.ort] + " " + sizeClasses[type];
            }

            function addSpread(offset, value, type) {
                // Apply the filter function, if it is set.
                type = filterFunc ? filterFunc(value, type) : type;

                if (type === PIPS_NONE) {
                    return;
                }

                // Add a marker for every point
                var node = addNodeTo(element, false);
                node.className = getClasses(type, options.cssClasses.marker);
                node.style[options.style] = offset + "%";

                // Values are only appended for points marked '1' or '2'.
                if (type > PIPS_NO_VALUE) {
                    node = addNodeTo(element, false);
                    node.className = getClasses(type, options.cssClasses.value);
                    node.setAttribute("data-value", value);
                    node.style[options.style] = offset + "%";
                    node.innerHTML = formatter.to(value);
                }
            }

            // Append all points.
            Object.keys(spread).forEach(function(offset) {
                addSpread(offset, spread[offset][0], spread[offset][1]);
            });

            return element;
        }

        function removePips() {
            if (scope_Pips) {
                removeElement(scope_Pips);
                scope_Pips = null;
            }
        }

        function pips(grid) {
            // Fix #669
            removePips();

            var mode = grid.mode;
            var density = grid.density || 1;
            var filter = grid.filter || false;
            var values = grid.values || false;
            var stepped = grid.stepped || false;
            var group = getGroup(mode, values, stepped);
            var spread = generateSpread(density, mode, group);
            var format = grid.format || {
                to: Math.round
            };

            scope_Pips = scope_Target.appendChild(addMarking(spread, filter, format));

            return scope_Pips;
        }

        // Shorthand for base dimensions.
        function baseSize() {
            var rect = scope_Base.getBoundingClientRect();
            var alt = "offset" + ["Width", "Height"][options.ort];
            return options.ort === 0 ? rect.width || scope_Base[alt] : rect.height || scope_Base[alt];
        }

        // Handler for attaching events trough a proxy.
        function attachEvent(events, element, callback, data) {
            // This function can be used to 'filter' events to the slider.
            // element is a node, not a nodeList

            var method = function(e) {
                e = fixEvent(e, data.pageOffset, data.target || element);

                // fixEvent returns false if this event has a different target
                // when handling (multi-) touch events;
                if (!e) {
                    return false;
                }

                // doNotReject is passed by all end events to make sure released touches
                // are not rejected, leaving the slider "stuck" to the cursor;
                if (scope_Target.hasAttribute("disabled") && !data.doNotReject) {
                    return false;
                }

                // Stop if an active 'tap' transition is taking place.
                if (hasClass(scope_Target, options.cssClasses.tap) && !data.doNotReject) {
                    return false;
                }

                // Ignore right or middle clicks on start #454
                if (events === actions.start && e.buttons !== undefined && e.buttons > 1) {
                    return false;
                }

                // Ignore right or middle clicks on start #454
                if (data.hover && e.buttons) {
                    return false;
                }

                // 'supportsPassive' is only true if a browser also supports touch-action: none in CSS.
                // iOS safari does not, so it doesn't get to benefit from passive scrolling. iOS does support
                // touch-action: manipulation, but that allows panning, which breaks
                // sliders after zooming/on non-responsive pages.
                // See: https://bugs.webkit.org/show_bug.cgi?id=133112
                if (!supportsPassive) {
                    e.preventDefault();
                }

                e.calcPoint = e.points[options.ort];

                // Call the event handler with the event [ and additional data ].
                callback(e, data);
            };

            var methods = [];

            // Bind a closure on the target for every event type.
            events.split(" ").forEach(function(eventName) {
                element.addEventListener(eventName, method, supportsPassive ? { passive: true } : false);
                methods.push([eventName, method]);
            });

            return methods;
        }

        // Provide a clean event with standardized offset values.
        function fixEvent(e, pageOffset, eventTarget) {
            // Filter the event to register the type, which can be
            // touch, mouse or pointer. Offset changes need to be
            // made on an event specific basis.
            var touch = e.type.indexOf("touch") === 0;
            var mouse = e.type.indexOf("mouse") === 0;
            var pointer = e.type.indexOf("pointer") === 0;

            var x;
            var y;

            // IE10 implemented pointer events with a prefix;
            if (e.type.indexOf("MSPointer") === 0) {
                pointer = true;
            }

            // The only thing one handle should be concerned about is the touches that originated on top of it.
            if (touch) {
                // Returns true if a touch originated on the target.
                var isTouchOnTarget = function(checkTouch) {
                    return checkTouch.target === eventTarget || eventTarget.contains(checkTouch.target);
                };

                // In the case of touchstart events, we need to make sure there is still no more than one
                // touch on the target so we look amongst all touches.
                if (e.type === "touchstart") {
                    var targetTouches = Array.prototype.filter.call(e.touches, isTouchOnTarget);

                    // Do not support more than one touch per handle.
                    if (targetTouches.length > 1) {
                        return false;
                    }

                    x = targetTouches[0].pageX;
                    y = targetTouches[0].pageY;
                } else {
                    // In the other cases, find on changedTouches is enough.
                    var targetTouch = Array.prototype.find.call(e.changedTouches, isTouchOnTarget);

                    // Cancel if the target touch has not moved.
                    if (!targetTouch) {
                        return false;
                    }

                    x = targetTouch.pageX;
                    y = targetTouch.pageY;
                }
            }

            pageOffset = pageOffset || getPageOffset(scope_Document);

            if (mouse || pointer) {
                x = e.clientX + pageOffset.x;
                y = e.clientY + pageOffset.y;
            }

            e.pageOffset = pageOffset;
            e.points = [x, y];
            e.cursor = mouse || pointer; // Fix #435

            return e;
        }

        // Translate a coordinate in the document to a percentage on the slider
        function calcPointToPercentage(calcPoint) {
            var location = calcPoint - offset(scope_Base, options.ort);
            var proposal = (location * 100) / baseSize();

            // Clamp proposal between 0% and 100%
            // Out-of-bound coordinates may occur when .noUi-base pseudo-elements
            // are used (e.g. contained handles feature)
            proposal = limit(proposal);

            return options.dir ? 100 - proposal : proposal;
        }

        // Find handle closest to a certain percentage on the slider
        function getClosestHandle(proposal) {
            var closest = 100;
            var handleNumber = false;

            scope_Handles.forEach(function(handle, index) {
                // Disabled handles are ignored
                if (isHandleDisabled(index)) {
                    return;
                }

                var pos = Math.abs(scope_Locations[index] - proposal);

                if (pos < closest || (pos === 100 && closest === 100)) {
                    handleNumber = index;
                    closest = pos;
                }
            });

            return handleNumber;
        }

        // Fire 'end' when a mouse or pen leaves the document.
        function documentLeave(event, data) {
            if (event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null) {
                eventEnd(event, data);
            }
        }

        // Handle movement on document for handle and range drag.
        function eventMove(event, data) {
            // Fix #498
            // Check value of .buttons in 'start' to work around a bug in IE10 mobile (data.buttonsProperty).
            // https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
            // IE9 has .buttons and .which zero on mousemove.
            // Firefox breaks the spec MDN defines.
            if (navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0) {
                return eventEnd(event, data);
            }

            // Check if we are moving up or down
            var movement = (options.dir ? -1 : 1) * (event.calcPoint - data.startCalcPoint);

            // Convert the movement into a percentage of the slider width/height
            var proposal = (movement * 100) / data.baseSize;

            moveHandles(movement > 0, proposal, data.locations, data.handleNumbers);
        }

        // Unbind move events on document, call callbacks.
        function eventEnd(event, data) {
            // The handle is no longer active, so remove the class.
            if (data.handle) {
                removeClass(data.handle, options.cssClasses.active);
                scope_ActiveHandlesCount -= 1;
            }

            // Unbind the move and end events, which are added on 'start'.
            data.listeners.forEach(function(c) {
                scope_DocumentElement.removeEventListener(c[0], c[1]);
            });

            if (scope_ActiveHandlesCount === 0) {
                // Remove dragging class.
                removeClass(scope_Target, options.cssClasses.drag);
                setZindex();

                // Remove cursor styles and text-selection events bound to the body.
                if (event.cursor) {
                    scope_Body.style.cursor = "";
                    scope_Body.removeEventListener("selectstart", preventDefault);
                }
            }

            data.handleNumbers.forEach(function(handleNumber) {
                fireEvent("change", handleNumber);
                fireEvent("set", handleNumber);
                fireEvent("end", handleNumber);
            });
        }

        // Bind move events on document.
        function eventStart(event, data) {
            // Ignore event if any handle is disabled
            if (data.handleNumbers.some(isHandleDisabled)) {
                return false;
            }

            var handle;

            if (data.handleNumbers.length === 1) {
                var handleOrigin = scope_Handles[data.handleNumbers[0]];

                handle = handleOrigin.children[0];
                scope_ActiveHandlesCount += 1;

                // Mark the handle as 'active' so it can be styled.
                addClass(handle, options.cssClasses.active);
            }

            // A drag should never propagate up to the 'tap' event.
            event.stopPropagation();

            // Record the event listeners.
            var listeners = [];

            // Attach the move and end events.
            var moveEvent = attachEvent(actions.move, scope_DocumentElement, eventMove, {
                // The event target has changed so we need to propagate the original one so that we keep
                // relying on it to extract target touches.
                target: event.target,
                handle: handle,
                listeners: listeners,
                startCalcPoint: event.calcPoint,
                baseSize: baseSize(),
                pageOffset: event.pageOffset,
                handleNumbers: data.handleNumbers,
                buttonsProperty: event.buttons,
                locations: scope_Locations.slice()
            });

            var endEvent = attachEvent(actions.end, scope_DocumentElement, eventEnd, {
                target: event.target,
                handle: handle,
                listeners: listeners,
                doNotReject: true,
                handleNumbers: data.handleNumbers
            });

            var outEvent = attachEvent("mouseout", scope_DocumentElement, documentLeave, {
                target: event.target,
                handle: handle,
                listeners: listeners,
                doNotReject: true,
                handleNumbers: data.handleNumbers
            });

            // We want to make sure we pushed the listeners in the listener list rather than creating
            // a new one as it has already been passed to the event handlers.
            listeners.push.apply(listeners, moveEvent.concat(endEvent, outEvent));

            // Text selection isn't an issue on touch devices,
            // so adding cursor styles can be skipped.
            if (event.cursor) {
                // Prevent the 'I' cursor and extend the range-drag cursor.
                scope_Body.style.cursor = getComputedStyle(event.target).cursor;

                // Mark the target with a dragging state.
                if (scope_Handles.length > 1) {
                    addClass(scope_Target, options.cssClasses.drag);
                }

                // Prevent text selection when dragging the handles.
                // In noUiSlider <= 9.2.0, this was handled by calling preventDefault on mouse/touch start/move,
                // which is scroll blocking. The selectstart event is supported by FireFox starting from version 52,
                // meaning the only holdout is iOS Safari. This doesn't matter: text selection isn't triggered there.
                // The 'cursor' flag is false.
                // See: http://caniuse.com/#search=selectstart
                scope_Body.addEventListener("selectstart", preventDefault, false);
            }

            data.handleNumbers.forEach(function(handleNumber) {
                fireEvent("start", handleNumber);
            });
        }

        // Move closest handle to tapped location.
        function eventTap(event) {
            // The tap event shouldn't propagate up
            event.stopPropagation();

            var proposal = calcPointToPercentage(event.calcPoint);
            var handleNumber = getClosestHandle(proposal);

            // Tackle the case that all handles are 'disabled'.
            if (handleNumber === false) {
                return false;
            }

            // Flag the slider as it is now in a transitional state.
            // Transition takes a configurable amount of ms (default 300). Re-enable the slider after that.
            if (!options.events.snap) {
                addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
            }

            setHandle(handleNumber, proposal, true, true);

            setZindex();

            fireEvent("slide", handleNumber, true);
            fireEvent("update", handleNumber, true);
            fireEvent("change", handleNumber, true);
            fireEvent("set", handleNumber, true);

            if (options.events.snap) {
                eventStart(event, { handleNumbers: [handleNumber] });
            }
        }

        // Fires a 'hover' event for a hovered mouse/pen position.
        function eventHover(event) {
            var proposal = calcPointToPercentage(event.calcPoint);

            var to = scope_Spectrum.getStep(proposal);
            var value = scope_Spectrum.fromStepping(to);

            Object.keys(scope_Events).forEach(function(targetEvent) {
                if ("hover" === targetEvent.split(".")[0]) {
                    scope_Events[targetEvent].forEach(function(callback) {
                        callback.call(scope_Self, value);
                    });
                }
            });
        }

        // Handles keydown on focused handles
        // Don't move the document when pressing arrow keys on focused handles
        function eventKeydown(event, handleNumber) {
            if (isHandleDisabled(handleNumber)) {
                return false;
            }

            var horizontalKeys = ["Left", "Right"];
            var verticalKeys = ["Down", "Up"];

            if (options.dir && !options.ort) {
                // On an right-to-left slider, the left and right keys act inverted
                horizontalKeys.reverse();
            } else if (options.ort && !options.dir) {
                // On a top-to-bottom slider, the up and down keys act inverted
                verticalKeys.reverse();
            }

            // Strip "Arrow" for IE compatibility. https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
            var key = event.key.replace("Arrow", "");
            var isDown = key === verticalKeys[0] || key === horizontalKeys[0];
            var isUp = key === verticalKeys[1] || key === horizontalKeys[1];

            if (!isDown && !isUp) {
                return true;
            }

            event.preventDefault();

            var direction = isDown ? 0 : 1;
            var steps = getNextStepsForHandle(handleNumber);
            var step = steps[direction];

            // At the edge of a slider, do nothing
            if (step === null) {
                return false;
            }

            // No step set, use the default of 10% of the sub-range
            if (step === false) {
                step = scope_Spectrum.getDefaultStep(scope_Locations[handleNumber], isDown, 10);
            }

            // Step over zero-length ranges (#948);
            step = Math.max(step, 0.0000001);

            // Decrement for down steps
            step = (isDown ? -1 : 1) * step;

            scope_ShouldAnimate = false;

            valueSetHandle(handleNumber, scope_Values[handleNumber] + step, true);

            scope_ShouldAnimate = true;

            return false;
        }

        // Attach events to several slider parts.
        function bindSliderEvents(behaviour) {
            // Attach the standard drag event to the handles.
            if (!behaviour.fixed) {
                scope_Handles.forEach(function(handle, index) {
                    // These events are only bound to the visual handle
                    // element, not the 'real' origin element.
                    attachEvent(actions.start, handle.children[0], eventStart, {
                        handleNumbers: [index]
                    });
                });
            }

            // Attach the tap event to the slider base.
            if (behaviour.tap) {
                attachEvent(actions.start, scope_Base, eventTap, {});
            }

            // Fire hover events
            if (behaviour.hover) {
                attachEvent(actions.move, scope_Base, eventHover, {
                    hover: true
                });
            }

            // Make the range draggable.
            if (behaviour.drag) {
                scope_Connects.forEach(function(connect, index) {
                    if (connect === false || index === 0 || index === scope_Connects.length - 1) {
                        return;
                    }

                    var handleBefore = scope_Handles[index - 1];
                    var handleAfter = scope_Handles[index];
                    var eventHolders = [connect];

                    addClass(connect, options.cssClasses.draggable);

                    // When the range is fixed, the entire range can
                    // be dragged by the handles. The handle in the first
                    // origin will propagate the start event upward,
                    // but it needs to be bound manually on the other.
                    if (behaviour.fixed) {
                        eventHolders.push(handleBefore.children[0]);
                        eventHolders.push(handleAfter.children[0]);
                    }

                    eventHolders.forEach(function(eventHolder) {
                        attachEvent(actions.start, eventHolder, eventStart, {
                            handles: [handleBefore, handleAfter],
                            handleNumbers: [index - 1, index]
                        });
                    });
                });
            }
        }

        // Attach an event to this slider, possibly including a namespace
        function bindEvent(namespacedEvent, callback) {
            scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
            scope_Events[namespacedEvent].push(callback);

            // If the event bound is 'update,' fire it immediately for all handles.
            if (namespacedEvent.split(".")[0] === "update") {
                scope_Handles.forEach(function(a, index) {
                    fireEvent("update", index);
                });
            }
        }

        // Undo attachment of event
        function removeEvent(namespacedEvent) {
            var event = namespacedEvent && namespacedEvent.split(".")[0];
            var namespace = event && namespacedEvent.substring(event.length);

            Object.keys(scope_Events).forEach(function(bind) {
                var tEvent = bind.split(".")[0];
                var tNamespace = bind.substring(tEvent.length);

                if ((!event || event === tEvent) && (!namespace || namespace === tNamespace)) {
                    delete scope_Events[bind];
                }
            });
        }

        // External event handling
        function fireEvent(eventName, handleNumber, tap) {
            Object.keys(scope_Events).forEach(function(targetEvent) {
                var eventType = targetEvent.split(".")[0];

                if (eventName === eventType) {
                    scope_Events[targetEvent].forEach(function(callback) {
                        callback.call(
                            // Use the slider public API as the scope ('this')
                            scope_Self,
                            // Return values as array, so arg_1[arg_2] is always valid.
                            scope_Values.map(options.format.to),
                            // Handle index, 0 or 1
                            handleNumber,
                            // Un-formatted slider values
                            scope_Values.slice(),
                            // Event is fired by tap, true or false
                            tap || false,
                            // Left offset of the handle, in relation to the slider
                            scope_Locations.slice()
                        );
                    });
                }
            });
        }

        // Split out the handle positioning logic so the Move event can use it, too
        function checkHandlePosition(reference, handleNumber, to, lookBackward, lookForward, getValue) {
            // For sliders with multiple handles, limit movement to the other handle.
            // Apply the margin option by adding it to the handle positions.
            if (scope_Handles.length > 1 && !options.events.unconstrained) {
                if (lookBackward && handleNumber > 0) {
                    to = Math.max(to, reference[handleNumber - 1] + options.margin);
                }

                if (lookForward && handleNumber < scope_Handles.length - 1) {
                    to = Math.min(to, reference[handleNumber + 1] - options.margin);
                }
            }

            // The limit option has the opposite effect, limiting handles to a
            // maximum distance from another. Limit must be > 0, as otherwise
            // handles would be unmovable.
            if (scope_Handles.length > 1 && options.limit) {
                if (lookBackward && handleNumber > 0) {
                    to = Math.min(to, reference[handleNumber - 1] + options.limit);
                }

                if (lookForward && handleNumber < scope_Handles.length - 1) {
                    to = Math.max(to, reference[handleNumber + 1] - options.limit);
                }
            }

            // The padding option keeps the handles a certain distance from the
            // edges of the slider. Padding must be > 0.
            if (options.padding) {
                if (handleNumber === 0) {
                    to = Math.max(to, options.padding[0]);
                }

                if (handleNumber === scope_Handles.length - 1) {
                    to = Math.min(to, 100 - options.padding[1]);
                }
            }

            to = scope_Spectrum.getStep(to);

            // Limit percentage to the 0 - 100 range
            to = limit(to);

            // Return false if handle can't move
            if (to === reference[handleNumber] && !getValue) {
                return false;
            }

            return to;
        }

        // Uses slider orientation to create CSS rules. a = base value;
        function inRuleOrder(v, a) {
            var o = options.ort;
            return (o ? a : v) + ", " + (o ? v : a);
        }

        // Moves handle(s) by a percentage
        // (bool, % to move, [% where handle started, ...], [index in scope_Handles, ...])
        function moveHandles(upward, proposal, locations, handleNumbers) {
            var proposals = locations.slice();

            var b = [!upward, upward];
            var f = [upward, !upward];

            // Copy handleNumbers so we don't change the dataset
            handleNumbers = handleNumbers.slice();

            // Check to see which handle is 'leading'.
            // If that one can't move the second can't either.
            if (upward) {
                handleNumbers.reverse();
            }

            // Step 1: get the maximum percentage that any of the handles can move
            if (handleNumbers.length > 1) {
                handleNumbers.forEach(function(handleNumber, o) {
                    var to = checkHandlePosition(
                        proposals,
                        handleNumber,
                        proposals[handleNumber] + proposal,
                        b[o],
                        f[o],
                        false
                    );

                    // Stop if one of the handles can't move.
                    if (to === false) {
                        proposal = 0;
                    } else {
                        proposal = to - proposals[handleNumber];
                        proposals[handleNumber] = to;
                    }
                });
            }

            // If using one handle, check backward AND forward
            else {
                b = f = [true];
            }

            var state = false;

            // Step 2: Try to set the handles with the found percentage
            handleNumbers.forEach(function(handleNumber, o) {
                state = setHandle(handleNumber, locations[handleNumber] + proposal, b[o], f[o]) || state;
            });

            // Step 3: If a handle moved, fire events
            if (state) {
                handleNumbers.forEach(function(handleNumber) {
                    fireEvent("update", handleNumber);
                    fireEvent("slide", handleNumber);
                });
            }
        }

        // Takes a base value and an offset. This offset is used for the connect bar size.
        // In the initial design for this feature, the origin element was 1% wide.
        // Unfortunately, a rounding bug in Chrome makes it impossible to implement this feature
        // in this manner: https://bugs.chromium.org/p/chromium/issues/detail?id=798223
        function transformDirection(a, b) {
            return options.dir ? 100 - a - b : a;
        }

        // Updates scope_Locations and scope_Values, updates visual state
        function updateHandlePosition(handleNumber, to) {
            // Update locations.
            scope_Locations[handleNumber] = to;

            // Convert the value to the slider stepping/range.
            scope_Values[handleNumber] = scope_Spectrum.fromStepping(to);

            var rule = "translate(" + inRuleOrder(transformDirection(to, 0) - scope_DirOffset + "%", "0") + ")";
            scope_Handles[handleNumber].style[options.transformRule] = rule;

            updateConnect(handleNumber);
            updateConnect(handleNumber + 1);
        }

        // Handles before the slider middle are stacked later = higher,
        // Handles after the middle later is lower
        // [[7] [8] .......... | .......... [5] [4]
        function setZindex() {
            scope_HandleNumbers.forEach(function(handleNumber) {
                var dir = scope_Locations[handleNumber] > 50 ? -1 : 1;
                var zIndex = 3 + (scope_Handles.length + dir * handleNumber);
                scope_Handles[handleNumber].style.zIndex = zIndex;
            });
        }

        // Test suggested values and apply margin, step.
        function setHandle(handleNumber, to, lookBackward, lookForward) {
            to = checkHandlePosition(scope_Locations, handleNumber, to, lookBackward, lookForward, false);

            if (to === false) {
                return false;
            }

            updateHandlePosition(handleNumber, to);

            return true;
        }

        // Updates style attribute for connect nodes
        function updateConnect(index) {
            // Skip connects set to false
            if (!scope_Connects[index]) {
                return;
            }

            var l = 0;
            var h = 100;

            if (index !== 0) {
                l = scope_Locations[index - 1];
            }

            if (index !== scope_Connects.length - 1) {
                h = scope_Locations[index];
            }

            // We use two rules:
            // 'translate' to change the left/top offset;
            // 'scale' to change the width of the element;
            // As the element has a width of 100%, a translation of 100% is equal to 100% of the parent (.noUi-base)
            var connectWidth = h - l;
            var translateRule = "translate(" + inRuleOrder(transformDirection(l, connectWidth) + "%", "0") + ")";
            var scaleRule = "scale(" + inRuleOrder(connectWidth / 100, "1") + ")";

            scope_Connects[index].style[options.transformRule] = translateRule + " " + scaleRule;
        }

        // Parses value passed to .set method. Returns current value if not parse-able.
        function resolveToValue(to, handleNumber) {
            // Setting with null indicates an 'ignore'.
            // Inputting 'false' is invalid.
            if (to === null || to === false || to === undefined) {
                return scope_Locations[handleNumber];
            }

            // If a formatted number was passed, attempt to decode it.
            if (typeof to === "number") {
                to = String(to);
            }

            to = options.format.from(to);
            to = scope_Spectrum.toStepping(to);

            // If parsing the number failed, use the current value.
            if (to === false || isNaN(to)) {
                return scope_Locations[handleNumber];
            }

            return to;
        }

        // Set the slider value.
        function valueSet(input, fireSetEvent) {
            var values = asArray(input);
            var isInit = scope_Locations[0] === undefined;

            // Event fires by default
            fireSetEvent = fireSetEvent === undefined ? true : !!fireSetEvent;

            // Animation is optional.
            // Make sure the initial values were set before using animated placement.
            if (options.animate && !isInit && scope_ShouldAnimate) {
                addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
            }

            // First pass, without lookAhead but with lookBackward. Values are set from left to right.
            scope_HandleNumbers.forEach(function(handleNumber) {
                setHandle(handleNumber, resolveToValue(values[handleNumber], handleNumber), true, false);
            });

            // Second pass. Now that all base values are set, apply constraints
            scope_HandleNumbers.forEach(function(handleNumber) {
                setHandle(handleNumber, scope_Locations[handleNumber], true, true);
            });

            setZindex();

            scope_HandleNumbers.forEach(function(handleNumber) {
                fireEvent("update", handleNumber);

                // Fire the event only for handles that received a new value, as per #579
                if (values[handleNumber] !== null && fireSetEvent) {
                    fireEvent("set", handleNumber);
                }
            });
        }

        // Reset slider to initial values
        function valueReset(fireSetEvent) {
            valueSet(options.start, fireSetEvent);
        }

        // Set value for a single handle
        function valueSetHandle(handleNumber, value, fireSetEvent) {
            var values = [];

            // Ensure numeric input
            handleNumber = Number(handleNumber);

            if (!(handleNumber >= 0 && handleNumber < scope_HandleNumbers.length)) {
                throw new Error("noUiSlider (" + VERSION + "): invalid handle number, got: " + handleNumber);
            }

            for (var i = 0; i < scope_HandleNumbers.length; i++) {
                values[i] = null;
            }

            values[handleNumber] = value;

            valueSet(values, fireSetEvent);
        }

        // Get the slider value.
        function valueGet() {
            var values = scope_Values.map(options.format.to);

            // If only one handle is used, return a single value.
            if (values.length === 1) {
                return values[0];
            }

            return values;
        }

        // Removes classes from the root and empties it.
        function destroy() {
            for (var key in options.cssClasses) {
                if (!options.cssClasses.hasOwnProperty(key)) {
                    continue;
                }
                removeClass(scope_Target, options.cssClasses[key]);
            }

            while (scope_Target.firstChild) {
                scope_Target.removeChild(scope_Target.firstChild);
            }

            delete scope_Target.noUiSlider;
        }

        function getNextStepsForHandle(handleNumber) {
            var location = scope_Locations[handleNumber];
            var nearbySteps = scope_Spectrum.getNearbySteps(location);
            var value = scope_Values[handleNumber];
            var increment = nearbySteps.thisStep.step;
            var decrement = null;

            // If the next value in this step moves into the next step,
            // the increment is the start of the next step - the current value
            if (increment !== false) {
                if (value + increment > nearbySteps.stepAfter.startValue) {
                    increment = nearbySteps.stepAfter.startValue - value;
                }
            }

            // If the value is beyond the starting point
            if (value > nearbySteps.thisStep.startValue) {
                decrement = nearbySteps.thisStep.step;
            } else if (nearbySteps.stepBefore.step === false) {
                decrement = false;
            }

            // If a handle is at the start of a step, it always steps back into the previous step first
            else {
                decrement = value - nearbySteps.stepBefore.highestStep;
            }

            // Now, if at the slider edges, there is no in/decrement
            if (location === 100) {
                increment = null;
            } else if (location === 0) {
                decrement = null;
            }

            // As per #391, the comparison for the decrement step can have some rounding issues.
            var stepDecimals = scope_Spectrum.countStepDecimals();

            // Round per #391
            if (increment !== null && increment !== false) {
                increment = Number(increment.toFixed(stepDecimals));
            }

            if (decrement !== null && decrement !== false) {
                decrement = Number(decrement.toFixed(stepDecimals));
            }

            return [decrement, increment];
        }

        // Get the current step size for the slider.
        function getNextSteps() {
            return scope_HandleNumbers.map(getNextStepsForHandle);
        }

        // Updateable: margin, limit, padding, step, range, animate, snap
        function updateOptions(optionsToUpdate, fireSetEvent) {
            // Spectrum is created using the range, snap, direction and step options.
            // 'snap' and 'step' can be updated.
            // If 'snap' and 'step' are not passed, they should remain unchanged.
            var v = valueGet();

            var updateAble = [
                "margin",
                "limit",
                "padding",
                "range",
                "animate",
                "snap",
                "step",
                "format",
                "pips",
                "tooltips"
            ];

            // Only change options that we're actually passed to update.
            updateAble.forEach(function(name) {
                // Check for undefined. null removes the value.
                if (optionsToUpdate[name] !== undefined) {
                    originalOptions[name] = optionsToUpdate[name];
                }
            });

            var newOptions = testOptions(originalOptions);

            // Load new options into the slider state
            updateAble.forEach(function(name) {
                if (optionsToUpdate[name] !== undefined) {
                    options[name] = newOptions[name];
                }
            });

            scope_Spectrum = newOptions.spectrum;

            // Limit, margin and padding depend on the spectrum but are stored outside of it. (#677)
            options.margin = newOptions.margin;
            options.limit = newOptions.limit;
            options.padding = newOptions.padding;

            // Update pips, removes existing.
            if (options.pips) {
                pips(options.pips);
            } else {
                removePips();
            }

            // Update tooltips, removes existing.
            if (options.tooltips) {
                tooltips();
            } else {
                removeTooltips();
            }

            // Invalidate the current positioning so valueSet forces an update.
            scope_Locations = [];
            valueSet(optionsToUpdate.start || v, fireSetEvent);
        }

        // Initialization steps
        function setupSlider() {
            // Create the base element, initialize HTML and set classes.
            // Add handles and connect elements.
            scope_Base = addSlider(scope_Target);

            addElements(options.connect, scope_Base);

            // Attach user events.
            bindSliderEvents(options.events);

            // Use the public value method to set the start values.
            valueSet(options.start);

            if (options.pips) {
                pips(options.pips);
            }

            if (options.tooltips) {
                tooltips();
            }

            aria();
        }

        setupSlider();

        // noinspection JSUnusedGlobalSymbols
        scope_Self = {
            destroy: destroy,
            steps: getNextSteps,
            on: bindEvent,
            off: removeEvent,
            get: valueGet,
            set: valueSet,
            setHandle: valueSetHandle,
            reset: valueReset,
            // Exposed for unit testing, don't use this in your application.
            __moveHandles: function(a, b, c) {
                moveHandles(a, b, scope_Locations, c);
            },
            options: originalOptions, // Issue #600, #678
            updateOptions: updateOptions,
            target: scope_Target, // Issue #597
            removePips: removePips,
            removeTooltips: removeTooltips,
            pips: pips // Issue #594
        };

        return scope_Self;
    }

    // Run the standard initializer
    function initialize(target, originalOptions) {
        if (!target || !target.nodeName) {
            throw new Error("noUiSlider (" + VERSION + "): create requires a single element, got: " + target);
        }

        // Throw an error if the slider was already initialized.
        if (target.noUiSlider) {
            throw new Error("noUiSlider (" + VERSION + "): Slider was already initialized.");
        }

        // Test the options and create the slider environment;
        var options = testOptions(originalOptions, target);
        var api = scope(target, options, originalOptions);

        target.noUiSlider = api;

        return api;
    }

    // Use an object instead of a function for future expandability;
    return {
        // Exposed for unit testing, don't use this in your application.
        __spectrum: Spectrum,
        version: VERSION,
        create: initialize
    };
});

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.animateAboutOnMouseMove = undefined;

var _common = require('./common');

var animateAboutOnMouseMove = exports.animateAboutOnMouseMove = function animateAboutOnMouseMove() {
    var movementStrength = 25;
    var height = movementStrength / window.innerWidth;
    var width = movementStrength / window.innerHeight;

    if ((_common.isFirefox || _common.isEDGE || _common.isIE10 || _common.isIE11) && document.querySelector('.about__image')) document.querySelectorAll('.about__image').forEach(function (e) {
        return e.classList.add('nonPath');
    });

    var a = false; // to remove

    if (!_common.MQUERY.matches && a) {
        window.addEventListener('mousemove', function (e) {
            var pageX = e.pageX - window.innerWidth / 2;
            var pageY = e.pageY - window.innerHeight / 2;
            var newvalueX = width * pageX * -1 - 25;
            var newvalueY = height * pageY * -1 - 50;
            document.querySelector('.about__image').style.backgroundPosition = 'calc(50% + ' + newvalueX + 'px) calc(50% + ' + newvalueY + 'px)';

            document.querySelectorAll('.about__circle').forEach(function (e, i) {
                var x = width * pageX * -1 - (25 + i * 5);
                e.style.transform = 'rotate(' + x + 'deg) ' + e.getAttribute('data-skew');
            });
        });
    }
};

},{"./common":16}],15:[function(require,module,exports){
'use strict';

var _common = require('./common');

var _about = require('./about');

var _popup = require('./popup');

var _popup2 = _interopRequireDefault(_popup);

var _map = require('./map');

var _operators = require('./operators');

var _operators2 = _interopRequireDefault(_operators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    (0, _common.windowScroll)();
    window.addEventListener('scroll', _common.windowScroll);
    (0, _about.animateAboutOnMouseMove)();
    (0, _popup2.default)();
    (0, _map.mapHandlers)();
    (0, _operators2.default)();
    $('a[href*="#"]').on('click', _common.smoothScroll);
})();

},{"./about":14,"./common":16,"./map":17,"./operators":18,"./popup":19}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.windowScroll = exports.isEDGE = exports.isIE11 = exports.isIE10 = exports.isFirefox = exports.MSIZE = exports.MQUERY = undefined;
exports.getCookie = getCookie;
exports.setCookie = setCookie;
exports.smoothScroll = smoothScroll;
exports.randomIntFromInterval = randomIntFromInterval;

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MQUERY = exports.MQUERY = window.matchMedia('screen and (max-width: 959px)');
var MSIZE = exports.MSIZE = 959;
var isFirefox = exports.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
var isIE10 = exports.isIE10 = /MSIE 10/i.test(navigator.userAgent);
var isIE11 = exports.isIE11 = /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent);
var isEDGE = exports.isEDGE = /Edge\/\d./i.test(navigator.userAgent);

var _checkElementViewport = function _checkElementViewport(elm, isHTML, half) {
    var height = half ? window.innerHeight / 1.1 : window.innerHeight;
    if (isHTML && elm.getBoundingClientRect().top < height) return true;else if (!isHTML) {
        if (!document.querySelector(elm)) return false;else if (document.querySelector(elm).getBoundingClientRect().top < height) return true;
    }
};

var _addClassonViewport = function _addClassonViewport(elm, isHTML, half) {
    if (isHTML && _checkElementViewport(elm, isHTML, half)) elm.classList.add('active');else if (!isHTML && _checkElementViewport(elm, null, half)) document.querySelector(elm).classList.add('active');
};

var _addRequireAnimation = function _addRequireAnimation() {
    document.querySelectorAll('.req-animation').forEach(function (e) {
        _addClassonViewport(e, true, true);
    });
};

var windowScroll = exports.windowScroll = (0, _debounce2.default)(function () {
    window.requestAnimationFrame(function () {
        _addRequireAnimation();
    });
}, 50);

function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}

function smoothScroll(e) {
    e.preventDefault();

    $('html, body').animate({
        scrollTop: $($(e.currentTarget).attr('href')).offset().top
    }, 500, 'linear');
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

},{"lodash/debounce":7}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mapHandlers = undefined;

var _common = require('./common');

var mapHandlers = exports.mapHandlers = function mapHandlers() {
    $(document).on('mouseenter', '.mapsvg-region', hoverPath).on('mouseout', '.mapsvg-region', removePathHover);

    if (document.querySelector('.js-for-regions')) {
        window.addEventListener('resize', resizeWndowSetMap);
        initPlaces();
        setRandomHover();
    }
};

var countriesCount = [{
    id: 'SK',
    count: 66
}, {
    id: 'SI',
    count: 58
}, {
    id: 'SE',
    count: 112
}, {
    id: 'RS',
    count: 18
}, {
    id: 'RO',
    count: 29
}, {
    id: 'PT',
    count: 88
}, {
    id: 'NO',
    count: 178
}, {
    id: 'NL',
    count: 120
}, {
    id: 'PL',
    count: 331
}, {
    id: 'EE',
    count: 39
}, {
    id: 'AT',
    count: 261
}, {
    id: 'DE',
    count: 705
}, {
    id: 'CZ',
    count: 319
}, {
    id: 'IE',
    count: 7
}, {
    id: 'CH',
    count: 91
}, {
    id: 'AL',
    count: 11
}, {
    id: 'DK',
    count: 37
}, {
    id: 'LV',
    count: 36
}, {
    id: 'TR',
    count: 12
}, {
    id: 'BG',
    count: 16
}, {
    id: 'HR',
    count: 58
}, {
    id: 'BE',
    count: 78
}, {
    id: 'ES',
    count: 180
}, {
    id: 'FI',
    count: 14
}, {
    id: 'HU',
    count: 251
}, {
    id: 'ME',
    count: 6
}, {
    id: 'FR',
    count: 567
}, {
    id: 'LU',
    count: 5
}, {
    id: 'GB',
    count: 49
}, {
    id: 'GR',
    count: 38
}, {
    id: 'IT',
    count: 488
}, {
    id: 'LT',
    count: 37
}];

var to = null,
    toResize = null;

var countries = $.fn.intlTelInput.getCountryData();

var PLACE_SIZE = 20 * 30;

var resizeWndowSetMap = function resizeWndowSetMap() {
    $('.js-for-points-map').html('');
    clearTimeout(toResize);
    toResize = setTimeout(function () {
        initPlaces();
    }, 50);
};

var hoverPath = function hoverPath(e, isID) {
    var target = isID ? isID : e.currentTarget;
    var id = target.getAttribute('id');

    var country = countries.filter(function (country) {
        return country.iso2 === id;
    });

    removeActiveClassFromRegions();

    if (isID) isID.classList.add('active');else clearInterval(to);

    if (country.length > 0) {
        removeInfoBlock();
        var info = {
            bgi: 'images/country_profile/' + id + '.jpg',
            name: country[0].name,
            id: country[0].iso2,
            count: target.getAttribute('data-count') ? target.getAttribute('data-count') : 0
        };
        if (_common.MQUERY.matches) {
            var b = document.querySelector('#' + target.getAttribute('id')).getBoundingClientRect();
            var bound = {
                x: b.x + 40,
                width: b.width,
                height: b.height,
                y: target.getBBox().y - target.getBBox().y / 3
            };
            renderInfoBlock(info, bound);
        } else {
            var offsetTop = document.querySelector('.js-for-points-map').getBoundingClientRect().y;
            var ba = target.getBoundingClientRect();
            var boundFinal = {
                x: ba.x,
                width: ba.width,
                height: ba.height,
                y: ba.y - offsetTop
            };
            renderInfoBlock(info, boundFinal);
        }
    }

    var region = document.querySelector('.svgmap__region[data-id="' + id + '"]');

    if (region) {
        region.style.animationDelay = '0ms';
        region.classList.add('reverse');
    }
};

var removePathHover = function removePathHover(e, isID) {
    var target = isID ? isID : e.currentTarget;
    var id = target.getAttribute('id');

    var region = document.querySelector('.svgmap__region[data-id="' + id + '"]');
    removeActiveClassFromRegions();

    if (region) {
        region.style.animationDelay = '0ms';
        region.classList.remove('reverse');
    }
    removeInfoBlock();
};

var setRandomHover = function setRandomHover() {
    var randomCountry = countriesCount[(0, _common.randomIntFromInterval)(0, countriesCount.length - 1)].id;
    var target = document.querySelector('#' + randomCountry.toLowerCase());
    var prev = target;

    removePathHover(null, target);
    hoverPath(null, target);
    to = setInterval(function () {
        var randomCountry1 = countriesCount[(0, _common.randomIntFromInterval)(0, countriesCount.length - 1)].id;
        var target1 = document.querySelector('#' + randomCountry1.toLowerCase());
        removePathHover(null, prev);
        hoverPath(null, target1);
        prev = target1;
    }, 3000);
};

var removeActiveClassFromRegions = function removeActiveClassFromRegions() {
    document.querySelectorAll('.mapsvg-region').forEach(function (e) {
        e.classList.remove('active');
    });
};

var renderInfoBlock = function renderInfoBlock(info, bound) {
    var block = document.createElement('div');
    block.className = 'svgmap';
    block.setAttribute('id', 'hoverMapElmenet');
    block.style.left = bound.x + bound.width / 2 + 'px';
    block.style.top = bound.y + bound.height / 2 + 'px';

    var left = 0;
    if (bound.x + 125 + bound.width / 2 > window.innerWidth) {
        left = window.innerWidth - (bound.x + 125);
    }

    if (info.id === 'tr') {
        block.style.left = window.innerWidth < 1260 && window.innerWidth > _common.MSIZE ? bound.x + 10 + 'px' : bound.x - 50 + 'px';
    }

    var triangleLeft = Math.abs(left) - 11 > 104 ? 104 : Math.abs(left) - 11;

    block.innerHTML = '<div class="svgmap__block" style="left: ' + (left + -125) + 'px;">\n        <div class="svgmap__locator" style="left: calc(50% + ' + (Math.abs(left) - 11) + 'px)"></div>\n        <div class="svgmap__img" style=" background-image: url(\'' + info.bgi + '\')"></div>\n        <div class="svgmap__triangle" style="left: calc(50% + ' + triangleLeft + 'px)"></div>\n        <div class="svgmap__txt">\n            <div class="svgmap__name">' + info.name + '</div>\n            <div class="svgmap__count">' + info.count + ' hotels</div>\n        </div>\n    </div>';

    document.querySelector('.js-for-regions').appendChild(block);
};

var removeInfoBlock = function removeInfoBlock() {
    if (document.querySelector('#hoverMapElmenet')) document.querySelector('#hoverMapElmenet').remove();
};

var getCountPlacesByRegion = function getCountPlacesByRegion(region) {
    var bound = region.getBBox();

    return parseInt(bound.width * bound.height / PLACE_SIZE / 2);
};

var setPlacesOnRegion = function setPlacesOnRegion(count, bound, index, id) {
    var block = document.createElement('div'),
        arr = [];

    block.className = 'svgmap__region';
    block.style.left = bound.x + 'px';
    block.style.top = bound.y + 'px';
    block.style.width = bound.width + 'px';
    block.style.height = bound.height + 'px';
    block.setAttribute('data-id', id);
    block.style.backgroundImage = 'url("img/countries_pointers/' + id + '.svg")';
    block.style.animationDelay = index * 15 + 'ms';

    return block;
};

var initPlaces = function initPlaces() {
    countriesCount.map(function (e, i) {
        var target = document.querySelector('#' + e.id.toLowerCase());
        target.setAttribute('data-count', e.count);
        var offsetTop = document.querySelector('.js-for-points-map').getBoundingClientRect().y;
        var bound = target.getBBox();
        var ba = target.getBoundingClientRect();
        var boundFinal = {
            x: ba.x,
            width: ba.width,
            height: ba.height,
            y: ba.y - offsetTop
        };
        var div = setPlacesOnRegion(getCountPlacesByRegion(target), boundFinal, i, e.id.toLowerCase());
        document.querySelector('.js-for-points-map').appendChild(div);
    });
};

},{"./common":16}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = operatorsPage;
function operatorsPage() {
    $(document).on("click", ".play-btn", _popupFrameNode);
}

var _popupFrameNode = function _popupFrameNode(e) {
    var id = e.currentTarget.getAttribute('data-youtube-id');
    if (document.querySelector('.watch-video')) {
        document.querySelector('.watch-video').innerHTML = "<iframe id=\"ytiframe\" src=\"//www.youtube-nocookie.com/embed/" + id + "?autoplay=1&amp;autohide=1&amp;controls=1&showinfo=0&rel=0\" allowfullscreen=\"\" width=\"100%\" height=\"100%\" frameborder=\"0\"></iframe>";
    }
};

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _common = require("./common");

var _nouislider = require("nouislider");

var _nouislider2 = _interopRequireDefault(_nouislider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var optionsCountryAutcomlete = {

	data: $.fn.intlTelInput.getCountryData(),

	getValue: "name",

	list: {
		match: {
			enabled: true
		},
		onChooseEvent: function onChooseEvent() {
			$("#company-country").intlTelInput("setCountry", $("#company-country").getSelectedItemData().iso2);
		}
	}
};

var popupHandlers = function popupHandlers() {
	$("#company-country").on("countrychange", setValueToCountry);

	$(document).on('click', '.js-open-popup', openPopup).on('click', '.js-close-popup', closePopup).on('click', '.js-send-popup', sendPopupMessage).on('click', '.popup', function (e) {
		return e.stopPropagation();
	}).on('click', '.popup__bg', popupBackgroundClick).on('input', 'textarea', commentAutoSize).on('keyup', 'input', checkInputValue).on('change', '.js-input-stars', changeStars).on('input', '#range-input-min', changeInputRange).on('input', '#range-input-max', changeInputRange).on('change', '.js-radio-popup', toggleRadioHandler);

	checkCookieBanner();
	initMultiSlider();
};

var sendPopupMessage = function sendPopupMessage(e) {
	closePopup(e);
	document.querySelector('.popup__success').style.display = 'block';
};

var inputTimeOut = null;
var checkInputValue = function checkInputValue(e) {
	var input = e.currentTarget;
	if (input.getAttribute('name') === 'rooms') {
		clearTimeout(inputTimeOut);
		inputTimeOut = setTimeout(function () {
			var val = parseInt(input.value);

			if (val >= 20) {
				document.querySelector('.js-error-rooms').innerHTML = '';
			} else {
				document.querySelector('.js-error-rooms').innerHTML = 'We cooperate only with hotel 20+ rooms.';
			}
		}, 100);
	}
};

var currentTopWindow = 0;

var changeStars = function changeStars(e) {
	var stars = e.currentTarget.getAttribute('data-value');

	e.currentTarget.closest('.popup').querySelectorAll('.popup__checkbox').forEach(function (elm, i) {
		elm.classList.remove('active');
		elm.querySelector('input').checked = false;
		// if (i+1 != stars)
		//
		//
		// if (i+1 <= stars && e.currentTarget.checked) {
		//     elm.classList.add('active');
		// } else {
		//     elm.classList.remove('active');
		// }
	});
	e.currentTarget.checked = true;
	e.currentTarget.parentNode.classList.add('active');
};

var toggleRadioHandler = function toggleRadioHandler(e) {
	var curr = e.currentTarget.value;
	console.log(curr);

	if (document.querySelector('.js-show-radio')) document.querySelector('.js-show-radio').style.display = curr === 'true' ? 'block' : 'none';
};

var openPopup = function openPopup(e) {
	var data = e.currentTarget.getAttribute('data-popup');
	if (_common.MQUERY.matches) {
		currentTopWindow = window.pageYOffset;
		document.querySelector('body').classList.add('fixIt');
	}

	$('#company-country').intlTelInput({
		initialCountry: "auto",
		geoIpLookup: getCountryByIP,
		customPlaceholder: function customPlaceholder(selectedCountryPlaceholder, selectedCountryData) {
			return selectedCountryData.name;
		},
		preferredCountries: []
	});
	// $("#company-country").easyAutocomplete(optionsCountryAutcomlete);

	$('#company-phone').intlTelInput({
		initialCountry: "auto",
		geoIpLookup: getCountryByIP,
		preferredCountries: [],
		separateDialCode: true
	});

	$('#hotel-phone').intlTelInput({
		initialCountry: "auto",
		geoIpLookup: getCountryByIP,
		preferredCountries: [],
		separateDialCode: true
	});

	$('#personal-phone').intlTelInput({
		initialCountry: "auto",
		geoIpLookup: getCountryByIP,
		preferredCountries: [],
		separateDialCode: true
	});

	document.querySelector(".popup__" + data).style.display = 'block';
};

var closePopup = function closePopup(e) {
	var target = e.currentTarget;
	if (_common.MQUERY.matches) {
		document.querySelector('body').classList.remove('fixIt');
		window.scrollTo(0, currentTopWindow);
	}
	$('#company-country').intlTelInput('destroy');

	target.closest('.popup').querySelectorAll('input').forEach(function (e) {
		return e.value = '';
	});
	target.closest('.popup__bg').style.display = 'none';
};

var popupBackgroundClick = function popupBackgroundClick(e) {
	var filed = false,
	    inputs = e.currentTarget.querySelectorAll('input:not([type="checkbox"])');
	for (var i in inputs) {
		if (inputs[i].value && inputs[i].value.length !== 0 && inputs[i].getAttribute('name') !== 'country') {
			filed = true;
			break;
		}
	}

	if (!filed) {
		$('#company-country').intlTelInput('destroy');

		e.currentTarget.querySelector('.popup').querySelectorAll('input').forEach(function (e) {
			return e.value = '';
		});
		e.currentTarget.style.display = 'none';
	}
};

var getCountryByIP = function getCountryByIP(callback) {
	if ((0, _common.getCookie)('currentCountry') && (0, _common.getCookie)('currentCountry').length > 0) window.currentCountry = (0, _common.getCookie)('currentCountry');

	if (window.currentCountry) {

		callback(window.currentCountry);
	} else {
		$.get('https://ipinfo.io', function () {}, "jsonp").always(function (resp) {
			if (resp.status !== 404) {
				var countryCode = resp && resp.country ? resp.country : "";
				window.currentCountry = countryCode;
				(0, _common.setCookie)('currentCountry', countryCode, 30);
				callback(countryCode);
			}
		});
	}
};

var setValueToCountry = function setValueToCountry(e, countryData) {
	e.currentTarget.value = countryData.name;
	if (e.currentTarget.getAttribute('id') === 'company-country') {
		setTimeout(function () {
			$(e.currentTarget).blur();
		});
	}
};

var renderCookieBanner = function renderCookieBanner() {
	var div = document.createElement('div');
	div.className = 'cookies-banner';
	div.setAttribute('id', 'cookies-banner');
	div.innerHTML = '<div class="container"><div class="cookies-banner__close"></div>\n' + '<p>This site uses cookies. By continuing to browse the site you are agreeing to our use of cookies. <a target="_blank"\n href="http://ec.europa.eu/ipg/basics/legal/cookies/index_en.htm">Find out more about cookie here</a></p></div>';
	div.querySelector('.cookies-banner__close').addEventListener('click', closeCookieBanner);

	document.querySelector('body').insertBefore(div, document.querySelector('.header'));
};

var closeCookieBanner = function closeCookieBanner() {
	(0, _common.setCookie)('cookie-banner', true, 365);
	document.querySelector('#cookies-banner').remove();
};

var checkCookieBanner = function checkCookieBanner() {
	if (!(0, _common.getCookie)('cookie-banner')) renderCookieBanner();
};

var commentAutoSize = function commentAutoSize(e) {
	var el = e.currentTarget;

	el.style.height = 'auto';
	el.style.height = el.scrollHeight + 'px';
};

var changeRangeSlider = function changeRangeSlider(values) {
	var inputMin = document.getElementById('range-input-min');
	var inputMax = document.getElementById('range-input-max');

	inputMin.value = parseInt(values[0]);
	inputMax.value = parseInt(values[1]);
};

var st = null;
var changeInputRange = function changeInputRange(e) {
	var slider = document.getElementById('multi-range');
	var current = e.currentTarget;
	var min = parseInt(current.getAttribute('min')),
	    max = parseInt(current.getAttribute('max'));
	var inputMin = document.getElementById('range-input-min');
	var inputMax = document.getElementById('range-input-max');

	clearTimeout(st);
	st = setTimeout(function () {
		console.log(current.value);
		if (current === inputMin) {
			if (parseInt(current.value) > parseInt(inputMax.value)) current.value = inputMax.value;
		} else {
			if (parseInt(current.value) < parseInt(inputMin.value)) current.value = inputMin.value;
		}

		if (parseInt(current.value) < min || parseInt(current.value) > max || isNaN(parseInt(current.value))) {
			current.value = current.getAttribute('id') === 'range-input-min' ? min : max;
		}

		slider.noUiSlider.set([inputMin.value, inputMax.value]);
	}, 500);
};

var initMultiSlider = function initMultiSlider() {
	var slider = document.getElementById('multi-range');
	var wrap = document.querySelector('.popup__range-wrapper');

	if (slider && wrap) {

		var min = parseInt(wrap.getAttribute('data-min'));
		var max = parseInt(wrap.getAttribute('data-max'));

		_nouislider2.default.create(slider, {
			start: [min + 30, max - 30],
			step: 5,
			connect: true,
			range: {
				'min': min,
				'max': max
			}
		});

		changeRangeSlider([min + 30, max - 30]);

		slider.noUiSlider.on('change', changeRangeSlider);
	}
};

exports.default = popupHandlers;

},{"./common":16,"nouislider":13}]},{},[15])

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TeW1ib2wuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZnJlZUdsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFJhd1RhZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX29iamVjdFRvU3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fcm9vdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZGVib3VuY2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9ub3cuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3RvTnVtYmVyLmpzIiwibm9kZV9tb2R1bGVzL25vdWlzbGlkZXIvZGlzdHJpYnV0ZS9ub3Vpc2xpZGVyLmpzIiwic3JjL2pzL2Fib3V0LmpzIiwic3JjL2pzL2FwcC5qcyIsInNyYy9qcy9jb21tb24uanMiLCJzcmMvanMvbWFwLmpzIiwic3JjL2pzL29wZXJhdG9ycy5qcyIsInNyYy9qcy9wb3B1cC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ3Y1RUE7O0FBRU8sSUFBTSw0REFBMEIsU0FBMUIsdUJBQTBCLEdBQUs7QUFDeEMsUUFBSSxtQkFBbUIsRUFBdkI7QUFDQSxRQUFJLFNBQVMsbUJBQW1CLE9BQU8sVUFBdkM7QUFDQSxRQUFJLFFBQVEsbUJBQW1CLE9BQU8sV0FBdEM7O0FBRUEsUUFBSSxDQUFDLHFCQUFhLGNBQWIsSUFBdUIsY0FBdkIsSUFBaUMsY0FBbEMsS0FBNkMsU0FBUyxhQUFULENBQXVCLGVBQXZCLENBQWpELEVBQ0ksU0FBUyxnQkFBVCxDQUEwQixlQUExQixFQUEyQyxPQUEzQyxDQUFtRDtBQUFBLGVBQUssRUFBRSxTQUFGLENBQVksR0FBWixDQUFnQixTQUFoQixDQUFMO0FBQUEsS0FBbkQ7O0FBRUosUUFBSSxJQUFJLEtBQVIsQ0FSd0MsQ0FRekI7O0FBRWYsUUFBSSxDQUFDLGVBQU8sT0FBUixJQUFtQixDQUF2QixFQUEwQjtBQUN0QixlQUFPLGdCQUFQLENBQXdCLFdBQXhCLEVBQXFDLFVBQUMsQ0FBRCxFQUFNO0FBQ3ZDLGdCQUFJLFFBQVEsRUFBRSxLQUFGLEdBQVcsT0FBTyxVQUFQLEdBQW9CLENBQTNDO0FBQ0EsZ0JBQUksUUFBUSxFQUFFLEtBQUYsR0FBVyxPQUFPLFdBQVAsR0FBcUIsQ0FBNUM7QUFDQSxnQkFBSSxZQUFZLFFBQVEsS0FBUixHQUFnQixDQUFDLENBQWpCLEdBQXFCLEVBQXJDO0FBQ0EsZ0JBQUksWUFBWSxTQUFTLEtBQVQsR0FBaUIsQ0FBQyxDQUFsQixHQUFzQixFQUF0QztBQUNBLHFCQUFTLGFBQVQsQ0FBdUIsZUFBdkIsRUFBd0MsS0FBeEMsQ0FBOEMsa0JBQTlDLG1CQUFpRixTQUFqRix1QkFBNEcsU0FBNUc7O0FBRUEscUJBQVMsZ0JBQVQsQ0FBMEIsZ0JBQTFCLEVBQTRDLE9BQTVDLENBQW9ELFVBQUMsQ0FBRCxFQUFHLENBQUgsRUFBUTtBQUN4RCxvQkFBSSxJQUFJLFFBQVEsS0FBUixHQUFnQixDQUFDLENBQWpCLElBQXNCLEtBQUssSUFBRSxDQUE3QixDQUFSO0FBQ0Esa0JBQUUsS0FBRixDQUFRLFNBQVIsZUFBOEIsQ0FBOUIsYUFBdUMsRUFBRSxZQUFGLENBQWUsV0FBZixDQUF2QztBQUNILGFBSEQ7QUFJSCxTQVhEO0FBWUg7QUFDSixDQXhCTTs7Ozs7QUNGUDs7QUFDQTs7QUFDQTs7OztBQUNBOztBQUNBOzs7Ozs7QUFFQSxDQUFDLFlBQVk7QUFDVDtBQUNBLFdBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0Msb0JBQWxDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFFLGNBQUYsRUFBa0IsRUFBbEIsQ0FBcUIsT0FBckIsRUFBOEIsb0JBQTlCO0FBQ0gsQ0FSRDs7Ozs7Ozs7O1FDbUNnQixTLEdBQUEsUztRQU9BLFMsR0FBQSxTO1FBNkJBLFksR0FBQSxZO1FBUUEscUIsR0FBQSxxQjs7QUFyRmhCOzs7Ozs7QUFHTyxJQUFNLDBCQUFTLE9BQU8sVUFBUCxDQUFrQiwrQkFBbEIsQ0FBZjtBQUNBLElBQU0sd0JBQVEsR0FBZDtBQUNBLElBQU0sZ0NBQVksVUFBVSxTQUFWLENBQW9CLFdBQXBCLEdBQWtDLE9BQWxDLENBQTBDLFNBQTFDLElBQXVELENBQUMsQ0FBMUU7QUFDQSxJQUFNLDBCQUFTLFdBQVcsSUFBWCxDQUFnQixVQUFVLFNBQTFCLENBQWY7QUFDQSxJQUFNLDBCQUFRLFVBQVUsSUFBVixDQUFlLFVBQVUsU0FBekIsS0FBdUMsV0FBVyxJQUFYLENBQWdCLFVBQVUsU0FBMUIsQ0FBckQ7QUFDQSxJQUFNLDBCQUFTLGFBQWEsSUFBYixDQUFrQixVQUFVLFNBQTVCLENBQWY7O0FBRVAsSUFBTSx3QkFBd0IsU0FBeEIscUJBQXdCLENBQUMsR0FBRCxFQUFNLE1BQU4sRUFBYyxJQUFkLEVBQXVCO0FBQ2pELFFBQUksU0FBUyxPQUFPLE9BQU8sV0FBUCxHQUFxQixHQUE1QixHQUFrQyxPQUFPLFdBQXREO0FBQ0EsUUFBSSxVQUFVLElBQUkscUJBQUosR0FBNEIsR0FBNUIsR0FBa0MsTUFBaEQsRUFBd0QsT0FBTyxJQUFQLENBQXhELEtBQ0ssSUFBSSxDQUFDLE1BQUwsRUFBYTtBQUNkLFlBQUksQ0FBQyxTQUFTLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBTCxFQUFrQyxPQUFPLEtBQVAsQ0FBbEMsS0FDSyxJQUFJLFNBQVMsYUFBVCxDQUF1QixHQUF2QixFQUE0QixxQkFBNUIsR0FBb0QsR0FBcEQsR0FBMEQsTUFBOUQsRUFBc0UsT0FBTyxJQUFQO0FBQzlFO0FBQ0osQ0FQRDs7QUFTQSxJQUFNLHNCQUFzQixTQUF0QixtQkFBc0IsQ0FBQyxHQUFELEVBQU0sTUFBTixFQUFjLElBQWQsRUFBdUI7QUFDL0MsUUFBSSxVQUFVLHNCQUFzQixHQUF0QixFQUEyQixNQUEzQixFQUFtQyxJQUFuQyxDQUFkLEVBQXdELElBQUksU0FBSixDQUFjLEdBQWQsQ0FBa0IsUUFBbEIsRUFBeEQsS0FDSyxJQUFJLENBQUMsTUFBRCxJQUFXLHNCQUFzQixHQUF0QixFQUEyQixJQUEzQixFQUFpQyxJQUFqQyxDQUFmLEVBQXVELFNBQVMsYUFBVCxDQUF1QixHQUF2QixFQUE0QixTQUE1QixDQUFzQyxHQUF0QyxDQUEwQyxRQUExQztBQUMvRCxDQUhEOztBQU1BLElBQU0sdUJBQXVCLFNBQXZCLG9CQUF1QixHQUFNO0FBQy9CLGFBQVMsZ0JBQVQsQ0FBMEIsZ0JBQTFCLEVBQTRDLE9BQTVDLENBQW9ELFVBQUMsQ0FBRCxFQUFPO0FBQ3ZELDRCQUFvQixDQUFwQixFQUF1QixJQUF2QixFQUE2QixJQUE3QjtBQUNILEtBRkQ7QUFHSCxDQUpEOztBQVFPLElBQU0sc0NBQWUsd0JBQVMsWUFBTTtBQUN2QyxXQUFPLHFCQUFQLENBQTZCLFlBQU07QUFDL0I7QUFDSCxLQUZEO0FBR0gsQ0FKMkIsRUFJekIsRUFKeUIsQ0FBckI7O0FBUUEsU0FBUyxTQUFULENBQW1CLElBQW5CLEVBQXlCO0FBQzVCLFFBQUksVUFBVSxTQUFTLE1BQVQsQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBSSxNQUFKLENBQ2hDLGFBQWEsS0FBSyxPQUFMLENBQWEsOEJBQWIsRUFBNkMsTUFBN0MsQ0FBYixHQUFvRSxVQURwQyxDQUF0QixDQUFkO0FBR0EsV0FBTyxVQUFVLG1CQUFtQixRQUFRLENBQVIsQ0FBbkIsQ0FBVixHQUEyQyxTQUFsRDtBQUNIOztBQUVNLFNBQVMsU0FBVCxDQUFtQixJQUFuQixFQUF5QixLQUF6QixFQUFnQyxPQUFoQyxFQUF5QztBQUM1QyxjQUFVLFdBQVcsRUFBckI7O0FBRUEsUUFBSSxVQUFVLFFBQVEsT0FBdEI7O0FBRUEsUUFBSSxPQUFPLE9BQVAsSUFBa0IsUUFBbEIsSUFBOEIsT0FBbEMsRUFBMkM7QUFDdkMsWUFBSSxJQUFJLElBQUksSUFBSixFQUFSO0FBQ0EsVUFBRSxPQUFGLENBQVUsRUFBRSxPQUFGLEtBQWMsVUFBVSxJQUFsQztBQUNBLGtCQUFVLFFBQVEsT0FBUixHQUFrQixDQUE1QjtBQUNIO0FBQ0QsUUFBSSxXQUFXLFFBQVEsV0FBdkIsRUFBb0M7QUFDaEMsZ0JBQVEsT0FBUixHQUFrQixRQUFRLFdBQVIsRUFBbEI7QUFDSDs7QUFFRCxZQUFRLG1CQUFtQixLQUFuQixDQUFSOztBQUVBLFFBQUksZ0JBQWdCLE9BQU8sR0FBUCxHQUFhLEtBQWpDOztBQUVBLFNBQUssSUFBSSxRQUFULElBQXFCLE9BQXJCLEVBQThCO0FBQzFCLHlCQUFpQixPQUFPLFFBQXhCO0FBQ0EsWUFBSSxZQUFZLFFBQVEsUUFBUixDQUFoQjtBQUNBLFlBQUksY0FBYyxJQUFsQixFQUF3QjtBQUNwQiw2QkFBaUIsTUFBTSxTQUF2QjtBQUNIO0FBQ0o7O0FBRUQsYUFBUyxNQUFULEdBQWtCLGFBQWxCO0FBQ0g7O0FBRU0sU0FBUyxZQUFULENBQXNCLENBQXRCLEVBQXlCO0FBQzVCLE1BQUUsY0FBRjs7QUFFQSxNQUFFLFlBQUYsRUFBZ0IsT0FBaEIsQ0FBd0I7QUFDcEIsbUJBQVcsRUFBRSxFQUFFLEVBQUUsYUFBSixFQUFtQixJQUFuQixDQUF3QixNQUF4QixDQUFGLEVBQW1DLE1BQW5DLEdBQTRDO0FBRG5DLEtBQXhCLEVBRUcsR0FGSCxFQUVRLFFBRlI7QUFHSDs7QUFFTSxTQUFTLHFCQUFULENBQStCLEdBQS9CLEVBQW1DLEdBQW5DLEVBQXdDO0FBQzNDLFdBQU8sS0FBSyxLQUFMLENBQVcsS0FBSyxNQUFMLE1BQWUsTUFBSSxHQUFKLEdBQVEsQ0FBdkIsSUFBMEIsR0FBckMsQ0FBUDtBQUNIOzs7Ozs7Ozs7O0FDdkZEOztBQUVPLElBQU0sb0NBQWMsU0FBZCxXQUFjLEdBQU07QUFDN0IsTUFBRSxRQUFGLEVBQ0ssRUFETCxDQUNRLFlBRFIsRUFDc0IsZ0JBRHRCLEVBQ3dDLFNBRHhDLEVBRUssRUFGTCxDQUVRLFVBRlIsRUFFb0IsZ0JBRnBCLEVBRXNDLGVBRnRDOztBQUlBLFFBQUksU0FBUyxhQUFULENBQXVCLGlCQUF2QixDQUFKLEVBQStDO0FBQzNDLGVBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsaUJBQWxDO0FBQ0E7QUFDQTtBQUNIO0FBQ0osQ0FWTTs7QUFZUCxJQUFNLGlCQUFpQixDQUNuQjtBQUNJLFFBQUksSUFEUjtBQUVJLFdBQU87QUFGWCxDQURtQixFQUtuQjtBQUNJLFFBQUcsSUFEUDtBQUVJLFdBQU87QUFGWCxDQUxtQixFQVNuQjtBQUNJLFFBQUcsSUFEUDtBQUVJLFdBQU87QUFGWCxDQVRtQixFQWFuQjtBQUNJLFFBQUcsSUFEUDtBQUVJLFdBQU87QUFGWCxDQWJtQixFQWlCbkI7QUFDSSxRQUFHLElBRFA7QUFFSSxXQUFPO0FBRlgsQ0FqQm1CLEVBcUJuQjtBQUNJLFFBQUcsSUFEUDtBQUVJLFdBQU87QUFGWCxDQXJCbUIsRUF5Qm5CO0FBQ0ksUUFBRyxJQURQO0FBRUksV0FBTztBQUZYLENBekJtQixFQTZCbkI7QUFDSSxRQUFHLElBRFA7QUFFSSxXQUFPO0FBRlgsQ0E3Qm1CLEVBaUNuQjtBQUNJLFFBQUcsSUFEUDtBQUVJLFdBQU87QUFGWCxDQWpDbUIsRUFxQ25CO0FBQ0ksUUFBRyxJQURQO0FBRUksV0FBTztBQUZYLENBckNtQixFQXlDbkI7QUFDSSxRQUFHLElBRFA7QUFFSSxXQUFPO0FBRlgsQ0F6Q21CLEVBNkNuQjtBQUNJLFFBQUcsSUFEUDtBQUVJLFdBQU87QUFGWCxDQTdDbUIsRUFpRG5CO0FBQ0ksUUFBRyxJQURQO0FBRUksV0FBTztBQUZYLENBakRtQixFQXFEbkI7QUFDSSxRQUFHLElBRFA7QUFFSSxXQUFPO0FBRlgsQ0FyRG1CLEVBeURuQjtBQUNJLFFBQUcsSUFEUDtBQUVJLFdBQU87QUFGWCxDQXpEbUIsRUE2RG5CO0FBQ0ksUUFBRyxJQURQO0FBRUksV0FBTztBQUZYLENBN0RtQixFQWlFbkI7QUFDSSxRQUFHLElBRFA7QUFFSSxXQUFPO0FBRlgsQ0FqRW1CLEVBcUVuQjtBQUNJLFFBQUcsSUFEUDtBQUVJLFdBQU87QUFGWCxDQXJFbUIsRUF5RW5CO0FBQ0ksUUFBRyxJQURQO0FBRUksV0FBTztBQUZYLENBekVtQixFQTZFbkI7QUFDSSxRQUFHLElBRFA7QUFFSSxXQUFPO0FBRlgsQ0E3RW1CLEVBaUZuQjtBQUNJLFFBQUcsSUFEUDtBQUVJLFdBQU87QUFGWCxDQWpGbUIsRUFxRm5CO0FBQ0ksUUFBRyxJQURQO0FBRUksV0FBTztBQUZYLENBckZtQixFQXlGbkI7QUFDSSxRQUFHLElBRFA7QUFFSSxXQUFPO0FBRlgsQ0F6Rm1CLEVBNkZuQjtBQUNJLFFBQUcsSUFEUDtBQUVJLFdBQU87QUFGWCxDQTdGbUIsRUFpR25CO0FBQ0ksUUFBRyxJQURQO0FBRUksV0FBTztBQUZYLENBakdtQixFQXFHbkI7QUFDSSxRQUFHLElBRFA7QUFFSSxXQUFPO0FBRlgsQ0FyR21CLEVBeUduQjtBQUNJLFFBQUcsSUFEUDtBQUVJLFdBQU87QUFGWCxDQXpHbUIsRUE2R25CO0FBQ0ksUUFBRyxJQURQO0FBRUksV0FBTztBQUZYLENBN0dtQixFQWlIbkI7QUFDSSxRQUFHLElBRFA7QUFFSSxXQUFPO0FBRlgsQ0FqSG1CLEVBcUhuQjtBQUNJLFFBQUcsSUFEUDtBQUVJLFdBQU87QUFGWCxDQXJIbUIsRUF5SG5CO0FBQ0ksUUFBRyxJQURQO0FBRUksV0FBTztBQUZYLENBekhtQixFQTZIbkI7QUFDSSxRQUFHLElBRFA7QUFFSSxXQUFPO0FBRlgsQ0E3SG1CLENBQXZCOztBQW1JQSxJQUFJLEtBQUssSUFBVDtBQUFBLElBQ0ksV0FBVyxJQURmOztBQUdBLElBQU0sWUFBWSxFQUFFLEVBQUYsQ0FBSyxZQUFMLENBQWtCLGNBQWxCLEVBQWxCOztBQUVBLElBQU0sYUFBYSxLQUFLLEVBQXhCOztBQUVBLElBQU0sb0JBQW9CLFNBQXBCLGlCQUFvQixHQUFNO0FBQzVCLE1BQUUsb0JBQUYsRUFBd0IsSUFBeEIsQ0FBNkIsRUFBN0I7QUFDQSxpQkFBYSxRQUFiO0FBQ0EsZUFBVyxXQUFXLFlBQUs7QUFDdkI7QUFDSCxLQUZVLEVBRVIsRUFGUSxDQUFYO0FBR0gsQ0FORDs7QUFRQSxJQUFNLFlBQVksU0FBWixTQUFZLENBQUMsQ0FBRCxFQUFJLElBQUosRUFBYTtBQUMzQixRQUFJLFNBQVMsT0FBTyxJQUFQLEdBQWMsRUFBRSxhQUE3QjtBQUNBLFFBQUksS0FBSyxPQUFPLFlBQVAsQ0FBb0IsSUFBcEIsQ0FBVDs7QUFFQSxRQUFJLFVBQVUsVUFBVSxNQUFWLENBQWlCO0FBQUEsZUFBVyxRQUFRLElBQVIsS0FBaUIsRUFBNUI7QUFBQSxLQUFqQixDQUFkOztBQUVBOztBQUVBLFFBQUksSUFBSixFQUFVLEtBQUssU0FBTCxDQUFlLEdBQWYsQ0FBbUIsUUFBbkIsRUFBVixLQUNLLGNBQWMsRUFBZDs7QUFFTCxRQUFJLFFBQVEsTUFBUixHQUFpQixDQUFyQixFQUF3QjtBQUNwQjtBQUNBLFlBQUksT0FBTztBQUNQLDZDQUErQixFQUEvQixTQURPO0FBRVAsa0JBQU0sUUFBUSxDQUFSLEVBQVcsSUFGVjtBQUdQLGdCQUFJLFFBQVEsQ0FBUixFQUFXLElBSFI7QUFJUCxtQkFBTyxPQUFPLFlBQVAsQ0FBb0IsWUFBcEIsSUFBb0MsT0FBTyxZQUFQLENBQW9CLFlBQXBCLENBQXBDLEdBQXdFO0FBSnhFLFNBQVg7QUFNQSxZQUFJLGVBQU8sT0FBWCxFQUFvQjtBQUNoQixnQkFBSSxJQUFJLFNBQVMsYUFBVCxPQUEyQixPQUFPLFlBQVAsQ0FBb0IsSUFBcEIsQ0FBM0IsRUFBd0QscUJBQXhELEVBQVI7QUFDQSxnQkFBSSxRQUFRO0FBQ1IsbUJBQUcsRUFBRSxDQUFGLEdBQU0sRUFERDtBQUVSLHVCQUFPLEVBQUUsS0FGRDtBQUdSLHdCQUFRLEVBQUUsTUFIRjtBQUlSLG1CQUFHLE9BQU8sT0FBUCxHQUFpQixDQUFqQixHQUFzQixPQUFPLE9BQVAsR0FBaUIsQ0FBakIsR0FBcUI7QUFKdEMsYUFBWjtBQU1BLDRCQUFnQixJQUFoQixFQUFzQixLQUF0QjtBQUNILFNBVEQsTUFTTztBQUNILGdCQUFJLFlBQVksU0FBUyxhQUFULENBQXVCLG9CQUF2QixFQUE2QyxxQkFBN0MsR0FBcUUsQ0FBckY7QUFDQSxnQkFBSSxLQUFLLE9BQU8scUJBQVAsRUFBVDtBQUNBLGdCQUFJLGFBQWE7QUFDYixtQkFBRyxHQUFHLENBRE87QUFFYix1QkFBTyxHQUFHLEtBRkc7QUFHYix3QkFBUSxHQUFHLE1BSEU7QUFJYixtQkFBRyxHQUFHLENBQUgsR0FBTztBQUpHLGFBQWpCO0FBTUEsNEJBQWdCLElBQWhCLEVBQXNCLFVBQXRCO0FBQ0g7QUFDSjs7QUFFRCxRQUFJLFNBQVMsU0FBUyxhQUFULCtCQUFtRCxFQUFuRCxRQUFiOztBQUVBLFFBQUksTUFBSixFQUFZO0FBQ1IsZUFBTyxLQUFQLENBQWEsY0FBYixHQUE4QixLQUE5QjtBQUNBLGVBQU8sU0FBUCxDQUFpQixHQUFqQixDQUFxQixTQUFyQjtBQUNIO0FBQ0osQ0EvQ0Q7O0FBaURBLElBQU0sa0JBQWtCLFNBQWxCLGVBQWtCLENBQUMsQ0FBRCxFQUFJLElBQUosRUFBYTtBQUNqQyxRQUFJLFNBQVMsT0FBTyxJQUFQLEdBQWMsRUFBRSxhQUE3QjtBQUNBLFFBQUksS0FBSyxPQUFPLFlBQVAsQ0FBb0IsSUFBcEIsQ0FBVDs7QUFFQSxRQUFJLFNBQVMsU0FBUyxhQUFULCtCQUFtRCxFQUFuRCxRQUFiO0FBQ0E7O0FBRUEsUUFBSSxNQUFKLEVBQVk7QUFDUixlQUFPLEtBQVAsQ0FBYSxjQUFiLEdBQThCLEtBQTlCO0FBQ0EsZUFBTyxTQUFQLENBQWlCLE1BQWpCLENBQXdCLFNBQXhCO0FBQ0g7QUFDRDtBQUNILENBWkQ7O0FBY0EsSUFBTSxpQkFBaUIsU0FBakIsY0FBaUIsR0FBSztBQUN4QixRQUFJLGdCQUFnQixlQUFlLG1DQUFzQixDQUF0QixFQUF5QixlQUFlLE1BQWYsR0FBc0IsQ0FBL0MsQ0FBZixFQUFrRSxFQUF0RjtBQUNBLFFBQUksU0FBUyxTQUFTLGFBQVQsT0FBMkIsY0FBYyxXQUFkLEVBQTNCLENBQWI7QUFDQSxRQUFJLE9BQU8sTUFBWDs7QUFFQSxvQkFBZ0IsSUFBaEIsRUFBc0IsTUFBdEI7QUFDQSxjQUFVLElBQVYsRUFBZ0IsTUFBaEI7QUFDQSxTQUFLLFlBQVksWUFBSztBQUNsQixZQUFJLGlCQUFpQixlQUFlLG1DQUFzQixDQUF0QixFQUF5QixlQUFlLE1BQWYsR0FBc0IsQ0FBL0MsQ0FBZixFQUFrRSxFQUF2RjtBQUNBLFlBQUksVUFBVSxTQUFTLGFBQVQsT0FBMkIsZUFBZSxXQUFmLEVBQTNCLENBQWQ7QUFDQSx3QkFBZ0IsSUFBaEIsRUFBc0IsSUFBdEI7QUFDQSxrQkFBVSxJQUFWLEVBQWdCLE9BQWhCO0FBQ0EsZUFBTyxPQUFQO0FBQ0gsS0FOSSxFQU1GLElBTkUsQ0FBTDtBQU9ILENBZEQ7O0FBZ0JBLElBQU0sK0JBQStCLFNBQS9CLDRCQUErQixHQUFLO0FBQ3RDLGFBQVMsZ0JBQVQsQ0FBMEIsZ0JBQTFCLEVBQTRDLE9BQTVDLENBQW9ELFVBQUMsQ0FBRCxFQUFNO0FBQ3RELFVBQUUsU0FBRixDQUFZLE1BQVosQ0FBbUIsUUFBbkI7QUFDSCxLQUZEO0FBR0gsQ0FKRDs7QUFNQSxJQUFNLGtCQUFrQixTQUFsQixlQUFrQixDQUFDLElBQUQsRUFBTyxLQUFQLEVBQWlCO0FBQ3JDLFFBQUksUUFBUSxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBWjtBQUNBLFVBQU0sU0FBTixHQUFrQixRQUFsQjtBQUNBLFVBQU0sWUFBTixDQUFtQixJQUFuQixFQUF5QixpQkFBekI7QUFDQSxVQUFNLEtBQU4sQ0FBWSxJQUFaLEdBQXNCLE1BQU0sQ0FBTixHQUFXLE1BQU0sS0FBTixHQUFjLENBQS9DO0FBQ0EsVUFBTSxLQUFOLENBQVksR0FBWixHQUFxQixNQUFNLENBQU4sR0FBVyxNQUFNLE1BQU4sR0FBZSxDQUEvQzs7QUFFQSxRQUFJLE9BQU8sQ0FBWDtBQUNBLFFBQUksTUFBTSxDQUFOLEdBQVUsR0FBVixHQUFnQixNQUFNLEtBQU4sR0FBYyxDQUE5QixHQUFtQyxPQUFPLFVBQTlDLEVBQTBEO0FBQ3RELGVBQU8sT0FBTyxVQUFQLElBQXFCLE1BQU0sQ0FBTixHQUFVLEdBQS9CLENBQVA7QUFDSDs7QUFFRCxRQUFJLEtBQUssRUFBTCxLQUFZLElBQWhCLEVBQXNCO0FBQ2xCLGNBQU0sS0FBTixDQUFZLElBQVosR0FBb0IsT0FBTyxVQUFQLEdBQW9CLElBQXBCLElBQTRCLE9BQU8sVUFBUCxHQUFvQixhQUFoRCxHQUEyRCxNQUFNLENBQU4sR0FBVSxFQUFyRSxVQUFpRixNQUFNLENBQU4sR0FBVyxFQUE1RixPQUFwQjtBQUNIOztBQUVELFFBQUksZUFBZSxLQUFLLEdBQUwsQ0FBUyxJQUFULElBQWlCLEVBQWpCLEdBQXNCLEdBQXRCLEdBQTRCLEdBQTVCLEdBQWtDLEtBQUssR0FBTCxDQUFTLElBQVQsSUFBaUIsRUFBdEU7O0FBRUEsVUFBTSxTQUFOLGlEQUE2RCxPQUFRLENBQUMsR0FBdEUsOEVBQzJELEtBQUssR0FBTCxDQUFTLElBQVQsSUFBZSxFQUQxRSx1RkFFOEQsS0FBSyxHQUZuRSxtRkFHNEQsWUFINUQsOEZBS29DLEtBQUssSUFMekMsdURBTXFDLEtBQUssS0FOMUM7O0FBVUEsYUFBUyxhQUFULENBQXVCLGlCQUF2QixFQUEwQyxXQUExQyxDQUFzRCxLQUF0RDtBQUNILENBN0JEOztBQStCQSxJQUFNLGtCQUFrQixTQUFsQixlQUFrQixHQUFNO0FBQzFCLFFBQUksU0FBUyxhQUFULENBQXVCLGtCQUF2QixDQUFKLEVBQ0ksU0FBUyxhQUFULENBQXVCLGtCQUF2QixFQUEyQyxNQUEzQztBQUNQLENBSEQ7O0FBS0EsSUFBTSx5QkFBeUIsU0FBekIsc0JBQXlCLENBQUMsTUFBRCxFQUFZO0FBQ3ZDLFFBQUksUUFBUSxPQUFPLE9BQVAsRUFBWjs7QUFFQSxXQUFPLFNBQVUsTUFBTSxLQUFOLEdBQWMsTUFBTSxNQUFwQixHQUE2QixVQUE5QixHQUE0QyxDQUFyRCxDQUFQO0FBQ0gsQ0FKRDs7QUFNQSxJQUFNLG9CQUFvQixTQUFwQixpQkFBb0IsQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLEtBQWYsRUFBc0IsRUFBdEIsRUFBNkI7QUFDbkQsUUFBSSxRQUFRLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFaO0FBQUEsUUFDSSxNQUFNLEVBRFY7O0FBR0EsVUFBTSxTQUFOLEdBQWtCLGdCQUFsQjtBQUNBLFVBQU0sS0FBTixDQUFZLElBQVosR0FBc0IsTUFBTSxDQUE1QjtBQUNBLFVBQU0sS0FBTixDQUFZLEdBQVosR0FBcUIsTUFBTSxDQUEzQjtBQUNBLFVBQU0sS0FBTixDQUFZLEtBQVosR0FBdUIsTUFBTSxLQUE3QjtBQUNBLFVBQU0sS0FBTixDQUFZLE1BQVosR0FBd0IsTUFBTSxNQUE5QjtBQUNBLFVBQU0sWUFBTixDQUFtQixTQUFuQixFQUE4QixFQUE5QjtBQUNBLFVBQU0sS0FBTixDQUFZLGVBQVosb0NBQTZELEVBQTdEO0FBQ0EsVUFBTSxLQUFOLENBQVksY0FBWixHQUFnQyxRQUFRLEVBQXhDOztBQUVBLFdBQU8sS0FBUDtBQUNILENBZEQ7O0FBZ0JBLElBQU0sYUFBYSxTQUFiLFVBQWEsR0FBTTtBQUNyQixtQkFBZSxHQUFmLENBQW1CLFVBQUMsQ0FBRCxFQUFHLENBQUgsRUFBUTtBQUN2QixZQUFJLFNBQVMsU0FBUyxhQUFULE9BQTJCLEVBQUUsRUFBRixDQUFLLFdBQUwsRUFBM0IsQ0FBYjtBQUNBLGVBQU8sWUFBUCxDQUFvQixZQUFwQixFQUFrQyxFQUFFLEtBQXBDO0FBQ0EsWUFBSSxZQUFZLFNBQVMsYUFBVCxDQUF1QixvQkFBdkIsRUFBNkMscUJBQTdDLEdBQXFFLENBQXJGO0FBQ0EsWUFBSSxRQUFRLE9BQU8sT0FBUCxFQUFaO0FBQ0EsWUFBSSxLQUFLLE9BQU8scUJBQVAsRUFBVDtBQUNBLFlBQUksYUFBYTtBQUNiLGVBQUcsR0FBRyxDQURPO0FBRWIsbUJBQU8sR0FBRyxLQUZHO0FBR2Isb0JBQVEsR0FBRyxNQUhFO0FBSWIsZUFBRyxHQUFHLENBQUgsR0FBTztBQUpHLFNBQWpCO0FBTUEsWUFBSSxNQUFNLGtCQUFrQix1QkFBdUIsTUFBdkIsQ0FBbEIsRUFBa0QsVUFBbEQsRUFBOEQsQ0FBOUQsRUFBaUUsRUFBRSxFQUFGLENBQUssV0FBTCxFQUFqRSxDQUFWO0FBQ0EsaUJBQVMsYUFBVCxDQUF1QixvQkFBdkIsRUFBNkMsV0FBN0MsQ0FBeUQsR0FBekQ7QUFDSCxLQWREO0FBZUgsQ0FoQkQ7Ozs7Ozs7O2tCQy9Td0IsYTtBQUFULFNBQVMsYUFBVCxHQUF5QjtBQUNwQyxNQUFFLFFBQUYsRUFBWSxFQUFaLENBQWUsT0FBZixFQUF3QixXQUF4QixFQUFxQyxlQUFyQztBQUNIOztBQUVELElBQU0sa0JBQWtCLFNBQWxCLGVBQWtCLENBQUMsQ0FBRCxFQUFPO0FBQzNCLFFBQUksS0FBSyxFQUFFLGFBQUYsQ0FBZ0IsWUFBaEIsQ0FBNkIsaUJBQTdCLENBQVQ7QUFDQSxRQUFJLFNBQVMsYUFBVCxDQUF1QixjQUF2QixDQUFKLEVBQTRDO0FBQ3hDLGlCQUFTLGFBQVQsQ0FBdUIsY0FBdkIsRUFBdUMsU0FBdkMsdUVBQWtILEVBQWxIO0FBQ0g7QUFDSixDQUxEOzs7Ozs7Ozs7QUNKQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTSwyQkFBMkI7O0FBRWhDLE9BQU0sRUFBRSxFQUFGLENBQUssWUFBTCxDQUFrQixjQUFsQixFQUYwQjs7QUFJaEMsV0FBVSxNQUpzQjs7QUFNaEMsT0FBTTtBQUNMLFNBQU87QUFDTixZQUFTO0FBREgsR0FERjtBQUlMLGlCQUFlLHlCQUFNO0FBQ3BCLEtBQUUsa0JBQUYsRUFBc0IsWUFBdEIsQ0FBbUMsWUFBbkMsRUFBaUQsRUFBRSxrQkFBRixFQUFzQixtQkFBdEIsR0FBNEMsSUFBN0Y7QUFDQTtBQU5JO0FBTjBCLENBQWpDOztBQWdCQSxJQUFNLGdCQUFnQixTQUFoQixhQUFnQixHQUFNO0FBQzNCLEdBQUUsa0JBQUYsRUFBc0IsRUFBdEIsQ0FBeUIsZUFBekIsRUFBMEMsaUJBQTFDOztBQUVBLEdBQUUsUUFBRixFQUNFLEVBREYsQ0FDSyxPQURMLEVBQ2MsZ0JBRGQsRUFDZ0MsU0FEaEMsRUFFRSxFQUZGLENBRUssT0FGTCxFQUVjLGlCQUZkLEVBRWlDLFVBRmpDLEVBR0UsRUFIRixDQUdLLE9BSEwsRUFHYyxnQkFIZCxFQUdnQyxnQkFIaEMsRUFJRSxFQUpGLENBSUssT0FKTCxFQUljLFFBSmQsRUFJd0IsVUFBQyxDQUFEO0FBQUEsU0FBTyxFQUFFLGVBQUYsRUFBUDtBQUFBLEVBSnhCLEVBS0UsRUFMRixDQUtLLE9BTEwsRUFLYyxZQUxkLEVBSzRCLG9CQUw1QixFQU1FLEVBTkYsQ0FNSyxPQU5MLEVBTWMsVUFOZCxFQU0wQixlQU4xQixFQU9FLEVBUEYsQ0FPSyxPQVBMLEVBT2MsT0FQZCxFQU91QixlQVB2QixFQVFFLEVBUkYsQ0FRSyxRQVJMLEVBUWUsaUJBUmYsRUFRa0MsV0FSbEMsRUFTRSxFQVRGLENBU0ssT0FUTCxFQVNjLGtCQVRkLEVBU2tDLGdCQVRsQyxFQVVFLEVBVkYsQ0FVSyxPQVZMLEVBVWMsa0JBVmQsRUFVa0MsZ0JBVmxDLEVBV0UsRUFYRixDQVdLLFFBWEwsRUFXZSxpQkFYZixFQVdrQyxrQkFYbEM7O0FBYUE7QUFDQTtBQUNBLENBbEJEOztBQW9CQSxJQUFNLG1CQUFtQixTQUFuQixnQkFBbUIsQ0FBQyxDQUFELEVBQU87QUFDL0IsWUFBVyxDQUFYO0FBQ0EsVUFBUyxhQUFULENBQXVCLGlCQUF2QixFQUEwQyxLQUExQyxDQUFnRCxPQUFoRCxHQUEwRCxPQUExRDtBQUNBLENBSEQ7O0FBS0EsSUFBSSxlQUFlLElBQW5CO0FBQ0EsSUFBTSxrQkFBa0IsU0FBbEIsZUFBa0IsQ0FBQyxDQUFELEVBQU87QUFDOUIsS0FBSSxRQUFRLEVBQUUsYUFBZDtBQUNBLEtBQUksTUFBTSxZQUFOLENBQW1CLE1BQW5CLE1BQStCLE9BQW5DLEVBQTRDO0FBQzNDLGVBQWEsWUFBYjtBQUNBLGlCQUFlLFdBQVcsWUFBTTtBQUMvQixPQUFJLE1BQU0sU0FBUyxNQUFNLEtBQWYsQ0FBVjs7QUFFQSxPQUFJLE9BQU8sRUFBWCxFQUFlO0FBQ2QsYUFBUyxhQUFULENBQXVCLGlCQUF2QixFQUEwQyxTQUExQyxHQUFzRCxFQUF0RDtBQUNBLElBRkQsTUFFTztBQUNOLGFBQVMsYUFBVCxDQUF1QixpQkFBdkIsRUFBMEMsU0FBMUMsR0FBc0QseUNBQXREO0FBQ0E7QUFDRCxHQVJjLEVBUVosR0FSWSxDQUFmO0FBU0E7QUFDRCxDQWREOztBQWdCQSxJQUFJLG1CQUFtQixDQUF2Qjs7QUFFQSxJQUFNLGNBQWMsU0FBZCxXQUFjLENBQUMsQ0FBRCxFQUFPO0FBQzFCLEtBQUksUUFBUSxFQUFFLGFBQUYsQ0FBZ0IsWUFBaEIsQ0FBNkIsWUFBN0IsQ0FBWjs7QUFFQSxHQUFFLGFBQUYsQ0FBZ0IsT0FBaEIsQ0FBd0IsUUFBeEIsRUFBa0MsZ0JBQWxDLENBQW1ELGtCQUFuRCxFQUF1RSxPQUF2RSxDQUErRSxVQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVk7QUFDMUYsTUFBSSxTQUFKLENBQWMsTUFBZCxDQUFxQixRQUFyQjtBQUNBLE1BQUksYUFBSixDQUFrQixPQUFsQixFQUEyQixPQUEzQixHQUFxQyxLQUFyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQVhEO0FBWUEsR0FBRSxhQUFGLENBQWdCLE9BQWhCLEdBQTBCLElBQTFCO0FBQ0EsR0FBRSxhQUFGLENBQWdCLFVBQWhCLENBQTJCLFNBQTNCLENBQXFDLEdBQXJDLENBQXlDLFFBQXpDO0FBQ0EsQ0FqQkQ7O0FBbUJBLElBQU0scUJBQXFCLFNBQXJCLGtCQUFxQixDQUFDLENBQUQsRUFBTztBQUNqQyxLQUFJLE9BQU8sRUFBRSxhQUFGLENBQWdCLEtBQTNCO0FBQ0EsU0FBUSxHQUFSLENBQVksSUFBWjs7QUFFQSxLQUFJLFNBQVMsYUFBVCxDQUF1QixnQkFBdkIsQ0FBSixFQUNDLFNBQVMsYUFBVCxDQUF1QixnQkFBdkIsRUFBeUMsS0FBekMsQ0FBK0MsT0FBL0MsR0FBeUQsU0FBUyxNQUFULEdBQWtCLE9BQWxCLEdBQTJCLE1BQXBGO0FBRUQsQ0FQRDs7QUFTQSxJQUFNLFlBQVksU0FBWixTQUFZLENBQUMsQ0FBRCxFQUFPO0FBQ3hCLEtBQUksT0FBTyxFQUFFLGFBQUYsQ0FBZ0IsWUFBaEIsQ0FBNkIsWUFBN0IsQ0FBWDtBQUNBLEtBQUksZUFBTyxPQUFYLEVBQW9CO0FBQ25CLHFCQUFtQixPQUFPLFdBQTFCO0FBQ0EsV0FBUyxhQUFULENBQXVCLE1BQXZCLEVBQStCLFNBQS9CLENBQXlDLEdBQXpDLENBQTZDLE9BQTdDO0FBQ0E7O0FBRUQsR0FBRSxrQkFBRixFQUFzQixZQUF0QixDQUFtQztBQUNsQyxrQkFBZ0IsTUFEa0I7QUFFbEMsZUFBYSxjQUZxQjtBQUdsQyxxQkFBbUIsMkJBQVUsMEJBQVYsRUFBc0MsbUJBQXRDLEVBQTJEO0FBQzdFLFVBQU8sb0JBQW9CLElBQTNCO0FBQ0EsR0FMaUM7QUFNbEMsc0JBQW9CO0FBTmMsRUFBbkM7QUFRQTs7QUFFQSxHQUFFLGdCQUFGLEVBQW9CLFlBQXBCLENBQWlDO0FBQ2hDLGtCQUFnQixNQURnQjtBQUVoQyxlQUFhLGNBRm1CO0FBR2hDLHNCQUFvQixFQUhZO0FBSWhDLG9CQUFrQjtBQUpjLEVBQWpDOztBQU9BLEdBQUUsY0FBRixFQUFrQixZQUFsQixDQUErQjtBQUM5QixrQkFBZ0IsTUFEYztBQUU5QixlQUFhLGNBRmlCO0FBRzlCLHNCQUFvQixFQUhVO0FBSTlCLG9CQUFrQjtBQUpZLEVBQS9COztBQU9BLEdBQUUsaUJBQUYsRUFBcUIsWUFBckIsQ0FBa0M7QUFDakMsa0JBQWdCLE1BRGlCO0FBRWpDLGVBQWEsY0FGb0I7QUFHakMsc0JBQW9CLEVBSGE7QUFJakMsb0JBQWtCO0FBSmUsRUFBbEM7O0FBT0EsVUFBUyxhQUFULGNBQWtDLElBQWxDLEVBQTBDLEtBQTFDLENBQWdELE9BQWhELEdBQTBELE9BQTFEO0FBQ0EsQ0F2Q0Q7O0FBeUNBLElBQU0sYUFBYSxTQUFiLFVBQWEsQ0FBQyxDQUFELEVBQU87QUFDekIsS0FBSSxTQUFTLEVBQUUsYUFBZjtBQUNBLEtBQUksZUFBTyxPQUFYLEVBQW9CO0FBQ25CLFdBQVMsYUFBVCxDQUF1QixNQUF2QixFQUErQixTQUEvQixDQUF5QyxNQUF6QyxDQUFnRCxPQUFoRDtBQUNBLFNBQU8sUUFBUCxDQUFnQixDQUFoQixFQUFtQixnQkFBbkI7QUFDQTtBQUNELEdBQUUsa0JBQUYsRUFBc0IsWUFBdEIsQ0FBbUMsU0FBbkM7O0FBRUEsUUFBTyxPQUFQLENBQWUsUUFBZixFQUF5QixnQkFBekIsQ0FBMEMsT0FBMUMsRUFBbUQsT0FBbkQsQ0FBMkQsVUFBQyxDQUFEO0FBQUEsU0FBTyxFQUFFLEtBQUYsR0FBVSxFQUFqQjtBQUFBLEVBQTNEO0FBQ0EsUUFBTyxPQUFQLENBQWUsWUFBZixFQUE2QixLQUE3QixDQUFtQyxPQUFuQyxHQUE2QyxNQUE3QztBQUNBLENBVkQ7O0FBWUEsSUFBTSx1QkFBdUIsU0FBdkIsb0JBQXVCLENBQUMsQ0FBRCxFQUFPO0FBQ25DLEtBQUksUUFBUSxLQUFaO0FBQUEsS0FDQyxTQUFTLEVBQUUsYUFBRixDQUFnQixnQkFBaEIsQ0FBaUMsOEJBQWpDLENBRFY7QUFFQSxNQUFLLElBQUksQ0FBVCxJQUFjLE1BQWQsRUFBc0I7QUFDckIsTUFBSSxPQUFPLENBQVAsRUFBVSxLQUFWLElBQ0EsT0FBTyxDQUFQLEVBQVUsS0FBVixDQUFnQixNQUFoQixLQUEyQixDQUQzQixJQUVBLE9BQU8sQ0FBUCxFQUFVLFlBQVYsQ0FBdUIsTUFBdkIsTUFBbUMsU0FGdkMsRUFFa0Q7QUFDakQsV0FBUSxJQUFSO0FBQ0E7QUFDQTtBQUNEOztBQUVELEtBQUksQ0FBQyxLQUFMLEVBQVk7QUFDWCxJQUFFLGtCQUFGLEVBQXNCLFlBQXRCLENBQW1DLFNBQW5DOztBQUVBLElBQUUsYUFBRixDQUFnQixhQUFoQixDQUE4QixRQUE5QixFQUF3QyxnQkFBeEMsQ0FBeUQsT0FBekQsRUFBa0UsT0FBbEUsQ0FBMEUsVUFBQyxDQUFEO0FBQUEsVUFBTyxFQUFFLEtBQUYsR0FBVSxFQUFqQjtBQUFBLEdBQTFFO0FBQ0EsSUFBRSxhQUFGLENBQWdCLEtBQWhCLENBQXNCLE9BQXRCLEdBQWdDLE1BQWhDO0FBQ0E7QUFFRCxDQW5CRDs7QUFxQkEsSUFBTSxpQkFBaUIsU0FBakIsY0FBaUIsQ0FBQyxRQUFELEVBQWM7QUFDcEMsS0FBSSx1QkFBVSxnQkFBVixLQUErQix1QkFBVSxnQkFBVixFQUE0QixNQUE1QixHQUFxQyxDQUF4RSxFQUEyRSxPQUFPLGNBQVAsR0FBd0IsdUJBQVUsZ0JBQVYsQ0FBeEI7O0FBRTNFLEtBQUksT0FBTyxjQUFYLEVBQTJCOztBQUUxQixXQUFTLE9BQU8sY0FBaEI7QUFDQSxFQUhELE1BR087QUFDTixJQUFFLEdBQUYsQ0FBTSxtQkFBTixFQUEyQixZQUFZLENBQ3RDLENBREQsRUFDRyxPQURILEVBQ1ksTUFEWixDQUNtQixVQUFVLElBQVYsRUFBZ0I7QUFDbEMsT0FBSSxLQUFLLE1BQUwsS0FBZ0IsR0FBcEIsRUFBeUI7QUFDeEIsUUFBSSxjQUFlLFFBQVEsS0FBSyxPQUFkLEdBQXlCLEtBQUssT0FBOUIsR0FBd0MsRUFBMUQ7QUFDQSxXQUFPLGNBQVAsR0FBd0IsV0FBeEI7QUFDQSwyQkFBVSxnQkFBVixFQUE0QixXQUE1QixFQUF5QyxFQUF6QztBQUNBLGFBQVMsV0FBVDtBQUNBO0FBQ0QsR0FSRDtBQVNBO0FBQ0QsQ0FqQkQ7O0FBbUJBLElBQU0sb0JBQW9CLFNBQXBCLGlCQUFvQixDQUFDLENBQUQsRUFBSSxXQUFKLEVBQW9CO0FBQzdDLEdBQUUsYUFBRixDQUFnQixLQUFoQixHQUF3QixZQUFZLElBQXBDO0FBQ0EsS0FBSSxFQUFFLGFBQUYsQ0FBZ0IsWUFBaEIsQ0FBNkIsSUFBN0IsTUFBdUMsaUJBQTNDLEVBQThEO0FBQzdELGFBQVcsWUFBTTtBQUNoQixLQUFFLEVBQUUsYUFBSixFQUFtQixJQUFuQjtBQUNBLEdBRkQ7QUFHQTtBQUNELENBUEQ7O0FBU0EsSUFBTSxxQkFBcUIsU0FBckIsa0JBQXFCLEdBQU07QUFDaEMsS0FBSSxNQUFNLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFWO0FBQ0EsS0FBSSxTQUFKLEdBQWdCLGdCQUFoQjtBQUNBLEtBQUksWUFBSixDQUFpQixJQUFqQixFQUF1QixnQkFBdkI7QUFDQSxLQUFJLFNBQUosR0FBZ0IsdUVBQ2YseU9BREQ7QUFFQSxLQUFJLGFBQUosQ0FBa0Isd0JBQWxCLEVBQTRDLGdCQUE1QyxDQUE2RCxPQUE3RCxFQUFzRSxpQkFBdEU7O0FBRUEsVUFBUyxhQUFULENBQXVCLE1BQXZCLEVBQStCLFlBQS9CLENBQTRDLEdBQTVDLEVBQWlELFNBQVMsYUFBVCxDQUF1QixTQUF2QixDQUFqRDtBQUNBLENBVEQ7O0FBV0EsSUFBTSxvQkFBb0IsU0FBcEIsaUJBQW9CLEdBQU07QUFDL0Isd0JBQVUsZUFBVixFQUEyQixJQUEzQixFQUFpQyxHQUFqQztBQUNBLFVBQVMsYUFBVCxDQUF1QixpQkFBdkIsRUFBMEMsTUFBMUM7QUFDQSxDQUhEOztBQUtBLElBQU0sb0JBQW9CLFNBQXBCLGlCQUFvQixHQUFNO0FBQy9CLEtBQUksQ0FBQyx1QkFBVSxlQUFWLENBQUwsRUFDQztBQUNELENBSEQ7O0FBS0EsSUFBTSxrQkFBa0IsU0FBbEIsZUFBa0IsQ0FBQyxDQUFELEVBQU87QUFDOUIsS0FBSSxLQUFLLEVBQUUsYUFBWDs7QUFFQSxJQUFHLEtBQUgsQ0FBUyxNQUFULEdBQWtCLE1BQWxCO0FBQ0EsSUFBRyxLQUFILENBQVMsTUFBVCxHQUFrQixHQUFHLFlBQUgsR0FBa0IsSUFBcEM7QUFDQSxDQUxEOztBQU9BLElBQU0sb0JBQW9CLFNBQXBCLGlCQUFvQixDQUFDLE1BQUQsRUFBWTtBQUNyQyxLQUFJLFdBQVcsU0FBUyxjQUFULENBQXdCLGlCQUF4QixDQUFmO0FBQ0EsS0FBSSxXQUFXLFNBQVMsY0FBVCxDQUF3QixpQkFBeEIsQ0FBZjs7QUFFQSxVQUFTLEtBQVQsR0FBaUIsU0FBUyxPQUFPLENBQVAsQ0FBVCxDQUFqQjtBQUNBLFVBQVMsS0FBVCxHQUFpQixTQUFTLE9BQU8sQ0FBUCxDQUFULENBQWpCO0FBQ0EsQ0FORDs7QUFRQSxJQUFJLEtBQUssSUFBVDtBQUNBLElBQU0sbUJBQW1CLFNBQW5CLGdCQUFtQixDQUFDLENBQUQsRUFBTztBQUMvQixLQUFNLFNBQVMsU0FBUyxjQUFULENBQXdCLGFBQXhCLENBQWY7QUFDQSxLQUFJLFVBQVUsRUFBRSxhQUFoQjtBQUNBLEtBQUksTUFBTSxTQUFTLFFBQVEsWUFBUixDQUFxQixLQUFyQixDQUFULENBQVY7QUFBQSxLQUNDLE1BQU0sU0FBUyxRQUFRLFlBQVIsQ0FBcUIsS0FBckIsQ0FBVCxDQURQO0FBRUEsS0FBSSxXQUFXLFNBQVMsY0FBVCxDQUF3QixpQkFBeEIsQ0FBZjtBQUNBLEtBQUksV0FBVyxTQUFTLGNBQVQsQ0FBd0IsaUJBQXhCLENBQWY7O0FBRUEsY0FBYSxFQUFiO0FBQ0EsTUFBSyxXQUFXLFlBQU07QUFDckIsVUFBUSxHQUFSLENBQVksUUFBUSxLQUFwQjtBQUNBLE1BQUksWUFBWSxRQUFoQixFQUEwQjtBQUN6QixPQUFJLFNBQVMsUUFBUSxLQUFqQixJQUEwQixTQUFTLFNBQVMsS0FBbEIsQ0FBOUIsRUFDQyxRQUFRLEtBQVIsR0FBZ0IsU0FBUyxLQUF6QjtBQUNELEdBSEQsTUFHTztBQUNOLE9BQUksU0FBUyxRQUFRLEtBQWpCLElBQTBCLFNBQVMsU0FBUyxLQUFsQixDQUE5QixFQUNDLFFBQVEsS0FBUixHQUFnQixTQUFTLEtBQXpCO0FBQ0Q7O0FBRUQsTUFBSSxTQUFTLFFBQVEsS0FBakIsSUFBMEIsR0FBMUIsSUFBaUMsU0FBUyxRQUFRLEtBQWpCLElBQTBCLEdBQTNELElBQWtFLE1BQU0sU0FBUyxRQUFRLEtBQWpCLENBQU4sQ0FBdEUsRUFBc0c7QUFDckcsV0FBUSxLQUFSLEdBQWdCLFFBQVEsWUFBUixDQUFxQixJQUFyQixNQUErQixpQkFBL0IsR0FBbUQsR0FBbkQsR0FBeUQsR0FBekU7QUFDQTs7QUFFRCxTQUFPLFVBQVAsQ0FBa0IsR0FBbEIsQ0FBc0IsQ0FBQyxTQUFTLEtBQVYsRUFBaUIsU0FBUyxLQUExQixDQUF0QjtBQUNBLEVBZkksRUFlRixHQWZFLENBQUw7QUFpQkEsQ0ExQkQ7O0FBNEJBLElBQU0sa0JBQWtCLFNBQWxCLGVBQWtCLEdBQU07QUFDN0IsS0FBSSxTQUFTLFNBQVMsY0FBVCxDQUF3QixhQUF4QixDQUFiO0FBQ0EsS0FBSSxPQUFPLFNBQVMsYUFBVCxDQUF1Qix1QkFBdkIsQ0FBWDs7QUFFQSxLQUFJLFVBQVUsSUFBZCxFQUFvQjs7QUFFbkIsTUFBSSxNQUFNLFNBQVMsS0FBSyxZQUFMLENBQWtCLFVBQWxCLENBQVQsQ0FBVjtBQUNBLE1BQUksTUFBTSxTQUFTLEtBQUssWUFBTCxDQUFrQixVQUFsQixDQUFULENBQVY7O0FBRUEsdUJBQVcsTUFBWCxDQUFrQixNQUFsQixFQUEwQjtBQUN6QixVQUFPLENBQUMsTUFBTSxFQUFQLEVBQVcsTUFBTSxFQUFqQixDQURrQjtBQUV6QixTQUFNLENBRm1CO0FBR3pCLFlBQVMsSUFIZ0I7QUFJekIsVUFBTztBQUNOLFdBQU8sR0FERDtBQUVOLFdBQU87QUFGRDtBQUprQixHQUExQjs7QUFVQSxvQkFBa0IsQ0FBQyxNQUFNLEVBQVAsRUFBVyxNQUFNLEVBQWpCLENBQWxCOztBQUVBLFNBQU8sVUFBUCxDQUFrQixFQUFsQixDQUFxQixRQUFyQixFQUErQixpQkFBL0I7QUFDQTtBQUNELENBdkJEOztrQkEwQmUsYSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bWJvbDtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBnZXRSYXdUYWcgPSByZXF1aXJlKCcuL19nZXRSYXdUYWcnKSxcbiAgICBvYmplY3RUb1N0cmluZyA9IHJlcXVpcmUoJy4vX29iamVjdFRvU3RyaW5nJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRUYWc7XG4iLCIvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZyZWVHbG9iYWw7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRSYXdUYWc7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RUb1N0cmluZztcbiIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcm9vdDtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBub3cgPSByZXF1aXJlKCcuL25vdycpLFxuICAgIHRvTnVtYmVyID0gcmVxdWlyZSgnLi90b051bWJlcicpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlYm91bmNlZCBmdW5jdGlvbiB0aGF0IGRlbGF5cyBpbnZva2luZyBgZnVuY2AgdW50aWwgYWZ0ZXIgYHdhaXRgXG4gKiBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3YXNcbiAqIGludm9rZWQuIFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgIG1ldGhvZCB0byBjYW5jZWxcbiAqIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLlxuICogUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2Agc2hvdWxkIGJlIGludm9rZWQgb24gdGhlXG4gKiBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkXG4gKiB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50XG4gKiBjYWxscyB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYFxuICogaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy5kZWJvdW5jZWAgYW5kIGBfLnRocm90dGxlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdXG4gKiAgVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZSBkZWxheWVkIGJlZm9yZSBpdCdzIGludm9rZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgY29zdGx5IGNhbGN1bGF0aW9ucyB3aGlsZSB0aGUgd2luZG93IHNpemUgaXMgaW4gZmx1eC5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKGNhbGN1bGF0ZUxheW91dCwgMTUwKSk7XG4gKlxuICogLy8gSW52b2tlIGBzZW5kTWFpbGAgd2hlbiBjbGlja2VkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHMuXG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgXy5kZWJvdW5jZShzZW5kTWFpbCwgMzAwLCB7XG4gKiAgICdsZWFkaW5nJzogdHJ1ZSxcbiAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAqIH0pKTtcbiAqXG4gKiAvLyBFbnN1cmUgYGJhdGNoTG9nYCBpcyBpbnZva2VkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzLlxuICogdmFyIGRlYm91bmNlZCA9IF8uZGVib3VuY2UoYmF0Y2hMb2csIDI1MCwgeyAnbWF4V2FpdCc6IDEwMDAgfSk7XG4gKiB2YXIgc291cmNlID0gbmV3IEV2ZW50U291cmNlKCcvc3RyZWFtJyk7XG4gKiBqUXVlcnkoc291cmNlKS5vbignbWVzc2FnZScsIGRlYm91bmNlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyBkZWJvdW5jZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGRlYm91bmNlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsYXN0QXJncyxcbiAgICAgIGxhc3RUaGlzLFxuICAgICAgbWF4V2FpdCxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHRpbWVySWQsXG4gICAgICBsYXN0Q2FsbFRpbWUsXG4gICAgICBsYXN0SW52b2tlVGltZSA9IDAsXG4gICAgICBsZWFkaW5nID0gZmFsc2UsXG4gICAgICBtYXhpbmcgPSBmYWxzZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB3YWl0ID0gdG9OdW1iZXIod2FpdCkgfHwgMDtcbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICEhb3B0aW9ucy5sZWFkaW5nO1xuICAgIG1heGluZyA9ICdtYXhXYWl0JyBpbiBvcHRpb25zO1xuICAgIG1heFdhaXQgPSBtYXhpbmcgPyBuYXRpdmVNYXgodG9OdW1iZXIob3B0aW9ucy5tYXhXYWl0KSB8fCAwLCB3YWl0KSA6IG1heFdhaXQ7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZUZ1bmModGltZSkge1xuICAgIHZhciBhcmdzID0gbGFzdEFyZ3MsXG4gICAgICAgIHRoaXNBcmcgPSBsYXN0VGhpcztcblxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYWRpbmdFZGdlKHRpbWUpIHtcbiAgICAvLyBSZXNldCBhbnkgYG1heFdhaXRgIHRpbWVyLlxuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICAvLyBTdGFydCB0aGUgdGltZXIgZm9yIHRoZSB0cmFpbGluZyBlZGdlLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgLy8gSW52b2tlIHRoZSBsZWFkaW5nIGVkZ2UuXG4gICAgcmV0dXJuIGxlYWRpbmcgPyBpbnZva2VGdW5jKHRpbWUpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtYWluaW5nV2FpdCh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZSxcbiAgICAgICAgdGltZVdhaXRpbmcgPSB3YWl0IC0gdGltZVNpbmNlTGFzdENhbGw7XG5cbiAgICByZXR1cm4gbWF4aW5nXG4gICAgICA/IG5hdGl2ZU1pbih0aW1lV2FpdGluZywgbWF4V2FpdCAtIHRpbWVTaW5jZUxhc3RJbnZva2UpXG4gICAgICA6IHRpbWVXYWl0aW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkSW52b2tlKHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lO1xuXG4gICAgLy8gRWl0aGVyIHRoaXMgaXMgdGhlIGZpcnN0IGNhbGwsIGFjdGl2aXR5IGhhcyBzdG9wcGVkIGFuZCB3ZSdyZSBhdCB0aGVcbiAgICAvLyB0cmFpbGluZyBlZGdlLCB0aGUgc3lzdGVtIHRpbWUgaGFzIGdvbmUgYmFja3dhcmRzIGFuZCB3ZSdyZSB0cmVhdGluZ1xuICAgIC8vIGl0IGFzIHRoZSB0cmFpbGluZyBlZGdlLCBvciB3ZSd2ZSBoaXQgdGhlIGBtYXhXYWl0YCBsaW1pdC5cbiAgICByZXR1cm4gKGxhc3RDYWxsVGltZSA9PT0gdW5kZWZpbmVkIHx8ICh0aW1lU2luY2VMYXN0Q2FsbCA+PSB3YWl0KSB8fFxuICAgICAgKHRpbWVTaW5jZUxhc3RDYWxsIDwgMCkgfHwgKG1heGluZyAmJiB0aW1lU2luY2VMYXN0SW52b2tlID49IG1heFdhaXQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVyRXhwaXJlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpO1xuICAgIGlmIChzaG91bGRJbnZva2UodGltZSkpIHtcbiAgICAgIHJldHVybiB0cmFpbGluZ0VkZ2UodGltZSk7XG4gICAgfVxuICAgIC8vIFJlc3RhcnQgdGhlIHRpbWVyLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgcmVtYWluaW5nV2FpdCh0aW1lKSk7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFpbGluZ0VkZ2UodGltZSkge1xuICAgIHRpbWVySWQgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBPbmx5IGludm9rZSBpZiB3ZSBoYXZlIGBsYXN0QXJnc2Agd2hpY2ggbWVhbnMgYGZ1bmNgIGhhcyBiZWVuXG4gICAgLy8gZGVib3VuY2VkIGF0IGxlYXN0IG9uY2UuXG4gICAgaWYgKHRyYWlsaW5nICYmIGxhc3RBcmdzKSB7XG4gICAgICByZXR1cm4gaW52b2tlRnVuYyh0aW1lKTtcbiAgICB9XG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIGlmICh0aW1lcklkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICB9XG4gICAgbGFzdEludm9rZVRpbWUgPSAwO1xuICAgIGxhc3RBcmdzID0gbGFzdENhbGxUaW1lID0gbGFzdFRoaXMgPSB0aW1lcklkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgcmV0dXJuIHRpbWVySWQgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IHRyYWlsaW5nRWRnZShub3coKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKSxcbiAgICAgICAgaXNJbnZva2luZyA9IHNob3VsZEludm9rZSh0aW1lKTtcblxuICAgIGxhc3RBcmdzID0gYXJndW1lbnRzO1xuICAgIGxhc3RUaGlzID0gdGhpcztcbiAgICBsYXN0Q2FsbFRpbWUgPSB0aW1lO1xuXG4gICAgaWYgKGlzSW52b2tpbmcpIHtcbiAgICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGxlYWRpbmdFZGdlKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgICBpZiAobWF4aW5nKSB7XG4gICAgICAgIC8vIEhhbmRsZSBpbnZvY2F0aW9ucyBpbiBhIHRpZ2h0IGxvb3AuXG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgICAgIHJldHVybiBpbnZva2VGdW5jKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgZGVib3VuY2VkLmZsdXNoID0gZmx1c2g7XG4gIHJldHVybiBkZWJvdW5jZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVib3VuY2U7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0TGlrZTtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1N5bWJvbDtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKipcbiAqIEdldHMgdGhlIHRpbWVzdGFtcCBvZiB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IGhhdmUgZWxhcHNlZCBzaW5jZVxuICogdGhlIFVuaXggZXBvY2ggKDEgSmFudWFyeSAxOTcwIDAwOjAwOjAwIFVUQykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IERhdGVcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHRpbWVzdGFtcC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZlcihmdW5jdGlvbihzdGFtcCkge1xuICogICBjb25zb2xlLmxvZyhfLm5vdygpIC0gc3RhbXApO1xuICogfSwgXy5ub3coKSk7XG4gKiAvLyA9PiBMb2dzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGl0IHRvb2sgZm9yIHRoZSBkZWZlcnJlZCBpbnZvY2F0aW9uLlxuICovXG52YXIgbm93ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiByb290LkRhdGUubm93KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5vdztcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltID0gL15cXHMrfFxccyskL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvTnVtYmVyO1xuIiwiLyohIG5vdWlzbGlkZXIgLSAxMy4xLjEgLSAyLzE0LzIwMTkgKi9cbihmdW5jdGlvbihmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICAgICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIC8vIE5vZGUvQ29tbW9uSlNcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzXG4gICAgICAgIHdpbmRvdy5ub1VpU2xpZGVyID0gZmFjdG9yeSgpO1xuICAgIH1cbn0pKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFZFUlNJT04gPSBcIjEzLjEuMVwiO1xuXG4gICAgLy9yZWdpb24gSGVscGVyIE1ldGhvZHNcblxuICAgIGZ1bmN0aW9uIGlzVmFsaWRGb3JtYXR0ZXIoZW50cnkpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBlbnRyeSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgZW50cnkudG8gPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgZW50cnkuZnJvbSA9PT0gXCJmdW5jdGlvblwiO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUVsZW1lbnQoZWwpIHtcbiAgICAgICAgZWwucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChlbCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNTZXQodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLy8gQmluZGFibGUgdmVyc2lvblxuICAgIGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0KGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZXMgZHVwbGljYXRlcyBmcm9tIGFuIGFycmF5LlxuICAgIGZ1bmN0aW9uIHVuaXF1ZShhcnJheSkge1xuICAgICAgICByZXR1cm4gYXJyYXkuZmlsdGVyKGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgICAgIHJldHVybiAhdGhpc1thXSA/ICh0aGlzW2FdID0gdHJ1ZSkgOiBmYWxzZTtcbiAgICAgICAgfSwge30pO1xuICAgIH1cblxuICAgIC8vIFJvdW5kIGEgdmFsdWUgdG8gdGhlIGNsb3Nlc3QgJ3RvJy5cbiAgICBmdW5jdGlvbiBjbG9zZXN0KHZhbHVlLCB0bykge1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh2YWx1ZSAvIHRvKSAqIHRvO1xuICAgIH1cblxuICAgIC8vIEN1cnJlbnQgcG9zaXRpb24gb2YgYW4gZWxlbWVudCByZWxhdGl2ZSB0byB0aGUgZG9jdW1lbnQuXG4gICAgZnVuY3Rpb24gb2Zmc2V0KGVsZW0sIG9yaWVudGF0aW9uKSB7XG4gICAgICAgIHZhciByZWN0ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdmFyIGRvYyA9IGVsZW0ub3duZXJEb2N1bWVudDtcbiAgICAgICAgdmFyIGRvY0VsZW0gPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICB2YXIgcGFnZU9mZnNldCA9IGdldFBhZ2VPZmZzZXQoZG9jKTtcblxuICAgICAgICAvLyBnZXRCb3VuZGluZ0NsaWVudFJlY3QgY29udGFpbnMgbGVmdCBzY3JvbGwgaW4gQ2hyb21lIG9uIEFuZHJvaWQuXG4gICAgICAgIC8vIEkgaGF2ZW4ndCBmb3VuZCBhIGZlYXR1cmUgZGV0ZWN0aW9uIHRoYXQgcHJvdmVzIHRoaXMuIFdvcnN0IGNhc2VcbiAgICAgICAgLy8gc2NlbmFyaW8gb24gbWlzLW1hdGNoOiB0aGUgJ3RhcCcgZmVhdHVyZSBvbiBob3Jpem9udGFsIHNsaWRlcnMgYnJlYWtzLlxuICAgICAgICBpZiAoL3dlYmtpdC4qQ2hyb21lLipNb2JpbGUvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG4gICAgICAgICAgICBwYWdlT2Zmc2V0LnggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9yaWVudGF0aW9uXG4gICAgICAgICAgICA/IHJlY3QudG9wICsgcGFnZU9mZnNldC55IC0gZG9jRWxlbS5jbGllbnRUb3BcbiAgICAgICAgICAgIDogcmVjdC5sZWZ0ICsgcGFnZU9mZnNldC54IC0gZG9jRWxlbS5jbGllbnRMZWZ0O1xuICAgIH1cblxuICAgIC8vIENoZWNrcyB3aGV0aGVyIGEgdmFsdWUgaXMgbnVtZXJpY2FsLlxuICAgIGZ1bmN0aW9uIGlzTnVtZXJpYyhhKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgYSA9PT0gXCJudW1iZXJcIiAmJiAhaXNOYU4oYSkgJiYgaXNGaW5pdGUoYSk7XG4gICAgfVxuXG4gICAgLy8gU2V0cyBhIGNsYXNzIGFuZCByZW1vdmVzIGl0IGFmdGVyIFtkdXJhdGlvbl0gbXMuXG4gICAgZnVuY3Rpb24gYWRkQ2xhc3NGb3IoZWxlbWVudCwgY2xhc3NOYW1lLCBkdXJhdGlvbikge1xuICAgICAgICBpZiAoZHVyYXRpb24gPiAwKSB7XG4gICAgICAgICAgICBhZGRDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZW1vdmVDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpO1xuICAgICAgICAgICAgfSwgZHVyYXRpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTGltaXRzIGEgdmFsdWUgdG8gMCAtIDEwMFxuICAgIGZ1bmN0aW9uIGxpbWl0KGEpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KE1hdGgubWluKGEsIDEwMCksIDApO1xuICAgIH1cblxuICAgIC8vIFdyYXBzIGEgdmFyaWFibGUgYXMgYW4gYXJyYXksIGlmIGl0IGlzbid0IG9uZSB5ZXQuXG4gICAgLy8gTm90ZSB0aGF0IGFuIGlucHV0IGFycmF5IGlzIHJldHVybmVkIGJ5IHJlZmVyZW5jZSFcbiAgICBmdW5jdGlvbiBhc0FycmF5KGEpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYSkgPyBhIDogW2FdO1xuICAgIH1cblxuICAgIC8vIENvdW50cyBkZWNpbWFsc1xuICAgIGZ1bmN0aW9uIGNvdW50RGVjaW1hbHMobnVtU3RyKSB7XG4gICAgICAgIG51bVN0ciA9IFN0cmluZyhudW1TdHIpO1xuICAgICAgICB2YXIgcGllY2VzID0gbnVtU3RyLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgcmV0dXJuIHBpZWNlcy5sZW5ndGggPiAxID8gcGllY2VzWzFdLmxlbmd0aCA6IDA7XG4gICAgfVxuXG4gICAgLy8gaHR0cDovL3lvdW1pZ2h0bm90bmVlZGpxdWVyeS5jb20vI2FkZF9jbGFzc1xuICAgIGZ1bmN0aW9uIGFkZENsYXNzKGVsLCBjbGFzc05hbWUpIHtcbiAgICAgICAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWwuY2xhc3NOYW1lICs9IFwiIFwiICsgY2xhc3NOYW1lO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gaHR0cDovL3lvdW1pZ2h0bm90bmVlZGpxdWVyeS5jb20vI3JlbW92ZV9jbGFzc1xuICAgIGZ1bmN0aW9uIHJlbW92ZUNsYXNzKGVsLCBjbGFzc05hbWUpIHtcbiAgICAgICAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgbmV3IFJlZ0V4cChcIihefFxcXFxiKVwiICsgY2xhc3NOYW1lLnNwbGl0KFwiIFwiKS5qb2luKFwifFwiKSArIFwiKFxcXFxifCQpXCIsIFwiZ2lcIiksXG4gICAgICAgICAgICAgICAgXCIgXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBodHRwczovL3BsYWluanMuY29tL2phdmFzY3JpcHQvYXR0cmlidXRlcy9hZGRpbmctcmVtb3ZpbmctYW5kLXRlc3RpbmctZm9yLWNsYXNzZXMtOS9cbiAgICBmdW5jdGlvbiBoYXNDbGFzcyhlbCwgY2xhc3NOYW1lKSB7XG4gICAgICAgIHJldHVybiBlbC5jbGFzc0xpc3RcbiAgICAgICAgICAgID8gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSlcbiAgICAgICAgICAgIDogbmV3IFJlZ0V4cChcIlxcXFxiXCIgKyBjbGFzc05hbWUgKyBcIlxcXFxiXCIpLnRlc3QoZWwuY2xhc3NOYW1lKTtcbiAgICB9XG5cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2luZG93L3Njcm9sbFkjTm90ZXNcbiAgICBmdW5jdGlvbiBnZXRQYWdlT2Zmc2V0KGRvYykge1xuICAgICAgICB2YXIgc3VwcG9ydFBhZ2VPZmZzZXQgPSB3aW5kb3cucGFnZVhPZmZzZXQgIT09IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIGlzQ1NTMUNvbXBhdCA9IChkb2MuY29tcGF0TW9kZSB8fCBcIlwiKSA9PT0gXCJDU1MxQ29tcGF0XCI7XG4gICAgICAgIHZhciB4ID0gc3VwcG9ydFBhZ2VPZmZzZXRcbiAgICAgICAgICAgID8gd2luZG93LnBhZ2VYT2Zmc2V0XG4gICAgICAgICAgICA6IGlzQ1NTMUNvbXBhdFxuICAgICAgICAgICAgICAgID8gZG9jLmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0XG4gICAgICAgICAgICAgICAgOiBkb2MuYm9keS5zY3JvbGxMZWZ0O1xuICAgICAgICB2YXIgeSA9IHN1cHBvcnRQYWdlT2Zmc2V0XG4gICAgICAgICAgICA/IHdpbmRvdy5wYWdlWU9mZnNldFxuICAgICAgICAgICAgOiBpc0NTUzFDb21wYXRcbiAgICAgICAgICAgICAgICA/IGRvYy5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wXG4gICAgICAgICAgICAgICAgOiBkb2MuYm9keS5zY3JvbGxUb3A7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gd2UgcHJvdmlkZSBhIGZ1bmN0aW9uIHRvIGNvbXB1dGUgY29uc3RhbnRzIGluc3RlYWRcbiAgICAvLyBvZiBhY2Nlc3Npbmcgd2luZG93LiogYXMgc29vbiBhcyB0aGUgbW9kdWxlIG5lZWRzIGl0XG4gICAgLy8gc28gdGhhdCB3ZSBkbyBub3QgY29tcHV0ZSBhbnl0aGluZyBpZiBub3QgbmVlZGVkXG4gICAgZnVuY3Rpb24gZ2V0QWN0aW9ucygpIHtcbiAgICAgICAgLy8gRGV0ZXJtaW5lIHRoZSBldmVudHMgdG8gYmluZC4gSUUxMSBpbXBsZW1lbnRzIHBvaW50ZXJFdmVudHMgd2l0aG91dFxuICAgICAgICAvLyBhIHByZWZpeCwgd2hpY2ggYnJlYWtzIGNvbXBhdGliaWxpdHkgd2l0aCB0aGUgSUUxMCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgcmV0dXJuIHdpbmRvdy5uYXZpZ2F0b3IucG9pbnRlckVuYWJsZWRcbiAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgICAgc3RhcnQ6IFwicG9pbnRlcmRvd25cIixcbiAgICAgICAgICAgICAgICAgIG1vdmU6IFwicG9pbnRlcm1vdmVcIixcbiAgICAgICAgICAgICAgICAgIGVuZDogXCJwb2ludGVydXBcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA6IHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZFxuICAgICAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBcIk1TUG9pbnRlckRvd25cIixcbiAgICAgICAgICAgICAgICAgICAgICBtb3ZlOiBcIk1TUG9pbnRlck1vdmVcIixcbiAgICAgICAgICAgICAgICAgICAgICBlbmQ6IFwiTVNQb2ludGVyVXBcIlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBcIm1vdXNlZG93biB0b3VjaHN0YXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgbW92ZTogXCJtb3VzZW1vdmUgdG91Y2htb3ZlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgZW5kOiBcIm1vdXNldXAgdG91Y2hlbmRcIlxuICAgICAgICAgICAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vV0lDRy9FdmVudExpc3RlbmVyT3B0aW9ucy9ibG9iL2doLXBhZ2VzL2V4cGxhaW5lci5tZFxuICAgIC8vIElzc3VlICM3ODVcbiAgICBmdW5jdGlvbiBnZXRTdXBwb3J0c1Bhc3NpdmUoKSB7XG4gICAgICAgIHZhciBzdXBwb3J0c1Bhc3NpdmUgPSBmYWxzZTtcblxuICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSAqL1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIG9wdHMgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sIFwicGFzc2l2ZVwiLCB7XG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VwcG9ydHNQYXNzaXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0ZXN0XCIsIG51bGwsIG9wdHMpO1xuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICAvKiBlc2xpbnQtZW5hYmxlICovXG5cbiAgICAgICAgcmV0dXJuIHN1cHBvcnRzUGFzc2l2ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTdXBwb3J0c1RvdWNoQWN0aW9uTm9uZSgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5DU1MgJiYgQ1NTLnN1cHBvcnRzICYmIENTUy5zdXBwb3J0cyhcInRvdWNoLWFjdGlvblwiLCBcIm5vbmVcIik7XG4gICAgfVxuXG4gICAgLy9lbmRyZWdpb25cblxuICAgIC8vcmVnaW9uIFJhbmdlIENhbGN1bGF0aW9uXG5cbiAgICAvLyBEZXRlcm1pbmUgdGhlIHNpemUgb2YgYSBzdWItcmFuZ2UgaW4gcmVsYXRpb24gdG8gYSBmdWxsIHJhbmdlLlxuICAgIGZ1bmN0aW9uIHN1YlJhbmdlUmF0aW8ocGEsIHBiKSB7XG4gICAgICAgIHJldHVybiAxMDAgLyAocGIgLSBwYSk7XG4gICAgfVxuXG4gICAgLy8gKHBlcmNlbnRhZ2UpIEhvdyBtYW55IHBlcmNlbnQgaXMgdGhpcyB2YWx1ZSBvZiB0aGlzIHJhbmdlP1xuICAgIGZ1bmN0aW9uIGZyb21QZXJjZW50YWdlKHJhbmdlLCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gKHZhbHVlICogMTAwKSAvIChyYW5nZVsxXSAtIHJhbmdlWzBdKTtcbiAgICB9XG5cbiAgICAvLyAocGVyY2VudGFnZSkgV2hlcmUgaXMgdGhpcyB2YWx1ZSBvbiB0aGlzIHJhbmdlP1xuICAgIGZ1bmN0aW9uIHRvUGVyY2VudGFnZShyYW5nZSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGZyb21QZXJjZW50YWdlKHJhbmdlLCByYW5nZVswXSA8IDAgPyB2YWx1ZSArIE1hdGguYWJzKHJhbmdlWzBdKSA6IHZhbHVlIC0gcmFuZ2VbMF0pO1xuICAgIH1cblxuICAgIC8vICh2YWx1ZSkgSG93IG11Y2ggaXMgdGhpcyBwZXJjZW50YWdlIG9uIHRoaXMgcmFuZ2U/XG4gICAgZnVuY3Rpb24gaXNQZXJjZW50YWdlKHJhbmdlLCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gKHZhbHVlICogKHJhbmdlWzFdIC0gcmFuZ2VbMF0pKSAvIDEwMCArIHJhbmdlWzBdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEoodmFsdWUsIGFycikge1xuICAgICAgICB2YXIgaiA9IDE7XG5cbiAgICAgICAgd2hpbGUgKHZhbHVlID49IGFycltqXSkge1xuICAgICAgICAgICAgaiArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGo7XG4gICAgfVxuXG4gICAgLy8gKHBlcmNlbnRhZ2UpIElucHV0IGEgdmFsdWUsIGZpbmQgd2hlcmUsIG9uIGEgc2NhbGUgb2YgMC0xMDAsIGl0IGFwcGxpZXMuXG4gICAgZnVuY3Rpb24gdG9TdGVwcGluZyh4VmFsLCB4UGN0LCB2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPj0geFZhbC5zbGljZSgtMSlbMF0pIHtcbiAgICAgICAgICAgIHJldHVybiAxMDA7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaiA9IGdldEoodmFsdWUsIHhWYWwpO1xuICAgICAgICB2YXIgdmEgPSB4VmFsW2ogLSAxXTtcbiAgICAgICAgdmFyIHZiID0geFZhbFtqXTtcbiAgICAgICAgdmFyIHBhID0geFBjdFtqIC0gMV07XG4gICAgICAgIHZhciBwYiA9IHhQY3Rbal07XG5cbiAgICAgICAgcmV0dXJuIHBhICsgdG9QZXJjZW50YWdlKFt2YSwgdmJdLCB2YWx1ZSkgLyBzdWJSYW5nZVJhdGlvKHBhLCBwYik7XG4gICAgfVxuXG4gICAgLy8gKHZhbHVlKSBJbnB1dCBhIHBlcmNlbnRhZ2UsIGZpbmQgd2hlcmUgaXQgaXMgb24gdGhlIHNwZWNpZmllZCByYW5nZS5cbiAgICBmdW5jdGlvbiBmcm9tU3RlcHBpbmcoeFZhbCwgeFBjdCwgdmFsdWUpIHtcbiAgICAgICAgLy8gVGhlcmUgaXMgbm8gcmFuZ2UgZ3JvdXAgdGhhdCBmaXRzIDEwMFxuICAgICAgICBpZiAodmFsdWUgPj0gMTAwKSB7XG4gICAgICAgICAgICByZXR1cm4geFZhbC5zbGljZSgtMSlbMF07XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaiA9IGdldEoodmFsdWUsIHhQY3QpO1xuICAgICAgICB2YXIgdmEgPSB4VmFsW2ogLSAxXTtcbiAgICAgICAgdmFyIHZiID0geFZhbFtqXTtcbiAgICAgICAgdmFyIHBhID0geFBjdFtqIC0gMV07XG4gICAgICAgIHZhciBwYiA9IHhQY3Rbal07XG5cbiAgICAgICAgcmV0dXJuIGlzUGVyY2VudGFnZShbdmEsIHZiXSwgKHZhbHVlIC0gcGEpICogc3ViUmFuZ2VSYXRpbyhwYSwgcGIpKTtcbiAgICB9XG5cbiAgICAvLyAocGVyY2VudGFnZSkgR2V0IHRoZSBzdGVwIHRoYXQgYXBwbGllcyBhdCBhIGNlcnRhaW4gdmFsdWUuXG4gICAgZnVuY3Rpb24gZ2V0U3RlcCh4UGN0LCB4U3RlcHMsIHNuYXAsIHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gMTAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaiA9IGdldEoodmFsdWUsIHhQY3QpO1xuICAgICAgICB2YXIgYSA9IHhQY3RbaiAtIDFdO1xuICAgICAgICB2YXIgYiA9IHhQY3Rbal07XG5cbiAgICAgICAgLy8gSWYgJ3NuYXAnIGlzIHNldCwgc3RlcHMgYXJlIHVzZWQgYXMgZml4ZWQgcG9pbnRzIG9uIHRoZSBzbGlkZXIuXG4gICAgICAgIGlmIChzbmFwKSB7XG4gICAgICAgICAgICAvLyBGaW5kIHRoZSBjbG9zZXN0IHBvc2l0aW9uLCBhIG9yIGIuXG4gICAgICAgICAgICBpZiAodmFsdWUgLSBhID4gKGIgLSBhKSAvIDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXhTdGVwc1tqIC0gMV0pIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB4UGN0W2ogLSAxXSArIGNsb3Nlc3QodmFsdWUgLSB4UGN0W2ogLSAxXSwgeFN0ZXBzW2ogLSAxXSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlRW50cnlQb2ludChpbmRleCwgdmFsdWUsIHRoYXQpIHtcbiAgICAgICAgdmFyIHBlcmNlbnRhZ2U7XG5cbiAgICAgICAgLy8gV3JhcCBudW1lcmljYWwgaW5wdXQgaW4gYW4gYXJyYXkuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIHZhbHVlID0gW3ZhbHVlXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlamVjdCBhbnkgaW52YWxpZCBpbnB1dCwgYnkgdGVzdGluZyB3aGV0aGVyIHZhbHVlIGlzIGFuIGFycmF5LlxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdyYW5nZScgY29udGFpbnMgaW52YWxpZCB2YWx1ZS5cIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb3ZlcnQgbWluL21heCBzeW50YXggdG8gMCBhbmQgMTAwLlxuICAgICAgICBpZiAoaW5kZXggPT09IFwibWluXCIpIHtcbiAgICAgICAgICAgIHBlcmNlbnRhZ2UgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSBcIm1heFwiKSB7XG4gICAgICAgICAgICBwZXJjZW50YWdlID0gMTAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVyY2VudGFnZSA9IHBhcnNlRmxvYXQoaW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgZm9yIGNvcnJlY3QgaW5wdXQuXG4gICAgICAgIGlmICghaXNOdW1lcmljKHBlcmNlbnRhZ2UpIHx8ICFpc051bWVyaWModmFsdWVbMF0pKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdyYW5nZScgdmFsdWUgaXNuJ3QgbnVtZXJpYy5cIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTdG9yZSB2YWx1ZXMuXG4gICAgICAgIHRoYXQueFBjdC5wdXNoKHBlcmNlbnRhZ2UpO1xuICAgICAgICB0aGF0LnhWYWwucHVzaCh2YWx1ZVswXSk7XG5cbiAgICAgICAgLy8gTmFOIHdpbGwgZXZhbHVhdGUgdG8gZmFsc2UgdG9vLCBidXQgdG8ga2VlcFxuICAgICAgICAvLyBsb2dnaW5nIGNsZWFyLCBzZXQgc3RlcCBleHBsaWNpdGx5LiBNYWtlIHN1cmVcbiAgICAgICAgLy8gbm90IHRvIG92ZXJyaWRlIHRoZSAnc3RlcCcgc2V0dGluZyB3aXRoIGZhbHNlLlxuICAgICAgICBpZiAoIXBlcmNlbnRhZ2UpIHtcbiAgICAgICAgICAgIGlmICghaXNOYU4odmFsdWVbMV0pKSB7XG4gICAgICAgICAgICAgICAgdGhhdC54U3RlcHNbMF0gPSB2YWx1ZVsxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoYXQueFN0ZXBzLnB1c2goaXNOYU4odmFsdWVbMV0pID8gZmFsc2UgOiB2YWx1ZVsxXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGF0LnhIaWdoZXN0Q29tcGxldGVTdGVwLnB1c2goMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlU3RlcFBvaW50KGksIG4sIHRoYXQpIHtcbiAgICAgICAgLy8gSWdub3JlICdmYWxzZScgc3RlcHBpbmcuXG4gICAgICAgIGlmICghbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3RlcCBvdmVyIHplcm8tbGVuZ3RoIHJhbmdlcyAoIzk0OCk7XG4gICAgICAgIGlmICh0aGF0LnhWYWxbaV0gPT09IHRoYXQueFZhbFtpICsgMV0pIHtcbiAgICAgICAgICAgIHRoYXQueFN0ZXBzW2ldID0gdGhhdC54SGlnaGVzdENvbXBsZXRlU3RlcFtpXSA9IHRoYXQueFZhbFtpXTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmFjdG9yIHRvIHJhbmdlIHJhdGlvXG4gICAgICAgIHRoYXQueFN0ZXBzW2ldID1cbiAgICAgICAgICAgIGZyb21QZXJjZW50YWdlKFt0aGF0LnhWYWxbaV0sIHRoYXQueFZhbFtpICsgMV1dLCBuKSAvIHN1YlJhbmdlUmF0aW8odGhhdC54UGN0W2ldLCB0aGF0LnhQY3RbaSArIDFdKTtcblxuICAgICAgICB2YXIgdG90YWxTdGVwcyA9ICh0aGF0LnhWYWxbaSArIDFdIC0gdGhhdC54VmFsW2ldKSAvIHRoYXQueE51bVN0ZXBzW2ldO1xuICAgICAgICB2YXIgaGlnaGVzdFN0ZXAgPSBNYXRoLmNlaWwoTnVtYmVyKHRvdGFsU3RlcHMudG9GaXhlZCgzKSkgLSAxKTtcbiAgICAgICAgdmFyIHN0ZXAgPSB0aGF0LnhWYWxbaV0gKyB0aGF0LnhOdW1TdGVwc1tpXSAqIGhpZ2hlc3RTdGVwO1xuXG4gICAgICAgIHRoYXQueEhpZ2hlc3RDb21wbGV0ZVN0ZXBbaV0gPSBzdGVwO1xuICAgIH1cblxuICAgIC8vZW5kcmVnaW9uXG5cbiAgICAvL3JlZ2lvbiBTcGVjdHJ1bVxuXG4gICAgZnVuY3Rpb24gU3BlY3RydW0oZW50cnksIHNuYXAsIHNpbmdsZVN0ZXApIHtcbiAgICAgICAgdGhpcy54UGN0ID0gW107XG4gICAgICAgIHRoaXMueFZhbCA9IFtdO1xuICAgICAgICB0aGlzLnhTdGVwcyA9IFtzaW5nbGVTdGVwIHx8IGZhbHNlXTtcbiAgICAgICAgdGhpcy54TnVtU3RlcHMgPSBbZmFsc2VdO1xuICAgICAgICB0aGlzLnhIaWdoZXN0Q29tcGxldGVTdGVwID0gW107XG5cbiAgICAgICAgdGhpcy5zbmFwID0gc25hcDtcblxuICAgICAgICB2YXIgaW5kZXg7XG4gICAgICAgIHZhciBvcmRlcmVkID0gW107IC8vIFswLCAnbWluJ10sIFsxLCAnNTAlJ10sIFsyLCAnbWF4J11cblxuICAgICAgICAvLyBNYXAgdGhlIG9iamVjdCBrZXlzIHRvIGFuIGFycmF5LlxuICAgICAgICBmb3IgKGluZGV4IGluIGVudHJ5KSB7XG4gICAgICAgICAgICBpZiAoZW50cnkuaGFzT3duUHJvcGVydHkoaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgb3JkZXJlZC5wdXNoKFtlbnRyeVtpbmRleF0sIGluZGV4XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTb3J0IGFsbCBlbnRyaWVzIGJ5IHZhbHVlIChudW1lcmljIHNvcnQpLlxuICAgICAgICBpZiAob3JkZXJlZC5sZW5ndGggJiYgdHlwZW9mIG9yZGVyZWRbMF1bMF0gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIG9yZGVyZWQuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFbMF1bMF0gLSBiWzBdWzBdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcmRlcmVkLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhWzBdIC0gYlswXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29udmVydCBhbGwgZW50cmllcyB0byBzdWJyYW5nZXMuXG4gICAgICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IG9yZGVyZWQubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBoYW5kbGVFbnRyeVBvaW50KG9yZGVyZWRbaW5kZXhdWzFdLCBvcmRlcmVkW2luZGV4XVswXSwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTdG9yZSB0aGUgYWN0dWFsIHN0ZXAgdmFsdWVzLlxuICAgICAgICAvLyB4U3RlcHMgaXMgc29ydGVkIGluIHRoZSBzYW1lIG9yZGVyIGFzIHhQY3QgYW5kIHhWYWwuXG4gICAgICAgIHRoaXMueE51bVN0ZXBzID0gdGhpcy54U3RlcHMuc2xpY2UoMCk7XG5cbiAgICAgICAgLy8gQ29udmVydCBhbGwgbnVtZXJpYyBzdGVwcyB0byB0aGUgcGVyY2VudGFnZSBvZiB0aGUgc3VicmFuZ2UgdGhleSByZXByZXNlbnQuXG4gICAgICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IHRoaXMueE51bVN0ZXBzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgaGFuZGxlU3RlcFBvaW50KGluZGV4LCB0aGlzLnhOdW1TdGVwc1tpbmRleF0sIHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgU3BlY3RydW0ucHJvdG90eXBlLmdldE1hcmdpbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHZhciBzdGVwID0gdGhpcy54TnVtU3RlcHNbMF07XG5cbiAgICAgICAgaWYgKHN0ZXAgJiYgKHZhbHVlIC8gc3RlcCkgJSAxICE9PSAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdsaW1pdCcsICdtYXJnaW4nIGFuZCAncGFkZGluZycgbXVzdCBiZSBkaXZpc2libGUgYnkgc3RlcC5cIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy54UGN0Lmxlbmd0aCA9PT0gMiA/IGZyb21QZXJjZW50YWdlKHRoaXMueFZhbCwgdmFsdWUpIDogZmFsc2U7XG4gICAgfTtcblxuICAgIFNwZWN0cnVtLnByb3RvdHlwZS50b1N0ZXBwaW5nID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgdmFsdWUgPSB0b1N0ZXBwaW5nKHRoaXMueFZhbCwgdGhpcy54UGN0LCB2YWx1ZSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG5cbiAgICBTcGVjdHJ1bS5wcm90b3R5cGUuZnJvbVN0ZXBwaW5nID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGZyb21TdGVwcGluZyh0aGlzLnhWYWwsIHRoaXMueFBjdCwgdmFsdWUpO1xuICAgIH07XG5cbiAgICBTcGVjdHJ1bS5wcm90b3R5cGUuZ2V0U3RlcCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHZhbHVlID0gZ2V0U3RlcCh0aGlzLnhQY3QsIHRoaXMueFN0ZXBzLCB0aGlzLnNuYXAsIHZhbHVlKTtcblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcblxuICAgIFNwZWN0cnVtLnByb3RvdHlwZS5nZXREZWZhdWx0U3RlcCA9IGZ1bmN0aW9uKHZhbHVlLCBpc0Rvd24sIHNpemUpIHtcbiAgICAgICAgdmFyIGogPSBnZXRKKHZhbHVlLCB0aGlzLnhQY3QpO1xuXG4gICAgICAgIC8vIFdoZW4gYXQgdGhlIHRvcCBvciBzdGVwcGluZyBkb3duLCBsb29rIGF0IHRoZSBwcmV2aW91cyBzdWItcmFuZ2VcbiAgICAgICAgaWYgKHZhbHVlID09PSAxMDAgfHwgKGlzRG93biAmJiB2YWx1ZSA9PT0gdGhpcy54UGN0W2ogLSAxXSkpIHtcbiAgICAgICAgICAgIGogPSBNYXRoLm1heChqIC0gMSwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKHRoaXMueFZhbFtqXSAtIHRoaXMueFZhbFtqIC0gMV0pIC8gc2l6ZTtcbiAgICB9O1xuXG4gICAgU3BlY3RydW0ucHJvdG90eXBlLmdldE5lYXJieVN0ZXBzID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgdmFyIGogPSBnZXRKKHZhbHVlLCB0aGlzLnhQY3QpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGVwQmVmb3JlOiB7XG4gICAgICAgICAgICAgICAgc3RhcnRWYWx1ZTogdGhpcy54VmFsW2ogLSAyXSxcbiAgICAgICAgICAgICAgICBzdGVwOiB0aGlzLnhOdW1TdGVwc1tqIC0gMl0sXG4gICAgICAgICAgICAgICAgaGlnaGVzdFN0ZXA6IHRoaXMueEhpZ2hlc3RDb21wbGV0ZVN0ZXBbaiAtIDJdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGhpc1N0ZXA6IHtcbiAgICAgICAgICAgICAgICBzdGFydFZhbHVlOiB0aGlzLnhWYWxbaiAtIDFdLFxuICAgICAgICAgICAgICAgIHN0ZXA6IHRoaXMueE51bVN0ZXBzW2ogLSAxXSxcbiAgICAgICAgICAgICAgICBoaWdoZXN0U3RlcDogdGhpcy54SGlnaGVzdENvbXBsZXRlU3RlcFtqIC0gMV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdGVwQWZ0ZXI6IHtcbiAgICAgICAgICAgICAgICBzdGFydFZhbHVlOiB0aGlzLnhWYWxbal0sXG4gICAgICAgICAgICAgICAgc3RlcDogdGhpcy54TnVtU3RlcHNbal0sXG4gICAgICAgICAgICAgICAgaGlnaGVzdFN0ZXA6IHRoaXMueEhpZ2hlc3RDb21wbGV0ZVN0ZXBbal1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgU3BlY3RydW0ucHJvdG90eXBlLmNvdW50U3RlcERlY2ltYWxzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzdGVwRGVjaW1hbHMgPSB0aGlzLnhOdW1TdGVwcy5tYXAoY291bnREZWNpbWFscyk7XG4gICAgICAgIHJldHVybiBNYXRoLm1heC5hcHBseShudWxsLCBzdGVwRGVjaW1hbHMpO1xuICAgIH07XG5cbiAgICAvLyBPdXRzaWRlIHRlc3RpbmdcbiAgICBTcGVjdHJ1bS5wcm90b3R5cGUuY29udmVydCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFN0ZXAodGhpcy50b1N0ZXBwaW5nKHZhbHVlKSk7XG4gICAgfTtcblxuICAgIC8vZW5kcmVnaW9uXG5cbiAgICAvL3JlZ2lvbiBPcHRpb25zXG5cbiAgICAvKlx0RXZlcnkgaW5wdXQgb3B0aW9uIGlzIHRlc3RlZCBhbmQgcGFyc2VkLiBUaGlzJ2xsIHByZXZlbnRcbiAgICAgICAgZW5kbGVzcyB2YWxpZGF0aW9uIGluIGludGVybmFsIG1ldGhvZHMuIFRoZXNlIHRlc3RzIGFyZVxuICAgICAgICBzdHJ1Y3R1cmVkIHdpdGggYW4gaXRlbSBmb3IgZXZlcnkgb3B0aW9uIGF2YWlsYWJsZS4gQW5cbiAgICAgICAgb3B0aW9uIGNhbiBiZSBtYXJrZWQgYXMgcmVxdWlyZWQgYnkgc2V0dGluZyB0aGUgJ3InIGZsYWcuXG4gICAgICAgIFRoZSB0ZXN0aW5nIGZ1bmN0aW9uIGlzIHByb3ZpZGVkIHdpdGggdGhyZWUgYXJndW1lbnRzOlxuICAgICAgICAgICAgLSBUaGUgcHJvdmlkZWQgdmFsdWUgZm9yIHRoZSBvcHRpb247XG4gICAgICAgICAgICAtIEEgcmVmZXJlbmNlIHRvIHRoZSBvcHRpb25zIG9iamVjdDtcbiAgICAgICAgICAgIC0gVGhlIG5hbWUgZm9yIHRoZSBvcHRpb247XG5cbiAgICAgICAgVGhlIHRlc3RpbmcgZnVuY3Rpb24gcmV0dXJucyBmYWxzZSB3aGVuIGFuIGVycm9yIGlzIGRldGVjdGVkLFxuICAgICAgICBvciB0cnVlIHdoZW4gZXZlcnl0aGluZyBpcyBPSy4gSXQgY2FuIGFsc28gbW9kaWZ5IHRoZSBvcHRpb25cbiAgICAgICAgb2JqZWN0LCB0byBtYWtlIHN1cmUgYWxsIHZhbHVlcyBjYW4gYmUgY29ycmVjdGx5IGxvb3BlZCBlbHNld2hlcmUuICovXG5cbiAgICB2YXIgZGVmYXVsdEZvcm1hdHRlciA9IHtcbiAgICAgICAgdG86IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZS50b0ZpeGVkKDIpO1xuICAgICAgICB9LFxuICAgICAgICBmcm9tOiBOdW1iZXJcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGVGb3JtYXQoZW50cnkpIHtcbiAgICAgICAgLy8gQW55IG9iamVjdCB3aXRoIGEgdG8gYW5kIGZyb20gbWV0aG9kIGlzIHN1cHBvcnRlZC5cbiAgICAgICAgaWYgKGlzVmFsaWRGb3JtYXR0ZXIoZW50cnkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogJ2Zvcm1hdCcgcmVxdWlyZXMgJ3RvJyBhbmQgJ2Zyb20nIG1ldGhvZHMuXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRlc3RTdGVwKHBhcnNlZCwgZW50cnkpIHtcbiAgICAgICAgaWYgKCFpc051bWVyaWMoZW50cnkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdzdGVwJyBpcyBub3QgbnVtZXJpYy5cIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgc3RlcCBvcHRpb24gY2FuIHN0aWxsIGJlIHVzZWQgdG8gc2V0IHN0ZXBwaW5nXG4gICAgICAgIC8vIGZvciBsaW5lYXIgc2xpZGVycy4gT3ZlcndyaXR0ZW4gaWYgc2V0IGluICdyYW5nZScuXG4gICAgICAgIHBhcnNlZC5zaW5nbGVTdGVwID0gZW50cnk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGVzdFJhbmdlKHBhcnNlZCwgZW50cnkpIHtcbiAgICAgICAgLy8gRmlsdGVyIGluY29ycmVjdCBpbnB1dC5cbiAgICAgICAgaWYgKHR5cGVvZiBlbnRyeSAhPT0gXCJvYmplY3RcIiB8fCBBcnJheS5pc0FycmF5KGVudHJ5KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIgKyBWRVJTSU9OICsgXCIpOiAncmFuZ2UnIGlzIG5vdCBhbiBvYmplY3QuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2F0Y2ggbWlzc2luZyBzdGFydCBvciBlbmQuXG4gICAgICAgIGlmIChlbnRyeS5taW4gPT09IHVuZGVmaW5lZCB8fCBlbnRyeS5tYXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIgKyBWRVJTSU9OICsgXCIpOiBNaXNzaW5nICdtaW4nIG9yICdtYXgnIGluICdyYW5nZScuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2F0Y2ggZXF1YWwgc3RhcnQgb3IgZW5kLlxuICAgICAgICBpZiAoZW50cnkubWluID09PSBlbnRyeS5tYXgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogJ3JhbmdlJyAnbWluJyBhbmQgJ21heCcgY2Fubm90IGJlIGVxdWFsLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcnNlZC5zcGVjdHJ1bSA9IG5ldyBTcGVjdHJ1bShlbnRyeSwgcGFyc2VkLnNuYXAsIHBhcnNlZC5zaW5nbGVTdGVwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0ZXN0U3RhcnQocGFyc2VkLCBlbnRyeSkge1xuICAgICAgICBlbnRyeSA9IGFzQXJyYXkoZW50cnkpO1xuXG4gICAgICAgIC8vIFZhbGlkYXRlIGlucHV0LiBWYWx1ZXMgYXJlbid0IHRlc3RlZCwgYXMgdGhlIHB1YmxpYyAudmFsIG1ldGhvZFxuICAgICAgICAvLyB3aWxsIGFsd2F5cyBwcm92aWRlIGEgdmFsaWQgbG9jYXRpb24uXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShlbnRyeSkgfHwgIWVudHJ5Lmxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIgKyBWRVJTSU9OICsgXCIpOiAnc3RhcnQnIG9wdGlvbiBpcyBpbmNvcnJlY3QuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3RvcmUgdGhlIG51bWJlciBvZiBoYW5kbGVzLlxuICAgICAgICBwYXJzZWQuaGFuZGxlcyA9IGVudHJ5Lmxlbmd0aDtcblxuICAgICAgICAvLyBXaGVuIHRoZSBzbGlkZXIgaXMgaW5pdGlhbGl6ZWQsIHRoZSAudmFsIG1ldGhvZCB3aWxsXG4gICAgICAgIC8vIGJlIGNhbGxlZCB3aXRoIHRoZSBzdGFydCBvcHRpb25zLlxuICAgICAgICBwYXJzZWQuc3RhcnQgPSBlbnRyeTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0ZXN0U25hcChwYXJzZWQsIGVudHJ5KSB7XG4gICAgICAgIC8vIEVuZm9yY2UgMTAwJSBzdGVwcGluZyB3aXRoaW4gc3VicmFuZ2VzLlxuICAgICAgICBwYXJzZWQuc25hcCA9IGVudHJ5O1xuXG4gICAgICAgIGlmICh0eXBlb2YgZW50cnkgIT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdzbmFwJyBvcHRpb24gbXVzdCBiZSBhIGJvb2xlYW4uXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGVzdEFuaW1hdGUocGFyc2VkLCBlbnRyeSkge1xuICAgICAgICAvLyBFbmZvcmNlIDEwMCUgc3RlcHBpbmcgd2l0aGluIHN1YnJhbmdlcy5cbiAgICAgICAgcGFyc2VkLmFuaW1hdGUgPSBlbnRyeTtcblxuICAgICAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIgKyBWRVJTSU9OICsgXCIpOiAnYW5pbWF0ZScgb3B0aW9uIG11c3QgYmUgYSBib29sZWFuLlwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRlc3RBbmltYXRpb25EdXJhdGlvbihwYXJzZWQsIGVudHJ5KSB7XG4gICAgICAgIHBhcnNlZC5hbmltYXRpb25EdXJhdGlvbiA9IGVudHJ5O1xuXG4gICAgICAgIGlmICh0eXBlb2YgZW50cnkgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogJ2FuaW1hdGlvbkR1cmF0aW9uJyBvcHRpb24gbXVzdCBiZSBhIG51bWJlci5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0ZXN0Q29ubmVjdChwYXJzZWQsIGVudHJ5KSB7XG4gICAgICAgIHZhciBjb25uZWN0ID0gW2ZhbHNlXTtcbiAgICAgICAgdmFyIGk7XG5cbiAgICAgICAgLy8gTWFwIGxlZ2FjeSBvcHRpb25zXG4gICAgICAgIGlmIChlbnRyeSA9PT0gXCJsb3dlclwiKSB7XG4gICAgICAgICAgICBlbnRyeSA9IFt0cnVlLCBmYWxzZV07XG4gICAgICAgIH0gZWxzZSBpZiAoZW50cnkgPT09IFwidXBwZXJcIikge1xuICAgICAgICAgICAgZW50cnkgPSBbZmFsc2UsIHRydWVdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSGFuZGxlIGJvb2xlYW4gb3B0aW9uc1xuICAgICAgICBpZiAoZW50cnkgPT09IHRydWUgfHwgZW50cnkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAxOyBpIDwgcGFyc2VkLmhhbmRsZXM7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbm5lY3QucHVzaChlbnRyeSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbm5lY3QucHVzaChmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZWplY3QgaW52YWxpZCBpbnB1dFxuICAgICAgICBlbHNlIGlmICghQXJyYXkuaXNBcnJheShlbnRyeSkgfHwgIWVudHJ5Lmxlbmd0aCB8fCBlbnRyeS5sZW5ndGggIT09IHBhcnNlZC5oYW5kbGVzICsgMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIgKyBWRVJTSU9OICsgXCIpOiAnY29ubmVjdCcgb3B0aW9uIGRvZXNuJ3QgbWF0Y2ggaGFuZGxlIGNvdW50LlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbm5lY3QgPSBlbnRyeTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcnNlZC5jb25uZWN0ID0gY29ubmVjdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0ZXN0T3JpZW50YXRpb24ocGFyc2VkLCBlbnRyeSkge1xuICAgICAgICAvLyBTZXQgb3JpZW50YXRpb24gdG8gYW4gYSBudW1lcmljYWwgdmFsdWUgZm9yIGVhc3lcbiAgICAgICAgLy8gYXJyYXkgc2VsZWN0aW9uLlxuICAgICAgICBzd2l0Y2ggKGVudHJ5KSB7XG4gICAgICAgICAgICBjYXNlIFwiaG9yaXpvbnRhbFwiOlxuICAgICAgICAgICAgICAgIHBhcnNlZC5vcnQgPSAwO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInZlcnRpY2FsXCI6XG4gICAgICAgICAgICAgICAgcGFyc2VkLm9ydCA9IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogJ29yaWVudGF0aW9uJyBvcHRpb24gaXMgaW52YWxpZC5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0ZXN0TWFyZ2luKHBhcnNlZCwgZW50cnkpIHtcbiAgICAgICAgaWYgKCFpc051bWVyaWMoZW50cnkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdtYXJnaW4nIG9wdGlvbiBtdXN0IGJlIG51bWVyaWMuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSXNzdWUgIzU4MlxuICAgICAgICBpZiAoZW50cnkgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcnNlZC5tYXJnaW4gPSBwYXJzZWQuc3BlY3RydW0uZ2V0TWFyZ2luKGVudHJ5KTtcblxuICAgICAgICBpZiAoIXBhcnNlZC5tYXJnaW4pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogJ21hcmdpbicgb3B0aW9uIGlzIG9ubHkgc3VwcG9ydGVkIG9uIGxpbmVhciBzbGlkZXJzLlwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRlc3RMaW1pdChwYXJzZWQsIGVudHJ5KSB7XG4gICAgICAgIGlmICghaXNOdW1lcmljKGVudHJ5KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIgKyBWRVJTSU9OICsgXCIpOiAnbGltaXQnIG9wdGlvbiBtdXN0IGJlIG51bWVyaWMuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFyc2VkLmxpbWl0ID0gcGFyc2VkLnNwZWN0cnVtLmdldE1hcmdpbihlbnRyeSk7XG5cbiAgICAgICAgaWYgKCFwYXJzZWQubGltaXQgfHwgcGFyc2VkLmhhbmRsZXMgPCAyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgXCJub1VpU2xpZGVyIChcIiArXG4gICAgICAgICAgICAgICAgICAgIFZFUlNJT04gK1xuICAgICAgICAgICAgICAgICAgICBcIik6ICdsaW1pdCcgb3B0aW9uIGlzIG9ubHkgc3VwcG9ydGVkIG9uIGxpbmVhciBzbGlkZXJzIHdpdGggMiBvciBtb3JlIGhhbmRsZXMuXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0ZXN0UGFkZGluZyhwYXJzZWQsIGVudHJ5KSB7XG4gICAgICAgIGlmICghaXNOdW1lcmljKGVudHJ5KSAmJiAhQXJyYXkuaXNBcnJheShlbnRyeSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICBcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogJ3BhZGRpbmcnIG9wdGlvbiBtdXN0IGJlIG51bWVyaWMgb3IgYXJyYXkgb2YgZXhhY3RseSAyIG51bWJlcnMuXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlbnRyeSkgJiYgIShlbnRyeS5sZW5ndGggPT09IDIgfHwgaXNOdW1lcmljKGVudHJ5WzBdKSB8fCBpc051bWVyaWMoZW50cnlbMV0pKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgIFwibm9VaVNsaWRlciAoXCIgKyBWRVJTSU9OICsgXCIpOiAncGFkZGluZycgb3B0aW9uIG11c3QgYmUgbnVtZXJpYyBvciBhcnJheSBvZiBleGFjdGx5IDIgbnVtYmVycy5cIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGVudHJ5KSkge1xuICAgICAgICAgICAgZW50cnkgPSBbZW50cnksIGVudHJ5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vICdnZXRNYXJnaW4nIHJldHVybnMgZmFsc2UgZm9yIGludmFsaWQgdmFsdWVzLlxuICAgICAgICBwYXJzZWQucGFkZGluZyA9IFtwYXJzZWQuc3BlY3RydW0uZ2V0TWFyZ2luKGVudHJ5WzBdKSwgcGFyc2VkLnNwZWN0cnVtLmdldE1hcmdpbihlbnRyeVsxXSldO1xuXG4gICAgICAgIGlmIChwYXJzZWQucGFkZGluZ1swXSA9PT0gZmFsc2UgfHwgcGFyc2VkLnBhZGRpbmdbMV0gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdwYWRkaW5nJyBvcHRpb24gaXMgb25seSBzdXBwb3J0ZWQgb24gbGluZWFyIHNsaWRlcnMuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcnNlZC5wYWRkaW5nWzBdIDwgMCB8fCBwYXJzZWQucGFkZGluZ1sxXSA8IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogJ3BhZGRpbmcnIG9wdGlvbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyKHMpLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJzZWQucGFkZGluZ1swXSArIHBhcnNlZC5wYWRkaW5nWzFdID49IDEwMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIgKyBWRVJTSU9OICsgXCIpOiAncGFkZGluZycgb3B0aW9uIG11c3Qgbm90IGV4Y2VlZCAxMDAlIG9mIHRoZSByYW5nZS5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0ZXN0RGlyZWN0aW9uKHBhcnNlZCwgZW50cnkpIHtcbiAgICAgICAgLy8gU2V0IGRpcmVjdGlvbiBhcyBhIG51bWVyaWNhbCB2YWx1ZSBmb3IgZWFzeSBwYXJzaW5nLlxuICAgICAgICAvLyBJbnZlcnQgY29ubmVjdGlvbiBmb3IgUlRMIHNsaWRlcnMsIHNvIHRoYXQgdGhlIHByb3BlclxuICAgICAgICAvLyBoYW5kbGVzIGdldCB0aGUgY29ubmVjdC9iYWNrZ3JvdW5kIGNsYXNzZXMuXG4gICAgICAgIHN3aXRjaCAoZW50cnkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJsdHJcIjpcbiAgICAgICAgICAgICAgICBwYXJzZWQuZGlyID0gMDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJydGxcIjpcbiAgICAgICAgICAgICAgICBwYXJzZWQuZGlyID0gMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIgKyBWRVJTSU9OICsgXCIpOiAnZGlyZWN0aW9uJyBvcHRpb24gd2FzIG5vdCByZWNvZ25pemVkLlwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRlc3RCZWhhdmlvdXIocGFyc2VkLCBlbnRyeSkge1xuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIGlucHV0IGlzIGEgc3RyaW5nLlxuICAgICAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdiZWhhdmlvdXInIG11c3QgYmUgYSBzdHJpbmcgY29udGFpbmluZyBvcHRpb25zLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBzdHJpbmcgY29udGFpbnMgYW55IGtleXdvcmRzLlxuICAgICAgICAvLyBOb25lIGFyZSByZXF1aXJlZC5cbiAgICAgICAgdmFyIHRhcCA9IGVudHJ5LmluZGV4T2YoXCJ0YXBcIikgPj0gMDtcbiAgICAgICAgdmFyIGRyYWcgPSBlbnRyeS5pbmRleE9mKFwiZHJhZ1wiKSA+PSAwO1xuICAgICAgICB2YXIgZml4ZWQgPSBlbnRyeS5pbmRleE9mKFwiZml4ZWRcIikgPj0gMDtcbiAgICAgICAgdmFyIHNuYXAgPSBlbnRyeS5pbmRleE9mKFwic25hcFwiKSA+PSAwO1xuICAgICAgICB2YXIgaG92ZXIgPSBlbnRyeS5pbmRleE9mKFwiaG92ZXJcIikgPj0gMDtcbiAgICAgICAgdmFyIHVuY29uc3RyYWluZWQgPSBlbnRyeS5pbmRleE9mKFwidW5jb25zdHJhaW5lZFwiKSA+PSAwO1xuXG4gICAgICAgIGlmIChmaXhlZCkge1xuICAgICAgICAgICAgaWYgKHBhcnNlZC5oYW5kbGVzICE9PSAyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIgKyBWRVJTSU9OICsgXCIpOiAnZml4ZWQnIGJlaGF2aW91ciBtdXN0IGJlIHVzZWQgd2l0aCAyIGhhbmRsZXNcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFVzZSBtYXJnaW4gdG8gZW5mb3JjZSBmaXhlZCBzdGF0ZVxuICAgICAgICAgICAgdGVzdE1hcmdpbihwYXJzZWQsIHBhcnNlZC5zdGFydFsxXSAtIHBhcnNlZC5zdGFydFswXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodW5jb25zdHJhaW5lZCAmJiAocGFyc2VkLm1hcmdpbiB8fCBwYXJzZWQubGltaXQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICd1bmNvbnN0cmFpbmVkJyBiZWhhdmlvdXIgY2Fubm90IGJlIHVzZWQgd2l0aCBtYXJnaW4gb3IgbGltaXRcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcnNlZC5ldmVudHMgPSB7XG4gICAgICAgICAgICB0YXA6IHRhcCB8fCBzbmFwLFxuICAgICAgICAgICAgZHJhZzogZHJhZyxcbiAgICAgICAgICAgIGZpeGVkOiBmaXhlZCxcbiAgICAgICAgICAgIHNuYXA6IHNuYXAsXG4gICAgICAgICAgICBob3ZlcjogaG92ZXIsXG4gICAgICAgICAgICB1bmNvbnN0cmFpbmVkOiB1bmNvbnN0cmFpbmVkXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGVzdFRvb2x0aXBzKHBhcnNlZCwgZW50cnkpIHtcbiAgICAgICAgaWYgKGVudHJ5ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICBwYXJzZWQudG9vbHRpcHMgPSBbXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJzZWQuaGFuZGxlczsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcGFyc2VkLnRvb2x0aXBzLnB1c2godHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJzZWQudG9vbHRpcHMgPSBhc0FycmF5KGVudHJ5KTtcblxuICAgICAgICAgICAgaWYgKHBhcnNlZC50b29sdGlwcy5sZW5ndGggIT09IHBhcnNlZC5oYW5kbGVzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIgKyBWRVJTSU9OICsgXCIpOiBtdXN0IHBhc3MgYSBmb3JtYXR0ZXIgZm9yIGFsbCBoYW5kbGVzLlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGFyc2VkLnRvb2x0aXBzLmZvckVhY2goZnVuY3Rpb24oZm9ybWF0dGVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YgZm9ybWF0dGVyICE9PSBcImJvb2xlYW5cIiAmJlxuICAgICAgICAgICAgICAgICAgICAodHlwZW9mIGZvcm1hdHRlciAhPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgZm9ybWF0dGVyLnRvICE9PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogJ3Rvb2x0aXBzJyBtdXN0IGJlIHBhc3NlZCBhIGZvcm1hdHRlciBvciAnZmFsc2UnLlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRlc3RBcmlhRm9ybWF0KHBhcnNlZCwgZW50cnkpIHtcbiAgICAgICAgcGFyc2VkLmFyaWFGb3JtYXQgPSBlbnRyeTtcbiAgICAgICAgdmFsaWRhdGVGb3JtYXQoZW50cnkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRlc3RGb3JtYXQocGFyc2VkLCBlbnRyeSkge1xuICAgICAgICBwYXJzZWQuZm9ybWF0ID0gZW50cnk7XG4gICAgICAgIHZhbGlkYXRlRm9ybWF0KGVudHJ5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0ZXN0S2V5Ym9hcmRTdXBwb3J0KHBhcnNlZCwgZW50cnkpIHtcbiAgICAgICAgcGFyc2VkLmtleWJvYXJkU3VwcG9ydCA9IGVudHJ5O1xuXG4gICAgICAgIGlmICh0eXBlb2YgZW50cnkgIT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdrZXlib2FyZFN1cHBvcnQnIG9wdGlvbiBtdXN0IGJlIGEgYm9vbGVhbi5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0ZXN0RG9jdW1lbnRFbGVtZW50KHBhcnNlZCwgZW50cnkpIHtcbiAgICAgICAgLy8gVGhpcyBpcyBhbiBhZHZhbmNlZCBvcHRpb24uIFBhc3NlZCB2YWx1ZXMgYXJlIHVzZWQgd2l0aG91dCB2YWxpZGF0aW9uLlxuICAgICAgICBwYXJzZWQuZG9jdW1lbnRFbGVtZW50ID0gZW50cnk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGVzdENzc1ByZWZpeChwYXJzZWQsIGVudHJ5KSB7XG4gICAgICAgIGlmICh0eXBlb2YgZW50cnkgIT09IFwic3RyaW5nXCIgJiYgZW50cnkgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdjc3NQcmVmaXgnIG11c3QgYmUgYSBzdHJpbmcgb3IgYGZhbHNlYC5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBwYXJzZWQuY3NzUHJlZml4ID0gZW50cnk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGVzdENzc0NsYXNzZXMocGFyc2VkLCBlbnRyeSkge1xuICAgICAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICdjc3NDbGFzc2VzJyBtdXN0IGJlIGFuIG9iamVjdC5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHBhcnNlZC5jc3NQcmVmaXggPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHBhcnNlZC5jc3NDbGFzc2VzID0ge307XG5cbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBlbnRyeSkge1xuICAgICAgICAgICAgICAgIGlmICghZW50cnkuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBwYXJzZWQuY3NzQ2xhc3Nlc1trZXldID0gcGFyc2VkLmNzc1ByZWZpeCArIGVudHJ5W2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJzZWQuY3NzQ2xhc3NlcyA9IGVudHJ5O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVGVzdCBhbGwgZGV2ZWxvcGVyIHNldHRpbmdzIGFuZCBwYXJzZSB0byBhc3N1bXB0aW9uLXNhZmUgdmFsdWVzLlxuICAgIGZ1bmN0aW9uIHRlc3RPcHRpb25zKG9wdGlvbnMpIHtcbiAgICAgICAgLy8gVG8gcHJvdmUgYSBmaXggZm9yICM1MzcsIGZyZWV6ZSBvcHRpb25zIGhlcmUuXG4gICAgICAgIC8vIElmIHRoZSBvYmplY3QgaXMgbW9kaWZpZWQsIGFuIGVycm9yIHdpbGwgYmUgdGhyb3duLlxuICAgICAgICAvLyBPYmplY3QuZnJlZXplKG9wdGlvbnMpO1xuXG4gICAgICAgIHZhciBwYXJzZWQgPSB7XG4gICAgICAgICAgICBtYXJnaW46IDAsXG4gICAgICAgICAgICBsaW1pdDogMCxcbiAgICAgICAgICAgIHBhZGRpbmc6IDAsXG4gICAgICAgICAgICBhbmltYXRlOiB0cnVlLFxuICAgICAgICAgICAgYW5pbWF0aW9uRHVyYXRpb246IDMwMCxcbiAgICAgICAgICAgIGFyaWFGb3JtYXQ6IGRlZmF1bHRGb3JtYXR0ZXIsXG4gICAgICAgICAgICBmb3JtYXQ6IGRlZmF1bHRGb3JtYXR0ZXJcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBUZXN0cyBhcmUgZXhlY3V0ZWQgaW4gdGhlIG9yZGVyIHRoZXkgYXJlIHByZXNlbnRlZCBoZXJlLlxuICAgICAgICB2YXIgdGVzdHMgPSB7XG4gICAgICAgICAgICBzdGVwOiB7IHI6IGZhbHNlLCB0OiB0ZXN0U3RlcCB9LFxuICAgICAgICAgICAgc3RhcnQ6IHsgcjogdHJ1ZSwgdDogdGVzdFN0YXJ0IH0sXG4gICAgICAgICAgICBjb25uZWN0OiB7IHI6IHRydWUsIHQ6IHRlc3RDb25uZWN0IH0sXG4gICAgICAgICAgICBkaXJlY3Rpb246IHsgcjogdHJ1ZSwgdDogdGVzdERpcmVjdGlvbiB9LFxuICAgICAgICAgICAgc25hcDogeyByOiBmYWxzZSwgdDogdGVzdFNuYXAgfSxcbiAgICAgICAgICAgIGFuaW1hdGU6IHsgcjogZmFsc2UsIHQ6IHRlc3RBbmltYXRlIH0sXG4gICAgICAgICAgICBhbmltYXRpb25EdXJhdGlvbjogeyByOiBmYWxzZSwgdDogdGVzdEFuaW1hdGlvbkR1cmF0aW9uIH0sXG4gICAgICAgICAgICByYW5nZTogeyByOiB0cnVlLCB0OiB0ZXN0UmFuZ2UgfSxcbiAgICAgICAgICAgIG9yaWVudGF0aW9uOiB7IHI6IGZhbHNlLCB0OiB0ZXN0T3JpZW50YXRpb24gfSxcbiAgICAgICAgICAgIG1hcmdpbjogeyByOiBmYWxzZSwgdDogdGVzdE1hcmdpbiB9LFxuICAgICAgICAgICAgbGltaXQ6IHsgcjogZmFsc2UsIHQ6IHRlc3RMaW1pdCB9LFxuICAgICAgICAgICAgcGFkZGluZzogeyByOiBmYWxzZSwgdDogdGVzdFBhZGRpbmcgfSxcbiAgICAgICAgICAgIGJlaGF2aW91cjogeyByOiB0cnVlLCB0OiB0ZXN0QmVoYXZpb3VyIH0sXG4gICAgICAgICAgICBhcmlhRm9ybWF0OiB7IHI6IGZhbHNlLCB0OiB0ZXN0QXJpYUZvcm1hdCB9LFxuICAgICAgICAgICAgZm9ybWF0OiB7IHI6IGZhbHNlLCB0OiB0ZXN0Rm9ybWF0IH0sXG4gICAgICAgICAgICB0b29sdGlwczogeyByOiBmYWxzZSwgdDogdGVzdFRvb2x0aXBzIH0sXG4gICAgICAgICAgICBrZXlib2FyZFN1cHBvcnQ6IHsgcjogdHJ1ZSwgdDogdGVzdEtleWJvYXJkU3VwcG9ydCB9LFxuICAgICAgICAgICAgZG9jdW1lbnRFbGVtZW50OiB7IHI6IGZhbHNlLCB0OiB0ZXN0RG9jdW1lbnRFbGVtZW50IH0sXG4gICAgICAgICAgICBjc3NQcmVmaXg6IHsgcjogdHJ1ZSwgdDogdGVzdENzc1ByZWZpeCB9LFxuICAgICAgICAgICAgY3NzQ2xhc3NlczogeyByOiB0cnVlLCB0OiB0ZXN0Q3NzQ2xhc3NlcyB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgY29ubmVjdDogZmFsc2UsXG4gICAgICAgICAgICBkaXJlY3Rpb246IFwibHRyXCIsXG4gICAgICAgICAgICBiZWhhdmlvdXI6IFwidGFwXCIsXG4gICAgICAgICAgICBvcmllbnRhdGlvbjogXCJob3Jpem9udGFsXCIsXG4gICAgICAgICAgICBrZXlib2FyZFN1cHBvcnQ6IHRydWUsXG4gICAgICAgICAgICBjc3NQcmVmaXg6IFwibm9VaS1cIixcbiAgICAgICAgICAgIGNzc0NsYXNzZXM6IHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IFwidGFyZ2V0XCIsXG4gICAgICAgICAgICAgICAgYmFzZTogXCJiYXNlXCIsXG4gICAgICAgICAgICAgICAgb3JpZ2luOiBcIm9yaWdpblwiLFxuICAgICAgICAgICAgICAgIGhhbmRsZTogXCJoYW5kbGVcIixcbiAgICAgICAgICAgICAgICBoYW5kbGVMb3dlcjogXCJoYW5kbGUtbG93ZXJcIixcbiAgICAgICAgICAgICAgICBoYW5kbGVVcHBlcjogXCJoYW5kbGUtdXBwZXJcIixcbiAgICAgICAgICAgICAgICB0b3VjaEFyZWE6IFwidG91Y2gtYXJlYVwiLFxuICAgICAgICAgICAgICAgIGhvcml6b250YWw6IFwiaG9yaXpvbnRhbFwiLFxuICAgICAgICAgICAgICAgIHZlcnRpY2FsOiBcInZlcnRpY2FsXCIsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJiYWNrZ3JvdW5kXCIsXG4gICAgICAgICAgICAgICAgY29ubmVjdDogXCJjb25uZWN0XCIsXG4gICAgICAgICAgICAgICAgY29ubmVjdHM6IFwiY29ubmVjdHNcIixcbiAgICAgICAgICAgICAgICBsdHI6IFwibHRyXCIsXG4gICAgICAgICAgICAgICAgcnRsOiBcInJ0bFwiLFxuICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogXCJkcmFnZ2FibGVcIixcbiAgICAgICAgICAgICAgICBkcmFnOiBcInN0YXRlLWRyYWdcIixcbiAgICAgICAgICAgICAgICB0YXA6IFwic3RhdGUtdGFwXCIsXG4gICAgICAgICAgICAgICAgYWN0aXZlOiBcImFjdGl2ZVwiLFxuICAgICAgICAgICAgICAgIHRvb2x0aXA6IFwidG9vbHRpcFwiLFxuICAgICAgICAgICAgICAgIHBpcHM6IFwicGlwc1wiLFxuICAgICAgICAgICAgICAgIHBpcHNIb3Jpem9udGFsOiBcInBpcHMtaG9yaXpvbnRhbFwiLFxuICAgICAgICAgICAgICAgIHBpcHNWZXJ0aWNhbDogXCJwaXBzLXZlcnRpY2FsXCIsXG4gICAgICAgICAgICAgICAgbWFya2VyOiBcIm1hcmtlclwiLFxuICAgICAgICAgICAgICAgIG1hcmtlckhvcml6b250YWw6IFwibWFya2VyLWhvcml6b250YWxcIixcbiAgICAgICAgICAgICAgICBtYXJrZXJWZXJ0aWNhbDogXCJtYXJrZXItdmVydGljYWxcIixcbiAgICAgICAgICAgICAgICBtYXJrZXJOb3JtYWw6IFwibWFya2VyLW5vcm1hbFwiLFxuICAgICAgICAgICAgICAgIG1hcmtlckxhcmdlOiBcIm1hcmtlci1sYXJnZVwiLFxuICAgICAgICAgICAgICAgIG1hcmtlclN1YjogXCJtYXJrZXItc3ViXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IFwidmFsdWVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZUhvcml6b250YWw6IFwidmFsdWUtaG9yaXpvbnRhbFwiLFxuICAgICAgICAgICAgICAgIHZhbHVlVmVydGljYWw6IFwidmFsdWUtdmVydGljYWxcIixcbiAgICAgICAgICAgICAgICB2YWx1ZU5vcm1hbDogXCJ2YWx1ZS1ub3JtYWxcIixcbiAgICAgICAgICAgICAgICB2YWx1ZUxhcmdlOiBcInZhbHVlLWxhcmdlXCIsXG4gICAgICAgICAgICAgICAgdmFsdWVTdWI6IFwidmFsdWUtc3ViXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBcmlhRm9ybWF0IGRlZmF1bHRzIHRvIHJlZ3VsYXIgZm9ybWF0LCBpZiBhbnkuXG4gICAgICAgIGlmIChvcHRpb25zLmZvcm1hdCAmJiAhb3B0aW9ucy5hcmlhRm9ybWF0KSB7XG4gICAgICAgICAgICBvcHRpb25zLmFyaWFGb3JtYXQgPSBvcHRpb25zLmZvcm1hdDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJ1biBhbGwgb3B0aW9ucyB0aHJvdWdoIGEgdGVzdGluZyBtZWNoYW5pc20gdG8gZW5zdXJlIGNvcnJlY3RcbiAgICAgICAgLy8gaW5wdXQuIEl0IHNob3VsZCBiZSBub3RlZCB0aGF0IG9wdGlvbnMgbWlnaHQgZ2V0IG1vZGlmaWVkIHRvXG4gICAgICAgIC8vIGJlIGhhbmRsZWQgcHJvcGVybHkuIEUuZy4gd3JhcHBpbmcgaW50ZWdlcnMgaW4gYXJyYXlzLlxuICAgICAgICBPYmplY3Qua2V5cyh0ZXN0cykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgb3B0aW9uIGlzbid0IHNldCwgYnV0IGl0IGlzIHJlcXVpcmVkLCB0aHJvdyBhbiBlcnJvci5cbiAgICAgICAgICAgIGlmICghaXNTZXQob3B0aW9uc1tuYW1lXSkgJiYgZGVmYXVsdHNbbmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmICh0ZXN0c1tuYW1lXS5yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogJ1wiICsgbmFtZSArIFwiJyBpcyByZXF1aXJlZC5cIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRlc3RzW25hbWVdLnQocGFyc2VkLCAhaXNTZXQob3B0aW9uc1tuYW1lXSkgPyBkZWZhdWx0c1tuYW1lXSA6IG9wdGlvbnNbbmFtZV0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBGb3J3YXJkIHBpcHMgb3B0aW9uc1xuICAgICAgICBwYXJzZWQucGlwcyA9IG9wdGlvbnMucGlwcztcblxuICAgICAgICAvLyBBbGwgcmVjZW50IGJyb3dzZXJzIGFjY2VwdCB1bnByZWZpeGVkIHRyYW5zZm9ybS5cbiAgICAgICAgLy8gV2UgbmVlZCAtbXMtIGZvciBJRTkgYW5kIC13ZWJraXQtIGZvciBvbGRlciBBbmRyb2lkO1xuICAgICAgICAvLyBBc3N1bWUgdXNlIG9mIC13ZWJraXQtIGlmIHVucHJlZml4ZWQgYW5kIC1tcy0gYXJlIG5vdCBzdXBwb3J0ZWQuXG4gICAgICAgIC8vIGh0dHBzOi8vY2FuaXVzZS5jb20vI2ZlYXQ9dHJhbnNmb3JtczJkXG4gICAgICAgIHZhciBkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdmFyIG1zUHJlZml4ID0gZC5zdHlsZS5tc1RyYW5zZm9ybSAhPT0gdW5kZWZpbmVkO1xuICAgICAgICB2YXIgbm9QcmVmaXggPSBkLnN0eWxlLnRyYW5zZm9ybSAhPT0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHBhcnNlZC50cmFuc2Zvcm1SdWxlID0gbm9QcmVmaXggPyBcInRyYW5zZm9ybVwiIDogbXNQcmVmaXggPyBcIm1zVHJhbnNmb3JtXCIgOiBcIndlYmtpdFRyYW5zZm9ybVwiO1xuXG4gICAgICAgIC8vIFBpcHMgZG9uJ3QgbW92ZSwgc28gd2UgY2FuIHBsYWNlIHRoZW0gdXNpbmcgbGVmdC90b3AuXG4gICAgICAgIHZhciBzdHlsZXMgPSBbW1wibGVmdFwiLCBcInRvcFwiXSwgW1wicmlnaHRcIiwgXCJib3R0b21cIl1dO1xuXG4gICAgICAgIHBhcnNlZC5zdHlsZSA9IHN0eWxlc1twYXJzZWQuZGlyXVtwYXJzZWQub3J0XTtcblxuICAgICAgICByZXR1cm4gcGFyc2VkO1xuICAgIH1cblxuICAgIC8vZW5kcmVnaW9uXG5cbiAgICBmdW5jdGlvbiBzY29wZSh0YXJnZXQsIG9wdGlvbnMsIG9yaWdpbmFsT3B0aW9ucykge1xuICAgICAgICB2YXIgYWN0aW9ucyA9IGdldEFjdGlvbnMoKTtcbiAgICAgICAgdmFyIHN1cHBvcnRzVG91Y2hBY3Rpb25Ob25lID0gZ2V0U3VwcG9ydHNUb3VjaEFjdGlvbk5vbmUoKTtcbiAgICAgICAgdmFyIHN1cHBvcnRzUGFzc2l2ZSA9IHN1cHBvcnRzVG91Y2hBY3Rpb25Ob25lICYmIGdldFN1cHBvcnRzUGFzc2l2ZSgpO1xuXG4gICAgICAgIC8vIEFsbCB2YXJpYWJsZXMgbG9jYWwgdG8gJ3Njb3BlJyBhcmUgcHJlZml4ZWQgd2l0aCAnc2NvcGVfJ1xuXG4gICAgICAgIC8vIFNsaWRlciBET00gTm9kZXNcbiAgICAgICAgdmFyIHNjb3BlX1RhcmdldCA9IHRhcmdldDtcbiAgICAgICAgdmFyIHNjb3BlX0Jhc2U7XG4gICAgICAgIHZhciBzY29wZV9IYW5kbGVzO1xuICAgICAgICB2YXIgc2NvcGVfQ29ubmVjdHM7XG4gICAgICAgIHZhciBzY29wZV9QaXBzO1xuICAgICAgICB2YXIgc2NvcGVfVG9vbHRpcHM7XG5cbiAgICAgICAgLy8gT3ZlcnJpZGUgZm9yIHRoZSAnYW5pbWF0ZScgb3B0aW9uXG4gICAgICAgIHZhciBzY29wZV9TaG91bGRBbmltYXRlID0gdHJ1ZTtcblxuICAgICAgICAvLyBTbGlkZXIgc3RhdGUgdmFsdWVzXG4gICAgICAgIHZhciBzY29wZV9TcGVjdHJ1bSA9IG9wdGlvbnMuc3BlY3RydW07XG4gICAgICAgIHZhciBzY29wZV9WYWx1ZXMgPSBbXTtcbiAgICAgICAgdmFyIHNjb3BlX0xvY2F0aW9ucyA9IFtdO1xuICAgICAgICB2YXIgc2NvcGVfSGFuZGxlTnVtYmVycyA9IFtdO1xuICAgICAgICB2YXIgc2NvcGVfQWN0aXZlSGFuZGxlc0NvdW50ID0gMDtcbiAgICAgICAgdmFyIHNjb3BlX0V2ZW50cyA9IHt9O1xuXG4gICAgICAgIC8vIEV4cG9zZWQgQVBJXG4gICAgICAgIHZhciBzY29wZV9TZWxmO1xuXG4gICAgICAgIC8vIERvY3VtZW50IE5vZGVzXG4gICAgICAgIHZhciBzY29wZV9Eb2N1bWVudCA9IHRhcmdldC5vd25lckRvY3VtZW50O1xuICAgICAgICB2YXIgc2NvcGVfRG9jdW1lbnRFbGVtZW50ID0gb3B0aW9ucy5kb2N1bWVudEVsZW1lbnQgfHwgc2NvcGVfRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICB2YXIgc2NvcGVfQm9keSA9IHNjb3BlX0RvY3VtZW50LmJvZHk7XG5cbiAgICAgICAgLy8gUGlwcyBjb25zdGFudHNcbiAgICAgICAgdmFyIFBJUFNfTk9ORSA9IC0xO1xuICAgICAgICB2YXIgUElQU19OT19WQUxVRSA9IDA7XG4gICAgICAgIHZhciBQSVBTX0xBUkdFX1ZBTFVFID0gMTtcbiAgICAgICAgdmFyIFBJUFNfU01BTExfVkFMVUUgPSAyO1xuXG4gICAgICAgIC8vIEZvciBob3Jpem9udGFsIHNsaWRlcnMgaW4gc3RhbmRhcmQgbHRyIGRvY3VtZW50cyxcbiAgICAgICAgLy8gbWFrZSAubm9VaS1vcmlnaW4gb3ZlcmZsb3cgdG8gdGhlIGxlZnQgc28gdGhlIGRvY3VtZW50IGRvZXNuJ3Qgc2Nyb2xsLlxuICAgICAgICB2YXIgc2NvcGVfRGlyT2Zmc2V0ID0gc2NvcGVfRG9jdW1lbnQuZGlyID09PSBcInJ0bFwiIHx8IG9wdGlvbnMub3J0ID09PSAxID8gMCA6IDEwMDtcblxuICAgICAgICAvLyBDcmVhdGVzIGEgbm9kZSwgYWRkcyBpdCB0byB0YXJnZXQsIHJldHVybnMgdGhlIG5ldyBub2RlLlxuICAgICAgICBmdW5jdGlvbiBhZGROb2RlVG8oYWRkVGFyZ2V0LCBjbGFzc05hbWUpIHtcbiAgICAgICAgICAgIHZhciBkaXYgPSBzY29wZV9Eb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgICAgICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICAgICAgYWRkQ2xhc3MoZGl2LCBjbGFzc05hbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhZGRUYXJnZXQuYXBwZW5kQ2hpbGQoZGl2KTtcblxuICAgICAgICAgICAgcmV0dXJuIGRpdjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFwcGVuZCBhIG9yaWdpbiB0byB0aGUgYmFzZVxuICAgICAgICBmdW5jdGlvbiBhZGRPcmlnaW4oYmFzZSwgaGFuZGxlTnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgb3JpZ2luID0gYWRkTm9kZVRvKGJhc2UsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5vcmlnaW4pO1xuICAgICAgICAgICAgdmFyIGhhbmRsZSA9IGFkZE5vZGVUbyhvcmlnaW4sIG9wdGlvbnMuY3NzQ2xhc3Nlcy5oYW5kbGUpO1xuXG4gICAgICAgICAgICBhZGROb2RlVG8oaGFuZGxlLCBvcHRpb25zLmNzc0NsYXNzZXMudG91Y2hBcmVhKTtcblxuICAgICAgICAgICAgaGFuZGxlLnNldEF0dHJpYnV0ZShcImRhdGEtaGFuZGxlXCIsIGhhbmRsZU51bWJlcik7XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmtleWJvYXJkU3VwcG9ydCkge1xuICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUTUwvR2xvYmFsX2F0dHJpYnV0ZXMvdGFiaW5kZXhcbiAgICAgICAgICAgICAgICAvLyAwID0gZm9jdXNhYmxlIGFuZCByZWFjaGFibGVcbiAgICAgICAgICAgICAgICBoYW5kbGUuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCIwXCIpO1xuICAgICAgICAgICAgICAgIGhhbmRsZS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRLZXlkb3duKGV2ZW50LCBoYW5kbGVOdW1iZXIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBoYW5kbGUuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInNsaWRlclwiKTtcbiAgICAgICAgICAgIGhhbmRsZS5zZXRBdHRyaWJ1dGUoXCJhcmlhLW9yaWVudGF0aW9uXCIsIG9wdGlvbnMub3J0ID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCIpO1xuXG4gICAgICAgICAgICBpZiAoaGFuZGxlTnVtYmVyID09PSAwKSB7XG4gICAgICAgICAgICAgICAgYWRkQ2xhc3MoaGFuZGxlLCBvcHRpb25zLmNzc0NsYXNzZXMuaGFuZGxlTG93ZXIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChoYW5kbGVOdW1iZXIgPT09IG9wdGlvbnMuaGFuZGxlcyAtIDEpIHtcbiAgICAgICAgICAgICAgICBhZGRDbGFzcyhoYW5kbGUsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5oYW5kbGVVcHBlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBvcmlnaW47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbnNlcnQgbm9kZXMgZm9yIGNvbm5lY3QgZWxlbWVudHNcbiAgICAgICAgZnVuY3Rpb24gYWRkQ29ubmVjdChiYXNlLCBhZGQpIHtcbiAgICAgICAgICAgIGlmICghYWRkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYWRkTm9kZVRvKGJhc2UsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5jb25uZWN0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBoYW5kbGVzIHRvIHRoZSBzbGlkZXIgYmFzZS5cbiAgICAgICAgZnVuY3Rpb24gYWRkRWxlbWVudHMoY29ubmVjdE9wdGlvbnMsIGJhc2UpIHtcbiAgICAgICAgICAgIHZhciBjb25uZWN0QmFzZSA9IGFkZE5vZGVUbyhiYXNlLCBvcHRpb25zLmNzc0NsYXNzZXMuY29ubmVjdHMpO1xuXG4gICAgICAgICAgICBzY29wZV9IYW5kbGVzID0gW107XG4gICAgICAgICAgICBzY29wZV9Db25uZWN0cyA9IFtdO1xuXG4gICAgICAgICAgICBzY29wZV9Db25uZWN0cy5wdXNoKGFkZENvbm5lY3QoY29ubmVjdEJhc2UsIGNvbm5lY3RPcHRpb25zWzBdKSk7XG5cbiAgICAgICAgICAgIC8vIFs6Ojo6Tz09PT1PPT09PU89PT09XVxuICAgICAgICAgICAgLy8gY29ubmVjdE9wdGlvbnMgPSBbMCwgMSwgMSwgMV1cblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcHRpb25zLmhhbmRsZXM7IGkrKykge1xuICAgICAgICAgICAgICAgIC8vIEtlZXAgYSBsaXN0IG9mIGFsbCBhZGRlZCBoYW5kbGVzLlxuICAgICAgICAgICAgICAgIHNjb3BlX0hhbmRsZXMucHVzaChhZGRPcmlnaW4oYmFzZSwgaSkpO1xuICAgICAgICAgICAgICAgIHNjb3BlX0hhbmRsZU51bWJlcnNbaV0gPSBpO1xuICAgICAgICAgICAgICAgIHNjb3BlX0Nvbm5lY3RzLnB1c2goYWRkQ29ubmVjdChjb25uZWN0QmFzZSwgY29ubmVjdE9wdGlvbnNbaSArIDFdKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbml0aWFsaXplIGEgc2luZ2xlIHNsaWRlci5cbiAgICAgICAgZnVuY3Rpb24gYWRkU2xpZGVyKGFkZFRhcmdldCkge1xuICAgICAgICAgICAgLy8gQXBwbHkgY2xhc3NlcyBhbmQgZGF0YSB0byB0aGUgdGFyZ2V0LlxuICAgICAgICAgICAgYWRkQ2xhc3MoYWRkVGFyZ2V0LCBvcHRpb25zLmNzc0NsYXNzZXMudGFyZ2V0KTtcblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZGlyID09PSAwKSB7XG4gICAgICAgICAgICAgICAgYWRkQ2xhc3MoYWRkVGFyZ2V0LCBvcHRpb25zLmNzc0NsYXNzZXMubHRyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWRkQ2xhc3MoYWRkVGFyZ2V0LCBvcHRpb25zLmNzc0NsYXNzZXMucnRsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMub3J0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgYWRkQ2xhc3MoYWRkVGFyZ2V0LCBvcHRpb25zLmNzc0NsYXNzZXMuaG9yaXpvbnRhbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFkZENsYXNzKGFkZFRhcmdldCwgb3B0aW9ucy5jc3NDbGFzc2VzLnZlcnRpY2FsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGFkZE5vZGVUbyhhZGRUYXJnZXQsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5iYXNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFkZFRvb2x0aXAoaGFuZGxlLCBoYW5kbGVOdW1iZXIpIHtcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy50b29sdGlwc1toYW5kbGVOdW1iZXJdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYWRkTm9kZVRvKGhhbmRsZS5maXJzdENoaWxkLCBvcHRpb25zLmNzc0NsYXNzZXMudG9vbHRpcCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEaXNhYmxlIHRoZSBzbGlkZXIgZHJhZ2dpbmcgaWYgYW55IGhhbmRsZSBpcyBkaXNhYmxlZFxuICAgICAgICBmdW5jdGlvbiBpc0hhbmRsZURpc2FibGVkKGhhbmRsZU51bWJlcikge1xuICAgICAgICAgICAgdmFyIGhhbmRsZU9yaWdpbiA9IHNjb3BlX0hhbmRsZXNbaGFuZGxlTnVtYmVyXTtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVPcmlnaW4uaGFzQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZW1vdmVUb29sdGlwcygpIHtcbiAgICAgICAgICAgIGlmIChzY29wZV9Ub29sdGlwcykge1xuICAgICAgICAgICAgICAgIHJlbW92ZUV2ZW50KFwidXBkYXRlLnRvb2x0aXBzXCIpO1xuICAgICAgICAgICAgICAgIHNjb3BlX1Rvb2x0aXBzLmZvckVhY2goZnVuY3Rpb24odG9vbHRpcCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9vbHRpcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlRWxlbWVudCh0b29sdGlwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHNjb3BlX1Rvb2x0aXBzID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSB0b29sdGlwcyBvcHRpb24gaXMgYSBzaG9ydGhhbmQgZm9yIHVzaW5nIHRoZSAndXBkYXRlJyBldmVudC5cbiAgICAgICAgZnVuY3Rpb24gdG9vbHRpcHMoKSB7XG4gICAgICAgICAgICByZW1vdmVUb29sdGlwcygpO1xuXG4gICAgICAgICAgICAvLyBUb29sdGlwcyBhcmUgYWRkZWQgd2l0aCBvcHRpb25zLnRvb2x0aXBzIGluIG9yaWdpbmFsIG9yZGVyLlxuICAgICAgICAgICAgc2NvcGVfVG9vbHRpcHMgPSBzY29wZV9IYW5kbGVzLm1hcChhZGRUb29sdGlwKTtcblxuICAgICAgICAgICAgYmluZEV2ZW50KFwidXBkYXRlLnRvb2x0aXBzXCIsIGZ1bmN0aW9uKHZhbHVlcywgaGFuZGxlTnVtYmVyLCB1bmVuY29kZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXNjb3BlX1Rvb2x0aXBzW2hhbmRsZU51bWJlcl0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBmb3JtYXR0ZWRWYWx1ZSA9IHZhbHVlc1toYW5kbGVOdW1iZXJdO1xuXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMudG9vbHRpcHNbaGFuZGxlTnVtYmVyXSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXR0ZWRWYWx1ZSA9IG9wdGlvbnMudG9vbHRpcHNbaGFuZGxlTnVtYmVyXS50byh1bmVuY29kZWRbaGFuZGxlTnVtYmVyXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2NvcGVfVG9vbHRpcHNbaGFuZGxlTnVtYmVyXS5pbm5lckhUTUwgPSBmb3JtYXR0ZWRWYWx1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYXJpYSgpIHtcbiAgICAgICAgICAgIGJpbmRFdmVudChcInVwZGF0ZVwiLCBmdW5jdGlvbih2YWx1ZXMsIGhhbmRsZU51bWJlciwgdW5lbmNvZGVkLCB0YXAsIHBvc2l0aW9ucykge1xuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBBcmlhIFZhbHVlcyBmb3IgYWxsIGhhbmRsZXMsIGFzIGEgY2hhbmdlIGluIG9uZSBjaGFuZ2VzIG1pbiBhbmQgbWF4IHZhbHVlcyBmb3IgdGhlIG5leHQuXG4gICAgICAgICAgICAgICAgc2NvcGVfSGFuZGxlTnVtYmVycy5mb3JFYWNoKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoYW5kbGUgPSBzY29wZV9IYW5kbGVzW2luZGV4XTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgbWluID0gY2hlY2tIYW5kbGVQb3NpdGlvbihzY29wZV9Mb2NhdGlvbnMsIGluZGV4LCAwLCB0cnVlLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1heCA9IGNoZWNrSGFuZGxlUG9zaXRpb24oc2NvcGVfTG9jYXRpb25zLCBpbmRleCwgMTAwLCB0cnVlLCB0cnVlLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgbm93ID0gcG9zaXRpb25zW2luZGV4XTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBGb3JtYXR0ZWQgdmFsdWUgZm9yIGRpc3BsYXlcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRleHQgPSBvcHRpb25zLmFyaWFGb3JtYXQudG8odW5lbmNvZGVkW2luZGV4XSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gTWFwIHRvIHNsaWRlciByYW5nZSB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgbWluID0gc2NvcGVfU3BlY3RydW0uZnJvbVN0ZXBwaW5nKG1pbikudG9GaXhlZCgxKTtcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gc2NvcGVfU3BlY3RydW0uZnJvbVN0ZXBwaW5nKG1heCkudG9GaXhlZCgxKTtcbiAgICAgICAgICAgICAgICAgICAgbm93ID0gc2NvcGVfU3BlY3RydW0uZnJvbVN0ZXBwaW5nKG5vdykudG9GaXhlZCgxKTtcblxuICAgICAgICAgICAgICAgICAgICBoYW5kbGUuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKFwiYXJpYS12YWx1ZW1pblwiLCBtaW4pO1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGUuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKFwiYXJpYS12YWx1ZW1heFwiLCBtYXgpO1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGUuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKFwiYXJpYS12YWx1ZW5vd1wiLCBub3cpO1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGUuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKFwiYXJpYS12YWx1ZXRleHRcIiwgdGV4dCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEdyb3VwKG1vZGUsIHZhbHVlcywgc3RlcHBlZCkge1xuICAgICAgICAgICAgLy8gVXNlIHRoZSByYW5nZS5cbiAgICAgICAgICAgIGlmIChtb2RlID09PSBcInJhbmdlXCIgfHwgbW9kZSA9PT0gXCJzdGVwc1wiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlX1NwZWN0cnVtLnhWYWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtb2RlID09PSBcImNvdW50XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVzIDwgMikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1VpU2xpZGVyIChcIiArIFZFUlNJT04gKyBcIik6ICd2YWx1ZXMnICg+PSAyKSByZXF1aXJlZCBmb3IgbW9kZSAnY291bnQnLlwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBEaXZpZGUgMCAtIDEwMCBpbiAnY291bnQnIHBhcnRzLlxuICAgICAgICAgICAgICAgIHZhciBpbnRlcnZhbCA9IHZhbHVlcyAtIDE7XG4gICAgICAgICAgICAgICAgdmFyIHNwcmVhZCA9IDEwMCAvIGludGVydmFsO1xuXG4gICAgICAgICAgICAgICAgdmFsdWVzID0gW107XG5cbiAgICAgICAgICAgICAgICAvLyBMaXN0IHRoZXNlIHBhcnRzIGFuZCBoYXZlIHRoZW0gaGFuZGxlZCBhcyAncG9zaXRpb25zJy5cbiAgICAgICAgICAgICAgICB3aGlsZSAoaW50ZXJ2YWwtLSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZXNbaW50ZXJ2YWxdID0gaW50ZXJ2YWwgKiBzcHJlYWQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goMTAwKTtcblxuICAgICAgICAgICAgICAgIG1vZGUgPSBcInBvc2l0aW9uc1wiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobW9kZSA9PT0gXCJwb3NpdGlvbnNcIikge1xuICAgICAgICAgICAgICAgIC8vIE1hcCBhbGwgcGVyY2VudGFnZXMgdG8gb24tcmFuZ2UgdmFsdWVzLlxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZXMubWFwKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzY29wZV9TcGVjdHJ1bS5mcm9tU3RlcHBpbmcoc3RlcHBlZCA/IHNjb3BlX1NwZWN0cnVtLmdldFN0ZXAodmFsdWUpIDogdmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobW9kZSA9PT0gXCJ2YWx1ZXNcIikge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZSB2YWx1ZSBtdXN0IGJlIHN0ZXBwZWQsIGl0IG5lZWRzIHRvIGJlIGNvbnZlcnRlZCB0byBhIHBlcmNlbnRhZ2UgZmlyc3QuXG4gICAgICAgICAgICAgICAgaWYgKHN0ZXBwZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlcy5tYXAoZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgdG8gcGVyY2VudGFnZSwgYXBwbHkgc3RlcCwgcmV0dXJuIHRvIHZhbHVlLlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlX1NwZWN0cnVtLmZyb21TdGVwcGluZyhzY29wZV9TcGVjdHJ1bS5nZXRTdGVwKHNjb3BlX1NwZWN0cnVtLnRvU3RlcHBpbmcodmFsdWUpKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgd2UgY2FuIHNpbXBseSB1c2UgdGhlIHZhbHVlcy5cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVTcHJlYWQoZGVuc2l0eSwgbW9kZSwgZ3JvdXApIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNhZmVJbmNyZW1lbnQodmFsdWUsIGluY3JlbWVudCkge1xuICAgICAgICAgICAgICAgIC8vIEF2b2lkIGZsb2F0aW5nIHBvaW50IHZhcmlhbmNlIGJ5IGRyb3BwaW5nIHRoZSBzbWFsbGVzdCBkZWNpbWFsIHBsYWNlcy5cbiAgICAgICAgICAgICAgICByZXR1cm4gKHZhbHVlICsgaW5jcmVtZW50KS50b0ZpeGVkKDcpIC8gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGluZGV4ZXMgPSB7fTtcbiAgICAgICAgICAgIHZhciBmaXJzdEluUmFuZ2UgPSBzY29wZV9TcGVjdHJ1bS54VmFsWzBdO1xuICAgICAgICAgICAgdmFyIGxhc3RJblJhbmdlID0gc2NvcGVfU3BlY3RydW0ueFZhbFtzY29wZV9TcGVjdHJ1bS54VmFsLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgdmFyIGlnbm9yZUZpcnN0ID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgaWdub3JlTGFzdCA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIHByZXZQY3QgPSAwO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgYSBjb3B5IG9mIHRoZSBncm91cCwgc29ydCBpdCBhbmQgZmlsdGVyIGF3YXkgYWxsIGR1cGxpY2F0ZXMuXG4gICAgICAgICAgICBncm91cCA9IHVuaXF1ZShcbiAgICAgICAgICAgICAgICBncm91cC5zbGljZSgpLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgcmFuZ2Ugc3RhcnRzIHdpdGggdGhlIGZpcnN0IGVsZW1lbnQuXG4gICAgICAgICAgICBpZiAoZ3JvdXBbMF0gIT09IGZpcnN0SW5SYW5nZSkge1xuICAgICAgICAgICAgICAgIGdyb3VwLnVuc2hpZnQoZmlyc3RJblJhbmdlKTtcbiAgICAgICAgICAgICAgICBpZ25vcmVGaXJzdCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIExpa2V3aXNlIGZvciB0aGUgbGFzdCBvbmUuXG4gICAgICAgICAgICBpZiAoZ3JvdXBbZ3JvdXAubGVuZ3RoIC0gMV0gIT09IGxhc3RJblJhbmdlKSB7XG4gICAgICAgICAgICAgICAgZ3JvdXAucHVzaChsYXN0SW5SYW5nZSk7XG4gICAgICAgICAgICAgICAgaWdub3JlTGFzdCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGdyb3VwLmZvckVhY2goZnVuY3Rpb24oY3VycmVudCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgc3RlcCBhbmQgdGhlIGxvd2VyICsgdXBwZXIgcG9zaXRpb25zLlxuICAgICAgICAgICAgICAgIHZhciBzdGVwO1xuICAgICAgICAgICAgICAgIHZhciBpO1xuICAgICAgICAgICAgICAgIHZhciBxO1xuICAgICAgICAgICAgICAgIHZhciBsb3cgPSBjdXJyZW50O1xuICAgICAgICAgICAgICAgIHZhciBoaWdoID0gZ3JvdXBbaW5kZXggKyAxXTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3UGN0O1xuICAgICAgICAgICAgICAgIHZhciBwY3REaWZmZXJlbmNlO1xuICAgICAgICAgICAgICAgIHZhciBwY3RQb3M7XG4gICAgICAgICAgICAgICAgdmFyIHR5cGU7XG4gICAgICAgICAgICAgICAgdmFyIHN0ZXBzO1xuICAgICAgICAgICAgICAgIHZhciByZWFsU3RlcHM7XG4gICAgICAgICAgICAgICAgdmFyIHN0ZXBTaXplO1xuICAgICAgICAgICAgICAgIHZhciBpc1N0ZXBzID0gbW9kZSA9PT0gXCJzdGVwc1wiO1xuXG4gICAgICAgICAgICAgICAgLy8gV2hlbiB1c2luZyAnc3RlcHMnIG1vZGUsIHVzZSB0aGUgcHJvdmlkZWQgc3RlcHMuXG4gICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSdsbCBzdGVwIG9uIHRvIHRoZSBuZXh0IHN1YnJhbmdlLlxuICAgICAgICAgICAgICAgIGlmIChpc1N0ZXBzKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0ZXAgPSBzY29wZV9TcGVjdHJ1bS54TnVtU3RlcHNbaW5kZXhdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIERlZmF1bHQgdG8gYSAnZnVsbCcgc3RlcC5cbiAgICAgICAgICAgICAgICBpZiAoIXN0ZXApIHtcbiAgICAgICAgICAgICAgICAgICAgc3RlcCA9IGhpZ2ggLSBsb3c7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gTG93IGNhbiBiZSAwLCBzbyB0ZXN0IGZvciBmYWxzZS4gSWYgaGlnaCBpcyB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgLy8gd2UgYXJlIGF0IHRoZSBsYXN0IHN1YnJhbmdlLiBJbmRleCAwIGlzIGFscmVhZHkgaGFuZGxlZC5cbiAgICAgICAgICAgICAgICBpZiAobG93ID09PSBmYWxzZSB8fCBoaWdoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSBzdGVwIGlzbid0IDAsIHdoaWNoIHdvdWxkIGNhdXNlIGFuIGluZmluaXRlIGxvb3AgKCM2NTQpXG4gICAgICAgICAgICAgICAgc3RlcCA9IE1hdGgubWF4KHN0ZXAsIDAuMDAwMDAwMSk7XG5cbiAgICAgICAgICAgICAgICAvLyBGaW5kIGFsbCBzdGVwcyBpbiB0aGUgc3VicmFuZ2UuXG4gICAgICAgICAgICAgICAgZm9yIChpID0gbG93OyBpIDw9IGhpZ2g7IGkgPSBzYWZlSW5jcmVtZW50KGksIHN0ZXApKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgcGVyY2VudGFnZSB2YWx1ZSBmb3IgdGhlIGN1cnJlbnQgc3RlcCxcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBzaXplIGZvciB0aGUgc3VicmFuZ2UuXG4gICAgICAgICAgICAgICAgICAgIG5ld1BjdCA9IHNjb3BlX1NwZWN0cnVtLnRvU3RlcHBpbmcoaSk7XG4gICAgICAgICAgICAgICAgICAgIHBjdERpZmZlcmVuY2UgPSBuZXdQY3QgLSBwcmV2UGN0O1xuXG4gICAgICAgICAgICAgICAgICAgIHN0ZXBzID0gcGN0RGlmZmVyZW5jZSAvIGRlbnNpdHk7XG4gICAgICAgICAgICAgICAgICAgIHJlYWxTdGVwcyA9IE1hdGgucm91bmQoc3RlcHMpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgcmF0aW8gcmVwcmVzZW50cyB0aGUgYW1vdW50IG9mIHBlcmNlbnRhZ2Utc3BhY2UgYSBwb2ludCBpbmRpY2F0ZXMuXG4gICAgICAgICAgICAgICAgICAgIC8vIEZvciBhIGRlbnNpdHkgMSB0aGUgcG9pbnRzL3BlcmNlbnRhZ2UgPSAxLiBGb3IgZGVuc2l0eSAyLCB0aGF0IHBlcmNlbnRhZ2UgbmVlZHMgdG8gYmUgcmUtZGl2aWRlZC5cbiAgICAgICAgICAgICAgICAgICAgLy8gUm91bmQgdGhlIHBlcmNlbnRhZ2Ugb2Zmc2V0IHRvIGFuIGV2ZW4gbnVtYmVyLCB0aGVuIGRpdmlkZSBieSB0d29cbiAgICAgICAgICAgICAgICAgICAgLy8gdG8gc3ByZWFkIHRoZSBvZmZzZXQgb24gYm90aCBzaWRlcyBvZiB0aGUgcmFuZ2UuXG4gICAgICAgICAgICAgICAgICAgIHN0ZXBTaXplID0gcGN0RGlmZmVyZW5jZSAvIHJlYWxTdGVwcztcblxuICAgICAgICAgICAgICAgICAgICAvLyBEaXZpZGUgYWxsIHBvaW50cyBldmVubHksIGFkZGluZyB0aGUgY29ycmVjdCBudW1iZXIgdG8gdGhpcyBzdWJyYW5nZS5cbiAgICAgICAgICAgICAgICAgICAgLy8gUnVuIHVwIHRvIDw9IHNvIHRoYXQgMTAwJSBnZXRzIGEgcG9pbnQsIGV2ZW50IGlmIGlnbm9yZUxhc3QgaXMgc2V0LlxuICAgICAgICAgICAgICAgICAgICBmb3IgKHEgPSAxOyBxIDw9IHJlYWxTdGVwczsgcSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgcmF0aW8gYmV0d2VlbiB0aGUgcm91bmRlZCB2YWx1ZSBhbmQgdGhlIGFjdHVhbCBzaXplIG1pZ2h0IGJlIH4xJSBvZmYuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDb3JyZWN0IHRoZSBwZXJjZW50YWdlIG9mZnNldCBieSB0aGUgbnVtYmVyIG9mIHBvaW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGVyIHN1YnJhbmdlLiBkZW5zaXR5ID0gMSB3aWxsIHJlc3VsdCBpbiAxMDAgcG9pbnRzIG9uIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZnVsbCByYW5nZSwgMiBmb3IgNTAsIDQgZm9yIDI1LCBldGMuXG4gICAgICAgICAgICAgICAgICAgICAgICBwY3RQb3MgPSBwcmV2UGN0ICsgcSAqIHN0ZXBTaXplO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhlc1twY3RQb3MudG9GaXhlZCg1KV0gPSBbc2NvcGVfU3BlY3RydW0uZnJvbVN0ZXBwaW5nKHBjdFBvcyksIDBdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIHRoZSBwb2ludCB0eXBlLlxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gZ3JvdXAuaW5kZXhPZihpKSA+IC0xID8gUElQU19MQVJHRV9WQUxVRSA6IGlzU3RlcHMgPyBQSVBTX1NNQUxMX1ZBTFVFIDogUElQU19OT19WQUxVRTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBFbmZvcmNlIHRoZSAnaWdub3JlRmlyc3QnIG9wdGlvbiBieSBvdmVyd3JpdGluZyB0aGUgdHlwZSBmb3IgMC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpbmRleCAmJiBpZ25vcmVGaXJzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoIShpID09PSBoaWdoICYmIGlnbm9yZUxhc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBNYXJrIHRoZSAndHlwZScgb2YgdGhpcyBwb2ludC4gMCA9IHBsYWluLCAxID0gcmVhbCB2YWx1ZSwgMiA9IHN0ZXAgdmFsdWUuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleGVzW25ld1BjdC50b0ZpeGVkKDUpXSA9IFtpLCB0eXBlXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgcGVyY2VudGFnZSBjb3VudC5cbiAgICAgICAgICAgICAgICAgICAgcHJldlBjdCA9IG5ld1BjdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGluZGV4ZXM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhZGRNYXJraW5nKHNwcmVhZCwgZmlsdGVyRnVuYywgZm9ybWF0dGVyKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IHNjb3BlX0RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgICAgIHZhciB2YWx1ZVNpemVDbGFzc2VzID0gW107XG4gICAgICAgICAgICB2YWx1ZVNpemVDbGFzc2VzW1BJUFNfTk9fVkFMVUVdID0gb3B0aW9ucy5jc3NDbGFzc2VzLnZhbHVlTm9ybWFsO1xuICAgICAgICAgICAgdmFsdWVTaXplQ2xhc3Nlc1tQSVBTX0xBUkdFX1ZBTFVFXSA9IG9wdGlvbnMuY3NzQ2xhc3Nlcy52YWx1ZUxhcmdlO1xuICAgICAgICAgICAgdmFsdWVTaXplQ2xhc3Nlc1tQSVBTX1NNQUxMX1ZBTFVFXSA9IG9wdGlvbnMuY3NzQ2xhc3Nlcy52YWx1ZVN1YjtcblxuICAgICAgICAgICAgdmFyIG1hcmtlclNpemVDbGFzc2VzID0gW107XG4gICAgICAgICAgICBtYXJrZXJTaXplQ2xhc3Nlc1tQSVBTX05PX1ZBTFVFXSA9IG9wdGlvbnMuY3NzQ2xhc3Nlcy5tYXJrZXJOb3JtYWw7XG4gICAgICAgICAgICBtYXJrZXJTaXplQ2xhc3Nlc1tQSVBTX0xBUkdFX1ZBTFVFXSA9IG9wdGlvbnMuY3NzQ2xhc3Nlcy5tYXJrZXJMYXJnZTtcbiAgICAgICAgICAgIG1hcmtlclNpemVDbGFzc2VzW1BJUFNfU01BTExfVkFMVUVdID0gb3B0aW9ucy5jc3NDbGFzc2VzLm1hcmtlclN1YjtcblxuICAgICAgICAgICAgdmFyIHZhbHVlT3JpZW50YXRpb25DbGFzc2VzID0gW29wdGlvbnMuY3NzQ2xhc3Nlcy52YWx1ZUhvcml6b250YWwsIG9wdGlvbnMuY3NzQ2xhc3Nlcy52YWx1ZVZlcnRpY2FsXTtcbiAgICAgICAgICAgIHZhciBtYXJrZXJPcmllbnRhdGlvbkNsYXNzZXMgPSBbb3B0aW9ucy5jc3NDbGFzc2VzLm1hcmtlckhvcml6b250YWwsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5tYXJrZXJWZXJ0aWNhbF07XG5cbiAgICAgICAgICAgIGFkZENsYXNzKGVsZW1lbnQsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5waXBzKTtcbiAgICAgICAgICAgIGFkZENsYXNzKGVsZW1lbnQsIG9wdGlvbnMub3J0ID09PSAwID8gb3B0aW9ucy5jc3NDbGFzc2VzLnBpcHNIb3Jpem9udGFsIDogb3B0aW9ucy5jc3NDbGFzc2VzLnBpcHNWZXJ0aWNhbCk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldENsYXNzZXModHlwZSwgc291cmNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGEgPSBzb3VyY2UgPT09IG9wdGlvbnMuY3NzQ2xhc3Nlcy52YWx1ZTtcbiAgICAgICAgICAgICAgICB2YXIgb3JpZW50YXRpb25DbGFzc2VzID0gYSA/IHZhbHVlT3JpZW50YXRpb25DbGFzc2VzIDogbWFya2VyT3JpZW50YXRpb25DbGFzc2VzO1xuICAgICAgICAgICAgICAgIHZhciBzaXplQ2xhc3NlcyA9IGEgPyB2YWx1ZVNpemVDbGFzc2VzIDogbWFya2VyU2l6ZUNsYXNzZXM7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gc291cmNlICsgXCIgXCIgKyBvcmllbnRhdGlvbkNsYXNzZXNbb3B0aW9ucy5vcnRdICsgXCIgXCIgKyBzaXplQ2xhc3Nlc1t0eXBlXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gYWRkU3ByZWFkKG9mZnNldCwgdmFsdWUsIHR5cGUpIHtcbiAgICAgICAgICAgICAgICAvLyBBcHBseSB0aGUgZmlsdGVyIGZ1bmN0aW9uLCBpZiBpdCBpcyBzZXQuXG4gICAgICAgICAgICAgICAgdHlwZSA9IGZpbHRlckZ1bmMgPyBmaWx0ZXJGdW5jKHZhbHVlLCB0eXBlKSA6IHR5cGU7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gUElQU19OT05FKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgYSBtYXJrZXIgZm9yIGV2ZXJ5IHBvaW50XG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBhZGROb2RlVG8oZWxlbWVudCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NOYW1lID0gZ2V0Q2xhc3Nlcyh0eXBlLCBvcHRpb25zLmNzc0NsYXNzZXMubWFya2VyKTtcbiAgICAgICAgICAgICAgICBub2RlLnN0eWxlW29wdGlvbnMuc3R5bGVdID0gb2Zmc2V0ICsgXCIlXCI7XG5cbiAgICAgICAgICAgICAgICAvLyBWYWx1ZXMgYXJlIG9ubHkgYXBwZW5kZWQgZm9yIHBvaW50cyBtYXJrZWQgJzEnIG9yICcyJy5cbiAgICAgICAgICAgICAgICBpZiAodHlwZSA+IFBJUFNfTk9fVkFMVUUpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZSA9IGFkZE5vZGVUbyhlbGVtZW50LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NOYW1lID0gZ2V0Q2xhc3Nlcyh0eXBlLCBvcHRpb25zLmNzc0NsYXNzZXMudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShcImRhdGEtdmFsdWVcIiwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBub2RlLnN0eWxlW29wdGlvbnMuc3R5bGVdID0gb2Zmc2V0ICsgXCIlXCI7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuaW5uZXJIVE1MID0gZm9ybWF0dGVyLnRvKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEFwcGVuZCBhbGwgcG9pbnRzLlxuICAgICAgICAgICAgT2JqZWN0LmtleXMoc3ByZWFkKS5mb3JFYWNoKGZ1bmN0aW9uKG9mZnNldCkge1xuICAgICAgICAgICAgICAgIGFkZFNwcmVhZChvZmZzZXQsIHNwcmVhZFtvZmZzZXRdWzBdLCBzcHJlYWRbb2Zmc2V0XVsxXSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZW1vdmVQaXBzKCkge1xuICAgICAgICAgICAgaWYgKHNjb3BlX1BpcHMpIHtcbiAgICAgICAgICAgICAgICByZW1vdmVFbGVtZW50KHNjb3BlX1BpcHMpO1xuICAgICAgICAgICAgICAgIHNjb3BlX1BpcHMgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcGlwcyhncmlkKSB7XG4gICAgICAgICAgICAvLyBGaXggIzY2OVxuICAgICAgICAgICAgcmVtb3ZlUGlwcygpO1xuXG4gICAgICAgICAgICB2YXIgbW9kZSA9IGdyaWQubW9kZTtcbiAgICAgICAgICAgIHZhciBkZW5zaXR5ID0gZ3JpZC5kZW5zaXR5IHx8IDE7XG4gICAgICAgICAgICB2YXIgZmlsdGVyID0gZ3JpZC5maWx0ZXIgfHwgZmFsc2U7XG4gICAgICAgICAgICB2YXIgdmFsdWVzID0gZ3JpZC52YWx1ZXMgfHwgZmFsc2U7XG4gICAgICAgICAgICB2YXIgc3RlcHBlZCA9IGdyaWQuc3RlcHBlZCB8fCBmYWxzZTtcbiAgICAgICAgICAgIHZhciBncm91cCA9IGdldEdyb3VwKG1vZGUsIHZhbHVlcywgc3RlcHBlZCk7XG4gICAgICAgICAgICB2YXIgc3ByZWFkID0gZ2VuZXJhdGVTcHJlYWQoZGVuc2l0eSwgbW9kZSwgZ3JvdXApO1xuICAgICAgICAgICAgdmFyIGZvcm1hdCA9IGdyaWQuZm9ybWF0IHx8IHtcbiAgICAgICAgICAgICAgICB0bzogTWF0aC5yb3VuZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgc2NvcGVfUGlwcyA9IHNjb3BlX1RhcmdldC5hcHBlbmRDaGlsZChhZGRNYXJraW5nKHNwcmVhZCwgZmlsdGVyLCBmb3JtYXQpKTtcblxuICAgICAgICAgICAgcmV0dXJuIHNjb3BlX1BpcHM7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTaG9ydGhhbmQgZm9yIGJhc2UgZGltZW5zaW9ucy5cbiAgICAgICAgZnVuY3Rpb24gYmFzZVNpemUoKSB7XG4gICAgICAgICAgICB2YXIgcmVjdCA9IHNjb3BlX0Jhc2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICB2YXIgYWx0ID0gXCJvZmZzZXRcIiArIFtcIldpZHRoXCIsIFwiSGVpZ2h0XCJdW29wdGlvbnMub3J0XTtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLm9ydCA9PT0gMCA/IHJlY3Qud2lkdGggfHwgc2NvcGVfQmFzZVthbHRdIDogcmVjdC5oZWlnaHQgfHwgc2NvcGVfQmFzZVthbHRdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSGFuZGxlciBmb3IgYXR0YWNoaW5nIGV2ZW50cyB0cm91Z2ggYSBwcm94eS5cbiAgICAgICAgZnVuY3Rpb24gYXR0YWNoRXZlbnQoZXZlbnRzLCBlbGVtZW50LCBjYWxsYmFjaywgZGF0YSkge1xuICAgICAgICAgICAgLy8gVGhpcyBmdW5jdGlvbiBjYW4gYmUgdXNlZCB0byAnZmlsdGVyJyBldmVudHMgdG8gdGhlIHNsaWRlci5cbiAgICAgICAgICAgIC8vIGVsZW1lbnQgaXMgYSBub2RlLCBub3QgYSBub2RlTGlzdFxuXG4gICAgICAgICAgICB2YXIgbWV0aG9kID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUgPSBmaXhFdmVudChlLCBkYXRhLnBhZ2VPZmZzZXQsIGRhdGEudGFyZ2V0IHx8IGVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgLy8gZml4RXZlbnQgcmV0dXJucyBmYWxzZSBpZiB0aGlzIGV2ZW50IGhhcyBhIGRpZmZlcmVudCB0YXJnZXRcbiAgICAgICAgICAgICAgICAvLyB3aGVuIGhhbmRsaW5nIChtdWx0aS0pIHRvdWNoIGV2ZW50cztcbiAgICAgICAgICAgICAgICBpZiAoIWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGRvTm90UmVqZWN0IGlzIHBhc3NlZCBieSBhbGwgZW5kIGV2ZW50cyB0byBtYWtlIHN1cmUgcmVsZWFzZWQgdG91Y2hlc1xuICAgICAgICAgICAgICAgIC8vIGFyZSBub3QgcmVqZWN0ZWQsIGxlYXZpbmcgdGhlIHNsaWRlciBcInN0dWNrXCIgdG8gdGhlIGN1cnNvcjtcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGVfVGFyZ2V0Lmhhc0F0dHJpYnV0ZShcImRpc2FibGVkXCIpICYmICFkYXRhLmRvTm90UmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBTdG9wIGlmIGFuIGFjdGl2ZSAndGFwJyB0cmFuc2l0aW9uIGlzIHRha2luZyBwbGFjZS5cbiAgICAgICAgICAgICAgICBpZiAoaGFzQ2xhc3Moc2NvcGVfVGFyZ2V0LCBvcHRpb25zLmNzc0NsYXNzZXMudGFwKSAmJiAhZGF0YS5kb05vdFJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSWdub3JlIHJpZ2h0IG9yIG1pZGRsZSBjbGlja3Mgb24gc3RhcnQgIzQ1NFxuICAgICAgICAgICAgICAgIGlmIChldmVudHMgPT09IGFjdGlvbnMuc3RhcnQgJiYgZS5idXR0b25zICE9PSB1bmRlZmluZWQgJiYgZS5idXR0b25zID4gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSWdub3JlIHJpZ2h0IG9yIG1pZGRsZSBjbGlja3Mgb24gc3RhcnQgIzQ1NFxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmhvdmVyICYmIGUuYnV0dG9ucykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gJ3N1cHBvcnRzUGFzc2l2ZScgaXMgb25seSB0cnVlIGlmIGEgYnJvd3NlciBhbHNvIHN1cHBvcnRzIHRvdWNoLWFjdGlvbjogbm9uZSBpbiBDU1MuXG4gICAgICAgICAgICAgICAgLy8gaU9TIHNhZmFyaSBkb2VzIG5vdCwgc28gaXQgZG9lc24ndCBnZXQgdG8gYmVuZWZpdCBmcm9tIHBhc3NpdmUgc2Nyb2xsaW5nLiBpT1MgZG9lcyBzdXBwb3J0XG4gICAgICAgICAgICAgICAgLy8gdG91Y2gtYWN0aW9uOiBtYW5pcHVsYXRpb24sIGJ1dCB0aGF0IGFsbG93cyBwYW5uaW5nLCB3aGljaCBicmVha3NcbiAgICAgICAgICAgICAgICAvLyBzbGlkZXJzIGFmdGVyIHpvb21pbmcvb24gbm9uLXJlc3BvbnNpdmUgcGFnZXMuXG4gICAgICAgICAgICAgICAgLy8gU2VlOiBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTMzMTEyXG4gICAgICAgICAgICAgICAgaWYgKCFzdXBwb3J0c1Bhc3NpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGUuY2FsY1BvaW50ID0gZS5wb2ludHNbb3B0aW9ucy5vcnRdO1xuXG4gICAgICAgICAgICAgICAgLy8gQ2FsbCB0aGUgZXZlbnQgaGFuZGxlciB3aXRoIHRoZSBldmVudCBbIGFuZCBhZGRpdGlvbmFsIGRhdGEgXS5cbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlLCBkYXRhKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBtZXRob2RzID0gW107XG5cbiAgICAgICAgICAgIC8vIEJpbmQgYSBjbG9zdXJlIG9uIHRoZSB0YXJnZXQgZm9yIGV2ZXJ5IGV2ZW50IHR5cGUuXG4gICAgICAgICAgICBldmVudHMuc3BsaXQoXCIgXCIpLmZvckVhY2goZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgbWV0aG9kLCBzdXBwb3J0c1Bhc3NpdmUgPyB7IHBhc3NpdmU6IHRydWUgfSA6IGZhbHNlKTtcbiAgICAgICAgICAgICAgICBtZXRob2RzLnB1c2goW2V2ZW50TmFtZSwgbWV0aG9kXSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIG1ldGhvZHM7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQcm92aWRlIGEgY2xlYW4gZXZlbnQgd2l0aCBzdGFuZGFyZGl6ZWQgb2Zmc2V0IHZhbHVlcy5cbiAgICAgICAgZnVuY3Rpb24gZml4RXZlbnQoZSwgcGFnZU9mZnNldCwgZXZlbnRUYXJnZXQpIHtcbiAgICAgICAgICAgIC8vIEZpbHRlciB0aGUgZXZlbnQgdG8gcmVnaXN0ZXIgdGhlIHR5cGUsIHdoaWNoIGNhbiBiZVxuICAgICAgICAgICAgLy8gdG91Y2gsIG1vdXNlIG9yIHBvaW50ZXIuIE9mZnNldCBjaGFuZ2VzIG5lZWQgdG8gYmVcbiAgICAgICAgICAgIC8vIG1hZGUgb24gYW4gZXZlbnQgc3BlY2lmaWMgYmFzaXMuXG4gICAgICAgICAgICB2YXIgdG91Y2ggPSBlLnR5cGUuaW5kZXhPZihcInRvdWNoXCIpID09PSAwO1xuICAgICAgICAgICAgdmFyIG1vdXNlID0gZS50eXBlLmluZGV4T2YoXCJtb3VzZVwiKSA9PT0gMDtcbiAgICAgICAgICAgIHZhciBwb2ludGVyID0gZS50eXBlLmluZGV4T2YoXCJwb2ludGVyXCIpID09PSAwO1xuXG4gICAgICAgICAgICB2YXIgeDtcbiAgICAgICAgICAgIHZhciB5O1xuXG4gICAgICAgICAgICAvLyBJRTEwIGltcGxlbWVudGVkIHBvaW50ZXIgZXZlbnRzIHdpdGggYSBwcmVmaXg7XG4gICAgICAgICAgICBpZiAoZS50eXBlLmluZGV4T2YoXCJNU1BvaW50ZXJcIikgPT09IDApIHtcbiAgICAgICAgICAgICAgICBwb2ludGVyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVGhlIG9ubHkgdGhpbmcgb25lIGhhbmRsZSBzaG91bGQgYmUgY29uY2VybmVkIGFib3V0IGlzIHRoZSB0b3VjaGVzIHRoYXQgb3JpZ2luYXRlZCBvbiB0b3Agb2YgaXQuXG4gICAgICAgICAgICBpZiAodG91Y2gpIHtcbiAgICAgICAgICAgICAgICAvLyBSZXR1cm5zIHRydWUgaWYgYSB0b3VjaCBvcmlnaW5hdGVkIG9uIHRoZSB0YXJnZXQuXG4gICAgICAgICAgICAgICAgdmFyIGlzVG91Y2hPblRhcmdldCA9IGZ1bmN0aW9uKGNoZWNrVG91Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoZWNrVG91Y2gudGFyZ2V0ID09PSBldmVudFRhcmdldCB8fCBldmVudFRhcmdldC5jb250YWlucyhjaGVja1RvdWNoLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8vIEluIHRoZSBjYXNlIG9mIHRvdWNoc3RhcnQgZXZlbnRzLCB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0aGVyZSBpcyBzdGlsbCBubyBtb3JlIHRoYW4gb25lXG4gICAgICAgICAgICAgICAgLy8gdG91Y2ggb24gdGhlIHRhcmdldCBzbyB3ZSBsb29rIGFtb25nc3QgYWxsIHRvdWNoZXMuXG4gICAgICAgICAgICAgICAgaWYgKGUudHlwZSA9PT0gXCJ0b3VjaHN0YXJ0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhcmdldFRvdWNoZXMgPSBBcnJheS5wcm90b3R5cGUuZmlsdGVyLmNhbGwoZS50b3VjaGVzLCBpc1RvdWNoT25UYXJnZXQpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIERvIG5vdCBzdXBwb3J0IG1vcmUgdGhhbiBvbmUgdG91Y2ggcGVyIGhhbmRsZS5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldFRvdWNoZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgeCA9IHRhcmdldFRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICAgICAgICAgICAgICAgIHkgPSB0YXJnZXRUb3VjaGVzWzBdLnBhZ2VZO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEluIHRoZSBvdGhlciBjYXNlcywgZmluZCBvbiBjaGFuZ2VkVG91Y2hlcyBpcyBlbm91Z2guXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXRUb3VjaCA9IEFycmF5LnByb3RvdHlwZS5maW5kLmNhbGwoZS5jaGFuZ2VkVG91Y2hlcywgaXNUb3VjaE9uVGFyZ2V0KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBDYW5jZWwgaWYgdGhlIHRhcmdldCB0b3VjaCBoYXMgbm90IG1vdmVkLlxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRhcmdldFRvdWNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB4ID0gdGFyZ2V0VG91Y2gucGFnZVg7XG4gICAgICAgICAgICAgICAgICAgIHkgPSB0YXJnZXRUb3VjaC5wYWdlWTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBhZ2VPZmZzZXQgPSBwYWdlT2Zmc2V0IHx8IGdldFBhZ2VPZmZzZXQoc2NvcGVfRG9jdW1lbnQpO1xuXG4gICAgICAgICAgICBpZiAobW91c2UgfHwgcG9pbnRlcikge1xuICAgICAgICAgICAgICAgIHggPSBlLmNsaWVudFggKyBwYWdlT2Zmc2V0Lng7XG4gICAgICAgICAgICAgICAgeSA9IGUuY2xpZW50WSArIHBhZ2VPZmZzZXQueTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZS5wYWdlT2Zmc2V0ID0gcGFnZU9mZnNldDtcbiAgICAgICAgICAgIGUucG9pbnRzID0gW3gsIHldO1xuICAgICAgICAgICAgZS5jdXJzb3IgPSBtb3VzZSB8fCBwb2ludGVyOyAvLyBGaXggIzQzNVxuXG4gICAgICAgICAgICByZXR1cm4gZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRyYW5zbGF0ZSBhIGNvb3JkaW5hdGUgaW4gdGhlIGRvY3VtZW50IHRvIGEgcGVyY2VudGFnZSBvbiB0aGUgc2xpZGVyXG4gICAgICAgIGZ1bmN0aW9uIGNhbGNQb2ludFRvUGVyY2VudGFnZShjYWxjUG9pbnQpIHtcbiAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IGNhbGNQb2ludCAtIG9mZnNldChzY29wZV9CYXNlLCBvcHRpb25zLm9ydCk7XG4gICAgICAgICAgICB2YXIgcHJvcG9zYWwgPSAobG9jYXRpb24gKiAxMDApIC8gYmFzZVNpemUoKTtcblxuICAgICAgICAgICAgLy8gQ2xhbXAgcHJvcG9zYWwgYmV0d2VlbiAwJSBhbmQgMTAwJVxuICAgICAgICAgICAgLy8gT3V0LW9mLWJvdW5kIGNvb3JkaW5hdGVzIG1heSBvY2N1ciB3aGVuIC5ub1VpLWJhc2UgcHNldWRvLWVsZW1lbnRzXG4gICAgICAgICAgICAvLyBhcmUgdXNlZCAoZS5nLiBjb250YWluZWQgaGFuZGxlcyBmZWF0dXJlKVxuICAgICAgICAgICAgcHJvcG9zYWwgPSBsaW1pdChwcm9wb3NhbCk7XG5cbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmRpciA/IDEwMCAtIHByb3Bvc2FsIDogcHJvcG9zYWw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGaW5kIGhhbmRsZSBjbG9zZXN0IHRvIGEgY2VydGFpbiBwZXJjZW50YWdlIG9uIHRoZSBzbGlkZXJcbiAgICAgICAgZnVuY3Rpb24gZ2V0Q2xvc2VzdEhhbmRsZShwcm9wb3NhbCkge1xuICAgICAgICAgICAgdmFyIGNsb3Nlc3QgPSAxMDA7XG4gICAgICAgICAgICB2YXIgaGFuZGxlTnVtYmVyID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHNjb3BlX0hhbmRsZXMuZm9yRWFjaChmdW5jdGlvbihoYW5kbGUsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgLy8gRGlzYWJsZWQgaGFuZGxlcyBhcmUgaWdub3JlZFxuICAgICAgICAgICAgICAgIGlmIChpc0hhbmRsZURpc2FibGVkKGluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IE1hdGguYWJzKHNjb3BlX0xvY2F0aW9uc1tpbmRleF0gLSBwcm9wb3NhbCk7XG5cbiAgICAgICAgICAgICAgICBpZiAocG9zIDwgY2xvc2VzdCB8fCAocG9zID09PSAxMDAgJiYgY2xvc2VzdCA9PT0gMTAwKSkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVOdW1iZXIgPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VzdCA9IHBvcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZU51bWJlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpcmUgJ2VuZCcgd2hlbiBhIG1vdXNlIG9yIHBlbiBsZWF2ZXMgdGhlIGRvY3VtZW50LlxuICAgICAgICBmdW5jdGlvbiBkb2N1bWVudExlYXZlKGV2ZW50LCBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gXCJtb3VzZW91dFwiICYmIGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gXCJIVE1MXCIgJiYgZXZlbnQucmVsYXRlZFRhcmdldCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGV2ZW50RW5kKGV2ZW50LCBkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEhhbmRsZSBtb3ZlbWVudCBvbiBkb2N1bWVudCBmb3IgaGFuZGxlIGFuZCByYW5nZSBkcmFnLlxuICAgICAgICBmdW5jdGlvbiBldmVudE1vdmUoZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgICAgIC8vIEZpeCAjNDk4XG4gICAgICAgICAgICAvLyBDaGVjayB2YWx1ZSBvZiAuYnV0dG9ucyBpbiAnc3RhcnQnIHRvIHdvcmsgYXJvdW5kIGEgYnVnIGluIElFMTAgbW9iaWxlIChkYXRhLmJ1dHRvbnNQcm9wZXJ0eSkuXG4gICAgICAgICAgICAvLyBodHRwczovL2Nvbm5lY3QubWljcm9zb2Z0LmNvbS9JRS9mZWVkYmFjay9kZXRhaWxzLzkyNzAwNS9tb2JpbGUtaWUxMC13aW5kb3dzLXBob25lLWJ1dHRvbnMtcHJvcGVydHktb2YtcG9pbnRlcm1vdmUtZXZlbnQtYWx3YXlzLXplcm9cbiAgICAgICAgICAgIC8vIElFOSBoYXMgLmJ1dHRvbnMgYW5kIC53aGljaCB6ZXJvIG9uIG1vdXNlbW92ZS5cbiAgICAgICAgICAgIC8vIEZpcmVmb3ggYnJlYWtzIHRoZSBzcGVjIE1ETiBkZWZpbmVzLlxuICAgICAgICAgICAgaWYgKG5hdmlnYXRvci5hcHBWZXJzaW9uLmluZGV4T2YoXCJNU0lFIDlcIikgPT09IC0xICYmIGV2ZW50LmJ1dHRvbnMgPT09IDAgJiYgZGF0YS5idXR0b25zUHJvcGVydHkgIT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRFbmQoZXZlbnQsIGRhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB3ZSBhcmUgbW92aW5nIHVwIG9yIGRvd25cbiAgICAgICAgICAgIHZhciBtb3ZlbWVudCA9IChvcHRpb25zLmRpciA/IC0xIDogMSkgKiAoZXZlbnQuY2FsY1BvaW50IC0gZGF0YS5zdGFydENhbGNQb2ludCk7XG5cbiAgICAgICAgICAgIC8vIENvbnZlcnQgdGhlIG1vdmVtZW50IGludG8gYSBwZXJjZW50YWdlIG9mIHRoZSBzbGlkZXIgd2lkdGgvaGVpZ2h0XG4gICAgICAgICAgICB2YXIgcHJvcG9zYWwgPSAobW92ZW1lbnQgKiAxMDApIC8gZGF0YS5iYXNlU2l6ZTtcblxuICAgICAgICAgICAgbW92ZUhhbmRsZXMobW92ZW1lbnQgPiAwLCBwcm9wb3NhbCwgZGF0YS5sb2NhdGlvbnMsIGRhdGEuaGFuZGxlTnVtYmVycyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVbmJpbmQgbW92ZSBldmVudHMgb24gZG9jdW1lbnQsIGNhbGwgY2FsbGJhY2tzLlxuICAgICAgICBmdW5jdGlvbiBldmVudEVuZChldmVudCwgZGF0YSkge1xuICAgICAgICAgICAgLy8gVGhlIGhhbmRsZSBpcyBubyBsb25nZXIgYWN0aXZlLCBzbyByZW1vdmUgdGhlIGNsYXNzLlxuICAgICAgICAgICAgaWYgKGRhdGEuaGFuZGxlKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlQ2xhc3MoZGF0YS5oYW5kbGUsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5hY3RpdmUpO1xuICAgICAgICAgICAgICAgIHNjb3BlX0FjdGl2ZUhhbmRsZXNDb3VudCAtPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBVbmJpbmQgdGhlIG1vdmUgYW5kIGVuZCBldmVudHMsIHdoaWNoIGFyZSBhZGRlZCBvbiAnc3RhcnQnLlxuICAgICAgICAgICAgZGF0YS5saXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbihjKSB7XG4gICAgICAgICAgICAgICAgc2NvcGVfRG9jdW1lbnRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoY1swXSwgY1sxXSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHNjb3BlX0FjdGl2ZUhhbmRsZXNDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBkcmFnZ2luZyBjbGFzcy5cbiAgICAgICAgICAgICAgICByZW1vdmVDbGFzcyhzY29wZV9UYXJnZXQsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5kcmFnKTtcbiAgICAgICAgICAgICAgICBzZXRaaW5kZXgoKTtcblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBjdXJzb3Igc3R5bGVzIGFuZCB0ZXh0LXNlbGVjdGlvbiBldmVudHMgYm91bmQgdG8gdGhlIGJvZHkuXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmN1cnNvcikge1xuICAgICAgICAgICAgICAgICAgICBzY29wZV9Cb2R5LnN0eWxlLmN1cnNvciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlX0JvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNlbGVjdHN0YXJ0XCIsIHByZXZlbnREZWZhdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRhdGEuaGFuZGxlTnVtYmVycy5mb3JFYWNoKGZ1bmN0aW9uKGhhbmRsZU51bWJlcikge1xuICAgICAgICAgICAgICAgIGZpcmVFdmVudChcImNoYW5nZVwiLCBoYW5kbGVOdW1iZXIpO1xuICAgICAgICAgICAgICAgIGZpcmVFdmVudChcInNldFwiLCBoYW5kbGVOdW1iZXIpO1xuICAgICAgICAgICAgICAgIGZpcmVFdmVudChcImVuZFwiLCBoYW5kbGVOdW1iZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCaW5kIG1vdmUgZXZlbnRzIG9uIGRvY3VtZW50LlxuICAgICAgICBmdW5jdGlvbiBldmVudFN0YXJ0KGV2ZW50LCBkYXRhKSB7XG4gICAgICAgICAgICAvLyBJZ25vcmUgZXZlbnQgaWYgYW55IGhhbmRsZSBpcyBkaXNhYmxlZFxuICAgICAgICAgICAgaWYgKGRhdGEuaGFuZGxlTnVtYmVycy5zb21lKGlzSGFuZGxlRGlzYWJsZWQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaGFuZGxlO1xuXG4gICAgICAgICAgICBpZiAoZGF0YS5oYW5kbGVOdW1iZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHZhciBoYW5kbGVPcmlnaW4gPSBzY29wZV9IYW5kbGVzW2RhdGEuaGFuZGxlTnVtYmVyc1swXV07XG5cbiAgICAgICAgICAgICAgICBoYW5kbGUgPSBoYW5kbGVPcmlnaW4uY2hpbGRyZW5bMF07XG4gICAgICAgICAgICAgICAgc2NvcGVfQWN0aXZlSGFuZGxlc0NvdW50ICs9IDE7XG5cbiAgICAgICAgICAgICAgICAvLyBNYXJrIHRoZSBoYW5kbGUgYXMgJ2FjdGl2ZScgc28gaXQgY2FuIGJlIHN0eWxlZC5cbiAgICAgICAgICAgICAgICBhZGRDbGFzcyhoYW5kbGUsIG9wdGlvbnMuY3NzQ2xhc3Nlcy5hY3RpdmUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBIGRyYWcgc2hvdWxkIG5ldmVyIHByb3BhZ2F0ZSB1cCB0byB0aGUgJ3RhcCcgZXZlbnQuXG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICAgICAgLy8gUmVjb3JkIHRoZSBldmVudCBsaXN0ZW5lcnMuXG4gICAgICAgICAgICB2YXIgbGlzdGVuZXJzID0gW107XG5cbiAgICAgICAgICAgIC8vIEF0dGFjaCB0aGUgbW92ZSBhbmQgZW5kIGV2ZW50cy5cbiAgICAgICAgICAgIHZhciBtb3ZlRXZlbnQgPSBhdHRhY2hFdmVudChhY3Rpb25zLm1vdmUsIHNjb3BlX0RvY3VtZW50RWxlbWVudCwgZXZlbnRNb3ZlLCB7XG4gICAgICAgICAgICAgICAgLy8gVGhlIGV2ZW50IHRhcmdldCBoYXMgY2hhbmdlZCBzbyB3ZSBuZWVkIHRvIHByb3BhZ2F0ZSB0aGUgb3JpZ2luYWwgb25lIHNvIHRoYXQgd2Uga2VlcFxuICAgICAgICAgICAgICAgIC8vIHJlbHlpbmcgb24gaXQgdG8gZXh0cmFjdCB0YXJnZXQgdG91Y2hlcy5cbiAgICAgICAgICAgICAgICB0YXJnZXQ6IGV2ZW50LnRhcmdldCxcbiAgICAgICAgICAgICAgICBoYW5kbGU6IGhhbmRsZSxcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnM6IGxpc3RlbmVycyxcbiAgICAgICAgICAgICAgICBzdGFydENhbGNQb2ludDogZXZlbnQuY2FsY1BvaW50LFxuICAgICAgICAgICAgICAgIGJhc2VTaXplOiBiYXNlU2l6ZSgpLFxuICAgICAgICAgICAgICAgIHBhZ2VPZmZzZXQ6IGV2ZW50LnBhZ2VPZmZzZXQsXG4gICAgICAgICAgICAgICAgaGFuZGxlTnVtYmVyczogZGF0YS5oYW5kbGVOdW1iZXJzLFxuICAgICAgICAgICAgICAgIGJ1dHRvbnNQcm9wZXJ0eTogZXZlbnQuYnV0dG9ucyxcbiAgICAgICAgICAgICAgICBsb2NhdGlvbnM6IHNjb3BlX0xvY2F0aW9ucy5zbGljZSgpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGVuZEV2ZW50ID0gYXR0YWNoRXZlbnQoYWN0aW9ucy5lbmQsIHNjb3BlX0RvY3VtZW50RWxlbWVudCwgZXZlbnRFbmQsIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IGV2ZW50LnRhcmdldCxcbiAgICAgICAgICAgICAgICBoYW5kbGU6IGhhbmRsZSxcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnM6IGxpc3RlbmVycyxcbiAgICAgICAgICAgICAgICBkb05vdFJlamVjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoYW5kbGVOdW1iZXJzOiBkYXRhLmhhbmRsZU51bWJlcnNcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgb3V0RXZlbnQgPSBhdHRhY2hFdmVudChcIm1vdXNlb3V0XCIsIHNjb3BlX0RvY3VtZW50RWxlbWVudCwgZG9jdW1lbnRMZWF2ZSwge1xuICAgICAgICAgICAgICAgIHRhcmdldDogZXZlbnQudGFyZ2V0LFxuICAgICAgICAgICAgICAgIGhhbmRsZTogaGFuZGxlLFxuICAgICAgICAgICAgICAgIGxpc3RlbmVyczogbGlzdGVuZXJzLFxuICAgICAgICAgICAgICAgIGRvTm90UmVqZWN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIGhhbmRsZU51bWJlcnM6IGRhdGEuaGFuZGxlTnVtYmVyc1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFdlIHdhbnQgdG8gbWFrZSBzdXJlIHdlIHB1c2hlZCB0aGUgbGlzdGVuZXJzIGluIHRoZSBsaXN0ZW5lciBsaXN0IHJhdGhlciB0aGFuIGNyZWF0aW5nXG4gICAgICAgICAgICAvLyBhIG5ldyBvbmUgYXMgaXQgaGFzIGFscmVhZHkgYmVlbiBwYXNzZWQgdG8gdGhlIGV2ZW50IGhhbmRsZXJzLlxuICAgICAgICAgICAgbGlzdGVuZXJzLnB1c2guYXBwbHkobGlzdGVuZXJzLCBtb3ZlRXZlbnQuY29uY2F0KGVuZEV2ZW50LCBvdXRFdmVudCkpO1xuXG4gICAgICAgICAgICAvLyBUZXh0IHNlbGVjdGlvbiBpc24ndCBhbiBpc3N1ZSBvbiB0b3VjaCBkZXZpY2VzLFxuICAgICAgICAgICAgLy8gc28gYWRkaW5nIGN1cnNvciBzdHlsZXMgY2FuIGJlIHNraXBwZWQuXG4gICAgICAgICAgICBpZiAoZXZlbnQuY3Vyc29yKSB7XG4gICAgICAgICAgICAgICAgLy8gUHJldmVudCB0aGUgJ0knIGN1cnNvciBhbmQgZXh0ZW5kIHRoZSByYW5nZS1kcmFnIGN1cnNvci5cbiAgICAgICAgICAgICAgICBzY29wZV9Cb2R5LnN0eWxlLmN1cnNvciA9IGdldENvbXB1dGVkU3R5bGUoZXZlbnQudGFyZ2V0KS5jdXJzb3I7XG5cbiAgICAgICAgICAgICAgICAvLyBNYXJrIHRoZSB0YXJnZXQgd2l0aCBhIGRyYWdnaW5nIHN0YXRlLlxuICAgICAgICAgICAgICAgIGlmIChzY29wZV9IYW5kbGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkQ2xhc3Moc2NvcGVfVGFyZ2V0LCBvcHRpb25zLmNzc0NsYXNzZXMuZHJhZyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gUHJldmVudCB0ZXh0IHNlbGVjdGlvbiB3aGVuIGRyYWdnaW5nIHRoZSBoYW5kbGVzLlxuICAgICAgICAgICAgICAgIC8vIEluIG5vVWlTbGlkZXIgPD0gOS4yLjAsIHRoaXMgd2FzIGhhbmRsZWQgYnkgY2FsbGluZyBwcmV2ZW50RGVmYXVsdCBvbiBtb3VzZS90b3VjaCBzdGFydC9tb3ZlLFxuICAgICAgICAgICAgICAgIC8vIHdoaWNoIGlzIHNjcm9sbCBibG9ja2luZy4gVGhlIHNlbGVjdHN0YXJ0IGV2ZW50IGlzIHN1cHBvcnRlZCBieSBGaXJlRm94IHN0YXJ0aW5nIGZyb20gdmVyc2lvbiA1MixcbiAgICAgICAgICAgICAgICAvLyBtZWFuaW5nIHRoZSBvbmx5IGhvbGRvdXQgaXMgaU9TIFNhZmFyaS4gVGhpcyBkb2Vzbid0IG1hdHRlcjogdGV4dCBzZWxlY3Rpb24gaXNuJ3QgdHJpZ2dlcmVkIHRoZXJlLlxuICAgICAgICAgICAgICAgIC8vIFRoZSAnY3Vyc29yJyBmbGFnIGlzIGZhbHNlLlxuICAgICAgICAgICAgICAgIC8vIFNlZTogaHR0cDovL2Nhbml1c2UuY29tLyNzZWFyY2g9c2VsZWN0c3RhcnRcbiAgICAgICAgICAgICAgICBzY29wZV9Cb2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJzZWxlY3RzdGFydFwiLCBwcmV2ZW50RGVmYXVsdCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRhLmhhbmRsZU51bWJlcnMuZm9yRWFjaChmdW5jdGlvbihoYW5kbGVOdW1iZXIpIHtcbiAgICAgICAgICAgICAgICBmaXJlRXZlbnQoXCJzdGFydFwiLCBoYW5kbGVOdW1iZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNb3ZlIGNsb3Nlc3QgaGFuZGxlIHRvIHRhcHBlZCBsb2NhdGlvbi5cbiAgICAgICAgZnVuY3Rpb24gZXZlbnRUYXAoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIFRoZSB0YXAgZXZlbnQgc2hvdWxkbid0IHByb3BhZ2F0ZSB1cFxuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICAgIHZhciBwcm9wb3NhbCA9IGNhbGNQb2ludFRvUGVyY2VudGFnZShldmVudC5jYWxjUG9pbnQpO1xuICAgICAgICAgICAgdmFyIGhhbmRsZU51bWJlciA9IGdldENsb3Nlc3RIYW5kbGUocHJvcG9zYWwpO1xuXG4gICAgICAgICAgICAvLyBUYWNrbGUgdGhlIGNhc2UgdGhhdCBhbGwgaGFuZGxlcyBhcmUgJ2Rpc2FibGVkJy5cbiAgICAgICAgICAgIGlmIChoYW5kbGVOdW1iZXIgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBGbGFnIHRoZSBzbGlkZXIgYXMgaXQgaXMgbm93IGluIGEgdHJhbnNpdGlvbmFsIHN0YXRlLlxuICAgICAgICAgICAgLy8gVHJhbnNpdGlvbiB0YWtlcyBhIGNvbmZpZ3VyYWJsZSBhbW91bnQgb2YgbXMgKGRlZmF1bHQgMzAwKS4gUmUtZW5hYmxlIHRoZSBzbGlkZXIgYWZ0ZXIgdGhhdC5cbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5ldmVudHMuc25hcCkge1xuICAgICAgICAgICAgICAgIGFkZENsYXNzRm9yKHNjb3BlX1RhcmdldCwgb3B0aW9ucy5jc3NDbGFzc2VzLnRhcCwgb3B0aW9ucy5hbmltYXRpb25EdXJhdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldEhhbmRsZShoYW5kbGVOdW1iZXIsIHByb3Bvc2FsLCB0cnVlLCB0cnVlKTtcblxuICAgICAgICAgICAgc2V0WmluZGV4KCk7XG5cbiAgICAgICAgICAgIGZpcmVFdmVudChcInNsaWRlXCIsIGhhbmRsZU51bWJlciwgdHJ1ZSk7XG4gICAgICAgICAgICBmaXJlRXZlbnQoXCJ1cGRhdGVcIiwgaGFuZGxlTnVtYmVyLCB0cnVlKTtcbiAgICAgICAgICAgIGZpcmVFdmVudChcImNoYW5nZVwiLCBoYW5kbGVOdW1iZXIsIHRydWUpO1xuICAgICAgICAgICAgZmlyZUV2ZW50KFwic2V0XCIsIGhhbmRsZU51bWJlciwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmV2ZW50cy5zbmFwKSB7XG4gICAgICAgICAgICAgICAgZXZlbnRTdGFydChldmVudCwgeyBoYW5kbGVOdW1iZXJzOiBbaGFuZGxlTnVtYmVyXSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpcmVzIGEgJ2hvdmVyJyBldmVudCBmb3IgYSBob3ZlcmVkIG1vdXNlL3BlbiBwb3NpdGlvbi5cbiAgICAgICAgZnVuY3Rpb24gZXZlbnRIb3ZlcihldmVudCkge1xuICAgICAgICAgICAgdmFyIHByb3Bvc2FsID0gY2FsY1BvaW50VG9QZXJjZW50YWdlKGV2ZW50LmNhbGNQb2ludCk7XG5cbiAgICAgICAgICAgIHZhciB0byA9IHNjb3BlX1NwZWN0cnVtLmdldFN0ZXAocHJvcG9zYWwpO1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gc2NvcGVfU3BlY3RydW0uZnJvbVN0ZXBwaW5nKHRvKTtcblxuICAgICAgICAgICAgT2JqZWN0LmtleXMoc2NvcGVfRXZlbnRzKS5mb3JFYWNoKGZ1bmN0aW9uKHRhcmdldEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKFwiaG92ZXJcIiA9PT0gdGFyZ2V0RXZlbnQuc3BsaXQoXCIuXCIpWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlX0V2ZW50c1t0YXJnZXRFdmVudF0uZm9yRWFjaChmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChzY29wZV9TZWxmLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSGFuZGxlcyBrZXlkb3duIG9uIGZvY3VzZWQgaGFuZGxlc1xuICAgICAgICAvLyBEb24ndCBtb3ZlIHRoZSBkb2N1bWVudCB3aGVuIHByZXNzaW5nIGFycm93IGtleXMgb24gZm9jdXNlZCBoYW5kbGVzXG4gICAgICAgIGZ1bmN0aW9uIGV2ZW50S2V5ZG93bihldmVudCwgaGFuZGxlTnVtYmVyKSB7XG4gICAgICAgICAgICBpZiAoaXNIYW5kbGVEaXNhYmxlZChoYW5kbGVOdW1iZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaG9yaXpvbnRhbEtleXMgPSBbXCJMZWZ0XCIsIFwiUmlnaHRcIl07XG4gICAgICAgICAgICB2YXIgdmVydGljYWxLZXlzID0gW1wiRG93blwiLCBcIlVwXCJdO1xuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5kaXIgJiYgIW9wdGlvbnMub3J0KSB7XG4gICAgICAgICAgICAgICAgLy8gT24gYW4gcmlnaHQtdG8tbGVmdCBzbGlkZXIsIHRoZSBsZWZ0IGFuZCByaWdodCBrZXlzIGFjdCBpbnZlcnRlZFxuICAgICAgICAgICAgICAgIGhvcml6b250YWxLZXlzLnJldmVyc2UoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5vcnQgJiYgIW9wdGlvbnMuZGlyKSB7XG4gICAgICAgICAgICAgICAgLy8gT24gYSB0b3AtdG8tYm90dG9tIHNsaWRlciwgdGhlIHVwIGFuZCBkb3duIGtleXMgYWN0IGludmVydGVkXG4gICAgICAgICAgICAgICAgdmVydGljYWxLZXlzLnJldmVyc2UoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU3RyaXAgXCJBcnJvd1wiIGZvciBJRSBjb21wYXRpYmlsaXR5LiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvS2V5Ym9hcmRFdmVudC9rZXlcbiAgICAgICAgICAgIHZhciBrZXkgPSBldmVudC5rZXkucmVwbGFjZShcIkFycm93XCIsIFwiXCIpO1xuICAgICAgICAgICAgdmFyIGlzRG93biA9IGtleSA9PT0gdmVydGljYWxLZXlzWzBdIHx8IGtleSA9PT0gaG9yaXpvbnRhbEtleXNbMF07XG4gICAgICAgICAgICB2YXIgaXNVcCA9IGtleSA9PT0gdmVydGljYWxLZXlzWzFdIHx8IGtleSA9PT0gaG9yaXpvbnRhbEtleXNbMV07XG5cbiAgICAgICAgICAgIGlmICghaXNEb3duICYmICFpc1VwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSBpc0Rvd24gPyAwIDogMTtcbiAgICAgICAgICAgIHZhciBzdGVwcyA9IGdldE5leHRTdGVwc0ZvckhhbmRsZShoYW5kbGVOdW1iZXIpO1xuICAgICAgICAgICAgdmFyIHN0ZXAgPSBzdGVwc1tkaXJlY3Rpb25dO1xuXG4gICAgICAgICAgICAvLyBBdCB0aGUgZWRnZSBvZiBhIHNsaWRlciwgZG8gbm90aGluZ1xuICAgICAgICAgICAgaWYgKHN0ZXAgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE5vIHN0ZXAgc2V0LCB1c2UgdGhlIGRlZmF1bHQgb2YgMTAlIG9mIHRoZSBzdWItcmFuZ2VcbiAgICAgICAgICAgIGlmIChzdGVwID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHN0ZXAgPSBzY29wZV9TcGVjdHJ1bS5nZXREZWZhdWx0U3RlcChzY29wZV9Mb2NhdGlvbnNbaGFuZGxlTnVtYmVyXSwgaXNEb3duLCAxMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFN0ZXAgb3ZlciB6ZXJvLWxlbmd0aCByYW5nZXMgKCM5NDgpO1xuICAgICAgICAgICAgc3RlcCA9IE1hdGgubWF4KHN0ZXAsIDAuMDAwMDAwMSk7XG5cbiAgICAgICAgICAgIC8vIERlY3JlbWVudCBmb3IgZG93biBzdGVwc1xuICAgICAgICAgICAgc3RlcCA9IChpc0Rvd24gPyAtMSA6IDEpICogc3RlcDtcblxuICAgICAgICAgICAgc2NvcGVfU2hvdWxkQW5pbWF0ZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICB2YWx1ZVNldEhhbmRsZShoYW5kbGVOdW1iZXIsIHNjb3BlX1ZhbHVlc1toYW5kbGVOdW1iZXJdICsgc3RlcCwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIHNjb3BlX1Nob3VsZEFuaW1hdGUgPSB0cnVlO1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBdHRhY2ggZXZlbnRzIHRvIHNldmVyYWwgc2xpZGVyIHBhcnRzLlxuICAgICAgICBmdW5jdGlvbiBiaW5kU2xpZGVyRXZlbnRzKGJlaGF2aW91cikge1xuICAgICAgICAgICAgLy8gQXR0YWNoIHRoZSBzdGFuZGFyZCBkcmFnIGV2ZW50IHRvIHRoZSBoYW5kbGVzLlxuICAgICAgICAgICAgaWYgKCFiZWhhdmlvdXIuZml4ZWQpIHtcbiAgICAgICAgICAgICAgICBzY29wZV9IYW5kbGVzLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGVzZSBldmVudHMgYXJlIG9ubHkgYm91bmQgdG8gdGhlIHZpc3VhbCBoYW5kbGVcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxlbWVudCwgbm90IHRoZSAncmVhbCcgb3JpZ2luIGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaEV2ZW50KGFjdGlvbnMuc3RhcnQsIGhhbmRsZS5jaGlsZHJlblswXSwgZXZlbnRTdGFydCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlTnVtYmVyczogW2luZGV4XVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQXR0YWNoIHRoZSB0YXAgZXZlbnQgdG8gdGhlIHNsaWRlciBiYXNlLlxuICAgICAgICAgICAgaWYgKGJlaGF2aW91ci50YXApIHtcbiAgICAgICAgICAgICAgICBhdHRhY2hFdmVudChhY3Rpb25zLnN0YXJ0LCBzY29wZV9CYXNlLCBldmVudFRhcCwge30pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBGaXJlIGhvdmVyIGV2ZW50c1xuICAgICAgICAgICAgaWYgKGJlaGF2aW91ci5ob3Zlcikge1xuICAgICAgICAgICAgICAgIGF0dGFjaEV2ZW50KGFjdGlvbnMubW92ZSwgc2NvcGVfQmFzZSwgZXZlbnRIb3Zlciwge1xuICAgICAgICAgICAgICAgICAgICBob3ZlcjogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBNYWtlIHRoZSByYW5nZSBkcmFnZ2FibGUuXG4gICAgICAgICAgICBpZiAoYmVoYXZpb3VyLmRyYWcpIHtcbiAgICAgICAgICAgICAgICBzY29wZV9Db25uZWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGNvbm5lY3QsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb25uZWN0ID09PSBmYWxzZSB8fCBpbmRleCA9PT0gMCB8fCBpbmRleCA9PT0gc2NvcGVfQ29ubmVjdHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbmRsZUJlZm9yZSA9IHNjb3BlX0hhbmRsZXNbaW5kZXggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbmRsZUFmdGVyID0gc2NvcGVfSGFuZGxlc1tpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIHZhciBldmVudEhvbGRlcnMgPSBbY29ubmVjdF07XG5cbiAgICAgICAgICAgICAgICAgICAgYWRkQ2xhc3MoY29ubmVjdCwgb3B0aW9ucy5jc3NDbGFzc2VzLmRyYWdnYWJsZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiB0aGUgcmFuZ2UgaXMgZml4ZWQsIHRoZSBlbnRpcmUgcmFuZ2UgY2FuXG4gICAgICAgICAgICAgICAgICAgIC8vIGJlIGRyYWdnZWQgYnkgdGhlIGhhbmRsZXMuIFRoZSBoYW5kbGUgaW4gdGhlIGZpcnN0XG4gICAgICAgICAgICAgICAgICAgIC8vIG9yaWdpbiB3aWxsIHByb3BhZ2F0ZSB0aGUgc3RhcnQgZXZlbnQgdXB3YXJkLFxuICAgICAgICAgICAgICAgICAgICAvLyBidXQgaXQgbmVlZHMgdG8gYmUgYm91bmQgbWFudWFsbHkgb24gdGhlIG90aGVyLlxuICAgICAgICAgICAgICAgICAgICBpZiAoYmVoYXZpb3VyLmZpeGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudEhvbGRlcnMucHVzaChoYW5kbGVCZWZvcmUuY2hpbGRyZW5bMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRIb2xkZXJzLnB1c2goaGFuZGxlQWZ0ZXIuY2hpbGRyZW5bMF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZXZlbnRIb2xkZXJzLmZvckVhY2goZnVuY3Rpb24oZXZlbnRIb2xkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjaEV2ZW50KGFjdGlvbnMuc3RhcnQsIGV2ZW50SG9sZGVyLCBldmVudFN0YXJ0LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlczogW2hhbmRsZUJlZm9yZSwgaGFuZGxlQWZ0ZXJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZU51bWJlcnM6IFtpbmRleCAtIDEsIGluZGV4XVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXR0YWNoIGFuIGV2ZW50IHRvIHRoaXMgc2xpZGVyLCBwb3NzaWJseSBpbmNsdWRpbmcgYSBuYW1lc3BhY2VcbiAgICAgICAgZnVuY3Rpb24gYmluZEV2ZW50KG5hbWVzcGFjZWRFdmVudCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHNjb3BlX0V2ZW50c1tuYW1lc3BhY2VkRXZlbnRdID0gc2NvcGVfRXZlbnRzW25hbWVzcGFjZWRFdmVudF0gfHwgW107XG4gICAgICAgICAgICBzY29wZV9FdmVudHNbbmFtZXNwYWNlZEV2ZW50XS5wdXNoKGNhbGxiYWNrKTtcblxuICAgICAgICAgICAgLy8gSWYgdGhlIGV2ZW50IGJvdW5kIGlzICd1cGRhdGUsJyBmaXJlIGl0IGltbWVkaWF0ZWx5IGZvciBhbGwgaGFuZGxlcy5cbiAgICAgICAgICAgIGlmIChuYW1lc3BhY2VkRXZlbnQuc3BsaXQoXCIuXCIpWzBdID09PSBcInVwZGF0ZVwiKSB7XG4gICAgICAgICAgICAgICAgc2NvcGVfSGFuZGxlcy5mb3JFYWNoKGZ1bmN0aW9uKGEsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGZpcmVFdmVudChcInVwZGF0ZVwiLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVbmRvIGF0dGFjaG1lbnQgb2YgZXZlbnRcbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlRXZlbnQobmFtZXNwYWNlZEV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgZXZlbnQgPSBuYW1lc3BhY2VkRXZlbnQgJiYgbmFtZXNwYWNlZEV2ZW50LnNwbGl0KFwiLlwiKVswXTtcbiAgICAgICAgICAgIHZhciBuYW1lc3BhY2UgPSBldmVudCAmJiBuYW1lc3BhY2VkRXZlbnQuc3Vic3RyaW5nKGV2ZW50Lmxlbmd0aCk7XG5cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHNjb3BlX0V2ZW50cykuZm9yRWFjaChmdW5jdGlvbihiaW5kKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRFdmVudCA9IGJpbmQuc3BsaXQoXCIuXCIpWzBdO1xuICAgICAgICAgICAgICAgIHZhciB0TmFtZXNwYWNlID0gYmluZC5zdWJzdHJpbmcodEV2ZW50Lmxlbmd0aCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoKCFldmVudCB8fCBldmVudCA9PT0gdEV2ZW50KSAmJiAoIW5hbWVzcGFjZSB8fCBuYW1lc3BhY2UgPT09IHROYW1lc3BhY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzY29wZV9FdmVudHNbYmluZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBFeHRlcm5hbCBldmVudCBoYW5kbGluZ1xuICAgICAgICBmdW5jdGlvbiBmaXJlRXZlbnQoZXZlbnROYW1lLCBoYW5kbGVOdW1iZXIsIHRhcCkge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoc2NvcGVfRXZlbnRzKS5mb3JFYWNoKGZ1bmN0aW9uKHRhcmdldEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50VHlwZSA9IHRhcmdldEV2ZW50LnNwbGl0KFwiLlwiKVswXTtcblxuICAgICAgICAgICAgICAgIGlmIChldmVudE5hbWUgPT09IGV2ZW50VHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZV9FdmVudHNbdGFyZ2V0RXZlbnRdLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVXNlIHRoZSBzbGlkZXIgcHVibGljIEFQSSBhcyB0aGUgc2NvcGUgKCd0aGlzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZV9TZWxmLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJldHVybiB2YWx1ZXMgYXMgYXJyYXksIHNvIGFyZ18xW2FyZ18yXSBpcyBhbHdheXMgdmFsaWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGVfVmFsdWVzLm1hcChvcHRpb25zLmZvcm1hdC50byksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSGFuZGxlIGluZGV4LCAwIG9yIDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVOdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVW4tZm9ybWF0dGVkIHNsaWRlciB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZV9WYWx1ZXMuc2xpY2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFdmVudCBpcyBmaXJlZCBieSB0YXAsIHRydWUgb3IgZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXAgfHwgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGVmdCBvZmZzZXQgb2YgdGhlIGhhbmRsZSwgaW4gcmVsYXRpb24gdG8gdGhlIHNsaWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlX0xvY2F0aW9ucy5zbGljZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNwbGl0IG91dCB0aGUgaGFuZGxlIHBvc2l0aW9uaW5nIGxvZ2ljIHNvIHRoZSBNb3ZlIGV2ZW50IGNhbiB1c2UgaXQsIHRvb1xuICAgICAgICBmdW5jdGlvbiBjaGVja0hhbmRsZVBvc2l0aW9uKHJlZmVyZW5jZSwgaGFuZGxlTnVtYmVyLCB0bywgbG9va0JhY2t3YXJkLCBsb29rRm9yd2FyZCwgZ2V0VmFsdWUpIHtcbiAgICAgICAgICAgIC8vIEZvciBzbGlkZXJzIHdpdGggbXVsdGlwbGUgaGFuZGxlcywgbGltaXQgbW92ZW1lbnQgdG8gdGhlIG90aGVyIGhhbmRsZS5cbiAgICAgICAgICAgIC8vIEFwcGx5IHRoZSBtYXJnaW4gb3B0aW9uIGJ5IGFkZGluZyBpdCB0byB0aGUgaGFuZGxlIHBvc2l0aW9ucy5cbiAgICAgICAgICAgIGlmIChzY29wZV9IYW5kbGVzLmxlbmd0aCA+IDEgJiYgIW9wdGlvbnMuZXZlbnRzLnVuY29uc3RyYWluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAobG9va0JhY2t3YXJkICYmIGhhbmRsZU51bWJlciA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdG8gPSBNYXRoLm1heCh0bywgcmVmZXJlbmNlW2hhbmRsZU51bWJlciAtIDFdICsgb3B0aW9ucy5tYXJnaW4pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChsb29rRm9yd2FyZCAmJiBoYW5kbGVOdW1iZXIgPCBzY29wZV9IYW5kbGVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdG8gPSBNYXRoLm1pbih0bywgcmVmZXJlbmNlW2hhbmRsZU51bWJlciArIDFdIC0gb3B0aW9ucy5tYXJnaW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVGhlIGxpbWl0IG9wdGlvbiBoYXMgdGhlIG9wcG9zaXRlIGVmZmVjdCwgbGltaXRpbmcgaGFuZGxlcyB0byBhXG4gICAgICAgICAgICAvLyBtYXhpbXVtIGRpc3RhbmNlIGZyb20gYW5vdGhlci4gTGltaXQgbXVzdCBiZSA+IDAsIGFzIG90aGVyd2lzZVxuICAgICAgICAgICAgLy8gaGFuZGxlcyB3b3VsZCBiZSB1bm1vdmFibGUuXG4gICAgICAgICAgICBpZiAoc2NvcGVfSGFuZGxlcy5sZW5ndGggPiAxICYmIG9wdGlvbnMubGltaXQpIHtcbiAgICAgICAgICAgICAgICBpZiAobG9va0JhY2t3YXJkICYmIGhhbmRsZU51bWJlciA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdG8gPSBNYXRoLm1pbih0bywgcmVmZXJlbmNlW2hhbmRsZU51bWJlciAtIDFdICsgb3B0aW9ucy5saW1pdCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGxvb2tGb3J3YXJkICYmIGhhbmRsZU51bWJlciA8IHNjb3BlX0hhbmRsZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0byA9IE1hdGgubWF4KHRvLCByZWZlcmVuY2VbaGFuZGxlTnVtYmVyICsgMV0gLSBvcHRpb25zLmxpbWl0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRoZSBwYWRkaW5nIG9wdGlvbiBrZWVwcyB0aGUgaGFuZGxlcyBhIGNlcnRhaW4gZGlzdGFuY2UgZnJvbSB0aGVcbiAgICAgICAgICAgIC8vIGVkZ2VzIG9mIHRoZSBzbGlkZXIuIFBhZGRpbmcgbXVzdCBiZSA+IDAuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5wYWRkaW5nKSB7XG4gICAgICAgICAgICAgICAgaWYgKGhhbmRsZU51bWJlciA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0byA9IE1hdGgubWF4KHRvLCBvcHRpb25zLnBhZGRpbmdbMF0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChoYW5kbGVOdW1iZXIgPT09IHNjb3BlX0hhbmRsZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0byA9IE1hdGgubWluKHRvLCAxMDAgLSBvcHRpb25zLnBhZGRpbmdbMV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdG8gPSBzY29wZV9TcGVjdHJ1bS5nZXRTdGVwKHRvKTtcblxuICAgICAgICAgICAgLy8gTGltaXQgcGVyY2VudGFnZSB0byB0aGUgMCAtIDEwMCByYW5nZVxuICAgICAgICAgICAgdG8gPSBsaW1pdCh0byk7XG5cbiAgICAgICAgICAgIC8vIFJldHVybiBmYWxzZSBpZiBoYW5kbGUgY2FuJ3QgbW92ZVxuICAgICAgICAgICAgaWYgKHRvID09PSByZWZlcmVuY2VbaGFuZGxlTnVtYmVyXSAmJiAhZ2V0VmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0bztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVzZXMgc2xpZGVyIG9yaWVudGF0aW9uIHRvIGNyZWF0ZSBDU1MgcnVsZXMuIGEgPSBiYXNlIHZhbHVlO1xuICAgICAgICBmdW5jdGlvbiBpblJ1bGVPcmRlcih2LCBhKSB7XG4gICAgICAgICAgICB2YXIgbyA9IG9wdGlvbnMub3J0O1xuICAgICAgICAgICAgcmV0dXJuIChvID8gYSA6IHYpICsgXCIsIFwiICsgKG8gPyB2IDogYSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNb3ZlcyBoYW5kbGUocykgYnkgYSBwZXJjZW50YWdlXG4gICAgICAgIC8vIChib29sLCAlIHRvIG1vdmUsIFslIHdoZXJlIGhhbmRsZSBzdGFydGVkLCAuLi5dLCBbaW5kZXggaW4gc2NvcGVfSGFuZGxlcywgLi4uXSlcbiAgICAgICAgZnVuY3Rpb24gbW92ZUhhbmRsZXModXB3YXJkLCBwcm9wb3NhbCwgbG9jYXRpb25zLCBoYW5kbGVOdW1iZXJzKSB7XG4gICAgICAgICAgICB2YXIgcHJvcG9zYWxzID0gbG9jYXRpb25zLnNsaWNlKCk7XG5cbiAgICAgICAgICAgIHZhciBiID0gWyF1cHdhcmQsIHVwd2FyZF07XG4gICAgICAgICAgICB2YXIgZiA9IFt1cHdhcmQsICF1cHdhcmRdO1xuXG4gICAgICAgICAgICAvLyBDb3B5IGhhbmRsZU51bWJlcnMgc28gd2UgZG9uJ3QgY2hhbmdlIHRoZSBkYXRhc2V0XG4gICAgICAgICAgICBoYW5kbGVOdW1iZXJzID0gaGFuZGxlTnVtYmVycy5zbGljZSgpO1xuXG4gICAgICAgICAgICAvLyBDaGVjayB0byBzZWUgd2hpY2ggaGFuZGxlIGlzICdsZWFkaW5nJy5cbiAgICAgICAgICAgIC8vIElmIHRoYXQgb25lIGNhbid0IG1vdmUgdGhlIHNlY29uZCBjYW4ndCBlaXRoZXIuXG4gICAgICAgICAgICBpZiAodXB3YXJkKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlTnVtYmVycy5yZXZlcnNlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFN0ZXAgMTogZ2V0IHRoZSBtYXhpbXVtIHBlcmNlbnRhZ2UgdGhhdCBhbnkgb2YgdGhlIGhhbmRsZXMgY2FuIG1vdmVcbiAgICAgICAgICAgIGlmIChoYW5kbGVOdW1iZXJzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVOdW1iZXJzLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlTnVtYmVyLCBvKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0byA9IGNoZWNrSGFuZGxlUG9zaXRpb24oXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wb3NhbHMsXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVOdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wb3NhbHNbaGFuZGxlTnVtYmVyXSArIHByb3Bvc2FsLFxuICAgICAgICAgICAgICAgICAgICAgICAgYltvXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZbb10sXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFN0b3AgaWYgb25lIG9mIHRoZSBoYW5kbGVzIGNhbid0IG1vdmUuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0byA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3Bvc2FsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3Bvc2FsID0gdG8gLSBwcm9wb3NhbHNbaGFuZGxlTnVtYmVyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3Bvc2Fsc1toYW5kbGVOdW1iZXJdID0gdG87XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgdXNpbmcgb25lIGhhbmRsZSwgY2hlY2sgYmFja3dhcmQgQU5EIGZvcndhcmRcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGIgPSBmID0gW3RydWVdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBmYWxzZTtcblxuICAgICAgICAgICAgLy8gU3RlcCAyOiBUcnkgdG8gc2V0IHRoZSBoYW5kbGVzIHdpdGggdGhlIGZvdW5kIHBlcmNlbnRhZ2VcbiAgICAgICAgICAgIGhhbmRsZU51bWJlcnMuZm9yRWFjaChmdW5jdGlvbihoYW5kbGVOdW1iZXIsIG8pIHtcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IHNldEhhbmRsZShoYW5kbGVOdW1iZXIsIGxvY2F0aW9uc1toYW5kbGVOdW1iZXJdICsgcHJvcG9zYWwsIGJbb10sIGZbb10pIHx8IHN0YXRlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFN0ZXAgMzogSWYgYSBoYW5kbGUgbW92ZWQsIGZpcmUgZXZlbnRzXG4gICAgICAgICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVOdW1iZXJzLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlTnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpcmVFdmVudChcInVwZGF0ZVwiLCBoYW5kbGVOdW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICBmaXJlRXZlbnQoXCJzbGlkZVwiLCBoYW5kbGVOdW1iZXIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGFrZXMgYSBiYXNlIHZhbHVlIGFuZCBhbiBvZmZzZXQuIFRoaXMgb2Zmc2V0IGlzIHVzZWQgZm9yIHRoZSBjb25uZWN0IGJhciBzaXplLlxuICAgICAgICAvLyBJbiB0aGUgaW5pdGlhbCBkZXNpZ24gZm9yIHRoaXMgZmVhdHVyZSwgdGhlIG9yaWdpbiBlbGVtZW50IHdhcyAxJSB3aWRlLlxuICAgICAgICAvLyBVbmZvcnR1bmF0ZWx5LCBhIHJvdW5kaW5nIGJ1ZyBpbiBDaHJvbWUgbWFrZXMgaXQgaW1wb3NzaWJsZSB0byBpbXBsZW1lbnQgdGhpcyBmZWF0dXJlXG4gICAgICAgIC8vIGluIHRoaXMgbWFubmVyOiBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD03OTgyMjNcbiAgICAgICAgZnVuY3Rpb24gdHJhbnNmb3JtRGlyZWN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmRpciA/IDEwMCAtIGEgLSBiIDogYTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVwZGF0ZXMgc2NvcGVfTG9jYXRpb25zIGFuZCBzY29wZV9WYWx1ZXMsIHVwZGF0ZXMgdmlzdWFsIHN0YXRlXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZUhhbmRsZVBvc2l0aW9uKGhhbmRsZU51bWJlciwgdG8pIHtcbiAgICAgICAgICAgIC8vIFVwZGF0ZSBsb2NhdGlvbnMuXG4gICAgICAgICAgICBzY29wZV9Mb2NhdGlvbnNbaGFuZGxlTnVtYmVyXSA9IHRvO1xuXG4gICAgICAgICAgICAvLyBDb252ZXJ0IHRoZSB2YWx1ZSB0byB0aGUgc2xpZGVyIHN0ZXBwaW5nL3JhbmdlLlxuICAgICAgICAgICAgc2NvcGVfVmFsdWVzW2hhbmRsZU51bWJlcl0gPSBzY29wZV9TcGVjdHJ1bS5mcm9tU3RlcHBpbmcodG8pO1xuXG4gICAgICAgICAgICB2YXIgcnVsZSA9IFwidHJhbnNsYXRlKFwiICsgaW5SdWxlT3JkZXIodHJhbnNmb3JtRGlyZWN0aW9uKHRvLCAwKSAtIHNjb3BlX0Rpck9mZnNldCArIFwiJVwiLCBcIjBcIikgKyBcIilcIjtcbiAgICAgICAgICAgIHNjb3BlX0hhbmRsZXNbaGFuZGxlTnVtYmVyXS5zdHlsZVtvcHRpb25zLnRyYW5zZm9ybVJ1bGVdID0gcnVsZTtcblxuICAgICAgICAgICAgdXBkYXRlQ29ubmVjdChoYW5kbGVOdW1iZXIpO1xuICAgICAgICAgICAgdXBkYXRlQ29ubmVjdChoYW5kbGVOdW1iZXIgKyAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEhhbmRsZXMgYmVmb3JlIHRoZSBzbGlkZXIgbWlkZGxlIGFyZSBzdGFja2VkIGxhdGVyID0gaGlnaGVyLFxuICAgICAgICAvLyBIYW5kbGVzIGFmdGVyIHRoZSBtaWRkbGUgbGF0ZXIgaXMgbG93ZXJcbiAgICAgICAgLy8gW1s3XSBbOF0gLi4uLi4uLi4uLiB8IC4uLi4uLi4uLi4gWzVdIFs0XVxuICAgICAgICBmdW5jdGlvbiBzZXRaaW5kZXgoKSB7XG4gICAgICAgICAgICBzY29wZV9IYW5kbGVOdW1iZXJzLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlTnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpciA9IHNjb3BlX0xvY2F0aW9uc1toYW5kbGVOdW1iZXJdID4gNTAgPyAtMSA6IDE7XG4gICAgICAgICAgICAgICAgdmFyIHpJbmRleCA9IDMgKyAoc2NvcGVfSGFuZGxlcy5sZW5ndGggKyBkaXIgKiBoYW5kbGVOdW1iZXIpO1xuICAgICAgICAgICAgICAgIHNjb3BlX0hhbmRsZXNbaGFuZGxlTnVtYmVyXS5zdHlsZS56SW5kZXggPSB6SW5kZXg7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRlc3Qgc3VnZ2VzdGVkIHZhbHVlcyBhbmQgYXBwbHkgbWFyZ2luLCBzdGVwLlxuICAgICAgICBmdW5jdGlvbiBzZXRIYW5kbGUoaGFuZGxlTnVtYmVyLCB0bywgbG9va0JhY2t3YXJkLCBsb29rRm9yd2FyZCkge1xuICAgICAgICAgICAgdG8gPSBjaGVja0hhbmRsZVBvc2l0aW9uKHNjb3BlX0xvY2F0aW9ucywgaGFuZGxlTnVtYmVyLCB0bywgbG9va0JhY2t3YXJkLCBsb29rRm9yd2FyZCwgZmFsc2UpO1xuXG4gICAgICAgICAgICBpZiAodG8gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1cGRhdGVIYW5kbGVQb3NpdGlvbihoYW5kbGVOdW1iZXIsIHRvKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVcGRhdGVzIHN0eWxlIGF0dHJpYnV0ZSBmb3IgY29ubmVjdCBub2Rlc1xuICAgICAgICBmdW5jdGlvbiB1cGRhdGVDb25uZWN0KGluZGV4KSB7XG4gICAgICAgICAgICAvLyBTa2lwIGNvbm5lY3RzIHNldCB0byBmYWxzZVxuICAgICAgICAgICAgaWYgKCFzY29wZV9Db25uZWN0c1tpbmRleF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBsID0gMDtcbiAgICAgICAgICAgIHZhciBoID0gMTAwO1xuXG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IDApIHtcbiAgICAgICAgICAgICAgICBsID0gc2NvcGVfTG9jYXRpb25zW2luZGV4IC0gMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gc2NvcGVfQ29ubmVjdHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIGggPSBzY29wZV9Mb2NhdGlvbnNbaW5kZXhdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBXZSB1c2UgdHdvIHJ1bGVzOlxuICAgICAgICAgICAgLy8gJ3RyYW5zbGF0ZScgdG8gY2hhbmdlIHRoZSBsZWZ0L3RvcCBvZmZzZXQ7XG4gICAgICAgICAgICAvLyAnc2NhbGUnIHRvIGNoYW5nZSB0aGUgd2lkdGggb2YgdGhlIGVsZW1lbnQ7XG4gICAgICAgICAgICAvLyBBcyB0aGUgZWxlbWVudCBoYXMgYSB3aWR0aCBvZiAxMDAlLCBhIHRyYW5zbGF0aW9uIG9mIDEwMCUgaXMgZXF1YWwgdG8gMTAwJSBvZiB0aGUgcGFyZW50ICgubm9VaS1iYXNlKVxuICAgICAgICAgICAgdmFyIGNvbm5lY3RXaWR0aCA9IGggLSBsO1xuICAgICAgICAgICAgdmFyIHRyYW5zbGF0ZVJ1bGUgPSBcInRyYW5zbGF0ZShcIiArIGluUnVsZU9yZGVyKHRyYW5zZm9ybURpcmVjdGlvbihsLCBjb25uZWN0V2lkdGgpICsgXCIlXCIsIFwiMFwiKSArIFwiKVwiO1xuICAgICAgICAgICAgdmFyIHNjYWxlUnVsZSA9IFwic2NhbGUoXCIgKyBpblJ1bGVPcmRlcihjb25uZWN0V2lkdGggLyAxMDAsIFwiMVwiKSArIFwiKVwiO1xuXG4gICAgICAgICAgICBzY29wZV9Db25uZWN0c1tpbmRleF0uc3R5bGVbb3B0aW9ucy50cmFuc2Zvcm1SdWxlXSA9IHRyYW5zbGF0ZVJ1bGUgKyBcIiBcIiArIHNjYWxlUnVsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBhcnNlcyB2YWx1ZSBwYXNzZWQgdG8gLnNldCBtZXRob2QuIFJldHVybnMgY3VycmVudCB2YWx1ZSBpZiBub3QgcGFyc2UtYWJsZS5cbiAgICAgICAgZnVuY3Rpb24gcmVzb2x2ZVRvVmFsdWUodG8sIGhhbmRsZU51bWJlcikge1xuICAgICAgICAgICAgLy8gU2V0dGluZyB3aXRoIG51bGwgaW5kaWNhdGVzIGFuICdpZ25vcmUnLlxuICAgICAgICAgICAgLy8gSW5wdXR0aW5nICdmYWxzZScgaXMgaW52YWxpZC5cbiAgICAgICAgICAgIGlmICh0byA9PT0gbnVsbCB8fCB0byA9PT0gZmFsc2UgfHwgdG8gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzY29wZV9Mb2NhdGlvbnNbaGFuZGxlTnVtYmVyXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgYSBmb3JtYXR0ZWQgbnVtYmVyIHdhcyBwYXNzZWQsIGF0dGVtcHQgdG8gZGVjb2RlIGl0LlxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0byA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIHRvID0gU3RyaW5nKHRvKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdG8gPSBvcHRpb25zLmZvcm1hdC5mcm9tKHRvKTtcbiAgICAgICAgICAgIHRvID0gc2NvcGVfU3BlY3RydW0udG9TdGVwcGluZyh0byk7XG5cbiAgICAgICAgICAgIC8vIElmIHBhcnNpbmcgdGhlIG51bWJlciBmYWlsZWQsIHVzZSB0aGUgY3VycmVudCB2YWx1ZS5cbiAgICAgICAgICAgIGlmICh0byA9PT0gZmFsc2UgfHwgaXNOYU4odG8pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlX0xvY2F0aW9uc1toYW5kbGVOdW1iZXJdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdG87XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgdGhlIHNsaWRlciB2YWx1ZS5cbiAgICAgICAgZnVuY3Rpb24gdmFsdWVTZXQoaW5wdXQsIGZpcmVTZXRFdmVudCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlcyA9IGFzQXJyYXkoaW5wdXQpO1xuICAgICAgICAgICAgdmFyIGlzSW5pdCA9IHNjb3BlX0xvY2F0aW9uc1swXSA9PT0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAvLyBFdmVudCBmaXJlcyBieSBkZWZhdWx0XG4gICAgICAgICAgICBmaXJlU2V0RXZlbnQgPSBmaXJlU2V0RXZlbnQgPT09IHVuZGVmaW5lZCA/IHRydWUgOiAhIWZpcmVTZXRFdmVudDtcblxuICAgICAgICAgICAgLy8gQW5pbWF0aW9uIGlzIG9wdGlvbmFsLlxuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSBpbml0aWFsIHZhbHVlcyB3ZXJlIHNldCBiZWZvcmUgdXNpbmcgYW5pbWF0ZWQgcGxhY2VtZW50LlxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuYW5pbWF0ZSAmJiAhaXNJbml0ICYmIHNjb3BlX1Nob3VsZEFuaW1hdGUpIHtcbiAgICAgICAgICAgICAgICBhZGRDbGFzc0ZvcihzY29wZV9UYXJnZXQsIG9wdGlvbnMuY3NzQ2xhc3Nlcy50YXAsIG9wdGlvbnMuYW5pbWF0aW9uRHVyYXRpb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBGaXJzdCBwYXNzLCB3aXRob3V0IGxvb2tBaGVhZCBidXQgd2l0aCBsb29rQmFja3dhcmQuIFZhbHVlcyBhcmUgc2V0IGZyb20gbGVmdCB0byByaWdodC5cbiAgICAgICAgICAgIHNjb3BlX0hhbmRsZU51bWJlcnMuZm9yRWFjaChmdW5jdGlvbihoYW5kbGVOdW1iZXIpIHtcbiAgICAgICAgICAgICAgICBzZXRIYW5kbGUoaGFuZGxlTnVtYmVyLCByZXNvbHZlVG9WYWx1ZSh2YWx1ZXNbaGFuZGxlTnVtYmVyXSwgaGFuZGxlTnVtYmVyKSwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFNlY29uZCBwYXNzLiBOb3cgdGhhdCBhbGwgYmFzZSB2YWx1ZXMgYXJlIHNldCwgYXBwbHkgY29uc3RyYWludHNcbiAgICAgICAgICAgIHNjb3BlX0hhbmRsZU51bWJlcnMuZm9yRWFjaChmdW5jdGlvbihoYW5kbGVOdW1iZXIpIHtcbiAgICAgICAgICAgICAgICBzZXRIYW5kbGUoaGFuZGxlTnVtYmVyLCBzY29wZV9Mb2NhdGlvbnNbaGFuZGxlTnVtYmVyXSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2V0WmluZGV4KCk7XG5cbiAgICAgICAgICAgIHNjb3BlX0hhbmRsZU51bWJlcnMuZm9yRWFjaChmdW5jdGlvbihoYW5kbGVOdW1iZXIpIHtcbiAgICAgICAgICAgICAgICBmaXJlRXZlbnQoXCJ1cGRhdGVcIiwgaGFuZGxlTnVtYmVyKTtcblxuICAgICAgICAgICAgICAgIC8vIEZpcmUgdGhlIGV2ZW50IG9ubHkgZm9yIGhhbmRsZXMgdGhhdCByZWNlaXZlZCBhIG5ldyB2YWx1ZSwgYXMgcGVyICM1NzlcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVzW2hhbmRsZU51bWJlcl0gIT09IG51bGwgJiYgZmlyZVNldEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGZpcmVFdmVudChcInNldFwiLCBoYW5kbGVOdW1iZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVzZXQgc2xpZGVyIHRvIGluaXRpYWwgdmFsdWVzXG4gICAgICAgIGZ1bmN0aW9uIHZhbHVlUmVzZXQoZmlyZVNldEV2ZW50KSB7XG4gICAgICAgICAgICB2YWx1ZVNldChvcHRpb25zLnN0YXJ0LCBmaXJlU2V0RXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IHZhbHVlIGZvciBhIHNpbmdsZSBoYW5kbGVcbiAgICAgICAgZnVuY3Rpb24gdmFsdWVTZXRIYW5kbGUoaGFuZGxlTnVtYmVyLCB2YWx1ZSwgZmlyZVNldEV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgdmFsdWVzID0gW107XG5cbiAgICAgICAgICAgIC8vIEVuc3VyZSBudW1lcmljIGlucHV0XG4gICAgICAgICAgICBoYW5kbGVOdW1iZXIgPSBOdW1iZXIoaGFuZGxlTnVtYmVyKTtcblxuICAgICAgICAgICAgaWYgKCEoaGFuZGxlTnVtYmVyID49IDAgJiYgaGFuZGxlTnVtYmVyIDwgc2NvcGVfSGFuZGxlTnVtYmVycy5sZW5ndGgpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIgKyBWRVJTSU9OICsgXCIpOiBpbnZhbGlkIGhhbmRsZSBudW1iZXIsIGdvdDogXCIgKyBoYW5kbGVOdW1iZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjb3BlX0hhbmRsZU51bWJlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXNbaV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YWx1ZXNbaGFuZGxlTnVtYmVyXSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB2YWx1ZVNldCh2YWx1ZXMsIGZpcmVTZXRFdmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBHZXQgdGhlIHNsaWRlciB2YWx1ZS5cbiAgICAgICAgZnVuY3Rpb24gdmFsdWVHZXQoKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWVzID0gc2NvcGVfVmFsdWVzLm1hcChvcHRpb25zLmZvcm1hdC50byk7XG5cbiAgICAgICAgICAgIC8vIElmIG9ubHkgb25lIGhhbmRsZSBpcyB1c2VkLCByZXR1cm4gYSBzaW5nbGUgdmFsdWUuXG4gICAgICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbMF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZW1vdmVzIGNsYXNzZXMgZnJvbSB0aGUgcm9vdCBhbmQgZW1wdGllcyBpdC5cbiAgICAgICAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBvcHRpb25zLmNzc0NsYXNzZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMuY3NzQ2xhc3Nlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZW1vdmVDbGFzcyhzY29wZV9UYXJnZXQsIG9wdGlvbnMuY3NzQ2xhc3Nlc1trZXldKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2hpbGUgKHNjb3BlX1RhcmdldC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAgc2NvcGVfVGFyZ2V0LnJlbW92ZUNoaWxkKHNjb3BlX1RhcmdldC5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGVsZXRlIHNjb3BlX1RhcmdldC5ub1VpU2xpZGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0TmV4dFN0ZXBzRm9ySGFuZGxlKGhhbmRsZU51bWJlcikge1xuICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gc2NvcGVfTG9jYXRpb25zW2hhbmRsZU51bWJlcl07XG4gICAgICAgICAgICB2YXIgbmVhcmJ5U3RlcHMgPSBzY29wZV9TcGVjdHJ1bS5nZXROZWFyYnlTdGVwcyhsb2NhdGlvbik7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBzY29wZV9WYWx1ZXNbaGFuZGxlTnVtYmVyXTtcbiAgICAgICAgICAgIHZhciBpbmNyZW1lbnQgPSBuZWFyYnlTdGVwcy50aGlzU3RlcC5zdGVwO1xuICAgICAgICAgICAgdmFyIGRlY3JlbWVudCA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSBuZXh0IHZhbHVlIGluIHRoaXMgc3RlcCBtb3ZlcyBpbnRvIHRoZSBuZXh0IHN0ZXAsXG4gICAgICAgICAgICAvLyB0aGUgaW5jcmVtZW50IGlzIHRoZSBzdGFydCBvZiB0aGUgbmV4dCBzdGVwIC0gdGhlIGN1cnJlbnQgdmFsdWVcbiAgICAgICAgICAgIGlmIChpbmNyZW1lbnQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICsgaW5jcmVtZW50ID4gbmVhcmJ5U3RlcHMuc3RlcEFmdGVyLnN0YXJ0VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5jcmVtZW50ID0gbmVhcmJ5U3RlcHMuc3RlcEFmdGVyLnN0YXJ0VmFsdWUgLSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSB2YWx1ZSBpcyBiZXlvbmQgdGhlIHN0YXJ0aW5nIHBvaW50XG4gICAgICAgICAgICBpZiAodmFsdWUgPiBuZWFyYnlTdGVwcy50aGlzU3RlcC5zdGFydFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZGVjcmVtZW50ID0gbmVhcmJ5U3RlcHMudGhpc1N0ZXAuc3RlcDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobmVhcmJ5U3RlcHMuc3RlcEJlZm9yZS5zdGVwID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGRlY3JlbWVudCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBhIGhhbmRsZSBpcyBhdCB0aGUgc3RhcnQgb2YgYSBzdGVwLCBpdCBhbHdheXMgc3RlcHMgYmFjayBpbnRvIHRoZSBwcmV2aW91cyBzdGVwIGZpcnN0XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWNyZW1lbnQgPSB2YWx1ZSAtIG5lYXJieVN0ZXBzLnN0ZXBCZWZvcmUuaGlnaGVzdFN0ZXA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE5vdywgaWYgYXQgdGhlIHNsaWRlciBlZGdlcywgdGhlcmUgaXMgbm8gaW4vZGVjcmVtZW50XG4gICAgICAgICAgICBpZiAobG9jYXRpb24gPT09IDEwMCkge1xuICAgICAgICAgICAgICAgIGluY3JlbWVudCA9IG51bGw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxvY2F0aW9uID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZGVjcmVtZW50ID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQXMgcGVyICMzOTEsIHRoZSBjb21wYXJpc29uIGZvciB0aGUgZGVjcmVtZW50IHN0ZXAgY2FuIGhhdmUgc29tZSByb3VuZGluZyBpc3N1ZXMuXG4gICAgICAgICAgICB2YXIgc3RlcERlY2ltYWxzID0gc2NvcGVfU3BlY3RydW0uY291bnRTdGVwRGVjaW1hbHMoKTtcblxuICAgICAgICAgICAgLy8gUm91bmQgcGVyICMzOTFcbiAgICAgICAgICAgIGlmIChpbmNyZW1lbnQgIT09IG51bGwgJiYgaW5jcmVtZW50ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGluY3JlbWVudCA9IE51bWJlcihpbmNyZW1lbnQudG9GaXhlZChzdGVwRGVjaW1hbHMpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRlY3JlbWVudCAhPT0gbnVsbCAmJiBkZWNyZW1lbnQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgZGVjcmVtZW50ID0gTnVtYmVyKGRlY3JlbWVudC50b0ZpeGVkKHN0ZXBEZWNpbWFscykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gW2RlY3JlbWVudCwgaW5jcmVtZW50XTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdldCB0aGUgY3VycmVudCBzdGVwIHNpemUgZm9yIHRoZSBzbGlkZXIuXG4gICAgICAgIGZ1bmN0aW9uIGdldE5leHRTdGVwcygpIHtcbiAgICAgICAgICAgIHJldHVybiBzY29wZV9IYW5kbGVOdW1iZXJzLm1hcChnZXROZXh0U3RlcHNGb3JIYW5kbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXBkYXRlYWJsZTogbWFyZ2luLCBsaW1pdCwgcGFkZGluZywgc3RlcCwgcmFuZ2UsIGFuaW1hdGUsIHNuYXBcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlT3B0aW9ucyhvcHRpb25zVG9VcGRhdGUsIGZpcmVTZXRFdmVudCkge1xuICAgICAgICAgICAgLy8gU3BlY3RydW0gaXMgY3JlYXRlZCB1c2luZyB0aGUgcmFuZ2UsIHNuYXAsIGRpcmVjdGlvbiBhbmQgc3RlcCBvcHRpb25zLlxuICAgICAgICAgICAgLy8gJ3NuYXAnIGFuZCAnc3RlcCcgY2FuIGJlIHVwZGF0ZWQuXG4gICAgICAgICAgICAvLyBJZiAnc25hcCcgYW5kICdzdGVwJyBhcmUgbm90IHBhc3NlZCwgdGhleSBzaG91bGQgcmVtYWluIHVuY2hhbmdlZC5cbiAgICAgICAgICAgIHZhciB2ID0gdmFsdWVHZXQoKTtcblxuICAgICAgICAgICAgdmFyIHVwZGF0ZUFibGUgPSBbXG4gICAgICAgICAgICAgICAgXCJtYXJnaW5cIixcbiAgICAgICAgICAgICAgICBcImxpbWl0XCIsXG4gICAgICAgICAgICAgICAgXCJwYWRkaW5nXCIsXG4gICAgICAgICAgICAgICAgXCJyYW5nZVwiLFxuICAgICAgICAgICAgICAgIFwiYW5pbWF0ZVwiLFxuICAgICAgICAgICAgICAgIFwic25hcFwiLFxuICAgICAgICAgICAgICAgIFwic3RlcFwiLFxuICAgICAgICAgICAgICAgIFwiZm9ybWF0XCIsXG4gICAgICAgICAgICAgICAgXCJwaXBzXCIsXG4gICAgICAgICAgICAgICAgXCJ0b29sdGlwc1wiXG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICAvLyBPbmx5IGNoYW5nZSBvcHRpb25zIHRoYXQgd2UncmUgYWN0dWFsbHkgcGFzc2VkIHRvIHVwZGF0ZS5cbiAgICAgICAgICAgIHVwZGF0ZUFibGUuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIHVuZGVmaW5lZC4gbnVsbCByZW1vdmVzIHRoZSB2YWx1ZS5cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9uc1RvVXBkYXRlW25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxPcHRpb25zW25hbWVdID0gb3B0aW9uc1RvVXBkYXRlW25hbWVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgbmV3T3B0aW9ucyA9IHRlc3RPcHRpb25zKG9yaWdpbmFsT3B0aW9ucyk7XG5cbiAgICAgICAgICAgIC8vIExvYWQgbmV3IG9wdGlvbnMgaW50byB0aGUgc2xpZGVyIHN0YXRlXG4gICAgICAgICAgICB1cGRhdGVBYmxlLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zVG9VcGRhdGVbbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW25hbWVdID0gbmV3T3B0aW9uc1tuYW1lXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2NvcGVfU3BlY3RydW0gPSBuZXdPcHRpb25zLnNwZWN0cnVtO1xuXG4gICAgICAgICAgICAvLyBMaW1pdCwgbWFyZ2luIGFuZCBwYWRkaW5nIGRlcGVuZCBvbiB0aGUgc3BlY3RydW0gYnV0IGFyZSBzdG9yZWQgb3V0c2lkZSBvZiBpdC4gKCM2NzcpXG4gICAgICAgICAgICBvcHRpb25zLm1hcmdpbiA9IG5ld09wdGlvbnMubWFyZ2luO1xuICAgICAgICAgICAgb3B0aW9ucy5saW1pdCA9IG5ld09wdGlvbnMubGltaXQ7XG4gICAgICAgICAgICBvcHRpb25zLnBhZGRpbmcgPSBuZXdPcHRpb25zLnBhZGRpbmc7XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZSBwaXBzLCByZW1vdmVzIGV4aXN0aW5nLlxuICAgICAgICAgICAgaWYgKG9wdGlvbnMucGlwcykge1xuICAgICAgICAgICAgICAgIHBpcHMob3B0aW9ucy5waXBzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlUGlwcygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBVcGRhdGUgdG9vbHRpcHMsIHJlbW92ZXMgZXhpc3RpbmcuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy50b29sdGlwcykge1xuICAgICAgICAgICAgICAgIHRvb2x0aXBzKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlbW92ZVRvb2x0aXBzKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEludmFsaWRhdGUgdGhlIGN1cnJlbnQgcG9zaXRpb25pbmcgc28gdmFsdWVTZXQgZm9yY2VzIGFuIHVwZGF0ZS5cbiAgICAgICAgICAgIHNjb3BlX0xvY2F0aW9ucyA9IFtdO1xuICAgICAgICAgICAgdmFsdWVTZXQob3B0aW9uc1RvVXBkYXRlLnN0YXJ0IHx8IHYsIGZpcmVTZXRFdmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbml0aWFsaXphdGlvbiBzdGVwc1xuICAgICAgICBmdW5jdGlvbiBzZXR1cFNsaWRlcigpIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgYmFzZSBlbGVtZW50LCBpbml0aWFsaXplIEhUTUwgYW5kIHNldCBjbGFzc2VzLlxuICAgICAgICAgICAgLy8gQWRkIGhhbmRsZXMgYW5kIGNvbm5lY3QgZWxlbWVudHMuXG4gICAgICAgICAgICBzY29wZV9CYXNlID0gYWRkU2xpZGVyKHNjb3BlX1RhcmdldCk7XG5cbiAgICAgICAgICAgIGFkZEVsZW1lbnRzKG9wdGlvbnMuY29ubmVjdCwgc2NvcGVfQmFzZSk7XG5cbiAgICAgICAgICAgIC8vIEF0dGFjaCB1c2VyIGV2ZW50cy5cbiAgICAgICAgICAgIGJpbmRTbGlkZXJFdmVudHMob3B0aW9ucy5ldmVudHMpO1xuXG4gICAgICAgICAgICAvLyBVc2UgdGhlIHB1YmxpYyB2YWx1ZSBtZXRob2QgdG8gc2V0IHRoZSBzdGFydCB2YWx1ZXMuXG4gICAgICAgICAgICB2YWx1ZVNldChvcHRpb25zLnN0YXJ0KTtcblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMucGlwcykge1xuICAgICAgICAgICAgICAgIHBpcHMob3B0aW9ucy5waXBzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMudG9vbHRpcHMpIHtcbiAgICAgICAgICAgICAgICB0b29sdGlwcygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhcmlhKCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXR1cFNsaWRlcigpO1xuXG4gICAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU1VudXNlZEdsb2JhbFN5bWJvbHNcbiAgICAgICAgc2NvcGVfU2VsZiA9IHtcbiAgICAgICAgICAgIGRlc3Ryb3k6IGRlc3Ryb3ksXG4gICAgICAgICAgICBzdGVwczogZ2V0TmV4dFN0ZXBzLFxuICAgICAgICAgICAgb246IGJpbmRFdmVudCxcbiAgICAgICAgICAgIG9mZjogcmVtb3ZlRXZlbnQsXG4gICAgICAgICAgICBnZXQ6IHZhbHVlR2V0LFxuICAgICAgICAgICAgc2V0OiB2YWx1ZVNldCxcbiAgICAgICAgICAgIHNldEhhbmRsZTogdmFsdWVTZXRIYW5kbGUsXG4gICAgICAgICAgICByZXNldDogdmFsdWVSZXNldCxcbiAgICAgICAgICAgIC8vIEV4cG9zZWQgZm9yIHVuaXQgdGVzdGluZywgZG9uJ3QgdXNlIHRoaXMgaW4geW91ciBhcHBsaWNhdGlvbi5cbiAgICAgICAgICAgIF9fbW92ZUhhbmRsZXM6IGZ1bmN0aW9uKGEsIGIsIGMpIHtcbiAgICAgICAgICAgICAgICBtb3ZlSGFuZGxlcyhhLCBiLCBzY29wZV9Mb2NhdGlvbnMsIGMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG9yaWdpbmFsT3B0aW9ucywgLy8gSXNzdWUgIzYwMCwgIzY3OFxuICAgICAgICAgICAgdXBkYXRlT3B0aW9uczogdXBkYXRlT3B0aW9ucyxcbiAgICAgICAgICAgIHRhcmdldDogc2NvcGVfVGFyZ2V0LCAvLyBJc3N1ZSAjNTk3XG4gICAgICAgICAgICByZW1vdmVQaXBzOiByZW1vdmVQaXBzLFxuICAgICAgICAgICAgcmVtb3ZlVG9vbHRpcHM6IHJlbW92ZVRvb2x0aXBzLFxuICAgICAgICAgICAgcGlwczogcGlwcyAvLyBJc3N1ZSAjNTk0XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHNjb3BlX1NlbGY7XG4gICAgfVxuXG4gICAgLy8gUnVuIHRoZSBzdGFuZGFyZCBpbml0aWFsaXplclxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemUodGFyZ2V0LCBvcmlnaW5hbE9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCF0YXJnZXQgfHwgIXRhcmdldC5ub2RlTmFtZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm9VaVNsaWRlciAoXCIgKyBWRVJTSU9OICsgXCIpOiBjcmVhdGUgcmVxdWlyZXMgYSBzaW5nbGUgZWxlbWVudCwgZ290OiBcIiArIHRhcmdldCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaHJvdyBhbiBlcnJvciBpZiB0aGUgc2xpZGVyIHdhcyBhbHJlYWR5IGluaXRpYWxpemVkLlxuICAgICAgICBpZiAodGFyZ2V0Lm5vVWlTbGlkZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vVWlTbGlkZXIgKFwiICsgVkVSU0lPTiArIFwiKTogU2xpZGVyIHdhcyBhbHJlYWR5IGluaXRpYWxpemVkLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRlc3QgdGhlIG9wdGlvbnMgYW5kIGNyZWF0ZSB0aGUgc2xpZGVyIGVudmlyb25tZW50O1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHRlc3RPcHRpb25zKG9yaWdpbmFsT3B0aW9ucywgdGFyZ2V0KTtcbiAgICAgICAgdmFyIGFwaSA9IHNjb3BlKHRhcmdldCwgb3B0aW9ucywgb3JpZ2luYWxPcHRpb25zKTtcblxuICAgICAgICB0YXJnZXQubm9VaVNsaWRlciA9IGFwaTtcblxuICAgICAgICByZXR1cm4gYXBpO1xuICAgIH1cblxuICAgIC8vIFVzZSBhbiBvYmplY3QgaW5zdGVhZCBvZiBhIGZ1bmN0aW9uIGZvciBmdXR1cmUgZXhwYW5kYWJpbGl0eTtcbiAgICByZXR1cm4ge1xuICAgICAgICAvLyBFeHBvc2VkIGZvciB1bml0IHRlc3RpbmcsIGRvbid0IHVzZSB0aGlzIGluIHlvdXIgYXBwbGljYXRpb24uXG4gICAgICAgIF9fc3BlY3RydW06IFNwZWN0cnVtLFxuICAgICAgICB2ZXJzaW9uOiBWRVJTSU9OLFxuICAgICAgICBjcmVhdGU6IGluaXRpYWxpemVcbiAgICB9O1xufSk7XG4iLCJpbXBvcnQge2lzRURHRSwgaXNGaXJlZm94LCBpc0lFMTAsIGlzSUUxMSwgTVFVRVJZfSBmcm9tIFwiLi9jb21tb25cIjtcblxuZXhwb3J0IGNvbnN0IGFuaW1hdGVBYm91dE9uTW91c2VNb3ZlID0gKCk9PiB7XG4gICAgbGV0IG1vdmVtZW50U3RyZW5ndGggPSAyNTtcbiAgICBsZXQgaGVpZ2h0ID0gbW92ZW1lbnRTdHJlbmd0aCAvIHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGxldCB3aWR0aCA9IG1vdmVtZW50U3RyZW5ndGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICBpZiAoKGlzRmlyZWZveCB8fCBpc0VER0UgfHwgaXNJRTEwIHx8IGlzSUUxMSkgJiYgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFib3V0X19pbWFnZScpKVxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWJvdXRfX2ltYWdlJykuZm9yRWFjaChlID0+IGUuY2xhc3NMaXN0LmFkZCgnbm9uUGF0aCcpKTtcblxuICAgIGxldCBhID0gZmFsc2U7IC8vIHRvIHJlbW92ZVxuXG4gICAgaWYgKCFNUVVFUlkubWF0Y2hlcyAmJiBhKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZSk9PiB7XG4gICAgICAgICAgICBsZXQgcGFnZVggPSBlLnBhZ2VYIC0gKHdpbmRvdy5pbm5lcldpZHRoIC8gMik7XG4gICAgICAgICAgICBsZXQgcGFnZVkgPSBlLnBhZ2VZIC0gKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpO1xuICAgICAgICAgICAgbGV0IG5ld3ZhbHVlWCA9IHdpZHRoICogcGFnZVggKiAtMSAtIDI1O1xuICAgICAgICAgICAgbGV0IG5ld3ZhbHVlWSA9IGhlaWdodCAqIHBhZ2VZICogLTEgLSA1MDtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hYm91dF9faW1hZ2UnKS5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBgY2FsYyg1MCUgKyAke25ld3ZhbHVlWH1weCkgY2FsYyg1MCUgKyAke25ld3ZhbHVlWX1weClgO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWJvdXRfX2NpcmNsZScpLmZvckVhY2goKGUsaSk9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHggPSB3aWR0aCAqIHBhZ2VYICogLTEgLSAoMjUgKyBpKjUpO1xuICAgICAgICAgICAgICAgIGUuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgke3h9ZGVnKSAke2UuZ2V0QXR0cmlidXRlKCdkYXRhLXNrZXcnKX1gO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07IiwiaW1wb3J0IHtzbW9vdGhTY3JvbGwsIHdpbmRvd1Njcm9sbH0gZnJvbSAnLi9jb21tb24nO1xuaW1wb3J0IHthbmltYXRlQWJvdXRPbk1vdXNlTW92ZX0gZnJvbSAnLi9hYm91dCc7XG5pbXBvcnQgcG9wdXBIYW5kbGVycyBmcm9tICcuL3BvcHVwJztcbmltcG9ydCB7bWFwSGFuZGxlcnN9IGZyb20gXCIuL21hcFwiO1xuaW1wb3J0IG9wZXJhdG9yc1BhZ2UgZnJvbSBcIi4vb3BlcmF0b3JzXCI7XG5cbihmdW5jdGlvbiAoKSB7XG4gICAgd2luZG93U2Nyb2xsKCk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHdpbmRvd1Njcm9sbCk7XG4gICAgYW5pbWF0ZUFib3V0T25Nb3VzZU1vdmUoKTtcbiAgICBwb3B1cEhhbmRsZXJzKCk7XG4gICAgbWFwSGFuZGxlcnMoKTtcbiAgICBvcGVyYXRvcnNQYWdlKCk7XG4gICAgJCgnYVtocmVmKj1cIiNcIl0nKS5vbignY2xpY2snLCBzbW9vdGhTY3JvbGwpO1xufSkoKTtcblxuXG4iLCJpbXBvcnQgZGVib3VuY2UgZnJvbSAnbG9kYXNoL2RlYm91bmNlJztcblxuXG5leHBvcnQgY29uc3QgTVFVRVJZID0gd2luZG93Lm1hdGNoTWVkaWEoJ3NjcmVlbiBhbmQgKG1heC13aWR0aDogOTU5cHgpJyk7XG5leHBvcnQgY29uc3QgTVNJWkUgPSA5NTk7XG5leHBvcnQgY29uc3QgaXNGaXJlZm94ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2ZpcmVmb3gnKSA+IC0xO1xuZXhwb3J0IGNvbnN0IGlzSUUxMCA9IC9NU0lFIDEwL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbmV4cG9ydCBjb25zdCBpc0lFMTE9IC9NU0lFIDkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpIHx8IC9ydjoxMS4wL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbmV4cG9ydCBjb25zdCBpc0VER0UgPSAvRWRnZVxcL1xcZC4vaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG5jb25zdCBfY2hlY2tFbGVtZW50Vmlld3BvcnQgPSAoZWxtLCBpc0hUTUwsIGhhbGYpID0+IHtcbiAgICBsZXQgaGVpZ2h0ID0gaGFsZiA/IHdpbmRvdy5pbm5lckhlaWdodCAvIDEuMSA6IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBpZiAoaXNIVE1MICYmIGVsbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgPCBoZWlnaHQpIHJldHVybiB0cnVlO1xuICAgIGVsc2UgaWYgKCFpc0hUTUwpIHtcbiAgICAgICAgaWYgKCFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsbSkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgZWxzZSBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbG0pLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCA8IGhlaWdodCkgcmV0dXJuIHRydWU7XG4gICAgfVxufTtcblxuY29uc3QgX2FkZENsYXNzb25WaWV3cG9ydCA9IChlbG0sIGlzSFRNTCwgaGFsZikgPT4ge1xuICAgIGlmIChpc0hUTUwgJiYgX2NoZWNrRWxlbWVudFZpZXdwb3J0KGVsbSwgaXNIVE1MLCBoYWxmKSkgZWxtLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIGVsc2UgaWYgKCFpc0hUTUwgJiYgX2NoZWNrRWxlbWVudFZpZXdwb3J0KGVsbSwgbnVsbCwgaGFsZikpIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxtKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbn07XG5cblxuY29uc3QgX2FkZFJlcXVpcmVBbmltYXRpb24gPSAoKSA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnJlcS1hbmltYXRpb24nKS5mb3JFYWNoKChlKSA9PiB7XG4gICAgICAgIF9hZGRDbGFzc29uVmlld3BvcnQoZSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgfSk7XG59O1xuXG5cblxuZXhwb3J0IGNvbnN0IHdpbmRvd1Njcm9sbCA9IGRlYm91bmNlKCgpID0+IHtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgX2FkZFJlcXVpcmVBbmltYXRpb24oKTtcbiAgICB9KTtcbn0sIDUwKTtcblxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb29raWUobmFtZSkge1xuICAgIGxldCBtYXRjaGVzID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoXG4gICAgICAgIFwiKD86Xnw7IClcIiArIG5hbWUucmVwbGFjZSgvKFtcXC4kPyp8e31cXChcXClcXFtcXF1cXFxcXFwvXFwrXl0pL2csICdcXFxcJDEnKSArIFwiPShbXjtdKilcIlxuICAgICkpO1xuICAgIHJldHVybiBtYXRjaGVzID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoZXNbMV0pIDogdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q29va2llKG5hbWUsIHZhbHVlLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICBsZXQgZXhwaXJlcyA9IG9wdGlvbnMuZXhwaXJlcztcblxuICAgIGlmICh0eXBlb2YgZXhwaXJlcyA9PSBcIm51bWJlclwiICYmIGV4cGlyZXMpIHtcbiAgICAgICAgbGV0IGQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBkLnNldFRpbWUoZC5nZXRUaW1lKCkgKyBleHBpcmVzICogMTAwMCk7XG4gICAgICAgIGV4cGlyZXMgPSBvcHRpb25zLmV4cGlyZXMgPSBkO1xuICAgIH1cbiAgICBpZiAoZXhwaXJlcyAmJiBleHBpcmVzLnRvVVRDU3RyaW5nKSB7XG4gICAgICAgIG9wdGlvbnMuZXhwaXJlcyA9IGV4cGlyZXMudG9VVENTdHJpbmcoKTtcbiAgICB9XG5cbiAgICB2YWx1ZSA9IGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7XG5cbiAgICBsZXQgdXBkYXRlZENvb2tpZSA9IG5hbWUgKyBcIj1cIiArIHZhbHVlO1xuXG4gICAgZm9yIChsZXQgcHJvcE5hbWUgaW4gb3B0aW9ucykge1xuICAgICAgICB1cGRhdGVkQ29va2llICs9IFwiOyBcIiArIHByb3BOYW1lO1xuICAgICAgICBsZXQgcHJvcFZhbHVlID0gb3B0aW9uc1twcm9wTmFtZV07XG4gICAgICAgIGlmIChwcm9wVmFsdWUgIT09IHRydWUpIHtcbiAgICAgICAgICAgIHVwZGF0ZWRDb29raWUgKz0gXCI9XCIgKyBwcm9wVmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkb2N1bWVudC5jb29raWUgPSB1cGRhdGVkQ29va2llO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc21vb3RoU2Nyb2xsKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG4gICAgICAgIHNjcm9sbFRvcDogJCgkKGUuY3VycmVudFRhcmdldCkuYXR0cignaHJlZicpKS5vZmZzZXQoKS50b3BcbiAgICB9LCA1MDAsICdsaW5lYXInKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbUludEZyb21JbnRlcnZhbChtaW4sbWF4KSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoobWF4LW1pbisxKSttaW4pO1xufSIsImltcG9ydCB7cmFuZG9tSW50RnJvbUludGVydmFsLCBNUVVFUlksIE1TSVpFfSBmcm9tIFwiLi9jb21tb25cIjtcblxuZXhwb3J0IGNvbnN0IG1hcEhhbmRsZXJzID0gKCkgPT4ge1xuICAgICQoZG9jdW1lbnQpXG4gICAgICAgIC5vbignbW91c2VlbnRlcicsICcubWFwc3ZnLXJlZ2lvbicsIGhvdmVyUGF0aClcbiAgICAgICAgLm9uKCdtb3VzZW91dCcsICcubWFwc3ZnLXJlZ2lvbicsIHJlbW92ZVBhdGhIb3Zlcik7XG5cbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWZvci1yZWdpb25zJykpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZVduZG93U2V0TWFwKTtcbiAgICAgICAgaW5pdFBsYWNlcygpO1xuICAgICAgICBzZXRSYW5kb21Ib3ZlcigpO1xuICAgIH1cbn07XG5cbmNvbnN0IGNvdW50cmllc0NvdW50ID0gW1xuICAgIHtcbiAgICAgICAgaWQ6ICdTSycsXG4gICAgICAgIGNvdW50OiA2NlxuICAgIH0sXG4gICAge1xuICAgICAgICBpZDonU0knLFxuICAgICAgICBjb3VudDogNThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgaWQ6J1NFJyxcbiAgICAgICAgY291bnQ6IDExMlxuICAgIH0sXG4gICAge1xuICAgICAgICBpZDonUlMnLFxuICAgICAgICBjb3VudDogMThcbiAgICB9LFxuICAgIHtcbiAgICAgICAgaWQ6J1JPJyxcbiAgICAgICAgY291bnQ6IDI5XG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlkOidQVCcsXG4gICAgICAgIGNvdW50OiA4OFxuICAgIH0sXG4gICAge1xuICAgICAgICBpZDonTk8nLFxuICAgICAgICBjb3VudDogMTc4XG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlkOidOTCcsXG4gICAgICAgIGNvdW50OiAxMjBcbiAgICB9LFxuICAgIHtcbiAgICAgICAgaWQ6J1BMJyxcbiAgICAgICAgY291bnQ6IDMzMVxuICAgIH0sXG4gICAge1xuICAgICAgICBpZDonRUUnLFxuICAgICAgICBjb3VudDogMzlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgaWQ6J0FUJyxcbiAgICAgICAgY291bnQ6IDI2MVxuICAgIH0sXG4gICAge1xuICAgICAgICBpZDonREUnLFxuICAgICAgICBjb3VudDogNzA1XG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlkOidDWicsXG4gICAgICAgIGNvdW50OiAzMTlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgaWQ6J0lFJyxcbiAgICAgICAgY291bnQ6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgaWQ6J0NIJyxcbiAgICAgICAgY291bnQ6IDkxXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlkOidBTCcsXG4gICAgICAgIGNvdW50OiAxMVxuICAgIH0sXG4gICAge1xuICAgICAgICBpZDonREsnLFxuICAgICAgICBjb3VudDogMzdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgaWQ6J0xWJyxcbiAgICAgICAgY291bnQ6IDM2XG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlkOidUUicsXG4gICAgICAgIGNvdW50OiAxMlxuICAgIH0sXG4gICAge1xuICAgICAgICBpZDonQkcnLFxuICAgICAgICBjb3VudDogMTZcbiAgICB9LFxuICAgIHtcbiAgICAgICAgaWQ6J0hSJyxcbiAgICAgICAgY291bnQ6IDU4XG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlkOidCRScsXG4gICAgICAgIGNvdW50OiA3OFxuICAgIH0sXG4gICAge1xuICAgICAgICBpZDonRVMnLFxuICAgICAgICBjb3VudDogMTgwXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlkOidGSScsXG4gICAgICAgIGNvdW50OiAxNFxuICAgIH0sXG4gICAge1xuICAgICAgICBpZDonSFUnLFxuICAgICAgICBjb3VudDogMjUxXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlkOidNRScsXG4gICAgICAgIGNvdW50OiA2XG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlkOidGUicsXG4gICAgICAgIGNvdW50OiA1NjdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgaWQ6J0xVJyxcbiAgICAgICAgY291bnQ6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgICAgaWQ6J0dCJyxcbiAgICAgICAgY291bnQ6IDQ5XG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlkOidHUicsXG4gICAgICAgIGNvdW50OiAzOFxuICAgIH0sXG4gICAge1xuICAgICAgICBpZDonSVQnLFxuICAgICAgICBjb3VudDogNDg4XG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlkOidMVCcsXG4gICAgICAgIGNvdW50OiAzN1xuICAgIH1cbl07XG5cbmxldCB0byA9IG51bGwsXG4gICAgdG9SZXNpemUgPSBudWxsO1xuXG5jb25zdCBjb3VudHJpZXMgPSAkLmZuLmludGxUZWxJbnB1dC5nZXRDb3VudHJ5RGF0YSgpO1xuXG5jb25zdCBQTEFDRV9TSVpFID0gMjAgKiAzMDtcblxuY29uc3QgcmVzaXplV25kb3dTZXRNYXAgPSAoKSA9PiB7XG4gICAgJCgnLmpzLWZvci1wb2ludHMtbWFwJykuaHRtbCgnJyk7XG4gICAgY2xlYXJUaW1lb3V0KHRvUmVzaXplKTtcbiAgICB0b1Jlc2l6ZSA9IHNldFRpbWVvdXQoKCk9PiB7XG4gICAgICAgIGluaXRQbGFjZXMoKTtcbiAgICB9LCA1MCk7XG59O1xuXG5jb25zdCBob3ZlclBhdGggPSAoZSwgaXNJRCkgPT4ge1xuICAgIGxldCB0YXJnZXQgPSBpc0lEID8gaXNJRCA6IGUuY3VycmVudFRhcmdldDtcbiAgICBsZXQgaWQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpO1xuXG4gICAgbGV0IGNvdW50cnkgPSBjb3VudHJpZXMuZmlsdGVyKGNvdW50cnkgPT4gY291bnRyeS5pc28yID09PSBpZCk7XG5cbiAgICByZW1vdmVBY3RpdmVDbGFzc0Zyb21SZWdpb25zKCk7XG5cbiAgICBpZiAoaXNJRCkgaXNJRC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICBlbHNlIGNsZWFySW50ZXJ2YWwodG8pOyBcblxuICAgIGlmIChjb3VudHJ5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVtb3ZlSW5mb0Jsb2NrKCk7XG4gICAgICAgIGxldCBpbmZvID0ge1xuICAgICAgICAgICAgYmdpOiBgaW1hZ2VzL2NvdW50cnlfcHJvZmlsZS8ke2lkfS5qcGdgLFxuICAgICAgICAgICAgbmFtZTogY291bnRyeVswXS5uYW1lLFxuICAgICAgICAgICAgaWQ6IGNvdW50cnlbMF0uaXNvMixcbiAgICAgICAgICAgIGNvdW50OiB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWNvdW50JykgPyB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWNvdW50JykgOiAwXG4gICAgICAgIH07XG4gICAgICAgIGlmIChNUVVFUlkubWF0Y2hlcykge1xuICAgICAgICAgICAgbGV0IGIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHt0YXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpfWApLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgbGV0IGJvdW5kID0ge1xuICAgICAgICAgICAgICAgIHg6IGIueCArIDQwLFxuICAgICAgICAgICAgICAgIHdpZHRoOiBiLndpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogYi5oZWlnaHQsXG4gICAgICAgICAgICAgICAgeTogdGFyZ2V0LmdldEJCb3goKS55IC0gKHRhcmdldC5nZXRCQm94KCkueSAvIDMpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVuZGVySW5mb0Jsb2NrKGluZm8sIGJvdW5kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBvZmZzZXRUb3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtZm9yLXBvaW50cy1tYXAnKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS55O1xuICAgICAgICAgICAgbGV0IGJhID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgbGV0IGJvdW5kRmluYWwgPSB7XG4gICAgICAgICAgICAgICAgeDogYmEueCxcbiAgICAgICAgICAgICAgICB3aWR0aDogYmEud2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBiYS5oZWlnaHQsXG4gICAgICAgICAgICAgICAgeTogYmEueSAtIG9mZnNldFRvcFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlbmRlckluZm9CbG9jayhpbmZvLCBib3VuZEZpbmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCByZWdpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuc3ZnbWFwX19yZWdpb25bZGF0YS1pZD1cIiR7aWR9XCJdYCk7XG5cbiAgICBpZiAocmVnaW9uKSB7XG4gICAgICAgIHJlZ2lvbi5zdHlsZS5hbmltYXRpb25EZWxheSA9ICcwbXMnO1xuICAgICAgICByZWdpb24uY2xhc3NMaXN0LmFkZCgncmV2ZXJzZScpO1xuICAgIH1cbn07XG5cbmNvbnN0IHJlbW92ZVBhdGhIb3ZlciA9IChlLCBpc0lEKSA9PiB7XG4gICAgbGV0IHRhcmdldCA9IGlzSUQgPyBpc0lEIDogZS5jdXJyZW50VGFyZ2V0O1xuICAgIGxldCBpZCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cbiAgICBsZXQgcmVnaW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnN2Z21hcF9fcmVnaW9uW2RhdGEtaWQ9XCIke2lkfVwiXWApO1xuICAgIHJlbW92ZUFjdGl2ZUNsYXNzRnJvbVJlZ2lvbnMoKTtcblxuICAgIGlmIChyZWdpb24pIHtcbiAgICAgICAgcmVnaW9uLnN0eWxlLmFuaW1hdGlvbkRlbGF5ID0gJzBtcyc7XG4gICAgICAgIHJlZ2lvbi5jbGFzc0xpc3QucmVtb3ZlKCdyZXZlcnNlJyk7XG4gICAgfVxuICAgIHJlbW92ZUluZm9CbG9jaygpO1xufTtcblxuY29uc3Qgc2V0UmFuZG9tSG92ZXIgPSAoKT0+IHtcbiAgICBsZXQgcmFuZG9tQ291bnRyeSA9IGNvdW50cmllc0NvdW50W3JhbmRvbUludEZyb21JbnRlcnZhbCgwLCBjb3VudHJpZXNDb3VudC5sZW5ndGgtMSldLmlkO1xuICAgIGxldCB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtyYW5kb21Db3VudHJ5LnRvTG93ZXJDYXNlKCl9YCk7XG4gICAgbGV0IHByZXYgPSB0YXJnZXQ7XG5cbiAgICByZW1vdmVQYXRoSG92ZXIobnVsbCwgdGFyZ2V0KTtcbiAgICBob3ZlclBhdGgobnVsbCwgdGFyZ2V0KTtcbiAgICB0byA9IHNldEludGVydmFsKCgpPT4ge1xuICAgICAgICBsZXQgcmFuZG9tQ291bnRyeTEgPSBjb3VudHJpZXNDb3VudFtyYW5kb21JbnRGcm9tSW50ZXJ2YWwoMCwgY291bnRyaWVzQ291bnQubGVuZ3RoLTEpXS5pZDtcbiAgICAgICAgbGV0IHRhcmdldDEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtyYW5kb21Db3VudHJ5MS50b0xvd2VyQ2FzZSgpfWApO1xuICAgICAgICByZW1vdmVQYXRoSG92ZXIobnVsbCwgcHJldik7XG4gICAgICAgIGhvdmVyUGF0aChudWxsLCB0YXJnZXQxKTtcbiAgICAgICAgcHJldiA9IHRhcmdldDE7XG4gICAgfSwgMzAwMCk7XG59O1xuXG5jb25zdCByZW1vdmVBY3RpdmVDbGFzc0Zyb21SZWdpb25zID0gKCk9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1hcHN2Zy1yZWdpb24nKS5mb3JFYWNoKChlKT0+IHtcbiAgICAgICAgZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9KTtcbn07XG5cbmNvbnN0IHJlbmRlckluZm9CbG9jayA9IChpbmZvLCBib3VuZCkgPT4ge1xuICAgIGxldCBibG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJsb2NrLmNsYXNzTmFtZSA9ICdzdmdtYXAnO1xuICAgIGJsb2NrLnNldEF0dHJpYnV0ZSgnaWQnLCAnaG92ZXJNYXBFbG1lbmV0Jyk7XG4gICAgYmxvY2suc3R5bGUubGVmdCA9IGAke2JvdW5kLnggKyAoYm91bmQud2lkdGggLyAyKX1weGA7XG4gICAgYmxvY2suc3R5bGUudG9wID0gYCR7Ym91bmQueSArIChib3VuZC5oZWlnaHQgLyAyKX1weGA7XG5cbiAgICBsZXQgbGVmdCA9IDA7XG4gICAgaWYgKGJvdW5kLnggKyAxMjUgKyhib3VuZC53aWR0aCAvIDIpID4gd2luZG93LmlubmVyV2lkdGgpIHtcbiAgICAgICAgbGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gKGJvdW5kLnggKyAxMjUpO1xuICAgIH1cblxuICAgIGlmIChpbmZvLmlkID09PSAndHInKSB7XG4gICAgICAgIGJsb2NrLnN0eWxlLmxlZnQgPSAgd2luZG93LmlubmVyV2lkdGggPCAxMjYwICYmIHdpbmRvdy5pbm5lcldpZHRoID4gTVNJWkUgPyBgJHtib3VuZC54ICsgMTB9cHhgIDogYCR7Ym91bmQueCAgLSA1MH1weGA7XG4gICAgfVxuXG4gICAgbGV0IHRyaWFuZ2xlTGVmdCA9IE1hdGguYWJzKGxlZnQpIC0gMTEgPiAxMDQgPyAxMDQgOiBNYXRoLmFicyhsZWZ0KSAtIDExO1xuXG4gICAgYmxvY2suaW5uZXJIVE1MID0gYDxkaXYgY2xhc3M9XCJzdmdtYXBfX2Jsb2NrXCIgc3R5bGU9XCJsZWZ0OiAke2xlZnQgKyAoLTEyNSl9cHg7XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzdmdtYXBfX2xvY2F0b3JcIiBzdHlsZT1cImxlZnQ6IGNhbGMoNTAlICsgJHtNYXRoLmFicyhsZWZ0KS0xMX1weClcIj48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInN2Z21hcF9faW1nXCIgc3R5bGU9XCIgYmFja2dyb3VuZC1pbWFnZTogdXJsKCcke2luZm8uYmdpfScpXCI+PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzdmdtYXBfX3RyaWFuZ2xlXCIgc3R5bGU9XCJsZWZ0OiBjYWxjKDUwJSArICR7dHJpYW5nbGVMZWZ0fXB4KVwiPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwic3ZnbWFwX190eHRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzdmdtYXBfX25hbWVcIj4ke2luZm8ubmFtZX08L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzdmdtYXBfX2NvdW50XCI+JHtpbmZvLmNvdW50fSBob3RlbHM8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+YDtcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1mb3ItcmVnaW9ucycpLmFwcGVuZENoaWxkKGJsb2NrKTtcbn07XG5cbmNvbnN0IHJlbW92ZUluZm9CbG9jayA9ICgpID0+IHtcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2hvdmVyTWFwRWxtZW5ldCcpKVxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaG92ZXJNYXBFbG1lbmV0JykucmVtb3ZlKCk7XG59O1xuXG5jb25zdCBnZXRDb3VudFBsYWNlc0J5UmVnaW9uID0gKHJlZ2lvbikgPT4ge1xuICAgIGxldCBib3VuZCA9IHJlZ2lvbi5nZXRCQm94KCk7XG5cbiAgICByZXR1cm4gcGFyc2VJbnQoKGJvdW5kLndpZHRoICogYm91bmQuaGVpZ2h0IC8gUExBQ0VfU0laRSkgLyAyKTtcbn07XG5cbmNvbnN0IHNldFBsYWNlc09uUmVnaW9uID0gKGNvdW50LCBib3VuZCwgaW5kZXgsIGlkKSA9PiB7XG4gICAgbGV0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgIGFyciA9IFtdO1xuXG4gICAgYmxvY2suY2xhc3NOYW1lID0gJ3N2Z21hcF9fcmVnaW9uJztcbiAgICBibG9jay5zdHlsZS5sZWZ0ID0gYCR7Ym91bmQueH1weGA7XG4gICAgYmxvY2suc3R5bGUudG9wID0gYCR7Ym91bmQueX1weGA7XG4gICAgYmxvY2suc3R5bGUud2lkdGggPSBgJHtib3VuZC53aWR0aH1weGA7XG4gICAgYmxvY2suc3R5bGUuaGVpZ2h0ID0gYCR7Ym91bmQuaGVpZ2h0fXB4YDtcbiAgICBibG9jay5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCBpZCk7XG4gICAgYmxvY2suc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybChcImltZy9jb3VudHJpZXNfcG9pbnRlcnMvJHtpZH0uc3ZnXCIpYDtcbiAgICBibG9jay5zdHlsZS5hbmltYXRpb25EZWxheSA9IGAke2luZGV4ICogMTV9bXNgO1xuXG4gICAgcmV0dXJuIGJsb2NrO1xufTtcblxuY29uc3QgaW5pdFBsYWNlcyA9ICgpID0+IHtcbiAgICBjb3VudHJpZXNDb3VudC5tYXAoKGUsaSk9PiB7XG4gICAgICAgIGxldCB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtlLmlkLnRvTG93ZXJDYXNlKCl9YCk7XG4gICAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RhdGEtY291bnQnLCBlLmNvdW50KTtcbiAgICAgICAgbGV0IG9mZnNldFRvcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1mb3ItcG9pbnRzLW1hcCcpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnk7XG4gICAgICAgIGxldCBib3VuZCA9IHRhcmdldC5nZXRCQm94KCk7XG4gICAgICAgIGxldCBiYSA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgbGV0IGJvdW5kRmluYWwgPSB7XG4gICAgICAgICAgICB4OiBiYS54LFxuICAgICAgICAgICAgd2lkdGg6IGJhLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBiYS5oZWlnaHQsXG4gICAgICAgICAgICB5OiBiYS55IC0gb2Zmc2V0VG9wXG4gICAgICAgIH07XG4gICAgICAgIGxldCBkaXYgPSBzZXRQbGFjZXNPblJlZ2lvbihnZXRDb3VudFBsYWNlc0J5UmVnaW9uKHRhcmdldCksIGJvdW5kRmluYWwsIGksIGUuaWQudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1mb3ItcG9pbnRzLW1hcCcpLmFwcGVuZENoaWxkKGRpdik7XG4gICAgfSk7XG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9wZXJhdG9yc1BhZ2UoKSB7XG4gICAgJChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcIi5wbGF5LWJ0blwiLCBfcG9wdXBGcmFtZU5vZGUpO1xufVxuXG5jb25zdCBfcG9wdXBGcmFtZU5vZGUgPSAoZSkgPT4ge1xuICAgIGxldCBpZCA9IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEteW91dHViZS1pZCcpO1xuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2F0Y2gtdmlkZW8nKSkge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2F0Y2gtdmlkZW8nKS5pbm5lckhUTUwgPSBgPGlmcmFtZSBpZD1cInl0aWZyYW1lXCIgc3JjPVwiLy93d3cueW91dHViZS1ub2Nvb2tpZS5jb20vZW1iZWQvJHtpZH0/YXV0b3BsYXk9MSZhbXA7YXV0b2hpZGU9MSZhbXA7Y29udHJvbHM9MSZzaG93aW5mbz0wJnJlbD0wXCIgYWxsb3dmdWxsc2NyZWVuPVwiXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIGZyYW1lYm9yZGVyPVwiMFwiPjwvaWZyYW1lPmA7XG4gICAgfVxufTsiLCJpbXBvcnQge2dldENvb2tpZSwgTVFVRVJZLCBzZXRDb29raWV9IGZyb20gXCIuL2NvbW1vblwiO1xuaW1wb3J0IG5vVWlTbGlkZXIgZnJvbSAnbm91aXNsaWRlcic7XG5cbmNvbnN0IG9wdGlvbnNDb3VudHJ5QXV0Y29tbGV0ZSA9IHtcblx0XG5cdGRhdGE6ICQuZm4uaW50bFRlbElucHV0LmdldENvdW50cnlEYXRhKCksXG5cdFxuXHRnZXRWYWx1ZTogXCJuYW1lXCIsXG5cdFxuXHRsaXN0OiB7XG5cdFx0bWF0Y2g6IHtcblx0XHRcdGVuYWJsZWQ6IHRydWVcblx0XHR9LFxuXHRcdG9uQ2hvb3NlRXZlbnQ6ICgpID0+IHtcblx0XHRcdCQoXCIjY29tcGFueS1jb3VudHJ5XCIpLmludGxUZWxJbnB1dChcInNldENvdW50cnlcIiwgJChcIiNjb21wYW55LWNvdW50cnlcIikuZ2V0U2VsZWN0ZWRJdGVtRGF0YSgpLmlzbzIpO1xuXHRcdH1cblx0fVxufTtcblxuY29uc3QgcG9wdXBIYW5kbGVycyA9ICgpID0+IHtcblx0JChcIiNjb21wYW55LWNvdW50cnlcIikub24oXCJjb3VudHJ5Y2hhbmdlXCIsIHNldFZhbHVlVG9Db3VudHJ5KTtcblx0XG5cdCQoZG9jdW1lbnQpXG5cdFx0Lm9uKCdjbGljaycsICcuanMtb3Blbi1wb3B1cCcsIG9wZW5Qb3B1cClcblx0XHQub24oJ2NsaWNrJywgJy5qcy1jbG9zZS1wb3B1cCcsIGNsb3NlUG9wdXApXG5cdFx0Lm9uKCdjbGljaycsICcuanMtc2VuZC1wb3B1cCcsIHNlbmRQb3B1cE1lc3NhZ2UpXG5cdFx0Lm9uKCdjbGljaycsICcucG9wdXAnLCAoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKSlcblx0XHQub24oJ2NsaWNrJywgJy5wb3B1cF9fYmcnLCBwb3B1cEJhY2tncm91bmRDbGljaylcblx0XHQub24oJ2lucHV0JywgJ3RleHRhcmVhJywgY29tbWVudEF1dG9TaXplKVxuXHRcdC5vbigna2V5dXAnLCAnaW5wdXQnLCBjaGVja0lucHV0VmFsdWUpXG5cdFx0Lm9uKCdjaGFuZ2UnLCAnLmpzLWlucHV0LXN0YXJzJywgY2hhbmdlU3RhcnMpXG5cdFx0Lm9uKCdpbnB1dCcsICcjcmFuZ2UtaW5wdXQtbWluJywgY2hhbmdlSW5wdXRSYW5nZSlcblx0XHQub24oJ2lucHV0JywgJyNyYW5nZS1pbnB1dC1tYXgnLCBjaGFuZ2VJbnB1dFJhbmdlKVxuXHRcdC5vbignY2hhbmdlJywgJy5qcy1yYWRpby1wb3B1cCcsIHRvZ2dsZVJhZGlvSGFuZGxlcik7XG5cdFxuXHRjaGVja0Nvb2tpZUJhbm5lcigpO1xuXHRpbml0TXVsdGlTbGlkZXIoKTtcbn07XG5cbmNvbnN0IHNlbmRQb3B1cE1lc3NhZ2UgPSAoZSkgPT4ge1xuXHRjbG9zZVBvcHVwKGUpO1xuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucG9wdXBfX3N1Y2Nlc3MnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbn07XG5cbmxldCBpbnB1dFRpbWVPdXQgPSBudWxsO1xuY29uc3QgY2hlY2tJbnB1dFZhbHVlID0gKGUpID0+IHtcblx0bGV0IGlucHV0ID0gZS5jdXJyZW50VGFyZ2V0O1xuXHRpZiAoaW5wdXQuZ2V0QXR0cmlidXRlKCduYW1lJykgPT09ICdyb29tcycpIHtcblx0XHRjbGVhclRpbWVvdXQoaW5wdXRUaW1lT3V0KTtcblx0XHRpbnB1dFRpbWVPdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdGxldCB2YWwgPSBwYXJzZUludChpbnB1dC52YWx1ZSk7XG5cdFx0XHRcblx0XHRcdGlmICh2YWwgPj0gMjApIHtcblx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWVycm9yLXJvb21zJykuaW5uZXJIVE1MID0gJyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtZXJyb3Itcm9vbXMnKS5pbm5lckhUTUwgPSAnV2UgY29vcGVyYXRlIG9ubHkgd2l0aCBob3RlbCAyMCsgcm9vbXMuJztcblx0XHRcdH1cblx0XHR9LCAxMDApO1xuXHR9XG59O1xuXG5sZXQgY3VycmVudFRvcFdpbmRvdyA9IDA7XG5cbmNvbnN0IGNoYW5nZVN0YXJzID0gKGUpID0+IHtcblx0bGV0IHN0YXJzID0gZS5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWx1ZScpO1xuXHRcblx0ZS5jdXJyZW50VGFyZ2V0LmNsb3Nlc3QoJy5wb3B1cCcpLnF1ZXJ5U2VsZWN0b3JBbGwoJy5wb3B1cF9fY2hlY2tib3gnKS5mb3JFYWNoKChlbG0sIGkpID0+IHtcblx0XHRlbG0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0ZWxtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykuY2hlY2tlZCA9IGZhbHNlO1xuXHRcdC8vIGlmIChpKzEgIT0gc3RhcnMpXG5cdFx0Ly9cblx0XHQvL1xuXHRcdC8vIGlmIChpKzEgPD0gc3RhcnMgJiYgZS5jdXJyZW50VGFyZ2V0LmNoZWNrZWQpIHtcblx0XHQvLyAgICAgZWxtLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdC8vIH0gZWxzZSB7XG5cdFx0Ly8gICAgIGVsbS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHQvLyB9XG5cdH0pO1xuXHRlLmN1cnJlbnRUYXJnZXQuY2hlY2tlZCA9IHRydWU7XG5cdGUuY3VycmVudFRhcmdldC5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xufTtcblxuY29uc3QgdG9nZ2xlUmFkaW9IYW5kbGVyID0gKGUpID0+IHtcblx0bGV0IGN1cnIgPSBlLmN1cnJlbnRUYXJnZXQudmFsdWU7XG5cdGNvbnNvbGUubG9nKGN1cnIpO1xuXHRcblx0aWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1zaG93LXJhZGlvJykpXG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXNob3ctcmFkaW8nKS5zdHlsZS5kaXNwbGF5ID0gY3VyciA9PT0gJ3RydWUnID8gJ2Jsb2NrJzogJ25vbmUnO1xuXHRcbn07XG5cbmNvbnN0IG9wZW5Qb3B1cCA9IChlKSA9PiB7XG5cdGxldCBkYXRhID0gZS5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1wb3B1cCcpO1xuXHRpZiAoTVFVRVJZLm1hdGNoZXMpIHtcblx0XHRjdXJyZW50VG9wV2luZG93ID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5jbGFzc0xpc3QuYWRkKCdmaXhJdCcpO1xuXHR9XG5cdFxuXHQkKCcjY29tcGFueS1jb3VudHJ5JykuaW50bFRlbElucHV0KHtcblx0XHRpbml0aWFsQ291bnRyeTogXCJhdXRvXCIsXG5cdFx0Z2VvSXBMb29rdXA6IGdldENvdW50cnlCeUlQLFxuXHRcdGN1c3RvbVBsYWNlaG9sZGVyOiBmdW5jdGlvbiAoc2VsZWN0ZWRDb3VudHJ5UGxhY2Vob2xkZXIsIHNlbGVjdGVkQ291bnRyeURhdGEpIHtcblx0XHRcdHJldHVybiBzZWxlY3RlZENvdW50cnlEYXRhLm5hbWU7XG5cdFx0fSxcblx0XHRwcmVmZXJyZWRDb3VudHJpZXM6IFtdXG5cdH0pO1xuXHQvLyAkKFwiI2NvbXBhbnktY291bnRyeVwiKS5lYXN5QXV0b2NvbXBsZXRlKG9wdGlvbnNDb3VudHJ5QXV0Y29tbGV0ZSk7XG5cdFxuXHQkKCcjY29tcGFueS1waG9uZScpLmludGxUZWxJbnB1dCh7XG5cdFx0aW5pdGlhbENvdW50cnk6IFwiYXV0b1wiLFxuXHRcdGdlb0lwTG9va3VwOiBnZXRDb3VudHJ5QnlJUCxcblx0XHRwcmVmZXJyZWRDb3VudHJpZXM6IFtdLFxuXHRcdHNlcGFyYXRlRGlhbENvZGU6IHRydWVcblx0fSk7XG5cdFxuXHQkKCcjaG90ZWwtcGhvbmUnKS5pbnRsVGVsSW5wdXQoe1xuXHRcdGluaXRpYWxDb3VudHJ5OiBcImF1dG9cIixcblx0XHRnZW9JcExvb2t1cDogZ2V0Q291bnRyeUJ5SVAsXG5cdFx0cHJlZmVycmVkQ291bnRyaWVzOiBbXSxcblx0XHRzZXBhcmF0ZURpYWxDb2RlOiB0cnVlXG5cdH0pO1xuXHRcblx0JCgnI3BlcnNvbmFsLXBob25lJykuaW50bFRlbElucHV0KHtcblx0XHRpbml0aWFsQ291bnRyeTogXCJhdXRvXCIsXG5cdFx0Z2VvSXBMb29rdXA6IGdldENvdW50cnlCeUlQLFxuXHRcdHByZWZlcnJlZENvdW50cmllczogW10sXG5cdFx0c2VwYXJhdGVEaWFsQ29kZTogdHJ1ZVxuXHR9KTtcblx0XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5wb3B1cF9fJHtkYXRhfWApLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xufTtcblxuY29uc3QgY2xvc2VQb3B1cCA9IChlKSA9PiB7XG5cdGxldCB0YXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQ7XG5cdGlmIChNUVVFUlkubWF0Y2hlcykge1xuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5jbGFzc0xpc3QucmVtb3ZlKCdmaXhJdCcpO1xuXHRcdHdpbmRvdy5zY3JvbGxUbygwLCBjdXJyZW50VG9wV2luZG93KTtcblx0fVxuXHQkKCcjY29tcGFueS1jb3VudHJ5JykuaW50bFRlbElucHV0KCdkZXN0cm95Jyk7XG5cdFxuXHR0YXJnZXQuY2xvc2VzdCgnLnBvcHVwJykucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKS5mb3JFYWNoKChlKSA9PiBlLnZhbHVlID0gJycpO1xuXHR0YXJnZXQuY2xvc2VzdCgnLnBvcHVwX19iZycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG59O1xuXG5jb25zdCBwb3B1cEJhY2tncm91bmRDbGljayA9IChlKSA9PiB7XG5cdGxldCBmaWxlZCA9IGZhbHNlLFxuXHRcdGlucHV0cyA9IGUuY3VycmVudFRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpub3QoW3R5cGU9XCJjaGVja2JveFwiXSknKTtcblx0Zm9yIChsZXQgaSBpbiBpbnB1dHMpIHtcblx0XHRpZiAoaW5wdXRzW2ldLnZhbHVlXG5cdFx0XHQmJiBpbnB1dHNbaV0udmFsdWUubGVuZ3RoICE9PSAwXG5cdFx0XHQmJiBpbnB1dHNbaV0uZ2V0QXR0cmlidXRlKCduYW1lJykgIT09ICdjb3VudHJ5Jykge1xuXHRcdFx0ZmlsZWQgPSB0cnVlO1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cdFxuXHRpZiAoIWZpbGVkKSB7XG5cdFx0JCgnI2NvbXBhbnktY291bnRyeScpLmludGxUZWxJbnB1dCgnZGVzdHJveScpO1xuXHRcdFxuXHRcdGUuY3VycmVudFRhcmdldC5xdWVyeVNlbGVjdG9yKCcucG9wdXAnKS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpLmZvckVhY2goKGUpID0+IGUudmFsdWUgPSAnJyk7XG5cdFx0ZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdH1cblx0XG59O1xuXG5jb25zdCBnZXRDb3VudHJ5QnlJUCA9IChjYWxsYmFjaykgPT4ge1xuXHRpZiAoZ2V0Q29va2llKCdjdXJyZW50Q291bnRyeScpICYmIGdldENvb2tpZSgnY3VycmVudENvdW50cnknKS5sZW5ndGggPiAwKSB3aW5kb3cuY3VycmVudENvdW50cnkgPSBnZXRDb29raWUoJ2N1cnJlbnRDb3VudHJ5Jyk7XG5cdFxuXHRpZiAod2luZG93LmN1cnJlbnRDb3VudHJ5KSB7XG5cdFx0XG5cdFx0Y2FsbGJhY2sod2luZG93LmN1cnJlbnRDb3VudHJ5KTtcblx0fSBlbHNlIHtcblx0XHQkLmdldCgnaHR0cHM6Ly9pcGluZm8uaW8nLCBmdW5jdGlvbiAoKSB7XG5cdFx0fSwgXCJqc29ucFwiKS5hbHdheXMoZnVuY3Rpb24gKHJlc3ApIHtcblx0XHRcdGlmIChyZXNwLnN0YXR1cyAhPT0gNDA0KSB7XG5cdFx0XHRcdGxldCBjb3VudHJ5Q29kZSA9IChyZXNwICYmIHJlc3AuY291bnRyeSkgPyByZXNwLmNvdW50cnkgOiBcIlwiO1xuXHRcdFx0XHR3aW5kb3cuY3VycmVudENvdW50cnkgPSBjb3VudHJ5Q29kZTtcblx0XHRcdFx0c2V0Q29va2llKCdjdXJyZW50Q291bnRyeScsIGNvdW50cnlDb2RlLCAzMCk7XG5cdFx0XHRcdGNhbGxiYWNrKGNvdW50cnlDb2RlKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufTtcblxuY29uc3Qgc2V0VmFsdWVUb0NvdW50cnkgPSAoZSwgY291bnRyeURhdGEpID0+IHtcblx0ZS5jdXJyZW50VGFyZ2V0LnZhbHVlID0gY291bnRyeURhdGEubmFtZTtcblx0aWYgKGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09ICdjb21wYW55LWNvdW50cnknKSB7XG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHQkKGUuY3VycmVudFRhcmdldCkuYmx1cigpO1xuXHRcdH0pO1xuXHR9XG59O1xuXG5jb25zdCByZW5kZXJDb29raWVCYW5uZXIgPSAoKSA9PiB7XG5cdGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0ZGl2LmNsYXNzTmFtZSA9ICdjb29raWVzLWJhbm5lcic7XG5cdGRpdi5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2Nvb2tpZXMtYmFubmVyJyk7XG5cdGRpdi5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPjxkaXYgY2xhc3M9XCJjb29raWVzLWJhbm5lcl9fY2xvc2VcIj48L2Rpdj5cXG4nICtcblx0XHQnPHA+VGhpcyBzaXRlIHVzZXMgY29va2llcy4gQnkgY29udGludWluZyB0byBicm93c2UgdGhlIHNpdGUgeW91IGFyZSBhZ3JlZWluZyB0byBvdXIgdXNlIG9mIGNvb2tpZXMuIDxhIHRhcmdldD1cIl9ibGFua1wiXFxuIGhyZWY9XCJodHRwOi8vZWMuZXVyb3BhLmV1L2lwZy9iYXNpY3MvbGVnYWwvY29va2llcy9pbmRleF9lbi5odG1cIj5GaW5kIG91dCBtb3JlIGFib3V0IGNvb2tpZSBoZXJlPC9hPjwvcD48L2Rpdj4nO1xuXHRkaXYucXVlcnlTZWxlY3RvcignLmNvb2tpZXMtYmFubmVyX19jbG9zZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VDb29raWVCYW5uZXIpO1xuXHRcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpLmluc2VydEJlZm9yZShkaXYsIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKSk7XG59O1xuXG5jb25zdCBjbG9zZUNvb2tpZUJhbm5lciA9ICgpID0+IHtcblx0c2V0Q29va2llKCdjb29raWUtYmFubmVyJywgdHJ1ZSwgMzY1KTtcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Nvb2tpZXMtYmFubmVyJykucmVtb3ZlKCk7XG59O1xuXG5jb25zdCBjaGVja0Nvb2tpZUJhbm5lciA9ICgpID0+IHtcblx0aWYgKCFnZXRDb29raWUoJ2Nvb2tpZS1iYW5uZXInKSlcblx0XHRyZW5kZXJDb29raWVCYW5uZXIoKTtcbn07XG5cbmNvbnN0IGNvbW1lbnRBdXRvU2l6ZSA9IChlKSA9PiB7XG5cdGxldCBlbCA9IGUuY3VycmVudFRhcmdldDtcblx0XG5cdGVsLnN0eWxlLmhlaWdodCA9ICdhdXRvJztcblx0ZWwuc3R5bGUuaGVpZ2h0ID0gZWwuc2Nyb2xsSGVpZ2h0ICsgJ3B4Jztcbn07XG5cbmNvbnN0IGNoYW5nZVJhbmdlU2xpZGVyID0gKHZhbHVlcykgPT4ge1xuXHRsZXQgaW5wdXRNaW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmFuZ2UtaW5wdXQtbWluJyk7XG5cdGxldCBpbnB1dE1heCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyYW5nZS1pbnB1dC1tYXgnKTtcblx0XG5cdGlucHV0TWluLnZhbHVlID0gcGFyc2VJbnQodmFsdWVzWzBdKTtcblx0aW5wdXRNYXgudmFsdWUgPSBwYXJzZUludCh2YWx1ZXNbMV0pO1xufTtcblxubGV0IHN0ID0gbnVsbDtcbmNvbnN0IGNoYW5nZUlucHV0UmFuZ2UgPSAoZSkgPT4ge1xuXHRjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXVsdGktcmFuZ2UnKTtcblx0bGV0IGN1cnJlbnQgPSBlLmN1cnJlbnRUYXJnZXQ7XG5cdGxldCBtaW4gPSBwYXJzZUludChjdXJyZW50LmdldEF0dHJpYnV0ZSgnbWluJykpLFxuXHRcdG1heCA9IHBhcnNlSW50KGN1cnJlbnQuZ2V0QXR0cmlidXRlKCdtYXgnKSk7XG5cdGxldCBpbnB1dE1pbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyYW5nZS1pbnB1dC1taW4nKTtcblx0bGV0IGlucHV0TWF4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JhbmdlLWlucHV0LW1heCcpO1xuXHRcblx0Y2xlYXJUaW1lb3V0KHN0KTtcblx0c3QgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRjb25zb2xlLmxvZyhjdXJyZW50LnZhbHVlKTtcblx0XHRpZiAoY3VycmVudCA9PT0gaW5wdXRNaW4pIHtcblx0XHRcdGlmIChwYXJzZUludChjdXJyZW50LnZhbHVlKSA+IHBhcnNlSW50KGlucHV0TWF4LnZhbHVlKSlcblx0XHRcdFx0Y3VycmVudC52YWx1ZSA9IGlucHV0TWF4LnZhbHVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAocGFyc2VJbnQoY3VycmVudC52YWx1ZSkgPCBwYXJzZUludChpbnB1dE1pbi52YWx1ZSkpXG5cdFx0XHRcdGN1cnJlbnQudmFsdWUgPSBpbnB1dE1pbi52YWx1ZTtcblx0XHR9XG5cdFx0XG5cdFx0aWYgKHBhcnNlSW50KGN1cnJlbnQudmFsdWUpIDwgbWluIHx8IHBhcnNlSW50KGN1cnJlbnQudmFsdWUpID4gbWF4IHx8IGlzTmFOKHBhcnNlSW50KGN1cnJlbnQudmFsdWUpKSkge1xuXHRcdFx0Y3VycmVudC52YWx1ZSA9IGN1cnJlbnQuZ2V0QXR0cmlidXRlKCdpZCcpID09PSAncmFuZ2UtaW5wdXQtbWluJyA/IG1pbiA6IG1heDtcblx0XHR9XG5cdFx0XG5cdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KFtpbnB1dE1pbi52YWx1ZSwgaW5wdXRNYXgudmFsdWVdKTtcblx0fSwgNTAwKTtcblx0XG59O1xuXG5jb25zdCBpbml0TXVsdGlTbGlkZXIgPSAoKSA9PiB7XG5cdGxldCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXVsdGktcmFuZ2UnKTtcblx0bGV0IHdyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucG9wdXBfX3JhbmdlLXdyYXBwZXInKTtcblx0XG5cdGlmIChzbGlkZXIgJiYgd3JhcCkge1xuXHRcdFxuXHRcdGxldCBtaW4gPSBwYXJzZUludCh3cmFwLmdldEF0dHJpYnV0ZSgnZGF0YS1taW4nKSk7XG5cdFx0bGV0IG1heCA9IHBhcnNlSW50KHdyYXAuZ2V0QXR0cmlidXRlKCdkYXRhLW1heCcpKTtcblx0XHRcblx0XHRub1VpU2xpZGVyLmNyZWF0ZShzbGlkZXIsIHtcblx0XHRcdHN0YXJ0OiBbbWluICsgMzAsIG1heCAtIDMwXSxcblx0XHRcdHN0ZXA6IDUsXG5cdFx0XHRjb25uZWN0OiB0cnVlLFxuXHRcdFx0cmFuZ2U6IHtcblx0XHRcdFx0J21pbic6IG1pbixcblx0XHRcdFx0J21heCc6IG1heFxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdFxuXHRcdGNoYW5nZVJhbmdlU2xpZGVyKFttaW4gKyAzMCwgbWF4IC0gMzBdKTtcblx0XHRcblx0XHRzbGlkZXIubm9VaVNsaWRlci5vbignY2hhbmdlJywgY2hhbmdlUmFuZ2VTbGlkZXIpO1xuXHR9XG59O1xuXG5cbmV4cG9ydCBkZWZhdWx0IHBvcHVwSGFuZGxlcnM7Il0sInByZUV4aXN0aW5nQ29tbWVudCI6Ii8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlpY205M2MyVnlMWEJoWTJzdlgzQnlaV3gxWkdVdWFuTWlMQ0p1YjJSbFgyMXZaSFZzWlhNdmJHOWtZWE5vTDE5VGVXMWliMnd1YW5NaUxDSnViMlJsWDIxdlpIVnNaWE12Ykc5a1lYTm9MMTlpWVhObFIyVjBWR0ZuTG1weklpd2libTlrWlY5dGIyUjFiR1Z6TDJ4dlpHRnphQzlmWm5KbFpVZHNiMkpoYkM1cWN5SXNJbTV2WkdWZmJXOWtkV3hsY3k5c2IyUmhjMmd2WDJkbGRGSmhkMVJoWnk1cWN5SXNJbTV2WkdWZmJXOWtkV3hsY3k5c2IyUmhjMmd2WDI5aWFtVmpkRlJ2VTNSeWFXNW5MbXB6SWl3aWJtOWtaVjl0YjJSMWJHVnpMMnh2WkdGemFDOWZjbTl2ZEM1cWN5SXNJbTV2WkdWZmJXOWtkV3hsY3k5c2IyUmhjMmd2WkdWaWIzVnVZMlV1YW5NaUxDSnViMlJsWDIxdlpIVnNaWE12Ykc5a1lYTm9MMmx6VDJKcVpXTjBMbXB6SWl3aWJtOWtaVjl0YjJSMWJHVnpMMnh2WkdGemFDOXBjMDlpYW1WamRFeHBhMlV1YW5NaUxDSnViMlJsWDIxdlpIVnNaWE12Ykc5a1lYTm9MMmx6VTNsdFltOXNMbXB6SWl3aWJtOWtaVjl0YjJSMWJHVnpMMnh2WkdGemFDOXViM2N1YW5NaUxDSnViMlJsWDIxdlpIVnNaWE12Ykc5a1lYTm9MM1J2VG5WdFltVnlMbXB6SWl3aWJtOWtaVjl0YjJSMWJHVnpMMjV2ZFdsemJHbGtaWEl2WkdsemRISnBZblYwWlM5dWIzVnBjMnhwWkdWeUxtcHpJaXdpYzNKakwycHpMMkZpYjNWMExtcHpJaXdpYzNKakwycHpMMkZ3Y0M1cWN5SXNJbk55WXk5cWN5OWpiMjF0YjI0dWFuTWlMQ0p6Y21NdmFuTXZiV0Z3TG1weklpd2ljM0pqTDJwekwyOXdaWEpoZEc5eWN5NXFjeUlzSW5OeVl5OXFjeTl3YjNCMWNDNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVR0QlEwRkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlEwNUJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN096dEJRelZDUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96czdPMEZEU2tFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVNNVEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVOMFFrRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZEVkVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVNNVRFRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVNdlFrRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUXpkQ1FUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZETjBKQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVTjJRa0U3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZEYkVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN096czdPenM3T3p0QlEzWTFSVUU3TzBGQlJVOHNTVUZCVFN3MFJFRkJNRUlzVTBGQk1VSXNkVUpCUVRCQ0xFZEJRVXM3UVVGRGVFTXNVVUZCU1N4dFFrRkJiVUlzUlVGQmRrSTdRVUZEUVN4UlFVRkpMRk5CUVZNc2JVSkJRVzFDTEU5QlFVOHNWVUZCZGtNN1FVRkRRU3hSUVVGSkxGRkJRVkVzYlVKQlFXMUNMRTlCUVU4c1YwRkJkRU03TzBGQlJVRXNVVUZCU1N4RFFVRkRMSEZDUVVGaExHTkJRV0lzU1VGQmRVSXNZMEZCZGtJc1NVRkJhVU1zWTBGQmJFTXNTMEZCTmtNc1UwRkJVeXhoUVVGVUxFTkJRWFZDTEdWQlFYWkNMRU5CUVdwRUxFVkJRMGtzVTBGQlV5eG5Ra0ZCVkN4RFFVRXdRaXhsUVVFeFFpeEZRVUV5UXl4UFFVRXpReXhEUVVGdFJEdEJRVUZCTEdWQlFVc3NSVUZCUlN4VFFVRkdMRU5CUVZrc1IwRkJXaXhEUVVGblFpeFRRVUZvUWl4RFFVRk1PMEZCUVVFc1MwRkJia1E3TzBGQlJVb3NVVUZCU1N4SlFVRkpMRXRCUVZJc1EwRlNkME1zUTBGUmVrSTdPMEZCUldZc1VVRkJTU3hEUVVGRExHVkJRVThzVDBGQlVpeEpRVUZ0UWl4RFFVRjJRaXhGUVVFd1FqdEJRVU4wUWl4bFFVRlBMR2RDUVVGUUxFTkJRWGRDTEZkQlFYaENMRVZCUVhGRExGVkJRVU1zUTBGQlJDeEZRVUZOTzBGQlEzWkRMR2RDUVVGSkxGRkJRVkVzUlVGQlJTeExRVUZHTEVkQlFWY3NUMEZCVHl4VlFVRlFMRWRCUVc5Q0xFTkJRVE5ETzBGQlEwRXNaMEpCUVVrc1VVRkJVU3hGUVVGRkxFdEJRVVlzUjBGQlZ5eFBRVUZQTEZkQlFWQXNSMEZCY1VJc1EwRkJOVU03UVVGRFFTeG5Ra0ZCU1N4WlFVRlpMRkZCUVZFc1MwRkJVaXhIUVVGblFpeERRVUZETEVOQlFXcENMRWRCUVhGQ0xFVkJRWEpETzBGQlEwRXNaMEpCUVVrc1dVRkJXU3hUUVVGVExFdEJRVlFzUjBGQmFVSXNRMEZCUXl4RFFVRnNRaXhIUVVGelFpeEZRVUYwUXp0QlFVTkJMSEZDUVVGVExHRkJRVlFzUTBGQmRVSXNaVUZCZGtJc1JVRkJkME1zUzBGQmVFTXNRMEZCT0VNc2EwSkJRVGxETEcxQ1FVRnBSaXhUUVVGcVJpeDFRa0ZCTkVjc1UwRkJOVWM3TzBGQlJVRXNjVUpCUVZNc1owSkJRVlFzUTBGQk1FSXNaMEpCUVRGQ0xFVkJRVFJETEU5QlFUVkRMRU5CUVc5RUxGVkJRVU1zUTBGQlJDeEZRVUZITEVOQlFVZ3NSVUZCVVR0QlFVTjRSQ3h2UWtGQlNTeEpRVUZKTEZGQlFWRXNTMEZCVWl4SFFVRm5RaXhEUVVGRExFTkJRV3BDTEVsQlFYTkNMRXRCUVVzc1NVRkJSU3hEUVVFM1FpeERRVUZTTzBGQlEwRXNhMEpCUVVVc1MwRkJSaXhEUVVGUkxGTkJRVklzWlVGQk9FSXNRMEZCT1VJc1lVRkJkVU1zUlVGQlJTeFpRVUZHTEVOQlFXVXNWMEZCWml4RFFVRjJRenRCUVVOSUxHRkJTRVE3UVVGSlNDeFRRVmhFTzBGQldVZzdRVUZEU2l4RFFYaENUVHM3T3pzN1FVTkdVRHM3UVVGRFFUczdRVUZEUVRzN096dEJRVU5CT3p0QlFVTkJPenM3T3pzN1FVRkZRU3hEUVVGRExGbEJRVms3UVVGRFZEdEJRVU5CTEZkQlFVOHNaMEpCUVZBc1EwRkJkMElzVVVGQmVFSXNSVUZCYTBNc2IwSkJRV3hETzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3hOUVVGRkxHTkJRVVlzUlVGQmEwSXNSVUZCYkVJc1EwRkJjVUlzVDBGQmNrSXNSVUZCT0VJc2IwSkJRVGxDTzBGQlEwZ3NRMEZTUkRzN096czdPenM3TzFGRGJVTm5RaXhUTEVkQlFVRXNVenRSUVU5QkxGTXNSMEZCUVN4VE8xRkJOa0pCTEZrc1IwRkJRU3haTzFGQlVVRXNjVUlzUjBGQlFTeHhRanM3UVVGeVJtaENPenM3T3pzN1FVRkhUeXhKUVVGTkxEQkNRVUZUTEU5QlFVOHNWVUZCVUN4RFFVRnJRaXdyUWtGQmJFSXNRMEZCWmp0QlFVTkJMRWxCUVUwc2QwSkJRVkVzUjBGQlpEdEJRVU5CTEVsQlFVMHNaME5CUVZrc1ZVRkJWU3hUUVVGV0xFTkJRVzlDTEZkQlFYQkNMRWRCUVd0RExFOUJRV3hETEVOQlFUQkRMRk5CUVRGRExFbEJRWFZFTEVOQlFVTXNRMEZCTVVVN1FVRkRRU3hKUVVGTkxEQkNRVUZUTEZkQlFWY3NTVUZCV0N4RFFVRm5RaXhWUVVGVkxGTkJRVEZDTEVOQlFXWTdRVUZEUVN4SlFVRk5MREJDUVVGUkxGVkJRVlVzU1VGQlZpeERRVUZsTEZWQlFWVXNVMEZCZWtJc1MwRkJkVU1zVjBGQlZ5eEpRVUZZTEVOQlFXZENMRlZCUVZVc1UwRkJNVUlzUTBGQmNrUTdRVUZEUVN4SlFVRk5MREJDUVVGVExHRkJRV0VzU1VGQllpeERRVUZyUWl4VlFVRlZMRk5CUVRWQ0xFTkJRV1k3TzBGQlJWQXNTVUZCVFN4M1FrRkJkMElzVTBGQmVFSXNjVUpCUVhkQ0xFTkJRVU1zUjBGQlJDeEZRVUZOTEUxQlFVNHNSVUZCWXl4SlFVRmtMRVZCUVhWQ08wRkJRMnBFTEZGQlFVa3NVMEZCVXl4UFFVRlBMRTlCUVU4c1YwRkJVQ3hIUVVGeFFpeEhRVUUxUWl4SFFVRnJReXhQUVVGUExGZEJRWFJFTzBGQlEwRXNVVUZCU1N4VlFVRlZMRWxCUVVrc2NVSkJRVW9zUjBGQk5FSXNSMEZCTlVJc1IwRkJhME1zVFVGQmFFUXNSVUZCZDBRc1QwRkJUeXhKUVVGUUxFTkJRWGhFTEV0QlEwc3NTVUZCU1N4RFFVRkRMRTFCUVV3c1JVRkJZVHRCUVVOa0xGbEJRVWtzUTBGQlF5eFRRVUZUTEdGQlFWUXNRMEZCZFVJc1IwRkJka0lzUTBGQlRDeEZRVUZyUXl4UFFVRlBMRXRCUVZBc1EwRkJiRU1zUzBGRFN5eEpRVUZKTEZOQlFWTXNZVUZCVkN4RFFVRjFRaXhIUVVGMlFpeEZRVUUwUWl4eFFrRkJOVUlzUjBGQmIwUXNSMEZCY0VRc1IwRkJNRVFzVFVGQk9VUXNSVUZCYzBVc1QwRkJUeXhKUVVGUU8wRkJRemxGTzBGQlEwb3NRMEZRUkRzN1FVRlRRU3hKUVVGTkxITkNRVUZ6UWl4VFFVRjBRaXh0UWtGQmMwSXNRMEZCUXl4SFFVRkVMRVZCUVUwc1RVRkJUaXhGUVVGakxFbEJRV1FzUlVGQmRVSTdRVUZETDBNc1VVRkJTU3hWUVVGVkxITkNRVUZ6UWl4SFFVRjBRaXhGUVVFeVFpeE5RVUV6UWl4RlFVRnRReXhKUVVGdVF5eERRVUZrTEVWQlFYZEVMRWxCUVVrc1UwRkJTaXhEUVVGakxFZEJRV1FzUTBGQmEwSXNVVUZCYkVJc1JVRkJlRVFzUzBGRFN5eEpRVUZKTEVOQlFVTXNUVUZCUkN4SlFVRlhMSE5DUVVGelFpeEhRVUYwUWl4RlFVRXlRaXhKUVVFelFpeEZRVUZwUXl4SlFVRnFReXhEUVVGbUxFVkJRWFZFTEZOQlFWTXNZVUZCVkN4RFFVRjFRaXhIUVVGMlFpeEZRVUUwUWl4VFFVRTFRaXhEUVVGelF5eEhRVUYwUXl4RFFVRXdReXhSUVVFeFF6dEJRVU12UkN4RFFVaEVPenRCUVUxQkxFbEJRVTBzZFVKQlFYVkNMRk5CUVhaQ0xHOUNRVUYxUWl4SFFVRk5PMEZCUXk5Q0xHRkJRVk1zWjBKQlFWUXNRMEZCTUVJc1owSkJRVEZDTEVWQlFUUkRMRTlCUVRWRExFTkJRVzlFTEZWQlFVTXNRMEZCUkN4RlFVRlBPMEZCUTNaRUxEUkNRVUZ2UWl4RFFVRndRaXhGUVVGMVFpeEpRVUYyUWl4RlFVRTJRaXhKUVVFM1FqdEJRVU5JTEV0QlJrUTdRVUZIU0N4RFFVcEVPenRCUVZGUExFbEJRVTBzYzBOQlFXVXNkMEpCUVZNc1dVRkJUVHRCUVVOMlF5eFhRVUZQTEhGQ1FVRlFMRU5CUVRaQ0xGbEJRVTA3UVVGREwwSTdRVUZEU0N4TFFVWkVPMEZCUjBnc1EwRktNa0lzUlVGSmVrSXNSVUZLZVVJc1EwRkJja0k3TzBGQlVVRXNVMEZCVXl4VFFVRlVMRU5CUVcxQ0xFbEJRVzVDTEVWQlFYbENPMEZCUXpWQ0xGRkJRVWtzVlVGQlZTeFRRVUZUTEUxQlFWUXNRMEZCWjBJc1MwRkJhRUlzUTBGQmMwSXNTVUZCU1N4TlFVRktMRU5CUTJoRExHRkJRV0VzUzBGQlN5eFBRVUZNTEVOQlFXRXNPRUpCUVdJc1JVRkJOa01zVFVGQk4wTXNRMEZCWWl4SFFVRnZSU3hWUVVSd1F5eERRVUYwUWl4RFFVRmtPMEZCUjBFc1YwRkJUeXhWUVVGVkxHMUNRVUZ0UWl4UlFVRlJMRU5CUVZJc1EwRkJia0lzUTBGQlZpeEhRVUV5UXl4VFFVRnNSRHRCUVVOSU96dEJRVVZOTEZOQlFWTXNVMEZCVkN4RFFVRnRRaXhKUVVGdVFpeEZRVUY1UWl4TFFVRjZRaXhGUVVGblF5eFBRVUZvUXl4RlFVRjVRenRCUVVNMVF5eGpRVUZWTEZkQlFWY3NSVUZCY2tJN08wRkJSVUVzVVVGQlNTeFZRVUZWTEZGQlFWRXNUMEZCZEVJN08wRkJSVUVzVVVGQlNTeFBRVUZQTEU5QlFWQXNTVUZCYTBJc1VVRkJiRUlzU1VGQk9FSXNUMEZCYkVNc1JVRkJNa003UVVGRGRrTXNXVUZCU1N4SlFVRkpMRWxCUVVrc1NVRkJTaXhGUVVGU08wRkJRMEVzVlVGQlJTeFBRVUZHTEVOQlFWVXNSVUZCUlN4UFFVRkdMRXRCUVdNc1ZVRkJWU3hKUVVGc1F6dEJRVU5CTEd0Q1FVRlZMRkZCUVZFc1QwRkJVaXhIUVVGclFpeERRVUUxUWp0QlFVTklPMEZCUTBRc1VVRkJTU3hYUVVGWExGRkJRVkVzVjBGQmRrSXNSVUZCYjBNN1FVRkRhRU1zWjBKQlFWRXNUMEZCVWl4SFFVRnJRaXhSUVVGUkxGZEJRVklzUlVGQmJFSTdRVUZEU0RzN1FVRkZSQ3haUVVGUkxHMUNRVUZ0UWl4TFFVRnVRaXhEUVVGU096dEJRVVZCTEZGQlFVa3NaMEpCUVdkQ0xFOUJRVThzUjBGQlVDeEhRVUZoTEV0QlFXcERPenRCUVVWQkxGTkJRVXNzU1VGQlNTeFJRVUZVTEVsQlFYRkNMRTlCUVhKQ0xFVkJRVGhDTzBGQlF6RkNMSGxDUVVGcFFpeFBRVUZQTEZGQlFYaENPMEZCUTBFc1dVRkJTU3haUVVGWkxGRkJRVkVzVVVGQlVpeERRVUZvUWp0QlFVTkJMRmxCUVVrc1kwRkJZeXhKUVVGc1FpeEZRVUYzUWp0QlFVTndRaXcyUWtGQmFVSXNUVUZCVFN4VFFVRjJRanRCUVVOSU8wRkJRMG83TzBGQlJVUXNZVUZCVXl4TlFVRlVMRWRCUVd0Q0xHRkJRV3hDTzBGQlEwZzdPMEZCUlUwc1UwRkJVeXhaUVVGVUxFTkJRWE5DTEVOQlFYUkNMRVZCUVhsQ08wRkJRelZDTEUxQlFVVXNZMEZCUmpzN1FVRkZRU3hOUVVGRkxGbEJRVVlzUlVGQlowSXNUMEZCYUVJc1EwRkJkMEk3UVVGRGNFSXNiVUpCUVZjc1JVRkJSU3hGUVVGRkxFVkJRVVVzWVVGQlNpeEZRVUZ0UWl4SlFVRnVRaXhEUVVGM1FpeE5RVUY0UWl4RFFVRkdMRVZCUVcxRExFMUJRVzVETEVkQlFUUkRPMEZCUkc1RExFdEJRWGhDTEVWQlJVY3NSMEZHU0N4RlFVVlJMRkZCUmxJN1FVRkhTRHM3UVVGRlRTeFRRVUZUTEhGQ1FVRlVMRU5CUVN0Q0xFZEJRUzlDTEVWQlFXMURMRWRCUVc1RExFVkJRWGRETzBGQlF6TkRMRmRCUVU4c1MwRkJTeXhMUVVGTUxFTkJRVmNzUzBGQlN5eE5RVUZNTEUxQlFXVXNUVUZCU1N4SFFVRktMRWRCUVZFc1EwRkJka0lzU1VGQk1FSXNSMEZCY2tNc1EwRkJVRHRCUVVOSU96czdPenM3T3pzN08wRkRka1pFT3p0QlFVVlBMRWxCUVUwc2IwTkJRV01zVTBGQlpDeFhRVUZqTEVkQlFVMDdRVUZETjBJc1RVRkJSU3hSUVVGR0xFVkJRMHNzUlVGRVRDeERRVU5STEZsQlJGSXNSVUZEYzBJc1owSkJSSFJDTEVWQlEzZERMRk5CUkhoRExFVkJSVXNzUlVGR1RDeERRVVZSTEZWQlJsSXNSVUZGYjBJc1owSkJSbkJDTEVWQlJYTkRMR1ZCUm5SRE96dEJRVWxCTEZGQlFVa3NVMEZCVXl4aFFVRlVMRU5CUVhWQ0xHbENRVUYyUWl4RFFVRktMRVZCUVN0RE8wRkJRek5ETEdWQlFVOHNaMEpCUVZBc1EwRkJkMElzVVVGQmVFSXNSVUZCYTBNc2FVSkJRV3hETzBGQlEwRTdRVUZEUVR0QlFVTklPMEZCUTBvc1EwRldUVHM3UVVGWlVDeEpRVUZOTEdsQ1FVRnBRaXhEUVVOdVFqdEJRVU5KTEZGQlFVa3NTVUZFVWp0QlFVVkpMRmRCUVU4N1FVRkdXQ3hEUVVSdFFpeEZRVXR1UWp0QlFVTkpMRkZCUVVjc1NVRkVVRHRCUVVWSkxGZEJRVTg3UVVGR1dDeERRVXh0UWl4RlFWTnVRanRCUVVOSkxGRkJRVWNzU1VGRVVEdEJRVVZKTEZkQlFVODdRVUZHV0N4RFFWUnRRaXhGUVdGdVFqdEJRVU5KTEZGQlFVY3NTVUZFVUR0QlFVVkpMRmRCUVU4N1FVRkdXQ3hEUVdKdFFpeEZRV2xDYmtJN1FVRkRTU3hSUVVGSExFbEJSRkE3UVVGRlNTeFhRVUZQTzBGQlJsZ3NRMEZxUW0xQ0xFVkJjVUp1UWp0QlFVTkpMRkZCUVVjc1NVRkVVRHRCUVVWSkxGZEJRVTg3UVVGR1dDeERRWEpDYlVJc1JVRjVRbTVDTzBGQlEwa3NVVUZCUnl4SlFVUlFPMEZCUlVrc1YwRkJUenRCUVVaWUxFTkJla0p0UWl4RlFUWkNia0k3UVVGRFNTeFJRVUZITEVsQlJGQTdRVUZGU1N4WFFVRlBPMEZCUmxnc1EwRTNRbTFDTEVWQmFVTnVRanRCUVVOSkxGRkJRVWNzU1VGRVVEdEJRVVZKTEZkQlFVODdRVUZHV0N4RFFXcERiVUlzUlVGeFEyNUNPMEZCUTBrc1VVRkJSeXhKUVVSUU8wRkJSVWtzVjBGQlR6dEJRVVpZTEVOQmNrTnRRaXhGUVhsRGJrSTdRVUZEU1N4UlFVRkhMRWxCUkZBN1FVRkZTU3hYUVVGUE8wRkJSbGdzUTBGNlEyMUNMRVZCTmtOdVFqdEJRVU5KTEZGQlFVY3NTVUZFVUR0QlFVVkpMRmRCUVU4N1FVRkdXQ3hEUVRkRGJVSXNSVUZwUkc1Q08wRkJRMGtzVVVGQlJ5eEpRVVJRTzBGQlJVa3NWMEZCVHp0QlFVWllMRU5CYWtSdFFpeEZRWEZFYmtJN1FVRkRTU3hSUVVGSExFbEJSRkE3UVVGRlNTeFhRVUZQTzBGQlJsZ3NRMEZ5UkcxQ0xFVkJlVVJ1UWp0QlFVTkpMRkZCUVVjc1NVRkVVRHRCUVVWSkxGZEJRVTg3UVVGR1dDeERRWHBFYlVJc1JVRTJSRzVDTzBGQlEwa3NVVUZCUnl4SlFVUlFPMEZCUlVrc1YwRkJUenRCUVVaWUxFTkJOMFJ0UWl4RlFXbEZia0k3UVVGRFNTeFJRVUZITEVsQlJGQTdRVUZGU1N4WFFVRlBPMEZCUmxnc1EwRnFSVzFDTEVWQmNVVnVRanRCUVVOSkxGRkJRVWNzU1VGRVVEdEJRVVZKTEZkQlFVODdRVUZHV0N4RFFYSkZiVUlzUlVGNVJXNUNPMEZCUTBrc1VVRkJSeXhKUVVSUU8wRkJSVWtzVjBGQlR6dEJRVVpZTEVOQmVrVnRRaXhGUVRaRmJrSTdRVUZEU1N4UlFVRkhMRWxCUkZBN1FVRkZTU3hYUVVGUE8wRkJSbGdzUTBFM1JXMUNMRVZCYVVadVFqdEJRVU5KTEZGQlFVY3NTVUZFVUR0QlFVVkpMRmRCUVU4N1FVRkdXQ3hEUVdwR2JVSXNSVUZ4Um01Q08wRkJRMGtzVVVGQlJ5eEpRVVJRTzBGQlJVa3NWMEZCVHp0QlFVWllMRU5CY2tadFFpeEZRWGxHYmtJN1FVRkRTU3hSUVVGSExFbEJSRkE3UVVGRlNTeFhRVUZQTzBGQlJsZ3NRMEY2Um0xQ0xFVkJOa1p1UWp0QlFVTkpMRkZCUVVjc1NVRkVVRHRCUVVWSkxGZEJRVTg3UVVGR1dDeERRVGRHYlVJc1JVRnBSMjVDTzBGQlEwa3NVVUZCUnl4SlFVUlFPMEZCUlVrc1YwRkJUenRCUVVaWUxFTkJha2R0UWl4RlFYRkhia0k3UVVGRFNTeFJRVUZITEVsQlJGQTdRVUZGU1N4WFFVRlBPMEZCUmxnc1EwRnlSMjFDTEVWQmVVZHVRanRCUVVOSkxGRkJRVWNzU1VGRVVEdEJRVVZKTEZkQlFVODdRVUZHV0N4RFFYcEhiVUlzUlVFMlIyNUNPMEZCUTBrc1VVRkJSeXhKUVVSUU8wRkJSVWtzVjBGQlR6dEJRVVpZTEVOQk4wZHRRaXhGUVdsSWJrSTdRVUZEU1N4UlFVRkhMRWxCUkZBN1FVRkZTU3hYUVVGUE8wRkJSbGdzUTBGcVNHMUNMRVZCY1VodVFqdEJRVU5KTEZGQlFVY3NTVUZFVUR0QlFVVkpMRmRCUVU4N1FVRkdXQ3hEUVhKSWJVSXNSVUY1U0c1Q08wRkJRMGtzVVVGQlJ5eEpRVVJRTzBGQlJVa3NWMEZCVHp0QlFVWllMRU5CZWtodFFpeEZRVFpJYmtJN1FVRkRTU3hSUVVGSExFbEJSRkE3UVVGRlNTeFhRVUZQTzBGQlJsZ3NRMEUzU0cxQ0xFTkJRWFpDT3p0QlFXMUpRU3hKUVVGSkxFdEJRVXNzU1VGQlZEdEJRVUZCTEVsQlEwa3NWMEZCVnl4SlFVUm1PenRCUVVkQkxFbEJRVTBzV1VGQldTeEZRVUZGTEVWQlFVWXNRMEZCU3l4WlFVRk1MRU5CUVd0Q0xHTkJRV3hDTEVWQlFXeENPenRCUVVWQkxFbEJRVTBzWVVGQllTeExRVUZMTEVWQlFYaENPenRCUVVWQkxFbEJRVTBzYjBKQlFXOUNMRk5CUVhCQ0xHbENRVUZ2UWl4SFFVRk5PMEZCUXpWQ0xFMUJRVVVzYjBKQlFVWXNSVUZCZDBJc1NVRkJlRUlzUTBGQk5rSXNSVUZCTjBJN1FVRkRRU3hwUWtGQllTeFJRVUZpTzBGQlEwRXNaVUZCVnl4WFFVRlhMRmxCUVVzN1FVRkRka0k3UVVGRFNDeExRVVpWTEVWQlJWSXNSVUZHVVN4RFFVRllPMEZCUjBnc1EwRk9SRHM3UVVGUlFTeEpRVUZOTEZsQlFWa3NVMEZCV2l4VFFVRlpMRU5CUVVNc1EwRkJSQ3hGUVVGSkxFbEJRVW9zUlVGQllUdEJRVU16UWl4UlFVRkpMRk5CUVZNc1QwRkJUeXhKUVVGUUxFZEJRV01zUlVGQlJTeGhRVUUzUWp0QlFVTkJMRkZCUVVrc1MwRkJTeXhQUVVGUExGbEJRVkFzUTBGQmIwSXNTVUZCY0VJc1EwRkJWRHM3UVVGRlFTeFJRVUZKTEZWQlFWVXNWVUZCVlN4TlFVRldMRU5CUVdsQ08wRkJRVUVzWlVGQlZ5eFJRVUZSTEVsQlFWSXNTMEZCYVVJc1JVRkJOVUk3UVVGQlFTeExRVUZxUWl4RFFVRmtPenRCUVVWQk96dEJRVVZCTEZGQlFVa3NTVUZCU2l4RlFVRlZMRXRCUVVzc1UwRkJUQ3hEUVVGbExFZEJRV1lzUTBGQmJVSXNVVUZCYmtJc1JVRkJWaXhMUVVOTExHTkJRV01zUlVGQlpEczdRVUZGVEN4UlFVRkpMRkZCUVZFc1RVRkJVaXhIUVVGcFFpeERRVUZ5UWl4RlFVRjNRanRCUVVOd1FqdEJRVU5CTEZsQlFVa3NUMEZCVHp0QlFVTlFMRFpEUVVFclFpeEZRVUV2UWl4VFFVUlBPMEZCUlZBc2EwSkJRVTBzVVVGQlVTeERRVUZTTEVWQlFWY3NTVUZHVmp0QlFVZFFMR2RDUVVGSkxGRkJRVkVzUTBGQlVpeEZRVUZYTEVsQlNGSTdRVUZKVUN4dFFrRkJUeXhQUVVGUExGbEJRVkFzUTBGQmIwSXNXVUZCY0VJc1NVRkJiME1zVDBGQlR5eFpRVUZRTEVOQlFXOUNMRmxCUVhCQ0xFTkJRWEJETEVkQlFYZEZPMEZCU25oRkxGTkJRVmc3UVVGTlFTeFpRVUZKTEdWQlFVOHNUMEZCV0N4RlFVRnZRanRCUVVOb1FpeG5Ra0ZCU1N4SlFVRkpMRk5CUVZNc1lVRkJWQ3hQUVVFeVFpeFBRVUZQTEZsQlFWQXNRMEZCYjBJc1NVRkJjRUlzUTBGQk0wSXNSVUZCZDBRc2NVSkJRWGhFTEVWQlFWSTdRVUZEUVN4blFrRkJTU3hSUVVGUk8wRkJRMUlzYlVKQlFVY3NSVUZCUlN4RFFVRkdMRWRCUVUwc1JVRkVSRHRCUVVWU0xIVkNRVUZQTEVWQlFVVXNTMEZHUkR0QlFVZFNMSGRDUVVGUkxFVkJRVVVzVFVGSVJqdEJRVWxTTEcxQ1FVRkhMRTlCUVU4c1QwRkJVQ3hIUVVGcFFpeERRVUZxUWl4SFFVRnpRaXhQUVVGUExFOUJRVkFzUjBGQmFVSXNRMEZCYWtJc1IwRkJjVUk3UVVGS2RFTXNZVUZCV2p0QlFVMUJMRFJDUVVGblFpeEpRVUZvUWl4RlFVRnpRaXhMUVVGMFFqdEJRVU5JTEZOQlZFUXNUVUZUVHp0QlFVTklMR2RDUVVGSkxGbEJRVmtzVTBGQlV5eGhRVUZVTEVOQlFYVkNMRzlDUVVGMlFpeEZRVUUyUXl4eFFrRkJOME1zUjBGQmNVVXNRMEZCY2tZN1FVRkRRU3huUWtGQlNTeExRVUZMTEU5QlFVOHNjVUpCUVZBc1JVRkJWRHRCUVVOQkxHZENRVUZKTEdGQlFXRTdRVUZEWWl4dFFrRkJSeXhIUVVGSExFTkJSRTg3UVVGRllpeDFRa0ZCVHl4SFFVRkhMRXRCUmtjN1FVRkhZaXgzUWtGQlVTeEhRVUZITEUxQlNFVTdRVUZKWWl4dFFrRkJSeXhIUVVGSExFTkJRVWdzUjBGQlR6dEJRVXBITEdGQlFXcENPMEZCVFVFc05FSkJRV2RDTEVsQlFXaENMRVZCUVhOQ0xGVkJRWFJDTzBGQlEwZzdRVUZEU2pzN1FVRkZSQ3hSUVVGSkxGTkJRVk1zVTBGQlV5eGhRVUZVTEN0Q1FVRnRSQ3hGUVVGdVJDeFJRVUZpT3p0QlFVVkJMRkZCUVVrc1RVRkJTaXhGUVVGWk8wRkJRMUlzWlVGQlR5eExRVUZRTEVOQlFXRXNZMEZCWWl4SFFVRTRRaXhMUVVFNVFqdEJRVU5CTEdWQlFVOHNVMEZCVUN4RFFVRnBRaXhIUVVGcVFpeERRVUZ4UWl4VFFVRnlRanRCUVVOSU8wRkJRMG9zUTBFdlEwUTdPMEZCYVVSQkxFbEJRVTBzYTBKQlFXdENMRk5CUVd4Q0xHVkJRV3RDTEVOQlFVTXNRMEZCUkN4RlFVRkpMRWxCUVVvc1JVRkJZVHRCUVVOcVF5eFJRVUZKTEZOQlFWTXNUMEZCVHl4SlFVRlFMRWRCUVdNc1JVRkJSU3hoUVVFM1FqdEJRVU5CTEZGQlFVa3NTMEZCU3l4UFFVRlBMRmxCUVZBc1EwRkJiMElzU1VGQmNFSXNRMEZCVkRzN1FVRkZRU3hSUVVGSkxGTkJRVk1zVTBGQlV5eGhRVUZVTEN0Q1FVRnRSQ3hGUVVGdVJDeFJRVUZpTzBGQlEwRTdPMEZCUlVFc1VVRkJTU3hOUVVGS0xFVkJRVms3UVVGRFVpeGxRVUZQTEV0QlFWQXNRMEZCWVN4alFVRmlMRWRCUVRoQ0xFdEJRVGxDTzBGQlEwRXNaVUZCVHl4VFFVRlFMRU5CUVdsQ0xFMUJRV3BDTEVOQlFYZENMRk5CUVhoQ08wRkJRMGc3UVVGRFJEdEJRVU5JTEVOQldrUTdPMEZCWTBFc1NVRkJUU3hwUWtGQmFVSXNVMEZCYWtJc1kwRkJhVUlzUjBGQlN6dEJRVU40UWl4UlFVRkpMR2RDUVVGblFpeGxRVUZsTEcxRFFVRnpRaXhEUVVGMFFpeEZRVUY1UWl4bFFVRmxMRTFCUVdZc1IwRkJjMElzUTBGQkwwTXNRMEZCWml4RlFVRnJSU3hGUVVGMFJqdEJRVU5CTEZGQlFVa3NVMEZCVXl4VFFVRlRMR0ZCUVZRc1QwRkJNa0lzWTBGQll5eFhRVUZrTEVWQlFUTkNMRU5CUVdJN1FVRkRRU3hSUVVGSkxFOUJRVThzVFVGQldEczdRVUZGUVN4dlFrRkJaMElzU1VGQmFFSXNSVUZCYzBJc1RVRkJkRUk3UVVGRFFTeGpRVUZWTEVsQlFWWXNSVUZCWjBJc1RVRkJhRUk3UVVGRFFTeFRRVUZMTEZsQlFWa3NXVUZCU3p0QlFVTnNRaXhaUVVGSkxHbENRVUZwUWl4bFFVRmxMRzFEUVVGelFpeERRVUYwUWl4RlFVRjVRaXhsUVVGbExFMUJRV1lzUjBGQmMwSXNRMEZCTDBNc1EwRkJaaXhGUVVGclJTeEZRVUYyUmp0QlFVTkJMRmxCUVVrc1ZVRkJWU3hUUVVGVExHRkJRVlFzVDBGQk1rSXNaVUZCWlN4WFFVRm1MRVZCUVROQ0xFTkJRV1E3UVVGRFFTeDNRa0ZCWjBJc1NVRkJhRUlzUlVGQmMwSXNTVUZCZEVJN1FVRkRRU3hyUWtGQlZTeEpRVUZXTEVWQlFXZENMRTlCUVdoQ08wRkJRMEVzWlVGQlR5eFBRVUZRTzBGQlEwZ3NTMEZPU1N4RlFVMUdMRWxCVGtVc1EwRkJURHRCUVU5SUxFTkJaRVE3TzBGQlowSkJMRWxCUVUwc0swSkJRU3RDTEZOQlFTOUNMRFJDUVVFclFpeEhRVUZMTzBGQlEzUkRMR0ZCUVZNc1owSkJRVlFzUTBGQk1FSXNaMEpCUVRGQ0xFVkJRVFJETEU5QlFUVkRMRU5CUVc5RUxGVkJRVU1zUTBGQlJDeEZRVUZOTzBGQlEzUkVMRlZCUVVVc1UwRkJSaXhEUVVGWkxFMUJRVm9zUTBGQmJVSXNVVUZCYmtJN1FVRkRTQ3hMUVVaRU8wRkJSMGdzUTBGS1JEczdRVUZOUVN4SlFVRk5MR3RDUVVGclFpeFRRVUZzUWl4bFFVRnJRaXhEUVVGRExFbEJRVVFzUlVGQlR5eExRVUZRTEVWQlFXbENPMEZCUTNKRExGRkJRVWtzVVVGQlVTeFRRVUZUTEdGQlFWUXNRMEZCZFVJc1MwRkJka0lzUTBGQldqdEJRVU5CTEZWQlFVMHNVMEZCVGl4SFFVRnJRaXhSUVVGc1FqdEJRVU5CTEZWQlFVMHNXVUZCVGl4RFFVRnRRaXhKUVVGdVFpeEZRVUY1UWl4cFFrRkJla0k3UVVGRFFTeFZRVUZOTEV0QlFVNHNRMEZCV1N4SlFVRmFMRWRCUVhOQ0xFMUJRVTBzUTBGQlRpeEhRVUZYTEUxQlFVMHNTMEZCVGl4SFFVRmpMRU5CUVM5RE8wRkJRMEVzVlVGQlRTeExRVUZPTEVOQlFWa3NSMEZCV2l4SFFVRnhRaXhOUVVGTkxFTkJRVTRzUjBGQlZ5eE5RVUZOTEUxQlFVNHNSMEZCWlN4RFFVRXZRenM3UVVGRlFTeFJRVUZKTEU5QlFVOHNRMEZCV0R0QlFVTkJMRkZCUVVrc1RVRkJUU3hEUVVGT0xFZEJRVlVzUjBGQlZpeEhRVUZuUWl4TlFVRk5MRXRCUVU0c1IwRkJZeXhEUVVFNVFpeEhRVUZ0UXl4UFFVRlBMRlZCUVRsRExFVkJRVEJFTzBGQlEzUkVMR1ZCUVU4c1QwRkJUeXhWUVVGUUxFbEJRWEZDTEUxQlFVMHNRMEZCVGl4SFFVRlZMRWRCUVM5Q0xFTkJRVkE3UVVGRFNEczdRVUZGUkN4UlFVRkpMRXRCUVVzc1JVRkJUQ3hMUVVGWkxFbEJRV2hDTEVWQlFYTkNPMEZCUTJ4Q0xHTkJRVTBzUzBGQlRpeERRVUZaTEVsQlFWb3NSMEZCYjBJc1QwRkJUeXhWUVVGUUxFZEJRVzlDTEVsQlFYQkNMRWxCUVRSQ0xFOUJRVThzVlVGQlVDeEhRVUZ2UWl4aFFVRm9SQ3hIUVVFeVJDeE5RVUZOTEVOQlFVNHNSMEZCVlN4RlFVRnlSU3hWUVVGcFJpeE5RVUZOTEVOQlFVNHNSMEZCVnl4RlFVRTFSaXhQUVVGd1FqdEJRVU5JT3p0QlFVVkVMRkZCUVVrc1pVRkJaU3hMUVVGTExFZEJRVXdzUTBGQlV5eEpRVUZVTEVsQlFXbENMRVZCUVdwQ0xFZEJRWE5DTEVkQlFYUkNMRWRCUVRSQ0xFZEJRVFZDTEVkQlFXdERMRXRCUVVzc1IwRkJUQ3hEUVVGVExFbEJRVlFzU1VGQmFVSXNSVUZCZEVVN08wRkJSVUVzVlVGQlRTeFRRVUZPTEdsRVFVRTJSQ3hQUVVGUkxFTkJRVU1zUjBGQmRFVXNPRVZCUXpKRUxFdEJRVXNzUjBGQlRDeERRVUZUTEVsQlFWUXNTVUZCWlN4RlFVUXhSU3gxUmtGRk9FUXNTMEZCU3l4SFFVWnVSU3h0UmtGSE5FUXNXVUZJTlVRc09FWkJTMjlETEV0QlFVc3NTVUZNZWtNc2RVUkJUWEZETEV0QlFVc3NTMEZPTVVNN08wRkJWVUVzWVVGQlV5eGhRVUZVTEVOQlFYVkNMR2xDUVVGMlFpeEZRVUV3UXl4WFFVRXhReXhEUVVGelJDeExRVUYwUkR0QlFVTklMRU5CTjBKRU96dEJRU3RDUVN4SlFVRk5MR3RDUVVGclFpeFRRVUZzUWl4bFFVRnJRaXhIUVVGTk8wRkJRekZDTEZGQlFVa3NVMEZCVXl4aFFVRlVMRU5CUVhWQ0xHdENRVUYyUWl4RFFVRktMRVZCUTBrc1UwRkJVeXhoUVVGVUxFTkJRWFZDTEd0Q1FVRjJRaXhGUVVFeVF5eE5RVUV6UXp0QlFVTlFMRU5CU0VRN08wRkJTMEVzU1VGQlRTeDVRa0ZCZVVJc1UwRkJla0lzYzBKQlFYbENMRU5CUVVNc1RVRkJSQ3hGUVVGWk8wRkJRM1pETEZGQlFVa3NVVUZCVVN4UFFVRlBMRTlCUVZBc1JVRkJXanM3UVVGRlFTeFhRVUZQTEZOQlFWVXNUVUZCVFN4TFFVRk9MRWRCUVdNc1RVRkJUU3hOUVVGd1FpeEhRVUUyUWl4VlFVRTVRaXhIUVVFMFF5eERRVUZ5UkN4RFFVRlFPMEZCUTBnc1EwRktSRHM3UVVGTlFTeEpRVUZOTEc5Q1FVRnZRaXhUUVVGd1FpeHBRa0ZCYjBJc1EwRkJReXhMUVVGRUxFVkJRVkVzUzBGQlVpeEZRVUZsTEV0QlFXWXNSVUZCYzBJc1JVRkJkRUlzUlVGQk5rSTdRVUZEYmtRc1VVRkJTU3hSUVVGUkxGTkJRVk1zWVVGQlZDeERRVUYxUWl4TFFVRjJRaXhEUVVGYU8wRkJRVUVzVVVGRFNTeE5RVUZOTEVWQlJGWTdPMEZCUjBFc1ZVRkJUU3hUUVVGT0xFZEJRV3RDTEdkQ1FVRnNRanRCUVVOQkxGVkJRVTBzUzBGQlRpeERRVUZaTEVsQlFWb3NSMEZCYzBJc1RVRkJUU3hEUVVFMVFqdEJRVU5CTEZWQlFVMHNTMEZCVGl4RFFVRlpMRWRCUVZvc1IwRkJjVUlzVFVGQlRTeERRVUV6UWp0QlFVTkJMRlZCUVUwc1MwRkJUaXhEUVVGWkxFdEJRVm9zUjBGQmRVSXNUVUZCVFN4TFFVRTNRanRCUVVOQkxGVkJRVTBzUzBGQlRpeERRVUZaTEUxQlFWb3NSMEZCZDBJc1RVRkJUU3hOUVVFNVFqdEJRVU5CTEZWQlFVMHNXVUZCVGl4RFFVRnRRaXhUUVVGdVFpeEZRVUU0UWl4RlFVRTVRanRCUVVOQkxGVkJRVTBzUzBGQlRpeERRVUZaTEdWQlFWb3NiME5CUVRaRUxFVkJRVGRFTzBGQlEwRXNWVUZCVFN4TFFVRk9MRU5CUVZrc1kwRkJXaXhIUVVGblF5eFJRVUZSTEVWQlFYaERPenRCUVVWQkxGZEJRVThzUzBGQlVEdEJRVU5JTEVOQlpFUTdPMEZCWjBKQkxFbEJRVTBzWVVGQllTeFRRVUZpTEZWQlFXRXNSMEZCVFR0QlFVTnlRaXh0UWtGQlpTeEhRVUZtTEVOQlFXMUNMRlZCUVVNc1EwRkJSQ3hGUVVGSExFTkJRVWdzUlVGQlVUdEJRVU4yUWl4WlFVRkpMRk5CUVZNc1UwRkJVeXhoUVVGVUxFOUJRVEpDTEVWQlFVVXNSVUZCUml4RFFVRkxMRmRCUVV3c1JVRkJNMElzUTBGQllqdEJRVU5CTEdWQlFVOHNXVUZCVUN4RFFVRnZRaXhaUVVGd1FpeEZRVUZyUXl4RlFVRkZMRXRCUVhCRE8wRkJRMEVzV1VGQlNTeFpRVUZaTEZOQlFWTXNZVUZCVkN4RFFVRjFRaXh2UWtGQmRrSXNSVUZCTmtNc2NVSkJRVGRETEVkQlFYRkZMRU5CUVhKR08wRkJRMEVzV1VGQlNTeFJRVUZSTEU5QlFVOHNUMEZCVUN4RlFVRmFPMEZCUTBFc1dVRkJTU3hMUVVGTExFOUJRVThzY1VKQlFWQXNSVUZCVkR0QlFVTkJMRmxCUVVrc1lVRkJZVHRCUVVOaUxHVkJRVWNzUjBGQlJ5eERRVVJQTzBGQlJXSXNiVUpCUVU4c1IwRkJSeXhMUVVaSE8wRkJSMklzYjBKQlFWRXNSMEZCUnl4TlFVaEZPMEZCU1dJc1pVRkJSeXhIUVVGSExFTkJRVWdzUjBGQlR6dEJRVXBITEZOQlFXcENPMEZCVFVFc1dVRkJTU3hOUVVGTkxHdENRVUZyUWl4MVFrRkJkVUlzVFVGQmRrSXNRMEZCYkVJc1JVRkJhMFFzVlVGQmJFUXNSVUZCT0VRc1EwRkJPVVFzUlVGQmFVVXNSVUZCUlN4RlFVRkdMRU5CUVVzc1YwRkJUQ3hGUVVGcVJTeERRVUZXTzBGQlEwRXNhVUpCUVZNc1lVRkJWQ3hEUVVGMVFpeHZRa0ZCZGtJc1JVRkJOa01zVjBGQk4wTXNRMEZCZVVRc1IwRkJla1E3UVVGRFNDeExRV1JFTzBGQlpVZ3NRMEZvUWtRN096czdPenM3TzJ0Q1F5OVRkMElzWVR0QlFVRlVMRk5CUVZNc1lVRkJWQ3hIUVVGNVFqdEJRVU53UXl4TlFVRkZMRkZCUVVZc1JVRkJXU3hGUVVGYUxFTkJRV1VzVDBGQlppeEZRVUYzUWl4WFFVRjRRaXhGUVVGeFF5eGxRVUZ5UXp0QlFVTklPenRCUVVWRUxFbEJRVTBzYTBKQlFXdENMRk5CUVd4Q0xHVkJRV3RDTEVOQlFVTXNRMEZCUkN4RlFVRlBPMEZCUXpOQ0xGRkJRVWtzUzBGQlN5eEZRVUZGTEdGQlFVWXNRMEZCWjBJc1dVRkJhRUlzUTBGQk5rSXNhVUpCUVRkQ0xFTkJRVlE3UVVGRFFTeFJRVUZKTEZOQlFWTXNZVUZCVkN4RFFVRjFRaXhqUVVGMlFpeERRVUZLTEVWQlFUUkRPMEZCUTNoRExHbENRVUZUTEdGQlFWUXNRMEZCZFVJc1kwRkJka0lzUlVGQmRVTXNVMEZCZGtNc2RVVkJRV3RJTEVWQlFXeElPMEZCUTBnN1FVRkRTaXhEUVV4RU96czdPenM3T3pzN1FVTktRVHM3UVVGRFFUczdPenM3TzBGQlJVRXNTVUZCVFN3eVFrRkJNa0k3TzBGQlJXaERMRTlCUVUwc1JVRkJSU3hGUVVGR0xFTkJRVXNzV1VGQlRDeERRVUZyUWl4alFVRnNRaXhGUVVZd1FqczdRVUZKYUVNc1YwRkJWU3hOUVVwelFqczdRVUZOYUVNc1QwRkJUVHRCUVVOTUxGTkJRVTg3UVVGRFRpeFpRVUZUTzBGQlJFZ3NSMEZFUmp0QlFVbE1MR2xDUVVGbExIbENRVUZOTzBGQlEzQkNMRXRCUVVVc2EwSkJRVVlzUlVGQmMwSXNXVUZCZEVJc1EwRkJiVU1zV1VGQmJrTXNSVUZCYVVRc1JVRkJSU3hyUWtGQlJpeEZRVUZ6UWl4dFFrRkJkRUlzUjBGQk5FTXNTVUZCTjBZN1FVRkRRVHRCUVU1Sk8wRkJUakJDTEVOQlFXcERPenRCUVdkQ1FTeEpRVUZOTEdkQ1FVRm5RaXhUUVVGb1FpeGhRVUZuUWl4SFFVRk5PMEZCUXpOQ0xFZEJRVVVzYTBKQlFVWXNSVUZCYzBJc1JVRkJkRUlzUTBGQmVVSXNaVUZCZWtJc1JVRkJNRU1zYVVKQlFURkRPenRCUVVWQkxFZEJRVVVzVVVGQlJpeEZRVU5GTEVWQlJFWXNRMEZEU3l4UFFVUk1MRVZCUTJNc1owSkJSR1FzUlVGRFowTXNVMEZFYUVNc1JVRkZSU3hGUVVaR0xFTkJSVXNzVDBGR1RDeEZRVVZqTEdsQ1FVWmtMRVZCUldsRExGVkJSbXBETEVWQlIwVXNSVUZJUml4RFFVZExMRTlCU0V3c1JVRkhZeXhuUWtGSVpDeEZRVWRuUXl4blFrRklhRU1zUlVGSlJTeEZRVXBHTEVOQlNVc3NUMEZLVEN4RlFVbGpMRkZCU21Rc1JVRkpkMElzVlVGQlF5eERRVUZFTzBGQlFVRXNVMEZCVHl4RlFVRkZMR1ZCUVVZc1JVRkJVRHRCUVVGQkxFVkJTbmhDTEVWQlMwVXNSVUZNUml4RFFVdExMRTlCVEV3c1JVRkxZeXhaUVV4a0xFVkJTelJDTEc5Q1FVdzFRaXhGUVUxRkxFVkJUa1lzUTBGTlN5eFBRVTVNTEVWQlRXTXNWVUZPWkN4RlFVMHdRaXhsUVU0eFFpeEZRVTlGTEVWQlVFWXNRMEZQU3l4UFFWQk1MRVZCVDJNc1QwRlFaQ3hGUVU5MVFpeGxRVkIyUWl4RlFWRkZMRVZCVWtZc1EwRlJTeXhSUVZKTUxFVkJVV1VzYVVKQlVtWXNSVUZSYTBNc1YwRlNiRU1zUlVGVFJTeEZRVlJHTEVOQlUwc3NUMEZVVEN4RlFWTmpMR3RDUVZSa0xFVkJVMnRETEdkQ1FWUnNReXhGUVZWRkxFVkJWa1lzUTBGVlN5eFBRVlpNTEVWQlZXTXNhMEpCVm1Rc1JVRlZhME1zWjBKQlZteERMRVZCVjBVc1JVRllSaXhEUVZkTExGRkJXRXdzUlVGWFpTeHBRa0ZZWml4RlFWZHJReXhyUWtGWWJFTTdPMEZCWVVFN1FVRkRRVHRCUVVOQkxFTkJiRUpFT3p0QlFXOUNRU3hKUVVGTkxHMUNRVUZ0UWl4VFFVRnVRaXhuUWtGQmJVSXNRMEZCUXl4RFFVRkVMRVZCUVU4N1FVRkRMMElzV1VGQlZ5eERRVUZZTzBGQlEwRXNWVUZCVXl4aFFVRlVMRU5CUVhWQ0xHbENRVUYyUWl4RlFVRXdReXhMUVVFeFF5eERRVUZuUkN4UFFVRm9SQ3hIUVVFd1JDeFBRVUV4UkR0QlFVTkJMRU5CU0VRN08wRkJTMEVzU1VGQlNTeGxRVUZsTEVsQlFXNUNPMEZCUTBFc1NVRkJUU3hyUWtGQmEwSXNVMEZCYkVJc1pVRkJhMElzUTBGQlF5eERRVUZFTEVWQlFVODdRVUZET1VJc1MwRkJTU3hSUVVGUkxFVkJRVVVzWVVGQlpEdEJRVU5CTEV0QlFVa3NUVUZCVFN4WlFVRk9MRU5CUVcxQ0xFMUJRVzVDTEUxQlFTdENMRTlCUVc1RExFVkJRVFJETzBGQlF6TkRMR1ZCUVdFc1dVRkJZanRCUVVOQkxHbENRVUZsTEZkQlFWY3NXVUZCVFR0QlFVTXZRaXhQUVVGSkxFMUJRVTBzVTBGQlV5eE5RVUZOTEV0QlFXWXNRMEZCVmpzN1FVRkZRU3hQUVVGSkxFOUJRVThzUlVGQldDeEZRVUZsTzBGQlEyUXNZVUZCVXl4aFFVRlVMRU5CUVhWQ0xHbENRVUYyUWl4RlFVRXdReXhUUVVFeFF5eEhRVUZ6UkN4RlFVRjBSRHRCUVVOQkxFbEJSa1FzVFVGRlR6dEJRVU5PTEdGQlFWTXNZVUZCVkN4RFFVRjFRaXhwUWtGQmRrSXNSVUZCTUVNc1UwRkJNVU1zUjBGQmMwUXNlVU5CUVhSRU8wRkJRMEU3UVVGRFJDeEhRVkpqTEVWQlVWb3NSMEZTV1N4RFFVRm1PMEZCVTBFN1FVRkRSQ3hEUVdSRU96dEJRV2RDUVN4SlFVRkpMRzFDUVVGdFFpeERRVUYyUWpzN1FVRkZRU3hKUVVGTkxHTkJRV01zVTBGQlpDeFhRVUZqTEVOQlFVTXNRMEZCUkN4RlFVRlBPMEZCUXpGQ0xFdEJRVWtzVVVGQlVTeEZRVUZGTEdGQlFVWXNRMEZCWjBJc1dVRkJhRUlzUTBGQk5rSXNXVUZCTjBJc1EwRkJXanM3UVVGRlFTeEhRVUZGTEdGQlFVWXNRMEZCWjBJc1QwRkJhRUlzUTBGQmQwSXNVVUZCZUVJc1JVRkJhME1zWjBKQlFXeERMRU5CUVcxRUxHdENRVUZ1UkN4RlFVRjFSU3hQUVVGMlJTeERRVUVyUlN4VlFVRkRMRWRCUVVRc1JVRkJUU3hEUVVGT0xFVkJRVms3UVVGRE1VWXNUVUZCU1N4VFFVRktMRU5CUVdNc1RVRkJaQ3hEUVVGeFFpeFJRVUZ5UWp0QlFVTkJMRTFCUVVrc1lVRkJTaXhEUVVGclFpeFBRVUZzUWl4RlFVRXlRaXhQUVVFelFpeEhRVUZ4UXl4TFFVRnlRenRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3hGUVZoRU8wRkJXVUVzUjBGQlJTeGhRVUZHTEVOQlFXZENMRTlCUVdoQ0xFZEJRVEJDTEVsQlFURkNPMEZCUTBFc1IwRkJSU3hoUVVGR0xFTkJRV2RDTEZWQlFXaENMRU5CUVRKQ0xGTkJRVE5DTEVOQlFYRkRMRWRCUVhKRExFTkJRWGxETEZGQlFYcERPMEZCUTBFc1EwRnFRa1E3TzBGQmJVSkJMRWxCUVUwc2NVSkJRWEZDTEZOQlFYSkNMR3RDUVVGeFFpeERRVUZETEVOQlFVUXNSVUZCVHp0QlFVTnFReXhMUVVGSkxFOUJRVThzUlVGQlJTeGhRVUZHTEVOQlFXZENMRXRCUVROQ08wRkJRMEVzVTBGQlVTeEhRVUZTTEVOQlFWa3NTVUZCV2pzN1FVRkZRU3hMUVVGSkxGTkJRVk1zWVVGQlZDeERRVUYxUWl4blFrRkJka0lzUTBGQlNpeEZRVU5ETEZOQlFWTXNZVUZCVkN4RFFVRjFRaXhuUWtGQmRrSXNSVUZCZVVNc1MwRkJla01zUTBGQkswTXNUMEZCTDBNc1IwRkJlVVFzVTBGQlV5eE5RVUZVTEVkQlFXdENMRTlCUVd4Q0xFZEJRVEpDTEUxQlFYQkdPMEZCUlVRc1EwRlFSRHM3UVVGVFFTeEpRVUZOTEZsQlFWa3NVMEZCV2l4VFFVRlpMRU5CUVVNc1EwRkJSQ3hGUVVGUE8wRkJRM2hDTEV0QlFVa3NUMEZCVHl4RlFVRkZMR0ZCUVVZc1EwRkJaMElzV1VGQmFFSXNRMEZCTmtJc1dVRkJOMElzUTBGQldEdEJRVU5CTEV0QlFVa3NaVUZCVHl4UFFVRllMRVZCUVc5Q08wRkJRMjVDTEhGQ1FVRnRRaXhQUVVGUExGZEJRVEZDTzBGQlEwRXNWMEZCVXl4aFFVRlVMRU5CUVhWQ0xFMUJRWFpDTEVWQlFTdENMRk5CUVM5Q0xFTkJRWGxETEVkQlFYcERMRU5CUVRaRExFOUJRVGRETzBGQlEwRTdPMEZCUlVRc1IwRkJSU3hyUWtGQlJpeEZRVUZ6UWl4WlFVRjBRaXhEUVVGdFF6dEJRVU5zUXl4clFrRkJaMElzVFVGRWEwSTdRVUZGYkVNc1pVRkJZU3hqUVVaeFFqdEJRVWRzUXl4eFFrRkJiVUlzTWtKQlFWVXNNRUpCUVZZc1JVRkJjME1zYlVKQlFYUkRMRVZCUVRKRU8wRkJRemRGTEZWQlFVOHNiMEpCUVc5Q0xFbEJRVE5DTzBGQlEwRXNSMEZNYVVNN1FVRk5iRU1zYzBKQlFXOUNPMEZCVG1Nc1JVRkJia003UVVGUlFUczdRVUZGUVN4SFFVRkZMR2RDUVVGR0xFVkJRVzlDTEZsQlFYQkNMRU5CUVdsRE8wRkJRMmhETEd0Q1FVRm5RaXhOUVVSblFqdEJRVVZvUXl4bFFVRmhMR05CUm0xQ08wRkJSMmhETEhOQ1FVRnZRaXhGUVVoWk8wRkJTV2hETEc5Q1FVRnJRanRCUVVwakxFVkJRV3BET3p0QlFVOUJMRWRCUVVVc1kwRkJSaXhGUVVGclFpeFpRVUZzUWl4RFFVRXJRanRCUVVNNVFpeHJRa0ZCWjBJc1RVRkVZenRCUVVVNVFpeGxRVUZoTEdOQlJtbENPMEZCUnpsQ0xITkNRVUZ2UWl4RlFVaFZPMEZCU1RsQ0xHOUNRVUZyUWp0QlFVcFpMRVZCUVM5Q096dEJRVTlCTEVkQlFVVXNhVUpCUVVZc1JVRkJjVUlzV1VGQmNrSXNRMEZCYTBNN1FVRkRha01zYTBKQlFXZENMRTFCUkdsQ08wRkJSV3BETEdWQlFXRXNZMEZHYjBJN1FVRkhha01zYzBKQlFXOUNMRVZCU0dFN1FVRkpha01zYjBKQlFXdENPMEZCU21Vc1JVRkJiRU03TzBGQlQwRXNWVUZCVXl4aFFVRlVMR05CUVd0RExFbEJRV3hETEVWQlFUQkRMRXRCUVRGRExFTkJRV2RFTEU5QlFXaEVMRWRCUVRCRUxFOUJRVEZFTzBGQlEwRXNRMEYyUTBRN08wRkJlVU5CTEVsQlFVMHNZVUZCWVN4VFFVRmlMRlZCUVdFc1EwRkJReXhEUVVGRUxFVkJRVTg3UVVGRGVrSXNTMEZCU1N4VFFVRlRMRVZCUVVVc1lVRkJaanRCUVVOQkxFdEJRVWtzWlVGQlR5eFBRVUZZTEVWQlFXOUNPMEZCUTI1Q0xGZEJRVk1zWVVGQlZDeERRVUYxUWl4TlFVRjJRaXhGUVVFclFpeFRRVUV2UWl4RFFVRjVReXhOUVVGNlF5eERRVUZuUkN4UFFVRm9SRHRCUVVOQkxGTkJRVThzVVVGQlVDeERRVUZuUWl4RFFVRm9RaXhGUVVGdFFpeG5Ra0ZCYmtJN1FVRkRRVHRCUVVORUxFZEJRVVVzYTBKQlFVWXNSVUZCYzBJc1dVRkJkRUlzUTBGQmJVTXNVMEZCYmtNN08wRkJSVUVzVVVGQlR5eFBRVUZRTEVOQlFXVXNVVUZCWml4RlFVRjVRaXhuUWtGQmVrSXNRMEZCTUVNc1QwRkJNVU1zUlVGQmJVUXNUMEZCYmtRc1EwRkJNa1FzVlVGQlF5eERRVUZFTzBGQlFVRXNVMEZCVHl4RlFVRkZMRXRCUVVZc1IwRkJWU3hGUVVGcVFqdEJRVUZCTEVWQlFUTkVPMEZCUTBFc1VVRkJUeXhQUVVGUUxFTkJRV1VzV1VGQlppeEZRVUUyUWl4TFFVRTNRaXhEUVVGdFF5eFBRVUZ1UXl4SFFVRTJReXhOUVVFM1F6dEJRVU5CTEVOQlZrUTdPMEZCV1VFc1NVRkJUU3gxUWtGQmRVSXNVMEZCZGtJc2IwSkJRWFZDTEVOQlFVTXNRMEZCUkN4RlFVRlBPMEZCUTI1RExFdEJRVWtzVVVGQlVTeExRVUZhTzBGQlFVRXNTMEZEUXl4VFFVRlRMRVZCUVVVc1lVRkJSaXhEUVVGblFpeG5Ra0ZCYUVJc1EwRkJhVU1zT0VKQlFXcERMRU5CUkZZN1FVRkZRU3hOUVVGTExFbEJRVWtzUTBGQlZDeEpRVUZqTEUxQlFXUXNSVUZCYzBJN1FVRkRja0lzVFVGQlNTeFBRVUZQTEVOQlFWQXNSVUZCVlN4TFFVRldMRWxCUTBFc1QwRkJUeXhEUVVGUUxFVkJRVlVzUzBGQlZpeERRVUZuUWl4TlFVRm9RaXhMUVVFeVFpeERRVVF6UWl4SlFVVkJMRTlCUVU4c1EwRkJVQ3hGUVVGVkxGbEJRVllzUTBGQmRVSXNUVUZCZGtJc1RVRkJiVU1zVTBGR2RrTXNSVUZGYTBRN1FVRkRha1FzVjBGQlVTeEpRVUZTTzBGQlEwRTdRVUZEUVR0QlFVTkVPenRCUVVWRUxFdEJRVWtzUTBGQlF5eExRVUZNTEVWQlFWazdRVUZEV0N4SlFVRkZMR3RDUVVGR0xFVkJRWE5DTEZsQlFYUkNMRU5CUVcxRExGTkJRVzVET3p0QlFVVkJMRWxCUVVVc1lVRkJSaXhEUVVGblFpeGhRVUZvUWl4RFFVRTRRaXhSUVVFNVFpeEZRVUYzUXl4blFrRkJlRU1zUTBGQmVVUXNUMEZCZWtRc1JVRkJhMFVzVDBGQmJFVXNRMEZCTUVVc1ZVRkJReXhEUVVGRU8wRkJRVUVzVlVGQlR5eEZRVUZGTEV0QlFVWXNSMEZCVlN4RlFVRnFRanRCUVVGQkxFZEJRVEZGTzBGQlEwRXNTVUZCUlN4aFFVRkdMRU5CUVdkQ0xFdEJRV2hDTEVOQlFYTkNMRTlCUVhSQ0xFZEJRV2RETEUxQlFXaERPMEZCUTBFN1FVRkZSQ3hEUVc1Q1JEczdRVUZ4UWtFc1NVRkJUU3hwUWtGQmFVSXNVMEZCYWtJc1kwRkJhVUlzUTBGQlF5eFJRVUZFTEVWQlFXTTdRVUZEY0VNc1MwRkJTU3gxUWtGQlZTeG5Ra0ZCVml4TFFVRXJRaXgxUWtGQlZTeG5Ra0ZCVml4RlFVRTBRaXhOUVVFMVFpeEhRVUZ4UXl4RFFVRjRSU3hGUVVFeVJTeFBRVUZQTEdOQlFWQXNSMEZCZDBJc2RVSkJRVlVzWjBKQlFWWXNRMEZCZUVJN08wRkJSVE5GTEV0QlFVa3NUMEZCVHl4alFVRllMRVZCUVRKQ096dEJRVVV4UWl4WFFVRlRMRTlCUVU4c1kwRkJhRUk3UVVGRFFTeEZRVWhFTEUxQlIwODdRVUZEVGl4SlFVRkZMRWRCUVVZc1EwRkJUU3h0UWtGQlRpeEZRVUV5UWl4WlFVRlpMRU5CUTNSRExFTkJSRVFzUlVGRFJ5eFBRVVJJTEVWQlExa3NUVUZFV2l4RFFVTnRRaXhWUVVGVkxFbEJRVllzUlVGQlowSTdRVUZEYkVNc1QwRkJTU3hMUVVGTExFMUJRVXdzUzBGQlowSXNSMEZCY0VJc1JVRkJlVUk3UVVGRGVFSXNVVUZCU1N4alFVRmxMRkZCUVZFc1MwRkJTeXhQUVVGa0xFZEJRWGxDTEV0QlFVc3NUMEZCT1VJc1IwRkJkME1zUlVGQk1VUTdRVUZEUVN4WFFVRlBMR05CUVZBc1IwRkJkMElzVjBGQmVFSTdRVUZEUVN3eVFrRkJWU3huUWtGQlZpeEZRVUUwUWl4WFFVRTFRaXhGUVVGNVF5eEZRVUY2UXp0QlFVTkJMR0ZCUVZNc1YwRkJWRHRCUVVOQk8wRkJRMFFzUjBGU1JEdEJRVk5CTzBGQlEwUXNRMEZxUWtRN08wRkJiVUpCTEVsQlFVMHNiMEpCUVc5Q0xGTkJRWEJDTEdsQ1FVRnZRaXhEUVVGRExFTkJRVVFzUlVGQlNTeFhRVUZLTEVWQlFXOUNPMEZCUXpkRExFZEJRVVVzWVVGQlJpeERRVUZuUWl4TFFVRm9RaXhIUVVGM1FpeFpRVUZaTEVsQlFYQkRPMEZCUTBFc1MwRkJTU3hGUVVGRkxHRkJRVVlzUTBGQlowSXNXVUZCYUVJc1EwRkJOa0lzU1VGQk4wSXNUVUZCZFVNc2FVSkJRVE5ETEVWQlFUaEVPMEZCUXpkRUxHRkJRVmNzV1VGQlRUdEJRVU5vUWl4TFFVRkZMRVZCUVVVc1lVRkJTaXhGUVVGdFFpeEpRVUZ1UWp0QlFVTkJMRWRCUmtRN1FVRkhRVHRCUVVORUxFTkJVRVE3TzBGQlUwRXNTVUZCVFN4eFFrRkJjVUlzVTBGQmNrSXNhMEpCUVhGQ0xFZEJRVTA3UVVGRGFFTXNTMEZCU1N4TlFVRk5MRk5CUVZNc1lVRkJWQ3hEUVVGMVFpeExRVUYyUWl4RFFVRldPMEZCUTBFc1MwRkJTU3hUUVVGS0xFZEJRV2RDTEdkQ1FVRm9RanRCUVVOQkxFdEJRVWtzV1VGQlNpeERRVUZwUWl4SlFVRnFRaXhGUVVGMVFpeG5Ra0ZCZGtJN1FVRkRRU3hMUVVGSkxGTkJRVW9zUjBGQlowSXNkVVZCUTJZc2VVOUJSRVE3UVVGRlFTeExRVUZKTEdGQlFVb3NRMEZCYTBJc2QwSkJRV3hDTEVWQlFUUkRMR2RDUVVFMVF5eERRVUUyUkN4UFFVRTNSQ3hGUVVGelJTeHBRa0ZCZEVVN08wRkJSVUVzVlVGQlV5eGhRVUZVTEVOQlFYVkNMRTFCUVhaQ0xFVkJRU3RDTEZsQlFTOUNMRU5CUVRSRExFZEJRVFZETEVWQlFXbEVMRk5CUVZNc1lVRkJWQ3hEUVVGMVFpeFRRVUYyUWl4RFFVRnFSRHRCUVVOQkxFTkJWRVE3TzBGQlYwRXNTVUZCVFN4dlFrRkJiMElzVTBGQmNFSXNhVUpCUVc5Q0xFZEJRVTA3UVVGREwwSXNkMEpCUVZVc1pVRkJWaXhGUVVFeVFpeEpRVUV6UWl4RlFVRnBReXhIUVVGcVF6dEJRVU5CTEZWQlFWTXNZVUZCVkN4RFFVRjFRaXhwUWtGQmRrSXNSVUZCTUVNc1RVRkJNVU03UVVGRFFTeERRVWhFT3p0QlFVdEJMRWxCUVUwc2IwSkJRVzlDTEZOQlFYQkNMR2xDUVVGdlFpeEhRVUZOTzBGQlF5OUNMRXRCUVVrc1EwRkJReXgxUWtGQlZTeGxRVUZXTEVOQlFVd3NSVUZEUXp0QlFVTkVMRU5CU0VRN08wRkJTMEVzU1VGQlRTeHJRa0ZCYTBJc1UwRkJiRUlzWlVGQmEwSXNRMEZCUXl4RFFVRkVMRVZCUVU4N1FVRkRPVUlzUzBGQlNTeExRVUZMTEVWQlFVVXNZVUZCV0RzN1FVRkZRU3hKUVVGSExFdEJRVWdzUTBGQlV5eE5RVUZVTEVkQlFXdENMRTFCUVd4Q08wRkJRMEVzU1VGQlJ5eExRVUZJTEVOQlFWTXNUVUZCVkN4SFFVRnJRaXhIUVVGSExGbEJRVWdzUjBGQmEwSXNTVUZCY0VNN1FVRkRRU3hEUVV4RU96dEJRVTlCTEVsQlFVMHNiMEpCUVc5Q0xGTkJRWEJDTEdsQ1FVRnZRaXhEUVVGRExFMUJRVVFzUlVGQldUdEJRVU55UXl4TFFVRkpMRmRCUVZjc1UwRkJVeXhqUVVGVUxFTkJRWGRDTEdsQ1FVRjRRaXhEUVVGbU8wRkJRMEVzUzBGQlNTeFhRVUZYTEZOQlFWTXNZMEZCVkN4RFFVRjNRaXhwUWtGQmVFSXNRMEZCWmpzN1FVRkZRU3hWUVVGVExFdEJRVlFzUjBGQmFVSXNVMEZCVXl4UFFVRlBMRU5CUVZBc1EwRkJWQ3hEUVVGcVFqdEJRVU5CTEZWQlFWTXNTMEZCVkN4SFFVRnBRaXhUUVVGVExFOUJRVThzUTBGQlVDeERRVUZVTEVOQlFXcENPMEZCUTBFc1EwRk9SRHM3UVVGUlFTeEpRVUZKTEV0QlFVc3NTVUZCVkR0QlFVTkJMRWxCUVUwc2JVSkJRVzFDTEZOQlFXNUNMR2RDUVVGdFFpeERRVUZETEVOQlFVUXNSVUZCVHp0QlFVTXZRaXhMUVVGTkxGTkJRVk1zVTBGQlV5eGpRVUZVTEVOQlFYZENMR0ZCUVhoQ0xFTkJRV1k3UVVGRFFTeExRVUZKTEZWQlFWVXNSVUZCUlN4aFFVRm9RanRCUVVOQkxFdEJRVWtzVFVGQlRTeFRRVUZUTEZGQlFWRXNXVUZCVWl4RFFVRnhRaXhMUVVGeVFpeERRVUZVTEVOQlFWWTdRVUZCUVN4TFFVTkRMRTFCUVUwc1UwRkJVeXhSUVVGUkxGbEJRVklzUTBGQmNVSXNTMEZCY2tJc1EwRkJWQ3hEUVVSUU8wRkJSVUVzUzBGQlNTeFhRVUZYTEZOQlFWTXNZMEZCVkN4RFFVRjNRaXhwUWtGQmVFSXNRMEZCWmp0QlFVTkJMRXRCUVVrc1YwRkJWeXhUUVVGVExHTkJRVlFzUTBGQmQwSXNhVUpCUVhoQ0xFTkJRV1k3TzBGQlJVRXNZMEZCWVN4RlFVRmlPMEZCUTBFc1RVRkJTeXhYUVVGWExGbEJRVTA3UVVGRGNrSXNWVUZCVVN4SFFVRlNMRU5CUVZrc1VVRkJVU3hMUVVGd1FqdEJRVU5CTEUxQlFVa3NXVUZCV1N4UlFVRm9RaXhGUVVFd1FqdEJRVU42UWl4UFFVRkpMRk5CUVZNc1VVRkJVU3hMUVVGcVFpeEpRVUV3UWl4VFFVRlRMRk5CUVZNc1MwRkJiRUlzUTBGQk9VSXNSVUZEUXl4UlFVRlJMRXRCUVZJc1IwRkJaMElzVTBGQlV5eExRVUY2UWp0QlFVTkVMRWRCU0VRc1RVRkhUenRCUVVOT0xFOUJRVWtzVTBGQlV5eFJRVUZSTEV0QlFXcENMRWxCUVRCQ0xGTkJRVk1zVTBGQlV5eExRVUZzUWl4RFFVRTVRaXhGUVVORExGRkJRVkVzUzBGQlVpeEhRVUZuUWl4VFFVRlRMRXRCUVhwQ08wRkJRMFE3TzBGQlJVUXNUVUZCU1N4VFFVRlRMRkZCUVZFc1MwRkJha0lzU1VGQk1FSXNSMEZCTVVJc1NVRkJhVU1zVTBGQlV5eFJRVUZSTEV0QlFXcENMRWxCUVRCQ0xFZEJRVE5FTEVsQlFXdEZMRTFCUVUwc1UwRkJVeXhSUVVGUkxFdEJRV3BDTEVOQlFVNHNRMEZCZEVVc1JVRkJjMGM3UVVGRGNrY3NWMEZCVVN4TFFVRlNMRWRCUVdkQ0xGRkJRVkVzV1VGQlVpeERRVUZ4UWl4SlFVRnlRaXhOUVVFclFpeHBRa0ZCTDBJc1IwRkJiVVFzUjBGQmJrUXNSMEZCZVVRc1IwRkJla1U3UVVGRFFUczdRVUZGUkN4VFFVRlBMRlZCUVZBc1EwRkJhMElzUjBGQmJFSXNRMEZCYzBJc1EwRkJReXhUUVVGVExFdEJRVllzUlVGQmFVSXNVMEZCVXl4TFFVRXhRaXhEUVVGMFFqdEJRVU5CTEVWQlpra3NSVUZsUml4SFFXWkZMRU5CUVV3N1FVRnBRa0VzUTBFeFFrUTdPMEZCTkVKQkxFbEJRVTBzYTBKQlFXdENMRk5CUVd4Q0xHVkJRV3RDTEVkQlFVMDdRVUZETjBJc1MwRkJTU3hUUVVGVExGTkJRVk1zWTBGQlZDeERRVUYzUWl4aFFVRjRRaXhEUVVGaU8wRkJRMEVzUzBGQlNTeFBRVUZQTEZOQlFWTXNZVUZCVkN4RFFVRjFRaXgxUWtGQmRrSXNRMEZCV0RzN1FVRkZRU3hMUVVGSkxGVkJRVlVzU1VGQlpDeEZRVUZ2UWpzN1FVRkZia0lzVFVGQlNTeE5RVUZOTEZOQlFWTXNTMEZCU3l4WlFVRk1MRU5CUVd0Q0xGVkJRV3hDTEVOQlFWUXNRMEZCVmp0QlFVTkJMRTFCUVVrc1RVRkJUU3hUUVVGVExFdEJRVXNzV1VGQlRDeERRVUZyUWl4VlFVRnNRaXhEUVVGVUxFTkJRVlk3TzBGQlJVRXNkVUpCUVZjc1RVRkJXQ3hEUVVGclFpeE5RVUZzUWl4RlFVRXdRanRCUVVONlFpeFZRVUZQTEVOQlFVTXNUVUZCVFN4RlFVRlFMRVZCUVZjc1RVRkJUU3hGUVVGcVFpeERRVVJyUWp0QlFVVjZRaXhUUVVGTkxFTkJSbTFDTzBGQlIzcENMRmxCUVZNc1NVRklaMEk3UVVGSmVrSXNWVUZCVHp0QlFVTk9MRmRCUVU4c1IwRkVSRHRCUVVWT0xGZEJRVTg3UVVGR1JEdEJRVXByUWl4SFFVRXhRanM3UVVGVlFTeHZRa0ZCYTBJc1EwRkJReXhOUVVGTkxFVkJRVkFzUlVGQlZ5eE5RVUZOTEVWQlFXcENMRU5CUVd4Q096dEJRVVZCTEZOQlFVOHNWVUZCVUN4RFFVRnJRaXhGUVVGc1FpeERRVUZ4UWl4UlFVRnlRaXhGUVVFclFpeHBRa0ZCTDBJN1FVRkRRVHRCUVVORUxFTkJka0pFT3p0clFrRXdRbVVzWVNJc0ltWnBiR1VpT2lKblpXNWxjbUYwWldRdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lLR1oxYm1OMGFXOXVLQ2w3Wm5WdVkzUnBiMjRnY2lobExHNHNkQ2w3Wm5WdVkzUnBiMjRnYnlocExHWXBlMmxtS0NGdVcybGRLWHRwWmlnaFpWdHBYU2w3ZG1GeUlHTTlYQ0ptZFc1amRHbHZibHdpUFQxMGVYQmxiMllnY21WeGRXbHlaU1ltY21WeGRXbHlaVHRwWmlnaFppWW1ZeWx5WlhSMWNtNGdZeWhwTENFd0tUdHBaaWgxS1hKbGRIVnliaUIxS0drc0lUQXBPM1poY2lCaFBXNWxkeUJGY25KdmNpaGNJa05oYm01dmRDQm1hVzVrSUcxdlpIVnNaU0FuWENJcmFTdGNJaWRjSWlrN2RHaHliM2NnWVM1amIyUmxQVndpVFU5RVZVeEZYMDVQVkY5R1QxVk9SRndpTEdGOWRtRnlJSEE5Ymx0cFhUMTdaWGh3YjNKMGN6cDdmWDA3WlZ0cFhWc3dYUzVqWVd4c0tIQXVaWGh3YjNKMGN5eG1kVzVqZEdsdmJpaHlLWHQyWVhJZ2JqMWxXMmxkV3pGZFczSmRPM0psZEhWeWJpQnZLRzU4ZkhJcGZTeHdMSEF1Wlhod2IzSjBjeXh5TEdVc2JpeDBLWDF5WlhSMWNtNGdibHRwWFM1bGVIQnZjblJ6ZldadmNpaDJZWElnZFQxY0ltWjFibU4wYVc5dVhDSTlQWFI1Y0dWdlppQnlaWEYxYVhKbEppWnlaWEYxYVhKbExHazlNRHRwUEhRdWJHVnVaM1JvTzJrckt5bHZLSFJiYVYwcE8zSmxkSFZ5YmlCdmZYSmxkSFZ5YmlCeWZTa29LU0lzSW5aaGNpQnliMjkwSUQwZ2NtVnhkV2x5WlNnbkxpOWZjbTl2ZENjcE8xeHVYRzR2S2lvZ1FuVnBiSFF0YVc0Z2RtRnNkV1VnY21WbVpYSmxibU5sY3k0Z0tpOWNiblpoY2lCVGVXMWliMndnUFNCeWIyOTBMbE41YldKdmJEdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JUZVcxaWIydzdYRzRpTENKMllYSWdVM2x0WW05c0lEMGdjbVZ4ZFdseVpTZ25MaTlmVTNsdFltOXNKeWtzWEc0Z0lDQWdaMlYwVW1GM1ZHRm5JRDBnY21WeGRXbHlaU2duTGk5ZloyVjBVbUYzVkdGbkp5a3NYRzRnSUNBZ2IySnFaV04wVkc5VGRISnBibWNnUFNCeVpYRjFhWEpsS0NjdUwxOXZZbXBsWTNSVWIxTjBjbWx1WnljcE8xeHVYRzR2S2lvZ1lFOWlhbVZqZENOMGIxTjBjbWx1WjJBZ2NtVnpkV3gwSUhKbFptVnlaVzVqWlhNdUlDb3ZYRzUyWVhJZ2JuVnNiRlJoWnlBOUlDZGJiMkpxWldOMElFNTFiR3hkSnl4Y2JpQWdJQ0IxYm1SbFptbHVaV1JVWVdjZ1BTQW5XMjlpYW1WamRDQlZibVJsWm1sdVpXUmRKenRjYmx4dUx5b3FJRUoxYVd4MExXbHVJSFpoYkhWbElISmxabVZ5Wlc1alpYTXVJQ292WEc1MllYSWdjM2x0Vkc5VGRISnBibWRVWVdjZ1BTQlRlVzFpYjJ3Z1B5QlRlVzFpYjJ3dWRHOVRkSEpwYm1kVVlXY2dPaUIxYm1SbFptbHVaV1E3WEc1Y2JpOHFLbHh1SUNvZ1ZHaGxJR0poYzJVZ2FXMXdiR1Z0Wlc1MFlYUnBiMjRnYjJZZ1lHZGxkRlJoWjJBZ2QybDBhRzkxZENCbVlXeHNZbUZqYTNNZ1ptOXlJR0oxWjJkNUlHVnVkbWx5YjI1dFpXNTBjeTVjYmlBcVhHNGdLaUJBY0hKcGRtRjBaVnh1SUNvZ1FIQmhjbUZ0SUhzcWZTQjJZV3gxWlNCVWFHVWdkbUZzZFdVZ2RHOGdjWFZsY25rdVhHNGdLaUJBY21WMGRYSnVjeUI3YzNSeWFXNW5mU0JTWlhSMWNtNXpJSFJvWlNCZ2RHOVRkSEpwYm1kVVlXZGdMbHh1SUNvdlhHNW1kVzVqZEdsdmJpQmlZWE5sUjJWMFZHRm5LSFpoYkhWbEtTQjdYRzRnSUdsbUlDaDJZV3gxWlNBOVBTQnVkV3hzS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFpoYkhWbElEMDlQU0IxYm1SbFptbHVaV1FnUHlCMWJtUmxabWx1WldSVVlXY2dPaUJ1ZFd4c1ZHRm5PMXh1SUNCOVhHNGdJSEpsZEhWeWJpQW9jM2x0Vkc5VGRISnBibWRVWVdjZ0ppWWdjM2x0Vkc5VGRISnBibWRVWVdjZ2FXNGdUMkpxWldOMEtIWmhiSFZsS1NsY2JpQWdJQ0EvSUdkbGRGSmhkMVJoWnloMllXeDFaU2xjYmlBZ0lDQTZJRzlpYW1WamRGUnZVM1J5YVc1bktIWmhiSFZsS1R0Y2JuMWNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JpWVhObFIyVjBWR0ZuTzF4dUlpd2lMeW9xSUVSbGRHVmpkQ0JtY21WbElIWmhjbWxoWW14bElHQm5iRzlpWVd4Z0lHWnliMjBnVG05a1pTNXFjeTRnS2k5Y2JuWmhjaUJtY21WbFIyeHZZbUZzSUQwZ2RIbHdaVzltSUdkc2IySmhiQ0E5UFNBbmIySnFaV04wSnlBbUppQm5iRzlpWVd3Z0ppWWdaMnh2WW1Gc0xrOWlhbVZqZENBOVBUMGdUMkpxWldOMElDWW1JR2RzYjJKaGJEdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JtY21WbFIyeHZZbUZzTzF4dUlpd2lkbUZ5SUZONWJXSnZiQ0E5SUhKbGNYVnBjbVVvSnk0dlgxTjViV0p2YkNjcE8xeHVYRzR2S2lvZ1ZYTmxaQ0JtYjNJZ1luVnBiSFF0YVc0Z2JXVjBhRzlrSUhKbFptVnlaVzVqWlhNdUlDb3ZYRzUyWVhJZ2IySnFaV04wVUhKdmRHOGdQU0JQWW1wbFkzUXVjSEp2ZEc5MGVYQmxPMXh1WEc0dktpb2dWWE5sWkNCMGJ5QmphR1ZqYXlCdlltcGxZM1J6SUdadmNpQnZkMjRnY0hKdmNHVnlkR2xsY3k0Z0tpOWNiblpoY2lCb1lYTlBkMjVRY205d1pYSjBlU0E5SUc5aWFtVmpkRkJ5YjNSdkxtaGhjMDkzYmxCeWIzQmxjblI1TzF4dVhHNHZLaXBjYmlBcUlGVnpaV1FnZEc4Z2NtVnpiMngyWlNCMGFHVmNiaUFxSUZ0Z2RHOVRkSEpwYm1kVVlXZGdYU2hvZEhSd09pOHZaV050WVMxcGJuUmxjbTVoZEdsdmJtRnNMbTl5Wnk5bFkyMWhMVEkyTWk4M0xqQXZJM05sWXkxdlltcGxZM1F1Y0hKdmRHOTBlWEJsTG5SdmMzUnlhVzVuS1Z4dUlDb2diMllnZG1Gc2RXVnpMbHh1SUNvdlhHNTJZWElnYm1GMGFYWmxUMkpxWldOMFZHOVRkSEpwYm1jZ1BTQnZZbXBsWTNSUWNtOTBieTUwYjFOMGNtbHVaenRjYmx4dUx5b3FJRUoxYVd4MExXbHVJSFpoYkhWbElISmxabVZ5Wlc1alpYTXVJQ292WEc1MllYSWdjM2x0Vkc5VGRISnBibWRVWVdjZ1BTQlRlVzFpYjJ3Z1B5QlRlVzFpYjJ3dWRHOVRkSEpwYm1kVVlXY2dPaUIxYm1SbFptbHVaV1E3WEc1Y2JpOHFLbHh1SUNvZ1FTQnpjR1ZqYVdGc2FYcGxaQ0IyWlhKemFXOXVJRzltSUdCaVlYTmxSMlYwVkdGbllDQjNhR2xqYUNCcFoyNXZjbVZ6SUdCVGVXMWliMnd1ZEc5VGRISnBibWRVWVdkZ0lIWmhiSFZsY3k1Y2JpQXFYRzRnS2lCQWNISnBkbUYwWlZ4dUlDb2dRSEJoY21GdElIc3FmU0IyWVd4MVpTQlVhR1VnZG1Gc2RXVWdkRzhnY1hWbGNua3VYRzRnS2lCQWNtVjBkWEp1Y3lCN2MzUnlhVzVuZlNCU1pYUjFjbTV6SUhSb1pTQnlZWGNnWUhSdlUzUnlhVzVuVkdGbllDNWNiaUFxTDF4dVpuVnVZM1JwYjI0Z1oyVjBVbUYzVkdGbktIWmhiSFZsS1NCN1hHNGdJSFpoY2lCcGMwOTNiaUE5SUdoaGMwOTNibEJ5YjNCbGNuUjVMbU5oYkd3b2RtRnNkV1VzSUhONWJWUnZVM1J5YVc1blZHRm5LU3hjYmlBZ0lDQWdJSFJoWnlBOUlIWmhiSFZsVzNONWJWUnZVM1J5YVc1blZHRm5YVHRjYmx4dUlDQjBjbmtnZTF4dUlDQWdJSFpoYkhWbFczTjViVlJ2VTNSeWFXNW5WR0ZuWFNBOUlIVnVaR1ZtYVc1bFpEdGNiaUFnSUNCMllYSWdkVzV0WVhOclpXUWdQU0IwY25WbE8xeHVJQ0I5SUdOaGRHTm9JQ2hsS1NCN2ZWeHVYRzRnSUhaaGNpQnlaWE4xYkhRZ1BTQnVZWFJwZG1WUFltcGxZM1JVYjFOMGNtbHVaeTVqWVd4c0tIWmhiSFZsS1R0Y2JpQWdhV1lnS0hWdWJXRnphMlZrS1NCN1hHNGdJQ0FnYVdZZ0tHbHpUM2R1S1NCN1hHNGdJQ0FnSUNCMllXeDFaVnR6ZVcxVWIxTjBjbWx1WjFSaFoxMGdQU0IwWVdjN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJR1JsYkdWMFpTQjJZV3gxWlZ0emVXMVViMU4wY21sdVoxUmhaMTA3WEc0Z0lDQWdmVnh1SUNCOVhHNGdJSEpsZEhWeWJpQnlaWE4xYkhRN1hHNTlYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnWjJWMFVtRjNWR0ZuTzF4dUlpd2lMeW9xSUZWelpXUWdabTl5SUdKMWFXeDBMV2x1SUcxbGRHaHZaQ0J5WldabGNtVnVZMlZ6TGlBcUwxeHVkbUZ5SUc5aWFtVmpkRkJ5YjNSdklEMGdUMkpxWldOMExuQnliM1J2ZEhsd1pUdGNibHh1THlvcVhHNGdLaUJWYzJWa0lIUnZJSEpsYzI5c2RtVWdkR2hsWEc0Z0tpQmJZSFJ2VTNSeWFXNW5WR0ZuWUYwb2FIUjBjRG92TDJWamJXRXRhVzUwWlhKdVlYUnBiMjVoYkM1dmNtY3ZaV050WVMweU5qSXZOeTR3THlOelpXTXRiMkpxWldOMExuQnliM1J2ZEhsd1pTNTBiM04wY21sdVp5bGNiaUFxSUc5bUlIWmhiSFZsY3k1Y2JpQXFMMXh1ZG1GeUlHNWhkR2wyWlU5aWFtVmpkRlJ2VTNSeWFXNW5JRDBnYjJKcVpXTjBVSEp2ZEc4dWRHOVRkSEpwYm1jN1hHNWNiaThxS2x4dUlDb2dRMjl1ZG1WeWRITWdZSFpoYkhWbFlDQjBieUJoSUhOMGNtbHVaeUIxYzJsdVp5QmdUMkpxWldOMExuQnliM1J2ZEhsd1pTNTBiMU4wY21sdVoyQXVYRzRnS2x4dUlDb2dRSEJ5YVhaaGRHVmNiaUFxSUVCd1lYSmhiU0I3S24wZ2RtRnNkV1VnVkdobElIWmhiSFZsSUhSdklHTnZiblpsY25RdVhHNGdLaUJBY21WMGRYSnVjeUI3YzNSeWFXNW5mU0JTWlhSMWNtNXpJSFJvWlNCamIyNTJaWEowWldRZ2MzUnlhVzVuTGx4dUlDb3ZYRzVtZFc1amRHbHZiaUJ2WW1wbFkzUlViMU4wY21sdVp5aDJZV3gxWlNrZ2UxeHVJQ0J5WlhSMWNtNGdibUYwYVhabFQySnFaV04wVkc5VGRISnBibWN1WTJGc2JDaDJZV3gxWlNrN1hHNTlYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnYjJKcVpXTjBWRzlUZEhKcGJtYzdYRzRpTENKMllYSWdabkpsWlVkc2IySmhiQ0E5SUhKbGNYVnBjbVVvSnk0dlgyWnlaV1ZIYkc5aVlXd25LVHRjYmx4dUx5b3FJRVJsZEdWamRDQm1jbVZsSUhaaGNtbGhZbXhsSUdCelpXeG1ZQzRnS2k5Y2JuWmhjaUJtY21WbFUyVnNaaUE5SUhSNWNHVnZaaUJ6Wld4bUlEMDlJQ2R2WW1wbFkzUW5JQ1ltSUhObGJHWWdKaVlnYzJWc1ppNVBZbXBsWTNRZ1BUMDlJRTlpYW1WamRDQW1KaUJ6Wld4bU8xeHVYRzR2S2lvZ1ZYTmxaQ0JoY3lCaElISmxabVZ5Wlc1alpTQjBieUIwYUdVZ1oyeHZZbUZzSUc5aWFtVmpkQzRnS2k5Y2JuWmhjaUJ5YjI5MElEMGdabkpsWlVkc2IySmhiQ0I4ZkNCbWNtVmxVMlZzWmlCOGZDQkdkVzVqZEdsdmJpZ25jbVYwZFhKdUlIUm9hWE1uS1NncE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJSEp2YjNRN1hHNGlMQ0oyWVhJZ2FYTlBZbXBsWTNRZ1BTQnlaWEYxYVhKbEtDY3VMMmx6VDJKcVpXTjBKeWtzWEc0Z0lDQWdibTkzSUQwZ2NtVnhkV2x5WlNnbkxpOXViM2NuS1N4Y2JpQWdJQ0IwYjA1MWJXSmxjaUE5SUhKbGNYVnBjbVVvSnk0dmRHOU9kVzFpWlhJbktUdGNibHh1THlvcUlFVnljbTl5SUcxbGMzTmhaMlVnWTI5dWMzUmhiblJ6TGlBcUwxeHVkbUZ5SUVaVlRrTmZSVkpTVDFKZlZFVllWQ0E5SUNkRmVIQmxZM1JsWkNCaElHWjFibU4wYVc5dUp6dGNibHh1THlvZ1FuVnBiSFF0YVc0Z2JXVjBhRzlrSUhKbFptVnlaVzVqWlhNZ1ptOXlJSFJvYjNObElIZHBkR2dnZEdobElITmhiV1VnYm1GdFpTQmhjeUJ2ZEdobGNpQmdiRzlrWVhOb1lDQnRaWFJvYjJSekxpQXFMMXh1ZG1GeUlHNWhkR2wyWlUxaGVDQTlJRTFoZEdndWJXRjRMRnh1SUNBZ0lHNWhkR2wyWlUxcGJpQTlJRTFoZEdndWJXbHVPMXh1WEc0dktpcGNiaUFxSUVOeVpXRjBaWE1nWVNCa1pXSnZkVzVqWldRZ1puVnVZM1JwYjI0Z2RHaGhkQ0JrWld4aGVYTWdhVzUyYjJ0cGJtY2dZR1oxYm1OZ0lIVnVkR2xzSUdGbWRHVnlJR0IzWVdsMFlGeHVJQ29nYldsc2JHbHpaV052Ym1SeklHaGhkbVVnWld4aGNITmxaQ0J6YVc1alpTQjBhR1VnYkdGemRDQjBhVzFsSUhSb1pTQmtaV0p2ZFc1alpXUWdablZ1WTNScGIyNGdkMkZ6WEc0Z0tpQnBiblp2YTJWa0xpQlVhR1VnWkdWaWIzVnVZMlZrSUdaMWJtTjBhVzl1SUdOdmJXVnpJSGRwZEdnZ1lTQmdZMkZ1WTJWc1lDQnRaWFJvYjJRZ2RHOGdZMkZ1WTJWc1hHNGdLaUJrWld4aGVXVmtJR0JtZFc1allDQnBiblp2WTJGMGFXOXVjeUJoYm1RZ1lTQmdabXgxYzJoZ0lHMWxkR2h2WkNCMGJ5QnBiVzFsWkdsaGRHVnNlU0JwYm5admEyVWdkR2hsYlM1Y2JpQXFJRkJ5YjNacFpHVWdZRzl3ZEdsdmJuTmdJSFJ2SUdsdVpHbGpZWFJsSUhkb1pYUm9aWElnWUdaMWJtTmdJSE5vYjNWc1pDQmlaU0JwYm5admEyVmtJRzl1SUhSb1pWeHVJQ29nYkdWaFpHbHVaeUJoYm1RdmIzSWdkSEpoYVd4cGJtY2daV1JuWlNCdlppQjBhR1VnWUhkaGFYUmdJSFJwYldWdmRYUXVJRlJvWlNCZ1puVnVZMkFnYVhNZ2FXNTJiMnRsWkZ4dUlDb2dkMmwwYUNCMGFHVWdiR0Z6ZENCaGNtZDFiV1Z1ZEhNZ2NISnZkbWxrWldRZ2RHOGdkR2hsSUdSbFltOTFibU5sWkNCbWRXNWpkR2x2Ymk0Z1UzVmljMlZ4ZFdWdWRGeHVJQ29nWTJGc2JITWdkRzhnZEdobElHUmxZbTkxYm1ObFpDQm1kVzVqZEdsdmJpQnlaWFIxY200Z2RHaGxJSEpsYzNWc2RDQnZaaUIwYUdVZ2JHRnpkQ0JnWm5WdVkyQmNiaUFxSUdsdWRtOWpZWFJwYjI0dVhHNGdLbHh1SUNvZ0tpcE9iM1JsT2lvcUlFbG1JR0JzWldGa2FXNW5ZQ0JoYm1RZ1lIUnlZV2xzYVc1bllDQnZjSFJwYjI1eklHRnlaU0JnZEhKMVpXQXNJR0JtZFc1allDQnBjMXh1SUNvZ2FXNTJiMnRsWkNCdmJpQjBhR1VnZEhKaGFXeHBibWNnWldSblpTQnZaaUIwYUdVZ2RHbHRaVzkxZENCdmJteDVJR2xtSUhSb1pTQmtaV0p2ZFc1alpXUWdablZ1WTNScGIyNWNiaUFxSUdseklHbHVkbTlyWldRZ2JXOXlaU0IwYUdGdUlHOXVZMlVnWkhWeWFXNW5JSFJvWlNCZ2QyRnBkR0FnZEdsdFpXOTFkQzVjYmlBcVhHNGdLaUJKWmlCZ2QyRnBkR0FnYVhNZ1lEQmdJR0Z1WkNCZ2JHVmhaR2x1WjJBZ2FYTWdZR1poYkhObFlDd2dZR1oxYm1OZ0lHbHVkbTlqWVhScGIyNGdhWE1nWkdWbVpYSnlaV1JjYmlBcUlIVnVkR2xzSUhSdklIUm9aU0J1WlhoMElIUnBZMnNzSUhOcGJXbHNZWElnZEc4Z1lITmxkRlJwYldWdmRYUmdJSGRwZEdnZ1lTQjBhVzFsYjNWMElHOW1JR0F3WUM1Y2JpQXFYRzRnS2lCVFpXVWdXMFJoZG1sa0lFTnZjbUpoWTJodkozTWdZWEowYVdOc1pWMG9hSFIwY0hNNkx5OWpjM010ZEhKcFkydHpMbU52YlM5a1pXSnZkVzVqYVc1bkxYUm9jbTkwZEd4cGJtY3RaWGh3YkdGcGJtVmtMV1Y0WVcxd2JHVnpMeWxjYmlBcUlHWnZjaUJrWlhSaGFXeHpJRzkyWlhJZ2RHaGxJR1JwWm1abGNtVnVZMlZ6SUdKbGRIZGxaVzRnWUY4dVpHVmliM1Z1WTJWZ0lHRnVaQ0JnWHk1MGFISnZkSFJzWldBdVhHNGdLbHh1SUNvZ1FITjBZWFJwWTF4dUlDb2dRRzFsYldKbGNrOW1JRjljYmlBcUlFQnphVzVqWlNBd0xqRXVNRnh1SUNvZ1FHTmhkR1ZuYjNKNUlFWjFibU4wYVc5dVhHNGdLaUJBY0dGeVlXMGdlMFoxYm1OMGFXOXVmU0JtZFc1aklGUm9aU0JtZFc1amRHbHZiaUIwYnlCa1pXSnZkVzVqWlM1Y2JpQXFJRUJ3WVhKaGJTQjdiblZ0WW1WeWZTQmJkMkZwZEQwd1hTQlVhR1VnYm5WdFltVnlJRzltSUcxcGJHeHBjMlZqYjI1a2N5QjBieUJrWld4aGVTNWNiaUFxSUVCd1lYSmhiU0I3VDJKcVpXTjBmU0JiYjNCMGFXOXVjejE3ZlYwZ1ZHaGxJRzl3ZEdsdmJuTWdiMkpxWldOMExseHVJQ29nUUhCaGNtRnRJSHRpYjI5c1pXRnVmU0JiYjNCMGFXOXVjeTVzWldGa2FXNW5QV1poYkhObFhWeHVJQ29nSUZOd1pXTnBabmtnYVc1MmIydHBibWNnYjI0Z2RHaGxJR3hsWVdScGJtY2daV1JuWlNCdlppQjBhR1VnZEdsdFpXOTFkQzVjYmlBcUlFQndZWEpoYlNCN2JuVnRZbVZ5ZlNCYmIzQjBhVzl1Y3k1dFlYaFhZV2wwWFZ4dUlDb2dJRlJvWlNCdFlYaHBiWFZ0SUhScGJXVWdZR1oxYm1OZ0lHbHpJR0ZzYkc5M1pXUWdkRzhnWW1VZ1pHVnNZWGxsWkNCaVpXWnZjbVVnYVhRbmN5QnBiblp2YTJWa0xseHVJQ29nUUhCaGNtRnRJSHRpYjI5c1pXRnVmU0JiYjNCMGFXOXVjeTUwY21GcGJHbHVaejEwY25WbFhWeHVJQ29nSUZOd1pXTnBabmtnYVc1MmIydHBibWNnYjI0Z2RHaGxJSFJ5WVdsc2FXNW5JR1ZrWjJVZ2IyWWdkR2hsSUhScGJXVnZkWFF1WEc0Z0tpQkFjbVYwZFhKdWN5QjdSblZ1WTNScGIyNTlJRkpsZEhWeWJuTWdkR2hsSUc1bGR5QmtaV0p2ZFc1alpXUWdablZ1WTNScGIyNHVYRzRnS2lCQVpYaGhiWEJzWlZ4dUlDcGNiaUFxSUM4dklFRjJiMmxrSUdOdmMzUnNlU0JqWVd4amRXeGhkR2x2Ym5NZ2QyaHBiR1VnZEdobElIZHBibVJ2ZHlCemFYcGxJR2x6SUdsdUlHWnNkWGd1WEc0Z0tpQnFVWFZsY25rb2QybHVaRzkzS1M1dmJpZ25jbVZ6YVhwbEp5d2dYeTVrWldKdmRXNWpaU2hqWVd4amRXeGhkR1ZNWVhsdmRYUXNJREUxTUNrcE8xeHVJQ3BjYmlBcUlDOHZJRWx1ZG05clpTQmdjMlZ1WkUxaGFXeGdJSGRvWlc0Z1kyeHBZMnRsWkN3Z1pHVmliM1Z1WTJsdVp5QnpkV0p6WlhGMVpXNTBJR05oYkd4ekxseHVJQ29nYWxGMVpYSjVLR1ZzWlcxbGJuUXBMbTl1S0NkamJHbGpheWNzSUY4dVpHVmliM1Z1WTJVb2MyVnVaRTFoYVd3c0lETXdNQ3dnZTF4dUlDb2dJQ0FuYkdWaFpHbHVaeWM2SUhSeWRXVXNYRzRnS2lBZ0lDZDBjbUZwYkdsdVp5YzZJR1poYkhObFhHNGdLaUI5S1NrN1hHNGdLbHh1SUNvZ0x5OGdSVzV6ZFhKbElHQmlZWFJqYUV4dloyQWdhWE1nYVc1MmIydGxaQ0J2Ym1ObElHRm1kR1Z5SURFZ2MyVmpiMjVrSUc5bUlHUmxZbTkxYm1ObFpDQmpZV3hzY3k1Y2JpQXFJSFpoY2lCa1pXSnZkVzVqWldRZ1BTQmZMbVJsWW05MWJtTmxLR0poZEdOb1RHOW5MQ0F5TlRBc0lIc2dKMjFoZUZkaGFYUW5PaUF4TURBd0lIMHBPMXh1SUNvZ2RtRnlJSE52ZFhKalpTQTlJRzVsZHlCRmRtVnVkRk52ZFhKalpTZ25MM04wY21WaGJTY3BPMXh1SUNvZ2FsRjFaWEo1S0hOdmRYSmpaU2t1YjI0b0oyMWxjM05oWjJVbkxDQmtaV0p2ZFc1alpXUXBPMXh1SUNwY2JpQXFJQzh2SUVOaGJtTmxiQ0IwYUdVZ2RISmhhV3hwYm1jZ1pHVmliM1Z1WTJWa0lHbHVkbTlqWVhScGIyNHVYRzRnS2lCcVVYVmxjbmtvZDJsdVpHOTNLUzV2YmlnbmNHOXdjM1JoZEdVbkxDQmtaV0p2ZFc1alpXUXVZMkZ1WTJWc0tUdGNiaUFxTDF4dVpuVnVZM1JwYjI0Z1pHVmliM1Z1WTJVb1puVnVZeXdnZDJGcGRDd2diM0IwYVc5dWN5a2dlMXh1SUNCMllYSWdiR0Z6ZEVGeVozTXNYRzRnSUNBZ0lDQnNZWE4wVkdocGN5eGNiaUFnSUNBZ0lHMWhlRmRoYVhRc1hHNGdJQ0FnSUNCeVpYTjFiSFFzWEc0Z0lDQWdJQ0IwYVcxbGNrbGtMRnh1SUNBZ0lDQWdiR0Z6ZEVOaGJHeFVhVzFsTEZ4dUlDQWdJQ0FnYkdGemRFbHVkbTlyWlZScGJXVWdQU0F3TEZ4dUlDQWdJQ0FnYkdWaFpHbHVaeUE5SUdaaGJITmxMRnh1SUNBZ0lDQWdiV0Y0YVc1bklEMGdabUZzYzJVc1hHNGdJQ0FnSUNCMGNtRnBiR2x1WnlBOUlIUnlkV1U3WEc1Y2JpQWdhV1lnS0hSNWNHVnZaaUJtZFc1aklDRTlJQ2RtZFc1amRHbHZiaWNwSUh0Y2JpQWdJQ0IwYUhKdmR5QnVaWGNnVkhsd1pVVnljbTl5S0VaVlRrTmZSVkpTVDFKZlZFVllWQ2s3WEc0Z0lIMWNiaUFnZDJGcGRDQTlJSFJ2VG5WdFltVnlLSGRoYVhRcElIeDhJREE3WEc0Z0lHbG1JQ2hwYzA5aWFtVmpkQ2h2Y0hScGIyNXpLU2tnZTF4dUlDQWdJR3hsWVdScGJtY2dQU0FoSVc5d2RHbHZibk11YkdWaFpHbHVaenRjYmlBZ0lDQnRZWGhwYm1jZ1BTQW5iV0Y0VjJGcGRDY2dhVzRnYjNCMGFXOXVjenRjYmlBZ0lDQnRZWGhYWVdsMElEMGdiV0Y0YVc1bklEOGdibUYwYVhabFRXRjRLSFJ2VG5WdFltVnlLRzl3ZEdsdmJuTXViV0Y0VjJGcGRDa2dmSHdnTUN3Z2QyRnBkQ2tnT2lCdFlYaFhZV2wwTzF4dUlDQWdJSFJ5WVdsc2FXNW5JRDBnSjNSeVlXbHNhVzVuSnlCcGJpQnZjSFJwYjI1eklEOGdJU0Z2Y0hScGIyNXpMblJ5WVdsc2FXNW5JRG9nZEhKaGFXeHBibWM3WEc0Z0lIMWNibHh1SUNCbWRXNWpkR2x2YmlCcGJuWnZhMlZHZFc1aktIUnBiV1VwSUh0Y2JpQWdJQ0IyWVhJZ1lYSm5jeUE5SUd4aGMzUkJjbWR6TEZ4dUlDQWdJQ0FnSUNCMGFHbHpRWEpuSUQwZ2JHRnpkRlJvYVhNN1hHNWNiaUFnSUNCc1lYTjBRWEpuY3lBOUlHeGhjM1JVYUdseklEMGdkVzVrWldacGJtVmtPMXh1SUNBZ0lHeGhjM1JKYm5admEyVlVhVzFsSUQwZ2RHbHRaVHRjYmlBZ0lDQnlaWE4xYkhRZ1BTQm1kVzVqTG1Gd2NHeDVLSFJvYVhOQmNtY3NJR0Z5WjNNcE8xeHVJQ0FnSUhKbGRIVnliaUJ5WlhOMWJIUTdYRzRnSUgxY2JseHVJQ0JtZFc1amRHbHZiaUJzWldGa2FXNW5SV1JuWlNoMGFXMWxLU0I3WEc0Z0lDQWdMeThnVW1WelpYUWdZVzU1SUdCdFlYaFhZV2wwWUNCMGFXMWxjaTVjYmlBZ0lDQnNZWE4wU1c1MmIydGxWR2x0WlNBOUlIUnBiV1U3WEc0Z0lDQWdMeThnVTNSaGNuUWdkR2hsSUhScGJXVnlJR1p2Y2lCMGFHVWdkSEpoYVd4cGJtY2daV1JuWlM1Y2JpQWdJQ0IwYVcxbGNrbGtJRDBnYzJWMFZHbHRaVzkxZENoMGFXMWxja1Y0Y0dseVpXUXNJSGRoYVhRcE8xeHVJQ0FnSUM4dklFbHVkbTlyWlNCMGFHVWdiR1ZoWkdsdVp5QmxaR2RsTGx4dUlDQWdJSEpsZEhWeWJpQnNaV0ZrYVc1bklEOGdhVzUyYjJ0bFJuVnVZeWgwYVcxbEtTQTZJSEpsYzNWc2REdGNiaUFnZlZ4dVhHNGdJR1oxYm1OMGFXOXVJSEpsYldGcGJtbHVaMWRoYVhRb2RHbHRaU2tnZTF4dUlDQWdJSFpoY2lCMGFXMWxVMmx1WTJWTVlYTjBRMkZzYkNBOUlIUnBiV1VnTFNCc1lYTjBRMkZzYkZScGJXVXNYRzRnSUNBZ0lDQWdJSFJwYldWVGFXNWpaVXhoYzNSSmJuWnZhMlVnUFNCMGFXMWxJQzBnYkdGemRFbHVkbTlyWlZScGJXVXNYRzRnSUNBZ0lDQWdJSFJwYldWWFlXbDBhVzVuSUQwZ2QyRnBkQ0F0SUhScGJXVlRhVzVqWlV4aGMzUkRZV3hzTzF4dVhHNGdJQ0FnY21WMGRYSnVJRzFoZUdsdVoxeHVJQ0FnSUNBZ1B5QnVZWFJwZG1WTmFXNG9kR2x0WlZkaGFYUnBibWNzSUcxaGVGZGhhWFFnTFNCMGFXMWxVMmx1WTJWTVlYTjBTVzUyYjJ0bEtWeHVJQ0FnSUNBZ09pQjBhVzFsVjJGcGRHbHVaenRjYmlBZ2ZWeHVYRzRnSUdaMWJtTjBhVzl1SUhOb2IzVnNaRWx1ZG05clpTaDBhVzFsS1NCN1hHNGdJQ0FnZG1GeUlIUnBiV1ZUYVc1alpVeGhjM1JEWVd4c0lEMGdkR2x0WlNBdElHeGhjM1JEWVd4c1ZHbHRaU3hjYmlBZ0lDQWdJQ0FnZEdsdFpWTnBibU5sVEdGemRFbHVkbTlyWlNBOUlIUnBiV1VnTFNCc1lYTjBTVzUyYjJ0bFZHbHRaVHRjYmx4dUlDQWdJQzh2SUVWcGRHaGxjaUIwYUdseklHbHpJSFJvWlNCbWFYSnpkQ0JqWVd4c0xDQmhZM1JwZG1sMGVTQm9ZWE1nYzNSdmNIQmxaQ0JoYm1RZ2QyVW5jbVVnWVhRZ2RHaGxYRzRnSUNBZ0x5OGdkSEpoYVd4cGJtY2daV1JuWlN3Z2RHaGxJSE41YzNSbGJTQjBhVzFsSUdoaGN5Qm5iMjVsSUdKaFkydDNZWEprY3lCaGJtUWdkMlVuY21VZ2RISmxZWFJwYm1kY2JpQWdJQ0F2THlCcGRDQmhjeUIwYUdVZ2RISmhhV3hwYm1jZ1pXUm5aU3dnYjNJZ2QyVW5kbVVnYUdsMElIUm9aU0JnYldGNFYyRnBkR0FnYkdsdGFYUXVYRzRnSUNBZ2NtVjBkWEp1SUNoc1lYTjBRMkZzYkZScGJXVWdQVDA5SUhWdVpHVm1hVzVsWkNCOGZDQW9kR2x0WlZOcGJtTmxUR0Z6ZEVOaGJHd2dQajBnZDJGcGRDa2dmSHhjYmlBZ0lDQWdJQ2gwYVcxbFUybHVZMlZNWVhOMFEyRnNiQ0E4SURBcElIeDhJQ2h0WVhocGJtY2dKaVlnZEdsdFpWTnBibU5sVEdGemRFbHVkbTlyWlNBK1BTQnRZWGhYWVdsMEtTazdYRzRnSUgxY2JseHVJQ0JtZFc1amRHbHZiaUIwYVcxbGNrVjRjR2x5WldRb0tTQjdYRzRnSUNBZ2RtRnlJSFJwYldVZ1BTQnViM2NvS1R0Y2JpQWdJQ0JwWmlBb2MyaHZkV3hrU1c1MmIydGxLSFJwYldVcEtTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2RISmhhV3hwYm1kRlpHZGxLSFJwYldVcE8xeHVJQ0FnSUgxY2JpQWdJQ0F2THlCU1pYTjBZWEowSUhSb1pTQjBhVzFsY2k1Y2JpQWdJQ0IwYVcxbGNrbGtJRDBnYzJWMFZHbHRaVzkxZENoMGFXMWxja1Y0Y0dseVpXUXNJSEpsYldGcGJtbHVaMWRoYVhRb2RHbHRaU2twTzF4dUlDQjlYRzVjYmlBZ1puVnVZM1JwYjI0Z2RISmhhV3hwYm1kRlpHZGxLSFJwYldVcElIdGNiaUFnSUNCMGFXMWxja2xrSUQwZ2RXNWtaV1pwYm1Wa08xeHVYRzRnSUNBZ0x5OGdUMjVzZVNCcGJuWnZhMlVnYVdZZ2QyVWdhR0YyWlNCZ2JHRnpkRUZ5WjNOZ0lIZG9hV05vSUcxbFlXNXpJR0JtZFc1allDQm9ZWE1nWW1WbGJseHVJQ0FnSUM4dklHUmxZbTkxYm1ObFpDQmhkQ0JzWldGemRDQnZibU5sTGx4dUlDQWdJR2xtSUNoMGNtRnBiR2x1WnlBbUppQnNZWE4wUVhKbmN5a2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHbHVkbTlyWlVaMWJtTW9kR2x0WlNrN1hHNGdJQ0FnZlZ4dUlDQWdJR3hoYzNSQmNtZHpJRDBnYkdGemRGUm9hWE1nUFNCMWJtUmxabWx1WldRN1hHNGdJQ0FnY21WMGRYSnVJSEpsYzNWc2REdGNiaUFnZlZ4dVhHNGdJR1oxYm1OMGFXOXVJR05oYm1ObGJDZ3BJSHRjYmlBZ0lDQnBaaUFvZEdsdFpYSkpaQ0FoUFQwZ2RXNWtaV1pwYm1Wa0tTQjdYRzRnSUNBZ0lDQmpiR1ZoY2xScGJXVnZkWFFvZEdsdFpYSkpaQ2s3WEc0Z0lDQWdmVnh1SUNBZ0lHeGhjM1JKYm5admEyVlVhVzFsSUQwZ01EdGNiaUFnSUNCc1lYTjBRWEpuY3lBOUlHeGhjM1JEWVd4c1ZHbHRaU0E5SUd4aGMzUlVhR2x6SUQwZ2RHbHRaWEpKWkNBOUlIVnVaR1ZtYVc1bFpEdGNiaUFnZlZ4dVhHNGdJR1oxYm1OMGFXOXVJR1pzZFhOb0tDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMGFXMWxja2xrSUQwOVBTQjFibVJsWm1sdVpXUWdQeUJ5WlhOMWJIUWdPaUIwY21GcGJHbHVaMFZrWjJVb2JtOTNLQ2twTzF4dUlDQjlYRzVjYmlBZ1puVnVZM1JwYjI0Z1pHVmliM1Z1WTJWa0tDa2dlMXh1SUNBZ0lIWmhjaUIwYVcxbElEMGdibTkzS0Nrc1hHNGdJQ0FnSUNBZ0lHbHpTVzUyYjJ0cGJtY2dQU0J6YUc5MWJHUkpiblp2YTJVb2RHbHRaU2s3WEc1Y2JpQWdJQ0JzWVhOMFFYSm5jeUE5SUdGeVozVnRaVzUwY3p0Y2JpQWdJQ0JzWVhOMFZHaHBjeUE5SUhSb2FYTTdYRzRnSUNBZ2JHRnpkRU5oYkd4VWFXMWxJRDBnZEdsdFpUdGNibHh1SUNBZ0lHbG1JQ2hwYzBsdWRtOXJhVzVuS1NCN1hHNGdJQ0FnSUNCcFppQW9kR2x0WlhKSlpDQTlQVDBnZFc1a1pXWnBibVZrS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCc1pXRmthVzVuUldSblpTaHNZWE4wUTJGc2JGUnBiV1VwTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJQ0FnYVdZZ0tHMWhlR2x1WnlrZ2UxeHVJQ0FnSUNBZ0lDQXZMeUJJWVc1a2JHVWdhVzUyYjJOaGRHbHZibk1nYVc0Z1lTQjBhV2RvZENCc2IyOXdMbHh1SUNBZ0lDQWdJQ0IwYVcxbGNrbGtJRDBnYzJWMFZHbHRaVzkxZENoMGFXMWxja1Y0Y0dseVpXUXNJSGRoYVhRcE8xeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2FXNTJiMnRsUm5WdVl5aHNZWE4wUTJGc2JGUnBiV1VwTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmlBZ0lDQnBaaUFvZEdsdFpYSkpaQ0E5UFQwZ2RXNWtaV1pwYm1Wa0tTQjdYRzRnSUNBZ0lDQjBhVzFsY2tsa0lEMGdjMlYwVkdsdFpXOTFkQ2gwYVcxbGNrVjRjR2x5WldRc0lIZGhhWFFwTzF4dUlDQWdJSDFjYmlBZ0lDQnlaWFIxY200Z2NtVnpkV3gwTzF4dUlDQjlYRzRnSUdSbFltOTFibU5sWkM1allXNWpaV3dnUFNCallXNWpaV3c3WEc0Z0lHUmxZbTkxYm1ObFpDNW1iSFZ6YUNBOUlHWnNkWE5vTzF4dUlDQnlaWFIxY200Z1pHVmliM1Z1WTJWa08xeHVmVnh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUdSbFltOTFibU5sTzF4dUlpd2lMeW9xWEc0Z0tpQkRhR1ZqYTNNZ2FXWWdZSFpoYkhWbFlDQnBjeUIwYUdWY2JpQXFJRnRzWVc1bmRXRm5aU0IwZVhCbFhTaG9kSFJ3T2k4dmQzZDNMbVZqYldFdGFXNTBaWEp1WVhScGIyNWhiQzV2Y21jdlpXTnRZUzB5TmpJdk55NHdMeU56WldNdFpXTnRZWE5qY21sd2RDMXNZVzVuZFdGblpTMTBlWEJsY3lsY2JpQXFJRzltSUdCUFltcGxZM1JnTGlBb1pTNW5MaUJoY25KaGVYTXNJR1oxYm1OMGFXOXVjeXdnYjJKcVpXTjBjeXdnY21WblpYaGxjeXdnWUc1bGR5Qk9kVzFpWlhJb01DbGdMQ0JoYm1RZ1lHNWxkeUJUZEhKcGJtY29KeWNwWUNsY2JpQXFYRzRnS2lCQWMzUmhkR2xqWEc0Z0tpQkFiV1Z0WW1WeVQyWWdYMXh1SUNvZ1FITnBibU5sSURBdU1TNHdYRzRnS2lCQVkyRjBaV2R2Y25rZ1RHRnVaMXh1SUNvZ1FIQmhjbUZ0SUhzcWZTQjJZV3gxWlNCVWFHVWdkbUZzZFdVZ2RHOGdZMmhsWTJzdVhHNGdLaUJBY21WMGRYSnVjeUI3WW05dmJHVmhibjBnVW1WMGRYSnVjeUJnZEhKMVpXQWdhV1lnWUhaaGJIVmxZQ0JwY3lCaGJpQnZZbXBsWTNRc0lHVnNjMlVnWUdaaGJITmxZQzVjYmlBcUlFQmxlR0Z0Y0d4bFhHNGdLbHh1SUNvZ1h5NXBjMDlpYW1WamRDaDdmU2s3WEc0Z0tpQXZMeUE5UGlCMGNuVmxYRzRnS2x4dUlDb2dYeTVwYzA5aWFtVmpkQ2hiTVN3Z01pd2dNMTBwTzF4dUlDb2dMeThnUFQ0Z2RISjFaVnh1SUNwY2JpQXFJRjh1YVhOUFltcGxZM1FvWHk1dWIyOXdLVHRjYmlBcUlDOHZJRDArSUhSeWRXVmNiaUFxWEc0Z0tpQmZMbWx6VDJKcVpXTjBLRzUxYkd3cE8xeHVJQ29nTHk4Z1BUNGdabUZzYzJWY2JpQXFMMXh1Wm5WdVkzUnBiMjRnYVhOUFltcGxZM1FvZG1Gc2RXVXBJSHRjYmlBZ2RtRnlJSFI1Y0dVZ1BTQjBlWEJsYjJZZ2RtRnNkV1U3WEc0Z0lISmxkSFZ5YmlCMllXeDFaU0FoUFNCdWRXeHNJQ1ltSUNoMGVYQmxJRDA5SUNkdlltcGxZM1FuSUh4OElIUjVjR1VnUFQwZ0oyWjFibU4wYVc5dUp5azdYRzU5WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2FYTlBZbXBsWTNRN1hHNGlMQ0l2S2lwY2JpQXFJRU5vWldOcmN5QnBaaUJnZG1Gc2RXVmdJR2x6SUc5aWFtVmpkQzFzYVd0bExpQkJJSFpoYkhWbElHbHpJRzlpYW1WamRDMXNhV3RsSUdsbUlHbDBKM01nYm05MElHQnVkV3hzWUZ4dUlDb2dZVzVrSUdoaGN5QmhJR0IwZVhCbGIyWmdJSEpsYzNWc2RDQnZaaUJjSW05aWFtVmpkRndpTGx4dUlDcGNiaUFxSUVCemRHRjBhV05jYmlBcUlFQnRaVzFpWlhKUFppQmZYRzRnS2lCQWMybHVZMlVnTkM0d0xqQmNiaUFxSUVCallYUmxaMjl5ZVNCTVlXNW5YRzRnS2lCQWNHRnlZVzBnZXlwOUlIWmhiSFZsSUZSb1pTQjJZV3gxWlNCMGJ5QmphR1ZqYXk1Y2JpQXFJRUJ5WlhSMWNtNXpJSHRpYjI5c1pXRnVmU0JTWlhSMWNtNXpJR0IwY25WbFlDQnBaaUJnZG1Gc2RXVmdJR2x6SUc5aWFtVmpkQzFzYVd0bExDQmxiSE5sSUdCbVlXeHpaV0F1WEc0Z0tpQkFaWGhoYlhCc1pWeHVJQ3BjYmlBcUlGOHVhWE5QWW1wbFkzUk1hV3RsS0h0OUtUdGNiaUFxSUM4dklEMCtJSFJ5ZFdWY2JpQXFYRzRnS2lCZkxtbHpUMkpxWldOMFRHbHJaU2hiTVN3Z01pd2dNMTBwTzF4dUlDb2dMeThnUFQ0Z2RISjFaVnh1SUNwY2JpQXFJRjh1YVhOUFltcGxZM1JNYVd0bEtGOHVibTl2Y0NrN1hHNGdLaUF2THlBOVBpQm1ZV3h6WlZ4dUlDcGNiaUFxSUY4dWFYTlBZbXBsWTNSTWFXdGxLRzUxYkd3cE8xeHVJQ29nTHk4Z1BUNGdabUZzYzJWY2JpQXFMMXh1Wm5WdVkzUnBiMjRnYVhOUFltcGxZM1JNYVd0bEtIWmhiSFZsS1NCN1hHNGdJSEpsZEhWeWJpQjJZV3gxWlNBaFBTQnVkV3hzSUNZbUlIUjVjR1Z2WmlCMllXeDFaU0E5UFNBbmIySnFaV04wSnp0Y2JuMWNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JwYzA5aWFtVmpkRXhwYTJVN1hHNGlMQ0oyWVhJZ1ltRnpaVWRsZEZSaFp5QTlJSEpsY1hWcGNtVW9KeTR2WDJKaGMyVkhaWFJVWVdjbktTeGNiaUFnSUNCcGMwOWlhbVZqZEV4cGEyVWdQU0J5WlhGMWFYSmxLQ2N1TDJselQySnFaV04wVEdsclpTY3BPMXh1WEc0dktpb2dZRTlpYW1WamRDTjBiMU4wY21sdVoyQWdjbVZ6ZFd4MElISmxabVZ5Wlc1alpYTXVJQ292WEc1MllYSWdjM2x0WW05c1ZHRm5JRDBnSjF0dlltcGxZM1FnVTNsdFltOXNYU2M3WEc1Y2JpOHFLbHh1SUNvZ1EyaGxZMnR6SUdsbUlHQjJZV3gxWldBZ2FYTWdZMnhoYzNOcFptbGxaQ0JoY3lCaElHQlRlVzFpYjJ4Z0lIQnlhVzFwZEdsMlpTQnZjaUJ2WW1wbFkzUXVYRzRnS2x4dUlDb2dRSE4wWVhScFkxeHVJQ29nUUcxbGJXSmxjazltSUY5Y2JpQXFJRUJ6YVc1alpTQTBMakF1TUZ4dUlDb2dRR05oZEdWbmIzSjVJRXhoYm1kY2JpQXFJRUJ3WVhKaGJTQjdLbjBnZG1Gc2RXVWdWR2hsSUhaaGJIVmxJSFJ2SUdOb1pXTnJMbHh1SUNvZ1FISmxkSFZ5Ym5NZ2UySnZiMnhsWVc1OUlGSmxkSFZ5Ym5NZ1lIUnlkV1ZnSUdsbUlHQjJZV3gxWldBZ2FYTWdZU0J6ZVcxaWIyd3NJR1ZzYzJVZ1lHWmhiSE5sWUM1Y2JpQXFJRUJsZUdGdGNHeGxYRzRnS2x4dUlDb2dYeTVwYzFONWJXSnZiQ2hUZVcxaWIyd3VhWFJsY21GMGIzSXBPMXh1SUNvZ0x5OGdQVDRnZEhKMVpWeHVJQ3BjYmlBcUlGOHVhWE5UZVcxaWIyd29KMkZpWXljcE8xeHVJQ29nTHk4Z1BUNGdabUZzYzJWY2JpQXFMMXh1Wm5WdVkzUnBiMjRnYVhOVGVXMWliMndvZG1Gc2RXVXBJSHRjYmlBZ2NtVjBkWEp1SUhSNWNHVnZaaUIyWVd4MVpTQTlQU0FuYzNsdFltOXNKeUI4ZkZ4dUlDQWdJQ2hwYzA5aWFtVmpkRXhwYTJVb2RtRnNkV1VwSUNZbUlHSmhjMlZIWlhSVVlXY29kbUZzZFdVcElEMDlJSE41YldKdmJGUmhaeWs3WEc1OVhHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdhWE5UZVcxaWIydzdYRzRpTENKMllYSWdjbTl2ZENBOUlISmxjWFZwY21Vb0p5NHZYM0p2YjNRbktUdGNibHh1THlvcVhHNGdLaUJIWlhSeklIUm9aU0IwYVcxbGMzUmhiWEFnYjJZZ2RHaGxJRzUxYldKbGNpQnZaaUJ0YVd4c2FYTmxZMjl1WkhNZ2RHaGhkQ0JvWVhabElHVnNZWEJ6WldRZ2MybHVZMlZjYmlBcUlIUm9aU0JWYm1sNElHVndiMk5vSUNneElFcGhiblZoY25rZ01UazNNQ0F3TURvd01Eb3dNQ0JWVkVNcExseHVJQ3BjYmlBcUlFQnpkR0YwYVdOY2JpQXFJRUJ0WlcxaVpYSlBaaUJmWEc0Z0tpQkFjMmx1WTJVZ01pNDBMakJjYmlBcUlFQmpZWFJsWjI5eWVTQkVZWFJsWEc0Z0tpQkFjbVYwZFhKdWN5QjdiblZ0WW1WeWZTQlNaWFIxY201eklIUm9aU0IwYVcxbGMzUmhiWEF1WEc0Z0tpQkFaWGhoYlhCc1pWeHVJQ3BjYmlBcUlGOHVaR1ZtWlhJb1puVnVZM1JwYjI0b2MzUmhiWEFwSUh0Y2JpQXFJQ0FnWTI5dWMyOXNaUzVzYjJjb1h5NXViM2NvS1NBdElITjBZVzF3S1R0Y2JpQXFJSDBzSUY4dWJtOTNLQ2twTzF4dUlDb2dMeThnUFQ0Z1RHOW5jeUIwYUdVZ2JuVnRZbVZ5SUc5bUlHMXBiR3hwYzJWamIyNWtjeUJwZENCMGIyOXJJR1p2Y2lCMGFHVWdaR1ZtWlhKeVpXUWdhVzUyYjJOaGRHbHZiaTVjYmlBcUwxeHVkbUZ5SUc1dmR5QTlJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQnlaWFIxY200Z2NtOXZkQzVFWVhSbExtNXZkeWdwTzF4dWZUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0J1YjNjN1hHNGlMQ0oyWVhJZ2FYTlBZbXBsWTNRZ1BTQnlaWEYxYVhKbEtDY3VMMmx6VDJKcVpXTjBKeWtzWEc0Z0lDQWdhWE5UZVcxaWIyd2dQU0J5WlhGMWFYSmxLQ2N1TDJselUzbHRZbTlzSnlrN1hHNWNiaThxS2lCVmMyVmtJR0Z6SUhKbFptVnlaVzVqWlhNZ1ptOXlJSFpoY21sdmRYTWdZRTUxYldKbGNtQWdZMjl1YzNSaGJuUnpMaUFxTDF4dWRtRnlJRTVCVGlBOUlEQWdMeUF3TzF4dVhHNHZLaW9nVlhObFpDQjBieUJ0WVhSamFDQnNaV0ZrYVc1bklHRnVaQ0IwY21GcGJHbHVaeUIzYUdsMFpYTndZV05sTGlBcUwxeHVkbUZ5SUhKbFZISnBiU0E5SUM5ZVhGeHpLM3hjWEhNckpDOW5PMXh1WEc0dktpb2dWWE5sWkNCMGJ5QmtaWFJsWTNRZ1ltRmtJSE5wWjI1bFpDQm9aWGhoWkdWamFXMWhiQ0J6ZEhKcGJtY2dkbUZzZFdWekxpQXFMMXh1ZG1GeUlISmxTWE5DWVdSSVpYZ2dQU0F2WGxzdEsxMHdlRnN3TFRsaExXWmRLeVF2YVR0Y2JseHVMeW9xSUZWelpXUWdkRzhnWkdWMFpXTjBJR0pwYm1GeWVTQnpkSEpwYm1jZ2RtRnNkV1Z6TGlBcUwxeHVkbUZ5SUhKbFNYTkNhVzVoY25rZ1BTQXZYakJpV3pBeFhTc2tMMms3WEc1Y2JpOHFLaUJWYzJWa0lIUnZJR1JsZEdWamRDQnZZM1JoYkNCemRISnBibWNnZG1Gc2RXVnpMaUFxTDF4dWRtRnlJSEpsU1hOUFkzUmhiQ0E5SUM5ZU1HOWJNQzAzWFNza0wyazdYRzVjYmk4cUtpQkNkV2xzZEMxcGJpQnRaWFJvYjJRZ2NtVm1aWEpsYm1ObGN5QjNhWFJvYjNWMElHRWdaR1Z3Wlc1a1pXNWplU0J2YmlCZ2NtOXZkR0F1SUNvdlhHNTJZWElnWm5KbFpWQmhjbk5sU1c1MElEMGdjR0Z5YzJWSmJuUTdYRzVjYmk4cUtseHVJQ29nUTI5dWRtVnlkSE1nWUhaaGJIVmxZQ0IwYnlCaElHNTFiV0psY2k1Y2JpQXFYRzRnS2lCQWMzUmhkR2xqWEc0Z0tpQkFiV1Z0WW1WeVQyWWdYMXh1SUNvZ1FITnBibU5sSURRdU1DNHdYRzRnS2lCQVkyRjBaV2R2Y25rZ1RHRnVaMXh1SUNvZ1FIQmhjbUZ0SUhzcWZTQjJZV3gxWlNCVWFHVWdkbUZzZFdVZ2RHOGdjSEp2WTJWemN5NWNiaUFxSUVCeVpYUjFjbTV6SUh0dWRXMWlaWEo5SUZKbGRIVnlibk1nZEdobElHNTFiV0psY2k1Y2JpQXFJRUJsZUdGdGNHeGxYRzRnS2x4dUlDb2dYeTUwYjA1MWJXSmxjaWd6TGpJcE8xeHVJQ29nTHk4Z1BUNGdNeTR5WEc0Z0tseHVJQ29nWHk1MGIwNTFiV0psY2loT2RXMWlaWEl1VFVsT1gxWkJURlZGS1R0Y2JpQXFJQzh2SUQwK0lEVmxMVE15TkZ4dUlDcGNiaUFxSUY4dWRHOU9kVzFpWlhJb1NXNW1hVzVwZEhrcE8xeHVJQ29nTHk4Z1BUNGdTVzVtYVc1cGRIbGNiaUFxWEc0Z0tpQmZMblJ2VG5WdFltVnlLQ2N6TGpJbktUdGNiaUFxSUM4dklEMCtJRE11TWx4dUlDb3ZYRzVtZFc1amRHbHZiaUIwYjA1MWJXSmxjaWgyWVd4MVpTa2dlMXh1SUNCcFppQW9kSGx3Wlc5bUlIWmhiSFZsSUQwOUlDZHVkVzFpWlhJbktTQjdYRzRnSUNBZ2NtVjBkWEp1SUhaaGJIVmxPMXh1SUNCOVhHNGdJR2xtSUNocGMxTjViV0p2YkNoMllXeDFaU2twSUh0Y2JpQWdJQ0J5WlhSMWNtNGdUa0ZPTzF4dUlDQjlYRzRnSUdsbUlDaHBjMDlpYW1WamRDaDJZV3gxWlNrcElIdGNiaUFnSUNCMllYSWdiM1JvWlhJZ1BTQjBlWEJsYjJZZ2RtRnNkV1V1ZG1Gc2RXVlBaaUE5UFNBblpuVnVZM1JwYjI0bklEOGdkbUZzZFdVdWRtRnNkV1ZQWmlncElEb2dkbUZzZFdVN1hHNGdJQ0FnZG1Gc2RXVWdQU0JwYzA5aWFtVmpkQ2h2ZEdobGNpa2dQeUFvYjNSb1pYSWdLeUFuSnlrZ09pQnZkR2hsY2p0Y2JpQWdmVnh1SUNCcFppQW9kSGx3Wlc5bUlIWmhiSFZsSUNFOUlDZHpkSEpwYm1jbktTQjdYRzRnSUNBZ2NtVjBkWEp1SUhaaGJIVmxJRDA5UFNBd0lEOGdkbUZzZFdVZ09pQXJkbUZzZFdVN1hHNGdJSDFjYmlBZ2RtRnNkV1VnUFNCMllXeDFaUzV5WlhCc1lXTmxLSEpsVkhKcGJTd2dKeWNwTzF4dUlDQjJZWElnYVhOQ2FXNWhjbmtnUFNCeVpVbHpRbWx1WVhKNUxuUmxjM1FvZG1Gc2RXVXBPMXh1SUNCeVpYUjFjbTRnS0dselFtbHVZWEo1SUh4OElISmxTWE5QWTNSaGJDNTBaWE4wS0haaGJIVmxLU2xjYmlBZ0lDQS9JR1p5WldWUVlYSnpaVWx1ZENoMllXeDFaUzV6YkdsalpTZ3lLU3dnYVhOQ2FXNWhjbmtnUHlBeUlEb2dPQ2xjYmlBZ0lDQTZJQ2h5WlVselFtRmtTR1Y0TG5SbGMzUW9kbUZzZFdVcElEOGdUa0ZPSURvZ0szWmhiSFZsS1R0Y2JuMWNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0IwYjA1MWJXSmxjanRjYmlJc0lpOHFJU0J1YjNWcGMyeHBaR1Z5SUMwZ01UTXVNUzR4SUMwZ01pOHhOQzh5TURFNUlDb3ZYRzRvWm5WdVkzUnBiMjRvWm1GamRHOXllU2tnZTF4dUlDQWdJR2xtSUNoMGVYQmxiMllnWkdWbWFXNWxJRDA5UFNCY0ltWjFibU4wYVc5dVhDSWdKaVlnWkdWbWFXNWxMbUZ0WkNrZ2UxeHVJQ0FnSUNBZ0lDQXZMeUJCVFVRdUlGSmxaMmx6ZEdWeUlHRnpJR0Z1SUdGdWIyNTViVzkxY3lCdGIyUjFiR1V1WEc0Z0lDQWdJQ0FnSUdSbFptbHVaU2hiWFN3Z1ptRmpkRzl5ZVNrN1hHNGdJQ0FnZlNCbGJITmxJR2xtSUNoMGVYQmxiMllnWlhod2IzSjBjeUE5UFQwZ1hDSnZZbXBsWTNSY0lpa2dlMXh1SUNBZ0lDQWdJQ0F2THlCT2IyUmxMME52YlcxdmJrcFRYRzRnSUNBZ0lDQWdJRzF2WkhWc1pTNWxlSEJ2Y25SeklEMGdabUZqZEc5eWVTZ3BPMXh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lDOHZJRUp5YjNkelpYSWdaMnh2WW1Gc2MxeHVJQ0FnSUNBZ0lDQjNhVzVrYjNjdWJtOVZhVk5zYVdSbGNpQTlJR1poWTNSdmNua29LVHRjYmlBZ0lDQjlYRzU5S1NobWRXNWpkR2x2YmlncElIdGNiaUFnSUNCY0luVnpaU0J6ZEhKcFkzUmNJanRjYmx4dUlDQWdJSFpoY2lCV1JWSlRTVTlPSUQwZ1hDSXhNeTR4TGpGY0lqdGNibHh1SUNBZ0lDOHZjbVZuYVc5dUlFaGxiSEJsY2lCTlpYUm9iMlJ6WEc1Y2JpQWdJQ0JtZFc1amRHbHZiaUJwYzFaaGJHbGtSbTl5YldGMGRHVnlLR1Z1ZEhKNUtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQjBlWEJsYjJZZ1pXNTBjbmtnUFQwOUlGd2liMkpxWldOMFhDSWdKaVlnZEhsd1pXOW1JR1Z1ZEhKNUxuUnZJRDA5UFNCY0ltWjFibU4wYVc5dVhDSWdKaVlnZEhsd1pXOW1JR1Z1ZEhKNUxtWnliMjBnUFQwOUlGd2lablZ1WTNScGIyNWNJanRjYmlBZ0lDQjlYRzVjYmlBZ0lDQm1kVzVqZEdsdmJpQnlaVzF2ZG1WRmJHVnRaVzUwS0dWc0tTQjdYRzRnSUNBZ0lDQWdJR1ZzTG5CaGNtVnVkRVZzWlcxbGJuUXVjbVZ0YjNabFEyaHBiR1FvWld3cE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdaMWJtTjBhVzl1SUdselUyVjBLSFpoYkhWbEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQjJZV3gxWlNBaFBUMGdiblZzYkNBbUppQjJZV3gxWlNBaFBUMGdkVzVrWldacGJtVmtPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJRUpwYm1SaFlteGxJSFpsY25OcGIyNWNiaUFnSUNCbWRXNWpkR2x2YmlCd2NtVjJaVzUwUkdWbVlYVnNkQ2hsS1NCN1hHNGdJQ0FnSUNBZ0lHVXVjSEpsZG1WdWRFUmxabUYxYkhRb0tUdGNiaUFnSUNCOVhHNWNiaUFnSUNBdkx5QlNaVzF2ZG1WeklHUjFjR3hwWTJGMFpYTWdabkp2YlNCaGJpQmhjbkpoZVM1Y2JpQWdJQ0JtZFc1amRHbHZiaUIxYm1seGRXVW9ZWEp5WVhrcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHRnljbUY1TG1acGJIUmxjaWhtZFc1amRHbHZiaWhoS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdJWFJvYVhOYllWMGdQeUFvZEdocGMxdGhYU0E5SUhSeWRXVXBJRG9nWm1Gc2MyVTdYRzRnSUNBZ0lDQWdJSDBzSUh0OUtUdGNiaUFnSUNCOVhHNWNiaUFnSUNBdkx5QlNiM1Z1WkNCaElIWmhiSFZsSUhSdklIUm9aU0JqYkc5elpYTjBJQ2QwYnljdVhHNGdJQ0FnWm5WdVkzUnBiMjRnWTJ4dmMyVnpkQ2gyWVd4MVpTd2dkRzhwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUUxaGRHZ3VjbTkxYm1Rb2RtRnNkV1VnTHlCMGJ5a2dLaUIwYnp0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCRGRYSnlaVzUwSUhCdmMybDBhVzl1SUc5bUlHRnVJR1ZzWlcxbGJuUWdjbVZzWVhScGRtVWdkRzhnZEdobElHUnZZM1Z0Wlc1MExseHVJQ0FnSUdaMWJtTjBhVzl1SUc5bVpuTmxkQ2hsYkdWdExDQnZjbWxsYm5SaGRHbHZiaWtnZTF4dUlDQWdJQ0FnSUNCMllYSWdjbVZqZENBOUlHVnNaVzB1WjJWMFFtOTFibVJwYm1kRGJHbGxiblJTWldOMEtDazdYRzRnSUNBZ0lDQWdJSFpoY2lCa2IyTWdQU0JsYkdWdExtOTNibVZ5Ukc5amRXMWxiblE3WEc0Z0lDQWdJQ0FnSUhaaGNpQmtiMk5GYkdWdElEMGdaRzlqTG1SdlkzVnRaVzUwUld4bGJXVnVkRHRjYmlBZ0lDQWdJQ0FnZG1GeUlIQmhaMlZQWm1aelpYUWdQU0JuWlhSUVlXZGxUMlptYzJWMEtHUnZZeWs3WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdaMlYwUW05MWJtUnBibWREYkdsbGJuUlNaV04wSUdOdmJuUmhhVzV6SUd4bFpuUWdjMk55YjJ4c0lHbHVJRU5vY205dFpTQnZiaUJCYm1SeWIybGtMbHh1SUNBZ0lDQWdJQ0F2THlCSklHaGhkbVZ1SjNRZ1ptOTFibVFnWVNCbVpXRjBkWEpsSUdSbGRHVmpkR2x2YmlCMGFHRjBJSEJ5YjNabGN5QjBhR2x6TGlCWGIzSnpkQ0JqWVhObFhHNGdJQ0FnSUNBZ0lDOHZJSE5qWlc1aGNtbHZJRzl1SUcxcGN5MXRZWFJqYURvZ2RHaGxJQ2QwWVhBbklHWmxZWFIxY21VZ2IyNGdhRzl5YVhwdmJuUmhiQ0J6Ykdsa1pYSnpJR0p5WldGcmN5NWNiaUFnSUNBZ0lDQWdhV1lnS0M5M1pXSnJhWFF1S2tOb2NtOXRaUzRxVFc5aWFXeGxMMmt1ZEdWemRDaHVZWFpwWjJGMGIzSXVkWE5sY2tGblpXNTBLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdjR0ZuWlU5bVpuTmxkQzU0SUQwZ01EdGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJ2Y21sbGJuUmhkR2x2Ymx4dUlDQWdJQ0FnSUNBZ0lDQWdQeUJ5WldOMExuUnZjQ0FySUhCaFoyVlBabVp6WlhRdWVTQXRJR1J2WTBWc1pXMHVZMnhwWlc1MFZHOXdYRzRnSUNBZ0lDQWdJQ0FnSUNBNklISmxZM1F1YkdWbWRDQXJJSEJoWjJWUFptWnpaWFF1ZUNBdElHUnZZMFZzWlcwdVkyeHBaVzUwVEdWbWREdGNiaUFnSUNCOVhHNWNiaUFnSUNBdkx5QkRhR1ZqYTNNZ2QyaGxkR2hsY2lCaElIWmhiSFZsSUdseklHNTFiV1Z5YVdOaGJDNWNiaUFnSUNCbWRXNWpkR2x2YmlCcGMwNTFiV1Z5YVdNb1lTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdkSGx3Wlc5bUlHRWdQVDA5SUZ3aWJuVnRZbVZ5WENJZ0ppWWdJV2x6VG1GT0tHRXBJQ1ltSUdselJtbHVhWFJsS0dFcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUM4dklGTmxkSE1nWVNCamJHRnpjeUJoYm1RZ2NtVnRiM1psY3lCcGRDQmhablJsY2lCYlpIVnlZWFJwYjI1ZElHMXpMbHh1SUNBZ0lHWjFibU4wYVc5dUlHRmtaRU5zWVhOelJtOXlLR1ZzWlcxbGJuUXNJR05zWVhOelRtRnRaU3dnWkhWeVlYUnBiMjRwSUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLR1IxY21GMGFXOXVJRDRnTUNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnWVdSa1EyeGhjM01vWld4bGJXVnVkQ3dnWTJ4aGMzTk9ZVzFsS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSE5sZEZScGJXVnZkWFFvWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2NtVnRiM1psUTJ4aGMzTW9aV3hsYldWdWRDd2dZMnhoYzNOT1lXMWxLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMHNJR1IxY21GMGFXOXVLVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUV4cGJXbDBjeUJoSUhaaGJIVmxJSFJ2SURBZ0xTQXhNREJjYmlBZ0lDQm1kVzVqZEdsdmJpQnNhVzFwZENoaEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQk5ZWFJvTG0xaGVDaE5ZWFJvTG0xcGJpaGhMQ0F4TURBcExDQXdLVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJYY21Gd2N5QmhJSFpoY21saFlteGxJR0Z6SUdGdUlHRnljbUY1TENCcFppQnBkQ0JwYzI0bmRDQnZibVVnZVdWMExseHVJQ0FnSUM4dklFNXZkR1VnZEdoaGRDQmhiaUJwYm5CMWRDQmhjbkpoZVNCcGN5QnlaWFIxY201bFpDQmllU0J5WldabGNtVnVZMlVoWEc0Z0lDQWdablZ1WTNScGIyNGdZWE5CY25KaGVTaGhLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJCY25KaGVTNXBjMEZ5Y21GNUtHRXBJRDhnWVNBNklGdGhYVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJEYjNWdWRITWdaR1ZqYVcxaGJITmNiaUFnSUNCbWRXNWpkR2x2YmlCamIzVnVkRVJsWTJsdFlXeHpLRzUxYlZOMGNpa2dlMXh1SUNBZ0lDQWdJQ0J1ZFcxVGRISWdQU0JUZEhKcGJtY29iblZ0VTNSeUtUdGNiaUFnSUNBZ0lDQWdkbUZ5SUhCcFpXTmxjeUE5SUc1MWJWTjBjaTV6Y0d4cGRDaGNJaTVjSWlrN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCd2FXVmpaWE11YkdWdVozUm9JRDRnTVNBL0lIQnBaV05sYzFzeFhTNXNaVzVuZEdnZ09pQXdPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJR2gwZEhBNkx5OTViM1Z0YVdkb2RHNXZkRzVsWldScWNYVmxjbmt1WTI5dEx5TmhaR1JmWTJ4aGMzTmNiaUFnSUNCbWRXNWpkR2x2YmlCaFpHUkRiR0Z6Y3lobGJDd2dZMnhoYzNOT1lXMWxLU0I3WEc0Z0lDQWdJQ0FnSUdsbUlDaGxiQzVqYkdGemMweHBjM1FwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR1ZzTG1Oc1lYTnpUR2x6ZEM1aFpHUW9ZMnhoYzNOT1lXMWxLVHRjYmlBZ0lDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHVnNMbU5zWVhOelRtRnRaU0FyUFNCY0lpQmNJaUFySUdOc1lYTnpUbUZ0WlR0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUM4dklHaDBkSEE2THk5NWIzVnRhV2RvZEc1dmRHNWxaV1JxY1hWbGNua3VZMjl0THlOeVpXMXZkbVZmWTJ4aGMzTmNiaUFnSUNCbWRXNWpkR2x2YmlCeVpXMXZkbVZEYkdGemN5aGxiQ3dnWTJ4aGMzTk9ZVzFsS1NCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2hsYkM1amJHRnpjMHhwYzNRcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdWc0xtTnNZWE56VEdsemRDNXlaVzF2ZG1Vb1kyeGhjM05PWVcxbEtUdGNiaUFnSUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdWc0xtTnNZWE56VG1GdFpTQTlJR1ZzTG1Oc1lYTnpUbUZ0WlM1eVpYQnNZV05sS0Z4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUc1bGR5QlNaV2RGZUhBb1hDSW9YbnhjWEZ4Y1lpbGNJaUFySUdOc1lYTnpUbUZ0WlM1emNHeHBkQ2hjSWlCY0lpa3VhbTlwYmloY0lueGNJaWtnS3lCY0lpaGNYRnhjWW53a0tWd2lMQ0JjSW1kcFhDSXBMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRndpSUZ3aVhHNGdJQ0FnSUNBZ0lDQWdJQ0FwTzF4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z2FIUjBjSE02THk5d2JHRnBibXB6TG1OdmJTOXFZWFpoYzJOeWFYQjBMMkYwZEhKcFluVjBaWE12WVdSa2FXNW5MWEpsYlc5MmFXNW5MV0Z1WkMxMFpYTjBhVzVuTFdadmNpMWpiR0Z6YzJWekxUa3ZYRzRnSUNBZ1puVnVZM1JwYjI0Z2FHRnpRMnhoYzNNb1pXd3NJR05zWVhOelRtRnRaU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWld3dVkyeGhjM05NYVhOMFhHNGdJQ0FnSUNBZ0lDQWdJQ0EvSUdWc0xtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5aGpiR0Z6YzA1aGJXVXBYRzRnSUNBZ0lDQWdJQ0FnSUNBNklHNWxkeUJTWldkRmVIQW9YQ0pjWEZ4Y1lsd2lJQ3NnWTJ4aGMzTk9ZVzFsSUNzZ1hDSmNYRnhjWWx3aUtTNTBaWE4wS0dWc0xtTnNZWE56VG1GdFpTazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5OGdhSFIwY0hNNkx5OWtaWFpsYkc5d1pYSXViVzk2YVd4c1lTNXZjbWN2Wlc0dFZWTXZaRzlqY3k5WFpXSXZRVkJKTDFkcGJtUnZkeTl6WTNKdmJHeFpJMDV2ZEdWelhHNGdJQ0FnWm5WdVkzUnBiMjRnWjJWMFVHRm5aVTltWm5ObGRDaGtiMk1wSUh0Y2JpQWdJQ0FnSUNBZ2RtRnlJSE4xY0hCdmNuUlFZV2RsVDJabWMyVjBJRDBnZDJsdVpHOTNMbkJoWjJWWVQyWm1jMlYwSUNFOVBTQjFibVJsWm1sdVpXUTdYRzRnSUNBZ0lDQWdJSFpoY2lCcGMwTlRVekZEYjIxd1lYUWdQU0FvWkc5akxtTnZiWEJoZEUxdlpHVWdmSHdnWENKY0lpa2dQVDA5SUZ3aVExTlRNVU52YlhCaGRGd2lPMXh1SUNBZ0lDQWdJQ0IyWVhJZ2VDQTlJSE4xY0hCdmNuUlFZV2RsVDJabWMyVjBYRzRnSUNBZ0lDQWdJQ0FnSUNBL0lIZHBibVJ2ZHk1d1lXZGxXRTltWm5ObGRGeHVJQ0FnSUNBZ0lDQWdJQ0FnT2lCcGMwTlRVekZEYjIxd1lYUmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQS9JR1J2WXk1a2IyTjFiV1Z1ZEVWc1pXMWxiblF1YzJOeWIyeHNUR1ZtZEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSURvZ1pHOWpMbUp2WkhrdWMyTnliMnhzVEdWbWREdGNiaUFnSUNBZ0lDQWdkbUZ5SUhrZ1BTQnpkWEJ3YjNKMFVHRm5aVTltWm5ObGRGeHVJQ0FnSUNBZ0lDQWdJQ0FnUHlCM2FXNWtiM2N1Y0dGblpWbFBabVp6WlhSY2JpQWdJQ0FnSUNBZ0lDQWdJRG9nYVhORFUxTXhRMjl0Y0dGMFhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1B5QmtiMk11Wkc5amRXMWxiblJGYkdWdFpXNTBMbk5qY205c2JGUnZjRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRG9nWkc5akxtSnZaSGt1YzJOeWIyeHNWRzl3TzF4dVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I0T2lCNExGeHVJQ0FnSUNBZ0lDQWdJQ0FnZVRvZ2VWeHVJQ0FnSUNBZ0lDQjlPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJSGRsSUhCeWIzWnBaR1VnWVNCbWRXNWpkR2x2YmlCMGJ5QmpiMjF3ZFhSbElHTnZibk4wWVc1MGN5QnBibk4wWldGa1hHNGdJQ0FnTHk4Z2IyWWdZV05qWlhOemFXNW5JSGRwYm1SdmR5NHFJR0Z6SUhOdmIyNGdZWE1nZEdobElHMXZaSFZzWlNCdVpXVmtjeUJwZEZ4dUlDQWdJQzh2SUhOdklIUm9ZWFFnZDJVZ1pHOGdibTkwSUdOdmJYQjFkR1VnWVc1NWRHaHBibWNnYVdZZ2JtOTBJRzVsWldSbFpGeHVJQ0FnSUdaMWJtTjBhVzl1SUdkbGRFRmpkR2x2Ym5Nb0tTQjdYRzRnSUNBZ0lDQWdJQzh2SUVSbGRHVnliV2x1WlNCMGFHVWdaWFpsYm5SeklIUnZJR0pwYm1RdUlFbEZNVEVnYVcxd2JHVnRaVzUwY3lCd2IybHVkR1Z5UlhabGJuUnpJSGRwZEdodmRYUmNiaUFnSUNBZ0lDQWdMeThnWVNCd2NtVm1hWGdzSUhkb2FXTm9JR0p5WldGcmN5QmpiMjF3WVhScFltbHNhWFI1SUhkcGRHZ2dkR2hsSUVsRk1UQWdhVzF3YkdWdFpXNTBZWFJwYjI0dVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCM2FXNWtiM2N1Ym1GMmFXZGhkRzl5TG5CdmFXNTBaWEpGYm1GaWJHVmtYRzRnSUNBZ0lDQWdJQ0FnSUNBL0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSE4wWVhKME9pQmNJbkJ2YVc1MFpYSmtiM2R1WENJc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnRiM1psT2lCY0luQnZhVzUwWlhKdGIzWmxYQ0lzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCbGJtUTZJRndpY0c5cGJuUmxjblZ3WENKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lDQWdPaUIzYVc1a2IzY3VibUYyYVdkaGRHOXlMbTF6VUc5cGJuUmxja1Z1WVdKc1pXUmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQS9JSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnpkR0Z5ZERvZ1hDSk5VMUJ2YVc1MFpYSkViM2R1WENJc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYlc5MlpUb2dYQ0pOVTFCdmFXNTBaWEpOYjNabFhDSXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1pXNWtPaUJjSWsxVFVHOXBiblJsY2xWd1hDSmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E2SUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J6ZEdGeWREb2dYQ0p0YjNWelpXUnZkMjRnZEc5MVkyaHpkR0Z5ZEZ3aUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUcxdmRtVTZJRndpYlc5MWMyVnRiM1psSUhSdmRXTm9iVzkyWlZ3aUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdWdVpEb2dYQ0p0YjNWelpYVndJSFJ2ZFdOb1pXNWtYQ0pjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgwN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwxZEpRMGN2UlhabGJuUk1hWE4wWlc1bGNrOXdkR2x2Ym5NdllteHZZaTluYUMxd1lXZGxjeTlsZUhCc1lXbHVaWEl1YldSY2JpQWdJQ0F2THlCSmMzTjFaU0FqTnpnMVhHNGdJQ0FnWm5WdVkzUnBiMjRnWjJWMFUzVndjRzl5ZEhOUVlYTnphWFpsS0NrZ2UxeHVJQ0FnSUNBZ0lDQjJZWElnYzNWd2NHOXlkSE5RWVhOemFYWmxJRDBnWm1Gc2MyVTdYRzVjYmlBZ0lDQWdJQ0FnTHlvZ1pYTnNhVzUwTFdScGMyRmliR1VnS2k5Y2JpQWdJQ0FnSUNBZ2RISjVJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIWmhjaUJ2Y0hSeklEMGdUMkpxWldOMExtUmxabWx1WlZCeWIzQmxjblI1S0h0OUxDQmNJbkJoYzNOcGRtVmNJaXdnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdkbGREb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lITjFjSEJ2Y25SelVHRnpjMmwyWlNBOUlIUnlkV1U3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lDQWdmU2s3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJSGRwYm1SdmR5NWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtGd2lkR1Z6ZEZ3aUxDQnVkV3hzTENCdmNIUnpLVHRjYmlBZ0lDQWdJQ0FnZlNCallYUmphQ0FvWlNrZ2UzMWNiaUFnSUNBZ0lDQWdMeW9nWlhOc2FXNTBMV1Z1WVdKc1pTQXFMMXh1WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJ6ZFhCd2IzSjBjMUJoYzNOcGRtVTdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1puVnVZM1JwYjI0Z1oyVjBVM1Z3Y0c5eWRITlViM1ZqYUVGamRHbHZiazV2Ym1Vb0tTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQjNhVzVrYjNjdVExTlRJQ1ltSUVOVFV5NXpkWEJ3YjNKMGN5QW1KaUJEVTFNdWMzVndjRzl5ZEhNb1hDSjBiM1ZqYUMxaFkzUnBiMjVjSWl3Z1hDSnViMjVsWENJcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUM4dlpXNWtjbVZuYVc5dVhHNWNiaUFnSUNBdkwzSmxaMmx2YmlCU1lXNW5aU0JEWVd4amRXeGhkR2x2Ymx4dVhHNGdJQ0FnTHk4Z1JHVjBaWEp0YVc1bElIUm9aU0J6YVhwbElHOW1JR0VnYzNWaUxYSmhibWRsSUdsdUlISmxiR0YwYVc5dUlIUnZJR0VnWm5Wc2JDQnlZVzVuWlM1Y2JpQWdJQ0JtZFc1amRHbHZiaUJ6ZFdKU1lXNW5aVkpoZEdsdktIQmhMQ0J3WWlrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z01UQXdJQzhnS0hCaUlDMGdjR0VwTzF4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUNod1pYSmpaVzUwWVdkbEtTQkliM2NnYldGdWVTQndaWEpqWlc1MElHbHpJSFJvYVhNZ2RtRnNkV1VnYjJZZ2RHaHBjeUJ5WVc1blpUOWNiaUFnSUNCbWRXNWpkR2x2YmlCbWNtOXRVR1Z5WTJWdWRHRm5aU2h5WVc1blpTd2dkbUZzZFdVcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlDaDJZV3gxWlNBcUlERXdNQ2tnTHlBb2NtRnVaMlZiTVYwZ0xTQnlZVzVuWlZzd1hTazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5OGdLSEJsY21ObGJuUmhaMlVwSUZkb1pYSmxJR2x6SUhSb2FYTWdkbUZzZFdVZ2IyNGdkR2hwY3lCeVlXNW5aVDljYmlBZ0lDQm1kVzVqZEdsdmJpQjBiMUJsY21ObGJuUmhaMlVvY21GdVoyVXNJSFpoYkhWbEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1jbTl0VUdWeVkyVnVkR0ZuWlNoeVlXNW5aU3dnY21GdVoyVmJNRjBnUENBd0lEOGdkbUZzZFdVZ0t5Qk5ZWFJvTG1GaWN5aHlZVzVuWlZzd1hTa2dPaUIyWVd4MVpTQXRJSEpoYm1kbFd6QmRLVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUFvZG1Gc2RXVXBJRWh2ZHlCdGRXTm9JR2x6SUhSb2FYTWdjR1Z5WTJWdWRHRm5aU0J2YmlCMGFHbHpJSEpoYm1kbFAxeHVJQ0FnSUdaMWJtTjBhVzl1SUdselVHVnlZMlZ1ZEdGblpTaHlZVzVuWlN3Z2RtRnNkV1VwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUNoMllXeDFaU0FxSUNoeVlXNW5aVnN4WFNBdElISmhibWRsV3pCZEtTa2dMeUF4TURBZ0t5QnlZVzVuWlZzd1hUdGNiaUFnSUNCOVhHNWNiaUFnSUNCbWRXNWpkR2x2YmlCblpYUktLSFpoYkhWbExDQmhjbklwSUh0Y2JpQWdJQ0FnSUNBZ2RtRnlJR29nUFNBeE8xeHVYRzRnSUNBZ0lDQWdJSGRvYVd4bElDaDJZV3gxWlNBK1BTQmhjbkpiYWwwcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdvZ0t6MGdNVHRjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCcU8xeHVJQ0FnSUgxY2JseHVJQ0FnSUM4dklDaHdaWEpqWlc1MFlXZGxLU0JKYm5CMWRDQmhJSFpoYkhWbExDQm1hVzVrSUhkb1pYSmxMQ0J2YmlCaElITmpZV3hsSUc5bUlEQXRNVEF3TENCcGRDQmhjSEJzYVdWekxseHVJQ0FnSUdaMWJtTjBhVzl1SUhSdlUzUmxjSEJwYm1jb2VGWmhiQ3dnZUZCamRDd2dkbUZzZFdVcElIdGNiaUFnSUNBZ0lDQWdhV1lnS0haaGJIVmxJRDQ5SUhoV1lXd3VjMnhwWTJVb0xURXBXekJkS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdNVEF3TzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdkbUZ5SUdvZ1BTQm5aWFJLS0haaGJIVmxMQ0I0Vm1Gc0tUdGNiaUFnSUNBZ0lDQWdkbUZ5SUhaaElEMGdlRlpoYkZ0cUlDMGdNVjA3WEc0Z0lDQWdJQ0FnSUhaaGNpQjJZaUE5SUhoV1lXeGJhbDA3WEc0Z0lDQWdJQ0FnSUhaaGNpQndZU0E5SUhoUVkzUmJhaUF0SURGZE8xeHVJQ0FnSUNBZ0lDQjJZWElnY0dJZ1BTQjRVR04wVzJwZE8xeHVYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQndZU0FySUhSdlVHVnlZMlZ1ZEdGblpTaGJkbUVzSUhaaVhTd2dkbUZzZFdVcElDOGdjM1ZpVW1GdVoyVlNZWFJwYnlod1lTd2djR0lwTzF4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUNoMllXeDFaU2tnU1c1d2RYUWdZU0J3WlhKalpXNTBZV2RsTENCbWFXNWtJSGRvWlhKbElHbDBJR2x6SUc5dUlIUm9aU0J6Y0dWamFXWnBaV1FnY21GdVoyVXVYRzRnSUNBZ1puVnVZM1JwYjI0Z1puSnZiVk4wWlhCd2FXNW5LSGhXWVd3c0lIaFFZM1FzSUhaaGJIVmxLU0I3WEc0Z0lDQWdJQ0FnSUM4dklGUm9aWEpsSUdseklHNXZJSEpoYm1kbElHZHliM1Z3SUhSb1lYUWdabWwwY3lBeE1EQmNiaUFnSUNBZ0lDQWdhV1lnS0haaGJIVmxJRDQ5SURFd01Da2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUhoV1lXd3VjMnhwWTJVb0xURXBXekJkTzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdkbUZ5SUdvZ1BTQm5aWFJLS0haaGJIVmxMQ0I0VUdOMEtUdGNiaUFnSUNBZ0lDQWdkbUZ5SUhaaElEMGdlRlpoYkZ0cUlDMGdNVjA3WEc0Z0lDQWdJQ0FnSUhaaGNpQjJZaUE5SUhoV1lXeGJhbDA3WEc0Z0lDQWdJQ0FnSUhaaGNpQndZU0E5SUhoUVkzUmJhaUF0SURGZE8xeHVJQ0FnSUNBZ0lDQjJZWElnY0dJZ1BTQjRVR04wVzJwZE8xeHVYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnBjMUJsY21ObGJuUmhaMlVvVzNaaExDQjJZbDBzSUNoMllXeDFaU0F0SUhCaEtTQXFJSE4xWWxKaGJtZGxVbUYwYVc4b2NHRXNJSEJpS1NrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z0tIQmxjbU5sYm5SaFoyVXBJRWRsZENCMGFHVWdjM1JsY0NCMGFHRjBJR0Z3Y0d4cFpYTWdZWFFnWVNCalpYSjBZV2x1SUhaaGJIVmxMbHh1SUNBZ0lHWjFibU4wYVc5dUlHZGxkRk4wWlhBb2VGQmpkQ3dnZUZOMFpYQnpMQ0J6Ym1Gd0xDQjJZV3gxWlNrZ2UxeHVJQ0FnSUNBZ0lDQnBaaUFvZG1Gc2RXVWdQVDA5SURFd01Da2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUhaaGJIVmxPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2RtRnlJR29nUFNCblpYUktLSFpoYkhWbExDQjRVR04wS1R0Y2JpQWdJQ0FnSUNBZ2RtRnlJR0VnUFNCNFVHTjBXMm9nTFNBeFhUdGNiaUFnSUNBZ0lDQWdkbUZ5SUdJZ1BTQjRVR04wVzJwZE8xeHVYRzRnSUNBZ0lDQWdJQzh2SUVsbUlDZHpibUZ3SnlCcGN5QnpaWFFzSUhOMFpYQnpJR0Z5WlNCMWMyVmtJR0Z6SUdacGVHVmtJSEJ2YVc1MGN5QnZiaUIwYUdVZ2MyeHBaR1Z5TGx4dUlDQWdJQ0FnSUNCcFppQW9jMjVoY0NrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1JtbHVaQ0IwYUdVZ1kyeHZjMlZ6ZENCd2IzTnBkR2x2Yml3Z1lTQnZjaUJpTGx4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0haaGJIVmxJQzBnWVNBK0lDaGlJQzBnWVNrZ0x5QXlLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJR0k3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCaE8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnYVdZZ0tDRjRVM1JsY0hOYmFpQXRJREZkS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdkbUZzZFdVN1hHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdlRkJqZEZ0cUlDMGdNVjBnS3lCamJHOXpaWE4wS0haaGJIVmxJQzBnZUZCamRGdHFJQzBnTVYwc0lIaFRkR1Z3YzF0cUlDMGdNVjBwTzF4dUlDQWdJSDFjYmx4dUlDQWdJR1oxYm1OMGFXOXVJR2hoYm1Sc1pVVnVkSEo1VUc5cGJuUW9hVzVrWlhnc0lIWmhiSFZsTENCMGFHRjBLU0I3WEc0Z0lDQWdJQ0FnSUhaaGNpQndaWEpqWlc1MFlXZGxPMXh1WEc0Z0lDQWdJQ0FnSUM4dklGZHlZWEFnYm5WdFpYSnBZMkZzSUdsdWNIVjBJR2x1SUdGdUlHRnljbUY1TGx4dUlDQWdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlIWmhiSFZsSUQwOVBTQmNJbTUxYldKbGNsd2lLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjJZV3gxWlNBOUlGdDJZV3gxWlYwN1hHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0F2THlCU1pXcGxZM1FnWVc1NUlHbHVkbUZzYVdRZ2FXNXdkWFFzSUdKNUlIUmxjM1JwYm1jZ2QyaGxkR2hsY2lCMllXeDFaU0JwY3lCaGJpQmhjbkpoZVM1Y2JpQWdJQ0FnSUNBZ2FXWWdLQ0ZCY25KaGVTNXBjMEZ5Y21GNUtIWmhiSFZsS1NrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLRndpYm05VmFWTnNhV1JsY2lBb1hDSWdLeUJXUlZKVFNVOU9JQ3NnWENJcE9pQW5jbUZ1WjJVbklHTnZiblJoYVc1eklHbHVkbUZzYVdRZ2RtRnNkV1V1WENJcE8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1EyOTJaWEowSUcxcGJpOXRZWGdnYzNsdWRHRjRJSFJ2SURBZ1lXNWtJREV3TUM1Y2JpQWdJQ0FnSUNBZ2FXWWdLR2x1WkdWNElEMDlQU0JjSW0xcGJsd2lLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQndaWEpqWlc1MFlXZGxJRDBnTUR0Y2JpQWdJQ0FnSUNBZ2ZTQmxiSE5sSUdsbUlDaHBibVJsZUNBOVBUMGdYQ0p0WVhoY0lpa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NHVnlZMlZ1ZEdGblpTQTlJREV3TUR0Y2JpQWdJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSEJsY21ObGJuUmhaMlVnUFNCd1lYSnpaVVpzYjJGMEtHbHVaR1Y0S1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQzh2SUVOb1pXTnJJR1p2Y2lCamIzSnlaV04wSUdsdWNIVjBMbHh1SUNBZ0lDQWdJQ0JwWmlBb0lXbHpUblZ0WlhKcFl5aHdaWEpqWlc1MFlXZGxLU0I4ZkNBaGFYTk9kVzFsY21saktIWmhiSFZsV3pCZEtTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0Z3aWJtOVZhVk5zYVdSbGNpQW9YQ0lnS3lCV1JWSlRTVTlPSUNzZ1hDSXBPaUFuY21GdVoyVW5JSFpoYkhWbElHbHpiaWQwSUc1MWJXVnlhV011WENJcE8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1UzUnZjbVVnZG1Gc2RXVnpMbHh1SUNBZ0lDQWdJQ0IwYUdGMExuaFFZM1F1Y0hWemFDaHdaWEpqWlc1MFlXZGxLVHRjYmlBZ0lDQWdJQ0FnZEdoaGRDNTRWbUZzTG5CMWMyZ29kbUZzZFdWYk1GMHBPMXh1WEc0Z0lDQWdJQ0FnSUM4dklFNWhUaUIzYVd4c0lHVjJZV3gxWVhSbElIUnZJR1poYkhObElIUnZieXdnWW5WMElIUnZJR3RsWlhCY2JpQWdJQ0FnSUNBZ0x5OGdiRzluWjJsdVp5QmpiR1ZoY2l3Z2MyVjBJSE4wWlhBZ1pYaHdiR2xqYVhSc2VTNGdUV0ZyWlNCemRYSmxYRzRnSUNBZ0lDQWdJQzh2SUc1dmRDQjBieUJ2ZG1WeWNtbGtaU0IwYUdVZ0ozTjBaWEFuSUhObGRIUnBibWNnZDJsMGFDQm1ZV3h6WlM1Y2JpQWdJQ0FnSUNBZ2FXWWdLQ0Z3WlhKalpXNTBZV2RsS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb0lXbHpUbUZPS0haaGJIVmxXekZkS1NrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIUm9ZWFF1ZUZOMFpYQnpXekJkSUQwZ2RtRnNkV1ZiTVYwN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhR0YwTG5oVGRHVndjeTV3ZFhOb0tHbHpUbUZPS0haaGJIVmxXekZkS1NBL0lHWmhiSE5sSURvZ2RtRnNkV1ZiTVYwcE8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnZEdoaGRDNTRTR2xuYUdWemRFTnZiWEJzWlhSbFUzUmxjQzV3ZFhOb0tEQXBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHWjFibU4wYVc5dUlHaGhibVJzWlZOMFpYQlFiMmx1ZENocExDQnVMQ0IwYUdGMEtTQjdYRzRnSUNBZ0lDQWdJQzh2SUVsbmJtOXlaU0FuWm1Gc2MyVW5JSE4wWlhCd2FXNW5MbHh1SUNBZ0lDQWdJQ0JwWmlBb0lXNHBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymp0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQzh2SUZOMFpYQWdiM1psY2lCNlpYSnZMV3hsYm1kMGFDQnlZVzVuWlhNZ0tDTTVORGdwTzF4dUlDQWdJQ0FnSUNCcFppQW9kR2hoZEM1NFZtRnNXMmxkSUQwOVBTQjBhR0YwTG5oV1lXeGJhU0FySURGZEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMGFHRjBMbmhUZEdWd2MxdHBYU0E5SUhSb1lYUXVlRWhwWjJobGMzUkRiMjF3YkdWMFpWTjBaWEJiYVYwZ1BTQjBhR0YwTG5oV1lXeGJhVjA3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJqdGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUM4dklFWmhZM1J2Y2lCMGJ5QnlZVzVuWlNCeVlYUnBiMXh1SUNBZ0lDQWdJQ0IwYUdGMExuaFRkR1Z3YzF0cFhTQTlYRzRnSUNBZ0lDQWdJQ0FnSUNCbWNtOXRVR1Z5WTJWdWRHRm5aU2hiZEdoaGRDNTRWbUZzVzJsZExDQjBhR0YwTG5oV1lXeGJhU0FySURGZFhTd2diaWtnTHlCemRXSlNZVzVuWlZKaGRHbHZLSFJvWVhRdWVGQmpkRnRwWFN3Z2RHaGhkQzU0VUdOMFcya2dLeUF4WFNrN1hHNWNiaUFnSUNBZ0lDQWdkbUZ5SUhSdmRHRnNVM1JsY0hNZ1BTQW9kR2hoZEM1NFZtRnNXMmtnS3lBeFhTQXRJSFJvWVhRdWVGWmhiRnRwWFNrZ0x5QjBhR0YwTG5oT2RXMVRkR1Z3YzF0cFhUdGNiaUFnSUNBZ0lDQWdkbUZ5SUdocFoyaGxjM1JUZEdWd0lEMGdUV0YwYUM1alpXbHNLRTUxYldKbGNpaDBiM1JoYkZOMFpYQnpMblJ2Um1sNFpXUW9NeWtwSUMwZ01TazdYRzRnSUNBZ0lDQWdJSFpoY2lCemRHVndJRDBnZEdoaGRDNTRWbUZzVzJsZElDc2dkR2hoZEM1NFRuVnRVM1JsY0hOYmFWMGdLaUJvYVdkb1pYTjBVM1JsY0R0Y2JseHVJQ0FnSUNBZ0lDQjBhR0YwTG5oSWFXZG9aWE4wUTI5dGNHeGxkR1ZUZEdWd1cybGRJRDBnYzNSbGNEdGNiaUFnSUNCOVhHNWNiaUFnSUNBdkwyVnVaSEpsWjJsdmJseHVYRzRnSUNBZ0x5OXlaV2RwYjI0Z1UzQmxZM1J5ZFcxY2JseHVJQ0FnSUdaMWJtTjBhVzl1SUZOd1pXTjBjblZ0S0dWdWRISjVMQ0J6Ym1Gd0xDQnphVzVuYkdWVGRHVndLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVlRkJqZENBOUlGdGRPMXh1SUNBZ0lDQWdJQ0IwYUdsekxuaFdZV3dnUFNCYlhUdGNiaUFnSUNBZ0lDQWdkR2hwY3k1NFUzUmxjSE1nUFNCYmMybHVaMnhsVTNSbGNDQjhmQ0JtWVd4elpWMDdYRzRnSUNBZ0lDQWdJSFJvYVhNdWVFNTFiVk4wWlhCeklEMGdXMlpoYkhObFhUdGNiaUFnSUNBZ0lDQWdkR2hwY3k1NFNHbG5hR1Z6ZEVOdmJYQnNaWFJsVTNSbGNDQTlJRnRkTzF4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11YzI1aGNDQTlJSE51WVhBN1hHNWNiaUFnSUNBZ0lDQWdkbUZ5SUdsdVpHVjRPMXh1SUNBZ0lDQWdJQ0IyWVhJZ2IzSmtaWEpsWkNBOUlGdGRPeUF2THlCYk1Dd2dKMjFwYmlkZExDQmJNU3dnSnpVd0pTZGRMQ0JiTWl3Z0oyMWhlQ2RkWEc1Y2JpQWdJQ0FnSUNBZ0x5OGdUV0Z3SUhSb1pTQnZZbXBsWTNRZ2EyVjVjeUIwYnlCaGJpQmhjbkpoZVM1Y2JpQWdJQ0FnSUNBZ1ptOXlJQ2hwYm1SbGVDQnBiaUJsYm5SeWVTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLR1Z1ZEhKNUxtaGhjMDkzYmxCeWIzQmxjblI1S0dsdVpHVjRLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUc5eVpHVnlaV1F1Y0hWemFDaGJaVzUwY25sYmFXNWtaWGhkTENCcGJtUmxlRjBwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdVMjl5ZENCaGJHd2daVzUwY21sbGN5QmllU0IyWVd4MVpTQW9iblZ0WlhKcFl5QnpiM0owS1M1Y2JpQWdJQ0FnSUNBZ2FXWWdLRzl5WkdWeVpXUXViR1Z1WjNSb0lDWW1JSFI1Y0dWdlppQnZjbVJsY21Wa1d6QmRXekJkSUQwOVBTQmNJbTlpYW1WamRGd2lLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnZjbVJsY21Wa0xuTnZjblFvWm5WdVkzUnBiMjRvWVN3Z1lpa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQmhXekJkV3pCZElDMGdZbHN3WFZzd1hUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgwcE8xeHVJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnYjNKa1pYSmxaQzV6YjNKMEtHWjFibU4wYVc5dUtHRXNJR0lwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnWVZzd1hTQXRJR0piTUYwN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5S1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQzh2SUVOdmJuWmxjblFnWVd4c0lHVnVkSEpwWlhNZ2RHOGdjM1ZpY21GdVoyVnpMbHh1SUNBZ0lDQWdJQ0JtYjNJZ0tHbHVaR1Y0SUQwZ01Ec2dhVzVrWlhnZ1BDQnZjbVJsY21Wa0xteGxibWQwYURzZ2FXNWtaWGdyS3lrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnYUdGdVpHeGxSVzUwY25sUWIybHVkQ2h2Y21SbGNtVmtXMmx1WkdWNFhWc3hYU3dnYjNKa1pYSmxaRnRwYm1SbGVGMWJNRjBzSUhSb2FYTXBPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdVM1J2Y21VZ2RHaGxJR0ZqZEhWaGJDQnpkR1Z3SUhaaGJIVmxjeTVjYmlBZ0lDQWdJQ0FnTHk4Z2VGTjBaWEJ6SUdseklITnZjblJsWkNCcGJpQjBhR1VnYzJGdFpTQnZjbVJsY2lCaGN5QjRVR04wSUdGdVpDQjRWbUZzTGx4dUlDQWdJQ0FnSUNCMGFHbHpMbmhPZFcxVGRHVndjeUE5SUhSb2FYTXVlRk4wWlhCekxuTnNhV05sS0RBcE8xeHVYRzRnSUNBZ0lDQWdJQzh2SUVOdmJuWmxjblFnWVd4c0lHNTFiV1Z5YVdNZ2MzUmxjSE1nZEc4Z2RHaGxJSEJsY21ObGJuUmhaMlVnYjJZZ2RHaGxJSE4xWW5KaGJtZGxJSFJvWlhrZ2NtVndjbVZ6Wlc1MExseHVJQ0FnSUNBZ0lDQm1iM0lnS0dsdVpHVjRJRDBnTURzZ2FXNWtaWGdnUENCMGFHbHpMbmhPZFcxVGRHVndjeTVzWlc1bmRHZzdJR2x1WkdWNEt5c3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHaGhibVJzWlZOMFpYQlFiMmx1ZENocGJtUmxlQ3dnZEdocGN5NTRUblZ0VTNSbGNITmJhVzVrWlhoZExDQjBhR2x6S1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUZOd1pXTjBjblZ0TG5CeWIzUnZkSGx3WlM1blpYUk5ZWEpuYVc0Z1BTQm1kVzVqZEdsdmJpaDJZV3gxWlNrZ2UxeHVJQ0FnSUNBZ0lDQjJZWElnYzNSbGNDQTlJSFJvYVhNdWVFNTFiVk4wWlhCeld6QmRPMXh1WEc0Z0lDQWdJQ0FnSUdsbUlDaHpkR1Z3SUNZbUlDaDJZV3gxWlNBdklITjBaWEFwSUNVZ01TQWhQVDBnTUNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLRndpYm05VmFWTnNhV1JsY2lBb1hDSWdLeUJXUlZKVFNVOU9JQ3NnWENJcE9pQW5iR2x0YVhRbkxDQW5iV0Z5WjJsdUp5QmhibVFnSjNCaFpHUnBibWNuSUcxMWMzUWdZbVVnWkdsMmFYTnBZbXhsSUdKNUlITjBaWEF1WENJcE8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdWVGQmpkQzVzWlc1bmRHZ2dQVDA5SURJZ1B5Qm1jbTl0VUdWeVkyVnVkR0ZuWlNoMGFHbHpMbmhXWVd3c0lIWmhiSFZsS1NBNklHWmhiSE5sTzF4dUlDQWdJSDA3WEc1Y2JpQWdJQ0JUY0dWamRISjFiUzV3Y205MGIzUjVjR1V1ZEc5VGRHVndjR2x1WnlBOUlHWjFibU4wYVc5dUtIWmhiSFZsS1NCN1hHNGdJQ0FnSUNBZ0lIWmhiSFZsSUQwZ2RHOVRkR1Z3Y0dsdVp5aDBhR2x6TG5oV1lXd3NJSFJvYVhNdWVGQmpkQ3dnZG1Gc2RXVXBPMXh1WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUIyWVd4MVpUdGNiaUFnSUNCOU8xeHVYRzRnSUNBZ1UzQmxZM1J5ZFcwdWNISnZkRzkwZVhCbExtWnliMjFUZEdWd2NHbHVaeUE5SUdaMWJtTjBhVzl1S0haaGJIVmxLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJtY205dFUzUmxjSEJwYm1jb2RHaHBjeTU0Vm1Gc0xDQjBhR2x6TG5oUVkzUXNJSFpoYkhWbEtUdGNiaUFnSUNCOU8xeHVYRzRnSUNBZ1UzQmxZM1J5ZFcwdWNISnZkRzkwZVhCbExtZGxkRk4wWlhBZ1BTQm1kVzVqZEdsdmJpaDJZV3gxWlNrZ2UxeHVJQ0FnSUNBZ0lDQjJZV3gxWlNBOUlHZGxkRk4wWlhBb2RHaHBjeTU0VUdOMExDQjBhR2x6TG5oVGRHVndjeXdnZEdocGN5NXpibUZ3TENCMllXeDFaU2s3WEc1Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhaaGJIVmxPMXh1SUNBZ0lIMDdYRzVjYmlBZ0lDQlRjR1ZqZEhKMWJTNXdjbTkwYjNSNWNHVXVaMlYwUkdWbVlYVnNkRk4wWlhBZ1BTQm1kVzVqZEdsdmJpaDJZV3gxWlN3Z2FYTkViM2R1TENCemFYcGxLU0I3WEc0Z0lDQWdJQ0FnSUhaaGNpQnFJRDBnWjJWMFNpaDJZV3gxWlN3Z2RHaHBjeTU0VUdOMEtUdGNibHh1SUNBZ0lDQWdJQ0F2THlCWGFHVnVJR0YwSUhSb1pTQjBiM0FnYjNJZ2MzUmxjSEJwYm1jZ1pHOTNiaXdnYkc5dmF5QmhkQ0IwYUdVZ2NISmxkbWx2ZFhNZ2MzVmlMWEpoYm1kbFhHNGdJQ0FnSUNBZ0lHbG1JQ2gyWVd4MVpTQTlQVDBnTVRBd0lIeDhJQ2hwYzBSdmQyNGdKaVlnZG1Gc2RXVWdQVDA5SUhSb2FYTXVlRkJqZEZ0cUlDMGdNVjBwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JxSUQwZ1RXRjBhQzV0WVhnb2FpQXRJREVzSURFcE8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJQ2gwYUdsekxuaFdZV3hiYWwwZ0xTQjBhR2x6TG5oV1lXeGJhaUF0SURGZEtTQXZJSE5wZW1VN1hHNGdJQ0FnZlR0Y2JseHVJQ0FnSUZOd1pXTjBjblZ0TG5CeWIzUnZkSGx3WlM1blpYUk9aV0Z5WW5sVGRHVndjeUE5SUdaMWJtTjBhVzl1S0haaGJIVmxLU0I3WEc0Z0lDQWdJQ0FnSUhaaGNpQnFJRDBnWjJWMFNpaDJZV3gxWlN3Z2RHaHBjeTU0VUdOMEtUdGNibHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2MzUmxjRUpsWm05eVpUb2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSE4wWVhKMFZtRnNkV1U2SUhSb2FYTXVlRlpoYkZ0cUlDMGdNbDBzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYzNSbGNEb2dkR2hwY3k1NFRuVnRVM1JsY0hOYmFpQXRJREpkTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdocFoyaGxjM1JUZEdWd09pQjBhR2x6TG5oSWFXZG9aWE4wUTI5dGNHeGxkR1ZUZEdWd1cyb2dMU0F5WFZ4dUlDQWdJQ0FnSUNBZ0lDQWdmU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE5UZEdWd09pQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjM1JoY25SV1lXeDFaVG9nZEdocGN5NTRWbUZzVzJvZ0xTQXhYU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J6ZEdWd09pQjBhR2x6TG5oT2RXMVRkR1Z3YzF0cUlDMGdNVjBzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYUdsbmFHVnpkRk4wWlhBNklIUm9hWE11ZUVocFoyaGxjM1JEYjIxd2JHVjBaVk4wWlhCYmFpQXRJREZkWEc0Z0lDQWdJQ0FnSUNBZ0lDQjlMRnh1SUNBZ0lDQWdJQ0FnSUNBZ2MzUmxjRUZtZEdWeU9pQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjM1JoY25SV1lXeDFaVG9nZEdocGN5NTRWbUZzVzJwZExGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lITjBaWEE2SUhSb2FYTXVlRTUxYlZOMFpYQnpXMnBkTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdocFoyaGxjM1JUZEdWd09pQjBhR2x6TG5oSWFXZG9aWE4wUTI5dGNHeGxkR1ZUZEdWd1cycGRYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lIMDdYRzRnSUNBZ2ZUdGNibHh1SUNBZ0lGTndaV04wY25WdExuQnliM1J2ZEhsd1pTNWpiM1Z1ZEZOMFpYQkVaV05wYldGc2N5QTlJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJQ0FnSUNCMllYSWdjM1JsY0VSbFkybHRZV3h6SUQwZ2RHaHBjeTU0VG5WdFUzUmxjSE11YldGd0tHTnZkVzUwUkdWamFXMWhiSE1wTzF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnVFdGMGFDNXRZWGd1WVhCd2JIa29iblZzYkN3Z2MzUmxjRVJsWTJsdFlXeHpLVHRjYmlBZ0lDQjlPMXh1WEc0Z0lDQWdMeThnVDNWMGMybGtaU0IwWlhOMGFXNW5YRzRnSUNBZ1UzQmxZM1J5ZFcwdWNISnZkRzkwZVhCbExtTnZiblpsY25RZ1BTQm1kVzVqZEdsdmJpaDJZV3gxWlNrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTVuWlhSVGRHVndLSFJvYVhNdWRHOVRkR1Z3Y0dsdVp5aDJZV3gxWlNrcE8xeHVJQ0FnSUgwN1hHNWNiaUFnSUNBdkwyVnVaSEpsWjJsdmJseHVYRzRnSUNBZ0x5OXlaV2RwYjI0Z1QzQjBhVzl1YzF4dVhHNGdJQ0FnTHlwY2RFVjJaWEo1SUdsdWNIVjBJRzl3ZEdsdmJpQnBjeUIwWlhOMFpXUWdZVzVrSUhCaGNuTmxaQzRnVkdocGN5ZHNiQ0J3Y21WMlpXNTBYRzRnSUNBZ0lDQWdJR1Z1Wkd4bGMzTWdkbUZzYVdSaGRHbHZiaUJwYmlCcGJuUmxjbTVoYkNCdFpYUm9iMlJ6TGlCVWFHVnpaU0IwWlhOMGN5QmhjbVZjYmlBZ0lDQWdJQ0FnYzNSeWRXTjBkWEpsWkNCM2FYUm9JR0Z1SUdsMFpXMGdabTl5SUdWMlpYSjVJRzl3ZEdsdmJpQmhkbUZwYkdGaWJHVXVJRUZ1WEc0Z0lDQWdJQ0FnSUc5d2RHbHZiaUJqWVc0Z1ltVWdiV0Z5YTJWa0lHRnpJSEpsY1hWcGNtVmtJR0o1SUhObGRIUnBibWNnZEdobElDZHlKeUJtYkdGbkxseHVJQ0FnSUNBZ0lDQlVhR1VnZEdWemRHbHVaeUJtZFc1amRHbHZiaUJwY3lCd2NtOTJhV1JsWkNCM2FYUm9JSFJvY21WbElHRnlaM1Z0Wlc1MGN6cGNiaUFnSUNBZ0lDQWdJQ0FnSUMwZ1ZHaGxJSEJ5YjNacFpHVmtJSFpoYkhWbElHWnZjaUIwYUdVZ2IzQjBhVzl1TzF4dUlDQWdJQ0FnSUNBZ0lDQWdMU0JCSUhKbFptVnlaVzVqWlNCMGJ5QjBhR1VnYjNCMGFXOXVjeUJ2WW1wbFkzUTdYRzRnSUNBZ0lDQWdJQ0FnSUNBdElGUm9aU0J1WVcxbElHWnZjaUIwYUdVZ2IzQjBhVzl1TzF4dVhHNGdJQ0FnSUNBZ0lGUm9aU0IwWlhOMGFXNW5JR1oxYm1OMGFXOXVJSEpsZEhWeWJuTWdabUZzYzJVZ2QyaGxiaUJoYmlCbGNuSnZjaUJwY3lCa1pYUmxZM1JsWkN4Y2JpQWdJQ0FnSUNBZ2IzSWdkSEoxWlNCM2FHVnVJR1YyWlhKNWRHaHBibWNnYVhNZ1Qwc3VJRWwwSUdOaGJpQmhiSE52SUcxdlpHbG1lU0IwYUdVZ2IzQjBhVzl1WEc0Z0lDQWdJQ0FnSUc5aWFtVmpkQ3dnZEc4Z2JXRnJaU0J6ZFhKbElHRnNiQ0IyWVd4MVpYTWdZMkZ1SUdKbElHTnZjbkpsWTNSc2VTQnNiMjl3WldRZ1pXeHpaWGRvWlhKbExpQXFMMXh1WEc0Z0lDQWdkbUZ5SUdSbFptRjFiSFJHYjNKdFlYUjBaWElnUFNCN1hHNGdJQ0FnSUNBZ0lIUnZPaUJtZFc1amRHbHZiaWgyWVd4MVpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUhaaGJIVmxJQ0U5UFNCMWJtUmxabWx1WldRZ0ppWWdkbUZzZFdVdWRHOUdhWGhsWkNneUtUdGNiaUFnSUNBZ0lDQWdmU3hjYmlBZ0lDQWdJQ0FnWm5KdmJUb2dUblZ0WW1WeVhHNGdJQ0FnZlR0Y2JseHVJQ0FnSUdaMWJtTjBhVzl1SUhaaGJHbGtZWFJsUm05eWJXRjBLR1Z1ZEhKNUtTQjdYRzRnSUNBZ0lDQWdJQzh2SUVGdWVTQnZZbXBsWTNRZ2QybDBhQ0JoSUhSdklHRnVaQ0JtY205dElHMWxkR2h2WkNCcGN5QnpkWEJ3YjNKMFpXUXVYRzRnSUNBZ0lDQWdJR2xtSUNocGMxWmhiR2xrUm05eWJXRjBkR1Z5S0dWdWRISjVLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlIUnlkV1U3WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb1hDSnViMVZwVTJ4cFpHVnlJQ2hjSWlBcklGWkZVbE5KVDA0Z0t5QmNJaWs2SUNkbWIzSnRZWFFuSUhKbGNYVnBjbVZ6SUNkMGJ5Y2dZVzVrSUNkbWNtOXRKeUJ0WlhSb2IyUnpMbHdpS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JtZFc1amRHbHZiaUIwWlhOMFUzUmxjQ2h3WVhKelpXUXNJR1Z1ZEhKNUtTQjdYRzRnSUNBZ0lDQWdJR2xtSUNnaGFYTk9kVzFsY21saktHVnVkSEo1S1NrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLRndpYm05VmFWTnNhV1JsY2lBb1hDSWdLeUJXUlZKVFNVOU9JQ3NnWENJcE9pQW5jM1JsY0NjZ2FYTWdibTkwSUc1MWJXVnlhV011WENJcE8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1ZHaGxJSE4wWlhBZ2IzQjBhVzl1SUdOaGJpQnpkR2xzYkNCaVpTQjFjMlZrSUhSdklITmxkQ0J6ZEdWd2NHbHVaMXh1SUNBZ0lDQWdJQ0F2THlCbWIzSWdiR2x1WldGeUlITnNhV1JsY25NdUlFOTJaWEozY21sMGRHVnVJR2xtSUhObGRDQnBiaUFuY21GdVoyVW5MbHh1SUNBZ0lDQWdJQ0J3WVhKelpXUXVjMmx1WjJ4bFUzUmxjQ0E5SUdWdWRISjVPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHWjFibU4wYVc5dUlIUmxjM1JTWVc1blpTaHdZWEp6WldRc0lHVnVkSEo1S1NCN1hHNGdJQ0FnSUNBZ0lDOHZJRVpwYkhSbGNpQnBibU52Y25KbFkzUWdhVzV3ZFhRdVhHNGdJQ0FnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdaVzUwY25rZ0lUMDlJRndpYjJKcVpXTjBYQ0lnZkh3Z1FYSnlZWGt1YVhOQmNuSmhlU2hsYm5SeWVTa3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loY0ltNXZWV2xUYkdsa1pYSWdLRndpSUNzZ1ZrVlNVMGxQVGlBcklGd2lLVG9nSjNKaGJtZGxKeUJwY3lCdWIzUWdZVzRnYjJKcVpXTjBMbHdpS1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQzh2SUVOaGRHTm9JRzFwYzNOcGJtY2djM1JoY25RZ2IzSWdaVzVrTGx4dUlDQWdJQ0FnSUNCcFppQW9aVzUwY25rdWJXbHVJRDA5UFNCMWJtUmxabWx1WldRZ2ZId2daVzUwY25rdWJXRjRJRDA5UFNCMWJtUmxabWx1WldRcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWhjSW01dlZXbFRiR2xrWlhJZ0tGd2lJQ3NnVmtWU1UwbFBUaUFySUZ3aUtUb2dUV2x6YzJsdVp5QW5iV2x1SnlCdmNpQW5iV0Y0SnlCcGJpQW5jbUZ1WjJVbkxsd2lLVHRjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDOHZJRU5oZEdOb0lHVnhkV0ZzSUhOMFlYSjBJRzl5SUdWdVpDNWNiaUFnSUNBZ0lDQWdhV1lnS0dWdWRISjVMbTFwYmlBOVBUMGdaVzUwY25rdWJXRjRLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb1hDSnViMVZwVTJ4cFpHVnlJQ2hjSWlBcklGWkZVbE5KVDA0Z0t5QmNJaWs2SUNkeVlXNW5aU2NnSjIxcGJpY2dZVzVrSUNkdFlYZ25JR05oYm01dmRDQmlaU0JsY1hWaGJDNWNJaWs3WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQndZWEp6WldRdWMzQmxZM1J5ZFcwZ1BTQnVaWGNnVTNCbFkzUnlkVzBvWlc1MGNua3NJSEJoY25ObFpDNXpibUZ3TENCd1lYSnpaV1F1YzJsdVoyeGxVM1JsY0NrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnWm5WdVkzUnBiMjRnZEdWemRGTjBZWEowS0hCaGNuTmxaQ3dnWlc1MGNua3BJSHRjYmlBZ0lDQWdJQ0FnWlc1MGNua2dQU0JoYzBGeWNtRjVLR1Z1ZEhKNUtUdGNibHh1SUNBZ0lDQWdJQ0F2THlCV1lXeHBaR0YwWlNCcGJuQjFkQzRnVm1Gc2RXVnpJR0Z5Wlc0bmRDQjBaWE4wWldRc0lHRnpJSFJvWlNCd2RXSnNhV01nTG5aaGJDQnRaWFJvYjJSY2JpQWdJQ0FnSUNBZ0x5OGdkMmxzYkNCaGJIZGhlWE1nY0hKdmRtbGtaU0JoSUhaaGJHbGtJR3h2WTJGMGFXOXVMbHh1SUNBZ0lDQWdJQ0JwWmlBb0lVRnljbUY1TG1selFYSnlZWGtvWlc1MGNua3BJSHg4SUNGbGJuUnllUzVzWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loY0ltNXZWV2xUYkdsa1pYSWdLRndpSUNzZ1ZrVlNVMGxQVGlBcklGd2lLVG9nSjNOMFlYSjBKeUJ2Y0hScGIyNGdhWE1nYVc1amIzSnlaV04wTGx3aUtUdGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUM4dklGTjBiM0psSUhSb1pTQnVkVzFpWlhJZ2IyWWdhR0Z1Wkd4bGN5NWNiaUFnSUNBZ0lDQWdjR0Z5YzJWa0xtaGhibVJzWlhNZ1BTQmxiblJ5ZVM1c1pXNW5kR2c3WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdWMmhsYmlCMGFHVWdjMnhwWkdWeUlHbHpJR2x1YVhScFlXeHBlbVZrTENCMGFHVWdMblpoYkNCdFpYUm9iMlFnZDJsc2JGeHVJQ0FnSUNBZ0lDQXZMeUJpWlNCallXeHNaV1FnZDJsMGFDQjBhR1VnYzNSaGNuUWdiM0IwYVc5dWN5NWNiaUFnSUNBZ0lDQWdjR0Z5YzJWa0xuTjBZWEowSUQwZ1pXNTBjbms3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdablZ1WTNScGIyNGdkR1Z6ZEZOdVlYQW9jR0Z5YzJWa0xDQmxiblJ5ZVNrZ2UxeHVJQ0FnSUNBZ0lDQXZMeUJGYm1admNtTmxJREV3TUNVZ2MzUmxjSEJwYm1jZ2QybDBhR2x1SUhOMVluSmhibWRsY3k1Y2JpQWdJQ0FnSUNBZ2NHRnljMlZrTG5OdVlYQWdQU0JsYm5SeWVUdGNibHh1SUNBZ0lDQWdJQ0JwWmlBb2RIbHdaVzltSUdWdWRISjVJQ0U5UFNCY0ltSnZiMnhsWVc1Y0lpa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0Z3aWJtOVZhVk5zYVdSbGNpQW9YQ0lnS3lCV1JWSlRTVTlPSUNzZ1hDSXBPaUFuYzI1aGNDY2diM0IwYVc5dUlHMTFjM1FnWW1VZ1lTQmliMjlzWldGdUxsd2lLVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJR1oxYm1OMGFXOXVJSFJsYzNSQmJtbHRZWFJsS0hCaGNuTmxaQ3dnWlc1MGNua3BJSHRjYmlBZ0lDQWdJQ0FnTHk4Z1JXNW1iM0pqWlNBeE1EQWxJSE4wWlhCd2FXNW5JSGRwZEdocGJpQnpkV0p5WVc1blpYTXVYRzRnSUNBZ0lDQWdJSEJoY25ObFpDNWhibWx0WVhSbElEMGdaVzUwY25rN1hHNWNiaUFnSUNBZ0lDQWdhV1lnS0hSNWNHVnZaaUJsYm5SeWVTQWhQVDBnWENKaWIyOXNaV0Z1WENJcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWhjSW01dlZXbFRiR2xrWlhJZ0tGd2lJQ3NnVmtWU1UwbFBUaUFySUZ3aUtUb2dKMkZ1YVcxaGRHVW5JRzl3ZEdsdmJpQnRkWE4wSUdKbElHRWdZbTl2YkdWaGJpNWNJaWs3WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JtZFc1amRHbHZiaUIwWlhOMFFXNXBiV0YwYVc5dVJIVnlZWFJwYjI0b2NHRnljMlZrTENCbGJuUnllU2tnZTF4dUlDQWdJQ0FnSUNCd1lYSnpaV1F1WVc1cGJXRjBhVzl1UkhWeVlYUnBiMjRnUFNCbGJuUnllVHRjYmx4dUlDQWdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlHVnVkSEo1SUNFOVBTQmNJbTUxYldKbGNsd2lLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb1hDSnViMVZwVTJ4cFpHVnlJQ2hjSWlBcklGWkZVbE5KVDA0Z0t5QmNJaWs2SUNkaGJtbHRZWFJwYjI1RWRYSmhkR2x2YmljZ2IzQjBhVzl1SUcxMWMzUWdZbVVnWVNCdWRXMWlaWEl1WENJcE8xeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1puVnVZM1JwYjI0Z2RHVnpkRU52Ym01bFkzUW9jR0Z5YzJWa0xDQmxiblJ5ZVNrZ2UxeHVJQ0FnSUNBZ0lDQjJZWElnWTI5dWJtVmpkQ0E5SUZ0bVlXeHpaVjA3WEc0Z0lDQWdJQ0FnSUhaaGNpQnBPMXh1WEc0Z0lDQWdJQ0FnSUM4dklFMWhjQ0JzWldkaFkza2diM0IwYVc5dWMxeHVJQ0FnSUNBZ0lDQnBaaUFvWlc1MGNua2dQVDA5SUZ3aWJHOTNaWEpjSWlrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnWlc1MGNua2dQU0JiZEhKMVpTd2dabUZzYzJWZE8xeHVJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2FXWWdLR1Z1ZEhKNUlEMDlQU0JjSW5Wd2NHVnlYQ0lwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR1Z1ZEhKNUlEMGdXMlpoYkhObExDQjBjblZsWFR0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQzh2SUVoaGJtUnNaU0JpYjI5c1pXRnVJRzl3ZEdsdmJuTmNiaUFnSUNBZ0lDQWdhV1lnS0dWdWRISjVJRDA5UFNCMGNuVmxJSHg4SUdWdWRISjVJRDA5UFNCbVlXeHpaU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdabTl5SUNocElEMGdNVHNnYVNBOElIQmhjbk5sWkM1b1lXNWtiR1Z6T3lCcEt5c3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JqYjI1dVpXTjBMbkIxYzJnb1pXNTBjbmtwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQmpiMjV1WldOMExuQjFjMmdvWm1Gc2MyVXBPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdVbVZxWldOMElHbHVkbUZzYVdRZ2FXNXdkWFJjYmlBZ0lDQWdJQ0FnWld4elpTQnBaaUFvSVVGeWNtRjVMbWx6UVhKeVlYa29aVzUwY25rcElIeDhJQ0ZsYm5SeWVTNXNaVzVuZEdnZ2ZId2daVzUwY25rdWJHVnVaM1JvSUNFOVBTQndZWEp6WldRdWFHRnVaR3hsY3lBcklERXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loY0ltNXZWV2xUYkdsa1pYSWdLRndpSUNzZ1ZrVlNVMGxQVGlBcklGd2lLVG9nSjJOdmJtNWxZM1FuSUc5d2RHbHZiaUJrYjJWemJpZDBJRzFoZEdOb0lHaGhibVJzWlNCamIzVnVkQzVjSWlrN1hHNGdJQ0FnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqYjI1dVpXTjBJRDBnWlc1MGNuazdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCd1lYSnpaV1F1WTI5dWJtVmpkQ0E5SUdOdmJtNWxZM1E3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdablZ1WTNScGIyNGdkR1Z6ZEU5eWFXVnVkR0YwYVc5dUtIQmhjbk5sWkN3Z1pXNTBjbmtwSUh0Y2JpQWdJQ0FnSUNBZ0x5OGdVMlYwSUc5eWFXVnVkR0YwYVc5dUlIUnZJR0Z1SUdFZ2JuVnRaWEpwWTJGc0lIWmhiSFZsSUdadmNpQmxZWE41WEc0Z0lDQWdJQ0FnSUM4dklHRnljbUY1SUhObGJHVmpkR2x2Ymk1Y2JpQWdJQ0FnSUNBZ2MzZHBkR05vSUNobGJuUnllU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdZMkZ6WlNCY0ltaHZjbWw2YjI1MFlXeGNJanBjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J3WVhKelpXUXViM0owSUQwZ01EdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmljbVZoYXp0Y2JpQWdJQ0FnSUNBZ0lDQWdJR05oYzJVZ1hDSjJaWEowYVdOaGJGd2lPbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEJoY25ObFpDNXZjblFnUFNBeE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHSnlaV0ZyTzF4dUlDQWdJQ0FnSUNBZ0lDQWdaR1ZtWVhWc2REcGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb1hDSnViMVZwVTJ4cFpHVnlJQ2hjSWlBcklGWkZVbE5KVDA0Z0t5QmNJaWs2SUNkdmNtbGxiblJoZEdsdmJpY2diM0IwYVc5dUlHbHpJR2x1ZG1Gc2FXUXVYQ0lwTzF4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWm5WdVkzUnBiMjRnZEdWemRFMWhjbWRwYmlod1lYSnpaV1FzSUdWdWRISjVLU0I3WEc0Z0lDQWdJQ0FnSUdsbUlDZ2hhWE5PZFcxbGNtbGpLR1Z1ZEhKNUtTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0Z3aWJtOVZhVk5zYVdSbGNpQW9YQ0lnS3lCV1JWSlRTVTlPSUNzZ1hDSXBPaUFuYldGeVoybHVKeUJ2Y0hScGIyNGdiWFZ6ZENCaVpTQnVkVzFsY21sakxsd2lLVHRjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDOHZJRWx6YzNWbElDTTFPREpjYmlBZ0lDQWdJQ0FnYVdZZ0tHVnVkSEo1SUQwOVBTQXdLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200N1hHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0J3WVhKelpXUXViV0Z5WjJsdUlEMGdjR0Z5YzJWa0xuTndaV04wY25WdExtZGxkRTFoY21kcGJpaGxiblJ5ZVNrN1hHNWNiaUFnSUNBZ0lDQWdhV1lnS0NGd1lYSnpaV1F1YldGeVoybHVLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb1hDSnViMVZwVTJ4cFpHVnlJQ2hjSWlBcklGWkZVbE5KVDA0Z0t5QmNJaWs2SUNkdFlYSm5hVzRuSUc5d2RHbHZiaUJwY3lCdmJteDVJSE4xY0hCdmNuUmxaQ0J2YmlCc2FXNWxZWElnYzJ4cFpHVnljeTVjSWlrN1hHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNCbWRXNWpkR2x2YmlCMFpYTjBUR2x0YVhRb2NHRnljMlZrTENCbGJuUnllU2tnZTF4dUlDQWdJQ0FnSUNCcFppQW9JV2x6VG5WdFpYSnBZeWhsYm5SeWVTa3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loY0ltNXZWV2xUYkdsa1pYSWdLRndpSUNzZ1ZrVlNVMGxQVGlBcklGd2lLVG9nSjJ4cGJXbDBKeUJ2Y0hScGIyNGdiWFZ6ZENCaVpTQnVkVzFsY21sakxsd2lLVHRjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lIQmhjbk5sWkM1c2FXMXBkQ0E5SUhCaGNuTmxaQzV6Y0dWamRISjFiUzVuWlhSTllYSm5hVzRvWlc1MGNua3BPMXh1WEc0Z0lDQWdJQ0FnSUdsbUlDZ2hjR0Z5YzJWa0xteHBiV2wwSUh4OElIQmhjbk5sWkM1b1lXNWtiR1Z6SUR3Z01pa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0Z4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUZ3aWJtOVZhVk5zYVdSbGNpQW9YQ0lnSzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQldSVkpUU1U5T0lDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWENJcE9pQW5iR2x0YVhRbklHOXdkR2x2YmlCcGN5QnZibXg1SUhOMWNIQnZjblJsWkNCdmJpQnNhVzVsWVhJZ2MyeHBaR1Z5Y3lCM2FYUm9JRElnYjNJZ2JXOXlaU0JvWVc1a2JHVnpMbHdpWEc0Z0lDQWdJQ0FnSUNBZ0lDQXBPMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdablZ1WTNScGIyNGdkR1Z6ZEZCaFpHUnBibWNvY0dGeWMyVmtMQ0JsYm5SeWVTa2dlMXh1SUNBZ0lDQWdJQ0JwWmlBb0lXbHpUblZ0WlhKcFl5aGxiblJ5ZVNrZ0ppWWdJVUZ5Y21GNUxtbHpRWEp5WVhrb1pXNTBjbmtwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9YRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdYQ0p1YjFWcFUyeHBaR1Z5SUNoY0lpQXJJRlpGVWxOSlQwNGdLeUJjSWlrNklDZHdZV1JrYVc1bkp5QnZjSFJwYjI0Z2JYVnpkQ0JpWlNCdWRXMWxjbWxqSUc5eUlHRnljbUY1SUc5bUlHVjRZV04wYkhrZ01pQnVkVzFpWlhKekxsd2lYRzRnSUNBZ0lDQWdJQ0FnSUNBcE8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnYVdZZ0tFRnljbUY1TG1selFYSnlZWGtvWlc1MGNua3BJQ1ltSUNFb1pXNTBjbmt1YkdWdVozUm9JRDA5UFNBeUlIeDhJR2x6VG5WdFpYSnBZeWhsYm5SeWVWc3dYU2tnZkh3Z2FYTk9kVzFsY21saktHVnVkSEo1V3pGZEtTa3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCY0ltNXZWV2xUYkdsa1pYSWdLRndpSUNzZ1ZrVlNVMGxQVGlBcklGd2lLVG9nSjNCaFpHUnBibWNuSUc5d2RHbHZiaUJ0ZFhOMElHSmxJRzUxYldWeWFXTWdiM0lnWVhKeVlYa2diMllnWlhoaFkzUnNlU0F5SUc1MWJXSmxjbk11WENKY2JpQWdJQ0FnSUNBZ0lDQWdJQ2s3WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQnBaaUFvWlc1MGNua2dQVDA5SURBcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGRIVnlianRjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2doUVhKeVlYa3VhWE5CY25KaGVTaGxiblJ5ZVNrcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdWdWRISjVJRDBnVzJWdWRISjVMQ0JsYm5SeWVWMDdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBdkx5QW5aMlYwVFdGeVoybHVKeUJ5WlhSMWNtNXpJR1poYkhObElHWnZjaUJwYm5aaGJHbGtJSFpoYkhWbGN5NWNiaUFnSUNBZ0lDQWdjR0Z5YzJWa0xuQmhaR1JwYm1jZ1BTQmJjR0Z5YzJWa0xuTndaV04wY25WdExtZGxkRTFoY21kcGJpaGxiblJ5ZVZzd1hTa3NJSEJoY25ObFpDNXpjR1ZqZEhKMWJTNW5aWFJOWVhKbmFXNG9aVzUwY25sYk1WMHBYVHRjYmx4dUlDQWdJQ0FnSUNCcFppQW9jR0Z5YzJWa0xuQmhaR1JwYm1kYk1GMGdQVDA5SUdaaGJITmxJSHg4SUhCaGNuTmxaQzV3WVdSa2FXNW5XekZkSUQwOVBTQm1ZV3h6WlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLRndpYm05VmFWTnNhV1JsY2lBb1hDSWdLeUJXUlZKVFNVOU9JQ3NnWENJcE9pQW5jR0ZrWkdsdVp5Y2diM0IwYVc5dUlHbHpJRzl1YkhrZ2MzVndjRzl5ZEdWa0lHOXVJR3hwYm1WaGNpQnpiR2xrWlhKekxsd2lLVHRjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2h3WVhKelpXUXVjR0ZrWkdsdVoxc3dYU0E4SURBZ2ZId2djR0Z5YzJWa0xuQmhaR1JwYm1kYk1WMGdQQ0F3S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9YQ0p1YjFWcFUyeHBaR1Z5SUNoY0lpQXJJRlpGVWxOSlQwNGdLeUJjSWlrNklDZHdZV1JrYVc1bkp5QnZjSFJwYjI0Z2JYVnpkQ0JpWlNCaElIQnZjMmwwYVhabElHNTFiV0psY2loektTNWNJaWs3WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQnBaaUFvY0dGeWMyVmtMbkJoWkdScGJtZGJNRjBnS3lCd1lYSnpaV1F1Y0dGa1pHbHVaMXN4WFNBK1BTQXhNREFwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGNJbTV2VldsVGJHbGtaWElnS0Z3aUlDc2dWa1ZTVTBsUFRpQXJJRndpS1RvZ0ozQmhaR1JwYm1jbklHOXdkR2x2YmlCdGRYTjBJRzV2ZENCbGVHTmxaV1FnTVRBd0pTQnZaaUIwYUdVZ2NtRnVaMlV1WENJcE8xeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1puVnVZM1JwYjI0Z2RHVnpkRVJwY21WamRHbHZiaWh3WVhKelpXUXNJR1Z1ZEhKNUtTQjdYRzRnSUNBZ0lDQWdJQzh2SUZObGRDQmthWEpsWTNScGIyNGdZWE1nWVNCdWRXMWxjbWxqWVd3Z2RtRnNkV1VnWm05eUlHVmhjM2tnY0dGeWMybHVaeTVjYmlBZ0lDQWdJQ0FnTHk4Z1NXNTJaWEowSUdOdmJtNWxZM1JwYjI0Z1ptOXlJRkpVVENCemJHbGtaWEp6TENCemJ5QjBhR0YwSUhSb1pTQndjbTl3WlhKY2JpQWdJQ0FnSUNBZ0x5OGdhR0Z1Wkd4bGN5Qm5aWFFnZEdobElHTnZibTVsWTNRdlltRmphMmR5YjNWdVpDQmpiR0Z6YzJWekxseHVJQ0FnSUNBZ0lDQnpkMmwwWTJnZ0tHVnVkSEo1S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqWVhObElGd2liSFJ5WENJNlhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2NHRnljMlZrTG1ScGNpQTlJREE3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWW5KbFlXczdYRzRnSUNBZ0lDQWdJQ0FnSUNCallYTmxJRndpY25Sc1hDSTZYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjR0Z5YzJWa0xtUnBjaUE5SURFN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1luSmxZV3M3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmtaV1poZFd4ME9seHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loY0ltNXZWV2xUYkdsa1pYSWdLRndpSUNzZ1ZrVlNVMGxQVGlBcklGd2lLVG9nSjJScGNtVmpkR2x2YmljZ2IzQjBhVzl1SUhkaGN5QnViM1FnY21WamIyZHVhWHBsWkM1Y0lpazdYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQm1kVzVqZEdsdmJpQjBaWE4wUW1Wb1lYWnBiM1Z5S0hCaGNuTmxaQ3dnWlc1MGNua3BJSHRjYmlBZ0lDQWdJQ0FnTHk4Z1RXRnJaU0J6ZFhKbElIUm9aU0JwYm5CMWRDQnBjeUJoSUhOMGNtbHVaeTVjYmlBZ0lDQWdJQ0FnYVdZZ0tIUjVjR1Z2WmlCbGJuUnllU0FoUFQwZ1hDSnpkSEpwYm1kY0lpa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0Z3aWJtOVZhVk5zYVdSbGNpQW9YQ0lnS3lCV1JWSlRTVTlPSUNzZ1hDSXBPaUFuWW1Wb1lYWnBiM1Z5SnlCdGRYTjBJR0psSUdFZ2MzUnlhVzVuSUdOdmJuUmhhVzVwYm1jZ2IzQjBhVzl1Y3k1Y0lpazdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBdkx5QkRhR1ZqYXlCcFppQjBhR1VnYzNSeWFXNW5JR052Ym5SaGFXNXpJR0Z1ZVNCclpYbDNiM0prY3k1Y2JpQWdJQ0FnSUNBZ0x5OGdUbTl1WlNCaGNtVWdjbVZ4ZFdseVpXUXVYRzRnSUNBZ0lDQWdJSFpoY2lCMFlYQWdQU0JsYm5SeWVTNXBibVJsZUU5bUtGd2lkR0Z3WENJcElENDlJREE3WEc0Z0lDQWdJQ0FnSUhaaGNpQmtjbUZuSUQwZ1pXNTBjbmt1YVc1a1pYaFBaaWhjSW1SeVlXZGNJaWtnUGowZ01EdGNiaUFnSUNBZ0lDQWdkbUZ5SUdacGVHVmtJRDBnWlc1MGNua3VhVzVrWlhoUFppaGNJbVpwZUdWa1hDSXBJRDQ5SURBN1hHNGdJQ0FnSUNBZ0lIWmhjaUJ6Ym1Gd0lEMGdaVzUwY25rdWFXNWtaWGhQWmloY0luTnVZWEJjSWlrZ1BqMGdNRHRjYmlBZ0lDQWdJQ0FnZG1GeUlHaHZkbVZ5SUQwZ1pXNTBjbmt1YVc1a1pYaFBaaWhjSW1odmRtVnlYQ0lwSUQ0OUlEQTdYRzRnSUNBZ0lDQWdJSFpoY2lCMWJtTnZibk4wY21GcGJtVmtJRDBnWlc1MGNua3VhVzVrWlhoUFppaGNJblZ1WTI5dWMzUnlZV2x1WldSY0lpa2dQajBnTUR0Y2JseHVJQ0FnSUNBZ0lDQnBaaUFvWm1sNFpXUXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2h3WVhKelpXUXVhR0Z1Wkd4bGN5QWhQVDBnTWlrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loY0ltNXZWV2xUYkdsa1pYSWdLRndpSUNzZ1ZrVlNVMGxQVGlBcklGd2lLVG9nSjJacGVHVmtKeUJpWldoaGRtbHZkWElnYlhWemRDQmlaU0IxYzJWa0lIZHBkR2dnTWlCb1lXNWtiR1Z6WENJcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0F2THlCVmMyVWdiV0Z5WjJsdUlIUnZJR1Z1Wm05eVkyVWdabWw0WldRZ2MzUmhkR1ZjYmlBZ0lDQWdJQ0FnSUNBZ0lIUmxjM1JOWVhKbmFXNG9jR0Z5YzJWa0xDQndZWEp6WldRdWMzUmhjblJiTVYwZ0xTQndZWEp6WldRdWMzUmhjblJiTUYwcE8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnYVdZZ0tIVnVZMjl1YzNSeVlXbHVaV1FnSmlZZ0tIQmhjbk5sWkM1dFlYSm5hVzRnZkh3Z2NHRnljMlZrTG14cGJXbDBLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lGd2libTlWYVZOc2FXUmxjaUFvWENJZ0t5QldSVkpUU1U5T0lDc2dYQ0lwT2lBbmRXNWpiMjV6ZEhKaGFXNWxaQ2NnWW1Wb1lYWnBiM1Z5SUdOaGJtNXZkQ0JpWlNCMWMyVmtJSGRwZEdnZ2JXRnlaMmx1SUc5eUlHeHBiV2wwWENKY2JpQWdJQ0FnSUNBZ0lDQWdJQ2s3WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQndZWEp6WldRdVpYWmxiblJ6SUQwZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZEdGd09pQjBZWEFnZkh3Z2MyNWhjQ3hjYmlBZ0lDQWdJQ0FnSUNBZ0lHUnlZV2M2SUdSeVlXY3NYRzRnSUNBZ0lDQWdJQ0FnSUNCbWFYaGxaRG9nWm1sNFpXUXNYRzRnSUNBZ0lDQWdJQ0FnSUNCemJtRndPaUJ6Ym1Gd0xGeHVJQ0FnSUNBZ0lDQWdJQ0FnYUc5MlpYSTZJR2h2ZG1WeUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnZFc1amIyNXpkSEpoYVc1bFpEb2dkVzVqYjI1emRISmhhVzVsWkZ4dUlDQWdJQ0FnSUNCOU8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdaMWJtTjBhVzl1SUhSbGMzUlViMjlzZEdsd2N5aHdZWEp6WldRc0lHVnVkSEo1S1NCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2hsYm5SeWVTQTlQVDBnWm1Gc2MyVXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymp0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJR2xtSUNobGJuUnllU0E5UFQwZ2RISjFaU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdjR0Z5YzJWa0xuUnZiMngwYVhCeklEMGdXMTA3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJR1p2Y2lBb2RtRnlJR2tnUFNBd095QnBJRHdnY0dGeWMyVmtMbWhoYm1Sc1pYTTdJR2tyS3lrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIQmhjbk5sWkM1MGIyOXNkR2x3Y3k1d2RYTm9LSFJ5ZFdVcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdjR0Z5YzJWa0xuUnZiMngwYVhCeklEMGdZWE5CY25KaGVTaGxiblJ5ZVNrN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaHdZWEp6WldRdWRHOXZiSFJwY0hNdWJHVnVaM1JvSUNFOVBTQndZWEp6WldRdWFHRnVaR3hsY3lrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loY0ltNXZWV2xUYkdsa1pYSWdLRndpSUNzZ1ZrVlNVMGxQVGlBcklGd2lLVG9nYlhWemRDQndZWE56SUdFZ1ptOXliV0YwZEdWeUlHWnZjaUJoYkd3Z2FHRnVaR3hsY3k1Y0lpazdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0FnSUhCaGNuTmxaQzUwYjI5c2RHbHdjeTVtYjNKRllXTm9LR1oxYm1OMGFXOXVLR1p2Y20xaGRIUmxjaWtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsbUlDaGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZEhsd1pXOW1JR1p2Y20xaGRIUmxjaUFoUFQwZ1hDSmliMjlzWldGdVhDSWdKaVpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0tIUjVjR1Z2WmlCbWIzSnRZWFIwWlhJZ0lUMDlJRndpYjJKcVpXTjBYQ0lnZkh3Z2RIbHdaVzltSUdadmNtMWhkSFJsY2k1MGJ5QWhQVDBnWENKbWRXNWpkR2x2Ymx3aUtWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvWENKdWIxVnBVMnhwWkdWeUlDaGNJaUFySUZaRlVsTkpUMDRnS3lCY0lpazZJQ2QwYjI5c2RHbHdjeWNnYlhWemRDQmlaU0J3WVhOelpXUWdZU0JtYjNKdFlYUjBaWElnYjNJZ0oyWmhiSE5sSnk1Y0lpazdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQm1kVzVqZEdsdmJpQjBaWE4wUVhKcFlVWnZjbTFoZENod1lYSnpaV1FzSUdWdWRISjVLU0I3WEc0Z0lDQWdJQ0FnSUhCaGNuTmxaQzVoY21saFJtOXliV0YwSUQwZ1pXNTBjbms3WEc0Z0lDQWdJQ0FnSUhaaGJHbGtZWFJsUm05eWJXRjBLR1Z1ZEhKNUtUdGNiaUFnSUNCOVhHNWNiaUFnSUNCbWRXNWpkR2x2YmlCMFpYTjBSbTl5YldGMEtIQmhjbk5sWkN3Z1pXNTBjbmtwSUh0Y2JpQWdJQ0FnSUNBZ2NHRnljMlZrTG1admNtMWhkQ0E5SUdWdWRISjVPMXh1SUNBZ0lDQWdJQ0IyWVd4cFpHRjBaVVp2Y20xaGRDaGxiblJ5ZVNrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnWm5WdVkzUnBiMjRnZEdWemRFdGxlV0p2WVhKa1UzVndjRzl5ZENod1lYSnpaV1FzSUdWdWRISjVLU0I3WEc0Z0lDQWdJQ0FnSUhCaGNuTmxaQzVyWlhsaWIyRnlaRk4xY0hCdmNuUWdQU0JsYm5SeWVUdGNibHh1SUNBZ0lDQWdJQ0JwWmlBb2RIbHdaVzltSUdWdWRISjVJQ0U5UFNCY0ltSnZiMnhsWVc1Y0lpa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0Z3aWJtOVZhVk5zYVdSbGNpQW9YQ0lnS3lCV1JWSlRTVTlPSUNzZ1hDSXBPaUFuYTJWNVltOWhjbVJUZFhCd2IzSjBKeUJ2Y0hScGIyNGdiWFZ6ZENCaVpTQmhJR0p2YjJ4bFlXNHVYQ0lwTzF4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWm5WdVkzUnBiMjRnZEdWemRFUnZZM1Z0Wlc1MFJXeGxiV1Z1ZENod1lYSnpaV1FzSUdWdWRISjVLU0I3WEc0Z0lDQWdJQ0FnSUM4dklGUm9hWE1nYVhNZ1lXNGdZV1IyWVc1alpXUWdiM0IwYVc5dUxpQlFZWE56WldRZ2RtRnNkV1Z6SUdGeVpTQjFjMlZrSUhkcGRHaHZkWFFnZG1Gc2FXUmhkR2x2Ymk1Y2JpQWdJQ0FnSUNBZ2NHRnljMlZrTG1SdlkzVnRaVzUwUld4bGJXVnVkQ0E5SUdWdWRISjVPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHWjFibU4wYVc5dUlIUmxjM1JEYzNOUWNtVm1hWGdvY0dGeWMyVmtMQ0JsYm5SeWVTa2dlMXh1SUNBZ0lDQWdJQ0JwWmlBb2RIbHdaVzltSUdWdWRISjVJQ0U5UFNCY0luTjBjbWx1WjF3aUlDWW1JR1Z1ZEhKNUlDRTlQU0JtWVd4elpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0Z3aWJtOVZhVk5zYVdSbGNpQW9YQ0lnS3lCV1JWSlRTVTlPSUNzZ1hDSXBPaUFuWTNOelVISmxabWw0SnlCdGRYTjBJR0psSUdFZ2MzUnlhVzVuSUc5eUlHQm1ZV3h6WldBdVhDSXBPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2NHRnljMlZrTG1OemMxQnlaV1pwZUNBOUlHVnVkSEo1TzF4dUlDQWdJSDFjYmx4dUlDQWdJR1oxYm1OMGFXOXVJSFJsYzNSRGMzTkRiR0Z6YzJWektIQmhjbk5sWkN3Z1pXNTBjbmtwSUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLSFI1Y0dWdlppQmxiblJ5ZVNBaFBUMGdYQ0p2WW1wbFkzUmNJaWtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtGd2libTlWYVZOc2FXUmxjaUFvWENJZ0t5QldSVkpUU1U5T0lDc2dYQ0lwT2lBblkzTnpRMnhoYzNObGN5Y2diWFZ6ZENCaVpTQmhiaUJ2WW1wbFkzUXVYQ0lwTzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdhV1lnS0hSNWNHVnZaaUJ3WVhKelpXUXVZM056VUhKbFptbDRJRDA5UFNCY0luTjBjbWx1WjF3aUtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCd1lYSnpaV1F1WTNOelEyeGhjM05sY3lBOUlIdDlPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQm1iM0lnS0haaGNpQnJaWGtnYVc0Z1pXNTBjbmtwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcFppQW9JV1Z1ZEhKNUxtaGhjMDkzYmxCeWIzQmxjblI1S0d0bGVTa3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1kyOXVkR2x1ZFdVN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjR0Z5YzJWa0xtTnpjME5zWVhOelpYTmJhMlY1WFNBOUlIQmhjbk5sWkM1amMzTlFjbVZtYVhnZ0t5QmxiblJ5ZVZ0clpYbGRPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnY0dGeWMyVmtMbU56YzBOc1lYTnpaWE1nUFNCbGJuUnllVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUZSbGMzUWdZV3hzSUdSbGRtVnNiM0JsY2lCelpYUjBhVzVuY3lCaGJtUWdjR0Z5YzJVZ2RHOGdZWE56ZFcxd2RHbHZiaTF6WVdabElIWmhiSFZsY3k1Y2JpQWdJQ0JtZFc1amRHbHZiaUIwWlhOMFQzQjBhVzl1Y3lodmNIUnBiMjV6S1NCN1hHNGdJQ0FnSUNBZ0lDOHZJRlJ2SUhCeWIzWmxJR0VnWm1sNElHWnZjaUFqTlRNM0xDQm1jbVZsZW1VZ2IzQjBhVzl1Y3lCb1pYSmxMbHh1SUNBZ0lDQWdJQ0F2THlCSlppQjBhR1VnYjJKcVpXTjBJR2x6SUcxdlpHbG1hV1ZrTENCaGJpQmxjbkp2Y2lCM2FXeHNJR0psSUhSb2NtOTNiaTVjYmlBZ0lDQWdJQ0FnTHk4Z1QySnFaV04wTG1aeVpXVjZaU2h2Y0hScGIyNXpLVHRjYmx4dUlDQWdJQ0FnSUNCMllYSWdjR0Z5YzJWa0lEMGdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2JXRnlaMmx1T2lBd0xGeHVJQ0FnSUNBZ0lDQWdJQ0FnYkdsdGFYUTZJREFzWEc0Z0lDQWdJQ0FnSUNBZ0lDQndZV1JrYVc1bk9pQXdMRnh1SUNBZ0lDQWdJQ0FnSUNBZ1lXNXBiV0YwWlRvZ2RISjFaU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lHRnVhVzFoZEdsdmJrUjFjbUYwYVc5dU9pQXpNREFzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmhjbWxoUm05eWJXRjBPaUJrWldaaGRXeDBSbTl5YldGMGRHVnlMRnh1SUNBZ0lDQWdJQ0FnSUNBZ1ptOXliV0YwT2lCa1pXWmhkV3gwUm05eWJXRjBkR1Z5WEc0Z0lDQWdJQ0FnSUgwN1hHNWNiaUFnSUNBZ0lDQWdMeThnVkdWemRITWdZWEpsSUdWNFpXTjFkR1ZrSUdsdUlIUm9aU0J2Y21SbGNpQjBhR1Y1SUdGeVpTQndjbVZ6Wlc1MFpXUWdhR1Z5WlM1Y2JpQWdJQ0FnSUNBZ2RtRnlJSFJsYzNSeklEMGdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2MzUmxjRG9nZXlCeU9pQm1ZV3h6WlN3Z2REb2dkR1Z6ZEZOMFpYQWdmU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lITjBZWEowT2lCN0lISTZJSFJ5ZFdVc0lIUTZJSFJsYzNSVGRHRnlkQ0I5TEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMjl1Ym1WamREb2dleUJ5T2lCMGNuVmxMQ0IwT2lCMFpYTjBRMjl1Ym1WamRDQjlMRnh1SUNBZ0lDQWdJQ0FnSUNBZ1pHbHlaV04wYVc5dU9pQjdJSEk2SUhSeWRXVXNJSFE2SUhSbGMzUkVhWEpsWTNScGIyNGdmU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lITnVZWEE2SUhzZ2Nqb2dabUZzYzJVc0lIUTZJSFJsYzNSVGJtRndJSDBzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmhibWx0WVhSbE9pQjdJSEk2SUdaaGJITmxMQ0IwT2lCMFpYTjBRVzVwYldGMFpTQjlMRnh1SUNBZ0lDQWdJQ0FnSUNBZ1lXNXBiV0YwYVc5dVJIVnlZWFJwYjI0NklIc2djam9nWm1Gc2MyVXNJSFE2SUhSbGMzUkJibWx0WVhScGIyNUVkWEpoZEdsdmJpQjlMRnh1SUNBZ0lDQWdJQ0FnSUNBZ2NtRnVaMlU2SUhzZ2Nqb2dkSEoxWlN3Z2REb2dkR1Z6ZEZKaGJtZGxJSDBzWEc0Z0lDQWdJQ0FnSUNBZ0lDQnZjbWxsYm5SaGRHbHZiam9nZXlCeU9pQm1ZV3h6WlN3Z2REb2dkR1Z6ZEU5eWFXVnVkR0YwYVc5dUlIMHNYRzRnSUNBZ0lDQWdJQ0FnSUNCdFlYSm5hVzQ2SUhzZ2Nqb2dabUZzYzJVc0lIUTZJSFJsYzNSTllYSm5hVzRnZlN4Y2JpQWdJQ0FnSUNBZ0lDQWdJR3hwYldsME9pQjdJSEk2SUdaaGJITmxMQ0IwT2lCMFpYTjBUR2x0YVhRZ2ZTeGNiaUFnSUNBZ0lDQWdJQ0FnSUhCaFpHUnBibWM2SUhzZ2Nqb2dabUZzYzJVc0lIUTZJSFJsYzNSUVlXUmthVzVuSUgwc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JpWldoaGRtbHZkWEk2SUhzZ2Nqb2dkSEoxWlN3Z2REb2dkR1Z6ZEVKbGFHRjJhVzkxY2lCOUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWVhKcFlVWnZjbTFoZERvZ2V5QnlPaUJtWVd4elpTd2dkRG9nZEdWemRFRnlhV0ZHYjNKdFlYUWdmU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lHWnZjbTFoZERvZ2V5QnlPaUJtWVd4elpTd2dkRG9nZEdWemRFWnZjbTFoZENCOUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnZEc5dmJIUnBjSE02SUhzZ2Nqb2dabUZzYzJVc0lIUTZJSFJsYzNSVWIyOXNkR2x3Y3lCOUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnYTJWNVltOWhjbVJUZFhCd2IzSjBPaUI3SUhJNklIUnlkV1VzSUhRNklIUmxjM1JMWlhsaWIyRnlaRk4xY0hCdmNuUWdmU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lHUnZZM1Z0Wlc1MFJXeGxiV1Z1ZERvZ2V5QnlPaUJtWVd4elpTd2dkRG9nZEdWemRFUnZZM1Z0Wlc1MFJXeGxiV1Z1ZENCOUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTNOelVISmxabWw0T2lCN0lISTZJSFJ5ZFdVc0lIUTZJSFJsYzNSRGMzTlFjbVZtYVhnZ2ZTeGNiaUFnSUNBZ0lDQWdJQ0FnSUdOemMwTnNZWE56WlhNNklIc2djam9nZEhKMVpTd2dkRG9nZEdWemRFTnpjME5zWVhOelpYTWdmVnh1SUNBZ0lDQWdJQ0I5TzF4dVhHNGdJQ0FnSUNBZ0lIWmhjaUJrWldaaGRXeDBjeUE5SUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR052Ym01bFkzUTZJR1poYkhObExGeHVJQ0FnSUNBZ0lDQWdJQ0FnWkdseVpXTjBhVzl1T2lCY0lteDBjbHdpTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdZbVZvWVhacGIzVnlPaUJjSW5SaGNGd2lMRnh1SUNBZ0lDQWdJQ0FnSUNBZ2IzSnBaVzUwWVhScGIyNDZJRndpYUc5eWFYcHZiblJoYkZ3aUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnYTJWNVltOWhjbVJUZFhCd2IzSjBPaUIwY25WbExGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTNOelVISmxabWw0T2lCY0ltNXZWV2t0WENJc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqYzNORGJHRnpjMlZ6T2lCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RHRnlaMlYwT2lCY0luUmhjbWRsZEZ3aUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHSmhjMlU2SUZ3aVltRnpaVndpTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUc5eWFXZHBiam9nWENKdmNtbG5hVzVjSWl4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCb1lXNWtiR1U2SUZ3aWFHRnVaR3hsWENJc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FHRnVaR3hsVEc5M1pYSTZJRndpYUdGdVpHeGxMV3h2ZDJWeVhDSXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhR0Z1Wkd4bFZYQndaWEk2SUZ3aWFHRnVaR3hsTFhWd2NHVnlYQ0lzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZEc5MVkyaEJjbVZoT2lCY0luUnZkV05vTFdGeVpXRmNJaXhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JvYjNKcGVtOXVkR0ZzT2lCY0ltaHZjbWw2YjI1MFlXeGNJaXhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IyWlhKMGFXTmhiRG9nWENKMlpYSjBhV05oYkZ3aUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHSmhZMnRuY205MWJtUTZJRndpWW1GamEyZHliM1Z1WkZ3aUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHTnZibTVsWTNRNklGd2lZMjl1Ym1WamRGd2lMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR052Ym01bFkzUnpPaUJjSW1OdmJtNWxZM1J6WENJc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2JIUnlPaUJjSW14MGNsd2lMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEowYkRvZ1hDSnlkR3hjSWl4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCa2NtRm5aMkZpYkdVNklGd2laSEpoWjJkaFlteGxYQ0lzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWkhKaFp6b2dYQ0p6ZEdGMFpTMWtjbUZuWENJc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RHRndPaUJjSW5OMFlYUmxMWFJoY0Z3aUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHRmpkR2wyWlRvZ1hDSmhZM1JwZG1WY0lpeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjBiMjlzZEdsd09pQmNJblJ2YjJ4MGFYQmNJaXhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J3YVhCek9pQmNJbkJwY0hOY0lpeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQndhWEJ6U0c5eWFYcHZiblJoYkRvZ1hDSndhWEJ6TFdodmNtbDZiMjUwWVd4Y0lpeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQndhWEJ6Vm1WeWRHbGpZV3c2SUZ3aWNHbHdjeTEyWlhKMGFXTmhiRndpTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUcxaGNtdGxjam9nWENKdFlYSnJaWEpjSWl4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCdFlYSnJaWEpJYjNKcGVtOXVkR0ZzT2lCY0ltMWhjbXRsY2kxb2IzSnBlbTl1ZEdGc1hDSXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdiV0Z5YTJWeVZtVnlkR2xqWVd3NklGd2liV0Z5YTJWeUxYWmxjblJwWTJGc1hDSXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdiV0Z5YTJWeVRtOXliV0ZzT2lCY0ltMWhjbXRsY2kxdWIzSnRZV3hjSWl4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCdFlYSnJaWEpNWVhKblpUb2dYQ0p0WVhKclpYSXRiR0Z5WjJWY0lpeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnRZWEpyWlhKVGRXSTZJRndpYldGeWEyVnlMWE4xWWx3aUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIWmhiSFZsT2lCY0luWmhiSFZsWENJc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RtRnNkV1ZJYjNKcGVtOXVkR0ZzT2lCY0luWmhiSFZsTFdodmNtbDZiMjUwWVd4Y0lpeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjJZV3gxWlZabGNuUnBZMkZzT2lCY0luWmhiSFZsTFhabGNuUnBZMkZzWENJc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RtRnNkV1ZPYjNKdFlXdzZJRndpZG1Gc2RXVXRibTl5YldGc1hDSXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkbUZzZFdWTVlYSm5aVG9nWENKMllXeDFaUzFzWVhKblpWd2lMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFpoYkhWbFUzVmlPaUJjSW5aaGJIVmxMWE4xWWx3aVhHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUgwN1hHNWNiaUFnSUNBZ0lDQWdMeThnUVhKcFlVWnZjbTFoZENCa1pXWmhkV3gwY3lCMGJ5QnlaV2QxYkdGeUlHWnZjbTFoZEN3Z2FXWWdZVzU1TGx4dUlDQWdJQ0FnSUNCcFppQW9iM0IwYVc5dWN5NW1iM0p0WVhRZ0ppWWdJVzl3ZEdsdmJuTXVZWEpwWVVadmNtMWhkQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdiM0IwYVc5dWN5NWhjbWxoUm05eWJXRjBJRDBnYjNCMGFXOXVjeTVtYjNKdFlYUTdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBdkx5QlNkVzRnWVd4c0lHOXdkR2x2Ym5NZ2RHaHliM1ZuYUNCaElIUmxjM1JwYm1jZ2JXVmphR0Z1YVhOdElIUnZJR1Z1YzNWeVpTQmpiM0p5WldOMFhHNGdJQ0FnSUNBZ0lDOHZJR2x1Y0hWMExpQkpkQ0J6YUc5MWJHUWdZbVVnYm05MFpXUWdkR2hoZENCdmNIUnBiMjV6SUcxcFoyaDBJR2RsZENCdGIyUnBabWxsWkNCMGIxeHVJQ0FnSUNBZ0lDQXZMeUJpWlNCb1lXNWtiR1ZrSUhCeWIzQmxjbXg1TGlCRkxtY3VJSGR5WVhCd2FXNW5JR2x1ZEdWblpYSnpJR2x1SUdGeWNtRjVjeTVjYmlBZ0lDQWdJQ0FnVDJKcVpXTjBMbXRsZVhNb2RHVnpkSE1wTG1admNrVmhZMmdvWm5WdVkzUnBiMjRvYm1GdFpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdTV1lnZEdobElHOXdkR2x2YmlCcGMyNG5kQ0J6WlhRc0lHSjFkQ0JwZENCcGN5QnlaWEYxYVhKbFpDd2dkR2h5YjNjZ1lXNGdaWEp5YjNJdVhHNGdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb0lXbHpVMlYwS0c5d2RHbHZibk5iYm1GdFpWMHBJQ1ltSUdSbFptRjFiSFJ6VzI1aGJXVmRJRDA5UFNCMWJtUmxabWx1WldRcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnBaaUFvZEdWemRITmJibUZ0WlYwdWNpa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvWENKdWIxVnBVMnhwWkdWeUlDaGNJaUFySUZaRlVsTkpUMDRnS3lCY0lpazZJQ2RjSWlBcklHNWhiV1VnS3lCY0lpY2dhWE1nY21WeGRXbHlaV1F1WENJcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQjBjblZsTzF4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBaWE4wYzF0dVlXMWxYUzUwS0hCaGNuTmxaQ3dnSVdselUyVjBLRzl3ZEdsdmJuTmJibUZ0WlYwcElEOGdaR1ZtWVhWc2RITmJibUZ0WlYwZ09pQnZjSFJwYjI1elcyNWhiV1ZkS1R0Y2JpQWdJQ0FnSUNBZ2ZTazdYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1JtOXlkMkZ5WkNCd2FYQnpJRzl3ZEdsdmJuTmNiaUFnSUNBZ0lDQWdjR0Z5YzJWa0xuQnBjSE1nUFNCdmNIUnBiMjV6TG5CcGNITTdYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1FXeHNJSEpsWTJWdWRDQmljbTkzYzJWeWN5QmhZMk5sY0hRZ2RXNXdjbVZtYVhobFpDQjBjbUZ1YzJadmNtMHVYRzRnSUNBZ0lDQWdJQzh2SUZkbElHNWxaV1FnTFcxekxTQm1iM0lnU1VVNUlHRnVaQ0F0ZDJWaWEybDBMU0JtYjNJZ2IyeGtaWElnUVc1a2NtOXBaRHRjYmlBZ0lDQWdJQ0FnTHk4Z1FYTnpkVzFsSUhWelpTQnZaaUF0ZDJWaWEybDBMU0JwWmlCMWJuQnlaV1pwZUdWa0lHRnVaQ0F0YlhNdElHRnlaU0J1YjNRZ2MzVndjRzl5ZEdWa0xseHVJQ0FnSUNBZ0lDQXZMeUJvZEhSd2N6b3ZMMk5oYm1sMWMyVXVZMjl0THlObVpXRjBQWFJ5WVc1elptOXliWE15WkZ4dUlDQWdJQ0FnSUNCMllYSWdaQ0E5SUdSdlkzVnRaVzUwTG1OeVpXRjBaVVZzWlcxbGJuUW9YQ0prYVhaY0lpazdYRzRnSUNBZ0lDQWdJSFpoY2lCdGMxQnlaV1pwZUNBOUlHUXVjM1I1YkdVdWJYTlVjbUZ1YzJadmNtMGdJVDA5SUhWdVpHVm1hVzVsWkR0Y2JpQWdJQ0FnSUNBZ2RtRnlJRzV2VUhKbFptbDRJRDBnWkM1emRIbHNaUzUwY21GdWMyWnZjbTBnSVQwOUlIVnVaR1ZtYVc1bFpEdGNibHh1SUNBZ0lDQWdJQ0J3WVhKelpXUXVkSEpoYm5ObWIzSnRVblZzWlNBOUlHNXZVSEpsWm1sNElEOGdYQ0owY21GdWMyWnZjbTFjSWlBNklHMXpVSEpsWm1sNElEOGdYQ0p0YzFSeVlXNXpabTl5YlZ3aUlEb2dYQ0ozWldKcmFYUlVjbUZ1YzJadmNtMWNJanRjYmx4dUlDQWdJQ0FnSUNBdkx5QlFhWEJ6SUdSdmJpZDBJRzF2ZG1Vc0lITnZJSGRsSUdOaGJpQndiR0ZqWlNCMGFHVnRJSFZ6YVc1bklHeGxablF2ZEc5d0xseHVJQ0FnSUNBZ0lDQjJZWElnYzNSNWJHVnpJRDBnVzF0Y0lteGxablJjSWl3Z1hDSjBiM0JjSWwwc0lGdGNJbkpwWjJoMFhDSXNJRndpWW05MGRHOXRYQ0pkWFR0Y2JseHVJQ0FnSUNBZ0lDQndZWEp6WldRdWMzUjViR1VnUFNCemRIbHNaWE5iY0dGeWMyVmtMbVJwY2wxYmNHRnljMlZrTG05eWRGMDdYRzVjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSEJoY25ObFpEdGNiaUFnSUNCOVhHNWNiaUFnSUNBdkwyVnVaSEpsWjJsdmJseHVYRzRnSUNBZ1puVnVZM1JwYjI0Z2MyTnZjR1VvZEdGeVoyVjBMQ0J2Y0hScGIyNXpMQ0J2Y21sbmFXNWhiRTl3ZEdsdmJuTXBJSHRjYmlBZ0lDQWdJQ0FnZG1GeUlHRmpkR2x2Ym5NZ1BTQm5aWFJCWTNScGIyNXpLQ2s3WEc0Z0lDQWdJQ0FnSUhaaGNpQnpkWEJ3YjNKMGMxUnZkV05vUVdOMGFXOXVUbTl1WlNBOUlHZGxkRk4xY0hCdmNuUnpWRzkxWTJoQlkzUnBiMjVPYjI1bEtDazdYRzRnSUNBZ0lDQWdJSFpoY2lCemRYQndiM0owYzFCaGMzTnBkbVVnUFNCemRYQndiM0owYzFSdmRXTm9RV04wYVc5dVRtOXVaU0FtSmlCblpYUlRkWEJ3YjNKMGMxQmhjM05wZG1Vb0tUdGNibHh1SUNBZ0lDQWdJQ0F2THlCQmJHd2dkbUZ5YVdGaWJHVnpJR3h2WTJGc0lIUnZJQ2R6WTI5d1pTY2dZWEpsSUhCeVpXWnBlR1ZrSUhkcGRHZ2dKM05qYjNCbFh5ZGNibHh1SUNBZ0lDQWdJQ0F2THlCVGJHbGtaWElnUkU5TklFNXZaR1Z6WEc0Z0lDQWdJQ0FnSUhaaGNpQnpZMjl3WlY5VVlYSm5aWFFnUFNCMFlYSm5aWFE3WEc0Z0lDQWdJQ0FnSUhaaGNpQnpZMjl3WlY5Q1lYTmxPMXh1SUNBZ0lDQWdJQ0IyWVhJZ2MyTnZjR1ZmU0dGdVpHeGxjenRjYmlBZ0lDQWdJQ0FnZG1GeUlITmpiM0JsWDBOdmJtNWxZM1J6TzF4dUlDQWdJQ0FnSUNCMllYSWdjMk52Y0dWZlVHbHdjenRjYmlBZ0lDQWdJQ0FnZG1GeUlITmpiM0JsWDFSdmIyeDBhWEJ6TzF4dVhHNGdJQ0FnSUNBZ0lDOHZJRTkyWlhKeWFXUmxJR1p2Y2lCMGFHVWdKMkZ1YVcxaGRHVW5JRzl3ZEdsdmJseHVJQ0FnSUNBZ0lDQjJZWElnYzJOdmNHVmZVMmh2ZFd4a1FXNXBiV0YwWlNBOUlIUnlkV1U3WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdVMnhwWkdWeUlITjBZWFJsSUhaaGJIVmxjMXh1SUNBZ0lDQWdJQ0IyWVhJZ2MyTnZjR1ZmVTNCbFkzUnlkVzBnUFNCdmNIUnBiMjV6TG5Od1pXTjBjblZ0TzF4dUlDQWdJQ0FnSUNCMllYSWdjMk52Y0dWZlZtRnNkV1Z6SUQwZ1cxMDdYRzRnSUNBZ0lDQWdJSFpoY2lCelkyOXdaVjlNYjJOaGRHbHZibk1nUFNCYlhUdGNiaUFnSUNBZ0lDQWdkbUZ5SUhOamIzQmxYMGhoYm1Sc1pVNTFiV0psY25NZ1BTQmJYVHRjYmlBZ0lDQWdJQ0FnZG1GeUlITmpiM0JsWDBGamRHbDJaVWhoYm1Sc1pYTkRiM1Z1ZENBOUlEQTdYRzRnSUNBZ0lDQWdJSFpoY2lCelkyOXdaVjlGZG1WdWRITWdQU0I3ZlR0Y2JseHVJQ0FnSUNBZ0lDQXZMeUJGZUhCdmMyVmtJRUZRU1Z4dUlDQWdJQ0FnSUNCMllYSWdjMk52Y0dWZlUyVnNaanRjYmx4dUlDQWdJQ0FnSUNBdkx5QkViMk4xYldWdWRDQk9iMlJsYzF4dUlDQWdJQ0FnSUNCMllYSWdjMk52Y0dWZlJHOWpkVzFsYm5RZ1BTQjBZWEpuWlhRdWIzZHVaWEpFYjJOMWJXVnVkRHRjYmlBZ0lDQWdJQ0FnZG1GeUlITmpiM0JsWDBSdlkzVnRaVzUwUld4bGJXVnVkQ0E5SUc5d2RHbHZibk11Wkc5amRXMWxiblJGYkdWdFpXNTBJSHg4SUhOamIzQmxYMFJ2WTNWdFpXNTBMbVJ2WTNWdFpXNTBSV3hsYldWdWREdGNiaUFnSUNBZ0lDQWdkbUZ5SUhOamIzQmxYMEp2WkhrZ1BTQnpZMjl3WlY5RWIyTjFiV1Z1ZEM1aWIyUjVPMXh1WEc0Z0lDQWdJQ0FnSUM4dklGQnBjSE1nWTI5dWMzUmhiblJ6WEc0Z0lDQWdJQ0FnSUhaaGNpQlFTVkJUWDA1UFRrVWdQU0F0TVR0Y2JpQWdJQ0FnSUNBZ2RtRnlJRkJKVUZOZlRrOWZWa0ZNVlVVZ1BTQXdPMXh1SUNBZ0lDQWdJQ0IyWVhJZ1VFbFFVMTlNUVZKSFJWOVdRVXhWUlNBOUlERTdYRzRnSUNBZ0lDQWdJSFpoY2lCUVNWQlRYMU5OUVV4TVgxWkJURlZGSUQwZ01qdGNibHh1SUNBZ0lDQWdJQ0F2THlCR2IzSWdhRzl5YVhwdmJuUmhiQ0J6Ykdsa1pYSnpJR2x1SUhOMFlXNWtZWEprSUd4MGNpQmtiMk4xYldWdWRITXNYRzRnSUNBZ0lDQWdJQzh2SUcxaGEyVWdMbTV2VldrdGIzSnBaMmx1SUc5MlpYSm1iRzkzSUhSdklIUm9aU0JzWldaMElITnZJSFJvWlNCa2IyTjFiV1Z1ZENCa2IyVnpiaWQwSUhOamNtOXNiQzVjYmlBZ0lDQWdJQ0FnZG1GeUlITmpiM0JsWDBScGNrOW1abk5sZENBOUlITmpiM0JsWDBSdlkzVnRaVzUwTG1ScGNpQTlQVDBnWENKeWRHeGNJaUI4ZkNCdmNIUnBiMjV6TG05eWRDQTlQVDBnTVNBL0lEQWdPaUF4TURBN1hHNWNiaUFnSUNBZ0lDQWdMeThnUTNKbFlYUmxjeUJoSUc1dlpHVXNJR0ZrWkhNZ2FYUWdkRzhnZEdGeVoyVjBMQ0J5WlhSMWNtNXpJSFJvWlNCdVpYY2dibTlrWlM1Y2JpQWdJQ0FnSUNBZ1puVnVZM1JwYjI0Z1lXUmtUbTlrWlZSdktHRmtaRlJoY21kbGRDd2dZMnhoYzNOT1lXMWxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjJZWElnWkdsMklEMGdjMk52Y0dWZlJHOWpkVzFsYm5RdVkzSmxZWFJsUld4bGJXVnVkQ2hjSW1ScGRsd2lLVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0dOc1lYTnpUbUZ0WlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHRmtaRU5zWVhOektHUnBkaXdnWTJ4aGMzTk9ZVzFsS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdZV1JrVkdGeVoyVjBMbUZ3Y0dWdVpFTm9hV3hrS0dScGRpazdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCa2FYWTdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBdkx5QkJjSEJsYm1RZ1lTQnZjbWxuYVc0Z2RHOGdkR2hsSUdKaGMyVmNiaUFnSUNBZ0lDQWdablZ1WTNScGIyNGdZV1JrVDNKcFoybHVLR0poYzJVc0lHaGhibVJzWlU1MWJXSmxjaWtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkbUZ5SUc5eWFXZHBiaUE5SUdGa1pFNXZaR1ZVYnloaVlYTmxMQ0J2Y0hScGIyNXpMbU56YzBOc1lYTnpaWE11YjNKcFoybHVLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIWmhjaUJvWVc1a2JHVWdQU0JoWkdST2IyUmxWRzhvYjNKcFoybHVMQ0J2Y0hScGIyNXpMbU56YzBOc1lYTnpaWE11YUdGdVpHeGxLVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdZV1JrVG05a1pWUnZLR2hoYm1Sc1pTd2diM0IwYVc5dWN5NWpjM05EYkdGemMyVnpMblJ2ZFdOb1FYSmxZU2s3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJR2hoYm1Sc1pTNXpaWFJCZEhSeWFXSjFkR1VvWENKa1lYUmhMV2hoYm1Sc1pWd2lMQ0JvWVc1a2JHVk9kVzFpWlhJcE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9iM0IwYVc5dWN5NXJaWGxpYjJGeVpGTjFjSEJ2Y25RcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQXZMeUJvZEhSd2N6b3ZMMlJsZG1Wc2IzQmxjaTV0YjNwcGJHeGhMbTl5Wnk5bGJpMVZVeTlrYjJOekwxZGxZaTlJVkUxTUwwZHNiMkpoYkY5aGRIUnlhV0oxZEdWekwzUmhZbWx1WkdWNFhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0x5OGdNQ0E5SUdadlkzVnpZV0pzWlNCaGJtUWdjbVZoWTJoaFlteGxYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhR0Z1Wkd4bExuTmxkRUYwZEhKcFluVjBaU2hjSW5SaFltbHVaR1Y0WENJc0lGd2lNRndpS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCb1lXNWtiR1V1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWhjSW10bGVXUnZkMjVjSWl3Z1puVnVZM1JwYjI0b1pYWmxiblFwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHVjJaVzUwUzJWNVpHOTNiaWhsZG1WdWRDd2dhR0Z1Wkd4bFRuVnRZbVZ5S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJQ0FnYUdGdVpHeGxMbk5sZEVGMGRISnBZblYwWlNoY0luSnZiR1ZjSWl3Z1hDSnpiR2xrWlhKY0lpazdYRzRnSUNBZ0lDQWdJQ0FnSUNCb1lXNWtiR1V1YzJWMFFYUjBjbWxpZFhSbEtGd2lZWEpwWVMxdmNtbGxiblJoZEdsdmJsd2lMQ0J2Y0hScGIyNXpMbTl5ZENBL0lGd2lkbVZ5ZEdsallXeGNJaUE2SUZ3aWFHOXlhWHB2Ym5SaGJGd2lLVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0doaGJtUnNaVTUxYldKbGNpQTlQVDBnTUNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHRmtaRU5zWVhOektHaGhibVJzWlN3Z2IzQjBhVzl1Y3k1amMzTkRiR0Z6YzJWekxtaGhibVJzWlV4dmQyVnlLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMGdaV3h6WlNCcFppQW9hR0Z1Wkd4bFRuVnRZbVZ5SUQwOVBTQnZjSFJwYjI1ekxtaGhibVJzWlhNZ0xTQXhLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWVdSa1EyeGhjM01vYUdGdVpHeGxMQ0J2Y0hScGIyNXpMbU56YzBOc1lYTnpaWE11YUdGdVpHeGxWWEJ3WlhJcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdiM0pwWjJsdU8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1NXNXpaWEowSUc1dlpHVnpJR1p2Y2lCamIyNXVaV04wSUdWc1pXMWxiblJ6WEc0Z0lDQWdJQ0FnSUdaMWJtTjBhVzl1SUdGa1pFTnZibTVsWTNRb1ltRnpaU3dnWVdSa0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9JV0ZrWkNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUdGa1pFNXZaR1ZVYnloaVlYTmxMQ0J2Y0hScGIyNXpMbU56YzBOc1lYTnpaWE11WTI5dWJtVmpkQ2s3WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQXZMeUJCWkdRZ2FHRnVaR3hsY3lCMGJ5QjBhR1VnYzJ4cFpHVnlJR0poYzJVdVhHNGdJQ0FnSUNBZ0lHWjFibU4wYVc5dUlHRmtaRVZzWlcxbGJuUnpLR052Ym01bFkzUlBjSFJwYjI1ekxDQmlZWE5sS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IyWVhJZ1kyOXVibVZqZEVKaGMyVWdQU0JoWkdST2IyUmxWRzhvWW1GelpTd2diM0IwYVc5dWN5NWpjM05EYkdGemMyVnpMbU52Ym01bFkzUnpLVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdjMk52Y0dWZlNHRnVaR3hsY3lBOUlGdGRPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2MyTnZjR1ZmUTI5dWJtVmpkSE1nUFNCYlhUdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ2MyTnZjR1ZmUTI5dWJtVmpkSE11Y0hWemFDaGhaR1JEYjI1dVpXTjBLR052Ym01bFkzUkNZWE5sTENCamIyNXVaV04wVDNCMGFXOXVjMXN3WFNrcE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QmJPam82T2s4OVBUMDlUejA5UFQxUFBUMDlQVjFjYmlBZ0lDQWdJQ0FnSUNBZ0lDOHZJR052Ym01bFkzUlBjSFJwYjI1eklEMGdXekFzSURFc0lERXNJREZkWEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJR1p2Y2lBb2RtRnlJR2tnUFNBd095QnBJRHdnYjNCMGFXOXVjeTVvWVc1a2JHVnpPeUJwS3lzcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQXZMeUJMWldWd0lHRWdiR2x6ZENCdlppQmhiR3dnWVdSa1pXUWdhR0Z1Wkd4bGN5NWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnpZMjl3WlY5SVlXNWtiR1Z6TG5CMWMyZ29ZV1JrVDNKcFoybHVLR0poYzJVc0lHa3BLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J6WTI5d1pWOUlZVzVrYkdWT2RXMWlaWEp6VzJsZElEMGdhVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J6WTI5d1pWOURiMjV1WldOMGN5NXdkWE5vS0dGa1pFTnZibTVsWTNRb1kyOXVibVZqZEVKaGMyVXNJR052Ym01bFkzUlBjSFJwYjI1elcya2dLeUF4WFNrcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdMeThnU1c1cGRHbGhiR2w2WlNCaElITnBibWRzWlNCemJHbGtaWEl1WEc0Z0lDQWdJQ0FnSUdaMWJtTjBhVzl1SUdGa1pGTnNhV1JsY2loaFpHUlVZWEpuWlhRcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklFRndjR3g1SUdOc1lYTnpaWE1nWVc1a0lHUmhkR0VnZEc4Z2RHaGxJSFJoY21kbGRDNWNiaUFnSUNBZ0lDQWdJQ0FnSUdGa1pFTnNZWE56S0dGa1pGUmhjbWRsZEN3Z2IzQjBhVzl1Y3k1amMzTkRiR0Z6YzJWekxuUmhjbWRsZENrN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaHZjSFJwYjI1ekxtUnBjaUE5UFQwZ01Da2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR0ZrWkVOc1lYTnpLR0ZrWkZSaGNtZGxkQ3dnYjNCMGFXOXVjeTVqYzNORGJHRnpjMlZ6TG14MGNpazdYRzRnSUNBZ0lDQWdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdGa1pFTnNZWE56S0dGa1pGUmhjbWRsZEN3Z2IzQjBhVzl1Y3k1amMzTkRiR0Z6YzJWekxuSjBiQ2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2h2Y0hScGIyNXpMbTl5ZENBOVBUMGdNQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdGa1pFTnNZWE56S0dGa1pGUmhjbWRsZEN3Z2IzQjBhVzl1Y3k1amMzTkRiR0Z6YzJWekxtaHZjbWw2YjI1MFlXd3BPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCaFpHUkRiR0Z6Y3loaFpHUlVZWEpuWlhRc0lHOXdkR2x2Ym5NdVkzTnpRMnhoYzNObGN5NTJaWEowYVdOaGJDazdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJoWkdST2IyUmxWRzhvWVdSa1ZHRnlaMlYwTENCdmNIUnBiMjV6TG1OemMwTnNZWE56WlhNdVltRnpaU2s3WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQm1kVzVqZEdsdmJpQmhaR1JVYjI5c2RHbHdLR2hoYm1Sc1pTd2dhR0Z1Wkd4bFRuVnRZbVZ5S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb0lXOXdkR2x2Ym5NdWRHOXZiSFJwY0hOYmFHRnVaR3hsVG5WdFltVnlYU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJR0ZrWkU1dlpHVlVieWhvWVc1a2JHVXVabWx5YzNSRGFHbHNaQ3dnYjNCMGFXOXVjeTVqYzNORGJHRnpjMlZ6TG5SdmIyeDBhWEFwTzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdMeThnUkdsellXSnNaU0IwYUdVZ2MyeHBaR1Z5SUdSeVlXZG5hVzVuSUdsbUlHRnVlU0JvWVc1a2JHVWdhWE1nWkdsellXSnNaV1JjYmlBZ0lDQWdJQ0FnWm5WdVkzUnBiMjRnYVhOSVlXNWtiR1ZFYVhOaFlteGxaQ2hvWVc1a2JHVk9kVzFpWlhJcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhaaGNpQm9ZVzVrYkdWUGNtbG5hVzRnUFNCelkyOXdaVjlJWVc1a2JHVnpXMmhoYm1Sc1pVNTFiV0psY2wwN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdhR0Z1Wkd4bFQzSnBaMmx1TG1oaGMwRjBkSEpwWW5WMFpTaGNJbVJwYzJGaWJHVmtYQ0lwTzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdablZ1WTNScGIyNGdjbVZ0YjNabFZHOXZiSFJwY0hNb0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9jMk52Y0dWZlZHOXZiSFJwY0hNcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnlaVzF2ZG1WRmRtVnVkQ2hjSW5Wd1pHRjBaUzUwYjI5c2RHbHdjMXdpS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCelkyOXdaVjlVYjI5c2RHbHdjeTVtYjNKRllXTm9LR1oxYm1OMGFXOXVLSFJ2YjJ4MGFYQXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLSFJ2YjJ4MGFYQXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEpsYlc5MlpVVnNaVzFsYm5Rb2RHOXZiSFJwY0NrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCelkyOXdaVjlVYjI5c2RHbHdjeUE5SUc1MWJHdzdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0F2THlCVWFHVWdkRzl2YkhScGNITWdiM0IwYVc5dUlHbHpJR0VnYzJodmNuUm9ZVzVrSUdadmNpQjFjMmx1WnlCMGFHVWdKM1Z3WkdGMFpTY2daWFpsYm5RdVhHNGdJQ0FnSUNBZ0lHWjFibU4wYVc5dUlIUnZiMngwYVhCektDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVnRiM1psVkc5dmJIUnBjSE1vS1R0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1ZHOXZiSFJwY0hNZ1lYSmxJR0ZrWkdWa0lIZHBkR2dnYjNCMGFXOXVjeTUwYjI5c2RHbHdjeUJwYmlCdmNtbG5hVzVoYkNCdmNtUmxjaTVjYmlBZ0lDQWdJQ0FnSUNBZ0lITmpiM0JsWDFSdmIyeDBhWEJ6SUQwZ2MyTnZjR1ZmU0dGdVpHeGxjeTV0WVhBb1lXUmtWRzl2YkhScGNDazdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lHSnBibVJGZG1WdWRDaGNJblZ3WkdGMFpTNTBiMjlzZEdsd2Mxd2lMQ0JtZFc1amRHbHZiaWgyWVd4MVpYTXNJR2hoYm1Sc1pVNTFiV0psY2l3Z2RXNWxibU52WkdWa0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhV1lnS0NGelkyOXdaVjlVYjI5c2RHbHdjMXRvWVc1a2JHVk9kVzFpWlhKZEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnlianRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMllYSWdabTl5YldGMGRHVmtWbUZzZFdVZ1BTQjJZV3gxWlhOYmFHRnVaR3hsVG5WdFltVnlYVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsbUlDaHZjSFJwYjI1ekxuUnZiMngwYVhCelcyaGhibVJzWlU1MWJXSmxjbDBnSVQwOUlIUnlkV1VwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdabTl5YldGMGRHVmtWbUZzZFdVZ1BTQnZjSFJwYjI1ekxuUnZiMngwYVhCelcyaGhibVJzWlU1MWJXSmxjbDB1ZEc4b2RXNWxibU52WkdWa1cyaGhibVJzWlU1MWJXSmxjbDBwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lITmpiM0JsWDFSdmIyeDBhWEJ6VzJoaGJtUnNaVTUxYldKbGNsMHVhVzV1WlhKSVZFMU1JRDBnWm05eWJXRjBkR1ZrVm1Gc2RXVTdYRzRnSUNBZ0lDQWdJQ0FnSUNCOUtUdGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUdaMWJtTjBhVzl1SUdGeWFXRW9LU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmlhVzVrUlhabGJuUW9YQ0oxY0dSaGRHVmNJaXdnWm5WdVkzUnBiMjRvZG1Gc2RXVnpMQ0JvWVc1a2JHVk9kVzFpWlhJc0lIVnVaVzVqYjJSbFpDd2dkR0Z3TENCd2IzTnBkR2x2Ym5NcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQXZMeUJWY0dSaGRHVWdRWEpwWVNCV1lXeDFaWE1nWm05eUlHRnNiQ0JvWVc1a2JHVnpMQ0JoY3lCaElHTm9ZVzVuWlNCcGJpQnZibVVnWTJoaGJtZGxjeUJ0YVc0Z1lXNWtJRzFoZUNCMllXeDFaWE1nWm05eUlIUm9aU0J1WlhoMExseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lITmpiM0JsWDBoaGJtUnNaVTUxYldKbGNuTXVabTl5UldGamFDaG1kVzVqZEdsdmJpaHBibVJsZUNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IyWVhJZ2FHRnVaR3hsSUQwZ2MyTnZjR1ZmU0dGdVpHeGxjMXRwYm1SbGVGMDdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RtRnlJRzFwYmlBOUlHTm9aV05yU0dGdVpHeGxVRzl6YVhScGIyNG9jMk52Y0dWZlRHOWpZWFJwYjI1ekxDQnBibVJsZUN3Z01Dd2dkSEoxWlN3Z2RISjFaU3dnZEhKMVpTazdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhaaGNpQnRZWGdnUFNCamFHVmphMGhoYm1Sc1pWQnZjMmwwYVc5dUtITmpiM0JsWDB4dlkyRjBhVzl1Y3l3Z2FXNWtaWGdzSURFd01Dd2dkSEoxWlN3Z2RISjFaU3dnZEhKMVpTazdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RtRnlJRzV2ZHlBOUlIQnZjMmwwYVc5dWMxdHBibVJsZUYwN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1JtOXliV0YwZEdWa0lIWmhiSFZsSUdadmNpQmthWE53YkdGNVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCMFpYaDBJRDBnYjNCMGFXOXVjeTVoY21saFJtOXliV0YwTG5SdktIVnVaVzVqYjJSbFpGdHBibVJsZUYwcE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM4dklFMWhjQ0IwYnlCemJHbGtaWElnY21GdVoyVWdkbUZzZFdWelhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRzFwYmlBOUlITmpiM0JsWDFOd1pXTjBjblZ0TG1aeWIyMVRkR1Z3Y0dsdVp5aHRhVzRwTG5SdlJtbDRaV1FvTVNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRzFoZUNBOUlITmpiM0JsWDFOd1pXTjBjblZ0TG1aeWIyMVRkR1Z3Y0dsdVp5aHRZWGdwTG5SdlJtbDRaV1FvTVNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRzV2ZHlBOUlITmpiM0JsWDFOd1pXTjBjblZ0TG1aeWIyMVRkR1Z3Y0dsdVp5aHViM2NwTG5SdlJtbDRaV1FvTVNrN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYUdGdVpHeGxMbU5vYVd4a2NtVnVXekJkTG5ObGRFRjBkSEpwWW5WMFpTaGNJbUZ5YVdFdGRtRnNkV1Z0YVc1Y0lpd2diV2x1S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhR0Z1Wkd4bExtTm9hV3hrY21WdVd6QmRMbk5sZEVGMGRISnBZblYwWlNoY0ltRnlhV0V0ZG1Gc2RXVnRZWGhjSWl3Z2JXRjRLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FHRnVaR3hsTG1Ob2FXeGtjbVZ1V3pCZExuTmxkRUYwZEhKcFluVjBaU2hjSW1GeWFXRXRkbUZzZFdWdWIzZGNJaXdnYm05M0tUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYUdGdVpHeGxMbU5vYVd4a2NtVnVXekJkTG5ObGRFRjBkSEpwWW5WMFpTaGNJbUZ5YVdFdGRtRnNkV1YwWlhoMFhDSXNJSFJsZUhRcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMHBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCbWRXNWpkR2x2YmlCblpYUkhjbTkxY0NodGIyUmxMQ0IyWVd4MVpYTXNJSE4wWlhCd1pXUXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDOHZJRlZ6WlNCMGFHVWdjbUZ1WjJVdVhHNGdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb2JXOWtaU0E5UFQwZ1hDSnlZVzVuWlZ3aUlIeDhJRzF2WkdVZ1BUMDlJRndpYzNSbGNITmNJaWtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJ6WTI5d1pWOVRjR1ZqZEhKMWJTNTRWbUZzTzF4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvYlc5a1pTQTlQVDBnWENKamIzVnVkRndpS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLSFpoYkhWbGN5QThJRElwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtGd2libTlWYVZOc2FXUmxjaUFvWENJZ0t5QldSVkpUU1U5T0lDc2dYQ0lwT2lBbmRtRnNkV1Z6SnlBb1BqMGdNaWtnY21WeGRXbHlaV1FnWm05eUlHMXZaR1VnSjJOdmRXNTBKeTVjSWlrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMeThnUkdsMmFXUmxJREFnTFNBeE1EQWdhVzRnSjJOdmRXNTBKeUJ3WVhKMGN5NWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjJZWElnYVc1MFpYSjJZV3dnUFNCMllXeDFaWE1nTFNBeE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIWmhjaUJ6Y0hKbFlXUWdQU0F4TURBZ0x5QnBiblJsY25aaGJEdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFpoYkhWbGN5QTlJRnRkTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0x5OGdUR2x6ZENCMGFHVnpaU0J3WVhKMGN5QmhibVFnYUdGMlpTQjBhR1Z0SUdoaGJtUnNaV1FnWVhNZ0ozQnZjMmwwYVc5dWN5Y3VYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkMmhwYkdVZ0tHbHVkR1Z5ZG1Gc0xTMHBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RtRnNkV1Z6VzJsdWRHVnlkbUZzWFNBOUlHbHVkR1Z5ZG1Gc0lDb2djM0J5WldGa08xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFpoYkhWbGN5NXdkWE5vS0RFd01DazdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J0YjJSbElEMGdYQ0p3YjNOcGRHbHZibk5jSWp0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0cxdlpHVWdQVDA5SUZ3aWNHOXphWFJwYjI1elhDSXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlCTllYQWdZV3hzSUhCbGNtTmxiblJoWjJWeklIUnZJRzl1TFhKaGJtZGxJSFpoYkhWbGN5NWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2RtRnNkV1Z6TG0xaGNDaG1kVzVqZEdsdmJpaDJZV3gxWlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdjMk52Y0dWZlUzQmxZM1J5ZFcwdVpuSnZiVk4wWlhCd2FXNW5LSE4wWlhCd1pXUWdQeUJ6WTI5d1pWOVRjR1ZqZEhKMWJTNW5aWFJUZEdWd0tIWmhiSFZsS1NBNklIWmhiSFZsS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHMXZaR1VnUFQwOUlGd2lkbUZzZFdWelhDSXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlCSlppQjBhR1VnZG1Gc2RXVWdiWFZ6ZENCaVpTQnpkR1Z3Y0dWa0xDQnBkQ0J1WldWa2N5QjBieUJpWlNCamIyNTJaWEowWldRZ2RHOGdZU0J3WlhKalpXNTBZV2RsSUdacGNuTjBMbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR2xtSUNoemRHVndjR1ZrS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQjJZV3gxWlhNdWJXRndLR1oxYm1OMGFXOXVLSFpoYkhWbEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQXZMeUJEYjI1MlpYSjBJSFJ2SUhCbGNtTmxiblJoWjJVc0lHRndjR3g1SUhOMFpYQXNJSEpsZEhWeWJpQjBieUIyWVd4MVpTNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCelkyOXdaVjlUY0dWamRISjFiUzVtY205dFUzUmxjSEJwYm1jb2MyTnZjR1ZmVTNCbFkzUnlkVzB1WjJWMFUzUmxjQ2h6WTI5d1pWOVRjR1ZqZEhKMWJTNTBiMU4wWlhCd2FXNW5LSFpoYkhWbEtTa3BPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlCUGRHaGxjbmRwYzJVc0lIZGxJR05oYmlCemFXMXdiSGtnZFhObElIUm9aU0IyWVd4MVpYTXVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlIWmhiSFZsY3p0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lHWjFibU4wYVc5dUlHZGxibVZ5WVhSbFUzQnlaV0ZrS0dSbGJuTnBkSGtzSUcxdlpHVXNJR2R5YjNWd0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCbWRXNWpkR2x2YmlCellXWmxTVzVqY21WdFpXNTBLSFpoYkhWbExDQnBibU55WlcxbGJuUXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlCQmRtOXBaQ0JtYkc5aGRHbHVaeUJ3YjJsdWRDQjJZWEpwWVc1alpTQmllU0JrY205d2NHbHVaeUIwYUdVZ2MyMWhiR3hsYzNRZ1pHVmphVzFoYkNCd2JHRmpaWE11WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJQ2gyWVd4MVpTQXJJR2x1WTNKbGJXVnVkQ2t1ZEc5R2FYaGxaQ2czS1NBdklERTdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0FnSUhaaGNpQnBibVJsZUdWeklEMGdlMzA3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjJZWElnWm1seWMzUkpibEpoYm1kbElEMGdjMk52Y0dWZlUzQmxZM1J5ZFcwdWVGWmhiRnN3WFR0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCc1lYTjBTVzVTWVc1blpTQTlJSE5qYjNCbFgxTndaV04wY25WdExuaFdZV3hiYzJOdmNHVmZVM0JsWTNSeWRXMHVlRlpoYkM1c1pXNW5kR2dnTFNBeFhUdGNiaUFnSUNBZ0lDQWdJQ0FnSUhaaGNpQnBaMjV2Y21WR2FYSnpkQ0E5SUdaaGJITmxPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RtRnlJR2xuYm05eVpVeGhjM1FnUFNCbVlXeHpaVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIWmhjaUJ3Y21WMlVHTjBJRDBnTUR0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1EzSmxZWFJsSUdFZ1kyOXdlU0J2WmlCMGFHVWdaM0p2ZFhBc0lITnZjblFnYVhRZ1lXNWtJR1pwYkhSbGNpQmhkMkY1SUdGc2JDQmtkWEJzYVdOaGRHVnpMbHh1SUNBZ0lDQWdJQ0FnSUNBZ1ozSnZkWEFnUFNCMWJtbHhkV1VvWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWjNKdmRYQXVjMnhwWTJVb0tTNXpiM0owS0daMWJtTjBhVzl1S0dFc0lHSXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUdFZ0xTQmlPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDBwWEc0Z0lDQWdJQ0FnSUNBZ0lDQXBPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQXZMeUJOWVd0bElITjFjbVVnZEdobElISmhibWRsSUhOMFlYSjBjeUIzYVhSb0lIUm9aU0JtYVhKemRDQmxiR1Z0Wlc1MExseHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHZHliM1Z3V3pCZElDRTlQU0JtYVhKemRFbHVVbUZ1WjJVcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQm5jbTkxY0M1MWJuTm9hV1owS0dacGNuTjBTVzVTWVc1blpTazdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhV2R1YjNKbFJtbHljM1FnUFNCMGNuVmxPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5Qk1hV3RsZDJselpTQm1iM0lnZEdobElHeGhjM1FnYjI1bExseHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHZHliM1Z3VzJkeWIzVndMbXhsYm1kMGFDQXRJREZkSUNFOVBTQnNZWE4wU1c1U1lXNW5aU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdkeWIzVndMbkIxYzJnb2JHRnpkRWx1VW1GdVoyVXBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR2xuYm05eVpVeGhjM1FnUFNCMGNuVmxPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnSUNCbmNtOTFjQzVtYjNKRllXTm9LR1oxYm1OMGFXOXVLR04xY25KbGJuUXNJR2x1WkdWNEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMeThnUjJWMElIUm9aU0JqZFhKeVpXNTBJSE4wWlhBZ1lXNWtJSFJvWlNCc2IzZGxjaUFySUhWd2NHVnlJSEJ2YzJsMGFXOXVjeTVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IyWVhJZ2MzUmxjRHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IyWVhJZ2FUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjJZWElnY1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMllYSWdiRzkzSUQwZ1kzVnljbVZ1ZER0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMllYSWdhR2xuYUNBOUlHZHliM1Z3VzJsdVpHVjRJQ3NnTVYwN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RtRnlJRzVsZDFCamREdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjJZWElnY0dOMFJHbG1abVZ5Wlc1alpUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjJZWElnY0dOMFVHOXpPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCMGVYQmxPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCemRHVndjenRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IyWVhJZ2NtVmhiRk4wWlhCek8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIWmhjaUJ6ZEdWd1UybDZaVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IyWVhJZ2FYTlRkR1Z3Y3lBOUlHMXZaR1VnUFQwOUlGd2ljM1JsY0hOY0lqdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQzh2SUZkb1pXNGdkWE5wYm1jZ0ozTjBaWEJ6SnlCdGIyUmxMQ0IxYzJVZ2RHaGxJSEJ5YjNacFpHVmtJSE4wWlhCekxseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDOHZJRTkwYUdWeWQybHpaU3dnZDJVbmJHd2djM1JsY0NCdmJpQjBieUIwYUdVZ2JtVjRkQ0J6ZFdKeVlXNW5aUzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb2FYTlRkR1Z3Y3lrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J6ZEdWd0lEMGdjMk52Y0dWZlUzQmxZM1J5ZFcwdWVFNTFiVk4wWlhCelcybHVaR1Y0WFR0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQXZMeUJFWldaaGRXeDBJSFJ2SUdFZ0oyWjFiR3duSUhOMFpYQXVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhV1lnS0NGemRHVndLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lITjBaWEFnUFNCb2FXZG9JQzBnYkc5M08xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQzh2SUV4dmR5QmpZVzRnWW1VZ01Dd2djMjhnZEdWemRDQm1iM0lnWm1Gc2MyVXVJRWxtSUdocFoyZ2dhWE1nZFc1a1pXWnBibVZrTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM4dklIZGxJR0Z5WlNCaGRDQjBhR1VnYkdGemRDQnpkV0p5WVc1blpTNGdTVzVrWlhnZ01DQnBjeUJoYkhKbFlXUjVJR2hoYm1Sc1pXUXVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhV1lnS0d4dmR5QTlQVDBnWm1Gc2MyVWdmSHdnYUdsbmFDQTlQVDBnZFc1a1pXWnBibVZrS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJqdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlCTllXdGxJSE4xY21VZ2MzUmxjQ0JwYzI0bmRDQXdMQ0IzYUdsamFDQjNiM1ZzWkNCallYVnpaU0JoYmlCcGJtWnBibWwwWlNCc2IyOXdJQ2dqTmpVMEtWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lITjBaWEFnUFNCTllYUm9MbTFoZUNoemRHVndMQ0F3TGpBd01EQXdNREVwTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0x5OGdSbWx1WkNCaGJHd2djM1JsY0hNZ2FXNGdkR2hsSUhOMVluSmhibWRsTGx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdadmNpQW9hU0E5SUd4dmR6c2dhU0E4UFNCb2FXZG9PeUJwSUQwZ2MyRm1aVWx1WTNKbGJXVnVkQ2hwTENCemRHVndLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQXZMeUJIWlhRZ2RHaGxJSEJsY21ObGJuUmhaMlVnZG1Gc2RXVWdabTl5SUhSb1pTQmpkWEp5Wlc1MElITjBaWEFzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDOHZJR05oYkdOMWJHRjBaU0IwYUdVZ2MybDZaU0JtYjNJZ2RHaGxJSE4xWW5KaGJtZGxMbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCdVpYZFFZM1FnUFNCelkyOXdaVjlUY0dWamRISjFiUzUwYjFOMFpYQndhVzVuS0drcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J3WTNSRWFXWm1aWEpsYm1ObElEMGdibVYzVUdOMElDMGdjSEpsZGxCamREdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCemRHVndjeUE5SUhCamRFUnBabVpsY21WdVkyVWdMeUJrWlc1emFYUjVPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCeVpXRnNVM1JsY0hNZ1BTQk5ZWFJvTG5KdmRXNWtLSE4wWlhCektUdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBdkx5QlVhR2x6SUhKaGRHbHZJSEpsY0hKbGMyVnVkSE1nZEdobElHRnRiM1Z1ZENCdlppQndaWEpqWlc1MFlXZGxMWE53WVdObElHRWdjRzlwYm5RZ2FXNWthV05oZEdWekxseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlCR2IzSWdZU0JrWlc1emFYUjVJREVnZEdobElIQnZhVzUwY3k5d1pYSmpaVzUwWVdkbElEMGdNUzRnUm05eUlHUmxibk5wZEhrZ01pd2dkR2hoZENCd1pYSmpaVzUwWVdkbElHNWxaV1J6SUhSdklHSmxJSEpsTFdScGRtbGtaV1F1WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDOHZJRkp2ZFc1a0lIUm9aU0J3WlhKalpXNTBZV2RsSUc5bVpuTmxkQ0IwYnlCaGJpQmxkbVZ1SUc1MWJXSmxjaXdnZEdobGJpQmthWFpwWkdVZ1lua2dkSGR2WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDOHZJSFJ2SUhOd2NtVmhaQ0IwYUdVZ2IyWm1jMlYwSUc5dUlHSnZkR2dnYzJsa1pYTWdiMllnZEdobElISmhibWRsTGx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnpkR1Z3VTJsNlpTQTlJSEJqZEVScFptWmxjbVZ1WTJVZ0x5QnlaV0ZzVTNSbGNITTdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0x5OGdSR2wyYVdSbElHRnNiQ0J3YjJsdWRITWdaWFpsYm14NUxDQmhaR1JwYm1jZ2RHaGxJR052Y25KbFkzUWdiblZ0WW1WeUlIUnZJSFJvYVhNZ2MzVmljbUZ1WjJVdVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQzh2SUZKMWJpQjFjQ0IwYnlBOFBTQnpieUIwYUdGMElERXdNQ1VnWjJWMGN5QmhJSEJ2YVc1MExDQmxkbVZ1ZENCcFppQnBaMjV2Y21WTVlYTjBJR2x6SUhObGRDNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWm05eUlDaHhJRDBnTVRzZ2NTQThQU0J5WldGc1UzUmxjSE03SUhFZ0t6MGdNU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1ZHaGxJSEpoZEdsdklHSmxkSGRsWlc0Z2RHaGxJSEp2ZFc1a1pXUWdkbUZzZFdVZ1lXNWtJSFJvWlNCaFkzUjFZV3dnYzJsNlpTQnRhV2RvZENCaVpTQitNU1VnYjJabUxseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0x5OGdRMjl5Y21WamRDQjBhR1VnY0dWeVkyVnVkR0ZuWlNCdlptWnpaWFFnWW5rZ2RHaGxJRzUxYldKbGNpQnZaaUJ3YjJsdWRITmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDOHZJSEJsY2lCemRXSnlZVzVuWlM0Z1pHVnVjMmwwZVNBOUlERWdkMmxzYkNCeVpYTjFiSFFnYVc0Z01UQXdJSEJ2YVc1MGN5QnZiaUIwYUdWY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM4dklHWjFiR3dnY21GdVoyVXNJRElnWm05eUlEVXdMQ0EwSUdadmNpQXlOU3dnWlhSakxseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2NHTjBVRzl6SUQwZ2NISmxkbEJqZENBcklIRWdLaUJ6ZEdWd1UybDZaVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR2x1WkdWNFpYTmJjR04wVUc5ekxuUnZSbWw0WldRb05TbGRJRDBnVzNOamIzQmxYMU53WldOMGNuVnRMbVp5YjIxVGRHVndjR2x1Wnlod1kzUlFiM01wTENBd1hUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQzh2SUVSbGRHVnliV2x1WlNCMGFHVWdjRzlwYm5RZ2RIbHdaUzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RIbHdaU0E5SUdkeWIzVndMbWx1WkdWNFQyWW9hU2tnUGlBdE1TQS9JRkJKVUZOZlRFRlNSMFZmVmtGTVZVVWdPaUJwYzFOMFpYQnpJRDhnVUVsUVUxOVRUVUZNVEY5V1FVeFZSU0E2SUZCSlVGTmZUazlmVmtGTVZVVTdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0x5OGdSVzVtYjNKalpTQjBhR1VnSjJsbmJtOXlaVVpwY25OMEp5QnZjSFJwYjI0Z1lua2diM1psY25keWFYUnBibWNnZEdobElIUjVjR1VnWm05eUlEQXVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsbUlDZ2hhVzVrWlhnZ0ppWWdhV2R1YjNKbFJtbHljM1FwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhSNWNHVWdQU0F3TzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLQ0VvYVNBOVBUMGdhR2xuYUNBbUppQnBaMjV2Y21WTVlYTjBLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1RXRnlheUIwYUdVZ0ozUjVjR1VuSUc5bUlIUm9hWE1nY0c5cGJuUXVJREFnUFNCd2JHRnBiaXdnTVNBOUlISmxZV3dnZG1Gc2RXVXNJRElnUFNCemRHVndJSFpoYkhWbExseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXNWtaWGhsYzF0dVpYZFFZM1F1ZEc5R2FYaGxaQ2cxS1YwZ1BTQmJhU3dnZEhsd1pWMDdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlCVmNHUmhkR1VnZEdobElIQmxjbU5sYm5SaFoyVWdZMjkxYm5RdVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEJ5WlhaUVkzUWdQU0J1WlhkUVkzUTdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTazdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCcGJtUmxlR1Z6TzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdablZ1WTNScGIyNGdZV1JrVFdGeWEybHVaeWh6Y0hKbFlXUXNJR1pwYkhSbGNrWjFibU1zSUdadmNtMWhkSFJsY2lrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZG1GeUlHVnNaVzFsYm5RZ1BTQnpZMjl3WlY5RWIyTjFiV1Z1ZEM1amNtVmhkR1ZGYkdWdFpXNTBLRndpWkdsMlhDSXBPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQjJZWElnZG1Gc2RXVlRhWHBsUTJ4aGMzTmxjeUE5SUZ0ZE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZG1Gc2RXVlRhWHBsUTJ4aGMzTmxjMXRRU1ZCVFgwNVBYMVpCVEZWRlhTQTlJRzl3ZEdsdmJuTXVZM056UTJ4aGMzTmxjeTUyWVd4MVpVNXZjbTFoYkR0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFpoYkhWbFUybDZaVU5zWVhOelpYTmJVRWxRVTE5TVFWSkhSVjlXUVV4VlJWMGdQU0J2Y0hScGIyNXpMbU56YzBOc1lYTnpaWE11ZG1Gc2RXVk1ZWEpuWlR0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFpoYkhWbFUybDZaVU5zWVhOelpYTmJVRWxRVTE5VFRVRk1URjlXUVV4VlJWMGdQU0J2Y0hScGIyNXpMbU56YzBOc1lYTnpaWE11ZG1Gc2RXVlRkV0k3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCdFlYSnJaWEpUYVhwbFEyeGhjM05sY3lBOUlGdGRPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2JXRnlhMlZ5VTJsNlpVTnNZWE56WlhOYlVFbFFVMTlPVDE5V1FVeFZSVjBnUFNCdmNIUnBiMjV6TG1OemMwTnNZWE56WlhNdWJXRnlhMlZ5VG05eWJXRnNPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2JXRnlhMlZ5VTJsNlpVTnNZWE56WlhOYlVFbFFVMTlNUVZKSFJWOVdRVXhWUlYwZ1BTQnZjSFJwYjI1ekxtTnpjME5zWVhOelpYTXViV0Z5YTJWeVRHRnlaMlU3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnRZWEpyWlhKVGFYcGxRMnhoYzNObGMxdFFTVkJUWDFOTlFVeE1YMVpCVEZWRlhTQTlJRzl3ZEdsdmJuTXVZM056UTJ4aGMzTmxjeTV0WVhKclpYSlRkV0k3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCMllXeDFaVTl5YVdWdWRHRjBhVzl1UTJ4aGMzTmxjeUE5SUZ0dmNIUnBiMjV6TG1OemMwTnNZWE56WlhNdWRtRnNkV1ZJYjNKcGVtOXVkR0ZzTENCdmNIUnBiMjV6TG1OemMwTnNZWE56WlhNdWRtRnNkV1ZXWlhKMGFXTmhiRjA3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjJZWElnYldGeWEyVnlUM0pwWlc1MFlYUnBiMjVEYkdGemMyVnpJRDBnVzI5d2RHbHZibk11WTNOelEyeGhjM05sY3k1dFlYSnJaWEpJYjNKcGVtOXVkR0ZzTENCdmNIUnBiMjV6TG1OemMwTnNZWE56WlhNdWJXRnlhMlZ5Vm1WeWRHbGpZV3hkTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0JoWkdSRGJHRnpjeWhsYkdWdFpXNTBMQ0J2Y0hScGIyNXpMbU56YzBOc1lYTnpaWE11Y0dsd2N5azdYRzRnSUNBZ0lDQWdJQ0FnSUNCaFpHUkRiR0Z6Y3lobGJHVnRaVzUwTENCdmNIUnBiMjV6TG05eWRDQTlQVDBnTUNBL0lHOXdkR2x2Ym5NdVkzTnpRMnhoYzNObGN5NXdhWEJ6U0c5eWFYcHZiblJoYkNBNklHOXdkR2x2Ym5NdVkzTnpRMnhoYzNObGN5NXdhWEJ6Vm1WeWRHbGpZV3dwTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0JtZFc1amRHbHZiaUJuWlhSRGJHRnpjMlZ6S0hSNWNHVXNJSE52ZFhKalpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCaElEMGdjMjkxY21ObElEMDlQU0J2Y0hScGIyNXpMbU56YzBOc1lYTnpaWE11ZG1Gc2RXVTdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkbUZ5SUc5eWFXVnVkR0YwYVc5dVEyeGhjM05sY3lBOUlHRWdQeUIyWVd4MVpVOXlhV1Z1ZEdGMGFXOXVRMnhoYzNObGN5QTZJRzFoY210bGNrOXlhV1Z1ZEdGMGFXOXVRMnhoYzNObGN6dGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjJZWElnYzJsNlpVTnNZWE56WlhNZ1BTQmhJRDhnZG1Gc2RXVlRhWHBsUTJ4aGMzTmxjeUE2SUcxaGNtdGxjbE5wZW1WRGJHRnpjMlZ6TzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUhOdmRYSmpaU0FySUZ3aUlGd2lJQ3NnYjNKcFpXNTBZWFJwYjI1RGJHRnpjMlZ6VzI5d2RHbHZibk11YjNKMFhTQXJJRndpSUZ3aUlDc2djMmw2WlVOc1lYTnpaWE5iZEhsd1pWMDdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0FnSUdaMWJtTjBhVzl1SUdGa1pGTndjbVZoWkNodlptWnpaWFFzSUhaaGJIVmxMQ0IwZVhCbEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMeThnUVhCd2JIa2dkR2hsSUdacGJIUmxjaUJtZFc1amRHbHZiaXdnYVdZZ2FYUWdhWE1nYzJWMExseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIUjVjR1VnUFNCbWFXeDBaWEpHZFc1aklEOGdabWxzZEdWeVJuVnVZeWgyWVd4MVpTd2dkSGx3WlNrZ09pQjBlWEJsTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLSFI1Y0dVZ1BUMDlJRkJKVUZOZlRrOU9SU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200N1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMeThnUVdSa0lHRWdiV0Z5YTJWeUlHWnZjaUJsZG1WeWVTQndiMmx1ZEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhaaGNpQnViMlJsSUQwZ1lXUmtUbTlrWlZSdktHVnNaVzFsYm5Rc0lHWmhiSE5sS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCdWIyUmxMbU5zWVhOelRtRnRaU0E5SUdkbGRFTnNZWE56WlhNb2RIbHdaU3dnYjNCMGFXOXVjeTVqYzNORGJHRnpjMlZ6TG0xaGNtdGxjaWs3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYm05a1pTNXpkSGxzWlZ0dmNIUnBiMjV6TG5OMGVXeGxYU0E5SUc5bVpuTmxkQ0FySUZ3aUpWd2lPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1ZtRnNkV1Z6SUdGeVpTQnZibXg1SUdGd2NHVnVaR1ZrSUdadmNpQndiMmx1ZEhNZ2JXRnlhMlZrSUNjeEp5QnZjaUFuTWljdVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLSFI1Y0dVZ1BpQlFTVkJUWDA1UFgxWkJURlZGS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRzV2WkdVZ1BTQmhaR1JPYjJSbFZHOG9aV3hsYldWdWRDd2dabUZzYzJVcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J1YjJSbExtTnNZWE56VG1GdFpTQTlJR2RsZEVOc1lYTnpaWE1vZEhsd1pTd2diM0IwYVc5dWN5NWpjM05EYkdGemMyVnpMblpoYkhWbEtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYm05a1pTNXpaWFJCZEhSeWFXSjFkR1VvWENKa1lYUmhMWFpoYkhWbFhDSXNJSFpoYkhWbEtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYm05a1pTNXpkSGxzWlZ0dmNIUnBiMjV6TG5OMGVXeGxYU0E5SUc5bVpuTmxkQ0FySUZ3aUpWd2lPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCdWIyUmxMbWx1Ym1WeVNGUk5UQ0E5SUdadmNtMWhkSFJsY2k1MGJ5aDJZV3gxWlNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0F2THlCQmNIQmxibVFnWVd4c0lIQnZhVzUwY3k1Y2JpQWdJQ0FnSUNBZ0lDQWdJRTlpYW1WamRDNXJaWGx6S0hOd2NtVmhaQ2t1Wm05eVJXRmphQ2htZFc1amRHbHZiaWh2Wm1aelpYUXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JoWkdSVGNISmxZV1FvYjJabWMyVjBMQ0J6Y0hKbFlXUmJiMlptYzJWMFhWc3dYU3dnYzNCeVpXRmtXMjltWm5ObGRGMWJNVjBwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdmU2s3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQmxiR1Z0Wlc1ME8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnWm5WdVkzUnBiMjRnY21WdGIzWmxVR2x3Y3lncElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaHpZMjl3WlY5UWFYQnpLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WdGIzWmxSV3hsYldWdWRDaHpZMjl3WlY5UWFYQnpLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J6WTI5d1pWOVFhWEJ6SUQwZ2JuVnNiRHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUdaMWJtTjBhVzl1SUhCcGNITW9aM0pwWkNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1JtbDRJQ00yTmpsY2JpQWdJQ0FnSUNBZ0lDQWdJSEpsYlc5MlpWQnBjSE1vS1R0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnZG1GeUlHMXZaR1VnUFNCbmNtbGtMbTF2WkdVN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IyWVhJZ1pHVnVjMmwwZVNBOUlHZHlhV1F1WkdWdWMybDBlU0I4ZkNBeE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZG1GeUlHWnBiSFJsY2lBOUlHZHlhV1F1Wm1sc2RHVnlJSHg4SUdaaGJITmxPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RtRnlJSFpoYkhWbGN5QTlJR2R5YVdRdWRtRnNkV1Z6SUh4OElHWmhiSE5sTzF4dUlDQWdJQ0FnSUNBZ0lDQWdkbUZ5SUhOMFpYQndaV1FnUFNCbmNtbGtMbk4wWlhCd1pXUWdmSHdnWm1Gc2MyVTdYRzRnSUNBZ0lDQWdJQ0FnSUNCMllYSWdaM0p2ZFhBZ1BTQm5aWFJIY205MWNDaHRiMlJsTENCMllXeDFaWE1zSUhOMFpYQndaV1FwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdkbUZ5SUhOd2NtVmhaQ0E5SUdkbGJtVnlZWFJsVTNCeVpXRmtLR1JsYm5OcGRIa3NJRzF2WkdVc0lHZHliM1Z3S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCbWIzSnRZWFFnUFNCbmNtbGtMbVp2Y20xaGRDQjhmQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZEc4NklFMWhkR2d1Y205MWJtUmNiaUFnSUNBZ0lDQWdJQ0FnSUgwN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUhOamIzQmxYMUJwY0hNZ1BTQnpZMjl3WlY5VVlYSm5aWFF1WVhCd1pXNWtRMmhwYkdRb1lXUmtUV0Z5YTJsdVp5aHpjSEpsWVdRc0lHWnBiSFJsY2l3Z1ptOXliV0YwS1NrN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJ6WTI5d1pWOVFhWEJ6TzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdMeThnVTJodmNuUm9ZVzVrSUdadmNpQmlZWE5sSUdScGJXVnVjMmx2Ym5NdVhHNGdJQ0FnSUNBZ0lHWjFibU4wYVc5dUlHSmhjMlZUYVhwbEtDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RtRnlJSEpsWTNRZ1BTQnpZMjl3WlY5Q1lYTmxMbWRsZEVKdmRXNWthVzVuUTJ4cFpXNTBVbVZqZENncE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZG1GeUlHRnNkQ0E5SUZ3aWIyWm1jMlYwWENJZ0t5QmJYQ0pYYVdSMGFGd2lMQ0JjSWtobGFXZG9kRndpWFZ0dmNIUnBiMjV6TG05eWRGMDdYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnYjNCMGFXOXVjeTV2Y25RZ1BUMDlJREFnUHlCeVpXTjBMbmRwWkhSb0lIeDhJSE5qYjNCbFgwSmhjMlZiWVd4MFhTQTZJSEpsWTNRdWFHVnBaMmgwSUh4OElITmpiM0JsWDBKaGMyVmJZV3gwWFR0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQzh2SUVoaGJtUnNaWElnWm05eUlHRjBkR0ZqYUdsdVp5QmxkbVZ1ZEhNZ2RISnZkV2RvSUdFZ2NISnZlSGt1WEc0Z0lDQWdJQ0FnSUdaMWJtTjBhVzl1SUdGMGRHRmphRVYyWlc1MEtHVjJaVzUwY3l3Z1pXeGxiV1Z1ZEN3Z1kyRnNiR0poWTJzc0lHUmhkR0VwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SUZSb2FYTWdablZ1WTNScGIyNGdZMkZ1SUdKbElIVnpaV1FnZEc4Z0oyWnBiSFJsY2ljZ1pYWmxiblJ6SUhSdklIUm9aU0J6Ykdsa1pYSXVYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QmxiR1Z0Wlc1MElHbHpJR0VnYm05a1pTd2dibTkwSUdFZ2JtOWtaVXhwYzNSY2JseHVJQ0FnSUNBZ0lDQWdJQ0FnZG1GeUlHMWxkR2h2WkNBOUlHWjFibU4wYVc5dUtHVXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JsSUQwZ1ptbDRSWFpsYm5Rb1pTd2daR0YwWVM1d1lXZGxUMlptYzJWMExDQmtZWFJoTG5SaGNtZGxkQ0I4ZkNCbGJHVnRaVzUwS1R0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDOHZJR1pwZUVWMlpXNTBJSEpsZEhWeWJuTWdabUZzYzJVZ2FXWWdkR2hwY3lCbGRtVnVkQ0JvWVhNZ1lTQmthV1ptWlhKbGJuUWdkR0Z5WjJWMFhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0x5OGdkMmhsYmlCb1lXNWtiR2x1WnlBb2JYVnNkR2t0S1NCMGIzVmphQ0JsZG1WdWRITTdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhV1lnS0NGbEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlCa2IwNXZkRkpsYW1WamRDQnBjeUJ3WVhOelpXUWdZbmtnWVd4c0lHVnVaQ0JsZG1WdWRITWdkRzhnYldGclpTQnpkWEpsSUhKbGJHVmhjMlZrSUhSdmRXTm9aWE5jYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlCaGNtVWdibTkwSUhKbGFtVmpkR1ZrTENCc1pXRjJhVzVuSUhSb1pTQnpiR2xrWlhJZ1hDSnpkSFZqYTF3aUlIUnZJSFJvWlNCamRYSnpiM0k3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tITmpiM0JsWDFSaGNtZGxkQzVvWVhOQmRIUnlhV0oxZEdVb1hDSmthWE5oWW14bFpGd2lLU0FtSmlBaFpHRjBZUzVrYjA1dmRGSmxhbVZqZENrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMeThnVTNSdmNDQnBaaUJoYmlCaFkzUnBkbVVnSjNSaGNDY2dkSEpoYm5OcGRHbHZiaUJwY3lCMFlXdHBibWNnY0d4aFkyVXVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhV1lnS0doaGMwTnNZWE56S0hOamIzQmxYMVJoY21kbGRDd2diM0IwYVc5dWN5NWpjM05EYkdGemMyVnpMblJoY0NrZ0ppWWdJV1JoZEdFdVpHOU9iM1JTWldwbFkzUXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM4dklFbG5ibTl5WlNCeWFXZG9kQ0J2Y2lCdGFXUmtiR1VnWTJ4cFkydHpJRzl1SUhOMFlYSjBJQ00wTlRSY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcFppQW9aWFpsYm5SeklEMDlQU0JoWTNScGIyNXpMbk4wWVhKMElDWW1JR1V1WW5WMGRHOXVjeUFoUFQwZ2RXNWtaV1pwYm1Wa0lDWW1JR1V1WW5WMGRHOXVjeUErSURFcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJR1poYkhObE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQzh2SUVsbmJtOXlaU0J5YVdkb2RDQnZjaUJ0YVdSa2JHVWdZMnhwWTJ0eklHOXVJSE4wWVhKMElDTTBOVFJjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb1pHRjBZUzVvYjNabGNpQW1KaUJsTG1KMWRIUnZibk1wSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDOHZJQ2R6ZFhCd2IzSjBjMUJoYzNOcGRtVW5JR2x6SUc5dWJIa2dkSEoxWlNCcFppQmhJR0p5YjNkelpYSWdZV3h6YnlCemRYQndiM0owY3lCMGIzVmphQzFoWTNScGIyNDZJRzV2Ym1VZ2FXNGdRMU5UTGx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM4dklHbFBVeUJ6WVdaaGNta2daRzlsY3lCdWIzUXNJSE52SUdsMElHUnZaWE51SjNRZ1oyVjBJSFJ2SUdKbGJtVm1hWFFnWm5KdmJTQndZWE56YVhabElITmpjbTlzYkdsdVp5NGdhVTlUSUdSdlpYTWdjM1Z3Y0c5eWRGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDOHZJSFJ2ZFdOb0xXRmpkR2x2YmpvZ2JXRnVhWEIxYkdGMGFXOXVMQ0JpZFhRZ2RHaGhkQ0JoYkd4dmQzTWdjR0Z1Ym1sdVp5d2dkMmhwWTJnZ1luSmxZV3R6WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z2MyeHBaR1Z5Y3lCaFpuUmxjaUI2YjI5dGFXNW5MMjl1SUc1dmJpMXlaWE53YjI1emFYWmxJSEJoWjJWekxseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDOHZJRk5sWlRvZ2FIUjBjSE02THk5aWRXZHpMbmRsWW10cGRDNXZjbWN2YzJodmQxOWlkV2N1WTJkcFAybGtQVEV6TXpFeE1seHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2doYzNWd2NHOXlkSE5RWVhOemFYWmxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHVXVjSEpsZG1WdWRFUmxabUYxYkhRb0tUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JsTG1OaGJHTlFiMmx1ZENBOUlHVXVjRzlwYm5SelcyOXdkR2x2Ym5NdWIzSjBYVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM4dklFTmhiR3dnZEdobElHVjJaVzUwSUdoaGJtUnNaWElnZDJsMGFDQjBhR1VnWlhabGJuUWdXeUJoYm1RZ1lXUmthWFJwYjI1aGJDQmtZWFJoSUYwdVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1kyRnNiR0poWTJzb1pTd2daR0YwWVNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5TzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0IyWVhJZ2JXVjBhRzlrY3lBOUlGdGRPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQXZMeUJDYVc1a0lHRWdZMnh2YzNWeVpTQnZiaUIwYUdVZ2RHRnlaMlYwSUdadmNpQmxkbVZ5ZVNCbGRtVnVkQ0IwZVhCbExseHVJQ0FnSUNBZ0lDQWdJQ0FnWlhabGJuUnpMbk53YkdsMEtGd2lJRndpS1M1bWIzSkZZV05vS0daMWJtTjBhVzl1S0dWMlpXNTBUbUZ0WlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHVnNaVzFsYm5RdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lobGRtVnVkRTVoYldVc0lHMWxkR2h2WkN3Z2MzVndjRzl5ZEhOUVlYTnphWFpsSUQ4Z2V5QndZWE56YVhabE9pQjBjblZsSUgwZ09pQm1ZV3h6WlNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2JXVjBhRzlrY3k1d2RYTm9LRnRsZG1WdWRFNWhiV1VzSUcxbGRHaHZaRjBwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdmU2s3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQnRaWFJvYjJSek8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1VISnZkbWxrWlNCaElHTnNaV0Z1SUdWMlpXNTBJSGRwZEdnZ2MzUmhibVJoY21ScGVtVmtJRzltWm5ObGRDQjJZV3gxWlhNdVhHNGdJQ0FnSUNBZ0lHWjFibU4wYVc5dUlHWnBlRVYyWlc1MEtHVXNJSEJoWjJWUFptWnpaWFFzSUdWMlpXNTBWR0Z5WjJWMEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QkdhV3gwWlhJZ2RHaGxJR1YyWlc1MElIUnZJSEpsWjJsemRHVnlJSFJvWlNCMGVYQmxMQ0IzYUdsamFDQmpZVzRnWW1WY2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SUhSdmRXTm9MQ0J0YjNWelpTQnZjaUJ3YjJsdWRHVnlMaUJQWm1aelpYUWdZMmhoYm1kbGN5QnVaV1ZrSUhSdklHSmxYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QnRZV1JsSUc5dUlHRnVJR1YyWlc1MElITndaV05wWm1saklHSmhjMmx6TGx4dUlDQWdJQ0FnSUNBZ0lDQWdkbUZ5SUhSdmRXTm9JRDBnWlM1MGVYQmxMbWx1WkdWNFQyWW9YQ0owYjNWamFGd2lLU0E5UFQwZ01EdGNiaUFnSUNBZ0lDQWdJQ0FnSUhaaGNpQnRiM1Z6WlNBOUlHVXVkSGx3WlM1cGJtUmxlRTltS0Z3aWJXOTFjMlZjSWlrZ1BUMDlJREE3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjJZWElnY0c5cGJuUmxjaUE5SUdVdWRIbHdaUzVwYm1SbGVFOW1LRndpY0c5cGJuUmxjbHdpS1NBOVBUMGdNRHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdkbUZ5SUhnN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IyWVhJZ2VUdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdTVVV4TUNCcGJYQnNaVzFsYm5SbFpDQndiMmx1ZEdWeUlHVjJaVzUwY3lCM2FYUm9JR0VnY0hKbFptbDRPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLR1V1ZEhsd1pTNXBibVJsZUU5bUtGd2lUVk5RYjJsdWRHVnlYQ0lwSUQwOVBTQXdLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY0c5cGJuUmxjaUE5SUhSeWRXVTdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklGUm9aU0J2Ym14NUlIUm9hVzVuSUc5dVpTQm9ZVzVrYkdVZ2MyaHZkV3hrSUdKbElHTnZibU5sY201bFpDQmhZbTkxZENCcGN5QjBhR1VnZEc5MVkyaGxjeUIwYUdGMElHOXlhV2RwYm1GMFpXUWdiMjRnZEc5d0lHOW1JR2wwTGx4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0hSdmRXTm9LU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1VtVjBkWEp1Y3lCMGNuVmxJR2xtSUdFZ2RHOTFZMmdnYjNKcFoybHVZWFJsWkNCdmJpQjBhR1VnZEdGeVoyVjBMbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCcGMxUnZkV05vVDI1VVlYSm5aWFFnUFNCbWRXNWpkR2x2YmloamFHVmphMVJ2ZFdOb0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJqYUdWamExUnZkV05vTG5SaGNtZGxkQ0E5UFQwZ1pYWmxiblJVWVhKblpYUWdmSHdnWlhabGJuUlVZWEpuWlhRdVkyOXVkR0ZwYm5Nb1kyaGxZMnRVYjNWamFDNTBZWEpuWlhRcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMDdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlCSmJpQjBhR1VnWTJGelpTQnZaaUIwYjNWamFITjBZWEowSUdWMlpXNTBjeXdnZDJVZ2JtVmxaQ0IwYnlCdFlXdGxJSE4xY21VZ2RHaGxjbVVnYVhNZ2MzUnBiR3dnYm04Z2JXOXlaU0IwYUdGdUlHOXVaVnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQzh2SUhSdmRXTm9JRzl1SUhSb1pTQjBZWEpuWlhRZ2MyOGdkMlVnYkc5dmF5QmhiVzl1WjNOMElHRnNiQ0IwYjNWamFHVnpMbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR2xtSUNobExuUjVjR1VnUFQwOUlGd2lkRzkxWTJoemRHRnlkRndpS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCMFlYSm5aWFJVYjNWamFHVnpJRDBnUVhKeVlYa3VjSEp2ZEc5MGVYQmxMbVpwYkhSbGNpNWpZV3hzS0dVdWRHOTFZMmhsY3l3Z2FYTlViM1ZqYUU5dVZHRnlaMlYwS1R0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlCRWJ5QnViM1FnYzNWd2NHOXlkQ0J0YjNKbElIUm9ZVzRnYjI1bElIUnZkV05vSUhCbGNpQm9ZVzVrYkdVdVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR2xtSUNoMFlYSm5aWFJVYjNWamFHVnpMbXhsYm1kMGFDQStJREVwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSGdnUFNCMFlYSm5aWFJVYjNWamFHVnpXekJkTG5CaFoyVllPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCNUlEMGdkR0Z5WjJWMFZHOTFZMmhsYzFzd1hTNXdZV2RsV1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQXZMeUJKYmlCMGFHVWdiM1JvWlhJZ1kyRnpaWE1zSUdacGJtUWdiMjRnWTJoaGJtZGxaRlJ2ZFdOb1pYTWdhWE1nWlc1dmRXZG9MbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMllYSWdkR0Z5WjJWMFZHOTFZMmdnUFNCQmNuSmhlUzV3Y205MGIzUjVjR1V1Wm1sdVpDNWpZV3hzS0dVdVkyaGhibWRsWkZSdmRXTm9aWE1zSUdselZHOTFZMmhQYmxSaGNtZGxkQ2s3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMeThnUTJGdVkyVnNJR2xtSUhSb1pTQjBZWEpuWlhRZ2RHOTFZMmdnYUdGeklHNXZkQ0J0YjNabFpDNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tDRjBZWEpuWlhSVWIzVmphQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJR1poYkhObE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdlQ0E5SUhSaGNtZGxkRlJ2ZFdOb0xuQmhaMlZZTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjVJRDBnZEdGeVoyVjBWRzkxWTJndWNHRm5aVms3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQndZV2RsVDJabWMyVjBJRDBnY0dGblpVOW1abk5sZENCOGZDQm5aWFJRWVdkbFQyWm1jMlYwS0hOamIzQmxYMFJ2WTNWdFpXNTBLVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0cxdmRYTmxJSHg4SUhCdmFXNTBaWElwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCNElEMGdaUzVqYkdsbGJuUllJQ3NnY0dGblpVOW1abk5sZEM1NE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIa2dQU0JsTG1Oc2FXVnVkRmtnS3lCd1lXZGxUMlptYzJWMExuazdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0FnSUdVdWNHRm5aVTltWm5ObGRDQTlJSEJoWjJWUFptWnpaWFE3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmxMbkJ2YVc1MGN5QTlJRnQ0TENCNVhUdGNiaUFnSUNBZ0lDQWdJQ0FnSUdVdVkzVnljMjl5SUQwZ2JXOTFjMlVnZkh3Z2NHOXBiblJsY2pzZ0x5OGdSbWw0SUNNME16VmNibHh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUdVN1hHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0F2THlCVWNtRnVjMnhoZEdVZ1lTQmpiMjl5WkdsdVlYUmxJR2x1SUhSb1pTQmtiMk4xYldWdWRDQjBieUJoSUhCbGNtTmxiblJoWjJVZ2IyNGdkR2hsSUhOc2FXUmxjbHh1SUNBZ0lDQWdJQ0JtZFc1amRHbHZiaUJqWVd4alVHOXBiblJVYjFCbGNtTmxiblJoWjJVb1kyRnNZMUJ2YVc1MEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMllYSWdiRzlqWVhScGIyNGdQU0JqWVd4alVHOXBiblFnTFNCdlptWnpaWFFvYzJOdmNHVmZRbUZ6WlN3Z2IzQjBhVzl1Y3k1dmNuUXBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RtRnlJSEJ5YjNCdmMyRnNJRDBnS0d4dlkyRjBhVzl1SUNvZ01UQXdLU0F2SUdKaGMyVlRhWHBsS0NrN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklFTnNZVzF3SUhCeWIzQnZjMkZzSUdKbGRIZGxaVzRnTUNVZ1lXNWtJREV3TUNWY2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SUU5MWRDMXZaaTFpYjNWdVpDQmpiMjl5WkdsdVlYUmxjeUJ0WVhrZ2IyTmpkWElnZDJobGJpQXVibTlWYVMxaVlYTmxJSEJ6WlhWa2J5MWxiR1Z0Wlc1MGMxeHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1lYSmxJSFZ6WldRZ0tHVXVaeTRnWTI5dWRHRnBibVZrSUdoaGJtUnNaWE1nWm1WaGRIVnlaU2xjYmlBZ0lDQWdJQ0FnSUNBZ0lIQnliM0J2YzJGc0lEMGdiR2x0YVhRb2NISnZjRzl6WVd3cE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnYjNCMGFXOXVjeTVrYVhJZ1B5QXhNREFnTFNCd2NtOXdiM05oYkNBNklIQnliM0J2YzJGc08xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1JtbHVaQ0JvWVc1a2JHVWdZMnh2YzJWemRDQjBieUJoSUdObGNuUmhhVzRnY0dWeVkyVnVkR0ZuWlNCdmJpQjBhR1VnYzJ4cFpHVnlYRzRnSUNBZ0lDQWdJR1oxYm1OMGFXOXVJR2RsZEVOc2IzTmxjM1JJWVc1a2JHVW9jSEp2Y0c5ellXd3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIWmhjaUJqYkc5elpYTjBJRDBnTVRBd08xeHVJQ0FnSUNBZ0lDQWdJQ0FnZG1GeUlHaGhibVJzWlU1MWJXSmxjaUE5SUdaaGJITmxPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQnpZMjl3WlY5SVlXNWtiR1Z6TG1admNrVmhZMmdvWm5WdVkzUnBiMjRvYUdGdVpHeGxMQ0JwYm1SbGVDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQzh2SUVScGMyRmliR1ZrSUdoaGJtUnNaWE1nWVhKbElHbG5ibTl5WldSY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcFppQW9hWE5JWVc1a2JHVkVhWE5oWW14bFpDaHBibVJsZUNrcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhaaGNpQndiM01nUFNCTllYUm9MbUZpY3loelkyOXdaVjlNYjJOaGRHbHZibk5iYVc1a1pYaGRJQzBnY0hKdmNHOXpZV3dwTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLSEJ2Y3lBOElHTnNiM05sYzNRZ2ZId2dLSEJ2Y3lBOVBUMGdNVEF3SUNZbUlHTnNiM05sYzNRZ1BUMDlJREV3TUNrcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYUdGdVpHeGxUblZ0WW1WeUlEMGdhVzVrWlhnN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR05zYjNObGMzUWdQU0J3YjNNN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJQ0FnZlNrN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJvWVc1a2JHVk9kVzFpWlhJN1hHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0F2THlCR2FYSmxJQ2RsYm1RbklIZG9aVzRnWVNCdGIzVnpaU0J2Y2lCd1pXNGdiR1ZoZG1WeklIUm9aU0JrYjJOMWJXVnVkQzVjYmlBZ0lDQWdJQ0FnWm5WdVkzUnBiMjRnWkc5amRXMWxiblJNWldGMlpTaGxkbVZ1ZEN3Z1pHRjBZU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0dWMlpXNTBMblI1Y0dVZ1BUMDlJRndpYlc5MWMyVnZkWFJjSWlBbUppQmxkbVZ1ZEM1MFlYSm5aWFF1Ym05a1pVNWhiV1VnUFQwOUlGd2lTRlJOVEZ3aUlDWW1JR1YyWlc1MExuSmxiR0YwWldSVVlYSm5aWFFnUFQwOUlHNTFiR3dwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCbGRtVnVkRVZ1WkNobGRtVnVkQ3dnWkdGMFlTazdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0F2THlCSVlXNWtiR1VnYlc5MlpXMWxiblFnYjI0Z1pHOWpkVzFsYm5RZ1ptOXlJR2hoYm1Sc1pTQmhibVFnY21GdVoyVWdaSEpoWnk1Y2JpQWdJQ0FnSUNBZ1puVnVZM1JwYjI0Z1pYWmxiblJOYjNabEtHVjJaVzUwTENCa1lYUmhLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQXZMeUJHYVhnZ0l6UTVPRnh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdRMmhsWTJzZ2RtRnNkV1VnYjJZZ0xtSjFkSFJ2Ym5NZ2FXNGdKM04wWVhKMEp5QjBieUIzYjNKcklHRnliM1Z1WkNCaElHSjFaeUJwYmlCSlJURXdJRzF2WW1sc1pTQW9aR0YwWVM1aWRYUjBiMjV6VUhKdmNHVnlkSGtwTGx4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnYUhSMGNITTZMeTlqYjI1dVpXTjBMbTFwWTNKdmMyOW1kQzVqYjIwdlNVVXZabVZsWkdKaFkyc3ZaR1YwWVdsc2N5ODVNamN3TURVdmJXOWlhV3hsTFdsbE1UQXRkMmx1Wkc5M2N5MXdhRzl1WlMxaWRYUjBiMjV6TFhCeWIzQmxjblI1TFc5bUxYQnZhVzUwWlhKdGIzWmxMV1YyWlc1MExXRnNkMkY1Y3kxNlpYSnZYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QkpSVGtnYUdGeklDNWlkWFIwYjI1eklHRnVaQ0F1ZDJocFkyZ2dlbVZ5YnlCdmJpQnRiM1Z6WlcxdmRtVXVYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QkdhWEpsWm05NElHSnlaV0ZyY3lCMGFHVWdjM0JsWXlCTlJFNGdaR1ZtYVc1bGN5NWNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaHVZWFpwWjJGMGIzSXVZWEJ3Vm1WeWMybHZiaTVwYm1SbGVFOW1LRndpVFZOSlJTQTVYQ0lwSUQwOVBTQXRNU0FtSmlCbGRtVnVkQzVpZFhSMGIyNXpJRDA5UFNBd0lDWW1JR1JoZEdFdVluVjBkRzl1YzFCeWIzQmxjblI1SUNFOVBTQXdLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJR1YyWlc1MFJXNWtLR1YyWlc1MExDQmtZWFJoS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnUTJobFkyc2dhV1lnZDJVZ1lYSmxJRzF2ZG1sdVp5QjFjQ0J2Y2lCa2IzZHVYRzRnSUNBZ0lDQWdJQ0FnSUNCMllYSWdiVzkyWlcxbGJuUWdQU0FvYjNCMGFXOXVjeTVrYVhJZ1B5QXRNU0E2SURFcElDb2dLR1YyWlc1MExtTmhiR05RYjJsdWRDQXRJR1JoZEdFdWMzUmhjblJEWVd4alVHOXBiblFwTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0F2THlCRGIyNTJaWEowSUhSb1pTQnRiM1psYldWdWRDQnBiblJ2SUdFZ2NHVnlZMlZ1ZEdGblpTQnZaaUIwYUdVZ2MyeHBaR1Z5SUhkcFpIUm9MMmhsYVdkb2RGeHVJQ0FnSUNBZ0lDQWdJQ0FnZG1GeUlIQnliM0J2YzJGc0lEMGdLRzF2ZG1WdFpXNTBJQ29nTVRBd0tTQXZJR1JoZEdFdVltRnpaVk5wZW1VN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUcxdmRtVklZVzVrYkdWektHMXZkbVZ0Wlc1MElENGdNQ3dnY0hKdmNHOXpZV3dzSUdSaGRHRXViRzlqWVhScGIyNXpMQ0JrWVhSaExtaGhibVJzWlU1MWJXSmxjbk1wTzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdMeThnVlc1aWFXNWtJRzF2ZG1VZ1pYWmxiblJ6SUc5dUlHUnZZM1Z0Wlc1MExDQmpZV3hzSUdOaGJHeGlZV05yY3k1Y2JpQWdJQ0FnSUNBZ1puVnVZM1JwYjI0Z1pYWmxiblJGYm1Rb1pYWmxiblFzSUdSaGRHRXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDOHZJRlJvWlNCb1lXNWtiR1VnYVhNZ2JtOGdiRzl1WjJWeUlHRmpkR2wyWlN3Z2MyOGdjbVZ0YjNabElIUm9aU0JqYkdGemN5NWNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaGtZWFJoTG1oaGJtUnNaU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGJXOTJaVU5zWVhOektHUmhkR0V1YUdGdVpHeGxMQ0J2Y0hScGIyNXpMbU56YzBOc1lYTnpaWE11WVdOMGFYWmxLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J6WTI5d1pWOUJZM1JwZG1WSVlXNWtiR1Z6UTI5MWJuUWdMVDBnTVR0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnVlc1aWFXNWtJSFJvWlNCdGIzWmxJR0Z1WkNCbGJtUWdaWFpsYm5SekxDQjNhR2xqYUNCaGNtVWdZV1JrWldRZ2IyNGdKM04wWVhKMEp5NWNiaUFnSUNBZ0lDQWdJQ0FnSUdSaGRHRXViR2x6ZEdWdVpYSnpMbVp2Y2tWaFkyZ29ablZ1WTNScGIyNG9ZeWtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhOamIzQmxYMFJ2WTNWdFpXNTBSV3hsYldWdWRDNXlaVzF2ZG1WRmRtVnVkRXhwYzNSbGJtVnlLR05iTUYwc0lHTmJNVjBwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdmU2s3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNoelkyOXdaVjlCWTNScGRtVklZVzVrYkdWelEyOTFiblFnUFQwOUlEQXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlCU1pXMXZkbVVnWkhKaFoyZHBibWNnWTJ4aGMzTXVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVZ0YjNabFEyeGhjM01vYzJOdmNHVmZWR0Z5WjJWMExDQnZjSFJwYjI1ekxtTnpjME5zWVhOelpYTXVaSEpoWnlrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2MyVjBXbWx1WkdWNEtDazdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlCU1pXMXZkbVVnWTNWeWMyOXlJSE4wZVd4bGN5QmhibVFnZEdWNGRDMXpaV3hsWTNScGIyNGdaWFpsYm5SeklHSnZkVzVrSUhSdklIUm9aU0JpYjJSNUxseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2hsZG1WdWRDNWpkWEp6YjNJcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYzJOdmNHVmZRbTlrZVM1emRIbHNaUzVqZFhKemIzSWdQU0JjSWx3aU8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J6WTI5d1pWOUNiMlI1TG5KbGJXOTJaVVYyWlc1MFRHbHpkR1Z1WlhJb1hDSnpaV3hsWTNSemRHRnlkRndpTENCd2NtVjJaVzUwUkdWbVlYVnNkQ2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQmtZWFJoTG1oaGJtUnNaVTUxYldKbGNuTXVabTl5UldGamFDaG1kVzVqZEdsdmJpaG9ZVzVrYkdWT2RXMWlaWElwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCbWFYSmxSWFpsYm5Rb1hDSmphR0Z1WjJWY0lpd2dhR0Z1Wkd4bFRuVnRZbVZ5S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCbWFYSmxSWFpsYm5Rb1hDSnpaWFJjSWl3Z2FHRnVaR3hsVG5WdFltVnlLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JtYVhKbFJYWmxiblFvWENKbGJtUmNJaXdnYUdGdVpHeGxUblZ0WW1WeUtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgwcE8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1FtbHVaQ0J0YjNabElHVjJaVzUwY3lCdmJpQmtiMk4xYldWdWRDNWNiaUFnSUNBZ0lDQWdablZ1WTNScGIyNGdaWFpsYm5SVGRHRnlkQ2hsZG1WdWRDd2daR0YwWVNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1NXZHViM0psSUdWMlpXNTBJR2xtSUdGdWVTQm9ZVzVrYkdVZ2FYTWdaR2x6WVdKc1pXUmNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaGtZWFJoTG1oaGJtUnNaVTUxYldKbGNuTXVjMjl0WlNocGMwaGhibVJzWlVScGMyRmliR1ZrS1NrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUNBZ2RtRnlJR2hoYm1Sc1pUdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLR1JoZEdFdWFHRnVaR3hsVG5WdFltVnljeTVzWlc1bmRHZ2dQVDA5SURFcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjJZWElnYUdGdVpHeGxUM0pwWjJsdUlEMGdjMk52Y0dWZlNHRnVaR3hsYzF0a1lYUmhMbWhoYm1Sc1pVNTFiV0psY25OYk1GMWRPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYUdGdVpHeGxJRDBnYUdGdVpHeGxUM0pwWjJsdUxtTm9hV3hrY21WdVd6QmRPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSE5qYjNCbFgwRmpkR2wyWlVoaGJtUnNaWE5EYjNWdWRDQXJQU0F4TzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0x5OGdUV0Z5YXlCMGFHVWdhR0Z1Wkd4bElHRnpJQ2RoWTNScGRtVW5JSE52SUdsMElHTmhiaUJpWlNCemRIbHNaV1F1WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWVdSa1EyeGhjM01vYUdGdVpHeGxMQ0J2Y0hScGIyNXpMbU56YzBOc1lYTnpaWE11WVdOMGFYWmxLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdRU0JrY21GbklITm9iM1ZzWkNCdVpYWmxjaUJ3Y205d1lXZGhkR1VnZFhBZ2RHOGdkR2hsSUNkMFlYQW5JR1YyWlc1MExseHVJQ0FnSUNBZ0lDQWdJQ0FnWlhabGJuUXVjM1J2Y0ZCeWIzQmhaMkYwYVc5dUtDazdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDOHZJRkpsWTI5eVpDQjBhR1VnWlhabGJuUWdiR2x6ZEdWdVpYSnpMbHh1SUNBZ0lDQWdJQ0FnSUNBZ2RtRnlJR3hwYzNSbGJtVnljeUE5SUZ0ZE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QkJkSFJoWTJnZ2RHaGxJRzF2ZG1VZ1lXNWtJR1Z1WkNCbGRtVnVkSE11WEc0Z0lDQWdJQ0FnSUNBZ0lDQjJZWElnYlc5MlpVVjJaVzUwSUQwZ1lYUjBZV05vUlhabGJuUW9ZV04wYVc5dWN5NXRiM1psTENCelkyOXdaVjlFYjJOMWJXVnVkRVZzWlcxbGJuUXNJR1YyWlc1MFRXOTJaU3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM4dklGUm9aU0JsZG1WdWRDQjBZWEpuWlhRZ2FHRnpJR05vWVc1blpXUWdjMjhnZDJVZ2JtVmxaQ0IwYnlCd2NtOXdZV2RoZEdVZ2RHaGxJRzl5YVdkcGJtRnNJRzl1WlNCemJ5QjBhR0YwSUhkbElHdGxaWEJjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlCeVpXeDVhVzVuSUc5dUlHbDBJSFJ2SUdWNGRISmhZM1FnZEdGeVoyVjBJSFJ2ZFdOb1pYTXVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkR0Z5WjJWME9pQmxkbVZ1ZEM1MFlYSm5aWFFzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYUdGdVpHeGxPaUJvWVc1a2JHVXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdiR2x6ZEdWdVpYSnpPaUJzYVhOMFpXNWxjbk1zWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYzNSaGNuUkRZV3hqVUc5cGJuUTZJR1YyWlc1MExtTmhiR05RYjJsdWRDeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmlZWE5sVTJsNlpUb2dZbUZ6WlZOcGVtVW9LU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J3WVdkbFQyWm1jMlYwT2lCbGRtVnVkQzV3WVdkbFQyWm1jMlYwTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdoaGJtUnNaVTUxYldKbGNuTTZJR1JoZEdFdWFHRnVaR3hsVG5WdFltVnljeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JpZFhSMGIyNXpVSEp2Y0dWeWRIazZJR1YyWlc1MExtSjFkSFJ2Ym5Nc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2JHOWpZWFJwYjI1ek9pQnpZMjl3WlY5TWIyTmhkR2x2Ym5NdWMyeHBZMlVvS1Z4dUlDQWdJQ0FnSUNBZ0lDQWdmU2s3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCbGJtUkZkbVZ1ZENBOUlHRjBkR0ZqYUVWMlpXNTBLR0ZqZEdsdmJuTXVaVzVrTENCelkyOXdaVjlFYjJOMWJXVnVkRVZzWlcxbGJuUXNJR1YyWlc1MFJXNWtMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZEdGeVoyVjBPaUJsZG1WdWRDNTBZWEpuWlhRc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FHRnVaR3hsT2lCb1lXNWtiR1VzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYkdsemRHVnVaWEp6T2lCc2FYTjBaVzVsY25Nc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1pHOU9iM1JTWldwbFkzUTZJSFJ5ZFdVc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FHRnVaR3hsVG5WdFltVnljem9nWkdGMFlTNW9ZVzVrYkdWT2RXMWlaWEp6WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlLVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdkbUZ5SUc5MWRFVjJaVzUwSUQwZ1lYUjBZV05vUlhabGJuUW9YQ0p0YjNWelpXOTFkRndpTENCelkyOXdaVjlFYjJOMWJXVnVkRVZzWlcxbGJuUXNJR1J2WTNWdFpXNTBUR1ZoZG1Vc0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjBZWEpuWlhRNklHVjJaVzUwTG5SaGNtZGxkQ3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JvWVc1a2JHVTZJR2hoYm1Sc1pTeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnNhWE4wWlc1bGNuTTZJR3hwYzNSbGJtVnljeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JrYjA1dmRGSmxhbVZqZERvZ2RISjFaU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JvWVc1a2JHVk9kVzFpWlhKek9pQmtZWFJoTG1oaGJtUnNaVTUxYldKbGNuTmNiaUFnSUNBZ0lDQWdJQ0FnSUgwcE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QlhaU0IzWVc1MElIUnZJRzFoYTJVZ2MzVnlaU0IzWlNCd2RYTm9aV1FnZEdobElHeHBjM1JsYm1WeWN5QnBiaUIwYUdVZ2JHbHpkR1Z1WlhJZ2JHbHpkQ0J5WVhSb1pYSWdkR2hoYmlCamNtVmhkR2x1WjF4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnWVNCdVpYY2diMjVsSUdGeklHbDBJR2hoY3lCaGJISmxZV1I1SUdKbFpXNGdjR0Z6YzJWa0lIUnZJSFJvWlNCbGRtVnVkQ0JvWVc1a2JHVnljeTVjYmlBZ0lDQWdJQ0FnSUNBZ0lHeHBjM1JsYm1WeWN5NXdkWE5vTG1Gd2NHeDVLR3hwYzNSbGJtVnljeXdnYlc5MlpVVjJaVzUwTG1OdmJtTmhkQ2hsYm1SRmRtVnVkQ3dnYjNWMFJYWmxiblFwS1R0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1ZHVjRkQ0J6Wld4bFkzUnBiMjRnYVhOdUozUWdZVzRnYVhOemRXVWdiMjRnZEc5MVkyZ2daR1YyYVdObGN5eGNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklITnZJR0ZrWkdsdVp5QmpkWEp6YjNJZ2MzUjViR1Z6SUdOaGJpQmlaU0J6YTJsd2NHVmtMbHh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLR1YyWlc1MExtTjFjbk52Y2lrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDOHZJRkJ5WlhabGJuUWdkR2hsSUNkSkp5QmpkWEp6YjNJZ1lXNWtJR1Y0ZEdWdVpDQjBhR1VnY21GdVoyVXRaSEpoWnlCamRYSnpiM0l1WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYzJOdmNHVmZRbTlrZVM1emRIbHNaUzVqZFhKemIzSWdQU0JuWlhSRGIyMXdkWFJsWkZOMGVXeGxLR1YyWlc1MExuUmhjbWRsZENrdVkzVnljMjl5TzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0x5OGdUV0Z5YXlCMGFHVWdkR0Z5WjJWMElIZHBkR2dnWVNCa2NtRm5aMmx1WnlCemRHRjBaUzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb2MyTnZjR1ZmU0dGdVpHeGxjeTVzWlc1bmRHZ2dQaUF4S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR0ZrWkVOc1lYTnpLSE5qYjNCbFgxUmhjbWRsZEN3Z2IzQjBhVzl1Y3k1amMzTkRiR0Z6YzJWekxtUnlZV2NwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDOHZJRkJ5WlhabGJuUWdkR1Y0ZENCelpXeGxZM1JwYjI0Z2QyaGxiaUJrY21GbloybHVaeUIwYUdVZ2FHRnVaR3hsY3k1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBdkx5QkpiaUJ1YjFWcFUyeHBaR1Z5SUR3OUlEa3VNaTR3TENCMGFHbHpJSGRoY3lCb1lXNWtiR1ZrSUdKNUlHTmhiR3hwYm1jZ2NISmxkbVZ1ZEVSbFptRjFiSFFnYjI0Z2JXOTFjMlV2ZEc5MVkyZ2djM1JoY25RdmJXOTJaU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlCM2FHbGphQ0JwY3lCelkzSnZiR3dnWW14dlkydHBibWN1SUZSb1pTQnpaV3hsWTNSemRHRnlkQ0JsZG1WdWRDQnBjeUJ6ZFhCd2IzSjBaV1FnWW5rZ1JtbHlaVVp2ZUNCemRHRnlkR2x1WnlCbWNtOXRJSFpsY25OcGIyNGdOVElzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z2JXVmhibWx1WnlCMGFHVWdiMjVzZVNCb2IyeGtiM1YwSUdseklHbFBVeUJUWVdaaGNta3VJRlJvYVhNZ1pHOWxjMjRuZENCdFlYUjBaWEk2SUhSbGVIUWdjMlZzWldOMGFXOXVJR2x6YmlkMElIUnlhV2RuWlhKbFpDQjBhR1Z5WlM1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBdkx5QlVhR1VnSjJOMWNuTnZjaWNnWm14aFp5QnBjeUJtWVd4elpTNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQXZMeUJUWldVNklHaDBkSEE2THk5allXNXBkWE5sTG1OdmJTOGpjMlZoY21Ob1BYTmxiR1ZqZEhOMFlYSjBYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjMk52Y0dWZlFtOWtlUzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLRndpYzJWc1pXTjBjM1JoY25SY0lpd2djSEpsZG1WdWRFUmxabUYxYkhRc0lHWmhiSE5sS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdaR0YwWVM1b1lXNWtiR1ZPZFcxaVpYSnpMbVp2Y2tWaFkyZ29ablZ1WTNScGIyNG9hR0Z1Wkd4bFRuVnRZbVZ5S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1ptbHlaVVYyWlc1MEtGd2ljM1JoY25SY0lpd2dhR0Z1Wkd4bFRuVnRZbVZ5S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDBwTzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdMeThnVFc5MlpTQmpiRzl6WlhOMElHaGhibVJzWlNCMGJ5QjBZWEJ3WldRZ2JHOWpZWFJwYjI0dVhHNGdJQ0FnSUNBZ0lHWjFibU4wYVc5dUlHVjJaVzUwVkdGd0tHVjJaVzUwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0F2THlCVWFHVWdkR0Z3SUdWMlpXNTBJSE5vYjNWc1pHNG5kQ0J3Y205d1lXZGhkR1VnZFhCY2JpQWdJQ0FnSUNBZ0lDQWdJR1YyWlc1MExuTjBiM0JRY205d1lXZGhkR2x2YmlncE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNCMllYSWdjSEp2Y0c5ellXd2dQU0JqWVd4alVHOXBiblJVYjFCbGNtTmxiblJoWjJVb1pYWmxiblF1WTJGc1kxQnZhVzUwS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCb1lXNWtiR1ZPZFcxaVpYSWdQU0JuWlhSRGJHOXpaWE4wU0dGdVpHeGxLSEJ5YjNCdmMyRnNLVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnVkdGamEyeGxJSFJvWlNCallYTmxJSFJvWVhRZ1lXeHNJR2hoYm1Sc1pYTWdZWEpsSUNka2FYTmhZbXhsWkNjdVhHNGdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb2FHRnVaR3hsVG5WdFltVnlJRDA5UFNCbVlXeHpaU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1JteGhaeUIwYUdVZ2MyeHBaR1Z5SUdGeklHbDBJR2x6SUc1dmR5QnBiaUJoSUhSeVlXNXphWFJwYjI1aGJDQnpkR0YwWlM1Y2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SUZSeVlXNXphWFJwYjI0Z2RHRnJaWE1nWVNCamIyNW1hV2QxY21GaWJHVWdZVzF2ZFc1MElHOW1JRzF6SUNoa1pXWmhkV3gwSURNd01Da3VJRkpsTFdWdVlXSnNaU0IwYUdVZ2MyeHBaR1Z5SUdGbWRHVnlJSFJvWVhRdVhHNGdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb0lXOXdkR2x2Ym5NdVpYWmxiblJ6TG5OdVlYQXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JoWkdSRGJHRnpjMFp2Y2loelkyOXdaVjlVWVhKblpYUXNJRzl3ZEdsdmJuTXVZM056UTJ4aGMzTmxjeTUwWVhBc0lHOXdkR2x2Ym5NdVlXNXBiV0YwYVc5dVJIVnlZWFJwYjI0cE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0J6WlhSSVlXNWtiR1VvYUdGdVpHeGxUblZ0WW1WeUxDQndjbTl3YjNOaGJDd2dkSEoxWlN3Z2RISjFaU2s3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJSE5sZEZwcGJtUmxlQ2dwTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0JtYVhKbFJYWmxiblFvWENKemJHbGtaVndpTENCb1lXNWtiR1ZPZFcxaVpYSXNJSFJ5ZFdVcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnWm1seVpVVjJaVzUwS0Z3aWRYQmtZWFJsWENJc0lHaGhibVJzWlU1MWJXSmxjaXdnZEhKMVpTazdYRzRnSUNBZ0lDQWdJQ0FnSUNCbWFYSmxSWFpsYm5Rb1hDSmphR0Z1WjJWY0lpd2dhR0Z1Wkd4bFRuVnRZbVZ5TENCMGNuVmxLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHWnBjbVZGZG1WdWRDaGNJbk5sZEZ3aUxDQm9ZVzVrYkdWT2RXMWlaWElzSUhSeWRXVXBPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvYjNCMGFXOXVjeTVsZG1WdWRITXVjMjVoY0NrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHVjJaVzUwVTNSaGNuUW9aWFpsYm5Rc0lIc2dhR0Z1Wkd4bFRuVnRZbVZ5Y3pvZ1cyaGhibVJzWlU1MWJXSmxjbDBnZlNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQXZMeUJHYVhKbGN5QmhJQ2RvYjNabGNpY2daWFpsYm5RZ1ptOXlJR0VnYUc5MlpYSmxaQ0J0YjNWelpTOXdaVzRnY0c5emFYUnBiMjR1WEc0Z0lDQWdJQ0FnSUdaMWJtTjBhVzl1SUdWMlpXNTBTRzkyWlhJb1pYWmxiblFwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCd2NtOXdiM05oYkNBOUlHTmhiR05RYjJsdWRGUnZVR1Z5WTJWdWRHRm5aU2hsZG1WdWRDNWpZV3hqVUc5cGJuUXBPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQjJZWElnZEc4Z1BTQnpZMjl3WlY5VGNHVmpkSEoxYlM1blpYUlRkR1Z3S0hCeWIzQnZjMkZzS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCMllXeDFaU0E5SUhOamIzQmxYMU53WldOMGNuVnRMbVp5YjIxVGRHVndjR2x1WnloMGJ5azdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lFOWlhbVZqZEM1clpYbHpLSE5qYjNCbFgwVjJaVzUwY3lrdVptOXlSV0ZqYUNobWRXNWpkR2x2YmloMFlYSm5aWFJGZG1WdWRDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR2xtSUNoY0ltaHZkbVZ5WENJZ1BUMDlJSFJoY21kbGRFVjJaVzUwTG5Od2JHbDBLRndpTGx3aUtWc3dYU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnpZMjl3WlY5RmRtVnVkSE5iZEdGeVoyVjBSWFpsYm5SZExtWnZja1ZoWTJnb1puVnVZM1JwYjI0b1kyRnNiR0poWTJzcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHTmhiR3hpWVdOckxtTmhiR3dvYzJOdmNHVmZVMlZzWml3Z2RtRnNkV1VwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlLVHRjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDOHZJRWhoYm1Sc1pYTWdhMlY1Wkc5M2JpQnZiaUJtYjJOMWMyVmtJR2hoYm1Sc1pYTmNiaUFnSUNBZ0lDQWdMeThnUkc5dUozUWdiVzkyWlNCMGFHVWdaRzlqZFcxbGJuUWdkMmhsYmlCd2NtVnpjMmx1WnlCaGNuSnZkeUJyWlhseklHOXVJR1p2WTNWelpXUWdhR0Z1Wkd4bGMxeHVJQ0FnSUNBZ0lDQm1kVzVqZEdsdmJpQmxkbVZ1ZEV0bGVXUnZkMjRvWlhabGJuUXNJR2hoYm1Sc1pVNTFiV0psY2lrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHbHpTR0Z1Wkd4bFJHbHpZV0pzWldRb2FHRnVaR3hsVG5WdFltVnlLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJQ0FnZG1GeUlHaHZjbWw2YjI1MFlXeExaWGx6SUQwZ1cxd2lUR1ZtZEZ3aUxDQmNJbEpwWjJoMFhDSmRPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RtRnlJSFpsY25ScFkyRnNTMlY1Y3lBOUlGdGNJa1J2ZDI1Y0lpd2dYQ0pWY0Z3aVhUdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLRzl3ZEdsdmJuTXVaR2x5SUNZbUlDRnZjSFJwYjI1ekxtOXlkQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM4dklFOXVJR0Z1SUhKcFoyaDBMWFJ2TFd4bFpuUWdjMnhwWkdWeUxDQjBhR1VnYkdWbWRDQmhibVFnY21sbmFIUWdhMlY1Y3lCaFkzUWdhVzUyWlhKMFpXUmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQm9iM0pwZW05dWRHRnNTMlY1Y3k1eVpYWmxjbk5sS0NrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5SUdWc2MyVWdhV1lnS0c5d2RHbHZibk11YjNKMElDWW1JQ0Z2Y0hScGIyNXpMbVJwY2lrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDOHZJRTl1SUdFZ2RHOXdMWFJ2TFdKdmRIUnZiU0J6Ykdsa1pYSXNJSFJvWlNCMWNDQmhibVFnWkc5M2JpQnJaWGx6SUdGamRDQnBiblpsY25SbFpGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIWmxjblJwWTJGc1MyVjVjeTV5WlhabGNuTmxLQ2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDOHZJRk4wY21sd0lGd2lRWEp5YjNkY0lpQm1iM0lnU1VVZ1kyOXRjR0YwYVdKcGJHbDBlUzRnYUhSMGNITTZMeTlrWlhabGJHOXdaWEl1Ylc5NmFXeHNZUzV2Y21jdlpXNHRWVk12Wkc5amN5OVhaV0l2UVZCSkwwdGxlV0p2WVhKa1JYWmxiblF2YTJWNVhHNGdJQ0FnSUNBZ0lDQWdJQ0IyWVhJZ2EyVjVJRDBnWlhabGJuUXVhMlY1TG5KbGNHeGhZMlVvWENKQmNuSnZkMXdpTENCY0lsd2lLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIWmhjaUJwYzBSdmQyNGdQU0JyWlhrZ1BUMDlJSFpsY25ScFkyRnNTMlY1YzFzd1hTQjhmQ0JyWlhrZ1BUMDlJR2h2Y21sNmIyNTBZV3hMWlhseld6QmRPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RtRnlJR2x6VlhBZ1BTQnJaWGtnUFQwOUlIWmxjblJwWTJGc1MyVjVjMXN4WFNCOGZDQnJaWGtnUFQwOUlHaHZjbWw2YjI1MFlXeExaWGx6V3pGZE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9JV2x6Ukc5M2JpQW1KaUFoYVhOVmNDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQjBjblZsTzF4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQmxkbVZ1ZEM1d2NtVjJaVzUwUkdWbVlYVnNkQ2dwTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0IyWVhJZ1pHbHlaV04wYVc5dUlEMGdhWE5FYjNkdUlEOGdNQ0E2SURFN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IyWVhJZ2MzUmxjSE1nUFNCblpYUk9aWGgwVTNSbGNITkdiM0pJWVc1a2JHVW9hR0Z1Wkd4bFRuVnRZbVZ5S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCemRHVndJRDBnYzNSbGNITmJaR2x5WldOMGFXOXVYVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnUVhRZ2RHaGxJR1ZrWjJVZ2IyWWdZU0J6Ykdsa1pYSXNJR1J2SUc1dmRHaHBibWRjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2h6ZEdWd0lEMDlQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sTzF4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQXZMeUJPYnlCemRHVndJSE5sZEN3Z2RYTmxJSFJvWlNCa1pXWmhkV3gwSUc5bUlERXdKU0J2WmlCMGFHVWdjM1ZpTFhKaGJtZGxYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9jM1JsY0NBOVBUMGdabUZzYzJVcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnpkR1Z3SUQwZ2MyTnZjR1ZmVTNCbFkzUnlkVzB1WjJWMFJHVm1ZWFZzZEZOMFpYQW9jMk52Y0dWZlRHOWpZWFJwYjI1elcyaGhibVJzWlU1MWJXSmxjbDBzSUdselJHOTNiaXdnTVRBcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0F2THlCVGRHVndJRzkyWlhJZ2VtVnlieTFzWlc1bmRHZ2djbUZ1WjJWeklDZ2pPVFE0S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSE4wWlhBZ1BTQk5ZWFJvTG0xaGVDaHpkR1Z3TENBd0xqQXdNREF3TURFcE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QkVaV055WlcxbGJuUWdabTl5SUdSdmQyNGdjM1JsY0hOY2JpQWdJQ0FnSUNBZ0lDQWdJSE4wWlhBZ1BTQW9hWE5FYjNkdUlEOGdMVEVnT2lBeEtTQXFJSE4wWlhBN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUhOamIzQmxYMU5vYjNWc1pFRnVhVzFoZEdVZ1BTQm1ZV3h6WlR0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnZG1Gc2RXVlRaWFJJWVc1a2JHVW9hR0Z1Wkd4bFRuVnRZbVZ5TENCelkyOXdaVjlXWVd4MVpYTmJhR0Z1Wkd4bFRuVnRZbVZ5WFNBcklITjBaWEFzSUhSeWRXVXBPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQnpZMjl3WlY5VGFHOTFiR1JCYm1sdFlYUmxJRDBnZEhKMVpUdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdRWFIwWVdOb0lHVjJaVzUwY3lCMGJ5QnpaWFpsY21Gc0lITnNhV1JsY2lCd1lYSjBjeTVjYmlBZ0lDQWdJQ0FnWm5WdVkzUnBiMjRnWW1sdVpGTnNhV1JsY2tWMlpXNTBjeWhpWldoaGRtbHZkWElwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SUVGMGRHRmphQ0IwYUdVZ2MzUmhibVJoY21RZ1pISmhaeUJsZG1WdWRDQjBieUIwYUdVZ2FHRnVaR3hsY3k1Y2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNnaFltVm9ZWFpwYjNWeUxtWnBlR1ZrS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2MyTnZjR1ZmU0dGdVpHeGxjeTVtYjNKRllXTm9LR1oxYm1OMGFXOXVLR2hoYm1Sc1pTd2dhVzVrWlhncElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1ZHaGxjMlVnWlhabGJuUnpJR0Z5WlNCdmJteDVJR0p2ZFc1a0lIUnZJSFJvWlNCMmFYTjFZV3dnYUdGdVpHeGxYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM4dklHVnNaVzFsYm5Rc0lHNXZkQ0IwYUdVZ0ozSmxZV3duSUc5eWFXZHBiaUJsYkdWdFpXNTBMbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCaGRIUmhZMmhGZG1WdWRDaGhZM1JwYjI1ekxuTjBZWEowTENCb1lXNWtiR1V1WTJocGJHUnlaVzViTUYwc0lHVjJaVzUwVTNSaGNuUXNJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR2hoYm1Sc1pVNTFiV0psY25NNklGdHBibVJsZUYxY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmU2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SUVGMGRHRmphQ0IwYUdVZ2RHRndJR1YyWlc1MElIUnZJSFJvWlNCemJHbGtaWElnWW1GelpTNWNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaGlaV2hoZG1sdmRYSXVkR0Z3S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1lYUjBZV05vUlhabGJuUW9ZV04wYVc5dWN5NXpkR0Z5ZEN3Z2MyTnZjR1ZmUW1GelpTd2daWFpsYm5SVVlYQXNJSHQ5S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnUm1seVpTQm9iM1psY2lCbGRtVnVkSE5jYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2hpWldoaGRtbHZkWEl1YUc5MlpYSXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JoZEhSaFkyaEZkbVZ1ZENoaFkzUnBiMjV6TG0xdmRtVXNJSE5qYjNCbFgwSmhjMlVzSUdWMlpXNTBTRzkyWlhJc0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYUc5MlpYSTZJSFJ5ZFdWY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1RXRnJaU0IwYUdVZ2NtRnVaMlVnWkhKaFoyZGhZbXhsTGx4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0dKbGFHRjJhVzkxY2k1a2NtRm5LU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYzJOdmNHVmZRMjl1Ym1WamRITXVabTl5UldGamFDaG1kVzVqZEdsdmJpaGpiMjV1WldOMExDQnBibVJsZUNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb1kyOXVibVZqZENBOVBUMGdabUZzYzJVZ2ZId2dhVzVrWlhnZ1BUMDlJREFnZkh3Z2FXNWtaWGdnUFQwOUlITmpiM0JsWDBOdmJtNWxZM1J6TG14bGJtZDBhQ0F0SURFcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymp0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIWmhjaUJvWVc1a2JHVkNaV1p2Y21VZ1BTQnpZMjl3WlY5SVlXNWtiR1Z6VzJsdVpHVjRJQzBnTVYwN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCb1lXNWtiR1ZCWm5SbGNpQTlJSE5qYjNCbFgwaGhibVJzWlhOYmFXNWtaWGhkTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjJZWElnWlhabGJuUkliMnhrWlhKeklEMGdXMk52Ym01bFkzUmRPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHRmtaRU5zWVhOektHTnZibTVsWTNRc0lHOXdkR2x2Ym5NdVkzTnpRMnhoYzNObGN5NWtjbUZuWjJGaWJHVXBPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDOHZJRmRvWlc0Z2RHaGxJSEpoYm1kbElHbHpJR1pwZUdWa0xDQjBhR1VnWlc1MGFYSmxJSEpoYm1kbElHTmhibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBdkx5QmlaU0JrY21GbloyVmtJR0o1SUhSb1pTQm9ZVzVrYkdWekxpQlVhR1VnYUdGdVpHeGxJR2x1SUhSb1pTQm1hWEp6ZEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQXZMeUJ2Y21sbmFXNGdkMmxzYkNCd2NtOXdZV2RoZEdVZ2RHaGxJSE4wWVhKMElHVjJaVzUwSUhWd2QyRnlaQ3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0x5OGdZblYwSUdsMElHNWxaV1J6SUhSdklHSmxJR0p2ZFc1a0lHMWhiblZoYkd4NUlHOXVJSFJvWlNCdmRHaGxjaTVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLR0psYUdGMmFXOTFjaTVtYVhobFpDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdaWFpsYm5SSWIyeGtaWEp6TG5CMWMyZ29hR0Z1Wkd4bFFtVm1iM0psTG1Ob2FXeGtjbVZ1V3pCZEtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHVjJaVzUwU0c5c1pHVnljeTV3ZFhOb0tHaGhibVJzWlVGbWRHVnlMbU5vYVd4a2NtVnVXekJkS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHVjJaVzUwU0c5c1pHVnljeTVtYjNKRllXTm9LR1oxYm1OMGFXOXVLR1YyWlc1MFNHOXNaR1Z5S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCaGRIUmhZMmhGZG1WdWRDaGhZM1JwYjI1ekxuTjBZWEowTENCbGRtVnVkRWh2YkdSbGNpd2daWFpsYm5SVGRHRnlkQ3dnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHaGhibVJzWlhNNklGdG9ZVzVrYkdWQ1pXWnZjbVVzSUdoaGJtUnNaVUZtZEdWeVhTeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JvWVc1a2JHVk9kVzFpWlhKek9pQmJhVzVrWlhnZ0xTQXhMQ0JwYm1SbGVGMWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMHBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUM4dklFRjBkR0ZqYUNCaGJpQmxkbVZ1ZENCMGJ5QjBhR2x6SUhOc2FXUmxjaXdnY0c5emMybGliSGtnYVc1amJIVmthVzVuSUdFZ2JtRnRaWE53WVdObFhHNGdJQ0FnSUNBZ0lHWjFibU4wYVc5dUlHSnBibVJGZG1WdWRDaHVZVzFsYzNCaFkyVmtSWFpsYm5Rc0lHTmhiR3hpWVdOcktTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCelkyOXdaVjlGZG1WdWRITmJibUZ0WlhOd1lXTmxaRVYyWlc1MFhTQTlJSE5qYjNCbFgwVjJaVzUwYzF0dVlXMWxjM0JoWTJWa1JYWmxiblJkSUh4OElGdGRPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2MyTnZjR1ZmUlhabGJuUnpXMjVoYldWemNHRmpaV1JGZG1WdWRGMHVjSFZ6YUNoallXeHNZbUZqYXlrN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklFbG1JSFJvWlNCbGRtVnVkQ0JpYjNWdVpDQnBjeUFuZFhCa1lYUmxMQ2NnWm1seVpTQnBkQ0JwYlcxbFpHbGhkR1ZzZVNCbWIzSWdZV3hzSUdoaGJtUnNaWE11WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvYm1GdFpYTndZV05sWkVWMlpXNTBMbk53YkdsMEtGd2lMbHdpS1Zzd1hTQTlQVDBnWENKMWNHUmhkR1ZjSWlrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lITmpiM0JsWDBoaGJtUnNaWE11Wm05eVJXRmphQ2htZFc1amRHbHZiaWhoTENCcGJtUmxlQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQm1hWEpsUlhabGJuUW9YQ0oxY0dSaGRHVmNJaXdnYVc1a1pYZ3BPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDBwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdWVzVrYnlCaGRIUmhZMmh0Wlc1MElHOW1JR1YyWlc1MFhHNGdJQ0FnSUNBZ0lHWjFibU4wYVc5dUlISmxiVzkyWlVWMlpXNTBLRzVoYldWemNHRmpaV1JGZG1WdWRDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RtRnlJR1YyWlc1MElEMGdibUZ0WlhOd1lXTmxaRVYyWlc1MElDWW1JRzVoYldWemNHRmpaV1JGZG1WdWRDNXpjR3hwZENoY0lpNWNJaWxiTUYwN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IyWVhJZ2JtRnRaWE53WVdObElEMGdaWFpsYm5RZ0ppWWdibUZ0WlhOd1lXTmxaRVYyWlc1MExuTjFZbk4wY21sdVp5aGxkbVZ1ZEM1c1pXNW5kR2dwTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0JQWW1wbFkzUXVhMlY1Y3loelkyOXdaVjlGZG1WdWRITXBMbVp2Y2tWaFkyZ29ablZ1WTNScGIyNG9ZbWx1WkNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIWmhjaUIwUlhabGJuUWdQU0JpYVc1a0xuTndiR2wwS0Z3aUxsd2lLVnN3WFR0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMllYSWdkRTVoYldWemNHRmpaU0E5SUdKcGJtUXVjM1ZpYzNSeWFXNW5LSFJGZG1WdWRDNXNaVzVuZEdncE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhV1lnS0NnaFpYWmxiblFnZkh3Z1pYWmxiblFnUFQwOUlIUkZkbVZ1ZENrZ0ppWWdLQ0Z1WVcxbGMzQmhZMlVnZkh3Z2JtRnRaWE53WVdObElEMDlQU0IwVG1GdFpYTndZV05sS1NrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JrWld4bGRHVWdjMk52Y0dWZlJYWmxiblJ6VzJKcGJtUmRPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNBZ0lIMHBPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdSWGgwWlhKdVlXd2daWFpsYm5RZ2FHRnVaR3hwYm1kY2JpQWdJQ0FnSUNBZ1puVnVZM1JwYjI0Z1ptbHlaVVYyWlc1MEtHVjJaVzUwVG1GdFpTd2dhR0Z1Wkd4bFRuVnRZbVZ5TENCMFlYQXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lFOWlhbVZqZEM1clpYbHpLSE5qYjNCbFgwVjJaVzUwY3lrdVptOXlSV0ZqYUNobWRXNWpkR2x2YmloMFlYSm5aWFJGZG1WdWRDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCbGRtVnVkRlI1Y0dVZ1BTQjBZWEpuWlhSRmRtVnVkQzV6Y0d4cGRDaGNJaTVjSWlsYk1GMDdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb1pYWmxiblJPWVcxbElEMDlQU0JsZG1WdWRGUjVjR1VwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjMk52Y0dWZlJYWmxiblJ6VzNSaGNtZGxkRVYyWlc1MFhTNW1iM0pGWVdOb0tHWjFibU4wYVc5dUtHTmhiR3hpWVdOcktTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmpZV3hzWW1GamF5NWpZV3hzS0Z4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDOHZJRlZ6WlNCMGFHVWdjMnhwWkdWeUlIQjFZbXhwWXlCQlVFa2dZWE1nZEdobElITmpiM0JsSUNnbmRHaHBjeWNwWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2MyTnZjR1ZmVTJWc1ppeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlCU1pYUjFjbTRnZG1Gc2RXVnpJR0Z6SUdGeWNtRjVMQ0J6YnlCaGNtZGZNVnRoY21kZk1sMGdhWE1nWVd4M1lYbHpJSFpoYkdsa0xseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSE5qYjNCbFgxWmhiSFZsY3k1dFlYQW9iM0IwYVc5dWN5NW1iM0p0WVhRdWRHOHBMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM4dklFaGhibVJzWlNCcGJtUmxlQ3dnTUNCdmNpQXhYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYUdGdVpHeGxUblZ0WW1WeUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQzh2SUZWdUxXWnZjbTFoZEhSbFpDQnpiR2xrWlhJZ2RtRnNkV1Z6WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2MyTnZjR1ZmVm1Gc2RXVnpMbk5zYVdObEtDa3NYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1JYWmxiblFnYVhNZ1ptbHlaV1FnWW5rZ2RHRndMQ0IwY25WbElHOXlJR1poYkhObFhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkR0Z3SUh4OElHWmhiSE5sTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDOHZJRXhsWm5RZ2IyWm1jMlYwSUc5bUlIUm9aU0JvWVc1a2JHVXNJR2x1SUhKbGJHRjBhVzl1SUhSdklIUm9aU0J6Ykdsa1pYSmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J6WTI5d1pWOU1iMk5oZEdsdmJuTXVjMnhwWTJVb0tWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0tUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJQ0FnZlNrN1hHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0F2THlCVGNHeHBkQ0J2ZFhRZ2RHaGxJR2hoYm1Sc1pTQndiM05wZEdsdmJtbHVaeUJzYjJkcFl5QnpieUIwYUdVZ1RXOTJaU0JsZG1WdWRDQmpZVzRnZFhObElHbDBMQ0IwYjI5Y2JpQWdJQ0FnSUNBZ1puVnVZM1JwYjI0Z1kyaGxZMnRJWVc1a2JHVlFiM05wZEdsdmJpaHlaV1psY21WdVkyVXNJR2hoYm1Sc1pVNTFiV0psY2l3Z2RHOHNJR3h2YjJ0Q1lXTnJkMkZ5WkN3Z2JHOXZhMFp2Y25kaGNtUXNJR2RsZEZaaGJIVmxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQXZMeUJHYjNJZ2MyeHBaR1Z5Y3lCM2FYUm9JRzExYkhScGNHeGxJR2hoYm1Sc1pYTXNJR3hwYldsMElHMXZkbVZ0Wlc1MElIUnZJSFJvWlNCdmRHaGxjaUJvWVc1a2JHVXVYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QkJjSEJzZVNCMGFHVWdiV0Z5WjJsdUlHOXdkR2x2YmlCaWVTQmhaR1JwYm1jZ2FYUWdkRzhnZEdobElHaGhibVJzWlNCd2IzTnBkR2x2Ym5NdVhHNGdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb2MyTnZjR1ZmU0dGdVpHeGxjeTVzWlc1bmRHZ2dQaUF4SUNZbUlDRnZjSFJwYjI1ekxtVjJaVzUwY3k1MWJtTnZibk4wY21GcGJtVmtLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHeHZiMnRDWVdOcmQyRnlaQ0FtSmlCb1lXNWtiR1ZPZFcxaVpYSWdQaUF3S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFJ2SUQwZ1RXRjBhQzV0WVhnb2RHOHNJSEpsWm1WeVpXNWpaVnRvWVc1a2JHVk9kVzFpWlhJZ0xTQXhYU0FySUc5d2RHbHZibk11YldGeVoybHVLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcFppQW9iRzl2YTBadmNuZGhjbVFnSmlZZ2FHRnVaR3hsVG5WdFltVnlJRHdnYzJOdmNHVmZTR0Z1Wkd4bGN5NXNaVzVuZEdnZ0xTQXhLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIUnZJRDBnVFdGMGFDNXRhVzRvZEc4c0lISmxabVZ5Wlc1alpWdG9ZVzVrYkdWT2RXMWlaWElnS3lBeFhTQXRJRzl3ZEdsdmJuTXViV0Z5WjJsdUtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklGUm9aU0JzYVcxcGRDQnZjSFJwYjI0Z2FHRnpJSFJvWlNCdmNIQnZjMmwwWlNCbFptWmxZM1FzSUd4cGJXbDBhVzVuSUdoaGJtUnNaWE1nZEc4Z1lWeHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z2JXRjRhVzExYlNCa2FYTjBZVzVqWlNCbWNtOXRJR0Z1YjNSb1pYSXVJRXhwYldsMElHMTFjM1FnWW1VZ1BpQXdMQ0JoY3lCdmRHaGxjbmRwYzJWY2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SUdoaGJtUnNaWE1nZDI5MWJHUWdZbVVnZFc1dGIzWmhZbXhsTGx4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0hOamIzQmxYMGhoYm1Sc1pYTXViR1Z1WjNSb0lENGdNU0FtSmlCdmNIUnBiMjV6TG14cGJXbDBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHeHZiMnRDWVdOcmQyRnlaQ0FtSmlCb1lXNWtiR1ZPZFcxaVpYSWdQaUF3S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFJ2SUQwZ1RXRjBhQzV0YVc0b2RHOHNJSEpsWm1WeVpXNWpaVnRvWVc1a2JHVk9kVzFpWlhJZ0xTQXhYU0FySUc5d2RHbHZibk11YkdsdGFYUXBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsbUlDaHNiMjlyUm05eWQyRnlaQ0FtSmlCb1lXNWtiR1ZPZFcxaVpYSWdQQ0J6WTI5d1pWOUlZVzVrYkdWekxteGxibWQwYUNBdElERXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RHOGdQU0JOWVhSb0xtMWhlQ2gwYnl3Z2NtVm1aWEpsYm1ObFcyaGhibVJzWlU1MWJXSmxjaUFySURGZElDMGdiM0IwYVc5dWN5NXNhVzFwZENrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0F2THlCVWFHVWdjR0ZrWkdsdVp5QnZjSFJwYjI0Z2EyVmxjSE1nZEdobElHaGhibVJzWlhNZ1lTQmpaWEowWVdsdUlHUnBjM1JoYm1ObElHWnliMjBnZEdobFhHNGdJQ0FnSUNBZ0lDQWdJQ0F2THlCbFpHZGxjeUJ2WmlCMGFHVWdjMnhwWkdWeUxpQlFZV1JrYVc1bklHMTFjM1FnWW1VZ1BpQXdMbHh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLRzl3ZEdsdmJuTXVjR0ZrWkdsdVp5a2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR2xtSUNob1lXNWtiR1ZPZFcxaVpYSWdQVDA5SURBcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZEc4Z1BTQk5ZWFJvTG0xaGVDaDBieXdnYjNCMGFXOXVjeTV3WVdSa2FXNW5XekJkS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnBaaUFvYUdGdVpHeGxUblZ0WW1WeUlEMDlQU0J6WTI5d1pWOUlZVzVrYkdWekxteGxibWQwYUNBdElERXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RHOGdQU0JOWVhSb0xtMXBiaWgwYnl3Z01UQXdJQzBnYjNCMGFXOXVjeTV3WVdSa2FXNW5XekZkS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJSFJ2SUQwZ2MyTnZjR1ZmVTNCbFkzUnlkVzB1WjJWMFUzUmxjQ2gwYnlrN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklFeHBiV2wwSUhCbGNtTmxiblJoWjJVZ2RHOGdkR2hsSURBZ0xTQXhNREFnY21GdVoyVmNiaUFnSUNBZ0lDQWdJQ0FnSUhSdklEMGdiR2x0YVhRb2RHOHBPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQXZMeUJTWlhSMWNtNGdabUZzYzJVZ2FXWWdhR0Z1Wkd4bElHTmhiaWQwSUcxdmRtVmNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaDBieUE5UFQwZ2NtVm1aWEpsYm1ObFcyaGhibVJzWlU1MWJXSmxjbDBnSmlZZ0lXZGxkRlpoYkhWbEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sTzF4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2RHODdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBdkx5QlZjMlZ6SUhOc2FXUmxjaUJ2Y21sbGJuUmhkR2x2YmlCMGJ5QmpjbVZoZEdVZ1ExTlRJSEoxYkdWekxpQmhJRDBnWW1GelpTQjJZV3gxWlR0Y2JpQWdJQ0FnSUNBZ1puVnVZM1JwYjI0Z2FXNVNkV3hsVDNKa1pYSW9kaXdnWVNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZG1GeUlHOGdQU0J2Y0hScGIyNXpMbTl5ZER0Y2JpQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQW9ieUEvSUdFZ09pQjJLU0FySUZ3aUxDQmNJaUFySUNodklEOGdkaUE2SUdFcE8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1RXOTJaWE1nYUdGdVpHeGxLSE1wSUdKNUlHRWdjR1Z5WTJWdWRHRm5aVnh1SUNBZ0lDQWdJQ0F2THlBb1ltOXZiQ3dnSlNCMGJ5QnRiM1psTENCYkpTQjNhR1Z5WlNCb1lXNWtiR1VnYzNSaGNuUmxaQ3dnTGk0dVhTd2dXMmx1WkdWNElHbHVJSE5qYjNCbFgwaGhibVJzWlhNc0lDNHVMbDBwWEc0Z0lDQWdJQ0FnSUdaMWJtTjBhVzl1SUcxdmRtVklZVzVrYkdWektIVndkMkZ5WkN3Z2NISnZjRzl6WVd3c0lHeHZZMkYwYVc5dWN5d2dhR0Z1Wkd4bFRuVnRZbVZ5Y3lrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZG1GeUlIQnliM0J2YzJGc2N5QTlJR3h2WTJGMGFXOXVjeTV6YkdsalpTZ3BPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQjJZWElnWWlBOUlGc2hkWEIzWVhKa0xDQjFjSGRoY21SZE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZG1GeUlHWWdQU0JiZFhCM1lYSmtMQ0FoZFhCM1lYSmtYVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnUTI5d2VTQm9ZVzVrYkdWT2RXMWlaWEp6SUhOdklIZGxJR1J2YmlkMElHTm9ZVzVuWlNCMGFHVWdaR0YwWVhObGRGeHVJQ0FnSUNBZ0lDQWdJQ0FnYUdGdVpHeGxUblZ0WW1WeWN5QTlJR2hoYm1Sc1pVNTFiV0psY25NdWMyeHBZMlVvS1R0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1EyaGxZMnNnZEc4Z2MyVmxJSGRvYVdOb0lHaGhibVJzWlNCcGN5QW5iR1ZoWkdsdVp5Y3VYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QkpaaUIwYUdGMElHOXVaU0JqWVc0bmRDQnRiM1psSUhSb1pTQnpaV052Ym1RZ1kyRnVKM1FnWldsMGFHVnlMbHh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLSFZ3ZDJGeVpDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR2hoYm1Sc1pVNTFiV0psY25NdWNtVjJaWEp6WlNncE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0F2THlCVGRHVndJREU2SUdkbGRDQjBhR1VnYldGNGFXMTFiU0J3WlhKalpXNTBZV2RsSUhSb1lYUWdZVzU1SUc5bUlIUm9aU0JvWVc1a2JHVnpJR05oYmlCdGIzWmxYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9hR0Z1Wkd4bFRuVnRZbVZ5Y3k1c1pXNW5kR2dnUGlBeEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhR0Z1Wkd4bFRuVnRZbVZ5Y3k1bWIzSkZZV05vS0daMWJtTjBhVzl1S0doaGJtUnNaVTUxYldKbGNpd2dieWtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjJZWElnZEc4Z1BTQmphR1ZqYTBoaGJtUnNaVkJ2YzJsMGFXOXVLRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjSEp2Y0c5ellXeHpMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhR0Z1Wkd4bFRuVnRZbVZ5TEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY0hKdmNHOXpZV3h6VzJoaGJtUnNaVTUxYldKbGNsMGdLeUJ3Y205d2IzTmhiQ3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR0piYjEwc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCbVcyOWRMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdabUZzYzJWY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdLVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQXZMeUJUZEc5d0lHbG1JRzl1WlNCdlppQjBhR1VnYUdGdVpHeGxjeUJqWVc0bmRDQnRiM1psTGx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnBaaUFvZEc4Z1BUMDlJR1poYkhObEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQndjbTl3YjNOaGJDQTlJREE3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCd2NtOXdiM05oYkNBOUlIUnZJQzBnY0hKdmNHOXpZV3h6VzJoaGJtUnNaVTUxYldKbGNsMDdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQndjbTl3YjNOaGJITmJhR0Z1Wkd4bFRuVnRZbVZ5WFNBOUlIUnZPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklFbG1JSFZ6YVc1bklHOXVaU0JvWVc1a2JHVXNJR05vWldOcklHSmhZMnQzWVhKa0lFRk9SQ0JtYjNKM1lYSmtYRzRnSUNBZ0lDQWdJQ0FnSUNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JpSUQwZ1ppQTlJRnQwY25WbFhUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJQ0FnZG1GeUlITjBZWFJsSUQwZ1ptRnNjMlU3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SUZOMFpYQWdNam9nVkhKNUlIUnZJSE5sZENCMGFHVWdhR0Z1Wkd4bGN5QjNhWFJvSUhSb1pTQm1iM1Z1WkNCd1pYSmpaVzUwWVdkbFhHNGdJQ0FnSUNBZ0lDQWdJQ0JvWVc1a2JHVk9kVzFpWlhKekxtWnZja1ZoWTJnb1puVnVZM1JwYjI0b2FHRnVaR3hsVG5WdFltVnlMQ0J2S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2MzUmhkR1VnUFNCelpYUklZVzVrYkdVb2FHRnVaR3hsVG5WdFltVnlMQ0JzYjJOaGRHbHZibk5iYUdGdVpHeGxUblZ0WW1WeVhTQXJJSEJ5YjNCdmMyRnNMQ0JpVzI5ZExDQm1XMjlkS1NCOGZDQnpkR0YwWlR0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDBwTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0F2THlCVGRHVndJRE02SUVsbUlHRWdhR0Z1Wkd4bElHMXZkbVZrTENCbWFYSmxJR1YyWlc1MGMxeHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tITjBZWFJsS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FHRnVaR3hsVG5WdFltVnljeTVtYjNKRllXTm9LR1oxYm1OMGFXOXVLR2hoYm1Sc1pVNTFiV0psY2lrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JtYVhKbFJYWmxiblFvWENKMWNHUmhkR1ZjSWl3Z2FHRnVaR3hsVG5WdFltVnlLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1ptbHlaVVYyWlc1MEtGd2ljMnhwWkdWY0lpd2dhR0Z1Wkd4bFRuVnRZbVZ5S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQzh2SUZSaGEyVnpJR0VnWW1GelpTQjJZV3gxWlNCaGJtUWdZVzRnYjJabWMyVjBMaUJVYUdseklHOW1abk5sZENCcGN5QjFjMlZrSUdadmNpQjBhR1VnWTI5dWJtVmpkQ0JpWVhJZ2MybDZaUzVjYmlBZ0lDQWdJQ0FnTHk4Z1NXNGdkR2hsSUdsdWFYUnBZV3dnWkdWemFXZHVJR1p2Y2lCMGFHbHpJR1psWVhSMWNtVXNJSFJvWlNCdmNtbG5hVzRnWld4bGJXVnVkQ0IzWVhNZ01TVWdkMmxrWlM1Y2JpQWdJQ0FnSUNBZ0x5OGdWVzVtYjNKMGRXNWhkR1ZzZVN3Z1lTQnliM1Z1WkdsdVp5QmlkV2NnYVc0Z1EyaHliMjFsSUcxaGEyVnpJR2wwSUdsdGNHOXpjMmxpYkdVZ2RHOGdhVzF3YkdWdFpXNTBJSFJvYVhNZ1ptVmhkSFZ5WlZ4dUlDQWdJQ0FnSUNBdkx5QnBiaUIwYUdseklHMWhibTVsY2pvZ2FIUjBjSE02THk5aWRXZHpMbU5vY205dGFYVnRMbTl5Wnk5d0wyTm9jbTl0YVhWdEwybHpjM1ZsY3k5a1pYUmhhV3cvYVdROU56azRNakl6WEc0Z0lDQWdJQ0FnSUdaMWJtTjBhVzl1SUhSeVlXNXpabTl5YlVScGNtVmpkR2x2YmloaExDQmlLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2IzQjBhVzl1Y3k1a2FYSWdQeUF4TURBZ0xTQmhJQzBnWWlBNklHRTdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBdkx5QlZjR1JoZEdWeklITmpiM0JsWDB4dlkyRjBhVzl1Y3lCaGJtUWdjMk52Y0dWZlZtRnNkV1Z6TENCMWNHUmhkR1Z6SUhacGMzVmhiQ0J6ZEdGMFpWeHVJQ0FnSUNBZ0lDQm1kVzVqZEdsdmJpQjFjR1JoZEdWSVlXNWtiR1ZRYjNOcGRHbHZiaWhvWVc1a2JHVk9kVzFpWlhJc0lIUnZLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQXZMeUJWY0dSaGRHVWdiRzlqWVhScGIyNXpMbHh1SUNBZ0lDQWdJQ0FnSUNBZ2MyTnZjR1ZmVEc5allYUnBiMjV6VzJoaGJtUnNaVTUxYldKbGNsMGdQU0IwYnp0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1EyOXVkbVZ5ZENCMGFHVWdkbUZzZFdVZ2RHOGdkR2hsSUhOc2FXUmxjaUJ6ZEdWd2NHbHVaeTl5WVc1blpTNWNiaUFnSUNBZ0lDQWdJQ0FnSUhOamIzQmxYMVpoYkhWbGMxdG9ZVzVrYkdWT2RXMWlaWEpkSUQwZ2MyTnZjR1ZmVTNCbFkzUnlkVzB1Wm5KdmJWTjBaWEJ3YVc1bktIUnZLVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdkbUZ5SUhKMWJHVWdQU0JjSW5SeVlXNXpiR0YwWlNoY0lpQXJJR2x1VW5Wc1pVOXlaR1Z5S0hSeVlXNXpabTl5YlVScGNtVmpkR2x2YmloMGJ5d2dNQ2tnTFNCelkyOXdaVjlFYVhKUFptWnpaWFFnS3lCY0lpVmNJaXdnWENJd1hDSXBJQ3NnWENJcFhDSTdYRzRnSUNBZ0lDQWdJQ0FnSUNCelkyOXdaVjlJWVc1a2JHVnpXMmhoYm1Sc1pVNTFiV0psY2wwdWMzUjViR1ZiYjNCMGFXOXVjeTUwY21GdWMyWnZjbTFTZFd4bFhTQTlJSEoxYkdVN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUhWd1pHRjBaVU52Ym01bFkzUW9hR0Z1Wkd4bFRuVnRZbVZ5S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFZ3WkdGMFpVTnZibTVsWTNRb2FHRnVaR3hsVG5WdFltVnlJQ3NnTVNrN1hHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0F2THlCSVlXNWtiR1Z6SUdKbFptOXlaU0IwYUdVZ2MyeHBaR1Z5SUcxcFpHUnNaU0JoY21VZ2MzUmhZMnRsWkNCc1lYUmxjaUE5SUdocFoyaGxjaXhjYmlBZ0lDQWdJQ0FnTHk4Z1NHRnVaR3hsY3lCaFpuUmxjaUIwYUdVZ2JXbGtaR3hsSUd4aGRHVnlJR2x6SUd4dmQyVnlYRzRnSUNBZ0lDQWdJQzh2SUZ0Yk4xMGdXemhkSUM0dUxpNHVMaTR1TGk0Z2ZDQXVMaTR1TGk0dUxpNHVJRnMxWFNCYk5GMWNiaUFnSUNBZ0lDQWdablZ1WTNScGIyNGdjMlYwV21sdVpHVjRLQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdjMk52Y0dWZlNHRnVaR3hsVG5WdFltVnljeTVtYjNKRllXTm9LR1oxYm1OMGFXOXVLR2hoYm1Sc1pVNTFiV0psY2lrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIWmhjaUJrYVhJZ1BTQnpZMjl3WlY5TWIyTmhkR2x2Ym5OYmFHRnVaR3hsVG5WdFltVnlYU0ErSURVd0lEOGdMVEVnT2lBeE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIWmhjaUI2U1c1a1pYZ2dQU0F6SUNzZ0tITmpiM0JsWDBoaGJtUnNaWE11YkdWdVozUm9JQ3NnWkdseUlDb2dhR0Z1Wkd4bFRuVnRZbVZ5S1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCelkyOXdaVjlJWVc1a2JHVnpXMmhoYm1Sc1pVNTFiV0psY2wwdWMzUjViR1V1ZWtsdVpHVjRJRDBnZWtsdVpHVjRPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBdkx5QlVaWE4wSUhOMVoyZGxjM1JsWkNCMllXeDFaWE1nWVc1a0lHRndjR3g1SUcxaGNtZHBiaXdnYzNSbGNDNWNiaUFnSUNBZ0lDQWdablZ1WTNScGIyNGdjMlYwU0dGdVpHeGxLR2hoYm1Sc1pVNTFiV0psY2l3Z2RHOHNJR3h2YjJ0Q1lXTnJkMkZ5WkN3Z2JHOXZhMFp2Y25kaGNtUXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIUnZJRDBnWTJobFkydElZVzVrYkdWUWIzTnBkR2x2YmloelkyOXdaVjlNYjJOaGRHbHZibk1zSUdoaGJtUnNaVTUxYldKbGNpd2dkRzhzSUd4dmIydENZV05yZDJGeVpDd2diRzl2YTBadmNuZGhjbVFzSUdaaGJITmxLVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0hSdklEMDlQU0JtWVd4elpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlR0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdkWEJrWVhSbFNHRnVaR3hsVUc5emFYUnBiMjRvYUdGdVpHeGxUblZ0WW1WeUxDQjBieWs3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQjBjblZsTzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdMeThnVlhCa1lYUmxjeUJ6ZEhsc1pTQmhkSFJ5YVdKMWRHVWdabTl5SUdOdmJtNWxZM1FnYm05a1pYTmNiaUFnSUNBZ0lDQWdablZ1WTNScGIyNGdkWEJrWVhSbFEyOXVibVZqZENocGJtUmxlQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnVTJ0cGNDQmpiMjV1WldOMGN5QnpaWFFnZEc4Z1ptRnNjMlZjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2doYzJOdmNHVmZRMjl1Ym1WamRITmJhVzVrWlhoZEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdU8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0IyWVhJZ2JDQTlJREE3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjJZWElnYUNBOUlERXdNRHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0dsdVpHVjRJQ0U5UFNBd0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdiQ0E5SUhOamIzQmxYMHh2WTJGMGFXOXVjMXRwYm1SbGVDQXRJREZkTzF4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvYVc1a1pYZ2dJVDA5SUhOamIzQmxYME52Ym01bFkzUnpMbXhsYm1kMGFDQXRJREVwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCb0lEMGdjMk52Y0dWZlRHOWpZWFJwYjI1elcybHVaR1Y0WFR0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnVjJVZ2RYTmxJSFIzYnlCeWRXeGxjenBjYmlBZ0lDQWdJQ0FnSUNBZ0lDOHZJQ2QwY21GdWMyeGhkR1VuSUhSdklHTm9ZVzVuWlNCMGFHVWdiR1ZtZEM5MGIzQWdiMlptYzJWME8xeHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z0ozTmpZV3hsSnlCMGJ5QmphR0Z1WjJVZ2RHaGxJSGRwWkhSb0lHOW1JSFJvWlNCbGJHVnRaVzUwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnUVhNZ2RHaGxJR1ZzWlcxbGJuUWdhR0Z6SUdFZ2QybGtkR2dnYjJZZ01UQXdKU3dnWVNCMGNtRnVjMnhoZEdsdmJpQnZaaUF4TURBbElHbHpJR1Z4ZFdGc0lIUnZJREV3TUNVZ2IyWWdkR2hsSUhCaGNtVnVkQ0FvTG01dlZXa3RZbUZ6WlNsY2JpQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCamIyNXVaV04wVjJsa2RHZ2dQU0JvSUMwZ2JEdGNiaUFnSUNBZ0lDQWdJQ0FnSUhaaGNpQjBjbUZ1YzJ4aGRHVlNkV3hsSUQwZ1hDSjBjbUZ1YzJ4aGRHVW9YQ0lnS3lCcGJsSjFiR1ZQY21SbGNpaDBjbUZ1YzJadmNtMUVhWEpsWTNScGIyNG9iQ3dnWTI5dWJtVmpkRmRwWkhSb0tTQXJJRndpSlZ3aUxDQmNJakJjSWlrZ0t5QmNJaWxjSWp0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCelkyRnNaVkoxYkdVZ1BTQmNJbk5qWVd4bEtGd2lJQ3NnYVc1U2RXeGxUM0prWlhJb1kyOXVibVZqZEZkcFpIUm9JQzhnTVRBd0xDQmNJakZjSWlrZ0t5QmNJaWxjSWp0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnYzJOdmNHVmZRMjl1Ym1WamRITmJhVzVrWlhoZExuTjBlV3hsVzI5d2RHbHZibk11ZEhKaGJuTm1iM0p0VW5Wc1pWMGdQU0IwY21GdWMyeGhkR1ZTZFd4bElDc2dYQ0lnWENJZ0t5QnpZMkZzWlZKMWJHVTdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBdkx5QlFZWEp6WlhNZ2RtRnNkV1VnY0dGemMyVmtJSFJ2SUM1elpYUWdiV1YwYUc5a0xpQlNaWFIxY201eklHTjFjbkpsYm5RZ2RtRnNkV1VnYVdZZ2JtOTBJSEJoY25ObExXRmliR1V1WEc0Z0lDQWdJQ0FnSUdaMWJtTjBhVzl1SUhKbGMyOXNkbVZVYjFaaGJIVmxLSFJ2TENCb1lXNWtiR1ZPZFcxaVpYSXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDOHZJRk5sZEhScGJtY2dkMmwwYUNCdWRXeHNJR2x1WkdsallYUmxjeUJoYmlBbmFXZHViM0psSnk1Y2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SUVsdWNIVjBkR2x1WnlBblptRnNjMlVuSUdseklHbHVkbUZzYVdRdVhHNGdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb2RHOGdQVDA5SUc1MWJHd2dmSHdnZEc4Z1BUMDlJR1poYkhObElIeDhJSFJ2SUQwOVBTQjFibVJsWm1sdVpXUXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdjMk52Y0dWZlRHOWpZWFJwYjI1elcyaGhibVJzWlU1MWJXSmxjbDA3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDOHZJRWxtSUdFZ1ptOXliV0YwZEdWa0lHNTFiV0psY2lCM1lYTWdjR0Z6YzJWa0xDQmhkSFJsYlhCMElIUnZJR1JsWTI5a1pTQnBkQzVjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdkRzhnUFQwOUlGd2liblZ0WW1WeVhDSXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IwYnlBOUlGTjBjbWx1WnloMGJ5azdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0FnSUhSdklEMGdiM0IwYVc5dWN5NW1iM0p0WVhRdVpuSnZiU2gwYnlrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IwYnlBOUlITmpiM0JsWDFOd1pXTjBjblZ0TG5SdlUzUmxjSEJwYm1jb2RHOHBPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQXZMeUJKWmlCd1lYSnphVzVuSUhSb1pTQnVkVzFpWlhJZ1ptRnBiR1ZrTENCMWMyVWdkR2hsSUdOMWNuSmxiblFnZG1Gc2RXVXVYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9kRzhnUFQwOUlHWmhiSE5sSUh4OElHbHpUbUZPS0hSdktTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQnpZMjl3WlY5TWIyTmhkR2x2Ym5OYmFHRnVaR3hsVG5WdFltVnlYVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSdk8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1UyVjBJSFJvWlNCemJHbGtaWElnZG1Gc2RXVXVYRzRnSUNBZ0lDQWdJR1oxYm1OMGFXOXVJSFpoYkhWbFUyVjBLR2x1Y0hWMExDQm1hWEpsVTJWMFJYWmxiblFwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFpoY2lCMllXeDFaWE1nUFNCaGMwRnljbUY1S0dsdWNIVjBLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIWmhjaUJwYzBsdWFYUWdQU0J6WTI5d1pWOU1iMk5oZEdsdmJuTmJNRjBnUFQwOUlIVnVaR1ZtYVc1bFpEdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdSWFpsYm5RZ1ptbHlaWE1nWW5rZ1pHVm1ZWFZzZEZ4dUlDQWdJQ0FnSUNBZ0lDQWdabWx5WlZObGRFVjJaVzUwSUQwZ1ptbHlaVk5sZEVWMlpXNTBJRDA5UFNCMWJtUmxabWx1WldRZ1B5QjBjblZsSURvZ0lTRm1hWEpsVTJWMFJYWmxiblE3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SUVGdWFXMWhkR2x2YmlCcGN5QnZjSFJwYjI1aGJDNWNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklFMWhhMlVnYzNWeVpTQjBhR1VnYVc1cGRHbGhiQ0IyWVd4MVpYTWdkMlZ5WlNCelpYUWdZbVZtYjNKbElIVnphVzVuSUdGdWFXMWhkR1ZrSUhCc1lXTmxiV1Z1ZEM1Y2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNodmNIUnBiMjV6TG1GdWFXMWhkR1VnSmlZZ0lXbHpTVzVwZENBbUppQnpZMjl3WlY5VGFHOTFiR1JCYm1sdFlYUmxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWVdSa1EyeGhjM05HYjNJb2MyTnZjR1ZmVkdGeVoyVjBMQ0J2Y0hScGIyNXpMbU56YzBOc1lYTnpaWE11ZEdGd0xDQnZjSFJwYjI1ekxtRnVhVzFoZEdsdmJrUjFjbUYwYVc5dUtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1JtbHljM1FnY0dGemN5d2dkMmwwYUc5MWRDQnNiMjlyUVdobFlXUWdZblYwSUhkcGRHZ2diRzl2YTBKaFkydDNZWEprTGlCV1lXeDFaWE1nWVhKbElITmxkQ0JtY205dElHeGxablFnZEc4Z2NtbG5hSFF1WEc0Z0lDQWdJQ0FnSUNBZ0lDQnpZMjl3WlY5SVlXNWtiR1ZPZFcxaVpYSnpMbVp2Y2tWaFkyZ29ablZ1WTNScGIyNG9hR0Z1Wkd4bFRuVnRZbVZ5S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2MyVjBTR0Z1Wkd4bEtHaGhibVJzWlU1MWJXSmxjaXdnY21WemIyeDJaVlJ2Vm1Gc2RXVW9kbUZzZFdWelcyaGhibVJzWlU1MWJXSmxjbDBzSUdoaGJtUnNaVTUxYldKbGNpa3NJSFJ5ZFdVc0lHWmhiSE5sS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDBwTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0F2THlCVFpXTnZibVFnY0dGemN5NGdUbTkzSUhSb1lYUWdZV3hzSUdKaGMyVWdkbUZzZFdWeklHRnlaU0J6WlhRc0lHRndjR3g1SUdOdmJuTjBjbUZwYm5SelhHNGdJQ0FnSUNBZ0lDQWdJQ0J6WTI5d1pWOUlZVzVrYkdWT2RXMWlaWEp6TG1admNrVmhZMmdvWm5WdVkzUnBiMjRvYUdGdVpHeGxUblZ0WW1WeUtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjMlYwU0dGdVpHeGxLR2hoYm1Sc1pVNTFiV0psY2l3Z2MyTnZjR1ZmVEc5allYUnBiMjV6VzJoaGJtUnNaVTUxYldKbGNsMHNJSFJ5ZFdVc0lIUnlkV1VwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdmU2s3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJSE5sZEZwcGJtUmxlQ2dwTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0J6WTI5d1pWOUlZVzVrYkdWT2RXMWlaWEp6TG1admNrVmhZMmdvWm5WdVkzUnBiMjRvYUdGdVpHeGxUblZ0WW1WeUtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdabWx5WlVWMlpXNTBLRndpZFhCa1lYUmxYQ0lzSUdoaGJtUnNaVTUxYldKbGNpazdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlCR2FYSmxJSFJvWlNCbGRtVnVkQ0J2Ym14NUlHWnZjaUJvWVc1a2JHVnpJSFJvWVhRZ2NtVmpaV2wyWldRZ1lTQnVaWGNnZG1Gc2RXVXNJR0Z6SUhCbGNpQWpOVGM1WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tIWmhiSFZsYzF0b1lXNWtiR1ZPZFcxaVpYSmRJQ0U5UFNCdWRXeHNJQ1ltSUdacGNtVlRaWFJGZG1WdWRDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCbWFYSmxSWFpsYm5Rb1hDSnpaWFJjSWl3Z2FHRnVaR3hsVG5WdFltVnlLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlLVHRjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDOHZJRkpsYzJWMElITnNhV1JsY2lCMGJ5QnBibWwwYVdGc0lIWmhiSFZsYzF4dUlDQWdJQ0FnSUNCbWRXNWpkR2x2YmlCMllXeDFaVkpsYzJWMEtHWnBjbVZUWlhSRmRtVnVkQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkbUZzZFdWVFpYUW9iM0IwYVc5dWN5NXpkR0Z5ZEN3Z1ptbHlaVk5sZEVWMlpXNTBLVHRjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDOHZJRk5sZENCMllXeDFaU0JtYjNJZ1lTQnphVzVuYkdVZ2FHRnVaR3hsWEc0Z0lDQWdJQ0FnSUdaMWJtTjBhVzl1SUhaaGJIVmxVMlYwU0dGdVpHeGxLR2hoYm1Sc1pVNTFiV0psY2l3Z2RtRnNkV1VzSUdacGNtVlRaWFJGZG1WdWRDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RtRnlJSFpoYkhWbGN5QTlJRnRkTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0F2THlCRmJuTjFjbVVnYm5WdFpYSnBZeUJwYm5CMWRGeHVJQ0FnSUNBZ0lDQWdJQ0FnYUdGdVpHeGxUblZ0WW1WeUlEMGdUblZ0WW1WeUtHaGhibVJzWlU1MWJXSmxjaWs3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNnaEtHaGhibVJzWlU1MWJXSmxjaUErUFNBd0lDWW1JR2hoYm1Sc1pVNTFiV0psY2lBOElITmpiM0JsWDBoaGJtUnNaVTUxYldKbGNuTXViR1Z1WjNSb0tTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGNJbTV2VldsVGJHbGtaWElnS0Z3aUlDc2dWa1ZTVTBsUFRpQXJJRndpS1RvZ2FXNTJZV3hwWkNCb1lXNWtiR1VnYm5WdFltVnlMQ0JuYjNRNklGd2lJQ3NnYUdGdVpHeGxUblZ0WW1WeUtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJQ0FnWm05eUlDaDJZWElnYVNBOUlEQTdJR2tnUENCelkyOXdaVjlJWVc1a2JHVk9kVzFpWlhKekxteGxibWQwYURzZ2FTc3JLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZG1Gc2RXVnpXMmxkSUQwZ2JuVnNiRHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUNBZ2RtRnNkV1Z6VzJoaGJtUnNaVTUxYldKbGNsMGdQU0IyWVd4MVpUdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ2RtRnNkV1ZUWlhRb2RtRnNkV1Z6TENCbWFYSmxVMlYwUlhabGJuUXBPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdSMlYwSUhSb1pTQnpiR2xrWlhJZ2RtRnNkV1V1WEc0Z0lDQWdJQ0FnSUdaMWJtTjBhVzl1SUhaaGJIVmxSMlYwS0NrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZG1GeUlIWmhiSFZsY3lBOUlITmpiM0JsWDFaaGJIVmxjeTV0WVhBb2IzQjBhVzl1Y3k1bWIzSnRZWFF1ZEc4cE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QkpaaUJ2Ym14NUlHOXVaU0JvWVc1a2JHVWdhWE1nZFhObFpDd2djbVYwZFhKdUlHRWdjMmx1WjJ4bElIWmhiSFZsTGx4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0haaGJIVmxjeTVzWlc1bmRHZ2dQVDA5SURFcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2RtRnNkV1Z6V3pCZE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdkbUZzZFdWek8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1VtVnRiM1psY3lCamJHRnpjMlZ6SUdaeWIyMGdkR2hsSUhKdmIzUWdZVzVrSUdWdGNIUnBaWE1nYVhRdVhHNGdJQ0FnSUNBZ0lHWjFibU4wYVc5dUlHUmxjM1J5YjNrb0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCbWIzSWdLSFpoY2lCclpYa2dhVzRnYjNCMGFXOXVjeTVqYzNORGJHRnpjMlZ6S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLQ0Z2Y0hScGIyNXpMbU56YzBOc1lYTnpaWE11YUdGelQzZHVVSEp2Y0dWeWRIa29hMlY1S1NrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JqYjI1MGFXNTFaVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WdGIzWmxRMnhoYzNNb2MyTnZjR1ZmVkdGeVoyVjBMQ0J2Y0hScGIyNXpMbU56YzBOc1lYTnpaWE5iYTJWNVhTazdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0FnSUhkb2FXeGxJQ2h6WTI5d1pWOVVZWEpuWlhRdVptbHljM1JEYUdsc1pDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSE5qYjNCbFgxUmhjbWRsZEM1eVpXMXZkbVZEYUdsc1pDaHpZMjl3WlY5VVlYSm5aWFF1Wm1seWMzUkRhR2xzWkNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJR1JsYkdWMFpTQnpZMjl3WlY5VVlYSm5aWFF1Ym05VmFWTnNhV1JsY2p0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJR1oxYm1OMGFXOXVJR2RsZEU1bGVIUlRkR1Z3YzBadmNraGhibVJzWlNob1lXNWtiR1ZPZFcxaVpYSXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIWmhjaUJzYjJOaGRHbHZiaUE5SUhOamIzQmxYMHh2WTJGMGFXOXVjMXRvWVc1a2JHVk9kVzFpWlhKZE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZG1GeUlHNWxZWEppZVZOMFpYQnpJRDBnYzJOdmNHVmZVM0JsWTNSeWRXMHVaMlYwVG1WaGNtSjVVM1JsY0hNb2JHOWpZWFJwYjI0cE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZG1GeUlIWmhiSFZsSUQwZ2MyTnZjR1ZmVm1Gc2RXVnpXMmhoYm1Sc1pVNTFiV0psY2wwN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IyWVhJZ2FXNWpjbVZ0Wlc1MElEMGdibVZoY21KNVUzUmxjSE11ZEdocGMxTjBaWEF1YzNSbGNEdGNiaUFnSUNBZ0lDQWdJQ0FnSUhaaGNpQmtaV055WlcxbGJuUWdQU0J1ZFd4c08xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QkpaaUIwYUdVZ2JtVjRkQ0IyWVd4MVpTQnBiaUIwYUdseklITjBaWEFnYlc5MlpYTWdhVzUwYnlCMGFHVWdibVY0ZENCemRHVndMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdkR2hsSUdsdVkzSmxiV1Z1ZENCcGN5QjBhR1VnYzNSaGNuUWdiMllnZEdobElHNWxlSFFnYzNSbGNDQXRJSFJvWlNCamRYSnlaVzUwSUhaaGJIVmxYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9hVzVqY21WdFpXNTBJQ0U5UFNCbVlXeHpaU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsbUlDaDJZV3gxWlNBcklHbHVZM0psYldWdWRDQStJRzVsWVhKaWVWTjBaWEJ6TG5OMFpYQkJablJsY2k1emRHRnlkRlpoYkhWbEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsdVkzSmxiV1Z1ZENBOUlHNWxZWEppZVZOMFpYQnpMbk4wWlhCQlpuUmxjaTV6ZEdGeWRGWmhiSFZsSUMwZ2RtRnNkV1U3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQXZMeUJKWmlCMGFHVWdkbUZzZFdVZ2FYTWdZbVY1YjI1a0lIUm9aU0J6ZEdGeWRHbHVaeUJ3YjJsdWRGeHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tIWmhiSFZsSUQ0Z2JtVmhjbUo1VTNSbGNITXVkR2hwYzFOMFpYQXVjM1JoY25SV1lXeDFaU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdSbFkzSmxiV1Z1ZENBOUlHNWxZWEppZVZOMFpYQnpMblJvYVhOVGRHVndMbk4wWlhBN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5SUdWc2MyVWdhV1lnS0c1bFlYSmllVk4wWlhCekxuTjBaWEJDWldadmNtVXVjM1JsY0NBOVBUMGdabUZzYzJVcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmtaV055WlcxbGJuUWdQU0JtWVd4elpUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1NXWWdZU0JvWVc1a2JHVWdhWE1nWVhRZ2RHaGxJSE4wWVhKMElHOW1JR0VnYzNSbGNDd2dhWFFnWVd4M1lYbHpJSE4wWlhCeklHSmhZMnNnYVc1MGJ5QjBhR1VnY0hKbGRtbHZkWE1nYzNSbGNDQm1hWEp6ZEZ4dUlDQWdJQ0FnSUNBZ0lDQWdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1pHVmpjbVZ0Wlc1MElEMGdkbUZzZFdVZ0xTQnVaV0Z5WW5sVGRHVndjeTV6ZEdWd1FtVm1iM0psTG1ocFoyaGxjM1JUZEdWd08xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0F2THlCT2IzY3NJR2xtSUdGMElIUm9aU0J6Ykdsa1pYSWdaV1JuWlhNc0lIUm9aWEpsSUdseklHNXZJR2x1TDJSbFkzSmxiV1Z1ZEZ4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0d4dlkyRjBhVzl1SUQwOVBTQXhNREFwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcGJtTnlaVzFsYm5RZ1BTQnVkV3hzTzF4dUlDQWdJQ0FnSUNBZ0lDQWdmU0JsYkhObElHbG1JQ2hzYjJOaGRHbHZiaUE5UFQwZ01Da2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR1JsWTNKbGJXVnVkQ0E5SUc1MWJHdzdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklFRnpJSEJsY2lBak16a3hMQ0IwYUdVZ1kyOXRjR0Z5YVhOdmJpQm1iM0lnZEdobElHUmxZM0psYldWdWRDQnpkR1Z3SUdOaGJpQm9ZWFpsSUhOdmJXVWdjbTkxYm1ScGJtY2dhWE56ZFdWekxseHVJQ0FnSUNBZ0lDQWdJQ0FnZG1GeUlITjBaWEJFWldOcGJXRnNjeUE5SUhOamIzQmxYMU53WldOMGNuVnRMbU52ZFc1MFUzUmxjRVJsWTJsdFlXeHpLQ2s3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SUZKdmRXNWtJSEJsY2lBak16a3hYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9hVzVqY21WdFpXNTBJQ0U5UFNCdWRXeHNJQ1ltSUdsdVkzSmxiV1Z1ZENBaFBUMGdabUZzYzJVcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnBibU55WlcxbGJuUWdQU0JPZFcxaVpYSW9hVzVqY21WdFpXNTBMblJ2Um1sNFpXUW9jM1JsY0VSbFkybHRZV3h6S1NrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNoa1pXTnlaVzFsYm5RZ0lUMDlJRzUxYkd3Z0ppWWdaR1ZqY21WdFpXNTBJQ0U5UFNCbVlXeHpaU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdSbFkzSmxiV1Z1ZENBOUlFNTFiV0psY2loa1pXTnlaVzFsYm5RdWRHOUdhWGhsWkNoemRHVndSR1ZqYVcxaGJITXBLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUZ0a1pXTnlaVzFsYm5Rc0lHbHVZM0psYldWdWRGMDdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBdkx5QkhaWFFnZEdobElHTjFjbkpsYm5RZ2MzUmxjQ0J6YVhwbElHWnZjaUIwYUdVZ2MyeHBaR1Z5TGx4dUlDQWdJQ0FnSUNCbWRXNWpkR2x2YmlCblpYUk9aWGgwVTNSbGNITW9LU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2MyTnZjR1ZmU0dGdVpHeGxUblZ0WW1WeWN5NXRZWEFvWjJWMFRtVjRkRk4wWlhCelJtOXlTR0Z1Wkd4bEtUdGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUM4dklGVndaR0YwWldGaWJHVTZJRzFoY21kcGJpd2diR2x0YVhRc0lIQmhaR1JwYm1jc0lITjBaWEFzSUhKaGJtZGxMQ0JoYm1sdFlYUmxMQ0J6Ym1Gd1hHNGdJQ0FnSUNBZ0lHWjFibU4wYVc5dUlIVndaR0YwWlU5d2RHbHZibk1vYjNCMGFXOXVjMVJ2VlhCa1lYUmxMQ0JtYVhKbFUyVjBSWFpsYm5RcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklGTndaV04wY25WdElHbHpJR055WldGMFpXUWdkWE5wYm1jZ2RHaGxJSEpoYm1kbExDQnpibUZ3TENCa2FYSmxZM1JwYjI0Z1lXNWtJSE4wWlhBZ2IzQjBhVzl1Y3k1Y2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SUNkemJtRndKeUJoYm1RZ0ozTjBaWEFuSUdOaGJpQmlaU0IxY0dSaGRHVmtMbHh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdTV1lnSjNOdVlYQW5JR0Z1WkNBbmMzUmxjQ2NnWVhKbElHNXZkQ0J3WVhOelpXUXNJSFJvWlhrZ2MyaHZkV3hrSUhKbGJXRnBiaUIxYm1Ob1lXNW5aV1F1WEc0Z0lDQWdJQ0FnSUNBZ0lDQjJZWElnZGlBOUlIWmhiSFZsUjJWMEtDazdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lIWmhjaUIxY0dSaGRHVkJZbXhsSUQwZ1cxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lGd2liV0Z5WjJsdVhDSXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdYQ0pzYVcxcGRGd2lMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRndpY0dGa1pHbHVaMXdpTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUZ3aWNtRnVaMlZjSWl4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCY0ltRnVhVzFoZEdWY0lpeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmNJbk51WVhCY0lpeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmNJbk4wWlhCY0lpeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmNJbVp2Y20xaGRGd2lMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRndpY0dsd2Mxd2lMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRndpZEc5dmJIUnBjSE5jSWx4dUlDQWdJQ0FnSUNBZ0lDQWdYVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnVDI1c2VTQmphR0Z1WjJVZ2IzQjBhVzl1Y3lCMGFHRjBJSGRsSjNKbElHRmpkSFZoYkd4NUlIQmhjM05sWkNCMGJ5QjFjR1JoZEdVdVhHNGdJQ0FnSUNBZ0lDQWdJQ0IxY0dSaGRHVkJZbXhsTG1admNrVmhZMmdvWm5WdVkzUnBiMjRvYm1GdFpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQzh2SUVOb1pXTnJJR1p2Y2lCMWJtUmxabWx1WldRdUlHNTFiR3dnY21WdGIzWmxjeUIwYUdVZ2RtRnNkV1V1WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHOXdkR2x2Ym5OVWIxVndaR0YwWlZ0dVlXMWxYU0FoUFQwZ2RXNWtaV1pwYm1Wa0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUc5eWFXZHBibUZzVDNCMGFXOXVjMXR1WVcxbFhTQTlJRzl3ZEdsdmJuTlViMVZ3WkdGMFpWdHVZVzFsWFR0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdJQ0I5S1R0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnZG1GeUlHNWxkMDl3ZEdsdmJuTWdQU0IwWlhOMFQzQjBhVzl1Y3lodmNtbG5hVzVoYkU5d2RHbHZibk1wTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0F2THlCTWIyRmtJRzVsZHlCdmNIUnBiMjV6SUdsdWRHOGdkR2hsSUhOc2FXUmxjaUJ6ZEdGMFpWeHVJQ0FnSUNBZ0lDQWdJQ0FnZFhCa1lYUmxRV0pzWlM1bWIzSkZZV05vS0daMWJtTjBhVzl1S0c1aGJXVXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb2IzQjBhVzl1YzFSdlZYQmtZWFJsVzI1aGJXVmRJQ0U5UFNCMWJtUmxabWx1WldRcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYjNCMGFXOXVjMXR1WVcxbFhTQTlJRzVsZDA5d2RHbHZibk5iYm1GdFpWMDdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTazdYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lITmpiM0JsWDFOd1pXTjBjblZ0SUQwZ2JtVjNUM0IwYVc5dWN5NXpjR1ZqZEhKMWJUdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdUR2x0YVhRc0lHMWhjbWRwYmlCaGJtUWdjR0ZrWkdsdVp5QmtaWEJsYm1RZ2IyNGdkR2hsSUhOd1pXTjBjblZ0SUdKMWRDQmhjbVVnYzNSdmNtVmtJRzkxZEhOcFpHVWdiMllnYVhRdUlDZ2pOamMzS1Z4dUlDQWdJQ0FnSUNBZ0lDQWdiM0IwYVc5dWN5NXRZWEpuYVc0Z1BTQnVaWGRQY0hScGIyNXpMbTFoY21kcGJqdGNiaUFnSUNBZ0lDQWdJQ0FnSUc5d2RHbHZibk11YkdsdGFYUWdQU0J1WlhkUGNIUnBiMjV6TG14cGJXbDBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2IzQjBhVzl1Y3k1d1lXUmthVzVuSUQwZ2JtVjNUM0IwYVc5dWN5NXdZV1JrYVc1bk8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QlZjR1JoZEdVZ2NHbHdjeXdnY21WdGIzWmxjeUJsZUdsemRHbHVaeTVjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2h2Y0hScGIyNXpMbkJwY0hNcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQndhWEJ6S0c5d2RHbHZibk11Y0dsd2N5azdYRzRnSUNBZ0lDQWdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGJXOTJaVkJwY0hNb0tUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1ZYQmtZWFJsSUhSdmIyeDBhWEJ6TENCeVpXMXZkbVZ6SUdWNGFYTjBhVzVuTGx4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0c5d2RHbHZibk11ZEc5dmJIUnBjSE1wSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMGIyOXNkR2x3Y3lncE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J5WlcxdmRtVlViMjlzZEdsd2N5Z3BPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QkpiblpoYkdsa1lYUmxJSFJvWlNCamRYSnlaVzUwSUhCdmMybDBhVzl1YVc1bklITnZJSFpoYkhWbFUyVjBJR1p2Y21ObGN5QmhiaUIxY0dSaGRHVXVYRzRnSUNBZ0lDQWdJQ0FnSUNCelkyOXdaVjlNYjJOaGRHbHZibk1nUFNCYlhUdGNiaUFnSUNBZ0lDQWdJQ0FnSUhaaGJIVmxVMlYwS0c5d2RHbHZibk5VYjFWd1pHRjBaUzV6ZEdGeWRDQjhmQ0IyTENCbWFYSmxVMlYwUlhabGJuUXBPMXh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdTVzVwZEdsaGJHbDZZWFJwYjI0Z2MzUmxjSE5jYmlBZ0lDQWdJQ0FnWm5WdVkzUnBiMjRnYzJWMGRYQlRiR2xrWlhJb0tTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QkRjbVZoZEdVZ2RHaGxJR0poYzJVZ1pXeGxiV1Z1ZEN3Z2FXNXBkR2xoYkdsNlpTQklWRTFNSUdGdVpDQnpaWFFnWTJ4aGMzTmxjeTVjYmlBZ0lDQWdJQ0FnSUNBZ0lDOHZJRUZrWkNCb1lXNWtiR1Z6SUdGdVpDQmpiMjV1WldOMElHVnNaVzFsYm5SekxseHVJQ0FnSUNBZ0lDQWdJQ0FnYzJOdmNHVmZRbUZ6WlNBOUlHRmtaRk5zYVdSbGNpaHpZMjl3WlY5VVlYSm5aWFFwTzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0JoWkdSRmJHVnRaVzUwY3lodmNIUnBiMjV6TG1OdmJtNWxZM1FzSUhOamIzQmxYMEpoYzJVcE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QkJkSFJoWTJnZ2RYTmxjaUJsZG1WdWRITXVYRzRnSUNBZ0lDQWdJQ0FnSUNCaWFXNWtVMnhwWkdWeVJYWmxiblJ6S0c5d2RHbHZibk11WlhabGJuUnpLVHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnVlhObElIUm9aU0J3ZFdKc2FXTWdkbUZzZFdVZ2JXVjBhRzlrSUhSdklITmxkQ0IwYUdVZ2MzUmhjblFnZG1Gc2RXVnpMbHh1SUNBZ0lDQWdJQ0FnSUNBZ2RtRnNkV1ZUWlhRb2IzQjBhVzl1Y3k1emRHRnlkQ2s3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNodmNIUnBiMjV6TG5CcGNITXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J3YVhCektHOXdkR2x2Ym5NdWNHbHdjeWs3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2h2Y0hScGIyNXpMblJ2YjJ4MGFYQnpLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZEc5dmJIUnBjSE1vS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdZWEpwWVNncE8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnYzJWMGRYQlRiR2xrWlhJb0tUdGNibHh1SUNBZ0lDQWdJQ0F2THlCdWIybHVjM0JsWTNScGIyNGdTbE5WYm5WelpXUkhiRzlpWVd4VGVXMWliMnh6WEc0Z0lDQWdJQ0FnSUhOamIzQmxYMU5sYkdZZ1BTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCa1pYTjBjbTk1T2lCa1pYTjBjbTk1TEZ4dUlDQWdJQ0FnSUNBZ0lDQWdjM1JsY0hNNklHZGxkRTVsZUhSVGRHVndjeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lHOXVPaUJpYVc1a1JYWmxiblFzWEc0Z0lDQWdJQ0FnSUNBZ0lDQnZabVk2SUhKbGJXOTJaVVYyWlc1MExGeHVJQ0FnSUNBZ0lDQWdJQ0FnWjJWME9pQjJZV3gxWlVkbGRDeGNiaUFnSUNBZ0lDQWdJQ0FnSUhObGREb2dkbUZzZFdWVFpYUXNYRzRnSUNBZ0lDQWdJQ0FnSUNCelpYUklZVzVrYkdVNklIWmhiSFZsVTJWMFNHRnVaR3hsTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdjbVZ6WlhRNklIWmhiSFZsVW1WelpYUXNYRzRnSUNBZ0lDQWdJQ0FnSUNBdkx5QkZlSEJ2YzJWa0lHWnZjaUIxYm1sMElIUmxjM1JwYm1jc0lHUnZiaWQwSUhWelpTQjBhR2x6SUdsdUlIbHZkWElnWVhCd2JHbGpZWFJwYjI0dVhHNGdJQ0FnSUNBZ0lDQWdJQ0JmWDIxdmRtVklZVzVrYkdWek9pQm1kVzVqZEdsdmJpaGhMQ0JpTENCaktTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdiVzkyWlVoaGJtUnNaWE1vWVN3Z1lpd2djMk52Y0dWZlRHOWpZWFJwYjI1ekxDQmpLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMHNYRzRnSUNBZ0lDQWdJQ0FnSUNCdmNIUnBiMjV6T2lCdmNtbG5hVzVoYkU5d2RHbHZibk1zSUM4dklFbHpjM1ZsSUNNMk1EQXNJQ00yTnpoY2JpQWdJQ0FnSUNBZ0lDQWdJSFZ3WkdGMFpVOXdkR2x2Ym5NNklIVndaR0YwWlU5d2RHbHZibk1zWEc0Z0lDQWdJQ0FnSUNBZ0lDQjBZWEpuWlhRNklITmpiM0JsWDFSaGNtZGxkQ3dnTHk4Z1NYTnpkV1VnSXpVNU4xeHVJQ0FnSUNBZ0lDQWdJQ0FnY21WdGIzWmxVR2x3Y3pvZ2NtVnRiM1psVUdsd2N5eGNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGJXOTJaVlJ2YjJ4MGFYQnpPaUJ5WlcxdmRtVlViMjlzZEdsd2N5eGNiaUFnSUNBZ0lDQWdJQ0FnSUhCcGNITTZJSEJwY0hNZ0x5OGdTWE56ZFdVZ0l6VTVORnh1SUNBZ0lDQWdJQ0I5TzF4dVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCelkyOXdaVjlUWld4bU8xeHVJQ0FnSUgxY2JseHVJQ0FnSUM4dklGSjFiaUIwYUdVZ2MzUmhibVJoY21RZ2FXNXBkR2xoYkdsNlpYSmNiaUFnSUNCbWRXNWpkR2x2YmlCcGJtbDBhV0ZzYVhwbEtIUmhjbWRsZEN3Z2IzSnBaMmx1WVd4UGNIUnBiMjV6S1NCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2doZEdGeVoyVjBJSHg4SUNGMFlYSm5aWFF1Ym05a1pVNWhiV1VwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGNJbTV2VldsVGJHbGtaWElnS0Z3aUlDc2dWa1ZTVTBsUFRpQXJJRndpS1RvZ1kzSmxZWFJsSUhKbGNYVnBjbVZ6SUdFZ2MybHVaMnhsSUdWc1pXMWxiblFzSUdkdmREb2dYQ0lnS3lCMFlYSm5aWFFwTzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdMeThnVkdoeWIzY2dZVzRnWlhKeWIzSWdhV1lnZEdobElITnNhV1JsY2lCM1lYTWdZV3h5WldGa2VTQnBibWwwYVdGc2FYcGxaQzVjYmlBZ0lDQWdJQ0FnYVdZZ0tIUmhjbWRsZEM1dWIxVnBVMnhwWkdWeUtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvWENKdWIxVnBVMnhwWkdWeUlDaGNJaUFySUZaRlVsTkpUMDRnS3lCY0lpazZJRk5zYVdSbGNpQjNZWE1nWVd4eVpXRmtlU0JwYm1sMGFXRnNhWHBsWkM1Y0lpazdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBdkx5QlVaWE4wSUhSb1pTQnZjSFJwYjI1eklHRnVaQ0JqY21WaGRHVWdkR2hsSUhOc2FXUmxjaUJsYm5acGNtOXViV1Z1ZER0Y2JpQWdJQ0FnSUNBZ2RtRnlJRzl3ZEdsdmJuTWdQU0IwWlhOMFQzQjBhVzl1Y3lodmNtbG5hVzVoYkU5d2RHbHZibk1zSUhSaGNtZGxkQ2s3WEc0Z0lDQWdJQ0FnSUhaaGNpQmhjR2tnUFNCelkyOXdaU2gwWVhKblpYUXNJRzl3ZEdsdmJuTXNJRzl5YVdkcGJtRnNUM0IwYVc5dWN5azdYRzVjYmlBZ0lDQWdJQ0FnZEdGeVoyVjBMbTV2VldsVGJHbGtaWElnUFNCaGNHazdYRzVjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR0Z3YVR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCVmMyVWdZVzRnYjJKcVpXTjBJR2x1YzNSbFlXUWdiMllnWVNCbWRXNWpkR2x2YmlCbWIzSWdablYwZFhKbElHVjRjR0Z1WkdGaWFXeHBkSGs3WEc0Z0lDQWdjbVYwZFhKdUlIdGNiaUFnSUNBZ0lDQWdMeThnUlhod2IzTmxaQ0JtYjNJZ2RXNXBkQ0IwWlhOMGFXNW5MQ0JrYjI0bmRDQjFjMlVnZEdocGN5QnBiaUI1YjNWeUlHRndjR3hwWTJGMGFXOXVMbHh1SUNBZ0lDQWdJQ0JmWDNOd1pXTjBjblZ0T2lCVGNHVmpkSEoxYlN4Y2JpQWdJQ0FnSUNBZ2RtVnljMmx2YmpvZ1ZrVlNVMGxQVGl4Y2JpQWdJQ0FnSUNBZ1kzSmxZWFJsT2lCcGJtbDBhV0ZzYVhwbFhHNGdJQ0FnZlR0Y2JuMHBPMXh1SWl3aWFXMXdiM0owSUh0cGMwVkVSMFVzSUdselJtbHlaV1p2ZUN3Z2FYTkpSVEV3TENCcGMwbEZNVEVzSUUxUlZVVlNXWDBnWm5KdmJTQmNJaTR2WTI5dGJXOXVYQ0k3WEc1Y2JtVjRjRzl5ZENCamIyNXpkQ0JoYm1sdFlYUmxRV0p2ZFhSUGJrMXZkWE5sVFc5MlpTQTlJQ2dwUFQ0Z2UxeHVJQ0FnSUd4bGRDQnRiM1psYldWdWRGTjBjbVZ1WjNSb0lEMGdNalU3WEc0Z0lDQWdiR1YwSUdobGFXZG9kQ0E5SUcxdmRtVnRaVzUwVTNSeVpXNW5kR2dnTHlCM2FXNWtiM2N1YVc1dVpYSlhhV1IwYUR0Y2JpQWdJQ0JzWlhRZ2QybGtkR2dnUFNCdGIzWmxiV1Z1ZEZOMGNtVnVaM1JvSUM4Z2QybHVaRzkzTG1sdWJtVnlTR1ZwWjJoME8xeHVYRzRnSUNBZ2FXWWdLQ2hwYzBacGNtVm1iM2dnZkh3Z2FYTkZSRWRGSUh4OElHbHpTVVV4TUNCOGZDQnBjMGxGTVRFcElDWW1JR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb0p5NWhZbTkxZEY5ZmFXMWhaMlVuS1NsY2JpQWdJQ0FnSUNBZ1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZja0ZzYkNnbkxtRmliM1YwWDE5cGJXRm5aU2NwTG1admNrVmhZMmdvWlNBOVBpQmxMbU5zWVhOelRHbHpkQzVoWkdRb0oyNXZibEJoZEdnbktTazdYRzVjYmlBZ0lDQnNaWFFnWVNBOUlHWmhiSE5sT3lBdkx5QjBieUJ5WlcxdmRtVmNibHh1SUNBZ0lHbG1JQ2doVFZGVlJWSlpMbTFoZEdOb1pYTWdKaVlnWVNrZ2UxeHVJQ0FnSUNBZ0lDQjNhVzVrYjNjdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnbmJXOTFjMlZ0YjNabEp5d2dLR1VwUFQ0Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnYkdWMElIQmhaMlZZSUQwZ1pTNXdZV2RsV0NBdElDaDNhVzVrYjNjdWFXNXVaWEpYYVdSMGFDQXZJRElwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdiR1YwSUhCaFoyVlpJRDBnWlM1d1lXZGxXU0F0SUNoM2FXNWtiM2N1YVc1dVpYSklaV2xuYUhRZ0x5QXlLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHeGxkQ0J1WlhkMllXeDFaVmdnUFNCM2FXUjBhQ0FxSUhCaFoyVllJQ29nTFRFZ0xTQXlOVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHeGxkQ0J1WlhkMllXeDFaVmtnUFNCb1pXbG5hSFFnS2lCd1lXZGxXU0FxSUMweElDMGdOVEE3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0NjdVlXSnZkWFJmWDJsdFlXZGxKeWt1YzNSNWJHVXVZbUZqYTJkeWIzVnVaRkJ2YzJsMGFXOXVJRDBnWUdOaGJHTW9OVEFsSUNzZ0pIdHVaWGQyWVd4MVpWaDljSGdwSUdOaGJHTW9OVEFsSUNzZ0pIdHVaWGQyWVd4MVpWbDljSGdwWUR0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNrRnNiQ2duTG1GaWIzVjBYMTlqYVhKamJHVW5LUzVtYjNKRllXTm9LQ2hsTEdrcFBUNGdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR3hsZENCNElEMGdkMmxrZEdnZ0tpQndZV2RsV0NBcUlDMHhJQzBnS0RJMUlDc2dhU28xS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCbExuTjBlV3hsTG5SeVlXNXpabTl5YlNBOUlHQnliM1JoZEdVb0pIdDRmV1JsWnlrZ0pIdGxMbWRsZEVGMGRISnBZblYwWlNnblpHRjBZUzF6YTJWM0p5bDlZRHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMHBPMXh1SUNBZ0lDQWdJQ0I5S1R0Y2JpQWdJQ0I5WEc1OU95SXNJbWx0Y0c5eWRDQjdjMjF2YjNSb1UyTnliMnhzTENCM2FXNWtiM2RUWTNKdmJHeDlJR1p5YjIwZ0p5NHZZMjl0Ylc5dUp6dGNibWx0Y0c5eWRDQjdZVzVwYldGMFpVRmliM1YwVDI1TmIzVnpaVTF2ZG1WOUlHWnliMjBnSnk0dllXSnZkWFFuTzF4dWFXMXdiM0owSUhCdmNIVndTR0Z1Wkd4bGNuTWdabkp2YlNBbkxpOXdiM0IxY0NjN1hHNXBiWEJ2Y25RZ2UyMWhjRWhoYm1Sc1pYSnpmU0JtY205dElGd2lMaTl0WVhCY0lqdGNibWx0Y0c5eWRDQnZjR1Z5WVhSdmNuTlFZV2RsSUdaeWIyMGdYQ0l1TDI5d1pYSmhkRzl5YzF3aU8xeHVYRzRvWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhkcGJtUnZkMU5qY205c2JDZ3BPMXh1SUNBZ0lIZHBibVJ2ZHk1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkelkzSnZiR3duTENCM2FXNWtiM2RUWTNKdmJHd3BPMXh1SUNBZ0lHRnVhVzFoZEdWQlltOTFkRTl1VFc5MWMyVk5iM1psS0NrN1hHNGdJQ0FnY0c5d2RYQklZVzVrYkdWeWN5Z3BPMXh1SUNBZ0lHMWhjRWhoYm1Sc1pYSnpLQ2s3WEc0Z0lDQWdiM0JsY21GMGIzSnpVR0ZuWlNncE8xeHVJQ0FnSUNRb0oyRmJhSEpsWmlvOVhDSWpYQ0pkSnlrdWIyNG9KMk5zYVdOckp5d2djMjF2YjNSb1UyTnliMnhzS1R0Y2JuMHBLQ2s3WEc1Y2JseHVJaXdpYVcxd2IzSjBJR1JsWW05MWJtTmxJR1p5YjIwZ0oyeHZaR0Z6YUM5a1pXSnZkVzVqWlNjN1hHNWNibHh1Wlhod2IzSjBJR052Ym5OMElFMVJWVVZTV1NBOUlIZHBibVJ2ZHk1dFlYUmphRTFsWkdsaEtDZHpZM0psWlc0Z1lXNWtJQ2h0WVhndGQybGtkR2c2SURrMU9YQjRLU2NwTzF4dVpYaHdiM0owSUdOdmJuTjBJRTFUU1ZwRklEMGdPVFU1TzF4dVpYaHdiM0owSUdOdmJuTjBJR2x6Um1seVpXWnZlQ0E5SUc1aGRtbG5ZWFJ2Y2k1MWMyVnlRV2RsYm5RdWRHOU1iM2RsY2tOaGMyVW9LUzVwYm1SbGVFOW1LQ2RtYVhKbFptOTRKeWtnUGlBdE1UdGNibVY0Y0c5eWRDQmpiMjV6ZENCcGMwbEZNVEFnUFNBdlRWTkpSU0F4TUM5cExuUmxjM1FvYm1GMmFXZGhkRzl5TG5WelpYSkJaMlZ1ZENrN1hHNWxlSEJ2Y25RZ1kyOXVjM1FnYVhOSlJURXhQU0F2VFZOSlJTQTVMMmt1ZEdWemRDaHVZWFpwWjJGMGIzSXVkWE5sY2tGblpXNTBLU0I4ZkNBdmNuWTZNVEV1TUM5cExuUmxjM1FvYm1GMmFXZGhkRzl5TG5WelpYSkJaMlZ1ZENrN1hHNWxlSEJ2Y25RZ1kyOXVjM1FnYVhORlJFZEZJRDBnTDBWa1oyVmNYQzljWEdRdUwya3VkR1Z6ZENodVlYWnBaMkYwYjNJdWRYTmxja0ZuWlc1MEtUdGNibHh1WTI5dWMzUWdYMk5vWldOclJXeGxiV1Z1ZEZacFpYZHdiM0owSUQwZ0tHVnNiU3dnYVhOSVZFMU1MQ0JvWVd4bUtTQTlQaUI3WEc0Z0lDQWdiR1YwSUdobGFXZG9kQ0E5SUdoaGJHWWdQeUIzYVc1a2IzY3VhVzV1WlhKSVpXbG5hSFFnTHlBeExqRWdPaUIzYVc1a2IzY3VhVzV1WlhKSVpXbG5hSFE3WEc0Z0lDQWdhV1lnS0dselNGUk5UQ0FtSmlCbGJHMHVaMlYwUW05MWJtUnBibWREYkdsbGJuUlNaV04wS0NrdWRHOXdJRHdnYUdWcFoyaDBLU0J5WlhSMWNtNGdkSEoxWlR0Y2JpQWdJQ0JsYkhObElHbG1JQ2doYVhOSVZFMU1LU0I3WEc0Z0lDQWdJQ0FnSUdsbUlDZ2haRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2lobGJHMHBLU0J5WlhSMWNtNGdabUZzYzJVN1hHNGdJQ0FnSUNBZ0lHVnNjMlVnYVdZZ0tHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvWld4dEtTNW5aWFJDYjNWdVpHbHVaME5zYVdWdWRGSmxZM1FvS1M1MGIzQWdQQ0JvWldsbmFIUXBJSEpsZEhWeWJpQjBjblZsTzF4dUlDQWdJSDFjYm4wN1hHNWNibU52Ym5OMElGOWhaR1JEYkdGemMyOXVWbWxsZDNCdmNuUWdQU0FvWld4dExDQnBjMGhVVFV3c0lHaGhiR1lwSUQwK0lIdGNiaUFnSUNCcFppQW9hWE5JVkUxTUlDWW1JRjlqYUdWamEwVnNaVzFsYm5SV2FXVjNjRzl5ZENobGJHMHNJR2x6U0ZSTlRDd2dhR0ZzWmlrcElHVnNiUzVqYkdGemMweHBjM1F1WVdSa0tDZGhZM1JwZG1VbktUdGNiaUFnSUNCbGJITmxJR2xtSUNnaGFYTklWRTFNSUNZbUlGOWphR1ZqYTBWc1pXMWxiblJXYVdWM2NHOXlkQ2hsYkcwc0lHNTFiR3dzSUdoaGJHWXBLU0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtHVnNiU2t1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25ZV04wYVhabEp5azdYRzU5TzF4dVhHNWNibU52Ym5OMElGOWhaR1JTWlhGMWFYSmxRVzVwYldGMGFXOXVJRDBnS0NrZ1BUNGdlMXh1SUNBZ0lHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0pCYkd3b0p5NXlaWEV0WVc1cGJXRjBhVzl1SnlrdVptOXlSV0ZqYUNnb1pTa2dQVDRnZTF4dUlDQWdJQ0FnSUNCZllXUmtRMnhoYzNOdmJsWnBaWGR3YjNKMEtHVXNJSFJ5ZFdVc0lIUnlkV1VwTzF4dUlDQWdJSDBwTzF4dWZUdGNibHh1WEc1Y2JtVjRjRzl5ZENCamIyNXpkQ0IzYVc1a2IzZFRZM0p2Ykd3Z1BTQmtaV0p2ZFc1alpTZ29LU0E5UGlCN1hHNGdJQ0FnZDJsdVpHOTNMbkpsY1hWbGMzUkJibWx0WVhScGIyNUdjbUZ0WlNnb0tTQTlQaUI3WEc0Z0lDQWdJQ0FnSUY5aFpHUlNaWEYxYVhKbFFXNXBiV0YwYVc5dUtDazdYRzRnSUNBZ2ZTazdYRzU5TENBMU1DazdYRzVjYmx4dVhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z1oyVjBRMjl2YTJsbEtHNWhiV1VwSUh0Y2JpQWdJQ0JzWlhRZ2JXRjBZMmhsY3lBOUlHUnZZM1Z0Wlc1MExtTnZiMnRwWlM1dFlYUmphQ2h1WlhjZ1VtVm5SWGh3S0Z4dUlDQWdJQ0FnSUNCY0lpZy9PbDU4T3lBcFhDSWdLeUJ1WVcxbExuSmxjR3hoWTJVb0x5aGJYRnd1SkQ4cWZIdDlYRndvWEZ3cFhGeGJYRnhkWEZ4Y1hGeGNMMXhjSzE1ZEtTOW5MQ0FuWEZ4Y1hDUXhKeWtnS3lCY0lqMG9XMTQ3WFNvcFhDSmNiaUFnSUNBcEtUdGNiaUFnSUNCeVpYUjFjbTRnYldGMFkyaGxjeUEvSUdSbFkyOWtaVlZTU1VOdmJYQnZibVZ1ZENodFlYUmphR1Z6V3pGZEtTQTZJSFZ1WkdWbWFXNWxaRHRjYm4xY2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlITmxkRU52YjJ0cFpTaHVZVzFsTENCMllXeDFaU3dnYjNCMGFXOXVjeWtnZTF4dUlDQWdJRzl3ZEdsdmJuTWdQU0J2Y0hScGIyNXpJSHg4SUh0OU8xeHVYRzRnSUNBZ2JHVjBJR1Y0Y0dseVpYTWdQU0J2Y0hScGIyNXpMbVY0Y0dseVpYTTdYRzVjYmlBZ0lDQnBaaUFvZEhsd1pXOW1JR1Y0Y0dseVpYTWdQVDBnWENKdWRXMWlaWEpjSWlBbUppQmxlSEJwY21WektTQjdYRzRnSUNBZ0lDQWdJR3hsZENCa0lEMGdibVYzSUVSaGRHVW9LVHRjYmlBZ0lDQWdJQ0FnWkM1elpYUlVhVzFsS0dRdVoyVjBWR2x0WlNncElDc2daWGh3YVhKbGN5QXFJREV3TURBcE8xeHVJQ0FnSUNBZ0lDQmxlSEJwY21WeklEMGdiM0IwYVc5dWN5NWxlSEJwY21WeklEMGdaRHRjYmlBZ0lDQjlYRzRnSUNBZ2FXWWdLR1Y0Y0dseVpYTWdKaVlnWlhod2FYSmxjeTUwYjFWVVExTjBjbWx1WnlrZ2UxeHVJQ0FnSUNBZ0lDQnZjSFJwYjI1ekxtVjRjR2x5WlhNZ1BTQmxlSEJwY21WekxuUnZWVlJEVTNSeWFXNW5LQ2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdkbUZzZFdVZ1BTQmxibU52WkdWVlVrbERiMjF3YjI1bGJuUW9kbUZzZFdVcE8xeHVYRzRnSUNBZ2JHVjBJSFZ3WkdGMFpXUkRiMjlyYVdVZ1BTQnVZVzFsSUNzZ1hDSTlYQ0lnS3lCMllXeDFaVHRjYmx4dUlDQWdJR1p2Y2lBb2JHVjBJSEJ5YjNCT1lXMWxJR2x1SUc5d2RHbHZibk1wSUh0Y2JpQWdJQ0FnSUNBZ2RYQmtZWFJsWkVOdmIydHBaU0FyUFNCY0lqc2dYQ0lnS3lCd2NtOXdUbUZ0WlR0Y2JpQWdJQ0FnSUNBZ2JHVjBJSEJ5YjNCV1lXeDFaU0E5SUc5d2RHbHZibk5iY0hKdmNFNWhiV1ZkTzF4dUlDQWdJQ0FnSUNCcFppQW9jSEp2Y0ZaaGJIVmxJQ0U5UFNCMGNuVmxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFjR1JoZEdWa1EyOXZhMmxsSUNzOUlGd2lQVndpSUNzZ2NISnZjRlpoYkhWbE8xeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1pHOWpkVzFsYm5RdVkyOXZhMmxsSUQwZ2RYQmtZWFJsWkVOdmIydHBaVHRjYm4xY2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlITnRiMjkwYUZOamNtOXNiQ2hsS1NCN1hHNGdJQ0FnWlM1d2NtVjJaVzUwUkdWbVlYVnNkQ2dwTzF4dVhHNGdJQ0FnSkNnbmFIUnRiQ3dnWW05a2VTY3BMbUZ1YVcxaGRHVW9lMXh1SUNBZ0lDQWdJQ0J6WTNKdmJHeFViM0E2SUNRb0pDaGxMbU4xY25KbGJuUlVZWEpuWlhRcExtRjBkSElvSjJoeVpXWW5LU2t1YjJabWMyVjBLQ2t1ZEc5d1hHNGdJQ0FnZlN3Z05UQXdMQ0FuYkdsdVpXRnlKeWs3WEc1OVhHNWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQnlZVzVrYjIxSmJuUkdjbTl0U1c1MFpYSjJZV3dvYldsdUxHMWhlQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQk5ZWFJvTG1ac2IyOXlLRTFoZEdndWNtRnVaRzl0S0NrcUtHMWhlQzF0YVc0ck1Ta3JiV2x1S1R0Y2JuMGlMQ0pwYlhCdmNuUWdlM0poYm1SdmJVbHVkRVp5YjIxSmJuUmxjblpoYkN3Z1RWRlZSVkpaTENCTlUwbGFSWDBnWm5KdmJTQmNJaTR2WTI5dGJXOXVYQ0k3WEc1Y2JtVjRjRzl5ZENCamIyNXpkQ0J0WVhCSVlXNWtiR1Z5Y3lBOUlDZ3BJRDArSUh0Y2JpQWdJQ0FrS0dSdlkzVnRaVzUwS1Z4dUlDQWdJQ0FnSUNBdWIyNG9KMjF2ZFhObFpXNTBaWEluTENBbkxtMWhjSE4yWnkxeVpXZHBiMjRuTENCb2IzWmxjbEJoZEdncFhHNGdJQ0FnSUNBZ0lDNXZiaWduYlc5MWMyVnZkWFFuTENBbkxtMWhjSE4yWnkxeVpXZHBiMjRuTENCeVpXMXZkbVZRWVhSb1NHOTJaWElwTzF4dVhHNGdJQ0FnYVdZZ0tHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvSnk1cWN5MW1iM0l0Y21WbmFXOXVjeWNwS1NCN1hHNGdJQ0FnSUNBZ0lIZHBibVJ2ZHk1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkeVpYTnBlbVVuTENCeVpYTnBlbVZYYm1SdmQxTmxkRTFoY0NrN1hHNGdJQ0FnSUNBZ0lHbHVhWFJRYkdGalpYTW9LVHRjYmlBZ0lDQWdJQ0FnYzJWMFVtRnVaRzl0U0c5MlpYSW9LVHRjYmlBZ0lDQjlYRzU5TzF4dVhHNWpiMjV6ZENCamIzVnVkSEpwWlhORGIzVnVkQ0E5SUZ0Y2JpQWdJQ0I3WEc0Z0lDQWdJQ0FnSUdsa09pQW5VMHNuTEZ4dUlDQWdJQ0FnSUNCamIzVnVkRG9nTmpaY2JpQWdJQ0I5TEZ4dUlDQWdJSHRjYmlBZ0lDQWdJQ0FnYVdRNkoxTkpKeXhjYmlBZ0lDQWdJQ0FnWTI5MWJuUTZJRFU0WEc0Z0lDQWdmU3hjYmlBZ0lDQjdYRzRnSUNBZ0lDQWdJR2xrT2lkVFJTY3NYRzRnSUNBZ0lDQWdJR052ZFc1ME9pQXhNVEpjYmlBZ0lDQjlMRnh1SUNBZ0lIdGNiaUFnSUNBZ0lDQWdhV1E2SjFKVEp5eGNiaUFnSUNBZ0lDQWdZMjkxYm5RNklERTRYRzRnSUNBZ2ZTeGNiaUFnSUNCN1hHNGdJQ0FnSUNBZ0lHbGtPaWRTVHljc1hHNGdJQ0FnSUNBZ0lHTnZkVzUwT2lBeU9WeHVJQ0FnSUgwc1hHNGdJQ0FnZTF4dUlDQWdJQ0FnSUNCcFpEb25VRlFuTEZ4dUlDQWdJQ0FnSUNCamIzVnVkRG9nT0RoY2JpQWdJQ0I5TEZ4dUlDQWdJSHRjYmlBZ0lDQWdJQ0FnYVdRNkowNVBKeXhjYmlBZ0lDQWdJQ0FnWTI5MWJuUTZJREUzT0Z4dUlDQWdJSDBzWEc0Z0lDQWdlMXh1SUNBZ0lDQWdJQ0JwWkRvblRrd25MRnh1SUNBZ0lDQWdJQ0JqYjNWdWREb2dNVEl3WEc0Z0lDQWdmU3hjYmlBZ0lDQjdYRzRnSUNBZ0lDQWdJR2xrT2lkUVRDY3NYRzRnSUNBZ0lDQWdJR052ZFc1ME9pQXpNekZjYmlBZ0lDQjlMRnh1SUNBZ0lIdGNiaUFnSUNBZ0lDQWdhV1E2SjBWRkp5eGNiaUFnSUNBZ0lDQWdZMjkxYm5RNklETTVYRzRnSUNBZ2ZTeGNiaUFnSUNCN1hHNGdJQ0FnSUNBZ0lHbGtPaWRCVkNjc1hHNGdJQ0FnSUNBZ0lHTnZkVzUwT2lBeU5qRmNiaUFnSUNCOUxGeHVJQ0FnSUh0Y2JpQWdJQ0FnSUNBZ2FXUTZKMFJGSnl4Y2JpQWdJQ0FnSUNBZ1kyOTFiblE2SURjd05WeHVJQ0FnSUgwc1hHNGdJQ0FnZTF4dUlDQWdJQ0FnSUNCcFpEb25RMW9uTEZ4dUlDQWdJQ0FnSUNCamIzVnVkRG9nTXpFNVhHNGdJQ0FnZlN4Y2JpQWdJQ0I3WEc0Z0lDQWdJQ0FnSUdsa09pZEpSU2NzWEc0Z0lDQWdJQ0FnSUdOdmRXNTBPaUEzWEc0Z0lDQWdmU3hjYmlBZ0lDQjdYRzRnSUNBZ0lDQWdJR2xrT2lkRFNDY3NYRzRnSUNBZ0lDQWdJR052ZFc1ME9pQTVNVnh1SUNBZ0lIMHNYRzRnSUNBZ2UxeHVJQ0FnSUNBZ0lDQnBaRG9uUVV3bkxGeHVJQ0FnSUNBZ0lDQmpiM1Z1ZERvZ01URmNiaUFnSUNCOUxGeHVJQ0FnSUh0Y2JpQWdJQ0FnSUNBZ2FXUTZKMFJMSnl4Y2JpQWdJQ0FnSUNBZ1kyOTFiblE2SURNM1hHNGdJQ0FnZlN4Y2JpQWdJQ0I3WEc0Z0lDQWdJQ0FnSUdsa09pZE1WaWNzWEc0Z0lDQWdJQ0FnSUdOdmRXNTBPaUF6Tmx4dUlDQWdJSDBzWEc0Z0lDQWdlMXh1SUNBZ0lDQWdJQ0JwWkRvblZGSW5MRnh1SUNBZ0lDQWdJQ0JqYjNWdWREb2dNVEpjYmlBZ0lDQjlMRnh1SUNBZ0lIdGNiaUFnSUNBZ0lDQWdhV1E2SjBKSEp5eGNiaUFnSUNBZ0lDQWdZMjkxYm5RNklERTJYRzRnSUNBZ2ZTeGNiaUFnSUNCN1hHNGdJQ0FnSUNBZ0lHbGtPaWRJVWljc1hHNGdJQ0FnSUNBZ0lHTnZkVzUwT2lBMU9GeHVJQ0FnSUgwc1hHNGdJQ0FnZTF4dUlDQWdJQ0FnSUNCcFpEb25Ra1VuTEZ4dUlDQWdJQ0FnSUNCamIzVnVkRG9nTnpoY2JpQWdJQ0I5TEZ4dUlDQWdJSHRjYmlBZ0lDQWdJQ0FnYVdRNkowVlRKeXhjYmlBZ0lDQWdJQ0FnWTI5MWJuUTZJREU0TUZ4dUlDQWdJSDBzWEc0Z0lDQWdlMXh1SUNBZ0lDQWdJQ0JwWkRvblJra25MRnh1SUNBZ0lDQWdJQ0JqYjNWdWREb2dNVFJjYmlBZ0lDQjlMRnh1SUNBZ0lIdGNiaUFnSUNBZ0lDQWdhV1E2SjBoVkp5eGNiaUFnSUNBZ0lDQWdZMjkxYm5RNklESTFNVnh1SUNBZ0lIMHNYRzRnSUNBZ2UxeHVJQ0FnSUNBZ0lDQnBaRG9uVFVVbkxGeHVJQ0FnSUNBZ0lDQmpiM1Z1ZERvZ05seHVJQ0FnSUgwc1hHNGdJQ0FnZTF4dUlDQWdJQ0FnSUNCcFpEb25SbEluTEZ4dUlDQWdJQ0FnSUNCamIzVnVkRG9nTlRZM1hHNGdJQ0FnZlN4Y2JpQWdJQ0I3WEc0Z0lDQWdJQ0FnSUdsa09pZE1WU2NzWEc0Z0lDQWdJQ0FnSUdOdmRXNTBPaUExWEc0Z0lDQWdmU3hjYmlBZ0lDQjdYRzRnSUNBZ0lDQWdJR2xrT2lkSFFpY3NYRzRnSUNBZ0lDQWdJR052ZFc1ME9pQTBPVnh1SUNBZ0lIMHNYRzRnSUNBZ2UxeHVJQ0FnSUNBZ0lDQnBaRG9uUjFJbkxGeHVJQ0FnSUNBZ0lDQmpiM1Z1ZERvZ016aGNiaUFnSUNCOUxGeHVJQ0FnSUh0Y2JpQWdJQ0FnSUNBZ2FXUTZKMGxVSnl4Y2JpQWdJQ0FnSUNBZ1kyOTFiblE2SURRNE9GeHVJQ0FnSUgwc1hHNGdJQ0FnZTF4dUlDQWdJQ0FnSUNCcFpEb25URlFuTEZ4dUlDQWdJQ0FnSUNCamIzVnVkRG9nTXpkY2JpQWdJQ0I5WEc1ZE8xeHVYRzVzWlhRZ2RHOGdQU0J1ZFd4c0xGeHVJQ0FnSUhSdlVtVnphWHBsSUQwZ2JuVnNiRHRjYmx4dVkyOXVjM1FnWTI5MWJuUnlhV1Z6SUQwZ0pDNW1iaTVwYm5Sc1ZHVnNTVzV3ZFhRdVoyVjBRMjkxYm5SeWVVUmhkR0VvS1R0Y2JseHVZMjl1YzNRZ1VFeEJRMFZmVTBsYVJTQTlJREl3SUNvZ016QTdYRzVjYm1OdmJuTjBJSEpsYzJsNlpWZHVaRzkzVTJWMFRXRndJRDBnS0NrZ1BUNGdlMXh1SUNBZ0lDUW9KeTVxY3kxbWIzSXRjRzlwYm5SekxXMWhjQ2NwTG1oMGJXd29KeWNwTzF4dUlDQWdJR05zWldGeVZHbHRaVzkxZENoMGIxSmxjMmw2WlNrN1hHNGdJQ0FnZEc5U1pYTnBlbVVnUFNCelpYUlVhVzFsYjNWMEtDZ3BQVDRnZTF4dUlDQWdJQ0FnSUNCcGJtbDBVR3hoWTJWektDazdYRzRnSUNBZ2ZTd2dOVEFwTzF4dWZUdGNibHh1WTI5dWMzUWdhRzkyWlhKUVlYUm9JRDBnS0dVc0lHbHpTVVFwSUQwK0lIdGNiaUFnSUNCc1pYUWdkR0Z5WjJWMElEMGdhWE5KUkNBL0lHbHpTVVFnT2lCbExtTjFjbkpsYm5SVVlYSm5aWFE3WEc0Z0lDQWdiR1YwSUdsa0lEMGdkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duYVdRbktUdGNibHh1SUNBZ0lHeGxkQ0JqYjNWdWRISjVJRDBnWTI5MWJuUnlhV1Z6TG1acGJIUmxjaWhqYjNWdWRISjVJRDArSUdOdmRXNTBjbmt1YVhOdk1pQTlQVDBnYVdRcE8xeHVYRzRnSUNBZ2NtVnRiM1psUVdOMGFYWmxRMnhoYzNOR2NtOXRVbVZuYVc5dWN5Z3BPMXh1WEc0Z0lDQWdhV1lnS0dselNVUXBJR2x6U1VRdVkyeGhjM05NYVhOMExtRmtaQ2duWVdOMGFYWmxKeWs3WEc0Z0lDQWdaV3h6WlNCamJHVmhja2x1ZEdWeWRtRnNLSFJ2S1RzZ1hHNWNiaUFnSUNCcFppQW9ZMjkxYm5SeWVTNXNaVzVuZEdnZ1BpQXdLU0I3WEc0Z0lDQWdJQ0FnSUhKbGJXOTJaVWx1Wm05Q2JHOWpheWdwTzF4dUlDQWdJQ0FnSUNCc1pYUWdhVzVtYnlBOUlIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdKbmFUb2dZR2x0WVdkbGN5OWpiM1Z1ZEhKNVgzQnliMlpwYkdVdkpIdHBaSDB1YW5CbllDeGNiaUFnSUNBZ0lDQWdJQ0FnSUc1aGJXVTZJR052ZFc1MGNubGJNRjB1Ym1GdFpTeGNiaUFnSUNBZ0lDQWdJQ0FnSUdsa09pQmpiM1Z1ZEhKNVd6QmRMbWx6YnpJc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqYjNWdWREb2dkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMWpiM1Z1ZENjcElEOGdkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMWpiM1Z1ZENjcElEb2dNRnh1SUNBZ0lDQWdJQ0I5TzF4dUlDQWdJQ0FnSUNCcFppQW9UVkZWUlZKWkxtMWhkR05vWlhNcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUd4bGRDQmlJRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpaGdJeVI3ZEdGeVoyVjBMbWRsZEVGMGRISnBZblYwWlNnbmFXUW5LWDFnS1M1blpYUkNiM1Z1WkdsdVowTnNhV1Z1ZEZKbFkzUW9LVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHeGxkQ0JpYjNWdVpDQTlJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I0T2lCaUxuZ2dLeUEwTUN4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCM2FXUjBhRG9nWWk1M2FXUjBhQ3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JvWldsbmFIUTZJR0l1YUdWcFoyaDBMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSGs2SUhSaGNtZGxkQzVuWlhSQ1FtOTRLQ2t1ZVNBdElDaDBZWEpuWlhRdVoyVjBRa0p2ZUNncExua2dMeUF6S1Z4dUlDQWdJQ0FnSUNBZ0lDQWdmVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxibVJsY2tsdVptOUNiRzlqYXlocGJtWnZMQ0JpYjNWdVpDazdYRzRnSUNBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCc1pYUWdiMlptYzJWMFZHOXdJRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25MbXB6TFdadmNpMXdiMmx1ZEhNdGJXRndKeWt1WjJWMFFtOTFibVJwYm1kRGJHbGxiblJTWldOMEtDa3VlVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHeGxkQ0JpWVNBOUlIUmhjbWRsZEM1blpYUkNiM1Z1WkdsdVowTnNhV1Z1ZEZKbFkzUW9LVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHeGxkQ0JpYjNWdVpFWnBibUZzSUQwZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIZzZJR0poTG5nc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2QybGtkR2c2SUdKaExuZHBaSFJvTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdobGFXZG9kRG9nWW1FdWFHVnBaMmgwTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhrNklHSmhMbmtnTFNCdlptWnpaWFJVYjNCY2JpQWdJQ0FnSUNBZ0lDQWdJSDA3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaVzVrWlhKSmJtWnZRbXh2WTJzb2FXNW1ieXdnWW05MWJtUkdhVzVoYkNrN1hHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNCc1pYUWdjbVZuYVc5dUlEMGdaRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2loZ0xuTjJaMjFoY0Y5ZmNtVm5hVzl1VzJSaGRHRXRhV1E5WENJa2UybGtmVndpWFdBcE8xeHVYRzRnSUNBZ2FXWWdLSEpsWjJsdmJpa2dlMXh1SUNBZ0lDQWdJQ0J5WldkcGIyNHVjM1I1YkdVdVlXNXBiV0YwYVc5dVJHVnNZWGtnUFNBbk1HMXpKenRjYmlBZ0lDQWdJQ0FnY21WbmFXOXVMbU5zWVhOelRHbHpkQzVoWkdRb0ozSmxkbVZ5YzJVbktUdGNiaUFnSUNCOVhHNTlPMXh1WEc1amIyNXpkQ0J5WlcxdmRtVlFZWFJvU0c5MlpYSWdQU0FvWlN3Z2FYTkpSQ2tnUFQ0Z2UxeHVJQ0FnSUd4bGRDQjBZWEpuWlhRZ1BTQnBjMGxFSUQ4Z2FYTkpSQ0E2SUdVdVkzVnljbVZ1ZEZSaGNtZGxkRHRjYmlBZ0lDQnNaWFFnYVdRZ1BTQjBZWEpuWlhRdVoyVjBRWFIwY21saWRYUmxLQ2RwWkNjcE8xeHVYRzRnSUNBZ2JHVjBJSEpsWjJsdmJpQTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb1lDNXpkbWR0WVhCZlgzSmxaMmx2Ymx0a1lYUmhMV2xrUFZ3aUpIdHBaSDFjSWwxZ0tUdGNiaUFnSUNCeVpXMXZkbVZCWTNScGRtVkRiR0Z6YzBaeWIyMVNaV2RwYjI1ektDazdYRzVjYmlBZ0lDQnBaaUFvY21WbmFXOXVLU0I3WEc0Z0lDQWdJQ0FnSUhKbFoybHZiaTV6ZEhsc1pTNWhibWx0WVhScGIyNUVaV3hoZVNBOUlDY3diWE1uTzF4dUlDQWdJQ0FnSUNCeVpXZHBiMjR1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duY21WMlpYSnpaU2NwTzF4dUlDQWdJSDFjYmlBZ0lDQnlaVzF2ZG1WSmJtWnZRbXh2WTJzb0tUdGNibjA3WEc1Y2JtTnZibk4wSUhObGRGSmhibVJ2YlVodmRtVnlJRDBnS0NrOVBpQjdYRzRnSUNBZ2JHVjBJSEpoYm1SdmJVTnZkVzUwY25rZ1BTQmpiM1Z1ZEhKcFpYTkRiM1Z1ZEZ0eVlXNWtiMjFKYm5SR2NtOXRTVzUwWlhKMllXd29NQ3dnWTI5MWJuUnlhV1Z6UTI5MWJuUXViR1Z1WjNSb0xURXBYUzVwWkR0Y2JpQWdJQ0JzWlhRZ2RHRnlaMlYwSUQwZ1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWhnSXlSN2NtRnVaRzl0UTI5MWJuUnllUzUwYjB4dmQyVnlRMkZ6WlNncGZXQXBPMXh1SUNBZ0lHeGxkQ0J3Y21WMklEMGdkR0Z5WjJWME8xeHVYRzRnSUNBZ2NtVnRiM1psVUdGMGFFaHZkbVZ5S0c1MWJHd3NJSFJoY21kbGRDazdYRzRnSUNBZ2FHOTJaWEpRWVhSb0tHNTFiR3dzSUhSaGNtZGxkQ2s3WEc0Z0lDQWdkRzhnUFNCelpYUkpiblJsY25aaGJDZ29LVDArSUh0Y2JpQWdJQ0FnSUNBZ2JHVjBJSEpoYm1SdmJVTnZkVzUwY25reElEMGdZMjkxYm5SeWFXVnpRMjkxYm5SYmNtRnVaRzl0U1c1MFJuSnZiVWx1ZEdWeWRtRnNLREFzSUdOdmRXNTBjbWxsYzBOdmRXNTBMbXhsYm1kMGFDMHhLVjB1YVdRN1hHNGdJQ0FnSUNBZ0lHeGxkQ0IwWVhKblpYUXhJRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpaGdJeVI3Y21GdVpHOXRRMjkxYm5SeWVURXVkRzlNYjNkbGNrTmhjMlVvS1gxZ0tUdGNiaUFnSUNBZ0lDQWdjbVZ0YjNabFVHRjBhRWh2ZG1WeUtHNTFiR3dzSUhCeVpYWXBPMXh1SUNBZ0lDQWdJQ0JvYjNabGNsQmhkR2dvYm5Wc2JDd2dkR0Z5WjJWME1TazdYRzRnSUNBZ0lDQWdJSEJ5WlhZZ1BTQjBZWEpuWlhReE8xeHVJQ0FnSUgwc0lETXdNREFwTzF4dWZUdGNibHh1WTI5dWMzUWdjbVZ0YjNabFFXTjBhWFpsUTJ4aGMzTkdjbTl0VW1WbmFXOXVjeUE5SUNncFBUNGdlMXh1SUNBZ0lHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0pCYkd3b0p5NXRZWEJ6ZG1jdGNtVm5hVzl1SnlrdVptOXlSV0ZqYUNnb1pTazlQaUI3WEc0Z0lDQWdJQ0FnSUdVdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnbllXTjBhWFpsSnlrN1hHNGdJQ0FnZlNrN1hHNTlPMXh1WEc1amIyNXpkQ0J5Wlc1a1pYSkpibVp2UW14dlkyc2dQU0FvYVc1bWJ5d2dZbTkxYm1RcElEMCtJSHRjYmlBZ0lDQnNaWFFnWW14dlkyc2dQU0JrYjJOMWJXVnVkQzVqY21WaGRHVkZiR1Z0Wlc1MEtDZGthWFluS1R0Y2JpQWdJQ0JpYkc5amF5NWpiR0Z6YzA1aGJXVWdQU0FuYzNabmJXRndKenRjYmlBZ0lDQmliRzlqYXk1elpYUkJkSFJ5YVdKMWRHVW9KMmxrSnl3Z0oyaHZkbVZ5VFdGd1JXeHRaVzVsZENjcE8xeHVJQ0FnSUdKc2IyTnJMbk4wZVd4bExteGxablFnUFNCZ0pIdGliM1Z1WkM1NElDc2dLR0p2ZFc1a0xuZHBaSFJvSUM4Z01pbDljSGhnTzF4dUlDQWdJR0pzYjJOckxuTjBlV3hsTG5SdmNDQTlJR0FrZTJKdmRXNWtMbmtnS3lBb1ltOTFibVF1YUdWcFoyaDBJQzhnTWlsOWNIaGdPMXh1WEc0Z0lDQWdiR1YwSUd4bFpuUWdQU0F3TzF4dUlDQWdJR2xtSUNoaWIzVnVaQzU0SUNzZ01USTFJQ3NvWW05MWJtUXVkMmxrZEdnZ0x5QXlLU0ErSUhkcGJtUnZkeTVwYm01bGNsZHBaSFJvS1NCN1hHNGdJQ0FnSUNBZ0lHeGxablFnUFNCM2FXNWtiM2N1YVc1dVpYSlhhV1IwYUNBdElDaGliM1Z1WkM1NElDc2dNVEkxS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb2FXNW1ieTVwWkNBOVBUMGdKM1J5SnlrZ2UxeHVJQ0FnSUNBZ0lDQmliRzlqYXk1emRIbHNaUzVzWldaMElEMGdJSGRwYm1SdmR5NXBibTVsY2xkcFpIUm9JRHdnTVRJMk1DQW1KaUIzYVc1a2IzY3VhVzV1WlhKWGFXUjBhQ0ErSUUxVFNWcEZJRDhnWUNSN1ltOTFibVF1ZUNBcklERXdmWEI0WUNBNklHQWtlMkp2ZFc1a0xuZ2dJQzBnTlRCOWNIaGdPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHeGxkQ0IwY21saGJtZHNaVXhsWm5RZ1BTQk5ZWFJvTG1GaWN5aHNaV1owS1NBdElERXhJRDRnTVRBMElEOGdNVEEwSURvZ1RXRjBhQzVoWW5Nb2JHVm1kQ2tnTFNBeE1UdGNibHh1SUNBZ0lHSnNiMk5yTG1sdWJtVnlTRlJOVENBOUlHQThaR2wySUdOc1lYTnpQVndpYzNabmJXRndYMTlpYkc5amExd2lJSE4wZVd4bFBWd2liR1ZtZERvZ0pIdHNaV1owSUNzZ0tDMHhNalVwZlhCNE8xd2lQbHh1SUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56UFZ3aWMzWm5iV0Z3WDE5c2IyTmhkRzl5WENJZ2MzUjViR1U5WENKc1pXWjBPaUJqWVd4aktEVXdKU0FySUNSN1RXRjBhQzVoWW5Nb2JHVm1kQ2t0TVRGOWNIZ3BYQ0krUEM5a2FYWStYRzRnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM005WENKemRtZHRZWEJmWDJsdFoxd2lJSE4wZVd4bFBWd2lJR0poWTJ0bmNtOTFibVF0YVcxaFoyVTZJSFZ5YkNnbkpIdHBibVp2TG1KbmFYMG5LVndpUGp3dlpHbDJQbHh1SUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56UFZ3aWMzWm5iV0Z3WDE5MGNtbGhibWRzWlZ3aUlITjBlV3hsUFZ3aWJHVm1kRG9nWTJGc1l5ZzFNQ1VnS3lBa2UzUnlhV0Z1WjJ4bFRHVm1kSDF3ZUNsY0lqNDhMMlJwZGo1Y2JpQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemN6MWNJbk4yWjIxaGNGOWZkSGgwWENJK1hHNGdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56UFZ3aWMzWm5iV0Z3WDE5dVlXMWxYQ0krSkh0cGJtWnZMbTVoYldWOVBDOWthWFkrWEc0Z0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVndpYzNabmJXRndYMTlqYjNWdWRGd2lQaVI3YVc1bWJ5NWpiM1Z1ZEgwZ2FHOTBaV3h6UEM5a2FYWStYRzRnSUNBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUR3dlpHbDJQbUE3WEc1Y2JpQWdJQ0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3Vhbk10Wm05eUxYSmxaMmx2Ym5NbktTNWhjSEJsYm1SRGFHbHNaQ2hpYkc5amF5azdYRzU5TzF4dVhHNWpiMjV6ZENCeVpXMXZkbVZKYm1adlFteHZZMnNnUFNBb0tTQTlQaUI3WEc0Z0lDQWdhV1lnS0dSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9KeU5vYjNabGNrMWhjRVZzYldWdVpYUW5LU2xjYmlBZ0lDQWdJQ0FnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25JMmh2ZG1WeVRXRndSV3h0Wlc1bGRDY3BMbkpsYlc5MlpTZ3BPMXh1ZlR0Y2JseHVZMjl1YzNRZ1oyVjBRMjkxYm5SUWJHRmpaWE5DZVZKbFoybHZiaUE5SUNoeVpXZHBiMjRwSUQwK0lIdGNiaUFnSUNCc1pYUWdZbTkxYm1RZ1BTQnlaV2RwYjI0dVoyVjBRa0p2ZUNncE8xeHVYRzRnSUNBZ2NtVjBkWEp1SUhCaGNuTmxTVzUwS0NoaWIzVnVaQzUzYVdSMGFDQXFJR0p2ZFc1a0xtaGxhV2RvZENBdklGQk1RVU5GWDFOSldrVXBJQzhnTWlrN1hHNTlPMXh1WEc1amIyNXpkQ0J6WlhSUWJHRmpaWE5QYmxKbFoybHZiaUE5SUNoamIzVnVkQ3dnWW05MWJtUXNJR2x1WkdWNExDQnBaQ2tnUFQ0Z2UxeHVJQ0FnSUd4bGRDQmliRzlqYXlBOUlHUnZZM1Z0Wlc1MExtTnlaV0YwWlVWc1pXMWxiblFvSjJScGRpY3BMRnh1SUNBZ0lDQWdJQ0JoY25JZ1BTQmJYVHRjYmx4dUlDQWdJR0pzYjJOckxtTnNZWE56VG1GdFpTQTlJQ2R6ZG1kdFlYQmZYM0psWjJsdmJpYzdYRzRnSUNBZ1lteHZZMnN1YzNSNWJHVXViR1ZtZENBOUlHQWtlMkp2ZFc1a0xuaDljSGhnTzF4dUlDQWdJR0pzYjJOckxuTjBlV3hsTG5SdmNDQTlJR0FrZTJKdmRXNWtMbmw5Y0hoZ08xeHVJQ0FnSUdKc2IyTnJMbk4wZVd4bExuZHBaSFJvSUQwZ1lDUjdZbTkxYm1RdWQybGtkR2g5Y0hoZ08xeHVJQ0FnSUdKc2IyTnJMbk4wZVd4bExtaGxhV2RvZENBOUlHQWtlMkp2ZFc1a0xtaGxhV2RvZEgxd2VHQTdYRzRnSUNBZ1lteHZZMnN1YzJWMFFYUjBjbWxpZFhSbEtDZGtZWFJoTFdsa0p5d2dhV1FwTzF4dUlDQWdJR0pzYjJOckxuTjBlV3hsTG1KaFkydG5jbTkxYm1SSmJXRm5aU0E5SUdCMWNtd29YQ0pwYldjdlkyOTFiblJ5YVdWelgzQnZhVzUwWlhKekx5UjdhV1I5TG5OMloxd2lLV0E3WEc0Z0lDQWdZbXh2WTJzdWMzUjViR1V1WVc1cGJXRjBhVzl1UkdWc1lYa2dQU0JnSkh0cGJtUmxlQ0FxSURFMWZXMXpZRHRjYmx4dUlDQWdJSEpsZEhWeWJpQmliRzlqYXp0Y2JuMDdYRzVjYm1OdmJuTjBJR2x1YVhSUWJHRmpaWE1nUFNBb0tTQTlQaUI3WEc0Z0lDQWdZMjkxYm5SeWFXVnpRMjkxYm5RdWJXRndLQ2hsTEdrcFBUNGdlMXh1SUNBZ0lDQWdJQ0JzWlhRZ2RHRnlaMlYwSUQwZ1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWhnSXlSN1pTNXBaQzUwYjB4dmQyVnlRMkZ6WlNncGZXQXBPMXh1SUNBZ0lDQWdJQ0IwWVhKblpYUXVjMlYwUVhSMGNtbGlkWFJsS0Nka1lYUmhMV052ZFc1MEp5d2daUzVqYjNWdWRDazdYRzRnSUNBZ0lDQWdJR3hsZENCdlptWnpaWFJVYjNBZ1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0NjdWFuTXRabTl5TFhCdmFXNTBjeTF0WVhBbktTNW5aWFJDYjNWdVpHbHVaME5zYVdWdWRGSmxZM1FvS1M1NU8xeHVJQ0FnSUNBZ0lDQnNaWFFnWW05MWJtUWdQU0IwWVhKblpYUXVaMlYwUWtKdmVDZ3BPMXh1SUNBZ0lDQWdJQ0JzWlhRZ1ltRWdQU0IwWVhKblpYUXVaMlYwUW05MWJtUnBibWREYkdsbGJuUlNaV04wS0NrN1hHNGdJQ0FnSUNBZ0lHeGxkQ0JpYjNWdVpFWnBibUZzSUQwZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZURvZ1ltRXVlQ3hjYmlBZ0lDQWdJQ0FnSUNBZ0lIZHBaSFJvT2lCaVlTNTNhV1IwYUN4Y2JpQWdJQ0FnSUNBZ0lDQWdJR2hsYVdkb2REb2dZbUV1YUdWcFoyaDBMRnh1SUNBZ0lDQWdJQ0FnSUNBZ2VUb2dZbUV1ZVNBdElHOW1abk5sZEZSdmNGeHVJQ0FnSUNBZ0lDQjlPMXh1SUNBZ0lDQWdJQ0JzWlhRZ1pHbDJJRDBnYzJWMFVHeGhZMlZ6VDI1U1pXZHBiMjRvWjJWMFEyOTFiblJRYkdGalpYTkNlVkpsWjJsdmJpaDBZWEpuWlhRcExDQmliM1Z1WkVacGJtRnNMQ0JwTENCbExtbGtMblJ2VEc5M1pYSkRZWE5sS0NrcE8xeHVJQ0FnSUNBZ0lDQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0NjdWFuTXRabTl5TFhCdmFXNTBjeTF0WVhBbktTNWhjSEJsYm1SRGFHbHNaQ2hrYVhZcE8xeHVJQ0FnSUgwcE8xeHVmVHNpTENKbGVIQnZjblFnWkdWbVlYVnNkQ0JtZFc1amRHbHZiaUJ2Y0dWeVlYUnZjbk5RWVdkbEtDa2dlMXh1SUNBZ0lDUW9aRzlqZFcxbGJuUXBMbTl1S0Z3aVkyeHBZMnRjSWl3Z1hDSXVjR3hoZVMxaWRHNWNJaXdnWDNCdmNIVndSbkpoYldWT2IyUmxLVHRjYm4xY2JseHVZMjl1YzNRZ1gzQnZjSFZ3Um5KaGJXVk9iMlJsSUQwZ0tHVXBJRDArSUh0Y2JpQWdJQ0JzWlhRZ2FXUWdQU0JsTG1OMWNuSmxiblJVWVhKblpYUXVaMlYwUVhSMGNtbGlkWFJsS0Nka1lYUmhMWGx2ZFhSMVltVXRhV1FuS1R0Y2JpQWdJQ0JwWmlBb1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWduTG5kaGRHTm9MWFpwWkdWdkp5a3BJSHRjYmlBZ0lDQWdJQ0FnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25MbmRoZEdOb0xYWnBaR1Z2SnlrdWFXNXVaWEpJVkUxTUlEMGdZRHhwWm5KaGJXVWdhV1E5WENKNWRHbG1jbUZ0WlZ3aUlITnlZejFjSWk4dmQzZDNMbmx2ZFhSMVltVXRibTlqYjI5cmFXVXVZMjl0TDJWdFltVmtMeVI3YVdSOVAyRjFkRzl3YkdGNVBURW1ZVzF3TzJGMWRHOW9hV1JsUFRFbVlXMXdPMk52Ym5SeWIyeHpQVEVtYzJodmQybHVabTg5TUNaeVpXdzlNRndpSUdGc2JHOTNablZzYkhOamNtVmxiajFjSWx3aUlIZHBaSFJvUFZ3aU1UQXdKVndpSUdobGFXZG9kRDFjSWpFd01DVmNJaUJtY21GdFpXSnZjbVJsY2oxY0lqQmNJajQ4TDJsbWNtRnRaVDVnTzF4dUlDQWdJSDFjYm4wN0lpd2lhVzF3YjNKMElIdG5aWFJEYjI5cmFXVXNJRTFSVlVWU1dTd2djMlYwUTI5dmEybGxmU0JtY205dElGd2lMaTlqYjIxdGIyNWNJanRjYm1sdGNHOXlkQ0J1YjFWcFUyeHBaR1Z5SUdaeWIyMGdKMjV2ZFdsemJHbGtaWEluTzF4dVhHNWpiMjV6ZENCdmNIUnBiMjV6UTI5MWJuUnllVUYxZEdOdmJXeGxkR1VnUFNCN1hHNWNkRnh1WEhSa1lYUmhPaUFrTG1adUxtbHVkR3hVWld4SmJuQjFkQzVuWlhSRGIzVnVkSEo1UkdGMFlTZ3BMRnh1WEhSY2JseDBaMlYwVm1Gc2RXVTZJRndpYm1GdFpWd2lMRnh1WEhSY2JseDBiR2x6ZERvZ2UxeHVYSFJjZEcxaGRHTm9PaUI3WEc1Y2RGeDBYSFJsYm1GaWJHVmtPaUIwY25WbFhHNWNkRngwZlN4Y2JseDBYSFJ2YmtOb2IyOXpaVVYyWlc1ME9pQW9LU0E5UGlCN1hHNWNkRngwWEhRa0tGd2lJMk52YlhCaGJua3RZMjkxYm5SeWVWd2lLUzVwYm5Sc1ZHVnNTVzV3ZFhRb1hDSnpaWFJEYjNWdWRISjVYQ0lzSUNRb1hDSWpZMjl0Y0dGdWVTMWpiM1Z1ZEhKNVhDSXBMbWRsZEZObGJHVmpkR1ZrU1hSbGJVUmhkR0VvS1M1cGMyOHlLVHRjYmx4MFhIUjlYRzVjZEgxY2JuMDdYRzVjYm1OdmJuTjBJSEJ2Y0hWd1NHRnVaR3hsY25NZ1BTQW9LU0E5UGlCN1hHNWNkQ1FvWENJalkyOXRjR0Z1ZVMxamIzVnVkSEo1WENJcExtOXVLRndpWTI5MWJuUnllV05vWVc1blpWd2lMQ0J6WlhSV1lXeDFaVlJ2UTI5MWJuUnllU2s3WEc1Y2RGeHVYSFFrS0dSdlkzVnRaVzUwS1Z4dVhIUmNkQzV2YmlnblkyeHBZMnNuTENBbkxtcHpMVzl3Wlc0dGNHOXdkWEFuTENCdmNHVnVVRzl3ZFhBcFhHNWNkRngwTG05dUtDZGpiR2xqYXljc0lDY3Vhbk10WTJ4dmMyVXRjRzl3ZFhBbkxDQmpiRzl6WlZCdmNIVndLVnh1WEhSY2RDNXZiaWduWTJ4cFkyc25MQ0FuTG1wekxYTmxibVF0Y0c5d2RYQW5MQ0J6Wlc1a1VHOXdkWEJOWlhOellXZGxLVnh1WEhSY2RDNXZiaWduWTJ4cFkyc25MQ0FuTG5CdmNIVndKeXdnS0dVcElEMCtJR1V1YzNSdmNGQnliM0JoWjJGMGFXOXVLQ2twWEc1Y2RGeDBMbTl1S0NkamJHbGpheWNzSUNjdWNHOXdkWEJmWDJKbkp5d2djRzl3ZFhCQ1lXTnJaM0p2ZFc1a1EyeHBZMnNwWEc1Y2RGeDBMbTl1S0NkcGJuQjFkQ2NzSUNkMFpYaDBZWEpsWVNjc0lHTnZiVzFsYm5SQmRYUnZVMmw2WlNsY2JseDBYSFF1YjI0b0oydGxlWFZ3Snl3Z0oybHVjSFYwSnl3Z1kyaGxZMnRKYm5CMWRGWmhiSFZsS1Z4dVhIUmNkQzV2YmlnblkyaGhibWRsSnl3Z0p5NXFjeTFwYm5CMWRDMXpkR0Z5Y3ljc0lHTm9ZVzVuWlZOMFlYSnpLVnh1WEhSY2RDNXZiaWduYVc1d2RYUW5MQ0FuSTNKaGJtZGxMV2x1Y0hWMExXMXBiaWNzSUdOb1lXNW5aVWx1Y0hWMFVtRnVaMlVwWEc1Y2RGeDBMbTl1S0NkcGJuQjFkQ2NzSUNjamNtRnVaMlV0YVc1d2RYUXRiV0Y0Snl3Z1kyaGhibWRsU1c1d2RYUlNZVzVuWlNsY2JseDBYSFF1YjI0b0oyTm9ZVzVuWlNjc0lDY3Vhbk10Y21Ga2FXOHRjRzl3ZFhBbkxDQjBiMmRuYkdWU1lXUnBiMGhoYm1Sc1pYSXBPMXh1WEhSY2JseDBZMmhsWTJ0RGIyOXJhV1ZDWVc1dVpYSW9LVHRjYmx4MGFXNXBkRTExYkhScFUyeHBaR1Z5S0NrN1hHNTlPMXh1WEc1amIyNXpkQ0J6Wlc1a1VHOXdkWEJOWlhOellXZGxJRDBnS0dVcElEMCtJSHRjYmx4MFkyeHZjMlZRYjNCMWNDaGxLVHRjYmx4MFpHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWduTG5CdmNIVndYMTl6ZFdOalpYTnpKeWt1YzNSNWJHVXVaR2x6Y0d4aGVTQTlJQ2RpYkc5amF5YzdYRzU5TzF4dVhHNXNaWFFnYVc1d2RYUlVhVzFsVDNWMElEMGdiblZzYkR0Y2JtTnZibk4wSUdOb1pXTnJTVzV3ZFhSV1lXeDFaU0E5SUNobEtTQTlQaUI3WEc1Y2RHeGxkQ0JwYm5CMWRDQTlJR1V1WTNWeWNtVnVkRlJoY21kbGREdGNibHgwYVdZZ0tHbHVjSFYwTG1kbGRFRjBkSEpwWW5WMFpTZ25ibUZ0WlNjcElEMDlQU0FuY205dmJYTW5LU0I3WEc1Y2RGeDBZMnhsWVhKVWFXMWxiM1YwS0dsdWNIVjBWR2x0WlU5MWRDazdYRzVjZEZ4MGFXNXdkWFJVYVcxbFQzVjBJRDBnYzJWMFZHbHRaVzkxZENnb0tTQTlQaUI3WEc1Y2RGeDBYSFJzWlhRZ2RtRnNJRDBnY0dGeWMyVkpiblFvYVc1d2RYUXVkbUZzZFdVcE8xeHVYSFJjZEZ4MFhHNWNkRngwWEhScFppQW9kbUZzSUQ0OUlESXdLU0I3WEc1Y2RGeDBYSFJjZEdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9KeTVxY3kxbGNuSnZjaTF5YjI5dGN5Y3BMbWx1Ym1WeVNGUk5UQ0E5SUNjbk8xeHVYSFJjZEZ4MGZTQmxiSE5sSUh0Y2JseDBYSFJjZEZ4MFpHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWduTG1wekxXVnljbTl5TFhKdmIyMXpKeWt1YVc1dVpYSklWRTFNSUQwZ0oxZGxJR052YjNCbGNtRjBaU0J2Ym14NUlIZHBkR2dnYUc5MFpXd2dNakFySUhKdmIyMXpMaWM3WEc1Y2RGeDBYSFI5WEc1Y2RGeDBmU3dnTVRBd0tUdGNibHgwZlZ4dWZUdGNibHh1YkdWMElHTjFjbkpsYm5SVWIzQlhhVzVrYjNjZ1BTQXdPMXh1WEc1amIyNXpkQ0JqYUdGdVoyVlRkR0Z5Y3lBOUlDaGxLU0E5UGlCN1hHNWNkR3hsZENCemRHRnljeUE5SUdVdVkzVnljbVZ1ZEZSaGNtZGxkQzVuWlhSQmRIUnlhV0oxZEdVb0oyUmhkR0V0ZG1Gc2RXVW5LVHRjYmx4MFhHNWNkR1V1WTNWeWNtVnVkRlJoY21kbGRDNWpiRzl6WlhOMEtDY3VjRzl3ZFhBbktTNXhkV1Z5ZVZObGJHVmpkRzl5UVd4c0tDY3VjRzl3ZFhCZlgyTm9aV05yWW05NEp5a3VabTl5UldGamFDZ29aV3h0TENCcEtTQTlQaUI3WEc1Y2RGeDBaV3h0TG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJGamRHbDJaU2NwTzF4dVhIUmNkR1ZzYlM1eGRXVnllVk5sYkdWamRHOXlLQ2RwYm5CMWRDY3BMbU5vWldOclpXUWdQU0JtWVd4elpUdGNibHgwWEhRdkx5QnBaaUFvYVNzeElDRTlJSE4wWVhKektWeHVYSFJjZEM4dlhHNWNkRngwTHk5Y2JseDBYSFF2THlCcFppQW9hU3N4SUR3OUlITjBZWEp6SUNZbUlHVXVZM1Z5Y21WdWRGUmhjbWRsZEM1amFHVmphMlZrS1NCN1hHNWNkRngwTHk4Z0lDQWdJR1ZzYlM1amJHRnpjMHhwYzNRdVlXUmtLQ2RoWTNScGRtVW5LVHRjYmx4MFhIUXZMeUI5SUdWc2MyVWdlMXh1WEhSY2RDOHZJQ0FnSUNCbGJHMHVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25ZV04wYVhabEp5azdYRzVjZEZ4MEx5OGdmVnh1WEhSOUtUdGNibHgwWlM1amRYSnlaVzUwVkdGeVoyVjBMbU5vWldOclpXUWdQU0IwY25WbE8xeHVYSFJsTG1OMWNuSmxiblJVWVhKblpYUXVjR0Z5Wlc1MFRtOWtaUzVqYkdGemMweHBjM1F1WVdSa0tDZGhZM1JwZG1VbktUdGNibjA3WEc1Y2JtTnZibk4wSUhSdloyZHNaVkpoWkdsdlNHRnVaR3hsY2lBOUlDaGxLU0E5UGlCN1hHNWNkR3hsZENCamRYSnlJRDBnWlM1amRYSnlaVzUwVkdGeVoyVjBMblpoYkhWbE8xeHVYSFJqYjI1emIyeGxMbXh2WnloamRYSnlLVHRjYmx4MFhHNWNkR2xtSUNoa2IyTjFiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlLQ2N1YW5NdGMyaHZkeTF5WVdScGJ5Y3BLVnh1WEhSY2RHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvSnk1cWN5MXphRzkzTFhKaFpHbHZKeWt1YzNSNWJHVXVaR2x6Y0d4aGVTQTlJR04xY25JZ1BUMDlJQ2QwY25WbEp5QS9JQ2RpYkc5amF5YzZJQ2R1YjI1bEp6dGNibHgwWEc1OU8xeHVYRzVqYjI1emRDQnZjR1Z1VUc5d2RYQWdQU0FvWlNrZ1BUNGdlMXh1WEhSc1pYUWdaR0YwWVNBOUlHVXVZM1Z5Y21WdWRGUmhjbWRsZEM1blpYUkJkSFJ5YVdKMWRHVW9KMlJoZEdFdGNHOXdkWEFuS1R0Y2JseDBhV1lnS0UxUlZVVlNXUzV0WVhSamFHVnpLU0I3WEc1Y2RGeDBZM1Z5Y21WdWRGUnZjRmRwYm1SdmR5QTlJSGRwYm1SdmR5NXdZV2RsV1U5bVpuTmxkRHRjYmx4MFhIUmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0NkaWIyUjVKeWt1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25abWw0U1hRbktUdGNibHgwZlZ4dVhIUmNibHgwSkNnbkkyTnZiWEJoYm5rdFkyOTFiblJ5ZVNjcExtbHVkR3hVWld4SmJuQjFkQ2g3WEc1Y2RGeDBhVzVwZEdsaGJFTnZkVzUwY25rNklGd2lZWFYwYjF3aUxGeHVYSFJjZEdkbGIwbHdURzl2YTNWd09pQm5aWFJEYjNWdWRISjVRbmxKVUN4Y2JseDBYSFJqZFhOMGIyMVFiR0ZqWldodmJHUmxjam9nWm5WdVkzUnBiMjRnS0hObGJHVmpkR1ZrUTI5MWJuUnllVkJzWVdObGFHOXNaR1Z5TENCelpXeGxZM1JsWkVOdmRXNTBjbmxFWVhSaEtTQjdYRzVjZEZ4MFhIUnlaWFIxY200Z2MyVnNaV04wWldSRGIzVnVkSEo1UkdGMFlTNXVZVzFsTzF4dVhIUmNkSDBzWEc1Y2RGeDBjSEpsWm1WeWNtVmtRMjkxYm5SeWFXVnpPaUJiWFZ4dVhIUjlLVHRjYmx4MEx5OGdKQ2hjSWlOamIyMXdZVzU1TFdOdmRXNTBjbmxjSWlrdVpXRnplVUYxZEc5amIyMXdiR1YwWlNodmNIUnBiMjV6UTI5MWJuUnllVUYxZEdOdmJXeGxkR1VwTzF4dVhIUmNibHgwSkNnbkkyTnZiWEJoYm5rdGNHaHZibVVuS1M1cGJuUnNWR1ZzU1c1d2RYUW9lMXh1WEhSY2RHbHVhWFJwWVd4RGIzVnVkSEo1T2lCY0ltRjFkRzljSWl4Y2JseDBYSFJuWlc5SmNFeHZiMnQxY0RvZ1oyVjBRMjkxYm5SeWVVSjVTVkFzWEc1Y2RGeDBjSEpsWm1WeWNtVmtRMjkxYm5SeWFXVnpPaUJiWFN4Y2JseDBYSFJ6WlhCaGNtRjBaVVJwWVd4RGIyUmxPaUIwY25WbFhHNWNkSDBwTzF4dVhIUmNibHgwSkNnbkkyaHZkR1ZzTFhCb2IyNWxKeWt1YVc1MGJGUmxiRWx1Y0hWMEtIdGNibHgwWEhScGJtbDBhV0ZzUTI5MWJuUnllVG9nWENKaGRYUnZYQ0lzWEc1Y2RGeDBaMlZ2U1hCTWIyOXJkWEE2SUdkbGRFTnZkVzUwY25sQ2VVbFFMRnh1WEhSY2RIQnlaV1psY25KbFpFTnZkVzUwY21sbGN6b2dXMTBzWEc1Y2RGeDBjMlZ3WVhKaGRHVkVhV0ZzUTI5a1pUb2dkSEoxWlZ4dVhIUjlLVHRjYmx4MFhHNWNkQ1FvSnlOd1pYSnpiMjVoYkMxd2FHOXVaU2NwTG1sdWRHeFVaV3hKYm5CMWRDaDdYRzVjZEZ4MGFXNXBkR2xoYkVOdmRXNTBjbms2SUZ3aVlYVjBiMXdpTEZ4dVhIUmNkR2RsYjBsd1RHOXZhM1Z3T2lCblpYUkRiM1Z1ZEhKNVFubEpVQ3hjYmx4MFhIUndjbVZtWlhKeVpXUkRiM1Z1ZEhKcFpYTTZJRnRkTEZ4dVhIUmNkSE5sY0dGeVlYUmxSR2xoYkVOdlpHVTZJSFJ5ZFdWY2JseDBmU2s3WEc1Y2RGeHVYSFJrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtHQXVjRzl3ZFhCZlh5UjdaR0YwWVgxZ0tTNXpkSGxzWlM1a2FYTndiR0Y1SUQwZ0oySnNiMk5ySnp0Y2JuMDdYRzVjYm1OdmJuTjBJR05zYjNObFVHOXdkWEFnUFNBb1pTa2dQVDRnZTF4dVhIUnNaWFFnZEdGeVoyVjBJRDBnWlM1amRYSnlaVzUwVkdGeVoyVjBPMXh1WEhScFppQW9UVkZWUlZKWkxtMWhkR05vWlhNcElIdGNibHgwWEhSa2IyTjFiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlLQ2RpYjJSNUp5a3VZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25abWw0U1hRbktUdGNibHgwWEhSM2FXNWtiM2N1YzJOeWIyeHNWRzhvTUN3Z1kzVnljbVZ1ZEZSdmNGZHBibVJ2ZHlrN1hHNWNkSDFjYmx4MEpDZ25JMk52YlhCaGJua3RZMjkxYm5SeWVTY3BMbWx1ZEd4VVpXeEpibkIxZENnblpHVnpkSEp2ZVNjcE8xeHVYSFJjYmx4MGRHRnlaMlYwTG1Oc2IzTmxjM1FvSnk1d2IzQjFjQ2NwTG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvSjJsdWNIVjBKeWt1Wm05eVJXRmphQ2dvWlNrZ1BUNGdaUzUyWVd4MVpTQTlJQ2NuS1R0Y2JseDBkR0Z5WjJWMExtTnNiM05sYzNRb0p5NXdiM0IxY0Y5ZlltY25LUzV6ZEhsc1pTNWthWE53YkdGNUlEMGdKMjV2Ym1Vbk8xeHVmVHRjYmx4dVkyOXVjM1FnY0c5d2RYQkNZV05yWjNKdmRXNWtRMnhwWTJzZ1BTQW9aU2tnUFQ0Z2UxeHVYSFJzWlhRZ1ptbHNaV1FnUFNCbVlXeHpaU3hjYmx4MFhIUnBibkIxZEhNZ1BTQmxMbU4xY25KbGJuUlVZWEpuWlhRdWNYVmxjbmxUWld4bFkzUnZja0ZzYkNnbmFXNXdkWFE2Ym05MEtGdDBlWEJsUFZ3aVkyaGxZMnRpYjNoY0lsMHBKeWs3WEc1Y2RHWnZjaUFvYkdWMElHa2dhVzRnYVc1d2RYUnpLU0I3WEc1Y2RGeDBhV1lnS0dsdWNIVjBjMXRwWFM1MllXeDFaVnh1WEhSY2RGeDBKaVlnYVc1d2RYUnpXMmxkTG5aaGJIVmxMbXhsYm1kMGFDQWhQVDBnTUZ4dVhIUmNkRngwSmlZZ2FXNXdkWFJ6VzJsZExtZGxkRUYwZEhKcFluVjBaU2duYm1GdFpTY3BJQ0U5UFNBblkyOTFiblJ5ZVNjcElIdGNibHgwWEhSY2RHWnBiR1ZrSUQwZ2RISjFaVHRjYmx4MFhIUmNkR0p5WldGck8xeHVYSFJjZEgxY2JseDBmVnh1WEhSY2JseDBhV1lnS0NGbWFXeGxaQ2tnZTF4dVhIUmNkQ1FvSnlOamIyMXdZVzU1TFdOdmRXNTBjbmtuS1M1cGJuUnNWR1ZzU1c1d2RYUW9KMlJsYzNSeWIza25LVHRjYmx4MFhIUmNibHgwWEhSbExtTjFjbkpsYm5SVVlYSm5aWFF1Y1hWbGNubFRaV3hsWTNSdmNpZ25MbkJ2Y0hWd0p5a3VjWFZsY25sVFpXeGxZM1J2Y2tGc2JDZ25hVzV3ZFhRbktTNW1iM0pGWVdOb0tDaGxLU0E5UGlCbExuWmhiSFZsSUQwZ0p5Y3BPMXh1WEhSY2RHVXVZM1Z5Y21WdWRGUmhjbWRsZEM1emRIbHNaUzVrYVhOd2JHRjVJRDBnSjI1dmJtVW5PMXh1WEhSOVhHNWNkRnh1ZlR0Y2JseHVZMjl1YzNRZ1oyVjBRMjkxYm5SeWVVSjVTVkFnUFNBb1kyRnNiR0poWTJzcElEMCtJSHRjYmx4MGFXWWdLR2RsZEVOdmIydHBaU2duWTNWeWNtVnVkRU52ZFc1MGNua25LU0FtSmlCblpYUkRiMjlyYVdVb0oyTjFjbkpsYm5SRGIzVnVkSEo1SnlrdWJHVnVaM1JvSUQ0Z01Da2dkMmx1Wkc5M0xtTjFjbkpsYm5SRGIzVnVkSEo1SUQwZ1oyVjBRMjl2YTJsbEtDZGpkWEp5Wlc1MFEyOTFiblJ5ZVNjcE8xeHVYSFJjYmx4MGFXWWdLSGRwYm1SdmR5NWpkWEp5Wlc1MFEyOTFiblJ5ZVNrZ2UxeHVYSFJjZEZ4dVhIUmNkR05oYkd4aVlXTnJLSGRwYm1SdmR5NWpkWEp5Wlc1MFEyOTFiblJ5ZVNrN1hHNWNkSDBnWld4elpTQjdYRzVjZEZ4MEpDNW5aWFFvSjJoMGRIQnpPaTh2YVhCcGJtWnZMbWx2Snl3Z1puVnVZM1JwYjI0Z0tDa2dlMXh1WEhSY2RIMHNJRndpYW5OdmJuQmNJaWt1WVd4M1lYbHpLR1oxYm1OMGFXOXVJQ2h5WlhOd0tTQjdYRzVjZEZ4MFhIUnBaaUFvY21WemNDNXpkR0YwZFhNZ0lUMDlJRFF3TkNrZ2UxeHVYSFJjZEZ4MFhIUnNaWFFnWTI5MWJuUnllVU52WkdVZ1BTQW9jbVZ6Y0NBbUppQnlaWE53TG1OdmRXNTBjbmtwSUQ4Z2NtVnpjQzVqYjNWdWRISjVJRG9nWENKY0lqdGNibHgwWEhSY2RGeDBkMmx1Wkc5M0xtTjFjbkpsYm5SRGIzVnVkSEo1SUQwZ1kyOTFiblJ5ZVVOdlpHVTdYRzVjZEZ4MFhIUmNkSE5sZEVOdmIydHBaU2duWTNWeWNtVnVkRU52ZFc1MGNua25MQ0JqYjNWdWRISjVRMjlrWlN3Z016QXBPMXh1WEhSY2RGeDBYSFJqWVd4c1ltRmpheWhqYjNWdWRISjVRMjlrWlNrN1hHNWNkRngwWEhSOVhHNWNkRngwZlNrN1hHNWNkSDFjYm4wN1hHNWNibU52Ym5OMElITmxkRlpoYkhWbFZHOURiM1Z1ZEhKNUlEMGdLR1VzSUdOdmRXNTBjbmxFWVhSaEtTQTlQaUI3WEc1Y2RHVXVZM1Z5Y21WdWRGUmhjbWRsZEM1MllXeDFaU0E5SUdOdmRXNTBjbmxFWVhSaExtNWhiV1U3WEc1Y2RHbG1JQ2hsTG1OMWNuSmxiblJVWVhKblpYUXVaMlYwUVhSMGNtbGlkWFJsS0NkcFpDY3BJRDA5UFNBblkyOXRjR0Z1ZVMxamIzVnVkSEo1SnlrZ2UxeHVYSFJjZEhObGRGUnBiV1Z2ZFhRb0tDa2dQVDRnZTF4dVhIUmNkRngwSkNobExtTjFjbkpsYm5SVVlYSm5aWFFwTG1Kc2RYSW9LVHRjYmx4MFhIUjlLVHRjYmx4MGZWeHVmVHRjYmx4dVkyOXVjM1FnY21WdVpHVnlRMjl2YTJsbFFtRnVibVZ5SUQwZ0tDa2dQVDRnZTF4dVhIUnNaWFFnWkdsMklEMGdaRzlqZFcxbGJuUXVZM0psWVhSbFJXeGxiV1Z1ZENnblpHbDJKeWs3WEc1Y2RHUnBkaTVqYkdGemMwNWhiV1VnUFNBblkyOXZhMmxsY3kxaVlXNXVaWEluTzF4dVhIUmthWFl1YzJWMFFYUjBjbWxpZFhSbEtDZHBaQ2NzSUNkamIyOXJhV1Z6TFdKaGJtNWxjaWNwTzF4dVhIUmthWFl1YVc1dVpYSklWRTFNSUQwZ0p6eGthWFlnWTJ4aGMzTTlYQ0pqYjI1MFlXbHVaWEpjSWo0OFpHbDJJR05zWVhOelBWd2lZMjl2YTJsbGN5MWlZVzV1WlhKZlgyTnNiM05sWENJK1BDOWthWFkrWEZ4dUp5QXJYRzVjZEZ4MEp6eHdQbFJvYVhNZ2MybDBaU0IxYzJWeklHTnZiMnRwWlhNdUlFSjVJR052Ym5ScGJuVnBibWNnZEc4Z1luSnZkM05sSUhSb1pTQnphWFJsSUhsdmRTQmhjbVVnWVdkeVpXVnBibWNnZEc4Z2IzVnlJSFZ6WlNCdlppQmpiMjlyYVdWekxpQThZU0IwWVhKblpYUTlYQ0pmWW14aGJtdGNJbHhjYmlCb2NtVm1QVndpYUhSMGNEb3ZMMlZqTG1WMWNtOXdZUzVsZFM5cGNHY3ZZbUZ6YVdOekwyeGxaMkZzTDJOdmIydHBaWE12YVc1a1pYaGZaVzR1YUhSdFhDSStSbWx1WkNCdmRYUWdiVzl5WlNCaFltOTFkQ0JqYjI5cmFXVWdhR1Z5WlR3dllUNDhMM0ErUEM5a2FYWStKenRjYmx4MFpHbDJMbkYxWlhKNVUyVnNaV04wYjNJb0p5NWpiMjlyYVdWekxXSmhibTVsY2w5ZlkyeHZjMlVuS1M1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkamJHbGpheWNzSUdOc2IzTmxRMjl2YTJsbFFtRnVibVZ5S1R0Y2JseDBYRzVjZEdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9KMkp2WkhrbktTNXBibk5sY25SQ1pXWnZjbVVvWkdsMkxDQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0NjdWFHVmhaR1Z5SnlrcE8xeHVmVHRjYmx4dVkyOXVjM1FnWTJ4dmMyVkRiMjlyYVdWQ1lXNXVaWElnUFNBb0tTQTlQaUI3WEc1Y2RITmxkRU52YjJ0cFpTZ25ZMjl2YTJsbExXSmhibTVsY2ljc0lIUnlkV1VzSURNMk5TazdYRzVjZEdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9KeU5qYjI5cmFXVnpMV0poYm01bGNpY3BMbkpsYlc5MlpTZ3BPMXh1ZlR0Y2JseHVZMjl1YzNRZ1kyaGxZMnREYjI5cmFXVkNZVzV1WlhJZ1BTQW9LU0E5UGlCN1hHNWNkR2xtSUNnaFoyVjBRMjl2YTJsbEtDZGpiMjlyYVdVdFltRnVibVZ5SnlrcFhHNWNkRngwY21WdVpHVnlRMjl2YTJsbFFtRnVibVZ5S0NrN1hHNTlPMXh1WEc1amIyNXpkQ0JqYjIxdFpXNTBRWFYwYjFOcGVtVWdQU0FvWlNrZ1BUNGdlMXh1WEhSc1pYUWdaV3dnUFNCbExtTjFjbkpsYm5SVVlYSm5aWFE3WEc1Y2RGeHVYSFJsYkM1emRIbHNaUzVvWldsbmFIUWdQU0FuWVhWMGJ5YzdYRzVjZEdWc0xuTjBlV3hsTG1obGFXZG9kQ0E5SUdWc0xuTmpjbTlzYkVobGFXZG9kQ0FySUNkd2VDYzdYRzU5TzF4dVhHNWpiMjV6ZENCamFHRnVaMlZTWVc1blpWTnNhV1JsY2lBOUlDaDJZV3gxWlhNcElEMCtJSHRjYmx4MGJHVjBJR2x1Y0hWMFRXbHVJRDBnWkc5amRXMWxiblF1WjJWMFJXeGxiV1Z1ZEVKNVNXUW9KM0poYm1kbExXbHVjSFYwTFcxcGJpY3BPMXh1WEhSc1pYUWdhVzV3ZFhSTllYZ2dQU0JrYjJOMWJXVnVkQzVuWlhSRmJHVnRaVzUwUW5sSlpDZ25jbUZ1WjJVdGFXNXdkWFF0YldGNEp5azdYRzVjZEZ4dVhIUnBibkIxZEUxcGJpNTJZV3gxWlNBOUlIQmhjbk5sU1c1MEtIWmhiSFZsYzFzd1hTazdYRzVjZEdsdWNIVjBUV0Y0TG5aaGJIVmxJRDBnY0dGeWMyVkpiblFvZG1Gc2RXVnpXekZkS1R0Y2JuMDdYRzVjYm14bGRDQnpkQ0E5SUc1MWJHdzdYRzVqYjI1emRDQmphR0Z1WjJWSmJuQjFkRkpoYm1kbElEMGdLR1VwSUQwK0lIdGNibHgwWTI5dWMzUWdjMnhwWkdWeUlEMGdaRzlqZFcxbGJuUXVaMlYwUld4bGJXVnVkRUo1U1dRb0oyMTFiSFJwTFhKaGJtZGxKeWs3WEc1Y2RHeGxkQ0JqZFhKeVpXNTBJRDBnWlM1amRYSnlaVzUwVkdGeVoyVjBPMXh1WEhSc1pYUWdiV2x1SUQwZ2NHRnljMlZKYm5Rb1kzVnljbVZ1ZEM1blpYUkJkSFJ5YVdKMWRHVW9KMjFwYmljcEtTeGNibHgwWEhSdFlYZ2dQU0J3WVhKelpVbHVkQ2hqZFhKeVpXNTBMbWRsZEVGMGRISnBZblYwWlNnbmJXRjRKeWtwTzF4dVhIUnNaWFFnYVc1d2RYUk5hVzRnUFNCa2IyTjFiV1Z1ZEM1blpYUkZiR1Z0Wlc1MFFubEpaQ2duY21GdVoyVXRhVzV3ZFhRdGJXbHVKeWs3WEc1Y2RHeGxkQ0JwYm5CMWRFMWhlQ0E5SUdSdlkzVnRaVzUwTG1kbGRFVnNaVzFsYm5SQ2VVbGtLQ2R5WVc1blpTMXBibkIxZEMxdFlYZ25LVHRjYmx4MFhHNWNkR05zWldGeVZHbHRaVzkxZENoemRDazdYRzVjZEhOMElEMGdjMlYwVkdsdFpXOTFkQ2dvS1NBOVBpQjdYRzVjZEZ4MFkyOXVjMjlzWlM1c2IyY29ZM1Z5Y21WdWRDNTJZV3gxWlNrN1hHNWNkRngwYVdZZ0tHTjFjbkpsYm5RZ1BUMDlJR2x1Y0hWMFRXbHVLU0I3WEc1Y2RGeDBYSFJwWmlBb2NHRnljMlZKYm5Rb1kzVnljbVZ1ZEM1MllXeDFaU2tnUGlCd1lYSnpaVWx1ZENocGJuQjFkRTFoZUM1MllXeDFaU2twWEc1Y2RGeDBYSFJjZEdOMWNuSmxiblF1ZG1Gc2RXVWdQU0JwYm5CMWRFMWhlQzUyWVd4MVpUdGNibHgwWEhSOUlHVnNjMlVnZTF4dVhIUmNkRngwYVdZZ0tIQmhjbk5sU1c1MEtHTjFjbkpsYm5RdWRtRnNkV1VwSUR3Z2NHRnljMlZKYm5Rb2FXNXdkWFJOYVc0dWRtRnNkV1VwS1Z4dVhIUmNkRngwWEhSamRYSnlaVzUwTG5aaGJIVmxJRDBnYVc1d2RYUk5hVzR1ZG1Gc2RXVTdYRzVjZEZ4MGZWeHVYSFJjZEZ4dVhIUmNkR2xtSUNod1lYSnpaVWx1ZENoamRYSnlaVzUwTG5aaGJIVmxLU0E4SUcxcGJpQjhmQ0J3WVhKelpVbHVkQ2hqZFhKeVpXNTBMblpoYkhWbEtTQStJRzFoZUNCOGZDQnBjMDVoVGlod1lYSnpaVWx1ZENoamRYSnlaVzUwTG5aaGJIVmxLU2twSUh0Y2JseDBYSFJjZEdOMWNuSmxiblF1ZG1Gc2RXVWdQU0JqZFhKeVpXNTBMbWRsZEVGMGRISnBZblYwWlNnbmFXUW5LU0E5UFQwZ0ozSmhibWRsTFdsdWNIVjBMVzFwYmljZ1B5QnRhVzRnT2lCdFlYZzdYRzVjZEZ4MGZWeHVYSFJjZEZ4dVhIUmNkSE5zYVdSbGNpNXViMVZwVTJ4cFpHVnlMbk5sZENoYmFXNXdkWFJOYVc0dWRtRnNkV1VzSUdsdWNIVjBUV0Y0TG5aaGJIVmxYU2s3WEc1Y2RIMHNJRFV3TUNrN1hHNWNkRnh1ZlR0Y2JseHVZMjl1YzNRZ2FXNXBkRTExYkhScFUyeHBaR1Z5SUQwZ0tDa2dQVDRnZTF4dVhIUnNaWFFnYzJ4cFpHVnlJRDBnWkc5amRXMWxiblF1WjJWMFJXeGxiV1Z1ZEVKNVNXUW9KMjExYkhScExYSmhibWRsSnlrN1hHNWNkR3hsZENCM2NtRndJRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25MbkJ2Y0hWd1gxOXlZVzVuWlMxM2NtRndjR1Z5SnlrN1hHNWNkRnh1WEhScFppQW9jMnhwWkdWeUlDWW1JSGR5WVhBcElIdGNibHgwWEhSY2JseDBYSFJzWlhRZ2JXbHVJRDBnY0dGeWMyVkpiblFvZDNKaGNDNW5aWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRiV2x1SnlrcE8xeHVYSFJjZEd4bGRDQnRZWGdnUFNCd1lYSnpaVWx1ZENoM2NtRndMbWRsZEVGMGRISnBZblYwWlNnblpHRjBZUzF0WVhnbktTazdYRzVjZEZ4MFhHNWNkRngwYm05VmFWTnNhV1JsY2k1amNtVmhkR1VvYzJ4cFpHVnlMQ0I3WEc1Y2RGeDBYSFJ6ZEdGeWREb2dXMjFwYmlBcklETXdMQ0J0WVhnZ0xTQXpNRjBzWEc1Y2RGeDBYSFJ6ZEdWd09pQTFMRnh1WEhSY2RGeDBZMjl1Ym1WamREb2dkSEoxWlN4Y2JseDBYSFJjZEhKaGJtZGxPaUI3WEc1Y2RGeDBYSFJjZENkdGFXNG5PaUJ0YVc0c1hHNWNkRngwWEhSY2RDZHRZWGduT2lCdFlYaGNibHgwWEhSY2RIMWNibHgwWEhSOUtUdGNibHgwWEhSY2JseDBYSFJqYUdGdVoyVlNZVzVuWlZOc2FXUmxjaWhiYldsdUlDc2dNekFzSUcxaGVDQXRJRE13WFNrN1hHNWNkRngwWEc1Y2RGeDBjMnhwWkdWeUxtNXZWV2xUYkdsa1pYSXViMjRvSjJOb1lXNW5aU2NzSUdOb1lXNW5aVkpoYm1kbFUyeHBaR1Z5S1R0Y2JseDBmVnh1ZlR0Y2JseHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQndiM0IxY0VoaGJtUnNaWEp6T3lKZGZRPT0ifQ==
