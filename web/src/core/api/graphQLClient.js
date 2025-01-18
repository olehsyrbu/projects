import { GraphQLClient } from 'graphql-request';
import config from '../config';

class Client extends GraphQLClient {
  constructor(url, options, config = {}) {
    super(url, options);
    this._config = config;
    this._errInterceptors = [];
  }

  setAuth(token) {
    this.setHeader('Authorization', `Bearer ${token}`);
  }

  removeAuth() {
    this.setHeader('Authorization', '');
  }

  async request(document, variables, requestHeaders) {
    let result = null;

    try {
      result = await super.request(document, variables, requestHeaders);
      return result;
    } catch (error) {
      this._runErrorInterceptors(error);
      throw error;
    }
  }

  _runErrorInterceptors(error) {
    // workaround for swr to not loose error because callbacks execution
    setTimeout(() => {
      this._errInterceptors.forEach((callback) => {
        callback(error);
      });
    });
  }

  addErrorInterceptor(fn) {
    this._errInterceptors.push(fn);
  }

  removeErrorInterceptor(fn) {
    const index = this._errInterceptors.findIndex(fn);
    if (index !== -1) {
      this._errInterceptors.splice(index, 1);
    }
  }
}

let client = new Client(config.api.baseUrl);

export default client;
