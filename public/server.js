'use strict';

var _api = require('./api/api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EXPRESS = require('express');
var CHALK = require('chalk');
var CORS = require('cors');
var _ = require('underscore');
// var open = require('open');

// function searchIn(array, object) {
//   let counter = 0;
//   function search(arrayInner, objectInner) {
//     if (arrayInner[counter] in objectInner) {
//       if (objectInner[arrayInner[counter]] instanceof Object) {
//         const tempObject = Object.assign({}, objectInner[arrayInner[counter]]);
//         if (counter < arrayInner.length - 1) {
//           counter += 1;
//           return search(arrayInner, tempObject);
//         }
//       }
//       return ((counter === arrayInner.length - 1) ? objectInner[arrayInner[counter]] : false);
//     }
//     return false;
//   }
//   return search(array, object);
// }


var SERVER = EXPRESS();
var PORT = process.env.PORT || 3000;

SERVER.use(CORS());

SERVER.get('/', function (request, response) {
  _api2.default.getData().then(function (result) {
    response.send(result);
  });
});

SERVER.get('/users', function (request, response) {
  var query = request.query;

  _api2.default.getData().then(function (result) {
    var filteredUsers = result.users;

    if (query.hasOwnProperty('havePet')) {
      (function () {
        var filteredPets = _.where(result.pets, { type: query.havePet });
        filteredUsers = _.filter(filteredUsers, function (user) {
          for (var i = 0; i < filteredPets.length; i += 1) {
            if (filteredPets[i].userId === user.id) return user;
          }
        });
      })();
    }

    response.send(filteredUsers);
  });
});

SERVER.get('/users/populate', function (request, response) {
  var query = request.query;

  _api2.default.getData().then(function (result) {
    var filteredUsers = result.users;

    filteredUsers = _.map(filteredUsers, function (user) {
      var id = user.id;
      var pets = _.where(result.pets, { userId: id });
      var extendedUser = _.extend(user, { pets: pets });
      return extendedUser;
    });

    if (query.hasOwnProperty('havePet')) {
      (function () {
        var filteredPets = _.where(result.pets, { type: query.havePet });
        filteredUsers = _.filter(filteredUsers, function (user) {
          for (var i = 0; i < filteredPets.length; i += 1) {
            if (filteredPets[i].userId === user.id) return user;
          }
        });
      })();
    }

    response.send(filteredUsers);
  });
});

SERVER.get('/users/:id', function (request, response) {
  var id = parseInt(request.params.id, 10);

  if (isNaN(id)) {
    _api2.default.getData().then(function (result) {
      var user = _.findWhere(result.users, { username: request.params.id });
      if (user) {
        response.send(user);
      } else {
        response.status(404).send('Not Found');
      }
    });
  } else {
    _api2.default.getData().then(function (result) {
      var user = _.findWhere(result.users, { id: id });
      if (user) {
        response.send(user);
      } else {
        response.status(404).send('Not Found');
      }
    });
  }
});

SERVER.get('/users/:id/populate', function (request, response) {
  var id = parseInt(request.params.id, 10);

  if (isNaN(id)) {
    _api2.default.getData().then(function (result) {
      var user = _.findWhere(result.users, { username: request.params.id });
      if (user) {
        var pets = _.where(result.pets, { userId: user.id });
        var extendedUser = _.extend(user, { pets: pets });
        response.send(extendedUser);
      } else {
        response.status(404).send('Not Found');
      }
    });
  } else {
    _api2.default.getData().then(function (result) {
      var user = _.findWhere(result.users, { id: id });
      if (user) {
        var pets = _.where(result.pets, { userId: user.id });
        var extendedUser = _.extend(user, { pets: pets });
        response.send(user);
      } else {
        response.status(404).send('Not Found');
      }
    });
  }
});

SERVER.get('/users/:id/pets', function (request, response) {
  var id = parseInt(request.params.id, 10);

  if (isNaN(id)) {
    _api2.default.getData().then(function (result) {
      var user = _.where(result.users, { username: request.params.id });
      var pets = _.where(result.pets, { userId: user[0].id });
      if (pets) {
        response.send(pets);
      } else {
        response.status(404).send('Not Found');
      }
    });
  } else {
    _api2.default.getData().then(function (result) {
      var user = _.where(result.users, { id: id });
      var pets = _.where(result.pets, { userId: user[0].id });
      if (pets) {
        response.send(pets);
      } else {
        response.status(404).send('Not Found');
      }
    });
  }
});

SERVER.get('/pets', function (request, response) {
  var query = request.query;

  _api2.default.getData().then(function (result) {
    var filteredPets = result.pets;

    if (query.hasOwnProperty('type')) {
      filteredPets = _.where(filteredPets, { type: query.type });
    }

    if (query.hasOwnProperty('age')) {
      filteredPets = _.where(filteredPets, { age: query.age });
    }

    if (query.hasOwnProperty('color')) {
      filteredPets = _.where(filteredPets, { color: query.color });
    }

    if (query.hasOwnProperty('age_gt')) {
      filteredPets = _.filter(filteredPets, function (pet) {
        return pet.age > query.age_gt;
      });
    }

    if (query.hasOwnProperty('age_lt')) {
      filteredPets = _.filter(filteredPets, function (pet) {
        return pet.age < query.age_lt;
      });
    }

    response.send(filteredPets);
  });
});

SERVER.get('/pets/populate', function (request, response) {
  var query = request.query;

  _api2.default.getData().then(function (result) {
    var filteredPets = result.pets;
    var users = result.users;

    filteredPets = _.map(filteredPets, function (pet) {
      var id = pet.userId;
      var user = _.findWhere(users, { id: id });
      var extendedPet = _.extend(pet, { user: user });
      return extendedPet;
    });

    if (query.hasOwnProperty('type')) {
      filteredPets = _.where(filteredPets, { type: query.type });
    }

    if (query.hasOwnProperty('age')) {
      filteredPets = _.where(filteredPets, { age: query.age });
    }

    if (query.hasOwnProperty('color')) {
      filteredPets = _.where(filteredPets, { color: query.color });
    }

    if (query.hasOwnProperty('age_gt')) {
      filteredPets = _.filter(filteredPets, function (pet) {
        return pet.age > query.age_gt;
      });
    }

    if (query.hasOwnProperty('age_lt')) {
      filteredPets = _.filter(filteredPets, function (pet) {
        return pet.age < query.age_lt;
      });
    }

    response.send(filteredPets);
  });
});

SERVER.get('/pets/:id', function (request, response) {
  var petId = parseInt(request.params.id, 10);

  _api2.default.getData().then(function (result) {
    var pet = _.findWhere(result.pets, { id: petId });
    if (pet) {
      response.send(pet);
    } else {
      response.status(404).send('Not Found');
    }
  });
});

SERVER.get('/pets/:id/populate', function (request, response) {
  var petId = parseInt(request.params.id, 10);

  _api2.default.getData().then(function (result) {
    var pet = _.findWhere(result.pets, { id: petId });

    if (pet) {
      var user = _.findWhere(result.users, { id: pet.userId });
      var extendedPet = _.extend(pet, { user: user });
      response.send(extendedPet);
    } else {
      response.status(404).send('Not Found');
    }
  });
});

// SERVER.get(/^(?:\/(?:[a-z]+)?)+/, (request, response) => {
//   const id = request.url.replace(/\/$/, '').substr(1).split('/');
//   api.getData().then((result) => {
//     let searchResult = (!id[0] && id.length === 1) ? result : searchIn(id, result);
//
//     if (id.length === 1 && id[0] === 'volumes') {
//       const freeSpaces = {};
//       result.hdd.forEach((hdd) => {
//         const searchItem = hdd.volume;
//         let size = 0;
//         result.hdd.forEach((hard) => {
//           if (searchItem === hard.volume) {
//             size += hard.size;
//           }
//         });
//         freeSpaces[searchItem] = `${size}B`;
//       });
//       searchResult = freeSpaces;
//     }
//
//     if (searchResult !== false) {
//       response.json(searchResult);
//     } else {
//       response.status(404).send('Not Found');
//     }
//   });
// });

SERVER.listen(PORT, function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log(CHALK.cyan('Server is up on port: ' + PORT));
    // open("http://localhost:" + PORT);
  }
});