import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import destr from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/destr/dist/index.mjs';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestURL, setResponseStatus, getResponseHeader, setResponseHeaders, send, getRequestHeader, removeResponseHeader, createError, appendResponseHeader, setResponseHeader, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/nitropack/node_modules/h3/dist/index.mjs';
import { createHooks } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/hookable/dist/index.mjs';
import { createFetch, Headers as Headers$1 } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/ofetch/dist/node.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/node-mock-http/dist/index.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, decodePath, withLeadingSlash, withoutTrailingSlash } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/ufo/dist/index.mjs';
import { createStorage, prefixStorage } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/unstorage/drivers/fs.mjs';
import unstorage_47drivers_47fs_45lite from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/unstorage/drivers/fs-lite.mjs';
import { digest } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/ohash/dist/index.mjs';
import { klona } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/klona/dist/index.mjs';
import defu, { defuFn } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/defu/dist/defu.mjs';
import { snakeCase } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/scule/dist/index.mjs';
import { AsyncLocalStorage } from 'node:async_hooks';
import { getContext } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/unctx/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/radix3/dist/index.mjs';
import _P3TxyfIncW3pyiQuUjbHbggDyqdKoaDIft6seLqQ9O4 from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/vinxi/lib/app-fetch.js';
import _zRA2fg9gtm5UXPgzB5twYHRHo3e4oKv5oC0yhig6Ym0 from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/vinxi/lib/app-manifest.js';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/pathe/dist/index.mjs';
import { parseSetCookie } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/cookie-es/dist/index.mjs';
import { sharedConfig, lazy, createComponent, catchError, onCleanup } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/solid-js/dist/server.js';
import { renderToString, isServer, getRequestEvent, ssrElement, escape, mergeProps, ssr, createComponent as createComponent$1, ssrHydrationKey, NoHydration, ssrAttribute } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/solid-js/web/dist/server.js';
import { provideRequestEvent } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/solid-js/web/storage/dist/storage.js';
import { eventHandler as eventHandler$1, H3Event, getRequestIP, parseCookies, getResponseStatus, getResponseStatusText, getCookie, setCookie, getResponseHeader as getResponseHeader$1, setResponseHeader as setResponseHeader$1, removeResponseHeader as removeResponseHeader$1, getResponseHeaders, getRequestURL as getRequestURL$1, getRequestWebStream, setResponseStatus as setResponseStatus$1, appendResponseHeader as appendResponseHeader$1, setHeader, sendRedirect as sendRedirect$1 } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/h3/dist/index.mjs';
import { fromJSON, Feature, crossSerializeStream, getCrossReferenceHeader, toCrossJSONStream } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/seroval/dist/esm/production/index.mjs';
import { AbortSignalPlugin, CustomEventPlugin, DOMExceptionPlugin, EventPlugin, FormDataPlugin, HeadersPlugin, ReadableStreamPlugin, RequestPlugin, ResponsePlugin, URLSearchParamsPlugin, URLPlugin } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/seroval-plugins/dist/esm/production/web.mjs';

const serverAssets = [{"baseName":"server","dir":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/assets"}];

const assets$1 = createStorage();

for (const asset of serverAssets) {
  assets$1.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));
storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs"}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs"}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/.vinxi"}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/.vinxi/cache"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const inlineAppConfig = {};



const appConfig$1 = defuFn(inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": ""
  },
  "nitro": {
    "routeRules": {
      "/_build/assets/**": {
        "headers": {
          "cache-control": "public, immutable, max-age=31536000"
        }
      }
    }
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  {
    return _sharedRuntimeConfig;
  }
}
_deepFreeze(klona(appConfig$1));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const nitroAsyncContext = getContext("nitro-app", {
  asyncContext: true,
  AsyncLocalStorage: AsyncLocalStorage 
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$0 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const appConfig = {"name":"vinxi","routers":[{"name":"public","type":"static","base":"/","dir":"./public","root":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs","order":0,"outDir":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/.vinxi/build/public"},{"name":"ssr","type":"http","link":{"client":"client"},"handler":"src/entry-server.tsx","extensions":["js","jsx","ts","tsx"],"target":"server","root":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs","base":"/","outDir":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/.vinxi/build/ssr","order":1},{"name":"client","type":"client","base":"/_build","handler":"src/entry-client.tsx","extensions":["js","jsx","ts","tsx"],"target":"browser","root":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs","outDir":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/.vinxi/build/client","order":2},{"name":"server-fns","type":"http","base":"/_server","handler":"node_modules/@solidjs/start/dist/runtime/server-handler.js","target":"server","root":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs","outDir":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/.vinxi/build/server-fns","order":3}],"server":{"compressPublicAssets":{"brotli":true},"routeRules":{"/_build/assets/**":{"headers":{"cache-control":"public, immutable, max-age=31536000"}}},"experimental":{"asyncContext":true},"baseURL":"","static":true,"prerender":{}},"root":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs"};
					const buildManifest = {"ssr":{"virtual:$vinxi/handler/ssr":{"file":"ssr.js","name":"ssr","src":"virtual:$vinxi/handler/ssr","isEntry":true}},"client":{"_CodeBlock-DvmZD-ip.js":{"file":"assets/CodeBlock-DvmZD-ip.js","name":"CodeBlock","imports":["_routing-U_PwxrrZ.js"]},"_Layout-BrJ7nKKA.js":{"file":"assets/Layout-BrJ7nKKA.js","name":"Layout","imports":["_routing-U_PwxrrZ.js"]},"_routing-U_PwxrrZ.js":{"file":"assets/routing-U_PwxrrZ.js","name":"routing"},"src/routes/api/pykeyboard.tsx?pick=default&pick=$css":{"file":"assets/pykeyboard-WPASDAak.js","name":"pykeyboard","src":"src/routes/api/pykeyboard.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js"]},"src/routes/api/pyrogram-patch.tsx?pick=default&pick=$css":{"file":"assets/pyrogram-patch-B03OFwOm.js","name":"pyrogram-patch","src":"src/routes/api/pyrogram-patch.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js"]},"src/routes/getting-started.tsx?pick=default&pick=$css":{"file":"assets/getting-started-DIuE3GQW.js","name":"getting-started","src":"src/routes/getting-started.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/index.tsx?pick=default&pick=$css":{"file":"assets/index-jf7zc1Ba.js","name":"index","src":"src/routes/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js"]},"src/routes/kurigram-addons/client.tsx?pick=default&pick=$css":{"file":"assets/client-rr21uo7a.js","name":"client","src":"src/routes/kurigram-addons/client.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/kurigram-addons/command-parser.tsx?pick=default&pick=$css":{"file":"assets/command-parser-BYrNaVn5.js","name":"command-parser","src":"src/routes/kurigram-addons/command-parser.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/kurigram-addons/conversation.tsx?pick=default&pick=$css":{"file":"assets/conversation-DCR30KZM.js","name":"conversation","src":"src/routes/kurigram-addons/conversation.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/kurigram-addons/depends.tsx?pick=default&pick=$css":{"file":"assets/depends-DGH-51cw.js","name":"depends","src":"src/routes/kurigram-addons/depends.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/kurigram-addons/flood-wait.tsx?pick=default&pick=$css":{"file":"assets/flood-wait-CEwfar7Q.js","name":"flood-wait","src":"src/routes/kurigram-addons/flood-wait.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/kurigram-addons/index.tsx?pick=default&pick=$css":{"file":"assets/index-BTZAuau-.js","name":"index","src":"src/routes/kurigram-addons/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/kurigram-addons/lifecycle-hooks.tsx?pick=default&pick=$css":{"file":"assets/lifecycle-hooks-DLuZxD6b.js","name":"lifecycle-hooks","src":"src/routes/kurigram-addons/lifecycle-hooks.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/kurigram-addons/menu.tsx?pick=default&pick=$css":{"file":"assets/menu-_TpGTvSt.js","name":"menu","src":"src/routes/kurigram-addons/menu.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/kurigram-addons/rate-limit.tsx?pick=default&pick=$css":{"file":"assets/rate-limit-Du98SOtC.js","name":"rate-limit","src":"src/routes/kurigram-addons/rate-limit.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/migration.tsx?pick=default&pick=$css":{"file":"assets/migration-CFKTErgm.js","name":"migration","src":"src/routes/migration.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pykeyboard/builder.tsx?pick=default&pick=$css":{"file":"assets/builder-0QYwshvB.js","name":"builder","src":"src/routes/pykeyboard/builder.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pykeyboard/factory.tsx?pick=default&pick=$css":{"file":"assets/factory-C5keHo4B.js","name":"factory","src":"src/routes/pykeyboard/factory.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pykeyboard/hooks.tsx?pick=default&pick=$css":{"file":"assets/hooks-CMr2SSfS.js","name":"hooks","src":"src/routes/pykeyboard/hooks.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pykeyboard/index.tsx?pick=default&pick=$css":{"file":"assets/index-egAYZviI.js","name":"index","src":"src/routes/pykeyboard/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pykeyboard/inline-keyboard.tsx?pick=default&pick=$css":{"file":"assets/inline-keyboard-pFGWUOH7.js","name":"inline-keyboard","src":"src/routes/pykeyboard/inline-keyboard.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pykeyboard/languages.tsx?pick=default&pick=$css":{"file":"assets/languages-BbP_3f3D.js","name":"languages","src":"src/routes/pykeyboard/languages.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pykeyboard/pagination.tsx?pick=default&pick=$css":{"file":"assets/pagination-CgzIlD5a.js","name":"pagination","src":"src/routes/pykeyboard/pagination.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pykeyboard/reply-keyboard.tsx?pick=default&pick=$css":{"file":"assets/reply-keyboard-CwDCdpwu.js","name":"reply-keyboard","src":"src/routes/pykeyboard/reply-keyboard.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pykeyboard/utilities.tsx?pick=default&pick=$css":{"file":"assets/utilities-C8-QN4_T.js","name":"utilities","src":"src/routes/pykeyboard/utilities.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pyrogram-patch/circuit-breaker.tsx?pick=default&pick=$css":{"file":"assets/circuit-breaker-B68-0PqX.js","name":"circuit-breaker","src":"src/routes/pyrogram-patch/circuit-breaker.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js"]},"src/routes/pyrogram-patch/configuration.tsx?pick=default&pick=$css":{"file":"assets/configuration-C9_lrOg7.js","name":"configuration","src":"src/routes/pyrogram-patch/configuration.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js"]},"src/routes/pyrogram-patch/errors.tsx?pick=default&pick=$css":{"file":"assets/errors-BT2szhhJ.js","name":"errors","src":"src/routes/pyrogram-patch/errors.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pyrogram-patch/fsm/filters.tsx?pick=default&pick=$css":{"file":"assets/filters-CNM9OnV7.js","name":"filters","src":"src/routes/pyrogram-patch/fsm/filters.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pyrogram-patch/fsm/index.tsx?pick=default&pick=$css":{"file":"assets/index-7hOOUTjg.js","name":"index","src":"src/routes/pyrogram-patch/fsm/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pyrogram-patch/fsm/states.tsx?pick=default&pick=$css":{"file":"assets/states-CsZuP59d.js","name":"states","src":"src/routes/pyrogram-patch/fsm/states.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pyrogram-patch/index.tsx?pick=default&pick=$css":{"file":"assets/index-CxqScmAb.js","name":"index","src":"src/routes/pyrogram-patch/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pyrogram-patch/middleware/fsm-inject.tsx?pick=default&pick=$css":{"file":"assets/fsm-inject-Bjxlc9f-.js","name":"fsm-inject","src":"src/routes/pyrogram-patch/middleware/fsm-inject.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pyrogram-patch/middleware/index.tsx?pick=default&pick=$css":{"file":"assets/index-CUT9LpEF.js","name":"index","src":"src/routes/pyrogram-patch/middleware/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pyrogram-patch/middleware/rate-limit.tsx?pick=default&pick=$css":{"file":"assets/rate-limit-BFmdz04W.js","name":"rate-limit","src":"src/routes/pyrogram-patch/middleware/rate-limit.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pyrogram-patch/middleware/writing.tsx?pick=default&pick=$css":{"file":"assets/writing-hAiAynWx.js","name":"writing","src":"src/routes/pyrogram-patch/middleware/writing.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pyrogram-patch/patch-helper.tsx?pick=default&pick=$css":{"file":"assets/patch-helper-DqIU0riQ.js","name":"patch-helper","src":"src/routes/pyrogram-patch/patch-helper.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pyrogram-patch/patching.tsx?pick=default&pick=$css":{"file":"assets/patching-BqyXddZ7.js","name":"patching","src":"src/routes/pyrogram-patch/patching.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pyrogram-patch/router.tsx?pick=default&pick=$css":{"file":"assets/router-Bjw-3AHc.js","name":"router","src":"src/routes/pyrogram-patch/router.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pyrogram-patch/storage/custom.tsx?pick=default&pick=$css":{"file":"assets/custom-C6GgmEPN.js","name":"custom","src":"src/routes/pyrogram-patch/storage/custom.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pyrogram-patch/storage/index.tsx?pick=default&pick=$css":{"file":"assets/index-CrgZBvZS.js","name":"index","src":"src/routes/pyrogram-patch/storage/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pyrogram-patch/storage/memory.tsx?pick=default&pick=$css":{"file":"assets/memory-IuJqlSkP.js","name":"memory","src":"src/routes/pyrogram-patch/storage/memory.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"src/routes/pyrogram-patch/storage/redis.tsx?pick=default&pick=$css":{"file":"assets/redis-DLSMtCac.js","name":"redis","src":"src/routes/pyrogram-patch/storage/redis.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-U_PwxrrZ.js","_Layout-BrJ7nKKA.js","_CodeBlock-DvmZD-ip.js"]},"virtual:$vinxi/handler/client":{"file":"assets/client-CjHbS_I_.js","name":"client","src":"virtual:$vinxi/handler/client","isEntry":true,"imports":["_routing-U_PwxrrZ.js"],"dynamicImports":["src/routes/api/pykeyboard.tsx?pick=default&pick=$css","src/routes/api/pyrogram-patch.tsx?pick=default&pick=$css","src/routes/getting-started.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/kurigram-addons/client.tsx?pick=default&pick=$css","src/routes/kurigram-addons/command-parser.tsx?pick=default&pick=$css","src/routes/kurigram-addons/conversation.tsx?pick=default&pick=$css","src/routes/kurigram-addons/depends.tsx?pick=default&pick=$css","src/routes/kurigram-addons/flood-wait.tsx?pick=default&pick=$css","src/routes/kurigram-addons/index.tsx?pick=default&pick=$css","src/routes/kurigram-addons/lifecycle-hooks.tsx?pick=default&pick=$css","src/routes/kurigram-addons/menu.tsx?pick=default&pick=$css","src/routes/kurigram-addons/rate-limit.tsx?pick=default&pick=$css","src/routes/migration.tsx?pick=default&pick=$css","src/routes/pykeyboard/builder.tsx?pick=default&pick=$css","src/routes/pykeyboard/factory.tsx?pick=default&pick=$css","src/routes/pykeyboard/hooks.tsx?pick=default&pick=$css","src/routes/pykeyboard/index.tsx?pick=default&pick=$css","src/routes/pykeyboard/inline-keyboard.tsx?pick=default&pick=$css","src/routes/pykeyboard/languages.tsx?pick=default&pick=$css","src/routes/pykeyboard/pagination.tsx?pick=default&pick=$css","src/routes/pykeyboard/reply-keyboard.tsx?pick=default&pick=$css","src/routes/pykeyboard/utilities.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/circuit-breaker.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/configuration.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/errors.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/filters.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/states.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/fsm-inject.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/rate-limit.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/writing.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/patch-helper.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/patching.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/router.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/custom.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/memory.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/redis.tsx?pick=default&pick=$css"],"css":["assets/client-DD26M0Lu.css"]}},"server-fns":{"_server-fns-CyLW3zhz.js":{"file":"assets/server-fns-CyLW3zhz.js","name":"server-fns","dynamicImports":["src/app.tsx"]},"src/app.tsx":{"file":"assets/app-DoraYe4b.js","name":"app","src":"src/app.tsx","isDynamicEntry":true,"imports":["_server-fns-CyLW3zhz.js"],"css":["assets/app-DD26M0Lu.css"]},"virtual:$vinxi/handler/server-fns":{"file":"server-fns.js","name":"server-fns","src":"virtual:$vinxi/handler/server-fns","isEntry":true,"imports":["_server-fns-CyLW3zhz.js"]}}};

					const routeManifest = {"ssr":{},"client":{},"server-fns":{}};

        function createProdApp(appConfig) {
          return {
            config: { ...appConfig, buildManifest, routeManifest },
            getRouter(name) {
              return appConfig.routers.find(router => router.name === name)
            }
          }
        }

        function plugin(app) {
          const prodApp = createProdApp(appConfig);
          globalThis.app = prodApp;
        }

const chunks = {};
			 



			 function app() {
				 globalThis.$$chunks = chunks;
			 }

const plugins = [
  plugin,
_P3TxyfIncW3pyiQuUjbHbggDyqdKoaDIft6seLqQ9O4,
_zRA2fg9gtm5UXPgzB5twYHRHo3e4oKv5oC0yhig6Ym0,
app
];

const assets = {
  "/_build/.vite/manifest.json.br": {
    "type": "application/json",
    "encoding": "br",
    "etag": "\"57c-cQVckFl+WJM7Zn3vfd/2Q8HHeGg\"",
    "mtime": "2026-03-04T15:43:16.120Z",
    "size": 1404,
    "path": "../../.output/public/_build/.vite/manifest.json.br"
  },
  "/_build/.vite/manifest.json": {
    "type": "application/json",
    "encoding": null,
    "etag": "\"4aa7-BE0BAAiErWtV+r4hyNdJP/XAcTc\"",
    "mtime": "2026-03-04T15:43:15.986Z",
    "size": 19111,
    "path": "../../.output/public/_build/.vite/manifest.json"
  },
  "/_build/.vite/manifest.json.gz": {
    "type": "application/json",
    "encoding": "gzip",
    "etag": "\"657-/WowIxDW17HfITjGazB1K6mmM8o\"",
    "mtime": "2026-03-04T15:43:16.120Z",
    "size": 1623,
    "path": "../../.output/public/_build/.vite/manifest.json.gz"
  },
  "/_server/assets/app-DD26M0Lu.css": {
    "type": "text/css; charset=utf-8",
    "encoding": null,
    "etag": "\"758b-WVlds5/xw9/oXYNP4gd1us6ZIwA\"",
    "mtime": "2026-03-04T15:43:15.994Z",
    "size": 30091,
    "path": "../../.output/public/_server/assets/app-DD26M0Lu.css"
  },
  "/logo.png": {
    "type": "image/png",
    "etag": "\"10db3-gqpM2ZeOYwRGAI2EkYd2381jL4A\"",
    "mtime": "2026-03-04T15:43:15.968Z",
    "size": 69043,
    "path": "../../.output/public/logo.png"
  },
  "/_server/assets/app-DD26M0Lu.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1617-biFIpxWeM4ax+Xbq9HPrJzlH62c\"",
    "mtime": "2026-03-04T15:43:16.178Z",
    "size": 5655,
    "path": "../../.output/public/_server/assets/app-DD26M0Lu.css.br"
  },
  "/_server/assets/app-DD26M0Lu.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"194b-IQm565iV6oORnMgXQGjiU6Qxec8\"",
    "mtime": "2026-03-04T15:43:16.119Z",
    "size": 6475,
    "path": "../../.output/public/_server/assets/app-DD26M0Lu.css.gz"
  },
  "/_build/assets/CodeBlock-DvmZD-ip.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"699-uBubT87Ik3AtnWjyb6ySeXQ33T0\"",
    "mtime": "2026-03-04T15:43:15.987Z",
    "size": 1689,
    "path": "../../.output/public/_build/assets/CodeBlock-DvmZD-ip.js"
  },
  "/_build/assets/CodeBlock-DvmZD-ip.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"2e3-0gn8y40iD9+9+aNc+50fOwCJreM\"",
    "mtime": "2026-03-04T15:43:16.120Z",
    "size": 739,
    "path": "../../.output/public/_build/assets/CodeBlock-DvmZD-ip.js.br"
  },
  "/_build/assets/Layout-BrJ7nKKA.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"32ed-/EcPchTMIQlX3ParT2eIRE2w+Vc\"",
    "mtime": "2026-03-04T15:43:15.990Z",
    "size": 13037,
    "path": "../../.output/public/_build/assets/Layout-BrJ7nKKA.js"
  },
  "/_build/assets/CodeBlock-DvmZD-ip.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"35b-ley7yWAoziGKAQPrGLIvENerIQs\"",
    "mtime": "2026-03-04T15:43:16.120Z",
    "size": 859,
    "path": "../../.output/public/_build/assets/CodeBlock-DvmZD-ip.js.gz"
  },
  "/_build/assets/Layout-BrJ7nKKA.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"ebf-O665wsTvPVSH/ljohYyPU2nTOTU\"",
    "mtime": "2026-03-04T15:43:16.127Z",
    "size": 3775,
    "path": "../../.output/public/_build/assets/Layout-BrJ7nKKA.js.br"
  },
  "/_build/assets/builder-0QYwshvB.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"d45-Bnan8ObFEXGD/x7Ik7b+g862q54\"",
    "mtime": "2026-03-04T15:43:15.988Z",
    "size": 3397,
    "path": "../../.output/public/_build/assets/builder-0QYwshvB.js"
  },
  "/_build/assets/builder-0QYwshvB.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"3cc-0RjzaMfYQV7CKwsWOeoVC20TuEQ\"",
    "mtime": "2026-03-04T15:43:16.120Z",
    "size": 972,
    "path": "../../.output/public/_build/assets/builder-0QYwshvB.js.br"
  },
  "/_build/assets/Layout-BrJ7nKKA.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"10d9-oD1IknyBl5IdKyHv5yS7OJdPQQg\"",
    "mtime": "2026-03-04T15:43:16.120Z",
    "size": 4313,
    "path": "../../.output/public/_build/assets/Layout-BrJ7nKKA.js.gz"
  },
  "/_build/assets/builder-0QYwshvB.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"470-ZhvVnVxcb19kAXRv6USAMTV7qtw\"",
    "mtime": "2026-03-04T15:43:16.120Z",
    "size": 1136,
    "path": "../../.output/public/_build/assets/builder-0QYwshvB.js.gz"
  },
  "/_build/assets/circuit-breaker-B68-0PqX.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"87e-W/YAeLABEFgM6fQbegEEcOMqW6k\"",
    "mtime": "2026-03-04T15:43:15.986Z",
    "size": 2174,
    "path": "../../.output/public/_build/assets/circuit-breaker-B68-0PqX.js"
  },
  "/_build/assets/circuit-breaker-B68-0PqX.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"306-l4nl1LOp4vGUblDz9ZG1FzIR/8Y\"",
    "mtime": "2026-03-04T15:43:16.120Z",
    "size": 774,
    "path": "../../.output/public/_build/assets/circuit-breaker-B68-0PqX.js.br"
  },
  "/_build/assets/circuit-breaker-B68-0PqX.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"3c6-bmAYOaixsqgcKog9SxyjPkiroso\"",
    "mtime": "2026-03-04T15:43:16.120Z",
    "size": 966,
    "path": "../../.output/public/_build/assets/circuit-breaker-B68-0PqX.js.gz"
  },
  "/_build/assets/client-CjHbS_I_.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"8176-frkU5qRU5ratjjXTlP3VY+cnZqM\"",
    "mtime": "2026-03-04T15:43:15.988Z",
    "size": 33142,
    "path": "../../.output/public/_build/assets/client-CjHbS_I_.js"
  },
  "/_build/assets/client-CjHbS_I_.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"1af4-SbIqzgtidWgzYjZ18FKUVleLjOs\"",
    "mtime": "2026-03-04T15:43:16.251Z",
    "size": 6900,
    "path": "../../.output/public/_build/assets/client-CjHbS_I_.js.br"
  },
  "/_build/assets/client-CjHbS_I_.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1f00-yUE91jrG8GCmJsYgJqy3WFkmPDs\"",
    "mtime": "2026-03-04T15:43:16.122Z",
    "size": 7936,
    "path": "../../.output/public/_build/assets/client-CjHbS_I_.js.gz"
  },
  "/_build/assets/client-DD26M0Lu.css": {
    "type": "text/css; charset=utf-8",
    "encoding": null,
    "etag": "\"758b-WVlds5/xw9/oXYNP4gd1us6ZIwA\"",
    "mtime": "2026-03-04T15:43:15.988Z",
    "size": 30091,
    "path": "../../.output/public/_build/assets/client-DD26M0Lu.css"
  },
  "/_build/assets/client-DD26M0Lu.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1617-biFIpxWeM4ax+Xbq9HPrJzlH62c\"",
    "mtime": "2026-03-04T15:43:16.285Z",
    "size": 5655,
    "path": "../../.output/public/_build/assets/client-DD26M0Lu.css.br"
  },
  "/_build/assets/client-DD26M0Lu.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"194b-IQm565iV6oORnMgXQGjiU6Qxec8\"",
    "mtime": "2026-03-04T15:43:16.127Z",
    "size": 6475,
    "path": "../../.output/public/_build/assets/client-DD26M0Lu.css.gz"
  },
  "/_build/assets/client-rr21uo7a.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"fef-jLt094tbK+DnRCfXU7pYcJcVAks\"",
    "mtime": "2026-03-04T15:43:15.988Z",
    "size": 4079,
    "path": "../../.output/public/_build/assets/client-rr21uo7a.js"
  },
  "/_build/assets/command-parser-BYrNaVn5.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"e7f-D+NKSiwk8iVfDLIeEFZ4Y8Aj2x8\"",
    "mtime": "2026-03-04T15:43:15.988Z",
    "size": 3711,
    "path": "../../.output/public/_build/assets/command-parser-BYrNaVn5.js"
  },
  "/_build/assets/client-rr21uo7a.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"548-tlZpCBJJW9XbXUBhr3KQgrKrDKk\"",
    "mtime": "2026-03-04T15:43:16.178Z",
    "size": 1352,
    "path": "../../.output/public/_build/assets/client-rr21uo7a.js.gz"
  },
  "/_build/assets/command-parser-BYrNaVn5.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"49f-1SF1W/hssgKcn2hjZSEF1JytltQ\"",
    "mtime": "2026-03-04T15:43:16.178Z",
    "size": 1183,
    "path": "../../.output/public/_build/assets/command-parser-BYrNaVn5.js.br"
  },
  "/_build/assets/configuration-C9_lrOg7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3f6-gq6s2gzXAUz2k9ZrlVGCKAZj0as\"",
    "mtime": "2026-03-04T15:43:15.987Z",
    "size": 1014,
    "path": "../../.output/public/_build/assets/configuration-C9_lrOg7.js"
  },
  "/_build/assets/command-parser-BYrNaVn5.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"55c-nUyIs/BxvrMVi6v253MatjvJbuM\"",
    "mtime": "2026-03-04T15:43:16.178Z",
    "size": 1372,
    "path": "../../.output/public/_build/assets/command-parser-BYrNaVn5.js.gz"
  },
  "/_build/assets/client-rr21uo7a.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"493-39LFfSHTjUnw2snZnPguJuPsmfg\"",
    "mtime": "2026-03-04T15:43:16.178Z",
    "size": 1171,
    "path": "../../.output/public/_build/assets/client-rr21uo7a.js.br"
  },
  "/_build/assets/conversation-DCR30KZM.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"fc9-3fSaTZXY9elmqRnWFmS6GGKAuz0\"",
    "mtime": "2026-03-04T15:43:15.989Z",
    "size": 4041,
    "path": "../../.output/public/_build/assets/conversation-DCR30KZM.js"
  },
  "/_build/assets/conversation-DCR30KZM.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"474-4cYI6asCLvX8PXasTdUWE3n64wQ\"",
    "mtime": "2026-03-04T15:43:16.178Z",
    "size": 1140,
    "path": "../../.output/public/_build/assets/conversation-DCR30KZM.js.br"
  },
  "/_build/assets/conversation-DCR30KZM.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"549-PocFZkcn2lrVK7RX+9pS7nJARMk\"",
    "mtime": "2026-03-04T15:43:16.178Z",
    "size": 1353,
    "path": "../../.output/public/_build/assets/conversation-DCR30KZM.js.gz"
  },
  "/_build/assets/custom-C6GgmEPN.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"2ab-cbHofOEo3tArddb9ZxNbdzMUXmg\"",
    "mtime": "2026-03-04T15:43:16.178Z",
    "size": 683,
    "path": "../../.output/public/_build/assets/custom-C6GgmEPN.js.br"
  },
  "/_build/assets/custom-C6GgmEPN.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"729-HCCmEIaN5eI4cmXi2rxepSDUlRA\"",
    "mtime": "2026-03-04T15:43:15.988Z",
    "size": 1833,
    "path": "../../.output/public/_build/assets/custom-C6GgmEPN.js"
  },
  "/_build/assets/custom-C6GgmEPN.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"322-t+EI/jSleFMaY8cTnfz+gx5TboA\"",
    "mtime": "2026-03-04T15:43:16.178Z",
    "size": 802,
    "path": "../../.output/public/_build/assets/custom-C6GgmEPN.js.gz"
  },
  "/_build/assets/depends-DGH-51cw.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"9e8-kp5/WD3mk3Ll5CftDDRxfES4IQU\"",
    "mtime": "2026-03-04T15:43:15.989Z",
    "size": 2536,
    "path": "../../.output/public/_build/assets/depends-DGH-51cw.js"
  },
  "/_build/assets/depends-DGH-51cw.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"351-08/sIWa6+3mDrfw8tyzkgRsyh5M\"",
    "mtime": "2026-03-04T15:43:16.188Z",
    "size": 849,
    "path": "../../.output/public/_build/assets/depends-DGH-51cw.js.br"
  },
  "/_build/assets/depends-DGH-51cw.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"3e9-xkGozStR7VEwZK1GLA0ZrN/JwQU\"",
    "mtime": "2026-03-04T15:43:16.178Z",
    "size": 1001,
    "path": "../../.output/public/_build/assets/depends-DGH-51cw.js.gz"
  },
  "/_build/assets/errors-BT2szhhJ.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"696-2He5BGn8iOXS0IjdPqOoLtVHzKY\"",
    "mtime": "2026-03-04T15:43:15.988Z",
    "size": 1686,
    "path": "../../.output/public/_build/assets/errors-BT2szhhJ.js"
  },
  "/_build/assets/errors-BT2szhhJ.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"2db-D9F1OCghloXdRKtZgbqyhpyZudU\"",
    "mtime": "2026-03-04T15:43:16.189Z",
    "size": 731,
    "path": "../../.output/public/_build/assets/errors-BT2szhhJ.js.br"
  },
  "/_build/assets/errors-BT2szhhJ.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"33e-5f8kNgLTb2BgqjM4IYr2lwrZ1mM\"",
    "mtime": "2026-03-04T15:43:16.188Z",
    "size": 830,
    "path": "../../.output/public/_build/assets/errors-BT2szhhJ.js.gz"
  },
  "/_build/assets/factory-C5keHo4B.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"99a-wSqpoN66fUsqF2zfqL5jLkMCnhs\"",
    "mtime": "2026-03-04T15:43:15.988Z",
    "size": 2458,
    "path": "../../.output/public/_build/assets/factory-C5keHo4B.js"
  },
  "/_build/assets/factory-C5keHo4B.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"371-7X0KqfsigNTz3EiU1O6/9O4FzhQ\"",
    "mtime": "2026-03-04T15:43:16.239Z",
    "size": 881,
    "path": "../../.output/public/_build/assets/factory-C5keHo4B.js.br"
  },
  "/_build/assets/factory-C5keHo4B.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"400-s6S0Nit7sz0V3Kcy8KWv4SRBHZ0\"",
    "mtime": "2026-03-04T15:43:16.189Z",
    "size": 1024,
    "path": "../../.output/public/_build/assets/factory-C5keHo4B.js.gz"
  },
  "/_build/assets/filters-CNM9OnV7.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"7fa-dtIjb4XiR31/9uPgaWb/bRJNpS8\"",
    "mtime": "2026-03-04T15:43:15.988Z",
    "size": 2042,
    "path": "../../.output/public/_build/assets/filters-CNM9OnV7.js"
  },
  "/_build/assets/filters-CNM9OnV7.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"2a6-Ekz8/NbSqNskhUapUbqO4q4LIvA\"",
    "mtime": "2026-03-04T15:43:16.239Z",
    "size": 678,
    "path": "../../.output/public/_build/assets/filters-CNM9OnV7.js.br"
  },
  "/_build/assets/filters-CNM9OnV7.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"310-K5ElDkGVacMXzAAcOZFeFwcarQQ\"",
    "mtime": "2026-03-04T15:43:16.239Z",
    "size": 784,
    "path": "../../.output/public/_build/assets/filters-CNM9OnV7.js.gz"
  },
  "/_build/assets/flood-wait-CEwfar7Q.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"a43-FKJUPN0WCrRegNCNjHw3S3LqIto\"",
    "mtime": "2026-03-04T15:43:15.988Z",
    "size": 2627,
    "path": "../../.output/public/_build/assets/flood-wait-CEwfar7Q.js"
  },
  "/_build/assets/flood-wait-CEwfar7Q.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"384-EcoRzY5FIPo1pkxEuU8+0wl8AUc\"",
    "mtime": "2026-03-04T15:43:16.242Z",
    "size": 900,
    "path": "../../.output/public/_build/assets/flood-wait-CEwfar7Q.js.br"
  },
  "/_build/assets/flood-wait-CEwfar7Q.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"41a-0v1s+FwZWKxeJfeURFuSFpQe51E\"",
    "mtime": "2026-03-04T15:43:16.242Z",
    "size": 1050,
    "path": "../../.output/public/_build/assets/flood-wait-CEwfar7Q.js.gz"
  },
  "/_build/assets/fsm-inject-Bjxlc9f-.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"2a5-Zdr7M/BHAeJoiOxpLVoNGC6REoc\"",
    "mtime": "2026-03-04T15:43:16.242Z",
    "size": 677,
    "path": "../../.output/public/_build/assets/fsm-inject-Bjxlc9f-.js.br"
  },
  "/_build/assets/fsm-inject-Bjxlc9f-.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"64f-0Ok42/21q8ErkLbobtJxkd8Uq+I\"",
    "mtime": "2026-03-04T15:43:15.988Z",
    "size": 1615,
    "path": "../../.output/public/_build/assets/fsm-inject-Bjxlc9f-.js"
  },
  "/_build/assets/fsm-inject-Bjxlc9f-.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"339-xbkOt54nbMsCVWq4+2WyjvbprnQ\"",
    "mtime": "2026-03-04T15:43:16.242Z",
    "size": 825,
    "path": "../../.output/public/_build/assets/fsm-inject-Bjxlc9f-.js.gz"
  },
  "/_build/assets/getting-started-DIuE3GQW.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"1890-2y5+lKlBd5s61WjmEk2pUC9D4Ag\"",
    "mtime": "2026-03-04T15:43:15.988Z",
    "size": 6288,
    "path": "../../.output/public/_build/assets/getting-started-DIuE3GQW.js"
  },
  "/_build/assets/getting-started-DIuE3GQW.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"6cc-8CdWbwh0JzoncEU4kcVpKln80zw\"",
    "mtime": "2026-03-04T15:43:16.251Z",
    "size": 1740,
    "path": "../../.output/public/_build/assets/getting-started-DIuE3GQW.js.br"
  },
  "/_build/assets/getting-started-DIuE3GQW.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"80b-V8sDirGQtRJIi9XwhiokOV6Ht2U\"",
    "mtime": "2026-03-04T15:43:16.242Z",
    "size": 2059,
    "path": "../../.output/public/_build/assets/getting-started-DIuE3GQW.js.gz"
  },
  "/_build/assets/hooks-CMr2SSfS.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"efb-Rr17CfyiaGuqvKussmEce6sxQT4\"",
    "mtime": "2026-03-04T15:43:15.988Z",
    "size": 3835,
    "path": "../../.output/public/_build/assets/hooks-CMr2SSfS.js"
  },
  "/_build/assets/hooks-CMr2SSfS.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"44e-+2AoD1ObGii0ckOVTVTBY0+zA9I\"",
    "mtime": "2026-03-04T15:43:16.242Z",
    "size": 1102,
    "path": "../../.output/public/_build/assets/hooks-CMr2SSfS.js.br"
  },
  "/_build/assets/hooks-CMr2SSfS.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"500-ZqSZcntorr9AHqIako3yTqxQQ6w\"",
    "mtime": "2026-03-04T15:43:16.242Z",
    "size": 1280,
    "path": "../../.output/public/_build/assets/hooks-CMr2SSfS.js.gz"
  },
  "/_build/assets/index-7hOOUTjg.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"e68-eBzE0h0dhP+RypnPsZEhxBdTMok\"",
    "mtime": "2026-03-04T15:43:15.988Z",
    "size": 3688,
    "path": "../../.output/public/_build/assets/index-7hOOUTjg.js"
  },
  "/_build/assets/index-7hOOUTjg.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"408-pxFPl745/PbIRoO0MwZvloKKl/4\"",
    "mtime": "2026-03-04T15:43:16.285Z",
    "size": 1032,
    "path": "../../.output/public/_build/assets/index-7hOOUTjg.js.br"
  },
  "/_build/assets/index-7hOOUTjg.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"4c4-RSqp2KCqVJLW0erd8EqX3V8GBD4\"",
    "mtime": "2026-03-04T15:43:16.251Z",
    "size": 1220,
    "path": "../../.output/public/_build/assets/index-7hOOUTjg.js.gz"
  },
  "/_build/assets/index-BTZAuau-.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"fb8-R9wsGIDu56Bnh54ohcP8wDGadbs\"",
    "mtime": "2026-03-04T15:43:15.988Z",
    "size": 4024,
    "path": "../../.output/public/_build/assets/index-BTZAuau-.js"
  },
  "/_build/assets/index-BTZAuau-.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"518-Q4OyWiE6W1iSd2ca8Gri5g2lK5U\"",
    "mtime": "2026-03-04T15:43:16.285Z",
    "size": 1304,
    "path": "../../.output/public/_build/assets/index-BTZAuau-.js.br"
  },
  "/_build/assets/index-BTZAuau-.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5f1-5TIRQeGSedtwGMASPWtjtucxwCE\"",
    "mtime": "2026-03-04T15:43:16.251Z",
    "size": 1521,
    "path": "../../.output/public/_build/assets/index-BTZAuau-.js.gz"
  },
  "/_build/assets/index-CUT9LpEF.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"13b9-UWr1B0W7dt87xyg2H7SBCtemC3c\"",
    "mtime": "2026-03-04T15:43:15.989Z",
    "size": 5049,
    "path": "../../.output/public/_build/assets/index-CUT9LpEF.js"
  },
  "/_build/assets/index-CUT9LpEF.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"530-C/N9qsZfZguLAUmQgcPR0Oml6HE\"",
    "mtime": "2026-03-04T15:43:16.285Z",
    "size": 1328,
    "path": "../../.output/public/_build/assets/index-CUT9LpEF.js.br"
  },
  "/_build/assets/index-CUT9LpEF.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"634-jcPZiGeO6aXJaOT8tu3HRTkfVvk\"",
    "mtime": "2026-03-04T15:43:16.285Z",
    "size": 1588,
    "path": "../../.output/public/_build/assets/index-CUT9LpEF.js.gz"
  },
  "/_build/assets/index-CrgZBvZS.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"c22-ZNzd172NHxF3LZbc2x2s1N3eO9U\"",
    "mtime": "2026-03-04T15:43:15.988Z",
    "size": 3106,
    "path": "../../.output/public/_build/assets/index-CrgZBvZS.js"
  },
  "/_build/assets/index-CrgZBvZS.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"407-i0dPJRLnAuTH9vaXMH3D+6GyJHI\"",
    "mtime": "2026-03-04T15:43:16.285Z",
    "size": 1031,
    "path": "../../.output/public/_build/assets/index-CrgZBvZS.js.br"
  },
  "/_build/assets/index-CrgZBvZS.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"4e3-XXm02MS3j9hKULFAfiR7p49eEOA\"",
    "mtime": "2026-03-04T15:43:16.285Z",
    "size": 1251,
    "path": "../../.output/public/_build/assets/index-CrgZBvZS.js.gz"
  },
  "/_build/assets/index-CxqScmAb.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"18bb-KDXwx/hijtWoMeOaOytJXauxnYE\"",
    "mtime": "2026-03-04T15:43:15.988Z",
    "size": 6331,
    "path": "../../.output/public/_build/assets/index-CxqScmAb.js"
  },
  "/_build/assets/index-CxqScmAb.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"6fa-ml9CPG/RoIRmS1YCjfl4RZmqaqo\"",
    "mtime": "2026-03-04T15:43:16.298Z",
    "size": 1786,
    "path": "../../.output/public/_build/assets/index-CxqScmAb.js.br"
  },
  "/_build/assets/index-CxqScmAb.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"812-Kxqv8ksHer4IIdcM0zMQrIeJlgw\"",
    "mtime": "2026-03-04T15:43:16.285Z",
    "size": 2066,
    "path": "../../.output/public/_build/assets/index-CxqScmAb.js.gz"
  },
  "/_build/assets/index-egAYZviI.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"1498-10XO0U4SbdcXCZ9ddLPToJHB84E\"",
    "mtime": "2026-03-04T15:43:15.988Z",
    "size": 5272,
    "path": "../../.output/public/_build/assets/index-egAYZviI.js"
  },
  "/_build/assets/index-egAYZviI.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"63d-wJcZpiew5N+zNK4lM+p5rBduUy0\"",
    "mtime": "2026-03-04T15:43:16.298Z",
    "size": 1597,
    "path": "../../.output/public/_build/assets/index-egAYZviI.js.br"
  },
  "/_build/assets/index-egAYZviI.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"77a-4jhth3ufGcvZqSXFg8hM/tz343Q\"",
    "mtime": "2026-03-04T15:43:16.285Z",
    "size": 1914,
    "path": "../../.output/public/_build/assets/index-egAYZviI.js.gz"
  },
  "/_build/assets/index-jf7zc1Ba.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"1304-PicRdLFy8RqvQTsd3lV0vpxFOCc\"",
    "mtime": "2026-03-04T15:43:15.989Z",
    "size": 4868,
    "path": "../../.output/public/_build/assets/index-jf7zc1Ba.js"
  },
  "/_build/assets/index-jf7zc1Ba.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"6a6-RtTRKmexBK5ihfXW2ttUQ/irSjI\"",
    "mtime": "2026-03-04T15:43:16.327Z",
    "size": 1702,
    "path": "../../.output/public/_build/assets/index-jf7zc1Ba.js.br"
  },
  "/_build/assets/index-jf7zc1Ba.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7f3-E801Y1IjRwtuxutN5ljlEnkHxIE\"",
    "mtime": "2026-03-04T15:43:16.285Z",
    "size": 2035,
    "path": "../../.output/public/_build/assets/index-jf7zc1Ba.js.gz"
  },
  "/_build/assets/inline-keyboard-pFGWUOH7.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"130b-mWhBLZlHTvngLA/QvjgP49HhNm0\"",
    "mtime": "2026-03-04T15:43:15.990Z",
    "size": 4875,
    "path": "../../.output/public/_build/assets/inline-keyboard-pFGWUOH7.js"
  },
  "/_build/assets/inline-keyboard-pFGWUOH7.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"548-uxL/ZJ1puYsa/dMvmhpoTCJCkvo\"",
    "mtime": "2026-03-04T15:43:16.328Z",
    "size": 1352,
    "path": "../../.output/public/_build/assets/inline-keyboard-pFGWUOH7.js.br"
  },
  "/_build/assets/inline-keyboard-pFGWUOH7.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"61f-3QF3v2d9wM3frJtu9fFSNCNCK7M\"",
    "mtime": "2026-03-04T15:43:16.298Z",
    "size": 1567,
    "path": "../../.output/public/_build/assets/inline-keyboard-pFGWUOH7.js.gz"
  },
  "/_build/assets/languages-BbP_3f3D.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"9d1-iO2ozd///xBG3ULMRab7UQA7GYU\"",
    "mtime": "2026-03-04T15:43:15.989Z",
    "size": 2513,
    "path": "../../.output/public/_build/assets/languages-BbP_3f3D.js"
  },
  "/_build/assets/languages-BbP_3f3D.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"355-QCe099inEkyLxjhe9eW16JxwIGE\"",
    "mtime": "2026-03-04T15:43:16.328Z",
    "size": 853,
    "path": "../../.output/public/_build/assets/languages-BbP_3f3D.js.br"
  },
  "/_build/assets/languages-BbP_3f3D.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"3f9-eRM1sm9TYaDALqcjf5PEEZJQNg0\"",
    "mtime": "2026-03-04T15:43:16.298Z",
    "size": 1017,
    "path": "../../.output/public/_build/assets/languages-BbP_3f3D.js.gz"
  },
  "/_build/assets/lifecycle-hooks-DLuZxD6b.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"1121-sgX18DBRLX4p2Xj90YXgyu+AJx8\"",
    "mtime": "2026-03-04T15:43:15.989Z",
    "size": 4385,
    "path": "../../.output/public/_build/assets/lifecycle-hooks-DLuZxD6b.js"
  },
  "/_build/assets/lifecycle-hooks-DLuZxD6b.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"49a-NtbbfAQ7NE/71TyEU0mEO1phUKc\"",
    "mtime": "2026-03-04T15:43:16.328Z",
    "size": 1178,
    "path": "../../.output/public/_build/assets/lifecycle-hooks-DLuZxD6b.js.br"
  },
  "/_build/assets/memory-IuJqlSkP.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"5e6-6rLTiJJOxgyrhmlZu7Oll24YCVQ\"",
    "mtime": "2026-03-04T15:43:15.989Z",
    "size": 1510,
    "path": "../../.output/public/_build/assets/memory-IuJqlSkP.js"
  },
  "/_build/assets/lifecycle-hooks-DLuZxD6b.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"572-DamskXL7W/4AM9C6fCei9oCXlXU\"",
    "mtime": "2026-03-04T15:43:16.327Z",
    "size": 1394,
    "path": "../../.output/public/_build/assets/lifecycle-hooks-DLuZxD6b.js.gz"
  },
  "/_build/assets/memory-IuJqlSkP.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"293-QrxCD9czFzkKcaeqJZfwrtssLKs\"",
    "mtime": "2026-03-04T15:43:16.328Z",
    "size": 659,
    "path": "../../.output/public/_build/assets/memory-IuJqlSkP.js.br"
  },
  "/_build/assets/memory-IuJqlSkP.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"30c-h0uS9h0IYmqXWzr2BHD95U2WWEE\"",
    "mtime": "2026-03-04T15:43:16.328Z",
    "size": 780,
    "path": "../../.output/public/_build/assets/memory-IuJqlSkP.js.gz"
  },
  "/_build/assets/menu-_TpGTvSt.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"bf1-847ZL4xb/i0qfETiC4oE2IWCTF8\"",
    "mtime": "2026-03-04T15:43:15.990Z",
    "size": 3057,
    "path": "../../.output/public/_build/assets/menu-_TpGTvSt.js"
  },
  "/_build/assets/menu-_TpGTvSt.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"42a-K9N28g07NwZ54dKhAn3h5egkPuU\"",
    "mtime": "2026-03-04T15:43:16.328Z",
    "size": 1066,
    "path": "../../.output/public/_build/assets/menu-_TpGTvSt.js.br"
  },
  "/_build/assets/menu-_TpGTvSt.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"505-Gnb2/QYYSrTbs6ydGWAB1upNRJg\"",
    "mtime": "2026-03-04T15:43:16.328Z",
    "size": 1285,
    "path": "../../.output/public/_build/assets/menu-_TpGTvSt.js.gz"
  },
  "/_build/assets/migration-CFKTErgm.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"147e-3htwlgPyB/HgxBdlHgu1FctYfGw\"",
    "mtime": "2026-03-04T15:43:15.989Z",
    "size": 5246,
    "path": "../../.output/public/_build/assets/migration-CFKTErgm.js"
  },
  "/_build/assets/migration-CFKTErgm.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"59b-Ejd5qtDQvGu3axMiIGwgFieR9xs\"",
    "mtime": "2026-03-04T15:43:16.343Z",
    "size": 1435,
    "path": "../../.output/public/_build/assets/migration-CFKTErgm.js.br"
  },
  "/_build/assets/migration-CFKTErgm.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6b3-ql/xi9iyeF5WpRW3sVJQ4CpN2Qw\"",
    "mtime": "2026-03-04T15:43:16.328Z",
    "size": 1715,
    "path": "../../.output/public/_build/assets/migration-CFKTErgm.js.gz"
  },
  "/_build/assets/pagination-CgzIlD5a.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"de2-MGntPT0dF/9PdQXydb2eeh9X4n4\"",
    "mtime": "2026-03-04T15:43:15.989Z",
    "size": 3554,
    "path": "../../.output/public/_build/assets/pagination-CgzIlD5a.js"
  },
  "/_build/assets/pagination-CgzIlD5a.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"440-m9Q9dhfOc1gT+awXwx1PVYrsp2Q\"",
    "mtime": "2026-03-04T15:43:16.371Z",
    "size": 1088,
    "path": "../../.output/public/_build/assets/pagination-CgzIlD5a.js.br"
  },
  "/_build/assets/pagination-CgzIlD5a.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"508-oSvLr7HlinPRncCD4f2K+GthcJo\"",
    "mtime": "2026-03-04T15:43:16.328Z",
    "size": 1288,
    "path": "../../.output/public/_build/assets/pagination-CgzIlD5a.js.gz"
  },
  "/_build/assets/patch-helper-DqIU0riQ.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"724-iqKBmZM2S+MHzpJ92xwtk9XcO+E\"",
    "mtime": "2026-03-04T15:43:15.989Z",
    "size": 1828,
    "path": "../../.output/public/_build/assets/patch-helper-DqIU0riQ.js"
  },
  "/_build/assets/patch-helper-DqIU0riQ.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"2cc-d3y9wFJ0EveStq8jjxd8SAUwTdE\"",
    "mtime": "2026-03-04T15:43:16.344Z",
    "size": 716,
    "path": "../../.output/public/_build/assets/patch-helper-DqIU0riQ.js.br"
  },
  "/_build/assets/patch-helper-DqIU0riQ.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"34e-bL0+2VR59zZFEpoPSFYLcKzCCtU\"",
    "mtime": "2026-03-04T15:43:16.343Z",
    "size": 846,
    "path": "../../.output/public/_build/assets/patch-helper-DqIU0riQ.js.gz"
  },
  "/_build/assets/patching-BqyXddZ7.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"b8d-JrS4+hh67en34fLIh9uqw3nR7HE\"",
    "mtime": "2026-03-04T15:43:15.989Z",
    "size": 2957,
    "path": "../../.output/public/_build/assets/patching-BqyXddZ7.js"
  },
  "/_build/assets/patching-BqyXddZ7.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"3df-nJURpm1I0giOpbT9nzS4htLhcdc\"",
    "mtime": "2026-03-04T15:43:16.344Z",
    "size": 991,
    "path": "../../.output/public/_build/assets/patching-BqyXddZ7.js.br"
  },
  "/_build/assets/pykeyboard-WPASDAak.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"7e0-lyDIEqP3vi3dlgJu9b71pL2E5Ww\"",
    "mtime": "2026-03-04T15:43:15.989Z",
    "size": 2016,
    "path": "../../.output/public/_build/assets/pykeyboard-WPASDAak.js"
  },
  "/_build/assets/pykeyboard-WPASDAak.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"255-lG8ftN3nLkHtC2xuSikmLezAuHU\"",
    "mtime": "2026-03-04T15:43:16.371Z",
    "size": 597,
    "path": "../../.output/public/_build/assets/pykeyboard-WPASDAak.js.br"
  },
  "/_build/assets/patching-BqyXddZ7.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"4b0-Xthyfh3T5U0zFq39rd1kqaTmDDY\"",
    "mtime": "2026-03-04T15:43:16.343Z",
    "size": 1200,
    "path": "../../.output/public/_build/assets/patching-BqyXddZ7.js.gz"
  },
  "/_build/assets/pykeyboard-WPASDAak.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2e0-jfackvr+d1Ufc/5cxb3I+YO4KS8\"",
    "mtime": "2026-03-04T15:43:16.367Z",
    "size": 736,
    "path": "../../.output/public/_build/assets/pykeyboard-WPASDAak.js.gz"
  },
  "/_build/assets/pyrogram-patch-B03OFwOm.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"9ad-GupDBr9eg5hauz8fxxTYfkkL6Tk\"",
    "mtime": "2026-03-04T15:43:15.989Z",
    "size": 2477,
    "path": "../../.output/public/_build/assets/pyrogram-patch-B03OFwOm.js"
  },
  "/_build/assets/pyrogram-patch-B03OFwOm.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"2bd-oormlWyzLcxuE4QCchg0R5I/31k\"",
    "mtime": "2026-03-04T15:43:16.383Z",
    "size": 701,
    "path": "../../.output/public/_build/assets/pyrogram-patch-B03OFwOm.js.br"
  },
  "/_build/assets/pyrogram-patch-B03OFwOm.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"353-VctBePpeRBCZlQNw48FGxSfMFfU\"",
    "mtime": "2026-03-04T15:43:16.371Z",
    "size": 851,
    "path": "../../.output/public/_build/assets/pyrogram-patch-B03OFwOm.js.gz"
  },
  "/_build/assets/rate-limit-BFmdz04W.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"67b-wINmjEb/kWXRQMw+S16boKx5xAw\"",
    "mtime": "2026-03-04T15:43:15.990Z",
    "size": 1659,
    "path": "../../.output/public/_build/assets/rate-limit-BFmdz04W.js"
  },
  "/_build/assets/rate-limit-BFmdz04W.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"2b9-ftTh979wpdCpEPTZf2phnZCwNDM\"",
    "mtime": "2026-03-04T15:43:16.371Z",
    "size": 697,
    "path": "../../.output/public/_build/assets/rate-limit-BFmdz04W.js.br"
  },
  "/_build/assets/rate-limit-BFmdz04W.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"32a-1sUJFlNMuUScNjrQ4eVBBcbm71s\"",
    "mtime": "2026-03-04T15:43:16.371Z",
    "size": 810,
    "path": "../../.output/public/_build/assets/rate-limit-BFmdz04W.js.gz"
  },
  "/_build/assets/rate-limit-Du98SOtC.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"fe3-cGh1A2XcR6R64l6DoD+8ywuO+E0\"",
    "mtime": "2026-03-04T15:43:15.990Z",
    "size": 4067,
    "path": "../../.output/public/_build/assets/rate-limit-Du98SOtC.js"
  },
  "/_build/assets/rate-limit-Du98SOtC.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"48c-rAXyZTb87N50vbu9l5hLEHyqlws\"",
    "mtime": "2026-03-04T15:43:16.371Z",
    "size": 1164,
    "path": "../../.output/public/_build/assets/rate-limit-Du98SOtC.js.br"
  },
  "/_build/assets/rate-limit-Du98SOtC.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"558-A+q0JlT+qjfT5oNtYRehwa3b3ZU\"",
    "mtime": "2026-03-04T15:43:16.371Z",
    "size": 1368,
    "path": "../../.output/public/_build/assets/rate-limit-Du98SOtC.js.gz"
  },
  "/_build/assets/redis-DLSMtCac.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"125a-2hW8/DEmYveKVT3jGAygvoXxTNs\"",
    "mtime": "2026-03-04T15:43:15.989Z",
    "size": 4698,
    "path": "../../.output/public/_build/assets/redis-DLSMtCac.js"
  },
  "/_build/assets/redis-DLSMtCac.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"5dd-LtmbShrmJwfCk88cLNcPQiW/ELo\"",
    "mtime": "2026-03-04T15:43:16.372Z",
    "size": 1501,
    "path": "../../.output/public/_build/assets/redis-DLSMtCac.js.br"
  },
  "/_build/assets/redis-DLSMtCac.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"713-ZooBLlkWsiInzpRuNDGe50QZg3M\"",
    "mtime": "2026-03-04T15:43:16.371Z",
    "size": 1811,
    "path": "../../.output/public/_build/assets/redis-DLSMtCac.js.gz"
  },
  "/_build/assets/reply-keyboard-CwDCdpwu.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"119f-o2t4YZBMLmuPzhZKca0EKko9ClA\"",
    "mtime": "2026-03-04T15:43:15.990Z",
    "size": 4511,
    "path": "../../.output/public/_build/assets/reply-keyboard-CwDCdpwu.js"
  },
  "/_build/assets/reply-keyboard-CwDCdpwu.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"484-imzu2gBOMgebg2FOpPdkhgn+eG0\"",
    "mtime": "2026-03-04T15:43:16.396Z",
    "size": 1156,
    "path": "../../.output/public/_build/assets/reply-keyboard-CwDCdpwu.js.br"
  },
  "/_build/assets/reply-keyboard-CwDCdpwu.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"567-VFzRztZflSmJAlOje9wWd/TWXYY\"",
    "mtime": "2026-03-04T15:43:16.371Z",
    "size": 1383,
    "path": "../../.output/public/_build/assets/reply-keyboard-CwDCdpwu.js.gz"
  },
  "/_build/assets/router-Bjw-3AHc.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"f93-gPF+yKXxgo+Xbka2Y0ERa70zW/U\"",
    "mtime": "2026-03-04T15:43:15.989Z",
    "size": 3987,
    "path": "../../.output/public/_build/assets/router-Bjw-3AHc.js"
  },
  "/_build/assets/router-Bjw-3AHc.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"473-vxJ4qwgrg78vO3bMW/w0qzAvHBc\"",
    "mtime": "2026-03-04T15:43:16.384Z",
    "size": 1139,
    "path": "../../.output/public/_build/assets/router-Bjw-3AHc.js.br"
  },
  "/_build/assets/router-Bjw-3AHc.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"532-VSP2WDiE/y7VzQP/kjd+unm8PDw\"",
    "mtime": "2026-03-04T15:43:16.383Z",
    "size": 1330,
    "path": "../../.output/public/_build/assets/router-Bjw-3AHc.js.gz"
  },
  "/_build/assets/routing-U_PwxrrZ.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"8700-IC8+M73DJTRSzmq4Svg/H0Rg2is\"",
    "mtime": "2026-03-04T15:43:15.990Z",
    "size": 34560,
    "path": "../../.output/public/_build/assets/routing-U_PwxrrZ.js"
  },
  "/_build/assets/routing-U_PwxrrZ.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"303b-HsQ88sow0kCZKMvB1BXEfqfhQtQ\"",
    "mtime": "2026-03-04T15:43:16.467Z",
    "size": 12347,
    "path": "../../.output/public/_build/assets/routing-U_PwxrrZ.js.br"
  },
  "/_build/assets/routing-U_PwxrrZ.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"34d9-3qryJiMsmvz+Bc8qpdYQHBuZKB0\"",
    "mtime": "2026-03-04T15:43:16.384Z",
    "size": 13529,
    "path": "../../.output/public/_build/assets/routing-U_PwxrrZ.js.gz"
  },
  "/_build/assets/states-CsZuP59d.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"15cb-H+W861Pjm9WN9P7H7YImS7nMnqM\"",
    "mtime": "2026-03-04T15:43:15.990Z",
    "size": 5579,
    "path": "../../.output/public/_build/assets/states-CsZuP59d.js"
  },
  "/_build/assets/states-CsZuP59d.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"61d-hQwOOO4MbtfoKNcyr7Ux6et1UTk\"",
    "mtime": "2026-03-04T15:43:16.396Z",
    "size": 1565,
    "path": "../../.output/public/_build/assets/states-CsZuP59d.js.br"
  },
  "/_build/assets/states-CsZuP59d.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"72d-epuw6+4nZDasnpTacXjntm1rsMY\"",
    "mtime": "2026-03-04T15:43:16.384Z",
    "size": 1837,
    "path": "../../.output/public/_build/assets/states-CsZuP59d.js.gz"
  },
  "/_build/assets/utilities-C8-QN4_T.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"caf-3lSp99LvWT3yS86Icg9d/0MhJb4\"",
    "mtime": "2026-03-04T15:43:15.990Z",
    "size": 3247,
    "path": "../../.output/public/_build/assets/utilities-C8-QN4_T.js"
  },
  "/_build/assets/utilities-C8-QN4_T.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c8-yTrmUhXNftokLe4GYyuuK+WYTTQ\"",
    "mtime": "2026-03-04T15:43:16.396Z",
    "size": 968,
    "path": "../../.output/public/_build/assets/utilities-C8-QN4_T.js.br"
  },
  "/_build/assets/utilities-C8-QN4_T.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"43b-6t7Sx2e9E0UXbzVwVl1HJ0WjkSQ\"",
    "mtime": "2026-03-04T15:43:16.396Z",
    "size": 1083,
    "path": "../../.output/public/_build/assets/utilities-C8-QN4_T.js.gz"
  },
  "/_build/assets/writing-hAiAynWx.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"93c-D/Z8+SsQD5a4fxILOCXDtlvPPNk\"",
    "mtime": "2026-03-04T15:43:15.990Z",
    "size": 2364,
    "path": "../../.output/public/_build/assets/writing-hAiAynWx.js"
  },
  "/_build/assets/writing-hAiAynWx.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"30c-oO4E36dfDHN/mTCqhq7JHXdXzBk\"",
    "mtime": "2026-03-04T15:43:16.401Z",
    "size": 780,
    "path": "../../.output/public/_build/assets/writing-hAiAynWx.js.br"
  },
  "/_build/assets/writing-hAiAynWx.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"39d-1/vDCyibdcYQDf24BHGSHazlutA\"",
    "mtime": "2026-03-04T15:43:16.396Z",
    "size": 925,
    "path": "../../.output/public/_build/assets/writing-hAiAynWx.js.gz"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _LVApmG = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
function Fe(e) {
  let r;
  const t = F(e), a = { duplex: "half", method: e.method, headers: e.headers };
  return e.node.req.body instanceof ArrayBuffer ? new Request(t, { ...a, body: e.node.req.body }) : new Request(t, { ...a, get body() {
    return r || (r = Je(e), r);
  } });
}
function Le(e) {
  var _a;
  return (_a = e.web) != null ? _a : e.web = { request: Fe(e), url: F(e) }, e.web.request;
}
function Ie() {
  return Ze();
}
const Y = /* @__PURE__ */ Symbol("$HTTPEvent");
function Ue$1(e) {
  return typeof e == "object" && (e instanceof H3Event || (e == null ? void 0 : e[Y]) instanceof H3Event || (e == null ? void 0 : e.__is_event__) === true);
}
function c(e) {
  return function(...r) {
    var _a;
    let t = r[0];
    if (Ue$1(t)) r[0] = t instanceof H3Event || t.__is_event__ ? t : t[Y];
    else {
      if (!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext)) throw new Error("AsyncLocalStorage was not enabled. Use the `server.experimental.asyncContext: true` option in your app configuration to enable it. Or, pass the instance of HTTPEvent that you have as the first argument to the function.");
      if (t = Ie(), !t) throw new Error("No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.");
      r.unshift(t);
    }
    return e(...r);
  };
}
const F = c(getRequestURL$1), _e = c(getRequestIP), P$1 = c(setResponseStatus$1), H$1 = c(getResponseStatus), je = c(getResponseStatusText), k = c(getResponseHeaders), w$1 = c(getResponseHeader$1), Me = c(setResponseHeader$1), L = c(appendResponseHeader$1), We = c(parseCookies), Be = c(getCookie), ze = c(setCookie), l = c(setHeader), Je = c(getRequestWebStream), Xe = c(removeResponseHeader$1), Ge = c(Le);
function Ke() {
  var _a;
  return getContext("nitro-app", { asyncContext: !!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext), AsyncLocalStorage: AsyncLocalStorage });
}
function Ze() {
  return Ke().use().event;
}
const D = "Invariant Violation", { setPrototypeOf: Qe = function(e, r) {
  return e.__proto__ = r, e;
} } = Object;
let S$1 = class S extends Error {
  constructor(r = D) {
    super(typeof r == "number" ? `${D}: ${r} (see https://github.com/apollographql/invariant-packages)` : r);
    __publicField$1(this, "framesToPop", 1);
    __publicField$1(this, "name", D);
    Qe(this, S.prototype);
  }
};
function et(e, r) {
  if (!e) throw new S$1(r);
}
const x$1 = "solidFetchEvent";
function tt(e) {
  return { request: Ge(e), response: ot(e), clientAddress: _e(e), locals: {}, nativeEvent: e };
}
function rt(e) {
  return { ...e };
}
function st(e) {
  if (!e.context[x$1]) {
    const r = tt(e);
    e.context[x$1] = r;
  }
  return e.context[x$1];
}
function O$1(e, r) {
  for (const [t, a] of r.entries()) L(e, t, a);
}
class at {
  constructor(r) {
    __publicField$1(this, "event");
    this.event = r;
  }
  get(r) {
    const t = w$1(this.event, r);
    return Array.isArray(t) ? t.join(", ") : t || null;
  }
  has(r) {
    return this.get(r) !== null;
  }
  set(r, t) {
    return Me(this.event, r, t);
  }
  delete(r) {
    return Xe(this.event, r);
  }
  append(r, t) {
    L(this.event, r, t);
  }
  getSetCookie() {
    const r = w$1(this.event, "Set-Cookie");
    return Array.isArray(r) ? r : [r];
  }
  forEach(r) {
    return Object.entries(k(this.event)).forEach(([t, a]) => r(Array.isArray(a) ? a.join(", ") : a, t, this));
  }
  entries() {
    return Object.entries(k(this.event)).map(([r, t]) => [r, Array.isArray(t) ? t.join(", ") : t])[Symbol.iterator]();
  }
  keys() {
    return Object.keys(k(this.event))[Symbol.iterator]();
  }
  values() {
    return Object.values(k(this.event)).map((r) => Array.isArray(r) ? r.join(", ") : r)[Symbol.iterator]();
  }
  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
}
function ot(e) {
  return { get status() {
    return H$1(e);
  }, set status(r) {
    P$1(e, r);
  }, get statusText() {
    return je(e);
  }, set statusText(r) {
    P$1(e, H$1(e), r);
  }, headers: new at(e) };
}
const I = [{ page: true, path: "/api/pykeyboard", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/api/pykeyboard.tsx" }, { page: true, path: "/api/pyrogram-patch", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/api/pyrogram-patch.tsx" }, { page: true, path: "/getting-started", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/getting-started.tsx" }, { page: true, path: "/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/index.tsx" }, { page: true, path: "/kurigram-addons/client", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/kurigram-addons/client.tsx" }, { page: true, path: "/kurigram-addons/command-parser", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/kurigram-addons/command-parser.tsx" }, { page: true, path: "/kurigram-addons/conversation", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/kurigram-addons/conversation.tsx" }, { page: true, path: "/kurigram-addons/depends", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/kurigram-addons/depends.tsx" }, { page: true, path: "/kurigram-addons/flood-wait", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/kurigram-addons/flood-wait.tsx" }, { page: true, path: "/kurigram-addons/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/kurigram-addons/index.tsx" }, { page: true, path: "/kurigram-addons/lifecycle-hooks", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/kurigram-addons/lifecycle-hooks.tsx" }, { page: true, path: "/kurigram-addons/menu", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/kurigram-addons/menu.tsx" }, { page: true, path: "/kurigram-addons/rate-limit", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/kurigram-addons/rate-limit.tsx" }, { page: true, path: "/migration", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/migration.tsx" }, { page: true, path: "/pykeyboard/builder", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/builder.tsx" }, { page: true, path: "/pykeyboard/factory", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/factory.tsx" }, { page: true, path: "/pykeyboard/hooks", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/hooks.tsx" }, { page: true, path: "/pykeyboard/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/index.tsx" }, { page: true, path: "/pykeyboard/inline-keyboard", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/inline-keyboard.tsx" }, { page: true, path: "/pykeyboard/languages", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/languages.tsx" }, { page: true, path: "/pykeyboard/pagination", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/pagination.tsx" }, { page: true, path: "/pykeyboard/reply-keyboard", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/reply-keyboard.tsx" }, { page: true, path: "/pykeyboard/utilities", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/utilities.tsx" }, { page: true, path: "/pyrogram-patch/circuit-breaker", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/circuit-breaker.tsx" }, { page: true, path: "/pyrogram-patch/configuration", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/configuration.tsx" }, { page: true, path: "/pyrogram-patch/errors", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/errors.tsx" }, { page: true, path: "/pyrogram-patch/fsm/filters", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/fsm/filters.tsx" }, { page: true, path: "/pyrogram-patch/fsm/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/fsm/index.tsx" }, { page: true, path: "/pyrogram-patch/fsm/states", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/fsm/states.tsx" }, { page: true, path: "/pyrogram-patch/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/index.tsx" }, { page: true, path: "/pyrogram-patch/middleware/fsm-inject", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/middleware/fsm-inject.tsx" }, { page: true, path: "/pyrogram-patch/middleware/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/middleware/index.tsx" }, { page: true, path: "/pyrogram-patch/middleware/rate-limit", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/middleware/rate-limit.tsx" }, { page: true, path: "/pyrogram-patch/middleware/writing", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/middleware/writing.tsx" }, { page: true, path: "/pyrogram-patch/patch-helper", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/patch-helper.tsx" }, { page: true, path: "/pyrogram-patch/patching", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/patching.tsx" }, { page: true, path: "/pyrogram-patch/router", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/router.tsx" }, { page: true, path: "/pyrogram-patch/storage/custom", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/storage/custom.tsx" }, { page: true, path: "/pyrogram-patch/storage/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/storage/index.tsx" }, { page: true, path: "/pyrogram-patch/storage/memory", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/storage/memory.tsx" }, { page: true, path: "/pyrogram-patch/storage/redis", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/storage/redis.tsx" }], nt = it(I.filter((e) => e.page));
function it(e) {
  function r(t, a, o, n) {
    const i = Object.values(t).find((d) => o.startsWith(d.id + "/"));
    return i ? (r(i.children || (i.children = []), a, o.slice(i.id.length)), t) : (t.push({ ...a, id: o, path: o.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/") }), t);
  }
  return e.sort((t, a) => t.path.length - a.path.length).reduce((t, a) => r(t, a, a.path, a.path), []);
}
function dt(e) {
  return e.$HEAD || e.$GET || e.$POST || e.$PUT || e.$PATCH || e.$DELETE;
}
createRouter({ routes: I.reduce((e, r) => {
  if (!dt(r)) return e;
  let t = r.path.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/").replace(/\*([^/]*)/g, (a, o) => `**:${o}`).split("/").map((a) => a.startsWith(":") || a.startsWith("*") ? a : encodeURIComponent(a)).join("/");
  if (/:[^/]*\?/g.test(t)) throw new Error(`Optional parameters are not supported in API routes: ${t}`);
  if (e[t]) throw new Error(`Duplicate API routes for "${t}" found at "${e[t].route.path}" and "${r.path}"`);
  return e[t] = { route: r }, e;
}, {}) });
var ut = " ";
const pt = { style: (e) => ssrElement("style", e.attrs, () => e.children, true), link: (e) => ssrElement("link", e.attrs, void 0, true), script: (e) => e.attrs.src ? ssrElement("script", mergeProps(() => e.attrs, { get id() {
  return e.key;
} }), () => ssr(ut), true) : null, noscript: (e) => ssrElement("noscript", e.attrs, () => escape(e.children), true) };
function mt(e, r) {
  let { tag: t, attrs: { key: a, ...o } = { key: void 0 }, children: n } = e;
  return pt[t]({ attrs: { ...o, nonce: r }, key: a, children: n });
}
function ht(e, r, t, a = "default") {
  return lazy(async () => {
    var _a;
    {
      const n = (await e.import())[a], d = (await ((_a = r.inputs) == null ? void 0 : _a[e.src].assets())).filter((u) => u.tag === "style" || u.attrs.rel === "stylesheet");
      return { default: (u) => [...d.map((g) => mt(g)), createComponent(n, u)] };
    }
  });
}
function U() {
  function e(t) {
    return { ...t, ...t.$$route ? t.$$route.require().route : void 0, info: { ...t.$$route ? t.$$route.require().route.info : {}, filesystem: true }, component: t.$component && ht(t.$component, globalThis.MANIFEST.client, globalThis.MANIFEST.ssr), children: t.children ? t.children.map(e) : void 0 };
  }
  return nt.map(e);
}
let N;
const qt = isServer ? () => getRequestEvent().routes : () => N || (N = U());
function lt(e) {
  const r = Be(e.nativeEvent, "flash");
  if (r) try {
    let t = JSON.parse(r);
    if (!t || !t.result) return;
    const a = [...t.input.slice(0, -1), new Map(t.input[t.input.length - 1])], o = t.error ? new Error(t.result) : t.result;
    return { input: a, url: t.url, pending: false, result: t.thrown ? void 0 : o, error: t.thrown ? o : void 0 };
  } catch (t) {
    console.error(t);
  } finally {
    ze(e.nativeEvent, "flash", "", { maxAge: 0 });
  }
}
async function gt(e) {
  const r = globalThis.MANIFEST.client;
  return globalThis.MANIFEST.ssr, e.response.headers.set("Content-Type", "text/html"), Object.assign(e, { manifest: await r.json(), assets: [...await r.inputs[r.handler].assets()], router: { submission: lt(e) }, routes: U(), complete: false, $islands: /* @__PURE__ */ new Set() });
}
const ft = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function yt(e) {
  return e.status && ft.has(e.status) ? e.status : 302;
}
const kt = {}, E = [AbortSignalPlugin, CustomEventPlugin, DOMExceptionPlugin, EventPlugin, FormDataPlugin, HeadersPlugin, ReadableStreamPlugin, RequestPlugin, ResponsePlugin, URLSearchParamsPlugin, URLPlugin], Pt = 64, _ = Feature.RegExp;
function j(e) {
  const r = new TextEncoder().encode(e), t = r.length, a = t.toString(16), o = "00000000".substring(0, 8 - a.length) + a, n = new TextEncoder().encode(`;0x${o};`), i = new Uint8Array(12 + t);
  return i.set(n), i.set(r, 12), i;
}
function v(e, r) {
  return new ReadableStream({ start(t) {
    crossSerializeStream(r, { scopeId: e, plugins: E, onSerialize(a, o) {
      t.enqueue(j(o ? `(${getCrossReferenceHeader(e)},${a})` : a));
    }, onDone() {
      t.close();
    }, onError(a) {
      t.error(a);
    } });
  } });
}
function Rt(e) {
  return new ReadableStream({ start(r) {
    toCrossJSONStream(e, { disabledFeatures: _, depthLimit: Pt, plugins: E, onParse(t) {
      r.enqueue(j(JSON.stringify(t)));
    }, onDone() {
      r.close();
    }, onError(t) {
      r.error(t);
    } });
  } });
}
async function $$1(e) {
  return fromJSON(JSON.parse(e), { plugins: E, disabledFeatures: _ });
}
async function Dt(e) {
  const r = st(e), t = r.request, a = t.headers.get("X-Server-Id"), o = t.headers.get("X-Server-Instance"), n = t.headers.has("X-Single-Flight"), i = new URL(t.url);
  let d, m;
  if (a) et(typeof a == "string", "Invalid server function"), [d, m] = decodeURIComponent(a).split("#");
  else if (d = i.searchParams.get("id"), m = i.searchParams.get("name"), !d || !m) return new Response(null, { status: 404 });
  const u = kt[d];
  let g;
  if (!u) return new Response(null, { status: 404 });
  g = await u.importer();
  const M = g[u.functionName];
  let h = [];
  if (!o || e.method === "GET") {
    const s = i.searchParams.get("args");
    if (s) {
      const p = await $$1(s);
      for (const f of p) h.push(f);
    }
  }
  if (e.method === "POST") {
    const s = t.headers.get("content-type"), p = e.node.req, f = p instanceof ReadableStream, W = p.body instanceof ReadableStream, B = f && p.locked || W && p.body.locked, z = f ? p : p.body, R = B ? t : new Request(t, { ...t, body: z });
    t.headers.get("x-serialized") ? h = await $$1(await R.text()) : (s == null ? void 0 : s.startsWith("multipart/form-data")) || (s == null ? void 0 : s.startsWith("application/x-www-form-urlencoded")) ? h.push(await R.formData()) : (s == null ? void 0 : s.startsWith("application/json")) && (h = await R.json());
  }
  try {
    let s = await provideRequestEvent(r, async () => (sharedConfig.context = { event: r }, r.locals.serverFunctionMeta = { id: d + "#" + m }, M(...h)));
    if (n && o && (s = await V(r, s)), s instanceof Response) {
      if (s.headers && s.headers.has("X-Content-Raw")) return s;
      o && (s.headers && O$1(e, s.headers), s.status && (s.status < 300 || s.status >= 400) && P$1(e, s.status), s.customBody ? s = await s.customBody() : s.body == null && (s = null));
    }
    if (!o) return q(s, t, h);
    return l(e, "x-serialized", "true"), l(e, "content-type", "text/javascript"), v(o, s);
    return Rt(s);
  } catch (s) {
    if (s instanceof Response) n && o && (s = await V(r, s)), s.headers && O$1(e, s.headers), s.status && (!o || s.status < 300 || s.status >= 400) && P$1(e, s.status), s.customBody ? s = s.customBody() : s.body == null && (s = null), l(e, "X-Error", "true");
    else if (o) {
      const p = s instanceof Error ? s.message : typeof s == "string" ? s : "true";
      l(e, "X-Error", p.replace(/[\r\n]+/g, ""));
    } else s = q(s, t, h, true);
    return o ? (l(e, "x-serialized", "true"), l(e, "content-type", "text/javascript"), v(o, s)) : s;
  }
}
function q(e, r, t, a) {
  const o = new URL(r.url), n = e instanceof Error;
  let i = 302, d;
  return e instanceof Response ? (d = new Headers(e.headers), e.headers.has("Location") && (d.set("Location", new URL(e.headers.get("Location"), o.origin + "").toString()), i = yt(e))) : d = new Headers({ Location: new URL(r.headers.get("referer")).toString() }), e && d.append("Set-Cookie", `flash=${encodeURIComponent(JSON.stringify({ url: o.pathname + o.search, result: n ? e.message : e, thrown: a, error: n, input: [...t.slice(0, -1), [...t[t.length - 1].entries()]] }))}; Secure; HttpOnly;`), new Response(null, { status: i, headers: d });
}
let b$1;
function xt(e) {
  var _a;
  const r = new Headers(e.request.headers), t = We(e.nativeEvent), a = e.response.headers.getSetCookie();
  r.delete("cookie");
  let o = false;
  return ((_a = e.nativeEvent.node) == null ? void 0 : _a.req) && (o = true, e.nativeEvent.node.req.headers.cookie = ""), a.forEach((n) => {
    if (!n) return;
    const { maxAge: i, expires: d, name: m, value: u } = parseSetCookie(n);
    if (i != null && i <= 0) {
      delete t[m];
      return;
    }
    if (d != null && d.getTime() <= Date.now()) {
      delete t[m];
      return;
    }
    t[m] = u;
  }), Object.entries(t).forEach(([n, i]) => {
    r.append("cookie", `${n}=${i}`), o && (e.nativeEvent.node.req.headers.cookie += `${n}=${i};`);
  }), r;
}
async function V(e, r) {
  let t, a = new URL(e.request.headers.get("referer")).toString();
  r instanceof Response && (r.headers.has("X-Revalidate") && (t = r.headers.get("X-Revalidate").split(",")), r.headers.has("Location") && (a = new URL(r.headers.get("Location"), new URL(e.request.url).origin + "").toString()));
  const o = rt(e);
  return o.request = new Request(a, { headers: xt(e) }), await provideRequestEvent(o, async () => {
    await gt(o), b$1 || (b$1 = (await import('../build/app-DoraYe4b.mjs')).default), o.router.dataOnly = t || true, o.router.previousUrl = e.request.headers.get("referer");
    try {
      renderToString(() => {
        sharedConfig.context.event = o, b$1();
      });
    } catch (d) {
      console.log(d);
    }
    const n = o.router.data;
    if (!n) return r;
    let i = false;
    for (const d in n) n[d] === void 0 ? delete n[d] : i = true;
    return i && (r instanceof Response ? r.customBody && (n._$value = r.customBody()) : (n._$value = r, r = new Response(null, { status: 200 })), r.customBody = () => n, r.headers.set("X-Single-Flight", "true")), r;
  });
}
const Vt = eventHandler$1(Dt);

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
const te = isServer ? (e) => {
  const t = getRequestEvent();
  return t.response.status = e.code, t.response.statusText = e.text, onCleanup(() => !t.nativeEvent.handled && !t.complete && (t.response.status = 200)), null;
} : (e) => null;
var re = ["<span", ' style="font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%;">500 | Internal Server Error</span>'];
const se = (e) => {
  let t = false;
  const r = catchError(() => e.children, (s) => {
    console.error(s), t = !!s;
  });
  return t ? [ssr(re, ssrHydrationKey()), createComponent$1(te, { code: 500 })] : r;
};
var ae = " ";
const oe = { style: (e) => ssrElement("style", e.attrs, () => e.children, true), link: (e) => ssrElement("link", e.attrs, void 0, true), script: (e) => e.attrs.src ? ssrElement("script", mergeProps(() => e.attrs, { get id() {
  return e.key;
} }), () => ssr(ae), true) : null, noscript: (e) => ssrElement("noscript", e.attrs, () => escape(e.children), true) };
function ne(e, t) {
  let { tag: r, attrs: { key: s, ...o } = { key: void 0 }, children: a } = e;
  return oe[r]({ attrs: { ...o, nonce: t }, key: s, children: a });
}
var x = ["<script", ">", "<\/script>"], H = ["<script", ' type="module"', "><\/script>"];
const ie = ssr("<!DOCTYPE html>");
function de(e) {
  const t = getRequestEvent(), r = t.nonce;
  return createComponent$1(NoHydration, { get children() {
    return [ie, createComponent$1(se, { get children() {
      return createComponent$1(e.document, { get assets() {
        return t.assets.map((s) => ne(s));
      }, get scripts() {
        return r ? [ssr(x, ssrHydrationKey() + ssrAttribute("nonce", escape(r, true), false), `window.manifest = ${JSON.stringify(t.manifest)}`), ssr(H, ssrHydrationKey(), ssrAttribute("src", escape(globalThis.MANIFEST.client.inputs[globalThis.MANIFEST.client.handler].output.path, true), false))] : [ssr(x, ssrHydrationKey(), `window.manifest = ${JSON.stringify(t.manifest)}`), ssr(H, ssrHydrationKey(), ssrAttribute("src", escape(globalThis.MANIFEST.client.inputs[globalThis.MANIFEST.client.handler].output.path, true), false))];
      } });
    } })];
  } });
}
function pe(e) {
  let t;
  const r = S(e), s = { duplex: "half", method: e.method, headers: e.headers };
  return e.node.req.body instanceof ArrayBuffer ? new Request(r, { ...s, body: e.node.req.body }) : new Request(r, { ...s, get body() {
    return t || (t = ke(e), t);
  } });
}
function ce(e) {
  var _a;
  return (_a = e.web) != null ? _a : e.web = { request: pe(e), url: S(e) }, e.web.request;
}
function ue() {
  return Te();
}
const w = /* @__PURE__ */ Symbol("$HTTPEvent");
function me(e) {
  return typeof e == "object" && (e instanceof H3Event || (e == null ? void 0 : e[w]) instanceof H3Event || (e == null ? void 0 : e.__is_event__) === true);
}
function n(e) {
  return function(...t) {
    var _a;
    let r = t[0];
    if (me(r)) t[0] = r instanceof H3Event || r.__is_event__ ? r : r[w];
    else {
      if (!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext)) throw new Error("AsyncLocalStorage was not enabled. Use the `server.experimental.asyncContext: true` option in your app configuration to enable it. Or, pass the instance of HTTPEvent that you have as the first argument to the function.");
      if (r = ue(), !r) throw new Error("No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.");
      t.unshift(r);
    }
    return e(...t);
  };
}
const S = n(getRequestURL$1), he = n(getRequestIP), b = n(setResponseStatus$1), R = n(getResponseStatus), ge = n(getResponseStatusText), f = n(getResponseHeaders), O = n(getResponseHeader$1), le = n(setResponseHeader$1), fe = n(appendResponseHeader$1), ye = n(sendRedirect$1), ke = n(getRequestWebStream), Pe = n(removeResponseHeader$1), De = n(ce);
function Ee() {
  var _a;
  return getContext("nitro-app", { asyncContext: !!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext), AsyncLocalStorage: AsyncLocalStorage });
}
function Te() {
  return Ee().use().event;
}
const $ = [{ page: true, path: "/api/pykeyboard", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/api/pykeyboard.tsx" }, { page: true, path: "/api/pyrogram-patch", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/api/pyrogram-patch.tsx" }, { page: true, path: "/getting-started", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/getting-started.tsx" }, { page: true, path: "/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/index.tsx" }, { page: true, path: "/kurigram-addons/client", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/kurigram-addons/client.tsx" }, { page: true, path: "/kurigram-addons/command-parser", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/kurigram-addons/command-parser.tsx" }, { page: true, path: "/kurigram-addons/conversation", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/kurigram-addons/conversation.tsx" }, { page: true, path: "/kurigram-addons/depends", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/kurigram-addons/depends.tsx" }, { page: true, path: "/kurigram-addons/flood-wait", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/kurigram-addons/flood-wait.tsx" }, { page: true, path: "/kurigram-addons/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/kurigram-addons/index.tsx" }, { page: true, path: "/kurigram-addons/lifecycle-hooks", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/kurigram-addons/lifecycle-hooks.tsx" }, { page: true, path: "/kurigram-addons/menu", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/kurigram-addons/menu.tsx" }, { page: true, path: "/kurigram-addons/rate-limit", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/kurigram-addons/rate-limit.tsx" }, { page: true, path: "/migration", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/migration.tsx" }, { page: true, path: "/pykeyboard/builder", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/builder.tsx" }, { page: true, path: "/pykeyboard/factory", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/factory.tsx" }, { page: true, path: "/pykeyboard/hooks", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/hooks.tsx" }, { page: true, path: "/pykeyboard/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/index.tsx" }, { page: true, path: "/pykeyboard/inline-keyboard", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/inline-keyboard.tsx" }, { page: true, path: "/pykeyboard/languages", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/languages.tsx" }, { page: true, path: "/pykeyboard/pagination", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/pagination.tsx" }, { page: true, path: "/pykeyboard/reply-keyboard", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/reply-keyboard.tsx" }, { page: true, path: "/pykeyboard/utilities", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/utilities.tsx" }, { page: true, path: "/pyrogram-patch/circuit-breaker", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/circuit-breaker.tsx" }, { page: true, path: "/pyrogram-patch/configuration", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/configuration.tsx" }, { page: true, path: "/pyrogram-patch/errors", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/errors.tsx" }, { page: true, path: "/pyrogram-patch/fsm/filters", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/fsm/filters.tsx" }, { page: true, path: "/pyrogram-patch/fsm/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/fsm/index.tsx" }, { page: true, path: "/pyrogram-patch/fsm/states", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/fsm/states.tsx" }, { page: true, path: "/pyrogram-patch/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/index.tsx" }, { page: true, path: "/pyrogram-patch/middleware/fsm-inject", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/middleware/fsm-inject.tsx" }, { page: true, path: "/pyrogram-patch/middleware/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/middleware/index.tsx" }, { page: true, path: "/pyrogram-patch/middleware/rate-limit", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/middleware/rate-limit.tsx" }, { page: true, path: "/pyrogram-patch/middleware/writing", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/middleware/writing.tsx" }, { page: true, path: "/pyrogram-patch/patch-helper", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/patch-helper.tsx" }, { page: true, path: "/pyrogram-patch/patching", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/patching.tsx" }, { page: true, path: "/pyrogram-patch/router", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/router.tsx" }, { page: true, path: "/pyrogram-patch/storage/custom", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/storage/custom.tsx" }, { page: true, path: "/pyrogram-patch/storage/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/storage/index.tsx" }, { page: true, path: "/pyrogram-patch/storage/memory", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/storage/memory.tsx" }, { page: true, path: "/pyrogram-patch/storage/redis", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/storage/redis.tsx" }];
xe($.filter((e) => e.page));
function xe(e) {
  function t(r, s, o, a) {
    const d = Object.values(r).find((i) => o.startsWith(i.id + "/"));
    return d ? (t(d.children || (d.children = []), s, o.slice(d.id.length)), r) : (r.push({ ...s, id: o, path: o.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/") }), r);
  }
  return e.sort((r, s) => r.path.length - s.path.length).reduce((r, s) => t(r, s, s.path, s.path), []);
}
function He(e, t) {
  const r = Re.lookup(e);
  if (r && r.route) {
    const s = r.route, o = t === "HEAD" ? s.$HEAD || s.$GET : s[`$${t}`];
    if (o === void 0) return;
    const a = s.page === true && s.$component !== void 0;
    return { handler: o, params: r.params, isPage: a };
  }
}
function be(e) {
  return e.$HEAD || e.$GET || e.$POST || e.$PUT || e.$PATCH || e.$DELETE;
}
const Re = createRouter({ routes: $.reduce((e, t) => {
  if (!be(t)) return e;
  let r = t.path.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/").replace(/\*([^/]*)/g, (s, o) => `**:${o}`).split("/").map((s) => s.startsWith(":") || s.startsWith("*") ? s : encodeURIComponent(s)).join("/");
  if (/:[^/]*\?/g.test(r)) throw new Error(`Optional parameters are not supported in API routes: ${r}`);
  if (e[r]) throw new Error(`Duplicate API routes for "${r}" found at "${e[r].route.path}" and "${t.path}"`);
  return e[r] = { route: t }, e;
}, {}) }), P = "solidFetchEvent";
function Oe(e) {
  return { request: De(e), response: we(e), clientAddress: he(e), locals: {}, nativeEvent: e };
}
function Ne(e) {
  if (!e.context[P]) {
    const t = Oe(e);
    e.context[P] = t;
  }
  return e.context[P];
}
class ve {
  constructor(t) {
    __publicField(this, "event");
    this.event = t;
  }
  get(t) {
    const r = O(this.event, t);
    return Array.isArray(r) ? r.join(", ") : r || null;
  }
  has(t) {
    return this.get(t) !== null;
  }
  set(t, r) {
    return le(this.event, t, r);
  }
  delete(t) {
    return Pe(this.event, t);
  }
  append(t, r) {
    fe(this.event, t, r);
  }
  getSetCookie() {
    const t = O(this.event, "Set-Cookie");
    return Array.isArray(t) ? t : [t];
  }
  forEach(t) {
    return Object.entries(f(this.event)).forEach(([r, s]) => t(Array.isArray(s) ? s.join(", ") : s, r, this));
  }
  entries() {
    return Object.entries(f(this.event)).map(([t, r]) => [t, Array.isArray(r) ? r.join(", ") : r])[Symbol.iterator]();
  }
  keys() {
    return Object.keys(f(this.event))[Symbol.iterator]();
  }
  values() {
    return Object.values(f(this.event)).map((t) => Array.isArray(t) ? t.join(", ") : t)[Symbol.iterator]();
  }
  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
}
function we(e) {
  return { get status() {
    return R(e);
  }, set status(t) {
    b(e, t);
  }, get statusText() {
    return ge(e);
  }, set statusText(t) {
    b(e, R(e), t);
  }, headers: new ve(e) };
}
const Se = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function $e(e) {
  return e.status && Se.has(e.status) ? e.status : 302;
}
function Ye(e, t, r = {}, s) {
  return eventHandler$1({ handler: (o) => {
    const a = Ne(o);
    return provideRequestEvent(a, async () => {
      const d = He(new URL(a.request.url).pathname, a.request.method);
      if (d) {
        const h = await d.handler.import(), y = a.request.method === "HEAD" ? h.HEAD || h.GET : h[a.request.method];
        a.params = d.params || {}, sharedConfig.context = { event: a };
        const E = await y(a);
        if (E !== void 0) return E;
        if (a.request.method !== "GET") throw new Error(`API handler for ${a.request.method} "${a.request.url}" did not return a response.`);
        if (!d.isPage) return;
      }
      const i = await t(a), g = typeof r == "function" ? await r(i) : { ...r };
      g.mode, g.nonce && (i.nonce = g.nonce);
      {
        const h = renderToString(() => (sharedConfig.context.event = i, e(i)), g);
        if (i.complete = true, i.response && i.response.headers.get("Location")) {
          const y = $e(i.response);
          return ye(o, i.response.headers.get("Location"), y);
        }
        return h;
      }
    });
  } });
}
function Ve(e, t, r) {
  return Ye(e, Ae, t);
}
async function Ae(e) {
  const t = globalThis.MANIFEST.client;
  return Object.assign(e, { manifest: await t.json(), assets: [...await t.inputs[t.handler].assets()], routes: [], complete: false, $islands: /* @__PURE__ */ new Set() });
}
var qe = ['<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Modern Telegram bot toolkit for Kurigram/Pyrogram \u2014 declarative keyboards, FSM, middlewares, circuit breaker"><link rel="icon" href="', `"><script>
            (function() {
              var t = localStorage.getItem('theme');
              if (t === 'light') document.documentElement.classList.add('light-mode');
            })();
          <\/script>`, "</head>"], Ce = ["<html", ' lang="en">', '<body class="antialiased"><div id="app">', "</div><!--$-->", "<!--/--></body></html>"];
const Ue = Ve(() => createComponent$1(de, { document: ({ assets: e, children: t, scripts: r }) => ssr(Ce, ssrHydrationKey(), createComponent$1(NoHydration, { get children() {
  return ssr(qe, `${escape("/", true) || "/"}logo.png`, escape(e));
} }), escape(t), escape(r)) }));

const handlers = [
  { route: '', handler: _LVApmG, lazy: false, middleware: true, method: undefined },
  { route: '/_server', handler: Vt, lazy: false, middleware: true, method: undefined },
  { route: '/', handler: Ue, lazy: false, middleware: true, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => callNodeRequestHandler(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return fetchNodeRequestHandler(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  {
    const _handler = h3App.handler;
    h3App.handler = (event) => {
      const ctx = { event };
      return nitroAsyncContext.callAsync(ctx, () => _handler(event));
    };
  }
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

const nitroApp = useNitroApp();
const localFetch = nitroApp.localFetch;
const closePrerenderer = () => nitroApp.hooks.callHook("close");
trapUnhandledNodeErrors();

export { closePrerenderer as c, localFetch as l, qt as q };
//# sourceMappingURL=nitro.mjs.map
