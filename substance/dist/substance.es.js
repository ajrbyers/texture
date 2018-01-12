class ChangeStore {
  constructor(seed) {
    this._changes = seed || {};
  }

  
  getChanges(documentId, sinceVersion, toVersion, cb) {
    if (typeof sinceVersion === 'function') {
      cb = sinceVersion;
      sinceVersion = 0;
    } else if (typeof toVersion === 'function') {
      cb = toVersion;
      toVersion = undefined;
    }
    if (!(documentId && sinceVersion >= 0 && cb)) {
      throw new Error('Invalid arguments')
    }
    let version = this._getVersion(documentId);
    let changes = this._getChanges(documentId);
    changes = changes.slice(sinceVersion, toVersion);
    cb(null, changes, version);
  }

  
  addChange(documentId, change, cb) {
    if (!documentId || !change) {
      throw new Error('Invalid arguments')
    }
    this._addChange(documentId, change);
    let newVersion = this._getVersion(documentId);
    cb(null, newVersion);
  }

  
  deleteChanges(documentId, cb) {
    var deletedChanges = this._deleteChanges(documentId);
    cb(null, deletedChanges.length);
  }

  
  getVersion(id, cb) {
    cb(null, this._getVersion(id));
  }

  
  

  _deleteChanges(documentId) {
    var changes = this._getChanges(documentId);
    delete this._changes[documentId];
    return changes
  }

  _getVersion(documentId) {
    var changes = this._changes[documentId];
    return changes ? changes.length : 0
  }

  _getChanges(documentId) {
    return this._changes[documentId] || []
  }

  _addChange(documentId, change) {
    if (!this._changes[documentId]) {
      this._changes[documentId] = [];
    }
    this._changes[documentId].push(change);
  }
}

function series(tasks, cb, i) {
  i = i || 0;
  tasks[i](function(err) {
    
    if (err) return cb(err)
    if (i === tasks.length-1) {
      cb(...arguments); 
    } else {
      series(tasks, cb, i + 1);
    }
  });
}

var async = Object.freeze({
	series: series
});

class ArrayIterator {

  constructor(arr) {
    this.arr = arr;
    this.pos = -1;
  }

  get _isArrayIterator() {
    return true
  }

  
  hasNext() {
    return this.pos < this.arr.length - 1
  }

  
  next() {
    this.pos += 1;
    var next = this.arr[this.pos];
    return next
  }

  
  back() {
    if (this.pos >= 0) {
      this.pos -= 1;
    }
    return this
  }

  peek() {
    return this.arr[this.pos+1]
  }

}

function deleteFromArray(array, value) {
  if (!array) return
  for (var i = 0; i < array.length; i++) {
    if (array[i] === value) {
      array.splice(i, 1);
      i--;
    }
  }
}

class ArrayTree {
  add(path, val) {
    if (!this[path]) {
      this[path] = [];
    }
    this[path].push(val);
  }
  remove(path, val) {
    if (this[path]) {
      deleteFromArray(this[path], val);
    }
  }
  get(path) {
    return this[path] || []
  }
}

function array2table(keys) {
  return keys.reduce((obj, key) => {
    obj[key] = true;
    return obj
  }, {})
}

function checkGlobal(value) {
  return (value && value.Object === Object) ? value : null;
}

var freeGlobal = checkGlobal(typeof global == 'object' && global);


var freeSelf = checkGlobal(typeof self == 'object' && self);


var thisGlobal = checkGlobal(typeof undefined == 'object' && undefined);


var root = freeGlobal || freeSelf || thisGlobal || Function('return this')();

var Symbol = root.Symbol;

function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

var symbolTag = '[object Symbol]';


var objectProto = Object.prototype;


var objectToString = objectProto.toString;


function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

var INFINITY = 1 / 0;


var symbolProto = Symbol ? Symbol.prototype : undefined;
var symbolToString = symbolProto ? symbolProto.toString : undefined;


function baseToString(value) {
  
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

function toString(value) {
  return value == null ? '' : baseToString(value);
}

function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : baseSlice(array, start, end);
}

var rsAstralRange = '\\ud800-\\udfff';
var rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23';
var rsComboSymbolsRange = '\\u20d0-\\u20f0';
var rsVarRange = '\\ufe0e\\ufe0f';


var rsZWJ = '\\u200d';


var reHasComplexSymbol = RegExp('[' + rsZWJ + rsAstralRange  + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');

var rsAstralRange$1 = '\\ud800-\\udfff';
var rsComboMarksRange$1 = '\\u0300-\\u036f\\ufe20-\\ufe23';
var rsComboSymbolsRange$1 = '\\u20d0-\\u20f0';
var rsVarRange$1 = '\\ufe0e\\ufe0f';


var rsAstral = '[' + rsAstralRange$1 + ']';
var rsCombo = '[' + rsComboMarksRange$1 + rsComboSymbolsRange$1 + ']';
var rsFitz = '\\ud83c[\\udffb-\\udfff]';
var rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')';
var rsNonAstral = '[^' + rsAstralRange$1 + ']';
var rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
var rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]';
var rsZWJ$1 = '\\u200d';


var reOptMod = rsModifier + '?';
var rsOptVar = '[' + rsVarRange$1 + ']?';
var rsOptJoin = '(?:' + rsZWJ$1 + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*';
var rsSeq = rsOptVar + reOptMod + rsOptJoin;
var rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';


var reComplexSymbol = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');


function stringToArray(string) {
  return string.match(reComplexSymbol);
}

function createCaseFirst(methodName) {
  return function(string) {
    string = toString(string);

    var strSymbols = reHasComplexSymbol.test(string)
      ? stringToArray(string)
      : undefined;

    var chr = strSymbols
      ? strSymbols[0]
      : string.charAt(0);

    var trailing = strSymbols
      ? castSlice(strSymbols, 1).join('')
      : string.slice(1);

    return chr[methodName]() + trailing;
  };
}

var upperFirst = createCaseFirst('toUpperCase');

function capitalize(string) {
  return upperFirst(toString(string).toLowerCase());
}

function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

var deburredLetters = {
  '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
  '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
  '\xc7': 'C',  '\xe7': 'c',
  '\xd0': 'D',  '\xf0': 'd',
  '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
  '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
  '\xcC': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
  '\xeC': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
  '\xd1': 'N',  '\xf1': 'n',
  '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
  '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
  '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
  '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
  '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
  '\xc6': 'Ae', '\xe6': 'ae',
  '\xde': 'Th', '\xfe': 'th',
  '\xdf': 'ss'
};


function deburrLetter(letter) {
  return deburredLetters[letter];
}

var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;


var rsComboMarksRange$2 = '\\u0300-\\u036f\\ufe20-\\ufe23';
var rsComboSymbolsRange$2 = '\\u20d0-\\u20f0';


var rsCombo$1 = '[' + rsComboMarksRange$2 + rsComboSymbolsRange$2 + ']';


var reComboMark = RegExp(rsCombo$1, 'g');


function deburr(string) {
  string = toString(string);
  return string && string.replace(reLatin1, deburrLetter).replace(reComboMark, '');
}

var reBasicWord = /[a-zA-Z0-9]+/g;


var rsAstralRange$2 = '\\ud800-\\udfff';
var rsComboMarksRange$3 = '\\u0300-\\u036f\\ufe20-\\ufe23';
var rsComboSymbolsRange$3 = '\\u20d0-\\u20f0';
var rsDingbatRange = '\\u2700-\\u27bf';
var rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff';
var rsMathOpRange = '\\xac\\xb1\\xd7\\xf7';
var rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf';
var rsPunctuationRange = '\\u2000-\\u206f';
var rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000';
var rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde';
var rsVarRange$2 = '\\ufe0e\\ufe0f';
var rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;


var rsApos$1 = "['\u2019]";
var rsBreak = '[' + rsBreakRange + ']';
var rsCombo$2 = '[' + rsComboMarksRange$3 + rsComboSymbolsRange$3 + ']';
var rsDigits = '\\d+';
var rsDingbat = '[' + rsDingbatRange + ']';
var rsLower = '[' + rsLowerRange + ']';
var rsMisc = '[^' + rsAstralRange$2 + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']';
var rsFitz$1 = '\\ud83c[\\udffb-\\udfff]';
var rsModifier$1 = '(?:' + rsCombo$2 + '|' + rsFitz$1 + ')';
var rsNonAstral$1 = '[^' + rsAstralRange$2 + ']';
var rsRegional$1 = '(?:\\ud83c[\\udde6-\\uddff]){2}';
var rsSurrPair$1 = '[\\ud800-\\udbff][\\udc00-\\udfff]';
var rsUpper = '[' + rsUpperRange + ']';
var rsZWJ$2 = '\\u200d';


var rsLowerMisc = '(?:' + rsLower + '|' + rsMisc + ')';
var rsUpperMisc = '(?:' + rsUpper + '|' + rsMisc + ')';
var rsOptLowerContr = '(?:' + rsApos$1 + '(?:d|ll|m|re|s|t|ve))?';
var rsOptUpperContr = '(?:' + rsApos$1 + '(?:D|LL|M|RE|S|T|VE))?';
var reOptMod$1 = rsModifier$1 + '?';
var rsOptVar$1 = '[' + rsVarRange$2 + ']?';
var rsOptJoin$1 = '(?:' + rsZWJ$2 + '(?:' + [rsNonAstral$1, rsRegional$1, rsSurrPair$1].join('|') + ')' + rsOptVar$1 + reOptMod$1 + ')*';
var rsSeq$1 = rsOptVar$1 + reOptMod$1 + rsOptJoin$1;
var rsEmoji = '(?:' + [rsDingbat, rsRegional$1, rsSurrPair$1].join('|') + ')' + rsSeq$1;


var reComplexWord = RegExp([
  rsUpper + '?' + rsLower + '+' + rsOptLowerContr + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
  rsUpperMisc + '+' + rsOptUpperContr + '(?=' + [rsBreak, rsUpper + rsLowerMisc, '$'].join('|') + ')',
  rsUpper + '?' + rsLowerMisc + '+' + rsOptLowerContr,
  rsUpper + '+' + rsOptUpperContr,
  rsDigits,
  rsEmoji
].join('|'), 'g');


var reHasComplexWord = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;


function words(string, pattern, guard) {
  string = toString(string);
  pattern = guard ? undefined : pattern;

  if (pattern === undefined) {
    pattern = reHasComplexWord.test(string) ? reComplexWord : reBasicWord;
  }
  return string.match(pattern) || [];
}

var rsApos = "['\u2019]";


var reApos = RegExp(rsApos, 'g');


function createCompounder(callback) {
  return function(string) {
    return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
  };
}

var camelCase = createCompounder(function(result, word, index) {
  word = word.toLowerCase();
  return result + (index ? capitalize(word) : word);
});

function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

function now() {
  return Date.now();
}

var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';


var objectProto$1 = Object.prototype;


var objectToString$1 = objectProto$1.toString;


function isFunction(value) {
  
  
  
  var tag = isObject(value) ? objectToString$1.call(value) : '';
  return tag == funcTag || tag == genTag;
}

var NAN = 0 / 0;


var reTrim = /^\s+|\s+$/g;


var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;


var reIsBinary = /^0b[01]+$/i;


var reIsOctal = /^0o[0-7]+$/i;


var freeParseInt = parseInt;


function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = isFunction(value.valueOf) ? value.valueOf() : value;
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

var FUNC_ERROR_TEXT = 'Expected a function';


var nativeMax = Math.max;
var nativeMin = Math.min;


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
    
    lastInvokeTime = time;
    
    timerId = setTimeout(timerExpired, wait);
    
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    
    
    
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    
    
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
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

var isArray = Array.isArray;

function isHostObject(value) {
  
  
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

var coreJsData = root['__core-js_shared__'];

var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());


function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var funcToString$1 = Function.prototype.toString;


function toSource(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;


var reIsHostCtor = /^\[object .+?Constructor\]$/;


var objectProto$2 = Object.prototype;


var funcToString = Function.prototype.toString;


var hasOwnProperty = objectProto$2.hasOwnProperty;


var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);


function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

function getValue(object, key) {
  return object == null ? undefined : object[key];
}

function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

var nativeCreate = getNative(Object, 'create');

function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

var HASH_UNDEFINED = '__lodash_hash_undefined__';


var objectProto$3 = Object.prototype;


var hasOwnProperty$1 = objectProto$3.hasOwnProperty;


function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$1.call(data, key) ? data[key] : undefined;
}

var objectProto$4 = Object.prototype;


var hasOwnProperty$2 = objectProto$4.hasOwnProperty;


function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty$2.call(data, key);
}

var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';


function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}


Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

function listCacheClear() {
  this.__data__ = [];
}

function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var arrayProto = Array.prototype;


var splice = arrayProto.splice;


function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}


ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

var Map$1 = getNative(root, 'Map');

function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map$1 || ListCache),
    'string': new Hash
  };
}

function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}


MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

var FUNC_ERROR_TEXT$1 = 'Expected a function';


function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}


memoize.Cache = MapCache;

var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(\.|\[\])(?:\4|$))/g;


var reEscapeChar = /\\(\\)?/g;


var stringToPath = memoize(function(string) {
  var result = [];
  toString(string).replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var reIsPlainProp = /^\w*$/;


function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

var INFINITY$1 = 1 / 0;


function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

function stackClear() {
  this.__data__ = new ListCache;
}

function stackDelete(key) {
  return this.__data__['delete'](key);
}

function stackGet(key) {
  return this.__data__.get(key);
}

function stackHas(key) {
  return this.__data__.has(key);
}

var LARGE_ARRAY_SIZE = 200;


function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache && cache.__data__.length == LARGE_ARRAY_SIZE) {
    cache = this.__data__ = new MapCache(cache.__data__);
  }
  cache.set(key, value);
  return this;
}

function Stack(entries) {
  this.__data__ = new ListCache(entries);
}


Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';


function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

function setCacheHas(value) {
  return this.__data__.has(value);
}

function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}


SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

function arraySome(array, predicate) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

var UNORDERED_COMPARE_FLAG$1 = 1;
var PARTIAL_COMPARE_FLAG$2 = 2;


function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG$2,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  
  var stacked = stack.get(array);
  if (stacked) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & UNORDERED_COMPARE_FLAG$1) ? new SetCache : undefined;

  stack.set(array, other);

  
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!seen.has(othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
              return seen.add(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, customizer, bitmask, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  return result;
}

var Uint8Array = root.Uint8Array;

function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var UNORDERED_COMPARE_FLAG$2 = 1;
var PARTIAL_COMPARE_FLAG$3 = 2;


var boolTag = '[object Boolean]';
var dateTag = '[object Date]';
var errorTag = '[object Error]';
var mapTag = '[object Map]';
var numberTag = '[object Number]';
var regexpTag = '[object RegExp]';
var setTag = '[object Set]';
var stringTag = '[object String]';
var symbolTag$1 = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]';
var dataViewTag = '[object DataView]';


var symbolProto$1 = Symbol ? Symbol.prototype : undefined;
var symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;


function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
      
      
      
      return +object == +other;

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case numberTag:
      
      return (object != +object) ? other != +other : object == +other;

    case regexpTag:
    case stringTag:
      
      
      
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG$3;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= UNORDERED_COMPARE_FLAG$2;
      stack.set(object, other);

      
      return equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);

    case symbolTag$1:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

var nativeGetPrototype = Object.getPrototypeOf;


function getPrototype(value) {
  return nativeGetPrototype(Object(value));
}

var objectProto$6 = Object.prototype;


var hasOwnProperty$4 = objectProto$6.hasOwnProperty;


function baseHas(object, key) {
  
  
  
  return object != null &&
    (hasOwnProperty$4.call(object, key) ||
      (typeof object == 'object' && key in object && getPrototype(object) === null));
}

var nativeKeys = Object.keys;


function baseKeys(object) {
  return nativeKeys(Object(object));
}

function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

var getLength = baseProperty('length');

var MAX_SAFE_INTEGER = 9007199254740991;


function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

function isArrayLike(value) {
  return value != null && isLength(getLength(value)) && !isFunction(value);
}

function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

var argsTag$1 = '[object Arguments]';


var objectProto$7 = Object.prototype;


var hasOwnProperty$5 = objectProto$7.hasOwnProperty;


var objectToString$2 = objectProto$7.toString;


var propertyIsEnumerable = objectProto$7.propertyIsEnumerable;


function isArguments(value) {
  
  return isArrayLikeObject(value) && hasOwnProperty$5.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString$2.call(value) == argsTag$1);
}

var stringTag$1 = '[object String]';


var objectProto$8 = Object.prototype;


var objectToString$3 = objectProto$8.toString;


function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && objectToString$3.call(value) == stringTag$1);
}

function indexKeys(object) {
  var length = object ? object.length : undefined;
  if (isLength(length) &&
      (isArray(object) || isString(object) || isArguments(object))) {
    return baseTimes(length, String);
  }
  return null;
}

var MAX_SAFE_INTEGER$1 = 9007199254740991;


var reIsUint = /^(?:0|[1-9]\d*)$/;


function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

var objectProto$9 = Object.prototype;


function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$9;

  return value === proto;
}

function keys(object) {
  var isProto = isPrototype(object);
  if (!(isProto || isArrayLike(object))) {
    return baseKeys(object);
  }
  var indexes = indexKeys(object),
      skipIndexes = !!indexes,
      result = indexes || [],
      length = result.length;

  for (var key in object) {
    if (baseHas(object, key) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length))) &&
        !(isProto && key == 'constructor')) {
      result.push(key);
    }
  }
  return result;
}

var PARTIAL_COMPARE_FLAG$4 = 2;


function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG$4,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : baseHas(other, key))) {
      return false;
    }
  }
  
  var stacked = stack.get(object);
  if (stacked) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  return result;
}

var DataView = getNative(root, 'DataView');

var Promise$1 = getNative(root, 'Promise');

var Set$1 = getNative(root, 'Set');

var WeakMap$1 = getNative(root, 'WeakMap');

var mapTag$1 = '[object Map]';
var objectTag$1 = '[object Object]';
var promiseTag = '[object Promise]';
var setTag$1 = '[object Set]';
var weakMapTag = '[object WeakMap]';

var dataViewTag$1 = '[object DataView]';


var objectProto$10 = Object.prototype;


var objectToString$4 = objectProto$10.toString;


var dataViewCtorString = toSource(DataView);
var mapCtorString = toSource(Map$1);
var promiseCtorString = toSource(Promise$1);
var setCtorString = toSource(Set$1);
var weakMapCtorString = toSource(WeakMap$1);


function getTag(value) {
  return objectToString$4.call(value);
}



if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$1) ||
    (Map$1 && getTag(new Map$1) != mapTag$1) ||
    (Promise$1 && getTag(Promise$1.resolve()) != promiseTag) ||
    (Set$1 && getTag(new Set$1) != setTag$1) ||
    (WeakMap$1 && getTag(new WeakMap$1) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString$4.call(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$1;
        case mapCtorString: return mapTag$1;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$1;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

var getTag$1 = getTag;

var argsTag$2 = '[object Arguments]';
var arrayTag$1 = '[object Array]';
var boolTag$1 = '[object Boolean]';
var dateTag$1 = '[object Date]';
var errorTag$1 = '[object Error]';
var funcTag$1 = '[object Function]';
var mapTag$2 = '[object Map]';
var numberTag$1 = '[object Number]';
var objectTag$2 = '[object Object]';
var regexpTag$1 = '[object RegExp]';
var setTag$2 = '[object Set]';
var stringTag$2 = '[object String]';
var weakMapTag$1 = '[object WeakMap]';

var arrayBufferTag$1 = '[object ArrayBuffer]';
var dataViewTag$2 = '[object DataView]';
var float32Tag = '[object Float32Array]';
var float64Tag = '[object Float64Array]';
var int8Tag = '[object Int8Array]';
var int16Tag = '[object Int16Array]';
var int32Tag = '[object Int32Array]';
var uint8Tag = '[object Uint8Array]';
var uint8ClampedTag = '[object Uint8ClampedArray]';
var uint16Tag = '[object Uint16Array]';
var uint32Tag = '[object Uint32Array]';


var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$1] =
typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] =
typedArrayTags[dataViewTag$2] = typedArrayTags[dateTag$1] =
typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag$2] = typedArrayTags[numberTag$1] =
typedArrayTags[objectTag$2] = typedArrayTags[regexpTag$1] =
typedArrayTags[setTag$2] = typedArrayTags[stringTag$2] =
typedArrayTags[weakMapTag$1] = false;


var objectProto$11 = Object.prototype;


var objectToString$5 = objectProto$11.toString;


function isTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[objectToString$5.call(value)];
}

var PARTIAL_COMPARE_FLAG$1 = 2;


var argsTag = '[object Arguments]';
var arrayTag = '[object Array]';
var objectTag = '[object Object]';


var objectProto$5 = Object.prototype;


var hasOwnProperty$3 = objectProto$5.hasOwnProperty;


function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = getTag$1(object);
    objTag = objTag == argsTag ? objectTag : objTag;
  }
  if (!othIsArr) {
    othTag = getTag$1(other);
    othTag = othTag == argsTag ? objectTag : othTag;
  }
  var objIsObj = objTag == objectTag && !isHostObject(object),
      othIsObj = othTag == objectTag && !isHostObject(other),
      isSameTag = objTag == othTag;

  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
  }
  if (!(bitmask & PARTIAL_COMPARE_FLAG$1)) {
    var objIsWrapped = objIsObj && hasOwnProperty$3.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$3.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
}

function baseIsEqual(value, other, customizer, bitmask, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
}

var UNORDERED_COMPARE_FLAG = 1;
var PARTIAL_COMPARE_FLAG = 2;


function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

function isStrictComparable(value) {
  return value === value && !isObject(value);
}

function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

function hasPath(object, path, hasFunc) {
  path = isKey(path, object) ? [path] : castPath(path);

  var result,
      index = -1,
      length = path.length;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result) {
    return result;
  }
  var length = object ? object.length : 0;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isString(object) || isArguments(object));
}

function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

var UNORDERED_COMPARE_FLAG$3 = 1;
var PARTIAL_COMPARE_FLAG$5 = 2;


function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG$3 | PARTIAL_COMPARE_FLAG$5);
  };
}

function identity(value) {
  return value;
}

function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

function baseIteratee(value) {
  
  
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    predicate = baseIteratee(predicate, 3);
    if (!isArrayLike(collection)) {
      var props = keys(collection);
    }
    var index = findIndexFunc(props || collection, function(value, key) {
      if (props) {
        key = value;
        value = iterable[key];
      }
      return predicate(value, key, iterable);
    }, fromIndex);
    return index > -1 ? collection[props ? props[index] : index] : undefined;
  };
}

function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

var INFINITY$2 = 1 / 0;
var MAX_INTEGER = 1.7976931348623157e+308;


function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY$2 || value === -INFINITY$2) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

var nativeMax$1 = Math.max;


function findIndex(array, predicate, fromIndex) {
  var length = array ? array.length : 0;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax$1(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

var find = createFind(findIndex);

function isMatch(object, source) {
  return object === source || baseIsMatch(object, source, getMatchData(source));
}

function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq(object[key], value)) ||
      (typeof key == 'number' && value === undefined && !(key in object))) {
    object[key] = value;
  }
}

var objectProto$12 = Object.prototype;


var hasOwnProperty$6 = objectProto$12.hasOwnProperty;


function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$6.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : source[key];

    assignValue(object, key, newValue);
  }
  return object;
}

function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var result = new buffer.constructor(buffer.length);
  buffer.copy(result);
  return result;
}

function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

function stubArray() {
  return [];
}

var getOwnPropertySymbols = Object.getOwnPropertySymbols;


function getSymbols(object) {
  
  
  return getOwnPropertySymbols(Object(object));
}


if (!getOwnPropertySymbols) {
  getSymbols = stubArray;
}

var getSymbols$1 = getSymbols;

function copySymbols(source, object) {
  return copyObject(source, getSymbols$1(source), object);
}

function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols$1);
}

var objectProto$13 = Object.prototype;


var hasOwnProperty$7 = objectProto$13.hasOwnProperty;


function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  
  if (length && typeof array[0] == 'string' && hasOwnProperty$7.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

function addMapEntry(map, pair) {
  
  map.set(pair[0], pair[1]);
  return map;
}

function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

var reFlags = /\w*$/;


function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

function addSetEntry(set, value) {
  set.add(value);
  return set;
}

function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

var symbolProto$2 = Symbol ? Symbol.prototype : undefined;
var symbolValueOf$1 = symbolProto$2 ? symbolProto$2.valueOf : undefined;


function cloneSymbol(symbol) {
  return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol)) : {};
}

function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

var boolTag$3 = '[object Boolean]';
var dateTag$3 = '[object Date]';
var mapTag$4 = '[object Map]';
var numberTag$3 = '[object Number]';
var regexpTag$3 = '[object RegExp]';
var setTag$4 = '[object Set]';
var stringTag$4 = '[object String]';
var symbolTag$3 = '[object Symbol]';

var arrayBufferTag$3 = '[object ArrayBuffer]';
var dataViewTag$4 = '[object DataView]';
var float32Tag$2 = '[object Float32Array]';
var float64Tag$2 = '[object Float64Array]';
var int8Tag$2 = '[object Int8Array]';
var int16Tag$2 = '[object Int16Array]';
var int32Tag$2 = '[object Int32Array]';
var uint8Tag$2 = '[object Uint8Array]';
var uint8ClampedTag$2 = '[object Uint8ClampedArray]';
var uint16Tag$2 = '[object Uint16Array]';
var uint32Tag$2 = '[object Uint32Array]';


function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$3:
      return cloneArrayBuffer(object);

    case boolTag$3:
    case dateTag$3:
      return new Ctor(+object);

    case dataViewTag$4:
      return cloneDataView(object, isDeep);

    case float32Tag$2: case float64Tag$2:
    case int8Tag$2: case int16Tag$2: case int32Tag$2:
    case uint8Tag$2: case uint8ClampedTag$2: case uint16Tag$2: case uint32Tag$2:
      return cloneTypedArray(object, isDeep);

    case mapTag$4:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag$3:
    case stringTag$4:
      return new Ctor(object);

    case regexpTag$3:
      return cloneRegExp(object);

    case setTag$4:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag$3:
      return cloneSymbol(object);
  }
}

var objectCreate = Object.create;


function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

function stubFalse() {
  return false;
}

var freeExports = typeof exports == 'object' && exports;


var freeModule = freeExports && typeof module == 'object' && module;


var moduleExports = freeModule && freeModule.exports === freeExports;


var Buffer = moduleExports ? root.Buffer : undefined;


var isBuffer = !Buffer ? stubFalse : function(value) {
  return value instanceof Buffer;
};

var argsTag$3 = '[object Arguments]';
var arrayTag$2 = '[object Array]';
var boolTag$2 = '[object Boolean]';
var dateTag$2 = '[object Date]';
var errorTag$2 = '[object Error]';
var funcTag$2 = '[object Function]';
var genTag$1 = '[object GeneratorFunction]';
var mapTag$3 = '[object Map]';
var numberTag$2 = '[object Number]';
var objectTag$3 = '[object Object]';
var regexpTag$2 = '[object RegExp]';
var setTag$3 = '[object Set]';
var stringTag$3 = '[object String]';
var symbolTag$2 = '[object Symbol]';
var weakMapTag$2 = '[object WeakMap]';

var arrayBufferTag$2 = '[object ArrayBuffer]';
var dataViewTag$3 = '[object DataView]';
var float32Tag$1 = '[object Float32Array]';
var float64Tag$1 = '[object Float64Array]';
var int8Tag$1 = '[object Int8Array]';
var int16Tag$1 = '[object Int16Array]';
var int32Tag$1 = '[object Int32Array]';
var uint8Tag$1 = '[object Uint8Array]';
var uint8ClampedTag$1 = '[object Uint8ClampedArray]';
var uint16Tag$1 = '[object Uint16Array]';
var uint32Tag$1 = '[object Uint32Array]';


var cloneableTags = {};
cloneableTags[argsTag$3] = cloneableTags[arrayTag$2] =
cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$3] =
cloneableTags[boolTag$2] = cloneableTags[dateTag$2] =
cloneableTags[float32Tag$1] = cloneableTags[float64Tag$1] =
cloneableTags[int8Tag$1] = cloneableTags[int16Tag$1] =
cloneableTags[int32Tag$1] = cloneableTags[mapTag$3] =
cloneableTags[numberTag$2] = cloneableTags[objectTag$3] =
cloneableTags[regexpTag$2] = cloneableTags[setTag$3] =
cloneableTags[stringTag$3] = cloneableTags[symbolTag$2] =
cloneableTags[uint8Tag$1] = cloneableTags[uint8ClampedTag$1] =
cloneableTags[uint16Tag$1] = cloneableTags[uint32Tag$1] = true;
cloneableTags[errorTag$2] = cloneableTags[funcTag$2] =
cloneableTags[weakMapTag$2] = false;


function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag$1(value),
        isFunc = tag == funcTag$2 || tag == genTag$1;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag$3 || tag == argsTag$3 || (isFunc && !object)) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

var objectTag$4 = '[object Object]';


var objectProto$14 = Object.prototype;


var funcToString$2 = Function.prototype.toString;


var hasOwnProperty$8 = objectProto$14.hasOwnProperty;


var objectCtorString = funcToString$2.call(Object);


var objectToString$6 = objectProto$14.toString;


function isPlainObject(value) {
  if (!isObjectLike(value) ||
      objectToString$6.call(value) != objectTag$4 || isHostObject(value)) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$8.call(proto, 'constructor') && proto.constructor;
  return (typeof Ctor == 'function' &&
    Ctor instanceof Ctor && funcToString$2.call(Ctor) == objectCtorString);
}

var Reflect = root.Reflect;

function iteratorToArray(iterator) {
  var data,
      result = [];

  while (!(data = iterator.next()).done) {
    result.push(data.value);
  }
  return result;
}

var objectProto$16 = Object.prototype;


var enumerate = Reflect ? Reflect.enumerate : undefined;
var propertyIsEnumerable$1 = objectProto$16.propertyIsEnumerable;


function baseKeysIn(object) {
  object = object == null ? object : Object(object);

  var result = [];
  for (var key in object) {
    result.push(key);
  }
  return result;
}


if (enumerate && !propertyIsEnumerable$1.call({ 'valueOf': 1 }, 'valueOf')) {
  baseKeysIn = function(object) {
    return iteratorToArray(enumerate(object));
  };
}

var baseKeysIn$1 = baseKeysIn;

var objectProto$15 = Object.prototype;


var hasOwnProperty$9 = objectProto$15.hasOwnProperty;


function keysIn(object) {
  var index = -1,
      isProto = isPrototype(object),
      props = baseKeysIn$1(object),
      propsLength = props.length,
      indexes = indexKeys(object),
      skipIndexes = !!indexes,
      result = indexes || [],
      length = result.length;

  while (++index < propsLength) {
    var key = props[index];
    if (!(skipIndexes && (key == 'length' || isIndex(key, length))) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty$9.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}

function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = object[key],
      srcValue = source[key],
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    newValue = srcValue;
    if (isArray(srcValue) || isTypedArray(srcValue)) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else {
        isCommon = false;
        newValue = baseClone(srcValue, true);
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
        isCommon = false;
        newValue = baseClone(srcValue, true);
      }
      else {
        newValue = objValue;
      }
    }
    else {
      isCommon = false;
    }
  }
  stack.set(srcValue, newValue);

  if (isCommon) {
    
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
  }
  stack['delete'](srcValue);
  assignMergeValue(object, key, newValue);
}

function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  if (!(isArray(source) || isTypedArray(source))) {
    var props = keysIn(source);
  }
  arrayEach(props || source, function(srcValue, key) {
    if (props) {
      key = srcValue;
      srcValue = source[key];
    }
    if (isObject(srcValue)) {
      stack || (stack = new Stack);
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(object[key], srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  });
}

function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

function apply(func, thisArg, args) {
  var length = args.length;
  switch (length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

var FUNC_ERROR_TEXT$2 = 'Expected a function';


var nativeMax$2 = Math.max;


function rest(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$2);
  }
  start = nativeMax$2(start === undefined ? (func.length - 1) : toInteger(start), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax$2(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, array);
      case 1: return func.call(this, args[0], array);
      case 2: return func.call(this, args[0], args[1], array);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

function createAssigner(assigner) {
  return rest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

var merge = createAssigner(function(object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});

var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
  baseMerge(object, source, srcIndex, customizer);
});

function baseSet(object, path, value, customizer) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]);
    if (isObject(nested)) {
      var newValue = value;
      if (index != lastIndex) {
        var objValue = nested[key];
        newValue = customizer ? customizer(objValue, key, nested) : undefined;
        if (newValue === undefined) {
          newValue = objValue == null
            ? (isIndex(path[index + 1]) ? [] : {})
            : objValue;
        }
      }
      assignValue(nested, key, newValue);
    }
    nested = nested[key];
  }
  return object;
}

function setWith(object, path, value, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return object == null ? object : baseSet(object, path, value, customizer);
}

function indexOfNaN(array, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    var other = array[index];
    if (other !== other) {
      return index;
    }
  }
  return -1;
}

function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return indexOfNaN(array, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

function cacheHas(cache, key) {
  return cache.has(key);
}

function noop() {
  
}

var INFINITY$3 = 1 / 0;


var createSet = !(Set$1 && (1 / setToArray(new Set$1([,-0]))[1]) == INFINITY$3) ? noop : function(values) {
  return new Set$1(values);
};

var LARGE_ARRAY_SIZE$1 = 200;


function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE$1) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

function uniq(array) {
  return (array && array.length)
    ? baseUniq(array)
    : [];
}

function last(array) {
  var length = array ? array.length : 0;
  return length ? array[length - 1] : undefined;
}

function parent(object, path) {
  return path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
}

function baseUnset(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);
  object = parent(object, path);

  var key = toKey(last(path));
  return !(object != null && baseHas(object, key)) || delete object[key];
}

function unset(object, path) {
  return object == null ? true : baseUnset(object, path);
}

function arrayMap(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var LARGE_ARRAY_SIZE$2 = 200;


function baseDifference(array, values, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      isCommon = true,
      length = array.length,
      result = [],
      valuesLength = values.length;

  if (!length) {
    return result;
  }
  if (iteratee) {
    values = arrayMap(values, baseUnary(iteratee));
  }
  if (comparator) {
    includes = arrayIncludesWith;
    isCommon = false;
  }
  else if (values.length >= LARGE_ARRAY_SIZE$2) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

var without = rest(function(array, values) {
  return isArrayLikeObject(array)
    ? baseDifference(array, values)
    : [];
});

function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

var baseFor = createBaseFor();

function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

var baseEach = createBaseEach(baseForOwn);

function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

function baseSortBy(array, comparer) {
  var length = array.length;

  array.sort(comparer);
  while (length--) {
    array[length] = array[length].value;
  }
  return array;
}

function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined,
        valIsNull = value === null,
        valIsReflexive = value === value,
        valIsSymbol = isSymbol(value);

    var othIsDefined = other !== undefined,
        othIsNull = other === null,
        othIsReflexive = other === other,
        othIsSymbol = isSymbol(other);

    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
        (valIsNull && othIsDefined && othIsReflexive) ||
        (!valIsDefined && othIsReflexive) ||
        !valIsReflexive) {
      return 1;
    }
    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
        (othIsNull && valIsDefined && valIsReflexive) ||
        (!othIsDefined && valIsReflexive) ||
        !othIsReflexive) {
      return -1;
    }
  }
  return 0;
}

function compareMultiple(object, other, orders) {
  var index = -1,
      objCriteria = object.criteria,
      othCriteria = other.criteria,
      length = objCriteria.length,
      ordersLength = orders.length;

  while (++index < length) {
    var result = compareAscending(objCriteria[index], othCriteria[index]);
    if (result) {
      if (index >= ordersLength) {
        return result;
      }
      var order = orders[index];
      return result * (order == 'desc' ? -1 : 1);
    }
  }
  
  
  
  
  
  
  
  return object.index - other.index;
}

function baseOrderBy(collection, iteratees, orders) {
  var index = -1;
  iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(baseIteratee));

  var result = baseMap(collection, function(value, key, collection) {
    var criteria = arrayMap(iteratees, function(iteratee) {
      return iteratee(value);
    });
    return { 'criteria': criteria, 'index': ++index, 'value': value };
  });

  return baseSortBy(result, function(object, other) {
    return compareMultiple(object, other, orders);
  });
}

function orderBy(collection, iteratees, orders, guard) {
  if (collection == null) {
    return [];
  }
  if (!isArray(iteratees)) {
    iteratees = iteratees == null ? [] : [iteratees];
  }
  orders = guard ? undefined : orders;
  if (!isArray(orders)) {
    orders = orders == null ? [] : [orders];
  }
  return baseOrderBy(collection, iteratees, orders);
}

function isObject$1(val) {
  const type = typeof val;
  return Boolean(val) && (type === 'object' || type === 'function')
}

function isArray$1(a) {
  return Array.isArray(a)
}

function clone(val) {
  if (isArray$1(val)) {
    return val.slice(0)
  }
  if (isObject$1(val)) {
    return Object.assign({}, val)
  }
  
  
  return val
}

function forEach(iteratee, func) {
  if (!iteratee) return
  if (iteratee.constructor.prototype.forEach) {
    iteratee.forEach(func);
  } else {
    Object.keys(iteratee).forEach(function(key) {
      return func(iteratee[key], key)
    });
  }
}

const platform = {

  inBrowser: false,

  inNodeJS: false,

  inElectron: false,

  
  isIE: false,
  

  isFF: false,

  isWebkit: false,

  
  version: -1,

  

  isWindows: false,

  isMac: false,

  
  
  _reset: detect
};

function detect() {

  if (typeof window !== 'undefined') {
    platform.inBrowser = true;

    
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE ');
    const trident = ua.indexOf('Trident/');
    const edge = ua.indexOf('Edge/');

    if (msie > 0) {
      
      platform.isIE = true;
      platform.version = 10;
      
      
    } else if (trident > 0) {
      
      platform.isIE = true;
      platform.version = 11;
      platform.isTrident = true;
      
      
      
    } else if (edge > 0) {
      
      platform.isIE = true;
      platform.isEdge = true;
      platform.version = 12;
      
      parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    
    platform.isFF = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    
    platform.isWebkit = !platform.isFF && !platform.isIE;
  } else {
    platform.inBrowser = false;
  }

  if (platform.inBrowser) {
    platform.isWindows = (window.navigator !== undefined && window.navigator.appVersion && window.navigator.appVersion.indexOf("Win") !== -1);
    platform.isMac = (window.navigator !== undefined && window.navigator.platform.indexOf('Mac') >= 0);
  }

  
  if (typeof process !== 'undefined') {
    if (platform.inBrowser) {
      platform.inElectron = true;
    } else {
      platform.inNodeJS = true;
    }
  }

}

detect();

function cloneDeep(val) {
  if (isArray$1(val)) {
    return _cloneArrayDeep(val);
  }
  
  
  
  if (platform.inBrowser && val instanceof window.File) {
    return val
  }
  if (isObject$1(val)) {
    return _cloneObjectDeep(val)
  }
  
  
  return val
}

function _cloneObjectDeep(obj) {
  let res = {};
  forEach(obj, (val, key) => {
    res[key] = cloneDeep(val);
  });
  return res
}

function _cloneArrayDeep(arr) {
  return arr.map(cloneDeep)
}

function createCountingIdGenerator() {
  var counters = {};
  return function uuid(prefix) {
    if (!counters.hasOwnProperty(prefix)) {
      counters[prefix] = 1;
    }
    var result = [prefix, '-', counters[prefix]++].join('');
    return result
  }
}

function isString$1(s) {
  return typeof s === 'string'
}

function levenshtein(a, b){
  let m = [];
  for(let i = 0; i <= b.length; i++) {
    m[i] = [i];
    if(i === 0) continue;
    let ib = i-1;
    for(let j = 0; j <= a.length; j++){
      m[0][j] = j;
      if(j === 0) continue;
      let jb = j-1;
      m[i][j] = b.charAt(ib) === a.charAt(jb) ? m[ib][jb] : Math.min(
        m[ib][jb]+1,
        m[i][jb]+1,
        m[ib][j]+1
      );
    }
  }
  return m
}

function diff(a, b, offset) {
  if (!isString$1(a) || !isString$1(b)) {
    throw new Error('Illegal arguments.')
  }
  offset = offset || 0;
  let changes = [];
  if (a || b) {
    if (!a && b) {
      changes.push({ type:'insert', start:offset, text:b });
    } else if (a && !b) {
      changes.push({ type:'delete', start:offset, end:offset+a.length });
    } else {
      let m = levenshtein(a, b);
      changes = _diff(a, b, m, offset);
    }
  }
  return changes
}

function _diff(a, b, m, offset) {
  let i = b.length;
  let j = a.length;
  let changes = [];
  let current;
  while (i>0 && j>0) {
    _next();
  }
  _commit();
  return changes

  function _next() {
    let d = m[i][j];
    let ib = i-1;
    let jb = j-1;
    
    if (m[ib][jb]<d) {
      if (current && current.type === 'replace') {
        current.start--;
        current.text.unshift(b.charAt(ib));
      } else {
        _commit();
        current = { type:'replace', start:jb, end:j, text:[b.charAt(ib)] };
      }
      i--;
      j--;
    }
    
    else if (m[ib][j]<d) {
      if (current && current.type === 'insert') {
        current.start--;
        current.text.unshift(b.charAt(ib));
      } else {
        _commit();
        current = { type:'insert', start:jb, text:[b.charAt(ib)] };
      }
      i--;
    }
    
    else if (m[i][jb]<d) {
      if (current && current.type === 'delete') {
        current.start--;
      } else {
        _commit();
        current = { type:'delete', start:jb, end:j };
      }
      j--;
    }
    
    else {
      _commit();
      i--;
      j--;
    }
  }

  function _commit() {
    if (current) {
      switch (current.type) {
        case 'insert':
          current.start += offset;
          current.text = current.text.join('');
          break
        case 'delete':
          current.start += offset;
          current.end += offset;
          break
        case 'replace':
          current.start += offset;
          current.end += offset;
          current.text = current.text.join('');
          break
        default:
          throw new Error('Invalid state')
      }
      changes.push(current);
      current = null;
    }
  }

}

function encodeXMLEntities(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const DEBUG = false;
let count = 0;
const COUNT_MSG = '%s listeners registered in the whole system.';


class EventEmitter {

  
  emit(event) {
    if (event in this.__events__) {
      
      
      var bindings = this.__events__[event].slice();
      var args = Array.prototype.slice.call(arguments, 1);
      for (var i = 0, len = bindings.length; i < len; i++) {
        var binding = bindings[i];
        
        binding.method.apply(binding.context, args);
      }
      return true
    }
    return false
  }

  
  on(event, method, context) {
    
    _on.call(this, event, method, context);
  }

  
  off(event, method, context) { 
    if (arguments.length === 1 && isObject$1(arguments[0])) {
      _disconnect.call(this, arguments[0]);
    } else {
      _off.apply(this, arguments);
    }
  }

  _debugEvents() {
    
    console.log('### EventEmitter: ', this);
    forEach(this.__events__, (handlers, name) => {
      console.log("- %s listeners for %s: ", handlers.length, name, handlers);
    });
    
  }

  get __events__() {
    if (!this.___events___) {
      this.___events___ = {};
    }
    return this.___events___
  }

}


function _on(event, method, context) {
  
  var bindings;
  validateMethod( method, context );
  if (this.__events__.hasOwnProperty(event)) {
    bindings = this.__events__[event];
  } else {
    
    bindings = this.__events__[event] = [];
  }
  
  bindings.push({
    method: method,
    context: context || null
  });
  if (DEBUG) {
    count++;
    console.info('_on()', event, method.name, context, this);
    console.info(COUNT_MSG, count);
  }
  return this
  
}


function _off(event, method, context) {
  
  if (arguments.length === 0) {
    if (DEBUG) {
      forEach(this.__events__, (bindings) => {
        bindings.forEach((b) => {
          console.info('_off()', b.method.name, b.context, this);
        });
        count -= bindings.length;
      });
      console.info(COUNT_MSG, count);
    }
    this.___events___ = {};
    return this
  }
  if (arguments.length === 1) {
    
    if (DEBUG) {
      count -= (this.__events__[event] || []).length;
      console.info(COUNT_MSG, count);
    }
    delete this.__events__[event];
    return this
  }
  validateMethod(method, context);
  if (!(event in this.__events__) || !this.__events__[event].length) {
    if (DEBUG) console.info('NO MATCHING BINDINGS');
    
    return this
  }
  
  if (arguments.length < 3) {
    context = null;
  }
  
  let bindings = this.__events__[event];
  for (let i = bindings.length-1; i >= 0; i--) {
    const b = bindings[i];
    if (b.method === method && b.context === context) {
      bindings.splice(i, 1);
      if (DEBUG) count--;
    }
  }
  
  if (bindings.length === 0) {
    delete this.__events__[event];
  }
  if (DEBUG) console.info(COUNT_MSG, count);
  return this
  
}


function _disconnect(context) {
  
  
  forEach(this.__events__, (bindings, event) => {
    for (let i = bindings.length-1; i>=0; i--) {
      
      
      if (bindings[i] && bindings[i].context === context) {
        _off.call(this, event, bindings[i].method, context);
      }
    }
  });
  return this
  
}

function validateMethod(method, context) {
  
  if (typeof method === 'string') {
    
    if (context === undefined || context === null) {
      throw new Error( 'Method name "' + method + '" has no context.' )
    }
    if (!(method in context)) {
      
      
      throw new Error( 'Method not found: "' + method + '"' )
    }
    if (typeof context[method] !== 'function') {
      
      
      throw new Error( 'Property "' + method + '" is not a function' )
    }
  } else if (typeof method !== 'function') {
    throw new Error( 'Invalid callback. Function or method name expected.' )
  }
}

function extend(...args) {
  return Object.assign(...args)
}

const PLAINOBJ = {};


class Registry {
  constructor(entries, validator) {
    this.entries = {};
    this.names = [];
    this.validator = validator;

    if (entries) {
      forEach(entries, function(entry, name) {
        this.add(name, entry);
      }.bind(this));
    }
  }

  
  contains(name) {
    return this.entries.hasOwnProperty(name)
  }

  
  add(name, entry) {
    if (this.validator) {
      this.validator(entry);
    }
    if (PLAINOBJ[name]) {
      throw new Error('Illegal key: "'+name+'" is a property of Object which is thus not allowed as a key.')
    }
    if (this.contains(name)) {
      this.remove(name);
    }
    this.entries[name] = entry;
    this.names.push(name);
  }

  
  remove(name) {
    let pos = this.names.indexOf(name);
    if (pos >= 0) {
      this.names.splice(pos, 1);
    }
    delete this.entries[name];
  }

  
  clear() {
    this.names = [];
    this.entries = {};
  }

  
  get(name, strict) {
    let result = this.entries[name];
    if (strict && !result) {
      throw new Error('No entry registered for name '+name)
    }
    return result
  }

  
  forEach(callback) {
    for (let i = 0; i < this.names.length; i++) {
      let name = this.names[i];
      let _continue = callback(this.entries[name], name);
      if (_continue === false) {
        break
      }
    }
  }

  map(callback) {
    let result = [];
    this.forEach((entry, name) => {
      result.push(callback(entry, name));
    });
    return result
  }

  filter(callback) {
    let result = [];
    this.forEach(function(entry, name) {
      if (callback(entry, name)) {
        result.push(entry);
      }
    });
    return result
  }

  values() {
    return this.filter(() => { return true })
  }
}

Registry.prototype._isRegistry = true;

class Factory extends Registry {
  
  create(name) {
    var clazz = this.get(name);
    if (!clazz) {
      throw new Error( 'No class registered by that name: ' + name )
    }
    
    var args = Array.prototype.slice.call( arguments, 1 );
    var obj = Object.create( clazz.prototype );
    clazz.apply( obj, args );
    return obj
  }
}

function isFunction$1(f) {
  return typeof f === 'function'
}

function filter(iteratee, fn) {
  if (!iteratee) return []
  if (iteratee.constructor.prototype.filter && isFunction$1(iteratee.constructor.prototype.filter)) {
    return iteratee.filter(fn)
  }
  let result = [];
  forEach(iteratee, (val, key) => {
    if (fn(val, key)) {
      result.push(val);
    }
  });
  return result
}

function findIndex$1(arr, predicate) {
  if (!isFunction$1(predicate)) return arr.indexOf(predicate)
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) return i
  }
  return -1
}

function flatten(arr) {
  return Array.prototype.concat.apply([], arr)
}

function flattenOften(arr, max) {
  if (!(max > 0)) throw new Error("'max' must be a positive number")
  let l = arr.length;
  arr = flatten(arr);
  let round = 1;
  while (round < max && l < arr.length) {
    l = arr.length;
    arr = flatten(arr);
    round++;
  }
  return arr
}

function map(iteratee, func) {
  if (!iteratee) return []
  if (!func) func = function(item) { return item };
  if (Array.isArray(iteratee)) {
    return iteratee.map(func)
  } else {
    return Object.keys(iteratee).map(function(key) {
      return func(iteratee[key], key)
    })
  }
}

function getRelativeBoundingRect(els, containerEl) {
  if (els.length === undefined) {
    els = [els];
  }
  var elRects = map(els, function(el) {
    return _getBoundingOffsetsRect(el, containerEl)
  });

  var elsRect = _getBoundingRect(elRects);
  var containerElRect = containerEl.getBoundingClientRect();
  return {
    left: elsRect.left,
    top: elsRect.top,
    right: containerElRect.width - elsRect.left - elsRect.width,
    bottom: containerElRect.height - elsRect.top - elsRect.height,
    width: elsRect.width,
    height: elsRect.height
  }
}


function _getBoundingRect(rects) {
  var bounds = {
    left: Number.POSITIVE_INFINITY,
    top: Number.POSITIVE_INFINITY,
    right: Number.NEGATIVE_INFINITY,
    bottom: Number.NEGATIVE_INFINITY,
    width: Number.NaN,
    height: Number.NaN
  };

  forEach(rects, function(rect) {
    if (rect.left < bounds.left) {
      bounds.left = rect.left;
    }
    if (rect.top < bounds.top) {
      bounds.top = rect.top;
    }
    if (rect.left + rect.width > bounds.right) {
      bounds.right = rect.left + rect.width;
    }
    if (rect.top + rect.height > bounds.bottom) {
      bounds.bottom = rect.top + rect.height;
    }
  });
  bounds.width = bounds.right - bounds.left;
  bounds.height = bounds.bottom - bounds.top;
  return bounds
}


function _getBoundingOffsetsRect(el, relativeParentEl) {
  var relativeParentElRect = relativeParentEl.getBoundingClientRect();
  var elRect = _getBoundingRect(el.getClientRects());

  var left = elRect.left - relativeParentElRect.left;
  var top = elRect.top - relativeParentElRect.top;
  return {
    left: left,
    top: top,
    right: relativeParentElRect.width - left - elRect.width,
    bottom: relativeParentElRect.height - top - elRect.height,
    width: elRect.width,
    height: elRect.height
  }
}

function getRelativeMouseBounds(mouseEvent, containerEl) {
  let containerElRect = containerEl.getBoundingClientRect();
  let left = mouseEvent.clientX - containerElRect.left;
  let top = mouseEvent.clientY - containerElRect.top;
  let res = {
    left: left,
    right: containerElRect.width - left,
    top: top,
    bottom: containerElRect.height - top
  };
  return res;
}

var inBrowser = platform.inBrowser;

function includes(arr, val) {
  if (!arr) return false
  return (arr.indexOf(val) >= 0)
}

function isArrayEqual(arr1, arr2) {
  if (arr1 === arr2) return true
  if (!isArray$1(arr1) || !isArray$1(arr2)) return false
  if (arr1.length !== arr2.length) return false
  let L = arr1.length;
  for (var i = 0; i < L; i++) {
    if (arr1[i] !== arr2[i]) return false
  }
  return true
}

function isBoolean(val) {
  return (val === true || val === false || (val && val.constructor === Boolean) )
}

function isPlainObject$1(o) {
  return Boolean(o) && o.constructor === {}.constructor
}

function isEqual(a, b) {
  if (a === b) return true
  if (isArray$1(a) && isArray$1(b)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false
    }
    return true
  }
  if (isPlainObject$1(a) && isPlainObject$1(b)) {
    let akeys = Object.keys(a).sort();
    let bkeys = Object.keys(b).sort();
    if (!isEqual(akeys, bkeys)) return false
    for (let i = 0; i < akeys.length; i++) {
      let key = akeys[i];
      if (!isEqual(a[key], b[key])) return false
    }
    return true
  }
  return false
}

function isNil(o) {
  return o === null || o === undefined
}

function isNumber(n) {
  return typeof n === 'number'
}

let keys$1 = {
  UNDEFINED: 0,
  BACKSPACE: 8,
  DELETE: 46,
  INSERT: 45,
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
  ENTER: 13,
  RETURN: 13,
  END: 35,
  HOME: 36,
  TAB: 9,
  PAGEUP: 33,
  PAGEDOWN: 34,
  ESCAPE: 27,
  ESC: 27,
  SHIFT: 16,
  SPACE: 32,
  PLUS: 171,
  VOLUMEUP: 183,
  VOLUMEDOWN: 182,
  VOLUMEMUTE: 181,
  PRINTSCREEN: 44
};


for(let i=1;i<=24;i++) {
  keys$1['F'+i] = 111 + i;
}

function parseKeyEvent(event, onlyModifiers) {
  let frags = [];
  if (event.altKey) {
    if (event.code === 'AltRight') {
      frags.push('ALTGR');
    } else {
      frags.push('ALT');
    }
  }
  if (event.ctrlKey) frags.push('CTRL');
  if (event.metaKey) frags.push('META');
  if (event.shiftKey) frags.push('SHIFT');
  if (!onlyModifiers) {
    frags.push(event.keyCode);
  }
  return frags.join('+')
}

function last$1(arr) {
  return arr[arr.length-1]
}

function merge$1(a, b, options) {
  options = options || {};
  var _with = null;
  if (options.array === 'replace') {
    _with = _replaceArrays;
  } else if (options.array === 'concat') {
    _with = _concatArrays;
  }
  if (_with) {
    return mergeWith(a, b, _with)
  } else {
    return merge(a, b)
  }
}

function _concatArrays(objValue, srcValue) {
  if (isArray$1(objValue)) {
    return objValue.concat(srcValue)
  } else {
    return null
  }
}

function _replaceArrays(objValue, srcValue) {
  if (isArray$1(objValue)) {
    return srcValue
  } else {
    return null
  }
}

class PathObject {

  
  constructor(root) {
    if (root) {
      this.__root__ = root;
    }
  }

  contains(id) {
    return Boolean(this.getRoot()[id])
  }

  getRoot() {
    if (this.__root__) {
      return this.__root__
    } else {
      return this
    }
  }

  
  get(path) {
    if (!path) {
      return undefined
    }
    if (isString$1(path)) {
      return this.getRoot()[path]
    }
    if (arguments.length > 1) {
      path = Array.prototype.slice(arguments, 0);
    }
    if (!isArray$1(path)) {
      throw new Error('Illegal argument for PathObject.get()')
    }
    return get(this.getRoot(), path)
  }

  set(path, value) {
    if (!path) {
      throw new Error('Illegal argument: PathObject.set(>path<, value) - path is mandatory.')
    }
    if (isString$1(path)) {
      this.getRoot()[path] = value;
    } else {
      setWith(this.getRoot(), path, value);
    }
  }

  delete(path) {
    if (isString$1(path)) {
      delete this.getRoot()[path];
    } else if (path.length === 1) {
      delete this.getRoot()[path[0]];
    } else {
      var success = unset(this.getRoot(), path);
      if (!success) {
        throw new Error('Could not delete property at path' + path)
      }
    }
  }

  clear() {
    var root = this.getRoot();
    for (var key in root) {
      if (root.hasOwnProperty(key)) {
        delete root[key];
      }
    }
  }

}

PathObject.prototype._isPathObject = true;

function percentage(ratio) {
  return String(Math.floor(ratio*100*100)/100) + ' %'
}

var pluck = function(collection, prop) {
  return map(collection, function(item) { return item[prop] })
};

function printStacktrace() {
  try {
    throw new Error();
  } catch (err) {
    console.error(err.stack);
  }
}

function request(method, url, data, cb) {
  var request = new XMLHttpRequest();
  request.open(method, url, true);
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var res = request.responseText;
      if(isJson(res)) res = JSON.parse(res);
      cb(null, res);
    } else {
      return cb(new Error('Request failed. Returned status: ' + request.status))
    }
  };

  if (data) {
    request.send(JSON.stringify(data));
  } else {
    request.send();
  }
}

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false
  }
  return true
}

function sendRequest(params, cb) {
  return new Promise(function(resolve, reject) {
    var method = (params.method || 'GET').toUpperCase();
    var url = params.url;
    if (['GET', 'POST', 'PUT', 'DELETE'].indexOf(method) < 0) {
      throw new Error("Parameter 'method' must be 'GET', 'POST', 'PUT', or 'DELETE'.")
    }
    if (!url) {
      throw new Error("Parameter 'url' is required.")
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      
      
      if (xmlhttp.readyState === 4) return _done()
    };
    xmlhttp.open(method, url, true);
    if (params.header) {
      forEach(params.header, function(val, key) {
        xmlhttp.setRequestHeader(key, val);
      });
    }
    if (params.data) {
      xmlhttp.send(JSON.stringify(params.data));
    } else {
      xmlhttp.send();
    }

    function _done() {
      if (xmlhttp.status === 200) {
        var response = xmlhttp.responseText;
        if (cb) cb(null, response);
        resolve(response);
      } else {
        console.error(xmlhttp.statusText);
        if (cb) cb(xmlhttp.status);
        reject(xmlhttp.statusText, xmlhttp.status);
      }
    }
  })
}

function startsWith(str, prefix) {
  if (!isString$1(str)) return false
  if (str.startsWith) return str.startsWith(prefix)
  if (!isString$1(prefix)) prefix = String(prefix);
  return str.slice(0, prefix.length) === prefix
}

class SubstanceError extends Error {
  constructor(name, options) {
    super(name, options);
    this.name = name;
    this.message = options.message;
    this.info = options.info;
    this.errorCode = options.errorCode;
    this.cause = options.cause;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, (SubstanceError));
    }
  }

  inspect() {
    var parts = [];

    
    parts.push(this.stack);

    
    if (this.info) {
      parts.push(this.info + '. ');
    }

    
    if (this.cause) {
      parts.push('\nCaused by: ');

      if (this.cause.inspect) {
        
        parts.push(this.cause.inspect());
      } else {
        
        parts.push(this.cause.toString());
      }
    }
    return parts.join('')
  }
}


SubstanceError.fromJSON = function(err) {
  if (!err) return null
  var error = new SubstanceError(err.name, {
    message: err.message,
    info: err.info,
    errorCode: err.errorCode,
    cause: SubstanceError.fromJSON(err.cause)
  });
  return error
};

const _global = (typeof global !== 'undefined') ? global : window;
const substanceGlobals = _global.hasOwnProperty('Substance') ? _global.Substance : _global.Substance = {
  DEBUG_RENDERING: true
};

function times(num, fn, ctx) {
  for (let i=0; i<num; i++) {
    fn.call(ctx);
  }
}

class TreeNode {}



class TreeIndex {
  
  get(path) {
    if (arguments.length > 1) {
      path = Array.prototype.slice(arguments, 0);
    }
    if (isString$1(path)) {
      path = [path];
    }
    return get(this, path);
  }

  getAll(path) {
    if (arguments.length > 1) {
      path = Array.prototype.slice(arguments, 0);
    }
    if (isString$1(path)) {
      path = [path];
    }
    if (!isArray$1(path)) {
      throw new Error('Illegal argument for TreeIndex.get()');
    }
    var node = get(this, path);
    return this._collectValues(node);
  }

  set(path, value) {
    if (isString$1(path)) {
      path = [path];
    }
    setWith(this, path, value, function(val) {
      if (!val) return new TreeNode();
    });
  }

  delete(path) {
    if (isString$1(path)) {
      delete this[path];
    } else if(path.length === 1) {
      delete this[path[0]];
    } else {
      var key = path[path.length-1];
      path = path.slice(0, -1);
      var parent = get(this, path);
      if (parent) {
        delete parent[key];
      }
    }
  }

  clear() {
    var root = this;
    for (var key in root) {
      if (root.hasOwnProperty(key)) {
        delete root[key];
      }
    }
  }

  traverse(fn) {
    this._traverse(this, [], fn);
  }

  forEach(...args) {
    this.traverse(...args);
  }

  _traverse(root, path, fn) {
    var id;
    for (id in root) {
      if (!root.hasOwnProperty(id)) continue;
      var child = root[id];
      var childPath = path.concat([id]);
      if (child instanceof TreeNode) {
        this._traverse(child, childPath, fn);
      } else {
        fn(child, childPath);
      }
    }
  }

  _collectValues(root) {
    
    
    var vals = {};
    this._traverse(root, [], function(val, path) {
      var key = path[path.length-1];
      vals[key] = val;
    });
    return vals;
  }
}

class TreeIndexArrays extends TreeIndex {

  contains(path) {
    let val = super.get(path);
    return Boolean(val)
  }

  get(path) {
    let val = super.get(path);
    if (val instanceof TreeNode) {
      val = val.__values__ || [];
    }
    return val;
  }

  set(path, arr) {
    let val = super.get(path);
    val.__values__ = arr;
  }

  add(path, value) {
    if (isString$1(path)) {
      path = [path];
    }
    if (!isArray$1(path)) {
      throw new Error('Illegal arguments.');
    }
    var arr;

    
    
    
    
    
    
    setWith(this, path.concat(['__values__','__dummy__']), undefined, function(val, key) {
      if (key === '__values__') {
        if (!val) val = [];
        arr = val;
      } else if (!val) {
        val = new TreeNode();
      }
      return val;
    });
    delete arr.__dummy__;
    arr.push(value);
  }

  remove(path, value) {
    var arr = get(this, path);
    if (arr instanceof TreeNode) {
      if (arguments.length === 1) {
        delete arr.__values__;
      } else {
        deleteFromArray(arr.__values__, value);
      }
    }
  }

  _collectValues(root) {
    var vals = [];
    this._traverse(root, [], function(val) {
      vals.push(val);
    });
    vals = Array.prototype.concat.apply([], vals);
    return vals
  }
}

TreeIndex.Arrays = TreeIndexArrays;

function uuid(prefix, len) {
  if (prefix && prefix[prefix.length-1] !== "-") {
    prefix = prefix.concat("-");
  }
  var chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [];
  var radix = 16;
  var idx;
  len = len || 32;
  if (len) {
    
    for (idx = 0; idx < len; idx++) uuid[idx] = chars[0 | Math.random()*radix];
  } else {
    
    var r;
    
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    
    
    for (idx = 0; idx < 36; idx++) {
      if (!uuid[idx]) {
        r = 0 | Math.random()*16;
        uuid[idx] = chars[(idx === 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return (prefix ? prefix : "") + uuid.join('');
}

function getDOMRangeFromEvent(evt) {
  let range, x = evt.clientX, y = evt.clientY;
  
  if (document.body.createTextRange) {
    range = document.body.createTextRange();
    range.moveToPoint(x, y);
  }
  else if (!isNil(document.createRange)) {
    
    
    if (!isNil(evt.rangeParent)) {
      range = document.createRange();
      range.setStart(evt.rangeParent, evt.rangeOffset);
      range.collapse(true);
    }
    
    else if (document.caretPositionFromPoint) {
      let pos = document.caretPositionFromPoint(x, y);
      range = document.createRange();
      range.setStart(pos.offsetNode, pos.offset);
      range.collapse(true);
    }
    
    else if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(x, y);
    }
  }
  return range
}


function getSelectionRect(parentRect) {
  if (platform.inBrowser) {
    const wsel = window.getSelection();
    if (wsel.rangeCount === 0) return
    const wrange = wsel.getRangeAt(0);
    let contentRect = parentRect;
    let selectionRect = wrange.getBoundingClientRect();
    if (selectionRect.top === 0 && selectionRect.bottom === 0) {
      selectionRect = _fixForCursorRectBug();
    }
    return getRelativeRect(contentRect, selectionRect)
  }
}

function _fixForCursorRectBug() {
  let wsel = window.getSelection();
  let el = wsel.anchorNode;
  if (!el) return
  while (el && el.nodeType !== 1) {
    el = el.parentNode;
  }
  let rects = el.getClientRects();
  let rect = rects[0];
  return {
    left: rect.left,
    top: rect.top,
    width: 0,
    height: rect.height,
    right: rect.width,
    bottom: rect.bottom
  }
}

function getRelativeRect(parentRect, childRect) {
  var left = childRect.left - parentRect.left;
  var top = childRect.top - parentRect.top;
  return {
    left: left,
    top: top,
    right: parentRect.width - left - childRect.width,
    bottom: parentRect.height - top - childRect.height,
    width: childRect.width,
    height: childRect.height
  }
}

function isMouseInsideDOMSelection(e) {
  let wsel = window.getSelection();
  if (wsel.rangeCount === 0) {
    return false
  }
  let wrange = wsel.getRangeAt(0);
  let selectionRect = wrange.getBoundingClientRect();
  return e.clientX >= selectionRect.left &&
         e.clientX <= selectionRect.right &&
         e.clientY >= selectionRect.top &&
         e.clientY <= selectionRect.bottom
}

class ServerRequest {
  constructor(message, ws) {
    this.message = message;
    this.ws = ws;
    this.isAuthenticated = false;
    this.isAuhorized = false;
  }

  
  setAuthenticated(session) {
    this.isAuthenticated = true;
    this.session = session;
  }

  
  setAuthorized(authorizationData) {
    this.isAuthorized = true;
    this.authorizationData = authorizationData;
  }

  
  setEnhanced() {
    this.isEnhanced = true;
  }
}

class ServerResponse {
  constructor() {
    this.isReady = false; 
    this.isEnhanced = false; 
    this.isSent = false; 
    this.err = null;
    this.data = null;
  }

  
  error(err) {
    this.err = err;
    this.isReady = true;
  }

  
  send(data) {
    this.data = data;
    this.isReady = true;
  }

  
  setEnhanced() {
    this.isEnhanced = true;
  }

  setSent() {
    this.isSent = true;
  }
}

class Server extends EventEmitter {
  constructor(config) {
    super();

    this.config = config;
    this._onConnection = this._onConnection.bind(this);
  }

  bind(wss) {
    if (this.wss) {
      throw new Error('Server is already bound to a websocket')
    }
    this.wss = wss;
    this._connections = new WeakMap();
    this._collaborators = {};
    this.wss.on('connection', this._onConnection);

    let interval = this.config.heartbeat;
    if (interval) {
      this._heartbeat = setInterval(this._sendHeartbeat.bind(this), interval);
    }
    this._bound = true;
  }

  
  unbind() {
    if (this._bound) {
      this.wss.off('connection', this._onConnection);
    } else {
      throw new Error('Server is not yet bound to a websocket.')
    }
  }

  
  onConnection() {
    
  }

  
  onDisconnect() {
    
  }

  
  authenticate(req, res) {
    req.setAuthenticated();
    this.next(req, res);
  }

  
  authorize(req, res) {
    req.setAuthorized();
    this.next(req, res);
  }


  
  enhanceRequest(req, res) {
    req.setEnhanced();
    this.next(req, res);
  }

  
  execute() {
    throw new Error('This method needs to be specified')
  }

  
  enhanceResponse(req, res) {
    res.setEnhanced();
    this.next(req, res);
  }

  
  _onConnection(ws) {
    let collaboratorId = uuid();
    let connection = {
      collaboratorId: collaboratorId
    };
    this._connections.set(ws, connection);

    
    this._collaborators[collaboratorId] = {
      connection: ws
    };

    ws.on('message', this._onMessage.bind(this, ws));
    ws.on('close', this._onClose.bind(this, ws));
  }

  
  _onClose(ws) {
    let conn = this._connections.get(ws);
    let collaboratorId = conn.collaboratorId;

    this.onDisconnect(collaboratorId);

    
    delete this._collaborators[collaboratorId];
    this._connections.delete(ws);
  }

  
  __initial(req, res) {
    return !req.isAuthenticated && !req.isAuthorized && !res.isReady
  }

  __authenticated(req, res) {
    return req.isAuthenticated && !req.isAuthorized && !res.isReady
  }

  __authorized(req, res) {
    return req.isAuthenticated && req.isAuthorized && !req.isEnhanced && !res.isReady
  }

  __requestEnhanced(req, res) {
    return req.isAuthenticated && req.isAuthorized && req.isEnhanced && !res.isReady
  }

  __executed(req, res) {
    
    return req.isAuthenticated && req.isAuthorized && res.isReady && res.data && !res.isEnhanced
  }

  __enhanced(req, res) {
    return res.isReady && res.isEnhanced && !res.isSent
  }

  __error(req, res) {
    return res.err && !res.isSent
  }

  __done(req, res) {
    return res.isSent
  }

  next(req, res) {
    if (this.__initial(req, res)) {
      this.authenticate(req, res);
    } else if (this.__authenticated(req, res)) {
      this.authorize(req, res);
    } else if (this.__authorized(req, res)) {
      this.enhanceRequest(req, res);
    } else if (this.__requestEnhanced(req, res)) {
      this.execute(req, res);
    } else if (this.__executed(req, res)) {
      this.enhanceResponse(req, res);
    } else if (this.__enhanced(req, res)) {
      this.sendResponse(req, res);
    } else if (this.__error(req, res)) {
      this.sendError(req, res);
    } else if (this.__done(req,res)) {
      
    }
  }

  
  sendError(req, res) {
    let collaboratorId = req.message.collaboratorId;
    let msg = res.err;
    this.send(collaboratorId, msg);
    res.setSent();
    this.next(req, res);
  }

  
  _sendHeartbeat() {
    Object.keys(this._collaborators).forEach(function(collaboratorId) {
      this.send(collaboratorId, {
        type: 'highfive',
        scope: '_internal'
      });
    }.bind(this));
  }

  
  sendResponse(req, res) {
    let collaboratorId = req.message.collaboratorId;
    this.send(collaboratorId, res.data);
    res.setSent();
    this.next(req, res);
  }

  _isWebsocketOpen(ws) {
    return ws && ws.readyState === 1
  }

  
  send(collaboratorId, message) {
    if (!message.scope && this.config.scope) {
      message.scope = this.config.scope;
    }

    let ws = this._collaborators[collaboratorId].connection;
    if (this._isWebsocketOpen(ws)) {
      ws.send(this.serializeMessage(message));
    } else {
      console.error('Server#send: Websocket for collaborator', collaboratorId, 'is no longer open', message);
    }
  }

  
  broadCast(collaborators, message) {
    collaborators.forEach(function(collaboratorId) {
      this.send(collaboratorId, message);
    }.bind(this));
  }

  
  _processRequest(req) {
    let res = new ServerResponse();
    this.next(req, res);
  }

  
  _onMessage(ws, msg) {
    
    let conn = this._connections.get(ws);
    msg = this.deserializeMessage(msg);

    if (msg.scope === this.scope) {
      
      msg.collaboratorId = conn.collaboratorId;
      let req = new ServerRequest(msg, ws);
      this._processRequest(req);
    }
  }

  serializeMessage(msg) {
    return JSON.stringify(msg)
  }

  deserializeMessage(msg) {
    return JSON.parse(msg)
  }

}

class Selection {

  constructor() {
    
    var _internal = {};
    Object.defineProperty(this, "_internal", {
      enumerable: false,
      value: _internal
    });
      
    _internal.doc = null;
  }

  clone() {
    var newSel = this._clone();
    if (this._internal.doc) {
      newSel.attach(this._internal.doc);
    }
    return newSel
  }

  
  getDocument() {
    var doc = this._internal.doc;
    if (!doc) {
      throw new Error('Selection is not attached to a document.')
    }
    return doc
  }

  isAttached() {
    return Boolean(this._internal.doc)
  }

  
  attach(doc) {
    this._internal.doc = doc;
    return this
  }

  
  isNull() { return false; }

  
  isPropertySelection() { return false; }

  
  isContainerSelection() { return false; }

  
  isNodeSelection() { return false; }

  isCustomSelection() { return false; }

  
  isCollapsed() { return true; }

  
  isReverse() { return false; }

  getType() {
    throw new Error('Selection.getType() is abstract.')
  }

  get type() {
    return this.getType()
  }

  
  equals(other) {
    if (this === other) {
      return true
    } else if (!other) {
      return false
    } else if (this.isNull() !== other.isNull()) {
      return false
    } else if (this.getType() !== other.getType()) {
      return false
    } else {
      
      
      return true
    }
  }

  
  toString() {
    return "null"
  }

  
  toJSON() {
    throw new Error('This method is abstract.')
  }

  createWith(update) {
    let SelectionClass = this.constructor;
    let data = this.toJSON();
    Object.assign(data, update);
    return SelectionClass.fromJSON(data)
  }
}


Selection.prototype._isSelection = true;


class NullSelection extends Selection {

  isNull() {
    return true
  }

  getType() {
    return 'null'
  }

  toJSON() {
    return null
  }

  clone() {
    return this
  }
}



Selection.nullSelection = Object.freeze(new NullSelection());

class Coordinate {

  
  constructor(path, offset) {
    
    if (arguments[0] === 'SKIP') return
    if (arguments.length === 1) {
      let data = arguments[0];
      this.path = data.path;
      this.offset = data.offset;
    } else {
      this.path = path;
      this.offset = offset;
    }
    if (!isArray$1(this.path)) {
      throw new Error('Invalid arguments: path should be an array.')
    }
    if (!isNumber(this.offset) || this.offset < 0) {
      throw new Error('Invalid arguments: offset must be a positive number.')
    }
  }

  equals(other) {
    return (other === this ||
      (isArrayEqual(other.path, this.path) && other.offset === this.offset) )
  }

  withCharPos(offset) {
    return new Coordinate(this.path, offset)
  }

  getNodeId() {
    return this.path[0]
  }

  getPath() {
    return this.path
  }

  getOffset() {
    return this.offset
  }

  toJSON() {
    return {
      path: this.path.slice(),
      offset: this.offset
    }
  }

  toString() {
    return "(" + this.path.join('.') + ", " + this.offset + ")"
  }

  isPropertyCoordinate() {
    return this.path.length > 1
  }

  isNodeCoordinate() {
    return this.path.length === 1
  }

  hasSamePath(other) {
    return isArrayEqual(this.path, other.path)
  }
}

Coordinate.prototype._isCoordinate = true;

class PropertySelection extends Selection {

  
  constructor(path, startOffset, endOffset, reverse, containerId, surfaceId) {
    super();

    if (arguments.length === 1) {
      let data = arguments[0];
      path = data.path;
      startOffset = data.startOffset;
      endOffset = data.endOffset;
      reverse = data.reverse;
      containerId = data.containerId;
      surfaceId = data.surfaceId;
    }

    if (!path || !isNumber(startOffset)) {
      throw new Error('Invalid arguments: `path` and `startOffset` are mandatory');
    }

    this.start = new Coordinate(path, startOffset);
    this.end = new Coordinate(path, isNumber(endOffset) ? endOffset : startOffset);

    
    this.reverse = Boolean(reverse);

    this.containerId = containerId;

    
    this.surfaceId = surfaceId;
  }

  get path() {
    return this.start.path
  }

  get startOffset() {
    console.warn('DEPRECATED: Use sel.start.offset instead');
    return this.start.offset
  }

  get endOffset() {
    console.warn('DEPRECATED: Use sel.end.offset instead');
    return this.end.offset
  }

  
  toJSON() {
    return {
      type: 'property',
      path: this.start.path,
      startOffset: this.start.offset,
      endOffset: this.end.offset,
      reverse: this.reverse,
      containerId: this.containerId,
      surfaceId: this.surfaceId
    }
  }

  isPropertySelection() {
    return true
  }

  getType() {
    return 'property'
  }

  isNull() {
    return false
  }

  isCollapsed() {
    return this.start.offset === this.end.offset;
  }

  isReverse() {
    return this.reverse
  }

  equals(other) {
    return (
      Selection.prototype.equals.call(this, other) &&
      (this.start.equals(other.start) && this.end.equals(other.end))
    )
  }

  toString() {
    
    return [
      "PropertySelection(", JSON.stringify(this.path), ", ",
      this.start.offset, " -> ", this.end.offset,
      (this.reverse?", reverse":""),
      (this.surfaceId?(", "+this.surfaceId):""),
      ")"
    ].join('')
  }

  
  collapse(direction) {
    var offset;
    if (direction === 'left') {
      offset = this.start.offset;
    } else {
      offset = this.end.offset;
    }
    return this.createWithNewRange(offset, offset)
  }

  
  

  
  getPath() {
    return this.start.path;
  }

  getNodeId() {
    return this.start.path[0];
  }

  
  isInsideOf(other, strict) {
    if (other.isNull()) return false
    if (other.isContainerSelection()) {
      return other.contains(this, strict)
    }
    if (strict) {
      return (isArrayEqual(this.path, other.path) &&
        this.start.offset > other.start.offset &&
        this.end.offset < other.end.offset);
    } else {
      return (isArrayEqual(this.path, other.path) &&
        this.start.offset >= other.start.offset &&
        this.end.offset <= other.end.offset);
    }
  }

  
  contains(other, strict) {
    if (other.isNull()) return false
    return other.isInsideOf(this, strict)
  }

  
  overlaps(other, strict) {
    if (other.isNull()) return false
    if (other.isContainerSelection()) {
      
      return other.overlaps(this)
    }
    if (!isArrayEqual(this.path, other.path)) return false
    if (strict) {
      return (! (this.start.offset>=other.end.offset||this.end.offset<=other.start.offset) );
    } else {
      return (! (this.start.offset>other.end.offset||this.end.offset<other.start.offset) );
    }
  }

  
  isRightAlignedWith(other) {
    if (other.isNull()) return false
    if (other.isContainerSelection()) {
      
      return other.isRightAlignedWith(this)
    }
    return (isArrayEqual(this.path, other.path) &&
      this.end.offset === other.end.offset);
  }

  
  isLeftAlignedWith(other) {
    if (other.isNull()) return false
    if (other.isContainerSelection()) {
      
      return other.isLeftAlignedWith(this)
    }
    return (isArrayEqual(this.path, other.path) &&
      this.start.offset === other.start.offset);
  }

  
  expand(other) {
    if (other.isNull()) return this

    
    
    
    if (other.isContainerSelection()) {
      return other.expand(this)
    }
    if (!isArrayEqual(this.path, other.path)) {
      throw new Error('Can not expand PropertySelection to a different property.')
    }
    var newStartOffset = Math.min(this.start.offset, other.start.offset);
    var newEndOffset = Math.max(this.end.offset, other.end.offset);
    return this.createWithNewRange(newStartOffset, newEndOffset);
  }

  
  truncateWith(other) {
    if (other.isNull()) return this
    if (other.isInsideOf(this, 'strict')) {
      
      throw new Error('Can not truncate with a contained selections')
    }
    if (!this.overlaps(other)) {
      return this
    }
    var otherStartOffset, otherEndOffset;
    if (other.isPropertySelection()) {
      otherStartOffset = other.start.offset;
      otherEndOffset = other.end.offset;
    } else if (other.isContainerSelection()) {
      
      if (isArrayEqual(other.start.path, this.start.path)) {
        otherStartOffset = other.start.offset;
      } else {
        otherStartOffset = this.start.offset;
      }
      if (isArrayEqual(other.end.path, this.start.path)) {
        otherEndOffset = other.end.offset;
      } else {
        otherEndOffset = this.end.offset;
      }
    } else {
      return this
    }

    var newStartOffset;
    var newEndOffset;
    if (this.start.offset > otherStartOffset && this.end.offset > otherEndOffset) {
      newStartOffset = otherEndOffset;
      newEndOffset = this.end.offset;
    } else if (this.start.offset < otherStartOffset && this.end.offset < otherEndOffset) {
      newStartOffset = this.start.offset;
      newEndOffset = otherStartOffset;
    } else if (this.start.offset === otherStartOffset) {
      if (this.end.offset <= otherEndOffset) {
        return Selection.nullSelection;
      } else {
        newStartOffset = otherEndOffset;
        newEndOffset = this.end.offset;
      }
    } else if (this.end.offset === otherEndOffset) {
      if (this.start.offset >= otherStartOffset) {
        return Selection.nullSelection;
      } else {
        newStartOffset = this.start.offset;
        newEndOffset = otherStartOffset;
      }
    } else if (other.contains(this)) {
      return Selection.nullSelection
    } else {
      
      throw new Error('Illegal state.')
    }
    return this.createWithNewRange(newStartOffset, newEndOffset)
  }

  
  createWithNewRange(startOffset, endOffset) {
    var sel = new PropertySelection(this.path, startOffset, endOffset, false, this.containerId, this.surfaceId);
    var doc = this._internal.doc;
    if (doc) {
      sel.attach(doc);
    }
    return sel
  }

  _clone() {
    return new PropertySelection(this.start.path, this.start.offset, this.end.offset, this.reverse, this.containerId, this.surfaceId);
  }

}

PropertySelection.fromJSON = function(json) {
  return new PropertySelection(json)
};

class ContainerSelection extends Selection {

  constructor(containerId, startPath, startOffset, endPath, endOffset, reverse, surfaceId) {
    super();

    if (arguments.length === 1) {
      let data = arguments[0];
      containerId = data.containerId;
      startPath = data.startPath;
      startOffset = data.startOffset;
      endPath = data.endPath;
      endOffset = data.endOffset;
      reverse = data.reverse;
      surfaceId = data.surfaceId;
    }

    
    this.containerId = containerId;
    if (!this.containerId) throw new Error('Invalid arguments: `containerId` is mandatory')

    this.start = new Coordinate(startPath, startOffset);
    this.end = new Coordinate(isNil(endPath) ? startPath : endPath, isNil(endOffset) ? startOffset : endOffset);

    this.reverse = Boolean(reverse);

    this.surfaceId = surfaceId;
  }

  

  get startPath() {
    console.warn('DEPRECATED: use sel.start.path instead.');
    return this.start.path
  }

  get startOffset() {
    console.warn('DEPRECATED: use sel.start.offset instead.');
    return this.start.offset
  }

  get endPath() {
    console.warn('DEPRECATED: use sel.end.path instead.');
    return this.end.path
  }

  get endOffset() {
    console.warn('DEPRECATED: use sel.end.offset instead.');
    return this.end.offset
  }

  

  toJSON() {
    return {
      type: 'container',
      containerId: this.containerId,
      startPath: this.start.path,
      startOffset: this.start.offset,
      endPath: this.end.path,
      endOffset: this.end.offset,
      reverse: this.reverse,
      surfaceId: this.surfaceId
    }
  }

  isContainerSelection() {
    return true
  }

  getType() {
    return 'container'
  }

  isNull() {
    return false
  }

  isCollapsed() {
    return this.start.equals(this.end)
  }

  isReverse() {
    return this.reverse
  }

  equals(other) {
    return (
      Selection.prototype.equals.call(this, other) &&
      this.containerId === other.containerId &&
      (this.start.equals(other.start) && this.end.equals(other.end))
    )
  }

  toString() {
    
    return [
      "ContainerSelection(",
      this.containerId, ", ",
      JSON.stringify(this.start.path), ", ", this.start.offset,
      " -> ",
      JSON.stringify(this.end.path), ", ", this.end.offset,
      (this.reverse?", reverse":""),
      (this.surfaceId?(", "+this.surfaceId):""),
      ")"
    ].join('')
  }

  
  getContainer() {
    if (!this._internal.container) {
      this._internal.container = this.getDocument().get(this.containerId);
    }
    return this._internal.container
  }

  isInsideOf(other, strict) {
    
    
    if (other.isNull()) return false
    strict = Boolean(strict);
    let r1 = this._range(this);
    let r2 = this._range(other);
    return (r2.start.isBefore(r1.start, strict) &&
      r1.end.isBefore(r2.end, strict))
  }

  contains(other, strict) {
    
    
    if (other.isNull()) return false
    strict = Boolean(strict);
    let r1 = this._range(this);
    let r2 = this._range(other);
    return (r1.start.isBefore(r2.start, strict) &&
      r2.end.isBefore(r1.end, strict))
  }

  containsNode(nodeId, strict) {
    const container = this.getContainer();
    if (!container.contains(nodeId)) return false
    const coor = new Coordinate([nodeId], 0);
    const address = container.getAddress(coor);
    const r = this._range(this);
    
    let contained = r.start.isBefore(address, strict);
    if (contained) {
      address.offset = 1;
      contained = r.end.isAfter(address, strict);
    }
    return contained
  }

  overlaps(other) {
    let r1 = this._range(this);
    let r2 = this._range(other);
    
    return !(r1.end.isBefore(r2.start, false) ||
      r2.end.isBefore(r1.start, false))
  }

  isLeftAlignedWith(other) {
    let r1 = this._range(this);
    let r2 = this._range(other);
    return r1.start.isEqual(r2.start)
  }

  isRightAlignedWith(other) {
    let r1 = this._range(this);
    let r2 = this._range(other);
    return r1.end.isEqual(r2.end)
  }

  
  collapse(direction) {
    let coor;
    if (direction === 'left') {
      coor = this.start;
    } else {
      coor = this.end;
    }
    return _createNewSelection(this, coor, coor)
  }

  expand(other) {
    let r1 = this._range(this);
    let r2 = this._range(other);
    let start;
    let end;

    if (r1.start.isEqual(r2.start)) {
      start = new Coordinate(this.start.path, Math.min(this.start.offset, other.start.offset));
    } else if (r1.start.isAfter(r2.start)) {
      start = new Coordinate(other.start.path, other.start.offset);
    } else {
      start = this.start;
    }
    if (r1.end.isEqual(r2.end)) {
      end = new Coordinate(this.end.path, Math.max(this.end.offset, other.end.offset));
    } else if (r1.end.isBefore(r2.end, false)) {
      end = new Coordinate(other.end.path, other.end.offset);
    } else {
      end = this.end;
    }

    return _createNewSelection(this, start, end)
  }

  truncateWith(other) {
    if (other.isInsideOf(this, 'strict')) {
      
      throw new Error('Can not truncate with a contained selections')
    }
    if (!this.overlaps(other)) {
      return this
    }
    let r1 = this._range(this);
    let r2 = this._range(other);
    let start, end;
    if (r2.start.isBefore(r1.start, 'strict') && r2.end.isBefore(r1.end, 'strict')) {
      start = other.end;
      end = this.end;
    } else if (r1.start.isBefore(r2.start, 'strict') && r1.end.isBefore(r2.end, 'strict')) {
      start = this.start;
      end = other.start;
    } else if (r1.start.isEqual(r2.start)) {
      if (r2.end.isBefore(r1.end, 'strict')) {
        start = other.end;
        end = this.end;
      } else {
        
        return Selection.nullSelection
      }
    } else if (r1.end.isEqual(r2.end)) {
      if (r1.start.isBefore(r2.start, 'strict')) {
        start = this.start;
        end = other.start;
      } else {
        
        return Selection.nullSelection
      }
    } else if (this.isInsideOf(other)) {
      return Selection.nullSelection
    } else {
      throw new Error('Could not determine coordinates for truncate. Check input')
    }
    return _createNewSelection(this, start, end)
  }

  
  getNodeIds() {
    const container = this.getContainer();
    const startPos = container.getPosition(this.start.path[0]);
    const endPos = container.getPosition(this.end.path[0]);
    return container.getContent().slice(startPos, endPos+1)
  }

  
  splitIntoPropertySelections() {
    let sels = [];
    let fragments = this.getFragments();
    fragments.forEach(function(fragment) {
      if (fragment instanceof Selection.Fragment) {
        sels.push(
          new PropertySelection(fragment.path, fragment.startOffset,
            fragment.endOffset, false, this.containerId, this.surfaceId)
        );
      }
    }.bind(this));
    return sels
  }

  _clone() {
    return new ContainerSelection(this)
  }

  _range(sel) {
    
    
    
    if (sel._internal.addressRange) {
      return sel._internal.addressRange
    }

    let container = this.getContainer();
    let startAddress = container.getAddress(sel.start);
    let endAddress;
    if (sel.isCollapsed()) {
      endAddress = startAddress;
    } else {
      endAddress = container.getAddress(sel.end);
    }
    let addressRange = {
      start: startAddress,
      end: endAddress
    };
    if (sel._isContainerSelection) {
      sel._internal.addressRange = addressRange;
    }
    return addressRange
  }

  get path() {
    throw new Error('ContainerSelection has no path property. Use startPath and endPath instead')
  }

}

ContainerSelection.prototype._isContainerSelection = true;

ContainerSelection.fromJSON = function(properties) {
  let sel = new ContainerSelection(properties);
  return sel
};

function _createNewSelection(containerSel, start, end) {
  let newSel;

  if (start === end) {
    newSel = new PropertySelection({
      path: start.path,
      startOffset: start.offset,
      endOffset: start.offset,
      containerId: containerSel.containerId,
      surfaceId: containerSel.surfaceId
    });
  } else {
    newSel = new ContainerSelection(containerSel.containerId,
    start.path, start.offset, end.path, end.offset, false, containerSel.surfaceId);
  }
  
  const doc = containerSel._internal.doc;
  if (doc) {
    newSel.attach(doc);
  }
  return newSel
}

class NodeSelection extends Selection {

  constructor(containerId, nodeId, mode, reverse, surfaceId) {
    super();

    if (arguments.length === 1) {
      let data = arguments[0];
      containerId = data.containerId;
      nodeId = data.nodeId;
      mode = data.mode;
      reverse = data.reverse;
      surfaceId = data.surfaceId;
    }

    if (!isString$1(containerId)) {
      throw new Error("'containerId' is mandatory.");
    }
    if (!isString$1(nodeId)) {
      throw new Error("'nodeId' is mandatory.");
    }
    mode = mode || "full";

    this.containerId = containerId;
    this.nodeId = nodeId;
    this.mode = mode;
    this.reverse = Boolean(reverse);
    this.surfaceId = surfaceId;

    this.start = new Coordinate([nodeId], 0);
    this.end = new Coordinate([nodeId], 1);
  }

  equals(other) {
    return (
      super.equals(other) &&
      this.nodeId === other.nodeId &&
      this.mode === other.mode
    )
  }

  isNodeSelection() {
    return true;
  }

  getType() {
    return 'node';
  }

  getNodeId() {
    return this.nodeId;
  }

  isFull() {
    return this.mode === 'full';
  }

  isBefore() {
    return this.mode === 'before';
  }

  isAfter() {
    return this.mode === 'after';
  }

  isCollapsed() {
    return this.mode !== 'full';
  }

  toJSON() {
    return {
      type: 'node',
      nodeId: this.nodeId,
      mode: this.mode,
      reverse: this.reverse,
      containerId: this.containerId,
      surfaceId: this.surfaceId
    };
  }

  toString() {
    
    return [
      "NodeSelection(",
      this.containerId, ".", this.nodeId, ", ",
      this.mode, ", ",
      (this.reverse?", reverse":""),
      (this.surfaceId?(", "+this.surfaceId):""),
      ")"
    ].join('');
  }

  collapse(direction) {
    if (direction === 'left') {
      if (this.isBefore()) {
        return this;
      } else {
        return new NodeSelection(this.containerId, this.nodeId, 'before', this.reverse, this.surfaceId);
      }
    } else if (direction === 'right') {
      if (this.isAfter()) {
        return this;
      } else {
        return new NodeSelection(this.containerId, this.nodeId, 'after', this.reverse, this.surfaceId);
      }
    } else {
      throw new Error("'direction' must be either 'left' or 'right'");
    }
  }

  _getCoordinate() {
    if (this.mode === 'before') {
      return new Coordinate([this.nodeId], 0);
    } else if (this.mode === 'after') {
      return new Coordinate([this.nodeId], 1);
    }
  }

  _clone() {
    return new NodeSelection(this);
  }
}

NodeSelection.prototype._isNodeSelection = true;

NodeSelection.fromJSON = function(json) {
  return new NodeSelection(json);
};


NodeSelection._createFromCoordinate = function(coor) {
  var containerId = coor.containerId;
  var nodeId = coor.getNodeId();
  var mode = coor.offset === 0 ? 'before' : 'after';
  return new NodeSelection(containerId, nodeId, mode, false);
};

class CustomSelection extends Selection {

  constructor(customType, data, surfaceId) {
    super();

    if (arguments.length === 1) {
      let _data = arguments[0];
      customType = _data.customType;
      data = _data.data;
      surfaceId = _data.surfaceId;
    }

    this.customType = customType;
    this.data = data || {};
    this.surfaceId = surfaceId;
  }

  isCustomSelection() {
    return true;
  }

  getType() {
    return 'custom';
  }

  getCustomType() {
    return this.customType;
  }

  toJSON() {
    return {
      type: 'custom',
      customType: this.customType,
      data: cloneDeep(this.data),
      surfaceId: this.surfaceId
    };
  }

  toString() {
    
    return [
      'CustomSelection(',
      this.customType,', ',
      JSON.stringify(this.data),
      ")"
    ].join('');
  }

  equals(other) {
    return (
      Selection.prototype.equals.call(this, other) &&
      other.isCustomSelection() &&
      isEqual(this.data, other.data)
    );
  }

  _clone() {
    return new CustomSelection(this)
  }
}

CustomSelection.prototype._isCustomSelection = true;

CustomSelection.fromJSON = function(json) {
  return new CustomSelection(json);
};

function fromJSON(json) {
  if (!json) return Selection.nullSelection
  var type = json.type;
  switch(type) {
    case 'property':
      return PropertySelection.fromJSON(json)
    case 'container':
      return ContainerSelection.fromJSON(json)
    case 'node':
      return NodeSelection.fromJSON(json)
    case 'custom':
      return CustomSelection.fromJSON(json)
    default:
      
      return Selection.nullSelection
  }
}


function isFirst(doc, coor) {
  if (coor.isNodeCoordinate() && coor.offset === 0) return true
  let node = doc.get(coor.path[0]).getContainerRoot();
  if (node.isText() && coor.offset === 0) return true
  if (node.isList()) {
    let itemId = coor.path[0];
    if (node.items[0] === itemId && coor.offset === 0) return true
  }
}


function isLast(doc, coor) {
  if (coor.isNodeCoordinate() && coor.offset > 0) return true
  let node = doc.get(coor.path[0]).getContainerRoot();
  if (node.isText() && coor.offset >= node.getLength()) return true
  if (node.isList()) {
    let itemId = coor.path[0];
    let item = doc.get(itemId);
    if (last$1(node.items) === itemId && coor.offset === item.getLength()) return true
  }
}

function isEntirelySelected(doc, node, start, end) {
  let { isEntirelySelected } = getRangeInfo(doc, node, start, end);
  return isEntirelySelected
}

function getRangeInfo(doc, node, start, end) {
  let isFirst = true;
  let isLast = true;
  if (node.isText()) {
    if (start && start.offset !== 0) isFirst = false;
    if (end && end.offset < node.getLength()) isLast = false;
  } else if (node.isList()) {
    if (start) {
      let itemId = start.path[0];
      let itemPos = node.getItemPosition(itemId);
      if (itemPos > 0 || start.offset !== 0) isFirst = false;
    }
    if (end) {
      let itemId = end.path[0];
      let itemPos = node.getItemPosition(itemId);
      let item = doc.get(itemId);
      if (itemPos < node.items.length-1 || end.offset < item.getLength()) isLast = false;
    }
  }
  let isEntirelySelected = isFirst && isLast;
  return {isFirst, isLast, isEntirelySelected}
}

function setCursor(tx, node, containerId, mode) {
  if (node.isText()) {
    let offset = 0;
    if (mode === 'after') {
      let text = node.getText();
      offset = text.length;
    }
    tx.setSelection({
      type: 'property',
      path: node.getTextPath(),
      startOffset: offset,
      containerId: containerId
    });
  } else if (node.isList()) {
    let item, offset;
    if (mode === 'after') {
      item = node.getLastItem();
      offset = item.getLength();
    } else {
      item = node.getFirstItem();
      offset = 0;
    }
    tx.setSelection({
      type: 'property',
      path: item.getTextPath(),
      startOffset: offset,
      containerId: containerId
    });
  } else {
    tx.setSelection({
      type: 'node',
      containerId: containerId,
      nodeId: node.id,
      
      
      
    });
  }
}

function selectNode(tx, nodeId, containerId) {
  tx.setSelection(createNodeSelection({ doc: tx, nodeId, containerId }));
}

function createNodeSelection({ doc, nodeId, containerId, mode, reverse, surfaceId}) {
  let node = doc.get(nodeId);
  if (!node) return Selection.nullSelection
  node = node.getContainerRoot();
  if (node.isText()) {
    return new PropertySelection({
      path: node.getTextPath(),
      startOffset: mode === 'after' ? node.getLength() : 0,
      endOffset: mode === 'before' ? 0 : node.getLength(),
      reverse: reverse,
      containerId: containerId,
      surfaceId: surfaceId
    })
  } else if (node.isList() && node.getLength()>0) {
    let first = node.getFirstItem();
    let last$$1 = node.getLastItem();
    let start = {
      path: first.getTextPath(),
      offset: 0
    };
    let end = {
      path: last$$1.getTextPath(),
      offset: last$$1.getLength()
    };
    if (mode === 'after') start = end;
    else if (mode === 'before') end = start;
    return new ContainerSelection({
      startPath: start.path,
      startOffset: start.offset,
      endPath: end.path,
      endOffset: end.offset,
      reverse: reverse,
      containerId: containerId,
      surfaceId: surfaceId
    })
  } else {
    return new NodeSelection({ nodeId, mode, reverse, containerId, surfaceId })
  }
}

function stepIntoIsolatedNode(editorSession, comp) {
  
  
  if (comp.grabFocus()) return true

  
  let surface = comp.find('.sc-surface');
  if (surface) {
    
    if (surface._isTextPropertyEditor) {
      const doc = editorSession.getDocument();
      const path = surface.getPath();
      const text = doc.get(path, 'strict');
      editorSession.setSelection({
        type: 'property',
        path: path,
        startOffset: text.length,
        surfaceId: surface.id
      });
      return true
    } else if (surface._isContainerEditor) {
      let container = surface.getContainer();
      if (container.length > 0) {
        let first = container.getChildAt(0);
        setCursor(editorSession, first, container.id, 'after');
      }
      return true
    }
  }
  return false
}

function augmentSelection(selData, oldSel) {
  
  if (selData && oldSel && !selData.surfaceId && !oldSel.isNull()) {
    selData.containerId = selData.containerId || oldSel.containerId;
    selData.surfaceId = selData.surfaceId || oldSel.surfaceId;
  }
  return selData
}


var selectionHelpers = Object.freeze({
	fromJSON: fromJSON,
	isFirst: isFirst,
	isLast: isLast,
	isEntirelySelected: isEntirelySelected,
	getRangeInfo: getRangeInfo,
	setCursor: setCursor,
	selectNode: selectNode,
	createNodeSelection: createNodeSelection,
	stepIntoIsolatedNode: stepIntoIsolatedNode,
	augmentSelection: augmentSelection
});

class Conflict extends Error {
  constructor(a, b) {
    super("Conflict: " + JSON.stringify(a) +" vs " + JSON.stringify(b));
    this.a = a;
    this.b = b;
  }
}

const INSERT = "insert";
const DELETE$1 = "delete";

class TextOperation {

  constructor(data) {
    if (!data || data.type === undefined || data.pos === undefined || data.str === undefined) {
      throw new Error("Illegal argument: insufficient data.")
    }
    
    this.type = data.type;
    
    this.pos = data.pos;
    
    this.str = data.str;
    
    if(!this.isInsert() && !this.isDelete()) {
      throw new Error("Illegal type.")
    }
    if (!isString$1(this.str)) {
      throw new Error("Illegal argument: expecting string.")
    }
    if (!isNumber(this.pos) || this.pos < 0) {
      throw new Error("Illegal argument: expecting positive number as pos.")
    }
  }

  apply(str) {
    if (this.isEmpty()) return str
    if (this.type === INSERT) {
      if (str.length < this.pos) {
        throw new Error("Provided string is too short.")
      }
      if (str.splice) {
        return str.splice(this.pos, 0, this.str)
      } else {
        return str.slice(0, this.pos).concat(this.str).concat(str.slice(this.pos))
      }
    }
    else  {
      if (str.length < this.pos + this.str.length) {
        throw new Error("Provided string is too short.")
      }
      if (str.splice) {
        return str.splice(this.pos, this.str.length)
      } else {
        return str.slice(0, this.pos).concat(str.slice(this.pos + this.str.length))
      }
    }
  }

  clone() {
    return new TextOperation(this)
  }

  isNOP() {
    return this.type === "NOP" || this.str.length === 0
  }

  isInsert() {
    return this.type === INSERT
  }

  isDelete() {
    return this.type === DELETE$1
  }

  getLength() {
    return this.str.length
  }

  invert() {
    var data = {
      type: this.isInsert() ? DELETE$1 : INSERT,
      pos: this.pos,
      str: this.str
    };
    return new TextOperation(data)
  }

  hasConflict(other) {
    return _hasConflict(this, other)
  }

  isEmpty() {
    return this.str.length === 0
  }

  toJSON() {
    return {
      type: this.type,
      pos: this.pos,
      str: this.str
    }
  }

  toString() {
    return ["(", (this.isInsert() ? INSERT : DELETE$1), ",", this.pos, ",'", this.str, "')"].join('')
  }
}

TextOperation.prototype._isOperation = true;
TextOperation.prototype._isTextOperation = true;

function _hasConflict(a, b) {
  
  
  
  if (a.type === INSERT && b.type === INSERT) return (a.pos === b.pos)
  
  
  
  if (a.type === DELETE$1 && b.type === DELETE$1) {
    
    return !(a.pos >= b.pos + b.str.length || b.pos >= a.pos + a.str.length)
  }
  
  
  
  var del, ins;
  if (a.type === DELETE$1) {
    del = a; ins = b;
  } else {
    del = b; ins = a;
  }
  return (ins.pos >= del.pos && ins.pos < del.pos + del.str.length)
}




function transform_insert_insert(a, b) {
  if (a.pos === b.pos) {
    b.pos += a.str.length;
  }
  else if (a.pos < b.pos) {
    b.pos += a.str.length;
  }
  else {
    a.pos += b.str.length;
  }
}





function transform_delete_delete$1(a, b, first) {
  
  if (a.pos > b.pos) {
    return transform_delete_delete$1(b, a, !first)
  }
  if (a.pos === b.pos && a.str.length > b.str.length) {
    return transform_delete_delete$1(b, a, !first)
  }
  
  if (b.pos < a.pos + a.str.length) {
    var s = b.pos - a.pos;
    var s1 = a.str.length - s;
    var s2 = s + b.str.length;
    a.str = a.str.slice(0, s) + a.str.slice(s2);
    b.str = b.str.slice(s1);
    b.pos -= s;
  } else {
    b.pos -= a.str.length;
  }
}





function transform_insert_delete(a, b) {
  if (a.type === DELETE$1) {
    return transform_insert_delete(b, a)
  }
  
  
  if (a.pos <= b.pos) {
    b.pos += a.str.length;
  }
  
  else if (a.pos >= b.pos + b.str.length) {
    a.pos -= b.str.length;
  }
  
  
  
  else {
    var s = a.pos - b.pos;
    b.str = b.str.slice(0, s) + a.str + b.str.slice(s);
    a.str = "";
  }
}

function transform$1(a, b, options) {
  options = options || {};
  if (options["no-conflict"] && _hasConflict(a, b)) {
    throw new Conflict(a, b)
  }
  if (!options.inplace) {
    a = a.clone();
    b = b.clone();
  }
  if (a.type === INSERT && b.type === INSERT) {
    transform_insert_insert(a, b);
  }
  else if (a.type === DELETE$1 && b.type === DELETE$1) {
    transform_delete_delete$1(a, b, true);
  }
  else {
    transform_insert_delete(a,b);
  }
  return [a, b]
}

TextOperation.transform = function() {
  return transform$1.apply(null, arguments)
};



TextOperation.Insert = function(pos, str) {
  return new TextOperation({ type: INSERT, pos: pos, str: str })
};

TextOperation.Delete = function(pos, str) {
  return new TextOperation({ type: DELETE$1, pos: pos, str: str })
};

TextOperation.INSERT = INSERT;
TextOperation.DELETE = DELETE$1;

TextOperation.fromJSON = function(data) {
  return new TextOperation(data)
};

const NOP$1 = "NOP";
const DELETE$2 = "delete";
const INSERT$1 = "insert";

class ArrayOperation {

  constructor(data) {
    if (!data || !data.type) {
      throw new Error("Illegal argument: insufficient data.")
    }
    this.type = data.type;
    if (this.type === NOP$1) return

    if (this.type !== INSERT$1 && this.type !== DELETE$2) {
      throw new Error("Illegal type.")
    }
    
    this.pos = data.pos;
    
    this.val = data.val;
    if (!isNumber(this.pos) || this.pos < 0) {
      throw new Error("Illegal argument: expecting positive number as pos.")
    }
  }

  apply(array) {
    if (this.type === NOP$1) {
      return array
    }
    if (this.type === INSERT$1) {
      if (array.length < this.pos) {
        throw new Error("Provided array is too small.")
      }
      array.splice(this.pos, 0, this.val);
      return array
    }
    
    else  {
      if (array.length < this.pos) {
        throw new Error("Provided array is too small.")
      }
      if (!isEqual(array[this.pos], this.val)) {
        throw Error("Unexpected value at position " + this.pos + ". Expected " + this.val + ", found " + array[this.pos])
      }
      array.splice(this.pos, 1);
      return array
    }
  }

  clone() {
    var data = {
      type: this.type,
      pos: this.pos,
      val: cloneDeep(this.val)
    };
    return new ArrayOperation(data)
  }

  invert() {
    var data = this.toJSON();
    if (this.type === NOP$1) data.type = NOP$1;
    else if (this.type === INSERT$1) data.type = DELETE$2;
    else  data.type = INSERT$1;
    return new ArrayOperation(data)
  }

  hasConflict(other) {
    return ArrayOperation.hasConflict(this, other)
  }

  toJSON() {
    var result = {
      type: this.type,
    };
    if (this.type === NOP$1) return result
    result.pos = this.pos;
    result.val = cloneDeep(this.val);
    return result
  }

  isInsert() {
    return this.type === INSERT$1
  }

  isDelete() {
    return this.type === DELETE$2
  }

  getOffset() {
    return this.pos
  }

  getValue() {
    return this.val
  }

  isNOP() {
    return this.type === NOP$1
  }

  toString() {
    return ["(", (this.isInsert() ? INSERT$1 : DELETE$2), ",", this.getOffset(), ",'", this.getValue(), "')"].join('')
  }
}

ArrayOperation.prototype._isOperation = true;
ArrayOperation.prototype._isArrayOperation = true;

function hasConflict$1(a, b) {
  if (a.type === NOP$1 || b.type === NOP$1) return false
  if (a.type === INSERT$1 && b.type === INSERT$1) {
    return a.pos === b.pos
  } else {
    return false
  }
}

function transform_insert_insert$1(a, b) {
  if (a.pos === b.pos) {
    b.pos += 1;
  }
  
  else if (a.pos < b.pos) {
    b.pos += 1;
  }
  
  else {
    a.pos += 1;
  }
}

function transform_delete_delete$2(a, b) {
  
  if (a.pos === b.pos) {
    b.type = NOP$1;
    a.type = NOP$1;
    return
  }
  if (a.pos < b.pos) {
    b.pos -= 1;
  } else {
    a.pos -= 1;
  }
}

function transform_insert_delete$1(a, b) {
  
  if (a.type === DELETE$2) {
    var tmp = a;
    a = b;
    b = tmp;
  }
  if (a.pos <= b.pos) {
    b.pos += 1;
  } else {
    a.pos -= 1;
  }
}

var transform$2 = function(a, b, options) {
  options = options || {};
  
  
  if (options['no-conflict'] && hasConflict$1(a, b)) {
    throw new Conflict(a, b)
  }
  
  if (!options.inplace) {
    a = a.clone();
    b = b.clone();
  }
  if (a.type === NOP$1 || b.type === NOP$1) {
    
  }
  else if (a.type === INSERT$1 && b.type === INSERT$1) {
    transform_insert_insert$1(a, b);
  }
  else if (a.type === DELETE$2 && b.type === DELETE$2) {
    transform_delete_delete$2(a, b);
  }
  else {
    transform_insert_delete$1(a, b);
  }
  return [a, b]
};

ArrayOperation.transform = transform$2;
ArrayOperation.hasConflict = hasConflict$1;



ArrayOperation.Insert = function(pos, val) {
  return new ArrayOperation({type:INSERT$1, pos: pos, val: val})
};

ArrayOperation.Delete = function(pos, val) {
  return new ArrayOperation({ type:DELETE$2, pos: pos, val: val })
};

ArrayOperation.fromJSON = function(data) {
  return new ArrayOperation(data)
};

ArrayOperation.NOP = NOP$1;
ArrayOperation.DELETE = DELETE$2;
ArrayOperation.INSERT = INSERT$1;

const SHIFT = 'shift';

class CoordinateOperation {

  constructor(data) {
    if (!data || data.type === undefined) {
      throw new Error("Illegal argument: insufficient data.")
    }
    
    this.type = data.type;
    
    this.val = data.val;
    
    if(!this.isShift()) {
      throw new Error("Illegal type.")
    }
    if (!isNumber(this.val)) {
      throw new Error("Illegal argument: expecting number as shift value.")
    }
  }

  apply(coor) {
    coor.offset = coor.offset + this.val;
  }

  isShift() {
    return this.type === SHIFT
  }

  isNOP() {
    switch (this.type) {
      case SHIFT: {
        return this.val === 0
      }
      default:
        return false
    }
  }

  clone() {
    return new CoordinateOperation(this)
  }

  invert() {
    let data;
    switch (this.type) {
      case SHIFT:
        data = {
          type: SHIFT,
          val: -this.val
        };
        break
      default:
        throw new Error('Invalid type.')
    }
    return new CoordinateOperation(data)
  }

  hasConflict() {
    
    return false
  }

  toJSON() {
    return {
      type: this.type,
      val: this.val
    }
  }

  toString() {
    return ["(", (this.type), ",", this.val, "')"].join('')
  }

}

CoordinateOperation.prototype._isOperation = true;
CoordinateOperation.prototype._isCoordinateOperation = true;

function transform_shift_shift(a, b) {
  a.val += b.val;
  b.val += a.val;
}

function transform$3(a, b, options) {
  options = options || {};
  
  if (!options.inplace) {
    a = a.clone();
    b = b.clone();
  }
  if (a.type === SHIFT && b.type === SHIFT) {
    transform_shift_shift(a, b);
  }
  else {
    throw new Error('Illegal type')
  }
  return [a, b]
}

CoordinateOperation.transform = function(...args) {
  return transform$3(...args)
};

CoordinateOperation.fromJSON = function(json) {
  return new CoordinateOperation(json)
};

CoordinateOperation.Shift = function(val) {
  return new CoordinateOperation({
    type: SHIFT,
    val: val
  })
};

const NOP = "NOP";
const CREATE = "create";
const DELETE = 'delete';
const UPDATE = 'update';
const SET = 'set';

class ObjectOperation {

  constructor(data) {
    
    if (!data) {
      throw new Error('Data of ObjectOperation is missing.')
    }
    
    if (!data.type) {
      throw new Error('Invalid data: type is mandatory.')
    }
    this.type = data.type;
    if (data.type === NOP) {
      return
    }
    this.path = data.path;
    if (!data.path) {
      throw new Error('Invalid data: path is mandatory.')
    }
    if (this.type === CREATE || this.type === DELETE) {
      if (!data.val) {
        throw new Error('Invalid data: value is missing.')
      }
      this.val = data.val;
    }
    else if (this.type === UPDATE) {
      if (data.diff) {
        this.diff = data.diff;
        if (data.diff._isTextOperation) {
          this.propertyType = 'string';
        } else if (data.diff._isArrayOperation) {
          this.propertyType = 'array';
        } else if (data.diff._isCoordinateOperation) {
          this.propertyType = 'coordinate';
        } else {
          throw new Error('Invalid data: diff must be a TextOperation or an ArrayOperation.')
        }
      } else {
        throw new Error("Invalid data: diff is mandatory for update operation.")
      }
    }
    else if (this.type === SET) {
      this.val = data.val;
      this.original = data.original;
    } else {
      throw new Error('Invalid type: '+ data.type)
    }
  }

  apply(obj) {
    if (this.type === NOP) return obj
    var adapter;
    if (obj._isPathObject) {
      adapter = obj;
    } else {
      adapter = new PathObject(obj);
    }
    if (this.type === CREATE) {
      adapter.set(this.path, cloneDeep(this.val));
      return obj
    }
    if (this.type === DELETE) {
      adapter.delete(this.path, "strict");
    }
    else if (this.type === UPDATE) {
      var diff$$1 = this.diff;
      switch (this.propertyType) {
        case 'array': {
          let arr = adapter.get(this.path);
          diff$$1.apply(arr);
          break
        }
        case 'string': {
          let str = adapter.get(this.path);
          if (isNil(str)) str = '';
          str = diff$$1.apply(str);
          adapter.set(this.path, str);
          break
        }
        case 'coordinate': {
          let coor = adapter.get(this.path);
          if (!coor) throw new Error('No coordinate with path '+this.path)
          diff$$1.apply(coor);
          break
        }
        default:
          throw new Error('Invalid state.')
      }
    }
    else if (this.type === SET) {
      
      adapter.set(this.path, cloneDeep(this.val));
    }
    else {
      throw new Error('Invalid type.')
    }
    return obj
  }

  clone() {
    var data = {
      type: this.type,
      path: this.path,
    };
    if (this.val) {
      data.val = cloneDeep(this.val);
    }
    if (this.diff) {
      data.diff = this.diff.clone();
    }
    return new ObjectOperation(data)
  }

  isNOP() {
    if (this.type === NOP) return true
    else if (this.type === UPDATE) return this.diff.isNOP()
  }

  isCreate() {
    return this.type === CREATE
  }

  isDelete() {
    return this.type === DELETE
  }

  isUpdate(propertyType) {
    if (propertyType) {
      return (this.type === UPDATE && this.propertyType === propertyType)
    } else {
      return this.type === UPDATE
    }
  }

  isSet() {
    return this.type === SET
  }

  invert() {
    if (this.type === NOP) {
      return new ObjectOperation({ type: NOP })
    }
    var result = new ObjectOperation(this);
    if (this.type === CREATE) {
      result.type = DELETE;
    }
    else if (this.type === DELETE) {
      result.type = CREATE;
    }
    else if (this.type === UPDATE) {
      var invertedDiff;
      if (this.diff._isTextOperation) {
        invertedDiff = TextOperation.fromJSON(this.diff.toJSON()).invert();
      } else if (this.diff._isArrayOperation) {
        invertedDiff = ArrayOperation.fromJSON(this.diff.toJSON()).invert();
      } else if (this.diff._isCoordinateOperation) {
        invertedDiff = CoordinateOperation.fromJSON(this.diff.toJSON()).invert();
      } else {
        throw new Error('Illegal type')
      }
      result.diff = invertedDiff;
    }
    else  {
      result.val = this.original;
      result.original = this.val;
    }
    return result
  }

  hasConflict(other) {
    return ObjectOperation.hasConflict(this, other)
  }

  toJSON() {
    if (this.type === NOP) {
      return { type: NOP }
    }
    var data = {
      type: this.type,
      path: this.path,
    };
    if (this.type === CREATE || this.type === DELETE) {
      data.val = this.val;
    }
    else if (this.type === UPDATE) {
      if (this.diff._isTextOperation) {
        data.propertyType = "string";
      } else if (this.diff._isArrayOperation) {
        data.propertyType = "array";
      } else if (this.diff._isCoordinateOperation) {
        data.propertyType = "coordinate";
      } else {
        throw new Error('Invalid property type.')
      }
      data.diff = this.diff.toJSON();
    }
    else  {
      data.val = this.val;
      data.original = this.original;
    }
    return data
  }

  getType() {
    return this.type
  }

  getPath() {
    return this.path
  }

  getValue() {
    return this.val
  }

  getOldValue() {
    return this.original
  }

  getValueOp() {
    return this.diff
  }

  
  toString() {
    switch (this.type) {
      case CREATE:
        return ["(+,", JSON.stringify(this.path), JSON.stringify(this.val), ")"].join('')
      case DELETE:
        return ["(-,", JSON.stringify(this.path), JSON.stringify(this.val), ")"].join('')
      case UPDATE:
        return ["(>>,", JSON.stringify(this.path), this.propertyType, this.diff.toString(), ")"].join('')
      case SET:
        return ["(=,", JSON.stringify(this.path), this.val, this.original, ")"].join('')
      case NOP:
        return "NOP"
      default:
        throw new Error('Invalid type')
    }
  }
}

ObjectOperation.prototype._isOperation = true;
ObjectOperation.prototype._isObjectOperation = true;



function hasConflict(a, b) {
  if (a.type === NOP || b.type === NOP) return false
  return isEqual(a.path, b.path)
}

function transform_delete_delete(a, b) {
  
  
  a.type = NOP;
  b.type = NOP;
}

function transform_create_create() {
  throw new Error("Can not transform two concurring creates of the same property")
}

function transform_delete_create() {
  throw new Error('Illegal state: can not create and delete a value at the same time.')
}

function transform_delete_update(a, b, flipped) {
  if (a.type !== DELETE) {
    return transform_delete_update(b, a, true)
  }
  var op;
  switch (b.propertyType) {
    case 'string':
      op = TextOperation.fromJSON(b.diff);
      break
    case 'array':
      op = ArrayOperation.fromJSON(b.diff);
      break
    case 'coordinate':
      op = CoordinateOperation.fromJSON(b.diff);
      break
    default:
      throw new Error('Illegal type')
  }
  
  if (!flipped) {
    a.type = NOP;
    b.type = CREATE;
    b.val = op.apply(a.val);
  }
  
  else {
    a.val = op.apply(a.val);
    b.type = NOP;
  }
}

function transform_create_update() {
  
  throw new Error("Can not transform a concurring create and update of the same property")
}

function transform_update_update(a, b) {
  
  var op_a, op_b, t;
  switch(b.propertyType) {
    case 'string':
      op_a = TextOperation.fromJSON(a.diff);
      op_b = TextOperation.fromJSON(b.diff);
      t = TextOperation.transform(op_a, op_b, {inplace: true});
      break
    case 'array':
      op_a = ArrayOperation.fromJSON(a.diff);
      op_b = ArrayOperation.fromJSON(b.diff);
      t = ArrayOperation.transform(op_a, op_b, {inplace: true});
      break
    case 'coordinate':
      op_a = CoordinateOperation.fromJSON(a.diff);
      op_b = CoordinateOperation.fromJSON(b.diff);
      t = CoordinateOperation.transform(op_a, op_b, {inplace: true});
      break
    default:
      throw new Error('Illegal type')
  }
  a.diff = t[0];
  b.diff = t[1];
}

function transform_create_set() {
  throw new Error('Illegal state: can not create and set a value at the same time.')
}

function transform_delete_set(a, b, flipped) {
  if (a.type !== DELETE) return transform_delete_set(b, a, true)
  if (!flipped) {
    a.type = NOP;
    b.type = CREATE;
    b.original = undefined;
  } else {
    a.val = b.val;
    b.type = NOP;
  }
}

function transform_update_set() {
  throw new Error("Unresolvable conflict: update + set.")
}

function transform_set_set(a, b) {
  a.type = NOP;
  b.original = a.val;
}

const _NOP = 0;
const _CREATE = 1;
const _DELETE = 2;
const _UPDATE = 4;
const _SET = 8;

const CODE = (() => {
  const c = {};
  c[NOP] =_NOP;
  c[CREATE] = _CREATE;
  c[DELETE] = _DELETE;
  c[UPDATE] = _UPDATE;
  c[SET] = _SET;
  return c
})();

const __transform__ = (() => {
  
  const t = {};
  t[_DELETE | _DELETE] = transform_delete_delete;
  t[_DELETE | _CREATE] = transform_delete_create;
  t[_DELETE | _UPDATE] = transform_delete_update;
  t[_CREATE | _CREATE] = transform_create_create;
  t[_CREATE | _UPDATE] = transform_create_update;
  t[_UPDATE | _UPDATE] = transform_update_update;
  t[_CREATE | _SET   ] = transform_create_set;
  t[_DELETE | _SET   ] = transform_delete_set;
  t[_UPDATE | _SET   ] = transform_update_set;
  t[_SET    | _SET   ] = transform_set_set;
  
  return t
})();

function transform(a, b, options) {
  options = options || {};
  if (options['no-conflict'] && hasConflict(a, b)) {
    throw new Conflict(a, b)
  }
  if (!options.inplace) {
    a = a.clone();
    b = b.clone();
  }
  if (a.isNOP() || b.isNOP()) {
    return [a, b]
  }
  var sameProp = isEqual(a.path, b.path);
  
  if (sameProp) {
    __transform__[CODE[a.type] | CODE[b.type]](a,b);
  }
  return [a, b]
}

ObjectOperation.transform = transform;
ObjectOperation.hasConflict = hasConflict;



ObjectOperation.Create = function(idOrPath, val) {
  var path;
  if (isString$1(idOrPath)) {
    path = [idOrPath];
  } else {
    path = idOrPath;
  }
  return new ObjectOperation({type: CREATE, path: path, val: val})
};

ObjectOperation.Delete = function(idOrPath, val) {
  var path;
  if (isString$1(idOrPath)) {
    path = [idOrPath];
  } else {
    path = idOrPath;
  }
  return new ObjectOperation({type: DELETE, path: path, val: val})
};

ObjectOperation.Update = function(path, op) {
  return new ObjectOperation({
    type: UPDATE,
    path: path,
    diff: op
  })
};

ObjectOperation.Set = function(path, oldVal, newVal) {
  return new ObjectOperation({
    type: SET,
    path: path,
    val: cloneDeep(newVal),
    original: cloneDeep(oldVal)
  })
};

ObjectOperation.fromJSON = function(data) {
  data = cloneDeep(data);
  if (data.type === "update") {
    switch (data.propertyType) {
      case "string":
        data.diff = TextOperation.fromJSON(data.diff);
        break
      case "array":
        data.diff = ArrayOperation.fromJSON(data.diff);
        break
      case "coordinate":
        data.diff = CoordinateOperation.fromJSON(data.diff);
        break
      default:
        throw new Error("Unsupported update diff:" + JSON.stringify(data.diff))
    }
  }
  var op = new ObjectOperation(data);
  return op
};

ObjectOperation.NOP = NOP;
ObjectOperation.CREATE = CREATE;
ObjectOperation.DELETE = DELETE;
ObjectOperation.UPDATE = UPDATE;
ObjectOperation.SET = SET;

function transformDocumentChange(A, B) {
  _transformInplaceBatch(A, B);
}

function transformSelection(sel, a) {
  let newSel = sel.clone();
  let hasChanged = _transformSelectionInplace(newSel, a);
  if (hasChanged) {
    return newSel
  } else {
    return sel
  }
}

function _transformInplaceSingle(a, b) {
  for (let i = 0; i < a.ops.length; i++) {
    let a_op = a.ops[i];
    for (let j = 0; j < b.ops.length; j++) {
      let b_op = b.ops[j];
      
      
      ObjectOperation.transform(a_op, b_op, {inplace: true});
    }
  }
  if (a.before) {
    _transformSelectionInplace(a.before.selection, b);
  }
  if (a.after) {
    _transformSelectionInplace(a.after.selection, b);
  }
  if (b.before) {
    _transformSelectionInplace(b.before.selection, a);
  }
  if (b.after) {
    _transformSelectionInplace(b.after.selection, a);
  }
}

function _transformInplaceBatch(A, B) {
  if (!isArray$1(A)) {
    A = [A];
  }
  if (!isArray$1(B)) {
    B = [B];
  }
  for (let i = 0; i < A.length; i++) {
    let a = A[i];
    for (let j = 0; j < B.length; j++) {
      let b = B[j];
      _transformInplaceSingle(a,b);
    }
  }
}

function _transformSelectionInplace(sel, a) {
  if (!sel || (!sel.isPropertySelection() && !sel.isContainerSelection()) ) {
    return false
  }
  let ops = a.ops;
  let hasChanged = false;
  let isCollapsed = sel.isCollapsed();
  for(let i=0; i<ops.length; i++) {
    let op = ops[i];
    hasChanged |= _transformCoordinateInplace(sel.start, op);
    if (!isCollapsed) {
      hasChanged |= _transformCoordinateInplace(sel.end, op);
    } else {
      if (sel.isContainerSelection()) {
        sel.end.path = sel.start.path;
      }
      sel.end.offset = sel.start.offset;
    }
  }
  return hasChanged
}

function _transformCoordinateInplace(coor, op) {
  if (!isEqual(op.path, coor.path)) return false
  let hasChanged = false;
  if (op.type === 'update' && op.propertyType === 'string') {
    let diff$$1 = op.diff;
    let newOffset;
    if (diff$$1.isInsert() && diff$$1.pos <= coor.offset) {
      newOffset = coor.offset + diff$$1.str.length;
      
      coor.offset = newOffset;
      hasChanged = true;
    } else if (diff$$1.isDelete() && diff$$1.pos <= coor.offset) {
      newOffset = Math.max(diff$$1.pos, coor.offset - diff$$1.str.length);
      
      coor.offset = newOffset;
      hasChanged = true;
    }
  }
  return hasChanged
}


var operationHelpers = Object.freeze({
	transformDocumentChange: transformDocumentChange,
	transformSelection: transformSelection
});

var annotationHelpers = {
  insertedText,
  deletedText,
  transferAnnotations,
  expandAnnotation,
  fuseAnnotation,
  truncateAnnotation
};

function insertedText(doc, coordinate, length) {
  if (!length) return;
  var index = doc.getIndex('annotations');
  var annotations = index.get(coordinate.path);
  for (let i = 0; i < annotations.length; i++) {
    let anno = annotations[i];
    var pos = coordinate.offset;
    var start = anno.start.offset;
    var end = anno.end.offset;
    var newStart = start;
    var newEnd = end;
    if ( (pos < start) ||
         (pos === start) ) {
      newStart += length;
    }
    
    if ( (pos < end) ||
         (pos === end && !anno.isInline()) ) {
      newEnd += length;
    }
    
    if (newStart !== start) {
      doc.set([anno.id, 'start', 'offset'], newStart);
    }
    if (newEnd !== end) {
      doc.set([anno.id, 'end', 'offset'], newEnd);
    }
  }

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
}

function deletedText(doc, path, startOffset, endOffset) {
  if (startOffset === endOffset) return;
  var index = doc.getIndex('annotations');
  var annotations = index.get(path);
  var length = endOffset - startOffset;
  for (let i = 0; i < annotations.length; i++) {
    let anno = annotations[i];
    var pos1 = startOffset;
    var pos2 = endOffset;
    var start = anno.start.offset;
    var end = anno.end.offset;
    var newStart = start;
    var newEnd = end;
    if (pos2 <= start) {
      newStart -= length;
      newEnd -= length;
      doc.set([anno.id, 'start', 'offset'], newStart);
      doc.set([anno.id, 'end', 'offset'], newEnd);
    } else {
      if (pos1 <= start) {
        newStart = start - Math.min(pos2-pos1, start-pos1);
      }
      if (pos1 <= end) {
        newEnd = end - Math.min(pos2-pos1, end-pos1);
      }
      
      if (start !== end && newStart === newEnd) {
        doc.delete(anno.id);
      } else {
        
        if (start !== newStart) {
          doc.set([anno.id, 'start', 'offset'], newStart);
        }
        if (end !== newEnd) {
          doc.set([anno.id, 'end', 'offset'], newEnd);
        }
      }
    }
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
}


function transferAnnotations(doc, path, offset, newPath, newOffset) {
  var index = doc.getIndex('annotations');
  var annotations = index.get(path, offset);
  for (let i = 0; i < annotations.length; i++) {
    let a = annotations[i];
    var isInside = (offset > a.start.offset && offset < a.end.offset);
    var start = a.start.offset;
    var end = a.end.offset;
    
    if (isInside) {
      
      if (a.canSplit()) {
        let newAnno = a.toJSON();
        newAnno.id = uuid(a.type + "_");
        newAnno.start.path = newPath;
        newAnno.start.offset = newOffset;
        newAnno.end.path = newPath;
        newAnno.end.offset = newOffset + a.end.offset - offset;
        doc.create(newAnno);
      }
      
      let newStartOffset = a.start.offset;
      let newEndOffset = offset;
      
      if (newEndOffset === newStartOffset) {
        doc.delete(a.id);
      }
      
      else {
        
        if (newStartOffset !== start) {
          doc.set([a.id, 'start', 'offset'], newStartOffset);
        }
        if (newEndOffset !== end) {
          doc.set([a.id, 'end', 'offset'], newEndOffset);
        }
      }
    }
    
    else if (a.start.offset >= offset) {
      
      
      
      doc.set([a.id, 'start', 'path'], newPath);
      doc.set([a.id, 'start', 'offset'], newOffset + a.start.offset - offset);
      doc.set([a.id, 'end', 'path'], newPath);
      doc.set([a.id, 'end', 'offset'], newOffset + a.end.offset - offset);
    }
  }

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
}


function truncateAnnotation(tx, anno, sel) {
  if (!sel || !sel._isSelection) throw new Error('Argument "selection" is required.')
  if (!anno || !anno.isAnnotation()) throw new Error('Argument "anno" is required and must be an annotation.')
  let annoSel = anno.getSelection();
  let newAnnoSel = annoSel.truncateWith(sel);
  anno._updateRange(tx, newAnnoSel);
  return anno
}


function expandAnnotation(tx, anno, sel) {
  if (!sel || !sel._isSelection) throw new Error('Argument "selection" is required.')
  if (!anno || !anno.isAnnotation()) throw new Error('Argument "anno" is required and must be an annotation.')
  let annoSel = anno.getSelection();
  let newAnnoSel = annoSel.expand(sel);
  anno._updateRange(tx, newAnnoSel);
  return anno
}


function fuseAnnotation(tx, annos) {
  if (!isArray$1(annos) || annos.length < 2) {
    throw new Error('fuseAnnotation(): at least two annotations are necessary.')
  }
  let sel, annoType;
  annos.forEach(function(anno, idx) {
    if (idx === 0) {
      sel = anno.getSelection();
      annoType = anno.type;
    } else {
      if (anno.type !== annoType) {
        throw new Error('fuseAnnotation(): all annotations must be of the same type.')
      }
      sel = sel.expand(anno.getSelection());
    }
  });
  
  for (var i = 1; i < annos.length; i++) {
    tx.delete(annos[i].id);
  }
  expandAnnotation(tx, annos[0], sel);
  tx.setSelection(sel);
}

class NodeIndex {

  
  select(node) { 
    throw new Error('This method is abstract.')
  }

  clear() {
    throw new Error('This method is abstract')
  }

  
  create(node) { 
    throw new Error('This method is abstract.')
  }

  
  delete(node) { 
    throw new Error('This method is abstract.')
  }

  set(node, path, newValue, oldValue) {
    this.update(node, path, newValue, oldValue);
  }

  
  update(node, path, newValue, oldValue) { 
    throw new Error('This method is abstract.')
  }

  
  reset(data) {
    this.clear();
    this._initialize(data);
  }

  
  clone() {
    var NodeIndexClass = this.constructor;
    var clone$$1 = new NodeIndexClass();
    return clone$$1
  }

  _initialize(data) {
    forEach(data.getNodes(), function(node) {
      if (this.select(node)) {
        this.create(node);
      }
    }.bind(this));
  }
}


NodeIndex.create = function(prototype) {
  var index = Object.assign(new NodeIndex(), prototype);
  index.clone = function() {
    return NodeIndex.create(prototype)
  };
  return index
};


NodeIndex.filterByType = function(type) {
  return function(node) {
    return node.isInstanceOf(type)
  }
};

class DocumentIndex extends NodeIndex {}

class AnnotationIndex extends DocumentIndex {

  constructor() {
    super();

    this.byPath = new TreeIndex();
    this.byType = new TreeIndex();
  }

  select(node) {
    return node.isPropertyAnnotation()
  }

  clear() {
    this.byPath.clear();
    this.byType.clear();
  }

  
  get(path, start, end, type) {
    var annotations;
    if (isString$1(path) || path.length === 1) {
      annotations = this.byPath.getAll(path) || {};
    } else {
      annotations = this.byPath.get(path);
    }
    annotations = map(annotations);
    if (isNumber(start)) {
      annotations = filter(annotations, AnnotationIndex.filterByRange(start, end));
    }
    if (type) {
      annotations = filter(annotations, DocumentIndex.filterByType(type));
    }
    return annotations
  }

  create(anno) {
    const path = anno.start.path;
    this.byType.set([anno.type, anno.id], anno);
    if (path && path.length > 0) {
      this.byPath.set(anno.start.path.concat([anno.id]), anno);
    }
  }

  delete(anno) {
    this._delete(anno.type, anno.id, anno.start.path);
  }

  _delete(type, id, path) {
    this.byType.delete([type, id]);
    if (path && path.length > 0) {
      this.byPath.delete(path.concat([id]));
    }
  }

  update(node, path, newValue, oldValue) {
    
    if (this.select(node) && path[1] === 'start' && path[2] === "path") {
      this._delete(node.type, node.id, oldValue);
      this.create(node);
    }
  }
}

AnnotationIndex.filterByRange = function(start, end) {
  return function(anno) {
    var aStart = anno.start.offset;
    var aEnd = anno.end.offset;
    var overlap = (aEnd >= start);
    
    if (isNumber(end)) {
      overlap = overlap && (aStart <= end);
    }
    return overlap
  }
};

class PropertyIndex extends NodeIndex {

  constructor(property) {
    super();

    this._property = property || 'id';
    this.index = new TreeIndex();
  }

  
  get(path) {
    return this.index.get(path) || {}
  }

  
  getAll(path) {
    return this.index.getAll(path)
  }

  clear() {
    this.index.clear();
  }

  
  select(node) { 
    return true
  }

  
  create(node) {
    var values = node[this._property];
    if (!isArray$1(values)) {
      values = [values];
    }
    forEach(values, function(value) {
      this.index.set([value, node.id], node);
    }.bind(this));
  }

  
  delete(node) {
    var values = node[this._property];
    if (!isArray$1(values)) {
      values = [values];
    }
    forEach(values, function(value) {
      this.index.delete([value, node.id]);
    }.bind(this));
  }

  
  update(node, path, newValue, oldValue) {
    if (!this.select(node) || path[1] !== this._property) return
    var values = oldValue;
    if (!isArray$1(values)) {
      values = [values];
    }
    forEach(values, function(value) {
      this.index.delete([value, node.id]);
    }.bind(this));
    values = newValue;
    if (!isArray$1(values)) {
      values = [values];
    }
    forEach(values, function(value) {
      this.index.set([value, node.id], node);
    }.bind(this));
  }

  set(node, path, newValue, oldValue) {
    this.update(node, path, newValue, oldValue);
  }

  _initialize(data) {
    forEach(data.getNodes(), function(node) {
      if (this.select(node)) {
        this.create(node);
      }
    }.bind(this));
  }
}

class ContainerAnnotationIndex extends DocumentIndex {

  constructor() {
    super();
    this.byId = new TreeIndex();
  }

  select(node) {
    return node.isContainerAnnotation()
  }

  clear() {
    this.byId.clear();
  }

  get(containerId, type) {
    var annotations = map(this.byId.get(containerId));
    if (isString$1(type)) {
      annotations = filter(annotations, DocumentIndex.filterByType);
    }
    return annotations
  }

  create(anno) {
    this.byId.set([anno.containerId, anno.id], anno);
  }

  delete(anno) {
    this.byId.delete([anno.containerId, anno.id]);
  }

  update(node, path, newValue, oldValue) { 
    
  }

}

class OperationSerializer{

  constructor() {
    this.SEPARATOR = '\t';
  }

  serialize(op) {
    var out = [];
    switch (op.type) {
      case 'create':
        out.push('c');
        out.push(op.val.id);
        out.push(op.val);
        break
      case 'delete':
        out.push('d');
        out.push(op.val.id);
        out.push(op.val);
        break
      case 'set':
        out.push('s');
        out.push(op.path.join('.'));
        out.push(op.val);
        out.push(op.original);
        break
      case 'update':
        out.push('u');
        out.push(op.path.join('.'));
        Array.prototype.push.apply(out, this.serializePrimitiveOp(op.diff));
        break
      default:
        throw new Error('Unsupported operation type.')
    }
    return out
  }

  serializePrimitiveOp(op) {
    var out = [];
    if (op._isTextOperation) {
      if (op.isInsert()) {
        out.push('t+');
      } else if (op.isDelete()) {
        out.push('t-');
      }
      out.push(op.pos);
      out.push(op.str);
    } else if (op._isArrayOperation) {
      if (op.isInsert()) {
        out.push('a+');
      } else if (op.isDelete()) {
        out.push('a-');
      }
      out.push(op.pos);
      out.push(op.val);
    } else if (op._isCoordinateOperation) {
      if (op.isShift()) {
        out.push('c>>');
      } else {
        throw new Error('Unsupported CoordinateOperation type.')
      }
      out.push(op.pos);
      out.push(op.val);
    } else {
      throw new Error('Unsupported operation type.')
    }
    return out
  }

  deserialize(str, tokenizer) {
    if (!tokenizer) {
      tokenizer = new Tokenizer(str, this.SEPARATOR);
    }
    var type = tokenizer.getString();
    var op, path, val, oldVal, diff$$1;
    switch (type) {
      case 'c':
        path = tokenizer.getPath();
        val = tokenizer.getObject();
        op = ObjectOperation.Create(path, val);
        break
      case 'd':
        path = tokenizer.getPath();
        val = tokenizer.getObject();
        op = ObjectOperation.Delete(path, val);
        break
      case 's':
        path = tokenizer.getPath();
        val = tokenizer.getAny();
        oldVal = tokenizer.getAny();
        op = ObjectOperation.Set(path, oldVal, val);
        break
      case 'u':
        path = tokenizer.getPath();
        diff$$1 = this.deserializePrimitiveOp(str, tokenizer);
        op = ObjectOperation.Update(path, diff$$1);
        break
      default:
        throw new Error('Illegal type for ObjectOperation: '+ type)
    }
    return op
  }

  deserializePrimitiveOp(str, tokenizer) {
    if (!tokenizer) {
      tokenizer = new Tokenizer(str, this.SEPARATOR);
    }
    var type = tokenizer.getString();
    var op, pos, val;
    switch (type) {
      case 't+':
        pos = tokenizer.getNumber();
        val = tokenizer.getString();
        op = TextOperation.Insert(pos, val);
        break
      case 't-':
        pos = tokenizer.getNumber();
        val = tokenizer.getString();
        op = TextOperation.Delete(pos, val);
        break
      case 'a+':
        pos = tokenizer.getNumber();
        val = tokenizer.getAny();
        op = ArrayOperation.Insert(pos, val);
        break
      case 'a-':
        pos = tokenizer.getNumber();
        val = tokenizer.getAny();
        op = ArrayOperation.Delete(pos, val);
        break
      case 'c>>':
        val = tokenizer.getNumber();
        op = CoordinateOperation.Shift(val);
        break
      default:
        throw new Error('Unsupported operation type: ' + type)
    }
    return op
  }
}

class Tokenizer {
  constructor(str, sep) {
    if (isArray$1(arguments[0])) {
      this.tokens = arguments[0];
    } else {
      this.tokens = str.split(sep);
    }
    this.pos = -1;
  }

  error(msg) {
    throw new Error('Parsing error: ' + msg + '\n' + this.tokens[this.pos])
  }

  getString() {
    this.pos++;
    var str = this.tokens[this.pos];
    if (str[0] === '"') {
      str = str.slice(1, -1);
    }
    return str
  }

  getNumber() {
    this.pos++;
    var number;
    var token = this.tokens[this.pos];
    try {
      if (isNumber(token)) {
        number = token;
      } else {
        number = parseInt(this.tokens[this.pos], 10);
      }
      return number
    } catch (err) {
      this.error('expected number');
    }
  }

  getObject() {
    this.pos++;
    var obj;
    var token = this.tokens[this.pos];
    try {
      if (isObject$1(token)) {
        obj = token;
      } else {
        obj = JSON.parse(this.tokens[this.pos]);
      }
      return obj
    } catch (err) {
      this.error('expected object');
    }
  }

  getAny() {
    this.pos++;
    var token = this.tokens[this.pos];
    return token
  }

  getPath() {
    var str = this.getString();
    return str.split('.')
  }
}

OperationSerializer.Tokenizer = Tokenizer;

class DocumentChange {

  constructor(ops, before, after) {
    if (arguments.length === 1 && isPlainObject$1(arguments[0])) {
      let data = arguments[0];
      
      this.sha = data.sha;
      
      this.timestamp = data.timestamp;
      
      this.before = data.before || {};
      
      this.ops = data.ops;
      this.info = data.info; 
      
      this.after = data.after || {};
    } else if (arguments.length === 3) {
      this.sha = uuid();
      this.info = {};
      this.timestamp = Date.now();
      this.ops = ops.slice(0);
      this.before = before || {};
      this.after = after || {};
    } else {
      throw new Error('Illegal arguments.')
    }
    
    this.updated = null;
    
    this.created = null;
    
    this.deleted = null;
  }

  
  _extractInformation(doc) {
    let ops = this.ops;
    let created = {};
    let deleted = {};
    let updated = {};
    let affectedContainerAnnos = [];

    
    function _checkAnnotation(op) {
      switch (op.type) {
        case "create":
        case "delete": {
          let node = op.val;
          if (node.hasOwnProperty('start')) {
            updated[node.start.path] = true;
          }
          if (node.hasOwnProperty('end')) {
            updated[node.end.path] = true;
          }
          break
        }
        case "update":
        case "set": {
          
          let node = doc.get(op.path[0]);
          if (node) {
            if (node.isPropertyAnnotation()) {
              updated[node.start.path] = true;
            } else if (node.isContainerAnnotation()) {
              affectedContainerAnnos.push(node);
            }
          }
          break
        }
        default:
          
          throw new Error('Illegal state')
      }
    }

    for (let i = 0; i < ops.length; i++) {
      let op = ops[i];
      if (op.type === "create") {
        created[op.val.id] = op.val;
        delete deleted[op.val.id];
      }
      if (op.type === "delete") {
        delete created[op.val.id];
        deleted[op.val.id] = op.val;
      }
      if (op.type === "set" || op.type === "update") {
        updated[op.path] = true;
        
        updated[op.path[0]] = true;
      }
      _checkAnnotation(op);
    }

    affectedContainerAnnos.forEach(function(anno) {
      let container = doc.get(anno.containerId, 'strict');
      let startPos = container.getPosition(anno.start.path[0]);
      let endPos = container.getPosition(anno.end.path[0]);
      for (let pos = startPos; pos <= endPos; pos++) {
        let node = container.getChildAt(pos);
        let path;
        if (node.isText()) {
          path = [node.id, 'content'];
        } else {
          path = [node.id];
        }
        if (!deleted[node.id]) {
          updated[path] = true;
        }
      }
    });

    
    if(Object.keys(deleted).length > 0) {
      forEach(updated, function(_, key) {
        let nodeId = key.split(',')[0];
        if (deleted[nodeId]) {
          delete updated[key];
        }
      });
    }

    this.created = created;
    this.deleted = deleted;
    this.updated = updated;
  }

  invert() {
    
    let copy = this.toJSON();
    copy.ops = [];
    
    let tmp = copy.before;
    copy.before = copy.after;
    copy.after = tmp;
    let inverted = DocumentChange.fromJSON(copy);
    let ops = [];
    for (let i = this.ops.length - 1; i >= 0; i--) {
      ops.push(this.ops[i].invert());
    }
    inverted.ops = ops;
    return inverted
  }

  
  isAffected(path) {
    console.error('DEPRECATED: use change.hasUpdated() instead');
    return this.hasUpdated(path)
  }

  isUpdated(path) {
    console.error('DEPRECATED: use change.hasUpdated() instead');
    return this.hasUpdated(path)
  }
  

  hasUpdated(path) {
    return this.updated[path]
  }

  hasDeleted(id) {
    return this.deleted[id]
  }

  serialize() {
    
    

    let opSerializer = new OperationSerializer();
    let data = this.toJSON();
    data.ops = this.ops.map(function(op) {
      return opSerializer.serialize(op)
    });
    return JSON.stringify(data)
  }

  clone() {
    return DocumentChange.fromJSON(this.toJSON())
  }

  toJSON() {
    let data = {
      
      sha: this.sha,
      
      before: clone(this.before),
      ops: map(this.ops, function(op) {
        return op.toJSON()
      }),
      info: this.info,
      
      after: clone(this.after),
    };

    
    
    data.after.selection = undefined;
    data.before.selection = undefined;

    let sel = this.before.selection;
    if (sel && sel._isSelection) {
      data.before.selection = sel.toJSON();
    }
    sel = this.after.selection;
    if (sel && sel._isSelection) {
      data.after.selection = sel.toJSON();
    }
    return data
  }
}

DocumentChange.deserialize = function(str) {
  let opSerializer = new OperationSerializer();
  let data = JSON.parse(str);
  data.ops = data.ops.map(function(opData) {
    return opSerializer.deserialize(opData)
  });
  if (data.before.selection) {
    data.before.selection = fromJSON(data.before.selection);
  }
  if (data.after.selection) {
    data.after.selection = fromJSON(data.after.selection);
  }
  return new DocumentChange(data)
};

DocumentChange.fromJSON = function(data) {
  
  let change = cloneDeep(data);
  change.ops = data.ops.map(function(opData) {
    return ObjectOperation.fromJSON(opData)
  });
  change.before.selection = fromJSON(data.before.selection);
  change.after.selection = fromJSON(data.after.selection);
  return new DocumentChange(change)
};

class Data extends EventEmitter {

  
  constructor(schema, nodeFactory) {
    super();

    
    if (!schema) {
      throw new Error('schema is mandatory')
    }
    if (!nodeFactory) {
      throw new Error('nodeFactory is mandatory')
    }
   

    this.schema = schema;
    this.nodeFactory = nodeFactory;
    this.nodes = {};
    this.indexes = {};

    
    
    this.__QUEUE_INDEXING__ = false;
    this.queue = [];
  }

  
  contains(id) {
    return Boolean(this.nodes[id])
  }

  
  get(path, strict) {
    let result = this._get(path);
    if (strict && result === undefined) {
      if (isString$1(path)) {
        throw new Error("Could not find node with id '"+path+"'.")
      } else if (!this.contains(path[0])) {
        throw new Error("Could not find node with id '"+path[0]+"'.")
      } else {
        throw new Error("Property for path '"+path+"' us undefined.")
      }
    }
    return result
  }

  _get(path) {
    if (!path) return undefined
    let result;
    if (isString$1(path)) {
      result = this.nodes[path];
    } else if (path.length === 1) {
      result = this.nodes[path[0]];
    } else if (path.length > 1) {
      let context = this.nodes[path[0]];
      for (let i = 1; i < path.length-1; i++) {
        if (!context) return undefined
        context = context[path[i]];
      }
      if (!context) return undefined
      result = context[path[path.length-1]];
    }
    return result
  }

  
  getNodes() {
    return this.nodes
  }

  
  create(nodeData) {
    var node = this.nodeFactory.create(nodeData.type, nodeData);
    if (!node) {
      throw new Error('Illegal argument: could not create node for data:', nodeData)
    }
    if (this.contains(node.id)) {
      throw new Error("Node already exists: " + node.id)
    }
    if (!node.id || !node.type) {
      throw new Error("Node id and type are mandatory.")
    }
    this.nodes[node.id] = node;

    var change = {
      type: 'create',
      node: node
    };

    if (this.__QUEUE_INDEXING__) {
      this.queue.push(change);
    } else {
      this._updateIndexes(change);
    }

    return node
  }

  
  delete(nodeId) {
    var node = this.nodes[nodeId];
    if (!node) return
    node.dispose();
    delete this.nodes[nodeId];

    var change = {
      type: 'delete',
      node: node,
    };

    if (this.__QUEUE_INDEXING__) {
      this.queue.push(change);
    } else {
      this._updateIndexes(change);
    }

    return node
  }

  
  set(path, newValue) {
    let node = this.get(path[0]);
    let oldValue = this._set(path, newValue);
    var change = {
      type: 'set',
      node: node,
      path: path,
      newValue: newValue,
      oldValue: oldValue
    };
    if (this.__QUEUE_INDEXING__) {
      this.queue.push(change);
    } else {
      this._updateIndexes(change);
    }
    return oldValue
  }

  _set(path, newValue) {
    let oldValue = _setValue(this.nodes, path, newValue);
    return oldValue
  }

  
  update(path, diff$$1) {
    var realPath = this.getRealPath(path);
    if (!realPath) {
      console.error('Could not resolve path', path);
      return
    }
    let node = this.get(realPath[0]);
    let oldValue = this._get(realPath);
    let newValue;
    if (diff$$1.isOperation) {
      newValue = diff$$1.apply(oldValue);
    } else {
      diff$$1 = this._normalizeDiff(oldValue, diff$$1);
      if (isString$1(oldValue)) {
        switch (diff$$1.type) {
          case 'delete': {
            newValue = oldValue.split('').splice(diff$$1.start, diff$$1.end-diff$$1.start).join('');
            break
          }
          case 'insert': {
            newValue = [oldValue.substring(0, diff$$1.start), diff$$1.text, oldValue.substring(diff$$1.start)].join('');
            break
          }
          default:
            throw new Error('Unknown diff type')
        }
      } else if (isArray$1(oldValue)) {
        newValue = oldValue.slice(0);
        switch (diff$$1.type) {
          case 'delete': {
            newValue.splice(diff$$1.pos, 1);
            break
          }
          case 'insert': {
            newValue.splice(diff$$1.pos, 0, diff$$1.value);
            break
          }
          default:
            throw new Error('Unknown diff type')
        }
      } else if (oldValue._isCoordinate) {
        switch (diff$$1.type) {
          case 'shift': {
            
            oldValue = { path: oldValue.path, offset: oldValue.offset };
            newValue = oldValue;
            newValue.offset += diff$$1.value;
            break
          }
          default:
            throw new Error('Unknown diff type')
        }
      } else {
        throw new Error('Diff is not supported:', JSON.stringify(diff$$1))
      }
    }
    this._set(realPath, newValue);

    var change = {
      type: 'update',
      node: node,
      path: realPath,
      newValue: newValue,
      oldValue: oldValue
    };

    if (this.__QUEUE_INDEXING__) {
      this.queue.push(change);
    } else {
      this._updateIndexes(change);
    }

    return oldValue
  }

  
  _normalizeDiff(value, diff$$1) {
    if (isString$1(value)) {
      
      if (diff$$1['delete']) {
        console.warn('DEPRECATED: use doc.update(path, {type:"delete", start:s, end: e}) instead');
        diff$$1 = {
          type: 'delete',
          start: diff$$1['delete'].start,
          end: diff$$1['delete'].end
        };
      } else if (diff$$1['insert']) {
        console.warn('DEPRECATED: use doc.update(path, {type:"insert", start:s, text: t}) instead');
        diff$$1 = {
          type: 'insert',
          start: diff$$1['insert'].offset,
          text: diff$$1['insert'].value
        };
      }
    } else if (isArray$1(value)) {
      
      if (diff$$1['delete']) {
        console.warn('DEPRECATED: use doc.update(path, {type:"delete", pos:1}) instead');
        diff$$1 = {
          type: 'delete',
          pos: diff$$1['delete'].offset
        };
      } else if (diff$$1['insert']) {
        console.warn('DEPRECATED: use doc.update(path, {type:"insert", pos:1, value: "foo"}) instead');
        diff$$1 = {
          type: 'insert',
          pos: diff$$1['insert'].offset,
          value: diff$$1['insert'].value
        };
      }
    } else if (value._isCoordinate) {
      if (diff$$1.hasOwnProperty('shift')) {
        console.warn('DEPRECATED: use doc.update(path, {type:"shift", value:2}) instead');
        diff$$1 = {
          type: 'shift',
          value: diff$$1['shift']
        };
      }
    }
    return diff$$1
  }

  
  toJSON() {
    let nodes = {};
    forEach(this.nodes, (node)=>{
      nodes[node.id] = node.toJSON();
    });
    return {
      schema: [this.schema.id, this.schema.version],
      nodes: nodes
    }
  }

  reset() {
    this.clear();
  }

  
  clear() {
    this.nodes = {};
    forEach(this.indexes, index => index.clear());
  }

  
  addIndex(name, index) {
    if (this.indexes[name]) {
      console.error('Index with name %s already exists.', name);
    }
    index.reset(this);
    this.indexes[name] = index;
    return index
  }

  
  getIndex(name) {
    return this.indexes[name]
  }

  
  _updateIndexes(change) {
    if (!change || this.__QUEUE_INDEXING__) return
    forEach(this.indexes, function(index) {
      if (index.select(change.node)) {
        if (!index[change.type]) {
          console.error('Contract: every NodeIndex must implement ' + change.type);
        }
        index[change.type](change.node, change.path, change.newValue, change.oldValue);
      }
    });
  }

  
  _stopIndexing() {
    this.__QUEUE_INDEXING__ = true;
  }

  
  _startIndexing() {
    this.__QUEUE_INDEXING__ = false;
    while(this.queue.length >0) {
      var change = this.queue.shift();
      this._updateIndexes(change);
    }
  }

}

function _setValue(root, path, newValue) {
  let ctx = root;
  let L = path.length;
  for (let i = 0; i < L-1; i++) {
    ctx = ctx[path[i]];
    if (!ctx) throw new Error('Can not set value.')
  }
  let oldValue = ctx[path[L-1]];
  ctx[path[L-1]] = newValue;
  return oldValue
}

class IncrementalData extends Data {

  
  create(nodeData) {
    if (nodeData._isNode) {
      nodeData = nodeData.toJSON();
    }
    let op = ObjectOperation.Create([nodeData.id], nodeData);
    this.apply(op);
    return op
  }

  
  delete(nodeId) {
    var op = null;
    var node = this.get(nodeId);
    if (node) {
      var nodeData = node.toJSON();
      op = ObjectOperation.Delete([nodeId], nodeData);
      this.apply(op);
    }
    return op
  }

  
  update(path, diff$$1) {
    var diffOp = this._getDiffOp(path, diff$$1);
    var op = ObjectOperation.Update(path, diffOp);
    this.apply(op);
    return op
  }

  
  set(path, newValue) {
    var oldValue = this.get(path);
    var op = ObjectOperation.Set(path, oldValue, newValue);
    this.apply(op);
    return op
  }

  
  apply(op) {
    if (op.type === ObjectOperation.NOP) return
    else if (op.type === ObjectOperation.CREATE) {
      
      super.create(cloneDeep(op.val));
    } else if (op.type === ObjectOperation.DELETE) {
      super.delete(op.val.id);
    } else if (op.type === ObjectOperation.UPDATE) {
      var oldVal = this.get(op.path);
      var diff$$1 = op.diff;
      if (op.propertyType === 'array') {
        if (! (diff$$1._isArrayOperation) ) {
          diff$$1 = ArrayOperation.fromJSON(diff$$1);
        }
        
        diff$$1.apply(oldVal);
      } else if (op.propertyType === 'string') {
        if (!(diff$$1._isTextOperation) ) {
          diff$$1 = TextOperation.fromJSON(diff$$1);
        }
        var newVal = diff$$1.apply(oldVal);
        super.set(op.path, newVal);
      } else if (op.propertyType === 'coordinate') {
        if (!(diff$$1._isCoordinateOperation) ) {
          diff$$1 = CoordinateOperation.fromJSON(diff$$1);
        }
        diff$$1.apply(oldVal);
      } else {
        throw new Error("Unsupported type for operational update.")
      }
    } else if (op.type === ObjectOperation.SET) {
      super.set(op.path, op.val);
    } else {
      throw new Error("Illegal state.")
    }
    this.emit('operation:applied', op, this);
  }

  
  _getDiffOp(path, diff$$1) {
    var diffOp = null;
    if (diff$$1.isOperation) {
      diffOp = diff$$1;
    } else {
      var value = this.get(path);
      diff$$1 = this._normalizeDiff(value, diff$$1);
      if (value === null || value === undefined) {
        throw new Error('Property has not been initialized: ' + JSON.stringify(path))
      } else if (isString$1(value)) {
        switch (diff$$1.type) {
          case 'delete': {
            diffOp = TextOperation.Delete(diff$$1.start, value.substring(diff$$1.start, diff$$1.end));
            break
          }
          case 'insert': {
            diffOp = TextOperation.Insert(diff$$1.start, diff$$1.text);
            break
          }
          default:
            throw new Error('Unknown diff type')
        }
      } else if (isArray$1(value)) {
        switch (diff$$1.type) {
          case 'delete': {
            diffOp = ArrayOperation.Delete(diff$$1.pos, value[diff$$1.pos]);
            break
          }
          case 'insert': {
            diffOp = ArrayOperation.Insert(diff$$1.pos, diff$$1.value);
            break
          }
          default:
            throw new Error('Unknown diff type')
        }
      } else if (value._isCoordinate) {
        switch (diff$$1.type) {
          case 'shift': {
            diffOp = CoordinateOperation.Shift(diff$$1.value);
            break
          }
          default:
            throw new Error('Unknown diff type')
        }
      }
    }
    if (!diffOp) {
      throw new Error('Unsupported diff: ' + JSON.stringify(diff$$1))
    }
    return diffOp
  }

}

class DocumentNodeFactory {

  constructor(doc) {
    this.doc = doc;
  }

  create(nodeType, nodeData) {
    var NodeClass = this.doc.schema.getNodeClass(nodeType);
    if (!NodeClass) {
      throw new Error('No node registered by that name: ' + nodeType)
    }
    return new NodeClass(this.doc, nodeData)
  }

}

class JSONConverter {

  importDocument(doc, json) {
    if (!json.nodes) {
      throw new Error('Invalid JSON format.')
    }
    var schema = doc.getSchema();
    if (json.schema && schema.name !== json.schema.name) {
      throw new Error('Incompatible schema.')
    }
    
    var nodes = json.nodes;
    
    
    
    doc.import(function(tx) {
      forEach(nodes, function(node) {
        
        if (tx.get(node.id)) {
          tx.delete(node.id);
        }
        tx.create(node);
      });
    });
    return doc
  }

  exportDocument(doc) {
    var schema = doc.getSchema();
    var json = {
      schema: {
        name: schema.name
      },
      nodes: {}
    };
    forEach(doc.getNodes(), function(node) {
      if (node._isDocumentNode) {
        json.nodes[node.id] = node.toJSON();
      }
    });
    return json
  }
}

class ParentNodeHook {

  constructor(doc) {
    this.doc = doc;
    this.table = {};
    doc.data.on('operation:applied', this._onOperationApplied, this);
  }

  _onOperationApplied(op) {
    const doc = this.doc;
    const table = this.table;
    let node = doc.get(op.path[0]);
    
    
    switch(op.type) {
      case 'create': {
        switch (node.type) {
          case 'list':
            _setParent(node, node.items);
            break
          case 'list-item': {
            _setRegisteredParent(node);
            break
          }
          case 'table':
            _setParent(node, node.cells);
            break
          case 'table-cell': {
            _setRegisteredParent(node);
            break
          }
          default:
            
        }
        break
      }
      case 'update': {
        
        
        let update = op.diff;
        switch(node.type) {
          case 'list':
            if (op.path[1] === 'items') {
              if (update.isInsert()) {
                _setParent(node, update.getValue());
              }
            }
            break
          case 'table':
            if (op.path[1] === 'cells') {
              if (update.isInsert()) {
                _setParent(node, update.getValue());
              }
            }
            break
          default:
            
        }
        break
      }
      case 'set': {
        switch(node.type) {
          case 'list':
            if (op.path[1] === 'items') {
              _setParent(node, op.getValue());
            }
            break
          case 'table':
            if (op.path[1] === 'cells') {
              _setParent(node, op.getValue());
            }
            break
          default:
            
        }
        break
      }
      default:
        
    }

    function _setParent(parent, ids) {
      if (ids) {
        if (isArray$1(ids)) {
          ids.forEach(_set);
        } else {
          _set(ids);
        }
      }
      function _set(id) {
        
        
        
        table[id] = parent;
        let child = doc.get(id);
        if (child) {
          child.parent = parent;
        }
      }
    }
    function _setRegisteredParent(child) {
      let parent = table[child.id];
      if (parent) {
        child.parent = parent;
      }
    }
  }
}

ParentNodeHook.register = function(doc) {
  return new ParentNodeHook(doc)
};

const converter = new JSONConverter();



class Document extends EventEmitter {

  
  constructor(schema, ...args) {
    super();

    this.schema = schema;
    
    if (!schema) {
      throw new Error('A document needs a schema for reflection.')
    }

    
    this._ops = [];

    this._initialize(...args);
  }

  _initialize() {
    this.__id__ = uuid();
    this.nodeFactory = new DocumentNodeFactory(this);
    this.data = new IncrementalData(this.schema, this.nodeFactory);
    
    this.addIndex('type', new PropertyIndex('type'));
    
    this.addIndex('annotations', new AnnotationIndex());
    
    
    
    this.addIndex('container-annotations', new ContainerAnnotationIndex());
    
    
    ParentNodeHook.register(this);
  }

  dispose() {
    this.off();
    this.data.off();
  }

  get id() {
    return this.__id__
  }

  
  getSchema() {
    return this.schema
  }

  
  contains(id) {
    return this.data.contains(id)
  }

  
  get(path, strict) {
    return this.data.get(path, strict)
  }

  
  getNodes() {
    return this.data.getNodes()
  }

  getAnnotations(path) {
    return this.getIndex('annotations').get(path)
  }

  
  import(importer) {
    try {
      this.data._stopIndexing();
      importer(this);
      this.data._startIndexing();
    } finally {
      this.data.queue = [];
      this.data._startIndexing();
    }
  }

  
  create(nodeData) {
    if (!nodeData.id) {
      nodeData.id = uuid(nodeData.type);
    }
    if (!nodeData.type) {
      throw new Error('No node type provided')
    }
    const op = this._create(nodeData);
    if (op) {
      this._ops.push(op);
      if (!this._isTransactionDocument) {
        this._emitChange(op);
      }
      return this.get(nodeData.id)
    }
  }

  createDefaultTextNode(text, dir) {
    return this.create({
      type: this.getSchema().getDefaultTextType(),
      content: text || '',
      direction: dir
    })
  }

  
  delete(nodeId) {
    const node = this.get(nodeId);
    const op = this._delete(nodeId);
    if (op) {
      this._ops.push(op);
      if (!this._isTransactionDocument) {
        this._emitChange(op);
      }
    }
    return node
  }

  
  set(path, value) {
    const oldValue = this.get(path);
    const op = this._set(path, value);
    if (op) {
      this._ops.push(op);
      if (!this._isTransactionDocument) {
        this._emitChange(op);
      }
    }
    return oldValue
  }

  
  update(path, diff$$1) {
    const op = this._update(path, diff$$1);
    if (op) {
      this._ops.push(op);
      if (!this._isTransactionDocument) {
        this._emitChange(op);
      }
    }
    return op
  }

  
  addIndex(name, index) {
    return this.data.addIndex(name, index)
  }

  
  getIndex(name) {
    return this.data.getIndex(name)
  }

  
  createSelection(data) {
    let sel;
    if (isNil(data)) return Selection.nullSelection
    if (arguments.length !== 1 || !isPlainObject$1(data)) {
      throw new Error('Illegal argument: call createSelection({ type: ... }')
    } else {
      switch (data.type) {
        case 'property': {
          if (isNil(data.endOffset)) {
            data.endOffset = data.startOffset;
          }
          if (!data.hasOwnProperty('reverse')) {
            if (data.startOffset>data.endOffset) {
              [data.startOffset, data.endOffset] = [data.endOffset, data.startOffset];
              data.reverse = !data.reverse;
            }
          }
          
          let text = this.get(data.path, 'strict');
          if (data.startOffset < 0 || data.startOffset > text.length) {
            throw new Error('Invalid startOffset: target property has length '+text.length+', given startOffset is ' + data.startOffset)
          }
          if (data.endOffset < 0 || data.endOffset > text.length) {
            throw new Error('Invalid startOffset: target property has length '+text.length+', given endOffset is ' + data.endOffset)
          }
          sel = new PropertySelection(data);
          break
        }
        case 'container': {
          let container = this.get(data.containerId, 'strict');
          if (!container) throw new Error('Can not create ContainerSelection: container "'+data.containerId+'" does not exist.')
          let start = this._normalizeCoor({ path: data.startPath, offset: data.startOffset});
          let end = this._normalizeCoor({ path: data.endPath, offset: data.endOffset});
          let startAddress = container.getAddress(start);
          let endAddress = container.getAddress(end);
          if (!startAddress) {
            throw new Error('Invalid arguments for ContainerSelection: ', start.toString())
          }
          if (!endAddress) {
            throw new Error('Invalid arguments for ContainerSelection: ', end.toString())
          }
          if (!data.hasOwnProperty('reverse')) {
            if (endAddress.isBefore(startAddress, 'strict')) {
              [start, end] = [end, start];
              data.reverse = true;
            }
          }
          sel = new ContainerSelection(container.id, start.path, start.offset, end.path, end.offset, data.reverse, data.surfaceId);
          break
        }
        case 'node': {
          sel = createNodeSelection({
            doc: this,
            nodeId: data.nodeId,
            mode: data.mode,
            containerId: data.containerId,
            reverse: data.reverse,
            surfaceId: data.surfaceId
          });
          break
        }
        case 'custom': {
          sel = CustomSelection.fromJSON(data);
          break
        }
        default:
          throw new Error('Illegal selection type', data)
      }
    }
    if (!sel.isNull()) {
      sel.attach(this);
    }
    return sel
  }

  newInstance() {
    var DocumentClass = this.constructor;
    return new DocumentClass(this.schema)
  }

  
  createSnippet() {
    var snippet = this.newInstance();
    var snippetContainer = snippet.create({
      type: 'container',
      id: Document.SNIPPET_ID
    });
    snippet.getContainer = function() {
      return snippetContainer
    };
    return snippet
  }

  createFromDocument(doc) {
    
    this.clear();

    let nodes = doc.getNodes();
    let annotations = [];
    let contentNodes = [];
    let containers = [];
    forEach(nodes, (node) => {
      if (node.isAnnotation()) {
        annotations.push(node);
      } else if (node.isContainer()) {
        containers.push(node);
      } else {
        contentNodes.push(node);
      }
    });
    contentNodes.concat(annotations).concat(containers).forEach(n=>{
      this.create(n);
    });

    return this
  }

  
  toJSON() {
    return converter.exportDocument(this)
  }

  clone() {
    let copy = this.newInstance();
    copy.createFromDocument(this);
    return copy
  }

  clear() {
    this.data.clear();
    this._ops.length = 0;
  }

  
  createEditingInterface() {
    return new EditingInterface(this)
  }

  _apply(documentChange) {
    forEach(documentChange.ops, (op) => {
      this._applyOp(op);
    });
    
    documentChange._extractInformation(this);
  }

  _applyOp(op) {
    this.data.apply(op);
    this.emit('operation:applied', op);
  }

  _create(nodeData) {
    return this.data.create(nodeData)
  }

  _delete(nodeId) {
    return this.data.delete(nodeId)
  }

  _set(path, value) {
    return this.data.set(path, value)
  }

  _update(path, diff$$1) {
    return this.data.update(path, diff$$1)
  }

  _emitChange(op) {
    const change = new DocumentChange([op], {}, {});
    change._extractInformation(this);
    this._notifyChangeListeners(change, { hidden: true });
  }

  _notifyChangeListeners(change, info) {
    info = info || {};
    this.emit('document:changed', change, info, this);
  }

  
  _createSelectionFromRange(range) {
    if (!range) return Selection.nullSelection
    let inOneNode = isEqual(range.start.path, range.end.path);
    if (inOneNode) {
      if (range.start.isNodeCoordinate()) {
        
        
        return new NodeSelection(range.containerId, range.start.getNodeId(), 'full', range.reverse, range.surfaceId)
      } else {
        return this.createSelection({
          type: 'property',
          path: range.start.path,
          startOffset: range.start.offset,
          endOffset: range.end.offset,
          reverse: range.reverse,
          containerId: range.containerId,
          surfaceId: range.surfaceId
        })
      }
    } else {
      return this.createSelection({
        type: 'container',
        startPath: range.start.path,
        startOffset: range.start.offset,
        endPath: range.end.path,
        endOffset: range.end.offset,
        reverse: range.reverse,
        containerId: range.containerId,
        surfaceId: range.surfaceId
      })
    }
  }

  _normalizeCoor({ path, offset }) {
    
    if (path.length === 1) {
      let node = this.get(path[0]).getContainerRoot();
      if (node.isText()) {
        
        return new Coordinate(node.getTextPath(), offset === 0 ? 0 : node.getLength())
      } else if (node.isList()) {
        
        if (offset === 0) {
          let item = node.getItemAt(0);
          return new Coordinate(item.getTextPath(), 0)
        } else {
          let item = this.get(last$1(node.items));
          return new Coordinate(item.getTextPath(), item.getLength())
        }
      }
    }
    return new Coordinate(path, offset)
  }

}

Document.prototype._isDocument = true;



Document.SNIPPET_ID = "snippet";

Document.TEXT_SNIPPET_ID = "text-snippet";

function copySelection(doc, selection) {
  if (!selection) throw new Error("'selection' is mandatory.")
  let copy = null;
  if (!selection.isNull() && !selection.isCollapsed()) {
    
    if (selection.isPropertySelection()) {
      copy = _copyPropertySelection(doc, selection);
    }
    else if (selection.isContainerSelection()) {
      copy = _copyContainerSelection(doc, selection);
    }
    else if (selection.isNodeSelection()) {
      copy = _copyNodeSelection(doc, selection);
    }
    else {
      console.error('Copy is not yet supported for selection type.');
    }
  }
  return copy
}

function _copyPropertySelection(doc, selection) {
  let path = selection.start.path;
  let offset = selection.start.offset;
  let endOffset = selection.end.offset;
  let text = doc.get(path);
  let snippet = doc.createSnippet();
  let containerNode = snippet.getContainer();
  snippet.create({
    type: doc.schema.getDefaultTextType(),
    id: Document.TEXT_SNIPPET_ID,
    content: text.substring(offset, endOffset)
  });
  containerNode.show(Document.TEXT_SNIPPET_ID);
  let annotations = doc.getIndex('annotations').get(path, offset, endOffset);
  forEach(annotations, function(anno) {
    let data = cloneDeep(anno.toJSON());
    let path = [Document.TEXT_SNIPPET_ID, 'content'];
    data.start = {
      path: path,
      offset: Math.max(offset, anno.start.offset)-offset
    };
    data.end = {
      path: path,
      offset: Math.min(endOffset, anno.end.offset)-offset
    };
    snippet.create(data);
  });
  return snippet
}

function _copyContainerSelection(tx, sel) {
  let snippet = tx.createSnippet();
  let container = snippet.getContainer();

  let nodeIds = sel.getNodeIds();
  let L = nodeIds.length;
  if (L === 0) return snippet

  let start = sel.start;
  let end = sel.end;

  let skippedFirst = false;
  let skippedLast = false;

  
  let created = {};
  for(let i = 0; i<L; i++) {
    let id = nodeIds[i];
    let node = tx.get(id);
    
    if (i===0 && isLast(tx, start)) {
      skippedFirst = true;
      continue
    }
    if (i===L-1 && isFirst(tx, end)) {
      skippedLast = true;
      continue
    }
    if (!created[id]) {
      documentHelpers.copyNode(node).forEach((nodeData) => {
        let copy = snippet.create(nodeData);
        created[copy.id] = true;
      });
      container.show(id);
    }
  }
  if (!skippedFirst) {
    
    let startNode = snippet.get(start.getNodeId()).getContainerRoot();
    if (startNode.isText()) {
      documentHelpers.deleteTextRange(snippet, null, start);
    } else if (startNode.isList()) {
      documentHelpers.deleteListRange(snippet, startNode, null, start);
    }
  }
  if (!skippedLast) {
    
    let endNode = snippet.get(end.getNodeId()).getContainerRoot();
    if (endNode.isText()) {
      documentHelpers.deleteTextRange(snippet, end, null);
    } else if (endNode.isList()) {
      documentHelpers.deleteListRange(snippet, endNode, end, null);
    }
  }
  return snippet
}

function _copyNodeSelection(doc, selection) {
  let snippet = doc.createSnippet();
  let containerNode = snippet.getContainer();
  let nodeId = selection.getNodeId();
  let node = doc.get(nodeId);
  documentHelpers.copyNode(node).forEach((nodeData) => {
    snippet.create(nodeData);
  });
  containerNode.show(node.id);
  return snippet
}

function paste(tx, args) {
  let sel = tx.selection;
  if (!sel || sel.isNull() || sel.isCustomSelection()) {
    throw new Error("Can not paste, without selection or a custom selection.")
  }
  args = args || {};
  args.text = args.text || '';
  let pasteDoc = args.doc;
  
  
  let inContainer = Boolean(sel.containerId);

  
  
  
  if (!pasteDoc && !inContainer) {
    tx.insertText(args.text);
    return
  }
  if (!pasteDoc) {
    pasteDoc = _convertPlainTextToDocument(tx, args);
  }
  if (!sel.isCollapsed()) {
    tx.deleteSelection();
  }
  let snippet = pasteDoc.get(Document.SNIPPET_ID);
  if (snippet.getLength() > 0) {
    let first = snippet.getChildAt(0);
    if (first.isText()) {
      _pasteAnnotatedText(tx, pasteDoc);
      
      
      
      snippet.hideAt(0);
    }
    
    if (snippet.getLength() > 0) {
      _pasteDocument(tx, pasteDoc);
    }
  }
  return args
}


function _convertPlainTextToDocument(tx, args) {
  let lines = args.text.split(/\s*\n\s*\n/);
  let pasteDoc = tx.getDocument().newInstance();
  let defaultTextType = pasteDoc.getSchema().getDefaultTextType();
  let container = pasteDoc.create({
    type: 'container',
    id: Document.SNIPPET_ID,
    nodes: []
  });
  let node;
  if (lines.length === 1) {
    node = pasteDoc.create({
      id: Document.TEXT_SNIPPET_ID,
      type: defaultTextType,
      content: lines[0]
    });
    container.show(node.id);
  } else {
    for (let i = 0; i < lines.length; i++) {
      node = pasteDoc.create({
        id: uuid(defaultTextType),
        type: defaultTextType,
        content: lines[i]
      });
      container.show(node.id);
    }
  }
  return pasteDoc
}

function _pasteAnnotatedText(tx, copy) {
  let sel = tx.selection;
  let nodes = copy.get(Document.SNIPPET_ID).nodes;
  let textPath = [nodes[0], 'content'];
  let text = copy.get(textPath);
  let annotations = copy.getIndex('annotations').get(textPath);
  
  let path = sel.start.path;
  let offset = sel.start.offset;
  tx.insertText(text);
  
  forEach(annotations, function(anno) {
    let data = anno.toJSON();
    data.start.path = path.slice(0);
    data.start.offset += offset;
    data.end.offset += offset;
    
    if (tx.get(data.id)) data.id = uuid(data.type);
    tx.create(data);
  });
}

function _pasteDocument(tx, pasteDoc) {
  let sel = tx.selection;
  let containerId = sel.containerId;
  let container = tx.get(containerId);
  let insertPos;
  if (sel.isPropertySelection()) {
    let startPath = sel.start.path;
    let nodeId = sel.start.getNodeId();
    let startPos = container.getPosition(nodeId, 'strict');
    let text = tx.get(startPath);
    
    
    if (text.length === 0) {
      insertPos = startPos;
      container.hide(nodeId);
      documentHelpers.deleteNode(tx, tx.get(nodeId));
    } else if ( text.length === sel.start.offset ) {
      insertPos = startPos + 1;
    } else {
      tx.break();
      insertPos = startPos + 1;
    }
  } else if (sel.isNodeSelection()) {
    let nodePos = container.getPosition(sel.getNodeId(), 'strict');
    if (sel.isBefore()) {
      insertPos = nodePos;
    } else if (sel.isAfter()) {
      insertPos = nodePos+1;
    } else {
      throw new Error('Illegal state: the selection should be collapsed.')
    }
  }
  
  let nodeIds = pasteDoc.get(Document.SNIPPET_ID).nodes;
  let insertedNodes = [];
  let visited = {};
  for (let i = 0; i < nodeIds.length; i++) {
    let node = pasteDoc.get(nodeIds[i]);
    
    
    
    
    
    let newId = _transferWithDisambiguatedIds(node.getDocument(), tx, node.id, visited);
    
    node = tx.get(newId);
    container.showAt(insertPos++, newId);
    insertedNodes.push(node);
  }

  if (insertedNodes.length > 0) {
    let lastNode = last$1(insertedNodes);
    setCursor(tx, lastNode, containerId, 'after');
  }
}






function _transferWithDisambiguatedIds(sourceDoc, targetDoc, id, visited) {
  if (visited[id]) throw new Error('FIXME: dont call me twice')
  const node = sourceDoc.get(id, 'strict');
  let oldId = node.id;
  let newId;
  if (targetDoc.contains(node.id)) {
    
    newId = uuid(node.type);
    node.id = newId;
  }
  visited[id] = node.id;
  const annotationIndex = sourceDoc.getIndex('annotations');
  const nodeSchema = node.getSchema();
  
  let annos = [];
  
  
  
  for (let key in nodeSchema) {
    if (key === 'id' || key === 'type' || !nodeSchema.hasOwnProperty(key)) continue
    const prop = nodeSchema[key];
    const name = prop.name;
    
    if ((prop.isReference() && prop.isOwned()) || (prop.type === 'file')) {
      
      
      let val = node[prop.name];
      if (prop.isArray()) {
        _transferArrayOfReferences(sourceDoc, targetDoc, val, visited);
      } else {
        let id = val;
        if (!visited[id]) {
          node[name] = _transferWithDisambiguatedIds(sourceDoc, targetDoc, id, visited);
        }
      }
    }
    
    else if (prop.isText()) {
      
      
      
      
      
      let _annos = annotationIndex.get([oldId, prop.name]);
      for (let i = 0; i < _annos.length; i++) {
        let anno = _annos[i];
        if (anno.start.path[0] === oldId && newId) {
          anno.start.path[0] = newId;
        }
        if (anno.end.path[0] === oldId && newId) {
          anno.end.path[0] = newId;
        }
        annos.push(anno);
      }
    }
  }
  targetDoc.create(node);
  for (let i = 0; i < annos.length; i++) {
    _transferWithDisambiguatedIds(sourceDoc, targetDoc, annos[i].id, visited);
  }
  return node.id
}

function _transferArrayOfReferences(sourceDoc, targetDoc, arr, visited) {
  for (let i = 0; i < arr.length; i++) {
    let val = arr[i];
    
    if (isArray$1(val)) {
      _transferArrayOfReferences(sourceDoc, targetDoc, val, visited);
    } else {
      let id = val;
      if (id && !visited[id]) {
        arr[i] = _transferWithDisambiguatedIds(sourceDoc, targetDoc, id, visited);
      }
    }
  }
}

class Editing {

  
  annotate(tx, annotation) {
    let sel = tx.selection;
    let schema = tx.getSchema();
    let AnnotationClass = schema.getNodeClass(annotation.type);
    if (!AnnotationClass) throw new Error('Unknown annotation type', annotation)
    let start = sel.start;
    let end = sel.end;
    let containerId = sel.containerId;
    let nodeData = { start, end, containerId };
    
    
    if (sel.isPropertySelection()) {
      if (!AnnotationClass.prototype._isAnnotation) {
        throw new Error('Annotation can not be created for a selection.')
      }
    } else if (sel.isContainerSelection()) {
      if (AnnotationClass.prototype._isPropertyAnnotation) {
        console.warn('NOT SUPPORTED YET: creating property annotations for a non collapsed container selection.');
      }
    }
    Object.assign(nodeData, annotation);
    return tx.create(nodeData)
  }

  break(tx) {
    let sel = tx.selection;
    if (sel.isNodeSelection()) {
      let containerId = sel.containerId;
      let container = tx.get(containerId);
      let nodeId = sel.getNodeId();
      let nodePos = container.getPosition(nodeId, 'strict');
      let textNode = tx.createDefaultTextNode();
      if (sel.isBefore()) {
        container.showAt(nodePos, textNode.id);
        
      } else {
        container.showAt(nodePos+1, textNode.id);
        setCursor(tx, textNode, containerId, 'before');
      }
    }
    else if (sel.isCustomSelection()) {
      
    }
    else if (sel.isCollapsed() || sel.isPropertySelection()) {
      let containerId = sel.containerId;
      if (!sel.isCollapsed()) {
        
        this._deletePropertySelection(tx, sel);
        tx.setSelection(sel.collapse('left'));
      }
      
      if (containerId) {
        let container = tx.get(containerId);
        let nodeId = sel.start.path[0];
        let node = tx.get(nodeId);
        this._breakNode(tx, node, sel.start, container);
      }
    }
    else if (sel.isContainerSelection()) {
      let start = sel.start;
      let containerId = sel.containerId;
      let container = tx.get(containerId);
      let startNodeId = start.path[0];
      let nodePos = container.getPosition(startNodeId, 'strict');
      this._deleteContainerSelection(tx, sel, {noMerge: true });
      setCursor(tx, container.getNodeAt(nodePos+1), containerId, 'before');
    }
  }

  delete(tx, direction) {
    let sel = tx.selection;
    
    
    
    
    if (sel.isNodeSelection()) {
      this._deleteNodeSelection(tx, sel, direction);
    }
    
    else if (sel.isCustomSelection()) {}
    
    
    else if (sel.isCollapsed()) {
      
      
      
      let path = sel.start.path;
      let node = tx.get(path[0]);
      let text = tx.get(path);
      let offset = sel.start.offset;
      let needsMerge = (sel.containerId && (
        (offset === 0 && direction === 'left') ||
        (offset === text.length && direction === 'right')
      ));
      if (needsMerge) {
        
        
        
        let root = node.getContainerRoot();
        if (root.isList() && offset === 0 && direction === 'left') {
          return this.toggleList(tx)
        } else {
          let container = tx.get(sel.containerId);
          this._merge(tx, root, sel.start, direction, container);
        }
      } else {
        
        if ((offset === 0 && direction === 'left') ||
          (offset === text.length && direction === 'right')) {
          return
        }
        let startOffset = (direction === 'left') ? offset-1 : offset;
        let endOffset = startOffset+1;
        let start = { path: path, offset: startOffset };
        let end = { path: path, offset: endOffset };
        documentHelpers.deleteTextRange(tx, start, end);
        tx.setSelection({
          type: 'property',
          path: path,
          startOffset: startOffset,
          containerId: sel.containerId
        });
      }
    }
    
    else if (sel.isPropertySelection()) {
      documentHelpers.deleteTextRange(tx, sel.start, sel.end);
      tx.setSelection(sel.collapse('left'));
    }
    
    else if (sel.isContainerSelection()) {
      this._deleteContainerSelection(tx, sel);
    }
    else {
      console.warn('Unsupported case: tx.delete(%)', direction, sel);
    }
  }

  _deleteNodeSelection(tx, sel, direction) {
    let nodeId = sel.getNodeId();
    let container = tx.get(sel.containerId);
    let nodePos = container.getPosition(nodeId, 'strict');
    if (sel.isFull() ||
        sel.isBefore() && direction === 'right' ||
        sel.isAfter() && direction === 'left' ) {
      
      container.hideAt(nodePos);
      documentHelpers.deleteNode(tx, tx.get(nodeId));
      let newNode = tx.createDefaultTextNode();
      container.showAt(nodePos, newNode.id);
      tx.setSelection({
        type: 'property',
        path: newNode.getTextPath(),
        startOffset: 0,
        containerId: container.id,
      });
    } else {
      
      if (sel.isBefore() && direction === 'left') {
        if (nodePos > 0) {
          let previous = container.getNodeAt(nodePos-1);
          if (previous.isText()) {
            tx.setSelection({
              type: 'property',
              path: previous.getTextPath(),
              startOffset: previous.getLength()
            });
            this.delete(tx, direction);
          } else {
            tx.setSelection({
              type: 'node',
              nodeId: previous.id,
              containerId: container.id
            });
          }
        } else {
          
        }
      } else if (sel.isAfter() && direction === 'right') {
        if (nodePos < container.getLength()-1) {
          let next = container.getNodeAt(nodePos+1);
          if (next.isText()) {
            tx.setSelection({
              type: 'property',
              path: next.getTextPath(),
              startOffset: 0
            });
            this.delete(tx, direction);
          } else {
            tx.setSelection({
              type: 'node',
              nodeId: next.id,
              containerId: container.id
            });
          }
        } else {
          
        }
      } else {
        console.warn('Unsupported case: delete(%s)', direction, sel);
      }
    }
  }

  _deletePropertySelection(tx, sel) {
    let path = sel.start.path;
    let start = sel.start.offset;
    let end = sel.end.offset;
    tx.update(path, { type: 'delete', start: start, end: end });
    annotationHelpers.deletedText(tx, path, start, end);
  }

  
  _deleteContainerSelection(tx, sel, options = {}) {
    let containerId = sel.containerId;
    let container = tx.get(containerId);
    let start = sel.start;
    let end = sel.end;
    let startId = start.getNodeId();
    let endId = end.getNodeId();
    let startPos = container.getPosition(startId, 'strict');
    let endPos = container.getPosition(endId, 'strict');

    
    if (startPos === endPos) {
      
      let node = tx.get(startId).getContainerRoot();
      
      if (node.isText()) {
        documentHelpers.deleteTextRange(tx, start, end);
      } else if (node.isList()) {
        documentHelpers.deleteListRange(tx, node, start, end);
      } else {
        throw new Error('Not supported yet.')
      }
      tx.setSelection(sel.collapse('left'));
      return
    }

    

    let firstNode = tx.get(start.getNodeId());
    let lastNode = tx.get(end.getNodeId());
    let firstEntirelySelected = isEntirelySelected(tx, firstNode, start, null);
    let lastEntirelySelected = isEntirelySelected(tx, lastNode, null, end);

    
    if (lastEntirelySelected) {
      container.hideAt(endPos);
      documentHelpers.deleteNode(tx, lastNode);
    } else {
      
      let node = lastNode.getContainerRoot();
      
      if (node.isText()) {
        documentHelpers.deleteTextRange(tx, null, end);
      } else if (node.isList()) {
        documentHelpers.deleteListRange(tx, node, null, end);
      } else {
        
      }
    }

    
    for (let i = endPos-1; i > startPos; i--) {
      let nodeId = container.getNodeIdAt(i);
      container.hideAt(i);
      documentHelpers.deleteNode(tx, tx.get(nodeId));
    }

    
    if (firstEntirelySelected) {
      container.hideAt(startPos);
      documentHelpers.deleteNode(tx, firstNode);
    } else {
      
      let node = firstNode.getContainerRoot();
      
      if (node.isText()) {
        documentHelpers.deleteTextRange(tx, start, null);
      } else if (node.isList()) {
        documentHelpers.deleteListRange(tx, node, start, null);
      } else {
        
      }
    }

    
    if (firstEntirelySelected && lastEntirelySelected) {
      
      let textNode = tx.createDefaultTextNode();
      container.showAt(startPos, textNode.id);
      tx.setSelection({
        type: 'property',
        path: textNode.getTextPath(),
        startOffset: 0,
        containerId: containerId
      });
    } else if (!firstEntirelySelected && !lastEntirelySelected) {
      if (!options.noMerge) {
        this._merge(tx, firstNode, sel.start, 'right', container);
      }
      tx.setSelection(sel.collapse('left'));
    } else if (firstEntirelySelected) {
      setCursor(tx, lastNode, container.id, 'before');
    } else {
      setCursor(tx, firstNode, container.id, 'after');
    }
  }

  insertInlineNode(tx, nodeData) {
    let sel = tx.selection;
    let text = "\uFEFF";
    this.insertText(tx, text);
    sel = tx.selection;
    let endOffset = tx.selection.end.offset;
    let startOffset = endOffset - text.length;
    nodeData = Object.assign({}, nodeData, {
      start: {
        path: sel.path,
        offset: startOffset
      },
      end: {
        path: sel.path,
        offset: endOffset
      }
    });
    return tx.create(nodeData)
  }

  insertBlockNode(tx, nodeData) {
    let sel = tx.selection;
    
    let blockNode;
    if (!nodeData._isNode || !tx.get(nodeData.id)) {
      blockNode = tx.create(nodeData);
    } else {
      blockNode = tx.get(nodeData.id);
    }
    
    if (sel.isNodeSelection()) {
      let containerId = sel.containerId;
      let container = tx.get(containerId);
      let nodeId = sel.getNodeId();
      let nodePos = container.getPosition(nodeId, 'strict');
      
      if (sel.isBefore()) {
        container.showAt(nodePos, blockNode.id);
      }
      
      else if (sel.isAfter()) {
        container.showAt(nodePos+1, blockNode.id);
        tx.setSelection({
          type: 'node',
          containerId: containerId,
          nodeId: blockNode.id,
          mode: 'after'
        });
      } else {
        container.hideAt(nodePos);
        documentHelpers.deleteNode(tx, tx.get(nodeId));
        container.showAt(nodePos, blockNode.id);
        tx.setSelection({
          type: 'node',
          containerId: containerId,
          nodeId: blockNode.id,
          mode: 'after'
        });
      }
    } else if (sel.isPropertySelection()) {
      
      if (!sel.containerId) throw new Error('insertBlockNode can only be used within a container.')
      let container = tx.get(sel.containerId);
      if (!sel.isCollapsed()) {
        this._deletePropertySelection(tx, sel);
        tx.setSelection(sel.collapse('left'));
      }
      let node = tx.get(sel.path[0]);
      
      if (!node) throw new Error('Invalid selection.')
      let nodePos = container.getPosition(node.id, 'strict');
      
      if (node.isText()) {
        let text = node.getText();
        
        if (text.length === 0) {
          container.hideAt(nodePos);
          documentHelpers.deleteNode(tx, node);
          container.showAt(nodePos, blockNode.id);
          setCursor(tx, blockNode, container.id, 'after');
        }
        
        else if (sel.start.offset === 0) {
          container.showAt(nodePos, blockNode.id);
        }
        
        else if (sel.start.offset === text.length) {
          container.showAt(nodePos+1, blockNode.id);
          setCursor(tx, blockNode, container.id, 'before');
        }
        
        else {
          this.break(tx);
          container.showAt(nodePos+1, blockNode.id);
          setCursor(tx, blockNode, container.id, 'after');
        }
      } else {
        console.error('Not supported: insertBlockNode() on a custom node');
      }
    } else if (sel.isContainerSelection()) {
      if (sel.isCollapsed()) {
        let start = sel.start;
        
        if (start.isPropertyCoordinate()) {
          tx.setSelection({
            type: 'property',
            path: start.path,
            startOffset: start.offset,
            containerId: sel.containerId,
          });
        } else if (start.isNodeCoordinate()) {
          tx.setSelection({
            type: 'node',
            containerId: sel.containerId,
            nodeId: start.path[0],
            mode: start.offset === 0 ? 'before' : 'after',
          });
        } else {
          throw new Error('Unsupported selection for insertBlockNode')
        }
        return this.insertBlockNode(tx, blockNode)
      } else {
        this.break(tx);
        return this.insertBlockNode(tx, blockNode)
      }
    }
    return blockNode
  }

  insertText(tx, text) {
    let sel = tx.selection;
    
    
    
    if (sel.isNodeSelection()) {
      let containerId = sel.containerId;
      let container = tx.get(containerId);
      let nodeId = sel.getNodeId();
      let nodePos = container.getPosition(nodeId, 'strict');
      let textNode = tx.createDefaultTextNode(text);
      if (sel.isBefore()) {
        container.showAt(nodePos, textNode);
      } else if (sel.isAfter()) {
        container.showAt(nodePos+1, textNode);
      } else {
        container.hide(nodeId);
        documentHelpers.deleteNode(tx, tx.get(nodeId));
        container.showAt(nodePos, textNode);
      }
      setCursor(tx, textNode, sel.containerId, 'after');
    } else if (sel.isCustomSelection()) {
      
    } else if (sel.isCollapsed() || sel.isPropertySelection()) {
      
      this._insertText(tx, sel, text);
      
    } else if (sel.isContainerSelection()) {
      this._deleteContainerSelection(tx, sel);
      this.insertText(tx, text);
    }
  }

  paste(tx, content) {
    if (!content) return
    
    if (isString$1(content)) {
      paste(tx, {text: content});
    } else if (content._isDocument) {
      paste(tx, {doc: content});
    } else {
      throw new Error('Illegal content for paste.')
    }
  }

  
  switchTextType(tx, data) {
    let sel = tx.selection;
    
    if (!sel.isPropertySelection()) {
      throw new Error("Selection must be a PropertySelection.")
    }
    let containerId = sel.containerId;
    
    if (!containerId) {
      throw new Error("Selection must be within a container.")
    }
    let path = sel.path;
    let nodeId = path[0];
    let node = tx.get(nodeId);
    
    if (!(node.isInstanceOf('text'))) {
      throw new Error('Trying to use switchTextType on a non text node.')
    }
    
    let newNode = Object.assign({
      id: uuid(data.type),
      type: data.type,
      content: node.content,
      direction: node.direction
    }, data);
    let newPath = [newNode.id, 'content'];
    newNode = tx.create(newNode);
    annotationHelpers.transferAnnotations(tx, path, 0, newPath, 0);

    
    let container = tx.get(sel.containerId);
    let pos = container.getPosition(nodeId, 'strict');
    container.hide(nodeId);
    documentHelpers.deleteNode(tx, node);
    container.showAt(pos, newNode.id);

    tx.setSelection({
      type: 'property',
      path: newPath,
      startOffset: sel.start.offset,
      endOffset: sel.end.offset,
      containerId: containerId
    });

    return newNode
  }

  toggleList(tx, params) {
    let sel = tx.selection;
    let container = tx.get(sel.containerId);
    
    if (!container) {
      throw new Error("Selection must be within a container.")
    }
    if (sel.isPropertySelection()) {
      let nodeId = sel.start.path[0];
      
      let node = tx.get(nodeId).getContainerRoot();
      let nodePos = container.getPosition(node.id, 'strict');
      
      if (node.isText()) {
        container.hideAt(nodePos);
        
        let newItem = tx.create({
          type: 'list-item',
          content: node.getText(),
        });
        annotationHelpers.transferAnnotations(tx, node.getTextPath(), 0, newItem.getTextPath(), 0);
        let newList = tx.create(Object.assign({
          type: 'list',
          items: [newItem.id]
        }, params));
        documentHelpers.deleteNode(tx, node);
        container.showAt(nodePos, newList.id);
        tx.setSelection({
          type: 'property',
          path: newItem.getTextPath(),
          startOffset: sel.start.offset,
          containerId: sel.containerId
        });
      } else if (node.isList()) {
        let itemId = sel.start.path[0];
        let itemPos = node.getItemPosition(itemId);
        let item = node.getItemAt(itemPos);
        let newTextNode = tx.createDefaultTextNode(item.getText());
        annotationHelpers.transferAnnotations(tx, item.getTextPath(), 0, newTextNode.getTextPath(), 0);
        
        node.removeItemAt(itemPos);
        if (node.isEmpty()) {
          container.hideAt(nodePos);
          documentHelpers.deleteNode(tx, node);
          container.showAt(nodePos, newTextNode.id);
        } else if (itemPos === 0) {
          container.showAt(nodePos, newTextNode.id);
        } else if (node.getLength() <= itemPos){
          container.showAt(nodePos+1, newTextNode.id);
        } else {
          
          let tail = [];
          const items = node.items.slice();
          const L = items.length;
          for (let i = L-1; i >= itemPos; i--) {
            tail.unshift(items[i]);
            node.removeItemAt(i);
          }
          let newList = tx.create({
            type: 'list',
            items: tail,
            ordered: node.ordered
          });
          container.showAt(nodePos+1, newTextNode.id);
          container.showAt(nodePos+2, newList.id);
        }
        tx.setSelection({
          type: 'property',
          path: newTextNode.getTextPath(),
          startOffset: sel.start.offset,
          containerId: sel.containerId
        });
      } else {
        
      }
    } else if (sel.isContainerSelection()) {
      console.error('TODO: support toggleList with ContainerSelection');
    }
  }

  indent(tx) {
    let sel = tx.selection;
    if (sel.isPropertySelection()) {
      let nodeId = sel.start.getNodeId();
      
      let node = tx.get(nodeId).getContainerRoot();
      if (node.isList()) {
        let itemId = sel.start.path[0];
        let item = tx.get(itemId);
        
        if (item && item.level<3) {
          tx.set([itemId, 'level'], item.level+1);
        }
      }
    } else if (sel.isContainerSelection()) {
      console.error('TODO: support toggleList with ContainerSelection');
    }
  }

  dedent(tx) {
    let sel = tx.selection;
    if (sel.isPropertySelection()) {
      let nodeId = sel.start.getNodeId();
      
      let node = tx.get(nodeId).getContainerRoot();
      if (node.isList()) {
        let itemId = sel.start.path[0];
        let item = tx.get(itemId);
        if (item && item.level>1) {
          tx.set([itemId, 'level'], item.level-1);
        }
      }
    } else if (sel.isContainerSelection()) {
      console.error('TODO: support toggleList with ContainerSelection');
    }
  }

  
  _insertText(tx, sel, text) {
    let start = sel.start;
    let end = sel.end;
    
    if (!isArrayEqual(start.path, end.path)) {
      throw new Error('Unsupported state: range should be on one property')
    }
    let path = start.path;
    let startOffset = start.offset;
    let endOffset = end.offset;
    let typeover = !sel.isCollapsed();
    let L = text.length;
    
    if (typeover) {
      tx.update(path, { type: 'delete', start: startOffset, end: endOffset });
    }
    
    tx.update(path, { type: 'insert', start: startOffset, text: text });
    
    let annos = tx.getAnnotations(path);
    annos.forEach(function(anno) {
      let annoStart = anno.start.offset;
      let annoEnd = anno.end.offset;

      
      
      if (annoEnd<startOffset) {
        return
      }
      
      else if (annoStart>=endOffset) {
        tx.update([anno.id, 'start'], { type: 'shift', value: startOffset-endOffset+L });
        tx.update([anno.id, 'end'], { type: 'shift', value: startOffset-endOffset+L });
      }
      
      
      
      
      else if (
        (annoStart>=startOffset && annoEnd<endOffset) ||
        (anno._isInlineNode && annoStart>=startOffset && annoEnd<=endOffset)
      ) {
        tx.delete(anno.id);
      }
      
      else if (annoStart>=startOffset && annoEnd>=endOffset) {
        
        if (annoStart>startOffset || !typeover) {
          tx.update([anno.id, 'start'], { type: 'shift', value: startOffset-annoStart+L });
        }
        tx.update([anno.id, 'end'], { type: 'shift', value: startOffset-endOffset+L });
      }
      
      else if (annoStart<startOffset && annoEnd<endOffset) {
        
        tx.update([anno.id, 'end'], { type: 'shift', value: startOffset-annoEnd+L });
      }
      
      else if (annoEnd === startOffset && !anno.constructor.autoExpandRight) {
          
      }
      
      else if (annoStart<startOffset && annoEnd>=endOffset) {
        if (anno._isInlineNode) {
          
        } else {
          tx.update([anno.id, 'end'], { type: 'shift', value: startOffset-endOffset+L });
        }
      }
      else {
        console.warn('TODO: handle annotation update case.');
      }
    });
    let offset = startOffset + text.length;
    tx.setSelection({
      type: 'property',
      path: start.path,
      startOffset: offset,
      containerId: sel.containerId,
      surfaceId: sel.surfaceId
    });
  }

  _breakNode(tx, node, coor, container) {
    
    node = node.getContainerRoot();
    
    if (node.isText()) {
      this._breakTextNode(tx, node, coor, container);
    } else if (node.isList()) {
      this._breakListNode(tx, node, coor, container);
    } else {
      throw new Error('Not supported')
    }
  }

  _breakTextNode(tx, node, coor, container) {
    let path = coor.path;
    let offset = coor.offset;
    let nodePos = container.getPosition(node.id, 'strict');
    let text = node.getText();

    
    
    if (offset === 0) {
      let newNode = tx.create({
        type: node.type,
        content: ""
      });
      
      container.showAt(nodePos, newNode.id);
      tx.setSelection({
        type: 'property',
        path: path,
        startOffset: 0,
        containerId: container.id
      });
    }
    
    else {
      let newNode = node.toJSON();
      delete newNode.id;
      newNode.content = text.substring(offset);
      
      if (offset === text.length) {
        newNode.type = tx.getSchema().getDefaultTextType();
      }
      newNode = tx.create(newNode);
      
      if (offset < text.length) {
        
        annotationHelpers.transferAnnotations(tx, path, offset, newNode.getTextPath(), 0);
        
        tx.update(path, { type: 'delete', start: offset, end: text.length });
      }
      
      container.showAt(nodePos+1, newNode.id);
      
      tx.setSelection({
        type: 'property',
        path: newNode.getTextPath(),
        startOffset: 0,
        containerId: container.id
      });
    }
  }

  _breakListNode(tx, node, coor, container) {
    let path = coor.path;
    let offset = coor.offset;
    let listItem = tx.get(path[0]);

    let L = node.length;
    let itemPos = node.getItemPosition(listItem.id);
    let text = listItem.getText();
    let newItem = listItem.toJSON();
    delete newItem.id;
    if (offset === 0) {
      
      if (!text) {
        
        
        let nodePos = container.getPosition(node.id, 'strict');
        let newTextNode = tx.createDefaultTextNode();
        
        if (L < 2) {
          container.hide(node.id);
          documentHelpers.deleteNode(tx, node);
          container.showAt(nodePos, newTextNode.id);
        }
        
        else if (itemPos === 0) {
          node.remove(listItem.id);
          documentHelpers.deleteNode(tx, listItem);
          container.showAt(nodePos, newTextNode.id);
        }
        
        else if (itemPos >= L-1) {
          node.remove(listItem.id);
          documentHelpers.deleteNode(tx, listItem);
          container.showAt(nodePos+1, newTextNode.id);
        }
        
        else {
          let tail = [];
          const items = node.items.slice();
          for (let i = L-1; i > itemPos; i--) {
            tail.unshift(items[i]);
            node.remove(items[i]);
          }
          node.remove(items[itemPos]);
          let newList = tx.create({
            type: 'list',
            items: tail,
            ordered: node.ordered
          });
          container.showAt(nodePos+1, newTextNode.id);
          container.showAt(nodePos+2, newList.id);
        }
        tx.setSelection({
          type: 'property',
          path: newTextNode.getTextPath(),
          startOffset: 0
        });
      }
      
      else {
        newItem.content = "";
        newItem = tx.create(newItem);
        node.insertItemAt(itemPos, newItem.id);
        tx.setSelection({
          type: 'property',
          path: listItem.getTextPath(),
          startOffset: 0
        });
      }
    }
    
    else {
      newItem.content = text.substring(offset);
      newItem = tx.create(newItem);
      
      if (offset < text.length) {
        
        annotationHelpers.transferAnnotations(tx, path, offset, [newItem.id,'content'], 0);
        
        tx.update(path, { type: 'delete', start: offset, end: text.length });
      }
      node.insertItemAt(itemPos+1, newItem.id);
      tx.setSelection({
        type: 'property',
        path: newItem.getTextPath(),
        startOffset: 0
      });
    }
  }

  _merge(tx, node, coor, direction, container) {
    
    
    if (node.isList()) {
      let list = node;
      let itemId = coor.path[0];
      let itemPos = list.getItemPosition(itemId);
      let withinListNode = (
        (direction === 'left' && itemPos > 0) ||
        (direction === 'right' && itemPos<list.items.length-1)
      );
      if (withinListNode) {
        itemPos = (direction === 'left') ? itemPos-1 : itemPos;
        let target = list.getItemAt(itemPos);
        let targetLength = target.getLength();
        documentHelpers.mergeListItems(tx, list.id, itemPos);
        tx.setSelection({
          type: 'property',
          path: target.getTextPath(),
          startOffset: targetLength,
          containerId: container.id
        });
        return
      }
    }
    
    let nodePos = container.getPosition(node, 'strict');
    if (direction === 'left' && nodePos > 0) {
      this._mergeNodes(tx, container, nodePos-1, direction);
    } else if (direction === 'right' && nodePos<container.getLength()-1) {
      this._mergeNodes(tx, container, nodePos, direction);
    }
  }

  _mergeNodes(tx, container, pos, direction) {
    let first = container.getChildAt(pos);
    let second = container.getChildAt(pos+1);
    if (first.isText()) {
      
      if (first.isEmpty()) {
        container.hide(first.id);
        documentHelpers.deleteNode(tx, first);
        
        
        setCursor(tx, second, container.id, 'before');
        return
      }
      let target = first;
      let targetPath = target.getTextPath();
      let targetLength = target.getLength();
      if (second.isText()) {
        let source = second;
        let sourcePath = source.getTextPath();
        container.hide(source.id);
        
        tx.update(targetPath, { type: 'insert', start: targetLength, text: source.getText() });
        
        annotationHelpers.transferAnnotations(tx, sourcePath, 0, targetPath, targetLength);
        documentHelpers.deleteNode(tx, source);
        tx.setSelection({
          type: 'property',
          path: targetPath,
          startOffset: targetLength,
          containerId: container.id
        });
      } else if (second.isList()) {
        let list = second;
        if (!second.isEmpty()) {
          let source = list.getFirstItem();
          let sourcePath = source.getTextPath();
          
          list.removeItemAt(0);
          
          tx.update(targetPath, { type: 'insert', start: targetLength, text: source.getText() });
          
          annotationHelpers.transferAnnotations(tx, sourcePath, 0, targetPath, targetLength);
          
          documentHelpers.deleteNode(tx, source);
        }
        if (list.isEmpty()) {
          container.hide(list.id);
          documentHelpers.deleteNode(tx, list);
        }
        tx.setSelection({
          type: 'property',
          path: targetPath,
          startOffset: targetLength,
          containerId: container.id
        });
      } else {
        selectNode(tx, direction === 'left' ? first.id : second.id, container.id);
      }
    } else if (first.isList()) {
      if (second.isText()) {
        let source = second;
        let sourcePath = source.getTextPath();
        let target = first.getLastItem();
        let targetPath = target.getTextPath();
        let targetLength = target.getLength();
        
        container.hide(source.id);
        
        tx.update(targetPath, { type: 'insert', start: targetLength, text: source.getText() });
        
        annotationHelpers.transferAnnotations(tx, sourcePath, 0, targetPath, targetLength);
        documentHelpers.deleteNode(tx, source);
        tx.setSelection({
          type: 'property',
          path: target.getTextPath(),
          startOffset: targetLength,
          containerId: container.id
        });
      } else if (second.isList()) {
        
        if (direction !== 'right') {
          
          
          throw new Error('Illegal state')
        }
        container.hide(second.id);
        let firstItems = first.items.slice();
        let secondItems = second.items.slice();
        for (let i=0; i<secondItems.length;i++) {
          second.removeItemAt(0);
          first.appendItem(secondItems[i]);
        }
        documentHelpers.deleteNode(tx, second);
        let item = tx.get(last$1(firstItems));
        tx.setSelection({
          type: 'property',
          path: item.getTextPath(),
          startOffset: item.getLength(),
          containerId: container.id
        });
      } else {
        selectNode(tx, direction === 'left' ? first.id : second.id, container.id);
      }
    } else {
      if (second.isText() && second.isEmpty()) {
        container.hide(second.id);
        documentHelpers.deleteNode(tx, second);
        setCursor(tx, first, container.id, 'after');
      } else {
        selectNode(tx, direction === 'left' ? first.id : second.id, container.id);
      }
    }
  }
}

class EditingInterface {

  constructor(doc, options = {}) {
    this._document = doc;
    this._selection = null;
    
    this._impl = options.editing || new Editing();
    this._direction = null;
  }

  dispose() {}

  getDocument() {
    return this._document
  }

  

  get(...args) {
    return this._document.get(...args)
  }

  contains(id) {
    return this._document.contains(id)
  }

  create(nodeData) {
    return this._document.create(nodeData)
  }

  createDefaultTextNode(content) {
    return this._document.createDefaultTextNode(content, this._direction)
  }

  delete(nodeId) {
    return this._document.delete(nodeId)
  }

  set(path, value) {
    return this._document.set(path, value)
  }

  update(path, diffOp) {
    return this._document.update(path, diffOp)
  }

  

  createSelection(selData) {
    
    
    
    
    
    
    
    selData = augmentSelection(selData, this._selection);
    return this._document.createSelection(selData)
  }

  setSelection(sel) {
    if (!sel) {
      sel = Selection.nullSelection;
    } else if (isPlainObject$1(sel)) {
      sel = this.createSelection(sel);
    } else {
      sel = augmentSelection(sel, this._selection);
    }
    this._selection = sel;
    return sel
  }

  getSelection() {
    return this._selection
  }

  get selection() {
    return this._selection
  }

  set selection(sel) {
    this.setSelection(sel);
  }

  
  get textDirection() {
    return this._direction
  }

  set textDirection(dir) {
    this._direction = dir;
  }

  

  annotate(annotationData) {
    const sel = this._selection;
    if (sel && (sel.isPropertySelection() || sel.isContainerSelection())) {
      return this._impl.annotate(this, annotationData)
    }
  }

  break() {
    if (this._selection && !this._selection.isNull()) {
      this._impl.break(this);
    }
  }

  copySelection() {
    const sel = this._selection;
    if (sel && !sel.isNull() && !sel.isCollapsed()) {
      return copySelection(this.getDocument(), this._selection)
    }
  }

  deleteSelection(options) {
    const sel = this._selection;
    if (sel && !sel.isNull() && !sel.isCollapsed()) {
      this._impl.delete(this, 'right', options);
    }
  }

  deleteCharacter(direction) {
    const sel = this._selection;
    if (!sel || sel.isNull()) {
      
    } else if (!sel.isCollapsed()) {
      this.deleteSelection();
    } else {
      this._impl.delete(this, direction);
    }
  }

  insertText(text) {
    const sel = this._selection;
    if (sel && !sel.isNull()) {
      this._impl.insertText(this, text);
    }
  }

  
  insertInlineNode(inlineNode) {
    const sel = this._selection;
    if (sel && !sel.isNull() && sel.isPropertySelection()) {
      return this._impl.insertInlineNode(this, inlineNode)
    }
  }

  insertBlockNode(blockNode) {
    const sel = this._selection;
    if (sel && !sel.isNull()) {
      return this._impl.insertBlockNode(this, blockNode)
    }
  }

  paste(content) {
    const sel = this._selection;
    if (sel && !sel.isNull() && !sel.isCustomSelection()) {
      return this._impl.paste(this, content)
    }
  }

  switchTextType(nodeData) {
    const sel = this._selection;
    if (sel && !sel.isNull()) {
      return this._impl.switchTextType(this, nodeData)
    }
  }

  toggleList(params) {
    const sel = this._selection;
    if (sel && !sel.isNull()) {
      return this._impl.toggleList(this, params)
    }
  }

  indent() {
    const sel = this._selection;
    if (sel && !sel.isNull()) {
      return this._impl.indent(this)
    }
  }

  dedent() {
    const sel = this._selection;
    if (sel && !sel.isNull()) {
      return this._impl.dedent(this)
    }
  }

  

  getIndex(...args) {
    return this._document.getIndex(...args)
  }

  getAnnotations(...args) {
    return this._document.getAnnotations(...args)
  }

  getSchema() {
    return this._document.getSchema()
  }

  createSnippet() {
    return this._document.createSnippet()
  }

}

class ChangeRecorder extends EditingInterface {

  constructor(doc) {
    super(doc.clone());
  }

  generateChange() {
    const doc = this.getDocument();
    const ops = doc._ops.slice();
    doc._ops.length = 0;
    let change = new DocumentChange(ops, {}, {});
    change._extractInformation(doc);
    return change
  }

}

var documentHelpers = {
  getPropertyAnnotationsForSelection,
  getContainerAnnotationsForSelection,
  getTextForSelection,
  getMarkersForSelection,
  getChangeFromDocument,
  copyNode,
  deleteNode,
  deleteTextRange,
  deleteListRange,
  mergeListItems,
  isContainerAnnotation,
  getNodes
};


function getPropertyAnnotationsForSelection(doc, sel, options) {
  options = options || {};
  if (!sel.isPropertySelection()) {
    return []
  }
  let path = sel.getPath();
  let annotations = doc.getIndex('annotations').get(path, sel.start.offset, sel.end.offset);
  if (options.type) {
    annotations = filter(annotations, DocumentIndex.filterByType(options.type));
  }
  return annotations
}


function getContainerAnnotationsForSelection(doc, sel, containerId, options) {
  
  
  
  
  
  if (!containerId) {
    throw new Error("'containerId' is required.")
  }
  options = options || {};
  let index = doc.getIndex('container-annotations');
  let annotations = [];
  if (index) {
    annotations = index.get(containerId, options.type);
    annotations = filter(annotations, function(anno) {
      return sel.overlaps(anno.getSelection())
    });
  }
  return annotations
}


function isContainerAnnotation(doc, type) {
  let schema = doc.getSchema();
  return schema.isInstanceOf(type, 'container-annotation')
}


function getTextForSelection(doc, sel) {
  if (!sel || sel.isNull()) {
    return ""
  } else if (sel.isPropertySelection()) {
    let text = doc.get(sel.start.path);
    return text.substring(sel.start.offset, sel.end.offset)
  } else if (sel.isContainerSelection()) {
    let result = [];
    let nodeIds = sel.getNodeIds();
    let L = nodeIds.length;
    for (let i = 0; i < L; i++) {
      let id = nodeIds[i];
      let node = doc.get(id);
      if (node.isText()) {
        let text = node.getText();
        if (i === L-1) {
          text = text.slice(0, sel.end.offset);
        }
        if (i === 0) {
          text = text.slice(sel.start.offset);
        }
        result.push(text);
      }
    }
    return result.join('\n')
  }
}

function getMarkersForSelection(doc, sel) {
  
  if (!sel || !sel.isPropertySelection()) return []
  const path = sel.getPath();
  
  let markers = doc.getIndex('markers').get(path);
  const filtered = filter(markers, function(m) {
    return m.containsSelection(sel)
  });
  return filtered
}

function getChangeFromDocument(doc) {
  let recorder = new ChangeRecorder(doc);
  return recorder.generateChange()
}


function deleteNode(doc, node) {
  
  if (!node) {
    console.warn('Invalid arguments');
    return
  }
  
  if (node.isText()) {
    
    let annos = doc.getIndex('annotations').get(node.id);
    for (let i = 0; i < annos.length; i++) {
      doc.delete(annos[i].id);
    }
  }
  
  
  
  let nodeSchema = node.getSchema();
  forEach(nodeSchema, (prop) => {
    if ((prop.isReference() && prop.isOwned()) || (prop.type === 'file')) {
      if (prop.isArray()) {
        let ids = node[prop.name];
        ids.forEach((id) => {
          deleteNode(doc, doc.get(id));
        });
      } else {
        deleteNode(doc, doc.get(node[prop.name]));
      }
    }
  });
  doc.delete(node.id);
}


function copyNode(node) {
  let nodes = [];
  
  let nodeSchema = node.getSchema();
  let doc = node.getDocument();
  forEach(nodeSchema, (prop) => {
    
    
    if ((prop.isReference() && prop.isOwned()) || (prop.type === 'file')) {
      let val = node[prop.name];
      nodes.push(_copyChildren(val));
    }
  });
  nodes.push(node.toJSON());
  let annotationIndex = node.getDocument().getIndex('annotations');
  let annotations = annotationIndex.get([node.id]);
  forEach(annotations, function(anno) {
    nodes.push(anno.toJSON());
  });
  let result = flatten(nodes).filter(Boolean);
  
  return result

  function _copyChildren(val) {
    if (!val) return null
    if (isArray$1(val)) {
      return flatten(val.map(_copyChildren))
    } else {
      let id = val;
      if (!id) return null
      let child = doc.get(id);
      if (!child) return
      return copyNode(child)
    }
  }
}


function deleteTextRange(doc, start, end) {
  if (!start) {
    start = {
      path: end.path,
      offset: 0
    };
  }
  let path = start.path;
  let text = doc.get(path);
  if (!end) {
    end = {
      path: start.path,
      offset: text.length
    };
  }
  
  if (!isArrayEqual(start.path, end.path)) {
    throw new Error('start and end must be on one property')
  }
  let startOffset = start.offset;
  if (startOffset < 0) throw new Error("start offset must be >= 0")
  let endOffset = end.offset;
  if (endOffset > text.length) throw new Error("end offset must be smaller than the text length")

  doc.update(path, { type: 'delete', start: startOffset, end: endOffset });
  
  let annos = doc.getAnnotations(path);
  annos.forEach(function(anno) {
    let annoStart = anno.start.offset;
    let annoEnd = anno.end.offset;
    
    if (annoEnd<=startOffset) {
      return
    }
    
    else if (annoStart>=endOffset) {
      doc.update([anno.id, 'start'], { type: 'shift', value: startOffset-endOffset });
      doc.update([anno.id, 'end'], { type: 'shift', value: startOffset-endOffset });
    }
    
    else if (annoStart>=startOffset && annoEnd<=endOffset) {
      doc.delete(anno.id);
    }
    
    else if (annoStart>=startOffset && annoEnd>=endOffset) {
      if (annoStart>startOffset) {
        doc.update([anno.id, 'start'], { type: 'shift', value: startOffset-annoStart });
      }
      doc.update([anno.id, 'end'], { type: 'shift', value: startOffset-endOffset });
    }
    
    else if (annoStart<=startOffset && annoEnd<=endOffset) {
      doc.update([anno.id, 'end'], { type: 'shift', value: startOffset-annoEnd });
    }
    
    else if (annoStart<startOffset && annoEnd >= endOffset) {
      doc.update([anno.id, 'end'], { type: 'shift', value: startOffset-endOffset });
    }
    else {
      console.warn('TODO: handle annotation update case.');
    }
  });
}

function deleteListRange(doc, list, start, end) {
  if (doc !== list.getDocument()) {
    list = doc.get(list.id);
  }
  if (!start) {
    start = {
      path: list.getItemAt(0).getTextPath(),
      offset: 0
    };
  }
  if (!end) {
    let item = list.getLastItem();
    end = {
      path: item.getTextPath(),
      offset: item.getLength()
    };
  }
  let startId = start.path[0];
  let startPos = list.getItemPosition(startId);
  let endId = end.path[0];
  let endPos = list.getItemPosition(endId);
  
  if (startPos === endPos) {
    deleteTextRange(doc, start, end);
    return
  }
  
  if (startPos > endPos) {
    [start, end] = [end, start];
    [startPos, endPos] = [endPos, startPos];
    [startId, endId] = [endId, startId];
  }
  let firstItem = doc.get(startId);
  let lastItem = doc.get(endId);
  let firstEntirelySelected = isEntirelySelected(doc, firstItem, start, null);
  let lastEntirelySelected = isEntirelySelected(doc, lastItem, null, end);

  
  if (lastEntirelySelected) {
    list.removeItemAt(endPos);
    deleteNode(doc, lastItem);
  } else {
    deleteTextRange(doc, null, end);
  }

  
  for (let i = endPos-1; i > startPos; i--) {
    let itemId = list.items[i];
    list.removeItemAt(i);
    deleteNode(doc, doc.get(itemId));
  }

  
  if (firstEntirelySelected) {
    list.removeItemAt(startPos);
    deleteNode(doc, firstItem);
  } else {
    deleteTextRange(doc, start, null);
  }

  if (!firstEntirelySelected && !lastEntirelySelected) {
    mergeListItems(doc, list.id, startPos);
  }
}

function mergeListItems(doc, listId, itemPos) {
  
  let list = doc.get(listId);
  let target = list.getItemAt(itemPos);
  let targetPath = target.getTextPath();
  let targetLength = target.getLength();
  let source = list.getItemAt(itemPos+1);
  let sourcePath = source.getTextPath();
  
  list.removeItemAt(itemPos+1);
  
  doc.update(targetPath, { type: 'insert', start: targetLength, text: source.getText() });
  
  annotationHelpers.transferAnnotations(doc, sourcePath, 0, targetPath, targetLength);
  doc.delete(source.id);
}

function getNodes(doc, ids) {
  return ids.map((id) => {
    return doc.get(id, 'strict')
  })
}

var AnnotationMixin = function(DocumentNode) {

  class AbstractAnnotation extends DocumentNode {

    constructor(doc, props) {
      super(doc, _normalizedProps(props));

      
      this.start = new Coordinate(this.start);
      this.end = new Coordinate(this.end);
    }

    

    get path() {
      console.warn('DEPRECATED: use annotation.start.path instead');
      return this.start.path
    }

    getPath() {
      return this.start.path
    }

    get startPath() {
      console.warn('DEPRECATED: use annotation.start.path instead.');
      return this.start.path
    }

    set startPath(path) {
      console.warn('DEPRECATED: use annotation.start.path instead.');
      this.start.path = path;
    }

    get startOffset() {
      console.warn('DEPRECATED: use annotation.start.offset instead.');
      return this.start.offset
    }

    set startOffset(offset) {
      console.warn('DEPRECATED: use annotation.start.offset instead.');
      this.start.offset = offset;
    }

    get endPath() {
      console.warn('DEPRECATED: use annotation.end.path instead.');
      return this.end.path
    }

    set endPath(path) {
      console.warn('DEPRECATED: use annotation.end.path instead.');
      this.end.path = path;
    }

    get endOffset() {
      console.warn('DEPRECATED: use annotation.end.offset instead.');
      return this.end.offset
    }

    set endOffset(offset) {
      console.warn('DEPRECATED: use annotation.end.offset instead.');
      this.end.offset = offset;
    }

    

    
    getText() {
      var doc = this.getDocument();
      if (!doc) {
        console.warn('Trying to use a Annotation which is not attached to the document.');
        return ""
      }
      return documentHelpers.getTextForSelection(doc, this.getSelection())
    }

    isAnnotation() {
      return true
    }

    
    canSplit() {
      return true
    }

    
    isAnchor() {
      return false
    }

    
    getSelection() {
      const doc = this.getDocument();
      
      if (!doc) {
        console.warn('Trying to use a ContainerAnnotation which is not attached to the document.');
        return Selection.nullSelection()
      }
      if (this._isContainerAnnotation) {
        return doc.createSelection({
          type: "container",
          containerId: this.containerId,
          startPath: this.start.path,
          startOffset: this.start.offset,
          endPath: this.end.path,
          endOffset: this.end.offset
        })
      } else {
        return this.getDocument().createSelection({
          type: 'property',
          path: this.start.path,
          startOffset: this.start.offset,
          endOffset: this.end.offset
        })
      }
    }

    _updateRange(tx, sel) {
      if (sel.isContainerSelection()) {
        
        if (!isEqual(this.start.path, sel.start.path)) {
          tx.set([this.id, 'start', 'path'], sel.start.path);
        }
        if (this.start.offset !== sel.start.offset) {
          tx.set([this.id, 'start', 'offset'], sel.start.offset);
        }
        if (!isEqual(this.end.path, sel.end.path)) {
          tx.set([this.id, 'end', 'path'], sel.end.path);
        }
        if (this.end.offset !== sel.end.offset) {
          tx.set([this.id, 'end', 'offset'], sel.end.offset);
        }
      } else if (sel.isPropertySelection()) {
        if (!isArrayEqual(this.start.path, sel.start.path)) {
          tx.set([this.id, 'path'], sel.start.path);
        }
        
        if (this.start.offset !== sel.start.offset) {
          tx.set([this.id, 'start', 'offset'], sel.start.offset);
        }
        if (this.end.offset !== sel.end.offset) {
          tx.set([this.id, 'end', 'offset'], sel.end.offset);
        }
      } else {
        throw new Error('Invalid selection.')
      }
    }
  }

  AbstractAnnotation.prototype._isAnnotation = true;

  AbstractAnnotation.schema = {
    start: "coordinate",
    end: "coordinate"
  };

  return AbstractAnnotation
};

function _normalizedProps(props) {
  if (!props.hasOwnProperty('start')) {
    
    
    props = Object.assign({}, props);
    props.start = {
      path: props.startPath || props.path,
      offset: props.startOffset
    };
    props.end = {};
    if (props.hasOwnProperty('endPath')) {
      props.end.path = props.endPath;
    } else {
      props.end.path = props.start.path;
    }
    if (props.hasOwnProperty('endOffset')) {
      props.end.offset = props.endOffset;
    } else {
      props.end.offset = props.start.offset;
    }
    delete props.path;
    delete props.startPath;
    delete props.endPath;
    delete props.startOffset;
    delete props.endOffset;
  } else if (props.hasOwnProperty('end') && !props.end.path) {
    props.end.path = props.start.path;
  }
  return props
}

class Property {

  constructor(definition) {
    this.definition = definition;
  }

  isArray() {
    return isArray$1(this.definition.type)
  }

  isReference() {
    if (this.isArray()) {
      return last$1(this.definition.type) === 'id'
    } else {
      return this.definition.type === 'id'
    }
  }

  isText() {
    return Boolean(this.definition._isText)
  }

  isOwned() {
    return Boolean(this.definition.owned)
  }

  isOptional() {
    return Boolean(this.definition.optional)
  }

  isNotNull() {
    return Boolean(this.definition.notNull)
  }

  hasDefault() {
    return this.definition.hasOwnProperty('default')
  }

  getDefault() {
    return this.definition.default
  }

  createDefaultValue() {
    if (isArray$1(this.definition.type)) {
      return []
    }
    switch(this.definition.type) {
      case 'object':
        return {}
      case 'number':
        return -1
      case 'coordinate':
        return new Coordinate([], 0)
      case 'boolean':
        return false
      case 'id':
        return null
      case 'string':
        return ''
      default:
        return null
    }
  }

  get type() {
    return this.definition.type
  }

  get name() {
    return this.definition.name
  }
}

class Node extends EventEmitter {

  
  constructor() {
    super();

    
    
    this._initialize.apply(this, arguments);
  }

  _initialize(data) {
    const NodeClass = this.constructor;

    let schema = NodeClass.schema;
    for (var name in schema) {
      if (!schema.hasOwnProperty(name)) continue
      let prop = schema[name];
      
      
      const propIsGiven = (data[name] !== undefined);
      const hasDefault = prop.hasDefault();
      const isOptional = prop.isOptional();
      if ( (!isOptional && !hasDefault) && !propIsGiven) {
        throw new Error('Property ' + name + ' is mandatory for node type ' + this.type)
      }
      if (propIsGiven) {
        this[name] = _checked(prop, data[name]);
      } else if (hasDefault) {
        this[name] = cloneDeep(_checked(prop, prop.getDefault()));
      } else {
        
      }
    }
  }

  dispose() {
    this._disposed = true;
  }

  isDisposed() {
    return Boolean(this._disposed)
  }

  
  isInstanceOf(typeName) {
    return Node.isInstanceOf(this.constructor, typeName)
  }

  getSchema() {
    return this.constructor.schema
  }

  
  getTypeNames() {
    var typeNames = [];
    var NodeClass = this.constructor;
    while (NodeClass.type !== "node") {
      typeNames.push(NodeClass.type);
      NodeClass = Object.getPrototypeOf(NodeClass);
    }
    return typeNames
  }

  
  getPropertyType(propertyName) {
    var schema = this.constructor.schema;
    return schema[propertyName].type
  }

  
  toJSON() {
    var data = {
      type: this.type
    };
    const schema = this.getSchema();
    forEach(schema, (prop, name) => {
      let val = this[name];
      if (prop.isOptional() && val === undefined) return
      if (isArray$1(val) || isObject$1(val)) {
        val = cloneDeep(val);
      }
      data[prop.name] = val;
    });
    return data
  }

  get type() {
    return this.constructor.type
  }

}

Node.prototype._isNode = true;


Object.defineProperty(Node, 'schema', {
  get() { return this._schema },
  set(schema) {
    let NodeClass = this;
    
    
    if (schema.type) {
      NodeClass.type = schema.type;
    }
    
    
    
    NodeClass._schema = compileSchema(NodeClass, schema);
  }
});

Node.define = Node.defineSchema = function define(schema) {
  this.schema = schema;
};

Node.schema = {
  type: "node",
  id: 'string'
};


Node.isInstanceOf = function(NodeClass, typeName) {
  var type = NodeClass.type;
  while (type !== "node") {
    if (type === typeName) return true
    var _super = Object.getPrototypeOf(NodeClass.prototype).constructor;
    if (_super && _super.type) {
      NodeClass = _super;
      type = NodeClass.type;
    } else {
      break
    }
  }
  return false
};



function compileSchema(NodeClass, schema) {
  let compiledSchema = _compileSchema(schema);
  let schemas = [compiledSchema];
  let clazz = NodeClass;
  while(clazz) {
    var parentProto = Object.getPrototypeOf(clazz.prototype);
    if (!parentProto) {
      break
    }
    clazz = parentProto.constructor;
    if (clazz && clazz._schema) {
      schemas.unshift(clazz._schema);
    }
  }
  schemas.unshift({});
  return Object.assign.apply(null, schemas)
}

function _compileSchema(schema) {
  let compiledSchema = {};
  forEach(schema, function(definition, name) {
    
    if (name === 'type') {
      return
    }
    if (isString$1(definition) || isArray$1(definition)) {
      definition = { type: definition };
    }
    definition = _compileDefintion(definition);
    definition.name = name;
    compiledSchema[name] = new Property(definition);
  });
  return compiledSchema
}

function _compileDefintion(definition) {
  let result = definition;
  if (isArray$1(definition.type) && definition.type[0] !== "array") {
    definition.type = [ "array", definition.type[0] ];
  } else if (definition.type === 'text') {
    result = {
      type: "string",
      default: '',
      _isText: true
    };
  }
  return result
}

function _checked(prop, value) {
  let type;
  let name = prop.name;
  if (prop.isArray()) {
    type = "array";
  } else {
    type = prop.type;
  }
  if (value === null) {
    if (prop.isNotNull()) {
      throw new Error('Value for property ' + name + ' is null.')
    } else {
      return value
    }
  }
  if (value === undefined) {
    throw new Error('Value for property ' + name + ' is undefined.')
  }
  if (type === "string" && !isString$1(value) ||
      type === "boolean" && !isBoolean(value) ||
      type === "number" && !isNumber(value) ||
      type === "array" && !isArray$1(value) ||
      type === "id" && !isString$1(value) ||
      type === "object" && !isObject$1(value)) {
    throw new Error('Illegal value type for property ' + name + ': expected ' + type + ', was ' + (typeof value))
  }
  return value
}

class DocumentNode extends Node {

  
  constructor(doc, props) {
    super(doc, props);
  }

  _initialize(doc, props) {
    this.document = doc;
    super._initialize(props);
  }

  
  getDocument() {
    return this.document
  }

  
  hasParent() {
    return Boolean(this.parent)
  }

  
  getParent() {
    return this.document.get(this.parent)
  }

  
  getRoot() {
    let node = this;
    while(node.parent) {
      node = node.parent;
    }
    return node
  }

  getContainerRoot() {
    let node = this;
    while(node.parent) {
      
      if (node.parent.isContainer()) return node
      
      node = node.parent;
    }
    return node
  }

  
  hasChildren() {
    return false
  }

  
  getChildIndex(child) { 
    return -1
  }

  
  getChildAt(idx) { 
    return null
  }

  
  getChildCount() {
    return 0
  }

  
  

  

  
  isBlock() {
    return Boolean(this.constructor.isBlock)
  }

  
  isText() {
    return Boolean(this.constructor.isText)
  }

  isList() {
    return Boolean(this.constructor.isList)
  }

  isContainer() {
    return Boolean(this._isContainer)
  }

  

  isAnnotation() {
    return Boolean(this._isAnnotation)
  }

  isPropertyAnnotation() {
    return Boolean(this._isPropertyAnnotation)
  }

  isContainerAnnotation() {
    return Boolean(this._isContainerAnnotation)
  }

  
  isInline() {
    return Boolean(this.constructor.isInline)
  }

}

DocumentNode.prototype._isDocumentNode = true;


DocumentNode.isBlock = false;


DocumentNode.isText = false;


DocumentNode.isPropertyAnnotation = false;


DocumentNode.isContainerAnnotation = false;


DocumentNode.isInline = false;

class BlockNode extends DocumentNode {}

BlockNode.isBlock = true;

class ChangeHistory {

  constructor() {
    
    this.doneChanges = [];
    
    this.undoneChanges = [];
    
    this.lastChange = null;
  }

  canUndo() {
    return this.doneChanges.length > 0
  }

  canRedo() {
    return this.undoneChanges.length > 0
  }

  push(change) {
    this.doneChanges.push(change);
    this.undoneChanges = [];
  }

}

class ContainerAddress {

  constructor(pos, offset) {
    this.pos = pos;
    this.offset = offset;
  }

  isBefore(other, strict) {
    strict = Boolean(strict);
    if (this.pos < other.pos) {
      return true
    } else if (this.pos > other.pos) {
      return false
    } else if (this.offset < other.offset) {
      return true
    } else if (this.offset > other.offset) {
      return false
    }
    if (strict) {
      return false
    } else {
      return true
    }
  }

  isAfter(other, strict) {
    return other.isBefore(this, strict)
  }

  isEqual(other) {
    return (this.pos === other.pos && this.offset === other.offset)
  }

  toString() {
    return [this.pos,'.',this.offset].join('')
  }
}

var ContainerMixin = function (DocumentNode) {

  class AbstractContainer extends DocumentNode {

    contains(nodeId) {
      return this.getPosition(nodeId) >= 0
    }

    getPosition(node, strict) {
      if (isString$1(node)) {
        node = this.document.get(node);
      }
      if (!node) return -1
      let pos = this._getPosition(node);
      if (strict && pos < 0) {
        throw new Error('Node is not within this container: ' + node.id)
      }
      return pos
    }

    getNodeAt(idx) {
      const nodeId = this.getNodeIdAt(idx);
      if (nodeId) {
        return this.getDocument().get(nodeId)
      }
    }

    getNodeIdAt(idx) {
      let content = this.getContent();
      if (idx < 0 || idx >= content.length) {
        
        return undefined
      } else {
        return content[idx]
      }
    }

    getNodes() {
      const doc = this.getDocument();
      return this.getContent().map(id => doc.get(id)).filter(Boolean)
    }

    show(nodeId, pos) {
      
      const arg1 = arguments[0];
      if (!isString$1(arg1)) {
        if (arg1._isNode) {
          nodeId = arg1.id;
        }
      }
      if (arguments.length > 1) {
        console.error('DEPRECATED: use container.showAt(pos, nodeId) instead');
      } else {
        pos = this.getLength();
      }
      return this.showAt(pos, nodeId)
    }

    showAt(pos, nodeId) {
      const doc = this.getDocument();
      const length = this.getLength();
      if (!isNumber(pos) || pos < 0 || pos > length) {
        throw new Error('Index out of bounds')
      }
      if (!isString$1(nodeId)) {
        if (nodeId._isNode) {
          nodeId = nodeId.id;
        } else {
          throw new Error('Invalid argument.')
        }
      }
      doc.update(this.getContentPath(), { type: 'insert', pos: pos, value: nodeId });
    }

    hide(nodeId) {
      const pos = this.getPosition(nodeId);
      this.hideAt(pos);
    }

    hideAt(pos) {
      const length = this.getLength();
      if (pos >= 0 && pos < length) {
        const doc = this.getDocument();
        doc.update(this.getContentPath(), { type: 'delete', pos: pos });
      } else {
        throw new Error('Index out of bounds.')
      }
    }

    getAddress(coor) {
      if (!coor._isCoordinate) {
        
        throw new Error('Illegal argument: Container.getAddress(coor) expects a Coordinate instance.')
      }
      var nodeId = coor.path[0];
      var nodePos = this.getPosition(nodeId);
      var offset;
      if (coor.isNodeCoordinate()) {
        if (coor.offset > 0) {
          offset = Number.MAX_VALUE;
        } else {
          offset = 0;
        }
      } else {
        offset = coor.offset;
      }
      return new ContainerAddress(nodePos, offset)
    }

    getLength() {
      return this.getContent().length
    }

    get length() {
      return this.getLength()
    }

    _getPosition(node) {
      if (this._isCaching) {
        return this._getCachedPosition(node)
      } else {
        return this._lookupPosition(node)
      }
    }

    _getCachedPosition(node) {
      let cache = this._cachedPositions || this._fillCache();
      let nodeId = node.id;
      let pos = -1;
      if (cache.hasOwnProperty(nodeId)) {
        pos = cache[nodeId];
      } else {
        pos = this._lookupPosition(node);
        cache[nodeId] = pos;
      }
      return pos
    }

    _fillCache() {
      let positions = {};
      this.nodes.forEach((id, pos) => {
        positions[id] = pos;
      });
      this._cachedPositions = positions;
      return positions
    }

    _invalidateCache() {
      this._cachedPositions = null;
    }

    _lookupPosition(node) {
      if (node.hasParent()) {
        node = node.getContainerRoot();
      }
      return this.getContent().indexOf(node.id)
    }

    _enableCaching() {
      
      if (this.document) {
        this.document.data.on('operation:applied', this._onOperationApplied, this);
        this._isCaching = true;
      }
    }

    _onOperationApplied(op) {
      if (op.type === 'set' || op.type === 'update') {
        if (op.path[0] === this.id) {
          this._invalidateCache();
        }
      }
    }

    _onDocumentChange(change) {
      if (change.hasUpdated(this.getContentPath())) {
        this._invalidateCache();
      }
    }

    
    

    hasChildren() {
      return this.getContent().length > 0
    }

    getChildIndex(child) {
      return this.getContent().indexOf(child.id)
    }

    getChildren() {
      return documentHelpers.getNodes(this.getDocument(), this.getContent())
    }

    getChildAt(idx) {
      var childrenIds = this.getContent();
      if (idx < 0 || idx >= childrenIds.length) {
        throw new Error('Array index out of bounds: ' + idx + ", " + childrenIds.length)
      }
      return this.getDocument().get(childrenIds[idx], 'strict')
    }

    getChildCount() {
      return this.getContent().length
    }

  }
  return AbstractContainer

};

class Container extends ContainerMixin(DocumentNode) {

  constructor(...args) {
    super(...args);

    
    
    
    this._enableCaching();
  }

  dispose() {
    this.document.off(this);
  }

  getContentPath() {
    return [this.id, 'nodes']
  }

  getContent() {
    return this.nodes
  }

}

Container.prototype._isContainer = true;

Container.schema = {
  type: 'container',
  nodes: { type: ['array', 'id'], default: [] }
};

class ContainerAdapter extends Container {

  constructor(doc, path) {
    super(doc, { id: String(path) });
    this.document = doc;
    this.path = path;

    
    
    doc.data.nodes[this.id] = this;
  }

  getContentPath() {
    return this.path
  }

  get nodes() {
    return this.document.get(this.path)
  }

}

ContainerAdapter.prototype._isDocumentNode = false;
ContainerAdapter.prototype._isContainer = false;

class ContainerAnnotation extends AnnotationMixin(DocumentNode) {

  setHighlighted(highlighted, scope) {
    if (this.highlighted !== highlighted) {
      this.highlighted = highlighted;
      this.highlightedScope = scope;
      this.emit('highlighted', highlighted, scope);
      forEach(this.fragments, function(frag) {
        frag.emit('highlighted', highlighted, scope);
      });
    }
  }

}

ContainerAnnotation.schema = {
  type: "container-annotation",
  containerId: "string",
  start: "coordinate",
  end: "coordinate"
};

ContainerAnnotation.prototype._isAnnotation = true;
ContainerAnnotation.prototype._isContainerAnnotation = true;

class CoordinateAdapter extends Coordinate {

  constructor(owner, pathProperty, offsetProperty) {
    super('SKIP');

    this._owner = owner;
    this._pathProp = pathProperty;
    this._offsetProp = offsetProperty;
    Object.freeze(this);
  }

  equals(other) {
    return (other === this ||
      (isArrayEqual(other.path, this.path) && other.offset === this.offset) )
  }

  get path() {
    return this._owner[this._pathProp];
  }

  set path(path) {
    this._owner[this._pathProp] = path;
  }

  get offset() {
    return this._owner[this._offsetProp];
  }

  set offset(offset) {
    this._owner[this._offsetProp] = offset;
  }

  toJSON() {
    return {
      path: this.path,
      offset: this.offset
    }
  }

  toString() {
    return "(" + this.path.join('.') + ", " + this.offset + ")"
  }
}

function createDocumentFactory(ArticleClass, create) {
  return {
    ArticleClass: ArticleClass,
    createEmptyArticle: function() {
      const doc = new ArticleClass();
      return doc
    },
    createArticle: function() {
      const doc = new ArticleClass();
      create(doc);
      return doc
    },
    createChangeset: function() {
      const doc = new ArticleClass();
      const tx = new ChangeRecorder(doc);
      create(tx);
      const change = tx.generateChange();
      return [change.toJSON()]
    }
  }
}

class DefaultChangeCompressor {

  shouldMerge(lastChange, newChange) {
    return false
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
  }

  
  merge(first, second) {
    
    
    var firstOp = first.ops[0];
    var secondOp = second.ops[0];
    var firstDiff = firstOp.diff;
    var secondDiff = secondOp.diff;
    var mergedOp = false;
    if (firstDiff.isInsert()) {
      if (firstDiff.pos+firstDiff.getLength() === secondDiff.pos) {
        mergedOp = firstOp.toJSON();
        mergedOp.diff.str += secondDiff.str;
      }
    }
    else if (firstDiff.isDelete()) {
      
      
      if (firstDiff.pos === secondDiff.pos) {
        mergedOp = firstOp.toJSON();
        mergedOp.diff.str += secondDiff.str;
      } else if (secondDiff.pos+secondDiff.getLength() === firstDiff.pos) {
        mergedOp = firstOp.toJSON();
        mergedOp.diff = secondDiff;
        mergedOp.diff.str += firstDiff.str;
      }
    }
    if (mergedOp) {
      first.ops[0] = ObjectOperation.fromJSON(mergedOp);
      if (first.ops.length > 1) {
        
        
        
        first.ops = first.ops.concat(second.ops.slice(1));
        first.after = second.after;
      }
      return true
    }
    return false
  }

}

class FileProxy {
  constructor(fileNode, context) {
    this.fileNode = fileNode;
    this.context = context;
    fileNode.setProxy(this);
  }

  get id() {
    return this.fileNode.id
  }

  
  triggerUpdate() {
    let fileId = this.fileNode.id;
    this.context.editorSession.transaction((tx) => {
      tx.set([fileId, '__changed__'], '');
    }, { history: false });
  }

  getUrl() {
    return ''
  }

  sync() {
    return Promise.reject(new Error('sync method not implemented'))
  }
}

FileProxy.match = function(fileNode, context) { 
  return false
};

class DefaultFileProxy extends FileProxy {

  constructor(fileNode, context) {
    super(fileNode, context);

    
    this.file = fileNode.sourceFile;
    if (this.file) {
      this._fileUrl = URL.createObjectURL(this.file);
    }
    this.url = fileNode.url;
  }

  getUrl() {
    
    if (this.url) {
      return this.url
    }
    
    if (this._fileUrl) {
      return this._fileUrl
    }
    
    return ''
  }

  sync() {
    if (!this.url) {
      console.info('Simulating file upload. Creating blob url instead.', this._fileUrl);
      this.url = this._fileUrl;
    }
    return Promise.resolve()
  }
}

class NodeRegistry extends Registry {
  
  register(nodeClazz) {
    var type = nodeClazz.prototype.type;
    if ( typeof type !== 'string' || type === '' ) {
      throw new Error( 'Node names must be strings and must not be empty')
    }
    if (!( nodeClazz.prototype._isNode)) {
      throw new Error( 'Nodes must be subclasses of Substance.Data.Node' )
    }
    if (this.contains(type)) {
      
      console.info('Overriding node type', type);
      this.remove(type);
    }
    this.add(type, nodeClazz);
  }

}

class Schema {

  
  constructor(name, version) {
    
    this.name = name;
    
    this.version = version;
    
    this.nodeRegistry = new NodeRegistry();
    
    this.tocTypes = [];

    
    this.addNodes(this.getBuiltIns());
  }

  
  addNodes(nodes) {
    if (!nodes) return
    forEach(nodes, function(NodeClass) {
      if (!NodeClass.prototype._isNode) {
        console.error('Illegal node class: ', NodeClass);
      } else {
        this.addNode(NodeClass);
      }
    }.bind(this));
  }

  addNode(NodeClass) {
    this.nodeRegistry.register(NodeClass);
    if (NodeClass.tocType) {
      this.tocTypes.push(NodeClass.type);
    }
  }

  
  getNodeClass(name) {
    return this.nodeRegistry.get(name)
  }

  
  getBuiltIns() {
    return []
  }

  
  isInstanceOf(type, parentType) {
    var NodeClass = this.getNodeClass(type);
    if (NodeClass) {
      return Node.isInstanceOf(NodeClass, parentType)
    }
    return false
  }

  
  each() {
    this.nodeRegistry.each.apply(this.nodeRegistry, arguments);
  }

  
  getTocTypes() {
    return this.tocTypes
  }

  
  getDefaultTextType() {
    throw new Error('Schmema.prototype.getDefaultTextType() must be overridden.')
  }

  getNodeSchema(type) {
    var NodeClass = this.getNodeClass(type);
    if (!NodeClass) {
      console.error('Unknown node type ', type);
      return null
    }
    return NodeClass.schema
  }
}

class PropertyAnnotation extends AnnotationMixin(DocumentNode) {}

PropertyAnnotation.prototype._isAnnotation = true;
PropertyAnnotation.prototype._isPropertyAnnotation = true;

PropertyAnnotation.isPropertyAnnotation = true;
PropertyAnnotation.autoExpandRight = true;

PropertyAnnotation.schema = {
  type: "annotation",
  start: "coordinate",
  end: "coordinate",
  
  
  _content: { type: "string", optional: true}
};

class DocumentSchema extends Schema {

  constructor({ name, DocumentClass, defaultTextType='text', version='0.0.0' }) {
    super(name, version);

    
    if (!DocumentClass) {
      throw new Error('DocumentClass is mandatory')
    }

    this.DocumentClass = DocumentClass;
    this.defaultTextType = defaultTextType;
  }

  getDocumentClass() {
    return this.DocumentClass
  }

  
  getDefaultTextType() {
    return this.defaultTextType
  }

  
  getBuiltIns() {
    return [DocumentNode, PropertyAnnotation, Container, ContainerAnnotation]
  }

}

const ENTER = 1;
const EXIT = -1;
const ANCHOR = -2;






























class Fragmenter {

  constructor(options) {
    Object.assign(this, options);
  }

  start(rootContext, text, annotations) {
    if (!isString$1(text)) {
      throw new Error("Illegal argument: 'text' must be a String, but was " + text)
    }
    this._start(rootContext, text, annotations);
  }

  onText(context, text, entry) { 
  }

  
  onEnter(entry, parentContext) { 
    return null
  }

  onExit(entry, context, parentContext) { 
  }

  _enter(entry, parentContext) {
    entry.counter++;
    return this.onEnter(entry, parentContext)
  }

  _exit(entry, context, parentContext) {
    this.onExit(entry, context, parentContext);
  }

  _createText(context, text, entry) {
    this.onText(context, text, entry);
  }

  _start(rootContext, text, annotations) {
    var entries = _extractEntries.call(this, annotations);
    var stack = [{context: rootContext, entry: null}];

    var pos = 0;
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      var textFragment = text.substring(pos, entry.pos);
      if (textFragment) {
        
        this._createText(stack[stack.length-1].context, textFragment, entry);
      }

      pos = entry.pos;
      var stackLevel, idx, _entry;
      if (entry.mode === ENTER || entry.mode === ANCHOR) {
        
        for (stackLevel = 1; stackLevel < stack.length; stackLevel++) {
          if (entry.level < stack[stackLevel].entry.level) {
            break
          }
        }
        
        
        for (idx = stack.length-1; idx >= stackLevel; idx--) {
          _entry = stack[idx].entry;
          
          _entry.length = pos - _entry.pos;
          this._exit(_entry, stack[idx].context, stack[idx-1].context);
        }
        stack.splice(stackLevel, 0, {entry: entry});
        
        for (idx = stackLevel; idx < stack.length; idx++) {
          _entry = stack[idx].entry;
          
          _entry.pos = pos;
          stack[idx].context = this._enter(_entry, stack[idx-1].context);
        }
      }
      if (entry.mode === EXIT || entry.mode === ANCHOR) {
        
        for (stackLevel = 1; stackLevel < stack.length; stackLevel++) {
          if (stack[stackLevel].entry.node === entry.node) {
            break
          }
        }
        for (idx = stack.length-1; idx >= stackLevel; idx--) {
          _entry = stack[idx].entry;
          
          _entry.length = pos - _entry.pos;
          this._exit(_entry, stack[idx].context, stack[idx-1].context);
        }
        stack.splice(stackLevel, 1);
        
        for (idx = stackLevel; idx < stack.length; idx++) {
          _entry = stack[idx].entry;
          
          _entry.pos = pos;
          stack[idx].context = this._enter(_entry, stack[idx-1].context);
        }
      }
    }

    
    var trailingText = text.substring(pos);
    if (trailingText) {
      this._createText(rootContext, trailingText);
    }
  }

}

Fragmenter.SHOULD_NOT_SPLIT = 0;
Fragmenter.NORMAL = 10;
Fragmenter.ANY = 100;
Fragmenter.ALWAYS_ON_TOP = Number.MAX_VALUE;







































function _extractEntries(annotations) {
  var openers = [];
  var closers = [];
  forEach(annotations, function(a) {
    var isAnchor = (a.isAnchor ? a.isAnchor() : false);
    
    if (isAnchor) {
      openers.push({
        mode: ANCHOR,
        pos: a.offset,
        id: a.id,
        level: Fragmenter.ALWAYS_ON_TOP,
        type: 'anchor',
        node: a,
        counter: -1,
        length: 0
      });
    } else {
      
      
      
      
      
      
      

      
      var l = Fragmenter.NORMAL;
      var isInline = (a.isInline ? a.isInline() : false);
      if (isInline) {
        l = Number.MAX_VALUE;
      } else if (a.constructor.hasOwnProperty('fragmentation')) {
        l = a.constructor.fragmentation;
      } else if (a.hasOwnProperty('fragmentationHint')) {
        l = a.fragmentationHint;
      }
      var startOffset = Math.min(a.start.offset, a.end.offset);
      var endOffset = Math.max(a.start.offset, a.end.offset);
      var opener = {
        pos: startOffset,
        mode: ENTER,
        level: l,
        id: a.id,
        type: a.type,
        node: a,
        length: 0,
        counter: -1,
      };
      openers.push(opener);
      closers.push({
        pos: endOffset,
        mode: EXIT,
        level: l,
        id: a.id,
        type: a.type,
        node: a,
        opener: opener
      });
    }
  });

  
  openers.sort(_compareOpeners);
  
  for (var i = openers.length - 1; i >= 0; i--) {
    openers[i].idx = i;
  }
  closers.sort(_compareClosers);
  
  var entries = new Array(openers.length+closers.length);
  var idx = 0;
  var idx1 = 0;
  var idx2 = 0;
  var opener = openers[idx1];
  var closer = closers[idx2];
  while(opener || closer) {
    if (opener && closer) {
      
      if (closer.pos <= opener.pos && closer.opener !== opener) {
        entries[idx] = closer;
        idx2++;
      } else {
        entries[idx] = opener;
        idx1++;
      }
    } else if (opener) {
      entries[idx] = opener;
      idx1++;
    } else if (closer) {
      entries[idx] = closer;
      idx2++;
    }
    opener = openers[idx1];
    closer = closers[idx2];
    idx++;
  }
  return entries
}

function _compareOpeners(a, b) {
  if (a.pos < b.pos) return -1
  if (a.pos > b.pos) return 1
  if (a.mode < b.mode) return -1
  if (a.mode > b.mode) return 1
  if (a.mode === b.mode) {
    if (a.level < b.level) return -1
    if (a.level > b.level) return 1
  }
  return 0
}


function _compareClosers(a, b) {
  if (a.pos < b.pos) return -1
  if (a.pos > b.pos) return 1
  
  
  
  
  
  if (a.pos === a.opener.pos && b.pos === b.opener.pos) {
    if (a.opener.idx < b.opener.idx) {
      return -1
    } else {
      return 1
    }
  }
  if (a.opener.idx > b.opener.idx) return -1
  if (a.opener.idx < b.opener.idx) return 1
  return 0
}

class DOMExporter {

  constructor(config, context) {
    this.context = context || {};
    if (!config.converters) {
      throw new Error('config.converters is mandatory')
    }
    if (!config.converters._isRegistry) {
      this.converters = new Registry();
      config.converters.forEach(function(Converter) {
        let converter = isFunction$1(Converter) ? new Converter() : Converter;
        if (!converter.type) {
          console.error('Converter must provide the type of the associated node.', converter);
          return
        }
        this.converters.add(converter.type, converter);
      }.bind(this));
    } else {
      this.converters = config.converters;
    }

    this.state = {
      doc: null
    };
    this.config = config;
    
    
    this._elementFactory = config.elementFactory;
    if (!this._elementFactory) {
      throw new Error("'elementFactory' is mandatory")
    }
    this.$$ = this.createElement.bind(this);
  }

  exportDocument(doc) {
    
    
    
    
    return this.convertDocument(doc)
  }

  
  convertDocument(doc) { 
    throw new Error('This method is abstract')
  }

  convertContainer(container) {
    if (!container) {
      throw new Error('Illegal arguments: container is mandatory.')
    }
    const doc = container.getDocument();
    this.state.doc = doc;
    let elements = [];
    container.getContent().forEach((id) => {
      const node = doc.get(id);
      const nodeEl = this.convertNode(node);
      elements.push(nodeEl);
    });
    return elements
  }

  convertNode(node) {
    if (isString$1(node)) {
      
      node = this.state.doc.get(node);
    } else {
      this.state.doc = node.getDocument();
    }
    var converter = this.getNodeConverter(node);
    
    
    if (node.isPropertyAnnotation() && (!converter || !converter.export)) {
      return this._convertPropertyAnnotation(node)
    }
    if (!converter) {
      converter = this.getDefaultBlockConverter();
    }
    var el;
    if (converter.tagName) {
      el = this.$$(converter.tagName);
    } else {
      el = this.$$('div');
    }
    el.attr(this.config.idAttribute, node.id);
    if (converter.export) {
      el = converter.export(node, el, this) || el;
    } else {
      el = this.getDefaultBlockConverter().export(node, el, this) || el;
    }
    return el
  }

  convertProperty(doc, path, options) {
    this.initialize(doc, options);
    var wrapper = this.$$('div')
      .append(this.annotatedText(path));
    return wrapper.innerHTML
  }

  annotatedText(path) {
    var doc = this.state.doc;
    var text = doc.get(path);
    var annotations = doc.getIndex('annotations').get(path);
    return this._annotatedText(text, annotations)
  }

  getNodeConverter(node) {
    return this.converters.get(node.type)
  }

  getDefaultBlockConverter() {
    throw new Error('This method is abstract.')
  }

  getDefaultPropertyAnnotationConverter() {
    throw new Error('This method is abstract.')
  }

  getDocument() {
    return this.state.doc
  }

  createElement(str) {
    return this._elementFactory.createElement(str)
  }

  _annotatedText(text, annotations) {
    var self = this;

    var annotator = new Fragmenter();
    annotator.onText = function(context, text) {
      context.children.push(encodeXMLEntities(text));
    };
    annotator.onEnter = function(fragment) {
      var anno = fragment.node;
      return {
        annotation: anno,
        children: []
      }
    };
    annotator.onExit = function(fragment, context, parentContext) {
      var anno = context.annotation;
      var converter = self.getNodeConverter(anno);
      if (!converter) {
        converter = self.getDefaultPropertyAnnotationConverter();
      }
      var el;
      if (converter.tagName) {
        el = this.$$(converter.tagName);
      } else {
        el = this.$$('span');
      }
      el.attr(this.config.idAttribute, anno.id);
      el.append(context.children);
      if (converter.export) {
        el = converter.export(anno, el, self) || el;
      }
      parentContext.children.push(el);
    }.bind(this);
    var wrapper = { children: [] };
    annotator.start(wrapper, text, annotations);
    return wrapper.children
  }

  
  _convertPropertyAnnotation(anno) {
    
    var wrapper = this.$$('div').append(this.annotatedText(anno.path));
    var el = wrapper.find('['+this.config.idAttribute+'="'+anno.id+'"]');
    return el
  }

}

const WS_LEFT = /^\s+/g;


const WS_RIGHT = /\s+$/g;
const WS_ALL = /\s+/g;


const SPACE = " ";
const TABS_OR_NL = /[\t\n\r]+/g;

const INVISIBLE_CHARACTER = "\u200B";


class DOMImporter {

  constructor(config, context) {
    this.context = context || {};

    if (!config.schema) {
      throw new Error('"config.schema" is mandatory')
    }
    if (!config.converters) {
      throw new Error('"config.converters" is mandatory')
    }

    this.config = Object.assign({ idAttribute: 'id' }, config);
    this.schema = config.schema;
    this.converters = config.converters;
    this.state = null;

    this._defaultBlockConverter = null;
    this._allConverters = [];
    this._blockConverters = [];
    this._propertyAnnotationConverters = [];

    this.state = new DOMImporter.State();

    this._initialize();
  }

  
  _initialize() {
    const schema = this.schema;
    const defaultTextType = schema.getDefaultTextType();
    const converters = this.converters;
    for (let i = 0; i < converters.length; i++) {
      let converter;
      if (typeof converters[i] === 'function') {
        const Converter = converters[i];
        converter = new Converter();
      } else {
        converter = converters[i];
      }
      if (!converter.type) {
        throw new Error('Converter must provide the type of the associated node.')
      }
      if (!converter.matchElement && !converter.tagName) {
        throw new Error('Converter must provide a matchElement function or a tagName property.')
      }
      if (!converter.matchElement) {
        converter.matchElement = this._defaultElementMatcher.bind(converter);
      }
      const NodeClass = schema.getNodeClass(converter.type);
      if (!NodeClass) {
        throw new Error('No node type defined for converter')
      }
      if (!this._defaultBlockConverter && defaultTextType === converter.type) {
        this._defaultBlockConverter = converter;
      }
      this._allConverters.push(converter);
      
      if (NodeClass.prototype._isPropertyAnnotation) {
        this._propertyAnnotationConverters.push(converter);
      } else {
        this._blockConverters.push(converter);
      }
    }
    if (!this._defaultBlockConverter) {
      throw new Error(`No converter for defaultTextType ${defaultTextType}`)
    }
  }

  dispose() {
    if (this.state.doc) {
      this.state.doc.dispose();
    }
  }

  
  reset() {
    if (this.state.doc) {
      this.state.doc.dispose();
    }
    this.state.reset();
    this.state.doc = this._createDocument();
  }

  getDocument() {
    return this.state.doc
  }

  
  convertContainer(elements, containerId) {
    if (!this.state.doc) this.reset();
    const state = this.state;
    const iterator = new ArrayIterator(elements);
    const nodeIds = [];
    while(iterator.hasNext()) {
      const el = iterator.next();
      let node;
      const blockTypeConverter = this._getConverterForElement(el, 'block');
      if (blockTypeConverter) {
        state.pushContext(el.tagName, blockTypeConverter);
        let nodeData = this._createNodeData(el, blockTypeConverter.type);
        nodeData = blockTypeConverter.import(el, nodeData, this) || nodeData;
        node = this._createNode(nodeData);
        let context = state.popContext();
        context.annos.forEach((a) => {
          this._createNode(a);
        });
      } else if (el.isCommentNode()) {
        continue
      } else {
        
        if (el.isTextNode() && /^\s*$/.exec(el.textContent)) continue
        
        
        iterator.back();
        node = this._wrapInlineElementsIntoBlockElement(iterator);
      }
      if (node) {
        nodeIds.push(node.id);
      }
    }
    return this._createNode({
      type: 'container',
      id: containerId,
      nodes: nodeIds
    })
  }

  
  convertElement(el) {
    if (!this.state.doc) this.reset();
    let isTopLevel = !this.state.isConverting;
    if (isTopLevel) {
      this.state.isConverting = true;
    }

    let nodeData, annos;
    const converter = this._getConverterForElement(el);
    if (converter) {
      const NodeClass = this.schema.getNodeClass(converter.type);
      nodeData = this._createNodeData(el, converter.type);
      this.state.pushContext(el.tagName, converter);
      
      
      
      
      
      if (NodeClass.isInline) {
        nodeData = this._convertInlineNode(el, nodeData, converter);
      }
      else if (NodeClass.prototype._isPropertyAnnotation) {
        nodeData = this._convertPropertyAnnotation(el, nodeData);
      } else {
        nodeData = converter.import(el, nodeData, this) || nodeData;
      }
      let context = this.state.popContext();
      annos = context.annos;
    } else {
      throw new Error('No converter found for '+el.tagName)
    }
    
    const node = this._createNode(nodeData);
    
    annos.forEach((a) => {
      this._createNode(a);
    });

    
    
    if (this.config["stand-alone"] && isTopLevel) {
      this.state.isConverting = false;
      this.reset();
    }
    return node
  }

  
  annotatedText(el, path, options={}) {
    if (!path) {
      throw new Error('path is mandatory')
    }
    const state = this.state;
    const context = last$1(state.contexts);
    
    
    if (!context) {
      throw new Error('This should be called from within an element converter.')
    }
    
    const oldPreserveWhitespace = state.preserveWhitespace;
    if (options.preserveWhitespace) {
      state.preserveWhitespace = true;
    }
    state.stack.push({ path: path, offset: 0, text: "", annos: []});
    
    
    
    this.state.lastChar = '';
    const iterator = this.getChildNodeIterator(el);
    const text = this._annotatedText(iterator);
    
    
    const top = state.stack.pop();
    context.annos = context.annos.concat(top.annos);

    
    state.preserveWhitespace = oldPreserveWhitespace;

    return text
  }

  
  plainText(el) {
    var state = this.state;
    var text = el.textContent;
    if (state.stack.length > 0) {
      var context = last$1(state.stack);
      context.offset += text.length;
      context.text += context.text.concat(text);
    }
    return text
  }

  
  _customText(text) {
    var state = this.state;
    if (state.stack.length > 0) {
      var context = last$1(state.stack);
      context.offset += text.length;
      context.text += context.text.concat(text);
    }
    return text
  }

  
  nextId(prefix) {
    
    
    
    
    return this.state.uuid(prefix)
  }

  _getNextId(dom, type) {
    let id = this.nextId(type);
    while (this.state.ids[id] || dom.find('#'+id)) {
      id = this.nextId(type);
    }
    return id
  }

  _getIdForElement(el, type) {
    let id = el.getAttribute(this.config.idAttribute);
    if (id && !this.state.ids[id]) return id
    return this._getNextId(el.getOwnerDocument(), type)
  }


  
  
  _createDocument() {
    
    const schema = this.config.schema;
    const DocumentClass = schema.getDocumentClass();
    return new DocumentClass(schema)
  }

  _convertPropertyAnnotation(el, nodeData) {
    const path = [nodeData.id, '_content'];
    
    
    
    nodeData._content = this.annotatedText(el, path);
    nodeData.start = { path, offset: 0 };
    nodeData.end = { offset: nodeData._content.length };
    return nodeData
  }

  _convertInlineNode(el, nodeData, converter) {
    const path = [nodeData.id, '_content'];
    if (converter.import) {
      nodeData = converter.import(el, nodeData, this) || nodeData;
    }
    nodeData._content = '$';
    nodeData.start = { path, offset: 0 };
    nodeData.end = { offset: 1 };
    return nodeData
  }

  _createNodeData(el, type) {
    if (!type) {
      throw new Error('type is mandatory.')
    }
    let nodeData = {
      type,
      id: this._getIdForElement(el, type)
    };
    this.state.ids[nodeData.id] = true;
    return nodeData
  }

  _createNode(nodeData) {
    let doc = this.state.doc;
    
    
    
    let node = doc.get(nodeData.id);
    if (node) {
      
      doc.delete(node.id);
    }
    return doc.create(nodeData)
  }

  getChildNodeIterator(el) {
    return el.getChildNodeIterator()
  }

  _defaultElementMatcher(el) {
    return el.is(this.tagName)
  }

  
  _annotatedText(iterator) {
    const state = this.state;
    const context = last$1(state.stack);
    
    if (!context) {
      throw new Error('Illegal state: context is null.')
    }
    while(iterator.hasNext()) {
      var el = iterator.next();
      var text = "";
      
      
      if (el.isTextNode()) {
        text = this._prepareText(el.textContent);
        if (text.length) {
          
          
          context.text = context.text.concat(text);
          context.offset += text.length;
        }
      } else if (el.isCommentNode()) {
        
        continue
      } else if (el.isElementNode()) {
        const annoConverter = this._getConverterForElement(el, 'inline');
        
        if (!annoConverter) {
          
          if (!this.IGNORE_DEFAULT_WARNINGS) {
            console.warn('Unsupported inline element. We will not create an annotation for it, but process its children to extract annotated text.', el.outerHTML);
          }
          
          
          const iterator = this.getChildNodeIterator(el);
          this._annotatedText(iterator);
          continue
        }
        
        
        
        var startOffset = context.offset;
        const annoType = annoConverter.type;
        const AnnoClass = this.schema.getNodeClass(annoType);
        let annoData = this._createNodeData(el, annoType);
        
        let stackFrame = {
          path: context.path,
          offset: startOffset,
          text: "",
          annos: []
        };
        state.stack.push(stackFrame);
        
        if (annoConverter.import) {
          state.pushContext(el.tagName, annoConverter);
          annoData = annoConverter.import(el, annoData, this) || annoData;
          state.popContext();
        }
        
        
        
        
        if (AnnoClass.isInline) {
          this._customText(INVISIBLE_CHARACTER);
          
          
          
          state.lastChar = '';
        } else {
          
          
          
          const iterator = this.getChildNodeIterator(el);
          this._annotatedText(iterator);
        }
        
        state.stack.pop();
        context.offset = stackFrame.offset;
        context.text = context.text.concat(stackFrame.text);
        
        const endOffset = context.offset;
        annoData.start = {
          path: context.path.slice(0),
          offset: startOffset
        };
        annoData.end = {
          offset: endOffset
        };
        
        let parentFrame = last$1(state.stack);
        parentFrame.annos = parentFrame.annos.concat(stackFrame.annos, annoData);
      } else {
        console.warn('Unknown element type. Taking plain text.', el.outerHTML);
        text = this._prepareText(el.textContent);
        context.text = context.text.concat(text);
        context.offset += text.length;
      }
    }
    
    return context.text
  }

  _getConverterForElement(el, mode) {
    var converters;
    if (mode === "block") {
      if (!el.tagName) return null
      converters = this._blockConverters;
    } else if (mode === "inline") {
      converters = this._propertyAnnotationConverters;
    } else {
      converters = this._allConverters;
    }
    var converter = null;
    for (var i = 0; i < converters.length; i++) {
      if (this._converterCanBeApplied(converters[i], el)) {
        converter = converters[i];
        break
      }
    }
    return converter
  }

  _converterCanBeApplied(converter, el) {
    return converter.matchElement(el, this)
  }

  
  _wrapInlineElementsIntoBlockElement(childIterator) {
    if (!childIterator.hasNext()) return
    let dom = childIterator.peek().getOwnerDocument();
    let wrapper = dom.createElement('wrapper');
    while(childIterator.hasNext()) {
      const el = childIterator.next();
      
      const blockTypeConverter = this._getConverterForElement(el, 'block');
      if (blockTypeConverter) {
        childIterator.back();
        break
      }
      wrapper.append(el.clone());
    }
    const type = this.schema.getDefaultTextType();
    const id = this._getNextId(dom, type);
    const converter = this._defaultBlockConverter;
    let nodeData = { type, id };
    this.state.pushContext('wrapper', converter);
    nodeData = converter.import(wrapper, nodeData, this) || nodeData;
    let context = this.state.popContext();
    let annos = context.annos;
    
    const node = this._createNode(nodeData);
    
    annos.forEach((a) => {
      this._createNode(a);
    });
    return node
  }

  
  
  
  
  _prepareText(text) {
    const state = this.state;
    if (state.preserveWhitespace) {
      return text
    }
    var repl = SPACE;
    
    text = text.replace(TABS_OR_NL, '');
    
    
    
    
    
    if (state.lastChar === SPACE) {
      
      text = text.replace(WS_LEFT, '');
    } else {
      text = text.replace(WS_LEFT, repl);
    }
    text = text.replace(WS_RIGHT, repl);
    
    
    
    if (this.config.REMOVE_INNER_WS || state.removeInnerWhitespace) {
      text = text.replace(WS_ALL, SPACE);
    }
    state.lastChar = text[text.length-1] || state.lastChar;
    return text
  }

  
  _trimTextContent(el) {
    var nodes = el.getChildNodes();
    var firstNode = nodes[0];
    var lastNode = last$1(nodes);
    var text, trimmed;
      
    if (firstNode && firstNode.isTextNode()) {
      text = firstNode.textContent;
      trimmed = this._trimLeft(text);
      firstNode.textContent = trimmed;
    }
    if (lastNode && lastNode.isTextNode()) {
      text = lastNode.textContent;
      trimmed = this._trimRight(text);
      lastNode.textContent = trimmed;
    }
    return el
  }

  _trimLeft(text) {
    return text.replace(WS_LEFT, "")
  }

  _trimRight(text) {
    return text.replace(WS_RIGHT, "")
  }

}

class DOMImporterState {

  constructor() {
    this.reset();
  }

  reset() {
    this.preserveWhitespace = false;
    this.nodes = [];
    this.annotations = [];
    this.containerId = null;
    this.container = [];
    this.ids = {};
    
    this.contexts = [];
    
    this.stack = [];
    this.lastChar = "";
    this.skipTypes = {};
    this.ignoreAnnotations = false;
    this.isConverting = false;

    
    
    this.uuid = createCountingIdGenerator();
  }

  pushContext(tagName, converter) {
    this.contexts.push({ tagName: tagName, converter: converter, annos: []});
  }

  popContext() {
    return this.contexts.pop()
  }

  getCurrentContext() {
    return last$1(this.contexts)
  }

}

DOMImporter.State = DOMImporterState;

DOMImporter.INVISIBLE_CHARACTER = INVISIBLE_CHARACTER;

class EditingBehavior {

  constructor() {
    this._merge = {};
    this._mergeComponents = {};
    this._break = {};
  }

  defineMerge(firstType, secondType, impl) {
    if (!this._merge[firstType]) {
      this._merge[firstType] = {};
    }
    this._merge[firstType][secondType] = impl;
    return this
  }

  canMerge(firstType, secondType) {
    return (this._merge[firstType] && this._merge[firstType][secondType])
  }

  getMerger(firstType, secondType) {
    return this._merge[firstType][secondType]
  }

  defineComponentMerge(nodeType, impl) {
    this._mergeComponents[nodeType] = impl;
  }

  canMergeComponents(nodeType) {
    return this._mergeComponents[nodeType]
  }

  getComponentMerger(nodeType) {
    return this._mergeComponents[nodeType]
  }

  defineBreak(nodeType, impl) {
    this._break[nodeType] = impl;
    return this
  }

  canBreak(nodeType) {
    return this._break[nodeType]
  }

  getBreaker(nodeType) {
    return this._break[nodeType]
  }

}

class FileNode extends DocumentNode {

  constructor(...args) {
    super(...args);
  }

  getUrl() {
    if (this.proxy) {
      return this.proxy.getUrl()
    } else {
      
      console.warn('No file proxy attached to ', this.id);
      return ''
    }
  }

  setProxy(proxy) {
    this.proxy = proxy;
  }
}

FileNode.type = 'file';

FileNode.schema = {
  url: { type: 'string', optional: true },
  fileType: { type: 'string', optional: true },
  mimeType: { type: 'string', optional: true },
  sourceFile: { type: 'object', optional: true }
};

FileNode.prototype._isFileNode = true;
FileNode._isFileNode = true;

class DOMEventListener {

  constructor(eventName, handler, options) {
    
    if (!isString$1(eventName) || !isFunction$1(handler)) {
      throw new Error("Illegal arguments: 'eventName' must be a String, and 'handler' must be a Function.")
    }
    options = options || {};
    var origHandler = handler;
    var context = options.context;
    var capture = Boolean(options.capture);

    if (context) {
      handler = handler.bind(context);
    }
    if (options.once === true) {
      handler = _once(this, handler);
    }

    this.eventName = eventName;
    this.originalHandler = origHandler;
    this.handler = handler;
    this.capture = capture;
    this.context = context;
    this.options = options;
    
    this._el = null;
  }

}

DOMEventListener.prototype._isDOMEventListener = true;

DOMEventListener.findIndex = function(eventListeners, eventName, handler) {
  var idx = -1;
  if (arguments[1]._isDOMEventListener) {
    idx = eventListeners.indexOf(arguments[1]);
  } else {
    idx = findIndex$1(eventListeners,
      _matches.bind(null, {
        eventName: eventName,
        originalHandler: handler
      })
    );
  }
  return idx
};

function _matches(l1, l2) {
  return l1.eventName === l2.eventName && l1.originalHandler === l2.originalHandler
}

function _once(listener, handler) {
  return function(event) {
    handler(event);
    listener._el.removeEventListener(listener);
  }
}

const NOT_IMPLEMENTED = 'This method is not implemented.';


class DOMElement {

  

  

  

  

  

  

  

  

  

  
  getNativeElement() {
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  isTextNode() {
    
    return false
  }

  
  isElementNode() {
    
    return false
  }

  
  isCommentNode() {
    
    return false
  }

  
  isDocumentNode() {
    
    return false
  }

  
  getTagName() {
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  setTagName(tagName) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  getId() {
    return this.getAttribute('id')
  }

  
  setId(id) {
    this.setAttribute('id', id);
  }

  
  hasClass(className) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  addClass(classString) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  removeClass(classString) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  hasAttribute(name) {
    return Boolean(this.getAttribute(name))
  }

  
  attr() {
    if (arguments.length === 1) {
      if (isString$1(arguments[0])) {
        return this.getAttribute(arguments[0])
      } else if (isObject$1(arguments[0])) {
        forEach(arguments[0], function(value, name) {
          this.setAttribute(name, value);
        }.bind(this));
      }
    } else if (arguments.length === 2) {
      this.setAttribute(arguments[0], arguments[1]);
    }
    return this
  }

  
  removeAttr(name) {
    var names = name.split(/\s+/);
    if (names.length === 1) {
      this.removeAttribute(name);
    } else {
      names.forEach(function(name) {
        this.removeAttribute(name);
      }.bind(this));
    }
    return this
  }

  
  getAttribute(name) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  setAttribute(name, value) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  removeAttribute(name) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  getAttributes() {
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  htmlProp() {
    if (arguments.length === 1) {
      if (isString$1(arguments[0])) {
        return this.getProperty(arguments[0])
      } else if (isObject$1(arguments[0])) {
        forEach(arguments[0], function(value, name) {
          this.setProperty(name, value);
        }.bind(this));
      }
    } else if (arguments.length === 2) {
      this.setProperty(arguments[0], arguments[1]);
    }
    return this
  }

  getProperty(name) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  setProperty(name, value) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  val(value) {
    if (arguments.length === 0) {
      return this.getValue()
    } else {
      this.setValue(value);
      return this
    }
  }

  getValue() {
    return this.getProperty('value')
  }

  setValue(value) {
    this.setProperty('value', value);
    return this
  }

  
  css() {
    
    if (arguments.length === 1) {
      
      if (isString$1(arguments[0])) {
        return this.getStyle(arguments[0])
      } else if (isObject$1(arguments[0])) {
        forEach(arguments[0], function(value, name) {
          this.setStyle(name, value);
        }.bind(this));
      } else {
        throw new Error('Illegal arguments.')
      }
    } else if (arguments.length === 2) {
      this.setStyle(arguments[0], arguments[1]);
    } else {
      throw new Error('Illegal arguments.')
    }
    return this
  }

  getStyle(name) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  setStyle(name, value) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  text(text) {
    if (arguments.length === 0) {
      return this.getTextContent()
    } else {
      this.setTextContent(text);
    }
    return this
  }

  
  getTextContent() {
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  setTextContent(text) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  html(html) {
    if (arguments.length === 0) {
      return this.getInnerHTML()
    } else {
      this.setInnerHTML(html);
    }
    return this
  }

  
  getInnerHTML() {
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  setInnerHTML(html) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  getOuterHTML() {
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  on(eventName, handler, context, options) {
    
    if (!isString$1(eventName)) {
      throw new Error('Illegal argument: "event" must be a String.')
    }
    options = options || {};
    if (context) {
      options.context = context;
    }
    
    if (!handler || !isFunction$1(handler)) {
      throw new Error('Illegal argument: invalid handler function for event ' + eventName)
    }
    this.addEventListener(eventName, handler, options);
    return this
  }

  
  off(eventName, handler) {
    
    if (arguments.length === 1 && !isString$1(eventName)) {
      let context = arguments[0];
      this.getEventListeners().filter(function(l) {
        return l.context === context
      }).forEach(function(l) {
        this.removeEventListener(l);
      }.bind(this));
    } else {
      this.removeEventListener(eventName, handler);
    }
    return this
  }

  addEventListener(eventName, handler, options = {}) {
    let listener;
    if (arguments.length === 1 && arguments[0]) {
      listener = arguments[0];
    } else {
      listener = this._createEventListener(eventName, handler, options);
    }
    if (!this.eventListeners) {
      this.eventListeners = [];
    }
    listener._el = this;
    this.eventListeners.push(listener);
    this._addEventListenerNative(listener);
    return this
  }

  _createEventListener(eventName, handler, options) {
    return new DOMEventListener(eventName, handler, options)
  }

  _addEventListenerNative(listener) {} 

  removeEventListener(eventName, handler) {
    if (!this.eventListeners) return
    
    let listener = null, idx = -1;
    idx = DOMEventListener.findIndex(this.eventListeners, eventName, handler);
    listener = this.eventListeners[idx];
    if (idx > -1) {
      this.eventListeners.splice(idx, 1);
      
      listener._el = null;
      this._removeEventListenerNative(listener);
    }
    return this
  }

  _removeEventListenerNative(listener) {} 

  removeAllEventListeners() {
    if (!this.eventListeners) return
    for (let i = 0; i < this.eventListeners.length; i++) {
      let listener = this.eventListeners[i];
      
      listener._el = null;
      this._removeEventListenerNative(listener);
    }
    delete this.eventListeners;
  }

  getEventListeners() {
    return this.eventListeners || []
  }

  
  getNodeType() {
    
    throw new Error(NOT_IMPLEMENTED)
  }

  getContentType() {
    
    throw new Error(NOT_IMPLEMENTED)
  }

  getChildCount() {
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  getChildNodes() {
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  getChildren() {
    
    throw new Error(NOT_IMPLEMENTED)
  }

  getChildAt(pos) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  getChildIndex(child) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  getChildNodeIterator() {
    return new ArrayIterator(this.getChildNodes())
  }

  getLastChild() {
    
    throw new Error(NOT_IMPLEMENTED)
  }

  getFirstChild() {
    
    throw new Error(NOT_IMPLEMENTED)
  }

  getNextSibling() {
    
    throw new Error(NOT_IMPLEMENTED)
  }

  getPreviousSibling() {
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  clone(deep) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  createElement(str) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  createTextNode(text) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  createComment(data) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  createProcessingInstruction(name, data) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  createCDATASection(data) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  is(cssSelector) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  getParent() {
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  getOwnerDocument() {
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  getDoctype() {
    
    throw new Error('NOT_IMPLEMENTED')
  }

  setDocType(qualifiedNameStr, publicId, systemId) { 
    throw new Error('NOT_IMPLEMENTED')
  }

  
  find(cssSelector) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  findAll(cssSelector) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  append(child) {
    var children;
    if (arguments.length === 1) {
      if (isArray$1(child)) {
        children = child;
      } else {
        this.appendChild(child);
        return this
      }
    } else {
      children = arguments;
    }
    if (children) {
      Array.prototype.forEach.call(children, this.appendChild.bind(this));
    }
    return this
  }

  appendChild(child) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  insertAt(pos, child) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  insertBefore(newChild, before) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  removeAt(pos) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  removeChild(child) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  replaceChild(oldChild, newChild) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  
  remove() {
    var parent = this.getParent();
    if (parent) {
      parent.removeChild(this);
    }
  }

  
  empty() {
    
    throw new Error(NOT_IMPLEMENTED)
  }

  serialize() {
    return this.getOuterHTML()
  }

  isInDocument() {
    let el = this;
    while(el) {
      if (el.isDocumentNode()) {
        return true
      }
      el = el.getParent();
    }
  }

  
  focus() {
    
    return this
  }

  
  select() {
    
    return this
  }

  
  blur() {
    
    return this
  }

  
  click() {
    
    return this
  }

  

  getWidth() {
    
    return 0
  }

  getHeight() {
    
    return 0
  }

  
  getOuterHeight(withMargin) { 
    
    return 0
  }

  
  getOffset() {
    
    return { top: 0, left: 0 }
  }

  
  getPosition() {
    
    return { top: 0, left: 0 }
  }

  
  getElementFactory() {
    return this.createElement.bind(this)
  }

  
  emit(name, data) { 
    
    throw new Error(NOT_IMPLEMENTED)
  }

  

  get id() {
    return this.getId()
  }

  set id(id) {
    this.setId(id);
  }

  get tagName() {
    return this.getTagName()
  }

  set tagName(tagName) {
    this.setTagName(tagName);
  }

  get nodeName() {
    return this.getTagName()
  }

  get nodeType() {
    return this.getNodeType()
  }

  get className() {
    return this.getAttribute('class')
  }

  set className(className) {
    this.setAttribute('class', className);
  }

  get textContent() {
    return this.getTextContent()
  }

  set textContent(text) {
    this.setTextContent(text);
  }

  get innerHTML() {
    return this.getInnerHTML()
  }

  set innerHTML(html) {
    this.setInnerHTML(html);
  }

  get outerHTML() {
    return this.getOuterHTML()
  }

  get firstChild() {
    return this.getFirstChild()
  }

  get lastChild() {
    return this.getLastChild()
  }

  get nextSibling() {
    return this.getNextSibling()
  }

  get previousSibling() {
    return this.getPreviousSibling()
  }

  get parentNode() {
    return this.getParent()
  }

  get height() {
    return this.getHeight()
  }

  get width() {
    return this.getWidth()
  }

  get value() {
    return this.getValue()
  }

  set value(value) {
    return this.setValue(value)
  }
}

DOMElement.prototype._isDOMElement = true;

DOMElement.pxStyles = {
  top: true,
  bottom: true,
  left: true,
  right: true,
  height: true,
  width: true
};

DOMElement.EMPTY_HTML = '<html><head></head><body></body></html>';

const SIGNATURE = uuid('_BrowserDOMElement');

function _attach(nativeEl, browserDOMElement) {
  nativeEl[SIGNATURE] = browserDOMElement;
}

function _detach(nativeEl) {
  delete nativeEl[SIGNATURE];
}

function _unwrap(nativeEl) {
  return nativeEl[SIGNATURE]
}

class BrowserDOMElement extends DOMElement {

  constructor(el) {
    super();
    console.assert(el instanceof window.Node, "Expecting native DOM node.");
    this.el = el;
    
    
    _attach(el, this);
  }

  getNativeElement() {
    return this.el
  }

  getNodeType() {
    switch(this.el.nodeType) {
      case window.Node.TEXT_NODE:
        return "text"
      case window.Node.ELEMENT_NODE:
        return 'element'
      case window.Node.DOCUMENT_NODE:
        return 'document'
      case window.Node.COMMENT_NODE:
        return 'comment'
      case window.Node.PROCESSING_INSTRUCTION_NODE:
        return 'directive'
      case window.Node.CDATA_SECTION_NODE:
        return 'cdata'
      default:
        
    }
  }

  getDoctype() {
    if (this.isDocumentNode()) {
      return this.el.doctype
    } else {
      return this.getOwnerDocument().getDoctype()
    }
  }

  setDocType(qualifiedNameStr, publicId, systemId) {
    let ownerDocument = this._getNativeOwnerDocument();
    let oldDocType = ownerDocument.doctype;
    let newDocType = ownerDocument.implementation.createDocumentType(
     qualifiedNameStr, publicId, systemId
    );
    if (oldDocType) {
      oldDocType.parentNode.replaceChild(newDocType, oldDocType);
    } else {
      ownerDocument.appendChild(newDocType);
    }
  }

  isTextNode() {
    return (this.el.nodeType === window.Node.TEXT_NODE)
  }

  isElementNode() {
    return (this.el.nodeType === window.Node.ELEMENT_NODE)
  }

  isCommentNode() {
    return (this.el.nodeType === window.Node.COMMENT_NODE)
  }

  isDocumentNode() {
    return (this.el.nodeType === window.Node.DOCUMENT_NODE)
  }

  hasClass(className) {
    return this.el.classList.contains(className)
  }

  addClass(className) {
    this.el.classList.add(className);
    return this
  }

  removeClass(className) {
    this.el.classList.remove(className);
    return this
  }

  getAttribute(name) {
    return this.el.getAttribute(name)
  }

  setAttribute(name, value) {
    this.el.setAttribute(name, String(value));
    return this
  }

  removeAttribute(name) {
    this.el.removeAttribute(name);
    return this
  }

  getAttributes() {
    if (!this.el.attributes._mapAdapter) {
      this.el.attributes._mapAdapter = new AttributesMapAdapter(this.el.attributes);
    }
    return this.el.attributes._mapAdapter
  }

  getProperty(name) {
    return this.el[name]
  }

  setProperty(name, value) {
    
    
    if (this._isXML()) throw new Error('setProperty() is only supported for HTML elements.')
    if (!this._changedProperties) this._changedProperties = new Set();
    
    
    if (value === undefined) {
      this._changedProperties.delete(name);
    } else {
      this._changedProperties.add(name);
    }
    this.el[name] = value;
    return this
  }

  getTagName() {
    
    
    if (this._isXML()) {
      return this.el.tagName
    } else if (this.el.tagName) {
      return this.el.tagName.toLowerCase()
    }
  }

  setTagName(tagName) {
    let newEl = this.createElement(tagName);
    let attributes = this.el.attributes;
    let l = attributes.length;
    let i;
    for(i = 0; i < l; i++) {
      let attr = attributes.item(i);
      newEl.setAttribute(attr.name, attr.value);
    }
    
    
    
    
    
    
    if (this.eventListeners) {
      this.eventListeners.forEach(function(listener) {
        newEl.addEventListener(listener.eventName, listener.handler, listener.capture);
      });
    }
    newEl.append(this.getChildNodes());

    this._replaceNativeEl(newEl.getNativeElement());
    return this
  }

  getId() {
    return this.el.id
  }

  setId(id) {
    this.el.id = id;
    return this
  }

  getStyle(name) {
    
    let style = this.getComputedStyle();
    return style[name] || this.el.style[name]
  }

  getComputedStyle() {
    return window.getComputedStyle(this.el)
  }

  setStyle(name, value) {
    if (DOMElement.pxStyles[name] && isNumber(value)) value = value + 'px';
    this.el.style[name] = value;
    return this
  }

  getTextContent() {
    return this.el.textContent
  }

  setTextContent(text) {
    this.el.textContent = text;
    return this
  }

  getInnerHTML() {
    if (this._isXML()) {
      let xs = new window.XMLSerializer();
      let result = Array.prototype.map.call(this.el.childNodes, c => xs.serializeToString(c));
      return result.join('')
    } else {
      return this.el.innerHTML
    }
  }

  setInnerHTML(html) {
    
    
    this.el.innerHTML = html;
    return this
  }

  getOuterHTML() {
    
    
    if (this._isXML()) {
      let xs = new window.XMLSerializer();
      return xs.serializeToString(this.el)
    } else {
      return this.el.outerHTML
    }
  }

  _addEventListenerNative(listener) {
    this.el.addEventListener(listener.eventName, listener.handler, listener.capture);
  }

  _removeEventListenerNative(listener) {
    this.el.removeEventListener(listener.eventName, listener.handler);
  }

  getEventListeners() {
    return this.eventListeners || []
  }

  getChildCount() {
    return this.el.childNodes.length
  }

  getChildNodes() {
    let childNodes = [];
    for (let node = this.el.firstChild; node; node = node.nextSibling) {
      childNodes.push(BrowserDOMElement.wrap(node));
    }
    return childNodes
  }

  get childNodes() {
    return this.getChildNodes()
  }

  getChildren() {
    
    
    let children = [];
    for (let node = this.el.firstChild; node; node = node.nextSibling) {
      if (node.nodeType === window.Node.ELEMENT_NODE) {
        children.push(BrowserDOMElement.wrap(node));
      }
    }
    return children
  }

  get children() {
    return this.getChildren()
  }

  getChildAt(pos) {
    return BrowserDOMElement.wrap(this.el.childNodes[pos])
  }

  getChildIndex(child) {
    
    if (!child._isBrowserDOMElement) {
      throw new Error('Expecting a BrowserDOMElement instance.')
    }
    return Array.prototype.indexOf.call(this.el.childNodes, child.el)
  }

  getFirstChild() {
    let firstChild = this.el.firstChild;
    
    if (firstChild) {
      return BrowserDOMElement.wrap(firstChild)
    } else {
      return null
    }
  }

  getLastChild() {
    var lastChild = this.el.lastChild;
    
    if (lastChild) {
      return BrowserDOMElement.wrap(lastChild)
    } else {
      return null
    }
  }

  getNextSibling() {
    let next = this.el.nextSibling;
    
    if (next) {
      return BrowserDOMElement.wrap(next)
    } else {
      return null
    }
  }

  getPreviousSibling() {
    let previous = this.el.previousSibling;
    
    if (previous) {
      return BrowserDOMElement.wrap(previous)
    } else {
      return null
    }
  }

  clone(deep) {
    let clone$$1 = this.el.cloneNode(deep);
    return BrowserDOMElement.wrap(clone$$1)
  }

  createDocument(format) {
    return BrowserDOMElement.createDocument(format)
  }

  createElement(tagName) {
    let doc = this._getNativeOwnerDocument();
    let el = doc.createElement(tagName);
    return BrowserDOMElement.wrap(el)
  }

  createTextNode(text) {
    let doc = this._getNativeOwnerDocument();
    let el = doc.createTextNode(text);
    return BrowserDOMElement.wrap(el)
  }

  createComment(data) {
    let doc = this._getNativeOwnerDocument();
    let el = doc.createComment(data);
    return BrowserDOMElement.wrap(el)
  }

  createProcessingInstruction(name, data) {
    let doc = this._getNativeOwnerDocument();
    let el = doc.createProcessingInstruction(name, data);
    return BrowserDOMElement.wrap(el)
  }

  createCDATASection(data) {
    let doc = this._getNativeOwnerDocument();
    let el = doc.createCDATASection(data);
    return BrowserDOMElement.wrap(el)
  }

  is(cssSelector) {
    
    
    let el = this.el;
    
    if (this.isElementNode()) {
      return matches(el, cssSelector)
    } else {
      return false
    }
  }

  getParent() {
    let parent = this.el.parentNode;
    
    if (parent) {
      return BrowserDOMElement.wrap(parent)
    } else {
      return null
    }
  }

  getOwnerDocument() {
    return BrowserDOMElement.wrap(this._getNativeOwnerDocument())
  }

  get ownerDocument() {
    return this.getOwnerDocument()
  }

  _getNativeOwnerDocument() {
    return (this.isDocumentNode() ? this.el : this.el.ownerDocument)
  }

  find(cssSelector) {
    let result = null;
    if (this.el.querySelector) {
      result = this.el.querySelector(cssSelector);
    }
    if (result) {
      return BrowserDOMElement.wrap(result)
    } else {
      return null
    }
  }

  findAll(cssSelector) {
    let result = [];
    if (this.el.querySelectorAll) {
      result = this.el.querySelectorAll(cssSelector);
    }
    return Array.prototype.map.call(result, function(el) {
      return BrowserDOMElement.wrap(el)
    })
  }

  _normalizeChild(child) {
    if (isNil(child)) return child

    if (child instanceof window.Node) {
      child = BrowserDOMElement.wrap(child);
    }
    
    
    
    else if (child._isBrowserDOMElement && ! (child instanceof BrowserDOMElement)) {
      child = BrowserDOMElement.wrap(child);
    } else if (isString$1(child) || isNumber(child)) {
      child = this.createTextNode(child);
    }
    
    if (!child || !child._isBrowserDOMElement) {
      throw new Error('Illegal child type.')
    }
    console.assert(_unwrap(child.el) === child, "The backlink to the wrapper should be consistent");
    return child.getNativeElement()
  }

  appendChild(child) {
    let nativeChild = this._normalizeChild(child);
    if (nativeChild) {
      this.el.appendChild(nativeChild);
    }
    return this
  }

  insertAt(pos, child) {
    let nativeChild = this._normalizeChild(child);
    let childNodes = this.el.childNodes;
    if (pos >= childNodes.length) {
      this.el.appendChild(nativeChild);
    } else {
      this.el.insertBefore(nativeChild, childNodes[pos]);
    }
    return this
  }

  insertBefore(child, before) {
    
    if (isNil(before)) {
      return this.appendChild(child)
    }
    if (!before._isBrowserDOMElement) {
      throw new Error('insertBefore(): Illegal arguments. "before" must be a BrowserDOMElement instance.')
    }
    var nativeChild = this._normalizeChild(child);
    if (nativeChild) {
      this.el.insertBefore(nativeChild, before.el);
    }
    return this
  }

  removeAt(pos) {
    this.el.removeChild(this.el.childNodes[pos]);
    return this;
  }

  removeChild(child) {
    
    if (!child || !child._isBrowserDOMElement) {
      throw new Error('removeChild(): Illegal arguments. Expecting a BrowserDOMElement instance.')
    }
    this.el.removeChild(child.el);
    return this
  }

  replaceChild(oldChild, newChild) {
    
    if (!newChild || !oldChild ||
        !newChild._isBrowserDOMElement || !oldChild._isBrowserDOMElement) {
      throw new Error('replaceChild(): Illegal arguments. Expecting BrowserDOMElement instances.')
    }
    
    this.el.replaceChild(newChild.el, oldChild.el);
    return this
  }

  empty() {
    let el = this.el;
    while (el.lastChild) {
      el.removeChild(el.lastChild);
    }
    return this
  }

  remove() {
    if (this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
    return this
  }

  serialize() {
    let outerHTML = this.el.outerHTML;
    if (isString$1(outerHTML)) {
      return outerHTML
    } else {
      let xs = new window.XMLSerializer();
      return xs.serializeToString(this.el)
    }
  }

  isInDocument() {
    let el = this.el;
    while(el) {
      if (el.nodeType === window.Node.DOCUMENT_NODE) {
        return true
      }
      el = el.parentNode;
    }
  }

  _replaceNativeEl(newEl) {
    console.assert(newEl instanceof window.Node, "Expecting a native element.");
    let oldEl = this.el;
    let parentNode = oldEl.parentNode;
    if (parentNode) {
      parentNode.replaceChild(newEl, oldEl);
    }
    this.el = newEl;
    _detach(oldEl);
    _attach(newEl, this);
  }

  _getChildNodeCount() {
    return this.el.childNodes.length
  }

  focus() {
    this.el.focus();
    return this
  }

  select() {
    this.el.select();
    return this
  }


  blur() {
    this.el.focus();
    return this
  }

  click() {
    this.el.click();
    return this
  }

  getWidth() {
    let rect = this.el.getClientRects()[0];
    if (rect) {
      return rect.width
    } else {
      return 0
    }
  }

  getHeight() {
    let rect = this.el.getClientRects()[0];
    if (rect) {
      return rect.height
    } else {
      return 0
    }
  }

  getOffset() {
    let rect = this.el.getBoundingClientRect();
    return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft
    }
  }

  getPosition() {
    return {left: this.el.offsetLeft, top: this.el.offsetTop}
  }

  getOuterHeight(withMargin) {
    let outerHeight = this.el.offsetHeight;
    if (withMargin) {
      let style = this.getComputedStyle();
      outerHeight += parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);
    }
    return outerHeight
  }

  getContentType() {
    return this._getNativeOwnerDocument().contentType
  }

  _isXML() {
    return this.getContentType() === 'application/xml'
  }

  emit(name, data) {
    let event;
    if (data) {
      event = new window.CustomEvent(name, { detail: data });
    } else {
      event = new window.Event(name);
    }
    this.el.dispatchEvent(event);
  }
}

BrowserDOMElement.prototype._isBrowserDOMElement = true;


BrowserDOMElement.createDocument = function(format) {
  let doc;
  if (format === 'xml') {
    
    doc = window.document.implementation.createDocument(null, 'dummy');
    
    doc.removeChild(doc.firstChild);
  } else {
    doc = (new window.DOMParser()).parseFromString(DOMElement.EMPTY_HTML, 'text/html');
  }
  return BrowserDOMElement.wrap(doc)
};

BrowserDOMElement.parseMarkup = function(str, format, options={}) {
  if (!str) {
    return BrowserDOMElement.createDocument(format)
  }
  if (options.snippet) {
    str = `<div id='__snippet__'>${str}</div>`;
  }
  let doc;
  let parser = new window.DOMParser();
  if (format === 'html') {
    doc = BrowserDOMElement.wrap(
      _check(
        parser.parseFromString(str, 'text/html')
      )
    );
  } else if (format === 'xml') {
    doc = BrowserDOMElement.wrap(
      _check(
        parser.parseFromString(str, 'application/xml')
      )
    );
  }
  if (options.snippet) {
    let childNodes = doc.find('#__snippet__').childNodes;
    if (childNodes.length === 1) {
      return childNodes[0]
    } else {
      return childNodes
    }
  } else {
    return doc
  }

  function _check(doc) {
    if (doc) {
      let parserError = doc.querySelector('parsererror');
      if (parserError) {
        throw new Error("ParserError: " + parserError)
      }
    }
    return doc
  }
};

BrowserDOMElement.wrap =
BrowserDOMElement.wrapNativeElement = function(el) {
  if (el) {
    let _el = _unwrap(el);
    if (_el) {
      return _el
    } else if (el instanceof window.Node) {
      return new BrowserDOMElement(el)
    } else if (el._isBrowserDOMElement) {
      return new BrowserDOMElement(el.getNativeElement())
    } else if (el === window) {
      return BrowserDOMElement.getBrowserWindow()
    }
  } else {
    return null
  }
};

BrowserDOMElement.unwrap = function(nativeEl) {
  return _unwrap(nativeEl)
};


class BrowserWindow {

  constructor() {
    
    this.el = window;
    window.__BrowserDOMElementWrapper__ = this;
  }

}

BrowserWindow.prototype.on = BrowserDOMElement.prototype.on;
BrowserWindow.prototype.off = BrowserDOMElement.prototype.off;
BrowserWindow.prototype.addEventListener = BrowserDOMElement.prototype.addEventListener;
BrowserWindow.prototype.removeEventListener = BrowserDOMElement.prototype.removeEventListener;
BrowserWindow.prototype._createEventListener = BrowserDOMElement.prototype._createEventListener;
BrowserWindow.prototype._addEventListenerNative = BrowserDOMElement.prototype._addEventListenerNative;
BrowserWindow.prototype._removeEventListenerNative = BrowserDOMElement.prototype._removeEventListenerNative;

BrowserWindow.prototype.getEventListeners = BrowserDOMElement.prototype.getEventListeners;

BrowserDOMElement.getBrowserWindow = function() {
  if (window[SIGNATURE]) return window[SIGNATURE]
  return new BrowserWindow(window)
};

BrowserDOMElement.isReverse = function(anchorNode, anchorOffset, focusNode, focusOffset) {
  
  
  if (focusNode && anchorNode) {
    if (!BrowserDOMElement.isReverse._r1) {
      BrowserDOMElement.isReverse._r1 = window.document.createRange();
      BrowserDOMElement.isReverse._r2 = window.document.createRange();
    }
    const _r1 = BrowserDOMElement.isReverse._r1;
    const _r2 = BrowserDOMElement.isReverse._r2;
    _r1.setStart(anchorNode.getNativeElement(), anchorOffset);
    _r2.setStart(focusNode.getNativeElement(), focusOffset);
    let cmp = _r1.compareBoundaryPoints(window.Range.START_TO_START, _r2);
    if (cmp === 1) {
      return true
    }
  }
  return false
};

BrowserDOMElement.getWindowSelection = function() {
  let nativeSel = window.getSelection();
  let result = {
    anchorNode: BrowserDOMElement.wrap(nativeSel.anchorNode),
    anchorOffset: nativeSel.anchorOffset,
    focusNode: BrowserDOMElement.wrap(nativeSel.focusNode),
    focusOffset: nativeSel.focusOffset
  };
  return result
};


function matches(el, selector) {
  let elProto = window.Element.prototype;
  let _matches = (
    elProto.matches || elProto.matchesSelector ||
    elProto.msMatchesSelector || elProto.webkitMatchesSelector
  );
  return _matches.call(el, selector)
}

class AttributesMapAdapter {

  constructor(attributes) {
    this.attributes = attributes;
  }

  get size() {
    return this.attributes.length
  }

  get(name) {
    let item = this.attributes.getNamedItem(name);
    if (item) {
      return item.value
    }
  }

  set(name, value) {
    this.attributes.setNamedItem(name, value);
  }

  forEach(fn) {
    const S = this.size;
    for (let i = 0; i < S; i++) {
      const item = this.attributes.item(i);
      fn(item.value, item.name);
    }
  }

  map(fn) {
    let result = [];
    this.forEach((val, key)=>{ result.push(fn(val, key)); });
    return result
  }

  keys() {
    return this.map((val, key)=>{ return key })
  }

  values() {
    return this.map((val)=>{ return val })
  }

  entries() {
    return this.map((val, key)=>{ return [key, val] })
  }

}

var index = {
	Text: "text", 
	Directive: "directive", 
	Comment: "comment", 
	Script: "script", 
	Style: "style", 
	Tag: "tag", 
	CDATA: "cdata", 
	Doctype: "doctype",

	isTag: function(elem){
		return elem.type === "tag" || elem.type === "script" || elem.type === "style";
	}
};

const _encodeXMLContent = ((obj) => {
  let invObj = getInverseObj(obj);
  let replacer = getInverseReplacer(invObj);
  return getInverse(invObj, replacer)
})({
  amp: "&",
  gt: ">",
  lt: "<",
});

const _encodeXMLAttr = ((obj) => {
  let invObj = getInverseObj(obj);
  let replacer = getInverseReplacer(invObj);
  return getInverse(invObj, replacer)
})({
  quot: "\"",
});

function getInverseObj(obj){
  return Object.keys(obj).sort().reduce(function(inverse, name){
    inverse[obj[name]] = "&" + name + ";";
    return inverse;
  }, {});
}

function getInverseReplacer(inverse){
  var single = [],
    multiple = [];

  Object.keys(inverse).forEach(function(k){
    if(k.length === 1){
      single.push("\\" + k);
    } else {
      multiple.push(k);
    }
  });


  multiple.unshift("[" + single.join("") + "]");

  return new RegExp(multiple.join("|"), "g");
}

var re_nonASCII = /[^\0-\x7F]/g;
var re_astralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

function singleCharReplacer(c){
  return "&#x" + c.charCodeAt(0).toString(16).toUpperCase() + ";";
}

function astralReplacer(c){

  var high = c.charCodeAt(0);
  var low = c.charCodeAt(1);
  var codePoint = (high - 0xD800) * 0x400 + low - 0xDC00 + 0x10000;
  return "&#x" + codePoint.toString(16).toUpperCase() + ";";
}

function getInverse(inverse, re){
  function func(name){
    return inverse[name];
  }
  return function(data){
    return data
        .replace(re, func)
        .replace(re_astralSymbols, astralReplacer)
        .replace(re_nonASCII, singleCharReplacer);
  };
}


const booleanAttributes = {
  __proto__: null,
  allowfullscreen: true,
  async: true,
  autofocus: true,
  autoplay: true,
  checked: true,
  controls: true,
  default: true,
  defer: true,
  disabled: true,
  hidden: true,
  ismap: true,
  loop: true,
  multiple: true,
  muted: true,
  open: true,
  readonly: true,
  required: true,
  reversed: true,
  scoped: true,
  seamless: true,
  selected: true,
  typemustmatch: true
};

const unencodedElements = {
  __proto__: null,
  style: true,
  script: true,
  xmp: true,
  iframe: true,
  noembed: true,
  noframes: true,
  plaintext: true,
  noscript: true
};

const singleTag = {
  __proto__: null,
  area: true,
  base: true,
  basefont: true,
  br: true,
  col: true,
  command: true,
  embed: true,
  frame: true,
  hr: true,
  img: true,
  input: true,
  isindex: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true,
};


class DomUtils {

  isTag(elem) {
    return index.isTag(elem)
  }

  removeElement(elem){
    if(elem.prev) elem.prev.next = elem.next;
    if(elem.next) elem.next.prev = elem.prev;
    if(elem.parent){
      var childs = elem.parent.childNodes;
      let pos = childs.lastIndexOf(elem);
      if (pos < 0) throw new Error('Invalid state')
      childs.splice(pos, 1);
      elem.parent = null;
    }
  }

  replaceElement(elem, replacement){
    if (replacement.parent) this.removeElement(replacement);
    var prev = replacement.prev = elem.prev;
    if(prev){
      prev.next = replacement;
    }

    var next = replacement.next = elem.next;
    if(next){
      next.prev = replacement;
    }

    var parent = replacement.parent = elem.parent;
    if(parent){
      var childs = parent.childNodes;
      let pos = childs.lastIndexOf(elem);
      if (pos < 0) throw new Error('Invalid state')
      childs[pos] = replacement;
    }
  }

  appendChild(elem, child){
    if (child.parent) this.removeElement(child);
    child.parent = elem;

    if(elem.childNodes.push(child) !== 1){
      var sibling = elem.childNodes[elem.childNodes.length - 2];
      sibling.next = child;
      child.prev = sibling;
      child.next = null;
    }
  }

  append(elem, next){
    if (next.parent) this.removeElement(next);
    var parent = elem.parent,
      currNext = elem.next;

    next.next = currNext;
    next.prev = elem;
    elem.next = next;
    next.parent = parent;

    if(currNext){
      currNext.prev = next;
      if(parent){
        var childs = parent.childNodes;
        let pos = childs.lastIndexOf(currNext);
        if (pos < 0) throw new Error('Invalid state')
        childs.splice(pos, 0, next);
      }
    } else if(parent){
      parent.childNodes.push(next);
    }
  }

  prepend(elem, prev){
    if (prev.parent) this.removeElement(prev);
    var parent = elem.parent;
    if(parent){
      var childs = parent.childNodes;
      let pos = childs.lastIndexOf(elem);
      if (pos < 0) throw new Error('Invalid state')
      childs.splice(pos, 0, prev);
    }

    if(elem.prev){
      elem.prev.next = prev;
    }

    prev.parent = parent;
    prev.prev = elem.prev;
    prev.next = elem;
    elem.prev = prev;
  }


  filter(test, element, recurse, limit){
    if(!Array.isArray(element)) element = [element];

    if(typeof limit !== "number" || !isFinite(limit)){
      limit = Infinity;
    }
    return this.find(test, element, recurse !== false, limit);
  }

  find(test, elems, recurse, limit){
    var result = [], childs;

    for(var i = 0, j = elems.length; i < j; i++){
      if(test(elems[i])){
        result.push(elems[i]);
        if(--limit <= 0) break;
      }

      childs = this.getChildren(elems[i]);
      if(recurse && childs && childs.length > 0){
        childs = this.find(test, childs, recurse, limit);
        result = result.concat(childs);
        limit -= childs.length;
        if(limit <= 0) break;
      }
    }

    return result;
  }

  findOneChild(test, elems){
    for(var i = 0, l = elems.length; i < l; i++){
      if(test(elems[i])) return elems[i];
    }

    return null;
  }

  findOne(test, elems){
    var elem = null;

    for(var i = 0, l = elems.length; i < l && !elem; i++){
      const child = elems[i];
      if(!this.isTag(child)){
        continue;
      } else if(test(child)){
        elem = child;
      } else {
        const childNodes = this.getChildren(child);
        if (childNodes.length > 0) {
          elem = this.findOne(test, childNodes);
        }
      }
    }

    return elem;
  }

  existsOne(test, elems){
    for(var i = 0, l = elems.length; i < l; i++){
      const elem = elems[i];
      
      if (!this.isTag(elem)) continue
      
      if (test(elem)) return true
      
      const childNodes = this.getChildren(elem);
      if (childNodes.length > 0 && this.existsOne(test, childNodes)) return true
    }
    return false;
  }

  findAll(test, elems){
    var result = [];
    for(var i = 0, j = elems.length; i < j; i++){
      const elem = elems[i];
      if(!this.isTag(elem)) continue;
      if(test(elem)) result.push(elem);
      const childNodes = this.getChildren(elem);
      if(childNodes.length > 0){
        result = result.concat(this.findAll(test, childNodes));
      }
    }
    return result;
  }

  getAttributes(el) {
    let attribs = el.getAttributes();
    
    
    if (attribs instanceof Map) {
      return Array.from(attribs)
    } else if (attribs && attribs.forEach) {
      let res = [];
      attribs.forEach((val, key) => {
        res.push([key, val]);
      });
      return res
    } else {
      return []
    }
  }

  formatAttribs(el, opts = {}) {
    let output = [];
    const attributes = this.getAttributes(el);
    attributes.forEach(([key, value]) => {
      if (!value && booleanAttributes[key]) {
        output.push(key);
      } else {
        output.push(key + '="' + (opts.decodeEntities ? _encodeXMLAttr(value) : value) + '"');
      }
    });
    return output.join(' ')
  }

  render(dom, opts) {
    if (!Array.isArray(dom)) dom = [dom];
    opts = opts || {};
    let output = [];
    for(var i = 0; i < dom.length; i++){
      let elem = dom[i];
      if (elem.type === 'root' || elem.type === 'document') {
        output.push(this.render(this.getChildren(elem), opts));
      } else if (index.isTag(elem)) {
        output.push(this.renderTag(elem, opts));
      } else if (elem.type === index.Directive) {
        output.push(this.renderDirective(elem));
      } else if (elem.type === index.Comment) {
        output.push(this.renderComment(elem));
      } else if (elem.type === index.CDATA) {
        output.push(this.renderCdata(elem));
      } else {
        output.push(this.renderText(elem, opts));
      }
    }
    return output.join('')
  }

  renderTag(elem, opts) {
    const name = this.getName(elem);
    if (name === "svg") opts = {decodeEntities: opts.decodeEntities, xmlMode: true};
    let tag = '<' + name;
    let attribs = this.formatAttribs(elem, opts);
    if (attribs) {
      tag += ' ' + attribs;
    }
    const childNodes = this.getChildren(elem);
    if (opts.xmlMode && childNodes.length === 0) {
      tag += '/>';
    } else {
      tag += '>';
      if (childNodes.length > 0) {
        tag += this.render(childNodes, opts);
      }
      if (!singleTag[name] || opts.xmlMode) {
        tag += '</' + name + '>';
      }
    }
    return tag
  }

  renderDirective(elem) {
    return '<' + this.getData(elem) + '>'
  }

  renderText(elem, opts) {
    let text = this.getText(elem);
    if (opts.decodeEntities) {
      const parent = this.getParent(elem);
      if (!(parent && this.getName(parent) in unencodedElements)) {
        text = _encodeXMLContent(text);
      }
    }
    return text
  }

  renderCdata(elem) {
    const childNodes = this.getChildren(elem);
    return '<![CDATA[' + this.getData(childNodes[0]) + ']]>'
  }

  renderComment(elem) {
    return '<!--' + this.getData(elem) + '-->'
  }

  getInnerHTML(elem, opts){
    const childNodes = this.getChildren(elem);
    return childNodes.map((child) => {
      return this.render(child, opts);
    }).join("")
  }

  getOuterHTML(elem, opts) {
    return this.render(elem, opts)
  }

  getData(elem) {
    return elem.data
  }

  getText(elem){
    if(Array.isArray(elem)) return elem.map(e => this.getText(e)).join("");
    switch(elem.type) {
      case index.Tag:
      case index.Script:
      case index.Style:
        return this.getText(this.getChildren(elem))
      case index.Text:
      case index.Comment:
      case index.CDATA:
        return elem.data
      default:
        return ""
    }
  }



  getChildren(elem) {
    return elem.childNodes;
  }

  getParent(elem){
    return elem.parent;
  }

  getSiblings(elem){
    var parent = this.getParent(elem);
    return parent ? this.getChildren(parent) : [elem];
  }

  getAttributeValue(elem, name){
    return elem.getAttribute(name);
  }

  hasAttrib(elem, name){
    return elem.hasAttribute(name);
  }

  getName(elem){
    return elem.name
  }

  getNameWithoutNS(elem){
    return elem.nameWithoutNS
  }

}

const domUtils = new DomUtils();
domUtils.DomUtils = DomUtils;

var index$2 = {
	trueFunc: function trueFunc(){
		return true;
	},
	falseFunc: function falseFunc(){
		return false;
	}
};

var index$3 = parse;

var re_name = /^(?:\\.|[\w\-\u00c0-\uFFFF])+/;
var re_escape = /\\([\da-f]{1,6}\s?|(\s)|.)/ig;
var re_attr = /^\s*((?:\\.|[\w\u00c0-\uFFFF\-])+)\s*(?:(\S?)=\s*(?:(['"])(.*?)\3|(#?(?:\\.|[\w\u00c0-\uFFFF\-])*)|)|)\s*(i)?\]/;

var actionTypes = {
	__proto__: null,
	"undefined": "exists",
	"":  "equals",
	"~": "element",
	"^": "start",
	"$": "end",
	"*": "any",
	"!": "not",
	"|": "hyphen"
};

var simpleSelectors = {
	__proto__: null,
	">": "child",
	"<": "parent",
	"~": "sibling",
	"+": "adjacent"
};

var attribSelectors = {
	__proto__: null,
	"#": ["id", "equals"],
	".": ["class", "element"]
};


var unpackPseudos = {
	__proto__: null,
	"has": true,
	"not": true,
	"matches": true
};

var stripQuotesFromPseudos = {
	__proto__: null,
	"contains": true,
	"icontains": true
};

var quotes = {
	__proto__: null,
	"\"": true,
	"'": true
};


function funescape( _, escaped, escapedWhitespace ) {
	var high = "0x" + escaped - 0x10000;
	
	
	
	return high !== high || escapedWhitespace ?
		escaped :
		
		high < 0 ?
			String.fromCharCode( high + 0x10000 ) :
			
			String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
}

function unescapeCSS(str){
	return str.replace(re_escape, funescape);
}

function isWhitespace(c){
	return c === " " || c === "\n" || c === "\t" || c === "\f" || c === "\r";
}

function parse(selector, options){
	var subselects = [];

	selector = parseSelector(subselects, selector + "", options);

	if(selector !== ""){
		throw new SyntaxError("Unmatched selector: " + selector);
	}

	return subselects;
}

function parseSelector(subselects, selector, options){
	var tokens = [],
		sawWS = false,
		data, firstChar, name, quot;

	function getName(){
		var sub = selector.match(re_name)[0];
		selector = selector.substr(sub.length);
		return unescapeCSS(sub);
	}

	function stripWhitespace(start){
		while(isWhitespace(selector.charAt(start))) start++;
		selector = selector.substr(start);
	}

	stripWhitespace(0);

	while(selector !== ""){
		firstChar = selector.charAt(0);

		if(isWhitespace(firstChar)){
			sawWS = true;
			stripWhitespace(1);
		} else if(firstChar in simpleSelectors){
			tokens.push({type: simpleSelectors[firstChar]});
			sawWS = false;

			stripWhitespace(1);
		} else if(firstChar === ","){
			if(tokens.length === 0){
				throw new SyntaxError("empty sub-selector");
			}
			subselects.push(tokens);
			tokens = [];
			sawWS = false;
			stripWhitespace(1);
		} else {
			if(sawWS){
				if(tokens.length > 0){
					tokens.push({type: "descendant"});
				}
				sawWS = false;
			}

			if(firstChar === "*"){
				selector = selector.substr(1);
				tokens.push({type: "universal"});
			} else if(firstChar in attribSelectors){
				selector = selector.substr(1);
				tokens.push({
					type: "attribute",
					name: attribSelectors[firstChar][0],
					action: attribSelectors[firstChar][1],
					value: getName(),
					ignoreCase: false
				});
			} else if(firstChar === "["){
				selector = selector.substr(1);
				data = selector.match(re_attr);
				if(!data){
					throw new SyntaxError("Malformed attribute selector: " + selector);
				}
				selector = selector.substr(data[0].length);
				name = unescapeCSS(data[1]);

				if(
					!options || (
						"lowerCaseAttributeNames" in options ?
							options.lowerCaseAttributeNames :
							!options.xmlMode
					)
				){
					name = name.toLowerCase();
				}

				tokens.push({
					type: "attribute",
					name: name,
					action: actionTypes[data[2]],
					value: unescapeCSS(data[4] || data[5] || ""),
					ignoreCase: !!data[6]
				});

			} else if(firstChar === ":"){
				if(selector.charAt(1) === ":"){
					selector = selector.substr(2);
					tokens.push({type: "pseudo-element", name: getName().toLowerCase()});
					continue;
				}

				selector = selector.substr(1);

				name = getName().toLowerCase();
				data = null;

				if(selector.charAt(0) === "("){
					if(name in unpackPseudos){
						quot = selector.charAt(1);
						var quoted = quot in quotes;

						selector = selector.substr(quoted + 1);

						data = [];
						selector = parseSelector(data, selector, options);

						if(quoted){
							if(selector.charAt(0) !== quot){
								throw new SyntaxError("unmatched quotes in :" + name);
							} else {
								selector = selector.substr(1);
							}
						}

						if(selector.charAt(0) !== ")"){
							throw new SyntaxError("missing closing parenthesis in :" + name + " " + selector);
						}

						selector = selector.substr(1);
					} else {
						var pos = 1, counter = 1;

						for(; counter > 0 && pos < selector.length; pos++){
							if(selector.charAt(pos) === "(") counter++;
							else if(selector.charAt(pos) === ")") counter--;
						}

						if(counter){
							throw new SyntaxError("parenthesis not matched");
						}

						data = selector.substr(1, pos - 2);
						selector = selector.substr(pos);

						if(name in stripQuotesFromPseudos){
							quot = data.charAt(0);

							if(quot === data.slice(-1) && quot in quotes){
								data = data.slice(1, -1);
							}

							data = unescapeCSS(data);
						}
					}
				}

				tokens.push({type: "pseudo", name: name, data: data});
			} else if(re_name.test(selector)){
				name = getName();

				if(!options || ("lowerCaseTags" in options ? options.lowerCaseTags : !options.xmlMode)){
					name = name.toLowerCase();
				}

				tokens.push({type: "tag", name: name});
			} else {
				if(tokens.length && tokens[tokens.length - 1].type === "descendant"){
					tokens.pop();
				}
				addToken(subselects, tokens);
				return selector;
			}
		}
	}

	addToken(subselects, tokens);

	return selector;
}

function addToken(subselects, tokens){
	if(subselects.length > 0 && tokens.length === 0){
		throw new SyntaxError("empty sub-selector");
	}

	subselects.push(tokens);
}

var parse_1$1 = parse$1;




var re_nthElement = /^([+\-]?\d*n)?\s*(?:([+\-]?)\s*(\d+))?$/;


function parse$1(formula){
	formula = formula.trim().toLowerCase();

	if(formula === "even"){
		return [2, 0];
	} else if(formula === "odd"){
		return [2, 1];
	} else {
		var parsed = formula.match(re_nthElement);

		if(!parsed){
			throw new SyntaxError("n-th rule couldn't be parsed ('" + formula + "')");
		}

		var a;

		if(parsed[1]){
			a = parseInt(parsed[1], 10);
			if(isNaN(a)){
				if(parsed[1].charAt(0) === "-") a = -1;
				else a = 1;
			}
		} else a = 0;

		return [
			a,
			parsed[3] ? parseInt((parsed[2] || "") + parsed[3], 10) : 0
		];
	}
}

var compile_1$1 = compile$1;

var trueFunc$1$1  = index$2.trueFunc;
var falseFunc$1$1 = index$2.falseFunc;


function compile$1(parsed){
	var a = parsed[0],
	    b = parsed[1] - 1;

	
	
	if(b < 0 && a <= 0) return falseFunc$1$1;

	
	if(a ===-1) return function(pos){ return pos <= b; };
	if(a === 0) return function(pos){ return pos === b; };
	
	if(a === 1) return b < 0 ? trueFunc$1$1 : function(pos){ return pos >= b; };

	
	var bMod = b % a;
	if(bMod < 0) bMod += a;

	if(a > 1){
		return function(pos){
			return pos >= b && pos % a === bMod;
		};
	}

	a *= -1; 

	return function(pos){
		return pos <= b && pos % a === bMod;
	};
}

var index$4 = function nthCheck(formula){
	return compile_1$1(parse_1$1(formula));
};

var parse_1 = parse_1$1;
var compile_1 = compile_1$1;

index$4.parse = parse_1;
index$4.compile = compile_1;

var universal = 50;
var tag = 30;
var attribute = 1;
var pseudo = 0;
var descendant = -1;
var child = -1;
var parent$1 = -1;
var sibling = -1;
var adjacent = -1;
var procedure = {
	universal: universal,
	tag: tag,
	attribute: attribute,
	pseudo: pseudo,
	descendant: descendant,
	child: child,
	parent: parent$1,
	sibling: sibling,
	adjacent: adjacent
};

var procedure$1 = Object.freeze({
	universal: universal,
	tag: tag,
	attribute: attribute,
	pseudo: pseudo,
	descendant: descendant,
	child: child,
	parent: parent$1,
	sibling: sibling,
	adjacent: adjacent,
	default: procedure
});

var procedure$2 = ( procedure$1 && procedure ) || procedure$1;

var sort = sortByProcedure;





var attributes = {
	__proto__: null,
	exists: 10,
	equals: 8,
	not: 7,
	start: 6,
	end: 6,
	any: 5,
	hyphen: 4,
	element: 4
};

function sortByProcedure(arr){
	var procs = arr.map(getProcedure);
	for(var i = 1; i < arr.length; i++){
		var procNew = procs[i];

		if(procNew < 0) continue;

		for(var j = i - 1; j >= 0 && procNew < procs[j]; j--){
			var token = arr[j + 1];
			arr[j + 1] = arr[j];
			arr[j] = token;
			procs[j + 1] = procs[j];
			procs[j] = procNew;
		}
	}
}

function getProcedure(token){
	var proc = procedure$2[token.type];

	if(proc === procedure$2.attribute){
		proc = attributes[token.action];

		if(proc === attributes.equals && token.name === "id"){
			
			proc = 9;
		}

		if(token.ignoreCase){
			
			
			proc >>= 1;
		}
	} else if(proc === procedure$2.pseudo){
		if(!token.data){
			proc = 3;
		} else if(token.name === "has" || token.name === "contains"){
			proc = 0; 
		} else if(token.name === "matches" || token.name === "not"){
			proc = 0;
			for(var i = 0; i < token.data.length; i++){
				
				if(token.data[i].length !== 1) continue;
				var cur = getProcedure(token.data[i][0]);
				
				if(cur === 0){
					proc = 0;
					break;
				}
				if(cur > proc) proc = cur;
			}
			if(token.data.length > 1 && proc > 0) proc -= 1;
		} else {
			proc = 1;
		}
	}
	return proc;
}

var falseFunc$2 = index$2.falseFunc;


var reChars = /[-[\]{}()*+?.,\\^$|#\s]/g;

function factory(adapter){
	
	var attributeRules = {
		__proto__: null,
		equals: function(next, data){
			var name  = data.name,
				value = data.value;

			if(data.ignoreCase){
				value = value.toLowerCase();

				return function equalsIC(elem){
					var attr = adapter.getAttributeValue(elem, name);
					return attr != null && attr.toLowerCase() === value && next(elem);
				};
			}

			return function equals(elem){
				return adapter.getAttributeValue(elem, name) === value && next(elem);
			};
		},
		hyphen: function(next, data){
			var name  = data.name,
				value = data.value,
				len = value.length;

			if(data.ignoreCase){
				value = value.toLowerCase();

				return function hyphenIC(elem){
					var attr = adapter.getAttributeValue(elem, name);
					return attr != null &&
							(attr.length === len || attr.charAt(len) === "-") &&
							attr.substr(0, len).toLowerCase() === value &&
							next(elem);
				};
			}

			return function hyphen(elem){
				var attr = adapter.getAttributeValue(elem, name);
				return attr != null &&
						attr.substr(0, len) === value &&
						(attr.length === len || attr.charAt(len) === "-") &&
						next(elem);
			};
		},
		element: function(next, data){
			var name = data.name,
				value = data.value;
			if (data.name === 'class') {
				let value = data.value;
				if (/\s/.test(value)) return function() { return false }
				return function clazz(elem) {
					let classes = elem.classes;
					return classes && classes.has(value) && next(elem)
				}
			} else {
				if(/\s/.test(value)){
					return falseFunc$2;
				}

				value = value.replace(reChars, "\\$&");

				var pattern = "(?:^|\\s)" + value + "(?:$|\\s)",
					flags = data.ignoreCase ? "i" : "",
					regex = new RegExp(pattern, flags);

				return function element(elem){
					var attr = adapter.getAttributeValue(elem, name);
					return attr != null && regex.test(attr) && next(elem);
				};
			}
		},
		exists: function(next, data){
			var name = data.name;
			return function exists(elem){
				return adapter.hasAttrib(elem, name) && next(elem);
			};
		},
		start: function(next, data){
			var name  = data.name,
				value = data.value,
				len = value.length;

			if(len === 0){
				return falseFunc$2;
			}

			if(data.ignoreCase){
				value = value.toLowerCase();

				return function startIC(elem){
					var attr = adapter.getAttributeValue(elem, name);
					return attr != null && attr.substr(0, len).toLowerCase() === value && next(elem);
				};
			}

			return function start(elem){
				var attr = adapter.getAttributeValue(elem, name);
				return attr != null && attr.substr(0, len) === value && next(elem);
			};
		},
		end: function(next, data){
			var name  = data.name,
				value = data.value,
				len   = -value.length;

			if(len === 0){
				return falseFunc$2;
			}

			if(data.ignoreCase){
				value = value.toLowerCase();

				return function endIC(elem){
					var attr = adapter.getAttributeValue(elem, name);
					return attr != null && attr.substr(len).toLowerCase() === value && next(elem);
				};
			}

			return function end(elem){
				var attr = adapter.getAttributeValue(elem, name);
				return attr != null && attr.substr(len) === value && next(elem);
			};
		},
		any: function(next, data){
			var name  = data.name,
				value = data.value;

			if(value === ""){
				return falseFunc$2;
			}

			if(data.ignoreCase){
				var regex = new RegExp(value.replace(reChars, "\\$&"), "i");

				return function anyIC(elem){
					var attr = adapter.getAttributeValue(elem, name);
					return attr != null && regex.test(attr) && next(elem);
				};
			}

			return function any(elem){
				var attr = adapter.getAttributeValue(elem, name);
				return attr != null && attr.indexOf(value) >= 0 && next(elem);
			};
		},
		not: function(next, data){
			var name  = data.name,
				value = data.value;

			if(value === ""){
				return function notEmpty(elem){
					return !!adapter.getAttributeValue(elem, name) && next(elem);
				};
			} else if(data.ignoreCase){
				value = value.toLowerCase();

				return function notIC(elem){
					var attr = adapter.getAttributeValue(elem, name);
					return attr != null && attr.toLowerCase() !== value && next(elem);
				};
			}

			return function not(elem){
				return adapter.getAttributeValue(elem, name) !== value && next(elem);
			};
		}
	};

	return {
		compile: function(next, data, options){
			if(options && options.strict && (
				data.ignoreCase || data.action === "not"
			)) throw new Error("Unsupported attribute selector");
			return attributeRules[data.action](next, data);
		},
		rules: attributeRules
	};
}

var attributes$1 = factory;

function generalFactory(adapter, Pseudos){
	
	return {
		__proto__: null,

		attribute: attributes$1(adapter).compile,
		pseudo: Pseudos.compile,

		
		tag: function(next, data){
			var name = data.name;
			return function tag(elem){
				return adapter.getNameWithoutNS(elem) === name && next(elem);
			}
		},

		
		descendant: function(next){
			return function descendant(elem){

				var found = false;

				while(!found && (elem = adapter.getParent(elem))){
					found = next(elem);
				}

				return found;
			};
		},
		_flexibleDescendant: function(next){
			
			return function descendant(elem){

				var found = next(elem);

				while(!found && (elem = adapter.getParent(elem))){
					found = next(elem);
				}

				return found;
			};
		},
		parent: function(next, data, options){
			if(options && options.strict) throw new Error("Parent selector isn't part of CSS3");

			return function parent(elem){
				return adapter.getChildren(elem).some(test);
			};

			function test(elem){
				return adapter.isTag(elem) && next(elem);
			}
		},
		child: function(next){
			return function child(elem){
				var parent = adapter.getParent(elem);
				return !!parent && next(parent);
			};
		},
		sibling: function(next){
			return function sibling(elem){
				var siblings = adapter.getSiblings(elem);

				for(var i = 0; i < siblings.length; i++){
					if(adapter.isTag(siblings[i])){
						if(siblings[i] === elem) break;
						if(next(siblings[i])) return true;
					}
				}

				return false;
			};
		},
		adjacent: function(next){
			return function adjacent(elem){
				var siblings = adapter.getSiblings(elem),
					lastElement;

				for(var i = 0; i < siblings.length; i++){
					if(adapter.isTag(siblings[i])){
						if(siblings[i] === elem) break;
						lastElement = siblings[i];
					}
				}

				return !!lastElement && next(lastElement);
			};
		},
		universal: function(next){
			return next;
		}
	};
}

var general = generalFactory;

var trueFunc$1          = index$2.trueFunc;
var falseFunc$3         = index$2.falseFunc;

function filtersFactory(adapter){
	var attributes  = attributes$1(adapter),
		checkAttrib = attributes.rules.equals;

	
	function equals(a, b){
		if(typeof adapter.equals === "function") return adapter.equals(a, b);

		return a === b;
	}

	function getAttribFunc(name, value){
		var data = {name: name, value: value};
		return function attribFunc(next){
			return checkAttrib(next, data);
		};
	}

	function getChildFunc(next){
		return function(elem){
			return !!adapter.getParent(elem) && next(elem);
		};
	}

	var filters = {
		contains: function(next, text){
			return function contains(elem){
				return next(elem) && adapter.getText(elem).indexOf(text) >= 0;
			};
		},
		icontains: function(next, text){
			var itext = text.toLowerCase();
			return function icontains(elem){
				return next(elem) &&
					adapter.getText(elem).toLowerCase().indexOf(itext) >= 0;
			};
		},

		
		"nth-child": function(next, rule){
			var func = index$4(rule);

			if(func === falseFunc$3) return func;
			if(func === trueFunc$1)  return getChildFunc(next);

			return function nthChild(elem){
				var siblings = adapter.getSiblings(elem);

				for(var i = 0, pos = 0; i < siblings.length; i++){
					if(adapter.isTag(siblings[i])){
						if(siblings[i] === elem) break;
						else pos++;
					}
				}

				return func(pos) && next(elem);
			};
		},
		"nth-last-child": function(next, rule){
			var func = index$4(rule);

			if(func === falseFunc$3) return func;
			if(func === trueFunc$1)  return getChildFunc(next);

			return function nthLastChild(elem){
				var siblings = adapter.getSiblings(elem);

				for(var pos = 0, i = siblings.length - 1; i >= 0; i--){
					if(adapter.isTag(siblings[i])){
						if(siblings[i] === elem) break;
						else pos++;
					}
				}

				return func(pos) && next(elem);
			};
		},
		"nth-of-type": function(next, rule){
			var func = index$4(rule);

			if(func === falseFunc$3) return func;
			if(func === trueFunc$1)  return getChildFunc(next);

			return function nthOfType(elem){
				var siblings = adapter.getSiblings(elem);

				for(var pos = 0, i = 0; i < siblings.length; i++){
					if(adapter.isTag(siblings[i])){
						if(siblings[i] === elem) break;
						if(adapter.getName(siblings[i]) === adapter.getName(elem)) pos++;
					}
				}

				return func(pos) && next(elem);
			};
		},
		"nth-last-of-type": function(next, rule){
			var func = index$4(rule);

			if(func === falseFunc$3) return func;
			if(func === trueFunc$1)  return getChildFunc(next);

			return function nthLastOfType(elem){
				var siblings = adapter.getSiblings(elem);

				for(var pos = 0, i = siblings.length - 1; i >= 0; i--){
					if(adapter.isTag(siblings[i])){
						if(siblings[i] === elem) break;
						if(adapter.getName(siblings[i]) === adapter.getName(elem)) pos++;
					}
				}

				return func(pos) && next(elem);
			};
		},

		
		root: function(next){
			return function(elem){
				return !adapter.getParent(elem) && next(elem);
			};
		},

		scope: function(next, rule, options, context){
			if(!context || context.length === 0){
				
				return filters.root(next);
			}

			if(context.length === 1){
				
				return function(elem){
					return equals(context[0], elem) && next(elem);
				};
			}

			return function(elem){
				return context.indexOf(elem) >= 0 && next(elem);
			};
		},

		
		checkbox: getAttribFunc("type", "checkbox"),
		file: getAttribFunc("type", "file"),
		password: getAttribFunc("type", "password"),
		radio: getAttribFunc("type", "radio"),
		reset: getAttribFunc("type", "reset"),
		image: getAttribFunc("type", "image"),
		submit: getAttribFunc("type", "submit")
	};
	return filters;
}

function pseudosFactory(adapter){
	
	function getFirstElement(elems){
		for(var i = 0; elems && i < elems.length; i++){
			if(adapter.isTag(elems[i])) return elems[i];
		}
	}

	
	var pseudos = {
		empty: function(elem){
			return !adapter.getChildren(elem).some(function(elem){
				return adapter.isTag(elem) || elem.type === "text";
			});
		},

		"first-child": function(elem){
			return getFirstElement(adapter.getSiblings(elem)) === elem;
		},
		"last-child": function(elem){
			var siblings = adapter.getSiblings(elem);

			for(var i = siblings.length - 1; i >= 0; i--){
				if(siblings[i] === elem) return true;
				if(adapter.isTag(siblings[i])) break;
			}

			return false;
		},
		"first-of-type": function(elem){
			var siblings = adapter.getSiblings(elem);

			for(var i = 0; i < siblings.length; i++){
				if(adapter.isTag(siblings[i])){
					if(siblings[i] === elem) return true;
					if(adapter.getName(siblings[i]) === adapter.getName(elem)) break;
				}
			}

			return false;
		},
		"last-of-type": function(elem){
			var siblings = adapter.getSiblings(elem);

			for(var i = siblings.length - 1; i >= 0; i--){
				if(adapter.isTag(siblings[i])){
					if(siblings[i] === elem) return true;
					if(adapter.getName(siblings[i]) === adapter.getName(elem)) break;
				}
			}

			return false;
		},
		"only-of-type": function(elem){
			var siblings = adapter.getSiblings(elem);

			for(var i = 0, j = siblings.length; i < j; i++){
				if(adapter.isTag(siblings[i])){
					if(siblings[i] === elem) continue;
					if(adapter.getName(siblings[i]) === adapter.getName(elem)) return false;
				}
			}

			return true;
		},
		"only-child": function(elem){
			var siblings = adapter.getSiblings(elem);

			for(var i = 0; i < siblings.length; i++){
				if(adapter.isTag(siblings[i]) && siblings[i] !== elem) return false;
			}

			return true;
		},

		
		link: function(elem){
			return adapter.hasAttrib(elem, "href");
		},
		visited: falseFunc$3, 
		

		
		

		
		selected: function(elem){
			if(adapter.hasAttrib(elem, "selected")) return true;
			else if(adapter.getName(elem) !== "option") return false;

			
			var parent = adapter.getParent(elem);

			if(
				!parent ||
				adapter.getName(parent) !== "select" ||
				adapter.hasAttrib(parent, "multiple")
			) return false;

			var siblings = adapter.getChildren(parent),
				sawElem  = false;

			for(var i = 0; i < siblings.length; i++){
				if(adapter.isTag(siblings[i])){
					if(siblings[i] === elem){
						sawElem = true;
					} else if(!sawElem){
						return false;
					} else if(adapter.hasAttrib(siblings[i], "selected")){
						return false;
					}
				}
			}

			return sawElem;
		},
		
		
		
		
		
		
		disabled: function(elem){
			return adapter.hasAttrib(elem, "disabled");
		},
		enabled: function(elem){
			return !adapter.hasAttrib(elem, "disabled");
		},
		
		checked: function(elem){
			return adapter.hasAttrib(elem, "checked") || pseudos.selected(elem);
		},
		
		required: function(elem){
			return adapter.hasAttrib(elem, "required");
		},
		
		optional: function(elem){
			return !adapter.hasAttrib(elem, "required");
		},

		

		
		parent: function(elem){
			return !pseudos.empty(elem);
		},
		
		header: function(elem){
			var name = adapter.getName(elem);
			return name === "h1" ||
					name === "h2" ||
					name === "h3" ||
					name === "h4" ||
					name === "h5" ||
					name === "h6";
		},

		
		button: function(elem){
			var name = adapter.getName(elem);
			return name === "button" ||
					name === "input" &&
					adapter.getAttributeValue(elem, "type") === "button";
		},
		
		input: function(elem){
			var name = adapter.getName(elem);
			return name === "input" ||
					name === "textarea" ||
					name === "select" ||
					name === "button";
		},
		
		text: function(elem){
			var attr;
			return adapter.getName(elem) === "input" && (
				!(attr = adapter.getAttributeValue(elem, "type")) ||
				attr.toLowerCase() === "text"
			);
		}
	};

	return pseudos;
}

function verifyArgs(func, name, subselect){
	if(subselect === null){
		if(func.length > 1 && name !== "scope"){
			throw new Error("pseudo-selector :" + name + " requires an argument");
		}
	} else {
		if(func.length === 1){
			throw new Error("pseudo-selector :" + name + " doesn't have any arguments");
		}
	}
}


var re_CSS3 = /^(?:(?:nth|last|first|only)-(?:child|of-type)|root|empty|(?:en|dis)abled|checked|not)$/;

function factory$1(adapter){
	var pseudos = pseudosFactory(adapter);
	var filters = filtersFactory(adapter);

	return {
		compile: function(next, data, options, context){
			var name = data.name,
				subselect = data.data;

			if(options && options.strict && !re_CSS3.test(name)){
				throw new Error(":" + name + " isn't part of CSS3");
			}

			if(typeof filters[name] === "function"){
				verifyArgs(filters[name], name,  subselect);
				return filters[name](next, subselect, options, context);
			} else if(typeof pseudos[name] === "function"){
				var func = pseudos[name];
				verifyArgs(func, name, subselect);

				if(next === trueFunc$1) return func;

				return function pseudoArgs(elem){
					return func(elem, subselect) && next(elem);
				};
			} else {
				throw new Error("unmatched pseudo-class :" + name);
			}
		},
		filters: filters,
		pseudos: pseudos
	};
}

var pseudos = factory$1;

var compile$$1 = compileFactory;

var trueFunc       = index$2.trueFunc;
var falseFunc$1      = index$2.falseFunc;

function compileFactory(adapter){
	var Pseudos     = pseudos(adapter),
		filters     = Pseudos.filters,
		Rules 			= general(adapter, Pseudos);

	function compile$$1(selector, options, context){
		var next = compileUnsafe(selector, options, context);
		return wrap(next);
	}

	function wrap(next){
		return function base(elem){
			return adapter.isTag(elem) && next(elem);
		};
	}

	function compileUnsafe(selector, options, context){
		var token = index$3(selector, options);
		return compileToken(token, options, context);
	}

	function includesScopePseudo(t){
		return t.type === "pseudo" && (
			t.name === "scope" || (
				Array.isArray(t.data) &&
				t.data.some(function(data){
					return data.some(includesScopePseudo);
				})
			)
		);
	}

	var DESCENDANT_TOKEN = {type: "descendant"},
		FLEXIBLE_DESCENDANT_TOKEN = {type: "_flexibleDescendant"},
		SCOPE_TOKEN = {type: "pseudo", name: "scope"},
		PLACEHOLDER_ELEMENT = {};

	
	
	function absolutize(token, context){
		
		var hasContext = !!context && !!context.length && context.every(function(e){
			return e === PLACEHOLDER_ELEMENT || !!adapter.getParent(e);
		});


		token.forEach(function(t){
			if(t.length > 0 && isTraversal(t[0]) && t[0].type !== "descendant"){
				
			} else if(hasContext && !includesScopePseudo(t)){
				t.unshift(DESCENDANT_TOKEN);
			} else {
				return;
			}

			t.unshift(SCOPE_TOKEN);
		});
	}

	function compileToken(token, options, context){
		token = token.filter(function(t){ return t.length > 0; });

		token.forEach(sort);

		var isArrayContext = Array.isArray(context);

		context = (options && options.context) || context;

		if(context && !isArrayContext) context = [context];

		absolutize(token, context);

		var shouldTestNextSiblings = false;

		var query = token
			.map(function(rules){
				if(rules[0] && rules[1] && rules[0].name === "scope"){
					var ruleType = rules[1].type;
					if(isArrayContext && ruleType === "descendant") rules[1] = FLEXIBLE_DESCENDANT_TOKEN;
					else if(ruleType === "adjacent" || ruleType === "sibling") shouldTestNextSiblings = true;
				}
				return compileRules(rules, options, context);
			})
			.reduce(reduceRules, falseFunc$1);

		query.shouldTestNextSiblings = shouldTestNextSiblings;

		return query;
	}

	function isTraversal(t){
		return procedure$2[t.type] < 0;
	}

	function compileRules(rules, options, context){
		return rules.reduce(function(func, rule){
			if(func === falseFunc$1) return func;
			return Rules[rule.type](func, rule, options, context);
		}, options && options.rootFunc || trueFunc);
	}

	function reduceRules(a, b){
		if(b === falseFunc$1 || a === trueFunc){
			return a;
		}
		if(a === falseFunc$1 || b === trueFunc){
			return b;
		}

		return function combine(elem){
			return a(elem) || b(elem);
		};
	}

	function containsTraversal(t){
		return t.some(isTraversal);
	}

	
	
	
	filters.not = function(next, token, options, context){
		var opts = {
			xmlMode: !!(options && options.xmlMode),
			strict: !!(options && options.strict)
		};

		if(opts.strict){
			if(token.length > 1 || token.some(containsTraversal)){
				throw new Error("complex selectors in :not aren't allowed in strict mode");
			}
		}

		var func = compileToken(token, opts, context);

		if(func === falseFunc$1) return next;
		if(func === trueFunc)  return falseFunc$1;

		return function(elem){
			return !func(elem) && next(elem);
		};
	};

	filters.has = function(next, token, options){
		var opts = {
			xmlMode: !!(options && options.xmlMode),
			strict: !!(options && options.strict)
		};

		
		var context = token.some(containsTraversal) ? [PLACEHOLDER_ELEMENT] : null;

		var func = compileToken(token, opts, context);

		if(func === falseFunc$1) return falseFunc$1;
		if(func === trueFunc){
			return function(elem){
				return adapter.getChildren(elem).some(adapter.isTag) && next(elem);
			};
		}

		func = wrap(func);

		if(context){
			return function has(elem){
				return next(elem) && (
					(context[0] = elem), adapter.existsOne(func, adapter.getChildren(elem))
				);
			};
		}

		return function has(elem){
			return next(elem) && adapter.existsOne(func, adapter.getChildren(elem));
		};
	};

	filters.matches = function(next, token, options, context){
		var opts = {
			xmlMode: !!(options && options.xmlMode),
			strict: !!(options && options.strict),
			rootFunc: next
		};

		return compileToken(token, opts, context);
	};

	compile$$1.compileToken = compileToken;
	compile$$1.compileUnsafe = compileUnsafe;
	compile$$1.Pseudos = Pseudos;

	return compile$$1;
}

var index$1 = CSSselect$1;

var falseFunc      = index$2.falseFunc;
var defaultCompile = compile$$1(domUtils);

function adapterCompile(adapter){
	if(!adapter.__compile__){
		adapter.__compile__ = compile$$1(adapter);
	}
	return adapter.__compile__
}

function getSelectorFunc(searchFunc){
	return function select(query, elems, options){
		options = options || {};
		options.adapter = options.adapter || domUtils;
		var compile$$1 = adapterCompile(options.adapter);

		if(typeof query !== "function") query = compile$$1.compileUnsafe(query, options, elems);
		if(query.shouldTestNextSiblings) elems = appendNextSiblings((options && options.context) || elems, options.adapter);
		if(!Array.isArray(elems)) elems = options.adapter.getChildren(elems);
		else elems = options.adapter.removeSubsets(elems);
		return searchFunc(query, elems, options);
	};
}

function getNextSiblings(elem, adapter){
	var siblings = adapter.getSiblings(elem);
	if(!Array.isArray(siblings)) return [];
	siblings = siblings.slice(0);
	while(siblings.shift() !== elem);
	return siblings;
}

function appendNextSiblings(elems, adapter){
	
	if(!Array.isArray(elems)) elems = [elems];
	var newElems = elems.slice(0);

	for(var i = 0, len = elems.length; i < len; i++){
		var nextSiblings = getNextSiblings(newElems[i], adapter);
		newElems.push.apply(newElems, nextSiblings);
	}
	return newElems;
}

var selectAll = getSelectorFunc(function selectAll(query, elems, options){
	return (query === falseFunc || !elems || elems.length === 0) ? [] : options.adapter.findAll(query, elems);
});

var selectOne = getSelectorFunc(function selectOne(query, elems, options){
	return (query === falseFunc || !elems || elems.length === 0) ? null : options.adapter.findOne(query, elems);
});

function is(elem, query, options){
	options = options || {};
	options.adapter = options.adapter || domUtils;
	var compile$$1 = adapterCompile(options.adapter);
	return (typeof query === "function" ? query : compile$$1(query, options))(elem);
}


function CSSselect$1(query, elems, options){
	return selectAll(query, elems, options);
}

CSSselect$1.compile = defaultCompile;
CSSselect$1.filters = defaultCompile.Pseudos.filters;
CSSselect$1.pseudos = defaultCompile.Pseudos.pseudos;

CSSselect$1.selectAll = selectAll;
CSSselect$1.selectOne = selectOne;

CSSselect$1.is = is;


CSSselect$1.parse = defaultCompile;
CSSselect$1.iterate = selectAll;


CSSselect$1._compileUnsafe = defaultCompile.compileUnsafe;
CSSselect$1._compileToken = defaultCompile.compileToken;

var amp = "&";
var apos = "'";
var gt = ">";
var lt = "<";
var quot = "\"";
var xmlJSON = {
	amp: amp,
	apos: apos,
	gt: gt,
	lt: lt,
	quot: quot
};

var xml = Object.freeze({
	amp: amp,
	apos: apos,
	gt: gt,
	lt: lt,
	quot: quot,
	default: xmlJSON
});

var Aacute = "Á";
var aacute = "á";
var Abreve = "Ă";
var abreve = "ă";
var ac = "∾";
var acd = "∿";
var acE = "∾̳";
var Acirc = "Â";
var acirc = "â";
var acute = "´";
var Acy = "А";
var acy = "а";
var AElig = "Æ";
var aelig = "æ";
var af = "⁡";
var Afr = "𝔄";
var afr = "𝔞";
var Agrave = "À";
var agrave = "à";
var alefsym = "ℵ";
var aleph = "ℵ";
var Alpha = "Α";
var alpha = "α";
var Amacr = "Ā";
var amacr = "ā";
var amalg = "⨿";
var amp$1 = "&";
var AMP = "&";
var andand = "⩕";
var And = "⩓";
var and = "∧";
var andd = "⩜";
var andslope = "⩘";
var andv = "⩚";
var ang = "∠";
var ange = "⦤";
var angle = "∠";
var angmsdaa = "⦨";
var angmsdab = "⦩";
var angmsdac = "⦪";
var angmsdad = "⦫";
var angmsdae = "⦬";
var angmsdaf = "⦭";
var angmsdag = "⦮";
var angmsdah = "⦯";
var angmsd = "∡";
var angrt = "∟";
var angrtvb = "⊾";
var angrtvbd = "⦝";
var angsph = "∢";
var angst = "Å";
var angzarr = "⍼";
var Aogon = "Ą";
var aogon = "ą";
var Aopf = "𝔸";
var aopf = "𝕒";
var apacir = "⩯";
var ap = "≈";
var apE = "⩰";
var ape = "≊";
var apid = "≋";
var apos$1 = "'";
var ApplyFunction = "⁡";
var approx = "≈";
var approxeq = "≊";
var Aring = "Å";
var aring = "å";
var Ascr = "𝒜";
var ascr = "𝒶";
var Assign = "≔";
var ast = "*";
var asymp = "≈";
var asympeq = "≍";
var Atilde = "Ã";
var atilde = "ã";
var Auml = "Ä";
var auml = "ä";
var awconint = "∳";
var awint = "⨑";
var backcong = "≌";
var backepsilon = "϶";
var backprime = "‵";
var backsim = "∽";
var backsimeq = "⋍";
var Backslash = "∖";
var Barv = "⫧";
var barvee = "⊽";
var barwed = "⌅";
var Barwed = "⌆";
var barwedge = "⌅";
var bbrk = "⎵";
var bbrktbrk = "⎶";
var bcong = "≌";
var Bcy = "Б";
var bcy = "б";
var bdquo = "„";
var becaus = "∵";
var because = "∵";
var Because = "∵";
var bemptyv = "⦰";
var bepsi = "϶";
var bernou = "ℬ";
var Bernoullis = "ℬ";
var Beta = "Β";
var beta = "β";
var beth = "ℶ";
var between = "≬";
var Bfr = "𝔅";
var bfr = "𝔟";
var bigcap = "⋂";
var bigcirc = "◯";
var bigcup = "⋃";
var bigodot = "⨀";
var bigoplus = "⨁";
var bigotimes = "⨂";
var bigsqcup = "⨆";
var bigstar = "★";
var bigtriangledown = "▽";
var bigtriangleup = "△";
var biguplus = "⨄";
var bigvee = "⋁";
var bigwedge = "⋀";
var bkarow = "⤍";
var blacklozenge = "⧫";
var blacksquare = "▪";
var blacktriangle = "▴";
var blacktriangledown = "▾";
var blacktriangleleft = "◂";
var blacktriangleright = "▸";
var blank = "␣";
var blk12 = "▒";
var blk14 = "░";
var blk34 = "▓";
var block = "█";
var bne = "=⃥";
var bnequiv = "≡⃥";
var bNot = "⫭";
var bnot = "⌐";
var Bopf = "𝔹";
var bopf = "𝕓";
var bot = "⊥";
var bottom = "⊥";
var bowtie = "⋈";
var boxbox = "⧉";
var boxdl = "┐";
var boxdL = "╕";
var boxDl = "╖";
var boxDL = "╗";
var boxdr = "┌";
var boxdR = "╒";
var boxDr = "╓";
var boxDR = "╔";
var boxh = "─";
var boxH = "═";
var boxhd = "┬";
var boxHd = "╤";
var boxhD = "╥";
var boxHD = "╦";
var boxhu = "┴";
var boxHu = "╧";
var boxhU = "╨";
var boxHU = "╩";
var boxminus = "⊟";
var boxplus = "⊞";
var boxtimes = "⊠";
var boxul = "┘";
var boxuL = "╛";
var boxUl = "╜";
var boxUL = "╝";
var boxur = "└";
var boxuR = "╘";
var boxUr = "╙";
var boxUR = "╚";
var boxv = "│";
var boxV = "║";
var boxvh = "┼";
var boxvH = "╪";
var boxVh = "╫";
var boxVH = "╬";
var boxvl = "┤";
var boxvL = "╡";
var boxVl = "╢";
var boxVL = "╣";
var boxvr = "├";
var boxvR = "╞";
var boxVr = "╟";
var boxVR = "╠";
var bprime = "‵";
var breve = "˘";
var Breve = "˘";
var brvbar = "¦";
var bscr = "𝒷";
var Bscr = "ℬ";
var bsemi = "⁏";
var bsim = "∽";
var bsime = "⋍";
var bsolb = "⧅";
var bsol = "\\";
var bsolhsub = "⟈";
var bull = "•";
var bullet = "•";
var bump = "≎";
var bumpE = "⪮";
var bumpe = "≏";
var Bumpeq = "≎";
var bumpeq = "≏";
var Cacute = "Ć";
var cacute = "ć";
var capand = "⩄";
var capbrcup = "⩉";
var capcap = "⩋";
var cap = "∩";
var Cap = "⋒";
var capcup = "⩇";
var capdot = "⩀";
var CapitalDifferentialD = "ⅅ";
var caps = "∩︀";
var caret = "⁁";
var caron = "ˇ";
var Cayleys = "ℭ";
var ccaps = "⩍";
var Ccaron = "Č";
var ccaron = "č";
var Ccedil = "Ç";
var ccedil = "ç";
var Ccirc = "Ĉ";
var ccirc = "ĉ";
var Cconint = "∰";
var ccups = "⩌";
var ccupssm = "⩐";
var Cdot = "Ċ";
var cdot = "ċ";
var cedil = "¸";
var Cedilla = "¸";
var cemptyv = "⦲";
var cent = "¢";
var centerdot = "·";
var CenterDot = "·";
var cfr = "𝔠";
var Cfr = "ℭ";
var CHcy = "Ч";
var chcy = "ч";
var check = "✓";
var checkmark = "✓";
var Chi = "Χ";
var chi = "χ";
var circ = "ˆ";
var circeq = "≗";
var circlearrowleft = "↺";
var circlearrowright = "↻";
var circledast = "⊛";
var circledcirc = "⊚";
var circleddash = "⊝";
var CircleDot = "⊙";
var circledR = "®";
var circledS = "Ⓢ";
var CircleMinus = "⊖";
var CirclePlus = "⊕";
var CircleTimes = "⊗";
var cir = "○";
var cirE = "⧃";
var cire = "≗";
var cirfnint = "⨐";
var cirmid = "⫯";
var cirscir = "⧂";
var ClockwiseContourIntegral = "∲";
var CloseCurlyDoubleQuote = "”";
var CloseCurlyQuote = "’";
var clubs = "♣";
var clubsuit = "♣";
var colon = ":";
var Colon = "∷";
var Colone = "⩴";
var colone = "≔";
var coloneq = "≔";
var comma = ",";
var commat = "@";
var comp = "∁";
var compfn = "∘";
var complement = "∁";
var complexes = "ℂ";
var cong = "≅";
var congdot = "⩭";
var Congruent = "≡";
var conint = "∮";
var Conint = "∯";
var ContourIntegral = "∮";
var copf = "𝕔";
var Copf = "ℂ";
var coprod = "∐";
var Coproduct = "∐";
var copy = "©";
var COPY = "©";
var copysr = "℗";
var CounterClockwiseContourIntegral = "∳";
var crarr = "↵";
var cross = "✗";
var Cross = "⨯";
var Cscr = "𝒞";
var cscr = "𝒸";
var csub = "⫏";
var csube = "⫑";
var csup = "⫐";
var csupe = "⫒";
var ctdot = "⋯";
var cudarrl = "⤸";
var cudarrr = "⤵";
var cuepr = "⋞";
var cuesc = "⋟";
var cularr = "↶";
var cularrp = "⤽";
var cupbrcap = "⩈";
var cupcap = "⩆";
var CupCap = "≍";
var cup = "∪";
var Cup = "⋓";
var cupcup = "⩊";
var cupdot = "⊍";
var cupor = "⩅";
var cups = "∪︀";
var curarr = "↷";
var curarrm = "⤼";
var curlyeqprec = "⋞";
var curlyeqsucc = "⋟";
var curlyvee = "⋎";
var curlywedge = "⋏";
var curren = "¤";
var curvearrowleft = "↶";
var curvearrowright = "↷";
var cuvee = "⋎";
var cuwed = "⋏";
var cwconint = "∲";
var cwint = "∱";
var cylcty = "⌭";
var dagger = "†";
var Dagger = "‡";
var daleth = "ℸ";
var darr = "↓";
var Darr = "↡";
var dArr = "⇓";
var dash = "‐";
var Dashv = "⫤";
var dashv = "⊣";
var dbkarow = "⤏";
var dblac = "˝";
var Dcaron = "Ď";
var dcaron = "ď";
var Dcy = "Д";
var dcy = "д";
var ddagger = "‡";
var ddarr = "⇊";
var DD = "ⅅ";
var dd = "ⅆ";
var DDotrahd = "⤑";
var ddotseq = "⩷";
var deg = "°";
var Del = "∇";
var Delta = "Δ";
var delta = "δ";
var demptyv = "⦱";
var dfisht = "⥿";
var Dfr = "𝔇";
var dfr = "𝔡";
var dHar = "⥥";
var dharl = "⇃";
var dharr = "⇂";
var DiacriticalAcute = "´";
var DiacriticalDot = "˙";
var DiacriticalDoubleAcute = "˝";
var DiacriticalGrave = "`";
var DiacriticalTilde = "˜";
var diam = "⋄";
var diamond = "⋄";
var Diamond = "⋄";
var diamondsuit = "♦";
var diams = "♦";
var die = "¨";
var DifferentialD = "ⅆ";
var digamma = "ϝ";
var disin = "⋲";
var div = "÷";
var divide = "÷";
var divideontimes = "⋇";
var divonx = "⋇";
var DJcy = "Ђ";
var djcy = "ђ";
var dlcorn = "⌞";
var dlcrop = "⌍";
var dollar = "$";
var Dopf = "𝔻";
var dopf = "𝕕";
var Dot = "¨";
var dot = "˙";
var DotDot = "⃜";
var doteq = "≐";
var doteqdot = "≑";
var DotEqual = "≐";
var dotminus = "∸";
var dotplus = "∔";
var dotsquare = "⊡";
var doublebarwedge = "⌆";
var DoubleContourIntegral = "∯";
var DoubleDot = "¨";
var DoubleDownArrow = "⇓";
var DoubleLeftArrow = "⇐";
var DoubleLeftRightArrow = "⇔";
var DoubleLeftTee = "⫤";
var DoubleLongLeftArrow = "⟸";
var DoubleLongLeftRightArrow = "⟺";
var DoubleLongRightArrow = "⟹";
var DoubleRightArrow = "⇒";
var DoubleRightTee = "⊨";
var DoubleUpArrow = "⇑";
var DoubleUpDownArrow = "⇕";
var DoubleVerticalBar = "∥";
var DownArrowBar = "⤓";
var downarrow = "↓";
var DownArrow = "↓";
var Downarrow = "⇓";
var DownArrowUpArrow = "⇵";
var DownBreve = "̑";
var downdownarrows = "⇊";
var downharpoonleft = "⇃";
var downharpoonright = "⇂";
var DownLeftRightVector = "⥐";
var DownLeftTeeVector = "⥞";
var DownLeftVectorBar = "⥖";
var DownLeftVector = "↽";
var DownRightTeeVector = "⥟";
var DownRightVectorBar = "⥗";
var DownRightVector = "⇁";
var DownTeeArrow = "↧";
var DownTee = "⊤";
var drbkarow = "⤐";
var drcorn = "⌟";
var drcrop = "⌌";
var Dscr = "𝒟";
var dscr = "𝒹";
var DScy = "Ѕ";
var dscy = "ѕ";
var dsol = "⧶";
var Dstrok = "Đ";
var dstrok = "đ";
var dtdot = "⋱";
var dtri = "▿";
var dtrif = "▾";
var duarr = "⇵";
var duhar = "⥯";
var dwangle = "⦦";
var DZcy = "Џ";
var dzcy = "џ";
var dzigrarr = "⟿";
var Eacute = "É";
var eacute = "é";
var easter = "⩮";
var Ecaron = "Ě";
var ecaron = "ě";
var Ecirc = "Ê";
var ecirc = "ê";
var ecir = "≖";
var ecolon = "≕";
var Ecy = "Э";
var ecy = "э";
var eDDot = "⩷";
var Edot = "Ė";
var edot = "ė";
var eDot = "≑";
var ee = "ⅇ";
var efDot = "≒";
var Efr = "𝔈";
var efr = "𝔢";
var eg = "⪚";
var Egrave = "È";
var egrave = "è";
var egs = "⪖";
var egsdot = "⪘";
var el = "⪙";
var Element = "∈";
var elinters = "⏧";
var ell = "ℓ";
var els = "⪕";
var elsdot = "⪗";
var Emacr = "Ē";
var emacr = "ē";
var empty = "∅";
var emptyset = "∅";
var EmptySmallSquare = "◻";
var emptyv = "∅";
var EmptyVerySmallSquare = "▫";
var emsp13 = " ";
var emsp14 = " ";
var emsp = " ";
var ENG = "Ŋ";
var eng = "ŋ";
var ensp = " ";
var Eogon = "Ę";
var eogon = "ę";
var Eopf = "𝔼";
var eopf = "𝕖";
var epar = "⋕";
var eparsl = "⧣";
var eplus = "⩱";
var epsi = "ε";
var Epsilon = "Ε";
var epsilon = "ε";
var epsiv = "ϵ";
var eqcirc = "≖";
var eqcolon = "≕";
var eqsim = "≂";
var eqslantgtr = "⪖";
var eqslantless = "⪕";
var Equal = "⩵";
var equals = "=";
var EqualTilde = "≂";
var equest = "≟";
var Equilibrium = "⇌";
var equiv = "≡";
var equivDD = "⩸";
var eqvparsl = "⧥";
var erarr = "⥱";
var erDot = "≓";
var escr = "ℯ";
var Escr = "ℰ";
var esdot = "≐";
var Esim = "⩳";
var esim = "≂";
var Eta = "Η";
var eta = "η";
var ETH = "Ð";
var eth = "ð";
var Euml = "Ë";
var euml = "ë";
var euro = "€";
var excl = "!";
var exist = "∃";
var Exists = "∃";
var expectation = "ℰ";
var exponentiale = "ⅇ";
var ExponentialE = "ⅇ";
var fallingdotseq = "≒";
var Fcy = "Ф";
var fcy = "ф";
var female = "♀";
var ffilig = "ﬃ";
var fflig = "ﬀ";
var ffllig = "ﬄ";
var Ffr = "𝔉";
var ffr = "𝔣";
var filig = "ﬁ";
var FilledSmallSquare = "◼";
var FilledVerySmallSquare = "▪";
var fjlig = "fj";
var flat = "♭";
var fllig = "ﬂ";
var fltns = "▱";
var fnof = "ƒ";
var Fopf = "𝔽";
var fopf = "𝕗";
var forall = "∀";
var ForAll = "∀";
var fork = "⋔";
var forkv = "⫙";
var Fouriertrf = "ℱ";
var fpartint = "⨍";
var frac12 = "½";
var frac13 = "⅓";
var frac14 = "¼";
var frac15 = "⅕";
var frac16 = "⅙";
var frac18 = "⅛";
var frac23 = "⅔";
var frac25 = "⅖";
var frac34 = "¾";
var frac35 = "⅗";
var frac38 = "⅜";
var frac45 = "⅘";
var frac56 = "⅚";
var frac58 = "⅝";
var frac78 = "⅞";
var frasl = "⁄";
var frown = "⌢";
var fscr = "𝒻";
var Fscr = "ℱ";
var gacute = "ǵ";
var Gamma = "Γ";
var gamma = "γ";
var Gammad = "Ϝ";
var gammad = "ϝ";
var gap = "⪆";
var Gbreve = "Ğ";
var gbreve = "ğ";
var Gcedil = "Ģ";
var Gcirc = "Ĝ";
var gcirc = "ĝ";
var Gcy = "Г";
var gcy = "г";
var Gdot = "Ġ";
var gdot = "ġ";
var ge = "≥";
var gE = "≧";
var gEl = "⪌";
var gel = "⋛";
var geq = "≥";
var geqq = "≧";
var geqslant = "⩾";
var gescc = "⪩";
var ges = "⩾";
var gesdot = "⪀";
var gesdoto = "⪂";
var gesdotol = "⪄";
var gesl = "⋛︀";
var gesles = "⪔";
var Gfr = "𝔊";
var gfr = "𝔤";
var gg = "≫";
var Gg = "⋙";
var ggg = "⋙";
var gimel = "ℷ";
var GJcy = "Ѓ";
var gjcy = "ѓ";
var gla = "⪥";
var gl = "≷";
var glE = "⪒";
var glj = "⪤";
var gnap = "⪊";
var gnapprox = "⪊";
var gne = "⪈";
var gnE = "≩";
var gneq = "⪈";
var gneqq = "≩";
var gnsim = "⋧";
var Gopf = "𝔾";
var gopf = "𝕘";
var grave = "`";
var GreaterEqual = "≥";
var GreaterEqualLess = "⋛";
var GreaterFullEqual = "≧";
var GreaterGreater = "⪢";
var GreaterLess = "≷";
var GreaterSlantEqual = "⩾";
var GreaterTilde = "≳";
var Gscr = "𝒢";
var gscr = "ℊ";
var gsim = "≳";
var gsime = "⪎";
var gsiml = "⪐";
var gtcc = "⪧";
var gtcir = "⩺";
var gt$1 = ">";
var GT = ">";
var Gt = "≫";
var gtdot = "⋗";
var gtlPar = "⦕";
var gtquest = "⩼";
var gtrapprox = "⪆";
var gtrarr = "⥸";
var gtrdot = "⋗";
var gtreqless = "⋛";
var gtreqqless = "⪌";
var gtrless = "≷";
var gtrsim = "≳";
var gvertneqq = "≩︀";
var gvnE = "≩︀";
var Hacek = "ˇ";
var hairsp = " ";
var half = "½";
var hamilt = "ℋ";
var HARDcy = "Ъ";
var hardcy = "ъ";
var harrcir = "⥈";
var harr = "↔";
var hArr = "⇔";
var harrw = "↭";
var Hat = "^";
var hbar = "ℏ";
var Hcirc = "Ĥ";
var hcirc = "ĥ";
var hearts = "♥";
var heartsuit = "♥";
var hellip = "…";
var hercon = "⊹";
var hfr = "𝔥";
var Hfr = "ℌ";
var HilbertSpace = "ℋ";
var hksearow = "⤥";
var hkswarow = "⤦";
var hoarr = "⇿";
var homtht = "∻";
var hookleftarrow = "↩";
var hookrightarrow = "↪";
var hopf = "𝕙";
var Hopf = "ℍ";
var horbar = "―";
var HorizontalLine = "─";
var hscr = "𝒽";
var Hscr = "ℋ";
var hslash = "ℏ";
var Hstrok = "Ħ";
var hstrok = "ħ";
var HumpDownHump = "≎";
var HumpEqual = "≏";
var hybull = "⁃";
var hyphen = "‐";
var Iacute = "Í";
var iacute = "í";
var ic = "⁣";
var Icirc = "Î";
var icirc = "î";
var Icy = "И";
var icy = "и";
var Idot = "İ";
var IEcy = "Е";
var iecy = "е";
var iexcl = "¡";
var iff = "⇔";
var ifr = "𝔦";
var Ifr = "ℑ";
var Igrave = "Ì";
var igrave = "ì";
var ii = "ⅈ";
var iiiint = "⨌";
var iiint = "∭";
var iinfin = "⧜";
var iiota = "℩";
var IJlig = "Ĳ";
var ijlig = "ĳ";
var Imacr = "Ī";
var imacr = "ī";
var image = "ℑ";
var ImaginaryI = "ⅈ";
var imagline = "ℐ";
var imagpart = "ℑ";
var imath = "ı";
var Im = "ℑ";
var imof = "⊷";
var imped = "Ƶ";
var Implies = "⇒";
var incare = "℅";
var infin = "∞";
var infintie = "⧝";
var inodot = "ı";
var intcal = "⊺";
var int = "∫";
var Int = "∬";
var integers = "ℤ";
var Integral = "∫";
var intercal = "⊺";
var Intersection = "⋂";
var intlarhk = "⨗";
var intprod = "⨼";
var InvisibleComma = "⁣";
var InvisibleTimes = "⁢";
var IOcy = "Ё";
var iocy = "ё";
var Iogon = "Į";
var iogon = "į";
var Iopf = "𝕀";
var iopf = "𝕚";
var Iota = "Ι";
var iota = "ι";
var iprod = "⨼";
var iquest = "¿";
var iscr = "𝒾";
var Iscr = "ℐ";
var isin = "∈";
var isindot = "⋵";
var isinE = "⋹";
var isins = "⋴";
var isinsv = "⋳";
var isinv = "∈";
var it = "⁢";
var Itilde = "Ĩ";
var itilde = "ĩ";
var Iukcy = "І";
var iukcy = "і";
var Iuml = "Ï";
var iuml = "ï";
var Jcirc = "Ĵ";
var jcirc = "ĵ";
var Jcy = "Й";
var jcy = "й";
var Jfr = "𝔍";
var jfr = "𝔧";
var jmath = "ȷ";
var Jopf = "𝕁";
var jopf = "𝕛";
var Jscr = "𝒥";
var jscr = "𝒿";
var Jsercy = "Ј";
var jsercy = "ј";
var Jukcy = "Є";
var jukcy = "є";
var Kappa = "Κ";
var kappa = "κ";
var kappav = "ϰ";
var Kcedil = "Ķ";
var kcedil = "ķ";
var Kcy = "К";
var kcy = "к";
var Kfr = "𝔎";
var kfr = "𝔨";
var kgreen = "ĸ";
var KHcy = "Х";
var khcy = "х";
var KJcy = "Ќ";
var kjcy = "ќ";
var Kopf = "𝕂";
var kopf = "𝕜";
var Kscr = "𝒦";
var kscr = "𝓀";
var lAarr = "⇚";
var Lacute = "Ĺ";
var lacute = "ĺ";
var laemptyv = "⦴";
var lagran = "ℒ";
var Lambda = "Λ";
var lambda = "λ";
var lang = "⟨";
var Lang = "⟪";
var langd = "⦑";
var langle = "⟨";
var lap = "⪅";
var Laplacetrf = "ℒ";
var laquo = "«";
var larrb = "⇤";
var larrbfs = "⤟";
var larr = "←";
var Larr = "↞";
var lArr = "⇐";
var larrfs = "⤝";
var larrhk = "↩";
var larrlp = "↫";
var larrpl = "⤹";
var larrsim = "⥳";
var larrtl = "↢";
var latail = "⤙";
var lAtail = "⤛";
var lat = "⪫";
var late = "⪭";
var lates = "⪭︀";
var lbarr = "⤌";
var lBarr = "⤎";
var lbbrk = "❲";
var lbrace = "{";
var lbrack = "[";
var lbrke = "⦋";
var lbrksld = "⦏";
var lbrkslu = "⦍";
var Lcaron = "Ľ";
var lcaron = "ľ";
var Lcedil = "Ļ";
var lcedil = "ļ";
var lceil = "⌈";
var lcub = "{";
var Lcy = "Л";
var lcy = "л";
var ldca = "⤶";
var ldquo = "“";
var ldquor = "„";
var ldrdhar = "⥧";
var ldrushar = "⥋";
var ldsh = "↲";
var le = "≤";
var lE = "≦";
var LeftAngleBracket = "⟨";
var LeftArrowBar = "⇤";
var leftarrow = "←";
var LeftArrow = "←";
var Leftarrow = "⇐";
var LeftArrowRightArrow = "⇆";
var leftarrowtail = "↢";
var LeftCeiling = "⌈";
var LeftDoubleBracket = "⟦";
var LeftDownTeeVector = "⥡";
var LeftDownVectorBar = "⥙";
var LeftDownVector = "⇃";
var LeftFloor = "⌊";
var leftharpoondown = "↽";
var leftharpoonup = "↼";
var leftleftarrows = "⇇";
var leftrightarrow = "↔";
var LeftRightArrow = "↔";
var Leftrightarrow = "⇔";
var leftrightarrows = "⇆";
var leftrightharpoons = "⇋";
var leftrightsquigarrow = "↭";
var LeftRightVector = "⥎";
var LeftTeeArrow = "↤";
var LeftTee = "⊣";
var LeftTeeVector = "⥚";
var leftthreetimes = "⋋";
var LeftTriangleBar = "⧏";
var LeftTriangle = "⊲";
var LeftTriangleEqual = "⊴";
var LeftUpDownVector = "⥑";
var LeftUpTeeVector = "⥠";
var LeftUpVectorBar = "⥘";
var LeftUpVector = "↿";
var LeftVectorBar = "⥒";
var LeftVector = "↼";
var lEg = "⪋";
var leg = "⋚";
var leq = "≤";
var leqq = "≦";
var leqslant = "⩽";
var lescc = "⪨";
var les = "⩽";
var lesdot = "⩿";
var lesdoto = "⪁";
var lesdotor = "⪃";
var lesg = "⋚︀";
var lesges = "⪓";
var lessapprox = "⪅";
var lessdot = "⋖";
var lesseqgtr = "⋚";
var lesseqqgtr = "⪋";
var LessEqualGreater = "⋚";
var LessFullEqual = "≦";
var LessGreater = "≶";
var lessgtr = "≶";
var LessLess = "⪡";
var lesssim = "≲";
var LessSlantEqual = "⩽";
var LessTilde = "≲";
var lfisht = "⥼";
var lfloor = "⌊";
var Lfr = "𝔏";
var lfr = "𝔩";
var lg = "≶";
var lgE = "⪑";
var lHar = "⥢";
var lhard = "↽";
var lharu = "↼";
var lharul = "⥪";
var lhblk = "▄";
var LJcy = "Љ";
var ljcy = "љ";
var llarr = "⇇";
var ll = "≪";
var Ll = "⋘";
var llcorner = "⌞";
var Lleftarrow = "⇚";
var llhard = "⥫";
var lltri = "◺";
var Lmidot = "Ŀ";
var lmidot = "ŀ";
var lmoustache = "⎰";
var lmoust = "⎰";
var lnap = "⪉";
var lnapprox = "⪉";
var lne = "⪇";
var lnE = "≨";
var lneq = "⪇";
var lneqq = "≨";
var lnsim = "⋦";
var loang = "⟬";
var loarr = "⇽";
var lobrk = "⟦";
var longleftarrow = "⟵";
var LongLeftArrow = "⟵";
var Longleftarrow = "⟸";
var longleftrightarrow = "⟷";
var LongLeftRightArrow = "⟷";
var Longleftrightarrow = "⟺";
var longmapsto = "⟼";
var longrightarrow = "⟶";
var LongRightArrow = "⟶";
var Longrightarrow = "⟹";
var looparrowleft = "↫";
var looparrowright = "↬";
var lopar = "⦅";
var Lopf = "𝕃";
var lopf = "𝕝";
var loplus = "⨭";
var lotimes = "⨴";
var lowast = "∗";
var lowbar = "_";
var LowerLeftArrow = "↙";
var LowerRightArrow = "↘";
var loz = "◊";
var lozenge = "◊";
var lozf = "⧫";
var lpar = "(";
var lparlt = "⦓";
var lrarr = "⇆";
var lrcorner = "⌟";
var lrhar = "⇋";
var lrhard = "⥭";
var lrm = "‎";
var lrtri = "⊿";
var lsaquo = "‹";
var lscr = "𝓁";
var Lscr = "ℒ";
var lsh = "↰";
var Lsh = "↰";
var lsim = "≲";
var lsime = "⪍";
var lsimg = "⪏";
var lsqb = "[";
var lsquo = "‘";
var lsquor = "‚";
var Lstrok = "Ł";
var lstrok = "ł";
var ltcc = "⪦";
var ltcir = "⩹";
var lt$1 = "<";
var LT = "<";
var Lt = "≪";
var ltdot = "⋖";
var lthree = "⋋";
var ltimes = "⋉";
var ltlarr = "⥶";
var ltquest = "⩻";
var ltri = "◃";
var ltrie = "⊴";
var ltrif = "◂";
var ltrPar = "⦖";
var lurdshar = "⥊";
var luruhar = "⥦";
var lvertneqq = "≨︀";
var lvnE = "≨︀";
var macr = "¯";
var male = "♂";
var malt = "✠";
var maltese = "✠";
var map$1 = "↦";
var mapsto = "↦";
var mapstodown = "↧";
var mapstoleft = "↤";
var mapstoup = "↥";
var marker = "▮";
var mcomma = "⨩";
var Mcy = "М";
var mcy = "м";
var mdash = "—";
var mDDot = "∺";
var measuredangle = "∡";
var MediumSpace = " ";
var Mellintrf = "ℳ";
var Mfr = "𝔐";
var mfr = "𝔪";
var mho = "℧";
var micro = "µ";
var midast = "*";
var midcir = "⫰";
var mid = "∣";
var middot = "·";
var minusb = "⊟";
var minus = "−";
var minusd = "∸";
var minusdu = "⨪";
var MinusPlus = "∓";
var mlcp = "⫛";
var mldr = "…";
var mnplus = "∓";
var models = "⊧";
var Mopf = "𝕄";
var mopf = "𝕞";
var mp = "∓";
var mscr = "𝓂";
var Mscr = "ℳ";
var mstpos = "∾";
var Mu = "Μ";
var mu = "μ";
var multimap = "⊸";
var mumap = "⊸";
var nabla = "∇";
var Nacute = "Ń";
var nacute = "ń";
var nang = "∠⃒";
var nap = "≉";
var napE = "⩰̸";
var napid = "≋̸";
var napos = "ŉ";
var napprox = "≉";
var natural = "♮";
var naturals = "ℕ";
var natur = "♮";
var nbsp = " ";
var nbump = "≎̸";
var nbumpe = "≏̸";
var ncap = "⩃";
var Ncaron = "Ň";
var ncaron = "ň";
var Ncedil = "Ņ";
var ncedil = "ņ";
var ncong = "≇";
var ncongdot = "⩭̸";
var ncup = "⩂";
var Ncy = "Н";
var ncy = "н";
var ndash = "–";
var nearhk = "⤤";
var nearr = "↗";
var neArr = "⇗";
var nearrow = "↗";
var ne = "≠";
var nedot = "≐̸";
var NegativeMediumSpace = "​";
var NegativeThickSpace = "​";
var NegativeThinSpace = "​";
var NegativeVeryThinSpace = "​";
var nequiv = "≢";
var nesear = "⤨";
var nesim = "≂̸";
var NestedGreaterGreater = "≫";
var NestedLessLess = "≪";
var NewLine = "\n";
var nexist = "∄";
var nexists = "∄";
var Nfr = "𝔑";
var nfr = "𝔫";
var ngE = "≧̸";
var nge = "≱";
var ngeq = "≱";
var ngeqq = "≧̸";
var ngeqslant = "⩾̸";
var nges = "⩾̸";
var nGg = "⋙̸";
var ngsim = "≵";
var nGt = "≫⃒";
var ngt = "≯";
var ngtr = "≯";
var nGtv = "≫̸";
var nharr = "↮";
var nhArr = "⇎";
var nhpar = "⫲";
var ni = "∋";
var nis = "⋼";
var nisd = "⋺";
var niv = "∋";
var NJcy = "Њ";
var njcy = "њ";
var nlarr = "↚";
var nlArr = "⇍";
var nldr = "‥";
var nlE = "≦̸";
var nle = "≰";
var nleftarrow = "↚";
var nLeftarrow = "⇍";
var nleftrightarrow = "↮";
var nLeftrightarrow = "⇎";
var nleq = "≰";
var nleqq = "≦̸";
var nleqslant = "⩽̸";
var nles = "⩽̸";
var nless = "≮";
var nLl = "⋘̸";
var nlsim = "≴";
var nLt = "≪⃒";
var nlt = "≮";
var nltri = "⋪";
var nltrie = "⋬";
var nLtv = "≪̸";
var nmid = "∤";
var NoBreak = "⁠";
var NonBreakingSpace = " ";
var nopf = "𝕟";
var Nopf = "ℕ";
var Not = "⫬";
var not = "¬";
var NotCongruent = "≢";
var NotCupCap = "≭";
var NotDoubleVerticalBar = "∦";
var NotElement = "∉";
var NotEqual = "≠";
var NotEqualTilde = "≂̸";
var NotExists = "∄";
var NotGreater = "≯";
var NotGreaterEqual = "≱";
var NotGreaterFullEqual = "≧̸";
var NotGreaterGreater = "≫̸";
var NotGreaterLess = "≹";
var NotGreaterSlantEqual = "⩾̸";
var NotGreaterTilde = "≵";
var NotHumpDownHump = "≎̸";
var NotHumpEqual = "≏̸";
var notin = "∉";
var notindot = "⋵̸";
var notinE = "⋹̸";
var notinva = "∉";
var notinvb = "⋷";
var notinvc = "⋶";
var NotLeftTriangleBar = "⧏̸";
var NotLeftTriangle = "⋪";
var NotLeftTriangleEqual = "⋬";
var NotLess = "≮";
var NotLessEqual = "≰";
var NotLessGreater = "≸";
var NotLessLess = "≪̸";
var NotLessSlantEqual = "⩽̸";
var NotLessTilde = "≴";
var NotNestedGreaterGreater = "⪢̸";
var NotNestedLessLess = "⪡̸";
var notni = "∌";
var notniva = "∌";
var notnivb = "⋾";
var notnivc = "⋽";
var NotPrecedes = "⊀";
var NotPrecedesEqual = "⪯̸";
var NotPrecedesSlantEqual = "⋠";
var NotReverseElement = "∌";
var NotRightTriangleBar = "⧐̸";
var NotRightTriangle = "⋫";
var NotRightTriangleEqual = "⋭";
var NotSquareSubset = "⊏̸";
var NotSquareSubsetEqual = "⋢";
var NotSquareSuperset = "⊐̸";
var NotSquareSupersetEqual = "⋣";
var NotSubset = "⊂⃒";
var NotSubsetEqual = "⊈";
var NotSucceeds = "⊁";
var NotSucceedsEqual = "⪰̸";
var NotSucceedsSlantEqual = "⋡";
var NotSucceedsTilde = "≿̸";
var NotSuperset = "⊃⃒";
var NotSupersetEqual = "⊉";
var NotTilde = "≁";
var NotTildeEqual = "≄";
var NotTildeFullEqual = "≇";
var NotTildeTilde = "≉";
var NotVerticalBar = "∤";
var nparallel = "∦";
var npar = "∦";
var nparsl = "⫽⃥";
var npart = "∂̸";
var npolint = "⨔";
var npr = "⊀";
var nprcue = "⋠";
var nprec = "⊀";
var npreceq = "⪯̸";
var npre = "⪯̸";
var nrarrc = "⤳̸";
var nrarr = "↛";
var nrArr = "⇏";
var nrarrw = "↝̸";
var nrightarrow = "↛";
var nRightarrow = "⇏";
var nrtri = "⋫";
var nrtrie = "⋭";
var nsc = "⊁";
var nsccue = "⋡";
var nsce = "⪰̸";
var Nscr = "𝒩";
var nscr = "𝓃";
var nshortmid = "∤";
var nshortparallel = "∦";
var nsim = "≁";
var nsime = "≄";
var nsimeq = "≄";
var nsmid = "∤";
var nspar = "∦";
var nsqsube = "⋢";
var nsqsupe = "⋣";
var nsub = "⊄";
var nsubE = "⫅̸";
var nsube = "⊈";
var nsubset = "⊂⃒";
var nsubseteq = "⊈";
var nsubseteqq = "⫅̸";
var nsucc = "⊁";
var nsucceq = "⪰̸";
var nsup = "⊅";
var nsupE = "⫆̸";
var nsupe = "⊉";
var nsupset = "⊃⃒";
var nsupseteq = "⊉";
var nsupseteqq = "⫆̸";
var ntgl = "≹";
var Ntilde = "Ñ";
var ntilde = "ñ";
var ntlg = "≸";
var ntriangleleft = "⋪";
var ntrianglelefteq = "⋬";
var ntriangleright = "⋫";
var ntrianglerighteq = "⋭";
var Nu = "Ν";
var nu = "ν";
var num = "#";
var numero = "№";
var numsp = " ";
var nvap = "≍⃒";
var nvdash = "⊬";
var nvDash = "⊭";
var nVdash = "⊮";
var nVDash = "⊯";
var nvge = "≥⃒";
var nvgt = ">⃒";
var nvHarr = "⤄";
var nvinfin = "⧞";
var nvlArr = "⤂";
var nvle = "≤⃒";
var nvlt = "<⃒";
var nvltrie = "⊴⃒";
var nvrArr = "⤃";
var nvrtrie = "⊵⃒";
var nvsim = "∼⃒";
var nwarhk = "⤣";
var nwarr = "↖";
var nwArr = "⇖";
var nwarrow = "↖";
var nwnear = "⤧";
var Oacute = "Ó";
var oacute = "ó";
var oast = "⊛";
var Ocirc = "Ô";
var ocirc = "ô";
var ocir = "⊚";
var Ocy = "О";
var ocy = "о";
var odash = "⊝";
var Odblac = "Ő";
var odblac = "ő";
var odiv = "⨸";
var odot = "⊙";
var odsold = "⦼";
var OElig = "Œ";
var oelig = "œ";
var ofcir = "⦿";
var Ofr = "𝔒";
var ofr = "𝔬";
var ogon = "˛";
var Ograve = "Ò";
var ograve = "ò";
var ogt = "⧁";
var ohbar = "⦵";
var ohm = "Ω";
var oint = "∮";
var olarr = "↺";
var olcir = "⦾";
var olcross = "⦻";
var oline = "‾";
var olt = "⧀";
var Omacr = "Ō";
var omacr = "ō";
var Omega = "Ω";
var omega = "ω";
var Omicron = "Ο";
var omicron = "ο";
var omid = "⦶";
var ominus = "⊖";
var Oopf = "𝕆";
var oopf = "𝕠";
var opar = "⦷";
var OpenCurlyDoubleQuote = "“";
var OpenCurlyQuote = "‘";
var operp = "⦹";
var oplus = "⊕";
var orarr = "↻";
var Or = "⩔";
var or = "∨";
var ord = "⩝";
var order = "ℴ";
var orderof = "ℴ";
var ordf = "ª";
var ordm = "º";
var origof = "⊶";
var oror = "⩖";
var orslope = "⩗";
var orv = "⩛";
var oS = "Ⓢ";
var Oscr = "𝒪";
var oscr = "ℴ";
var Oslash = "Ø";
var oslash = "ø";
var osol = "⊘";
var Otilde = "Õ";
var otilde = "õ";
var otimesas = "⨶";
var Otimes = "⨷";
var otimes = "⊗";
var Ouml = "Ö";
var ouml = "ö";
var ovbar = "⌽";
var OverBar = "‾";
var OverBrace = "⏞";
var OverBracket = "⎴";
var OverParenthesis = "⏜";
var para = "¶";
var parallel = "∥";
var par = "∥";
var parsim = "⫳";
var parsl = "⫽";
var part = "∂";
var PartialD = "∂";
var Pcy = "П";
var pcy = "п";
var percnt = "%";
var period = ".";
var permil = "‰";
var perp = "⊥";
var pertenk = "‱";
var Pfr = "𝔓";
var pfr = "𝔭";
var Phi = "Φ";
var phi = "φ";
var phiv = "ϕ";
var phmmat = "ℳ";
var phone = "☎";
var Pi = "Π";
var pi = "π";
var pitchfork = "⋔";
var piv = "ϖ";
var planck = "ℏ";
var planckh = "ℎ";
var plankv = "ℏ";
var plusacir = "⨣";
var plusb = "⊞";
var pluscir = "⨢";
var plus = "+";
var plusdo = "∔";
var plusdu = "⨥";
var pluse = "⩲";
var PlusMinus = "±";
var plusmn = "±";
var plussim = "⨦";
var plustwo = "⨧";
var pm = "±";
var Poincareplane = "ℌ";
var pointint = "⨕";
var popf = "𝕡";
var Popf = "ℙ";
var pound = "£";
var prap = "⪷";
var Pr = "⪻";
var pr = "≺";
var prcue = "≼";
var precapprox = "⪷";
var prec = "≺";
var preccurlyeq = "≼";
var Precedes = "≺";
var PrecedesEqual = "⪯";
var PrecedesSlantEqual = "≼";
var PrecedesTilde = "≾";
var preceq = "⪯";
var precnapprox = "⪹";
var precneqq = "⪵";
var precnsim = "⋨";
var pre = "⪯";
var prE = "⪳";
var precsim = "≾";
var prime = "′";
var Prime = "″";
var primes = "ℙ";
var prnap = "⪹";
var prnE = "⪵";
var prnsim = "⋨";
var prod = "∏";
var Product = "∏";
var profalar = "⌮";
var profline = "⌒";
var profsurf = "⌓";
var prop = "∝";
var Proportional = "∝";
var Proportion = "∷";
var propto = "∝";
var prsim = "≾";
var prurel = "⊰";
var Pscr = "𝒫";
var pscr = "𝓅";
var Psi = "Ψ";
var psi = "ψ";
var puncsp = " ";
var Qfr = "𝔔";
var qfr = "𝔮";
var qint = "⨌";
var qopf = "𝕢";
var Qopf = "ℚ";
var qprime = "⁗";
var Qscr = "𝒬";
var qscr = "𝓆";
var quaternions = "ℍ";
var quatint = "⨖";
var quest = "?";
var questeq = "≟";
var quot$1 = "\"";
var QUOT = "\"";
var rAarr = "⇛";
var race = "∽̱";
var Racute = "Ŕ";
var racute = "ŕ";
var radic = "√";
var raemptyv = "⦳";
var rang = "⟩";
var Rang = "⟫";
var rangd = "⦒";
var range = "⦥";
var rangle = "⟩";
var raquo = "»";
var rarrap = "⥵";
var rarrb = "⇥";
var rarrbfs = "⤠";
var rarrc = "⤳";
var rarr = "→";
var Rarr = "↠";
var rArr = "⇒";
var rarrfs = "⤞";
var rarrhk = "↪";
var rarrlp = "↬";
var rarrpl = "⥅";
var rarrsim = "⥴";
var Rarrtl = "⤖";
var rarrtl = "↣";
var rarrw = "↝";
var ratail = "⤚";
var rAtail = "⤜";
var ratio = "∶";
var rationals = "ℚ";
var rbarr = "⤍";
var rBarr = "⤏";
var RBarr = "⤐";
var rbbrk = "❳";
var rbrace = "}";
var rbrack = "]";
var rbrke = "⦌";
var rbrksld = "⦎";
var rbrkslu = "⦐";
var Rcaron = "Ř";
var rcaron = "ř";
var Rcedil = "Ŗ";
var rcedil = "ŗ";
var rceil = "⌉";
var rcub = "}";
var Rcy = "Р";
var rcy = "р";
var rdca = "⤷";
var rdldhar = "⥩";
var rdquo = "”";
var rdquor = "”";
var rdsh = "↳";
var real = "ℜ";
var realine = "ℛ";
var realpart = "ℜ";
var reals = "ℝ";
var Re = "ℜ";
var rect = "▭";
var reg = "®";
var REG = "®";
var ReverseElement = "∋";
var ReverseEquilibrium = "⇋";
var ReverseUpEquilibrium = "⥯";
var rfisht = "⥽";
var rfloor = "⌋";
var rfr = "𝔯";
var Rfr = "ℜ";
var rHar = "⥤";
var rhard = "⇁";
var rharu = "⇀";
var rharul = "⥬";
var Rho = "Ρ";
var rho = "ρ";
var rhov = "ϱ";
var RightAngleBracket = "⟩";
var RightArrowBar = "⇥";
var rightarrow = "→";
var RightArrow = "→";
var Rightarrow = "⇒";
var RightArrowLeftArrow = "⇄";
var rightarrowtail = "↣";
var RightCeiling = "⌉";
var RightDoubleBracket = "⟧";
var RightDownTeeVector = "⥝";
var RightDownVectorBar = "⥕";
var RightDownVector = "⇂";
var RightFloor = "⌋";
var rightharpoondown = "⇁";
var rightharpoonup = "⇀";
var rightleftarrows = "⇄";
var rightleftharpoons = "⇌";
var rightrightarrows = "⇉";
var rightsquigarrow = "↝";
var RightTeeArrow = "↦";
var RightTee = "⊢";
var RightTeeVector = "⥛";
var rightthreetimes = "⋌";
var RightTriangleBar = "⧐";
var RightTriangle = "⊳";
var RightTriangleEqual = "⊵";
var RightUpDownVector = "⥏";
var RightUpTeeVector = "⥜";
var RightUpVectorBar = "⥔";
var RightUpVector = "↾";
var RightVectorBar = "⥓";
var RightVector = "⇀";
var ring = "˚";
var risingdotseq = "≓";
var rlarr = "⇄";
var rlhar = "⇌";
var rlm = "‏";
var rmoustache = "⎱";
var rmoust = "⎱";
var rnmid = "⫮";
var roang = "⟭";
var roarr = "⇾";
var robrk = "⟧";
var ropar = "⦆";
var ropf = "𝕣";
var Ropf = "ℝ";
var roplus = "⨮";
var rotimes = "⨵";
var RoundImplies = "⥰";
var rpar = ")";
var rpargt = "⦔";
var rppolint = "⨒";
var rrarr = "⇉";
var Rrightarrow = "⇛";
var rsaquo = "›";
var rscr = "𝓇";
var Rscr = "ℛ";
var rsh = "↱";
var Rsh = "↱";
var rsqb = "]";
var rsquo = "’";
var rsquor = "’";
var rthree = "⋌";
var rtimes = "⋊";
var rtri = "▹";
var rtrie = "⊵";
var rtrif = "▸";
var rtriltri = "⧎";
var RuleDelayed = "⧴";
var ruluhar = "⥨";
var rx = "℞";
var Sacute = "Ś";
var sacute = "ś";
var sbquo = "‚";
var scap = "⪸";
var Scaron = "Š";
var scaron = "š";
var Sc = "⪼";
var sc = "≻";
var sccue = "≽";
var sce = "⪰";
var scE = "⪴";
var Scedil = "Ş";
var scedil = "ş";
var Scirc = "Ŝ";
var scirc = "ŝ";
var scnap = "⪺";
var scnE = "⪶";
var scnsim = "⋩";
var scpolint = "⨓";
var scsim = "≿";
var Scy = "С";
var scy = "с";
var sdotb = "⊡";
var sdot = "⋅";
var sdote = "⩦";
var searhk = "⤥";
var searr = "↘";
var seArr = "⇘";
var searrow = "↘";
var sect = "§";
var semi = ";";
var seswar = "⤩";
var setminus = "∖";
var setmn = "∖";
var sext = "✶";
var Sfr = "𝔖";
var sfr = "𝔰";
var sfrown = "⌢";
var sharp = "♯";
var SHCHcy = "Щ";
var shchcy = "щ";
var SHcy = "Ш";
var shcy = "ш";
var ShortDownArrow = "↓";
var ShortLeftArrow = "←";
var shortmid = "∣";
var shortparallel = "∥";
var ShortRightArrow = "→";
var ShortUpArrow = "↑";
var shy = "­";
var Sigma = "Σ";
var sigma = "σ";
var sigmaf = "ς";
var sigmav = "ς";
var sim = "∼";
var simdot = "⩪";
var sime = "≃";
var simeq = "≃";
var simg = "⪞";
var simgE = "⪠";
var siml = "⪝";
var simlE = "⪟";
var simne = "≆";
var simplus = "⨤";
var simrarr = "⥲";
var slarr = "←";
var SmallCircle = "∘";
var smallsetminus = "∖";
var smashp = "⨳";
var smeparsl = "⧤";
var smid = "∣";
var smile = "⌣";
var smt = "⪪";
var smte = "⪬";
var smtes = "⪬︀";
var SOFTcy = "Ь";
var softcy = "ь";
var solbar = "⌿";
var solb = "⧄";
var sol = "/";
var Sopf = "𝕊";
var sopf = "𝕤";
var spades = "♠";
var spadesuit = "♠";
var spar = "∥";
var sqcap = "⊓";
var sqcaps = "⊓︀";
var sqcup = "⊔";
var sqcups = "⊔︀";
var Sqrt = "√";
var sqsub = "⊏";
var sqsube = "⊑";
var sqsubset = "⊏";
var sqsubseteq = "⊑";
var sqsup = "⊐";
var sqsupe = "⊒";
var sqsupset = "⊐";
var sqsupseteq = "⊒";
var square = "□";
var Square = "□";
var SquareIntersection = "⊓";
var SquareSubset = "⊏";
var SquareSubsetEqual = "⊑";
var SquareSuperset = "⊐";
var SquareSupersetEqual = "⊒";
var SquareUnion = "⊔";
var squarf = "▪";
var squ = "□";
var squf = "▪";
var srarr = "→";
var Sscr = "𝒮";
var sscr = "𝓈";
var ssetmn = "∖";
var ssmile = "⌣";
var sstarf = "⋆";
var Star = "⋆";
var star = "☆";
var starf = "★";
var straightepsilon = "ϵ";
var straightphi = "ϕ";
var strns = "¯";
var sub = "⊂";
var Sub = "⋐";
var subdot = "⪽";
var subE = "⫅";
var sube = "⊆";
var subedot = "⫃";
var submult = "⫁";
var subnE = "⫋";
var subne = "⊊";
var subplus = "⪿";
var subrarr = "⥹";
var subset = "⊂";
var Subset = "⋐";
var subseteq = "⊆";
var subseteqq = "⫅";
var SubsetEqual = "⊆";
var subsetneq = "⊊";
var subsetneqq = "⫋";
var subsim = "⫇";
var subsub = "⫕";
var subsup = "⫓";
var succapprox = "⪸";
var succ = "≻";
var succcurlyeq = "≽";
var Succeeds = "≻";
var SucceedsEqual = "⪰";
var SucceedsSlantEqual = "≽";
var SucceedsTilde = "≿";
var succeq = "⪰";
var succnapprox = "⪺";
var succneqq = "⪶";
var succnsim = "⋩";
var succsim = "≿";
var SuchThat = "∋";
var sum = "∑";
var Sum = "∑";
var sung = "♪";
var sup1 = "¹";
var sup2 = "²";
var sup3 = "³";
var sup = "⊃";
var Sup = "⋑";
var supdot = "⪾";
var supdsub = "⫘";
var supE = "⫆";
var supe = "⊇";
var supedot = "⫄";
var Superset = "⊃";
var SupersetEqual = "⊇";
var suphsol = "⟉";
var suphsub = "⫗";
var suplarr = "⥻";
var supmult = "⫂";
var supnE = "⫌";
var supne = "⊋";
var supplus = "⫀";
var supset = "⊃";
var Supset = "⋑";
var supseteq = "⊇";
var supseteqq = "⫆";
var supsetneq = "⊋";
var supsetneqq = "⫌";
var supsim = "⫈";
var supsub = "⫔";
var supsup = "⫖";
var swarhk = "⤦";
var swarr = "↙";
var swArr = "⇙";
var swarrow = "↙";
var swnwar = "⤪";
var szlig = "ß";
var Tab = "\t";
var target = "⌖";
var Tau = "Τ";
var tau = "τ";
var tbrk = "⎴";
var Tcaron = "Ť";
var tcaron = "ť";
var Tcedil = "Ţ";
var tcedil = "ţ";
var Tcy = "Т";
var tcy = "т";
var tdot = "⃛";
var telrec = "⌕";
var Tfr = "𝔗";
var tfr = "𝔱";
var there4 = "∴";
var therefore = "∴";
var Therefore = "∴";
var Theta = "Θ";
var theta = "θ";
var thetasym = "ϑ";
var thetav = "ϑ";
var thickapprox = "≈";
var thicksim = "∼";
var ThickSpace = "  ";
var ThinSpace = " ";
var thinsp = " ";
var thkap = "≈";
var thksim = "∼";
var THORN = "Þ";
var thorn = "þ";
var tilde = "˜";
var Tilde = "∼";
var TildeEqual = "≃";
var TildeFullEqual = "≅";
var TildeTilde = "≈";
var timesbar = "⨱";
var timesb = "⊠";
var times$1 = "×";
var timesd = "⨰";
var tint = "∭";
var toea = "⤨";
var topbot = "⌶";
var topcir = "⫱";
var top = "⊤";
var Topf = "𝕋";
var topf = "𝕥";
var topfork = "⫚";
var tosa = "⤩";
var tprime = "‴";
var trade = "™";
var TRADE = "™";
var triangle = "▵";
var triangledown = "▿";
var triangleleft = "◃";
var trianglelefteq = "⊴";
var triangleq = "≜";
var triangleright = "▹";
var trianglerighteq = "⊵";
var tridot = "◬";
var trie = "≜";
var triminus = "⨺";
var TripleDot = "⃛";
var triplus = "⨹";
var trisb = "⧍";
var tritime = "⨻";
var trpezium = "⏢";
var Tscr = "𝒯";
var tscr = "𝓉";
var TScy = "Ц";
var tscy = "ц";
var TSHcy = "Ћ";
var tshcy = "ћ";
var Tstrok = "Ŧ";
var tstrok = "ŧ";
var twixt = "≬";
var twoheadleftarrow = "↞";
var twoheadrightarrow = "↠";
var Uacute = "Ú";
var uacute = "ú";
var uarr = "↑";
var Uarr = "↟";
var uArr = "⇑";
var Uarrocir = "⥉";
var Ubrcy = "Ў";
var ubrcy = "ў";
var Ubreve = "Ŭ";
var ubreve = "ŭ";
var Ucirc = "Û";
var ucirc = "û";
var Ucy = "У";
var ucy = "у";
var udarr = "⇅";
var Udblac = "Ű";
var udblac = "ű";
var udhar = "⥮";
var ufisht = "⥾";
var Ufr = "𝔘";
var ufr = "𝔲";
var Ugrave = "Ù";
var ugrave = "ù";
var uHar = "⥣";
var uharl = "↿";
var uharr = "↾";
var uhblk = "▀";
var ulcorn = "⌜";
var ulcorner = "⌜";
var ulcrop = "⌏";
var ultri = "◸";
var Umacr = "Ū";
var umacr = "ū";
var uml = "¨";
var UnderBar = "_";
var UnderBrace = "⏟";
var UnderBracket = "⎵";
var UnderParenthesis = "⏝";
var Union = "⋃";
var UnionPlus = "⊎";
var Uogon = "Ų";
var uogon = "ų";
var Uopf = "𝕌";
var uopf = "𝕦";
var UpArrowBar = "⤒";
var uparrow = "↑";
var UpArrow = "↑";
var Uparrow = "⇑";
var UpArrowDownArrow = "⇅";
var updownarrow = "↕";
var UpDownArrow = "↕";
var Updownarrow = "⇕";
var UpEquilibrium = "⥮";
var upharpoonleft = "↿";
var upharpoonright = "↾";
var uplus = "⊎";
var UpperLeftArrow = "↖";
var UpperRightArrow = "↗";
var upsi = "υ";
var Upsi = "ϒ";
var upsih = "ϒ";
var Upsilon = "Υ";
var upsilon = "υ";
var UpTeeArrow = "↥";
var UpTee = "⊥";
var upuparrows = "⇈";
var urcorn = "⌝";
var urcorner = "⌝";
var urcrop = "⌎";
var Uring = "Ů";
var uring = "ů";
var urtri = "◹";
var Uscr = "𝒰";
var uscr = "𝓊";
var utdot = "⋰";
var Utilde = "Ũ";
var utilde = "ũ";
var utri = "▵";
var utrif = "▴";
var uuarr = "⇈";
var Uuml = "Ü";
var uuml = "ü";
var uwangle = "⦧";
var vangrt = "⦜";
var varepsilon = "ϵ";
var varkappa = "ϰ";
var varnothing = "∅";
var varphi = "ϕ";
var varpi = "ϖ";
var varpropto = "∝";
var varr = "↕";
var vArr = "⇕";
var varrho = "ϱ";
var varsigma = "ς";
var varsubsetneq = "⊊︀";
var varsubsetneqq = "⫋︀";
var varsupsetneq = "⊋︀";
var varsupsetneqq = "⫌︀";
var vartheta = "ϑ";
var vartriangleleft = "⊲";
var vartriangleright = "⊳";
var vBar = "⫨";
var Vbar = "⫫";
var vBarv = "⫩";
var Vcy = "В";
var vcy = "в";
var vdash = "⊢";
var vDash = "⊨";
var Vdash = "⊩";
var VDash = "⊫";
var Vdashl = "⫦";
var veebar = "⊻";
var vee = "∨";
var Vee = "⋁";
var veeeq = "≚";
var vellip = "⋮";
var verbar = "|";
var Verbar = "‖";
var vert = "|";
var Vert = "‖";
var VerticalBar = "∣";
var VerticalLine = "|";
var VerticalSeparator = "❘";
var VerticalTilde = "≀";
var VeryThinSpace = " ";
var Vfr = "𝔙";
var vfr = "𝔳";
var vltri = "⊲";
var vnsub = "⊂⃒";
var vnsup = "⊃⃒";
var Vopf = "𝕍";
var vopf = "𝕧";
var vprop = "∝";
var vrtri = "⊳";
var Vscr = "𝒱";
var vscr = "𝓋";
var vsubnE = "⫋︀";
var vsubne = "⊊︀";
var vsupnE = "⫌︀";
var vsupne = "⊋︀";
var Vvdash = "⊪";
var vzigzag = "⦚";
var Wcirc = "Ŵ";
var wcirc = "ŵ";
var wedbar = "⩟";
var wedge = "∧";
var Wedge = "⋀";
var wedgeq = "≙";
var weierp = "℘";
var Wfr = "𝔚";
var wfr = "𝔴";
var Wopf = "𝕎";
var wopf = "𝕨";
var wp = "℘";
var wr = "≀";
var wreath = "≀";
var Wscr = "𝒲";
var wscr = "𝓌";
var xcap = "⋂";
var xcirc = "◯";
var xcup = "⋃";
var xdtri = "▽";
var Xfr = "𝔛";
var xfr = "𝔵";
var xharr = "⟷";
var xhArr = "⟺";
var Xi = "Ξ";
var xi = "ξ";
var xlarr = "⟵";
var xlArr = "⟸";
var xmap = "⟼";
var xnis = "⋻";
var xodot = "⨀";
var Xopf = "𝕏";
var xopf = "𝕩";
var xoplus = "⨁";
var xotime = "⨂";
var xrarr = "⟶";
var xrArr = "⟹";
var Xscr = "𝒳";
var xscr = "𝓍";
var xsqcup = "⨆";
var xuplus = "⨄";
var xutri = "△";
var xvee = "⋁";
var xwedge = "⋀";
var Yacute = "Ý";
var yacute = "ý";
var YAcy = "Я";
var yacy = "я";
var Ycirc = "Ŷ";
var ycirc = "ŷ";
var Ycy = "Ы";
var ycy = "ы";
var yen = "¥";
var Yfr = "𝔜";
var yfr = "𝔶";
var YIcy = "Ї";
var yicy = "ї";
var Yopf = "𝕐";
var yopf = "𝕪";
var Yscr = "𝒴";
var yscr = "𝓎";
var YUcy = "Ю";
var yucy = "ю";
var yuml = "ÿ";
var Yuml = "Ÿ";
var Zacute = "Ź";
var zacute = "ź";
var Zcaron = "Ž";
var zcaron = "ž";
var Zcy = "З";
var zcy = "з";
var Zdot = "Ż";
var zdot = "ż";
var zeetrf = "ℨ";
var ZeroWidthSpace = "​";
var Zeta = "Ζ";
var zeta = "ζ";
var zfr = "𝔷";
var Zfr = "ℨ";
var ZHcy = "Ж";
var zhcy = "ж";
var zigrarr = "⇝";
var zopf = "𝕫";
var Zopf = "ℤ";
var Zscr = "𝒵";
var zscr = "𝓏";
var zwj = "‍";
var zwnj = "‌";
var entitiesJSON = {
	Aacute: Aacute,
	aacute: aacute,
	Abreve: Abreve,
	abreve: abreve,
	ac: ac,
	acd: acd,
	acE: acE,
	Acirc: Acirc,
	acirc: acirc,
	acute: acute,
	Acy: Acy,
	acy: acy,
	AElig: AElig,
	aelig: aelig,
	af: af,
	Afr: Afr,
	afr: afr,
	Agrave: Agrave,
	agrave: agrave,
	alefsym: alefsym,
	aleph: aleph,
	Alpha: Alpha,
	alpha: alpha,
	Amacr: Amacr,
	amacr: amacr,
	amalg: amalg,
	amp: amp$1,
	AMP: AMP,
	andand: andand,
	And: And,
	and: and,
	andd: andd,
	andslope: andslope,
	andv: andv,
	ang: ang,
	ange: ange,
	angle: angle,
	angmsdaa: angmsdaa,
	angmsdab: angmsdab,
	angmsdac: angmsdac,
	angmsdad: angmsdad,
	angmsdae: angmsdae,
	angmsdaf: angmsdaf,
	angmsdag: angmsdag,
	angmsdah: angmsdah,
	angmsd: angmsd,
	angrt: angrt,
	angrtvb: angrtvb,
	angrtvbd: angrtvbd,
	angsph: angsph,
	angst: angst,
	angzarr: angzarr,
	Aogon: Aogon,
	aogon: aogon,
	Aopf: Aopf,
	aopf: aopf,
	apacir: apacir,
	ap: ap,
	apE: apE,
	ape: ape,
	apid: apid,
	apos: apos$1,
	ApplyFunction: ApplyFunction,
	approx: approx,
	approxeq: approxeq,
	Aring: Aring,
	aring: aring,
	Ascr: Ascr,
	ascr: ascr,
	Assign: Assign,
	ast: ast,
	asymp: asymp,
	asympeq: asympeq,
	Atilde: Atilde,
	atilde: atilde,
	Auml: Auml,
	auml: auml,
	awconint: awconint,
	awint: awint,
	backcong: backcong,
	backepsilon: backepsilon,
	backprime: backprime,
	backsim: backsim,
	backsimeq: backsimeq,
	Backslash: Backslash,
	Barv: Barv,
	barvee: barvee,
	barwed: barwed,
	Barwed: Barwed,
	barwedge: barwedge,
	bbrk: bbrk,
	bbrktbrk: bbrktbrk,
	bcong: bcong,
	Bcy: Bcy,
	bcy: bcy,
	bdquo: bdquo,
	becaus: becaus,
	because: because,
	Because: Because,
	bemptyv: bemptyv,
	bepsi: bepsi,
	bernou: bernou,
	Bernoullis: Bernoullis,
	Beta: Beta,
	beta: beta,
	beth: beth,
	between: between,
	Bfr: Bfr,
	bfr: bfr,
	bigcap: bigcap,
	bigcirc: bigcirc,
	bigcup: bigcup,
	bigodot: bigodot,
	bigoplus: bigoplus,
	bigotimes: bigotimes,
	bigsqcup: bigsqcup,
	bigstar: bigstar,
	bigtriangledown: bigtriangledown,
	bigtriangleup: bigtriangleup,
	biguplus: biguplus,
	bigvee: bigvee,
	bigwedge: bigwedge,
	bkarow: bkarow,
	blacklozenge: blacklozenge,
	blacksquare: blacksquare,
	blacktriangle: blacktriangle,
	blacktriangledown: blacktriangledown,
	blacktriangleleft: blacktriangleleft,
	blacktriangleright: blacktriangleright,
	blank: blank,
	blk12: blk12,
	blk14: blk14,
	blk34: blk34,
	block: block,
	bne: bne,
	bnequiv: bnequiv,
	bNot: bNot,
	bnot: bnot,
	Bopf: Bopf,
	bopf: bopf,
	bot: bot,
	bottom: bottom,
	bowtie: bowtie,
	boxbox: boxbox,
	boxdl: boxdl,
	boxdL: boxdL,
	boxDl: boxDl,
	boxDL: boxDL,
	boxdr: boxdr,
	boxdR: boxdR,
	boxDr: boxDr,
	boxDR: boxDR,
	boxh: boxh,
	boxH: boxH,
	boxhd: boxhd,
	boxHd: boxHd,
	boxhD: boxhD,
	boxHD: boxHD,
	boxhu: boxhu,
	boxHu: boxHu,
	boxhU: boxhU,
	boxHU: boxHU,
	boxminus: boxminus,
	boxplus: boxplus,
	boxtimes: boxtimes,
	boxul: boxul,
	boxuL: boxuL,
	boxUl: boxUl,
	boxUL: boxUL,
	boxur: boxur,
	boxuR: boxuR,
	boxUr: boxUr,
	boxUR: boxUR,
	boxv: boxv,
	boxV: boxV,
	boxvh: boxvh,
	boxvH: boxvH,
	boxVh: boxVh,
	boxVH: boxVH,
	boxvl: boxvl,
	boxvL: boxvL,
	boxVl: boxVl,
	boxVL: boxVL,
	boxvr: boxvr,
	boxvR: boxvR,
	boxVr: boxVr,
	boxVR: boxVR,
	bprime: bprime,
	breve: breve,
	Breve: Breve,
	brvbar: brvbar,
	bscr: bscr,
	Bscr: Bscr,
	bsemi: bsemi,
	bsim: bsim,
	bsime: bsime,
	bsolb: bsolb,
	bsol: bsol,
	bsolhsub: bsolhsub,
	bull: bull,
	bullet: bullet,
	bump: bump,
	bumpE: bumpE,
	bumpe: bumpe,
	Bumpeq: Bumpeq,
	bumpeq: bumpeq,
	Cacute: Cacute,
	cacute: cacute,
	capand: capand,
	capbrcup: capbrcup,
	capcap: capcap,
	cap: cap,
	Cap: Cap,
	capcup: capcup,
	capdot: capdot,
	CapitalDifferentialD: CapitalDifferentialD,
	caps: caps,
	caret: caret,
	caron: caron,
	Cayleys: Cayleys,
	ccaps: ccaps,
	Ccaron: Ccaron,
	ccaron: ccaron,
	Ccedil: Ccedil,
	ccedil: ccedil,
	Ccirc: Ccirc,
	ccirc: ccirc,
	Cconint: Cconint,
	ccups: ccups,
	ccupssm: ccupssm,
	Cdot: Cdot,
	cdot: cdot,
	cedil: cedil,
	Cedilla: Cedilla,
	cemptyv: cemptyv,
	cent: cent,
	centerdot: centerdot,
	CenterDot: CenterDot,
	cfr: cfr,
	Cfr: Cfr,
	CHcy: CHcy,
	chcy: chcy,
	check: check,
	checkmark: checkmark,
	Chi: Chi,
	chi: chi,
	circ: circ,
	circeq: circeq,
	circlearrowleft: circlearrowleft,
	circlearrowright: circlearrowright,
	circledast: circledast,
	circledcirc: circledcirc,
	circleddash: circleddash,
	CircleDot: CircleDot,
	circledR: circledR,
	circledS: circledS,
	CircleMinus: CircleMinus,
	CirclePlus: CirclePlus,
	CircleTimes: CircleTimes,
	cir: cir,
	cirE: cirE,
	cire: cire,
	cirfnint: cirfnint,
	cirmid: cirmid,
	cirscir: cirscir,
	ClockwiseContourIntegral: ClockwiseContourIntegral,
	CloseCurlyDoubleQuote: CloseCurlyDoubleQuote,
	CloseCurlyQuote: CloseCurlyQuote,
	clubs: clubs,
	clubsuit: clubsuit,
	colon: colon,
	Colon: Colon,
	Colone: Colone,
	colone: colone,
	coloneq: coloneq,
	comma: comma,
	commat: commat,
	comp: comp,
	compfn: compfn,
	complement: complement,
	complexes: complexes,
	cong: cong,
	congdot: congdot,
	Congruent: Congruent,
	conint: conint,
	Conint: Conint,
	ContourIntegral: ContourIntegral,
	copf: copf,
	Copf: Copf,
	coprod: coprod,
	Coproduct: Coproduct,
	copy: copy,
	COPY: COPY,
	copysr: copysr,
	CounterClockwiseContourIntegral: CounterClockwiseContourIntegral,
	crarr: crarr,
	cross: cross,
	Cross: Cross,
	Cscr: Cscr,
	cscr: cscr,
	csub: csub,
	csube: csube,
	csup: csup,
	csupe: csupe,
	ctdot: ctdot,
	cudarrl: cudarrl,
	cudarrr: cudarrr,
	cuepr: cuepr,
	cuesc: cuesc,
	cularr: cularr,
	cularrp: cularrp,
	cupbrcap: cupbrcap,
	cupcap: cupcap,
	CupCap: CupCap,
	cup: cup,
	Cup: Cup,
	cupcup: cupcup,
	cupdot: cupdot,
	cupor: cupor,
	cups: cups,
	curarr: curarr,
	curarrm: curarrm,
	curlyeqprec: curlyeqprec,
	curlyeqsucc: curlyeqsucc,
	curlyvee: curlyvee,
	curlywedge: curlywedge,
	curren: curren,
	curvearrowleft: curvearrowleft,
	curvearrowright: curvearrowright,
	cuvee: cuvee,
	cuwed: cuwed,
	cwconint: cwconint,
	cwint: cwint,
	cylcty: cylcty,
	dagger: dagger,
	Dagger: Dagger,
	daleth: daleth,
	darr: darr,
	Darr: Darr,
	dArr: dArr,
	dash: dash,
	Dashv: Dashv,
	dashv: dashv,
	dbkarow: dbkarow,
	dblac: dblac,
	Dcaron: Dcaron,
	dcaron: dcaron,
	Dcy: Dcy,
	dcy: dcy,
	ddagger: ddagger,
	ddarr: ddarr,
	DD: DD,
	dd: dd,
	DDotrahd: DDotrahd,
	ddotseq: ddotseq,
	deg: deg,
	Del: Del,
	Delta: Delta,
	delta: delta,
	demptyv: demptyv,
	dfisht: dfisht,
	Dfr: Dfr,
	dfr: dfr,
	dHar: dHar,
	dharl: dharl,
	dharr: dharr,
	DiacriticalAcute: DiacriticalAcute,
	DiacriticalDot: DiacriticalDot,
	DiacriticalDoubleAcute: DiacriticalDoubleAcute,
	DiacriticalGrave: DiacriticalGrave,
	DiacriticalTilde: DiacriticalTilde,
	diam: diam,
	diamond: diamond,
	Diamond: Diamond,
	diamondsuit: diamondsuit,
	diams: diams,
	die: die,
	DifferentialD: DifferentialD,
	digamma: digamma,
	disin: disin,
	div: div,
	divide: divide,
	divideontimes: divideontimes,
	divonx: divonx,
	DJcy: DJcy,
	djcy: djcy,
	dlcorn: dlcorn,
	dlcrop: dlcrop,
	dollar: dollar,
	Dopf: Dopf,
	dopf: dopf,
	Dot: Dot,
	dot: dot,
	DotDot: DotDot,
	doteq: doteq,
	doteqdot: doteqdot,
	DotEqual: DotEqual,
	dotminus: dotminus,
	dotplus: dotplus,
	dotsquare: dotsquare,
	doublebarwedge: doublebarwedge,
	DoubleContourIntegral: DoubleContourIntegral,
	DoubleDot: DoubleDot,
	DoubleDownArrow: DoubleDownArrow,
	DoubleLeftArrow: DoubleLeftArrow,
	DoubleLeftRightArrow: DoubleLeftRightArrow,
	DoubleLeftTee: DoubleLeftTee,
	DoubleLongLeftArrow: DoubleLongLeftArrow,
	DoubleLongLeftRightArrow: DoubleLongLeftRightArrow,
	DoubleLongRightArrow: DoubleLongRightArrow,
	DoubleRightArrow: DoubleRightArrow,
	DoubleRightTee: DoubleRightTee,
	DoubleUpArrow: DoubleUpArrow,
	DoubleUpDownArrow: DoubleUpDownArrow,
	DoubleVerticalBar: DoubleVerticalBar,
	DownArrowBar: DownArrowBar,
	downarrow: downarrow,
	DownArrow: DownArrow,
	Downarrow: Downarrow,
	DownArrowUpArrow: DownArrowUpArrow,
	DownBreve: DownBreve,
	downdownarrows: downdownarrows,
	downharpoonleft: downharpoonleft,
	downharpoonright: downharpoonright,
	DownLeftRightVector: DownLeftRightVector,
	DownLeftTeeVector: DownLeftTeeVector,
	DownLeftVectorBar: DownLeftVectorBar,
	DownLeftVector: DownLeftVector,
	DownRightTeeVector: DownRightTeeVector,
	DownRightVectorBar: DownRightVectorBar,
	DownRightVector: DownRightVector,
	DownTeeArrow: DownTeeArrow,
	DownTee: DownTee,
	drbkarow: drbkarow,
	drcorn: drcorn,
	drcrop: drcrop,
	Dscr: Dscr,
	dscr: dscr,
	DScy: DScy,
	dscy: dscy,
	dsol: dsol,
	Dstrok: Dstrok,
	dstrok: dstrok,
	dtdot: dtdot,
	dtri: dtri,
	dtrif: dtrif,
	duarr: duarr,
	duhar: duhar,
	dwangle: dwangle,
	DZcy: DZcy,
	dzcy: dzcy,
	dzigrarr: dzigrarr,
	Eacute: Eacute,
	eacute: eacute,
	easter: easter,
	Ecaron: Ecaron,
	ecaron: ecaron,
	Ecirc: Ecirc,
	ecirc: ecirc,
	ecir: ecir,
	ecolon: ecolon,
	Ecy: Ecy,
	ecy: ecy,
	eDDot: eDDot,
	Edot: Edot,
	edot: edot,
	eDot: eDot,
	ee: ee,
	efDot: efDot,
	Efr: Efr,
	efr: efr,
	eg: eg,
	Egrave: Egrave,
	egrave: egrave,
	egs: egs,
	egsdot: egsdot,
	el: el,
	Element: Element,
	elinters: elinters,
	ell: ell,
	els: els,
	elsdot: elsdot,
	Emacr: Emacr,
	emacr: emacr,
	empty: empty,
	emptyset: emptyset,
	EmptySmallSquare: EmptySmallSquare,
	emptyv: emptyv,
	EmptyVerySmallSquare: EmptyVerySmallSquare,
	emsp13: emsp13,
	emsp14: emsp14,
	emsp: emsp,
	ENG: ENG,
	eng: eng,
	ensp: ensp,
	Eogon: Eogon,
	eogon: eogon,
	Eopf: Eopf,
	eopf: eopf,
	epar: epar,
	eparsl: eparsl,
	eplus: eplus,
	epsi: epsi,
	Epsilon: Epsilon,
	epsilon: epsilon,
	epsiv: epsiv,
	eqcirc: eqcirc,
	eqcolon: eqcolon,
	eqsim: eqsim,
	eqslantgtr: eqslantgtr,
	eqslantless: eqslantless,
	Equal: Equal,
	equals: equals,
	EqualTilde: EqualTilde,
	equest: equest,
	Equilibrium: Equilibrium,
	equiv: equiv,
	equivDD: equivDD,
	eqvparsl: eqvparsl,
	erarr: erarr,
	erDot: erDot,
	escr: escr,
	Escr: Escr,
	esdot: esdot,
	Esim: Esim,
	esim: esim,
	Eta: Eta,
	eta: eta,
	ETH: ETH,
	eth: eth,
	Euml: Euml,
	euml: euml,
	euro: euro,
	excl: excl,
	exist: exist,
	Exists: Exists,
	expectation: expectation,
	exponentiale: exponentiale,
	ExponentialE: ExponentialE,
	fallingdotseq: fallingdotseq,
	Fcy: Fcy,
	fcy: fcy,
	female: female,
	ffilig: ffilig,
	fflig: fflig,
	ffllig: ffllig,
	Ffr: Ffr,
	ffr: ffr,
	filig: filig,
	FilledSmallSquare: FilledSmallSquare,
	FilledVerySmallSquare: FilledVerySmallSquare,
	fjlig: fjlig,
	flat: flat,
	fllig: fllig,
	fltns: fltns,
	fnof: fnof,
	Fopf: Fopf,
	fopf: fopf,
	forall: forall,
	ForAll: ForAll,
	fork: fork,
	forkv: forkv,
	Fouriertrf: Fouriertrf,
	fpartint: fpartint,
	frac12: frac12,
	frac13: frac13,
	frac14: frac14,
	frac15: frac15,
	frac16: frac16,
	frac18: frac18,
	frac23: frac23,
	frac25: frac25,
	frac34: frac34,
	frac35: frac35,
	frac38: frac38,
	frac45: frac45,
	frac56: frac56,
	frac58: frac58,
	frac78: frac78,
	frasl: frasl,
	frown: frown,
	fscr: fscr,
	Fscr: Fscr,
	gacute: gacute,
	Gamma: Gamma,
	gamma: gamma,
	Gammad: Gammad,
	gammad: gammad,
	gap: gap,
	Gbreve: Gbreve,
	gbreve: gbreve,
	Gcedil: Gcedil,
	Gcirc: Gcirc,
	gcirc: gcirc,
	Gcy: Gcy,
	gcy: gcy,
	Gdot: Gdot,
	gdot: gdot,
	ge: ge,
	gE: gE,
	gEl: gEl,
	gel: gel,
	geq: geq,
	geqq: geqq,
	geqslant: geqslant,
	gescc: gescc,
	ges: ges,
	gesdot: gesdot,
	gesdoto: gesdoto,
	gesdotol: gesdotol,
	gesl: gesl,
	gesles: gesles,
	Gfr: Gfr,
	gfr: gfr,
	gg: gg,
	Gg: Gg,
	ggg: ggg,
	gimel: gimel,
	GJcy: GJcy,
	gjcy: gjcy,
	gla: gla,
	gl: gl,
	glE: glE,
	glj: glj,
	gnap: gnap,
	gnapprox: gnapprox,
	gne: gne,
	gnE: gnE,
	gneq: gneq,
	gneqq: gneqq,
	gnsim: gnsim,
	Gopf: Gopf,
	gopf: gopf,
	grave: grave,
	GreaterEqual: GreaterEqual,
	GreaterEqualLess: GreaterEqualLess,
	GreaterFullEqual: GreaterFullEqual,
	GreaterGreater: GreaterGreater,
	GreaterLess: GreaterLess,
	GreaterSlantEqual: GreaterSlantEqual,
	GreaterTilde: GreaterTilde,
	Gscr: Gscr,
	gscr: gscr,
	gsim: gsim,
	gsime: gsime,
	gsiml: gsiml,
	gtcc: gtcc,
	gtcir: gtcir,
	gt: gt$1,
	GT: GT,
	Gt: Gt,
	gtdot: gtdot,
	gtlPar: gtlPar,
	gtquest: gtquest,
	gtrapprox: gtrapprox,
	gtrarr: gtrarr,
	gtrdot: gtrdot,
	gtreqless: gtreqless,
	gtreqqless: gtreqqless,
	gtrless: gtrless,
	gtrsim: gtrsim,
	gvertneqq: gvertneqq,
	gvnE: gvnE,
	Hacek: Hacek,
	hairsp: hairsp,
	half: half,
	hamilt: hamilt,
	HARDcy: HARDcy,
	hardcy: hardcy,
	harrcir: harrcir,
	harr: harr,
	hArr: hArr,
	harrw: harrw,
	Hat: Hat,
	hbar: hbar,
	Hcirc: Hcirc,
	hcirc: hcirc,
	hearts: hearts,
	heartsuit: heartsuit,
	hellip: hellip,
	hercon: hercon,
	hfr: hfr,
	Hfr: Hfr,
	HilbertSpace: HilbertSpace,
	hksearow: hksearow,
	hkswarow: hkswarow,
	hoarr: hoarr,
	homtht: homtht,
	hookleftarrow: hookleftarrow,
	hookrightarrow: hookrightarrow,
	hopf: hopf,
	Hopf: Hopf,
	horbar: horbar,
	HorizontalLine: HorizontalLine,
	hscr: hscr,
	Hscr: Hscr,
	hslash: hslash,
	Hstrok: Hstrok,
	hstrok: hstrok,
	HumpDownHump: HumpDownHump,
	HumpEqual: HumpEqual,
	hybull: hybull,
	hyphen: hyphen,
	Iacute: Iacute,
	iacute: iacute,
	ic: ic,
	Icirc: Icirc,
	icirc: icirc,
	Icy: Icy,
	icy: icy,
	Idot: Idot,
	IEcy: IEcy,
	iecy: iecy,
	iexcl: iexcl,
	iff: iff,
	ifr: ifr,
	Ifr: Ifr,
	Igrave: Igrave,
	igrave: igrave,
	ii: ii,
	iiiint: iiiint,
	iiint: iiint,
	iinfin: iinfin,
	iiota: iiota,
	IJlig: IJlig,
	ijlig: ijlig,
	Imacr: Imacr,
	imacr: imacr,
	image: image,
	ImaginaryI: ImaginaryI,
	imagline: imagline,
	imagpart: imagpart,
	imath: imath,
	Im: Im,
	imof: imof,
	imped: imped,
	Implies: Implies,
	incare: incare,
	infin: infin,
	infintie: infintie,
	inodot: inodot,
	intcal: intcal,
	int: int,
	Int: Int,
	integers: integers,
	Integral: Integral,
	intercal: intercal,
	Intersection: Intersection,
	intlarhk: intlarhk,
	intprod: intprod,
	InvisibleComma: InvisibleComma,
	InvisibleTimes: InvisibleTimes,
	IOcy: IOcy,
	iocy: iocy,
	Iogon: Iogon,
	iogon: iogon,
	Iopf: Iopf,
	iopf: iopf,
	Iota: Iota,
	iota: iota,
	iprod: iprod,
	iquest: iquest,
	iscr: iscr,
	Iscr: Iscr,
	isin: isin,
	isindot: isindot,
	isinE: isinE,
	isins: isins,
	isinsv: isinsv,
	isinv: isinv,
	it: it,
	Itilde: Itilde,
	itilde: itilde,
	Iukcy: Iukcy,
	iukcy: iukcy,
	Iuml: Iuml,
	iuml: iuml,
	Jcirc: Jcirc,
	jcirc: jcirc,
	Jcy: Jcy,
	jcy: jcy,
	Jfr: Jfr,
	jfr: jfr,
	jmath: jmath,
	Jopf: Jopf,
	jopf: jopf,
	Jscr: Jscr,
	jscr: jscr,
	Jsercy: Jsercy,
	jsercy: jsercy,
	Jukcy: Jukcy,
	jukcy: jukcy,
	Kappa: Kappa,
	kappa: kappa,
	kappav: kappav,
	Kcedil: Kcedil,
	kcedil: kcedil,
	Kcy: Kcy,
	kcy: kcy,
	Kfr: Kfr,
	kfr: kfr,
	kgreen: kgreen,
	KHcy: KHcy,
	khcy: khcy,
	KJcy: KJcy,
	kjcy: kjcy,
	Kopf: Kopf,
	kopf: kopf,
	Kscr: Kscr,
	kscr: kscr,
	lAarr: lAarr,
	Lacute: Lacute,
	lacute: lacute,
	laemptyv: laemptyv,
	lagran: lagran,
	Lambda: Lambda,
	lambda: lambda,
	lang: lang,
	Lang: Lang,
	langd: langd,
	langle: langle,
	lap: lap,
	Laplacetrf: Laplacetrf,
	laquo: laquo,
	larrb: larrb,
	larrbfs: larrbfs,
	larr: larr,
	Larr: Larr,
	lArr: lArr,
	larrfs: larrfs,
	larrhk: larrhk,
	larrlp: larrlp,
	larrpl: larrpl,
	larrsim: larrsim,
	larrtl: larrtl,
	latail: latail,
	lAtail: lAtail,
	lat: lat,
	late: late,
	lates: lates,
	lbarr: lbarr,
	lBarr: lBarr,
	lbbrk: lbbrk,
	lbrace: lbrace,
	lbrack: lbrack,
	lbrke: lbrke,
	lbrksld: lbrksld,
	lbrkslu: lbrkslu,
	Lcaron: Lcaron,
	lcaron: lcaron,
	Lcedil: Lcedil,
	lcedil: lcedil,
	lceil: lceil,
	lcub: lcub,
	Lcy: Lcy,
	lcy: lcy,
	ldca: ldca,
	ldquo: ldquo,
	ldquor: ldquor,
	ldrdhar: ldrdhar,
	ldrushar: ldrushar,
	ldsh: ldsh,
	le: le,
	lE: lE,
	LeftAngleBracket: LeftAngleBracket,
	LeftArrowBar: LeftArrowBar,
	leftarrow: leftarrow,
	LeftArrow: LeftArrow,
	Leftarrow: Leftarrow,
	LeftArrowRightArrow: LeftArrowRightArrow,
	leftarrowtail: leftarrowtail,
	LeftCeiling: LeftCeiling,
	LeftDoubleBracket: LeftDoubleBracket,
	LeftDownTeeVector: LeftDownTeeVector,
	LeftDownVectorBar: LeftDownVectorBar,
	LeftDownVector: LeftDownVector,
	LeftFloor: LeftFloor,
	leftharpoondown: leftharpoondown,
	leftharpoonup: leftharpoonup,
	leftleftarrows: leftleftarrows,
	leftrightarrow: leftrightarrow,
	LeftRightArrow: LeftRightArrow,
	Leftrightarrow: Leftrightarrow,
	leftrightarrows: leftrightarrows,
	leftrightharpoons: leftrightharpoons,
	leftrightsquigarrow: leftrightsquigarrow,
	LeftRightVector: LeftRightVector,
	LeftTeeArrow: LeftTeeArrow,
	LeftTee: LeftTee,
	LeftTeeVector: LeftTeeVector,
	leftthreetimes: leftthreetimes,
	LeftTriangleBar: LeftTriangleBar,
	LeftTriangle: LeftTriangle,
	LeftTriangleEqual: LeftTriangleEqual,
	LeftUpDownVector: LeftUpDownVector,
	LeftUpTeeVector: LeftUpTeeVector,
	LeftUpVectorBar: LeftUpVectorBar,
	LeftUpVector: LeftUpVector,
	LeftVectorBar: LeftVectorBar,
	LeftVector: LeftVector,
	lEg: lEg,
	leg: leg,
	leq: leq,
	leqq: leqq,
	leqslant: leqslant,
	lescc: lescc,
	les: les,
	lesdot: lesdot,
	lesdoto: lesdoto,
	lesdotor: lesdotor,
	lesg: lesg,
	lesges: lesges,
	lessapprox: lessapprox,
	lessdot: lessdot,
	lesseqgtr: lesseqgtr,
	lesseqqgtr: lesseqqgtr,
	LessEqualGreater: LessEqualGreater,
	LessFullEqual: LessFullEqual,
	LessGreater: LessGreater,
	lessgtr: lessgtr,
	LessLess: LessLess,
	lesssim: lesssim,
	LessSlantEqual: LessSlantEqual,
	LessTilde: LessTilde,
	lfisht: lfisht,
	lfloor: lfloor,
	Lfr: Lfr,
	lfr: lfr,
	lg: lg,
	lgE: lgE,
	lHar: lHar,
	lhard: lhard,
	lharu: lharu,
	lharul: lharul,
	lhblk: lhblk,
	LJcy: LJcy,
	ljcy: ljcy,
	llarr: llarr,
	ll: ll,
	Ll: Ll,
	llcorner: llcorner,
	Lleftarrow: Lleftarrow,
	llhard: llhard,
	lltri: lltri,
	Lmidot: Lmidot,
	lmidot: lmidot,
	lmoustache: lmoustache,
	lmoust: lmoust,
	lnap: lnap,
	lnapprox: lnapprox,
	lne: lne,
	lnE: lnE,
	lneq: lneq,
	lneqq: lneqq,
	lnsim: lnsim,
	loang: loang,
	loarr: loarr,
	lobrk: lobrk,
	longleftarrow: longleftarrow,
	LongLeftArrow: LongLeftArrow,
	Longleftarrow: Longleftarrow,
	longleftrightarrow: longleftrightarrow,
	LongLeftRightArrow: LongLeftRightArrow,
	Longleftrightarrow: Longleftrightarrow,
	longmapsto: longmapsto,
	longrightarrow: longrightarrow,
	LongRightArrow: LongRightArrow,
	Longrightarrow: Longrightarrow,
	looparrowleft: looparrowleft,
	looparrowright: looparrowright,
	lopar: lopar,
	Lopf: Lopf,
	lopf: lopf,
	loplus: loplus,
	lotimes: lotimes,
	lowast: lowast,
	lowbar: lowbar,
	LowerLeftArrow: LowerLeftArrow,
	LowerRightArrow: LowerRightArrow,
	loz: loz,
	lozenge: lozenge,
	lozf: lozf,
	lpar: lpar,
	lparlt: lparlt,
	lrarr: lrarr,
	lrcorner: lrcorner,
	lrhar: lrhar,
	lrhard: lrhard,
	lrm: lrm,
	lrtri: lrtri,
	lsaquo: lsaquo,
	lscr: lscr,
	Lscr: Lscr,
	lsh: lsh,
	Lsh: Lsh,
	lsim: lsim,
	lsime: lsime,
	lsimg: lsimg,
	lsqb: lsqb,
	lsquo: lsquo,
	lsquor: lsquor,
	Lstrok: Lstrok,
	lstrok: lstrok,
	ltcc: ltcc,
	ltcir: ltcir,
	lt: lt$1,
	LT: LT,
	Lt: Lt,
	ltdot: ltdot,
	lthree: lthree,
	ltimes: ltimes,
	ltlarr: ltlarr,
	ltquest: ltquest,
	ltri: ltri,
	ltrie: ltrie,
	ltrif: ltrif,
	ltrPar: ltrPar,
	lurdshar: lurdshar,
	luruhar: luruhar,
	lvertneqq: lvertneqq,
	lvnE: lvnE,
	macr: macr,
	male: male,
	malt: malt,
	maltese: maltese,
	map: map$1,
	mapsto: mapsto,
	mapstodown: mapstodown,
	mapstoleft: mapstoleft,
	mapstoup: mapstoup,
	marker: marker,
	mcomma: mcomma,
	Mcy: Mcy,
	mcy: mcy,
	mdash: mdash,
	mDDot: mDDot,
	measuredangle: measuredangle,
	MediumSpace: MediumSpace,
	Mellintrf: Mellintrf,
	Mfr: Mfr,
	mfr: mfr,
	mho: mho,
	micro: micro,
	midast: midast,
	midcir: midcir,
	mid: mid,
	middot: middot,
	minusb: minusb,
	minus: minus,
	minusd: minusd,
	minusdu: minusdu,
	MinusPlus: MinusPlus,
	mlcp: mlcp,
	mldr: mldr,
	mnplus: mnplus,
	models: models,
	Mopf: Mopf,
	mopf: mopf,
	mp: mp,
	mscr: mscr,
	Mscr: Mscr,
	mstpos: mstpos,
	Mu: Mu,
	mu: mu,
	multimap: multimap,
	mumap: mumap,
	nabla: nabla,
	Nacute: Nacute,
	nacute: nacute,
	nang: nang,
	nap: nap,
	napE: napE,
	napid: napid,
	napos: napos,
	napprox: napprox,
	natural: natural,
	naturals: naturals,
	natur: natur,
	nbsp: nbsp,
	nbump: nbump,
	nbumpe: nbumpe,
	ncap: ncap,
	Ncaron: Ncaron,
	ncaron: ncaron,
	Ncedil: Ncedil,
	ncedil: ncedil,
	ncong: ncong,
	ncongdot: ncongdot,
	ncup: ncup,
	Ncy: Ncy,
	ncy: ncy,
	ndash: ndash,
	nearhk: nearhk,
	nearr: nearr,
	neArr: neArr,
	nearrow: nearrow,
	ne: ne,
	nedot: nedot,
	NegativeMediumSpace: NegativeMediumSpace,
	NegativeThickSpace: NegativeThickSpace,
	NegativeThinSpace: NegativeThinSpace,
	NegativeVeryThinSpace: NegativeVeryThinSpace,
	nequiv: nequiv,
	nesear: nesear,
	nesim: nesim,
	NestedGreaterGreater: NestedGreaterGreater,
	NestedLessLess: NestedLessLess,
	NewLine: NewLine,
	nexist: nexist,
	nexists: nexists,
	Nfr: Nfr,
	nfr: nfr,
	ngE: ngE,
	nge: nge,
	ngeq: ngeq,
	ngeqq: ngeqq,
	ngeqslant: ngeqslant,
	nges: nges,
	nGg: nGg,
	ngsim: ngsim,
	nGt: nGt,
	ngt: ngt,
	ngtr: ngtr,
	nGtv: nGtv,
	nharr: nharr,
	nhArr: nhArr,
	nhpar: nhpar,
	ni: ni,
	nis: nis,
	nisd: nisd,
	niv: niv,
	NJcy: NJcy,
	njcy: njcy,
	nlarr: nlarr,
	nlArr: nlArr,
	nldr: nldr,
	nlE: nlE,
	nle: nle,
	nleftarrow: nleftarrow,
	nLeftarrow: nLeftarrow,
	nleftrightarrow: nleftrightarrow,
	nLeftrightarrow: nLeftrightarrow,
	nleq: nleq,
	nleqq: nleqq,
	nleqslant: nleqslant,
	nles: nles,
	nless: nless,
	nLl: nLl,
	nlsim: nlsim,
	nLt: nLt,
	nlt: nlt,
	nltri: nltri,
	nltrie: nltrie,
	nLtv: nLtv,
	nmid: nmid,
	NoBreak: NoBreak,
	NonBreakingSpace: NonBreakingSpace,
	nopf: nopf,
	Nopf: Nopf,
	Not: Not,
	not: not,
	NotCongruent: NotCongruent,
	NotCupCap: NotCupCap,
	NotDoubleVerticalBar: NotDoubleVerticalBar,
	NotElement: NotElement,
	NotEqual: NotEqual,
	NotEqualTilde: NotEqualTilde,
	NotExists: NotExists,
	NotGreater: NotGreater,
	NotGreaterEqual: NotGreaterEqual,
	NotGreaterFullEqual: NotGreaterFullEqual,
	NotGreaterGreater: NotGreaterGreater,
	NotGreaterLess: NotGreaterLess,
	NotGreaterSlantEqual: NotGreaterSlantEqual,
	NotGreaterTilde: NotGreaterTilde,
	NotHumpDownHump: NotHumpDownHump,
	NotHumpEqual: NotHumpEqual,
	notin: notin,
	notindot: notindot,
	notinE: notinE,
	notinva: notinva,
	notinvb: notinvb,
	notinvc: notinvc,
	NotLeftTriangleBar: NotLeftTriangleBar,
	NotLeftTriangle: NotLeftTriangle,
	NotLeftTriangleEqual: NotLeftTriangleEqual,
	NotLess: NotLess,
	NotLessEqual: NotLessEqual,
	NotLessGreater: NotLessGreater,
	NotLessLess: NotLessLess,
	NotLessSlantEqual: NotLessSlantEqual,
	NotLessTilde: NotLessTilde,
	NotNestedGreaterGreater: NotNestedGreaterGreater,
	NotNestedLessLess: NotNestedLessLess,
	notni: notni,
	notniva: notniva,
	notnivb: notnivb,
	notnivc: notnivc,
	NotPrecedes: NotPrecedes,
	NotPrecedesEqual: NotPrecedesEqual,
	NotPrecedesSlantEqual: NotPrecedesSlantEqual,
	NotReverseElement: NotReverseElement,
	NotRightTriangleBar: NotRightTriangleBar,
	NotRightTriangle: NotRightTriangle,
	NotRightTriangleEqual: NotRightTriangleEqual,
	NotSquareSubset: NotSquareSubset,
	NotSquareSubsetEqual: NotSquareSubsetEqual,
	NotSquareSuperset: NotSquareSuperset,
	NotSquareSupersetEqual: NotSquareSupersetEqual,
	NotSubset: NotSubset,
	NotSubsetEqual: NotSubsetEqual,
	NotSucceeds: NotSucceeds,
	NotSucceedsEqual: NotSucceedsEqual,
	NotSucceedsSlantEqual: NotSucceedsSlantEqual,
	NotSucceedsTilde: NotSucceedsTilde,
	NotSuperset: NotSuperset,
	NotSupersetEqual: NotSupersetEqual,
	NotTilde: NotTilde,
	NotTildeEqual: NotTildeEqual,
	NotTildeFullEqual: NotTildeFullEqual,
	NotTildeTilde: NotTildeTilde,
	NotVerticalBar: NotVerticalBar,
	nparallel: nparallel,
	npar: npar,
	nparsl: nparsl,
	npart: npart,
	npolint: npolint,
	npr: npr,
	nprcue: nprcue,
	nprec: nprec,
	npreceq: npreceq,
	npre: npre,
	nrarrc: nrarrc,
	nrarr: nrarr,
	nrArr: nrArr,
	nrarrw: nrarrw,
	nrightarrow: nrightarrow,
	nRightarrow: nRightarrow,
	nrtri: nrtri,
	nrtrie: nrtrie,
	nsc: nsc,
	nsccue: nsccue,
	nsce: nsce,
	Nscr: Nscr,
	nscr: nscr,
	nshortmid: nshortmid,
	nshortparallel: nshortparallel,
	nsim: nsim,
	nsime: nsime,
	nsimeq: nsimeq,
	nsmid: nsmid,
	nspar: nspar,
	nsqsube: nsqsube,
	nsqsupe: nsqsupe,
	nsub: nsub,
	nsubE: nsubE,
	nsube: nsube,
	nsubset: nsubset,
	nsubseteq: nsubseteq,
	nsubseteqq: nsubseteqq,
	nsucc: nsucc,
	nsucceq: nsucceq,
	nsup: nsup,
	nsupE: nsupE,
	nsupe: nsupe,
	nsupset: nsupset,
	nsupseteq: nsupseteq,
	nsupseteqq: nsupseteqq,
	ntgl: ntgl,
	Ntilde: Ntilde,
	ntilde: ntilde,
	ntlg: ntlg,
	ntriangleleft: ntriangleleft,
	ntrianglelefteq: ntrianglelefteq,
	ntriangleright: ntriangleright,
	ntrianglerighteq: ntrianglerighteq,
	Nu: Nu,
	nu: nu,
	num: num,
	numero: numero,
	numsp: numsp,
	nvap: nvap,
	nvdash: nvdash,
	nvDash: nvDash,
	nVdash: nVdash,
	nVDash: nVDash,
	nvge: nvge,
	nvgt: nvgt,
	nvHarr: nvHarr,
	nvinfin: nvinfin,
	nvlArr: nvlArr,
	nvle: nvle,
	nvlt: nvlt,
	nvltrie: nvltrie,
	nvrArr: nvrArr,
	nvrtrie: nvrtrie,
	nvsim: nvsim,
	nwarhk: nwarhk,
	nwarr: nwarr,
	nwArr: nwArr,
	nwarrow: nwarrow,
	nwnear: nwnear,
	Oacute: Oacute,
	oacute: oacute,
	oast: oast,
	Ocirc: Ocirc,
	ocirc: ocirc,
	ocir: ocir,
	Ocy: Ocy,
	ocy: ocy,
	odash: odash,
	Odblac: Odblac,
	odblac: odblac,
	odiv: odiv,
	odot: odot,
	odsold: odsold,
	OElig: OElig,
	oelig: oelig,
	ofcir: ofcir,
	Ofr: Ofr,
	ofr: ofr,
	ogon: ogon,
	Ograve: Ograve,
	ograve: ograve,
	ogt: ogt,
	ohbar: ohbar,
	ohm: ohm,
	oint: oint,
	olarr: olarr,
	olcir: olcir,
	olcross: olcross,
	oline: oline,
	olt: olt,
	Omacr: Omacr,
	omacr: omacr,
	Omega: Omega,
	omega: omega,
	Omicron: Omicron,
	omicron: omicron,
	omid: omid,
	ominus: ominus,
	Oopf: Oopf,
	oopf: oopf,
	opar: opar,
	OpenCurlyDoubleQuote: OpenCurlyDoubleQuote,
	OpenCurlyQuote: OpenCurlyQuote,
	operp: operp,
	oplus: oplus,
	orarr: orarr,
	Or: Or,
	or: or,
	ord: ord,
	order: order,
	orderof: orderof,
	ordf: ordf,
	ordm: ordm,
	origof: origof,
	oror: oror,
	orslope: orslope,
	orv: orv,
	oS: oS,
	Oscr: Oscr,
	oscr: oscr,
	Oslash: Oslash,
	oslash: oslash,
	osol: osol,
	Otilde: Otilde,
	otilde: otilde,
	otimesas: otimesas,
	Otimes: Otimes,
	otimes: otimes,
	Ouml: Ouml,
	ouml: ouml,
	ovbar: ovbar,
	OverBar: OverBar,
	OverBrace: OverBrace,
	OverBracket: OverBracket,
	OverParenthesis: OverParenthesis,
	para: para,
	parallel: parallel,
	par: par,
	parsim: parsim,
	parsl: parsl,
	part: part,
	PartialD: PartialD,
	Pcy: Pcy,
	pcy: pcy,
	percnt: percnt,
	period: period,
	permil: permil,
	perp: perp,
	pertenk: pertenk,
	Pfr: Pfr,
	pfr: pfr,
	Phi: Phi,
	phi: phi,
	phiv: phiv,
	phmmat: phmmat,
	phone: phone,
	Pi: Pi,
	pi: pi,
	pitchfork: pitchfork,
	piv: piv,
	planck: planck,
	planckh: planckh,
	plankv: plankv,
	plusacir: plusacir,
	plusb: plusb,
	pluscir: pluscir,
	plus: plus,
	plusdo: plusdo,
	plusdu: plusdu,
	pluse: pluse,
	PlusMinus: PlusMinus,
	plusmn: plusmn,
	plussim: plussim,
	plustwo: plustwo,
	pm: pm,
	Poincareplane: Poincareplane,
	pointint: pointint,
	popf: popf,
	Popf: Popf,
	pound: pound,
	prap: prap,
	Pr: Pr,
	pr: pr,
	prcue: prcue,
	precapprox: precapprox,
	prec: prec,
	preccurlyeq: preccurlyeq,
	Precedes: Precedes,
	PrecedesEqual: PrecedesEqual,
	PrecedesSlantEqual: PrecedesSlantEqual,
	PrecedesTilde: PrecedesTilde,
	preceq: preceq,
	precnapprox: precnapprox,
	precneqq: precneqq,
	precnsim: precnsim,
	pre: pre,
	prE: prE,
	precsim: precsim,
	prime: prime,
	Prime: Prime,
	primes: primes,
	prnap: prnap,
	prnE: prnE,
	prnsim: prnsim,
	prod: prod,
	Product: Product,
	profalar: profalar,
	profline: profline,
	profsurf: profsurf,
	prop: prop,
	Proportional: Proportional,
	Proportion: Proportion,
	propto: propto,
	prsim: prsim,
	prurel: prurel,
	Pscr: Pscr,
	pscr: pscr,
	Psi: Psi,
	psi: psi,
	puncsp: puncsp,
	Qfr: Qfr,
	qfr: qfr,
	qint: qint,
	qopf: qopf,
	Qopf: Qopf,
	qprime: qprime,
	Qscr: Qscr,
	qscr: qscr,
	quaternions: quaternions,
	quatint: quatint,
	quest: quest,
	questeq: questeq,
	quot: quot$1,
	QUOT: QUOT,
	rAarr: rAarr,
	race: race,
	Racute: Racute,
	racute: racute,
	radic: radic,
	raemptyv: raemptyv,
	rang: rang,
	Rang: Rang,
	rangd: rangd,
	range: range,
	rangle: rangle,
	raquo: raquo,
	rarrap: rarrap,
	rarrb: rarrb,
	rarrbfs: rarrbfs,
	rarrc: rarrc,
	rarr: rarr,
	Rarr: Rarr,
	rArr: rArr,
	rarrfs: rarrfs,
	rarrhk: rarrhk,
	rarrlp: rarrlp,
	rarrpl: rarrpl,
	rarrsim: rarrsim,
	Rarrtl: Rarrtl,
	rarrtl: rarrtl,
	rarrw: rarrw,
	ratail: ratail,
	rAtail: rAtail,
	ratio: ratio,
	rationals: rationals,
	rbarr: rbarr,
	rBarr: rBarr,
	RBarr: RBarr,
	rbbrk: rbbrk,
	rbrace: rbrace,
	rbrack: rbrack,
	rbrke: rbrke,
	rbrksld: rbrksld,
	rbrkslu: rbrkslu,
	Rcaron: Rcaron,
	rcaron: rcaron,
	Rcedil: Rcedil,
	rcedil: rcedil,
	rceil: rceil,
	rcub: rcub,
	Rcy: Rcy,
	rcy: rcy,
	rdca: rdca,
	rdldhar: rdldhar,
	rdquo: rdquo,
	rdquor: rdquor,
	rdsh: rdsh,
	real: real,
	realine: realine,
	realpart: realpart,
	reals: reals,
	Re: Re,
	rect: rect,
	reg: reg,
	REG: REG,
	ReverseElement: ReverseElement,
	ReverseEquilibrium: ReverseEquilibrium,
	ReverseUpEquilibrium: ReverseUpEquilibrium,
	rfisht: rfisht,
	rfloor: rfloor,
	rfr: rfr,
	Rfr: Rfr,
	rHar: rHar,
	rhard: rhard,
	rharu: rharu,
	rharul: rharul,
	Rho: Rho,
	rho: rho,
	rhov: rhov,
	RightAngleBracket: RightAngleBracket,
	RightArrowBar: RightArrowBar,
	rightarrow: rightarrow,
	RightArrow: RightArrow,
	Rightarrow: Rightarrow,
	RightArrowLeftArrow: RightArrowLeftArrow,
	rightarrowtail: rightarrowtail,
	RightCeiling: RightCeiling,
	RightDoubleBracket: RightDoubleBracket,
	RightDownTeeVector: RightDownTeeVector,
	RightDownVectorBar: RightDownVectorBar,
	RightDownVector: RightDownVector,
	RightFloor: RightFloor,
	rightharpoondown: rightharpoondown,
	rightharpoonup: rightharpoonup,
	rightleftarrows: rightleftarrows,
	rightleftharpoons: rightleftharpoons,
	rightrightarrows: rightrightarrows,
	rightsquigarrow: rightsquigarrow,
	RightTeeArrow: RightTeeArrow,
	RightTee: RightTee,
	RightTeeVector: RightTeeVector,
	rightthreetimes: rightthreetimes,
	RightTriangleBar: RightTriangleBar,
	RightTriangle: RightTriangle,
	RightTriangleEqual: RightTriangleEqual,
	RightUpDownVector: RightUpDownVector,
	RightUpTeeVector: RightUpTeeVector,
	RightUpVectorBar: RightUpVectorBar,
	RightUpVector: RightUpVector,
	RightVectorBar: RightVectorBar,
	RightVector: RightVector,
	ring: ring,
	risingdotseq: risingdotseq,
	rlarr: rlarr,
	rlhar: rlhar,
	rlm: rlm,
	rmoustache: rmoustache,
	rmoust: rmoust,
	rnmid: rnmid,
	roang: roang,
	roarr: roarr,
	robrk: robrk,
	ropar: ropar,
	ropf: ropf,
	Ropf: Ropf,
	roplus: roplus,
	rotimes: rotimes,
	RoundImplies: RoundImplies,
	rpar: rpar,
	rpargt: rpargt,
	rppolint: rppolint,
	rrarr: rrarr,
	Rrightarrow: Rrightarrow,
	rsaquo: rsaquo,
	rscr: rscr,
	Rscr: Rscr,
	rsh: rsh,
	Rsh: Rsh,
	rsqb: rsqb,
	rsquo: rsquo,
	rsquor: rsquor,
	rthree: rthree,
	rtimes: rtimes,
	rtri: rtri,
	rtrie: rtrie,
	rtrif: rtrif,
	rtriltri: rtriltri,
	RuleDelayed: RuleDelayed,
	ruluhar: ruluhar,
	rx: rx,
	Sacute: Sacute,
	sacute: sacute,
	sbquo: sbquo,
	scap: scap,
	Scaron: Scaron,
	scaron: scaron,
	Sc: Sc,
	sc: sc,
	sccue: sccue,
	sce: sce,
	scE: scE,
	Scedil: Scedil,
	scedil: scedil,
	Scirc: Scirc,
	scirc: scirc,
	scnap: scnap,
	scnE: scnE,
	scnsim: scnsim,
	scpolint: scpolint,
	scsim: scsim,
	Scy: Scy,
	scy: scy,
	sdotb: sdotb,
	sdot: sdot,
	sdote: sdote,
	searhk: searhk,
	searr: searr,
	seArr: seArr,
	searrow: searrow,
	sect: sect,
	semi: semi,
	seswar: seswar,
	setminus: setminus,
	setmn: setmn,
	sext: sext,
	Sfr: Sfr,
	sfr: sfr,
	sfrown: sfrown,
	sharp: sharp,
	SHCHcy: SHCHcy,
	shchcy: shchcy,
	SHcy: SHcy,
	shcy: shcy,
	ShortDownArrow: ShortDownArrow,
	ShortLeftArrow: ShortLeftArrow,
	shortmid: shortmid,
	shortparallel: shortparallel,
	ShortRightArrow: ShortRightArrow,
	ShortUpArrow: ShortUpArrow,
	shy: shy,
	Sigma: Sigma,
	sigma: sigma,
	sigmaf: sigmaf,
	sigmav: sigmav,
	sim: sim,
	simdot: simdot,
	sime: sime,
	simeq: simeq,
	simg: simg,
	simgE: simgE,
	siml: siml,
	simlE: simlE,
	simne: simne,
	simplus: simplus,
	simrarr: simrarr,
	slarr: slarr,
	SmallCircle: SmallCircle,
	smallsetminus: smallsetminus,
	smashp: smashp,
	smeparsl: smeparsl,
	smid: smid,
	smile: smile,
	smt: smt,
	smte: smte,
	smtes: smtes,
	SOFTcy: SOFTcy,
	softcy: softcy,
	solbar: solbar,
	solb: solb,
	sol: sol,
	Sopf: Sopf,
	sopf: sopf,
	spades: spades,
	spadesuit: spadesuit,
	spar: spar,
	sqcap: sqcap,
	sqcaps: sqcaps,
	sqcup: sqcup,
	sqcups: sqcups,
	Sqrt: Sqrt,
	sqsub: sqsub,
	sqsube: sqsube,
	sqsubset: sqsubset,
	sqsubseteq: sqsubseteq,
	sqsup: sqsup,
	sqsupe: sqsupe,
	sqsupset: sqsupset,
	sqsupseteq: sqsupseteq,
	square: square,
	Square: Square,
	SquareIntersection: SquareIntersection,
	SquareSubset: SquareSubset,
	SquareSubsetEqual: SquareSubsetEqual,
	SquareSuperset: SquareSuperset,
	SquareSupersetEqual: SquareSupersetEqual,
	SquareUnion: SquareUnion,
	squarf: squarf,
	squ: squ,
	squf: squf,
	srarr: srarr,
	Sscr: Sscr,
	sscr: sscr,
	ssetmn: ssetmn,
	ssmile: ssmile,
	sstarf: sstarf,
	Star: Star,
	star: star,
	starf: starf,
	straightepsilon: straightepsilon,
	straightphi: straightphi,
	strns: strns,
	sub: sub,
	Sub: Sub,
	subdot: subdot,
	subE: subE,
	sube: sube,
	subedot: subedot,
	submult: submult,
	subnE: subnE,
	subne: subne,
	subplus: subplus,
	subrarr: subrarr,
	subset: subset,
	Subset: Subset,
	subseteq: subseteq,
	subseteqq: subseteqq,
	SubsetEqual: SubsetEqual,
	subsetneq: subsetneq,
	subsetneqq: subsetneqq,
	subsim: subsim,
	subsub: subsub,
	subsup: subsup,
	succapprox: succapprox,
	succ: succ,
	succcurlyeq: succcurlyeq,
	Succeeds: Succeeds,
	SucceedsEqual: SucceedsEqual,
	SucceedsSlantEqual: SucceedsSlantEqual,
	SucceedsTilde: SucceedsTilde,
	succeq: succeq,
	succnapprox: succnapprox,
	succneqq: succneqq,
	succnsim: succnsim,
	succsim: succsim,
	SuchThat: SuchThat,
	sum: sum,
	Sum: Sum,
	sung: sung,
	sup1: sup1,
	sup2: sup2,
	sup3: sup3,
	sup: sup,
	Sup: Sup,
	supdot: supdot,
	supdsub: supdsub,
	supE: supE,
	supe: supe,
	supedot: supedot,
	Superset: Superset,
	SupersetEqual: SupersetEqual,
	suphsol: suphsol,
	suphsub: suphsub,
	suplarr: suplarr,
	supmult: supmult,
	supnE: supnE,
	supne: supne,
	supplus: supplus,
	supset: supset,
	Supset: Supset,
	supseteq: supseteq,
	supseteqq: supseteqq,
	supsetneq: supsetneq,
	supsetneqq: supsetneqq,
	supsim: supsim,
	supsub: supsub,
	supsup: supsup,
	swarhk: swarhk,
	swarr: swarr,
	swArr: swArr,
	swarrow: swarrow,
	swnwar: swnwar,
	szlig: szlig,
	Tab: Tab,
	target: target,
	Tau: Tau,
	tau: tau,
	tbrk: tbrk,
	Tcaron: Tcaron,
	tcaron: tcaron,
	Tcedil: Tcedil,
	tcedil: tcedil,
	Tcy: Tcy,
	tcy: tcy,
	tdot: tdot,
	telrec: telrec,
	Tfr: Tfr,
	tfr: tfr,
	there4: there4,
	therefore: therefore,
	Therefore: Therefore,
	Theta: Theta,
	theta: theta,
	thetasym: thetasym,
	thetav: thetav,
	thickapprox: thickapprox,
	thicksim: thicksim,
	ThickSpace: ThickSpace,
	ThinSpace: ThinSpace,
	thinsp: thinsp,
	thkap: thkap,
	thksim: thksim,
	THORN: THORN,
	thorn: thorn,
	tilde: tilde,
	Tilde: Tilde,
	TildeEqual: TildeEqual,
	TildeFullEqual: TildeFullEqual,
	TildeTilde: TildeTilde,
	timesbar: timesbar,
	timesb: timesb,
	times: times$1,
	timesd: timesd,
	tint: tint,
	toea: toea,
	topbot: topbot,
	topcir: topcir,
	top: top,
	Topf: Topf,
	topf: topf,
	topfork: topfork,
	tosa: tosa,
	tprime: tprime,
	trade: trade,
	TRADE: TRADE,
	triangle: triangle,
	triangledown: triangledown,
	triangleleft: triangleleft,
	trianglelefteq: trianglelefteq,
	triangleq: triangleq,
	triangleright: triangleright,
	trianglerighteq: trianglerighteq,
	tridot: tridot,
	trie: trie,
	triminus: triminus,
	TripleDot: TripleDot,
	triplus: triplus,
	trisb: trisb,
	tritime: tritime,
	trpezium: trpezium,
	Tscr: Tscr,
	tscr: tscr,
	TScy: TScy,
	tscy: tscy,
	TSHcy: TSHcy,
	tshcy: tshcy,
	Tstrok: Tstrok,
	tstrok: tstrok,
	twixt: twixt,
	twoheadleftarrow: twoheadleftarrow,
	twoheadrightarrow: twoheadrightarrow,
	Uacute: Uacute,
	uacute: uacute,
	uarr: uarr,
	Uarr: Uarr,
	uArr: uArr,
	Uarrocir: Uarrocir,
	Ubrcy: Ubrcy,
	ubrcy: ubrcy,
	Ubreve: Ubreve,
	ubreve: ubreve,
	Ucirc: Ucirc,
	ucirc: ucirc,
	Ucy: Ucy,
	ucy: ucy,
	udarr: udarr,
	Udblac: Udblac,
	udblac: udblac,
	udhar: udhar,
	ufisht: ufisht,
	Ufr: Ufr,
	ufr: ufr,
	Ugrave: Ugrave,
	ugrave: ugrave,
	uHar: uHar,
	uharl: uharl,
	uharr: uharr,
	uhblk: uhblk,
	ulcorn: ulcorn,
	ulcorner: ulcorner,
	ulcrop: ulcrop,
	ultri: ultri,
	Umacr: Umacr,
	umacr: umacr,
	uml: uml,
	UnderBar: UnderBar,
	UnderBrace: UnderBrace,
	UnderBracket: UnderBracket,
	UnderParenthesis: UnderParenthesis,
	Union: Union,
	UnionPlus: UnionPlus,
	Uogon: Uogon,
	uogon: uogon,
	Uopf: Uopf,
	uopf: uopf,
	UpArrowBar: UpArrowBar,
	uparrow: uparrow,
	UpArrow: UpArrow,
	Uparrow: Uparrow,
	UpArrowDownArrow: UpArrowDownArrow,
	updownarrow: updownarrow,
	UpDownArrow: UpDownArrow,
	Updownarrow: Updownarrow,
	UpEquilibrium: UpEquilibrium,
	upharpoonleft: upharpoonleft,
	upharpoonright: upharpoonright,
	uplus: uplus,
	UpperLeftArrow: UpperLeftArrow,
	UpperRightArrow: UpperRightArrow,
	upsi: upsi,
	Upsi: Upsi,
	upsih: upsih,
	Upsilon: Upsilon,
	upsilon: upsilon,
	UpTeeArrow: UpTeeArrow,
	UpTee: UpTee,
	upuparrows: upuparrows,
	urcorn: urcorn,
	urcorner: urcorner,
	urcrop: urcrop,
	Uring: Uring,
	uring: uring,
	urtri: urtri,
	Uscr: Uscr,
	uscr: uscr,
	utdot: utdot,
	Utilde: Utilde,
	utilde: utilde,
	utri: utri,
	utrif: utrif,
	uuarr: uuarr,
	Uuml: Uuml,
	uuml: uuml,
	uwangle: uwangle,
	vangrt: vangrt,
	varepsilon: varepsilon,
	varkappa: varkappa,
	varnothing: varnothing,
	varphi: varphi,
	varpi: varpi,
	varpropto: varpropto,
	varr: varr,
	vArr: vArr,
	varrho: varrho,
	varsigma: varsigma,
	varsubsetneq: varsubsetneq,
	varsubsetneqq: varsubsetneqq,
	varsupsetneq: varsupsetneq,
	varsupsetneqq: varsupsetneqq,
	vartheta: vartheta,
	vartriangleleft: vartriangleleft,
	vartriangleright: vartriangleright,
	vBar: vBar,
	Vbar: Vbar,
	vBarv: vBarv,
	Vcy: Vcy,
	vcy: vcy,
	vdash: vdash,
	vDash: vDash,
	Vdash: Vdash,
	VDash: VDash,
	Vdashl: Vdashl,
	veebar: veebar,
	vee: vee,
	Vee: Vee,
	veeeq: veeeq,
	vellip: vellip,
	verbar: verbar,
	Verbar: Verbar,
	vert: vert,
	Vert: Vert,
	VerticalBar: VerticalBar,
	VerticalLine: VerticalLine,
	VerticalSeparator: VerticalSeparator,
	VerticalTilde: VerticalTilde,
	VeryThinSpace: VeryThinSpace,
	Vfr: Vfr,
	vfr: vfr,
	vltri: vltri,
	vnsub: vnsub,
	vnsup: vnsup,
	Vopf: Vopf,
	vopf: vopf,
	vprop: vprop,
	vrtri: vrtri,
	Vscr: Vscr,
	vscr: vscr,
	vsubnE: vsubnE,
	vsubne: vsubne,
	vsupnE: vsupnE,
	vsupne: vsupne,
	Vvdash: Vvdash,
	vzigzag: vzigzag,
	Wcirc: Wcirc,
	wcirc: wcirc,
	wedbar: wedbar,
	wedge: wedge,
	Wedge: Wedge,
	wedgeq: wedgeq,
	weierp: weierp,
	Wfr: Wfr,
	wfr: wfr,
	Wopf: Wopf,
	wopf: wopf,
	wp: wp,
	wr: wr,
	wreath: wreath,
	Wscr: Wscr,
	wscr: wscr,
	xcap: xcap,
	xcirc: xcirc,
	xcup: xcup,
	xdtri: xdtri,
	Xfr: Xfr,
	xfr: xfr,
	xharr: xharr,
	xhArr: xhArr,
	Xi: Xi,
	xi: xi,
	xlarr: xlarr,
	xlArr: xlArr,
	xmap: xmap,
	xnis: xnis,
	xodot: xodot,
	Xopf: Xopf,
	xopf: xopf,
	xoplus: xoplus,
	xotime: xotime,
	xrarr: xrarr,
	xrArr: xrArr,
	Xscr: Xscr,
	xscr: xscr,
	xsqcup: xsqcup,
	xuplus: xuplus,
	xutri: xutri,
	xvee: xvee,
	xwedge: xwedge,
	Yacute: Yacute,
	yacute: yacute,
	YAcy: YAcy,
	yacy: yacy,
	Ycirc: Ycirc,
	ycirc: ycirc,
	Ycy: Ycy,
	ycy: ycy,
	yen: yen,
	Yfr: Yfr,
	yfr: yfr,
	YIcy: YIcy,
	yicy: yicy,
	Yopf: Yopf,
	yopf: yopf,
	Yscr: Yscr,
	yscr: yscr,
	YUcy: YUcy,
	yucy: yucy,
	yuml: yuml,
	Yuml: Yuml,
	Zacute: Zacute,
	zacute: zacute,
	Zcaron: Zcaron,
	zcaron: zcaron,
	Zcy: Zcy,
	zcy: zcy,
	Zdot: Zdot,
	zdot: zdot,
	zeetrf: zeetrf,
	ZeroWidthSpace: ZeroWidthSpace,
	Zeta: Zeta,
	zeta: zeta,
	zfr: zfr,
	Zfr: Zfr,
	ZHcy: ZHcy,
	zhcy: zhcy,
	zigrarr: zigrarr,
	zopf: zopf,
	Zopf: Zopf,
	Zscr: Zscr,
	zscr: zscr,
	zwj: zwj,
	zwnj: zwnj,
	"in": "∈",
	"Map": "⤅"
};

var entities = Object.freeze({
	Aacute: Aacute,
	aacute: aacute,
	Abreve: Abreve,
	abreve: abreve,
	ac: ac,
	acd: acd,
	acE: acE,
	Acirc: Acirc,
	acirc: acirc,
	acute: acute,
	Acy: Acy,
	acy: acy,
	AElig: AElig,
	aelig: aelig,
	af: af,
	Afr: Afr,
	afr: afr,
	Agrave: Agrave,
	agrave: agrave,
	alefsym: alefsym,
	aleph: aleph,
	Alpha: Alpha,
	alpha: alpha,
	Amacr: Amacr,
	amacr: amacr,
	amalg: amalg,
	amp: amp$1,
	AMP: AMP,
	andand: andand,
	And: And,
	and: and,
	andd: andd,
	andslope: andslope,
	andv: andv,
	ang: ang,
	ange: ange,
	angle: angle,
	angmsdaa: angmsdaa,
	angmsdab: angmsdab,
	angmsdac: angmsdac,
	angmsdad: angmsdad,
	angmsdae: angmsdae,
	angmsdaf: angmsdaf,
	angmsdag: angmsdag,
	angmsdah: angmsdah,
	angmsd: angmsd,
	angrt: angrt,
	angrtvb: angrtvb,
	angrtvbd: angrtvbd,
	angsph: angsph,
	angst: angst,
	angzarr: angzarr,
	Aogon: Aogon,
	aogon: aogon,
	Aopf: Aopf,
	aopf: aopf,
	apacir: apacir,
	ap: ap,
	apE: apE,
	ape: ape,
	apid: apid,
	apos: apos$1,
	ApplyFunction: ApplyFunction,
	approx: approx,
	approxeq: approxeq,
	Aring: Aring,
	aring: aring,
	Ascr: Ascr,
	ascr: ascr,
	Assign: Assign,
	ast: ast,
	asymp: asymp,
	asympeq: asympeq,
	Atilde: Atilde,
	atilde: atilde,
	Auml: Auml,
	auml: auml,
	awconint: awconint,
	awint: awint,
	backcong: backcong,
	backepsilon: backepsilon,
	backprime: backprime,
	backsim: backsim,
	backsimeq: backsimeq,
	Backslash: Backslash,
	Barv: Barv,
	barvee: barvee,
	barwed: barwed,
	Barwed: Barwed,
	barwedge: barwedge,
	bbrk: bbrk,
	bbrktbrk: bbrktbrk,
	bcong: bcong,
	Bcy: Bcy,
	bcy: bcy,
	bdquo: bdquo,
	becaus: becaus,
	because: because,
	Because: Because,
	bemptyv: bemptyv,
	bepsi: bepsi,
	bernou: bernou,
	Bernoullis: Bernoullis,
	Beta: Beta,
	beta: beta,
	beth: beth,
	between: between,
	Bfr: Bfr,
	bfr: bfr,
	bigcap: bigcap,
	bigcirc: bigcirc,
	bigcup: bigcup,
	bigodot: bigodot,
	bigoplus: bigoplus,
	bigotimes: bigotimes,
	bigsqcup: bigsqcup,
	bigstar: bigstar,
	bigtriangledown: bigtriangledown,
	bigtriangleup: bigtriangleup,
	biguplus: biguplus,
	bigvee: bigvee,
	bigwedge: bigwedge,
	bkarow: bkarow,
	blacklozenge: blacklozenge,
	blacksquare: blacksquare,
	blacktriangle: blacktriangle,
	blacktriangledown: blacktriangledown,
	blacktriangleleft: blacktriangleleft,
	blacktriangleright: blacktriangleright,
	blank: blank,
	blk12: blk12,
	blk14: blk14,
	blk34: blk34,
	block: block,
	bne: bne,
	bnequiv: bnequiv,
	bNot: bNot,
	bnot: bnot,
	Bopf: Bopf,
	bopf: bopf,
	bot: bot,
	bottom: bottom,
	bowtie: bowtie,
	boxbox: boxbox,
	boxdl: boxdl,
	boxdL: boxdL,
	boxDl: boxDl,
	boxDL: boxDL,
	boxdr: boxdr,
	boxdR: boxdR,
	boxDr: boxDr,
	boxDR: boxDR,
	boxh: boxh,
	boxH: boxH,
	boxhd: boxhd,
	boxHd: boxHd,
	boxhD: boxhD,
	boxHD: boxHD,
	boxhu: boxhu,
	boxHu: boxHu,
	boxhU: boxhU,
	boxHU: boxHU,
	boxminus: boxminus,
	boxplus: boxplus,
	boxtimes: boxtimes,
	boxul: boxul,
	boxuL: boxuL,
	boxUl: boxUl,
	boxUL: boxUL,
	boxur: boxur,
	boxuR: boxuR,
	boxUr: boxUr,
	boxUR: boxUR,
	boxv: boxv,
	boxV: boxV,
	boxvh: boxvh,
	boxvH: boxvH,
	boxVh: boxVh,
	boxVH: boxVH,
	boxvl: boxvl,
	boxvL: boxvL,
	boxVl: boxVl,
	boxVL: boxVL,
	boxvr: boxvr,
	boxvR: boxvR,
	boxVr: boxVr,
	boxVR: boxVR,
	bprime: bprime,
	breve: breve,
	Breve: Breve,
	brvbar: brvbar,
	bscr: bscr,
	Bscr: Bscr,
	bsemi: bsemi,
	bsim: bsim,
	bsime: bsime,
	bsolb: bsolb,
	bsol: bsol,
	bsolhsub: bsolhsub,
	bull: bull,
	bullet: bullet,
	bump: bump,
	bumpE: bumpE,
	bumpe: bumpe,
	Bumpeq: Bumpeq,
	bumpeq: bumpeq,
	Cacute: Cacute,
	cacute: cacute,
	capand: capand,
	capbrcup: capbrcup,
	capcap: capcap,
	cap: cap,
	Cap: Cap,
	capcup: capcup,
	capdot: capdot,
	CapitalDifferentialD: CapitalDifferentialD,
	caps: caps,
	caret: caret,
	caron: caron,
	Cayleys: Cayleys,
	ccaps: ccaps,
	Ccaron: Ccaron,
	ccaron: ccaron,
	Ccedil: Ccedil,
	ccedil: ccedil,
	Ccirc: Ccirc,
	ccirc: ccirc,
	Cconint: Cconint,
	ccups: ccups,
	ccupssm: ccupssm,
	Cdot: Cdot,
	cdot: cdot,
	cedil: cedil,
	Cedilla: Cedilla,
	cemptyv: cemptyv,
	cent: cent,
	centerdot: centerdot,
	CenterDot: CenterDot,
	cfr: cfr,
	Cfr: Cfr,
	CHcy: CHcy,
	chcy: chcy,
	check: check,
	checkmark: checkmark,
	Chi: Chi,
	chi: chi,
	circ: circ,
	circeq: circeq,
	circlearrowleft: circlearrowleft,
	circlearrowright: circlearrowright,
	circledast: circledast,
	circledcirc: circledcirc,
	circleddash: circleddash,
	CircleDot: CircleDot,
	circledR: circledR,
	circledS: circledS,
	CircleMinus: CircleMinus,
	CirclePlus: CirclePlus,
	CircleTimes: CircleTimes,
	cir: cir,
	cirE: cirE,
	cire: cire,
	cirfnint: cirfnint,
	cirmid: cirmid,
	cirscir: cirscir,
	ClockwiseContourIntegral: ClockwiseContourIntegral,
	CloseCurlyDoubleQuote: CloseCurlyDoubleQuote,
	CloseCurlyQuote: CloseCurlyQuote,
	clubs: clubs,
	clubsuit: clubsuit,
	colon: colon,
	Colon: Colon,
	Colone: Colone,
	colone: colone,
	coloneq: coloneq,
	comma: comma,
	commat: commat,
	comp: comp,
	compfn: compfn,
	complement: complement,
	complexes: complexes,
	cong: cong,
	congdot: congdot,
	Congruent: Congruent,
	conint: conint,
	Conint: Conint,
	ContourIntegral: ContourIntegral,
	copf: copf,
	Copf: Copf,
	coprod: coprod,
	Coproduct: Coproduct,
	copy: copy,
	COPY: COPY,
	copysr: copysr,
	CounterClockwiseContourIntegral: CounterClockwiseContourIntegral,
	crarr: crarr,
	cross: cross,
	Cross: Cross,
	Cscr: Cscr,
	cscr: cscr,
	csub: csub,
	csube: csube,
	csup: csup,
	csupe: csupe,
	ctdot: ctdot,
	cudarrl: cudarrl,
	cudarrr: cudarrr,
	cuepr: cuepr,
	cuesc: cuesc,
	cularr: cularr,
	cularrp: cularrp,
	cupbrcap: cupbrcap,
	cupcap: cupcap,
	CupCap: CupCap,
	cup: cup,
	Cup: Cup,
	cupcup: cupcup,
	cupdot: cupdot,
	cupor: cupor,
	cups: cups,
	curarr: curarr,
	curarrm: curarrm,
	curlyeqprec: curlyeqprec,
	curlyeqsucc: curlyeqsucc,
	curlyvee: curlyvee,
	curlywedge: curlywedge,
	curren: curren,
	curvearrowleft: curvearrowleft,
	curvearrowright: curvearrowright,
	cuvee: cuvee,
	cuwed: cuwed,
	cwconint: cwconint,
	cwint: cwint,
	cylcty: cylcty,
	dagger: dagger,
	Dagger: Dagger,
	daleth: daleth,
	darr: darr,
	Darr: Darr,
	dArr: dArr,
	dash: dash,
	Dashv: Dashv,
	dashv: dashv,
	dbkarow: dbkarow,
	dblac: dblac,
	Dcaron: Dcaron,
	dcaron: dcaron,
	Dcy: Dcy,
	dcy: dcy,
	ddagger: ddagger,
	ddarr: ddarr,
	DD: DD,
	dd: dd,
	DDotrahd: DDotrahd,
	ddotseq: ddotseq,
	deg: deg,
	Del: Del,
	Delta: Delta,
	delta: delta,
	demptyv: demptyv,
	dfisht: dfisht,
	Dfr: Dfr,
	dfr: dfr,
	dHar: dHar,
	dharl: dharl,
	dharr: dharr,
	DiacriticalAcute: DiacriticalAcute,
	DiacriticalDot: DiacriticalDot,
	DiacriticalDoubleAcute: DiacriticalDoubleAcute,
	DiacriticalGrave: DiacriticalGrave,
	DiacriticalTilde: DiacriticalTilde,
	diam: diam,
	diamond: diamond,
	Diamond: Diamond,
	diamondsuit: diamondsuit,
	diams: diams,
	die: die,
	DifferentialD: DifferentialD,
	digamma: digamma,
	disin: disin,
	div: div,
	divide: divide,
	divideontimes: divideontimes,
	divonx: divonx,
	DJcy: DJcy,
	djcy: djcy,
	dlcorn: dlcorn,
	dlcrop: dlcrop,
	dollar: dollar,
	Dopf: Dopf,
	dopf: dopf,
	Dot: Dot,
	dot: dot,
	DotDot: DotDot,
	doteq: doteq,
	doteqdot: doteqdot,
	DotEqual: DotEqual,
	dotminus: dotminus,
	dotplus: dotplus,
	dotsquare: dotsquare,
	doublebarwedge: doublebarwedge,
	DoubleContourIntegral: DoubleContourIntegral,
	DoubleDot: DoubleDot,
	DoubleDownArrow: DoubleDownArrow,
	DoubleLeftArrow: DoubleLeftArrow,
	DoubleLeftRightArrow: DoubleLeftRightArrow,
	DoubleLeftTee: DoubleLeftTee,
	DoubleLongLeftArrow: DoubleLongLeftArrow,
	DoubleLongLeftRightArrow: DoubleLongLeftRightArrow,
	DoubleLongRightArrow: DoubleLongRightArrow,
	DoubleRightArrow: DoubleRightArrow,
	DoubleRightTee: DoubleRightTee,
	DoubleUpArrow: DoubleUpArrow,
	DoubleUpDownArrow: DoubleUpDownArrow,
	DoubleVerticalBar: DoubleVerticalBar,
	DownArrowBar: DownArrowBar,
	downarrow: downarrow,
	DownArrow: DownArrow,
	Downarrow: Downarrow,
	DownArrowUpArrow: DownArrowUpArrow,
	DownBreve: DownBreve,
	downdownarrows: downdownarrows,
	downharpoonleft: downharpoonleft,
	downharpoonright: downharpoonright,
	DownLeftRightVector: DownLeftRightVector,
	DownLeftTeeVector: DownLeftTeeVector,
	DownLeftVectorBar: DownLeftVectorBar,
	DownLeftVector: DownLeftVector,
	DownRightTeeVector: DownRightTeeVector,
	DownRightVectorBar: DownRightVectorBar,
	DownRightVector: DownRightVector,
	DownTeeArrow: DownTeeArrow,
	DownTee: DownTee,
	drbkarow: drbkarow,
	drcorn: drcorn,
	drcrop: drcrop,
	Dscr: Dscr,
	dscr: dscr,
	DScy: DScy,
	dscy: dscy,
	dsol: dsol,
	Dstrok: Dstrok,
	dstrok: dstrok,
	dtdot: dtdot,
	dtri: dtri,
	dtrif: dtrif,
	duarr: duarr,
	duhar: duhar,
	dwangle: dwangle,
	DZcy: DZcy,
	dzcy: dzcy,
	dzigrarr: dzigrarr,
	Eacute: Eacute,
	eacute: eacute,
	easter: easter,
	Ecaron: Ecaron,
	ecaron: ecaron,
	Ecirc: Ecirc,
	ecirc: ecirc,
	ecir: ecir,
	ecolon: ecolon,
	Ecy: Ecy,
	ecy: ecy,
	eDDot: eDDot,
	Edot: Edot,
	edot: edot,
	eDot: eDot,
	ee: ee,
	efDot: efDot,
	Efr: Efr,
	efr: efr,
	eg: eg,
	Egrave: Egrave,
	egrave: egrave,
	egs: egs,
	egsdot: egsdot,
	el: el,
	Element: Element,
	elinters: elinters,
	ell: ell,
	els: els,
	elsdot: elsdot,
	Emacr: Emacr,
	emacr: emacr,
	empty: empty,
	emptyset: emptyset,
	EmptySmallSquare: EmptySmallSquare,
	emptyv: emptyv,
	EmptyVerySmallSquare: EmptyVerySmallSquare,
	emsp13: emsp13,
	emsp14: emsp14,
	emsp: emsp,
	ENG: ENG,
	eng: eng,
	ensp: ensp,
	Eogon: Eogon,
	eogon: eogon,
	Eopf: Eopf,
	eopf: eopf,
	epar: epar,
	eparsl: eparsl,
	eplus: eplus,
	epsi: epsi,
	Epsilon: Epsilon,
	epsilon: epsilon,
	epsiv: epsiv,
	eqcirc: eqcirc,
	eqcolon: eqcolon,
	eqsim: eqsim,
	eqslantgtr: eqslantgtr,
	eqslantless: eqslantless,
	Equal: Equal,
	equals: equals,
	EqualTilde: EqualTilde,
	equest: equest,
	Equilibrium: Equilibrium,
	equiv: equiv,
	equivDD: equivDD,
	eqvparsl: eqvparsl,
	erarr: erarr,
	erDot: erDot,
	escr: escr,
	Escr: Escr,
	esdot: esdot,
	Esim: Esim,
	esim: esim,
	Eta: Eta,
	eta: eta,
	ETH: ETH,
	eth: eth,
	Euml: Euml,
	euml: euml,
	euro: euro,
	excl: excl,
	exist: exist,
	Exists: Exists,
	expectation: expectation,
	exponentiale: exponentiale,
	ExponentialE: ExponentialE,
	fallingdotseq: fallingdotseq,
	Fcy: Fcy,
	fcy: fcy,
	female: female,
	ffilig: ffilig,
	fflig: fflig,
	ffllig: ffllig,
	Ffr: Ffr,
	ffr: ffr,
	filig: filig,
	FilledSmallSquare: FilledSmallSquare,
	FilledVerySmallSquare: FilledVerySmallSquare,
	fjlig: fjlig,
	flat: flat,
	fllig: fllig,
	fltns: fltns,
	fnof: fnof,
	Fopf: Fopf,
	fopf: fopf,
	forall: forall,
	ForAll: ForAll,
	fork: fork,
	forkv: forkv,
	Fouriertrf: Fouriertrf,
	fpartint: fpartint,
	frac12: frac12,
	frac13: frac13,
	frac14: frac14,
	frac15: frac15,
	frac16: frac16,
	frac18: frac18,
	frac23: frac23,
	frac25: frac25,
	frac34: frac34,
	frac35: frac35,
	frac38: frac38,
	frac45: frac45,
	frac56: frac56,
	frac58: frac58,
	frac78: frac78,
	frasl: frasl,
	frown: frown,
	fscr: fscr,
	Fscr: Fscr,
	gacute: gacute,
	Gamma: Gamma,
	gamma: gamma,
	Gammad: Gammad,
	gammad: gammad,
	gap: gap,
	Gbreve: Gbreve,
	gbreve: gbreve,
	Gcedil: Gcedil,
	Gcirc: Gcirc,
	gcirc: gcirc,
	Gcy: Gcy,
	gcy: gcy,
	Gdot: Gdot,
	gdot: gdot,
	ge: ge,
	gE: gE,
	gEl: gEl,
	gel: gel,
	geq: geq,
	geqq: geqq,
	geqslant: geqslant,
	gescc: gescc,
	ges: ges,
	gesdot: gesdot,
	gesdoto: gesdoto,
	gesdotol: gesdotol,
	gesl: gesl,
	gesles: gesles,
	Gfr: Gfr,
	gfr: gfr,
	gg: gg,
	Gg: Gg,
	ggg: ggg,
	gimel: gimel,
	GJcy: GJcy,
	gjcy: gjcy,
	gla: gla,
	gl: gl,
	glE: glE,
	glj: glj,
	gnap: gnap,
	gnapprox: gnapprox,
	gne: gne,
	gnE: gnE,
	gneq: gneq,
	gneqq: gneqq,
	gnsim: gnsim,
	Gopf: Gopf,
	gopf: gopf,
	grave: grave,
	GreaterEqual: GreaterEqual,
	GreaterEqualLess: GreaterEqualLess,
	GreaterFullEqual: GreaterFullEqual,
	GreaterGreater: GreaterGreater,
	GreaterLess: GreaterLess,
	GreaterSlantEqual: GreaterSlantEqual,
	GreaterTilde: GreaterTilde,
	Gscr: Gscr,
	gscr: gscr,
	gsim: gsim,
	gsime: gsime,
	gsiml: gsiml,
	gtcc: gtcc,
	gtcir: gtcir,
	gt: gt$1,
	GT: GT,
	Gt: Gt,
	gtdot: gtdot,
	gtlPar: gtlPar,
	gtquest: gtquest,
	gtrapprox: gtrapprox,
	gtrarr: gtrarr,
	gtrdot: gtrdot,
	gtreqless: gtreqless,
	gtreqqless: gtreqqless,
	gtrless: gtrless,
	gtrsim: gtrsim,
	gvertneqq: gvertneqq,
	gvnE: gvnE,
	Hacek: Hacek,
	hairsp: hairsp,
	half: half,
	hamilt: hamilt,
	HARDcy: HARDcy,
	hardcy: hardcy,
	harrcir: harrcir,
	harr: harr,
	hArr: hArr,
	harrw: harrw,
	Hat: Hat,
	hbar: hbar,
	Hcirc: Hcirc,
	hcirc: hcirc,
	hearts: hearts,
	heartsuit: heartsuit,
	hellip: hellip,
	hercon: hercon,
	hfr: hfr,
	Hfr: Hfr,
	HilbertSpace: HilbertSpace,
	hksearow: hksearow,
	hkswarow: hkswarow,
	hoarr: hoarr,
	homtht: homtht,
	hookleftarrow: hookleftarrow,
	hookrightarrow: hookrightarrow,
	hopf: hopf,
	Hopf: Hopf,
	horbar: horbar,
	HorizontalLine: HorizontalLine,
	hscr: hscr,
	Hscr: Hscr,
	hslash: hslash,
	Hstrok: Hstrok,
	hstrok: hstrok,
	HumpDownHump: HumpDownHump,
	HumpEqual: HumpEqual,
	hybull: hybull,
	hyphen: hyphen,
	Iacute: Iacute,
	iacute: iacute,
	ic: ic,
	Icirc: Icirc,
	icirc: icirc,
	Icy: Icy,
	icy: icy,
	Idot: Idot,
	IEcy: IEcy,
	iecy: iecy,
	iexcl: iexcl,
	iff: iff,
	ifr: ifr,
	Ifr: Ifr,
	Igrave: Igrave,
	igrave: igrave,
	ii: ii,
	iiiint: iiiint,
	iiint: iiint,
	iinfin: iinfin,
	iiota: iiota,
	IJlig: IJlig,
	ijlig: ijlig,
	Imacr: Imacr,
	imacr: imacr,
	image: image,
	ImaginaryI: ImaginaryI,
	imagline: imagline,
	imagpart: imagpart,
	imath: imath,
	Im: Im,
	imof: imof,
	imped: imped,
	Implies: Implies,
	incare: incare,
	infin: infin,
	infintie: infintie,
	inodot: inodot,
	intcal: intcal,
	int: int,
	Int: Int,
	integers: integers,
	Integral: Integral,
	intercal: intercal,
	Intersection: Intersection,
	intlarhk: intlarhk,
	intprod: intprod,
	InvisibleComma: InvisibleComma,
	InvisibleTimes: InvisibleTimes,
	IOcy: IOcy,
	iocy: iocy,
	Iogon: Iogon,
	iogon: iogon,
	Iopf: Iopf,
	iopf: iopf,
	Iota: Iota,
	iota: iota,
	iprod: iprod,
	iquest: iquest,
	iscr: iscr,
	Iscr: Iscr,
	isin: isin,
	isindot: isindot,
	isinE: isinE,
	isins: isins,
	isinsv: isinsv,
	isinv: isinv,
	it: it,
	Itilde: Itilde,
	itilde: itilde,
	Iukcy: Iukcy,
	iukcy: iukcy,
	Iuml: Iuml,
	iuml: iuml,
	Jcirc: Jcirc,
	jcirc: jcirc,
	Jcy: Jcy,
	jcy: jcy,
	Jfr: Jfr,
	jfr: jfr,
	jmath: jmath,
	Jopf: Jopf,
	jopf: jopf,
	Jscr: Jscr,
	jscr: jscr,
	Jsercy: Jsercy,
	jsercy: jsercy,
	Jukcy: Jukcy,
	jukcy: jukcy,
	Kappa: Kappa,
	kappa: kappa,
	kappav: kappav,
	Kcedil: Kcedil,
	kcedil: kcedil,
	Kcy: Kcy,
	kcy: kcy,
	Kfr: Kfr,
	kfr: kfr,
	kgreen: kgreen,
	KHcy: KHcy,
	khcy: khcy,
	KJcy: KJcy,
	kjcy: kjcy,
	Kopf: Kopf,
	kopf: kopf,
	Kscr: Kscr,
	kscr: kscr,
	lAarr: lAarr,
	Lacute: Lacute,
	lacute: lacute,
	laemptyv: laemptyv,
	lagran: lagran,
	Lambda: Lambda,
	lambda: lambda,
	lang: lang,
	Lang: Lang,
	langd: langd,
	langle: langle,
	lap: lap,
	Laplacetrf: Laplacetrf,
	laquo: laquo,
	larrb: larrb,
	larrbfs: larrbfs,
	larr: larr,
	Larr: Larr,
	lArr: lArr,
	larrfs: larrfs,
	larrhk: larrhk,
	larrlp: larrlp,
	larrpl: larrpl,
	larrsim: larrsim,
	larrtl: larrtl,
	latail: latail,
	lAtail: lAtail,
	lat: lat,
	late: late,
	lates: lates,
	lbarr: lbarr,
	lBarr: lBarr,
	lbbrk: lbbrk,
	lbrace: lbrace,
	lbrack: lbrack,
	lbrke: lbrke,
	lbrksld: lbrksld,
	lbrkslu: lbrkslu,
	Lcaron: Lcaron,
	lcaron: lcaron,
	Lcedil: Lcedil,
	lcedil: lcedil,
	lceil: lceil,
	lcub: lcub,
	Lcy: Lcy,
	lcy: lcy,
	ldca: ldca,
	ldquo: ldquo,
	ldquor: ldquor,
	ldrdhar: ldrdhar,
	ldrushar: ldrushar,
	ldsh: ldsh,
	le: le,
	lE: lE,
	LeftAngleBracket: LeftAngleBracket,
	LeftArrowBar: LeftArrowBar,
	leftarrow: leftarrow,
	LeftArrow: LeftArrow,
	Leftarrow: Leftarrow,
	LeftArrowRightArrow: LeftArrowRightArrow,
	leftarrowtail: leftarrowtail,
	LeftCeiling: LeftCeiling,
	LeftDoubleBracket: LeftDoubleBracket,
	LeftDownTeeVector: LeftDownTeeVector,
	LeftDownVectorBar: LeftDownVectorBar,
	LeftDownVector: LeftDownVector,
	LeftFloor: LeftFloor,
	leftharpoondown: leftharpoondown,
	leftharpoonup: leftharpoonup,
	leftleftarrows: leftleftarrows,
	leftrightarrow: leftrightarrow,
	LeftRightArrow: LeftRightArrow,
	Leftrightarrow: Leftrightarrow,
	leftrightarrows: leftrightarrows,
	leftrightharpoons: leftrightharpoons,
	leftrightsquigarrow: leftrightsquigarrow,
	LeftRightVector: LeftRightVector,
	LeftTeeArrow: LeftTeeArrow,
	LeftTee: LeftTee,
	LeftTeeVector: LeftTeeVector,
	leftthreetimes: leftthreetimes,
	LeftTriangleBar: LeftTriangleBar,
	LeftTriangle: LeftTriangle,
	LeftTriangleEqual: LeftTriangleEqual,
	LeftUpDownVector: LeftUpDownVector,
	LeftUpTeeVector: LeftUpTeeVector,
	LeftUpVectorBar: LeftUpVectorBar,
	LeftUpVector: LeftUpVector,
	LeftVectorBar: LeftVectorBar,
	LeftVector: LeftVector,
	lEg: lEg,
	leg: leg,
	leq: leq,
	leqq: leqq,
	leqslant: leqslant,
	lescc: lescc,
	les: les,
	lesdot: lesdot,
	lesdoto: lesdoto,
	lesdotor: lesdotor,
	lesg: lesg,
	lesges: lesges,
	lessapprox: lessapprox,
	lessdot: lessdot,
	lesseqgtr: lesseqgtr,
	lesseqqgtr: lesseqqgtr,
	LessEqualGreater: LessEqualGreater,
	LessFullEqual: LessFullEqual,
	LessGreater: LessGreater,
	lessgtr: lessgtr,
	LessLess: LessLess,
	lesssim: lesssim,
	LessSlantEqual: LessSlantEqual,
	LessTilde: LessTilde,
	lfisht: lfisht,
	lfloor: lfloor,
	Lfr: Lfr,
	lfr: lfr,
	lg: lg,
	lgE: lgE,
	lHar: lHar,
	lhard: lhard,
	lharu: lharu,
	lharul: lharul,
	lhblk: lhblk,
	LJcy: LJcy,
	ljcy: ljcy,
	llarr: llarr,
	ll: ll,
	Ll: Ll,
	llcorner: llcorner,
	Lleftarrow: Lleftarrow,
	llhard: llhard,
	lltri: lltri,
	Lmidot: Lmidot,
	lmidot: lmidot,
	lmoustache: lmoustache,
	lmoust: lmoust,
	lnap: lnap,
	lnapprox: lnapprox,
	lne: lne,
	lnE: lnE,
	lneq: lneq,
	lneqq: lneqq,
	lnsim: lnsim,
	loang: loang,
	loarr: loarr,
	lobrk: lobrk,
	longleftarrow: longleftarrow,
	LongLeftArrow: LongLeftArrow,
	Longleftarrow: Longleftarrow,
	longleftrightarrow: longleftrightarrow,
	LongLeftRightArrow: LongLeftRightArrow,
	Longleftrightarrow: Longleftrightarrow,
	longmapsto: longmapsto,
	longrightarrow: longrightarrow,
	LongRightArrow: LongRightArrow,
	Longrightarrow: Longrightarrow,
	looparrowleft: looparrowleft,
	looparrowright: looparrowright,
	lopar: lopar,
	Lopf: Lopf,
	lopf: lopf,
	loplus: loplus,
	lotimes: lotimes,
	lowast: lowast,
	lowbar: lowbar,
	LowerLeftArrow: LowerLeftArrow,
	LowerRightArrow: LowerRightArrow,
	loz: loz,
	lozenge: lozenge,
	lozf: lozf,
	lpar: lpar,
	lparlt: lparlt,
	lrarr: lrarr,
	lrcorner: lrcorner,
	lrhar: lrhar,
	lrhard: lrhard,
	lrm: lrm,
	lrtri: lrtri,
	lsaquo: lsaquo,
	lscr: lscr,
	Lscr: Lscr,
	lsh: lsh,
	Lsh: Lsh,
	lsim: lsim,
	lsime: lsime,
	lsimg: lsimg,
	lsqb: lsqb,
	lsquo: lsquo,
	lsquor: lsquor,
	Lstrok: Lstrok,
	lstrok: lstrok,
	ltcc: ltcc,
	ltcir: ltcir,
	lt: lt$1,
	LT: LT,
	Lt: Lt,
	ltdot: ltdot,
	lthree: lthree,
	ltimes: ltimes,
	ltlarr: ltlarr,
	ltquest: ltquest,
	ltri: ltri,
	ltrie: ltrie,
	ltrif: ltrif,
	ltrPar: ltrPar,
	lurdshar: lurdshar,
	luruhar: luruhar,
	lvertneqq: lvertneqq,
	lvnE: lvnE,
	macr: macr,
	male: male,
	malt: malt,
	maltese: maltese,
	map: map$1,
	mapsto: mapsto,
	mapstodown: mapstodown,
	mapstoleft: mapstoleft,
	mapstoup: mapstoup,
	marker: marker,
	mcomma: mcomma,
	Mcy: Mcy,
	mcy: mcy,
	mdash: mdash,
	mDDot: mDDot,
	measuredangle: measuredangle,
	MediumSpace: MediumSpace,
	Mellintrf: Mellintrf,
	Mfr: Mfr,
	mfr: mfr,
	mho: mho,
	micro: micro,
	midast: midast,
	midcir: midcir,
	mid: mid,
	middot: middot,
	minusb: minusb,
	minus: minus,
	minusd: minusd,
	minusdu: minusdu,
	MinusPlus: MinusPlus,
	mlcp: mlcp,
	mldr: mldr,
	mnplus: mnplus,
	models: models,
	Mopf: Mopf,
	mopf: mopf,
	mp: mp,
	mscr: mscr,
	Mscr: Mscr,
	mstpos: mstpos,
	Mu: Mu,
	mu: mu,
	multimap: multimap,
	mumap: mumap,
	nabla: nabla,
	Nacute: Nacute,
	nacute: nacute,
	nang: nang,
	nap: nap,
	napE: napE,
	napid: napid,
	napos: napos,
	napprox: napprox,
	natural: natural,
	naturals: naturals,
	natur: natur,
	nbsp: nbsp,
	nbump: nbump,
	nbumpe: nbumpe,
	ncap: ncap,
	Ncaron: Ncaron,
	ncaron: ncaron,
	Ncedil: Ncedil,
	ncedil: ncedil,
	ncong: ncong,
	ncongdot: ncongdot,
	ncup: ncup,
	Ncy: Ncy,
	ncy: ncy,
	ndash: ndash,
	nearhk: nearhk,
	nearr: nearr,
	neArr: neArr,
	nearrow: nearrow,
	ne: ne,
	nedot: nedot,
	NegativeMediumSpace: NegativeMediumSpace,
	NegativeThickSpace: NegativeThickSpace,
	NegativeThinSpace: NegativeThinSpace,
	NegativeVeryThinSpace: NegativeVeryThinSpace,
	nequiv: nequiv,
	nesear: nesear,
	nesim: nesim,
	NestedGreaterGreater: NestedGreaterGreater,
	NestedLessLess: NestedLessLess,
	NewLine: NewLine,
	nexist: nexist,
	nexists: nexists,
	Nfr: Nfr,
	nfr: nfr,
	ngE: ngE,
	nge: nge,
	ngeq: ngeq,
	ngeqq: ngeqq,
	ngeqslant: ngeqslant,
	nges: nges,
	nGg: nGg,
	ngsim: ngsim,
	nGt: nGt,
	ngt: ngt,
	ngtr: ngtr,
	nGtv: nGtv,
	nharr: nharr,
	nhArr: nhArr,
	nhpar: nhpar,
	ni: ni,
	nis: nis,
	nisd: nisd,
	niv: niv,
	NJcy: NJcy,
	njcy: njcy,
	nlarr: nlarr,
	nlArr: nlArr,
	nldr: nldr,
	nlE: nlE,
	nle: nle,
	nleftarrow: nleftarrow,
	nLeftarrow: nLeftarrow,
	nleftrightarrow: nleftrightarrow,
	nLeftrightarrow: nLeftrightarrow,
	nleq: nleq,
	nleqq: nleqq,
	nleqslant: nleqslant,
	nles: nles,
	nless: nless,
	nLl: nLl,
	nlsim: nlsim,
	nLt: nLt,
	nlt: nlt,
	nltri: nltri,
	nltrie: nltrie,
	nLtv: nLtv,
	nmid: nmid,
	NoBreak: NoBreak,
	NonBreakingSpace: NonBreakingSpace,
	nopf: nopf,
	Nopf: Nopf,
	Not: Not,
	not: not,
	NotCongruent: NotCongruent,
	NotCupCap: NotCupCap,
	NotDoubleVerticalBar: NotDoubleVerticalBar,
	NotElement: NotElement,
	NotEqual: NotEqual,
	NotEqualTilde: NotEqualTilde,
	NotExists: NotExists,
	NotGreater: NotGreater,
	NotGreaterEqual: NotGreaterEqual,
	NotGreaterFullEqual: NotGreaterFullEqual,
	NotGreaterGreater: NotGreaterGreater,
	NotGreaterLess: NotGreaterLess,
	NotGreaterSlantEqual: NotGreaterSlantEqual,
	NotGreaterTilde: NotGreaterTilde,
	NotHumpDownHump: NotHumpDownHump,
	NotHumpEqual: NotHumpEqual,
	notin: notin,
	notindot: notindot,
	notinE: notinE,
	notinva: notinva,
	notinvb: notinvb,
	notinvc: notinvc,
	NotLeftTriangleBar: NotLeftTriangleBar,
	NotLeftTriangle: NotLeftTriangle,
	NotLeftTriangleEqual: NotLeftTriangleEqual,
	NotLess: NotLess,
	NotLessEqual: NotLessEqual,
	NotLessGreater: NotLessGreater,
	NotLessLess: NotLessLess,
	NotLessSlantEqual: NotLessSlantEqual,
	NotLessTilde: NotLessTilde,
	NotNestedGreaterGreater: NotNestedGreaterGreater,
	NotNestedLessLess: NotNestedLessLess,
	notni: notni,
	notniva: notniva,
	notnivb: notnivb,
	notnivc: notnivc,
	NotPrecedes: NotPrecedes,
	NotPrecedesEqual: NotPrecedesEqual,
	NotPrecedesSlantEqual: NotPrecedesSlantEqual,
	NotReverseElement: NotReverseElement,
	NotRightTriangleBar: NotRightTriangleBar,
	NotRightTriangle: NotRightTriangle,
	NotRightTriangleEqual: NotRightTriangleEqual,
	NotSquareSubset: NotSquareSubset,
	NotSquareSubsetEqual: NotSquareSubsetEqual,
	NotSquareSuperset: NotSquareSuperset,
	NotSquareSupersetEqual: NotSquareSupersetEqual,
	NotSubset: NotSubset,
	NotSubsetEqual: NotSubsetEqual,
	NotSucceeds: NotSucceeds,
	NotSucceedsEqual: NotSucceedsEqual,
	NotSucceedsSlantEqual: NotSucceedsSlantEqual,
	NotSucceedsTilde: NotSucceedsTilde,
	NotSuperset: NotSuperset,
	NotSupersetEqual: NotSupersetEqual,
	NotTilde: NotTilde,
	NotTildeEqual: NotTildeEqual,
	NotTildeFullEqual: NotTildeFullEqual,
	NotTildeTilde: NotTildeTilde,
	NotVerticalBar: NotVerticalBar,
	nparallel: nparallel,
	npar: npar,
	nparsl: nparsl,
	npart: npart,
	npolint: npolint,
	npr: npr,
	nprcue: nprcue,
	nprec: nprec,
	npreceq: npreceq,
	npre: npre,
	nrarrc: nrarrc,
	nrarr: nrarr,
	nrArr: nrArr,
	nrarrw: nrarrw,
	nrightarrow: nrightarrow,
	nRightarrow: nRightarrow,
	nrtri: nrtri,
	nrtrie: nrtrie,
	nsc: nsc,
	nsccue: nsccue,
	nsce: nsce,
	Nscr: Nscr,
	nscr: nscr,
	nshortmid: nshortmid,
	nshortparallel: nshortparallel,
	nsim: nsim,
	nsime: nsime,
	nsimeq: nsimeq,
	nsmid: nsmid,
	nspar: nspar,
	nsqsube: nsqsube,
	nsqsupe: nsqsupe,
	nsub: nsub,
	nsubE: nsubE,
	nsube: nsube,
	nsubset: nsubset,
	nsubseteq: nsubseteq,
	nsubseteqq: nsubseteqq,
	nsucc: nsucc,
	nsucceq: nsucceq,
	nsup: nsup,
	nsupE: nsupE,
	nsupe: nsupe,
	nsupset: nsupset,
	nsupseteq: nsupseteq,
	nsupseteqq: nsupseteqq,
	ntgl: ntgl,
	Ntilde: Ntilde,
	ntilde: ntilde,
	ntlg: ntlg,
	ntriangleleft: ntriangleleft,
	ntrianglelefteq: ntrianglelefteq,
	ntriangleright: ntriangleright,
	ntrianglerighteq: ntrianglerighteq,
	Nu: Nu,
	nu: nu,
	num: num,
	numero: numero,
	numsp: numsp,
	nvap: nvap,
	nvdash: nvdash,
	nvDash: nvDash,
	nVdash: nVdash,
	nVDash: nVDash,
	nvge: nvge,
	nvgt: nvgt,
	nvHarr: nvHarr,
	nvinfin: nvinfin,
	nvlArr: nvlArr,
	nvle: nvle,
	nvlt: nvlt,
	nvltrie: nvltrie,
	nvrArr: nvrArr,
	nvrtrie: nvrtrie,
	nvsim: nvsim,
	nwarhk: nwarhk,
	nwarr: nwarr,
	nwArr: nwArr,
	nwarrow: nwarrow,
	nwnear: nwnear,
	Oacute: Oacute,
	oacute: oacute,
	oast: oast,
	Ocirc: Ocirc,
	ocirc: ocirc,
	ocir: ocir,
	Ocy: Ocy,
	ocy: ocy,
	odash: odash,
	Odblac: Odblac,
	odblac: odblac,
	odiv: odiv,
	odot: odot,
	odsold: odsold,
	OElig: OElig,
	oelig: oelig,
	ofcir: ofcir,
	Ofr: Ofr,
	ofr: ofr,
	ogon: ogon,
	Ograve: Ograve,
	ograve: ograve,
	ogt: ogt,
	ohbar: ohbar,
	ohm: ohm,
	oint: oint,
	olarr: olarr,
	olcir: olcir,
	olcross: olcross,
	oline: oline,
	olt: olt,
	Omacr: Omacr,
	omacr: omacr,
	Omega: Omega,
	omega: omega,
	Omicron: Omicron,
	omicron: omicron,
	omid: omid,
	ominus: ominus,
	Oopf: Oopf,
	oopf: oopf,
	opar: opar,
	OpenCurlyDoubleQuote: OpenCurlyDoubleQuote,
	OpenCurlyQuote: OpenCurlyQuote,
	operp: operp,
	oplus: oplus,
	orarr: orarr,
	Or: Or,
	or: or,
	ord: ord,
	order: order,
	orderof: orderof,
	ordf: ordf,
	ordm: ordm,
	origof: origof,
	oror: oror,
	orslope: orslope,
	orv: orv,
	oS: oS,
	Oscr: Oscr,
	oscr: oscr,
	Oslash: Oslash,
	oslash: oslash,
	osol: osol,
	Otilde: Otilde,
	otilde: otilde,
	otimesas: otimesas,
	Otimes: Otimes,
	otimes: otimes,
	Ouml: Ouml,
	ouml: ouml,
	ovbar: ovbar,
	OverBar: OverBar,
	OverBrace: OverBrace,
	OverBracket: OverBracket,
	OverParenthesis: OverParenthesis,
	para: para,
	parallel: parallel,
	par: par,
	parsim: parsim,
	parsl: parsl,
	part: part,
	PartialD: PartialD,
	Pcy: Pcy,
	pcy: pcy,
	percnt: percnt,
	period: period,
	permil: permil,
	perp: perp,
	pertenk: pertenk,
	Pfr: Pfr,
	pfr: pfr,
	Phi: Phi,
	phi: phi,
	phiv: phiv,
	phmmat: phmmat,
	phone: phone,
	Pi: Pi,
	pi: pi,
	pitchfork: pitchfork,
	piv: piv,
	planck: planck,
	planckh: planckh,
	plankv: plankv,
	plusacir: plusacir,
	plusb: plusb,
	pluscir: pluscir,
	plus: plus,
	plusdo: plusdo,
	plusdu: plusdu,
	pluse: pluse,
	PlusMinus: PlusMinus,
	plusmn: plusmn,
	plussim: plussim,
	plustwo: plustwo,
	pm: pm,
	Poincareplane: Poincareplane,
	pointint: pointint,
	popf: popf,
	Popf: Popf,
	pound: pound,
	prap: prap,
	Pr: Pr,
	pr: pr,
	prcue: prcue,
	precapprox: precapprox,
	prec: prec,
	preccurlyeq: preccurlyeq,
	Precedes: Precedes,
	PrecedesEqual: PrecedesEqual,
	PrecedesSlantEqual: PrecedesSlantEqual,
	PrecedesTilde: PrecedesTilde,
	preceq: preceq,
	precnapprox: precnapprox,
	precneqq: precneqq,
	precnsim: precnsim,
	pre: pre,
	prE: prE,
	precsim: precsim,
	prime: prime,
	Prime: Prime,
	primes: primes,
	prnap: prnap,
	prnE: prnE,
	prnsim: prnsim,
	prod: prod,
	Product: Product,
	profalar: profalar,
	profline: profline,
	profsurf: profsurf,
	prop: prop,
	Proportional: Proportional,
	Proportion: Proportion,
	propto: propto,
	prsim: prsim,
	prurel: prurel,
	Pscr: Pscr,
	pscr: pscr,
	Psi: Psi,
	psi: psi,
	puncsp: puncsp,
	Qfr: Qfr,
	qfr: qfr,
	qint: qint,
	qopf: qopf,
	Qopf: Qopf,
	qprime: qprime,
	Qscr: Qscr,
	qscr: qscr,
	quaternions: quaternions,
	quatint: quatint,
	quest: quest,
	questeq: questeq,
	quot: quot$1,
	QUOT: QUOT,
	rAarr: rAarr,
	race: race,
	Racute: Racute,
	racute: racute,
	radic: radic,
	raemptyv: raemptyv,
	rang: rang,
	Rang: Rang,
	rangd: rangd,
	range: range,
	rangle: rangle,
	raquo: raquo,
	rarrap: rarrap,
	rarrb: rarrb,
	rarrbfs: rarrbfs,
	rarrc: rarrc,
	rarr: rarr,
	Rarr: Rarr,
	rArr: rArr,
	rarrfs: rarrfs,
	rarrhk: rarrhk,
	rarrlp: rarrlp,
	rarrpl: rarrpl,
	rarrsim: rarrsim,
	Rarrtl: Rarrtl,
	rarrtl: rarrtl,
	rarrw: rarrw,
	ratail: ratail,
	rAtail: rAtail,
	ratio: ratio,
	rationals: rationals,
	rbarr: rbarr,
	rBarr: rBarr,
	RBarr: RBarr,
	rbbrk: rbbrk,
	rbrace: rbrace,
	rbrack: rbrack,
	rbrke: rbrke,
	rbrksld: rbrksld,
	rbrkslu: rbrkslu,
	Rcaron: Rcaron,
	rcaron: rcaron,
	Rcedil: Rcedil,
	rcedil: rcedil,
	rceil: rceil,
	rcub: rcub,
	Rcy: Rcy,
	rcy: rcy,
	rdca: rdca,
	rdldhar: rdldhar,
	rdquo: rdquo,
	rdquor: rdquor,
	rdsh: rdsh,
	real: real,
	realine: realine,
	realpart: realpart,
	reals: reals,
	Re: Re,
	rect: rect,
	reg: reg,
	REG: REG,
	ReverseElement: ReverseElement,
	ReverseEquilibrium: ReverseEquilibrium,
	ReverseUpEquilibrium: ReverseUpEquilibrium,
	rfisht: rfisht,
	rfloor: rfloor,
	rfr: rfr,
	Rfr: Rfr,
	rHar: rHar,
	rhard: rhard,
	rharu: rharu,
	rharul: rharul,
	Rho: Rho,
	rho: rho,
	rhov: rhov,
	RightAngleBracket: RightAngleBracket,
	RightArrowBar: RightArrowBar,
	rightarrow: rightarrow,
	RightArrow: RightArrow,
	Rightarrow: Rightarrow,
	RightArrowLeftArrow: RightArrowLeftArrow,
	rightarrowtail: rightarrowtail,
	RightCeiling: RightCeiling,
	RightDoubleBracket: RightDoubleBracket,
	RightDownTeeVector: RightDownTeeVector,
	RightDownVectorBar: RightDownVectorBar,
	RightDownVector: RightDownVector,
	RightFloor: RightFloor,
	rightharpoondown: rightharpoondown,
	rightharpoonup: rightharpoonup,
	rightleftarrows: rightleftarrows,
	rightleftharpoons: rightleftharpoons,
	rightrightarrows: rightrightarrows,
	rightsquigarrow: rightsquigarrow,
	RightTeeArrow: RightTeeArrow,
	RightTee: RightTee,
	RightTeeVector: RightTeeVector,
	rightthreetimes: rightthreetimes,
	RightTriangleBar: RightTriangleBar,
	RightTriangle: RightTriangle,
	RightTriangleEqual: RightTriangleEqual,
	RightUpDownVector: RightUpDownVector,
	RightUpTeeVector: RightUpTeeVector,
	RightUpVectorBar: RightUpVectorBar,
	RightUpVector: RightUpVector,
	RightVectorBar: RightVectorBar,
	RightVector: RightVector,
	ring: ring,
	risingdotseq: risingdotseq,
	rlarr: rlarr,
	rlhar: rlhar,
	rlm: rlm,
	rmoustache: rmoustache,
	rmoust: rmoust,
	rnmid: rnmid,
	roang: roang,
	roarr: roarr,
	robrk: robrk,
	ropar: ropar,
	ropf: ropf,
	Ropf: Ropf,
	roplus: roplus,
	rotimes: rotimes,
	RoundImplies: RoundImplies,
	rpar: rpar,
	rpargt: rpargt,
	rppolint: rppolint,
	rrarr: rrarr,
	Rrightarrow: Rrightarrow,
	rsaquo: rsaquo,
	rscr: rscr,
	Rscr: Rscr,
	rsh: rsh,
	Rsh: Rsh,
	rsqb: rsqb,
	rsquo: rsquo,
	rsquor: rsquor,
	rthree: rthree,
	rtimes: rtimes,
	rtri: rtri,
	rtrie: rtrie,
	rtrif: rtrif,
	rtriltri: rtriltri,
	RuleDelayed: RuleDelayed,
	ruluhar: ruluhar,
	rx: rx,
	Sacute: Sacute,
	sacute: sacute,
	sbquo: sbquo,
	scap: scap,
	Scaron: Scaron,
	scaron: scaron,
	Sc: Sc,
	sc: sc,
	sccue: sccue,
	sce: sce,
	scE: scE,
	Scedil: Scedil,
	scedil: scedil,
	Scirc: Scirc,
	scirc: scirc,
	scnap: scnap,
	scnE: scnE,
	scnsim: scnsim,
	scpolint: scpolint,
	scsim: scsim,
	Scy: Scy,
	scy: scy,
	sdotb: sdotb,
	sdot: sdot,
	sdote: sdote,
	searhk: searhk,
	searr: searr,
	seArr: seArr,
	searrow: searrow,
	sect: sect,
	semi: semi,
	seswar: seswar,
	setminus: setminus,
	setmn: setmn,
	sext: sext,
	Sfr: Sfr,
	sfr: sfr,
	sfrown: sfrown,
	sharp: sharp,
	SHCHcy: SHCHcy,
	shchcy: shchcy,
	SHcy: SHcy,
	shcy: shcy,
	ShortDownArrow: ShortDownArrow,
	ShortLeftArrow: ShortLeftArrow,
	shortmid: shortmid,
	shortparallel: shortparallel,
	ShortRightArrow: ShortRightArrow,
	ShortUpArrow: ShortUpArrow,
	shy: shy,
	Sigma: Sigma,
	sigma: sigma,
	sigmaf: sigmaf,
	sigmav: sigmav,
	sim: sim,
	simdot: simdot,
	sime: sime,
	simeq: simeq,
	simg: simg,
	simgE: simgE,
	siml: siml,
	simlE: simlE,
	simne: simne,
	simplus: simplus,
	simrarr: simrarr,
	slarr: slarr,
	SmallCircle: SmallCircle,
	smallsetminus: smallsetminus,
	smashp: smashp,
	smeparsl: smeparsl,
	smid: smid,
	smile: smile,
	smt: smt,
	smte: smte,
	smtes: smtes,
	SOFTcy: SOFTcy,
	softcy: softcy,
	solbar: solbar,
	solb: solb,
	sol: sol,
	Sopf: Sopf,
	sopf: sopf,
	spades: spades,
	spadesuit: spadesuit,
	spar: spar,
	sqcap: sqcap,
	sqcaps: sqcaps,
	sqcup: sqcup,
	sqcups: sqcups,
	Sqrt: Sqrt,
	sqsub: sqsub,
	sqsube: sqsube,
	sqsubset: sqsubset,
	sqsubseteq: sqsubseteq,
	sqsup: sqsup,
	sqsupe: sqsupe,
	sqsupset: sqsupset,
	sqsupseteq: sqsupseteq,
	square: square,
	Square: Square,
	SquareIntersection: SquareIntersection,
	SquareSubset: SquareSubset,
	SquareSubsetEqual: SquareSubsetEqual,
	SquareSuperset: SquareSuperset,
	SquareSupersetEqual: SquareSupersetEqual,
	SquareUnion: SquareUnion,
	squarf: squarf,
	squ: squ,
	squf: squf,
	srarr: srarr,
	Sscr: Sscr,
	sscr: sscr,
	ssetmn: ssetmn,
	ssmile: ssmile,
	sstarf: sstarf,
	Star: Star,
	star: star,
	starf: starf,
	straightepsilon: straightepsilon,
	straightphi: straightphi,
	strns: strns,
	sub: sub,
	Sub: Sub,
	subdot: subdot,
	subE: subE,
	sube: sube,
	subedot: subedot,
	submult: submult,
	subnE: subnE,
	subne: subne,
	subplus: subplus,
	subrarr: subrarr,
	subset: subset,
	Subset: Subset,
	subseteq: subseteq,
	subseteqq: subseteqq,
	SubsetEqual: SubsetEqual,
	subsetneq: subsetneq,
	subsetneqq: subsetneqq,
	subsim: subsim,
	subsub: subsub,
	subsup: subsup,
	succapprox: succapprox,
	succ: succ,
	succcurlyeq: succcurlyeq,
	Succeeds: Succeeds,
	SucceedsEqual: SucceedsEqual,
	SucceedsSlantEqual: SucceedsSlantEqual,
	SucceedsTilde: SucceedsTilde,
	succeq: succeq,
	succnapprox: succnapprox,
	succneqq: succneqq,
	succnsim: succnsim,
	succsim: succsim,
	SuchThat: SuchThat,
	sum: sum,
	Sum: Sum,
	sung: sung,
	sup1: sup1,
	sup2: sup2,
	sup3: sup3,
	sup: sup,
	Sup: Sup,
	supdot: supdot,
	supdsub: supdsub,
	supE: supE,
	supe: supe,
	supedot: supedot,
	Superset: Superset,
	SupersetEqual: SupersetEqual,
	suphsol: suphsol,
	suphsub: suphsub,
	suplarr: suplarr,
	supmult: supmult,
	supnE: supnE,
	supne: supne,
	supplus: supplus,
	supset: supset,
	Supset: Supset,
	supseteq: supseteq,
	supseteqq: supseteqq,
	supsetneq: supsetneq,
	supsetneqq: supsetneqq,
	supsim: supsim,
	supsub: supsub,
	supsup: supsup,
	swarhk: swarhk,
	swarr: swarr,
	swArr: swArr,
	swarrow: swarrow,
	swnwar: swnwar,
	szlig: szlig,
	Tab: Tab,
	target: target,
	Tau: Tau,
	tau: tau,
	tbrk: tbrk,
	Tcaron: Tcaron,
	tcaron: tcaron,
	Tcedil: Tcedil,
	tcedil: tcedil,
	Tcy: Tcy,
	tcy: tcy,
	tdot: tdot,
	telrec: telrec,
	Tfr: Tfr,
	tfr: tfr,
	there4: there4,
	therefore: therefore,
	Therefore: Therefore,
	Theta: Theta,
	theta: theta,
	thetasym: thetasym,
	thetav: thetav,
	thickapprox: thickapprox,
	thicksim: thicksim,
	ThickSpace: ThickSpace,
	ThinSpace: ThinSpace,
	thinsp: thinsp,
	thkap: thkap,
	thksim: thksim,
	THORN: THORN,
	thorn: thorn,
	tilde: tilde,
	Tilde: Tilde,
	TildeEqual: TildeEqual,
	TildeFullEqual: TildeFullEqual,
	TildeTilde: TildeTilde,
	timesbar: timesbar,
	timesb: timesb,
	times: times$1,
	timesd: timesd,
	tint: tint,
	toea: toea,
	topbot: topbot,
	topcir: topcir,
	top: top,
	Topf: Topf,
	topf: topf,
	topfork: topfork,
	tosa: tosa,
	tprime: tprime,
	trade: trade,
	TRADE: TRADE,
	triangle: triangle,
	triangledown: triangledown,
	triangleleft: triangleleft,
	trianglelefteq: trianglelefteq,
	triangleq: triangleq,
	triangleright: triangleright,
	trianglerighteq: trianglerighteq,
	tridot: tridot,
	trie: trie,
	triminus: triminus,
	TripleDot: TripleDot,
	triplus: triplus,
	trisb: trisb,
	tritime: tritime,
	trpezium: trpezium,
	Tscr: Tscr,
	tscr: tscr,
	TScy: TScy,
	tscy: tscy,
	TSHcy: TSHcy,
	tshcy: tshcy,
	Tstrok: Tstrok,
	tstrok: tstrok,
	twixt: twixt,
	twoheadleftarrow: twoheadleftarrow,
	twoheadrightarrow: twoheadrightarrow,
	Uacute: Uacute,
	uacute: uacute,
	uarr: uarr,
	Uarr: Uarr,
	uArr: uArr,
	Uarrocir: Uarrocir,
	Ubrcy: Ubrcy,
	ubrcy: ubrcy,
	Ubreve: Ubreve,
	ubreve: ubreve,
	Ucirc: Ucirc,
	ucirc: ucirc,
	Ucy: Ucy,
	ucy: ucy,
	udarr: udarr,
	Udblac: Udblac,
	udblac: udblac,
	udhar: udhar,
	ufisht: ufisht,
	Ufr: Ufr,
	ufr: ufr,
	Ugrave: Ugrave,
	ugrave: ugrave,
	uHar: uHar,
	uharl: uharl,
	uharr: uharr,
	uhblk: uhblk,
	ulcorn: ulcorn,
	ulcorner: ulcorner,
	ulcrop: ulcrop,
	ultri: ultri,
	Umacr: Umacr,
	umacr: umacr,
	uml: uml,
	UnderBar: UnderBar,
	UnderBrace: UnderBrace,
	UnderBracket: UnderBracket,
	UnderParenthesis: UnderParenthesis,
	Union: Union,
	UnionPlus: UnionPlus,
	Uogon: Uogon,
	uogon: uogon,
	Uopf: Uopf,
	uopf: uopf,
	UpArrowBar: UpArrowBar,
	uparrow: uparrow,
	UpArrow: UpArrow,
	Uparrow: Uparrow,
	UpArrowDownArrow: UpArrowDownArrow,
	updownarrow: updownarrow,
	UpDownArrow: UpDownArrow,
	Updownarrow: Updownarrow,
	UpEquilibrium: UpEquilibrium,
	upharpoonleft: upharpoonleft,
	upharpoonright: upharpoonright,
	uplus: uplus,
	UpperLeftArrow: UpperLeftArrow,
	UpperRightArrow: UpperRightArrow,
	upsi: upsi,
	Upsi: Upsi,
	upsih: upsih,
	Upsilon: Upsilon,
	upsilon: upsilon,
	UpTeeArrow: UpTeeArrow,
	UpTee: UpTee,
	upuparrows: upuparrows,
	urcorn: urcorn,
	urcorner: urcorner,
	urcrop: urcrop,
	Uring: Uring,
	uring: uring,
	urtri: urtri,
	Uscr: Uscr,
	uscr: uscr,
	utdot: utdot,
	Utilde: Utilde,
	utilde: utilde,
	utri: utri,
	utrif: utrif,
	uuarr: uuarr,
	Uuml: Uuml,
	uuml: uuml,
	uwangle: uwangle,
	vangrt: vangrt,
	varepsilon: varepsilon,
	varkappa: varkappa,
	varnothing: varnothing,
	varphi: varphi,
	varpi: varpi,
	varpropto: varpropto,
	varr: varr,
	vArr: vArr,
	varrho: varrho,
	varsigma: varsigma,
	varsubsetneq: varsubsetneq,
	varsubsetneqq: varsubsetneqq,
	varsupsetneq: varsupsetneq,
	varsupsetneqq: varsupsetneqq,
	vartheta: vartheta,
	vartriangleleft: vartriangleleft,
	vartriangleright: vartriangleright,
	vBar: vBar,
	Vbar: Vbar,
	vBarv: vBarv,
	Vcy: Vcy,
	vcy: vcy,
	vdash: vdash,
	vDash: vDash,
	Vdash: Vdash,
	VDash: VDash,
	Vdashl: Vdashl,
	veebar: veebar,
	vee: vee,
	Vee: Vee,
	veeeq: veeeq,
	vellip: vellip,
	verbar: verbar,
	Verbar: Verbar,
	vert: vert,
	Vert: Vert,
	VerticalBar: VerticalBar,
	VerticalLine: VerticalLine,
	VerticalSeparator: VerticalSeparator,
	VerticalTilde: VerticalTilde,
	VeryThinSpace: VeryThinSpace,
	Vfr: Vfr,
	vfr: vfr,
	vltri: vltri,
	vnsub: vnsub,
	vnsup: vnsup,
	Vopf: Vopf,
	vopf: vopf,
	vprop: vprop,
	vrtri: vrtri,
	Vscr: Vscr,
	vscr: vscr,
	vsubnE: vsubnE,
	vsubne: vsubne,
	vsupnE: vsupnE,
	vsupne: vsupne,
	Vvdash: Vvdash,
	vzigzag: vzigzag,
	Wcirc: Wcirc,
	wcirc: wcirc,
	wedbar: wedbar,
	wedge: wedge,
	Wedge: Wedge,
	wedgeq: wedgeq,
	weierp: weierp,
	Wfr: Wfr,
	wfr: wfr,
	Wopf: Wopf,
	wopf: wopf,
	wp: wp,
	wr: wr,
	wreath: wreath,
	Wscr: Wscr,
	wscr: wscr,
	xcap: xcap,
	xcirc: xcirc,
	xcup: xcup,
	xdtri: xdtri,
	Xfr: Xfr,
	xfr: xfr,
	xharr: xharr,
	xhArr: xhArr,
	Xi: Xi,
	xi: xi,
	xlarr: xlarr,
	xlArr: xlArr,
	xmap: xmap,
	xnis: xnis,
	xodot: xodot,
	Xopf: Xopf,
	xopf: xopf,
	xoplus: xoplus,
	xotime: xotime,
	xrarr: xrarr,
	xrArr: xrArr,
	Xscr: Xscr,
	xscr: xscr,
	xsqcup: xsqcup,
	xuplus: xuplus,
	xutri: xutri,
	xvee: xvee,
	xwedge: xwedge,
	Yacute: Yacute,
	yacute: yacute,
	YAcy: YAcy,
	yacy: yacy,
	Ycirc: Ycirc,
	ycirc: ycirc,
	Ycy: Ycy,
	ycy: ycy,
	yen: yen,
	Yfr: Yfr,
	yfr: yfr,
	YIcy: YIcy,
	yicy: yicy,
	Yopf: Yopf,
	yopf: yopf,
	Yscr: Yscr,
	yscr: yscr,
	YUcy: YUcy,
	yucy: yucy,
	yuml: yuml,
	Yuml: Yuml,
	Zacute: Zacute,
	zacute: zacute,
	Zcaron: Zcaron,
	zcaron: zcaron,
	Zcy: Zcy,
	zcy: zcy,
	Zdot: Zdot,
	zdot: zdot,
	zeetrf: zeetrf,
	ZeroWidthSpace: ZeroWidthSpace,
	Zeta: Zeta,
	zeta: zeta,
	zfr: zfr,
	Zfr: Zfr,
	ZHcy: ZHcy,
	zhcy: zhcy,
	zigrarr: zigrarr,
	zopf: zopf,
	Zopf: Zopf,
	Zscr: Zscr,
	zscr: zscr,
	zwj: zwj,
	zwnj: zwnj,
	default: entitiesJSON
});

var require$$0 = ( xml && xmlJSON ) || xml;

var require$$1 = ( entities && entitiesJSON ) || entities;

var inverseXML = getInverseObj$1(require$$0);
var xmlReplacer = getInverseReplacer$1(inverseXML);

var XML = getInverse$1(inverseXML, xmlReplacer);

var inverseHTML = getInverseObj$1(require$$1);
var htmlReplacer = getInverseReplacer$1(inverseHTML);

var HTML = getInverse$1(inverseHTML, htmlReplacer);

function getInverseObj$1(obj){
	return Object.keys(obj).sort().reduce(function(inverse, name){
		inverse[obj[name]] = "&" + name + ";";
		return inverse;
	}, {});
}

function getInverseReplacer$1(inverse){
	var single = [],
	    multiple = [];

	Object.keys(inverse).forEach(function(k){
		if(k.length === 1){
			single.push("\\" + k);
		} else {
			multiple.push(k);
		}
	});

	
	multiple.unshift("[" + single.join("") + "]");

	return new RegExp(multiple.join("|"), "g");
}

var re_nonASCII$1 = /[^\0-\x7F]/g;
var re_astralSymbols$1 = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

function singleCharReplacer$1(c){
	return "&#x" + c.charCodeAt(0).toString(16).toUpperCase() + ";";
}

function astralReplacer$1(c){
	
	var high = c.charCodeAt(0);
	var low  = c.charCodeAt(1);
	var codePoint = (high - 0xD800) * 0x400 + low - 0xDC00 + 0x10000;
	return "&#x" + codePoint.toString(16).toUpperCase() + ";";
}

function getInverse$1(inverse, re){
	function func(name){
		return inverse[name];
	}

	return function(data){
		return data
				.replace(re, func)
				.replace(re_astralSymbols$1, astralReplacer$1)
				.replace(re_nonASCII$1, singleCharReplacer$1);
	};
}

var re_xmlChars = getInverseReplacer$1(inverseXML);

function escapeXML(data){
	return data
			.replace(re_xmlChars, singleCharReplacer$1)
			.replace(re_astralSymbols$1, astralReplacer$1)
			.replace(re_nonASCII$1, singleCharReplacer$1);
}

var escape = escapeXML;

var encode = {
	XML: XML,
	HTML: HTML,
	escape: escape
};

var decode = {
	"0": 65533,
	"128": 8364,
	"130": 8218,
	"131": 402,
	"132": 8222,
	"133": 8230,
	"134": 8224,
	"135": 8225,
	"136": 710,
	"137": 8240,
	"138": 352,
	"139": 8249,
	"140": 338,
	"142": 381,
	"145": 8216,
	"146": 8217,
	"147": 8220,
	"148": 8221,
	"149": 8226,
	"150": 8211,
	"151": 8212,
	"152": 732,
	"153": 8482,
	"154": 353,
	"155": 8250,
	"156": 339,
	"158": 382,
	"159": 376
};

var decode$1 = Object.freeze({
	default: decode
});

var decodeMap = ( decode$1 && decode ) || decode$1;

var decode_codepoint = decodeCodePoint;


function decodeCodePoint(codePoint){

	if((codePoint >= 0xD800 && codePoint <= 0xDFFF) || codePoint > 0x10FFFF){
		return "\uFFFD";
	}

	if(codePoint in decodeMap){
		codePoint = decodeMap[codePoint];
	}

	var output = "";

	if(codePoint > 0xFFFF){
		codePoint -= 0x10000;
		output += String.fromCharCode(codePoint >>> 10 & 0x3FF | 0xD800);
		codePoint = 0xDC00 | codePoint & 0x3FF;
	}

	output += String.fromCharCode(codePoint);
	return output;
}

var Aacute$1 = "Á";
var aacute$1 = "á";
var Acirc$1 = "Â";
var acirc$1 = "â";
var acute$1 = "´";
var AElig$1 = "Æ";
var aelig$1 = "æ";
var Agrave$1 = "À";
var agrave$1 = "à";
var amp$2 = "&";
var AMP$1 = "&";
var Aring$1 = "Å";
var aring$1 = "å";
var Atilde$1 = "Ã";
var atilde$1 = "ã";
var Auml$1 = "Ä";
var auml$1 = "ä";
var brvbar$1 = "¦";
var Ccedil$1 = "Ç";
var ccedil$1 = "ç";
var cedil$1 = "¸";
var cent$1 = "¢";
var copy$1 = "©";
var COPY$1 = "©";
var curren$1 = "¤";
var deg$1 = "°";
var divide$1 = "÷";
var Eacute$1 = "É";
var eacute$1 = "é";
var Ecirc$1 = "Ê";
var ecirc$1 = "ê";
var Egrave$1 = "È";
var egrave$1 = "è";
var ETH$1 = "Ð";
var eth$1 = "ð";
var Euml$1 = "Ë";
var euml$1 = "ë";
var frac12$1 = "½";
var frac14$1 = "¼";
var frac34$1 = "¾";
var gt$2 = ">";
var GT$1 = ">";
var Iacute$1 = "Í";
var iacute$1 = "í";
var Icirc$1 = "Î";
var icirc$1 = "î";
var iexcl$1 = "¡";
var Igrave$1 = "Ì";
var igrave$1 = "ì";
var iquest$1 = "¿";
var Iuml$1 = "Ï";
var iuml$1 = "ï";
var laquo$1 = "«";
var lt$2 = "<";
var LT$1 = "<";
var macr$1 = "¯";
var micro$1 = "µ";
var middot$1 = "·";
var nbsp$1 = " ";
var not$1 = "¬";
var Ntilde$1 = "Ñ";
var ntilde$1 = "ñ";
var Oacute$1 = "Ó";
var oacute$1 = "ó";
var Ocirc$1 = "Ô";
var ocirc$1 = "ô";
var Ograve$1 = "Ò";
var ograve$1 = "ò";
var ordf$1 = "ª";
var ordm$1 = "º";
var Oslash$1 = "Ø";
var oslash$1 = "ø";
var Otilde$1 = "Õ";
var otilde$1 = "õ";
var Ouml$1 = "Ö";
var ouml$1 = "ö";
var para$1 = "¶";
var plusmn$1 = "±";
var pound$1 = "£";
var quot$2 = "\"";
var QUOT$1 = "\"";
var raquo$1 = "»";
var reg$1 = "®";
var REG$1 = "®";
var sect$1 = "§";
var shy$1 = "­";
var sup1$1 = "¹";
var sup2$1 = "²";
var sup3$1 = "³";
var szlig$1 = "ß";
var THORN$1 = "Þ";
var thorn$1 = "þ";
var times$1$1 = "×";
var Uacute$1 = "Ú";
var uacute$1 = "ú";
var Ucirc$1 = "Û";
var ucirc$1 = "û";
var Ugrave$1 = "Ù";
var ugrave$1 = "ù";
var uml$1 = "¨";
var Uuml$1 = "Ü";
var uuml$1 = "ü";
var Yacute$1 = "Ý";
var yacute$1 = "ý";
var yen$1 = "¥";
var yuml$1 = "ÿ";
var legacyJSON = {
	Aacute: Aacute$1,
	aacute: aacute$1,
	Acirc: Acirc$1,
	acirc: acirc$1,
	acute: acute$1,
	AElig: AElig$1,
	aelig: aelig$1,
	Agrave: Agrave$1,
	agrave: agrave$1,
	amp: amp$2,
	AMP: AMP$1,
	Aring: Aring$1,
	aring: aring$1,
	Atilde: Atilde$1,
	atilde: atilde$1,
	Auml: Auml$1,
	auml: auml$1,
	brvbar: brvbar$1,
	Ccedil: Ccedil$1,
	ccedil: ccedil$1,
	cedil: cedil$1,
	cent: cent$1,
	copy: copy$1,
	COPY: COPY$1,
	curren: curren$1,
	deg: deg$1,
	divide: divide$1,
	Eacute: Eacute$1,
	eacute: eacute$1,
	Ecirc: Ecirc$1,
	ecirc: ecirc$1,
	Egrave: Egrave$1,
	egrave: egrave$1,
	ETH: ETH$1,
	eth: eth$1,
	Euml: Euml$1,
	euml: euml$1,
	frac12: frac12$1,
	frac14: frac14$1,
	frac34: frac34$1,
	gt: gt$2,
	GT: GT$1,
	Iacute: Iacute$1,
	iacute: iacute$1,
	Icirc: Icirc$1,
	icirc: icirc$1,
	iexcl: iexcl$1,
	Igrave: Igrave$1,
	igrave: igrave$1,
	iquest: iquest$1,
	Iuml: Iuml$1,
	iuml: iuml$1,
	laquo: laquo$1,
	lt: lt$2,
	LT: LT$1,
	macr: macr$1,
	micro: micro$1,
	middot: middot$1,
	nbsp: nbsp$1,
	not: not$1,
	Ntilde: Ntilde$1,
	ntilde: ntilde$1,
	Oacute: Oacute$1,
	oacute: oacute$1,
	Ocirc: Ocirc$1,
	ocirc: ocirc$1,
	Ograve: Ograve$1,
	ograve: ograve$1,
	ordf: ordf$1,
	ordm: ordm$1,
	Oslash: Oslash$1,
	oslash: oslash$1,
	Otilde: Otilde$1,
	otilde: otilde$1,
	Ouml: Ouml$1,
	ouml: ouml$1,
	para: para$1,
	plusmn: plusmn$1,
	pound: pound$1,
	quot: quot$2,
	QUOT: QUOT$1,
	raquo: raquo$1,
	reg: reg$1,
	REG: REG$1,
	sect: sect$1,
	shy: shy$1,
	sup1: sup1$1,
	sup2: sup2$1,
	sup3: sup3$1,
	szlig: szlig$1,
	THORN: THORN$1,
	thorn: thorn$1,
	times: times$1$1,
	Uacute: Uacute$1,
	uacute: uacute$1,
	Ucirc: Ucirc$1,
	ucirc: ucirc$1,
	Ugrave: Ugrave$1,
	ugrave: ugrave$1,
	uml: uml$1,
	Uuml: Uuml$1,
	uuml: uuml$1,
	Yacute: Yacute$1,
	yacute: yacute$1,
	yen: yen$1,
	yuml: yuml$1
};

var _entities = {
  encodeXML: encode.XML,
  decodeCodepoint: decode_codepoint,
  entitiesJSON,
  legacyJSON,
  xmlJSON
};

var _entities_decodeCodepoint = _entities.decodeCodepoint;

var _entities_decodeCodepoint$1 = Object.freeze({
	default: _entities_decodeCodepoint
});

var _entities_entitiesJSON = _entities.entitiesJSON;


var _entities_entitiesJSON$1 = Object.freeze({
	default: _entities_entitiesJSON
});

var _entities_legacyJSON = _entities.legacyJSON;

var _entities_legacyJSON$1 = Object.freeze({
	default: _entities_legacyJSON
});

var _entities_xmlJSON = _entities.xmlJSON;

var _entities_xmlJSON$1 = Object.freeze({
	default: _entities_xmlJSON
});

var decodeCodePoint$1 = ( _entities_decodeCodepoint$1 && _entities_decodeCodepoint ) || _entities_decodeCodepoint$1;

var entityMap = ( _entities_entitiesJSON$1 && _entities_entitiesJSON ) || _entities_entitiesJSON$1;

var legacyMap = ( _entities_legacyJSON$1 && _entities_legacyJSON ) || _entities_legacyJSON$1;

var xmlMap = ( _entities_xmlJSON$1 && _entities_xmlJSON ) || _entities_xmlJSON$1;

var Tokenizer_1 = Tokenizer$1;

var i = 0;
var TEXT                      = i++;
var BEFORE_TAG_NAME           = i++;
var IN_TAG_NAME               = i++;
var IN_SELF_CLOSING_TAG       = i++;
var BEFORE_CLOSING_TAG_NAME   = i++;
var IN_CLOSING_TAG_NAME       = i++;
var AFTER_CLOSING_TAG_NAME    = i++;
var BEFORE_ATTRIBUTE_NAME     = i++;
var IN_ATTRIBUTE_NAME         = i++;
var AFTER_ATTRIBUTE_NAME      = i++;
var BEFORE_ATTRIBUTE_VALUE    = i++;
var IN_ATTRIBUTE_VALUE_DQ     = i++;
var IN_ATTRIBUTE_VALUE_SQ     = i++;
var IN_ATTRIBUTE_VALUE_NQ     = i++;
var BEFORE_DECLARATION        = i++;
var IN_DECLARATION            = i++;
var IN_PROCESSING_INSTRUCTION = i++;
var BEFORE_COMMENT            = i++;
var IN_COMMENT                = i++;
var AFTER_COMMENT_1           = i++;
var AFTER_COMMENT_2           = i++;
var BEFORE_CDATA_1            = i++;
var BEFORE_CDATA_2            = i++;
var BEFORE_CDATA_3            = i++;
var BEFORE_CDATA_4            = i++;
var BEFORE_CDATA_5            = i++;
var BEFORE_CDATA_6            = i++;
var IN_CDATA                  = i++;
var AFTER_CDATA_1             = i++;
var AFTER_CDATA_2             = i++;
var BEFORE_SPECIAL            = i++;
var BEFORE_SPECIAL_END        = i++;
var BEFORE_SCRIPT_1           = i++;
var BEFORE_SCRIPT_2           = i++;
var BEFORE_SCRIPT_3           = i++;
var BEFORE_SCRIPT_4           = i++;
var BEFORE_SCRIPT_5           = i++;
var AFTER_SCRIPT_1            = i++;
var AFTER_SCRIPT_2            = i++;
var AFTER_SCRIPT_3            = i++;
var AFTER_SCRIPT_4            = i++;
var AFTER_SCRIPT_5            = i++;
var BEFORE_STYLE_1            = i++;
var BEFORE_STYLE_2            = i++;
var BEFORE_STYLE_3            = i++;
var BEFORE_STYLE_4            = i++;
var AFTER_STYLE_1             = i++;
var AFTER_STYLE_2             = i++;
var AFTER_STYLE_3             = i++;
var AFTER_STYLE_4             = i++;
var BEFORE_ENTITY             = i++;
var BEFORE_NUMERIC_ENTITY     = i++;
var IN_NAMED_ENTITY           = i++;
var IN_NUMERIC_ENTITY         = i++;
var IN_HEX_ENTITY             = i++;
var j = 0;
var SPECIAL_NONE              = j++;
var SPECIAL_SCRIPT            = j++;
var SPECIAL_STYLE             = j++;

function whitespace(c){
	return c === " " || c === "\n" || c === "\t" || c === "\f" || c === "\r";
}

function characterState(char, SUCCESS){
	return function(c){
		if(c === char) this._state = SUCCESS;
	};
}

function ifElseState(upper, SUCCESS, FAILURE){
	var lower = upper.toLowerCase();

	if(upper === lower){
		return function(c){
			if(c === lower){
				this._state = SUCCESS;
			} else {
				this._state = FAILURE;
				this._index--;
			}
		};
	} else {
		return function(c){
			if(c === lower || c === upper){
				this._state = SUCCESS;
			} else {
				this._state = FAILURE;
				this._index--;
			}
		};
	}
}

function consumeSpecialNameChar(upper, NEXT_STATE){
	var lower = upper.toLowerCase();

	return function(c){
		if(c === lower || c === upper){
			this._state = NEXT_STATE;
		} else {
			this._state = IN_TAG_NAME;
			this._index--; 
		}
	};
}

function Tokenizer$1(options, cbs){
	this._state = TEXT;
	this._buffer = "";
	this._sectionStart = 0;
	this._index = 0;
	this._bufferOffset = 0; 
	this._baseState = TEXT;
	this._special = SPECIAL_NONE;
	this._cbs = cbs;
	this._running = true;
	this._ended = false;
	this._xmlMode = !!(options && options.xmlMode);
	this._decodeEntities = !!(options && options.decodeEntities);
}

Tokenizer$1.prototype._stateText = function(c){
	if(c === "<"){
		if(this._index > this._sectionStart){
			this._cbs.ontext(this._getSection());
		}
		this._state = BEFORE_TAG_NAME;
		this._sectionStart = this._index;
	} else if(this._decodeEntities && this._special === SPECIAL_NONE && c === "&"){
		if(this._index > this._sectionStart){
			this._cbs.ontext(this._getSection());
		}
		this._baseState = TEXT;
		this._state = BEFORE_ENTITY;
		this._sectionStart = this._index;
	}
};

Tokenizer$1.prototype._stateBeforeTagName = function(c){
	if(c === "/"){
		this._state = BEFORE_CLOSING_TAG_NAME;
	} else if(c === "<"){
		this._cbs.ontext(this._getSection());
		this._sectionStart = this._index;
	} else if(c === ">" || this._special !== SPECIAL_NONE || whitespace(c)) {
		this._state = TEXT;
	} else if(c === "!"){
		this._state = BEFORE_DECLARATION;
		this._sectionStart = this._index + 1;
	} else if(c === "?"){
		this._state = IN_PROCESSING_INSTRUCTION;
		this._sectionStart = this._index + 1;
	} else {
		this._state = (!this._xmlMode && (c === "s" || c === "S")) ?
						BEFORE_SPECIAL : IN_TAG_NAME;
		this._sectionStart = this._index;
	}
};

Tokenizer$1.prototype._stateInTagName = function(c){
	if(c === "/" || c === ">" || whitespace(c)){
		this._emitToken("onopentagname");
		this._state = BEFORE_ATTRIBUTE_NAME;
		this._index--;
	}
};

Tokenizer$1.prototype._stateBeforeCloseingTagName = function(c){
	if(whitespace(c));
	else if(c === ">"){
		this._state = TEXT;
	} else if(this._special !== SPECIAL_NONE){
		if(c === "s" || c === "S"){
			this._state = BEFORE_SPECIAL_END;
		} else {
			this._state = TEXT;
			this._index--;
		}
	} else {
		this._state = IN_CLOSING_TAG_NAME;
		this._sectionStart = this._index;
	}
};

Tokenizer$1.prototype._stateInCloseingTagName = function(c){
	if(c === ">" || whitespace(c)){
		this._emitToken("onclosetag");
		this._state = AFTER_CLOSING_TAG_NAME;
		this._index--;
	}
};

Tokenizer$1.prototype._stateAfterCloseingTagName = function(c){
	
	if(c === ">"){
		this._state = TEXT;
		this._sectionStart = this._index + 1;
	}
};

Tokenizer$1.prototype._stateBeforeAttributeName = function(c){
	if(c === ">"){
		this._cbs.onopentagend();
		this._state = TEXT;
		this._sectionStart = this._index + 1;
	} else if(c === "/"){
		this._state = IN_SELF_CLOSING_TAG;
	} else if(!whitespace(c)){
		this._state = IN_ATTRIBUTE_NAME;
		this._sectionStart = this._index;
	}
};

Tokenizer$1.prototype._stateInSelfClosingTag = function(c){
	if(c === ">"){
		this._cbs.onselfclosingtag();
		this._state = TEXT;
		this._sectionStart = this._index + 1;
	} else if(!whitespace(c)){
		this._state = BEFORE_ATTRIBUTE_NAME;
		this._index--;
	}
};

Tokenizer$1.prototype._stateInAttributeName = function(c){
	if(c === "=" || c === "/" || c === ">" || whitespace(c)){
		this._cbs.onattribname(this._getSection());
		this._sectionStart = -1;
		this._state = AFTER_ATTRIBUTE_NAME;
		this._index--;
	}
};

Tokenizer$1.prototype._stateAfterAttributeName = function(c){
	if(c === "="){
		this._state = BEFORE_ATTRIBUTE_VALUE;
	} else if(c === "/" || c === ">"){
		this._cbs.onattribend();
		this._state = BEFORE_ATTRIBUTE_NAME;
		this._index--;
	} else if(!whitespace(c)){
		this._cbs.onattribend();
		this._state = IN_ATTRIBUTE_NAME;
		this._sectionStart = this._index;
	}
};

Tokenizer$1.prototype._stateBeforeAttributeValue = function(c){
	if(c === "\""){
		this._state = IN_ATTRIBUTE_VALUE_DQ;
		this._sectionStart = this._index + 1;
	} else if(c === "'"){
		this._state = IN_ATTRIBUTE_VALUE_SQ;
		this._sectionStart = this._index + 1;
	} else if(!whitespace(c)){
		this._state = IN_ATTRIBUTE_VALUE_NQ;
		this._sectionStart = this._index;
		this._index--; 
	}
};

Tokenizer$1.prototype._stateInAttributeValueDoubleQuotes = function(c){
	if(c === "\""){
		this._emitToken("onattribdata");
		this._cbs.onattribend();
		this._state = BEFORE_ATTRIBUTE_NAME;
	} else if(this._decodeEntities && c === "&"){
		this._emitToken("onattribdata");
		this._baseState = this._state;
		this._state = BEFORE_ENTITY;
		this._sectionStart = this._index;
	}
};

Tokenizer$1.prototype._stateInAttributeValueSingleQuotes = function(c){
	if(c === "'"){
		this._emitToken("onattribdata");
		this._cbs.onattribend();
		this._state = BEFORE_ATTRIBUTE_NAME;
	} else if(this._decodeEntities && c === "&"){
		this._emitToken("onattribdata");
		this._baseState = this._state;
		this._state = BEFORE_ENTITY;
		this._sectionStart = this._index;
	}
};

Tokenizer$1.prototype._stateInAttributeValueNoQuotes = function(c){
	if(whitespace(c) || c === ">"){
		this._emitToken("onattribdata");
		this._cbs.onattribend();
		this._state = BEFORE_ATTRIBUTE_NAME;
		this._index--;
	} else if(this._decodeEntities && c === "&"){
		this._emitToken("onattribdata");
		this._baseState = this._state;
		this._state = BEFORE_ENTITY;
		this._sectionStart = this._index;
	}
};

Tokenizer$1.prototype._stateBeforeDeclaration = function(c){
	this._state = c === "[" ? BEFORE_CDATA_1 :
					c === "-" ? BEFORE_COMMENT :
						IN_DECLARATION;
};

Tokenizer$1.prototype._stateInDeclaration = function(c){
	if(c === ">"){
		this._cbs.ondeclaration(this._getSection());
		this._state = TEXT;
		this._sectionStart = this._index + 1;
	}
};

Tokenizer$1.prototype._stateInProcessingInstruction = function(c){
	if(c === ">"){
		this._cbs.onprocessinginstruction(this._getSection());
		this._state = TEXT;
		this._sectionStart = this._index + 1;
	}
};

Tokenizer$1.prototype._stateBeforeComment = function(c){
	if(c === "-"){
		this._state = IN_COMMENT;
		this._sectionStart = this._index + 1;
	} else {
		this._state = IN_DECLARATION;
	}
};

Tokenizer$1.prototype._stateInComment = function(c){
	if(c === "-") this._state = AFTER_COMMENT_1;
};

Tokenizer$1.prototype._stateAfterComment1 = function(c){
	if(c === "-"){
		this._state = AFTER_COMMENT_2;
	} else {
		this._state = IN_COMMENT;
	}
};

Tokenizer$1.prototype._stateAfterComment2 = function(c){
	if(c === ">"){
		
		this._cbs.oncomment(this._buffer.substring(this._sectionStart, this._index - 2));
		this._state = TEXT;
		this._sectionStart = this._index + 1;
	} else if(c !== "-"){
		this._state = IN_COMMENT;
	}
	
};

Tokenizer$1.prototype._stateBeforeCdata1 = ifElseState("C", BEFORE_CDATA_2, IN_DECLARATION);
Tokenizer$1.prototype._stateBeforeCdata2 = ifElseState("D", BEFORE_CDATA_3, IN_DECLARATION);
Tokenizer$1.prototype._stateBeforeCdata3 = ifElseState("A", BEFORE_CDATA_4, IN_DECLARATION);
Tokenizer$1.prototype._stateBeforeCdata4 = ifElseState("T", BEFORE_CDATA_5, IN_DECLARATION);
Tokenizer$1.prototype._stateBeforeCdata5 = ifElseState("A", BEFORE_CDATA_6, IN_DECLARATION);

Tokenizer$1.prototype._stateBeforeCdata6 = function(c){
	if(c === "["){
		this._state = IN_CDATA;
		this._sectionStart = this._index + 1;
	} else {
		this._state = IN_DECLARATION;
		this._index--;
	}
};

Tokenizer$1.prototype._stateInCdata = function(c){
	if(c === "]") this._state = AFTER_CDATA_1;
};

Tokenizer$1.prototype._stateAfterCdata1 = characterState("]", AFTER_CDATA_2);

Tokenizer$1.prototype._stateAfterCdata2 = function(c){
	if(c === ">"){
		
		this._cbs.oncdata(this._buffer.substring(this._sectionStart, this._index - 2));
		this._state = TEXT;
		this._sectionStart = this._index + 1;
	} else if(c !== "]") {
		this._state = IN_CDATA;
	}
	
};

Tokenizer$1.prototype._stateBeforeSpecial = function(c){
	if(c === "c" || c === "C"){
		this._state = BEFORE_SCRIPT_1;
	} else if(c === "t" || c === "T"){
		this._state = BEFORE_STYLE_1;
	} else {
		this._state = IN_TAG_NAME;
		this._index--; 
	}
};

Tokenizer$1.prototype._stateBeforeSpecialEnd = function(c){
	if(this._special === SPECIAL_SCRIPT && (c === "c" || c === "C")){
		this._state = AFTER_SCRIPT_1;
	} else if(this._special === SPECIAL_STYLE && (c === "t" || c === "T")){
		this._state = AFTER_STYLE_1;
	}
	else this._state = TEXT;
};

Tokenizer$1.prototype._stateBeforeScript1 = consumeSpecialNameChar("R", BEFORE_SCRIPT_2);
Tokenizer$1.prototype._stateBeforeScript2 = consumeSpecialNameChar("I", BEFORE_SCRIPT_3);
Tokenizer$1.prototype._stateBeforeScript3 = consumeSpecialNameChar("P", BEFORE_SCRIPT_4);
Tokenizer$1.prototype._stateBeforeScript4 = consumeSpecialNameChar("T", BEFORE_SCRIPT_5);

Tokenizer$1.prototype._stateBeforeScript5 = function(c){
	if(c === "/" || c === ">" || whitespace(c)){
		this._special = SPECIAL_SCRIPT;
	}
	this._state = IN_TAG_NAME;
	this._index--; 
};

Tokenizer$1.prototype._stateAfterScript1 = ifElseState("R", AFTER_SCRIPT_2, TEXT);
Tokenizer$1.prototype._stateAfterScript2 = ifElseState("I", AFTER_SCRIPT_3, TEXT);
Tokenizer$1.prototype._stateAfterScript3 = ifElseState("P", AFTER_SCRIPT_4, TEXT);
Tokenizer$1.prototype._stateAfterScript4 = ifElseState("T", AFTER_SCRIPT_5, TEXT);

Tokenizer$1.prototype._stateAfterScript5 = function(c){
	if(c === ">" || whitespace(c)){
		this._special = SPECIAL_NONE;
		this._state = IN_CLOSING_TAG_NAME;
		this._sectionStart = this._index - 6;
		this._index--; 
	}
	else this._state = TEXT;
};

Tokenizer$1.prototype._stateBeforeStyle1 = consumeSpecialNameChar("Y", BEFORE_STYLE_2);
Tokenizer$1.prototype._stateBeforeStyle2 = consumeSpecialNameChar("L", BEFORE_STYLE_3);
Tokenizer$1.prototype._stateBeforeStyle3 = consumeSpecialNameChar("E", BEFORE_STYLE_4);

Tokenizer$1.prototype._stateBeforeStyle4 = function(c){
	if(c === "/" || c === ">" || whitespace(c)){
		this._special = SPECIAL_STYLE;
	}
	this._state = IN_TAG_NAME;
	this._index--; 
};

Tokenizer$1.prototype._stateAfterStyle1 = ifElseState("Y", AFTER_STYLE_2, TEXT);
Tokenizer$1.prototype._stateAfterStyle2 = ifElseState("L", AFTER_STYLE_3, TEXT);
Tokenizer$1.prototype._stateAfterStyle3 = ifElseState("E", AFTER_STYLE_4, TEXT);

Tokenizer$1.prototype._stateAfterStyle4 = function(c){
	if(c === ">" || whitespace(c)){
		this._special = SPECIAL_NONE;
		this._state = IN_CLOSING_TAG_NAME;
		this._sectionStart = this._index - 5;
		this._index--; 
	}
	else this._state = TEXT;
};

Tokenizer$1.prototype._stateBeforeEntity = ifElseState("#", BEFORE_NUMERIC_ENTITY, IN_NAMED_ENTITY);
Tokenizer$1.prototype._stateBeforeNumericEntity = ifElseState("X", IN_HEX_ENTITY, IN_NUMERIC_ENTITY);


Tokenizer$1.prototype._parseNamedEntityStrict = function(){
	
	if(this._sectionStart + 1 < this._index){
		var entity = this._buffer.substring(this._sectionStart + 1, this._index),
		    map = this._xmlMode ? xmlMap : entityMap;

		if(map.hasOwnProperty(entity)){
			this._emitPartial(map[entity]);
			this._sectionStart = this._index + 1;
		}
	}
};



Tokenizer$1.prototype._parseLegacyEntity = function(){
	var start = this._sectionStart + 1,
	    limit = this._index - start;

	if(limit > 6) limit = 6; 

	while(limit >= 2){ 
		var entity = this._buffer.substr(start, limit);

		if(legacyMap.hasOwnProperty(entity)){
			this._emitPartial(legacyMap[entity]);
			this._sectionStart += limit + 1;
			return;
		} else {
			limit--;
		}
	}
};

Tokenizer$1.prototype._stateInNamedEntity = function(c){
	if(c === ";"){
		this._parseNamedEntityStrict();
		if(this._sectionStart + 1 < this._index && !this._xmlMode){
			this._parseLegacyEntity();
		}
		this._state = this._baseState;
	} else if((c < "a" || c > "z") && (c < "A" || c > "Z") && (c < "0" || c > "9")){
		if(this._xmlMode);
		else if(this._sectionStart + 1 === this._index);
		else if(this._baseState !== TEXT){
			if(c !== "="){
				this._parseNamedEntityStrict();
			}
		} else {
			this._parseLegacyEntity();
		}

		this._state = this._baseState;
		this._index--;
	}
};

Tokenizer$1.prototype._decodeNumericEntity = function(offset, base){
	var sectionStart = this._sectionStart + offset;

	if(sectionStart !== this._index){
		
		var entity = this._buffer.substring(sectionStart, this._index);
		var parsed = parseInt(entity, base);

		this._emitPartial(decodeCodePoint$1(parsed));
		this._sectionStart = this._index;
	} else {
		this._sectionStart--;
	}

	this._state = this._baseState;
};

Tokenizer$1.prototype._stateInNumericEntity = function(c){
	if(c === ";"){
		this._decodeNumericEntity(2, 10);
		this._sectionStart++;
	} else if(c < "0" || c > "9"){
		if(!this._xmlMode){
			this._decodeNumericEntity(2, 10);
		} else {
			this._state = this._baseState;
		}
		this._index--;
	}
};

Tokenizer$1.prototype._stateInHexEntity = function(c){
	if(c === ";"){
		this._decodeNumericEntity(3, 16);
		this._sectionStart++;
	} else if((c < "a" || c > "f") && (c < "A" || c > "F") && (c < "0" || c > "9")){
		if(!this._xmlMode){
			this._decodeNumericEntity(3, 16);
		} else {
			this._state = this._baseState;
		}
		this._index--;
	}
};

Tokenizer$1.prototype._cleanup = function (){
	if(this._sectionStart < 0){
		this._buffer = "";
		this._bufferOffset += this._index;
		this._index = 0;
	} else if(this._running){
		if(this._state === TEXT){
			if(this._sectionStart !== this._index){
				this._cbs.ontext(this._buffer.substr(this._sectionStart));
			}
			this._buffer = "";
			this._bufferOffset += this._index;
			this._index = 0;
		} else if(this._sectionStart === this._index){
			
			this._buffer = "";
			this._bufferOffset += this._index;
			this._index = 0;
		} else {
			
			this._buffer = this._buffer.substr(this._sectionStart);
			this._index -= this._sectionStart;
			this._bufferOffset += this._sectionStart;
		}

		this._sectionStart = 0;
	}
};


Tokenizer$1.prototype.write = function(chunk){
	if(this._ended) this._cbs.onerror(Error(".write() after done!"));

	this._buffer += chunk;
	this._parse();
};

Tokenizer$1.prototype._parse = function(){
	while(this._index < this._buffer.length && this._running){
		var c = this._buffer.charAt(this._index);
		if(this._state === TEXT) {
			this._stateText(c);
		} else if(this._state === BEFORE_TAG_NAME){
			this._stateBeforeTagName(c);
		} else if(this._state === IN_TAG_NAME) {
			this._stateInTagName(c);
		} else if(this._state === BEFORE_CLOSING_TAG_NAME){
			this._stateBeforeCloseingTagName(c);
		} else if(this._state === IN_CLOSING_TAG_NAME){
			this._stateInCloseingTagName(c);
		} else if(this._state === AFTER_CLOSING_TAG_NAME){
			this._stateAfterCloseingTagName(c);
		} else if(this._state === IN_SELF_CLOSING_TAG){
			this._stateInSelfClosingTag(c);
		}

		
		else if(this._state === BEFORE_ATTRIBUTE_NAME){
			this._stateBeforeAttributeName(c);
		} else if(this._state === IN_ATTRIBUTE_NAME){
			this._stateInAttributeName(c);
		} else if(this._state === AFTER_ATTRIBUTE_NAME){
			this._stateAfterAttributeName(c);
		} else if(this._state === BEFORE_ATTRIBUTE_VALUE){
			this._stateBeforeAttributeValue(c);
		} else if(this._state === IN_ATTRIBUTE_VALUE_DQ){
			this._stateInAttributeValueDoubleQuotes(c);
		} else if(this._state === IN_ATTRIBUTE_VALUE_SQ){
			this._stateInAttributeValueSingleQuotes(c);
		} else if(this._state === IN_ATTRIBUTE_VALUE_NQ){
			this._stateInAttributeValueNoQuotes(c);
		}

		
		else if(this._state === BEFORE_DECLARATION){
			this._stateBeforeDeclaration(c);
		} else if(this._state === IN_DECLARATION){
			this._stateInDeclaration(c);
		}

		
		else if(this._state === IN_PROCESSING_INSTRUCTION){
			this._stateInProcessingInstruction(c);
		}

		
		else if(this._state === BEFORE_COMMENT){
			this._stateBeforeComment(c);
		} else if(this._state === IN_COMMENT){
			this._stateInComment(c);
		} else if(this._state === AFTER_COMMENT_1){
			this._stateAfterComment1(c);
		} else if(this._state === AFTER_COMMENT_2){
			this._stateAfterComment2(c);
		}

		
		else if(this._state === BEFORE_CDATA_1){
			this._stateBeforeCdata1(c);
		} else if(this._state === BEFORE_CDATA_2){
			this._stateBeforeCdata2(c);
		} else if(this._state === BEFORE_CDATA_3){
			this._stateBeforeCdata3(c);
		} else if(this._state === BEFORE_CDATA_4){
			this._stateBeforeCdata4(c);
		} else if(this._state === BEFORE_CDATA_5){
			this._stateBeforeCdata5(c);
		} else if(this._state === BEFORE_CDATA_6){
			this._stateBeforeCdata6(c);
		} else if(this._state === IN_CDATA){
			this._stateInCdata(c);
		} else if(this._state === AFTER_CDATA_1){
			this._stateAfterCdata1(c);
		} else if(this._state === AFTER_CDATA_2){
			this._stateAfterCdata2(c);
		}

		
		else if(this._state === BEFORE_SPECIAL){
			this._stateBeforeSpecial(c);
		} else if(this._state === BEFORE_SPECIAL_END){
			this._stateBeforeSpecialEnd(c);
		}

		
		else if(this._state === BEFORE_SCRIPT_1){
			this._stateBeforeScript1(c);
		} else if(this._state === BEFORE_SCRIPT_2){
			this._stateBeforeScript2(c);
		} else if(this._state === BEFORE_SCRIPT_3){
			this._stateBeforeScript3(c);
		} else if(this._state === BEFORE_SCRIPT_4){
			this._stateBeforeScript4(c);
		} else if(this._state === BEFORE_SCRIPT_5){
			this._stateBeforeScript5(c);
		}

		else if(this._state === AFTER_SCRIPT_1){
			this._stateAfterScript1(c);
		} else if(this._state === AFTER_SCRIPT_2){
			this._stateAfterScript2(c);
		} else if(this._state === AFTER_SCRIPT_3){
			this._stateAfterScript3(c);
		} else if(this._state === AFTER_SCRIPT_4){
			this._stateAfterScript4(c);
		} else if(this._state === AFTER_SCRIPT_5){
			this._stateAfterScript5(c);
		}

		
		else if(this._state === BEFORE_STYLE_1){
			this._stateBeforeStyle1(c);
		} else if(this._state === BEFORE_STYLE_2){
			this._stateBeforeStyle2(c);
		} else if(this._state === BEFORE_STYLE_3){
			this._stateBeforeStyle3(c);
		} else if(this._state === BEFORE_STYLE_4){
			this._stateBeforeStyle4(c);
		}

		else if(this._state === AFTER_STYLE_1){
			this._stateAfterStyle1(c);
		} else if(this._state === AFTER_STYLE_2){
			this._stateAfterStyle2(c);
		} else if(this._state === AFTER_STYLE_3){
			this._stateAfterStyle3(c);
		} else if(this._state === AFTER_STYLE_4){
			this._stateAfterStyle4(c);
		}

		
		else if(this._state === BEFORE_ENTITY){
			this._stateBeforeEntity(c);
		} else if(this._state === BEFORE_NUMERIC_ENTITY){
			this._stateBeforeNumericEntity(c);
		} else if(this._state === IN_NAMED_ENTITY){
			this._stateInNamedEntity(c);
		} else if(this._state === IN_NUMERIC_ENTITY){
			this._stateInNumericEntity(c);
		} else if(this._state === IN_HEX_ENTITY){
			this._stateInHexEntity(c);
		}

		else {
			this._cbs.onerror(Error("unknown _state"), this._state);
		}

		this._index++;
	}

	this._cleanup();
};

Tokenizer$1.prototype.pause = function(){
	this._running = false;
};
Tokenizer$1.prototype.resume = function(){
	this._running = true;

	if(this._index < this._buffer.length){
		this._parse();
	}
	if(this._ended){
		this._finish();
	}
};

Tokenizer$1.prototype.end = function(chunk){
	if(this._ended) this._cbs.onerror(Error(".end() after done!"));
	if(chunk) this.write(chunk);

	this._ended = true;

	if(this._running) this._finish();
};

Tokenizer$1.prototype._finish = function(){
	
	if(this._sectionStart < this._index){
		this._handleTrailingData();
	}

	this._cbs.onend();
};

Tokenizer$1.prototype._handleTrailingData = function(){
	var data = this._buffer.substr(this._sectionStart);

	if(this._state === IN_CDATA || this._state === AFTER_CDATA_1 || this._state === AFTER_CDATA_2){
		this._cbs.oncdata(data);
	} else if(this._state === IN_COMMENT || this._state === AFTER_COMMENT_1 || this._state === AFTER_COMMENT_2){
		this._cbs.oncomment(data);
	} else if(this._state === IN_NAMED_ENTITY && !this._xmlMode){
		this._parseLegacyEntity();
		if(this._sectionStart < this._index){
			this._state = this._baseState;
			this._handleTrailingData();
		}
	} else if(this._state === IN_NUMERIC_ENTITY && !this._xmlMode){
		this._decodeNumericEntity(2, 10);
		if(this._sectionStart < this._index){
			this._state = this._baseState;
			this._handleTrailingData();
		}
	} else if(this._state === IN_HEX_ENTITY && !this._xmlMode){
		this._decodeNumericEntity(3, 16);
		if(this._sectionStart < this._index){
			this._state = this._baseState;
			this._handleTrailingData();
		}
	} else if(
		this._state !== IN_TAG_NAME &&
		this._state !== BEFORE_ATTRIBUTE_NAME &&
		this._state !== BEFORE_ATTRIBUTE_VALUE &&
		this._state !== AFTER_ATTRIBUTE_NAME &&
		this._state !== IN_ATTRIBUTE_NAME &&
		this._state !== IN_ATTRIBUTE_VALUE_SQ &&
		this._state !== IN_ATTRIBUTE_VALUE_DQ &&
		this._state !== IN_ATTRIBUTE_VALUE_NQ &&
		this._state !== IN_CLOSING_TAG_NAME
	){
		this._cbs.ontext(data);
	}
	
	
};

Tokenizer$1.prototype.reset = function(){
	Tokenizer$1.call(this, {xmlMode: this._xmlMode, decodeEntities: this._decodeEntities}, this._cbs);
};

Tokenizer$1.prototype.getAbsoluteIndex = function(){
	return this._bufferOffset + this._index;
};

Tokenizer$1.prototype._getSection = function(){
	return this._buffer.substring(this._sectionStart, this._index);
};

Tokenizer$1.prototype._emitToken = function(name){
	this._cbs[name](this._getSection());
	this._sectionStart = -1;
};

Tokenizer$1.prototype._emitPartial = function(value){
	if(this._baseState !== TEXT){
		this._cbs.onattribdata(value); 
	} else {
		this._cbs.ontext(value);
	}
};

var _inherits = function() {};

var _inherits$1 = Object.freeze({
	default: _inherits
});

var _resolve_empty = {};

var _resolve_empty$1 = Object.freeze({
	default: _resolve_empty
});

var require$$1$1 = ( _inherits$1 && _inherits ) || _inherits$1;

var require$$2 = ( _resolve_empty$1 && _resolve_empty ) || _resolve_empty$1;

var Tokenizer$1$1 = Tokenizer_1;





var formTags = {
	input: true,
	option: true,
	optgroup: true,
	select: true,
	button: true,
	datalist: true,
	textarea: true
};

var openImpliesClose = {
	tr      : { tr:true, th:true, td:true },
	th      : { th:true },
	td      : { thead:true, th:true, td:true },
	body    : { head:true, link:true, script:true },
	li      : { li:true },
	p       : { p:true },
	h1      : { p:true },
	h2      : { p:true },
	h3      : { p:true },
	h4      : { p:true },
	h5      : { p:true },
	h6      : { p:true },
	select  : formTags,
	input   : formTags,
	output  : formTags,
	button  : formTags,
	datalist: formTags,
	textarea: formTags,
	option  : { option:true },
	optgroup: { optgroup:true }
};

var voidElements = {
	__proto__: null,
	area: true,
	base: true,
	basefont: true,
	br: true,
	col: true,
	command: true,
	embed: true,
	frame: true,
	hr: true,
	img: true,
	input: true,
	isindex: true,
	keygen: true,
	link: true,
	meta: true,
	param: true,
	source: true,
	track: true,
	wbr: true,

	
	path: true,
	circle: true,
	ellipse: true,
	line: true,
	rect: true,
	use: true,
	stop: true,
	polyline: true,
	polygon: true
};

var re_nameEnd = /\s|\//;

function Parser$1(cbs, options){
	this._options = options || {};
	this._cbs = cbs || {};

	this._tagname = "";
	this._attribname = "";
	this._attribvalue = "";
	this._attribs = null;
	this._stack = [];

	this.startIndex = 0;
	this.endIndex = null;

	this._lowerCaseTagNames = "lowerCaseTags" in this._options ?
									!!this._options.lowerCaseTags :
									!this._options.xmlMode;
	this._lowerCaseAttributeNames = "lowerCaseAttributeNames" in this._options ?
									!!this._options.lowerCaseAttributeNames :
									!this._options.xmlMode;

	if(this._options.Tokenizer) {
		Tokenizer$1$1 = this._options.Tokenizer;
	}
	this._tokenizer = new Tokenizer$1$1(this._options, this);

	if(this._cbs.onparserinit) this._cbs.onparserinit(this);
}

require$$1$1(Parser$1, require$$2.EventEmitter);

Parser$1.prototype._updatePosition = function(initialOffset){
	if(this.endIndex === null){
		if(this._tokenizer._sectionStart <= initialOffset){
			this.startIndex = 0;
		} else {
			this.startIndex = this._tokenizer._sectionStart - initialOffset;
		}
	}
	else this.startIndex = this.endIndex + 1;
	this.endIndex = this._tokenizer.getAbsoluteIndex();
};


Parser$1.prototype.ontext = function(data){
	this._updatePosition(1);
	this.endIndex--;

	if(this._cbs.ontext) this._cbs.ontext(data);
};

Parser$1.prototype.onopentagname = function(name){
	if(this._lowerCaseTagNames){
		name = name.toLowerCase();
	}

	this._tagname = name;

	if(!this._options.xmlMode && name in openImpliesClose) {
		for(
			var el;
			(el = this._stack[this._stack.length - 1]) in openImpliesClose[name];
			this.onclosetag(el)
		);
	}

	if(this._options.xmlMode || !(name in voidElements)){
		this._stack.push(name);
	}

	if(this._cbs.onopentagname) this._cbs.onopentagname(name);
	if(this._cbs.onopentag) this._attribs = {};
};

Parser$1.prototype.onopentagend = function(){
	this._updatePosition(1);

	if(this._attribs){
		if(this._cbs.onopentag) this._cbs.onopentag(this._tagname, this._attribs);
		this._attribs = null;
	}

	if(!this._options.xmlMode && this._cbs.onclosetag && this._tagname in voidElements){
		this._cbs.onclosetag(this._tagname);
	}

	this._tagname = "";
};

Parser$1.prototype.onclosetag = function(name){
	this._updatePosition(1);
	if(this._lowerCaseTagNames){
		name = name.toLowerCase();
	}
	
	
	
	if(this._options.xmlMode) {
		const stack = this._stack;
		let last = stack.pop();
		while(last !== name) {
			if(this._cbs.onerror) {
				this._cbs.onerror("Unclosed tag <"+last+">");
			}
			last = stack.pop();
		}
		this.onopentagend();
		if(this._cbs.onclosetag) {
			this._cbs.onclosetag(last);
		}
	} else {
		if(this._stack.length && (!(name in voidElements))) {
			let pos = this._stack.lastIndexOf(name);
			if(pos !== -1){
				if(this._cbs.onclosetag){
					pos = this._stack.length - pos;
					while(pos--) this._cbs.onclosetag(this._stack.pop());
				}
				else this._stack.length = pos;
			} else if(name === "p"){
				this.onopentagname(name);
				this._closeCurrentTag();
			}
		} else if(name === "br" || name === "p"){
			this.onopentagname(name);
			this._closeCurrentTag();
		}
	}
};

Parser$1.prototype.onselfclosingtag = function(){
	if(this._options.xmlMode || this._options.recognizeSelfClosing){
		this._closeCurrentTag();
	} else {
		this.onopentagend();
	}
};

Parser$1.prototype._closeCurrentTag = function(){
	var name = this._tagname;

	this.onopentagend();

	
	
	if(this._stack[this._stack.length - 1] === name){
		if(this._cbs.onclosetag){
			this._cbs.onclosetag(name);
		}
		this._stack.pop();
	}
};

Parser$1.prototype.onattribname = function(name){
	if(this._lowerCaseAttributeNames){
		name = name.toLowerCase();
	}
	this._attribname = name;
};

Parser$1.prototype.onattribdata = function(value){
	this._attribvalue += value;
};

Parser$1.prototype.onattribend = function(){
	if(this._cbs.onattribute) this._cbs.onattribute(this._attribname, this._attribvalue);
	if(
		this._attribs &&
		!Object.prototype.hasOwnProperty.call(this._attribs, this._attribname)
	){
		this._attribs[this._attribname] = this._attribvalue;
	}
	this._attribname = "";
	this._attribvalue = "";
};

Parser$1.prototype._getInstructionName = function(value){
	var idx = value.search(re_nameEnd),
	    name = idx < 0 ? value : value.substr(0, idx);

	if(this._lowerCaseTagNames){
		name = name.toLowerCase();
	}

	return name;
};

Parser$1.prototype.ondeclaration = function(value){
	if(this._cbs.onprocessinginstruction){
		var name = this._getInstructionName(value);
		this._cbs.onprocessinginstruction("!" + name, "!" + value);
	}
};

Parser$1.prototype.onprocessinginstruction = function(value){
	if(this._cbs.onprocessinginstruction){
		var name = this._getInstructionName(value);
		this._cbs.onprocessinginstruction("?" + name, "?" + value);
	}
};

Parser$1.prototype.oncomment = function(value){
	this._updatePosition(4);

	if(this._cbs.oncomment) this._cbs.oncomment(value);
	if(this._cbs.oncommentend) this._cbs.oncommentend();
};

Parser$1.prototype.oncdata = function(value){
	this._updatePosition(1);

	if(this._options.xmlMode || this._options.recognizeCDATA){
		if(this._cbs.oncdatastart) this._cbs.oncdatastart();
		if(this._cbs.ontext) this._cbs.ontext(value);
		if(this._cbs.oncdataend) this._cbs.oncdataend();
	} else {
		this.oncomment("[CDATA[" + value + "]]");
	}
};

Parser$1.prototype.onerror = function(err){
	if(this._cbs.onerror) this._cbs.onerror(err);
};

Parser$1.prototype.onend = function(){
	if(this._cbs.onclosetag){
		for(
			var i = this._stack.length;
			i > 0;
			this._cbs.onclosetag(this._stack[--i])
		);
	}
	if(this._cbs.onend) this._cbs.onend();
};



Parser$1.prototype.reset = function(){
	if(this._cbs.onreset) this._cbs.onreset();
	this._tokenizer.reset();

	this._tagname = "";
	this._attribname = "";
	this._attribs = null;
	this._stack = [];

	if(this._cbs.onparserinit) this._cbs.onparserinit(this);
};


Parser$1.prototype.parseComplete = function(data){
	this.reset();
	this.end(data);
};

Parser$1.prototype.write = function(chunk){
	this._tokenizer.write(chunk);
};

Parser$1.prototype.end = function(chunk){
	this._tokenizer.end(chunk);
};

Parser$1.prototype.pause = function(){
	this._tokenizer.pause();
};

Parser$1.prototype.resume = function(){
	this._tokenizer.resume();
};


Parser$1.prototype.parseChunk = Parser$1.prototype.write;
Parser$1.prototype.done = Parser$1.prototype.end;

var Parser_1 = Parser$1;

Parser_1.prototype.oncdata = function(value){
  this._updatePosition(1);

  if(this._options.xmlMode || this._options.recognizeCDATA){
    if(this._cbs.oncdatastart) this._cbs.oncdatastart(value);
    
    if(this._cbs.oncdataend) this._cbs.oncdataend();
  } else {
    this.oncomment("[CDATA[" + value + "]]");
  }
};

function parseMarkup(markup, options) {
  let format = options.ownerDocument ? options.ownerDocument.format : options.format;
  
  if (!format) {
    throw new Error("Either 'ownerDocument' or 'format' must be set.")
  }
  let parserOptions = Object.assign({}, options, {
    xmlMode : (format === 'xml'),
  });
  let handler = new DomHandler({ format });
  let parser = new Parser_1(handler, parserOptions);
  parser.end(markup);
  return handler.document
}


const re_whitespace = /\s+/g;


class DomHandler {

  constructor(options = {}) {
    this.options = options;
    this.document = null;
    this._tagStack = [];
  }

  
  onparserinit(){
    this.document = new MemoryDOMElement('document', { format: this.options.format });
    this._tagStack = [this.document];
  }

  onend(){
    
    if (this._tagStack.length>1) {
      throw new Error(`Unexpected EOF. Tag was opened but not closed.`)
    }
  }

  onerror(error) {
    throw new Error(error)
  }

  onclosetag() {
    this._tagStack.pop();
  }

  _addDomElement(element) {
    let parent = this._tagStack[this._tagStack.length - 1];
    if (!parent.childNodes) parent.childNodes = [];
    let siblings = parent.childNodes;

    let previousSibling = siblings[siblings.length - 1];
    
    element.next = null;
    if(previousSibling){
      element.prev = previousSibling;
      previousSibling.next = element;
    } else {
      element.prev = null;
    }
    
    siblings.push(element);
    element.parent = parent || null;
  }

  onopentag(name, attributes) {
    let element = this.document.createElement(name);
    forEach(attributes, (val, key) => {
      element.setAttribute(key, val);
    });
    this._addDomElement(element);
    this._tagStack.push(element);
  }

  ontext(text) {
    if (this.options.normalizeWhitespace) {
      text = text.replace(re_whitespace, " ");
    }
    let lastTag;
    let _top = this._tagStack[this._tagStack.length - 1];
    if (_top && _top.childNodes) lastTag = _top.childNodes[_top.childNodes.length - 1];
    if (lastTag && lastTag.type === index.Text) {
      lastTag.data += text;
    } else {
      let element = this.document.createTextNode(text);
      this._addDomElement(element);
    }
  }

  oncomment(data) {
    var lastTag = this._tagStack[this._tagStack.length - 1];
    if(lastTag && lastTag.type === index.Comment){
      lastTag.data += data;
    } else {
      let element = this.document.createComment(data);
      this._addDomElement(element);
      this._tagStack.push(element);
    }
  }

  oncommentend() {
    this._tagStack.pop();
  }

  oncdatastart(data) {
    let element = this.document.createCDATASection(data);
    this._addDomElement(element);
    this._tagStack.push(element);
  }

  oncdataend() {
    this._tagStack.pop();
  }

  onprocessinginstruction(name, data) {
    let element = this.document.createProcessingInstruction(name, data);
    this._addDomElement(element);
  }

}

class MemoryDOMElement extends DOMElement {

  constructor(type, args = {}) {
    super();

    this.type = type;
    if (!type) throw new Error("'type' is mandatory")

    this.ownerDocument = args.ownerDocument;
    
    if (type !== 'document' && !this.ownerDocument) {
      throw new Error("'ownerDocument' is mandatory")
    }

    
    
    

    switch(type) {
      case index.Tag: {
        if (!args.name) throw new Error("'name' is mandatory.")
        this.name = this._normalizeName(args.name);
        this.nameWithoutNS = nameWithoutNS(this.name);
        this.properties = new Map();
        this.attributes = new Map();
        this.classes = new Set();
        this.styles = new Map();
        this.eventListeners = [];
        this.childNodes = args.children || args.childNodes || [];
        this._assign(args);
        break
      }
      case index.Text:
      case index.Comment: {
        this.data = args.data || '';
        break
      }
      case index.CDATA: {
        this.data = args.data || '';
        break
      }
      case index.Directive: {
        if (!args.name) throw new Error("'name' is mandatory.")
        this.name = this._normalizeName(args.name);
        this.nameWithoutNS = nameWithoutNS(this.name);
        this.data = args.data;
        break
      }
      case 'document': {
        let format = args.format;
        this.format = format;
        if (!format) throw new Error("'format' is mandatory.")
        this.childNodes = args.children || args.childNodes || [];
        switch(format) {
          case 'xml':
            this.contentType = 'application/xml';
            break
          case 'html':
            this.contentType = 'text/html';
            break
          default:
            throw new Error('Unsupported format ' + format)
        }
        break
      }
      default:
        this.name = null;
        this.properties = new Map();
        this.attributes = new Map();
        this.classes = new Set();
        this.styles = new Map();
        this.eventListeners = [];
        this.childNodes = args.children || args.childNodes || [];
    }
  }

  getNativeElement() {
    return this
  }

  getNodeType() {
    switch(this.type) {
      case index.Tag:
      case index.Script:
      case index.Style:
        return 'element'
      default:
        return this.type
    }
  }

  isTextNode() {
    return this.type === "text"
  }

  isElementNode() {
    return this.type === "tag" || this.type === "script"
  }

  isCommentNode() {
    return this.type === "comment"
  }

  isDocumentNode() {
    return this.type === "document"
  }

  isComponentNode() {
    return this.type === "component"
  }

  clone(deep) {
    let clone$$1 = new MemoryDOMElement(this.type, this);
    if (this.childNodes) {
      clone$$1.childNodes.length = 0;
      if (deep) {
        this.childNodes.forEach((child) => {
          clone$$1.appendChild(child.clone(deep));
        });
      }
    }
    return clone$$1
  }

  get tagName() {
    return this.getTagName()
  }

  set tagName(tagName) {
    this.setTagName(tagName);
  }

  getTagName() {
    return this.name
  }

  setTagName(tagName) {
    if (this._isXML()) {
      this.name = String(tagName);
    } else {
      this.name = String(tagName).toLowerCase();
    }
    return this
  }

  hasAttribute(name) {
    return this.attributes.has(name)
  }

  getAttribute(name) {
    return this.attributes.get(name)
  }

  setAttribute(name, value) {
    value = String(value);
    
    switch(name) {
      case 'class':
        parseClasses(this.classes, value);
        break
      case 'style':
        parseStyles(this.styles, value);
        break
      default:
        
    }
    this.attributes.set(name, value);
    if (this._isHTML()) {
      deriveHTMLPropertyFromAttribute(this, name, value);
    }
    return this
  }

  removeAttribute(name) {
    switch(name) {
      case 'class':
        this.classes = new Set();
        break
      case 'style':
        this.styles = new Map();
        break
      default:
        
    }
    this.attributes.delete(name);
    return this
  }

  getAttributes() {
    return this.attributes
  }

  getProperty(name) {
    if (this.properties) {
      return this.properties.get(name)
    }
  }

  setProperty(name, value) {
    if (this.properties) {
      if (this._isXML()) {
        throw new Error('setProperty() is only be used on HTML elements')
      }
      _setHTMLPropertyValue(this, name, value);
    }
    return this
  }

  hasClass(name) {
    if (this.classes) {
      return this.classes.has(name)
    }
  }

  addClass(name) {
    this.classes.add(name);
    this.attributes.set('class', stringifyClasses(this.classes));
    return this
  }

  removeClass(name) {
    if (this.classes && this.classes.has(name)) {
      this.classes.delete(name);
      this.attributes.set('class', stringifyClasses(this.classes));
    }
    return this
  }

  getContentType() {
    return this.getOwnerDocument().contentType
  }

  getInnerHTML() {
    return domUtils.getInnerHTML(this, { decodeEntities: true })
  }

  
  
  setInnerHTML(html) {
    if (this.childNodes) {
      let _doc = parseMarkup(html, {
        ownerDocument: this.getOwnerDocument(),
        decodeEntities: true
      });
      this.empty();
      
      
      _doc.childNodes.slice(0).forEach((child) => {
        this.appendChild(child);
      });
    }
    return this
  }

  getOuterHTML() {
    return domUtils.getOuterHTML(this, { xmlMode: this._isXML(), decodeEntities: true })
  }

  getTextContent() {
    return domUtils.getText(this)
  }

  setTextContent(text) {
    switch(this.type) {
      case index.Text:
      case index.Comment:
      case index.CDATA: {
        this.data = text;
        break
      }
      default: {
        if (this.childNodes) {
          let child = this.createTextNode(text);
          this.empty();
          this.appendChild(child);
        }
      }
    }
    return this
  }

  getStyle(name) {
    if (this.styles) {
      return this.styles.get(name)
    }
  }

  setStyle(name, value) {
    if (this.styles) {
      if (DOMElement.pxStyles[name] && isNumber(value)) {
        value = value + "px";
      }
      this.styles.set(name, value);
      this.attributes.set('style', stringifyStyles(this.styles));
    }
    return this
  }

  is(cssSelector) {
    return index$1.is(this, cssSelector, { xmlMode: this._isXML() })
  }

  find(cssSelector) {
    return index$1.selectOne(cssSelector, this, { xmlMode: this._isXML() })
  }

  findAll(cssSelector) {
    return index$1.selectAll(cssSelector, this, { xmlMode: this._isXML() })
  }

  getChildCount() {
    if (this.childNodes) {
      return this.childNodes.length
    } else {
      return 0
    }
  }

  getChildNodes() {
    return this.childNodes.slice(0)
  }

  getChildren() {
    return this.childNodes.filter(function(node) {
      return node.type === "tag"
    })
  }

  get children() {
    return this.getChildren()
  }

  getChildAt(pos) {
    if (this.childNodes) {
      return this.childNodes[pos]
    }
  }

  getChildIndex(child) {
    if (this.childNodes) {
      return this.childNodes.indexOf(child)
    }
  }

  getLastChild() {
    if (this.childNodes) {
      return last$1(this.childNodes)
    }
  }

  getFirstChild() {
    if (this.childNodes) {
      return this.childNodes[0]
    }
  }

  getNextSibling() {
    return this.next
  }

  getPreviousSibling() {
    return this.prev
  }

  getParent() {
    return this.parent
  }

  getOwnerDocument() {
    return (this.type === 'document') ? this : this.ownerDocument
  }

  getFormat() {
    return this.getOwnerDocument().format
  }

  createDocument(format) {
    return MemoryDOMElement.createDocument(format)
  }

  createElement(tagName) {
    return new MemoryDOMElement(index.Tag, { name: tagName, ownerDocument: this.getOwnerDocument() })
  }

  createTextNode(text) {
    return new MemoryDOMElement(index.Text, { data: text, ownerDocument: this.getOwnerDocument() })
  }

  createComment(data) {
    return new MemoryDOMElement(index.Comment, { data: data, ownerDocument: this.getOwnerDocument() })
  }

  createProcessingInstruction(name, data) {
    return new MemoryDOMElement(index.Directive, { name: name, data: data, ownerDocument: this.getOwnerDocument() })
  }

  createCDATASection(data) {
    return new MemoryDOMElement(index.CDATA, { data: data, ownerDocument: this.getOwnerDocument() })
  }

  appendChild(child) {
    if (this.childNodes && !isNil(child)) {
      child = this._normalizeChild(child);
      if (!child) return this
      domUtils.appendChild(this, child);
      child.ownerDocument = this.getOwnerDocument();
    }
    return this
  }

  removeChild(child) {
    if (child.parentNode === this) {
      child.remove();
    }
  }

  insertAt(pos, child) {
    child = this._normalizeChild(child);
    if (!child) return this
    let childNodes = this.childNodes;
    if (childNodes) {
      
      if (pos >= childNodes.length) {
        domUtils.appendChild(this, child);
      } else {
        domUtils.prepend(childNodes[pos], child);
      }
      child.ownerDocument = this.getOwnerDocument();
    }
    return this
  }

  insertBefore(newChild, before) {
    if (isNil(before)) {
      return this.appendChild(newChild)
    } else if (this.childNodes) {
      var pos = this.childNodes.indexOf(before);
      if (pos > -1) {
        domUtils.prepend(before, newChild);
        newChild.ownerDocument = this.getOwnerDocument();
      } else {
        throw new Error('insertBefore(): reference node is not a child of this element.')
      }
    }
    return this
  }

  removeAt(pos) {
    let childNodes = this.childNodes;
    if (childNodes) {
      let child = childNodes[pos];
      child.remove();
    }
    return this
  }

  empty() {
    let childNodes = this.childNodes;
    if (childNodes) {
      childNodes.forEach((child) => {
        child.next = child.prev = child.parent = null;
      });
      childNodes.length = 0;
    }
    return this
  }

  remove() {
    domUtils.removeElement(this);
    return this
  }

  replaceChild(oldChild, newChild) {
    if (oldChild.parent === this) {
      oldChild.replaceWith(newChild);
    }
    return this
  }

  replaceWith(newEl) {
    newEl = this._normalizeChild(newEl);
    domUtils.replaceElement(this, newEl);
    newEl.ownerDocument = this.getOwnerDocument();
    return this
  }

  getEventListeners() {
    return this.eventListeners || []
  }

  click() {
    this.emit('click', { target: this });
    return this
  }

  emit(name, data) {
    this._propagateEvent(new MemoryDOMElementEvent(name, this, data));
  }

  _propagateEvent(event) {
    let listeners = this.eventListeners;
    if (listeners) {
      let listener = listeners.find((l) => {
        return l.eventName === event.type
      });
      if (listener) listener.handler(event);
      if (event.stopped) return
      let p = this.parentNode;
      if (p) p._propagateEvent(event);
    }
  }

  removeAllEventListeners() {
    this.eventListeners = [];
    return this
  }

  _assign(other) {
    if (other.name) this.name = other.name;
    if (this.classes && other.classes) {
      other.classes.forEach((val) => {
        this.classes.add(val);
      });
    }
    if (this.styles && other.styles) {
      forEach(other.styles, (val, name) => {
        this.styles.set(name, val);
      });
    }
    
    
    let otherAttributes = other.attributes || other.attribs;
    if (this.attributes && otherAttributes) {
      forEach(otherAttributes, (val, name) => {
        switch (name) {
          case 'class': {
            parseClasses(this.classes, val);
            break
          }
          case 'style': {
            parseStyles(this.styles, val);
            break
          }
          default:
            this.attributes.set(name, val);
        }
      });
    }
    if (this.eventListeners && other.eventListeners) {
      this.eventListeners = this.eventListeners.concat(other.eventListeners);
    }
  }

  _normalizeChild(child) {
    if (isNil(child)) return

    if (isString$1(child)) {
      child = this.createTextNode(child);
    }
    
    if (!child || !child._isMemoryDOMElement) {
      throw new Error('Illegal argument: only String and MemoryDOMElement instances are valid.')
    }
    return child
  }

  _normalizeName(name) {
    if (this._isXML()) {
      return name
    } else {
      return name.toLowerCase()
    }
  }

  _isHTML() {
    return this.getFormat() === 'html'
  }

  _isXML() {
    return this.getFormat() === 'xml'
  }

}

MemoryDOMElement.prototype._isMemoryDOMElement = true;

MemoryDOMElement.createDocument = function(format) {
  if (format === 'xml') {
    return new MemoryDOMElement('document', { format: format })
  } else {
    return MemoryDOMElement.parseMarkup(DOMElement.EMPTY_HTML, 'html')
  }
};

MemoryDOMElement.parseMarkup = function(str, format, options={}) {
  if (!str) {
    return MemoryDOMElement.createDocument(format)
  }
  if (options.snippet) {
    str = `<__snippet__>${str}</__snippet__>`;
  }
  let doc;
  if (format === 'html') {
    doc = parseMarkup(str, { format: format, decodeEntities: true });
    _sanitizeHTMLStructure(doc);
  } else if (format === 'xml') {
    doc = parseMarkup(str, { format: format, decodeEntities: true });
  }
  if (options.snippet) {
    let childNodes = doc.find('__snippet__').childNodes;
    if (childNodes.length === 1) {
      return childNodes[0]
    } else {
      return childNodes
    }
  } else {
    return doc
  }
};

MemoryDOMElement.wrap =
MemoryDOMElement.wrapNativeElement = function(el) {
  if (inBrowser) {
    
    
    
    
    if (el === window || el === window.document) {
      return new DOMElementStub()
    }
    
    
    
    else if (el instanceof window.Node || el._isBrowserDOMElement) {
      
    }
  }
  
  if (!el._isMemoryDOMElement) {
    throw new Error('Illegal argument: expected MemoryDOMElement instance')
  }
  return el
};

MemoryDOMElement.unwrap = function(el) {
  
  if (!el._isMemoryDOMElement) {
    throw new Error('Illegal argument: expected MemoryDOMElement instance')
  }
  return el
};




MemoryDOMElement.isReverse = function() {
  return false
};


let _browserWindowStub;
MemoryDOMElement.getBrowserWindow = function() {
  
  if (!_browserWindowStub) {
    _browserWindowStub = MemoryDOMElement.createDocument('html');
  }
  return _browserWindowStub
};

function parseClasses(classes, classStr) {
  classStr.split(/\s+/).forEach((name) => {
    classes.add(name);
  });
}

function stringifyClasses(classes) {
  return Array.from(classes).join(' ')
}

function parseStyles(styles, styleStr) {
  styleStr = (styleStr || '').trim();
  if (!styleStr) return
  styleStr.split(';').forEach((style) => {
    let n = style.indexOf(':');
    
    if (n < 1 || n === style.length-1) return
    let name = style.slice(0,n).trim();
    let val = style.slice(n+1).trim();
    styles.set(name, val);
  });
}

function stringifyStyles(styles) {
  if (!styles) return ''
  let str = Object.keys(styles).map((name) => {
    return name + ':' + styles[name]
  }).join(';');
  if (str.length > 0) str += ';';
  return str
}

const BUILTIN_EVENTS = [
  'keydown', 'keyup', 'keypress',
  'mousedown', 'mouseup', 'mouseover', 'click', 'dblclick'
].reduce((m, k)=>{m[k]=true;return m}, {});

class MemoryDOMElementEvent {

  constructor(type, target, detail) {
    this.type = type;
    this.timeStamp = Date.now();
    this.target = target;

    if (BUILTIN_EVENTS[type]) {
      
      if (detail) {
        Object.assign(this, detail);
      }
    } else {
      this.detail = detail;
    }
  }

  stopPropagation() {
    this.stopped = true;
  }

  preventDefault() {
    this.defaultPrevented = true;
  }
}

class DOMElementStub {
  on() {}
  off(){}
}

function nameWithoutNS(name) {
  const idx = name.indexOf(':');
  if (idx > 0) {
    return name.slice(idx+1)
  } else {
    return name
  }
}



const ATTR_TO_PROPS = {
  "input": {
    "value": true,
    "checked": (el, name, value) => {
      const checked = (value !== 'off');
      el.setProperty('checked', checked);
    }
  }
};

function deriveHTMLPropertyFromAttribute(el, name, value) {
  const mappings = ATTR_TO_PROPS[el.tagName];
  if (mappings) {
    let mapper = mappings[name];
    if (mapper === true) {
      el.setProperty(name, value);
    } else if (mapper) {
      mapper(el, name, value);
    }
  }
}

const PROPERTY_TRANSFORMATIONS = {
  "input": {
    "checked": (el, name, value) => {
      if (value === true) {
        el.properties.set(name, true);
        el.properties.set('value', 'on');
      } else {
        el.properties.set(name, false);
        el.properties.set('value', 'off');
      }
    },
    "value": (el, name, value) => {
      let type = el.getAttribute('type');
      switch(type) {
        case 'checkbox':
          if (value === 'on') {
            el.properties.set(name, true);
            el.properties.set('value', 'on');
          } else {
            el.properties.set(name, false);
            el.properties.set('value', 'off');
          }
          break
        default:
          _setProperty(el, name, value);
      }
    }
  }
};

function _setProperty(el, name, value) {
  if (value === undefined) {
    el.properties.delete(name);
  } else {
    el.properties.set(name, String(value));
  }
}

function _setHTMLPropertyValue(el, name, value) {
  const trafos = PROPERTY_TRANSFORMATIONS[el.tagName];
  if (trafos) {
    let mapper = trafos[name];
    if (mapper) {
      mapper(el, name, value);
      return
    }
  }
  _setProperty(el, name, value);
}

function _sanitizeHTMLStructure(doc) {
  
  
  
  
  let htmlEl = doc.find('html');
  if (!htmlEl) {
    
    
    let headEl = doc.find('head');
    let titleEl = doc.find('title');
    let metaEls = doc.findAll('meta');
    let bodyEl = doc.find('body');
    if (headEl) headEl.remove();
    if (titleEl) titleEl.remove();
    metaEls.forEach(e => e.remove());
    if (bodyEl) bodyEl.remove();

    
    
    let contentNodes = doc.childNodes.slice();
    contentNodes.forEach((c)=>{c.parent = null;});
    doc.childNodes.length = 0;

    htmlEl = doc.createElement('html');
    
    
    
    if (!headEl) {
      headEl = doc.createElement('head');
      headEl.appendChild(titleEl);
      headEl.append(metaEls);
      htmlEl.appendChild(headEl);
    }
    if (!bodyEl) {
      bodyEl = doc.createElement('body');
      bodyEl.append(contentNodes);
    }
    htmlEl.appendChild(bodyEl);

    doc.append(htmlEl);
  }
}

let DefaultDOMElement = {};

DefaultDOMElement.createDocument = function(format) {
  return _getDefaultImpl().createDocument(format)
};


DefaultDOMElement.createElement = function(tagName) {
  console.error("DEPRECATED: every element should have an ownerDocument. Use DefaultDOMElement.createDocument() to create a document first");
  let doc = DefaultDOMElement.createDocument('html');
  return doc.createElement(tagName)
};


DefaultDOMElement.createTextNode = function(text) {
  console.error("DEPRECATED: every element should have a ownerDocument. Use DefaultDOMElement.createDocument() to create a document first");
  let doc = DefaultDOMElement.createDocument('html');
  return doc.createTextNode(text)
};


DefaultDOMElement.getBrowserWindow = function() {
  return _getDefaultImpl().getBrowserWindow()
};


DefaultDOMElement.parseHTML = function(html, options) {
  return _getDefaultImpl().parseMarkup(html, 'html', options)
};


DefaultDOMElement.parseXML = function(xml, options) {
  return _getDefaultImpl().parseMarkup(xml, 'xml', options)
};

DefaultDOMElement.parseSnippet = function(str, format) {
  return _getDefaultImpl().parseMarkup(str, format, {snippet: true})
};

DefaultDOMElement.wrap =
DefaultDOMElement.wrapNativeElement = function(nativeEl) {
  if (!nativeEl) throw new Error('Illegal argument')
  return _getDefaultImpl().wrap(nativeEl)
};

DefaultDOMElement.unwrap = function(nativeEl) {
  if (!nativeEl) throw new Error('Illegal argument')
  return _getDefaultImpl().unwrap(nativeEl)
};



DefaultDOMElement.isReverse = function(anchorNode, anchorOffset, focusNode, focusOffset) {
  return _getDefaultImpl().isReverse(anchorNode, anchorOffset, focusNode, focusOffset)
};

function _getDefaultImpl() {
  
  if (platform.inBrowser || platform.inElectron) {
    return BrowserDOMElement
  } else {
    return MemoryDOMElement
  }
}

class HTMLExporter extends DOMExporter {

  constructor(config, context) {
    super(_defaultConfig(config), context);
  }

  exportDocument(doc) {
    let htmlEl = DefaultDOMElement.parseHTML('<html><head></head><body></body></html>');
    return this.convertDocument(doc, htmlEl)
  }

  getDefaultBlockConverter() {
    return defaultBlockConverter 
  }

  getDefaultPropertyAnnotationConverter() {
    return defaultAnnotationConverter 
  }

}

function _defaultConfig(config) {
  config = Object.assign({
    idAttribute: 'data-id'
  }, config);
  if (!config.elementFactory) {
    config.elementFactory = DefaultDOMElement.createDocument('html');
  }
  return config
}


const defaultAnnotationConverter = {
  tagName: 'span',
  export: function(node, el) {
    el.tagName = 'span';
    el.attr('data-type', node.type);
    var properties = node.toJSON();
    forEach(properties, function(value, name) {
      if (name === 'id' || name === 'type') return
      if (isString$1(value) || isNumber(value) || isBoolean(value)) {
        el.attr('data-'+name, value);
      }
    });
  }
};

const defaultBlockConverter = {
  export: function(node, el, converter) {
    el.attr('data-type', node.type);
    var properties = node.toJSON();
    forEach(properties, function(value, name) {
      if (name === 'id' || name === 'type') {
        return
      }
      var prop = converter.$$('div').attr('property', name);
      if (node.getPropertyType(name) === 'string' && value) {
        prop.append(converter.annotatedText([node.id, name]));
      } else {
        prop.text(value);
      }
      el.append(prop);
    });
  }
};

class HTMLImporter extends DOMImporter {

  constructor(config) {
    super(Object.assign({ idAttribute: 'data-id' }, config));

    
    this._el = DefaultDOMElement.parseHTML('<html></html>');
  }

  importDocument(html) {
    this.reset();
    var parsed = DefaultDOMElement.parseHTML(html);
    this.convertDocument(parsed);
    return this.state.doc
  }

  
  convertDocument(documentEl) { 
    throw new Error('This method is abstract')
  }

}

class InlineNode extends PropertyAnnotation {}

InlineNode.prototype._isInlineNode = true;

InlineNode.isInline = true;

class Marker extends PropertyAnnotation {

  _initialize(doc, props) {
    this.document = doc;
    this.type = props.type;
    if (!props.type) {
      throw new Error("'type' is mandatory")
    }
    if (!props.start) {
      throw new Error("'start' is mandatory")
    }
    if (!props.end) {
      throw new Error("'end' is mandatory")
    }
    Object.assign(this, props);
  }

  
  containsSelection(sel) {
    if (sel.isNull()) return false;
    if (sel.isPropertySelection()) {
      return (isArrayEqual(this.start.path, sel.start.path) &&
        this.start.offset <= sel.start.offset &&
        this.end.offset >= sel.end.offset)
    } else {
      console.warn('Marker.contains() does not support other selection types.');
    }
  }

  get type() {
    return this._type
  }

  set type(type) {
    this._type = type;
  }

}


Marker.prototype._isPropertyAnnotation = false;
Marker.prototype._isMarker = true;

class Range {

  constructor(start, end, reverse, containerId, surfaceId) {
    
    if (arguments[0] === 'SKIP') return
    if (arguments.length === 1 && isPlainObject$1(arguments[0])) {
      let data = arguments[0];
      this.start = data.start;
      this.end = data.end;
      this.reverse = Boolean(data.reverse);
      this.containerId = data.containerId;
      this.surfaceId = data.surfaceId;
    } else {
      this.start = start;
      this.end = end;
      this.reverse = Boolean(reverse);
      this.containerId = containerId;
      this.surfaceId = surfaceId;
    }
  }

  isCollapsed() {
    return this.start.equals(this.end)
  }

  equals(other) {
    if (this === other) return true
    else {
      return (
        this.containerId === other.containerId &&
        this.start.equals(other.start) &&
        this.end.equals(other.end)
      )
    }
  }

  isReverse() {
    return this.reverse
  }

  toString() {
    let str = [this.start.toString(), '->', this.end.toString()];
    if (this.isReverse()) {
      str.push('[reverse]');
    }
    if (this.containerId) {
      str.push('[container='+this.containerId+']');
    }
    if (this.surfaceId) {
      str.push('[surface='+this.surfaceId+']');
    }
    return str.join('')
  }

}

Range.prototype._isRange = true;

class SelectionState {

  constructor(doc) {
    this.document = doc;

    this.selection = Selection.nullSelection;
    this._state = {};
    this._resetState();
  }

  setSelection(sel) {
    
    if (!sel) {
      sel = Selection.nullSelection;
    } else {
      sel.attach(this.document);
    }
    
    
    this._deriveState(sel);
    this.selection = sel;
    return true
  }

  getSelection() {
    return this.selection
  }

  getAnnotationsForType(type) {
    const state = this._state;
    if (state.annosByType) {
      return state.annosByType.get(type) || []
    }
    return []
  }

  getMarkers() {
    
    return this._state.markers || []
  }

  isInlineNodeSelection() {
    return this._state.isInlineNodeSelection
  }

  getContainer() {
    return this._state.container
  }

  getPreviousNode() {
    return this._state.previousNode
  }

  getNextNode() {
    return this._state.nextNode
  }

  
  isFirst() {
    return Boolean(this._state.isFirst)
  }

  
  isLast() {
    return Boolean(this._state.isLast)
  }

  get(key) {
    return this._state[key]
  }

  
  set(key, value) {
    if (this._state[key]) {
      throw new Error(`State ${key} is already set`)
    }
    this._state[key] = value;
  }

  _deriveState(sel) {
    this._resetState();
    this._deriveContainerSelectionState(sel);
    this._deriveAnnoState(sel);
    if (this.document.getIndex('markers')) {
      this._deriveMarkerState(sel);
    }
    
  }

  _deriveContainerSelectionState(sel) {
    let state = this._state;
    let doc = this.document;
    if (sel.containerId) {
      let container = doc.get(sel.containerId);
      state.container = container;
      let startId = sel.start.getNodeId();
      let endId = sel.end.getNodeId();
      let startNode = doc.get(startId).getContainerRoot();
      let startPos = container.getPosition(startNode);
      if (startPos > 0) {
        state.previousNode = container.getNodeAt(startPos-1);
      }
      state.isFirst = isFirst(doc, sel.start);
      let endNode, endPos;
      if (endId === startId) {
        endNode = startNode;
        endPos = startPos;
      } else {
        endNode = doc.get(endId).getContainerRoot();
        endPos = container.getPosition(endNode);
      }
      if (endPos < container.getLength()-1) {
        state.nextNode = container.getNodeAt(endPos+1);
      }
      state.isLast = isLast(doc, sel.end);
    }
  }

  _deriveAnnoState(sel) {
    const doc = this.document;
    const state = this._state;

    
    let annosByType = new TreeIndex.Arrays();
    const propAnnos = documentHelpers.getPropertyAnnotationsForSelection(doc, sel);
    propAnnos.forEach(function(anno) {
      annosByType.add(anno.type, anno);
    });

    if (propAnnos.length === 1 && propAnnos[0].isInline()) {
      state.isInlineNodeSelection = propAnnos[0].getSelection().equals(sel);
    }

    const containerId = sel.containerId;
    if (containerId) {
      const containerAnnos = documentHelpers.getContainerAnnotationsForSelection(doc, sel, containerId);
      containerAnnos.forEach(function(anno) {
        annosByType.add(anno.type, anno);
      });
    }
    state.annosByType = annosByType;
  }

  _deriveMarkerState(sel) {
    const doc = this.document;
    let state = this._state;
    let markers = documentHelpers.getMarkersForSelection(doc, sel);
    state.markers = markers;
  }

  _resetState() {
    this._state = {
      
      annosByType: null,
      
      markers: null,
      
      isInlineNodeSelection: false,
      
      container: null,
      previousNode: null,
      nextNode: null,
      
      isFirst: false,
      
      isLast: false
    };
    return this._state
  }
}

var TextNodeMixin = function(SuperClass) {
  class TextNodeMixin extends SuperClass {
    getTextPath() {
      
      
      return this.getPath()
    }

    getText() {
      return this.content
    }

    isEmpty() {
      return !this.getText()
    }

    getLength() {
      return this.getText().length
    }

    getAnnotations() {
      return this.getDocument().getIndex('annotations').get(this.getPath())
    }
  }
  return TextNodeMixin
};

class TextNode extends TextNodeMixin(DocumentNode) {

  getPath() {
    return [this.id, 'content']
  }

  getText() {
    return this.content
  }

}

TextNode.isText = true;

TextNode.schema = {
  type: "text",
  content: "text",
  direction: { type: "string", optional: true },
  textAlign: { type: "string", default: 'left' }
};

class TextBlock extends TextNode {}

TextBlock.isBlock = true;

class Transaction {

  
  constructor(master) {
    
    this.master = master;
    this.stage = master.newInstance().createFromDocument(master);
    
    this.stage._isTransactionDocument = true;

    this.tx = this.stage.createEditingInterface();
    
    this._isTransacting = false;
    this._surface = null;

    
    
    master._ops.length = 0;
  }

  dispose() {
    this.stage.dispose();
  }

  

  get ops() {
    return this.stage._ops
  }

  set ops(ops) {
    this.stage._ops = ops;
  }

  getSelection() {
    return this.tx.getSelection()
  }

  setSelection(sel) {
    this.tx.setSelection(sel);
  }

  _reset() {
    this._before = {};
    this._after = {};
    this.stage._ops.length = 0;
    this._info = {};
    this.setSelection(null);
  }

  
  _recordChange(transformation, selection) {
    if (this._isTransacting) throw new Error('Nested transactions are not supported.')
    if (!isFunction$1(transformation)) throw new Error('Document.transaction() requires a transformation function.')
    let hasFinished = false;
    this._isTransacting = true;
    this._reset();
    let change;
    try {
      const tx = this.tx;
      tx.setSelection(selection);
      let selBefore = tx.getSelection();
      transformation(tx, {
        selection: selBefore
      });
      let ops = this.ops;
      if (ops.length > 0) {
        change = new DocumentChange(ops, tx._before, tx._after);
        change.before = { selection: selBefore };
        change.after = { selection: tx.getSelection() };
      }
      hasFinished = true;
    } finally {
      if (!hasFinished) {
        this._rollback();
      }
      this._isTransacting = false;
    }
    return change
  }

  _sync() {
    const master = this.master;
    const stage = this.stage;
    let ops = master._ops;
    for (let i = 0; i < ops.length; i++) {
      stage._applyOp(ops[i]);
    }
    ops.length = 0;
  }

  
  __applyChange__(change) {
    const stage = this.stage;
    const ops = change.ops;
    for (let i = 0; i < ops.length; i++) {
      stage._applyOp(ops[i]);
    }
  }

  _rollback() {
    const stage = this.stage;
    let ops = stage._ops;
    for (let i = ops.length - 1; i >= 0; i--) {
      stage._applyOp(ops[i].invert());
    }
    ops.length = 0;
  }

}

class XMLExporter extends DOMExporter {

  constructor(config, context) {
    super(_defaultConfig$1(config), context);
  }

  getDefaultBlockConverter() {
    return defaultBlockConverter$1 
  }

  getDefaultPropertyAnnotationConverter() {
    return defaultAnnotationConverter$1 
  }

}

function _defaultConfig$1(config) {
  config = Object.assign({
    idAttribute: 'id'
  }, config);
  if (!config.elementFactory) {
    config.elementFactory = DefaultDOMElement.createDocument('xml');
  }
  return config
}

const defaultAnnotationConverter$1 = {
  tagName: 'annotation',
  export: function(node, el) {
    el.attr('type', node.type);
    const properties = node.toJSON();
    forEach(properties, function(value, name) {
      if (name === 'id' || name === 'type') return
      if (isString$1(value) || isNumber(value) || isBoolean(value)) {
        el.attr(name, value);
      }
    });
  }
};

const defaultBlockConverter$1 = {
  tagName: 'block',
  export: function(node, el, converter) {
    el.attr('type', node.type);
    const properties = node.toJSON();
    forEach(properties, function(value, name) {
      if (name === 'id' || name === 'type') {
        return
      }
      const prop = converter.$$(name);
      if (node.getPropertyType(name) === 'string') {
        prop.append(converter.annotatedText([node.id, name]));
      } else {
        prop.text(value);
      }
      el.append(prop);
    });
  }
};

class XMLImporter extends DOMImporter {

  constructor(config, context) {
    super(Object.assign({ idAttribute: 'id' }, config), context);
  }

  importDocument(xml) {
    this.reset();
    let dom = DefaultDOMElement.parseXML(xml);
    this.convertDocument(dom);
    return this.state.doc
  }

}

class CollabEngine extends EventEmitter {

  constructor(documentEngine) {
    super();
    this.documentEngine = documentEngine;
    
    this._collaborators = {};
  }

  
  _register(collaboratorId, documentId, collaboratorInfo) {
    let collaborator = this._collaborators[collaboratorId];

    if (!collaborator) {
      collaborator = this._collaborators[collaboratorId] = {
        collaboratorId: collaboratorId,
        documents: {}
      };
    }

    
    collaborator.info = collaboratorInfo;

    
    collaborator.documents[documentId] = {};
  }

  
  _unregister(collaboratorId, documentId) {
    let collaborator = this._collaborators[collaboratorId];
    delete collaborator.documents[documentId];
    let docCount = Object.keys(collaborator.documents).length;
    
    if (docCount === 0) {
      delete this._collaborators[collaboratorId];
    }
  }

  
  getDocumentIds(collaboratorId) {
    let collaborator = this._collaborators[collaboratorId];
    if (!collaborator) {
      
      
      return []
    }
    return Object.keys(collaborator.documents)
  }

  
  getCollaborators(documentId, collaboratorId) {
    let collaborators = {};
    forEach(this._collaborators, function(collab) {
      let doc = collab.documents[documentId];
      if (doc && collab.collaboratorId !== collaboratorId) {
        let entry = {
          
          collaboratorId: collab.collaboratorId
        };
        entry = Object.assign({}, collab.info, entry);
        collaborators[collab.collaboratorId] = entry;
      }
    });
    return collaborators
  }

  
  getCollaboratorIds(documentId, collaboratorId) {
    let collaborators = this.getCollaborators(documentId, collaboratorId);
    return map(collaborators, function(c) {
      return c.collaboratorId
    })
  }

  
  sync({documentId, version, change, collaboratorId}, cb) {
    this._sync({documentId, version, change}, function(err, result) {
      if (err) return cb(err)
      
      this._register(collaboratorId, documentId);
      cb(null, result);
    }.bind(this));
  }

  
  _sync({documentId, version, change}, cb) {
    this.documentEngine.getVersion(documentId, (err, serverVersion) => {
      if (version > serverVersion) {
        cb(new SubstanceError('InvalidVersionError', {
          message: 'Client version greater than server version'
        }));
      } else if (change && serverVersion === version) {
        this._syncFF({documentId, version, change}, cb);
      } else if (change && serverVersion > version) {
        this._syncRB({documentId, version, change}, cb);
      } else if (!change) {
        
        this._syncPullOnly({documentId, version, change}, cb);
      } else {
        console.warn('Unhandled case');
      }
    });
  }

  _syncPullOnly({documentId, version, change}, cb) {
    console.warn('This code is not yet tested');
    this.documentEngine.getChanges(documentId, version, (err, changes) => {
      let serverChange;

      
      if (changes.length > 0) {
        let ops = [];
        changes.forEach((change) => {
          ops = ops.concat(change.ops);
        });
        serverChange = new DocumentChange(ops, {}, {});
        serverChange = this.serializeChange(serverChange);
      }
      cb(null, {
        serverChange: serverChange,
        change: change,
        version: version
      });
    });
  }

  
  _syncFF({documentId, change}, cb) {
    this.documentEngine.addChange(documentId, change, (err, serverVersion) => {
      if (err) return cb(err)
      cb(null, {
        change: change, 
        serverChange: null,
        version: serverVersion
      });
    });
  }

  
  _syncRB({documentId, change, version}, cb) {
    this._rebaseChange({documentId, change, version}, function(err, rebased) {
      
      if (err) return cb(err)
      
      this.documentEngine.addChange(
        documentId,
        change,
        function(err, serverVersion) {
          if (err) return cb(err)
          cb(null, {
            change: rebased.change,
            
            serverChange: rebased.serverChange,
            version: serverVersion
          });
        }
      );
    }.bind(this));
  }

  
  _rebaseChange({documentId, change, version}, cb) {
    this.documentEngine.getChanges(documentId, version, function(err, result, serverVersion) {
      
      let B = result.map(this.deserializeChange);
      let a = this.deserializeChange(change);
      
      transformDocumentChange(a, B);
      let ops = B.reduce(function(ops, change) {
        return ops.concat(change.ops)
      }, []);
      let serverChange = new DocumentChange(ops, {}, {});

      cb(null, {
        change: this.serializeChange(a),
        serverChange: this.serializeChange(serverChange),
        version: serverVersion
      });
    }.bind(this));
  }

  
  disconnect(args) {
    this._unregister(args.collaboratorId, args.documentId);
  }

  
  serializeChange(change) {
    return change.toJSON()
  }

  
  deserializeChange(serializedChange) {
    let ch = DocumentChange.fromJSON(serializedChange);
    return ch
  }

}

class CollabServer extends Server {
  constructor(config) {
    super(config);

    this.scope = 'substance/collab';
    this.configurator = config.configurator;
    this.documentEngine = this.configurator.getDocumentEngine();
    this.collabEngine = new CollabEngine(this.documentEngine);
  }

  
  _error(req, res, err) {
    console.error(err);
    res.error({
      scope: this.scope,
      type: 'error',
      error: {
        name: req.message.type+'Error',
        cause: {
          name: err.name
        }
      },
      documentId: req.message.documentId
    });
    this.next(req, res);
  }

  
  authenticate(req, res) {
    if (this.config.authenticate) {
      this.config.authenticate(req, (err, session) => {
        if (err) {
          console.error(err);
          
          this._error(req, res, new SubstanceError('AuthenticationError', {cause: err}));
          return
        }
        req.setAuthenticated(session);
        this.next(req, res);
      });
    } else {
      super.authenticate.apply(this, arguments);
    }
  }

  
  enhanceRequest(req, res) {
    if (this.config.enhanceRequest) {
      this.config.enhanceRequest(req, (err) => {
        if (err) {
          console.error('enhanceRequest returned an error', err);
          this._error(req, res, err);
          return
        }
        req.setEnhanced();
        this.next(req, res);
      });
    } else {
      super.enhanceRequest.apply(this, arguments);
    }
  }

  
  onDisconnect(collaboratorId) {
    
    
    let documentIds = this.collabEngine.getDocumentIds(collaboratorId);
    documentIds.forEach(function(documentId) {
      this._disconnectDocument(collaboratorId, documentId);
    }.bind(this));
  }

  
  execute(req, res) {
    let msg = req.message;
    let method = this[msg.type];

    if (method) {
      method.call(this, req, res);
    } else {
      console.error('Method', msg.type, 'not implemented for CollabServer');
    }
  }

  
  sync(req, res) {
    let args = req.message;

    
    this.collabEngine.sync(args, (err, result) => {
      
      if (err) {
        this._error(req, res, err);
        return
      }

      
      let collaborators = this.collabEngine.getCollaborators(args.documentId, args.collaboratorId);

      
      res.send({
        scope: this.scope,
        type: 'syncDone',
        documentId: args.documentId,
        version: result.version,
        serverChange: result.serverChange,
      });

      
      forEach(collaborators, (collaborator) => {
        this.send(collaborator.collaboratorId, {
          scope: this.scope,
          type: 'update',
          documentId: args.documentId,
          version: result.version,
          change: result.change
        });
      });
      this.next(req, res);
    });
  }

  
  disconnect(req, res) {
    let args = req.message;
    let collaboratorId = args.collaboratorId;
    let documentId = args.documentId;
    this._disconnectDocument(collaboratorId, documentId);
    
    res.send({
      scope: this.scope,
      type: 'disconnectDone',
      documentId: args.documentId
    });
    this.next(req, res);
  }

  _disconnectDocument(collaboratorId, documentId) {
    
    this.collabEngine.disconnect({
      documentId: documentId,
      collaboratorId: collaboratorId
    });
  }

}

class DocumentClient {
  constructor(config) {
    this.config = config;
  }

  
  createDocument(newDocument, cb) {
    request('POST', this.config.httpUrl, newDocument, cb);
  }

  

  getDocument(documentId, cb) {
    request('GET', this.config.httpUrl+documentId, null, cb);
  }

  

  deleteDocument(documentId, cb) {
    request('DELETE', this.config.httpUrl+documentId, null, cb);
  }

}

class ClientConnection extends EventEmitter {
  constructor(config) {
    super();

    this.config = config;
    this._onMessage = this._onMessage.bind(this);
    this._onConnectionOpen = this._onConnectionOpen.bind(this);
    this._onConnectionClose = this._onConnectionClose.bind(this);

    
    this._connect();
  }

  _createWebSocket() {
    throw SubstanceError('AbstractMethodError')
  }

  
  _connect() {
    this.ws = this._createWebSocket();
    this.ws.addEventListener('open', this._onConnectionOpen);
    this.ws.addEventListener('close', this._onConnectionClose);
    this.ws.addEventListener('message', this._onMessage);
  }

  
  _disconnect() {
    this.ws.removeEventListener('message', this._onMessage);
    this.ws.removeEventListener('open', this._onConnectionOpen);
    this.ws.removeEventListener('close', this._onConnectionClose);
    this.ws = null;
  }

  
  _onConnectionOpen() {
    this.emit('open');
  }

  
  _onConnectionClose() {
    this._disconnect();
    this.emit('close');
    console.info('websocket connection closed. Attempting to reconnect in 5s.');
    setTimeout(function() {
      this._connect();
    }.bind(this), 5000);
  }

  
  _onMessage(msg) {
    msg = this.deserializeMessage(msg.data);
    this.emit('message', msg);
  }

  
  send(msg) {
    if (!this.isOpen()) {
      console.warn('Message could not be sent. Connection is not open.', msg);
      return
    }
    this.ws.send(this.serializeMessage(msg));
  }

  
  isOpen() {
    return this.ws && this.ws.readyState === 1
  }

  serializeMessage(msg) {
    return JSON.stringify(msg)
  }

  deserializeMessage(msg) {
    return JSON.parse(msg)
  }

}

class WebSocketConnection extends ClientConnection {
  _createWebSocket() {
    return new window.WebSocket(this.config.wsUrl);
  }
}

function computeSnapshot(jsonDoc, changeset) {
  
  jsonDoc = cloneDeep(jsonDoc);
  let nodes = jsonDoc.nodes;
  changeset.forEach((change) => {
    change.ops.forEach((opData) => {
      try {
        let op = ObjectOperation.fromJSON(opData);
        op.apply(nodes);
      } catch (err) {
        console.error(err, opData);
      }
    });
  });
  return jsonDoc
}

const EMPTY_DOC = { nodes: {} };


class SnapshotEngine {
  constructor(config) {
    this.changeStore = config.changeStore;
    this.snapshotStore = config.snapshotStore;
  }

  
  getSnapshot(documentId, version, cb) {
    let jsonDoc = EMPTY_DOC;
    this._getClosestSnapshot(documentId, version, (err, snapshot, closestVersion) => {
      if (err) {
        return cb(err)
      }
      if (snapshot && version === closestVersion) {
        
        return cb(null, snapshot, version)
      }
      let knownVersion;
      if (snapshot) {
        knownVersion = closestVersion;
      } else {
        knownVersion = 0; 
      }
      if (snapshot) {
        jsonDoc = snapshot;
      }
      
      this.changeStore.getChanges(documentId, knownVersion, version, (err, changes) => {
        if (err) return cb(err)
        if (changes.length < (version - knownVersion)) {
          return cb('Changes missing for reconstructing version '+ version)
        }
        jsonDoc = computeSnapshot(jsonDoc, changes);
        cb(null, jsonDoc, version);
      });
    });
  }

  
  createSnapshot(documentId, version, cb) {
    this.getSnapshot(documentId, version, (err, snapshot) => {
      if (err) return cb(err)
      this.snapshotStore.saveSnapshot(documentId, version, snapshot, cb);
    });
  }

  _getClosestSnapshot(documentId, version, cb) {
    let closestVersion;

    this.snapshotStore.getVersions(documentId, (err, versions) => {
      if (versions.indexOf(version) >= 0) {
        closestVersion = version;
      } else {
        
        let smallerVersions = versions.filter(function(v) {
          return parseInt(v, 10) < version
        });
        
        closestVersion = Math.max.apply(null, smallerVersions);
      }
      if (!closestVersion) {
        return cb(null, undefined)
      }
      this.snapshotStore.getSnapshot(documentId, version, cb);
    });
  }
}

class DocumentEngine extends EventEmitter {
  constructor(config) {
    super();
    this.changeStore = config.changeStore;
    this.snapshotStore = config.snapshotStore;
    
    
    this.snapshotFrequency = config.snapshotFrequency || 1;
    this.snapshotEngine = new SnapshotEngine({
      changeStore: this.changeStore,
      snapshotStore: this.snapshotStore
    });
  }

  
  createDocument(documentId, initialChange, cb) {
    this.addChange(documentId, initialChange, cb);
  }

  
  getDocument(documentId, version, cb) {
    if (typeof version === 'function') {
      cb = version;
      version = undefined;
    }
    if (!documentId) {
      throw new Error('Invalid Arguments')
    }
    if (version === undefined) {
      this.getVersion(documentId, (err, version) => {
        if (err) return cb(err)
        this.snapshotEngine.getSnapshot(documentId, version, cb);
      });
    } else {
      this.snapshotEngine.getSnapshot(documentId, version, cb);
    }
  }

  
  deleteDocument(documentId, cb) {
    this.changeStore.deleteChanges(documentId, (err) => {
      if (err) {
        return cb(new Error('Deleting changes failed'))
      }
    });
  }

  
  documentExists(documentId, cb) {
    this.getVersion(documentId, (err, version) => {
      if (version >= 0) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    });
  }

  
  getChanges(documentId, sinceVersion, toVersion, cb) {
    this.changeStore.getChanges(documentId, sinceVersion, toVersion, cb);
  }

  
  getVersion(documentId, cb) {
    this.changeStore.getVersion(documentId, cb);
  }

  
  requestSnapshot(documentId, version, cb) {
    if (version % this.snapshotFrequency === 0) {
      this.snapshotEngine.createSnapshot(documentId, version, cb);
    } else {
      cb(null); 
    }
  }

  
  addChange(documentId, change, cb) {
    this.changeStore.addChange(documentId, change, (err, newVersion) => {
      if (err) return cb(err)

      this.requestSnapshot(documentId, newVersion, () => {
        
        cb(null, newVersion);
      });
    });
  }
}

class CollabServerConfigurator {
  constructor() {
    this.config = {
      heartbeat: 30*1000,
      documentStore: undefined,
      changeStore: undefined,
      snapshotStore: undefined
    };
  }

  setHost(host) {
    this.config.host = host;
  }

  setPort(port) {
    this.config.port = port;
  }

  
  

  setDocumentStore(documentStore) {
    this.config.documentStore = documentStore;
  }

  setChangeStore(changeStore) {
    this.config.changeStore = changeStore;
  }

  setSnapshotStore(snapshotStore) {
    this.config.snapshotStore = snapshotStore;
  }

  
  

  getHost() {
    return this.config.host
  }

  getPort() {
    return this.config.port
  }

  getDocumentStore() {
    return this.config.documentStore
  }

  getChangeStore() {
    return this.config.changeStore
  }

  getSnapshotStore() {
    return this.config.snapshotStore
  }

  
  getDocumentEngine() {
    if (!this.documentEngine) {
      this.documentEngine = new DocumentEngine({
        documentStore: this.config.documentStore,
        changeStore: this.config.changeStore,
        snapshotStore: this.config.snapshotStore
      });
    }
    return this.documentEngine
  }

  
  import(pkg, options) {
    pkg.configure(this, options || {});
    return this
  }

}

class CollabClient extends EventEmitter {
  constructor(config) {
    super();

    this.config = config;
    this.connection = config.connection;

    
    this.scope = 'substance/collab';

    
    this._onMessage = this._onMessage.bind(this);
    this._onConnectionOpen = this._onConnectionOpen.bind(this);
    this._onConnectionClose = this._onConnectionClose.bind(this);

    
    this.connection.on('open', this._onConnectionOpen);
    this.connection.on('close', this._onConnectionClose);
    this.connection.on('message', this._onMessage);
  }

  _onConnectionClose() {
    this.emit('disconnected');
  }

  _onConnectionOpen() {
    this.emit('connected');
  }

  
  _onMessage(msg) {
    if (msg.scope === this.scope) {
      this.emit('message', msg);
    } else if (msg.scope !== '_internal') {
      console.info('Message ignored. Not sent in hub scope', msg);
    }
  }

  
  send(msg) {
    if (!this.connection.isOpen()) {
      console.warn('Message could not be sent. Connection not open.', msg);
      return
    }

    msg.scope = this.scope;
    if (this.config.enhanceMessage) {
      msg = this.config.enhanceMessage(msg);
    }
    this.connection.send(msg);
  }

  
  isConnected() {
    return this.connection.isOpen()
  }

  dispose() {
    this.connection.off(this);
  }
}

class SnapshotStore {
  constructor(seed) {
    this._snapshots = seed || {};
  }

  
  getVersions(documentId, cb) {
    let versions = this._getVersions(documentId);
    cb(null, versions);
  }

  
  getSnapshot(documentId, version, cb) {
    if (!arguments.length === 3) {
      throw new Error('Invalid Arguments')
    }
    let docEntry = this._snapshots[documentId];
    if (!docEntry) return cb(null, undefined)
    let snapshot = docEntry[version];
    if (snapshot) {
      cb(null, snapshot, version);
    } else {
      cb(null, undefined);
    }
  }

  
  saveSnapshot(documentId, version, data, cb) {
    if (!documentId || !version || !data) {
      throw new Error('Invalid arguments')
    }
    let docEntry = this._snapshots[documentId];
    if (!docEntry) {
      docEntry = this._snapshots[documentId] = {};
    }
    docEntry[version] = data;
    cb(null, docEntry[version]);
  }

  
  deleteSnapshot(documentId, version, cb) {
    let docEntry = this._snapshots[documentId];
    if (!docEntry || !docEntry[version]) {
      return cb(new Error('Snapshot does not exist and can not be deleted'))
    }
    let snapshot = this._snapshots[documentId][version];
    delete this._snapshots[documentId][version];
    cb(null, snapshot);
  }

  
  _getVersions(documentId) {
    let docEntry = this._snapshots[documentId];
    if (!docEntry) return [] 
    return Object.keys(docEntry)
  }

}

var CollabServerPackage = {
  name: 'collab-server',
  configure: function (config) {
    config.setChangeStore(new ChangeStore());
    config.setSnapshotStore(new SnapshotStore());
  }
};

class DocumentServer {

  constructor(params) {
    this.configurator = params.configurator;
    this.engine = this.configurator.getDocumentEngine();
    
    this.path = '/api/documents';
  }

  
  bind(app) {
    app.post(this.path, this._createDocument.bind(this));
    app.get(this.path + '/:id', this._getDocument.bind(this));
    app.delete(this.path + '/:id', this._deleteDocument.bind(this));
  }

  
  _createDocument(req, res, next) {
    const { documentId, change } = req.body;
    this.engine.createDocument(documentId, change, function(err, version) {
      if (err) return next(err)
      res.json(version);
    });
  }

  
  _getDocument(req, res, next) {
    const documentId = req.params.id;
    this.engine.getDocument(documentId, function(err, jsonDoc, version) {
      if (err) return next(err)
      res.json({
        data: jsonDoc,
        version: version
      });
    });
  }

  
  _deleteDocument(req, res, next) {
    let documentId = req.params.id;
    this.engine.deleteDocument(documentId, function(err, result) {
      if (err) return next(err)
      res.json(result);
    });
  }
}

class VirtualElement extends DOMElement {

  constructor(owner) {
    super();

    
    this.parent = null;
    
    this._owner = owner;
    
    this._ref = null;
  }

  getParent() {
    return this.parent
  }

  get childNodes() {
    return this.getChildNodes()
  }

  
  getComponent() {
    return this._comp
  }

  
  ref(ref) {
    if (!ref) throw new Error('Illegal argument')
    
    if (this._ref) throw new Error('A VirtualElement can only be referenced once.')
    this._ref = ref;
    if (this._context) {
      const refs = this._context.refs;
      if(refs[ref]) {
        throw new Error('An item with reference "'+ref+'" already exists.')
      }
      refs[ref] = this;
    }
    return this
  }

  isInDocument() {
    return false
  }

}

VirtualElement.prototype._isVirtualElement = true;


class VirtualHTMLElement extends VirtualElement {

  constructor(tagName) {
    super();

    this._tagName = tagName;
    this.classNames = null;
    this.attributes = null;
    this.htmlProps = null;
    this.style = null;
    this.eventListeners = null;

    
    this.children = [];
  }

  getTagName() {
    return this._tagName
  }

  setTagName(tagName) {
    this._tagName = tagName;
    return this
  }

  hasClass(className) {
    if (this.classNames) {
      return this.classNames.indexOf(className) > -1
    }
    return false
  }

  addClass(className) {
    if (!this.classNames) {
      this.classNames = [];
    }
    this.classNames.push(className);
    return this
  }

  removeClass(className) {
    if (this.classNames) {
      this.classNames = without(this.classNames, className);
    }
    return this
  }

  removeAttribute(name) {
    if (this.attributes) {
      delete this.attributes[name];
    }
    return this
  }

  getAttribute(name) {
    if (this.attributes) {
      return this.attributes[name]
    }
  }

  setAttribute(name, value) {
    if (!this.attributes) {
      this.attributes = {};
    }
    this.attributes[name] = value;
    return this
  }

  getAttributes() {
    
    
    
    var attributes = {};
    if (this.attributes) {
      Object.assign(attributes, this.attributes);
    }
    if (this.classNames) {
      attributes.class = this.classNames.join(' ');
    }
    if (this.style) {
      attributes.style = map(this.style, function(val, key) {
        return key + ":" + val
      }).join(';');
    }
    return attributes
  }

  getId() {
    return this.getAttribute('id')
  }

  setId(id) {
    this.setAttribute('id', id);
    return this
  }

  setTextContent(text) {
    text = String(text || '');
    this.empty();
    this.appendChild(text);
    return this
  }

  setInnerHTML(html) {
    html = html || '';
    this.empty();
    this._innerHTMLString = html;
    return this
  }

  getInnerHTML() {
    if (!this.hasOwnProperty('_innerHTMLString')) {
      throw new Error('Not supported.')
    } else {
      return this._innerHTMLString
    }
  }

  getValue() {
    return this.htmlProp('value')
  }

  setValue(value) {
    this.htmlProp('value', value);
    return this
  }

  getChildNodes() {
    return this.children
  }

  getChildren() {
    return this.children.filter(function(child) {
      return child.getNodeType() !== "text"
    })
  }

  isTextNode() {
    return false
  }

  isElementNode() {
    return true
  }

  isCommentNode() {
    return false
  }

  isDocumentNode() {
    return false
  }

  append() {
    if (this._innerHTMLString) {
      throw Error('It is not possible to mix $$.html() with $$.append(). You can call $$.empty() to reset this virtual element.')
    }
    this._append(this.children, arguments);
    return this
  }

  appendChild(child) {
    if (this._innerHTMLString) {
      throw Error('It is not possible to mix $$.html() with $$.append(). You can call $$.empty() to reset this virtual element.')
    }
    this._appendChild(this.children, child);
    return this
  }

  insertAt(pos, child) {
    child = this._normalizeChild(child);
    if (!child) {
      throw new Error('Illegal child: ' + child)
    }
    if (!child._isVirtualElement) {
      throw new Error('Illegal argument for $$.insertAt():' + child)
    }
    if (pos < 0 || pos > this.children.length) {
      throw new Error('insertAt(): index out of bounds.')
    }
    this._insertAt(this.children, pos, child);
    return this
  }

  insertBefore(child, before) {
    var pos = this.children.indexOf(before);
    if (pos > -1) {
      this.insertAt(pos, child);
    } else {
      throw new Error('insertBefore(): reference node is not a child of this element.')
    }
    return this
  }

  removeAt(pos) {
    if (pos < 0 || pos >= this.children.length) {
      throw new Error('removeAt(): Index out of bounds.')
    }
    this._removeAt(pos);
    return this
  }

  removeChild(child) {
    if (!child || !child._isVirtualElement) {
      throw new Error('removeChild(): Illegal arguments. Expecting a CheerioDOMElement instance.')
    }
    var idx = this.children.indexOf(child);
    if (idx < 0) {
      throw new Error('removeChild(): element is not a child.')
    }
    this.removeAt(idx);
    return this
  }

  replaceChild(oldChild, newChild) {
    if (!newChild || !oldChild ||
        !newChild._isVirtualElement || !oldChild._isVirtualElement) {
      throw new Error('replaceChild(): Illegal arguments. Expecting BrowserDOMElement instances.')
    }
    var idx = this.children.indexOf(oldChild);
    if (idx < 0) {
      throw new Error('replaceChild(): element is not a child.')
    }
    this.removeAt(idx);
    this.insertAt(idx, newChild);
    return this
  }

  empty() {
    var children = this.children;
    while (children.length) {
      var child = children.pop();
      child.parent = null;
    }
    delete this._innerHTMLString;
    return this
  }

  getProperty(name) {
    if (this.htmlProps) {
      return this.htmlProps[name]
    }
  }

  setProperty(name, value) {
    if (!this.htmlProps) {
      this.htmlProps = {};
    }
    this.htmlProps[name] = value;
    return this
  }

  removeProperty(name) {
    if (this.htmlProps) {
      delete this.htmlProps[name];
    }
    return this
  }

  getStyle(name) {
    if (this.style) {
      return this.style[name]
    }
  }

  setStyle(name, value) {
    if (!this.style) {
      this.style = {};
    }
    if (DOMElement.pxStyles[name] && isNumber(value)) value = value + 'px';
    this.style[name] = value;
    return this
  }

  _createEventListener(eventName, handler, options) {
    options.context = options.context || this._owner._comp;
    return super._createEventListener(eventName, handler, options)
  }

  getNodeType() {
    return "element"
  }

  hasInnerHTML() {
    return Boolean(this._innerHTMLString)
  }

  _normalizeChild(child) {
    if (isNil(child)) {
      return
    } else if (child._isVirtualElement) {
      return child
    } else if (isString$1(child) || isBoolean(child) || isNumber(child)) {
      return new VirtualTextNode(String(child))
    } else {
      throw new Error('Unsupported child type')
    }
  }

  _append(outlet, args) {
    if (args.length === 1 && !isArray$1(args[0])) {
      this._appendChild(outlet, args[0]);
      return
    }
    var children;
    if (isArray$1(args[0])) {
      children = args[0];
    } else if (arguments.length > 1) {
      children = Array.prototype.slice.call(args,0);
    } else {
      return
    }
    children.forEach(this._appendChild.bind(this, outlet));
  }

  _appendChild(outlet, child) {
    child = this._normalizeChild(child);
    
    
    if (!child) return
    outlet.push(child);
    this._attach(child);
    return child
  }

  _insertAt(outlet, pos, child) {
    if (!child) return
    outlet.splice(pos, 0, child);
    this._attach(child);
  }

  _removeAt(outlet, pos) {
    var child = outlet[pos];
    outlet.splice(pos, 1);
    this._detach(child);
  }

  _attach(child) {
    child.parent = this;
    if (this._context && child._owner !== this._owner && child._ref) {
      this._context.foreignRefs[child._ref] = child;
    }
  }

  _detach(child) {
    child.parent = null;
    if (this._context && child._owner !== this._owner && child._ref) {
      delete this.context.foreignRefs[child._ref];
    }
  }

  _mergeHTMLConfig(other) {
    if (other.classNames) {
      if (!this.classNames) {
        this.classNames = [];
      }
      this.classNames = this.classNames.concat(other.classNames);
    }
    if (other.attributes) {
      if (!this.attributes) {
        this.attributes = {};
      }
      Object.assign(this.attributes, other.attributes);
    }
    if (other.htmlProps) {
      if (!this.htmlProps) {
        this.htmlProps = {};
      }
      Object.assign(this.htmlProps, other.htmlProps);
    }
    if (other.style) {
      if (!this.style) {
        this.style = {};
      }
      Object.assign(this.style, other.style);
    }
    if (other.eventListeners) {
      if (!this.eventListeners) {
        this.eventListeners = [];
      }
      this.eventListeners = this.eventListeners.concat(other.eventListeners);
    }
  }
}

VirtualHTMLElement.prototype._isVirtualHTMLElement = true;



class VirtualComponent extends VirtualHTMLElement {

  constructor(ComponentClass, props) {
    super();

    props = props || {};

    this.ComponentClass = ComponentClass;
    this.props = props;
    if (!props.children) {
      props.children = [];
    }
    this.children = props.children;
  }

  get _isVirtualComponent() { return true; }

  getComponent() {
    return this._comp
  }

  
  
  getChildren() {
    return this.props.children
  }

  getNodeType() {
    return 'component'
  }

  outlet(name) {
    return new Outlet(this, name)
  }

  _attach(child) {
    child._preliminaryParent = this;
  }

  _detach(child) {
    child._preliminaryParent = null;
  }

  _copyHTMLConfig() {
    return {
      classNames: clone(this.classNames),
      attributes: clone(this.attributes),
      htmlProps: clone(this.htmlProps),
      style: clone(this.style),
      eventListeners: clone(this.eventListeners)
    }
  }
}

class Outlet {
  constructor(virtualEl, name) {
    this.virtualEl = virtualEl;
    this.name = name;
    Object.freeze(this);
  }

  _getOutlet() {
    var outlet = this.virtualEl.props[this.name];
    if (!outlet) {
      outlet = [];
      this.virtualEl.props[this.name] = outlet;
    }
    return outlet
  }

  append() {
    var outlet = this._getOutlet();
    this.virtualEl._append(outlet, arguments);
    return this
  }

  empty() {
    var arr = this.virtualEl.props[this.name];
    arr.forEach(function(el) {
      this._detach(el);
    }.bind(this));
    arr.splice(0, arr.length);
    return this
  }
}


class VirtualTextNode extends VirtualElement {

  constructor(text) {
    super();
    this.text = text;
  }

  get _isVirtualTextNode() { return true; }
}

VirtualElement.Component = VirtualComponent;
VirtualElement.TextNode = VirtualTextNode;


VirtualElement.createElement = function() {
  var content;
  var _first = arguments[0];
  var _second = arguments[1];
  var type;
  if (isString$1(_first)) {
    type = "element";
  } else if (isFunction$1(_first) && _first.prototype._isComponent) {
    type = "component";
  } else if (isNil(_first)) {
    throw new Error('$$(null): provided argument was null or undefined.')
  } else {
    throw new Error('Illegal usage of $$()')
  }
  
  var props = {};
  var classNames, ref;
  var eventHandlers = [];
  for(var key in _second) {
    if (!_second.hasOwnProperty(key)) continue
    var val = _second[key];
    switch(key) {
      case 'class':
        classNames = val;
        break
      case 'ref':
        ref = val;
        break
      default:
        props[key] = val;
    }
  }
  if (type === 'element') {
    content = new VirtualHTMLElement(_first);
    
    
    content.attr(props);
  } else {
    content = new VirtualComponent(_first, props);
  }
  
  
  content._owner = this.owner;
  if (classNames) {
    content.addClass(classNames);
  }
  if (ref) {
    content.ref(ref);
  }
  eventHandlers.forEach(function(h) {
    if (isFunction$1(h.handler)) {
      content.on(h.name, h.handler);
    } else if (isPlainObject$1(h.handler)) {
      var params = h.handler;
      content.on(h.name, params.handler, params.context, params);
    } else {
      throw new Error('Illegal arguments for $$(_,{ on'+h.name+'})')
    }
  });
  
  
  if (arguments.length > 2) {
    content.append(flattenOften(Array.prototype.slice.call(arguments, 2), 3));
  }
  return content
};

class RenderingEngine {

  constructor(options = {}) {
    this.elementFactory = options.elementFactory || DefaultDOMElement.createDocument('html');
  }

  _render(comp, oldProps, oldState) {
    
    var vel = _createWrappingVirtualComponent(comp);
    var state = new RenderingEngine.State(this.elementFactory);
    if (oldProps) {
      state.setOldProps(vel, oldProps);
    }
    if (oldState) {
      state.setOldState(vel, oldState);
    }
    try {
      
      
      
      _capture(state, vel, 'forceCapture');
      

      
      
      _render(state, vel);
      

      _triggerUpdate(state, vel);

    } finally {
      state.dispose();
    }
    
  }

  
  _renderChild(comp, vel) {
    
    
    var state = new RenderingEngine.State(this.elementFactory);
    vel.parent = { _comp: comp };
    try {
      _capture(state, vel);
      _render(state, vel);
      return vel._comp
    } finally {
      state.dispose();
    }
  }
}


function _create(state, vel) {
  var comp = vel._comp;
  console.assert(!comp, "Component instance should not exist when this method is used.");
  var parent = vel.parent._comp;
  
  if (!parent) {
    parent = _create(state, vel.parent);
  }
  if (vel._isVirtualComponent) {
    console.assert(parent, "A Component should have a parent.");
    comp = new vel.ComponentClass(parent, vel.props);
    
    vel.props = comp.props;
    comp.__htmlConfig__ = vel._copyHTMLConfig();
  } else if (vel._isVirtualHTMLElement) {
    comp = new Component.Element(parent, vel);
  } else if (vel._isVirtualTextNode) {
    comp = new Component.TextNode(parent, vel);
  }
  if (vel._ref) {
    comp._ref = vel._ref;
  }
  if (vel._owner) {
    comp._owner = vel._owner._comp;
  }
  vel._comp = comp;
  return comp
}

function _capture(state, vel, forceCapture) {
  if (state.isCaptured(vel)) {
    return vel
  }
  
  var comp = vel._comp;
  if (!comp) {
    comp = _create(state, vel);
    state.setNew(vel);
  }
  if (vel._isVirtualComponent) {
    var needRerender;
    
    
    
    if (forceCapture) {
      needRerender = true;
    } else {
      
      needRerender = !comp.el || comp.shouldRerender(vel.props, comp.state);
      comp.__htmlConfig__ = vel._copyHTMLConfig();
      state.setOldProps(vel, comp.props);
      state.setOldState(vel, comp.state);
      
      comp._setProps(vel.props);
      if (!state.isNew(vel)) {
        state.setUpdated(vel);
      }
    }
    if (needRerender) {
      var context = new CaptureContext(vel);
      var content = comp.render(context.$$);
      if (!content || !content._isVirtualHTMLElement) {
        throw new Error("Component.render must return VirtualHTMLElement")
      }

      if (comp.__htmlConfig__) {
        content._mergeHTMLConfig(comp.__htmlConfig__);
      }
      content._comp = comp;
      vel._content = content;
      if (!state.isNew(vel) && comp.isMounted()) {
        state.setUpdated(vel);
      }
      
      _prepareVirtualComponent(state, comp, content);
      
      
      if (substanceGlobals.DEBUG_RENDERING) {
        
        
        
        
        var stack = content.children.slice(0);
        while (stack.length) {
          var child = stack.shift();
          if (state.isCaptured(child)) continue
          
          if (child._isVirtualComponent) continue
          if (!child._comp) {
            _create(state, child);
          }
          if (child._isVirtualHTMLElement && child.children.length > 0) {
            stack = stack.concat(child.children);
          }
          state.setCaptured(child);
        }
        state.setCaptured(content);
        
        
        var descendingContext = new DescendingContext(state, context);
        while (descendingContext.hasPendingCaptures()) {
          descendingContext.reset();
          comp.render(descendingContext.$$);
        }
      } else {
        
        
        _capture(state, vel._content);
      }
    } else {
      state.setSkipped(vel);
    }
  } else if (vel._isVirtualHTMLElement) {
    for (var i = 0; i < vel.children.length; i++) {
      _capture(state, vel.children[i]);
    }
  }
  state.setCaptured(vel);
  return vel
}

function _render(state, vel) {
  if (state.isSkipped(vel)) return
  

  
  
  
  
  
  

  let comp = vel._comp;
  console.assert(comp && comp._isComponent, "A captured VirtualElement must have a component instance attached.");

  
  if (vel._isVirtualComponent) {
    _render(state, vel._content);

    
    const context = vel._content._context;
    let refs = {};
    let foreignRefs = {};
    forEach(context.refs, (vel, ref) => {
      refs[ref] = vel._comp;
    });
    forEach(context.foreignRefs, (vel, ref) => {
      foreignRefs[ref] = vel._comp;
    });
    comp.refs = refs;
    comp.__foreignRefs__ = foreignRefs;
    return
  }

  
  if (!comp.el) {
    comp.el = _createElement(state, vel);
    comp.el._comp = comp;
  }
  _updateElement(comp, vel);

  
  if (vel._isVirtualHTMLElement && !vel.hasInnerHTML()) {
    var newChildren = vel.children;
    var oldComp, virtualComp, newComp;
    var pos1 = 0; var pos2 = 0;

    
    
    
    var oldChildren = [];
    comp.el.getChildNodes().forEach(function(node) {
      var childComp = node._comp;

      
      
      
      

      
      if (!childComp || state.isRelocated(childComp)) {
        comp.el.removeChild(node);
      } else {
        oldChildren.push(childComp);
      }
    });

    while(pos1 < oldChildren.length || pos2 < newChildren.length) {
      
      
      
      
      do {
        oldComp = oldChildren[pos1++];
      } while (oldComp && (state.isDetached(oldComp)))

      virtualComp = newChildren[pos2++];
      
      if (oldComp && !virtualComp) {
        while (oldComp) {
          _removeChild(state, comp, oldComp);
          oldComp = oldChildren[pos1++];
        }
        break
      }

      
      if (oldComp && oldComp.el.isTextNode() &&
          virtualComp && virtualComp._isVirtualTextNode &&
          oldComp.el.textContent === virtualComp.text ) {
        continue
      }

      
      if (!state.isRendered(virtualComp)) {
        _render(state, virtualComp);
      }

      newComp = virtualComp._comp;

      
      
      if (state.isRelocated(newComp)) {
        newComp._setParent(comp);
      }

      console.assert(newComp, 'Component instance should now be available.');

      
      if (virtualComp && !oldComp) {
        _appendChild(state, comp, newComp);
        continue
      }
      
      else if (state.isMapped(virtualComp)) {
        
        if (newComp === oldComp) {
          
        } else if (state.isMapped(oldComp)) {
          
          state.setDetached(oldComp);
          _removeChild(state, comp, oldComp);
          pos2--;
        }
        
        else {
          _removeChild(state, comp, oldComp);
          pos2--;
        }
      }
      else if (state.isMapped(oldComp)) {
        _insertChildBefore(state, comp, newComp, oldComp);
        pos1--;
      }
      else {
        
        
        
        
        _replaceChild(state, comp, oldComp, newComp);
      }
    }
  }

  state.setRendered(vel);
}

function _triggerUpdate(state, vel) {
  if (vel._isVirtualComponent) {
    if (!state.isSkipped(vel)) {
      vel._content.children.forEach(_triggerUpdate.bind(null, state));
    }
    if (state.isUpdated(vel)) {
      vel._comp.didUpdate(state.getOldProps(vel), state.getOldState(vel));
    }
  } else if (vel._isVirtualHTMLElement) {
    vel.children.forEach(_triggerUpdate.bind(null, state));
  }
}

function _appendChild(state, parent, child) {
  parent.el.appendChild(child.el);
  _triggerDidMount(state, parent, child);
}

function _replaceChild(state, parent, oldChild, newChild) {
  parent.el.replaceChild(oldChild.el, newChild.el);
  if (!state.isDetached(oldChild)) {
    oldChild.triggerDispose();
  }
  _triggerDidMount(state, parent, newChild);
}

function _insertChildBefore(state, parent, child, before) {
  parent.el.insertBefore(child.el, before.el);
  _triggerDidMount(state, parent, child);
}

function _removeChild(state, parent, child) {
  parent.el.removeChild(child.el);
  if (!state.isDetached(child)) {
    child.triggerDispose();
  }
}

function _triggerDidMount(state, parent, child) {
  if (!state.isDetached(child) &&
      parent.isMounted() && !child.isMounted()) {
    child.triggerDidMount(true);
  }
}


function _prepareVirtualComponent(state, comp, vc) {
  var newRefs = {};
  var foreignRefs = {};
  
  
  
  
  if (vc._context) {
    newRefs = vc._context.refs;
    foreignRefs = vc._context.foreignRefs;
  }
  var oldRefs = comp.refs;
  var oldForeignRefs = comp.__foreignRefs__;
  
  forEach(newRefs, function(vc, ref) {
    var comp = oldRefs[ref];
    if (comp) _mapComponents(state, comp, vc);
  });
  forEach(foreignRefs, function(vc, ref) {
    var comp = oldForeignRefs[ref];
    if (comp) _mapComponents(state, comp, vc);
  });
}



function _mapComponents(state, comp, vc) {
  if (!comp && !vc) return true
  if (!comp || !vc) return false
  
  
  
  
  
  if (state.isMapped(vc) || state.isMapped(comp)) {
    return vc._comp === comp
  }
  if (vc._comp) {
    if (vc._comp === comp) {
      state.setMapped(vc);
      state.setMapped(comp);
      return true
    } else {
      return false
    }
  }
  if (!_isOfSameType(comp, vc)) {
    return false
  }

  vc._comp = comp;
  state.setMapped(vc);
  state.setMapped(comp);

  var canMapParent;
  var parent = comp.getParent();
  if (vc.parent) {
    canMapParent = _mapComponents(state, parent, vc.parent);
  }
  
  
  
  
  else if (vc._preliminaryParent) {
    while (parent && parent._isElementComponent) {
      parent = parent.getParent();
    }
    canMapParent = _mapComponents(state, parent, vc._preliminaryParent);
  }
  if (!canMapParent) {
    state.setRelocated(vc);
    state.setRelocated(comp);
  }
  return canMapParent
}

function _isOfSameType(comp, vc) {
  return (
    (comp._isElementComponent && vc._isVirtualHTMLElement) ||
    (comp._isComponent && vc._isVirtualComponent && comp.constructor === vc.ComponentClass) ||
    (comp._isTextNodeComponent && vc._isVirtualTextNode)
  )
}

function _createElement(state, vel) {
  var el;
  if (vel._isVirtualTextNode) {
    el = state.elementFactory.createTextNode(vel.text);
  } else {
    el = state.elementFactory.createElement(vel.tagName);
  }
  return el
}

function _updateElement(comp, vel) {
  if (comp._isTextNodeComponent) {
    comp.setTextContent(vel.text);
    return
  }
  var el = comp.el;
  console.assert(el, "Component's element should exist at this point.");
  var tagName = el.getTagName();
  if (vel.tagName.toLowerCase() !== tagName) {
    el.setTagName(vel.tagName);
  }
  _updateHash({
    oldHash: el.getAttributes(),
    newHash: vel.getAttributes(),
    update: function(key, val) {
      el.setAttribute(key, val);
    },
    remove: function(key) {
      el.removeAttribute(key);
    }
  });
  _updateHash({
    oldHash: el.htmlProps,
    newHash: vel.htmlProps,
    update: function(key, val) {
      el.setProperty(key, val);
    },
    remove: function(key) {
      el.removeProperty(key);
    }
  });
  _updateListeners({
    el: el,
    oldListeners: el.getEventListeners(),
    newListeners: vel.getEventListeners()
  });

  
  if (vel.hasInnerHTML()) {
    if (!el._hasInnerHTML) {
      el.empty();
      el.setInnerHTML(vel.getInnerHTML());
    } else {
      var oldInnerHTML = el.getInnerHTML();
      var newInnerHTML = vel.getInnerHTML();
      if (oldInnerHTML !== newInnerHTML) {
        el.setInnerHTML(newInnerHTML);
      }
    }
    el._hasInnerHTML = true;
  }
}

function _updateHash(args) {
  const newHash = args.newHash;
  const oldHash = args.oldHash || {};
  const update = args.update;
  const remove = args.remove;
  let updatedKeys = {};
  for (let key in newHash) {
    if (newHash.hasOwnProperty(key)) {
      var oldVal = oldHash[key];
      var newVal = newHash[key];
      updatedKeys[key] = true;
      if (oldVal !== newVal) {
        update(key, newVal);
      }
    }
  }
  
  
  if (isFunction$1(oldHash.keys) && oldHash.size > 0) {
    let keys$$1 = Array.from(oldHash.keys());
    keys$$1.forEach((key) => {
      if (!updatedKeys[key]) {
        remove(key);
      }
    });
  } else {
    for (let key in oldHash) {
      if (oldHash.hasOwnProperty(key) && !updatedKeys[key]) {
        remove(key);
      }
    }
  }
}

function _updateListeners(args) {
  var el = args.el;
  
  
  
  var newListeners = args.newListeners || [];
  el.removeAllEventListeners();
  for (var i=0; i<newListeners.length;i++) {
    el.addEventListener(newListeners[i]);
  }
}




class DescendingContext {
  constructor(state, captureContext) {
    this.state = state;
    this.owner = captureContext.owner;
    this.refs = {};
    this.foreignRefs = {};
    this.elements = captureContext.elements;
    this.pos = 0;
    this.updates = captureContext.components.length;
    this.remaining = this.updates;

    this.$$ = this._createComponent.bind(this);
  }

  _createComponent() {
    var state = this.state;
    var vel = this.elements[this.pos++];
    
    
    
    if (!state.isCaptured(vel) && vel._isVirtualComponent &&
         vel.parent && state.isCaptured(vel.parent)) {
      _capture(state, vel);
      this.updates++;
      this.remaining--;
    }
    
    
    
    
    vel = VirtualElement.createElement.apply(this, arguments);
    
    vel._context = this;
    vel._owner = this.owner;
    
    
    vel._attach = function() {};
    vel._detach = function() {};
    return vel
  }

  hasPendingCaptures() {
    return this.updates > 0 && this.remaining > 0
  }

  reset() {
    this.pos = 0;
    this.updates = 0;
    this.refs = {};
  }

  _ancestorsReady(vel) {
    while (vel) {
      if (this.state.isCaptured(vel) ||
          
          vel === this.owner || vel === this.owner._content) {
        return true
      }
      vel = vel.parent;
    }
    return false
  }


}

RenderingEngine._internal = {
  _capture: _capture,
  _wrap: _createWrappingVirtualComponent,
};

class CaptureContext {
  constructor(owner) {
    this.owner = owner;
    this.refs = {};
    this.foreignRefs = {};
    this.elements = [];
    this.components = [];
    this.$$ = this._createComponent.bind(this);
    this.$$.capturing = true;
  }

  _createComponent() {
    var vel = VirtualElement.createElement.apply(this, arguments);
    vel._context = this;
    vel._owner = this.owner;
    if (vel._isVirtualComponent) {
      
      this.components.push(vel);
    }
    this.elements.push(vel);
    return vel
  }
}


function _createWrappingVirtualComponent(comp) {
  var vel = new VirtualElement.Component(comp.constructor);
  vel._comp = comp;
  if (comp.__htmlConfig__) {
    vel._mergeHTMLConfig(comp.__htmlConfig__);
  }
  return vel
}

RenderingEngine.createContext = function(comp) {
  var vel = _createWrappingVirtualComponent(comp);
  return new CaptureContext(vel)
};


class RenderingState {

  constructor(elementFactory) {
    this.elementFactory = elementFactory;
    this.poluted = [];
    this.id = "__"+uuid();
  }

  dispose() {
    var id = this.id;
    this.poluted.forEach(function(obj) {
      delete obj[id];
    });
  }

  set(obj, key, val) {
    var info = obj[this.id];
    if (!info) {
      info = {};
      obj[this.id] = info;
      this.poluted.push(obj);
    }
    info[key] = val;
  }

  get(obj, key) {
    var info = obj[this.id];
    if (info) {
      return info[key]
    }
  }

  setMapped(c) {
    this.set(c, 'mapped', true);
  }


  isMapped(c) {
    return Boolean(this.get(c, 'mapped'))
  }

  
  
  setRelocated(c) {
    this.set(c, 'relocated', true);
  }

  isRelocated(c) {
    return Boolean(this.get(c, 'relocated'))
  }

  setDetached(c) {
    this.set(c, 'detached', true);
  }

  isDetached(c) {
    return Boolean(this.get(c, 'detached'))
  }

  setCaptured(vc) {
    this.set(vc, 'captured', true);
  }

  isCaptured(vc) {
    return Boolean(this.get(vc, 'captured'))
  }

  setNew(vc) {
    this.set(vc, 'created', true);
  }

  isNew(vc) {
    return Boolean(this.get(vc, 'created'))
  }

  setUpdated(vc) {
    this.set(vc, 'updated', true);
  }

  isUpdated(vc) {
    return Boolean(this.get(vc, 'updated'))
  }

  setSkipped(vc) {
    this.set(vc, 'skipped', true);
  }

  isSkipped(vc) {
    return Boolean(this.get(vc, 'skipped'))
  }

  setRendered(vc) {
    this.set(vc, 'rendered', true);
  }

  isRendered(vc) {
    return Boolean(this.get(vc, 'rendered'))
  }

  setOldProps(vc, oldProps) {
    this.set(vc, 'oldProps', oldProps);
  }

  getOldProps(vc) {
    return this.get(vc, 'oldProps')
  }

  setOldState(vc, oldState) {
    this.set(vc, 'oldState', oldState);
  }

  getOldState(vc) {
    return this.get(vc, 'oldState')
  }
}

RenderingEngine.State = RenderingState;

class Component extends EventEmitter {
  
  constructor(parent, props = {}, options = {}) {
    super();

    
    
    
    
    

    this.parent = (parent && parent._isComponent) ? parent : null;

    
    this.el = options.el;

    
    
    let context = options.context ? options.context : this._getContext() || {};
    this.context = context;
    Object.freeze(this.context);

    
    
    
    this.renderingEngine = (parent && parent.renderingEngine) || context.renderingEngine || options.renderingEngine || new RenderingEngine();

    
    
    if (this._SKIP_COMPONENT_INIT) return

    this.__id__ = uuid();

    
    this.refs = {};
    
    
    
    this.__foreignRefs__ = {};

    
    this._actionHandlers = {};

    
    this.props = props;
    Object.freeze(this.props);

    
    this.state = this.getInitialState() || {};
    Object.freeze(this.state);
  }

  getId() {
    return this.__id__
  }

  setId() {
    throw new Error("'id' is readonly")
  }

  
  getChildContext() {
    return this.childContext || {}
  }

  
  getInitialState() {
    return {}
  }

  
  getParent() {
    return this.parent
  }

  
  getRoot() {
    var comp = this;
    var parent = comp;
    while (parent) {
      comp = parent;
      parent = comp.getParent();
    }
    return comp
  }

  getNativeElement() {
    return this.el.getNativeElement()
  }

  
  getLabel(name) {
    let labelProvider = this.context.labelProvider;
    if (!labelProvider) throw new Error('Missing labelProvider.')
    return labelProvider.getLabel(name)
  }

  
  getComponent(componentName, maybe) {
    let componentRegistry = this.getComponentRegistry();
    if (!componentRegistry) throw new Error('Missing componentRegistry.')
    const ComponentClass = componentRegistry.get(componentName);
    if (!maybe && !ComponentClass) {
      throw new Error('No Component registered with name ' + componentName)
    }
    return ComponentClass
  }

  getComponentRegistry() {
    return this.props.componentRegistry || this.context.componentRegistry
  }

  getFlow() {
    return this.context.flow
  }

  
  render($$) {
    
    return $$('div')
  }

  
  mount(el) {
    if (!el) {
      throw new Error('Element is required.')
    }
    el = DefaultDOMElement.wrap(el);
    
    this.el = null;
    this.renderingEngine = new RenderingEngine({ elementFactory: el.getOwnerDocument() });
    this._render();
    el.appendChild(this.el);
    if (el.isInDocument()) {
      this.triggerDidMount(true);
    }
    return this
  }

  
  shouldRerender(newProps, newState) { 
    return true
  }

  
  rerender() {
    this._rerender(this.props, this.state);
  }

  _rerender(oldProps, oldState) {
    this._render(oldProps, oldState);
    
    if (!this.isMounted()) {
      this.didUpdate(oldProps, oldState);
    }
  }

  _render(oldProps, oldState) {
    if (this.__isRendering__) {
      throw new Error('Component is rendering already.')
    }
    this.__isRendering__ = true;
    try {
      this.renderingEngine._render(this, oldProps, oldState);
    } finally {
      delete this.__isRendering__;
    }
  }

  
  triggerDidMount() {
    
    
    

    
    
    if (!this.__isMounted__) {
      this.__isMounted__ = true;
      this.didMount();
    }
    
    this.getChildren().forEach(function(child) {
      
      
      child.triggerDidMount(true);
    });
  }

  
  didMount() {}

  
  didUpdate() {}

  
  isMounted() {
    return this.__isMounted__
  }

  
  triggerDispose() {
    this.getChildren().forEach(function(child) {
      child.triggerDispose();
    });
    this.dispose();
    this.__isMounted__ = false;
  }

  
  dispose() {}

  
  _setParent(newParent) {
    this.parent = newParent;
    this.context = this._getContext() || {};
    Object.freeze(this.context);
  }

  
  send(action) {
    var comp = this;
    while(comp) {
      if (comp._actionHandlers && comp._actionHandlers[action]) {
        comp._actionHandlers[action].apply(comp, Array.prototype.slice.call(arguments, 1));
        return true
      }
      comp = comp.getParent();
    }
    console.warn('Action', action, 'was not handled.');
    return false
  }

  
  handleActions(actionHandlers) {
    forEach(actionHandlers, function(method, actionName) {
      this.handleAction(actionName, method);
    }.bind(this));
    return this
  }

  
  handleAction(name, handler) {
    if (!name || !handler || !isFunction$1(handler)) {
      throw new Error('Illegal arguments.')
    }
    handler = handler.bind(this);
    this._actionHandlers[name] = handler;
  }

  
  getState() {
    return this.state
  }

  
  setState(newState) {
    var oldProps = this.props;
    var oldState = this.state;
    
    
    var needRerender = !this.__isSettingProps__ &&
      this.shouldRerender(this.getProps(), newState);
    
    this.willUpdateState(newState);
    this.state = newState || {};
    Object.freeze(this.state);
    if (needRerender) {
      this._rerender(oldProps, oldState);
    } else if (!this.__isSettingProps__) {
      this.didUpdate(oldProps, oldState);
    }
  }

  
  extendState(newState) {
    newState = extend({}, this.state, newState);
    this.setState(newState);
  }

  
  willUpdateState(newState) { 
  }

  
  getProps() {
    return this.props
  }

  
  setProps(newProps) {
    var oldProps = this.props;
    var oldState = this.state;
    var needRerender = this.shouldRerender(newProps, this.state);
    this._setProps(newProps);
    if (needRerender) {
      this._rerender(oldProps, oldState);
    } else {
      this.didUpdate(oldProps, oldState);
    }
  }

  _setProps(newProps) {
    newProps = newProps || {};
    
    this.__isSettingProps__ = true;
    try {
      this.willReceiveProps(newProps);
      this.props = newProps || {};
      Object.freeze(newProps);
    } finally {
      delete this.__isSettingProps__;
    }
  }

  
  extendProps(updatedProps) {
    var newProps = extend({}, this.props, updatedProps);
    this.setProps(newProps);
  }

  
  willReceiveProps(newProps) { 
  }

  getTextContent() {
    if (this.el) {
      return this.el.textContent
    }
  }

  get textContent() {
    return this.getTextContent()
  }

  getInnerHTML() {
    if (this.el) {
      return this.el.getInnerHTML()
    }
  }

  get innerHTML() {
    return this.getInnerHTML()
  }

  getOuterHTML() {
    if (this.el) {
      return this.el.getOuterHTML()
    }
  }

  get outerHTML() {
    return this.getOuterHTML()
  }

  getAttribute(name) {
    if (this.el) {
      return this.el.getAttribute(name)
    }
  }

  setAttribute(name, val) {
    if (this.el) {
      this.el.setAttribute(name, val);
    }
    return this
  }

  getProperty(name) {
    if (this.el) {
      return this.el.getProperty(name)
    }
  }

  setProperty(name, val) {
    if (this.el) {
      this.el.setProperty(name, val);
    }
    return this
  }

  hasClass(name) {
    if (this.el) {
      return this.el.hasClass(name)
    }
  }

  addClass(name) {
    if (this.el) {
      this.el.addClass(name);
    }
    return this
  }

  removeClass(name) {
    if (this.el) {
      this.el.removeClass(name);
    }
    return this
  }

  getStyle(name) {
    if (this.el) {
      return this.el.getStyle(name)
    }
  }

  setStyle(name, val) {
    if (this.el) {
      return this.el.setStyle(name, val)
    }
    return this
  }

  getValue() {
    if (this.el) {
      return this.el.getValue()
    }
  }

  setValue(val) {
    if (this.el) {
      this.el.setValue(val);
    }
    return this
  }

  getChildCount() {
    if (!this.el) return 0
    return this.el.getChildCount()
  }

  get childNodes() {
    return this.getChildNodes()
  }

  getChildNodes() {
    if (!this.el) return []
    var childNodes = this.el.getChildNodes();
    childNodes = childNodes.map(_unwrapComp).filter(Boolean);
    return childNodes
  }

  getChildren() {
    if (!this.el) return []
    var children = this.el.getChildren();
    children = children.map(_unwrapComp).filter(Boolean);
    return children
  }

  getChildAt(pos) {
    var node = this.el.getChildAt(pos);
    return _unwrapCompStrict(node)
  }

  find(cssSelector) {
    var el = this.el.find(cssSelector);
    return _unwrapComp(el)
  }

  findAll(cssSelector) {
    var els = this.el.findAll(cssSelector);
    return els.map(_unwrapComp).filter(Boolean)
  }

  appendChild(child) {
    this.insertAt(this.getChildCount(), child);
  }

  insertAt(pos, childEl) {
    if (isString$1(childEl)) {
      childEl = new VirtualElement.TextNode(childEl);
    }
    if (!childEl._isVirtualElement) {
      throw new Error('Invalid argument: "child" must be a VirtualElement.')
    }
    var child = this.renderingEngine._renderChild(this, childEl);
    this.el.insertAt(pos, child.el);
    _mountChild(this, child);
  }

  removeAt(pos) {
    var childEl = this.el.getChildAt(pos);
    if (childEl) {
      var child = _unwrapCompStrict(childEl);
      _disposeChild(child);
      this.el.removeAt(pos);
    }
  }

  removeChild(child) {
    if (!child || !child._isComponent) {
      throw new Error('removeChild(): Illegal arguments. Expecting a Component instance.')
    }
    
    _disposeChild(child);
    this.el.removeChild(child.el);
  }

  replaceChild(oldChild, newChild) {
    if (!newChild || !oldChild ||
        !newChild._isComponent || !oldChild._isComponent) {
      throw new Error('replaceChild(): Illegal arguments. Expecting BrowserDOMElement instances.')
    }
    
    _disposeChild(oldChild);
    this.el.replaceChild(newChild.el, oldChild.el);
    if (this.isMounted()) {
      newChild.triggerDidMount(true);
    }
  }

  
  
  
  
  
  
  empty() {
    this._clear();
    return this
  }

  _clear() {
    let el = this.el;
    if (el) {
      this.getChildNodes().forEach(function(child) {
        _disposeChild(child);
      });
      el.empty();
    }
    this.refs = {};
    this.__foreignRefs__ = {};
  }

  remove() {
    _disposeChild(this);
    this.el.remove();
  }

  addEventListener() {
    throw new Error("Not supported.")
  }

  removeEventListener() {
    throw new Error("Not supported.")
  }

  insertBefore() {
    throw new Error("Not supported.")
  }

  click() {
    if (this.el) {
      this.el.click();
    }
  }

  getComponentPath() {
    let path = [];
    let comp = this;
    while (comp) {
      path.unshift(comp);
      comp = comp.getParent();
    }
    return path
  }

  _getContext() {
    var context = {};
    var parent = this.getParent();
    if (parent) {
      context = extend(context, parent.context);
      if (parent.getChildContext) {
        return extend(context, parent.getChildContext())
      }
    }
    return context
  }

}

Component.prototype._isComponent = true;

Component.prototype.attr = DOMElement.prototype.attr;

Component.prototype.htmlProp = DOMElement.prototype.htmlProp;

Component.prototype.val = DOMElement.prototype.val;

Component.prototype.css = DOMElement.prototype.css;

Component.prototype.text = DOMElement.prototype.text;

Component.prototype.append = DOMElement.prototype.append;

Component.unwrap = _unwrapComp;

Component.render = function(props) {
  props = props || {};
  var ComponentClass = this;
  var comp = new ComponentClass(null, props);
  comp._render();
  return comp
};

Component.mount = function(props, el) {
  if (arguments.length === 1) {
    el = props;
    props = {};
  }
  if (!el) throw new Error("'el' is required.")
  if (isString$1(el)) {
    var selector = el;
    if (platform.inBrowser) {
      el = window.document.querySelector(selector);
    } else {
      throw new Error("This selector is not supported on server side.")
    }
  }
  el = new DefaultDOMElement.wrap(el);
  const ComponentClass = this;
  let comp = new ComponentClass(null, props);
  comp.mount(el);
  return comp
};

Component.getComponentForDOMElement = function(el) {
  return _unwrapComp(el)
};

Component.unwrapDOMElement = function(el) {
  console.warn('DEPRECATED: Use Component.getComponentForDOMElement');
  return Component.getComponentForDOMElement(el)
};

Component.getComponentFromNativeElement = function(nativeEl) {
  
  
  
  return _unwrapComp(DefaultDOMElement.wrap(nativeEl))
};


function _disposeChild(child) {
  child.triggerDispose();
  if (child._owner && child._ref) {
    console.assert(child._owner.refs[child._ref] === child, "Owner's ref should point to this child instance.");
    delete child._owner.refs[child._ref];
  }
}


function _mountChild(parent, child) {
  if (parent.isMounted()) {
    child.triggerDidMount(true);
  }
  if (child._owner && child._ref) {
    child._owner.refs[child._ref] = child;
  }
}


function _unwrapComp(el) {
  if (el) {
    if (!el._isDOMElement) el = DefaultDOMElement.unwrap(el);
    if (el) return el._comp
  }
}

function _unwrapCompStrict(el) {
  let comp = _unwrapComp(el);
  if (!comp) throw new Error("Expecting a back-link to the component instance.")
  return comp
}


class ElementComponent extends Component {

  constructor(parent) {
    super(parent);
  }

}

ElementComponent.prototype._isElementComponent = true;
ElementComponent.prototype._SKIP_COMPONENT_INIT = true;

class TextNodeComponent extends Component {

  constructor(parent) {
    super(parent);
  }

  setTextContent(text) {
    if (!this.el) {
      throw new Error('Component must be rendered first.')
    }
    if (this.el.textContent !== text) {
      this.el.textContent = text;
    }
  }

  getChildNodes() {
    return []
  }

  getChildren() {
    return []
  }

}

TextNodeComponent.prototype._isTextNodeComponent = true;
TextNodeComponent.prototype._SKIP_COMPONENT_INIT = true;

Component.Element = ElementComponent;
Component.TextNode = TextNodeComponent;

class ResourceManager {

  constructor(editorSession, context) {
    this.editorSession = editorSession;
    this.context = context;
    this.editorSession.onRender('document', this._onDocumentChange, this);
  }

  dispose() {
    this.editorSession.off(this);
  }

  
  triggerFetch(resource) {
    resource.fetchPayload(this.context, (err, props) => {
      if (err) {
        this._updateNode(resource.id, {
          errorMessage: err.toString()
        });
      } else {
        this._updateNode(resource.id, props);
      }
    });
  }

  _onDocumentChange(change) {
    let doc = this.editorSession.getDocument();
    forEach(change.created, (node) => {
      node = doc.get(node.id);
      if (node.constructor.isResource) {
        setTimeout(() => {
          this.triggerFetch(node);
        });
      }
    });
  }

  
  _updateNode(nodeId, props) {
    let editorSession = this.editorSession;
    editorSession.transaction((tx) => {
      forEach(props, (val, key) => {
        tx.set([nodeId, key], val);
      });
    });
  }
}

class AnnotationComponent extends Component {

  
  didMount() {
    let node = this.props.node;
    node.on('highlighted', this.onHighlightedChanged, this);
  }

  
  dispose() {
    let node = this.props.node;
    node.off(this);
  }

  render($$) {
    let el = $$(this.getTagName())
      .attr("data-id", this.props.node.id)
      .addClass(this.getClassNames());
    if (this.props.node.highlighted) {
      el.addClass('sm-highlighted');
    }
    el.append(this.props.children);
    return el
  }

  getClassNames() {
    return 'sc-'+this.props.node.type
  }

  onHighlightedChanged() {
    if (this.props.node.highlighted) {
      this.el.addClass('sm-highlighted');
    } else {
      this.el.removeClass('sm-highlighted');
    }
  }

  getTagName() {
    return 'span'
  }

}

class AbstractIsolatedNodeComponent extends Component {

  constructor(...args) {
    super(...args);

    this.name = this.props.node.id;
    this._id = this.context.surface.id +'/'+this.name;
    this._state = {
      selectionFragment: null
    };

    this.handleAction('escape', this.escape);
    this.ContentClass = this._getContentClass(this.props.node);

    
    let useBlocker = platform.isFF || !this.ContentClass.noBlocker;
    this.blockingMode = useBlocker ? 'closed' : 'open';
  }

  getChildContext() {
    return {
      isolatedNodeComponent: this,
      
      
      surface: undefined
    }
  }

  getInitialState() {
    let selState = this.context.editorSession.getSelectionState();
    return this._deriveStateFromSelectionState(selState)
  }

  didMount() {
    super.didMount();

    let editorSession = this.context.editorSession;
    editorSession.onRender('selection', this._onSelectionChanged, this);
  }

  dispose() {
    super.dispose.call(this);

    let editorSession = this.context.editorSession;
    editorSession.off(this);
  }

  renderContent($$, node, options = {}) {
    let ComponentClass = this.ContentClass;
    if (!ComponentClass) {
      console.error('Could not resolve a component for type: ' + node.type);
      return $$(this.__elementTag)
    } else {
      let props = Object.assign({
        disabled: this.props.disabled,
        node: node,
        isolatedNodeState: this.state.mode,
        focused: (this.state.mode === 'focused')
      }, options);
      return $$(ComponentClass, props)
    }
  }

  getId() {
    return this._id
  }

  get id() { return this.getId() }

  getMode() {
    return this.state.mode
  }

  isOpen() {
    return this.blockingMode === 'open'
  }

  isClosed() {
    return this.blockingMode === 'closed'
  }

  isNotSelected() {
    return !this.state.mode
  }

  isSelected() {
    return this.state.mode === 'selected'
  }

  isCoSelected() {
    return this.state.mode === 'co-selected'
  }

  isFocused() {
    return this.state.mode === 'focused'
  }

  isCoFocused() {
    return this.state.mode === 'co-focused'
  }

  getParentSurface() {
    return this.context.surface
  }

  escape() {
    
    this.selectNode();
  }

  _onSelectionChanged() {
    let editorSession = this.context.editorSession;
    let newState = this._deriveStateFromSelectionState(editorSession.getSelectionState());
    if (!newState && this.state.mode) {
      this.extendState({ mode: null });
    } else if (newState && newState.mode !== this.state.mode) {
      this.extendState(newState);
    }
  }

  onKeydown(event) {
    
    
    
    
    if (event.keyCode === keys$1.ESCAPE && this.state.mode === 'focused') {
      event.stopPropagation();
      event.preventDefault();
      this.escape();
    }
  }

  _getContentClass(node) {
    let ComponentClass;
    
    ComponentClass = this.getComponent(node.type, true);
    
    if (!ComponentClass) {
      ComponentClass = Component;
    }
    return ComponentClass
  }

  _getSurface(selState) {
    let surface = selState.get('surface');
    if (surface === undefined) {
      let sel = selState.getSelection();
      if (sel && sel.surfaceId) {
        let surfaceManager = this.context.surfaceManager;
        surface = surfaceManager.getSurface(sel.surfaceId);
      } else {
        surface = null;
      }
      selState.set('surface', surface);
    }
    return surface
  }

  
  
  _getIsolatedNodes(selState) {
    let isolatedNodes = selState.get('isolatedNodes');
    if (!isolatedNodes) {
      let sel = selState.getSelection();
      isolatedNodes = [];
      if (sel && sel.surfaceId) {
        let surfaceManager = this.context.surfaceManager;
        let surface = surfaceManager.getSurface(sel.surfaceId);
        isolatedNodes = surface.getComponentPath().filter(comp => comp._isAbstractIsolatedNodeComponent);
      }
      selState.set('isolatedNodes', isolatedNodes);
    }
    return isolatedNodes
  }

  _shouldConsumeEvent(event) {
    let comp = Component.unwrap(event.target);
    let isolatedNodeComponent = this._getIsolatedNode(comp);
    return (isolatedNodeComponent === this)
  }

  _getIsolatedNode(comp) {
    if (comp._isAbstractIsolatedNodeComponent) {
      return this
    } else if (comp.context.isolatedNodeComponent) {
      return comp.context.isolatedNodeComponent
    } else if (comp.context.surface) {
      return comp.context.surface.context.isolatedNodeComponent
    }
  }

}

AbstractIsolatedNodeComponent.prototype._isAbstractIsolatedNodeComponent = true;

class InlineNodeComponent extends AbstractIsolatedNodeComponent {

  render($$) {
    const node = this.props.node;
    const ContentClass = this.ContentClass;
    const state = this.state;

    let el = $$('span');
    el.addClass(this.getClassNames())
      .addClass('sc-inline-node')
      .addClass('sm-'+this.props.node.type)
      .attr("data-id", node.id)
      .attr('data-inline', '1');

    let disabled = this.isDisabled();

    if (state.mode) {
      el.addClass('sm-'+state.mode);
    } else {
      el.addClass('sm-not-selected');
    }

    if (!ContentClass.noStyle) {
      el.addClass('sm-default-style');
    }

    
    
    
    el.on('keydown', this.onKeydown);

    el.append(
      this.renderContent($$, node)
        .ref('content')
        .addClass('se-content')
    );

    if (disabled) {
      el.addClass('sm-disabled')
         .attr('contenteditable', false)
         .on('click', this.onClick);
    }

    
    
    
    
    
    
    
    el.attr('draggable', true);

    return el

  }

  isDisabled() {
    return !this.state.mode || ['co-selected', 'cursor'].indexOf(this.state.mode) > -1;
  }

  getClassNames() {
    return ''
  }

  onClick(event) {
    if (!this._shouldConsumeEvent(event)) {
      return
    }
    this.selectNode();
  }

  selectNode() {
    
    let editorSession = this.context.editorSession;
    let surface = this.context.surface;
    let node = this.props.node;
    editorSession.setSelection({
      type: 'property',
      path: node.start.path,
      startOffset: node.start.offset,
      endOffset: node.end.offset,
      containerId: surface.getContainerId(),
      surfaceId: surface.id
    });
  }

  _getContentClass(node) {
    let ComponentClass;
    
    ComponentClass = this.getComponent(node.type, true);
    
    
    if (!ComponentClass) {
      ComponentClass = this.getComponent('unsupported-inline-node', true);
    }
    if (!ComponentClass) {
      console.error(`No component registered for inline node '${node.type}'.`);
      ComponentClass = StubInlineNodeComponent;
    }
    return ComponentClass
  }

  
  
  _deriveStateFromSelectionState(selState) {
    let surface = this._getSurface(selState);
    if (!surface) return null
    
    if (surface === this.context.surface) {
      let sel = selState.getSelection();
      let node = this.props.node;
      if (sel.isPropertySelection() && !sel.isCollapsed() && isEqual(sel.start.path, node.start.path)) {
        let nodeSel = node.getSelection();
        if(nodeSel.equals(sel)) {
          return { mode: 'selected' }
        }
        if (sel.contains(nodeSel)) {
          return { mode: 'co-selected' }
        }
      }
    }
    let isolatedNodeComponent = surface.context.isolatedNodeComponent;
    if (!isolatedNodeComponent) return null
    if (isolatedNodeComponent === this) {
      return { mode: 'focused' }
    }
    let isolatedNodes = this._getIsolatedNodes(selState);
    if (isolatedNodes.indexOf(this) > -1) {
      return { mode: 'co-focused' }
    }
    return null
  }

}

InlineNodeComponent.prototype._isInlineNodeComponent = true;

class StubInlineNodeComponent extends Component {
  render($$) {
    const node = this.props.node;
    return $$('span').text('???').attr('data-id', node.id).attr('data-type', node.type)
  }
}

class AnnotatedTextComponent extends Component {

  render($$) {
    let el = this._renderContent($$)
      .addClass('sc-annotated-text')
      .css({ whiteSpace: "pre-wrap" });
    return el
  }

  getPath() {
    return this.props.path
  }

  getText() {
    return this.getDocument().get(this.props.path) || ''
  }

  isEmpty() {
    return !(this.getText())
  }

  getAnnotations() {
    return this.getDocument().getIndex('annotations').get(this.props.path)
  }

  getDocument() {
    return this.props.doc || this.context.doc
  }

  _getTagName() {
    return this.props.tagName
  }

  _onDocumentChange(update) {
    if (update.change && update.change.updated[this.getPath()]) {
      this.rerender();
    }
  }

  _renderContent($$) {
    let text = this.getText();
    let annotations = this.getAnnotations();
    let el = $$(this._getTagName() || 'span');
    if (annotations && annotations.length > 0) {
      let fragmenter = new Fragmenter({
        onText: this._renderTextNode.bind(this),
        onEnter: this._renderFragment.bind(this, $$),
        onExit: this._finishFragment.bind(this)
      });
      fragmenter.start(el, text, annotations);
    } else {
      el.append(text);
    }
    return el
  }

  _renderTextNode(context, text) {
    if (text && text.length > 0) {
      context.append(text);
    }
  }

  _renderFragment($$, fragment) {
    let doc = this.getDocument();
    let componentRegistry = this.getComponentRegistry();
    let node = fragment.node;
    
    if (node.type === "container-annotation-fragment") {
      
      
      
    } else if (node.type === "container-annotation-anchor") {
      
      
      
      
    } else {
      let ComponentClass = componentRegistry.get(node.type) || AnnotationComponent;
      if (node.constructor.isInline &&
          
          !ComponentClass.prototype._isInlineNodeComponent &&
          
          !ComponentClass.isCustom) {
        ComponentClass = InlineNodeComponent;
      }
      let el = $$(ComponentClass, { doc: doc, node: node });
      return el
    }
  }

  _finishFragment(fragment, context, parentContext) {
    parentContext.append(context);
  }

}

class CursorComponent extends Component {

  render($$) {
    
    let el = $$('span').addClass('se-cursor');
    
    
    
    el.append("\uFEFF");
    el.append($$('div').addClass('se-cursor-inner'));

    if (this.props.collaborator) {
      let collaboratorIndex = this.props.collaborator.colorIndex;
      el.addClass('sm-collaborator-'+collaboratorIndex);
    } else {
      el.addClass('sm-local-user');
    }

    return el
  }

}

class SelectionFragmentComponent extends Component {

  render($$) {
    
    let el = $$('span').addClass('se-selection-fragment');
    if (this.props.collaborator) {
      let collaboratorIndex = this.props.collaborator.colorIndex;
      el.addClass('sm-collaborator-'+collaboratorIndex);
    } else {
      el.addClass('sm-local-user');
    }
    el.append(this.props.children);
    return el
  }

}

class TextPropertyComponent extends AnnotatedTextComponent {

  getInitialState() {
    const markersManager = this.context.markersManager;
    let path = this.getPath();
    let markers;
    if (markersManager) {
      
      markersManager.register(this);
      markers = markersManager.getMarkers(path, {
        surfaceId: this.getSurfaceId(),
        containerId: this.getContainerId()
      });
    } else {
      const doc = this.getDocument();
      markers = doc.getAnnotations(path);
    }
    return {
      markers: markers
    }
  }

  didMount() {
    if (this.context.surface && this.context.surface.hasNativeSpellcheck()) {
      this.domObserver = new window.MutationObserver(this._onDomMutations.bind(this));
      this.domObserver.observe(this.el.getNativeElement(), { subtree: true, characterData: true, characterDataOldValue: true });
    }
  }

  dispose() {
    if (this.context.markersManager) {
      this.context.markersManager.deregister(this);
    }
  }

  render($$) {
    let path = this.getPath();



    let el = this._renderContent($$)
      .addClass('sc-text-property')
      .attr({
        'data-path': path.join('.')
      })
      .css({
        'white-space': 'pre-wrap'
      });

    if (this.isEmpty()) {
      el.addClass('sm-empty');
      if (this.props.placeholder) {
        el.append(
          $$('span').addClass('se-placeholder').append(
            this.props.placeholder
          )
        );
      }
    }

    if (!this.props.withoutBreak) {
      el.append($$('br'));
    }

    return el
  }

  getAnnotations() {
    if (this.props.markers) {
      return this.state.markers.concat(this.props.markers)
    } else {
      return this.state.markers
    }
  }

  _renderFragment($$, fragment) {
    let node = fragment.node;
    let id = node.id;
    let el;
    if (node.type === 'cursor') {
      el = $$(CursorComponent, { collaborator: node.collaborator });
    } else if (node.type === 'selection-fragment') {
      el = $$(SelectionFragmentComponent, { collaborator: node.collaborator });
    } else {
      el = super._renderFragment.apply(this, arguments);
      if (id) {
        el.ref(id + '@' + fragment.counter);
      }
    }
    el.attr('data-offset', fragment.pos);
    return el
  }

  _onDomMutations(mutations) {
    
    if (mutations.length === 2 && mutations[0].target === mutations[1].target) {
      let textEl = DefaultDOMElement.unwrap(mutations[0].target);
      if (textEl) {
        this._applyTextMutation(textEl, mutations[0].oldValue);
        return
      }
    }
    
    this.rerender();
  }

  _applyTextMutation(textEl, oldText) {
    
    let offset = _getCharPos(textEl, 0);
    let newText = textEl.textContent;
    let changes = diff(oldText, newText, offset);

    let editorSession = this.context.editorSession;
    let path = this.getPath();
    editorSession.transaction(function(tx) {
      changes.forEach(function(change) {
        
        if (change.type === 'replace') {
          tx.update(path, { type: 'delete', start: change.start, end: change.end });
          tx.update(path, { type: 'insert', start: change.start, text: change.text });
        } else {
          tx.update(path, change);
        }
      });
    });
  }

  getSurface() {
    return this.props.surface || this.context.surface
  }

  getSurfaceId() {
    let surface = this.getSurface();
    return surface ? surface.id : null
  }

  getContainerId() {
    let surface = this.getSurface();
    return surface ? surface.getContainerId() : null
  }

  isEditable() {
    return this.getSurface().isEditable()
  }

  isReadonly() {
    return this.getSurface().isReadonly()
  }

  getDOMCoordinate(charPos) {
    return this._getDOMCoordinate(this.el, charPos)
  }


  _finishFragment(fragment, context, parentContext) {
    context.attr('data-length', fragment.length);
    parentContext.append(context);
  }

  _getDOMCoordinate(el, charPos) {
    let l;
    let idx = 0;
    if (charPos === 0) {
      return {
        container: el.getNativeElement(),
        offset: 0
      }
    }
    for (let child = el.getFirstChild(); child; child = child.getNextSibling(), idx++) {
      if (child.isTextNode()) {
        l = child.textContent.length;
        if (l >= charPos) {
          return {
            container: child.getNativeElement(),
            offset: charPos
          }
        } else {
          charPos -= l;
        }
      } else if (child.isElementNode()) {
        let length = child.getAttribute('data-length');
        if (length) {
          l = parseInt(length, 10);
          if (l >= charPos) {
            
            if (child.attr('data-inline')) {
              let nextSibling = child.getNextSibling();
              if (nextSibling && nextSibling.isTextNode()) {
                return {
                  container: nextSibling.getNativeElement(),
                  offset: 0
                }
              } else {
                return {
                  container: el.getNativeElement(),
                  offset: el.getChildIndex(child) + 1
                }
              }
            }
            return this._getDOMCoordinate(child, charPos, idx)
          } else {
            charPos -= l;
          }
        } else {
          console.error('FIXME: Can not map to DOM coordinates.');
          return null
        }
      }
    }
  }

}

TextPropertyComponent.prototype._isTextPropertyComponent = true;





TextPropertyComponent.getCoordinate = function(root, el, offset) {
  let context = _getPropertyContext(root, el, offset);
  if (!context) {
    return null
  }
  
  
  let charPos;
  if (el.parentNode && el.parentNode.is('.se-placeholder')) {
    charPos = 0;
  } else {
    
    
    
    charPos = _getCharPos(context.node, context.offset);
  }
  if (isNumber(charPos)) {
    let coor = new Coordinate(context.path, charPos);
    coor._comp = context.comp;
    return coor
  } else {
    return null
  }
};

function _getPropertyContext(root, node, offset) {
  let result = {
    comp: null,
    el: null,
    path: null,
    node: node,
    offset: offset
  };
  while (node && node !== root) {
    if (node.isElementNode()) {
      let comp = Component.unwrap(node);
      if (comp && comp._isTextPropertyComponent) {
        result.comp = comp;
        result.el = node;
        result.path = comp.getPath();
        return result;
      }
      
      
      
      if (node.getAttribute('data-inline')) {
        result.node = node;
        if (offset > 0) {
          result.offset = 1;
        }
      }
    }
    node = node.getParent();
  }
  return null
}

function _getCharPos(node, offset) {
  let charPos = offset;
  let parent, childIdx;

  

  parent = node.getParent();
  if (node.isTextNode()) {
    
    if (node === parent.firstChild) {
      
      let parentPath = parent.getAttribute('data-path');
      let parentOffset = parent.getAttribute('data-offset');
      if (parentPath) {
        charPos = offset;
      }
      
      else if (parentOffset) {
        charPos = parseInt(parentOffset, 10) + offset;
      }
      
      else {
        charPos = _getCharPos(parent, 0) + offset;
      }
    } else {
      
      childIdx = parent.getChildIndex(node);
      charPos = _getCharPos(parent, childIdx) + offset;
    }
  } else if (node.isElementNode()) {
    let pathStr = node.getAttribute('data-path');
    let offsetStr = node.getAttribute('data-offset');
    
    
    if (pathStr) {
      charPos = _countCharacters(node, offset);
    }
    
    
    else if (offsetStr) {
      childIdx = parent.getChildIndex(node);
      charPos = parseInt(offsetStr, 10) + _countCharacters(node, offset);
    }
    
    
    else {
      childIdx = parent.getChildIndex(node);
      charPos = _getCharPos(parent, childIdx) + _countCharacters(node, offset);
    }
  } else {
    
    return null
  }
  return charPos;
}

function _countCharacters(el, maxIdx) {
  let charPos = 0;
  
  if (el.getAttribute('data-inline')) {
    return maxIdx === 0 ? 0 : 1;
  }
  let l = el.getChildCount();
  if (arguments.length === 1) {
    maxIdx = l;
  }
  maxIdx = Math.min(l, maxIdx);
  for (let i=0, child = el.getFirstChild(); i < maxIdx; child = child.getNextSibling(), i++) {
    if (child.isTextNode()) {
      charPos += child.getTextContent().length;
    } else if (child.isElementNode()) {
      let length = child.getAttribute('data-length');
      if (child.getAttribute('data-inline')) {
        charPos += 1;
      } else if (length) {
        charPos += parseInt(length, 10);
      } else {
        charPos += _countCharacters(child);
      }
    }
  }
  return charPos
}

const BRACKET = 'X';


class IsolatedNodeComponent extends AbstractIsolatedNodeComponent {

  constructor(...args) {
    super(...args);
  }

  render($$) {
    let node = this.props.node;
    let ContentClass = this.ContentClass;
    let disabled = this.props.disabled;

    
    let el = $$('div');
    el.addClass(this.getClassNames())
      .addClass('sc-isolated-node')
      .addClass('sm-'+this.props.node.type)
      .attr("data-id", node.id);
    if (disabled) {
      el.addClass('sm-disabled');
    }
    if (this.state.mode) {
      el.addClass('sm-'+this.state.mode);
    }
    if (!ContentClass.noStyle) {
      el.addClass('sm-default-style');
    }
    
    el.on('keydown', this.onKeydown);

    
    let shouldRenderBlocker = (
      this.blockingMode === 'closed' &&
      !this.state.unblocked
    );

    
    
    el.append(
      $$('div').addClass('se-bracket sm-left').ref('left')
        .append(BRACKET)
    );

    let content = this.renderContent($$, node, {
      disabled: this.props.disabled || shouldRenderBlocker
    }).ref('content');
    content.attr('contenteditable', false);

    el.append(content);
    el.append($$(Blocker).ref('blocker'));
    el.append(
      $$('div').addClass('se-bracket sm-right').ref('right')
        .append(BRACKET)
    );

    if (!shouldRenderBlocker) {
      el.addClass('sm-no-blocker');
      el.on('click', this.onClick)
        .on('dblclick', this.onDblClick);
    }
    el.on('mousedown', this._reserveMousedown, this);

    return el
  }

  getClassNames() {
    return ''
  }

  getContent() {
    return this.refs.content
  }

  selectNode() {
    
    let editorSession = this.context.editorSession;
    let surface = this.context.surface;
    let nodeId = this.props.node.id;
    editorSession.setSelection({
      type: 'node',
      nodeId: nodeId,
      containerId: surface.getContainerId(),
      surfaceId: surface.id
    });
  }

  
  
  onClick(event) {
    
    event.stopPropagation();
  }

  onDblClick(event) {
    
    event.stopPropagation();
  }

  grabFocus(event) {
    let content = this.refs.content;
    if (content.grabFocus) {
      content.grabFocus(event);
      return true
    }
  }

  
  
  _reserveMousedown(event) {
    if (event.__reserved__) {
      
      return
    } else {
      
      event.__reserved__ = this;
    }
  }

  _deriveStateFromSelectionState(selState) {
    let surface = this._getSurface(selState);
    let newState = { mode: null, unblocked: null};
    if (!surface) return newState
    
    if (surface === this.context.surface) {
      let sel = selState.getSelection();
      let nodeId = this.props.node.id;
      if (sel.isNodeSelection() && sel.getNodeId() === nodeId) {
        if (sel.isFull()) {
          newState.mode = 'selected';
          newState.unblocked = true;
        } else if (sel.isBefore()) {
          newState.mode = 'cursor';
          newState.position = 'before';
        } else if (sel.isAfter()) {
          newState.mode = 'cursor';
          newState.position = 'after';
        }
      }
      if (sel.isContainerSelection() && sel.containsNode(nodeId)) {
        newState.mode = 'co-selected';
      }
    } else {
      let isolatedNodeComponent = surface.context.isolatedNodeComponent;
      if (isolatedNodeComponent) {
        if (isolatedNodeComponent === this) {
          newState.mode = 'focused';
          newState.unblocked = true;
        } else {
          let isolatedNodes = this._getIsolatedNodes(selState);
          if (isolatedNodes.indexOf(this) > -1) {
            newState.mode = 'co-focused';
            newState.unblocked = true;
          }
        }
      }
    }
    return newState
  }

}

IsolatedNodeComponent.prototype._isIsolatedNodeComponent = true;

IsolatedNodeComponent.prototype._isDisabled = IsolatedNodeComponent.prototype.isDisabled;

IsolatedNodeComponent.getDOMCoordinate = function(comp, coor) {
  let { start, end } = IsolatedNodeComponent.getDOMCoordinates(comp);
  if (coor.offset === 0) return start
  else return end
};

IsolatedNodeComponent.getDOMCoordinates = function(comp) {
  const left = comp.refs.left;
  const right = comp.refs.right;
  return {
    start: {
      container: left.getNativeElement(),
      offset: 0
    },
    end: {
      container: right.getNativeElement(),
      offset: right.getChildCount()
    }
  }
};

IsolatedNodeComponent.getCoordinate = function(nodeEl, options) {
  let comp = Component.unwrap(nodeEl, 'strict').context.isolatedNodeComponent;
  let offset = null;
  if (options.direction === 'left' || nodeEl === comp.refs.left.el) {
    offset = 0;
  } else if (options.direction === 'right' || nodeEl === comp.refs.right.el) {
    offset = 1;
  }
  let coor;
  if (offset !== null) {
    coor = new Coordinate([comp.props.node.id], offset);
    coor._comp = comp;
  }
  return coor
};

class Blocker extends Component {

  render($$) {
    return $$('div').addClass('sc-isolated-node-blocker')
      .attr('draggable', true)
      .attr('contenteditable', false)
      .on('click', this.onClick)
      .on('dblclick', this.onDblClick)
  }

  onClick(event) {
    if (event.target !== this.getNativeElement()) return
    
    event.stopPropagation();
    const comp = this._getIsolatedNodeComponent();
    comp.extendState({ mode: 'selected', unblocked: true });
    comp.selectNode();
  }

  onDblClick(event) {
    
    event.stopPropagation();
  }

  _getIsolatedNodeComponent() {
    return this.context.isolatedNodeComponent
  }

}

const DEBUG$1 = false;


class DOMSelection {

  constructor(editor) {
    this.editor = editor;
    if (platform.inBrowser) {
      this.wRange = window.document.createRange();
    }
    
    
    this.state = { dom: null, model: null };
  }

  
  getSelection(options) {
    
    if (!platform.inBrowser) return
    let range = this.mapDOMSelection(options);
    let doc = this.editor.getDocument();
    
    return doc._createSelectionFromRange(range)
  }

  getSelectionForDOMRange(wrange) {
    let range = this.mapDOMRange(wrange);
    let doc = this.editor.getDocument();
    return doc._createSelectionFromRange(range)
  }

  
  mapDOMSelection(options) {
    let wSel = window.getSelection();
    let state = this.state;
    let range;
    
    
    if (DEBUG$1) console.info('DOM->Model: ', wSel.anchorNode, wSel.anchorOffset, wSel.focusNode, wSel.focusOffset);
    if (wSel.rangeCount === 0) return _null()
    let anchorNode = DefaultDOMElement.wrapNativeElement(wSel.anchorNode);
    if (wSel.isCollapsed) {
      let coor = this._getCoordinate(anchorNode, wSel.anchorOffset, options);
      if (!coor) return _null()
      range = _createRange({
        start: coor,
        end: coor
      });
    }
    else {
      let focusNode = DefaultDOMElement.wrapNativeElement(wSel.focusNode);
      range = this._getRange(anchorNode, wSel.anchorOffset, focusNode, wSel.focusOffset, options);
    }
    if (DEBUG$1) console.info('DOM->Model: range ', range ? range.toString() : null);
    state.model = range;
    return range

    function _null() {
      state.dom = null;
      state.model = null;
      return null
    }
  }

  
  setSelection(sel) {
    
    if (!platform.inBrowser) return
    let state = this.state;
    let wSel = window.getSelection();
    let wRange = this.wRange;
    if (!sel || sel.isNull()) return this.clear()
    
    let {start, end} = this.mapModelToDOMCoordinates(sel);
    if (!start) return this.clear()
    if (sel.isReverse()) {
      [start, end] = [end, start];
    }
    state.dom = {
      anchorNode: start.container,
      anchorOffset: start.offset,
      focusNode: end.container,
      focusOffset: end.offset
    };
    _set(state.dom);

    function _set({anchorNode, anchorOffset, focusNode, focusOffset}) {
      wSel.removeAllRanges();
      wRange.setStart(anchorNode, anchorOffset);
      wRange.setEnd(anchorNode, anchorOffset);
      wSel.addRange(wRange);
      if (focusNode !== anchorOffset || focusOffset !== anchorOffset) {
        wSel.extend(focusNode, focusOffset);
      }
    }
  }

  mapModelToDOMCoordinates(sel) {
    if (DEBUG$1) console.info('Model->DOM: sel =', sel.toString());
    let rootEl;
    let surface = this.editor.surfaceManager.getSurface(sel.surfaceId);
    if (!surface) {
      console.warn('Selection should have "surfaceId" set.');
      rootEl = this.editor.el;
    } else {
      rootEl = surface.el;
    }
    if (sel.isNull() || sel.isCustomSelection()) {
      return {}
    }

    let start, end;
    if (sel.isPropertySelection() || sel.isContainerSelection()) {
      start = this._getDOMCoordinate(rootEl, sel.start);
      if (!start) {
        console.warn('FIXME: selection seems to be invalid.');
        return {}
      }
      if (sel.isCollapsed()) {
        end = start;
      } else {
        end = this._getDOMCoordinate(rootEl, sel.end);
        if (!end) {
          console.warn('FIXME: selection seems to be invalid.');
          return {}
        }
      }
    } else if (sel.isNodeSelection()) {
      let comp = Component.unwrap(rootEl.find('*[data-id="'+sel.getNodeId()+'"]'));
      if (!comp) {
        console.error('Could not find component with id', sel.getNodeId());
        return {}
      }
      if (comp._isIsolatedNodeComponent) {
        let coors = IsolatedNodeComponent.getDOMCoordinates(comp, sel);
        start = coors.start;
        end = coors.end;
        
        
        
      } else {
        let _nodeEl = comp.el;
        start = {
          container: _nodeEl.getNativeElement(),
          offset: 0
        };
        end = {
          container: _nodeEl.getNativeElement(),
          offset: _nodeEl.getChildCount()
        };
      }
    }
    if (DEBUG$1) console.info('Model->DOM:', start.container, start.offset, end.container, end.offset, 'isReverse?', sel.isReverse());
    return {start,end}
  }

  _getDOMCoordinate(rootEl, coor) {
    let comp, domCoor = null;
    if (coor.isNodeCoordinate()) {
      comp = Component.unwrap(rootEl.find('*[data-id="'+coor.getNodeId()+'"]'));
      if (comp) {
        if (comp._isIsolatedNodeComponent) {
          domCoor = IsolatedNodeComponent.getDOMCoordinate(comp, coor);
        } else {
          let domOffset = 0;
          if (coor.offset > 0) {
            domOffset = comp.getChildCount();
          }
          domCoor = {
            container: comp.getNativeElement(),
            offset: domOffset
          };
        }
      }
    } else {
      comp = Component.unwrap(rootEl.find('.sc-text-property[data-path="'+coor.path.join('.')+'"]'));
      if (comp) {
        domCoor = comp.getDOMCoordinate(coor.offset);
      }
    }
    return domCoor
  }

  
  mapDOMRange(wRange, options) {
    return this._getRange(
      DefaultDOMElement.wrapNativeElement(wRange.startContainer),
      wRange.startOffset,
      DefaultDOMElement.wrapNativeElement(wRange.endContainer),
      wRange.endOffset, options)
  }

  
  clear() {
    window.getSelection().removeAllRanges();
    this.state.dom = null;
    this.state.model = null;
  }

  collapse(dir) {
    let wSel = window.getSelection();
    let wRange;
    if (wSel.rangeCount > 0) {
      wRange = wSel.getRangeAt(0);
      wRange.collapse(dir === 'left');
      wSel.removeAllRanges();
      wSel.addRange(wRange);
    }
  }

  select(el) {
    let wSel = window.getSelection();
    let wRange = window.document.createRange();
    wRange.selectNode(el.getNativeElement());
    wSel.removeAllRanges();
    wSel.addRange(wRange);
  }

  extend(el, offset) {
    let wSel = window.getSelection();
    wSel.extend(el.getNativeElement(), offset);
  }

  setCursor(el, offset) {
    let wSel = window.getSelection();
    let wRange = window.document.createRange();
    wRange.setStart(el.getNativeElement(), offset);
    wSel.removeAllRanges();
    wSel.addRange(wRange);
  }

  
  _getRange(anchorNode, anchorOffset, focusNode, focusOffset, options = {}) {
    let isReverse = DefaultDOMElement.isReverse(anchorNode, anchorOffset, focusNode, focusOffset);
    let isCollapsed = (anchorNode === focusNode && anchorOffset === focusOffset);
    let start, end;
    if (isCollapsed) {
      start = end = this._getCoordinate(anchorNode, anchorOffset, options);
    } else {
      start = this._getCoordinate(anchorNode, anchorOffset, { direction: isReverse ? 'right' : 'left' });
      end = this._getCoordinate(focusNode, focusOffset, options);
    }
    if (start && end) {
      return _createRange({ start, end, isReverse })
    } else {
      return null
    }
  }

  
  _getCoordinate(nodeEl, offset, options={}) {
    let coor = null;
    
    if (!coor) {
      coor = TextPropertyComponent.getCoordinate(this.editor.el, nodeEl, offset);
    }
    let comp = Component.unwrap(nodeEl);
    if (!coor && comp) {
      
      if (comp.context.isolatedNodeComponent) {
        coor = IsolatedNodeComponent.getCoordinate(nodeEl, options);
      }
    }
    
    
    if (!coor) {
      
      if (comp && comp._isContainerEditor) {
        let childIdx = (offset === 0) ? 0 : offset-1;
        let isBefore = (offset === 0);
        let container = comp.getContainer();
        let childNode = container.getNodeAt(childIdx);
        let childComp = comp.getChildAt(childIdx);
        coor = new Coordinate([childNode.id], isBefore?0:1 );
        coor._comp = childComp;
      }
      
      else if (nodeEl.isElementNode() && nodeEl.getChildCount() > 0) {
        let child = (offset > 0) ? nodeEl.getChildAt(offset-1) : nodeEl.firstChild;
        let prop;
        let childComp = Component.unwrap(child);
        if (childComp && childComp._isTextPropertyComponent) {
          prop = child;
        }
        
        if (prop) {
          coor = TextPropertyComponent.getCoordinate(nodeEl, prop, (offset > 0) ? prop.getChildCount() : 0);
        }
      }
    }
    return coor
  }

}


function _createRange({start, end, isReverse}) {
  if (isReverse) {
    [start, end] = [end, start];
  }
  if (!start._comp || !end._comp) {
    console.error('FIXME: getCoordinate() should provide a component instance');
    return null
  }
  let surface = start._comp.context.surface;
  if (!surface) {
    console.error('FIXME: Editable components should have their surface in the context');
    return null
  }
  if (surface !== end._comp.context.surface) {
    console.error('Coordinates are within two different surfaces. Can not create a selection.');
    return null
  }
  return new Range(start, end, isReverse, surface.getContainerId(), surface.id)
}

class AbstractEditor extends Component {

  constructor(...args) {
    super(...args);
    this._initialize(this.props);
  }

  didMount() {
    
    this.getEditorSession().attachEditor(this);
  }

  dispose() {
    this._dispose();
  }

  _initialize(props) {
    if (!props.editorSession) {
      throw new Error('EditorSession instance required');
    }
    this.editorSession = props.editorSession;
    this.doc = this.editorSession.getDocument();

    let configurator = this.editorSession.getConfigurator();
    this.componentRegistry = configurator.getComponentRegistry();
    this.commandGroups = configurator.getCommandGroups();
    this.keyboardShortcuts = configurator.getKeyboardShortcutsByCommand();
    this.tools = configurator.getTools();
    this.labelProvider = configurator.getLabelProvider();
    this.iconProvider = configurator.getIconProvider();

    
    this.surfaceManager = this.editorSession.surfaceManager;
    this.commandManager = this.editorSession.commandManager;
    this.dragManager = this.editorSession.dragManager;
    this.macroManager = this.editorSession.macroManager;
    this.converterRegistry = this.editorSession.converterRegistry;
    this.globalEventHandler = this.editorSession.globalEventHandler;
    this.editingBehavior = this.editorSession.editingBehavior;
    this.markersManager = this.editorSession.markersManager;

    this.resourceManager = new ResourceManager(this.editorSession, this.getChildContext());
    this.domSelection = new DOMSelection(this);

    if (platform.inBrowser) {
      this.documentEl = DefaultDOMElement.wrapNativeElement(document);
      this.documentEl.on('keydown', this.onKeyDown, this);
    }
  }

  willReceiveProps(nextProps) {
    let newSession = nextProps.editorSession;
    let shouldDispose = newSession && newSession !== this.editorSession;
    if (shouldDispose) {
      this._dispose();
      this._initialize(nextProps);
    }
  }

  _dispose() {
    this.getEditorSession().detachEditor(this);
    
    
    this.empty();
    
    
    this.resourceManager.dispose();
    if (platform.inBrowser) {
      this.documentEl.off(this);
    }
  }

  getChildContext() {
    return {
      editor: this,
      editorSession: this.editorSession,
      doc: this.doc, 
      document: this.doc,
      componentRegistry: this.componentRegistry,
      surfaceManager: this.surfaceManager,
      domSelection: this.domSelection,
      commandManager: this.commandManager,
      markersManager: this.markersManager,
      converterRegistry: this.converterRegistry,
      dragManager: this.dragManager,
      editingBehavior: this.editingBehavior,
      globalEventHandler: this.globalEventHandler,
      iconProvider: this.iconProvider,
      labelProvider: this.labelProvider,
      resourceManager: this.resourceManager,
      commandGroups: this.commandGroups,
      tools: this.tools,
      keyboardShortcuts: this.keyboardShortcuts
    }
  }

  
  onKeyDown(event) {
    
    if ( event.key === 'Dead' ) return
    
    let custom = this.editorSession.keyboardManager.onKeydown(event);
    return custom
  }

  getDocument() {
    return this.editorSession.getDocument()
  }

  getConfigurator() {
    return this.editorSession.getConfigurator()
  }

  getEditorSession() {
    return this.editorSession
  }

  getComponentRegistry() {
    return this.componentRegistry
  }
}

class AbstractScrollPane$$1 extends Component {

  
  getChildContext() {
    return {
      scrollPane: this
    }
  }

  didMount() {
    if (platform.inBrowser) {
      this.windowEl = DefaultDOMElement.wrapNativeElement(window);
      this.windowEl.on('resize', this.onSelectionPositioned, this);
    }
  }

  dispose() {
    if (this.windowEl) {
      this.windowEl.off(this);
    }
  }

  getName() {
    return this.props.name
  }

  
  onSelectionPositioned() {
    let contentRect = this._getContentRect();
    let selectionRect = this._getSelectionRect();
    if (!selectionRect) return
    let hints = {
      contentRect,
      selectionRect
    };
    this._emitSelectionPositioned(hints);
    this._scrollSelectionIntoView(selectionRect);
  }

  _emitSelectionPositioned(hints) {
    
    
    this.emit('selection:positioned', hints);
    
    this.emit('dom-selection:rendered', hints);
  }

  
  _onContextMenu(e) {
    e.preventDefault();
    let mouseBounds = this._getMouseBounds(e);
    this.emit('context-menu:opened', {
      mouseBounds: mouseBounds
    });
  }

  _scrollSelectionIntoView(selectionRect) {
    let upperBound = this.getScrollPosition();
    let lowerBound = upperBound + this.getHeight();
    let selTop = selectionRect.top;
    let selBottom = selectionRect.top + selectionRect.height;
    if ((selTop < upperBound && selBottom < upperBound) ||
        (selTop > lowerBound && selBottom > lowerBound)) {
      this.setScrollPosition(selTop);
    }
  }

  
  getHeight() {
    throw new Error('Abstract method')
  }

  
  getContentHeight() {
    throw new Error('Abstract method')
  }

  getContentElement() {
    
    throw new Error('Abstract method')
  }

  
  getScrollableElement() {
    throw new Error('Abstract method')
  }

  
  getScrollPosition() {
    throw new Error('Abstract method')
  }

  setScrollPosition() {
    throw new Error('Abstract method')
  }

  
  getPanelOffsetForElement(el) { 
    throw new Error('Abstract method')
  }

  
  scrollTo(componentId, onlyIfNotVisible) { 
    throw new Error('Abstract method')
  }

  _getContentRect() {
    return this.getContentElement().getNativeElement().getBoundingClientRect()
  }

  
  _getSelectionRect() {
    return getSelectionRect(this._getContentRect())
  }

  _getMouseBounds(e) {
    return getRelativeMouseBounds(e, this.getContentElement().getNativeElement())
  }

}

class Command {

  
  constructor(config) {
    this.config = config || {};
    this.name = this.config.name;
    if (!this.name) {
      throw new Error("'name' is required");
    }
  }

  get isAsync() {
    return false
  }

  
  getName() {
    return this.name
  }

  
  getCommandState(params, context) { 
    throw new Error('Command.getCommandState() is abstract.')
  }

  
  execute(params, context) { 
    throw new Error('Command.execute() is abstract.')
  }

  
  isAnnotationCommand() {
    return false
  }

  
  isInsertCommand() {
    return false
  }

  
  isSwitchTypeCommand() {
    return false
  }

  _getEditorSession(params, context) {
    let editorSession = params.editorSession || context.editorSession;
    if (!editorSession) {
      throw new Error("'editorSession' is required.")
    }
    return editorSession
  }

  _getSelection(params) {
    let sel = params.selection || params.selectionState.getSelection();
    if (!sel) {
      throw new Error("'selection' is required.")
    }
    return sel
  }

}

Command.prototype._isCommand = true;

class AnnotationCommand extends Command {

  constructor(...args) {
    super(...args);

    if (!this.config.nodeType) {
      throw new Error("'nodeType' is required")
    }
  }

  
  getAnnotationType() {
    return this.config.nodeType
  }

  getType() {
    return this.getAnnotationType()
  }

  
  getAnnotationData() {
    return {}
  }

  
  isDisabled(sel, params) {
    let selectionState = params.selectionState;
    let isBlurred = params.editorSession.isBlurred();
    
    
    if (isBlurred || !sel || sel.isNull() || !sel.isAttached() || sel.isCustomSelection()||
        sel.isNodeSelection() || sel.isContainerSelection() || selectionState.isInlineNodeSelection()) {
      return true
    }
    return false
  }

  
  showInContext(sel) {
    return !sel.isCollapsed()
  }

  
  
  canCreate(annos, sel) {
    return (annos.length === 0 && !sel.isCollapsed())
  }

  
  canFuse(annos, sel) {
    
    return (annos.length >= 2 && !sel.isCollapsed())
  }

  
  canDelete(annos, sel) {
    
    if (annos.length !== 1) return false
    let annoSel = annos[0].getSelection();
    return sel.isInsideOf(annoSel)
  }

  
  canExpand(annos, sel) {
    
    if (annos.length !== 1) return false
    let annoSel = annos[0].getSelection();
    return sel.overlaps(annoSel) && !sel.isInsideOf(annoSel)
  }

  
  canTruncate(annos, sel) {
    if (annos.length !== 1) return false
    let annoSel = annos[0].getSelection();

    return (sel.isLeftAlignedWith(annoSel) || sel.isRightAlignedWith(annoSel)) &&
           !sel.contains(annoSel) &&
           !sel.isCollapsed()
  }

  
  getCommandState(params) { 
    let sel = this._getSelection(params);
    
    
    
    if (this.isDisabled(sel, params)) {
      return {
        disabled: true
      }
    }
    let annos = this._getAnnotationsForSelection(params);
    let newState = {
      disabled: false,
      active: false,
      mode: null
    };
    if (this.canCreate(annos, sel)) {
      newState.mode = 'create';
    } else if (this.canFuse(annos, sel)) {
      newState.mode = 'fuse';
    } else if (this.canTruncate(annos, sel)) {
      newState.active = true;
      newState.mode = 'truncate';
    } else if (this.canExpand(annos, sel)) {
      newState.mode = 'expand';
    } else if (this.canDelete(annos, sel)) {
      newState.active = true;
      newState.mode = 'delete';
    } else {
      newState.disabled = true;
    }
    newState.showInContext = this.showInContext(sel, params);
    return newState
  }

  
  
  execute(params) {
    
    
    
    let commandState = params.commandState;

    if (commandState.disabled) return false
    switch(commandState.mode) {
      case 'create':
        return this.executeCreate(params)
      case 'fuse':
        return this.executeFuse(params)
      case 'truncate':
        return this.executeTruncate(params)
      case 'expand':
        return this.executeExpand(params)
      case 'delete':
        return this.executeDelete(params)
      default:
        console.warn('Command.execute(): unknown mode', commandState.mode);
        return false
    }
  }

  executeCreate(params) {
    let annos = this._getAnnotationsForSelection(params);
    this._checkPrecondition(params, annos, this.canCreate);
    let editorSession = this._getEditorSession(params);
    let annoData = this.getAnnotationData();
    annoData.type = this.getAnnotationType();
    let anno;
    editorSession.transaction((tx) => {
      anno = tx.annotate(annoData);
    });
    return {
      mode: 'create',
      anno: anno
    }
  }

  executeFuse(params) {
    let annos = this._getAnnotationsForSelection(params);
    this._checkPrecondition(params, annos, this.canFuse);
    this._applyTransform(params, function(tx) {
      annotationHelpers.fuseAnnotation(tx, annos);
    });
    return {
      mode: 'fuse',
      anno: annos[0]
    }
  }

  executeTruncate(params) {
    let annos = this._getAnnotationsForSelection(params);
    let anno = annos[0];
    this._checkPrecondition(params, annos, this.canTruncate);
    this._applyTransform(params, function(tx) {
      annotationHelpers.truncateAnnotation(tx, anno, params.selection);
    });
    return {
      mode: 'truncate',
      anno: anno
    }
  }

  executeExpand(params) {
    let annos = this._getAnnotationsForSelection(params);
    let anno = annos[0];
    this._checkPrecondition(params, annos, this.canExpand);
    this._applyTransform(params, function(tx) {
      annotationHelpers.expandAnnotation(tx, anno, params.selection);
    });
    return {
      mode: 'expand',
      anno: anno
    }
  }

  executeDelete(params) {
    let annos = this._getAnnotationsForSelection(params);
    let anno = annos[0];
    this._checkPrecondition(params, annos, this.canDelete);
    this._applyTransform(params, function(tx) {
      return tx.delete(anno.id)
    });
    return {
      mode: 'delete',
      annoId: anno.id
    }
  }

  isAnnotationCommand() {
    return true
  }

  _checkPrecondition(params, annos, checker) {
    let sel = this._getSelection(params);
    if (!checker.call(this, annos, sel)) {
      throw new Error("AnnotationCommand: can't execute command for selection " + sel.toString())
    }
  }

  _getAnnotationsForSelection(params) {
    return params.selectionState.getAnnotationsForType(this.getAnnotationType())
  }

  
  _applyTransform(params, transformFn) {
    let sel = this._getSelection(params);
    if (sel.isNull()) return

    let editorSession = this._getEditorSession(params);
    let result; 
    editorSession.setSelection(sel);
    editorSession.transaction(function(tx) {
      let out = transformFn(tx, params);
      if (out) result = out.result;
    });
    return result
  }

}

class NodeComponent extends Component {

  didMount() {
    this.context.editorSession.onRender('document', this.rerender, this, { path: [this.props.node.id]});
  }

  dispose() {
    this.context.editorSession.off(this);
  }

  render($$) {
    let tagName = this.getTagName();
    let el = $$(tagName)
      .attr('data-id', this.props.node.id)
      .addClass(this.getClassNames());
    return el
  }

  getTagName() {
    return 'div'
  }

  getClassNames() {
    return ''
  }

  rerender(...args) {
    
    if (this.props.node.isDisposed()) return
    super.rerender(...args);
  }

}

class BlockNodeComponent extends NodeComponent {
  
}

const INLINENODES = ['a','b','big','i','small','tt','abbr','acronym','cite','code','dfn','em','kbd','strong','samp','time','var','bdo','br','img','map','object','q','script','span','sub','sup','button','input','label','select','textarea'].reduce((m,n)=>{m[n]=true;return m}, {});


class ClipboardImporter extends HTMLImporter {

  constructor(config) {
    super(_withCatchAllConverter(config));
    
    this.IGNORE_DEFAULT_WARNINGS = true;

    Object.assign(config, {
      trimWhitespaces: true,
      REMOVE_INNER_WS: true
    });

    
    
    this._isWindows = platform.isWindows;
    this.editorOptions = config.editorOptions;
  }

  
  importDocument(html) {
    if (this._isWindows) {
      
      
      let match = /<!--StartFragment-->(.*)<!--EndFragment-->/.exec(html);
      if (match) {
        html = match[1];
      }
    }

    
    
    
    if (html.search(/script id=.substance-clipboard./)>=0) {
      let htmlDoc = DefaultDOMElement.parseHTML(html);
      let substanceData = htmlDoc.find('#substance-clipboard');
      if (substanceData) {
        let jsonStr = substanceData.textContent;
        try {
          return this.importFromJSON(jsonStr)
        } finally {
          
        }
      }
    }

    if (this.editorOptions && this.editorOptions['forcePlainTextPaste']) {
      return null;
    }

    let htmlDoc = DefaultDOMElement.parseHTML(html);
    let generatorMeta = htmlDoc.find('meta[name="generator"]');
    let xmnlsw = htmlDoc.find('html').getAttribute('xmlns:w');
    if(generatorMeta) {
      let generator = generatorMeta.getAttribute('content');
      if(generator.indexOf('LibreOffice') > -1) this._isLibreOffice = true;
    } else if(xmnlsw) {
      if(xmnlsw.indexOf('office:word') > -1) {
        this._isMicrosoftWord = true;
        
        
        
        let match = /<!--StartFragment-->([\s\S]*)<!--EndFragment-->/.exec(html);
        if (match) {
          htmlDoc = DefaultDOMElement.parseHTML(match[1]);
        }
      }
    } else if(html.indexOf('docs-internal-guid') > -1) {
      this._isGoogleDoc = true;
    }

    let body = htmlDoc.find('body');
    body = this._sanitizeBody(body);
    if (!body) {
      console.warn('Invalid HTML.');
      return null
    }
    this._wrapIntoParagraph(body);
    this.reset();
    this.convertBody(body);
    const doc = this.state.doc;
    return doc
  }

  _sanitizeBody(body) {
    
    body.findAll('meta').forEach(el => el.remove());

    
    
    if(this._isLibreOffice || this._isMicrosoftWord) {
      let bodyHtml = body.getInnerHTML();
      body.setInnerHTML(bodyHtml.replace(/\r\n|\r|\n/g, ' '));
    } else if (this._isGoogleDoc) {
      body = this._fixupGoogleDocsBody(body);
    }

    return body
  }

  _fixupGoogleDocsBody(body) {
    if (!body) return
    
    
    
    
    let bold = body.find('b');
    if (bold && /^docs-internal/.exec(bold.id)) {
      body = bold;
    }

    body.findAll('span').forEach(span => {
      
      
      
      
      
      
      
      
      let nodeTypes = [];
      if(span.getStyle('font-weight') === '700') nodeTypes.push('b');
      if(span.getStyle('font-style') === 'italic') nodeTypes.push('i');
      if(span.getStyle('vertical-align') === 'super') nodeTypes.push('sup');
      if(span.getStyle('vertical-align') === 'sub') nodeTypes.push('sub');

      function createInlineNodes(parentEl, isRoot) {
        if(nodeTypes.length > 0) {
          let el = parentEl.createElement(nodeTypes[0]);
          if(nodeTypes.length === 1) el.append(span.textContent);

          if(isRoot) {
            parentEl.replaceChild(span, el);
          } else {
            parentEl.appendChild(el);
          }

          nodeTypes.shift();
          createInlineNodes(el);
        }
      }

      createInlineNodes(span.getParent(), true);
    });

    let tags = ['b', 'i', 'sup', 'sub'];

    tags.forEach(tag => {
      body.findAll(tag).forEach(el => {
        
        
        let previousSiblingEl = el.getPreviousSibling();
        if(previousSiblingEl && el.tagName === previousSiblingEl.tagName) {
          let parentEl = el.getParent();
          let newEl = parentEl.createElement(tag);
          newEl.setInnerHTML(previousSiblingEl.getInnerHTML() + el.getInnerHTML());
          parentEl.replaceChild(el, newEl);
          parentEl.removeChild(previousSiblingEl);
        }

        
        
        
        
        if(previousSiblingEl && previousSiblingEl.tagName && el.getChildCount() > 0 && el.getChildAt(0).tagName === previousSiblingEl.tagName) {
          let parentEl = el.getParent();
          let childEl = el.getChildAt(0);
          let newEl = parentEl.createElement(previousSiblingEl.tagName);
          let newChildEl = newEl.createElement(tag);
          newChildEl.setTextContent(childEl.textContent);
          newEl.appendChild(newChildEl);
          parentEl.replaceChild(el, newEl);
        }
      });
    });

    return body
  }

  _wrapIntoParagraph(body) {
    let childNodes = body.getChildNodes();
    let shouldWrap = false;
    for (let i = 0; i < childNodes.length; i++) {
      const c = childNodes[i];
      if (c.isTextNode()) {
        if (!(/^\s+$/.exec(c.textContent))) {
          shouldWrap = true;
          break
        }
      } else if (INLINENODES[c.tagName]) {
        shouldWrap = true;
        break
      }
    }
    if (shouldWrap) {
      let p = body.createElement('p');
      p.append(childNodes);
      body.append(p);
    }
  }

  importFromJSON(jsonStr) {
    this.reset();
    let doc = this.getDocument();
    let jsonData = JSON.parse(jsonStr);
    let converter = new JSONConverter();
    converter.importDocument(doc, jsonData);
    return doc
  }

  
  convertBody(body) {
    this.convertContainer(body.childNodes, Document.SNIPPET_ID);
  }

  
  _createDocument() {
    let emptyDoc = super._createDocument();
    return emptyDoc.createSnippet()
  }
}

function _withCatchAllConverter(config) {
  config = Object.assign({}, config);
  let defaultTextType = config.schema.getDefaultTextType();
  config.converters = config.converters.concat([{
    type: defaultTextType,
    matchElement: function(el) { return el.is('div') },
    import: function(el, node, converter) {
      node.content = converter.annotatedText(el, [node.id, 'content']);
    }
  }]);
  return config
}

class ClipboardExporter extends HTMLExporter {

  
  exportDocument(doc) {
    this.state.doc = doc;
    let html;
    let elements = this.convertDocument(doc);
    
    if (elements.length === 1 && elements[0].attr('data-id') === Document.TEXT_SNIPPET_ID) {
      html = elements[0].innerHTML;
    } else {
      html = elements.map(function(el) {
        return el.outerHTML
      }).join('');
    }
    let jsonConverter = new JSONConverter();
    let jsonStr = JSON.stringify(jsonConverter.exportDocument(doc));
    let substanceContent = `<script id="substance-clipboard" type="application/json">${jsonStr}</script>`;
    return '<html><head>' +substanceContent+ '</head><body>' + html + '</body></html>'
  }

  
  convertDocument(doc) {
    let content = doc.get(Document.SNIPPET_ID);
    if (!content) {
      throw new Error('Illegal clipboard document: could not find container "' + Document.SNIPPET_ID + '"')
    }
    return this.convertContainer(content)
  }

}

class Clipboard {

  constructor(editorSession, config) {
    this.editorSession = editorSession;
    let doc = editorSession.getDocument();
    let schema = doc.getSchema();

    let htmlConverters = [];
    if (config.converterRegistry && config.converterRegistry.contains('html')) {
      htmlConverters = config.converterRegistry.get('html').values() || [];
    }
    let _config = {
      schema: schema,
      DocumentClass: doc.constructor,
      converters: htmlConverters,
      editorOptions: config.editorOptions
    };

    this.htmlImporter = new ClipboardImporter(_config);
    this.htmlExporter = new ClipboardExporter(_config);
  }

  dispose() {
    this.htmlImporter.dispose();
    
    
  }

  getEditorSession() {
    return this.editorSession
  }

  
  attach(el) {
    el.on('copy', this.onCopy, this);
    el.on('cut', this.onCut, this);
    el.on('paste', this.onPaste, this);
  }

  
  detach(el) {
    el.off(this);
  }

  
  onCopy(event) {
    
    let clipboardData = this._copy();
    substanceGlobals._clipboardData = event.clipboardData;

    if (event.clipboardData && clipboardData.doc) {
      event.preventDefault();
      
      event.clipboardData.setData('text/plain', clipboardData.text);
      
      if (!platform.isIE && !platform.isEdge) {
        event.clipboardData.setData('text/html', clipboardData.html);
      }
    }
  }

  
  onCut(event) {
    
    
    event.preventDefault();
    
    this.onCopy(event);
    let editorSession = this.getEditorSession();
    editorSession.transaction((tx)=>{
      tx.deleteSelection();
    });
  }

  
  
  onPaste(event) {
    let clipboardData = event.clipboardData;

    let types = {};
    for (let i = 0; i < clipboardData.types.length; i++) {
      types[clipboardData.types[i]] = true;
    }
    

    event.preventDefault();
    event.stopPropagation();

    let plainText;
    let html;
    if (types['text/plain']) {
      plainText = clipboardData.getData('text/plain');
    }
    if (types['text/html']) {
      html = clipboardData.getData('text/html');
    }

    
    
    if (platform.isEdge &&
        substanceGlobals.clipboardData &&
        substanceGlobals.clipboardData.text === plainText) {
      html = substanceGlobals.clipboardData.html;
    } else {
      substanceGlobals.clipboardData = {
        text: plainText,
        html: html
      };
    }

    

    
    
    if (platform.isFF && !html) {
      this._pastePlainText(plainText);
      return
    }

    
    
    if (html) {
      if (!this._pasteHtml(html, plainText)) {
        this._pastePlainText(plainText);
      }
    } else {
      this._pastePlainText(plainText);
    }
  }

  
  _pastePlainText(plainText) {
    let editorSession = this.getEditorSession();
    editorSession.transaction(function(tx) {
      tx.paste(plainText);
    }, { action: 'paste' });
  }

  
  _copy() {
    let editorSession = this.getEditorSession();
    let sel = editorSession.getSelection();
    let doc = editorSession.getDocument();
    let clipboardDoc = null;
    let clipboardText = "";
    let clipboardHtml = "";
    if (!sel.isCollapsed()) {
      clipboardText = documentHelpers.getTextForSelection(doc, sel) || "";
      clipboardDoc = copySelection(doc, sel);
      clipboardHtml = this.htmlExporter.exportDocument(clipboardDoc);
    }
    return {
      doc: clipboardDoc,
      html: clipboardHtml,
      text: clipboardText
    }
  }

  
  _pasteHtml(html, text) {
    let content = this.htmlImporter.importDocument(html);
    this.paste(content, text);
    return true
  }

  
  paste(doc, text) {
    let content = doc || text;
    let editorSession = this.getEditorSession();
    if (content) {
      editorSession.transaction((tx) => {
        tx.paste(content);
      }, { action: 'paste' });
    }
  }

}

class CommandManager {

  constructor(context, commands) {
    const editorSession = context.editorSession;
    if (!editorSession) {
      throw new Error('EditorSession required.')
    }
    this.editorSession = context.editorSession;
    
    this.commands = commands;

    
    
    this.context = Object.assign({}, context, {
      
      doc: this.editorSession.getDocument()
    });

    
    this._initialize();

    
    this.editorSession.onUpdate(this._onSessionUpdate, this);

    
    
    this._updateCommandStates(this.editorSession);
  }

  dispose() {
    this.editorSession.off(this);
  }

  
  executeCommand(commandName, userParams, cb) {
    let cmd = this._getCommand(commandName);
    if (!cmd) {
      console.warn('command', commandName, 'not registered');
      return
    }
    let commandStates = this.editorSession.getCommandStates();
    let commandState = commandStates[commandName];
    let params = Object.assign(this._getCommandParams(), userParams, {
      commandState: commandState
    });

    if (cmd.isAsync) {
      
      this.editorSession.lock();
      cmd.execute(params, this._getCommandContext(), (err, info) => {
        if (err) {
          if (cb) {
            cb(err);
          } else {
            console.error(err);
          }
        } else {
          if (cb) cb(null, info);
        }
        this.editorSession.unlock();
      });
    } else {
      let info = cmd.execute(params, this._getCommandContext());
      return info
    }
  }

  _initialize() {
    this.commandRegistry = new Registry();
    forEach(this.commands, (command) => {
      this.commandRegistry.add(command.name, command);
    });
  }

  _getCommand(commandName) {
    return this.commandRegistry.get(commandName)
  }

  
  _updateCommandStates(editorSession) {
    const commandContext = this._getCommandContext();
    const params = this._getCommandParams();
    const surface = params.surface;
    const commandRegistry = this.commandRegistry;

    
    
    let commandStates = {};
    let commandNames = commandRegistry.names.slice();
    
    commandNames.forEach((name) => {
      commandStates[name] = { disabled: true };
    });
    
    if (surface) {
      let included = surface.props.commands;
      let excluded = surface.props.excludedCommands;
      if (included) {
        commandNames = included.filter((name) => {
          return commandRegistry.contains(name)
        });
      } else if (excluded) {
        commandNames = without(commandNames, ...excluded);
      }
    }
    const commands = commandNames.map(name => commandRegistry.get(name));
    commands.forEach((cmd) => {
      if (cmd) {
        commandStates[cmd.getName()] = cmd.getCommandState(params, commandContext);
      }
    });
    
    
    
    
    this.commandStates = commandStates;
    editorSession.setCommandStates(commandStates);
  }

  _onSessionUpdate(editorSession) {
    if (editorSession.hasChanged('change') || editorSession.hasChanged('selection') || editorSession.hasChanged('commandStates')) {
      this._updateCommandStates(editorSession);
    }
  }

  _getCommandContext() {
    return this.context
  }

  _getCommandParams() {
    let editorSession = this.context.editorSession;
    let selectionState = editorSession.getSelectionState();
    let sel = selectionState.getSelection();
    let surface = this.context.surfaceManager.getFocusedSurface();
    return {
      editorSession: editorSession,
      selectionState: selectionState,
      surface: surface,
      selection: sel,
    }
  }
}

class ComponentRegistry extends Registry {
  constructor(entries) {
    super(entries, function(ComponentClass) {
      if (!ComponentClass.prototype._isComponent) {
        throw new Error('Component registry: wrong type. Expected a ComponentClass. Was: ' + String(ComponentClass))
      }
    });
  }
}

class FontAwesomeIcon extends Component {
  constructor(...args) {
    super(...args);
  }

  render($$) {
    return $$('i').addClass('fa ' + this.props.icon)
  }

}

class FontAwesomeIconProvider {

  constructor(icons) {
    this.faMap = {};
    this.textMap = {};
    forEach(icons, function(config, name) {
      let faClass = config['fontawesome'];
      if (faClass) {
        this.addFAIcon(name, faClass);
      }
      let text = config['text'];
      if (text) {
        this.addTextIcon(name, text);
      }
    }.bind(this));
  }

  renderIcon($$, name) {
    let faClass = this.faMap[name];
    let text = this.textMap[name];
    if (faClass) {
      return $$(FontAwesomeIcon, { icon: faClass })
    } else if (text) {
      return text
    }
  }

  addFAIcon(name, faClass) {
    this.faMap[name] = faClass;
  }

  addTextIcon(name, text) {
    this.textMap[name] = text;
  }
}

class DefaultLabelProvider {
  constructor(labels, lang) {
    this.lang = lang || 'en';
    this.labels = labels;
  }

  getLabel(name) {
    let labels = this.labels[this.lang];
    if (!labels) return name
    return labels[name] || name
  }

  hasLabel(name) {
    let labels = this.labels[this.lang];
    return Boolean(labels[name])
  }
}

class DragAndDropHandler {

  match(dragState, context) { 
    return false
  }

  drop(dragState, context) { 
    
  }

  get _isDragAndDropHandler() {
    return true
  }

}

class DragManager extends EventEmitter {

  constructor(customDropHandlers, context) {
    super();

    this.context = context;

    let dropAssetHandlers = [];
    let moveInlineHandlers = [];
    customDropHandlers.forEach((h) => {
      
      let type = h.type || 'drop-asset';
      switch (type) {
        case 'drop-asset': {
          dropAssetHandlers.push(h);
          break
        }
        case 'move-inline': {
          moveInlineHandlers.push(h);
          break
        }
        default:
          console.warn('Unknown type of drop handler.', h);
      }
    });

    
    this.dropHandlers = [
      
      new MoveInline(moveInlineHandlers),
      
      new MoveBlockNode(),
      
      new InsertNodes(dropAssetHandlers, this.context),
      
      
      new CustomHandler(),
    ];
    if (platform.inBrowser) {
      this.el = DefaultDOMElement.wrapNativeElement(document);
      this.el.on('dragstart', this.onDragStart, this);
      
      this.el.on('drop', this.onDragEnd, this);
      this.el.on('dragenter', this.onDragEnter, this);
      this.el.on('dragexit', this.onDragExit, this);
      this.el.on('mousedown', this.onMousedown, this);
    }
  }

  dispose() {
    if (this.el) {
      this.el.off(this);
    }
  }

  onDragStart(e) {
    
    this._initDrag(e, { external: false });
    
    
    var img = document.createElement("img");
    img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
    e.dataTransfer.setDragImage(img, 0, 0);
    
    
    
    
    
    
    if (this.dragState.mode === 'inline') {
      e.dataTransfer.setData('text/html', img.outerHTML);
    } else {
      
      
      e.dataTransfer.setData('text/html', '<div></div>');
    }
    
  }

  
  onDragEnter(e) {
    if (!this.dragState) {
      
      this._initDrag(e, {external: true});
    }
  }

  onDragEnd(event) {
    if (event.__reserved__) return
    
    if (this.dragState) {
      event.stopPropagation();
      event.preventDefault();
      
      
      this._onDragEnd(event);
    }
  }

  onDragExit(e) {
    if (platform.isFF) {
      
    } else {
      
      
      
      this._onDragEnd(e);
    }
  }

  extendDragState(extState) {
    Object.assign(this.dragState, extState);
  }

  
  
  onMousedown(event) {
    if (this.dragState) {
      this.dragState = null;
      this._onDragEnd(event);
    }
  }

  _onDragEnd(event) {
    if (!this.dragState) {
      
      
      
      console.warn('Not in a valid drag state.');
    } else {
      this._handleDrop(event);
    }
    this.emit('drag:finished');
    this.dragState = null;
  }

  
  _handleDrop(e) {
    let dragState = this.dragState;
    let i, handler;
    let match = false;
    dragState.event = e;
    dragState.data = this._getData(e);
    
    for (i = 0; i < this.dropHandlers.length && !match; i++) {
      handler = this.dropHandlers[i];
      match = handler.match(dragState);
    }
    if (match) {
      let editorSession = this.context.editorSession;
      editorSession.transaction((tx) => {
        handler.drop(tx, dragState);
      });
    } else {
      console.error('No drop handler could be found.');
    }
  }

  
  _initDrag(event, options) {
    
    
    
    

    
    let sel = this._getSelection();
    let dragState = Object.assign({ startEvent: event }, options);
    this.dragState = dragState;

    
    
    if (dragState.external) {
      dragState.selectionDrag = false;
      dragState.sourceSelection = null;
      dragState.scrollPanes = this._getSurfacesGroupedByScrollPane();
      this.emit('drag:started', dragState);
      return
    }

    
    
    let isSelectionDrag = (
      (sel.isPropertySelection() || sel.isContainerSelection()) &&
      isMouseInsideDOMSelection(event)
    );
    if (isSelectionDrag) {
      
      if (sel.isContainerSelection()) {
        console.warn('Dragging of ContainerSelection is not supported yet.');
        return _stop()
      }
      
      dragState.inline = true;
      dragState.selectionDrag = true;
      dragState.sourceSelection = sel;
      
      return
    }
    let comp = Component.unwrap(event.target);
    if (!comp) return _stop()
    let isolatedNodeComponent;
    if (comp._isInlineNodeComponent) {
      isolatedNodeComponent = comp;
      dragState.inline = true;
      dragState.sourceNode = comp.props.node;
    } else {
      isolatedNodeComponent = comp.context.isolatedNodeComponent;
    }
    if (!isolatedNodeComponent) return _stop()
    let surface = isolatedNodeComponent.context.surface;
    
    if(isolatedNodeComponent._isInlineNodeComponent) {
      let inlineNode = isolatedNodeComponent.props.node;
      dragState.inline = true;
      dragState.selectionDrag = true;
      dragState.sourceSelection = {
        type: 'property',
        path: inlineNode.start.path,
        startOffset: inlineNode.start.offset,
        endOffset: inlineNode.end.offset,
        containerId: surface.getContainerId(),
        surfaceId: surface.id
      };
      return
    }
    
    
    dragState.selectionDrag = false;
    dragState.nodeDrag = true;
    dragState.sourceSelection = {
      type: 'node',
      nodeId: isolatedNodeComponent.props.node.id,
      containerId: surface.getContainerId(),
      surfaceId: surface.id
    };
    
    
    
    dragState.scrollPanes = this._getSurfacesGroupedByScrollPane();
    
    this.emit('drag:started', dragState);

    function _stop() {
      
      event.preventDefault();
      event.stopPropagation();
    }
  }

  _getSurfacesGroupedByScrollPane() {
    
    
    let surfaces = this.context.surfaceManager.getSurfaces();
    let scrollPanes = {};
    surfaces.forEach((surface) => {
      
      if (!surface.isContainerEditor()) return
      let scrollPane = surface.context.scrollPane;
      let scrollPaneName = scrollPane.getName();
      let surfaceName = surface.getName();
      if (!scrollPanes[scrollPaneName]) {
        let surfaces = {};
        surfaces[surfaceName] = surface;
        scrollPanes[scrollPaneName] = { scrollPane, surfaces };
      } else {
        scrollPanes[scrollPaneName].surfaces[surfaceName] = surface;
      }
    });
    return scrollPanes
  }

  _getSelection() {
    return this.context.editorSession.getSelection()
  }

  _getComponents(targetEl) {
    let res = [];
    let curr = targetEl;
    while (curr) {
      let comp = Component.getComponentForDOMElement(curr);
      if (comp) {
        res.unshift(comp);
        if(comp._isSurface) {
          return res
        }
      }
      curr = curr.parentNode;
    }
    return null
  }

  _getIsolatedNodeOrContainerChild(targetEl) {
    let parent, current;
    current = targetEl;
    parent = current.parentNode;
    while(parent) {
      if (parent._comp && parent._comp._isContainerEditor) {
        return current._comp
      } else if (current._comp && current._comp._isIsolatedNode) {
        return current._comp
      }
      current = parent;
      parent = current.parentNode;
    }
  }

  
  _extractUris(dataTransfer) {
    let uris = [];
    let rawUriList = dataTransfer.getData('text/uri-list');
    if (rawUriList) {
      uris = rawUriList.split('\n').filter(function(item) {
        return !item.startsWith('#')
      });
    }
    return uris
  }

  
  _getData(e) {
    let dataTransfer = e.dataTransfer;
    if (dataTransfer) {
      return {
        files: Array.prototype.slice.call(dataTransfer.files),
        uris: this._extractUris(dataTransfer),
        text: dataTransfer.getData('text/plain'),
        html: dataTransfer.getData('text/html')
      }
    }
  }
}


class MoveBlockNode extends DragAndDropHandler {

  match(dragState) {
    let {insertPos} = dragState.dropParams;
    
    return (!dragState.external && dragState.nodeDrag &&
      dragState.dropType === 'place' && insertPos >= 0
    )
  }

  drop(tx, dragState) {
    
    
    
    
    let { insertPos } = dragState.dropParams;
    tx.setSelection(dragState.sourceSelection);
    let copy = tx.copySelection();
    
    tx.deleteSelection({ clear: true });
    let containerId = dragState.targetSurface.getContainerId();
    let surfaceId = dragState.targetSurface.getName();
    let container = tx.get(containerId);
    let targetNodeId = container.getNodeIdAt(insertPos);
    let insertMode = 'before';
    if (!targetNodeId) {
      targetNodeId = container.getNodeIdAt(insertPos-1);
      insertMode = 'after';
    }
    tx.setSelection({
      type: 'node',
      nodeId: targetNodeId,
      mode: insertMode,
      containerId: containerId,
      surfaceId: surfaceId
    });
    tx.paste(copy);
  }
}

class MoveInline extends DragAndDropHandler {

  match(dragState) {
    return !dragState.external && dragState.inline
  }

  drop(tx, dragState) {
    let event = dragState.event;
    let sourceSel = dragState.sourceSelection;
    let wrange = getDOMRangeFromEvent(event);
    if (!wrange) return
    let comp = Component.unwrap(event.target);
    if (!comp) return
    let domSelection = comp.context.domSelection;
    if (!domSelection) return
    let range = domSelection.mapDOMRange(wrange);
    if (!range) return
    let targetSel = tx.getDocument()._createSelectionFromRange(range);

    
    tx.selection = sourceSel;
    let snippet = tx.copySelection();
    tx.deleteSelection();
    tx.selection = transformSelection(targetSel, tx);
    tx.paste(snippet);
  }
}

class InsertNodes extends DragAndDropHandler {
  constructor(assetHandlers, context) {
    super();
    this.assetHandlers = assetHandlers;
    this.context = context;
  }

  match(dragState) {
    return dragState.dropType === 'place' && dragState.external
  }

  drop(tx, dragState) {
    let { insertPos } = dragState.dropParams;
    let files = dragState.data.files;
    let uris = dragState.data.uris;
    let containerId = dragState.targetSurface.getContainerId();
    let surfaceId = dragState.targetSurface.id;
    let container = tx.get(containerId);
    let targetNode = container.getNodeIdAt(insertPos);
    let insertMode = 'before';
    if (!targetNode) {
      targetNode = container.getNodeIdAt(insertPos-1);
      insertMode = 'after';
    }
    tx.setSelection({
      type: 'node',
      nodeId: targetNode,
      mode: insertMode,
      containerId: containerId,
      surfaceId: surfaceId
    });
    if (files.length > 0) {
      files.forEach((file) => {
        this._callHandlers(tx, {
          file: file,
          type: 'file'
        });
      });
    } else if (uris.length > 0) {
      uris.forEach((uri) => {
        this._callHandlers(tx, {
          uri: uri,
          type: 'uri'
        });
      });
    } else {
      console.info('TODO: implement html/text drop here');
    }
  }

  _callHandlers(tx, params) {
    let i, handler;
    for (i = 0; i < this.assetHandlers.length; i++) {
      handler = this.assetHandlers[i];

      let match = handler.match(params, this.context);
      if (match) {
        handler.drop(tx, params, this.context);
        break
      }
    }
  }
}


class CustomHandler extends DragAndDropHandler {

  match(dragState) {
    return dragState.dropType === 'custom'
  }

  drop(tx, dragState) {
    
    dragState.component.handleDrop(tx, dragState);
  }
}

class FileManager {

  constructor(editorSession, extensions, context) {
    this.editorSession = editorSession;
    this.extensions = extensions;
    this.proxies = {};
    this.context = context;

    
    forEach(editorSession.getDocument().getNodes(), (node) => {
      if (node._isFileNode) this.storeFile(node);
    });

    this.editorSession.onUpdate('document', this._onDocumentChange, this);
  }

  dispose() {
    this.editorSession.off(this);
  }

  storeFile(fileNode) {
    let proxy = this.proxies[fileNode.id];
    
    if (!proxy) {
      proxy = this.createFileProxy(fileNode);
      if (proxy) {
        this.proxies[fileNode.id] = proxy;
      }
    }
    fileNode.proxy = proxy;
    return proxy
  }

  createFileProxy(fileNode) { 
    let context = this.context;
    for (var i = 0; i < this.extensions.length; i++) {
      let ExtClass = this.extensions[i];
      if (ExtClass.match(fileNode, context)) {
        return new ExtClass(fileNode, context)
      }
    }
    console.error('No file adapter found for ', fileNode);
  }

  getProxy(fileNode) {
    return this.proxies[fileNode.id]
  }

  sync() {
    
    
    let promises = map(this.proxies, (proxy) => {
      return proxy.sync()
    });
    return Promise.all(promises)
  }

  _onDocumentChange(change) {
    let doc = this.editorSession.getDocument();
    forEach(change.created, (nodeData) => {
      
      let node = doc.get(nodeData.id);
      if (node._isFileNode) {
        this.storeFile(node);
      }
    });
  }
}

const events = [ 'keydown', 'keyup', 'keypress', 'mousedown', 'mouseup' , 'copy' ];

class GlobalEventHandler {

  constructor(editorSession, surfaceManager) {
    this.editorSession = editorSession;
    this.surfaceManager = surfaceManager;
    this.listeners = [];
    this.initialize();
  }

  initialize() {
    if (platform.inBrowser) {
      let document = DefaultDOMElement.wrapNativeElement(window.document);
      events.forEach(function(name) {
        document.on(name, this._dispatch.bind(this, name), this);
      }.bind(this));
    }
  }

  dispose() {
    if (platform.inBrowser) {
      let document = DefaultDOMElement.wrapNativeElement(window.document);
      document.off(this);
    }
  }

  addEventListener(eventName, handler, options) {
    if (!options.id) {
      throw new Error("GlobalEventHandler can only be used with option 'id'")
    }
    let listener = new DOMEventListener(eventName, handler, options);
    this.listeners.push(listener);
  }

  removeEventListener(listener) {
    let idx = this.listeners.indexOf(listener);
    if (idx > -1) {
      this.listeners.splice(idx, 1);
    }
  }

  getEventListeners() {
    return this.listeners
  }

  _getActiveListener(eventName) {
    let editorSession = this.editorSession;
    let sel = editorSession.getSelection();
    if (sel) {
      let surfaceId = sel.surfaceId;
      for (let i = 0; i < this.listeners.length; i++) {
        let listener = this.listeners[i];
        if (listener.eventName === eventName && listener.options.id === surfaceId) {
          return listener
        }
      }
    }
  }

  _dispatch(eventName, e) {
    let listener = this._getActiveListener(eventName);
    if (listener) {
      listener.handler(e);
    }
  }
}

GlobalEventHandler.prototype.on = DOMElement.prototype.on;
GlobalEventHandler.prototype.off = DOMElement.prototype.off;

class ExecuteCommandHandler {
  constructor(editorSession, commandName) {
    this.editorSession = editorSession;
    this.commandName = commandName;
  }
  execute(params) {
    let commandState = params.editorSession.getCommandStates()[this.commandName];
    if (!commandState || commandState.disabled) return false
    this.editorSession.executeCommand(this.commandName, params);
    return true
  }
}

class KeyboardManager {

  constructor(editorSession, bindings, options) {
    this.editorSession = editorSession;
    this.context = options.context || {};
    this.keydownBindings = {};
    this.textinputBindings = {};

    bindings.forEach(({ key, spec }) => {
      
      let type = spec.type || 'keydown';
      if(spec.command) {
        let handler = new ExecuteCommandHandler(editorSession, spec.command);
        let hook = handler.execute.bind(handler);
        if (type === 'keydown') {
          this.keydownBindings[parseCombo(key)] = hook;
        } else if (type === 'textinput') {
          this.textinputBindings[key] = hook;
        }
      } else {
        throw new Error('Keyboard binding not supported', spec)
      }
    });
  }

  onKeydown(event) {
    let key = parseKeyEvent(event);
    let hook = this.keydownBindings[key];
    if (hook) {
      let params = this._getParams();
      const hasExecuted = hook(params, this.context);
      if (hasExecuted) {
        event.preventDefault();
        event.stopPropagation();
      }
      return hasExecuted
    }
  }


  onTextInput(text) {
    let hook = this.textinputBindings[text];
    if (hook) {
      let params = this._getParams();
      return hook(params, this.context)
    }
  }

  _getParams() {
    let editorSession = this.editorSession;
    let selectionState = editorSession.getSelectionState();
    let sel = selectionState.getSelection();
    let surface = this.context.surfaceManager.getFocusedSurface();
    return {
      editorSession: editorSession,
      selectionState: selectionState,
      surface: surface,
      selection: sel,
    }
  }

}

function parseCombo(combo) {
  let frags = combo.split('+');
  let data = {
    keyCode: -1
  };
  for (var i = 0; i < frags.length; i++) {
    let frag = frags[i].toUpperCase();
    switch(frag) {
      case 'ALT': {
        data.altKey = true;
        break
      }
      case 'ALTGR': {
        data.altKey = true;
        data.code = 'AltRight';
        break
      }
      case 'CMD': {
        data.metaKey = true;
        break
      }
      case 'CTRL': {
        data.ctrlKey = true;
        break
      }
      case 'COMMANDORCONTROL': {
        if (platform.isMac) {
          data.metaKey = true;
        } else {
          data.ctrlKey = true;
        }
        break
      }
      case 'MEDIANEXTTRACK': {
        data.code = 'MediaTrackNext';
        break
      }
      case 'MEDIAPLAYPAUSE': {
        data.code = 'MediaPlayPause';
        break
      }
      case 'MEDIAPREVIOUSTRACK': {
        data.code = 'MediaPreviousTrack';
        break
      }
      case 'MEDIASTOP': {
        data.code = 'MediaStop';
        break
      }
      case 'SHIFT': {
        data.shiftKey = true;
        break
      }
      case 'SUPER': {
        data.metaKey = true;
        break
      }
      default:
        if (frag.length === 1) {
          data.keyCode = frag.charCodeAt(0);
        } else if (keys$1.hasOwnProperty(frag)) {
          data.keyCode = keys$1[frag];
        } else {
          throw new Error('Unsupported keyboard command: '+ combo)
        }
    }
  }
  return parseKeyEvent(data)
}

KeyboardManager.parseCombo = parseCombo;

class MacroManager {

  constructor(context, macros) {
    this.context = context;
    this.macros = macros;
    this.context.editorSession.onFinalize('document', this.onDocumentChanged, this);
  }

  dispose() {
    this.context.editorSession.off(this);
  }

  onDocumentChanged(change, info) {
    this.executeMacros(change, info);
  }

  executeMacros(change, info) {
    let doc = this.context.editorSession.getDocument();
    let nodeId, node, text, start, end;
    let path;
    
    
    switch(info.action) {
      case 'type': {
        let op = change.ops[0];
        if (op.type === 'update' && op.diff._isTextOperation) {
          path = op.path;
          nodeId = path[0];
          node = doc.get(nodeId);
          text = doc.get(path);
          start = op.diff.pos;
          end = start+op.diff.getLength();
        }
        break
      }
      case 'break': {
        
        
        

        
        
        
        
        let sel = change.before.selection;
        if (!sel.isPropertySelection()) return
        path = sel.path;
        nodeId = path[0];
        node = doc.get(nodeId);
        
        if (!node || !node.isText()) return
        text = node.getText();
        start = sel.start.offset;
        end = start;
        break
      }
      case 'paste': {
        
        if (change.ops.length === 1) {
          let op = change.ops[0];
          if (op.type === 'update' && op.propertyType === 'string') {
            path = op.path;
            nodeId = path[0];
            node = doc.get(nodeId);
            if (!node.isText()) return
            text = node.getText();
            start = op.diff.pos;
            end = start+op.diff.getLength();
          }
        }
        break
      }
      default:
        return
    }

    let props = {
      action: info.action,
      node: node,
      path: path,
      text: text,
      start: start,
      end: end,
      editorSession: this.context.editorSession,
      selection: this.context.editorSession.getSelection()
    };

    setTimeout(() => {
      for (let i = 0; i < this.macros.length; i++) {
        let macro = this.macros[i];
        let executed = macro.execute(props, this.context);
        if (executed) {
          break
        }
      }
    });

  }
}

class MarkersManager {

  constructor(editorSession) {
    this.editorSession = editorSession;

    
    this._textProperties = {};
    this._dirtyProps = {};

    this._markers = new MarkersIndex(this);

    
    
    editorSession.onUpdate(this._onChange, this);

    
    editorSession.onRender(this._updateProperties, this);
  }

  dispose() {
    this.editorSession.off(this);
    this._markers.dispose();
  }

  setMarkers(key, markers) {
    this.clearMarkers(key);
    markers.forEach(m => this.addMarker(key, m));
  }

  addMarker(key, marker) {
    marker._key = key;
    if (!marker._isMarker) {
      marker = new Marker(this.editorSession.getDocument(), marker);
    }
    this._markers.add(marker);
  }

  clearMarkers(key) {
    this._markers.clear(key);
  }

  
  register(textProperyComponent) {
    let path = String(textProperyComponent.getPath());
    
    let textProperties = this._textProperties[path];
    if (!textProperties) {
      textProperties = this._textProperties[path] = [];
    }
    textProperties.push(textProperyComponent);
  }


  deregister(textProperyComponent) {
    let path = String(textProperyComponent.getPath());
    
    let textProperties = this._textProperties[path];
    if (!textProperties) {
      
      return
    }
    deleteFromArray(this._textProperties[path], textProperyComponent);
    if (textProperties.length === 0) {
      delete this._textProperties[path];
    }
  }

  getMarkers(path, opts) {
    opts = opts || {};
    let doc = this.editorSession.getDocument();
    let annos = doc.getAnnotations(path) || [];
    let markers = this._markers.get(path, opts.surfaceId, opts.containerId);
    return annos.concat(markers)
  }

  _onChange(editorSession) {
    if (editorSession.hasDocumentChanged()) {
      const change = editorSession.getChange();
      this._markers._onDocumentChange(change);
      this._recordDirtyTextProperties(change);
    }
  }

  _recordDirtyTextProperties(change) {
    
    forEach(change.updated, (val, id) => {
      this._dirtyProps[id] = true;
    });
  }

  
  _updateProperties() {
    
    Object.keys(this._dirtyProps).forEach((path) => {
      let textProperties = this._textProperties[path];
      if (textProperties) {
        textProperties.forEach(this._updateTextProperty.bind(this));
      }
    });
    this._dirtyProps = {};
  }

  
  _updateTextProperty(textPropertyComponent) {
    let path = textPropertyComponent.getPath();
    let markers = this.getMarkers(path, {
      surfaceId: textPropertyComponent.getSurfaceId(),
      containerId: textPropertyComponent.getContainerId()
    });
    
    textPropertyComponent.setState({
      markers: markers
    });
  }

}


class MarkersIndex {

  constructor(manager) {
    this._manager = manager;

    this._byKey = new ArrayTree();
    this._documentMarkers = new ArrayTree();
    this._surfaceMarkers = {};
    this._containerMarkers = {};
  }

  get(path, surfaceId) {
    let markers = this._documentMarkers[path] || [];
    if (surfaceId && this._surfaceMarkers[surfaceId]) {
      let surfaceMarkers = this._surfaceMarkers[surfaceId][path];
      if (surfaceMarkers) markers = markers.concat(surfaceMarkers);
    }
    
    return markers
  }

  add(marker) {
    const key = marker._key;
    this._byKey.add(key, marker);
    this._add(marker);
  }

  
  remove(marker) {
    const key = marker._key;
    this._byKey.remove(key, marker);
    this._remove(marker);
  }

  
  clear(key) {
    let markers = this._byKey.get(key);
    markers.forEach((marker) => {
      this._remove(marker);
    });
  }

  _add(marker) {
    const dirtyProps = this._manager._dirtyProps;
    
    const scope = marker.scope || 'document';
    switch (scope) {
      case 'document': {
        const path = marker.start.path;
        
        dirtyProps[path] = true;
        this._documentMarkers.add(path, marker);
        break
      }
      case 'surface': {
        if (!this._surfaceMarkers[marker.surfaceId]) {
          this._surfaceMarkers[marker.surfaceId] = new ArrayTree();
        }
        const path = marker.start.path;
        dirtyProps[path] = true;
        this._surfaceMarkers[marker.surfaceId].add(path, marker);
        break
      }
      case 'container': {
        console.warn('Container scoped markers are not supported yet');
        break
      }
      default:
        console.error('Invalid marker scope.');
    }
  }

  _remove(marker) {
    const dirtyProps = this._manager._dirtyProps;
    const scope = marker.scope || 'document';
    switch (scope) {
      case 'document': {
        const path = marker.start.path;
        dirtyProps[path] = true;
        this._documentMarkers.remove(path, marker);
        break
      }
      case 'surface': {
        if (!this._surfaceMarkers[marker.surfaceId]) {
          this._surfaceMarkers[marker.surfaceId] = new ArrayTree();
        }
        const path = marker.start.path;
        dirtyProps[path] = true;
        this._surfaceMarkers[marker.surfaceId].remove(path, marker);
        break
      }
      case 'container': {
        console.warn('Container scoped markers are not supported yet');
        break
      }
      default:
        console.error('Invalid marker scope.');
    }
  }

  
  _getAllCustomMarkers(path) {
    let markers = this._documentMarkers[path] || [];
    for(let surfaceId in this._surfaceMarkers) {
      if (!this._surfaceMarkers.hasOwnProperty(surfaceId)) continue
      let surfaceMarkers = this._surfaceMarkers[surfaceId][path];
      if (surfaceMarkers) markers = markers.concat(surfaceMarkers);
    }
    
    return markers
  }

  _onDocumentChange(change) {
    change.ops.forEach((op) => {
      if (op.type === 'update' && op.diff._isTextOperation) {
        let markers = this._getAllCustomMarkers(op.path);
        let diff$$1 = op.diff;
        switch (diff$$1.type) {
          case 'insert':
            this._transformInsert(markers, diff$$1);
            break
          case 'delete':
            this._transformDelete(markers, diff$$1);
            break
          default:
            
        }
      }
    });
  }

  _transformInsert(markers, op) {
    const pos = op.pos;
    const length = op.str.length;
    if (length === 0) return
    markers.forEach((marker) => {
      
      var start = marker.start.offset;
      var end = marker.end.offset;
      var newStart = start;
      var newEnd = end;
      if (pos >= end) return
      if (pos <= start) {
        newStart += length;
        newEnd += length;
        marker.start.offset = newStart;
        marker.end.offset = newEnd;
        return
      }
      if (pos < end) {
        newEnd += length;
        marker.end.offset = newEnd;
        
        
        
        this._remove(marker);
      }
    });
  }

  _transformDelete(markers, op) {
    const pos1 = op.pos;
    const length = op.str.length;
    const pos2 = pos1 + length;
    if (pos1 === pos2) return
    markers.forEach((marker) => {
      var start = marker.start.offset;
      var end = marker.end.offset;
      var newStart = start;
      var newEnd = end;
      if (pos2 <= start) {
        newStart -= length;
        newEnd -= length;
        marker.start.offset = newStart;
        marker.end.offset = newEnd;
      } else if (pos1 >= end) {
        
      }
      
      
      else {
        if (pos1 <= start) {
          newStart = start - Math.min(pos2-pos1, start-pos1);
        }
        if (pos1 <= end) {
          newEnd = end - Math.min(pos2-pos1, end-pos1);
        }
        
        if (start !== end && newStart === newEnd) {
          this._remove(marker);
          return
        }
        if (start !== newStart) {
          marker.start.offset = newStart;
        }
        if (end !== newEnd) {
          marker.end.offset = newEnd;
        }
        this._remove(marker);
      }
    });
  }

}

class SurfaceManager {

  constructor(editorSession) {
    this.editorSession = editorSession;
    this.surfaces = {};
    this._state = {
      selection: null
    };
    editorSession.onUpdate('selection', this._onSelectionChanged, this);
    editorSession.onPostRender(this._recoverDOMSelection, this);
  }

  dispose() {
    this.editorSession.off(this);
  }

  
  getSurface(name) {
    if (name) {
      return this.surfaces[name]
    }
  }

  
  getFocusedSurface() {
    const sel = this._state.selection;
    if (sel && sel.surfaceId) {
      return this.getSurface(sel.surfaceId)
    }
  }

  getSurfaces() {
    
    
    return Object.keys(this.surfaces).map(key => this.surfaces[key])
  }

  
  registerSurface(surface) {
    const id = surface.getId();
    if (this.surfaces[id]) {
      console.error(`A surface with id ${id} has already been registered.`);
    }
    this.surfaces[id] = surface;
  }

  
  unregisterSurface(surface) {
    surface.off(this);
    let surfaceId = surface.getId();
    
    
    
    
    
    let registeredSurface = this.surfaces[surfaceId];
    if (registeredSurface === surface) {
      delete this.surfaces[surfaceId];
    }
  }

  _onSelectionChanged(selection) {
    const state = this._state;
    state.selection = selection;
    
    
    
    if (selection && selection.isCustomSelection() && platform.inBrowser) {
      window.getSelection().removeAllRanges();
      window.document.activeElement.blur();
    }
  }

  
  _recoverDOMSelection() {
    
    
    
    if (this.editorSession._blurred) return

    let focusedSurface = this.getFocusedSurface();
    
    if (focusedSurface && !focusedSurface.isDisabled()) {
      
      focusedSurface._focus();
      focusedSurface.rerenderDOMSelection();
    }
  }
}

class SaveHandlerStub {

  
  saveDocument({fileManager}) {
    console.info('Simulating save ...');

    return fileManager.sync()
    .then(() => {
      
      
      console.info('Creating document snapshot...');
    })

  }
}

class Configurator {
  constructor() {
    this.config = {
      schema: {},
      nodes: {},
      tools: {},
      components: {},
      converters: {},
      importers: {},
      exporters: {},
      fileProxies: [],
      commands: {},
      commandGroups: {},
      toolPanels: {},
      editingBehaviors: [],
      macros: [],
      managers: {},
      dropHandlers: [],
      keyboardShortcuts: [],
      icons: {},
      labels: {},
      lang: 'en_US',
      editorOptions: [],
      CommandManagerClass: CommandManager,
      DragManagerClass: DragManager,
      SaveHandlerClass: null,
    };
  }

  
  

  
  defineSchema(schema) {
    if (schema.ArticleClass) {
      console.warn('DEPRECATED: schema.ArticleClass is now called schema.DocumentClass');
      schema.DocumentClass = schema.ArticleClass;
    }
    if (!schema.DocumentClass) {
      throw new Error('schema.DocumentClass is mandatory')
    }
    this.config.schema = schema;
  }

  addEditorOption(option) {
    if (!option.key) {
      throw new Error('An option key must be defined')
    }
    if (!option.value) {
      throw new Error('An option value must be defined')
    }
    this.config.editorOptions[option.key] = option.value;
  }

  getEditorOptions() {
    return this.config.editorOptions
  }

    
  addNode(NodeClass) {
    var type = NodeClass.type;
    if (!type) {
      throw new Error('A NodeClass must have a type.')
    }
    if (this.config.nodes[type]) {
      throw new Error('NodeClass with this type name is already registered: ' + type)
    }
    this.config.nodes[type] = NodeClass;
  }

  
  addConverter(type, converter) {
    var converters = this.config.converters[type];
    if (!converters) {
      converters = {};
      this.config.converters[type] = converters;
    }
    if (!converter.type) {
      throw new Error('A converter needs an associated type.')
    }
    converters[converter.type] = converter;
  }

  
  addImporter(type, ImporterClass) {
    this.config.importers[type] = ImporterClass;
  }

  
  addExporter(type, ExporterClass) {
    this.config.exporters[type] = ExporterClass;
  }

  
  addComponent(nodeType, ComponentClass, force) {
    if (!force && this.config.components[nodeType]) {
      throw new Error(nodeType+' already registered')
    }
    if (!ComponentClass) {
      throw new Error('Provided nil for component '+nodeType)
    }
    if (!ComponentClass.prototype._isComponent) {
      throw new Error('ComponentClass must be a subclass of ui/Component.')
    }
    this.config.components[nodeType] = ComponentClass;
  }

  addCommand(name, CommandClass, options) {
    if (!isString$1(name)) {
      throw new Error("Expecting 'name' to be a String")
    }
    if (!CommandClass) {
      throw new Error('Provided nil for command '+name)
    }
    if (!CommandClass.prototype._isCommand) {
      throw new Error("Expecting 'CommandClass' to be of type ui/Command.")
    }
    this.config.commands[name] = {
      name: name,
      CommandClass: CommandClass,
      options: options || {}
    };

    
    let commandGroup = options.commandGroup;
    if (!this.config.commandGroups[commandGroup]) {
      this.config.commandGroups[commandGroup] = [];
    }
    this.config.commandGroups[commandGroup].push(name);
  }

  addTool(name, ToolClass) {
    if (!isString$1(name)) {
      throw new Error("Expecting 'name' to be a String")
    }
    if (!ToolClass) {
      throw new Error('Provided nil for tool '+name)
    }
    if (!ToolClass || !ToolClass.prototype._isTool) {
      throw new Error("Expecting 'ToolClass' to be of type ui/Tool. name:", name)
    }

    this.config.tools[name] = ToolClass;
  }

  getTools() {
    return this.config.tools
  }

  addToolPanel(name, spec) {
    this.config.toolPanels[name] = spec;
  }

  getToolPanel(name) {
    return this.config.toolPanels[name]
  }

  addManager(name, ManagerClass) {
    this.config.managers[name] = ManagerClass;
  }

  getManagers() {
    return this.config.managers
  }

  
  addIcon(iconName, options) {
    var iconConfig = this.config.icons[iconName];
    if (!iconConfig) {
      iconConfig = {};
      this.config.icons[iconName] = iconConfig;
    }
    Object.assign(iconConfig, options);
  }

  
  addLabel(labelName, label) {
    if (isString$1(label)) {
      if(!this.config.labels['en']) {
        this.config.labels['en'] = {};
      }
      this.config.labels['en'][labelName] = label;
    } else {
      forEach(label, function(label, lang) {
        if (!this.config.labels[lang]) {
          this.config.labels[lang] = {};
        }
        this.config.labels[lang][labelName] = label;
      }.bind(this));
    }
  }

  
  addSeed(seed) {
    this.config.seed = seed;
  }

  
  addEditingBehavior(editingBehavior) {
    this.config.editingBehaviors.push(editingBehavior);
  }

  addMacro(macro) {
    this.config.macros.push(macro);
  }

  addDragAndDrop(DragAndDropHandlerClass) {
    
    
    console.warn('DEPRECATED: Use addDropHandler() instead');
    if (!DragAndDropHandlerClass.prototype._isDragAndDropHandler) {
      throw new Error('Only instances of DragAndDropHandler are allowed.')
    }
    this.addDropHandler(new DragAndDropHandlerClass());
  }

  addDropHandler(dropHandler) {
    
    if (dropHandler._isDragAndDropHandler) {
      dropHandler.type = dropHandler.type || 'drop-asset';
    }
    this.config.dropHandlers.push(dropHandler);
  }

  addKeyboardShortcut(combo, spec) {
    let entry = {
      key: combo,
      spec: spec
    };
    this.config.keyboardShortcuts.push(entry);
  }

  addFileProxy(FileProxyClass) {
    this.config.fileProxies.push(FileProxyClass);
  }

  getFileAdapters() {
    return this.config.fileProxies.slice(0)
  }

  
  import(pkg, options) {
    pkg.configure(this, options || {});
    return this
  }

  
  

  getConfig() {
    return this.config
  }

  getStyles() {
    return this.config.styles
  }

  getSchema() {
    if (!this.schema) {
      this.schema = new DocumentSchema(this.config.schema);
      this.schema.addNodes(this.config.nodes);
    }
    return this.schema
  }

  getDocumentClass() {
    return this.config.schema.DocumentClass
  }

  createArticle(seed) {
    const schema = this.getSchema();
    const DocumentClass = schema.getDocumentClass();
    let doc = new DocumentClass(schema);
    if (seed) {
      seed(doc);
    }
    return doc
  }

  createImporter(type, context, options = {}) {
    var ImporterClass = this.config.importers[type];
    var config = Object.assign({
      schema: this.getSchema(),
      converters: this.getConverterRegistry().get(type).values(),
    }, options);
    return new ImporterClass(config, context)
  }

  createExporter(type, context, options = {}) {
    var ExporterClass = this.config.exporters[type];
    var config = Object.assign({
      schema: this.getSchema(),
      converters: this.getConverterRegistry().get(type).values()
    }, options);
    return new ExporterClass(config, context)
  }

  getCommandGroups() {
    return this.config.commandGroups
  }

  getComponentRegistry() {
    var componentRegistry = new ComponentRegistry();
    forEach(this.config.components, function(ComponentClass, name) {
      componentRegistry.add(name, ComponentClass);
    });
    return componentRegistry
  }

  getCommands() {
    return map(this.config.commands, function(item, name) {
      return new item.CommandClass(Object.assign({name: name}, item.options))
    })
  }

  getSurfaceCommandNames() {
    var commands = this.getCommands();
    var commandNames = commands.map(function(C) {
      return C.name
    });
    return commandNames
  }

  
  getConverterRegistry() {
    if (!this.converterRegistry) {
      var converterRegistry = new Registry();
      forEach(this.config.converters, function(converters, name) {
        converterRegistry.add(name, new Registry(converters));
      });
      this.converterRegistry = converterRegistry;
    }
    return this.converterRegistry
  }

  getDropHandlers() {
    return this.config.dropHandlers.slice(0)
  }

  getSeed() {
    return this.config.seed
  }

  getIconProvider() {
    return new FontAwesomeIconProvider(this.config.icons)
  }

  getLabelProvider() {
    return new DefaultLabelProvider(this.config.labels)
  }

  getEditingBehavior() {
    var editingBehavior = new EditingBehavior();
    this.config.editingBehaviors.forEach(function(behavior) {
      behavior.register(editingBehavior);
    });
    return editingBehavior
  }

  getMacros() {
    return this.config.macros
  }

  getKeyboardShortcuts() {
    return this.config.keyboardShortcuts
  }

  getFindAndReplaceConfig() {
    return this.config.findAndReplace
  }

  setFindAndReplaceConfig(config) {
    this.config.findAndReplace = config;
  }

  
  getKeyboardShortcutsByCommand() {
    let keyboardShortcuts = {};
    this.config.keyboardShortcuts.forEach((entry) => {
      if (entry.spec.command) {
        let shortcut = entry.key.toUpperCase();

        if (platform.isMac) {
          shortcut = shortcut.replace(/CommandOrControl/i, '⌘');
          shortcut = shortcut.replace(/Ctrl/i, '^');
          shortcut = shortcut.replace(/Alt/i, '⌥');
          shortcut = shortcut.replace(/\+/g, '');
        } else {
          shortcut = shortcut.replace(/CommandOrControl/i, 'Ctrl');
        }

        keyboardShortcuts[entry.spec.command] = shortcut;
      }
    });
    return keyboardShortcuts
  }

  setDefaultLanguage(lang) {
    this.config.lang = lang;
  }

  getDefaultLanguage() {
    return this.config.lang || 'en_US'
  }

  

  setCommandManagerClass(CommandManagerClass) {
    this.config.CommandManagerClass = CommandManagerClass;
  }

  getCommandManagerClass() {
    return this.config.CommandManagerClass || CommandManager
  }

  setDragManagerClass(DragManagerClass) {
    this.config.DragManagerClass = DragManagerClass;
  }

  getDragManagerClass() {
    return this.config.DragManagerClass || DragManager
  }

  setFileManagerClass(FileManagerClass) {
    this.config.FileManagerClass = FileManagerClass;
  }

  getFileManagerClass() {
    return this.config.FileManagerClass || FileManager
  }

  setGlobalEventHandlerClass(GlobalEventHandlerClass) {
    this.config.GlobalEventHandlerClass = GlobalEventHandlerClass;
  }

  getGlobalEventHandlerClass() {
    return this.config.GlobalEventHandlerClass || GlobalEventHandler
  }

  setKeyboardManagerClass(KeyboardManagerClass) {
    this.config.KeyboardManagerClass = KeyboardManagerClass;
  }

  getKeyboardManagerClass() {
    return this.config.KeyboardManagerClass || KeyboardManager
  }

  setMacroManagerClass(MacroManagerClass) {
    this.config.MacroManagerClass = MacroManagerClass;
  }

  getMacroManagerClass() {
    return this.config.MacroManagerClass || MacroManager
  }

  setMarkersManagerClass(MarkersManagerClass) {
    this.config.MarkersManagerClass = MarkersManagerClass;
  }

  getMarkersManagerClass() {
    return this.config.MarkersManagerClass || MarkersManager
  }

  setSurfaceManagerClass(SurfaceManagerClass) {
    this.config.SurfaceManagerClass = SurfaceManagerClass;
  }

  getSurfaceManagerClass() {
    return this.config.SurfaceManagerClass || SurfaceManager
  }

  setSaveHandlerClass(SaveHandlerClass) {
    this.config.SaveHandlerClass = SaveHandlerClass;
  }

  getSaveHandler() {
    let SaveHandler = this.config.SaveHandlerClass || SaveHandlerStub;
    return new SaveHandler()
  }


}

class UnsupportedNodeComponent extends Component {

  render($$) {
    return $$('pre')
      .addClass('content-node unsupported')
      .attr({
        'data-id': this.props.node.id,
        contentEditable: false
      })
      .append(
        JSON.stringify(this.props.node.properties, null, 2)
      )
  }
}

class Surface extends Component {

  constructor(...args) {
    super(...args);

    
    
    this.editorSession = this.props.editorSession || this.context.editorSession;
    if (!this.editorSession) {
      throw new Error('No EditorSession provided')
    }
    this.name = this.props.name;
    if (!this.name) {
      throw new Error('Surface must have a name.')
    }
    if (this.name.indexOf('/') > -1) {
      
      throw new Error("Surface.name must not contain '/'")
    }
    
    
    this._surfaceId = createSurfaceId(this);

    this.clipboard = new Clipboard(this.editorSession, {
      converterRegistry: this.context.converterRegistry,
      editorOptions: this.editorSession.getConfigurator().getEditorOptions()
    });

    this.domSelection = this.context.domSelection;
    if (!this.domSelection) throw new Error('DOMSelection instance must be provided via context.')

    this.domObserver = null;

    
    
    if (platform.inBrowser) {
      this.documentEl = DefaultDOMElement.wrapNativeElement(window.document);
    }

    
    this.undoEnabled = true;

    
    this._textProperties = {};

    this._state = {
      
      skipNextFocusEvent: false
    };
  }

  getChildContext() {
    return {
      surface: this,
      doc: this.getDocument(),
      
      
      isolatedNodeComponent: null
    }
  }

  didMount() {
    if (this.context.surfaceManager) {
      this.context.surfaceManager.registerSurface(this);
    }
    this.editorSession.onRender('selection', this._onSelectionChanged, this);
  }


  dispose() {
    this.editorSession.off(this);
    this.clipboard.dispose();
    if (this.domObserver) {
      this.domObserver.disconnect();
    }
    if (this.context.surfaceManager) {
      this.context.surfaceManager.unregisterSurface(this);
    }
  }

  didUpdate() {
    this._updateContentEditableState();
  }

  render($$) {
    let tagName = this.props.tagName || 'div';
    let el = $$(tagName)
      .addClass('sc-surface')
      .attr('tabindex', 2)
      .attr('data-surface-id', this.id);

    if (!this.isDisabled()) {
      if (this.isEditable()) {
        
        el.on('keydown', this.onKeyDown);
        
        if (!platform.isIE) {
          el.on('compositionstart', this.onCompositionStart);
        }
        
        
        
        
        if (platform.inBrowser && window.TextEvent && !platform.isIE) {
          el.on('textInput', this.onTextInput);
        } else {
          el.on('keypress', this.onTextInputShim);
        }
      }
      if (!this.isReadonly()) {
        
        el.on('mousedown', this.onMouseDown);
        el.on('contextmenu', this.onContextMenu);
        
        
        el.on('focus', this.onNativeFocus);
        el.on('blur', this.onNativeBlur);
        
        this.clipboard.attach(el);
      }

    }
    return el
  }

  renderNode($$, node) {
    let doc = this.getDocument();
    let componentRegistry = this.getComponentRegistry();
    let ComponentClass = componentRegistry.get(node.type);
    if (!ComponentClass) {
      console.error('Could not resolve a component for type: ' + node.type);
      ComponentClass = UnsupportedNodeComponent;
    }
    return $$(ComponentClass, {
      placeholder: this.props.placeholder,
      doc: doc,
      node: node
    }).ref(node.id)
  }

  getComponentRegistry() {
    return this.context.componentRegistry || this.props.componentRegistry
  }

  getName() {
    return this.name
  }

  getId() {
    return this._surfaceId
  }

  isDisabled() {
    return this.props.disabled
  }

  isEditable() {
    return (this.props.editing === "full" || this.props.editing === undefined)
  }

  isSelectable() {
    return (this.props.editing === "selection" || this.props.editing === "full")
  }

  isReadonly() {
    return this.props.editing === "readonly"
  }

  getElement() {
    return this.el
  }

  getDocument() {
    return this.editorSession.getDocument()
  }

  getEditorSession() {
    return this.editorSession
  }

  isEnabled() {
    return !this.state.disabled
  }

  isContainerEditor() {
    return false
  }

  isCustomEditor() {
    return false
  }

  hasNativeSpellcheck() {
    return this.props.spellcheck === 'native'
  }

  getContainerId() {
    return null
  }

  focus() {
    if (this.editorSession.getFocusedSurface() !== this) {
      this.selectFirst();
    }
  }

  blur() {
    if (this.editorSession.getFocusedSurface() === this) {
      this.editorSession.setSelection(null);
    }
  }

  selectFirst() {
    throw new Error('This method is abstract.')
  }

  
  rerenderDOMSelection() {
    if (this.isDisabled()) return
    if (platform.inBrowser) {
      
      let sel = this.editorSession.getSelection();
      if (sel.surfaceId === this.getId()) {
        this.domSelection.setSelection(sel);
        
        
        
        const scrollPane = this.context.scrollPane;
        if (scrollPane) {
          this.context.scrollPane.onSelectionPositioned();
        }
      }
    }
  }

  getDomNodeForId(nodeId) {
    return this.el.getNativeElement().querySelector('*[data-id="'+nodeId+'"]')
  }

  

  
  onKeyDown(event) {
    if (!this._shouldConsumeEvent(event)) return
    

    
    if ( event.key === 'Dead' ) return

    
    let custom = this.editorSession.keyboardManager.onKeydown(event);
    if (!custom) {
      
      switch ( event.keyCode ) {
        
        case keys$1.LEFT:
        case keys$1.RIGHT:
          return this._handleLeftOrRightArrowKey(event)
        case keys$1.UP:
        case keys$1.DOWN:
          return this._handleUpOrDownArrowKey(event)
        case keys$1.HOME:
        case keys$1.END:
          return this._handleHomeOrEndKey(event)
        case keys$1.PAGEUP:
        case keys$1.PAGEDOWN:
          return this._handlePageUpOrDownKey(event)
        
        case keys$1.ENTER:
          return this._handleEnterKey(event)
        case keys$1.TAB:
          return this._handleTabKey(event)
        case keys$1.BACKSPACE:
        case keys$1.DELETE:
          return this._handleDeleteKey(event)
        case keys$1.ESCAPE:
          return this._handleEscapeKey(event)
        default:
          break
      }
    }
  }

  onTextInput(event) {
    if (!this._shouldConsumeEvent(event)) return
    
    event.preventDefault();
    event.stopPropagation();
    if (!event.data) return

    let text = event.data;
    if (!this.editorSession.keyboardManager.onTextInput(text)) {
      this.editorSession.transaction((tx) => {
        tx.insertText(text);
      }, { action: 'type' });
    }
  }

  
  onCompositionStart(event) {
    if (!this._shouldConsumeEvent(event)) return
  }

  
  onTextInputShim(event) {
    if (!this._shouldConsumeEvent(event)) return
    
    if (
      
      event.which === 0 || event.charCode === 0 ||
      
      event.keyCode === keys$1.TAB || event.keyCode === keys$1.ESCAPE ||
      
      Boolean(event.metaKey) || (Boolean(event.ctrlKey)^Boolean(event.altKey))
    ) {
      return
    }
    let character = String.fromCharCode(event.which);
    if (!event.shiftKey) {
      character = character.toLowerCase();
    }
    event.preventDefault();
    event.stopPropagation();
    if (!this.editorSession.keyboardManager.onTextInput(character)) {
      if (character.length>0) {
        this.editorSession.transaction((tx) => {
          tx.insertText(character);
        }, { action: 'type' });
      }
    }
  }

  
  
  
  
  
  onMouseDown(event) {
    if (!this._shouldConsumeEvent(event)) {
      
      return
    }

    
    
    
    
    
    if (event.__reserved__) {
      
      return
    } else {
      
      event.__reserved__ = this;
    }

    
    
    
    if (this.isEditable()) {
      this.el.setAttribute('contenteditable', true);
    }

    
    if ( event.button !== 0 ) {
      return
    }

    
    if (!(platform.isIE && platform.version<12) && event.detail >= 3) {
      let sel = this.getEditorSession().getSelection();
      if (sel.isPropertySelection()) {
        this._selectProperty(sel.path);
        event.preventDefault();
        event.stopPropagation();
        return
      } else if (sel.isContainerSelection()) {
        this._selectProperty(sel.startPath);
        event.preventDefault();
        event.stopPropagation();
        return
      }
    }
    
    
    
    
    this._state.skipNextFocusEvent = true;

    
    if (this.documentEl) {
      
      this.documentEl.on('mouseup', this.onMouseUp, this, { once: true });
    }
  }

  onMouseUp(e) {
    
    
    
    
    
    e.stopPropagation();
    
    
    
    
    setTimeout(function() {
      let sel = this.domSelection.getSelection();
      this._setSelection(sel);
    }.bind(this));
  }

  
  
  
  onContextMenu(event) {
    if (!this._shouldConsumeEvent(event)) return
    let sel = this.domSelection.getSelection();
    this._setSelection(sel);
  }

  onNativeBlur() {
    
    let _state = this._state;
    _state.hasNativeFocus = false;
  }

  onNativeFocus() {
    
    let _state = this._state;
    _state.hasNativeFocus = true;
  }

  


  _onSelectionChanged(selection) {
    let newMode = this._deriveModeFromSelection(selection);
    if (this.state.mode !== newMode) {
      this.extendState({
        mode: newMode
      });
    }
  }

  
  _deriveModeFromSelection(sel) {
    if (!sel) return null
    let surfaceId = sel.surfaceId;
    let id = this.getId();
    let mode;
    if (startsWith(surfaceId, id)) {
      if (surfaceId.length === id.length) {
        mode = 'focused';
      } else {
        mode = 'co-focused';
      }
    }
    return mode
  }

  _updateContentEditableState() {
    
    
    
    
    
    let enableContenteditable = false;
    if (this.isEditable() && !this.props.disabled) {
      enableContenteditable = true;
      if (this.state.mode === 'co-focused') {
        let selState = this.context.editorSession.getSelectionState();
        let sel = selState.getSelection();
        let surface = this.context.surfaceManager.getSurface(sel.surfaceId);
        if (surface) {
          let isolatedNodeComponent = surface.context.isolatedNodeComponent;
          if (isolatedNodeComponent) {
            enableContenteditable = isolatedNodeComponent.isOpen();
          }
        }
      }
    }
    if (enableContenteditable) {
      this.el.setAttribute('contenteditable', true);
    } else {
      
      this.el.removeAttribute('contenteditable');
    }
  }

  _blur() {
    if (this.el) {
      this.el.blur();
    }
  }

  _focus() {
    if (this.isDisabled()) return
    
    
    
    if (platform.isFF) {
      this.domSelection.clear();
      this.el.getNativeElement().blur();
    }
    this._focusElement();
  }

  _focusElement() {
    this._state.hasNativeFocus = true;
    
    
    
    
    if (this.el && !platform.isWebkit) {
      this._state.skipNextFocusEvent = true;
      
      
      this.el.focus();
      this._state.skipNextFocusEvent = false;
    }
  }

  _handleLeftOrRightArrowKey(event) {
    event.stopPropagation();
    let direction = (event.keyCode === keys$1.LEFT) ? 'left' : 'right';
    
    
    window.setTimeout(function() {
      this._updateModelSelection({direction});
    }.bind(this));
  }

  _handleUpOrDownArrowKey(event) {
    event.stopPropagation();
    
    
    window.setTimeout(function() {
      let options = {
        direction: (event.keyCode === keys$1.UP) ? 'left' : 'right'
      };
      this._updateModelSelection(options);
    }.bind(this));
  }

  _handleHomeOrEndKey(event) {
    event.stopPropagation();
    
    
    window.setTimeout(function() {
      let options = {
        direction: (event.keyCode === keys$1.HOME) ? 'left' : 'right'
      };
      this._updateModelSelection(options);
    }.bind(this));
  }

  _handlePageUpOrDownKey(event) {
    event.stopPropagation();
    
    
    window.setTimeout(function() {
      let options = {
        direction: (event.keyCode === keys$1.PAGEUP) ? 'left' : 'right'
      };
      this._updateModelSelection(options);
    }.bind(this));
  }

  _handleTabKey(event) {
    event.stopPropagation();
    if (this.props.handleTab === false) {
      event.preventDefault();
      this.el.emit('tab', {
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
        code: event.code
      });
    } else {
      window.setTimeout(()=>{
        this._updateModelSelection();
      });
    }
  }

  _handleEnterKey(event) {
    event.preventDefault();
    event.stopPropagation();
    this.editorSession.transaction((tx) => {
      tx.break();
    }, { action: 'break' });
  }

  _handleEscapeKey() {}

  _handleDeleteKey(event) {
    event.preventDefault();
    event.stopPropagation();
    let direction = (event.keyCode === keys$1.BACKSPACE) ? 'left' : 'right';
    this.editorSession.transaction((tx) => {
      tx.deleteCharacter(direction);
    }, { action: 'delete' });
  }

  _hasNativeFocus() {
    return Boolean(this._state.hasNativeFocus)
  }

  _setSelection(sel) {
    
    
    
    
    
    
    
    
    if (!sel.isNull() && sel.surfaceId === this.id && platform.isFF) {
      this._focusElement();
    }
    this.editorSession.setSelection(sel);
  }

  _updateModelSelection(options) {
    let sel = this.domSelection.getSelection(options);
    
    
    
    this._setSelection(sel);
  }

  _selectProperty(path) {
    let doc = this.getDocument();
    let text = doc.get(path);
    this._setSelection(doc.createSelection({
      type: 'property',
      path: path,
      startOffset: 0,
      endOffset: text.length
    }));
  }

  
  
  _registerTextProperty(textPropertyComponent) {
    let path = textPropertyComponent.getPath();
    this._textProperties[path] = textPropertyComponent;
  }

  _unregisterTextProperty(textPropertyComponent) {
    let path = textPropertyComponent.getPath();
    if (this._textProperties[path] === textPropertyComponent) {
      delete this._textProperties[path];
    }
  }

  _getTextPropertyComponent(path) {
    return this._textProperties[path]
  }

  
  
  _renderNode($$, nodeId) {
    let doc = this.getDocument();
    let node = doc.get(nodeId);
    let componentRegistry = this.context.componentRegistry || this.props.componentRegistry;
    let ComponentClass = componentRegistry.get(node.type);
    if (!ComponentClass) {
      console.error('Could not resolve a component for type: ' + node.type);
      ComponentClass = UnsupportedNodeComponent;
    }
    return $$(ComponentClass, {
      doc: doc,
      node: node
    })
  }

  
  _shouldConsumeEvent(event) {
    
    let comp = Component.unwrap(event.target);
    return (comp && (comp === this || comp.context.surface === this))
  }

  
  getSelectionFromEvent(event) {
    let domRange = getDOMRangeFromEvent(event);
    let sel = this.domSelection.getSelectionForDOMRange(domRange);
    sel.surfaceId = this.getId();
    return sel;
  }

  setSelectionFromEvent(event) {
    let sel = this.getSelectionFromEvent(event);
    if (sel) {
      this._state.skipNextFocusEvent = true;
      this._setSelection(sel);
    } else {
      console.error('Could not create a selection from event.');
    }
  }

  get id() {
    return this._surfaceId
  }

}

Surface.prototype._isSurface = true;


function createSurfaceId(surface) {
  let isolatedNodeComponent = surface.context.isolatedNodeComponent;
  if (isolatedNodeComponent) {
    let parentSurface = isolatedNodeComponent.context.surface;
    
    if (surface.isContainerEditor()) {
      if (isolatedNodeComponent._isInlineNodeComponent) {
        return parentSurface.id + '/' + isolatedNodeComponent.props.node.id + '/' + surface.name
      } else {
        return parentSurface.id + '/' + surface.name
      }
    }
    
    else {
      return parentSurface.id + '/' + isolatedNodeComponent.props.node.id + '/' + surface.name
    }
  } else {
    return surface.name
  }
}

class ContainerEditor extends Surface {

  constructor(parent, props, el) {
    
    props.containerId = props.containerId || props.node.id;
    props.name = props.name || props.containerId || props.node.id;

    super(parent, props, el);

    this.containerId = this.props.containerId;
    if (!isString$1(this.containerId)) {
      throw new Error("Property 'containerId' is mandatory.")
    }
    let doc = this.getDocument();
    this.container = doc.get(this.containerId);
    if (!this.container) {
      throw new Error('Container with id ' + this.containerId + ' does not exist.')
    }

    this.editingBehavior = this.context.editingBehavior || new EditingBehavior();

    this._deriveInternalState(this.props);
  }

  
  shouldRerender(newProps) {
    if (newProps.disabled !== this.props.disabled) return true
    
    
    return false
  }

  willReceiveProps(newProps) {
    super.willReceiveProps.apply(this, arguments);
    this._deriveInternalState(newProps);
  }

  didMount() {
    super.didMount.apply(this, arguments);
    let editorSession = this.getEditorSession();
    editorSession.onUpdate('document', this._onContainerChanged, this, {
      path:  this.container.getContentPath()
    });
    this._attachPlaceholder();
  }

  dispose() {
    super.dispose.apply(this, arguments);
    let editorSession = this.getEditorSession();
    editorSession.off(this);
  }

  render($$) {
    let el = super.render($$);

    let doc = this.getDocument();
    let containerId = this.getContainerId();
    let containerNode = doc.get(containerId);
    if (!containerNode) {
      console.warn('No container node found for ', containerId);
    }
    el.addClass('sc-container-editor container-node ' + containerId)
      .attr("data-id", containerId);

    
    el.attr('spellcheck', this.props.spellcheck === 'native');

    containerNode.getNodes().forEach(function(node, index) {
      el.append(this._renderNode($$, node, index));
    }.bind(this));

    
    if (!this.props.disabled && !this.isEmpty()) {
      el.addClass('sm-enabled');
      el.setAttribute('contenteditable', true);
    }

    return el
  }

  selectFirst() {
    const container = this.getContainer();
    if (container.getLength() > 0) {
      const editorSession = this.getEditorSession();
      const first = container.getChildAt(0);
      setCursor(editorSession, first, container.id, 'before');
    }
  }

  _renderNode($$, node, nodeIndex) {
    let props = { node };
    if (!node) throw new Error('Illegal argument')
    if (node.isText()) {
      return super.renderNode($$, node, nodeIndex)
    } else {
      let componentRegistry = this.context.componentRegistry;
      let ComponentClass = componentRegistry.get(node.type);
      if (ComponentClass.prototype._isCustomNodeComponent || ComponentClass.prototype._isIsolatedNodeComponent) {
        return $$(ComponentClass, props).ref(node.id)
      } else {
        return $$(IsolatedNodeComponent, props).ref(node.id)
      }
    }
  }

  _deriveInternalState(props) {
    let _state = this._state;
    if (!props.hasOwnProperty('enabled') || props.enabled) {
      _state.enabled = true;
    } else {
      _state.enabled = false;
    }
  }

  _selectNextIsolatedNode(direction) {
    let selState = this.getEditorSession().getSelectionState();
    let node = (direction === 'left') ? selState.getPreviousNode() : selState.getNextNode();
    let isIsolatedNode = !node.isText() && !node.isList();
    if (!node || !isIsolatedNode) return false
    if (
      (direction === 'left' && selState.isFirst()) ||
      (direction === 'right' && selState.isLast())
    ) {
      this.getEditorSession().setSelection({
        type: 'node',
        nodeId: node.id,
        containerId: selState.getContainer().id,
        surfaceId: this.id
      });
      return true
    }
    return false
  }

  _handleLeftOrRightArrowKey(event) {
    event.stopPropagation();
    const doc = this.getDocument();
    const sel = this.getEditorSession().getSelection();
    const left = (event.keyCode === keys$1.LEFT);
    const right = !left;
    const direction = left ? 'left' : 'right';

    if (sel && !sel.isNull()) {
      const container = doc.get(sel.containerId, 'strict');

      
      if (sel.isNodeSelection()) {
        let nodePos = container.getPosition(doc.get(sel.getNodeId()));
        if ((left && nodePos === 0) || (right && nodePos === container.length-1)) {
          event.preventDefault();
          return
        }
      }

      if (sel.isNodeSelection() && !event.shiftKey) {
        this.domSelection.collapse(direction);
      }
    }

    window.setTimeout(() => {
      this._updateModelSelection({ direction });
    });
  }

  _handleUpOrDownArrowKey(event) {
    event.stopPropagation();
    const doc = this.getDocument();
    const sel = this.getEditorSession().getSelection();
    const up = (event.keyCode === keys$1.UP);
    const down = !up;
    const direction = up ? 'left' : 'right';

    if (sel && !sel.isNull()) {
      const container = doc.get(sel.containerId, 'strict');
      
      if (sel.isNodeSelection()) {
        let nodePos = container.getPosition(doc.get(sel.getNodeId()));
        if ((up && nodePos === 0) || (down && nodePos === container.length-1)) {
          event.preventDefault();
          return
        }
        
        
        let editorSession = this.getEditorSession();
        
        
        
        if (!event.shiftKey) {
          event.preventDefault();
          if (up) {
            let prev = container.getChildAt(nodePos-1);
            setCursor(editorSession, prev, sel.containerId, 'after');
            return
          } else {
            let next = container.getChildAt(nodePos+1);
            setCursor(editorSession, next, sel.containerId, 'before');
            return
          }
        }
      }
    }

    window.setTimeout(() => {
      this._updateModelSelection({ direction });
    });
  }

  _handleTabKey(event) {
    const editorSession = this.getEditorSession();
    const sel = editorSession.getSelection();
    if (sel.isNodeSelection() && sel.isFull()) {
      const comp = this.refs[sel.getNodeId()];
      if (comp && stepIntoIsolatedNode(editorSession, comp)) {
        event.preventDefault();
        event.stopPropagation();
        return
      }
    }
    super._handleTabKey(event);
  }

  
  isContainerEditor() {
    return true
  }

  
  getContainerId() {
    return this.containerId
  }

  getContainer() {
    return this.getDocument().get(this.getContainerId())
  }

  isEmpty() {
    let containerNode = this.getContainer();
    return (containerNode && containerNode.length === 0)
  }

  
  _attachPlaceholder() {
    let firstNode = this.childNodes[0];
    
    if (this.placeholderNode) {
      this.placeholderNode.extendProps({
        placeholder: undefined
      });
    }

    if (this.childNodes.length === 1 && this.props.placeholder) {
      firstNode.extendProps({
        placeholder: this.props.placeholder
      });
      this.placeholderNode = firstNode;
    }
  }

  isEditable() {
    return super.isEditable.call(this) && !this.isEmpty()
  }

  
  _onContainerChanged(change) {
    let doc = this.getDocument();
    
    let renderContext = RenderingEngine.createContext(this);
    let $$ = renderContext.$$;
    let container = this.getContainer();
    let path = container.getContentPath();
    for (let i = 0; i < change.ops.length; i++) {
      let op = change.ops[i];
      if (op.type === "update" && op.path[0] === path[0]) {
        let diff$$1 = op.diff;
        if (diff$$1.type === "insert") {
          let nodeId = diff$$1.getValue();
          let node = doc.get(nodeId);
          let nodeEl;
          if (node) {
            nodeEl = this._renderNode($$, node);
          } else {
            
            
            
            nodeEl = $$('div');
          }
          this.insertAt(diff$$1.getOffset(), nodeEl);
        } else if (diff$$1.type === "delete") {
          this.removeAt(diff$$1.getOffset());
        }
      }
    }
    this._attachPlaceholder();
  }

}

ContainerEditor.prototype._isContainerEditor = true;

class CustomSurface extends Component {

  constructor(...args) {
    super(...args);

    this._name = this._getCustomResourceId();
    this._surfaceId = this._createSurfaceId();
  }

  didMount() {
    const surfaceManager = this.context.editorSession.surfaceManager;
    surfaceManager.registerSurface(this);
  }

  dispose() {
    const surfaceManager = this.context.editorSession.surfaceManager;
    surfaceManager.unregisterSurface(this);
  }

  rerenderDOMSelection() {
    
  }

  get name() {
    return this._name
  }

  getId() {
    return this._surfaceId
  }

  getContainer() {
    return undefined
  }

  getContainerId() {
    return undefined
  }

  isContainerEditor() {
    return false
  }

  isCustomEditor() {
    return true
  }

  isDisabled() {
    return Boolean(this.props.disabled)
  }

  _focus() {
    
  }

  _createSurfaceId() {
    let isolatedNodeComponent = this.context.isolatedNodeComponent;
    if (isolatedNodeComponent) {
      let parentSurface = isolatedNodeComponent.context.surface;
      return parentSurface.id + '/' + isolatedNodeComponent.props.node.id + '/' + this._name
    } else {
      return this._name
    }
  }

  _getCustomResourceId() {
    throw new Error('This method needs to be implemented by a CustomSurface')
  }

}

function findParentComponent(el) {
  while (el) {
    const comp = Component.unwrap(el);
    if (comp) return comp
    el = el.parentNode;
  }
}

function setDOMSelection(startNode, startOffset, endNode, endOffset) {
  let wsel = window.getSelection();
  let wrange = window.document.createRange();
  if (startNode._isDOMElement) {
    startNode = startNode.getNativeElement();
  }
  if (!endNode) {
    endNode = startNode;
    endOffset = startOffset;
  }
  if (endNode._isDOMElement) {
    endNode = endNode.getNativeElement();
  }
  wrange.setStart(startNode, startOffset);
  wrange.setEnd(endNode, endOffset);
  wsel.removeAllRanges();
  wsel.addRange(wrange);
}

class EditAnnotationCommand extends Command {

  constructor(...args) {
    super(...args);

    if (!this.config.nodeType) {
      throw new Error("'nodeType' is required")
    }
  }

  
  getCommandState(params) {
    let sel = this._getSelection(params);
    let annos = this._getAnnotationsForSelection(params);
    let newState = {
      disabled: true,
    };
    if (annos.length === 1 && sel.isPropertySelection() && sel.isCollapsed()) {
      newState.disabled = false;
      newState.showInContext = true;
      newState.nodeId = annos[0].id;
    }
    return newState
  }

  execute(params) { } 

  _getAnnotationsForSelection(params) {
    return params.selectionState.getAnnotationsForType(this.config.nodeType)
  }
}

class EditInlineNodeCommand extends Command {
  constructor(...args) {
    super(...args);
    if (!this.config.nodeType) {
      throw new Error('Every AnnotationCommand must have a nodeType')
    }
  }

  getCommandState(params) {
    let sel = params.selection;
    let newState = {
      disabled: true,
      active: false
    };
    let annos = this._getAnnotationsForSelection(params);
    if (annos.length === 1 && annos[0].getSelection().equals(sel)) {
      newState.disabled = false;
      newState.nodeId = annos[0].id;
    }
    return newState
  }

  execute(params) { 

  }

  _getAnnotationsForSelection(params) {
    return params.selectionState.getAnnotationsForType(this.config.nodeType)
  }

}

class EditorSession extends EventEmitter {

  constructor(doc, options) {
    super();
    options = options || {};

    this.__id__ = uuid();
    this.document = doc;
    const configurator = options.configurator;
    if (!configurator) {
      throw new Error('No configurator provided.')
    }
    this.configurator = configurator;

    this._transaction = new Transaction(doc);
    
    
    _patchTxSetSelection(this._transaction, this);

    this._history = new ChangeHistory();
    
    this._currentChange = null;

    
    
    
    
    this._selectionState = new SelectionState(doc);

    this._commandStates = [];

    
    this._resources = ['document', 'selection', 'commandStates'];
    
    this._dirtyFlags = {};
    
    this._change = null;
    this._info = null;

    this._flowStages = ['update', 'pre-render', 'render', 'post-render', 'position', 'finalize'];
    
    this._postponed = [];
    this._observers = {};

    this._lang = options.lang || this.configurator.getDefaultLanguage();
    this._dir = options.dir || 'ltr';

    
    
    const CommandManager = configurator.getCommandManagerClass();
    const DragManager = configurator.getDragManagerClass();
    const FileManager = configurator.getFileManagerClass();
    const GlobalEventHandler = configurator.getGlobalEventHandlerClass();
    const KeyboardManager = configurator.getKeyboardManagerClass();
    const MacroManager = configurator.getMacroManagerClass();
    const MarkersManager = configurator.getMarkersManagerClass();
    const SurfaceManager = configurator.getSurfaceManagerClass();


    
    
    this.surfaceManager = new SurfaceManager(this);
    
    this._context = {
      editorSession: this,
      
      surfaceManager: this.surfaceManager,
    };
    
    if (options.context) {
      Object.assign(this._context, options.context);
    }

    let commands = configurator.getCommands();
    let dropHandlers = configurator.getDropHandlers();
    let macros = configurator.getMacros();
    let converterRegistry = configurator.getConverterRegistry();
    let editingBehavior = configurator.getEditingBehavior();

    this.fileManager = options.fileManager || new FileManager(this, configurator.getFileAdapters(), this._context);

    
    this._hasUnsavedChanges = false;
    this._isSaving = false;

    if (options.saveHandler) {
      this.saveHandler = options.saveHandler;
    } else {
      this.saveHandler = configurator.getSaveHandler();
    }

    
    this._managers = {};
    forEach(configurator.getManagers(), (ManagerClass, name) => {
      this._managers[name] = new ManagerClass(this._context);
    });

    
    this.commandManager = new CommandManager(this._context, commands);

    
    
    this.dragManager = new DragManager(dropHandlers, Object.assign({}, this._context, {
      commandManager: this.commandManager
    }));
    
    this.macroManager = new MacroManager(this._context, macros);
    this.globalEventHandler = new GlobalEventHandler(this, this.surfaceManager);
    this.markersManager = new MarkersManager(this);
    this.keyboardManager = new KeyboardManager(this, configurator.getKeyboardShortcuts(), {
      context: this._context
    });

    
    this.converterRegistry = converterRegistry;
    this.editingBehavior = editingBehavior;
  }

  dispose() {
    this._transaction.dispose();
    this.surfaceManager.dispose();
    this.fileManager.dispose();
    this.commandManager.dispose();
    this.dragManager.dispose();
    this.macroManager.dispose();
    this.globalEventHandler.dispose();
    this.markersManager.dispose();
  }

  hasChanged(resource) {
    return this._dirtyFlags[resource]
  }

  hasDocumentChanged() {
    return this.hasChanged('document')
  }

  hasSelectionChanged() {
    return this.hasChanged('selection')
  }

  hasCommandStatesChanged() {
    return this.hasChanged('commandStates')
  }

  hasLanguageChanged() {
    return this.hasChanged('lang')
  }

  hasTextDirectionChanged() {
    return this.hasChanged('dir')
  }

  get(resourceName) {
    switch(resourceName) {
      case 'document':
        return this.getDocument()
      case 'selection':
        return this.getSelection()
      case 'commandStates':
        return this.getCommandStates()
      case 'change':
        return this.getChange()
      default:
        throw new Error('Unknown resource: ' + resourceName)
    }
  }

  getConfigurator() {
    return this.configurator
  }

  getContext() {
    return this._context
  }

  getDocument() {
    return this.document
  }

  getManager(name) {
    return this._managers[name]
  }

  getSelection() {
    return this.getSelectionState().getSelection()
  }

  getSelectionState() {
    return this._selectionState
  }

  getCommandStates() {
    return this._commandStates
  }

  getChange() {
    return this._change
  }

  getChangeInfo() {
    return this._info
  }

  getFocusedSurface() {
    return this.surfaceManager.getFocusedSurface()
  }

  getSurface(surfaceId) {
    return this.surfaceManager.getSurface(surfaceId)
  }

  getLanguage() {
    return this._lang
  }

  getTextDirection() {
    return this._dir
  }

  canUndo() {
    return this._history.canUndo()
  }

  canRedo() {
    return this._history.canRedo()
  }

  executeCommand(...args) {
    this.commandManager.executeCommand(...args);
  }

  
  attachEditor(editor) {
    this.editor = editor;
  }

  detachEditor() {
    this.editor = undefined;
  }

  getEditor() {
    return this.editor
  }

  setSelection(sel, skipFlow) {
    
    if (sel && isPlainObject$1(sel)) {
      sel = this.getDocument().createSelection(sel);
    }
    if (sel && !sel.isNull()) {
      if (!sel.surfaceId) {
        let fs = this.getFocusedSurface();
        if (fs) {
          sel.surfaceId = fs.id;
        }
      }
    }

    _addSurfaceId(sel, this);
    _addContainerId(sel, this);

    if (this._setSelection(sel) && !skipFlow) {
      this.startFlow();
    }
    return sel
  }

  selectNode(nodeId) {
    let surface = this.getFocusedSurface();
    this.setSelection({
      type: 'node',
      nodeId: nodeId,
      containerId: surface.getContainerId(),
      surfaceId: surface.id
    });
  }

  setCommandStates(commandStates) {
    this._commandStates = commandStates;
    this._setDirty('commandStates');
  }

  setLanguage(lang) {
    if (this._lang !== lang) {
      this._lang = lang;
      this._setDirty('lang');
      this.startFlow();
    }
  }

  setTextDirection(dir) {
    if (this._dir !== dir) {
      this._dir = dir;
      this._setDirty('dir');
      this.startFlow();
    }
  }

  createSelection() {
    const doc = this.getDocument();
    return doc.createSelection.apply(doc, arguments)
  }

  getCollaborators() {
    return null
  }

  
  setSaveHandler(saveHandler) {
    this.saveHandler = saveHandler;
  }

  
  transaction(transformation, info) {
    const t = this._transaction;
    info = info || {};
    t._sync();
    let change = t._recordChange(transformation, this.getSelection(), this.getFocusedSurface());
    if (change) {
      this._commit(change, info);
    } else {
      
      this._setSelection(this._transaction.getSelection());
      this.startFlow();
    }
    return change
  }

  undo() {
    this._undoRedo('undo');
  }

  redo() {
    this._undoRedo('redo');
  }



  on(...args) {
    let name = args[0];
    if (this._flowStages.indexOf(name) >= 0) {
      
      args.shift();
      let options = args[2] || {};
      let resource = options.resource;
      if (resource) {
        delete options.resource;
        args.unshift(resource);
      }
      this._registerObserver(name, args);
    } else {
      EventEmitter.prototype.on.apply(this, args);
    }
  }

  off(...args) {
    if (args.length === 1) {
      let observer = args[0];
      super.off(...args);
      
      
      if (observer[this.__id__]) {
        const records = observer[this.__id__];
        delete observer[this.__id__];
        records.forEach((record) => {
          this.__deregisterObserver(record);
        });
      }
    } else {
      const stage = args[0];
      const method = args[1];
      const observer = args[2];
      this._deregisterObserver(stage, method, observer);
    }
  }

  
  onUpdate(...args) {
    return this._registerObserver('update', args)
  }

  onPreRender(...args) {
    return this._registerObserver('pre-render', args)
  }

  
  onRender(...args) {
    return this._registerObserver('render', args)
  }

  
  onPostRender(...args) {
    return this._registerObserver('post-render', args)
  }

  
  onPosition(...args) {
    return this._registerObserver('position', args)
  }

  onFinalize(...args) {
    return this._registerObserver('finalize', args)
  }

  _setSelection(sel) {
    let hasChanged = this.getSelectionState().setSelection(sel);
    if (hasChanged) this._setDirty('selection');
    return hasChanged
  }

  _undoRedo(which) {
    const doc = this.getDocument();
    var from, to;
    if (which === 'redo') {
      from = this._history.undoneChanges;
      to = this._history.doneChanges;
    } else {
      from = this._history.doneChanges;
      to = this._history.undoneChanges;
    }
    var change = from.pop();
    if (change) {
      this._applyChange(change, {});
      this._transaction.__applyChange__(change);
      
      to.push(change.invert());
      
      let sel = change.after.selection;
      if (sel) sel.attach(doc);
      this._setSelection(sel);
      
      this.startFlow();
    } else {
      console.warn('No change can be %s.', (which === 'undo'? 'undone':'redone'));
    }
  }

  _transformLocalChangeHistory(externalChange) {
    
    
    
    
    var clone$$1 = {
      ops: externalChange.ops.map(function(op) { return op.clone(); })
    };
    transformDocumentChange(clone$$1, this._history.doneChanges);
    transformDocumentChange(clone$$1, this._history.undoneChanges);
  }

  _transformSelection(change) {
    var oldSelection = this.getSelection();
    var newSelection = transformSelection(oldSelection, change);
    
    return newSelection
  }

  _commit(change, info) {
    this._commitChange(change, info);
    
    this._hasUnsavedChanges = true;
    this.startFlow();
  }

  _commitChange(change, info) {
    change.timestamp = Date.now();
    this._applyChange(change, info);
    if (info['history'] !== false && !info['hidden']) {
      this._history.push(change.invert());
    }
    var newSelection = change.after.selection || Selection.nullSelection;
    
    
    if (!newSelection.isNull() && !newSelection.surfaceId) {
      newSelection.surfaceId = change.after.surfaceId;
    }
    this._setSelection(newSelection);
  }

  _applyChange(change, info) {
    if (!change) {
      console.error('FIXME: change is null.');
      return
    }
    const doc = this.getDocument();
    doc._apply(change);
    doc._notifyChangeListeners(change, info);
    this._setDirty('document');
    this._change = change;
    this._info = info;
  }

  
  hasUnsavedChanges() {
    return this._hasUnsavedChanges
  }

  
  save() {
    var saveHandler = this.saveHandler;

    if (this._hasUnsavedChanges && !this._isSaving) {
      this._isSaving = true;
      
      if (saveHandler) {
        let saveParams = {
          editorSession: this,
          fileManager: this.fileManager
        };
        return saveHandler.saveDocument(saveParams)
        .then(() => {
          this._hasUnsavedChanges = false;
          
          
          
          
          this.setSelection(this.getSelection());
        })
        .catch((err) => {
          console.error('Error during save', err);
        }).then(() => { 
          this._isSaving = false;
        })
      } else {
        console.error('Document saving is not handled at the moment. Make sure saveHandler instance provided to editorSession');
        return Promise.reject()
      }
    }
  }

  
  startFlow() {
    if (this._flowing) {
      throw new Error('Already in a flow. You need to postpone the update.')
    }
    this._flowing = true;
    try {
      this.performFlow();
    } finally {
      this._resetFlow();
      this._flowing = false;
    }
    
    
    
    const postponed = this._postponed;
    const self = this;
    this._postponed = [];
    setTimeout(function() {
      postponed.forEach(function(fn) {
        fn(self);
      });
    }, 0);
  }

  
  performFlow() {
    this._flowStages.forEach((stage) => {
      this._notifyObservers(stage);
    });
  }

  postpone(fn) {
    this._postponed.push(fn);
  }

  _parseObserverArgs(args) {
    let params = { stage: null, resource: null, handler: null, context: null, options: {} };
    
    let idx = 0;
    let arg = args[idx];
    if (isString$1(arg)) {
      params.resource = arg;
      idx++;
      arg = args[idx];
    }
    if (!arg) {
      throw new Error('Provided handler function was nil.')
    }
    if (!isFunction$1(arg)) {
      throw new Error('Expecting a handler Function.')
    }
    params.handler = arg;
    idx++;
    arg = args[idx];
    if (arg) {
      params.context = arg;
      idx++;
      arg = args[idx];
    }
    if (arg) {
      params.options = arg;
    }
    return params
  }

  

  _registerObserver(stage, args) {
    
    
    let record = this._parseObserverArgs(args);
    record.stage = stage;
    this.__registerObserver(stage, record);
  }

  __registerObserver(stage, record) {
    
    
    if (record.context) {
      const observer = record.context;
      if (!observer[this.__id__]) {
        observer[this.__id__] = [];
      }
      observer[this.__id__].push(record);
    }
    let observers = this._observers[stage];
    if (!observers) {
      observers = this._observers[stage] = [];
    }
    observers.push(record);
  }

  
  _deregisterObserver(stage, method, observer) {
    let self = this; 
    if (arguments.length === 1) {
      
      
      forEach(self._observers, (observers) => {
        for (let i = observers.length-1; i >=0 ; i--) {
          const o = observers[i];
          if (o.context === observer) {
            observers.splice(i, 1);
            o._deregistered = true;
          }
        }
      });
    } else {
      let observers = self._observers[stage];
      
      
      if (!observers) {
        EventEmitter.prototype.off.apply(self, arguments);
      } else {
        for (let i = observers.length-1; i >= 0; i--) {
          let o = observers[i];
          if (o.handler === method && o.context === observer) {
            observers.splice(i, 1);
            o._deregistered = true;
          }
        }
      }
    }
  }

  __deregisterObserver(record) {
    const stage = record.stage;
    const observers = this._observers[stage];
    const observer = record.context;
    const method = record.handler;
    for (let i = observers.length-1; i >= 0; i--) {
      let o = observers[i];
      if (o.handler === method && o.context === observer) {
        observers.splice(i, 1);
        o._deregistered = true;
      }
    }
  }

  _notifyObservers(stage) {
    
    
    
    
    
    
    let _observers = this._observers[stage];
    if (!_observers) return
    
    
    
    let observers = _observers.slice();
    for (let i = 0; i < observers.length; i++) {
      let o = observers[i];      
      if (o._deregistered) continue
      if (!o.resource) {
        o.handler.call(o.context, this);
      } else if (o.resource === 'document') {
        if (!this.hasDocumentChanged()) continue
        const change = this.getChange();
        const info = this.getChangeInfo();
        const path = o.options.path;
        if (!path) {
          o.handler.call(o.context, change, info, this);
        } else if (change.hasUpdated(path)) {
          o.handler.call(o.context, change, info, this);
        }
      } else {
        if (!this.hasChanged(o.resource)) continue
        const resource = this.get(o.resource);
        o.handler.call(o.context, resource, this);
      }
    }
  }

  _setDirty(resource) {
    this._dirtyFlags[resource] = true;
  }

  _resetFlow() {
    Object.keys(this._dirtyFlags).forEach((resource) => {
      this._dirtyFlags[resource] = false;
    });
    this._change = null;
    this._info = null;
  }

  

  setBlurred(blurred) {
    this._blurred = blurred;
    
    this.commandManager._updateCommandStates(this);
    this._setDirty('commandStates');
  }

  isBlurred() {
    return Boolean(this._blurred)
  }

}

function _patchTxSetSelection(tx, editorSession) {
  tx.setSelection = function(sel) {
    sel = Transaction.prototype.setSelection.call(tx, sel);
    _addSurfaceId(sel, editorSession);
    _addContainerId(sel, editorSession);
    return sel
  };
}


function _addSurfaceId(sel, editorSession) {
  if (sel && !sel.isNull() && !sel.surfaceId) {
    
    let surface = editorSession.getFocusedSurface();
    if (surface) {
      sel.surfaceId = surface.id;
    } else {
      
      console.warn('No focused surface. Selection will not be rendered.');
    }
  }
}

function _addContainerId(sel, editorSession) {
  if (sel && !sel.isNull() && sel.surfaceId && !sel.containerId) {
    let surface = editorSession.getSurface(sel.surfaceId);
    if (surface) {
      let containerId = surface.getContainerId();
      if (containerId) {
        sel.containerId = containerId;
      }
    }
  }
}

class Highlights extends EventEmitter {
  constructor(doc) {
    super();

    this.doc = doc;
    this._highlights = {};
  }

  
  get() {
    return this._highlights
  }

  
  set(highlights) {
    let oldHighlights = this._highlights;
    let doc = this.doc;
    
    forEach(highlights, function(newScopedHighlights, scope) {
      let oldScopedHighlights = oldHighlights[scope] || [];

      
      
      
      let toBeDeleted = without(oldScopedHighlights, newScopedHighlights);
      let toBeAdded = without(newScopedHighlights, oldScopedHighlights);

      
      forEach(toBeDeleted, function(nodeId) {
        let node = doc.get(nodeId);
        
        if (node) {
          if (node.setHighlighted) {
            node.setHighlighted(false, scope);
          } else {
            console.warn('setHighlighted is not defined on target node');
          }
        }
      });

      forEach(toBeAdded, function(nodeId) {
        let node = doc.get(nodeId);
        if (node) {
          if (node.setHighlighted) {
            node.setHighlighted(true, scope);
          } else {
            console.warn('setHighlighted is not defined on target node');
          }
        }
      });
    });

    this._highlights = highlights;

    
    this.emit('highlights:updated', highlights);
  }
}

class InsertInlineNodeCommand extends Command {
  
  constructor(...args) {
    super(...args);
  }

  
  getCommandState(params) {
    let sel = params.selection;
    let newState = {
      disabled: this.isDisabled(params),
      active: false,
      showInContext: this.showInContext(sel, params)
    };
    return newState
  }

  
  showInContext(sel) {
    return !sel.isCollapsed()
  }

  isDisabled(params) {
    let sel = params.selection;
    let selectionState = params.editorSession.getSelectionState();
    if (!sel.isPropertySelection()) {
      return true
    }

    
    
    if (selectionState.isInlineNodeSelection()) {
      return true
    }
    return false
  }

  
  execute(params) {
    let state = this.getCommandState(params);
    if (state.disabled) return
    let editorSession = this._getEditorSession(params);
    editorSession.transaction((tx) => {
      let nodeData = this.createNodeData(tx, params);
      tx.insertInlineNode(nodeData);
    });
  }

  createNodeData(tx) { 
    throw new Error('This method is abstract')
  }

}

class InsertNodeCommand extends Command {

  constructor(config) {
    super(config);

    
    
    
    if (!this.config.nodeType) {
      console.error("'config.nodeType' should be provided for InsertNodeCommand");
    }
  }

  getType() {
    return this.config.nodeType
  }

  getCommandState(params) {
    let sel = params.selection;
    let newState = {
      disabled: true,
      active: false
    };
    if (sel && !sel.isNull() && !sel.isCustomSelection() && sel.containerId) {
      newState.disabled = false;
    }
    newState.showInContext = this.showInContext(sel, params);
    return newState
  }

  showInContext(sel, params) {
    let selectionState = params.selectionState;
    return sel.isCollapsed() && selectionState.isFirst() && selectionState.isLast()
  }

  execute(params, context) {
    var state = params.commandState;
    if (state.disabled) return
    let editorSession = this._getEditorSession(params, context);
    editorSession.transaction((tx) => {
      let nodeData = this.createNodeData(tx, params, context);
      let node = tx.insertBlockNode(nodeData);
      this.setSelection(tx, node);
    });
  }

  createNodeData(tx, params, context) {
    const type = params.type;
    if (!type) throw new Error("'type' is mandatory")
    const doc = context.editorSession.getDocument();
    const nodeSchema = doc.getSchema().getNodeSchema(type);
    let nodeData = {type};
    forEach(nodeSchema, (key) => {
      if (params.hasOwnProperty(key)) {
        nodeData[key] = params[key];
      }
    });
    return nodeData
  }

  setSelection(tx, node) {
    if (node.isText()) {
      tx.selection = {
        type: 'property',
        path: node.getPath(),
        startOffset: 0
      };
    }
  }
}

class MenuItem extends Component {

  render($$) {
    let commandState = this.props.commandState;
    let el = $$('button')
      .addClass('sc-menu-item')
      .append(
        this._renderIcon($$),
        this._renderLabel($$),
        this._renderKeyboardShortcut($$)
      )
      .on('click', this._onClick);

    if (this.props.label) {
      el.append(this.renderLabel($$));
    }
    if (commandState.active) {
      el.addClass('sm-active');
    }
    if (commandState.disabled) {
      
      el.attr('tabindex', -1)
        .attr('disabled', true);
    } else {
      
      el.attr('tabindex', 1);
    }
    return el
  }

  _renderLabel($$) {
    return $$('div').addClass('se-label').append(
      this._getLabel()
    )
  }

  _renderIcon($$) {
    return $$('div').addClass('se-icon').append(
      this.context.iconProvider.renderIcon($$, this.props.name)
    )
  }

  _renderKeyboardShortcut($$) {
    return $$('div').addClass('se-keyboard-shortcut').append(
      this._getKeyboardShortcut()
    )
  }

  _getLabel() {
    let labelProvider = this.context.labelProvider;
    return labelProvider.getLabel(this.props.name)
  }

  _getKeyboardShortcut() {
    let name = this.props.name;
    let keyboardShortcuts = this.context.keyboardShortcuts;
    if (keyboardShortcuts[name]) {
      return keyboardShortcuts[name]
    } else {
      return ''
    }
  }

  _onClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.props.commandState.disabled) this.executeCommand();
  }

  
  executeCommand(props) {
    
    this.context.commandManager.executeCommand(this.props.name, props);
  }
}

class ToolPanel extends Component {

  didMount() {
    this.context.editorSession.onRender(this._onCommandStatesChanged, this);
  }

  dispose() {
    this.context.editorSession.off(this);
  }

  _onCommandStatesChanged(editorSession) {
    if (editorSession.hasChanged('commandStates')) {
      this.rerender();
    }
  }

  renderEntries($$) {
    let els = [];
    this.props.toolPanel.forEach((entry) => {
      let ComponentClass = this.getComponent(entry.type);
      if (!ComponentClass) throw new Error('Toolpanel entry type not found')
      let props = Object.assign({}, entry, { theme: this.getTheme() });
      els.push(
        $$(ComponentClass, props).ref(entry.name)
      );
    });
    return els
  }

  hasEnabledTools() {
    let entriesContainer = this.refs.entriesContainer;
    let entries = entriesContainer.childNodes;
    let hasEnabledTools = false;
    entries.forEach((entry) => {
      if (entry.hasEnabledTools()) {
        hasEnabledTools = true;
      }
    });
    return hasEnabledTools
  }

  getActiveToolGroupNames() {
    throw new Error('Abstract method')
  }

  showDisabled() {
    return false
  }

  
  getToolStyle() {
    throw new Error('Abstract method')
  }

  getTheme() {
    return this.props.theme || 'dark'
  }

}

class Overlay extends ToolPanel {

  didMount() {
    super.didMount();
    if (!this.context.scrollPane) {
      throw new Error('Requires scrollPane context')
    }
    this.context.scrollPane.on('selection:positioned', this._onSelectionPositioned, this);
  }

  dispose() {
    super.dispose();
    this.context.scrollPane.off(this);
  }

  render($$) {
    let el = $$('div').addClass('sc-overlay');
    el.addClass('sm-hidden');
    el.addClass('sm-theme-'+this.getTheme());
    el.append(
      $$('div').addClass('se-active-tools').append(
        this.renderEntries($$)
      ).ref('entriesContainer')
    );
    return el
  }

  show(hints) {
    this.el.removeClass('sm-hidden');
    this._position(hints);
  }

  hide() {
    this.el.addClass('sm-hidden');
  }

  _onSelectionPositioned(hints) {
    if (this.hasEnabledTools()) {
      this.el.removeClass('sm-hidden');
      let overlayWidth = this.el.htmlProp('offsetWidth');
      let selRect = hints.selectionRect;
      let selectionMaxWidth = selRect.width;
      
      this.el.css('top', selRect.top + selRect.height);
      let leftPos = selRect.left + selectionMaxWidth/2 - overlayWidth/2;
      
      leftPos = Math.max(leftPos, 0);
      
      let maxLeftPos = selRect.left + selectionMaxWidth + selRect.right - overlayWidth;
      leftPos = Math.min(leftPos, maxLeftPos);
      this.el.css('left', leftPos);
    } else {
      this.el.addClass('sm-hidden');
    }
  }

  getTheme() {
    return this.props.theme || 'dark'
  }

}

class ResponsiveApplication extends Component {
  constructor(...args) {
    super(...args);

    this.pages = {};

    this.handleActions({
      'navigate': this.navigate
    });
  }

  getInitialState() {
    return {
      route: undefined,
      mobile: this._isMobile()
    }
  }

  didMount() {
    if (platform.inBrowser) {
      let _window = DefaultDOMElement.getBrowserWindow();
      _window.on('resize', this._onResize, this);
    }
    this.router = this.getRouter();
    this.router.on('route:changed', this._onRouteChanged, this);
    let route = this.router.readRoute();
    
    
    this.navigate(route, {replace: true});
  }

  dispose() {
    this.router.off(this);
    this.router.dispose();
  }

  
  navigate(route, opts) {
    this.extendState({
      route: route
    });
    this.router.writeRoute(route, opts);
  }

  _onRouteChanged(route) {
    
    this.navigate(route, {replace: true});
  }

  _isMobile() {
    if (platform.inBrowser) {
      return window.innerWidth < 700
    }
  }

  _onResize() {
    if (this._isMobile()) {
      
      if (!this.state.mobile) {
        this.extendState({
          mobile: true
        });
      }
    } else {
      if (this.state.mobile) {
        this.extendState({
          mobile: false
        });
      }
    }
  }

  _getPage() {
    return this.state.route.page || this.getDefaultPage()
  }

  _getPageClass() {
    let page = this._getPage();
    return this.pages[page]
  }

  _getPageProps() {
    let props = cloneDeep(this.state.route);
    delete props.page;
    props.mobile = this.state.mobile;
    return props
  }

  addPage(pageName, PageClass) {
    this.pages[pageName] = PageClass;
  }

  renderPage($$) {
    let PageClass = this._getPageClass();
    let pageName = this._getPage();
    return $$(PageClass, this._getPageProps()).ref(pageName)
  }

  render($$) {
    let el = $$('div').addClass('sc-responsive-application');

    if (this.state.route === undefined) {
      
      return el
    }

    el.append(
      this.renderPage($$)
    );

    return el
  }

}

class Router extends EventEmitter {
  constructor(...args) {
    super(...args);
    this.__isStarted__ = false;
  }

  
  start() {
    let window = DefaultDOMElement.getBrowserWindow();
    window.on('hashchange', this._onHashChange, this);
    this.__isStarted__ = true;
  }

  
  readRoute() {
    if (!this.__isStarted__) this.start();
    return this.parseRoute(this.getRouteString())
  }

  
  writeRoute(route, opts) {
    opts = opts || {};
    let routeString = this.stringifyRoute(route);
    if (!routeString) {
      this.clearRoute(opts);
    } else {
      this._writeRoute(routeString, opts);
    }
  }

  dispose() {
    let window = DefaultDOMElement.getBrowserWindow();
    window.off(this);
  }

  
  parseRoute(routeString) {
    return Router.routeStringToObject(routeString)
  }

  
  stringifyRoute(route) {
    return Router.objectToRouteString(route)
  }

  getRouteString() {
    return window.location.hash.slice(1)
  }

  _writeRoute(route, opts) {
    this.__isSaving__ = true;
    try {
      if (opts.replace) {
        window.history.replaceState({} , '', '#'+route);
      } else {
        window.history.pushState({} , '', '#'+route);
      }
    } finally {
      this.__isSaving__ = false;
    }
  }

  clearRoute(opts) {
    this._writeRoute('', opts);
  }

  _onHashChange() {
    
    if (this.__isSaving__) {
      return
    }
    if (this.__isLoading__) {
      console.error('FIXME: router is currently applying a route.');
      return
    }
    this.__isLoading__ = true;
    try {
      let routeString = this.getRouteString();
      let route = this.parseRoute(routeString);
      this.emit('route:changed', route);
    } finally {
      this.__isLoading__ = false;
    }
  }

}

Router.objectToRouteString = function(obj) {
  let route = [];
  forEach(obj, function(val, key) {
    route.push(key+'='+val);
  });
  return route.join(',')
};

Router.routeStringToObject = function(routeStr) {
  let obj = {};
  
  if (!routeStr) return obj
  let params = routeStr.split(',');
  params.forEach(function(param) {
    let tuple = param.split('=');
    if (tuple.length !== 2) {
      throw new Error('Illegal route.')
    }
    obj[tuple[0].trim()] = tuple[1].trim();
  });
  return obj
};

class SwitchTextTypeCommand$$1 extends Command {

  constructor(config) {
    super(config);
    if (!config.spec) {
      throw new Error("'config.spec' is mandatory")
    }
    if (!config.spec.type) {
      throw new Error("'config.spec.type' is mandatory")
    }
  }

  getType() {
    return this.config.spec.type
  }

  getCommandState(params) {
    let doc = params.editorSession.getDocument();
    let sel = params.selection;
    let isBlurred = params.editorSession.isBlurred();

    let commandState = {
      disabled: false
    };

    if (sel.isPropertySelection() && !isBlurred) {
      let path = sel.getPath();
      let node = doc.get(path[0]);
      if (node && node.isText() && node.isBlock()) {
        commandState.active = isMatch(node, this.config.spec);
        
        
        commandState.showInContext = sel.start.offset === 0 && sel.end.offset === 0;
      } else {
        commandState.disabled = true;
      }
    } else {
      
      commandState.disabled = true;
    }

    return commandState
  }

  
  execute(params) {
    let surface = params.surface;
    let editorSession = params.editorSession;
    if (!surface) {
      console.warn('No focused surface. Stopping command execution.');
      return
    }
    editorSession.transaction((tx) => {
      return tx.switchTextType(this.config.spec)
    });
  }

  isSwitchTypeCommand() {
    return true
  }

}

class TextBlockComponent extends NodeComponent {

  didMount(...args) {
    super.didMount(...args);

    let node = this.props.node;
    this.context.editorSession.onRender('document', this.rerender, this, {
      path: [node.id, 'textAlign']
    });
  }

  dispose(...args) {
    super.dispose(...args);
    this.context.editorSession.off(this);
  }

  render($$) {
    let el = super.render($$);
    el.addClass('sc-text-block');

    let node = this.props.node;
    
    
    if (node.direction) {
      
      el.attr('dir', node.direction);
    }
    if (node.textAlign) {
      el.addClass('sm-align-'+node.textAlign);
    }
    el.append($$(TextPropertyComponent, {
      placeholder: this.props.placeholder,
      path: node.getTextPath(),
      direction: node.direction
    }));
    return el
  }

}

class TextPropertyEditor extends Surface {

  constructor(parent, props) {
    
    props.name = props.name || props.path.join('.');
    super(parent, props);

    if (!props.path) {
      throw new Error("Property 'path' is mandatory.")
    }
  }

  render($$) {
    let el = super.render.apply(this, arguments);
    el.addClass("sc-text-property-editor");

    if (!this.props.disabled) {
      el.addClass('sm-enabled');
      el.attr('contenteditable', true);
      
      el.attr('spellcheck', this.props.spellcheck === 'native');
    }

    el.append(
      $$(TextPropertyComponent, {
        placeholder: this.props.placeholder,
        tagName: this.props.tagName || "div",
        path: this.props.path,
        markers: this.props.markers,
        withoutBreak: this.props.withoutBreak
      }).ref('property')
    );

    return el
  }

  selectFirst() {
    this.editorSession.setSelection({
      type: "property",
      path: this.getPath(),
      startOffset: 0,
      surfaceId: this.id
    });
  }

  _handleEnterKey(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.props.multiLine) {
      super._handleEnterKey(event);
    }
    this.el.emit('enter', {
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      code: event.code
    });
  }

  

  _handleEscapeKey(event) {
    this.el.emit('escape', {
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      code: event.code
    });
  }

  getPath() {
    return this.props.path
  }
}

TextPropertyEditor.prototype._isTextPropertyEditor = true;

class Tooltip extends Component {
  render($$) {
    let el = $$('div').addClass('sc-tooltip');
    el.append(this.props.text);
    return el
  }
}

class ToggleTool extends Component {

  get _isTool() {
    return true
  }

  
  render($$) {
    let el = $$('div')
      .addClass('sc-toggle-tool');

    let customClassNames = this.getClassNames();
    if (customClassNames) {
      el.addClass(customClassNames);
    }

    el.append(
      this.renderButton($$)
    );

    
    el.append(
      $$(Tooltip, {
        text: this._getTooltipText()
      })
    );
    return el
  }

  renderButton($$) {
    let commandState = this.props.commandState;
    let Button = this.getComponent('button');
    let btn = $$(Button, {
      icon: this.props.name,
      active: commandState.active,
      disabled: commandState.disabled,
      theme: this.props.theme
    }).on('click', this.onClick);
    return btn
  }

  getClassNames() {
    return ''
  }

  
  getCommandName() {
    return this.getName()
  }

  getName() {
    return this.props.name
  }

  onClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.props.disabled) this.executeCommand();
  }

  _getTooltipText() {
    let name = this.props.name;
    let label = this.context.labelProvider.getLabel(name);
    let keyboardShortcuts = this.context.keyboardShortcuts;
    if (keyboardShortcuts[name]) {
      return [label, ' (', keyboardShortcuts[name], ')'].join('')
    } else {
      return label
    }
  }

  
  executeCommand(props) {
    props = Object.assign({ mode: this.props.mode }, props);
    this.context.commandManager.executeCommand(this.getCommandName(), props);
  }
}

class ToolGroup$$1 extends Component {

  
  isToolEnabled(commandName, commandState) {
    let enabled = true;
    if (this.props.contextual && !commandState.showInContext) {
      enabled = false;
    }
    if (commandState.disabled) {
      enabled = false;
    }
    return enabled
  }

  
  hasEnabledTools(commandStates) {
    if (!commandStates) {
      commandStates = this._getCommandStates();
    }
    let hasEnabledTools;
    forEach(commandStates, (commandState, commandName) => {
      if (this.isToolEnabled(commandName, commandState)) {
        hasEnabledTools = true;
      }
    });
    return hasEnabledTools
  }

  render($$) {
    let commandStates = this._getCommandStates();
    let tools = this.context.tools;
    let el = $$('div').addClass(this._getClassNames());
    el.addClass('sm-'+this.props.name);
    forEach(commandStates, (commandState, commandName) => {
      if (this.isToolEnabled(commandName, commandState) || this.props.showDisabled) {
        let ToolClass = tools[commandName] || ToggleTool;
        el.append(
          $$(ToolClass, {
            name: commandName,
            commandState: commandState,
            style: this.props.style,
            theme: this.props.theme
          }).ref(commandName)
        );
      }
    });
    return el
  }

  
  _getCommandStates() {
    let commandStates = this.context.editorSession.getCommandStates();
    let commandGroups = this.context.commandGroups;
    let filteredCommandStates = {}; 
    this.props.commandGroups.forEach((commandGroup) => {
      if (!commandGroups[commandGroup]) {
        throw new Error('commandGroup "'+commandGroup+'" not found')
      }
      commandGroups[commandGroup].forEach((commandName) => {
        
        
        
        
        
        if (commandStates[commandName]) {
          filteredCommandStates[commandName] = commandStates[commandName];
        }
      });
    });
    return filteredCommandStates
  }

  _getClassNames() {
    return 'sc-tool-group'
  }
}

class Menu extends Component {

  render($$) {
    let commandState = this.props.commandStates;
    let el = $$('div').addClass('sc-menu');
    this.props.items.forEach((item) => {
      if (item.command) {
        el.append(
          $$(MenuItem, {
            name: item.command,
            commandState: commandState[item.command]
          })
        );
      } else if (item.type === 'separator') {
        el.append(
          $$('div').addClass('separator')
        );
      }
    });
    return el
  }
}

class ToolDropdown extends ToolGroup$$1 {

  
  willReceiveProps() {
    this.setState({showChoices: false});
  }

  render($$) {
    let Button = this.getComponent('button');
    let commandStates = this._getCommandStates();
    let el = $$('div').addClass('sc-tool-dropdown');
    el.addClass('sm-'+this.props.name);

    
    const toggleName = this._getToggleName(commandStates) || this.props.name;

    
    
    if (this.props.showDisabled || this.hasEnabledTools(commandStates)) {
      let toggleButton;
      if (this.props.style === 'minimal') {
        toggleButton = $$(Button, {
          icon: toggleName,
          dropdown: true,
          active: this.state.showChoices,
          theme: this.props.theme
        }).on('click', this._toggleChoices);
      } else if (this.props.style === 'descriptive') {
        toggleButton = $$(Button, {
          label: toggleName,
          dropdown: true,
          active: this.state.showChoices,
          theme: this.props.theme
        }).on('click', this._toggleChoices);
      } else {
        throw new Error('Style '+this.props.style+' not supported')
      }
      el.append(toggleButton);

      if (this.state.showChoices) {
        el.append(
          $$('div').addClass('se-choices').append(
            $$(Menu, {
              commandStates: commandStates,
              items: this._getMenuItems(commandStates)
            })
          )
        );
      } else if (this.props.style === 'minimal' || toggleName !== this.props.name) {
        
        el.append(
          this._renderToolTip($$)
        );
      }
    }
    return el
  }

  _renderToolTip($$) {
    let labelProvider = this.context.labelProvider;
    return $$(Tooltip, {
      text: labelProvider.getLabel(this.props.name)
    })
  }

  
  _getToggleName(commandStates) {
    return this._getActiveCommandName(commandStates)
  }

  
  _getMenuItems(commandStates) {
    const showDisabled = this.props.showDisabled;
    let menuItems = [];
    forEach(commandStates, (commandState, commandName) => {
      
      
      if (showDisabled || this.isToolEnabled(commandName, commandState)) {
        menuItems.push({
          command: commandName
        });
      }
    });
    return menuItems
  }

  _getActiveCommandName(commandStates) {
    let activeCommand;

    forEach(commandStates, (commandState, commandName) => {
      if (commandState.active && !activeCommand) {
        activeCommand = commandName;
      }
    });
    return activeCommand
  }

  _toggleChoices() {
    this.setState({
      showChoices: !(this.state.showChoices)
    });
  }
}

class ToolPrompt$$1 extends ToolGroup$$1 {

  _getClassNames() {
    return 'sc-tool-prompt'
  }
}

class WorkflowPane$$1 extends ToolPanel {

  render($$) {
    let el = $$('div').addClass('sc-workflow-pane');
    el.append(
      $$('div').addClass('se-active-tools').append(
        this.renderEntries($$)
      ).ref('entriesContainer')
    );
    return el
  }

  getTheme() {
    return this.props.theme || 'light'
  }
}

class Button$$1 extends Component {
  render($$) {
    let el = $$('button')
      .addClass('sc-button');

    if (this.props.icon) {
      el.append(this.renderIcon($$));
    }
    if (this.props.label) {
      el.append(this.renderLabel($$));
    }

    if (this.props.dropdown) {
      el.append(this.renderDropdownIcon($$));
    }

    if (this.props.active) {
      el.addClass('sm-active');
    }
    if (this.props.theme) {
      el.addClass('sm-theme-'+this.props.theme);
    }

    if (this.props.disabled) {
      
      el.attr('tabindex', -1)
        .attr('disabled', true);
    } else {
      
      el.attr('tabindex', 1);
    }

    
    el.append(this.props.children);
    return el
  }

  renderIcon($$) {
    let iconEl = this.context.iconProvider.renderIcon($$, this.props.icon);
    return iconEl
  }

  renderDropdownIcon($$) {
    let iconEl = this.context.iconProvider.renderIcon($$, 'dropdown');
    iconEl.addClass('se-dropdown');
    return iconEl
  }

  renderLabel($$) {
    return $$('span').addClass('se-label').append(
      this.getLabel(this.props.label)
    )
  }

  getLabel(name) {
    let labelProvider = this.context.labelProvider;
    return labelProvider.getLabel(name)
  }
}

class Layout$$1 extends Component {

  render($$) {
    let el = $$('div').addClass('sc-layout');
    el.addClass('sm-width-'+this.props.width);
    if (this.props.textAlign) {
      el.addClass('sm-text-align-'+this.props.textAlign);
    }

    if (this.props.noPadding) {
      el.addClass('sm-no-padding');
    }

    el.append(this.props.children);
    return el
  }
}

class Scrollbar extends Component {

  didMount() {
    
    DefaultDOMElement.getBrowserWindow().on('resize', this.onResize, this);
    
    this.props.scrollPane.on('scroll', this.onScroll, this);
    
    setTimeout(function() {
      this.updatePositions();
    }.bind(this));
  }

  dispose() {
    DefaultDOMElement.getBrowserWindow().off(this);
    this.props.scrollPane.off(this);
  }

  didUpdate() {
    this.updatePositions();
  }

  render($$) {
    let el = $$('div')
      .addClass('sc-scrollbar')
      .on('mousedown', this.onMouseDown);

    if (this.props.highlights) {
      let highlightEls = [];

      forEach(this.props.highlights, function(highlights, scope) {
        forEach(highlights, function(h) {
          highlightEls.push(
            $$('div').ref(h).addClass('se-highlight sm-'+scope)
          );
        });
      });

      el.append(
        $$('div').ref('highlights')
          .addClass('se-highlights')
          .append(highlightEls)
      );
    }
    el.append($$('div').ref('thumb').addClass('se-thumb'));
    return el
  }

  updatePositions() {
    let scrollPane = this.props.scrollPane;
    let scrollableEl = scrollPane.getScrollableElement();
    let contentHeight = scrollPane.getContentHeight();
    let scrollPaneHeight = scrollPane.getHeight();
    let scrollTop = scrollPane.getScrollPosition();
    let contentEl = scrollPane.getContentElement();

    
    this.factor = (contentHeight / scrollPaneHeight);

    if (this.factor <= 1) {
      this.el.addClass('sm-hide-thumb');
    } else {
      this.el.removeClass('sm-hide-thumb');
    }

    this.refs.thumb.css({
      top: scrollTop / this.factor,
      height: scrollPaneHeight / this.factor
    });

    
    if (this.props.highlights) {
      
      forEach(this.props.highlights,function(highlights) {
        forEach(highlights, function(nodeId) {
          let nodeEl = scrollableEl.find('*[data-id="'+nodeId+'"]');

          if (!nodeEl) return

          
          let rect = getRelativeBoundingRect(nodeEl.getNativeElement(), contentEl.getNativeElement());
          let top = rect.top / this.factor;
          let height = rect.height / this.factor;

          
          if (height < Scrollbar.overlayMinHeight) {
            height = Scrollbar.overlayMinHeight;
          }

          let highlightEl = this.refs[nodeId];
          if (highlightEl) {
            this.refs[nodeId].css({
              top: top,
              height: height
            });
          } else {
            console.warn('no ref found for highlight', nodeId);
          }
        }.bind(this));
      }.bind(this));
    }
  }

  getScrollableElement() {
    return this.props.scrollPane.getScrollableElement()
  }

  onResize() {
    this.rerender();
  }

  onScroll() {
    this.updatePositions();
  }

  onMouseDown(e) {
    e.stopPropagation();
    e.preventDefault();
    this._mouseDown = true;

    
    
    let _window = DefaultDOMElement.getBrowserWindow();
    _window.on('mousemove', this.onMouseMove, this);
    _window.on('mouseup', this.onMouseUp, this);

    let scrollBarOffset = this.el.getOffset().top;
    let y = e.pageY - scrollBarOffset;
    let thumbEl = this.refs.thumb.el;
    if (e.target !== thumbEl.getNativeElement()) {
      
      this.offset = thumbEl.height / 2;
      this.onMouseMove(e);
    } else {
      this.offset = y - thumbEl.getPosition().top;
    }
  }

  
  onMouseUp() {
    this._mouseDown = false;
    let _window = DefaultDOMElement.getBrowserWindow();
    _window.off('mousemove', this.onMouseMove, this);
    _window.off('mouseup', this.onMouseUp, this);
  }

  onMouseMove(e) {
    if (this._mouseDown) {
      let scrollPane = this.props.scrollPane;
      let scrollableEl = scrollPane.getScrollableElement();
      let scrollBarOffset = this.el.getOffset().top;
      let y = e.pageY - scrollBarOffset;

      
      let scroll = (y-this.offset)*this.factor;
      scrollableEl.setProperty('scrollTop', scroll);
    }
  }
}

Scrollbar.overlayMinHeight = 2;

class ScrollPane$$1 extends AbstractScrollPane$$1 {

  didMount() {
    super.didMount();
    if (this.refs.scrollbar && this.props.highlights) {
      this.props.highlights.on('highlights:updated', this.onHighlightsUpdated, this);
    }
    if (this.refs.scrollbar) {
      if (platform.inBrowser) {
        this.domObserver = new window.MutationObserver(this._onContentChanged.bind(this));
        this.domObserver.observe(this.el.getNativeElement(), {
          subtree: true,
          attributes: true,
          characterData: true,
          childList: true,
        });
      }
      this.context.editorSession.onPosition(this._onPosition, this);
    }
  }

  dispose() {
    super.dispose();
    if (this.props.highlights) {
      this.props.highlights.off(this);
    }
    this.context.editorSession.off(this);
    this.context.dragManager.off(this);
    if (this.domObserver) {
      this.domObserver.disconnect();
    }
  }

  render($$) {
    let el = $$('div')
      .addClass('sc-scroll-pane');

    if (platform.isFF) {
      el.addClass('sm-firefox');
    }

    
    
    if (!this.props.noStyle) {
      el.addClass('sm-default-style');
    }

    
    if (this.props.scrollbarType === 'substance') {
      el.addClass('sm-substance-scrollbar');
      el.addClass('sm-scrollbar-position-' + this.props.scrollbarPosition);

      el.append(
        
        
        $$(Scrollbar, {
          scrollPane: this
        }).ref('scrollbar')
          .attr('id', 'content-scrollbar')
      );

      
      el.append(
        $$('div').ref("scanline").addClass('se-scanline')
      );
    }

    el.append(
      $$('div').ref('scrollable').addClass('se-scrollable').append(
        this.renderContent($$)
      ).on('scroll', this.onScroll)
    );
    return el
  }

  renderContent($$) {
    let contentEl = $$('div').ref('content').addClass('se-content');
    contentEl.append(this.props.children);
    if (this.props.contextMenu === 'custom') {
      contentEl.on('contextmenu', this._onContextMenu);
    }
    return contentEl
  }

  _onContentChanged() {
    this._contentChanged = true;
  }

  _onPosition() {
    if (this.refs.scrollbar && this._contentChanged) {
      this._contentChanged = false;
      this._updateScrollbar();
    }
  }

  _updateScrollbar() {
    if (this.refs.scrollbar) {
      this.refs.scrollbar.updatePositions();
    }
  }

  onHighlightsUpdated(highlights) {
    this.refs.scrollbar.extendProps({
      highlights: highlights
    });
  }

  onScroll() {
    let scrollPos = this.getScrollPosition();
    let scrollable = this.refs.scrollable;
    if (this.props.onScroll) {
      this.props.onScroll(scrollPos, scrollable);
    }
    
    if (this.props.tocProvider) {
      this.props.tocProvider.markActiveEntry(this);
    }
    this.emit('scroll', scrollPos, scrollable);
  }

  
  getHeight() {
    let scrollableEl = this.getScrollableElement();
    return scrollableEl.height
  }

  
  getContentHeight() {
    let contentEl = this.refs.content.el.getNativeElement();
    
    
    
    return contentEl.scrollHeight
  }

  
  getContentElement() {
    return this.refs.content.el
  }

  
  getScrollableElement() {
    return this.refs.scrollable.el
  }

  
  getScrollPosition() {
    let scrollableEl = this.getScrollableElement();
    return scrollableEl.getProperty('scrollTop')
  }

  setScrollPosition(scrollPos) {
    let scrollableEl = this.getScrollableElement();
    scrollableEl.setProperty('scrollTop', scrollPos);
  }

  
  getPanelOffsetForElement(el) {
    let nativeEl = el.getNativeElement();
    let contentContainerEl = this.refs.content.getNativeElement();
    let rect = getRelativeBoundingRect(nativeEl, contentContainerEl);
    return rect.top
  }

  
  scrollTo(selector, onlyIfNotVisible) {
    let scrollableEl = this.getScrollableElement();
    let targetNode = scrollableEl.find(selector);
    if (targetNode) {
      const offset = this.getPanelOffsetForElement(targetNode);
      let shouldScroll = true;
      if (onlyIfNotVisible) {
        const height = scrollableEl.height;
        const oldOffset = scrollableEl.getProperty('scrollTop');
        shouldScroll = (offset < oldOffset || oldOffset+height<offset);
      }
      if (shouldScroll) {
        this.setScrollPosition(offset);
      }
    } else {
      console.warn(`No match found for selector '${selector}' in scrollable container`);
    }
  }

  
  onSelectionPositioned(...args) {
    super.onSelectionPositioned(...args);
    this._updateScrollbar();
  }

  _onContextMenu(e) {
    super._onContextMenu(e);
    this._updateScrollbar();
  }

}

class SplitPane$$1 extends Component {

  render($$) {
    if (this.props.children.length !== 2) {
      throw new Error('SplitPane only works with exactly two child elements')
    }

    let el = $$('div').addClass('sc-split-pane');
    if (this.props.splitType === 'horizontal') {
      el.addClass('sm-horizontal');
    } else {
      el.addClass('sm-vertical');
    }

    let paneA = this.props.children[0];
    let paneB = this.props.children[1];

    
    if (this.props.sizeB) {
      paneB.addClass('se-pane sm-sized');
      paneB.css(this.getSizedStyle(this.props.sizeB));
      paneA.addClass('se-pane sm-auto-fill');
    } else {
      paneA.addClass('se-pane sm-sized');
      paneA.css(this.getSizedStyle(this.props.sizeA));
      paneB.addClass('se-pane sm-auto-fill');
    }

    el.append(
      paneA,
      paneB
    );
    return el
  }

  
  getSizedStyle(size) {
    if (!size || size === 'inherit') return {}
    if (this.props.splitType === 'horizontal') {
      return {'height': size}
    } else {
      return {'width': size}
    }
  }

}

class Toolbar$$1 extends ToolPanel {

  render($$) {
    let el = $$('div').addClass('sc-toolbar');
    el.append(
      $$('div').addClass('se-active-tools').append(
        this.renderEntries($$)
      ).ref('entriesContainer')
    );
    return el
  }

  getTheme() {
    return this.props.theme || 'light'
  }
}

class CollabSession extends EditorSession {

  constructor(doc, config) {
    super(doc, config);
    config = config || {};
    this.config = config;
    this.collabClient = config.collabClient;
    if (config.docVersion) {
      console.warn('config.docVersion is deprecated: Use config.version instead');
    }
    if (config.docVersion) {
      console.warn('config.docId is deprecated: Use config.documentId instead');
    }
    this.version = config.version;
    this.documentId = config.documentId || config.docId;
    if (config.autoSync !== undefined) {
      this.autoSync = config.autoSync;
    } else {
      this.autoSync = true;
    }
    if (!this.documentId) {
      throw new SubstanceError('InvalidArgumentsError', {message: 'documentId is mandatory'})
    }
    if (typeof this.version === undefined) {
      throw new SubstanceError('InvalidArgumentsError', {message: 'version is mandatory'})
    }
    
    this._connected = false; 
    this._nextChange = null; 
    this._pendingChange = null; 
    this._pendingSync = false;
    this._error = null;
    
    this.onUpdate('document', this.afterDocumentChange, this);
    
    this.collabClient.on('connected', this.onCollabClientConnected, this);
    this.collabClient.on('disconnected', this.onCollabClientDisconnected, this);
    this.collabClient.on('message', this._onMessage.bind(this));
    
    
    
    if (this.collabClient.isConnected() && this.autoSync) {
      this.sync();
    }
  }

  
  dispose() {
    this.disconnect();
    this.collabClient.off(this);
  }

  
  disconnect() {
    
    let msg = {
      type: 'disconnect',
      documentId: this.documentId
    };
    
    this._abortSync();
    this._send(msg);
  }

  
  sync() {
    
    if (this.__canSync()) {
      let nextChange = this._nextChange;
      let msg = {
        type: 'sync',
        documentId: this.documentId,
        version: this.version,
        change: nextChange ? this.serializeChange(nextChange) : undefined
      };
      this._send(msg);
      this._pendingSync = true;
      this._pendingChange = nextChange;

      
      
      this.emit('sync');
      this._nextChange = null;
      this._error = null;
    } else {
      console.error('Can not sync. Either collabClient is not connected or already syncing');
    }
  }

  getCollaborators() {
    return this.collaborators
  }

  isConnected() {
    return this._connected
  }

  serializeChange(change) {
    return change.toJSON()
  }

  deserializeChange(serializedChange) {
    return DocumentChange.fromJSON(serializedChange)
  }

  

  
  _onMessage(msg) {
    
    if (msg.documentId !== this.documentId) {
      return false
    }
    
    msg = cloneDeep(msg);
    switch (msg.type) {
      case 'syncDone':
        this.syncDone(msg);
        break
      case 'syncError':
        this.syncError(msg);
        break
      case 'update':
        this.update(msg);
        break
      case 'disconnectDone':
        this.disconnectDone(msg);
        break
      case 'error':
        this.error(msg);
        break
      default:
        console.error('CollabSession: unsupported message', msg.type, msg);
        return false
    }
    return true
  }

  
  _send(msg) {
    if (this.collabClient.isConnected()) {
      this.collabClient.send(msg);
      return true
    } else {
      console.warn('Try not to call _send when disconnected. Skipping message', msg);
      return false
    }
  }

  
  update(args) {
    
    let serverChange = args.change;
    let serverVersion = args.version;

    if (!this._nextChange && !this._pendingSync) {
      if (serverChange) {
        serverChange = this.deserializeChange(serverChange);
        this._applyRemoteChange(serverChange);
      }
      if (serverVersion) {
        this.version = serverVersion;
      }
      this.startFlow();
    } else {
      console.info('skipped remote update. Pending sync or local changes.');
    }
  }

  
  syncDone(args) {
    
    let serverChange = args.serverChange;
    let serverVersion = args.version;

    if (serverChange) {
      serverChange = this.deserializeChange(serverChange);
      this._applyRemoteChange(serverChange);
    }
    this.version = serverVersion;
    
    
    this._pendingChange = null;
    this._pendingSync = false;
    this._error = null;
    
    this._connected = true;
    this.startFlow();
    this.emit('connected');
    
    this._requestSync();
  }

  
  syncError(error) {
    console.info('SyncError occured. Aborting sync', error);
    this._abortSync();
  }

  disconnectDone() {
    
    
    this._afterDisconnected();
  }

  
  error(message) {
    let error = message.error;
    let errorFn = this[error.name];
    let err = SubstanceError.fromJSON(error);

    if (!errorFn) {
      error('CollabSession: unsupported error', error.name);
      return false
    }

    this.emit('error', err);
    errorFn = errorFn.bind(this);
    errorFn(err);
  }


  

  afterDocumentChange(change, info) {
    
    if (!info.remote) {
      this._recordChange(change);
    }
  }

  
  onCollabClientConnected() {
    
    if (this.autoSync) {
      this.sync();
    }
  }

  
  onCollabClientDisconnected() {
    
    this._abortSync();
    if (this._connected) {
      this._afterDisconnected();
    }
  }

  

  _commit(change, info) {
    this._commitChange(change, info);
    this.startFlow();
  }

  
  _applyRemoteChange(change) {
    
    if (change.ops.length > 0) {
      this._transaction._apply(change);
      this.getDocument()._apply(change);
      this._setDirty('document');
      
      this._transformLocalChangeHistory(change);
      this._setSelection(this._transformSelection(change));
      this._change = change;
      this._info = { remote: true };
      this.startFlow();
    }
  }

  
  _recordChange(change) {
    if (!this._nextChange) {
      this._nextChange = change;
    } else {
      
      this._nextChange.ops = this._nextChange.ops.concat(change.ops);
      this._nextChange.after = change.after;
    }
    this._requestSync();
  }

  __canSync() {
    return this.collabClient.isConnected() && !this._pendingSync
  }

  
  _requestSync() {
    if (this._nextChange && this.__canSync()) {
      this.sync();
    }
  }

  
  _abortSync() {
    let newNextChange = this._nextChange;

    if (this._pendingChange) {
      newNextChange = this._pendingChange;
      
      if (this._nextChange) {
        newNextChange.ops = newNextChange.ops.concat(this._nextChange.ops);
        newNextChange.after = this._nextChange.after;
      }
      this._pendingChange = null;
    }
    this._pendingSync = false;
    this._error = null;
    this._nextChange = newNextChange;
  }

  
  _afterDisconnected() {
    this._connected = false;
    this.emit('disconnected');
  }

  
  _hasLocalChanges() {
    return this._nextChange && this._nextChange.ops.length > 0
  }

}

function node2element(node) {
  
  let dom = DefaultDOMElement.createDocument('xml');
  let el = _node2element(dom, node);
  return el
}

function _node2element(dom, node) {
  let el;
  switch(node._elementType) {
    case 'text': {
      el = _renderTextNode(dom, node);
      break
    }
    case 'element':
    case 'inline-element':
    case 'container': {
      el = _renderElementNode(dom, node);
      break
    }
    case 'anchor':
    case 'annotation': {
      el = _createElement$1(dom, node);
      break
    }
    case 'external': {
      el = DefaultDOMElement.parseSnippet(node.xml, 'xml');
      break
    }
    default:
      throw new Error('Invalid element type.')
  }
  return el
}

function _createElement$1(dom, node) {
  let el = dom.createElement(node.type);
  el.attr('id', node.id);
  el.attr(node.attributes);
  return el
}

function _renderElementNode(dom, node) {
  let el = _createElement$1(dom, node);
  el.append(node.getChildren().map(child => _node2element(dom, child)));
  return el
}

function _renderTextNode(dom, node) {
  const annos = node.getAnnotations();
  const text = node.getText();
  let el = _createElement$1(dom, node);
  if (annos && annos.length > 0) {
    let fragmenter = new Fragmenter({
      onText: (context, text) => { context.append(text); },
      onEnter: (fragment) => {
        return _node2element(dom, fragment.node)
      },
      onExit: (fragment, context, parentContext) => {
        parentContext.append(context);
      }
    });
    fragmenter.start(el, text, annos);
  } else {
    el.append(text);
  }
  return el
}

function nameWithoutNS$1(name) {
  const idx = name.indexOf(':');
  if (idx > 0) {
    return name.slice(idx+1)
  } else {
    return name
  }
}

class Adapter extends domUtils.DomUtils {

  
  isTag() {
    return true
  }

  getChildren(elem){
    return elem.getChildren() || []
  }

  getAttributeValue(elem, name){
    return elem.getAttribute(name)
  }

  getAttributes(elem) {
    return ['id', elem.id].concat(map(elem.attributes, (val, key) => { return [key,val] }))
  }

  hasAttrib(elem, name){
    return name === 'id' || elem.attributes.hasOwnProperty(name)
  }

  getName(elem){
    return elem.type
  }

  getNameWithoutNS(elem){
    return nameWithoutNS$1(this.getName(elem))
  }

  getText(elem) {
    if (elem._elementType === 'text') {
      return elem.getText()
    }
    
    return ''
  }
}

var cssSelectAdapter = new Adapter();

class XMLDocumentNode extends DocumentNode {

  _initialize(doc, props) {
    
    
    
    if (props.attributes) {
      delete props.attributes.id;
    }
    super._initialize(doc, props);
  }

  toXML() {
    return node2element(this)
  }

  
  findChild(tagName) {
    const children = this.getChildren();
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.type === tagName) return child
    }
  }

  find(cssSelector) {
    return index$1.selectOne(cssSelector, this, { xmlMode: true, adapter: cssSelectAdapter })
  }

  findAll(cssSelector) {
    return index$1.selectAll(cssSelector, this, { xmlMode: true, adapter: cssSelectAdapter })
  }

  isContainer() {
    return false
  }

  
  isBlock() {
    const parentNode = this.parentNode;
    return (parentNode && parentNode.isContainer())
  }

  getChildren() {
    
    return this.getChildNodes()
  }

  getChildNodes() {
    if (this.childNodes) {
      return documentHelpers.getNodes(this.getDocument(), this.childNodes)
    } else {
      return []
    }
  }


  get tagName() {
    return this.type
  }

  
  get parent() {
    return this.parentNode
  }

  setAttribute(name, val) {
    if (name === 'id') {
      throw new Error("'id' is read-only and can not be changed")
    }
    this.getDocument().set([this.id, 'attributes', name], val);
  }

  getAttribute(name) {
    if (name === 'id') return this.id
    return this.attributes[name]
  }

  getElementSchema() {
    return this.getDocument().getElementSchema(this.type)
  }

  serialize() {
    return this.toXML()
  }

  isTextNode() {
    return false
  }

  isElementNode() {
    return false
  }

}

XMLDocumentNode.prototype.attr = DOMElement.prototype.attr;

XMLDocumentNode.schema = {
  attributes: { type: 'object', default: {} }
};

class XMLAnchorNode extends XMLDocumentNode {

  
  get parentNode() {
    const path = this.coor.start.path;
    const doc = this.getDocument();
    return doc.get(path[0])
  }

}

XMLAnchorNode.prototype._elementType = 'anchor';

XMLAnchorNode.type = 'anchor';

XMLAnchorNode.schema = {
  coor: { type: "coordinate", optional: true }
};

class XMLAnnotationNode extends AnnotationMixin(XMLDocumentNode) {

  
  get parentNode() {
    const path = this.start.path;
    const doc = this.getDocument();
    return doc.get(path[0])
  }

  isPropertyAnnotation() {
    return true
  }

}

XMLAnnotationNode.prototype._elementType = 'annotation';


XMLAnnotationNode.prototype._isPropertyAnnotation = true;

XMLAnnotationNode.type = 'annotation';

XMLAnnotationNode.schema = {
  start: "coordinate",
  end: "coordinate"
};

class XMLElementNode extends XMLDocumentNode {

  appendChild(child) {
    let schema = this.getElementSchema();
    let pos = schema.findLastValidPos(this, child.type);
      
    if (pos < 0) {
      throw new Error(`'${child.type}' can not be inserted without violating the schema.`)
    }
    this.insertAt(pos, child);
  }

  removeChild(child) {
    const childId = child.id;
    const childPos = this.childNodes.indexOf(childId);
    if (childPos >= 0) {
      this.removeAt(childPos);
    } else {
      throw new Error(`node ${childId} is not a child of ${this.id}`)
    }
    return this
  }

  insertAt(pos, child) {
    const length = this.childNodes.length;
    if (pos >= 0 && pos <= length) {
      const doc = this.getDocument();
      doc.update([this.id, 'childNodes'], { type: 'insert', pos, value: child.id });
    } else {
      throw new Error('Index out of bounds.')
    }
    return this
  }

  removeAt(pos) {
    const length = this.childNodes.length;
    if (pos >= 0 && pos < length) {
      const doc = this.getDocument();
      doc.update([this.id, 'childNodes'], { type: 'delete', pos: pos });
    } else {
      throw new Error('Index out of bounds.')
    }
    return this
  }

  getInnerXML() {
    return this.getChildren().map((child) => {
      return child.toXML().outerHTML
    }).join('')
  }

  isElementNode() {
    return true
  }

}

XMLElementNode.prototype.append = DOMElement.prototype.append;

XMLElementNode.prototype._elementType = 'element';

XMLElementNode.type = 'element';

XMLElementNode.schema = {
  childNodes: { type: ['array', 'id'], default: [], owned: true}
};

XMLElementNode.isBlock = true;

class XMLContainerNode extends ContainerMixin(XMLElementNode) {

  getContentPath() {
    return [this.id, 'childNodes']
  }

  getContent() {
    return this.childNodes
  }

  isContainer() {
    return true
  }

  appendChild(child) {
    super.show(child.id);
  }

}

XMLContainerNode.prototype._elementType = 'container';

XMLContainerNode.type = 'container';

XMLContainerNode.schema = {};

XMLContainerNode.isBlock = true;

class ParentNodeHook$2 {

  constructor(doc) {
    this.doc = doc;
    
    this.parents = {};
    doc.data.on('operation:applied', this._onOperationApplied, this);
  }

  _onOperationApplied(op) {
    const doc = this.doc;
    const parents = this.parents;
    let node = doc.get(op.path[0]);
    switch(op.type) {
      case 'create': {
        switch(node._elementType) {
          case 'element':
          case 'container': {
            _setParent(node, node.childNodes);
            _setRegisteredParent(node);
            break
          }
          default: {
            _setRegisteredParent(node);
          }
        }
        break
      }
      case 'update': {
        
        
        let update = op.diff;
        if (op.path[1] === 'childNodes') {
          if (update.isInsert()) {
            _setParent(node, update.getValue());
          } else if (update.isDelete()) {
            _setParent(null, update.getValue());
          }
        }
        break
      }
      case 'set': {
        if (op.path[1] === 'childNodes') {
          _setParent(null, op.getOldValue());
          _setParent(node, op.getValue());
        }
        break
      }
      default:
        
    }

    function _setParent(parent, ids) {
      if (ids) {
        if (isArray$1(ids)) {
          ids.forEach(_set);
        } else {
          _set(ids);
        }
      }
      function _set(id) {
        
        
        
        parents[id] = parent;
        let child = doc.get(id);
        if (child) {
          child.parentNode = parent;
        }
      }
    }
    function _setRegisteredParent(child) {
      let parent = parents[child.id];
      if (parent) {
        child.parentNode = parent;
      }
    }
  }
}

ParentNodeHook$2.register = function(doc) {
  return new ParentNodeHook$2(doc)
};

class XMLEditingInterface extends EditingInterface {

  find(cssSelector) {
    return this.getDocument().find(cssSelector)
  }

  findAll(cssSelector) {
    return this.getDocument().findAll(cssSelector)
  }

  createElement(...args) {
    return this.getDocument().createElement(...args)
  }

}

class XMLDocument extends Document {

  _initialize() {
    this.nodeFactory = new DocumentNodeFactory(this);
    this.data = new IncrementalData(this.schema, this.nodeFactory);
    
    this.addIndex('type', new PropertyIndex('type'));
    
    this.addIndex('annotations', new AnnotationIndex());
    ParentNodeHook$2.register(this);
  }

  toXML() {
    let dom = DefaultDOMElement.createDocument('xml');
    dom.setDocType(...this.getDocTypeParams());
    let rootElement = this.getRootNode().toXML();
    dom.append(rootElement);
    return dom
  }

  getDocTypeParams() {
    
    throw new Error('This method is abstract')
  }

  getXMLSchema() {
    
    throw new Error('This method is abstract')
  }

  getRootNode() {
    
    throw new Error('This method is abstract')
  }

  
  getDocTypeAsString() {
    return new Error('This method is abstract')
  }

  createEditingInterface() {
    return new XMLEditingInterface(this)
  }

  find(cssSelector) {
    return this.getRootNode().find(cssSelector)
  }

  findAll(cssSelector) {
    return this.getRootNode().findAll(cssSelector)
  }

  createElement(tagName) {
    let node = this.create({
      id: uuid(tagName),
      type: tagName
    });
    return node
  }

  getElementSchema(type) {
    return this.getXMLSchema().getElementSchema(type)
  }

}

class XMLNodeConverter {

  constructor(type) {
    this.type = type;
    this.tagName = nameWithoutNS$1(type);
    this.tagNameNS = type;
  }

  matchElement(el) {
    return (el.tagName === this.tagNameNS)
  }

  export(node, el) {
    el.tagName = this.tagNameNS;
    el.setAttributes(node.attributes);
  }

}

class ElementNodeConverter extends XMLNodeConverter {

  import(el, node, converter) {
    let it = converter.getChildNodeIterator(el);
    let childNodes = [];
    while(it.hasNext()) {
      const childEl = it.next();
      if (childEl.isElementNode()) {
        let childNode = converter.convertElement(childEl);
        childNodes.push(childNode.id);
      }
    }
    node.childNodes = childNodes;
  }

  export(node, el, converter) {
    const doc = node.getDocument();
    el.tagName = this.tagNameNS;
    el.setAttributes(node.attributes);
    el.childNodes.forEach((id) => {
      let childNode = doc.get(id);
      let childEl = converter.convertNode(childNode);
      el.appendChild(childEl);
    });
  }

}

class XMLExternalNode extends XMLDocumentNode {}

XMLExternalNode.prototype._elementType = 'external';

XMLExternalNode.type = 'external';

XMLExternalNode.schema = {
  xml: { type: 'string', default: ''}
};

XMLExternalNode.isBlock = true;

class ExternalNodeConverter extends XMLNodeConverter {

  import(el, node, converter) {
    node.xml = el.innerHTML;
  }

  export(node, el, converter) {
    el.tagName = this.tagNameNS;
    el.setAttributes(node.attributes);
    el.innerHTML = node.xml;
  }

}

const START$2 = 'START';
const END$2 = 'END';
const EPSILON$2 = 'EPSILON';
const TEXT$3 = 'TEXT';

class DFA {

  constructor(transitions) {
    if (!transitions || Object.keys(transitions).length === 0) {
      transitions = { START: { EPSILON: END$2 } };
    }
    this.transitions = transitions;
  }

  consume(state, id) {
    const T = this.transitions;
    
    
    if (!T[state]) return -1
    let nextState = T[state][id];
    if (nextState !== undefined) {
      return nextState
    }
    while(T[state][EPSILON$2] !== undefined) {
      state = T[state][EPSILON$2];
      if (state === END$2) {
        return -1
      }
      nextState = T[state][id];
      if (nextState !== undefined) {
        return nextState
      }
    }
    return -1
  }

  canConsume(state, id) {
    let nextState = this.consume(state, id);
    return (nextState !== -1)
  }

  isFinished(state) {
    const T = this.transitions;
    if (state === 'END') return true
    
    if (!T[state]) return false
    while(T[state][EPSILON$2] !== undefined) {
      state = T[state][EPSILON$2];
      if (state === 'END') return true
    }
    return false
  }

  

  
  _tokensByPath() {
    const result = [];
    const transitions = this.transitions;
    if (!transitions) return []

    
    let first = {};
    forEach(transitions[START$2], (to, token) => {
      if (!first[to]) first[to] = [];
      first[to].push(token);
    });

    let visited = {START: true, END: true};
    forEach(first, (tokens, state) => {
      
      
      
      
      let _siblings = {};
      tokens.forEach((t) => {
        if (t !== EPSILON$2) {
          _siblings[t] = true;
        }
      });
      let stack = [state];
      while(stack.length > 0) {
        let from = stack.pop();
        if (state === END$2) continue
        visited[from] = true;
        let T = transitions[from];
        if (!T) throw new Error(`Internal Error: no transition from state ${from}`)
        let tokens = Object.keys(T);
        for (let i = 0; i < tokens.length; i++) {
          const token = tokens[i];
          const to = T[token];
          if (!visited[to]) stack.push(to);
          if (token !== EPSILON$2) {
            _siblings[token] = true;
          }
        }
      }
      let _siblingTokens = Object.keys(_siblings);
      if (_siblingTokens.length > 0) {
        result.push(_siblingTokens);
      }
    });
    return result
  }

}

DFA.START = START$2;
DFA.END = END$2;
DFA.EPSILON = EPSILON$2;
DFA.TEXT = TEXT$3;

const START$1 = DFA.START;
const END$1 = DFA.END;
const EPSILON$1 = DFA.EPSILON;


class DFABuilder {

  constructor(transitions) {
    this.transitions = transitions;
  }

  addTransition(from, to, tokens) {
    if (!this.transitions) this.transitions = {};
    if (!isArray$1(tokens)) tokens = [tokens];
    tokens.forEach(token => _addTransition(this.transitions, from, to, token));
    return this
  }

  
  append(other) {
    if (this.transitions && other.transitions) {
      let t1 = cloneDeep(this.transitions);
      let t2 = cloneDeep(other.transitions);
      
      
      let firstIsOptional = Boolean(t1[START$1][EPSILON$1]);
      let secondIsOptional = Boolean(t2[START$1][EPSILON$1]);

      if (firstIsOptional) {
        
        
        delete t1[START$1][EPSILON$1];
      }
      
      
      let newState = uuid();
      
      
      forEach(t1, (T) => {
        forEach(T, (to, token) => {
          if (to === END$1) {
            T[token] = newState;
          }
        });
      });
      
      
      if (firstIsOptional) {
        forEach(t2[START$1], (to, token) => {
          _addTransition(t1, START$1, to, token);
        });
      }
      
      
      t2[newState] = t2[START$1];
      forEach(t2, (T) => {
        forEach(T, (to, token) => {
          if (to === START$1) {
            T[token] = newState;
          }
        });
      });
      delete t2[START$1];
      
      forEach(t2, (T, from) => {
        forEach(T, (to, token) => {
          _addTransition(t1, from, to, token);
        });
      });
      
      
      if (firstIsOptional && secondIsOptional) {
        _addTransition(t1, START$1, END$1, EPSILON$1);
      }
      this.transitions = t1;
    } else if (other.transitions) {
      this.transitions = cloneDeep(other.transitions);
    }
    return this
  }

  
  merge(other) {
    if (this.transitions && other.transitions) {
      let t1 = this.transitions;
      let t2 = other.transitions;
      forEach(t2, (T, from) => {
        forEach(T, (to, token) => {
          _addTransition(t1, from, to, token);
        });
      });
    } else if (other.transitions) {
      this.transitions = cloneDeep(other.transitions);
    }
    return this
  }

  
  optional() {
    let dfa = new DFABuilder(cloneDeep(this.transitions));
    if (this.transitions) {
      dfa.addTransition(START$1, END$1, EPSILON$1);
    }
    return dfa
  }

  
  kleene() {
    let dfa = this.plus();
    return dfa.optional()
  }

  
  plus() {
    let dfa;
    if (this.transitions) {
      let t1 = cloneDeep(this.transitions);
      
      
      
      
      const isOptional = Boolean(t1[START$1][EPSILON$1]);
      delete t1[START$1][EPSILON$1];
      
      
      let newState = uuid();
      forEach(t1, (T) => {
        forEach(T, (to, token) => {
          if (to === END$1) {
            T[token] = newState;
          }
        });
      });
      
      _addTransition(t1, newState, END$1, EPSILON$1);
      
      forEach(t1[START$1], (to, token) => {
        _addTransition(t1, newState, to, token);
      });
      
      if (isOptional) {
        _addTransition(t1, START$1, END$1, EPSILON$1);
      }
      dfa = new DFABuilder(t1);
    } else {
      dfa = new DFABuilder(cloneDeep(this.transitions));
    }
    return dfa
  }

  toJSON() {
    return cloneDeep(this.transitions)
  }

  
  copy() {
    let t = cloneDeep(this.transitions);
    if (this.transitions) {
      let states = Object.keys(t);
      let map$$1 = { START: START$1, END: END$1 };
      states.forEach((id) => {
        if (id === START$1 || id === END$1) return
        map$$1[id] = uuid();
      });
      forEach(t, (T, from) => {
        if (from !== START$1 && from !== END$1) {
          t[map$$1[from]] = T;
          delete t[from];
        }
        forEach(T, (to, token) => {
          if (to !== START$1 && to !== END$1) {
            T[token] = map$$1[to];
          }
        });
      });
    }
    return new DFABuilder(t)
  }

}

DFABuilder.singleToken = function(token) {
  let dfa = new DFABuilder();
  dfa.addTransition(START$1, END$1, token);
  return dfa
};

function _addTransition(transitions, from, to, token) {
  let T = transitions[from];
  if (!T) {
    transitions[from] = T = {};
  }
  if (token === EPSILON$1 && from === START$1 && to !== END$1) {
    throw new Error('The only EPSILON transition from START must be START->END')
  }
  if (T[token] && T[token] !== to) {
    console.error('Token %s already used. Ignoring this transition.', token);
    return
    
  }
  T[token] = to;
}

function _isTextNodeEmpty(el) {
  return Boolean(/^\s*$/.exec(el.textContent))
}

const { START, END, TEXT: TEXT$2, EPSILON } = DFA;



class Expression {

  constructor(name, root) {
    this.name = name;
    this.root = root;

    this._initialize();
  }

  _initialize() {
    this._compile();
  }

  toString() {
    return this.root.toString()
  }

  copy() {
    return this.root.copy()
  }

  toJSON() {
    return {
      name: this.name,
      content: this.root.toJSON()
    }
  }

  isAllowed(tagName) {
    return Boolean(this._allowedChildren[tagName])
  }

  
  _normalize() {
    this.root._normalize();
  }

  
  _compile() {
    
    this.root._compile();
  }

  _describeError(state, token) {
    let msg = [];
    if (token !== TEXT$2) {
      if (!this.isAllowed(token)) {
        msg.push(`<${token}> is not valid in <${this.name}>\nSchema: ${this.toString()}`);
      } else {
        
        msg.push(`<${token}> is not allowed at the current position in <${this.name}>.\n${this.toString()}`);
        
        
        
      }
    } else {
      msg.push(`TEXT is not allowed at the current position: ${state.trace.join(',')}\n${this.toString()}`);
    }
    return msg.join('')
  }

}

Expression.fromJSON = function(data) {
  const name = data.name;
  const root = _fromJSON(data.content);
  return createExpression(name, root)
};

function createExpression(name, root) {
  if (root instanceof Interleave) {
    return new InterleaveExpr(name, root)
  } else {
    return new DFAExpr(name, root)
  }
}

class DFAExpr extends Expression {

  
  getInitialState() {
    return {
      dfaState: START,
      errors: [],
      trace: [],
    }
  }

  canConsume(state, token) {
    return this.dfa.canConsume(state.dfaState, token)
  }

  consume(state, token) {
    const dfa = this.dfa;
    let oldState = state.dfaState;
    let newState = dfa.consume(oldState, token);
    state.dfaState = newState;
    if (newState === -1) {
      state.errors.push({
        msg: this._describeError(state, token),
        
        
        el: state.el
      });
      return false
    } else {
      state.trace.push(token);
      return true
    }
  }

  isFinished(state) {
    return this.dfa.isFinished(state.dfaState)
  }

  _initialize() {
    super._initialize();

    this._computeAllowedChildren();
  }

  _compile() {
    super._compile();
    this.dfa = new DFA(this.root.dfa.transitions);
  }


  _computeAllowedChildren() {
    this._allowedChildren = _collectAllTokensFromDFA(this.dfa);
  }

  _findInsertPos(el, newTag, mode) {
    const root = this.root;
    if (root instanceof Sequence) {
      return this._findInsertPosInSequence(el, newTag, mode)
    } else if (root instanceof Plus || root instanceof Kleene) {
      if (mode === 'first') {
        return 0
      } else {
        return el.childNodes.length
      }
    }
  }

  _isValid(_tokens) {
    let state = this.getInitialState();
    for (let i = 0; i < _tokens.length; i++) {
      const token = _tokens[i];
      
      
      
      if (!token) continue
      if (!this.consume(state, token)) {
        return false
      }
    }
    return this.isFinished(state)
  }

  _findInsertPosInSequence(el, newTag, mode) {
    const childNodes = el.getChildNodes();
    
    
    
    const tokens = [];
    childNodes.forEach((child)=>{
      
      
      
      const tagName = child.tagName;
      if (!tagName) {
        if (child._isDOMElement && child.isTextNode() && !_isTextNodeEmpty(child)) {
          tokens.push(TEXT$2);
        } else {
          tokens.push(null);
        }
      } else {
        tokens.push(tagName);
      }
    });
    const L = tokens.length;
    const self = this;
    function _isValid(pos) {
      let _tokens = tokens.slice(0);
      _tokens.splice(pos, 0, newTag);
      return self._isValid(_tokens)
    }
    if (mode === 'first') {
      for (let pos = 0; pos <= L; pos++) {
        if (_isValid(pos)) {
          return pos
        }
      }
    } else {
      for (let pos = L; pos >= 0; pos--) {
        if (_isValid(pos)) {
          return pos
        }
      }
    }
    return -1
  }

}

function _collectAllTokensFromDFA(dfa) {
  
  const children = {};
  if (dfa.transitions) {
    forEach(dfa.transitions, (T) => {
      Object.keys(T).forEach((tagName) => {
        if (tagName === EPSILON) return
        children[tagName] = true;
      });
    });
  }
  return children
}

class InterleaveExpr extends Expression {

  constructor(name, root) {
    super(name, root);
  }

  getInitialState() {
    const dfas = this.dfas;
    const dfaStates = new Array(dfas.length);
    dfaStates.fill(START);
    return {
      dfaStates,
      errors: [],
      trace: [],
      
      lastDFA: 0,
    }
  }

  canConsume(state, token) {
    return (this._findNextDFA(state, token) >= 0)
  }

  consume(state, token) {
    const idx = this._findNextDFA(state, token);
    if (idx < 0) {
      state.errors.push({
        msg: this._describeError(state, token),
      });
      return false
    } else {
      const dfa = this.dfas[idx];
      const oldState = state.dfaStates[idx];
      const newState = dfa.consume(oldState, token);
      state.dfaStates[idx] = newState;
      state.trace.push(token);
      return true
    }
  }

  isFinished(state) {
    const dfas = this.dfas;
    for (let i = 0; i < dfas.length; i++) {
      const dfa = dfas[i];
      const dfaState = state.dfaStates[i];
      if (!dfa.isFinished(dfaState)) {
        return false
      }
    }
    return true
  }


  _initialize() {
    super._initialize();

    this._computeAllowedChildren();
  }

  _compile() {
    super._compile();

    this.blocks = this.root.blocks;
    this.dfas = this.blocks.map(b=>new DFA(b.dfa.transitions));
  }

  _computeAllowedChildren() {
    this._allowedChildren = Object.assign(...this.blocks.map((block) => {
      return _collectAllTokensFromDFA(block.dfa)
    }));
  }

  _findNextDFA(state, token) {
    console.assert(state.dfaStates.length === this.dfas.length);
    const dfas = this.dfas;
    for (let i = 0; i < state.dfaStates.length; i++) {
      const dfa = dfas[i];
      const dfaState = state.dfaStates[i];
      if (dfa.canConsume(dfaState, token)) {
        return i
      }
    }
    return -1
  }

  _findInsertPos(el, newTag, mode) { 
    
    return el.childNodes.length
  }

}

class Token {

  constructor(name) {
    this.name = name;
  }

  toString() {
    return this.name
  }

  toJSON() {
    return this.name
  }

  copy() {
    return new Token(this.name)
  }

  _normalize() {}

  _compile() {
    this.dfa = DFABuilder.singleToken(this.name);
  }

}

Token.fromJSON = function (data) {
  return new Token(data)
};


class Choice {

  constructor(blocks) {
    this.blocks = blocks;
  }

  copy() {
    return new Choice(this.blocks.map(b=>b.copy()))
  }

  toJSON() {
    return {
      type: '|',
      blocks: this.blocks.map(b=>b.toJSON())
    }
  }

  _normalize() {
    const blocks = this.blocks;
    for (let i = blocks.length - 1; i >= 0; i--) {
      let block = blocks[i];
      block._normalize();
      
      if (block instanceof Choice) {
        blocks.splice(i,1,...(block.blocks));
      }
    }
  }


  _compile() {
    let dfa = new DFABuilder();
    this.blocks.forEach((block) => {
      if (block instanceof Token) {
        dfa.addTransition(START, END, block.name);
      } else if (block instanceof Interleave) {
        throw new Error('Nested interleave blocks are not supported.')
      } else {
        if (!block.dfa) {
          block._compile();
        }
        dfa.merge(block.dfa);
      }
    });
    this.dfa = dfa;
    return dfa
  }

  toString() {
    return '('+ this.blocks.map(b=>b.toString()).join('|') + ')'
  }

}

Choice.fromJSON = function(data) {
  return new Choice(data.blocks.map((block) => {
    return _fromJSON(block)
  }))
};


class Sequence {

  constructor(blocks) {
    this.blocks = blocks;
  }

  copy() {
    return new Sequence(this.blocks.map(b=>b.copy()))
  }

  toJSON() {
    return {
      type: ',',
      blocks: this.blocks.map(b=>b.toJSON())
    }
  }

  _compile() {
    let dfa = new DFABuilder();
    this.blocks.forEach((block) => {
      if (block instanceof Token) {
        dfa.append(DFABuilder.singleToken(block.name));
      } else if (block instanceof Interleave) {
        throw new Error('Nested interleave blocks are not supported.')
      } else {
        if (!block.dfa) {
          block._compile();
        }
        dfa.append(block.dfa);
      }
    });
    this.dfa = dfa;
    return dfa
  }

  _normalize() {
    const blocks = this.blocks;
    for (let i = blocks.length - 1; i >= 0; i--) {
      let block = blocks[i];
      block._normalize();
      
      if (block instanceof Sequence) {
        blocks.splice(i, 1,...(block.blocks));
      }
    }
  }

  toString() {
    return '('+ this.blocks.map(b=>b.toString()).join(',') + ')'
  }

}

Sequence.fromJSON = function(data) {
  return new Sequence(data.blocks.map((block) => {
    return _fromJSON(block)
  }))
};


class Interleave {

  constructor(blocks) {
    this.blocks = blocks;
  }

  copy() {
    return new Interleave(this.blocks.map(b=>b.copy()))
  }

  toString() {
    return '('+ this.blocks.map(b=>b.toString()).join('~') + ')'
  }

  toJSON() {
    return {
      type: '~',
      blocks: this.blocks.map(b=>b.toJSON())
    }
  }

  _normalize() {
    
  }

  _compile() {
    this.blocks.forEach(block => block._compile());
  }

}

Interleave.fromJSON = function(data) {
  return new Interleave(data.blocks.map((block) => {
    return _fromJSON(block)
  }))
};



class Optional {

  constructor(block) {
    this.block = block;
  }

  copy() {
    return new Optional(this.block.copy())
  }

  toJSON() {
    return {
      type: '?',
      block: this.block.toJSON()
    }
  }

  _compile() {
    const block = this.block;
    if (block instanceof Interleave) {
      throw new Error('Nested interleave blocks are not supported.')
    }
    if (!block.dfa) {
      block._compile();
    }
    this.dfa = block.dfa.optional();
    return this.dfa
  }

  _normalize() {
    const block = this.block;
    block._normalize();
    if (block instanceof Optional) {
      this.block = block.block;
    } else if (block instanceof Kleene) {
      console.error('FIXME -  <optional> is useless here', this.toString());
    }
  }

  toString() {
    return this.block.toString() + '?'
  }

}

Optional.fromJSON = function(data) {
  return new Optional(_fromJSON(data.block))
};



class Kleene {

  constructor(block) {
    this.block = block;
  }

  copy() {
    return new Kleene(this.block.copy())
  }

  toJSON() {
    return {
      type: '*',
      block: this.block.toJSON()
    }
  }

  _compile() {
    const block = this.block;
    if (block instanceof Interleave) {
      throw new Error('Nested interleave blocks are not supported.')
    }
    if (!block.dfa) {
      block._compile();
    }
    this.dfa = block.dfa.kleene();
    return this.dfa
  }

  _normalize() {
    const block = this.block;
    block._normalize();
    if (block instanceof Optional || block instanceof Kleene) {
      this.block = block.block;
    } else if (block instanceof Plus) {
      throw new Error('This does not make sense:' + this.toString())
    }
  }

  toString() {
    return this.block.toString() + '*'
  }

}

Kleene.fromJSON = function(data) {
  return new Kleene(_fromJSON(data.block))
};


class Plus {

  constructor(block) {
    this.block = block;
  }

  copy() {
    return new Plus(this.block.copy())
  }

  toJSON() {
    return {
      type: '+',
      block: this.block.toJSON()
    }
  }

  _compile() {
    const block = this.block;
    if (block instanceof Interleave) {
      throw new Error('Nested interleave blocks are not supported.')
    }
    if (!block.dfa) {
      block._compile();
    }
    this.dfa = block.dfa.plus();
    return this.dfa
  }

  _normalize() {
    const block = this.block;
    block._normalize();
    if (block instanceof Optional || block instanceof Kleene) {
      throw new Error('This does not make sense:' + this.toString())
    } else if (block instanceof Plus) {
      this.block = block.block;
    }
  }

  toString() {
    return this.block.toString() + '+'
  }
}

Plus.fromJSON = function(data) {
  return new Plus(_fromJSON(data.block))
};

function _fromJSON(data) {
  switch(data.type) {
    case ',':
      return Sequence.fromJSON(data)
    case '~':
      return Interleave.fromJSON(data)
    case '|':
      return Choice.fromJSON(data)
    case '?':
      return Optional.fromJSON(data)
    case '+':
      return Plus.fromJSON(data)
    case '*':
      return Kleene.fromJSON(data)
    default:
      if (isString$1(data)) {
        return new Token(data)
      }
      throw new Error('Unsupported data.')
  }
}

const { TEXT: TEXT$1 } = DFA;

class XMLSchema {

  constructor(elementSchemas, startElement) {
    if (!elementSchemas[startElement]) {
      throw new Error('startElement must be a valid element.')
    }
    this._elementSchemas = {};
    this.startElement = startElement;
    
    forEach(elementSchemas, (spec, name) => {
      this._elementSchemas[name] = new ElementSchema(spec.name, spec.type, spec.attributes, spec.expr);
    });
  }

  getTagNames() {
    return Object.keys(this._elementSchemas)
  }

  getElementSchema(name) {
    return this._elementSchemas[name]
  }

  getStartElement() {
    return this.startElement
  }

  toJSON() {
    let result = {
      start: this.getStartElement(),
      elements: {}
    };
    forEach(this._elementSchemas, (schema, name) => {
      result.elements[name] = schema.toJSON();
    });
    return result
  }

  
  toMD() {
    let result = [];
    let elementNames = Object.keys(this._elementSchemas);
    elementNames.sort();
    elementNames.forEach((name) => {
      let elementSchema = this._elementSchemas[name];
      result.push(`# <${elementSchema.name}>`);
      result.push('');
      result.push(`type: ${elementSchema.type}`);
      result.push('attributes: '+ map(elementSchema.attributes, (_, name) => { return name }).join(', '));
      result.push('children:');
      result.push('  '+elementSchema.expr.toString());
      result.push('');
    });
    return result.join('\n')
  }
}

XMLSchema.fromJSON = function(data) {
  let elementSchemas = {};
  forEach(data.elements, (elData) => {
    let elSchema = ElementSchema.fromJSON(elData);
    elementSchemas[elSchema.name] = elSchema;
  });
  return new XMLSchema(elementSchemas, data.start)
};

class ElementSchema {

  constructor(name, type, attributes, expr) {
    this.name = name;
    this.type = type;
    this.attributes = attributes;
    this.expr = expr;

    if (!name) {
      throw new Error("'name' is mandatory")
    }
    if (!type) {
      throw new Error("'type' is mandatory")
    }
    if (!attributes) {
      throw new Error("'attributes' is mandatory")
    }
    if (!expr) {
      throw new Error("'expr' is mandatory")
    }
  }

  toJSON() {
    return {
      name: this.name,
      type: this.type,
      attributes: this.attributes,
      elements: this.expr.toJSON()
    }
  }

  isAllowed(tagName) {
    return this.expr.isAllowed(tagName)
  }

  isTextAllowed() {
    return this.expr.isAllowed(TEXT$1)
  }

  printStructure() {
    return `${this.name} ::= ${this.expr.toString()}`
  }

  findFirstValidPos(el, newTag) {
    return this.expr._findInsertPos(el, newTag, 'first')
  }

  findLastValidPos(el, newTag) {
    return this.expr._findInsertPos(el, newTag, 'last')
  }
}

ElementSchema.fromJSON = function(data) {
  return new ElementSchema(
    data.name,
    data.type,
    data.attributes,
    Expression.fromJSON(data.elements)
  )
};

class XMLTextNode extends TextNodeMixin(XMLDocumentNode) {

  getPath() {
    return [this.id, 'content']
  }

  getText() {
    return this.content
  }

  
  getChildren() {
    const annos = this.getAnnotations();
    
    
    annos.sort(_byStartOffset);
    return annos
  }

  setText(text) {
    const doc = this.getDocument();
    const path = this.getPath();
    const oldText = this.getText();
    
    if (oldText.length > 0) {
      doc.update(path, { type: 'delete', start: 0, end: oldText.length });
    }
    doc.update(path, { type: 'insert', start: 0, text });
    return this
  }

  

  getTextContent() {
    return this.getText()
  }

  setTextContent(text) {
    return this.setText(text)
  }

  get textContent() {
    return this.getText()
  }

  set textContent(text) {
    this.setText(text);
  }

  appendChild(child) {
    
    
    
    
    
    
    
    throw new Error('This is not implemented yet.')
  }

  removeChild(child) {
    
    throw new Error('This is not implemented yet.')
  }

  isTextNode() {
    return true
  }

}

XMLTextNode.prototype.text = DOMElement.prototype.text;

XMLTextNode.prototype._elementType = 'text';

XMLTextNode.isText = true;
XMLTextNode.isBlock = true;

XMLTextNode.type = 'text';

XMLTextNode.schema = {
  content: "text"
};

function _byStartOffset(a,b) {
  return a.start.offset - b.start.offset
}

class TextNodeConverter extends XMLNodeConverter {

  import(el, node, converter) {
    node.content = converter.annotatedText(el, [node.id, 'content']);
  }

  export(node, el, converter) {
    el.tagName = this.tagNameNS;
    el.setAttributes(node.attributes);
    el.append(converter.annotatedText([node.id, 'content']));
  }

}

function checkSchema(xmlSchema) {
  const tagNames = xmlSchema.getTagNames();
  let issues = [];
  for (let i = 0; i < tagNames.length; i++) {
    const name = tagNames[i];
    const elementSchema = xmlSchema.getElementSchema(name);
    switch(elementSchema.type) {
      case 'text': {
        issues = issues.concat(_checkTextElement(elementSchema));
        break
      }
      case 'element':
      case 'container': {
        issues = issues.concat(_checkElement(elementSchema));
        break
      }
      case 'hybrid': {
        issues = issues.concat(_checkHybridElement(elementSchema));
        break
      }
      case 'annotation': {
        issues = issues.concat(_checkAnnotation(elementSchema));
        break
      }
      case 'inline-element': {
        issues = issues.concat(_checkInlineElement(elementSchema));
        break
      }
      case 'anchor': {
        issues = issues.concat(_checkAnchor(elementSchema));
        break
      }
      case 'external': {
        break
      }
      default:
        throw new Error('Unsupported element classification.')
    }
  }
  return issues
}

function _checkTextElement(elementSchema) {
  const issues = [];
  
  if (_usedInline(elementSchema)) {
    issues.push(`[1]: text element <${elementSchema.name}> is used inline by ${_usedInlineBy(elementSchema).join(',')}`);
  }
  
  if (!elementSchema.isText) {
    issues.push(`[4]: text element <${elementSchema.name}> does not allow text content`);
  }
  
  if (elementSchema.isStructured) {
    issues.push(`[5]: text element <${elementSchema.name}> must not allow structured content`);
  }
  return issues
}

function _checkElement(elementSchema) {
  const issues = [];
  if (_usedInline(elementSchema)) {
    issues.push(`[2]: element <${elementSchema.name}> is used inline by ${_usedInlineBy(elementSchema).join(',')}`);
  }
  
  if (elementSchema.isText) {
    issues.push(`[6]: element <${elementSchema.name}> must not allow text content`);
  }
  return issues
}

function _checkHybridElement(elementSchema) {
  const issues = [];
  if (_usedInlineOnly(elementSchema)) {
    issues.push(`[2.2]: hybrid element <${elementSchema.name}> is used inline by ${_usedInlineBy(elementSchema).join(',')}`);
  }
  
  if (!elementSchema.isText || !elementSchema.isStructured) {
    issues.push(`[7]: hybrid element <${elementSchema.name}> must allow text and structured content`);
  }
  return issues
}

function _checkAnnotation(elementSchema) {
  const issues = [];
  
  if (!_usedInlineOnly(elementSchema)) {
    issues.push(`[3]: annotation <${elementSchema.name}> is used in structured content by ${_usedStructuredBy(elementSchema).join(',')}`);
  }
  if (!elementSchema.isText) {
    issues.push(`[8]: annotation <${elementSchema.name}> does not allow text content`);
  }
  
  
  
  
  
  
  return issues
}

function _checkInlineElement(elementSchema) {
  const issues = [];
  if (!_usedInlineOnly(elementSchema)) {
    issues.push(`[3]: inline-element <${elementSchema.name}> is used in structured content by ${_usedStructuredBy(elementSchema).join(',')}`);
  }
  return issues
}

function _checkAnchor(elementSchema) {
  const issues = [];
  if (!_usedInlineOnly(elementSchema)) {
    issues.push(`[3]: anchor <${elementSchema.name}> is used in structured content by ${_usedStructuredBy(elementSchema).join(',')}`);
  }
  return issues
}

function _usedInline(elementSchema) {
  let usedInlineBy = elementSchema.usedInlineBy || {};
  return Object.keys(usedInlineBy).length > 0
}

function _usedInlineBy(elementSchema) {
  let usedInlineBy = elementSchema.usedInlineBy || {};
  return Object.keys(usedInlineBy)
}


function _usedInlineOnly(elementSchema) {
  let usedStructuredBy = _usedStructuredBy(elementSchema);
  return (usedStructuredBy.length === 0)
}

function _usedStructuredBy(elementSchema) {
  let usedInlineBy = elementSchema.usedInlineBy || {};
  let parents = Object.keys(elementSchema.parents);
  let usedStructuredBy = parents.filter((name) => {
    return !(usedInlineBy[name])
  });
  return usedStructuredBy
}

function _lookupRNG(fs, searchDirs, file) {
  for (let i = 0; i < searchDirs.length; i++) {
    let absPath = searchDirs[i] + '/' + file;
    if (fs.existsSync(absPath)) {
      return absPath
    }
  }
}

function _expandIncludes(fs, searchDirs, root) {
  let includes = root.findAll('include');
  if (includes.length === 0) return false

  includes.forEach((include) => {
    const parent = include.parentNode;
    const href = include.attr('href');
    const rngPath = _lookupRNG(fs, searchDirs, href);
    if (!rngPath) throw new Error(`Could not find ${href}`)
    const rngStr = fs.readFileSync(rngPath, 'utf8');
    const rng = DefaultDOMElement.parseXML(rngStr, 'full-doc');
    const grammar = rng.find('grammar');
    if (!grammar) throw new Error('No grammar element found')
    grammar.children.forEach((child) => {
      parent.insertBefore(child, include);
    });
    include.remove();
  });
  return true
}

function _loadRNG(fs, searchDirs, entry) {
  if (!isArray$1(searchDirs)) searchDirs = [searchDirs];
  let rngPath = _lookupRNG(fs, searchDirs, entry);
  let rngStr = fs.readFileSync(rngPath, 'utf8');
  const rng = DefaultDOMElement.parseXML(rngStr, 'full-doc');
  
  while(_expandIncludes(fs, searchDirs, rng)) {  }
  return rng
}

const { TEXT: TEXT$5 } = DFA;

function analyze(elementSchemas) {
  forEach(elementSchemas, (elementSchema) => {
    Object.assign(elementSchema, {
      children: {},
      parents: {},
      siblings: {},
      usedInlineBy: {},
      usedStructuredBy: {}
    });
  });
  forEach(elementSchemas, (elementSchema) => {
    _analyzeElementSchema(elementSchema, elementSchemas);
  });
}


function _analyzeElementSchema(elementSchema, elementSchemas) {
  const expr = elementSchema.expr;
  const name = elementSchema.name;
  if (!expr) return
  let _siblings = [];
  if (expr instanceof DFAExpr) {
    if (expr.dfa) {
      _siblings = expr.dfa._tokensByPath();
    }
  } else if (expr instanceof InterleaveExpr) {
    expr.dfas.forEach((dfa) => {
      if (dfa) {
        _siblings = _siblings.concat(dfa._tokensByPath());
      }
    });
  }
  if (_siblings.length === 0) {
    
    
    if (elementSchema.type === 'implicit') elementSchema.type = 'element';
  }

  let hasText = false;
  let hasElements = false;
  _siblings.forEach((tagNames) => {
    
    let _hasText = tagNames.indexOf(TEXT$5) >= 0;
    let _hasElements = (!_hasText && tagNames.length > 0);
    if (_hasText) {
      hasText = true;
    }
    if (_hasElements) {
      hasElements = true;
    }
    tagNames.forEach((tagName) => {
      const childSchema = elementSchemas[tagName];
      if (!childSchema) return
      childSchema.parents[name] = true;
      elementSchema.children[tagName] = true;
      
      elementSchema.siblings[name] = tagNames;
      if (_hasElements) childSchema.usedStructuredBy[name] = true;
      if (_hasText) childSchema.usedInlineBy[name] = true;
    });
  });
  
  if (hasElements) {
    elementSchema.isStructured = true;
  }
  if (hasText) {
    elementSchema.isText = true;
  }
  if (elementSchema.type === 'implicit') {
    if (hasText) {
      elementSchema.type = 'text';
    } else {
      elementSchema.type = 'element';
    }
  }
}

const TEXT$4 = DFA.TEXT;


function compileRNG(fs, searchDirs, entry) {
  let rng;
  
  if (arguments.length === 1 && isString$1(arguments[0])) {
    rng = DefaultDOMElement.parseXML(arguments[0]);
  } else {
    rng = _loadRNG(fs, searchDirs, entry);
  }

  let grammar = rng.find('grammar');
  if (!grammar) throw new Error('<grammar> not found.')

  
  _registerDefinitions(grammar);

  
  let transformedGrammar = _transformRNG(grammar);

  

  let xmlSchema = _compile(transformedGrammar);

  return xmlSchema
}




function _registerDefinitions(grammar) {
  let defs = {};
  
  grammar.children.forEach((child) => {
    const tagName = nameWithoutNS$1(child.tagName);
    if (tagName === 'define') {
      _processDefine(child, defs);
    }
  });
  grammar.defs = defs;
}

function _processDefine(el, defs) {
  const name = el.attr('name');
  const combine = el.attr('combine');
  if (combine === 'interleave') {
    if (defs[name]) {
      defs[name].append(el.children);
    } else {
      defs[name] = el;
    }
  } else {
    if (defs[name]) {
      console.info(`Overwriting definition ${name}`);
    }
    defs[name] = el;
  }
}



function _transformRNG(grammar) { 
  
  const elements = {};
  const defs = grammar.defs;
  const elementDefinitions = grammar.findAll('define > element');
  const doc = DefaultDOMElement.createDocument('xml');
  const newGrammar = doc.createElement('grammar');
  elementDefinitions.forEach((el) => {
    const name = el.attr('name');
    if (!name) throw new Error("'name' is mandatory.")
    const transformed = _transformElementDefinition(doc, name, el, defs);
    elements[name] = transformed;
    newGrammar.appendChild(transformed);
  });

  
  const elementTypes = grammar.findAll('elementType');
  elementTypes.forEach((typeEl) => {
    const name = typeEl.attr('name');
    const type = typeEl.attr('s:type') || typeEl.attr('type');
    if (!name || !type) throw new Error('Attributes name and type are mandatory.')
    const element = elements[name];
    if (!element) throw new Error(`Unknown element ${name}.`)
    element.attr('type', type);
  });

  
  const startElement = _extractStart(grammar);
  if (!startElement) throw new Error('<start> is mandatory.')
  newGrammar.appendChild(doc.createElement('start').attr('name', startElement));

  return newGrammar
}

function _transformElementDefinition(doc, name, orig, defs) {
  let el = doc.createElement('element').attr('name', name);
  
  
  el.attr('type', 'implicit');
  
  
  let attributes = doc.createElement('attributes');
  let children = doc.createElement('children');
  orig.children.forEach((child) => {
    let block = _transformBlock(doc, child, defs, {});
    block.forEach((el) => {
      if (el.find('attribute') || el.is('attribute')) {
        attributes.appendChild(el);
      } else {
        children.appendChild(el);
      }
    });
  });
  el.appendChild(attributes);
  el.appendChild(children);

  

  let hasPruned = true;
  while (hasPruned) {
    
    let nestedChoice = children.find('choice > choice');
    if (nestedChoice) {
      
      let parentChoice = nestedChoice.parentNode;
      
      let children = nestedChoice.children;
      children.forEach((child) => {
        parentChoice.insertBefore(child, nestedChoice);
      });
      parentChoice.removeChild(nestedChoice);
      continue
    }
    
    let choices = children.findAll('choice');
    for (let i = 0; i < choices.length; i++) {
      let choice = choices[i];
      let children = choice.children;
      if (children.length === 1) {
        choice.parentNode.replaceChild(choice, children[0]);
      }
      continue
    }
    hasPruned = false;
  }

  return el
}

function _transformBlock(doc, block, defs, visiting={}) {
  
  
  const tagName = block.tagName;
  switch (tagName) {
    case 'element': {
      return [doc.createElement('element').attr('name',block.attr('name'))]
    }
    case 'ref': {
      return _expandRef(doc, block, defs, visiting)
    }
    case 'empty':
    case 'notAllowed': {
      return []
    }
    default: {
      let clone$$1 = block.clone(false);
      block.children.forEach((child) => {
        clone$$1.append(_transformBlock(doc, child, defs, visiting));
      });
      return [clone$$1]
    }
  }
}

function _expandRef(doc, ref, defs, visiting={}) {
  const name = ref.attr('name');
  
  if (visiting[name]) {
    throw new Error('Cyclic references are not supported.')
  }
  visiting[name] = true;

  const def = defs[name];
  if (!def) throw new Error(`Unknown definition ${name}`)

  let expanded = [];
  let children = def.children;
  children.forEach((child) => {
    let transformed = _transformBlock(doc, child, defs, visiting);
    expanded = expanded.concat(transformed);
  });

  
  delete visiting[name];
  return expanded
}

function _extractStart(grammar) {
  
  
  const start = grammar.find('start');
  if (!start) {
    throw new Error('<grammar> must have a <start> element')
  }
  
  
  const startRef = start.find('ref');
  if (!startRef) {
    throw new Error('Expecting one <ref> inside of <start>.')
  }
  const name = startRef.attr('name');
  return name
}

function _compile(grammar) {
  const schemas = {};
  const elements = grammar.children.filter(el=>el.tagName==='element');
  elements.forEach((element) => {
    const name = element.attr('name');
    const attributes = _collectAttributes(element.find('attributes'));
    const children = element.find('children');
    const type = element.attr('type');
    let block = _processChildren(children, grammar);
    let expr = createExpression(name, block);
    let schema = { name, type, attributes, expr };
    schemas[name] = schema;
  });

  
  analyze(schemas);

  const start = grammar.find('start');
  if (!start) {
    throw new Error('<start> is mandatory')
  }
  const startElement = start.attr('name');
  if (!startElement) {
    throw new Error('<start> must have "name" set')
  }
  return new XMLSchema(schemas, startElement)
}

function _processChildren(el, grammar) {
  let blocks = _processBlocks(el.children, grammar);
  if (blocks.length === 1) {
    return blocks[0]
  } else {
    return new Sequence(blocks)
  }
}

function _processBlocks(children, grammar) {
  const blocks = [];
  for (var i = 0; i < children.length; i++) {
    const child = children[i];
    
    switch(child.tagName) {
      
      case 'attribute':
      case 'empty':
      case 'notAllowed': {
        break
      }
      case 'element': {
        const elName = child.attr('name');
        blocks.push(new Token(elName));
        break
      }
      case 'text': {
        blocks.push(new Token(TEXT$4));
        break
      }
      case 'ref': {
        const block = _processReference(child, grammar);
        blocks.push(block);
        break
      }
      case 'group': {
        blocks.push(_processSequence(child, grammar));
        break
      }
      case 'choice': {
        const block = _processChoice(child, grammar);
        blocks.push(block);
        break
      }
      case 'optional': {
        const block = new Optional(_processChildren(child, grammar));
        blocks.push(block);
        break
      }
      case 'oneOrMore': {
        const block = new Plus(_processChildren(child, grammar));
        blocks.push(block);
        break
      }
      case 'zeroOrMore': {
        const block = new Kleene(_processChildren(child, grammar));
        blocks.push(block);
        break
      }
      case 'interleave': {
        const block = new Interleave(_processBlocks(child.children, grammar));
        blocks.push(block);
        break
      }
      default:
        throw new Error('Not supported yet: ' + child.tagName)
    }
  }
  return blocks
}

function _processSequence(el, grammar) {
  if (el.expr) return el.expr.copy()
  const blocks = _processBlocks(el.children, grammar);
  el.expr = new Sequence(blocks);
  return el.expr
}

function _processChoice(el, grammar) {
  if (el.expr) return el.expr.copy()
  let blocks = _processBlocks(el.children, grammar);
  el.expr = new Choice(blocks);
  return el.expr
}

function _processReference(ref, grammar) {
  const name = ref.attr('name');
  const def = grammar.defs[name];
  if (!def) throw new Error(`Illegal ref: ${name} is not defined.`)
  if (def.expr) return def.expr.copy()
  
  
  if (grammar._visiting[name]) {
    throw new Error('Cyclic references are not supported yet')
  }
  grammar._visiting[name] = true;
  const block = _processChildren(def, grammar);
  def.expr = block;
  delete grammar._visiting[name];
  return def.expr
}

function _collectAttributes(el, grammar, attributes = {}) {
  
  
  let children = el.children;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    switch (child.tagName) {
      case 'attribute': {
        const attr = _transformAttribute(child);
        attributes[attr.name] = attr;
        break
      }
      case 'group':
      case 'choice':
      case 'optional':
      case 'oneOrMore':
      case 'zeroOrMore': {
        _collectAttributes(child, grammar, attributes);
        break
      }
      default:
        
    }
  }
  return attributes
}

function _transformAttribute(el) {
  const name = el.attr('name');
  
  return {
    name
  }
}

class XMLInlineElementNode extends XMLAnnotationNode {

  
  get parentNode() {
    const path = this.start.path;
    if (path[0]) {
      const doc = this.getDocument();
      return doc.get(path[0])
    }
    return this._parentNode
  }

  set parentNode(parent) {
    const path = this.start.path;
    if (path[0]) {
      throw new Error('parent of inline-element is implicitly given')
    }
    this._parentNode = parent;
  }

}

XMLInlineElementNode.prototype._elementType = 'inline-element';



XMLInlineElementNode.prototype._isInlineNode = true;
XMLInlineElementNode.isInline = true;


XMLInlineElementNode.type = 'inline-element';

XMLInlineElementNode.schema = {
  childNodes: { type: ['array', 'id'], default: [], owned: true},
};

function registerSchema(config, xmlSchema, DocumentClass) {
  const schemaName = xmlSchema.getName();
  
  config.defineSchema({
    name: schemaName,
    version: xmlSchema.getVersion(),
    DocumentClass: DocumentClass,
    
    
    defaultTextType: 'p'
  });
  const tagNames = xmlSchema.getTagNames();
  
  tagNames.forEach((tagName) => {
    const elementSchema = xmlSchema.getElementSchema(tagName);
    const name = elementSchema.name;
    let NodeClass, ConverterClass;
    switch (elementSchema.type) {
      case 'element':
      case 'hybrid': {
        NodeClass = XMLElementNode;
        ConverterClass = ElementNodeConverter;
        break
      }
      case 'text': {
        NodeClass = XMLTextNode;
        ConverterClass = TextNodeConverter;
        break
      }
      case 'annotation': {
        NodeClass = XMLAnnotationNode;
        ConverterClass = XMLNodeConverter;
        break
      }
      case 'anchor': {
        NodeClass = XMLAnchorNode;
        ConverterClass = XMLNodeConverter;
        break
      }
      case 'inline-element': {
        NodeClass = XMLInlineElementNode;
        ConverterClass = XMLNodeConverter;
        break
      }
      case 'external': {
        NodeClass = XMLExternalNode;
        ConverterClass = ExternalNodeConverter;
        break
      }
      case 'container': {
        NodeClass = XMLContainerNode;
        ConverterClass = ElementNodeConverter;
        break
      }
      default:
        throw new Error('Illegal state')
    }
    
    class Node extends NodeClass {}
    Node.type = name;

    
    const attributes = elementSchema.attributes;
    forEach(attributes, (spec, name) => {
      _defineAttribute(Node, name, spec);
    });

    config.addNode(Node);
    let converter = new ConverterClass(name);
    config.addConverter(schemaName, converter);
  });
}

const BUILTIN_ATTRS = ['id', 'type', 'attributes', 'childNodes'];

function _defineAttribute(Node, attributeName) {
  let name = attributeName.replace(':', '_');
  name = camelCase(name);
  if (BUILTIN_ATTRS.indexOf(name) >= 0) {
    
    return
  }
  Object.defineProperty(Node.prototype, name, {
    get() {
      return this.getAttribute(attributeName)
    },
    set(val) {
      this.setAttribute(attributeName, val);
      return this
    }
  });
}

const DISABLED = Object.freeze({
  disabled: true
});


class SchemaDrivenCommandManager extends CommandManager {

  _initialize() {
    const annotationCommands = new Map();
    const insertCommands = new Map();
    const switchTypeCommands = new Map();
    const otherCommands = new Map();
    this.commands.forEach((command) => {
      const name = command.getName();
      if (command.isAnnotationCommand()) {
        annotationCommands.set(name, command);
      } else if (command.isInsertCommand()) {
        insertCommands.set(name, command);
      } else if (command.isSwitchTypeCommand()) {
        switchTypeCommands.set(name, command);
      } else {
        otherCommands.set(name, command);
      }
    });
    this.annotationCommands = annotationCommands;
    this.insertCommands = insertCommands;
    this.switchTypeCommands = switchTypeCommands;
    this.otherCommands = otherCommands;
  }

  _getCommand(commandName) {
    let cmd = this.annotationCommands.get(commandName) ||
      this.insertCommands.get(commandName) ||
      this.switchTypeCommands.get(commandName) ||
      this.otherCommands.get(commandName);
    return cmd
  }

  _updateCommandStates(editorSession) {
    const commandStates = {};
    const annotationCommands = this.annotationCommands;
    const insertCommands = this.insertCommands;
    const switchTypeCommands = this.switchTypeCommands;
    const commandContext = this._getCommandContext();
    const params = this._getCommandParams();
    const doc = editorSession.getDocument();
    const selectionState = params.selectionState;
    const sel = params.selection;
    const isBlurred = params.editorSession.isBlurred();
    const noSelection = !sel || sel.isNull() || !sel.isAttached();

    
    
    
    
    if (isBlurred || noSelection || sel.isCustomSelection()) {
      _disableEditingCommands();
    } else {
      const path = sel.start.path;
      const node = doc.get(path[0]);

      
      
      
      
      if (!node) {
        
        throw new Error('FIXME: explain when this happens')
      }

      const isInsideText = node.isText();
      const xmlSchema = doc.getXMLSchema();

      
      
      if (isInsideText && sel.isPropertySelection() && !selectionState.isInlineNodeSelection()) {
        const elementSchema = xmlSchema.getElementSchema(node.type);
        _evaluateTyped(this.annotationCommands, elementSchema);
      } else {
        _disable(this.annotationCommands);
      }

      
      let parentNode = node.parentNode;
      if (!parentNode || !parentNode.isContainer()) {
        _disable(this.insertCommands);
      } else {
        
        
        const elementSchema = xmlSchema.getElementSchema(parentNode.type);
        _evaluateTyped(this.insertCommands, elementSchema);
      }

      
      
      if (!sel.containerId || !isInsideText || !parentNode.isContainer()) {
        _disable(this.switchTypeCommands);
      } else {
        
        
        const elementSchema = xmlSchema.getElementSchema(parentNode.type);
        _evaluateTyped(this.switchTypeCommands, elementSchema);
      }
    }

    
    _evaluateUntyped(this.otherCommands);

    
    
    editorSession.setCommandStates(commandStates);

    function _disableEditingCommands() {
      _disable(annotationCommands);
      _disable(insertCommands);
      _disable(switchTypeCommands);
    }

    function _disable(commands) {
      commands.forEach((cmd, name) => {
        commandStates[name] = DISABLED;
      });
    }
    function _evaluateTyped(commands, elementSchema) {
      commands.forEach((cmd, name) => {
        const type = cmd.getType();
        if (elementSchema.isAllowed(type)) {
          commandStates[name] = cmd.getCommandState(params, commandContext);
        } else {
          commandStates[name] = DISABLED;
        }
      });
    }
    function _evaluateUntyped(commands) {
      commands.forEach((cmd, name) => {
        commandStates[name] = cmd.getCommandState(params, commandContext);
      });
    }

  }
}

const { TEXT: TEXT$6 } = DFA;

function validateXML(xmlSchema, dom) {
  let root = dom.find(xmlSchema.getStartElement());
  if (!root) {
    return {
      errors: [{
        msg: 'Start element is missing.',
        el: dom
      }]
    }
  } else {
    return validateElement(xmlSchema, root)
  }
}

function validateElement(xmlSchema, el) {
  let errors = [];
  let valid = true;
  let q = [el];
  while(q.length>0) {
    let next = q.shift();
    const tagName = next.tagName;
    const elementSchema = xmlSchema.getElementSchema(tagName);
    if (!elementSchema) throw new Error(`Unsupported element: ${tagName}`)
    let res = _validateElement(elementSchema, next);
    if (!res.ok) {
      errors = errors.concat(res.errors);
      valid = false;
    }
    if (next.isElementNode()) {
      q = q.concat(next.getChildren());
    }
  }
  return {
    errors: errors,
    ok: valid
  }
}

function _validateElement(elementSchema, el) {
  let errors = [];
  let valid = true;
  { 
    const res = _checkAttributes(elementSchema, el);
    if (!res.ok) {
      errors = errors.concat(res.errors);
      valid = false;
    }
  }
  { 
    const res = _checkChildren(elementSchema, el);
    if (!res.ok) {
      errors = errors.concat(res.errors);
      valid = false;
    }
  }
  return {
    errors,
    ok: valid
  }
}

function _checkAttributes(elementSchema, el) { 
  return { ok: true }
}

function _checkChildren(elementSchema, el) {
  
  
  if (elementSchema.type === 'external') {
    return true
  }
  const expr = elementSchema.expr;
  const state = expr.getInitialState();
  const iterator = el.getChildNodeIterator();
  let valid = true;
  while (valid && iterator.hasNext()) {
    const childEl = iterator.next();
    let token;
    if (childEl.isTextNode()) {
      
      if (elementSchema.type !== 'text' && _isTextNodeEmpty(childEl)) {
        continue
      }
      token = TEXT$6;
    } else if (childEl.isElementNode()) {
      token = childEl.tagName;
    } else {
      continue
    }
    if (!expr.consume(state, token)) {
      valid = false;
    }
  }
  
  if (state.errors.length > 0) {
    state.errors.forEach((err) => {
      err.el = el;
    });
  }
  if (valid && !expr.isFinished(state)) {
    state.errors.push({
      msg: `<${el.tagName}> is incomplete.\nSchema: ${expr.toString()}`,
      el
    });
    valid = false;
  }
  if (valid) {
    state.ok = true;
  }
  return state
}

const { TEXT: TEXT$7 } = DFA;

class ValidatingChildNodeIterator {

  constructor(el, it, expr) {
    this.el = el;
    this.it = it;
    this.expr = expr;
    this.state = expr.getInitialState();
    this._oldStates = [];
  }

  hasNext() {
    return this.it.hasNext()
  }

  next() {
    const state = this.state;
    const expr = this.expr;
    let next = this.it.next();
    let oldState = cloneDeep(this.state);
    let ok;
    if (next.isTextNode()) {
      ok = expr.consume(state, TEXT$7);
    } else if (next.isElementNode()) {
      ok = expr.consume(state, next.tagName);
    }
    if (!ok) {
      if (next.isTextNode()) {
        if (!_isTextNodeEmpty(next)) {
          console.error(`TEXT is invalid within <${expr.name}>. Skipping.`, next.textContent);
        }
      } else if (next.isElementNode()) {
        let error = last$1(state.errors);
        console.error(error.msg, this.el.getNativeElement());
      }
      
      this.state = oldState;
      return next.createComment(next.outerHTML)
    } else {
      this._oldStates.push(oldState);
      return next
    }
  }

  back() {
    this.it.back();
    this.state = this._oldStates.pop();
    return this
  }

  peek() {
    return this.it.peek()
  }

}

function prettyPrintXML(xml) {
  let dom;
  if (isString$1(xml)) {
    dom = DefaultDOMElement.parseXML(xml);
  } else {
    dom = xml;
  }
  const result = [];
  dom.children.forEach((el) => {
    _prettyPrint(result, el, 0);
  });
  return result.join('\n')
}

function _prettyPrint(result, el, level) {
  let indent = new Array(level*2).join(' ');
  if (el.isElementNode()) {
    const isMixed = _isMixed(el);
    if (isMixed) {
      result.push(indent + el.outerHTML);
    } else {
      let children = el.children;
      const tagName = el.tagName;
      let tagStr = [`<${tagName}`];
      el.getAttributes().forEach((val, name) => {
        tagStr.push(`${name}="${val}"`);
      });
      if (children.length > 0) {
        result.push(indent + tagStr.join(' ') + '>');
        el.children.forEach((child) => {
          _prettyPrint(result, child, level+1);
        });
        result.push(indent + `</${tagName}>`);
      } else {
        result.push(indent + tagStr.join(' ') + ' />');
      }
    }
  } else {
    result.push(indent + el.outerHTML);
  }
}

function _isMixed(el) {
  const childNodes = el.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    let child = childNodes[i];
    if (child.isTextNode() && !_isTextNodeEmpty(child)) {
      return true
    }
  }
}

var ButtonPackage = {
  name: 'button',
  configure: function(config) {
    config.addComponent('button', Button$$1);

    config.addIcon('dropdown', { 'fontawesome': 'fa-angle-down' });
  }
};

class ContextMenu extends ToolPanel {

  didMount() {
    super.didMount();
    if (!this.context.scrollPane) {
      throw new Error('Requires a scrollPane context')
    }
    this.context.scrollPane.on('context-menu:opened', this._onContextMenuOpened, this);
  }

  dispose() {
    super.dispose();
    this.context.scrollPane.off(this);
  }

  
  render($$) {
    let el = $$('div').addClass('sc-context-menu sm-hidden');
    return el
  }

  getActiveToolGroupNames() {
    return ['context-menu-primary', 'context-menu-document']
  }

  showDisabled() {
    return true
  }

  
  getToolStyle() {
    return 'plain-dark'
  }

  hide() {
    this.el.addClass('sm-hidden');
  }

  
  _onContextMenuOpened(hints) {
    let mouseBounds = hints.mouseBounds;
    this.el.removeClass('sm-hidden');
    let contextMenuWidth = this.el.htmlProp('offsetWidth');

    
    this.el.css('top', mouseBounds.top);
    let leftPos = mouseBounds.left;
    
    leftPos = Math.max(leftPos, 0);
    
    let maxLeftPos = mouseBounds.left + mouseBounds.right - contextMenuWidth;
    leftPos = Math.min(leftPos, maxLeftPos);
    this.el.css('left', leftPos);
  }
}

var ContextMenuPackage = {
  name: 'context-menu',
  configure: function(config) {
    config.addComponent('context-menu', ContextMenu);
  }
};

class Grid extends Component {
  render($$) {
    let el = $$('div').addClass('sc-grid');
    if (this.props.mobile) {
      el.addClass('sm-mobile');
    }
    el.append(this.props.children);
    return el
  }
}


class Row extends Component {
  render($$) {
    let el = $$('div').addClass('se-row');
    el.append(this.props.children);
    return el
  }
}


class Cell extends Component {
  render($$) {
    let el = $$('div').addClass('se-cell');
    el.addClass('sm-column-'+this.props.columns);
    el.append(this.props.children);
    return el
  }
}

Grid.Row = Row;
Grid.Cell = Cell;

var GridPackage = {
  name: 'grid',
  configure: function(config) {
    config.addComponent('grid', Grid);
  }
};

class Gutter extends ToolPanel {

  render($$) {
    let el = $$('div').addClass(this.getClassNames());
    el.addClass('sm-hidden');
    el.addClass('sm-theme-'+this.getTheme());
    let activeToolGroups = this.state.activeToolGroups;
    let activeToolsEl = $$('div').addClass('se-active-tools');

    activeToolGroups.forEach((toolGroup) => {
      let toolGroupProps = Object.assign({}, toolGroup, {
        toolStyle: this.getToolStyle(),
        showIcons: true
      });
      activeToolsEl.append(
        $$(toolGroup.Class, toolGroupProps)
      );
    });

    el.append(activeToolsEl);
    return el
  }

  
  getToolStyle() {
    return 'outline-dark'
  }

  show(hints) {
    this.el.removeClass('sm-hidden');
    this._position(hints);
  }

  hide() {
    this.el.addClass('sm-hidden');
  }

  _position(hints) {
    if (hints) {
      
      this.el.css('top', hints.rectangle.top + hints.rectangle.height - hints.rectangle.height / 2);
      this.el.css('left', 0);
    }
  }

  getClassNames() {
    return 'sc-gutter'
  }

  getTheme() {
    return 'dark'
  }

  getActiveToolGroupNames() {
    return ['gutter']
  }

}

var GutterPackage = {
  name: 'gutter',
  configure: function(config) {
    config.addComponent('gutter', Gutter);
  }
};

class Input extends Component {

  _onChange() {
    let editorSession = this.context.editorSession;
    let path = this.props.path;
    let newVal = this.el.val();

    editorSession.transaction(function(tx) {
      tx.set(path, newVal);
    });
  }

  render($$) {
    let val;

    if (this.props.path) {
      let editorSession = this.context.editorSession;
      let doc = editorSession.getDocument();
      val = doc.get(this.props.path);
    } else {
      val = this.props.value;
    }

    let el = $$('input').attr({
      value: val,
      type: this.props.type,
      placeholder: this.props.placeholder
    })
    .addClass('sc-input');

    if (this.props.path) {
      el.on('change', this._onChange);
    }

    if (this.props.centered) {
      el.addClass('sm-centered');
    }

    return el
  }
}

var InputPackage = {
  name: 'input',
  configure: function(config) {
    config.addComponent('input', Input);
  }
};

var LayoutPackage = {
  name: 'layout',
  configure: function(config) {
    config.addComponent('layout', Layout$$1);
  }
};

class Modal extends Component {

  render($$) {
    let el = $$('div').addClass('sc-modal');

    
    
    el.on('click', this._closeModal);

    if (this.props.width) {
      el.addClass('sm-width-'+this.props.width);
    }

    el.append(
      $$('div').addClass('se-body').append(
        this.props.children
      )
    );
    return el
  }

  _closeModal(e) {
    let closeSurfaceClick = e.target.classList.contains('sc-modal');
    if (closeSurfaceClick) {
      this.send('closeModal');
    }
  }

}

var ModalPackage = {
  name: 'modal',
  configure: function(config) {
    config.addComponent('modal', Modal);
  }
};

var OverlayPackage = {
  name: 'overlay',
  configure: function(config) {
    config.addComponent('overlay', Overlay);
  }
};

class Dropzones extends Component {

  didMount() {
    this.context.dragManager.on('drag:started', this.onDragStarted, this);
    this.context.dragManager.on('drag:finished', this.onDragFinished, this);
  }

  render($$) {
    let el = $$('div').addClass('sc-dropzones');

    if (this.state.dropzones) {
      el.on('dragenter', this.onDrag)
        .on('dragover', this.onDrag);

      
      forEach(this.state.dropzones, (dropzones, surfaceId) => {
        dropzones.forEach((dropzone, index) => {
          let dropType = dropzone.type;
          let dropzoneEl;
          if (dropType === 'place') {
            dropzoneEl = $$('div').addClass('se-dropzone')
              .attr({
                'data-dropzone-index': index,
                'data-dropzone-surface': surfaceId
              }).append(
                $$('div').addClass('se-drop-teaser').css({
                  top: dropzone.teaserPos
                })
              );
          } else if (dropType === 'custom') {
            dropzoneEl = $$('div').addClass('se-custom-dropzone').attr({
              'data-dropzone-index': index,
              'data-dropzone-surface': surfaceId
            }).append(
              
              
              $$('div').addClass('se-message').append(dropzone.message)
            );
          }
          if (dropzoneEl) {
            let shield = $$('div').addClass('se-drop-shield')
              .on('dragenter', this.onDragEnter)
              .on('dragleave', this.onDragLeave)
              .on('drop', this.onDrop)
              .on('mouseenter', this.onDragEnter)
              .on('mouseleave', this.onDragLeave)
              .on('mouseup', this.onDrop);
            dropzoneEl.append(shield);
            dropzoneEl.css({
              position: 'absolute',
              top: dropzone.top,
              left: dropzone.left,
              width: dropzone.width,
              height: dropzone.height
            });
            el.append(dropzoneEl);
          }
        });
      });
    } else {
      el.addClass('sm-hidden');
    }
    return el
  }

  
  onDragStarted(dragState) {
    let dropzones = this._computeDropzones(dragState);
    setTimeout(() => {
      this.setState({
        dropzones: dropzones
      });
    }, 250);
  }

  
  onDragFinished() {
    this.setState({});
  }

  onDragEnter(e) {
    
    e.target.parentNode.classList.add('sm-over');
  }

  onDragLeave(e) {
    
    e.target.parentNode.classList.remove('sm-over');
  }

  
  onDrag(e) { 
    
    e.preventDefault();
  }

  onDrop(e) {
    
    
    e.__reserved__ = true;
    e.preventDefault();
    e.stopPropagation();
    let dropzoneIndex = e.target.parentNode.dataset.dropzoneIndex;
    let dropzoneSurface = e.target.parentNode.dataset.dropzoneSurface;
    let dropzone = this.state.dropzones[dropzoneSurface][dropzoneIndex];
    let dropParams = dropzone.dropParams;
    let dropType = dropzone.type;
    
    let targetSurface = this.context.surfaceManager.getSurface(dropzoneSurface);
    
    let component = dropzone.component;
    let dropzoneComponent = dropzone.dropzoneComponent;
    
    let dragManager = this.context.dragManager;
    dragManager.extendDragState({
      targetSurface,
      dropType,
      dropParams,
      component,
      dropzoneComponent
    });
    dragManager._onDragEnd(e);
  }

  
  _getBoundingRect(comp) {
    let scrollPane = comp.context.scrollPane;
    let contentElement = scrollPane.getContentElement().getNativeElement();
    let rect = getRelativeBoundingRect(comp.getNativeElement(), contentElement);
    return rect
  }

  _computeDropzones(dragState) {
    let scrollPaneName = this.context.scrollPane.getName();
    let surfaces = dragState.scrollPanes[scrollPaneName].surfaces;
    let scopedDropzones = {};

    forEach(surfaces, (surface) => {
      let components = surface.childNodes;

      
      let numDropzones = components.length + 1;
      let dropzones = [];

      for (let i = 0; i < numDropzones; i++) {
        if (i === 0) {
          
          let firstComp = this._getBoundingRect(components[0]);
          dropzones.push({
            type: 'place',
            left: firstComp.left,
            top: firstComp.top,
            width: firstComp.width,
            height: firstComp.height / 2,
            teaserPos: 0,
            dropParams: {
              insertPos: i
            }
          });
        } else if (i === numDropzones - 1) {
          
          let lastComp = this._getBoundingRect(components[i - 1]);
          dropzones.push({
            type: 'place',
            left: lastComp.left,
            top: lastComp.top + lastComp.height / 2,
            width: lastComp.width,
            height: lastComp.height / 2,
            teaserPos: lastComp.height / 2,
            dropParams: {
              insertPos: i
            }
          });
        } else {
          
          let upperComp = this._getBoundingRect(components[i-1]);
          let lowerComp = this._getBoundingRect(components[i]);
          let topBound = upperComp.top + upperComp.height / 2;
          let bottomBound = lowerComp.top + lowerComp.height / 2;

          dropzones.push({
            type: 'place',
            left: upperComp.left,
            top: topBound,
            width: upperComp.width,
            height: bottomBound - topBound,
            teaserPos: (upperComp.top + upperComp.height + lowerComp.top) / 2 - topBound,
            dropParams: {
              insertPos: i
            }
          });
        }

        if (i < numDropzones - 1) {
          let comp = components[i];
          
          if (comp._isIsolatedNodeComponent) {
            comp = comp.getContent();
          }
          
          if (comp.getDropzoneSpecs) {
            let dropzoneSpecs = comp.getDropzoneSpecs();
            dropzoneSpecs.forEach((dropzoneSpec) => {
              let dropzoneComp = dropzoneSpec.component;
              let rect = this._getBoundingRect(dropzoneComp);
              dropzones.push({
                type: 'custom',
                component: comp,
                dropzoneComponent: dropzoneComp,
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
                message: dropzoneSpec.message,
                dropParams: dropzoneSpec.dropParams
              });
            });
          }
        }
      }
      scopedDropzones[surface.getName()] = dropzones;
    });
    return scopedDropzones
  }

  _renderDropTeaser(hints) {
    if (hints.visible) {
      this.el.removeClass('sm-hidden');
      this.el.css('top', hints.rect.top);
      this.el.css('left', hints.rect.left);
      this.el.css('right', hints.rect.right);
    } else {
      this.el.addClass('sm-hidden');
    }
  }

}

var DropzonesPackage = {
  name: 'dropzones',
  configure: function(config) {
    config.addComponent('dropzones', Dropzones);
  }
};

var ScrollbarPackage = {
  name: 'scrollbar',
  configure: function(config) {
    config.addComponent('scrollbar', Scrollbar);
  }
};

var ScrollPanePackage = {
  name: 'scroll-pane',
  configure: function(config) {
    config.addComponent('scroll-pane', ScrollPane$$1);
  }
};

class BodyScrollPane extends AbstractScrollPane$$1 {

  
  getChildContext() {
    return {
      scrollPane: this
    }
  }

  getName() {
    return 'body'
  }

  render($$) {
    let el = $$('div');
    if (this.props.contextMenu === 'custom') {
      el.on('contextmenu', this._onContextMenu);
    }
    el.append(this.props.children);
    return el
  }

  
  getHeight() {
    if (platform.inBrowser) {
      return window.innerHeight
    } else {
      return 0
    }
  }

  
  getContentHeight() {
    if (platform.inBrowser) {
      return document.body.scrollHeight
    } else {
      return 0
    }
  }

  getContentElement() {
    if (platform.inBrowser) {
      return DefaultDOMElement.wrapNativeElement(window.document.body)
    } else {
      return null
    }
  }

  
  
  
  getScrollableElement() {
    if (platform.inBrowser) {
      return document.body
    } else {
      return null
    }
  }

  
  getScrollPosition() {
    if (platform.inBrowser) {
      return document.body.scrollTop
    } else {
      return 0
    }
  }

  setScrollPosition(scrollPos) {
    if (platform.inBrowser) {
      document.body.scrollTop = scrollPos;
    }
  }

  
  getPanelOffsetForElement(el) { 
    console.warn('TODO: implement');
  }

  
  scrollTo(componentId, onlyIfNotVisible) { 
    console.warn('TODO: implement');
  }

}

var BodyScrollPanePackage = {
  name: 'body-scroll-pane',
  configure: function(config) {
    config.addComponent('body-scroll-pane', BodyScrollPane);
  },
  BodyScrollPane
};

var SplitPanePackage = {
  name: 'split-pane',
  configure: function(config) {
    config.addComponent('split-pane', SplitPane$$1);
  },
  SplitPane: SplitPane$$1
};

class TabbedPane extends Component {

  render($$) {
    let el = $$('div').addClass('sc-tabbed-pane');
    let tabsEl = $$('div').addClass('se-tabs');
    forEach(this.props.tabs, function(tab) {
      let tabEl = $$('a')
        .addClass("se-tab")
        .attr({
          href: "#",
          "data-id": tab.id,
        })
        .on('click', this.onTabClicked);
      if (tab.id === this.props.activeTab) {
        tabEl.addClass("sm-active");
      }
      tabEl.append(
        $$('span').addClass('label').append(tab.name)
      );
      tabsEl.append(tabEl);
    }.bind(this));

    el.append(tabsEl);
    
    el.append(
      $$('div').addClass('se-tab-content').ref('tabContent').append(
        this.props.children
      )
    );
    return el
  }

  onTabClicked(e) {
    e.preventDefault();
    let tabId = e.currentTarget.dataset.id;
    this.send('switchTab', tabId);
  }
}

var TabbedPanePackage = {
  name: 'tabbed-pane',
  configure: function(config) {
    config.addComponent('tabbed-pane', TabbedPane);
  }
};

var FilePackage = {
  name: 'file',
  configure: function(config) {
    config.addNode(FileNode);
  }
};

class Undo extends Command {

  getCommandState(params) {
    let editorSession = params.editorSession;
    return {
      disabled: !editorSession.canUndo(),
      active: false
    }
  }

  execute(params) {
    let editorSession = params.editorSession;
    if (editorSession.canUndo()) {
      editorSession.undo();
      return true
    }
    return false
  }

}

class Redo extends Command {

  getCommandState(params) {
    let editorSession = params.editorSession;
    return {
      disabled: !editorSession.canRedo(),
      active: false
    }
  }

  execute(params) {
    let editorSession = params.editorSession;
    if (editorSession.canRedo()) {
      editorSession.redo();
      return true
    } else {
      return false
    }
  }

}

class SelectAll extends Command {

  getCommandState(params) {
    let editorSession = params.editorSession;
    let isBlurred = editorSession.isBlurred();
    return {
      disabled: editorSession.getSelection().isNull() || isBlurred
    }
  }

  execute(params) {
    let editorSession = params.editorSession;
    let doc = editorSession.getDocument();
    let surface = params.surface || editorSession.getFocusedSurface();
    if (surface) {
      let sel;
      
      if (surface._isContainerEditor) {
        let container = surface.getContainer();
        let nodeIds = container.getContent();
        if (nodeIds.length === 0) return false
        let firstNodeId = nodeIds[0];
        let lastNodeId = last$1(nodeIds);
        sel = editorSession.createSelection({
          type: 'container',
          startPath: [firstNodeId],
          startOffset: 0,
          endPath: [lastNodeId],
          endOffset: 1,
          containerId: container.id,
          surfaceId: surface.id
        });
      } else if (surface._isTextPropertyEditor) {
        let path = surface.getPath();
        let text = doc.get(path);
        sel = editorSession.createSelection({
          type: 'property',
          path: path,
          startOffset: 0,
          endOffset: text.length,
          surfaceId: surface.id
        });
      }
      editorSession.setSelection(sel);
      return true
    }
    return false
  }
}

class ToolSeparator extends Component {
  render($$) {
    let el = $$('div').addClass('sc-tool-separator');
    return el
  }

  hasEnabledTools() {
    return false
  }
}

var ToolPanelPackage = {
  name: 'tool-panel',
  configure(config) {
    config.addComponent('tool-panel', ToolPanel);
    config.addComponent('tool-dropdown', ToolDropdown);
    config.addComponent('tool-group', ToolGroup$$1);
    config.addComponent('tool-prompt', ToolPrompt$$1);
    config.addComponent('tool-separator', ToolSeparator);
  }
};

var BasePackage = {
  name: 'base',
  configure: function(config) {
    config.import(FilePackage);
    config.import(ScrollPanePackage);
    config.import(BodyScrollPanePackage);
    config.import(SplitPanePackage);
    config.import(TabbedPanePackage);
    config.import(ScrollbarPackage);
    config.import(GridPackage);
    config.import(ModalPackage);
    config.import(InputPackage);
    config.import(ButtonPackage);
    config.import(LayoutPackage);
    config.import(ContextMenuPackage);
    config.import(OverlayPackage);
    config.import(DropzonesPackage);
    config.import(GutterPackage);
    config.import(ToolPanelPackage);

    
    config.addCommand('undo', Undo, { commandGroup: 'undo-redo' });
    config.addCommand('redo', Redo, { commandGroup: 'undo-redo' });
    config.addCommand('select-all', SelectAll, { commandGroup: 'selection' });

    
    config.addIcon('insert', { 'fontawesome': 'fa-plus' });
    config.addIcon('undo', { 'fontawesome': 'fa-undo' });
    config.addIcon('redo', { 'fontawesome': 'fa-repeat' });
    config.addIcon('edit', { 'fontawesome': 'fa-cog' });
    config.addIcon('delete', { 'fontawesome': 'fa-times' });
    config.addIcon('expand', { 'fontawesome': 'fa-arrows-h' });
    config.addIcon('truncate', { 'fontawesome': 'fa-arrows-h' });

    
    config.addLabel('undo', {
      en: 'Undo',
      de: 'Rückgängig'
    });
    config.addLabel('redo', {
      en: 'Redo',
      de: 'Wiederherstellen'
    });
    config.addLabel('select-all', {
      en: 'Select All',
      de: 'Alles Auswählen'
    });
    config.addLabel('text-types', {
      en: 'Text Type',
      de: 'Texttyp'
    });
    config.addLabel('container-selection', {
      en: 'Container',
      de: 'Container'
    });
    config.addLabel('container', {
      en: 'Container',
      de: 'Container'
    });
    config.addLabel('insert', {
      en: 'Insert',
      de: 'Einfügen'
    });
    config.addLabel('insert-container', {
      en: 'Insert Container',
      de: 'Container einfügen'
    });

    config.addKeyboardShortcut('CommandOrControl+Z', { command: 'undo' });
    config.addKeyboardShortcut('CommandOrControl+Shift+Z', { command: 'redo' });
    config.addKeyboardShortcut('CommandOrControl+A', { command: 'select-all' });
  },
  UndoCommand: Undo,
  RedoCommand: Redo,
  SelectAllCommand: SelectAll
};

class Blockquote extends TextBlock {}

Blockquote.type = "blockquote";

class BlockquoteComponent extends TextBlockComponent {
  render($$) {
    let el = super.render.call(this, $$);
    return el.addClass('sc-blockquote')
  }
}

var BlockquoteHTMLConverter = {

  type: 'blockquote',
  tagName: 'blockquote',

  import: function(el, node, converter) {
    node.content = converter.annotatedText(el, [node.id, 'content']);
  },

  export: function(node, el, converter) {
    el.append(
      converter.annotatedText([node.id, 'content'])
    );
  }

};

var BlockquotePackage = {
  name: 'blockquote',
  configure: function(config) {
    config.addNode(Blockquote);
    config.addComponent(Blockquote.type, BlockquoteComponent);
    config.addConverter('html', BlockquoteHTMLConverter);
    config.addConverter('xml', BlockquoteHTMLConverter);
    config.addCommand('blockquote', SwitchTextTypeCommand$$1, {
      spec: { type: 'blockquote' },
      commandGroup: 'text-types'
    });
    config.addIcon('blockquote', { 'fontawesome': 'fa-quote-right' });
    config.addLabel('blockquote', {
      en: 'Blockquote',
      de: 'Blockzitat'
    });
    config.addKeyboardShortcut('CommandOrControl+Alt+B', { command: 'blockquote' });
  },
  Blockquote: Blockquote,
  BlockquoteComponent: BlockquoteComponent,
  BlockquoteHTMLConverter: BlockquoteHTMLConverter
};

class Code extends PropertyAnnotation {}

Code.type = 'code';

var CodeHTMLConverter = {
  type: 'code',
  tagName: 'code'
};

var CodePackage = {
  name: 'code',
  configure: function(config) {
    config.addNode(Code);
    config.addConverter('html', CodeHTMLConverter);
    config.addConverter('xml', CodeHTMLConverter);
    config.addComponent('code', AnnotationComponent);
    config.addCommand('code', AnnotationCommand, {
      nodeType: Code.type,
      commandGroup: 'annotations'
    });
    config.addIcon('code', { 'fontawesome': 'fa-code' });
    config.addLabel('code', {
      en: 'Code',
      de: 'Code'
    });
  },
  Code: Code,
  CodeHTMLConverter: CodeHTMLConverter
};

class Codeblock extends TextBlock {}

Codeblock.type = "codeblock";

class CodeblockComponent extends TextBlockComponent {
  render($$) {
    let el = super.render.call(this, $$);
    return el.addClass('sc-codeblock')
  }
}

var CodeblockHTMLConverter = {

  type: 'codeblock',
  tagName: 'pre',

  import: function(el, node, converter) {
    let codeEl = el.find('code');
    if (codeEl) {
      node.content = converter.annotatedText(codeEl, [node.id, 'content'], { preserveWhitespace: true });
    }
  },

  export: function(node, el, converter) {
    let $$ = converter.$$;
    el.append(
      $$('code').append(
        converter.annotatedText([node.id, 'content'])
      )
    );
  }
};

var CodeblockPackage = {
  name: 'codeblock',
  configure: function(config) {
    config.addNode(Codeblock);
    config.addComponent('codeblock', CodeblockComponent);
    config.addConverter('html', CodeblockHTMLConverter);
    config.addConverter('xml', CodeblockHTMLConverter);
    config.addCommand('codeblock', SwitchTextTypeCommand$$1, {
      spec: { type: 'codeblock' },
      commandGroup: 'text-types'
    });
    config.addIcon('codeblock', { 'fontawesome': 'fa-quote-right' });
    config.addLabel('codeblock', {
      en: 'Codeblock',
      de: 'Codeblock'
    });
    config.addKeyboardShortcut('CommandOrControl+Alt+C', { command: 'codeblock' });
  },
  Codeblock: Codeblock,
  CodeblockComponent: CodeblockComponent,
  CodeblockHTMLConverter: CodeblockHTMLConverter
};

class Emphasis extends PropertyAnnotation {}

Emphasis.type = "emphasis";


Emphasis.fragmentation = Fragmenter.ANY;

var EmphasisHTMLConverter = {

  type: 'emphasis',
  tagName: 'em',

  matchElement: function(el) {
    return el.is('em, i')
  }

};

class EmphasisComponent extends AnnotationComponent {
  getTagName() {
    return 'em'
  }
}

var EmphasisPackage = {
  name: 'emphasis',
  configure: function(config) {
    config.addNode(Emphasis);
    config.addConverter('html', EmphasisHTMLConverter);
    config.addConverter('xml', EmphasisHTMLConverter);
    config.addComponent('emphasis', EmphasisComponent);
    config.addCommand('emphasis', AnnotationCommand, {
      nodeType: Emphasis.type,
      commandGroup: 'annotations'
    });
    config.addIcon('emphasis', { 'fontawesome': 'fa-italic' });
    config.addLabel('emphasis', {
      en: 'Emphasis',
      de: 'Betonung'
    });
    config.addKeyboardShortcut('CommandOrControl+I', { command: 'emphasis' });
  },
  Emphasis,
  EmphasisComponent,
  EmphasisHTMLConverter
};

class FindAndReplaceCommand extends Command {

  getCommandState({editorSession}) {
    let findAndReplaceManager = editorSession.getManager('find-and-replace');
    let findAndReplaceState = findAndReplaceManager.getCommandState();
    return findAndReplaceState
  }

  execute() {
    
  }
}

class ToggleFindAndReplaceCommand extends Command {

  getCommandState() {
    return {
      disabled: false
    }
  }

  execute({editorSession}) {
    let findAndReplaceManager = editorSession.getManager('find-and-replace');
    let surface = editorSession.getFocusedSurface();
    if (surface) {
      findAndReplaceManager.enable();
    }
  }
}

class ToggleFindAndReplaceCommand$2 extends Command {

  getCommandState({editorSession}) {
    let findAndReplaceManager = editorSession.getManager('find-and-replace');
    let state = findAndReplaceManager.getCommandState();
    return {
      disabled: state.disabled
    }
  }

  execute({editorSession}) {
    let findAndReplaceManager = editorSession.getManager('find-and-replace');
    let findAndReplaceState = findAndReplaceManager.getCommandState();
    if (!findAndReplaceState.disabled) {
      findAndReplaceManager.disable();
    }
  }
}

class FindNextCommand extends Command {

  getCommandState() {
    return {
      disabled: false
    }
  }

  execute({editorSession}) {
    let findAndReplaceManager = editorSession.getManager('find-and-replace');
    findAndReplaceManager.findNext();
  }
}

class FindPreviousCommand extends Command {

  getCommandState({editorSession}) {
    let findAndReplaceManager = editorSession.getManager('find-and-replace');
    let findAndReplaceState = findAndReplaceManager.getCommandState();
    return findAndReplaceState
  }

  execute({editorSession}) {
    let findAndReplaceManager = editorSession.getManager('find-and-replace');
    findAndReplaceManager.findPrevious();
  }
}

class ReplaceNextCommand extends Command {

  getCommandState({editorSession}) {
    let findAndReplaceManager = editorSession.getManager('find-and-replace');
    let findAndReplaceState = findAndReplaceManager.getCommandState();
    return findAndReplaceState
  }

  execute({editorSession}) {
    let findAndReplaceManager = editorSession.getManager('find-and-replace');
    findAndReplaceManager.replaceNext();
  }
}

class ReplaceAllCommand extends Command {

  getCommandState({editorSession}) {
    let findAndReplaceManager = editorSession.getManager('find-and-replace');
    let findAndReplaceState = findAndReplaceManager.getCommandState();
    return findAndReplaceState
  }

  execute({editorSession}) {
    let findAndReplaceManager = editorSession.getManager('find-and-replace');
    findAndReplaceManager.replaceAll();
  }
}

class FindAndReplaceTool extends ToggleTool {

  didMount() {
    this.context.editorSession.onPosition(this._onPosition, this);
  }

  dispose() {
    this.context.editorSession.off(this);
  }

  _onPosition() {
    let findAndReplaceManager = this.context.editorSession.getManager('find-and-replace');
    
    
    
    if (findAndReplaceManager._requestLookupMatch) {
      this._scrollToSelectedMatch();
      findAndReplaceManager._requestLookupMatch = false;
    }

    if (findAndReplaceManager._requestFocusSearchString) {
      setTimeout(() => {
        this.refs.findString.el.focus();
        this.refs.findString.el.select();
        findAndReplaceManager._requestFocusSearchString = false;
      },0);
    }
  }

  render($$) {
    let commandState = this.props.commandState;
    let el = $$('div').addClass('sc-find-and-replace-tool');

    el.append(
      this._renderStatusDescription($$),
      
      
      
      
      
      
      
      
      
      
      
      $$('div').addClass('se-section').append(
        $$('div')
          .addClass('se-section-item se-find-input')
          .addClass('sm-flex')
          .append(
            $$('input')
              .ref('findString')
              .attr('type', 'text')
              .attr('placeholder', 'Find in body')
              .attr('tabindex', 500)
              .val(commandState.findString)
              .on('input', debounce(this._startFind, 300))
              .on('keypress', this._triggerFindNext)
              .on('focus', this._onFocus)
              .on('blur', this._onBlur),
            this._renderStatusCounter($$)
          ),
        $$('div')
          .addClass('se-section-item se-replace-input')
          .append(
            $$('button')
              .append('Find')
              .attr('tabindex', 502)
              .on('click', this._findNext)
          ),
        $$('div')
          .addClass('se-section-item')
          
          
          
      ),
      $$('div').addClass('se-section').append(
        $$('div')
          .addClass('se-section-item')
          .addClass('sm-flex')
          .append(
            $$('input')
              .ref('replaceString')
              .val(commandState.replaceString)
              .attr('type', 'text')
              .attr('tabindex', 501)
              .attr('placeholder', 'Replace in body')
              .on('focus', this._onFocus)
              .on('blur', this._onBlur)
              .on('input', this._setReplaceString)
              .on('keypress', this._triggerReplace)
          ),
        $$('div')
          .addClass('se-section-item')
          .append(
            $$('button')
              .append('Replace')
              .attr('tabindex', 503)
              .on('click', this._replaceNext)
          ),
        $$('div')
          .addClass('se-section-item')
          .append(
            $$('button')
              .append('Replace All')
              .attr('tabindex', 504)
              .on('click', this._replaceAll)
          )
      )
    );
    return el
  }

  _renderStatusDescription($$) {
    let commandState = this.props.commandState;
    let statusDescriptionEl = $$('div').addClass('se-status').append(
      $$('div').addClass('se-status-title').append(
        this.getLabel('find-and-replace-title')
      )
    );

    if (commandState.totalMatches > 0) {
      statusDescriptionEl.append(
        $$('div').addClass('se-status-description').append(
          commandState.totalMatches,
          ' results found for ',
          '"'+ commandState.findString +'"'
        )
      );
    } else if (commandState.findString !== '') {
      statusDescriptionEl.append(
        $$('div').addClass('se-status-description').append(
          'No results found for ',
          '"'+ commandState.findString +'"'
        )
      );
    } else {
      statusDescriptionEl.append(
        $$('div').addClass('se-status-description').append(
          'Close this panel with ESC key'
        )
      );
    }
    return statusDescriptionEl
  }

  
  _onFocus() {
    let editorSession = this.context.editorSession;
    editorSession.setBlurred(true);
    
    editorSession.startFlow();
  }

  
  _onBlur() {
    let editorSession = this.context.editorSession;
    editorSession.setBlurred(false);
  }

  _renderStatusCounter($$) {
    let commandState = this.props.commandState;
    let statusCounterEl;

    if (commandState.totalMatches > 0) {
      statusCounterEl = $$('span').addClass('se-status-counter').append(
        [commandState.selectedMatch, commandState.totalMatches].join(' of ')
      );
    }

    return statusCounterEl
  }

  _findNext() {
    let findAndReplaceManager = this.context.editorSession.getManager('find-and-replace');
    findAndReplaceManager.findNext();
  }

  _replaceNext() {
    let findAndReplaceManager = this.context.editorSession.getManager('find-and-replace');
    findAndReplaceManager.replaceNext();
  }

  _replaceAll() {
    let findAndReplaceManager = this.context.editorSession.getManager('find-and-replace');
    findAndReplaceManager.replaceAll();
  }


  

  findStringHasChanged() {
    let findString = this.refs.findString.val();
    let previousFindString = this._previousFindString;
    this._previousFindString = findString;
    return findString !== previousFindString
  }

  
  _startFind() {
    let editorSession = this.context.editorSession;
    let findString = this.refs.findString.val();
    let findAndReplaceManager = editorSession.getManager('find-and-replace');
    findAndReplaceManager.startFind(findString);
  }

  _scrollToSelectedMatch() {
    let editorSession = this.context.editorSession;
    let surface = editorSession.getFocusedSurface();
    surface.context.scrollPane.scrollTo('.sc-selected-match', 'onlyIfNotVisible');
  }

  _triggerFindNext(e) {
    if (e.keyCode === 13) {
      this._findNext();
    }
  }

  _triggerReplace(e) {
    if (e.keyCode === 13) {
      this._replaceNext();
    }
  }

  
  _setReplaceString() {
    let replaceString = this.refs.replaceString.val();
    let findAndReplaceManager = this.context.editorSession.getManager('find-and-replace');
    findAndReplaceManager.setReplaceString(replaceString);
  }

}

class FindAndReplaceManager {

  constructor(context) {
    if (!context.editorSession) {
      throw new Error('EditorSession required.')
    }

    this.editorSession = context.editorSession;
    this.editorSession.onRender('document', this._onDocumentChanged, this);

    this.doc = this.editorSession.getDocument();
    this.context = Object.assign({}, context, {
      
      doc: this.doc
    });

    this._state = {
      disabled: true,
      findString: '',
      replaceString: '',
      
      matches: [],
      selectedMatch: undefined
    };

    
    this._requestLookupMatch = false;
    
    this._requestFocusSearchString = false;
  }

  dispose() {
    this.editorSession.off(this);
  }

  
  _resetState() {
    this._state.disabled = true;
    this._state.matches = [];
    this._state.selectedMatch = undefined;
  }

  
  getCommandState() {
    let state = this._state;
    let commandState = {
      disabled: state.disabled,
      findString: state.findString,
      replaceString: state.replaceString,
      
      totalMatches: state.matches.length,
      selectedMatch: state.selectedMatch + 1
    };
    return commandState
  }

  enable() {
    this._state.disabled = false;
    this._requestFocusSearchString = true;
    
    this.startFind(this._state.findString);
  }

  disable() {
    this._state.disabled = true;
    this._resetState();
    this._propagateUpdate();
  }

  _onDocumentChanged() {
    if (!this._state.disabled) {
      this._computeMatches();
      this._state.selectedMatch = 0;
      this._updateMarkers();
    }
  }

  
  startFind(findString) {
    this._state.findString = findString;
    this._computeMatches();
    let closestMatch = this._getClosestMatch();
    this._state.selectedMatch = closestMatch > 0 ? closestMatch : 0;
    this._requestLookupMatch = true;
    this._setSelection();
    this._propagateUpdate();

  }

  setReplaceString(replaceString) {
    
    this._state.replaceString = replaceString;
  }

  
  findNext() {
    let index = this._state.selectedMatch;
    let totalMatches = this._state.matches.length;
    if (totalMatches === 0) return
    this._state.selectedMatch = (index + 1) % totalMatches;
    this._requestLookupMatch = true;
    this._setSelection();
    this._propagateUpdate();
  }

  
  findPrevious() {
    let index = this._state.selectedMatch;
    let totalMatches = this._state.matches.length;
    if (totalMatches === 0) return
    this._state.selectedMatch = index > 0 ? index - 1 : totalMatches - 1;
    this._requestLookupMatch = true;
    this._setSelection();
    this._propagateUpdate();
  }

  _setSelection() {
    let match = this._state.matches[this._state.selectedMatch];
    if (!match) return
    
    
    let sel = match.getSelection();
    this.editorSession.setSelection(sel, 'skipFlow');
  }

  
  replaceNext() {
    let index = this._state.selectedMatch;
    let match = this._state.matches[index];
    let totalMatches = this._state.matches.length;
    if(match !== undefined) {
      this.editorSession.transaction((tx, args) => {
        tx.setSelection(match.getSelection());
        tx.insertText(this._state.replaceString);
        return args
      });
      this._computeMatches();
      if(index + 1 < totalMatches) {
        this._state.selectedMatch = index;
      }
      this._requestLookupMatch = true;
      this._setSelection();
      this._propagateUpdate();
    }
  }

  
  replaceAll() {
    
    
    let matches = this._state.matches.reverse();

    this.editorSession.transaction((tx, args) => {
      matches.forEach(match => {
        tx.setSelection(match.getSelection());
        tx.insertText(this._state.replaceString);
      });
      return args
    });

    this._computeMatches();
  }

  
  _getClosestMatch() {
    let doc = this.editorSession.getDocument();
    let nodeIds = Object.keys(doc.getNodes());
    let sel = this.editorSession.getSelection();
    let closest = 0;

    if(!sel.isNull()) {
      let startOffset = sel.start.offset;
      let selStartNode = sel.start.path[0];
      let selStartNodePos = nodeIds.indexOf(selStartNode);
      let matches = this._state.matches;

      closest = matches.findIndex(match => {
        let markerSel = match.getSelection();
        let markerStartOffset = markerSel.start.offset;
        let markerStartNode = markerSel.start.path[0];
        let markerStartNodePos = nodeIds.indexOf(markerStartNode);
        if(selStartNodePos > markerStartNodePos) {
          return false
        } else if (selStartNodePos < markerStartNodePos) {
          return true
        } else {
          if(startOffset <= markerStartOffset) {
            return true
          } else {
            return false
          }
        }
      });
    }

    return closest
  }

  _computeMatches() {
    let currentMatches = this._state.matches;
    let currentTotal = currentMatches === undefined ? 0 : currentMatches.length;

    this._state.matches = this._findAllMatches();

    
    
    
    let newMatches = this._state.matches;

    if(newMatches.length !== currentTotal) {
      this._state.selectedMatch = newMatches.length > 0 ? 0 : undefined;
    }
  }


  
  _findAllMatches() {
    let textProperties = this._getAllAffectedTextPropertiesInOrder();
    const pattern = this._state.findString;
    let matches = [];
    if (pattern) {
      textProperties.forEach((textPropertyPath) => {
        let found = this._findInTextProperty({
          path: textPropertyPath,
          findString: pattern
        });
        matches = matches.concat(found);
      });
    }
    return matches
  }

  
  _getAllAffectedTextPropertiesInOrder() {
    let textProperties = [];
    const editor = this.editorSession.getEditor();
    
    const rootElement = editor.find(this.getRootElementSelector()) || editor;
    textProperties = rootElement.findAll('.sc-text-property').map((tpc) => {
      return tpc.props.path
    });
    return textProperties
  }

  
  _findInTextProperty({path, findString}) {
    const doc = this.doc;
    const text = doc.get(path);

    
    let matcher = new RegExp(findString, 'ig');
    let matches = [];
    let match;

    while ((match = matcher.exec(text))) {
      let marker = new Marker(doc, {
        type: 'match',
        start: {
          path,
          offset: match.index
        },
        end: {
          offset: matcher.lastIndex
        }
      });
      matches.push(marker);
    }
    return matches
  }

  _propagateUpdate() {
    
    this._updateMarkers();
    this.editorSession._setDirty('commandStates');
    this.editorSession.startFlow();
  }

  _updateMarkers() {
    const state = this._state;
    const editorSession = this.editorSession;
    const markersManager = editorSession.markersManager;
    state.matches.forEach((m, idx) => {
      m.type = (idx === state.selectedMatch) ? 'selected-match' : 'match';
    });
    
    markersManager.setMarkers('find-and-replace', state.matches);
  }

  
  getRootElementSelector() {
    let configurator = this.editorSession.getConfigurator();
    let config = configurator.getFindAndReplaceConfig();
    return config.rootElement
  }

}

var FindAndReplacePackage = {
  name: 'find-and-replace',
  configure: function(config, userConfig) {
    config.addCommand('find-and-replace', FindAndReplaceCommand, {
      commandGroup: 'workflows'
    });
    config.addCommand('toggle-find-and-replace', ToggleFindAndReplaceCommand, {
      commandGroup: 'find-and-replace'
    });
    config.addCommand('close-find-and-replace', ToggleFindAndReplaceCommand$2, {
      commandGroup: 'find-and-replace'
    });
    config.addCommand('find-next', FindNextCommand, {
      commandGroup: 'find-and-replace'
    });
    config.addCommand('find-previous', FindPreviousCommand, {
      commandGroup: 'find-and-replace'
    });
    config.addCommand('replace-next', ReplaceNextCommand, {
      commandGroup: 'find-and-replace'
    });
    config.addCommand('replace-all', ReplaceAllCommand, {
      commandGroup: 'find-and-replace'
    });
    config.addTool('find-and-replace', FindAndReplaceTool);
    config.addKeyboardShortcut('CommandOrControl+F', { command: 'toggle-find-and-replace' });
    config.addKeyboardShortcut('CommandOrControl+Alt+F', { command: 'toggle-find-and-replace' });
    config.addKeyboardShortcut('CommandOrControl+G', { command: 'find-next' });
    config.addKeyboardShortcut('CommandOrControl+Shift+G', { command: 'find-previous' });
    config.addKeyboardShortcut('CommandOrControl+Alt+E', { command: 'replace-next' });
    
    config.addKeyboardShortcut('esc', { command: 'close-find-and-replace' });
    config.addManager('find-and-replace', FindAndReplaceManager);
    config.addLabel('find-and-replace-title', {
      en: 'Find and replace',
      de: 'Suchen und Ersetzen'
    });
    config.setFindAndReplaceConfig(userConfig);
  },
  FindAndReplaceCommand,
  ToggleFindAndReplaceCommand,
  FindNextCommand,
  FindPreviousCommand,
  ReplaceNextCommand,
  ReplaceAllCommand,
  FindAndReplaceTool,
  FindAndReplaceManager
};

class Heading extends TextBlock {}

Heading.schema = {
  type: "heading",
  level: { type: "number", default: 1 }
};

class HeadingComponent extends TextBlockComponent {
  render($$) {
    let el = super.render($$);
    return el.addClass("sc-heading sm-level-"+this.props.node.level)
  }

  getTagName() {
    return 'h'+this.props.node.level
  }
}

var HeadingMacro = {

  appliesTo: ['paragraph'],

  execute: function(props) {
    if (this.appliesTo.indexOf(props.node.type) === -1) {
      return false
    }
    if (props.action !== 'type') {
      return false
    }
    let match = /^#\s/.exec(props.text);
    if (match) {
      
      let editorSession = props.editorSession;
      let sel = editorSession.getSelection();
      let path = sel.start.path;
      let startOffset = sel.start.offset;
      editorSession.transaction(function(tx) {
        tx.setSelection({
          type: 'property',
          path: path,
          startOffset: 0,
          endOffset: match[0].length
        });
        tx.deleteSelection();
        let node = tx.switchTextType({
          type: 'heading',
          level: 1
        });
        tx.setSelection({
          type: 'property',
          path: node.getTextPath(),
          startOffset: startOffset - match[0].length
        });
      });
      return true
    }
  }
};

var HeadingHTMLConverter = {

  type: "heading",

  matchElement: function(el) {
    return /^h\d$/.exec(el.tagName)
  },

  import: function(el, node, converter) {
    node.level = Number(el.tagName[1]);
    let textAlign = el.attr('data-text-align');
    node.textAlign = textAlign || 'left';
    node.content = converter.annotatedText(el, [node.id, 'content']);
  },

  export: function(node, el, converter) {
    el.tagName = 'h'+node.level;
    
    if (node.textAlign !== 'left') {
      el.attr('data-text-align', node.textAlign);
    }
    el.append(
      converter.annotatedText([node.id, 'content'])
    );
  }

};

var HeadingPackage = {
  name: 'heading',
  configure: function(config) {
    config.addNode(Heading);
    config.addComponent(Heading.type, HeadingComponent);
    config.addConverter('html', HeadingHTMLConverter);
    config.addConverter('xml', HeadingHTMLConverter);

    config.addCommand('heading1', SwitchTextTypeCommand$$1, {
      spec: { type: 'heading', level: 1 },
      commandGroup: 'text-types'
    });
    config.addCommand('heading2', SwitchTextTypeCommand$$1, {
      spec: { type: 'heading', level: 2 },
      commandGroup: 'text-types'
    });
    config.addCommand('heading3', SwitchTextTypeCommand$$1, {
      spec: { type: 'heading', level: 3 },
      commandGroup: 'text-types'
    });
    config.addKeyboardShortcut('CommandOrControl+Alt+1', { command: 'heading1' });
    config.addKeyboardShortcut('CommandOrControl+Alt+2', { command: 'heading2' });
    config.addKeyboardShortcut('CommandOrControl+Alt+3', { command: 'heading3' });

    config.addLabel('heading1', {
      en: 'Heading 1',
      de: 'Überschrift 1'
    });
    config.addLabel('heading2', {
      en: 'Heading 2',
      de: 'Überschrift 2'
    });
    config.addLabel('heading3', {
      en: 'Heading 3',
      de: 'Überschrift 3'
    });
    config.addIcon('heading1', { 'fontawesome': 'fa-header' });
    config.addIcon('heading2', { 'fontawesome': 'fa-header' });
    config.addIcon('heading3', { 'fontawesome': 'fa-header' });
  },
  Heading,
  HeadingComponent,
  HeadingHTMLConverter,
  HeadingMacro
};

class ImageNode extends DocumentNode {

  getImageFile() {
    if (this.imageFile) {
      return this.document.get(this.imageFile)
    }
  }

  getUrl() {
    let imageFile = this.getImageFile();
    if (imageFile) {
      return imageFile.getUrl()
    }
  }
}

ImageNode.schema = {
  type: 'image',
  imageFile: { type: 'file' }
};

class ImageComponent extends NodeComponent {

  didMount() {
    super.didMount.call(this);
    this.context.editorSession.onRender('document', this._onDocumentChange, this);
  }

  dispose() {
    super.dispose.call(this);
    this.context.editorSession.off(this);
  }

  
  _onDocumentChange(change) {
    if (change.hasUpdated(this.props.node.id) ||
      change.hasUpdated(this.props.node.imageFile)) {
      this.rerender();
    }
  }

  render($$) {
    let el = super.render($$);
    el.addClass('sc-image');
    el.append(
      $$('img').attr({
        src: this.props.node.getUrl(),
      }).ref('image')
    );
    return el
  }

  
  getDropzoneSpecs() {
    return [
      {
        component: this.refs['image'],
        message: 'Replace Image',
        dropParams: {
          action: 'replace-image',
          nodeId: this.props.node.id,
        }
      }
    ]
  }

  handleDrop(tx, dragState) {
    let newImageFile = dragState.data.files[0];
    if (dragState.external) {
      let imageFile = tx.create({
        type: 'file',
        fileType: 'image',
        mimeType: newImageFile.type,
        url: URL.createObjectURL(newImageFile)
      });
      
      
      tx.set([this.props.node.id, 'imageFile'], imageFile.id);
    } else {
      let nodeId = dragState.sourceSelection.nodeId;
      let node = tx.get(nodeId);
      if (node.type === 'image') {
        
        tx.set([this.props.node.id, 'imageFile'], node.imageFile);
      }
    }


  }

}

var ImageHTMLConverter = {

  type: 'image',
  tagName: 'img',

  import: function(el, node, converter) {
    let imageFile = converter.getDocument().create({
      id: 'file-'+node.id,
      type: 'file',
      fileType: 'image',
      url: el.attr('src')
    });
    node.imageFile = imageFile.id;
  },

  export: function(node, el) {
    let imageFile = node.document.get(node.imageFile);
    el.attr('src', imageFile.getUrl());
  }
};

var insertImage = function(tx, file) {
  
  let imageFile = tx.create({
    type: 'file',
    fileType: 'image',
    mimeType: file.type,
    sourceFile: file
  });
  
  tx.insertBlockNode({
    type: 'image',
    imageFile: imageFile.id
  });
};

class InsertImageCommand extends InsertNodeCommand {

  
  execute(params) {
    let editorSession = params.editorSession;

    editorSession.transaction((tx) => {
      params.files.forEach((file) => {
        insertImage(tx, file);
      });
    });
  }

}

class InsertImageTool extends ToggleTool {

  getClassNames() {
    return 'sc-insert-image-tool'
  }

  renderButton($$) {
    let button = super.renderButton($$);
    let input = $$('input').attr('type', 'file').ref('input')
      .on('change', this.onFileSelect);
    return [button, input]
  }

  onClick() {
    this.refs.input.click();
  }

  onFileSelect(e) {
    let files = e.currentTarget.files;
    this.executeCommand({
      files: Array.prototype.slice.call(files)
    });
  }

}

var DropImage = {
  type: 'drop-asset',
  match(params) {
    
    let isImage = params.file.type.indexOf('image/') === 0;
    return params.type === 'file' && isImage
  },
  drop(tx, params) {
    insertImage(tx, params.file);
  }
};

class ImageProxy extends DefaultFileProxy {}


ImageProxy.match = function(fileNode) {
  return fileNode.fileType === 'image'
};

var ImagePackage = {
  name: 'image',
  configure: function(config) {
    config.addNode(ImageNode);
    config.addComponent('image', ImageComponent);
    config.addConverter('html', ImageHTMLConverter);
    config.addConverter('xml', ImageHTMLConverter);
    config.addCommand('insert-image', InsertImageCommand, {
      nodeType: 'image',
      commandGroup: 'insert'
    });
    config.addTool('insert-image', InsertImageTool);
    config.addIcon('insert-image', { 'fontawesome': 'fa-image' });
    config.addLabel('image', {
      en: 'Image',
      de: 'Bild'
    });
    config.addLabel('insert-image', {
      en: 'Insert image',
      de: 'Bild einfügen'
    });
    config.addDropHandler(DropImage);
    config.addFileProxy(ImageProxy);
  },
  ImageNode: ImageNode,
  ImageComponent: ImageComponent,
  ImageHTMLConverter: ImageHTMLConverter,
  InsertImageCommand: InsertImageCommand,
  InsertImageTool: InsertImageTool,
  DropImage: DropImage
};

class InlineWrapper extends InlineNode {
  getWrappedNode() {
    return this.getDocument().get(this.wrappedNode)
  }
}

InlineWrapper.schema = {
  type: 'inline-wrapper',
  wrappedNode: 'id'
};

class InlineWrapperComponent extends InlineNodeComponent {

  getClassNames() {
    
    return 'sc-inline-wrapper sc-inline-node'
  }

  renderContent($$) {
    let node = this.props.node;
    let doc = node.getDocument();

    let wrappedNode = doc.get(node.wrappedNode);
    let el = $$('span').addClass('sc-inline-wrapper');
    if (wrappedNode) {
      let componentRegistry = this.context.componentRegistry;
      let ComponentClass = componentRegistry.get(wrappedNode.type);
      if (ComponentClass) {
        el.append($$(ComponentClass, {
          disabled: this.props.disabled,
          node: wrappedNode,
        }).ref('wrappedNode'));
      } else {
        console.error('No component registered for node type' + wrappedNode.type);
      }
    } else {
      console.error('Could not find wrapped node: ' + node.wrappedNode);
    }
    return el
  }
}

var InlineWrapperConverter = {
  type: 'inline-wrapper',

  matchElement: function(el, converter) {
    var blockConverter = converter._getConverterForElement(el, 'block');
    return Boolean(blockConverter)
  },

  import: function(el, node, converter) {
    
    node.id = converter.nextId('inline-wrapper');
    var state = converter.state;
    state.popElementContext();
    state.pushElementContext(state.getCurrentElementContext().tagName);
    node.wrappedNode = converter.convertElement(el).id;
  },

  export: function(node, el, converter) {
    return converter.convertNode(node.wrappedNode)
  }
};

var InlineWrapperPackage = {
  name: 'inline-wrapper',
  configure: function(config, options) {
    config.addNode(InlineWrapper);
    config.addComponent(InlineWrapper.type, InlineWrapperComponent);
    if (options.converters) {
      options.converters.forEach(function(name) {
        config.addConverter(name, InlineWrapperConverter);
      });
    }
  },
  InlineWrapper: InlineWrapper,
  InlineWrapperComponent: InlineWrapperComponent,
  InlineWrapperConverter: InlineWrapperConverter
};

class Link extends PropertyAnnotation {}

Link.schema = {
  type: "link",
  title: { type: 'string', optional: true },
  url: { type: 'string', 'default': ''}
};


Link.fragmentation = Fragmenter.SHOULD_NOT_SPLIT;

Link.autoExpandRight = false;

class LinkComponent extends AnnotationComponent {

  didMount(...args) {
    super.didMount(...args);

    let node = this.props.node;
    this.context.editorSession.onRender('document', this.rerender, this, {
      path: [node.id, 'url']
    });
  }

  dispose(...args) {
    super.dispose(...args);

    this.context.editorSession.off(this);
  }

  render($$) { 
    let el = super.render($$);

    el.tagName = 'a';
    el.attr('href', this.props.node.url);

    let titleComps = [this.props.node.url];
    if (this.props.node.title) {
      titleComps.push(this.props.node.title);
    }

    return el.attr("title", titleComps.join(' | '))
  }

}

class LinkCommand extends AnnotationCommand {
  canFuse() { return false }

  
  executeCreate(params) {
    let result = super.executeCreate(params);
    let editorSession = this._getEditorSession(params);
    editorSession.transaction((tx) => {
      tx.setSelection(tx.selection.collapse());
    });
    return result
  }
}

var LinkHTMLConverter = {

  type: "link",
  tagName: 'a',

  import: function(el, node) {
    node.url = el.attr('href');
    node.title = el.attr('title');
  },

  export: function(link, el) {
    el.attr({
      href: link.url,
      title: link.title
    });
  }

};

class EditLinkTool extends ToggleTool {

  getUrlPath() {
    let propPath = this.constructor.urlPropertyPath;
    return [this.getNodeId()].concat(propPath)
  }

  getNodeId() {
    return this.props.commandState.nodeId
  }

  _openLink() {
    let doc = this.context.editorSession.getDocument();
    window.open(doc.get(this.getUrlPath()), '_blank');
  }

  render($$) {
    let Input = this.getComponent('input');
    let Button$$1 = this.getComponent('button');
    let commandState = this.props.commandState;
    let el = $$('div').addClass('sc-edit-link-tool');

    
    if (commandState.disabled) {
      console.warn('Tried to render EditLinkTool while disabled.');
      return el
    }

    let urlPath = this.getUrlPath();

    el.append(
      $$(Input, {
        type: 'url',
        path: urlPath,
        placeholder: 'Paste or type a link url'
      }),
      $$(Button$$1, {
        icon: 'open-link',
        theme: 'dark',
      }).attr('title', this.getLabel('open-link'))
        .on('click', this._openLink),

      $$(Button$$1, {
        icon: 'delete',
        theme: 'dark',
      }).attr('title', this.getLabel('delete-link'))
        .on('click', this.onDelete)
    );
    return el
  }

  onDelete(e) {
    e.preventDefault();
    let nodeId = this.getNodeId();
    let sm = this.context.surfaceManager;
    let surface = sm.getFocusedSurface();
    if (!surface) {
      console.warn('No focused surface. Stopping command execution.');
      return
    }
    let editorSession = this.context.editorSession;
    editorSession.transaction(function(tx, args) {
      tx.delete(nodeId);
      return args
    });
  }
}

EditLinkTool.urlPropertyPath = ['url'];

var LinkPackage = {
  name: 'link',
  configure: function(config) {
    config.addNode(Link);
    config.addComponent('link', LinkComponent);
    config.addConverter('html', LinkHTMLConverter);
    config.addConverter('xml', LinkHTMLConverter);
    config.addCommand('link', LinkCommand, {
      nodeType: 'link',
      commandGroup: 'annotations'
    });
    config.addCommand('edit-link', EditAnnotationCommand, {
      nodeType: 'link',
      commandGroup: 'prompt'
    });
    config.addTool('edit-link', EditLinkTool);
    config.addIcon('link', { 'fontawesome': 'fa-link'});
    config.addIcon('open-link', { 'fontawesome': 'fa-external-link' });
    config.addLabel('link', {
      en: 'Link',
      de: 'Link'
    });
    config.addLabel('open-link', {
      en: 'Open Link',
      de: 'Link öffnen'
    });
    config.addLabel('delete-link', {
      en: 'Remove Link',
      de: 'Link löschen'
    });
    config.addKeyboardShortcut('CommandOrControl+K', { command: 'link' });
  },
  Link,
  LinkComponent,
  LinkCommand,
  LinkHTMLConverter,
  EditLinkTool
};

class ListNode extends DocumentNode {

  getItemAt(idx) {
    return this.getDocument().get(this.items[idx])
  }

  getFirstItem() {
    return this.getItemAt(0)
  }

  getLastItem() {
    return this.getItemAt(this.getLength()-1)
  }

  getItems() {
    const doc = this.getDocument();
    return this.items.map((id) => {
      return doc.get(id)
    })
  }

  getItemPosition(itemId) {
    if (itemId._isNode) itemId = itemId.id;
    let pos = this.items.indexOf(itemId);
    if (pos < 0) throw new Error('Item is not within this list: ' + itemId)
    return pos
  }

  insertItemAt(pos, itemId) {
    const doc = this.getDocument();
    doc.update([this.id, 'items'], { type: 'insert', pos: pos, value: itemId });
  }

  appendItem(itemId) {
    this.insertItemAt(this.items.length, itemId);
  }

  removeItemAt(pos) {
    const doc = this.getDocument();
    doc.update([this.id, 'items'], { type: 'delete', pos: pos });
  }

  remove(itemId) {
    const doc = this.getDocument();
    const pos = this.getItemPosition(itemId);
    if (pos >= 0) {
      doc.update([this.id, 'items'], { type: 'delete', pos: pos });
    }
  }

  isEmpty() {
    return this.items.length === 0
  }

  getLength() {
    return this.items.length
  }

  get length() {
    return this.getLength()
  }
}

ListNode.isList = true;

ListNode.type = 'list';

ListNode.schema = {
  ordered: { type: 'boolean', default: false },
  
  items: { type: [ 'array', 'id' ], default: [], owned: true }
};

class ListItem extends TextNode {}

ListItem.type = 'list-item';

ListItem.schema = {
  level: { type: "number", default: 1 }
};

class ListItemComponent extends TextPropertyComponent {}

function getListTagName(node) {
  
  return node.ordered ? 'ol' : 'ul'
}

function renderListNode(node, rootEl, createElement) {
  let items = node.getItems();
  let stack = [rootEl];
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    if (item.level<stack.length) {
      for (let j = stack.length; j > item.level; j--) {
        stack.pop();
      }
    } else if (item.level>stack.length) {
      for (let j = stack.length; j < item.level; j++) {
        
        let sublist = createElement(getListTagName(node));
        last$1(stack).append(sublist);
        stack.push(sublist);
      }
    }
    console.assert(item.level === stack.length, 'item.level should now be the same as stack.length');
    last$1(stack).append(
      createElement(item)
    );
  }
  for(let j=stack.length; j>1;j--) {
    stack.pop();
  }
}

class ListComponent extends Component {

  didMount() {
    this.context.editorSession.onRender('document', this._onChange, this);
  }

  render($$) {
    let node = this.props.node;
    let el = $$(getListTagName(node))
      .addClass('sc-list')
      .attr('data-id', node.id);
    renderListNode(node, el, (arg) => {
      if (isString$1(arg)) {
        return $$(arg)
      } else if(arg.type === 'list-item') {
        let item = arg;
        return $$(ListItemComponent, {
          path: [item.id, 'content'],
          node: item,
          tagName: 'li'
        })
        
        .ref(item.id)
      }
    });
    return el
  }

  _onChange(change) {
    const node = this.props.node;
    if (change.hasUpdated(node.id)) {
      return this.rerender()
    }
    
    let itemIds = node.items;
    for (let i = 0; i < itemIds.length; i++) {
      if (change.hasUpdated([itemIds[i], 'level'])) {
        return this.rerender()
      }
    }
  }

}


ListComponent.prototype._isCustomNodeComponent = true;

var ListHTMLConverter = {

  type: "list",

  matchElement: function(el) {
    return el.is('ul') || el.is('ol')
  },

  import: function(el, node, converter) {
    let self = this;
    this._santizeNestedLists(el);
    if (el.is('ol')) {
      node.ordered = true;
    }
    node.items = [];
    let itemEls = el.findAll('li');
    itemEls.forEach(function(li) {
      
      let listItem = converter.convertElement(li);
      listItem.level = _getLevel(li);
      node.items.push(listItem.id);
    });
    function _getLevel(li) {
      let _el = li;
      let level = 1;
      while(_el) {
        if (_el.parentNode === el) return level
        _el = _el.parentNode;
        if (self.matchElement(_el)) level++;
      }
    }
  },

  export: function(node, el, converter) {
    let $$ = converter.$$;
    el.tagName = getListTagName(node);
    renderListNode(node, el, (arg)=>{
      if (isString$1(arg)) {
        return $$(arg)
      } else {
        let item = arg;
        return $$('li').append(converter.annotatedText(item.getTextPath()))
      }
    });
    return el
  },

  _santizeNestedLists(root) {
    let nestedLists = root.findAll('ol,ul');
    nestedLists.forEach((el)=>{
      while (!el.parentNode.is('ol,ul')) {
        
        let parent = el.parentNode;
        let grandParent = parent.parentNode;
        let pos = grandParent.getChildIndex(parent);
        grandParent.insertAt(pos+1, el);
      }
    });
  }
};

var ListItemHTMLConverter = {

  type: "list-item",

  matchElement: function(el) {
    return el.is('li')
  },

  import: function(el, node, converter) {
    node.content = converter.annotatedText(el, [node.id, 'content']);
  },

  export: function(node, el, converter) {
    el.append(converter.annotatedText(node.getTextPath()));
  }
};

class InsertListCommand extends SwitchTextTypeCommand$$1 {

  execute (params) {
    let ordered = this.config.spec.ordered;
    let editorSession = params.editorSession;
    editorSession.transaction((tx) => {
      tx.toggleList({ ordered: ordered });
    });
  }
}

var ListPackage = {
  name: 'list',
  configure: function(config) {
    config.addNode(ListNode);
    config.addNode(ListItem);
    config.addComponent('list', ListComponent);
    config.addCommand('insert-unordered-list', InsertListCommand, {
      spec: { type: 'list', ordered: false },
      commandGroup: 'text-types'
    });

    config.addLabel('insert-unordered-list', {
      en: 'Unordered list',
      de: 'Aufzählung'
    });
    config.addIcon('insert-unordered-list', { 'fontawesome': 'fa-list-ul' });

    config.addCommand('insert-ordered-list', InsertListCommand, {
      spec: { type: 'list', ordered: true },
      commandGroup: 'text-types'
    });
    config.addLabel('insert-ordered-list', {
      en: 'Ordered list',
      de: 'Nummerierte Liste'
    });
    config.addIcon('insert-ordered-list', { 'fontawesome': 'fa-list-ol' });
    config.addConverter('html', ListHTMLConverter);
    config.addConverter('html', ListItemHTMLConverter);
  }
};

class MultiSelect extends Component {

  didMount() {
    this._recomputeOrder();
  }

  getInitialState() {
    return {
      options: this.props.options,
      selectedOptions: this.props.selectedOptions,
      collapsed: true
    }
  }

  render($$) {
    let options = this.state.options;
    let maxItems = this.props.maxItems;
    let selectedOptions = this.state.selectedOptions;
    let collapsed = this.state.collapsed;
    let limit = selectedOptions.length > maxItems ? selectedOptions.length : maxItems;

    let el = $$('div').addClass('sc-multi-select');

    let optionsEl = options.map((option, index) => {
      if(!collapsed || index <= limit - 1) {
        let optionEl = $$('div').addClass('se-select-option');
        let icon = selectedOptions.indexOf(option.id) > -1 ? 'selected-option' : 'unselected-option';
        optionEl.append(
          this.renderIcon($$, icon).addClass('se-option-icon'),
          $$('span').addClass('se-option-label').append(option.label)
        ).on('click', this._onToggleCheckbox.bind(this, option.id));

        return optionEl
      } else {
        return ''
      }
    });

    el.append(optionsEl);

    let collapseLabelEl = $$('div').addClass('se-multi-collapse-label');

    if(options.length > limit) {
      if(collapsed) {
        let leftItems = options.length - limit;
        collapseLabelEl.append(
          this.getLabel('expand-options') + ' (' + leftItems + ')'
        ).on('click', this._onToggleExpand);
      } else {
        collapseLabelEl.append(
          this.getLabel('collapse-options')
        ).on('click', this._onToggleExpand);
      }
    }

    el.append(collapseLabelEl);

    return el
  }

  renderIcon($$, icon) {
    let iconEl = this.context.iconProvider.renderIcon($$, icon);
    return iconEl
  }

  getSelectedOptions() {
    return this.state.selectedOptions
  }

  _recomputeOrder() {
    let options = this.state.options;
    let selectedOptions = this.state.selectedOptions;

    let sortedOptions = orderBy(options, (option) => {
      return selectedOptions.indexOf(option.id)
    }, 'desc');

    this.extendState({options: sortedOptions});
  }

  _onToggleCheckbox(id) {
    let selectedOptions = this.state.selectedOptions;
    let index = selectedOptions.indexOf(id);

    if(index > -1) {
      selectedOptions.splice(index, 1);
    } else {
      selectedOptions.push(id);
    }

    this.extendState({selectedOptions: selectedOptions});
    this.el.emit('change');
  }

  _onToggleExpand() {
    let collapsed = this.state.collapsed;

    this._recomputeOrder();
    this.extendState({collapsed: !collapsed});
  }

}

var MultiSelectPackage = {
  name: 'multi-select',
  configure: function(config) {
    config.addComponent('multi-select', MultiSelect);
    config.addIcon('selected-option', { 'fontawesome': 'fa-check-square-o' });
    config.addIcon('unselected-option', { 'fontawesome': 'fa-square-o' });
    config.addLabel('expand-options', {
      en: 'Show more',
      de: 'Zeig mehr'
    });
    config.addLabel('collapse-options', {
      en: 'Show less',
      de: 'Zeige weniger'
    });
  }
};

class Paragraph extends TextBlock {}

Paragraph.type = "paragraph";

class ParagraphComponent extends TextBlockComponent {
  render($$) {
    let el = super.render($$);
    return el.addClass('sc-paragraph')
  }

  getTagName() {
    return 'p'
  }
}

var ParagraphHTMLConverter = {

  type: 'paragraph',
  tagName: 'p',

  import: function(el, node, converter) {
    let textAlign = el.attr('data-text-align');
    node.textAlign = textAlign || 'left';
    node.content = converter.annotatedText(el, [node.id, 'content']);
  },

  export: function(node, el, converter) {
    
    if (node.textAlign !== 'left') {
      el.attr('data-text-align', node.textAlign);
    }
    el.append(converter.annotatedText([node.id, 'content']));
  }

};

var ParagraphPackage = {
  name: 'paragraph',
  configure: function(config) {
    config.addNode(Paragraph);
    config.addComponent(Paragraph.type, ParagraphComponent);
    config.addConverter('html', ParagraphHTMLConverter);
    config.addConverter('xml', ParagraphHTMLConverter);
    config.addCommand('paragraph', SwitchTextTypeCommand$$1, {
      spec: { type: 'paragraph' },
      commandGroup: 'text-types'
    });
    config.addIcon('paragraph', { 'fontawesome': 'fa-paragraph' });
    config.addLabel('paragraph', {
      en: 'Paragraph',
      de: 'Paragraph'
    });
    config.addKeyboardShortcut('CommandOrControl+Alt+0', { command: 'paragraph' });
  },
  Paragraph: Paragraph,
  ParagraphComponent: ParagraphComponent,
  ParagraphHTMLConverter: ParagraphHTMLConverter
};

class SaveCommand extends Command {
  constructor() {
    super({ name: 'save' });
  }

  getCommandState(params) {
    let dirty = params.editorSession.hasUnsavedChanges();
    return {
      disabled: !dirty,
      active: false
    }
  }

  execute(params) {
    let editorSession = params.editorSession;
    editorSession.save();
    return {
      status: 'saving-process-started'
    }
  }
}

var PersistencePackage = {
  name: 'persistence',
  configure: function(config) {
    config.addCommand('save', SaveCommand, {
      commandGroup: 'persistence'
    });
    config.addIcon('save', { 'fontawesome': 'fa-save' });
    config.addLabel('save', {
      en: 'Save',
      de: 'Speichern'
    });
    config.addKeyboardShortcut('CommandOrControl+S', { command: 'save' });

  },
  SaveCommand: SaveCommand
};

class Strong extends PropertyAnnotation {}

Strong.type = "strong";
Strong.fragmentation = Fragmenter.ANY;

var StrongHTMLConverter = {

  type: "strong",
  tagName: "strong",

  matchElement: function(el) {
    return el.is("strong, b")
  }

};

class StrongComponent extends AnnotationComponent {
  getTagName() {
    return 'strong'
  }
}

var StrongPackage = {
  name: 'strong',
  configure: function(config) {
    config.addNode(Strong);
    config.addConverter('html', StrongHTMLConverter);
    config.addConverter('xml', StrongHTMLConverter);
    config.addComponent('strong', StrongComponent);
    config.addCommand('strong', AnnotationCommand, {
      nodeType: 'strong',
      commandGroup: 'annotations'
    });
    config.addIcon('strong', { 'fontawesome': 'fa-bold' });
    config.addLabel('strong', {
      en: 'Strong',
      de: 'Fett'
    });
    config.addKeyboardShortcut('CommandOrControl+B', { command: 'strong' });
  },
  Strong,
  StrongComponent,
  StrongHTMLConverter
};

class Subscript extends PropertyAnnotation {}

Subscript.type = 'subscript';


Subscript.fragmentation = Fragmenter.ANY;

var SubscriptHTMLConverter = {
  type: 'subscript',
  tagName: 'sub'
};

var SubscriptPackage = {
  name: 'subscript',
  configure: function(config) {
    config.addNode(Subscript);
    config.addConverter('html', SubscriptHTMLConverter);
    config.addConverter('xml', SubscriptHTMLConverter);
    config.addComponent('subscript', AnnotationComponent);
    config.addCommand('subscript', AnnotationCommand, {
      nodeType: 'subscript',
      commandGroup: 'annotations'
    });
    config.addIcon('subscript', { 'fontawesome': 'fa-subscript' });
    config.addLabel('subscript', {
      en: 'Subscript',
      de: 'Tiefgestellt'
    });
  },
  Subscript,
  SubscriptHTMLConverter
};

class Superscript extends PropertyAnnotation {}

Superscript.type = 'superscript';


Superscript.fragmentation = Fragmenter.ANY;

var SuperscriptHTMLConverter = {
  type: 'superscript',
  tagName: 'sup'
};

var SuperscriptPackage = {
  name: 'superscript',
  configure: function(config) {
    config.addNode(Superscript);
    config.addConverter('html', SuperscriptHTMLConverter);
    config.addConverter('xml', SuperscriptHTMLConverter);
    config.addComponent('superscript', AnnotationComponent);
    config.addCommand('superscript', AnnotationCommand, {
      nodeType: 'superscript',
      commandGroup: 'annotations'
    });
    config.addIcon('superscript', { 'fontawesome': 'fa-superscript' });
    config.addLabel('superscript', {
      en: 'Superscript',
      de: 'Hochgestellt'
    });
  },
  Superscript,
  SuperscriptHTMLConverter
};

const LEFT_QUOTE = "\u201C";
const RIGHT_QUOTE = "\u201D";

class InsertQuoteMarkCommand extends Command {

  getCommandState(params, context) { 
    
    
    return {
      disabled: false
    }
  }

  execute(params, context) { 
    let editorSession = params.editorSession;
    let sel = editorSession.getSelection();
    let doc = editorSession.getDocument();
    if (sel.isPropertySelection()) {
      let nodeId = sel.start.getNodeId();
      let node = doc.get(nodeId);
      if (node.isText()) {
        let text = node.getText();
        let offset = sel.start.offset;
        let mark;
        if (offset === 0 || /\s/.exec(text.slice(offset-1, offset))) {
          mark = LEFT_QUOTE;
        } else {
          mark = RIGHT_QUOTE;
        }
        editorSession.transaction((tx) => {
          tx.insertText(mark);
        });
        return true
      }
    }
    return false
  }

}

var QuoteMarksPackage = {

  name: 'quote-marks',

  configure: function(config) {
    config.addCommand('insert-quote-marks', InsertQuoteMarkCommand, {
      commandGroup: 'text-macros'
    });
    config.addKeyboardShortcut('"', { type: 'textinput', command: 'insert-quote-marks' });
  }

};

class Table extends BlockNode {

  getRowCount() {
    return this.cells.length
  }

  getColCount() {
    if (this.cells.length > 0) {
      return this.cells[0].length
    } else {
      return 0
    }
  }

  getCellAt(row, col) {
    let cellId = this.cells[row][col];
    if (cellId) {
      return this.document.get(cellId)
    }
  }

}

Table.schema = {
  type: 'table',
  cells: { type: ['array', 'array', 'id'], default: [], owned: true }
};

class TableCell extends TextNode {}

TableCell.schema = {
  type: 'table-cell',
  rowspan: { type: 'number', default: 0 },
  colspan: { type: 'number', default: 0 }
};

class TableCellComponent extends Component {
  render($$) {
    let node = this.props.node;
    let el = $$('td').addClass('sc-table-cell');
    el.append(
      $$(TextPropertyEditor, {
        path: node.getTextPath(),
        disabled: this.props.disabled
      }).ref('editor')
    );
    if (node.rowspan > 0) {
      el.attr('rowspan', node.rowspan);
    }
    if (node.colspan > 0) {
      el.attr('colspan', node.colspan);
    }
    return el
  }

  grabFocus() {
    let node = this.props.node;
    this.context.editorSession.setSelection({
      type: 'property',
      path: node.getPath(),
      startOffset: node.getLength(),
      surfaceId: this.refs.editor.id
    });
  }
}

TableCellComponent.prototype._isTableCellComponent = true;

class TableComponent extends Component {

  render($$) {
    let el = $$('table').addClass('sc-table');
    let node = this.props.node;
    let doc = this.props.node.getDocument();
    let cells = this.props.node.cells;
    let rowCount = node.getRowCount();
    let colCount = node.getColCount();
    for (let i = 0; i < rowCount; i++) {
      let rowEl = $$('tr');
      for (let j = 0; j < colCount; j++) {
        let cellId = cells[i][j];
        
        if (cellId) {
          let cellNode = doc.get(cellId);
          let cellEl = $$(TableCellComponent, {
            node: cellNode,
            disabled: this.props.disabled
          }).ref(cellNode.id);
          rowEl.append(cellEl);
        }
      }
      el.append(rowEl);
    }
    el.on('click', this.onClick);
    el.on('dblclick', this.onDblClick);
    return el
  }

  onClick(event) {
    event.stopPropagation();
    
  }

  
  onDblClick(event) {
    event.stopPropagation();
    

    
    
    let comp = Component.unwrap(event.target);
    if (comp) {
      let cellComp;
      if (comp._isTableCellComponent) {
        cellComp = comp;
      } else if (comp._isTextPropertyEditor) {
        cellComp = comp.getParent();
      } else if (comp._isTextPropertyComponent) {
        cellComp = comp.getParent().getParent();
      } else {
        console.warn('TODO: find the right cell');
      }
      if (cellComp) {
        cellComp.grabFocus();
      }
    }
  }

  grabFocus() {
    let cellId = this.props.node.cells[0][0];
    if (cellId) {
      let comp = this.refs[cellId];
      comp.grabFocus();
    }
  }

}

TableComponent.hasDropzones = true;

var TableHTMLConverter = {

  type: 'table',
  tagName: 'table',

  
  import: function(el, node, converter) {
    let trs = el.find('tbody').getChildren();
    let colCount = 0;
    let cells = [];
    let rowspans = []; 
    for (let i = 0; i < trs.length; i++) {
      let tds = trs[i].getChildren();
      let row = [];
      colCount = Math.max(tds.length, colCount);
      for (let j = 0; j < tds.length; j++) {
        let td = tds[j];
        
        if (rowspans[j] > 1) {
          row.push(null);
          rowspans[j] -= 1; 
        }
        let tableCell = converter.convertElement(td);
        row.push(tableCell.id);
        if (tableCell.rowspan > 1) {
          rowspans[j] = tableCell.rowspan;
        }
        if (tableCell.colspan > 1) {
          
          times(tableCell.colspan - 1, () => {
            row.push(null);
          });
        }
      }
      cells.push(row);
    }
    node.cells = cells;
  },

  export: function(node, el, converter) {
    let $$ = converter.$$;
    let rowCount = node.getRowCount();
    let colCount = node.getColCount();
    for (let i = 0; i < rowCount; i++) {
      let rowEl = $$('tr');
      for (let j = 0; j < colCount; j++) {
        let cellId = node.cells[i][j];
        
        if (cellId) {
          let cellEl = converter.convertNode(cellId);
          rowEl.append(cellEl);
        }
      }
      el.append(rowEl);
    }
    return el
  }
};

var TableCellHTMLConverter = {

  type: 'table-cell',
  tagName: 'td',

  import: function(el, node, converter) {
    node.content = converter.annotatedText(el, [node.id, 'content']);
    let colspan = el.attr('colspan');
    let rowspan = el.attr('rowspan');
    if (colspan) {
      node.colspan = Number(colspan);
    }
    if (rowspan) {
      node.rowspan = Number(rowspan);
    }
  },

  export: function(node, el, converter) {
    el.append(converter.annotatedText([node.id, 'content']));
    if (node.rowspan > 0) {
      el.attr('rowspan', node.rowspan);
    }
    if (node.colspan > 0) {
      el.attr('colspan', node.colspan);
    }
    return el
  }
};

class InsertTableCommand extends InsertNodeCommand {
  createNodeData(tx) {

    
    let a1 = tx.create({ id: uuid('table-cell'), type: 'table-cell', content: "A1" });
    let b1 = tx.create({ id: uuid('table-cell'), type: 'table-cell', content: "B1" });
    
    let a2 = tx.create({ id: uuid('table-cell'), type: 'table-cell', content: "A2" });
    let b2 = tx.create({ id: uuid('table-cell'), type: 'table-cell', content: "B2" });

    return {
      id: uuid('table'),
      type: 'table',
      
      cells: [
        [a1.id, b1.id ],
        [a2.id, b2.id]
      ]
    }

  }
}

var TablePackage = {
  name: 'table',
  configure: function(config) {
    config.addNode(Table);
    config.addNode(TableCell);
    config.addComponent('table', TableComponent);
    config.addConverter('html', TableHTMLConverter);
    config.addConverter('html', TableCellHTMLConverter);
    config.addConverter('xml', TableHTMLConverter);
    config.addConverter('xml', TableCellHTMLConverter);
    config.addCommand('insert-table', InsertTableCommand, {
      nodeType: 'table',
      commandGroup: 'insert'
    });
    config.addIcon('insert-table', { 'fontawesome': 'fa-table' });
    config.addLabel('insert-table', {
      en: 'Table',
      de: 'Tabelle'
    });
    config.addLabel('table', {
      en: 'Table',
      de: 'Tabelle'
    });
    config.addLabel('table-cell.content', {
      en: 'Cell',
      de: 'Zelle'
    });
  }
};

class ProseArticle extends Document {

  _initialize() {
    super._initialize();

    this.create({
      type: 'container',
      id: 'body',
      nodes: []
    });
  }

}

class ProseEditor extends AbstractEditor {

  render($$) {
    let SplitPane$$1 = this.componentRegistry.get('split-pane');
    let el = $$('div').addClass('sc-prose-editor');
    let toolbar = this._renderToolbar($$);
    let editor = this._renderEditor($$);
    let configurator = this.getConfigurator();
    let ScrollPane$$1 = this.componentRegistry.get('scroll-pane');
    let Overlay$$1 = this.componentRegistry.get('overlay');
    let ContextMenu = this.componentRegistry.get('context-menu');
    let Dropzones = this.componentRegistry.get('dropzones');

    let contentPanel = $$(ScrollPane$$1, {
      name: 'contentPanel',
      contextMenu: this.props.contextMenu || 'native',
      scrollbarPosition: 'right',
      scrollbarType: this.props.scrollbarType
    }).append(
      editor,
      $$(Overlay$$1, {
        toolPanel: configurator.getToolPanel('main-overlay'),
        theme: 'dark'
      }),
      $$(ContextMenu),
      $$(Dropzones)
    ).ref('contentPanel');

    el.append(
      $$(SplitPane$$1, {splitType: 'horizontal'}).append(
        toolbar,
        $$(SplitPane$$1, {splitType: 'horizontal', sizeB: 'inherit'}).append(
          contentPanel,
          $$(WorkflowPane$$1, {
            toolPanel: configurator.getToolPanel('workflow')
          })
        )
      )
    );
    return el
  }

  _renderToolbar($$) {
    let configurator = this.getConfigurator();
    return $$('div').addClass('se-toolbar-wrapper').append(
      $$(Toolbar$$1, {
        toolPanel: configurator.getToolPanel('toolbar')
      }).ref('toolbar')
    )
  }

  _renderEditor($$) {
    let configurator = this.getConfigurator();
    return $$(ContainerEditor, {
      disabled: this.props.disabled,
      editorSession: this.editorSession,
      node: this.doc.get('body'),
      commands: configurator.getSurfaceCommandNames()
    }).ref('body')
  }
}

var ProseEditorPackage = {
  name: 'prose-editor',
  configure: function(config) {
    config.defineSchema({
      name: 'prose-article',
      DocumentClass: ProseArticle,
      defaultTextType: 'paragraph'
    });
    
    config.import(BasePackage);
    config.import(BlockquotePackage);
    config.import(ParagraphPackage);
    config.import(HeadingPackage);
    config.import(CodeblockPackage);
    config.import(CodePackage);
    config.import(EmphasisPackage);
    config.import(FindAndReplacePackage, {
      targetSurfaces: ['body']
    });
    config.import(StrongPackage);
    config.import(SubscriptPackage);
    config.import(SuperscriptPackage);
    config.import(LinkPackage);
    config.import(QuoteMarksPackage);
    config.import(ListPackage);
    config.import(TablePackage);

    
    config.addToolPanel('main-overlay', [
      {
        name: 'prompt',
        type: 'tool-group',
        commandGroups: ['prompt']
      }
    ]);

    config.addToolPanel('workflow', [
      {
        name: 'workflow',
        type: 'tool-group',
        commandGroups: ['workflows']
      }
    ]);

    
    config.addToolPanel('toolbar', [
      {
        name: 'text-types',
        type: 'tool-dropdown',
        showDisabled: true,
        style: 'descriptive',
        commandGroups: ['text-types']
      },
      {
        name: 'annotations',
        type: 'tool-group',
        showDisabled: true,
        style: 'minimal',
        commandGroups: ['annotations']
      },
      {
        name: 'insert',
        type: 'tool-dropdown',
        showDisabled: true,
        style: 'descriptive',
        commandGroups: ['insert']
      }
    ]);
  },
  ProseEditor
};

class CorrectionTool extends ToggleTool {

  render($$) {
    let node = this.props.node;
    let Button$$1 = this.getComponent('button');
    let el = $$('div').addClass('sc-correction-tool');

    if (node && node.suggestions.length > 0) {
      node.suggestions.forEach((s) => {
        el.append(
          $$(Button$$1, {
            label: s,
            style: this.props.style
          }).attr('title', this.getLabel('open-link'))
            .attr('data-correction', s)
            .on('click', this._applyCorrection.bind(this, s))
        );
      });
    } else {
      el.append(
        $$(Button$$1, {
          label: 'No suggestions',
          style: this.props.style,
          disabled: true
        })
      );
    }
    return el
  }

  _applyCorrection(suggestion) {
    let editorSession = this.context.editorSession;
    let node = this.props.node;
    editorSession.transaction((tx) => {
      let sel = tx.getSelection();
      tx.setSelection({
        type: 'property',
        path: node.start.path,
        startOffset: node.start.offset,
        endOffset: node.end.offset,
        containerId: sel.containerId
      });
      tx.insertText(suggestion);
    });
  }
}

class SpellCheckCommand extends Command {

  getCommandState(params) {

    let state = params.selectionState;
    let markers = state.getMarkers();
    if (markers.length === 0) {
      return {
        disabled: true
      }
    }
    markers = markers.filter(function(m) {
      return m.type === 'spell-error'
    });

    if (markers.length > 0) {
      return {
        disabled: false,
        active: false,
        mode: null,
        node: markers[0]
      }
    } else {
      return {
        disabled: true
      }
    }
  }
}

var SpellCheckPackage = {
  name: 'spell-check',
  configure: function(config) {
    config.addCommand('correction', SpellCheckCommand, {
      commandGroup: 'spell-check'
    });
    config.addTool('correction', CorrectionTool);
  }
};

const { UndoCommand: UndoCommand$1, RedoCommand, SelectAllCommand: SelectAllCommand$1 } = BasePackage;




class TextInput extends AbstractEditor {

  constructor(parent, props = {}) {
    super(parent, _createEditorSession(props));

    this.doc = this.editorSession.getDocument();
  }

  render($$) {
    let el = $$(this._getTagName()).addClass('sc-text-input');
    el.append(
      $$(TextInputEditor, {
        path: ['input', 'content']
      }).ref('input')
        .on('enter', this._onEnter)
        .on('escape', this._onEscape)
    );
    return el
  }

  didMount() {
    
    this.refs.input.selectLast();
  }

  dispose() {
    super.dispose();
    this.doc.dispose();
    this.editorSession.dispose();
  }

  
  shouldRerender() {
    return false
  }

  getContent() {
    return this.getDocument().getContent()
  }

  _getDocument() {
    return this.context.editorSession.getDocument()
  }

  _getTagName() {
    return this.props.tagName || 'div'
  }

  _onEnter(event) {
    event.stopPropagation();
    this.el.emit('confirm');
  }

  _onEscape(event) {
    event.stopPropagation();
    this.el.emit('cancel');
  }

}

function _createEditorSession(props) {
  let config = new Configurator();
  config.addNode(TextNode);
  config.addCommand('undo', UndoCommand$1);
  config.addCommand('redo', RedoCommand);
  config.addCommand('select-all', SelectAllCommand$1);
  config.addKeyboardShortcut('CommandOrControl+Z', { command: 'undo' });
  config.addKeyboardShortcut('CommandOrControl+Shift+Z', { command: 'redo' });
  config.addKeyboardShortcut('CommandOrControl+A', { command: 'select-all' });

  config.defineSchema({
    name: 'text-input',
    
    
    defaultTextType: 'text',
    
    
    ArticleClass: TextInputDocument,
  });
  if (props.package) {
    config.import(props.package);
  }
  let doc = config.createArticle();
  if (props.content) {
    doc.set(['input', 'content'], props.content);
  }
  let editorSession = new EditorSession(doc, {
    configurator: config
  });
  return {
    editorSession
  }
}

class TextInputDocument extends Document {
  constructor(...args) {
    super(...args);

    this.create({
      type: 'text',
      id: 'input',
      content: ''
    });
  }
  getContentNode() {
    return this.get('input')
  }
  getContent() {
    return this.getContentNode().getText()
  }
}



class TextInputEditor extends TextPropertyEditor {

  onKeyDown(event) {
    let handled = false;
    if (event.keyCode === 27) {
      handled = true;
      this.el.emit('escape');
    }
    if (handled) {
      event.stopPropagation();
      event.preventDefault();
    } else {
      super.onKeyDown(event);
    }
  }

  selectLast() {
    const doc = this.getDocument();
    const input = doc.getContentNode();
    this.editorSession.setSelection({
      type: 'property',
      path: input.getTextPath(),
      startOffset: input.getLength(),
      surfaceId: this.id
    });
  }

  selectAll() {
    const doc = this.getDocument();
    const input = doc.getContentNode();
    this.editorSession.setSelection({
      type: 'property',
      path: input.getTextPath(),
      startOffset: 0,
      endffset: input.getLength(),
      surfaceId: this.id
    });
  }

  _handleEnterKey(...args) {
    super._handleEnterKey(...args);
    this.el.emit('enter');
  }
}

var TextInputPackage = {
  name: 'text-input',
  configure(config) {
    config.addComponent('text-input', TextInput);
  },
  TextInput
};

var ToolbarPackage = {
  name: 'toolbar',
  configure(config) {
    config.addComponent('toolbar', Toolbar$$1);
  },
  Toolbar: Toolbar$$1
};

class TextAlignCommand extends Command {
  getCommandState (params) {
    let sel = this._getSelection(params);
    let selectionState = params.editorSession.getSelectionState();
    let doc = params.editorSession.getDocument();
    let commandState = { disabled: true };

    if (sel.isPropertySelection() && !selectionState.isInlineNodeSelection()) {
      let path = sel.getPath();
      let node = doc.get(path[0]);
      if (node && node.isText() && node.isBlock()) {
        commandState.nodeId = node.id;
        commandState.disabled = false;
        if (node.textAlign === this.config.textAlign) {
          commandState.active = true;
        }
        
        
        commandState.showInContext = sel.start.offset === 0 && sel.end.offset === 0;
      }
    }
    return commandState
  }

  execute (params) {
    let nodeId = params.commandState.nodeId;
    let editorSession = params.editorSession;
    editorSession.transaction((tx) => {
      tx.set([nodeId, 'textAlign'], this.config.textAlign);
    });
  }
}

var TextAlignPackage = {
  name: 'text-align',
  configure: function(config) {
    config.addCommand('align-left', TextAlignCommand, {
      textAlign: 'left',
      commandGroup: 'text-align'
    });
    config.addCommand('align-center', TextAlignCommand, {
      textAlign: 'center',
      commandGroup: 'text-align'
    });
    config.addCommand('align-right', TextAlignCommand, {
      textAlign: 'right',
      commandGroup: 'text-align'
    });

    config.addKeyboardShortcut('CommandOrControl+Shift+L', { command: 'align-left' });
    config.addKeyboardShortcut('CommandOrControl+Shift+E', { command: 'align-center' });
    config.addKeyboardShortcut('CommandOrControl+Shift+R', { command: 'align-right' });

    config.addIcon('align-left', { 'fontawesome': 'fa-align-left' });
    config.addIcon('align-center', { 'fontawesome': 'fa-align-center' });
    config.addIcon('align-right', { 'fontawesome': 'fa-align-right' });

    config.addLabel('align-left', 'Left');
    config.addLabel('align-center', 'Center');
    config.addLabel('align-right', 'Right');

    config.addLabel('text-align', 'Text Align');
  }
};

export { index$1 as cssSelect, domUtils as DomUtils, ChangeStore, CollabServer, DocumentClient, ServerRequest, WebSocketConnection, ClientConnection, CollabServerConfigurator, DocumentEngine, ServerResponse, computeSnapshot, CollabClient, CollabServerPackage, DocumentServer, SnapshotEngine, CollabEngine, CollabSession, Server, SnapshotStore, DOMElement, DOMEventListener, DefaultDOMElement, BrowserDOMElement, MemoryDOMElement, operationHelpers, selectionHelpers, annotationHelpers, AnnotationIndex, AnnotationMixin, ArrayOperation, BlockNode, ChangeHistory, ChangeRecorder, Conflict, Container, ContainerAdapter, ContainerAddress, ContainerAnnotation, ContainerAnnotationIndex, ContainerMixin, ContainerSelection, Coordinate, CoordinateAdapter, CoordinateOperation, copySelection, createDocumentFactory, CustomSelection, Data, DefaultChangeCompressor, DefaultFileProxy, Document, DocumentChange, documentHelpers, DocumentIndex, DocumentNode, DocumentNodeFactory, DocumentSchema, DOMExporter, DOMImporter, Editing, EditingBehavior, EditingInterface, FileNode, FileProxy, Fragmenter, HTMLExporter, HTMLImporter, IncrementalData, InlineNode, JSONConverter, Marker, Node, NodeIndex, NodeRegistry, NodeSelection, ObjectOperation, OperationSerializer, ParentNodeHook, paste, Property, PropertyAnnotation, PropertyIndex, PropertySelection, Range, Schema, Selection, SelectionState, TextBlock, TextNode, TextNodeMixin, TextOperation, Transaction, XMLExporter, XMLImporter, AbstractEditor, AbstractIsolatedNodeComponent, AbstractScrollPane$$1 as AbstractScrollPane, AnnotatedTextComponent, AnnotationCommand, AnnotationComponent, BlockNodeComponent, Clipboard, ClipboardExporter, ClipboardImporter, Command, CommandManager, Component, ComponentRegistry, Configurator, ContainerEditor, CursorComponent, CustomSurface, DefaultLabelProvider, DOMSelection, DragAndDropHandler, DragManager, EditAnnotationCommand, EditInlineNodeCommand, EditorSession, ExecuteCommandHandler, FileManager, FontAwesomeIcon, FontAwesomeIconProvider, GlobalEventHandler, Highlights, InlineNodeComponent, InsertInlineNodeCommand, InsertNodeCommand, IsolatedNodeComponent, KeyboardManager, MacroManager, MarkersManager, MenuItem, NodeComponent, Overlay, RenderingEngine, ResourceManager, ResponsiveApplication, Router, SelectionFragmentComponent, Surface, SurfaceManager, SwitchTextTypeCommand$$1 as SwitchTextTypeCommand, TextBlockComponent, TextPropertyComponent, TextPropertyEditor, ToggleTool, ToolDropdown, ToolGroup$$1 as ToolGroup, ToolPrompt$$1 as ToolPrompt, ToolPanel, UnsupportedNodeComponent, VirtualElement, WorkflowPane$$1 as WorkflowPane, Button$$1 as Button, Layout$$1 as Layout, ScrollPane$$1 as ScrollPane, SplitPane$$1 as SplitPane, Toolbar$$1 as Toolbar, ToggleTool as Tool, findParentComponent, setDOMSelection, async, ArrayIterator, ArrayTree, array2table, camelCase, capitalize, clone, cloneDeep, createCountingIdGenerator, debounce, deleteFromArray, diff, encodeXMLEntities, EventEmitter, extend, Factory, filter, find, findIndex$1 as findIndex, flatten, flattenOften, forEach, getRelativeBoundingRect, getRelativeMouseBounds, inBrowser, includes, isArray$1 as isArray, isArrayEqual, isBoolean, isEqual, isFunction$1 as isFunction, isMatch, isNil, isNumber, isObject$1 as isObject, isPlainObject$1 as isPlainObject, isString$1 as isString, last$1 as last, levenshtein, array2table as makeMap, map, merge$1 as merge, PathObject, percentage, platform, pluck, printStacktrace, Registry, request, sendRequest, startsWith, SubstanceError, substanceGlobals, times, TreeIndex, uniq, uuid, without, orderBy, keys$1 as keys, parseKeyEvent, getDOMRangeFromEvent, getSelectionRect, getRelativeRect, isMouseInsideDOMSelection, XMLAnchorNode, XMLAnnotationNode, XMLContainerNode, XMLDocument, XMLEditingInterface, XMLElementNode, ElementNodeConverter as XMLElementNodeConverter, XMLExternalNode, ExternalNodeConverter as XMLExternalNodeConverter, XMLSchema, XMLTextNode, TextNodeConverter as XMLTextNodeConverter, checkSchema, compileRNG, registerSchema, SchemaDrivenCommandManager, _loadRNG as loadRNG, validateXML as validateXMLSchema, ValidatingChildNodeIterator, prettyPrintXML, BasePackage, BlockquotePackage, BodyScrollPanePackage, ButtonPackage, CodePackage, CodeblockPackage, ContextMenuPackage, DropzonesPackage, EmphasisPackage, FilePackage, FindAndReplacePackage, GridPackage, GutterPackage, HeadingPackage, ImagePackage, InlineWrapperPackage, InputPackage, LayoutPackage, LinkPackage, ListPackage, ModalPackage, MultiSelectPackage, OverlayPackage, ParagraphPackage, PersistencePackage, ProseEditorPackage, QuoteMarksPackage, ScrollPanePackage, ScrollbarPackage, SpellCheckPackage, SplitPanePackage, StrongPackage, SubscriptPackage, SuperscriptPackage, TabbedPanePackage, TablePackage, TextInputPackage, ToolbarPackage, TextAlignPackage };

//# sourceMappingURL=./substance.es.js.map