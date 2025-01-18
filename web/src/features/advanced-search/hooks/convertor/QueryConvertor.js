import { merge, isObject, isString, isEmpty } from 'lodash-es';

export class QueryConvertor {
  static buildConvertor =
    (attributes) =>
    (data = {}) => {
      return new QueryConvertor(data, attributes).toQueryVars();
    };

  constructor(context = {}, attributes = {}) {
    this._attributes = attributes;
    this._context = this._initDefaults(attributes, context);
  }

  _initDefaults(attributes, context) {
    return Object.keys(attributes).reduce((memo, key) => {
      const value = context[key];
      const attr = attributes[key];

      if (attr.type === Object && !isObject(value)) {
        memo[key] = undefined;
        return memo;
      }

      if (attr.type === String && (isEmpty(value) || !isString(value))) {
        memo[key] = undefined;
        return memo;
      }

      if (value !== undefined) {
        return memo;
      }

      if (attr.default !== undefined) {
        memo[key] = attr.default;
      }

      return memo;
    }, context);
  }

  toQueryVars() {
    let attributes = this._attributes;
    let context = this._context;

    return Object.keys(attributes).reduce((memo, key) => {
      const value = context[key];
      const attr = attributes[key];

      if (value === undefined) {
        return memo;
      }

      if (attr.type === Array && value.length === 0) {
        return memo;
      }

      const convert = attr.toQuery ? attr.toQuery : (val) => ({ [key]: val });

      let result = convert(value, attr, context);

      if (!result) {
        return memo;
      }

      return merge(memo, result);
    }, {});
  }
}

export const createConvertor = (attributes) => (data) => {
  return new QueryConvertor(data, attributes).toQueryVars();
};
