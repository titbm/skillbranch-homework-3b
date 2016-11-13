import api from './api/api';

const EXPRESS = require('express');
const CHALK = require('chalk');
const CORS = require('cors');
// var open = require('open');

function searchIn(array, object) {
  let counter = 0;
  function search(arrayInner, objectInner) {
    if (arrayInner[counter] in objectInner) {
      if (objectInner[arrayInner[counter]] instanceof Object) {
        const tempObject = Object.assign({}, objectInner[arrayInner[counter]]);
        if (counter < arrayInner.length - 1) {
          counter += 1;
          return search(arrayInner, tempObject);
        }
      }
      return ((counter === arrayInner.length - 1) ? objectInner[arrayInner[counter]] : false);
    }
    return false;
  }
  return search(array, object);
}


const SERVER = EXPRESS();
const PORT = process.env.PORT || 3000;

SERVER.use(CORS());

SERVER.get(/^(?:\/(?:[a-z]+)?)+/, (request, response) => {
  const id = request.url.replace(/\/$/, '').substr(1).split('/');
  api.getData().then((result) => {
    let searchResult = (!id[0] && id.length === 1) ? result : searchIn(id, result);

    if (id.length === 1 && id[0] === 'volumes') {
      const freeSpaces = {};
      result.hdd.forEach((hdd) => {
        const searchItem = hdd.volume;
        let size = 0;
        result.hdd.forEach((hard) => {
          if (searchItem === hard.volume) {
            size += hard.size;
          }
        });
        freeSpaces[searchItem] = `${size}B`;
      });
      searchResult = freeSpaces;
    }

    if (searchResult !== false) {
      response.json(searchResult);
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
