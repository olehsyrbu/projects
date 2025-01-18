export class UrlProviderProfileQuery {
  /**
   * Creates url query from object
   * @param {Object} obj - query param
   */

  static create(obj) {
    const params = new UrlProviderProfileQuery();

    if (obj.distance) {
      params.distance = obj.distance;
    }

    return params;
  }

  /**
   * @constructor
   * @param {Object} context
   * @param {String} context.search - url query param string
   */

  constructor(context = { search: '' }) {
    this._params = new URLSearchParams(context.search);
  }

  get distance() {
    return this._params.get('distance');
  }

  set distance(value) {
    return this._params.set('distance', value);
  }

  toString() {
    return this._params.toString();
  }

  toJSON() {
    const result = {};

    if (this.distance !== null) {
      result.distance = this.distance;
    }

    return result;
  }
}
