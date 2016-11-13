'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var URL_TO_GET_DATA = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';

var api = {
  getData: function getData() {
    return _axios2.default.get(URL_TO_GET_DATA).then(function (response) {
      return response.data;
    }).catch(function (error) {
      throw new Error(error);
    });
  }
};

exports.default = api;