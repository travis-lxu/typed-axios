import { AxiosRequestConfig } from './types/index';
import { processHeaders } from './helpers/headers';
import { transformRequest, transformResponse } from './helpers/data';

const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  transformRequest: [
    (data: any, headers: any): any => {
      processHeaders(headers, data);
      return transformRequest(data);
    }
  ],
  transformResponse: [
    (data: any): any => {
      return transformResponse(data);
    }
  ],

  validateStatus(status: number): boolean {
    return status >= 200 && status < 300;
  }
};

const methodsNoData = ['delete', 'get', 'head', 'options'];
methodsNoData.forEach(method => {
  defaults.headers[method] = {};
});

const methodsWtihData = ['post', 'put', 'patch'];
methodsWtihData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };
});

export default defaults;
