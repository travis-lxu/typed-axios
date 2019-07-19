import { isDate, isPlainObject } from './util';

/**************************************** helper functions ****************************************/

interface URLOrigin {
  protocol: string;
  host: string;
}

/**
 * Encodes a text string and don't escape special characters
 * @param val
 */
const encode = (val: string): string => {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']');
};

const urlParsingNode = document.createElement('a');
const resolveURL = (url: string): URLOrigin => {
  urlParsingNode.setAttribute('href', url);
  const { protocol, host } = urlParsingNode;

  return {
    protocol,
    host
  };
};

/**************************************** export functions ****************************************/

/**
 * Add params to url
 * @param url
 * @param params
 */
export const buildURL = (url: string, params?: any): string => {
  if (!params) {
    return url;
  }
  const parts: string[] = [];
  Object.keys(params).forEach(key => {
    const val = params[key];
    if (val === null || typeof val === 'undefined') {
      return;
    }
    let values = [];
    if (Array.isArray(val)) {
      values = val;
      key += '[]';
    } else {
      values = [val];
    }
    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString();
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val);
      }
      parts.push(`${encode(key)}=${encode(val)}`);
    });
  });

  let serializedParams = parts.join('&');
  if (serializedParams) {
    const markIndex = url.indexOf('#');
    if (markIndex !== -1) {
      url = url.slice(0, markIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }
  return url;
};

const currentOrigin = resolveURL(window.location.href);
export const isURLSameOrigin = (requestURL: string): boolean => {
  const parsedOrigin = resolveURL(requestURL);
  return (parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host);
};
