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
import { sharedConfig, lazy, createComponent, createUniqueId, createMemo, useContext, createRenderEffect, onCleanup, createContext, createSignal, on, runWithOwner, getOwner, startTransition, resetErrorBoundaries, batch, untrack, catchError, ErrorBoundary, Suspense, children, Show, createRoot } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/solid-js/dist/server.js';
import { renderToString, isServer, getRequestEvent, ssrElement, escape, mergeProps, ssr, createComponent as createComponent$1, useAssets, spread, renderToStream, ssrHydrationKey, NoHydration, Hydration, ssrAttribute, HydrationScript, delegateEvents } from 'file:///home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/node_modules/solid-js/web/dist/server.js';
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
    "baseURL": "/kurigram-addons"
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
    const baseURL = "/kurigram-addons/";
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

const appConfig = {"name":"vinxi","routers":[{"name":"public","type":"static","base":"/","dir":"./public","root":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs","order":0,"outDir":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/.vinxi/build/public"},{"name":"ssr","type":"http","link":{"client":"client"},"handler":"src/entry-server.tsx","extensions":["js","jsx","ts","tsx"],"target":"server","root":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs","base":"/","outDir":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/.vinxi/build/ssr","order":1},{"name":"client","type":"client","base":"/_build","handler":"src/entry-client.tsx","extensions":["js","jsx","ts","tsx"],"target":"browser","root":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs","outDir":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/.vinxi/build/client","order":2},{"name":"server-fns","type":"http","base":"/_server","handler":"node_modules/@solidjs/start/dist/runtime/server-handler.js","target":"server","root":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs","outDir":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/.vinxi/build/server-fns","order":3}],"server":{"compressPublicAssets":{"brotli":true},"routeRules":{"/_build/assets/**":{"headers":{"cache-control":"public, immutable, max-age=31536000"}}},"experimental":{"asyncContext":true},"baseURL":"/kurigram-addons","preset":"static"},"root":"/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs"};
					const buildManifest = {"ssr":{"_CodeBlock-DbsgX-u-.js":{"file":"assets/CodeBlock-DbsgX-u-.js","name":"CodeBlock"},"_Layout-Dbj3yue-.js":{"file":"assets/Layout-Dbj3yue-.js","name":"Layout","imports":["_routing-DfEgUrGk.js"]},"_routing-DfEgUrGk.js":{"file":"assets/routing-DfEgUrGk.js","name":"routing"},"src/routes/api/pykeyboard.tsx?pick=default&pick=$css":{"file":"pykeyboard.js","name":"pykeyboard","src":"src/routes/api/pykeyboard.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/api/pyrogram-patch.tsx?pick=default&pick=$css":{"file":"pyrogram-patch.js","name":"pyrogram-patch","src":"src/routes/api/pyrogram-patch.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/getting-started.tsx?pick=default&pick=$css":{"file":"getting-started.js","name":"getting-started","src":"src/routes/getting-started.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js","_CodeBlock-DbsgX-u-.js"]},"src/routes/index.tsx?pick=default&pick=$css":{"file":"index.js","name":"index","src":"src/routes/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pykeyboard/builder.tsx?pick=default&pick=$css":{"file":"builder.js","name":"builder","src":"src/routes/pykeyboard/builder.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pykeyboard/factory.tsx?pick=default&pick=$css":{"file":"factory.js","name":"factory","src":"src/routes/pykeyboard/factory.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pykeyboard/hooks.tsx?pick=default&pick=$css":{"file":"hooks.js","name":"hooks","src":"src/routes/pykeyboard/hooks.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pykeyboard/index.tsx?pick=default&pick=$css":{"file":"index2.js","name":"index","src":"src/routes/pykeyboard/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js","_CodeBlock-DbsgX-u-.js"]},"src/routes/pykeyboard/inline-keyboard.tsx?pick=default&pick=$css":{"file":"inline-keyboard.js","name":"inline-keyboard","src":"src/routes/pykeyboard/inline-keyboard.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js","_CodeBlock-DbsgX-u-.js"]},"src/routes/pykeyboard/languages.tsx?pick=default&pick=$css":{"file":"languages.js","name":"languages","src":"src/routes/pykeyboard/languages.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pykeyboard/pagination.tsx?pick=default&pick=$css":{"file":"pagination.js","name":"pagination","src":"src/routes/pykeyboard/pagination.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pykeyboard/reply-keyboard.tsx?pick=default&pick=$css":{"file":"reply-keyboard.js","name":"reply-keyboard","src":"src/routes/pykeyboard/reply-keyboard.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pykeyboard/utilities.tsx?pick=default&pick=$css":{"file":"utilities.js","name":"utilities","src":"src/routes/pykeyboard/utilities.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pyrogram-patch/circuit-breaker.tsx?pick=default&pick=$css":{"file":"circuit-breaker.js","name":"circuit-breaker","src":"src/routes/pyrogram-patch/circuit-breaker.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pyrogram-patch/configuration.tsx?pick=default&pick=$css":{"file":"configuration.js","name":"configuration","src":"src/routes/pyrogram-patch/configuration.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pyrogram-patch/dispatcher.tsx?pick=default&pick=$css":{"file":"dispatcher.js","name":"dispatcher","src":"src/routes/pyrogram-patch/dispatcher.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pyrogram-patch/errors.tsx?pick=default&pick=$css":{"file":"errors.js","name":"errors","src":"src/routes/pyrogram-patch/errors.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pyrogram-patch/fsm/context.tsx?pick=default&pick=$css":{"file":"context.js","name":"context","src":"src/routes/pyrogram-patch/fsm/context.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pyrogram-patch/fsm/filters.tsx?pick=default&pick=$css":{"file":"filters.js","name":"filters","src":"src/routes/pyrogram-patch/fsm/filters.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pyrogram-patch/fsm/index.tsx?pick=default&pick=$css":{"file":"index3.js","name":"index","src":"src/routes/pyrogram-patch/fsm/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pyrogram-patch/fsm/states.tsx?pick=default&pick=$css":{"file":"states.js","name":"states","src":"src/routes/pyrogram-patch/fsm/states.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js","_CodeBlock-DbsgX-u-.js"]},"src/routes/pyrogram-patch/index.tsx?pick=default&pick=$css":{"file":"index4.js","name":"index","src":"src/routes/pyrogram-patch/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js","_CodeBlock-DbsgX-u-.js"]},"src/routes/pyrogram-patch/middleware/context.tsx?pick=default&pick=$css":{"file":"context2.js","name":"context","src":"src/routes/pyrogram-patch/middleware/context.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pyrogram-patch/middleware/fsm-inject.tsx?pick=default&pick=$css":{"file":"fsm-inject.js","name":"fsm-inject","src":"src/routes/pyrogram-patch/middleware/fsm-inject.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pyrogram-patch/middleware/index.tsx?pick=default&pick=$css":{"file":"index5.js","name":"index","src":"src/routes/pyrogram-patch/middleware/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js","_CodeBlock-DbsgX-u-.js"]},"src/routes/pyrogram-patch/middleware/rate-limit.tsx?pick=default&pick=$css":{"file":"rate-limit.js","name":"rate-limit","src":"src/routes/pyrogram-patch/middleware/rate-limit.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pyrogram-patch/middleware/writing.tsx?pick=default&pick=$css":{"file":"writing.js","name":"writing","src":"src/routes/pyrogram-patch/middleware/writing.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pyrogram-patch/patch-helper.tsx?pick=default&pick=$css":{"file":"patch-helper.js","name":"patch-helper","src":"src/routes/pyrogram-patch/patch-helper.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pyrogram-patch/patching.tsx?pick=default&pick=$css":{"file":"patching.js","name":"patching","src":"src/routes/pyrogram-patch/patching.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pyrogram-patch/router.tsx?pick=default&pick=$css":{"file":"router.js","name":"router","src":"src/routes/pyrogram-patch/router.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pyrogram-patch/storage/custom.tsx?pick=default&pick=$css":{"file":"custom.js","name":"custom","src":"src/routes/pyrogram-patch/storage/custom.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pyrogram-patch/storage/index.tsx?pick=default&pick=$css":{"file":"index6.js","name":"index","src":"src/routes/pyrogram-patch/storage/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js","_CodeBlock-DbsgX-u-.js"]},"src/routes/pyrogram-patch/storage/memory.tsx?pick=default&pick=$css":{"file":"memory.js","name":"memory","src":"src/routes/pyrogram-patch/storage/memory.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js"]},"src/routes/pyrogram-patch/storage/redis.tsx?pick=default&pick=$css":{"file":"redis.js","name":"redis","src":"src/routes/pyrogram-patch/storage/redis.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-DfEgUrGk.js","_Layout-Dbj3yue-.js","_CodeBlock-DbsgX-u-.js"]},"virtual:$vinxi/handler/ssr":{"file":"ssr.js","name":"ssr","src":"virtual:$vinxi/handler/ssr","isEntry":true,"imports":["_routing-DfEgUrGk.js"],"dynamicImports":["src/routes/api/pykeyboard.tsx?pick=default&pick=$css","src/routes/api/pykeyboard.tsx?pick=default&pick=$css","src/routes/api/pyrogram-patch.tsx?pick=default&pick=$css","src/routes/api/pyrogram-patch.tsx?pick=default&pick=$css","src/routes/getting-started.tsx?pick=default&pick=$css","src/routes/getting-started.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/pykeyboard/builder.tsx?pick=default&pick=$css","src/routes/pykeyboard/builder.tsx?pick=default&pick=$css","src/routes/pykeyboard/factory.tsx?pick=default&pick=$css","src/routes/pykeyboard/factory.tsx?pick=default&pick=$css","src/routes/pykeyboard/hooks.tsx?pick=default&pick=$css","src/routes/pykeyboard/hooks.tsx?pick=default&pick=$css","src/routes/pykeyboard/index.tsx?pick=default&pick=$css","src/routes/pykeyboard/index.tsx?pick=default&pick=$css","src/routes/pykeyboard/inline-keyboard.tsx?pick=default&pick=$css","src/routes/pykeyboard/inline-keyboard.tsx?pick=default&pick=$css","src/routes/pykeyboard/languages.tsx?pick=default&pick=$css","src/routes/pykeyboard/languages.tsx?pick=default&pick=$css","src/routes/pykeyboard/pagination.tsx?pick=default&pick=$css","src/routes/pykeyboard/pagination.tsx?pick=default&pick=$css","src/routes/pykeyboard/reply-keyboard.tsx?pick=default&pick=$css","src/routes/pykeyboard/reply-keyboard.tsx?pick=default&pick=$css","src/routes/pykeyboard/utilities.tsx?pick=default&pick=$css","src/routes/pykeyboard/utilities.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/circuit-breaker.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/circuit-breaker.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/configuration.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/configuration.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/dispatcher.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/dispatcher.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/errors.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/errors.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/context.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/context.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/filters.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/filters.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/states.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/states.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/context.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/context.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/fsm-inject.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/fsm-inject.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/rate-limit.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/rate-limit.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/writing.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/writing.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/patch-helper.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/patch-helper.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/patching.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/patching.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/router.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/router.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/custom.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/custom.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/memory.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/memory.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/redis.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/redis.tsx?pick=default&pick=$css"],"css":["assets/ssr-BDHOLjua.css"]}},"client":{"_CodeBlock-Dd_uXXMh.js":{"file":"assets/CodeBlock-Dd_uXXMh.js","name":"CodeBlock","imports":["_routing-Bag1el6N.js"]},"_Layout-CuskbCXQ.js":{"file":"assets/Layout-CuskbCXQ.js","name":"Layout","imports":["_routing-Bag1el6N.js"]},"_routing-Bag1el6N.js":{"file":"assets/routing-Bag1el6N.js","name":"routing"},"src/routes/api/pykeyboard.tsx?pick=default&pick=$css":{"file":"assets/pykeyboard-BQ6zHW5K.js","name":"pykeyboard","src":"src/routes/api/pykeyboard.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/api/pyrogram-patch.tsx?pick=default&pick=$css":{"file":"assets/pyrogram-patch-UbkSyoxG.js","name":"pyrogram-patch","src":"src/routes/api/pyrogram-patch.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/getting-started.tsx?pick=default&pick=$css":{"file":"assets/getting-started-Ie0D20BU.js","name":"getting-started","src":"src/routes/getting-started.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js","_CodeBlock-Dd_uXXMh.js"]},"src/routes/index.tsx?pick=default&pick=$css":{"file":"assets/index-BsbuSHUz.js","name":"index","src":"src/routes/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pykeyboard/builder.tsx?pick=default&pick=$css":{"file":"assets/builder-CnvGWMZx.js","name":"builder","src":"src/routes/pykeyboard/builder.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pykeyboard/factory.tsx?pick=default&pick=$css":{"file":"assets/factory-C_8eymeL.js","name":"factory","src":"src/routes/pykeyboard/factory.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pykeyboard/hooks.tsx?pick=default&pick=$css":{"file":"assets/hooks-v2-toloP.js","name":"hooks","src":"src/routes/pykeyboard/hooks.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pykeyboard/index.tsx?pick=default&pick=$css":{"file":"assets/index-Bn2whYHn.js","name":"index","src":"src/routes/pykeyboard/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js","_CodeBlock-Dd_uXXMh.js"]},"src/routes/pykeyboard/inline-keyboard.tsx?pick=default&pick=$css":{"file":"assets/inline-keyboard-TjGC-yOc.js","name":"inline-keyboard","src":"src/routes/pykeyboard/inline-keyboard.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js","_CodeBlock-Dd_uXXMh.js"]},"src/routes/pykeyboard/languages.tsx?pick=default&pick=$css":{"file":"assets/languages-PQubgEMX.js","name":"languages","src":"src/routes/pykeyboard/languages.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pykeyboard/pagination.tsx?pick=default&pick=$css":{"file":"assets/pagination-U4ZGR5IK.js","name":"pagination","src":"src/routes/pykeyboard/pagination.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pykeyboard/reply-keyboard.tsx?pick=default&pick=$css":{"file":"assets/reply-keyboard-Ci6CeNAB.js","name":"reply-keyboard","src":"src/routes/pykeyboard/reply-keyboard.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pykeyboard/utilities.tsx?pick=default&pick=$css":{"file":"assets/utilities-CacxpWPW.js","name":"utilities","src":"src/routes/pykeyboard/utilities.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pyrogram-patch/circuit-breaker.tsx?pick=default&pick=$css":{"file":"assets/circuit-breaker-BMeozgmt.js","name":"circuit-breaker","src":"src/routes/pyrogram-patch/circuit-breaker.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pyrogram-patch/configuration.tsx?pick=default&pick=$css":{"file":"assets/configuration-Bsm85JL6.js","name":"configuration","src":"src/routes/pyrogram-patch/configuration.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pyrogram-patch/dispatcher.tsx?pick=default&pick=$css":{"file":"assets/dispatcher-Bu-PWUwc.js","name":"dispatcher","src":"src/routes/pyrogram-patch/dispatcher.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pyrogram-patch/errors.tsx?pick=default&pick=$css":{"file":"assets/errors-B3UdVU1X.js","name":"errors","src":"src/routes/pyrogram-patch/errors.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pyrogram-patch/fsm/context.tsx?pick=default&pick=$css":{"file":"assets/context-YvKoH_-R.js","name":"context","src":"src/routes/pyrogram-patch/fsm/context.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pyrogram-patch/fsm/filters.tsx?pick=default&pick=$css":{"file":"assets/filters-ByEE4IME.js","name":"filters","src":"src/routes/pyrogram-patch/fsm/filters.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pyrogram-patch/fsm/index.tsx?pick=default&pick=$css":{"file":"assets/index-BpHEna9m.js","name":"index","src":"src/routes/pyrogram-patch/fsm/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pyrogram-patch/fsm/states.tsx?pick=default&pick=$css":{"file":"assets/states-BnErhVOw.js","name":"states","src":"src/routes/pyrogram-patch/fsm/states.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js","_CodeBlock-Dd_uXXMh.js"]},"src/routes/pyrogram-patch/index.tsx?pick=default&pick=$css":{"file":"assets/index-DTwLumPE.js","name":"index","src":"src/routes/pyrogram-patch/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js","_CodeBlock-Dd_uXXMh.js"]},"src/routes/pyrogram-patch/middleware/context.tsx?pick=default&pick=$css":{"file":"assets/context-DYAf4EGY.js","name":"context","src":"src/routes/pyrogram-patch/middleware/context.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pyrogram-patch/middleware/fsm-inject.tsx?pick=default&pick=$css":{"file":"assets/fsm-inject-Deyai52N.js","name":"fsm-inject","src":"src/routes/pyrogram-patch/middleware/fsm-inject.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pyrogram-patch/middleware/index.tsx?pick=default&pick=$css":{"file":"assets/index-DD43TNCL.js","name":"index","src":"src/routes/pyrogram-patch/middleware/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js","_CodeBlock-Dd_uXXMh.js"]},"src/routes/pyrogram-patch/middleware/rate-limit.tsx?pick=default&pick=$css":{"file":"assets/rate-limit-nNaNU1iA.js","name":"rate-limit","src":"src/routes/pyrogram-patch/middleware/rate-limit.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pyrogram-patch/middleware/writing.tsx?pick=default&pick=$css":{"file":"assets/writing-B2QpS_NM.js","name":"writing","src":"src/routes/pyrogram-patch/middleware/writing.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pyrogram-patch/patch-helper.tsx?pick=default&pick=$css":{"file":"assets/patch-helper-C43IohXc.js","name":"patch-helper","src":"src/routes/pyrogram-patch/patch-helper.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pyrogram-patch/patching.tsx?pick=default&pick=$css":{"file":"assets/patching-CYYyppJb.js","name":"patching","src":"src/routes/pyrogram-patch/patching.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pyrogram-patch/router.tsx?pick=default&pick=$css":{"file":"assets/router-CC2bvShi.js","name":"router","src":"src/routes/pyrogram-patch/router.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pyrogram-patch/storage/custom.tsx?pick=default&pick=$css":{"file":"assets/custom-CeUX1rpQ.js","name":"custom","src":"src/routes/pyrogram-patch/storage/custom.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pyrogram-patch/storage/index.tsx?pick=default&pick=$css":{"file":"assets/index-GW95Cnhp.js","name":"index","src":"src/routes/pyrogram-patch/storage/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js","_CodeBlock-Dd_uXXMh.js"]},"src/routes/pyrogram-patch/storage/memory.tsx?pick=default&pick=$css":{"file":"assets/memory-Qy90m2TK.js","name":"memory","src":"src/routes/pyrogram-patch/storage/memory.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js"]},"src/routes/pyrogram-patch/storage/redis.tsx?pick=default&pick=$css":{"file":"assets/redis-BwC_5H6e.js","name":"redis","src":"src/routes/pyrogram-patch/storage/redis.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bag1el6N.js","_Layout-CuskbCXQ.js","_CodeBlock-Dd_uXXMh.js"]},"virtual:$vinxi/handler/client":{"file":"assets/client-MXGGO26S.js","name":"client","src":"virtual:$vinxi/handler/client","isEntry":true,"imports":["_routing-Bag1el6N.js"],"dynamicImports":["src/routes/api/pykeyboard.tsx?pick=default&pick=$css","src/routes/api/pyrogram-patch.tsx?pick=default&pick=$css","src/routes/getting-started.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/pykeyboard/builder.tsx?pick=default&pick=$css","src/routes/pykeyboard/factory.tsx?pick=default&pick=$css","src/routes/pykeyboard/hooks.tsx?pick=default&pick=$css","src/routes/pykeyboard/index.tsx?pick=default&pick=$css","src/routes/pykeyboard/inline-keyboard.tsx?pick=default&pick=$css","src/routes/pykeyboard/languages.tsx?pick=default&pick=$css","src/routes/pykeyboard/pagination.tsx?pick=default&pick=$css","src/routes/pykeyboard/reply-keyboard.tsx?pick=default&pick=$css","src/routes/pykeyboard/utilities.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/circuit-breaker.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/configuration.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/dispatcher.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/errors.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/context.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/filters.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/states.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/context.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/fsm-inject.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/rate-limit.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/writing.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/patch-helper.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/patching.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/router.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/custom.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/memory.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/redis.tsx?pick=default&pick=$css"],"css":["assets/client-BDHOLjua.css"]}},"server-fns":{"_CodeBlock-DbsgX-u-.js":{"file":"assets/CodeBlock-DbsgX-u-.js","name":"CodeBlock"},"_Layout-DR96B_gr.js":{"file":"assets/Layout-DR96B_gr.js","name":"Layout","imports":["_routing-Bcfgh2vJ.js"]},"_routing-Bcfgh2vJ.js":{"file":"assets/routing-Bcfgh2vJ.js","name":"routing"},"_server-fns-DiNL1Qlw.js":{"file":"assets/server-fns-DiNL1Qlw.js","name":"server-fns","dynamicImports":["src/routes/api/pykeyboard.tsx?pick=default&pick=$css","src/routes/api/pykeyboard.tsx?pick=default&pick=$css","src/routes/api/pyrogram-patch.tsx?pick=default&pick=$css","src/routes/api/pyrogram-patch.tsx?pick=default&pick=$css","src/routes/getting-started.tsx?pick=default&pick=$css","src/routes/getting-started.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/pykeyboard/builder.tsx?pick=default&pick=$css","src/routes/pykeyboard/builder.tsx?pick=default&pick=$css","src/routes/pykeyboard/factory.tsx?pick=default&pick=$css","src/routes/pykeyboard/factory.tsx?pick=default&pick=$css","src/routes/pykeyboard/hooks.tsx?pick=default&pick=$css","src/routes/pykeyboard/hooks.tsx?pick=default&pick=$css","src/routes/pykeyboard/index.tsx?pick=default&pick=$css","src/routes/pykeyboard/index.tsx?pick=default&pick=$css","src/routes/pykeyboard/inline-keyboard.tsx?pick=default&pick=$css","src/routes/pykeyboard/inline-keyboard.tsx?pick=default&pick=$css","src/routes/pykeyboard/languages.tsx?pick=default&pick=$css","src/routes/pykeyboard/languages.tsx?pick=default&pick=$css","src/routes/pykeyboard/pagination.tsx?pick=default&pick=$css","src/routes/pykeyboard/pagination.tsx?pick=default&pick=$css","src/routes/pykeyboard/reply-keyboard.tsx?pick=default&pick=$css","src/routes/pykeyboard/reply-keyboard.tsx?pick=default&pick=$css","src/routes/pykeyboard/utilities.tsx?pick=default&pick=$css","src/routes/pykeyboard/utilities.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/circuit-breaker.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/circuit-breaker.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/configuration.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/configuration.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/dispatcher.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/dispatcher.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/errors.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/errors.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/context.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/context.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/filters.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/filters.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/states.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/fsm/states.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/context.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/context.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/fsm-inject.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/fsm-inject.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/rate-limit.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/rate-limit.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/writing.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/middleware/writing.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/patch-helper.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/patch-helper.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/patching.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/patching.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/router.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/router.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/custom.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/custom.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/index.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/memory.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/memory.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/redis.tsx?pick=default&pick=$css","src/routes/pyrogram-patch/storage/redis.tsx?pick=default&pick=$css","src/app.tsx"]},"src/app.tsx":{"file":"assets/app-Hb9Cp-9u.js","name":"app","src":"src/app.tsx","isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_server-fns-DiNL1Qlw.js"],"css":["assets/app-BDHOLjua.css"]},"src/routes/api/pykeyboard.tsx?pick=default&pick=$css":{"file":"pykeyboard.js","name":"pykeyboard","src":"src/routes/api/pykeyboard.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/api/pyrogram-patch.tsx?pick=default&pick=$css":{"file":"pyrogram-patch.js","name":"pyrogram-patch","src":"src/routes/api/pyrogram-patch.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/getting-started.tsx?pick=default&pick=$css":{"file":"getting-started.js","name":"getting-started","src":"src/routes/getting-started.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js","_CodeBlock-DbsgX-u-.js"]},"src/routes/index.tsx?pick=default&pick=$css":{"file":"index.js","name":"index","src":"src/routes/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pykeyboard/builder.tsx?pick=default&pick=$css":{"file":"builder.js","name":"builder","src":"src/routes/pykeyboard/builder.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pykeyboard/factory.tsx?pick=default&pick=$css":{"file":"factory.js","name":"factory","src":"src/routes/pykeyboard/factory.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pykeyboard/hooks.tsx?pick=default&pick=$css":{"file":"hooks.js","name":"hooks","src":"src/routes/pykeyboard/hooks.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pykeyboard/index.tsx?pick=default&pick=$css":{"file":"index2.js","name":"index","src":"src/routes/pykeyboard/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js","_CodeBlock-DbsgX-u-.js"]},"src/routes/pykeyboard/inline-keyboard.tsx?pick=default&pick=$css":{"file":"inline-keyboard.js","name":"inline-keyboard","src":"src/routes/pykeyboard/inline-keyboard.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js","_CodeBlock-DbsgX-u-.js"]},"src/routes/pykeyboard/languages.tsx?pick=default&pick=$css":{"file":"languages.js","name":"languages","src":"src/routes/pykeyboard/languages.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pykeyboard/pagination.tsx?pick=default&pick=$css":{"file":"pagination.js","name":"pagination","src":"src/routes/pykeyboard/pagination.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pykeyboard/reply-keyboard.tsx?pick=default&pick=$css":{"file":"reply-keyboard.js","name":"reply-keyboard","src":"src/routes/pykeyboard/reply-keyboard.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pykeyboard/utilities.tsx?pick=default&pick=$css":{"file":"utilities.js","name":"utilities","src":"src/routes/pykeyboard/utilities.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pyrogram-patch/circuit-breaker.tsx?pick=default&pick=$css":{"file":"circuit-breaker.js","name":"circuit-breaker","src":"src/routes/pyrogram-patch/circuit-breaker.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pyrogram-patch/configuration.tsx?pick=default&pick=$css":{"file":"configuration.js","name":"configuration","src":"src/routes/pyrogram-patch/configuration.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pyrogram-patch/dispatcher.tsx?pick=default&pick=$css":{"file":"dispatcher.js","name":"dispatcher","src":"src/routes/pyrogram-patch/dispatcher.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pyrogram-patch/errors.tsx?pick=default&pick=$css":{"file":"errors.js","name":"errors","src":"src/routes/pyrogram-patch/errors.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pyrogram-patch/fsm/context.tsx?pick=default&pick=$css":{"file":"context.js","name":"context","src":"src/routes/pyrogram-patch/fsm/context.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pyrogram-patch/fsm/filters.tsx?pick=default&pick=$css":{"file":"filters.js","name":"filters","src":"src/routes/pyrogram-patch/fsm/filters.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pyrogram-patch/fsm/index.tsx?pick=default&pick=$css":{"file":"index3.js","name":"index","src":"src/routes/pyrogram-patch/fsm/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pyrogram-patch/fsm/states.tsx?pick=default&pick=$css":{"file":"states.js","name":"states","src":"src/routes/pyrogram-patch/fsm/states.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js","_CodeBlock-DbsgX-u-.js"]},"src/routes/pyrogram-patch/index.tsx?pick=default&pick=$css":{"file":"index4.js","name":"index","src":"src/routes/pyrogram-patch/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js","_CodeBlock-DbsgX-u-.js"]},"src/routes/pyrogram-patch/middleware/context.tsx?pick=default&pick=$css":{"file":"context2.js","name":"context","src":"src/routes/pyrogram-patch/middleware/context.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pyrogram-patch/middleware/fsm-inject.tsx?pick=default&pick=$css":{"file":"fsm-inject.js","name":"fsm-inject","src":"src/routes/pyrogram-patch/middleware/fsm-inject.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pyrogram-patch/middleware/index.tsx?pick=default&pick=$css":{"file":"index5.js","name":"index","src":"src/routes/pyrogram-patch/middleware/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js","_CodeBlock-DbsgX-u-.js"]},"src/routes/pyrogram-patch/middleware/rate-limit.tsx?pick=default&pick=$css":{"file":"rate-limit.js","name":"rate-limit","src":"src/routes/pyrogram-patch/middleware/rate-limit.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pyrogram-patch/middleware/writing.tsx?pick=default&pick=$css":{"file":"writing.js","name":"writing","src":"src/routes/pyrogram-patch/middleware/writing.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pyrogram-patch/patch-helper.tsx?pick=default&pick=$css":{"file":"patch-helper.js","name":"patch-helper","src":"src/routes/pyrogram-patch/patch-helper.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pyrogram-patch/patching.tsx?pick=default&pick=$css":{"file":"patching.js","name":"patching","src":"src/routes/pyrogram-patch/patching.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pyrogram-patch/router.tsx?pick=default&pick=$css":{"file":"router.js","name":"router","src":"src/routes/pyrogram-patch/router.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pyrogram-patch/storage/custom.tsx?pick=default&pick=$css":{"file":"custom.js","name":"custom","src":"src/routes/pyrogram-patch/storage/custom.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pyrogram-patch/storage/index.tsx?pick=default&pick=$css":{"file":"index6.js","name":"index","src":"src/routes/pyrogram-patch/storage/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js","_CodeBlock-DbsgX-u-.js"]},"src/routes/pyrogram-patch/storage/memory.tsx?pick=default&pick=$css":{"file":"memory.js","name":"memory","src":"src/routes/pyrogram-patch/storage/memory.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js"]},"src/routes/pyrogram-patch/storage/redis.tsx?pick=default&pick=$css":{"file":"redis.js","name":"redis","src":"src/routes/pyrogram-patch/storage/redis.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_routing-Bcfgh2vJ.js","_Layout-DR96B_gr.js","_CodeBlock-DbsgX-u-.js"]},"virtual:$vinxi/handler/server-fns":{"file":"server-fns.js","name":"server-fns","src":"virtual:$vinxi/handler/server-fns","isEntry":true,"imports":["_server-fns-DiNL1Qlw.js"]}}};

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
  "/logo.png": {
    "type": "image/png",
    "etag": "\"10db3-gqpM2ZeOYwRGAI2EkYd2381jL4A\"",
    "mtime": "2026-02-23T13:25:50.004Z",
    "size": 69043,
    "path": "../../.output/public/logo.png"
  },
  "/assets/ssr-BDHOLjua.css": {
    "type": "text/css; charset=utf-8",
    "encoding": null,
    "etag": "\"6a72-pqmHGZZRJDmNFOHR7sRaFoNLtvU\"",
    "mtime": "2026-02-23T13:25:50.009Z",
    "size": 27250,
    "path": "../../.output/public/assets/ssr-BDHOLjua.css"
  },
  "/assets/ssr-BDHOLjua.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1487-DEhuE+OCcQ+ygBoxIC1r/cJUgyY\"",
    "mtime": "2026-02-23T13:25:50.120Z",
    "size": 5255,
    "path": "../../.output/public/assets/ssr-BDHOLjua.css.br"
  },
  "/assets/ssr-BDHOLjua.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1775-609m4N2vqZiAggv5shqWyKTo2Dw\"",
    "mtime": "2026-02-23T13:25:50.090Z",
    "size": 6005,
    "path": "../../.output/public/assets/ssr-BDHOLjua.css.gz"
  },
  "/_build/.vite/manifest.json": {
    "type": "application/json",
    "encoding": null,
    "etag": "\"3bbc-0T1tkd8CnI3ZDUNRi+ymG3gDF04\"",
    "mtime": "2026-02-23T13:25:50.022Z",
    "size": 15292,
    "path": "../../.output/public/_build/.vite/manifest.json"
  },
  "/_build/.vite/manifest.json.br": {
    "type": "application/json",
    "encoding": "br",
    "etag": "\"4c1-IC90/gBO8+ynUJ37yZ/PxKENAiQ\"",
    "mtime": "2026-02-23T13:25:50.149Z",
    "size": 1217,
    "path": "../../.output/public/_build/.vite/manifest.json.br"
  },
  "/_build/.vite/manifest.json.gz": {
    "type": "application/json",
    "encoding": "gzip",
    "etag": "\"57b-WD4jA/ItjOt9l8fneEYCb8zpkHI\"",
    "mtime": "2026-02-23T13:25:50.090Z",
    "size": 1403,
    "path": "../../.output/public/_build/.vite/manifest.json.gz"
  },
  "/_server/assets/app-BDHOLjua.css": {
    "type": "text/css; charset=utf-8",
    "encoding": null,
    "etag": "\"6a72-pqmHGZZRJDmNFOHR7sRaFoNLtvU\"",
    "mtime": "2026-02-23T13:25:50.030Z",
    "size": 27250,
    "path": "../../.output/public/_server/assets/app-BDHOLjua.css"
  },
  "/_server/assets/app-BDHOLjua.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1487-DEhuE+OCcQ+ygBoxIC1r/cJUgyY\"",
    "mtime": "2026-02-23T13:25:50.255Z",
    "size": 5255,
    "path": "../../.output/public/_server/assets/app-BDHOLjua.css.br"
  },
  "/_server/assets/app-BDHOLjua.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1775-609m4N2vqZiAggv5shqWyKTo2Dw\"",
    "mtime": "2026-02-23T13:25:50.237Z",
    "size": 6005,
    "path": "../../.output/public/_server/assets/app-BDHOLjua.css.gz"
  },
  "/_build/assets/CodeBlock-Dd_uXXMh.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"72e-h0EZG68NmqlfFLBUPAwiVmj9NZ0\"",
    "mtime": "2026-02-23T13:25:50.023Z",
    "size": 1838,
    "path": "../../.output/public/_build/assets/CodeBlock-Dd_uXXMh.js"
  },
  "/_build/assets/CodeBlock-Dd_uXXMh.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"331-bLE3bbOm2aEy+R4qYOcToEcdaNA\"",
    "mtime": "2026-02-23T13:25:50.090Z",
    "size": 817,
    "path": "../../.output/public/_build/assets/CodeBlock-Dd_uXXMh.js.br"
  },
  "/_build/assets/CodeBlock-Dd_uXXMh.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"3a2-7k+4VEoXYP+SIF05ydVbC3pNR2Y\"",
    "mtime": "2026-02-23T13:25:50.090Z",
    "size": 930,
    "path": "../../.output/public/_build/assets/CodeBlock-Dd_uXXMh.js.gz"
  },
  "/_build/assets/Layout-CuskbCXQ.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"2924-EDamiP5qRQ2/50vhwi7SKP+JU6c\"",
    "mtime": "2026-02-23T13:25:50.024Z",
    "size": 10532,
    "path": "../../.output/public/_build/assets/Layout-CuskbCXQ.js"
  },
  "/_build/assets/Layout-CuskbCXQ.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"c44-/HPterYF9sNTQpICPDflJwuvNtI\"",
    "mtime": "2026-02-23T13:25:50.120Z",
    "size": 3140,
    "path": "../../.output/public/_build/assets/Layout-CuskbCXQ.js.br"
  },
  "/_build/assets/Layout-CuskbCXQ.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"e0f-UGJ20pYcjQhr4sMZNnqrIJFZIyY\"",
    "mtime": "2026-02-23T13:25:50.090Z",
    "size": 3599,
    "path": "../../.output/public/_build/assets/Layout-CuskbCXQ.js.gz"
  },
  "/_build/assets/builder-CnvGWMZx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"27f-DJKsc1aK8aWsvzFBPLr49d8SfvI\"",
    "mtime": "2026-02-23T13:25:50.024Z",
    "size": 639,
    "path": "../../.output/public/_build/assets/builder-CnvGWMZx.js"
  },
  "/_build/assets/circuit-breaker-BMeozgmt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"28f-pmuoO1dEhyPpD9gRcFfjsEx0YIs\"",
    "mtime": "2026-02-23T13:25:50.023Z",
    "size": 655,
    "path": "../../.output/public/_build/assets/circuit-breaker-BMeozgmt.js"
  },
  "/_build/assets/client-BDHOLjua.css": {
    "type": "text/css; charset=utf-8",
    "encoding": null,
    "etag": "\"6a72-pqmHGZZRJDmNFOHR7sRaFoNLtvU\"",
    "mtime": "2026-02-23T13:25:50.022Z",
    "size": 27250,
    "path": "../../.output/public/_build/assets/client-BDHOLjua.css"
  },
  "/_build/assets/client-BDHOLjua.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"1487-DEhuE+OCcQ+ygBoxIC1r/cJUgyY\"",
    "mtime": "2026-02-23T13:25:50.177Z",
    "size": 5255,
    "path": "../../.output/public/_build/assets/client-BDHOLjua.css.br"
  },
  "/_build/assets/client-BDHOLjua.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1775-609m4N2vqZiAggv5shqWyKTo2Dw\"",
    "mtime": "2026-02-23T13:25:50.120Z",
    "size": 6005,
    "path": "../../.output/public/_build/assets/client-BDHOLjua.css.gz"
  },
  "/_build/assets/client-MXGGO26S.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"74e9-aT+mkh9OvLzYLPh+np+WDpwIJiI\"",
    "mtime": "2026-02-23T13:25:50.025Z",
    "size": 29929,
    "path": "../../.output/public/_build/assets/client-MXGGO26S.js"
  },
  "/_build/assets/client-MXGGO26S.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"1a20-gBupAB7BdjstXglXsWdiUWYtinM\"",
    "mtime": "2026-02-23T13:25:50.177Z",
    "size": 6688,
    "path": "../../.output/public/_build/assets/client-MXGGO26S.js.br"
  },
  "/_build/assets/client-MXGGO26S.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1ddd-qVNwR8g3JWhPQJaHLQ3rP+SH4R8\"",
    "mtime": "2026-02-23T13:25:50.120Z",
    "size": 7645,
    "path": "../../.output/public/_build/assets/client-MXGGO26S.js.gz"
  },
  "/_build/assets/configuration-Bsm85JL6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"27b-KADS5a+omo1sf7UDu+euUy80hL8\"",
    "mtime": "2026-02-23T13:25:50.023Z",
    "size": 635,
    "path": "../../.output/public/_build/assets/configuration-Bsm85JL6.js"
  },
  "/_build/assets/context-DYAf4EGY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"281-RpjKX6xFoI6xArSmBzAo6KVlg7k\"",
    "mtime": "2026-02-23T13:25:50.023Z",
    "size": 641,
    "path": "../../.output/public/_build/assets/context-DYAf4EGY.js"
  },
  "/_build/assets/context-YvKoH_-R.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"283-A/KP072inuI6sf6xdHVZxKyGU7c\"",
    "mtime": "2026-02-23T13:25:50.024Z",
    "size": 643,
    "path": "../../.output/public/_build/assets/context-YvKoH_-R.js"
  },
  "/_build/assets/custom-CeUX1rpQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"27c-MTWJBR/7J8stSN8I+jT4mT831Fk\"",
    "mtime": "2026-02-23T13:25:50.024Z",
    "size": 636,
    "path": "../../.output/public/_build/assets/custom-CeUX1rpQ.js"
  },
  "/_build/assets/dispatcher-Bu-PWUwc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"284-cUKqvXcg3CPTWFUyz5kQV7/1yVk\"",
    "mtime": "2026-02-23T13:25:50.024Z",
    "size": 644,
    "path": "../../.output/public/_build/assets/dispatcher-Bu-PWUwc.js"
  },
  "/_build/assets/errors-B3UdVU1X.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"269-5FApyR1aBugtMPUs2SQ6YJERYXI\"",
    "mtime": "2026-02-23T13:25:50.025Z",
    "size": 617,
    "path": "../../.output/public/_build/assets/errors-B3UdVU1X.js"
  },
  "/_build/assets/factory-C_8eymeL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"27f-/u47ys2H9r3RB9dNSPGQg5Xyh9M\"",
    "mtime": "2026-02-23T13:25:50.024Z",
    "size": 639,
    "path": "../../.output/public/_build/assets/factory-C_8eymeL.js"
  },
  "/_build/assets/filters-ByEE4IME.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"27b-qHiBh8AezZ0cBNC76yuLN9CVYfg\"",
    "mtime": "2026-02-23T13:25:50.024Z",
    "size": 635,
    "path": "../../.output/public/_build/assets/filters-ByEE4IME.js"
  },
  "/_build/assets/fsm-inject-Deyai52N.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"282-5oPYWGGvknZ7a+uQ52np8byDZeo\"",
    "mtime": "2026-02-23T13:25:50.024Z",
    "size": 642,
    "path": "../../.output/public/_build/assets/fsm-inject-Deyai52N.js"
  },
  "/_build/assets/getting-started-Ie0D20BU.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"1d45-iyqHvImK0unocYFb1PP/Bmena10\"",
    "mtime": "2026-02-23T13:25:50.024Z",
    "size": 7493,
    "path": "../../.output/public/_build/assets/getting-started-Ie0D20BU.js"
  },
  "/_build/assets/getting-started-Ie0D20BU.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"747-vf6sNgvM9OAvUHe2Wi+mRfG1DX0\"",
    "mtime": "2026-02-23T13:25:50.149Z",
    "size": 1863,
    "path": "../../.output/public/_build/assets/getting-started-Ie0D20BU.js.br"
  },
  "/_build/assets/getting-started-Ie0D20BU.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"87d-uw0fs46mgFp5GuU8m+4186fB7eE\"",
    "mtime": "2026-02-23T13:25:50.149Z",
    "size": 2173,
    "path": "../../.output/public/_build/assets/getting-started-Ie0D20BU.js.gz"
  },
  "/_build/assets/hooks-v2-toloP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"28b-pZIojiOWGf5Pr9zjCPfozkzfVe8\"",
    "mtime": "2026-02-23T13:25:50.024Z",
    "size": 651,
    "path": "../../.output/public/_build/assets/hooks-v2-toloP.js"
  },
  "/_build/assets/index-Bn2whYHn.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"1681-smee5tUPDhB31mKQiXJ5iP1b2NE\"",
    "mtime": "2026-02-23T13:25:50.024Z",
    "size": 5761,
    "path": "../../.output/public/_build/assets/index-Bn2whYHn.js"
  },
  "/_build/assets/index-Bn2whYHn.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"6bb-YhnXlA3I8JsLfuAMETFDtcfPXEs\"",
    "mtime": "2026-02-23T13:25:50.177Z",
    "size": 1723,
    "path": "../../.output/public/_build/assets/index-Bn2whYHn.js.br"
  },
  "/_build/assets/index-BpHEna9m.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"284-EJuCUjXIeqPq1VuID5pNj+Z/ciU\"",
    "mtime": "2026-02-23T13:25:50.024Z",
    "size": 644,
    "path": "../../.output/public/_build/assets/index-BpHEna9m.js"
  },
  "/_build/assets/index-Bn2whYHn.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"816-oaCXsdTK2wPkB3fJ2cS0eHSxku0\"",
    "mtime": "2026-02-23T13:25:50.149Z",
    "size": 2070,
    "path": "../../.output/public/_build/assets/index-Bn2whYHn.js.gz"
  },
  "/_build/assets/index-BsbuSHUz.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"12bd-2k+GnjAEMFDjP16kYGSwERDFh3s\"",
    "mtime": "2026-02-23T13:25:50.024Z",
    "size": 4797,
    "path": "../../.output/public/_build/assets/index-BsbuSHUz.js"
  },
  "/_build/assets/index-BsbuSHUz.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"680-vJgQXgWKYRpkJx12k8v1RtuNGh0\"",
    "mtime": "2026-02-23T13:25:50.177Z",
    "size": 1664,
    "path": "../../.output/public/_build/assets/index-BsbuSHUz.js.br"
  },
  "/_build/assets/index-BsbuSHUz.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"7b5-LvSK3teNu4kMnQZ2ru4aS/tdCLE\"",
    "mtime": "2026-02-23T13:25:50.177Z",
    "size": 1973,
    "path": "../../.output/public/_build/assets/index-BsbuSHUz.js.gz"
  },
  "/_build/assets/index-DD43TNCL.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"1498-Oykngp1I9GBfIkI2uqolCwXsAZs\"",
    "mtime": "2026-02-23T13:25:50.024Z",
    "size": 5272,
    "path": "../../.output/public/_build/assets/index-DD43TNCL.js"
  },
  "/_build/assets/index-DD43TNCL.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"569-gkk9gR6oFTORyXMMYQ2bhq9wEj4\"",
    "mtime": "2026-02-23T13:25:50.177Z",
    "size": 1385,
    "path": "../../.output/public/_build/assets/index-DD43TNCL.js.br"
  },
  "/_build/assets/index-DD43TNCL.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"675-wRPX9zm+LcjalvdEJJoTwzvglpI\"",
    "mtime": "2026-02-23T13:25:50.177Z",
    "size": 1653,
    "path": "../../.output/public/_build/assets/index-DD43TNCL.js.gz"
  },
  "/_build/assets/index-DTwLumPE.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"1b14-HYRWXmbOpz9GeXE9FXFZqitc39A\"",
    "mtime": "2026-02-23T13:25:50.024Z",
    "size": 6932,
    "path": "../../.output/public/_build/assets/index-DTwLumPE.js"
  },
  "/_build/assets/index-DTwLumPE.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"79e-lpCQfJN525BJDQ3eWw5NCQ+ll10\"",
    "mtime": "2026-02-23T13:25:50.181Z",
    "size": 1950,
    "path": "../../.output/public/_build/assets/index-DTwLumPE.js.br"
  },
  "/_build/assets/index-DTwLumPE.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"8dc-MQiBUCOGfYcsywSTn9+Umg0N7dU\"",
    "mtime": "2026-02-23T13:25:50.177Z",
    "size": 2268,
    "path": "../../.output/public/_build/assets/index-DTwLumPE.js.gz"
  },
  "/_build/assets/index-GW95Cnhp.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"c97-mvKjoU1Mnx+DdpnJpwtcwJU7l+8\"",
    "mtime": "2026-02-23T13:25:50.025Z",
    "size": 3223,
    "path": "../../.output/public/_build/assets/index-GW95Cnhp.js"
  },
  "/_build/assets/index-GW95Cnhp.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"43f-Epw0vg9+cV40REyn/o55wfUL4XE\"",
    "mtime": "2026-02-23T13:25:50.179Z",
    "size": 1087,
    "path": "../../.output/public/_build/assets/index-GW95Cnhp.js.br"
  },
  "/_build/assets/index-GW95Cnhp.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"520-R//kY1szTnYg4j4AR5XbGmkNEio\"",
    "mtime": "2026-02-23T13:25:50.177Z",
    "size": 1312,
    "path": "../../.output/public/_build/assets/index-GW95Cnhp.js.gz"
  },
  "/_build/assets/inline-keyboard-TjGC-yOc.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"13be-I/WT4NrkXmHN+E5fjkjBf1rCEwA\"",
    "mtime": "2026-02-23T13:25:50.025Z",
    "size": 5054,
    "path": "../../.output/public/_build/assets/inline-keyboard-TjGC-yOc.js"
  },
  "/_build/assets/inline-keyboard-TjGC-yOc.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"56f-eRawkJ59L/Z+Jn5pbYBZ4QhJ7po\"",
    "mtime": "2026-02-23T13:25:50.189Z",
    "size": 1391,
    "path": "../../.output/public/_build/assets/inline-keyboard-TjGC-yOc.js.br"
  },
  "/_build/assets/inline-keyboard-TjGC-yOc.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"650-bD3e1+SGeWBBafxjwbwOUy95TjQ\"",
    "mtime": "2026-02-23T13:25:50.177Z",
    "size": 1616,
    "path": "../../.output/public/_build/assets/inline-keyboard-TjGC-yOc.js.gz"
  },
  "/_build/assets/languages-PQubgEMX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"282-vphi83Ij7IpJnCy2bdQyYO61L8w\"",
    "mtime": "2026-02-23T13:25:50.024Z",
    "size": 642,
    "path": "../../.output/public/_build/assets/languages-PQubgEMX.js"
  },
  "/_build/assets/memory-Qy90m2TK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"280-DDOeA4idNY+Q+78yZ9ovn0Xf84I\"",
    "mtime": "2026-02-23T13:25:50.024Z",
    "size": 640,
    "path": "../../.output/public/_build/assets/memory-Qy90m2TK.js"
  },
  "/_build/assets/pagination-U4ZGR5IK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"280-slSH6RlBKBQS0BfNQVS3ghvGYeU\"",
    "mtime": "2026-02-23T13:25:50.024Z",
    "size": 640,
    "path": "../../.output/public/_build/assets/pagination-U4ZGR5IK.js"
  },
  "/_build/assets/patch-helper-C43IohXc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"28e-SBW6o/KZybPpNRmKCf5hwGWHOf8\"",
    "mtime": "2026-02-23T13:25:50.025Z",
    "size": 654,
    "path": "../../.output/public/_build/assets/patch-helper-C43IohXc.js"
  },
  "/_build/assets/patching-CYYyppJb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"282-InIQZByk4D5e1J4F2MmS7d8RqJU\"",
    "mtime": "2026-02-23T13:25:50.024Z",
    "size": 642,
    "path": "../../.output/public/_build/assets/patching-CYYyppJb.js"
  },
  "/_build/assets/pykeyboard-BQ6zHW5K.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"28b-KWtkdA+mWqJ74Zom/j1xBBF3lrM\"",
    "mtime": "2026-02-23T13:25:50.024Z",
    "size": 651,
    "path": "../../.output/public/_build/assets/pykeyboard-BQ6zHW5K.js"
  },
  "/_build/assets/pyrogram-patch-UbkSyoxG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"297-HsdF1zQFZCqZ8RQnqsc86dcFRVc\"",
    "mtime": "2026-02-23T13:25:50.024Z",
    "size": 663,
    "path": "../../.output/public/_build/assets/pyrogram-patch-UbkSyoxG.js"
  },
  "/_build/assets/rate-limit-nNaNU1iA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"286-whqsJ7o5zySnf7f9Bsfqe4TFfqs\"",
    "mtime": "2026-02-23T13:25:50.026Z",
    "size": 646,
    "path": "../../.output/public/_build/assets/rate-limit-nNaNU1iA.js"
  },
  "/_build/assets/redis-BwC_5H6e.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"130b-AKDMtTyPA/0pFIcKZGqiIogd5xo\"",
    "mtime": "2026-02-23T13:25:50.026Z",
    "size": 4875,
    "path": "../../.output/public/_build/assets/redis-BwC_5H6e.js"
  },
  "/_build/assets/redis-BwC_5H6e.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"60b-Sd0QRfyEynxmRDYqe4IK+W81GAQ\"",
    "mtime": "2026-02-23T13:25:50.237Z",
    "size": 1547,
    "path": "../../.output/public/_build/assets/redis-BwC_5H6e.js.br"
  },
  "/_build/assets/redis-BwC_5H6e.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"74e-2XjF7z5v6H6HyQup8W41EfKncSg\"",
    "mtime": "2026-02-23T13:25:50.183Z",
    "size": 1870,
    "path": "../../.output/public/_build/assets/redis-BwC_5H6e.js.gz"
  },
  "/_build/assets/reply-keyboard-Ci6CeNAB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"291-u65xeQWBaI2g3YvSDSjbVy+lSho\"",
    "mtime": "2026-02-23T13:25:50.025Z",
    "size": 657,
    "path": "../../.output/public/_build/assets/reply-keyboard-Ci6CeNAB.js"
  },
  "/_build/assets/router-CC2bvShi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"273-gEKCIg5bUIe1tpJEz9kpSkghP4o\"",
    "mtime": "2026-02-23T13:25:50.026Z",
    "size": 627,
    "path": "../../.output/public/_build/assets/router-CC2bvShi.js"
  },
  "/_build/assets/routing-Bag1el6N.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"8ca2-KJINUaFQPPh5lY2c4xKEOA6t3+8\"",
    "mtime": "2026-02-23T13:25:50.025Z",
    "size": 36002,
    "path": "../../.output/public/_build/assets/routing-Bag1el6N.js"
  },
  "/_build/assets/routing-Bag1el6N.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"36c9-0uzmqb2XVtXG6iYCsRXi4zST0X0\"",
    "mtime": "2026-02-23T13:25:50.193Z",
    "size": 14025,
    "path": "../../.output/public/_build/assets/routing-Bag1el6N.js.gz"
  },
  "/_build/assets/routing-Bag1el6N.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"31f2-mcauU0gNSKQrsqJqVowT/UYs030\"",
    "mtime": "2026-02-23T13:25:50.288Z",
    "size": 12786,
    "path": "../../.output/public/_build/assets/routing-Bag1el6N.js.br"
  },
  "/_build/assets/states-BnErhVOw.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"16a7-UAHli6lMsRaqrb+BAN1aEkTrJms\"",
    "mtime": "2026-02-23T13:25:50.025Z",
    "size": 5799,
    "path": "../../.output/public/_build/assets/states-BnErhVOw.js"
  },
  "/_build/assets/states-BnErhVOw.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"64c-AFi6lVt0U/pov4Kw47AUwA0hhW8\"",
    "mtime": "2026-02-23T13:25:50.237Z",
    "size": 1612,
    "path": "../../.output/public/_build/assets/states-BnErhVOw.js.br"
  },
  "/_build/assets/states-BnErhVOw.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"758-QBjgsQEyBCDEPMCNBkrAp2Eg0yQ\"",
    "mtime": "2026-02-23T13:25:50.189Z",
    "size": 1880,
    "path": "../../.output/public/_build/assets/states-BnErhVOw.js.gz"
  },
  "/_build/assets/utilities-CacxpWPW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"269-/P2VdtY0KhJ72H9Gg+iOGy1OZHw\"",
    "mtime": "2026-02-23T13:25:50.025Z",
    "size": 617,
    "path": "../../.output/public/_build/assets/utilities-CacxpWPW.js"
  },
  "/_build/assets/writing-B2QpS_NM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"27f-24fkQfttTldgr7YemxzHktvffW4\"",
    "mtime": "2026-02-23T13:25:50.025Z",
    "size": 639,
    "path": "../../.output/public/_build/assets/writing-B2QpS_NM.js"
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
function Fe$2(e) {
  let r;
  const t = F$1(e), o = { duplex: "half", method: e.method, headers: e.headers };
  return e.node.req.body instanceof ArrayBuffer ? new Request(t, { ...o, body: e.node.req.body }) : new Request(t, { ...o, get body() {
    return r || (r = Je$2(e), r);
  } });
}
function Le$2(e) {
  var _a;
  return (_a = e.web) != null ? _a : e.web = { request: Fe$2(e), url: F$1(e) }, e.web.request;
}
function Ie$2() {
  return Ze$2();
}
const Y = /* @__PURE__ */ Symbol("$HTTPEvent");
function Ue$2(e) {
  return typeof e == "object" && (e instanceof H3Event || (e == null ? void 0 : e[Y]) instanceof H3Event || (e == null ? void 0 : e.__is_event__) === true);
}
function c(e) {
  return function(...r) {
    var _a;
    let t = r[0];
    if (Ue$2(t)) r[0] = t instanceof H3Event || t.__is_event__ ? t : t[Y];
    else {
      if (!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext)) throw new Error("AsyncLocalStorage was not enabled. Use the `server.experimental.asyncContext: true` option in your app configuration to enable it. Or, pass the instance of HTTPEvent that you have as the first argument to the function.");
      if (t = Ie$2(), !t) throw new Error("No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.");
      r.unshift(t);
    }
    return e(...r);
  };
}
const F$1 = c(getRequestURL$1), _e$2 = c(getRequestIP), b = c(setResponseStatus$1), T = c(getResponseStatus), je$2 = c(getResponseStatusText), k$1 = c(getResponseHeaders), E$1 = c(getResponseHeader$1), Me$2 = c(setResponseHeader$1), L$1 = c(appendResponseHeader$1), We$2 = c(parseCookies), Be$2 = c(getCookie), ze$2 = c(setCookie), h = c(setHeader), Je$2 = c(getRequestWebStream), Xe$1 = c(removeResponseHeader$1), Ge$1 = c(Le$2);
function Ke$2() {
  var _a;
  return getContext("nitro-app", { asyncContext: !!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext), AsyncLocalStorage: AsyncLocalStorage });
}
function Ze$2() {
  return Ke$2().use().event;
}
const $ = "Invariant Violation", { setPrototypeOf: Qe$2 = function(e, r) {
  return e.__proto__ = r, e;
} } = Object;
class w extends Error {
  constructor(r = $) {
    super(typeof r == "number" ? `${$}: ${r} (see https://github.com/apollographql/invariant-packages)` : r);
    __publicField$1(this, "framesToPop", 1);
    __publicField$1(this, "name", $);
    Qe$2(this, w.prototype);
  }
}
function et$2(e, r) {
  if (!e) throw new w(r);
}
const P$1 = "solidFetchEvent";
function tt$2(e) {
  return { request: Ge$1(e), response: at$1(e), clientAddress: _e$2(e), locals: {}, nativeEvent: e };
}
function rt$2(e) {
  return { ...e };
}
function st$2(e) {
  if (!e.context[P$1]) {
    const r = tt$2(e);
    e.context[P$1] = r;
  }
  return e.context[P$1];
}
function H(e, r) {
  for (const [t, o] of r.entries()) L$1(e, t, o);
}
let ot$2 = class ot {
  constructor(r) {
    __publicField$1(this, "event");
    this.event = r;
  }
  get(r) {
    const t = E$1(this.event, r);
    return Array.isArray(t) ? t.join(", ") : t || null;
  }
  has(r) {
    return this.get(r) !== null;
  }
  set(r, t) {
    return Me$2(this.event, r, t);
  }
  delete(r) {
    return Xe$1(this.event, r);
  }
  append(r, t) {
    L$1(this.event, r, t);
  }
  getSetCookie() {
    const r = E$1(this.event, "Set-Cookie");
    return Array.isArray(r) ? r : [r];
  }
  forEach(r) {
    return Object.entries(k$1(this.event)).forEach(([t, o]) => r(Array.isArray(o) ? o.join(", ") : o, t, this));
  }
  entries() {
    return Object.entries(k$1(this.event)).map(([r, t]) => [r, Array.isArray(t) ? t.join(", ") : t])[Symbol.iterator]();
  }
  keys() {
    return Object.keys(k$1(this.event))[Symbol.iterator]();
  }
  values() {
    return Object.values(k$1(this.event)).map((r) => Array.isArray(r) ? r.join(", ") : r)[Symbol.iterator]();
  }
  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
};
function at$1(e) {
  return { get status() {
    return T(e);
  }, set status(r) {
    b(e, r);
  }, get statusText() {
    return je$2(e);
  }, set statusText(r) {
    b(e, T(e), r);
  }, headers: new ot$2(e) };
}
const I$1 = [{ page: true, $component: { src: "src/routes/api/pykeyboard.tsx?pick=default&pick=$css", build: () => import('../build/pykeyboard.mjs'), import: () => import('../build/pykeyboard.mjs') }, path: "/api/pykeyboard", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/api/pykeyboard.tsx" }, { page: true, $component: { src: "src/routes/api/pyrogram-patch.tsx?pick=default&pick=$css", build: () => import('../build/pyrogram-patch.mjs'), import: () => import('../build/pyrogram-patch.mjs') }, path: "/api/pyrogram-patch", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/api/pyrogram-patch.tsx" }, { page: true, $component: { src: "src/routes/getting-started.tsx?pick=default&pick=$css", build: () => import('../build/getting-started.mjs'), import: () => import('../build/getting-started.mjs') }, path: "/getting-started", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/getting-started.tsx" }, { page: true, $component: { src: "src/routes/index.tsx?pick=default&pick=$css", build: () => import('../build/index.mjs'), import: () => import('../build/index.mjs') }, path: "/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/index.tsx" }, { page: true, $component: { src: "src/routes/pykeyboard/builder.tsx?pick=default&pick=$css", build: () => import('../build/builder.mjs'), import: () => import('../build/builder.mjs') }, path: "/pykeyboard/builder", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/builder.tsx" }, { page: true, $component: { src: "src/routes/pykeyboard/factory.tsx?pick=default&pick=$css", build: () => import('../build/factory.mjs'), import: () => import('../build/factory.mjs') }, path: "/pykeyboard/factory", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/factory.tsx" }, { page: true, $component: { src: "src/routes/pykeyboard/hooks.tsx?pick=default&pick=$css", build: () => import('../build/hooks.mjs'), import: () => import('../build/hooks.mjs') }, path: "/pykeyboard/hooks", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/hooks.tsx" }, { page: true, $component: { src: "src/routes/pykeyboard/index.tsx?pick=default&pick=$css", build: () => import('../build/index2.mjs'), import: () => import('../build/index2.mjs') }, path: "/pykeyboard/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/index.tsx" }, { page: true, $component: { src: "src/routes/pykeyboard/inline-keyboard.tsx?pick=default&pick=$css", build: () => import('../build/inline-keyboard.mjs'), import: () => import('../build/inline-keyboard.mjs') }, path: "/pykeyboard/inline-keyboard", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/inline-keyboard.tsx" }, { page: true, $component: { src: "src/routes/pykeyboard/languages.tsx?pick=default&pick=$css", build: () => import('../build/languages.mjs'), import: () => import('../build/languages.mjs') }, path: "/pykeyboard/languages", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/languages.tsx" }, { page: true, $component: { src: "src/routes/pykeyboard/pagination.tsx?pick=default&pick=$css", build: () => import('../build/pagination.mjs'), import: () => import('../build/pagination.mjs') }, path: "/pykeyboard/pagination", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/pagination.tsx" }, { page: true, $component: { src: "src/routes/pykeyboard/reply-keyboard.tsx?pick=default&pick=$css", build: () => import('../build/reply-keyboard.mjs'), import: () => import('../build/reply-keyboard.mjs') }, path: "/pykeyboard/reply-keyboard", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/reply-keyboard.tsx" }, { page: true, $component: { src: "src/routes/pykeyboard/utilities.tsx?pick=default&pick=$css", build: () => import('../build/utilities.mjs'), import: () => import('../build/utilities.mjs') }, path: "/pykeyboard/utilities", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/utilities.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/circuit-breaker.tsx?pick=default&pick=$css", build: () => import('../build/circuit-breaker.mjs'), import: () => import('../build/circuit-breaker.mjs') }, path: "/pyrogram-patch/circuit-breaker", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/circuit-breaker.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/configuration.tsx?pick=default&pick=$css", build: () => import('../build/configuration.mjs'), import: () => import('../build/configuration.mjs') }, path: "/pyrogram-patch/configuration", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/configuration.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/dispatcher.tsx?pick=default&pick=$css", build: () => import('../build/dispatcher.mjs'), import: () => import('../build/dispatcher.mjs') }, path: "/pyrogram-patch/dispatcher", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/dispatcher.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/errors.tsx?pick=default&pick=$css", build: () => import('../build/errors.mjs'), import: () => import('../build/errors.mjs') }, path: "/pyrogram-patch/errors", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/errors.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/fsm/context.tsx?pick=default&pick=$css", build: () => import('../build/context.mjs'), import: () => import('../build/context.mjs') }, path: "/pyrogram-patch/fsm/context", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/fsm/context.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/fsm/filters.tsx?pick=default&pick=$css", build: () => import('../build/filters.mjs'), import: () => import('../build/filters.mjs') }, path: "/pyrogram-patch/fsm/filters", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/fsm/filters.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/fsm/index.tsx?pick=default&pick=$css", build: () => import('../build/index3.mjs'), import: () => import('../build/index3.mjs') }, path: "/pyrogram-patch/fsm/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/fsm/index.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/fsm/states.tsx?pick=default&pick=$css", build: () => import('../build/states.mjs'), import: () => import('../build/states.mjs') }, path: "/pyrogram-patch/fsm/states", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/fsm/states.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/index.tsx?pick=default&pick=$css", build: () => import('../build/index4.mjs'), import: () => import('../build/index4.mjs') }, path: "/pyrogram-patch/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/index.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/middleware/context.tsx?pick=default&pick=$css", build: () => import('../build/context2.mjs'), import: () => import('../build/context2.mjs') }, path: "/pyrogram-patch/middleware/context", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/middleware/context.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/middleware/fsm-inject.tsx?pick=default&pick=$css", build: () => import('../build/fsm-inject.mjs'), import: () => import('../build/fsm-inject.mjs') }, path: "/pyrogram-patch/middleware/fsm-inject", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/middleware/fsm-inject.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/middleware/index.tsx?pick=default&pick=$css", build: () => import('../build/index5.mjs'), import: () => import('../build/index5.mjs') }, path: "/pyrogram-patch/middleware/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/middleware/index.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/middleware/rate-limit.tsx?pick=default&pick=$css", build: () => import('../build/rate-limit.mjs'), import: () => import('../build/rate-limit.mjs') }, path: "/pyrogram-patch/middleware/rate-limit", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/middleware/rate-limit.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/middleware/writing.tsx?pick=default&pick=$css", build: () => import('../build/writing.mjs'), import: () => import('../build/writing.mjs') }, path: "/pyrogram-patch/middleware/writing", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/middleware/writing.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/patch-helper.tsx?pick=default&pick=$css", build: () => import('../build/patch-helper.mjs'), import: () => import('../build/patch-helper.mjs') }, path: "/pyrogram-patch/patch-helper", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/patch-helper.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/patching.tsx?pick=default&pick=$css", build: () => import('../build/patching.mjs'), import: () => import('../build/patching.mjs') }, path: "/pyrogram-patch/patching", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/patching.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/router.tsx?pick=default&pick=$css", build: () => import('../build/router.mjs'), import: () => import('../build/router.mjs') }, path: "/pyrogram-patch/router", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/router.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/storage/custom.tsx?pick=default&pick=$css", build: () => import('../build/custom.mjs'), import: () => import('../build/custom.mjs') }, path: "/pyrogram-patch/storage/custom", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/storage/custom.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/storage/index.tsx?pick=default&pick=$css", build: () => import('../build/index6.mjs'), import: () => import('../build/index6.mjs') }, path: "/pyrogram-patch/storage/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/storage/index.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/storage/memory.tsx?pick=default&pick=$css", build: () => import('../build/memory.mjs'), import: () => import('../build/memory.mjs') }, path: "/pyrogram-patch/storage/memory", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/storage/memory.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/storage/redis.tsx?pick=default&pick=$css", build: () => import('../build/redis.mjs'), import: () => import('../build/redis.mjs') }, path: "/pyrogram-patch/storage/redis", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/storage/redis.tsx" }], nt$1 = it(I$1.filter((e) => e.page));
function it(e) {
  function r(t, o, a, n) {
    const i = Object.values(t).find((p) => a.startsWith(p.id + "/"));
    return i ? (r(i.children || (i.children = []), o, a.slice(i.id.length)), t) : (t.push({ ...o, id: a, path: a.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/") }), t);
  }
  return e.sort((t, o) => t.path.length - o.path.length).reduce((t, o) => r(t, o, o.path, o.path), []);
}
function pt(e) {
  return e.$HEAD || e.$GET || e.$POST || e.$PUT || e.$PATCH || e.$DELETE;
}
createRouter({ routes: I$1.reduce((e, r) => {
  if (!pt(r)) return e;
  let t = r.path.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/").replace(/\*([^/]*)/g, (o, a) => `**:${a}`).split("/").map((o) => o.startsWith(":") || o.startsWith("*") ? o : encodeURIComponent(o)).join("/");
  if (/:[^/]*\?/g.test(t)) throw new Error(`Optional parameters are not supported in API routes: ${t}`);
  if (e[t]) throw new Error(`Duplicate API routes for "${t}" found at "${e[t].route.path}" and "${r.path}"`);
  return e[t] = { route: r }, e;
}, {}) });
var ut = " ";
const dt = { style: (e) => ssrElement("style", e.attrs, () => e.children, true), link: (e) => ssrElement("link", e.attrs, void 0, true), script: (e) => e.attrs.src ? ssrElement("script", mergeProps(() => e.attrs, { get id() {
  return e.key;
} }), () => ssr(ut), true) : null, noscript: (e) => ssrElement("noscript", e.attrs, () => escape(e.children), true) };
function mt(e, r) {
  let { tag: t, attrs: { key: o, ...a } = { key: void 0 }, children: n } = e;
  return dt[t]({ attrs: { ...a, nonce: r }, key: o, children: n });
}
function lt(e, r, t, o = "default") {
  return lazy(async () => {
    var _a;
    {
      const n = (await e.import())[o], p = (await ((_a = r.inputs) == null ? void 0 : _a[e.src].assets())).filter((u) => u.tag === "style" || u.attrs.rel === "stylesheet");
      return { default: (u) => [...p.map((g) => mt(g)), createComponent(n, u)] };
    }
  });
}
function U$1() {
  function e(t) {
    return { ...t, ...t.$$route ? t.$$route.require().route : void 0, info: { ...t.$$route ? t.$$route.require().route.info : {}, filesystem: true }, component: t.$component && lt(t.$component, globalThis.MANIFEST.client, globalThis.MANIFEST.ssr), children: t.children ? t.children.map(e) : void 0 };
  }
  return nt$1.map(e);
}
let O$1;
const qt = isServer ? () => getRequestEvent().routes : () => O$1 || (O$1 = U$1());
function ht(e) {
  const r = Be$2(e.nativeEvent, "flash");
  if (r) try {
    let t = JSON.parse(r);
    if (!t || !t.result) return;
    const o = [...t.input.slice(0, -1), new Map(t.input[t.input.length - 1])], a = t.error ? new Error(t.result) : t.result;
    return { input: o, url: t.url, pending: false, result: t.thrown ? void 0 : a, error: t.thrown ? a : void 0 };
  } catch (t) {
    console.error(t);
  } finally {
    ze$2(e.nativeEvent, "flash", "", { maxAge: 0 });
  }
}
async function gt(e) {
  const r = globalThis.MANIFEST.client;
  return globalThis.MANIFEST.ssr, e.response.headers.set("Content-Type", "text/html"), Object.assign(e, { manifest: await r.json(), assets: [...await r.inputs[r.handler].assets()], router: { submission: ht(e) }, routes: U$1(), complete: false, $islands: /* @__PURE__ */ new Set() });
}
const ft = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function yt(e) {
  return e.status && ft.has(e.status) ? e.status : 302;
}
const kt = {}, D = [AbortSignalPlugin, CustomEventPlugin, DOMExceptionPlugin, EventPlugin, FormDataPlugin, HeadersPlugin, ReadableStreamPlugin, RequestPlugin, ResponsePlugin, URLSearchParamsPlugin, URLPlugin], bt = 64, _$1 = Feature.RegExp;
function j$1(e) {
  const r = new TextEncoder().encode(e), t = r.length, o = t.toString(16), a = "00000000".substring(0, 8 - o.length) + o, n = new TextEncoder().encode(`;0x${a};`), i = new Uint8Array(12 + t);
  return i.set(n), i.set(r, 12), i;
}
function v(e, r) {
  return new ReadableStream({ start(t) {
    crossSerializeStream(r, { scopeId: e, plugins: D, onSerialize(o, a) {
      t.enqueue(j$1(a ? `(${getCrossReferenceHeader(e)},${o})` : o));
    }, onDone() {
      t.close();
    }, onError(o) {
      t.error(o);
    } });
  } });
}
function xt(e) {
  return new ReadableStream({ start(r) {
    toCrossJSONStream(e, { disabledFeatures: _$1, depthLimit: bt, plugins: D, onParse(t) {
      r.enqueue(j$1(JSON.stringify(t)));
    }, onDone() {
      r.close();
    }, onError(t) {
      r.error(t);
    } });
  } });
}
async function N$1(e) {
  return fromJSON(JSON.parse(e), { plugins: D, disabledFeatures: _$1 });
}
async function $t(e) {
  const r = st$2(e), t = r.request, o = t.headers.get("X-Server-Id"), a = t.headers.get("X-Server-Instance"), n = t.headers.has("X-Single-Flight"), i = new URL(t.url);
  let p, m;
  if (o) et$2(typeof o == "string", "Invalid server function"), [p, m] = decodeURIComponent(o).split("#");
  else if (p = i.searchParams.get("id"), m = i.searchParams.get("name"), !p || !m) return new Response(null, { status: 404 });
  const u = kt[p];
  let g;
  if (!u) return new Response(null, { status: 404 });
  g = await u.importer();
  const M = g[u.functionName];
  let l = [];
  if (!a || e.method === "GET") {
    const s = i.searchParams.get("args");
    if (s) {
      const d = await N$1(s);
      for (const f of d) l.push(f);
    }
  }
  if (e.method === "POST") {
    const s = t.headers.get("content-type"), d = e.node.req, f = d instanceof ReadableStream, W = d.body instanceof ReadableStream, B = f && d.locked || W && d.body.locked, z = f ? d : d.body, x = B ? t : new Request(t, { ...t, body: z });
    t.headers.get("x-serialized") ? l = await N$1(await x.text()) : (s == null ? void 0 : s.startsWith("multipart/form-data")) || (s == null ? void 0 : s.startsWith("application/x-www-form-urlencoded")) ? l.push(await x.formData()) : (s == null ? void 0 : s.startsWith("application/json")) && (l = await x.json());
  }
  try {
    let s = await provideRequestEvent(r, async () => (sharedConfig.context = { event: r }, r.locals.serverFunctionMeta = { id: p + "#" + m }, M(...l)));
    if (n && a && (s = await A$1(r, s)), s instanceof Response) {
      if (s.headers && s.headers.has("X-Content-Raw")) return s;
      a && (s.headers && H(e, s.headers), s.status && (s.status < 300 || s.status >= 400) && b(e, s.status), s.customBody ? s = await s.customBody() : s.body == null && (s = null));
    }
    if (!a) return q$2(s, t, l);
    return h(e, "x-serialized", "true"), h(e, "content-type", "text/javascript"), v(a, s);
    return xt(s);
  } catch (s) {
    if (s instanceof Response) n && a && (s = await A$1(r, s)), s.headers && H(e, s.headers), s.status && (!a || s.status < 300 || s.status >= 400) && b(e, s.status), s.customBody ? s = s.customBody() : s.body == null && (s = null), h(e, "X-Error", "true");
    else if (a) {
      const d = s instanceof Error ? s.message : typeof s == "string" ? s : "true";
      h(e, "X-Error", d.replace(/[\r\n]+/g, ""));
    } else s = q$2(s, t, l, true);
    return a ? (h(e, "x-serialized", "true"), h(e, "content-type", "text/javascript"), v(a, s)) : s;
  }
}
function q$2(e, r, t, o) {
  const a = new URL(r.url), n = e instanceof Error;
  let i = 302, p;
  return e instanceof Response ? (p = new Headers(e.headers), e.headers.has("Location") && (p.set("Location", new URL(e.headers.get("Location"), a.origin + "/kurigram-addons").toString()), i = yt(e))) : p = new Headers({ Location: new URL(r.headers.get("referer")).toString() }), e && p.append("Set-Cookie", `flash=${encodeURIComponent(JSON.stringify({ url: a.pathname + a.search, result: n ? e.message : e, thrown: o, error: n, input: [...t.slice(0, -1), [...t[t.length - 1].entries()]] }))}; Secure; HttpOnly;`), new Response(null, { status: i, headers: p });
}
let R;
function Pt(e) {
  var _a;
  const r = new Headers(e.request.headers), t = We$2(e.nativeEvent), o = e.response.headers.getSetCookie();
  r.delete("cookie");
  let a = false;
  return ((_a = e.nativeEvent.node) == null ? void 0 : _a.req) && (a = true, e.nativeEvent.node.req.headers.cookie = ""), o.forEach((n) => {
    if (!n) return;
    const { maxAge: i, expires: p, name: m, value: u } = parseSetCookie(n);
    if (i != null && i <= 0) {
      delete t[m];
      return;
    }
    if (p != null && p.getTime() <= Date.now()) {
      delete t[m];
      return;
    }
    t[m] = u;
  }), Object.entries(t).forEach(([n, i]) => {
    r.append("cookie", `${n}=${i}`), a && (e.nativeEvent.node.req.headers.cookie += `${n}=${i};`);
  }), r;
}
async function A$1(e, r) {
  let t, o = new URL(e.request.headers.get("referer")).toString();
  r instanceof Response && (r.headers.has("X-Revalidate") && (t = r.headers.get("X-Revalidate").split(",")), r.headers.has("Location") && (o = new URL(r.headers.get("Location"), new URL(e.request.url).origin + "/kurigram-addons").toString()));
  const a = rt$2(e);
  return a.request = new Request(o, { headers: Pt(e) }), await provideRequestEvent(a, async () => {
    await gt(a), R || (R = (await import('../build/app-Hb9Cp-9u.mjs')).default), a.router.dataOnly = t || true, a.router.previousUrl = e.request.headers.get("referer");
    try {
      renderToString(() => {
        sharedConfig.context.event = a, R();
      });
    } catch (p) {
      console.log(p);
    }
    const n = a.router.data;
    if (!n) return r;
    let i = false;
    for (const p in n) n[p] === void 0 ? delete n[p] : i = true;
    return i && (r instanceof Response ? r.customBody && (n._$value = r.customBody()) : (n._$value = r, r = new Response(null, { status: 200 })), r.customBody = () => n, r.headers.set("X-Single-Flight", "true")), r;
  });
}
const At = eventHandler$1($t);

const ne$1 = createContext(), re$1 = ["title", "meta"], I = [], W$1 = ["name", "http-equiv", "content", "charset", "media"].concat(["property"]), q$1 = (n, t) => {
  const e = Object.fromEntries(Object.entries(n.props).filter(([r]) => t.includes(r)).sort());
  return (Object.hasOwn(e, "name") || Object.hasOwn(e, "property")) && (e.name = e.name || e.property, delete e.property), n.tag + JSON.stringify(e);
};
function je$1() {
  if (!sharedConfig.context) {
    const e = document.head.querySelectorAll("[data-sm]");
    Array.prototype.forEach.call(e, (r) => r.parentNode.removeChild(r));
  }
  const n = /* @__PURE__ */ new Map();
  function t(e) {
    if (e.ref) return e.ref;
    let r = document.querySelector(`[data-sm="${e.id}"]`);
    return r ? (r.tagName.toLowerCase() !== e.tag && (r.parentNode && r.parentNode.removeChild(r), r = document.createElement(e.tag)), r.removeAttribute("data-sm")) : r = document.createElement(e.tag), r;
  }
  return { addTag(e) {
    if (re$1.indexOf(e.tag) !== -1) {
      const s = e.tag === "title" ? I : W$1, a = q$1(e, s);
      n.has(a) || n.set(a, []);
      let i = n.get(a), d = i.length;
      i = [...i, e], n.set(a, i);
      let f = t(e);
      e.ref = f, spread(f, e.props);
      let l = null;
      for (var r = d - 1; r >= 0; r--) if (i[r] != null) {
        l = i[r];
        break;
      }
      return f.parentNode != document.head && document.head.appendChild(f), l && l.ref && l.ref.parentNode && document.head.removeChild(l.ref), d;
    }
    let o = t(e);
    return e.ref = o, spread(o, e.props), o.parentNode != document.head && document.head.appendChild(o), -1;
  }, removeTag(e, r) {
    const o = e.tag === "title" ? I : W$1, s = q$1(e, o);
    if (e.ref) {
      const a = n.get(s);
      if (a) {
        if (e.ref.parentNode) {
          e.ref.parentNode.removeChild(e.ref);
          for (let i = r - 1; i >= 0; i--) a[i] != null && document.head.appendChild(a[i].ref);
        }
        a[r] = null, n.set(s, a);
      } else e.ref.parentNode && e.ref.parentNode.removeChild(e.ref);
    }
  } };
}
function Se$1() {
  const n = [];
  return useAssets(() => ssr(Ne$1(n))), { addTag(t) {
    if (re$1.indexOf(t.tag) !== -1) {
      const e = t.tag === "title" ? I : W$1, r = q$1(t, e), o = n.findIndex((s) => s.tag === t.tag && q$1(s, e) === r);
      o !== -1 && n.splice(o, 1);
    }
    return n.push(t), n.length;
  }, removeTag(t, e) {
  } };
}
const Qe$1 = (n) => {
  const t = isServer ? Se$1() : je$1();
  return createComponent$1(ne$1.Provider, { value: t, get children() {
    return n.children;
  } });
}, Te$1 = (n, t, e) => (Le$1({ tag: n, props: t, setting: e, id: createUniqueId(), get name() {
  return t.name || t.property;
} }), null);
function Le$1(n) {
  const t = useContext(ne$1);
  if (!t) throw new Error("<MetaProvider /> should be in the tree");
  createRenderEffect(() => {
    const e = t.addTag(n);
    onCleanup(() => t.removeTag(n, e));
  });
}
function Ne$1(n) {
  return n.map((t) => {
    var _a, _b;
    const r = Object.keys(t.props).map((s) => s === "children" ? "" : ` ${s}="${escape(t.props[s], true)}"`).join("");
    let o = t.props.children;
    return Array.isArray(o) && (o = o.join("")), ((_a = t.setting) == null ? void 0 : _a.close) ? `<${t.tag} data-sm="${t.id}"${r}>${((_b = t.setting) == null ? void 0 : _b.escape) ? escape(o) : o || ""}</${t.tag}>` : `<${t.tag} data-sm="${t.id}"${r}/>`;
  }).join("");
}
const Ye$1 = (n) => Te$1("title", n, { escape: true, close: true });
function Me$1() {
  let n = /* @__PURE__ */ new Set();
  function t(o) {
    return n.add(o), () => n.delete(o);
  }
  let e = false;
  function r(o, s) {
    if (e) return !(e = false);
    const a = { to: o, options: s, defaultPrevented: false, preventDefault: () => a.defaultPrevented = true };
    for (const i of n) i.listener({ ...a, from: i.location, retry: (d) => {
      d && (e = true), i.navigate(o, { ...s, resolve: false });
    } });
    return !a.defaultPrevented;
  }
  return { subscribe: t, confirm: r };
}
let K$1;
function oe$1() {
  (!window.history.state || window.history.state._depth == null) && window.history.replaceState({ ...window.history.state, _depth: window.history.length - 1 }, ""), K$1 = window.history.state._depth;
}
isServer || oe$1();
function Ze$1(n) {
  return { ...n, _depth: window.history.state && window.history.state._depth };
}
function et$1(n, t) {
  let e = false;
  return () => {
    const r = K$1;
    oe$1();
    const o = r == null ? null : K$1 - r;
    if (e) {
      e = false;
      return;
    }
    o && t(o) ? (e = true, window.history.go(-o)) : n();
  };
}
const qe$1 = /^(?:[a-z0-9]+:)?\/\//i, _e$1 = /^\/+|(\/)\/+$/g, Be$1 = "http://sr";
function E(n, t = false) {
  const e = n.replace(_e$1, "$1");
  return e ? t || /^[?#]/.test(e) ? e : "/" + e : "";
}
function M(n, t, e) {
  if (qe$1.test(t)) return;
  const r = E(n), o = e && E(e);
  let s = "";
  return !o || t.startsWith("/") ? s = r : o.toLowerCase().indexOf(r.toLowerCase()) !== 0 ? s = r + o : s = o, (s || "/") + E(t, !s);
}
function Fe$1(n, t) {
  if (n == null) throw new Error(t);
  return n;
}
function Ie$1(n, t) {
  return E(n).replace(/\/*(\*.*)?$/g, "") + E(t);
}
function se$1(n) {
  const t = {};
  return n.searchParams.forEach((e, r) => {
    r in t ? Array.isArray(t[r]) ? t[r].push(e) : t[r] = [t[r], e] : t[r] = e;
  }), t;
}
function We$1(n, t, e) {
  const [r, o] = n.split("/*", 2), s = r.split("/").filter(Boolean), a = s.length;
  return (i) => {
    const d = i.split("/").filter(Boolean), f = d.length - a;
    if (f < 0 || f > 0 && o === void 0 && !t) return null;
    const l = { path: a ? "" : "/", params: {} }, m = (p) => e === void 0 ? void 0 : e[p];
    for (let p = 0; p < a; p++) {
      const h = s[p], y = h[0] === ":", w = y ? d[p] : d[p].toLowerCase(), O = y ? h.slice(1) : h.toLowerCase();
      if (y && B$1(w, m(O))) l.params[O] = w;
      else if (y || !B$1(w, O)) return null;
      l.path += `/${w}`;
    }
    if (o) {
      const p = f ? d.slice(-f).join("/") : "";
      if (B$1(p, m(o))) l.params[o] = p;
      else return null;
    }
    return l;
  };
}
function B$1(n, t) {
  const e = (r) => r === n;
  return t === void 0 ? true : typeof t == "string" ? e(t) : typeof t == "function" ? t(n) : Array.isArray(t) ? t.some(e) : t instanceof RegExp ? t.test(n) : false;
}
function Ke$1(n) {
  const [t, e] = n.pattern.split("/*", 2), r = t.split("/").filter(Boolean);
  return r.reduce((o, s) => o + (s.startsWith(":") ? 2 : 3), r.length - (e === void 0 ? 0 : 1));
}
function ae$1(n) {
  const t = /* @__PURE__ */ new Map(), e = getOwner();
  return new Proxy({}, { get(r, o) {
    return t.has(o) || runWithOwner(e, () => t.set(o, createMemo(() => n()[o]))), t.get(o)();
  }, getOwnPropertyDescriptor() {
    return { enumerable: true, configurable: true };
  }, ownKeys() {
    return Reflect.ownKeys(n());
  }, has(r, o) {
    return o in n();
  } });
}
function ie$1(n) {
  let t = /(\/?\:[^\/]+)\?/.exec(n);
  if (!t) return [n];
  let e = n.slice(0, t.index), r = n.slice(t.index + t[0].length);
  const o = [e, e += t[1]];
  for (; t = /^(\/\:[^\/]+)\?/.exec(r); ) o.push(e += t[1]), r = r.slice(t[0].length);
  return ie$1(r).reduce((s, a) => [...s, ...o.map((i) => i + a)], []);
}
const Ue$1 = 100, ke$1 = createContext(), ce$1 = createContext(), k = () => Fe$1(useContext(ke$1), "<A> and 'use' router primitives can be only used inside a Route."), He$1 = () => useContext(ce$1) || k().base, tt$1 = (n) => {
  const t = He$1();
  return createMemo(() => t.resolvePath(n()));
}, nt = (n) => {
  const t = k();
  return createMemo(() => {
    const e = n();
    return e !== void 0 ? t.renderPath(e) : e;
  });
}, rt$1 = () => k().location;
function ze$1(n, t = "") {
  const { component: e, preload: r, load: o, children: s, info: a } = n, i = !s || Array.isArray(s) && !s.length, d = { key: n, component: e, preload: r || o, info: a };
  return le$1(n.path).reduce((f, l) => {
    for (const m of ie$1(l)) {
      const p = Ie$1(t, m);
      let h = i ? p : p.split("/*", 1)[0];
      h = h.split("/").map((y) => y.startsWith(":") || y.startsWith("*") ? y : encodeURIComponent(y)).join("/"), f.push({ ...d, originalPath: l, pattern: h, matcher: We$1(h, !i, n.matchFilters) });
    }
    return f;
  }, []);
}
function De$1(n, t = 0) {
  return { routes: n, score: Ke$1(n[n.length - 1]) * 1e4 - t, matcher(e) {
    const r = [];
    for (let o = n.length - 1; o >= 0; o--) {
      const s = n[o], a = s.matcher(e);
      if (!a) return null;
      r.unshift({ ...a, route: s });
    }
    return r;
  } };
}
function le$1(n) {
  return Array.isArray(n) ? n : [n];
}
function Je$1(n, t = "", e = [], r = []) {
  const o = le$1(n);
  for (let s = 0, a = o.length; s < a; s++) {
    const i = o[s];
    if (i && typeof i == "object") {
      i.hasOwnProperty("path") || (i.path = "");
      const d = ze$1(i, t);
      for (const f of d) {
        e.push(f);
        const l = Array.isArray(i.children) && i.children.length === 0;
        if (i.children && !l) Je$1(i.children, f.pattern, e, r);
        else {
          const m = De$1([...e], r.length);
          r.push(m);
        }
        e.pop();
      }
    }
  }
  return e.length ? r : r.sort((s, a) => a.score - s.score);
}
function F(n, t) {
  for (let e = 0, r = n.length; e < r; e++) {
    const o = n[e].matcher(t);
    if (o) return o;
  }
  return [];
}
function Ve$1(n, t, e) {
  const r = new URL(Be$1), o = createMemo((l) => {
    const m = n();
    try {
      return new URL(m, r);
    } catch {
      return console.error(`Invalid path ${m}`), l;
    }
  }, r, { equals: (l, m) => l.href === m.href }), s = createMemo(() => o().pathname), a = createMemo(() => o().search, true), i = createMemo(() => o().hash), d = () => "", f = on(a, () => se$1(o()));
  return { get pathname() {
    return s();
  }, get search() {
    return a();
  }, get hash() {
    return i();
  }, get state() {
    return t();
  }, get key() {
    return d();
  }, query: e ? e(f) : ae$1(f) };
}
let P;
function ot$1() {
  return P;
}
function st$1(n, t, e, r = {}) {
  const { signal: [o, s], utils: a = {} } = n, i = a.parsePath || ((c) => c), d = a.renderPath || ((c) => c), f = a.beforeLeave || Me$1(), l = M("", r.base || "");
  if (l === void 0) throw new Error(`${l} is not a valid base path`);
  l && !o().value && s({ value: l, replace: true, scroll: false });
  const [m, p] = createSignal(false);
  let h;
  const y = (c, u) => {
    u.value === w() && u.state === $() || (h === void 0 && p(true), P = c, h = u, startTransition(() => {
      h === u && (O(h.value), ue(h.state), resetErrorBoundaries(), isServer || H[1]((g) => g.filter((x) => x.pending)));
    }).finally(() => {
      h === u && batch(() => {
        P = void 0, c === "navigate" && pe(h), p(false), h = void 0;
      });
    }));
  }, [w, O] = createSignal(o().value), [$, ue] = createSignal(o().state), j = Ve$1(w, $, a.queryWrapper), S = [], H = createSignal(isServer ? ge() : []), z = createMemo(() => typeof r.transformUrl == "function" ? F(t(), r.transformUrl(j.pathname)) : F(t(), j.pathname)), D = () => {
    const c = z(), u = {};
    for (let g = 0; g < c.length; g++) Object.assign(u, c[g].params);
    return u;
  }, fe = a.paramsWrapper ? a.paramsWrapper(D, t) : ae$1(D), J = { pattern: l, path: () => l, outlet: () => null, resolvePath(c) {
    return M(l, c);
  } };
  return createRenderEffect(on(o, (c) => y("native", c), { defer: true })), { base: J, location: j, params: fe, isRouting: m, renderPath: d, parsePath: i, navigatorFactory: he, matches: z, beforeLeave: f, preloadRoute: me, singleFlight: r.singleFlight === void 0 ? true : r.singleFlight, submissions: H };
  function de(c, u, g) {
    untrack(() => {
      if (typeof u == "number") {
        u && (a.go ? a.go(u) : console.warn("Router integration does not support relative routing"));
        return;
      }
      const x = !u || u[0] === "?", { replace: T, resolve: R, scroll: L, state: b } = { replace: false, resolve: !x, scroll: true, ...g }, C = R ? c.resolvePath(u) : M(x && j.pathname || "", u);
      if (C === void 0) throw new Error(`Path '${u}' is not a routable path`);
      if (S.length >= Ue$1) throw new Error("Too many redirects");
      const V = w();
      if (C !== V || b !== $()) if (isServer) {
        const X = getRequestEvent();
        X && (X.response = { status: 302, headers: new Headers({ Location: C }) }), s({ value: C, replace: T, scroll: L, state: b });
      } else f.confirm(C, g) && (S.push({ value: V, replace: T, scroll: L, state: $() }), y("navigate", { value: C, state: b }));
    });
  }
  function he(c) {
    return c = c || useContext(ce$1) || J, (u, g) => de(c, u, g);
  }
  function pe(c) {
    const u = S[0];
    u && (s({ ...c, replace: u.replace, scroll: u.scroll }), S.length = 0);
  }
  function me(c, u) {
    const g = F(t(), c.pathname), x = P;
    P = "preload";
    for (let T in g) {
      const { route: R, params: L } = g[T];
      R.component && R.component.preload && R.component.preload();
      const { preload: b } = R;
      u && b && runWithOwner(e(), () => b({ params: L, location: { pathname: c.pathname, search: c.search, hash: c.hash, query: se$1(c), state: null, key: "" }, intent: "preload" }));
    }
    P = x;
  }
  function ge() {
    const c = getRequestEvent();
    return c && c.router && c.router.submission ? [c.router.submission] : [];
  }
}
function at(n, t, e, r) {
  const { base: o, location: s, params: a } = n, { pattern: i, component: d, preload: f } = r().route, l = createMemo(() => r().path);
  d && d.preload && d.preload();
  const m = f ? f({ params: a, location: s, intent: P || "initial" }) : void 0;
  return { parent: t, pattern: i, path: l, outlet: () => d ? createComponent(d, { params: a, location: s, data: m, get children() {
    return e();
  } }) : e(), resolvePath(h) {
    return M(o.path(), h, l());
  } };
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
function re(t) {
  let e;
  const r = Z(t), s = { duplex: "half", method: t.method, headers: t.headers };
  return t.node.req.body instanceof ArrayBuffer ? new Request(r, { ...s, body: t.node.req.body }) : new Request(r, { ...s, get body() {
    return e || (e = me(t), e);
  } });
}
function oe(t) {
  var _a;
  return (_a = t.web) != null ? _a : t.web = { request: re(t), url: Z(t) }, t.web.request;
}
function se() {
  return ye();
}
const X = /* @__PURE__ */ Symbol("$HTTPEvent");
function ne(t) {
  return typeof t == "object" && (t instanceof H3Event || (t == null ? void 0 : t[X]) instanceof H3Event || (t == null ? void 0 : t.__is_event__) === true);
}
function f(t) {
  return function(...e) {
    var _a;
    let r = e[0];
    if (ne(r)) e[0] = r instanceof H3Event || r.__is_event__ ? r : r[X];
    else {
      if (!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext)) throw new Error("AsyncLocalStorage was not enabled. Use the `server.experimental.asyncContext: true` option in your app configuration to enable it. Or, pass the instance of HTTPEvent that you have as the first argument to the function.");
      if (r = se(), !r) throw new Error("No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.");
      e.unshift(r);
    }
    return t(...e);
  };
}
const Z = f(getRequestURL$1), ae = f(getRequestIP), N = f(setResponseStatus$1), _ = f(getResponseStatus), ie = f(getResponseStatusText), A = f(getResponseHeaders), U = f(getResponseHeader$1), ce = f(setResponseHeader$1), pe = f(appendResponseHeader$1), j = f(sendRedirect$1), ue = f(getCookie), de = f(setCookie), le = f(setHeader), me = f(getRequestWebStream), he = f(removeResponseHeader$1), ge = f(oe);
function fe() {
  var _a;
  return getContext("nitro-app", { asyncContext: !!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext), AsyncLocalStorage: AsyncLocalStorage });
}
function ye() {
  return fe().use().event;
}
const tt = [{ page: true, $component: { src: "src/routes/api/pykeyboard.tsx?pick=default&pick=$css", build: () => import('../build/pykeyboard2.mjs'), import: () => import('../build/pykeyboard2.mjs') }, path: "/api/pykeyboard", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/api/pykeyboard.tsx" }, { page: true, $component: { src: "src/routes/api/pyrogram-patch.tsx?pick=default&pick=$css", build: () => import('../build/pyrogram-patch2.mjs'), import: () => import('../build/pyrogram-patch2.mjs') }, path: "/api/pyrogram-patch", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/api/pyrogram-patch.tsx" }, { page: true, $component: { src: "src/routes/getting-started.tsx?pick=default&pick=$css", build: () => import('../build/getting-started2.mjs'), import: () => import('../build/getting-started2.mjs') }, path: "/getting-started", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/getting-started.tsx" }, { page: true, $component: { src: "src/routes/index.tsx?pick=default&pick=$css", build: () => import('../build/index7.mjs'), import: () => import('../build/index7.mjs') }, path: "/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/index.tsx" }, { page: true, $component: { src: "src/routes/pykeyboard/builder.tsx?pick=default&pick=$css", build: () => import('../build/builder2.mjs'), import: () => import('../build/builder2.mjs') }, path: "/pykeyboard/builder", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/builder.tsx" }, { page: true, $component: { src: "src/routes/pykeyboard/factory.tsx?pick=default&pick=$css", build: () => import('../build/factory2.mjs'), import: () => import('../build/factory2.mjs') }, path: "/pykeyboard/factory", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/factory.tsx" }, { page: true, $component: { src: "src/routes/pykeyboard/hooks.tsx?pick=default&pick=$css", build: () => import('../build/hooks2.mjs'), import: () => import('../build/hooks2.mjs') }, path: "/pykeyboard/hooks", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/hooks.tsx" }, { page: true, $component: { src: "src/routes/pykeyboard/index.tsx?pick=default&pick=$css", build: () => import('../build/index22.mjs'), import: () => import('../build/index22.mjs') }, path: "/pykeyboard/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/index.tsx" }, { page: true, $component: { src: "src/routes/pykeyboard/inline-keyboard.tsx?pick=default&pick=$css", build: () => import('../build/inline-keyboard2.mjs'), import: () => import('../build/inline-keyboard2.mjs') }, path: "/pykeyboard/inline-keyboard", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/inline-keyboard.tsx" }, { page: true, $component: { src: "src/routes/pykeyboard/languages.tsx?pick=default&pick=$css", build: () => import('../build/languages2.mjs'), import: () => import('../build/languages2.mjs') }, path: "/pykeyboard/languages", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/languages.tsx" }, { page: true, $component: { src: "src/routes/pykeyboard/pagination.tsx?pick=default&pick=$css", build: () => import('../build/pagination2.mjs'), import: () => import('../build/pagination2.mjs') }, path: "/pykeyboard/pagination", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/pagination.tsx" }, { page: true, $component: { src: "src/routes/pykeyboard/reply-keyboard.tsx?pick=default&pick=$css", build: () => import('../build/reply-keyboard2.mjs'), import: () => import('../build/reply-keyboard2.mjs') }, path: "/pykeyboard/reply-keyboard", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/reply-keyboard.tsx" }, { page: true, $component: { src: "src/routes/pykeyboard/utilities.tsx?pick=default&pick=$css", build: () => import('../build/utilities2.mjs'), import: () => import('../build/utilities2.mjs') }, path: "/pykeyboard/utilities", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pykeyboard/utilities.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/circuit-breaker.tsx?pick=default&pick=$css", build: () => import('../build/circuit-breaker2.mjs'), import: () => import('../build/circuit-breaker2.mjs') }, path: "/pyrogram-patch/circuit-breaker", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/circuit-breaker.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/configuration.tsx?pick=default&pick=$css", build: () => import('../build/configuration2.mjs'), import: () => import('../build/configuration2.mjs') }, path: "/pyrogram-patch/configuration", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/configuration.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/dispatcher.tsx?pick=default&pick=$css", build: () => import('../build/dispatcher2.mjs'), import: () => import('../build/dispatcher2.mjs') }, path: "/pyrogram-patch/dispatcher", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/dispatcher.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/errors.tsx?pick=default&pick=$css", build: () => import('../build/errors2.mjs'), import: () => import('../build/errors2.mjs') }, path: "/pyrogram-patch/errors", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/errors.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/fsm/context.tsx?pick=default&pick=$css", build: () => import('../build/context3.mjs'), import: () => import('../build/context3.mjs') }, path: "/pyrogram-patch/fsm/context", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/fsm/context.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/fsm/filters.tsx?pick=default&pick=$css", build: () => import('../build/filters2.mjs'), import: () => import('../build/filters2.mjs') }, path: "/pyrogram-patch/fsm/filters", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/fsm/filters.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/fsm/index.tsx?pick=default&pick=$css", build: () => import('../build/index32.mjs'), import: () => import('../build/index32.mjs') }, path: "/pyrogram-patch/fsm/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/fsm/index.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/fsm/states.tsx?pick=default&pick=$css", build: () => import('../build/states2.mjs'), import: () => import('../build/states2.mjs') }, path: "/pyrogram-patch/fsm/states", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/fsm/states.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/index.tsx?pick=default&pick=$css", build: () => import('../build/index42.mjs'), import: () => import('../build/index42.mjs') }, path: "/pyrogram-patch/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/index.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/middleware/context.tsx?pick=default&pick=$css", build: () => import('../build/context22.mjs'), import: () => import('../build/context22.mjs') }, path: "/pyrogram-patch/middleware/context", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/middleware/context.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/middleware/fsm-inject.tsx?pick=default&pick=$css", build: () => import('../build/fsm-inject2.mjs'), import: () => import('../build/fsm-inject2.mjs') }, path: "/pyrogram-patch/middleware/fsm-inject", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/middleware/fsm-inject.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/middleware/index.tsx?pick=default&pick=$css", build: () => import('../build/index52.mjs'), import: () => import('../build/index52.mjs') }, path: "/pyrogram-patch/middleware/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/middleware/index.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/middleware/rate-limit.tsx?pick=default&pick=$css", build: () => import('../build/rate-limit2.mjs'), import: () => import('../build/rate-limit2.mjs') }, path: "/pyrogram-patch/middleware/rate-limit", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/middleware/rate-limit.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/middleware/writing.tsx?pick=default&pick=$css", build: () => import('../build/writing2.mjs'), import: () => import('../build/writing2.mjs') }, path: "/pyrogram-patch/middleware/writing", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/middleware/writing.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/patch-helper.tsx?pick=default&pick=$css", build: () => import('../build/patch-helper2.mjs'), import: () => import('../build/patch-helper2.mjs') }, path: "/pyrogram-patch/patch-helper", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/patch-helper.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/patching.tsx?pick=default&pick=$css", build: () => import('../build/patching2.mjs'), import: () => import('../build/patching2.mjs') }, path: "/pyrogram-patch/patching", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/patching.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/router.tsx?pick=default&pick=$css", build: () => import('../build/router2.mjs'), import: () => import('../build/router2.mjs') }, path: "/pyrogram-patch/router", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/router.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/storage/custom.tsx?pick=default&pick=$css", build: () => import('../build/custom2.mjs'), import: () => import('../build/custom2.mjs') }, path: "/pyrogram-patch/storage/custom", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/storage/custom.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/storage/index.tsx?pick=default&pick=$css", build: () => import('../build/index62.mjs'), import: () => import('../build/index62.mjs') }, path: "/pyrogram-patch/storage/", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/storage/index.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/storage/memory.tsx?pick=default&pick=$css", build: () => import('../build/memory2.mjs'), import: () => import('../build/memory2.mjs') }, path: "/pyrogram-patch/storage/memory", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/storage/memory.tsx" }, { page: true, $component: { src: "src/routes/pyrogram-patch/storage/redis.tsx?pick=default&pick=$css", build: () => import('../build/redis2.mjs'), import: () => import('../build/redis2.mjs') }, path: "/pyrogram-patch/storage/redis", filePath: "/home/demon/Desktop/DEV/PYTHON/kurigram-addons/docs/src/routes/pyrogram-patch/storage/redis.tsx" }], ke = be(tt.filter((t) => t.page));
function be(t) {
  function e(r, s, o, n) {
    const a = Object.values(r).find((i) => o.startsWith(i.id + "/"));
    return a ? (e(a.children || (a.children = []), s, o.slice(a.id.length)), r) : (r.push({ ...s, id: o, path: o.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/") }), r);
  }
  return t.sort((r, s) => r.path.length - s.path.length).reduce((r, s) => e(r, s, s.path, s.path), []);
}
function $e(t, e) {
  const r = we.lookup(t);
  if (r && r.route) {
    const s = r.route, o = e === "HEAD" ? s.$HEAD || s.$GET : s[`$${e}`];
    if (o === void 0) return;
    const n = s.page === true && s.$component !== void 0;
    return { handler: o, params: r.params, isPage: n };
  }
}
function xe(t) {
  return t.$HEAD || t.$GET || t.$POST || t.$PUT || t.$PATCH || t.$DELETE;
}
const we = createRouter({ routes: tt.reduce((t, e) => {
  if (!xe(e)) return t;
  let r = e.path.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/").replace(/\*([^/]*)/g, (s, o) => `**:${o}`).split("/").map((s) => s.startsWith(":") || s.startsWith("*") ? s : encodeURIComponent(s)).join("/");
  if (/:[^/]*\?/g.test(r)) throw new Error(`Optional parameters are not supported in API routes: ${r}`);
  if (t[r]) throw new Error(`Duplicate API routes for "${r}" found at "${t[r].route.path}" and "${e.path}"`);
  return t[r] = { route: e }, t;
}, {}) }), O = "solidFetchEvent";
function Ee(t) {
  return { request: ge(t), response: Re(t), clientAddress: ae(t), locals: {}, nativeEvent: t };
}
function Pe(t) {
  if (!t.context[O]) {
    const e = Ee(t);
    t.context[O] = e;
  }
  return t.context[O];
}
class Te {
  constructor(e) {
    __publicField(this, "event");
    this.event = e;
  }
  get(e) {
    const r = U(this.event, e);
    return Array.isArray(r) ? r.join(", ") : r || null;
  }
  has(e) {
    return this.get(e) !== null;
  }
  set(e, r) {
    return ce(this.event, e, r);
  }
  delete(e) {
    return he(this.event, e);
  }
  append(e, r) {
    pe(this.event, e, r);
  }
  getSetCookie() {
    const e = U(this.event, "Set-Cookie");
    return Array.isArray(e) ? e : [e];
  }
  forEach(e) {
    return Object.entries(A(this.event)).forEach(([r, s]) => e(Array.isArray(s) ? s.join(", ") : s, r, this));
  }
  entries() {
    return Object.entries(A(this.event)).map(([e, r]) => [e, Array.isArray(r) ? r.join(", ") : r])[Symbol.iterator]();
  }
  keys() {
    return Object.keys(A(this.event))[Symbol.iterator]();
  }
  values() {
    return Object.values(A(this.event)).map((e) => Array.isArray(e) ? e.join(", ") : e)[Symbol.iterator]();
  }
  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
}
function Re(t) {
  return { get status() {
    return _(t);
  }, set status(e) {
    N(t, e);
  }, get statusText() {
    return ie(t);
  }, set statusText(e) {
    N(t, _(t), e);
  }, headers: new Te(t) };
}
var Se = " ";
const De = { style: (t) => ssrElement("style", t.attrs, () => t.children, true), link: (t) => ssrElement("link", t.attrs, void 0, true), script: (t) => t.attrs.src ? ssrElement("script", mergeProps(() => t.attrs, { get id() {
  return t.key;
} }), () => ssr(Se), true) : null, noscript: (t) => ssrElement("noscript", t.attrs, () => escape(t.children), true) };
function L(t, e) {
  let { tag: r, attrs: { key: s, ...o } = { key: void 0 }, children: n } = t;
  return De[r]({ attrs: { ...o, nonce: e }, key: s, children: n });
}
function He(t, e, r, s = "default") {
  return lazy(async () => {
    var _a;
    {
      const n = (await t.import())[s], i = (await ((_a = e.inputs) == null ? void 0 : _a[t.src].assets())).filter((u) => u.tag === "style" || u.attrs.rel === "stylesheet");
      return { default: (u) => [...i.map((k) => L(k)), createComponent(n, u)] };
    }
  });
}
function et() {
  function t(r) {
    return { ...r, ...r.$$route ? r.$$route.require().route : void 0, info: { ...r.$$route ? r.$$route.require().route.info : {}, filesystem: true }, component: r.$component && He(r.$component, globalThis.MANIFEST.client, globalThis.MANIFEST.ssr), children: r.children ? r.children.map(t) : void 0 };
  }
  return ke.map(t);
}
let W;
const Ae = isServer ? () => getRequestEvent().routes : () => W || (W = et());
function Oe(t) {
  const e = ue(t.nativeEvent, "flash");
  if (e) try {
    let r = JSON.parse(e);
    if (!r || !r.result) return;
    const s = [...r.input.slice(0, -1), new Map(r.input[r.input.length - 1])], o = r.error ? new Error(r.result) : r.result;
    return { input: s, url: r.url, pending: false, result: r.thrown ? void 0 : o, error: r.thrown ? o : void 0 };
  } catch (r) {
    console.error(r);
  } finally {
    de(t.nativeEvent, "flash", "", { maxAge: 0 });
  }
}
async function Ce(t) {
  const e = globalThis.MANIFEST.client;
  return globalThis.MANIFEST.ssr, t.response.headers.set("Content-Type", "text/html"), Object.assign(t, { manifest: await e.json(), assets: [...await e.inputs[e.handler].assets()], router: { submission: Oe(t) }, routes: et(), complete: false, $islands: /* @__PURE__ */ new Set() });
}
const Ne = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function q(t) {
  return t.status && Ne.has(t.status) ? t.status : 302;
}
function Le(t, e, r = {}, s) {
  return eventHandler$1({ handler: (o) => {
    const n = Pe(o);
    return provideRequestEvent(n, async () => {
      const a = $e(new URL(n.request.url).pathname, n.request.method);
      if (a) {
        const h = await a.handler.import(), y = n.request.method === "HEAD" ? h.HEAD || h.GET : h[n.request.method];
        n.params = a.params || {}, sharedConfig.context = { event: n };
        const c = await y(n);
        if (c !== void 0) return c;
        if (n.request.method !== "GET") throw new Error(`API handler for ${n.request.method} "${n.request.url}" did not return a response.`);
        if (!a.isPage) return;
      }
      const i = await e(n), p = typeof r == "function" ? await r(i) : { ...r }, u = p.mode || "stream";
      if (p.nonce && (i.nonce = p.nonce), u === "sync") {
        const h = renderToString(() => (sharedConfig.context.event = i, t(i)), p);
        if (i.complete = true, i.response && i.response.headers.get("Location")) {
          const y = q(i.response);
          return j(o, i.response.headers.get("Location"), y);
        }
        return h;
      }
      if (p.onCompleteAll) {
        const h = p.onCompleteAll;
        p.onCompleteAll = (y) => {
          K(i)(y), h(y);
        };
      } else p.onCompleteAll = K(i);
      if (p.onCompleteShell) {
        const h = p.onCompleteShell;
        p.onCompleteShell = (y) => {
          B(i, o)(), h(y);
        };
      } else p.onCompleteShell = B(i, o);
      const k = renderToStream(() => (sharedConfig.context.event = i, t(i)), p);
      if (i.response && i.response.headers.get("Location")) {
        const h = q(i.response);
        return j(o, i.response.headers.get("Location"), h);
      }
      if (u === "async") return k;
      const { writable: w, readable: x } = new TransformStream();
      return k.pipeTo(w), x;
    });
  } });
}
function B(t, e) {
  return () => {
    if (t.response && t.response.headers.get("Location")) {
      const r = q(t.response);
      N(e, r), le(e, "Location", t.response.headers.get("Location"));
    }
  };
}
function K(t) {
  return ({ write: e }) => {
    t.complete = true;
    const r = t.response && t.response.headers.get("Location");
    r && e(`<script>window.location="${r}"<\/script>`);
  };
}
function qe(t, e, r) {
  return Le(t, Ce, e);
}
const rt = (t) => (e) => {
  const { base: r } = e, s = children(() => e.children), o = createMemo(() => Je$1(s(), e.base || ""));
  let n;
  const a = st$1(t, o, () => n, { base: r, singleFlight: e.singleFlight, transformUrl: e.transformUrl });
  return t.create && t.create(a), createComponent$1(ke$1.Provider, { value: a, get children() {
    return createComponent$1(Ve, { routerState: a, get root() {
      return e.root;
    }, get preload() {
      return e.rootPreload || e.rootLoad;
    }, get children() {
      return [(n = getOwner()) && null, createComponent$1(Ye, { routerState: a, get branches() {
        return o();
      } })];
    } });
  } });
};
function Ve(t) {
  const e = t.routerState.location, r = t.routerState.params, s = createMemo(() => t.preload && untrack(() => {
    t.preload({ params: r, location: e, intent: ot$1() || "initial" });
  }));
  return createComponent$1(Show, { get when() {
    return t.root;
  }, keyed: true, get fallback() {
    return t.children;
  }, children: (o) => createComponent$1(o, { params: r, location: e, get data() {
    return s();
  }, get children() {
    return t.children;
  } }) });
}
function Ye(t) {
  if (isServer) {
    const o = getRequestEvent();
    if (o && o.router && o.router.dataOnly) {
      Ie(o, t.routerState, t.branches);
      return;
    }
    o && ((o.router || (o.router = {})).matches || (o.router.matches = t.routerState.matches().map(({ route: n, path: a, params: i }) => ({ path: n.originalPath, pattern: n.pattern, match: a, params: i, info: n.info }))));
  }
  const e = [];
  let r;
  const s = createMemo(on(t.routerState.matches, (o, n, a) => {
    let i = n && o.length === n.length;
    const p = [];
    for (let u = 0, k = o.length; u < k; u++) {
      const w = n && n[u], x = o[u];
      a && w && x.route.key === w.route.key ? p[u] = a[u] : (i = false, e[u] && e[u](), createRoot((h) => {
        e[u] = h, p[u] = at(t.routerState, p[u - 1] || t.routerState.base, z(() => s()[u + 1]), () => {
          var _a;
          const y = t.routerState.matches();
          return (_a = y[u]) != null ? _a : y[0];
        });
      }));
    }
    return e.splice(o.length).forEach((u) => u()), a && i ? a : (r = p[0], p);
  }));
  return z(() => s() && r)();
}
const z = (t) => () => createComponent$1(Show, { get when() {
  return t();
}, keyed: true, children: (e) => createComponent$1(ce$1.Provider, { value: e, get children() {
  return e.outlet();
} }) });
function Ie(t, e, r) {
  const s = new URL(t.request.url), o = F(r, new URL(t.router.previousUrl || t.request.url).pathname), n = F(r, s.pathname);
  for (let a = 0; a < n.length; a++) {
    (!o[a] || n[a].route !== o[a].route) && (t.router.dataOnly = true);
    const { route: i, params: p } = n[a];
    i.preload && i.preload({ params: p, location: e.location, intent: "preload" });
  }
}
function Fe([t, e], r, s) {
  return [t, s ? (o) => e(s(o)) : e];
}
function Me(t) {
  let e = false;
  const r = (o) => typeof o == "string" ? { value: o } : o, s = Fe(createSignal(r(t.get()), { equals: (o, n) => o.value === n.value && o.state === n.state }), void 0, (o) => (!e && t.set(o), sharedConfig.registry && !sharedConfig.done && (sharedConfig.done = true), o));
  return t.init && onCleanup(t.init((o = t.get()) => {
    e = true, s[1](r(o)), e = false;
  })), rt({ signal: s, create: t.create, utils: t.utils });
}
function _e(t, e, r) {
  return t.addEventListener(e, r), () => t.removeEventListener(e, r);
}
function Ue(t, e) {
  const r = t && document.getElementById(t);
  r ? r.scrollIntoView() : e && window.scrollTo(0, 0);
}
function je(t) {
  const e = new URL(t);
  return e.pathname + e.search;
}
function We(t) {
  let e;
  const r = { value: t.url || (e = getRequestEvent()) && je(e.request.url) || "" };
  return rt({ signal: [() => r, (s) => Object.assign(r, s)] })(t);
}
const Be = /* @__PURE__ */ new Map();
function Ke(t = true, e = false, r = "/_server", s) {
  return (o) => {
    const n = o.base.path(), a = o.navigatorFactory(o.base);
    let i, p;
    function u(c) {
      return c.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function k(c) {
      if (c.defaultPrevented || c.button !== 0 || c.metaKey || c.altKey || c.ctrlKey || c.shiftKey) return;
      const d = c.composedPath().find((F) => F instanceof Node && F.nodeName.toUpperCase() === "A");
      if (!d || e && !d.hasAttribute("link")) return;
      const g = u(d), m = g ? d.href.baseVal : d.href;
      if ((g ? d.target.baseVal : d.target) || !m && !d.hasAttribute("state")) return;
      const T = (d.getAttribute("rel") || "").split(/\s+/);
      if (d.hasAttribute("download") || T && T.includes("external")) return;
      const S = g ? new URL(m, document.baseURI) : new URL(m);
      if (!(S.origin !== window.location.origin || n && S.pathname && !S.pathname.toLowerCase().startsWith(n.toLowerCase()))) return [d, S];
    }
    function w(c) {
      const d = k(c);
      if (!d) return;
      const [g, m] = d, I = o.parsePath(m.pathname + m.search + m.hash), T = g.getAttribute("state");
      c.preventDefault(), a(I, { resolve: false, replace: g.hasAttribute("replace"), scroll: !g.hasAttribute("noscroll"), state: T ? JSON.parse(T) : void 0 });
    }
    function x(c) {
      const d = k(c);
      if (!d) return;
      const [g, m] = d;
      s && (m.pathname = s(m.pathname)), o.preloadRoute(m, g.getAttribute("preload") !== "false");
    }
    function h(c) {
      clearTimeout(i);
      const d = k(c);
      if (!d) return p = null;
      const [g, m] = d;
      p !== g && (s && (m.pathname = s(m.pathname)), i = setTimeout(() => {
        o.preloadRoute(m, g.getAttribute("preload") !== "false"), p = g;
      }, 20));
    }
    function y(c) {
      if (c.defaultPrevented) return;
      let d = c.submitter && c.submitter.hasAttribute("formaction") ? c.submitter.getAttribute("formaction") : c.target.getAttribute("action");
      if (!d) return;
      if (!d.startsWith("https://action/")) {
        const m = new URL(d, Be$1);
        if (d = o.parsePath(m.pathname + m.search), !d.startsWith(r)) return;
      }
      if (c.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const g = Be.get(d);
      if (g) {
        c.preventDefault();
        const m = new FormData(c.target, c.submitter);
        g.call({ r: o, f: c.target }, c.target.enctype === "multipart/form-data" ? m : new URLSearchParams(m));
      }
    }
    delegateEvents(["click", "submit"]), document.addEventListener("click", w), t && (document.addEventListener("mousemove", h, { passive: true }), document.addEventListener("focusin", x, { passive: true }), document.addEventListener("touchstart", x, { passive: true })), document.addEventListener("submit", y), onCleanup(() => {
      document.removeEventListener("click", w), t && (document.removeEventListener("mousemove", h), document.removeEventListener("focusin", x), document.removeEventListener("touchstart", x)), document.removeEventListener("submit", y);
    });
  };
}
function ze(t) {
  if (isServer) return We(t);
  const e = () => {
    const s = window.location.pathname.replace(/^\/+/, "/") + window.location.search, o = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return { value: s + window.location.hash, state: o };
  }, r = Me$1();
  return Me({ get: e, set({ value: s, replace: o, scroll: n, state: a }) {
    o ? window.history.replaceState(Ze$1(a), "", s) : window.history.pushState(a, "", s), Ue(decodeURIComponent(window.location.hash.slice(1)), n), oe$1();
  }, init: (s) => _e(window, "popstate", et$1(s, (o) => {
    if (o) return !r.confirm(o);
    {
      const n = e();
      return !r.confirm(n.value, { state: n.state });
    }
  })), create: Ke(t.preload, t.explicitLinks, t.actionBase, t.transformUrl), utils: { go: (s) => window.history.go(s), beforeLeave: r } })(t);
}
function Ge() {
  return createComponent$1(ze, { root: (t) => createComponent$1(Qe$1, { get children() {
    return [createComponent$1(Ye$1, { children: "kurigram-addons \u2014 Documentation" }), createComponent$1(Suspense, { get children() {
      return t.children;
    } })];
  } }), get children() {
    return createComponent$1(Ae, {});
  } });
}
const ot = isServer ? (t) => {
  const e = getRequestEvent();
  return e.response.status = t.code, e.response.statusText = t.text, onCleanup(() => !e.nativeEvent.handled && !e.complete && (e.response.status = 200)), null;
} : (t) => null;
var Je = ["<span", ' style="font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%;">', "</span>"], Qe = ["<span", ' style="font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%;">500 | Internal Server Error</span>'];
const Xe = (t) => {
  const e = isServer ? "500 | Internal Server Error" : "Error | Uncaught Client Exception";
  return createComponent$1(ErrorBoundary, { fallback: (r) => (console.error(r), [ssr(Je, ssrHydrationKey(), escape(e)), createComponent$1(ot, { code: 500 })]), get children() {
    return t.children;
  } });
}, Ze = (t) => {
  let e = false;
  const r = catchError(() => t.children, (s) => {
    console.error(s), e = !!s;
  });
  return e ? [ssr(Qe, ssrHydrationKey()), createComponent$1(ot, { code: 500 })] : r;
};
var G = ["<script", ">", "<\/script>"], tr = ["<script", ' type="module"', " async", "><\/script>"], er = ["<script", ' type="module" async', "><\/script>"];
const rr = ssr("<!DOCTYPE html>");
function st(t, e, r = []) {
  for (let s = 0; s < e.length; s++) {
    const o = e[s];
    if (o.path !== t[0].path) continue;
    let n = [...r, o];
    if (o.children) {
      const a = t.slice(1);
      if (a.length === 0 || (n = st(a, o.children, n), !n)) continue;
    }
    return n;
  }
}
function or(t) {
  const e = getRequestEvent(), r = e.nonce;
  let s = [];
  return Promise.resolve().then(async () => {
    let o = [];
    if (e.router && e.router.matches) {
      const n = [...e.router.matches];
      for (; n.length && (!n[0].info || !n[0].info.filesystem); ) n.shift();
      const a = n.length && st(n, e.routes);
      if (a) {
        const i = globalThis.MANIFEST.client.inputs;
        for (let p = 0; p < a.length; p++) {
          const u = a[p], k = i[u.$component.src];
          o.push(k.assets());
        }
      }
    }
    s = await Promise.all(o).then((n) => [...new Map(n.flat().map((a) => [a.attrs.key, a])).values()].filter((a) => a.attrs.rel === "modulepreload" && !e.assets.find((i) => i.attrs.key === a.attrs.key)));
  }), useAssets(() => s.length ? s.map((o) => L(o)) : void 0), createComponent$1(NoHydration, { get children() {
    return [rr, createComponent$1(Ze, { get children() {
      return createComponent$1(t.document, { get assets() {
        return [createComponent$1(HydrationScript, {}), e.assets.map((o) => L(o, r))];
      }, get scripts() {
        return r ? [ssr(G, ssrHydrationKey() + ssrAttribute("nonce", escape(r, true), false), `window.manifest = ${JSON.stringify(e.manifest)}`), ssr(tr, ssrHydrationKey(), ssrAttribute("nonce", escape(r, true), false), ssrAttribute("src", escape(globalThis.MANIFEST.client.inputs[globalThis.MANIFEST.client.handler].output.path, true), false))] : [ssr(G, ssrHydrationKey(), `window.manifest = ${JSON.stringify(e.manifest)}`), ssr(er, ssrHydrationKey(), ssrAttribute("src", escape(globalThis.MANIFEST.client.inputs[globalThis.MANIFEST.client.handler].output.path, true), false))];
      }, get children() {
        return createComponent$1(Hydration, { get children() {
          return createComponent$1(Xe, { get children() {
            return createComponent$1(Ge, {});
          } });
        } });
      } });
    } })];
  } });
}
var sr = ['<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Modern Telegram bot toolkit for Kurigram/Pyrogram \u2014 declarative keyboards, FSM, middlewares, circuit breaker"><link rel="icon" href="/kurigram-addons/logo.png">', "</head>"], nr = ["<html", ' lang="en">', '<body id="app" class="antialiased"><div id="app">', "</div><!--$-->", "<!--/--></body></html>"];
const hr = qe(() => createComponent$1(or, { document: ({ assets: t, children: e, scripts: r }) => ssr(nr, ssrHydrationKey(), createComponent$1(NoHydration, { get children() {
  return ssr(sr, escape(t));
} }), escape(e), escape(r)) }));

const handlers = [
  { route: '', handler: _LVApmG, lazy: false, middleware: true, method: undefined },
  { route: '/_server', handler: At, lazy: false, middleware: true, method: undefined },
  { route: '/', handler: hr, lazy: false, middleware: true, method: undefined }
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

export { E, Ye$1 as Y, closePrerenderer as c, localFetch as l, nt as n, qt as q, rt$1 as r, tt$1 as t };
//# sourceMappingURL=nitro.mjs.map
