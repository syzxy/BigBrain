/**
 * A Helper function that talks to server.
 */
import * as config from '../config.json';

const getJSON = (path, options) => {
  return (
    fetch(path, options)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .catch((err) => {
        console.warn(`API_ERROR: ${err.message}`);
        throw (err);
      })
  );
};

export default class API {
  constructor () {
    this.base = `http://localhost:${config.BACKEND_PORT}`;
  }
}

API.prototype.makeRequest = function (path, options) {
  return getJSON(`${this.base}/${path}`, options);
}
