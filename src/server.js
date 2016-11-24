import api from './api/api';

const EXPRESS = require('express');
const CHALK = require('chalk');
const CORS = require('cors');
const _ = require('underscore');


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

SERVER.get('/users/populate', (request, response) => {
  const query = request.query;

  api.getData().then((result) => {
    let filteredUsers = result.users;

    filteredUsers = _.map(filteredUsers, (user) => {
      const id = user.id;
      const pets = _.where(result.pets, { userId: id });
      const extendedUser = _.extend(user, { pets });
      return extendedUser;
    });

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


SERVER.get('/users/:id/populate', (request, response) => {
  const id = parseInt(request.params.id, 10);

  if (isNaN(id)) {
    api.getData().then((result) => {
      const user = _.findWhere(result.users, { username: request.params.id });
      if (user) {
        const pets = _.where(result.pets, { userId: user.id });
        const extendedUser = _.extend(user, { pets });
        response.send(extendedUser);
      } else {
        response.status(404).send('Not Found');
      }
    });
  } else {
    api.getData().then((result) => {
      const user = _.findWhere(result.users, { id });
      if (user) {
        const pets = _.where(result.pets, { userId: user.id });
        const extendedUser = _.extend(user, { pets });
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

SERVER.get('/pets/populate', (request, response) => {
  const query = request.query;

  api.getData().then((result) => {
    let filteredPets = result.pets;
    const users = result.users;

    filteredPets = _.map(filteredPets, (pet) => {
      const id = pet.userId;
      const user = _.findWhere(users, { id });
      const extendedPet = _.extend(pet, { user });
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
      filteredPets = _.filter(filteredPets, pet => pet.age > query.age_gt);
    }

    if (query.hasOwnProperty('age_lt')) {
      filteredPets = _.filter(filteredPets, pet => pet.age < query.age_lt);
    }

    response.send(filteredPets);
  });
});

SERVER.get('/pets/:id', (request, response) => {
  const petId = parseInt(request.params.id, 10);

  api.getData().then((result) => {
    const pet = _.findWhere(result.pets, { id: petId });
    if (pet) {
      response.send(pet);
    } else {
      response.status(404).send('Not Found');
    }
  });
});


SERVER.get('/pets/:id/populate', (request, response) => {
  const petId = parseInt(request.params.id, 10);

  api.getData().then((result) => {
    const pet = _.findWhere(result.pets, { id: petId });

    if (pet) {
      const user = _.findWhere(result.users, { id: pet.userId });
      const extendedPet = _.extend(pet, { user });
      response.send(extendedPet);
    } else {
      response.status(404).send('Not Found');
    }
  });
});


SERVER.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(CHALK.cyan(`Server is up on port: ${PORT}`));
    // open("http://localhost:" + PORT);
  }
});
