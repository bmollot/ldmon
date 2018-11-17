// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"web/index.js":[function(require,module,exports) {
"use strict";

require("/../Cargo.toml");

/** RUST CORE
 * This is the main application logic, implemented in Rust and compiled to WASM.
 * The main() function is run as a side-effect of loading that WASM, so importing
 * the project here is all that needs to be done to load the app.
 */
// say hi from JS, just so we know that we're alive
console.log("Started @ ".concat(new Date().toISOString()));
/**
 * Handle PWA installation prompt.
 * see https://developers.google.com/web/fundamentals/app-install-banners/
 */

var inBtn = document.getElementById('pwa-install-button');
var deferredPrompt;
window.addEventListener('beforeinstallprompt', function (ev) {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  ev.preventDefault(); // Stash the event so it can be triggered later.

  deferredPrompt = ev;
  inBtn.style.display = 'block';
});
inBtn.addEventListener('click', function (ev) {
  inBtn.style.display = 'none';
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(function (res) {
    if (res.outcome === 'accepted') {
      console.log('User accepted A2HS propt; PWA Installed');
    } else {
      console.log('User denied A2HS prompt; PWA installation canceled');
    }

    deferredPrompt = null;
  });
});
},{"/../Cargo.toml":"../Cargo.toml"}],"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/bundle-loader.js":[function(require,module,exports) {
var getBundleURL = require('./bundle-url').getBundleURL;

function loadBundlesLazy(bundles) {
  if (!Array.isArray(bundles)) {
    bundles = [bundles];
  }

  var id = bundles[bundles.length - 1];

  try {
    return Promise.resolve(require(id));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return new LazyPromise(function (resolve, reject) {
        loadBundles(bundles.slice(0, -1)).then(function () {
          return require(id);
        }).then(resolve, reject);
      });
    }

    throw err;
  }
}

function loadBundles(bundles) {
  return Promise.all(bundles.map(loadBundle));
}

var bundleLoaders = {};

function registerBundleLoader(type, loader) {
  bundleLoaders[type] = loader;
}

module.exports = exports = loadBundlesLazy;
exports.load = loadBundles;
exports.register = registerBundleLoader;
var bundles = {};

function loadBundle(bundle) {
  var id;

  if (Array.isArray(bundle)) {
    id = bundle[1];
    bundle = bundle[0];
  }

  if (bundles[bundle]) {
    return bundles[bundle];
  }

  var type = (bundle.substring(bundle.lastIndexOf('.') + 1, bundle.length) || bundle).toLowerCase();
  var bundleLoader = bundleLoaders[type];

  if (bundleLoader) {
    return bundles[bundle] = bundleLoader(getBundleURL() + bundle).then(function (resolved) {
      if (resolved) {
        module.bundle.register(id, resolved);
      }

      return resolved;
    });
  }
}

function LazyPromise(executor) {
  this.executor = executor;
  this.promise = null;
}

LazyPromise.prototype.then = function (onSuccess, onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.then(onSuccess, onError);
};

LazyPromise.prototype.catch = function (onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.catch(onError);
};
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"../.cache/.cargo-web/loader-41b9cbbdea6b822cf6177c172f2991d8.js":[function(require,module,exports) {
module.exports = function (bundle) {
  function __initialize(__wasm_module, __load_asynchronously) {
    return function (module_factory) {
      var instance = module_factory();

      if (__load_asynchronously) {
        return WebAssembly.instantiate(__wasm_module, instance.imports).then(function (wasm_instance) {
          var exports = instance.initialize(wasm_instance);
          console.log("Finished loading Rust wasm module 'ldmon'");
          return exports;
        }).catch(function (error) {
          console.log("Error loading Rust wasm module 'ldmon':", error);
          throw error;
        });
      } else {
        var instance = new WebAssembly.Instance(__wasm_module, instance.imports);
        return instance.initialize(wasm_instance);
      }
    }(function () {
      var Module = {};
      Module.STDWEB_PRIVATE = {}; // This is based on code from Emscripten's preamble.js.

      Module.STDWEB_PRIVATE.to_utf8 = function to_utf8(str, addr) {
        for (var i = 0; i < str.length; ++i) {
          // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
          // See http://unicode.org/faq/utf_bom.html#utf16-3
          // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
          var u = str.charCodeAt(i); // possibly a lead surrogate

          if (u >= 0xD800 && u <= 0xDFFF) {
            u = 0x10000 + ((u & 0x3FF) << 10) | str.charCodeAt(++i) & 0x3FF;
          }

          if (u <= 0x7F) {
            HEAPU8[addr++] = u;
          } else if (u <= 0x7FF) {
            HEAPU8[addr++] = 0xC0 | u >> 6;
            HEAPU8[addr++] = 0x80 | u & 63;
          } else if (u <= 0xFFFF) {
            HEAPU8[addr++] = 0xE0 | u >> 12;
            HEAPU8[addr++] = 0x80 | u >> 6 & 63;
            HEAPU8[addr++] = 0x80 | u & 63;
          } else if (u <= 0x1FFFFF) {
            HEAPU8[addr++] = 0xF0 | u >> 18;
            HEAPU8[addr++] = 0x80 | u >> 12 & 63;
            HEAPU8[addr++] = 0x80 | u >> 6 & 63;
            HEAPU8[addr++] = 0x80 | u & 63;
          } else if (u <= 0x3FFFFFF) {
            HEAPU8[addr++] = 0xF8 | u >> 24;
            HEAPU8[addr++] = 0x80 | u >> 18 & 63;
            HEAPU8[addr++] = 0x80 | u >> 12 & 63;
            HEAPU8[addr++] = 0x80 | u >> 6 & 63;
            HEAPU8[addr++] = 0x80 | u & 63;
          } else {
            HEAPU8[addr++] = 0xFC | u >> 30;
            HEAPU8[addr++] = 0x80 | u >> 24 & 63;
            HEAPU8[addr++] = 0x80 | u >> 18 & 63;
            HEAPU8[addr++] = 0x80 | u >> 12 & 63;
            HEAPU8[addr++] = 0x80 | u >> 6 & 63;
            HEAPU8[addr++] = 0x80 | u & 63;
          }
        }
      };

      Module.STDWEB_PRIVATE.noop = function () {};

      Module.STDWEB_PRIVATE.to_js = function to_js(address) {
        var kind = HEAPU8[address + 12];

        if (kind === 0) {
          return undefined;
        } else if (kind === 1) {
          return null;
        } else if (kind === 2) {
          return HEAP32[address / 4];
        } else if (kind === 3) {
          return HEAPF64[address / 8];
        } else if (kind === 4) {
          var pointer = HEAPU32[address / 4];
          var length = HEAPU32[(address + 4) / 4];
          return Module.STDWEB_PRIVATE.to_js_string(pointer, length);
        } else if (kind === 5) {
          return false;
        } else if (kind === 6) {
          return true;
        } else if (kind === 7) {
          var pointer = Module.STDWEB_PRIVATE.arena + HEAPU32[address / 4];
          var length = HEAPU32[(address + 4) / 4];
          var _output = [];

          for (var i = 0; i < length; ++i) {
            _output.push(Module.STDWEB_PRIVATE.to_js(pointer + i * 16));
          }

          return _output;
        } else if (kind === 8) {
          var arena = Module.STDWEB_PRIVATE.arena;
          var value_array_pointer = arena + HEAPU32[address / 4];
          var length = HEAPU32[(address + 4) / 4];
          var key_array_pointer = arena + HEAPU32[(address + 8) / 4];
          var _output = {};

          for (var i = 0; i < length; ++i) {
            var key_pointer = HEAPU32[(key_array_pointer + i * 8) / 4];
            var key_length = HEAPU32[(key_array_pointer + 4 + i * 8) / 4];
            var key = Module.STDWEB_PRIVATE.to_js_string(key_pointer, key_length);
            var value = Module.STDWEB_PRIVATE.to_js(value_array_pointer + i * 16);
            _output[key] = value;
          }

          return _output;
        } else if (kind === 9) {
          return Module.STDWEB_PRIVATE.acquire_js_reference(HEAP32[address / 4]);
        } else if (kind === 10 || kind === 12 || kind === 13) {
          var adapter_pointer = HEAPU32[address / 4];
          var pointer = HEAPU32[(address + 4) / 4];
          var deallocator_pointer = HEAPU32[(address + 8) / 4];
          var num_ongoing_calls = 0;
          var drop_queued = false;

          var _output = function output() {
            if (pointer === 0 || drop_queued === true) {
              if (kind === 10) {
                throw new ReferenceError("Already dropped Rust function called!");
              } else if (kind === 12) {
                throw new ReferenceError("Already dropped FnMut function called!");
              } else {
                throw new ReferenceError("Already called or dropped FnOnce function called!");
              }
            }

            var function_pointer = pointer;

            if (kind === 13) {
              _output.drop = Module.STDWEB_PRIVATE.noop;
              pointer = 0;
            }

            if (num_ongoing_calls !== 0) {
              if (kind === 12 || kind === 13) {
                throw new ReferenceError("FnMut function called multiple times concurrently!");
              }
            }

            var args = Module.STDWEB_PRIVATE.alloc(16);
            Module.STDWEB_PRIVATE.serialize_array(args, arguments);

            try {
              num_ongoing_calls += 1;
              Module.STDWEB_PRIVATE.dyncall("vii", adapter_pointer, [function_pointer, args]);
              var result = Module.STDWEB_PRIVATE.tmp;
              Module.STDWEB_PRIVATE.tmp = null;
            } finally {
              num_ongoing_calls -= 1;
            }

            if (drop_queued === true && num_ongoing_calls === 0) {
              _output.drop();
            }

            return result;
          };

          _output.drop = function () {
            if (num_ongoing_calls !== 0) {
              drop_queued = true;
              return;
            }

            _output.drop = Module.STDWEB_PRIVATE.noop;
            var function_pointer = pointer;
            pointer = 0;

            if (function_pointer != 0) {
              Module.STDWEB_PRIVATE.dyncall("vi", deallocator_pointer, [function_pointer]);
            }
          };

          return _output;
        } else if (kind === 14) {
          var pointer = HEAPU32[address / 4];
          var length = HEAPU32[(address + 4) / 4];
          var array_kind = HEAPU32[(address + 8) / 4];
          var pointer_end = pointer + length;

          switch (array_kind) {
            case 0:
              return HEAPU8.subarray(pointer, pointer_end);

            case 1:
              return HEAP8.subarray(pointer, pointer_end);

            case 2:
              return HEAPU16.subarray(pointer, pointer_end);

            case 3:
              return HEAP16.subarray(pointer, pointer_end);

            case 4:
              return HEAPU32.subarray(pointer, pointer_end);

            case 5:
              return HEAP32.subarray(pointer, pointer_end);

            case 6:
              return HEAPF32.subarray(pointer, pointer_end);

            case 7:
              return HEAPF64.subarray(pointer, pointer_end);
          }
        } else if (kind === 15) {
          return Module.STDWEB_PRIVATE.get_raw_value(HEAPU32[address / 4]);
        }
      };

      Module.STDWEB_PRIVATE.serialize_object = function serialize_object(address, value) {
        var keys = Object.keys(value);
        var length = keys.length;
        var key_array_pointer = Module.STDWEB_PRIVATE.alloc(length * 8);
        var value_array_pointer = Module.STDWEB_PRIVATE.alloc(length * 16);
        HEAPU8[address + 12] = 8;
        HEAPU32[address / 4] = value_array_pointer;
        HEAPU32[(address + 4) / 4] = length;
        HEAPU32[(address + 8) / 4] = key_array_pointer;

        for (var i = 0; i < length; ++i) {
          var key = keys[i];
          var key_length = Module.STDWEB_PRIVATE.utf8_len(key);
          var key_pointer = Module.STDWEB_PRIVATE.alloc(key_length);
          Module.STDWEB_PRIVATE.to_utf8(key, key_pointer);
          var key_address = key_array_pointer + i * 8;
          HEAPU32[key_address / 4] = key_pointer;
          HEAPU32[(key_address + 4) / 4] = key_length;
          Module.STDWEB_PRIVATE.from_js(value_array_pointer + i * 16, value[key]);
        }
      };

      Module.STDWEB_PRIVATE.serialize_array = function serialize_array(address, value) {
        var length = value.length;
        var pointer = Module.STDWEB_PRIVATE.alloc(length * 16);
        HEAPU8[address + 12] = 7;
        HEAPU32[address / 4] = pointer;
        HEAPU32[(address + 4) / 4] = length;

        for (var i = 0; i < length; ++i) {
          Module.STDWEB_PRIVATE.from_js(pointer + i * 16, value[i]);
        }
      };

      Module.STDWEB_PRIVATE.from_js = function from_js(address, value) {
        var kind = Object.prototype.toString.call(value);

        if (kind === "[object String]") {
          var length = Module.STDWEB_PRIVATE.utf8_len(value);
          var pointer = 0;

          if (length > 0) {
            pointer = Module.STDWEB_PRIVATE.alloc(length);
            Module.STDWEB_PRIVATE.to_utf8(value, pointer);
          }

          HEAPU8[address + 12] = 4;
          HEAPU32[address / 4] = pointer;
          HEAPU32[(address + 4) / 4] = length;
        } else if (kind === "[object Number]") {
          if (value === (value | 0)) {
            HEAPU8[address + 12] = 2;
            HEAP32[address / 4] = value;
          } else {
            HEAPU8[address + 12] = 3;
            HEAPF64[address / 8] = value;
          }
        } else if (value === null) {
          HEAPU8[address + 12] = 1;
        } else if (value === undefined) {
          HEAPU8[address + 12] = 0;
        } else if (value === false) {
          HEAPU8[address + 12] = 5;
        } else if (value === true) {
          HEAPU8[address + 12] = 6;
        } else if (kind === "[object Symbol]") {
          var id = Module.STDWEB_PRIVATE.register_raw_value(value);
          HEAPU8[address + 12] = 15;
          HEAP32[address / 4] = id;
        } else {
          var refid = Module.STDWEB_PRIVATE.acquire_rust_reference(value);
          HEAPU8[address + 12] = 9;
          HEAP32[address / 4] = refid;
        }
      }; // This is ported from Rust's stdlib; it's faster than
      // the string conversion from Emscripten.


      Module.STDWEB_PRIVATE.to_js_string = function to_js_string(index, length) {
        index = index | 0;
        length = length | 0;
        var end = (index | 0) + (length | 0);
        var output = "";

        while (index < end) {
          var x = HEAPU8[index++];

          if (x < 128) {
            output += String.fromCharCode(x);
            continue;
          }

          var init = x & 0x7F >> 2;
          var y = 0;

          if (index < end) {
            y = HEAPU8[index++];
          }

          var ch = init << 6 | y & 63;

          if (x >= 0xE0) {
            var z = 0;

            if (index < end) {
              z = HEAPU8[index++];
            }

            var y_z = (y & 63) << 6 | z & 63;
            ch = init << 12 | y_z;

            if (x >= 0xF0) {
              var w = 0;

              if (index < end) {
                w = HEAPU8[index++];
              }

              ch = (init & 7) << 18 | (y_z << 6 | w & 63);
              output += String.fromCharCode(0xD7C0 + (ch >> 10));
              ch = 0xDC00 + (ch & 0x3FF);
            }
          }

          output += String.fromCharCode(ch);
          continue;
        }

        return output;
      };

      Module.STDWEB_PRIVATE.id_to_ref_map = {};
      Module.STDWEB_PRIVATE.id_to_refcount_map = {};
      Module.STDWEB_PRIVATE.ref_to_id_map = new WeakMap(); // Not all types can be stored in a WeakMap

      Module.STDWEB_PRIVATE.ref_to_id_map_fallback = new Map();
      Module.STDWEB_PRIVATE.last_refid = 1;
      Module.STDWEB_PRIVATE.id_to_raw_value_map = {};
      Module.STDWEB_PRIVATE.last_raw_value_id = 1;

      Module.STDWEB_PRIVATE.acquire_rust_reference = function (reference) {
        if (reference === undefined || reference === null) {
          return 0;
        }

        var id_to_refcount_map = Module.STDWEB_PRIVATE.id_to_refcount_map;
        var id_to_ref_map = Module.STDWEB_PRIVATE.id_to_ref_map;
        var ref_to_id_map = Module.STDWEB_PRIVATE.ref_to_id_map;
        var ref_to_id_map_fallback = Module.STDWEB_PRIVATE.ref_to_id_map_fallback;
        var refid = ref_to_id_map.get(reference);

        if (refid === undefined) {
          refid = ref_to_id_map_fallback.get(reference);
        }

        if (refid === undefined) {
          refid = Module.STDWEB_PRIVATE.last_refid++;

          try {
            ref_to_id_map.set(reference, refid);
          } catch (e) {
            ref_to_id_map_fallback.set(reference, refid);
          }
        }

        if (refid in id_to_ref_map) {
          id_to_refcount_map[refid]++;
        } else {
          id_to_ref_map[refid] = reference;
          id_to_refcount_map[refid] = 1;
        }

        return refid;
      };

      Module.STDWEB_PRIVATE.acquire_js_reference = function (refid) {
        return Module.STDWEB_PRIVATE.id_to_ref_map[refid];
      };

      Module.STDWEB_PRIVATE.increment_refcount = function (refid) {
        Module.STDWEB_PRIVATE.id_to_refcount_map[refid]++;
      };

      Module.STDWEB_PRIVATE.decrement_refcount = function (refid) {
        var id_to_refcount_map = Module.STDWEB_PRIVATE.id_to_refcount_map;

        if (0 == --id_to_refcount_map[refid]) {
          var id_to_ref_map = Module.STDWEB_PRIVATE.id_to_ref_map;
          var ref_to_id_map_fallback = Module.STDWEB_PRIVATE.ref_to_id_map_fallback;
          var reference = id_to_ref_map[refid];
          delete id_to_ref_map[refid];
          delete id_to_refcount_map[refid];
          ref_to_id_map_fallback.delete(reference);
        }
      };

      Module.STDWEB_PRIVATE.register_raw_value = function (value) {
        var id = Module.STDWEB_PRIVATE.last_raw_value_id++;
        Module.STDWEB_PRIVATE.id_to_raw_value_map[id] = value;
        return id;
      };

      Module.STDWEB_PRIVATE.unregister_raw_value = function (id) {
        delete Module.STDWEB_PRIVATE.id_to_raw_value_map[id];
      };

      Module.STDWEB_PRIVATE.get_raw_value = function (id) {
        return Module.STDWEB_PRIVATE.id_to_raw_value_map[id];
      };

      Module.STDWEB_PRIVATE.alloc = function alloc(size) {
        return Module.web_malloc(size);
      };

      Module.STDWEB_PRIVATE.dyncall = function (signature, ptr, args) {
        return Module.web_table.get(ptr).apply(null, args);
      }; // This is based on code from Emscripten's preamble.js.


      Module.STDWEB_PRIVATE.utf8_len = function utf8_len(str) {
        var len = 0;

        for (var i = 0; i < str.length; ++i) {
          // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
          // See http://unicode.org/faq/utf_bom.html#utf16-3
          var u = str.charCodeAt(i); // possibly a lead surrogate

          if (u >= 0xD800 && u <= 0xDFFF) {
            u = 0x10000 + ((u & 0x3FF) << 10) | str.charCodeAt(++i) & 0x3FF;
          }

          if (u <= 0x7F) {
            ++len;
          } else if (u <= 0x7FF) {
            len += 2;
          } else if (u <= 0xFFFF) {
            len += 3;
          } else if (u <= 0x1FFFFF) {
            len += 4;
          } else if (u <= 0x3FFFFFF) {
            len += 5;
          } else {
            len += 6;
          }
        }

        return len;
      };

      Module.STDWEB_PRIVATE.prepare_any_arg = function (value) {
        var arg = Module.STDWEB_PRIVATE.alloc(16);
        Module.STDWEB_PRIVATE.from_js(arg, value);
        return arg;
      };

      Module.STDWEB_PRIVATE.acquire_tmp = function (dummy) {
        var value = Module.STDWEB_PRIVATE.tmp;
        Module.STDWEB_PRIVATE.tmp = null;
        return value;
      };

      var HEAP8 = null;
      var HEAP16 = null;
      var HEAP32 = null;
      var HEAPU8 = null;
      var HEAPU16 = null;
      var HEAPU32 = null;
      var HEAPF32 = null;
      var HEAPF64 = null;
      Object.defineProperty(Module, 'exports', {
        value: {}
      });

      function __web_on_grow() {
        var buffer = Module.instance.exports.memory.buffer;
        HEAP8 = new Int8Array(buffer);
        HEAP16 = new Int16Array(buffer);
        HEAP32 = new Int32Array(buffer);
        HEAPU8 = new Uint8Array(buffer);
        HEAPU16 = new Uint16Array(buffer);
        HEAPU32 = new Uint32Array(buffer);
        HEAPF32 = new Float32Array(buffer);
        HEAPF64 = new Float64Array(buffer);
      }

      return {
        imports: {
          env: {
            "__extjs_de2896a7ccf316486788a4d0bc433c25d2f1a12b": function __extjs_de2896a7ccf316486788a4d0bc433c25d2f1a12b($0) {
              var r = Module.STDWEB_PRIVATE.acquire_js_reference($0);
              return r instanceof DOMException && r.name === "NotFoundError";
            },
            "__extjs_906f13b1e97c3e6e6996c62d7584c4917315426d": function __extjs_906f13b1e97c3e6e6996c62d7584c4917315426d($0) {
              var o = Module.STDWEB_PRIVATE.acquire_js_reference($0);
              return (o instanceof MouseEvent && o.type === "click") | 0;
            },
            "__extjs_80d6d56760c65e49b7be8b6b01c1ea861b046bf0": function __extjs_80d6d56760c65e49b7be8b6b01c1ea861b046bf0($0) {
              Module.STDWEB_PRIVATE.decrement_refcount($0);
            },
            "__extjs_496ebd7b1bc0e6eebd7206e8bee7671ea3b8006f": function __extjs_496ebd7b1bc0e6eebd7206e8bee7671ea3b8006f($0, $1, $2) {
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              $2 = Module.STDWEB_PRIVATE.to_js($2);
              Module.STDWEB_PRIVATE.from_js($0, function () {
                return $1.querySelector($2);
              }());
            },
            "__extjs_0a6ddb433f3bd369cfb4cf3832d4ed8b8c02a6bc": function __extjs_0a6ddb433f3bd369cfb4cf3832d4ed8b8c02a6bc($0) {
              var o = Module.STDWEB_PRIVATE.acquire_js_reference($0);
              return o instanceof Date | 0;
            },
            "__extjs_0e54fd9c163fcf648ce0a395fde4500fd167a40b": function __extjs_0e54fd9c163fcf648ce0a395fde4500fd167a40b($0) {
              var r = Module.STDWEB_PRIVATE.acquire_js_reference($0);
              return r instanceof DOMException && r.name === "InvalidCharacterError";
            },
            "__extjs_7c5535365a3df6a4cc1f59c4a957bfce1dbfb8ee": function __extjs_7c5535365a3df6a4cc1f59c4a957bfce1dbfb8ee($0, $1, $2, $3) {
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              $2 = Module.STDWEB_PRIVATE.to_js($2);
              $3 = Module.STDWEB_PRIVATE.to_js($3);
              Module.STDWEB_PRIVATE.from_js($0, function () {
                var listener = $1;
                $2.addEventListener($3, listener);
                return listener;
              }());
            },
            "__extjs_c023351d5bff43ef3dd317b499821cd4e71492f0": function __extjs_c023351d5bff43ef3dd317b499821cd4e71492f0($0) {
              var r = Module.STDWEB_PRIVATE.acquire_js_reference($0);
              return r instanceof DOMException && r.name === "HierarchyRequestError";
            },
            "__extjs_8dc3eee0077e1d4de8467d5817789266b81b33ad": function __extjs_8dc3eee0077e1d4de8467d5817789266b81b33ad($0, $1) {
              $0 = Module.STDWEB_PRIVATE.to_js($0);
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              $0.type = $1;
            },
            "__extjs_e5fb9179be14d883494f9afd3d5f19a87ee532cc": function __extjs_e5fb9179be14d883494f9afd3d5f19a87ee532cc($0, $1) {
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              Module.STDWEB_PRIVATE.from_js($0, function () {
                return $1.nextSibling;
              }());
            },
            "__extjs_351b27505bc97d861c3914c20421b6277babb53b": function __extjs_351b27505bc97d861c3914c20421b6277babb53b($0) {
              var o = Module.STDWEB_PRIVATE.acquire_js_reference($0);
              return o instanceof Node | 0;
            },
            "__extjs_792ff14631f0ebffafcf6ed24405be73234b64ba": function __extjs_792ff14631f0ebffafcf6ed24405be73234b64ba($0, $1) {
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              Module.STDWEB_PRIVATE.from_js($0, function () {
                return $1.classList;
              }());
            },
            "__extjs_5ecfd7ee5cecc8be26c1e6e3c90ce666901b547c": function __extjs_5ecfd7ee5cecc8be26c1e6e3c90ce666901b547c($0, $1) {
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              Module.STDWEB_PRIVATE.from_js($0, function () {
                return $1.error;
              }());
            },
            "__extjs_b26a87e444d448e2efeef401f8474b1886c40ae0": function __extjs_b26a87e444d448e2efeef401f8474b1886c40ae0($0, $1) {
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              Module.STDWEB_PRIVATE.from_js($0, function () {
                return $1.lastChild;
              }());
            },
            "__extjs_7e5e0af700270c95236d095748467db3ee37c15b": function __extjs_7e5e0af700270c95236d095748467db3ee37c15b($0, $1) {
              $0 = Module.STDWEB_PRIVATE.to_js($0);
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              $0.checked = $1;
            },
            "__extjs_8545f3ba2883a49a2afd23c48c5d24ef3f9b0071": function __extjs_8545f3ba2883a49a2afd23c48c5d24ef3f9b0071($0) {
              var o = Module.STDWEB_PRIVATE.acquire_js_reference($0);
              return o instanceof HTMLTextAreaElement | 0;
            },
            "__extjs_17fae95b6fea15ff7408dfb47803907bfa827e6f": function __extjs_17fae95b6fea15ff7408dfb47803907bfa827e6f($0) {
              Module.STDWEB_PRIVATE.from_js($0, function () {
                return new Date();
              }());
            },
            "__extjs_a342681e5c1e3fb0bdeac6e35d67bf944fcd4102": function __extjs_a342681e5c1e3fb0bdeac6e35d67bf944fcd4102($0, $1) {
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              Module.STDWEB_PRIVATE.from_js($0, function () {
                return $1.value;
              }());
            },
            "__extjs_a3b76c5b7916fd257ee3f362dc672b974e56c476": function __extjs_a3b76c5b7916fd257ee3f362dc672b974e56c476($0, $1) {
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              Module.STDWEB_PRIVATE.from_js($0, function () {
                return $1.success;
              }());
            },
            "__extjs_72fc447820458c720c68d0d8e078ede631edd723": function __extjs_72fc447820458c720c68d0d8e078ede631edd723($0, $1, $2) {
              console.error('Panic location:', Module.STDWEB_PRIVATE.to_js_string($0, $1) + ':' + $2);
            },
            "__extjs_9f22d4ca7bc938409787341b7db181f8dd41e6df": function __extjs_9f22d4ca7bc938409787341b7db181f8dd41e6df($0) {
              Module.STDWEB_PRIVATE.increment_refcount($0);
            },
            "__extjs_4cc2b2ed53586a2bd32ca2206724307e82bb32ff": function __extjs_4cc2b2ed53586a2bd32ca2206724307e82bb32ff($0, $1) {
              $0 = Module.STDWEB_PRIVATE.to_js($0);
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              $0.appendChild($1);
            },
            "__extjs_74e6b3628156d1f468b2cc770c3cd6665ca63ace": function __extjs_74e6b3628156d1f468b2cc770c3cd6665ca63ace($0, $1) {
              $0 = Module.STDWEB_PRIVATE.to_js($0);
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              $0.removeAttribute($1);
            },
            "__extjs_db0226ae1bbecd407e9880ee28ddc70fc3322d9c": function __extjs_db0226ae1bbecd407e9880ee28ddc70fc3322d9c($0) {
              $0 = Module.STDWEB_PRIVATE.to_js($0);
              Module.STDWEB_PRIVATE.unregister_raw_value($0);
            },
            "__extjs_dc2fd915bd92f9e9c6a3bd15174f1414eee3dbaf": function __extjs_dc2fd915bd92f9e9c6a3bd15174f1414eee3dbaf() {
              console.error('Encountered a panic!');
            },
            "__extjs_6f51f0b44c631249716842270f5556e750e55ead": function __extjs_6f51f0b44c631249716842270f5556e750e55ead($0, $1) {
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              Module.STDWEB_PRIVATE.from_js($0, function () {
                return $1.toString();
              }());
            },
            "__extjs_1c8769c3b326d77ceb673ada3dc887cf1d509509": function __extjs_1c8769c3b326d77ceb673ada3dc887cf1d509509($0) {
              Module.STDWEB_PRIVATE.from_js($0, function () {
                return document;
              }());
            },
            "__extjs_02719998c6ece772fc2c8c3dd585272cdb2a127e": function __extjs_02719998c6ece772fc2c8c3dd585272cdb2a127e($0, $1) {
              $0 = Module.STDWEB_PRIVATE.to_js($0);
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              $0.add($1);
            },
            "__extjs_2ff57da66ea0e6d13328bc60a5a5dbfee840cbf2": function __extjs_2ff57da66ea0e6d13328bc60a5a5dbfee840cbf2($0, $1, $2) {
              $0 = Module.STDWEB_PRIVATE.to_js($0);
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              $2 = Module.STDWEB_PRIVATE.to_js($2);
              var listener = $0;
              $1.removeEventListener($2, listener);
              listener.drop();
            },
            "__extjs_4f184f99dbb48468f75bc10e9fc4b1707e193775": function __extjs_4f184f99dbb48468f75bc10e9fc4b1707e193775($0, $1, $2) {
              $0 = Module.STDWEB_PRIVATE.to_js($0);
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              $2 = Module.STDWEB_PRIVATE.to_js($2);
              $0.setAttribute($1, $2);
            },
            "__extjs_4077c66de83a520233f5f35f5a8f3073f5bac5fc": function __extjs_4077c66de83a520233f5f35f5a8f3073f5bac5fc($0, $1, $2, $3) {
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              $2 = Module.STDWEB_PRIVATE.to_js($2);
              $3 = Module.STDWEB_PRIVATE.to_js($3);
              Module.STDWEB_PRIVATE.from_js($0, function () {
                try {
                  return {
                    value: function () {
                      return $1.insertBefore($2, $3);
                    }(),
                    success: true
                  };
                } catch (error) {
                  return {
                    error: error,
                    success: false
                  };
                }
              }());
            },
            "__extjs_4028145202a86da6f0ee9067e044568730858725": function __extjs_4028145202a86da6f0ee9067e044568730858725($0) {
              $0 = Module.STDWEB_PRIVATE.to_js($0);
              $0.type = "";
            },
            "__extjs_b79ab773ae35a43a8d7a215353fdb0413bd6224c": function __extjs_b79ab773ae35a43a8d7a215353fdb0413bd6224c($0, $1) {
              $0 = Module.STDWEB_PRIVATE.to_js($0);
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              $0.nodeValue = $1;
            },
            "__extjs_f167788c39e80562a6972017cda9ecd6bb91dba7": function __extjs_f167788c39e80562a6972017cda9ecd6bb91dba7($0, $1, $2) {
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              $2 = Module.STDWEB_PRIVATE.to_js($2);
              Module.STDWEB_PRIVATE.from_js($0, function () {
                try {
                  return {
                    value: function () {
                      return $1.createElement($2);
                    }(),
                    success: true
                  };
                } catch (error) {
                  return {
                    error: error,
                    success: false
                  };
                }
              }());
            },
            "__extjs_e031828dc4b7f1b8d9625d60486f03b0936c3f4f": function __extjs_e031828dc4b7f1b8d9625d60486f03b0936c3f4f($0, $1, $2) {
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              $2 = Module.STDWEB_PRIVATE.to_js($2);
              Module.STDWEB_PRIVATE.from_js($0, function () {
                try {
                  return {
                    value: function () {
                      return $1.removeChild($2);
                    }(),
                    success: true
                  };
                } catch (error) {
                  return {
                    error: error,
                    success: false
                  };
                }
              }());
            },
            "__extjs_352943ae98b2eeb817e36305c3531d61c7e1a52b": function __extjs_352943ae98b2eeb817e36305c3531d61c7e1a52b($0) {
              var o = Module.STDWEB_PRIVATE.acquire_js_reference($0);
              return o instanceof Element | 0;
            },
            "__extjs_97495987af1720d8a9a923fa4683a7b683e3acd6": function __extjs_97495987af1720d8a9a923fa4683a7b683e3acd6($0, $1) {
              console.error('Panic error message:', Module.STDWEB_PRIVATE.to_js_string($0, $1));
            },
            "__extjs_cb392b71162553130760deeb3964fa828c078f74": function __extjs_cb392b71162553130760deeb3964fa828c078f74($0) {
              var o = Module.STDWEB_PRIVATE.acquire_js_reference($0);
              return o instanceof HTMLInputElement | 0;
            },
            "__extjs_dc4a9844a3da9e83cb7a74b4e08eed6ff1be91f9": function __extjs_dc4a9844a3da9e83cb7a74b4e08eed6ff1be91f9($0, $1, $2) {
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              $2 = Module.STDWEB_PRIVATE.to_js($2);
              Module.STDWEB_PRIVATE.from_js($0, function () {
                return $1.createTextNode($2);
              }());
            },
            "__extjs_4f998a6a2e8abfce697424379bb997930abe9f9e": function __extjs_4f998a6a2e8abfce697424379bb997930abe9f9e($0, $1) {
              $0 = Module.STDWEB_PRIVATE.to_js($0);
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              $0.value = $1;
            },
            "__extjs_aafcab8f69692c3778f32d5ffbed6214b6ecf266": function __extjs_aafcab8f69692c3778f32d5ffbed6214b6ecf266($0) {
              $0 = Module.STDWEB_PRIVATE.to_js($0);
              $0.stopPropagation();
            },
            "__extjs_0aced9e2351ced72f1ff99645a129132b16c0d3c": function __extjs_0aced9e2351ced72f1ff99645a129132b16c0d3c($0) {
              var value = Module.STDWEB_PRIVATE.get_raw_value($0);
              return Module.STDWEB_PRIVATE.register_raw_value(value);
            },
            "__extjs_da7526dacc33bb6de7714dde287806f568820e31": function __extjs_da7526dacc33bb6de7714dde287806f568820e31($0) {
              $0 = Module.STDWEB_PRIVATE.to_js($0);
              console.log($0);
            },
            "__extjs_ff5103e6cc179d13b4c7a785bdce2708fd559fc0": function __extjs_ff5103e6cc179d13b4c7a785bdce2708fd559fc0($0) {
              Module.STDWEB_PRIVATE.tmp = Module.STDWEB_PRIVATE.to_js($0);
            },
            "__extjs_3fdba5930b45aa718ed8a660c7a88a76e22a21d8": function __extjs_3fdba5930b45aa718ed8a660c7a88a76e22a21d8($0, $1) {
              $0 = Module.STDWEB_PRIVATE.to_js($0);
              $1 = Module.STDWEB_PRIVATE.to_js($1);
              $0.remove($1);
            },
            "__web_on_grow": __web_on_grow
          }
        },
        initialize: function initialize(instance) {
          Object.defineProperty(Module, 'instance', {
            value: instance
          });
          Object.defineProperty(Module, 'web_malloc', {
            value: Module.instance.exports.__web_malloc
          });
          Object.defineProperty(Module, 'web_free', {
            value: Module.instance.exports.__web_free
          });
          Object.defineProperty(Module, 'web_table', {
            value: Module.instance.exports.__web_table
          });

          Module.exports.start = function start() {
            Module.instance.exports.start();
          };

          __web_on_grow();

          Module.instance.exports.main();
          return Module.exports;
        }
      };
    });
  }

  return fetch(bundle).then(function (response) {
    return response.arrayBuffer();
  }).then(function (bytes) {
    return WebAssembly.compile(bytes);
  }).then(function (mod) {
    return __initialize(mod, true);
  });
};
},{}],"../.cache/.cargo-web/bundle-loader-41b9cbbdea6b822cf6177c172f2991d8.js":[function(require,module,exports) {
module.exports = function (bundle) {
  console.log(bundle);

  var loader = require("./loader-41b9cbbdea6b822cf6177c172f2991d8.js");

  return loader(bundle);
};
},{"./loader-41b9cbbdea6b822cf6177c172f2991d8.js":"../.cache/.cargo-web/loader-41b9cbbdea6b822cf6177c172f2991d8.js"}],0:[function(require,module,exports) {
var b=require("../node_modules/parcel-bundler/src/builtins/bundle-loader.js");b.register("cargo-web-41b9cbbdea6b822cf6177c172f2991d8",require("../.cache/.cargo-web/bundle-loader-41b9cbbdea6b822cf6177c172f2991d8.js"));b.load([["Cargo.b57a52df.cargo-web-41b9cbbdea6b822cf6177c172f2991d8","../Cargo.toml"]]).then(function(){require("web/index.js");});
},{}]},{},[0], null)
//# sourceMappingURL=/web.06958f69.map