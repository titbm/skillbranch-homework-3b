import axios from 'axios';

const URL_TO_GET_DATA = 'https://gist.githubusercontent.com/isuvorov/55f38b82ce263836dadc0503845db4da/raw/pets.json';

const api = {
  getData() {
    return axios.get(URL_TO_GET_DATA)
      .then(response => response.data)
      .catch((error) => { throw new Error(error); });
  },
};

export default api;
