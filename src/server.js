import api from './api/api';

const EXPRESS = require('express');
const CHALK = require('chalk');
const CORS = require('cors');
const _ = require('underscore');
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


const SERVER = EXPRESS();
const PORT = process.env.PORT || 3000;

SERVER.use(CORS());


SERVER.get ('/', (request, response) => {
  api.getData().then((result) => { response.send(result); });
});


SERVER.get('/users', (request, response) => {
  const query = request.query;

  api.getData().then((result) => {
    let filteredUsers = result.users;

    if (query.hasOwnProperty('havePet')) {
      const filteredPets = _.where(result.pets, { type: query.havePet });
      filteredUsers = _.filter(filteredUsers, (user) => {
        for (let i = 0; i < filteredPets.length; i += 1) {
          if (filteredPets[i].userId === user.id) return user;
        }
      });
    }

    response.send(filteredUsers);
  });
});


SERVER.get('/users/:id', (request, response) => {
  const id = parseInt(request.params.id, 10);

  if (isNaN(id)) {
    api.getData().then((result) => {
      const user = _.findWhere(result.users, { username: request.params.id });
      if (user) {
        response.send(user);
      } else {
        response.status(404).send('Not Found');
      }
    });
  } else {
    api.getData().then((result) => {
      const user = _.findWhere(result.users, { id });
      if (user) {
        response.send(user);
      } else {
        response.status(404).send('Not Found');
      }
    });
  }
});


SERVER.get('/users/:id/pets', (request, response) => {
  const id = parseInt(request.params.id, 10);

  if (isNaN(id)) {
    api.getData().then((result) => {
      const user = _.where(result.users, { username: request.params.id });
      const pets = _.where(result.pets, { userId: user[0].id });
      if (pets) {
        response.send(pets);
      } else {
        response.status(404).send('Not Found');
      }
    });
  } else {
    api.getData().then((result) => {
      const user = _.where(result.users, { id });
      const pets = _.where(result.pets, { userId: user[0].id });
      if (pets) {
        response.send(pets);
      } else {
        response.status(404).send('Not Found');
      }
    });
  }
});


SERVER.get('/pets', (request, response) => {
  const query = request.query;

  api.getData().then((result) => {
    let filteredPets = result.pets;

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
      filteredPets = _.filter(filteredPets, pet => pet.age > query.age_gt);
    }

    if (query.hasOwnProperty('age_lt')) {
      filteredPets = _.filter(filteredPets, pet => pet.age < query.age_lt);
    }

    response.send(filteredPets);
  });
});

SERVER.get('/pets/:id', (request, response) => {
  const petsId = parseInt(request.params.id, 10);
  api.getData().then((result) => {

    const pets = _.where(result.pets, { id: petsId });
    console.log(petsId, pets);
    if (pets && pets.length === 1) {
      response.send(pets[0]);
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

SERVER.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(CHALK.cyan(`Server is up on port: ${PORT}`));
    // open("http://localhost:" + PORT);
  }
});
