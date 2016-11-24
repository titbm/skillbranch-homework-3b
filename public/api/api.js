'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var URL_TO_GET_DATA = 'https://gist.githubusercontent.com/isuvorov/55f38b82ce263836dadc0503845db4da/raw/pets.json';

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