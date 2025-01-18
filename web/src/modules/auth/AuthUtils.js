export class AuthUtils {
  constructor() {}

  /**
   * Is token expired?
   */
  static isTokenExpired(token, offsetSeconds = 0) {
    // Return if there is no token
    if (!token) {
      return true;
    }

    // Get the expiration date
    const date = this._getTokenExpirationDate(token);
    if (date === null) {
      return true;
    }

    // Check if the token is expired
    return date.valueOf() < Date.now() + offsetSeconds * 1000;
  }

  static isValid(token) {
    try {
      return Boolean(this._decodeToken(token));
    } catch (error) {
      return false;
    }
  }

  /**
   * Returns token if it's properly encoded and not expired,
   * otherwise an empty string
   * @param token {String}
   * @param offset {Number}
   * @return {string|*}
   */

  static validate(token, offset) {
    if (AuthUtils.isValid(token) && !AuthUtils.isTokenExpired(token, offset)) {
      return token;
    }
    return '';
  }

  /**
   * Base64 unicode decoder
   */
  static _b64DecodeUnicode(str) {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(str), (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
  }

  /**
   * URL Base 64 decoder
   */
  static _urlBase64Decode(str) {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: {
        break;
      }
      case 2: {
        output += '==';
        break;
      }
      case 3: {
        output += '=';
        break;
      }
      default: {
        throw Error('Illegal base64url string!');
      }
    }
    return this._b64DecodeUnicode(output);
  }

  /**
   * Decode token
   */
  static _decodeToken(token) {
    // Return if there is no token
    if (!token) {
      return null;
    }

    // Split the token
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error(
        "The inspected token doesn't appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.",
      );
    }

    // Decode the token using the Base64 decoder
    const decoded = this._urlBase64Decode(parts[1]);

    if (!decoded) {
      throw new Error('Cannot decode the token.');
    }

    return JSON.parse(decoded);
  }

  /**
   * Get token expiration date
   */
  static _getTokenExpirationDate(token) {
    // Get the decoded token
    const decodedToken = this._decodeToken(token);

    // Return if the decodedToken doesn't have an 'exp' field
    if (!decodedToken.hasOwnProperty('exp')) {
      return null;
    }

    // Convert the expiration date
    const date = new Date(0);
    date.setUTCSeconds(decodedToken.exp);

    return date;
  }
}
