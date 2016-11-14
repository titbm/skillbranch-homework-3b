'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _api = require('./api/api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EXPRESS = require('express');
var CHALK = require('chalk');
var CORS = require('cors');
// var open = require('open');

function searchIn(array, object) {
  var counter = 0;
  function search(arrayInner, objectInner) {
    if (arrayInner[counter] in objectInner) {
      if (objectInner[arrayInner[counter]] instanceof Object) {
        var tempObject = (0, _assign2.default)({}, objectInner[arrayInner[counter]]);
        if (counter < arrayInner.length - 1) {
          counter += 1;
          return search(arrayInner, tempObject);
        }
      }
      return counter === arrayInner.length - 1 ? objectInner[arrayInner[counter]] : false;
    }
    return false;
  }
  return search(array, object);
}

var SERVER = EXPRESS();
var PORT = process.env.PORT || 3000;

SERVER.use(CORS());

SERVER.get(/^(?:\/(?:[a-z]+)?)+/, function (request, response) {
  var id = request.url.replace(/\/$/, '').substr(1).split('/');
  _api2.default.getData().then(function (result) {
    var searchResult = !id[0] && id.length === 1 ? result : searchIn(id, result);

    if (id.length === 1 && id[0] === 'volumes') {
      (function () {
        var freeSpaces = {};
        result.hdd.forEach(function (hdd) {
          var searchItem = hdd.volume;
          var size = 0;
          result.hdd.forEach(function (hard) {
            if (searchItem === hard.volume) {
              size += hard.size;
            }
          });
          freeSpaces[searchItem] = size + 'B';
        });
        searchResult = freeSpaces;
      })();
    }

    if (searchResult !== false) {
      response.json(searchResult);
    } else {
      response.status(404).send('Not Found');
    }
  });
});

SERVER.listen(PORT, function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log(CHALK.cyan('Server is up on port: ' + PORT));
    // open("http://localhost:" + PORT);
  }
});